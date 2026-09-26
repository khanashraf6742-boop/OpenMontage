#!/usr/bin/env python3
"""
Render PART 2 — the clause-by-clause Deep Dive video (Rules 207–223).

Each rule becomes one chapter built from its narration clip and an ASS slide
deck: every spoken segment (hook, each clause, note, amendment, exam trap) gets
its own slide, timed by the segment's share of the measured audio.

Output:  assets/video/gfr-ch7-deepdive.mp4  +  .srt
Usage:   python3 tools/make-video-deep.py [--crf 26] [--height 720] [--rules 215 216]
"""
import argparse
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
NARR = ROOT / "assets" / "narration"
BUILD = ROOT / "build" / "deep"
OUT = ROOT / "assets" / "video"
FPS = 25
LEAD, PAUSE = 0.45, 7.0
INTRO, OUTRO = 8.0, 9.0

sys.path.insert(0, str(ROOT / "tools"))
import mp3tool  # noqa: E402


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


FF = ffmpeg()

STYLE = """[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Head,DejaVu Sans,44,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,66,66,54,1
Style: Sub,DejaVu Sans,23,&H00B7C6DB,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,68,66,116,1
Style: Tag,DejaVu Sans,25,&H004FD8FF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,68,66,176,1
Style: Body,DejaVu Sans,29,&H00EDF3FB,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,68,70,222,1
Style: Foot,DejaVu Sans,20,&H007E90A8,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,1,60,60,26,1
Style: Slide,DejaVu Sans,44,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,68,72,52,1
Style: Card,DejaVu Sans,30,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,1,0,1,0,0,5,60,60,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

TAG_COLOUR = {
    "head": "&H00FFFFFF", "hook": "&H004FD8FF", "intro": "&H00A9B8CC",
    "clause": "&H0060E0A0", "note": "&H004FD8FF", "amend": "&H004040F0",
    "trap": "&H0066D1FF",
}


def ts(sec):
    ms = int(round(max(0.0, sec) * 1000))
    h, rem = divmod(ms, 3600000)
    m, s = divmod(rem, 60000)
    sec2, ms = divmod(s, 1000)
    return f"{h}:{m:02d}:{sec2:02d}.{ms//10:02d}"


def srt_ts(sec):
    ms = int(round(max(0.0, sec) * 1000))
    h, rem = divmod(ms, 3600000)
    m, s = divmod(rem, 60000)
    sec2, ms = divmod(s, 1000)
    return f"{h:02d}:{m:02d}:{sec2:02d},{ms:03d}"


def wrap(text, width=68, max_lines=11):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 <= width:
            cur = (cur + " " + w).strip()
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:max_lines]


def tag_line(seg):
    if seg["kind"] == "clause" and seg.get("tag"):
        return seg["tag"].upper()
    if seg["kind"] == "head":
        return ""
    if seg["kind"] == "hook":
        return "YAAD RAKHO"
    if seg["kind"] == "intro":
        return seg["label"].upper()
    if seg["kind"] == "note":
        return "NOTE"
    if seg["kind"] == "amend":
        return "AMENDMENT"
    if seg["kind"] == "trap":
        return "EXAM TRAP"
    return seg["label"].upper()


def slide_events(rule, dur):
    """One slide per spoken segment, timed by the segment's share of the audio."""
    segs = rule["segments"]
    weights = [len(s["nar"]) + PAUSE for s in segs]
    tot = sum(weights)
    usable = dur - 2 * LEAD
    events, times, cum = [], [], 0.0
    total = len(segs)
    for i, seg in enumerate(segs):
        a = LEAD + cum / tot * usable
        cum += weights[i]
        b = dur - 0.12 if i == total - 1 else LEAD + cum / tot * usable

        head = f"RULE {rule['no']}" + ("   ·   AMENDED" if rule["amended"] else "")
        colour = TAG_COLOUR.get(seg["kind"], "&H00EDF3FB")
        tag = tag_line(seg)

        lines = [f"{{\\fs44\\b1}}{head}"]
        if seg["kind"] == "head":
            lines.append(f"{{\\fs30\\b0\\c&H00DCE6F5}}{rule['title']}")
            foot = f"{rule['grp']}  ·  {rule['clauses']} clause(s)  ·  Deep Dive {rule['n']}/17"
        else:
            lines.append(f"{{\\fs23\\b0\\c&H00B7C6DB}}{rule['title']}")
            lines.append("")
            if tag:
                lines.append(f"{{\\fs25\\b1\\c{colour}}}{tag}")
            lines.append(f"{{\\fs29\\b0\\c&H00EDF3FB}}" + "\\N".join(wrap(seg["text"], 66)))
            lab = seg["label"]
            label = lab if (seg["kind"] != "clause" or lab.lower().startswith("rule")) else f"Clause {lab}"
            foot = f"{label}  ·  step {i+1}/{total}  ·  {rule['grp']}  ·  Deep Dive {rule['n']}/17"
        lines.append("")
        lines.append(f"{{\\fs20\\c&H007E90A8}}{foot}")

        text = "{\\rSlide}" + "\\N".join(lines)
        events.append(f"Dialogue: 0,{ts(a)},{ts(b)},Slide,,0,0,0,,{text}")
        times.append((a, b, f"{seg['label']}: {seg['text']}"))
    return STYLE + "\n".join(events) + "\n", times


