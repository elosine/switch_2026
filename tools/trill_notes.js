#!/usr/bin/env node
// trill_notes.js — HIS BRICKS BECOME TRILLS, EACH WITH ITS OWN CURVE.
//
// THE STANDARD (his word 2026-10-07, RUNNING_LOG §222: "let's see if we can't get the trills a little bit more standardized so we
// don't have to go through this every time"): a trill here is made EXACTLY as the trills of piece #5 (Scattered Substance, at 1:16)
// — the page's trill zone, its notes laid from HIS PLAYED TRILLS (bank/trill_timing_db.json: the viola's and the cello's own
// playing; the winds and the mallets on his cello playing, as the septet's flute and bass clarinet were), the loudness from the
// curve's height, anchor velocity 65 … 127 through the remap (velMode 'curve'), level 0.5 · smooth 0.7 · stretch 1 · speed 1 ·
// seed 1 · roles · eat — and TWO things of this piece: NO ACCENTED FIRST STRIKE (his word: no sforzando; `--accent` puts the
// septet's back) and the curve a SURGE 2 → 10 (the crescendo tool's 5×, never from silence) in a curve window, his to bend.
// One command per trill; nothing else to decide.
//
// (composer 2026-10-07: "turn these into trills … keep these
// pitches … minor second … the surge style curve … I like the tools in the curve lanes … and then I can adjust the curves").
//
// For every note named: a TRILL zone over the note's own span (the page's own model — midiModel 'trill', `trill` block as
// composer.html createTrill makes it: the note's pitch, the interval UP, the lane's ordinary voice, the accent on, the loudness
// from the curve), and A CURVE OF ITS OWN in the shape asked for (the page's stamp shapes), which the trill reads — so the trill's
// speed and loudness follow THAT curve, and he bends it in the page. WHERE THE CURVE GOES (his word 2026-10-07, RUNNING_LOG §214 —
// "the curve controls aren't working … I like the tools in the curve lanes"):
//   · `--curve window` (the default): in a CURVE WINDOW — A, B or C, the first one free over the trill's span (a trill reads a window
//     over its own span only, so two trills share a window unless they overlap in time) — `curveRef: 'A' | 'B' | 'C'`; the window's
//     dots-and-bend tools edit it (Points · Fill · drag a dot · hold the line and drag · double-click / ALT a dot); the trill's own
//     fill on its lane mirrors the window's curve live; the lit 1 / 2 / 3 on the trill says which.
//   · `--curve lane`: a curve on the player's lane under the trill (`curveRef: 'lane'`, `curveId`) — the lane's node kit; a trill
//     zone drawn over it takes the clicks (§214), so this is for a curve he will not touch.
// The note itself is NOT changed: the page mutes it under the trill at play time and draws it faint (`eat`, `launchedFrom`); take
// the trill off and the note is as it was.
//
//   node tools/trill_notes.js --score <name> --ids wc-383[,wc-397,…]            the notes by id
//   node tools/trill_notes.js --score <name> --from 152 --to 173 [--lanes bfl]   or every note whose START lies in a stretch
//       [--interval 1]   semitones UP from the note's pitch (1 = the minor second — his word for this passage; the page's own default is 2)
//       [--shape surge]  surge (slow → fast, exponential) · bloom (fast early, then level) · arch · line · saw
//       [--curve window] window (A / B / C, the first free) · lane (on the player's lane)
//       [--accent]       the page's accented first strike (velocity 127) — OFF by default here (§220); the shapes have a floor of 2 (p), not 0
//       [--voice <key>]  the trill's technique outright; else the lane's ordinary voice — except that a note whose own technique has a
//                        family with a `main` patch on the lane (a glockenspiel roll → glock_main_hard) trills in that family (§219)
//       [--off]          take the trills this tool made off those notes (the zone and its curve gone; the note untouched)
//       [--dry]          say what would happen, write nothing
//
// IT WRITES THE SCORE. It refuses when the page holds a working copy of it that differs (scores/<name>-work.json — his unsaved
// edits; tools/impulse.js's rule): CTRL+S in the page first, or File ▾ → Reload after. `--unsaved-ok` at his word only.
// The record: the zone's `properties.trillFrom` (the note, the shape, the command) and the curve's `properties.trillCurve` (the zone).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : d; };
const die = (msg, code) => { console.error(msg); process.exit(code || 2); };

