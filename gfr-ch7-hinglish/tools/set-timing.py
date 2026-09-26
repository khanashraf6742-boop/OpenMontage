#!/usr/bin/env python3
"""
Re-time the comic player to the *measured* audio.

The player shows bubble N at bubble.t seconds and runs the scene for audio
duration (falling back to scene.est when audio is unavailable). So after any
re-recording, both have to be re-derived from the real MP3s.

Bubble times are apportioned by segment length (each segment carries a small
fixed pause overhead), which keeps every line on screen while it is spoken.

Usage:  python3 tools/set-timing.py s1 s2 … s9        (scene ids)
        python3 tools/set-timing.py --all
"""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEAD, PAUSE = 0.3, 12          # seconds of lead-in, per-segment pause overhead


def mp3_duration(p):
    out = subprocess.run([sys.executable, str(ROOT / "tools" / "mp3tool.py"), "duration", str(p)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def main(ids):
    timing = json.loads((ROOT / "assets" / "narration" / "timing.json").read_text())
    src = (ROOT / "content.js").read_text()
    report = []
    for t in timing["scenes"]:
        if ids != ["--all"] and t["id"] not in ids:
            continue
        audio = ROOT / "assets" / "audio" / t["file"]
        if not audio.exists():
            report.append(f"{t['id']}: audio missing — skipped")
            continue
        dur = mp3_duration(audio)
        segs = t["segChars"]
        w = [c + PAUSE for c in segs]
        tot = sum(w)
        times = []
        cum = 0
        for wi in w[:-1]:                      # last segment is the caption: no bubble time
            times.append(round(LEAD + cum / tot * (dur - 2 * LEAD), 1))
            cum += wi

        # isolate this scene's block
        start = src.index(f"id: '{t['id']}'")
        nxt = re.search(r"id: 's\d+'", src[start + 5:])
        end = start + 5 + nxt.start() if nxt else len(src)
        block = src[start:end]

        block_new, n = re.subn(r"est:\s*\d+", f"est: {int(round(dur))}", block, count=1)
        if n != 1:
            report.append(f"{t['id']}: est not found!")
        b = [0]

        def repl(m):
            v = times[b[0]] if b[0] < len(times) else times[-1]
            b[0] += 1
            return f"{{ who:'{m.group(1)}', side:'{m.group(2)}', t:{v},"

        block_new = re.sub(r"\{\s*who:'(\w+)',\s*side:'(\w+)',\s*t:\d+,", repl, block_new)
        src = src[:start] + block_new + src[end:]
        report.append(f"{t['id']}: {dur:.1f}s → est {int(round(dur))}, bubbles at {times}")

    (ROOT / "content.js").write_text(src)
    print("\n".join(report))


if __name__ == "__main__":
    main(sys.argv[1:] or ["--all"])
