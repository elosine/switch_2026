#!/usr/bin/env node
// impulse_pitches.js — THE OPENING'S IMPULSES ON OTHER PITCHES, BY A ROLL.
//
// (composer 2026-10-10, DEC-144, RUNNING_LOG §373: "the initial … six impulses per instrument … these are the ones I played in … The
// pitched instruments, could we vary or do a roll of the, their samples? I think I'd like to have a more variety of pitch. So if you
// can keep whatever articulations and whatnot are there … hang on to the settings of the current … pop up one variation into the score
// now. And if I need to hear another one, I will ask for one.")
//
// For every mic opening `<player>-impulse-<n>` of a stretch: the note under it keeps its articulation, its place, its length and its
// velocity, and takes a NEW KEY — drawn inside the keys that articulation is KNOWN to sound on (bank/impulse_pitches.json, HIS data:
// a row is evidence, never a guess — a key outside a preset's zone is silent and its impulse is then not captured). Per player the
// keys are SPREAD: each note in turn takes a key far from the player's other impulses (a seeded draw among the farthest), so the six
// are in different registers where their articulations allow it. LEFT AS THEY ARE, and said: an unpitched lane · an articulation
// that goes BY KEY (a gesture or a multiphonic a key, not a pitch) · an articulation with no row in the file.
//
// THE PITCH HE PLAYED IS KEPT on the note (`properties.impulsePitch.from`) through any number of rolls: `--off` puts it back.
//
//   node tools/impulse_pitches.js --score <name> [--from 0] [--to 37] [--seed 1] [--off] [--dry] [--unsaved-ok]
//
// IT WRITES THE SCORE (a working copy of the page that differs refuses it — tools/trill_notes.js's rule); then File ▾ → Reload in the
// page, BEFORE any Save. The samples keep their names: the first pass after a roll still returns the earlier takes' renders where a
// return comes sooner than its render; the second pass is the new pitches throughout.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const K = require('./audition_kit.js');
const ROOT = K.ROOT, has = K.flag, arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : d; };
const die = (msg, code) => { console.error(msg); process.exit(code || 2); };

const name = arg('score');
if (!name) die('usage: node tools/impulse_pitches.js --score <name> [--from 0] [--to 37] [--seed 1] [--off] [--dry]');
const file = path.join(ROOT, 'scores', name.replace(/\.json$/, '') + '.json');
if (!fs.existsSync(file)) die('no such score: ' + K.rel(file));
const text = fs.readFileSync(file, 'utf8'), save = JSON.parse(text);
const FORMS = { compact: (o) => JSON.stringify(o), compactNl: (o) => JSON.stringify(o) + '\n', one: (o) => JSON.stringify(o, null, 1), oneNl: (o) => JSON.stringify(o, null, 1) + '\n' };
const form = Object.keys(FORMS).find((k) => FORMS[k](save) === text) || 'oneNl';   // the file's own form, so that only the keys move

