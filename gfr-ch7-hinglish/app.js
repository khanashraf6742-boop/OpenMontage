/* ============================================================
   GFR Chapter 7 — Interactive Hinglish comic explainer
   Player, chapter map, rule grid, exam drill, sources
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let idx = 0;          // current scene index
let lang = 'hinglish';
let auto = true;
let audio = null;     // current HTMLAudioElement
let rafId = null;
let decisionAnswered = {};
let quizState = { i: 0, score: 0, answered: null, done: false };

/* ─────────────── views ─────────────── */
function showView(v) {
  $$('.view').forEach(el => el.classList.toggle('is-active', el.id === 'view-' + v));
  $$('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.view === v));
  if (v !== 'watch') pause(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
$$('#tabs .tab').forEach(b => b.onclick = () => showView(b.dataset.view));

/* ─────────────── watch view ─────────────── */
function renderScene(i, keepPlaying = false) {
  idx = (i + SCENES.length) % SCENES.length;
  const s = SCENES[idx];

  $('#sceneCount').textContent = `Scene ${idx + 1} / ${SCENES.length}`;
  $('#sceneTitle').textContent = s.title;
  $('#sceneRules').innerHTML = s.rules.map(r => `<span class="chip-rule">Rule ${r}</span>`).join('');
  $('#panelBadge').textContent = `Rule ${s.rules[0]}${s.rules.length > 1 ? '–' + s.rules[s.rules.length - 1] : ''}`;

  const img = $('#panelImg');
  img.src = s.panel;
  img.alt = s.alt || '';

  // bubbles
  $('#bubbles').innerHTML = s.bubbles.map((b, n) => `
    <div class="bubble ${b.side} ${b.who}" data-t="${b.t}" id="bub-${n}">
      <span class="who">${CAST[b.who].name} — ${CAST[b.who].role}</span>
      <span class="hg">${b.hg}</span><span class="hi">${b.hi}</span>
    </div>`).join('');

  // caption
  $('#captionText').innerHTML =
    `<span class="cap-hg">${s.caption.hg}</span><span class="cap-hi">${s.caption.hi}</span>`;
  $('#caption').classList.remove('show');

  // rule card
  const r = s.rule;
  $('#ruleCard').innerHTML = `
    <span class="rno">${r.no}</span>
    <h3>${r.title}</h3>
    <div class="exact">${r.exact}</div>
    <ul>${r.points.map(p => `<li>${p}</li>`).join('')}</ul>
    ${r.kv ? `<div class="kv">${Object.entries(r.kv).map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('')}</div>` : ''}
    <div class="hook"><span class="hk">Memory hook</span><span>${r.hook}</span></div>
    ${r.warn ? `<div class="warn"><b>Check:</b> ${r.warn}</div>` : ''}`;

  // decision widget
  const d = s.decision;
  const answered = decisionAnswered[s.id];
  $('#decision').innerHTML = `
    <h4>🎬 Aap hote to kya karte? (interactive)</h4>
    <div class="dq">${d.q}</div>
    ${d.opts.map((o, n) => `<button class="opt" data-n="${n}">${o.label}</button>`).join('')}
    <div id="dfb"></div>`;
  if (answered != null) markDecision(answered);
  $$('#decision .opt').forEach(btn => btn.onclick = () => {
    if (decisionAnswered[s.id] != null) return;
    decisionAnswered[s.id] = +btn.dataset.n;
    markDecision(+btn.dataset.n);
  });

  // rail highlight
  $$('#rail button').forEach(b => b.classList.toggle('active', s.rules.includes(b.dataset.rule)));

  $('#progressFill').style.width = '0%';
  $('#scanline').style.width = '0%';
  setPlayUI(false);
  if (keepPlaying) play();
}

function markDecision(n) {
  const s = SCENES[idx], d = s.decision;
  $$('#decision .opt').forEach((b, i) => {
    b.classList.toggle('correct', d.opts[i].ok);
    b.classList.toggle('wrong', i === n && !d.opts[i].ok);
    b.disabled = true;
  });
  const chosen = d.opts[n];
  $('#dfb').innerHTML = `<div class="fb">
      <b class="${chosen.ok ? 'ok' : 'no'}">${chosen.ok ? '✔ Sahi jawab' : '✘ Galat — sahi option upar green hai'}</b><br>${chosen.why}
    </div>`;
}

/* ─────────────── playback ─────────────── */
function setPlayUI(playing) {
  $('#playIcon').textContent = playing ? '❚❚' : '▶';
  $('#playLabel').textContent = playing ? 'Pause' : 'Play scene';
  $('#btnPlay').classList.toggle('playing', playing);
}

function play() {
  stopAudio();
  const s = SCENES[idx];
  audio = new Audio(s.audio);
  audio.play().then(() => {
    setPlayUI(true);
    $('#caption').classList.add('show');
    tick();
  }).catch(() => {
    // audio missing or blocked → silent timed mode using estimated duration
    setPlayUI(true);
    $('#caption').classList.add('show');
    audio = null;
    tick(performance.now());
  });
}

function pause(silent) {
  if (audio) { audio.pause(); }
  cancelAnimationFrame(rafId);
  setPlayUI(false);
  if (!silent) { /* keep caption visible */ }
}

function stopAudio() {
  if (audio) { audio.pause(); audio.currentTime = 0; audio = null; }
  cancelAnimationFrame(rafId);
}

let fallbackStart = 0;
function tick(t0) {
  const s = SCENES[idx];
  const dur = (audio && isFinite(audio.duration) && audio.duration > 0)
    ? audio.duration
    : (s.est || 60);
  const cur = audio ? audio.currentTime : ((t0 ? performance.now() - t0 : 0) / 1000);

  // bubbles
  s.bubbles.forEach((b, n) => {
    const el = $('#bub-' + n);
    if (el) el.classList.toggle('show', cur >= b.t);
  });

  const p = Math.min(100, (cur / dur) * 100);
  $('#progressFill').style.width = p + '%';
  $('#scanline').style.width = p + '%';

  if (cur >= dur) {
    setPlayUI(false);
    cancelAnimationFrame(rafId);
    if (auto) setTimeout(() => renderScene(idx + 1, true), 1100);
    return;
  }
  rafId = requestAnimationFrame(() => tick(t0));
}

$('#btnPlay').onclick = () => {
  const playing = $('#btnPlay').classList.contains('playing');
  if (playing) {
    pause(true);
    if (audio) audio.pause();
  } else {
    if (audio && audio.paused && audio.currentTime > 0) {
      audio.play(); setPlayUI(true); tick();
    } else {
      play();
    }
  }
};
$('#btnPrev').onclick = () => { stopAudio(); renderScene(idx - 1); };
$('#btnNext').onclick = () => { stopAudio(); renderScene(idx + 1); };
$('#autoNext').onchange = e => auto = e.target.checked;

/* language */
$$('.lang').forEach(b => b.onclick = () => {
  lang = b.dataset.lang;
  $$('.lang').forEach(x => x.classList.toggle('is-active', x.dataset.lang === lang));
  document.body.classList.toggle('lang-hindi', lang === 'hindi');
  $('.bubble .hg') && null;
  $$('.bubble').forEach(el => {
    el.querySelector('.hg').style.display = lang === 'hindi' ? 'none' : '';
    el.querySelector('.hi').style.display = lang === 'hindi' ? '' : 'none';
  });
});
document.body.classList.add('lang-hinglish');
$$('.bubble').forEach(el => { el.querySelector('.hi').style.display = 'none'; });

/* keyboard */
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); $('#btnPlay').click(); }
  if (e.code === 'ArrowRight') $('#btnNext').click();
  if (e.code === 'ArrowLeft') $('#btnPrev').click();
});

