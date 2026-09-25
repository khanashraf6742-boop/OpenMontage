/* Clip generator for the studio narration of GFR 2017 Chapter 6.
   Usage:  node data/_gen.js <batch> <n>
   Reconstructs exactly the beat + greedy-split logic used by granular-video.html,
   so the printed clip texts are the ones that must be recorded. */
'use strict';
const fs = require('fs');
const path = require('path');
global.window = {};
require(path.join(__dirname, 'ch6-goods.js'));
require(path.join(__dirname, 'ch6-services.js'));
const RULES = [...window.GFR_CH6_GOODS, ...window.GFR_CH6_SERVICES];

/* ---- normalisation (must stay identical to the player) ---- */
function stripHTML(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#9654;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function toSpeech(s) {
  return stripHTML(s)
    .replace(/₹/g, ' rupees ')
    .replace(/(\d),(\d{2}),(\d{3})/g, '$1$2$3')
    .replace(/(\d),(\d{3})/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ---- over-long single beats are split at sentence boundaries ---- */
const BEAT_LIMIT = 1380;
function splitSpeech(t) {
  if (t.length <= BEAT_LIMIT) return [t];
  const sentences = t.split(/(?<=\.\s)/);
  const out = [];
  let cur = '';
  sentences.forEach(function (s) {
    if (cur && (cur + s).length > BEAT_LIMIT) { out.push(cur.trim()); cur = s; }
    else cur += s;
  });
  if (cur.trim()) out.push(cur.trim());
  return out.length ? out : [t];
}

/* ---- beats per rule: title, verbatim, hinglish, sub-rules, provisos,
        notes, exceptions, amendment footnotes ---- */
function beatsFor(rule) {
  const out = [];
  const add = function (speech) { splitSpeech(speech).forEach(function (p) { out.push({ speech: p }); }); };
  add('Rule ' + rule.r + '. ' + stripHTML(rule.t) + '.');
  add(toSpeech(rule.text));
  if (rule.hi) add(toSpeech(rule.hi));
  (rule.subs || []).forEach(function (s) { add(toSpeech(s.n + '. ' + s.text + ' ' + (s.hi || ''))); });
  (rule.prov || []).forEach(function (p) { add('Proviso. ' + toSpeech(p)); });
  (rule.note || []).forEach(function (n) { add('Note. ' + toSpeech(n)); });
  (rule.ex || []).forEach(function (e) { add('Exception. ' + toSpeech(e)); });
  (rule.fn || []).forEach(function (f) { add('Amendment footnote. ' + toSpeech(f)); });
  return out;
}

/* ---- greedy pack into clips of at most 1450 characters ---- */
const LIMIT = 1450;
const clips = [];          // {rule, beats:[]}
let totalChars = 0;
RULES.forEach(function (rule) {
  const bs = beatsFor(rule);
  let cur = [], len = 0;
  bs.forEach(function (b) {
    const L = b.speech.length + 1;
    if (len + L > LIMIT && cur.length) { clips.push({ rule: rule.r, beats: cur }); cur = []; len = 0; }
    cur.push(b); len += L;
  });
  if (cur.length) clips.push({ rule: rule.r, beats: cur });
});
clips.forEach(function (c) { c.text = c.beats.map(function (b) { return b.speech; }).join(' '); });

const perRule = {};
clips.forEach(function (c) { perRule[c.rule] = (perRule[c.rule] || 0) + 1; });
const batch = parseInt(process.argv[2] || '1', 10);
const n = parseInt(process.argv[3] || '10', 10);
const start = (batch - 1) * n;
const sel = clips.slice(start, start + n);

console.log('TOTAL CLIPS NEEDED: ' + clips.length + ' | total chars: ' +
  clips.reduce(function (a, c) { return a + c.text.length; }, 0));
console.log('CLIPS PER RULE:');
Object.keys(perRule).forEach(function (r) { console.log('  R' + r + ' -> ' + perRule[r] + ' clip(s)'); });

console.log('\n===== BATCH ' + batch + ' (clips ' + (start + 1) + '-' + (start + sel.length) + ') =====');
/* file names: v-<rule>, then v-<rule>b, v-<rule>c ... in global clip order, so a
   rule split across two batches keeps one stable sequence. */
const used = {};
const files = clips.map(function (c) {
  const base = 'v-' + c.rule;
  used[base] = (used[base] || 0) + 1;
  const suffix = used[base] === 1 ? '' : 'bcdefghijklmnopqrstuvwxyz'[used[base] - 2];
  return 'audio/' + base + suffix + '.mp3';
});
sel.forEach(function (c, i) {
  const k = start + i;
  console.log('\n--- CLIP ' + (k + 1) + ' | Rule ' + c.rule + ' | ' + c.text.length +
    ' chars | ' + c.beats.length + ' beats | ' + files[k] + ' ---');
  console.log(c.text);
});
