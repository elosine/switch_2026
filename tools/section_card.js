#!/usr/bin/env node
// section_card.js — THE SECTION'S OWN LOUDNESS CARD (his word 2026-11-10, RUNNING_LOG §152: "an analysis of each of the notes that we have now in
// this save file … whichever notes are p should all sound p together … I want the ff bass drum notes to come out at the same LUFS as the
// flutter tongue flute"). The timetable for the card's recorder (probes/card_run.ps1 → probes/analyze_card.py — K-weighted loudness off a
// recording of the REC track, the lineage's measure, not the peak meter): every voice (lane, technique) the save plays in the window, at its
// own three pitches, at the three WRITTEN dynamics the save uses (p 83 · mf 100 · fff 127), plus each lane's ordinary as the reference.
// The label of every note is the voice's key, so the card's rows match the notes by it.
//
//   node tools/section_card.js --score <save> --from 200 --to 253 [--vels 83,100,127] [--out probes/section_card.json]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const die = (m) => { console.error(m); process.exit(2); };
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const name = arg('score') || die('--score'), from = +arg('from', 0), to = +arg('to', 1e9);
const VELS = String(arg('vels', '83,100,127')).split(',').map(Number);
const OUT = path.join(ROOT, arg('out', 'probes/section_card.json'));
const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', name + '.json'), 'utf8'));
const LEAD_IN = 3000, PRE = 300, HOLD = 1000, TAIL = 1100, STRUCK_HOLD = 200, STRUCK_TAIL = 1400, VOICE_GAP = 400;
const notes = []; let t = LEAD_IN;
const push = (o, hold, tail) => { notes.push(Object.assign({ i: notes.length, tPreMs: t - PRE, tOnMs: t, tOffMs: t + hold }, o)); t += hold + tail; };
const voices = [];
for (let lane = 0; lane < TRACKS.length; lane++) {
    const tr = TRACKS[lane]; if (tr.elec) continue;
    const inst = INSTRUMENTS[tr.instKey]; if (!inst) continue;
    const laneNotes = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.layer === lane && o.startSeconds >= from && o.startSeconds <= to);
    if (!laneNotes.length) continue;
    const byTech = {}; for (const n of laneNotes) (byTech[n.technique] = byTech[n.technique] || []).push(n);
    let ordKey = inst.ordinary; { const oq = inst.techniques.find((q) => q.key === ordKey); if (!oq || /placeholder/i.test(oq.label || '')) ordKey = null; }
    if (ordKey && !byTech[ordKey]) byTech[ordKey] = [];
    for (const techKey of Object.keys(byTech)) {
        const q = inst.techniques.find((x) => x.key === techKey); if (!q) { console.error('no technique ' + techKey + ' on ' + tr.instKey); continue; }
        const own = byTech[techKey].length ? byTech[techKey] : laneNotes;
        const ps = [...new Set(own.map((n) => n.sonifyNote))].sort((a, b) => a - b);
        let pitches;
        if (q.keys && typeof q.keys === 'object') pitches = ps.length <= 3 ? ps : [ps[0], ps[Math.floor(ps.length / 2)], ps[ps.length - 1]];
        else { const lo = Math.max(q.rangeLow != null ? q.rangeLow : inst.rangeLow, ps[0]), hi = Math.min(q.rangeHigh != null ? q.rangeHigh : inst.rangeHigh, ps[ps.length - 1]); pitches = [...new Set([lo, Math.round((lo + hi) / 2), hi])]; }
        const port = q.port || inst.port, ch = q.channel || 1, perc = port === 'SWPerc';
        const struck = perc || tr.instKey === 'bowed_vibraphone' || tr.instKey === 'piano' || /pizz|bartok|gettato|col_legno|slap|staccato|tongue_ram|key_click/.test(techKey);
        voices.push({ key: tr.instKey + ':' + techKey, lane, instKey: tr.instKey, tech: techKey, ordinary: techKey === ordKey, notes: byTech[techKey].length, port, ch, pitches, struck });
        t += VOICE_GAP;
        for (const pitch of pitches) for (const vel of VELS) push({ role: struck ? 'perc' : 'card', inst: tr.instKey, label: tr.instKey + ':' + techKey, tech: techKey, techLabel: q.label || techKey, port, ch, cc0: q.cc0 != null ? q.cc0 : null, ks: null, cc7: perc ? null : 127, pitch, vel, ordinary: techKey === ordKey }, struck ? STRUCK_HOLD : HOLD, struck ? STRUCK_TAIL : TAIL);
    }
}
const out = { generatedAt: new Date().toISOString(), what: 'THE SECTION CARD (tools/section_card.js): every voice of ' + name + ' in ' + from + ' … ' + to + ' s at its own pitches and the written dynamics ' + VELS.join('/') + '; each lane\'s ordinary as the reference; label = the voice key', score: name, from, to, vels: VELS, voices, notes, totalMs: t + 1500 };
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(voices.length + ' voices (' + voices.filter((v) => v.ordinary).length + ' ordinaries) · ' + notes.length + ' notes · ' + Math.round(out.totalMs / 1000) + ' s · written: ' + path.relative(ROOT, OUT));
for (const v of voices) console.log('  ' + v.key.padEnd(40) + v.port.padEnd(11) + 'ch' + String(v.ch).padEnd(3) + 'pitches ' + v.pitches.join(' ') + (v.struck ? '  struck' : '') + (v.ordinary ? '  ORDINARY' : '  ' + v.notes + ' notes'));
