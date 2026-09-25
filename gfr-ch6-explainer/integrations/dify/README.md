# Dify — GFR 2017 Chapter 6

Two routes: a knowledge base, or an HTTP tool calling the JSON API. Use both — the knowledge
base for explanation, the tool for verbatim quoting.

## Route A — knowledge base

1. `node server.js 8080` from `gfr-ch6-explainer/` (or use the files straight off disk).
2. Dify → **Knowledge** → **Create knowledge base** → **Import from text file**.
3. Import either `docs/gfr-chapter-6-complete.md` (single document, all 67 rules) or the 67
   `docs/rule-*.md` files (better granularity — each carries front-matter with `rule:`,
   `title:`, `part:`).
4. Use **General** segmentation with the default chunk settings; the files are 1–3 KB and
   already self-contained per rule.
5. Attach the knowledge base to your app, or use it inside a workflow's **Knowledge Retrieval**
   node.

## Route B — HTTP tool

Dify can import an OpenAPI schema directly:

**Tools → Create tool → Import from OpenAPI/Swagger** → paste
`http://localhost:8080/api/openapi.json`.

That registers five operations: `getStats`, `listRules`, `getRule`, `getProvisions`, `search`.
Dify needs a base URL too — set it to `http://localhost:8080`.

If you would rather build the tool by hand, this is the schema Dify expects:

```yaml
paths:
  /api/rules/{id}:
    get:
      summary: Get one GFR 2017 Chapter 6 rule in full
      operationId: getRule
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: "Rule number: 155, 172(1), 175(2), 206"
      responses:
        "200":
          description: >
            Returns verbatim, hinglish, sub_rules[], provisos[], notes[],
            exceptions[], footnotes[]
  /api/search:
    get:
      summary: Search Chapter 6 rules by keyword
      operationId: search
      parameters:
        - name: q
          in: query
          required: true
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 5
      responses:
        "200":
          description: Ranked list of matching rules with scores and titles
```

## Route C — copilot runtime as a chat backend

Dify's chatflow can also consume the AG-UI stream directly if you prefer the retrieval agent
over a model call:

```bash
curl -N "http://localhost:8080/api/copilotkit?q=performance+security+kitne+din+valid"
```

Returns `text/event-stream` with `RUN_STARTED`, `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`,
`TEXT_MESSAGE_END`, `RUN_FINISHED`. POST a JSON body with `{"messages":[{"role":"user",
"content":"..."}]}` instead of `?q=` if your client speaks that shape.

## Workflow shape that works well

```
User question
   |
   v
Knowledge Retrieval (docs/)  ---> found? ---> LLM answers with citations
   |                                  |
   +--> HTTP: /api/search?q=... ------+
            |
            v
        HTTP: /api/rules/{id}   (pull verbatim + footnotes)
            |
            v
        LLM phrases the answer from retrieved text
```

The second HTTP hop matters: it lets the answer quote the rule exactly, and lets the amendment
footnotes (the 10.07.2024 threshold changes, the Scientific Ministries relaxations, the
land-border restriction) reach the user. Those footnotes are where the numbers actually changed,
and a model recalling them from memory will get them wrong.

## Caveats

- The search is lexical, not semantic. It matches keywords in the rule text; it does not
  understand "how much can I buy without a tender". If users phrase questions conceptually,
  rely on Dify's own embedding-based knowledge retrieval and use the API for exact lookups.
- If Dify runs in Docker, `localhost` points at the container. Use `host.docker.internal:8080`
  or the host's LAN address.
- `/api/copilotkit` is a retrieval agent, not an LLM. It cannot rephrase beyond assembling the
  retrieved rule. Route it through a model if you want conversational phrasing.
