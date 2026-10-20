#!/usr/bin/env node
// strike_swap.js — A STRIKE OF THE SCORE REPLACED BY A TAKE OF THE STRIKES DRAWER (RUNNING_LOG §414, DEC-184 — 2026-10-10).
//
//   node tools/strike_swap.js --score piece-Draft01d --swap 677.0=strikes01aa,678.77=strikes02aa,… [--art staccato] [--dyn f]
//                             [--backup <file>] [--dry]
//
// His words: "Strike one and two are AA, and the rest are A. A few of them change the notes of other players, but most of those are
// just the missing players. But you can replace those strikes altogether with these ones … the new strike audio for the render, and
// then the rhythms for the GCs where they are missing."
//
// WHY: eleven WRITTEN strikes of the section lacked a player (the take they came from gave that player no hit). He re-saved each take
// with all five players; this puts each of those takes in the place of its strike, IN THE SCORE — so the audio of the next take has
// it, the electronics hear it, and the notation's GCs come from the notes as everywhere else.
//
// WHAT IT DOES, a strike at a time (t = the strike's first hit now, within 0.15 s; the take must play the SAME bank strike):
//   · the take is laid out by THE DRAWER'S OWN CODE (tools/strike_take.js: load the take · press the articulation set · the dynamic ·
//     Insert) into a scratch score — its lanes, pitches, folds and doubled hits are the page's, nothing is re-derived here;
//   · the strike's place in time is found from the notes it has (each sits on a hit of the bank strike), so a hit keeps its instant;
//   · A PLAYER THE STRIKE HAS: the note stays the note it is (its id, its voice — the section's orchestration, a percussion
//     instrument the percussion pass chose, a pitch of a pitch take). It MOVES only if the take gives the player another hit, and takes
//     a NEW PITCH only if the take's pitch for the player differs from the one the strike was inserted with (by octaves into its voice);
//   · A PLAYER THE STRIKE LACKED: a new note on the take's hit, in the voice of the strike's own orchestration (the voice of its
//     family's other player — bass flute ↔ bass clarinet, viola ↔ cello — by octaves into its range; with no such neighbour, as the
//     drawer made it);
//   · THE PERCUSSIONIST HAS ONE NOTE A STRIKE, here as in the whole section (measured: every strike note on the mallets lane was put
//     there by the percussion pass; none comes from a take's mallet seats): the take's percussion hit is used, its two mallet seats are not;
//   · a player the take no longer has is taken out (said);
//   · THE WINDOW over the strike keeps its lead and its trail about the strike's first and last hit, and its ear (the silence that ends
//     the strike · the grace) is set again from the strike's widest gap — tools/strike_windows.js's own rule.
// Each touched note and the window say so (properties.strikeSwap). The base is the NEWER of the save and the page's working copy;
// the save is written — then File ▾ → Reload in the page BEFORE any Save. --dry prints the plan and writes nothing.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const { openDrawer, placeTake, newScore } = require('./strike_take.js');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(1); };
const NAME = arg('score'), SWAP = arg('swap'), ART = arg('art', 'staccato'), DYN = arg('dyn', 'f'), DRY = flag('dry'), BACKUP = arg('backup');
if (!NAME || !SWAP) die('--score <name> --swap t=take,t=take,…   (node tools/strike_swap.js --score piece-Draft01d --swap 677.0=strikes01aa [--dry])');
const FILE = path.join(ROOT, 'scores', NAME + '.json'), WORK = path.join(ROOT, 'scores', NAME + '-work.json');
if (!fs.existsSync(FILE)) die('no such score: scores/' + NAME + '.json');
const SEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'strike_section.json'), 'utf8')), O = SEC.orch || {};
const CAT = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'strike_responses.json'), 'utf8'));
const DB = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'scattered_strikes.json'), 'utf8')).strikes;
const TAKES = (JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels || {}).strikes || {};
const INS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const useWork = fs.existsSync(WORK) && fs.statSync(WORK).mtimeMs > fs.statSync(FILE).mtimeMs;
const RAW = fs.readFileSync(FILE, 'utf8');
const s = JSON.parse(useWork ? fs.readFileSync(WORK, 'utf8') : RAW);
const NL = String.fromCharCode(10);
const IND = [0, 2, 1, 4].find((i) => JSON.stringify(JSON.parse(RAW), null, i) === RAW || JSON.stringify(JSON.parse(RAW), null, i) + NL === RAW);
if (IND === undefined) die('the save does not round-trip through JSON — not written');
const instOf = (l) => (s.tracks[l] || {}).instKey, short = (l) => (s.tracks[l] || {}).short || 'L' + l;
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], pn = (m) => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
// a voice's range: his measured zone (orch.ranges.<instrument>.<voice>), else the recipe's, else the instrument's — tools/strike_orch.js's own
const rangeOf = (inst, voice) => { const z = ((O.ranges || {})[inst] || {})[voice]; if (Array.isArray(z)) return z; const I = INS[inst] || {}, t = (I.techniques || []).find((x) => x.key === voice); return [t && t.rangeLow != null ? t.rangeLow : I.rangeLow, t && t.rangeHigh != null ? t.rangeHigh : I.rangeHigh]; };
const hasVoice = (inst, voice) => !!((INS[inst] || {}).techniques || []).some((x) => x.key === voice);
const fit = (key, [lo, hi]) => { let k = key; while (k > hi) k -= 12; while (k < lo) k += 12; return k > hi ? null : k; };
// the lanes of one player: the percussionist's two are one
const PERC = [2, 3], FAMILY = { 0: [1], 1: [0], 4: [5], 5: [4] };
const playerOf = (l) => (PERC.includes(l) ? 'perc' : 'L' + l);
// the pitch a note was INSERTED with, before the section's passes (a pitch take · the orchestration · the percussion pass)
const firstPitch = (o) => { const p = o.properties || {}; return p.strikePitch && p.strikePitch.from != null ? p.strikePitch.from : p.strikeOrch && p.strikeOrch.from && p.strikeOrch.from.key != null ? p.strikeOrch.from.key : p.strikePerc && p.strikePerc.from && p.strikePerc.from.key != null ? p.strikePerc.from.key : o.sonifyNote; };
const ms = (x) => Math.round(x * 1000);

