#!/usr/bin/env node
// section_level.js — A LEVEL PLAYING FIELD FOR ONE SECTION'S PARTS (his word 2026-11-10, RUNNING_LOG §137: "I want velocity 100 in each of these
// parts to sound approximately the same actual measured level … when I change to velocity 70, I want that velocity 70 to be about the same
// volume across all six parts"). The parts of a passage play ARTICULATIONS the calibration card never measured (staccato · stac_vel · a
// glockenspiel), so this tool MEASURES them itself, through the rack, and MAPS them:
//
//   (PLAN 1e, 2026-11-10, §145: ONE VOICE PER (lane, technique) the section's notes use — after the articulation deal a lane plays several;
//    a voice's key in the levels file is "instKey:technique"; --apply maps each note by ITS technique's curve; older per-lane files still read)
//   --measure  each lane's voice as the section uses it, ISOLATED notes at a grid of velocities × three pitches of the lane's own range in the
//              section, sent to the lane's port and channel (tools/part_meter.ps1), the receiving track's peak sampled in Reaper
//              (tools/part_meter.lua); per lane a curve velocity → dB (the mean over the pitches); the TARGET curve = the mean of the lanes
//              → bank/section_levels/<score>.json   (the raw peaks kept)
//   --apply    for every played-in note in the window: its WRITTEN velocity (recVel — what he struck, or typed) stays; velAbs = the velocity
//              on THIS lane's curve that gives the TARGET level for that written velocity — so velocity 70 sounds alike on all six. Re-run after
//              his edits; --undo takes it off. The written velocities and the notation never change.
//
//   node tools/section_level.js --measure --score <name> --from 195 --to 253 [--lanes …] [--vels 16,32,…] [--gap 0.75]
//   node tools/section_level.js --apply   --score <name> --from 195 --to 253 [--undo] [--dry]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const BRIDGE = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA, 'REAPER', 'bridge');
const name = arg('score') || die('--score'), from = +arg('from', 0), to = +arg('to', 1e9);
const saveFile = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(saveFile)) die('no such score');
const s = JSON.parse(fs.readFileSync(saveFile, 'utf8'));
const lanesArg = arg('lanes') ? String(arg('lanes')).split(',') : null;
const levelsDir = path.join(ROOT, 'bank', 'section_levels'); fs.mkdirSync(levelsDir, { recursive: true });
const levelsFile = path.join(levelsDir, name + '.json');
const dB = (a) => (a > 0 ? Math.round(20 * Math.log10(a) * 100) / 100 : -150);
const r1 = (x) => Math.round(x * 10) / 10;
const lua = (v) => { if (Array.isArray(v)) return '{' + v.map(lua).join(',') + '}'; if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => k + '=' + lua(x)).join(',') + '}'; if (typeof v === 'string') return JSON.stringify(v); return String(v); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// THE VOICES of the section: one per (lane, technique) its notes use (PLAN 1e, 2026-11-10 — until §145 one voice per LANE, the technique
// its notes used most; after the articulation deal a lane plays several, each its own curve). A voice's key is "instKey:technique"; its
// pitches are three of the notes' own (low · middle · high), inside the technique's range; a keyed strike's are the keys the notes use.
function sectionLanes() {
    const out = [];
    for (let lane = 0; lane < TRACKS.length; lane++) {
        const t = TRACKS[lane]; if (t.elec) continue;
        if (lanesArg && !lanesArg.includes(t.instKey) && !lanesArg.includes(t.id)) continue;
        const laneNotes = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.layer === lane && o.startSeconds >= from && o.startSeconds <= to);
        if (!laneNotes.length) continue;
        const inst = INSTRUMENTS[t.instKey], byTech = {}; for (const n of laneNotes) (byTech[n.technique] = byTech[n.technique] || []).push(n);
        // THE STANDARD (§148): the lane's ORDINARY voice is measured too, at the same grid — a plain note sounds at its written velocity on the
        // ordinary, and the rack's trims (the card, 1b.3) made the ordinaries equal across the instruments; so "velocity 70 on the flutter" should
        // be as loud as "velocity 70 on the ordinary" — that is the target, per lane. The ordinary's own notes are never mapped.
        const ordKey = inst.ordinary; if (ordKey && !byTech[ordKey] && !has('no-ordinary')) byTech[ordKey] = [];
        for (const techKey of Object.keys(byTech).sort((a, b) => byTech[b].length - byTech[a].length)) {
            const notes = byTech[techKey].length ? byTech[techKey] : laneNotes, tech = inst.techniques.find((q) => q.key === techKey) || inst.techniques[0];
            const isOrdinary = techKey === ordKey;
            const ps = [...new Set(notes.map((n) => n.sonifyNote))].sort((a, b) => a - b);
            let pitches;
            if (tech.keys && tech.keys.length) pitches = ps.length <= 3 ? ps : [ps[0], ps[Math.floor(ps.length / 2)], ps[ps.length - 1]];
            else { const lo = Math.max(tech.rangeLow != null ? tech.rangeLow : inst.rangeLow, ps[0]), hi = Math.min(tech.rangeHigh != null ? tech.rangeHigh : inst.rangeHigh, ps[ps.length - 1]); pitches = [...new Set([lo, Math.round((lo + hi) / 2), hi])]; }
            out.push({ lane, instKey: t.instKey, key: t.instKey + ':' + tech.key, label: t.label + ' ' + tech.key, notes: byTech[techKey], tech, isOrdinary, ordKey: t.instKey + ':' + ordKey, port: tech.port || inst.port, ch: (tech.channel || 1) - 1, pitches, noCC7: /^SWPerc$/.test(tech.port || inst.port) });   // Spitfire: never send CC7 (howto/spitfire-aro.md § 4)
        }
    }
    return out;
}

