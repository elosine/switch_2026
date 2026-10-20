#!/usr/bin/env node
// 3.4 RECIPES AND SKELETON BANKS — the recipe file rebuilt for the Switch~ piece's eight lanes, and the bank files the app and
// the checks read at load written empty-but-valid (journal D7; the protocol's 3.4; piece 6's tools/port/recipes34.js re-pointed; 2026-10-20).
//
//   node tools/port/recipes34.js [--dry]
//
// sandbox/instruments.js is REBUILT, not edited: the schema text and every helper block are kept; the table keeps the
// CARRIED instruments' sections verbatim — percussion (piece 6's eight Abbey Road, the selection provisional) · the pitched
// percussion lane (piece 6's Ricotti mallets, the STAND-IN for the vibraphone; the key `bowed_vibraphone` kept) · the cello
// (measured in piece 5's and 6's racks) — and gets FIVE PLACEHOLDERS (flute · clarinet · alto_sax — SI2 on UVI, container 4;
// piano; violin by the cello's mechanism — none of the cello's measurements). Piece 6's bass flute, bass clarinet and viola go
// (H6-16: 3.4 carries only from the SOURCE piece; an older piece's recipe is container 4's source). Every anchor is asserted;
// nothing is written unless all held and the rebuilt file EVALUATES to exactly the eight instruments in TRACKS order.
// The banks are read from piece 6's COMMIT (never its working tree) and skeletoned: shape and metadata kept, only the carried
// instrument's rows, a `_provenance` line naming what was dropped. The engine's index and the shelf are written EMPTY.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const SRC_REPO = 'C:/Users/jwloy/GitHub/decibel_TENOR_2026', SRC_COMMIT = '9796edd';
const DRY = process.argv.includes('--dry');
const die = m => { throw new Error(m); };

// ---------------------------------------------------------------------------------------------- the recipe file
const RP = path.join(ROOT, 'sandbox', 'instruments.js');
const raw = fs.readFileSync(RP, 'utf8');
if (raw.includes('\r\n')) die('sandbox/instruments.js is not LF — refused');
const L = raw.split('\n');
const at = (pred, what, from) => { const hits = []; for (let i = from || 0; i < L.length; i++) if (pred(L[i])) hits.push(i); if (hits.length !== 1) die('anchor "' + what + '" found ' + hits.length + ' times'); return hits[0]; };
const iStatus = at(s => s.startsWith('// ============================ STATUS'), 'STATUS');
const iTable = at(s => s === 'const INSTRUMENTS = {', 'const INSTRUMENTS');
const iBFl = at(s => s.startsWith('  // ---- BASS FLUTE'), 'BASS FLUTE section');
const iBCl = at(s => s.startsWith('  // ---- BASS CLARINET'), 'BASS CLARINET section');
const iPerc = at(s => s.startsWith('  // ---- PERCUSSION'), 'PERCUSSION section');
const iVib = at(s => s.startsWith('  // ---- THE PITCHED PERCUSSION LANE'), 'PITCHED PERCUSSION LANE section');
const iViola = at(s => s.startsWith('  // ---- VIOLA'), 'VIOLA section');
const iCello = at(s => s.startsWith('  // ---- CELLO'), 'CELLO section');
const iEnd = L.findIndex((s, i) => i > iTable && s === '};');
if (!(iStatus < iTable && iTable < iBFl && iBFl < iBCl && iBCl < iPerc && iPerc < iVib && iVib < iViola && iViola < iCello && iCello < iEnd)) die('the table\'s sections are not in the order expected');
if (!L[iEnd - 1].startsWith('  cello: {')) die('the line before the table\'s end is not the cello entry');

