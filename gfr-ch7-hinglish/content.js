/* =====================================================================
   GFR 2017 — CHAPTER 7: INVENTORY MANAGEMENT (RULES 207–223)
   Interactive Hinglish comic explainer — content layer
   Status: [CURRENT] — verified 25 September 2026
   ===================================================================== */

const META = {
  title: 'GFR 2017 — Chapter 7: Inventory Management',
  span: 'Rules 207–223',
  lastVerified: '25 September 2026',
  source: 'General Financial Rules, 2017 (DoE, Ministry of Finance), as updated up to 31.07.2025; latest bi-annual compilation up to 31.01.2026',
  status: 'CURRENT'
};

/* Cast — same faces across all scenes (character continuity) */
const CAST = {
  anita:  { name: 'Anita Deshmukh', role: 'Section Officer / Officer-in-charge of stores' },
  ravi:   { name: 'Ravi Kumar',     role: 'Stores Assistant (dealing hand)' },
  farah:  { name: 'Farah Qureshi',  role: 'Accounts Officer, Internal Finance Wing' },
  suresh: { name: 'Suresh Pillai',  role: 'Head of Office / Competent Authority' },
  manjeet:{ name: 'Manjeet Kaur',   role: 'Librarian' }
};

/* ─────────────────────────────────────────────────────────────────────
   SCENES
   ───────────────────────────────────────────────────────────────────── */
