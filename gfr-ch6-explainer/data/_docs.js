/* Generates the Markdown knowledge base that Anything LLM, Dify and the other
   agent platforms ingest. One file per rule, plus an index, an amendment trail
   and a single combined file for platforms that prefer one document.

   Run from the deliverable directory:  node data/_docs.js
   Output: docs/*.md  (regenerated, so never edit by hand) */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs');

const sandbox = { window: {}, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['data/ch6-goods.js', 'data/ch6-services.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
const GOODS = sandbox.window.GFR_CH6_GOODS;
const SVCS = sandbox.window.GFR_CH6_SERVICES;
const RULES = [...GOODS, ...SVCS];

const clean = s => String(s || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#9654;/g, '')
  .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const slug = r => 'rule-' + r.replace(/[()]/g, '-');
const part = r => GOODS.includes(r) ? 'A — Procurement of Goods' : 'B — Procurement of Services';

/* a rule renders as: front matter, verbatim, Hinglish, sub-rules, boxes */
function renderRule(r) {
  const L = [];
  L.push('---');
  L.push('rule: "' + r.r + '"');
  L.push('title: "' + clean(r.t).replace(/"/g, "'") + '"');
  L.push('part: "' + part(r) + '"');
  L.push('sub_rules: ' + (r.subs || []).length);
  L.push('provisos: ' + (r.prov || []).length);
  L.push('notes: ' + (r.note || []).length);
  L.push('exceptions: ' + (r.ex || []).length);
  L.push('footnotes: ' + (r.fn || []).length);
  L.push('source: "GFR 2017, Department of Expenditure, Ministry of Finance — updated to 31.01.2026"');
  L.push('---');
  L.push('');
  L.push('# Rule ' + r.r + ' — ' + clean(r.t));
  L.push('');
  L.push('*Part ' + part(r) + ' · GFR 2017 Chapter 6*');
  L.push('');
  L.push('## Verbatim text');
  L.push('');
  L.push(clean(r.text));
  L.push('');
  L.push('## Samajhne mein aasan (Hinglish)');
  L.push('');
  L.push(clean(r.hi));
  (r.subs || []).forEach(s => {
    L.push('');
    L.push('## ' + clean(s.n));
    L.push('');
    L.push('**Verbatim:** ' + clean(s.text));
    if (s.hi) { L.push(''); L.push('**Hinglish:** ' + clean(s.hi)); }
  });
  if ((r.prov || []).length) {
    L.push(''); L.push('## Proviso');
    (r.prov || []).forEach(p => { L.push(''); L.push(clean(p)); });
  }
  if ((r.note || []).length) {
    L.push(''); L.push('## Note / Explanation');
    (r.note || []).forEach(p => { L.push(''); L.push(clean(p)); });
  }
  if ((r.ex || []).length) {
    L.push(''); L.push('## Exception');
    (r.ex || []).forEach(p => { L.push(''); L.push(clean(p)); });
  }
  if ((r.fn || []).length) {
    L.push(''); L.push('## Amendment footnote');
    (r.fn || []).forEach(p => { L.push(''); L.push(clean(p)); });
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push('Related: Chapter 6 covers Rules 142–206. Rule 206 says circumstances not covered by Rules 198–205 fall back to Rules 142–176 (procurement of goods), **not** the consulting-services rules.');
  L.push('');
  return L.join('\n');
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const bodies = [];
RULES.forEach(r => {
  const md = renderRule(r);
  fs.writeFileSync(path.join(OUT, slug(r.r) + '.md'), md);
  bodies.push(md);
});

/* index */
const idx = [];
idx.push('# GFR 2017 — Chapter 6 · Procurement of Goods and Services');
idx.push('');
idx.push('Machine-readable knowledge base covering **every rule, sub-rule, clause, proviso,');
idx.push('explanation, exception and amendment footnote** of Chapter 6 (Rules 142–206).');
idx.push('');
idx.push('Source: Department of Expenditure, Ministry of Finance — GFR 2017 compilation updated to');
idx.push('31.01.2026. The 10.07.2024 amendments (OM No. F.1/3/2024-PPD) are in force.');
idx.push('');
idx.push('| Rule | Title | Sub-rules | Proviso | Note | Exception | Footnote | File |');
idx.push('|---|---|---|---|---|---|---|---|');
RULES.forEach(r => idx.push('| ' + r.r + ' | ' + clean(r.t) + ' | ' + (r.subs || []).length +
  ' | ' + (r.prov || []).length + ' | ' + (r.note || []).length + ' | ' + (r.ex || []).length +
  ' | ' + (r.fn || []).length + ' | [' + slug(r.r) + '.md](' + slug(r.r) + '.md) |'));
idx.push('');
idx.push('## Totals');
idx.push('');
idx.push('- Rules: **' + RULES.length + '** (37 goods, Rules 142–176 · 30 services, Rules 177–206)');
idx.push('- Sub-rules / clauses: **' + RULES.reduce((a, r) => a + (r.subs || []).length, 0) + '**');
idx.push('- Provisos: **' + RULES.reduce((a, r) => a + (r.prov || []).length, 0) + '**');
idx.push('- Notes / explanations: **' + RULES.reduce((a, r) => a + (r.note || []).length, 0) + '**');
idx.push('- Exceptions: **' + RULES.reduce((a, r) => a + (r.ex || []).length, 0) + '**');
idx.push('- Amendment footnotes: **' + RULES.reduce((a, r) => a + (r.fn || []).length, 0) + '**');
idx.push('');
idx.push('## Structure');
idx.push('');
idx.push('- **Part A — Procurement of Goods:** Rules 142–176');
idx.push('- **Part B — Procurement of Services:** Rules 177–196 (A. Consulting Services), Rules 197–206 (B. Outsourcing of Services)');
idx.push('');
fs.writeFileSync(path.join(OUT, 'index.md'), idx.join('\n'));

/* amendment trail */
const am = ['# Amendment & footnote trail affecting Chapter 6', ''];
RULES.forEach(r => (r.fn || []).forEach(f => { am.push('- **Rule ' + r.r + '** — ' + clean(f)); }));
am.push('');
fs.writeFileSync(path.join(OUT, 'amendments.md'), am.join('\n'));

/* single combined file for platforms that prefer one document */
const all = ['# GFR 2017 — Chapter 6 (Rules 142–206) · Complete Reference', '',
  'Source: Department of Expenditure, Ministry of Finance — GFR 2017 updated to 31.01.2026.', '',
  'Every rule, sub-rule, clause, proviso, explanation, exception and amendment footnote,', '',
  'verbatim plus a plain Hinglish explanation of each.', '', '---', '']
  .concat(bodies);
fs.writeFileSync(path.join(OUT, 'gfr-chapter-6-complete.md'), all.join('\n'));

console.log('docs written to ' + path.relative(ROOT, OUT) + '/');
console.log('  rule files : ' + RULES.length);
console.log('  index.md   : ' + idx.length + ' lines');
console.log('  amendments.md: ' + (am.length - 1) + ' footnotes');
console.log('  gfr-chapter-6-complete.md: ' + all.length + ' lines, ' +
  fs.statSync(path.join(OUT, 'gfr-chapter-6-complete.md')).size + ' bytes');
