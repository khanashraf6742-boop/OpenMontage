# -*- coding: utf-8 -*-
"""Beat sheet for deep-dive segments. Same kinds as beats.py plus an optional "diagram" key on any beat
(replaces the left panel illustration with a Pillow-drawn diagram; persists until replaced).
Diagram specs: {"type": "flow"|"table"|"timeline"|"calc"|"ladder"|"cycle", ...}"""

DEEP_BEATS = {
 "d01_why_299": {"chip": 0, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 1 · Article 299 kyun?",
   "lines": ["Rule 224 = Article 299(1) ka procedural roop", "3 conditions + Chapter 8 ki shabdavali"],
   "diagram": {"type": "flow", "title": "Article 299(1) — teen sharten", "nodes": [("Expressed in the name of the President", "navy"), ("Executed by a person authorised by the President", "navy"), ("Executed in the manner directed / authorised", "navy"), ("Koi bhi shart missing → contract Govt par binding nahi", "red")]}},
  {"anchor": "Article 299 clause एक कहता है", "kind": "rule", "title": "Article 299 — Constitution of India",
   "lines": ["299(1): Contracts in exercise of Union's executive power → expressed in President's name; executed by authorised persons, in authorised manner", "Rule 224(1)/(2) isi ko GFR mein utaarte hain"]},
  {"anchor": "Article 299 clause दो", "kind": "add", "lines": ["299(2): President / signing officer personally liable NAHI"]},
  {"anchor": "अब Chapter 8 की शब्दावली", "kind": "rule", "title": "Chapter 8 glossary",
   "lines": ["LoA — Letter of Award: successful bidder ko award ki soochna"],
   "diagram": {"type": "table", "title": "Shabdavali (glossary)", "rows": [("LoA", "Letter of Award"), ("EMD / Bid security", "Rule 170 · ordinarily 2–5% of estimated value (ya Bid Security Declaration)"), ("Performance security", "Rule 171 · 5–10% of contract value · valid 60 days beyond all obligations incl. warranty"), ("BG", "Bank ka demand par bhugtan ka vaada"), ("LD", "Liquidated Damages — delay par pre-agreed recovery"), ("PVC", "Price Variation Clause — index-linked price adjustment"), ("FM", "Force Majeure — control se bahar ki ghatna")]}},
  {"anchor": "Bid security या E M D", "kind": "add", "lines": ["EMD / Bid security — Rule 170: ordinarily 2–5% of estimated value; Bid Security Declaration bhi possible"]},
  {"anchor": "Performance security —", "kind": "add", "lines": ["Performance security — Rule 171: 5–10% of contract value; valid till 60 days after ALL obligations (warranty samet)"]},
  {"anchor": "Bank Guarantee — bank", "kind": "add", "lines": ["BG — bank ka vaada: demand par Govt ko rakam", "LD — delay par pehle se tay recovery", "PVC — input prices badalne par price adjust karne ka formula", "FM — control se bahar ki ghatna"]},
 ]},

 "d02_precision": {"chip": 1, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 2 · Vague → precise",
   "lines": ["3 clauses ko Rule 225(i) ke test par kaso", "Standard forms kahan milte hain?"],
   "diagram": {"type": "table", "title": "Vague clause → precise clause", "rows": [("✘ payment terms as may be decided later", "✔ 100% of monthly bill within 30 days of service certificate"), ("✘ delivery at the earliest", "✔ within 45 days of contract date, at consignee store, incl. installation & commissioning"), ("✘ rates as per actuals", "✔ fixed rate per unit, inclusive of taxes, firm for contract period")]}},
  {"anchor": "पहला —", "kind": "rule", "title": "Rule 225(i) in practice", "lines": ["Vague: ‘payment terms as may be decided later’ → Precise: 100% of monthly bill within 30 days of satisfactory service certificate"]},
  {"anchor": "दूसरा —", "kind": "add", "lines": ["Vague: ‘delivery at the earliest’ → Precise: within 45 days of contract, at consignee store, incl. installation + commissioning"]},
  {"anchor": "तीसरा —", "kind": "add", "lines": ["Vague: ‘rates as per actuals’ = open liability → Precise: fixed rate per unit, taxes incl., firm for contract period", "Indefinite liability = Govt ki dendari ki koi upper limit nahi"]},
  {"anchor": "अब standard forms क्या हैं", "kind": "rule", "title": "Standard forms + advice (Rule 225(ii)–(iii))",
   "lines": ["DoE Procurement Manuals ke model bidding documents", "GeM General Terms & Conditions", "Works: CPWD-type standard contract forms", "Clause badalna ho → IFD (financial) + Legal Adviser / Ministry of Law (legal)"],
   "diagram": {"type": "flow", "title": "Clause badalne ka raasta", "nodes": [("Standard form / model document lo", "teal"), ("Badlaav zaroori? → reasons record", "navy"), ("Financial advice (IFD)", "navy"), ("Legal advice (Legal Adviser / M/o Law)", "navy"), ("Tab hi modified clause use karo", "green")]}},
  {"anchor": "Practical tip", "kind": "hook", "title": "5-SAWAAL TEST", "lines": ["Kya · Kitna · Kab · Kahan · Nahi hua to kya?", "Jawab ‘baad mein tay hoga’ = Rule 225(i) fail"]},
 ]},

 "d03_doc_tree": {"chip": 2, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 3 · Decision tree", "lines": ["Kaunsa document kab? — 2 sawaal", "LoA → contract: 21 din ka raasta"],
   "diagram": {"type": "flow", "title": "Rule 225(iv) decision tree", "nodes": [("Q1: Turnkey / maintenance / services? → HAAN → contract document HAMESHA  [d]", "saffron"), ("NAHI → Q2: amount?", "navy"), ("≤ ₹2.5 lakh simple purchase → Purchase Order  [a]", "teal"), ("₹1–10 lakh, GCC/SCC + scope in bid docs → LoA = contract  [b]", "teal"), ("Works ≥ ₹10 lakh / purchase > ₹10 lakh → self-contained or one-page contract  [c]", "teal")]}},
  {"anchor": "पहला सवाल", "kind": "rule", "title": "Decision tree — Rule 225(iv)", "lines": ["Q1 Turnkey / maintenance / services? → contract document always [(d)]"]},
  {"anchor": "नहीं, तो दूसरा सवाल", "kind": "add", "lines": ["Q2 Amount: ≤ ₹2.5 lakh simple purchase → PO [(a)]", "₹1–10 lakh with GCC/SCC + scope → LoA is the contract [(b)]", "Works ≥ ₹10 lakh / purchase > ₹10 lakh → self-contained / one-page contract [(c)]"]},
  {"anchor": "ध्यान दो — a और b", "kind": "add", "lines": ["Overlap ₹1–2.5 lakh: simple purchase → PO kaafi; (b) tab jab bid documents poore the aur LoA ko hi contract banana hai"]},
  {"anchor": "अब LoA से contract", "kind": "rule", "title": "LoA → contract in 21 days (Rule 225(vi))",
   "lines": ["LoA issue → bidder acceptance → performance security → agreement signed — sab 21 din mein", "Kyun 21? Bidder LoA lekar baitha na rahe; market badalne par mukar na sake", "Default → award annulled + bid security (Rule 170 EMD) forfeited"],
   "diagram": {"type": "timeline", "title": "21 din ki ghadi", "points": [("Day 0", "LoA issued"), ("", "Acceptance"), ("", "Performance security"), ("Day 21", "Agreement signed")], "span": (0, 3), "note": "Miss → annul + EMD forfeit"}},
  {"anchor": "GeM पर purchase", "kind": "add", "lines": ["GeM: system-generated GeM contract = contract document"]},
  {"anchor": "और clause पाँच का", "kind": "trap", "title": "EXAM TRAP", "lines": ["‘Kaam shuru karao, order baad mein’ = Rule 225(v) ka seedha ullanghan"]},
 ]},

 "d04_pvc_math": {"chip": 3, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 4 · PVC worked example", "lines": ["Illustrative numbers — asli formula contract / Appendix 11 se", "Fixed 15% · Labour 25% · Material 60%"],
   "diagram": {"type": "calc", "title": "PVC — illustrative calculation", "lines": [("P1 = P0 × [ F + a·(L1/L0) + b·(M1/M0) ]", "navy"), ("F = 0.15   a = 0.25   b = 0.60", "ink"), ("Base: L0 = 100, M0 = 100", "ink"), ("Delivery month: L1 = 108, M1 = 110", "ink")]}},
  {"anchor": "Typical formula", "kind": "rule", "title": "PVC formula (typical, Appendix 11 style)", "lines": ["P1 = P0 × [ Fixed + Labour weight × (L1/L0) + Material weight × (M1/M0) ]"]},
  {"anchor": "मान लो fixed component", "kind": "add", "lines": ["Illustrative: Fixed 0.15 · Labour 0.25 · Material 0.60", "Base month indices: L0 = 100, M0 = 100 → delivery month: L1 = 108, M1 = 110"]},
  {"anchor": "तो factor बना", "kind": "add", "lines": ["Factor = 0.15 + 0.25×1.08 + 0.60×1.10 = 0.15 + 0.27 + 0.66 = 1.08 → +8%"],
   "diagram": {"type": "calc", "title": "PVC — illustrative calculation", "lines": [("P1 = P0 × [ F + a·(L1/L0) + b·(M1/M0) ]", "navy"), ("= P0 × [ 0.15 + 0.25×1.08 + 0.60×1.10 ]", "ink"), ("= P0 × [ 0.15 + 0.27 + 0.66 ]", "ink"), ("= P0 × 1.08   →   +8%", "green")]}},
  {"anchor": "अब clauses लगाओ", "kind": "rule", "title": "Ab sub-clauses lagao", "lines": ["(e) threshold 2% → 8% > 2% → variation applies"],
   "diagram": {"type": "table", "title": "8% par sub-clauses", "rows": [("(e) threshold 2%", "8% > 2% → applies"), ("(d) ceiling 10%", "8% poora; 12% hota to 10% par cap"), ("(f) 20% advance", "variation sirf 80% par"), ("(h) supplier default", "index ↑ ka fayda nahi; ↓ ka fayda Govt ko"), ("(g) LD", "varied price par")]}},
  {"anchor": "sub-clause d — ceiling", "kind": "add", "lines": ["(d) ceiling 10% → 8% in full; 12% hota to 10% par cap"]},
  {"anchor": "sub-clause f — अगर", "kind": "add", "lines": ["(f) 20% advance diya → variation sirf baaki 80% par"]},
  {"anchor": "sub-clause h — supplier", "kind": "add", "lines": ["(h) supplier default ke baad: index ↑ ka fayda nahi; index ↓ to kam price Govt ko", "(g) LD isi varied price par"]},
  {"anchor": "और याद रखो", "kind": "trap", "title": "YAAD RAKHO", "lines": ["PVC sirf delivery period > 18 months", "Cost plus = actual cost + profit, koi formula nahi → ordinarily avoid"]},
 ]},

 "d05_field_clauses": {"chip": 4, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 5 · Practice mein", "lines": ["Taxes · lump sum · materials · Govt property · audit copies", "Har clause ka ‘kaise likhein’"],
   "diagram": {"type": "table", "title": "Clause → contract mein kya likhein", "rows": [("(ix) Taxes", "All-inclusive rates; GST/duties contractor ki zimmedari"), ("(x) Lump sum", "Milestones + acceptance criteria + final payment on completion certificate"), ("(xi) Dept. materials", "Schedule: item, quantity, issue rate, return/recovery"), ("(xii) Govt property", "Insurance, hire charges, periodic physical verification"), ("(xiii) Audit copies", "≥ ₹25 lakh → Audit Officer (C&AG) + Accounts Officer (PAO)")]}},
  {"anchor": "Clause नौ — taxes", "kind": "rule", "title": "Rule 225(ix) — Taxes", "lines": ["All-inclusive rates; applicable GST & duties = contractor ki zimmedari (likhit)", "Baad ka ‘tax alag se do’ vivaad khatam"]},
  {"anchor": "Clause दस — lump sum", "kind": "add", "subtitle": "Rule 225(x) — Lump sum safeguards", "lines": ["Milestone-linked payments · written acceptance criteria · final payment after completion certificate"]},
  {"anchor": "Clause ग्यारह — departmental", "kind": "rule", "title": "Rule 225(xi) & (xii)", "lines": ["(xi) Materials schedule: kaunsa, kitna, kis rate par issue, bacha hua kaise wapas / recover"]},
  {"anchor": "Clause बारह — Government", "kind": "add", "lines": ["(xii) Tools / plant / premises: insurance kiske naam, hire charges kitne, physical verification kaun"]},
  {"anchor": "Clause तेरह — audit", "kind": "rule", "title": "Rule 225(xiii) — Audit copies", "lines": ["Audit Officer = C&AG ki office; Accounts Officer = Pay & Accounts Office", "≥ ₹25 lakh contracts ki copy dono ko", "Kyun? Bills ki checking contract ki sharton ke against ho sake"],
   "diagram": {"type": "flow", "title": "Audit copy ka flow", "nodes": [("Contract ≥ ₹25 lakh signed (civil dept.)", "navy"), ("Copy → Audit Officer (C&AG)", "teal"), ("Copy → Accounts Officer (PAO)", "teal"), ("Bills checked against contract terms", "green")]}},
  {"anchor": "Exam के लिए एक pattern", "kind": "hook", "title": "3 NUMBERS · 3 CLAUSES", "lines": ["₹2.5 lakh → Purchase Order", "₹10 lakh → formal contract", "₹25 lakh → audit copy"]},
 ]},

 "d06_variation_fm": {"chip": 5, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 6 · Variation ≠ extension ≠ FM", "lines": ["Teen alag cheezein, teen alag procedures", "Denial clause kya hai?"],
   "diagram": {"type": "table", "title": "Variation vs extension vs FM", "rows": [("Material variation (xiv)", "Effects record → prior approval → amendment signed by all"), ("Extension — supplier delay (xv)", "Formal amendment + LD + denial clause"), ("Extension — force majeure (xv)", "Formal amendment; no LD, no denial clause"), ("FM > 90 days", "Either party may terminate, no financial repercussion")]}},
  {"anchor": "Material variation मतलब", "kind": "rule", "title": "Rule 225(xiv) — Material variation", "lines": ["Core terms: scope · specification · quantity · price · delivery schedule", "Sequence: effects record → competent authority PRIOR approval → amendment signed by all parties", "Baad mein approval ✘"]},
  {"anchor": "Extension दो तरह", "kind": "rule", "title": "Rule 225(xv) — Do tarah ke extension", "lines": ["1. Supplier ki deri → formal amendment + LD + DENIAL CLAUSE", "Denial clause = extension period mein price / taxes / FX badhe to Govt nahi degi; ghate to fayda legi"]},
  {"anchor": "दूसरा — force majeure extension", "kind": "add", "lines": ["2. Force majeure → formal amendment; NO LD, NO denial clause (kisi ki galti nahi)"]},
  {"anchor": "Force majeure procedure", "kind": "rule", "title": "FM procedure (DoE Procurement Manuals)", "lines": ["1. Written notice with evidence — ~14 din", "2. Consult: kaunsa obligation kitna prabhavit", "3. Utna extension — formal amendment", "4. FM > 90 din → either party may terminate, no financial repercussion"],
   "diagram": {"type": "flow", "title": "FM procedure", "nodes": [("FM event", "red"), ("Notice + evidence (~14 din)", "navy"), ("Mutual assessment of affected obligations", "navy"), ("Extension via formal amendment — no LD", "teal"), ("> 90 din → termination option", "saffron")]}},
  {"anchor": "अब उनतीस April", "kind": "update", "title": "DoE OM 29.04.2026 — timeline par", "lines": ["Delivery due 15.03.2026 (i.e. on/after 28.02.2026)", "Supplier not in default on 27.02.2026 ✔", "West Asia disruption → shipment ruki", "→ case-to-case: extension 2–4 months = 15.05.2026 to 15.07.2026, no LD"],
   "diagram": {"type": "timeline", "title": "OM 29.04.2026 — worked timeline", "points": [("27.02.2026", "Default check"), ("28.02.2026", "Cut-off"), ("15.03.2026", "Due date"), ("15.05.2026", "+2 months"), ("15.07.2026", "+4 months")], "span": (3, 4), "note": "Extension window (no cost / no LD)"}},
  {"anchor": "लेकिन अगर supplier बीस February", "kind": "trap", "title": "EXAM TRAP", "lines": ["20.02.2026 se late tha → 27.02.2026 ko already in default → OM ki rahat NAHI"]},
 ]},

 "d07_ld_math": {"chip": 6, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 7 · LD ka hisaab", "lines": ["Typical Manual clause: 0.5% per week or part, max 10%", "Asli rate contract se"],
   "diagram": {"type": "calc", "title": "LD — worked example (typical clause)", "lines": [("Value of delayed goods = ₹10,00,000", "ink"), ("Delay = 20 days = 2 weeks + 6 days → 3 weeks", "ink"), ("LD = 3 × 0.5% = 1.5% → ₹15,000", "green"), ("Cap: 10% → max ₹1,00,000 (20+ weeks)", "saffron")]}},
  {"anchor": "Example — laptops", "kind": "rule", "title": "LD calculation (illustrative)", "lines": ["₹10 lakh goods, 20 days late → 3 weeks (part of week counts)", "3 × 0.5% = 1.5% = ₹15,000", "20 weeks late → cap 10% = ₹1,00,000"]},
  {"anchor": "Rule 225 clause सोलह में शब्द", "kind": "add", "subtitle": "‘Shall’ ka matlab", "lines": ["LD lagana default; maaf karna exception — written reasons + competent authority approval", "File par sirf ‘LD waived’ kaafi nahi"]},
  {"anchor": "Warranty — clause सत्रह", "kind": "rule", "title": "Warranty ↔ Performance security", "lines": ["Warranty (xvii): defect → free repair / replace", "Rule 171: performance security valid till 60 days after warranty obligations → warranty default par recovery ka raasta khula"],
   "diagram": {"type": "timeline", "title": "Performance security validity", "points": [("Contract", "signed"), ("Delivery", "accepted"), ("Warranty", "ends"), ("+60 days", "PS release")], "span": (0, 3), "note": "PS covers whole span incl. warranty (Rule 171)"}},
  {"anchor": "Right to reject", "kind": "add", "subtitle": "Rule 225(xviii)", "lines": ["Inspection fail → reject → written intimation → replacement; rejected goods ki payment nahi"]},
  {"anchor": "तीन साल — clause उन्नीस", "kind": "add", "subtitle": "Rule 225(xix) · 3 saal kyun", "lines": ["Limitation Act 1963: contract claims ki general limitation bhi 3 saal", "Rule 225 ise contract ki shart banata hai — closure + 3 saal → no claim (unless contract says otherwise)"]},
  {"anchor": "याद रखो — 'shall'", "kind": "hook", "title": "EXAM HOOK", "lines": ["‘Shall’ wale clauses sabse zyada poochhe jaate hain"]},
 ]},

 "d08_bg_lifecycle": {"chip": 7, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 8 · BG lifecycle", "lines": ["Receipt → custody → monthly review → release", "e-BG (DoE OM 05.08.2022)"],
   "diagram": {"type": "cycle", "title": "Bank Guarantee lifecycle", "nodes": ["1 Receipt — verify with issuing bank / e-BG", "2 Custody — written procedure + register", "3 Monthly review — expiring in 3 months?", "4 Release — after all obligations + 60 days"]}},
  {"anchor": "एक — receipt", "kind": "rule", "title": "1 · Receipt", "lines": ["Genuineness issuing bank se confirm", "e-BG (DoE OM 05.08.2022): bank ke secure messaging system se verified → paper-BG fraud risk kam"]},
  {"anchor": "दो — custody", "kind": "add", "subtitle": "2 · Custody (Rule 226(ii))", "lines": ["Written procedure: kaun rakhega, kahan, register entries — BG no., bank, amount, purpose, validity, claim period"]},
  {"anchor": "तीन — monthly review", "kind": "add", "subtitle": "3 · Monthly review", "lines": ["Agle 3 mahine mein kaunsi expire? → extension abhi maango → na mile to expiry se pehle invoke", "Expired BG = kagaz ka tukda"]},
  {"anchor": "चार — release", "kind": "add", "subtitle": "4 · Release", "lines": ["Sab obligations (warranty samet) poore → Rule 171: validity 60 din baad tak"]},
  {"anchor": "Monthly review की checklist", "kind": "rule", "title": "Monthly review checklist", "lines": ["1 Expiry list — next 3 months", "2 Extension letters — status", "3 Invoke — pending cases", "4 Release — due cases", "5 Register ↔ physical / electronic BG milaan"],
   "diagram": {"type": "table", "title": "Monthly BG review — checklist", "rows": [("1", "Expiry list — next 3 months"), ("2", "Extension letters — status"), ("3", "Invoke — pending cases"), ("4", "Release — due cases"), ("5", "Register ↔ BG reconciliation")]}},
  {"anchor": "Rule 226 clause एक का दूसरा", "kind": "trap", "title": "MAT BHOOLO", "lines": ["Breach hote hi notice — deri = breach ko accept karna", "Baad mein LD / termination defend karna mushkil"]},
  {"anchor": "Practical tip", "kind": "hook", "title": "PRACTICAL TIP", "lines": ["BG register ko contract register se link rakho"]},
 ]},

 "d09_dispute_ladder": {"chip": 8, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 9 · Dispute ladder", "lines": ["Negotiation → mediation → arbitration → court", "Har seedhi par Rule 227"],
   "diagram": {"type": "ladder", "title": "Dispute ladder", "steps": ["1 Negotiation / amicable settlement", "2 Conciliation / Mediation (Mediation Act 2023; HLC for big settlements)", "3 Arbitration — only if clause; disputes < ₹10 cr; institutional preferred", "4 Court — disputes without arbitration clause"]}},
  {"anchor": "पहली सीढ़ी", "kind": "rule", "title": "Dispute ladder (DoE OM 03.06.2024 + Rule 227)", "lines": ["1 Negotiation & amicable settlement pehle"]},
  {"anchor": "दूसरी — conciliation", "kind": "add", "lines": ["2 Conciliation / mediation — Mediation Act 2023; clause na ho tab bhi pre-litigation mediation; bade settlements → High Level Committee"]},
  {"anchor": "तीसरी — arbitration", "kind": "add", "lines": ["3 Arbitration — sirf clause ho to; < ₹10 crore disputes; upar → Secretary / delegated JS (CPSE: MD) reasoned approval; institutional preferred"]},
  {"anchor": "चौथी — court", "kind": "add", "lines": ["4 Court — jahan arbitration clause nahi", "Har seedhi: Rule 227 — legal advice pehle; plaint / claim vetted; documents scrutinised"]},
  {"anchor": "Award आने के बाद", "kind": "rule", "title": "Award ke baad", "lines": ["A&C Act 1996 s.34: challenge within 3 months of receipt (+ max 30 days by court)", "OM: challenge routine nahi — genuine merit + high chance of success; reasons record"],
   "diagram": {"type": "timeline", "title": "Section 34 ki ghadi", "points": [("Day 0", "Award received"), ("3 months", "s.34 limit"), ("+30 days", "court may condone"), ("", "no further")], "span": (0, 1), "note": "Challenge only on genuine merit (OM 03.06.2024)"}},
  {"anchor": "दस करोड़ का हिसाब", "kind": "trap", "title": "EXAM TRAP", "lines": ["₹10 crore = DISPUTE value, contract value nahi", "₹50 cr contract, ₹6 cr dispute → arbitration possible (illustrative)"]},
 ]},

 "d10_227a_master": {"chip": 9, "beats": [
  {"anchor": None, "kind": "story", "scene": "Deep dive 10 · Rule 227A numbers", "lines": ["Award ₹10 cr + interest ₹1 cr = ₹11 cr", "Challenge kiya → kitna, kaise?"],
   "diagram": {"type": "calc", "title": "Rule 227A — worked example", "lines": [("Award ₹10.00 cr + interest to award date ₹1.00 cr = ₹11.00 cr", "ink"), ("75% × ₹11.00 cr = ₹8.25 cr → paid against BG of ₹8.25 cr", "green"), ("BG only for ₹8.25 cr — not for interest on any refund order", "navy"), ("Escrow: lenders → same project → other projects of Ministry", "saffron")]}},
  {"anchor": "Clause एक के अनुसार", "kind": "rule", "title": "Rule 227A worked", "lines": ["(i) 75% × ₹11 cr = ₹8.25 cr to contractor against BG of ₹8.25 cr"]},
  {"anchor": "Clause दो — BG", "kind": "add", "lines": ["(ii) BG sirf ₹8.25 cr ke liye — refund order ke interest ke liye nahi"]},
  {"anchor": "Clause तीन — रकम", "kind": "add", "lines": ["(iii) Escrow priority: lenders → same project completion → other projects of same Ministry", "(iv) Retention / performance guarantee bhi BG ke against release"]},
  {"anchor": "Challenge fail", "kind": "add", "subtitle": "Outcome", "lines": ["Challenge fails → balance 25% + interest payable", "Challenge succeeds → amount recovered via BG", "Balance: contractor cash-flow + Govt money safe"]},
  {"anchor": "अब master sheet", "kind": "recap", "title": "CHAPTER 8 MASTER SHEET", "lines": ["Authorities: Art. 299(1) · M/o Law notifications · DFPR"],
   "diagram": {"type": "table", "title": "Master sheet — numbers", "rows": [("₹2.5 lakh", "Purchase Order · 225(iv)(a)"), ("₹10 lakh", "Formal contract · 225(iv)(c)"), ("21 din", "Execution after LoA · 225(vi)"), ("18 months", "PVC threshold · 225(viii)(a)"), ("₹25 lakh", "Audit copies · 225(xiii)"), ("3 saal", "Claim bar · 225(xix)"), ("Monthly / 3 mo.", "BG review · 226(ii)"), ("75%", "Challenged award · 227A"), ("₹10 crore", "Arbitration guideline · OM 03.06.2024"), ("90 din / 2–4 mo.", "FM termination / West Asia extension")]}},
  {"anchor": "Numbers —", "kind": "add", "subtitle": "Numbers", "lines": ["₹2.5 L PO · ₹10 L formal contract · 21 din · 18 months PVC · ₹25 L audit copies · 3 saal · monthly BG review (3-mo window) · 75% · ₹10 cr · 90 din FM · 2–4 mo. West Asia"]},
  {"anchor": "'Shall' वाले clauses", "kind": "add", "subtitle": "‘Shall’ (mandatory)", "lines": ["Precise terms · no work without agreement · 21 days · LD recovery · prior approval for variation · formal amendment for extension"]},
  {"anchor": "'Ordinarily avoid'", "kind": "add", "subtitle": "‘Ordinarily avoid’", "lines": ["Cost plus · lump sum · departmental materials"]},
  {"anchor": "बस — Chapter 8", "kind": "outro", "title": "Chapter 8 complete ✔", "sub": "RULES 224 – 227A  ·  EXPLAINED CLAUSE-BY-CLAUSE + DEEP DIVES", "image": "scene10.png",
   "lines": ["Sources: GFR 2017 — DoE compilation updated up to 31.01.2026", "DoE OMs: 02.04.2019 · 29.10.2021 · 05.08.2022 · 03.06.2024 · 29.04.2026 · DoE Procurement Manuals", "Constitution Art. 299 · A&C Act 1996 s.34 · Limitation Act 1963 · Mediation Act 2023"],
   "caption": "Illustrative numbers sirf samajhne ke liye — apne contract aur latest compilation se verify karein."},
 ]},
}

if __name__ == "__main__":
    from narration_deep import DEEP
    bad = 0
    for s in DEEP:
        for b in DEEP_BEATS[s["id"]]["beats"]:
            if b["anchor"] and b["anchor"] not in s["text"]:
                print("MISSING", s["id"], b["anchor"]); bad += 1
    print("anchors ok" if not bad else f"{bad} missing")
