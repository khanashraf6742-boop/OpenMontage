# -*- coding: utf-8 -*-
"""Deep-dive explainer segments (one after each base segment). Each ≤1500 chars.
Facts limited to: GFR 2017 text (DoE compilation up to 31.01.2026), Constitution Art. 299, A&C Act 1996 s.34,
Limitation Act 1963, Mediation Act 2023, DoE OMs 29.10.2021 / 05.08.2022 / 03.06.2024 / 29.04.2026, DoE Procurement Manuals.
Anything illustrative is said to be illustrative in the narration."""

DEEP = [
 {"id": "d01_why_299", "after": "s01_intro_rule224", "label": "Deep dive 1 — Article 299 kyun, aur Chapter 8 ki shabdavali",
  "text": ("Deep dive one। पहले ये समझो कि Rule 224 Article 299 पर क्यों टिका है। Article 299 clause एक कहता है — Union की executive power में किया गया हर contract President के नाम से expressed होगा, और उन्हीं persons द्वारा, उसी तरीके से execute होगा जैसा President direct या authorise करें। "
           "मतलब तीन चीज़ें — expressed in the name of the President, executed by an authorised person, और executed in the authorised manner। इनमें कोई भी कमी हो तो contract Government पर binding नहीं माना जाता — इसीलिए signature block इतना important है। "
           "Article 299 clause दो एक राहत भी देता है — ऐसे contract के लिए President या signing officer personally liable नहीं होते। "
           "अब Chapter 8 की शब्दावली, जो आगे बार-बार आएगी। Letter of Award, या L o A — successful bidder को award की सूचना। Bid security या E M D — Rule 170 के तहत bidders से लिया जाने वाला security, जो ordinarily estimated value का दो से पाँच percent होता है; कुछ cases में Bid Security Declaration भी ली जा सकती है। "
           "Performance security — Rule 171 के तहत contract value का पाँच से दस percent, जो contractor के सभी obligations — warranty समेत — पूरे होने के साठ दिन बाद तक valid रहती है। "
           "Bank Guarantee — bank का वादा कि demand पर वो Government को रकम देगा। Liquidated damages — delay पर contract में पहले से तय recovery। Price variation clause — input prices बदलने पर contract price adjust करने का formula। Force majeure — ऐसी घटना जो किसी के control से बाहर हो। "
           "इन शब्दों को पकड़ लो — अब हर clause आसान लगेगा।")},

 {"id": "d02_precision", "after": "s02_rule225_i_iii", "label": "Deep dive 2 — Vague clause vs precise clause",
  "text": ("Deep dive two। Rule 225 clause एक सिर्फ़ theory नहीं है — आइए तीन vague clauses को precise बनाते हैं। "
           "पहला — 'payment terms as may be decided later'। precise version: 'हर monthly bill का सौ percent payment, satisfactory service certificate के तीस दिन के अंदर'। "
           "दूसरा — 'delivery at the earliest'। precise version: 'contract की date से पैंतालीस दिन के अंदर, consignee के store पर, delivery, installation और commissioning समेत'। "
           "तीसरा — 'rates as per actuals'। ये खुली liability है — actual कितना होगा, किसी को नहीं पता। precise version: 'fixed rate per unit, taxes समेत, contract की पूरी अवधि के लिए firm'। "
           "Indefinite liability का मतलब यही है — ऐसी शर्त जिससे Government की देनदारी की कोई upper limit न हो। "
           "अब standard forms क्या हैं? Department of Expenditure के Procurement Manuals में दिए गए model bidding documents; GeM की General Terms and Conditions; works के लिए CPWD जैसे departments के standard contract forms। इन्हें वैसे ही use करो — clause बदलना हो तो पहले Integrated Finance Division और Legal Adviser या Ministry of Law से सलाह। "
           "क्यों? क्योंकि standard clauses पर पहले से legal vetting हो चुकी है, और हर बदलाव एक नया risk खोलता है। "
           "Practical tip — draft finalise करने से पहले पाँच सवाल पूछो: क्या, कितना, कब, कहाँ, और नहीं हुआ तो क्या। जिस clause का जवाब इनमें से किसी सवाल पर 'बाद में तय होगा' है, वो clause Rule 225 clause एक में fail है।")},

 {"id": "d03_doc_tree", "after": "s03_rule225_iv_vi", "label": "Deep dive 3 — Document decision tree + LoA to contract",
  "text": ("Deep dive three। Screen पर decision tree देखो। पहला सवाल — क्या ये turnkey, maintenance या services का contract है? हाँ, तो amount कुछ भी हो — proper contract document बनेगा, sub-clause d। "
           "नहीं, तो दूसरा सवाल — amount कितना है? ढाई लाख रुपये तक की simple purchase — purchase order, sub-clause a। "
           "एक लाख से दस लाख रुपये तक — अगर bid documents में General Conditions, Special Conditions और scope पहले से थे, तो Letter of Award ही contract है, sub-clause b; अलग से agreement की ज़रूरत नहीं। "
           "दस लाख या उससे ऊपर के works, और दस लाख से ऊपर की purchase — sub-clause c — या तो पूरा self-contained contract, या एक page का contract जो bid documents को incorporate करे। "
           "ध्यान दो — a और b के बीच एक लाख से ढाई लाख की range में overlap है। वहाँ simple purchase में purchase order ही काफ़ी है; b तब काम आता है जब bid documents पूरे थे और आप LoA को ही contract बनाना चाहते हैं। "
           "अब LoA से contract तक का रास्ता। LoA जारी हुआ — bidder ने acceptance भेजी — performance security जमा हुई — agreement sign हुआ। Rule 225 clause छह कहता है ये सब इक्कीस दिन में। "
           "इक्कीस दिन क्यों? ताकि successful bidder LoA लेकर बैठा न रहे, और prices या market बदलने पर मुकर न सके। default हुआ तो award annul और bid security forfeit — यानी Rule 170 वाला E M D यहीं काम आता है। "
           "GeM पर purchase हो तो GeM system contract खुद generate करता है — वही आपका contract document है। "
           "और clause पाँच का practical मतलब — 'काम शुरू करा दो, order बाद में' — ये Rule 225 clause पाँच का सीधा उल्लंघन है।")},

 {"id": "d04_pvc_math", "after": "s04_rule225_vii_viii", "label": "Deep dive 4 — PVC ka formula aur ek worked example",
  "text": ("Deep dive four। PVC को एक illustrative example से समझते हैं — numbers सिर्फ़ समझाने के लिए; असली formula आपके contract और Appendix ग्यारह से आएगा। "
           "Typical formula — नया price बराबर पुराना price गुणा: fixed component, plus labour weight गुणा labour index ratio, plus material weight गुणा material index ratio। "
           "मान लो fixed component पंद्रह percent, labour पच्चीस percent, material साठ percent। Base month में labour index सौ और material index सौ था। Delivery के महीने में labour index एक सौ आठ और material index एक सौ दस हो गया। "
           "तो factor बना — शून्य दशमलव पंद्रह, plus शून्य दशमलव पच्चीस गुणा एक दशमलव शून्य आठ यानी शून्य दशमलव दो सात, plus शून्य दशमलव छह गुणा एक दशमलव एक यानी शून्य दशमलव छियासठ। कुल एक दशमलव शून्य आठ। मतलब price आठ percent बढ़ा। "
           "अब clauses लगाओ। sub-clause e — threshold दो percent था, आठ percent उससे ऊपर है, तो variation लागू। sub-clause d — ceiling अगर दस percent है, तो आठ percent पूरा मिलेगा; बारह होता तो दस पर cap। "
           "sub-clause f — अगर बीस percent advance दिया था, तो variation सिर्फ़ बाक़ी अस्सी percent पर। "
           "sub-clause h — supplier अपनी ग़लती से original delivery date के बाद supply करे, तो index बढ़ने का फ़ायदा नहीं; index गिरे तो कम price Government को। "
           "sub-clause g — liquidated damages इसी varied price पर लगेंगे। "
           "और याद रखो — ये सब तभी, जब delivery period अठारह महीने से ज़्यादा हो; छोटे contracts में firm and fixed price। "
           "Cost plus का फ़र्क़ — वहाँ formula नहीं, actual cost plus profit है; cost पर control नहीं रहता — इसीलिए ordinarily avoid।")},

 {"id": "d05_field_clauses", "after": "s05_rule225_ix_xiii", "label": "Deep dive 5 — Taxes, lump sum, materials, Govt property: practice mein",
  "text": ("Deep dive five। अब इन clauses का practical रूप। "
           "Clause नौ — taxes। Bid में rates all-inclusive माँगो और साफ़ लिखो कि applicable GST और duties का भुगतान contractor की ज़िम्मेदारी है। इससे बाद में 'tax अलग से दो' वाला विवाद नहीं होता। "
           "Clause दस — lump sum। जहाँ काम को इकाइयों में नापना मुश्किल हो — जैसे कोई turnkey job — वहाँ lump sum हो सकता है, पर proper safeguards के साथ: payment milestones से जुड़ा हो, हर milestone का acceptance criteria लिखा हो, और final payment completion certificate के बाद। "
           "Clause ग्यारह — departmental materials। अगर department cement या steel जैसा material देता है, तो contract में schedule हो — कौन-सा material, कितनी quantity, किस rate पर issue होगा, और बचा हुआ material कैसे वापस होगा या recover होगा। "
           "Clause बारह — Government property। tools, plant, machinery या premises contractor को दिए हों, तो insurance किसके नाम, hire charges कितने, और periodic physical verification कौन करेगा — तीनों contract में। "
           "Clause तेरह — audit copies। Audit Officer यानी C and A G की office, और Accounts Officer यानी Pay and Accounts Office — दोनों को पच्चीस लाख या उससे ऊपर के contracts की copy। "
           "ये copies क्यों? ताकि audit को contract की शर्तें पहले से पता हों और bills की checking उन शर्तों के against हो सके। "
           "Exam के लिए एक pattern याद रखो — ढाई लाख purchase order, दस लाख formal contract, पच्चीस लाख audit copy। तीन numbers, तीन clauses।")},

 {"id": "d06_variation_fm", "after": "s06_rule225_xiv_xv_fmc2026", "label": "Deep dive 6 — Variation vs extension, denial clause, FM procedure",
  "text": ("Deep dive six। तीन चीज़ें अलग-अलग हैं — variation, extension, और force majeure। "
           "Material variation मतलब core शर्तों में बदलाव — scope, specification, quantity, price, delivery schedule। Rule 225 clause चौदह का तरीका: पहले effects record, फिर competent authority की prior approval, फिर सभी parties के signature से amendment। बाद में approval — नहीं चलेगा। "
           "Extension दो तरह का होता है। पहला — supplier की अपनी देरी पर। formal amendment से, पर liquidated damages के साथ, और denial clause — यानी extension की अवधि में price, taxes या exchange rate बढ़े तो Government नहीं देगी, घटे तो फ़ायदा लेगी। "
           "दूसरा — force majeure extension। यहाँ न liquidated damages, न denial clause, क्योंकि देरी किसी की ग़लती नहीं। "
           "Force majeure procedure — Procurement Manuals के अनुसार। एक: लगभग चौदह दिन में written notice with evidence। दो: दोनों पक्ष तय करें कौन-सा obligation कितना प्रभावित हुआ। तीन: उतना extension formal amendment से। चार: नब्बे दिन से ज़्यादा चले तो कोई भी पक्ष बिना financial repercussion terminate कर सकता है। "
           "अब उनतीस April दो हज़ार छब्बीस का O M timeline पर देखो। मान लो delivery पंद्रह March दो हज़ार छब्बीस को due थी — अट्ठाईस February के बाद। supplier सत्ताईस February को default में नहीं था। West Asia disruption से shipment रुकी। तो examination के बाद delivery दो से चार महीने — पंद्रह May से पंद्रह July के बीच — बढ़ सकती है, बिना liquidated damages। "
           "लेकिन अगर supplier बीस February को ही late था, तो ये राहत नहीं — क्योंकि सत्ताईस February को वो पहले से default में था।")},

 {"id": "d07_ld_math", "after": "s07_rule225_xvi_xix", "label": "Deep dive 7 — LD ka hisaab, warranty vs guarantee, 3 saal kyun",
  "text": ("Deep dive seven। Liquidated damages का हिसाब देखते हैं। Procurement Manuals में goods के लिए typical clause — हर हफ़्ते या उसके हिस्से की देरी पर delayed goods की value का आधा percent, अधिकतम दस percent। असली rate contract से आएगा। "
           "Example — laptops की value दस लाख रुपये, delivery बीस दिन late। बीस दिन यानी दो हफ़्ते और छह दिन का हिस्सा — तीन हफ़्ते गिने जाएँगे। तीन गुणा आधा percent — डेढ़ percent — यानी पंद्रह हज़ार रुपये L D। अगर देरी बीस हफ़्ते होती तो दस percent की cap — एक लाख रुपये पर रुक जाता। "
           "Rule 225 clause सोलह में शब्द 'shall' है — मतलब L D लगाना default है, माफ़ करना exception। और exception भी लिखित reasons और competent authority की approval से। file पर सिर्फ़ 'L D waived' लिखना काफ़ी नहीं। "
           "Warranty — clause सत्रह। warranty period में defect निकले तो supplier free of cost repair या replace करेगा। इसे performance security से जोड़ो — Rule 171 के अनुसार performance security warranty obligations पूरे होने के साठ दिन बाद तक valid रहती है, इसीलिए warranty में default हो तो recovery का रास्ता खुला रहता है। "
           "Right to reject — clause अठारह। inspection में specification पर खरे न उतरें तो reject, लिखित intimation, replacement — rejected goods की payment नहीं। "
           "तीन साल — clause उन्नीस। Limitation Act उन्नीस सौ तिरसठ में contract के दावों की general limitation भी तीन साल है; Rule 225 इसे contract की शर्त बना देता है — contract बंद होने के तीन साल बाद कोई claim entertain नहीं, जब तक contract में कुछ और न लिखा हो। "
           "याद रखो — 'shall' वाले clauses exam में सबसे ज़्यादा पूछे जाते हैं।")},

 {"id": "d08_bg_lifecycle", "after": "s08_rule226", "label": "Deep dive 8 — Bank Guarantee lifecycle aur monthly review checklist",
  "text": ("Deep dive eight। Bank Guarantee का पूरा जीवन-चक्र समझो। "
           "एक — receipt। BG आते ही उसकी genuineness issuing bank से confirm करो। Department of Expenditure के पाँच August दो हज़ार बाईस के O M के बाद electronic BG भी accept होती है, जिसे bank के secure messaging system से verify किया जाता है — कागज़ी BG के fraud का risk इसी से कम होता है। "
           "दो — custody। Rule 226 clause दो कहता है written procedure हो — कौन रखेगा, कहाँ रखेगा, register में क्या entry होगी: BG number, bank, amount, purpose, validity date, और claim period। "
           "तीन — monthly review। हर महीने register देखो और पूछो — अगले तीन महीने में कौन-सी BG expire हो रही है? जिन contracts के obligations बाक़ी हैं, उनके लिए अभी extension माँगो। extension न मिले तो expiry से पहले invoke करो — क्योंकि expire हुई BG कागज़ का टुकड़ा है। "
           "चार — release। performance security तभी release करो जब सभी obligations, warranty समेत, पूरे हो जाएँ — Rule 171 के अनुसार validity उसके साठ दिन बाद तक होनी चाहिए। "
           "Monthly review की checklist — एक: expiry list next three months। दो: extension letters की status। तीन: invoke करने के लिए pending cases। चार: release के लिए due cases। पाँच: register और physical या electronic BG का मिलान। "
           "Rule 226 clause एक का दूसरा हिस्सा भी मत भूलो — breach होते ही notice। देर से notice देने का मतलब है कि आप breach को accept कर रहे हैं — बाद में L D या termination defend करना मुश्किल हो जाता है। "
           "Practical tip — BG register को contract register से link रखो, ताकि हर contract के सामने उसकी security दिखे।")},

 {"id": "d09_dispute_ladder", "after": "s09_rule227_arbitration_guidelines", "label": "Deep dive 9 — Dispute ladder: negotiation se court tak",
  "text": ("Deep dive nine। Dispute आने पर सीढ़ी ऐसे चढ़ो। "
           "पहली सीढ़ी — negotiation और amicable settlement। तीन June दो हज़ार चौबीस का O M यही कहता है — पहले बातचीत से हल निकालो। "
           "दूसरी — conciliation या mediation। Mediation Act दो हज़ार तेईस के तहत; contract में mediation clause न हो तब भी pre-litigation mediation खुला है। बड़े settlements के लिए O M में High Level Committee की व्यवस्था है। "
           "तीसरी — arbitration, अगर contract में clause है। O M के अनुसार clause routine में नहीं; रखो तो दस करोड़ रुपये से कम value के disputes के लिए; उससे ऊपर सिर्फ़ Secretary या delegated Joint Secretary level — और CPSE में Managing Director — की reasoned approval से। institutional arbitration prefer करो — जहाँ कोई arbitral institution पूरी process administer करती है। "
           "चौथी — court। जिन disputes पर arbitration clause नहीं, वो civil court में जाएँगे। "
           "हर सीढ़ी पर Rule 227 — पहले legal advice, plaint या claim की legal-financial vetting, documents की scrutiny। "
           "Award आने के बाद क्या? Arbitration and Conciliation Act उन्नीस सौ छियानवे की section चौंतीस के तहत challenge की समय-सीमा award मिलने से तीन महीने है, जिसे court अधिकतम तीस दिन और बढ़ा सकती है। लेकिन O M कहता है — challenge routine में नहीं, सिर्फ़ genuine merit और high chance of success पर, और ये decision reasons record करके। "
           "दस करोड़ का हिसाब dispute value से है — contract value से नहीं। पचास करोड़ के contract में छह करोड़ का dispute arbitration में जा सकता है — उदाहरण सिर्फ़ समझाने के लिए।")},

 {"id": "d10_227a_master", "after": "s10_rule227a_recap", "label": "Deep dive 10 — Rule 227A worked example + Chapter 8 master sheet",
  "text": ("Deep dive ten। Rule 227A numbers से। award दस करोड़ रुपये, award date तक interest एक करोड़ — कुल ग्यारह करोड़। Ministry ने award court में challenge किया। "
           "Clause एक के अनुसार ग्यारह करोड़ का पचहत्तर percent — आठ करोड़ पच्चीस लाख — contractor को दिया जाएगा, उतनी ही रकम की Bank Guarantee के against। "
           "Clause दो — BG सिर्फ़ इन आठ करोड़ पच्चीस लाख के लिए; refund order पर बनने वाले interest के लिए BG नहीं। "
           "Clause तीन — रकम escrow account में; priority — पहले lenders का बकाया, फिर उसी project का completion, फिर उसी Ministry के दूसरे projects। "
           "Clause चार — retention money या performance guarantee भी BG के against release हो सकती है। "
           "Challenge fail — बाक़ी पच्चीस percent और interest देना होगा। सफल — रकम BG से वापस। यही balance है — contractor की cash flow भी चले, Government का पैसा भी सुरक्षित। "
           "अब master sheet। Authorities — Article 299 clause एक; Ministry of Law notifications; Delegation of Financial Powers Rules। "
           "Numbers — ढाई लाख purchase order; दस लाख formal contract; इक्कीस दिन execution; अठारह महीने PVC; पच्चीस लाख audit copies; तीन साल claim bar; monthly BG review, तीन महीने window; पचहत्तर percent challenged award; दस करोड़ arbitration; नब्बे दिन force majeure termination; दो से चार महीने West Asia extension। "
           "'Shall' वाले clauses — precise terms, no work without agreement, इक्कीस दिन, L D recovery, prior approval for variation, formal amendment for extension। "
           "'Ordinarily avoid' वाले — cost plus, lump sum, departmental materials। "
           "बस — Chapter 8 अब पूरा है, explanation के साथ।")},
]

if __name__ == "__main__":
    for s in DEEP:
        print(s["id"], len(s["text"]))
