#!/usr/bin/env node
// 3.3 THE RE-PALETTE — piece 6's six lanes turned to the Switch~ piece's EIGHT (journal D7, 2026-10-20).
//
//   node tools/port/repalette33.js            → checks every edit, then writes
//   node tools/port/repalette33.js --dry      → checks only
//
// Piece 6's script (its tools/port/repalette33.js) re-pointed. ONE script. Every edit is applied to an in-memory copy and its
// match count ASSERTED; nothing is written unless every edit of every file held. Each search and each replacement is translated
// to its file's OWN line ending (never the file to the script's); a file with mixed endings is refused. Replacement goes through
// split / join and slices — never String.replace(a, b), whose `b` reads `$'` as a pattern.
//
// THE ENSEMBLE, score order top → bottom (D1 · D7): flute · clarinet · alto sax · percussion · vibraphone (the pitched percussion
// lane — the SAME player as Percussion, piece 6's shape kept; the key `bowed_vibraphone` kept on purpose, see NAMING) · piano ·
// violin · cello. META = 8; the curve windows A / B / C = 9 / 10 / 11 over the last three lanes (piano · violin · cello).
// layoutVersion 9. The piano role is ON: the piano-role modules read TRACKS (`instKey === 'piano'`); their lane-number FALLBACKS
// are set to this layout (H6-13).
//
// What it turns: kind A — the composer page · the ports (5600 / 5100) · the names · the guard · the launchers;
// kind B — the per-instrument tables in the app's modules (the keys PROVISIONAL where a voice is not yet in a recipe — 3.4 defines them);
// kind C — the piano role's fallbacks. Not here: the recipes and the skeleton banks (3.4) · the notation registry (container 6) ·
// the bridge's port names and the Ricotti loaders (container 4) · piece 6's own section builders' defaults (CARRY ALL, USE SOME).
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const DRY = process.argv.includes('--dry');

const files = {};
function load(p) {
  if (files[p]) return files[p];
  const b = fs.readFileSync(path.join(ROOT, p));
  let crlf = 0, lf = 0;
  for (let i = 0; i < b.length; i++) if (b[i] === 10) { if (b[i - 1] === 13) crlf++; else lf++; }
  if (crlf && lf) throw new Error(p + ': MIXED line endings (' + crlf + ' CRLF, ' + lf + ' LF) — refused');
  return (files[p] = { text: b.toString('utf8'), crlf: crlf > 0, edits: 0 });
}
const eol = (f, s) => f.crlf ? s.split('\r\n').join('\n').split('\n').join('\r\n') : s;
const count = (t, a) => t.split(a).length - 1;
function swap(p, a, b, n) {
  n = n || 1; const f = load(p), A = eol(f, a), B = eol(f, b), c = count(f.text, A);
  if (c !== n) throw new Error(p + ': expected ' + n + ' × ' + JSON.stringify(a.slice(0, 70)) + ', found ' + c);
  f.text = f.text.split(A).join(B); f.edits += n;
}
function range(p, a, z, b, upTo) {
  const f = load(p), A = eol(f, a), Z = eol(f, z), B = eol(f, b);
  if (count(f.text, A) !== 1) throw new Error(p + ': range start not found once: ' + JSON.stringify(a.slice(0, 70)));
  const i = f.text.indexOf(A), j = f.text.indexOf(Z, i + A.length);
  if (j < 0 || count(f.text.slice(i), Z) !== 1) throw new Error(p + ': range end not found once after its start: ' + JSON.stringify(z.slice(0, 70)));
  f.text = f.text.slice(0, i) + B + f.text.slice(upTo ? j : j + Z.length); f.edits++;
}
function whole(p, mustContain, b) {
  const f = load(p); if (count(f.text, mustContain) < 1) throw new Error(p + ': not the file expected (no ' + mustContain + ')');
  f.text = eol(f, b); f.edits++;
}

