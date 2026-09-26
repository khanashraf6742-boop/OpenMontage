#!/usr/bin/env python3
"""
Build a lightweight animated preview of the rendered MP4.

`present_file` / the workspace viewer can display images (png, gif, webp) but not
MP4, so a 95 MB video cannot be shown inline. This renders the opening slides as
an animated GIF that keeps the real per-slide timing, so the video's content and
pacing are visible without a player.

Because the slides are static, one frame per slide is enough - a GIF of the first
six slides is a few hundred kilobytes against the MP4's 95 MB.

    python3 data/_preview.py [--slides N] [--width 640] [--out FILE]
"""
import argparse
import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
DELIVERABLE = os.path.join(HERE, "..")
SEGMENTS = os.path.join(HERE, "_segments.json")

spec = importlib.util.spec_from_file_location("gfr_video", os.path.join(HERE, "_video.py"))
video = importlib.util.module_from_spec(spec)
spec.loader.exec_module(video)


def main():
    ap = argparse.ArgumentParser(description="Build an animated GIF preview of the MP4")
    ap.add_argument("--slides", type=int, default=6, help="how many opening slides to include")
    ap.add_argument("--width", type=int, default=640, help="GIF width in pixels")
    ap.add_argument("--out", default=os.path.join(DELIVERABLE, "gfr-chapter-6-preview.gif"))
    ap.add_argument("--keep", action="store_true", help="keep the intermediate slide PNGs")
    args = ap.parse_args()

    doc = json.load(open(SEGMENTS, encoding="utf-8"))
    segs = doc["segments"][: args.slides]

    convert = shutil.which("convert")
    if not convert:
        sys.exit("ImageMagick `convert` not found")

    workdir = tempfile.mkdtemp(prefix="gfr-preview-")
    frames = []
    for i, s in enumerate(segs):
        png = os.path.join(workdir, "p%04d.png" % i)
        video.slide_png(convert, s, i, 1280, 720, png, workdir)
        # Scale once, up front: GIF is palettised and every pixel costs.
        small = os.path.join(workdir, "s%04d.png" % i)
        subprocess.run([convert, png, "-resize", "%dx" % args.width, small], check=True)
        frames.append(small)

    # GIF delays are in centiseconds and cap at 65535 cs (655 s), which is well
    # above the longest single slide.
    cmd = [convert, "-loop", "0"]
    for f, s in zip(frames, segs):
        cmd += ["-delay", str(int(round(s["duration"] * 100))), f]
    cmd += [args.out]
    subprocess.run(cmd, check=True)

    total = sum(s["duration"] for s in segs)
    print("preview  : %s" % os.path.relpath(args.out, DELIVERABLE))
    print("slides   : %d of %d" % (len(segs), len(doc["segments"])))
    print("covers   : 0:00 -> %d:%02d of the 130:07 video" % (total // 60, total % 60))
    print("size     : %d KB" % (os.path.getsize(args.out) // 1024))
    if not args.keep:
        shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    main()
