# CopilotKit — GFR 2017 Chapter 6

The most direct fit of the five platforms: `server.js` already serves an AG-UI-compatible
runtime at `/api/copilotkit`.

```bash
cd gfr-ch6-explainer && node server.js 8080
```

Then set `<CopilotKit runtimeUrl="/api/copilotkit">`. `CopilotKitExample.tsx` in this directory
is a complete component.

## What the runtime does

It is a **retrieval agent**, not an LLM call. Given a question it:

1. runs `/api/search` over all 67 rules,
2. takes the best match,
3. streams `RUN_STARTED`, `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT` (chunked), then
   `TEXT_MESSAGE_END` and `RUN_FINISHED` as SSE,
4. the content is: rule number and title, the verbatim text, the Hinglish explanation, the
   first three sub-rules, any exceptions, any amendment footnotes, the connected provisions it
   also matched, and a link to the full JSON and Markdown.

Because every word it emits comes from `data/ch6-*.js`, it cannot invent a rule number or a
threshold.

## Test it before wiring the UI

```bash
curl -N "http://localhost:8080/api/copilotkit?q=performance+security"
```

```bash
curl -N -X POST http://localhost:8080/api/copilotkit \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"Rule 155 purchase committee"}]}'
```

Both return `text/event-stream`.

## Verify the event names against your CopilotKit version

The handler emits the AG-UI event names `RUN_STARTED`, `TEXT_MESSAGE_START`,
`TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`, `RUN_FINISHED`. These are current in recent
CopilotKit releases, but the protocol has been renamed and reshaped across versions. If your
build expects different names, the mapping is a one-line change in the `send()` calls in
`server.js`:

```js
send({ type: 'RUN_STARTED', threadId: 'gfr-ch6', runId: mid });
send({ type: 'TEXT_MESSAGE_START', messageId: mid, role: 'assistant' });
send({ type: 'TEXT_MESSAGE_CONTENT', messageId: mid, delta: chunk });
send({ type: 'TEXT_MESSAGE_END', messageId: mid });
send({ type: 'RUN_FINISHED', threadId: 'gfr-ch6', runId: mid });
```

If nothing appears in the sidebar, open the browser devtools Network tab, look at the
`/api/copilotkit` response, and compare the `type` values with what your CopilotKit build
expects. That is the only thing that can be out of step — the stream itself is plain SSE with
`data: {json}` frames and no custom framing.

## Cross-origin

If the React app and the server are on different origins, use the absolute URL
(`http://localhost:8080/api/copilotkit`). The server sends
`access-control-allow-origin: *` on JSON responses, and the SSE endpoint sets
`x-accel-buffering: no` so proxies do not buffer the stream.

## If you want an LLM in the loop

Keep CopilotKit's own agent runtime and give it the JSON API as tools
(`/api/search` + `/api/rules/{id}`). The guarantee then still holds: the model reads retrieved
verbatim text instead of recalling it.
