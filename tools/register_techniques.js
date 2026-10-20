#!/usr/bin/env node
// register_techniques.js — every technique key of this piece's recipes INTO notation/registry/techniques.json
// (the new-piece protocol's 6.0 · 6.7; RUNNING_LOG §45, 2026-10-04).
//
//   node tools/register_techniques.js [--dry]
//
// THE GATE (principle 3): the extractor throws on a technique key the registry does not list — "never a silent
// unknown" (classify.js, CL-5). A new piece's recipes bring new keys; this adds them, by the registry's own
// FAMILY RULE (its `_familyRule`, 2026-09-11), as data:
//   oneshot    a struck or short sound — a percussion voice · a mallet patch that is not a roll, tremolo or bow ·
//              a key by name: pizz* · stac* · spicc* · slap · secco · key_noises · bartok · gettato · col_legno ·
//              finger · body · jet_slap · triple16 · marcato_stac / _spicc
//   sustained  everything else — bowed, blown and held sounds, tremolos, rolls, multiphonics, air noises
// `notate` is null for every new key: NO MARK YET — the written instruction of a technique is decided with him,
// note by note (6.7's device sheet), and lands there. An existing key is never changed; this piece's lane is added
// to its `players`. Re-run after a change to the recipes; then node tools/palette_check.js.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const F = path.join(ROOT, 'notation', 'registry', 'techniques.json');
const DRY = process.argv.includes('--dry');
const I = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const R = JSON.parse(fs.readFileSync(F, 'utf8'));

const SHORT = /^(pizz|stac|spicc|slap|secco|airy_secco|key_noises|key_click|bartok|gettato|col_legno|finger|body|jet_slap|triple16|marcato_stac|marcato_spicc|sord_spicc|ah_spicc|sp_spicc|bow_op_stac|pseudo_\w+_stac)/;
const MALLET_SUSTAINED = /roll|trem|bow/;
function family(instKey, q) {
  if (instKey === 'percussion') return q.kind === 'pitched' ? 'sustained' : 'oneshot';          // `main`, the placeholder, is the one pitched voice
  if (instKey === 'bowed_vibraphone') return MALLET_SUSTAINED.test(q.key) ? 'sustained' : 'oneshot';
  return SHORT.test(q.key) ? 'oneshot' : 'sustained';
}
let added = 0, joined = 0; const fresh = [];
for (const t of TRACKS) {
  const L = I[t.instKey]; if (!L) throw new Error('no recipe for ' + t.instKey);
  for (const q of L.techniques) {
    const e = R.techniques[q.key];
    if (!e) { R.techniques[q.key] = { family: family(t.instKey, q), notate: null, label: q.label, players: [t.instKey] }; added++; fresh.push(q.key + ':' + R.techniques[q.key].family[0]); }
    else if (!(e.players || []).includes(t.instKey)) { e.players = (e.players || []).concat(t.instKey); joined++; }
  }
}
R._usedInPieceDecibel = 'decibel TENOR 2026 (container 6, 2026-10-04): ' + added + ' keys added by tools/register_techniques.js — the bass flute\'s, the eight Abbey Road instruments\' (one per beater), the 39 Ricotti patches; ' + joined + ' existing keys gained a Decibel lane. Every new key has `notate: null`.'.replace(/`/g, '"');
console.log(added + ' keys added (' + fresh.filter(x => x.endsWith(':o')).length + ' oneshot, ' + fresh.filter(x => x.endsWith(':s')).length + ' sustained) · ' + joined + ' existing keys gained a lane · ' + Object.keys(R.techniques).length + ' in the registry');
if (DRY) { console.log(fresh.join(' ')); console.log('dry run — nothing written'); process.exit(0); }
fs.writeFileSync(F, JSON.stringify(R, null, 1) + '\n');
