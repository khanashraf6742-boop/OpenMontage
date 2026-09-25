/* Renders chapter6-complete.html's own inline script against the real data with a
   DOM stub, then asserts the written reference shows every rule and every provision.
   The page loads data/ch6-goods.js and data/ch6-services.js, so a fix to the data
   propagates here automatically - this test proves it actually does.
   Usage: node data/_ref.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

const html = fs.readFileSync(path.join(ROOT, 'chapter6-complete.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

/* The page builds cards with document.createElement and sets innerHTML on them,
   so capture every element's innerHTML as it is assigned. */
let out = '';
function mkEl() {
  const e = {
    className: '', textContent: '', style: {}, dataset: {}, onclick: null,
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    querySelector() { return mkEl(); },
    querySelectorAll() { return []; },
    addEventListener() {}, appendChild() {}, remove() {},
    insertAdjacentHTML() {}, closest() { return mkEl(); }, scrollIntoView() {}
  };
  Object.defineProperty(e, 'innerHTML', {
    set(v) { out += String(v); },
    get() { return ''; }
  });
  return e;
}
const document = {
  createElement: () => mkEl(),
  querySelector: () => mkEl(),
  querySelectorAll: () => [],
  getElementById: () => mkEl(),
  body: mkEl(),
  addEventListener() {}
};
const sandbox = {
  window: {}, document, $: () => mkEl(),
  localStorage: { getItem: () => null, setItem() {} },
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  navigator: { userAgent: 'test' }, location: { search: '' }
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['data/ch6-goods.js', 'data/ch6-services.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
vm.runInContext(script, sandbox, { filename: 'chapter6-complete.html' });

const rules = [...sandbox.window.GFR_CH6_GOODS, ...sandbox.window.GFR_CH6_SERVICES];
const text = out.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const missingRule = rules.filter(r => !text.includes('Rule ' + r.r));
const mustHave = [
  ['Rule 144(x) land-border restrictions', 'defence of India'],
  ['Rule 144(x) order number', 'F.7/10/2021-PPD'],
  ['Rule 173(ii) catch-all clause', 'Any other information'],
  ['Rule 173(ix) clear specifications', 'without any ambiguity'],
  ['Rule 173(ix) broad-based specs', 'broad based']
];
const missingMust = mustHave.filter(([, needle]) => !text.includes(needle));

const missingSub = [];
rules.forEach(r => (r.subs || []).forEach(s => { if (!out.includes(s.n)) missingSub.push(s.n); }));
const missingBox = [];
rules.forEach(r => {
  (r.prov || []).forEach((p, i) => { if (!out.includes(p.slice(0, 40))) missingBox.push(r.r + ' proviso ' + (i + 1)); });
  (r.note || []).forEach((p, i) => { if (!out.includes(p.slice(0, 40))) missingBox.push(r.r + ' note ' + (i + 1)); });
  (r.ex || []).forEach((p, i) => { if (!out.includes(p.slice(0, 40))) missingBox.push(r.r + ' exception ' + (i + 1)); });
  (r.fn || []).forEach((p, i) => { if (!out.includes(p.slice(0, 40))) missingBox.push(r.r + ' footnote ' + (i + 1)); });
});

console.log('rules in data             : ' + rules.length);
console.log('rendered card text (chars): ' + text.length);
console.log('rules not rendered        : ' + (missingRule.map(r => r.r).join(', ') || 'none'));
console.log('required text absent      : ' + (missingMust.map(m => m[0]).join(', ') || 'none'));
console.log('sub-rules not rendered    : ' + (missingSub.length ? missingSub.join(', ') : 'none'));
console.log('proviso/note/exc/fn absent: ' + (missingBox.length ? missingBox.join(', ') : 'none'));

const ok = !missingRule.length && !missingMust.length && !missingSub.length && !missingBox.length;
console.log('\nWRITTEN REFERENCE CHECK: ' + (ok ? 'PASS' : 'FAIL'));
process.exit(ok ? 0 : 1);
