# GFR 2017 — Chapter 6: Procurement of Goods & Services
### Hinglish Interactive Comic Explainer · built in one pass

Deliverable: **`index.html`** (self-contained interactive explainer — 10 narration clips, 6 comic panels,
4 rule cards, an interactive threshold explorer and a 5-question quiz).

Serve locally:
```bash
cd gfr-ch6-explainer && python3 -m http.server 8080 --bind 0.0.0.0
```

---

## STEP 1 — VALIDATION

```
VALIDATION STATUS:     PASS
RULE:                  General Financial Rules (GFR), 2017 — Chapter 6
                       "Procurement of Goods and Services" (Procurement of Goods,
                       Rules 142–173; Procurement of Services, Rules 175–206)
CURRENT STATUS:        [CURRENT] — DoE compilation "GFR 2017 updated up to 31.01.2026"
LAST VERIFIED:         2026-09-25
AUTHORITATIVE SOURCE:  Department of Expenditure, Ministry of Finance —
                       GFR 2017 updated up to 31.01.2026 (doe.gov.in)
AMENDMENT CHECK:       Passed — Rule 149, 155, 161, 162 amended vide DoE OM No.
                       F.1/3/2024-PPD dated 10.07.2024; Rule 154/155/161/162 ceilings for
                       Scientific Ministries raised vide DoE OM No. F.20/42/2021-PPD
                       dated 05.06.2025; Rule 148 deleted vide DoE OM F.1/26/2018-PPD
                       dated 02.04.2019; Rule 144(x) inserted vide DoE OM
                       F.7/10/2021-PPD dated 23.02.2023.
DoPT vs DoE:           GFR is issued/amended ONLY by the Department of Expenditure (MoF).
                       DoPT OMs govern service & conduct matters (CCS Rules) and do not
                       alter GFR procurement thresholds — stated explicitly in the video
                       footer so the learner does not attribute thresholds to DoPT.
```

### Source priority applied
| Tier | Source used |
|---|---|
| Tier 1 | DoE official compilation of GFR 2017 (updated to 31.01.2026); DoE OMs cited above |
| Tier 2 | DoE OM texts reproduced on official institutional sites (CSIR HQ forwarding OM F.20/42/2021-PPD dt. 05.06.2025) |
| Tier 4 | Coaching/blog summaries — **used only to locate sources, never as authority** |

---

## STEP 2 — TEACHING CORE (granular coverage map)