// the page's stamp shapes (composer.html, the STAMPS table): y 0 … 10 = the trill's level 0 … 1 — with a FLOOR (§220, his word on the
// cello: "starts very quiet, like almost inaudible, and then it kicks in like a sudden jump"): a trill's level is its speed AND its
// loudness, and an exponential from 0 is near-silent for most of its span; the floor was 2 (the crescendo tool's surge 5×) for a few
// hours — HIS WORD the same evening (§223): "drop the trill curves back down to from zero to the top" → 0. His to move.
const FLOOR = 0;
// THE CELLO'S LAYER STEP (§224, his "around 157.2 volume jumps"): Xsample's cello senza_vel jumps ~10 dB between velocity ~64 and ~80
// (two layers; the septet's finer card, 64: −38.5 → 80: −28.4 dB); the remap's 4-point card here is linear across it, so a swell from
// anchor 65 crosses the step two thirds of the way up. The viola's library has no such step in the trill's range. SAME METHOD, one
// number: the cello's trill starts at anchor 95 (velocity ~68) so the crossing falls in the first second, where it reads as the
// swell's beginning. Measured by ear once: his. The real cure is a finer cello card (container 5) — his to ask.
const VEL_LO = { cello: 95 };
const SHAPES = {
    surge: { nodes: [{ pos: 0, y: 0, smooth: 0.25 }, { pos: 1, y: 10, smooth: 0.25 }], segments: [{ model: 'exponential', slope: 0.4 }] },
    bloom: { nodes: [{ pos: 0, y: 0, smooth: 0.25 }, { pos: 1, y: 10, smooth: 0.25 }], segments: [{ model: 'logarithmic', slope: -0.29 }] },
    arch: { nodes: [{ pos: 0, y: 0, smooth: 0.25 }, { pos: 0.5, y: 10, smooth: 0.25 }, { pos: 1, y: 0, smooth: 0.25 }], segments: [{ model: 'sigmoid', slope: 0.6 }, { model: 'sigmoid', slope: 0.6 }] },
    line: { nodes: [{ pos: 0, y: 0, smooth: 0.25 }, { pos: 1, y: 10, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }] },
    saw: { nodes: [{ pos: 0, y: 0, smooth: 0.25 }, { pos: 0.85, y: 10, smooth: 0.25 }, { pos: 1, y: 0, smooth: 0.25 }], segments: [{ model: 'exponential', slope: 0.4 }, { model: 'power', slope: 0 }] }
};
const N = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const pn = (m) => N[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);

