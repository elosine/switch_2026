#!/usr/bin/env node
// section_gains.js — THE VOLUME KNOB PER ARTICULATION (his word 2026-11-10, RUNNING_LOG §148: "volume knob, but a different solution for the
// Spitfire … the rute sits on its own track and we up the level at the track"). Reads a section's measurement (bank/section_levels/<score>.json,
// with the lanes' ORDINARY voices in it — section_level.js --measure) and, for every articulation voice, the dB it sits from its lane's
// ordinary over the velocities the section actually writes; then APPLIES that difference where a knob exists:
//   · a UVI voice (an SI2 or PP2 part)      → the PART's GAIN, as text (tools/uvi_part_gain.js --rel); the velocities stay his
//   · a Spitfire voice (an ARO track)       → the TRACK: the fader up to +12 dB, the rest in a "JS: Volume Adjustment" FX (the lineage's
//                                             apply_trims rule) — one gain per track, the mean of its voices
//   · a Kontakt voice (violin, glock, piano) → no knob per articulation (one slot holds every preset): left to section_level.js --apply,
//                                             which maps the velocity against the same ordinary
// After the gains: section_level.js --measure again (the curves are now real), then --apply (the fine map). Nothing saved in Reaper: his CTRL+S.
//
//   node tools/section_gains.js --score <save> [--dry] [--max-fader 12]
//   → bank/section_levels/<score>.gains.json (the plan and what was applied)
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const r1 = (x) => Math.round(x * 10) / 10;
const name = arg('score') || die('--score'), MAXF = +arg('max-fader', 12);
const levelsFile = path.join(ROOT, 'bank', 'section_levels', name + '.json'); if (!fs.existsSync(levelsFile)) die('no measurement: section_level.js --measure first');
const M = JSON.parse(fs.readFileSync(levelsFile, 'utf8'));
const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', name + '.json'), 'utf8'));
const interp = (pts, x) => { if (x <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const a = pts[i - 1], b = pts[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / Math.max(1e-9, b[0] - a[0]); } return pts[pts.length - 1][1]; };
const monotone = (p) => { for (let i = 1; i < p.length; i++) if (p[i][1] < p[i - 1][1]) p[i][1] = p[i - 1][1]; return p; };
const INST = require('vm').runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const realOrd = (instKey) => { const I = INST[instKey] || {}; const q = (I.techniques || []).find((t) => t.key === I.ordinary); return (q && !/placeholder/i.test(q.label || '')) ? I.ordinary : null; };   // the percussion's `main` is a placeholder, not an ordinary (§149)
const live = Object.entries(M.lanes).filter(([, m]) => m.curve[m.curve.length - 1][1] > -60);
const ords = live.filter(([, m]) => m.ordinary && realOrd(m.instKey));   // a placeholder ordinary (the percussion) is not one if (!ords.length) die('the measurement has no ordinary voices — measure without --no-ordinary');
const meanOrd = monotone(M.vels.map((v) => [v, r1(ords.reduce((a, [, m]) => a + interp(m.curve, v), 0) / ords.length)]));
const ordOf = (m) => { const k = realOrd(m.instKey), o = k ? M.lanes[m.instKey + ':' + k] : null; return (o && o.ordinary && o.curve[o.curve.length - 1][1] > -60) ? o.curve : meanOrd; };
// the written velocities each voice plays in the section (its notes' recVel)
const written = {};
for (const o of save.objects) { if (o.type !== 'waveCurve' || o.sonifyNote == null || o.startSeconds < M.from || o.startSeconds > M.to) continue; const k = Object.keys(M.lanes).find((key) => M.lanes[key].lane === o.layer && M.lanes[key].technique === o.technique); if (!k) continue; (written[k] = written[k] || []).push(o.recVel != null ? o.recVel : 100); }
const rows = [];
for (const [key, m] of live) {
    if (m.ordinary) continue;
    const vs = written[key] || []; if (!vs.length) continue;
    const T = ordOf(m), gaps = vs.map((v) => interp(T, v) - interp(m.curve, v));
    const gain = r1(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    const kind = /^SW(Flute|Fluteb|Clar|Sax|Saxb)$/.test(m.port) || /PP2$/.test(m.track) ? 'uvi-part' : m.port === 'SWPerc' ? 'aro-track' : 'velocity';
    rows.push({ voice: key, track: m.track, port: m.port, channel: m.channel, notes: vs.length, gainDb: gain, spreadDb: r1(Math.max(...gaps) - Math.min(...gaps)), kind });
}
rows.sort((a, b) => a.kind.localeCompare(b.kind) || a.voice.localeCompare(b.voice));
console.log('voice'.padEnd(44) + 'track'.padEnd(22) + 'notes  gain dB  spread  how');
for (const r of rows) console.log(r.voice.padEnd(44) + r.track.padEnd(22) + String(r.notes).padStart(5) + String(r.gainDb).padStart(9) + String(r.spreadDb).padStart(8) + '  ' + r.kind);
const out = { score: name, when: new Date().toISOString(), what: 'per articulation voice: the mean dB from its lane\'s ordinary over the section\'s written velocities; applied as a UVI part gain or an ARO track trim; Kontakt voices left to section_level.js --apply', rows, applied: [] };
// ONE VOICE, ONE TRACK (his rule, §148): a Spitfire track whose voices want gains more than --split-db (3) apart cannot serve them with one
// fader — every voice but the one nearest the track's mean gets its own track (tools/perc_split.js), then the measurement must be redone for
// the percussion (the tracks changed) before the trims: --split does the splits and stops.
if (has('split')) {
    const SPLIT = +arg('split-db', 3); const I = require('vm').runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
    const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const byTr = {}; for (const r of rows) if (r.kind === 'aro-track') (byTr[r.track] = byTr[r.track] || []).push(r);
    let n = 0;
    for (const [track, rs] of Object.entries(byTr)) {
        if (rs.length < 2) continue; const gs = rs.map((r) => r.gainDb); if (Math.max(...gs) - Math.min(...gs) <= SPLIT) continue;
        const mean = gs.reduce((a, b) => a + b, 0) / gs.length; const keep = rs.reduce((b, r) => Math.abs(r.gainDb - mean) < Math.abs(b.gainDb - mean) ? r : b, rs[0]);
        for (const r of rs) {
            if (r === keep) continue;
            const tech = r.voice.split(':')[1], q = (I.percussion.techniques.find((x) => x.key === tech) || {}); const beater = (q.label || '').split(' — ')[1];
            if (!beater) { console.log('  ' + r.voice + ': no beater in its label — not split'); continue; }
            const slug = tech.slice(0, tech.length - slugify(beater).length - 1);
            console.log('  split: ' + track + ' → "' + beater + '" of ' + slug + ' (wants ' + r.gainDb + ' dB where the track mean is ' + r1(mean) + ')');
            if (!has('dry')) { const res = cp.spawnSync(process.execPath, [path.join(__dirname, 'perc_split.js'), slug, beater], { encoding: 'utf8' }); console.log((res.stdout || res.stderr).trim().split('\n').map((l) => '    ' + l).join('\n')); }
            n++;
        }
    }
    console.log(n ? (has('dry') ? '(dry) ' : '') + n + ' voice(s) to their own tracks — now: section_level.js --measure --lanes percussion, then section_gains.js again' : 'no track needs splitting (voices within ' + SPLIT + ' dB)');
    process.exit(0);
}
if (has('dry')) { console.log('(dry: nothing applied)'); fs.writeFileSync(levelsFile.replace(/\.json$/, '.gains.json'), JSON.stringify(out, null, 1) + '\n'); process.exit(0); }
// 1 · the UVI parts, grouped by track (one push per instance)
const byTrack = {}; for (const r of rows) if (r.kind === 'uvi-part') (byTrack[r.track] = byTrack[r.track] || []).push(r);
for (const [track, rs] of Object.entries(byTrack)) for (const r of rs) {
    const res = cp.spawnSync(process.execPath, [path.join(__dirname, 'uvi_part_gain.js'), track, String(r.channel), String(r.gainDb)], { encoding: 'utf8' });   // the PROGRAM's gain (CC7 owns the part's — §149)
    const line = (res.stdout || res.stderr).trim().split('\n')[0]; console.log('  ' + line); out.applied.push({ voice: r.voice, how: 'uvi program gain ' + r.gainDb + ' dB', line });
}
// 2 · the ARO tracks: one gain per track (the mean of its voices), fader then the JS remainder
const perTrack = {}; for (const r of rows) if (r.kind === 'aro-track') (perTrack[r.track] = perTrack[r.track] || []).push(r.gainDb);
// the gap was measured WITH the track's present fader and FX in the path, so the new level is the present one PLUS the gap (§149: the first
// pass set the gap as an absolute fader and undid its own trims)
const present = {};
if (Object.keys(perTrack).length) {
    const q = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), '-e', 'local out={} for i=0,reaper.CountTracks(0)-1 do local tr=reaper.GetTrack(0,i) local _,n=reaper.GetTrackName(tr) local fx=nil for f=0,reaper.TrackFX_GetCount(tr)-1 do local _,nm=reaper.TrackFX_GetFXName(tr,f,"") if nm:lower():find("volume adjustment",1,true) then fx=reaper.TrackFX_GetParam(tr,f,0) end end out[n]={fader=20*math.log(reaper.GetMediaTrackInfo_Value(tr,"D_VOL"),10),fx=fx} end return out'], { encoding: 'utf8' });
    try { Object.assign(present, JSON.parse(q.stdout).result); } catch (e) { die('could not read the tracks\' present levels: ' + (q.stdout || q.stderr).slice(0, 200)); }
    for (const t of Object.keys(perTrack)) { const p = present[t] || { fader: 0, fx: null }; perTrack[t] = perTrack[t].map((g) => g + p.fader + (p.fx || 0)); }
}
// a track's gain: the fader to +12, the JS FX for the rest — capped at --max-extra (8) dB: a peak meter overstates how much a sustained scrape
// or a spring coil needs (their loudness sits higher on their peak than a staccato's), so beyond +20 dB in all the rest is his ear's call
const MAXX = +arg('max-extra', 8);
const trims = Object.entries(perTrack).map(([track, gs]) => { const g = r1(gs.reduce((a, b) => a + b, 0) / gs.length); const fader = Math.min(MAXF, g), extra = r1(Math.min(MAXX, Math.max(0, g - MAXF))); if (g > MAXF + MAXX) console.log('  ' + track + ': asked ' + g + ' dB, capped at ' + (MAXF + MAXX) + ' — the rest is his ear\'s'); return { name: track, faderDb: fader, extraDb: extra }; });
if (trims.length) {
    const lua = fs.readFileSync(path.join(ROOT, 'reaper', 'bridge', 'jobs', 'apply_trims.lua'), 'utf8').replace(/local TRIMS = \{[\s\S]*?\n\}/, 'local TRIMS = {\n' + trims.map((t) => '  { name = ' + JSON.stringify(t.name) + ', faderDb = ' + t.faderDb + ', extraDb = ' + t.extraDb + ' },').join('\n') + '\n}');
    const tmp = path.join(ROOT, 'reaper', 'bridge', 'section_trims_' + process.pid + '.lua'); fs.writeFileSync(tmp, lua);
    const res = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmp], { encoding: 'utf8' }); try { fs.unlinkSync(tmp); } catch (e) {}
    let j; try { j = JSON.parse(res.stdout).result; } catch (e) { j = { error: (res.stdout || res.stderr).slice(0, 300) }; }
    for (const t of (j.tracks || [])) console.log('  ' + t.name.padEnd(22) + 'fader ' + t.faderDb + ' dB' + (t.fxDb != null ? ' + FX ' + t.fxDb + ' dB' : '') + (t.ok ? '' : '  NOT OK'));
    if (j.missingTracks && j.missingTracks.length) console.log('  missing tracks: ' + j.missingTracks.join(', '));
    out.applied.push({ how: 'aro track trims (fader + JS remainder)', trims, result: j });
}
for (const r of rows) if (r.kind === 'velocity') out.applied.push({ voice: r.voice, how: 'velocity (section_level.js --apply maps it against the ordinary)' });
fs.writeFileSync(levelsFile.replace(/\.json$/, '.gains.json'), JSON.stringify(out, null, 1) + '\n');
console.log('written: bank/section_levels/' + name + '.gains.json · now: section_level.js --measure, then --apply · his CTRL+S in Reaper');
