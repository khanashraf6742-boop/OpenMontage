#!/usr/bin/env node
/* Deployment server for the GFR 2017 Chapter 6 granular explainer.
   Serves the four interactive pages, the 134 narrated clips, the Markdown
   knowledge base, and a JSON API that agent platforms can call.

     node server.js [port]        (default 8080, binds 0.0.0.0)

   No dependencies and no API keys. The copilot endpoint is a retrieval agent
   over the Chapter 6 corpus, not an LLM call.

   Endpoints
     GET  /                              landing page with links to everything
     GET  /index.html /services.html     comic episodes
     GET  /chapter6-complete.html        exhaustive written reference
     GET  /granular-video.html           granular narrated video
     GET  /audio/<file>                  narrated clips
     GET  /docs/<file>.md                knowledge base
     GET  /api/stats                     corpus totals
     GET  /api/rules                     all rules, compact
     GET  /api/rules/<id>                one rule in full
     GET  /api/provisions?rule=<id>      sub-rules / provisos / notes / exceptions / footnotes
     GET  /api/search?q=<text>&limit=n   full-text search
     GET  /api/openapi.json              OpenAPI 3 spec
     GET  /api/copilotkit                CopilotKit / AG-UI runtime (SSE)
     GET  /healthz                       liveness
*/
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const PORT = parseInt(process.argv[2] || process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';

/* ---------- load the corpus ---------- */
const sandbox = { window: {}, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['data/ch6-goods.js', 'data/ch6-services.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
const GOODS = sandbox.window.GFR_CH6_GOODS;
const SVCS = sandbox.window.GFR_CH6_SERVICES;
const RULES = [...GOODS, ...SVCS];

const clean = s => String(s || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#9654;/g, '')
  .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const compact = r => ({
  rule: r.r,
  title: clean(r.t),
  part: GOODS.includes(r) ? 'A — Procurement of Goods' : 'B — Procurement of Services',
  sub_rules: (r.subs || []).length,
  provisos: (r.prov || []).length,
  notes: (r.note || []).length,
  exceptions: (r.ex || []).length,
  footnotes: (r.fn || []).length,
  doc: '/docs/rule-' + r.r.replace(/[()]/g, '-') + '.md',
  api: '/api/rules/' + encodeURIComponent(r.r)
});
const full = r => ({
  rule: r.r, title: clean(r.t),
  part: GOODS.includes(r) ? 'A — Procurement of Goods' : 'B — Procurement of Services',
  verbatim: clean(r.text),
  hinglish: clean(r.hi),
  sub_rules: (r.subs || []).map(s => ({ ref: clean(s.n), verbatim: clean(s.text), hinglish: clean(s.hi) })),
  provisos: (r.prov || []).map(clean),
  notes: (r.note || []).map(clean),
  exceptions: (r.ex || []).map(clean),
  footnotes: (r.fn || []).map(clean)
});
/* '172(1)' -> '172-1', matching the audio filename convention. Replacing both
   brackets with a dash leaves a trailing dash, so close the bracket instead. */
const ruleKey = s => String(s).replace(/\(/g, '-').replace(/\)/g, '')
  .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
const findRule = id => RULES.find(r => r.r === id) ||
  RULES.find(r => ruleKey(r.r) === ruleKey(id));

/* ---------- search ---------- */
const STOP = new Set(('a an the and or of to in for on is are be been by with without from that this '
  + 'it its as at not no any all may shall should must such if then than into per etc ka ke ki ko '
  + 'me mein se par hai hain na bhi aur ya').split(' '));
function search(q, limit) {
  const terms = String(q || '').toLowerCase().split(/[^a-z0-9₹%.\-]+/)
    .filter(t => t.length > 1 && !STOP.has(t));
  if (!terms.length) return [];
  const scored = [];
  RULES.forEach(r => {
    const hay = clean([r.r, r.t, r.text, r.hi,
      ...(r.subs || []).map(s => s.n + ' ' + s.text + ' ' + (s.hi || '')),
      ...(r.prov || []), ...(r.note || []), ...(r.ex || []), ...(r.fn || [])].join(' \n ')).toLowerCase();
    let score = 0;
    terms.forEach(t => {
      const n = hay.split(t).length - 1;
      if (n) score += 1 + Math.log(n);
      if (r.r === t || clean(r.t).toLowerCase().startsWith(t)) score += 3;
    });
    if (score > 0) scored.push({ score, rule: r });
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ score, rule }) => ({
    score: Math.round(score * 100) / 100, ...compact(rule)
  }));
}

/* ---------- retrieval answerer for the copilot endpoint ---------- */
function answer(question) {
  const hits = search(question, 3);
  if (!hits.length) {
    return 'Chapter 6 mein is baat par koi provision nahi mili. Rules 142 se 206 tak dhoondha — ' +
      'dusra keyword try karo, ya rule number bolo (jaise "Rule 155").';
  }
  const top = hits[0];
  const r = findRule(top.rule);
  const f = full(r);
  const L = [];
  L.push('Rule ' + f.rule + ' — ' + f.title + ' (Part ' + f.part + ')');
  L.push('');
  L.push('Verbatim: ' + f.verbatim);
  L.push('');
  L.push('Aasaan Hinglish mein: ' + f.hinglish);
  const prov = f.sub_rules.slice(0, 3);
  if (prov.length) {
    L.push('');
    L.push('Sub-rules:');
    prov.forEach(s => L.push('  • ' + s.ref + ' — ' + s.verbatim));
  }
  if (f.exceptions.length) {
    L.push('');
    L.push('Exceptions:');
    f.exceptions.slice(0, 3).forEach(e => L.push('  • ' + e));
  }
  if (f.footnotes.length) {
    L.push('');
    L.push('Amendment footnotes:');
    f.footnotes.slice(0, 3).forEach(x => L.push('  • ' + x));
  }
  if (hits.length > 1) {
    L.push('');
    L.push('Connected provisions: ' + hits.slice(1).map(h => 'Rule ' + h.rule + ' (' + h.title + ')').join(', '));
  }
  L.push('');
  L.push('Poora detail: ' + top.doc + ' ya ' + top.api);
  return L.join('\n');
}

/* ---------- static files ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.mp3': 'audio/mpeg', '.mp4': 'video/mp4',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};
/* Media needs byte ranges or the browser cannot seek a 120 MB video. */
const RANGEABLE = new Set(['.mp4', '.mp3', '.wav', '.ogg', '.webm', '.m4a']);
const PAGES = ['index.html', 'services.html', 'chapter6-complete.html', 'granular-video.html'];
function serveStatic(req, res, urlPath) {
  const rel = decodeURIComponent(urlPath.replace(/^\/+/, ''));
  const abs = path.normalize(path.join(ROOT, rel));
  if (!abs.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('not found: ' + rel);
      return;
    }
    const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
    const base = { 'content-type': type, 'cache-control': 'no-cache',
                   'accept-ranges': 'bytes' };
    const range = req.headers.range;
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (m && RANGEABLE.has(path.extname(abs).toLowerCase())) {
      const size = st.size;
      let start = m[1] === '' ? size - parseInt(m[2], 10) : parseInt(m[1], 10);
      let end = m[2] === '' ? size - 1 : parseInt(m[2], 10);
      // A last-byte-pos past the end is clamped, not rejected: players routinely
      // ask for "bytes=0-999999999" on the first request.
      if (isNaN(start) || isNaN(end) || start >= size || end < 0) {
        res.writeHead(416, Object.assign({ 'content-range': 'bytes */' + size }, base)).end();
        return;
      }
      if (start < 0) start = 0;
      if (end >= size) end = size - 1;
      res.writeHead(206, Object.assign(base, {
        'content-range': 'bytes ' + start + '-' + end + '/' + size,
        'content-length': end - start + 1
      }));
      fs.createReadStream(abs, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, Object.assign(base, { 'content-length': st.size }));
    fs.createReadStream(abs).pipe(res);
  });
}

/* ---------- OpenAPI ---------- */
function openapi() {
  const ruleSchema = {
    type: 'object',
    properties: {
      rule: { type: 'string' }, title: { type: 'string' }, part: { type: 'string' },
      verbatim: { type: 'string' }, hinglish: { type: 'string' },
      sub_rules: { type: 'array', items: { type: 'object' } },
      provisos: { type: 'array', items: { type: 'string' } },
      notes: { type: 'array', items: { type: 'string' } },
      exceptions: { type: 'array', items: { type: 'string' } },
      footnotes: { type: 'array', items: { type: 'string' } }
    }
  };
  return {
    openapi: '3.0.3',
    info: {
      title: 'GFR 2017 Chapter 6 API',
      version: '1.0.0',
      description: 'Granular, verbatim access to every rule, sub-rule, clause, proviso, ' +
        'explanation, exception and amendment footnote of GFR 2017 Chapter 6 ' +
        '(Procurement of Goods and Services, Rules 142-206). Source: Department of ' +
        'Expenditure, Ministry of Finance, GFR 2017 compilation updated to 31.01.2026.'
    },
    servers: [{ url: '/' }],
    paths: {
      '/api/stats': { get: { summary: 'Corpus totals', operationId: 'getStats',
        responses: { 200: { description: 'Totals' } } } },
      '/api/rules': { get: { summary: 'All rules, compact', operationId: 'listRules',
        parameters: [{ name: 'part', in: 'query', schema: { type: 'string', enum: ['goods', 'services'] } }],
        responses: { 200: { description: 'List of rules' } } } },
      '/api/rules/{id}': { get: { summary: 'One rule in full', operationId: 'getRule',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Rule', content: { 'application/json': { schema: ruleSchema } } } } } },
      '/api/provisions': { get: { summary: 'Sub-rules, provisos, notes, exceptions, footnotes', operationId: 'getProvisions',
        parameters: [{ name: 'rule', in: 'query', schema: { type: 'string' } }],
        responses: { 200: { description: 'Provisions' } } } },
      '/api/search': { get: { summary: 'Full-text search over Chapter 6', operationId: 'search',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }],
        responses: { 200: { description: 'Ranked rules' } } } }
    }
  };
}

/* ---------- landing page ---------- */
function landing() {
  const rows = RULES.map(r => '<tr><td><b>' + r.r + '</b></td><td>' + clean(r.t) + '</td>' +
    '<td>' + (r.subs || []).length + '</td><td>' + (r.prov || []).length + '</td><td>' +
    (r.note || []).length + '</td><td>' + (r.ex || []).length + '</td><td>' + (r.fn || []).length +
    '</td><td><a href="/api/rules/' + encodeURIComponent(r.r) + '">json</a> · ' +
    '<a href="/docs/rule-' + r.r.replace(/[()]/g, '-') + '.md">md</a></td></tr>').join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GFR 2017 · Chapter 6 — deployed</title>
<style>
:root{--teal:#0f6f7a;--ink:#1a1f24;--line:#ded5c6;--paper:#fffdf9;--muted:#6a7076}
*{box-sizing:border-box}body{margin:0;background:#f3efe7;color:var(--ink);
font-family:"Segoe UI",Roboto,Noto Sans Devanagari",system-ui,sans-serif;line-height:1.55}
.wrap{max-width:1100px;margin:0 auto;padding:18px}
header.hero{background:linear-gradient(135deg,#0a4f57,#0f6f7a 55%,#12707c);color:#fff;
border-radius:16px;padding:22px 24px;box-shadow:0 10px 30px rgba(10,60,66,.25)}
header.hero h1{margin:0 0 6px;font-size:clamp(20px,3vw,30px)}
header.hero p{margin:4px 0 0;opacity:.92}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:16px 0}
.card{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:14px}
.card a{display:block;font-weight:800;color:var(--teal);text-decoration:none;font-size:15px}
.card span{display:block;font-size:12px;color:var(--muted);margin-top:4px}
.api{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:14px;margin:16px 0}
code{background:#eae3d6;padding:1px 5px;border-radius:5px;font-size:12.5px}
table{width:100%;border-collapse:collapse;background:var(--paper);font-size:12.5px}
th,td{border:1px solid var(--line);padding:5px 7px;text-align:left}
th{background:#eae3d6}td:nth-child(n+3){text-align:center}
h2{color:var(--teal);font-size:18px;margin:22px 0 8px}
</style></head><body><div class="wrap">
<header class="hero"><h1>GFR 2017 · Chapter 6 — deployed</h1>
<p>Procurement of Goods and Services, Rules 142–206. Verbatim text plus plain Hinglish,
every rule, sub-rule, clause, proviso, explanation, exception and amendment footnote.</p>
<p>Source: Department of Expenditure, Ministry of Finance — GFR 2017 updated to 31.01.2026.</p></header>

<div class="cards">
<div class="card"><a href="/gfr-chapter-6.mp4">🎞 Download the MP4 video</a><span>2 h 10 min · 1280×720 · 120 MB · all 134 narrated slides</span></div>
<div class="card"><a href="/granular-video.html">🎬 Granular narrated video</a><span>481 beats · 7 modules · 134 studio clips · Hinglish</span></div>
<div class="card"><a href="/chapter6-complete.html">📖 Written reference</a><span>All 67 rules, every provision, searchable</span></div>
<div class="card"><a href="/index.html">▶ Episode 1 — Goods</a><span>Comic explainer, Rules 142–176</span></div>
<div class="card"><a href="/services.html">▶ Episode 2 — Services</a><span>Comic explainer, Rules 177–206</span></div>
<div class="card"><a href="/docs/narration-transcript.md">📝 Full narration transcript</a><span>All 134 clips in playback order, 130:01, with timestamps</span></div>
<div class="card"><a href="/docs/gfr-chapter-6-complete.md">📄 Complete reference (one file)</a><span>All 67 rules verbatim + Hinglish, 161 KB Markdown</span></div>
</div>

<div class="api"><b>JSON API for agents</b> — open CORS, no key needed.
<ul>
<li><code>GET /api/stats</code> — corpus totals</li>
<li><code>GET /api/rules</code> — all 67 rules, compact (<code>?part=goods|services</code>)</li>
<li><code>GET /api/rules/155</code> — one rule in full (verbatim + Hinglish + sub-rules + provisos + notes + exceptions + footnotes)</li>
<li><code>GET /api/provisions?rule=155</code> — just the provisions</li>
<li><code>GET /api/search?q=purchase+committee</code> — full-text search, ranked</li>
<li><code>GET /api/openapi.json</code> — OpenAPI 3 spec (import into AutoGPT, Dify, Ruflo)</li>
<li><code>GET /api/copilotkit</code> — CopilotKit / AG-UI runtime (SSE)</li>
<li><code>GET /docs/</code> — Markdown knowledge base for Anything LLM / Dify</li>
</ul></div>

<h2>All 67 rules</h2>
<table><tr><th>Rule</th><th>Title</th><th>Sub</th><th>Prov</th><th>Note</th><th>Exc</th><th>Foot</th><th>Get</th></tr>
${rows}</table>
<p style="font-size:12px;color:var(--muted)">Part A — Procurement of Goods, Rules 142–176 ·
Part B — Procurement of Services, Rules 177–206.</p>
</div></body></html>`;
}

function serveHtml(res, html) {
  const b = Buffer.from(html);
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache',
    'content-length': b.length });
  res.end(b);
}

/* ---------- CopilotKit / AG-UI SSE runtime ---------- */
function copilot(req, res) {
  const qs = new URL(req.url, 'http://x').searchParams;
  const question = qs.get('q') || (req.method === 'POST' ? '' : '');
  res.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache, no-transform',
    'connection': 'keep-alive',
    'x-accel-buffering': 'no'
  });
  const send = obj => { try { res.write('data: ' + JSON.stringify(obj) + '\n\n'); } catch (e) {} };
  const mid = 'msg-' + Date.now();
  let text;
  if (req.method === 'POST') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      let q = '';
      try {
        const j = JSON.parse(body || '{}');
        const msgs = j.messages || [];
        const last = msgs[msgs.length - 1];
        q = (last && (last.content || (last.parts || []).map(p => p.text).join(' '))) || '';
      } catch (e) {}
      stream(res, send, mid, answer(q));
    });
    return;
  }
  stream(res, send, mid, answer(question));
}
function stream(res, send, mid, text) {
  send({ type: 'RUN_STARTED', threadId: 'gfr-ch6', runId: mid });
  send({ type: 'TEXT_MESSAGE_START', messageId: mid, role: 'assistant' });
  const words = String(text).split(/(\s+)/);
  let i = 0;
  const tick = () => {
    if (i >= words.length) {
      send({ type: 'TEXT_MESSAGE_END', messageId: mid });
      send({ type: 'RUN_FINISHED', threadId: 'gfr-ch6', runId: mid });
      try { res.end(); } catch (e) {}
      return;
    }
    /* a few words per tick keeps the stream readable without hammering the socket */
    send({ type: 'TEXT_MESSAGE_CONTENT', messageId: mid, delta: words.slice(i, i + 6).join('') });
    i += 6;
    setTimeout(tick, 12);
  };
  tick();
}

/* ---------- router ---------- */
const json = (res, code, obj) => {
  const b = Buffer.from(JSON.stringify(obj, null, 2));
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': '*',
    'content-length': b.length
  });
  res.end(b);
};

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const p = u.pathname;
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (p === '/healthz') return json(res, 200, { ok: true, rules: RULES.length });
  if (p === '/') return serveHtml(res, landing());
  if (p === '/landing.html') return serveHtml(res, landing());
  if (p === '/api/stats') return json(res, 200, {
    rules: RULES.length,
    goods_rules: GOODS.length, services_rules: SVCS.length,
    sub_rules: RULES.reduce((a, r) => a + (r.subs || []).length, 0),
    provisos: RULES.reduce((a, r) => a + (r.prov || []).length, 0),
    notes: RULES.reduce((a, r) => a + (r.note || []).length, 0),
    exceptions: RULES.reduce((a, r) => a + (r.ex || []).length, 0),
    footnotes: RULES.reduce((a, r) => a + (r.fn || []).length, 0),
    narrated_clips: 134, beats: 481, modules: 7,
    source: 'GFR 2017, Department of Expenditure, Ministry of Finance — updated to 31.01.2026'
  });
  if (p === '/api/rules') {
    const part = u.searchParams.get('part');
    const list = (part === 'goods' ? GOODS : part === 'services' ? SVCS : RULES).map(compact);
    return json(res, 200, { count: list.length, rules: list });
  }
  if (p === '/api/openapi.json') return json(res, 200, openapi());
  if (p === '/api/search') {
    const q = u.searchParams.get('q') || '';
    const limit = Math.min(parseInt(u.searchParams.get('limit') || '10', 10), 50);
    return json(res, 200, { query: q, count: search(q, limit).length, results: search(q, limit) });
  }
  if (p === '/api/provisions') {
    const id = u.searchParams.get('rule');
    if (!id) {
      return json(res, 200, RULES.map(r => ({
        rule: r.r, title: clean(r.t),
        sub_rules: (r.subs || []).map(s => s.n), provisos: (r.prov || []).length,
        notes: (r.note || []).length, exceptions: (r.ex || []).length, footnotes: (r.fn || []).length
      })));
    }
    const r = findRule(id);
    return r ? json(res, 200, { rule: r.r, title: clean(r.t), ...full(r) })
      : json(res, 404, { error: 'no such rule: ' + id });
  }
  if (p === '/api/copilotkit') return copilot(req, res);
  const m = p.match(/^\/api\/rules\/([^/]+)$/);
  if (m) {
    const r = findRule(decodeURIComponent(m[1]));
    return r ? json(res, 200, full(r)) : json(res, 404, { error: 'no such rule: ' + m[1] });
  }
  if (p === '/api' || p === '/api/') {
    return json(res, 200, {
      name: 'GFR 2017 Chapter 6 API', rules: RULES.length,
      endpoints: ['/api/stats', '/api/rules', '/api/rules/{id}', '/api/provisions?rule={id}',
        '/api/search?q=', '/api/openapi.json', '/api/copilotkit', '/docs/{file}.md']
    });
  }
  if (p === '/docs' || p === '/docs/') return serveStatic(req, res, '/docs/index.md');
  if (p.startsWith('/api/')) return json(res, 404, { error: 'unknown endpoint: ' + p });
  return serveStatic(req, res, p);
});

server.listen(PORT, HOST, () => {
  console.log('GFR 2017 Chapter 6 — deployed');
  console.log('  listening  http://' + HOST + ':' + PORT);
  console.log('  rules      ' + RULES.length + ' (goods ' + GOODS.length + ', services ' + SVCS.length + ')');
  console.log('  pages      granular-video.html · chapter6-complete.html · index.html · services.html');
  console.log('  api        /api/stats /api/rules /api/rules/<id> /api/search /api/openapi.json /api/copilotkit');
  console.log('  docs       /docs/index.md  (+ ' + RULES.length + ' rule files, transcript, amendments)');
});
