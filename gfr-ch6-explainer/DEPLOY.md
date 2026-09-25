# Deploying the GFR 2017 Chapter 6 explainer

Three ways to put this in front of people, depending on what you need.

---

## 1. Run the server (full functionality)

```bash
cd gfr-ch6-explainer
node server.js 8080            # add a port argument if 8080 is taken
```

No dependencies, no build step, no API keys. Node 18+.

| URL | What |
|---|---|
| `http://localhost:8080/` | landing page — links to everything, plus the full 67-rule table |
| `/granular-video.html` | the granular narrated video — 481 beats, 7 modules, 134 clips, Hinglish |
| `/chapter6-complete.html` | exhaustive written reference, searchable |
| `/index.html` | Episode 1 comic — Goods, Rules 142–176 |
| `/services.html` | Episode 2 comic — Services, Rules 177–206 |
| `/audio/*.mp3` | all 153 narrated clips |
| `/docs/*.md` | Markdown knowledge base (70 files) |
| `/api/*` | JSON API (see below) |

### Behind a proxy

The server binds `0.0.0.0` and sends `access-control-allow-origin: *` on every JSON response,
so it works behind a reverse proxy or across origins without extra config. The SSE endpoint
sends `x-accel-buffering: no` so nginx does not buffer the copilot stream.

### JSON API

```
GET /api/stats                    corpus totals
GET /api/rules                    all 67 rules, compact  (?part=goods|services)
GET /api/rules/155                one rule in full
GET /api/provisions?rule=155      sub-rules, provisos, notes, exceptions, footnotes
GET /api/search?q=...             full-text search, ranked
GET /api/openapi.json             OpenAPI 3 spec
GET /api/copilotkit               CopilotKit / AG-UI runtime (SSE)
```

Rule ids look like `155`, `172(1)`, `175(2)`. URL-encode the parentheses, or use the hyphenated
form `172-1` — both resolve.

---

## 2. GitHub Pages (static only)

`.github/workflows/deploy-gfr-ch6.yml` builds and publishes the site on every push.

**One manual step, which only the repository owner can do:** Settings → Pages → Source →
**GitHub Actions**. The CI token used here cannot enable Pages (it gets a 403 from the API), so
this cannot be done from the workspace.

Once enabled, the workflow:

1. regenerates `docs/` from the data files, so the Markdown knowledge base can never go stale;
2. copies the four HTML pages, `audio/`, `data/`, `docs/` and `integrations/` into `site/`;
3. uploads it as a Pages artifact and deploys.

`/` serves `index.html`, which is the Episode 1 comic — it links to the video, the written
reference and Episode 2, so it works as a landing page.

**Pages serves static files only.** The JSON API, the copilot runtime and the search box in
`chapter6-complete.html` need `node server.js` somewhere reachable. If you need the whole thing
on one host, use option 3.

---

## 3. Container

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY gfr-ch6-explainer/ .
EXPOSE 8080
CMD ["node", "server.js", "8080"]
```

```bash
docker build -t gfr-ch6-explainer -f - . < Dockerfile
docker run -p 8080:8080 gfr-ch6-explainer
```

The server has no dependencies, so there is nothing to install and no `npm install` step.

---

## Verifying a deployment

```bash
curl -s localhost:8080/healthz
curl -s localhost:8080/api/stats
curl -s "localhost:8080/api/search?q=purchase+committee"
```

Or run the whole suite against a live server:

```bash
cd gfr-ch6-explainer
bash data/_check.sh      # 8 tests; _deploy boots the server on a scratch port itself
```

`data/_deploy.js` boots `server.js` on port 8177 and checks every endpoint, all 153 clips, all
70 docs, the CORS headers, the AG-UI event sequence, and that path traversal is blocked.

---

## Agent-platform integrations

See `integrations/README.md` for the per-platform guides:

| Platform | File | How it connects |
|---|---|---|
| Anything LLM | `integrations/anythingllm/` | ingest `docs/*.md`, or the API as agent skills |
| Dify | `integrations/dify/` | knowledge base, or import `/api/openapi.json` as tools |
| AutoGPT | `integrations/autogpt/` | block definitions for the API |
| Ruflo | `integrations/ruflo/` | tool registration + a search→lookup flow |
| CopilotKit | `integrations/copilotkit/` | `runtimeUrl="/api/copilotkit"` |

The copilot runtime is a **retrieval agent, not an LLM** — it finds the best-matching rule and
streams its verbatim text, Hinglish explanation, sub-rules, exceptions, footnotes and connected
provisions. No key, and it cannot invent a rule number, because it only emits text already in
`data/ch6-*.js`.
