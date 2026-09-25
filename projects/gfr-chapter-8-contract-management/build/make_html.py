# -*- coding: utf-8 -*-
"""Interactive HTML companion: video + chapter seek + synced rule cards + quiz + Devanagari transcript."""
import json, html, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent; PROJ = HERE.parent
sys.path.insert(0, str(HERE))
from narration import SEGMENTS  # noqa
from beats import BEATS  # noqa

tl = json.loads((PROJ / "renders" / "timeline.json").read_text(encoding="utf-8")); E = html.escape
QUIZ = [
 {"q": "₹1.8 lakh ke printers ki supply ke liye kaunsa document banega? (Rule 225(iv)(a))", "opts": ["Purchase Order", "Formal contract", "Letter of Award only", "Kuch nahi"], "a": 0, "why": "Rule 225(iv)(a): ₹2.5 lakh tak ki simple purchase ke liye purchase order (with terms & conditions) kaafi hai."},
 {"q": "Letter of Award ke baad contract kitne din mein execute karna hai? (Rule 225(vi))", "opts": ["7 din", "15 din", "21 din", "30 din"], "a": 2, "why": "21 days; failure → award annulled and bid security (EMD) forfeited."},
 {"q": "Price Variation Clause kab allowed hai? (Rule 225(viii)(a))", "opts": ["Har contract mein", "Delivery/completion period 18 months se zyada ho", "Sirf works contracts", "Sirf imported goods"], "a": 1, "why": "PVC ordinarily sirf long-term contracts mein — delivery period exceeding 18 months; short-term mein firm & fixed price."},
 {"q": "Contract ke liye authority ka source kya hai? (Rule 224(1))", "opts": ["Article 299(1)", "Article 77", "DFPR", "Article 300"], "a": 0, "why": "Rule 224(1) — Article 299(1) of the Constitution; contract 'for and on behalf of the President of India'."},
 {"q": "DoE OM 03.06.2024 ke anusaar arbitration clause (agar rakha jaye) kis dispute value tak restrict hogi?", "opts": ["₹1 crore", "₹5 crore", "₹10 crore", "₹25 crore"], "a": 2, "why": "Disputes valued less than ₹10 crore; above that only after reasoned decision approved by Secretary / officer not below JS (MD for CPSE/PSB)."},
 {"q": "Contract close hone ke kitne saal baad koi claim entertain nahi hoga? (Rule 225(xix))", "opts": ["1 saal", "2 saal", "3 saal", "5 saal"], "a": 2, "why": "No claim after 3 years from the date of contract closure (unless contract specifies otherwise)."},
 {"q": "Arbitral award challenge karne par kitna % amount contractor ko (BG ke against) dena hai? (Rule 227A)", "opts": ["50%", "60%", "75%", "100%"], "a": 2, "why": "75% of award amount (including interest up to award date) against bank guarantee — DoE OM 29.10.2021."},
 {"q": "DoE OM 29.04.2026 (Force Majeure) ke tahat obligations kitne mahine extend ho sakti hain?", "opts": ["1–2 months", "2–4 months", "6 months", "Unlimited"], "a": 1, "why": "≥2 and ≤4 months, case-to-case, no cost/penalty, for obligations falling due on/after 28.02.2026; party must not be in default as on 27.02.2026."},
]
cards = []
for seg in SEGMENTS:
    for s, b in zip(tl["segments"][seg["id"]]["states"], BEATS[seg["id"]]["beats"]):
        if b["kind"] in ("rule", "update", "recap", "add", "trap", "hook", "quiz", "answer"):
            cards.append({"t": s["t"], "seg": seg["id"], "kind": b["kind"], "title": b.get("title") or b.get("subtitle") or "", "lines": b["lines"]})
trans = []
for blk in (PROJ / "renders" / "captions_hinglish.srt").read_text(encoding="utf-8").strip().split("\n\n"):
    ls = blk.split("\n"); m = re.match(r"(\d+):(\d+):(\d+),(\d+)", ls[1])
    trans.append((int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3]) + int(m[4]) / 1000, " ".join(ls[2:])))
fmt = lambda t: f"{int(t // 60):02}:{int(t % 60):02}"  # noqa
chap_html = "".join(f'<button class="chap" data-t="{tl["segments"][s["id"]]["start"]:.2f}"><span>{fmt(tl["segments"][s["id"]]["start"])}</span>{E(s["label"])}</button>' for s in SEGMENTS)
cards_html = "".join(f'<div class="card k-{c["kind"]}" data-t="{c["t"]:.2f}" data-seg="{c["seg"]}"><div class="ct"><b>{E(c["title"])}</b><span class="badge">{c["kind"].upper()}</span><a class="seek" data-t="{c["t"]:.2f}">▶ {fmt(c["t"])}</a></div><ul>' + "".join(f"<li>{E(l)}</li>" for l in c["lines"]) + "</ul></div>" for c in cards)
quiz_html = "".join(f'<div class="q" data-a="{q["a"]}"><p><b>Q{i + 1}.</b> {E(q["q"])}</p>' + "".join(f'<button class="opt" data-i="{j}">{E(o)}</button>' for j, o in enumerate(q["opts"])) + f'<div class="why">{E(q["why"])}</div></div>' for i, q in enumerate(QUIZ))
trans_html = "".join(f'<p class="tr" data-t="{t:.2f}"><a class="seek" data-t="{t:.2f}">{fmt(t)}</a> {E(s)}</p>' for t, s in trans)
seg_json = json.dumps([{"id": s["id"], "label": s["label"], "start": tl["segments"][s["id"]]["start"]} for s in SEGMENTS], ensure_ascii=False)