def card_ass(path, lines, width, height):
    def c(hexrgb):
        h = hexrgb.lower().replace("0x", "").replace("#", "")
        if h == "white":
            return "&H00FFFFFF"
        h = h[-6:].rjust(6, "0")
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        return f"&H00{b:02X}{g:02X}{r:02X}"

    head = STYLE.replace("PlayResX: 1280", f"PlayResX: {width}").replace("PlayResY: 720", f"PlayResY: {height}")
    body = "\\N".join(f"{{\\fs{size}\\c{c(colour)}}}{t}" for t, size, colour, _ in lines)
    ev = (f"Dialogue: 0,0:00:00.00,9:59:59.00,Card,,0,0,0,,"
          f"{{\\an5\\pos({width//2},{(height//2)-30})}}{body}")
    path.write_text(head + ev + "\n", encoding="utf-8")


def render_rule(rule, crf, height):
    audio = ROOT / rule["audio"]
    dur = mp3tool.duration(str(audio))
    build = BUILD
    build.mkdir(parents=True, exist_ok=True)
    ass = build / f"rule-{rule['no']}.ass"
    text, times = slide_events(rule, dur)
    ass.write_text(text, encoding="utf-8")
    out = build / f"rule-{rule['no']}.mp4"
    w, h = 1280, height
    # dark board with two accent bars (drawbox — this ffmpeg has no drawtext)
    vf = (f"ass={ass},"
          f"drawbox=x=0:y=0:w=10:h=ih:color=0xE8A33D@0.95:t=fill,"
          f"drawbox=x=iw-6:y=0:w=6:h=ih:color=0x1E2E48@1:t=fill")
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y",
                    "-f", "lavfi", "-i", f"color=c=0x0B1524:s={w}x{h}:d={dur:.3f}:r={FPS}",
                    "-i", str(audio),
                    "-vf", vf, "-t", f"{dur:.3f}",
                    "-c:v", "libx264", "-preset", "medium", "-crf", str(crf),
                    "-pix_fmt", "yuv420p", "-r", str(FPS),
                    "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "2",
                    "-shortest", "-movflags", "+faststart", str(out)], check=True,
                   capture_output=True)
    print(f"  rule {rule['no']}: {dur:6.2f}s  slides {len(rule['segments'])}  → {out.name}")
    return out, dur, times


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--crf", type=int, default=26)
    ap.add_argument("--height", type=int, default=720)
    ap.add_argument("--rules", nargs="*", default=None)
    args = ap.parse_args()

    data = json.loads((NARR / "rules-slides.json").read_text())
    rules = data["rules"]
    if args.rules:
        rules = [r for r in rules if r["no"] in args.rules]
    BUILD.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    w, h = 1280, args.height

    clips, srt, offset = [], [], 0.0
    if not args.rules:
        intro = BUILD / "deep-intro.mp4"
        card_ass(BUILD / "deep-intro.ass", [
            ("GFR 2017  ·  CHAPTER 7 — DEEP DIVE", 40, "white", 0),
            ("Clause by clause, rule by rule", 52, "0xFFD166", 0),
            ("Rules 207 – 223  ·  sub-rules · clauses · notes · provisos · amendment", 24, "0x9AE6B4", 0),
            ("17 rules  ·  every clause read out in Hinglish", 22, "0xCBD5E1", 0),
        ], w, h)
        subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y",
                        "-f", "lavfi", "-i", f"color=c=0x0B1020:s={w}x{h}:d={INTRO}:r={FPS}",
                        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
                        "-vf", f"ass={BUILD / 'deep-intro.ass'}", "-t", f"{INTRO}",
                        "-c:v", "libx264", "-preset", "medium", "-crf", str(args.crf), "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "96k", "-shortest", str(intro)], check=True, capture_output=True)
        clips.append((intro, INTRO))
        offset = INTRO

    for r in rules:
        clip, dur, times = render_rule(r, args.crf, args.height)
        clips.append((clip, dur))
        for a, b, t in times:
            srt.append((offset + a, offset + b, t))
        offset += dur

    if not args.rules:
        outro = BUILD / "deep-outro.mp4"
        card_ass(BUILD / "deep-outro.ass", [
            ("Chapter 7 — clause coverage complete", 42, "0xFFD166", 0),
            ("17 of 17 rules  ·  every sub-rule, clause and note narrated", 26, "0xE2E8F0", 0),
            ("Numbers: 1 year · 3 years · 5 per 1,000 · ₹1,000 · ₹4,00,000 · 10% · 25%", 24, "0xE2E8F0", 0),
            ("Rule 218 threshold ₹2L → ₹4L vide DoE OM F.1/3/2024-PPD dt. 10.07.2024", 22, "0x9AE6B4", 0),
            ("Sources: GFR 2017 (DoE) · DoE compilations up to 31.01.2026", 20, "0x94A3B8", 0),
            ("Teaching aid — for official use read the rule text itself.", 20, "0x94A3B8", 0),
        ], w, h)
        subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y",
                        "-f", "lavfi", "-i", f"color=c=0x0B1020:s={w}x{h}:d={OUTRO}:r={FPS}",
                        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
                        "-vf", f"ass={BUILD / 'deep-outro.ass'}", "-t", f"{OUTRO}",
                        "-c:v", "libx264", "-preset", "medium", "-crf", str(args.crf), "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "96k", "-shortest", str(outro)], check=True, capture_output=True)
        clips.append((outro, OUTRO))

    # concat + chapters
    (BUILD / "list.txt").write_text("".join(f"file '{c.name}'\n" for c, _ in clips))
    meta = [";FFMETADATA1", "title=GFR 2017 Chapter 7 — Deep Dive (Rules 207-223)"]
    names = (["Deep Dive intro"] + [f"Rule {r['no']} — {r['title']}" for r in rules] + ["Coverage recap"]
             if not args.rules else [c[0].stem for c in clips])
    t0 = 0.0
    for (clip, dur), nm in zip(clips, names):
        meta += ["[CHAPTER]", "TIMEBASE=1/1000", f"START={int(t0*1000)}",
                 f"END={int((t0+dur)*1000)}", f"title={nm}"]
        t0 += dur
    (BUILD / "chapters.txt").write_text("\n".join(meta) + "\n")
    final = OUT / "gfr-ch7-deepdive.mp4"
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0",
                    "-i", str(BUILD / "list.txt"), "-i", str(BUILD / "chapters.txt"),
                    "-map_metadata", "1", "-c", "copy", "-movflags", "+faststart", str(final)],
                   check=True, capture_output=True)

    if not args.rules:
        with open(OUT / "gfr-ch7-deepdive.srt", "w", encoding="utf-8") as fh:
            for i, (a, b, t) in enumerate(srt, 1):
                fh.write(f"{i}\n{srt_ts(a)} --> {srt_ts(b)}\n{t}\n\n")
    print(f"\nFINAL: {final}  {t0/60:.1f} min  {final.stat().st_size/1024/1024:.1f} MB  ({len(srt)} subtitle cues)")


if __name__ == "__main__":
    main()
