#!/usr/bin/env node
// build_petals_roll.js — THE PETALS ROLL (his word 2026-10-07, DEC-42 · RUNNING_LOG §208): his kept filter-bank settings
// (bank/petals_bank.json — the 26 of audition-petals-spectrum) dealt at random, and the grit after each rolled in HIS PROPORTIONS
// (the bank's `effects`: mostly clean; when not, the overdrive hard first, the mild as a subset of it, the one loop rarer, the fuzz
// once in a while). THE ALGORITHM is `roll` below (exported — the composing tools take it): a seeded shuffle of the settings, none
// twice until all are used; a coin for clean (cleanShare); else a weighted draw among the grits; a brick every GAP s, each on another
// captured impulse. "Preferences … to dial in the precise ratios when we actually make the work": the numbers are the bank's.
// It writes — N presets into bank/presets.json (pr01 … ; `deal: false`, `audition: petals-roll`; a second run replaces only its own)
// · the score scores/<name>.json, a NEW file · the sheet docs/auditions/<name>.md.
//   node tools/build_petals_roll.js [--name audition-petals-roll] [--n 40] [--gap 6] [--seed 1] [--impulse <name>] [--replace] [--render] [--port 5500]
// --render   sends the plan to the engine with render 1.   --replace  rewrites a score THIS tool made; never another.
// THE SORTING: the bank, the roll and the score are the piece's; the stages are the engine's.
'use strict';
const path = require('path');
const K = require('./audition_kit.js');

// ---- THE ROLL (pure) --------------------------------------------------------------------------------------------------------
// roll(bank, n, seed) → [{ setting, effect: 'clean' | '<grit key>' }, …] — the settings shuffled (none twice until all are used),
// the grit by his proportions.
function roll(bank, n, seed) {
  const rnd = K.mulberry32(seed * 2654435761 + 7919);
  const S = bank.settings.slice(), out = [];
  let deck = [];
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const W = bank.effects.weights, keys = Object.keys(W), total = keys.reduce((s, k) => s + W[k], 0);
  for (let i = 0; i < n; i++) {
    if (!deck.length) deck = shuffle(S);
    const setting = deck.shift();
    let effect = 'clean';
    if (rnd() >= bank.effects.cleanShare) {
      let r = rnd() * total;
      for (const k of keys) { r -= W[k]; if (r <= 0) { effect = k; break; } }
      if (effect === 'clean') effect = keys[keys.length - 1];
    }
    out.push({ setting, effect });
  }
  return out;
}
module.exports = { roll };
if (require.main !== module) return;

// ---- THE SCORE ----------------------------------------------------------------------------------------------------------------
const NAME = K.arg('name', 'audition-petals-roll'), N = Math.max(1, +K.arg('n', 40)), GAP = +K.arg('gap', 6), SEED = +K.arg('seed', 1), IMP = K.arg('impulse', ''), PORT = +K.arg('port', 5500);
const TAG = 'petals-roll', CAP_MS = 16000;
const COMMAND = 'node tools/build_petals_roll.js --name ' + NAME + ' --n ' + N + ' --gap ' + GAP + ' --seed ' + SEED + (IMP ? ' --impulse ' + IMP : '');
const bank = K.readJson(path.join(K.ROOT, 'bank', 'petals_bank.json'));
if (!bank.settings || !bank.settings.length) { console.error('bank/petals_bank.json has no settings'); process.exit(4); }
const NAMES = { 'od-hard': 'overdrive hard', 'od-mild': 'overdrive mild', 'fuzz': 'fuzz', 'loop': '→ one loop', clean: 'clean' };
const dealt = roll(bank, N, SEED);
const nn = (i) => String(i + 1).padStart(2, '0');
const dials = (s) => 'fund ' + s.fund + ' Hz · first partial ' + s.first + ' · spread ' + s.spread + ' · bank B +' + s.offset + ' st · ring ' + s.ringLo + ' … ' + s.ringHi + ' s';
const args = (d) => Object.assign({ poMix: 1, poFund: d.setting.fund, poFirst: d.setting.first, poSpread: d.setting.spread, poOffset: d.setting.offset, poRingLo: d.setting.ringLo, poRingHi: d.setting.ringHi, poInLen: 1 }, d.effect === 'clean' ? {} : bank.effects.dials[d.effect]);

