#!/usr/bin/env python3
"""Look up provisions of GFR 2017 Chapter 6 (Rules 142-206).

Reads data/ch6.json, which is generated from the deliverable's own data files by
`node data/_json.js`. No network, no server, no API key, no third-party
packages. Python 3.9+ stdlib only. Never writes anything.

Usage:
    gfr_lookup.py rules                          list all 67 rules
    gfr_lookup.py rule 155                       one rule in full
    gfr_lookup.py rule 172(1)                    parenthesised ids work
    gfr_lookup.py provisions --rule 155          sub-rules, provisos, notes...
    gfr_lookup.py search "purchase committee"    ranked keyword search
    gfr_lookup.py search "bid security" --json   machine-readable
    gfr_lookup.py stats                          corpus totals

Each rule is {r, t, text, hi, subs:[{n,text,hi}], prov, note, ex, fn}. The
`text` and sub-rule `text` fields are the verbatim rule text transcribed from
the official GFR 2017 compilation (updated to 31.01.2026); `hi` is a
hand-written plain Hinglish explanation.

Quote `text` verbatim. Use `hi` only to explain. Always read the `fn`
(amendment footnote) list before answering anything about a threshold - the
10.07.2024 amendment (OM No. F.1/3/2024-PPD) changed Rules 149, 155, 161, 162,
173(xxii), 183 and 201.
"""

import argparse
import json
import math
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DELIVERABLE = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
CORPUS = os.path.join(DELIVERABLE, "data", "ch6.json")

# Words the search should not waste a match on.
STOP = set("""a an the and or of to in for on is are be been by with without from that this
it its as at not no any all may shall should must such if then than into per etc ka ke ki ko
me mein se par hai hain na bhi aur ya""".split())


def load():
    """Load the corpus, with a pointer to the generator if it is missing."""
    if not os.path.exists(CORPUS):
        sys.exit("corpus not found: %s\n\nRegenerate it from the deliverable directory:\n"
                 "    node data/_json.js" % CORPUS)
    with open(CORPUS, encoding="utf-8") as fh:
        doc = json.load(fh)
    rules = list(doc.get("goods") or []) + list(doc.get("services") or [])
    if not rules:
        sys.exit("corpus is empty: %s" % CORPUS)
    return rules, doc.get("meta") or {}


