# PDF → Video Cover

`pdf_cover` turns a document — typically a brand guide or style guide — into a
short branded **cover video**: the looping hero clip you put at the top of a
deck, a landing page, or a video thumbnail slot.

It runs entirely locally. No API keys, no paid providers.

```bash
python tools/video/pdf_cover.py brand-guide.pdf -o output/cover.mp4
```

## Why it batches

Rasterizing a 200-page brand guide in one go will happily eat all your RAM and
then die. The tool never does that:

| Control | Flag | Default | What it does |
|---|---|---|---|
| Batch size | `--batch-size` | `4` | Pages rendered per batch. Lower = less memory pressure. |
| Batch cap | `--max-batches` | `0` (all) | Max batches **per invocation**. Re-run to continue. |
| Batch pause | `--batch-pause` | `0.5` | Seconds slept between batches. |

Each batch opens the document, renders only its own pages, then closes it
again — so resident memory tracks the batch size, not the page count. A
checkpoint (`pdf_cover_state.json`) is atomically rewritten after every batch,
so an interrupted run resumes instead of restarting.

### Driving a large document across invocations

```bash
# First pass — 10 batches, then stop and let the machine cool down
python tools/video/pdf_cover.py huge-guide.pdf -o out/cover.mp4 \
    --work-dir out/work --batch-size 3 --max-batches 10

# Later (or after a crash) — resumes, skips finished batches, finishes the job
python tools/video/pdf_cover.py huge-guide.pdf -o out/cover.mp4 \
    --work-dir out/work --batch-size 3
```

A run that hits `--max-batches` returns `status: partial` with
`batches_remaining`, and writes no video. Once every batch is done the same
command proceeds straight to style extraction and rendering.

> Keep `--batch-size` identical across invocations of the same work dir. The
> checkpoint keys batches by index, so changing the batch size mid-document
> reshuffles the plan.

## What it produces

Under `--work-dir` (default `output/pdf-cover`):

```
work/
  source.pdf                     # downloaded if you passed a URL
  pages/page_00000.jpg           # one thumbnail per page
  pdf_cover_state.json           # the resume checkpoint
  visual-style.yaml              # extracted brand style spec
```

Plus the cover video at `-o`.

## The cover itself

A 12-second (default) 1920x1080 clip, with `--duration 12`:

1. **0.25–1.25s** — accent rule wipes in, title fades up
2. **1.5–3.3s** — subtitle fades in, title holds
3. **4.0s onward** — cross-fading montage of the sampled pages with a slow
   Ken Burns drift
4. throughout — a brand chip pinned to the bottom

The montage start scales with duration (`min(4.0, max(2.0, duration * 0.35))`),
and the number of montage pages is capped so each gets a readable beat. Type
fades out as the montage takes over so nothing sits unreadably on top of page
imagery.

## Style extraction

Colour evidence is aggregated from every sampled page:

- **background** — the dominant near-white or near-black page field, so a
  saturated brand stripe never masquerades as the background
- **primary** — the highest coverage × saturation colour that is *not* the
  page field, then saturation-boosted to undo median-cut muddiness
- **accent** — the most saturated colour that still reads as distinct from the
  primary, ranked by saturation × legibility on the background
- **text** — auto-flipped dark/light for contrast against the background

The result lands in `visual-style.yaml` using the same shape as the playbooks
in `styles/`, so it can feed straight into the rest of the pipeline.

## Options

```
--duration 12          cover length in seconds
--fps 30               frame rate
--width 1920           output width
--height 1080          output height
--title "..."          override the cover title (default: PDF metadata title)
--subtitle "..."       cover subtitle (default: first meaningful line of text)
--thumbnail-width 640  stored page thumbnail width
--dpi 110              rasterization DPI for thumbnails
--keep-frames          keep the rendered PNG frames for inspection
--ffmpeg PATH          explicit FFmpeg binary
```

## Programmatic use

```python
from tools.video.pdf_cover import PdfCover

result = PdfCover().execute({
    "pdf_source": "https://example.com/brand-guide.pdf",
    "output_path": "output/cover.mp4",
    "work_dir": "output/pdf-cover",
    "batch_size": 4,
    "batch_pause_seconds": 0.5,
    "duration": 12,
})
print(result.success, result.data["palette"])
```

## Requirements

```
pip install pymupdf pillow imageio-ffmpeg requests pyyaml
```

`imageio-ffmpeg` bundles a static FFmpeg binary, so no system FFmpeg is
needed — the tool checks PATH first and falls back to the wheel. This is also
why `check_dependencies()` is overridden: the base class only probes PATH and
would otherwise report the tool unavailable on machines with no system FFmpeg.

## Known limits

- Long titles wrap rather than shrink; keep them under ~60 characters
- Fonts fall back to DejaVu Sans; a brand's real typeface is not embedded
- A document with no extractable colours falls back to a neutral dark palette
- Very short durations (`--duration 3`) leave little room for both a title
  hold and a montage
