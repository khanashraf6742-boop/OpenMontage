#!/usr/bin/env python3
"""nasheed_fetch.py — obtain the audio for a YouTube video from a GitHub runner
(used because the main sandbox has no general internet egress).

Strategy, in order, everything logged to .nasheed-src/attempt.log:
  1. yt-dlp with several player-client profiles
  2. Invidious instances (live list from api.invidious.io, then a seed list)
  3. Piped instances (live list, then seeds)
  4. Cobalt instances
Each candidate stream is validated with ffprobe (must decode, >30 s, audio only).
"""
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request

VIDEO_ID = "dWBgNHT4ipE"
URL = f"https://www.youtube.com/watch?v={VIDEO_ID}"
OUT_DIR = ".nasheed-src"
WORK = "work"
LOG = os.path.join(OUT_DIR, "attempt.log")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/125.0 Safari/537.36")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(WORK, exist_ok=True)
_logf = open(LOG, "a", buffering=1)


def log(*a):
    msg = " ".join(str(x) for x in a)
    print(msg, flush=True)
    _logf.write(msg + "\n")


def run(cmd, timeout=900):
    log("$", " ".join(cmd)[:400])
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        out = (p.stdout or "") + (p.stderr or "")
        for line in out.strip().splitlines()[-12:]:
            log("   |", line[:300])
        return p.returncode, out
    except subprocess.TimeoutExpired:
        log("   ! timeout")
        return 124, "timeout"


def get(url, timeout=25, data=None, headers=None, binary=False):
    h = {"User-Agent": UA, "Accept": "*/*"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
    return raw if binary else raw.decode("utf-8", "replace")


def probe(path):
    if not os.path.exists(path) or os.path.getsize(path) < 50_000:
        return None
    rc, out = run(["ffprobe", "-v", "error", "-show_entries",
                   "format=duration:stream=codec_type,codec_name",
                   "-of", "json", path], timeout=120)
    try:
        d = json.loads(out[out.index("{"):])
    except Exception:
        return None
    dur = float(d.get("format", {}).get("duration") or 0)
    streams = d.get("streams", [])
    has_audio = any(s.get("codec_type") == "audio" for s in streams)
    if has_audio and dur > 30:
        return dur
    return None


def to_wav(src, dst=os.path.join(WORK, "source.wav")):
    rc, _ = run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", src,
                 "-vn", "-ac", "2", "-ar", "44100", "-c:a", "pcm_s16le", dst])
    return probe(dst)


# ---------------------------------------------------------------- 1. yt-dlp
CLIENTS = [
    "tv,web_safari,android",
    "ios,mweb,web",
    "android_vr,web_embedded",
    "tv_simply",
    "web_creator,web",
    "",
]
for cl in CLIENTS:
    tag = (cl or "plain").replace(",", "-")
    dest = os.path.join(WORK, f"src_{tag}.%(ext)s")
    cmd = ["yt-dlp", "--no-playlist", "-f", "bestaudio/best", "-o", dest]
    if cl:
        cmd += ["--extractor-args", f"youtube:player_client={cl}"]
    cmd.append(URL)
    rc, out = run(cmd, timeout=300)
    cands = [f for f in os.listdir(WORK) if f.startswith(f"src_{tag}.")]
    if cands:
        p = os.path.join(WORK, cands[0])
        dur = probe(p)
        log(f"  -> yt-dlp[{tag}] produced {p} dur={dur}")
        if dur and to_wav(p):
            log("SUCCESS via yt-dlp client profile:", tag)
            sys.exit(0)

# ---------------------------------------------------------------- 2. Invidious
def invidious_candidates():
    urls = []
    try:
        js = json.loads(get("https://api.invidious.io/instances.json?sort_by=health", 30))
        for name, info in js:
            if info.get("type") == "https" and info.get("api", {}).get("enabled", True) is not False:
                u = info.get("uri")
                if u:
                    urls.append(u.rstrip("/"))
    except Exception as e:
        log("  invidious list failed:", e)
    seeds = ["https://inv.nadeko.net", "https://invidious.nerdvpn.de", "https://yewtu.be",
             "https://invidious.f5.si", "https://iv.melmac.space", "https://invidious.jing.rocks",
             "https://inv.tux.pizza", "https://invidious.privacyredirect.com",
             "https://iv.datura.network", "https://invidious.reallyaweso.me"]
    for s in seeds:
        if s not in urls:
            urls.append(s)
    return urls[:14]


