#!/usr/bin/env node
// sine_go.js — THE GO ON A SAVED SCORE (PLAN.md 1.5 · 12.5; RUNNING_LOG §180): what the harmony strip's  take ▾  and  ∿ sines
// do in the page, from the command line — the same module (score/public/sine_go.js), so a builder and a redo need no page.
//
//   node tools/sine_go.js --score <name> [--take <name>] [--from <s>] [--to <s>] [--lanes bfl,bcl,mal,va,vc] [--seed N] [--dry] [--off]
//
//   --score   the save, scores/<name>.json
//   --take    a take of the Strikes drawer (bank/panel_snapshots.json, panels.strikes): each note takes ITS lane's pitch from it,
//             in time order, round robin where a lane holds several — the strip's own rule. Without it the notes keep their pitches.
//   --from · --to   the notes whose START lies in this stretch of seconds (all of them where neither is said)
//   --lanes   only these lanes — by a track's short name, its id or its number
//   --seed    the seed of the drawn behaviours (1)
//   --off     take the sines OFF those notes instead: the bricks gone, the voice and the sound as before (the pitches stay)
//   --dry     say what would happen, write nothing
//
// IT WRITES THE SCORE. It refuses when the page holds a working copy of it that differs (scores/<name>-work.json — his unsaved
// edits; tools/impulse.js's rule): CTRL+S in the page first, or File ▾ → Reload after. `--unsaved-ok` at his word only.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SineSim = require(path.join(ROOT, 'score', 'public', 'sine_sim.js')), SineGo = require(path.join(ROOT, 'score', 'public', 'sine_go.js'));
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : d; };
const die = (msg, code) => { console.error(msg); process.exit(code || 2); };

const name = arg('score');
if (!name) die('usage: node tools/sine_go.js --score <name> [--take <name>] [--from s] [--to s] [--lanes a,b] [--seed N] [--dry] [--off]');
const file = path.join(ROOT, 'scores', name.replace(/\.json$/, '') + '.json');
if (!fs.existsSync(file)) die('no such score: ' + path.relative(ROOT, file));
const save = JSON.parse(fs.readFileSync(file, 'utf8'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = save.tracks;
const cfg = SineSim.config(JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'sine_behaviours.json'), 'utf8')));

// the page's working copy (scores/<name>-work.json — tools/unsaved_check.js's comparison): his unsaved edits are not written over
const working = file.replace(/\.json$/, '-work.json');
if (!has('unsaved-ok') && fs.existsSync(working)) {
    const essence = (s) => { try { const o = JSON.parse(s); if (o && o.metadata) { delete o.metadata.modified; delete o.metadata.created; } if (o) delete o.viewport; return JSON.stringify(o); } catch (e) { return s; } };
    const same = essence(fs.readFileSync(working, 'utf8')) === essence(fs.readFileSync(file, 'utf8'));
    if (!same && !has('dry')) die('the page holds a working copy of ' + path.basename(file) + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (or --unsaved-ok at his word).', 3);
    console.log(same ? '(the working copy is identical to the save: nothing unsaved; Reload in the page after this)' : '(THE PAGE HOLDS UNSAVED CHANGES — this dry run is of the SAVE, not of what the page shows)');
}

const from = arg('from') != null ? +arg('from') : -Infinity, to = arg('to') != null ? +arg('to') : Infinity;
const laneOf = (w) => { const s = String(w).trim().toLowerCase(); const i = TRACKS.findIndex((t, k) => String(k) === s || String(t.id || '').toLowerCase() === s || String(t.short || '').toLowerCase() === s || String(t.label || '').toLowerCase() === s); return i; };
const lanes = arg('lanes') ? arg('lanes').split(',').map(laneOf) : null;
if (lanes && lanes.some((l) => l < 0)) die('--lanes: no such lane among ' + TRACKS.map((t) => t.short || t.id).join(', '));
const notes = save.objects.filter((o) => SineGo.isNote(o, TRACKS.length) && o.startSeconds >= from && o.startSeconds <= to && (!lanes || lanes.includes(o.layer)));
if (!notes.length) die('no note there: nothing to do', 1);

const out = [];
if (has('off')) {
    const u = SineGo.unconvert(notes, { objects: save.objects });
    out.push('∿ off: ' + u.length + ' of ' + notes.length + ' notes had a sine — bricks gone, the voice and the sound as before');
} else {
    const take = arg('take');
    if (take) {
        const snaps = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8'));
        const t = snaps.panels && snaps.panels.strikes && snaps.panels.strikes[take];
        if (!t) die('no take named "' + take + '" in bank/panel_snapshots.json — the Strikes drawer\'s: ' + (Object.keys((snaps.panels && snaps.panels.strikes) || {}).join(', ') || '(none yet)'));
        const chord = SineGo.takeChord(t.state, TRACKS);
        const a = SineGo.applyChord(notes, chord, take);
        out.push('take "' + take + '" → ' + a.done.length + ' notes · ' + chord.map((n) => (TRACKS[n.lane].short || n.lane) + ' ' + SineGo.pn(n.midi)).join(' · ')
            + (a.left.length ? ' · left as they are (not in the take): ' + a.left.map((l) => TRACKS[l].short || l).join(', ') : ''));
    }
    let nextId = Math.max(+save.nextId || 1, 1 + save.objects.reduce((m, o) => { const k = /-(\d+)$/.exec(String(o.id || '')); return k ? Math.max(m, +k[1]) : m; }, 0));
    const seed = Math.max(1, Math.round(+arg('seed', 1)));
    const r = SineGo.convert(notes, { objects: save.objects, instruments: INSTRUMENTS, tracks: TRACKS, cfg, seed, take: take || '', newId: () => 'zn-' + (nextId++) });
    save.nextId = nextId;
    save.metadata = save.metadata || {};
    (save.metadata.sineGo = save.metadata.sineGo || []).push({ at: new Date().toISOString(), take: take || null, seed, from: Number.isFinite(from) ? from : null, to: Number.isFinite(to) ? to : null,
        notes: r.done.map((d) => d.note.id), command: 'node tools/sine_go.js ' + process.argv.slice(2).filter((x) => x !== '--dry').join(' ') });
    out.push('∿ sines, seed ' + seed + ': ' + r.done.length + ' notes → ' + r.done.filter((d) => d.isNew).length + ' new bricks' + (r.done.some((d) => !d.isNew) ? ', ' + r.done.filter((d) => !d.isNew).length + ' redrawn' : '')
        + (r.skipped.length ? ' · ' + r.skipped.length + ' left alone' : ''));
    r.lines.forEach((l) => out.push('  ' + l));
}
console.log(out.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
save.metadata = save.metadata || {}; save.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(save, null, 1) + '\n');
console.log('written: ' + path.relative(ROOT, file) + ' — in the page: File ▾ → Reload');
