#!/usr/bin/env node
// dyn_deal.js — THE DYNAMICS DEALT (his word 2026-11-10, RUNNING_LOG §151: "a distribution of dynamics — just P, MF and FFF, a random distribution
// across each part"). Every played-in note in the window gets one of the named dynamics, drawn per LANE from a shuffled, exhaustive deck (each
// name as often as the others over a lane, never the same twice in a row). The dynamic is the score's WRITTEN scale (dyn_ui.js StrikeDyn —
// ppp 65 · pp 74 · p 83 · mp 92 · mf 100 · f 109 · ff 118 · fff 127): the note's `recVel` becomes that anchor, which is what the notation
// reads and what the level map (section_level.js --apply) maps onto the standard. The struck velocity is kept under properties.dyn.was; --undo.
//
//   node tools/dyn_deal.js --score <save> --from 195 --to 253 [--levels p,mf,fff] [--seed N] [--lanes flute,violin] [--out <save>] [--undo] [--dry]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const Roll = require(path.join(ROOT, 'score', 'public', 'three_body_roll.js'));
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const NAMES = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'], LO = 65, HI = 127;
const ANCHOR = {}; NAMES.forEach((n, i) => { ANCHOR[n] = Math.round(LO + (HI - LO) * i / (NAMES.length - 1)); });
const name = arg('score') || die('--score'), from = +arg('from', 0), to = +arg('to', 1e9), seed = +arg('seed', 17);
const levels = String(arg('levels', 'p,mf,fff')).split(',').map((s) => s.trim()); for (const l of levels) if (!ANCHOR[l]) die('no such dynamic: ' + l + ' (' + NAMES.join(' ') + ')');
const file = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(file)) die('no such score');
const outName = arg('out', name), outFile = path.join(ROOT, 'scores', outName + '.json');
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
const onlyLanes = arg('lanes') ? arg('lanes').split(',') : null;
const notes = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.startSeconds >= from && o.startSeconds < to && !TRACKS[o.layer].elec && (!onlyLanes || onlyLanes.includes(TRACKS[o.layer].id)));
if (has('undo')) { let n = 0; for (const o of notes) { const w = o.properties && o.properties.dyn && o.properties.dyn.was; if (w == null) continue; o.recVel = w; delete o.properties.dyn; n++; } console.log(n + ' note(s) back to their struck velocities'); if (!has('dry')) { fs.writeFileSync(outFile, JSON.stringify(s)); console.log('written: scores/' + outName + '.json'); } process.exit(0); }
const rnd = Roll.mulberry32(seed);
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const tally = {};
for (let L = 0; L < TRACKS.length; L++) {
    const mine = notes.filter((o) => o.layer === L).sort((a, b) => a.startSeconds - b.startSeconds); if (!mine.length) continue;
    let pile = [], last = null; tally[TRACKS[L].id] = {};
    for (const o of mine) {
        if (!pile.length) { pile = shuffle(levels); if (last && pile[0] === last && levels.length > 1) pile.push(pile.shift()); }
        const lv = pile.shift(); last = lv;
        const was = (o.properties && o.properties.dyn && o.properties.dyn.was != null) ? o.properties.dyn.was : o.recVel;
        o.properties = o.properties || {}; o.properties.dyn = { was, level: lv }; o.recVel = ANCHOR[lv];
        tally[TRACKS[L].id][lv] = (tally[TRACKS[L].id][lv] || 0) + 1;
    }
}
for (const [lane, t] of Object.entries(tally)) console.log(lane.padEnd(11) + Object.entries(t).map(([k, n]) => k + ' ' + n).join(' · '));
console.log(notes.length + ' notes · ' + levels.map((l) => l + '=' + ANCHOR[l]).join(' ') + ' · seed ' + seed + ' · then section_level.js --apply maps them onto the standard');
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString(); if (outName !== name) s.metadata.title = outName;
fs.writeFileSync(outFile, JSON.stringify(s));
console.log('written: scores/' + outName + '.json');
