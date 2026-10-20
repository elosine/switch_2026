#!/usr/bin/env node
// drone_fade.js — THE LONG FADE-OUT ON A TRACK'S LAST DRONE, IN A PIECE SCORE (RUNNING_LOG §284; DEC-76). His words, after cutting the end
// of the drone passage in piece-sec03-a2: *"could you please put the long fades on the last thing in each track if it's a drone?"*
// The drone section's own rule (bank/drone_section.json drone.lastFadeOutS, DEC-56) gives the LAST drone of each part an 11 s fade — but
// a cut made by hand in the piece leaves other drones last. A drone's fade is its PRESET's (a `shape` ending: atkMs · durMs · relMs), and
// the section's presets `dn…` are shared with the section's own score and the piece before the cut — so this tool makes a COPY of the
// preset with the long fall (key `dl<nn>`, audition `piece-drones`) and points the brick at it. Nothing else of the drone changes: the
// same source, the same stretch, the same length.
//
//   node tools/drone_fade.js --score piece-sec03-a2 [--fade 11] [--dry] [--render]
//     per lane: the LAST-ENDING object; if it is a drone brick (a return with a `dn…`/`dl…` shaped variant) its fall becomes --fade
//     seconds — never more than the drone holds after its rise and one second at level (a drone of 11.4 s with a 1.6 s rise: 8.8 s).
//     A lane whose last object is a note, or that has no drone, is left and said.
//     --render   the plan for the changed bricks is sent to the engine through the score server (render 1): made from the bank as it
//                is, so the new fades are there before his next pass. Without it: "render all planned" in a brick's panel, or a pass.
// THE PAGE reads bank/presets.json only at F5: after this tool, F5 (not only Reload). The base is the NEWER of the save and the
// page's working copy (his unsaved edits kept); the result is written as the save. THE SORTING: the piece's.
'use strict';
const fs = require('fs'), path = require('path');
const K = require('./audition_kit.js');
const ROOT = K.ROOT, TAG = 'piece-drones';
const name = K.arg('score'); if (!name) { console.error('--score <name>'); process.exit(2); }
const FADE = +K.arg('fade', 11), DRY = process.argv.includes('--dry'), RENDER = process.argv.includes('--render');
const file = path.join(ROOT, 'scores', name + '.json'), work = path.join(ROOT, 'scores', name + '-work.json');
if (!fs.existsSync(file)) { console.error('no such score: scores/' + name + '.json'); process.exit(2); }
const useWork = fs.existsSync(work) && fs.statSync(work).mtimeMs > fs.statSync(file).mtimeMs;
const s = JSON.parse(fs.readFileSync(useWork ? work : file, 'utf8')), P = K.readJson(K.PRESETS);
const st = (o) => (o.startTime != null ? o.startTime : o.startSeconds), en = (o) => (o.endTime != null ? o.endTime : o.endSeconds);
const r2 = (x) => Math.round(x * 100) / 100;
const droneKey = (z) => { if (!(z && z.type === 'zone' && z.midiModel === 'elecPlay' && z.elec && z.elec.variants)) return null; const v = z.elec.variants[z.elec.name], m = /^(d[nl]\d+)-shape$/.exec(typeof v === 'string' ? v : ''); return m ? m[1] : null; };
console.log(useWork ? '(the base: HIS working copy — unsaved edits kept)' : '(the base: the save)');
const rows = P.presets.filter((p) => p.audition === TAG).map((p) => { const q = Object.assign({}, p); delete q.deal; delete q.audition; return q; }), changed = [];
const lanes = [...new Set(s.objects.filter((o) => st(o) != null && o.layer >= 0 && o.layer <= 5).map((o) => o.layer))].sort((a, b) => a - b);
for (const lane of lanes) {
    const all = s.objects.filter((o) => o.layer === lane && st(o) != null), label = ((s.tracks || [])[lane] || {}).label || 'lane ' + lane;
    const last = all.slice().sort((a, b) => en(b) - en(a))[0], key = droneKey(last);
    const lastDrone = all.filter((o) => droneKey(o)).sort((a, b) => en(b) - en(a))[0];
    if (!key) { console.log(label + ': the last thing is ' + (last.type === 'zone' ? 'a brick (' + (last.midiModel || 'zone') + ')' : 'a NOTE') + ' ending ' + r2(en(last)) + ' s — not a drone: LEFT' + (lastDrone ? ' (its last drone ends ' + r2(en(lastDrone)) + ' s)' : ' (no drone on this lane)')); continue; }
    const src = P.presets.find((p) => p.key === key); if (!src) { console.log(label + ': the preset ' + key + ' is not in bank/presets.json — LEFT'); continue; }
    const len = (+src.durMs || Math.round((en(last) - st(last)) * 1000)) / 1000, fall = r2(Math.max(0.5, Math.min(FADE, len - (+src.atkMs || 0) / 1000 - 1)));
    const nk = 'dl' + key.replace(/^d[nl]/, ''), row = Object.assign({}, src, { key: nk, name: String(src.name || key).replace(/ · LONG OUT.*$/, '') + ' · LONG OUT ' + fall + ' s (the piece\'s last drone on its track)', relMs: Math.round(fall * 1000) });
    delete row.deal; delete row.audition;
    const at = rows.findIndex((x) => x.key === nk); if (at >= 0) rows[at] = row; else rows.push(row);
    last.elec = Object.assign({}, last.elec, { variants: { [last.elec.name]: nk + '-shape' }, label: String(last.elec.label || '').replace(/ · out [\d.]+ s$/, '') + ' · out ' + fall + ' s' });
    if (last.properties && last.properties.drone) last.properties.drone = Object.assign({}, last.properties.drone, { last: true, key: nk, fadeOutS: fall });
    changed.push(last);
    console.log(label + ': ' + last.id + ' ' + last.elec.name + ' ' + r2(st(last)) + ' → ' + r2(en(last)) + ' s (' + r2(len) + ' s) · the fall ' + r2((+src.relMs || 0) / 1000) + ' → ' + fall + ' s' + (fall < FADE ? ' (all the drone holds after its ' + r2((+src.atkMs || 0) / 1000) + ' s rise)' : '') + ' · preset ' + key + ' → ' + nk);
}
if (!changed.length) { console.log('nothing to change'); process.exit(0); }
if (DRY) { console.log('(dry: nothing written)'); process.exit(0); }
const P2 = K.writePresets(TAG, rows, 'the piece\'s last drone on each track with a long fade-out — copies of the drone section\'s presets (tools/drone_fade.js)', 'node tools/drone_fade.js --score ' + name + ' --fade ' + FADE);
s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json — ' + changed.length + ' bricks · F5 in the page (it reads the presets only then)');
if (RENDER) K.sendPlan(K.planLines(changed, P2), 5500);
