#!/usr/bin/env node
// tools/cello_hills.js — THE HILLS: a smooth rolling curve on the cello lane that follows the LOUDNESS TRAJECTORY of the material brick
// sounding under it (SW-38, 2026-11-10: "a smooth rolling curve, peaks and valleys that more or less follows the trajectory of the petals
// clip … these will become like two-string travel curves … think about it in terms of swells of tremolo").
//
//   node tools/cello_hills.js --save piece-Section03-w_cello --from 275 --to 465 [--out <name>] [--lane 7] [--elec 8]
//                             [--pitches 50,57] [--technique trem_vel] [--lo p --hi f] [--window 1 --smooth 9 --gap 6]
//
// HOW: the brick on the electronics lane (--elec, Elec 1 = layer 8) that covers the window is found in the save; its file (bank/materials.json
// → the fund on H:) is read over the brick's stretch; a 1 s RMS envelope, smoothed over --smooth seconds; its local peaks and valleys at least
// --gap seconds apart become the curve's nodes, the ends included. The envelope's quietest point is written --lo, its loudest --hi, the rest
// in between — by the DYNAMICS LAW (Rules 1 · 2): a SHAPED note, struck at mf for its pitch (velAbs), the fader between the two written
// dynamics (cc7Abs), every node on its own table value (y = 10 · height). One shaped note per pitch in --pitches, identical shapes: the
// two strings of the tremolo. Written to a NEW save beside his (never his own file), nextId carried on. Nothing sounds here.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DynTable = require(path.join(ROOT, 'score', 'public', 'dyn_table.js')), TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const args = process.argv.slice(2), arg = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000;

const SAVE = arg('save', 'piece-Section03-w_cello').replace(/\.json$/, ''), OUT = arg('out', SAVE + '-hills-01');
const FROM = +arg('from', 275), TO = +arg('to', 465), LANE = +arg('lane', 7), ELEC = +arg('elec', 8);
const PITCHES = String(arg('pitches', '50,57')).split(',').map(Number), TECH = arg('technique', 'trem_vel');
const LO = MARKS.indexOf(arg('lo', 'p')), HI = MARKS.indexOf(arg('hi', 'f')), INST = arg('inst', 'cello');
const WIN = +arg('window', 1), SMOOTH = +arg('smooth', 9), GAP = +arg('gap', 6);
if (LO < 0 || HI < 0 || HI <= LO) throw new Error('--lo and --hi must be dynamics, lo under hi');

const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', SAVE + '.json'), 'utf8'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
const materials = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'materials.json'), 'utf8'));
const fundRoot = (materials.root || 'H:/switch_2026/audio/set-2025-04-08c/keep').replace(/\\/g, '/');

// 1. the brick under the window
const brick = save.objects.find((o) => o.type === 'zone' && o.midiModel === 'elecMaterial' && o.layer === ELEC && o.startTime <= FROM + 1 && o.endTime >= TO - 15)
    || save.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecMaterial' && o.layer === ELEC).sort((a, b) => (Math.min(b.endTime, TO) - Math.max(b.startTime, FROM)) - (Math.min(a.endTime, TO) - Math.max(a.startTime, FROM)))[0];
if (!brick) throw new Error('no material brick on layer ' + ELEC + ' under ' + FROM + ' … ' + TO);
const row = materials.materials.find((m) => m.name === brick.elec.name);
if (!row) throw new Error('the brick\'s material is not in the index: ' + brick.elec.name);
const file = /^[A-Za-z]:\//.test(row.file) ? row.file : fundRoot + '/' + row.file;
console.log('the brick', brick.id, brick.startTime + ' … ' + brick.endTime + ' s', brick.elec.name, '→', file);

// 2. the envelope over the window (the file's time = score time − brick start + offset)
const wav = readWav(file);
const fileAt = (t) => (t - brick.startTime) + (brick.elec.offsetMs || 0) / 1000;
const n = Math.floor((TO - FROM) / WIN), env = [];
for (let i = 0; i < n; i++) {
    const a = Math.round(fileAt(FROM + i * WIN) * wav.sr), b = Math.min(wav.frames, Math.round(fileAt(FROM + (i + 1) * WIN) * wav.sr));
    let s = 0, c = 0; for (let j = Math.max(0, a); j < b; j++) { let v = 0; for (let ch = 0; ch < wav.channels; ch++) v += wav.data[j * wav.channels + ch]; v /= wav.channels; s += v * v; c++; }
    env.push(c ? 10 * Math.log10(s / c + 1e-12) : -120);
}
const k = Math.max(1, Math.round(SMOOTH / WIN)), sm = env.map((_, i) => { let s = 0, c = 0; for (let j = i - Math.floor(k / 2); j <= i + Math.floor(k / 2); j++) if (j >= 0 && j < env.length) { s += env[j]; c++; } return s / c; });
// 3. the nodes: local extrema at least GAP apart, the ends included
const floor = Math.max(...sm) - 40;                         // the ring's tail: nothing under 40 dB below the top counts as a hill
const ext = [0];
for (let i = 1; i < sm.length - 1; i++) {
    const isMax = sm[i] >= sm[i - 1] && sm[i] >= sm[i + 1], isMin = sm[i] <= sm[i - 1] && sm[i] <= sm[i + 1];
    if ((isMax || isMin) && (i - ext[ext.length - 1]) * WIN >= GAP) ext.push(i);
}
if ((sm.length - 1 - ext[ext.length - 1]) * WIN < GAP) ext.pop();
ext.push(sm.length - 1);
// the written range is spread over the hills themselves: the bottom is the quietest node BEFORE the end (the ring's dying tail at the
// last node would otherwise squeeze every valley up to mf); the tail lands on --lo
const inner = ext.slice(0, -1);
const top = Math.max(...sm), bottom = Math.max(floor, Math.min(...inner.map((i) => sm[i])));
const levelAt = (db) => LO + (HI - LO) * Math.max(0, Math.min(1, (db - bottom) / (top - bottom)));   // a mark, fractional
const nodes = ext.map((i) => ({ pos: r3(i / (sm.length - 1)), level: levelAt(sm[i]), db: r2(sm[i]), t: r2(FROM + i * WIN) }));
const lo = LO / 7, hi = HI / 7;
console.log('envelope', n, 's ·', ext.length, 'nodes · top', r2(top), 'dB · bottom', r2(bottom), 'dB · written', MARKS[LO], '…', MARKS[HI]);
console.log(nodes.map((d) => d.t + 's ' + d.db + 'dB → ' + MARKS[Math.round(d.level)]).join(' | '));