const strikeNotes = () => s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && /^grp-strike-/.test(String(o.groupId || '')));
const groupsNow = () => { const g = new Map(); for (const o of strikeNotes()) { if (!g.has(o.groupId)) g.set(o.groupId, []); g.get(o.groupId).push(o); } return [...g.entries()].map(([group, notes]) => ({ group, notes: notes.sort((a, b) => a.startSeconds - b.startSeconds), f: Math.min(...notes.map((n) => n.startSeconds)), l: Math.max(...notes.map((n) => n.startSeconds)) })).sort((a, b) => a.f - b.f); };
// the instant of the bank strike's hit 0, from notes that each sit on one of its hits (±1.5 ms)
const originOf = (starts, hits) => { for (const h of hits) { const t0 = starts[0] - h.dtMs / 1000; if (starts.every((t) => hits.some((q) => Math.abs((t - t0) * 1000 - q.dtMs) <= 1.5))) return t0; } return null; };

(async () => {
    const drawer = openDrawer(), plans = [];
    const jobs = SWAP.split(',').filter(Boolean).map((x) => { const [t, take] = x.split('='); return { t: parseFloat(t), take: String(take || '').trim(), raw: x }; });
    for (const j of jobs) {
        if (!isFinite(j.t) || !TAKES[j.take]) die('--swap ' + j.raw + ': needs t=take with a take of the strikes panel (' + (TAKES[j.take] ? '' : 'no take "' + j.take + '"') + ')');
        const G = groupsNow(), k = G.findIndex((x) => Math.abs(x.f - j.t) <= 0.15);
        if (k < 0) die('--swap ' + j.raw + ': no strike begins within 0.15 s of ' + j.t + ' s');
        const x = G[k], next = G[k + 1] || null, prev = G[k - 1] || null;
        const W = s.objects.find((o) => o.type === 'zone' && o.midiModel === 'elecStrike' && o.properties && o.properties.strikeSection && o.properties.strikeSection.group === x.group) || null;
        const sid = TAKES[j.take].state.strikeId, bank = DB[sid];
        if (!bank) die('--swap ' + j.raw + ': the take\'s strike ' + sid + ' is not in the bank');
        if (!x.notes.every((o) => String(o.performanceNotes || '').includes(sid))) die('--swap ' + j.raw + ': the strike at ' + x.f.toFixed(3) + ' s is not the take\'s strike (' + sid + ') — ' + (x.notes[0].performanceNotes || '?'));
        const hits = bank.notes, T0 = originOf(x.notes.map((o) => o.startSeconds), hits);
        if (T0 == null) die('--swap ' + j.raw + ': the strike\'s notes do not sit on the bank strike\'s hits — its rhythm was changed by hand; not touched');
        // the take, as the drawer lays it out
        const sc = newScore(), made = await placeTake(drawer, sc, j.take, { art: ART, dyn: DYN, at: 100 });
        const gen = made.notes.slice().sort((a, b) => a.startSeconds - b.startSeconds), gBase = originOf(gen.map((o) => o.startSeconds), hits);
        if (gBase == null) die('--swap ' + j.raw + ': the take\'s notes do not sit on its strike\'s hits (a rhythm change in the take: ' + made.lines[0] + ')');
        const at = (g) => +(T0 + (g.startSeconds - gBase)).toFixed(3), len = (g) => +(g.endSeconds - g.startSeconds).toFixed(3);
        const said = [], seats = gen.filter((g) => g.layer === 3).length;
        const players = ['L0', 'L1', 'perc', 'L4', 'L5'], todo = [];
        for (const P of players) {
            const gs = gen.filter((g) => (P === 'perc' ? g.layer === 2 : 'L' + g.layer === P)), old = x.notes.filter((o) => playerOf(o.layer) === P);
            if (gs.length > 1) said.push('      ! the take gives ' + P + ' ' + gs.length + ' hits — the first is used');
            const g = gs[0] || null, o = old[0] || null;
            if (old.length > 1) said.push('      ! the strike has ' + old.length + ' notes for ' + P + ' — the first is the player\'s, the rest are left');
            if (g && o) {
                const t = at(g), moved = Math.abs(t - o.startSeconds) > 0.0015, was = firstPitch(o), repitch = P !== 'perc' && g.sonifyNote !== was;
                let key = o.sonifyNote;
                if (repitch) { key = fit(g.sonifyNote, rangeOf(instOf(o.layer), o.technique)); if (key == null) key = g.sonifyNote; }
                todo.push({ kind: 'keep', o, t, d: moved ? len(g) : +(o.endSeconds - o.startSeconds).toFixed(3), moved, repitch, key, take: g.sonifyNote });
                said.push('      ' + short(o.layer).padEnd(5) + (moved ? 'MOVES ' + o.startSeconds.toFixed(3) + ' → ' + t.toFixed(3) + ' s' : 'stays at ' + o.startSeconds.toFixed(3) + ' s') + (repitch ? ' · NEW PITCH ' + pn(o.sonifyNote) + ' → ' + pn(key) + ' (the take\'s ' + pn(g.sonifyNote) + ', was inserted on ' + pn(was) + ')' : ' · ' + pn(o.sonifyNote)) + ' · ' + o.technique);
            } else if (g && !o) {
                // the voice of the strike's own orchestration: the family's other player's, where this instrument has it
                const sib = (FAMILY[g.layer] || []).map((l) => x.notes.find((n) => n.layer === l)).find(Boolean) || null;
                const inst = instOf(g.layer), voice = sib && hasVoice(inst, sib.technique) ? sib.technique : g.technique;
                let key = voice === g.technique ? g.sonifyNote : fit(g.sonifyNote, rangeOf(inst, voice)); if (key == null) key = g.sonifyNote;
                todo.push({ kind: 'new', g, t: at(g), d: len(g), voice, key, sib });
                said.push('      ' + short(g.layer).padEnd(5) + 'NEW at ' + at(g).toFixed(3) + ' s · ' + pn(key) + (key !== g.sonifyNote ? ' (the take\'s ' + pn(g.sonifyNote) + ' by octaves)' : '') + ' · ' + voice + (sib ? ' (as the ' + short(sib.layer) + ' of this strike)' : ' (the drawer\'s own voice)'));
            } else if (!g && o) {
                todo.push({ kind: 'drop', o });
                said.push('      ' + short(o.layer).padEnd(5) + 'TAKEN OUT (the take has no hit for it) — was at ' + o.startSeconds.toFixed(3) + ' s');
            } else said.push('      ' + P + ': STILL NO NOTE — the take gives this player no hit');
        }
        plans.push({ j, x, W, next, prev, todo, said, seats, hits, T0 });
    }

    // ---- say, then do
    let nNew = 0, nMove = 0, nPitch = 0, nDrop = 0;
    for (const p of plans) {
        console.log(p.j.take + ' → the strike at ' + p.x.f.toFixed(3) + ' s (' + p.x.group + ', bank hit 0 at ' + p.T0.toFixed(3) + ' s)' + (p.seats ? ' — the take\'s ' + p.seats + ' mallet seat(s) not used: one note for the percussionist' : ''));
        p.said.forEach((l) => console.log(l));
        for (const a of p.todo) {
            if (a.kind === 'keep') {
                if (a.moved) { a.o.startSeconds = a.t; a.o.endSeconds = +(a.t + a.d).toFixed(3); nMove++; }
                if (a.repitch) {
                    const pr = a.o.properties = Object.assign({}, a.o.properties);
                    if (pr.strikeOrch && pr.strikeOrch.from) pr.strikeOrch = Object.assign({}, pr.strikeOrch, { from: Object.assign({}, pr.strikeOrch.from, { key: a.take }) });
                    delete pr.strikePitch;   // the pitch take's deal no longer holds for this note: the take names its pitch
                    a.o.sonifyNote = a.key; nPitch++;
                }
                if (a.moved || a.repitch) a.o.properties = Object.assign({}, a.o.properties, { strikeSwap: { take: p.j.take } });
            } else if (a.kind === 'new') {
                const tpl = a.sib || p.x.notes[0], g = a.g, props = {};
                if (a.sib && a.sib.properties && a.sib.properties.strikeOrch && a.voice !== g.technique) props.strikeOrch = Object.assign({}, a.sib.properties.strikeOrch, { from: { technique: g.technique, key: g.sonifyNote } });
                if (tpl.properties && tpl.properties.section) props.section = Object.assign({}, tpl.properties.section);
                props.strikeSwap = { take: p.j.take, added: true };
                const note = { id: 'wc-' + (s.nextId++), type: 'waveCurve', layer: g.layer, groupId: p.x.group, startSeconds: a.t, endSeconds: +(a.t + a.d).toFixed(3),
                    nodes: JSON.parse(JSON.stringify(g.nodes)), segments: JSON.parse(JSON.stringify(g.segments)), color: tpl.color, fillMode: tpl.fillMode, opacity: tpl.opacity,
                    properties: props, srcKind: 'strike', performanceNotes: tpl.performanceNotes, sonifyNote: a.key, technique: a.voice, sonifyMode: g.sonifyMode || 'plain' };
                if (g.recVel != null) note.recVel = g.recVel;
                s.objects.push(note); nNew++;
            } else if (a.kind === 'drop') { s.objects = s.objects.filter((o) => o !== a.o); nDrop++; }
        }
        // the window: its lead and trail about the strike kept; its ear from the strike as it is now
        const now = strikeNotes().filter((o) => o.groupId === p.x.group).map((o) => o.startSeconds).sort((a, b) => a - b), f = now[0], l = now[now.length - 1];
        if (p.W) {
            const lead = Math.max(0, p.x.f - p.W.startTime), trail = Math.max(0, p.W.endTime - p.x.l), G = (+SEC.guardMs || 100) / 1000, mg = (+SEC.minGapMs || 50) / 1000;
            const prevW = p.prev ? s.objects.find((o) => o.type === 'zone' && o.midiModel === 'elecStrike' && o.properties && o.properties.strikeSection && o.properties.strikeSection.group === p.prev.group) : null;
            let start = +(f - lead).toFixed(3), end = +(l + trail).toFixed(3);
            if (prevW) start = Math.max(start, +(prevW.endTime + mg).toFixed(3));
            if (p.next) end = Math.min(end, +(p.next.f - G).toFixed(3));
            const widest = now.slice(1).reduce((m, t, i) => Math.max(m, t - now[i]), 0);
            const gapMs = Math.min(Math.max(+CAT.gapMs || 500, 150), Math.max(150, ms(widest) + 80)), graceMs = p.next ? Math.max(0, Math.min(gapMs, ms(p.next.f - end) - 40)) : gapMs;
            const was = [p.W.startTime, p.W.endTime, p.W.elec.gapMs, p.W.elec.graceMs];
            p.W.startTime = start; p.W.endTime = end; p.W.elec = Object.assign({}, p.W.elec, { gapMs, graceMs });
            p.W.properties = Object.assign({}, p.W.properties, { strikeSwap: { take: p.j.take, was: { startTime: was[0], endTime: was[1], gapMs: was[2], graceMs: was[3] } } });
            console.log('      the window ' + was[0].toFixed(3) + ' … ' + was[1].toFixed(3) + ' → ' + start.toFixed(3) + ' … ' + end.toFixed(3) + ' s' + (was[0] === start && was[1] === end ? ' (as it was)' : '') + ' · the ear ' + was[2] + ' / ' + was[3] + ' → ' + gapMs + ' / ' + graceMs + ' ms');
        } else console.log('      (no window over this strike)');
    }
    console.log(plans.length + ' strike(s): ' + nNew + ' note(s) added · ' + nMove + ' moved · ' + nPitch + ' re-pitched · ' + nDrop + ' taken out' + (useWork ? ' · base: the page\'s working copy (newer than the save)' : ''));
    if (DRY) { console.log('(dry — nothing written)'); return; }
    if (BACKUP) { fs.copyFileSync(FILE, BACKUP); console.log('the save as it was: ' + BACKUP); }
    fs.writeFileSync(FILE, JSON.stringify(s, null, IND) + (RAW.endsWith(NL) ? NL : ''));
    console.log('written: scores/' + NAME + '.json — File ▾ → Reload in the page BEFORE any Save');
})().catch((e) => die(String(e && e.stack || e)));