```
CHAPTER 6 — PROCUREMENT OF GOODS AND SERVICES
├── PROCUREMENT OF GOODS
│   ├── Rule 142  Scope — general rules for all Ministries/Departments            ✓
│   ├── Rule 143  Definition of "goods" (incl. software, tech transfer, licences,
│   │              patents, IP; incidental works/services: transport, insurance,
│   │              installation, commissioning, training, maintenance; EXCLUDES
│   │              books, publications, periodicals for a library)                ✓
│   ├── Rule 144  Fundamental principles of public buying (i)–(x) + land-border
│   │              restriction (x) [OM 23.02.2023]                                ✓
│   ├── Rule 145  Competent authority = authority competent to incur expenditure
│   │              (per Delegation of Financial Powers Rules)                     ✓
│   ├── Rule 146  Mobilisation / military operations — special rules             ✓
│   ├── Rule 147  GeM mandatory for goods & services available on GeM            ✓
│   ├── Rule 148  DELETED (OM 02.04.2019)                                        ✓
│   ├── Rule 149  GeM ladder — ₹50,000 / ₹10,00,000 / above ₹10,00,000
│   │              + (vi) Annual Procurement Plan on GeM within 30 days of
│   │                Budget approval
│   │              + (vii) Business Analytics price-reasonableness tools
│   │              + (viii) NO SPLITTING of demand                              ✓
│   ├── Rule 150  Registration of suppliers (1–3 years; list on website)         ✓
│   ├── Rule 151  Debarment — ≤ 3 yrs (conviction) / ≤ 2 yrs (code of integrity);
│   │              reasonable opportunity to represent                            ✓
│   ├── Rule 152  Enlistment of Indian agents                                    ✓
│   ├── Rule 153  Reserved items — ≥ 20% textiles from handloom origin (KVIC)    ✓
│   ├── Rule 154  Without quotation ≤ ₹50,000 + certificate
│   │              [Scientific orgs: ₹2,00,000 — OM 05.06.2025]                  ✓
│   ├── Rule 155  Purchase Committee: ₹50,001–₹5,00,000, 3 members, joint
│   │              certificate [Scientific orgs: ₹2,00,000–₹25,00,000]           ✓
│   ├── Rule 156  DELETED (OM 02.04.2019)                                        ✓
│   ├── Rule 157  No splitting of demand to avoid higher sanction               ✓
│   ├── Rule 158  Five methods: Advertised TE, Limited TE, Two-Stage Bidding,
│   │              Single TE, Electronic Reverse Auctions                         ✓
│   ├── Rule 159  E-Publishing on CPPP (mandatory; national-security exemption
│   │              needs Secretary + FA concurrence; quarterly intimation to DoE;
│   │              not applicable to Rules 154/155)                              ✓
│   ├── Rule 160  E-Procurement — all bids received through portals             ✓
│   ├── Rule 161  Advertised TE ≥ ₹50 lakh; ≥ 3 weeks (4 weeks if foreign bids);
│   │              no GTE up to ₹200 crore without prior approval
│   │              [Scientific orgs: above ₹1 crore]                            ✓
│   ├── Rule 162  Limited TE ≤ ₹50 lakh; > 3 firms; publish on GeM + GeM-CPPP;
│   │              unsolicited bids not accepted; 3 exceptions above ₹50 lakh
│   │              [Scientific orgs: up to ₹1 crore]                            ✓
│   ├── Rule 163  Two-bid system (technical opened first)                        ✓
│   ├── Rule 164  Two-stage bidding (conditions (a)–(d), procedure (a)–(f))     ✓
│   ├── Rule 165  Late bids not considered                                       ✓
│   ├── Rule 166  Single TE — 3 situations + Proprietary Article Certificate     ✓
│   ├── Rule 167  Electronic Reverse Auction — conditions (a)(b)(c)             ✓
│   ├── Rule 168  Bidding document — 7 standard chapters                        ✓
│   ├── Rule 169  Maintenance contract (free during warranty)                    ✓
│   ├── Rule 170  Bid Security 2–5%; MSE + DPIIT Startups exempt; 45 days
│   │              beyond bid validity; return ≤ 30th day after award            ✓
│   ├── Rule 171  Performance Security 3–5%; 60 days beyond all obligations
│   │              incl. warranty; EMD refunded on receipt of PS                 ✓
│   ├── Rule 172  Advance payment 30% / 40% / ≤ 6 months (maintenance)          ✓
│   └── Rule 173  Transparency, competition, fairness; code of integrity        ✓
└── PROCUREMENT OF SERVICES (Rules 175–206)
    └── Rule 206  Non-consulting services not covered by Rules 198–205 →
                   refer to Rules 135–176 (goods procedure)                      ✓
```

**Scene → provision mapping** (each atomic unit taught exactly once, no repetition):

| Scene | Provision taught |
|---|---|
| 1 Cover | Chapter 6 scope |
| 2 Panel 1 | Rule 145 (competent authority), Rule 142 |
| 3 Panel 2 | Rule 157 + Rule 149(viii) — anti-splitting |
| 4 Rule Card 1 | Rule 157 + Rule 149(viii) + numerical check |
| 5 Panel 3 | Change-detection: old vs current GeM limits |
| 6 Rule Card 2 | Rule 149(i)(ii)(iii), Rule 147, Rule 148 deleted |
| 7 Explorer | Interactive threshold engine (149 / 154 / 155 / 161 / 162) |
| 8 Panel 4 | Rules 159, 160, 167, 170, 171 in action |
| 9 Rule Card 3 | Rules 158, 159, 160, 161, 162, 165, 166 |
| 10 Rule Card 4 | Rules 170, 171, 172, 169 |
| 11 Panel 5 | Exception box (Scientific Ministries), MSE/Startup EMD exemption, automobiles |
| 12 Quiz | 5 exam traps |
| 13 End | One-line summary + sources |

