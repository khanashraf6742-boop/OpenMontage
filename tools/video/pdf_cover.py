"""PDF -> video cover, processed in resumable batches.

This tool turns a document (typically a brand / style guide) into a short
branded "cover" video — the kind of looping hero clip you put at the top of a
deck, a landing page, or a video thumbnail slot.

It is deliberately built around **bounded batches** so a large PDF never
overloads the machine:

1. **Ingest** — accept a local path or a public URL; download to the work dir.
2. **Batch rasterize** — render page thumbnails in fixed-size page batches
   (``--batch-size``). Each batch opens the document, renders only its own
   pages, and closes it again, so resident memory is bounded by the batch size
   rather than the page count. A checkpoint file is atomically updated after
   every batch, so an interrupted run resumes instead of restarting.
   ``--max-batches`` caps how many batches a single invocation may process,
   which lets a caller drive a huge PDF across several invocations.
3. **Style extract** — aggregate text + colour evidence from every rendered
   page into a brand style spec (palette, background/text colours, mood).
4. **Cover render** — compose a short video from that style plus a montage of
   the sampled pages, then encode with FFmpeg.

Everything runs locally with no API keys. Heavy third-party imports are lazy so
that registry auto-discovery keeps working on machines without PyMuPDF.
"""

from __future__ import annotations

import argparse
import contextlib
import gc
import hashlib
import json
import logging
import math
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Optional

from tools.base_tool import (
    BaseTool,
    Determinism,
    ExecutionMode,
    ResourceProfile,
    ResumeSupport,
    ToolResult,
    ToolStability,
    ToolTier,
)

log = logging.getLogger(__name__)

CHECKPOINT_NAME = "pdf_cover_state.json"
STYLE_NAME = "visual-style.yaml"


# ---------------------------------------------------------------------------
# Small utilities
# ---------------------------------------------------------------------------


def _resolve_ffmpeg(explicit: Optional[str] = None) -> Optional[str]:
    """Find an FFmpeg binary: explicit path, PATH, then the imageio-ffmpeg wheel.

    Many sandboxes ship no system FFmpeg, so falling back to the static binary
    bundled in the ``imageio-ffmpeg`` wheel keeps this tool usable there.
    """
    if explicit:
        return explicit if Path(explicit).exists() or shutil.which(explicit) else None
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:
        import imageio_ffmpeg  # lazy: optional dependency

        exe = imageio_ffmpeg.get_ffmpeg_exe()
        return exe if exe and Path(exe).exists() else None
    except Exception:  # pragma: no cover - wheel simply not installed
        return None


def _sha256_file(path: Path, chunk: int = 1 << 20) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        while True:
            block = handle.read(chunk)
            if not block:
                break
            digest.update(block)
    return digest.hexdigest()


