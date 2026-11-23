#!/usr/bin/env node
// collide_list.js — WHERE THE INK OF ONE PART MEETS THE INK OF ANOTHER (the Switch~ piece RUNNING_LOG §447).
//   node tools/collide_list.js <page id> [--min 0.15] [--list 40]
// His ask (2026-11-22): 'It's not up to me to catch every collision. I don't know if you can detect collisions somehow and find some ways to
// resolve them if possible.' The page is laid out as the app lays it out (the rules check's own call), every item's ink box is taken
// (notation/lib/fit.js inkOf, plus the kinds it does not know), each staff is set at its height on the page (fit.js boxesFor), and every pair of
// boxes from two DIFFERENT parts that overlap by more than --min staff spaces both ways is a collision. The two staves of one part (the piano) are
// one part. It MEASURES and LISTS; it changes nothing.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), rd = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const id = process.argv[2]; if (!id) { console.error('usage: node tools/collide_list.js <page id> [--min 0.15] [--list 40]'); process.exit(2); }
const argN = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? +process.argv[i + 1] : d; };
const MIN = argN('min', 0.15), LIST = argN('list', 40);
const Layout = require(path.join(ROOT, 'notation', 'lib', 'layout.js')), Fit = require(path.join(ROOT, 'notation', 'lib', 'fit.js'));
const Rules = require(path.join(ROOT, 'notation', 'lib', 'rules.js')), C = Rules.loadContainer(ROOT);
const glyphs = rd('notation/lib/glyphs.json'), ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json');
const ENS0 = Layout.ensembleFor(ens, (C.realizations || {})['video-jury']), LO = (C.engraving || {}).layout || {};
const ir = rd('notation/ir/' + id + '.ir.json');
const ENS = Layout.ensembleForPage(ENS0, ir);   // the page's own frame (layoutPolicy.omitParts)
const FRAME = ENS.parts.map(p => p.part);   // the app frames every part of the ensemble, whatever the page holds (seen §447)
const boxes = Fit.boxesFor(C, ENS, FRAME);
const m = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: FRAME, ensemble: ENS, techniques: T, fitBoxes: boxes }, LO));
const K = boxes.ssPerSec, TROW = (ir.layoutPolicy || {}).tempoRowSs || 4.4;

// each staff's middle line on the page, in staff spaces from the top
const mid = new Map(); { let y = 0; for (const s of m.systems) { const b = boxes.byKey[String(s.key)]; if (!b) continue; mid.set(s.key, y + b.top); y += b.top + b.bot + (b.gapBot || 0); } }
const SKIP = new Set(['staff', 'clef', 'cresccurve', 'glisscurve', 'envcurve', 'gc', 'goline', 'brick', 'tick', 'barline']);
const boxOf = it => {
  if (it.k === 'beam' && it.tips && it.tips.length) { const xs = it.tips.map(p => p.t * K + (p.dxSs || 0)), ys = it.tips.map(p => p.ySs); return { l: Math.min(...xs), r: Math.max(...xs), lo: Math.min(...ys) - 0.25, hi: Math.max(...ys) + 0.25, x: true }; }
  if (it.k === 'tuplet') { const a = it.t0 * K, b = (it.tLast != null ? it.tLast : it.t1) * K, c = (a + b) / 2, w = String(it.text || '').length * 0.45; return it.noBracket ? { l: c - w, r: c + w + 1, lo: it.ySs - 0.5, hi: it.ySs + 0.6, x: true } : { l: a, r: it.t1 * K, lo: it.ySs - 0.7, hi: it.ySs + 0.6, x: true }; }
  if (it.k === 'tempotext') { const y = it.ySs != null ? it.ySs : TROW; return { l: it.t * K + (it.dxSs || 0) - 0.4, r: it.t * K + (it.dxSs || 0) + 4.2, lo: y - 0.3, hi: y + 2.1, x: true }; }
  if (it.k === 'tempospan') { const y = it.ySs != null ? it.ySs : TROW; return { l: it.t0 * K, r: it.t1 * K - 2, lo: y - 0.1, hi: y + 0.7, x: true }; }
  if (it.k === 'ottava') { return { l: it.t * K + (it.dx0Ss || 0), r: (it.t1 != null ? it.t1 : it.t) * K + (it.dx1Ss || 0), lo: it.ySs - 0.9, hi: it.ySs + 0.9, x: true }; }
  const e = Fit.inkOf(it, glyphs, 1.3); if (!e || !(e.hi > e.lo)) return null;
  const t = it.t != null ? it.t : it.t0; if (t == null) return null;
  return { l: t * K + e.l, r: t * K + e.r, lo: e.lo, hi: e.hi };
};
const all = [];
for (const s of m.systems) { const y0 = mid.get(s.key); if (y0 == null) continue;
  for (const it of s.items || []) { if (SKIP.has(it.k)) continue; const b = boxOf(it); if (!b || !(b.r > b.l)) continue;
    all.push({ part: s.part, k: it.k === 'glyph' ? String(it.g || 'glyph').replace(/-.*/, '') : it.k, t: it.t != null ? it.t : it.t0 != null ? it.t0 : b.l / K, l: b.l, r: b.r, top: y0 - b.hi, bot: y0 - b.lo }); } }
