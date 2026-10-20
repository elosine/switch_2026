#!/usr/bin/env node
// deal_variants.js — THE DEALING (PLAN 10.8 d; DEC-21 · 21b · 22; RUNNING_LOG §116): every return of a score gets a TRANSFORMATION —
// a preset of bank/presets.json under an envelope — so that no sample comes back as itself. To each sample a return brick plays, in
// score order: a preset, ROUND ROBIN through the list (shuffled once by the seed), none used twice until all are used; a second
// pass gives a preset ANOTHER envelope than its first. The envelopes by the file's `mix` (perc 40 · expodec 40 · gauss 10 · tri 10),
// as exact shares of the plays, shuffled by the seed. Written as  elec.variants = { '<sample>': '<key>-<env>' }  on each brick; the
// page sends the plan and the engine renders (electronics/score/le_objects.js · electronics/sc/process.scd).
//   node tools/deal_variants.js --score piece-sec01-a --to 22.5 [--from 0] [--seed 1] [--env tail] [--render] [--dry] [--clear]
// Dealt: the return bricks (midiModel elecPlay) that start in [from, to) and play NAMED samples — plain · ar · chain · arChain.
// NOT dealt: a pattern brick and a brick of '*' (group 5: its rhythm is his first; its effects after — perc · expodec only).
// --env <name>: ONE envelope for every play instead of the mix (his §118: "just letting them ring" = --env tail; a second lap then
//   repeats a variant, since a preset under one envelope is one sample). --render: the plan is then SENT to the engine through the
//   score server (--port 5500) with render 1 — the same message the page sends, so the thirty are made from the bank now, without
//   a pass through the openings or a click of his. A range ([lo, hi] — a dial's, or the tail's ring time) is drawn at the send.
// --dry prints the deal and writes nothing. --clear takes the variants off the bricks in the range instead.
// The score file is written in place: he has SAVED first — a working copy that differs from the save refuses the tool (§85). Reload after.
// THE SORTING: this tool knows the piece (its save, its bank, its presets) — it is the piece's, not the engine's.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes('--dry'), CLEAR = process.argv.includes('--clear'), RENDER = process.argv.includes('--render');
const NAME = arg('score', ''), FROM = +arg('from', 0), TO = arg('to', null) == null ? Infinity : +arg('to'), SEED = +arg('seed', 1);
const ENV = arg('env', ''), PORT = +arg('port', 5500), CLASS = arg('class', '');   // --class time: only the presets of that class (his §119: "just the time effects")
if (!NAME) { console.error('which score?  --score piece-sec01-a'); process.exit(2); }
const FILE = path.join(ROOT, 'scores', NAME + '.json');
if (!fs.existsSync(FILE)) { console.error('no such score: ' + path.relative(ROOT, FILE)); process.exit(2); }
{   // the page's working copy: a refusal only when it holds something the save does not (tools/impulse.js, §85)
  const WORK = path.join(ROOT, 'scores', NAME + '-work.json');
  if (fs.existsSync(WORK)) {
    let same = false; try { same = JSON.stringify(JSON.parse(fs.readFileSync(WORK, 'utf8')).objects) === JSON.stringify(JSON.parse(fs.readFileSync(FILE, 'utf8')).objects); } catch (e) { same = false; }
    if (!same && !DRY && !process.argv.includes('--unsaved-ok')) { console.error('the page holds a working copy of ' + NAME + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (or --unsaved-ok at HIS word: the page\'s Reload then drops them)'); process.exit(3); }
    if (!same && !DRY) console.log('(the page holds UNSAVED changes — written over at his word; File ▾ → Reload → OK "drop the unsaved edits" loads this)');
    console.log(same ? '(the working copy is identical to the save: nothing unsaved; Reload in the page after this)' : '(THE PAGE HOLDS UNSAVED CHANGES — this dry run is of the SAVE, not of what the page shows)');
  }
}

const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'presets.json'), 'utf8'));
const INDEX = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'samples', 'index.json'), 'utf8')).samples || []; } catch (e) { return []; } })();
const TRACKS = (() => { try { return new Function('return ' + fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1])(); } catch (e) { return []; } })();
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffled = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const save = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const bricks = (save.objects || []).filter((o) => o.type === 'zone' && o.midiModel === 'elecPlay' && o.elec && o.startTime >= FROM && o.startTime < TO)
  .sort((a, b) => a.startTime - b.startTime);
const namesOf = (e) => ((e.behaviour === 'chain' || e.behaviour === 'arChain') && Array.isArray(e.names) && e.names.length ? e.names : [e.name]).filter(Boolean);
const dealt = bricks.filter((z) => z.elec.behaviour !== 'pattern' && !namesOf(z.elec).includes('*') && namesOf(z.elec).length);
const skipped = bricks.length - dealt.length;

