#!/usr/bin/env node
// 4.5 THE SI2 RECIPES — the three placeholder sections of sandbox/instruments.js (flute · clarinet · alto_sax) replaced by technique
// tables: the FLUTE's is piece 4's (septet_2026/sandbox/instruments.js l. 19 … 102 — the presets its two cloned instances hold), its
// ports this piece's; the CLARINET's and the ALTO SAX's are written from the presets he loaded (RUNNING_LOG §17) and the SI2 manual's
// "Layers & Keyswitches" pages (piece 3's extracted copy, l. 580 … 760): a technique KEY per preset, the keyswitch NOTE per KS preset
// (C1 = MIDI 36, the flute's zone — VERIFY on the red keys at the first sound), the ranges the manual's sounding compass. Every row
// PROVISIONAL until heard. The PARTS (port · channel) are then DERIVED by tools/apply_uvi_parts.js from the running rack — never typed.
//   node tools/port/recipes44.js [--dry]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), DRY = process.argv.includes('--dry');
const RP = path.join(ROOT, 'sandbox', 'instruments.js');
const L = fs.readFileSync(RP, 'utf8').split('\n');
const at = (pred, what) => { const h = []; L.forEach((s, i) => { if (pred(s)) h.push(i); }); if (h.length !== 1) throw new Error(what + ': found ' + h.length); return h[0]; };
const iFl = at(s => s.startsWith('  // ---- FLUTE — IRCAM Solo Instruments 2 (UVI), PLACEHOLDER'), 'FLUTE placeholder');
const iPerc = at(s => s.startsWith('  // ---- PERCUSSION'), 'PERCUSSION');
if (!(iFl < iPerc)) throw new Error('order');

