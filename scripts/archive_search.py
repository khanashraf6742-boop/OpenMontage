#!/usr/bin/env python3
"""archive_search.py — look for the *specific* wedding nasheed on archive.org.

Writes .nasheed-probe/manifest.txt with every candidate (item, file, title,
duration) and downloads files whose names/metadata clearly indicate a wedding
nasheed, so the result can be verified before use.
"""
import json
import os
import re
import subprocess
import urllib.parse
import urllib.request

OUT = ".nasheed-probe"
os.makedirs(OUT, exist_ok=True)
LOG = os.path.join(OUT, "manifest.txt")
UA = "Mozilla/5.0 (X11; Linux x86_64) nasheed-probe/1.0"
KEY = ("wedding", "zafaf", "zaffa", "zifaaf", "urusi", "zawaj", "nikah",
       "زفاف", "زفة", "عرس", "أفراح", "افراح", "afrah", "farah", "joy")
MUSIC_EXT = (".mp3", ".ogg", ".flac", ".m4a", ".opus", ".wav")


def log(*a):
    line = " ".join(str(x) for x in a)
    print(line, flush=True)
    with open(LOG, "a") as f:
        f.write(line + "\n")


def get(url, timeout=45, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
    return raw if binary else raw.decode("utf-8", "replace")


def duration(path):
    try:
        p = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", path], capture_output=True, text=True, timeout=120)
        return float((p.stdout or "0").strip() or 0)
    except Exception:
        return 0.0


QUERIES = [
    '(creator:(Muqit) OR creator:(المقيط)) AND mediatype:(audio)',
    'title:("wedding nasheed")',
    '(title:(زفاف) OR title:(أفراح) OR title:(زفة)) AND mediatype:(audio)',
    '"Muhammad Al Muqit" AND mediatype:(audio)',
]

seen = set()
downloaded = 0
for q in QUERIES:
    url = ("https://archive.org/advancedsearch.php?q=" + urllib.parse.quote(q) +
           "&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&rows=50&page=1&output=json")
    try:
        js = json.loads(get(url))
    except Exception as e:
        log("query failed:", q[:60], type(e).__name__, str(e)[:100])
        continue
    docs = js.get("response", {}).get("docs", [])
    log(f"\n### query: {q}  -> {len(docs)} items")
    for d in docs:
        ident = d.get("identifier")
        if not ident or ident in seen:
            continue
        seen.add(ident)
        title = str(d.get("title") or "")
        try:
            meta = json.loads(get(f"https://archive.org/metadata/{ident}"))
        except Exception:
            continue
        files = meta.get("files") or []
        log(f"\nITEM {ident} :: {title[:120]}")
        for f in files:
            name = str(f.get("name") or "")
            if not name.lower().endswith(MUSIC_EXT):
                continue
            ftitle = str(f.get("title") or "")
            blob = f"{title} {name} {ftitle}".lower()
            if not any(k.lower() in blob for k in KEY):
                continue
            size = int(f.get("size") or 0)
            log(f"   CAND {name[:110]}  size={size/1e6:.1f}MB  title={ftitle[:60]}")
            if downloaded >= 4 or size > 60e6:
                continue
            u = f"https://archive.org/download/{ident}/{urllib.parse.quote(name)}"
            dst = os.path.join(OUT, f"cand{downloaded}_{re.sub(r'[^A-Za-z0-9._-]', '_', name)[:60]}")
            try:
                data = get(u, timeout=600, binary=True)
                with open(dst, "wb") as fh:
                    fh.write(data)
                dur = duration(dst)
                log(f"   -> downloaded {dst} dur={dur:.1f}s")
                if dur < 20:
                    os.remove(dst)
                else:
                    downloaded += 1
            except Exception as e:
                log("   -> dl failed", type(e).__name__, str(e)[:100])

log(f"\nDONE candidates={downloaded}")
