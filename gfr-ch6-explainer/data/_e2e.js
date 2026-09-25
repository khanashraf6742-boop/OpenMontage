/* End-to-end test of the player: runs the ACTUAL inline script of
   granular-video.html against the real data files with a minimal DOM stub,
   then asserts every segment resolves to a real audio file.
   Unlike data/_verify.js (which reimplements the segmentation), this exercises
   the player's own buildSegments(), so a change to the player cannot silently
   break the studio mapping.
   Usage: node data/_e2e.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'granular-video.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

/* minimal DOM: the player only needs #play, #ctx, #rate, #prog, #vwarn, #mods... */
const mk = () => {
  const el = {
    innerHTML: '', textContent: '', style: {}, dataset: {}, children: [],
    classList: { toggle(){}, add(){}, remove(){}, contains(){ return false; } },
    querySelectorAll(){ return []; }, querySelector(){ return null; },
    scrollIntoView(){}, addEventListener(){}, appendChild(){}, setAttribute(){}
  };
  return el;
};
const cache = {};
const document = {
  getElementById(id){ return cache[id] || (cache[id] = mk()); },
  querySelector(){ return mk(); },
  querySelectorAll(){ return []; },
  createElement(){ return mk(); },
  body: mk(), addEventListener(){}
};
const store = {};
const sandbox = {
  window: {}, document,
  $: id => document.getElementById(id),
  $$: q => [],
  localStorage: { getItem: k => store[k] ?? null, setItem: (k,v) => { store[k]=v; } },
  Audio: function(){ return { src:'', playbackRate:1, currentTime:0, duration:0,
    play(){ return Promise.resolve(); }, pause(){}, load(){} }; },
  speechSynthesis: null, console, setTimeout, clearTimeout, setInterval, clearInterval,
  navigator: { userAgent: 'test' }, location: { search: '' }
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

/* load the data files exactly as the page does */
['data/ch6-goods.js','data/ch6-services.js','data/studio.js'].forEach(f => {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
});
vm.runInContext(script + '\nglobalThis.__test={beats:beats,segments:segments,STUDIO_COUNT:STUDIO_COUNT};',
  sandbox, { filename: 'granular-video.html' });
const T = sandbox.__test;

const W = sandbox.window;
const out = {
  rules: W.GFR_CH6_GOODS.length + W.GFR_CH6_SERVICES.length,
  beats: T.beats.length,
  segments: T.segments.length,
  studioCount: T.STUDIO_COUNT,
  ttsCount: T.segments.filter(s => !s.studio).length,
  missingAudio: T.segments.filter(s => s.studio && !s.audio).length,
  badFile: [],
  charsOverLimit: []
};
T.segments.forEach(s => {
  if (s.chars > 1500) out.charsOverLimit.push(s.chars);
  if (s.audio) {
    const p = path.join(ROOT, s.audio);
    if (!fs.existsSync(p)) out.badFile.push(s.audio);
  }
});
console.log(JSON.stringify(out, null, 2));
const ok = out.studioCount === out.segments && out.missingAudio === 0 &&
           out.badFile.length === 0 && out.charsOverLimit.length === 0 &&
           out.ttsCount === 0 && out.rules === 67;
console.log('\nPLAYER END-TO-END: ' + (ok ? 'PASS' : 'FAIL'));
process.exit(ok ? 0 : 1);
