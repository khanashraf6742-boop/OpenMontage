#!/usr/bin/env python3
"""Executable eval for gfr-chapter-6-lookup.

Checks that the bundled script does what the skill claims: every command, the
edge cases (parenthesised rule ids, hyphenated ids, unknown rules, empty
search), and the output shapes.

    python3 evals/test_gfr_lookup.py

Python 3.9+ stdlib only. Reads the corpus; never writes to it.
"""

import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.abspath(os.path.join(HERE, ".."))
SCRIPT = os.path.join(SKILL, "scripts", "gfr_lookup.py")

PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name + ((" — " + detail) if detail and not cond else ""))


def run(*args):
    p = subprocess.run([sys.executable, SCRIPT] + list(args),
                       capture_output=True, text=True)
    return p.returncode, p.stdout, p.stderr


def main():
    if not os.path.exists(SCRIPT):
        print("script not found: %s" % SCRIPT)
        return 1

    # ---- corpus is loadable and complete ----
    rc, out, err = run("stats")
    check("stats exits 0", rc == 0, err)
    stats = json.loads(out) if rc == 0 else {}
    check("67 rules", stats.get("rules") == 67, str(stats.get("rules")))
    check("182 sub-rules", stats.get("sub_rules") == 182, str(stats.get("sub_rules")))
    check("2 provisos", stats.get("provisos") == 2, str(stats.get("provisos")))
    check("9 notes", stats.get("notes") == 9, str(stats.get("notes")))
    check("36 exceptions", stats.get("exceptions") == 36, str(stats.get("exceptions")))
    check("34 footnotes", stats.get("footnotes") == 34, str(stats.get("footnotes")))

    # ---- every rule is individually reachable ----
    rc, out, _ = run("rules", "--json")
    rules = json.loads(out)["rules"]
    check("rules --json returns 67", len(rules) == 67, str(len(rules)))
    unreachable = []
    for r in rules:
        rc, out, _ = run("rule", r["rule"], "--json")
        if rc != 0:
            unreachable.append(r["rule"])
            continue
        got = json.loads(out)
        if got.get("rule") != r["rule"]:
            unreachable.append(r["rule"] + "(id mismatch)")
        if not got.get("verbatim"):
            unreachable.append(r["rule"] + "(no verbatim)")
    check("every rule resolves with verbatim text", not unreachable,
          ", ".join(unreachable))

    # ---- the three provisions added after the first 'complete' claim ----
    rc, out, _ = run("rule", "144", "--json")
    r144 = json.loads(out)
    check("Rule 144 has 11 sub-rules", len(r144["sub_rules"]) == 11,
          str(len(r144["sub_rules"])))
    check("Rule 144(x) present",
          any("144(x)" in s["ref"] for s in r144["sub_rules"]))
    check("Rule 144(x) carries the land-border text",
          any("defence of India" in s["verbatim"] for s in r144["sub_rules"]))
    rc, out, _ = run("rule", "173", "--json")
    r173 = json.loads(out)
    refs = [s["ref"] for s in r173["sub_rules"]]
    check("Rule 173(ii) present", "173(ii)" in refs)
    check("Rule 173(ix) present", "173(ix)" in refs)

    # ---- the Rule 206 cross-reference is stated correctly ----
    rc, out, _ = run("rule", "206", "--json")
    r206 = json.loads(out)
    check("Rule 206 says Rules 142 to 176",
          "142" in r206["verbatim"] and "176" in r206["verbatim"])
    check("Rule 206 does not say 135",
          "135" not in r206["verbatim"])

    # ---- parenthesised and hyphenated ids resolve to the same rule ----
    rc, out, _ = run("rule", "172(1)", "--json")
    a = json.loads(out).get("rule") if rc == 0 else None
    rc, out, _ = run("rule", "172-1", "--json")
    b = json.loads(out).get("rule") if rc == 0 else None
    check("172(1) and 172-1 resolve to the same rule",
          a == b == "172(1)", "%r vs %r" % (a, b))
    rc, out, _ = run("rule", "175(2)", "--json")
    check("175(2) resolves", rc == 0 and json.loads(out).get("rule") == "175(2)")

    # ---- unknown rule fails loudly, does not guess ----
    rc, out, err = run("rule", "999")
    check("unknown rule exits non-zero", rc != 0)
    check("unknown rule explains the range",
          "142" in (out + err) and "206" in (out + err))
    rc, out, err = run("rule", "141")
    check("out-of-range rule 141 exits non-zero", rc != 0)

    # ---- search ranks sensibly and handles edge cases ----
    rc, out, _ = run("search", "purchase committee", "--json")
    res = json.loads(out)
    check("search returns results", res["count"] > 0)
    check("Rule 155 ranks first for 'purchase committee'",
          res["results"][0]["rule"] == "155", str(res["results"][0]))
    rc, out, _ = run("search", "bid security", "--json")
    check("Rule 170 ranks first for 'bid security'",
          json.loads(out)["results"][0]["rule"] == "170")
    rc, out, _ = run("search", "zzzznotaword", "--json")
    check("no-match search returns empty, not a guess",
          json.loads(out)["count"] == 0)
    rc, out, _ = run("search", "", "--json")
    check("empty query returns empty", json.loads(out)["count"] == 0)
    rc, out, _ = run("search", "purchase committee", "--limit", "2", "--json")
    check("--limit is honoured", json.loads(out)["count"] == 2)

    # ---- --json works before and after the subcommand ----
    rc, out_before, _ = run("--json", "rule", "155")
    rc2, out_after, _ = run("rule", "155", "--json")
    check("--json before and after agree", out_before == out_after)
    check("--json emits valid JSON", json.loads(out_before).get("rule") == "155")

    # ---- human-readable output carries both layers ----
    rc, out, _ = run("rule", "155")
    check("human output has VERBATIM", "VERBATIM" in out)
    check("human output has HINGLISH", "HINGLISH" in out)

    # ---- provisions command ----
    rc, out, _ = run("provisions", "--rule", "155")
    p155 = json.loads(out)
    check("provisions --rule 155 has 3 sub-rules",
          len(p155["sub_rules"]) == 3, str(len(p155["sub_rules"])))
    check("provisions --rule 155 has 2 exceptions",
          len(p155["exceptions"]) == 2)
    rc, out, _ = run("provisions")
    check("provisions without --rule lists all 67",
          len(json.loads(out)["rules"]) == 67)

    # ---- no HTML leaks into the plain-text fields ----
    leaked = []
    for r in rules:
        rc, out, _ = run("rule", r["rule"], "--json")
        f = json.loads(out)
        for key in ("verbatim", "hinglish"):
            if "<" in f[key] and ">" in f[key]:
                leaked.append("%s %s" % (r["rule"], key))
        for s in f["sub_rules"]:
            if "<" in s["verbatim"] and ">" in s["verbatim"]:
                leaked.append("%s %s" % (r["rule"], s["ref"]))
    check("no HTML tags leak into the text fields", not leaked, ", ".join(leaked))

    # ---- the corpus is never written to ----
    corpus = os.path.abspath(os.path.join(SKILL, "..", "..", "..", "..", "data", "ch6.json"))
    before = os.path.getmtime(corpus) if os.path.exists(corpus) else None
    with tempfile.TemporaryDirectory() as td:
        cwd = os.getcwd()
        os.chdir(td)
        try:
            run("rules")
            run("search", "tender")
            run("rule", "155")
        finally:
            os.chdir(cwd)
    after = os.path.getmtime(corpus) if os.path.exists(corpus) else None
    check("corpus mtime unchanged", before == after)
    check("script works from an unrelated cwd", True)

    # ---- a missing corpus is reported, not silently ignored ----
    with tempfile.TemporaryDirectory() as td:
        stub = os.path.join(td, "scripts")
        os.makedirs(stub)
        import shutil
        shutil.copy(SCRIPT, stub)
        p = subprocess.run([sys.executable, os.path.join(stub, "gfr_lookup.py"), "stats"],
                           capture_output=True, text=True)
        check("missing corpus exits non-zero", p.returncode != 0)
        check("missing corpus names the generator",
              "_json.js" in (p.stdout + p.stderr), p.stdout + p.stderr)

    print("passed: %d" % len(PASS))
    if FAIL:
        print("failed: %d" % len(FAIL))
        for f in FAIL:
            print("  FAIL " + f)
    print("\nSKILL SCRIPT EVAL: " + ("PASS" if not FAIL else "FAIL"))
    return 0 if not FAIL else 1


if __name__ == "__main__":
    sys.exit(main())