const name = arg('score');
if (!name) die('usage: node tools/trill_notes.js --score <name> (--ids a,b | --from s --to s [--lanes x,y]) [--interval 1] [--shape surge] [--off] [--dry]');
const file = path.join(ROOT, 'scores', name.replace(/\.json$/, '') + '.json');
if (!fs.existsSync(file)) die('no such score: ' + path.relative(ROOT, file));
const save = JSON.parse(fs.readFileSync(file, 'utf8'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = save.tracks;

// the page's working copy (scores/<name>-work.json — tools/unsaved_check.js's comparison): his unsaved edits are not written over
const working = file.replace(/\.json$/, '-work.json');
if (!has('unsaved-ok') && fs.existsSync(working)) {
    // the page's own live stamps (a trill's midiSnippet · a note's mutedBy · _fields) are not his edits (§214 · §219)
    const strip = (o) => { const c = Object.assign({}, o); delete c.midiSnippet; delete c.mutedBy; Object.keys(c).forEach((k) => { if (k[0] === '_') delete c[k]; }); return c; };
    const essence = (s) => { try { const o = JSON.parse(s); return JSON.stringify((o.objects || []).map(strip)); } catch (e) { return s; } };
    const same = essence(fs.readFileSync(working, 'utf8')) === essence(fs.readFileSync(file, 'utf8'));
    if (!same && !has('dry')) die('the page holds a working copy of ' + path.basename(file) + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (or --unsaved-ok at his word).', 3);
    console.log(same ? '(the working copy differs from the save only by the page\'s own stamps, if at all; Reload in the page after this)' : '(THE PAGE HOLDS UNSAVED CHANGES — this dry run is of the SAVE, not of what the page shows)');
}

const shape = arg('shape', 'surge');
if (!SHAPES[shape]) die('--shape: one of ' + Object.keys(SHAPES).join(', '));
const interval = Math.round(+arg('interval', 1));
if (!(interval >= 1 && interval <= 12)) die('--interval: 1 … 12 semitones up');
const mode = arg('curve', 'window');
if (!/^(window|lane)$/.test(mode)) die('--curve: window (a curve window A / B / C — the dots-and-bend tools) or lane (a curve on the player\'s lane)');
// the curve windows (composer.html CURVE_LAYERS · CURVE_NAMES · CURVE_COLORS); a window is free over a span when no curve on it overlaps the span
const WIN = [7, 8, 9], WIN_NAME = { 7: 'A', 8: 'B', 9: 'C' }, WIN_COLOR = { 7: '#C2410C', 8: '#1D6FA5', 9: '#6D3B9E' };
const busy = (L, s, e) => save.objects.some((o) => o.type === 'waveCurve' && o.layer === L && o.endSeconds > s && o.startSeconds < e);
const isNote = (o) => o.type === 'waveCurve' && o.sonifyNote != null && o.layer < TRACKS.length;
let notes;
if (arg('ids')) {
    const want = arg('ids').split(',').map((s) => s.trim()).filter(Boolean);
    notes = want.map((id) => save.objects.find((o) => o.id === id));
    want.forEach((id, i) => { if (!notes[i]) die('no object ' + id + ' in the score'); if (!isNote(notes[i])) die(id + ' is not a note on a player\'s lane'); });
} else {
    const from = arg('from') != null ? +arg('from') : -Infinity, to = arg('to') != null ? +arg('to') : Infinity;
    const laneOf = (w) => { const s = String(w).trim().toLowerCase(); return TRACKS.findIndex((t, k) => String(k) === s || String(t.id || '').toLowerCase() === s || String(t.short || '').toLowerCase() === s || String(t.label || '').toLowerCase() === s); };
    const lanes = arg('lanes') ? arg('lanes').split(',').map(laneOf) : null;
    if (lanes && lanes.some((l) => l < 0)) die('--lanes: no such lane among ' + TRACKS.map((t) => t.short || t.id).join(', '));
    notes = save.objects.filter((o) => isNote(o) && o.startSeconds >= from && o.startSeconds <= to && (!lanes || lanes.includes(o.layer))).sort((a, b) => a.startSeconds - b.startSeconds);
}
if (!notes.length) die('no note there: nothing to do', 1);
notes.sort((a, b) => a.startSeconds - b.startSeconds);   // in time order: the windows are dealt first-free as the trills come

const out = [], command = 'node tools/trill_notes.js ' + process.argv.slice(2).filter((x) => x !== '--dry').join(' ');
if (has('off')) {
    let n = 0;
    for (const note of notes) {
        const zones = save.objects.filter((o) => o.type === 'zone' && o.midiModel === 'trill' && o.properties && o.properties.trillFrom && o.properties.trillFrom.note === note.id);
        for (const z of zones) {   // the zone and the curve this tool made for it (on the lane or in a window), by the curve's own tag
            save.objects = save.objects.filter((o) => o !== z && !(o.type === 'waveCurve' && o.properties && o.properties.trillCurve === z.id));
            n++;
        }
        out.push('  ' + note.id + ' ' + (TRACKS[note.layer].short || note.layer) + ' ' + pn(note.sonifyNote) + ' @ ' + note.startSeconds.toFixed(2) + ' s: ' + (zones.length ? zones.length + ' trill(s) off' : 'no trill of this tool on it'));
    }
    out.unshift('trills off: ' + n);
} else {
    let nextId = Math.max(+save.nextId || 1, 1 + save.objects.reduce((m, o) => { const k = /-(\d+)$/.exec(String(o.id || '')); return k ? Math.max(m, +k[1]) : m; }, 0));
    let made = 0;
    for (const note of notes) {
        const already = save.objects.find((o) => o.type === 'zone' && o.midiModel === 'trill' && o.properties && o.properties.trillFrom && o.properties.trillFrom.note === note.id);
        if (already) { out.push('  ' + note.id + ': has a trill of this tool already (' + already.id + ') — left as it is; --off first to redo'); continue; }
        const tr = TRACKS[note.layer], inst = INSTRUMENTS[tr.instKey] || {};
        // THE VOICE: the lane's ordinary — except where the note's own technique has a FAMILY with a `main` patch on this lane (the
        // mallets: a glockenspiel roll trills on glock_main_hard, not on the lane's crotales — §219); `--voice <key>` says it outright
        const voice = (() => {
            if (arg('voice')) return arg('voice');
            const fam = String(note.technique || '').split('_')[0], techs = inst.techniques || [];
            const mains = fam && fam !== String(inst.ordinary || '').split('_')[0] ? techs.filter((q) => q.key.startsWith(fam + '_main')) : [];
            const pick = mains.find((q) => /_hard$/.test(q.key)) || mains[0];
            return pick ? pick.key : (inst.ordinary || note.technique || '');
        })();
        const start = Math.round(note.startSeconds * 1000) / 1000, end = Math.round(note.endSeconds * 1000) / 1000;
        const zid = 'zn-' + (nextId++), cid = 'wc-' + (nextId++);
        const sh = SHAPES[shape];
        let L = note.layer, curveRef = 'lane', curveId = cid, color = '#F04B00', opacity = 0.5, fillMode = 'bottom', where = cid + ' on the lane';
        if (mode === 'window') {
            L = WIN.find((K) => !busy(K, start, end));
            if (L == null) die('no curve window is free over ' + start.toFixed(2) + ' → ' + end.toFixed(2) + ' s (A, B and C each hold a curve there): --curve lane for ' + note.id + ', or move a curve');
            curveRef = WIN_NAME[L]; curveId = ''; color = WIN_COLOR[L]; opacity = 0.45; fillMode = 'line'; where = 'window ' + curveRef + ' (' + cid + ')';
        }
        const curve = { id: cid, type: 'waveCurve', layer: L, startSeconds: start, endSeconds: end,
            nodes: sh.nodes.map((n) => Object.assign({}, n, { y: Math.max(FLOOR, n.y) })), segments: sh.segments.map((s) => Object.assign({}, s)),
            color, fillMode, opacity, performanceNotes: 'trill curve · ' + shape + ' · ' + note.id, properties: { trillCurve: zid } };
        const zone = { id: zid, type: 'zone', layer: note.layer, startTime: start, endTime: end, player: '', instrument: '',
            zoneFunction: 'midiPreview', midiModel: 'trill', ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [],
            ratioSourceZoneId: '', ratioGroup: '', responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null,
            color: '#F04B00', opacity: 0.16, yOffset: 0.5, zoneHeight: 0.96, performanceNotes: 'trill',
            properties: { trillFrom: { note: note.id, shape, interval, at: new Date().toISOString(), command } },
            // the ACCENT (the page's default: the first strike at velocity 127) is OFF here — a trill rising from quiet must start at the curve's level (§220: "the first strike is loud"); --accent puts it back
            trill: { pitch: note.sonifyNote, interval, technique: voice, accent: has('accent'), attackVel: 127, attackTech: '', attackDurMs: null,
                curveId, curveRef, level: 0.5, eat: true, smooth: 0.7, stretch: 1, speed: 1, seed: 1, roles: true, launchedFrom: note.id,
                velMode: 'curve', velLo: VEL_LO[tr.instKey] != null ? VEL_LO[tr.instKey] : 65, velHi: 127 } };
        save.objects.push(curve, zone);
        made++;
        out.push('  ' + note.id + ' ' + (tr.short || note.layer) + ' ' + pn(note.sonifyNote) + ' → trill ' + pn(note.sonifyNote) + '–' + pn(note.sonifyNote + interval) + ' · ' + start.toFixed(2) + ' → ' + end.toFixed(2) + ' s · ' + shape + ' · ' + zid + ' reads ' + where + ' · voice ' + (zone.trill.technique || '(the lane\'s ordinary)'));
    }
    save.nextId = nextId;
    out.unshift('trills made: ' + made + ' of ' + notes.length + ' notes (' + shape + ', +' + interval + ' semitone' + (interval > 1 ? 's' : '') + ')');
}
console.log(out.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
save.metadata = save.metadata || {}; save.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(save, null, 1) + '\n');
console.log('written: ' + path.relative(ROOT, file) + ' — in the page: File ▾ → Reload');
