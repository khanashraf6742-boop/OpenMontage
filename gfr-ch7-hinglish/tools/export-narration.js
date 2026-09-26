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
     assets/narration/speech.json                   (exact clips to synthesise)

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
  this.SCENES = SCENES; this.RULES_DETAIL = RULES_DETAIL; this.CAST = CAST; this.META = META;
`, ctx);

const outDir = path.join(root, 'assets', 'narration');
fs.mkdirSync(outDir, { recursive: true });

const LIMIT = 1450;                      // TTS accepts 1500 chars per clip

/* ── text helpers ────────────────────────────────────────────────────── */
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

/* notes / provisos / exceptions are plain strings or {lab, text, ex} objects */
const noteText = n => typeof n === 'string' ? n : (n.ex || n.text || '');

/* the amendment field is a string or {old, neu, om, date, effect} */
const amendmentText = a => {
  if (!a) return '';
  if (typeof a === 'string') return a;
  const head = [a.om, a.date && `dated ${a.date}`].filter(Boolean).join(' ');
  return [head, a.old && a.neu ? `pehle: ${a.old} — ab: ${a.neu}` : '', a.effect || '']
    .filter(Boolean).join('. ');
};

/* narration hygiene: "·" becomes a comma, no space before punctuation */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const speakableDate = t => t.replace(/\b(\d{2})\.(\d{2})\.(\d{4})\b/g,
  (_, d, m, y) => `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`);

const clean = t => speakableDate(String(t))
  .replace(/[·•]/g, ',')
  .replace(/[→➔]/g, ',')
  .replace(/[≤≥]/g, '')
  .replace(/\s+([,.;])/g, '$1')
  .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
  .replace(/\s{2,}/g, ' ')
  .trim();

/* never end a clip on an open bracket or a dangling connector */
const trimDangling = t => t
  .replace(/\s*\([^)]*$/, '')
  .replace(/[\s,;:-]+(of|the|and|or|to|in|for|a|an)$/i, '')
  .replace(/[\s,;:-]+$/, '');

/* whole sentences only, up to roughly `cap` characters */
const firstSentence = (t, cap) => {
  t = speakableDate(t);                     // dates first, so "10.07.2024" can't split a sentence
  const parts = t.match(/[^.!?]+[.!?]+/g) || [t];
  let out = '';
  for (const q of parts) {
    if (out && out.length + q.length > cap) break;
    out += q;
    if (out.length >= cap) break;
  }
  return trimDangling((out || parts[0]).trim());
};

const write = (name, text) => {
  fs.writeFileSync(path.join(outDir, name), text.trim() + '\n', 'utf8');
  return text.trim().length;
};

/* ── scenes: dialogue in order, then the covering caption ────────────── */
const timing = { scenes: [], rules: [] };
ctx.SCENES.forEach((s, i) => {
  const segs = s.bubbles.map(b => clean(strip(b.hg)));
  segs.push(clean(strip(s.caption.hg)));
  const script = segs.join('\n\n');
  const file = `scene-${String(i + 1).padStart(2, '0')}`;
  const chars = write(`${file}.txt`, script);
  timing.scenes.push({ id: s.id, file: `${file}.mp3`, chars, segChars: segs.map(t => t.length) });
});

/* ── rules: hook → intro → clause-by-clause → notes → exceptions → traps ── */
ctx.RULES_DETAIL.forEach(r => {
  const parts = [`Rule ${r.no} — ${r.title}.`];
  if (r.hook) parts.push(`Yaad rakhne ka formula: ${clean(strip(r.hook))}.`);
  if (r.intro) parts.push(strip(r.intro));
  r.tree.forEach(t => {
    const label = (t.l !== 1 && /^[(\d]/.test(t.lab)) ? `Clause ${t.lab}` : t.lab;
    parts.push(`${label}: ${strip(t.ex)}`);
  });
  if (r.notes && r.notes.length) parts.push('Note. ' + r.notes.map(x => strip(noteText(x))).join(' '));
  if (r.provisos && r.provisos.length) parts.push('Proviso. ' + r.provisos.map(x => strip(noteText(x))).join(' '));
  if (r.exceptions && r.exceptions.length) parts.push('Exception. ' + r.exceptions.map(x => strip(noteText(x))).join(' '));
  if (r.amendment) parts.push('Amendment. ' + strip(amendmentText(r.amendment)));
  r.traps.slice(0, 2).forEach(t => parts.push(`Exam trap: ${strip(t.q)} ${strip(t.a)}`));
  const chars = write(`rule-${r.no}.txt`, clean(parts.join(' ')));
  timing.rules.push({ no: r.no, file: `rule-${r.no}.mp3`, chars });
});

/* ── condensed rule narration, as segments ───────────────────────────────
   One array drives BOTH the TTS script and the Deep Dive video slides, so the
   spoken words and the on-screen text can never drift apart.
   seg = { kind, label, nar (spoken), disp (shown) }                        */
function ruleSegments(r) {
  const segs = [];
  segs.push({ kind: 'head', label: `Rule ${r.no}`, nar: `Rule ${r.no} — ${r.title}.`, disp: r.title });
  if (r.hook) segs.push({ kind: 'hook', label: 'Yaad rakho', nar: `Yaad rakho: ${clean(strip(r.hook))}.`, disp: clean(strip(r.hook)) });
  if (r.intro) {
    const t = firstSentence(strip(r.intro), 420);
    segs.push({ kind: 'intro', label: r.grp, nar: t, disp: t });
  }
  let used = segs.reduce((n, x) => n + x.nar.length, 0);
  for (const t of r.tree) {
    const lab = (t.l !== 1 && /^[(\d]/.test(t.lab)) ? `Clause ${t.lab}` : t.lab;
    const txt = firstSentence(strip(t.ex), 320);
    if (used + txt.length > 1120) break;                 // keep the clip under the cap
    segs.push({ kind: 'clause', label: lab, tag: t.tag || '', text: '', nar: `${lab}: ${txt}`, disp: txt });
    used += txt.length;
  }
  // tail segments, most important first: amendment → note → exam trap
  const tails = [];
  if (r.amendment) tails.push({ kind: 'amend', label: 'Amendment', nar: `Amendment: ${firstSentence(strip(amendmentText(r.amendment)), 340)}` });
  if (r.notes && r.notes.length) tails.push({ kind: 'note', label: 'Note', nar: `Note: ${firstSentence(strip(noteText(r.notes[0])), 320)}` });
  if (r.traps && r.traps.length) tails.push({ kind: 'trap', label: 'Exam trap', nar: `Exam trap: ${firstSentence(strip(r.traps[0].q) + ' ' + strip(r.traps[0].a), 280)}` });
  for (const t of tails) {
    if (used + t.nar.length < 1420) { t.disp = t.nar.replace(/^(Amendment|Note|Exam trap):\s*/, ''); segs.push(t); used += t.nar.length; }
  }
  // hard cap: the TTS accepts 1500 chars — drop the least critical tails if needed
  const size = () => segs.map(s => s.nar).join(' ').length;
  for (const kind of ['trap', 'amend', 'note']) {
    while (size() > 1450 && segs.some(x => x.kind === kind)) {
      segs.splice(segs.map(x => x.kind).lastIndexOf(kind), 1);
    }
  }
  return segs;
}

const condenseRule = r => clean(ruleSegments(r).map(s => s.nar).join(' '));

/* ── speech manifest: which clips to synthesise, and their exact text ─── */
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

const speech = [];
ctx.SCENES.forEach((s, i) => {
  const id = `scene-${String(i + 1).padStart(2, '0')}`;
  const segs = s.bubbles.map(b => clean(strip(b.hg)));
  const cap = clean(strip(s.caption.hg));
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
    parts = chunk(full, LIMIT).map((t, n) => ({
      file: `assets/narration/_part-${id}-${String.fromCharCode(97 + n)}.mp3`, text: t
    }));
  }
  speech.push({ id, parts });
});
ctx.RULES_DETAIL.forEach(r => {
  speech.push({ id: `rule-${r.no}`, parts: [{ file: `assets/audio/rule-${r.no}.mp3`, text: condenseRule(r) }] });
});

/* ── slide data for the Deep Dive video (tools/make-video-deep.py) ────── */
const deep = {
  meta: { title: ctx.META.title, lastVerified: ctx.META.lastVerified },
  rules: ctx.RULES_DETAIL.map((r, i) => {
    const segs = ruleSegments(r);
    return {
      n: i + 1, no: r.no, title: r.title, grp: r.grp, hook: clean(strip(r.hook || '')),
      audio: r.audio, clauses: r.tree.length,
      notes: (r.notes || []).length, provisos: (r.provisos || []).length,
      exceptions: (r.exceptions || []).length, amended: !!r.amendment,
      segments: segs.map(s => ({ kind: s.kind, label: s.label, tag: s.tag || '', text: s.disp, nar: s.nar }))
    };
  })
};
fs.writeFileSync(path.join(outDir, 'rules-slides.json'), JSON.stringify(deep, null, 2), 'utf8');

/* the slide text must equal the synthesised narration — fail loudly if not */
let mismatch = [];
ctx.RULES_DETAIL.forEach((r, i) => {
  const a = deep.rules[i].segments.map(s => s.nar).join(' ');
  const b = speech.find(x => x.id === `rule-${r.no}`).parts[0].text;
  if (clean(a) !== clean(b)) mismatch.push(r.no);
});
if (mismatch.length) { console.error('SLIDE/NARRATION MISMATCH for rules:', mismatch.join(', ')); process.exit(1); }

/* ── write everything out ────────────────────────────────────────────── */
/* ── scene data for the video renderer (tools/make-video.py) ─────────── */
const sceneData = {
  meta: { title: ctx.META.title, span: ctx.META.span, lastVerified: ctx.META.lastVerified },
  cast: Object.fromEntries(Object.entries(ctx.CAST).map(([k, v]) => [k, v.name])),
  scenes: ctx.SCENES.map((s, i) => ({
    n: i + 1, id: s.id, title: s.title, rules: s.rules, panel: s.panel, audio: s.audio,
    est: s.est, bubbles: s.bubbles.map(b => ({ who: b.who, side: b.side, t: b.t, text: clean(strip(b.hg)) })),
    caption: clean(strip(s.caption.hg))
  }))
};
fs.writeFileSync(path.join(outDir, 'scenes.json'), JSON.stringify(sceneData, null, 2), 'utf8');

fs.writeFileSync(path.join(outDir, 'speech.json'), JSON.stringify(speech, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'timing.json'), JSON.stringify(timing, null, 2), 'utf8');

console.log(`scenes: ${timing.scenes.length} · rules: ${timing.rules.length}`);
timing.scenes.forEach(s => console.log(`  ${s.file}  ${s.chars} chars  (segments: ${s.segChars.join('/')})`));
let clips = 0, tooLong = [];
speech.forEach(s => {
  clips += s.parts.length;
  s.parts.forEach(p => { if (p.text.length > 1500) tooLong.push(`${p.file} (${p.text.length})`); });
});
console.log(`\nspeech.json → ${speech.length} items, ${clips} clips to synthesise`);
speech.forEach(s => console.log(`  ${s.id.padEnd(10)} ${s.parts.map(p => p.text.length).join(' + ')}`));
if (tooLong.length) console.log('OVER 1500 CHARS:', tooLong.join(', '));