// the page's working copy: his unsaved edits are not written over (the page's own live stamps are not edits)
const working = file.replace(/\.json$/, '-work.json');
if (!has('unsaved-ok') && fs.existsSync(working)) {
    const strip = (o) => { const c = Object.assign({}, o); delete c.midiSnippet; delete c.mutedBy; Object.keys(c).forEach((k) => { if (k[0] === '_') delete c[k]; }); return c; };
    const essence = (s) => { try { return JSON.stringify((JSON.parse(s).objects || []).map(strip)); } catch (e) { return s; } };
    if (essence(fs.readFileSync(working, 'utf8')) !== essence(text) && !has('dry')) die('the page holds a working copy of ' + path.basename(file) + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (or --unsaved-ok at his word).', 3);
}

const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const WHERE = K.readJson(path.join(ROOT, 'bank', 'impulse_pitches.json'));
const T = save.tracks, O = save.objects;
const from = +arg('from', 0), to = +arg('to', 37), seed = Math.round(+arg('seed', 1));
const PERC = /percussion|vibraphone/;
const lanesOf = (open) => (open.elec.player === 'perc' ? T.map((t, i) => (PERC.test(t.instKey) ? i : -1)).filter((i) => i >= 0) : [open.layer]);

// every impulse of the stretch: its opening, its note, what the roll may do with it
const opens = O.filter((o) => o.type === 'zone' && o.midiModel === 'elecOpen' && o.elec && /-impulse-\d+$/.test(String(o.elec.name || '')) && o.startTime >= from && o.startTime < to)
    .sort((a, b) => a.startTime - b.startTime);
if (!opens.length) die('no impulse opening between ' + from + ' and ' + to + ' s in ' + K.rel(file), 1);
const rows = [];
for (const m of opens) {
    const lanes = lanesOf(m);
    const notes = O.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && lanes.includes(o.layer) && o.startSeconds >= m.startTime - 0.01 && o.startSeconds < m.endTime);
    if (notes.length !== 1) { rows.push({ m, why: notes.length ? notes.length + ' notes under its opening' : 'no note under its opening' }); continue; }
    const n = notes[0], ik = T[n.layer].instKey, q = ((INSTRUMENTS[ik] || {}).techniques || []).find((x) => x.key === n.technique) || {};
    const w = (WHERE[ik] || {})[n.technique];
    const was = n.properties && n.properties.impulsePitch ? +n.properties.impulsePitch.from : n.sonifyNote;
    rows.push({ m, n, ik, was, win: w && Array.isArray(w.keys) ? w.keys : null,
        why: q.kind && q.kind !== 'pitched' ? 'goes by key (' + q.kind + '), not by pitch' : !w ? 'no row for ' + ik + ' · ' + n.technique + ' in bank/impulse_pitches.json' : '' });
}

const out = [], said = (r, toKey) => '  ' + String(r.m.elec.name).padEnd(15) + String(r.n ? r.n.technique : '').padEnd(30) + (r.n ? K.noteName(r.was).padEnd(4) + (toKey == null ? '' : ' → ' + K.noteName(toKey).padEnd(4) + ' (' + r.was + ' → ' + toKey + ')') : '');
if (has('off')) {
    let n = 0;
    for (const r of rows) if (r.n && r.n.properties && r.n.properties.impulsePitch) { r.n.sonifyNote = r.was; delete r.n.properties.impulsePitch; n++; out.push(said(r, r.was) + ' — as he played it'); }
    out.unshift('the pitches he played put back: ' + n + ' notes');
} else {
    const players = [...new Set(rows.map((r) => r.m.elec.player))];
    let moved = 0;
    for (const p of players) {
        const mine = rows.filter((r) => r.m.elec.player === p), roll = mine.filter((r) => r.n && !r.why), rnd = K.mulberry32(seed * 7919 + players.indexOf(p) * 104729 + 17);
        const taken = mine.filter((r) => r.n && r.why).map((r) => r.n.sonifyNote);   // the keys that stay: the others keep away from them too
        const order = roll.map((r) => [rnd(), r]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
        for (const r of order) {
            const cands = []; for (let k = r.win[0]; k <= r.win[1]; k++) if (k !== r.was) cands.push(k);
            if (!cands.length) { r.to = r.was; taken.push(r.was); continue; }
            const far = (k) => (taken.length ? Math.min(...taken.map((x) => Math.abs(x - k))) : 99), best = Math.max(...cands.map(far));
            const pool = cands.filter((k) => far(k) >= Math.max(1, best - 2));
            r.to = (pool.length ? pool : cands)[Math.floor(rnd() * (pool.length ? pool.length : cands.length))];
            taken.push(r.to);
        }
        for (const r of mine) {
            if (r.to != null) {
                r.n.properties = r.n.properties || {};
                r.n.properties.impulsePitch = { from: r.was, seed, at: new Date().toISOString() };
                r.n.sonifyNote = r.to; if (r.to !== r.was) moved++;
                out.push(said(r, r.to));
            } else out.push(said(r, null) + ' — LEFT: ' + r.why);
        }
    }
    out.unshift('the opening\'s impulses rolled, seed ' + seed + ' — ' + moved + ' of ' + rows.length + ' on a new pitch (' + from + ' … ' + to + ' s):');
}
console.log(out.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
fs.writeFileSync(file, FORMS[form](save));
console.log('written: ' + K.rel(file) + ' — in the page: File ▾ → Reload, BEFORE any Save');
