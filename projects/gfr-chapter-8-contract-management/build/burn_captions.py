# -*- coding: utf-8 -*-
"""SRT → 1080p ASS (Noto Sans Devanagari for Devanagari runs, Inter for Latin), burned in via libass."""
import re, subprocess, sys
from pathlib import Path

PROJ = Path(__file__).resolve().parents[1]; R = PROJ / "renders"
SRC, OUT = R / "gfr_ch8_contract_management.mp4", R / "gfr_ch8_contract_management_captioned.mp4"
MAXC = 95


def t2s(s):
    h, m, rest = s.split(":"); sec, ms = rest.split(","); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000


def s2ass(t):
    cs = int(round(t * 100)); h, cs = divmod(cs, 360000); m, cs = divmod(cs, 6000); s, cs = divmod(cs, 100); return f"{h}:{m:02}:{s:02}.{cs:02}"


def split_cue(text):
    if len(text) <= MAXC:
        return [text]
    out, cur = [], ""
    for p in re.split(r"(?<=[;,:—])\s+", text):
        if cur and len(cur) + 1 + len(p) > MAXC:
            out.append(cur); cur = p
        else:
            cur = (cur + " " + p).strip()
    if cur:
        out.append(cur)
    final = []
    for o in out:
        while len(o) > MAXC * 1.4:
            cut = o.rfind(" ", 0, MAXC); cut = cut if cut > 20 else MAXC; final.append(o[:cut]); o = o[cut:].strip()
        final.append(o)
    return final


def tag_runs(text):
    out, cur, cur_dev = [], "", None
    for ch in text:
        d = ("\u0900" <= ch <= "\u097F") if ch.strip() else cur_dev
        if cur and d != cur_dev and d is not None:
            out.append((cur, cur_dev)); cur = ""
        cur += ch
        if d is not None:
            cur_dev = d
    if cur:
        out.append((cur, cur_dev))
    return "".join((r"{\fnNoto Sans Devanagari\fs50}" if d else r"{\fnInter\fs36}") + t for t, d in out)


cues = []
for blk in (R / "captions_hinglish.srt").read_text(encoding="utf-8").strip().split("\n\n"):
    ls = blk.split("\n"); a, b = [t2s(x.strip()) for x in ls[1].split("-->")]
    pieces = split_cue(" ".join(ls[2:])); total = sum(len(p) for p in pieces); t = a
    for p in pieces:
        d = (b - a) * len(p) / total; cues.append((t, t + d - 0.04, p)); t += d

header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Noto Sans Devanagari,38,&H00FFFFFF,&H00FFFFFF,&H00000000,&H8C000000,0,0,0,0,100,100,0,0,4,0,0,2,200,200,50,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
(R / "captions_hinglish.ass").write_text(header + "".join(f"Dialogue: 0,{s2ass(a)},{s2ass(b)},Cap,,0,0,0,,{tag_runs(t)}\n" for a, b, t in cues), encoding="utf-8")
print("cues:", len(cues))
if "--burn" in sys.argv:
    vf = f"ass={(R / 'captions_hinglish.ass').as_posix()}:fontsdir={(PROJ / 'assets' / 'fonts').as_posix()}"
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(SRC), "-vf", vf, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                    "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", str(OUT)], check=True)
    print("burned →", OUT)