def _atomic_write_json(path: Path, payload: Any) -> None:
    """Write JSON via temp-file + os.replace so a crash never truncates state."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
    os.replace(tmp, path)


def _hex(rgb: tuple[int, int, int]) -> str:
    return "#{:02X}{:02X}{:02X}".format(*(int(round(c)) for c in rgb[:3]))


def _relative_luminance(rgb: tuple[float, float, float]) -> float:
    def channel(value: float) -> float:
        c = value / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = rgb[:3]
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def _contrast_ratio(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    la, lb = _relative_luminance(a), _relative_luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def _color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    """Cheap perceptual-ish distance in RGB (good enough for palette de-duping)."""
    rmean = (a[0] + b[0]) / 2.0
    dr, dg, db = a[0] - b[0], a[1] - b[1], a[2] - b[2]
    return math.sqrt(
        (2 + rmean / 256.0) * dr * dr + 4 * dg * dg + (2 + (255 - rmean) / 256.0) * db * db
    )


def _mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))  # type: ignore[return-value]


def _shade(rgb: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    """Darken (amount<0) or lighten (amount>0) a colour."""
    target = (0, 0, 0) if amount < 0 else (255, 255, 255)
    return _mix(rgb, target, abs(amount))


def _download(url: str, dest: Path, timeout: int = 120) -> Path:
    import requests  # lazy

    dest.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=timeout) as response:
        response.raise_for_status()
        with dest.open("wb") as handle:
            for chunk in response.iter_content(chunk_size=1 << 20):
                if chunk:
                    handle.write(chunk)
    return dest


# ---------------------------------------------------------------------------
# Batching + checkpointing
# ---------------------------------------------------------------------------


def _batch_plan(page_count: int, batch_size: int) -> list[list[int]]:
    """Split page indices into contiguous batches of at most ``batch_size``."""
    if page_count <= 0:
        return []
    size = max(1, int(batch_size))
    return [list(range(start, min(start + size, page_count))) for start in range(0, page_count, size)]


def _load_checkpoint(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        with path.open(encoding="utf-8") as handle:
            data = json.load(handle)
        return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, OSError):
        # A corrupt checkpoint must never wedge the run — start over instead.
        log.warning("checkpoint at %s was unreadable; starting fresh", path)
        return {}


# ---------------------------------------------------------------------------
# Colour analysis
# ---------------------------------------------------------------------------


def _palette_from_image(img: Any, colors: int = 6) -> list[tuple[tuple[int, int, int], int]]:
    """Return up to ``colors`` (rgb, pixel_count) pairs for one page thumbnail."""
    from PIL import Image  # lazy

    small = img.convert("RGB").resize((128, 128))
    quantized = small.quantize(colors=max(2, colors), method=Image.MEDIANCUT)
    palette = quantized.getpalette() or []
    counts = sorted(quantized.getcolors(), key=lambda pair: -pair[0])
    out: list[tuple[tuple[int, int, int], int]] = []
    for count, index in counts:
        base = index * 3
        if base + 2 >= len(palette):
            continue
        rgb = (palette[base], palette[base + 1], palette[base + 2])
        out.append((rgb, count))
    return out


def _merge_palettes(
    page_palettes: list[list[tuple[tuple[int, int, int], int]]],
    threshold: float = 26.0,
) -> list[tuple[tuple[int, int, int], int]]:
    """Merge per-page palettes into one weighted, de-duplicated palette."""
    merged: list[tuple[tuple[int, int, int], int]] = []
    for palette in page_palettes:
        for rgb, count in palette:
            for i, (existing, existing_count) in enumerate(merged):
                if _color_distance(rgb, existing) < threshold:
                    merged[i] = (
                        _mix(existing, rgb, count / (existing_count + count)),
                        existing_count + count,
                    )
                    break
            else:
                merged.append((rgb, count))
    return merged


def _boost_saturation(rgb: tuple[int, int, int], factor: float = 1.6) -> tuple[int, int, int]:
    """Push a colour away from its own grey, recovering brand punch.

    Median-cut palettes routinely report a brand red as a muddy red-white
    blend because the colour shares its cluster with anti-aliased edges. This
    restores the saturated core without inventing a new hue.
    """
    gray = sum(rgb[:3]) / 3.0
    return tuple(  # type: ignore[return-value]
        int(max(0, min(255, round(gray + (c - gray) * factor)))) for c in rgb[:3]
    )


def _saturation(rgb: tuple[int, int, int]) -> float:
    mx, mn = max(rgb[:3]), min(rgb[:3])
    return 0.0 if mx == 0 else (mx - mn) / mx


def _pick_background(flat: list[tuple[tuple[int, int, int], int]]) -> tuple[int, int, int]:
    """Pick the page field colour: the dominant near-white or near-black."""
    total = sum(count for _, count in flat) or 1

    def field_score(entry: tuple[tuple[int, int, int], int]) -> float:
        rgb, count = entry
        luminance = _relative_luminance(rgb)
        # A page field is almost always near-white or near-black; strongly
        # prefer those so a saturated brand stripe never wins "background".
        is_field = 1.0 if (luminance > 0.80 or luminance < 0.10) else 0.0
        return (count / total) * (1.0 + 4.0 * is_field)

    if not flat:
        return (249, 250, 251)
    return max(flat, key=field_score)[0]


def _aggregate_palette(
    page_palettes: list[list[tuple[tuple[int, int, int], int]]],
    max_colors: int = 6,
) -> list[tuple[tuple[int, int, int], int]]:
    """Merge per-page palettes, de-duping perceptually close colours."""
    merged = _merge_palettes(page_palettes)
    total = sum(count for _, count in merged) or 1

    def score(entry: tuple[tuple[int, int, int], int]) -> float:
        rgb, count = entry
        mx, mn = max(rgb), min(rgb)
        saturation = 0.0 if mx == 0 else (mx - mn) / mx
        coverage = count / total
        return coverage * (1.0 + 2.2 * saturation)

    merged.sort(key=score, reverse=True)
    return merged[:max_colors]


# ---------------------------------------------------------------------------
# Style extraction
# ---------------------------------------------------------------------------


def _first_meaningful_line(text: str) -> str:
    for raw in (text or "").splitlines():
        line = raw.strip()
        if len(line) >= 3 and any(ch.isalnum() for ch in line):
            return line
    return ""


def _extract_style(
    *,
    title_hint: str,
    page_texts: list[str],
    page_palettes: list[list[tuple[tuple[int, int, int], int]]],
    source_name: str,
) -> dict[str, Any]:
    """Build a brand style spec from aggregated PDF evidence."""
    flat = _merge_palettes(page_palettes, threshold=18.0)
    background = _pick_background(flat)

    # Brand colours are the saturated, high-coverage colours that are NOT the
    # page field. Scoring coverage x saturation keeps a big pale background
    # from masquerading as the primary brand colour.
    content = [(rgb, count) for rgb, count in flat if _color_distance(rgb, background) > 30.0]
    if not content:
        content = list(flat)

    total = sum(count for _, count in content) or 1

    def brand_score(entry: tuple[tuple[int, int, int], int]) -> float:
        rgb, count = entry
        mx, mn = max(rgb), min(rgb)
        saturation = 0.0 if mx == 0 else (mx - mn) / mx
        return (count / total) * (1.0 + 3.0 * saturation)

    content.sort(key=brand_score, reverse=True)

    if content:
        ranked = [rgb for rgb, _ in content]
        primary = _boost_saturation(ranked[0])
        # Accent: a genuinely distinct second brand colour. Rank by
        # saturation x legibility-on-background so a muddy near-duplicate of
        # the primary never wins over a clean signal colour.
        accent_candidates = [
            c for c in ranked if _color_distance(c, primary) > 45.0 and _contrast_ratio(c, background) >= 2.0
        ]
        if accent_candidates:
            accent = _boost_saturation(
                max(
                    accent_candidates,
                    key=lambda c: _saturation(c) * min(_contrast_ratio(c, background), 8.0),
                )
            )
        else:
            accent = _boost_saturation(_shade(primary, -0.5), 1.3)
        neutral = next(
            (c for c in ranked[1:] if _contrast_ratio(c, background) >= 4.0),
            _mix(background, (17, 24, 39), 0.65),
        )
    else:  # pragma: no cover - blank / image-only document
        primary, accent, neutral = (17, 24, 39), (37, 99, 235), (107, 114, 128)
        ranked = [primary]

    text_color = (17, 24, 39) if _relative_luminance(background) > 0.4 else (245, 247, 250)

    keywords: list[str] = []
    for text in page_texts:
        for token in (text or "").lower().replace("\n", " ").split():
            word = token.strip(".,;:()[]{}\"'“”‘’/\\|_-—–")
            if len(word) >= 6 and word.isalpha() and word not in keywords:
                keywords.append(word)
            if len(keywords) >= 12:
                break
        if len(keywords) >= 12:
            break

    title = title_hint or (_first_meaningful_line(page_texts[0]) if page_texts else "") or "Untitled Document"

    return {
        "identity": {
            "name": f"{title} Cover Style",
            "category": "extracted-from-pdf",
            "mood": ", ".join(keywords[:6]) or "branded, editorial",
            "pace": "measured",
            "best_for": "Document / brand-guide cover videos",
        },
        "visual_language": {
            "color_palette": {
                "primary": [_hex(_boost_saturation(c)) for c in ranked[:3]],
                "accent": [_hex(accent)],
                "neutral": [_hex(neutral)],
                "background": _hex(background),
                "text": _hex(text_color),
                "muted": _hex(_mix(text_color, background, 0.45)),
            },
            "composition": "Centred title field over a page montage, generous margins, one focal claim per frame.",
            "texture": "Flat brand fields sampled from the source document.",
        },
        "typography": {
            "headings": {"font": "DejaVu Sans", "weight": 700, "tracking": "-0.01em"},
            "body": {"font": "DejaVu Sans", "weight": 400, "line_height": 1.5},
        },
        "motion": {
            "transitions": ["fade", "cross-fade"],
            "animation_style": "Slow, restrained drift; no bounce.",
            "pacing_rules": {
                "title_hold_seconds": 2.0,
                "montage_hold_seconds": 1.8,
                "transition_duration_seconds": 0.6,
            },
        },
        "provenance": {
            "source_document": source_name,
            "pages_sampled": len(page_texts),
            "extracted_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        },
    }


# ---------------------------------------------------------------------------
# Frame composition
# ---------------------------------------------------------------------------


def _font(size: int, bold: bool = False) -> Any:
    from PIL import ImageFont  # lazy

    candidates = (
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
        if bold
        else ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    )
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except OSError:  # pragma: no cover
                pass
    return ImageFont.load_default(size=size)


def _wrap(text: str, font: Any, max_width: int) -> list[str]:
    words, lines, current = text.split(), [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if font.getlength(trial) <= max_width or not current:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def _draw_text_block(
    draw: Any,
    text: str,
    font: Any,
    color: tuple[int, int, int],
    center_x: int,
    top: int,
    max_width: int,
    line_spacing: float = 1.3,
    shadow: bool = True,
) -> int:
    lines = _wrap(text, font, max_width)
    line_height = int(font.size * line_spacing)
    y = top
    for line in lines:
        width = font.getlength(line)
        x = center_x - width / 2
        if shadow:
            draw.text((x + 3, y + 3), line, font=font, fill=_shade(color, -0.75))
        draw.text((x, y), line, font=font, fill=color)
        y += line_height
    return y


def _ease(t: float) -> float:
    return 0.0 if t <= 0 else 1.0 if t >= 1 else t * t * (3 - 2 * t)


def _render_cover_frames(
    frames_dir: Path,
    *,
    width: int,
    height: int,
    fps: int,
    duration: float,
    title: str,
    subtitle: str,
    background: tuple[int, int, int],
    accent: tuple[int, int, int],
    text_color: tuple[int, int, int],
    page_images: list[Any],
) -> int:
    """Render every cover frame as a PNG. Returns the frame count."""
    from PIL import Image, ImageDraw  # lazy

    frames_dir.mkdir(parents=True, exist_ok=True)
    total_frames = max(1, int(round(duration * fps)))

    grad_top = _shade(background, -0.12)
    grad_bottom = _shade(background, 0.06)

    title_font = _font(max(28, int(height * 0.075)), bold=True)
    sub_font = _font(max(18, int(height * 0.034)))
    brand_font = _font(max(14, int(height * 0.026)), bold=True)

    # Pre-scale page art once at high resolution so per-frame work stays cheap.
    montage_art: list[Any] = []
    for image in page_images[:6]:
        if image is None:
            continue
        scale = max(width, height) / max(1, min(image.size))
        art = image.convert("RGB").resize(
            (max(1, int(image.size[0] * scale)), max(1, int(image.size[1] * scale))),
            Image.LANCZOS,
        )
        montage_art.append(art)
    if not montage_art:
        montage_art = [Image.new("RGB", (width, height), _shade(background, -0.08))]

    # Timeline: title holds, then the montage takes whatever time is left.
    # Cap the montage page count so each page gets a readable beat even on
    # short covers, instead of flicking through six pages in two seconds.
    montage_start = min(4.0, max(2.0, duration * 0.35))
    montage_span = max(0.5, duration - montage_start)
    max_pages = max(2, int(montage_span / 1.1))
    montage_art = montage_art[:max_pages]
    hold = max(0.6, montage_span / max(1, len(montage_art)))
    # Keep transitions short so each page actually holds at full opacity
    # instead of spending most of its beat half-dissolved.
    fade = min(0.35, hold * 0.18)

    for frame_index in range(total_frames):
        t = frame_index / fps

        frame = Image.new("RGB", (width, height))
        # Vertical gradient built once per frame (cheap: 1-pixel column resize).
        column = Image.new("RGB", (1, height))
        column.putdata([_mix(grad_top, grad_bottom, y / max(1, height - 1)) for y in range(height)])
        frame.paste(column.resize((width, height)), (0, 0))

        draw = ImageDraw.Draw(frame, "RGBA")

        # Accent hairline frame.
        draw.rectangle([8, 8, width - 9, height - 9], outline=_mix(accent, background, 0.35), width=3)

        # --- Title block ---
        # Fades out again as the montage takes over, so type never sits
        # unreadably on top of page imagery.
        title_alpha = _ease((t - 0.25) / 1.0) * _ease((montage_start - t) / 0.7)
        if title_alpha > 0.01:
            title_top = int(height * 0.30 + (1 - title_alpha) * height * 0.06)
            lines = _wrap(title, title_font, int(width * 0.76))
            block_height = len(lines) * int(title_font.size * 1.25)
            title_top -= block_height // 2
            # Accent rule above the title.
            rule_w = int(width * 0.18 * title_alpha)
            if rule_w > 2:
                draw.rectangle(
                    [width // 2 - rule_w // 2, title_top - int(height * 0.055),
                     width // 2 + rule_w // 2, title_top - int(height * 0.055) + 6],
                    fill=_mix(accent, background, 1 - title_alpha),
                )
            _draw_text_block(
                draw, title, title_font,
                _mix(text_color, background, 1 - title_alpha),
                width // 2, title_top, int(width * 0.76),
            )

        sub_alpha = _ease((t - 1.5) / 0.9) * _ease((montage_start - t) / 0.7)
        if sub_alpha > 0.01 and subtitle:
            _draw_text_block(
                draw, subtitle, sub_font,
                _mix(text_color, background, 1 - sub_alpha),
                width // 2, int(height * 0.60), int(width * 0.62),
                line_spacing=1.35,
                shadow=False,
            )

        # --- Page montage (starts after the title settles) ---
        if t >= montage_start:
            mt = t - montage_start
            slot = int(mt // hold)
            local = mt - slot * hold
            if slot < len(montage_art):
                art = montage_art[slot]
                # Ken Burns: slow drift + zoom.
                zoom = 1.06 + 0.10 * _ease(local / hold)
                aw, ah = art.size
                crop_w = int(min(aw, width * zoom))
                crop_h = int(min(ah, height * zoom))
                left = int((aw - crop_w) / 2 + (aw - crop_w) * 0.5 * _ease(local / hold) * 0.35)
                top = int((ah - crop_h) / 2)
                cropped = art.crop((left, top, left + crop_w, top + crop_h)).resize((width, height), Image.LANCZOS)
                cropped = cropped.point(lambda v: int(v * 0.82))  # dim slightly so type stays legible
                # Cross-fade in and out of the montage slot.
                fade_in = _ease(min(1.0, local / fade))
                fade_out = _ease(min(1.0, max(0.0, (hold - local) / fade)))
                alpha = max(0.0, min(fade_in, fade_out))
                if alpha > 0:
                    frame.paste(cropped, (0, 0), Image.new("L", (width, height), int(255 * alpha)))
                draw = ImageDraw.Draw(frame, "RGBA")
                # Re-stamp the hairline over the montage.
                draw.rectangle([8, 8, width - 9, height - 9], outline=_mix(accent, background, 0.35), width=3)

        # --- Persistent brand chip ---
        chip_text = title[:28]
        chip_w = int(brand_font.getlength(chip_text)) + 44
        chip_h = int(brand_font.size * 2.1)
        chip_x, chip_y = width // 2 - chip_w // 2, height - chip_h - int(height * 0.075)
        chip_alpha = _ease((t - 0.1) / 0.8)
        if chip_alpha > 0:
            draw.rounded_rectangle(
                [chip_x, chip_y, chip_x + chip_w, chip_y + chip_h],
                radius=chip_h // 2,
                fill=_mix(accent, background, 0.35 - 0.35 * chip_alpha),
                outline=_mix(accent, (255, 255, 255), 0.4),
                width=2,
            )
            draw.text(
                (chip_x + 22, chip_y + (chip_h - brand_font.size) / 2 - 2),
                chip_text, font=brand_font,
                fill=_mix((255, 255, 255), background, 1 - chip_alpha),
            )

        frame.save(frames_dir / f"frame_{frame_index:05d}.png", compress_level=1)
        del frame, draw

        if frame_index % 30 == 0:
            gc.collect()

    return total_frames


# ---------------------------------------------------------------------------
# FFmpeg encode
# ---------------------------------------------------------------------------


def _encode_frames(
    ffmpeg: str,
    frames_dir: Path,
    output_path: Path,
    *,
    fps: int,
    crf: int = 20,
    preset: str = "medium",
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    pattern = str(frames_dir / "frame_%05d.png")
    cmd = [
        ffmpeg, "-y",
        "-framerate", str(fps),
        "-i", pattern,
        "-c:v", "libx264",
        "-preset", preset,
        "-crf", str(crf),
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        str(output_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg failed ({result.returncode}): {(result.stderr or '')[-2000:]}")


# ---------------------------------------------------------------------------
# Tool
# ---------------------------------------------------------------------------


class PdfCover(BaseTool):
    """Convert a PDF (brand/style guide) into a short branded cover video."""

    name = "pdf_cover"
    version = "0.1.0"
    tier = ToolTier.CORE
    capability = "video_cover"
    provider = "local"
    stability = ToolStability.EXPERIMENTAL
    execution_mode = ExecutionMode.SYNC
    determinism = Determinism.DETERMINISTIC
    resume_support = ResumeSupport.FROM_CHECKPOINT

    dependencies = ["python:pymupdf", "python:PIL", "cmd:ffmpeg"]
    install_instructions = (
        "pip install pymupdf pillow imageio-ffmpeg requests pyyaml\n"
        "(imageio-ffmpeg bundles a static FFmpeg binary, so no system FFmpeg is required)"
    )
    agent_skills = ["ffmpeg", "video-toolkit", "visual-style"]

    capabilities = ["convert_pdf_to_video_cover"]
    best_for = ["Brand/style guide cover videos", "Document hero clips", "Deck and landing-page covers"]
    not_good_for = ["Long-form video editing", "Narration-driven documentaries"]

    input_schema = {
        "type": "object",
        "required": ["pdf_source"],
        "properties": {
            "pdf_source": {
                "type": "string",
                "description": "Local path or public URL of the source PDF.",
            },
            "output_path": {
                "type": "string",
                "description": "Where to write the cover .mp4.",
            },
            "work_dir": {
                "type": "string",
                "description": "Scratch directory for batches, checkpoint, frames.",
            },
            "batch_size": {
                "type": "integer",
                "default": 4,
                "description": "Pages rendered per batch. Lower = less memory pressure.",
            },
            "max_batches": {
                "type": "integer",
                "default": 0,
                "description": "Cap on batches per invocation (0 = no cap). Re-run to continue.",
            },
            "batch_pause_seconds": {
                "type": "number",
                "default": 0.5,
                "description": "Pause between batches to avoid overload.",
            },
            "duration": {
                "type": "number",
                "default": 12.0,
                "description": "Cover length in seconds.",
            },
            "fps": {"type": "integer", "default": 30},
            "width": {"type": "integer", "default": 1920},
            "height": {"type": "integer", "default": 1080},
            "thumbnail_width": {
                "type": "integer",
                "default": 640,
                "description": "Width of stored page thumbnails.",
            },
            "dpi": {
                "type": "integer",
                "default": 110,
                "description": "Rasterization DPI for page thumbnails.",
            },
            "title": {"type": "string", "default": "", "description": "Override the cover title."},
            "subtitle": {"type": "string", "default": "", "description": "Cover subtitle."},
            "ffmpeg_path": {"type": "string", "default": ""},
            "keep_frames": {"type": "boolean", "default": False},
        },
    }

    resource_profile = ResourceProfile(cpu_cores=2, ram_mb=2048, disk_mb=2000, network_required=False)
    idempotency_key_fields = ["pdf_source", "duration", "fps", "width", "height"]
    side_effects = [
        "downloads the PDF if a URL is given",
        "writes page thumbnails and a checkpoint under work_dir",
        "writes the cover .mp4 to output_path",
    ]
    user_visible_verification = [
        "Play the output and confirm the title/subtitle are legible",
        "Confirm the page montage matches the source document",
        "Confirm the palette matches the brand colours in the PDF",
    ]

    # -- main entrypoint ---------------------------------------------------

    def check_dependencies(self) -> None:
        """FFmpeg may live on PATH *or* in the imageio-ffmpeg wheel.

        The base class only looks on PATH, which would report this tool as
        unavailable on machines that have no system FFmpeg even though the
        bundled static binary works fine. Resolve FFmpeg ourselves and let
        the base class validate only the Python modules.
        """
        from tools.base_tool import DependencyError  # local import: avoids a cycle

        if not _resolve_ffmpeg():
            raise DependencyError(
                "No FFmpeg binary found on PATH or in the imageio-ffmpeg wheel. "
                + self.install_instructions
            )
        saved = self.dependencies
        try:
            # Drop the PATH-only ffmpeg probe; it was already resolved above.
            self.dependencies = [d for d in saved if not d.startswith(("cmd:", "binary:"))]
            super().check_dependencies()
        finally:
            self.dependencies = saved

    def execute(self, inputs: dict[str, Any]) -> ToolResult:
        started = time.time()
        pdf_source = str(inputs["pdf_source"])
        work_dir = Path(inputs.get("work_dir") or "output/pdf-cover").resolve()
        output_path = Path(inputs.get("output_path") or (work_dir / "cover.mp4")).resolve()

        batch_size = max(1, int(inputs.get("batch_size", 4)))
        max_batches = int(inputs.get("max_batches", 0) or 0)
        batch_pause = max(0.0, float(inputs.get("batch_pause_seconds", 0.5)))
        duration = float(inputs.get("duration", 12.0))
        fps = max(1, int(inputs.get("fps", 30)))
        width = max(16, int(inputs.get("width", 1920)))
        height = max(16, int(inputs.get("height", 1080)))
        thumb_w = max(80, int(inputs.get("thumbnail_width", 640)))
        dpi = max(36, int(inputs.get("dpi", 110)))
        keep_frames = bool(inputs.get("keep_frames", False))

        ffmpeg = _resolve_ffmpeg(inputs.get("ffmpeg_path") or None)
        if not ffmpeg:
            return ToolResult(success=False, error="No FFmpeg binary found. " + self.install_instructions)

        try:
            import pymupdf  # lazy
            from PIL import Image  # lazy
        except ImportError as exc:
            return ToolResult(success=False, error=f"Missing dependency: {exc}. {self.install_instructions}")

        pages_dir = work_dir / "pages"
        frames_dir = work_dir / "frames"
        pages_dir.mkdir(parents=True, exist_ok=True)
        checkpoint_path = work_dir / CHECKPOINT_NAME

        # ---- 1. Ingest ---------------------------------------------------
        local_pdf = work_dir / "source.pdf"
        if pdf_source.startswith(("http://", "https://")):
            if not local_pdf.exists():
                try:
                    _download(pdf_source, local_pdf)
                except Exception as exc:
                    return ToolResult(success=False, error=f"Download failed for {pdf_source}: {exc}")
            source_name = Path(pdf_source).name or "remote.pdf"
        else:
            src = Path(pdf_source).expanduser()
            if not src.exists():
                return ToolResult(success=False, error=f"PDF not found: {pdf_source}")
            local_pdf = src.resolve()
            source_name = src.name

        try:
            pdf_hash = _sha256_file(local_pdf)
        except OSError as exc:
            return ToolResult(success=False, error=f"Cannot read PDF: {exc}")

        try:
            doc = pymupdf.open(local_pdf)
        except Exception as exc:
            return ToolResult(success=False, error=f"Cannot open PDF: {exc}")

        with doc:
            page_count = doc.page_count
            if page_count == 0:
                return ToolResult(success=False, error="PDF has no pages")
            metadata_title = (doc.metadata or {}).get("title") or ""

        # ---- 2. Batched, resumable rasterization -------------------------
        checkpoint = _load_checkpoint(checkpoint_path)
        if checkpoint.get("pdf_sha256") != pdf_hash:
            checkpoint = {"pdf_sha256": pdf_hash, "page_count": page_count, "batches": {}}

        plan = _batch_plan(page_count, batch_size)
        batches_state: dict[str, Any] = checkpoint.setdefault("batches", {})
        processed_batches = 0
        skipped_batches = 0

        for batch_index, pages in enumerate(plan):
            key = str(batch_index)
            entry = batches_state.get(key, {})
            if entry.get("status") == "done" and all(
                (pages_dir / f"page_{i:05d}.jpg").exists() for i in entry.get("pages", pages)
            ):
                skipped_batches += 1
                continue

            if max_batches and processed_batches >= max_batches:
                break

            batch_started = time.time()
            written: list[str] = []
            texts: list[str] = []
            # Open/close per batch keeps resident memory bounded by batch size.
            with pymupdf.open(local_pdf) as batch_doc:
                for page_no in pages:
                    page = batch_doc[page_no]
                    try:
                        texts.append(page.get_text() or "")
                        pix = page.get_pixmap(dpi=dpi)
                    finally:
                        page = None  # release the page before the next one
                    from PIL import Image as _Image  # lazy

                    image = _Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
                    pix = None
                    if image.size[0] > thumb_w:
                        image = image.resize(
                            (thumb_w, max(1, int(image.size[1] * thumb_w / image.size[0]))),
                            _Image.LANCZOS,
                        )
                    target = pages_dir / f"page_{page_no:05d}.jpg"
                    image.save(target, "JPEG", quality=82, optimize=True)
                    written.append(target.name)
                    image.close()

            batches_state[key] = {
                "status": "done",
                "pages": list(pages),
                "files": written,
                "seconds": round(time.time() - batch_started, 3),
            }
            checkpoint["page_count"] = page_count
            _atomic_write_json(checkpoint_path, checkpoint)
            processed_batches += 1
            gc.collect()

            if batch_pause and batch_index < len(plan) - 1 and not (max_batches and processed_batches >= max_batches):
                time.sleep(batch_pause)

        done_batches = [k for k, v in batches_state.items() if v.get("status") == "done"]
        complete = len(done_batches) == len(plan)

        if not complete:
            remaining = len(plan) - len(done_batches)
            return ToolResult(
                success=True,
                data={
                    "status": "partial",
                    "batches_total": len(plan),
                    "batches_done": len(done_batches),
                    "batches_remaining": remaining,
                    "batches_this_run": processed_batches,
                    "batches_skipped_resumed": skipped_batches,
                    "next_step": f"Re-run to continue ({remaining} batch(es) left)",
                    "checkpoint": str(checkpoint_path),
                },
                duration_seconds=round(time.time() - started, 2),
            )

        # ---- 3. Style extraction -----------------------------------------
        seen: set[int] = set()
        page_numbers: list[int] = []
        for batch in batches_state.values():
            for name in batch.get("files", []):
                try:
                    page_no = int(Path(name).stem.split("_")[1])
                except (IndexError, ValueError):
                    continue
                if page_no not in seen:
                    seen.add(page_no)
                    page_numbers.append(page_no)
        page_numbers.sort()

        page_images: list[Any] = []
        page_texts: list[str] = []
        page_palettes: list[list[tuple[tuple[int, int, int], int]]] = []
        with pymupdf.open(local_pdf) as text_doc:
            for page_no in page_numbers:
                jpg = pages_dir / f"page_{page_no:05d}.jpg"
                if not jpg.exists():
                    continue
                try:
                    page_images.append(Image.open(jpg))
                except Exception:
                    continue
                page_texts.append(text_doc[page_no].get_text() or "")
                page_palettes.append(_palette_from_image(page_images[-1]))

        style = _extract_style(
            title_hint=str(inputs.get("title") or metadata_title or ""),
            page_texts=page_texts,
            page_palettes=page_palettes,
            source_name=source_name,
        )
        style_path = work_dir / STYLE_NAME
        try:
            import yaml  # lazy

            style_path.write_text(yaml.safe_dump(style, sort_keys=False, allow_unicode=True), encoding="utf-8")
        except ImportError:  # pragma: no cover
            style_path.write_text(json.dumps(style, indent=2), encoding="utf-8")

        palette = style["visual_language"]["color_palette"]

        def to_rgb(value: str) -> tuple[int, int, int]:
            value = value.lstrip("#")
            return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]

        # ---- 4. Cover render ---------------------------------------------
        for stale in frames_dir.glob("frame_*.png"):
            stale.unlink()
        frames_dir.mkdir(parents=True, exist_ok=True)

        title = str(inputs.get("title") or metadata_title or style["identity"]["name"])
        subtitle = str(
            inputs.get("subtitle")
            or _first_meaningful_line(page_texts[0] if page_texts else "")
            or "Brand & Style Guide"
        )

        frame_count = _render_cover_frames(
            frames_dir,
            width=width,
            height=height,
            fps=fps,
            duration=duration,
            title=title,
            subtitle=subtitle,
            background=to_rgb(palette["background"]),
            accent=to_rgb(palette["accent"][0]),
            text_color=to_rgb(palette["text"]),
            page_images=page_images,
        )

        try:
            _encode_frames(ffmpeg, frames_dir, output_path, fps=fps)
        except Exception as exc:
            return ToolResult(success=False, error=f"Encoding failed: {exc}")

        for image in page_images:
            with contextlib.suppress(Exception):
                image.close()

        if not keep_frames:
            for stale in frames_dir.glob("frame_*.png"):
                stale.unlink()
            with contextlib.suppress(OSError):
                frames_dir.rmdir()

        if not output_path.exists():
            return ToolResult(success=False, error="Cover video was not produced")

        return ToolResult(
            success=True,
            data={
                "status": "complete",
                "output": str(output_path),
                "style_spec": str(style_path),
                "checkpoint": str(checkpoint_path),
                "source": source_name,
                "page_count": page_count,
                "batches_total": len(plan),
                "batch_size": batch_size,
                "batches_skipped_resumed": skipped_batches,
                "frames": frame_count,
                "resolution": f"{width}x{height}",
                "fps": fps,
                "duration_seconds": duration,
                "palette": palette,
            },
            artifacts=[str(output_path), str(style_path)],
            duration_seconds=round(time.time() - started, 2),
        )


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Convert a PDF into a short branded cover video, in resumable batches.",
    )
    parser.add_argument("pdf", help="Local path or public URL of the PDF")
    parser.add_argument("-o", "--output", default=None, help="Output .mp4 path")
    parser.add_argument("-w", "--work-dir", default="output/pdf-cover", help="Scratch/checkpoint dir")
    parser.add_argument("--batch-size", type=int, default=4, help="Pages per batch (default 4)")
    parser.add_argument(
        "--max-batches", type=int, default=0,
        help="Max batches this run (0 = all). Re-run to continue where it left off.",
    )
    parser.add_argument("--batch-pause", type=float, default=0.5, help="Seconds between batches")
    parser.add_argument("--duration", type=float, default=12.0, help="Cover length in seconds")
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--width", type=int, default=1920)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--title", default="", help="Override cover title")
    parser.add_argument("--subtitle", default="", help="Cover subtitle")
    parser.add_argument("--thumbnail-width", type=int, default=640)
    parser.add_argument("--dpi", type=int, default=110)
    parser.add_argument("--ffmpeg", default="", help="Explicit FFmpeg binary path")
    parser.add_argument("--keep-frames", action="store_true", help="Keep rendered PNG frames")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(levelname)s %(message)s")

    tool = PdfCover()
    inputs: dict[str, Any] = {
        "pdf_source": args.pdf,
        "batch_size": args.batch_size,
        "max_batches": args.max_batches,
        "batch_pause_seconds": args.batch_pause,
        "duration": args.duration,
        "fps": args.fps,
        "width": args.width,
        "height": args.height,
        "thumbnail_width": args.thumbnail_width,
        "dpi": args.dpi,
        "keep_frames": args.keep_frames,
        "work_dir": args.work_dir,
    }
    if args.output:
        inputs["output_path"] = args.output
    if args.title:
        inputs["title"] = args.title
    if args.subtitle:
        inputs["subtitle"] = args.subtitle
    if args.ffmpeg:
        inputs["ffmpeg_path"] = args.ffmpeg

    result = tool.execute(inputs)
    if not result.success:
        print(f"ERROR: {result.error}", file=sys.stderr)
        return 1
    for key, value in result.data.items():
        print(f"{key}: {value}")
    if result.error:
        print(f"note: {result.error}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
