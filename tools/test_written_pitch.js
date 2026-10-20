#!/usr/bin/env node
// test_written_pitch — this piece's transposing parts land where a player expects.
//
// Written at the port (PLAN 0i, 2026-09-17). It is the SEED of this piece's own notation
// battery: piece #5's test_septet_notation asserts ITS ensemble (a B-flat bass clarinet, a grand
// staff) and cannot be kept; this keeps the one part of it that is about THIS ensemble.
// Method and resolver are #5's exactly (Layout.positionResolver).
//
//   node tools/test_written_pitch.js
// ySs = the staff position in staff-spaces:
// treble lines are E4 = -2, G4 = -1, B4 = 0, D5 = 1, F5 = 2; bass lines G2 = -2, B2 = -1,
// D3 = 0, F3 = 1, A3 = 2. A half-step of ySs is one scale degree (a line-to-space move).
const path = require('path');
const ROOT = require('path').join(__dirname, '..');   // was piece #6's folder, written in full — the test read THAT repo (found at the port, 2026-10-04)
const Layout = require(path.join(ROOT, 'notation/lib/layout.js'));
const ens = require(path.join(ROOT, 'notation/registry/ensemble.json'));
const pos = Layout.positionResolver(ens);

const NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const nm = m => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);

// THE DECIBEL ENSEMBLE (container 6, 2026-10-04 — RUNNING_LOG §45). Piece #6's ten cases (english horn · horn · double bass …) left
// with its ensemble; these are this registry's: two transposing winds, the mallets at their keyed pitch, an alto and a bass clef.
// (alto middle line = C4.) The percussion's unpitched staff places a note by its instrument's LINE, not by pitch — not tested here.
const CASES = [
  // part, sounding midi, expected ySs, what it proves
  [0, 59, 0,    'BASS FLUTE +12: sounding B3 is written B4 — the treble MIDDLE LINE'],
  [0, 48, -3,   'BASS FLUTE +12: its lowest note, sounding C3, is written C4 — one ledger line under the treble staff (E4 = -2, D4 = -2.5, C4 = -3)'],
  [1, 57, 0,    'BASS CLARINET +14 (B-flat, treble clef — his word in piece #5): sounding A3 is written B4, the treble middle line'],
  [1, 34, -6.5, 'BASS CLARINET +14: its floor here, sounding B-flat 1, is written C3 — an octave under middle C (C4 = -3, C3 = -6.5)'],
  [3, 71, 0,    'MALLETS (no transposition — the library is keyed at WRITTEN pitch): key B4 on the treble middle line'],
  [3, 60, -3,   'MALLETS: key C4, the crotales\' lowest, one ledger line under the staff'],
  [4, 60, 0,    'VIOLA (alto clef, no transposition): sounding C4 on the alto MIDDLE LINE'],
  [4, 48, -3.5, 'VIOLA: its C string, sounding C3, an octave under the middle line'],
  [5, 50, 0,    'CELLO (bass clef, no transposition): sounding D3 on the bass middle line'],
  [5, 36, -4,   'CELLO: its C string, sounding C2 (D2 = -3.5, C2 = -4)'],
];

let fail = 0;
console.log('part  sounding    ySs      expected   verdict');
for (const [part, midi, want, why] of CASES) {
  const r = pos(part, midi);
  const good = Math.abs(r.ySs - want) < 1e-9;
  if (!good) fail++;
  console.log(
    String(part).padEnd(6) + (nm(midi) + ' (' + midi + ')').padEnd(12) +
    String(r.ySs).padEnd(9) + String(want).padEnd(11) + (good ? 'ok' : 'FAIL') + '   ' + why
  );
}
// the control: with the transposition removed, the bass flute must land somewhere ELSE
const ens0 = JSON.parse(JSON.stringify(ens));
delete ens0.parts[0].transpose;
const pos0 = Layout.positionResolver(ens0);
const moved = pos0(0, 59).ySs !== pos(0, 59).ySs;
console.log('\ncontrol: with bass_flute transpose removed, sounding B3 sits at ySs ' + pos0(0, 59).ySs +
            ' instead of ' + pos(0, 59).ySs + ' — the transposition is REALLY being applied: ' + (moved ? 'yes' : 'NO'));
if (!moved) fail++;
console.log(fail ? '\nWRITTEN-PITCH RED: ' + fail : '\nWRITTEN-PITCH GREEN: ' + CASES.length + ' cases + the control');
process.exit(fail ? 1 : 0);
