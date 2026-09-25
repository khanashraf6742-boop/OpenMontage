---
name: gfr-chapter-6-lookup
description: >-
  Look up any provision of GFR 2017 Chapter 6 (Procurement of Goods and Services,
  Rules 142-206) verbatim, with a plain Hinglish explanation. Covers every rule,
  sub-rule, clause, sub-clause, proviso, explanation, exception and amendment
  footnote. Use when a question is about Indian government procurement rules -
  tender procedures, GeM, purchase committees, bid security, performance
  security, advance payments, e-publishing, consulting services, outsourcing,
  debarment, or the DoPT/DoE orders that changed the thresholds. Also use when
  the user asks to verify a rule number, threshold, time limit, authority or
  penalty rather than rely on memory. Runs locally and offline.
license: Apache-2.0
metadata:
  author: "Arena Agent"
  version: "1.0.0"
  source: "https://github.com/khanashraf6742-boop/OpenMontage"
---

# GFR Chapter 6 Lookup

A wrong threshold in a plain-language answer is the kind of error someone acts
on. This skill makes the agent look the rule up instead of recalling it.

Everything runs locally from `data/ch6.json`, which is generated from the
deliverable's own data files. No network, no API key, no model call. The script
cannot invent a rule number or a figure, because it only ever returns text that
is already in the corpus.

## When to use

- Any question about Indian government procurement: goods, services, works
  procedure under GFR 2017 Chapter 6
- Verifying a rule number, threshold, time limit, competent authority, penalty
  or exception before stating it
- Questions about the DoPT/DoE orders that amended Chapter 6, especially the
  10.07.2024 threshold changes and the Scientific Ministries relaxations
- Reading a rule in simple Hinglish as well as verbatim English

## Commands

```bash
python3 scripts/gfr_lookup.py rules                       # all 67 rules with counts
python3 scripts/gfr_lookup.py rule 155                    # one rule in full
python3 scripts/gfr_lookup.py rule 172(1)                 # parenthesised ids
python3 scripts/gfr_lookup.py provisions --rule 173       # sub-rules, provisos, ...
python3 scripts/gfr_lookup.py search "purchase committee" # ranked keyword search
python3 scripts/gfr_lookup.py stats                       # corpus totals
```

Add `--json` (before or after the subcommand) for machine-readable output.

`scripts/gfr_lookup.py` locates the corpus relative to itself, so it works from
any working directory. If `data/ch6.json` is missing it says so and prints the
command that regenerates it.

## How to answer a question

1. **Search first** when the user has not given a rule number.
   `search "bid security"` returns Rule 170 first, Rule 171 second.
2. **Then look the rule up** to get the full text.
3. **Quote the `verbatim` field word for word.** Use `hinglish` only to explain.
4. **Always read the `footnotes` array** before answering anything about a
   threshold. The 10.07.2024 amendment (OM No. F.1/3/2024-PPD) changed Rules 149,
   155, 161, 162, 173(xxii), 183 and 201. The Scientific Ministries relaxation
   (OM No. F.20/42/2021-PPD dated 05.06.2025) changed Rules 154, 155, 161 and 162
   for scientific equipment bought off GeM.
5. **If the search returns nothing, say so.** Do not guess a rule number. Chapter
   6 covers Rules 142-206 and nothing else.

## What the corpus holds

| | |
|---|---|
| Rules | 67 — 37 goods (142-176), 30 services (177-206) |
| Sub-rules / clauses | 182 |
| Provisos | 2 |
| Notes / explanations | 9 |
| Exceptions | 36 |
| Amendment footnotes | 34 |

Part A is Procurement of Goods (Rules 142-176). Part B is Procurement of
Services: A. Consulting Services (177-196) and B. Outsourcing of Services
(197-206).

## Traps worth knowing

- **Rule 206** sends anything not covered by Rules 198-205 to **Rules 142-176
  (goods)**, expressly *not* to the consulting-services rules.
- **Rule 144(x)** lets DoE restrict bidders from, or with commercial
  arrangements in, countries sharing a land border, on defence-of-India or
  national-security grounds (OM No. F.7/10/2021-PPD dated 23.02.2023).
- **Rule 192(iv)**: the technical weight in QCBS must never exceed 80%.
- **Rule 156** and **Rule 148** are deleted; say so rather than quoting them.
- **DoPT OMs do not amend GFR.** Chapter 6 is issued and amended by the
  Department of Expenditure, Ministry of Finance.

See `references/provision-map.md` for the full rule-by-rule map.