/* ─────────────── chapter rail ─────────────── */
$('#rail').innerHTML = RULE_INDEX.map(r =>
  `<button data-rule="${r.no}" data-scene="${r.scene}">${r.no}<span class="rt">${r.title.length > 34 ? r.title.slice(0, 33) + '…' : r.title}</span></button>`
).join('');
$$('#rail button').forEach(b => b.onclick = () => {
  const target = SCENES.findIndex(s => s.id === b.dataset.scene);
  showView('watch');
  stopAudio();
  renderScene(target);
  setTimeout(() => play(), 250);
});

/* ─────────────── rule grid ─────────────── */
$('#ruleGrid').innerHTML = RULE_INDEX.map(r => `
  <div class="rcard">
    <div class="top"><span class="num">Rule ${r.no}</span><span class="grp">${r.grp}</span></div>
    <h4>${r.title}</h4>
    <p class="exact">${r.exact}</p>
    <ul class="key">${r.key.map(k => `<li>${k}</li>`).join('')}</ul>
    <button class="go" data-scene="${r.scene}">▶ Watch scene</button>
  </div>`).join('');
$$('#ruleGrid .go').forEach(b => b.onclick = () => {
  const target = SCENES.findIndex(s => s.id === b.dataset.scene);
  showView('watch'); stopAudio(); renderScene(target);
  setTimeout(() => play(), 250);
});