// play a schedule into a port while Reaper samples the receiving track's peak; returns { rows, offset } (the series aligned to the first note)
async function playAndWatch(L, ev, firstT, secs) {
    const schedFile = path.join(os.tmpdir(), 'section_level_' + L.instKey + '.events.json'); fs.writeFileSync(schedFile, JSON.stringify({ events: ev }));
    const seriesFile = path.join(BRIDGE, 'outbox', 'part_meter.json'); try { fs.unlinkSync(seriesFile); } catch (e) {}
    const body = 'CFG = ' + lua({ port: L.port, channel: L.ch + 1, seconds: secs }) + '\n' + fs.readFileSync(path.join(__dirname, 'part_meter.lua'), 'utf8');
    const tmp = path.join(os.tmpdir(), 'section_level_' + process.pid + '.lua'); fs.writeFileSync(tmp, body);
    const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmp], { encoding: 'utf8' }); try { fs.unlinkSync(tmp); } catch (e) {}
    let job; try { job = JSON.parse(r.stdout).result; } catch (e) { die('the bridge did not answer for ' + L.label + ': ' + (r.stdout || r.stderr).slice(0, 300)); }
    if (!job || !job.ok) die('the watch did not start for ' + L.label + ': ' + JSON.stringify(job || r.stdout).slice(0, 300));
    const p = cp.spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'part_meter.ps1'), '-Port', L.port, '-Schedule', schedFile], { encoding: 'utf8' });
    for (let w = 0; w < (secs + 10) * 1000 && !fs.existsSync(seriesFile); w += 250) await sleep(250);
    if (!fs.existsSync(seriesFile)) die('the watch wrote nothing for ' + L.label);
    const series = JSON.parse(fs.readFileSync(seriesFile, 'utf8'));
    const first = series.rows.find((x) => Math.max(x[1], x[2]) > 0.002);
    return { rows: series.rows, track: series.track, offset: first ? first[0] - firstT : 0, played: (p.stdout || '').trim() };
}
const peakIn = (rows, a, b) => { let m = 0; for (const x of rows) { if (x[0] < a) continue; if (x[0] > b) break; const v = Math.max(x[1], x[2]); if (v > m) m = v; } return m; };
// a monotone (pooled) curve over the grid and its reading in both directions
function monotone(pairs) { const p = pairs.slice().sort((a, b) => a[0] - b[0]); for (let i = 1; i < p.length; i++) if (p[i][1] < p[i - 1][1]) p[i][1] = p[i - 1][1]; return p; }
const interp = (pts, x, ix = 0, iy = 1) => { if (x <= pts[0][ix]) return pts[0][iy]; for (let i = 1; i < pts.length; i++) if (x <= pts[i][ix]) { const a = pts[i - 1], b = pts[i]; return a[iy] + (b[iy] - a[iy]) * (x - a[ix]) / Math.max(1e-9, b[ix] - a[ix]); } return pts[pts.length - 1][iy]; };

