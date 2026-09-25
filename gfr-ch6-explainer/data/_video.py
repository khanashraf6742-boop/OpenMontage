#!/usr/bin/env python3
"""Render the GFR Chapter 6 narration to an MP4.

Reads data/_segments.json (written by `node data/_segments.js`), renders one
slide per segment with ImageMagick, then assembles video and audio with ffmpeg.

    python3 data/_video.py                 # full 65-minute render
    python3 data/_video.py --limit 3       # first 3 segments only (quick test)
    python3 data/_video.py --out x.mp4 --width 1280 --fps 5

Requires:
    ffmpeg with libx264  (imageio-ffmpeg ships a static build:
                          pip install imageio-ffmpeg)
    ImageMagick `convert`
    DejaVuSans / DejaVuSans-Bold

Each clip is MPEG-2 Layer III, 64 kbps, 24 kHz mono, so its duration is exactly
(bytes - 45) / 4000. The slide durations come from that, so a caption can never
run ahead of the audio.
"""

import argparse
import json
import textwrap
import math
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
DELIVERABLE = os.path.abspath(os.path.join(HERE, ".."))
SEGMENTS = os.path.join(DELIVERABLE, "data", "_segments.json")

CHAR_W = 0.61   # px per char per point, measured on DejaVu Sans
LINE_H = 1.30   # px per line per point, measured
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

BG = {"module": "#0a4f57", "rule": "#12303a", "callout": "#5a2b12"}
ACCENT = {"module": "#e0b22e", "rule": "#4fb3c0", "callout": "#e08a1e"}
KIND_LABEL = {"module": "MODULE", "rule": "RULE", "callout": "CALLOUT"}

# DejaVu Sans has no glyph for the rupee sign (U+20B9), so it would render as a
# blank box. Display-only substitution for the slides; the audio and the data
# files keep the real character.
GLYPH_FALLBACK = {
    "\u20b9": "Rs ", "\u2264": "<=", "\u2265": ">=",
    "\u2014": "-", "\u2013": "-", "\u2192": "->",
}


def ffmpeg_exe():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        for cand in ("ffmpeg", "/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg"):
            if shutil.which(cand):
                return cand
        sys.exit("ffmpeg not found. Install it with: pip install imageio-ffmpeg")


def identify(convert, path, fmt):
    return subprocess.run([convert, path, "-format", fmt, "info:"],
                          capture_output=True, text=True).stdout.strip()


def run(cmd, **kw):
    p = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if p.returncode != 0:
        sys.stderr.write(p.stdout[-3000:] + "\n" + p.stderr[-3000:] + "\n")
        sys.exit("command failed (%d): %s" % (p.returncode, " ".join(cmd[:6])))
    return p