const presets = dealt.map((d, i) => ({ key: 'pr' + nn(i), name: (i + 1) + ' · ' + NAMES[d.effect].toUpperCase() + ' — petals #' + d.setting.n + ' · ' + dials(d.setting), effect: 'petalsOrig', class: 'time', capMs: CAP_MS, args: args(d) }));
const all = K.impulses(), pinned = IMP ? all.find((r) => r.name === IMP) : null;
if (IMP && !pinned) { console.error('no captured impulse named ' + IMP + ' in the bank'); process.exit(1); }
const pick = K.spread(all), Z = K.zoneMaker(), objects = [], rows = [];
dealt.forEach((d, i) => {
  const smp = pinned || pick(i), t = 1 + i * GAP;
  objects.push(Z.zone(smp.lane >= 0 ? smp.lane : 0, t, { name: smp.name, label: (i + 1) + ' · #' + d.setting.n + ' ' + Math.round(d.setting.fund) + ' Hz' + (d.effect === 'clean' ? '' : ' · ' + NAMES[d.effect]), variants: { [smp.name]: 'pr' + nn(i) + '-tail' } }));
  rows.push({ i, d, smp, t });
});
const END = 1 + (N - 1) * GAP + CAP_MS / 1000 + 1;
const count = (k) => dealt.filter((d) => d.effect === k).length;

const NOTE = 'THE PETALS ROLL (DEC-42 · RUNNING_LOG §208): his ' + bank.settings.length + ' kept filter-bank settings (bank/petals_bank.json) dealt at random (seed ' + SEED + '; none twice until all are used), the grit after each rolled in his proportions (' + Math.round(bank.effects.cleanShare * 100) + ' % clean; else overdrive hard · mild · the one loop · fuzz by the bank\'s weights); ' + N + ' bricks every ' + GAP + ' s, each on another captured impulse. The algorithm is roll() in tools/build_petals_roll.js — the composing tools take it. The sheet: docs/auditions/' + NAME + '.md. Written by tools/build_petals_roll.js; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, 'tools/build_petals_roll.js', K.flag('replace'));
const P = K.writePresets(TAG, presets, 'the petals roll — his ' + bank.settings.length + ' kept settings dealt at random, the grit in his proportions (seed ' + SEED + ', ' + N + ' bricks)', COMMAND);

const sheet = [
  '# ' + NAME + ' — the petals roll: your kept settings at random, the grit in your proportions',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §208; DEC-42).*',
  '',
  '**What it is:** your ' + bank.settings.length + ' kept filter-bank settings (`bank/petals_bank.json` — the numbers you named from `audition-petals-spectrum`) dealt at random, none twice until all have been used, with the grit after each rolled in your proportions: ' + Math.round(bank.effects.cleanShare * 100) + ' % clean; when not, overdrive hard ' + bank.effects.weights['od-hard'] + ' · overdrive mild ' + bank.effects.weights['od-mild'] + ' · the one loop ' + bank.effects.weights['loop'] + ' · fuzz ' + bank.effects.weights['fuzz'] + ' (the bank\'s `effects` — yours to move). This deal: ' + count('clean') + ' clean · ' + count('od-hard') + ' overdrive hard · ' + count('od-mild') + ' mild · ' + count('loop') + ' one loop · ' + count('fuzz') + ' fuzz. A brick every ' + GAP + ' s, each on another captured impulse; ' + K.clock(END) + ' long. The algorithm is `roll()` in `tools/build_petals_roll.js`; another seed is another deal.',
  '',
  '**To hear it:** F5 · File ▾ → Experiments → `' + NAME + '` · play from 0. The brick\'s label: `<number> · #<setting> <fund> Hz · <grit>`.',
  '',
  '| brick | at | setting # | fund Hz | after the petals | impulse | preset |',
  '|---|---|---|---|---|---|---|',
].concat(rows.map((r) => '| **' + (r.i + 1) + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | #' + r.d.setting.n + ' | ' + r.d.setting.fund + ' | ' + NAMES[r.d.effect] + ' | `' + r.smp.name + '` — ' + (K.PLAYERS[r.smp.player] || r.smp.player) + ' | `pr' + nn(r.i) + '` |'))
  .concat(['', '**To keep one:** its row in `bank/presets.json` (`pr<NN>`) onto the shelf at your word, or a return brick anywhere → Processed as → `<number> · …`, envelope `tail`.', '']).join('\n');
const sheetFile = K.writeSheet(NAME, sheet);

rows.forEach((r) => console.log(String(r.i + 1).padStart(2) + '  ' + String(r.t).padStart(4) + ' s  #' + String(r.d.setting.n).padEnd(3) + String(r.d.setting.fund).padStart(6) + ' Hz  ' + NAMES[r.d.effect].padEnd(15) + r.smp.name));
console.log(K.rel(file) + ' written — ' + N + ' bricks: ' + count('clean') + ' clean · ' + count('od-hard') + ' overdrive hard · ' + count('od-mild') + ' mild · ' + count('loop') + ' one loop · ' + count('fuzz') + ' fuzz, ' + K.clock(END) + ' long · ' + K.rel(sheetFile) + ' · File ▾ → Experiments → ' + NAME);
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): in the page, a purple brick → "render all planned".');