// ====================================================================== KIND A — the composer page
const CH = 'score/public/composer.html';
swap(CH, '<title>Composer Score — decibel TENOR 2026</title>', '<title>Composer Score — switch 2026</title>');
swap(CH, '#laneCurveA { top: 50%; height: 16.6667%;', '#laneCurveA { top: 62.5%; height: 12.5%;');
swap(CH, '#laneCurveB { top: 66.6667%; height: 16.6667%;', '#laneCurveB { top: 75%;   height: 12.5%;');
swap(CH, '#laneCurveC { top: 83.3333%; height: 16.6667%;', '#laneCurveC { top: 87.5%; height: 12.5%;');
range(CH, '    /* SIX instrument lanes', '.lane:nth-child(6) { top: 83.3333%; height: 16.6667%; }',
`    /* EIGHT instrument lanes — seven players, the percussionist on two (Percussion + Vibraphone, D7); score order.
       The META draw window has its own rule. ONE RULE PER LANE: tools/palette_check.js § 7 holds the count against TRACKS
       (in piece 5 a lane without its rule fell on top of lane 1). */
    .lane:nth-child(1) { top: 0%   ; height: 12.5%; }
    .lane:nth-child(2) { top: 12.5%; height: 12.5%; }
    .lane:nth-child(3) { top: 25%  ; height: 12.5%; }
    .lane:nth-child(4) { top: 37.5%; height: 12.5%; }
    .lane:nth-child(5) { top: 50%  ; height: 12.5%; }
    .lane:nth-child(6) { top: 62.5%; height: 12.5%; }
    .lane:nth-child(7) { top: 75%  ; height: 12.5%; }
    .lane:nth-child(8) { top: 87.5%; height: 12.5%; }`);
const laneDiv = (n, title, label) =>
`    <div class="lane" id="lane${n}">
        <span class="laneLabel" title="${title}">${label}</span>
        <svg xmlns="http://www.w3.org/2000/svg"><g class="tickGroup"></g><g class="contentGroup"></g></svg>
    </div>
`;
range(CH, '    <!-- 6 composing tracks:', '    <div class="lane metaLane" id="laneMeta">',
`    <!-- 8 composing tracks: the Switch~ ensemble in score order, top -> bottom (TRACKS below) — seven players, the
         percussionist on two lanes (D7, 2026-10-20; piece 6's shape).
         THIS BLOCK AND \`TRACKS\` MUST STAY THE SAME LENGTH — init() maps lane1..laneN off TRACKS, and a missing element
         stops the whole app booting; the lane CSS needs ONE RULE PER LANE too (tools/palette_check.js § 7 holds both). -->
` + laneDiv(1, 'Flute', 'Flute') + laneDiv(2, 'Clarinet in B♭', 'Clarinet') + laneDiv(3, 'Alto saxophone', 'Alto Sax')
  + laneDiv(4, 'Percussion — the unpitched instruments; the SAME player as the lane below (D7)', 'Percussion')
  + laneDiv(5, 'The pitched percussion lane — the vibraphone (and the glockenspiel) of the call\'s list; the SAME player as Percussion. Its key is still bowed_vibraphone (NAMING § 1)', 'Vibraphone')
  + laneDiv(6, 'Piano', 'Piano') + laneDiv(7, 'Violin', 'Violin') + laneDiv(8, 'Cello', 'Cello'), true);
range(CH, '        <option value="0" selected>Bass Flute</option>', '        <option value="6">META</option>',
`        <option value="0" selected>Flute</option>
        <option value="1">Clarinet</option>
        <option value="2">Alto Sax</option>
        <option value="3">Percussion</option>
        <option value="4">Vibraphone</option>
        <option value="5">Piano</option>
        <option value="6">Violin</option>
        <option value="7">Cello</option>
        <option value="8">META</option>`);
