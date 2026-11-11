#!/usr/bin/env node
// thin_pitch.js — A PITCH THAT RECURS TOO OFTEN ON A LANE, THINNED FROM ITS OWN HARMONY (his asks 2026-11-10, RUNNING_LOG §153 · §154: "a lot of
// G-sharp … swap some of those out — look up the harmony it's meant to be in, the full strike it comes from, and replace it with another note
// from that harmony"; then "around 212 in the clarinet a lot of F6 … replace a few of them, keep the same articulation, a different pitch from
// that pitch set"). Every Nth occurrence (--every 2: every second one, in time order) of the pitch on the lane takes another pitch of the
// harmony its note belongs to — the take named under properties.harmony (the harmony roll's), its FULL voice set across all lanes
// (bank/panel_snapshots.json), the candidate nearest to the original that is not the same pitch class, folded into the technique's range.
// The articulation, the dynamic and the level (velAbs · cc7Plain) stay. The old pitch under properties.thin.was; --undo restores.
//
//   node tools/thin_pitch.js --score <save> --lane clarinet --pitch 89 [--every 2] [--from 200 --to 253] [--undo] [--dry]
//   --pitch takes a MIDI number (89) or a name (F6); --class G# thins a whole pitch class at every octave
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const N = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], pn = (m) => N[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const parsePitch = (x) => { if (/^\d+$/.test(x)) return +x; const m = /^([A-Ga-g])(#|b)?(-?\d+)$/.exec(x); if (!m) die('pitch? ' + x); let pc = N.indexOf(m[1].toUpperCase() + (m[2] === '#' ? '#' : '')); if (m[2] === 'b') pc = (pc + 11) % 12; return pc + 12 * (+m[3] + 1); };
const INST = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const takes = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels.strikes;
const name = arg('score') || die('--score'), laneId = arg('lane') || die('--lane'), EVERY = +arg('every', 2), from = +arg('from', 0), to = +arg('to', 1e9);
const L = TRACKS.findIndex((t) => t.id === laneId); if (L < 0) die('no lane ' + laneId);
const inst = INST[TRACKS[L].instKey];
const file = path.join(ROOT, 'scores', name + '.json'); const s = JSON.parse(fs.readFileSync(file, 'utf8'));
const notes = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.layer === L && o.startSeconds >= from && o.startSeconds <= to).sort((a, b) => a.startSeconds - b.startSeconds);
if (has('undo')) { let n = 0; for (const o of notes) if (o.properties && o.properties.thin) { o.sonifyNote = o.properties.thin.was; delete o.properties.thin; n++; } console.log(n + ' restored'); if (!has('dry')) fs.writeFileSync(file, JSON.stringify(s)); process.exit(0); }
const pitch = arg('pitch') ? parsePitch(arg('pitch')) : null, cls = arg('class') ? parsePitch(arg('class') + '4') % 12 : null;
if (pitch == null && cls == null) die('--pitch or --class');
const hits = notes.filter((o) => pitch != null ? o.sonifyNote === pitch : o.sonifyNote % 12 === cls);
const avoidPc = pitch != null ? pitch % 12 : cls;
let k = 0; const done = [];
for (const o of hits) {
    k++; if (k % EVERY !== 0) continue;
    const take = o.properties && o.properties.harmony && takes[o.properties.harmony.take]; if (!take) { console.log('  ' + o.startSeconds.toFixed(2) + ': no harmony take — kept'); continue; }
    const q = inst.techniques.find((x) => x.key === o.technique) || {}; const lo = q.rangeLow != null ? q.rangeLow : inst.rangeLow, hi = q.rangeHigh != null ? q.rangeHigh : inst.rangeHigh;
    const pcs = [...new Set(take.state.voices.filter((v) => v.pitch != null).map((v) => v.pitch % 12))].filter((pc) => pc !== avoidPc);
    const cands = []; for (const pc of pcs) for (let m = pc; m <= 127; m += 12) if (m >= lo && m <= hi) cands.push(m);
    if (!cands.length) { console.log('  ' + o.startSeconds.toFixed(2) + ': the take offers nothing else in ' + lo + '–' + hi + ' — kept'); continue; }
    const was = o.sonifyNote, pick = cands.reduce((b, m) => Math.abs(m - was) < Math.abs(b - was) || (Math.abs(m - was) === Math.abs(b - was) && m < b) ? m : b, cands[0]);
    o.sonifyNote = pick; o.properties.thin = { was, take: o.properties.harmony.take }; done.push(o.startSeconds.toFixed(2) + ' ' + pn(was) + '→' + pn(pick) + ' (' + o.properties.harmony.take.replace('SW-ctpt-', 'take ') + ', ' + o.technique + ')');
}
console.log(laneId + ' ' + (pitch != null ? pn(pitch) : N[cls] + ' (every octave)') + ': ' + hits.length + ' found · ' + done.length + ' swapped' + (done.length ? ': ' + done.join(', ') : ''));
if (has('dry')) { console.log('(dry)'); process.exit(0); }
s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString(); fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json · File ▾ → Open it again');
