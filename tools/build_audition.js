#!/usr/bin/env node
// build_audition.js — THE AUDITION SCORE (his word 2026-10-05, RUNNING_LOG §125): every preset of bank/presets.json ONCE, in the file's
// order, each on a DIFFERENT captured impulse, one return brick after another on the impulse's own lane — the whole set heard in a
// row. Every variant is the RING version (--env tail) unless told otherwise. The score is a NEW file (it refuses to write over one);
// the plan is then sent to the engine with render 1, so the variants are made from the bank before he plays (the same message the
// page sends; electronics/sc/process.scd header, /le/plan).
//   node tools/build_audition.js [--name audition-30] [--gap 2.5] [--env tail] [--effect comb] [--no-render] [--port 5500]
// --effect <name> (§142): only the presets of that effect; each brick's label is then the preset's KEY (comb2 …), not its row number.
// THE SORTING: this tool knows the piece (its scores, its bank, its presets) — it is the piece's, not the engine's.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const NAME = arg('name', 'audition-30'), GAP = +arg('gap', 2.5), ENV = arg('env', 'tail'), PORT = +arg('port', 5500), RENDER = !process.argv.includes('--no-render'), EFFECT = arg('effect', '');
const FILE = path.join(ROOT, 'scores', NAME + '.json');
if (fs.existsSync(FILE)) { console.error(path.relative(ROOT, FILE) + ' exists — this tool never writes over a score; another --name, or delete it yourself'); process.exit(3); }

const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'presets.json'), 'utf8'));
if (!P.envelopes[ENV]) { console.error('no envelope "' + ENV + '" — one of ' + Object.keys(P.envelopes).join(' · ')); process.exit(2); }
const INDEX = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'samples', 'index.json'), 'utf8')).samples || [];
const byName = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });
// the captured impulses, by impulse number then player — so neighbours differ in player AND in impulse
const impulses = INDEX.filter((r) => r.kind !== 'processed' && /-impulse-\d+$/.test(r.name))
  .sort((a, b) => byName(a.name.replace(/.*-impulse-/, ''), b.name.replace(/.*-impulse-/, '')) || byName(a.player, b.player));
if (!impulses.length) { console.error('no captured impulses in the bank'); process.exit(4); }
// the skeleton: the workshop score's frame (tracks · layout · viewport), empty of objects
const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', 'workshop-bfl-slap.json'), 'utf8'));
let nextId = 1;
const zone = (layer, start, end, elec) => ({
  id: 'zn-' + (nextId++), type: 'zone', layer, startTime: Math.round(start * 1000) / 1000, endTime: Math.round(end * 1000) / 1000, player: '', instrument: '', zoneFunction: 'elec', midiModel: 'elecPlay',
  ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
  responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color: '#8E24AA', opacity: 0.35, yOffset: 1, zoneHeight: 0.2,
  performanceNotes: '', properties: {}, elec,
});
const objects = [], rows = [];
const DEALT = P.presets.filter((p) => p.deal !== false);   // the presets of the dealing — an audition's own (`deal: false`, RUNNING_LOG §151) have their own scores
const LIST = EFFECT ? DEALT.filter((p) => p.effect === EFFECT) : DEALT;
if (!LIST.length) { console.error('no preset of effect "' + EFFECT + '" in bank/presets.json — the effects: ' + [...new Set(P.presets.map((p) => p.effect))].join(' · ')); process.exit(2); }
LIST.forEach((p, i) => {
  const smp = impulses[i % impulses.length], t = 1 + i * GAP;
  const z = zone(smp.lane >= 0 ? smp.lane : 0, t, t + 0.5, { name: smp.name, label: EFFECT ? p.key : String(i + 1), variants: { [smp.name]: p.key + '-' + ENV } });   // the brick's number = the preset's place in the file; filtered by effect, its key
  objects.push(z);
  rows.push({ i: i + 1, t, lane: smp.lane, sample: smp.name, variant: p.key + '-' + ENV, name: p.name });
});
const save = Object.assign({}, base, { objects, markers: [], nextId, metadata: {
  created: new Date().toISOString(), modified: new Date().toISOString(),
  note: 'THE AUDITION (RUNNING_LOG §125): the ' + LIST.length + (EFFECT ? ' ' + EFFECT : '') + ' presets of bank/presets.json, one return each, in the file\'s order, every ' + GAP + ' s from 1 s, each on a different captured impulse, as its ' + ENV + ' version. Written by tools/build_audition.js; the engine renders the variants from the bank when the plan is sent (the tool sends it; a return brick\'s "render all planned" sends it again). His from then on.',
} });
fs.writeFileSync(FILE, JSON.stringify(save, null, 1) + '\n');
rows.forEach((r) => console.log(String(r.i).padStart(3) + '  ' + r.t.toFixed(1).padStart(6) + ' s  lane ' + r.lane + '  ' + r.sample.padEnd(16) + '→ ' + r.variant.padEnd(20) + r.name));
console.log(path.relative(ROOT, FILE) + ' written — ' + objects.length + ' return bricks over ' + (1 + objects.length * GAP).toFixed(0) + ' s. Open it in the page: File ▾ → Experiments → ' + NAME + '.');

// THE PLAN to the engine (as tools/deal_variants.js --render does): base;suffix;effect;end;atkMs;durX;match;t;capMs;args per variant, parts of six
if (RENDER) {
  const draw = (v) => (Array.isArray(v) && v.length === 2 ? Math.round((Math.min(+v[0], +v[1]) + Math.random() * Math.abs(+v[1] - +v[0])) * 100) / 100 : +v);
  const lines = objects.map((z) => {
    const name = z.elec.name, v = z.elec.variants[name], i = v.lastIndexOf('-'), key = v.slice(0, i), env = v.slice(i + 1), p = P.presets.find((x) => x.key === key), E = P.envelopes[env], cls = (P.classes || {})[p.class] || {};
    const args = Object.keys(p.args || {}).filter((k) => /^[A-Za-z][A-Za-z0-9]*$/.test(k)).map((k) => { const x = draw(p.args[k]); return Number.isFinite(x) ? k + ':' + x : null; }).filter(Boolean).join(',');
    return [name, v, String(p.effect || '').replace(/[^A-Za-z0-9 _+-]/g, '').slice(0, 40), env === 'tail' ? 'tail' : env, +E.atkMs || 0, +(p.durX || cls.durX || 1), p.match === 0 ? 0 : 1, z.startTime, env === 'tail' ? Math.round(draw(p.capMs || E.capMs || 4000)) : 0, args].join(';');
  });
  const per = 6, n = Math.max(1, Math.ceil(lines.length / per)), stamp = 'a' + Date.now().toString(36);
  (async () => {
    for (let i = 0; i < n; i++) {
      const body = JSON.stringify({ kind: 'plan', data: { stamp, part: i + 1, of: n, rows: lines.slice(i * per, (i + 1) * per).join('|'), render: 1 } });
      const r = await fetch('http://localhost:' + PORT + '/api/elec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).then((x) => x.json()).catch((e) => ({ ok: false, error: e.message }));
      if (!r || !r.ok) { console.error('the plan did NOT reach the score server on ' + PORT + ': ' + ((r && r.error) || 'no answer')); process.exit(5); }
    }
    console.log('the plan sent to the engine — ' + lines.length + ' variants, render 1: the engine makes them from the bank now (an engine started before this build hears nothing).');
  })();
}