swap(CH, 'title="Show/hide curve window A (over Mallets)"', 'title="Show/hide curve window A (over Piano)"');
swap(CH, 'title="Show/hide curve window B (over Viola)"', 'title="Show/hide curve window B (over Violin)"');
swap(CH, 'title="Show/hide curve window C (over Cello)"', 'title="Show/hide curve window C (over Cello)"');
range(CH, '// Track identity: by instrument, not position', 'const CURVE_LAYERS = [7, 8, 9];',
`// Track identity: by instrument, not position (see docs/PROJECT_JOURNAL.md saving protocol)
// SWITCH (2026-10-20, journal D1 · D7): seven players on EIGHT lanes, score order top -> bottom — winds · percussion ·
// piano · strings. \`instKey\` names the recipe in sandbox/instruments.js; \`short\` is the stage-picture label.
// The percussionist has TWO lanes (piece 6's shape, D7): the unpitched instruments, and the vibraphone.
// THE PIANO IS A ROLE (the profile's roles line): every piano-role module finds its lane by instKey === 'piano'.
// NO LANE FOR THE ELECTRONICS (piece 6's D8): every electronic sound is drawn on the lane of the player it comes from.
const TRACKS = [
    { id: 'flute',      label: 'Flute',      short: 'Fl',   instKey: 'flute' },
    { id: 'clarinet',   label: 'Clarinet',   short: 'Cl',   instKey: 'clarinet' },
    { id: 'alto_sax',   label: 'Alto Sax',   short: 'Sax',  instKey: 'alto_sax' },
    { id: 'percussion', label: 'Percussion', short: 'Perc', instKey: 'percussion' },
    // THE PITCHED PERCUSSION LANE — the vibraphone (the call's list; the glockenspiel beside it is container 4's question).
    // The id and the key are piece 5's and 6's, kept on purpose: the engine's tools know the pitched lane by \`bowed_vibraphone\`
    // (docs/NAMING.md § 1). Same PLAYER as Percussion: two lanes, joined by a BRACE in the score.
    { id: 'vibraphone', label: 'Vibraphone', short: 'Vib',  instKey: 'bowed_vibraphone' },
    { id: 'piano',      label: 'Piano',      short: 'Pno',  instKey: 'piano' },
    { id: 'violin',     label: 'Violin',     short: 'Vn',   instKey: 'violin' },
    { id: 'cello',      label: 'Cello',      short: 'Vc',   instKey: 'cello' },
];

// META drawing layer index (the floating draw window = lanes[META_LAYER]).
// SWITCH layout (layoutVersion 9, 2026-10-20): EIGHT instrument lanes, so META = 8 and the curve windows are 9 / 10 / 11.
// Piece 6 (v8) had six lanes, META = 6, curves 7 / 8 / 9; piece 5 (v7) eight, META 8; its v6 seven; piece 3 META = 10 (v2).
const META_LAYER = 8;
// The META window (8) is the gestures' shapes and the stamps — not the curve path (CN-23). The three CURVE windows
// A / B / C are layers 9 / 10 / 11 and float exactly over the last three lanes — Piano, Violin and Cello
// (CN-24, TRILLS_TOOL §3b). Contract (NAMING §2.2): layers >= tracks.length are the META side — 8 META, 9–11 the
// reference curves (waveCurve with curveName) and their pending dots (curveDot).
const META_LAYERS = [8];
const META_NAMES = { 8: 'META' };
const META_COLORS = { 8: '#2E8B57' };
const CURVE_LAYERS = [9, 10, 11];`);
swap(CH, "const CURVE_NAMES = { 7: 'A', 8: 'B', 9: 'C' };", "const CURVE_NAMES = { 9: 'A', 10: 'B', 11: 'C' };");
swap(CH, "const CURVE_COLORS = { 7: '#C2410C', 8: '#1D6FA5', 9: '#6D3B9E' };", "const CURVE_COLORS = { 9: '#C2410C', 10: '#1D6FA5', 11: '#6D3B9E' };");
swap(CH, 'const CURVE_OVER = { 7: 3, 8: 4, 9: 5 };   // the lane each window sits on: the pitched lane (Vibraphone), Viola, Cello',
         'const CURVE_OVER = { 9: 5, 10: 6, 11: 7 };   // the lane each window sits on: Piano, Violin, Cello');
swap(CH, 'layoutVersion: 8,   // DECIBEL (2026-10-04, D9): 6 instrument lanes (BFl · BCl · Perc · Vib · Va · Vc), META = 6, the curve windows A / B / C = 7 / 8 / 9.',
         'layoutVersion: 9,   // SWITCH (2026-10-20, D7): 8 instrument lanes (Fl · Cl · Sax · Perc · Vib · Pno · Vn · Vc), META = 8, the curve windows A / B / C = 9 / 10 / 11. v8 was piece 6 — DECIBEL (2026-10-04, D9): 6 instrument lanes (BFl · BCl · Perc · Vib · Va · Vc), META = 6, the curve windows A / B / C = 7 / 8 / 9.');
