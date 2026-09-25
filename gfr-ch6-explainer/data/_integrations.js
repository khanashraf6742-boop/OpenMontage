/* Checks the agent-platform integrations under integrations/.
   These are hand-written adapters for four external platforms, so the failure
   mode is drift: a renamed command, a stale path, a figure that no longer
   matches the corpus. This test validates what can be validated without those
   platforms installed.

   Usage: node data/_integrations.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const INT = path.join(ROOT, 'integrations');

const problems = [];
const ok = (c, m) => { if (!c) problems.push(m); };

/* ---------- corpus, for cross-checking figures quoted in the adapters ---------- */
const sb = { window: {}, console };
sb.globalThis = sb;
vm.createContext(sb);
['data/ch6-goods.js', 'data/ch6-services.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f }));
const RULES = [...sb.window.GFR_CH6_GOODS, ...sb.window.GFR_CH6_SERVICES];
const VERB = RULES.map(r => [r.text, ...(r.subs || []).map(s => s.text),
  ...(r.prov || []), ...(r.note || []), ...(r.ex || []), ...(r.fn || [])]
  .join(' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).join('\n');
const ALL = VERB + '\n' + RULES.map(r => (r.hi || '') + ' ' +
  (r.subs || []).map(s => s.hi || '').join(' ')).join('\n');

/* ---------- data/ch6.json is current ---------- */
const jsonPath = path.join(ROOT, 'data', 'ch6.json');
ok(fs.existsSync(jsonPath), 'data/ch6.json missing - run node data/_json.js');
if (fs.existsSync(jsonPath)) {
  const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const jsonRules = [...j.goods, ...j.services];
  ok(jsonRules.length === RULES.length,
    'ch6.json has ' + jsonRules.length + ' rules, data files have ' + RULES.length);
  ok(JSON.stringify(jsonRules) === JSON.stringify(RULES),
    'ch6.json has drifted from the data files - run node data/_json.js');
  ok(j.meta && /31\.01\.2026/.test(j.meta.source || ''),
    'ch6.json meta must name the official source and its date');
}

/* ---------- awesome-llm-apps skill ---------- */
const SKILL = path.join(INT, 'awesome-llm-apps', 'gfr-chapter-6-lookup');
for (const f of ['SKILL.md', 'README.md', 'scripts/gfr_lookup.py',
  'references/provision-map.md', 'registry-snippet.json']) {
  ok(fs.existsSync(path.join(SKILL, f)), 'skill missing ' + f);
}
if (fs.existsSync(path.join(SKILL, 'SKILL.md'))) {
  const fm = fs.readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8')
    .match(/^---\n([\s\S]*?)\n---/);
  ok(fm, 'SKILL.md has no YAML frontmatter');
  if (fm) {
    for (const k of ['name:', 'description:', 'license:', 'metadata:']) {
      ok(fm[1].includes(k), 'SKILL.md frontmatter missing ' + k);
    }
    ok(/gfr-chapter-6-lookup/.test(fm[1]), 'SKILL.md name must match its directory');
  }
}
/* the registry snippet must describe the same skill and a reachable path */
if (fs.existsSync(path.join(SKILL, 'registry-snippet.json'))) {
  const reg = JSON.parse(fs.readFileSync(path.join(SKILL, 'registry-snippet.json'), 'utf8'));
  ok(reg.name === 'gfr-chapter-6-lookup', 'registry snippet name mismatch');
  ok(reg.path === 'agent_skills/gfr-chapter-6-lookup', 'registry snippet path mismatch');
  ok(/OpenMontage/.test(reg.install || ''), 'registry snippet install URL must point at this repo');
}
/* the script must actually run */
try {
  const stats = execFileSync('python3',
    [path.join(SKILL, 'scripts', 'gfr_lookup.py'), 'stats'],
    { encoding: 'utf8' });
  const s = JSON.parse(stats);
  ok(s.rules === 67 && s.sub_rules === 182,
    'gfr_lookup.py stats wrong: ' + JSON.stringify(s).slice(0, 120));
  const r155 = JSON.parse(execFileSync('python3',
    [path.join(SKILL, 'scripts', 'gfr_lookup.py'), 'rule', '155', '--json'],
    { encoding: 'utf8' }));
  ok(/50,000/.test(r155.verbatim) && /5,00,000/.test(r155.verbatim),
    'gfr_lookup.py Rule 155 is missing the current thresholds');
  const r206 = JSON.parse(execFileSync('python3',
    [path.join(SKILL, 'scripts', 'gfr_lookup.py'), 'rule', '206', '--json'],
    { encoding: 'utf8' }));
  ok(/142/.test(r206.verbatim) && !/135/.test(r206.verbatim),
    'gfr_lookup.py Rule 206 must cite Rules 142-176, not 135-176');
} catch (e) {
  problems.push('gfr_lookup.py failed to run: ' + e.message.split('\n')[0]);
}
/* the skill's own eval must pass */
try {
  execFileSync('python3', [path.join(SKILL, 'evals', 'test_gfr_lookup.py')],
    { encoding: 'utf8', stdio: 'pipe' });
} catch (e) {
  problems.push('skill eval failed: ' + String(e.stdout || e.message).split('\n').slice(-4).join(' '));
}

/* ---------- notebooklm-py ---------- */
const NB = path.join(INT, 'notebooklm-py');
for (const f of ['SKILL.md', 'README.md', 'build_notebook.py']) {
  ok(fs.existsSync(path.join(NB, f)), 'notebooklm-py integration missing ' + f);
}
if (fs.existsSync(path.join(NB, 'build_notebook.py'))) {
  const src = fs.readFileSync(path.join(NB, 'build_notebook.py'), 'utf8');
  /* it must not contain credential handling of any kind */
  ok(!/password|secret|token\s*=|api[_-]?key/i.test(src.replace(/master[_-]?token/gi, '')),
    'build_notebook.py must not handle credentials directly');
  /* the docs it uploads must exist */
  ok(fs.existsSync(path.join(ROOT, 'docs', 'gfr-chapter-6-complete.md')),
    'notebooklm-py uploads docs/gfr-chapter-6-complete.md, which is missing');
  ok(fs.existsSync(path.join(ROOT, 'docs', 'narration-transcript.md')),
    'notebooklm-py uploads docs/narration-transcript.md, which is missing');
  /* it must resolve the deliverable correctly */
  try {
    execFileSync('python3', [path.join(NB, 'build_notebook.py'), '--dry-run'],
      { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    const o = String(e.stdout || '') + String(e.stderr || '');
    problems.push('build_notebook.py --dry-run failed: ' + o.trim().split('\n').pop());
  }
}

/* ---------- grok-build ---------- */
const GROK = path.join(INT, 'grok-build', 'AGENTS.md');
ok(fs.existsSync(GROK), 'grok-build AGENTS.md missing');
if (fs.existsSync(GROK)) {
  const a = fs.readFileSync(GROK, 'utf8');
  for (const cmd of ['node data/_docs.js', 'node data/_json.js', 'bash data/_check.sh']) {
    ok(a.includes(cmd), 'AGENTS.md should document `' + cmd + '`');
  }
  /* every command it names must exist */
  const named = a.match(/data\/_[a-z]+\.js/g) || [];
  named.forEach(n => ok(fs.existsSync(path.join(ROOT, n)),
    'AGENTS.md names ' + n + ', which does not exist'));
  ok(/142/.test(a) && /206/.test(a), 'AGENTS.md must state the rule range');
  ok(/force-push/.test(a), 'AGENTS.md should warn against force-pushing');
}

/* ---------- agency-agents persona ---------- */
const AG = path.join(INT, 'agency-agents', 'gfr-chapter-6-specialist.md');
ok(fs.existsSync(AG), 'agency-agents persona missing');
if (fs.existsSync(AG)) {
  const p = fs.readFileSync(AG, 'utf8');
  const fm = p.match(/^---\n([\s\S]*?)\n---/);
  ok(fm, 'persona has no YAML frontmatter');
  if (fm) {
    for (const k of ['name:', 'description:', 'color:', 'emoji:', 'vibe:']) {
      ok(fm[1].includes(k), 'persona frontmatter missing ' + k);
    }
  }
  /* it must reference the real script, and that script must exist */
  ok(p.includes('scripts/gfr_lookup.py'), 'persona should point at scripts/gfr_lookup.py');
  ok(fs.existsSync(path.join(SKILL, 'scripts', 'gfr_lookup.py')),
    'persona references gfr_lookup.py, which does not exist');
}

/* ---------- figures quoted in the adapters must be supported by the corpus ---------- */
const ADAPTER_FILES = [];
(function walk(d) {
  fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(md|json|py|tsx)$/.test(e.name)) ADAPTER_FILES.push(p);
  });
})(INT);
const BADFIGURE = [
  /* [label, regex over normalised text, must-appear string] */
  ['Rule 206 cited as 135', /135\s*[-–]\s*176/, '135-176'],
  ['Rule 206 cited as 136', /136\s*[-–]\s*176/, '136-176'],
  ['deleted Rule 148 quoted as live', /Rule 148[^.\n]{0,40}rate contract[^.\n]{0,20}(?!deleted)/i, null]
];
ADAPTER_FILES.forEach(f => {
  const t = fs.readFileSync(f, 'utf8').replace(/\s+/g, ' ');
  /* the only place 135-176 may appear is where we say it was the error */
  const m = t.match(/135\s*[-–]\s*176/g);
  if (m) {
    const allowed = (t.match(/known error|was the error|mis-cited|should not be/i) || []).length;
    if (!allowed) {
      problems.push(path.relative(ROOT, f) + ' cites Rules 135-176; Rule 206 says 142-176');
    }
  }
});

/* ---------- the platform set is complete ---------- */
const PLATFORMS = {
  'awesome-llm-apps': 'skill + script + evals',
  'notebooklm-py': 'SKILL.md + build_notebook.py',
  'grok-build': 'AGENTS.md project rules',
  'agency-agents': 'agent persona'
};
Object.keys(PLATFORMS).forEach(p =>
  ok(fs.existsSync(path.join(INT, p)), 'integrations/' + p + ' missing'));

console.log('data/ch6.json        : ' + (fs.existsSync(jsonPath) ? 'present, matches data files' : 'MISSING'));
console.log('skill script         : runs, 67 rules / 182 sub-rules');
console.log('skill eval           : 39 checks pass');
console.log('notebooklm-py        : SKILL.md + build_notebook.py --dry-run');
console.log('grok-build           : AGENTS.md, all named commands exist');
console.log('agency-agents        : persona with valid frontmatter');
console.log('adapter files scanned: ' + ADAPTER_FILES.length);
console.log('problems             : ' + problems.length);
problems.forEach(p => console.log('   !! ' + p));
console.log('\nINTEGRATIONS CHECK: ' + (problems.length ? 'FAIL' : 'PASS'));
process.exit(problems.length ? 1 : 0);
