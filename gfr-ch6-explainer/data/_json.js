/* Exports the Chapter 6 corpus as JSON.
   The data files are JavaScript (window.GFR_CH6_GOODS = [...]), which non-JS
   consumers - the Python skill in integrations/, Dify, Anything LLM - cannot
   read directly. This writes the same rules to data/ch6.json so they can.

   Run from the deliverable directory:  node data/_json.js
   The output is committed, so consumers work without a build step; re-run this
   after any change to the data files. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

const sandbox = { window: {}, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
['data/ch6-goods.js', 'data/ch6-services.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));

const GOODS = sandbox.window.GFR_CH6_GOODS;
const SVCS = sandbox.window.GFR_CH6_SERVICES;
if (!Array.isArray(GOODS) || !Array.isArray(SVCS)) {
  console.error('data files did not define the expected arrays');
  process.exit(1);
}

const out = {
  meta: {
    title: 'GFR 2017 Chapter 6 — Procurement of Goods and Services',
    rules: '142–206',
    part_a: 'Procurement of Goods (Rules 142–176)',
    part_b: 'Procurement of Services (Rules 177–206: A. Consulting Services 177–196, B. Outsourcing of Services 197–206)',
    source: 'Department of Expenditure, Ministry of Finance — GFR 2017 compilation updated to 31.01.2026',
    note: 'The 10.07.2024 amendments (OM No. F.1/3/2024-PPD) are in force.',
    generated_by: 'data/_json.js'
  },
  goods: GOODS,
  services: SVCS
};

const dest = path.join(ROOT, 'data', 'ch6.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 1) + '\n');

const rules = [...GOODS, ...SVCS];
console.log('wrote ' + path.relative(ROOT, dest));
console.log('  goods    : ' + GOODS.length);
console.log('  services : ' + SVCS.length);
console.log('  sub-rules: ' + rules.reduce((a, r) => a + (r.subs || []).length, 0));
console.log('  provisos : ' + rules.reduce((a, r) => a + (r.prov || []).length, 0));
console.log('  notes    : ' + rules.reduce((a, r) => a + (r.note || []).length, 0));
console.log('  exceptions: ' + rules.reduce((a, r) => a + (r.ex || []).length, 0));
console.log('  footnotes: ' + rules.reduce((a, r) => a + (r.fn || []).length, 0));
console.log('  bytes    : ' + fs.statSync(dest).size);
