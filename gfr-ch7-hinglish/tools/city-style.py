#!/usr/bin/env python3
"""
City-Hinglish style pass for the GFR Ch.7 explainer.

PROBLEM IT SOLVES
-----------------
The first draft of the Roman-script column was literal / Sanskritised Hindi
transliterated into Roman letters ("ke anuroop", "ke tahat", "gunjaish",
"maujoodgi", "lagu", "niyam"). Nobody speaks like that in an Indian office,
and a TTS voice reading it sounds like a Hindi news bulletin, not a colleague.

WHAT "CITY HINGLISH" MEANS HERE (project definition)
----------------------------------------------------
1. Legal / office nouns stay ENGLISH, written in Roman: rule, chapter, register,
   verification, inspection, stock, tender, auction, bid, sanction, disposal.
2. The grammar frame stays Hindi but uses the everyday spoken forms:
   hai / hoga / karna hoga / chahiye / padega / ke hisaab se / ke under.
3. No tatsam (Sanskritised) vocabulary: anuroop -> hisaab se, tahat -> under,
   sampatti -> asset, hastakshar -> sign, nigraani -> supervision.
4. The Devanagari column gets the same treatment, because it is read by the
   same people (aadhyay -> chaiptar, niptaan -> disposal, nirikshan -> inspection).

HOW IT WORKS
------------
Phrase-level rules run first (they carry grammar), then word-level rules with
Devanagari-aware boundaries. Capitalisation of the first letter is preserved.
Nothing is applied field-selectively - safe precisely because every glossary
term is Hindi, and verbatim English provision text contains none of them.
Official `exact:` / `text:` / `alt:` English is therefore untouched by design.

USAGE  python3 tools/city-style.py            (rewrites in place, prints a diff count)
"""
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ["content.js", "granular.js"]