const HEAD = [
'// Rendering-recipe config — switch 2026 (the port from piece 6 *Approaching*, the new-piece protocol\'s 3.4, 2026-10-20;',
'// container 4 fills it in). One entry per TRACK (score/public/composer.html TRACKS[].instKey).',
];
const STATUS = [
'// ============================ STATUS: PROVISIONAL ============================',
'// **Nothing here has been heard in this piece.** Written during the port so that the eight lanes exist, material can be',
'// assigned to them, the placement engines can route around them and the notation can lay them out. Container 4 (the',
'// instruments) and container 5 (the calibration) replace every value, with the composer at the machine.',
'//',
'//   CARRIED from piece 6, verbatim — its measurements are ITS rack\'s, re-measured at container 5:',
'//     percussion        Spitfire Abbey Road Orchestra Percussion. The selection (bank/perc_selection.json) is piece 6\'s',
'//                       eight; WHICH instruments this piece uses is the composer\'s, from the call\'s list, at container 4.',
'//     bowed_vibraphone  piece 6\'s Ricotti mallets (crotales · glockenspiel · xylophone · marimba) — the STAND-IN for the',
'//                       VIBRAPHONE lane (the call\'s list; journal D7). The key is piece 5\'s, kept (docs/NAMING.md § 1).',
'//     cello             Xsample Contemporary Solo Strings — measured in piece 5\'s rack, carried through piece 6.',
'//   PLACEHOLDERS — one or two voices each, so the lane is real (container 4 opens with the read-out per instrument, H6-22):',
'//     flute · clarinet · alto_sax   IRCAM Solo Instruments 2 (UVI), installed whole on this machine — the flute was piece 4\'s;',
'//                                   the clarinet and the sax are new instruments of that known family. Nothing read from it yet.',
'//     piano                         piece 4\'s and piece 2\'s record (8Dio Steinway · IRCAM Prepared Piano 2 · the plucked piano).',
'//     violin                        the strings\' roster by the cello\'s mechanism; none of the cello\'s measurements.',
'//',
'// PORT NAMES carry an `SW` prefix (journal D4): loopMIDI ports are machine-global, and piece 6\'s rack (`DEC…`), piece 5\'s',
'// (`LG…`) and piece 4\'s (bare names) may still be live on this machine. These names are the SHAPE; container 4 (4.1) makes them.',
'//',
'// TECHNIQUE KEYS are the notation registry\'s names (notation/registry/techniques.json) wherever one exists, so a key that',
'// reaches the IR is already drawable; tools/palette_check.js lists the recipe keys the registry does not know yet.',
];
const WINDS = [
'  // ---- FLUTE — IRCAM Solo Instruments 2 (UVI), PLACEHOLDER (container 4) ----',
'  // Two voices so the lane and the tables are real: nothing here was read from the library or heard. Piece 4\'s flute recipe',
'  // (septet_2026/sandbox/instruments.js — SI2 "Flute in C", 19 presets by keyswitch, three ordinario copies on a `b` port) is',
'  // container 4\'s source. Range 60–96 (C4–C7 sounding), NOT measured; the bend range is MIDI\'s default, unread.',
'  flute: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2, label: "Flute", port: "SWFlute", rangeLow: 60, rangeHigh: 96, channels: { main: 1, curve: [2, 3, 4] },',
'    techniques: [{ key: "ord", label: "Ordinario", channel: 1, kind: "pitched", loud: "vel" }, { key: "staccato", label: "Staccato", channel: 1, kind: "pitched", loud: "vel" }] },',
'',
'  // ---- CLARINET in B♭ — IRCAM Solo Instruments 2 (UVI), PLACEHOLDER (container 4) ----',
'  // SI2 holds a "Clarinet in Bb" (its manual, piece 3\'s extracted copy: Layers & Keyswitches — Clarinet); no piece has used it.',
'  // Range 50–94 (D3–B♭6 sounding), NOT measured.',
'  clarinet: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2, label: "Clarinet", port: "SWClar", rangeLow: 50, rangeHigh: 94, channels: { main: 1, curve: [2, 3, 4] },',
'    techniques: [{ key: "ord", label: "Ordinario", channel: 1, kind: "pitched", loud: "vel" }, { key: "staccato", label: "Staccato", channel: 1, kind: "pitched", loud: "vel" }] },',
'',
'  // ---- ALTO SAXOPHONE in E♭ — IRCAM Solo Instruments 2 (UVI), PLACEHOLDER (container 4) ----',
'  // SI2 holds an "Alto Saxophone" (Claude Delangle); no piece has used it. Range 49–81 (D♭3–A5 sounding), NOT measured.',
'  alto_sax: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2, label: "Alto Sax", port: "SWSax", rangeLow: 49, rangeHigh: 81, channels: { main: 1, curve: [2, 3, 4] },',
'    techniques: [{ key: "ord", label: "Ordinario", channel: 1, kind: "pitched", loud: "vel" }, { key: "staccato", label: "Staccato", channel: 1, kind: "pitched", loud: "vel" }] },',
'',
];
const PIANO = [
'  // ---- PIANO — PLACEHOLDER (container 4; THE PIANO IS A ROLE — the profile\'s roles line) ----',
'  // One struck voice so the lane and the piano-role modules are real. Piece 4\'s recipe (8Dio Steinway + IRCAM Prepared Piano 2,',
'  // two ports Piano1 · Piano2) and piece 2\'s record (the harmonics piano, the plucked piano, the CC120 secco cutoff) are',
'  // container 4\'s sources. Struck: the velocity IS the dynamic; no breath, no bow, no bend — not a beating partner.',
'  piano: { ordinary: "main", beating: false, playerBendSt: 0, bendRangeSt: 0, label: "Piano", port: "SWPiano", rangeLow: 21, rangeHigh: 108, channels: { main: 1, curve: [2, 3, 4], curveTechniques: [] },',
'    techniques: [{ key: "main", label: "struck, plain (the placeholder)", channel: 1, kind: "pitched", loud: "vel" }] },',
'',
'  // ---- VIOLIN — by the CELLO\'s mechanism, PROVISIONAL (container 4) ----',
'  // The roster is generated by the strings\' helper, so the key set is the cello\'s (Xsample Contemporary Solo Strings: 88',
'  // presets, CC#0 = preset − 1; Sul G / D / A / E) — piece 4\'s violins were this library and this helper. NOTHING of the',
'  // cello\'s MEASUREMENTS is shared: no balanceDb, no measured ranges, no measured bend — a shared mechanism never shares a',
'  // measurement. Range 55–100 (G3–E7 sounding) is the instrument\'s compass, not re-measured. The preset numbers are VERIFY at 4.',
'  violin: { ordinary: "senza_vel", playerBendSt: 1, bendRangeSt: 1, label: "Violin", port: "SWViolin", rangeLow: 55, rangeHigh: 100, mechanism: "cc0", channels: { main: 1, curve: [2, 3, 4] }, techniques: xsStringTechs(["G", "D", "A", "E"], 55, 100) },',
'',
];
const strip = a => { const b = a.slice(); while (b.length && b[b.length - 1] === '') b.pop(); return b; };
let out = [].concat(HEAD, L.slice(2, iStatus), STATUS, [''], ['const INSTRUMENTS = {', ''], WINDS,
  strip(L.slice(iPerc, iViola)), [''], PIANO, strip(L.slice(iCello, iEnd)), ['};'], L.slice(iEnd + 1));

