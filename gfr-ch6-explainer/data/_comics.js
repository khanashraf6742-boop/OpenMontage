/* Comics check: index.html and services.html carry their own hand-written
   narration and rule cards, separate from the data files the video and the
   written reference read. Nothing has ever checked those figures.

   Extracts every rupee amount, percentage, duration and rule reference from each
   comic's visible text and matches it against the verbatim rule text in the data
   files - the authority. A figure that appears in no rule's verbatim text, or a
   rule number outside Chapter 6's range of 142-206, is a candidate error.

   Cross-rule references are fine, so a figure supported by a different rule is
   reported separately rather than as an error.

   Usage: node data/_comics.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

/* ---------- verbatim corpus from the data files ---------- */
const sandbox = { window: {}, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['data/ch6-goods.js', 'data/ch6-services.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
const RULES = [...sandbox.window.GFR_CH6_GOODS, ...sandbox.window.GFR_CH6_SERVICES];
const RULE_NUMS = RULES.map(r => r.r);

const WORDNUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40,
  'forty-five': 45, fortyfive: 45, fifty: 50, sixty: 60, seventy: 70, eighty: 80,
  ninety: 90, hundred: 100 };
const expand = s => String(s).replace(/(\d+(?:\.\d+)?)\s*(lakh|crore)/g,
  (m, n, u) => String(Math.round(parseFloat(n) * (u === 'crore' ? 10000000 : 100000))));
function norm(s) {
  let t = expand(String(s || '')
    .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;/g, '-')
    .replace(/&nbsp;/g, ' ').replace(/&#8377;/g, ' rupees ').replace(/₹/g, ' rupees ')
    .toLowerCase());
  t = t.replace(/\b(forty[\s-]?five|sixty|thirty|forty|fifty|twenty|twelve|eleven|ten|nine|eight|seven|six|five|four|three|two|one)\b/g,
    m => WORDNUM[m.replace(/[\s-]/g, '')] || m)
    .replace(/per\s*cent/g, 'percent')
    .replace(/(\d),(\d{2,3})(?=\D|$)/g, '$1$2')
    .replace(/(\d),(\d{3})(?=\D|$)/g, '$1$2');
  return t.replace(/\s+/g, ' ').trim();
}
const VERB = RULES.map(r => norm([r.text, ...(r.subs || []).map(s => s.text),
  ...(r.prov || []), ...(r.note || []), ...(r.ex || []), ...(r.fn || [])].join(' . ')))
  .join(' \n ');

/* ---------- visible text of a comic ---------- */
function visible(f) {
  let t = fs.readFileSync(path.join(ROOT, f), 'utf8')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return t.replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ')
    .replace(/&#8377;/g, ' rupees ').replace(/₹/g, ' rupees ')
    .replace(/\s+/g, ' ').trim();
}

const PATTERNS = [
  ['rupee amount', /(?:rupees?|rs\.?)\s*([\d,]+(?:\s*(?:lakh|crore|thousand|million|only))?)/g],
  ['percentage', /(\d+(?:\.\d+)?)\s*(?:%|per\s*cent|percent)/g],
  ['duration', /(\d+)\s*(days?|months?|years?|weeks?)/g],
  ['order number', /\b([a-z]\.\d+\/\d+\/\d{4}-[a-z]{3})\b/g],
  ['rule range', /rules?\s*(\d{2,3})\s*(?:-|to|–|—)\s*(\d{2,3})/g],
  ['rule ref', /rule\s*(\d{2,3}(?:\(\d+\))?(?:\([ivx]+\))?)/g]
];

const bad = [], warn = [];
['index.html', 'services.html'].forEach(f => {
  const txt = norm(visible(f));
  PATTERNS.forEach(([label, re]) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(txt)) !== null) {
      if (label === 'rule range') {
        const lo = parseInt(m[1], 10), hi = parseInt(m[2], 10);
        if (lo < 142 || hi > 206 || lo > hi) {
          bad.push({ f, label, raw: m[0], ctx: txt.slice(Math.max(0, m.index - 90), m.index + 90) });
        }
        continue;
      }
      if (label === 'rule ref') {
        const n = m[1].split('(')[0];
        if (parseInt(n, 10) < 142 || parseInt(n, 10) > 206) {
          bad.push({ f, label, raw: m[0], ctx: txt.slice(Math.max(0, m.index - 90), m.index + 90) });
        }
        continue;
      }
      const raw = expand(m[1].replace(/,/g, '')).trim();
      if (!raw) continue;
      if (VERB.includes(raw)) continue;
      warn.push({ f, label, raw, ctx: txt.slice(Math.max(0, m.index - 90), m.index + 90) });
    }
  });
});

console.log('rule numbers in data   : ' + RULE_NUMS.length + ' (' + RULE_NUMS[0] + '-' + RULE_NUMS[RULE_NUMS.length - 1] + ')');
console.log('rule refs outside Ch.6 : ' + bad.length);
bad.forEach(b => { console.log('  !! ' + b.f + ' [' + b.label + ' = ' + b.raw + ']'); console.log('       ...' + b.ctx + '...'); });
console.log('figures not in verbatim: ' + warn.length);
warn.forEach(b => { console.log('  !! ' + b.f + ' [' + b.label + ' = ' + b.raw + ']'); console.log('       ...' + b.ctx + '...'); });

/* Both tiers are hard failures here. The comics carry no verbatim layer of their
   own - every figure in them is hand-written - and every figure they currently
   use does appear in the verbatim rule text, so a miss is a defect, not a
   stylistic difference. */
const problems = bad.length + warn.length;
console.log('\nCOMICS CHECK: ' + (problems ? 'FAIL' : 'PASS'));
process.exit(problems ? 1 : 0);