swap(CH, "'decibel'", "'switch'", 5);
swap(CH, 'id="sessionName" value="decibel"', 'id="sessionName" value="switch"');
swap(CH, "const ab = { bass_flute: 'bfl', bass_clarinet: 'bcl', percussion: 'perc', viola: 'va', cello: 'vc' };",
         "const ab = { flute: 'fl', clarinet: 'cl', alto_sax: 'sax', percussion: 'perc', bowed_vibraphone: 'vib', piano: 'pno', violin: 'vn', cello: 'vc' };");

// ====================================================================== KIND B — the per-instrument tables
const P = 'score/public/';
swap(P + 'beating_calc.js', "const ORDER = ['bass_flute', 'bass_clarinet', 'percussion', 'bowed_vibraphone', 'viola', 'cello'];   // score order (#5's D10); Decibel's six lanes (D9, 2026-10-04)",
     "const ORDER = ['flute', 'clarinet', 'alto_sax', 'percussion', 'bowed_vibraphone', 'piano', 'violin', 'cello'];   // score order; the Switch~ piece's eight lanes (D7, 2026-10-20)");
swap(P + 'beating_calc.js', '    // PROVISIONAL for the Decibel winds and the viola (the port, 2026-10-04) — not measured: piece #5\'s bass clarinet was',
     '    // PROVISIONAL for the Switch~ winds and the violin (the port, 2026-10-20) — not measured; container 5 measures them. Before it: piece 6\'s winds and viola (2026-10-04) — piece #5\'s bass clarinet was');
swap(P + 'beating_calc.js',
`    bass_flute: { breathS: 8, gapS: 0.75 }, bass_clarinet: { breathS: 12, gapS: 0.75 },
    viola: { bowS: 12, gapS: 0 }, cello: { bowS: 15, gapS: 0 },`,
`    flute: { breathS: 10, gapS: 0.75 }, clarinet: { breathS: 15, gapS: 0.75 }, alto_sax: { breathS: 15, gapS: 0.75 },
    violin: { bowS: 12, gapS: 0 }, cello: { bowS: 15, gapS: 0 },
    // the piano is struck — neither breath nor bow; not a beating partner (\`beating: false\` in its recipe)`);
const OLD_COL = "{ bass_flute: '#ffd479', bass_clarinet: '#e0a86a', percussion: '#b0b0b8', viola: '#7ec9a8', cello: '#5fae8c' }";
const NEW_COL = "{ flute: '#ffd479', clarinet: '#e0a86a', alto_sax: '#e08a8a', percussion: '#b0b0b8', piano: '#e8cf9a', violin: '#7ec9a8', cello: '#5fae8c' }";
swap(P + 'beating_panel.js', 'const INST_COL = ' + OLD_COL + ';   // one hue-family per PAIR: the winds gold · the strings green · percussion neutral',
     'const INST_COL = ' + NEW_COL + ';   // one hue-family per PAIR: the winds gold and rose · the piano piece 4\'s · the strings green · percussion neutral');
swap(P + 'strike_chords_ui.js', 'const INST_COL = ' + OLD_COL + ';', 'const INST_COL = ' + NEW_COL + ';');
swap(P + 'fill_ui.js', 'const COL = ' + OLD_COL + ';', 'const COL = ' + NEW_COL + ';');
const OLD_SD = "const STRIKE_DEFAULT = { bass_flute: 'slap', bass_clarinet: 'slap', percussion: 'main', viola: 'gettato_vel', cello: 'gettato_vel' };";
const NEW_SD = "const STRIKE_DEFAULT = { flute: 'staccato', clarinet: 'staccato', alto_sax: 'staccato', percussion: 'main', piano: 'main', violin: 'bartok_vel', cello: 'gettato_vel' };   // PROVISIONAL (the port, 2026-10-20): the winds' and the piano's keys are the placeholder recipes' until container 4";
swap(P + 'cresc_card.js', OLD_SD, NEW_SD);
swap(P + 'strike_drawer.js', OLD_SD, NEW_SD);
swap(P + 'strike_drawer.js', "const OPEN_STRINGS = { viola: [48, 55, 62, 69], cello: [36, 43, 50, 57] };   // SOUNDING pitch",
     "const OPEN_STRINGS = { violin: [55, 62, 69, 76], cello: [36, 43, 50, 57] };   // SOUNDING pitch");
