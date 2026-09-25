# Ruflo — GFR 2017 Chapter 6

`tools.json` in this directory registers three HTTP tools and one two-step flow.

```bash
cd gfr-ch6-explainer && node server.js 8080
```

Then point Ruflo at `tools.json` and set `base_url` to wherever the server is reachable.

## Tools

| id | call | use |
|---|---|---|
| `gfr_search` | `GET /api/search?q=` | find the rule number from a question |
| `gfr_get_rule` | `GET /api/rules/{id}` | verbatim + Hinglish + sub-rules + provisos + notes + exceptions + footnotes |
| `gfr_provisions` | `GET /api/provisions` | provision inventory, all rules or one |

## Flow

`answer-provision-question` chains search → lookup, so an agent never states a rule number it
has not fetched.

## Verify against your Ruflo version

Ruflo's tool schema has changed between releases. `tools.json` uses the common
`type: http` / `method` / `url` / `input_schema` shape, which is the most widely supported.
If your build expects `parameters` instead of `input_schema`, or `endpoint` instead of `url`,
rename those keys — the payloads are unchanged.

The API itself is plain JSON over HTTP with `access-control-allow-origin: *`, so it will work
with any HTTP tool implementation:

```bash
curl -s "localhost:8080/api/search?q=tender"
curl -s localhost:8080/api/rules/161
```

## Caveats

- Search is lexical, not semantic. It matches keywords present in the rule text.
- The `gfr_provisions` response for all 67 rules is roughly 30 KB; pass `?rule=` when you only
  need one.
- `/api/copilotkit` also serves the AG-UI event protocol over SSE if you would rather wire the
  runtime in as a chat backend than call the tools yourself.
