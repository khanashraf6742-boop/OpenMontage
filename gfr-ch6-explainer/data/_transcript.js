/* Writes the full narration transcript of the granular video, in playback order,
   with real per-clip durations computed from each MP3's size.

   Every clip is MPEG-2 Layer III, 64 kbps, 24 kHz mono, so duration is exactly
   (bytes - 45) / 8000. The timestamps let a reader follow along with the video
   and check that a caption is not running ahead of the audio.

   The clip texts come from data/_gen.js, which reconstructs exactly the beat and
   greedy-split logic the player uses - the same texts that were recorded. The
   audio paths come from data/studio.js, in order.

   Usage: node data/_transcript.js   ->  docs/narration-transcript.md */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

/* ---------- clip texts, in global clip order ---------- */
const gen = require('./_gen.js');           /* {clips:[{rule,text}], RULES} */
const CLIPS = gen.clips;                    /* 124, global order */

/* ---------- module structure and playback order ---------- */
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

/* the callout narration is stored as HTML - strip it for the transcript */
const stripHTML = h => String(h || '').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const STUDIO = sandbox.window.GFR_STUDIO;

/* ---------- audio path for the n-th clip of a rule ---------- */
const used = {};
const fileOf = rule => {
  const base = 'v-' + String(rule).replace(/[()]/g, '-').replace(/-+/g, '-').replace(/-+$/, '');
  used[base] = (used[base] || 0) + 1;
  const suffix = used[base] === 1 ? '' : 'bcdefghijklmnopqrstuvwxyz'[used[base] - 2];
  return 'audio/' + base + suffix + '.mp3';
};

/* walk the global clip list once, so every rule's clips keep one stable sequence */
const clipInfo = CLIPS.map(c => {
  const f = fileOf(c.rule);
  const mapped = (STUDIO[c.rule] || [])[used['v-' + String(c.rule).replace(/[()]/g, '-')
    .replace(/-+/g, '-').replace(/-+$/, '')] - 1];
  return { rule: c.rule, text: c.text, file: f, mapped: mapped };
});

/* every clip must be the one the player maps - a mismatch means the registry
   and the generator have drifted apart */
const drift = clipInfo.filter(c => c.mapped && c.mapped !== c.file);

const BYTES_PER_SEC = 4000;      /* 32 kbps / 8, verified with ffprobe */
const ID3 = 45;                  /* ID3v2 tag on every clip */
const durOf = f => {
  try { return Math.max(0, (fs.statSync(path.join(ROOT, f)).size - ID3) / BYTES_PER_SEC); }
  catch (e) { return 0; }
};
const mmss = s => {
  const t = Math.round(s);
  return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
};

const L = [];
L.push('# GFR 2017 Chapter 6 — full narration transcript');
L.push('');
L.push('Everything the granular video says, in playback order, with real per-clip durations');
L.push('computed from each MP3\'s size (every clip is MPEG-2 Layer III, 64 kbps, 24 kHz mono,');
L.push('so duration is exactly (bytes − 45) / 4000).');
L.push('');
L.push('Source: Department of Expenditure, Ministry of Finance — GFR 2017 compilation updated');
L.push('to 31.01.2026. The 10.07.2024 amendments (OM No. F.1/3/2024-PPD) are in force.');
L.push('');

let clock = 0;
const seen = new Set();
MODULES.forEach(mod => {
  L.push('---');
  L.push('');
  L.push('## ' + mod.n);
  L.push('');
  L.push('*' + mod.blurb + '*');
  L.push('');
  L.push('Rules covered: ' + mod.rules.join(', '));
  L.push('');
  if (mod.audio) {
    const d = durOf(mod.audio);
    L.push('### ▶ Module intro  ·  ' + mmss(clock) + ' → ' + mmss(clock + d) +
      '  ·  `' + mod.audio + '`');
    L.push('');
    L.push(mod.blurb);
    L.push('');
    clock += d;
    seen.add(mod.audio);
  }
  mod.rules.forEach(rule => {
    clipInfo.filter(c => c.rule === rule).forEach((c, i, arr) => {
      const d = durOf(c.file);
      L.push('### Rule ' + c.rule + (arr.length > 1 ? ' — clip ' + (i + 1) + ' of ' + arr.length : '') +
        '  ·  ' + mmss(clock) + ' → ' + mmss(clock + d) + '  ·  `' + c.file + '`');
      L.push('');
      L.push('> ' + c.text.replace(/\n/g, '\n> '));
      L.push('');
      clock += d;
      seen.add(c.file);
    });
    const co = CALLOUTS[rule];
    if (co && co.audio) {
      const d = durOf(co.audio);
      L.push('### ' + co.t + '  ·  ' + mmss(clock) + ' → ' + mmss(clock + d) +
        '  ·  `' + co.audio + '`');
      L.push('');
      L.push('> ' + stripHTML(co.h));
      L.push('');
      clock += d;
      seen.add(co.audio);
    }
  });
});

/* callouts are not in any module's rule list - append so nothing is lost */
const allFiles = Object.values(STUDIO).flat()
  .concat(MODULES.map(m => m.audio).filter(Boolean))
  .concat(Object.values(CALLOUTS).map(c => c.audio).filter(Boolean));
const extras = allFiles.filter(f => !seen.has(f));
if (extras.length) {
  L.push('---');
  L.push('');
  L.push('## Callouts');
  L.push('');
  extras.forEach(f => {
    const d = durOf(f);
    L.push('### `' + f + '`  ·  ' + mmss(clock) + ' → ' + mmss(clock + d));
    L.push('');
    clock += d;
    seen.add(f);
  });
}

L.push('---');
L.push('');
L.push('## Totals');
L.push('');
L.push('- Modules: **' + MODULES.length + '**');
L.push('- Rule clips: **' + CLIPS.length + '**');
L.push('- Audio files referenced: **' + seen.size + '** (' + CLIPS.length + ' rule clips + ' +
  MODULES.length + ' module intros + ' + Object.keys(CALLOUTS).length + ' callouts)');
L.push('- Total running time: **' + mmss(clock) + '**');
L.push('- Registry/generator drift: **' + (drift.length ? drift.length + ' MISMATCH' : 'none') + '**');
L.push('');

const out = path.join(ROOT, 'docs', 'narration-transcript.md');
fs.writeFileSync(out, L.join('\n'));
console.log('wrote ' + path.relative(ROOT, out));
console.log('  rule clips   : ' + CLIPS.length);
console.log('  audio files  : ' + seen.size);
console.log('  running time : ' + mmss(clock));
if (drift.length) {
  console.log('  DRIFT: ' + drift.slice(0, 5).map(d => d.file + ' != ' + d.mapped).join('; '));
  process.exit(1);
}
