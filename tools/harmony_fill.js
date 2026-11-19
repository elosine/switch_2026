#!/usr/bin/env node
// harmony_fill.js — FILL A STRETCH OF THE TUPLET WORKSHOP WITH HARMONY BRICKS (SW-54, 2026-11-19). His rule, as dictated: a baseline tempo
// (68); each brick's length a COIN FLIP between two buckets of beats — the short one (1 beat) and the long one (1.5 · 2 · 2.5 · 3 · 3.5,
// one drawn) — "so on the average it'll alternate between one beat and something greater than one beat, but there might be several one
// beats in a row"; each brick a take drawn at random from a set, EXCLUSIVE: no take again until all are used (the deck is kept in the
// file, so a later fill goes on where this one stopped).
//
//   node tools/harmony_fill.js --from 291.8 --to 301.66 [--bpm 68] [--short 1] [--long 1.5,2,2.5,3,3.5] [--takes "^MTchord\d+st$"] [--seed 1] [--keep-deck]
//
// Writes bank/tuplet_chunks.json: the harmony bricks already inside from … to are replaced, the others kept; the workshop page takes the
// file within two seconds. Without --keep-deck a new seed deals a fresh deck (every take available again).
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const FROM = +arg('from'), TO = +arg('to'), BPM = +arg('bpm', 68), SEED = +arg('seed', 1);
if (!(TO > FROM)) { console.error('--from and --to'); process.exit(2); }
const SHORT = String(arg('short', '1')).split(',').map(Number), LONG = String(arg('long', '1.5,2,2.5,3,3.5')).split(',').map(Number);
const RE = new RegExp(arg('takes', '^MTchord\\d+st$'));
const FILE = path.join(ROOT, 'bank', 'tuplet_chunks.json'), db = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const snaps = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels.strikes || {};
const all = Object.keys(snaps).filter((n) => RE.test(n)).sort((a, b) => (+a.replace(/\D/g, '')) - (+b.replace(/\D/g, '')));
if (!all.length) { console.error('no take matches ' + RE); process.exit(1); }
function rng(seed) { let a = (seed >>> 0) || 1; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(SEED * 2654435761 + 9), beat = 60 / BPM, r2 = (x) => Math.round(x * 100) / 100;
// the deck: the takes not yet used (kept in the file); when it runs out, every take is available again
let deck = process.argv.includes('--keep-deck') && db.takeDeck && db.takeDeck.pattern === RE.source ? db.takeDeck.left.filter((n) => all.indexOf(n) >= 0) : all.slice();
const draw = () => { if (!deck.length) deck = all.slice(); return deck.splice(Math.floor(R() * deck.length), 1)[0]; };
db.harmonies = (db.harmonies || []).filter((h) => h.end <= FROM || h.start >= TO);
let id = 1 + db.harmonies.reduce((m, h) => Math.max(m, +String(h.id).replace(/\D/g, '') || 0), 0), t = FROM; const made = [];
while (t < TO - 0.05) {
  const bucket = R() < 0.5 ? SHORT : LONG, beats = bucket[Math.floor(R() * bucket.length)], end = Math.min(TO, t + beats * beat);
  const h = { id: 'h' + (id++), start: r2(t), end: r2(end), take: draw(), beats }; db.harmonies.push(h); made.push(h); t = end;
}
db.harmonies.sort((a, b) => a.start - b.start);
db.takeDeck = { pattern: RE.source, left: deck, of: all.length };
fs.writeFileSync(FILE, JSON.stringify(db, null, 1) + '\n');
console.log(made.length + ' harmony bricks ' + FROM + ' → ' + TO + ' · ' + BPM + ' bpm (a beat ' + beat.toFixed(3) + ' s) · seed ' + SEED + ' · ' + all.length + ' takes in the set, ' + deck.length + ' not yet used');
for (const h of made) console.log('  ' + String(h.start).padEnd(7) + '→ ' + String(h.end).padEnd(7) + String(h.beats).padEnd(4) + (h.beats === 1 ? 'beat  ' : 'beats ') + h.take + '  · ' + String(snaps[h.take].comment || '').replace(/ · auto.*$/, ''));
