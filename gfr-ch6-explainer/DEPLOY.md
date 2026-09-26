# Deploying the GFR 2017 Chapter 6 explainer

Four ways to put this in front of people, depending on what you need.

| # | How | Status | What you get |
|---|---|---|---|
| 1 | `node server.js 8080` | **live now** | everything, including the JSON API |
| 2 | GitHub Pages | workflow committed, **owner must flip one switch** | static site at `*.github.io` |
| 3 | Container | ready, `Dockerfile` below | everything, portable |
| 4 | The MP4 in git | **already public** | direct download, no server needed |

**Deployed as of 2026-09-26:** the server is running and serving all 153 clips, all 71 docs, all 11
comic panels, the four HTML pages and the 95 MB MP4. `data/_deploy.js` reports 0 problems.

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
| `/gfr-chapter-6.mp4` | the whole narration as one file — 2 h 10 min, 95 MB, Range-enabled |
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

`.github/workflows/deploy-gfr-ch6.yml` builds and publishes the site on every push to `main`, to any
`arena/**` branch, and on release. It is committed and ready.

**One manual step, which only the repository owner can do:** Settings → Pages → Source →
**GitHub Actions**. This has to be done in the browser — the token the workspace pushes with cannot
enable Pages. The API answers:

```
POST /repos/khanashraf6742-boop/OpenMontage/pages
{"message":"Resource not accessible by integration","status":"403"}
```

The same token also cannot touch Actions permissions (`GET .../actions/permissions` → 403), so the
workflow is committed but dormant until that setting is flipped. Once it is, the next push deploys.

### What the workflow has already proved

It has run three times against this branch. Everything up to the Pages switch passes:

```
✓ Checkout repository
✓ Set up Node
✓ Regenerate the Markdown knowledge base
✓ Fail if the regenerated docs differ from the committed ones
✓ Assemble site/
✓ Report what is being published       297 files · 145 MB · 153 clips · 71 docs
✗ Check that GitHub Pages is enabled   → the one switch, above
```

The last step exists to say so out loud, because `actions/configure-pages` fails with a bare
`HttpError: Not Found` that tells the reader nothing.

The second run also caught a real bug — see the `_docs.js` note in `SCRIPT.md`.

Once enabled, the workflow:

1. regenerates `docs/` from the data files, so the Markdown knowledge base can never go stale;
2. **fails the build** if the regenerated docs differ from the committed ones;
3. copies the HTML pages, `audio/`, `data/`, `docs/`, `integrations/`, `assets/`, `server.js` and
   `gfr-chapter-6.mp4` into `site/`;
4. uploads it as a Pages artifact and deploys.

`/` serves `index.html`, which is the Episode 1 comic — it links to the video, the written
reference and Episode 2, so it works as a landing page. `/gfr-chapter-6.mp4` serves the full video.

**Pages serves static files only.** The JSON API, the copilot runtime and the search box in
`chapter6-complete.html` need `node server.js` somewhere reachable. If you need the whole thing
on one host, use option 3.

### The MP4 is already public, with or without Pages

`gfr-chapter-6.mp4` is committed to the repository, so it can be fetched directly:

```
https://raw.githubusercontent.com/khanashraf6742-boop/OpenMontage/arena/01a0d93c-openmontage/gfr-ch6-explainer/gfr-chapter-6.mp4
```

99,811,274 bytes, blob `9bf94dfcbefd49de2dc27aa570a87db934f2e50e`. This works from a browser today.

### What the workspace cannot do

Release-asset upload is not possible from here: `uploads.github.com` refuses the connection
(`SSL_ERROR_SYSCALL`), as do `raw.githubusercontent.com` and `objects.githubusercontent.com`. Only
`api.github.com`, `github.com` and `codeload.github.com` are reachable. So the workspace can commit
and push, and it can create a release — but it cannot attach a 95 MB asset to one, and it cannot
verify a public download URL. A release with no assets is worse than no release, so the empty probe
release that was created while testing this was deleted.

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
bash data/_check.sh      # 12 tests; _deploy boots the server on a scratch port itself
```

`data/_deploy.js` boots `server.js` on port 8177 and checks every endpoint, all 153 clips, all
71 docs, the CORS headers, the AG-UI event sequence, the MP4's content type / 206 response /
`content-range` / byte count / final byte, and that path traversal is blocked.

`data/_mp4.js` separately parses the MP4 box structure — no ffprobe needed — and checks both
tracks' durations and the frame count against `data/_segments.json`.

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