def strip_html(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", str(s or ""))).strip()


def rule_key(s):
    """'172(1)' and '172-1' must find the same rule."""
    return re.sub(r"-+", "-", str(s).replace("(", "-").replace(")", "")).strip("-").lower()


def find_rule(rules, rid):
    for r in rules:
        if r.get("r") == rid:
            return r
    k = rule_key(rid)
    for r in rules:
        if rule_key(r.get("r", "")) == k:
            return r
    return None


def full(rule):
    return {
        "rule": rule.get("r"),
        "title": strip_html(rule.get("t")),
        "verbatim": strip_html(rule.get("text")),
        "hinglish": strip_html(rule.get("hi")),
        "sub_rules": [{"ref": strip_html(s.get("n")), "verbatim": strip_html(s.get("text")),
                       "hinglish": strip_html(s.get("hi"))} for s in rule.get("subs") or []],
        "provisos": [strip_html(p) for p in rule.get("prov") or []],
        "notes": [strip_html(p) for p in rule.get("note") or []],
        "exceptions": [strip_html(p) for p in rule.get("ex") or []],
        "footnotes": [strip_html(p) for p in rule.get("fn") or []],
    }


def haystack(rule):
    parts = [rule.get("r", ""), rule.get("t", ""), rule.get("text", ""), rule.get("hi", "")]
    for s in rule.get("subs") or []:
        parts += [s.get("n", ""), s.get("text", ""), s.get("hi", "")]
    for k in ("prov", "note", "ex", "fn"):
        parts += rule.get(k) or []
    return strip_html(" ".join(parts)).lower()


def search(rules, query, limit=10):
    terms = [t for t in re.split(r"[^a-z0-9]+", query.lower()) if len(t) > 1 and t not in STOP]
    if not terms:
        return []
    scored = []
    for r in rules:
        hay = haystack(r)
        score = 0.0
        for t in terms:
            hits = hay.count(t)
            if hits:
                score += 1 + math.log(hits)
            if r.get("r", "").lower() == t or strip_html(r.get("t", "")).lower().startswith(t):
                score += 3
        if score:
            scored.append((score, r))
    scored.sort(key=lambda p: -p[0])
    return [{"score": round(s, 2), "rule": r.get("r"), "title": strip_html(r.get("t"))}
            for s, r in scored[:limit]]


# ------------------------------------------------------------------ commands
def cmd_rules(rules, as_json):
    rows = [{"rule": r.get("r"), "title": strip_html(r.get("t")),
             "sub_rules": len(r.get("subs") or []), "provisos": len(r.get("prov") or []),
             "notes": len(r.get("note") or []), "exceptions": len(r.get("ex") or []),
             "footnotes": len(r.get("fn") or [])} for r in rules]
    if as_json:
        print(json.dumps({"count": len(rows), "rules": rows}, indent=2))
        return
    print("%-9s %-54s %4s %4s %4s %4s %5s" % ("RULE", "TITLE", "SUB", "PROV", "NOTE", "EXC", "FOOT"))
    for r in rows:
        print("%-9s %-54s %4d %4d %4d %4d %5d" % (
            r["rule"], r["title"][:54], r["sub_rules"], r["provisos"],
            r["notes"], r["exceptions"], r["footnotes"]))
    print("\n%d rules" % len(rows))


def cmd_rule(rules, rid, as_json):
    r = find_rule(rules, rid)
    if not r:
        sys.exit("no such rule: %s (Chapter 6 covers Rules 142-206)" % rid)
    f = full(r)
    if as_json:
        print(json.dumps(f, indent=2))
        return
    print("Rule %s - %s" % (f["rule"], f["title"]))
    print("\nVERBATIM\n  " + f["verbatim"])
    print("\nHINGLISH\n  " + f["hinglish"])
    for s in f["sub_rules"]:
        print("\n%s\n  verbatim: %s" % (s["ref"], s["verbatim"]))
        if s["hinglish"]:
            print("  hinglish: %s" % s["hinglish"])
    for label, key in (("PROVISO", "provisos"), ("NOTE / EXPLANATION", "notes"),
                       ("EXCEPTION", "exceptions"), ("AMENDMENT FOOTNOTE", "footnotes")):
        for p in f[key]:
            print("\n%s\n  %s" % (label, p))


def cmd_provisions(rules, rid, as_json):
    if rid:
        r = find_rule(rules, rid)
        if not r:
            sys.exit("no such rule: %s" % rid)
        print(json.dumps(full(r), indent=2))
        return
    rows = [{"rule": r.get("r"), "title": strip_html(r.get("t")),
             "sub_rules": [strip_html(s.get("n")) for s in r.get("subs") or []],
             "provisos": len(r.get("prov") or []), "notes": len(r.get("note") or []),
             "exceptions": len(r.get("ex") or []), "footnotes": len(r.get("fn") or [])}
            for r in rules]
    print(json.dumps({"count": len(rows), "rules": rows}, indent=2))


def cmd_stats(rules, meta, as_json):
    s = {
        "rules": len(rules),
        "sub_rules": sum(len(r.get("subs") or []) for r in rules),
        "provisos": sum(len(r.get("prov") or []) for r in rules),
        "notes": sum(len(r.get("note") or []) for r in rules),
        "exceptions": sum(len(r.get("ex") or []) for r in rules),
        "footnotes": sum(len(r.get("fn") or []) for r in rules),
        "source": meta.get("source", "GFR 2017, Department of Expenditure, Ministry of Finance"),
    }
    print(json.dumps(s, indent=2))


def main():
    ap = argparse.ArgumentParser(description="GFR 2017 Chapter 6 provision lookup")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    sub = ap.add_subparsers(dest="cmd", required=True)

    def add(name):
        # --json is accepted before OR after the subcommand, so
        # `rule 155 --json` and `--json rule 155` both work.
        sp = sub.add_parser(name)
        sp.add_argument("--json", action="store_true", default=argparse.SUPPRESS,
                        help="machine-readable output")
        return sp

    add("rules")
    add("rule").add_argument("id")
    p_prov = add("provisions")
    p_prov.add_argument("--rule", default=None)
    p_search = add("search")
    p_search.add_argument("q")
    p_search.add_argument("--limit", type=int, default=10)
    add("stats")
    args = ap.parse_args()
    if getattr(args, "json", None) is None:
        args.json = False

    rules, meta = load()
    if args.cmd == "rules":
        cmd_rules(rules, args.json)
    elif args.cmd == "rule":
        cmd_rule(rules, args.id, args.json)
    elif args.cmd == "provisions":
        cmd_provisions(rules, args.rule, args.json)
    elif args.cmd == "search":
        res = search(rules, args.q, args.limit)
        if args.json:
            print(json.dumps({"query": args.q, "count": len(res), "results": res}, indent=2))
        else:
            for r in res:
                print("%5.2f  Rule %-8s %s" % (r["score"], r["rule"], r["title"]))
            print("%d result(s)" % len(res))
    elif args.cmd == "stats":
        cmd_stats(rules, meta, args.json)


if __name__ == "__main__":
    main()
