#!/usr/bin/env python3
"""
Build the printable revision handout for GFR Chapter 7.

  assets/handout/gfr-ch7-handout.pdf   A4, Roman Hinglish, clause granular

  Page 1   cover: scope, the one amendment, how to use it
  Page 2   chapter map — all 17 rules, group by group
  Page 3   numbers & thresholds (the exam table) + forms + registers
  Pages 4+ rule by rule: hook, clause tree with SHALL/MAY tags, notes,
           provisos/exceptions, amendment, exam traps, cross-references
  Last     self-test (30 questions) + answers + sources & validation gate

Usage: python3 tools/make-handout.py [--lang hg]
"""
import argparse
import html
import json
import pathlib

from fpdf import FPDF

ROOT = pathlib.Path(__file__).resolve().parent.parent
NARR = ROOT / "assets" / "narration"
OUT = ROOT / "assets" / "handout"

SANS, SANS_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MONO, MONO_B = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

INK = (28, 36, 52)
MUTED = (110, 122, 140)
GOLD = (176, 116, 20)
GREEN = (22, 112, 74)
BLUE = (30, 88, 150)
RED = (166, 48, 48)

W = 180  # usable width in mm


def clean(t):
    """Flatten the Hinglish explanation text for print (no HTML, no emoji)."""
    import re
    t = str(t)
    t = re.sub(r"<br\s*/?>", " ", t)
    t = re.sub(r"</?[^>]+>", "", t)
    t = (t.replace("—", "-").replace("–", "-").replace("·", "-")
          .replace("’", "'").replace("“", '"').replace("”", '"').replace("→", "->"))
    return re.sub(r"\s+", " ", t).strip()