if (CLEAR) {
  const n = dealt.filter((z) => z.elec.variants).length;
  console.log(n + ' brick(s) carry variants in ' + NAME + ' [' + FROM + ', ' + (TO === Infinity ? 'end' : TO) + ')');
  if (DRY) { console.log('(dry — nothing written)'); process.exit(0); }
  dealt.forEach((z) => { delete z.elec.variants; });
} else {
  const plays = [];
  dealt.forEach((z) => namesOf(z.elec).forEach((name) => plays.push({ z, name })));
  if (!plays.length) { console.error('no return brick with a named sample starts in [' + FROM + ', ' + (TO === Infinity ? 'end' : TO) + ') of ' + NAME); process.exit(4); }
  // THE PRESETS, round robin: one shuffle; a lap uses every preset once
  const dealable = P.presets.filter((p) => p.deal !== false);   // an audition's presets (`deal: false`, RUNNING_LOG §151) are never dealt
  const pool = CLASS ? dealable.filter((p) => p.class === CLASS) : dealable;
  if (!pool.length) { console.error('no preset of class "' + CLASS + '" in bank/presets.json — the classes: ' + Object.keys(P.classes || {}).join(' · ')); process.exit(2); }
  // THE CARDS (DEC-146): a preset a card — but a GROUP of bank/presets.json `groups` (the distortions) is ONE card between its presets,
  // which take turns when it comes up (tools/audition_kit.js dealCards). No groups in the file: the deal as it always was.
  const order = shuffled(require('./audition_kit.js').dealCards(P, pool, mulberry32(SEED * 7919 + 5)), mulberry32(SEED * 7919 + 3));
  // THE ENVELOPES, by the mix: exact shares of the plays (the largest remainders round it), shuffled — or the ONE envelope asked for
  if (ENV && !P.envelopes[ENV]) { console.error('no envelope "' + ENV + '" in bank/presets.json — one of: ' + Object.keys(P.envelopes).join(' · ')); process.exit(2); }
  const mix = ENV ? [[ENV, 1]] : Object.entries(P.mix || { perc: 1 }).filter(([k, w]) => P.envelopes[k] && w > 0), wSum = mix.reduce((s, [, w]) => s + w, 0);
  const share = mix.map(([k, w]) => ({ k, exact: plays.length * w / wSum })); share.forEach((s) => { s.n = Math.floor(s.exact); });
  for (let left = plays.length - share.reduce((s, x) => s + x.n, 0); left > 0; left--) share.slice().sort((a, b) => (b.exact - b.n) - (a.exact - a.n))[0].n++;
  const envs = shuffled(share.flatMap((s) => Array(s.n).fill(s.k)), mulberry32(SEED * 104729 + 17));
  // a later lap: a preset never under the envelope it had before — the envelope is traded with a later play's
  const had = new Map();
  plays.forEach((p, i) => {
    p.preset = order[i % order.length].next();
    const used = had.get(p.preset.key) || [];
    if (!ENV && used.includes(envs[i])) {
      let j = -1;
      for (let q = i + 1; q < envs.length; q++) if (!used.includes(envs[q])) { j = q; break; }
      if (j >= 0) [envs[i], envs[j]] = [envs[j], envs[i]];
      else envs[i] = (mix.map(([k]) => k).find((k) => !used.includes(k))) || envs[i];
    }
    p.env = envs[i];
    had.set(p.preset.key, used.concat(p.env));
  });
  // the table
  const lane = (l) => ((TRACKS[l] && TRACKS[l].label) || 'lane ' + l);
  const lengthOf = (p) => {
    const row = INDEX.find((r) => r.name === p.name), cls = (P.classes || {})[p.preset.class] || {}, rate = Math.min(8, Math.max(0.05, Math.abs(+(p.preset.args || {}).rate || 1)));
    if (p.env === 'tail') { const c = p.preset.capMs || (P.envelopes.tail || {}).capMs || 4000; return 'rings ≤ ' + (Array.isArray(c) ? c.join('…') : c) + ' ms past it'; }
    return row ? Math.round(row.lengthMs / rate * (+p.preset.durX || +cls.durX || 1)) + ' ms' : 'not captured';
  };
  console.log('THE DEAL — ' + NAME + ' [' + FROM + ', ' + (TO === Infinity ? 'end' : TO) + ') · seed ' + SEED + ' · ' + plays.length + ' plays on ' + dealt.length + ' bricks · ' + order.length + ' cards (' + pool.length + ' presets' + order.filter((c) => c.group).map((c) => ' · the ' + c.size + ' of "' + c.group + '" one card').join('') + ')'
    + (skipped ? ' · ' + skipped + ' brick(s) left alone (a pattern, or *)' : ''));
  plays.forEach((p, i) => console.log(String(i + 1).padStart(3) + '  ' + p.z.startTime.toFixed(2).padStart(6) + ' s  ' + lane(p.z.layer).padEnd(13) + (p.z.elec.behaviour || 'plain').padEnd(8) + p.name.padEnd(16)
    + '→ ' + (p.preset.key + '-' + p.env).padEnd(17) + lengthOf(p).padEnd(8) + ' ' + p.preset.name));
  const count = (f) => { const m = {}; plays.forEach((p) => { const k = f(p); m[k] = (m[k] || 0) + 1; }); return Object.entries(m).map(([k, n]) => k + ' ' + n).join(' · '); };
  console.log('envelopes: ' + count((p) => p.env) + '   ·   classes: ' + count((p) => p.preset.class));
  if (DRY) { console.log('(dry — nothing written)'); process.exit(0); }
  dealt.forEach((z) => { z.elec.variants = {}; });
  plays.forEach((p) => { p.z.elec.variants[p.name] = p.preset.key + '-' + p.env; });
}
// THE DEAL IS RECORDED IN THE SCORE (his §120: "know which one it was"): metadata.deal — the same command gives the same deal again
save.metadata = Object.assign({}, save.metadata, { modified: new Date().toISOString(),
  deal: CLEAR ? null : { seed: SEED, env: ENV || 'the mix', class: CLASS || 'all', from: FROM, to: TO === Infinity ? null : TO, when: new Date().toISOString().slice(0, 16),
    command: 'node tools/deal_variants.js --score ' + NAME + (TO === Infinity ? '' : ' --to ' + TO) + (FROM ? ' --from ' + FROM : '') + ' --seed ' + SEED + (ENV ? ' --env ' + ENV : '') + (CLASS ? ' --class ' + CLASS : '') } });
