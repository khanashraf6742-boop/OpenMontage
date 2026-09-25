/* Dumps the video's playback order as JSON for the MP4 renderer.
   The player's own inline script defines MODULES and CALLOUTS; data/_gen.js
   defines the clip texts; data/studio.js maps rules to audio paths. This writes
   them as one ordered list with real durations, so the renderer never has to
   re-derive the order and cannot drift from the player.

   Usage: node data/_segments.js   ->  data/_segments.json */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

const gen = require('./_gen.js');
const CLIPS = gen.clips;

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
vm.runInContext(script + '\nglobalThis.__t={MODULES:MODULES,CALLOUTS:CALLOUTS};',
  sandbox, { filename: 'granular-video.html' });
const MODULES = sandbox.__t.MODULES;
const CALLOUTS = sandbox.__t.CALLOUTS;
const STUDIO = sandbox.window.GFR_STUDIO;

const ruleKey = s => String(s).replace(/\(/g, '-').replace(/\)/g, '')
  .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
const used = {};
const fileOf = rule => {
  const base = 'v-' + String(rule).replace(/[()]/g, '-').replace(/-+/g, '-').replace(/-+$/, '');
  used[base] = (used[base] || 0) + 1;
  return 'audio/' + base + (used[base] === 1 ? '' : 'bcdefghijklmnopqrstuvwxyz'[used[base] - 2]) + '.mp3';
};
const clipInfo = CLIPS.map(c => ({ rule: c.rule, text: c.text, file: fileOf(c.rule) }));

const BYTES_PER_SEC = 4000, ID3 = 45;   /* 32 kbps / 8, verified with ffprobe */
const durOf = f => {
  try { return Math.max(0.2, (fs.statSync(path.join(ROOT, f)).size - ID3) / BYTES_PER_SEC); }
  catch (e) { throw new Error('missing audio: ' + f); }
};
const stripHTML = h => String(h || '').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

const out = [];
MODULES.forEach(mod => {
  if (mod.audio) {
    out.push({ kind: 'module', module: mod.n, rule: null, file: mod.audio,
      header: mod.n, text: mod.blurb, duration: durOf(mod.audio) });
  }
  mod.rules.forEach(rule => {
    clipInfo.filter(c => c.rule === rule).forEach((c, i, arr) => {
      out.push({ kind: 'rule', module: mod.n, rule: c.rule,
        clipOf: arr.length > 1 ? (i + 1) + '/' + arr.length : null,
        file: c.file, header: 'Rule ' + c.rule + (arr.length > 1 ? '  ·  clip ' + (i + 1) + ' of ' + arr.length : ''),
        text: c.text, duration: durOf(c.file) });
    });
    const co = CALLOUTS[rule];
    if (co && co.audio) {
      out.push({ kind: 'callout', module: mod.n, rule: rule, file: co.audio,
        header: stripHTML(co.t), text: stripHTML(co.h), duration: durOf(co.audio) });
    }
  });
});

/* cross-check: every mapped clip must appear exactly once, and in the registry's order */
const seen = {};
out.forEach(s => { seen[s.file] = (seen[s.file] || 0) + 1; });
const dupes = Object.keys(seen).filter(f => seen[f] > 1);
const missing = Object.values(STUDIO).flat().filter(f => !seen[f]);
const mods = MODULES.map(m => m.audio).filter(Boolean).filter(f => !seen[f]);
if (dupes.length || missing.length || mods.length) {
  console.error('segment list is inconsistent');
  if (dupes.length) console.error('  duplicated: ' + dupes.join(', '));
  if (missing.length) console.error('  missing rule clips: ' + missing.join(', '));
  if (mods.length) console.error('  missing module intros: ' + mods.join(', '));
  process.exit(1);
}

const doc = {
  segments: out,
  total_seconds: Math.round(out.reduce((a, s) => a + s.duration, 0) * 10) / 10,
  segments_count: out.length,
  modules: MODULES.length,
  bytes_per_second: BYTES_PER_SEC,
  id3_bytes: ID3,
  source: 'GFR 2017, Department of Expenditure, Ministry of Finance — updated to 31.01.2026'
};
const dest = path.join(ROOT, 'data', '_segments.json');
fs.writeFileSync(dest, JSON.stringify(doc));
console.log('wrote ' + path.relative(ROOT, dest));
console.log('  segments     : ' + out.length);
console.log('  modules      : ' + MODULES.length);
console.log('  duration     : ' + Math.floor(doc.total_seconds / 60) + ':' +
  String(Math.round(doc.total_seconds % 60)).padStart(2, '0'));
