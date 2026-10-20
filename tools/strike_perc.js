#!/usr/bin/env node
// strike_perc.js — THE PERCUSSIONIST'S STRIKES VARIED (PLAN.md 1.9 · 17.3; DEC-124, 2026-10-10: "go through the percussion part, the
// non-pitch percussion part, and just change up some of the strikes to various instruments? And then every few, can you put in a
// mallets one, just any pitch, any of the instruments … a replacement instead of the non-pitched percussion for that note").
// The Strikes drawer writes every percussion note of a strike on the plain voice (`main`); this tool, from his numbers in
// bank/strike_section.json `perc`:
//   (1) moves a SHARE of the percussion lane's strike notes to one of the lane's struck instruments (`pool`, dealt round robin),
//       the key drawn inside the instrument's range; time, length and loudness kept;
//   (2) in one strike in `malletEvery` (rolled among the strikes that have a percussion note), moves ONE percussion note to the
//       MALLETS lane — a pitched instrument of `mallets` (dealt round robin), any pitch inside its range. The note keeps its strike
//       (its group), so the strike window still hears it — the mallets' lane is the percussionist's second lane (one microphone).
//
//   node tools/strike_perc.js --score sec05c [--seed 1] [--dry]
//
// A note is touched only if it is a strike's (`grp-strike-…`), on the percussion lane, on the plain voice, and not yet moved by this
// tool (`properties.strikePerc`) — a run after his new strikes touches only those. Nothing else in the score is read or written.
// The base is the NEWER of the save and the page's working copy; the save is written — then File ▾ → Reload.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SC = require(path.join(ROOT, 'electronics', 'score', 'le_strike.js'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(1); };
const NAME = arg('score'); if (!NAME) die('--score <name>   (node tools/strike_perc.js --score sec05c [--seed 1] [--dry])');
const SEED = Math.max(1, Math.round(+arg('seed', 1)) || 1), DRY = flag('dry');
const FILE = path.join(ROOT, 'scores', NAME + '.json'), WORK = path.join(ROOT, 'scores', NAME + '-work.json');
if (!fs.existsSync(FILE)) die('no such score: scores/' + NAME + '.json');
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'strike_section.json'), 'utf8')).perc || {};
const INS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const useWork = fs.existsSync(WORK) && fs.statSync(WORK).mtimeMs > fs.statSync(FILE).mtimeMs;
const s = JSON.parse(fs.readFileSync(useWork ? WORK : FILE, 'utf8'));
const PERC = s.tracks.findIndex((t) => t.instKey === 'percussion'), MAL = s.tracks.findIndex((t) => t.instKey === 'bowed_vibraphone');
if (PERC < 0 || MAL < 0) die('the score has no percussion or no mallets lane');
const techOf = (inst, key) => { const t = (INS[inst].techniques || []).find((x) => x.key === key); if (!t) die(inst + ': no voice ' + key + ' (bank/strike_section.json perc)'); return { key, lo: t.rangeLow != null ? t.rangeLow : INS[inst].rangeLow, hi: t.rangeHigh != null ? t.rangeHigh : INS[inst].rangeHigh, keys: t.keys ? t.keys.map((k) => k.midi) : null }; };
// A BY-KEY VOICE'S KEYS ARE SPARSE (2026-10-10, RUNNING_LOG §421 · §422): `bongos_sticks` declares 60 … 79 and has ten keys; `toms_high_rods` 53 … 81 and six.
// A key drawn inside the declared range landed on an empty key — fifteen silent strikes in take 01 of D. The draw is from the voice's own
// list (`keys`, the recipe's BY_KEY_MAPS) when it has one; the range only for a voice without a list (the pitched mallets).
const pool = (C.pool || []).map((k) => techOf('percussion', k)), mallets = (C.mallets || []).map((k) => techOf('bowed_vibraphone', k));
if (!pool.length) die('bank/strike_section.json perc.pool is empty');
const rnd = SC.rng(SEED * 3571 + 11), deck = (p) => { let d = []; return () => { if (!d.length) d = SC.shuffle(p.slice(), rnd); return d.shift(); }; };
const nextPerc = deck(pool), nextMal = deck(mallets), keyIn = (t) => t.keys && t.keys.length ? t.keys[Math.floor(rnd() * t.keys.length)] : t.lo + Math.floor(rnd() * (t.hi - t.lo + 1));
// the strikes' percussion notes, by strike in time order
const g = new Map();
for (const o of s.objects) { if (o.type !== 'waveCurve' || o.sonifyNote == null || o.layer !== PERC || !/^grp-strike-/.test(String(o.groupId || '')) || o.technique !== 'main' || (o.properties && o.properties.strikePerc)) continue; if (!g.has(o.groupId)) g.set(o.groupId, []); g.get(o.groupId).push(o); }
const strikes = [...g.entries()].map(([group, notes]) => ({ group, notes: notes.sort((a, b) => a.startSeconds - b.startSeconds), f: notes[0].startSeconds })).sort((a, b) => a.f - b.f);
const all = strikes.flatMap((x) => x.notes), lines = [];
let varied = 0, toMallets = 0;
// (2) the mallet replacements: one strike in `malletEvery`, rolled — ONE of its percussion notes, drawn
const every = Math.max(1, Math.round(+C.malletEvery || 3));
strikes.forEach((x, i) => {
    if (!mallets.length || Math.floor(rnd() * every) !== 0) return;
    const o = x.notes[Math.floor(rnd() * x.notes.length)], t = nextMal(), key = keyIn(t);
    lines.push('  ' + o.startSeconds.toFixed(2).padStart(7) + ' s  ' + x.group.replace(/^grp-strike-/, '#').replace(/-\d+$/, '').padEnd(5) + ' perc ' + String(o.sonifyNote).padStart(3) + ' → MALLETS ' + t.key + ' ' + key);
    if (!DRY) { o.properties = Object.assign({}, o.properties, { strikePerc: { from: { layer: o.layer, technique: o.technique, key: o.sonifyNote }, seed: SEED } }); o.layer = MAL; o.technique = t.key; o.sonifyNote = key; }
    x.taken = o; toMallets++;
});
// (1) the share varied among the percussion notes left on the lane
const left = all.filter((o) => !strikes.some((x) => x.taken === o)), want = Math.round(Math.max(0, Math.min(1, +C.share || 0)) * left.length);
SC.shuffle(left.slice(), rnd).slice(0, want).sort((a, b) => a.startSeconds - b.startSeconds).forEach((o) => {
    const t = nextPerc(), key = keyIn(t);
    lines.push('  ' + o.startSeconds.toFixed(2).padStart(7) + ' s  ' + String(o.groupId).replace(/^grp-strike-/, '#').replace(/-\d+$/, '').padEnd(5) + ' perc ' + String(o.sonifyNote).padStart(3) + ' → ' + t.key + ' ' + key);
    if (!DRY) { o.properties = Object.assign({}, o.properties, { strikePerc: { from: { layer: o.layer, technique: o.technique, key: o.sonifyNote }, seed: SEED } }); o.technique = t.key; o.sonifyNote = key; }
    varied++;
});
lines.sort();
const out = [NAME + (useWork ? ' (the page\'s working copy — newer than the save)' : '') + ': ' + all.length + ' percussion strike notes on the plain voice in ' + strikes.length + ' strikes · seed ' + SEED,
    varied + ' moved to another instrument (' + Math.round(100 * (+C.share || 0)) + ' %) · ' + toMallets + ' moved to the mallets (one strike in ' + every + ', rolled) · ' + (all.length - varied - toMallets) + ' left plain'].concat(lines);
if (DRY) { out.push('(dry — nothing written)'); console.log(out.join('\n')); process.exit(0); }
fs.writeFileSync(FILE, JSON.stringify(s));
out.push('written: scores/' + NAME + '.json — in the page: File ▾ → Reload');
console.log(out.join('\n'));