page = f"""<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GFR 2017 Chapter 8 — Contract Management | Hinglish Interactive Explainer</title>
<style>
:root{{--navy:#14213D;--saf:#E87722;--teal:#118A8A;--ivory:#F6F1E7;--ink:#1e1e24}}
*{{box-sizing:border-box}}body{{margin:0;font-family:Inter,system-ui,"Noto Sans Devanagari",sans-serif;background:var(--ivory);color:var(--ink)}}
header{{background:var(--navy);color:#fff;padding:18px 28px;border-bottom:5px solid var(--saf)}}header h1{{margin:0;font-size:22px}}header p{{margin:4px 0 0;opacity:.8;font-size:14px}}
main{{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(320px,1fr);gap:20px;padding:20px 28px;max-width:1700px;margin:auto}}
video{{width:100%;border-radius:14px;background:#000;box-shadow:0 10px 30px rgba(0,0,0,.18)}}
.dl{{display:inline-block;margin:8px 8px 0 0;padding:8px 14px;border-radius:8px;background:var(--saf);color:#fff;text-decoration:none;font-weight:600;font-size:14px}}
.chaps{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:8px;margin-top:14px}}
.chap{{text-align:left;border:1px solid #d8d2c4;background:#fff;border-radius:10px;padding:8px 10px;cursor:pointer;font-size:14px}}.chap span{{display:inline-block;background:var(--navy);color:#fff;border-radius:6px;padding:1px 6px;margin-right:8px;font-size:12px}}
.chap.on{{border-color:var(--saf);box-shadow:0 0 0 2px var(--saf) inset}}
aside{{max-height:calc(100vh - 140px);overflow:auto;position:sticky;top:12px}}h2{{font-size:17px;margin:18px 0 8px;color:var(--navy)}}
.card{{background:#fffdf8;border-radius:12px;padding:10px 14px;margin:8px 0;border-left:6px solid var(--navy);box-shadow:0 2px 8px rgba(0,0,0,.06);display:none}}.card.show{{display:block}}.card.now{{outline:2px solid var(--saf)}}
.card.k-update{{border-color:var(--saf)}}.card.k-trap{{border-color:#c43737}}.card.k-hook{{border-color:var(--teal)}}.card.k-answer{{border-color:#219653}}.card.k-quiz{{border-color:var(--saf)}}
.ct{{display:flex;gap:8px;align-items:center}}.badge{{font-size:10px;background:#eee;border-radius:6px;padding:2px 6px}}.seek{{margin-left:auto;color:var(--teal);cursor:pointer;font-size:12px;text-decoration:none}}
.card ul{{margin:6px 0 0;padding-left:18px;font-size:14px}}.card li{{margin:3px 0}}
section{{grid-column:1/-1;background:#fff;border-radius:14px;padding:18px 22px;box-shadow:0 2px 10px rgba(0,0,0,.05)}}
.q{{border:1px solid #e6e0d2;border-radius:10px;padding:10px 14px;margin:10px 0}}.opt{{display:inline-block;margin:4px 6px 4px 0;padding:6px 12px;border-radius:8px;border:1px solid #cfc8b8;background:#faf7f0;cursor:pointer}}
.opt.ok{{background:#d8f3e3;border-color:#219653}}.opt.bad{{background:#fbd9d9;border-color:#c43737}}.why{{display:none;margin-top:8px;font-size:14px;color:#333;background:#f3f6fb;padding:8px;border-radius:8px}}.q.done .why{{display:block}}
.tr{{font-size:15px;line-height:1.7;margin:4px 0}}.tr.now{{background:#fff3e3;border-radius:6px}}.tr .seek{{margin:0 8px 0 0;font-family:monospace}}
.tag{{display:inline-block;font-size:11px;border-radius:5px;padding:1px 6px;margin-right:6px;color:#fff}}.cur{{background:#219653}}.amd{{background:var(--saf)}}.unc{{background:#888}}
footer{{padding:20px 28px;font-size:13px;color:#555}}@media(max-width:1000px){{main{{grid-template-columns:1fr}}aside{{position:static;max-height:none}}}}
</style></head><body>
<header><h1>GFR 2017 · Chapter 8 · Contract Management (Rules 224–227A) — Simple Hinglish Interactive Explainer</h1>
<p>Text basis: DoE compiled GFR 2017 "updated up to 31.01.2026" · Overlays: DoE OM F.1/9/2021-PPD (29.10.2021), DoE OM F.1/2/2024-PPD (03.06.2024), DoE OM on Force Majeure (29.04.2026). DoPT issues no orders amending Chapter 8.</p></header>
<main><div>
<div style="margin-bottom:8px;font-size:13px"><label><input type="radio" name="ver" value="gfr_ch8_contract_management_captioned.mp4" checked> Captions burned-in (Devanagari)</label> &nbsp; <label><input type="radio" name="ver" value="gfr_ch8_contract_management.mp4"> Clean video + toggleable subtitle track</label></div>
<video id="v" controls preload="metadata" src="gfr_ch8_contract_management_captioned.mp4"><track kind="subtitles" srclang="hi" label="Hinglish (Devanagari)" src="captions_hinglish.vtt"></video>
<a class="dl" href="gfr_ch8_contract_management_captioned.mp4" download>⬇ Download video (captioned)</a><a class="dl" href="gfr_ch8_contract_management.mp4" download style="background:var(--navy)">⬇ Download clean video</a><a class="dl" href="captions_hinglish.srt" download style="background:var(--teal)">⬇ SRT</a>
<div class="chaps">{chap_html}</div></div>
<aside><h2>Rule cards (synced)</h2><label style="font-size:13px"><input type="checkbox" id="all"> Saare cards dikhao</label><div id="cards">{cards_html}</div></aside>
<section><h2>Self-check quiz (8 questions)</h2>{quiz_html}<p id="score"></p></section>
<section><h2>Validation status legend</h2>
<p><span class="tag cur">CURRENT</span>Rule text as in DoE compilation up to 31.01.2026 — Rules 224–227A, all 19 clauses of Rule 225.</p>
<p><span class="tag amd">AMENDED / LATEST</span>Rule 225(xiii) (audit copies ≥₹25 lakh, DoE OM 02.04.2019) · Rule 227A (inserted 29.10.2021) · e-BG (DoE OM 05.08.2022) · DoE OM 03.06.2024 (arbitration/mediation) · DoE OM 29.04.2026 (Force Majeure — West Asia).</p>
<p><span class="tag unc">UNCERTAIN</span>Rule 224 Note 2 cites the DFPR rule number differently across sources — video deliberately does not pin the number. Caption timings are estimated proportionally per sentence (±1–2 s).</p></section>
<section><h2>Transcript (Devanagari Hinglish, click to seek)</h2>{trans_html}</section></main>
<footer>Educational summary for Central Govt officials / departmental exams. Always verify against the original GFR 2017 compilation and OMs on doe.gov.in before official use.</footer>
<script>
const v=document.getElementById('v'),SEGS={seg_json};
document.querySelectorAll('.seek,.chap').forEach(b=>b.addEventListener('click',()=>{{v.currentTime=parseFloat(b.dataset.t)+0.05;v.play();}}));
const cards=[...document.querySelectorAll('.card')],trs=[...document.querySelectorAll('.tr')],chaps=[...document.querySelectorAll('.chap')],all=document.getElementById('all');
function sync(){{const t=v.currentTime;let seg=SEGS[0];for(const s of SEGS)if(t>=s.start)seg=s;chaps.forEach((c,i)=>c.classList.toggle('on',SEGS[i]===seg));
 let cur=null;cards.forEach(c=>{{const ct=parseFloat(c.dataset.t);const show=all.checked||(c.dataset.seg===seg.id&&ct<=t+0.05);c.classList.toggle('show',show);if(show&&ct<=t+0.05&&c.dataset.seg===seg.id)cur=c;c.classList.remove('now');}});
 if(cur){{cur.classList.add('now');if(!all.checked)cur.scrollIntoView({{block:'nearest'}});}}
 let ctr=null;trs.forEach(p=>{{p.classList.remove('now');if(parseFloat(p.dataset.t)<=t)ctr=p;}});if(ctr)ctr.classList.add('now');}}
v.addEventListener('timeupdate',sync);all.addEventListener('change',sync);sync();
document.querySelectorAll('input[name=ver]').forEach(r=>r.addEventListener('change',()=>{{const t=v.currentTime,p=!v.paused;v.src=r.value;v.currentTime=t;if(p)v.play();}}));
let score=0,done=0;document.querySelectorAll('.q').forEach(q=>{{q.querySelectorAll('.opt').forEach(o=>o.addEventListener('click',()=>{{if(q.classList.contains('done'))return;q.classList.add('done');done++;
 const ok=o.dataset.i===q.dataset.a;if(ok)score++;o.classList.add(ok?'ok':'bad');q.querySelector('.opt[data-i="'+q.dataset.a+'"]').classList.add('ok');
 document.getElementById('score').textContent=`Score: ${{score}} / ${{done}} attempted (total {len(QUIZ)})`;}}));}});
</script></body></html>"""
(PROJ / "renders" / "index.html").write_text(page, encoding="utf-8")
print("index.html written;", len(cards), "cards,", len(trans), "transcript lines")