# ── Roman-script rules ────────────────────────────────────────────────────────
ROMAN = [
    # grammar-carrying phrases first
    (r"\blagu hote hain\b", "lagte hain"),
    (r"\blagu hota hai\b", "lagta hai"),
    (r"\blagu hoti hai\b", "lagti hai"),
    (r"\blagu hain\b", "lagte hain"),
    (r"\blagu hai\b", "lagta hai"),
    (r"\blagu hoga\b", "lagega"),
    (r"\blagu honge\b", "lagenge"),
    (r"\blagu nahi\b", "lagta nahi"),
    (r"\blagu\b", "lagta"),
    (r"\bke anuroop\b", "ke hisaab se"),
    (r"\bke anusaar\b", "ke hisaab se"),
    (r"\bke anusar\b", "ke hisaab se"),
    (r"\bke adhaar par\b", "ke base par"),
    (r"\bke aadhar par\b", "ke base par"),
    (r"\bke tahat\b", "ke under"),
    (r"\bke dwara\b", "ke through"),
    (r"\bki gunjaish\b", "ka chance"),
    (r"\bki maujoodgi mein\b", "ke saamne"),
    (r"\bVyavhaarik matlab\b", "Matlab ye ki"),
    (r"\bvyavhaarik matlab\b", "matlab ye ki"),
    (r"\bhisaab se hisaab se\b", "hisaab se"),
    # ── pass 2: leftovers found by the frequency audit ──
    (r"\bke zariye\b", "ke through"),
    (r"\bsauNpna\b", "hand over karna"),
    (r"\bdusre wajah se\b", "dusri wajah se"),
    (r"\bdate-sahit\b", "date ke saath"),
    (r"\bki presence mein\b", "ke saamne"),
    (r"\bpresence mein\b", "saamne"),
    (r"\bmana jaata hai\b", "maana jaata hai"),
    (r"\bmana jayega\b", "maana jayega"),
    (r"\bmana\b", "maana"),
    (r"\badhik\b", "zyada"),
    (r"\bkaaran\b", "wajah"),
    (r"\bsahit\b", "ke saath"),
    (r"\bsauNpe?\b", "hand over"),
    (r"\bsauNpna\b", "hand over karna"),
    (r"\bhastaksharit\b", "signed"),
    (r"\bsabhi\b", "sab"),
    (r"\banuroop\b", "ke hisaab se"),
    (r"\baam taur par\b", "generally"),
    (r"(?<!of )\bexpenditure\b", "kharch"),  # never "Department of Expenditure"
    (r"\btay karega\b", "tay karega"),
    # vocabulary
    (r"\badhaar\b", "base"),
    (r"\bgunjaish\b", "chance"),
    (r"\bmaujoodgi\b", "saamne hona"),
    (r"\bvyavhaarik\b", "practical"),
    (r"\bvyavhaar\b", "practical"),
    (r"\bspasht\b", "clear"),
    (r"\bprabandh\b", "intezaam"),
    (r"\bvivec\b", "discretion"),
    (r"\bnigraani\b", "supervision"),
    (r"\bhastakshar\b", "sign"),
    (r"\banya\b", "dusre"),
    (r"\bdoor-andeshi\b", "foresight"),
    (r"\bkarwai\b", "action"),
    (r"\btransfar\b", "transfer"),
    (r"\bsauNp\b", "hand over"),
    (r"\bsaunp\b", "hand over"),
    (r"\bupalabdh\b", "available"),
    (r"\bprapt\b", "mila"),
    (r"\bnirnay\b", "decision"),
    (r"\baavashyak\b", "zaroori"),
    (r"\banivary\b", "zaroori"),
    (r"\bpramanit\b", "verified"),
    (r"\bsamapt\b", "khatam"),
    (r"\bprashasanik\b", "administrative"),
    (r"\bpanjika\b", "register"),
    (r"\bkeval\b", "sirf"),
    (r"\bkewal\b", "sirf"),
    (r"\btatha\b", "aur"),
    (r"\bevam\b", "aur"),
    (r"\bathva\b", "ya"),
    (r"\bkarya\b", "kaam"),
    (r"\bkaryalaya\b", "office"),
    (r"\bnimn\b", "niche"),
    (r"\buttardayi\b", "zimmedar"),
    (r"\bsampatti\b", "asset"),
    (r"\bsahayata\b", "madad"),
    (r"\bkathin\b", "mushkil"),
    (r"\bprabhav\b", "effect"),
    (r"\bvivad\b", "dispute"),
    (r"\bprayojan\b", "zaroorat"),
    (r"\bapekshit\b", "expected"),
    (r"\babhilekh\b", "record"),
    (r"\bsanchit\b", "accumulated"),
    (r"\bsewa\b", "service"),
    (r"\bniyam\b", "rule"),
    (r"\bvaakya\b", "line"),
    (r"\banumati\b", "permission"),
    (r"\banumodan\b", "approval"),
    (r"\bsvikriti\b", "approval"),
    (r"\bsahmati\b", "consent"),
    (r"\bashrit\b", "depend"),
    (r"\bkram\b", "step"),
    (r"\baarambh\b", "start"),
    (r"\bparyapt\b", "enough"),
    (r"\bnishchit\b", "fix"),
    (r"\bnirdharit\b", "tay"),
    (r"\bdrishti\b", "nazar"),
    (r"\bsujhav\b", "suggestion"),
    (r"\baadesh\b", "order"),
    (r"\bnirdesh\b", "instruction"),
    (r"\bbhandar\b", "store"),
    (r"\bvartaman\b", "aaj"),
    (r"\bpratishat\b", "%"),
    (r"\btithi\b", "date"),
    (r"\bsamay\b", "time"),
    (r"\bnahin\b", "nahi"),
    (r"\byeh\b", "ye"),
    (r"\bjaayega\b", "jayega"),
    (r"\bjaayenge\b", "jayenge"),
    (r"\bjaayegi\b", "jayegi"),
    (r"\bjaayen\b", "jayen"),
    (r"\bmatra\b", "sirf"),
    (r"\bprastut\b", "present"),
    (r"\bnivedan\b", "request"),
    (r"\bsandarbh\b", "reference"),
    (r"\bprakaran\b", "case"),
    (r"\bvyakti\b", "aadmi"),
    (r"\bsuvidha\b", "facility"),
    (r"\bvyavastha\b", "intezaam"),
    (r"\bupyog\b", "use"),
    (r"\bgintee\b", "ginti"),
    (r"\bmaanyata\b", "valid"),
]

