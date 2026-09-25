# Anything LLM — GFR 2017 Chapter 6

Anything LLM is a document-and-workspace assistant: you give it documents, it embeds them, and
you chat over them. Two ways to use this deliverable.

## Option A — documents (recommended)

Anything LLM answers from what you upload, so upload the Chapter 6 knowledge base.

1. Start the server: `node server.js 8080` from `gfr-ch6-explainer/`.
2. Open Anything LLM → your workspace → **Upload documents**.
3. Upload either:
   - `docs/gfr-chapter-6-complete.md` — one file, all 67 rules, best if you want a single
     document to manage, **or**
   - `docs/rule-142.md` … `docs/rule-206.md` — 67 files, better retrieval granularity, since
     each file front-matter carries `rule:`, `title:`, `part:` and the provision counts.
4. **Move to workspace**, then **Save and embed**.
5. Chat. Ask things like:
   - "Rule 155 ka Local Purchase Committee kitne members ka hota hai?"
   - "Bid security kitne din valid rehta hai?"
   - "Single Tender Enquiry kab use kar sakte hain?"

Each rule file already contains the verbatim text **and** the Hinglish explanation, so answers
quote the rule and explain it in the same breath.

### Tuning

- **Context window / similarity threshold**: the rule files are short (1–3 KB), so a high
  similarity threshold works well. Start at 0.25 and lower it if answers come back empty.
- **Chunk size**: leave at default. Splitting a rule mid-way breaks the verbatim/Hinglish
  pairing, and each file is small enough not to need chunking.

## Option B — JSON API as an agent skill

If you want the assistant to fetch exact text rather than rely on embeddings, add the API as a
skill. Anything LLM's generic HTTP skill takes a name, a description, a URL and a schema.

```json
{
  "name": "gfr_rule_lookup",
  "description": "Fetch the verbatim text and Hinglish explanation of one GFR 2017 Chapter 6 rule by number. Use for any question about procurement of goods or services rules 142-206.",
  "url": "http://localhost:8080/api/rules/{id}",
  "method": "GET",
  "parameters": {
    "type": "object",
    "properties": {
      "id": { "type": "string", "description": "Rule number, e.g. 155, 172(1), 175(2)" }
    },
    "required": ["id"]
  }
}
```

```json
{
  "name": "gfr_search",
  "description": "Search all 67 rules of GFR 2017 Chapter 6 by keyword and get ranked matching rules with titles and links.",
  "url": "http://localhost:8080/api/search",
  "method": "GET",
  "parameters": {
    "type": "object",
    "properties": {
      "q": { "type": "string", "description": "Search keywords" },
      "limit": { "type": "integer", "default": 5 }
    },
    "required": ["q"]
  }
}
```

Use both together: `gfr_search` to find the rule number, `gfr_rule_lookup` to pull it in full.
That two-step pattern keeps the assistant from guessing a rule number.

## Verify the API works first

```bash
curl -s localhost:8080/api/rules/155 | head -20
curl -s "localhost:8080/api/search?q=bid+security"
```

If Anything LLM runs in Docker and the server runs on your host, `localhost` will not resolve —
use `http://host.docker.internal:8080` (Docker Desktop) or the host's LAN address.
