#!/usr/bin/env node
/* =====================================================================
   Narration builder — turns the on-screen text into TTS scripts.
   One source of truth: the app text IS the audio script, so screen and
   voice can never drift apart.

   Output:
     assets/narration/scene-01.txt … scene-10.txt   (bubbles, then caption)
     assets/narration/rule-207.txt … rule-223.txt   (hook, intro, clauses,
                                                     notes, exceptions, traps)
     assets/narration/timing.json                   (segment weights, used by
                                                     tools/set-timing.py)

   Usage:  node tools/export-narration.js
   ===================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const load = f => fs.readFileSync(path.join(root, f), 'utf8');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(load('content.js') + '\n' + load('granular.js') + `
  this.SCENES = SCENES; this.RULES_DETAIL = RULES_DETAIL;
`, ctx);

const outDir = path.join(root, 'assets', 'narration');
fs.mkdirSync(outDir, { recursive: true });

const strip = s => String(s)
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<\/?[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/[""]/g, '"')
  .replace(/\s+/g, ' ')
  .trim();

const write = (name, text) => {
  fs.writeFileSync(path.join(outDir, name), text.trim() + '\n', 'utf8');
  return text.trim().length;
};

/* ── scenes: dialogue in order, then the covering caption ── */
const timing = { scenes: [], rules: [] };
ctx.SCENES.forEach((s, i) => {
  const segs = s.bubbles.map(b => strip(b.hg));
  segs.push(strip(s.caption.hg));
  const script = segs.join('\n\n');
  const chars = write(`scene-${String(i + 1).padStart(2, '0')}.txt`, script);
  timing.scenes.push({ id: s.id, file: `scene-${String(i + 1).padStart(2, '0')}.mp3`,
                       chars, segChars: segs.map(t => t.length) });
});

/* ── rules: hook → intro → clause-by-clause → notes → exceptions → traps ── */
ctx.RULES_DETAIL.forEach(r => {
  const parts = [`Rule ${r.no} — ${r.title}.`];
  if (r.hook) parts.push(`Yaad rakhne ka formula: ${strip(r.hook)}.`);
  if (r.intro) parts.push(strip(r.intro));
  r.tree.forEach(t => {
    const label = t.l > 1 ? `Clause ${t.lab}` : t.lab;
    parts.push(`${label}: ${strip(t.ex)}`);
  });
  if (r.notes && r.notes.length) parts.push('Note. ' + r.notes.map(strip).join(' '));
  if (r.provisos && r.provisos.length) parts.push('Proviso. ' + r.provisos.map(strip).join(' '));
  if (r.exceptions && r.exceptions.length) parts.push('Exception. ' + r.exceptions.map(strip).join(' '));
  if (r.amendment) parts.push('Amendment. ' + strip(r.amendment));
  r.traps.slice(0, 2).forEach(t => parts.push(`Exam trap: ${strip(t.q)} ${strip(t.a)}`));
  const script = parts.join('\n\n');
  const chars = write(`rule-${r.no}.txt`, script);
  timing.rules.push({ no: r.no, file: `rule-${r.no}.mp3`, chars });
});


/* ── speech manifest: exact clips to synthesise (TTS cap = 1500 chars/clip) ──
   A scene whose script is too long is split at the dialogue / caption boundary
   and the parts are merged afterwards by tools/mp3tool.py (frame-level concat). */
const LIMIT = 1450;
const firstSentence = (t, cap) => {
  const m = t.match(/^.{0,%d}?[.!?](?=\s|$)/.source ? t : t);
  let out = m || t;
  const cut = t.slice(0, cap);
  const dot = cut.lastIndexOf('. ');
  if (t.length > cap && dot > 60) out = t.slice(0, dot + 1);
  else out = t.length > cap ? cut + '…' : t;
  return out.trim();
};

