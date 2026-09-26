# GFR 2017 — Chapter 7: Inventory Management (Rules 207–223)
### Interactive Hinglish comic explainer video

A scene-based, narrated, clickable explainer that teaches **Chapter 7 of the General Financial
Rules, 2017 — Inventory Management, Rules 207 to 223** in simple Hinglish, with the current
Department of Expenditure (DoE) and DoPT/DARPG position baked in.

**Run it:**

```bash
python3 -m http.server 4173 --bind 0.0.0.0 --directory .
# then open http://localhost:4173
```

No build step, no dependencies — plain HTML/CSS/JS plus generated panel art and narration audio.

---

## What's inside

| # | Scene | Rules covered | Teaching point |
|---|-------|---------------|----------------|
| 1 | Chapter 7 ka naqsha | **207** | Scope — basic rules for all Ministries/Departments; departmental instructions must *conform* |
| 2 | Maal aaya, maal gaya, maal sambhala | **208, 209, 210** | Receipt (count/measure/weigh + inspection + register), issue (indent + acknowledgement), custody |
| 3 | Register alag-alag kyun? | **211, 212** | Item-wise lists; separate accounts by category; hire charges on **historical cost** |
| 4 | Saal mein ek baar | **213** | Physical verification — fixed assets & consumables, custodian's presence, certificate, Rules 33–38 |
| 5 | Kitna purana to surplus? Aur library? | **214, 215** | Buffer stock; >1 year ⇒ generally surplus; library verification tiers; 5 per 1,000; ₹1,000 rule |
| 6 | Charge ka transfer | **216** | Joint signed & dated handing-over statement, a copy each |
| 7 | Surplus/obsolete/unserviceable ghoshit karna | **217** | Who declares, recorded reasons, valuation trio, Form GFR-10, responsibility, e-waste |
| 8 | ₹4 lakh wali line | **218 [AMENDED]** | Mode of disposal by residual value; hazardous & security items; **₹2L → ₹4L change** |
| 9 | Tender ya auction | **219, 220** | 9-step tender (a)–(i), 10% bid security vs 25% earnest money, IFW officer, payment-before-release |
| 10 | Scrap, sale account aur write-off | **221, 222, 223** | Scrap value + Finance consultation, Form GFR-11, write-off sanction, 4 + 5 loss heads, current orders |

Total narration: **~13 minutes** of story scenes + **~25 minutes** of per-rule deep dives.
Total rules covered: **17 of 17**.

## 🔬 Deep Dive — granular clause tree (the core deliverable)

Every rule is broken down to the last atomic unit. For each of the 17 rules the app shows:

1. **① Verbatim clause tree** — the exact GFR text at every level:
   `Rule → sub-rule (i)(ii)… → clause (a)(b)… → sub-clause`, each tagged **SHALL / MAY / SHALL NOT**
2. **② Notes** — Rule 211 (forms can be supplemented), Rule 214 (surplus presumption), Rule 217 (e-waste),
   Rule 218 (threshold), Rule 220 (10% vs 25%)
3. **③ Provisos / conditions** — e.g. Rule 215(i) "if such verification reveals unusual or unreasonable
   shortages, complete verification shall be done"
4. **④ Exceptions** — e.g. Rule 215(ii) reasonable-loss concession, Rule 218(iii)/(iv) carve-outs
5. **⑤ Amendment / change detection** — Rule 218: old vs new text, OM number, date, effect
6. **⑥ Exam traps** — clause-level Q&A per rule
7. **⑦ Cross-references** — linked rules, forms and DFPR hooks

### Atomic units actually present in Chapter 7

