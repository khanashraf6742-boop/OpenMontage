---
name: gfr-chapter-6-notebook
description: >-
  Build and drive a Gemini Notebook (NotebookLM) grounded on GFR 2017 Chapter 6,
  Rules 142-206, so answers about Indian procurement rules are sourced from the
  verbatim rule text rather than recalled. Use when the user wants a NotebookLM
  notebook, a grounded research notebook, or a source-cited explainer over the
  General Financial Rules, or mentions the notebooklm CLI or notebooklm-py with
  GFR, procurement, tender, GeM or Chapter 6. Requires notebooklm-py and a
  one-time Google login.
license: MIT
metadata:
  author: "Arena Agent"
  version: "1.0.0"
  source: "https://github.com/khanashraf6742-boop/OpenMontage"
---

# GFR Chapter 6 → Gemini Notebook

Turns the Chapter 6 corpus into a NotebookLM notebook whose answers are grounded
in the verbatim rule text. The point is the same as every other integration here:
**a wrong threshold is the kind of error someone acts on**, and a grounded
notebook makes that failure visible instead of silent.

## Prerequisites

```bash
pip install "notebooklm-py[browser]"
notebooklm login --master-token --account <you@example.com>   # one-time OAuth
cd <deliverable> && node data/_docs.js                        # regenerate docs/
```

`notebooklm login` needs a browser and a Google account. Nothing in this skill
reads, writes or transmits credentials — the library owns its profile directory
and this skill only calls the CLI.

## Build the notebook

```bash
python3 build_notebook.py                 # create + upload all 71 sources
python3 build_notebook.py --dry-run       # list the sources, upload nothing
python3 build_notebook.py --demo          # also run three grounded chat turns
python3 build_notebook.py --title "My GFR notebook"
```

Uploads 71 Markdown files, 452 KB: the combined 161 KB reference, the index, the
amendment trail, the full 65-minute narration transcript, and one file per rule.
The combined file gives NotebookLM a single coherent document; the per-rule files
give it fine-grained retrieval, and each carries front-matter with `rule:`,
`title:`, `part:` and the provision counts.

## Ask it things

- "Rule 155 ke tehal Local Purchase Committee kitne members ka hota hai?"
- "10 July 2024 ke amendment ke baad GeM ladder kya hai?"
- "Bid security kitne din valid rehta hai?"
- "Non-consulting services ke liye Rules 198-205 mein na aane wali circumstance
  par kaunse rules apply hote hain?"
- "Scientific Ministries ke liye Rule 154 ka threshold kya hai?"

## Verify the grounding, not just the answer

NotebookLM cites its sources. **Read the citations.** If an answer about a
threshold does not cite the rule's amendment footnote, the number may be the
model's rather than the rule's.

The footnotes are where the numbers actually moved:

| Order | Date | Moved |
|---|---|---|
| DoE OM No. F.1/3/2024-PPD | 10.07.2024 | Rules 149, 155, 161, 162, 173(xxii), 183, 201 |
| DoE OM No. F.20/42/2021-PPD | 05.06.2025 | Rules 154, 155, 161, 162 for scientific equipment off GeM |
| DoE OM No. F.7/10/2021-PPD | 23.02.2023 | Rule 144(x) inserted |

If a notebook answer contradicts `docs/amendments.md`, the notebook is wrong —
that file is generated from the same corpus the video and the API read.

## Known traps

- **Rule 206** falls back to **Rules 142–176 (goods)**, not the
  consulting-services rules.
- **Rules 148 and 156 are deleted.** A grounded notebook will say so; an
  ungrounded model will happily quote them.
- **DoPT OMs do not amend GFR.** Chapter 6 is issued by the Department of
  Expenditure. If an answer cites a DoPT OM for a procurement threshold, it is
  wrong.
- NotebookLM answers from what you upload. If `docs/` is stale, the notebook is
  stale. Regenerate it after any change to the data files.
