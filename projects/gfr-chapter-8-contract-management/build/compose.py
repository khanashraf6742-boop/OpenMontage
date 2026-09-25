# -*- coding: utf-8 -*-
"""Atelier compositor (FFmpeg runtime): Pillow-rendered 1920x1080 states timed to narration,
xfade between states, per-segment mp4s, concat, SRT/VTT, chapters, timeline.json.
Usage: python3 compose.py [--render] [--segments=s01,s02]"""
import json, re, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont

HERE = Path(__file__).resolve().parent; PROJ = HERE.parent
sys.path.insert(0, str(HERE))
from narration import SEGMENTS as BASE  # noqa
from beats import BEATS as BASE_BEATS  # noqa
from narration_deep import DEEP  # noqa
from beats_deep import DEEP_BEATS  # noqa

# Interleave: base segment i, then its deep dive. chip = 0-based chapter index shown in the top bar.
SEGMENTS, BEATS = [], {}
for i, b in enumerate(BASE):
    SEGMENTS.append(dict(b, chip=i, deep=False)); BEATS[b["id"]] = BASE_BEATS[b["id"]]
    for d in DEEP:
        if d["after"] == b["id"]:
            SEGMENTS.append(dict(d, chip=i, deep=True)); BEATS[d["id"]] = dict(DEEP_BEATS[d["id"]], image=BASE_BEATS[b["id"]]["image"])

ASSETS, RENDERS = PROJ / "assets", PROJ / "renders"
FRAMES, SEGDIR = RENDERS / "frames", RENDERS / "segments"
for d in (FRAMES, SEGDIR):
    d.mkdir(parents=True, exist_ok=True)
W, H, FPS = 1920, 1080, 30
XFADE, LEAD_IN, TAIL, ANCHOR_LEAD = 0.35, 0.6, 1.2, 0.25

IVORY = (246, 241, 231); NAVY = (20, 33, 61); SAFFRON = (232, 119, 34); TEAL = (17, 138, 138)
INK = (30, 30, 36); MUTED = (110, 110, 120); WHITE = (255, 255, 255); CARD = (255, 253, 248)
GOLD = (245, 197, 66); RED = (196, 55, 55); GREEN = (33, 150, 83)

FDIR = ASSETS / "fonts"
DEJAVU = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"); DEJAVU_B = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
_cmap, _fonts = {}, {}


def cmap(p):
    if p not in _cmap:
        _cmap[p] = set(TTFont(str(p)).getBestCmap().keys())
    return _cmap[p]


def font(p, size):
    k = (str(p), size)
    if k not in _fonts:
        _fonts[k] = ImageFont.truetype(str(p), size)
    return _fonts[k]


class Face:
    """Primary font with DejaVu fallback for glyphs it lacks (₹ → ✔ ✘ ≥ ≤ ↔)."""
    def __init__(self, primary, fallback, size):
        self.size = size; self.pf, self.ff = font(primary, size), font(fallback, size); self.pc = cmap(primary)

    def runs(self, text):
        out, cur, cp = [], "", True
        for ch in text:
            p = (ord(ch) in self.pc) or ch == " "
            if cur and p != cp:
                out.append((cur, cp)); cur = ""
            cur += ch; cp = p
        if cur:
            out.append((cur, cp))
        return out

    def length(self, text):
        return sum((self.pf if p else self.ff).getlength(t) for t, p in self.runs(text))

    def draw(self, d, xy, text, fill):
        x, y = xy
        for t, p in self.runs(text):
            f = self.pf if p else self.ff
            d.text((x, y + (0 if p else int(self.size * 0.02))), t, font=f, fill=fill); x += f.getlength(t)


def face(kind, size):
    return {"title": Face(FDIR / "Poppins-Bold.ttf", DEJAVU_B, size), "semi": Face(FDIR / "Poppins-SemiBold.ttf", DEJAVU_B, size),
            "bodyb": Face(FDIR / "Inter-SemiBold.ttf", DEJAVU_B, size)}.get(kind) or Face(FDIR / "Inter-Regular.ttf", DEJAVU, size)


