#!/usr/bin/env python3
"""
Render the final MP4 of the GFR Chapter 7 explainer (story mode).

Takes the comic panels, the Indian-accent narration clips and the on-screen
Hinglish text, and produces one continuous video file with:

  • a title card and an outro card,
  • a slow pan across every panel (documentary feel),
  • burned-in Hinglish subtitles (dialogue + explanatory caption),
  • a per-scene chapter banner,
  • MP4 chapter markers, so a player can jump scene to scene,
  • a sidecar .srt with the same subtitles.

Encoder: ffmpeg (installed via imageio-ffmpeg, no system ffmpeg needed).

Usage:
  python3 tools/make-video.py                 # full render
  python3 tools/make-video.py --scenes 3 9    # only these scenes (debug)
  python3 tools/make-video.py --crf 26 --height 720
"""
import argparse
import json
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
NARR = ROOT / "assets" / "narration"
BUILD = ROOT / "build" / "video"
OUT = ROOT / "assets" / "video"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
LEAD, PAUSE = 0.3, 12          # bubble lead-in / per-segment pause (same as set-timing.py)
FPS = 25
INTRO, OUTRO = 7.0, 9.0

sys.path.insert(0, str(ROOT / "tools"))
import mp3tool  # noqa: E402


def ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        exe = shutil.which("ffmpeg")
        if not exe:
            sys.exit("ffmpeg not found — pip install imageio-ffmpeg")
        return exe


FF = ffmpeg()


def run(args, quiet=True):
    p = subprocess.run([FF, "-hide_banner", "-loglevel", "error" if quiet else "info", "-y", *args],
                       capture_output=True, text=True)
    if p.returncode != 0:
        print("FFMPEG FAILED:\n", " ".join(args[:14]), "\n", p.stderr[-2500:])
        raise SystemExit(1)
    return p


