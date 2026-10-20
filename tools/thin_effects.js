#!/usr/bin/env node
// thin_effects.js — FEWER OF SOME EFFECTS IN A STRETCH: the plays over the count are dealt a preset of the others, by a roll.
//
// (composer 2026-10-10, DEC-145, RUNNING_LOG §374 — of the opening's 25 plays through a distortion (fuzz · diode · octave · crush):
// "let's reduce by 15. And then those 15 just redistribute, just roll for the rest of the ones.")
//
// In the stretch, every sample a return brick plays through a preset of one of the effects NAMED is a play. `--keep N` of them stay —
// shared out among the named effects in proportion to what each has now (each keeps at least one while N allows), which ones by the
// seed; every other play takes a preset from THE REST of the dealt pool (bank/presets.json, `deal` not false, its effect not named):
// one seeded deck, none twice until all are used, never a preset that sample already plays in the stretch. A play keeps its sample, its
// envelope, its drive, its brick — only the preset moves. WHAT A PLAY WAS is kept on its brick (`properties.fxSwap`), through any
// number of rolls: a new seed deals again from the stretch as it was, `--off` puts every play back.
//
//   node tools/thin_effects.js --score <name> --effects fuzz,diode,octave,crush --keep 10 [--from 0] [--to 37] [--seed 1] [--off] [--dry] [--render]
//       --render   the new versions are asked of the LIVING engine at once (a plan of those rows, render 1, through the score server
//                  on 5500) — else they are made after the next capture of their samples, and until then the brick returns raw
//
// IT WRITES THE SCORE (a working copy of the page that differs refuses it); then File ▾ → Reload in the page, BEFORE any Save.
'use strict';
const fs = require('fs'), path = require('path');
const K = require('./audition_kit.js');
const ROOT = K.ROOT, has = K.flag, arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : d; };
const die = (msg, code) => { console.error(msg); process.exit(code || 2); };

const name = arg('score'), named = String(arg('effects', '')).split(',').map((s) => s.trim()).filter(Boolean);
if (!name || (!has('off') && (!named.length || arg('keep') == null))) die('usage: node tools/thin_effects.js --score <name> --effects a,b --keep N [--from 0] [--to 37] [--seed 1] [--off] [--dry] [--render]');
const file = path.join(ROOT, 'scores', name.replace(/\.json$/, '') + '.json');
if (!fs.existsSync(file)) die('no such score: ' + K.rel(file));
const text = fs.readFileSync(file, 'utf8'), save = JSON.parse(text);
const FORMS = { compact: (o) => JSON.stringify(o), compactNl: (o) => JSON.stringify(o) + '\n', one: (o) => JSON.stringify(o, null, 1), oneNl: (o) => JSON.stringify(o, null, 1) + '\n' };
const form = Object.keys(FORMS).find((k) => FORMS[k](save) === text) || 'oneNl';
const working = file.replace(/\.json$/, '-work.json');
if (!has('unsaved-ok') && fs.existsSync(working)) {
    const strip = (o) => { const c = Object.assign({}, o); delete c.midiSnippet; delete c.mutedBy; Object.keys(c).forEach((k) => { if (k[0] === '_') delete c[k]; }); return c; };
    const essence = (s) => { try { return JSON.stringify((JSON.parse(s).objects || []).map(strip)); } catch (e) { return s; } };
    if (essence(fs.readFileSync(working, 'utf8')) !== essence(text) && !has('dry')) die('the page holds a working copy of ' + path.basename(file) + ' with UNSAVED changes — Save (CTRL+S) or Reload there first.', 3);
}

const P = K.readJson(K.PRESETS), from = +arg('from', 0), to = +arg('to', 37), seed = Math.round(+arg('seed', 1)), keep = Math.max(0, Math.round(+arg('keep', 0)));
const vOf = (x) => (typeof x === 'string' ? x : (x && x.v) || ''), split = (v) => { const i = v.lastIndexOf('-'); return { key: v.slice(0, i), env: v.slice(i + 1) }; };
const fxOf = (v) => (P.presets.find((p) => p.key === split(v).key) || {}).effect || '';
const bricks = save.objects.filter((z) => z.type === 'zone' && z.midiModel === 'elecPlay' && z.elec && z.elec.variants && z.startTime >= from && z.startTime < to).sort((a, b) => a.startTime - b.startTime);
const setV = (z, n, v) => { const x = z.elec.variants[n]; z.elec.variants[n] = typeof x === 'string' ? v : Object.assign({}, x, { v }); };