| Rule | Sub-rules | Clauses / sub-clauses | Note | Proviso/condition | Exception | Amendment |
|---|---|---|---|---|---|---|
| 207 | — | — (unnumbered scope rule) | — | — | ✓ | — |
| 208 | 208(1) | (i)(ii)(iii) | — | — | ✓ | — |
| 209 | — | (i)(ii)(iii)(iv) | — | — | — | — |
| 210 | — | — (single para) | — | — | — | — |
| 211 | (i)(ii) | (ii)(a)(b)(c)(d) | ✓ | — | — | — |
| 212 | — | — (single para) | — | — | — | — |
| 213 | (1)(2)(3) | (3)(i)(ii)(iii) | — | — | ✓ | — |
| 214 | — | — | ✓ | — | ✓ | — |
| 215 | (i)(ii) | — | — | ✓ | ✓ | — |
| 216 | — | — (single para) | — | — | — | — |
| 217 | (i)–(v) | — | ✓ | — | ✓ | — |
| 218 | (i)–(iv) | (i)(a)(b) | ✓ | — | ✓ | **✎** |
| 219 | (i)(ii)(iii) | (i)(a)–(i) · (ii)(a)–(g) | — | — | ✓ | — |
| 220 | (i)–(v) | — | ✓ | — | — | — |
| 221 | — | — (2 stages) | — | — | — | — |
| 222 | — | — (single para) | — | — | — | — |
| 223 | (1)(2)(3) | (2)(i)–(iv) · (3)(i)–(v) | — | — | ✓ | — |

**Footnote honesty:** the official GFR 2017 text contains **no separate footnotes inside Chapter 7** —
only the three *Note* blocks (Rules 211, 214, 218) and the amendment marker on Rule 218. Nothing has
been invented; anything not present in the source is shown as “—” in the Coverage tab.

## Interactive features

- **▶ Watch** — plays like a video: narrated comic panels, timed speech bubbles, live captions,
  progress bar, auto-advance between scenes. Keyboard: `Space` play/pause, `←` `→` scene jump.
- **🔬 Deep Dive** — 17 rule pages with the clause tree + per-rule narration (`▶ Suniye`).
- **🏙️ City Hinglish ⇄ हिंदी** — every caption and speech bubble switches scripts; both are written
  in the *spoken* register (see “Language & voice” below). The Roman column is the narration script.
- **Chapter map** — click any rule from 207 to 223 to jump straight to the scene that teaches it.
- **Rule map** — all 17 rules with the operative text, key points and exceptions.
- **Exam drill** — 32 MCQs with explanations, tagged by rule (18 general + 14 clause-level).
- **🧩 Coverage** — the atomic ledger above, rendered live with totals.
- **Aap hote to kya karte?** — one interactive decision point per scene with rule-based feedback.
- **Sources** — the validation gate and the source list behind every number in the explainer.

## Files

```
index.html            app shell
app.css               visual design
app.js                player, chapter map, rule grid, deep dive, coverage, quiz, sources
content.js            scenes (narration, bubbles, rule cards, decisions), 17-rule index, quiz, sources
granular.js           clause tree: verbatim text + Hinglish vyakhya + notes/provisos/exceptions/amendment
                      + atomic coverage ledger + 14 clause-level MCQs
assets/panels/        scene-01 … scene-10 comic panels
assets/audio/         scene-01 … scene-10 (story) + rule-207 … rule-223 (per-rule narration)
assets/narration/     the exact TTS scripts (.txt) + speech.json (clip manifest) + timing.json
tools/                city-style.py, export-narration.js, mp3tool.py, set-timing.py
```

> **Narration status:** scenes 1–10 and rules **207–214** are recorded in the Indian-accent voice.
> Rules **215–223** (9 clips) are the last remaining batch. Every clip is synthesised from
> `assets/narration/*.txt`, which is the same text that appears on screen.

## Language & voice

**City Hinglish** is the register used throughout: the way people actually talk in a government
office, not bookish Hindi written in Roman letters.

