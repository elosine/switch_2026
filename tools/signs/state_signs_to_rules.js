// tools/signs/state_signs_to_rules.js — THE STATE SIGNS INTO THE NOTATION REGISTRY (decibel PLAN 2.6; RUNNING_LOG §365; DEC-137).
//
//   node tools/signs/state_signs_to_rules.js [--dry]
//
// bank/signs/state_signs.json holds the four signs of the three body problem's states as he kept them (the dots 50 % bigger, DEC-136)
// and the grounds he chose among. The notation engine draws a state sign from notation/registry/rules.json — the table `stateSigns`
// (per state its drawing). This writes that table's drawings FROM THE BANK: run it after a drawing changes there. It rewrites ONLY
// the block "stateSigns": { … } (the rest of the file byte for byte, in the file's own line ending); a state's long name — the
// instruction in words — is kept from the table as it stands. The sign's SIZE, its GROUND and its PLACE are rows of
// objects.stateSign, by hand. Then: node tools/gen_engraving_rules.js · node tools/check_rules.js.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), FILE = path.join(ROOT, 'notation', 'registry', 'rules.json');
const B = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'signs', 'state_signs.json'), 'utf8'));
const DRY = process.argv.includes('--dry');
const CRLF = String.fromCharCode(13, 10), BS = String.fromCharCode(92);
const src = fs.readFileSync(FILE, 'utf8'), R = JSON.parse(src), EOL = src.includes(CRLF) ? CRLF : String.fromCharCode(10), q = (v) => JSON.stringify(v);
const was = (R.stateSigns || {}).types || {};
if (!R.stateSigns || !R.stateSigns._doc) throw new Error('state_signs_to_rules: rules.json has no table stateSigns to rewrite');
const rows = B.states.map((s) => {
  if (/["<>]/.test(String(s.sign).replace(/<\/?(g|circle|path)\b[^>]*>/g, ''))) throw new Error('state_signs_to_rules: the sign of "' + s.id + '" holds something other than g · circle · path');
  return '   ' + q(s.id) + ': { "name": ' + q((was[s.id] && was[s.id].name) || s.name) + ', "sign": ' + q(s.sign) + ' }';
});
const block = [' "stateSigns": {', '  "_doc": ' + q(R.stateSigns._doc) + ',', '  "types": {', rows.join(',' + EOL), '  }', ' }'].join(EOL);
const KEY = EOL + ' "stateSigns": {', at = src.indexOf(KEY);
if (at < 0) throw new Error('state_signs_to_rules: the block was not found');
let i = at + KEY.length, depth = 1, inStr = false;      // the brace that closes the block, strings skipped
for (; i < src.length && depth > 0; i++) { const ch = src[i]; if (inStr) { if (ch === BS) i++; else if (ch === '"') inStr = false; } else if (ch === '"') inStr = true; else if (ch === '{') depth++; else if (ch === '}') depth--; }
if (depth) throw new Error('state_signs_to_rules: the block does not close');
const out = src.slice(0, at) + EOL + block + src.slice(i);
JSON.parse(out);                                           // the file is still JSON, or nothing is written
if (out === src) { console.log('rules.json stateSigns: already as the bank says — ' + rows.length + ' signs'); process.exit(0); }
if (DRY) { console.log('DRY — would write ' + rows.length + ' signs: ' + B.states.map((s) => s.id).join(' · ')); process.exit(0); }
fs.writeFileSync(FILE, out);
console.log('wrote rules.json stateSigns — ' + rows.length + ' signs: ' + B.states.map((s) => s.id).join(' · '));