// the stretch AS IT WAS: any earlier swap put back first, so that a seed always deals from the same start
let back = 0;
for (const z of bricks) {
    const sw = z.properties && z.properties.fxSwap;
    if (!sw) continue;
    for (const n of Object.keys(sw)) if (z.elec.variants[n] != null) { setV(z, n, sw[n].from); back++; }
    delete z.properties.fxSwap;
}
const plays = [];
for (const z of bricks) for (const n of Object.keys(z.elec.variants)) { const v = vOf(z.elec.variants[n]); plays.push({ z, n, v, fx: fxOf(v), env: split(v).env }); }
const tally = () => { const t = {}; for (const z of bricks) for (const n of Object.keys(z.elec.variants)) { const f = fxOf(vOf(z.elec.variants[n])) || '?'; t[f] = (t[f] || 0) + 1; } return Object.keys(t).sort((a, b) => t[b] - t[a]).map((k) => k + ' ' + t[k]).join(' · '); };

const out = [], made = [];
if (has('off')) out.push('every play put back as it was: ' + back + ' plays · ' + tally());
else {
    const mine = plays.filter((p) => named.includes(p.fx));
    if (mine.length <= keep) die('the stretch has ' + mine.length + ' plays of ' + named.join(' · ') + ' — not more than the ' + keep + ' to keep: nothing to do', 1);
    out.push('before: ' + tally());
    // how many each named effect keeps: in proportion, the largest remainders first, at least one each while the count allows
    const groups = named.map((f) => mine.filter((p) => p.fx === f)).filter((g) => g.length);
    const share = groups.map((g) => g.length * keep / mine.length), n = share.map((s) => Math.floor(s));
    if (keep >= groups.length) n.forEach((x, i) => { if (!x) n[i] = 1; });
    const order = share.map((s, i) => [s - Math.floor(s), i]).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
    for (let i = 0; n.reduce((a, b) => a + b, 0) < keep; i++) n[order[i % order.length]]++;
    for (let i = 0; n.reduce((a, b) => a + b, 0) > keep; i++) { const j = order[order.length - 1 - (i % order.length)]; if (n[j] > 1) n[j]--; }
    const rnd = K.mulberry32(seed * 7919 + 31), shuffle = (a) => a.map((x) => [rnd(), x]).sort((p, q) => p[0] - q[0]).map((x) => x[1]);
    const go = [];
    groups.forEach((g, i) => { shuffle(g).slice(n[i]).forEach((p) => go.push(p)); });
    go.sort((a, b) => a.z.startTime - b.z.startTime);
    // the rest of the dealt pool, one deck, none twice until all are used; never a version the stretch already has
    const rest = P.presets.filter((p) => p.deal !== false && !named.includes(p.effect));
    if (!rest.length) die('no dealt preset outside ' + named.join(' · '));
    const cards = K.dealCards(P, rest, K.mulberry32(seed * 7919 + 5));   // a GROUP of the presets file is one card between its presets (DEC-146)
    const has1 = new Set(plays.filter((p) => !go.includes(p)).map((p) => p.n + '~' + p.v));
    let deck = [];
    for (const p of go) {
        let pick = null;
        for (let tries = 0; tries < rest.length * 2 && !pick; tries++) {
            if (!deck.length) deck = shuffle(cards.slice());
            const c = deck.shift().next(), v = c.key + '-' + p.env;
            if (!has1.has(p.n + '~' + v)) pick = { c, v };
        }
        if (!pick) die('no preset left for ' + p.n + ' — every one of the rest is on it already');
        p.z.properties = p.z.properties || {};
        (p.z.properties.fxSwap = p.z.properties.fxSwap || {})[p.n] = { from: p.v, seed };
        setV(p.z, p.n, pick.v); has1.add(p.n + '~' + pick.v);
        made.push({ elec: { name: p.n, variants: { [p.n]: pick.v } }, startTime: p.z.startTime });
        out.push('  ' + p.z.startTime.toFixed(2).padStart(6) + ' s  ' + p.n.padEnd(15) + (p.v + ' (' + p.fx + ')').padEnd(28) + '→ ' + pick.v + ' (' + pick.c.effect + ')');
    }
    out.splice(1, 0, 'kept: ' + groups.map((g, i) => g[0].fx + ' ' + n[i] + ' of ' + g.length).join(' · ') + ' — ' + go.length + ' plays dealt again, seed ' + seed + ':');
    out.push('after:  ' + tally());
}
console.log(out.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
fs.writeFileSync(file, FORMS[form](save));
console.log('written: ' + K.rel(file) + ' — in the page: File ▾ → Reload, BEFORE any Save');
if (has('render') && made.length) K.sendPlan(K.planLines(made, P), +arg('port', 5500));