all.sort((a, b) => a.l - b.l);
const hits = []; let act = [];
for (const a of all) { act = act.filter(b => b.r > a.l + MIN);
  for (const b of act) { if (b.part === a.part) continue; const ox = Math.min(a.r, b.r) - a.l, oy = Math.min(a.bot, b.bot) - Math.max(a.top, b.top);
    if (ox > MIN && oy > MIN) hits.push({ t: Math.max(a.t, b.t), p: [b.part, a.part].sort((x, y) => x - y), k: [b.k, a.k].sort().join(' × '), oy }); }
  act.push(a); }
const name = p => { const pc = ENS.parts.find(x => x.part === p); return (pc && (pc.short || pc.name)) || ('part ' + p); };
const tally = (f) => { const o = {}; for (const h of hits) { const k = f(h); o[k] = (o[k] || 0) + 1; } return Object.entries(o).sort((a, b) => b[1] - a[1]); };
console.log(id + ' — ' + all.length + ' ink boxes · ' + hits.length + ' collisions between two parts (overlap over ' + MIN + ' ss both ways)');
console.log('\nBY PAIR OF PARTS'); for (const [k, n] of tally(h => name(h.p[0]) + ' / ' + name(h.p[1]))) console.log('  ' + String(n).padStart(5) + '  ' + k);
console.log('\nBY WHAT MEETS WHAT'); for (const [k, n] of tally(h => h.k).slice(0, 16)) console.log('  ' + String(n).padStart(5) + '  ' + k);
console.log('\nBY 20 s'); for (const [k, n] of tally(h => String(Math.floor(h.t / 20) * 20)).sort((a, b) => a[0] - b[0])) console.log('  ' + String(n).padStart(5) + '  from ' + k + ' s');
console.log('\nTHE LANES (staff spaces above · below the middle line; the gap to the next)'); for (const s of m.systems) { const b = boxes.byKey[String(s.key)]; if (b) console.log('  ' + String(name(s.part)).padEnd(8) + ' key ' + String(s.key).padEnd(4) + ' ' + b.top.toFixed(1) + ' · ' + b.bot.toFixed(1) + ' · gap ' + (b.gapBot || 0).toFixed(1) + ' · items ' + (s.items || []).filter(i => i.k === 'glyph' && /^notehead/.test(i.g || '')).length + ' heads'); }
{ const rest = hits.filter(h => !(h.p[0] === 4 && h.p[1] === 5)); if (rest.length && rest.length <= 30) { console.log(''); console.log('EVERY ONE NOT BETWEEN THE MALLETS AND THE PIANO'); for (const h of rest.sort((a, b) => a.t - b.t)) console.log('  ' + h.t.toFixed(2) + ' s  ' + name(h.p[0]) + ' / ' + name(h.p[1]) + '  ' + h.k + '  ' + h.oy.toFixed(2) + ' ss'); } }
if (LIST > 0) { console.log('\nTHE DEEPEST ' + LIST); for (const h of hits.slice().sort((a, b) => b.oy - a.oy).slice(0, LIST)) console.log('  ' + h.t.toFixed(2) + ' s  ' + name(h.p[0]) + ' / ' + name(h.p[1]) + '  ' + h.k + '  ' + h.oy.toFixed(2) + ' ss'); }
