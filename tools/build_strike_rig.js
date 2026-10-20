#!/usr/bin/env node
// build_strike_rig.js — THE RIG (PLAN.md 1.9 · 17.1 d; RUNNING_LOG §297, 2026-10-09): his strike takes placed in a score, each under
// a STRIKE WINDOW brick, so that every proposed transformation and timing of the catalogue is heard on several strikes.
//
//   node tools/build_strike_rig.js [--takes all | strikes01,strikes02,…] [--art staccato] [--dyn f] [--every 12] [--seed 1]
//                                  [--out scores/strike-rig.json] [--replace] [--dry]
//
// Each take goes in by tools/strike_take.js (the drawer's own code: the set pressed, the dynamic chosen, Insert @ playhead) at
// 2 + k · every seconds; over its notes a window brick (electronics/score/le_strike.js — the electronics' sixth object) from the
// first note − 0.3 s to the last note + 0.5 s, on the lane of the strike's first note. The window's RHYTHM and TIMING come from
// the catalogue (bank/strike_responses.json), dealt so that every transformation and every timing lands on several strikes and no
// pair comes twice while there are pairs left: the transformations in one shuffled order, the timings in another, each cycling
// (9 and 5 — every pair distinct for 45 windows). The window's seed is seed · 100 + k.
// The sheet docs/STRIKE_RIG.md says what is heard when — the answer each window expects, by the page's own functions (StrikeCalc).
// It refuses a score it did not make (no metadata.rig) unless --replace, a differing working copy, a `piece-…` name.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SC = require(path.join(ROOT, 'electronics', 'score', 'le_strike.js'));
const ST = require(path.join(ROOT, 'tools', 'strike_take.js'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(1); };
const r3 = (x) => Math.round(x * 1000) / 1000;

const OUT = arg('out', 'scores/strike-rig.json'), FILE = path.join(ROOT, OUT), WORK = FILE.replace(/\.json$/, '-work.json');
const NAME = path.basename(OUT, '.json');
const EVERY = +arg('every', 12), SEED = Math.max(1, Math.round(+arg('seed', 1)) || 1), ART = arg('art', 'staccato'), DYN = arg('dyn', 'f'), DRY = flag('dry'), REPLACE = flag('replace');
if (/^piece-/.test(NAME)) die('this builder never writes a piece score (' + NAME + ')');
const CAT = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'strike_responses.json'), 'utf8'));
const TYPES = SC.TYPES.filter((t) => CAT.transformations && CAT.transformations[t]), TIMINGS = SC.TIMINGS.filter((t) => CAT.timings && CAT.timings[t]);
if (!TYPES.length || !TIMINGS.length) die('bank/strike_responses.json names no transformation or no timing the module knows');

if (fs.existsSync(FILE) && !DRY) {
    const was = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (!(was.metadata && was.metadata.rig)) die(OUT + ' exists and this builder did not make it — another --out, or remove it by hand');
    if (!REPLACE) die(OUT + ' exists — --replace writes over it');
    if (fs.existsSync(WORK) && fs.statSync(WORK).mtimeMs > fs.statSync(FILE).mtimeMs) die('the page holds a working copy of ' + NAME + ' newer than the save (' + path.basename(WORK) + ') — Save or Reload it in the page first');
}

