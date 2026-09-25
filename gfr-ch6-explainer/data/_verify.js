/* Verify that every clip referenced by data/studio.js exists, is non-trivial,
   and that the mapping still matches the player's segmentation.
   Usage: node data/_verify.js */
'use strict';
const fs = require('fs');
const path = require('path');
global.window = {};
require(path.join(__dirname, 'ch6-goods.js'));
require(path.join(__dirname, 'ch6-services.js'));
require(path.join(__dirname, 'studio.js'));
const RULES = [...window.GFR_CH6_GOODS, ...window.GFR_CH6_SERVICES];
const BY = {};
RULES.forEach(r => { BY[r.r] = r; });

/* ---- identical normalisation + splitting to the player ---- */
function stripHTML(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-').replace(/&#9654;/g, '').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function toSpeech(s) {
  return stripHTML(s).replace(/₹/g, ' rupees ')
    .replace(/(\d),(\d{2}),(\d{3})/g, '$1$2$3').replace(/(\d),(\d{3})/g, '$1$2')
    .replace(/\s+/g, ' ').trim();
}
const BEAT_LIMIT = 1380;
function packParts(parts) {
  const out = []; let cur = '';
  parts.forEach(function (s) {
    if (cur && (cur + s).length > BEAT_LIMIT) { out.push(cur.trim()); cur = s; } else cur += s;
  });
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function splitSpeech(t) {
  if (t.length <= BEAT_LIMIT) return [t];
  const out = [];
  packParts(t.split(/(?<=\.\s)/)).forEach(function (piece) {
    if (piece.length <= BEAT_LIMIT) { out.push(piece); return; }
    packParts(piece.split(/(?<=; )/)).forEach(function (p2) {
      if (p2.length <= BEAT_LIMIT) { out.push(p2); return; }
      packParts(p2.split(/(?<=, )/)).forEach(function (p3) {
        if (p3.length <= BEAT_LIMIT) { out.push(p3); return; }
        for (let i = 0; i < p3.length; i += BEAT_LIMIT) out.push(p3.slice(i, i + BEAT_LIMIT));
      });
    });
  });
  return out.length ? out : [t];
}
function beatsFor(r) {
  const o = [];
  const a = t => splitSpeech(t).forEach(p => o.push(p));
  a('Rule ' + r.r + '. ' + stripHTML(r.t) + '.');
  a(toSpeech(r.text));
  if (r.hi) a(toSpeech(r.hi));
  (r.subs || []).forEach(s => a(toSpeech(s.n + '. ' + s.text + ' ' + (s.hi || ''))));
  (r.prov || []).forEach(p => a('Proviso. ' + toSpeech(p)));
  (r.note || []).forEach(n => a('Note. ' + toSpeech(n)));
  (r.ex || []).forEach(e => a('Exception. ' + toSpeech(e)));
  (r.fn || []).forEach(f => a('Amendment footnote. ' + toSpeech(f)));
  return o;
}
const LIMIT = 1450;
const S = window.GFR_STUDIO;
let studio = 0, tts = 0;
const mismatches = [], partial = [], missing = [], tiny = [];
let totalChars = 0;
Object.keys(BY).forEach(rid => {
  const bs = beatsFor(BY[rid]);
  const g = []; let c = [], n = 0;
  bs.forEach(b => { const l = b.length + 1;
    if (n + l > LIMIT && c.length) { g.push(c); c = []; n = 0; }
    c.push(b); n += l; });
  if (c.length) g.push(c);
  const list = S[rid] || [];
  if (list.length > g.length) mismatches.push(rid + ' studio=' + list.length + ' segments=' + g.length);
  if (list.length && list.length < g.length) partial.push(rid + ' (' + list.length + '/' + g.length + ')');
  g.forEach((x, i) => {
    if (!list[i]) { tts++; return; }
    studio++;
    const f = path.join(__dirname, '..', list[i]);
    if (!fs.existsSync(f)) { missing.push(list[i]); return; }
    const size = fs.statSync(f).size;
    if (size < 4000) tiny.push(list[i] + ' (' + size + ' bytes)');
    totalChars += size;
  });
});
console.log('rules mapped          : ' + Object.keys(S).length + ' / ' + RULES.length);
console.log('studio segments live  : ' + studio);
console.log('TTS fallback segments : ' + tts);
console.log('mapping mismatches    : ' + (mismatches.join(', ') || 'none'));
console.log('partially mapped      : ' + (partial.join(', ') || 'none'));
console.log('referenced but absent : ' + (missing.join(', ') || 'none'));
console.log('suspiciously small    : ' + (tiny.join(', ') || 'none'));
if (mismatches.length || missing.length) { console.log('\nRESULT: FAIL'); process.exit(1); }
console.log('\nRESULT: OK');
