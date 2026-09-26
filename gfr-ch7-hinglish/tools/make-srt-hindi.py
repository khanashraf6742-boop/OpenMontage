#!/usr/bin/env python3
"""
Devanagari subtitle track for Part 1 (story mode).

The app already carries both scripts for every bubble and caption (`hg` and
`hi` in content.js). This tool turns the Devanagari column into a subtitle
file with exactly the same timings as the burned-in Roman subtitles, and
optionally muxes it into a copy of the video as a selectable soft track.

Outputs
  assets/video/gfr-ch7-final.hi.srt        Devanagari cues (76 cues, same times)
  assets/video/gfr-ch7-final-hi.mp4        Part 1 + the soft subtitle track

Usage: python3 tools/make-srt-hindi.py [--no-mux]
"""
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
NARR = ROOT / "assets" / "narration"
VID = ROOT / "assets" / "video"
LEAD, PAUSE = 0.3, 12
INTRO = 7.0

sys.path.insert(0, str(ROOT / "tools"))
import mp3tool  # noqa: E402


def srt_ts(sec):
    ms = int(round(sec * 1000))
    h, rem = divmod(ms, 3600000)
    m, s = divmod(rem, 60000)
    s, ms = divmod(s, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def split_caption(text, cap=210):
    """Card the caption the way the burned-in subtitles do.

    Devanagari sentences end with '।' (danda), not '.', so the splitter has to
    honour both — otherwise a whole paragraph lands in one cue.
    """
    if len(text) <= cap:
        return [text]
    import re
    sentences = [m.group(0).strip() for m in re.finditer(r"[^।.!?]+[।.!?]*", text)] if "।" in text else \
                [x.strip() for x in re.split(r"(?<=[.!?])\s+", text)]
    out, cur = [], ""
    for sent in sentences:
        if not sent:
            continue
        if cur and len(cur) + len(sent) + 1 > cap:
            out.append(cur.strip())
            cur = ""
        if len(sent) > cap:                      # a single long sentence → hard wrap at words
            words, line = sent.split(), ""
            for w in words:
                if line and len(line) + len(w) + 1 > cap:
                    out.append(line.strip())
                    line = ""
                line = (line + " " + w).strip()
            cur = line
            continue
        cur = (cur + " " + sent).strip()
    if cur.strip():
        out.append(cur.strip())
    return out


def main():
    scenes = json.loads((NARR / "scenes.json").read_text())["scenes"]
    entries, t0 = [], INTRO
    for sc in scenes:
        dur = mp3tool.duration(str(ROOT / sc["audio"]))
        segs = [len(b["text"]) + PAUSE for b in sc["bubbles"]]
        segs.append(len(sc["caption"]) + PAUSE)
        tot = sum(segs)
        usable = dur - 2 * LEAD
        cum = 0.0
        for i, b in enumerate(sc["bubbles"]):
            a = LEAD + cum / tot * usable
            e = LEAD + (cum + segs[i]) / tot * usable
            who = b["who"][:1].upper() + b["who"][1:]
            entries.append((t0 + a, t0 + e, f"{who}: {b['textHi']}"))
            cum += segs[i]
        chunks = split_caption(sc["captionHi"])
        a0 = LEAD + cum / tot * usable
        span = max(0.4, (dur - 0.15 - a0) / len(chunks))
        for i, ch in enumerate(chunks):
            entries.append((t0 + a0 + i * span, min(t0 + a0 + (i + 1) * span, t0 + dur - 0.15), ch))
        t0 += dur

    srt = VID / "gfr-ch7-final.hi.srt"
    with srt.open("w", encoding="utf-8") as f:
        for i, (a, b, txt) in enumerate(entries, 1):
            f.write(f"{i}\n{srt_ts(a)} --> {srt_ts(b)}\n{txt}\n\n")
    print(f"{srt.name}: {len(entries)} cues, last at {srt_ts(entries[-1][1])}")

    if "--no-mux" in sys.argv:
        return
    out = VID / "gfr-ch7-final-hi.mp4"
    import imageio_ffmpeg
    p = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y",
                        "-i", str(VID / "gfr-ch7-final.mp4"), "-i", str(srt),
                        "-map", "0", "-map", "1", "-c", "copy", "-c:s", "mov_text",
                        "-metadata:s:s:0", "language=hin", "-metadata:s:s:0", "title=Hindi (Devanagari)",
                        "-movflags", "+faststart", str(out)], capture_output=True, text=True)
    if p.returncode != 0:
        print(p.stderr[-1500:])
        sys.exit(1)
    print(f"{out.name}: Part 1 + selectable Devanagari track, {out.stat().st_size/1024/1024:.1f} MB")


if __name__ == "__main__":
    main()
