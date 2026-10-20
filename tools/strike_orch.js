#!/usr/bin/env node
// strike_orch.js — THE STRIKES RE-ORCHESTRATED AND RE-PITCHED (PLAN.md 1.9 · 17.3; DEC-129, 2026-10-10: "Can you replace the orchestration
// for about half of them? Let's use bass flute, slap tongue velocity … bass clarinet slap tongue velocity. viola and cello [Bartók
// pizz] … Then, in the strikes drawer, I captured a bunch of takes called strike pitches, one through 10. The remaining … Can you
// change about half of those and just change their pitches … be exhaustive. Go through all 10 and then reuse").
// From his numbers in bank/strike_section.json `orch`:
//   (A) A SHARE of the score's strikes (orch.share, about half) takes THE NEW VOICES: on each lane named in orch.voices the strike's
//       notes move to that voice (bass flute and bass clarinet slap tongue · viola and cello Bartók pizzicato). A key outside the
//       voice's range (orch.ranges — the measured zones — else the recipe's) is moved by OCTAVES into it. The percussion is left.
//   (B) of the strikes LEFT, a share (orch.pitchShare, about half) takes THE PITCHES OF ONE OF HIS TAKES — the Strikes drawer's takes
//       `<orch.pitchTakes>1 … N` (bank/panel_snapshots.json): each note on a lane the take gives a pitch to takes that pitch (moved by
//       octaves into its own voice's range if need be). The takes are dealt EXHAUSTIVELY — every take once before any comes again.
//       The percussion and the mallets are left as they sound; a lane the take does not name keeps its note.
// WHICH strikes: in time order, in pairs — of every two strikes one is drawn for (A); then of every two of the rest one for (B): about
// half and half of the rest, spread through the section, by --seed.
//
//   node tools/strike_orch.js --score sec05e [--seed 1] [--dry]
//   node tools/strike_orch.js --score sec05h --set flutterGettato [--n 20] [--seed 1] [--dry]    N strikes of the FIRST set's voices move to a
//                                                                             NAMED set (orch.sets), each note first back on its pitched key
//   node tools/strike_orch.js --score sec05g --more 13 [--seed 1] [--dry]     N MORE strikes into the new voices, drawn at random among
//                                                                             every strike still on another voice (his pitches kept)
//
// A strike is a group of notes (`grp-strike-…`). A strike already changed by this tool (a note tagged `properties.strikeOrch` or
// `properties.strikePitch`, which keeps what the note was) is not drawn again — a later run touches only strikes inserted since.
// Only `technique` and `sonifyNote` change: times, lengths, loudness and the strike windows are untouched. The base is the NEWER of
// the save and the page's working copy; the save is written — then File ▾ → Reload. RUN IT ONCE.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SC = require(path.join(ROOT, 'electronics', 'score', 'le_strike.js'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(1); };
const NAME = arg('score'); if (!NAME) die('--score <name>   (node tools/strike_orch.js --score sec05e [--seed 1] [--dry])');
const SEED = Math.max(1, Math.round(+arg('seed', 1)) || 1), DRY = flag('dry');
const FILE = path.join(ROOT, 'scores', NAME + '.json'), WORK = path.join(ROOT, 'scores', NAME + '-work.json');
if (!fs.existsSync(FILE)) die('no such score: scores/' + NAME + '.json');
const O = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'strike_section.json'), 'utf8')).orch;
if (!O || !O.voices) die('bank/strike_section.json has no `orch` block');
const INS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TAKES = (JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels || {}).strikes || {};
const useWork = fs.existsSync(WORK) && fs.statSync(WORK).mtimeMs > fs.statSync(FILE).mtimeMs;
const s = JSON.parse(fs.readFileSync(useWork ? WORK : FILE, 'utf8'));
const instOf = (l) => (s.tracks[l] || {}).instKey, short = (l) => (s.tracks[l] || {}).short || 'L' + l;
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], pn = (m) => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
// a voice's range: his measured zone (orch.ranges.<instrument>.<voice>), else the recipe's, else the instrument's
const rangeOf = (inst, voice) => { const z = ((O.ranges || {})[inst] || {})[voice]; if (Array.isArray(z)) return z; const I = INS[inst] || {}, t = (I.techniques || []).find((x) => x.key === voice); return [t && t.rangeLow != null ? t.rangeLow : I.rangeLow, t && t.rangeHigh != null ? t.rangeHigh : I.rangeHigh]; };
const fit = (key, [lo, hi]) => { let k = key; while (k > hi) k -= 12; while (k < lo) k += 12; return k > hi ? null : k; };   // by octaves; null = the range is narrower than an octave here
for (const [inst, voice] of Object.entries(O.voices)) if (!INS[inst] || !(INS[inst].techniques || []).some((t) => t.key === voice)) die('orch.voices: ' + inst + ' has no voice ' + voice + ' (sandbox/instruments.js)');
// the pitch takes: <prefix>1 … N in number order, each a lane → pitch
const prefix = String(O.pitchTakes || 'strikePitches');
const takes = Object.keys(TAKES).filter((n) => n.startsWith(prefix) && /^\d+$/.test(n.slice(prefix.length))).sort((a, b) => +a.slice(prefix.length) - +b.slice(prefix.length))
    .map((n) => { const by = {}; ((TAKES[n].state || {}).voices || []).forEach((v) => { if (v.lane >= 0 && !v.skip && by[v.lane] == null) by[v.lane] = Math.round(+v.pitch + 12 * (+v.fold || 0)); }); return { name: n, by }; });
