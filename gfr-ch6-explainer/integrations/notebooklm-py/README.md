# notebooklm-py — GFR 2017 Chapter 6

Builds a Gemini Notebook (NotebookLM) grounded on the Chapter 6 corpus, so
answers about Indian procurement rules are sourced from the verbatim rule text
instead of recalled.

## Setup

```bash
pip install "notebooklm-py[browser]"
notebooklm login --master-token --account <you@example.com>
```

The login is a one-time browser OAuth against your own Google account. This
integration never reads, writes or transmits credentials — it only invokes the
`notebooklm` CLI, which owns its profile directory.

Then regenerate the knowledge base from the deliverable's data files:

```bash
cd /path/to/gfr-ch6-explainer
node data/_docs.js
```

## Build

```bash
python3 build_notebook.py --dry-run     # list the 71 sources, upload nothing
python3 build_notebook.py               # create the notebook and upload
python3 build_notebook.py --demo        # also run three grounded chat turns
python3 build_notebook.py --title "GFR Chapter 6 — my team"
```

```
sources : 71 files, 451.8 KB
   gfr-chapter-6-complete.md     161011 bytes
   index.md                        7285 bytes
   amendments.md                   3880 bytes
   narration-transcript.md       129838 bytes
   rule-142.md                     1193 bytes
   ...
   rule-206.md                     1148 bytes

notebook : <id>
uploaded : 71/71
```

## Why 71 files and not one

- `gfr-chapter-6-complete.md` — all 67 rules verbatim plus Hinglish in one
  document, for questions that span several rules
- `rule-*.md` — one per rule, each with front-matter (`rule:`, `title:`, `part:`,
  provision counts) so retrieval lands on the right rule
- `amendments.md` — the 34 amendment footnotes, which is where the thresholds
  actually moved
- `narration-transcript.md` — the whole 65-minute video as text with timestamps,
  useful when someone wants the explanation in the order it is taught

## Verify the grounding

NotebookLM cites its sources — **read the citations**. An answer about a
threshold that does not cite the rule's amendment footnote may be the model's
number rather than the rule's.

The three orders that moved the numbers:

| Order | Date | Moved |
|---|---|---|
| DoE OM No. F.1/3/2024-PPD | 10.07.2024 | Rules 149, 155, 161, 162, 173(xxii), 183, 201 |
| DoE OM No. F.20/42/2021-PPD | 05.06.2025 | Rules 154, 155, 161, 162 (scientific equipment, off GeM) |
| DoE OM No. F.7/10/2021-PPD | 23.02.2023 | Rule 144(x) inserted |

If a notebook answer contradicts `docs/amendments.md`, the notebook is wrong —
that file is generated from the same corpus the video and the JSON API read.

## Caveats

- `build_notebook.py` was written against the `notebooklm` CLI's documented
  subcommands and `--json` output. If your version renamed a flag or changed the
  response shape, the script exits with the CLI's own error rather than failing
  silently — the mapping to fix is in the `nlm()` helper.
- The three `--demo` questions are a smoke test, not a test suite. They check the
  notebook is reachable and answering, not that every answer is correct.
- Nothing was executed against a live Google account from the workspace that
  built this — there are no credentials here, and there should not be.