// the write, with a retry: the score file is held for an instant now and then (the page's autosave, the server's read — RUNNING_LOG
// §140 · §146: `UNKNOWN: unknown error, open …`, errno -4094, three times in one evening); the deal is computed above, nothing is half-written
for (let tries = 0; ; tries++) {
  try { fs.writeFileSync(FILE, JSON.stringify(save, null, 1) + '\n'); break; }
  catch (e) { if (tries >= 5) throw e; console.log('(the score file is held by another process — again in 300 ms)'); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300); }
}
if (!CLEAR) console.log('the deal is recorded in the score: ' + save.metadata.deal.command);
console.log(path.relative(ROOT, FILE) + ' written — ' + (CLEAR ? 'the variants taken off ' : 'a variant on every sample of ') + dealt.length + ' return bricks. Reload it in the composer page (File ▾ → Reload).');

// --render: THE PLAN to the engine, as the page sends it (electronics/sc/process.scd header: /le/plan — a row per variant,
// base;suffix;effect;end;atkMs;durX;match;t;capMs;args, '|' between rows, parts of six that share a stamp), with render 1.
// The message's format is the engine's contract; the rows are built here from the save just written.
if (RENDER && !CLEAR) {
  const draw = (v) => (Array.isArray(v) && v.length === 2 ? Math.round((Math.min(+v[0], +v[1]) + Math.random() * Math.abs(+v[1] - +v[0])) * 100) / 100 : +v);
  const out = new Map();
  (save.objects || []).filter((o) => o.type === 'zone' && o.midiModel === 'elecPlay' && o.elec && o.elec.variants).sort((a, b) => a.startTime - b.startTime).forEach((z) => {
    for (const [name, v] of Object.entries(z.elec.variants)) {
      const i = String(v).lastIndexOf('-'), key = i > 0 ? v.slice(0, i) : v, env = i > 0 ? v.slice(i + 1) : '', p = P.presets.find((x) => x.key === key), E = P.envelopes[env];
      if (!p || !E) continue;
      const id = name + '~' + v, t = Math.round(z.startTime * 1000) / 1000;
      if (out.has(id)) { if (t < out.get(id).t) out.get(id).t = t; continue; }
      const cls = (P.classes || {})[p.class] || {};
      const args = Object.keys(p.args || {}).filter((k) => /^[A-Za-z][A-Za-z0-9]*$/.test(k)).map((k) => { const x = draw(p.args[k]); return Number.isFinite(x) ? k + ':' + x : null; }).filter(Boolean).join(',');
      out.set(id, { t, line: [name, v, String(p.effect || '').replace(/[^A-Za-z0-9 _+-]/g, '').slice(0, 40), env === 'tail' ? 'tail' : env, +E.atkMs || 0, +(p.durX || cls.durX || 1), p.match === 0 ? 0 : 1, t,
        env === 'tail' ? Math.round(draw(p.capMs || E.capMs || 4000)) : 0, args] });
    }
  });
  const rows = [...out.values()].sort((a, b) => a.t - b.t).map((r) => { r.line[7] = r.t; return r.line.join(';'); });
  const per = 6, n = Math.max(1, Math.ceil(rows.length / per)), stamp = 't' + Date.now().toString(36);
  (async () => {
    for (let i = 0; i < n; i++) {
      const body = JSON.stringify({ kind: 'plan', data: { stamp, part: i + 1, of: n, rows: rows.slice(i * per, (i + 1) * per).join('|'), render: 1 } });
      const r = await fetch('http://localhost:' + PORT + '/api/elec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).then((x) => x.json()).catch((e) => ({ ok: false, error: e.message }));
      if (!r || !r.ok) { console.error('the plan did NOT reach the score server on ' + PORT + ': ' + ((r && r.error) || 'no answer') + ' — is it running?'); process.exit(5); }
    }
    console.log('the plan sent to the engine through the score server on ' + PORT + ' — ' + rows.length + ' variants in ' + n + ' part(s), render 1: the engine makes them from the bank now (its window names each; an engine started before the build hears nothing).');
  })();
}
