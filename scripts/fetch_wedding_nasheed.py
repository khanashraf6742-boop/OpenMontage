#!/usr/bin/env python3
"""fetch_wedding_nasheed.py — pull the exact 'Wedding Nasheed – Muhammad Al Muqit
(slowed + reverb)' audio (the upload referenced by the user) plus the clean
original mix, from archive.org, and report durations/bitrates.

Files land in .nasheed-src/ so they can be committed back to the branch.
"""
import json
import os
import subprocess
import urllib.parse
import urllib.request

OUT = ".nasheed-src"
os.makedirs(OUT, exist_ok=True)
UA = "Mozilla/5.0 (X11; Linux x86_64) nasheed-fetch/1.0"

# (item identifier, file name on IA, local name)
TARGETS = [
    ("wedding-nasheed-muhammad-al-muqit-slowed-reverb",
     "Wedding Nasheed - Muhammad Al Muqit _ Slowed + Reverb _.mp3",
     "wedding_nasheed_slowed_reverb.mp3"),
    ("wedding-nasheed-muhammad-al-muqit-slowed-reverb_202609",
     "Wedding Nasheed - Muhammad Al Muqit  Slowed  Reverb.mp3",
     "wedding_nasheed_slowed_reverb_b.mp3"),
    ("wedding-nasheed-muhammad-al-muqit",
     "Wedding Nasheed - Muhammad Al Muqit.mp3",
     "wedding_nasheed_original.mp3"),
]


def log(*a):
    line = " ".join(str(x) for x in a)
    print(line, flush=True)
    with open(os.path.join(OUT, "fetch.log"), "a") as f:
        f.write(line + "\n")


def probe(path):
    try:
        p = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries",
             "format=duration,bit_rate,size:stream=codec_name,sample_rate,channels",
             "-of", "json", path], capture_output=True, text=True, timeout=180)
        d = json.loads(p.stdout)
        dur = float(d["format"].get("duration") or 0)
        br = int(d["format"].get("bit_rate") or 0)
        ch = (d["streams"][0].get("channels") if d.get("streams") else None)
        sr = (d["streams"][0].get("sample_rate") if d.get("streams") else None)
        return f"dur={dur:.2f}s bitrate={br/1000:.0f}kbps {sr}Hz {ch}ch size={int(d['format'].get('size',0))/1e6:.2f}MB"
    except Exception as e:
        return f"probe failed: {e}"


ok = []
for ident, name, local in TARGETS:
    url = f"https://archive.org/download/{ident}/{urllib.parse.quote(name)}"
    dst = os.path.join(OUT, local)
    try:
        log(f"--- GET {ident} :: {name}")
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=600) as r, open(dst, "wb") as fh:
            while True:
                chunk = r.read(1 << 16)
                if not chunk:
                    break
                fh.write(chunk)
        info = probe(dst)
        log(f"    saved {dst}  {info}")
        ok.append((local, info))
    except Exception as e:
        log(f"    FAILED {type(e).__name__}: {str(e)[:160]}")
        if os.path.exists(dst):
            os.remove(dst)

with open(os.path.join(OUT, "PROBE_SOURCES.txt"), "w") as f:
    for local, info in ok:
        f.write(f"{local}: {info}\n")
log(f"done, {len(ok)} file(s)")
