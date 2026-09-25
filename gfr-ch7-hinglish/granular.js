/* =====================================================================
   GFR 2017 CHAPTER 7 — GRANULAR CLAUSE TREE (Rules 207–223)
   Verbatim provision text (as printed in GFR 2017) + clause-by-clause
   Hinglish explanation + notes / provisos / exceptions / amendments.
   Loaded after content.js, before app.js.
   ===================================================================== */

const RULES_DETAIL = [

/* ══════════════════════ RULE 207 ══════════════════════ */
{
  no:'207', grp:'Scope', scene:'s1', status:'CURRENT',
  title:'Inventory Management — scope of the chapter',
  audio:'assets/audio/rule-207.mp3',
  hook:'Basic rules sabke liye · detail department ki, parChapter 7 ke anuroop',
  intro:'Yeh rule poore chapter ka "scope clause" hai — isme koi sub-rule, clause ya proviso nahi hai. Yeh batata hai ki Chapter 7 ke basic rules kis par lagu hote hain aur departmental instructions ki kya hadd hai.',
  tree:[
    { l:1, lab:'Rule 207', tag:'FRAMEWORK',
      text:'This chapter contains the basic rules applicable to all Ministries or Departments regarding inventory management. Detailed instructions and procedures relating to inventory management may be prescribed by various Ministries or Departments broadly in conformity with the basic rules contained in this chapter.',
      ex:'Do baatein: (1) is chapter ke basic rules <b>sabhi</b> Ministries/Departments par lagu hote hain; (2) koi bhi Ministry/Department apne detailed instructions aur procedures bana sakta hai — lekin woh <b>"broadly in conformity"</b> hone chahiye, yaani Chapter 7 ke basic rules ke khilaf nahi ja sakte. Vyavhaarik matlab: aapka department apna format, apna timeline aur apni delegation likh sakta hai, par annual verification, GFR-10 report, ₹4 lakh ki line aur write-off sanction jaise basic rules ko hata nahi sakta.' }
  ],
  notes:[],
  provisos:[],
  exceptions:[
    'Autonomous Bodies par GFR tab tak lagu hai jab tak unke bye-laws mein Government-approved alag Financial Rules na hon (Rule 1(3)).',
    'Rule 5 ke tahat interpretation ka doubt aane par Ministry of Finance ka decision final hota hai.'
  ],
  amendment:null,
  traps:[
    { q:'Kya koi department Chapter 7 se hat kar apne inventory rules bana sakta hai?', a:'Nahi. Detailed instructions "broadly in conformity" with Chapter 7 hone chahiye — conformity test Rule 207 ka core hai.' },
    { q:'Chapter 7 mein kitne rules hain?', a:'Rules 207 se 223 — kul 17 rules (Chapter 6 procurement hai, 142–206).' }
  ],
  xref:['Rule 1 — applicability to Ministries/Departments & Autonomous Bodies','Rule 5 — removal of doubts (MoF decides)','Rule 6 — modification only with express MoF approval','DFPR — delegated financial powers']
},

/* ══════════════════════ RULE 208 ══════════════════════ */
{
  no:'208', grp:'Receipt', scene:'s2', status:'CURRENT',
  title:'Receipt of goods and materials from private suppliers',
  audio:'assets/audio/rule-208.mp3',
  hook:'C.I.R.T.S. — Contract, Inspect, Record, Technical check, Stock register',
  intro:'Rule 208 mein sirf ek sub-rule hai — <b>Rule 208(1)</b> — jiske andar teen clauses (i), (ii), (iii) hain. Yeh tab lagu hota hai jab maal <b>bahar ke private supplier</b> se aata hai (internal division se aane par Rule 209 lagu hoga).',
  tree:[
    { l:1, lab:'Rule 208(1)', tag:'SHALL — procedure',
      text:'Receipt of goods and materials from private suppliers.',
      ex:'Heading clause. Iske niche (i) se (iii) teen mandatory steps hain — contract dekho, verify karo, register karo.' },
    { l:2, lab:'(i)', tag:'SHALL',
      text:'While receiving goods and materials from a supplier, the officer–in-charge of stores should refer to the relevant contract terms and follow the prescribed procedure for receiving the materials.',
      ex:'Sabse pehla kadam <b>contract terms padhna</b> hai. Delivery schedule, specification, inspection clause, packaging, insurance — jo kuch contract mein likha hai, receipt usi ke hisaab se honi chahiye. Contract ke bina receipt matlab aage chalkar dispute mein department kamzor padega.' },
    { l:2, lab:'(ii)', tag:'SHALL (with one MAY)',
      text:'All materials shall be counted, measured or weighed and subjected to visual inspection at the time of receipt to ensure that the quantities are correct, the quality is according to the required specifications and there is no damage or deficiency in the materials. Technical inspection where required should be carried out at this stage by Technical Inspector or Agency approved for the purpose. An appropriate receipt, in terms of the relevant contract provisions may also be given to the supplier on receiving the materials.',
      ex:'Teen physical cheezein <b>har baar</b> honi chahiye: counting, measuring ya weighing, aur <b>visual inspection</b> — aur yeh sab <b>receipt ke time par</b> hi. Visual inspection ke teen objective hain: quantity sahi hai, quality specification ke anuroop hai, aur koi damage/deficiency nahi. <b>Technical inspection</b> "where required" hai — matlab har item par nahi, sirf jahan zaroori ho — aur woh approved Technical Inspector ya approved Agency se hi karwani hogi. Aakhir ka "appropriate receipt ... may also be given" ek <b>MAY</b> hai: supplier ko receipt dena contract provisions par depend karta hai.' },
    { l:2, lab:'(iii)', tag:'SHALL',
      text:'Details of the material so received should thereafter be entered in the appropriate stock register, preferably in an IT-based system. The officer-in-charge of stores should certify that he has actually received the material and recorded it in the appropriate stock registers.',
      ex:'Do kaam: (1) <b>stock register mein entry</b> — "preferably IT-based", yaani IT system ko tarjeeh hai par yeh preference hai, hard mandate nahi; (2) <b>officer-in-charge ka certificate</a> ki usne maal asal mein liya hai aur register mein darj kiya hai. Yeh certificate hi receipt ki legal backbone hai.' }
  ],
  notes:[
    'Rule 208 mein koi footnote ya proviso nahi hai — poora rule teen clauses ka hai.',
    'Yahan "shall" (counting/measuring/weighing/visual inspection/certificate) aur "may" (receipt to supplier) ka farq exam mein poocha jaata hai.'
  ],
  provisos:[],
  exceptions:[
    'Technical inspection sirf "where required" — har receipt par technical inspection zaroori nahi.'
  ],
  amendment:null,
  traps:[
    { q:'Technical inspection kab karwani hogi?', a:'"Where required" — jahan zaroori ho, approved Technical Inspector ya approved Agency se. Har baar nahi.' },
    { q:'IT-based stock register mandatory hai?', a:'Nahi — "preferably in an IT-based system". Par stock register entry aur receipt certificate dono mandatory hain.' },
    { q:'Rule 208 kis par lagu hota hai?', a:'Private supplier se milne wale maal par. Internal division se aane wale maal par Rule 209 lagu hota hai.' }
  ],
  xref:['Rule 209 — internal divisions','Rule 210 — custody','Rule 211 — stock register forms','Chapter 6 (Rules 142–206) — contract terms ka source']
},

/* ══════════════════════ RULE 209 ══════════════════════ */
{
  no:'209', grp:'Issue', scene:'s2', status:'CURRENT',
  title:'Receipt / issue of goods and materials from internal divisions of the same organisation',
  audio:'assets/audio/rule-209.mp3',
  hook:'Indent → Examine → Acknowledge → (na mile to) entry in indentor copy',
  intro:'Rule 209 mein chaar clauses hain: (i) internal division se maal <b>mangwana</b>, (ii) stock se maal <b>dena</b>, (iii) contractor ko diye gaye maal ki <b>recovery acknowledgement</b>, aur (iv) poora indent <b>pura na kar sakein</b> to kya karna hai — yeh last clause sabse zyada ignore hota hai.',
  tree:[
    { l:2, lab:'(i)', tag:'SHALL',
      text:'The indenting officer requiring goods and materials from internal division(s) of the same organisation should project an indent in the prescribed form for this purpose. While receiving the supply against the indent, the indenting officer shall examine, count, measure or weigh the materials as the case may be, to ensure that the quantities are correct, the quality is in line with the required specifications and there is no damage or deficiency in the materials. An appropriate receipt shall also be given to this effect by the indenting officer to the division sending the materials.',
      ex:'Maal mangwane wala officer (indenting officer) <b>prescribed form mein indent</b> dega. Maal milne par woh khud examine/count/measure/weigh karega — quantity, quality, damage — teen check Rule 208(ii) jaisi hi hain. Farq itna hai ki yahan <b>receipt dena SHALL</b> hai (Rule 208 mein MAY tha): bhejne wale division ko indenting officer likhit/appropriate receipt dega. Isliye internal transfer mein dono taraf record rehta hai.' },
    { l:2, lab:'(ii)', tag:'SHALL',
      text:'In the case of issue of materials from stock for departmental use, manufacture, sale, etc., the Officer-in charge of the stores shall see that an appropriate indent, in the prescribed form has been projected by the indenting officer. A written/online acknowledgement of receipt of material issued shall be obtained from the indenting officer or his authorised representative at the time of issue of materials.',
      ex:'Stock se maal nikalne ka rule: Officer-in-charge ensure karega ki <b>prescribed form ka indent</b> pehle hi maujood hai. Uske baad maal issue karte waqt <b>likhit ya online acknowledgement</b> lena hoga — indenting officer ya uske authorised representative se, aur woh bhi <b>issue ke time par</b>. "Written/online" ka matlab hai ki paper register aur digital system dono barabar maanyata hain.' },
    { l:2, lab:'(iii)', tag:'SHALL',
      text:'In case of materials issued to a contractor, the cost of which is recoverable from the contractor, all relevant particulars, including the recovery rates and the total value chargeable to the contractor should be got acknowledged from the contractor duly signed and dated.',
      ex:'Jab maal contractor ko diya jaaye aur uski <b>cost recoverable</b> ho (jaise departmental material contractor ke kaam mein lage), to contractor se sirf "maal mil gaya" nahi likhwana — <b>recovery rates</b> aur <b>total value chargeable</b> bhi likhwayenge, aur woh <b>signed aur dated</b> hoga. Bina iske baad mein recovery dispute mein amount prove karna mushkil ho jaata hai.' },
    { l:2, lab:'(iv)', tag:'SHALL / MAY',
      text:'If the Officer-in-charge of the stores is unable to comply with the indent in full, he should make the supply to the extent available and make suitable entry to this effect in the indentor’s copy of the indent. In case alternative materials are available in lieu of the indented materials, a suitable indication to this effect may be made in the document.',
      ex:'Agar poora indent pura nahi kar sakte (stock kam hai), to itna supply karo jitna uplabdh hai, aur <b>indentor ki copy of indent mein usi ka suitable entry</b> karo — isse indentor ko pata rahega ki kitna baaki hai. Agar indented item ke badle <b>alternative material</b> uplabdh ho to document mein uska zikr kiya ja sakta hai (yahan "may" hai — discretion hai, par note karna acchi practice hai).' }
  ],
  notes:[
    'Rule 209 ke (i) mein receipt <b>SHALL</b> hai jabki Rule 208(iii) mein supplier ko receipt dena <b>MAY</b> hai — yeh contrast yaad rakhiye.',
    '(iv) zyadatar departments ke SOP se gayab hota hai — par GFR mein likha hai.'
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Contractor ko diya gaya maal — acknowledgement mein kya likhwana zaroori hai?', a:'Sirf receipt nahi — recovery rates aur total value chargeable, contractor se signed aur dated.' },
    { q:'Stock kam ho to indent ka kya karein?', a:'Jitna uplabdh hai utna supply karein aur indentor ki copy mein entry karein (Rule 209(iv)).' }
  ],
  xref:['Rule 208 — private supplier se receipt','Rule 210 — custody','Rule 211 — stock register']
},

/* ══════════════════════ RULE 210 ══════════════════════ */
{
  no:'210', grp:'Custody', scene:'s2', status:'CURRENT',
  title:'Custody of goods and materials',
  audio:'assets/audio/rule-210.mp3',
  hook:'Safe custody + Storage + Temperature + Dust-free = Rule 210',
  intro:'Rule 210 ek single-paragraph rule hai — koi sub-rule ya clause nahi. Chhota par bhaari: yahi rule storage ki physical responsibility tay karta hai, aur isi ke na-manne se aksar Rules 33–38 ke loss cases bante hain.',
  tree:[
    { l:1, lab:'Rule 210', tag:'SHALL',
      text:'The officer-in-charge of stores having custody of goods and materials, especially valuable and/or combustible articles, shall take appropriate steps for arranging their safe custody, proper storage accommodation, including arrangements for maintaining required temperature, dust free environment etc.',
      ex:'Jis officer ke paas samaan ki <b>custody</b> hai, woh chaar cheezein ensure karega: (1) <b>safe custody</b> — security, lock, access control; (2) <b>proper storage accommodation</b> — jagah, racks, handling; (3) <b>required temperature</b>; (4) <b>dust-free environment</b>. "Especially valuable and/or combustible articles" ka matlab hai ki <b>valuable</b> (chori/nuksan ka risk) aur <b>combustible</b> (aag ka risk) items par yeh duty aur sakht ho jaati hai. Aakhir ka "etc." batata hai ki yeh list exhaustive nahi — item ki nature ke hisaab se aur ehtiyaat (humidity, ventilation, fire safety) lena hi hoga.' }
  ],
  notes:[
    'Rule 210 mein "etc." hai — matlab temperature aur dust-free minimum examples hain, poori list nahi.'
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Rule 210 kis par zyada sakht hai?', a:'"Especially valuable and/or combustible articles" par — dono category high-risk hain.' },
    { q:'Kya sirf taala lagana kaafi hai?', a:'Nahi. Safe custody + proper storage accommodation + required temperature + dust-free environment — chaaron alag requirements hain.' }
  ],
  xref:['Rules 33–38 — loss reporting jab custody fail ho','Rule 213 — verification','Rule 216 — custody ka transfer']
},

/* ══════════════════════ RULE 211 ══════════════════════ */
{
  no:'211', grp:'Accounts', scene:'s3', status:'CURRENT',
  title:'Lists and Accounts',
  audio:'assets/audio/rule-211.mp3',
  hook:'Actual balance = Book balance, kisi bhi waqt check ho sake',
  intro:'Rule 211 do sub-rules aur ek Note mein hai. (i) general requirement — item-wise lists/accounts; (ii) chaar alag-alag registers; Note — forms mein aur detail jodi ja sakti hai.',
  tree:[
    { l:2, lab:'(i)', tag:'SHALL',
      text:'The Officer-in-charge of stores shall maintain suitable item-wise lists and accounts and prepare accurate returns in respect of the goods and materials in his charge making it possible at any point of time to check the actual balances with the book balances. The form of the stock accounts mentioned above shall be determined with reference to the nature of the goods and materials, the frequency of the transactions and the special requirements of the concerned Ministries/Departments.',
      ex:'Do duties: <b>item-wise lists + accounts</b> rakhna, aur <b>accurate returns</b> banana. Asal test yeh hai: <b>kisi bhi waqt</b> asal balance (physical) aur book balance (register) ki tulna ho sake. Register ka format fixed nahi — woh teen cheezon par depend karega: goods ki nature, transactions ki frequency, aur us Ministry/Department ki special requirements. Isliye ek hospital ka drug store register aur ek CPWD store ka register alag dikhte hain — dono valid hain.' },
    { l:2, lab:'(ii)', tag:'SHALL',
      text:'Separate accounts shall be kept for (a) Fixed Assets such as plant, machinery, equipment, furniture, fixtures etc. in the Form GFR-22. (b) Consumables such as office stationery, chemicals, maintenance spare parts etc. in the Form GFR-23. (c) Library books in the Form GFR 18 (d) Assets of historical/artistic value held by museum/government departments in the Form GFR-24.',
      ex:'Chaar category ke liye <b>alag-alag accounts</b> — ek hi register sab kuch nahi. (a) Fixed assets — plant, machinery, equipment, furniture, fixtures — <b>Form GFR-22 (Register of Fixed Assets)</b>; (b) Consumables — office stationery, chemicals, maintenance spare parts — <b>Form GFR-23 (Stock Register of consumables)</b>; (c) Library books — <b>Form GFR 18 (Accession Register)</b>; (d) Historical/artistic value wali assets (museum/government departments ke paas) — <b>Form GFR-24</b>. Har category ka behaviour alag hai — consumables ghat-te hain, fixed assets depreciate hote hain, library books ki loss norm alag hai — isliye register alag. <b>Verified:</b> GFR-18 = Accession Register (official DoE GFR forms list, page 179) — yahi library books ka register hai.' }
  ],
  notes:[
    { lab:'Note (Rule 211)', text:'These forms can be supplemented with additional details by Ministries/Departments as required.' , ex:'Departments in forms mein <b>aur columns</b> jod sakte hain (jaise warranty expiry, AMC details, location code). Par jo GFR likhta hai wohatna to minimum hona hi chahiye — supplement karna hai, replace karna nahi.' }
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Kaunsa form kis asset ke liye?', a:'GFR-22 Register of Fixed Assets · GFR-23 Stock Register of consumables · GFR-18 Accession Register (library books) · GFR-24 Register of assets of historical/artistic value.' },
    { q:'Form GFR-18 kya hai?', a:'Accession Register — library books ka register (official DoE GFR forms list, p.179).' },
    { q:'Stock register ka format kaun tay karta hai?', a:'Rule 211(i) ke teeno factors — goods ki nature, transaction frequency, department ki special requirements.' },
    { q:'Kya department GFR-22 mein se koi column hata sakta hai?', a:'Nahi. Note sirf <b>supplement</b> karne ki ijazat deta hai.' }
  ],
  xref:['Rule 213 — inhi registers par verification hoti hai','Rule 215 — library books ke liye alag norm','Rule 216 — handing over ke waqt yahi registers transfer hote hain']
},

/* ══════════════════════ RULE 212 ══════════════════════ */
{
  no:'212', grp:'Accounts', scene:'s3', status:'CURRENT',
  title:'Hiring out of Fixed Assets',
  audio:'assets/audio/rule-212.mp3',
  hook:'Record + Regular recovery + Historical cost = Rule 212',
  intro:'Rule 212 bhi ek single paragraph hai — teen requirements: record, regular recovery, historical cost basis.',
  tree:[
    { l:1, lab:'Rule 212', tag:'SHALL',
      text:'When a fixed asset is hired to local bodies, contractors or others, proper record should be kept of the assets and the hire and other charges as determined under rules prescribed by the competent authority, should be recovered regularly. Calculation of the charges to be recovered from the local bodies, contractors and others as above should be based on the historical cost.',
      ex:'Jab koi <b>fixed asset</b> (jaise departmental genset, machinery, vehicle, tentage) kisi local body, contractor ya kisi aur ko <b>kiraye par</b> diya jaaye, to teen cheezein: (1) asset ka <b>proper record</b> — kaunse asset, kisko, kab se kab tak; (2) hire aur anya charges <b>regularly recover</b> karne honge — charges wahi jo competent authority ke prescribed rules ke tahat hain; (3) charges ki <b>ganana historical cost</b> par hogi — matlab asset jis price par kharida gaya tha (uski original cost), aaj ke market rate ya replacement cost par nahi. Isliye "market rate kam kar do" wali demand Rule 212 ke khilaf hai.' }
  ],
  notes:[
    'Rule 212 khud koi rate prescribe nahi karta — rates "rules prescribed by the competent authority" se aate hain. Rule sirf <b>basis</b> (historical cost) fix karta hai.'
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Hire charges kis par based honge?', a:'Historical cost par — market rate, replacement cost ya insurance value par nahi.' },
    { q:'Kya Rule 212 hiring-out mana karta hai?', a:'Nahi. Yeh allow karta hai, bas record + regular recovery + historical-cost basis ki sharton ke saath.' }
  ],
  xref:['Rule 211 — fixed assets ka register (GFR-22)','DFPR — competent authority ke rules']
},

/* ══════════════════════ RULE 213 ══════════════════════ */
{
  no:'213', grp:'Verification', scene:'s4', status:'CURRENT',
  title:'Physical verification of Fixed Assets and Consumables',
  audio:'assets/audio/rule-213.mp3',
  hook:'Ek saal · Dono category · Custodian saamne · Certificate · Discrepancy → R.33–38',
  intro:'Rule 213 teen sub-rules ka hai: 213(1) fixed assets, 213(2) consumables, 213(3) verification ka procedure (teen clauses). Isi rule se verification ki poori kahani chalti hai.',
  tree:[
    { l:2, lab:'Rule 213(1)', tag:'SHALL',
      text:'Physical verification of Fixed Assets. The inventory for fixed assets shall ordinarily be maintained at site. Fixed assets should be verified at least once in a year and the outcome of the verification recorded in the corresponding register. Discrepancies, if any, shall be promptly investigated and brought to account.',
      ex:'Teen baatein: (a) fixed assets ka inventory <b>ordinarily site par</b> rahega — matlab jahan asset hai wahin record bhi, alag jagah file mein nahi; (b) verification <b>kam se kam saal mein ek baar</b>; (c) verification ka <b>nateeja corresponding register mein</b> darj ho. Discrepancy mile to <b>turant</b> investigate karke account mein laya jaaye. "Ordinarily" aur "at least" dono yaad rakhiye — pehla exception ki gunjaish rakhta hai, doosra minimum frequency hai (zyada baar kar sakte hain).' },
    { l:2, lab:'Rule 213(2)', tag:'SHALL',
      text:'Verification of Consumables: A physical verification of all the consumable goods and materials should be undertaken at least once in a year and discrepancies, if any, should be recorded in the stock register for appropriate action by the competent authority.',
      ex:'Consumables ka bhi wahi frequency — <b>saal mein kam se kam ek baar</b> — lekin nateeja <b>stock register mein</b> darj hoga, aur wahan se aage <b>competent authority</b> action legi. Farq samjhiye: 213(1) mein discrepancy "brought to account" hoti hai; 213(2) mein discrepancy "recorded in stock register for appropriate action by the competent authority". Consumables mein competent authority ka role explicit hai.' },
    { l:2, lab:'Rule 213(3)', tag:'SHALL — procedure',
      text:'Procedure for verification: (i) Verification shall always be made in the presence of the officer, responsible for the custody of the inventory being verified. (ii) A certificate of verification along with the findings shall be recorded in the stock register. (iii) Discrepancies, including shortages, damages and unserviceable goods, if any, identified during verification, shall immediately be brought to the notice of the competent authority for taking appropriate action in accordance with provision given in Rule 33 to 38.',
      ex:'Verification kaise hogi — teen rules: (i) verification <b>hamesha</b> us officer ki maujoodgi mein jo us inventory ka <b>custodian</b> hai (self-verification nahi, doosra officer verify kare par custodian saamne ho); (ii) <b>verification certificate</b> findings ke saath stock register mein darj ho; (iii) verification mein jo <b>shortage, damage ya unserviceable</b> mile, use turant competent authority ke notice mein laaya jaaye — aur action <b>Rules 33 se 38</b> ke tahat hoga.' }
  ],
  notes:[
    'Rule 213(3)(iii) Chapter 7 ko Chapter 2 ke "Defalcation and losses" (Rules 33–38) se jodta hai — shortage ka matlab automatic penalty nahi, balki <b>reporting chain</b> shuru hona hai.',
    '"At least once in a year" minimum hai — department chahe to adhik baar (jaise half-yearly) karwa sakta hai.'
  ],
  provisos:[],
  exceptions:[
    '"Inventory for fixed assets shall <b>ordinarily</b> be maintained at site" — "ordinarily" exception ki gunjaish rakhta hai (jaise centralized asset register with site-wise sub-records).'
  ],
  amendment:null,
  traps:[
    { q:'Fixed assets aur consumables — dono ki verification frequency?', a:'Dono "at least once in a year" (213(1) aur 213(2)).' },
    { q:'Verification kiski presence mein hogi?', a:'Us officer ki jo inventory ka custodian hai — Rule 213(3)(i), "shall always".' },
    { q:'Shortage mile to pehla kadam?', a:'Record karke turant competent authority ke notice mein laana, phir Rules 33–38 ke anusar action.' },
    { q:'Kya verification ka matlab item condemn ho gaya?', a:'Nahi. Verification sirf asliyat check karta hai; condemnation/disposal alag process hai (Rules 217–221).' }
  ],
  xref:['Rules 33–38 — losses','Rule 214 — surplus ka time trigger','Rule 215 — library books ka alag norm','Rule 217 — aage disposal']
},

/* ══════════════════════ RULE 214 ══════════════════════ */
{
  no:'214', grp:'Planning', scene:'s5', status:'CURRENT',
  title:'Buffer Stock',
  audio:'assets/audio/rule-214.mp3',
  hook:'Buffer = authority tay kare · 1 saal se upar = aam taur par surplus',
  intro:'Rule 214 ek chhota rule hai par iska <b>Note</b> poore chapter ka sabse cited line hai — "ek saal se zyada stock mein pada material aam taur par surplus".',
  tree:[
    { l:1, lab:'Rule 214', tag:'SHALL (planning duty)',
      text:'Depending on the frequency of requirement and quantity thereof as well as the pattern of supply of a consumable material, optimum buffer stock should be determined by the competent authority.',
      ex:'<b>Optimum buffer stock</b> competent authority tay karega — yeh koi fixed number nahi jo GFR mein likha ho. Tay karte waqt teen factors dekhne honge: requirement ki <b>frequency</b>, <b>quantity</b>, aur supply ka <b>pattern</b> (lead time, reliability). Matlab buffer stock ek analysis ka nateeja hai, guess nahi.' }
  ],
  notes:[
    { lab:'Note (Rule 214)', text:'As the inventory carrying cost is an expenditure that does not add value to the material being stocked, a material remaining in stock for over a year shall generally be considered surplus, unless adequate reasons to treat it otherwise exist. The items so declared surplus may be dealt as per the procedure laid down under Rule 217.',
      ex:'Yeh note do kaam karta hai. Pehla: <b>reasoning</b> — inventory carrying cost aisa kharch hai jo material ki value nahi badhata, isliye bina wajah stock rakhna financial propriety ke khilaf hai. Doosra: <b>rebuttable presumption</b> — ek saal se zyada stock mein pada material <b>aam taur par</b> (generally) surplus maana jaayega, <b>jab tak</b> use alag treat karne ke <b>adequate reasons</b> maujood na hon. "Generally" aur "unless adequate reasons" dono zaroori hain — yeh automatic condemnation nahi hai. Aise declared surplus items aage <b>Rule 217</b> ke procedure se dispose honge.' }
  ],
  provisos:[],
  exceptions:[
    '"Unless adequate reasons to treat it otherwise exist" — planned/strategic spares, warranty items, seasonal stock jaise reasons record kiye ja sakte hain.'
  ],
  amendment:null,
  traps:[
    { q:'Buffer stock ka optimum level kaun tay karta hai?', a:'Competent authority — frequency, quantity aur supply pattern ke adhaar par. GFR koi fixed figure nahi deta.' },
    { q:'1 saal se zyada stock mein pada material automatic surplus hai?', a:'Nahi — "generally" surplus, aur "unless adequate reasons to treat it otherwise exist". Yeh rebuttable presumption hai.' },
    { q:'Surplus declare hone ke baad kya hoga?', a:'Rule 217 ka procedure — declaration, valuation, Form GFR-10.' }
  ],
  xref:['Rule 213 — verification se surplus pakda jaata hai','Rule 217 — disposal procedure']
},

/* ══════════════════════ RULE 215 ══════════════════════ */
{
  no:'215', grp:'Verification', scene:'s5', status:'CURRENT',
  title:'Physical verification of Library books',
  audio:'assets/audio/rule-215.mp3',
  hook:'20,000 = har saal · 50,000 = 3 saal · usse upar = sample · 5 per 1,000',
  intro:'Rule 215 library books ke liye Rule 213 ka <b>special exception</b> hai — yahan do clauses hain: (i) verification ka scale-based schedule, (ii) reasonable loss ka norm.',
  tree:[
    { l:2, lab:'(i)', tag:'SHALL',
      text:'Complete physical verification of books should be done every year in case of libraries having not more than twenty thousand volumes. For libraries having more than twenty thousand volumes and up to fifty thousand volumes, such verification should be done at least once in three years. Sample physical verification at intervals of not more than three years should be done in case of libraries having more than fifty thousand volumes. In case such verification reveals unusual or unreasonable shortages, complete verification shall be done.',
      ex:'Teen slabs: <b>≤ 20,000 volumes</b> → har saal complete verification; <b>20,000 se zyada aur 50,000 tak</b> → kam se kam 3 saal mein ek baar complete verification; <b>50,000 se zyada</b> → sample verification, jinke beech ka interval 3 saal se zyada na ho. Aakhir ka vaakya sabse important: agar <b>sample verification mein unusual ya unreasonable shortage</b> dikhe to <b>complete verification</b> karni hi padegi. Matlab sample method chhote library ke liye nahi, bade library ke liye hai — aur jab bhi suspicious nateeja aaye, sample se complete par jaana hi hoga.' },
    { l:2, lab:'(ii)', tag:'MAY (reasonable) / SHALL (investigate)',
      text:'Loss of five volumes per one thousand volumes of books issued/consulted in a year may be taken as reasonable provided such losses are not attributable to dishonesty or negligence. However, loss of a book of a value exceeding Rs. 1,000/- (Rupees One thousand only) and rare books irrespective of value shall invariably be investigated and appropriate action taken.',
      ex:'Pehla hissa ek <b>concession</b> hai: ek saal mein jitni books issue/consult hui unmein har 1,000 par <b>5 volumes</b> ki loss reasonable maani ja sakti hai — par sirf tab jab woh <b>dishonesty ya negligence</b> ki wajah se na ho. Doosra hissa ek <b>exception</b>: <b>₹1,000 se zyada value</b> ki kitaab, aur <b>rare books</b> (value kuch bhi ho) — inki loss ki <b>hamesha</b> investigation hogi. Yani 5/1,000 ka norm sirf ordinary books ke liye hai; mehngi aur rare books ke liye zero tolerance.' }
  ],
  notes:[
    'Rule 215 Rule 213 ke "at least once in a year" se <b>exception</b> hai — library books par scale-based schedule lagu hota hai, annual nahi (siwaye ≤20,000 volumes wale library ke).'
  ],
  provisos:[
    'Proviso jaise shabd (i) ke ant mein: "In case such verification reveals unusual or unreasonable shortages, complete verification shall be done." — sample verification ka result hi complete verification ka trigger hai.'
  ],
  exceptions:[
    'Reasonable loss 5/1,000 tabhi jab dishonesty/negligence na ho.',
    '₹1,000 se upar ki kitaab aur rare books — 5/1,000 ke concession se bahar.'
  ],
  amendment:null,
  traps:[
    { q:'30,000 volumes wale library mein verification?', a:'Complete verification kam se kam 3 saal mein ek baar.' },
    { q:'60,000 volumes wale library mein?', a:'Sample verification, jinke intervals 3 saal se zyada na hon.' },
    { q:'Reasonable loss norm?', a:'Har 1,000 issued/consulted volumes par 5 volumes — bina dishonesty/negligence ke.' },
    { q:'₹800 ki ek kitaab kho gayi — investigation zaroori?', a:'Rule 215(ii) ke hisaab se ₹1,000 se upar ki kitaab ya rare book par hi "invariably" investigation ka rule hai; ₹800 ki ordinary kitaab 5/1,000 norm ke andar aa sakti hai (agar dishonesty/negligence na ho).' }
  ],
  xref:['Rule 211(ii)(c) — library books Form GFR 18','Rule 213 — general verification rule','Rules 33–38 — loss action']
},

/* ══════════════════════ RULE 216 ══════════════════════ */
{
  no:'216', grp:'Accountability', scene:'s6', status:'CURRENT',
  title:'Transfer of charge of goods, materials etc.',
  audio:'assets/audio/rule-216.mp3',
  hook:'Statement · Dono sign with date · Dono ke paas copy',
  intro:'Rule 216 ek paragraph ka rule hai — lekin yahi tay karta hai ki charge badalne ke baad kisi bhi kami ki zimmedari kiski hogi.',
  tree:[
    { l:1, lab:'Rule 216', tag:'SHALL',
      text:'In case of transfer of Officer-in-charge of the goods, materials etc., the transferred officer shall see that the goods or material are made over correctly to his successor. A statement giving all relevant details of the goods, materials etc., in question shall be prepared and signed with date by the relieving officer and the relieved officer. Each of these officers will retain a copy of the signed statement.',
      ex:'Teen requirements: (1) jaane wala (transferred) officer ensure karega ki goods/materials <b>sahi tareeke se</b> successor ko sauNpe jaayein — sirf chabi dena kaafi nahi; (2) ek <b>statement</b> banega jismein goods/materials ki <b>saari relevant details</b> hon, aur use <b>relieving</b> (charge lene wale) aur <b>relieved</b> (charge chhodne wale) <b>dono</b> officers <b>date ke saath sign</b> karenge; (3) <b>dono ek-ek copy</b> rakhenge. Isi copy se aage chalkar yeh tay hota hai ki nayi kami purane officer ki hai ya naye ki.' }
  ],
  notes:[
    'Rule 216 mein koi proviso ya exception nahi — yeh har transfer par lagu hai, chahe charge kitne din ka ho.'
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Statement kaun sign karega?', a:'Relieving aur relieved — dono, date ke saath. Sirf ek ka sign kaafi nahi.' },
    { q:'Copy kaun rakhega?', a:'Dono officers ek-ek copy rakhenge.' },
    { q:'Kya mukh-zabani (oral) handover valid hai?', a:'Nahi. Rule 216 likhit, date-sahit, dono-hastaksharit statement aur copy retention maangta hai.' }
  ],
  xref:['Rule 211 — jin registers ka transfer hota hai','Rules 33–38 — baad mein kami mile to','Rule 213 — nayi verification se purani kami nikal aati hai']
},

/* ══════════════════════ RULE 217 ══════════════════════ */
{
  no:'217', grp:'Disposal', scene:'s7', status:'CURRENT',
  title:'Disposal of Goods',
  audio:'assets/audio/rule-217.mp3',
  hook:'Declare → Record reasons → Value → GFR-10 → Responsibility → E-waste rules',
  intro:'Rule 217 paanch clauses ka hai aur poore disposal process ka pehla darwaza hai. Iske bina Rule 218 ka koi mode choose nahi kiya ja sakta.',
  tree:[
    { l:2, lab:'(i)', tag:'MAY (declaration) / SHALL (reasons)',
      text:'An item may be declared surplus or obsolete or unserviceable if the same is of no use to the Ministry or Department. The reasons for declaring the item surplus or obsolete or unserviceable should be recorded by the authority competent to purchase the item.',
      ex:'Declaration tab ho sakti hai jab item Ministry/Department ke kaam ka na rahe. Par declaration <b>kaun</b> karega — <b>woh authority jo item kharidne ke liye competent hai</b> (authority competent to purchase). Aur us authority ko <b>reasons record</b> karne hi honge. "May declare" ka matlab hai declaration discretionary hai; "reasons should be recorded" ka matlab hai ki jab bhi declare karo, likhit kaaran zaroori hai.' },
    { l:2, lab:'(ii)', tag:'MAY (discretion)',
      text:'The competent authority may, at his discretion, constitute a committee at appropriate level to declare item(s) as surplus or obsolete or unserviceable.',
      ex:'Committee banana <b>vivek-adhikar</b> hai — "may, at his discretion". Matlab committee <b>zaroori nahi</b>, par bade ya sensitive lots ke liye banana behtar practice (aur aksar departmental instructions mein likha hota hai). Exam mein yeh MAY vs SHALL ka favourite sawal hai.' },
    { l:2, lab:'(iii)', tag:'SHALL',
      text:'The book value, guiding price and reserved price, which will be required while disposing of the surplus goods, should also be worked out. In case where it is not possible to work out the book value, the original purchase price of the goods in question may be utilised. A report of stores for disposal shall be prepared in Form GFR - 10.',
      ex:'Teen prices nikalne honge: <b>book value</b>, <b>guiding price</b>, <b>reserved price</b>. Agar book value nikalna <b>sambhav na ho</b>, to <b>original purchase price</b> use kiya ja sakta hai (yahan "may be utilised" ek permitted fallback hai). Aur disposal ki report <b>Form GFR-10</b> mein banegi — yeh document aage ke saare modes (tender/auction/scrap) ki buniyad hai.' },
    { l:2, lab:'(iv)', tag:'SHALL',
      text:'In case an item becomes unserviceable due to negligence, fraud or mischief on the part of a Government servant, responsibility for the same should be fixed.',
      ex:'Agar item kisi <b>Government servant ki negligence, fraud ya mischief</b> se unserviceable hua ho, to <b>responsibility fix</b> karni hogi. Matlab normal wear-and-tear aur insaan ki galti mein farq hai — pehla depreciation hai (Rule 223(2)(ii)), doosra fixable responsibility hai (Rule 223(3)(ii) "losses due to neglect" se judta hai).' },
    { l:2, lab:'(v)', tag:'SHALL',
      text:'Sale of Hazardous waste/Scrap Batteries/Electronic waste: Scrap lots comprising of hazardous waste, batteries etc. shall be sold keeping in view the extant guidelines of Ministry of Environment & Forest. Prospective bidders of such lots of hazardous waste/scrap batteries/e-waste should be in possession of registration, valid on the date of e-Auction and on the date of delivery, as recycler/pre-processor agency.',
      ex:'Hazardous waste, scrap batteries aur <b>e-waste</b> ki sale <b>Ministry of Environment & Forest</b> (aaj ke context mein MoEF&CC) ke extant guidelines ke tahat hogi. Ek aur hard condition: aise lots ke <b>prospective bidders</b> ke paas recycler/pre-processor agency ke roop mein <b>registration</b> hona chahiye jo <b>e-Auction ki date</b> par aur <b>delivery ki date</b> par <b>valid</b> ho. Matlab kisi bhi random scrap dealer ko e-waste bechna mana hai — registered recycler hi kharid sakta hai.' }
  ],
  notes:[
    'Rule 217(v) GFR ko E-Waste (Management) Rules, 2022 aur MoEF&CC guidelines se jodta hai — isliye Special Campaign mein e-waste disposal ka alag se target hota hai.'
  ],
  provisos:[],
  exceptions:[
    'Committee banana discretionary hai (ii) — par reasons, teen prices aur GFR-10 mandatory hain.',
    'Book value na nikal sake to original purchase price ka fallback (iii).'
  ],
  amendment:null,
  traps:[
    { q:'Item ko surplus/obsolete/unserviceable kaun declare karta hai?', a:'Woh authority jo item kharidne ke liye competent hai (authority competent to purchase), reasons record karke.' },
    { q:'Committee banana zaroori hai?', a:'Nahi — "may, at his discretion".' },
    { q:'Book value nahi mil rahi to?', a:'Original purchase price use kiya ja sakta hai.' },
    { q:'E-waste bechne ke liye bidder ke paas kya hona chahiye?', a:'Recycler/pre-processor registration, jo e-Auction aur delivery — dono dates par valid ho.' }
  ],
  xref:['Rule 214 Note — surplus items yahin aate hain','Rule 218 — mode of disposal','Rules 219–221 — sale ke tareeke','Rule 223(3)(ii) — losses due to neglect']
},

/* ══════════════════════ RULE 218 ══════════════════════ */
{
  no:'218', grp:'Disposal', scene:'s8', status:'AMENDED',
  title:'Modes of Disposal',
  audio:'assets/audio/rule-218.mp3',
  hook:'₹4 lakh = Tender ya Auction · ₹2 lakh = 10.07.2024 se pehle',
  intro:'Rule 218 chaar clauses ka hai aur <b>amended</b> hai: clause (i) ki threshold DoE OM F.1/3/2024-PPD (10.07.2024) se ₹2 lakh se badhkar ₹4 lakh ho gayi.',
  tree:[
    { l:2, lab:'(i)', tag:'SHALL — [AMENDED]',
      text:'Surplus or obsolete or unserviceable goods of assessed residual value above Rupees Four Lakh [originally: Rupees Two Lakh] should be disposed of by : (a) obtaining bids through advertised tender or (b) public auction.',
      ex:'<b>Assessed residual value</b> (na ki original purchase value) <b>₹4,00,000 se upar</b> ho to disposal sirf do tareeqon se: (a) advertised tender se bids, ya (b) public auction. DONO mein se koi ek chunna hai — teesra raasta (direct sale, quotation, committee decision) allowed nahi. <b>Amendment:</b> 10.07.2024 se pehle yah line ₹2,00,000 thi; DoE OM No. F.1/3/2024-PPD dated 10.07.2024 ne ise ₹4,00,000 kar diya.' },
    { l:2, lab:'(ii)', tag:'SHALL (with objectives)',
      text:'For surplus or obsolete or unserviceable goods with residual value less than Rupees Four Lakh, the mode of disposal will be determined by the competent authority, keeping in view the necessity to avoid accumulation of such goods and consequential blockage of space and, also, deterioration in value of goods to be disposed of. Ministries/Departments should, as far as possible prepare a list of such goods.',
      ex:'₹4 lakh se <b>kam</b> residual value par mode <b>competent authority</b> tay karegi, lekin bina reason ke nahi — teen objectives dhyan mein rakhne honge: (1) samaan ka <b>jama hona</b> rokna, (2) <b>jagah block</b> na hona, (3) disposal hone wale samaan ki <b>value kharab</b> na hona. Saath hi Ministries/Departments ko jahan tak ho sake aise goods ki <b>list</b> banani chahiye — isi list se Special Campaign ke scrap targets bante hain.' },
    { l:2, lab:'(iii)', tag:'SHALL — immediate',
      text:'Certain surplus or obsolete or unserviceable goods such as expired medicines, food grain, ammunition etc., which are hazardous or unfit for human consumption, should be disposed of or destroyed immediately by adopting suitable mode so as to avoid any health hazard and/or environmental pollution and also the possibility of misuse of such goods.',
      ex:'Kuch cheezein <b>bechi nahi ja sakti</b> — expired medicines, food grain, ammunition jaise hazardous ya human consumption ke layak na hone wale items ko <b>turant</b> dispose ya destroy karna hai, suitable mode se. Teen kaaran: health hazard, environmental pollution, aur misuse ki sambhavna. Yahan koi threshold lagu nahi — ₹4 lakh se kam ho ya zyada, yeh clause alag hai.' },
    { l:2, lab:'(iv)', tag:'SHALL',
      text:'Surplus or obsolete or unserviceable goods, equipment and documents, which involve security concerns (e.g. currency, negotiable instruments, receipt books, stamps, security press etc.) should be disposed of/destroyed in an appropriate manner to ensure compliance with rules relating to official secrets as well as financial prudence.',
      ex:'Jin cheezon mein <b>security concern</b> ho — currency, negotiable instruments, receipt books, stamps, security press waghaira — unka disposal/destruction aise tareeqe se hoga jo <b>official secrets</b> ke rules aur <b>financial prudence</b> dono ka palan kare. Matlab inhein bhi aam auction mein nahi daala jaata; controlled destruction hi raasta hai.' }
  ],
  notes:[
    'Clause (i) aur (ii) dono mein threshold ek hi hai aur dono amendment ke saath badalte hain — 10.07.2024 se pehle dono jagah ₹2 lakh tha.',
    'Threshold <b>assessed residual value</b> par hai — original purchase price ya book value par nahi.'
  ],
  provisos:[],
  exceptions:[
    '(iii) hazardous/unfit items — in par threshold lagu nahi, immediate destruction hi rule hai.',
    '(iv) security-sensitive items — official secrets rules ke tahat alag handling.'
  ],
  amendment:{
    old:'Rule 218(i)/(ii): residual value above / less than <b>Rupees Two Lakh</b>',
    neu:'Rule 218(i)/(ii): residual value above / less than <b>Rupees Four Lakh</b>',
    om:'Department of Expenditure O.M. No. F.1/3/2024-PPD',
    date:'10.07.2024',
    effect:'₹2 lakh se ₹4 lakh ke beech ke goods ab competent authority decide kar sakti hai — sirf ₹4 lakh se upar wale advertised tender/auction par jaate hain.'
  },
  traps:[
    { q:'Current threshold kya hai?', a:'₹4,00,000 assessed residual value (10.07.2024 se). Purani kitabon mein ₹2 lakh milega — wo outdated hai.' },
    { q:'₹5 lakh residual value wale purane furniture ke saath kya karenge?', a:'Advertised tender ya public auction — competent authority direct sale nahi kar sakti.' },
    { q:'Expired medicines ka disposal?', a:'Turant dispose/destroy — hazard, pollution aur misuse se bachne ke liye. Bechna nahi.' },
    { q:'Kya threshold "prohibition" hai?', a:'Nahi. Yeh <b>mode of disposal</b> tay karta hai, disposal par rok nahi.' }
  ],
  xref:['Rule 217 — declaration & valuation','Rules 219–220 — tender/auction ka procedure','Rule 221 — dono fail hone par','Appendix/Official Secrets rules — clause (iv)']
},

/* ══════════════════════ RULE 219 ══════════════════════ */
{
  no:'219', grp:'Sale', scene:'s9', status:'CURRENT',
  title:'Disposal through Advertised Tender',
  audio:'assets/audio/rule-219.mp3',
  hook:'9 steps (a)–(i) · 7 aspects (a)–(g) · 10% bid security · late bid = no',
  intro:'Rule 219 teen hisson mein hai: (i) nau broad steps (a) se (i), (ii) saat important aspects (a) se (g), aur (iii) late bids ka rule.',
  tree:[
    { l:2, lab:'(i)', tag:'SHALL — 9 steps',
      text:'The broad steps to be adopted for this purpose are as follows : (a) Preparation of bidding documents. (b) Invitation of tender for the surplus goods to be sold. (c) Opening of bids. (d) Analysis and evaluation of bids received. (e) Selection of highest responsive bidder. (f) Collection of sale value from the selected bidder. (g) Issue of sale release order to the selected bidder. (h) Release of the sold surplus goods to the selected bidder. (i) Return of bid security to the unsuccessful bidders.',
      ex:'Nau kadam: bidding document banana → tender invite karna → bids kholna → analysis/evaluation → highest responsive bidder chunna → sale value collect karna → sale release order dena → goods release karna → <b>unsuccessful bidders ki bid security wapas karna</b>. Aakhri step aksar bhool jaate hain — unsuccessful bidders ki security return karna bhi rule ka hissa hai.' },
    { l:2, lab:'(ii)(a)', tag:'SHALL — principles',
      text:'The basic principle for sale of such goods through advertised tender is ensuring transparency, competition, fairness and elimination of discretion. Wide publicity should be ensured of the sale plan and the goods to be sold. All the required terms and conditions of sale are to be incorporated in the bidding document comprehensively in plain and simple language. Applicability of taxes, as relevant, should be clearly stated in the document.',
      ex:'Chaar moolya: <b>transparency, competition, fairness, discretion ka khatma</b>. Sale plan aur goods ka <b>wide publicity</b> zaroori. Saari terms bidding document mein <b>comprehensive, plain and simple language</b> mein honi chahiye — chhupe hue conditions nahi. Aur <b>taxes</b> ka applicability document mein saaf likha ho.' },
    { l:2, lab:'(ii)(b)', tag:'SHALL',
      text:'The bidding document should also indicate the location and present condition of the goods to be sold so that the bidders can inspect the goods before bidding.',
      ex:'Bidding document mein goods ka <b>location</b> aur <b>present condition</b> dono likhne honge, taaki bidder <b>bidding se pehle inspect</b> kar sake. Isse "jo dekha wo mila" wala dispute nahi hota — isliye condition chhupana rule ke khilaf hai.' },
    { l:2, lab:'(ii)(c)', tag:'SHALL (ordinarily 10%)',
      text:'The bidders should be asked to furnish bid security along with their bids. The amount of bid security should ordinarily be ten per cent. of the assessed or reserved price of the goods. The exact bid security amount should be indicated in the bidding document.',
      ex:'Bidders ko bid ke saath <b>bid security</b> deni hogi. Amount <b>aam taur par (ordinarily) assessed ya reserved price ka 10%</b> hoga, aur <b>exact amount bidding document mein likhna</b> hi hoga. "Ordinarily" ka matlab hai ki yahi normal hai, par exact figure document mein declared hona chahiye — bidder ko andaza nahi lagwana chahiye.' },
    { l:2, lab:'(ii)(d)', tag:'SHALL / MAY (negotiation limited)',
      text:'The bid of the highest acceptable responsive bidder should normally be accepted. However, if the price offered by that bidder is not acceptable, negotiation may be held only with that bidder. In case such negotiation does not provide the desired result, the reasonable or acceptable price may be counter offered to the next highest responsive bidder(s).',
      ex:'Normal rule: <b>highest acceptable responsive bidder</b> ka bid accept hoga. Agar uska price acceptable na ho to <b>negotiation sirf usi bidder se</b> ho sakti hai — sabhi bidders se nahi. Agar negotiation fail ho jaaye, to reasonable/acceptable price ko <b>counter-offer</b> ke roop mein agle highest responsive bidder(s) ko diya ja sakta hai. Yani H1 ke saath negotiation ke baad H2 par jaane ka raasta hai, lekin H1 ke bina H2 ke saath negotiation nahi.' },
    { l:2, lab:'(ii)(e)', tag:'MAY',
      text:'In case the total quantity to be disposed of cannot be taken up by the highest acceptable bidder, the remaining quantity may be offered to the next higher bidder(s) at the price offered by the highest acceptable bidder.',
      ex:'Agar H1 poori quantity nahi le sakta, to <b>bachi hui quantity</b> agle bidder(s) ko offer ki <b>ja sakti</b> hai — par <b>usi price par jo H1 ne offer kiya tha</b>. Matlab H2 ko H1 ke rate par milega, apne kam rate par nahi. Yeh government ke liye price protection hai.' },
    { l:2, lab:'(ii)(f)', tag:'SHALL',
      text:'Full payment, i.e. the residual amount after adjusting the bid security should be obtained from the successful bidder before releasing the goods.',
      ex:'<b>Poora payment</b> — bid security adjust karke baaki jo bacha — goods release karne se <b>pehle</b> milna chahiye. "Udhaar mein maal de denge" Rule 219 ke khilaf hai.' },
    { l:2, lab:'(ii)(g)', tag:'SHALL',
      text:'In case the selected bidder does not show interest in lifting the goods, the bid security should be forfeited and other actions initiated including re-sale of the goods in question at the risk and cost of the defaulter, after obtaining legal advice.',
      ex:'Agar selected bidder maal uthane mein interest na dikhaaye (default), to <b>bid security forfeit</b> hogi, aur aage ki karwai hogi — jismein goods ki <b>re-sale defaulter ke risk and cost par</b> shaamil hai, <b>legal advice lene ke baad</b>. Yani default ka nuksan government ko nahi, defaulter ko jhelna hoga.' },
    { l:2, lab:'(iii)', tag:'SHALL NOT',
      text:'Late bids i.e. bids received after the specified date and time of receipt should not to be considered.',
      ex:'<b>Late bids</b> — jo specified date/time ke baad aayein — consider <b>nahi</b> kiye jaayenge. Yeh Rule 202 (non-consulting services) jaisa hi absolute rule hai; koi discretion nahi.' }
  ],
  notes:[
    '(i) mein nau steps hain (a)–(i), jabki (ii) mein saat aspects (a)–(g) — dono ki numbering alag hai, confuse na karein.',
    'Bid security "ordinarily 10%" hai, par exact amount bidding document mein likhna hi hoga.'
  ],
  provisos:[],
  exceptions:[
    '(ii)(e) quantity-splitting ek MAY hai — zaroori nahi ki bachi quantity agle bidder ko hi jaaye.'
  ],
  amendment:null,
  traps:[
    { q:'Bid security kitni?', a:'Ordinarily assessed ya reserved price ka 10% — exact amount bidding document mein.' },
    { q:'Negotiation kis se ho sakti hai?', a:'Sirf highest acceptable responsive bidder se (H1). Fail hone par H2 ko counter-offer.' },
    { q:'Bachi quantity agle bidder ko kis rate par?', a:'H1 ke offered price par (Rule 219(ii)(e)).' },
    { q:'Maal kab release hoga?', a:'Full payment (bid security adjust karke baaki) milne ke baad.' },
    { q:'Late bid?', a:'Consider nahi kiya jayega — bilkul nahi.' }
  ],
  xref:['Rule 218(i)(a) — kab advertised tender zaroori hai','Rule 220 — auction ka procedure','Rule 221 — dono fail hone par']
},

/* ══════════════════════ RULE 220 ══════════════════════ */
{
  no:'220', grp:'Sale', scene:'s9', status:'CURRENT',
  title:'Disposal through Auction',
  audio:'assets/audio/rule-220.mp3',
  hook:'25% spot earnest money · Cash ya DACR · IFW officer zaroori',
  intro:'Rule 220 paanch clauses ka hai: (i) kaun karayega, (ii) principles + publicity, (iii) auction shuru mein dobara ghoshna, (iv) hammer stroke + earnest money, (v) team mein IFW officer.',
  tree:[
    { l:2, lab:'(i)', tag:'MAY',
      text:'A Ministry or Department may undertake auction of goods to be disposed of either directly or through approved auctioneers.',
      ex:'Auction do tareeqe se ho sakti hai: <b>khud (directly)</b> ya <b>approved auctioneers</b> ke zariye. Dono valid hain — "approved auctioneers" ka matlab hai ki kisi bhi private auctioneer ko nahi, approved ko hi lena hai.' },
    { l:2, lab:'(ii)', tag:'SHALL',
      text:'The basic principles to be followed here are similar to those applicable for disposal through advertised tender so as to ensure transparency, competition, fairness and elimination of discretion. The auction plan including details of the goods to be auctioned and their location, applicable terms and conditions of the sale etc. should be given wide publicity in the same manner as is done in case of advertised tender.',
      ex:'Principles wahi — <b>transparency, competition, fairness, discretion ka khatma</b>. Auction plan mein goods ki details, unka location aur sale ki terms hon, aur use <b>utni hi wide publicity</b> mile jitni advertised tender ko milti hai. Matlab chupke se auction karwana allowed nahi.' },
    { l:2, lab:'(iii)', tag:'SHALL',
      text:'While starting the auction process, the condition and location of the goods to be auctioned, applicable terms and conditions of sale etc., (as already indicated earlier while giving vide publicity for the same), should be announced again for the benefit of the assembled bidders.',
      ex:'Auction <b>shuru karte waqt</b> ek baar phir ghoshit karein: goods ki <b>condition</b>, <b>location</b>, aur terms & conditions — <b>ikathhe hue bidders</b> ke faayde ke liye. Publicity mein likha hua phir se bolna zaroori hai, taaki koi bole "mujhe pata nahi tha".' },
    { l:2, lab:'(iv)', tag:'SHALL',
      text:'During the auction process, acceptance or rejection of a bid should be announced immediately on the stroke of the hammer. If a bid is accepted, earnest money (not less than twenty-five per cent. of the bid value) should immediately be taken on the spot from the successful bidder either in cash or in the form of Deposit-at-Call-Receipt (DACR), drawn in favour of the Ministry or Department selling the goods. The goods should be handed over to the successful bidder only after receiving the balance payment.',
      ex:'Teen hard rules: (1) bid ki <b>acceptance ya rejection turant</b> — <b>hammer stroke</b> par — ghoshit ho; (2) accept hote hi <b>earnest money = bid value ka kam se kam 25%</b>, <b>mauke par turant</b> lena hoga — <b>cash</b> ya <b>DACR</b> (Deposit-at-Call-Receipt) jo <b>bechne wale Ministry/Department ke favour</b> mein ho; (3) goods tabhi sauNpe jaayenge jab <b>baaki payment</b> mil jaaye. Yahan 25% aur "on the spot" dono zaroori hain.' },
    { l:2, lab:'(v)', tag:'SHALL',
      text:'The composition of the auction team will be decided by the competent authority. The team should however include an officer of the Internal Finance Wing of the department.',
      ex:'Auction team ka gathan competent authority tay karegi — par ek cheez fixed hai: team mein department ke <b>Internal Finance Wing (IFW)</b> ka officer <b>hona hi chahiye</b>. Yani team composition mein discretion hai, IFW representation mein nahi.' }
  ],
  notes:[
    '25% earnest money aur 10% bid security (Rule 219) mein farq yaad rakhiye — auction mein 25%, tender mein 10%.',
    'DACR = Deposit-at-Call-Receipt, bechne wale Ministry/Department ke favour mein.'
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Auction mein earnest money kitni?', a:'Bid value ka kam se kam 25% — turant, mauke par, cash ya DACR mein.' },
    { q:'Auction team mein kaun hona hi chahiye?', a:'Internal Finance Wing ka officer (Rule 220(v)).' },
    { q:'Auction khud karwa sakte hain?', a:'Haan — directly ya approved auctioneers ke zariye.' },
    { q:'Goods kab sauNpe jaayenge?', a:'Balance payment milne ke baad hi.' }
  ],
  xref:['Rule 218(i)(b) — kab auction zaroori hai','Rule 219 — advertised tender (principles same)','Rule 221 — dono fail hone par']
},

/* ══════════════════════ RULE 221 ══════════════════════ */
{
  no:'221', grp:'Sale', scene:'s10', status:'CURRENT',
  title:'Disposal at scrap value or by other modes',
  audio:'assets/audio/rule-221.mp3',
  hook:'Tender fail → Auction fail → Scrap (CA + Finance) → Eco-friendly destruction',
  intro:'Rule 221 ek paragraph ka hai, par iski <b>pre-condition</b> sabse important hai — yeh tabhi lagu hota hai jab advertised tender <b>aur</b> auction dono try karke dekh liye hon.',
  tree:[
    { l:1, lab:'Rule 221', tag:'MAY (with conditions)',
      text:'If a Ministry or Department is unable to sell any surplus or obsolete or unserviceable item in spite of its attempts through advertised tender or auction, it may dispose of the same at its scrap value with the approval of the competent authority in consultation with Finance division. In case the Ministry or Department is unable to sell the item even at its scrap value, it may adopt any other mode of disposal including destruction of the item in an eco-friendly manner.',
      ex:'Do stages. <b>Stage 1:</b> agar advertised tender ya auction ke bawajood item nahi bikta, to <b>scrap value</b> par becha ja sakta hai — par <b>competent authority ki approval</b> ke saath <b>Finance division se consultation</b> karke. Yani do alag cheezein: approval (competent authority) + consultation (Finance division). <b>Stage 2:</b> agar scrap value par bhi nahi bikta, to <b>koi bhi anya mode</b> apnaya ja sakta hai — jismein <b>eco-friendly destruction</b> bhi shaamil hai. Yahi woh jagah hai jahan e-waste ka authorized recycler ke zariye environment-friendly disposal aata hai.' }
  ],
  notes:[
    'Rule 221 "MAY" hai — lekin condition ke saath: pehle dono sale modes try karne honge.',
    'Finance division se <b>consultation</b> hai, concurrence nahi — par record mein consultation dikhna chahiye.'
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Kya bina tender/auction try kiye seedha scrap value par bech sakte hain?', a:'Nahi. "In spite of its attempts through advertised tender or auction" — pehle dono try zaroori.' },
    { q:'Scrap value par bechne ke liye kya chahiye?', a:'Competent authority ki approval + Finance division se consultation.' },
    { q:'Scrap par bhi na bike to?', a:'Koi bhi anya mode, including eco-friendly destruction.' }
  ],
  xref:['Rule 218 — modes','Rules 219–220 — jin modes ka fail hona chahiye','Rule 217(v) — e-waste guidelines']
},

/* ══════════════════════ RULE 222 ══════════════════════ */
{
  no:'222', grp:'Records', scene:'s10', status:'CURRENT',
  title:'Sale Account',
  audio:'assets/audio/rule-222.mp3',
  hook:'Form GFR-11 · Sale supervise karne wale officer ke hastakshar',
  intro:'Rule 222 ek line ka rule hai — disposal ke baad ka antim record. Chhota par audit mein sabse pehle yahi maanga jaata hai.',
  tree:[
    { l:1, lab:'Rule 222', tag:'SHALL',
      text:'A sale account should be prepared for goods disposed of in Form GFR 11 duly signed by the officer who supervised the sale or auction.',
      ex:'Dispose kiye gaye goods ka <b>sale account Form GFR-11</b> mein banega, aur us par <b>us officer ke hastakshar</b> honge jisne sale ya auction ki <b>nigraani</b> ki. Dhyan dein: sign karne wala wohi officer hai jisne supervise kiya — koi aur officer "on behalf" sign nahi kar sakta is rule ke tahat.' }
  ],
  notes:[
    'Rule 222 kisi bhi mode ke baad lagu hai — tender ho, auction ho ya scrap sale.'
  ],
  provisos:[],
  exceptions:[],
  amendment:null,
  traps:[
    { q:'Sale account kaun sign karta hai?', a:'Woh officer jisne sale/auction supervise kiya.' },
    { q:'Kaunsa form?', a:'Form GFR-11 (Rule 217 ka GFR-10 alag hai — woh report of stores for disposal).' }
  ],
  xref:['Rule 217(iii) — Form GFR-10','Rule 223 — sale ke baad profit/loss ka record']
},

/* ══════════════════════ RULE 223 ══════════════════════ */
{
  no:'223', grp:'Write-off', scene:'s10', status:'CURRENT',
  title:'Write-off of losses',
  audio:'assets/audio/rule-223.mp3',
  hook:'Sanction har haal mein · 4 depreciation heads · 5 non-depreciation heads',
  intro:'Rule 223 teen sub-rules mein hai: (1) powers to write off, (2) depreciation wale losses ke 4 heads, (3) depreciation ke alawa wale losses ke 5 heads.',
  tree:[
    { l:2, lab:'Rule 223(1)', tag:'SHALL',
      text:'Powers to write off. All profits and losses due to revaluation, stock-taking or other causes shall be duly recorded and adjusted where necessary. Formal sanction of the competent authority shall be obtained in respect of losses, even though no formal correction or adjustment in government accounts is involved. Powers to write off of losses are available under the Delegation of Financial Powers Rules.',
      ex:'Teen baatein: (1) <b>revaluation, stock-taking ya kisi aur kaaran</b> se hone wale <b>profit aur loss dono</b> record kiye jaayenge aur zaroorat padne par adjust kiye jaayenge; (2) <b>formal sanction</b> competent authority ki leni hogi — <b>chahe government accounts mein koi correction/adjustment ho ya na ho</b>. Yeh aakhri vaakya sabse bada exam trap hai; (3) write-off ki powers <b>DFPR</b> ke tahat hain — GFR khud koi amount nahi batata.' },
    { l:2, lab:'Rule 223(2)', tag:'SHALL — 4 heads',
      text:'Losses due to depreciation: Losses due to depreciation shall be analysed, and recorded under following heads, as applicable :- (i) normal fluctuation of market prices; (ii) normal wear and tear; (iii) lack of foresight in regulating purchases; and (iv) negligence after purchase.',
      ex:'Depreciation se hone wale loss ko <b>chaar heads</b> mein baant kar record karna hai: (i) market price ka normal utaar-chadhav; (ii) normal ghisavat (wear & tear); (iii) kharid regulate karne mein door-andeshi ki kami; (iv) kharid ke baad negligence. Dhyan dein — (iii) aur (iv) "normal" nahi hain, yeh management failures hain, isliye inhein alag head mein dikhana accountability ka hissa hai.' },
    { l:2, lab:'Rule 223(3)', tag:'SHALL — 5 heads',
      text:'Losses not due to depreciation: Losses not due to depreciation shall be grouped under the following heads :- (i) losses due to theft or fraud; (ii) losses due to neglect; (iii) anticipated losses on account of obsolescence of stores or of purchases in excess of requirements; (iv) losses due to damage, and (v) losses due to extra ordinary situations under ‘Force Majeure’ conditions like fire, flood, enemy action, etc.;',
      ex:'Depreciation ke <b>alawa</b> wale losses ke <b>paanch heads</b>: (i) chori ya fraud; (ii) upeksha (neglect); (iii) obsolescence ya zarurat se zyada kharid ki anticipated losses; (iv) damage (nuksan); (v) <b>Force Majeure</b> — aag, baadh, dushman ki karwai jaise extraordinary situations. Force Majeure ka head isliye alag hai kyunki wahan kisi ki personal responsibility nahi hoti.' }
  ],
  notes:[
    'Rule 223(1) ka "even though no formal correction or adjustment in government accounts is involved" — sabse zyada poocha jaane wala line.',
    '4 heads = depreciation · 5 heads = non-depreciation (jismein Force Majeure aakhri hai).'
  ],
  provisos:[],
  exceptions:[
    'Force Majeure (aag, baadh, enemy action) — yeh head batata hai ki har loss mein kisi ki negligence nahi hoti.'
  ],
  amendment:null,
  traps:[
    { q:'Accounts mein koi adjustment nahi hoga to bhi sanction chahiye?', a:'Haan — Rule 223(1) spasht roop se kehta hai "even though no formal correction or adjustment in government accounts is involved".' },
    { q:'Depreciation wale losses ke kitne heads?', a:'4.' },
    { q:'Non-depreciation wale losses ke kitne heads?', a:'5 — aakhri Force Majeure.' },
    { q:'Write-off ki powers kahan hain?', a:'Delegation of Financial Powers Rules (DFPR) — GFR koi amount fix nahi karta.' }
  ],
  xref:['Rules 33–38 — loss reporting chain','Rule 213 — stock-taking jahan se loss nikalta hai','DFPR — write-off powers']
}
];

