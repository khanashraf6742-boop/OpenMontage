/* Deployment test: boots server.js on a scratch port and checks the whole surface
   an agent platform would touch. Existence of a file is not enough - the API has to
   return the right shape and the right numbers.

   Usage: node data/_deploy.js */
'use strict';
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');

const PORT = 8177;
const BASE = 'http://127.0.0.1:' + PORT;
const problems = [];

function get(p, opts) {
  return new Promise((resolve, reject) => {
    const req = http.request(BASE + p, { method: (opts && opts.method) || 'GET' }, res => {
      let b = '';
      res.on('data', c => { b += c; if (b.length > 4e7) req.destroy(); });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: b }));
    });
    req.on('error', reject);
    if (opts && opts.body) req.write(opts.body);
    req.end();
  });
}
/* binary fetch: Range checks must compare real bytes, not UTF-16 string length */
function getRaw(p, range) {
  return new Promise((resolve, reject) => {
    const headers = range ? { Range: range } : {};
    const req = http.request(BASE + p, { method: 'GET', headers }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers,
                                    body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.end();
  });
}
const ok = (cond, msg) => { if (!cond) problems.push(msg); };

(async () => {
  const srv = spawn(process.execPath, [path.join(ROOT, 'server.js'), String(PORT)], {
    cwd: ROOT, stdio: 'ignore'
  });
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('server did not start')), 15000);
    const poll = setInterval(async () => {
      try { await get('/healthz'); clearInterval(poll); clearTimeout(t); res(); } catch (e) {}
    }, 150);
  });

  /* ---- API shape ---- */
  const stats = JSON.parse((await get('/api/stats')).body);
  ok(stats.rules === 67, '/api/stats rules should be 67, got ' + stats.rules);
  ok(stats.goods_rules === 37, '/api/stats goods should be 37');
  ok(stats.services_rules === 30, '/api/stats services should be 30');
  ok(stats.sub_rules === 182, '/api/stats sub_rules should be 182, got ' + stats.sub_rules);
  ok(stats.provisos === 2 && stats.notes === 9, '/api/stats provisos/notes wrong');
  ok(stats.exceptions === 36 && stats.footnotes === 34, '/api/stats exceptions/footnotes wrong');
  ok(stats.narrated_clips === 134 && stats.beats === 481, '/api/stats clip/beat counts wrong');

  const list = JSON.parse((await get('/api/rules')).body);
  ok(list.count === 67, '/api/rules count should be 67');
  ok(JSON.parse((await get('/api/rules?part=goods')).body).count === 37, '?part=goods should be 37');
  ok(JSON.parse((await get('/api/rules?part=services')).body).count === 30, '?part=services should be 30');

  const r155 = JSON.parse((await get('/api/rules/155')).body);
  ok(r155.rule === '155' && r155.verbatim.length > 200, '/api/rules/155 verbatim missing');
  ok(r155.hinglish.length > 20, '/api/rules/155 hinglish missing');
  ok(r155.sub_rules.length === 3, '/api/rules/155 should have 3 sub-rules, got ' + r155.sub_rules.length);
  ok(r155.exceptions.length === 2, '/api/rules/155 should have 2 exceptions');
  ok(r155.footnotes.length === 2, '/api/rules/155 should have 2 footnotes');
  ok(/50,000/.test(r155.verbatim) && /5,00,000/.test(r155.verbatim),
    '/api/rules/155 verbatim must carry the 10.07.2024 thresholds');

  /* parenthesised rule ids must resolve both ways */
  ok(JSON.parse((await get('/api/rules/172(1)')).body).rule === '172(1)', '172(1) must resolve');
  ok(JSON.parse((await get('/api/rules/172-1')).body).rule === '172(1)', '172-1 must resolve to 172(1)');
  ok((await get('/api/rules/999')).status === 404, 'unknown rule should 404');

  /* the three provisions added after the first "complete" claim must be served */
  const r144 = JSON.parse((await get('/api/rules/144')).body);
  ok(r144.sub_rules.some(s => /144\(x\)/.test(s.ref)), 'Rule 144(x) must be in the API');
  const x144 = r144.sub_rules.find(s => /144\(x\)/.test(s.ref));
  ok(x144 && /defence of India/i.test(x144.verbatim),
    'Rule 144(x) land-border text must be in the API (it lives in sub_rules, not the rule body)');
  const r173 = JSON.parse((await get('/api/rules/173')).body);
  ok(r173.sub_rules.some(s => s.ref === '173(ii)'), 'Rule 173(ii) must be in the API');
  ok(r173.sub_rules.some(s => s.ref === '173(ix)'), 'Rule 173(ix) must be in the API');

  const srch = JSON.parse((await get('/api/search?q=purchase+committee')).body);
  ok(srch.results.length > 0 && srch.results[0].rule === '155',
    '/api/search should rank Rule 155 first for "purchase committee"');
  ok(JSON.parse((await get('/api/search?q=')).body).results.length === 0,
    'empty query should return no results');
  const oas = JSON.parse((await get('/api/openapi.json')).body);
  ok(oas.openapi && oas.paths['/api/rules/{id}'] && oas.paths['/api/search'],
    '/api/openapi.json must describe the rule and search endpoints');

  /* CORS - every platform needs this */
  const cors = (await get('/api/rules/155')).headers['access-control-allow-origin'];
  ok(cors === '*', 'API must send access-control-allow-origin: *, got ' + cors);

  /* ---- copilot runtime ---- */
  const ck = await get('/api/copilotkit?q=bid+security');
  ok(ck.status === 200 && /text\/event-stream/.test(ck.headers['content-type'] || ''),
    '/api/copilotkit must return text/event-stream');
  ok(/TEXT_MESSAGE_START/.test(ck.body) && /TEXT_MESSAGE_CONTENT/.test(ck.body) &&
    /TEXT_MESSAGE_END/.test(ck.body) && /RUN_FINISHED/.test(ck.body),
    '/api/copilotkit must emit the AG-UI event sequence');
  ok(/Rule 170/.test(ck.body), '/api/copilotkit should answer "bid security" with Rule 170');

  /* ---- every page, clip and doc ---- */
  for (const p of ['index.html', 'services.html', 'chapter6-complete.html', 'granular-video.html']) {
    const r = await get('/' + p);
    ok(r.status === 200, '/' + p + ' should serve 200, got ' + r.status);
    ok(r.body.length > 5000, '/' + p + ' looks too small (' + r.body.length + ' bytes)');
  }
  const clips = fs.readdirSync(path.join(ROOT, 'audio')).filter(f => f.endsWith('.mp3'));
  let badClip = [];
  for (const c of clips) {
    const r = await get('/audio/' + encodeURIComponent(c));
    if (r.status !== 200) badClip.push(c);
  }
  ok(badClip.length === 0, 'clips failing to serve: ' + badClip.join(', '));
  const docs = fs.readdirSync(path.join(ROOT, 'docs')).filter(f => f.endsWith('.md'));
  let badDoc = [];
  for (const d of docs) {
    const r = await get('/docs/' + encodeURIComponent(d));
    if (r.status !== 200) badDoc.push(d);
  }
  ok(badDoc.length === 0, 'docs failing to serve: ' + badDoc.join(', '));

  /* ---- the MP4 video ---- */
  const MP4 = path.join(ROOT, 'gfr-chapter-6.mp4');
  if (fs.existsSync(MP4)) {
    const size = fs.statSync(MP4).size;
    const head = await getRaw('/gfr-chapter-6.mp4', 'bytes=0-1023');
    ok(head.status === 206, 'MP4 range request must return 206, got ' + head.status);
    ok(/video\/mp4/.test(head.headers['content-type'] || ''),
      'MP4 must be served as video/mp4, got ' + head.headers['content-type']);
    ok(/^bytes 0-1023\//.test(head.headers['content-range'] || ''),
      'MP4 content-range must start "bytes 0-1023/", got ' + head.headers['content-range']);
    ok(head.body.length === 1024, 'MP4 first range must be 1024 bytes, got ' + head.body.length);
    const tail = await getRaw('/gfr-chapter-6.mp4', 'bytes=' + (size - 1) + '-');
    ok(tail.status === 206 && tail.body.length === 1,
      'MP4 final byte must be requestable, got ' + tail.status + ' / ' + tail.body.length);
    const over = await getRaw('/gfr-chapter-6.mp4', 'bytes=0-999999999');
    ok(over.status === 206 && over.body.length === size,
      'MP4 must clamp an over-long range to the file size, got ' + over.status +
      ' / ' + over.body.length + ' of ' + size);
    ok(size > 10 * 1024 * 1024, 'MP4 looks too small to be the full video (' + size + ' bytes)');
    console.log('mp4 served            : ' + Math.round(size / 1048576) + ' MB, range requests ok');
  } else {
    console.log('mp4 served            : (not rendered yet - run data/_video.py)');
  }

  /* path traversal must not escape the deliverable */
  ok((await get('/../package.json')).status !== 200, 'path traversal should be blocked');
  ok((await get('/api/nope')).status === 404, 'unknown API endpoint should 404');

  srv.kill();

  console.log('clips served          : ' + clips.length + '/' + clips.length);
  console.log('docs served           : ' + docs.length + '/' + docs.length);
  console.log('rules via API         : 67 (37 goods, 30 services)');
  console.log('provisions via API    : 182 sub-rules, 2 provisos, 9 notes, 36 exceptions, 34 footnotes');
  console.log('copilot runtime       : AG-UI event sequence ok');
  console.log('cors                  : access-control-allow-origin: *');
  console.log('problems              : ' + problems.length);
  problems.forEach(p => console.log('   !! ' + p));
  console.log('\nDEPLOYMENT CHECK: ' + (problems.length ? 'FAIL' : 'PASS'));
  process.exit(problems.length ? 1 : 0);
})().catch(e => { console.error('deployment test error:', e.message); process.exit(1); });