# ── Devanagari rules (boundary = "not another Devanagari letter") ─────────────
D = r"(?<![\u0900-\u097F]){}(?![\u0900-\u097F])"
DEVA = [
    ("के अनुरूप", "के हिसाब से"),
    ("के अनुसार", "के हिसाब से"),
    ("के आधार पर", "के हिसाब से"),
    ("के तहत", "के अंडर"),
    ("की गुंजाइश", "का chance"),
    ("की मौजूदगी में", "के सामने"),
    ("मौजूदगी में", "सामने"),
    ("व्यावहारिक मतलब", "मतलब ये कि"),
    ("लागू होते हैं", "लगते हैं"),
    ("लागू होता है", "लगता है"),
    ("लागू होती है", "लगती है"),
    ("लागू हैं", "लगते हैं"),
    ("लागू है", "लगता है"),
    ("लागू नहीं", "लगता नहीं"),
    ("अनुसार", "के हिसाब से"),
    ("सभी", "सब"),
    ("मूल्यवान", "कीमती"),
    ("वस्तुओं", "आइटम्स"),
    ("हानि", "नुकसान"),
    ("क्षति", "नुकसान"),
    ("निपटान", "डिस्पोज़ल"),
    ("अभिरक्षा", "कस्टडी"),
    ("निविदा", "टेंडर"),
    ("सत्यापन", "वेरिफ़िकेशन"),
    ("निरीक्षण", "इंस्पेक्शन"),
    ("प्राधिकारी", "अथॉरिटी"),
    ("अध्याय", "चैप्टर"),
    ("अधिक", "ज़्यादा"),
    ("वर्ष", "साल"),
    ("कारण", "वजह"),
    ("प्रबंधन", "मैनेजमेंट"),
    ("प्रबंध", "इंतज़ाम"),
    ("हस्ताक्षर", "साइन"),
    ("अन्य", "दूसरे"),
    ("संपत्ति", "asset"),
    ("व्यक्ति", "आदमी"),
    ("कठिन", "मुश्किल"),
    ("सहायता", "मदद"),
    ("उपलब्ध", "available"),
    ("निर्णय", "फैसला"),
    ("आवश्यक", "ज़रूरी"),
    ("अनिवार्य", "ज़रूरी"),
    ("प्रमाणित", "verified"),
    ("पंजिका", "रजिस्टर"),
    ("तथा", "और"),
    ("एवं", "और"),
    ("अथवा", "या"),
    ("न्यूनतम", "कम से कम"),
    ("अधिकतम", "सबसे ज़्यादा"),
    ("शुल्क", "फीस"),
    ("प्रक्रिया", "process"),
    ("भंडार", "स्टोर"),
    ("कार्यालय", "ऑफ़िस"),
    ("कार्य", "काम"),
    ("निम्न", "नीचे"),
    ("उत्तरदायी", "ज़िम्मेदार"),
    ("अभिलेख", "record"),
    ("पर्याप्त", "enough"),
    ("निश्चित", "fix"),
    ("निर्धारित", "तय"),
    ("दृष्टि", "नज़र"),
    ("निर्देश", "instruction"),
    ("सूचना", "जानकारी"),
    ("प्रतिशत", "%"),
    ("तिथि", "तारीख"),
    ("गणना", "गिनती"),
    ("सीमा", "लिमिट"),
    ("अनुमोदन", "approval"),
    ("स्वीकृति", "approval"),
    ("हस्तांतरण", "transfer"),
    ("समिति", "committee"),
    ("संशोधन", "amendment"),
    ("राजपत्र", "gazette"),
    ("बोलीदाता", "बिडर"),
    ("वस्तु", "आइटम"),
    ("मूल्य", "कीमत"),
    ("प्राप्त", "मिलना"),
    ("केवल", "सिर्फ"),
]