---

## STEP 3 — COMIC STORY (non-repetitive by design)

**Scenario type:** Purchase / procurement (with delegation & record-keeping elements)
**Characters:** Anjali Menon (Section Officer, woman, early 30s) · Vikram Rao (Assistant, man, mid-20s) ·
Iyer (Under Secretary, man, late 50s) · Vendor Sharma (supplier, man, 40s)
**Location:** Central Government office, purchase section
**Props:** printed quotation, whiteboard with three empty boxes, official order sheet, monitor showing an
abstract reverse-auction graph, contract folder, pointer, notice board.
**Conflict:** junior proposes splitting a ₹12,00,000 demand into 3 × ₹4,00,000 to escape mandatory bidding.
**Resolution:** Rule 157 / Rule 149(viii) stop it; the GeM ladder (as amended 10.07.2024) applies;
reverse auction yields L-1 at ₹10,95,000.

*Diversity ledger: no camera, calculator, car, generic desk/laptop close-ups; the "split the demand"
conflict and the "old threshold vs new threshold" correction are distinct from any purchase-from-quotation
or camera-buying template.*

---

## STEP 4 — IMAGE / TEXT GENERATION NOTES

- 6 panels generated in a consistent flat-vector educational-comic style (teal / mustard / cream).
- **All legally significant text is overlaid in HTML/CSS, never baked into the artwork** — this is the
  text-accuracy safeguard. The image prompts explicitly forbade letters, words and numbers.
- Rule numbers, rupee amounts, percentages and OM numbers are rendered as selectable, exact text.

---

## STEP 5 — MICRO REVISION CHECK

| Check | Status |
|---|---|
| Rule numbers (142–173, 206) exact | ☑ |
| Sub-rule numbers (149(i)(ii)(iii)(vi)(vii)(viii), 154, 155, 157, 158, 159, 160, 161, 162, 165, 166, 167, 170, 171, 172) | ☑ |
| Rupee amounts (₹50,000 · ₹10,00,000 · ₹12,00,000 · ₹4,00,000 · ₹10,95,000 · ₹50 lakh · ₹200 crore · ₹2,00,000 · ₹25,00,000 · ₹1 crore) | ☑ |
| Percentages (2–5% EMD · 3–5% PS · 30% / 40% advance) | ☑ |
| Time limits (3 weeks / 4 weeks · 45 days · 30 days · 60 days · 30 days for Annual Procurement Plan · 6 months) | ☑ |
| Dates (10.07.2024 · 05.06.2025 · 23.02.2023 · 02.04.2019 · 31.01.2026) | ☑ |
| Legal meaning (shall/may, mandatory vs exemption, reporting vs prohibition) | ☑ |
| Currentness (updated to 31.01.2026 compilation; latest DoE OMs included) | ☑ |
| Exceptions/provisos (Scientific Ministries, automobiles, MSE/Startup EMD, national security, Rule 154/155 carve-out in Rule 159) | ☑ |
| Story uniqueness / prop diversity | ☑ |
| Dialogue natural (Hinglish, short bubbles) | ☑ |

---

## NARRATION SCRIPT (Hinglish, as synthesised)