swap(P + 'strike_drawer.js', "    spiccato: { bass_flute: 'stac_vel', bass_clarinet: 'stac_vel', percussion: 'main', viola: 'spicc_vel', cello: 'spicc_vel' },",
     "    spiccato: { flute: 'staccato', clarinet: 'staccato', alto_sax: 'staccato', percussion: 'main', piano: 'main', violin: 'spicc_vel', cello: 'spicc_vel' },   // the winds' and the piano's short voices come with their recipes (container 4)");
swap(P + 'strike_drawer.js', "    staccato: { bass_flute: 'stac_vel', bass_clarinet: 'stac_vel', percussion: 'main', viola: 'stac_vel', cello: 'stac_vel' },",
     "    staccato: { flute: 'staccato', clarinet: 'staccato', alto_sax: 'staccato', percussion: 'main', piano: 'main', violin: 'stac_vel', cello: 'stac_vel' },");
swap(P + 'strike_drawer.js', "    ordinario: { bass_flute: 'vib_vel', bass_clarinet: 'senza_vel', percussion: 'main', bowed_vibraphone: 'crot_main_metal', viola: 'senza_vel', cello: 'senza_vel' },",
     "    ordinario: { flute: 'ord', clarinet: 'ord', alto_sax: 'ord', percussion: 'main', bowed_vibraphone: 'main', piano: 'main', violin: 'senza_vel', cello: 'senza_vel' },");
swap(P + 'trill_engine.js', "const STAND_IN = { bass_flute: 'cello', bass_clarinet: 'cello', percussion: 'cello' };   // the viola has its own rows in the bank (piece #5's)",
     "const STAND_IN = { flute: 'cello', clarinet: 'cello', alto_sax: 'cello', percussion: 'cello', piano: 'cello', violin: 'cello' };   // the cello's rows are the only measured ones carried (piece 6's); the violin's come at container 5");
swap(P + 'chord_run.js', "const alias = { bfl: 'bass_flute', fl: 'bass_flute', flute: 'bass_flute', bcl: 'bass_clarinet', cl: 'bass_clarinet', clar: 'bass_clarinet', perc: 'percussion', va: 'viola', vla: 'viola', vc: 'cello' }[w];",
     "const alias = { fl: 'flute', flute: 'flute', cl: 'clarinet', clar: 'clarinet', clarinet: 'clarinet', sax: 'alto_sax', asax: 'alto_sax', alto: 'alto_sax', perc: 'percussion', vib: 'bowed_vibraphone', vibes: 'bowed_vibraphone', pno: 'piano', piano: 'piano', vn: 'violin', vln: 'violin', violin: 'violin', vc: 'cello', cello: 'cello' }[w];");
swap(P + 'texture_panel.js', "const ART_DEFAULT = { bass_flute: 'ord', bass_clarinet: 'ord', viola: 'spicc_vel', cello: 'spicc_vel' };",
     "const ART_DEFAULT = { flute: 'ord', clarinet: 'ord', alto_sax: 'ord', piano: 'main', violin: 'spicc_vel', cello: 'spicc_vel' };");
swap(P + 'rhythm_seq_ui.js', '{ bass_flute: 0, bass_clarinet: 0, percussion: 1, bowed_vibraphone: 1, viola: 2, cello: 2 }',
     '{ flute: 0, clarinet: 0, alto_sax: 0, percussion: 1, bowed_vibraphone: 1, piano: 2, violin: 3, cello: 3 }', 2);