def wrap(fc, text, maxw):
    lines, cur = [], ""
    for w in text.split(" "):
        t = (cur + " " + w).strip()
        if fc.length(t) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def shadow_card(img, box, r=22, fill=CARD, blur=18, alpha=70):
    x0, y0, x1, y1 = box
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 10, x1, y1 + 10), radius=r, fill=(0, 0, 0, alpha))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))
    ImageDraw.Draw(img).rounded_rectangle(box, radius=r, fill=fill)


ROADMAP = [(None, ["Rule 224 — Contract karne ka authority (Art. 299(1))", "Rule 225 — General principles (i) se (xix) tak",
                   "Rule 226 — Management of contracts, BG monitoring", "Rule 227 — Legal advice before arbitration / suit",
                   "Rule 227A — Arbitral award challenge → 75% payment (2021)"]),
           ("Latest overlays covered", ["DoE OM 03.06.2024 — Arbitration & Mediation guidelines", "DoE OM 29.04.2026 — Force Majeure (West Asia)"])]


DEEP_AGENDA = [(None, ["1 Article 299 kyun + glossary (LoA, EMD, PS, BG, LD, PVC, FM)", "2 Vague → precise clauses; standard forms & advice",
                       "3 Document decision tree; LoA → contract in 21 days", "4 PVC formula — worked example", "5 Taxes, lump sum, materials, Govt property, audit copies — in practice",
                       "6 Variation vs extension vs FM; denial clause; OM 29.04.2026 timeline", "7 LD maths; warranty ↔ performance security; 3-year bar",
                       "8 Bank Guarantee lifecycle + monthly checklist", "9 Dispute ladder; s.34 timeline; ₹10 crore rule", "10 Rule 227A worked example + master sheet"])]


def draw_topbar(d, seg_i, deep=False):
    d.rectangle((0, 0, W, 64), fill=NAVY)
    f = face("semi", 24); label = "GFR 2017  ·  CHAPTER 8  ·  CONTRACT MANAGEMENT"; f.draw(d, (48, 17), label, WHITE)
    if deep:
        x = 48 + f.length(label) + 24
        d.rounded_rectangle((x, 14, x + 160, 50), radius=10, fill=TEAL); fb = face("semi", 20)
        fb.draw(d, (x + 80 - fb.length("DEEP DIVE") / 2, 20), "DEEP DIVE", WHITE)
    x = W - 48 - 10 * 46
    for i in range(10):
        on = i == seg_i
        d.rounded_rectangle((x, 16, x + 36, 48), radius=8, fill=SAFFRON if on else (44, 58, 92))
        f = face("semi", 18); lab = str(i + 1)
        f.draw(d, (x + 18 - f.length(lab) / 2, 21), lab, WHITE if on else (170, 180, 200)); x += 46
    d.rectangle((0, 64, W, 68), fill=SAFFRON)