const SCENES = [

/* ── 1 ─────────────────────────────────────────────────────────── */
{
  id: 's1', rules: ['207'], group: 'Scope',
  title: 'Chapter 7 ka naqsha — Rule 207',
  panel: 'assets/panels/scene-01.png',
  audio: 'assets/audio/scene-01.mp3',
  alt: 'A government storeroom doorway: a woman officer and a young stores assistant looking at stacked cartons and old office equipment.',
  est: 51,
  bubbles: [
    { who:'anita', side:'left',  t:2,
      hg:'Ravi, ye store ka charge ab mere paas hai. Inventory kahan se shuru karein?',
      hi:'रवि, स्टोर का चार्ज अब मेरे पास है। इन्वेंटरी कहाँ से शुरू करें?' },
    { who:'ravi', side:'right', t:12,
      hg:'Madam, GFR 2017 ka Chapter 7. Rule 207 se 223 tak — poori kahani isi mein hai.',
      hi:'मैडम, जीएफआर 2017 का अध्याय सात। रूल 207 से 223 तक — पूरी कहानी इसी में है।' },
    { who:'anita', side:'third', t:26,
      hg:'Toh pehle rule, phir register. Receipt → Custody → Verification → Disposal.',
      hi:'तो पहले नियम, फिर रजिस्टर। प्राप्ति → अभिरक्षा → सत्यापन → निपटान।' }
  ],
  caption: {
    hg:'GFR 2017 ka Chapter 7 = Inventory Management, Rule 207 se Rule 223 tak — kul 17 rules. Ye basic rules sabhi Central Ministries/Departments par lagu hain; isi chapter ke anuroop koi bhi Ministry/Department detailed instructions bana sakti hai. Inventory sirf "gintee" nahin — 4 kadam: Receipt → Custody → Physical Verification → Disposal.',
    hi:'जनरल फाइनेंशियल रूल्स 2017 का अध्याय सात — इन्वेंटरी मैनेजमेंट। इसमें रूल 207 से लेकर रूल 223 तक, कुल सत्रह नियम हैं। ये सभी केंद्रीय मंत्रालयों और विभागों के लिए बुनियादी नियम हैं। इसी अध्याय के अनुरूप, किसी भी मंत्रालय या विभाग के लिए विस्तृत निर्देश बनाए जा सकते हैं। इन्वेंटरी मैनेजमेंट का मतलब सिर्फ सामान गिनना नहीं है। इसमें चार कदम आते हैं — सामान की प्राप्ति, सुरक्षित अभिरक्षा, समय पर भौतिक सत्यापन, और जो उपयोगी न रहे उसका नियमानुसार निपटान।'
  },
  rule: {
    no: 'Rule 207',
    title: 'Scope of Chapter 7',
    exact: 'This chapter contains the basic rules regarding inventory management applicable to all Ministries or Departments. Detailed instructions and procedures relating to inventory management may be prescribed by various Ministries or Departments broadly in conformity with the basic rules contained in this chapter.',
    points: [
      'Chapter 7 = <b>Rules 207 to 223</b> (17 rules).',
      'Applies to all Central Government Ministries/Departments — and, per Rule 1, to attached & subordinate bodies; deemed applicable to Autonomous Bodies unless their own approved financial rules say otherwise.',
      'A department may issue its own detailed instructions, but they must be <b>broadly in conformity</b> with this chapter — they cannot dilute it.'
    ],
    kv: {
      'WHO': 'Every Ministry/Department; Officer-in-charge of stores',
      'ACTION': 'Follow the basic rules; issue conforming detailed instructions',
      'AUTHORITY': 'Ministry/Department (GFR itself is issued by Department of Expenditure)',
      'CROSS-REF': 'Rule 1 (applicability) · Rules 33–38 (losses) · DFPR (delegated powers)'
    },
    hook: '4 Kadam: Receipt → Custody → Verification → Disposal',
    warn: 'Departmental instructions that contradict Chapter 7 are not valid — "conformity" is the test under Rule 207.'
  },
  decision: {
    q: 'Charge letter mein sirf itna likha hai: "samaan sambhaliye". Aap kya karenge?',
    opts: [
      { label:'Department ke purane chhote orders hi kaafi hain, Chapter 7 dekhne ki zarurat nahi.', ok:false,
        why:'Rule 207 ke tahat departmental instructions Chapter 7 ke <b>anuroop</b> hone chahiye. Chapter 7 sabhi Ministries/Departments ke liye basic rules hai — usse bypass nahin kiya ja sakta.' },
      { label:'Chapter 7 ke basic rules ko base banaunga, phir departmental instructions unke anuroop check karunga.', ok:true,
        why:'Sahi. Rule 207 dono baatein saath mein rakhta hai — chapter ke basic rules universal hain, aur departmental detail unhi ke anuroop ho sakti hai.' }
    ]
  }
},

/* ── 2 ─────────────────────────────────────────────────────────── */
{
  id: 's2', rules: ['208','209','210'], group: 'Receipt · Issue · Custody',
  title: 'Maal aaya, maal gaya, maal sambhala — Rules 208–210',
  panel: 'assets/panels/scene-02.png',
  audio: 'assets/audio/scene-02.mp3',
  alt: 'A government store receiving bay: cartons being counted and weighed on a platform scale while the officer checks a delivery challan against a stock register.',
  est: 69,
  bubbles: [
    { who:'ravi', side:'left',  t:2,
      hg:'Madam, supplier ka maal aa gaya. Challan match ho gaya — bas entry kar deta hoon.',
      hi:'मैडम, सप्लायर का माल आ गया। चालान मैच हो गया — बस एंट्री कर देता हूँ।' },
    { who:'anita', side:'right', t:14,
      hg:'Challan kaafi nahi, Ravi. Rule 208 — count, measure ya weigh, visual inspection, phir stock register mein entry.',
      hi:'चालान काफी नहीं, रवि। रूल 208 — गिनती, माप या तौल, विजुअल जाँच, फिर स्टॉक रजिस्टर में एंट्री।' },
    { who:'ravi', side:'third', t:38,
      hg:'Aur jab ye samaan doosre division ya contractor ko jaayega?',
      hi:'और जब ये सामान दूसरे डिवीजन या ठेकेदार को जाएगा?' }
  ],
  caption: {
    hg:'Rule 208 — Private supplier se maal aate hi: contract terms ke hisaab se receipt, phir counting/measuring/weighing + visual inspection (zaroorat par technical inspection), IT-based stock register mein entry, aur officer ka receipt certificate. Rule 209 — internal issue: prescribed form mein indent zaroori + likhit ya online acknowledgement; contractor ko diya gaya maal ho to recovery rate aur total value usse date-sahit sign karwana hoga. Rule 210 — Custody: valuable aur combustible articles ki safe custody, proper storage, temperature aur dust-free ka prabandh.',
    hi:'रूल 208 — निजी सप्लायर से माल मिलने पर, स्टोर के अधिकारी को कॉन्ट्रैक्ट की शर्तों के अनुसार माल लेना होगा। माल की गिनती, माप या तौल की जाएगी, और विजुअल इंस्पेक्शन होगा। जहाँ ज़रूरी हो, वहाँ तकनीकी जाँच भी। फिर आईटी आधारित स्टॉक रजिस्टर में एंट्री, और अधिकारी द्वारा प्राप्ति का प्रमाण-पत्र। रूल 209 — आंतरिक डिवीजन को माल देते समय, निर्धारित प्रपत्र में इंडेंट ज़रूरी है, और माल लेने वाले अधिकारी से लिखित या ऑनलाइन पावती लेनी होगी। यदि माल ठेकेदार को दिया गया है और उसकी लागत वसूलनी है, तो वसूली दर और कुल राशि ठेकेदार से दिनांक सहित हस्ताक्षरित करानी होगी। रूल 210 — अभिरक्षा। कीमती और ज्वलनशील वस्तुओं की सुरक्षित अभिरक्षा, उचित भंडारण, तापमान और धूल-मुक्त वातावरण का प्रबंध स्टोर अधिकारी को करना होगा।'
  },
  rule: {
    no: 'Rules 208 – 210',
    title: 'Receipt from private suppliers · Internal issue · Custody',
    exact: 'Rule 208: while receiving goods from a supplier, the officer-in-charge of stores shall refer to the relevant contract terms and follow the prescribed procedure — counting / measuring / weighing, visual inspection, technical inspection where required, entry in the stock register (IT-based preferred) and a certificate of receipt by the officer. Rule 209: issue of materials from stock requires a proper indent in the prescribed form and a written/online acknowledgement of receipt; where material is issued to a contractor and its cost is recoverable, the recovery rates and total value chargeable must be acknowledged by the contractor, duly signed and dated. Rule 210: the officer-in-charge shall arrange safe custody and proper storage of goods, especially valuable and/or combustible articles, including required temperature and dust-free environment.',
    points: [
      '<b>208 = Receipt:</b> count/measure/weigh → visual inspection → technical inspection where needed → stock-register entry → receipt certificate.',
      '<b>209 = Issue:</b> indent in the prescribed form → written <i>or</i> online acknowledgement from the indenting officer; contractor issues need signed & dated acknowledgement of recovery rates and total value.',
      '<b>210 = Custody:</b> safe custody + proper storage accommodation, temperature control and dust-free environment for valuable/combustible articles.'
    ],
    kv: {
      'WHO': 'Officer-in-charge of stores',
      'ACTION': 'Receive, record, issue against indent, keep safe custody',
      'RECORD': 'Stock register (IT-based preferred) + receipt certificate + indent + acknowledgement',
      'CROSS-REF': 'Chapter 6 (procurement/contract terms) · Rule 213 (verification)'
    },
    hook: '208 = Receipt · 209 = Issue · 210 = Custody',
    warn: 'Challan ≠ receipt. Verification ≠ condemnation — finding a discrepancy is a reporting step (Rules 33–38), not an automatic punishment.'
  },
  decision: {
    q: 'Ek division ne phone par bola: "jaldi 10 kursiyan bhej do, indent baad mein". Aap?',
    opts: [
      { label:'Phone note file par rakh kar maal bhej denge — kaam rukna nahi chahiye.', ok:false,
        why:'Rule 209 ke tahat issue <b>prescribed form ke indent</b> par hota hai aur likhit/online acknowledgement lena zaroori hai. Phone par issue = record ka gap.' },
      { label:'Pehle prescribed form mein indent lenge, phir issue karke written/online acknowledgement lenge.', ok:true,
        why:'Sahi. Indent + acknowledgement Rule 209 ki do hard requirements hain — isi se stock register aur asli balance match karta hai.' }
    ]
  }
},

/* ── 3 ─────────────────────────────────────────────────────────── */
{
  id: 's3', rules: ['211','212'], group: 'Accounts · Registers',
  title: 'Register alag-alag kyun? — Rules 211–212',
  panel: 'assets/panels/scene-03.png',
  audio: 'assets/audio/scene-03.mp3',
  alt: 'A records room with steel almirahs of registers, while outside a contractor loads a departmental generator set onto a truck and an officer notes hire charges in a register.',
  est: 71,
  bubbles: [
    { who:'anita', side:'left',  t:2,
      hg:'Farah, ye registers alag-alag kyun rakhe hain — ek hi kyun nahi?',
      hi:'फराह, ये रजिस्टर अलग-अलग क्यों रखे हैं — एक ही क्यों नहीं?' },
    { who:'farah', side:'right', t:12,
      hg:'Kyunki Rule 211 kehta hai — har category ka alag account. Fixed assets GFR-22, consumables GFR-23, historical/artistic GFR-24.',
      hi:'क्योंकि रूल 211 कहता है — हर श्रेणी का अलग लेखा। फिक्स्ड असेट्स जीएफआर 22, कन्ज़्यूमेबल्स जीएफआर 23, ऐतिहासिक/कलात्मक जीएफआर 24।' },
    { who:'suresh', side:'third', t:44,
      hg:'Aur jo purana genset contractor ko hire par gaya — uska record aur hire charges?',
      hi:'और जो पुराना जेनसेट ठेकेदार को किराए पर गया — उसका रिकॉर्ड और किराया?' }
  ],
  caption: {
    hg:'Rule 211 — Officer-in-charge ko item-wise lists aur accurate returns rakhne honge, taaki kisi bhi samay actual balance aur book balance check ho sake. Register ka format goods ki nature, transactions ki frequency aur department ki requirements par depend karta hai. Alag-alag category ke liye alag account: Fixed assets Form GFR-22, consumables GFR-23, library books GFR-18, historical/artistic value assets GFR-24. Rule 212 — Agar fixed asset kisi local body, contractor ya aur kisi ko hire par diya jaaye, to proper record rakhna hoga, hire aur anya charges regularly recover karne honge, aur charges ka calculation asset ki historical cost par based hoga.',
    hi:'रूल 211 — स्टोर अधिकारी को मद-वार सूचियाँ और सटीक रिटर्न तैयार करने होंगे, ताकि किसी भी समय वास्तविक शेष और बही के शेष की जाँच हो सके। रजिस्टरों का प्रारूप सामान की प्रकृति, लेन-देन की बारंबारता और विभाग की आवश्यकताओं के अनुसार तय होगा। अलग-अलग श्रेणियों के लिए अलग लेखे — फिक्स्ड असेट्स फॉर्म जीएफआर 22 में, खपत योग्य सामान जीएफआर 23 में, पुस्तकालय की पुस्तकें जीएफआर 18 में, और ऐतिहासिक या कलात्मक मूल्य की संपत्ति जीएफआर 24 में। रूल 212 — यदि कोई स्थायी संपत्ति स्थानीय निकाय, ठेकेदार या अन्य को किराए पर दी जाए, तो संपत्ति का उचित रिकॉर्ड रखा जाए, किराया और अन्य शुल्क नियमित रूप से वसूल किए जाएँ, और इन शुल्क की गणना संपत्ति की ऐतिहासिक लागत पर आधारित हो।'
  },
  rule: {
    no: 'Rules 211 – 212',
    title: 'Lists and accounts · Hiring out of fixed assets',
    exact: 'Rule 211: the Officer-in-charge of stores shall maintain suitable item-wise lists and accounts and prepare accurate returns, making it possible at any point of time to check the actual balances with the book balances; the form of stock accounts is determined with reference to the nature of the goods, frequency of transactions and special requirements of the Ministry/Department. Separate accounts shall be kept for fixed assets (Form GFR-22), consumables such as stationery, chemicals, spare parts (Form GFR-23), library books (Form GFR-18 per secondary compilations) and assets of historical/artistic value (Form GFR-24). Rule 212: when a fixed asset is hired to local bodies, contractors or others, proper record shall be kept and hire and other charges, as determined under rules prescribed by the competent authority, shall be recovered regularly; calculation of such charges shall be based on the historical cost.',
    points: [
      '<b>Test under Rule 211:</b> at any point of time, actual balance must be checkable against book balance.',
      'Separate accounts by category — the register formats differ because the assets behave differently.',
      '<b>Rule 212:</b> hiring out is allowed, but record-keeping, regular recovery, and <b>historical cost</b> as the charging basis are mandatory.'
    ],
    kv: {
      'WHO': 'Officer-in-charge of stores / Head of Office',
      'FORMS': 'GFR-22 fixed assets · GFR-23 consumables · GFR-18 library books · GFR-24 historical/artistic',
      'BASIS': 'Hire charges = historical cost (NOT market rate)',
      'CROSS-REF': 'Rule 213 (verification uses these registers)'
    },
    hook: '211 = Alag register · 212 = Historical cost',
    warn: 'Hire charges are computed on <b>historical cost</b>, not on today’s market rate — a favourite exam trap.'
  },
  decision: {
    q: 'Contractor bolta hai: "genset ka hire charge market rate se kam rakho, warna theka chhod doonga". Aap?',
    opts: [
      { label:'Market rate laga denge — vyavharik faisla hai.', ok:false,
        why:'Rule 212 ke mutabiq charges <b>historical cost</b> par based hote hain, market rate par nahi. Convenience rule nahin badalti.' },
      { label:'Charges historical cost ke adhaar par calculate karenge aur record + regular recovery maintain karenge.', ok:true,
        why:'Sahi. Rule 212 ke do saath-saath farz: proper record + regular recovery, aur calculation ka base = historical cost.' }
    ]
  }
},

/* ── 4 ─────────────────────────────────────────────────────────── */
{
  id: 's4', rules: ['213'], group: 'Verification',
  title: 'Saal mein ek baar — Rule 213',
  panel: 'assets/panels/scene-04.png',
  audio: 'assets/audio/scene-04.mp3',
  alt: 'Two officers physically verifying a storeroom: one counting equipment against a register while the custodian stands beside them and a verification certificate is written into the stock register.',
  est: 63,
  bubbles: [
    { who:'anita', side:'left',  t:2,
      hg:'Aaj physical verification hai. Rule 213 — fixed assets aur consumables, dono saal mein kam se kam ek baar.',
      hi:'आज भौतिक सत्यापन है। रूल 213 — फिक्स्ड असेट्स और कन्ज़्यूमेबल्स, दोनों साल में कम से कम एक बार।' },
    { who:'manjeet', side:'right', t:16,
      hg:'Verification hamesha custodian officer ki maujoodgi mein hoga — aur certificate stock register mein.',
      hi:'सत्यापन सदैव अभिरक्षा अधिकारी की मौजूदगी में होगा — और प्रमाण-पत्र स्टॉक रजिस्टर में।' },
    { who:'ravi', side:'third', t:42,
      hg:'Aur shortfall ya damage mile to?',
      hi:'और कमी या क्षति मिले तो?' }
  ],
  caption: {
    hg:'Rule 213(1) — Fixed assets ka inventory aam taur par site par rakha jaaye; verification kam se kam saal mein ek baar, outcome corresponding register mein darj, aur discrepancies turant investigate karke account mein layi jaayen. Rule 213(2) — Sabhi consumable goods ka physical verification bhi kam se kam saal mein ek baar; discrepancies stock register mein darj kar action ke liye competent authority ko deni hongi. Verification hamesha custodian officer ki presence mein ho, aur verification certificate findings ke saath stock register mein record ho. Verification mein mili shortage, damage ya unserviceable goods turant competent authority ke notice mein layi jaayen — Rules 33 se 38 ke anusar action ke liye.',
    hi:'रूल 213 की उप-नियम एक — स्थायी संपत्तियों का इन्वेंटरी सामान्यतः स्थल पर रखा जाए। स्थायी संपत्तियों का सत्यापन कम से कम वर्ष में एक बार हो, और सत्यापन का परिणाम संबंधित रजिस्टर में दर्ज हो। असमानताएँ हों तो तुरंत जाँच कर उन्हें खाते में लाया जाए। उप-नियम दो — सभी खपत योग्य सामान का भौतिक सत्यापन भी कम से कम वर्ष में एक बार हो, और असमानताएँ स्टॉक रजिस्टर में दर्ज कर कार्रवाई के लिए सक्षम प्राधिकारी को दी जाएँ। सत्यापन सदैव उस अधिकारी की उपस्थिति में हो जिसके पास सामान की अभिरक्षा है, और सत्यापन प्रमाण-पत्र निष्कर्षों सहित स्टॉक रजिस्टर में दर्ज हो। सत्यापन में पाई गई कमी, क्षति या अनुपयोगी वस्तुएँ तुरंत सक्षम प्राधिकारी के संज्ञान में लाई जाएँ — रूल 33 से 38 के अनुसार कार्रवाई के लिए।'
  },
  rule: {
    no: 'Rule 213',
    title: 'Physical verification of fixed assets and consumables',
    exact: 'Rule 213(1): the inventory for fixed assets shall ordinarily be maintained at site. Fixed assets should be verified at least once in a year and the outcome of the verification recorded in the corresponding register. Discrepancies, if any, shall be promptly investigated and brought to account. Rule 213(2): a physical verification of all the consumable goods and materials should be undertaken at least once in a year and discrepancies, if any, should be recorded in the stock register for appropriate action by the competent authority. Verification shall always be made in the presence of the officer responsible for the custody of the inventory being verified, and a certificate of verification along with the findings shall be recorded in the stock register. Discrepancies including shortages, damages and unserviceable goods identified during verification shall immediately be brought to the notice of the competent authority for action under Rules 33 to 38.',
    points: [
      '<b>Fixed assets:</b> at least once a year · inventory ordinarily maintained at site · outcome recorded in the corresponding register.',
      '<b>Consumables:</b> at least once a year · discrepancies recorded in the stock register for the competent authority’s action.',
      '<b>Procedure:</b> verification in the presence of the custodian officer + verification certificate with findings recorded in the stock register.',
      '<b>Discrepancy route:</b> shortages / damages / unserviceable goods → immediately to the competent authority → action under <b>Rules 33–38</b> (loss reporting).'
    ],
    kv: {
      'FREQUENCY': 'At least once a year (both fixed assets and consumables)',
      'PRESENCE': 'Officer responsible for custody of the inventory',
      'RECORD': 'Verification certificate + findings in the stock register',
      'CROSS-REF': 'Rules 33–38 (defalcation & losses) · Rule 217 (later disposal)'
    },
    hook: 'Ek Saal, Do Category, Certificate Zaroori',
    warn: 'Verification ≠ condemnation. Finding a shortage triggers <b>reporting</b> under Rules 33–38 — the rule does not itself impose a penalty.'
  },
  decision: {
    q: 'Verification mein 4 purane computers kam mile. Pehla kadam kya hoga?',
    opts: [
      { label:'Register mein "shortage" likh kar agle saal tak wait karenge — tab tak mil jayenge.', ok:false,
        why:'Rule 213 discrepancies ko <b>turant</b> investigate karke account mein laane ko kehta hai, aur unhein competent authority ke notice mein laana hota hai.' },
      { label:'Shortage ko record karke turant competent authority ko report karenge — Rules 33 se 38 ke anusar action ke liye.', ok:true,
        why:'Sahi. Rule 213 discrepancies ko competent authority ke sanjjan mein le jaane ka rasta Rules 33–38 se jodta hai — yahi reporting chain hai.' }
    ]
  }
},

/* ── 5 ─────────────────────────────────────────────────────────── */
{
  id: 's5', rules: ['214','215'], group: 'Time triggers',
  title: 'Kitna purana to surplus? Aur library? — Rules 214–215',
  panel: 'assets/panels/scene-05.png',
  audio: 'assets/audio/scene-05.mp3',
  alt: 'A consumables storeroom with labelled shelves beside a government library reading room, where an officer checks a shelf and a librarian tallies volumes at a table.',
  est: 102,
  bubbles: [
    { who:'ravi', side:'left',  t:2,
      hg:'Madam, ye A4 paper aur toner pichhle 14 mahine se shelf par pada hai.',
      hi:'मैडम, यह ए4 पेपर और टोनर पिछले चौदह महीनों से शेल्फ पर पड़ा है।' },
    { who:'anita', side:'right', t:14,
      hg:'Rule 214 ka note yaad rakho — ek saal se zyada stock mein pada material aam taur par surplus mana jaata hai. Buffer stock alag baat hai.',
      hi:'रूल 214 का नोट याद रखो — एक साल से ज़्यादा स्टॉक में पड़ा सामान आम तौर पर समझा जाता है। बफर स्टॉक अलग बात है।' },
    { who:'manjeet', side:'third', t:62,
      hg:'Library alag hai — 20,000 tak volumes ho to har saal poori verification, 50,000 tak 3 saal mein, usse upar sample verification.',
      hi:'पुस्तकालय अलग है — बीस हज़ार तक खंडों पर हर साल पूर्ण सत्यापन, पचास हज़ार तक तीन साल में, उससे ऊपर नमूना सत्यापन।' }
  ],
  caption: {
    hg:'Rule 214 — Buffer stock: requirement ki frequency, quantity aur supply pattern ke adhaar par optimum buffer stock competent authority tay karega. Note: inventory carrying cost ek aisa expenditure hai jo material ki value nahi badhata — isliye ek saal se adhik samay tak stock mein pada material aam taur par surplus mana jaayega, jab tak usse alag treat karne ke kaaran na hon. Aise declared surplus items ko Rule 217 ke procedure se deal kiya jaata hai. Rule 215 — Library books: 20,000 ya usse kam volumes wale library mein har saal complete verification; 20,000 se zyada aur 50,000 tak — kam se kam 3 saal mein ek baar complete verification; 50,000 se zyada — 3 saal se adhik interval par sample verification. Sample verification mein unusual ya unreasonable shortage dikhe to complete verification hogi. Ek saal mein issue/consult ki gayi har 1,000 volumes par 5 volumes ki loss reasonable maani ja sakti hai, agar dishonesty ya negligence ke kaaran na ho; lekin ₹1,000 se adhik value ki kitab aur rare books — value chahe jo ho — ki loss ki investigation zaroori hai.',
    hi:'रूल 214 — बफर स्टॉक: आवश्यकता की बारंबारता, मात्रा और आपूर्ति पैटर्न के आधार पर इष्टतम बफर स्टॉक सक्षम प्राधिकारी तय करेगा। नोट: इन्वेंटरी धारण लागत एक ऐसा व्यय है जो सामान के मूल्य में वृद्धि नहीं करता — इसलिए एक वर्ष से अधिक समय तक स्टॉक में पड़ा सामान आम तौर पर अधिशेष माना जाएगा, जब तक कि उसे अन्यथा मानने के पर्याप्त कारण न हों। ऐसी अधिशेष घोषित वस्तुओं को रूल 217 की प्रक्रिया से निपटाया जाता है। रूल 215 — पुस्तकालय की पुस्तकें: बीस हज़ार या उससे कम खंडों वाले पुस्तकालय में प्रतिवर्ष पूर्ण सत्यापन; बीस हज़ार से अधिक और पचास हज़ार तक — कम से कम तीन वर्ष में एक बार पूर्ण सत्यापन; पचास हज़ार से अधिक — तीन वर्ष से अधिक अंतराल पर नमूना सत्यापन। यदि नमूना सत्यापन में असामान्य या अतर्कसंगत कमी दिखे, तो पूर्ण सत्यापन कराया जाए। एक वर्ष में जारी या उपयोग की गई हज़ार पुस्तकों पर पाँच पुस्तकों की हानि उचित मानी जा सकती है, यदि वह बेईमानी या लापरवाही के कारण न हो; परंतु एक हज़ार रुपये से अधिक मूल्य की पुस्तक और दुर्लभ पुस्तकें — मूल्य चाहे जो हो — उनकी हानि की जाँच अनिवार्य है।'
  },
  rule: {
    no: 'Rules 214 – 215',
    title: 'Buffer stock · Physical verification of library books',
    exact: 'Rule 214: depending on the frequency of requirement and quantity thereof as well as the pattern of supply of a consumable material, optimum buffer stock should be determined by the competent authority. Note — as inventory carrying cost is an expenditure that does not add value, a material remaining in stock for over a year shall generally be considered surplus, unless adequate reasons to treat it otherwise exist; items so declared surplus may be dealt with as per the procedure laid down under Rule 217. Rule 215(i): complete physical verification of books every year for libraries having not more than 20,000 volumes; for more than 20,000 and up to 50,000 volumes, at least once in three years; for more than 50,000 volumes, sample physical verification at intervals of not more than three years — and where such verification reveals unusual or unreasonable shortages, complete verification shall be done. Rule 215(ii): loss of five volumes per one thousand volumes issued/consulted in a year may be taken as reasonable provided such losses are not attributable to dishonesty or negligence; however, loss of a book of value exceeding ₹1,000 and rare books irrespective of value shall invariably be investigated.',
    points: [
      '<b>Rule 214:</b> optimum buffer stock is decided by the competent authority — it is a planning decision, not a fixed number.',
      '<b>The 1-year note is a general rule, not an absolute:</b> "generally be considered surplus … unless adequate reasons to treat it otherwise exist".',
      '<b>Library tiers:</b> ≤20,000 volumes → every year · 20,001–50,000 → at least once in 3 years · >50,000 → sample verification at intervals not exceeding 3 years.',
      '<b>5 per 1,000</b> volumes issued/consulted in a year is reasonable loss (if not due to dishonesty/negligence); a book worth <b>over ₹1,000</b>, or any rare book, must always be investigated.'
    ],
    kv: {
      'BUFFER STOCK': 'Optimum level fixed by competent authority (Rule 214)',
      'SURPLUS TRIGGER': 'In stock for over a year → generally surplus (rebuttable)',
      'LIBRARY': 'Every year / 3 years / sample every ≤3 years by size',
      'REASONABLE LOSS': '5 volumes per 1,000 issued-consulted per year',
      'CROSS-REF': 'Rule 217 (disposal of surplus)'
    },
    hook: '1 Saal = Surplus (generally) · 3 Saal = Library (large)',
    warn: 'The one-year surplus note is <b>rebuttable</b> — "unless adequate reasons to treat it otherwise exist". Never present it as automatic condemnation.'
  },
  decision: {
    q: 'Ek shelf par 3 saal purani, sealed, valid warranty wali spare kits hain. Surplus declare kar den?',
    opts: [
      { label:'Haan — 1 saal se upar stock mein pada hai, to automatically surplus hai.', ok:false,
        why:'Rule 214 ka note "generally" kehta hai aur reason dene ki gunjaish rakhta hai. Sealed, valid warranty wali planned spares ke liye adequate reason ho sakta hai.' },
      { label:'Pehle reason record karenge — planned/strategic spare ho to surplus mat samjho; warna Rule 217 ke procedure par bhej denge.', ok:true,
        why:'Sahi. Rule 214 note rebuttable hai: adequate reasons record karke item ko surplus nahin mana ja sakta; warna Rule 217 ka raasta.' }
    ]
  }
},

/* ── 6 ─────────────────────────────────────────────────────────── */
{
  id: 's6', rules: ['216'], group: 'Accountability',
  title: 'Charge ka transfer — Rule 216',
  panel: 'assets/panels/scene-06.png',
  audio: 'assets/audio/scene-06.mp3',
  alt: 'Two officers at a desk signing a handing-over statement of stores, each holding a copy, with registers and keys on the table.',
  est: 46,
  bubbles: [
    { who:'anita', side:'left',  t:2,
      hg:'Main transfer ho rahi hoon. Store ka charge aage kaun sambhalega?',
      hi:'मैं ट्रांसफर हो रही हूँ। स्टोर का चार्ज आगे कौन संभालेगा?' },
    { who:'farah', side:'right', t:12,
      hg:'Rule 216 — relieving aur relieved officer milkar ek statement banayenge, dono date ke saath sign karenge.',
      hi:'रूल 216 — रिलीविंग और रिलीव्ड अधिकारी मिलकर एक विवरण बनाएँगे, दोनों दिनांक के साथ हस्ताक्षर करेंगे।' },
    { who:'anita', side:'third', t:28,
      hg:'Aur dono ke paas ek-ek copy rahegi — tabhi accountability clear hai.',
      hi:'और दोनों के पास एक-एक प्रति रहेगी — तभी जवाबदेही स्पष्ट है।' }
  ],
  caption: {
    hg:'Rule 216 — Transfer of charge of goods and materials: agar officer-in-charge transfer ho, to transfar hone wale officer ko dekhna hoga ki goods/materials sahi tareeke se uske successor ko sauNp diye jaayen. Goods aur materials ki sabhi relevant details ka ek statement banega, jise relieving officer aur relieved officer dono date ke saath sign karenge. Dono officers apne paas signed statement ki ek-ek copy rakhenge. Ye chhota sa rule hai, lekin isi se yah tay hota hai ki agla shortfall kiske account mein jaayega.',
    hi:'रूल 216 — सामान और सामग्री के चार्ज का हस्तांतरण: यदि स्टोर के अधिकारी का स्थानांतरण हो, तो स्थानांतरित अधिकारी को देखना होगा कि सामान और सामग्री सही तरीके से उसके उत्तराधिकारी को सौंप दी जाए। सामान और सामग्री की सभी सुसंगत ब्यौरे वाला एक विवरण तैयार किया जाएगा, जिस पर रिलीविंग अधिकारी और रिलीव्ड अधिकारी दोनों दिनांक सहित हस्ताक्षर करेंगे। दोनों अधिकारी हस्ताक्षरित विवरण की एक-एक प्रति अपने पास रखेंगे। यह छोटा सा नियम है, लेकिन यही तय करता है कि अगली कमी किसके खाते में जाएगी।'
  },
  rule: {
    no: 'Rule 216',
    title: 'Transfer of charge of goods and materials',
    exact: 'In case of transfer of Officer-in-charge of the goods, materials etc., the transferred officer shall see that the goods or material are made over correctly to his successor. A statement giving all relevant details of the goods, materials etc., in question shall be prepared and signed with date by the relieving officer and the relieved officer. Each of these officers will retain a copy of the signed statement.',
    points: [
      'The outgoing officer must ensure the goods are <b>correctly made over</b> — not merely "handed over the keys".',
      'A statement with <b>all relevant details</b> is prepared and signed <b>with date</b> by both the relieving and the relieved officer.',
      '<b>Each keeps a copy</b> — that copy is what settles future accountability.'
    ],
    kv: {
      'WHO': 'Outgoing (relieved) and incoming (relieving) officer-in-charge',
      'DOCUMENT': 'Signed & dated statement of all relevant details',
      'COPIES': 'One retained by each officer',
      'CROSS-REF': 'Rule 211 (lists/accounts) · Rules 33–38 (losses)'
    },
    hook: 'Charge Badle = Statement Zaroori, Dono Ke Paas Copy',
    warn: 'An oral handover is not compliance — the rule requires a written, dated, jointly signed statement with a copy to each officer.'
  },
  decision: {
    q: 'Aap store ka charge chhod rahe hain. Successor kehta hai: "aap chale jaao, main baad mein dekh lunga". Aap?',
    opts: [
      { label:'Chabiyan de kar nikal jaate hain — waise bhi sab register mein hai.', ok:false,
        why:'Rule 216 sirf chabiyan sauNpne ki baat nahin karta: joint statement banana, dono ka date ke saath sign karna, aur dono ke paas copy — teeno zaroori hain.' },
      { label:'Dono milkar detail statement banayenge, date ke saath sign karenge, aur ek-ek copy rakhenge.', ok:true,
        why:'Sahi — yahi Rule 216 ka exact mechanism hai, aur yahi future shortage par liability tay karta hai.' }
    ]
  }
},

/* ── 7 ─────────────────────────────────────────────────────────── */
{
  id: 's7', rules: ['217'], group: 'Disposal — declaration',
  title: 'Surplus/obsolete/unserviceable ghoshit karna — Rule 217',
  panel: 'assets/panels/scene-07.png',
  audio: 'assets/audio/scene-07.mp3',
  alt: 'A small committee of officers inspecting old computers and furniture in a store, one recording reasons on a form while another checks a valuation sheet.',
  est: 76,
  bubbles: [
    { who:'suresh', side:'left',  t:2,
      hg:'In purane computers ko "bekaar" likh dena kaafi hai kya?',
      hi:'इन पुराने कंप्यूटरों को "बेकार" लिख देना काफी है क्या?' },
    { who:'anita', side:'right', t:14,
      hg:'Nahi Sir. Rule 217 — item kharidne wale competent authority ko reasons record karne honge, aur committee bana sakte hain.',
      hi:'नहीं सर। रूल 217 — वस्तु खरीदने वाले सक्षम प्राधिकारी को कारण दर्ज करने होंगे, और समिति बनाई जा सकती है।' },
    { who:'farah', side:'third', t:48,
      hg:'Book value, guiding price, reserved price — teeno nikalenge, aur report Form GFR-10 mein banegi.',
      hi:'बुक वैल्यू, गाइडिंग प्राइस, रिज़र्व्ड प्राइस — तीनों निकालेंगे, और रिपोर्ट फॉर्म जीएफआर 10 में बनेगी।' }
  ],
  caption: {
    hg:'Rule 217 — Disposal of goods: kisi item ko surplus, obsolete ya unserviceable tab declare kiya ja sakta hai jab woh Ministry/Department ke kaam ka na rahe. Declare karne ke reasons us authority ko record karne honge jo item kharidne ke liye competent hai. Competent authority apne vivec se committee bana sakti hai. Disposal se pehle book value, guiding price aur reserved price nikalne honge — agar book value nikalna sambhav na ho to original purchase price use kiya ja sakta hai — aur stores ki report Form GFR-10 mein banegi. Agar item kisi government servant ki negligence, fraud ya mischief se unserviceable hua ho, to responsibility fix karni hogi. Hazardous waste, scrap batteries aur e-waste ke liye Ministry of Environment, Forest & Climate Change ke guidelines ke anusar sale hogi, aur bidder ke paas e-auction aur delivery ke din valid recycler/pre-processor registration hona chahiye.',
    hi:'रूल 217 — माल का निपटान: किसी वस्तु को अधिशेष, अप्रचलित या अनुपयुक्त तब घोषित किया जा सकता है जब वह मंत्रालय या विभाग के काम की न रहे। घोषित करने के कारण उस प्राधिकारी को दर्ज करने होंगे जो वस्तु खरीदने के लिए सक्षम है। सक्षम प्राधिकारी अपने विवेक से समिति बना सकता है। निपटान से पहले बुक वैल्यू, गाइडिंग प्राइस और रिज़र्व्ड प्राइस निकालने होंगे — यदि बुक वैल्यू निकालना संभव न हो तो मूल क्रय मूल्य का उपयोग किया जा सकता है — और स्टोर की रिपोर्ट फॉर्म जीएफआर 10 में तैयार होगी। यदि वस्तु किसी सरकारी कर्मचारी की लापरवाही, धोखाधड़ी या दुर्भावना से अनुपयुक्त हुई हो, तो जिम्मेदारी तय करनी होगी। खतरनाक कचरे, स्क्रैप बैटरियों और ई-कचरे के लिए पर्यावरण, वन एवं जलवायु परिवर्तन मंत्रालय के दिशानिर्देशों के अनुसार बिक्री होगी, और बोलीदाता के पास ई-नीलामी और डिलीवरी के दिन वैध रीसायकलर या प्री-प्रोसेसर पंजीकरण होना चाहिए।'
  },
  rule: {
    no: 'Rule 217',
    title: 'Disposal of goods — declaration, valuation, responsibility',
    exact: 'Rule 217(i): an item may be declared surplus or obsolete or unserviceable if the same is of no use to the Ministry or Department; the reasons for declaring the item so shall be recorded by the authority competent to purchase the item. (ii) The competent authority may, at his discretion, constitute a committee at appropriate level to declare item(s) as surplus or obsolete or unserviceable. (iii) The book value, guiding price and reserved price required while disposing of the surplus goods shall also be worked out; where it is not possible to work out the book value, the original purchase price may be utilised; a report of stores for disposal shall be prepared in Form GFR-10. (iv) Where an item becomes unserviceable due to negligence, fraud or mischief on the part of a Government servant, responsibility for the same shall be fixed. (v) Scrap lots comprising hazardous waste, batteries, e-waste etc. shall be sold keeping in view the guidelines of the Ministry of Environment, Forest & Climate Change; prospective bidders must hold valid registration as recycler/preprocessor agency on the date of e-auction and delivery.',
    points: [
      '<b>Who declares:</b> the authority <b>competent to purchase</b> the item — reasons must be recorded (a committee is discretionary, not mandatory).',
      '<b>Valuation trio:</b> book value · guiding price · reserved price — book value not workable? Use the <b>original purchase price</b>.',
      '<b>Document:</b> report of stores for disposal in <b>Form GFR-10</b>.',
      '<b>Responsibility:</b> if unserviceability is due to negligence/fraud/mischief of a Government servant, responsibility must be fixed.',
      '<b>E-waste/hazardous:</b> sell per MoEF&CC guidelines; bidders must hold valid recycler/preprocessor registration on the date of e-auction and delivery.'
    ],
    kv: {
      'DECLARING AUTHORITY': 'Authority competent to purchase the item',
      'COMMITTEE': 'Discretionary ("may"), at appropriate level',
      'DOCUMENT': 'Form GFR-10 (report of stores for disposal)',
      'VALUATION': 'Book value → else original purchase price; guiding price; reserved price',
      'CROSS-REF': 'Rule 214 (surplus trigger) · Rule 218 (mode) · E-Waste (Management) Rules, 2022'
    },
    hook: 'Declare → Value → GFR-10 → Responsibility',
    warn: 'The committee is <b>discretionary</b> ("may constitute"), but recording reasons and working out the three prices is <b>mandatory</b>.'
  },
  decision: {
    q: 'Item ki book value register mein nahi mil rahi. Kya karenge?',
    opts: [
      { label:'Disposal rok denge — book value ke bina aage nahi badh sakte.', ok:false,
        why:'Rule 217 khud solution deta hai: jahan book value nikalna sambhav na ho, wahan <b>original purchase price</b> ka upyog kiya ja sakta hai.' },
      { label:'Original purchase price use karenge, guiding price aur reserved price nikalenge, aur GFR-10 banayenge.', ok:true,
        why:'Sahi. Rule 217(iii) yahi fallback deta hai — process rukta nahin, bas price ka basis badalta hai.' }
    ]
  }
},

/* ── 8 ─────────────────────────────────────────────────────────── */
{
  id: 's8', rules: ['218'], group: 'Disposal — mode',
  title: '₹4 lakh wali line — Rule 218 (amended)',
  panel: 'assets/panels/scene-08.png',
  audio: 'assets/audio/scene-08.mp3',
  alt: 'A corridor of a government office piled with obsolete furniture, computers and sealed drums, with a valuation sheet showing a threshold line and two officers discussing it.',
  est: 98,
  bubbles: [
    { who:'ravi', side:'left',  t:2,
      hg:'Sir, purane furniture ki residual value ₹5.6 lakh aayi hai. Seedhe scrap dealer ko bech den?',
      hi:'सर, पुराने फर्नीचर की अवशिष्ट मूल्य पाँच लाख साठ हज़ार रुपये आई है। सीधे स्क्रैप डीलर को बेच दें?' },
    { who:'anita', side:'right', t:15,
      hg:'Nahi. Rule 218 — ₹4 lakh se upar ho to advertised tender ya public auction hi chalega. Committee decide nahi kar sakti.',
      hi:'नहीं। रूल 218 — चार लाख रुपये से ऊपर हो तो विज्ञापित निविदा या सार्वजनिक नीलामी ही चलेगी। समिति तय नहीं कर सकती।' },
    { who:'ravi', side:'third', t:86,
      hg:'Par hamare purane note mein ₹2 lakh likha tha...',
      hi:'पर हमारे पुराने नोट में दो लाख रुपये लिखा था…' }
  ],
  caption: {
    hg:'Rule 218 — Modes of disposal: assessed residual value ₹4 lakh se upar ho to disposal advertised tender ya public auction se hoga. ₹4 lakh se kam residual value wale goods ke liye mode competent authority tay karega — ismein dhyan rakha jaayega ki samaan jama na ho, jagah block na ho, aur value kharab na ho; Ministries/Departments ko aise goods ki list banana chahiye. Expired medicines, food grain, ammunition jaise hazardous ya human consumption ke layak na hone wale goods ko turant suitable mode se dispose ya destroy karein — health hazard, environmental pollution aur misuse se bachne ke liye. Currency, negotiable instruments, receipt books, stamps, security press jaise security concern wale goods/documents ko official secrets rules aur financial prudence ke anuroop dispose/destroy karein. Dhyan dein: yeh threshold ₹2 lakh se badhakar ₹4 lakh kiya gaya — Department of Expenditure ke OM F.1/3/2024-PPD, dated 10.07.2024 se.',
    hi:'रूल 218 — निपटान के तरीके: आंकलित अवशिष्ट मूल्य चार लाख रुपये से अधिक हो तो निपटान विज्ञापित निविदा या सार्वजनिक नीलामी द्वारा होगा। चार लाख रुपये से कम अवशिष्ट मूल्य वाली वस्तुओं के लिए तरीका सक्षम प्राधिकारी तय करेगा — इसमें यह ध्यान रखा जाएगा कि सामान जमा न हो, जगह अवरुद्ध न हो, और मूल्य खराब न हो; मंत्रालयों और विभागों को ऐसी वस्तुओं की सूची बनानी चाहिए। समाप्त दवाइयाँ, खाद्यान्न, गोला-बारूद जैसी खतरनाक या मानव उपयोग के अयोग्य वस्तुओं का तुरंत उपयुक्त तरीके से निपटान या विनाश किया जाए — स्वास्थ्य खतरे, पर्यावरण प्रदूषण और दुरुपयोग की संभावना से बचने के लिए। मुद्रा, परक्राम्य लिखत, रसीद बुक्स, डाक टिकट, सिक्योरिटी प्रेस जैसी सुरक्षा संबंधी चिंताओं वाली वस्तुओं और दस्तावेज़ों का निपटान या विनाश अधिकृत गोपनीयता नियमों और वित्तीय विवेक के अनुरूप किया जाए। ध्यान दें: यह सीमा दो लाख रुपये से बढ़ाकर चार लाख रुपये की गई — व्यय विभाग के कार्यालय ज्ञापन एफ.1/3/2024-पीपीडी, दिनांक 10.07.2024 से।'
  },
  rule: {
    no: 'Rule 218 [AMENDED]',
    title: 'Modes of disposal — the ₹4 lakh line',
    exact: 'Rule 218(i): surplus or obsolete or unserviceable goods of assessed residual value above ₹4,00,000 shall be disposed of by (a) obtaining bids through advertised tender, or (b) public auction. (ii) For goods with residual value less than ₹4,00,000, the mode of disposal will be determined by the competent authority, keeping in view the necessity to avoid accumulation of such goods, consequential blockage of space, and deterioration in value; Ministries/Departments should, as far as possible, prepare a list of such goods. (iii) Hazardous or unfit-for-human-consumption goods (expired medicines, food grain, ammunition etc.) shall be disposed of or destroyed immediately by a suitable mode so as to avoid health hazard and/or environmental pollution and the possibility of misuse. (iv) Goods, equipment and documents involving security concerns (currency, negotiable instruments, receipt books, stamps, security press etc.) shall be disposed of/destroyed appropriately to ensure compliance with rules relating to official secrets as well as financial prudence.',
    points: [
      '<b>Above ₹4 lakh (residual value):</b> advertised tender OR public auction — mandatory.',
      '<b>Below ₹4 lakh:</b> competent authority chooses the mode, guided by avoiding accumulation, space blockage and value deterioration; prepare a list of such goods.',
      '<b>Never sell, always destroy:</b> expired medicines, food grain, ammunition and similar hazardous/unfit items — immediately, by a suitable mode.',
      '<b>Security-sensitive:</b> currency, negotiable instruments, receipt books, stamps, security press — dispose/destroy per official-secrets rules + financial prudence.'
    ],
    kv: {
      'THRESHOLD': '₹4,00,000 assessed residual value (amended)',
      'ABOVE': 'Advertised tender or public auction (mandatory)',
      'BELOW': 'Mode decided by competent authority',
      'AMENDMENT': 'DoE OM No. F.1/3/2024-PPD dated 10.07.2024 — ₹2,00,000 → ₹4,00,000',
      'CROSS-REF': 'Rule 217 (declaration) · Rules 219–220 (procedure)'
    },
    hook: '₹4 Lakh = Tender ya Auction · ₹2 Lakh = Purani Baat (10.07.2024 se pehle)',
    warn: 'The threshold decides the <b>mode of disposal</b> — it is not a prohibition on disposal, and it is assessed <b>residual</b> value, not original purchase value.'
  },
  decision: {
    q: 'Residual value ₹3.2 lakh aayi. Competent authority direct ek party ko bechna chahti hai. Kya yeh allowed hai?',
    opts: [
      { label:'Nahi — ₹1 lakh se upar sab kuch tender se hi jaata hai.', ok:false,
        why:'Rule 218 ki line ₹4 lakh hai, ₹1 lakh nahin. Galat threshold yaad rakhne se answer galat hoga.' },
      { label:'Haan — ₹4 lakh se kam hai, to mode competent authority tay karegi (accumulation, space aur value deterioration dhyan mein rakhkar).', ok:true,
        why:'Sahi. ₹4 lakh se niche Rule 218(ii) lagu hota hai — mode competent authority ka decision hai, bas uske likhite kaaran wahi hone chahiye jo rule batata hai.' }
    ]
  }
},

/* ── 9 ─────────────────────────────────────────────────────────── */
{
  id: 's9', rules: ['219','220'], group: 'Disposal — sale',
  title: 'Tender ya auction — Rules 219–220',
  panel: 'assets/panels/scene-09.png',
  audio: 'assets/audio/scene-09.mp3',
  alt: 'A government auction yard with bidders raising hands, an auctioneer with a gavel, a sealed tender box on a table, and an Internal Finance Wing officer noting the earnest money receipt.',
  est: 126,
  bubbles: [
    { who:'farah', side:'left',  t:2,
      hg:'Advertised tender ho ya auction — transparency, competition, fairness, discretion ka khatma. Ye chaar principle dono mein common hain.',
      hi:'विज्ञापित निविदा हो या नीलामी — पारदर्शिता, प्रतिस्पर्धा, निष्पक्षता, विवेक का अंत। ये चार सिद्धांत दोनों में समान हैं।' },
    { who:'anita', side:'right', t:55,
      hg:'Farq number ka hai — tender mein bid security 10% of assessed/reserved price; auction mein earnest money 25% of bid value, mauke par.',
      hi:'अंतर संख्या का है — निविदा में बोली प्रतिभूति आंकलित या आरक्षित मूल्य का दस प्रतिशत; नीलामी में बयाना राशि बोली मूल्य का पच्चीस प्रतिशत, मौके पर।' },
    { who:'suresh', side:'third', t:88,
      hg:'Aur auction team mein Internal Finance Wing ka officer hona hi chahiye.',
      hi:'और नीलामी टीम में आंतरिक वित्त विंग का अधिकारी होना ही चाहिए।' }
  ],
  caption: {
    hg:'Rule 219 — Disposal through advertised tender: bidding documents banana, tender invite karna, bids kholna, evaluate karna, highest responsive bidder chunna, sale value collect karna, sale release order dena, aur goods release karna — ye aath kadam hain. Bid document mein goods ki location aur present condition likhni hogi taaki bidder inspect kar sake. Bid security aam taur par assessed ya reserved price ka 10% hogi. Highest acceptable responsive bidder ko hi accept kiya jaayega; negotiation sirf usi bidder se ho sakti hai, aur fail hone par agli highest responsive bidder ko reasonable price counter-offer ho sakti hai. Bid security adjust karke baaki poori rakam goods release karne se pehle leni hogi; default par bid security forfeit hogi aur goods defaulter ke risk and cost par dobara beche jaayenge. Late bids consider nahi honge. Rule 220 — Auction: Ministry/Department direct ya approved auctioneer ke zariye auction kara sakti hai; auction plan ka wide publicity; shuruat mein goods ki condition, location aur terms dobara announce karna; bid accept hote hi bid value ka kam se kam 25% earnest money turant mauke par — cash ya Deposit-at-Call-Receipt (DACR) mein — lena; balance payment ke baad hi goods sauNpna; aur auction team mein Internal Finance Wing ka officer hona chahiye.',
    hi:'रूल 219 — विज्ञापित निविदा द्वारा निपटान: बोली दस्तावेज़ बनाना, निविदा आमंत्रित करना, बोलियाँ खोलना, उनका मूल्यांकन करना, सर्वोच्च स्वीकार्य उत्तरदायी बोलीदाता का चयन करना, विक्रय मूल्य संग्रहित करना, विक्रय रिलीज़ आदेश देना और माल सौंपना — ये आठ कदम हैं। बोली दस्तावेज़ में माल का स्थान और वर्तमान स्थिति लिखनी होगी ताकि बोलीदाता निरीक्षण कर सके। बोली प्रतिभूति सामान्यतः आंकलित या आरक्षित मूल्य का दस प्रतिशत होगी। सर्वोच्च स्वीकार्य उत्तरदायी बोलीदाता को ही स्वीकार किया जाएगा; बातचीत केवल उसी बोलीदाता से हो सकती है, और असफल होने पर अगली सर्वोच्च उत्तरदायी बोलीदाता को उचित मूल्य प्रति-प्रस्ताव दिया जा सकता है। बोली प्रतिभूति समायोजित करके शेष पूरी राशि माल सौंपने से पहले लेनी होगी; चूक पर बोली प्रतिभूति जब्त होगी और माल चूककर्ता के जोखिम और लागत पर पुनः बेचा जाएगा। विलंब बोलियाँ स्वीकार नहीं होंगी। रूल 220 — नीलामी: मंत्रालय या विभाग प्रत्यक्ष रूप से या अनुमोदित नीलामकर्ता के माध्यम से नीलामी करा सकती है; नीलामी योजना का व्यापक प्रचार; प्रारंभ में माल की स्थिति, स्थान और शर्तें दोबारा घोषित करना; बोली स्वीकार होते ही बोली मूल्य का कम से कम पच्चीस प्रतिशत बयाना राशि तुरंत मौके पर — नकद या डिमांड-एट-कॉल रसीद के रूप में — लेना; शेष भुगतान के बाद ही माल सौंपना; और नीलामी टीम में आंतरिक वित्त विंग का अधिकारी होना चाहिए।'
  },
  rule: {
    no: 'Rules 219 – 220',
    title: 'Disposal through advertised tender · Disposal through auction',
    exact: 'Rule 219: disposal by advertised tender follows eight steps — preparation of bidding documents; invitation of tenders; opening of bids; analysis and evaluation; selection of highest responsive bidder; collection of sale value; issue of sale release order; release of goods and return of bid security to unsuccessful bidders. Bidding documents must indicate the location and present condition of the goods. Bid security shall ordinarily be 10% of the assessed or reserved price. The highest acceptable responsive bidder is normally accepted; negotiation may be held only with that bidder, failing which a reasonable price may be counter-offered to the next highest responsive bidder(s). Full payment (after adjusting bid security) must be obtained before releasing the goods; on default the bid security is forfeited and the goods re-sold at the risk and cost of the defaulter after legal advice. Late bids shall not be considered. Rule 220: auction may be conducted directly or through approved auctioneers; the auction plan must be widely publicised and the condition, location and terms re-announced at the start. On acceptance of a bid, earnest money of not less than 25% of the bid value shall be taken immediately on the spot, in cash or by Deposit-at-Call-Receipt (DACR) in favour of the Ministry/Department; goods are handed over only after the balance payment. The auction team shall include an officer of the Internal Finance Wing.',
    points: [
      '<b>Common principles:</b> transparency, competition, fairness and elimination of discretion — plus wide publicity.',
      '<b>Tender (219):</b> bid security = ordinarily <b>10%</b> of assessed/reserved price; highest responsive bidder; negotiation only with H1; full payment before release; default → forfeiture + re-sale at defaulter’s risk & cost; late bids rejected.',
      '<b>Auction (220):</b> earnest money = <b>not less than 25%</b> of bid value, on the spot, cash or DACR; goods released only after balance payment; <b>IFW officer must be on the auction team</b>.',
      'Bidding documents must state location and present condition so bidders can inspect.'
    ],
    kv: {
      'TENDER SECURITY': '10% of assessed/reserved price (Rule 219)',
      'AUCTION EARNEST MONEY': '≥25% of bid value, on the spot (Rule 220)',
      'PAYMENT RULE': 'Full payment before release of goods (both modes)',
      'TEAM': 'Internal Finance Wing officer mandatory in auction team',
      'CROSS-REF': 'Rule 218 (when these modes apply) · Rule 221 (if both fail)'
    },
    hook: '10% Tender · 25% Auction · IFW Zaroori',
    warn: 'Negotiation is permitted <b>only</b> with the highest acceptable responsive bidder — not with all bidders, and not below the reserved price logic of the tender.'
  },
  decision: {
    q: 'Auction mein highest bid ₹80,000 lagi. Bidder ke paas abhi sirf ₹12,000 hain. Aap?',
    opts: [
      { label:'₹12,000 le kar maal sauNp denge, baaki baad mein le lenge.', ok:false,
        why:'Rule 220 ke mutabiq acceptance par <b>kam se kam 25%</b> (yahan ₹20,000) turant mauke par lena hoga, aur balance ke baad hi maal sauNpa jaata hai.' },
      { label:'Nahi — 25% (₹20,000) to turant chahiye; aur balance payment ke baad hi goods release honge. Warna agli highest bid par jaaenge.', ok:true,
        why:'Sahi. 25% spot earnest money (cash/DACR) + balance before handing over = Rule 220 ki do shaded shartein.' }
    ]
  }
},

/* ── 10 ─────────────────────────────────────────────────────────── */
{
  id: 's10', rules: ['221','222','223'], group: 'Scrap · Write-off · Current orders',
  title: 'Scrap, sale account aur write-off — Rules 221–223',
  panel: 'assets/panels/scene-10.png',
  audio: 'assets/audio/scene-10.mp3',
  alt: 'An accounts office scene: a sale account form on the desk, an officer signing a write-off file, and a notice board showing a cleanliness campaign poster with e-waste bins.',
  est: 153,
  bubbles: [
    { who:'ravi', side:'left',  t:2,
      hg:'Tender bhi laga, auction bhi — koi kharidar nahi mila. Ab?',
      hi:'निविदा भी लगी, नीलामी भी — कोई खरीदार नहीं मिला। अब?' },
    { who:'anita', side:'right', t:14,
      hg:'Rule 221 — scrap value par bech sakte hain, competent authority ki approval se aur Finance division se consultation ke baad. Phir bhi na bike to eco-friendly destruction.',
      hi:'रूल 221 — स्क्रैप मूल्य पर बेच सकते हैं, सक्षम प्राधिकारी की स्वीकृति और वित्त प्रभाग से परामर्श के बाद। फिर भी न बिके तो पर्यावरण-अनुकूल विनाश।' },
    { who:'farah', side:'third', t:100,
      hg:'Aur write-off alag hai — Rule 223. Sanction tab bhi chahiye jab accounts mein koi adjustment ho ya na ho.',
      hi:'और राइट-ऑफ़ अलग है — रूल 223. स्वीकृति तब भी चाहिए जब खातों में कोई समायोजन हो या न हो।' }
  ],
  caption: {
    hg:'Rule 221 — Agar advertised tender aur auction dono ke bawajood item nahi bikta, to competent authority ki approval se aur Finance division ke saath consultation karke scrap value par becha ja sakta hai. Agar scrap value par bhi na bike, to kisi aur mode se dispose kiya ja sakta hai — jismein eco-friendly destruction bhi shaamil hai. Rule 222 — Dispose kiye gaye goods ka sale account Form GFR-11 mein banega, jis par sale ya auction ki nigraani karne wale officer ke hastakshar honge. Rule 223 — Revaluation, stock-taking ya anya kaaran se hone wale profit/loss record kiye jaayenge aur zaroorat padne par adjust kiye jaayenge. Accounts mein koi correction/adjustment shamil na ho, tab bhi loss ke liye competent authority ki formal sanction leni hogi. Write-off ki powers DFPR ke tahat hain. Depreciation ke kaaran hone wale loss ke chaar head hain: market price ka normal fluctuation, normal wear and tear, purchases regulate karne mein door-andeshi ki kami, aur kharid ke baad negligence. Depreciation ke alawa ke loss ke paanch head hain: theft ya fraud, neglect, obsolescence ya zaroorat se zyada kharid ki anticipated loss, damage, aur Force Majeure — jaise aag, baadh, dushman ki karwai. Ant mein: abhi ke orders bhi yaad rakhein — DoE ne 10.07.2024 ke OM se disposal threshold ₹2 lakh se ₹4 lakh kiya, aur DARPG ka Special Campaign 6.0 15-30 September 2026 preparation phase, 2-31 October 2026 implementation phase mein chal raha hai, jismein scrap disposal GFR ke anusar aur e-waste disposal E-Waste (Management) Rules, 2022 ke anusar karna hai.',
    hi:'रूल 221 — यदि विज्ञापित निविदा और नीलामी के बावजूद वस्तु नहीं बिकती, तो सक्षम प्राधिकारी की स्वीकृति और वित्त प्रभाग से परामर्श के बाद स्क्रैप मूल्य पर बेची जा सकती है। यदि स्क्रैप मूल्य पर भी नहीं बिके, तो किसी अन्य विधि से निपटान किया जा सकता है — जिसमें पर्यावरण-अनुकूल विनाश भी शामिल है। रूल 222 — निपटाए गए सामान का विक्रय लेखा फॉर्म जीएफआर 11 में तैयार होगा, जिस पर बिक्री या नीलामी की निगरानी करने वाले अधिकारी के हस्ताक्षर होंगे। रूल 223 — पुनर्मूल्यांकन, स्टॉक-टेकिंग या अन्य कारणों से हुए लाभ और हानि दर्ज किए जाएँगे और आवश्यकतानुसार समायोजित किए जाएँगे। खातों में कोई सुधार या समायोजन शामिल न हो, तब भी हानि के लिए सक्षम प्राधिकारी की औपचारिक स्वीकृति लेनी होगी। हानि अपलिखित करने की शक्तियाँ डीएफपीआर के अधीन हैं। हृास के कारण हानि के चार शीर्ष हैं: बाज़ार मूल्य का सामान्य उतार-चढ़ाव, सामान्य घिसावट, खरीद विनियमित करने में दूरदर्शिता की कमी, और खरीद के बाद लापरवाही। हृास के अतिरिक्त हानि के पाँच शीर्ष हैं: चोरी या धोखाधड़ी, उपेक्षा, अप्रचलन या आवश्यकता से अधिक खरीद की प्रत्याशित हानि, क्षति, और बल-प्रकोष्ठ परिस्थितियाँ — जैसे आग, बाढ़, शत्रु की कार्रवाई। अंत में: अभी के आदेश भी याद रखें — व्यय विभाग ने 10.07.2024 के कार्यालय ज्ञापन से निपटान सीमा दो लाख से बढ़ाकर चार लाख रुपये की, और डीएआरपीजी का विशेष अभियान 6.0 पंद्रह से तीस सितम्बर 2026 तैयारी चरण और दो से इकतीस अक्टूबर 2026 क्रियान्वयन चरण में चल रहा है, जिसमें स्क्रैप निपटान जीएफआर के अनुसार और ई-कचरा निपटान ई-कचरा प्रबंधन नियम, 2022 के अनुसार करना है।'
  },
  rule: {
    no: 'Rules 221 – 223',
    title: 'Scrap value / other modes · Sale account · Write-off of losses',
    exact: 'Rule 221: if a Ministry/Department is unable to sell any surplus/obsolete/unserviceable item despite attempts through advertised tender or auction, it may dispose of the same at scrap value with the approval of the competent authority in consultation with the Finance division; if it is unable to sell the item even at scrap value, it may adopt any other mode of disposal including destruction of the item in an eco-friendly manner. Rule 222: a sale account shall be prepared for goods disposed of in Form GFR-11, duly signed by the officer who supervised the sale or auction. Rule 223(1): all profits and losses due to revaluation, stock-taking or other causes shall be duly recorded and adjusted where necessary; formal sanction of the competent authority shall be obtained in respect of losses even though no formal correction or adjustment in Government accounts is involved; powers to write off losses are available under the DFPR. Rule 223(2): losses due to depreciation are analysed under four heads — normal fluctuation of market prices, normal wear and tear, lack of foresight in regulating purchases, and negligence after purchase. Rule 223(3): losses not due to depreciation are grouped under five heads — theft or fraud, neglect, anticipated losses on account of obsolescence of stores or purchases in excess of requirements, losses due to damage, and losses due to extraordinary situations under Force Majeure conditions like fire, flood, enemy action etc.',
    points: [
      '<b>Escalation:</b> tender/auction fail → scrap value with competent authority approval <i>in consultation with Finance division</i> → still unsold → any other mode including eco-friendly destruction.',
      '<b>Rule 222:</b> sale account in Form GFR-11, signed by the officer who supervised the sale/auction.',
      '<b>Rule 223:</b> formal sanction is required for losses <b>even when no adjustment in Government accounts is involved</b>; powers flow from the DFPR.',
      '<b>4 depreciation heads:</b> market-price fluctuation · wear & tear · lack of foresight in purchases · negligence after purchase.',
      '<b>5 non-depreciation heads:</b> theft/fraud · neglect · obsolescence/excess purchase · damage · Force Majeure (fire, flood, enemy action).'
    ],
    kv: {
      'SCRAP VALUE': 'Competent authority approval + Finance division consultation (Rule 221)',
      'SALE ACCOUNT': 'Form GFR-11, signed by the supervising officer (Rule 222)',
      'WRITE-OFF': 'Formal sanction always — even without account adjustment; powers under DFPR (Rule 223)',
      'CURRENT — DoE': 'OM F.1/3/2024-PPD dt. 10.07.2024: Rule 218 threshold ₹2L → ₹4L',
      'CURRENT — DARPG': 'Special Campaign 6.0: prep 15–30 Sep 2026, implementation 2–31 Oct 2026; scrap disposal as per GFR; e-waste per E-Waste (Management) Rules, 2022'
    },
    hook: 'Disposal alag · Write-off alag — sanction dono mein zaroori',
    warn: 'Scrap-value disposal is <b>not</b> a free hand: it needs competent authority approval <b>and</b> Finance division consultation, and only after tender and auction have both failed.'
  },
  decision: {
    q: 'Stock-taking mein ₹40,000 ka loss mila, lekin accounts mein koi adjustment nahi hoga. Kya sanction lena zaroori hai?',
    opts: [
      { label:'Nahi — jab accounts mein adjustment hi nahi, to sanction ki kya zarurat.', ok:false,
        why:'Rule 223(1) spasht hai: <b>formal sanction tab bhi leni hogi</b> jab koi formal correction/adjustment involved na ho. Yah ek famous exam trap hai.' },
      { label:'Haan — Rule 223 ke tahat formal sanction har haal mein chahiye, aur write-off powers DFPR ke tahat hain.', ok:true,
        why:'Sahi. Rule 223(1) "even though no formal correction or adjustment in Government accounts is involved" — yeh line exam mein aksar puchhi jaati hai.' }
    ]
  }
}
];