// ====================================================================== KIND C — the piano role's lane-number fallbacks (H6-13)
swap(P + 'cue_picker.js', "{ pianoLane: 2, metaLayer: 7 }", "{ pianoLane: 5, metaLayer: 8 }   /* the fallback = this layout (D7); the page's cueOpts() is the live source */");
swap(P + 'piano_cues.js', "    pianoLane: 2, metaLayer: 7,", "    pianoLane: 5, metaLayer: 8,   // the fallback = this layout (D7, 2026-10-20)");
swap(P + 'piano_harmonics.js', "    pianoLane: 2,               // the piano's lane (TRACKS)", "    pianoLane: 5,               // the piano's lane (TRACKS; the fallback = this layout, D7)");
swap(P + 'piano_harmonics.js', "    metaLayer: 7,               // the META layer (the group's shape lives there)", "    metaLayer: 8,               // the META layer (the group's shape lives there)");

// ====================================================================== the ports, the names, the guard, the launchers
swap('score/server.js', '5500', '5600', 6);
swap('score/server.js', 'Composer score (decibel TENOR 2026)', 'Composer score (switch 2026)');
swap('score/server.js', "'decibel-refresh-'", "'switch-refresh-'");
swap('sandbox/serve.js', '5000', '5100', 2);
swap('start_score_server.bat', 'http://localhost:5500', 'http://localhost:5600', 2);
for (const b of ['start_score_server.bat', 'start_electronics.bat', 'start_electronics_remote.bat']) swap(b, 'cd /d C:\\Users\\jwloy\\GitHub\\decibel_TENOR_2026', 'cd /d C:\\Users\\jwloy\\GitHub\\switch_2026');
swap('start_electronics.bat', 'with decibel_rack open', 'with switch_rack open');
whole('.claude/launch.json', '"score-5501"',
`{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "score",
      "runtimeExecutable": "node",
      "runtimeArgs": ["score/server.js"],
      "port": 5600
    },
    {
      "name": "sandbox",
      "runtimeExecutable": "node",
      "runtimeArgs": ["sandbox/serve.js"],
      "port": 5100
    },
    {
      "name": "score-5601",
      "runtimeExecutable": "powershell",
      "runtimeArgs": ["-NoProfile", "-Command", "$env:PORT=5601; node score/server.js"],
      "port": 5601
    }
  ]
}
`);
swap('package.json', '"name": "decibel-tenor-2026"', '"name": "switch-2026"');
swap('package.json', '"description": "The Decibel piece (TENOR 2026). Composer score app, sandbox, notation engine, print and video exporters."',
     '"description": "The Switch~ piece (2026). Composer score app, sandbox, notation engine, print and video exporters."');
swap('package-lock.json', '"name": "decibel-tenor-2026"', '"name": "switch-2026"', 2);
const RACK = { 'tools/reaper_job.js': 2, 'tools/render_reaper.js': 4, 'tools/export_midi.js': 2, 'tools/build_rack.js': 3, 'tools/take.js': 2,
  'tools/elec.js': 1, 'tools/vet/peak_watch_read.js': 1, 'reaper/bridge/jobs/make_tracks.lua': 1 };
for (const [p, n] of Object.entries(RACK)) swap(p, 'decibel_rack', 'switch_rack', n);
const PORT5500 = { 'tools/capture_composer_midi.js': 3, 'tools/export_midi.js': 2, 'tools/elec.js': 4, 'tools/signs/build_state_signs.js': 2,
  'tools/signs/build_page.js': 1, 'tools/signs/build_layout.js': 1, 'tools/signs/build_conductor.js': 1, 'tools/palette/build_page.js': 1,
  'tools/language/build_page.js': 1, 'score/public/morph_emit.js': 1, 'tools/build_audition.js': 2, 'tools/build_chord_feedback.js': 2,
  'tools/build_drone_auditions.js': 2, 'tools/build_drone_section.js': 2, 'tools/build_feedback_rings.js': 2, 'tools/build_fx_audition.js': 1,
  'tools/build_petals.js': 2, 'tools/build_petals_grit.js': 2, 'tools/build_petals_loop.js': 2, 'tools/build_petals_roll.js': 2,
  'tools/build_petals_spectrum.js': 2, 'tools/build_stretch_grid.js': 2, 'tools/deal_strike_variants.js': 2, 'tools/deal_variants.js': 2,
  'tools/thin_effects.js': 2, 'tools/drone_fade.js': 1 };
