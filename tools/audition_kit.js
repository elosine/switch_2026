// audition_kit.js — what the AUDITION BUILDERS share (tools/build_petals.js · tools/build_chord_feedback.js; his word 2026-10-06,
// DEC-32 · PLAN 10.3 · 10.12 · RUNNING_LOG §151). An audition is a score of return bricks, one after another, none overlapping, each
// asking for ONE preset of bank/presets.json on a captured impulse — for him to play through and sample from. This file holds the parts
// that do not differ: the impulses in a spread order · a return brick · the score written as a NEW file · an audition's own presets
// (marked `deal: false` and `audition: <tag>`, so the dealing never takes them and a second run replaces only its own) · the plan as
// the page sends it · the sheet. tools/build_audition.js (every preset in a row, §125) is older and stands alone.
// THE SORTING: it knows the piece (its bank, its presets, its scores) — the piece's.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PRESETS = path.join(ROOT, 'bank', 'presets.json');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');
// a write may meet a momentary lock on this machine ("UNKNOWN: unknown error, open …" — RUNNING_LOG §140 · §146): tried again, briefly
const writeFile = (file, text) => {
  for (let n = 1; ; n++) {
    try { fs.writeFileSync(file, text); return; } catch (e) {
      if (n >= 6 || !/UNKNOWN|EBUSY|EPERM/.test(String(e.code))) throw e;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300);
    }
  }
};
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const byName = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const noteName = (m) => NOTES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);   // 60 = C4
const hz = (m) => Math.round(440 * Math.pow(2, (m - 69) / 12) * 100) / 100;
const PLAYERS = { bfl: 'bass flute', bcl: 'bass clarinet', perc: 'percussion', va: 'viola', vc: 'cello' };

// the captured impulses, by impulse number then player (build_audition.js's order) …
function impulses() {
  const index = readJson(path.join(ROOT, 'bank', 'samples', 'index.json')).samples || [];
  const list = index.filter((r) => r.kind !== 'processed' && /-impulse-\d+$/.test(r.name))
    .sort((a, b) => byName(a.name.replace(/.*-impulse-/, ''), b.name.replace(/.*-impulse-/, '')) || byName(a.player, b.player));
  if (!list.length) { console.error('no captured impulses in the bank (bank/samples/index.json)'); process.exit(4); }
  return list;
}
// … and taken with a STRIDE that shares no factor with their number: neighbours differ in player AND in impulse, and every impulse
// is used once before one comes round again (thirty impulses, a stride of 7)
function spread(list) {
  let s = Math.min(7, Math.max(1, list.length - 1));
  while (s > 1 && gcd(s, list.length) !== 1) s--;
  return (i) => list[(i * s) % list.length];
}

// a return brick, as the page makes one (electronics/score/le_objects.js MODELS.elecPlay) — the page then draws it as long as its sample
function zoneMaker() {
  let nextId = 1;
  const zone = (layer, start, elec) => ({
    id: 'zn-' + (nextId++), type: 'zone', layer, startTime: Math.round(start * 1000) / 1000, endTime: Math.round((start + 0.5) * 1000) / 1000, player: '', instrument: '', zoneFunction: 'elec', midiModel: 'elecPlay',
    ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
    responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color: '#8E24AA', opacity: 0.35, yOffset: 1, zoneHeight: 0.2,
    performanceNotes: '', properties: {}, elec,
  });
  return { zone, nextId: () => nextId };
}

// the score, a NEW file on the workshop score's frame (tracks · layout · viewport). It never writes over a score — except, with
// --replace, one that THIS tool made (metadata.builtBy).
function writeScore(name, objects, nextId, note, builtBy, replace) {
  const file = path.join(ROOT, 'scores', name + '.json'), work = path.join(ROOT, 'scores', name + '-work.json');
  if (fs.existsSync(file)) {
    const old = (() => { try { return readJson(file); } catch (e) { return {}; } })();
    if (!(replace && old.metadata && old.metadata.builtBy === builtBy)) {
      console.error(rel(file) + ' exists — this tool never writes over a score' + (old.metadata && old.metadata.builtBy === builtBy ? ' unless told: --replace (it made this one)' : '; another --name'));
      process.exit(3);
    }
  }
  const base = readJson(path.join(ROOT, 'scores', 'workshop-bfl-slap.json'));
  const now = new Date().toISOString();
  const save = Object.assign({}, base, { objects, markers: [], nextId, metadata: { created: now, modified: now, builtBy, note } });
  writeFile(file, JSON.stringify(save, null, 1) + '\n');
  if (fs.existsSync(work)) console.log('NOTE — the page holds a working copy of ' + name + ' from before: File ▾ → Reload drops it and opens this one.');
  return file;
}

// an audition's presets into bank/presets.json: its own rows (audition === tag) replaced, every other row untouched
function writePresets(tag, rows, what, command) {
  const P = readJson(PRESETS), before = P.presets.length, own = P.presets.filter((p) => p.audition === tag).length;
  const clash = rows.filter((r) => P.presets.some((p) => p.key === r.key && p.audition !== tag)).map((r) => r.key);
  if (clash.length) { console.error('these keys are already someone else\'s in bank/presets.json: ' + clash.join(', ')); process.exit(2); }
  P.presets = P.presets.filter((p) => p.audition !== tag).concat(rows.map((r) => Object.assign({}, r, { deal: false, audition: tag })));
  P.auditions = Object.assign({ _about: 'PRESETS OF AN AUDITION (RUNNING_LOG §151): rows with `deal: false` are never dealt (tools/deal_variants.js · the pattern brick\'s Effects · tools/build_audition.js) and survive a generation (tools/gen_presets.js); a return brick may still be given one by hand, in its panel. `audition` names the builder\'s set; a preset\'s own `capMs` is its ring-out\'s cap under the `tail` envelope.' },
    P.auditions, { [tag]: { n: rows.length, what, command, when: new Date().toISOString().slice(0, 16) } });
  writeFile(PRESETS, JSON.stringify(P, null, 1) + '\n');
  console.log(rel(PRESETS) + ' — ' + rows.length + ' presets of the audition "' + tag + '" written (' + own + ' of its own replaced; ' + (before - own) + ' others untouched).');
  return P;
}