/* ─────────────────────────────────────────────────────────────────────
   GRANULAR RULE INDEX — all 17 rules
   ───────────────────────────────────────────────────────────────────── */
const RULE_INDEX = [
  { no:'207', scene:'s1', grp:'Scope', title:'Scope of Chapter 7',
    exact:'This chapter contains the basic rules regarding inventory management applicable to all Ministries/Departments; detailed instructions may be prescribed by Ministries/Departments broadly in conformity with these basic rules.',
    key:['Rules 207–223 = Chapter 7','Applies to all Central Government Ministries/Departments','Departmental instructions must conform, not contradict'] },
  { no:'208', scene:'s2', grp:'Receipt', title:'Receipt of goods and materials from private suppliers',
    exact:'While receiving goods and materials from a supplier, the officer-in-charge of stores shall refer to the relevant contract terms and follow the prescribed procedure for receiving the materials — counting / measuring / weighing, visual inspection and technical inspection where required; entry in the stock register (IT-based preferred) and a certificate of receipt by the officer.',
    key:['Refer to contract terms first','Count · measure · weigh + visual inspection','Technical inspection where required','Stock-register entry + receipt certificate'] },
  { no:'209', scene:'s2', grp:'Issue', title:'Receipt/issue of goods and materials from internal divisions',
    exact:'In the case of issue of materials from stock for departmental use, manufacture, sale etc., the Officer-in-charge of the stores shall see that an appropriate indent in the prescribed form has been put up by the indenting officer; a written/online acknowledgement of receipt shall be obtained from the indenting officer or his authorised representative. Where material is issued to a contractor and its cost is recoverable, the recovery rates and total value chargeable to the contractor shall be acknowledged by the contractor, duly signed and dated.',
    key:['Indent in the prescribed form is mandatory','Written OR online acknowledgement','Contractor issue: recovery rate + total value signed & dated'] },
  { no:'210', scene:'s2', grp:'Custody', title:'Custody of goods and materials',
    exact:'The officer-in-charge of stores having custody of goods and materials, especially valuable and/or combustible articles, shall take appropriate steps for arranging their safe custody and proper storage accommodation, including arrangements for maintaining required temperature and dust-free environment etc.',
    key:['Safe custody + proper storage','Special care: valuable and/or combustible articles','Temperature control and dust-free environment'] },
  { no:'211', scene:'s3', grp:'Accounts', title:'Lists and accounts',
    exact:'The Officer-in-charge of stores shall maintain suitable item-wise lists and accounts and prepare accurate returns in respect of the goods and materials in his charge, making it possible at any point of time to check the actual balances with the book balances; the form of the stock accounts shall be determined with reference to the nature of the goods, frequency of transactions and special requirements of the Ministry/Department. Separate accounts shall be kept for fixed assets (GFR-22), consumables (GFR-23), library books (GFR-18) and assets of historical/artistic value (GFR-24).',
    key:['Test: actual balance vs book balance, at any time','Separate accounts by category','Forms: GFR-22 / GFR-23 / GFR-18 / GFR-24'] },
  { no:'212', scene:'s3', grp:'Accounts', title:'Hiring out of fixed assets',
    exact:'When a fixed asset is hired to local bodies, contractors or others, proper record shall be kept of the assets and the hire and other charges, as determined under rules prescribed by the competent authority, shall be recovered regularly. Calculation of the charges to be recovered shall be based on the historical cost.',
    key:['Proper record of hired-out assets','Hire & other charges recovered regularly','Charges based on HISTORICAL COST (not market rate)'] },
  { no:'213', scene:'s4', grp:'Verification', title:'Physical verification of fixed assets and consumables',
    exact:'(1) The inventory for fixed assets shall ordinarily be maintained at site. Fixed assets should be verified at least once in a year and the outcome of the verification recorded in the corresponding register; discrepancies shall be promptly investigated and brought to account. (2) A physical verification of all consumable goods and materials should be undertaken at least once in a year and discrepancies recorded in the stock register for appropriate action by the competent authority. Verification shall always be made in the presence of the officer responsible for the custody of the inventory; a certificate of verification along with findings shall be recorded in the stock register. Discrepancies including shortages, damages and unserviceable goods shall immediately be brought to the notice of the competent authority for action under Rules 33 to 38.',
    key:['Fixed assets: at least once a year, at site','Consumables: at least once a year','Verification in the presence of the custodian officer','Certificate + findings in the stock register','Discrepancies → competent authority → Rules 33–38'] },
  { no:'214', scene:'s5', grp:'Planning', title:'Buffer stock',
    exact:'Depending on the frequency of requirement and quantity thereof as well as the pattern of supply of a consumable material, optimum buffer stock should be determined by the competent authority. Note: as inventory carrying cost is an expenditure that does not add value to the material being stocked, a material remaining in stock for over a year shall generally be considered surplus, unless adequate reasons to treat it otherwise exist; the items so declared surplus may be dealt with as per the procedure laid down under Rule 217.',
    key:['Optimum buffer stock decided by competent authority','Over 1 year in stock → GENERALLY surplus (rebuttable)','Surplus items → Rule 217 procedure'] },
  { no:'215', scene:'s5', grp:'Verification', title:'Physical verification of library books',
    exact:'(i) Complete physical verification of books every year in libraries having not more than 20,000 volumes; for more than 20,000 and up to 50,000 volumes, at least once in three years; for more than 50,000 volumes, sample physical verification at intervals of not more than three years — where such verification reveals unusual or unreasonable shortages, complete verification shall be done. (ii) Loss of five volumes per one thousand volumes issued/consulted in a year may be taken as reasonable provided such losses are not attributable to dishonesty or negligence; however, loss of a book of value exceeding ₹1,000 and rare books irrespective of value shall invariably be investigated and appropriate action taken.',
    key:['≤20,000 volumes: complete verification every year','20,001–50,000: complete verification at least once in 3 years','>50,000: sample verification at intervals ≤3 years','Unusual/unreasonable shortage → complete verification','5 per 1,000 issued/consulted per year = reasonable loss','Book >₹1,000 or any rare book → investigation mandatory'] },
  { no:'216', scene:'s6', grp:'Accountability', title:'Transfer of charge of goods, materials etc.',
    exact:'In case of transfer of Officer-in-charge of the goods, materials etc., the transferred officer shall see that the goods or material are made over correctly to his successor. A statement giving all relevant details of the goods, materials etc., in question shall be prepared and signed with date by the relieving officer and the relieved officer. Each of these officers will retain a copy of the signed statement.',
    key:['Correct making-over is the outgoing officer’s duty','Statement with all relevant details','Signed with date by BOTH relieving and relieved officer','Each retains a copy'] },
  { no:'217', scene:'s7', grp:'Disposal', title:'Disposal of goods',
    exact:'(i) An item may be declared surplus or obsolete or unserviceable if it is of no use to the Ministry or Department; the reasons shall be recorded by the authority competent to purchase the item. (ii) The competent authority may, at his discretion, constitute a committee at an appropriate level. (iii) Book value, guiding price and reserved price shall be worked out; where book value cannot be worked out, the original purchase price may be utilised; a report of stores for disposal shall be prepared in Form GFR-10. (iv) Where an item becomes unserviceable due to negligence, fraud or mischief of a Government servant, responsibility shall be fixed. (v) Hazardous waste, scrap batteries, e-waste etc. shall be sold per MoEF&CC guidelines; bidders must hold valid recycler/preprocessor registration on the date of e-auction and delivery.',
    key:['Declared by the authority competent to purchase','Reasons recorded; committee is discretionary','Book value → else original purchase price; guiding price; reserved price','Form GFR-10 — report of stores for disposal','Negligence/fraud/mischief → fix responsibility','E-waste: MoEF&CC guidelines + valid recycler registration'] },
  { no:'218', scene:'s8', grp:'Disposal', title:'Modes of disposal [AMENDED 10.07.2024]',
    exact:'(i) Surplus/obsolete/unserviceable goods of assessed residual value above ₹4,00,000 shall be disposed of by (a) obtaining bids through advertised tender or (b) public auction. (ii) For goods with residual value less than ₹4,00,000, the mode of disposal will be determined by the competent authority, keeping in view the necessity to avoid accumulation of such goods, consequential blockage of space and deterioration in value; Ministries/Departments should, as far as possible, prepare a list of such goods. (iii) Hazardous or unfit-for-human-consumption goods (expired medicines, food grain, ammunition etc.) shall be disposed of or destroyed immediately by a suitable mode. (iv) Goods, equipment and documents involving security concerns (currency, negotiable instruments, receipt books, stamps, security press etc.) shall be disposed of/destroyed appropriately to ensure compliance with rules relating to official secrets as well as financial prudence.',
    key:['>₹4,00,000 residual value → advertised tender or public auction','<₹4,00,000 → competent authority decides the mode','Hazardous/unfit items → immediate disposal or destruction','Security-sensitive items → official secrets rules + financial prudence','AMENDED: ₹2,00,000 → ₹4,00,000 by DoE OM F.1/3/2024-PPD dt. 10.07.2024'] },
  { no:'219', scene:'s9', grp:'Sale', title:'Disposal through advertised tender',
    exact:'Eight steps: preparation of bidding documents; invitation of tenders; opening of bids; analysis and evaluation; selection of highest responsive bidder; collection of sale value; issue of sale release order; release of goods and return of bid security to unsuccessful bidders. Bidding documents must indicate location and present condition of goods. Bid security shall ordinarily be 10% of the assessed or reserved price. The highest acceptable responsive bidder is normally accepted; negotiation may be held only with that bidder. Full payment (after adjusting bid security) before release of goods; on default, bid security forfeited and goods re-sold at the risk and cost of the defaulter after legal advice. Late bids shall not be considered.',
    key:['8 steps from bidding document to release of goods','Location + present condition must be disclosed','Bid security = 10% of assessed/reserved price','Negotiation ONLY with the highest acceptable responsive bidder','Full payment before release; default → forfeit + re-sale at risk & cost','Late bids not considered'] },
  { no:'220', scene:'s9', grp:'Sale', title:'Disposal through auction',
    exact:'Auction may be undertaken directly or through approved auctioneers; the basic principles are transparency, competition, fairness and elimination of discretion, and the auction plan must be widely publicised. At the start, the condition and location of goods and the terms of sale shall be announced again. On acceptance of a bid, earnest money of not less than 25% of the bid value shall be taken immediately on the spot, in cash or by Deposit-at-Call-Receipt (DACR) in favour of the Ministry/Department. Goods shall be handed over only after receiving the balance payment. The auction team shall include an officer of the Internal Finance Wing.',
    key:['Direct or through approved auctioneers','Wide publicity; terms re-announced at the start','Earnest money ≥25% of bid value, on the spot (cash or DACR)','Balance payment before handing over','Internal Finance Wing officer must be on the auction team'] },
  { no:'221', scene:'s10', grp:'Sale', title:'Disposal at scrap value or by other modes',
    exact:'If a Ministry/Department is unable to sell any surplus/obsolete/unserviceable item in spite of its attempts through advertised tender or auction, it may dispose of the same at its scrap value with the approval of the competent authority in consultation with the Finance division. If it is unable to sell the item even at its scrap value, it may adopt any other mode of disposal including destruction of the item in an eco-friendly manner.',
    key:['Only after BOTH tender and auction have failed','Scrap value: competent authority approval + Finance division consultation','Still unsold → any other mode including eco-friendly destruction'] },
  { no:'222', scene:'s10', grp:'Records', title:'Sale account',
    exact:'A sale account shall be prepared for goods disposed of in Form GFR-11, duly signed by the officer who supervised the sale or auction.',
    key:['Form GFR-11','Signed by the officer who supervised the sale/auction'] },
  { no:'223', scene:'s10', grp:'Write-off', title:'Write-off of losses',
    exact:'(1) All profits and losses due to revaluation, stock-taking or other causes shall be duly recorded and adjusted where necessary; formal sanction of the competent authority shall be obtained in respect of losses even though no formal correction or adjustment in Government accounts is involved; powers to write off losses are available under the DFPR. (2) Losses due to depreciation shall be analysed and recorded under four heads: normal fluctuation of market prices; normal wear and tear; lack of foresight in regulating purchases; negligence after purchase. (3) Losses not due to depreciation shall be grouped under five heads: theft or fraud; neglect; anticipated losses on account of obsolescence of stores or of purchases in excess of requirements; losses due to damage; losses due to extraordinary situations under Force Majeure conditions like fire, flood, enemy action etc.',
    key:['Formal sanction required even when no account adjustment is involved','Powers under the DFPR','4 heads — losses due to depreciation','5 heads — losses not due to depreciation (incl. Force Majeure)'] }
];