for (const [p, n] of Object.entries(PORT5500)) swap(p, '5500', '5600', n);
for (const p of ['tools/strike_take.js', 'tools/build_drone_section.js', P + 'vibes_pitch.js', P + 'texture_row.js', P + 'sequence_ui.js', P + 'rhythm_seq_ui.js']) swap(p, "'decibel.", "'switch.", 1);
const PD = { 'tools/reextract.js': 4, 'tools/gen_m2_chart.js': 3, 'tools/capture_composer_midi.js': 3, 'tools/trill_conflicts.js': 2, 'tools/test_identity.js': 2,
  'tools/tempo_fit.js': 2, 'tools/render_reaper.js': 2, 'tools/print_look.js': 2, 'tools/gen_morph_chart.js': 2, 'tools/export_midi.js': 2,
  'tools/check_screen_edges.js': 2, 'tools/check_print_pages.js': 2, 'tools/check_print_front.js': 2, 'tools/check_print_frame.js': 2,
  'tools/check_print_edges.js': 2, 'tools/capture_lane.js': 2, 'tools/range_check.js': 1, 'tools/piano_harmonics.js': 1, 'tools/piano_cues.js': 1,
  'tools/cresc_test.js': 1, 'tools/cc7_ramp_test.js': 1 };
for (const [p, n] of Object.entries(PD)) swap(p, 'piece-decibel', 'piece-switch', n);
for (const p of ['tools/compute_trims.js', 'tools/card_schedule.js', 'tools/card2_schedule.js', 'tools/build_remap_card.js', 'tools/build_remap.js',
                 'tools/build_register_schedule.js', 'tools/build_fine_schedule.js', 'tools/balance_schedule.js']) swap(p, "piece: 'decibel'", "piece: 'switch'", 1);
for (const p of ['probes/analyze_reference.py', 'probes/analyze_card.py', 'probes/analyze_1b5.py']) swap(p, "'piece': 'decibel'", "'piece': 'switch'", 1);
swap('probes/analyze_lgmf_balance.py', "piece='decibel'", "piece='switch'", 1);
// the source's FOLDER PATH written in full (piece 6's deviations 3.3 — H6-15): the bridge and Kontakt jobs would have WRITTEN there
for (const p of ['tools/ricotti_loaders.js', 'reaper/kontakt/reset_bass_flute.lua', 'reaper/kontakt/load_rm_xylophone.lua', 'reaper/kontakt/load_rm_marimba.lua',
                 'reaper/kontakt/load_rm_glockenspiel.lua', 'reaper/kontakt/load_rm_crotales.lua', 'reaper/kontakt/load_bass_flute.lua', 'reaper/kontakt/curve_slots.lua',
                 'reaper/bridge/jobs/ref_track.lua', 'reaper/bridge/jobs/rec_mode_solo.lua', 'reaper/bridge/jobs/rec_mode_restore.lua', 'reaper/bridge/jobs/clip_watch.lua'])
  swap(p, 'decibel_TENOR_2026', 'switch_2026', 1);
// the percussion's default port, and palette_check's
swap('tools/apply_perc.js', "SEL.port || 'DECPerc'", "SEL.port || 'SWPerc'", 1);
swap('tools/palette_check.js', "const selPort = SEL.port || 'DECPerc';", "const selPort = SEL.port || 'SWPerc';", 1);

// ====================================================================== every count held — write
let n = 0, e = 0;
for (const [p, f] of Object.entries(files)) { n++; e += f.edits; if (!DRY) fs.writeFileSync(path.join(ROOT, p), f.text); console.log((DRY ? '  would write ' : '  wrote ') + p.padEnd(44) + String(f.edits).padStart(3) + ' edit(s)' + (f.crlf ? '  CRLF' : '  LF')); }
console.log((DRY ? 'DRY — nothing written: ' : 'RE-PALETTE WRITTEN: ') + n + ' files, ' + e + ' edits, every match count asserted');