| Bookish (first draft) | City Hinglish (now) |
|---|---|
| ke anuroop / ke tahat | ke hisaab se / ke under |
| gunjaish, maujoodgi, lagu | chance, saamne, lagte hain |
| sampatti, hastakshar, nigraani | asset, sign, supervision |
| vivaran, prastut, apekshit | details, present, expected |

Rules of the register: legal nouns stay English (rule, register, verification, tender, auction,
sanction, disposal); the grammar frame stays Hindi but in its everyday spoken form
(*hai / hoga / padega / chahiye*). The Devanagari column gets the same treatment, so it reads as
spoken Hindi rather than administrative prose. Both columns were converted with
`tools/city-style.py` (a documented, re-runnable glossary), then sentence-by-sentence reviewed.

**Voice:** Indian-accent Hinglish narration (`voice-01`, en-IN). The audio scripts are generated
from the same text that is on screen (`tools/export-narration.js`), so the voice and the captions
can never drift apart.

## Validation status — PASS

| Check | Result |
|-------|--------|
| Exact provision identified | Chapter 7 — Inventory Management, **Rules 207–223** (17 rules) |
| Current status | **[CURRENT]** — in force, read with the latest DoE compilation |
| Last verified | 25 September 2026 |
| Base source (Tier 1) | General Financial Rules, 2017 — Department of Expenditure, Ministry of Finance |
| Latest compilation checked | GFRs 2017 updated up to **31.01.2026** (uploaded 09.04.2026); also DoE OM No. 08(18)/2021-E.II(A) dated 19.09.2025 (up to 31.07.2025) |
| Amendment applied | **Rule 218** — residual-value threshold ₹2,00,000 → **₹4,00,000**, vide **DoE OM No. F.1/3/2024-PPD dated 10.07.2024** |
| Numbers verified | 1 year (213, 214) · 3 years (215) · 5 per 1,000 (215) · ₹1,000 (215) · ₹4,00,000 (218) · 10% (219) · 25% (220) |
| Form numbers verified | GFR-22 Register of Fixed Assets · GFR-23 Stock Register of consumables · **GFR-18 Accession Register** (library books, DoE forms list p.179) · GFR-24 historical/artistic assets |
| 2026 amendment sweep | MoF O.M. No. 15(04)/2021-E.II(A) dt. 05.05.2026 amends **Rules 309 & 310** (transfer/alienation of Central Government land, Chapter 12) + adds Appendix 7A/7B — **Chapter 7 unaffected** |
| Amendment position (final) | Chapter 7 has exactly **one** amendment: Rule 218, ₹2,00,000 → ₹4,00,000 (DoE OM F.1/3/2024-PPD, 10.07.2024). Nothing after it, checked up to the 31.01.2026 compilation |
| Distortion guard | disposal mode ≠ prohibition · verification ≠ condemnation · 1-year surplus note is rebuttable · write-off sanction needed even without account adjustment |

### Latest operational orders referenced

- **DoE OM No. F.1/3/2024-PPD dated 10.07.2024** — enhancement of financial limits; among other
  rules it doubled the Rule 218 disposal threshold from ₹2 lakh to ₹4 lakh.
- **Special Campaign 6.0 (SCDPM 6)** — Department of Administrative Reforms & Public Grievances
  (DARPG), Ministry of Personnel, Public Grievances & Pensions (the Ministry that houses DoPT):
  preparation phase 15–30 September 2026, implementation phase **2–31 October 2026**. The campaign
  requires **scrap disposal as per GFR** (i.e. this chapter), **e-waste disposal under the
  E-Waste (Management) Rules, 2022**, and record weeding as per the CSMOP / GFR / Public Records
  Act, 1993.
- **Rule 217(v)** itself routes hazardous waste, scrap batteries and e-waste to MoEF&CC guidelines
  and requires bidders to hold valid recycler/preprocessor registration on the date of e-auction
  and delivery.

> Educational explainer, not legal advice. Read every rule with your department's DFPR powers,
> internal instructions, and the latest DoE bi-annual compilation.