/* ─────────────── ATOMIC COVERAGE MAP ─────────────── */
/* Har rule ke liye: sub-rule / clause / sub-clause / proviso / note /
   explanation / exception / amendment / related instruction — covered? */
const COVERAGE = [
  { r:'207', sub:'—', clause:'—', note:false, proviso:false, except:true,  amend:false, instr:true,  units:'1 (unnumbered scope rule)' },
  { r:'208', sub:'208(1)', clause:'(i)(ii)(iii)', note:false, proviso:false, except:true,  amend:false, instr:true,  units:'1 sub-rule · 3 clauses' },
  { r:'209', sub:'—', clause:'(i)(ii)(iii)(iv)', note:false, proviso:false, except:false, amend:false, instr:true,  units:'4 clauses' },
  { r:'210', sub:'—', clause:'—', note:false, proviso:false, except:false, amend:false, instr:true,  units:'1 (single para)' },
  { r:'211', sub:'(i)(ii)', clause:'(ii)(a)(b)(c)(d)', note:true, proviso:false, except:false, amend:false, instr:true, units:'2 sub-rules · 4 clauses · 1 note' },
  { r:'212', sub:'—', clause:'—', note:false, proviso:false, except:false, amend:false, instr:true,  units:'1 (single para)' },
  { r:'213', sub:'(1)(2)(3)', clause:'(3)(i)(ii)(iii)', note:false, proviso:false, except:true,  amend:false, instr:true, units:'3 sub-rules · 3 procedure clauses' },
  { r:'214', sub:'—', clause:'—', note:true,  proviso:false, except:true,  amend:false, instr:true,  units:'1 rule + 1 note (surplus presumption)' },
  { r:'215', sub:'(i)(ii)', clause:'—', note:false, proviso:true,  except:true,  amend:false, instr:true, units:'2 clauses · 1 proviso-like condition' },
  { r:'216', sub:'—', clause:'—', note:false, proviso:false, except:false, amend:false, instr:true,  units:'1 (single para)' },
  { r:'217', sub:'(i)–(v)', clause:'—', note:true,  proviso:false, except:true,  amend:false, instr:true, units:'5 clauses + e-waste condition' },
  { r:'218', sub:'(i)–(iv)', clause:'(i)(a)(b)', note:true, proviso:false, except:true,  amend:true,  instr:true, units:'4 clauses · 2 sub-clauses · AMENDED' },
  { r:'219', sub:'(i)(ii)(iii)', clause:'(i)(a)–(i) · (ii)(a)–(g)', note:false, proviso:false, except:true, amend:false, instr:true, units:'3 sub-rules · 9 steps + 7 aspects' },
  { r:'220', sub:'(i)–(v)', clause:'—', note:true,  proviso:false, except:false, amend:false, instr:true, units:'5 clauses' },
  { r:'221', sub:'—', clause:'—', note:false, proviso:false, except:false, amend:false, instr:true,  units:'1 para · 2 stages' },
  { r:'222', sub:'—', clause:'—', note:false, proviso:false, except:false, amend:false, instr:true,  units:'1 (single para)' },
  { r:'223', sub:'(1)(2)(3)', clause:'(2)(i)–(iv) · (3)(i)–(v)', note:false, proviso:false, except:true, amend:false, instr:true, units:'3 sub-rules · 9 heads' }
];