# ── ASS subtitle helpers ─────────────────────────────────────────────────────
ASS_HEAD = """[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Bubble,DejaVu Sans,30,&H00FFFFFF,&H000000FF,&H00101010,&HB0000000,-1,0,0,0,100,100,0,0,1,2.5,1.2,2,60,60,124,1
Style: Caption,DejaVu Sans,24,&H00E8F4FF,&H000000FF,&H00101010,&HB0000000,0,0,0,0,100,100,0,0,1,2,1,2,60,60,26,1
Style: Chapter,DejaVu Sans,21,&H00FFF3C4,&H000000FF,&H00101010,&H8C000000,-1,0,0,0,100,100,0,0,3,1,0,7,24,24,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def ts(sec):
    sec = max(0.0, sec)
    h, rem = divmod(sec, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def ass_text(t):
    return t.replace("\n", " ").replace("{", "(").replace("}", ")").strip()


def split_caption(text, cap=230):
    """Long captions are shown as consecutive subtitle cards."""
    if len(text) <= cap:
        return [text]
    out, cur = [], ""
    for sent in text.replace(" — ", " — ").split(". "):
        piece = sent + ". "
        if cur and len(cur) + len(piece) > cap:
            out.append(cur.strip())
            cur = ""
        cur += piece
    if cur.strip():
        out.append(cur.strip())
    return out


def scene_weights(sc):
    """Measured-audio weights: one per bubble plus one for the caption."""
    segs = [len(b["text"]) + PAUSE for b in sc["bubbles"]]
    segs.append(len(sc["caption"]) + PAUSE)
    return segs


def build_ass(sc, dur):
    w = scene_weights(sc)
    tot = sum(w)
    usable = dur - 2 * LEAD
    lines, cum = [], 0.0
    for i, b in enumerate(sc["bubbles"]):
        start = LEAD + cum / tot * usable
        end = LEAD + (cum + w[i]) / tot * usable
        who = CAST.get(b["who"], b["who"]).split()[0].upper()
        colour = SPEAKER_COLOUR.get(b["who"], "&H00FFFFFF")
        # speaker name in colour, then the line
        lines.append(f"Dialogue: 0,{ts(start)},{ts(end)},Bubble,,0,0,0,,"
                     f"{{\\c{colour}}}{who}:{{\\c&H00FFFFFF&}} {ass_text(b['text'])}")
        cum += w[i]
    # caption window: from the end of the last bubble to the end of the clip
    cap_start = LEAD + cum / tot * usable
    cap_end = dur - 0.15
    chunks = split_caption(sc["caption"])
    span = max(0.4, (cap_end - cap_start) / len(chunks))
    for i, ch in enumerate(chunks):
        a, b2 = cap_start + i * span, cap_start + (i + 1) * span
        lines.append(f"Dialogue: 0,{ts(a)},{ts(min(b2, cap_end))},Caption,,0,0,0,,{ass_text(ch)}")
    # chapter banner for the whole scene
    rules = ", ".join("Rule " + r for r in sc["rules"])
    banner = f"SCENE {sc['n']}/10  ·  {rules}  ·  {sc['title']}"
    lines.append(f"Dialogue: 0,{ts(0.1)},{ts(dur - 0.1)},Chapter,,0,0,0,,{ass_text(banner)}")
    return ASS_HEAD + "\n".join(lines) + "\n"


SPEAKER_COLOUR = {          # ASS is &HBBGGRR
    "anita": "&H00D7A55B", "ravi": "&H006BD4F0", "farah": "&H0088E39B",
    "suresh": "&H00C08CF2", "manjeet": "&H0060C8FF",
}


def srt_events(sc, dur):
    """(start, end, text) triples for the sidecar .srt — dialogue then caption."""
    w = scene_weights(sc)
    tot, usable, cum = sum(w), dur - 2 * LEAD, 0.0
    out = []
    for i, b in enumerate(sc["bubbles"]):
        a = LEAD + cum / tot * usable
        e = LEAD + (cum + w[i]) / tot * usable
        out.append((a, e, f"{CAST.get(b['who'], b['who'])}: {b['text']}"))
        cum += w[i]
    chunks = split_caption(sc["caption"])
    a0 = LEAD + cum / tot * usable
    span = max(0.4, (dur - 0.15 - a0) / len(chunks))
    for i, ch in enumerate(chunks):
        out.append((a0 + i * span, min(a0 + (i + 1) * span, dur - 0.15), ch))
    return out


def srt_ts(sec):
    ms = int(round(sec * 1000))
    h, rem = divmod(ms, 3600000)
    m, s2 = divmod(rem, 60000)
    sec2, ms = divmod(s2, 1000)
    return f"{h:02d}:{m:02d}:{sec2:02d},{ms:03d}"


def write_srt(entries, path):
    lines = []
    for i, (a, b, t) in enumerate(entries, 1):
        lines += [str(i), f"{srt_ts(a)} --> {srt_ts(b)}", t, ""]
    path.write_text("\n".join(lines), encoding="utf-8")


# ── render ───────────────────────────────────────────────────────────────────
def render_scene(sc, crf, height, even_pan):
    audio = ROOT / sc["audio"]
    dur = mp3tool.duration(str(audio))
    ass = BUILD / f"scene-{sc['n']:02d}.ass"
    out = BUILD / f"scene-{sc['n']:02d}.mp4"
    ass.write_text(build_ass(sc, dur), encoding="utf-8")

    w, h = 1672, 941
    cw, ch = 1536, 864                      # 92% window for the pan
    pan = "(iw-ow)*min(t/{d},1)".format(d=dur) if even_pan else "(iw-ow)*(1-min(t/{d},1))".format(d=dur)
    grad_h = int(height * 0.42)
    vf = (f"crop={cw}:{ch}:x='{pan}':y=38,"
          f"scale={int(height*16/9)}:{height}:flags=lanczos,setsar=1,"
          f"drawbox=x=0:y=ih-{grad_h}:w=iw:h={grad_h}:color=black@0.42:t=fill,"
          f"ass={ass}")
    run(["-loop", "1", "-framerate", str(FPS), "-i", str(ROOT / sc["panel"]),
         "-i", str(audio),
         "-vf", vf,
         "-c:v", "libx264", "-preset", "medium", "-crf", str(crf),
         "-pix_fmt", "yuv420p", "-r", str(FPS), "-t", f"{dur:.3f}",
         "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "2",
         "-shortest", "-movflags", "+faststart", str(out)])
    print(f"  scene {sc['n']:>2}: {dur:6.2f}s  →  {out.name}")
    return out, dur


def ass_colour(hexrgb):
    h = hexrgb.lower()
    if h in NAMED:
        return NAMED[h]
    h = h.replace("0x", "").replace("#", "")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    h = h[-6:].rjust(6, "0")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f"&H00{b:02X}{g:02X}{r:02X}"


NAMED = {"white": "&H00FFFFFF", "black": "&H00000000", "grey": "&H00808080"}


def card_ass(path, lines, width, height):
    """Text card rendered with libass (this ffmpeg build has no drawtext)."""
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Card,DejaVu Sans,30,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,1,0,1,0,0,5,60,60,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    parts = []
    for text, size, colour, _gap in lines:
        parts.append(f"{{\\fs{size}\\c{ass_colour(colour)}}}{ass_text(text)}")
    body = "\\N".join(parts)
    event = f"Dialogue: 0,0:00:00.00,9:59:59.00,Card,,0,0,0,,{{\\an5\\pos({width//2},{(height//2)-20})}}{body}"
    path.write_text(head + event + "\n", encoding="utf-8")
    return path


def render_card(name, dur, lines, crf, height):
    out = BUILD / f"{name}.mp4"
    w, h = int(height * 16 / 9), height
    ass = card_ass(BUILD / f"{name}.ass", lines, w, h)
    run(["-f", "lavfi", "-i", f"color=c=0x0B1020:s={w}x{h}:d={dur}:r={FPS}",
         "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
         "-vf", f"ass={ass}", "-t", f"{dur:.3f}",
         "-c:v", "libx264", "-preset", "medium", "-crf", str(crf), "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "96k", "-shortest", str(out)])
    print(f"  {name}: {dur:.1f}s")
    return out, dur


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--crf", type=int, default=25)
    ap.add_argument("--height", type=int, default=720)
    ap.add_argument("--scenes", type=int, nargs="*", default=None)
    args = ap.parse_args()

    global CAST
    data = json.loads((NARR / "scenes.json").read_text())
    CAST = data["cast"]
    scenes = data["scenes"]
    if args.scenes:
        scenes = [s for s in scenes if s["n"] in args.scenes]
    BUILD.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    meta = data["meta"]
    clips = []
    if not args.scenes:
        clips.append(render_card("intro", INTRO, [
            ("GFR 2017  ·  CHAPTER 7", 46, "white", 70),
            ("Inventory Management", 62, "0xFFD166", 86),
            ("Rules 207 – 223", 40, "0x9AE6B4", 60),
            ("Hinglish narration  ·  Indian-accent voice  ·  city Hinglish text", 22, "0xCBD5E1", 40),
            (f"Verified {meta['lastVerified']}  ·  DoE / DoPT instructions", 22, "0x94A3B8", 40),
        ], args.crf, args.height))

    srt_entries = []
    offset = INTRO if not args.scenes else 0.0
    for i, sc in enumerate(scenes):
        clip, dur = render_scene(sc, args.crf, args.height, even_pan=(i % 2 == 0))
        clips.append((clip, dur))
        for a, b, t in srt_events(sc, dur):
            srt_entries.append((offset + a, offset + b, t))
        offset += dur

    if not args.scenes:
        clips.append(render_card("outro", OUTRO, [
            ("Chapter 7 — the whole picture", 44, "0xFFD166", 74),
            ("207 scope · 208–209 receipt & issue · 210 custody · 211 accounts · 212 hire", 24, "0xE2E8F0", 40),
            ("213 verification · 214 buffer · 215 library · 216 charge transfer · 217 disposal", 24, "0xE2E8F0", 40),
            ("218 modes (₹4 lakh) · 219 tender · 220 auction · 221 scrap · 222 sale account · 223 write-off", 24, "0xE2E8F0", 52),
            ("Sources: GFR 2017 (DoE) · DoE OM F.1/3/2024-PPD dt. 10.07.2024 · DoE compilation up to 31.01.2026", 20, "0x94A3B8", 36),
            ("Disclaimer: teaching aid — for official use, read the rule text itself.", 20, "0x94A3B8", 36),
        ], args.crf, args.height))

    # concat
    listf = BUILD / "list.txt"
    listf.write_text("".join(f"file '{c.name}'\n" for c, _ in clips))
    final = OUT / "gfr-ch7-final.mp4"
    chapters = BUILD / "chapters.txt"
    t0 = 0.0
    out_lines = [";FFMETADATA1", f"title={meta['title']}",
                 "artist=Interactive Hinglish explainer", "comment=Rules 207-223, verified 2026-09-25"]
    names = ["Title card"] + [f"S{sc['n']} · Rule {', '.join(sc['rules'])} — {sc['title']}" for sc in scenes] + ["Recap & sources"]
    if args.scenes:
        names = [f"Scene {c[0].stem}" for c in clips]
    for (clip, dur), nm in zip(clips, names):
        out_lines += ["[CHAPTER]", "TIMEBASE=1/1000",
                      f"START={int(t0*1000)}", f"END={int((t0+dur)*1000)}", f"title={nm}"]
        t0 += dur
    chapters.write_text("\n".join(out_lines) + "\n")
    run(["-f", "concat", "-safe", "0", "-i", str(listf), "-i", str(chapters),
         "-map_metadata", "1", "-c", "copy", "-movflags", "+faststart", str(final)], quiet=True)

    if not args.scenes:
        write_srt(srt_entries, OUT / "gfr-ch7-final.srt")
        print(f"subtitle sidecar: {OUT / 'gfr-ch7-final.srt'}  ({len(srt_entries)} entries)")

    size = final.stat().st_size / 1024 / 1024
    print(f"\nFINAL: {final}  {t0/60:.1f} min  {size:.1f} MB")
    return final, t0


if __name__ == "__main__":
    main()