/* ─────────────────────────────────────────────────────────────────────
   EXAM DRILL
   ───────────────────────────────────────────────────────────────────── */
const QUIZ = [
  { tag:'Scope', q:'Chapter 7 of GFR 2017 (Inventory Management) spans which rules?',
    a:['Rules 142–206','Rules 207–223','Rules 224–227A','Rules 228–245'], c:1,
    e:'Chapter 7 = Inventory Management, Rules <b>207 to 223</b> (17 rules). Chapter 6 is procurement (142–206) and Chapter 8 is contract management (224–227A).' },
  { tag:'Rule 213', q:'Fixed assets should be physically verified —',
    a:['at least once a year','once in two years','once in three years','only at the time of audit'], c:0,
    e:'Rule 213(1): fixed assets should be verified <b>at least once in a year</b>, the inventory is ordinarily maintained at site, and the outcome is recorded in the corresponding register.' },
  { tag:'Rule 213', q:'Physical verification of consumable goods and materials must be done —',
    a:['every month','at least once a year','once in three years','only when a new officer takes charge'], c:1,
    e:'Rule 213(2): a physical verification of <b>all</b> consumable goods and materials should be undertaken <b>at least once in a year</b>.' },
  { tag:'Rule 215', q:'A library holds 30,000 volumes. Complete physical verification should be done —',
    a:['every year','at least once in three years','once in five years','only by sample'], c:1,
    e:'Rule 215(i): ≤20,000 volumes → every year; <b>more than 20,000 and up to 50,000 → at least once in three years</b>; more than 50,000 → sample verification at intervals of not more than three years.' },
  { tag:'Rule 215', q:'Library with more than 50,000 volumes — the rule requires —',
    a:['no verification needed','complete verification every year','sample physical verification at intervals of not more than 3 years','verification once in 10 years'], c:2,
    e:'Rule 215(i): for libraries having more than 50,000 volumes, <b>sample physical verification at intervals of not more than three years</b>. If it reveals unusual/unreasonable shortages, complete verification is done.' },
  { tag:'Rule 215', q:'Loss of how many volumes per 1,000 volumes issued/consulted in a year may be taken as reasonable?',
    a:['2','5','10','25'], c:1,
    e:'Rule 215(ii): loss of <b>five volumes per one thousand volumes</b> issued/consulted in a year is reasonable — provided it is not attributable to dishonesty or negligence. A book valued above <b>₹1,000</b>, and rare books, must always be investigated.' },
  { tag:'Rule 214', q:'A material remaining in stock for over ___ shall generally be considered surplus.',
    a:['6 months','1 year','3 years','5 years'], c:1,
    e:'Rule 214 note: a material remaining in stock for <b>over a year</b> shall generally be considered surplus <b>unless adequate reasons to treat it otherwise exist</b> — it is rebuttable, not automatic.' },
  { tag:'Rule 218', q:'Current threshold: surplus/obsolete goods of assessed residual value above ____ must go by advertised tender or public auction.',
    a:['₹1 lakh','₹2 lakh','₹4 lakh','₹10 lakh'], c:2,
    e:'Rule 218(i): above <b>₹4,00,000</b>. This was enhanced from ₹2,00,000 by <b>DoE OM No. F.1/3/2024-PPD dated 10.07.2024</b>.' },
  { tag:'Rule 219', q:'Bid security in disposal through advertised tender is ordinarily —',
    a:['2% of assessed/reserved price','5% of assessed/reserved price','10% of assessed/reserved price','25% of assessed/reserved price'], c:2,
    e:'Rule 219: bid security shall <b>ordinarily be 10%</b> of the assessed or reserved price, and the amount must be stated in the bidding document.' },
  { tag:'Rule 220', q:'On acceptance of a bid at auction, earnest money to be taken on the spot is —',
    a:['not less than 10% of bid value','not less than 25% of bid value','not less than 50% of bid value','the full bid value'], c:1,
    e:'Rule 220: earnest money of <b>not less than 25% of the bid value</b>, immediately on the spot, in cash or by Deposit-at-Call-Receipt (DACR).' },
  { tag:'Rule 220', q:'The auction team must compulsorily include —',
    a:['an officer of the Internal Finance Wing','the head of the Ministry','a CAG officer','the supplier of the goods'], c:0,
    e:'Rule 220: the composition of the auction team is decided by the competent authority, but it <b>must include an officer of the Internal Finance Wing</b> of the department.' },
  { tag:'Rule 218', q:'Expired medicines, food grain and ammunition should be —',
    a:['sold by advertised tender','sold at scrap value','disposed of or destroyed immediately by a suitable mode','stored for three years, then sold'], c:2,
    e:'Rule 218(iii): such hazardous or unfit-for-human-consumption goods shall be disposed of or destroyed <b>immediately</b>, to avoid health hazard, environmental pollution and misuse.' },
  { tag:'Rule 212', q:'Hire charges for a fixed asset hired out to a contractor are calculated on the basis of —',
    a:['current market rate','replacement cost','historical cost','insurance value'], c:2,
    e:'Rule 212: calculation of charges recoverable from local bodies, contractors and others shall be based on the <b>historical cost</b>.' },
  { tag:'Rule 221', q:'Sale at scrap value is permitted —',
    a:['whenever the item is old','after tender and auction attempts fail, with competent authority approval in consultation with the Finance division','only with Ministry of Finance approval in every case','never — scrap sale is prohibited'], c:1,
    e:'Rule 221: only <b>after</b> attempts through advertised tender or auction fail, and with <b>competent authority approval in consultation with the Finance division</b>.' },
  { tag:'Rule 223', q:'Under Rule 223, formal sanction of the competent authority for a loss is required —',
    a:['only if the loss exceeds ₹1 lakh','only when the accounts are actually adjusted','even though no formal correction or adjustment in Government accounts is involved','only when fraud is suspected'], c:2,
    e:'Rule 223(1) uses the exact phrase <b>“even though no formal correction or adjustment in Government accounts is involved”</b>. This is a classic exam trap.' },
  { tag:'Rule 223', q:'How many heads are prescribed for losses NOT due to depreciation?',
    a:['3','4','5','6'], c:2,
    e:'Rule 223(3): <b>five</b> heads — theft or fraud; neglect; anticipated losses on obsolescence/excess purchases; damage; and Force Majeure (fire, flood, enemy action). Losses <b>due to</b> depreciation have <b>four</b> heads.' },
  { tag:'Rule 216', q:'On transfer of the Officer-in-charge of stores, the handing-over statement is signed by —',
    a:['the relieving officer only','the relieved officer only','both the relieving and the relieved officer, with date, each retaining a copy','the Head of Department only'], c:2,
    e:'Rule 216: the statement with all relevant details is prepared and signed <b>with date by both</b> the relieving and relieved officer, and <b>each retains a copy</b>.' },
  { tag:'Rule 217', q:'The report of stores for disposal is prepared in —',
    a:['Form GFR-10','Form GFR-11','Form GFR-22','Form GFR-13'], c:0,
    e:'Rule 217(iii): report of stores for disposal → <b>Form GFR-10</b>. The sale account after disposal → <b>Form GFR-11</b> (Rule 222).' }
];

