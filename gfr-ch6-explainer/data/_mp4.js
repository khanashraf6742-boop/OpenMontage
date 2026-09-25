#!/usr/bin/env node
/*
 * _mp4.js — verify the rendered MP4 against the playback plan.
 *
 * Parses the MP4 box structure directly (no ffprobe needed) and checks:
 *   - the file opens with `ftyp` and carries `moov` (faststart: moov before mdat)
 *   - the movie duration matches data/_segments.json's total narration time
 *   - the video track's frame count matches the slide plan at the render fps
 *   - both tracks are present and roughly the same length
 *
 * Exit 1 on any mismatch.
 *   node data/_mp4.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MP4 = path.join(ROOT, 'gfr-chapter-6.mp4');
const SEG = path.join(ROOT, 'data', '_segments.json');

let problems = [];
const ok = (cond, msg) => { if (!cond) problems.push(msg); };

if (!fs.existsSync(MP4)) {
  console.log('MP4 FILE CHECK: SKIP (gfr-chapter-6.mp4 not rendered — run data/_video.py)');
  process.exit(0);
}

const buf = fs.readFileSync(MP4);
const size = buf.length;
console.log('file    : gfr-chapter-6.mp4');
console.log('bytes   : ' + size + ' (' + Math.round(size / 1048576) + ' MB)');

/* ---------- minimal box walker ---------- */
function boxes(start, end) {
  const out = [];
  let p = start;
  while (p + 8 <= end) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('latin1', p + 4, p + 8);
    let body = p + 8, total = len;
    if (len === 1) {                       // 64-bit extended size
      const hi = buf.readUInt32BE(p + 8), lo = buf.readUInt32BE(p + 12);
      total = hi * 4294967296 + lo;
      body = p + 16;
    } else if (len === 0) {
      total = end - p;
    }
    if (total < 8 || p + total > end) break;
    out.push({ type, start: p, body, end: p + total });
    p += total;
  }
  return out;
}

function find(type, from, to) {
  return boxes(from, to).filter(b => b.type === type);
}
function findOne(type, from, to) {
  const r = find(type, from, to);
  return r.length ? r[0] : null;
}

/* ---------- top level ---------- */
const top = boxes(0, size);
const types = top.map(b => b.type);
console.log('boxes   : ' + types.join(' '));
ok(types[0] === 'ftyp', 'the file must start with an ftyp box, got ' + types[0]);

const moov = findOne('moov', 0, size);
const mdat = findOne('mdat', 0, size);
ok(!!moov, 'no moov box — the file is not a readable MP4');
ok(!!mdat, 'no mdat box');
if (!moov || !mdat) {
  problems.forEach(p => console.log('   !! ' + p));
  process.exit(1);
}
ok(moov.start < mdat.start,
   'moov must precede mdat for progressive download (+faststart); got moov@' +
   moov.start + ' mdat@' + mdat.start);
console.log('faststart: moov@' + moov.start + ' before mdat@' + mdat.start);

/* ---------- movie header ---------- */
const mvhd = findOne('mvhd', moov.body, moov.end);
ok(!!mvhd, 'no mvhd in moov');
let movieScale = 1, movieDur = 0;
if (mvhd) {
  const ver = buf[mvhd.body];
  const off = mvhd.body + 4;
  if (ver === 1) {
    movieScale = buf.readUInt32BE(off + 16);
    movieDur = Number(buf.readBigUInt64BE(off + 20));
  } else {
    movieScale = buf.readUInt32BE(off + 8);
    movieDur = buf.readUInt32BE(off + 12);
  }
}
const movieSeconds = movieDur / movieScale;
console.log('movie   : ' + movieSeconds.toFixed(3) + ' s  (' +
            Math.floor(movieSeconds / 60) + ':' +
            String(Math.round(movieSeconds % 60)).padStart(2, '0') + ')');

/* ---------- tracks ---------- */
const traks = find('trak', moov.body, moov.end);
ok(traks.length === 2, 'expected exactly 2 tracks (video + audio), got ' + traks.length);
console.log('tracks  : ' + traks.length);