/* ─────────────── CLAUSE-LEVEL EXTRA QUESTIONS ─────────────── */
const QUIZ_EXTRA = [
  { tag:'Rule 208', q:'Under Rule 208(1)(ii), which inspection is mandatory on every receipt from a private supplier?',
    a:['Technical inspection','Visual inspection','Third-party audit','CAG inspection'], c:1,
    e:'Rule 208(1)(ii): sabhi materials ko counted/measured/weighed karne ke saath <b>visual inspection</b> zaroori hai. Technical inspection "where required" hai.' },
  { tag:'Rule 209', q:'Rule 209(iv) deals with —',
    a:['Auction of scrap','Partial compliance of an indent and alternative materials','Write-off of losses','Hiring out of fixed assets'], c:1,
    e:'Rule 209(iv): agar poora indent pura na ho sake to jitna uplabdh hai utna supply karein aur <b>indentor ki copy mein entry</b> karein; alternative material ho to document mein zikr kiya ja sakta hai.' },
  { tag:'Rule 211', q:'The Note under Rule 211 permits Ministries/Departments to —',
    a:['Delete columns from GFR-22','Supplement the prescribed forms with additional details','Replace GFR-23 with any private format','Skip library book registers'], c:1,
    e:'Note: "These forms can be supplemented with additional details by Ministries/Departments as required." Supplement karna hai, replace karna nahi.' },
  { tag:'Rule 213', q:'Rule 213(3)(iii) routes discrepancies identified during verification to —',
    a:['Rules 33 to 38','Rules 217 to 221','Rules 142 to 206','The Central Vigilance Commission'], c:0,
    e:'Rule 213(3)(iii) specifically says action "in accordance with provision given in <b>Rule 33 to 38</b>" — Chapter 2 ka loss-reporting framework.' },
  { tag:'Rule 215', q:'A rare book goes missing from a government library. Under Rule 215(ii) —',
    a:['It is covered by the 5 per 1,000 concession','It must invariably be investigated, irrespective of value','No action is needed if the library has over 50,000 volumes','It can be written off by the librarian'], c:1,
    e:'Rule 215(ii): <b>rare books irrespective of value</b> aur ₹1,000 se upar ki kitaab — dono ki loss ki investigation <b>invariably</b> hogi.' },
  { tag:'Rule 217', q:'Under Rule 217(iii), when the book value cannot be worked out, —',
    a:['The item cannot be disposed of','The original purchase price may be utilised','The reserved price is deemed nil','Ministry of Finance approval is mandatory in every case'], c:1,
    e:'Rule 217(iii) khud fallback deta hai: "the original purchase price of the goods in question <b>may be utilised</b>".' },
  { tag:'Rule 219', q:'How many "broad steps" are listed in Rule 219(i)?',
    a:['6','7','9','11'], c:2,
    e:'Rule 219(i) mein <b>nau</b> steps hain (a) se (i) — aakhri step unsuccessful bidders ki bid security return karna hai.' },
  { tag:'Rule 219', q:'If the highest acceptable responsive bidder cannot lift the entire quantity, the balance may be offered to the next bidder(s) —',
    a:['At any price they quote','At the price offered by the highest acceptable bidder','Only after Ministry of Finance approval','Only through a fresh tender'], c:1,
    e:'Rule 219(ii)(e): remaining quantity next higher bidder(s) ko <b>usi price par</b> offer ki ja sakti hai jo highest acceptable bidder ne offer kiya tha.' },
  { tag:'Rule 220', q:'Earnest money at the fall of the hammer must be —',
    a:['Not less than 10% of bid value, within 7 days','Not less than 25% of bid value, immediately on the spot','The full bid value within 24 hours','At the discretion of the auctioneer'], c:1,
    e:'Rule 220(iv): <b>not less than 25%</b> of bid value, <b>immediately on the spot</b>, cash ya DACR (Ministry/Department ke favour mein).' },
  { tag:'Rule 221', q:'Which two conditions must be satisfied before selling at scrap value?',
    a:['Cabinet approval and CAG concurrence','Prior failure of advertised tender/auction attempts; then competent authority approval in consultation with Finance division','Ministry of Finance approval and re-tender','Public notice and police verification'], c:1,
    e:'Rule 221: pehle tender+auction dono try karne honge, phir <b>competent authority approval in consultation with Finance division</b>.' },
  { tag:'Rule 222', q:'The sale account under Rule 222 must be signed by —',
    a:['The Head of the Department','The officer who supervised the sale or auction','The successful bidder','The Pay and Accounts Officer'], c:1,
    e:'Rule 222: Form GFR-11, "duly signed by the <b>officer who supervised the sale or auction</b>".' },
  { tag:'Rule 223', q:'Which of these is NOT one of the four heads for losses due to depreciation?',
    a:['Normal fluctuation of market prices','Normal wear and tear','Losses due to theft or fraud','Negligence after purchase'], c:2,
    e:'Theft/fraud <b>Rule 223(3)(i)</b> mein aata hai — non-depreciation wala head. Depreciation ke 4 heads hain: market fluctuation, wear & tear, lack of foresight in purchases, negligence after purchase.' },
  { tag:'Rule 218', q:'Rule 218(iii) covers expired medicines, food grain and ammunition. The rule requires —',
    a:['Sale by advertised tender above ₹4 lakh','Immediate disposal or destruction by a suitable mode','Storage for three years before disposal','Transfer to another department'], c:1,
    e:'Rule 218(iii): hazardous ya human consumption ke layak na hone wale items ko <b>turant</b> dispose/destroy karein — health hazard, pollution aur misuse se bachne ke liye. Threshold in par lagu nahi.' },
  { tag:'Rule 218', q:'Security-sensitive items such as currency, stamps, receipt books and security press must be disposed of/destroyed keeping in view —',
    a:['Only the highest price realised','Rules relating to official secrets as well as financial prudence','The E-Waste (Management) Rules, 2022','The Public Records Act, 1993'], c:1,
    e:'Rule 218(iv): "to ensure compliance with rules relating to <b>official secrets</b> as well as <b>financial prudence</b>".' }
];

if (typeof QUIZ !== 'undefined') { QUIZ.push(...QUIZ_EXTRA); }