/* ─────────────────────────────────────────────────────────────────────
   SOURCES / VALIDATION
   ───────────────────────────────────────────────────────────────────── */
const VALIDATION = [
  ['Exact provision identified', 'Chapter 7 — Inventory Management, Rules 207 to 223 (17 rules)'],
  ['Current status', '[CURRENT] — in force; read with the latest DoE compilation'],
  ['Last verified', '25 September 2026'],
  ['Base source (Tier 1)', 'General Financial Rules, 2017 — Department of Expenditure, Ministry of Finance'],
  ['Latest compilation checked', 'Bi-annual compilation of amendments in GFRs 2017 updated up to 31.01.2026 (uploaded 09.04.2026); and DoE OM No. 08(18)/2021-E.II(A) dated 19.09.2025 (up to 31.07.2025)'],
  ['Amendment found', 'Rule 218 — residual-value threshold ₹2,00,000 → ₹4,00,000, vide DoE OM No. F.1/3/2024-PPD dated 10.07.2024'],
  ['Numbers verified', '1 year (Rules 213, 214) · 3 years (Rule 215) · 5 per 1,000 (Rule 215) · ₹1,000 (Rule 215) · ₹4,00,000 (Rule 218) · 10% (Rule 219) · 25% (Rule 220)'],
  ['Legal-distortion check', 'Disposal mode ≠ prohibition · verification ≠ condemnation · 1-year surplus note is rebuttable · write-off sanction required even without account adjustment'],
  ['Known uncertainty flagged', 'Form GFR-18 (library books) is reported by secondary compilations of Rule 211; GFR-22/23/24 appear in the official DoE form list. Verify against your departmental form list.']
];