def paste_illustration(img, path, box, zoom=1.0):
    x0, y0, x1, y1 = box; bw, bh = x1 - x0, y1 - y0
    src = Image.open(path).convert("RGB")
    s = max(bw / src.width, bh / src.height) * zoom
    src = src.resize((int(src.width * s), int(src.height * s)), Image.LANCZOS)
    cx, cy = src.width // 2, src.height // 2
    src = src.crop((cx - bw // 2, cy - bh // 2, cx - bw // 2 + bw, cy - bh // 2 + bh))
    mask = Image.new("L", (bw, bh), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, bw - 1, bh - 1), radius=22, fill=255)
    img.paste(src, (x0, y0), mask)
    ImageDraw.Draw(img).rounded_rectangle(box, radius=22, outline=NAVY, width=4)


def draw_story_panel(img, box, scene, lines):
    shadow_card(img, box, fill=WHITE); d = ImageDraw.Draw(img); x0, y0, x1, y1 = box
    d.rounded_rectangle((x0, y0, x0 + 12, y1), radius=6, fill=SAFFRON)
    face("semi", 28).draw(d, (x0 + 36, y0 + 22), scene.upper(), SAFFRON)
    y = y0 + 68; fb = face("body", 27)
    for ln in lines:
        for wl in wrap(fb, ln, x1 - x0 - 80):
            fb.draw(d, (x0 + 36, y), wl, INK); y += 38
        y += 8


def draw_rule_card(img, box, title, blocks, accent=NAVY):
    shadow_card(img, box, fill=CARD); d = ImageDraw.Draw(img); x0, y0, x1, y1 = box
    d.rounded_rectangle((x0, y0, x1, y0 + 86), radius=22, fill=accent); d.rectangle((x0, y0 + 50, x1, y0 + 86), fill=accent)
    ft = face("title", 34); tl = wrap(ft, title, x1 - x0 - 60)
    if len(tl) > 1:
        ft = face("title", 27); tl = wrap(ft, title, x1 - x0 - 60)
    ty = y0 + (86 - 40 * len(tl)) / 2 + 2
    for t in tl:
        ft.draw(d, (x0 + 30, ty), t, WHITE); ty += 40
    y = y0 + 110; inner = x1 - x0 - 100
    nlines = sum(len(b[1]) for b in blocks)
    size = 30 if nlines <= 6 else (27 if nlines <= 9 else 24)
    fb, fs, lh = face("body", size), face("semi", size - 2), int(size * 1.36)
    for sub, lines in blocks:
        if sub:
            fs.draw(d, (x0 + 30, y), sub, SAFFRON); y += lh + 4
        for ln in lines:
            d.ellipse((x0 + 34, y + size * 0.45, x0 + 46, y + size * 0.45 + 12), fill=TEAL)
            for l in wrap(fb, ln, inner):
                fb.draw(d, (x0 + 64, y), l, INK); y += lh
            y += 6
        y += 10


def draw_overlay(img, kind, title, lines, caption=None):
    img.alpha_composite(Image.new("RGBA", img.size, (20, 33, 61, 150)))
    accent = {"trap": RED, "hook": TEAL, "quiz": SAFFRON, "answer": GREEN}.get(kind, NAVY)
    fb = face("bodyb", 40); wrapped = [wl for ln in lines for wl in wrap(fb, ln, 1400)]
    ch = 150 + 60 * len(wrapped) + (70 if caption else 0)
    box = (210, (H - ch) // 2, W - 210, (H + ch) // 2)
    shadow_card(img, box, r=28, fill=WHITE, alpha=120); d = ImageDraw.Draw(img); x0, y0, x1, y1 = box
    d.rounded_rectangle((x0, y0, x1, y0 + 78), radius=28, fill=accent); d.rectangle((x0, y0 + 44, x1, y0 + 78), fill=accent)
    ft = face("title", 34); ft.draw(d, (x0 + (x1 - x0 - ft.length(title)) / 2, y0 + 20), title, WHITE)
    y = y0 + 112
    for wl in wrapped:
        fb.draw(d, (x0 + (x1 - x0 - fb.length(wl)) / 2, y), wl, INK); y += 60
    if caption:
        fc = face("body", 26); fc.draw(d, (x0 + (x1 - x0 - fc.length(caption)) / 2, y + 12), caption, MUTED)


def draw_title(img, image_path, title, sub, lines, caption, zoom):
    paste_illustration(img, image_path, (0, 0, W, H), zoom)
    img.alpha_composite(Image.new("RGBA", img.size, (20, 33, 61, 175)))
    d = ImageDraw.Draw(img); d.rectangle((0, H - 8, W, H), fill=SAFFRON)
    face("title", 78).draw(d, (120, 250), title, WHITE); face("semi", 44).draw(d, (120, 360), sub, GOLD)
    d.rectangle((120, 430, 420, 436), fill=SAFFRON)
    fb = face("body", 32); y = 470
    for ln in lines:
        fb.draw(d, (120, y), ln, (230, 234, 242)); y += 50
    if caption:
        ov = Image.new("RGBA", img.size, (0, 0, 0, 0)); ImageDraw.Draw(ov).rounded_rectangle((120, 820, 1680, 892), radius=16, fill=(0, 0, 0, 90))
        img.alpha_composite(ov); d = ImageDraw.Draw(img); fc = face("bodyb", 26)
        for wl in wrap(fc, caption, 1500):
            fc.draw(d, (144, 840), wl, (255, 226, 190))


COLORS = {"navy": NAVY, "teal": TEAL, "saffron": SAFFRON, "red": RED, "green": GREEN, "ink": INK}


def draw_diagram(img, box, spec):
    """Pillow-drawn explainer diagram in the left panel."""
    shadow_card(img, box, fill=WHITE); d = ImageDraw.Draw(img); x0, y0, x1, y1 = box
    d.rounded_rectangle((x0, y0, x1, y0 + 56), radius=22, fill=NAVY); d.rectangle((x0, y0 + 30, x1, y0 + 56), fill=NAVY)
    face("semi", 24).draw(d, (x0 + 24, y0 + 14), spec.get("title", ""), WHITE)
    ix0, iy0, ix1, iy1 = x0 + 24, y0 + 74, x1 - 24, y1 - 20; iw, ih = ix1 - ix0, iy1 - iy0
    t = spec["type"]
    if t in ("flow", "ladder", "cycle"):
        items = spec.get("nodes") or spec.get("steps"); n = len(items)
        gap = 14; bh = min(74, (ih - gap * (n - 1)) // n); fs = 22 if bh >= 60 else 19; fb = face("bodyb", fs)
        for i, it in enumerate(items):
            text, col = (it if isinstance(it, tuple) else (it, "navy")); col = COLORS.get(col, NAVY)
            indent = (i * iw // (n * 3)) if t == "ladder" else 0
            bx0, by0 = ix0 + indent, iy0 + i * (bh + gap); bx1, by1 = ix1, by0 + bh
            d.rounded_rectangle((bx0, by0, bx1, by1), radius=12, fill=(250, 248, 243), outline=col, width=3)
            d.rectangle((bx0, by0 + 8, bx0 + 8, by1 - 8), fill=col)
            lines = wrap(fb, text, bx1 - bx0 - 40)[:2]; ty = by0 + (bh - len(lines) * (fs + 6)) / 2
            for ln in lines:
                fb.draw(d, (bx0 + 24, ty), ln, INK); ty += fs + 6
            if i < n - 1 and t != "cycle":
                cx = bx0 + 40; d.line((cx, by1, cx, by1 + gap), fill=MUTED, width=3); d.polygon([(cx - 6, by1 + gap - 6), (cx + 6, by1 + gap - 6), (cx, by1 + gap)], fill=MUTED)
        if t == "cycle":
            fa = face("body", 18); fa.draw(d, (ix1 - fa.length("↻ repeats every month") - 6, iy1 - 4), "↻ repeats every month", TEAL)
    elif t == "table":
        rows = spec["rows"]; n = len(rows); rh = min(56, ih // n); fs = 20 if rh >= 44 else 17
        fk, fv = face("bodyb", fs), face("body", fs); kw = int(iw * spec.get("key_ratio", 0.34))
        for i, (k, v) in enumerate(rows):
            ry = iy0 + i * rh
            if i % 2 == 0:
                d.rectangle((ix0, ry, ix1, ry + rh), fill=(247, 244, 238))
            kl = wrap(fk, k, kw - 16)[:2]; vl = wrap(fv, v, iw - kw - 16)[:2]
            ky = ry + (rh - len(kl) * (fs + 4)) / 2; vy = ry + (rh - len(vl) * (fs + 4)) / 2
            for ln in kl:
                fk.draw(d, (ix0 + 8, ky), ln, NAVY); ky += fs + 4
            for ln in vl:
                fv.draw(d, (ix0 + kw + 8, vy), ln, INK); vy += fs + 4
        d.line((ix0 + kw, iy0, ix0 + kw, iy0 + n * rh), fill=(220, 214, 200), width=2)
    elif t == "timeline":
        pts = spec["points"]; n = len(pts); ly = iy0 + ih // 2 - 10; xs = [ix0 + 40 + i * (iw - 80) // max(1, n - 1) for i in range(n)]
        a, b = spec.get("span", (0, 0)); d.rounded_rectangle((xs[a] - 6, ly - 14, xs[b] + 6, ly + 14), radius=14, fill=(255, 231, 205))
        d.line((ix0 + 10, ly, ix1 - 10, ly), fill=NAVY, width=4)
        fl, fs2 = face("bodyb", 19), face("body", 18)
        for i, (top, bottom) in enumerate(pts):
            d.ellipse((xs[i] - 10, ly - 10, xs[i] + 10, ly + 10), fill=SAFFRON if a <= i <= b else NAVY, outline=WHITE, width=3)
            for j, ln in enumerate(wrap(fl, top, 180)[:2]):
                fl.draw(d, (xs[i] - fl.length(ln) / 2, ly - 58 + j * 22), ln, NAVY)
            for j, ln in enumerate(wrap(fs2, bottom, 180)[:3]):
                fs2.draw(d, (xs[i] - fs2.length(ln) / 2, ly + 24 + j * 22), ln, INK)
        if spec.get("note"):
            fn = face("bodyb", 20); fn.draw(d, (ix0 + (iw - fn.length(spec["note"])) / 2, iy1 - 34), spec["note"], SAFFRON)
    elif t == "calc":
        lines = spec["lines"]; n = len(lines); lh = min(64, ih // n); fs = 24 if lh >= 56 else 20; fb = face("bodyb", fs)
        for i, (text, col) in enumerate(lines):
            col = COLORS.get(col, INK); ly = iy0 + i * lh
            if col in (GREEN, SAFFRON):
                d.rounded_rectangle((ix0, ly - 4, ix1, ly + lh - 10), radius=10, fill=(232, 247, 238) if col == GREEN else (255, 240, 224))
            for j, ln in enumerate(wrap(fb, text, iw - 32)[:2]):
                fb.draw(d, (ix0 + 16, ly + 4 + j * (fs + 4)), ln, col)


FOOT = "Text: GFR 2017 as updated up to 31.01.2026 (DoE) · Educational summary — verify with the original"


def render_state(seg_i, state, out_path, deep=False):
    img = Image.new("RGBA", (W, H), IVORY + (255,)); k = state["kind"]; imgpath = ASSETS / "images" / state["image"]
    if k in ("title", "outro"):
        o = state["overlay"]; draw_title(img, imgpath, o["title"], o.get("sub") or "Rules 224 – 227A", o["lines"], o.get("caption"), state["zoom"])
        img.convert("RGB").save(out_path, "PNG"); return
    d = ImageDraw.Draw(img)
    for gx in range(0, W, 120):
        d.line((gx, 68, gx, H), fill=(238, 232, 220), width=1)
    draw_topbar(d, seg_i, deep)
    if state.get("diagram"):
        draw_diagram(img, (56, 104, 896, 576), state["diagram"])
    else:
        paste_illustration(img, imgpath, (56, 104, 896, 576), state["zoom"])
    st = state["story"]; draw_story_panel(img, (56, 604, 896, 1024), st["scene"], st["lines"])
    c = state["card"]
    if c:
        draw_rule_card(img, (944, 104, W - 56, 1024), c["title"], c["blocks"], c.get("accent", NAVY))
    elif deep:
        draw_rule_card(img, (944, 104, W - 56, 1024), "Deep dives · Roadmap", DEEP_AGENDA, TEAL)
    else:
        draw_rule_card(img, (944, 104, W - 56, 1024), "Chapter 8 · Roadmap", ROADMAP, TEAL)
    if state.get("overlay"):
        o = state["overlay"]; draw_overlay(img, o["kind"], o["title"], o["lines"], o.get("caption"))
    d = ImageDraw.Draw(img); fw = face("body", 18); fw.draw(d, (W - 56 - fw.length(FOOT), 1044), FOOT, MUTED)
    img.convert("RGB").save(out_path, "PNG")


def audio_duration(path):
    err = subprocess.run(["ffmpeg", "-i", str(path)], capture_output=True, text=True).stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", err).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def build_states(seg_i, seg, dur_audio):
    sheet = BEATS[seg["id"]]; text = seg["text"]; n = len(sheet["beats"]); last = seg_i == len(SEGMENTS) - 1
    seg_total = LEAD_IN + dur_audio + (6.0 if last else TAIL)
    states, story, card, blocks, diagram = [], {"scene": "", "lines": []}, None, [], None
    for bi, b in enumerate(sheet["beats"]):
        if b.get("diagram"):
            diagram = b["diagram"]
        t = 0.0 if b["anchor"] is None else LEAD_IN + dur_audio * text.find(b["anchor"]) / len(text) - ANCHOR_LEAD
        if states and t <= states[-1]["t"] + 0.8:
            t = states[-1]["t"] + 0.8
        k, overlay = b["kind"], None
        if k == "story":
            story = {"scene": b["scene"], "lines": b["lines"]}
        elif k in ("rule", "update", "recap"):
            blocks = [(None, list(b["lines"]))]; card = {"title": b["title"], "blocks": blocks, "accent": {"update": SAFFRON, "recap": TEAL}.get(k, NAVY)}
        elif k == "add":
            if card is None:
                blocks = [(None, [])]; card = {"title": "", "blocks": blocks, "accent": NAVY}
            if b.get("subtitle"):
                blocks.append((b["subtitle"], list(b["lines"])))
            else:
                blocks[-1][1].extend(b["lines"])
        else:
            overlay = {"kind": k, "title": b["title"], "lines": b["lines"], "caption": b.get("caption"), "sub": b.get("sub")}
        states.append({"t": t, "kind": k if k in ("title", "outro") else "scene", "image": b.get("image", sheet["image"]),
                       "zoom": 1.0 + 0.07 * bi / max(1, n - 1), "story": dict(story),
                       "card": None if card is None else {"title": card["title"], "blocks": [(s, list(l)) for s, l in card["blocks"]], "accent": card["accent"]},
                       "overlay": overlay, "beat": b, "diagram": diagram})
    for i, s in enumerate(states):
        s["dur"] = max(1.0, (states[i + 1]["t"] if i + 1 < len(states) else seg_total) - s["t"])
    return states, seg_total


def ffmpeg_segment(seg, states, seg_total, audio_path, out_mp4):
    n = len(states); inputs, filters = [], []
    for i, s in enumerate(states):
        inputs += ["-loop", "1", "-framerate", str(FPS), "-t", f"{s['dur'] + (XFADE if i < n - 1 else 0):.3f}", "-i", str(s["png"])]
        filters.append(f"[{i}:v]format=yuv420p,setsar=1[v{i}]")
    prev, acc = "v0", 0.0
    for i in range(1, n):
        acc += states[i - 1]["dur"]; filters.append(f"[{prev}][v{i}]xfade=transition=fade:duration={XFADE}:offset={acc:.3f}[x{i}]"); prev = f"x{i}"
    filters.append(f"[{prev}]fade=t=in:st=0:d=0.5,fade=t=out:st={seg_total - 0.5:.3f}:d=0.5,fps={FPS}[vout]")
    filters.append(f"[{n}:a]adelay={int(LEAD_IN * 1000)}|{int(LEAD_IN * 1000)},apad,atrim=0:{seg_total:.3f},loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *inputs, "-i", str(audio_path), "-filter_complex", ";".join(filters), "-map", "[vout]", "-map", "[aout]",
           "-t", f"{seg_total:.3f}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS),
           "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", str(out_mp4)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(r.stderr[-3000:]); raise SystemExit("ffmpeg failed " + seg["id"])


def srt_time(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def main():
    do_render = "--render" in sys.argv; only = None
    for a in sys.argv:
        if a.startswith("--segments="):
            only = a.split("=")[1].split(",")
    t0, srt, chapters, plan, order = 0.0, [], [], {}, []
    for seg_i, seg in enumerate(SEGMENTS):
        short = seg["id"][:3]; audio = ASSETS / "audio" / f"{short}.mp3"; dur_a = audio_duration(audio)
        states, seg_total = build_states(seg_i, seg, dur_a)
        active = do_render and (only is None or short in only)
        for i, s in enumerate(states):
            s["png"] = FRAMES / f"{short}_{i:02}.png"
            if active:
                render_state(seg["chip"], s, s["png"], seg.get("deep", False))
        if active:
            ffmpeg_segment(seg, states, seg_total, audio, SEGDIR / f"{short}.mp4"); print("rendered", short, flush=True)
        sents = [x.strip() for x in re.split(r"(?<=[।?!])\s+", seg["text"]) if x.strip()]; tl, cur = len(seg["text"]), 0
        for snt in sents:
            a = t0 + LEAD_IN + dur_a * cur / tl; cur += len(snt) + 1; b = t0 + LEAD_IN + dur_a * min(cur, tl) / tl
            srt.append((a, b - 0.05, snt))
        chapters.append((t0, seg["label"]))
        plan[seg["id"]] = {"start": t0, "audio_seconds": dur_a, "segment_seconds": seg_total,
                           "states": [{"t": round(t0 + s["t"], 2), "dur": round(s["dur"], 2), "kind": s["beat"]["kind"], "png": s["png"].name,
                                       "title": s["beat"].get("title") or s["beat"].get("scene") or s["beat"].get("subtitle", "")} for s in states]}
        order.append(short); t0 += seg_total
    (RENDERS / "timeline.json").write_text(json.dumps({"total_seconds": t0, "segments": plan}, ensure_ascii=False, indent=1), encoding="utf-8")
    with open(RENDERS / "captions_hinglish.srt", "w", encoding="utf-8") as f:
        for i, (a, b, s) in enumerate(srt, 1):
            f.write(f"{i}\n{srt_time(a)} --> {srt_time(b)}\n{s}\n\n")
    with open(RENDERS / "captions_hinglish.vtt", "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for a, b, s in srt:
            f.write(f"{srt_time(a).replace(',', '.')} --> {srt_time(b).replace(',', '.')}\n{s}\n\n")
    (RENDERS / "chapters.txt").write_text("".join(f"{int(t // 60):02}:{int(t % 60):02} {lab}\n" for t, lab in chapters), encoding="utf-8")
    (RENDERS / "concat.txt").write_text("".join(f"file '{(SEGDIR / (s + '.mp4')).as_posix()}'\n" for s in order))
    if do_render and only is None:
        r = subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(RENDERS / "concat.txt"), "-c", "copy",
                            "-movflags", "+faststart", str(RENDERS / "gfr_ch8_contract_management.mp4")], capture_output=True, text=True)
        if r.returncode:
            print(r.stderr[-2000:]); raise SystemExit("concat failed")
    print(f"total {t0:.1f}s ({t0 / 60:.1f} min); states={sum(len(v['states']) for v in plan.values())}")


if __name__ == "__main__":
    main()
