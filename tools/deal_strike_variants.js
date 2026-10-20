#!/usr/bin/env node
// tools/deal_strike_variants.js — SHORT PROCESSED VERSIONS FOR THE STRIKES' REPLIES (PLAN.md 1.9 · 17.1; RUNNING_LOG §337; DEC-113, his "a").
//
//   node tools/deal_strike_variants.js [--envs perc,expodec] [--seed 1] [--players bfl,bcl,perc,va,vc] [--port 5500] [--dry] [--render]
//
// A strike window's reply draws its samples from a deck a player (electronics/sc/strike.scd): the player's captures and, with "Processed too",
// their processed versions — of the ENDINGS the catalogue allows (bank/strike_responses.json samples.envs: perc · expodec, the short ones).
// This tool makes sure such versions EXIST: every impulse capture of each player (the index rows of category `impulse`, not processed) gets
// ONE processed version per ending named — a preset of bank/presets.json's dealt set (`deal` not false), round robin in a seeded shuffled
// order, none twice until all are used — and sends them to the engine as a PLAN with render 1 (--render), through the score server. The
// engine banks each as <sample>~<key>-<env> (a render, gitignored; the index row says `end`), and a window's deck then holds it. The deal
// is recorded in the catalogue (samples.deal). Nothing in a score is touched; a variant already in the bank is re-made under the same name.
// --dry says what would be sent and sends nothing. His engine must be UP for --render (node tools/elec.js ping).
'use strict';
const fs = require('fs'), path = require('path');
const K = require('./audition_kit');
const ROOT = K.ROOT;
const ENVS = String(K.arg('envs', 'perc,expodec')).split(',').map((s) => s.trim()).filter(Boolean);
const SEED = Math.max(1, Math.round(+K.arg('seed', 1)) || 1), PORT = +K.arg('port', 5500);
const PLAYERS = String(K.arg('players', 'bfl,bcl,perc,va,vc')).split(',').map((s) => s.trim()).filter(Boolean);
const DRY = K.flag('dry'), RENDER = K.flag('render');
const rd = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

const ix = rd('bank/samples/index.json');
const rows = Array.isArray(ix) ? ix : (ix.samples || ix.rows || Object.values(ix));
const P = rd('bank/presets.json');
for (const e of ENVS) if (!P.envelopes || !P.envelopes[e]) { console.error('no envelope "' + e + '" in bank/presets.json envelopes (' + Object.keys(P.envelopes || {}).join(' · ') + ')'); process.exit(2); }
const dealt = (P.presets || []).filter((p) => p.deal !== false);
if (!dealt.length) { console.error('no dealt preset in bank/presets.json'); process.exit(2); }
const raws = rows.filter((r) => r.kind !== 'processed' && r.category === 'impulse' && r.player && PLAYERS.includes(r.player) && r.name && !/~/.test(r.name)).sort((a, b) => a.name.localeCompare(b.name));
if (!raws.length) { console.error('no impulse capture in the index for ' + PLAYERS.join(', ')); process.exit(2); }

// the deal: a seeded shuffled order of the dealt presets, cycled — none twice until all are used
const rand = K.mulberry32(SEED);
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; };
const cards = K.dealCards(P, dealt, K.mulberry32(SEED * 7919 + 5));   // a GROUP of bank/presets.json `groups` is one card between its presets (DEC-146)
let deck = [];
const next = () => { if (!deck.length) deck = shuffle(cards); return deck.shift().next(); };
const have = new Set(rows.map((r) => r.name));
const objects = []; let already = 0;
for (const env of ENVS) for (const r of raws) { const p = next(); const v = p.key + '-' + env; if (have.has(r.name + '~' + v)) already++; objects.push({ elec: { name: r.name, variants: { [r.name]: v } }, startTime: 0 }); }
const lines = K.planLines(objects, P);
const byPlayer = {}; for (const r of raws) byPlayer[r.player] = (byPlayer[r.player] || 0) + 1;
console.log("the strikes' short versions — " + raws.length + ' impulse capture(s) (' + Object.entries(byPlayer).map(([k, v]) => k + ' ' + v).join(' · ') + ') × ' + ENVS.length + ' ending(s) ' + ENVS.join(' · ') + ' = ' + objects.length + ' variant(s), a preset each from the ' + dealt.length + ' dealt, seed ' + SEED + (already ? ' (' + already + ' already in the bank — re-made)' : ''));
console.log('  e.g. ' + objects.slice(0, 3).map((o) => o.elec.name + '~' + o.elec.variants[o.elec.name]).join(' · '));
if (DRY) { console.log('(dry — nothing sent, nothing written)'); process.exit(0); }

// the record, in the catalogue
{
  const rel = 'bank/strike_responses.json', src = fs.readFileSync(path.join(ROOT, rel), 'utf8'), eol = src.includes('\r\n') ? '\r\n' : '\n', m = src.match(/\n( +)"/), indent = m ? m[1].length : 1;
  const C = JSON.parse(src); C.samples = C.samples || {};
  C.samples.deal = { date: new Date().toISOString().slice(0, 16).replace('T', ' '), seed: SEED, envs: ENVS, players: PLAYERS, captures: raws.length, variants: objects.length, presets: dealt.length, rendered: RENDER,
    command: 'node tools/deal_strike_variants.js --envs ' + ENVS.join(',') + ' --seed ' + SEED + (RENDER ? ' --render' : ''),
    _doc: 'the last deal of short processed versions for the replies (tools/deal_strike_variants.js): every impulse capture × each ending, a preset round robin through the dealt set, seeded; sent as a plan with render 1 when rendered' };
  fs.writeFileSync(path.join(ROOT, rel), JSON.stringify(C, null, indent).replace(/\r?\n/g, eol) + (src.endsWith(eol) ? eol : ''), 'utf8');
  console.log('  recorded in bank/strike_responses.json samples.deal');
}
if (RENDER) K.sendPlan(lines, PORT); else console.log('  not sent: add --render to send the plan to the engine (through the score server on ' + PORT + ')');