const SOURCES = [
  { t:'General Financial Rules, 2017 (official PDF)', d:'Department of Expenditure, Ministry of Finance', u:'https://doe.gov.in/files/inline-documents/GFR2017.pdf' },
  { t:'GFR 2017 updated up to 31.07.2025', d:'DoE OM No. 08(18)/2021-E.II(A) dated 19.09.2025', u:'https://doe.gov.in/files/whats_new_documents/UpdatedGFR31July2025.pdf' },
  { t:'Bi-annual compilation up to 31.01.2026', d:'DoE — Orders & Circulars (uploaded 09.04.2026)', u:'https://doe.gov.in/orders-circulars/31' },
  { t:'Amendment in GFR 2017 (incl. Rule 218)', d:'DoE OM No. F.1/3/2024-PPD dated 10.07.2024', u:'https://doe.gov.in/circulars/amendment-general-financial-rules-2017' },
  { t:'Before/after extract of the 10.07.2024 amendment', d:'IIT Kanpur — GFR Amendment 01.08.2024 (side-by-side text)', u:'https://www.iitk.ac.in/centralstores/data/GFR-Amendment-01-08-24.pdf' },
  { t:'Special Campaign 5.0 guidelines (scrap disposal as per GFR; e-waste)', d:'DARPG, Ministry of Personnel, Public Grievances & Pensions', u:'https://darpg.gov.in/sites/default/files/Guidelines-SCDPM_5.0_OM_English.pdf' },
  { t:'Special Campaign 6.0 portal (2–31 October 2026)', d:'DARPG / SCDPM portal', u:'https://scdpm.nic.in/specialcampaign6/' },
  { t:'Rule-wise text (secondary compilation)', d:'constitutionofindia.in — GFR 2017 rule series (Rules 208–223)', u:'https://constitutionofindia.in/rule-217-of-the-general-financial-rules-2017-disposal-of-goods/' },
  { t:'Chapter-wise rule numbering cross-check', d:'GFR 2017 contents (Chapter 7 = Rules 207–223, p.58)', u:'https://finance.tripura.gov.in/sites/default/files/GFR-2017-Govt-of-India.pdf' }
];
