# AutoGPT — GFR 2017 Chapter 6

AutoGPT drives itself through blocks, so the cleanest integration is a pair of HTTP blocks
that call the deployed API. No plugin build, no server-side LLM.

## Start the server

```bash
cd gfr-ch6-explainer && node server.js 8080
```

## Option A — import the OpenAPI schema

AutoGPT can build blocks from an OpenAPI document:

```bash
curl -s localhost:8080/api/openapi.json
```

Paste that into the block builder, set the base URL to `http://localhost:8080`, and it will
create `getStats`, `listRules`, `getRule`, `getProvisions` and `search`.

## Option B — two hand-built blocks

`tools.json` in this directory is the same schema in a friendlier shape. The two blocks that
matter:

**1. `gfr_search`** — `GET http://localhost:8080/api/search?q={query}`
Finds the rule number when the user does not give one.

**2. `gfr_get_rule`** — `GET http://localhost:8080/api/rules/{rule}`
Pulls the verbatim text, the Hinglish explanation, every sub-rule, proviso, note, exception and
amendment footnote for that rule.

## Block wiring that works

```
user question
   -> gfr_search(query)          -> gives rule numbers
   -> gfr_get_rule(rule number)  -> gives verbatim text + footnotes
   -> agent composes the answer, quoting `verbatim` exactly
```

Two hops, not one. The search step is what stops the agent inventing a rule number; the lookup
step is what makes the quote exact.

## Prompt guidance to give the agent

```
You have access to GFR 2017 Chapter 6 (Rules 142-206), procurement of goods and services.
Always look a rule up before answering. Never state a threshold, time limit, authority or
penalty from memory.
Quote the `verbatim` field word for word. Use the `hinglish` field only to explain.
Always read the `footnotes` array before answering anything about a threshold: the
10.07.2024 amendment (OM No. F.1/3/2024-PPD) changed Rules 149, 155, 161, 162, 173(xxii),
183 and 201, and the Scientific Ministries relaxation (OM No. F.20/42/2021-PPD dated
05.06.2025) changed Rules 154, 155, 161 and 162 for scientific equipment bought off GeM.
If the API returns no match, say so. Do not guess a rule number.
```

## Known limitation

`/api/search` is lexical — it matches keywords present in the rule text. "How much can I buy
without a tender" will not match Rule 155 well, because that phrase does not appear in it.
Give the agent the `gfr_provisions` block too so it can list provision titles and pick from
those, or use `/docs/` with an embedding-based retriever if you have one.

## Docker note

If AutoGPT runs in a container, `localhost:8080` points at the container. Use
`http://host.docker.internal:8080` or the host's LAN IP.