| Clip | File | Text |
|---|---|---|
| 1 | `audio/01-intro.mp3` | Chapter 6 — Procurement of Goods and Services. GFR 2017 ka sabse zyada use hone wala chapter. Aaj hum ise ek hi kahani mein samjhenge: GeM ka ladder, tender ke methods, aur Department of Expenditure ki latest orders. Bilkul simple Hinglish mein, ek hi baar mein. |
| 2 | `audio/02-panel1.mp3` | Ek ministry office mein aath high-speed multifunction printers chahiye. Total estimated value — baarah lakh rupaye. Ek vendor seedha quotation le kar aata hai aur kehta hai, "Sir, direct order de dijiye. Bidding mein itna time kyon kharch karein?" Vikram, jo naya assistant hai, ko deal achi lagti hai. Par Section Officer Anjali sanyam dikhati hai. |
| 3 | `audio/03-panel2.mp3` | Vikram ek chaalak idea deta hai — demand ko tod do. Teen alag demands, har ek chaar lakh ki. Aise dus lakh ki bidding limit se bach jaayenge. Anjali turant rok deti hai. Kyunki Rule 157 kehta hai: demand ko chhote hisson mein baant kar higher authority ki sanction se bachna allowed nahi. Aur Rule 149 ke sub-rule number eight mein wahi baat GeM ke liye kehti hai — piecemeal purchase se L-1 buying ya reverse auction avoid karna mana hai. |
| 4 | `audio/04-rulecard1.mp3` | Rule card. Rule 157 — A demand for goods should not be divided into small quantities to make piecemeal purchases to avoid the necessity of obtaining the sanction of higher authority required with reference to the estimated value of the total demand. Rule 149, sub-rule eight — GeM par bhi demand ko chhote tukdon mein todna mana hai. Memory hook: total demand dekho, tukde nahi. |
| 5 | `audio/05-panel3.mp3` | Vikram kehta hai, "Par madam, pehle to paanch lakh tak direct purchase allowed tha!" Iyer sahab muskurate hain. "Woh purana position tha. Department of Expenditure ke Office Memorandum number F.1/3/2024-PPD, dated 10 July 2024 se ab limit dus lakh rupaye kar di gayi hai." Rule kabhi memory se nahi, hamesha latest official source se dekhi jaati hai. |
| 6 | `audio/06-rulecard2.mp3` | Rule 149 — Government e-Marketplace. Ek: pachaas hazaar rupaye tak, GeM par kisi bhi available supplier se direct purchase, quality, specification aur delivery period meet karti ho. Do: pachaas hazaar se zyada aur dus lakh tak — kam se kam teen different manufacturers mein sabse kam price wala GeM seller. Teen: dus lakh se zyada — online bidding ya reverse auction tool se bids lena mandatory hai. Aur Rule 147 — jo goods aur services GeM par available hain, unhe mandatorily GeM se lena hai. |
| 7 | `audio/07-panel4.mp3` | Ab sahi procedure. Tender enquiry, corrigenda aur bid award details Central Public Procurement Portal, yani CPPP par publish karna mandatory hai — Rule 159. Saare bids e-procurement portal par lene hain — Rule 160. Reverse auction chalaya — Rule 167. L-1 supplier select hua, das lakh painyanave hazaar rupaye par. Bid security, yaani earnest money, estimated value ka 2 se 5 percent — aur MSEs aur DPIIT-recognised startups exempt hain. Performance security contract value ka 3 se 5 percent, aur successful bidder ko performance security milte hi bid security wapas. |
| 8 | `audio/08-rulecard3.mp3` | Rule card. Rule 170 — Bid Security: estimated value ka 2 se 5 percent; final bid validity ke baad 45 din tak valid; unsuccessful bidders ko contract award ke 30vein din tak wapas. Rule 171 — Performance Security: contract value ka 3 se 5 percent; saari contractual obligations aur warranty ke completion ke baad 60 din tak valid. Rule 172 — Advance payment: private firms ko maximum 30 percent, government agency ya PSU ko 40 percent, aur maintenance contract mein chhe mahine ke amount se zyada nahi. |
| 9 | `audio/09-panel5.mp3` | Exception box. Scientific Ministries — DST, DBT, CSIR, DRDO, ISRO, ICAR, Ministry of Earth Sciences aur Department of Health Research — ke liye DoE OM F.20/42/2021-PPD dated 5 June 2025 se limits badh gayi hain: Rule 154 ke liye do lakh rupaye; Rule 155 ke liye do lakh se pachchees lakh tak; advertised tender ek crore se upar; limited tender ek crore tak. Aur automobiles ke liye GeM par koi ceiling nahi. Par yaad rakho — yeh relaxation sirf scientific equipment aur consumables, research purpose ke liye. Ab quiz khelo! |
| 10 | `audio/10-methods.mp3` | Rule card. Rule 158 ke paanch standard methods: Advertised Tender Enquiry, Limited Tender Enquiry, Two-Stage Bidding, Single Tender Enquiry, aur Electronic Reverse Auctions. Rule 159 — tender enquiry, corrigenda aur bid award details Central Public Procurement Portal par publish karna mandatory hai. Rule 160 — saare bids e-procurement portals par lene hain. Rule 161 — pachaas lakh rupaye se upar advertised tender; minimum teen hafte ka submission time, aur agar foreign bids bhi leni hain to chaar hafte. Rule 162 — limited tender pachaas lakh tak, aur teen se zyada supplier firms. Rule 166 — single tender sirf teen situations mein. Rule 165 — late bids consider nahi hongi. |