let text = out.join('\n');
const ren = (a, b, n) => { const c = text.split(a).length - 1; if (c !== n) die('port ' + a + ': expected ' + n + ', found ' + c); text = text.split(a).join(b); };
ren('"DECPerc"', '"SWPerc"', 10); ren('"DECCrotales"', '"SWCrotales"', 11); ren('"DECGlock"', '"SWGlock"', 13); ren('"DECXylo"', '"SWXylo"', 11);
ren('"DECMarimba"', '"SWMarimba"', 9); ren('"DECCello"', '"SWCello"', 1);
if (/"DEC[A-Z]/.test(text)) die('a piece 6 port name is still in the recipe file');
ren('label: "Mallets", port: "SWCrotales"', 'label: "Vibraphone", port: "SWCrotales"', 1);   // the lane is the call's vibraphone; the stand-in's roster stays until container 4
for (const blk of ['UVI_PARTS', 'SI2_KINDS', 'BY_KEY_MAPS']) if (!text.includes('const ' + blk + ' = {};')) die(blk + ' is not empty at the copy');

// it must EVALUATE, to exactly the eight, in TRACKS order
const I = vm.runInNewContext(text + '\n;INSTRUMENTS;', {});
const WANT = ['flute', 'clarinet', 'alto_sax', 'percussion', 'bowed_vibraphone', 'piano', 'violin', 'cello'];
if (Object.keys(I).join() !== WANT.join()) die('the rebuilt recipe evaluates to [' + Object.keys(I) + ']');
for (const k of WANT) if (!I[k].techniques || !I[k].techniques.length || !I[k].port) die(k + ': no techniques or no port');
for (const k of ['bartok_vel', 'spicc_vel', 'stac_vel', 'senza_vel', 'gettato_vel']) if (!I.violin.techniques.some(t => t.key === k)) die('violin: no ' + k);
console.log('recipe: ' + WANT.map(k => k + ' ' + I[k].techniques.length + ' voices → ' + I[k].port).join(' · '));
console.log('recipe: ' + L.length + ' lines → ' + text.split('\n').length);

// ---------------------------------------------------------------------------------------------- the skeleton banks
const fromSrc = p => JSON.parse(cp.execFileSync('git', ['-C', SRC_REPO, 'show', SRC_COMMIT + ':' + p], { maxBuffer: 1 << 27 }).toString());
const PROV = 'Skeleton written by the port from piece 6 (decibel_TENOR_2026 @ ' + SRC_COMMIT + '), 2026-10-20 — the new-piece protocol\'s 3.4. ';
const banks = {};
{ // the strike bank: piece 6 kept sixty of his strikes in it — EMPTIED here; the shape is piece 4's
  const j = fromSrc('bank/scattered_strikes.json');
  const had = Object.keys(j.strikes || {}).length;
  j.strikes = {}; j.ingestions = []; if (j.sequences) j.sequences = Array.isArray(j.sequences) ? [] : {};
  j.created = '2026-10-20'; j.updated = '2026-10-20';
  j._provenance = PROV + 'The strike bank is EMPTY: piece 6\'s ' + had + ' strikes (his marimba takes) stayed in its repo. Recorded strikes are a piece\'s own.';
  banks['bank/scattered_strikes.json'] = j;
}
{ // the remap: keyed by instrument — only the carried pitched instrument's row (the cello)
  const j = fromSrc('bank/velocity_remap.json');
  const keep = ['cello'], had = Object.keys(j.instruments);
  for (const k of keep) if (!j.instruments[k]) die('velocity_remap: no row for ' + k);
  const rows = {}; for (const k of keep) { rows[k] = j.instruments[k]; if (rows[k].port) rows[k].port = rows[k].port.replace(/^DEC/, 'SW'); }
  j.instruments = rows;
  j._provenance = PROV + 'Shape and metadata are piece 6\'s (its `piece`, `source` and dates are kept as the record of where the rows were measured). ' +
    'Of the instruments ONLY the carried one is kept — cello — measured in piece 6\'s rack, to be re-measured at container 5. ' +
    'Dropped: ' + had.filter(k => !keep.includes(k)).join(', ') + '. The winds, the piano and the violin are unmeasured: an instrument with no row here passes its anchor velocity through.';
  banks['bank/velocity_remap.json'] = j;
}
{ // the sample lengths: keyed by TECHNIQUE — the rows are the cello's
  const j = fromSrc('bank/sample_lengths.json');
  j._provenance = PROV + 'Carried as it stood there: keyed by TECHNIQUE, the rows are the CELLO\'s (measured in piece 5\'s rack). No other instrument of this piece inherits a length. | ' + j._provenance;
  banks['bank/sample_lengths.json'] = j;
}
{ // the percussion selection: piece 6's eight, on this piece's port — provisional until the call's list is chosen from (container 4)
  const j = fromSrc('bank/perc_selection.json');
  if (j.port !== 'DECPerc') die('perc_selection: port is ' + j.port);
  j.port = 'SWPerc';
  j._provenance = PROV + 'The selection is PIECE 6\'s (' + j.instruments.length + ' instruments) on this piece\'s port, kept so the recipe\'s ARO_PERC block and the selection agree (tools/palette_check.js § 6). WHICH percussion this piece uses — from the call\'s list — is the composer\'s at container 4; then tools/apply_perc.js.';
  banks['bank/perc_selection.json'] = j;
}
{ // the sines' simulated-player behaviours: keyed by LANE — only the carried lanes' rows
  const j = fromSrc('bank/sine_behaviours.json');
  const keep = ['bowed_vibraphone', 'cello'], had = Object.keys(j.lanes || {});
  const rows = {}; for (const k of keep) { if (!j.lanes[k]) die('sine_behaviours: no row for ' + k); rows[k] = j.lanes[k]; }
  j.lanes = rows;
  j._provenance = PROV + 'Only the carried lanes\' rows are kept — ' + keep.join(', ') + ' (his rules of piece 6 for those instruments). Dropped: ' + had.filter(k => !keep.includes(k)).join(', ') + '. A lane with no row takes the file\'s defaults; the winds\', the piano\'s and the violin\'s rows are written when the sine tool is first used here (container 7).';
  banks['bank/sine_behaviours.json'] = j;
}
{ // the electronics' route table: this piece's players, the tracks and ports PROVISIONAL (the rack is container 4's)
  const j = fromSrc('bank/elec_route.json');
  const perc = j.players.find(p => p.name === 'perc'); if (!perc || !perc.tracks) die('elec_route: no perc player with tracks');
  const P = (name, track, engineIn, port, testNote) => ({ name, track, engineIn, port, testNote });
  const perc2 = Object.assign({}, perc, { engineIn: 5, port: 'SWPerc', ports: ['SWPerc', 'SWCrotales', 'SWGlock', 'SWXylo', 'SWMarimba'] });
  j.players = [P('fl', 'Flute SI2', 1, 'SWFlute', 72), P('cl', 'Clarinet SI2', 2, 'SWClar', 62), P('sax', 'Alto Sax SI2', 4, 'SWSax', 65), perc2,
               P('pno', 'Piano', 6, 'SWPiano', 60), P('vn', 'Violin XS', 7, 'SWViolin', 67), P('vc', 'Cello XS', 8, 'SWCello', 56)];
  j._provenance = PROV + 'The players are THIS piece\'s seven (the percussionist one player, two lanes); every track name and port is the SHAPE — the rack (container 4) and 4.1 make them real; engineIn 3 stays the latency loop as in piece 6. The return, the message, the bank, the level (the ladder\'s reference is piece 6\'s measured number — his ear moves it), the master, the venue and the modes are the engine\'s defaults as piece 6 left them.';
  banks['bank/elec_route.json'] = j;
}
{ // the engine's index: EMPTY (the bank is a piece's own, D18 of piece 6)
  const j = fromSrc('bank/samples/index.json');
  banks['bank/samples/index.json'] = { schema: j.schema, _what: j._what, _provenance: PROV + 'EMPTY: piece 6\'s ' + j.samples.length + ' rows stayed in its repo; the engine writes this file after each capture.', samples: [] };
}
{ // the shelf: EMPTY
  const j = fromSrc('bank/candidates.json');
  banks['bank/candidates.json'] = { _about: j._about, _provenance: PROV + 'EMPTY: piece 6\'s ' + j.rows.length + ' rows and its deals stayed in its repo.', rows: [], deals: {} };
}
for (const p of Object.keys(banks)) if (p !== 'bank/elec_route.json' && fs.existsSync(path.join(ROOT, p))) die(p + ' exists already — refused (unstage first)');   // elec_route.json came with the copy (the server requires it) and is REWRITTEN here
// the recipe's ARO_PERC must still match the selection
const sel = banks['bank/perc_selection.json'].instruments.map(x => typeof x === 'string' ? { slug: x } : x), have = I.percussion.aroInstruments || [];
if (have.length !== sel.length) die('ARO_PERC carries ' + have.length + ' instruments, the selection ' + sel.length);

if (!DRY) {
  fs.writeFileSync(RP, text);
  for (const [p, j] of Object.entries(banks)) { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), JSON.stringify(j, null, 1) + '\n'); }
  // the presets file came with the copy (the page reads it at F5): a provenance line, the file otherwise piece 6's
  const pp = path.join(ROOT, 'bank/presets.json'); const pj = JSON.parse(fs.readFileSync(pp, 'utf8'));
  if (!pj._provenance) { const o = { _provenance: PROV + 'Carried WHOLE: the effect presets, the classes, the envelopes, the mix and the groups are piece 6\'s working set; its `generated` · `kept` · `auditions` records are piece 6\'s too. This piece re-makes the set as its music asks (container 7).' }; fs.writeFileSync(pp, JSON.stringify(Object.assign(o, pj), null, 1) + '\n'); }
}
console.log((DRY ? 'DRY — nothing written. Would write ' : 'WRITTEN: ') + 'sandbox/instruments.js + ' + Object.keys(banks).join(' · ') + ' (+ presets.json provenance)');