function condenseRule(r) {
  const head = [`Rule ${r.no} — ${r.title}.`];
  if (r.hook) head.push(`Yaad rakho: ${strip(r.hook)}.`);
  if (r.intro) head.push(firstSentence(strip(r.intro), 420));
  const clauses = r.tree.map(t => `${t.l > 1 ? 'Clause ' + t.lab : t.lab}: ${firstSentence(strip(t.ex), 300)}`);
  const tail = [];
  if (r.notes && r.notes.length) tail.push('Note: ' + firstSentence(strip(r.notes[0]), 240));
  if (r.amendment) tail.push('Amendment: ' + firstSentence(strip(r.amendment), 260));
  if (r.traps && r.traps.length) tail.push('Exam trap: ' + firstSentence(strip(r.traps[0].q) + ' ' + strip(r.traps[0].a), 260));
  let out = head.join(' ');
  for (const c of clauses) {
    if ((out + ' ' + c).length > LIMIT - 320) break;
    out += ' ' + c;
  }
  for (const t of tail) {
    if ((out + ' ' + t).length > LIMIT) continue;
    out += ' ' + t;
  }
  return out.trim();
}

const speech = [];
const chunk = (text, limit) => {
  if (text.length <= limit) return [text];
  const out = [];
  let rest = text;
  while (rest.length > limit) {
    let cut = rest.lastIndexOf('. ', limit - 40);
    if (cut < limit * 0.5) cut = rest.lastIndexOf(' ', limit - 20);
    if (cut <= 0) cut = limit - 1;
    out.push(rest.slice(0, cut + 1).trim());
    rest = rest.slice(cut + 1).trim();
  }
  if (rest) out.push(rest);
  return out;
};
ctx.SCENES.forEach((s, i) => {
  const id = `scene-${String(i + 1).padStart(2, '0')}`;
  const segs = s.bubbles.map(b => strip(b.hg));
  const cap = strip(s.caption.hg);
  const full = segs.concat([cap]).join('\n\n');
  let parts;
  if (full.length <= LIMIT) {
    parts = [{ file: `assets/audio/${id}.mp3`, text: full }];
  } else if ((segs.join('\n\n').length + cap.length) <= LIMIT) {
    parts = [
      { file: `assets/narration/_part-${id}-a.mp3`, text: segs.join('\n\n') },
      { file: `assets/narration/_part-${id}-b.mp3`, text: cap }
    ];
  } else {
    const chunks = chunk(full, LIMIT);
    parts = chunks.map((t, n) => ({ file: `assets/narration/_part-${id}-${String.fromCharCode(97 + n)}.mp3`, text: t }));
  }
  speech.push({ id, parts });
});
ctx.RULES_DETAIL.forEach(r => {
  speech.push({ id: `rule-${r.no}`, parts: [{ file: `assets/audio/rule-${r.no}.mp3`, text: condenseRule(r) }] });
});
fs.writeFileSync(path.join(outDir, 'speech.json'), JSON.stringify(speech, null, 2), 'utf8');
let clips = 0, tooLong = [];
speech.forEach(s => {
  clips += s.parts.length;
  s.parts.forEach(p => { if (p.text.length > 1500) tooLong.push(`${p.file} (${p.text.length})`); });
});
console.log(`\nspeech.json → ${speech.length} items, ${clips} clips to synthesise`);
speech.forEach(s => console.log(`  ${s.id.padEnd(10)} ${s.parts.map(p => p.text.length).join(' + ')}`));
if (tooLong.length) console.log('OVER 1500 CHARS:', tooLong.join(', '));

fs.writeFileSync(path.join(outDir, 'timing.json'), JSON.stringify(timing, null, 2), 'utf8');
console.log(`scenes: ${timing.scenes.length} · rules: ${timing.rules.length}`);
timing.scenes.forEach(s => console.log(`  ${s.file}  ${s.chars} chars  (segments: ${s.segChars.join('/')})`));
timing.rules.forEach(r => console.log(`  ${r.file}  ${r.chars} chars  ≈ ${(r.chars / 14).toFixed(0)}s`));