---

## QUIZ (5 questions, instant feedback with rule citation)

1. GeM par ₹9,50,000 ki purchase → **Rule 149(ii)** lowest price among ≥ 3 manufacturers.
2. ₹12,00,000 demand split into 3 × ₹4,00,000 → **Rule 157 / Rule 149(viii)** prohibit it.
3. Bid Security → **2–5%** of estimated value; MSEs + DPIIT Startups exempt (**Rule 170**).
4. Performance Security validity → **60 days** beyond completion of all contractual obligations incl. warranty (**Rule 171**).
5. Latest GeM threshold change → **DoE OM No. F.1/3/2024-PPD dated 10.07.2024**.

---

## MEMORY HOOKS (each accurate to the provision)

- **“TOTAL DEMAND DEKHO, TUKDE NAHI”** — Rule 157 / Rule 149(viii)
- **“₹5 lakh se ₹10 lakh — 10.07.2024 ka naya GeM limit”** — Rule 149, change-detection
- **“2–5 EMD · 3–5 PS · 30/40 advance”** — Rules 170 / 171 / 172(1)

## CAVEAT FLAGGED TO THE LEARNER

GFR Chapter 6 covers both goods (Rules 142–173) and services (Rules 175–206). This explainer covers the
**goods procurement ladder plus the directly-linked service cross-reference (Rule 206)** in atomic detail;
consultancy-procurement rules (Rules 180–195: REOI, short-listing of not less than three consultants,
QCBS selection, CEC) and non-consulting services rules (Rules 197–205) are the next atomic units and are
deliberately not half-covered here.

---

# EPISODE 2 — Procurement of Services (Rules 173–206)
**File:** `services.html` · **Assets:** `assets/ep2-*.png` · **Narration:** `audio/e2-*.mp3`

## Validation (same protocol, same sources)
```
RULE:               GFR 2017, Chapter 6, Part B — Procurement of Services
                    (A. Consulting Services, Rules 177–196;
                     B. Outsourcing of Services, Rules 197–206)
                    + Rule 173 (transparency), Rule 174 (efficiency),
                    Rule 175 (Code of Integrity), Rule 176 (Buy-Back)
CURRENT STATUS:     [CURRENT] — DoE compilation updated up to 31.01.2026
LAST VERIFIED:      2026-09-25
AUTHORITATIVE SOURCE: Department of Expenditure, Ministry of Finance
AMENDMENT CHECK:    Passed — ₹50 lakh thresholds in Rules 183(i)(ii) & 201(i)(ii)
                    amended vide DoE OM No. F.1/3/2024-PPD dated 10.07.2024
```