let vFrames = 0, vDur = 0, vScale = 0, vKind = '', aDur = 0, aScale = 0, aKind = '';
for (const t of traks) {
  const mdia = findOne('mdia', t.body, t.end);
  if (!mdia) continue;
  const hdlr = findOne('hdlr', mdia.body, mdia.end);
  const kind = hdlr ? buf.toString('latin1', hdlr.body + 8, hdlr.body + 12) : '????';
  const mdhd = findOne('mdhd', mdia.body, mdia.end);
  let scale = 1, dur = 0;
  if (mdhd) {
    const ver = buf[mdhd.body];
    const off = mdhd.body + 4;
    if (ver === 1) { scale = buf.readUInt32BE(off + 16); dur = Number(buf.readBigUInt64BE(off + 20)); }
    else { scale = buf.readUInt32BE(off + 8); dur = buf.readUInt32BE(off + 12); }
  }
  if (kind === 'vide') {
    vKind = kind; vDur = dur; vScale = scale;
    const stbl = (() => {
      const minf = findOne('minf', mdia.body, mdia.end);
      return minf ? findOne('stbl', minf.body, minf.end) : null;
    })();
    if (stbl) {
      const stsz = findOne('stsz', stbl.body, stbl.end);
      if (stsz) vFrames = buf.readUInt32BE(stsz.body + 8);
    }
  } else if (kind === 'soun') {
    aKind = kind; aDur = dur; aScale = scale;
  }
}
console.log('video   : ' + vKind + ', ' + vFrames + ' frames, ' +
            (vDur / vScale).toFixed(3) + ' s');
console.log('audio   : ' + aKind + ', ' + (aDur / aScale).toFixed(3) + ' s');

ok(vKind === 'vide', 'no video track found');
ok(aKind === 'soun', 'no audio track found');
ok(vFrames > 0, 'could not read the video sample count');

/* ---------- compare with the playback plan ---------- */
if (!fs.existsSync(SEG)) {
  console.log('\nplan    : data/_segments.json missing — durations not cross-checked');
} else {
  const plan = JSON.parse(fs.readFileSync(SEG, 'utf8'));
  const want = plan.total_seconds;
  console.log('plan    : ' + plan.segments_count + ' segments, ' + want.toFixed(3) + ' s');

  // The renderer holds the last slide 1 s past the last clip, so the movie runs
  // about a second longer than the plan. The audio track is slightly SHORTER:
  // every MP3 clip carries an ID3v2 header plus one MPEG frame of encoder delay,
  // and the AAC encoder trims both, so the audio loses roughly 0.05 s per clip.
  const slack = 0.08 * plan.segments_count + 2;
  ok(Math.abs(movieSeconds - want) < 3.0,
     'movie duration ' + movieSeconds.toFixed(2) + ' s should match the narration plan ' +
     want.toFixed(2) + ' s');
  ok(Math.abs(vDur / vScale - want) < 3.0,
     'video track ' + (vDur / vScale).toFixed(2) + ' s should match the plan ' + want.toFixed(2) + ' s');
  ok(Math.abs(aDur / aScale - want) < slack,
     'audio track ' + (aDur / aScale).toFixed(2) + ' s should match the plan ' + want.toFixed(2) +
     ' s (within ' + slack.toFixed(1) + ' s of trimmed MP3 encoder delay)');

  // Frame count: fps x total duration, allowing for the 1 s tail and rounding.
  const fps = 5;
  const expect = Math.round((want + 1.0) * fps);
  ok(Math.abs(vFrames - expect) <= fps * 2,
     'video has ' + vFrames + ' frames but the plan implies about ' + expect +
     ' at ' + fps + ' fps');

  // Every slide must be represented: at least one frame per segment.
  ok(vFrames >= plan.segments_count,
     'video has fewer frames (' + vFrames + ') than segments (' + plan.segments_count + ')');

  // The slide plan and the narration must agree on the audio length.
  const byBytes = plan.segments.reduce((a, s) => a + s.duration, 0);
  ok(Math.abs(byBytes - want) < 0.5, 'segment durations do not sum to the plan total');
}

console.log('\nproblems : ' + problems.length);
problems.forEach(p => console.log('   !! ' + p));
console.log('MP4 FILE CHECK: ' + (problems.length ? 'FAIL' : 'PASS'));
process.exit(problems.length ? 1 : 0);
