#!/usr/bin/env python3
"""
Build the single-file version of the explainer: Part 1 + Part 2 in one MP4.

  assets/video/gfr-ch7-complete.mp4
    ≈ 33 minutes, 1280x720, H.264 + AAC (stream copy — no re-encode)
    · chapter list = 10 story scenes + 17 rules, with the Part 2 chapters
      shifted by the length of Part 1
    · so one file carries the whole chapter: story first, then rule by rule

Chapter times are derived from the measured narration clips, matching the way
Part 1 (tools/make-video.py) and Part 2 (tools/make-video-deep.py) were built:
  Part 1: title card 7 s → 10 scenes (scene MP3s) → recap card 9 s
  Part 2: intro card 8 s → 17 rules (rule MP3s) → recap card 9 s

Usage: python3 tools/make-complete-video.py [--crf-check]
"""
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
NARR = ROOT / "assets" / "narration"
VID = ROOT / "assets" / "video"
BUILD = ROOT / "build" / "video"

P1_INTRO, P1_OUTRO = 7.0, 9.0
P2_INTRO, P2_OUTRO = 8.0, 9.0

sys.path.insert(0, str(ROOT / "tools"))
import mp3tool  # noqa: E402


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def main():
    scenes = json.loads((NARR / "scenes.json").read_text())["scenes"]
    rules = json.loads((NARR / "rules-slides.json").read_text())["rules"]

    chapters, t = [], 0.0
    t += P1_INTRO                                                        # title card
    for sc in scenes:
        d = mp3tool.duration(str(ROOT / sc["audio"]))
        chapters.append((t, f"Part 1 · S{sc['n']} — Rule {', '.join(sc['rules'])}: {sc['title']}"))
        t += d
    t += P1_OUTRO
    part1_len = t

    t += P2_INTRO
    for r in rules:
        d = mp3tool.duration(str(ROOT / "assets" / "audio" / f"rule-{r['no']}.mp3"))
        chapters.append((t, f"Part 2 · Rule {r['no']}: {r['title']}"))
        t += d
    t += P2_OUTRO
    total = t

    BUILD.mkdir(parents=True, exist_ok=True)
    meta = [";FFMETADATA1",
            "title=GFR 2017 Chapter 7 — Inventory Management (complete: story + rule by rule)",
            "artist=Interactive Hinglish explainer · Indian-accent narration",
            "comment=Rules 207-223 · verified against the DoE position up to the 31.01.2026 compilation"]
    for i, (start, title) in enumerate(chapters):
        end = chapters[i + 1][0] if i + 1 < len(chapters) else total
        meta += ["[CHAPTER]", "TIMEBASE=1/1000",
                 f"START={int(start*1000)}", f"END={int(end*1000)}", f"title={title}"]
    chf = BUILD / "complete-chapters.txt"
    chf.write_text("\n".join(meta) + "\n", encoding="utf-8")

    listf = BUILD / "complete-list.txt"
    listf.write_text(f"file '{VID / 'gfr-ch7-final.mp4'}'\nfile '{VID / 'gfr-ch7-deepdive.mp4'}'\n")

    out = VID / "gfr-ch7-complete.mp4"
    p = subprocess.run([ffmpeg(), "-hide_banner", "-loglevel", "error", "-y",
                        "-f", "concat", "-safe", "0", "-i", str(listf),
                        "-i", str(chf),
                        "-map", "0:v:0", "-map", "0:a:0", "-dn", "-sn", "-c", "copy",
                        "-map_metadata", "1", "-movflags", "+faststart", str(out)],
                       capture_output=True, text=True)
    if p.returncode != 0:
        print(p.stderr[-2000:])
        sys.exit(1)

    size = out.stat().st_size / 1024 / 1024
    m, s = divmod(int(round(total)), 60)
    print(f"{out.name}: {m}:{s:02d}  {size:.1f} MB  · {len(chapters)} chapters "
          f"(Part 1 ends at {int(part1_len)//60}:{int(part1_len)%60:02d})")


if __name__ == "__main__":
    main()