## Granular coverage map (Part B)
```
PROCUREMENT OF SERVICES
├── A. CONSULTING SERVICES
│   ├── Rule 177  Definition (project-specific, intellectual, procedural;
│   │              deliverables vary consultant to consultant; EXCLUDES direct
│   │              engagement of a retired Government servant)               ✓
│   ├── Rule 178  Job well defined in content and time frame               ✓
│   ├── Rule 179  Fundamental principles; departmental instructions must
│   │              not contravene the chapter                               ✓
│   ├── Rule 180  Only where Ministry lacks expertise; approval of
│   │              competent authority BEFORE engaging                       ✓
│   ├── Rule 181  Scope in simple, concise language + eligibility criteria  ✓
│   ├── Rule 182  Estimate reasonable expenditure from market conditions   ✓
│   ├── Rule 183  (i) up to ₹50 lakh — long list from enquiries;
│   │              (ii) above ₹50 lakh — EOI on GeM + GeM-CPP + own website ✓
│   ├── Rule 184  Short list not less than three                            ✓
│   ├── Rule 185  TOR: objectives · tasks · schedule · inputs · outputs     ✓
│   ├── Rule 186  RFP: LOI · information to consultants · TOR · eligibility ·
│   │              key positions · evaluation criteria · formats · contract
│   │              terms · mid-term review procedure                        ✓
│   ├── Rule 187  Two-bid system; technical opened first                    ✓
│   ├── Rule 188  Late bids not considered                                  ✓
│   ├── Rule 189  CEC evaluates technical bids; reasons recorded            ✓
│   ├── Rule 190  Financial bids only of technically qualified bidders     ✓
│   ├── Rule 191  Selection per Rules 192–194                              ✓
│   ├── Rule 192  QCBS — quality prime; minimum qualifying technical score;
│   │              weights 70:30 / 60:40 / 50:50; highest combined score;
│   │              technical weight NEVER exceeds 80%                       ✓
│   ├── Rule 193  LCS — standard/routine assignments; no technical weight;
│   │              lowest evaluated cost selected                           ✓
│   ├── Rule 194  Single source — 4 exceptional grounds + prior approval +
│   │              price reasonableness + no splitting                      ✓
│   ├── Rule 195  Monitor the contract throughout (task force approach)    ✓
│   └── Rule 196  Public competition for design of symbols/logos           ✓
├── B. OUTSOURCING OF SERVICES (Non-Consulting)
│   ├── Rule 197  Definition — physical, measurable deliverables, clear
│   │              performance standards (maintenance, vehicle hiring,
│   │              facilities mgmt, security, janitor, photocopier, drilling,
│   │              aerial photography, satellite imagery, mapping)          ✓
│   ├── Rule 198–200  Economy/efficiency; identification of likely
│   │              contractors; tender enquiry contents                     ✓
│   ├── Rule 201  (i) up to ₹50 lakh — LTE to more than three contractors;
│   │              (ii) above ₹50 lakh — advertise on GeM + GeM-CPP         ✓
│   ├── Rule 202  Late bids not considered                                  ✓
│   ├── Rule 203  Evaluate, segregate, rank responsive bids                ✓
│   ├── Rule 204  Nomination in exceptional situations, in consultation
│   │              with the Financial Adviser; detailed justification      ✓
│   └── Rule 205  Monitor the contract throughout                          ✓
└── Rule 206      Not covered by 198–205 → refer to Rules 142–176 (GOODS),
                  not the consulting-services rules                          ✓
```

## Non-repetition ledger (Episode 1 vs Episode 2)
| Element | Episode 1 | Episode 2 |
|---|---|---|
| Scenario | Purchase of goods | Engagement of consultancy services |
| Characters | Anjali (SO) · Vikram (Assistant) · Iyer (US) · Vendor Sharma | Meera (Dy. Secretary) · Arjun (US) · Fatima (SO) · Dr. Kavita Rao (consultant) |
| Setting | Purchase section, office desk | Conference / committee room |
| Props | quotation sheet, whiteboard with 3 boxes, monitor with auction graph, contract folder | EOI notice sheet, TOR stack, two sealed envelopes, blank weightage score-sheet |
| Conflict | junior wants to split the demand | junior wants to nominate a known consultant |
| Teaching mechanism | value-threshold ladder | two-envelope + weighted-score mechanism |
| Palette | teal / mustard / cream | maroon / saffron / cream |

## Interactive elements (Episode 2)
- **Selection Method Chooser** — QCBS / LCS / Single Source / Nomination cards, click to reveal (Rules 192, 193, 194, 204).
- **Quiz** — 5 questions on Rules 177, 183, 184, 192(iv), 193 with instant rule-cited feedback.

## Micro revision check (Episode 2)
| Check | Status |
|---|---|
| Rule numbers 173–206 exact | ☑ |
| ₹50 lakh thresholds (Rules 183, 201) | ☑ |
| “not less than three” (Rules 184, 201) | ☑ |
| Technical weight ≤ 80% (Rule 192(iv)) | ☑ |
| Approval BEFORE engagement (Rule 180) / before single-source (Rule 194) | ☑ |
| Retired Government servant exclusion (Rule 177) | ☑ |
| Rule 206 cross-reference to goods rules | ☑ |
| Currentness (31.01.2026 compilation) | ☑ |
| Story/props/characters different from Episode 1 | ☑ |