(async () => {
    const lanes = sectionLanes(); if (!lanes.length) die('no played notes in the window');
    if (has('measure')) {
        const vels = String(arg('vels', '16,32,48,64,80,96,112,127')).split(',').map(Number), GAP = +arg('gap', 0.75), LEAD = 1, DUR = 0.35;
        // with --lanes an existing measurement is kept and only the named lanes' voices re-measured (a re-measure after a fix, §146)
        const out = (lanesArg && fs.existsSync(levelsFile)) ? Object.assign(JSON.parse(fs.readFileSync(levelsFile, 'utf8')), { when: new Date().toISOString() }) : { score: name, from, to, when: new Date().toISOString(), measure: 'the receiving track\'s peak (Track_GetPeakInfo, post-fader) over each isolated note, dBFS', vels, lanes: {} };
        if (lanesArg) for (const k of Object.keys(out.lanes)) if (lanes.some((L) => L.key === k)) delete out.lanes[k];
        for (const L of lanes) {
            const ev = L.noCC7 ? [] : [[0, 0xB0 | L.ch, 7, 127]]; if (L.tech.cc0 != null) ev.push([0, 0xB0 | L.ch, 0, L.tech.cc0]);
            const grid = []; let k = 0;
            const order = vels.slice().sort((a, b) => b - a);   // loudest first in each pitch block: the series is aligned on the FIRST sound heard, and a velocity-16 note may be under the threshold (§144's lesson)
            for (const pitch of L.pitches) for (const vel of order) { const t = LEAD + k * GAP; ev.push([t, 0x90 | L.ch, pitch, vel], [t + DUR, 0x80 | L.ch, pitch, 0]); grid.push({ t, pitch, vel }); k++; }
            const secs = Math.ceil(LEAD + k * GAP + 2);
            process.stdout.write(L.label + ' (on ' + L.port + ' ch ' + (L.ch + 1) + ', pitches ' + L.pitches.join(' ') + ') … ');
            const W = await playAndWatch(L, ev, LEAD, secs);
            for (const g of grid) g.peakDb = dB(peakIn(W.rows, g.t + W.offset - 0.05, g.t + W.offset + GAP - 0.08));
            // the mean over the pitches at each velocity — a reading of NOTHING (−100 or under) while another pitch sounded is a dropped event
            // (§148: a burst of three went missing once in the clarinet's grid and bent its curve to −55 at 127), left out of the mean
            const curve = vels.map((v) => { const all = grid.filter((g) => g.vel === v).map((g) => g.peakDb); const a = all.filter((x) => x > -100); const use = a.length ? a : all; return [v, r1(use.reduce((x, y) => x + y, 0) / use.length), r1(Math.max(...use) - Math.min(...use))]; });
            const dropped = grid.filter((g) => g.peakDb <= -100).length; if (dropped && dropped < grid.length) process.stdout.write('(' + dropped + ' dropped) ');
            out.lanes[L.key] = { lane: L.lane, instKey: L.instKey, ordinary: !!L.isOrdinary, label: L.label, track: W.track, technique: L.tech.key, port: L.port, channel: L.ch + 1, pitches: L.pitches, offsetS: r1(W.offset), grid, curve: monotone(curve.map((c) => [c[0], c[1]])), spreadDb: curve.map((c) => [c[0], c[2]]) };
            console.log(W.track + ' · ' + curve.map((c) => c[0] + ':' + c[1]).join(' ') + ' dB (spread over pitches ' + r1(Math.max(...curve.map((c) => c[2]))) + ' dB at most)');
        }
        // the target: the mean of the lanes at each grid velocity
        const keys = Object.keys(out.lanes);
        out.target = monotone(vels.map((v) => [v, r1(keys.reduce((a, k) => a + interp(out.lanes[k].curve, v), 0) / keys.length)]));
        out._what = 'THE SECTION\'S LEVELS (tools/section_level.js --measure): per lane, the voice the section uses, a grid of velocities × three pitches, the receiving track\'s peak; curve = velocity → dB (mean over the pitches, made non-decreasing); target = the mean of the lanes. --apply maps each note\'s written velocity to the velocity on its lane that gives the target level.';
        fs.writeFileSync(levelsFile, JSON.stringify(out, null, 1) + '\n');
        console.log('target     ' + out.target.map((c) => c[0] + ':' + c[1]).join(' ') + ' dB');
        console.log('written: bank/section_levels/' + name + '.json');
        return;
    }
    if (has('apply')) {
        if (!fs.existsSync(levelsFile)) die('no measurement yet: --measure first');
        const M = JSON.parse(fs.readFileSync(levelsFile, 'utf8'));
        // THE TOP OF THE FIELD: the mean curve's top sits above what the quieter voices give at 127 (the piano, the violin, the glock reach
        // −9 … −10 dB; the winds −2 … −7). The target is the mean curve SHIFTED so its 127 equals the quietest voice's top — every part can reach
        // every level, the winds are brought down to meet them (--top mean keeps the raw mean and clamps the short ones at 127)
        // THE STANDARD (§148): when the lanes' ORDINARY voices were measured, each lane's target is ITS ordinary's curve — a plain note at
        // velocity v on the articulation should be as loud as velocity v on the ordinary (the card's trims made the ordinaries equal across
        // the instruments). A lane without an ordinary (the percussion, the mallets) takes the mean of the ordinaries. No ceiling shift:
        // the standard is absolute. Without ordinaries the older rule runs: the mean of the voices, its top the quietest voice's top.
        const dead = Object.entries(M.lanes).filter(([, m]) => m.curve[m.curve.length - 1][1] < -60).map(([k]) => k);
        for (const k of dead) delete M.lanes[k];
        if (dead.length) console.log('left out (read nothing): ' + dead.join(', '));
        const live = Object.values(M.lanes); if (!live.length) die('no voice read anything');
        const ords = live.filter((m) => m.ordinary);
        let targetFor;
        if (ords.length) {
            const meanOrd = monotone(M.vels.map((v) => [v, r1(ords.reduce((a, m) => a + interp(m.curve, v), 0) / ords.length)]));
            targetFor = (L) => { const m = M.lanes[L.ordKey]; return (m && m.ordinary) ? m.curve : meanOrd; };
            console.log('the standard: each lane its ordinary (' + ords.map((m) => m.instKey + ' top ' + m.curve[m.curve.length - 1][1]).join(' · ') + '); lanes without one the mean of the ordinaries: ' + meanOrd.map((c) => c[0] + ':' + c[1]).join(' ') + ' dB');
        } else {
            M.target = monotone(M.vels.map((v) => [v, r1(live.reduce((a, m) => a + interp(m.curve, v), 0) / live.length)]));
            const meanTop0 = M.target[M.target.length - 1][1], SOFT = +arg('soft-floor', 12);
            const soft = Object.entries(M.lanes).filter(([, m]) => m.curve[m.curve.length - 1][1] < meanTop0 - SOFT).map(([k]) => k);
            if (soft.length) console.log('soft voices (more than ' + SOFT + ' dB under the mean top — they do not set the ceiling): ' + soft.join(', '));
            const setters = Object.entries(M.lanes).filter(([k]) => !soft.includes(k)).map(([, m]) => m);
            const tops = setters.map((m) => m.curve[m.curve.length - 1][1]);
            const shift = arg('top', 'min') === 'mean' ? 0 : Math.min(0, Math.min(...tops) - meanTop0);
            if (shift) M.target = M.target.map(([v, d]) => [v, r1(d + shift)]);
            console.log('the target curve' + (shift ? ' (the mean, shifted ' + r1(shift) + ' dB so its top is the quietest voice\'s top)' : '') + ': ' + M.target.map((c) => c[0] + ':' + c[1]).join(' ') + ' dB');
            targetFor = () => M.target;
        }
        let n = 0; const report = [];
        for (const L of lanes) {
            const m = M.lanes[L.key] || M.lanes[L.instKey]; if (!m) { report.push(L.label + ': not measured — left'); continue; }
            if (L.isOrdinary) { for (const o of L.notes) if (o.properties && o.properties.sectionLevel) { delete o.velAbs; delete o.properties.sectionLevel; n++; } report.push(L.label.padEnd(11) + L.notes.length + ' notes · THE ORDINARY — the reference, sent as written'); continue; }   // a voice (instKey:technique), or an older per-lane measurement
            const inv = m.curve.map((c) => [c[1], c[0]]);   // dB → velocity on this lane (monotone)
            let short = 0, moved = [];
            for (const o of L.notes) {
                if (has('undo')) { if (o.properties && o.properties.sectionLevel) { delete o.velAbs; delete o.properties.sectionLevel; n++; } continue; }
                if (o.sonifyMode !== 'plain') continue;
                const written = o.recVel != null ? o.recVel : Math.round((o.nodes[0].y / 10) * 127);
                const target = interp(targetFor(L), written), top = m.curve[m.curve.length - 1][1];
                let sent = Math.round(interp(inv, target)); if (target > top + 0.05) { sent = 127; short++; }
                sent = Math.max(1, Math.min(127, sent));
                o.velAbs = sent; o.properties = o.properties || {}; o.properties.sectionLevel = { written, sent, targetDb: r1(target), measured: 'bank/section_levels/' + name + '.json' };
                moved.push(sent - written); n++;
            }
            if (!has('undo')) { const mean = moved.length ? r1(moved.reduce((a, b) => a + b, 0) / moved.length) : 0; report.push(L.label.padEnd(11) + L.notes.length + ' notes · sent velocity = written ' + (mean >= 0 ? '+' : '') + mean + ' on average' + (short ? ' · ' + short + ' note(s) wanted more than this voice has at 127' : '')); }
        }
        console.log(report.join('\n')); console.log(n + ' note(s) ' + (has('undo') ? 'taken off the field' : 'on the level playing field'));
        if (has('dry')) { console.log('(dry: nothing written)'); return; }
        s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString(); fs.writeFileSync(saveFile, JSON.stringify(s));
        console.log('written: scores/' + name + '.json · File ▾ → Reload in the page');
        return;
    }
    die('--measure or --apply');
})();
