# AGENTS.md — GFR 2017 Chapter 6 explainer

Project rules for Grok Build. This file is injected as a project-instructions
message at the start of every conversation in this repository.

## What this repository is

`gfr-ch6-explainer/` is a granular, interactive Hinglish explainer for **GFR 2017
Chapter 6 — Procurement of Goods and Services, Rules 142–206**. Four linked
layers, all reading the same two data files:

| Layer | File | Reads |
|---|---|---|
| Granular narrated video | `granular-video.html` | `data/ch6-goods.js`, `data/ch6-services.js`, `data/studio.js` |
| Exhaustive written reference | `chapter6-complete.html` | `data/ch6-goods.js`, `data/ch6-services.js` |
| Episode 1 comic (Goods) | `index.html` | its own inline content |
| Episode 2 comic (Services) | `services.html` | its own inline content |

`data/ch6-goods.js` and `data/ch6-services.js` are the **single source of truth**.
Everything else is derived. Change the data files, regenerate, and never edit a
generated artefact by hand.

## Non-negotiable accuracy rules

1. **Never state a rule number, threshold, time limit, authority, penalty or
   exception from memory.** Read it from the data files or the official GFR
   compilation. If you cannot verify it, say so.
2. **The verbatim layer is transcribed from the official source** — Department of
   Expenditure, Ministry of Finance, GFR 2017 compilation updated to 31.01.2026.
   Do not paraphrase it, and do not "improve" it.
3. **The Hinglish layer is hand-written.** Editing it is fine; inventing figures
   in it is not. Every figure in a `hi` field must appear in the verbatim text of
   that rule.
4. **Do not convert a reporting requirement into a prohibition.** Distinguish
   permission, sanction, approval and intimation.
5. **Name connected provisions.** If the answer depends on another rule, say so.
6. **DoPT OMs do not amend GFR.** Chapter 6 is issued and amended by the
   Department of Expenditure. Do not cite a DoPT OM for a procurement threshold.
7. **Rules 148 and 156 are deleted.** Say so rather than quoting them.

## Regeneration commands

Run from `gfr-ch6-explainer/`:

```bash
node data/_docs.js          # regenerate docs/*.md from the data files
node data/_json.js          # regenerate data/ch6.json for non-JS consumers
node data/_transcript.js    # regenerate docs/narration-transcript.md
bash data/_check.sh         # run all nine verification tests
```

**Never edit `docs/` or `data/ch6.json` by hand.** They are generated.

## Before you claim anything works

```bash
cd gfr-ch6-explainer && bash data/_check.sh
```

Nine tests. If any fails, the change is not done. In particular:

- `data/_verify.js` — mapping matches segmentation, every referenced clip exists
- `data/_e2e.js` — the player's own `buildSegments()` resolves every segment
- `data/_content.js` — each clip's size matches its caption length
- `data/_ref.js` — the written reference renders every provision
- `data/_figures.js` — no figure in the Hinglish commentary is unsupported
- `data/_comics.js` — no figure or rule reference in either comic is unsupported
- `data/_deploy.js` — the API, clips, docs and CORS all work on a live server

Three sub-rules were missing from the first "complete" version — Rule 144(x),
173(ii) and 173(ix) — and every test passed while they were absent. **A passing
test suite is not evidence of coverage.** If you change coverage, audit the
provision inventory against the official PDF, not just the tests.

## Narration and audio

- `data/studio.js` maps each rule to its clip paths, in order. `data/_gen.js`
  computes the clip texts. **They must stay in sync** — `data/_transcript.js`
  fails on drift between them.
- Audio clips are MPEG-2 Layer III, 64 kbps, 24 kHz mono. Duration is exactly
  `(bytes − 45) / 8000`.
- `generate_speech` can report success while producing a materially short clip.
  Always check the resulting file size. A rule clip should land at 214–300
  bytes per character of caption; module intros at 700–880.
- Clip filenames must be URL-safe: `172(1)` becomes `v-172-1.mp3`, never
  `v-172(1).mp3`.

## Known limitations — disclose, do not paper over

- **Stale audio of similar length is not detectable** by any test here. It needs
  transcription.
- **No real-browser playback test.** No Chromium in the environment that built
  this. Caption sync and interactive controls are verified by code reasoning
  only.
- **Provision completeness is established by auditing the PDF**, not by a test.

## Style

Hinglish narration, simple and direct — Hindi sentence structure with English
technical terms, the way a government officer actually explains a rule. Not pure
English, not transliterated Hindi. Keep the existing voice; do not switch
registers mid-rule.

## Git

Work on the branch you are given. Commit with a message that says what changed
and why, not what files moved. If a push is rejected because the remote moved,
do not force-push — fetch, reconcile, and push again.