// 4. the shaped notes
let nextId = save.nextId || 1;
const made = PITCHES.map((pitch) => {
    const o = { id: 'wc-' + (nextId++), type: 'waveCurve', layer: LANE, startSeconds: FROM, endSeconds: TO,
        nodes: nodes.map((d) => ({ pos: d.pos, y: Math.max(0.05, r2(10 * DynTable.height(REMAP, INST, d.level / 7, lo, hi))), smooth: 0.25 })),
        segments: nodes.slice(1).map(() => ({ model: 'bezier', slope: 0 })),
        color: '#8E6BB0', fillMode: 'bottom', opacity: 0.55,
        performanceNotes: 'HILLS · ' + TECH + ' · ' + MARKS[LO] + ' … ' + MARKS[HI] + ' · the shape of ' + brick.elec.name + ' (SW-38)',
        properties: { hills: { source: brick.elec.name, brick: brick.id, windowS: WIN, smoothS: SMOOTH, gapS: GAP, topDb: r2(top), bottomDb: r2(bottom), nodes: nodes.map((d) => [d.t, d.db, r2(d.level)]), tool: 'tools/cello_hills.js' } },
        sonifyNote: pitch, technique: TECH, velAbs: TextureDyn.mfVel(REMAP, INST, pitch), cc7Abs: DynTable.range(REMAP, INST, lo, hi) };
    return o;
});
save.objects.push(...made);
save.objects.push({ id: 'mk-' + (nextId++), type: 'marker', layer: 0, time: FROM, label: 'HILLS', color: '#8E6BB0', groupId: 'hills', performanceNotes: 'the cello hills, ' + FROM + ' … ' + TO + ' s, from ' + brick.elec.name, properties: { hills: true, end: TO } });
save.nextId = nextId;
save.metadata = Object.assign({}, save.metadata, { modified: new Date().toISOString(), derivedFrom: SAVE, tool: 'tools/cello_hills.js' });
const outFile = path.join(ROOT, 'scores', OUT + '.json');
if (fs.existsSync(outFile) && !args.includes('--replace')) throw new Error(outFile + ' exists — --replace to rewrite it');
fs.writeFileSync(outFile, JSON.stringify(save, null, 1));
console.log('wrote scores/' + OUT + '.json —', made.length, 'shaped notes on lane', LANE, '(' + PITCHES.join(', ') + ')', 'velAbs', made.map((o) => o.velAbs).join('/'), 'cc7', made[0].cc7Abs.lo + ' … ' + made[0].cc7Abs.hi);

// a WAV reader: PCM 16 / 24 / 32 and float, interleaved, as the index tool reads headers
function readWav(f) {
    const b = fs.readFileSync(f);
    if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE') throw new Error('not a WAV: ' + f);
    let pos = 12, channels = 0, sr = 0, bits = 0, fmt = 1, dataOff = 0, dataLen = 0;
    while (pos + 8 <= b.length) {
        const id = b.toString('ascii', pos, pos + 4), len = b.readUInt32LE(pos + 4);
        if (id === 'fmt ') { fmt = b.readUInt16LE(pos + 8); channels = b.readUInt16LE(pos + 10); sr = b.readUInt32LE(pos + 12); bits = b.readUInt16LE(pos + 22); if (fmt === 0xFFFE && len >= 26) fmt = b.readUInt16LE(pos + 32); }
        if (id === 'data') { dataOff = pos + 8; dataLen = Math.min(len, b.length - dataOff); break; }
        pos += 8 + len + (len & 1);
    }
    const bytes = bits / 8, frames = Math.floor(dataLen / (bytes * channels)), data = new Float32Array(frames * channels);
    for (let i = 0; i < frames * channels; i++) {
        const p = dataOff + i * bytes;
        if (fmt === 3) data[i] = bits === 32 ? b.readFloatLE(p) : b.readDoubleLE(p);
        else if (bits === 16) data[i] = b.readInt16LE(p) / 32768;
        else if (bits === 24) data[i] = ((b[p] | (b[p + 1] << 8) | (b[p + 2] << 16)) << 8 >> 8) / 8388608;
        else data[i] = b.readInt32LE(p) / 2147483648;
    }
    return { sr, channels, frames, data };
}
