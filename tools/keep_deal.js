#!/usr/bin/env node
// keep_deal.js — A DEAL ONTO THE SHELF (RUNNING_LOG §137 · §140; his "add that one to the list of candidates" after a reseed).
// A deal is a whole score's transformations at once (tools/deal_variants.js): which preset on which sample of which brick. Kept
// TWO ways, before the next reseed writes over it: (1) the score FROZEN as scores/<name>-deal-s<seed>.json — the keep whatever
// changes later (File ▾ → open it); (2) a row under `deals` in bank/candidates.json — the command, the presets it drew from, the
// frozen file, the map brick → sample → variant — rendered as the second table of docs/CANDIDATES.md (tools/candidates.js).
//   node tools/keep_deal.js --score piece-sec01-a --seed 10 [--remark "add that one to the list"] [--heard "…"] [--commit <sha>]
// The seed is checked against the score's metadata.deal — or, when the page's save has dropped that line (it keeps created ·
// modified only), against the committed save named by --commit (default HEAD): the variants must be the same, brick for brick.
// THE SORTING: this tool knows the piece (its shelf, its scores) — it is the piece's.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const NAME = arg('score', ''), SEED = +arg('seed', NaN), REMARK = arg('remark', ''), HEARD = arg('heard', ''), COMMIT = arg('commit', 'HEAD');
if (!NAME || !Number.isFinite(SEED)) { console.error('node tools/keep_deal.js --score piece-sec01-a --seed 10'); process.exit(2); }
const FILE = path.join(ROOT, 'scores', NAME + '.json'), FROZEN = path.join(ROOT, 'scores', NAME + '-deal-s' + SEED + '.json');
const SHELF = path.join(ROOT, 'bank', 'candidates.json');
if (!fs.existsSync(FILE)) { console.error('no such score: ' + path.relative(ROOT, FILE)); process.exit(2); }
if (fs.existsSync(FROZEN)) { console.error(path.relative(ROOT, FROZEN) + ' exists already — seed ' + SEED + ' is kept'); process.exit(3); }

const S = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const vmap = (s) => { const m = {}; for (const z of s.objects || []) if (z.type === 'zone' && z.midiModel === 'elecPlay' && z.elec && z.elec.variants) m[z.id] = z.elec.variants; return m; };
let deal = S.metadata && S.metadata.deal;
if (!deal || deal.seed !== SEED) {   // the page's save drops metadata.deal: read it from the committed save and check the variants agree
  let G;
  try { G = JSON.parse(cp.execSync('git -C "' + ROOT + '" show ' + COMMIT + ':scores/' + NAME + '.json', { encoding: 'utf8', maxBuffer: 64 << 20 })); } catch (e) { G = null; }
  if (!G || !G.metadata || !G.metadata.deal || G.metadata.deal.seed !== SEED) { console.error('the score\'s metadata.deal is ' + JSON.stringify(deal) + ' and ' + COMMIT + '\'s is not seed ' + SEED + ' either — name the commit of the seed-' + SEED + ' save with --commit'); process.exit(4); }
  if (JSON.stringify(vmap(S)) !== JSON.stringify(vmap(G))) { console.error('the score\'s variants differ from ' + COMMIT + '\'s seed-' + SEED + ' save — not the same deal'); process.exit(4); }
  deal = G.metadata.deal;
  console.log('(the score\'s metadata.deal was ' + JSON.stringify(S.metadata && S.metadata.deal) + ' — the page\'s save drops it; the variants match ' + COMMIT + '\'s seed-' + SEED + ' save, brick for brick)');
}

fs.copyFileSync(FILE, FROZEN);
const P = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'presets.json'), 'utf8')); } catch (e) { return {}; } })();
const T = (() => { try { return new Function('return ' + fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1])().map((t) => t.label); } catch (e) { return []; } })();
const bricks = (S.objects || []).filter((o) => o.type === 'zone' && o.midiModel === 'elecPlay' && o.elec && o.elec.variants).sort((a, b) => a.startTime - b.startTime);
const variants = {};
for (const z of bricks) variants[z.id] = { at: Math.round(z.startTime * 100) / 100, lane: T[z.layer] || ('lane ' + z.layer), behaviour: z.elec.behaviour || 'plain', variants: z.elec.variants };
const plays = bricks.reduce((n, z) => n + Object.keys(z.elec.variants).length, 0);
const C = JSON.parse(fs.readFileSync(SHELF, 'utf8'));
C.deals = Array.isArray(C.deals) ? C.deals : [];
if (C.deals.some((d) => d.score === NAME && d.seed === SEED)) { console.error('seed ' + SEED + ' of ' + NAME + ' is on the shelf already'); process.exit(3); }
const DEALT = (P.presets || []).filter((p) => p.deal !== false);   // what a deal draws from — not an audition's presets (RUNNING_LOG §151)
const tally = {}; for (const p of DEALT) tally[p.effect] = (tally[p.effect] || 0) + 1;
C.deals.push({
  n: C.deals.length + 1, kept: new Date().toISOString().slice(0, 16), score: NAME, seed: SEED, command: deal.command,
  presets: 'bank/presets.json as it was — ' + DEALT.length + ' presets: ' + Object.entries(tally).map(([e, n]) => e + ' ' + n).join(' · ') + (P.kept && P.kept.what ? ' (' + String(P.kept.what).slice(0, 200) + ')' : ''),
  frozen: path.relative(ROOT, FROZEN).replace(/\\/g, '/'), bricks: bricks.length, plays,
  heard: HEARD, remark: REMARK, note: '', variants,
});
fs.writeFileSync(SHELF, JSON.stringify(C, null, 2).replace(/\r\n/g, '\n') + '\n');
const n = require('./candidates.js').render();
console.log('deal ' + C.deals.length + ' on the shelf: ' + NAME + ' seed ' + SEED + ' · ' + bricks.length + ' bricks · ' + plays + ' plays · frozen as ' + path.relative(ROOT, FROZEN) + ' · docs/CANDIDATES.md rendered (' + n + ' rows)');