// THE PLAN, as the page sends it (le_objects.js planRows · sendPlan): base;suffix;effect;end;atkMs;durX;match;t;capMs;args per variant
function planLines(objects, P) {
  const draw = (v) => (Array.isArray(v) && v.length === 2 ? Math.round((Math.min(+v[0], +v[1]) + Math.random() * Math.abs(+v[1] - +v[0])) * 100) / 100 : +v);
  return objects.map((z) => {
    const name = z.elec.name, v = z.elec.variants[name], i = v.lastIndexOf('-'), key = v.slice(0, i), env = v.slice(i + 1), p = P.presets.find((x) => x.key === key), E = P.envelopes[env], cls = (P.classes || {})[p.class] || {};
    const isLine = (x) => typeof x === 'string' && /@/.test(x);   // a dial as a LINE (value@ms, …) or the drone section's icFromMs:region@F — sent whole
    const args = Object.keys(p.args || {}).filter((k) => /^[A-Za-z][A-Za-z0-9]*$/.test(k)).map((k) => { if (isLine(p.args[k])) return k + ':' + String(p.args[k]).replace(/\s+/g, ''); const x = draw(p.args[k]); return Number.isFinite(x) ? k + ':' + x : null; }).filter(Boolean).join(',');
    // 15.2 d (the drone section): a `shape` envelope carries the preset's rise, its ABSOLUTE length ("<ms>ms" in the durX field), its fall and its curve (fields 12 · 13)
    const shape = env === 'shape', pick = (k, d) => (p[k] != null ? +p[k] : E[k] != null ? +E[k] : d), durMs = shape ? pick('durMs', 0) : 0;
    return [name, v, String(p.effect || '').replace(/[^A-Za-z0-9 _+-]/g, '').slice(0, 40), env === 'tail' ? 'tail' : env, pick('atkMs', 0) || 0, durMs > 0 ? Math.round(durMs) + 'ms' : +(p.durX || cls.durX || 1), p.match === 0 ? 0 : 1, z.startTime, env === 'tail' ? Math.round(draw(p.capMs || E.capMs || 4000)) : 0, args, 'normalized'].concat(shape ? [pick('relMs', 1500), pick('curve', 0)] : []).join(';');
  });
}
async function sendPlan(lines, port) {
  const per = 6, n = Math.max(1, Math.ceil(lines.length / per)), stamp = 'a' + Date.now().toString(36);
  for (let i = 0; i < n; i++) {
    const body = JSON.stringify({ kind: 'plan', data: { stamp, part: i + 1, of: n, rows: lines.slice(i * per, (i + 1) * per).join('|'), render: 1 } });
    const r = await fetch('http://localhost:' + port + '/api/elec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).then((x) => x.json()).catch((e) => ({ ok: false, error: e.message }));
    if (!r || !r.ok) { console.error('the plan did NOT reach the score server on ' + port + ': ' + ((r && r.error) || 'no answer')); process.exit(5); }
  }
  console.log('the plan sent to the engine — ' + lines.length + ' variants, render 1: the engine makes them from the bank now.');
}

// THE DEAL'S CARDS (DEC-146, RUNNING_LOG §375 — his words: "can we make the distortion types all like one item? So we have the 27 ones,
// and then all the distortion effects will be like one element in there. In other words, I want them to come up less often"): every
// dealt preset is one card — but the presets of a GROUP (bank/presets.json `groups`: { name: { effects: [...], keys: [...] } }) are ONE
// card between them; when that card comes up its members take turns, in a seeded order of their own. So thirteen distortion presets
// come up as often as one preset. A file with no groups: a card a preset, as before. (The page's own dealer, the pattern brick's, reads
// the same row: electronics/score/le_objects.js dealCards.)
function dealCards(P, pool, rnd) {
  const G = (P && P.groups) || {}, groupOf = (p) => Object.keys(G).find((g) => g[0] !== '_' && G[g] && ((G[g].effects || []).includes(p.effect) || (G[g].keys || []).includes(p.key)));
  const cards = [], byGroup = new Map();
  for (const p of pool) {
    const g = groupOf(p);
    if (!g) { cards.push({ key: p.key, size: 1, next: () => p }); continue; }
    if (!byGroup.has(g)) { const c = { key: '(' + g + ')', group: g, members: [], i: 0 }; c.next = () => c.members[c.i++ % c.members.length]; byGroup.set(g, c); cards.push(c); }
    byGroup.get(g).members.push(p);
  }
  for (const c of byGroup.values()) { c.members = c.members.map((x) => [rnd(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]); c.size = c.members.length; }
  return cards;
}
function writeSheet(name, text) {
  const dir = path.join(ROOT, 'docs', 'auditions'), file = path.join(dir, name + '.md');
  fs.mkdirSync(dir, { recursive: true });
  writeFile(file, text.replace(/\r\n/g, '\n').replace(/\n*$/, '\n'));
  return file;
}
const clock = (t) => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');

module.exports = { ROOT, PRESETS, arg, flag, readJson, rel, mulberry32, noteName, hz, PLAYERS, impulses, spread, zoneMaker, writeScore, writePresets, planLines, sendPlan, dealCards, writeSheet, clock };