class Handout(FPDF):
    def __init__(self):
        super().__init__(format="A4", unit="mm")
        self.set_margins(15, 16, 15)
        self.set_auto_page_break(True, margin=16)
        self.add_font("S", "", SANS)
        self.add_font("S", "B", SANS_B)
        self.add_font("M", "", MONO)
        self.add_font("M", "B", MONO_B)
        self.chapter_title = "GFR 2017 - Chapter 7"

    def footer(self):
        self.set_y(-12)
        self.set_font("S", "", 7.5)
        self.set_text_color(*MUTED)
        self.cell(W / 2, 5, f"{self.chapter_title}  |  Rules 207-223  |  verified 25 September 2026", 0, 0, "L")
        self.cell(W / 2, 5, f"page {self.page_no()}", 0, 0, "R")

    # ── building blocks ──────────────────────────────────────────────────
    def h1(self, text, sub=None):
        self.set_x(self.l_margin)
        self.set_font("S", "B", 19)
        self.set_text_color(*INK)
        self.multi_cell(W, 9, text)
        if sub:
            self.set_x(self.l_margin)
            self.set_font("S", "", 9.5)
            self.set_text_color(*MUTED)
            self.multi_cell(W, 5.4, sub)
        self.ln(2)

    def h2(self, text):
        self.ln(2.5)
        self.set_x(self.l_margin)
        self.set_font("S", "B", 12.5)
        self.set_text_color(*GOLD)
        self.multi_cell(W, 6.4, text)
        self.set_draw_color(*GOLD)
        y = self.get_y() + 0.4
        self.set_line_width(0.5)
        self.line(self.l_margin, y, self.l_margin + W, y)
        self.ln(2.4)

    def h3(self, text, tag=None):
        self.set_x(self.l_margin)
        self.set_font("S", "B", 10.5)
        self.set_text_color(*INK)
        self.cell(12, 5.6, "")
        self.set_x(self.l_margin)
        self.multi_cell(W, 5.8, text)
        if tag:
            self.set_x(self.l_margin)
            self.set_font("S", "B", 7.6)
            col = {"AMENDED": RED, "SHALL": BLUE, "MAY": GREEN}.get(tag.split()[0], MUTED)
            self.set_text_color(*col)
            self.multi_cell(W, 4.6, f"[{tag}]")
        self.set_text_color(*INK)

    def body(self, text, size=9.2, indent=0, colour=INK):
        self.set_x(self.l_margin + indent)
        self.set_font("S", "", size)
        self.set_text_color(*colour)
        self.multi_cell(W - indent, 4.9, text)
        self.set_text_color(*INK)

    def bullet(self, text, size=9.2, marker="-", colour=INK, indent=4):
        self.set_x(self.l_margin + indent)
        self.set_font("S", "", size)
        self.set_text_color(*colour)
        w0 = self.get_string_width(marker + " ") + 0.6
        self.cell(w0, 4.9, marker)
        self.multi_cell(W - indent - w0, 4.9, text)
        self.set_text_color(*INK)

    def kv_row(self, a, b, c=None, bold=False, shade=False):
        """A table row with real columns.

        multi_cell after cell would restart at the left margin, so each column
        is placed explicitly and the row height is derived from wrapped lines.
        """
        from fpdf.enums import XPos, YPos
        x0, y0 = self.l_margin, self.get_y()
        lh = 5.2
        self.set_font("S", "", 8.8)
        wa = 42 if c is not None else 46
        wb = 68 if c is not None else W - wa
        wc = W - wa - wb if c is not None else 0

        self.set_font("S", "", 8.8)
        lines_a = self.multi_cell(wa - 2, lh, a, dry_run=True, output="LINES")
        lines_b = self.multi_cell(wb - 2, lh, b, dry_run=True, output="LINES")
        lines_c = self.multi_cell(wc - 2, lh, c, dry_run=True, output="LINES") if c else []
        h = lh * max(len(lines_a), len(lines_b), len(lines_c) or 1)

        if shade:
            self.set_fill_color(244, 246, 250)
            self.rect(x0, y0, W, h, "F")

        self.set_xy(x0, y0)
        self.set_font("S", "B" if bold else "", 8.8)
        self.set_text_color(*INK)
        self.multi_cell(wa - 2, lh, a, new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.set_font("S", "", 8.8)
        self.multi_cell(wb - 2, lh, b, new_x=XPos.RIGHT, new_y=YPos.TOP)
        if c is not None:
            self.multi_cell(wc - 2, lh, c)
        else:
            self.set_xy(x0, y0 + h)
        self.set_y(y0 + h)

def build():
    rules = json.loads((NARR / "rules-slides.json").read_text())["rules"]
    pf = NARR / "rule-points.json"
    points = json.loads(pf.read_text()) if pf.exists() else {}
    scenes = json.loads((NARR / "scenes.json").read_text())
    meta = scenes["meta"]
    OUT.mkdir(parents=True, exist_ok=True)
    pdf = Handout()

    # ── page 1: cover / scope ────────────────────────────────────────────
    pdf.add_page()
    pdf.set_fill_color(*INK)
    pdf.rect(0, 0, 210, 30, "F")
    pdf.set_y(7)
    pdf.set_font("S", "B", 17)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(W, 8, "GFR 2017 - CHAPTER 7: INVENTORY MANAGEMENT", 0, 1, "C")
    pdf.set_font("S", "", 10)
    pdf.cell(W, 5, "Rules 207 - 223  |  Hinglish revision handout  |  clause granular  |  verified 25 September 2026", 0, 1, "C")
    pdf.set_y(38)
    pdf.set_text_color(*INK)

    pdf.h2("Is chapter ka dhancha (the shape of the chapter)")
    pdf.body("Chapter 7 mein 17 rules hain (207-223). Iska flow ek hi kahani hai: maal aaya (receipt) -> maal sambhala "
             "(custody) -> maal gina (verification) -> purana/ghisela ya surplus maal beca (disposal) -> hisaab aur "
             "write-off. Har rule isi chain ka ek kadam hai, isliye exam mein sequence-based questions aate hain.")
    pdf.ln(1)
    pdf.body("Chapter 6 procurement hai (Rules 142-206) aur Chapter 8 contract management (224-227A) - Chapter 7 "
             "sirf us maal ke baare mein hai jo department ke paas pahunch chuka hai.")

    pdf.h2("Numbers jo yaad rakhne hain (ek hi jagah)")
    pdf.kv_row("Threshold / limit", "Value", "Rule", True, True)
    for a, b, c, shade in [
        ("Residual value for disposal mode", "above Rs 4,00,000", "Rule 218(i)", False),
        ("", "up to Rs 4,00,000 -> competent authority", "Rule 218(ii)", True),
        ("Physical verification - fixed assets", "at least once a year", "Rule 213(1)", False),
        ("Physical verification - consumables", "at least once a year", "Rule 213(2)", True),
        ("Library verification", "<= 20,000 volumes: every year", "Rule 215(i)", False),
        ("", "20,001-50,000: at least once in 3 years", "Rule 215(i)", True),
        ("", "> 50,000: sample, interval <= 3 years", "Rule 215(i)", False),
        ("Reasonable library loss", "5 volumes per 1,000 issued", "Rule 215(ii)", True),
        ("Book to be investigated", "value above Rs 1,000 (and rare books)", "Rule 215(ii)", False),
        ("Bid security (tender)", "10% of assessed/reserved price", "Rule 219(ii)(c)", True),
        ("Earnest money (auction)", "25% of bid value, on the spot", "Rule 220(iv)", False),
        ("Surplus presumption", "in stock over 1 year = generally surplus", "Rule 214 Note", True),
    ]:
        pdf.kv_row(a, b, c, shade=shade)

    pdf.ln(2)
    pdf.set_font("S", "B", 9.4)
    pdf.set_text_color(*RED)
    pdf.multi_cell(W, 5, "Sirf ek amendment: Rule 218 ka threshold Rs 2,00,000 se Rs 4,00,000 hua - Department of "
                         "Expenditure O.M. No. F.1/3/2024-PPD, dated 10.07.2024. Purani books mein Rs 2 lakh "
                         "milega, wo outdated hai.")
    pdf.set_text_color(*INK)

    pdf.h2("Forms, registers aur reports")
    for a, b in [
        ("GFR-10", "Report on receipt / disposal of stores (Rule 217)"),
        ("GFR-11", "Sale account of disposed goods (Rule 222)"),
        ("GFR-22", "Register of Fixed Assets (Rule 211(ii)(a))"),
        ("GFR-23", "Stock Register of consumables (Rule 211(ii)(b))"),
        ("GFR-18", "Accession Register - library books (Rule 211(ii)(c))"),
        ("GFR-24", "Register of assets of historical / artistic value (Rule 211(ii)(d))"),
    ]:
        pdf.bullet(f"{a}: {b}")

    pdf.h2("Is booklet ko kaise use karein")
    for t in [
        "Page 2 = poore chapter ka map: kaunsa rule kis group ka hai, ek line mein.",
        "Uske baad har rule ka page: 'Yaad rakho' hook, clause tree (SHALL/MAY tags ke saath), Notes, Proviso, "
        "Exceptions, Amendment aur exam traps.",
        "Ant mein self-test hai - pehle khud jawab dein, phir answers dekhein.",
        "Official use ke liye rule text khud padhein; ye revision aid hai.",
    ]:
        pdf.bullet(t)

    # ── page 2: chapter map ──────────────────────────────────────────────
    pdf.add_page()
    pdf.h1("Chapter map - Rules 207 to 223", "17 rules, 6 groups. Isi order mein story chalti hai.")
    pdf.kv_row("Rule", "Group  |  Subject", None, True, True)
    for i, r in enumerate(rules):
        pdf.kv_row(f"Rule {r['no']}",
                   f"{r['grp']}  |  {clean(r['title'])}" + ("   [AMENDED]" if r["amended"] else ""),
                   None, shade=(i % 2 == 1))

    pdf.ln(3)
    pdf.h2("Atomic units covered - the coverage ledger")
    pdf.kv_row("Rule", "Clauses", "Notes / Provisos / Exceptions / Amend", True, True)
    tot = dict(cl=0, nt=0, pv=0, ex=0, am=0)
    for i, r in enumerate(rules):
        cl = r.get("clauses", 0); nt = r.get("notes", 0); pv = r.get("provisos", 0); ex = r.get("exceptions", 0)
        am = "yes" if r["amended"] else "-"
        tot["cl"] += cl; tot["nt"] += nt; tot["pv"] += pv; tot["ex"] += ex; tot["am"] += 1 if r["amended"] else 0
        pdf.kv_row(f"Rule {r['no']}", str(cl), f"{nt} / {pv} / {ex} / {am}", shade=(i % 2 == 1))
    pdf.kv_row("TOTAL", str(tot["cl"]),
               f"{tot['nt']} / {tot['pv']} / {tot['ex']} / {tot['am']}", True, True)

    pdf.ln(3)
    pdf.set_font("S", "B", 10.5)
    pdf.set_text_color(*GOLD)
    pdf.multi_cell(W, 5.6, "Sequence jo exam mein poocha jaata hai")
    pdf.set_text_color(*INK)
    pdf.bullet("Receipt (208-209): private supplier se aaye maal par 208, apne hi division se aaye maal par 209.")
    pdf.bullet("Custody (210-212): safe custody + storage; account rakhna; hire out karne par historical cost.")
    pdf.bullet("Verification (213-215): saal mein ek baar; library ke liye alag slabs.")
    pdf.bullet("Charge transfer (216): dono officer date ke saath sign, dono ke paas copy.")
    pdf.bullet("Disposal (217-221): declare -> value -> mode -> tender/auction -> scrap.")
    pdf.bullet("Accounts & write-off (222-223): Form GFR-11, aur loss sanction.")

    # ── rule by rule ─────────────────────────────────────────────────────
    for i, r in enumerate(rules):
        pdf.add_page()
        state = "amended 10.07.2024" if r["amended"] else "current"
        tag = "AMENDED 10.07.2024" if r["amended"] else r["grp"].upper()
        pdf.h1(f"Rule {r['no']} - {r['title']}", f"{r['grp']}  |  status: {state}  |  {tag}")
        if r.get("hook"):
            pdf.set_fill_color(250, 246, 232)
            y = pdf.get_y()
            pdf.rect(pdf.l_margin, y, W, 8.6, "F")
            pdf.set_font("S", "B", 9.8)
            pdf.set_text_color(*GOLD)
            pdf.cell(30, 8.6, "Yaad rakho:")
            pdf.set_font("S", "", 9.6)
            pdf.set_text_color(*INK)
            pdf.multi_cell(W - 30, 8.6, clean(r["hook"]))
            pdf.ln(2)

        if r.get("intro"):
            pdf.body(clean(r["intro"]))
            pdf.ln(1)

        pdf.h2("Clause tree (verbatim structure)")
        for c in r["segments"]:
            kind = (c.get("kind") or "").lower()
            if kind in ("hook", "head"):
                continue
            label = clean(c.get("label") or c.get("clause") or "")
            tag_s = clean(c.get("tag") or "")
            text = clean(c.get("text") or "")
            if kind in ("note",):
                pdf.h3(f"Note{' ' + label if label else ''}", "NOTE")
            elif kind in ("proviso",):
                pdf.h3(f"Proviso{' ' + label if label else ''}", "PROVISO")
            elif kind in ("exception",):
                pdf.h3(f"Exception{' ' + label if label else ''}", "EXCEPTION")
            elif kind in ("amendment",):
                pdf.h3(f"Amendment{' ' + label if label else ''}", "AMENDED")
            elif kind in ("trap", "exam"):
                lbl = label if label and "trap" not in label.lower() else ""
                pdf.h3(f"Exam trap{' - ' + lbl if lbl else ''}", "EXAM")
            elif kind in ("intro",):
                continue
            else:
                pdf.h3(label, tag_s or ("SHALL / MAY" if "clause" in kind else None))
            if text:
                pdf.body(text, indent=4)
            pdf.ln(1.2)

        counts = []
        for lbl, key in (("clauses", "clauses"), ("notes", "notes"), ("provisos", "provisos"),
                         ("exceptions", "exceptions")):
            if r.get(key):
                counts.append(f"{r[key]} {lbl}")
        if counts:
            pdf.set_font("S", "B", 8.6)
            pdf.set_text_color(*MUTED)
            pdf.multi_cell(W, 4.6, "Atomic units in this rule: " + ", ".join(counts) +
                           (" + 1 amendment" if r["amended"] else ""))
            pdf.set_text_color(*INK)

        if r.get("amend"):
            pdf.h2("Amendment detail")
            pdf.body(clean(r["amend"]))

        pts = (points or {}).get(r["no"], [])
        if pts:
            pdf.h2("Revision one-liners")
            for t in pts[:6]:
                pdf.bullet(clean(t))

    # ── self test ────────────────────────────────────────────────────────
    import re
    quiz = json.loads((NARR / "quiz.json").read_text()) if (NARR / "quiz.json").exists() else None
    pdf.add_page()
    n_q = len(quiz) if quiz else 0
    pdf.h1(f"Self test - {n_q} questions",
           "Pehle khud likhein, phir aage ke pages par answers dekhein. "
           "Ye wahi bank hai jo app ke Exam Drill tab mein hai.")
    if quiz:
        for n, q in enumerate(quiz, 1):
            pdf.set_x(pdf.l_margin)
            pdf.set_font("S", "B", 9.4)
            pdf.multi_cell(W, 4.9, f"{n}. {clean(q['q'])}")
            pdf.set_font("S", "", 9)
            for j, opt in enumerate(q["a"]):
                pdf.set_x(pdf.l_margin + 5)
                pdf.multi_cell(W - 5, 4.6, f"({'abcd'[j]}) {clean(opt)}")
            pdf.ln(1.6)
    else:
        pdf.body("(Question bank is generated from content.js - run tools/make-handout.py after "
                 "exporting the quiz.)")

    pdf.add_page()
    pdf.h1("Answers", "Har jawab ke saath rule ka hawala aur short explanation.")
    if quiz:
        for n, q in enumerate(quiz, 1):
            pdf.set_x(pdf.l_margin)
            pdf.set_font("S", "B", 9.2)
            pdf.cell(8, 5, f"{n}.")
            pdf.set_font("S", "", 9)
            pdf.multi_cell(W - 8, 5, f"({'abcd'[q['c']]}) {clean(q['e'])}")
            pdf.ln(0.6)

    pdf.h2("Sources & validation gate")
    pdf.bullet("Base: General Financial Rules, 2017 - Department of Expenditure, Ministry of Finance (Tier 1).")
    pdf.bullet("Read with: DoE O.M. No. F.1/3/2024-PPD dated 10.07.2024 (Rule 218 threshold).")
    pdf.bullet("Compilations checked: up to 31.07.2025 (O.M. 19.09.2025) and up to 31.01.2026 (09.04.2026).")
    pdf.bullet("2026 sweep: MoF O.M. 15(04)/2021-E.II(A) dated 05.05.2026 amends Rules 309 and 310 (Chapter 12) - "
               "Chapter 7 untouched.")
    pdf.bullet("Chapter 7 has exactly one amendment (Rule 218). Chapter 7 contains no footnotes; the three Note "
               "blocks (Rules 211, 214, 218) are reproduced in full.")
    pdf.ln(1)
    pdf.set_font("S", "", 8.6)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(W, 4.6, "Teaching aid. Numbers and modes are reproduced as the rules state them; for official "
                           "decisions read the rule text and your department's own instructions.")

    out = OUT / "gfr-ch7-handout.pdf"
    pdf.output(str(out))
    return out, pdf.page_no()


def export_quiz():
    """Pull QUIZ + QUIZ_EXTRA out of the app's content layer into JSON."""
    import re
    import subprocess
    js = """
    const fs=require('fs'), vm=require('vm');
    const ctx={console}; vm.createContext(ctx);
    vm.runInContext(fs.readFileSync('content.js','utf8')+'\\n'+fs.readFileSync('granular.js','utf8')+
      '\\nthis.QUIZ=QUIZ; this.QUIZ_EXTRA=(typeof QUIZ_EXTRA!=="undefined")?QUIZ_EXTRA:[];'+
      '\\nthis.RULE_INDEX=RULE_INDEX;', ctx);
    fs.writeFileSync('assets/narration/quiz.json',
      JSON.stringify(ctx.QUIZ.concat(ctx.QUIZ_EXTRA), null, 2));
    const pts = {};
    ctx.RULE_INDEX.forEach(r => { pts[r.no] = r.key; });
    fs.writeFileSync('assets/narration/rule-points.json', JSON.stringify(pts, null, 2));
    console.log('quiz.json:', ctx.QUIZ.length + ctx.QUIZ_EXTRA.length, 'questions |',
                Object.keys(pts).length, 'rule point-sets');
    """
    p = subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True)
    print(p.stdout.strip() or p.stderr[-400:])


if __name__ == "__main__":
    argparse.ArgumentParser().parse_args()
    export_quiz()
    out, pages = build()
    print(f"{out}: {pages} pages, {out.stat().st_size/1024:.0f} KB")
