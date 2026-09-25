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
| 9 | Tender ya auction | **219, 220** | 8-step tender, 10% bid security vs 25% earnest money, IFW officer, payment-before-release |
| 10 | Scrap, sale account aur write-off | **221, 222, 223** | Scrap value + Finance consultation, Form GFR-11, write-off sanction, 4 + 5 loss heads, current orders |

Total narration: ~14 minutes. Total rules covered: **17 of 17**.

## Interactive features

- **▶ Watch** — plays like a video: narrated comic panels, timed speech bubbles, live captions,
  progress bar, auto-advance between scenes. Keyboard: `Space` play/pause, `←` `→` scene jump.
- **Hinglish ⇄ हिंदी** — every caption and speech bubble switches between Roman Hinglish and
  Devanagari (the audio is the Devanagari script).
- **Chapter map** — click any rule from 207 to 223 to jump straight to the scene that teaches it.
- **Rule map** — all 17 rules with the operative text, key points and exceptions.
- **Exam drill** — 18 MCQs with explanations, tagged by rule.
- **Aap hote to kya karte?** — one interactive decision point per scene with rule-based feedback.
- **Sources** — the validation gate and the source list behind every number in the explainer.

## Files

```
index.html            app shell
app.css               visual design
app.js                player, chapter map, rule grid, quiz, sources
content.js            scenes (narration, bubbles, rule cards, decisions), 17-rule index, quiz, sources
assets/panels/        scene-01 … scene-10 comic panels
assets/audio/         scene-01 … scene-10 Hinglish narration (MP3)
```

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
| Distortion guard | disposal mode ≠ prohibition · verification ≠ condemnation · 1-year surplus note is rebuttable · write-off sanction needed even without account adjustment |
| Flagged uncertainty | Form **GFR-18** (library books) is reported by secondary compilations of Rule 211; GFR-22/23/24 appear in the official DoE form list — verify against your departmental form list |

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
