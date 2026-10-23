// 5.3 — re-point tools/card_schedule.js at the Switch~ rack (2026-10-23, RUNNING_LOG §21). Anchors asserted.
//   WHAT IS MEASURED: the five never measured on the absolute scale — flute (piece 4 relative) · clarinet · alto sax (new) · piano
//   (piece 4 relative) · violin (piece 4 relative); A CROSS-CHECK on three clones at their carried trims (cello · wood blocks · bass
//   drum alt). NOT: the Ricotti four and the six other Abbey Road (carried, piece 6's card) · the vibraphone (no technique in the
//   recipe yet — the pitched lane's roster is the Ricotti stand-in).
//   THE CURVE CHANNEL A of a UVI instrument may sit on ANOTHER PORT (the flute's Fluteb, the sax's SWSaxb): {port, ch} is read.
const fs = require('fs');
const p = 'C:/Users/jwloy/GitHub/switch_2026/tools/card_schedule.js';
let s = fs.readFileSync(p, 'utf8');
const sw = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor not once: ' + a.slice(0, 80)); s = s.split(a).join(b); };
sw(`const HELD = [
  { key: 'bass_flute',    pitches: [50, 67, 84], vels: VELS, bend: true },
  { key: 'bass_clarinet', pitches: [36, 50, 63], vels: VELS, bend: true },
  { key: 'viola',         pitches: [50, 69, 86], vels: VELS, bend: true },
  { key: 'cello',         pitches: [48, 60, 71], vels: [127], bend: false, check: 'piece #6 card, run 30-REC-260919_1140: integrated −30.00 · −30.73 · −36.20 dB at its trim −3.87' },
];`,
`// THE SWITCH~ RACK (2026-10-23, RUNNING_LOG §21): the three SI2 winds and the violin MEASURED; the cello a CROSS-CHECK at its carried
// fader +8.13 (piece 6's trim −3.87 + his +12 lift — so expect piece 6's figures +12.0 dB)
const HELD = [
  { key: 'flute',    pitches: [62, 77, 93], vels: VELS, bend: true },
  { key: 'clarinet', pitches: [52, 69, 86], vels: VELS, bend: true },
  { key: 'alto_sax', pitches: [51, 65, 79], vels: VELS, bend: true },
  { key: 'violin',   pitches: [60, 76, 93], vels: VELS, bend: true },
  { key: 'cello',    pitches: [48, 60, 71], vels: [127], bend: false, check: 'piece #6 card, run 30-REC-260919_1140: integrated −30.00 · −30.73 · −36.20 dB at its trim −3.87; HERE at +8.13 → expect −18.00 · −18.73 · −24.20' },
];
// THE PIANO — struck (the velocity IS the dynamic), its main voice on its own channel, NO CC7 (a Kontakt slot's CC7 is its volume);
// four velocities (the remap needs them) and a long tail (a piano rings)
const PIANO = { key: 'piano', pitches: [36, 60, 84], vels: VELS, hold: 1500, tail: 5000 };`);
sw(`const MALLETS = [
  { inst: 'crotales',     tech: 'crot_main_metal', pitches: [62, 72, 82] },
  { inst: 'glockenspiel', tech: 'glock_main_hard', pitches: [57, 69, 82] },
  { inst: 'xylophone',    tech: 'xylo_main',       pitches: [55, 74, 93] },
  { inst: 'marimba',      tech: 'mar_main',        pitches: [38, 66, 94] },
];`, `const MALLETS = [];   // the Ricotti four: CARRIED (piece 6's card and trims, on their faders since 2026-10-23) — not re-measured`);
sw(`  { slug: 'bongos' }, { slug: 'shime_daiko' }, { slug: 'china_cymbals' }, { slug: 'small_metals_spring_coil' }, { slug: 'susp_cymbals_bright' }, { slug: 'toms_high' },
`, `  // the other six: CARRIED (piece 6's card and trims) — not re-measured
`);
sw(`  const ch = (R.channels && Array.isArray(R.channels.curve) && R.channels.curve.length) ? R.channels.curve[0] : 1;   // curve copy A`,
   `  const c0 = (R.channels && Array.isArray(R.channels.curve) && R.channels.curve.length) ? R.channels.curve[0] : 1;   // curve copy A
  const ch = typeof c0 === 'object' ? c0.ch : c0, cPort = typeof c0 === 'object' ? c0.port : null;   // a UVI instrument's copy may sit on its b port`);
sw(`const base = { inst: H.key, label: R.label, tech: tech.key, techLabel: tech.label, port: tech.port || R.port, ch,`,
   `const base = { inst: H.key, label: R.label, tech: tech.key, techLabel: tech.label, port: cPort || tech.port || R.port, ch,`);
sw(`const L = INSTRUMENTS.bowed_vibraphone;`,
   `{ // the piano
  const R = INSTRUMENTS[PIANO.key], q = R.techniques.find(x => x.key === R.ordinary);
  if (want(PIANO.key)) { t += INST_GAP; for (const pitch of PIANO.pitches) for (const vel of PIANO.vels) push({ role: 'perc', inst: PIANO.key, label: R.label, tech: q.key, techLabel: q.label, port: q.port || R.port, ch: q.channel, cc0: null, ks: null, cc7: null, pitch, vel }, PIANO.hold, PIANO.tail); }
}
const L = INSTRUMENTS.bowed_vibraphone;`);
sw(`what: 'the instrument card for the Decibel rack: absolute loudness per instrument, pitch and velocity, measured two ways',`,
   `what: 'the instrument card for the Switch~ rack: absolute loudness per instrument, pitch and velocity, measured two ways',`);
fs.writeFileSync(p, s);
console.log('card_schedule.js re-pointed');
