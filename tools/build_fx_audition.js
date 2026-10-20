#!/usr/bin/env node
// build_fx_audition.js — EVERY PROCESSED VERSION A STRETCH OF A SCORE PLAYS, IN A ROW (his word 2026-10-10, DEC-139; RUNNING_LOG §367:
// "in the first section, I want to inspect all of the FX versions. So can you make another save file that just has a brick for each
// electronics impulse … in a row with like a second or two between them and in sequence. So all the bass flute ones and then all the
// bass clarinet ones, etc. … click the brick and get a card").
//
//   node tools/build_fx_audition.js [--from piece-Draft01] [--t0 0] [--t1 37] [--name audition-sec01-fx] [--gap 3] [--replace] [--render]
//
// Reads the return bricks of --from that begin in [t0, t1) and every (sample → processed version) they play (a brick's elec.variants),
// and writes a NEW score: ONE PLAIN RETURN BRICK for each version, on its player's lane, --gap seconds apart, the players one after
// another (bass flute · bass clarinet · percussion · viola · cello), a player's versions by impulse number, then by where the section
// first plays them. A brick asks for the SAME banked render the section plays (`<sample>~<key>-<env>`): nothing is rendered anew
// unless --render (the engine then makes every version again — a preset's ranges are drawn afresh, so it may differ from the last pass).
// Click a brick: its panel's "Processed as" row names the preset and the ending, with ▶; the brick's note says where the section
// plays it. The sheet docs/auditions/<name>.md lists each with its preset's effect and dials (bank/presets.json).
// It never writes over a score it did not make (--replace for its own). THE SORTING: it knows the piece's scores and bank — the piece's.
'use strict';
const path = require('path');
const K = require('./audition_kit');
const FROM = K.arg('from', 'piece-Draft01'), T0 = +K.arg('t0', 0), T1 = +K.arg('t1', 37), NAME = K.arg('name', 'audition-sec01-fx'), GAP = Math.max(0.5, +K.arg('gap', 3) || 3);
const src = K.readJson(path.join(K.ROOT, 'scores', FROM + '.json')), P = K.readJson(K.PRESETS);
const index = K.readJson(path.join(K.ROOT, 'bank', 'samples', 'index.json')).samples || [];
const banked = new Set(index.map((r) => r.name));
const LANE = { bfl: 0, bcl: 1, perc: 2, va: 4, vc: 5 }, ORDER = Object.keys(K.PLAYERS);
const playerOf = (sample) => { const r = index.find((x) => x.name === sample); return (r && r.player) || String(sample).split('-')[0]; };
const numOf = (sample) => +(String(sample).match(/-(\d+)$/) || [0, 0])[1];
const vOf = (v) => (v && typeof v === 'object' ? v.v : v);
// every (sample → version) the stretch plays, with where
const uses = new Map();
for (const z of (src.objects || []).filter((o) => o.type === 'zone' && o.midiModel === 'elecPlay' && o.elec && o.startTime >= T0 && o.startTime < T1).sort((a, b) => a.startTime - b.startTime)) {
  for (const [sample, v] of Object.entries(z.elec.variants || {})) {
    const k = sample + '|' + JSON.stringify(v);
    if (!uses.has(k)) uses.set(k, { sample, v, at: [] });
    uses.get(k).at.push({ t: z.startTime, behaviour: z.elec.behaviour || 'plain' });
  }
}
if (!uses.size) { console.error('no return brick with a processed version begins in ' + T0 + ' … ' + T1 + ' s of ' + FROM); process.exit(4); }
const list = [...uses.values()].sort((a, b) => ORDER.indexOf(playerOf(a.sample)) - ORDER.indexOf(playerOf(b.sample)) || numOf(a.sample) - numOf(b.sample) || a.at[0].t - b.at[0].t);
const Z = K.zoneMaker(), objects = [], rows = [];
let t = 2, last = null;
for (const u of list) {
  const who = playerOf(u.sample), ver = vOf(u.v), i = String(ver).lastIndexOf('-'), key = String(ver).slice(0, i), env = String(ver).slice(i + 1), p = P.presets.find((x) => x.key === key);
  if (last && who !== last) t += GAP;                                    // a longer breath between two players
  last = who;
  const z = Z.zone(LANE[who] != null ? LANE[who] : 0, t, { name: u.sample, variants: { [u.sample]: u.v } });
  z.performanceNotes = 'FX AUDITION — ' + u.sample + ' as ' + ver + (p ? ' (' + p.effect + ')' : ' (a preset no longer in bank/presets.json)') + ' · in ' + FROM + ' at ' + u.at.map((a) => a.t.toFixed(1) + ' s' + (a.behaviour !== 'plain' ? ' (' + a.behaviour + ')' : '')).join(' · ');
  objects.push(z);
  rows.push({ t, who, sample: u.sample, key, env, p, at: u.at, banked: banked.has(u.sample + '~' + ver.replace(/_d[A-Za-z0-9]+$/, '')) || banked.has(u.sample + '~' + ver) });
  t = Math.round((t + GAP) * 1000) / 1000;
}
const note = 'FX AUDITION of ' + FROM + ' ' + T0 + ' … ' + T1 + ' s (DEC-139): every processed version the stretch plays, one plain return brick each, the players in turn.';
const file = K.writeScore(NAME, objects, Z.nextId(), note, 'tools/build_fx_audition.js', K.flag('replace'));
const dials = (p) => (p ? Object.entries(p.args || {}).map(([k, v]) => k + ' ' + (Array.isArray(v) ? v[0] + ' … ' + v[1] : v)).join(' · ') : '—');
const sheet = ['# FX AUDITION — `scores/' + NAME + '.json`', '',
  '*Built ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' by `node tools/build_fx_audition.js --from ' + FROM + ' --t0 ' + T0 + ' --t1 ' + T1 + ' --name ' + NAME + ' --gap ' + GAP + '`. Regenerated at every build — do not edit.*', '',
  'Every processed version that `' + FROM + '` plays between ' + T0 + ' and ' + T1 + ' s — ' + rows.length + ' of them — one return brick each, ' + GAP + ' s apart, the players in turn. Each brick plays the render the bank holds (the section\'s last pass). A dial shown as `a … b` is a range the engine draws inside at every render.', '',
  '| at | player | impulse | preset | effect | ending | the preset\'s dials | in the section at (s) |', '|---|---|---|---|---|---|---|---|']
  .concat(rows.map((r) => '| ' + K.clock(r.t) + ' | ' + K.PLAYERS[r.who] + ' | ' + r.sample.replace(/^.*-impulse-/, '') + ' | **' + r.key + '**' + (r.banked ? '' : ' *(no render in the bank: plays raw)*') + ' | ' + (r.p ? r.p.effect : '—') + ' | ' + r.env + ' | ' + dials(r.p) + ' | ' + r.at.map((a) => a.t.toFixed(1) + (a.behaviour !== 'plain' ? ' ' + a.behaviour : '')).join(' · ') + ' |'));
K.writeSheet(NAME, sheet.join('\n'));
const per = ORDER.map((w) => K.PLAYERS[w] + ' ' + rows.filter((r) => r.who === w).length).join(' · '), missing = rows.filter((r) => !r.banked).length;
console.log(K.rel(file) + ' — ' + rows.length + ' versions (' + per + '), ' + GAP + ' s apart, ' + K.clock(2) + ' … ' + K.clock(rows[rows.length - 1].t) + ' · ' + (rows.length - missing) + ' have a render in the bank' + (missing ? ', ' + missing + ' do not (they play raw until rendered: --render, or "render all planned" in a brick\'s panel)' : '') + ' · the sheet docs/auditions/' + NAME + '.md');
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), +K.arg('port', 5500));
else console.log('no plan sent: the bricks play the renders the bank holds. In the page: open ' + NAME + ' · play from 0.');
