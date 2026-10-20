#!/usr/bin/env node
// gen_presets.js — A GENERATION OF PRESETS (his word 2026-10-05, RUNNING_LOG §127): N presets drawn at random, SEEDED, from the effects he
// named, each dial within its usual range (the hover hints' ranges, electronics/score/le_process.js HINTS, written here as the draw's
// bounds), dealt round robin through the effects so neighbours differ. The PITCHED dials stay RANGES in the preset (DEC-23): the engine
// draws a fresh pitch per variant at each plan send — the generation fixes the character, not the note. No stretch shifts pitch (his word).
// Writes bank/presets.json (its `presets`; `_about` · classes · envelopes · mix kept) and records the generation in `generated`.
//   node tools/gen_presets.js [--seed 1] [--n 100] [--effects override,fuzz,octave,feedback,crush,diode,squiz,comb,icy,greyhole,jpverb,cres,string] [--dry]
// Another seed = another generation; the audition score is rebuilt after (tools/build_audition.js). THE SORTING: the piece's.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const SEED = +arg('seed', 1), N = +arg('n', 100), DRY = process.argv.includes('--dry');
const EFFECTS = String(arg('effects', 'override,fuzz,octave,feedback,crush,diode,squiz,comb,icy,greyhole,jpverb,cres,string')).split(',').map((s) => s.trim()).filter(Boolean);
const FILE = path.join(ROOT, 'bank', 'presets.json');
const P = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// a seeded random (mulberry32 — the same as the page's)
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rnd = mulberry32(SEED * 2654435761 + 97);
const r = (x, step) => { const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9)); return +(Math.round(x / step) * step).toFixed(d); };
const uni = (lo, hi, step = 0.01) => r(lo + rnd() * (hi - lo), step);
const logu = (lo, hi, step = 0.01) => r(lo * Math.pow(hi / lo, rnd()), step);
const int = (lo, hi) => Math.floor(lo + rnd() * (hi - lo + 1));
const pick = (a) => a[Math.floor(rnd() * a.length)];
const STRINGS = { fbS1: [60, 110], fbS2: [82, 150], fbS3: [110, 200], fbS4: [147, 262], fbS5: [185, 330], fbS6: [247, 440] };   // about a fifth around E A D G B E
const ENVS = ['Hann', '3-stage', 'blackman', 'blackman-harris', 'expodec', 'gauss', 'hamming', 'hanning', 'quasi-gauss', 'rexpodec', 'tri'];

