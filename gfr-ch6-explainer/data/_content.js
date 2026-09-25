/* Content check for studio clips.
   The mapping tests (_verify.js / _e2e.js) can only prove that a clip FILE exists
   for each segment. They cannot prove the file holds the RIGHT narration. Two real
   defects slipped past them: after the Rule 144/173 fix seven clips were stale, and
   audio/v-186.mp3 had been reported as successfully generated while actually being
   about 40% of the length its caption required.

   This test derives, for every segment, the exact speech text the player will
   caption it with, then checks the clip's size is consistent with that text.

   Every rule clip shares one codec (MPEG-2 Layer III, 64 kbps, 24 kHz, mono), so
   duration is exactly proportional to file size, and bytes-per-character is a
   reliable length proxy. The band is calibrated from the corpus itself rather than
   hard-coded, and module intros / callouts are measured separately because they
   were recorded at a different rate.

   Usage: node data/_content.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

/* ---------- read the player's own segmentation ---------- */
const html = fs.readFileSync(path.join(ROOT, 'granular-video.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const mk = () => ({
  innerHTML: '', textContent: '', style: {}, dataset: {}, children: [],
  classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
  querySelectorAll() { return []; }, querySelector() { return null; },
  scrollIntoView() {}, addEventListener() {}, appendChild() {}, setAttribute() {}
});
const cache = {};
const document = {
  getElementById(id) { return cache[id] || (cache[id] = mk()); },
  querySelector() { return mk(); }, querySelectorAll() { return []; },
  createElement() { return mk(); }, body: mk(), addEventListener() {}
};
const sandbox = {
  window: {}, document, $: id => document.getElementById(id), $$: () => [],
  localStorage: { getItem: () => null, setItem() {} },
  Audio: function () { return { src: '', playbackRate: 1, currentTime: 0, duration: 0,
    play() { return Promise.resolve(); }, pause() {}, load() {} }; },
  speechSynthesis: null, console, setTimeout, clearTimeout, setInterval, clearInterval,
  navigator: { userAgent: 'test' }, location: { search: '' }
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['data/ch6-goods.js', 'data/ch6-services.js', 'data/studio.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
vm.runInContext(script + '\nglobalThis.__test={segments:segments};',
  sandbox, { filename: 'granular-video.html' });
const { segments } = sandbox.__test;

/* ---------- collect size vs caption length ---------- */
const rules = [];      /* rule narration clips  (v-*.mp3) */
const extras = [];     /* module intros + callouts (g-*.mp3) */
for (const s of segments) {
  if (!s.audio) continue;
  const f = path.join(ROOT, s.audio);
  if (!fs.existsSync(f)) continue;
  const rec = { file: s.audio, chars: s.chars, bytes: fs.statSync(f).size };
  rec.bpc = rec.bytes / rec.chars;
  (path.basename(s.audio).startsWith('g-') ? extras : rules).push(rec);
}

const pct = (arr, p) => arr[Math.floor(p * (arr.length - 1))].bpc;
function report(name, arr) {
  const a = arr.slice().sort((x, y) => x.bpc - y.bpc);
  const lo = pct(a, 0.05), hi = pct(a, 0.95);
  console.log(name.padEnd(22) + ' n=' + String(a.length).padStart(3) +
    '  bytes/char  p5=' + lo.toFixed(1) + '  median=' + pct(a, 0.5).toFixed(1) +
    '  p95=' + hi.toFixed(1));
  /* a clip under half the p5, or over 1.6x the p95, cannot match its caption */
  const bad = a.filter(r => r.bpc < lo * 0.5 || r.bpc > hi * 1.6);
  return bad;
}

console.log('=== calibrated size bands ===');
const badRules = report('rule clips (v-*)', rules);
const badExtras = report('intros/callouts (g-*)', extras);

console.log('\n=== outliers ===');
if (!badRules.length && !badExtras.length) console.log('  none');
badRules.forEach(r => console.log('  ' + r.file + ' — chars=' + r.chars +
  ' bytes=' + r.bytes + ' bpc=' + r.bpc.toFixed(1)));
badExtras.forEach(r => console.log('  ' + r.file + ' — chars=' + r.chars +
  ' bytes=' + r.bytes + ' bpc=' + r.bpc.toFixed(1)));

/* ---------- also confirm nothing is missing ---------- */
const missing = segments.filter(s => s.audio && !fs.existsSync(path.join(ROOT, s.audio)))
  .map(s => s.audio);
console.log('\nmissing files        : ' + (missing.length ? missing.join(', ') : 'none'));
console.log('\nCONTENT CHECK: ' +
  ((badRules.length || badExtras.length || missing.length) ? 'FAIL' : 'PASS'));
process.exit((badRules.length || badExtras.length || missing.length) ? 1 : 0);
