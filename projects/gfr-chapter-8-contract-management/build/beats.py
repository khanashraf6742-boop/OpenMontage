# -*- coding: utf-8 -*-
"""Beat sheet: on-screen states anchored to substrings of the narration.
kind: title | story | rule | add | trap | hook | quiz | answer | update | recap | outro"""

BEATS = {
 "s01_intro_rule224": {"image": "scene01.png", "beats": [
  {"anchor": None, "kind": "title", "title": "GFR 2017 · Chapter 8", "sub": "CONTRACT MANAGEMENT  ·  Rules 224 – 227A",
   "lines": ["Simple Hinglish explainer  ·  clause-by-clause", "Text as per DoE compilation updated up to 31.01.2026", "+ DoE OMs of 29.10.2021, 03.06.2024 & 29.04.2026"],
   "caption": "Note: GFR amendments DoE (Ministry of Finance) issue karta hai — DoPT ka koi order Chapter 8 amend nahi karta"},
  {"anchor": "चलिए, scene one", "kind": "story", "scene": "Scene 1 · Signature block",
   "lines": ["Neha Verma — nayi Section Officer; AMC agreement sign karna hai", "Rakesh ji (Senior Assistant): designation ke neeche likhiye —", "“for and on behalf of the President of India”"]},
  {"anchor": "Rule 224, sub-rule एक", "kind": "rule", "title": "Rule 224(1)",
   "lines": ["Contract sirf wahi authority karegi jise President ke orders ke tahat power mili hai", "Source: Article 299(1), Constitution of India"]},
  {"anchor": "और sub-rule दो", "kind": "add", "subtitle": "Rule 224(2)",
   "lines": ["Union ki executive power mein kiye gaye sab contracts & assurances of property → President ki taraf se execute", "Words after designation: “for and on behalf of the President of India”"]},
  {"anchor": "Note एक", "kind": "add", "subtitle": "Notes to Rule 224",
   "lines": ["Note 1: Kaun-si class ka contract kaun execute karega → Ministry of Law ke notifications", "Note 2: Powers, conditions & procedure → Delegation of Financial Powers Rules"]},
  {"anchor": "Exam trap", "kind": "trap", "title": "EXAM TRAP", "lines": ["Authority ka source = Article 299(1)", "“President of India” ✔     “Government of India” ✘"]},
 ]},

 "s02_rule225_i_iii": {"image": "scene02.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 2 · Housekeeping tender",
   "lines": ["Arjun (Assistant) ka draft clause: ‘payment terms as may be decided later’", "Meera (Under Secretary) ne file rok di — kyun?"]},
  {"anchor": "Rule 225 clause एक", "kind": "rule", "title": "Rule 225(i)",
   "lines": ["Terms precise, definite aur bina kisi ambiguity ke", "Koi uncertain / indefinite liability nahi", "Sirf 2 exceptions: cost plus contract  ·  price variation clause"]},
  {"anchor": "Clause दो", "kind": "add", "subtitle": "Rule 225(ii)", "lines": ["Standard forms of contract use karo (jahan possible)", "Modification → sirf financial + legal advice ke baad"]},
  {"anchor": "और clause तीन", "kind": "add", "subtitle": "Rule 225(iii)", "lines": ["Standard form use nahi ho raha? → clauses draft karte samay legal + financial advice"]},
  {"anchor": "Memory hook", "kind": "hook", "title": "MEMORY HOOK", "lines": ["Standard form pehle; badlaav sirf advice ke baad"]},
  {"anchor": "Exam trap", "kind": "trap", "title": "EXAM TRAP", "lines": ["Indefinite liability ki exceptions = cost-plus & price-variation ONLY", "‘Urgent requirement’ koi exception nahi"]},
 ]},

 "s03_rule225_iv_vi": {"image": "scene03.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 3 · Teen files, teen documents",
   "lines": ["File 1: Printers — ₹1,80,000", "File 2: Office furniture — ₹6,00,000", "File 3: Building repair works — ₹15,00,000", "Priya (Accounts Officer): har file mein document alag"]},
  {"anchor": "Rule 225 clause चार", "kind": "rule", "title": "Rule 225(iv) · Kaunsa document?",
   "lines": ["(a) Simple purchase ≤ ₹2.5 lakh → Purchase Order (terms & conditions ke saath)"]},
  {"anchor": "Sub-clause b", "kind": "add", "lines": ["(b) Purchase ₹1 lakh – ₹10 lakh, GCC/SCC + scope bid documents mein → Letter of Award = binding contract"]},
  {"anchor": "Sub-clause c", "kind": "add", "lines": ["(c) Works ≥ ₹10 lakh / purchase > ₹10 lakh → self-contained contract, ya one-page contract referencing bid documents"]},
  {"anchor": "Sub-clause d", "kind": "add", "lines": ["(d) Turnkey works · maintenance · services → contract document HAMESHA (amount kuch bhi ho)"]},
  {"anchor": "Clause पाँच", "kind": "rule", "title": "Rule 225(v) & (vi)",
   "lines": ["(v) Agreement / order execute hue bina koi kaam shuru nahi"]},
  {"anchor": "Clause छह", "kind": "add", "lines": ["(vi) LoA ke baad 21 din mein contract execute — warna award annul + bid security (EMD) forfeit"]},
  {"anchor": "Quick quiz", "kind": "quiz", "title": "QUICK QUIZ", "lines": ["Printers (₹1.8 lakh) ki file mein kya banega?"], "caption": "Pause karke socho…"},
  {"anchor": "Answer:", "kind": "answer", "title": "ANSWER", "lines": ["Purchase Order — Rule 225(iv)(a)"]},
 ]},

 "s04_rule225_vii_viii": {"image": "scene04.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 4 · Delivery period 24 mahine",
   "lines": ["Vendor: price variation chahiye", "Dr. Iyer (Scientist) → Priya (Accounts Officer): de sakte hain?"]},
  {"anchor": "पहले Rule 225 clause सात", "kind": "rule", "title": "Rule 225(vii) · Cost plus contracts",
   "lines": ["Ordinarily AVOID", "Unavoidable → full justification record (contract se pehle)", "Long duration → baad mein firm price par convert karne ki koshish"]},
  {"anchor": "Explanation:", "kind": "add", "lines": ["Explanation: price = actual cost of production + profit (fixed rate per unit ya fixed %)"]},
  {"anchor": "अब clause आठ", "kind": "rule", "title": "Rule 225(viii) · Price Variation Clause (PVC)",
   "lines": ["(a) Ordinarily sirf long-term contracts — delivery period > 18 months; short-term → firm & fixed price"]},
  {"anchor": "b — clause में base", "kind": "add", "lines": ["(b) Base month & year clearly likho", "(c) Formula / indices / Appendix 11 ke anusaar", "(d) Cut-off dates + ceiling"]},
  {"anchor": "e — minimum threshold", "kind": "add", "lines": ["(e) Minimum threshold (e.g. 2%) se kam par koi variation nahi", "(f) Advance payment wale hisse par koi variation nahi", "(g) LD varied price par"]},
  {"anchor": "h — supplier", "kind": "add", "lines": ["(h) Supplier default se delay → original date ke baad koi increase nahi; decrease ka fayda Govt ko", "(i) FM / Govt default extension → amendment se variation allowed"]},
  {"anchor": "j — duties", "kind": "add", "lines": ["(j) Duties, taxes & foreign exchange variation ke rules saaf", "(k) Payment mode tay ho"]},
  {"anchor": "Memory hook", "kind": "hook", "title": "MEMORY HOOK", "lines": ["18 mahine — yahi PVC ka darwaza hai"]},
 ]},

 "s05_rule225_ix_xiii": {"image": "scene05.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 5 · ₹30 lakh civil work close-out",
   "lines": ["EE Khan saheb + Divisional Accountant Sunita ji (PWD division)", "Copy Audit ko jayegi ya nahi?"]},
  {"anchor": "Rule 225 clause नौ", "kind": "rule", "title": "Rule 225(ix) & (x)",
   "lines": ["(ix) Applicable taxes & duties contractor bharega — contract mein saaf likho"]},
  {"anchor": "Clause दस", "kind": "add", "lines": ["(x) Lump sum contracts sirf absolute necessity mein — payment ke liye proper safeguards"]},
  {"anchor": "Clause ग्यारह", "kind": "rule", "title": "Rule 225(xi) & (xii)",
   "lines": ["(xi) Departmental materials dena avoid; dena pade to schedule, rates & conditions contract mein"]},
  {"anchor": "Clause बारह", "kind": "add", "lines": ["(xii) Govt property with contractor → safeguards: insurance, hire charges recovery, periodic physical verification"]},
  {"anchor": "और clause तेरह", "kind": "update", "title": "Rule 225(xiii) · [AMENDED 02.04.2019]",
   "lines": ["Contracts ≥ ₹25 lakh — copies civil departments se Audit Officer + Accounts Officer ko", "Limit DoE OM F.1/26/2018-PPD (02.04.2019) se aayi", "₹30 lakh ka contract → copy Audit ko jayegi ✔"]},
  {"anchor": "Exam trap", "kind": "trap", "title": "EXAM TRAP", "lines": ["Audit copies ki limit = ₹25 lakh", "₹10 lakh ✘"]},
 ]},

 "s06_rule225_xiv_xv_fmc2026": {"image": "scene06.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 6 · Chairs ka supply contract",
   "lines": ["Vendor: model badal doon? delivery 2 mahine aage?", "SO Gurpreet → DS Kapoor"]},
  {"anchor": "Rule 225 clause चौदह", "kind": "rule", "title": "Rule 225(xiv) · Material variation",
   "lines": ["Koi material variation aise hi nahi", "Zaroori ho → financial & other effects record + competent authority ki PRIOR approval", "Amendment sab parties sign karein"]},
  {"anchor": "Clause पंद्रह", "kind": "add", "subtitle": "Rule 225(xv) · Extension",
   "lines": ["Delivery / completion extension sirf: contract provision ya force majeure", "Aur wo bhi formal amendment se"]},
  {"anchor": "अब latest order", "kind": "update", "title": "LATEST · DoE OM dated 29.04.2026 — Force Majeure Clause",
   "lines": ["FM = act of God, war, strike, riots — negligence / predictable rain nahi", "Notice reasonable time mein (Manuals: ~14 din); ex-post-facto claim nahi"]},
  {"anchor": "Force majeure नब्बे दिन", "kind": "add", "lines": ["FM > 90 din → koi bhi party bina financial repercussion terminate kar sakti hai"]},
  {"anchor": "इस O M में ongoing", "kind": "add", "subtitle": "West Asia situation",
   "lines": ["Ongoing West Asia situation = ‘war’ → FM invoke ho sakta hai (goods / services / works)", "Obligations due on / after 28.02.2026 → extension 2 to 4 months, bina cost / penalty, case-to-case"]},
  {"anchor": "Condition —", "kind": "add", "lines": ["Condition: 27.02.2026 ko parties default mein na hon", "Sirf West Asia disruption se directly judi non-performance cover"]},
  {"anchor": "गुरप्रीत का जवाब", "kind": "answer", "title": "GURPREET KA JAWAB",
   "lines": ["Model change = material variation → approval + amendment ke bina nahi", "Extension sirf FM ya contract provision par"]},
 ]},

 "s07_rule225_xvi_xix": {"image": "scene07.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 7 · Laptops 20 din late, 2 kharab",
   "lines": ["Storekeeper Ramesh → Deputy Director Fatima: action?"]},
  {"anchor": "Rule 225 clause सोलह", "kind": "rule", "title": "Rule 225(xvi) · Liquidated Damages",
   "lines": ["Delay par LD contract ke anusaar recover ‘SHALL’", "Exemption sirf exceptional cases — reasons record + competent authority approval"]},
  {"anchor": "Clause सत्रह", "kind": "add", "subtitle": "Rule 225(xvii) · Warranty", "lines": ["Defective goods free replace / repair"]},
  {"anchor": "Clause अठारह", "kind": "add", "subtitle": "Rule 225(xviii) · Right to reject", "lines": ["Specifications par khare na utre → reject"]},
  {"anchor": "Clause उन्नीस", "kind": "add", "subtitle": "Rule 225(xix) · Time bar", "lines": ["Contract closure se 3 saal baad koi claim nahi (unless contract specifies otherwise)"]},
  {"anchor": "Quick quiz", "kind": "quiz", "title": "QUICK QUIZ", "lines": ["LD maaf karna — routine ya exceptional?"], "caption": "Pause karke socho…"},
  {"anchor": "Answer:", "kind": "answer", "title": "ANSWER", "lines": ["Exceptional — reasons record karke, approval se"]},
  {"anchor": "Memory hook", "kind": "hook", "title": "MEMORY HOOK", "lines": ["LD shall · warranty must · reject right · 3 years bas"]},
 ]},

 "s08_rule226": {"image": "scene08.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 8 · BG register",
   "lines": ["AD Vikram ka BG register", "Director Nair: kaun-si BG agle 3 mahine mein expire?"]},
  {"anchor": "Rule 226 clause एक", "kind": "rule", "title": "Rule 226 · Management of contracts",
   "lines": ["(i) Implementation strictly monitor", "(i) Breach hote hi notice promptly"]},
  {"anchor": "Clause दो", "kind": "add", "lines": ["(ii) Bank Guarantees ki custody ka written procedure", "(ii) MONTHLY review — kaun-si BG agle 3 MAHINE mein expire", "Samay rehte extension maango, warna invoke; expiry ke baad kuch nahi"]},
  {"anchor": "विक्रम का जवाब", "kind": "story", "scene": "Scene 8 · BG register", "lines": ["Vikram: 2 BG hain — extension letters aaj ja rahe hain ✔"]},
  {"anchor": "Latest context", "kind": "update", "title": "LATEST · e-Bank Guarantee (DoE OM 05.08.2022)",
   "lines": ["Electronic BG (e-BG) accept karne ki vyavastha", "Monitoring principle wahi — monthly review, 3-month window"]},
  {"anchor": "Exam trap", "kind": "trap", "title": "EXAM TRAP", "lines": ["BG review = MONTHLY; window = 3 months", "Quarterly review ✘"]},
 ]},

 "s09_rule227_arbitration_guidelines": {"image": "scene09.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 9 · ₹12 crore ka claim", "lines": ["Joint Secretary ki meeting: Director Salim + Legal Adviser"]},
  {"anchor": "Rule 227 —", "kind": "rule", "title": "Rule 227 · Legal advice on disputes",
   "lines": ["Dispute → conciliation / arbitration (as per contract) se PEHLE legal advice", "Arbitration clause nahi → suit file karne se pehle legal advice", "Draft plaint → legal + financial advice se vetted", "Documents carefully scrutinised — Govt interest safeguard"]},
  {"anchor": "अब latest guidelines", "kind": "update", "title": "DoE OM F.1/2/2024-PPD dt 03.06.2024 — Arbitration & Mediation (Domestic Public Procurement)",
   "lines": ["1. Arbitration clause routine / automatic nahi — khaaskar bade contracts mein"]},
  {"anchor": "दो — अगर रखी जाए", "kind": "add", "lines": ["2. Agar ho → generally disputes < ₹10 crore tak (DISPUTE value, contract value nahi)"]},
  {"anchor": "तीन — इससे ऊपर", "kind": "add", "lines": ["3. Isse upar → reasons record + approval: Secretary / delegated JS (Ministry); MD (CPSE/PSB)"]},
  {"anchor": "चार — institutional", "kind": "add", "lines": ["4. Institutional arbitration prefer"]},
  {"anchor": "पाँच — awards", "kind": "add", "lines": ["5. Awards ko routine challenge nahi — sirf genuine merit + high chance of success"]},
  {"anchor": "छह — amicable", "kind": "add", "lines": ["6. Amicable settlement + mediation (Mediation Act 2023); bade settlements → High Level Committee"]},
  {"anchor": "सात — बाक़ी", "kind": "add", "lines": ["7. Baaki disputes → Courts"]},
  {"anchor": "सलीम का takeaway", "kind": "hook", "title": "TAKEAWAY", "lines": ["₹12 crore dispute → pehle legal advice; arbitration automatic nahi"]},
 ]},

 "s10_rule227a_recap": {"image": "scene10.png", "beats": [
  {"anchor": None, "kind": "story", "scene": "Scene 10 · Award challenge kiya — payment?", "lines": ["Under Secretary Kavita  ↔  Financial Adviser"]},
  {"anchor": "Rule 227A, clause एक", "kind": "update", "title": "Rule 227A(i) · Arbitration Awards [inserted 29.10.2021]",
   "lines": ["Ministry ne award challenge kiya, payment ruka → award ka 75% (interest up to award date samet) contractor / concessionaire ko — Bank Guarantee ke against"]},
  {"anchor": "Clause दो — Bank Guarantee", "kind": "add", "lines": ["(ii) BG sirf us 75% ke liye — refund order par banne wale interest ke liye NAHI"]},
  {"anchor": "Clause तीन — पैसा", "kind": "add", "lines": ["(iii) Escrow account: lenders ka bakaya → usi project ka completion → usi Ministry ke doosre projects"]},
  {"anchor": "Clause चार — retention", "kind": "add", "lines": ["(iv) Retention money / performance guarantee bhi BG ke against release ho sakti hai"]},
  {"anchor": "अब rapid recap", "kind": "recap", "title": "RAPID RECAP — pause karke khud jawab do", "lines": []},
  {"anchor": "एक — contract किसकी", "kind": "add", "lines": ["1. Contracts kiski taraf se? → President of India · Art. 299(1) · R.224"]},
  {"anchor": "दो — purchase order", "kind": "add", "lines": ["2. Purchase Order limit? → ₹2.5 lakh · R.225(iv)(a)"]},
  {"anchor": "तीन — contract execution", "kind": "add", "lines": ["3. Contract execution? → 21 din from LoA · R.225(vi)"]},
  {"anchor": "चार — price variation", "kind": "add", "lines": ["4. Price Variation kab? → delivery > 18 months · R.225(viii)(a)"]},
  {"anchor": "पाँच — audit copies", "kind": "add", "lines": ["5. Copies to Audit? → ₹25 lakh & above · R.225(xiii)"]},
  {"anchor": "छह — claim time bar", "kind": "add", "lines": ["6. Claim time-bar? → 3 saal · R.225(xix)"]},
  {"anchor": "सात — BG review", "kind": "add", "lines": ["7. BG review? → monthly; 3-month window · R.226(ii)"]},
  {"anchor": "आठ — challenged award", "kind": "add", "lines": ["8. Challenged award? → 75% against BG · R.227A"]},
  {"anchor": "नौ — arbitration guideline", "kind": "add", "lines": ["9. Arbitration guideline? → disputes < ₹10 crore · DoE OM 03.06.2024"]},
  {"anchor": "Chapter 8 complete", "kind": "outro", "title": "Chapter 8 complete ✔", "sub": "RULES 224 – 227A  ·  SAB CLAUSES COVERED",
   "lines": ["Sources: GFR 2017 — DoE compilation updated up to 31.01.2026", "DoE OMs: 02.04.2019 · 29.10.2021 · 05.08.2022 · 03.06.2024 · 29.04.2026", "Always verify with the latest compilation at doe.gov.in"],
   "caption": "Padhte rahiye, verify karte rahiye."},
 ]},
}

if __name__ == "__main__":
    from narration import SEGMENTS
    bad = 0
    for s in SEGMENTS:
        for b in BEATS[s["id"]]["beats"]:
            if b["anchor"] and b["anchor"] not in s["text"]:
                print("MISSING", s["id"], b["anchor"]); bad += 1
    print("anchors ok" if not bad else f"{bad} missing")
