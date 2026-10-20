#!/usr/bin/env node
// 3.3 THE STRAGGLER AUDIT — what the re-palette's first pass (tools/port/repalette33.js) left of piece 6's names in CODE.
//
//   node tools/port/stragglers33.js [--dry]
//
// The rule (the protocol's 3.3): a DEFAULT ARGUMENT or a WRITE GUARD is a parameter and becomes this piece's name; a test
// FIXTURE stays and goes to NITS; a COMMENT that cites piece 6's §s or plan items is provenance and is left; a coincidence is left.
// Every count is asserted per file before a byte is written. The audit grepped the source repo's NAME first (H6-15): the
// twelve files that wrote the folder path in full were turned by the first pass.
//   1. default output names `scores/decibel-first-*.json` (two builders) and check_ceilings' filter `^decibel-` → `switch-`
//   2. elec.js's two scratch-folder names (a default, not a coincidence)
//   3. the ordinario set's pitched-percussion key: the carried Ricotti lane's `ordinary` is `crot_main_metal`, not `main`
// Not here (NITS): the tooltips in morph_panel.js l. 764 and sequence_ui.js l. 1217 naming piece 5's instruments and ceilings
// (rewritten when this piece's ceilings are measured, container 5) · cresc_run.js's `septet.crescRun.*` storage keys (per-origin,
// harmless) · probes/panic.ps1's default ports (piece 4's; this piece's at 4.1) · print/score/build.sh's title line (container 8) ·
// the bridge's and the Kontakt loaders' `DEC…` ports (container 4 rewrites the rack's jobs).
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const DRY = process.argv.includes('--dry');
const files = {};
function load(p) { if (files[p]) return files[p]; const b = fs.readFileSync(path.join(ROOT, p)); return (files[p] = { text: b.toString('utf8'), edits: 0 }); }
function swap(p, a, b, n) {
  if (/[\r\n]/.test(a + b)) throw new Error('a multi-line swap does not belong in this script');
  const f = load(p), c = f.text.split(a).length - 1;
  if (c !== n) throw new Error(p + ': expected ' + n + ' × ' + JSON.stringify(a) + ', found ' + c);
  f.text = f.text.split(a).join(b); f.edits += n;
}
swap('tools/build_first_object.js', 'scores/decibel-first-object.json', 'scores/switch-first-object.json', 2);
swap('tools/build_first_sound.js', 'scores/decibel-first-sound.json', 'scores/switch-first-sound.json', 2);
swap('tools/check_ceilings.js', 'every decibel-* score', 'every switch-* score', 1);
swap('tools/check_ceilings.js', '/^decibel-.*\\.json$/', '/^switch-.*\\.json$/', 1);
swap('tools/elec.js', "'decibel_elec_object_bank'", "'switch_elec_object_bank'", 1);
swap('tools/elec.js', "'decibel_elec_croptest_bank'", "'switch_elec_croptest_bank'", 1);
swap('score/public/strike_drawer.js', "percussion: 'main', bowed_vibraphone: 'main', piano: 'main', violin: 'senza_vel', cello: 'senza_vel' },",
     "percussion: 'main', bowed_vibraphone: 'crot_main_metal', piano: 'main', violin: 'senza_vel', cello: 'senza_vel' },   // the pitched lane's key is the carried Ricotti lane's ordinary (the stand-in until container 4)", 1);
let n = 0, e = 0;
for (const [p, f] of Object.entries(files)) { if (!f.edits) continue; n++; e += f.edits; if (!DRY) fs.writeFileSync(path.join(ROOT, p), f.text); }
console.log((DRY ? 'DRY — nothing written: ' : 'STRAGGLERS WRITTEN: ') + n + ' files, ' + e + ' edits, every count asserted');