const drawer = ST.openDrawer();
const all = Object.keys(drawer.D.takeList).filter((n) => /^strikes\d+$/.test(n)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const takesArg = arg('takes', 'all'), takes = takesArg === 'all' ? all : takesArg.split(',').map((s) => s.trim()).filter(Boolean);
if (!takes.length) die('no takes named strikesNN in bank/panel_snapshots.json');
takes.forEach((t) => { if (!drawer.D.takeList[t]) die('no take named "' + t + '"'); });

// the deal of (rhythm, timing): the transformations in one shuffled order and the timings in another, each cycling
const rnd = SC.rng(SEED * 7 + 3);
const typeOrder = SC.shuffle(TYPES.slice(), rnd), timingOrder = SC.shuffle(TIMINGS.slice(), rnd);

(async () => {
    const score = ST.newScore(), rows = [], lines = [];
    score.viewport = { pixelsPerSecond: 30, scrollOffset: 0 };
    let nz = 0;
    for (let k = 0; k < takes.length; k++) {
        const at = r3(2 + k * EVERY), placed = await ST.placeTake(drawer, score, takes[k], { art: ART, dyn: DYN, at });
        const notes = placed.notes.slice().sort((a, b) => a.startSeconds - b.startSeconds);
        const first = notes[0].startSeconds, last = notes[notes.length - 1].startSeconds;
        const type = typeOrder[k % typeOrder.length], timing = timingOrder[k % timingOrder.length], seed = SEED * 100 + k + 1, id = 'W' + (k + 1);
        const elec = { id, type, timing, seed, gapMs: +CAT.gapMs || SC.DEFAULTS.gapMs, level: CAT.level || 'mimic', deal: CAT.deal || 'robin', players: [], samples: 'bank', processed: !!((CAT.samples || SC.DEFAULTS.samples).processed) };
        score.objects.push({ id: 'zn-' + (++nz) + '-' + (score.nextId++), type: 'zone', layer: notes[0].layer, startTime: r3(Math.max(0, first - 0.3)), endTime: r3(last + 0.5), player: '', instrument: '', zoneFunction: 'elec', midiModel: 'elecStrike',
            ostinatoParams: { smooth: 0.7, speed: 1, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '', responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null,
            color: '#9E9D24', opacity: 0.35, yOffset: 0, zoneHeight: 0.2, performanceNotes: 'THE RIG — ' + takes[k] + ' (strike #' + placed.strike + '): the electronics answers ' + SC.TYPE_NAME[type] + ', ' + SC.TIMING_NAME[timing],
            properties: { rig: { take: takes[k], strike: placed.strike, k } }, elec });
        // what the window expects, by the page's own functions — the engine draws the same
        const ons = notes.map((o) => ({ atMs: Math.round((o.startSeconds - first) * 10000) / 10, mark: DYN }));
        const a = SC.answer(ons, elec, SC.dialsFor(CAT, type, timing));
        rows.push({ at, take: takes[k], strike: placed.strike, id, type, timing, seed, n: notes.length, lenMs: Math.round((last - first) * 1000), answerAt: r3(last + a.afterMs / 1000), afterMs: Math.round(a.afterMs), onsets: a.onsets.map((o) => Math.round(o.atMs)) });
        lines.push(placed.lines[0]);
    }
    score.metadata.rig = { command: 'node tools/build_strike_rig.js' + process.argv.slice(2).filter((x) => x !== '--replace' && x !== '--dry').join(' ').replace(/^(.)/, ' $1'), seed: SEED, every: EVERY, art: ART, dyn: DYN, takes, built: new Date().toISOString() };
    // the sheet
    const sheet = ['# THE STRIKE RIG — `scores/' + NAME + '.json`', '',
        '*Built ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' by `' + score.metadata.rig.command.trim() + '` (PLAN.md 1.9 · 17.1 d). Regenerated at every build — do not edit.*', '',
        'His strike takes (`bank/panel_snapshots.json`, the Strikes drawer), each in the **' + ART + '** set at **' + DYN + '**, ' + EVERY + ' s apart, each under a STRIKE WINDOW brick (`W`, the electronics\' sixth object). Played from 0 with the engine up, the engine hears every note inside a window (the simulated ear), waits ' + (elecGap(CAT)) + ' ms of silence, and ANSWERS: the rhythm transformed, placed after the strike\'s last note, one banked sample a player, each onset at the strike\'s loudness. The catalogue: `bank/strike_responses.json`. What is heard when:', '',
        '| at (s) | take | strike # | notes | long (ms) | rhythm | timing | the answer (ms from its first) | answers from (s) |', '|---|---|---|---|---|---|---|---|---|']
        .concat(rows.map((r) => '| ' + r.at.toFixed(1) + ' | ' + r.take + ' | ' + r.strike + ' | ' + r.n + ' | ' + r.lenMs + ' | **' + SC.TYPE_NAME[r.type] + '** | **' + SC.TIMING_NAME[r.timing] + '** (+' + (r.afterMs / 1000).toFixed(2) + ' s) | ' + r.onsets.join(' · ') + ' | ' + r.answerAt.toFixed(2) + ' |'))
        .concat(['', 'The samples are rolled by the engine at each answer (a deck a player, none twice until all are used; the processed versions ' + (elecProc(CAT) ? 'among them' + envsNote(CAT) : 'left out') + ') — its window says which. The transformations: ' + TYPES.map((t) => SC.TYPE_NAME[t]).join(' · ') + '. The timings: ' + TIMINGS.map((t) => SC.TIMING_NAME[t]).join(' · ') + '. Each appears ' + Math.floor(takes.length / TYPES.length) + ' … ' + Math.ceil(takes.length / TYPES.length) + ' and ' + Math.floor(takes.length / TIMINGS.length) + ' … ' + Math.ceil(takes.length / TIMINGS.length) + ' times.', '',
            'A number changed in the catalogue: the builder with `--replace`, then File ▾ → Reload in the page (the numbers travel in the bricks — no engine restart). A knob on ONE window: its panel (Rhythm · Timing · Seed · Gap · Level · Deal · Processed · Players · Samples).']);
    const out = ['the rig: ' + takes.length + ' takes, ' + score.objects.length + ' objects, ' + r3(rows[rows.length - 1].answerAt).toFixed(1) + ' s to the last answer', ''].concat(lines, ['', 'window · take · strike · rhythm · timing · the answer from']).concat(rows.map((r) => '  ' + r.id.padEnd(4) + r.take.padEnd(10) + ('#' + r.strike).padEnd(5) + SC.TYPE_NAME[r.type].padEnd(12) + SC.TIMING_NAME[r.timing].padEnd(20) + r.answerAt.toFixed(2) + ' s'));
    if (DRY) { out.push('(dry — nothing written)'); console.log(out.join('\n')); return; }
    fs.writeFileSync(FILE, JSON.stringify(score));
    fs.writeFileSync(path.join(ROOT, 'docs', 'STRIKE_RIG.md'), sheet.join('\n') + '\n');
    out.push('written: ' + OUT + ' · docs/STRIKE_RIG.md' + (fs.existsSync(WORK) ? ' — the page holds a working copy: File ▾ → Reload' : ''));
    console.log(out.join('\n'));
})().catch((e) => die(e.stack || String(e)));

function elecGap(C) { return +C.gapMs || SC.DEFAULTS.gapMs; }
function elecProc(C) { return !!((C.samples || SC.DEFAULTS.samples).processed); }
// [§337, DEC-113] the deck's filters, said on the sheet: the endings a processed version may have · the categories a capture may have
function envsNote(C) {
    const S = C.samples || {};
    const e = Array.isArray(S.envs) && S.envs.length ? ' — their endings ' + S.envs.join(' · ') + ' only, the short ones' : '';
    const c = Array.isArray(S.categories) && S.categories.length ? '; the captures of category ' + S.categories.join(' · ') + ' only' : '';
    return e + c;
}