# ── Devanagari pass 2: the administrative-Hindi register, made spoken ────────
DEVA2 = [
    ("सक्षम अधिकारी", "कॉम्पिटेंट अथॉरिटी"),
    ("सर्वोच्च स्वीकार्य ज़िम्मेदार बिडर", "सबसे ऊँची वैध बोली वाला बिडर"),
    ("सर्वोच्च स्वीकार्य", "सबसे ऊँची मंज़ूर"),
    ("ज़िम्मेदार बिडर", "वैध बिडर"),
    ("सार्वजनिक नीलामी", "पब्लिक ऑक्शन"),
    ("प्रति-प्रस्ताव", "काउंटर-ऑफ़र"),
    ("प्रतिभूति", "सिक्योरिटी"),
    ("ज्ञापन", "मेमोरेंडम"),
    ("हृास", "डेप्रिसिएशन"),
    ("ह्रास", "डेप्रिसिएशन"),
    ("बयाना", "अर्नेस्ट मनी"),
    ("सक्षम", "कॉम्पिटेंट"),
    ("यदि", "अगर"),
    ("विज्ञापित", "खुले"),
    ("मंत्रालयों", "मिनिस्ट्रीज़"),
    ("मंत्रालय", "मिनिस्ट्री"),
    ("विभागों", "डिपार्टमेंट्स"),
    ("विभाग", "डिपार्टमेंट"),
    ("राशि", "रकम"),
    ("दिनांक", "तारीख"),
    ("उचित", "सही"),
    ("शेष", "बाकी"),
    ("पुस्तकालय", "लाइब्रेरी"),
    ("पूर्ण", "पूरा"),
    ("घोषित", "डिक्लेयर"),
    ("वित्त", "फाइनेंस"),
    ("आंतरिक", "इंटरनल"),
    ("सहित", "के साथ"),
    ("स्थायी", "फिक्स्ड"),
    ("व्यय", "खर्च"),
    ("अधिशेष", "सरप्लस"),
    ("सामग्री", "सामान"),
    ("अवशिष्ट", "बची हुई"),
    ("आंकलित", "आंकी गई"),
    ("विनाश", "नष्ट"),
    ("सर्वोच्च", "सबसे ऊँची"),
    ("विक्रय", "सेल"),
    ("स्वीकार्य", "मंज़ूर"),
    ("स्वीकार", "मंज़ूर"),
    ("सामान्यतः", "आम तौर पर"),
    ("असमानताएँ", "गड़बड़ियाँ"),
    ("खातों", "अकाउंट्स"),
    ("खाते", "अकाउंट"),
    ("कार्रवाई", "action"),
    ("खंडों", "क्लॉज़"),
    ("सार्वजनिक", "पब्लिक"),
    ("आरक्षित", "रिज़र्व्ड"),
    ("बोलियाँ", "बिड्स"),
    ("सौंपना", "हैंड ओवर करना"),
    ("सौंपने", "हैंड ओवर करने"),
    ("सौंपा", "हैंड ओवर किया"),
    ("स्थान", "लोकेशन"),
    ("स्थिति", "कंडीशन"),
    ("समायोजित", "एडजस्ट"),
    ("समायोजन", "एडजस्टमेंट"),
    ("प्रभाग", "डिवीजन"),
    ("परामर्श", "कंसल्टेशन"),
    ("अनुकूल", "फेवरेबल"),
    ("शीर्ष", "टॉप"),
    ("सामान्य", "नॉर्मल"),
    ("चरण", "स्टेप"),
    ("बारंबारता", "फ्रीक्वेंसी"),
    ("योग्य", "एलिजिबल"),
    ("सदैव", "हमेशा"),
    ("अधिकारी", "ऑफिसर"),
    ("कलात्मक", "आर्टिस्टिक"),
    ("ऐतिहासिक", "हिस्टोरिकल"),
    ("अनुपयुक्त", "अनसर्विसेबल"),
    ("द्वारा", "से"),
]


# ── Devanagari pass 3: long tail + repairs of pass-2 artefacts ───────────────
DEVA3 = [
    ("खपत एलिजिबल", "कन्ज़्यूमेबल"),
    ("पर्यावरण-फेवरेबल नष्ट", "पर्यावरण के हिसाब से नष्ट करना"),
    ("डेप्रिसिएशन के वजह नुकसान के चार टॉप हैं", "डेप्रिसिएशन की वजह से होने वाले नुकसान के चार heads हैं"),
    ("उप-नियम एक", "सब-रूल (1)"),
    ("उप-नियम दो", "सब-रूल (2)"),
    ("उप-नियम तीन", "सब-रूल (3)"),
    ("उप-नियम", "सब-रूल"),
    ("निष्कर्षों के साथ", "findings के साथ"),
    ("प्रमाण-पत्र", "सर्टिफिकेट"),
    ("संज्ञान में", "नोटिस में"),
    ("अपलिखित करने", "write-off करने"),
    ("स्थल", "साइट"),
    ("उपस्थिति", "मौजूदगी"),
    ("अनुपयोगी", "अनसर्विसेबल"),
    ("वस्तुएँ", "आइटम्स"),
    ("वस्तुओं", "आइटम्स"),
    ("विधि", "तरीका"),
    ("लेखा", "अकाउंट"),
    ("बिक्री", "सेल"),
    ("निगरानी", "सुपरविज़न"),
    ("कारणों", "वजहों"),
    ("कारण", "वजह"),
    ("औपचारिक", "फॉर्मल"),
    ("शक्तियाँ", "powers"),
    ("अधीन", "अंडर"),
    ("विनियमित", "regulate"),
    ("दूरदर्शिता", "foresight"),
    ("घिसावट", "wear and tear"),
    ("भौतिक", "फिज़िकल"),
    ("आंकी गई", "assessed"),
    ("संग्रहित", "collect"),
    ("आमंत्रित", "invite"),
    ("असमानताएं", "गड़बड़ियाँ"),
    ("उपभोग्य", "कन्ज़्यूमेबल"),
    ("प्रत्यक्ष रूप से", "directly"),
    ("के माध्यम से", "के through"),
    ("माध्यम से", "के through"),
    ("व्यापक प्रचार", "wide publicity"),
    ("प्रारंभ", "शुरू"),
    ("जोखिम", "risk"),
    ("लागत", "cost"),
    ("चूककर्ता", "defaulter"),
    ("चूक", "default"),
    ("जब्त", "forfeit"),
    ("विलंब", "late"),
    ("अनुमोदित", "approved"),
    ("समिति", "committee"),
    ("सिफ़ारिश", "recommend"),
    ("निरीक्षण", "इंस्पेक्शन"),
    ("संरक्षा", "सुरक्षा"),
]