def wrap_for_slide(text, body_w, body_h, font_path):
    """Wrap the narration to fit the slide's body box and pick a font size that
    guarantees it fits.

    ImageMagick's `caption:` wraps for you but GROWS the canvas when the text
    does not fit, and past roughly 500 characters at 30pt in a 1160x470 box it
    fails outright with "width or height exceeds limit". `label:` instead
    respects -size and clips, so the text is wrapped here and the size chosen so
    the wrapped block is known to fit.
    """
    t = " ".join(str(text or "").split())
    for bad, good in GLYPH_FALLBACK.items():
        t = t.replace(bad, good)
    if not t:
        return "", 20
    chars = len(t)
    size = 20
    for cand in range(30, 13, -1):
        cols = max(20, int(body_w / (CHAR_W * cand)))
        lines = max(1, -(-chars // cols))          # ceil
        if lines * LINE_H * cand <= body_h and cols * CHAR_W * cand <= body_w:
            size = cand
            break
    cols = max(20, int(body_w / (CHAR_W * size)))
    return textwrap.fill(t, cols), size


TAIL_S = 1.0      # hold the final slide a beat past the last clip
CHUNK_CHARS = 420   # keep each label well under ImageMagick's ~700-char ceiling
CHUNK_LINES = 11


def chunk_lines(wrapped):
    """Split already-wrapped text into label-sized blocks."""
    lines = [l for l in wrapped.split("\n") if l.strip()]
    if not lines:
        return [""]
    chunks, cur, cur_len = [], [], 0
    for line in lines:
        if cur and (len(cur) >= CHUNK_LINES or cur_len + len(line) + 1 > CHUNK_CHARS):
            chunks.append("\n".join(cur))
            cur, cur_len = [], 0
        cur.append(line)
        cur_len += len(line) + 1
    if cur:
        chunks.append("\n".join(cur))
    return chunks


def slide_png(convert, seg, idx, width, height, out_png, workdir):
    bg = BG.get(seg["kind"], "#12303a")
    accent = ACCENT.get(seg["kind"], "#4fb3c0")
    label = KIND_LABEL.get(seg["kind"], "")

    pad = int(width * 0.047)
    header_w = width - 2 * pad
    body_h = int(height * 0.66)
    body_w = header_w

    body, size = wrap_for_slide(seg["text"], body_w, body_h, FONT)
    chunks = chunk_lines(body)
    sub = "%s  ·  %.1fs" % (os.path.basename(seg["file"]), seg["duration"])

    # Render each chunk as its own image. ImageMagick refuses a `label:` whose
    # text is too long (roughly 700 characters / ~17 lines) with "width or height
    # exceeds limit", so long narration is stacked from several smaller labels.
    body_imgs = []
    for ci, chunk in enumerate(chunks):
        png = os.path.join(workdir, "b%04d-%d.png" % (idx, ci))
        run([
            convert, "-background", "none", "-fill", "#eef4f5", "-font", FONT,
            "-pointsize", str(size), "label:" + chunk, png,
        ])
        body_imgs.append(png)

    # -append needs equal widths; pad every chunk to the widest one, otherwise
    # ImageMagick fills the gap with black and shows a bar down the slide.
    widths = [int(identify(convert, p, "%w")) for p in body_imgs]
    wide = max(widths)
    for p in body_imgs:
        run([convert, p, "-background", "none", "-gravity", "northwest",
             "-extent", "%dx" % wide, p])

    cmd = [
        convert, "-size", "%dx%d" % (width, height), "xc:%s" % bg,
        # accent rule under the header
        "-fill", accent, "-draw", "rectangle %d,%d %d,%d" % (pad, pad + 74, pad + 150, pad + 80),
        # kind label
        "-fill", accent, "-font", FONT_B, "-pointsize", "20",
        "-gravity", "northwest", "-annotate", "+%d+%d" % (pad + 168, pad + 6), label,
        # header
        "-fill", "#ffffff", "-font", FONT_B, "-pointsize", "40",
        "-gravity", "northwest", "-annotate", "+%d+%d" % (pad, pad + 26),
        str(seg["header"] or ""),
        # sub-line
        "-fill", "#9fc4cc", "-font", FONT, "-pointsize", "21",
        "-gravity", "northwest", "-annotate", "+%d+%d" % (pad, pad + 96), sub,
        # body, auto-wrapped. The text is passed inline: ImageMagick's
        # `caption:@file` form is not supported and silently produced slides
        # with no body at all.
        "(",
    ] + body_imgs + [
        "-append", "-resize", "%dx%d>" % (body_w, body_h), ")",
        "-gravity", "northwest", "-geometry", "+%d+%d" % (pad, pad + 150),
        "-composite", out_png,
    ]
    run(cmd)
    return out_png


def main():
    ap = argparse.ArgumentParser(description="Render the Chapter 6 narration to MP4")
    ap.add_argument("--out", default=os.path.join(DELIVERABLE, "gfr-chapter-6.mp4"))
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--height", type=int, default=720)
    ap.add_argument("--fps", type=int, default=5)
    ap.add_argument("--crf", default="32")
    ap.add_argument("--audio-bitrate", default="40k",
                    help="AAC bitrate; the source clips are 32 kbps mono, so 40k is lossless-in-practice")
    ap.add_argument("--limit", type=int, default=0, help="render only the first N segments")
    ap.add_argument("--keep", action="store_true", help="keep the intermediate slide PNGs")
    args = ap.parse_args()

    if not os.path.exists(SEGMENTS):
        sys.exit("data/_segments.json missing — run `node data/_segments.js` first")
    doc = json.load(open(SEGMENTS, encoding="utf-8"))
    segs = doc["segments"]
    if args.limit:
        segs = segs[:args.limit]
    total = len(segs)
    for i, s in enumerate(segs):
        s["_total"] = total

    ff = ffmpeg_exe()
    convert = shutil.which("convert")
    if not convert:
        sys.exit("ImageMagick `convert` not found")
    for f in (FONT, FONT_B):
        if not os.path.exists(f):
            sys.exit("font not found: " + f)

    workdir = tempfile.mkdtemp(prefix="gfr-video-")
    print("ffmpeg   : %s" % ff)
    print("segments : %d  (%.1f s total)" % (total, sum(s["duration"] for s in segs)))
    print("size     : %dx%d @ %d fps, crf %s" % (args.width, args.height, args.fps, args.crf))
    print("workdir  : %s" % workdir)

    # ---- 1. slides ----
    slides = []
    for i, s in enumerate(segs):
        png = os.path.join(workdir, "s%04d.png" % i)
        slide_png(convert, s, i, args.width, args.height, png, workdir)
        slides.append(png)
        if (i + 1) % 20 == 0 or i + 1 == total:
            print("  slides %d/%d" % (i + 1, total))

    # ---- 2. video track: concat demuxer with per-slide durations ----
    vlist = os.path.join(workdir, "video.txt")
    with open(vlist, "w", encoding="utf-8") as fh:
        for i, png in enumerate(slides):
            fh.write("file '%s'\n" % png)
            dur = segs[i]["duration"] + (TAIL_S if i == len(slides) - 1 else 0.0)
            fh.write("duration %.3f\n" % dur)
        fh.write("file '%s'\n" % slides[-1])   # last frame needs repeating
    video_only = os.path.join(workdir, "video.mp4")
    run([ff, "-y", "-hide_banner", "-loglevel", "error",
         "-f", "concat", "-safe", "0", "-i", vlist,
         "-vf", "fps=%d,format=yuv420p" % args.fps,
         "-c:v", "libx264", "-preset", "ultrafast", "-crf", args.crf,
         "-an", video_only])

    # ---- 3. audio track: concat the clips ----
    alist = os.path.join(workdir, "audio.txt")
    with open(alist, "w", encoding="utf-8") as fh:
        for s in segs:
            fh.write("file '%s'\n" % os.path.join(DELIVERABLE, s["file"]))
    audio_only = os.path.join(workdir, "audio.m4a")
    run([ff, "-y", "-hide_banner", "-loglevel", "error",
         "-f", "concat", "-safe", "0", "-i", alist,
         "-c:a", "aac", "-b:a", args.audio_bitrate, audio_only])

    # ---- 4. mux ----
    run([ff, "-y", "-hide_banner", "-loglevel", "error",
         "-i", video_only, "-i", audio_only,
         "-c:v", "copy", "-c:a", "copy", "-movflags", "+faststart",
         args.out])

    size = os.path.getsize(args.out)
    dur = subprocess.run([ff, "-hide_banner", "-i", args.out], capture_output=True, text=True)
    print("\nwrote %s" % args.out)
    print("  size : %.1f MB" % (size / 1048576.0))
    print("  note : MP3 clips carry ID3 tags; the concat demuxer keeps them, so a")
    print("         decoder may report a slightly longer stream than the slide total.")

    if not args.keep:
        shutil.rmtree(workdir, ignore_errors=True)
        print("  cleaned intermediate slides")
    else:
        print("  slides kept in %s" % workdir)


if __name__ == "__main__":
    main()
