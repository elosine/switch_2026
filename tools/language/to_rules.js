// tools/language/to_rules.js — HIS CHOSEN BADGES INTO THE NOTATION REGISTRY (decibel PLAN 2.3 · 2.6; RUNNING_LOG §325).
//
//   node tools/language/to_rules.js [--dry]
//
// bank/language/language.json holds the candidates and his choice per type (a `symbol` and a `colour`). The notation engine draws a
// badge from notation/registry/rules.json — the table `language` (the badge's format, and per type its sign and a pointer to its
// colour's row). This writes that table from the bank: run it after a choice changes. It rewrites ONLY the block "language": { … }
// (the rest of the file byte for byte, in the file's own line ending), refuses a type whose colour has no row in `colours`, and
// refuses a colour row whose value is not the palette's. Then: node tools/gen_engraving_rules.js · node tools/check_rules.js.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), FILE = path.join(ROOT, 'notation', 'registry', 'rules.json');
const { chosenTypes, chosenSign, load } = require('./badge_lib');
const DRY = process.argv.includes('--dry');
const CRLF = String.fromCharCode(13, 10), BS = String.fromCharCode(92);
const src = fs.readFileSync(FILE, 'utf8'), R = JSON.parse(src), EOL = src.includes(CRLF) ? CRLF : String.fromCharCode(10);
const { B, colourOf } = load();
const q = v => JSON.stringify(v);
if (!(R.colours || {}).badgeGround) throw new Error('to_rules: rules.json colours has no row badgeGround');
if (String(R.colours.badgeGround.value).toLowerCase() !== String(B.ground).toLowerCase()) throw new Error('to_rules: colours.badgeGround is ' + R.colours.badgeGround.value + ', the format says ' + B.ground);
const rows = [], said = [];
for (const t of chosenTypes()) {
  const s = chosenSign(t.id), row = (R.colours || {})[s.colour];
  if (!row) throw new Error('to_rules: the type "' + t.id + '" takes the colour "' + s.colour + '", which has no row in rules.json colours — add the row first');
  if (String(row.value).toLowerCase() !== String(colourOf(s.colour)).toLowerCase()) throw new Error('to_rules: colours.' + s.colour + ' is ' + row.value + ' in rules.json, ' + colourOf(s.colour) + ' in the palette');
  rows.push('   ' + q(s.id) + ': { "name": ' + q(s.name) + ', "symbol": ' + q(s.symbol) + ', "colour": ' + q('@colours.' + s.colour + '.value') + ', "sign": ' + q(s.sign) + ' }');
  said.push(s.name + ' (' + s.symbol + ', ' + s.colour + ')');
}
const DOC = "THE LANGUAGE'S BADGES (decibel PLAN 2.3; RUNNING_LOG §307 … §318 the choices, §325 the engine). The piece's material is a variation of Anthony Braxton's Language Music: a TYPE of sound is said by a badge — a rounded square of the format's ground, the type's sign in the type's colour. GENERATED from bank/language/language.json (his choice per type: a `symbol` and a `colour`) by `node tools/language/to_rules.js` — change the bank and run it, never this block. `format`: the drawing box of every sign (`viewUnits` square, the corner in the same units) and the ground. `types.<id>`: `sign` = the drawing inside that box (a font glyph already resolved to its outline from notation/lib/glyphs.json; `currentColor` = the type's colour; a part may fix its own colour) · `colour` = a pointer to the palette's row. The badge's SIZE on the page and its place are the row objects.badge.";
const block = [' "language": {', '  "_doc": ' + q(DOC) + ',',
  '  "format": { "viewUnits": ' + B.sizePx + ', "cornerUnits": ' + B.cornerPx + ', "ground": "@colours.badgeGround.value" },',
  '  "types": {', rows.join(',' + EOL), '  }', ' }'].join(EOL);
const KEY = EOL + ' "language": {', at = src.indexOf(KEY);
let out;
if (at >= 0) {
  let i = at + KEY.length, depth = 1, inStr = false;      // the brace that closes the block, strings skipped
  for (; i < src.length && depth > 0; i++) {
    const ch = src[i];
    if (inStr) { if (ch === BS) i++; else if (ch === '"') inStr = false; }
    else if (ch === '"') inStr = true; else if (ch === '{') depth++; else if (ch === '}') depth--;
  }
  if (depth) throw new Error('to_rules: the language block does not close');
  out = src.slice(0, at) + EOL + block + src.slice(i);
} else {
  const ANCHOR = EOL + EOL + ' "ladder": {';
  if (src.split(ANCHOR).length !== 2) throw new Error('to_rules: the place before "ladder" was not found once');
  out = src.replace(ANCHOR, () => EOL + EOL + block + ',' + ANCHOR);
}
JSON.parse(out);                                           // the file is still JSON, or nothing is written
if (out === src) { console.log('rules.json language: already as the bank says — ' + said.length + ' types'); process.exit(0); }
if (DRY) { console.log('DRY — would write ' + said.length + ' types: ' + said.join(' · ')); process.exit(0); }
fs.writeFileSync(FILE, out);
console.log('wrote rules.json language — ' + said.length + ' types: ' + said.join(' · '));