// ---- the flute: piece 4's rows, re-ported
const P4 = fs.readFileSync(path.join(ROOT, '..', 'septet_2026', 'sandbox', 'instruments.js'), 'utf8').split('\n').slice(18, 102);
const rows = P4.filter(l => /^\s*\{ key: "/.test(l) || /^\s*\/\/ (A\d+|---- second instance)/.test(l))
  .map(l => l.replace(' lane: "Flute strikes",', '').replace(/port: "Fluteb"/g, 'port: "SWFluteb"'));
if (rows.filter(l => /key: "/.test(l)).length !== 30) throw new Error('piece 4 flute rows: ' + rows.filter(l => /key: "/.test(l)).length);
const FLUTE = [
'  // ---- FLUTE — IRCAM Solo Instruments 2 "Flute in C" (UVI), two instances CLONED from piece 4 (container 4, 2026-10-20; RUNNING_LOG §18) ----',
'  // The rows are piece 4\'s (septet_2026/sandbox/instruments.js, re-rostered there 2026-09-03 from his UVI browser: 19 presets — 16 on the',
'  // first instance, 3 on the `b`, three Ordinario curve copies on the `b`\'s parts 4 · 5 · 6). The keyswitch notes and ranges are its',
'  // (its screenshots); the parts (port · channel) are DERIVED by tools/apply_uvi_parts.js from the running rack. Piece 4\'s "Flute strikes"',
'  // lane is not carried. Range sounding C4–C7 (+B3). Loudness: NOT measured absolutely (piece 4 was relative) — container 5.',
'  flute: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2.0,   /* piece 4 MEASURED 2.0 st on this instance (its MEASURED_BEND) */',
'    label: "Flute", port: "SWFlute", rangeLow: 59, rangeHigh: 96, channels: { main: 1, curve: [2, 3, 4] },',
'    techniques: [',
].concat(rows.map(l => l.replace(/^\s*/, '      ')), ['    ],', '  },', '']);

// ---- the clarinet: his thirteen (RUNNING_LOG §17), the manual's switches
const T = (key, label, preset, ch, extra) => `      { key: "${key}", label: "${label}", preset: "${preset}", channel: ${ch}, kind: "pitched", loud: "vel"${extra || ''} },`;
const K = (key, label, preset, ch) => `      { key: "${key}", label: "${label}", preset: "${preset}", channel: ${ch}, kind: "key", keys: "pending", loud: "vel" },`;
const CLAR = [
'  // ---- CLARINET in B♭ — IRCAM Solo Instruments 2 (UVI), ONE instance, his thirteen loads of 2026-10-20 (RUNNING_LOG §17) ----',
'  // The order is his browser\'s (A1 … A13); the three Ordinario curve copies on parts 14 · 15 · 16 as text (§18). Keyswitch notes from the',
'  // manual\'s "Layers & Keyswitches — Clarinet" (C1 = 36, the flute\'s zone) — VERIFY on the red keys at the first sound. Range sounding',
'  // D3–F6 = 50–89 (the manual), NOT measured; the by-key voices\' keys `pending` until read from his rack.',
'  clarinet: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2, label: "Clarinet", port: "SWClar", rangeLow: 50, rangeHigh: 89, channels: { main: 1, curve: [14, 15, 16] },',
'    techniques: [',
T('ord', 'Ordinario', 'Clarinet Ordinario', 1),
T('aeolian_and_ord', 'Aeolian & Ordinario', 'Clarinet Aeolian & Ordinario', 2),
T('cresc', 'Crescendo', 'Clarinet Cresc & Decrescendo KS', 3, ', ks: 36'),
T('cresc_decresc', 'Crescendo to Decrescendo', 'Clarinet Cresc & Decrescendo KS', 3, ', ks: 37'),
T('decresc', 'Decrescendo', 'Clarinet Cresc & Decrescendo KS', 3, ', ks: 38'),
T('dur_0_5s', 'Duration 0.5 s', 'Clarinet Durations KS', 4, ', ks: 36'),
T('dur_1s', 'Duration 1 s', 'Clarinet Durations KS', 4, ', ks: 37'),
T('flz', 'Flatterzunge', 'Clarinet Flatterzunge', 5),
T('fortepiano', 'Fortepiano', 'Clarinet Fortepiano', 6),
K('glissando_menu', 'Glissando Menu (one glissando per key)', 'Clarinet Glissando Menu', 7),
K('key_click', 'Key Click', 'Clarinet Key Click', 8),
K('multiphonics', 'Multiphonics Menu (one multiphonic per key)', 'Clarinet Multiphonics Menu', 9),
T('ord_1q', 'Ordinario quarter-tone', 'Clarinet Quartertones Ordinario', 10),
T('sforzando', 'Sforzando', 'Clarinet Sforzando', 11),
T('staccato', 'Staccato', 'Clarinet Staccato', 12),
T('trill_m2', 'Trill minor 2nd', 'Clarinet Trills KS', 13, ', ks: 36'),
T('trill_M2', 'Trill major 2nd', 'Clarinet Trills KS', 13, ', ks: 37'),
'    ],', '  },', ''];

// ---- the alto sax: his sixteen + six (RUNNING_LOG §17), two instances; the copies on the `b`'s parts 14 · 15 · 16
const B = ', port: "SWSaxb"';
const SAX = [
'  // ---- ALTO SAXOPHONE in E♭ — IRCAM Solo Instruments 2 (UVI), TWO instances, his twenty-two loads of 2026-10-20 (RUNNING_LOG §17) ----',
'  // A1 … A16 on the first instance (SWSax), B1 … B6 on the second (SWSaxb), the three Ordinario curve copies on the second\'s parts',
'  // 14 · 15 · 16 as text (§18 — the first cross-instance clone, proven by its 141 sample players). Keyswitch notes from the manual\'s',
'  // "Layers & Keyswitches — Saxophone Alto" (C1 = 36) — VERIFY at the first sound; "FX KS" is one preset of many switches (pending).',
'  // Range sounding D♭3–A5 = 49–81 (the manual), NOT measured.',
'  alto_sax: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2, label: "Alto Sax", port: "SWSax", rangeLow: 49, rangeHigh: 81, channels: { main: 1, curve: [{ port: "SWSaxb", ch: 14 }, { port: "SWSaxb", ch: 15 }, { port: "SWSaxb", ch: 16 }] },',
'    techniques: [',
T('ord', 'Ordinario', 'Saxophone Alto Ordinario', 1),
T('aeolian', 'Aeolian', 'Saxophone Alto Aeolian', 2),
T('backwards', 'Backwards', 'Saxophone Alto Backwards', 3),
T('bisbigliando', 'Bisbigliando', 'Saxophone Alto Bisbigliando', 4),
K('blow_without_reed', 'Blow Without Reed', 'Saxophone Alto Blow Without Reed', 5),
T('chrom_scale', 'Chromatic Scale', 'Saxophone Alto Chromatic Scale', 6),
T('cresc', 'Crescendo', 'Saxophone Alto Cresc & Decrescendo KS', 7, ', ks: 36'),
T('cresc_decresc', 'Crescendo to Decrescendo', 'Saxophone Alto Cresc & Decrescendo KS', 7, ', ks: 37'),
T('decresc', 'Decrescendo', 'Saxophone Alto Cresc & Decrescendo KS', 7, ', ks: 38'),
T('double_tonguing', 'Double Tonguing', 'Saxophone Alto Double Tonguing', 8),
K('fx_ks', 'FX KS (the extended switches — which key is which: pending)', 'Saxophone Alto FX KS', 9),
T('discolored_fing', 'Discolored Fingering', 'Saxophone Alto Finger Modes KS', 10, ', ks: 36'),
T('harmonic_fing', 'Harmonic Fingering', 'Saxophone Alto Finger Modes KS', 10, ', ks: 37'),
T('flz', 'Flatterzunge', 'Saxophone Alto Flatterzunge', 11),
T('fortepiano', 'Fortepiano', 'Saxophone Alto Fortepiano', 12),
K('glissando_menu', 'Glissando Menu KS (one glissando per key)', 'Saxophone Alto Glissando Menu KS', 13),
K('key_click', 'Key Click', 'Saxophone Alto Key Click', 14),
T('bell_down_up', 'Moving Bell, down to up', 'Saxophone Alto Moving Bell', 15, ', ks: 36'),
T('bell_left_right', 'Moving Bell, left to right', 'Saxophone Alto Moving Bell', 15, ', ks: 37'),
K('multiphonics', 'Multiphonics Menu (one multiphonic per key)', 'Saxophone Alto Multiphonics Menu', 16),
'      // ---- second instance "SWSaxb" (B1 … B6) ----',
T('ord_to_flz', 'Ordinario to Flatterzunge', 'Saxophone Alto Ord & Flatterzunge KS', 1, B + ', ks: 37'),
T('flz_to_ord', 'Flatterzunge to Ordinario', 'Saxophone Alto Ord & Flatterzunge KS', 1, B + ', ks: 38'),
T('play_sing_m2', 'Play and Sing, major 2nd up', 'Saxophone Alto Play & Sing', 2, B + ', ks: 36'),
T('play_sing_gliss', 'Play and Sing, glissando', 'Saxophone Alto Play & Sing', 2, B + ', ks: 37'),
T('play_sing_unison', 'Play and Sing, unison', 'Saxophone Alto Play & Sing', 2, B + ', ks: 38'),
T('ord_1q', 'Ordinario quarter-tone', 'Saxophone Alto Quartertones Ordinario', 3, B),
T('slap_pitched', 'Slap, pitched', 'Saxophone Alto Slap Modes KS', 4, B + ', ks: 36'),
T('slap_unpitched', 'Slap, unpitched', 'Saxophone Alto Slap Modes KS', 4, B + ', ks: 37'),
T('slap_exploding', 'Exploding slap, pitched', 'Saxophone Alto Slap Modes KS', 4, B + ', ks: 38'),
T('staccato', 'Staccato', 'Saxophone Alto Staccato', 5, B),
T('trill_m2', 'Trill minor 2nd', 'Saxophone Alto Trills KS', 6, B + ', ks: 36'),
T('trill_M2', 'Trill major 2nd', 'Saxophone Alto Trills KS', 6, B + ', ks: 37'),
'    ],', '  },', ''];

const out = L.slice(0, iFl).concat(FLUTE, CLAR, SAX, L.slice(iPerc));
const text = out.join('\n');
const I = vm.runInNewContext(text + '\n;INSTRUMENTS;', {});
const WANT = ['flute', 'clarinet', 'alto_sax', 'percussion', 'bowed_vibraphone', 'piano', 'violin', 'cello'];
if (Object.keys(I).join() !== WANT.join()) throw new Error('evaluates to [' + Object.keys(I) + ']');
for (const k of ['flute', 'clarinet', 'alto_sax']) { const keys = I[k].techniques.map(t => t.key); if (new Set(keys).size !== keys.length) throw new Error(k + ': a key twice'); for (const t of I[k].techniques) if (!t.preset) throw new Error(k + '/' + t.key + ': no preset'); }
console.log('flute ' + I.flute.techniques.length + ' · clarinet ' + I.clarinet.techniques.length + ' · alto_sax ' + I.alto_sax.techniques.length + ' techniques; ' + L.length + ' → ' + out.length + ' lines');
if (!DRY) fs.writeFileSync(RP, text);
console.log(DRY ? 'DRY — nothing written' : 'WRITTEN sandbox/instruments.js');
