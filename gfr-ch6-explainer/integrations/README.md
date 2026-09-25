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
| Full narration transcript, 65:04, with timestamps | `/docs/narration-transcript.md` |
| Markdown knowledge base | `/docs/index.md` |
| JSON corpus (for non-JS consumers) | `/data/ch6.json` |
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

Full details in `../DEPLOY.md`.

---

## 2. The eight platform integrations

| Platform | Directory | How it connects | Needs |
|---|---|---|---|
| **awesome-llm-apps** | `awesome-llm-apps/gfr-chapter-6-lookup/` | a skill: `SKILL.md`, an offline lookup script, a provision map, and a 39-check eval | Python 3.9+ only |
| **notebooklm-py** | `notebooklm-py/` | builds a grounded Gemini Notebook from 71 Markdown sources | `notebooklm-py` + a Google login |
| **grok-build** | `grok-build/AGENTS.md` | project rules injected into every Grok session in this repo | Grok Build |
| **agency-agents** | `agency-agents/gfr-chapter-6-specialist.md` | a specialist agent persona that looks rules up before answering | any agent host |
| **Anything LLM** | `anythingllm/` | ingest `docs/*.md`, or the API as agent skills | Anything LLM |
| **Dify** | `dify/` | knowledge base, or import `/api/openapi.json` as tools | Dify |
| **AutoGPT** | `autogpt/` | block definitions for the API | AutoGPT |
| **Ruflo** | `ruflo/` | tool registration + a search→lookup flow | Ruflo |
| **CopilotKit** | `copilotkit/` | `runtimeUrl="/api/copilotkit"` | CopilotKit |

### The shared pattern

Every integration does the same two-step thing, because it is the only way to stop an agent
inventing a rule number:

```
question  ->  search        ->  gives rule numbers
          ->  rule lookup   ->  gives verbatim text + footnotes
          ->  compose the answer, quoting the verbatim field exactly
```

Two hops, not one. The search step prevents guessing the rule; the lookup step makes the
quote exact and surfaces the amendment footnotes — which is where the thresholds actually
moved.

### `data/ch6.json`

The data files are JavaScript, which most non-JS consumers cannot read. `node data/_json.js`
exports the same 67 rules to `data/ch6.json`. The awesome-llm-apps skill and the
notebooklm-py builder both read derived artefacts; `data/_integrations.js` fails if
`ch6.json` has drifted from the data files.

---

## 3. What the agents are *not*

`/api/copilotkit` and `scripts/gfr_lookup.py` are **retrieval, not LLM calls**. They find the
best-matching rule and return its verbatim text, Hinglish explanation, sub-rules, exceptions,
footnotes and connected provisions. No key, and no hallucinated rule number, because they only
ever emit text already present in `data/ch6-*.js`.

If you want an LLM in the loop, point your platform at the search + lookup pair and let the
model phrase the answer. The guarantee still holds: the model is reading retrieved verbatim
text rather than recalling it.

---

## 4. Accuracy caveats

- The verbatim layer is transcribed from the official GFR compilation. The Hinglish layer is
  hand-written.
- `data/_figures.js` and `data/_comics.js` check that every figure in the Hinglish layer and
  both comic episodes appears in the verbatim rule text. `data/_integrations.js` checks the
  adapters themselves. Run `bash data/_check.sh` before shipping any change.
- Three sub-rules were missing from the first "complete" version and were added after auditing
  the source: **Rule 144(x)** (land-border restrictions, OM No. F.7/10/2021-PPD dated
  23.02.2023), **Rule 173(ii)** and **Rule 173(ix)**. The tests in `data/` would not have
  caught them; the source audit did.
- Provision completeness is established by auditing the PDF, not by any test.
- None of the platform integrations was executed against a live instance of its platform from
  the workspace that built them — no credentials exist here and none should. Each is verified
  as far as it can be without the platform: the skill script and its eval run, the notebook
  builder's `--dry-run` runs, the AGENTS.md commands all exist, the persona frontmatter
  parses, and every JSON config validates.