for base in invidious_candidates():
    try:
        log("--- invidious", base)
        js = json.loads(get(f"{base}/api/v1/videos/{VIDEO_ID}", 25))
    except Exception as e:
        log("   ! ", type(e).__name__, str(e)[:120])
        continue
    fmts = [f for f in (js.get("adaptiveFormats") or [])
            if str(f.get("type", "")).startswith("audio") and f.get("url")]
    fmts.sort(key=lambda f: f.get("bitrate", 0), reverse=True)
    for f in fmts[:3]:
        try:
            p = os.path.join(WORK, "inv_stream.bin")
            with urllib.request.urlopen(urllib.request.Request(
                    f["url"], headers={"User-Agent": UA}), timeout=600) as r, open(p, "wb") as fh:
                shutil.copyfileobj(r, fh)
        except Exception as e:
            log("   ! stream err", str(e)[:120])
            continue
        dur = probe(p)
        log("   stream dur", dur)
        if dur and to_wav(p):
            log("SUCCESS via invidious:", base)
            sys.exit(0)

# ---------------------------------------------------------------- 3. Piped
PIPED = ["https://pipedapi.kavin.rocks", "https://pipedapi.adminforge.de",
         "https://api.piped.private.coffee", "https://pipedapi.reallyaweso.me",
         "https://pipedapi.drgns.space", "https://pipedapi.darkness.services"]
for base in PIPED:
    try:
        log("--- piped", base)
        js = json.loads(get(f"{base}/streams/{VIDEO_ID}", 25))
    except Exception as e:
        log("   ! ", type(e).__name__, str(e)[:120])
        continue
    auds = [a for a in (js.get("audioStreams") or []) if a.get("url")]
    auds.sort(key=lambda a: a.get("bitrate", 0), reverse=True)
    for a in auds[:3]:
        try:
            p = os.path.join(WORK, "piped_stream.bin")
            with urllib.request.urlopen(urllib.request.Request(
                    a["url"], headers={"User-Agent": UA}), timeout=600) as r, open(p, "wb") as fh:
                shutil.copyfileobj(r, fh)
        except Exception as e:
            log("   ! stream err", str(e)[:120])
            continue
        dur = probe(p)
        log("   stream dur", dur)
        if dur and to_wav(p):
            log("SUCCESS via piped:", base)
            sys.exit(0)

# ---------------------------------------------------------------- 4. Cobalt
COBALT = ["https://api.cobalt.tools", "https://co.wuk.sh", "https://cobalt-api.kwiatekmiki.com",
          "https://cobalt.255x.ru", "https://cobalt-backend.canine.tools"]
for base in COBALT:
    try:
        log("--- cobalt", base)
        body = json.dumps({"url": URL, "downloadMode": "audio",
                           "audioFormat": "mp3", "filenameStyle": "basic"}).encode()
        js = json.loads(get(base + "/", 30, data=body,
                            headers={"Accept": "application/json",
                                     "Content-Type": "application/json"}))
    except Exception as e:
        log("   ! ", type(e).__name__, str(e)[:160])
        continue
    u = js.get("url") or (js.get("audio") or "")
    if not u:
        log("   ! no url", str(js)[:160])
        continue
    try:
        p = os.path.join(WORK, "cobalt_stream.bin")
        with urllib.request.urlopen(urllib.request.Request(
                u, headers={"User-Agent": UA}), timeout=600) as r, open(p, "wb") as fh:
            shutil.copyfileobj(r, fh)
    except Exception as e:
        log("   ! dl err", str(e)[:120])
        continue
    dur = probe(p)
    log("   stream dur", dur)
    if dur and to_wav(p):
        log("SUCCESS via cobalt:", base)
        sys.exit(0)

log("DOWNLOAD_FAILED: every route exhausted")
sys.exit(1)
