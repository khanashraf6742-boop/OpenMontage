/* Figures check: every rupee amount, percentage and time limit that appears in the
   Hinglish commentary must be traceable to the verbatim text of the rules.

   The narration for each rule is verbatim rule text PLUS the 'hi' (Hinglish)
   commentary fields. The verbatim layer is transcribed from the official GFR
   compilation, so it is trusted. The Hinglish layer is hand-written, so a
   threshold could drift there - a wrong figure in a plain-language explanation is
   exactly the kind of error a reader will act on.

   Two tiers of result, because a figure can legitimately come from a connected rule:
     INVENTED  - appears in the commentary of one rule and in NO rule's verbatim text.
                 This is the tier that matters; each one is a factual error.
     CROSS-RULE - appears in another rule's verbatim but not this one. Usually fine,
                 often exactly the "connected provision" the user asked us to name,
                 but listed so it can be eyeballed.

   Usage: node data/_figures.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

const WORDNUM = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40,
  fortyfive: 45, 'forty-five': 45, fifty: 50, sixty: 60, seventy: 70, eighty: 80,
  ninety: 90, hundred: 100
};
/* Indian digit grouping: 10 lakh = 10,00,000 = 1000000 */
function expandIndian(s) {
  return String(s).replace(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|crore|crores)/g,
    (m, n, u) => String(Math.round(parseFloat(n) * (u.startsWith('crore') ? 10000000 : 100000))));
}
function norm(s) {
  let t = String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#9654;/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&#8377;/g, ' rupees ')
    .replace(/₹/g, ' rupees ')
    .toLowerCase();
  t = expandIndian(t);
  /* spelled-out numbers -> digits, so "forty-five days" matches "45 days" */
  t = t.replace(/\b(forty[\s-]?five|sixty|thirty|forty|fifty|twenty|twelve|eleven|ten|nine|eight|seven|six|five|four|three|two|one)\b/g,
    m => WORDNUM[m.replace(/\s+/g, '')] || WORDNUM[m.replace(/[\s-]/g, '')] || m);
  /* "forty per cent" -> "40 percent"; drop thousands separators */
  t = t.replace(/per\s*cent/g, 'percent')
    .replace(/(\d),(\d{2,3})(?=\D|$)/g, '$1$2')
    .replace(/(\d),(\d{3})(?=\D|$)/g, '$1$2');
  return t.replace(/\s+/g, ' ').trim();
}

const sandbox = { window: {}, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['data/ch6-goods.js', 'data/ch6-services.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
const RULES = [...sandbox.window.GFR_CH6_GOODS, ...sandbox.window.GFR_CH6_SERVICES];

const verbatimOf = r => norm([r.text,
  ...(r.subs || []).map(s => s.text), ...(r.prov || []), ...(r.note || []),
  ...(r.ex || []), ...(r.fn || [])].join(' . '));
const commentaryOf = r => norm([r.hi, ...(r.subs || []).map(s => s.hi || '')].filter(Boolean).join(' . '));

const GLOBAL_VERBATIM = RULES.map(verbatimOf).join(' \n ');

/* money, percentage, duration and order-number figures */
const PATTERNS = [
  ['rupee amount', /(?:rupees?|rs\.?)\s*([\d.]+(?:\s*(?:lakh|crore|thousand|million|only))?)/g],
  ['percentage', /(\d+(?:\.\d+)?)\s*(?:%|percent)/g],
  ['duration', /(\d+)\s*(days?|months?|years?|weeks?)/g],
  ['order number', /\b([a-z]\.\d+\/\d+\/\d{4}-[a-z]{3})\b/g]
];

const invented = [], crossRule = [];
RULES.forEach(r => {
  const verb = verbatimOf(r);
  const comm = commentaryOf(r);
  if (!comm) return;
  PATTERNS.forEach(([label, re]) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(comm)) !== null) {
      const raw = expandIndian(m[1].replace(/,/g, '')).replace(/\s+/g, ' ').trim();
      if (!raw || verb.includes(raw)) continue;
      const rec = { rule: r.r, title: r.t, label, raw,
        ctx: comm.slice(Math.max(0, m.index - 70), m.index + 90) };
      if (GLOBAL_VERBATIM.includes(raw)) crossRule.push(rec); else invented.push(rec);
    }
  });
});

console.log('rules scanned        : ' + RULES.length);
console.log('invented figures     : ' + invented.length);
invented.forEach(f => {
  console.log('  !! R' + f.rule + ' [' + f.label + ' = ' + f.raw + '] ' + f.title);
  console.log('       ...' + f.ctx + '...');
});
console.log('cross-rule figures   : ' + crossRule.length);
crossRule.forEach(f => console.log('   ~ R' + f.rule + ' [' + f.label + ' = ' + f.raw + ']' +
  ' — supported by another rule, not this one: ...' + f.ctx + '...'));

console.log('\nFIGURES CHECK: ' + (invented.length ? 'FAIL' : 'PASS'));
process.exit(invented.length ? 1 : 0);