// each effect: its class, and a draw of its dials (the pitched ones as ranges)
const DRAW = {
  override: { class: 'colour', draw: () => { const buf = int(50, 500); return { args: { ovrMix: 1, ovrBuf: buf, ovrDiv: [12, 48], ovrSmooth: uni(0.05, 0.25) }, name: 'buffer override — buffer ' + buf + ' ms, the pitch drawn' }; } },
  fuzz: { class: 'colour', draw: () => { const g = int(20, 100), b = uni(0.1, 0.5, 0.05), t = int(2000, 6000); return { args: { fzMix: 1, fzGain: g, fzBias: b, fzTone: t, cabMix: 1, cabLow: 100, cabHigh: int(3000, 6000), cabPres: uni(0, 6, 0.5) }, name: 'fuzz ' + g + ' · bias ' + b + ' · tone ' + t + ' into a cabinet' }; } },
  octave: { class: 'colour', draw: () => { const o = uni(0.5, 1, 0.05), g = int(10, 60), t = int(2000, 6000); return { args: { ocMix: 1, ocOctave: o, ocGain: g, ocTone: t, cabMix: 1, cabLow: 100, cabHigh: int(3000, 6000), cabPres: uni(0, 6, 0.5) }, name: 'octave fuzz — octave ' + o + ' · fuzz ' + g + ' · tone ' + t }; } },
  feedback: { class: 'time', draw: () => { const bl = uni(0.1, 0.3), h = uni(2, 6, 0.5), d = uni(3, 15, 0.5), t = int(1500, 5000), p = uni(3, 20, 0.5), c = uni(0, 0.7, 0.05), w = uni(0, 0.5, 0.05); return { args: Object.assign({ fbMix: 1, fbBloom: bl, fbHold: h, fbDrive: d, fbTone: t, fbPath: p, fbClimb: c, fbWobble: w }, STRINGS), name: 'feedback — bloom ' + bl + ' s · hold ' + h + ' · drive ' + d + ' · tone ' + t + ' · climb ' + c + ', the strings drawn' }; } },
  crush: { class: 'colour', draw: () => { const b = int(3, 10), rt = int(2000, 16000), m = uni(0.5, 1, 0.05); return { args: { crMix: m, crBits: b, crRate: rt }, name: 'crush — ' + b + ' bits at ' + rt + ' Hz · mix ' + m }; } },
  diode: { class: 'colour', draw: () => { const m = uni(0.5, 1, 0.05); return { args: { drmMix: m, drmFreq: [70, 500] }, name: 'diode ring — a carrier drawn 70 … 500 Hz · mix ' + m }; } },
  squiz: { class: 'colour', draw: () => { const ra = uni(1.5, 4, 0.1), ch = int(1, 8); return { args: { sqMix: 1, sqRatio: ra, sqChunks: ch }, name: 'squiz — ratio ' + ra + ' · ' + ch + ' chunks' }; } },
  comb: { class: 'colour', draw: () => { const fb = uni(0.3, 2, 0.05); return { args: { combMix: 1, combTime: [0.003, 0.012], combFb: fb }, name: 'comb — a pitch drawn 83 … 333 Hz · rings ' + fb + ' s' }; } },
  icy: { class: 'time', draw: () => { const sp = logu(0.01, 0.08, 0.005), w = logu(0.1, 1.2, 0.01), ov = int(4, 48), rd = uni(0.1, 0.4, 0.05), e = int(0, 10); return { args: { icMix: 1, icSpeed: sp, icFromMs: 0, icLoop: 1, icWin: w, icOverlaps: ov, icRand: rd, icPitch: 0, icEnv: e },   // DEC-34b (§171): the source read in order from 0, looping — his rule for this piece (it was from 40 … 150 ms, holding at the end) name: 'icy — ' + Math.round(1 / sp) + '× slower · window ' + w + ' s · ' + ov + ' grains · rand ' + rd + ' · ' + ENVS[e] }; } },
  greyhole: { class: 'time', draw: () => { const t = logu(0.05, 1, 0.01), s = uni(0.5, 3, 0.1), f = uni(0.5, 0.9, 0.05), d = uni(0.5, 0.9, 0.05), dm = uni(0.1, 0.5, 0.05), m = uni(0.6, 0.9, 0.05); return { args: { ghMix: m, ghTime: t, ghSize: s, ghFb: f, ghDiff: d, ghDamp: dm }, name: 'Greyhole — delay ' + t + ' s · size ' + s + ' · feedback ' + f + ' · mix ' + m }; } },
  jpverb: { class: 'time', draw: () => { const t = uni(1, 6, 0.1), s = uni(0.8, 3, 0.1), d = uni(0.2, 0.6, 0.05), m = uni(0.6, 0.9, 0.05); return { args: { jpMix: m, jpT60: t, jpSize: s, jpDamp: d, jpLow: uni(0.5, 1.5, 0.05), jpMid: uni(0.5, 1.5, 0.05), jpHigh: uni(0.5, 1.5, 0.05) }, name: 'JPverb — ' + t + ' s · size ' + s + ' · damping ' + d + ' · mix ' + m }; } },
  cres: { class: 'time', draw: () => { const dc = uni(0.5, 0.95, 0.01); return { args: { cresMix: 1, cresFreq: [100, 2000], cresDcy: dc }, name: 'complex resonator — a partial drawn 100 … 2000 Hz · decay ' + dc }; } },
  string: { class: 'colour', draw: () => { const rs = uni(0.8, 0.98, 0.01); return { args: { stresMix: 1, stresTime: [0.002, 0.008], stresRes: rs }, name: 'string resonator — a pitch drawn 125 … 500 Hz · resonance ' + rs }; } },
};
const unknown = EFFECTS.filter((e) => !DRAW[e]);
if (unknown.length) { console.error('no draw for: ' + unknown.join(', ') + ' — the generator knows ' + Object.keys(DRAW).join(' · ')); process.exit(2); }

// round robin through the effects, in the order he named them: neighbours differ
const count = {}, presets = [];
for (let i = 0; i < N; i++) {
  const e = EFFECTS[i % EFFECTS.length], n = (count[e] = (count[e] || 0) + 1), d = DRAW[e].draw();
  presets.push({ key: e + n, name: d.name, effect: e, class: DRAW[e].class, args: d.args });
}
const by = {}; presets.forEach((p) => { by[p.effect] = (by[p.effect] || 0) + 1; });
console.log('GENERATION seed ' + SEED + ' · ' + N + ' presets · ' + presets.filter((p) => p.class === 'time').length + ' time · ' + presets.filter((p) => p.class === 'colour').length + ' colour');
console.log(Object.entries(by).map(([e, n]) => e + ' ' + n).join(' · '));
presets.slice(0, 13).forEach((p) => console.log('  ' + p.key.padEnd(12) + p.name));
if (N > 13) console.log('  …');
if (DRY) { console.log('(dry — nothing written)'); process.exit(0); }
P.generated = { seed: SEED, n: N, effects: EFFECTS, when: new Date().toISOString().slice(0, 16), command: 'node tools/gen_presets.js --seed ' + SEED + ' --n ' + N + ' --effects ' + EFFECTS.join(',') };
P.presets = presets.concat((P.presets || []).filter((p) => p.deal === false));   // an audition's presets (`deal: false`, RUNNING_LOG §151) are not a generation's: they stay
delete P.kept;   // a new generation is no one's keepers (RUNNING_LOG §130)
fs.writeFileSync(FILE, JSON.stringify(P, null, 1) + '\n');
console.log(path.relative(ROOT, FILE) + ' written — ' + N + ' presets, seed ' + SEED + '. Rebuild the audition: node tools/build_audition.js --name audition-' + N + '-s' + SEED);
