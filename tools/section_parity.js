#!/usr/bin/env node
// section_parity.js — PARITY BY LOUDNESS, for one save (his word 2026-11-10, RUNNING_LOG §152: "whichever notes across the board are p, they should
// all sound p together … I want the ff bass drum notes to come out at the same LUFS as the flutter tongue flute … a solution just for what's
// there now"). Reads the SECTION CARD (tools/section_card.js → probes/card_run.ps1 → probes/analyze_card.py: K-weighted loudness off a
// recording, per voice × pitch × written dynamic) and sets every note of the save so that each written dynamic lands at ONE loudness across
// every part — the mean of the voices at that dynamic (or --anchor <voice> to make one voice the reference, e.g. flute:flz).
//   · the level of a voice at a dynamic = the mean over its pitches of the card's loudest 400 ms (every note of this section is short)
//   · a UVI voice           → its velocity moved along its own 3-point curve (velAbs); the program gains stay as set
//   · a Kontakt voice        → louder than the target: CC7 per note (cc7Plain) through the instrument's measured CC7 law, velocity as written;
//                             softer: the velocity up its curve
//   · a Spitfire track       → one gain per TRACK (the fader, then a "JS: Volume Adjustment" for the rest, capped) from the mean shortfall of
//                             its notes, then each note's velocity on the shifted curve
// Every note keeps its written dynamic (recVel); only what is SENT changes. --undo takes the parity off.
//
//   node tools/section_parity.js --score <save> --from 200 --to 253 [--card bank/section_levels/<save>.card.json] [--anchor flute:flz] [--dry] [--undo]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const r1 = (x) => Math.round(x * 10) / 10;
const name = arg('score') || die('--score'), from = +arg('from', 0), to = +arg('to', 1e9);
const saveFile = path.join(ROOT, 'scores', name + '.json'); const s = JSON.parse(fs.readFileSync(saveFile, 'utf8'));
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const INST = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const notes = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.startSeconds >= from && o.startSeconds <= to && !TRACKS[o.layer].elec);
if (has('undo')) { let n = 0; for (const o of notes) { if (o.properties && o.properties.parity) { delete o.velAbs; delete o.cc7Plain; delete o.properties.parity; n++; } } console.log(n + ' note(s) taken off parity'); if (!has('dry')) fs.writeFileSync(saveFile, JSON.stringify(s)); process.exit(0); }
const CARD = JSON.parse(fs.readFileSync(path.resolve(ROOT, arg('card', 'bank/section_levels/' + name + '.card.json')), 'utf8'));
const rows = CARD.notes || CARD.rows || CARD.items || die('the card has no rows');
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
const cc7For = (curve, delta) => { if (!curve || delta >= -0.3) return 127; if (delta <= curve[0].delta) return curve[0].cc7; for (let i = 0; i < curve.length - 1; i++) if (delta >= curve[i].delta && delta <= curve[i + 1].delta) { const sp = curve[i + 1].delta - curve[i].delta; return Math.round(curve[i].cc7 + (curve[i + 1].cc7 - curve[i].cc7) * (sp > 1e-9 ? (delta - curve[i].delta) / sp : 0)); } return 127; };
// 1 · the voices' curves: level per written velocity = mean over pitches of the loudest 400 ms
const V = {};
for (const r of rows) {
    if (r.found === false) continue; const L = r.maxMomentaryDb != null ? r.maxMomentaryDb : r.maxMomentary != null ? r.maxMomentary : r.integratedDb != null ? r.integratedDb : r.integrated; if (L == null || !isFinite(L) || L < -90) continue;   // the card's field is maxMomentaryDb (the loudest 400 ms, K-weighted)
    const key = r.label; V[key] = V[key] || { key, port: r.port, ch: r.ch, inst: r.inst, byVel: {} }; (V[key].byVel[r.vel] = V[key].byVel[r.vel] || []).push(L);
}
for (const v of Object.values(V)) { v.curve = Object.entries(v.byVel).map(([vel, a]) => [+vel, r1(a.reduce((x, y) => x + y, 0) / a.length)]).sort((a, b) => a[0] - b[0]); for (let i = 1; i < v.curve.length; i++) if (v.curve[i][1] < v.curve[i - 1][1]) v.curve[i][1] = v.curve[i - 1][1]; }
const interp = (pts, x) => { if (x <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const a = pts[i - 1], b = pts[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / Math.max(1e-9, b[0] - a[0]); } return pts[pts.length - 1][1]; };
const velFor = (pts, L) => { if (L <= pts[0][1]) return Math.max(1, Math.round(pts[0][0] - (pts[0][1] - L) * (pts[1][0] - pts[0][0]) / Math.max(0.5, pts[1][1] - pts[0][1]))); for (let i = 1; i < pts.length; i++) if (L <= pts[i][1]) { const a = pts[i - 1], b = pts[i]; return Math.round(a[0] + (b[0] - a[0]) * (L - a[1]) / Math.max(1e-9, b[1] - a[1])); } return 127; };
// 2 · the voices the save plays, with their notes by written velocity
const played = {}; for (const o of notes) { const key = TRACKS[o.layer].instKey + ':' + o.technique; if (!V[key]) { console.log('  ! ' + key + ': not on the card — left as it is'); continue; } (played[key] = played[key] || []).push(o); }
const vels = [...new Set(notes.map((o) => o.recVel))].sort((a, b) => a - b);
// 3 · the target per written dynamic: the mean over the voices that play it (or the anchor voice)
const anchor = arg('anchor'); const target = {};
for (const vel of vels) { const ks = Object.keys(played); const levels = ks.map((k) => interp(V[k].curve, vel)); target[vel] = anchor ? (V[anchor] ? interp(V[anchor].curve, vel) : die('no such voice on the card: ' + anchor)) : r1(levels.reduce((a, b) => a + b, 0) / levels.length); }
console.log('the target per written velocity' + (anchor ? ' (the anchor: ' + anchor + ')' : ' (the mean of the voices)') + ': ' + vels.map((v) => v + ' → ' + target[v] + ' dB').join(' · '));
// 4 · the Spitfire tracks first: one gain per track from the mean shortfall of its notes (velocity cannot add beyond 127)
const isUvi = (v) => /^SW(Flute|Fluteb|Clar|Sax|Saxb)$/.test(v.port) || /^piano:(muted|harmonics)$/.test(v.key);
const trackGain = {}; const MAXF = 12, MAXX = +arg('max-extra', 12);
if (!has('no-trims')) {
    const q = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), '-e', 'local out={} for i=0,reaper.CountTracks(0)-1 do local tr=reaper.GetTrack(0,i) local _,n=reaper.GetTrackName(tr) local fx=nil for f=0,reaper.TrackFX_GetCount(tr)-1 do local _,nm=reaper.TrackFX_GetFXName(tr,f,"") if nm:lower():find("volume adjustment",1,true) then fx=reaper.TrackFX_GetParam(tr,f,0) end end out[n]={fader=20*math.log(reaper.GetMediaTrackInfo_Value(tr,"D_VOL"),10),fx=fx} end return out'], { encoding: 'utf8' });
    let present = {}; try { present = JSON.parse(q.stdout).result; } catch (e) { die('the bridge did not answer for the tracks\' levels'); }
    const byTrack = {}; for (const [k, os] of Object.entries(played)) { if (V[k].port !== 'SWPerc') continue; const trName = Object.keys(present).find((n) => (CARD.voices || []).some((vv) => vv.key === k && vv.ch === V[k].ch) && false) || null; const tr = (rows.find((r) => r.label === k) || {}).track || k; (byTrack[k] = byTrack[k] || []).push(...os.map((o) => target[o.recVel] - interp(V[k].curve, o.recVel))); }
    // the track of a Spitfire voice = the one whose input is its channel: asked of the rack
    const q2 = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), '-e', 'local dev for d=0,reaper.GetNumMIDIInputs()-1 do local ok,n=reaper.GetMIDIInputName(d,"") if ok and n=="SWPerc" then dev=d end end local out={} for i=0,reaper.CountTracks(0)-1 do local tr=reaper.GetTrack(0,i) local inp=reaper.GetMediaTrackInfo_Value(tr,"I_RECINPUT") if inp>=4096 and math.floor((inp-4096)/32)==dev then local _,n=reaper.GetTrackName(tr) out[tostring(math.floor((inp-4096)%32))]=n end end return out'], { encoding: 'utf8' });
    let chTrack = {}; try { chTrack = JSON.parse(q2.stdout).result; } catch (e) { die('the bridge did not answer for the percussion tracks'); }
    const perTrack = {}; for (const [k, gaps] of Object.entries(byTrack)) { const tr = chTrack[String(V[k].ch)]; if (!tr) { console.log('  ! ' + k + ': no track filters SWPerc ch ' + V[k].ch); continue; } (perTrack[tr] = perTrack[tr] || []).push(...gaps); V[k].track = tr; }
    const trims = Object.entries(perTrack).map(([tr, gaps]) => { const g = gaps.reduce((a, b) => a + b, 0) / gaps.length, p = present[tr] || { fader: 0, fx: null }, total = g + p.fader + (p.fx || 0); const fader = Math.min(MAXF, total), extra = r1(Math.min(MAXX, Math.max(0, total - MAXF))); trackGain[tr] = (fader + extra) - (p.fader + (p.fx || 0)); return { name: tr, faderDb: r1(fader), extraDb: extra, asked: r1(total), applied: r1(trackGain[tr]) }; });
    for (const t of trims) console.log('  track ' + t.name.padEnd(32) + 'to ' + t.faderDb + ' dB' + (t.extraDb ? ' + FX ' + t.extraDb : '') + ' (asked ' + t.asked + ', ' + (t.applied >= 0 ? '+' : '') + t.applied + ' from now)');
    if (!has('dry') && trims.length) {
        const lua = fs.readFileSync(path.join(ROOT, 'reaper', 'bridge', 'jobs', 'apply_trims.lua'), 'utf8').replace(/local TRIMS = \{[\s\S]*?\n\}/, 'local TRIMS = {\n' + trims.map((t) => '  { name = ' + JSON.stringify(t.name) + ', faderDb = ' + t.faderDb + ', extraDb = ' + t.extraDb + ' },').join('\n') + '\n}');
        const tmp = path.join(ROOT, 'reaper', 'bridge', 'parity_trims_' + process.pid + '.lua'); fs.writeFileSync(tmp, lua);
        const res = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmp], { encoding: 'utf8' }); try { fs.unlinkSync(tmp); } catch (e) {}
        let j; try { j = JSON.parse(res.stdout).result; } catch (e) { j = { error: (res.stdout || res.stderr).slice(0, 200) }; }
        console.log('  trims: ' + (j.ok ? 'applied' : JSON.stringify(j).slice(0, 200)));
    }
}
// 4b · THE UVI KNOB: a UVI voice whose notes sit off the target on average gets the difference on its PROGRAM gain (tools/uvi_part_gain.js --add),
//      and its curve shifts by as much — then the velocities only fine-tune (the flute's staccato, tongue ram and jet whistle sat 6 … 10 dB under
//      the mean at 127 on the first card: no velocity reaches that; the knob does)
const UVI_TRACK = { SWFlute: 'Flute SI2', SWFluteb: 'Fluteb SI2', SWClar: 'Clarinet SI2', SWSax: 'Alto Sax SI2', SWSaxb: 'Alto Sax SI2 b' };
const uviShift = {};
for (const [k, os] of Object.entries(played)) {
    const v = V[k]; if (!isUvi(v)) continue;
    const gaps = os.map((o) => target[o.recVel] - interp(v.curve, o.recVel)), g = r1(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    if (Math.abs(g) < 0.5) continue;
    const track = UVI_TRACK[v.port] || (/^piano:muted$/.test(k) ? 'PianoMute PP2' : /^piano:harmonics$/.test(k) ? 'PianoHarm PP2' : null), part = UVI_TRACK[v.port] ? v.ch : 1;
    if (!track) { console.log('  ! ' + k + ': no UVI track known'); continue; }
    console.log('  knob  ' + k.padEnd(34) + (g >= 0 ? '+' : '') + g + ' dB on ' + track + ' part ' + part);
    if (!has('dry')) { const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'uvi_part_gain.js'), track, String(part), String(g), '--add'], { encoding: 'utf8' }); if (r.status !== 0) console.log('    ! ' + (r.stderr || r.stdout).trim().split('\n')[0]); }
    uviShift[k] = g;
}
// 4c · a Kontakt TRACK trim, his call per run (--kontakt-trim "Violin XS:6,Glockenspiel RM:2"): the fader moves by that much (the whole piece hears it),
//      and the curves of the voices on that track shift with it; CC7 then brings the loud voices back down per note
const KT_TRACK = { violin: 'Violin XS', cello: 'Cello XS', 'piano:main': 'Piano Kontakt', 'piano:plucked': 'PianoPlucked Kontakt', bowed_vibraphone: 'Glockenspiel RM' };
const ktTrim = {}; for (const spec of String(arg('kontakt-trim', '')).split(',').filter(Boolean)) { const i = spec.lastIndexOf(':'); ktTrim[spec.slice(0, i)] = +spec.slice(i + 1); }
if (Object.keys(ktTrim).length) {
    const code = 'local out={} local want=' + JSON.stringify(ktTrim).replace(/"([^"]+)":/g, '["$1"]=') + ' for i=0,reaper.CountTracks(0)-1 do local tr=reaper.GetTrack(0,i) local _,n=reaper.GetTrackName(tr) if want[n] then local v=reaper.GetMediaTrackInfo_Value(tr,"D_VOL") local db=20*math.log(v,10)+want[n] reaper.SetMediaTrackInfo_Value(tr,"D_VOL",10^(db/20)) out[n]=db end end return out';
    if (!has('dry')) { const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), '-e', code], { encoding: 'utf8' }); let j; try { j = JSON.parse(r.stdout).result; } catch (e) { j = r.stdout.slice(0, 200); } console.log('  kontakt track trims → ' + JSON.stringify(j)); }
    else for (const [t, g] of Object.entries(ktTrim)) console.log('  kontakt track ' + t + ' ' + (g >= 0 ? '+' : '') + g + ' dB (dry)');
}
const ktShift = (k, v) => { const t = KT_TRACK[k] || KT_TRACK[v.inst]; return t && ktTrim[t] != null ? ktTrim[t] : 0; };
// 5 · every note
const report = {};
for (const [k, os] of Object.entries(played)) {
    const v = V[k], uvi = isUvi(v), perc = v.port === 'SWPerc', law = (REMAP.instruments[v.inst] || {}).cc7Curve;
    const shift = perc && v.track && trackGain[v.track] != null ? trackGain[v.track] : uviShift[k] != null ? uviShift[k] : ktShift(k, v);
    const curve = v.curve.map(([x, y]) => [x, y + shift]);
    const rep = report[k] = { notes: os.length, byVel: 0, byCc7: 0, short: 0, err: [] };
    for (const o of os) {
        const T = target[o.recVel], at = interp(curve, o.recVel), need = T - at;
        let velAbs = null, cc7 = null;
        if (!uvi && !perc && law && need < -0.3) { cc7 = cc7For(law, need); rep.byCc7++; }
        else { velAbs = Math.max(1, Math.min(127, velFor(curve, T))); rep.byVel++; if (interp(curve, 127) < T - 0.5) rep.short++; }
        if (cc7 != null) { o.cc7Plain = cc7; delete o.velAbs; } else { o.velAbs = velAbs; delete o.cc7Plain; }
        o.properties = o.properties || {}; o.properties.parity = { written: o.recVel, targetDb: r1(T), voiceDb: r1(at), velAbs, cc7, card: path.basename(arg('card', name + '.card.json')) };
        rep.err.push(r1((cc7 != null ? at + (law ? (() => { const c = law.find((p) => p.cc7 >= cc7) || law[law.length - 1]; return c.delta; })() : 0) : interp(curve, velAbs)) - T));
    }
}
for (const [k, r] of Object.entries(report)) console.log('  ' + k.padEnd(40) + String(r.notes).padStart(3) + ' notes · ' + (r.byCc7 ? r.byCc7 + ' by CC7, ' : '') + r.byVel + ' by velocity' + (r.short ? ' · ' + r.short + ' at 127 and still short' : ''));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString(); fs.writeFileSync(saveFile, JSON.stringify(s));
console.log('written: scores/' + name + '.json · File ▾ → Open it in the page');