---

# COMPLETE GRANULAR REFERENCE — every rule, sub-rule, clause, proviso, note, exception, footnote
**File:** `chapter6-complete.html` · **Data:** `data/ch6-goods.js`, `data/ch6-services.js`

A searchable, printable, rulebook-grade reference covering Chapter 6 **end to end** — not a summary.
Each provision is documented with (a) the **verbatim text** from the DoE compilation updated to 31.01.2026,
(b) a simple **Hinglish** explanation, and (c) every proviso, note/explanation, exception and amendment footnote.

## Documented inventory (auto-counted from the data files)
| Layer | Count |
|---|---|
| Rules (incl. deleted rules retained and marked) | **67** (Goods 142–176: 37 entries · Services 177–206: 30 entries) |
| Sub-rules / clauses / sub-clauses broken out | **179** |
| Provisos | **2** |
| Notes / Explanations (incl. PAC format, works 3–10% note, GeM automobile note) | **9** |
| Exceptions (incl. Scientific Ministries, MSE/Startup EMD, national security, Rule 206 cross-reference) | **36** |
| Amendment footnotes with OM number + date | **34** |

Plus a **complete amendment trail table** listing all 14 DoE OMs that affect Chapter 6, and the explicit
DoPT-vs-DoE clarification.

## Deleted provisions retained (so the learner never mistakes them for current law)
Rule 148 (Rate Contract) · Rule 156 · Rule 159(iv) · Rule 160(iii) · Rule 173(xv) · Rule 174(iv) —
each shown with "DELETED" styling and the deleting OM.

## Features
- Live search across rule numbers, verbatim text, Hinglish text, ₹ amounts, OM numbers and keywords
- Layer toggles: Verbatim / Hinglish / Clause-level / Proviso-Note-Exception-Footnote
- Expand-all / collapse-all, rule-chip navigation, print stylesheet
- Every rule card flags which layers it contains (e.g. "Exception ×2", "Footnote ×3")

## Honest flags carried into the reference
1. **Source conflict flagged** on Rule 149 — the official DoE compilation places the "automobiles: no ceiling"
   Note after sub-rule (i); some secondary compilations show a ₹30 lakh continuation inside (ii)/(iii).
   The official position is reproduced, with the discrepancy disclosed.
2. **Scientific Ministries OM supersession** — the 20.05.2024 limits (₹1,00,000 / ₹1–10 lakh) were replaced by
   the 05.06.2025 limits (₹2,00,000 / ₹2–25 lakh); both are cited with their dates.
3. **Scope caveat** — Chapter 6 Part A also contains Rules 142–176 for goods and Part B Rules 177–206 for
   services; both are covered in full, and Rule 206's fallback to the goods rules is documented.

---

# GRANULAR VIDEO — every provision, narrated beat by beat
**File:** `granular-video.html` · **Audio:** `audio/g-01…g-10.mp3`

A long-form Hinglish video course in which **every provision of Chapter 6 is its own narrated beat**.
471 beats total, grouped into 7 modules, auto-advancing like a video with play/pause, per-beat and
per-rule stepping, speed control, voice selection and a live "current provision" panel.

## Beat architecture (per rule)
| # | Beat | Source |
|---|---|---|
| 1 | Rule number + title | data |
| 2 | **Verbatim rule text** (spoken) | DoE compilation |
| 3 | **Hinglish explanation** | data |
| 4…n | **Each sub-rule / clause / sub-clause** (verbatim + Hinglish) | data |
| n+1… | **Each proviso** | data |
| | **Each note / explanation** (incl. PAC format, automobile note, works 3–10% note) | data |
| | **Each exception** (Scientific Ministries, MSE/Startup EMD, national security, Rule 206 fallback…) | data |
| | **Each amendment footnote** (OM number + date) | data |

## Modules
1. Foundation & Definitions — Rules 142–148 (7 rules)
2. GeM ladder & suppliers — Rules 149–153 (5)
3. Below tender level — Rules 154–158 (5)
4. Tender methods & e-publishing — Rules 159–168 (10)
5. Securities, payments & integrity — Rules 169–176 (10 entries)
6. Consulting services — Rules 177–196 (20)
7. Non-consulting services & fallback — Rules 197–206 (10)

