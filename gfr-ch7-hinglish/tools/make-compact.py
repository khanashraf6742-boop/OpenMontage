#!/usr/bin/env python3
"""
Compact (mobile) renders — small file, same content, chapters kept.

  gfr-ch7-complete-480p.mp4   whole chapter (32:54) at 854x480
  gfr-ch7-final-480p.mp4      story mode only (12:03) at 854x480

Re-encodes video and audio, keeps the MP4 chapter markers, and uses a
main-profile / level-3.1 stream so older phones and TVs play it.

Usage: python3 tools/make-compact.py [--crf 31] [--height 480] [--only complete|part1]
"""
import argparse
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
VID = ROOT / "assets" / "video"

JOBS = {
    "complete": ("gfr-ch7-complete.mp4", "gfr-ch7-complete-480p.mp4"),
    "part1": ("gfr-ch7-final.mp4", "gfr-ch7-final-480p.mp4"),
}


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def build(src_name, out_name, crf, height):
    src, out = VID / src_name, VID / out_name
    w = int(round(height * 16 / 9 / 2) * 2)   # H.264 needs even dimensions (480 → 854)
    cmd = [ffmpeg(), "-hide_banner", "-loglevel", "error", "-y",
           "-i", str(src),
           "-map", "0:v:0", "-map", "0:a:0", "-dn",
           "-vf", f"scale={w}:{height}:flags=bicubic",
           "-c:v", "libx264", "-preset", "veryfast", "-crf", str(crf),
           "-profile:v", "main", "-level", "3.1", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "64k", "-ac", "2",
           "-map_metadata", "0", "-movflags", "+faststart", str(out)]
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        print(p.stderr[-1500:])
        sys.exit(1)
    return out


def probe(path):
    p = subprocess.run([ffmpeg(), "-hide_banner", "-i", str(path)], capture_output=True, text=True)
    import re
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", p.stderr)
    chapters = p.stderr.count("Chapter #")
    m, s = (int(dur.group(2)), float(dur.group(3))) if dur else (0, 0)
    mins = int(dur.group(1)) * 60 + m + (1 if s >= 30 else 0) if dur else 0
    return f"{mins} min", chapters, path.stat().st_size / 1024 / 1024


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--crf", type=int, default=31)
    ap.add_argument("--height", type=int, default=480)
    ap.add_argument("--only", choices=sorted(JOBS), default=None)
    args = ap.parse_args()

    for key, (src, out) in JOBS.items():
        if args.only and key != args.only:
            continue
        if not (VID / src).exists():
            print(f"{src} missing — skipped")
            continue
        p = build(src, out, args.crf, args.height)
        dur, ch, mb = probe(p)
        print(f"{out}: {dur} · {mb:.1f} MB · {ch} chapter markers")
    print("\n(re-encoded: lower quality than the master files, same content and chapters)")


if __name__ == "__main__":
    main()