// the strikes, in time order
const g = new Map();
for (const o of s.objects) { if (o.type !== 'waveCurve' || o.sonifyNote == null || !/^grp-strike-/.test(String(o.groupId || ''))) continue; if (!g.has(o.groupId)) g.set(o.groupId, []); g.get(o.groupId).push(o); }
const strikes = [...g.entries()].map(([group, notes]) => ({ group, notes: notes.sort((a, b) => a.startSeconds - b.startSeconds), f: Math.min(...notes.map((n) => n.startSeconds)) })).sort((a, b) => a.f - b.f);
strikes.forEach((x, i) => { x.n = i + 1; x.done = x.notes.some((o) => o.properties && (o.properties.strikeOrch || o.properties.strikePitch)); });
const open = strikes.filter((x) => !x.done), rnd = SC.rng(SEED * 2741 + 5);
// of every `per` strikes in a row, `take` drawn — a share spread through the section
const drawSpread = (list, share) => { const out = new Set(), per = Math.max(1, Math.round(1 / Math.max(0.01, Math.min(1, share)))); for (let i = 0; i < list.length; i += per) { const blk = list.slice(i, i + per); if (blk.length < per && rnd() >= blk.length / per) continue; out.add(blk[Math.min(blk.length - 1, Math.floor(rnd() * blk.length))]); } return out; };
// --more N (DEC-133: 'replace about 10 more of those in random. Let's do 13 with more percussive, with random distribution'): N MORE strikes
// take the new voices, drawn AT RANDOM among every strike that still has a note on another voice of those lanes — one already on his takes'
// pitches too (it keeps those pitches, moved by octaves where the new voice needs it). Nothing else is drawn in this mode.
const MORE = arg('more') == null ? null : Math.max(0, Math.round(+arg('more')) || 0);
const still = strikes.filter((x) => !x.notes.some((o) => o.properties && o.properties.strikeOrch) && x.notes.some((o) => O.voices[instOf(o.layer)] && o.technique !== O.voices[instOf(o.layer)]));
const A = MORE != null ? new Set(SC.shuffle(still.slice(), rnd).slice(0, MORE)) : drawSpread(open, +O.share || 0.5), rest = MORE != null ? [] : open.filter((x) => !A.has(x)), B = MORE == null && takes.length ? drawSpread(rest, +O.pitchShare || 0.5) : new Set();
const lines = []; let nA = 0, nB = 0, moved = 0, kept = 0, noFit = 0;
const tag = (o, key, v) => { o.properties = Object.assign({}, o.properties, { [key]: v }); };
// --set <name> [--n N] (DEC-135: 'one more orchestration set … change about 20 of the current percussive ones to that new set … find the
// original pitched version of those before they became the percussive version … and then apply those articulations'): N strikes NOW IN THE
// FIRST SET'S VOICES (orch.voices — the percussive ones), drawn at random, move to the voices of orch.sets.<name>. Each note is first put
// back on the PITCH IT HAD BEFORE it became percussive (kept on the note: properties.strikeOrch.from.key), then moved by octaves only if
// the new voice's range needs it. A strike already moved to a named set is not drawn again. Nothing else is drawn in this mode.
const SET = arg('set');
if (SET) {
    const S = (O.sets || {})[SET]; if (!S || !S.voices) die('bank/strike_section.json orch.sets has no set "' + SET + '" (' + Object.keys(O.sets || {}).join(' · ') + ')');
    for (const [inst, voice] of Object.entries(S.voices)) if (!INS[inst] || !(INS[inst].techniques || []).some((q) => q.key === voice)) die('orch.sets.' + SET + ': ' + inst + ' has no voice ' + voice + ' (sandbox/instruments.js)');
    const N = Math.max(0, Math.round(+arg('n', S.n || 0)) || 0);
    const inFirst = (o) => o.properties && o.properties.strikeOrch && !o.properties.strikeOrch.set && O.voices[instOf(o.layer)] === o.technique;
    const cand = strikes.filter((x) => x.notes.some(inFirst) && !x.notes.some((o) => o.properties && o.properties.strikeOrch && o.properties.strikeOrch.set));
    const pick = new Set(SC.shuffle(cand.slice(), rnd).slice(0, N));
    const ls = []; let back = 0, oct = 0, n = 0;
    for (const x of strikes.filter((q) => pick.has(q))) {
        const said = [];
        for (const o of x.notes) {
            const inst = instOf(o.layer), voice = S.voices[inst]; if (!voice) continue;
            const so = o.properties && o.properties.strikeOrch, orig = so && so.from && so.from.key != null ? so.from.key : o.sonifyNote;
            const key = fit(orig, rangeOf(inst, voice)); if (key == null) continue;
            if (orig !== o.sonifyNote) back++;
            if (key !== orig) oct++;
            said.push(short(o.layer) + ' ' + o.technique + ' ' + pn(o.sonifyNote) + ' → ' + voice + ' ' + pn(key) + (orig !== o.sonifyNote ? ' (back on its pitched ' + pn(orig) + (key !== orig ? ', then ' + (key > orig ? '+' : '−') + Math.abs(key - orig) / 12 + ' oct for the range' : '') + ')' : key !== orig ? ' (' + (key > orig ? '+' : '−') + Math.abs(key - orig) / 12 + ' oct for the range)' : ''));
            if (!DRY) { tag(o, 'strikeOrch', { from: so && so.from ? so.from : { technique: o.technique, key: o.sonifyNote }, set: SET, seed: SEED }); o.technique = voice; o.sonifyNote = key; }
        }
        if (said.length) { n++; ls.push(String(x.n).padStart(3) + '  ' + x.f.toFixed(2).padStart(6) + ' s  ' + said.join(' · ')); }
    }
    const outS = [NAME + (useWork ? ' (the page\'s working copy — newer than the save)' : '') + ': ' + strikes.length + ' strikes · ' + cand.length + ' in the first set\'s voices (' + Object.values(O.voices).filter((v, i, a) => a.indexOf(v) === i).join(' · ') + ') · ' + N + ' asked, drawn at random · seed ' + SEED,
        'THE SET ' + SET + ' (' + Object.entries(S.voices).map(([i, v]) => i.replace('_', ' ') + ' ' + v).join(' · ') + ') on ' + n + ' strikes: ' + back + ' notes put back on the pitch they had before they became percussive, ' + oct + ' moved by octaves for the new voice\'s range — ' + (cand.length - n) + ' strikes stay in the first set', ''].concat(ls);
    if (DRY) { outS.push('(dry — nothing written)'); console.log(outS.join('\n')); process.exit(0); }
    fs.writeFileSync(FILE, JSON.stringify(s));
    outS.push('written: scores/' + NAME + '.json — in the page: File ▾ → Reload');
    console.log(outS.join('\n')); process.exit(0);
}
// (A) the new voices
for (const x of strikes.filter((q) => A.has(q))) {
    const said = [];
    for (const o of x.notes) {
        const inst = instOf(o.layer), voice = O.voices[inst]; if (!voice) continue;
        const key = fit(o.sonifyNote, rangeOf(inst, voice));
        if (key == null) { noFit++; continue; }
        said.push(short(o.layer) + ' ' + o.technique + ' ' + pn(o.sonifyNote) + ' → ' + voice + ' ' + pn(key) + (key !== o.sonifyNote ? ' (' + (key > o.sonifyNote ? '+' : '−') + Math.abs(key - o.sonifyNote) / 12 + ' oct)' : ''));
        if (key !== o.sonifyNote) moved++; else kept++;
        if (!DRY) { tag(o, 'strikeOrch', { from: { technique: o.technique, key: o.sonifyNote }, seed: SEED }); o.technique = voice; o.sonifyNote = key; }
    }
    if (said.length) { nA++; lines.push(String(x.n).padStart(3) + '  ' + x.f.toFixed(2).padStart(6) + ' s  NEW VOICES   ' + said.join(' · ')); }
}
// (B) the pitches of his takes, dealt exhaustively: every take once, in a shuffled order, before any comes again
let deck = [];
const nextTake = () => { if (!deck.length) deck = SC.shuffle(takes.slice(), rnd); return deck.shift(); };
const used = {};
for (const x of strikes.filter((q) => B.has(q))) {
    const t = nextTake(), said = [];
    for (const o of x.notes) {
        const inst = instOf(o.layer); if (inst === 'percussion' || inst === 'bowed_vibraphone') continue;   // the percussionist's notes are left as they sound
        const p = t.by[o.layer]; if (p == null) continue;
        const key = fit(p, rangeOf(inst, o.technique)); if (key == null) { noFit++; continue; }
        said.push(short(o.layer) + ' ' + pn(o.sonifyNote) + ' → ' + pn(key) + (key !== p ? ' (the take\'s ' + pn(p) + ' by octaves)' : ''));
        if (!DRY) { tag(o, 'strikePitch', { take: t.name, from: o.sonifyNote, seed: SEED }); o.sonifyNote = key; }
    }
    if (said.length) { nB++; used[t.name] = (used[t.name] || 0) + 1; lines.push(String(x.n).padStart(3) + '  ' + x.f.toFixed(2).padStart(6) + ' s  ' + t.name.padEnd(13) + ' ' + said.join(' · ')); }
}
lines.sort();
const out = MORE != null ? [NAME + (useWork ? ' (the page\'s working copy — newer than the save)' : '') + ': ' + strikes.length + ' strikes · ' + still.length + ' still on other voices · ' + MORE + ' more asked, drawn at random · seed ' + SEED,
    'NEW VOICES on ' + nA + ' more strikes: ' + moved + ' notes moved by octaves into the voice\'s range, ' + kept + ' at their own pitch' + (noFit ? ', ' + noFit + ' left (no octave fits)' : '') + ' — ' + (still.length - nA) + ' strikes stay on the other voices', ''].concat(lines)
    : [NAME + (useWork ? ' (the page\'s working copy — newer than the save)' : '') + ': ' + strikes.length + ' strikes' + (strikes.length - open.length ? ' · ' + (strikes.length - open.length) + ' already changed by this tool, left' : '') + ' · seed ' + SEED,
    'NEW VOICES on ' + nA + ' strikes (' + Object.entries(O.voices).map(([i, v]) => i.replace('_', ' ') + ' ' + v).join(' · ') + '): ' + moved + ' notes moved by octaves into the voice\'s range, ' + kept + ' at their own pitch' + (noFit ? ', ' + noFit + ' left (no octave fits)' : ''),
    'HIS PITCHES on ' + nB + ' of the ' + rest.length + ' left (' + takes.length + ' takes ' + prefix + '1 … ' + takes.length + ': ' + takes.map((t) => t.name.slice(prefix.length) + '×' + (used[t.name] || 0)).join(' ') + ')',
    'untouched: ' + (strikes.length - nA - nB - (strikes.length - open.length)) + ' strikes', ''].concat(lines);
if (DRY) { out.push('(dry — nothing written)'); console.log(out.join('\n')); process.exit(0); }
fs.writeFileSync(FILE, JSON.stringify(s));
out.push('written: scores/' + NAME + '.json — in the page: File ▾ → Reload');
console.log(out.join('\n'));