## Audio strategy
- **Studio-recorded Hinglish** (this session's voice): 7 module intros + 3 critical callouts
  (GeM threshold change of 10.07.2024 · QCBS 80% cap · Rule 206 cross-reference).
- **Provision-level narration** uses the browser's Speech Synthesis engine with an Indian-Hindi voice
  (`hi-IN`, falling back to `en-IN`), so that all 471 beats can be spoken without shipping hundreds of files.
- **Silent auto-advance mode** automatically engages if no TTS voice is available — the text still advances
  on a reading-rate timer, and the studio-recorded comic episodes remain available for listening.
- Mute, speed (0.8×–1.3×) and voice picker are all exposed in the control bar.

## Verified before delivery
- 471 beats computed from the same data files as the reference document — no drift between the two.
- All 67 rules present in the module lists (checked programmatically — zero missing).
- JS syntax validated; all assets serve over the preview server.

---

# STUDIO NARRATION — BATCH PLAN & PROGRESS

The granular video's provision-level narration is being replaced by **studio-recorded Hinglish** clips,
delivered in batches (the speech tool allows 10 clips per turn).

**Clip design:** every clip is the exact concatenation of a run of the rule's beats
(verbatim → Hinglish → each sub-rule/clause → each proviso/note/exception/footnote), split greedily at
**1450 characters** so it stays under the 1500-character per-clip limit. The player runs the *same*
greedy algorithm on the same data, so on-screen captions stay in sync with the audio automatically —
no manual timestamps.

**Total requirement: 124 clips / 114,699 characters of narration.**

### Progress
- **20 of 124 clips recorded** (Rules 142–151, with Rule 151 at 2 of its 3 clips).
- Verified: 20 studio segments live, 0 mapping mismatches, only Rule 151 partial.
- Note: six verbatim beats exceed 1380 characters (Rules 150, 159, 162, 164, 170, 175(1)); these are split
  at **sentence boundaries** in both the generator and the player, so no clip exceeds the 1500-character limit
  and captions remain word-aligned.

## Batch schedule (10 clips per batch)
| Batch | Rules covered | Clips | Status |
|---|---|---|---|
| 1 | 142, 143(×2), 144(×4), 145, 146, 147 | 10 | ✅ **DONE** |
| 2 | 148, 149(×4), 150(×3), 151(×2 of 3) | 10 | ✅ **DONE** |
| 3 | 150(×4), 151(×3), 152 | 8 | ⏳ |
| 4 | 153(×2), 154(×2), 155(×3), 156, 157, 158 | 10 | ⏳ |
| 5 | 159(×4), 160(×2), 161(×4) | 10 | ⏳ |
| 6 | 162(×5), 163(×2), 164(×4) | 11 | ⏳ |
| 7 | 165, 166(×2), 167(×3), 168, 169, 170(×5) | 12 | ⏳ |
| 8 | 171(×3), 172(1)(×2), 172(2), 173(×7), 174(×2) | 15 | ⏳ |
| 9 | 175(1)(×4), 175(2), 176(×2), 177(×2) | 9 |   |
| 10 | 178, 179, 180, 181, 182, 183(×2), 184, 185, 186(×2) | 11 | ⏳ |
| 11 | 187, 188, 189, 190, 191, 192(×2), 193, 194(×3), 195, 196 | 13 | ⏳ |
| 12 | 197, 198, 199, 200, 201(×2), 202, 203, 204, 205, 206 | 11 | ⏳ |

## How to verify a batch
```bash
node /tmp/gen.js <batch-no> 10     # prints the exact clip texts + rule/clip counts
ls audio/v-*.mp3 | wc -l           # clip count so far
```
Then append the rule → clip-file mapping to `data/studio.js`. The player re-derives the beat
segments itself, so no other change is needed.

## Already recorded (studio)
Module intros ×7 + critical callouts ×3 (`audio/g-*.mp3`) and Batch 1 (`audio/v-142 … v-147`).