# ── Devanagari pass 4: grammar repairs + remaining formal terms ──────────────
DEVA4 = [
    ("बल-प्रकोष्ठ परिस्थितियाँ", "Force Majeure"),
    ("दूसरे तरीका से", "किसी और तरीके से"),
    ("दूसरे वजहों से", "दूसरी वजहों से"),
    ("पाँच टॉप", "पाँच heads"),
    ("चार टॉप", "चार heads"),
    ("के अतिरिक्त", "के अलावा"),
    ("टॉप", "heads"),
    ("उपेक्षा", "neglect"),
    ("अप्रचलन", "obsolescence"),
    ("प्रत्याशित", "anticipated"),
    ("पुनर्मूल्यांकन", "revaluation"),
    ("स्टॉक-टेकिंग", "stock-taking"),
    ("निपटाए गए", "dispose kiye gaye"),
    ("तैयार होगा", "बनेगा"),
    ("शामिल न हो", "शामिल न हो"),
    ("लाभ और नुकसान", "profit/loss"),
    ("सुधार या", "correction/"),
    ("अनुमोदन", "approval"),
    ("मंज़ूरी", "approval"),
    ("कार्यवाही", "action"),
    ("तुरंत", "turant"),
    ("प्रभार", "charge"),
    ("अधिभार भुगतान", "balance payment"),
]


# ── Devanagari pass 5: script hygiene ───────────────────────────────────────
DEVA5 = [
    ("किसी किसी और", "किसी और"),
    ("correction/ एडजस्टमेंट", "correction/adjustment"),
    ("dispose kiye gaye", "डिस्पोज़ किए गए"),
]


# ── Devanagari pass 6: proper nouns must never be translated ────────────────
DEVA6 = [
    ("खर्च डिपार्टमेंट", "डिपार्टमेंट ऑफ एक्सपेंडिचर"),
    ("व्यय विभाग", "डिपार्टमेंट ऑफ एक्सपेंडिचर"),
    ("शत्रु की कार्रवाई", "एनेमी एक्शन"),
    ("क्रियान्वयन स्टेप", "इम्प्लीमेंटेशन फेज़"),
    ("तैयारी स्टेप", "तैयारी फेज़"),
]

def preserve_case(src, rep):
    if src[:1].isupper() and rep[:1].islower():
        return rep[0].upper() + rep[1:]
    return rep


ROMAN_FIELD = re.compile(r"(?:ex|hg|hook|intro|q|a|lab|label|text|exact|title):'((?:[^'\\]|\\.)*)'")


def guard_roman_fields(text):
    """A Devanagari pass must never leave Devanagari inside a Roman-script field."""
    def fix(m):
        body = m.group(1)
        cleaned = re.sub(r"[\u0900-\u097F]+", "", body)
        return m.group(0).replace(body, cleaned)
    return ROMAN_FIELD.sub(fix, text)


def apply_rules(text, rules, deva=False):
    total = 0
    for pat, rep in rules:
        rx = re.compile(D.format(re.escape(pat)) if deva else pat, re.IGNORECASE if not deva else 0)
        def sub(m):
            nonlocal total
            total += 1
            return preserve_case(m.group(0), rep)
        text = rx.sub(sub, text)
    return text, total


def main():
    grand = 0
    for name in FILES:
        p = ROOT / name
        src = p.read_text(encoding="utf-8")
        out, n1 = apply_rules(src, ROMAN)
        out, n2 = apply_rules(out, DEVA, deva=True)
        out, n3 = apply_rules(out, DEVA2, deva=True)
        out, n4 = apply_rules(out, DEVA3, deva=True)
        out, n5 = apply_rules(out, DEVA4, deva=True)
        out, n6 = apply_rules(out, DEVA5, deva=True)
        out, n7 = apply_rules(out, DEVA6, deva=True)
        out = guard_roman_fields(out)
        out = re.sub(r"  +", " ", out)
        p.write_text(out, encoding="utf-8")
        grand += n1 + n2 + n3 + n4 + n5 + n6 + n7
        print(f"{name}: {n1} roman + {n2}/{n3}/{n4}/{n5}/{n6}/{n7} dev 1-6")
    print(f"total: {grand} replacements")
    return 0


if __name__ == "__main__":
    sys.exit(main())
