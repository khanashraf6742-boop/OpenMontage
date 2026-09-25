# GFR 2017 Chapter 6 — deployment & agent-platform integrations

Everything here is built from `data/ch6-goods.js` and `data/ch6-services.js`, which hold the
verbatim text of **every rule, sub-rule, clause, proviso, explanation, exception and amendment
footnote** of GFR 2017 Chapter 6 (Rules 142–206), plus a plain Hinglish explanation of each.

Source of truth: Department of Expenditure, Ministry of Finance — GFR 2017 compilation updated
to 31.01.2026. The 10.07.2024 amendments (OM No. F.1/3/2024-PPD) are in force.

---

## 1. Run it

```bash
cd gfr-ch6-explainer
node server.js 8080          # binds 0.0.0.0, no dependencies, no API keys
```

| What | URL |
|---|---|
| Granular narrated video (481 beats, 134 clips, Hinglish) | `/granular-video.html` |
| Exhaustive written reference | `/chapter6-complete.html` |
| Episode 1 — Goods comic (Rules 142–176) | `/index.html` |
| Episode 2 — Services comic (Rules 177–206) | `/services.html` |
| Markdown knowledge base | `/docs/index.md` |
| JSON API | `/api/stats`, `/api/rules`, `/api/rules/{id}`, `/api/search?q=` |
| OpenAPI 3 spec | `/api/openapi.json` |
| CopilotKit / AG-UI runtime | `/api/copilotkit` |

The API sends `access-control-allow-origin: *` on every JSON response, so browser-based
platforms can call it directly.

### Public hosting

`.github/workflows/deploy-gfr-ch6.yml` publishes the site to GitHub Pages on every push.
The repository owner must enable it once: **Settings → Pages → Source → GitHub Actions**
(the CI token in this workspace cannot enable Pages itself — it gets a 403). After that the
workflow deploys on its own. Note that GitHub Pages serves the **static** site only; the JSON
API and the copilot runtime need `node server.js` somewhere reachable.

---

## 2. The API

```bash
curl -s localhost:8080/api/stats
curl -s localhost:8080/api/rules/155
curl -s "localhost:8080/api/search?q=purchase%20committee"
curl -s "localhost:8080/api/provisions?rule=173"
```

`/api/rules/{id}` returns, for one rule: `verbatim`, `hinglish`, `sub_rules[]`
(each with `ref`, `verbatim`, `hinglish`), `provisos[]`, `notes[]`, `exceptions[]`,
`footnotes[]`. Rule ids look like `155`, `172(1)`, `175(2)` — URL-encode the parentheses or use
the hyphenated form (`172-1`); both resolve.

`/api/search` ranks rules by term frequency with a small stop-word list and weights title
matches higher. It is lexical, not semantic — a semantic retriever should use `/docs/`
embeddings instead.

---

## 3. Per-platform

### Anything LLM — `integrations/anythingllm/`
Document-and-workspace assistant. Ingest the Markdown files as documents, embed them, and chat.
Also shown: wiring the JSON API in as an agent skill so the assistant can quote verbatim text.

### Dify — `integrations/dify/`
Two routes: import `docs/gfr-chapter-6-complete.md` (or the 67 per-rule files) as a knowledge
base, or call the JSON API from an HTTP Request node. Includes an OpenAPI tool definition
Dify can import directly from `/api/openapi.json`.

### AutoGPT — `integrations/autogpt/`
Block-based tool definition for the JSON API, plus the OpenAPI schema AutoGPT can consume.

### Ruflo — `integrations/ruflo/`
Tool registration for the JSON API and the copilot runtime. Verify the exact field names against
your Ruflo version — its schema has changed between releases.

### CopilotKit — `integrations/copilotkit/`
Point the runtime at `/api/copilotkit` and drop in the React component. This is the most
direct fit: the deployed server already speaks the AG-UI event protocol over SSE.

---

## 4. What the agent is *not*

`/api/copilotkit` is a **retrieval agent over the Chapter 6 corpus**, not an LLM call. It
finds the best-matching rule, then streams the verbatim text, the Hinglish explanation, the
first few sub-rules, any exceptions, the amendment footnotes, and the connected provisions it
also matched. It needs no API key and cannot hallucinate a rule number, because it only ever
emits text already present in `data/ch6-*.js`.

If you want an LLM in the loop, point your platform at `/api/search` + `/api/rules/{id}` as
retrieval tools and let the model phrase the answer — the same guarantee then holds, because
the model is reading retrieved verbatim text rather than recalling it.

---

## 5. Accuracy caveats

- The verbatim layer is transcribed from the official GFR compilation. The Hinglish layer is
  hand-written.
- `data/_figures.js` and `data/_comics.js` check that every figure in the Hinglish layer and
  both comic episodes appears in the verbatim rule text. Run `bash data/_check.sh` before
  shipping any change.
- Three sub-rules were missing from the first "complete" version and were added after auditing
  the source: **Rule 144(x)** (land-border restrictions, OM No. F.7/10/2021-PPD dated
  23.02.2023), **Rule 173(ii)** and **Rule 173(ix)**. The tests in `data/` would not have
  caught them; the source audit did.
- Provision completeness is established by auditing the PDF, not by any test.