/* ─────────────── quiz ─────────────── */
function renderQuiz() {
  const q = QUIZ[quizState.i];
  $('#quiz').innerHTML = `
    <div class="qmeta"><span>Question ${quizState.i + 1} of ${QUIZ.length}</span><span>Score ${quizState.score}</span></div>
    <div class="qtag">${q.tag}</div>
    <div class="qtext">${q.q}</div>
    ${q.a.map((o, n) => `<button class="opt" data-n="${n}">${o}</button>`).join('')}
    <div id="qfb"></div>`;
  $$('#quiz .opt').forEach(b => b.onclick = () => {
    if (quizState.answered != null) return;
    quizState.answered = +b.dataset.n;
    const ok = quizState.answered === q.c;
    if (ok) quizState.score++;
    $$('#quiz .opt').forEach((x, n) => {
      x.disabled = true;
      if (n === q.c) x.classList.add('correct');
      if (n === quizState.answered && !ok) x.classList.add('wrong');
    });
    $('#qfb').innerHTML = `
      <div class="qexplain"><b class="${ok ? 'ok' : 'no'}">${ok ? '✔ Sahi' : '✘ Galat'}</b> — ${q.e}</div>
      <button class="btn again" id="qnext">${quizState.i + 1 < QUIZ.length ? 'Agla sawal ▶' : 'Result dekho ▶'}</button>`;
    $('#qnext').onclick = () => {
      if (quizState.i + 1 < QUIZ.length) { quizState.i++; quizState.answered = null; renderQuiz(); }
      else showQuizResult();
    };
  });
}
function showQuizResult() {
  const pct = Math.round((quizState.score / QUIZ.length) * 100);
  const verdict = pct >= 85 ? 'Excellent — chapter pakka ho gaya!' : pct >= 60 ? 'Acchha hai — Rule 218, 219, 220, 223 dobara padho.' : 'Aur practice karo — Rule map tab se Rules 213–223 revise karo.';
  $('#quiz').innerHTML = `<div class="score">
      <div class="big">${quizState.score} / ${QUIZ.length}</div>
      <p>${verdict}</p>
      <button class="btn again" id="qagain">↻ Dobara try karo</button></div>`;
  $('#qagain').onclick = () => { quizState = { i: 0, score: 0, answered: null, done: false }; renderQuiz(); };
}
$$('#view-quiz .sec-title')[0].textContent = `Exam drill — ${QUIZ.length} questions`;
renderQuiz();

/* ─────────────── sources ─────────────── */
$('#sourcesBody').innerHTML = `
  <div class="srccard">
    <h4>Validation gate — <span class="status-pass">PASS</span></h4>
    <table>${VALIDATION.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
  </div>
  <div class="srccard">
    <h4>Sources (Tier 1 / official first)</h4>
    <table>${SOURCES.map(s => `<tr><td>${s.t}</td><td>${s.d}<br><a href="${s.u}" target="_blank" rel="noopener">${s.u}</a></td></tr>`).join('')}</table>
  </div>
  <div class="srccard">
    <h4>Disclaimer</h4>
    <p style="font-size:13.5px;color:#4b5563;margin:0">
      Yeh ek educational explainer hai, legal advice nahin. Har rule ko apne department ke
      applicable DFPR powers, internal instructions aur Department of Expenditure ki latest
      bi-annual compilation ke saath padhein. Jab bhi GFR ki kisi baat par doubt ho, Rule 5 ke
      tahat interpretation ka decision Ministry of Finance karega.
    </p>
  </div>`;

/* ─────────────── boot ─────────────── */
renderScene(0);
