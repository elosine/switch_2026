#!/usr/bin/env node
// three_body_check.js — THE THREE BODY PROBLEM, HEADLESS (PLAN.md 1.6 · 14.2 · 14.5; RUNNING_LOG §188 … §191): the two pure modules
// (score/public/three_body_roll.js · three_body_sim.js), the piece's numbers (bank/three_body.json) and a score the builder made
// — no page, no engine, no MIDI.
//   THE COINS     the King Wen table holds 1 … 64 once each; a hexagram's number is its two trigrams'; the same seed, the same roll
//   THE ROLL      every player nine containers, in the series' order, end to start; each rolled length inside its range and
//                 where its hexagram puts it; a close pass always with company; the section under three minutes, its end the
//                 last return to far apart + the end cap
//   THE SCORE     what the file says it is rolled from gives the same table again; the five's containers are labelled zones on
//                 their lanes; the three computer players' are performer bricks with a palette the bank holds
//   THE NOTES     every note in a container of its player, in the state it says; a technique of its lane; none in a break's
//                 silence; a beat 300 … 900 ms after the player it answers; a close pass's note 60 … 150 ms after; two close-
//                 passing notes of different players never within the guard; the same seed, the same notes
//   THE BRICKS    under a stub window (the engine's le_objects.js · le_performer.js): a brick's label and its message; the
//                 transport's tick sends each brick once and tells the engine every simulated note with its player; a playhead
//                 that starts inside a container says where it stands; a stop reaches the engine
//   node tools/three_body_check.js [--score three-body]          exit 0: THREE_BODY_CHECK PASS · 1: FAIL, each check named
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const Roll = require(path.join(ROOT, 'score', 'public', 'three_body_roll.js')), Sim = require(path.join(ROOT, 'score', 'public', 'three_body_sim.js'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const NAME = arg('score', 'three-body'), FILE = path.join(ROOT, 'scores', NAME + '.json');
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'three_body.json'), 'utf8'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const HUMANS = CFG.players.map((p) => p.name), COMPUTER = CFG.computer.map((c) => c.id), ALL = HUMANS.concat(COMPUTER);
const laneOf = (k) => TRACKS.findIndex((t) => t.instKey === k);

let fails = 0;
const check = (what, ok, detail) => { console.log('  ' + (ok ? 'ok   ' : 'FAIL ') + what + ' — ' + detail); if (!ok) fails++; };
const near = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 0.0015 : tol);

console.log('THREE_BODY_CHECK the coins:');
const kw = Roll.KING_WEN.flat().slice().sort((a, b) => a - b);
check('the King Wen table holds 1 … 64, each once', kw.length === 64 && kw.every((v, i) => v === i + 1), kw.length + ' numbers, ' + kw[0] + ' … ' + kw[63]);
{
    // heaven over heaven is 1 · earth over earth 2 · water over fire 63 · fire over water 64: four the book fixes
    const T = Roll.TRIGRAMS, at = (lower, upper) => Roll.KING_WEN[T.indexOf(lower)][T.indexOf(upper)];
    check('a hexagram\'s number is its two trigrams\' (four the book fixes)', at('111', '111') === 1 && at('000', '000') === 2 && at('101', '010') === 63 && at('010', '101') === 64 && at('111', '000') === 11 && at('000', '111') === 12,
        'heaven/heaven ' + at('111', '111') + ' · earth/earth ' + at('000', '000') + ' · fire below water ' + at('101', '010') + ' · water below fire ' + at('010', '101') + ' · peace ' + at('111', '000') + ' · standstill ' + at('000', '111'));
    const a = Roll.mulberry32(7), b = Roll.mulberry32(7), h1 = [1, 2, 3].map(() => Roll.hexagram(a)), h2 = [1, 2, 3].map(() => Roll.hexagram(b));
    check('three coins a line, six lines: the same seed, the same hexagrams', JSON.stringify(h1) === JSON.stringify(h2) && h1.every((h) => h.lines.length === 6 && h.lines.every((l) => l >= 6 && l <= 9) && h.n >= 1 && h.n <= 64),
        h1.map((h) => h.n + ' ' + h.glyph + ' (' + h.lines.join('') + ')').join(' · '));
}

console.log('THREE_BODY_CHECK the roll:');
const R = CFG.rangesS;
const rangeOf = (c) => (c.state === 'change' ? (c.to === 'breakRejoin' ? R.changeToBreak : R.change) : R[c.state]);
for (const seed of [1, 2, 3]) {
    const r = Roll.rollKept(CFG, ALL, seed), bad = [];
    for (const p of r.players) {
        if (p.containers.length !== 9 || p.containers.map((c) => c.state).join() !== Roll.STATES.join()) bad.push(p.name + ': not the series');
        p.containers.forEach((c, i) => {
            if (i === 0 ? c.start !== 0 : !near(c.start, p.containers[i - 1].end)) bad.push(p.name + ' ' + i + ': a gap before it');
            if (c.endCap) return;
            const len = c.end - c.start;
            if (c.state === 'breakRejoin') {
                const want = Roll.across(c.hexSilence, R.breakSilence) + Roll.across(c.hex, R.breakRejoin);
                if (!near(len, want, 0.003) || c.silenceS < R.breakSilence[0] || c.silenceS > R.breakSilence[1]) bad.push(p.name + ' the break: ' + len + ' s, its hexagrams say ' + want);
            } else {
                const g = rangeOf(c);
                if (len < g[0] - 0.002 || len > g[1] + 0.002 || !near(len, Roll.across(c.hex, g), 0.003)) bad.push(p.name + ' ' + c.state + ': ' + len + ' s outside ' + g.join(' … ') + ' or off its hexagram ' + c.hex);
            }
        });
    }
    const latest = Math.max(...r.players.map((p) => p.containers[8].start));
    const again = Roll.rollKept(CFG, ALL, seed);
    check('seed ' + seed + ': nine containers a player, each where its hexagram puts it; every close pass has company; the same roll twice',
        !bad.length && Roll.company(r, CFG.constraint.overlapS).ok && JSON.stringify(again) === JSON.stringify(r) && r.players.every((p) => near(p.containers[8].end, r.lengthS))
        && r.lengthS < 180 && near(r.lengthS, Math.max(CFG.lengthS || 0, latest + CFG.endCapS), 0.002),
        bad.length ? bad.slice(0, 3).join(' · ') : r.players.length + ' players · ' + r.lengthS.toFixed(1) + ' s (the last return to far apart ' + latest.toFixed(1) + ' + the cap ' + CFG.endCapS + ') · kept at seed ' + r.seedUsed);
}
{
    // a roll that leaves a close pass alone is not kept: the ranges forced so that one player's passes far from the others
    const lone = Roll.roll(CFG, ['a', 'b'], 1);
    const cpB = lone.players[1].containers[4]; const shift = 500 - cpB.start; lone.players[1].containers.forEach((c) => { c.start += shift; c.end += shift; });
    check('a close pass with nobody near is seen', Roll.company(lone, 3).ok === false && Roll.company(lone, 3).lonely.length === 2, 'two players, one moved 500 s away: lonely ' + Roll.company(lone, 3).lonely.join(' · '));
}

console.log('THREE_BODY_CHECK the score ' + NAME + ':');
if (!fs.existsSync(FILE)) { console.log('  FAIL scores/' + NAME + '.json is not there — node tools/build_three_body.js'); console.log('THREE_BODY_CHECK FAIL'); process.exit(1); }
const save = JSON.parse(fs.readFileSync(FILE, 'utf8')), M = save.metadata.threeBody, objs = save.objects;
const rolled = M.fitS > 0 ? Roll.rollFit(CFG, ALL, M.seedAsked, M.fitS) : Roll.rollKept(CFG, ALL, M.seedAsked);   // the fit re-rolled as the builder rolled it (DEC-37)
Roll.targets(rolled, HUMANS, HUMANS, rolled.seedUsed); Roll.targets(rolled, COMPUTER, ALL, rolled.seedUsed + 1);
const by = Object.fromEntries(rolled.players.map((p) => [p.name, p]));
const tableNow = rolled.players.flatMap((p) => p.containers.map((c) => [p.name, c.index, c.state, c.from || '', c.to || '', c.start, c.end, c.hex || 0, c.hexSilence || 0, c.silenceS || 0, c.target || '', c.targetFrom || '']));
check('what the file says it is rolled from gives its table again', rolled.seedUsed === M.seedUsed && JSON.stringify(tableNow) === JSON.stringify(M.table) && near(M.lengthS, rolled.lengthS),
    'seed ' + M.seedAsked + ' (kept ' + M.seedUsed + ') · ' + M.table.length + ' rows · ' + M.lengthS + ' s · ' + M.command);
const zones = objs.filter((o) => o.type === 'zone'), plain = zones.filter((z) => z.zoneFunction === 'tb'), bricks = zones.filter((z) => z.midiModel === 'elecPerformer');
{
    const bad = [];
    for (const p of CFG.players) {
        const zs = plain.filter((z) => z.properties.tb.player === p.name).sort((a, b) => a.startTime - b.startTime);
        if (zs.length !== 9) { bad.push(p.name + ': ' + zs.length + ' zones'); continue; }
        zs.forEach((z, i) => { const c = by[p.name].containers[i]; if (z.layer !== laneOf(p.lanes[0]) || !near(z.startTime, c.start) || !near(z.endTime, c.end) || z.properties.tb.state !== c.state || !z.player || !z.color) bad.push(p.name + ' ' + i); });
    }
    check('the five\'s containers are labelled zones on their lanes, one a container', !bad.length && plain.length === 45, bad.length ? bad.join(' · ') : plain.length + ' zones · e.g. "' + plain[2].player + ' — ' + plain[2].instrument + '" · "' + plain[6].player + ' — ' + plain[6].instrument + '"');
}
const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'samples', 'index.json'), 'utf8')).samples;
{
    const bad = [], names = new Set(ALL.concat(['any', 'cluster']));
    for (const cp of CFG.computer) {
        const zs = bricks.filter((z) => z.elec.id === cp.id).sort((a, b) => a.startTime - b.startTime);
        if (zs.length !== 9) { bad.push(cp.id + ': ' + zs.length + ' bricks'); continue; }
        zs.forEach((z, i) => {
            const c = by[cp.id].containers[i], e = z.elec;
            if (z.layer !== laneOf(cp.lane) || !near(z.startTime, c.start) || !near(z.endTime, c.end) || e.state !== c.state || (c.state === 'change' && (e.from !== c.from || e.to !== c.to))) bad.push(cp.id + ' ' + i + ': not its container');
            if ((e.target && !names.has(e.target)) || (e.targetFrom && !names.has(e.targetFrom))) bad.push(cp.id + ' ' + i + ': listens to nobody known (' + e.target + ')');
            if (c.state === 'breakRejoin' && Math.abs(e.silenceMs - c.silenceS * 1000) > 1) bad.push(cp.id + ' the break: its silence');
            if (!Array.isArray(e.pal) || !e.pal.length) bad.push(cp.id + ' ' + i + ': no palette');
            for (const n of e.pal || []) { const row = index.find((r) => r.name === n); if (!row || !cp.from.includes(row.player) || !fs.existsSync(path.join(ROOT, 'bank', 'samples', row.file))) { bad.push(cp.id + ': ' + n + ' is not a sample of its players in the bank'); break; } }
        });
    }
    check('the three computer players\' containers are performer bricks; each listens to somebody known and holds a palette the bank has', !bad.length && bricks.length === 27,
        bad.length ? bad.slice(0, 3).join(' · ') : bricks.length + ' bricks · ' + CFG.computer.map((cp) => cp.id + ' ' + new Set(bricks.filter((z) => z.elec.id === cp.id).flatMap((z) => z.elec.pal)).size + ' samples of ' + cp.from.join('+')).join(' · '));
}

console.log('THREE_BODY_CHECK the notes:');
const notes = objs.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null).sort((a, b) => a.startSeconds - b.startSeconds);
const K = Sim.rulesOf(CFG.rules);
{
    const bad = [], lanesOf = Object.fromEntries(CFG.players.map((p) => [p.name, p.lanes.map(laneOf)]));
    let inSilence = 0;
    for (const n of notes) {
        const t = n.properties.tb, c = by[t.player].containers.find((x) => n.startSeconds >= x.start - 0.006 && n.startSeconds < x.end + 0.006 && x.state === t.state);
        if (!c) { bad.push(n.id + ' at ' + n.startSeconds + ': no ' + t.state + ' container of ' + t.player + ' there'); continue; }
        if (!lanesOf[t.player].includes(n.layer)) bad.push(n.id + ': not on a lane of ' + t.player);
        if (!INSTRUMENTS[TRACKS[n.layer].instKey].techniques.some((x) => x.key === n.technique)) bad.push(n.id + ': ' + n.technique + ' is no technique of its lane');
        if (!(n.recVel >= 1 && n.recVel <= 127)) bad.push(n.id + ': velocity ' + n.recVel);
        if (c.state === 'breakRejoin' && n.startSeconds < c.start + c.silenceS - 0.001) inSilence++;
    }
    check('every note is in a container of its player, in the state it says, on its lane, in a technique of its lane; none in a break\'s silence', !bad.length && inSilence === 0 && notes.length === M.notes,
        bad.length ? bad.slice(0, 3).join(' · ') : notes.length + ' notes · ' + HUMANS.map((h) => h + ' ' + notes.filter((n) => n.properties.tb.player === h).length).join(' · ') + ' · in a silence: ' + inSilence);
    // an answer's distance to the onset it answers: the onset of that player inside the rule's range before it (the player may
    // have sounded again in between — so not the nearest earlier one, but the nearest IN the range)
    const onsetsOf = (who) => notes.filter((n) => n.properties.tb.player === who).map((n) => n.startSeconds);
    const since = (n, lo, hi) => { const ds = onsetsOf(n.properties.tb.ref).map((x) => (n.startSeconds - x) * 1000).filter((d) => d >= lo - 1 && d <= hi + 1); return ds.length ? Math.min(...ds) : null; };
    const guard = K.guardMs + 16;   // a close pass's note may be moved once off an onset: the guard and its 15 ms
    const beats = notes.filter((n) => n.properties.tb.role === 'beat').map((n) => since(n, K.approaching.beatMs[0], K.approaching.beatMs[1]));
    const afters = notes.filter((n) => n.properties.tb.role === 'after').map((n) => since(n, K.closePass.tightMs[0], K.closePass.tightMs[1] + guard * 2));
    const span = (a) => { const b = a.filter((d) => d != null); return b.length ? Math.round(Math.min(...b)) + ' … ' + Math.round(Math.max(...b)) + ' ms' : '—'; };
    check('a beat is ' + K.approaching.beatMs.join(' … ') + ' ms after an onset of the player it answers', beats.length > 10 && beats.every((d) => d != null),
        beats.length + ' beats, ' + beats.filter((d) => d == null).length + ' with no such onset · ' + span(beats));
    check('a close pass\'s answer is ' + K.closePass.tightMs.join(' … ') + ' ms after (a guard\'s move at the most beyond)', afters.length > 10 && afters.every((d) => d != null),
        afters.length + ' answers, ' + afters.filter((d) => d == null).length + ' with no such onset · ' + span(afters));
    const cp = notes.filter((n) => n.properties.tb.rule === 'closePass');
    let closest = 1e9;
    for (let i = 1; i < cp.length; i++) if (cp[i].properties.tb.player !== cp[i - 1].properties.tb.player) closest = Math.min(closest, (cp[i].startSeconds - cp[i - 1].startSeconds) * 1000);
    check('never WITH: two close-passing notes of different players are never inside the guard', closest >= K.guardMs - 1.01, cp.length + ' close-pass notes · the closest two of different players: ' + closest.toFixed(1) + ' ms (the guard: ' + K.guardMs + ')');
    const bets = notes.filter((n) => n.properties.tb.role === 'bet');
    check('the bets are there, hit and missed', bets.length > 5 && bets.some((n) => n.properties.tb.hit) && bets.some((n) => !n.properties.tb.hit), bets.length + ' bets · ' + bets.filter((n) => n.properties.tb.hit).length + ' hit · ' + bets.filter((n) => !n.properties.tb.hit).length + ' missed');
    const sim = Sim.run({ players: HUMANS.map((n) => by[n]), rules: CFG.rules, seed: rolled.seedUsed, stepMs: (CFG.sim && CFG.sim.stepMs) || 5 });
    check('the same seed, the same notes', sim.onsets.length === notes.length && sim.onsets.every((o, i) => near(o.t, notes[i].startSeconds) && o.player === notes[i].properties.tb.player && o.role === notes[i].properties.tb.role),
        sim.onsets.length + ' onsets simulated again · ' + Object.entries(sim.counts).map(([k, v]) => k + ' ' + v).join(' · '));
    // the arch: the densest ten seconds lie in the middle, where the close passes are
    const bins = []; for (const n of notes) { const b = Math.floor(n.startSeconds / 10); bins[b] = (bins[b] || 0) + 1; }
    for (let b = 0; b < bins.length; b++) bins[b] = bins[b] || 0;   // a ten seconds with no note (every break's silence at once — seed 165, DEC-37) is a 0, not a hole: a hole made the peak NaN
    const peak = bins.indexOf(Math.max(...bins)), cps = rolled.players.filter((p) => HUMANS.includes(p.name)).map((p) => p.containers[4]);
    check('the densest ten seconds are where the close passes are', peak * 10 + 10 > Math.min(...cps.map((c) => c.start)) && peak * 10 < Math.max(...cps.map((c) => c.end)),
        'notes per 10 s: ' + Array.from(bins, (v) => v || 0).join(' ') + ' · the close passes ' + Math.min(...cps.map((c) => c.start)).toFixed(0) + ' … ' + Math.max(...cps.map((c) => c.end)).toFixed(0) + ' s');
}

console.log('THREE_BODY_CHECK the bricks (the engine\'s module under a stub window):');
{
    const sent = [], doc = { createElement: () => ({ children: [], appendChild() {}, addEventListener() {}, setAttribute() {} }) };
    const WHO = {}; CFG.players.forEach((p) => p.lanes.forEach((k) => { WHO['port' + laneOf(k)] = p.name; }));
    let nowMs = 0;
    const win = { addEventListener() {}, document: doc, LE: { cfg: { players: [] }, ready: Promise.resolve(), playerOf: (port) => WHO[port] || null, send: (kind, data) => { sent.push({ kind, data }); return Promise.resolve(null); } } };
    const ctx = vm.createContext({ window: win, LE: win.LE, document: doc, fetch: () => Promise.resolve({ ok: false }), performance: { now: () => nowMs }, setTimeout, clearTimeout, console, Promise });
    for (const f of ['le_objects.js', 'le_performer.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'electronics', 'score', f), 'utf8'), ctx, { filename: f });
    const LEO = win.LEObjects;
    const host = { objects: objs, playStartTime: 0, playStartOffset: 0, pixelsPerSecond: 30, isPartAudible: () => true, stopPlay() {}, renderZone() {}, showPropertyPanel() {}, markDirty() {}, saveStatus: {} };
    LEO.attach(host, { lanes: 6, portOf: (l) => 'port' + l, laneLabel: (l) => TRACKS[l].short });
    const e1 = bricks.filter((z) => z.elec.id === 'e1').sort((a, b) => a.startTime - b.startTime), cpz = e1[4], brk = e1[6], chg = e1[3];
    const m = LEO.performerMessage(cpz, null, 80), mb = LEO.performerMessage(brk, null, 0), mc = LEO.performerMessage(chg, null, 0);
    check('a brick\'s message: its state, its length, whom it listens to, its palette, its dials; a change says what it lies between; a break its silence',
        LEO.is(cpz) && m.id === 'e1' && m.state === 'closePass' && m.lengthMs === Math.round((cpz.endTime - cpz.startTime) * 1000) && m.dueMs === 80 && m.target === cpz.elec.target && m.pal.split(',').length === cpz.elec.pal.length
        && /beatLo=\d+/.test(m.dials) && /guardMs=\d+/.test(m.dials) && m.ear === 'sim' && m.mark === 'mf' && !('offsetMs' in m)
        && mc.state === 'change' && mc.from === 'approaching' && mc.to === 'closePass' && mb.state === 'breakRejoin' && mb.silenceMs === brk.elec.silenceMs,
        LEO.performerLabel(cpz) + ' | ' + LEO.performerLabel(chg) + ' | ' + LEO.performerLabel(brk) + ' | ' + m.dials.split(',').length + ' dials, ' + m.pal.length + ' characters of palette');
    // the transport: forty seconds from the start, a frame every 16 ms
    for (let t = 0; t <= 40; t += 0.016) { nowMs = t * 1000; LEO.tick(host, t); }
    const perf = sent.filter((x) => x.kind === 'performer'), ons = sent.filter((x) => x.kind === 'onset');
    const wantB = bricks.filter((z) => z.startTime <= 40.1).length, wantN = notes.filter((n) => n.startSeconds > 0 && n.startSeconds <= 40.1);
    check('played from the start: each brick sends its message once, ahead of its start; every simulated note is told with its player',
        perf.length === wantB && new Set(perf.map((x) => x.data.zone)).size === wantB && perf.every((x) => x.data.dueMs >= 0 && x.data.dueMs <= 101 && x.data.pass === 1)
        && ons.length === wantN.length && ons.every((x, i) => x.data.sim === 1 && x.data.id === wantN[i].id && x.data.player === wantN[i].properties.tb.player && x.data.dueMs >= 0 && x.data.dueMs <= 101),
        perf.length + ' performer messages (bricks starting in the first 40 s: ' + wantB + ') · ' + ons.length + ' onsets (notes there: ' + wantN.length + ') · the percussionist\'s two lanes are one player: ' + new Set(ons.filter((x) => x.data.lane === 2 || x.data.lane === 3).map((x) => x.data.player)).size);
    // a playhead that starts at 75 s: every computer player is inside a container
    sent.length = 0; host.playStartTime = 100000; host.playStartOffset = 75 * 30; nowMs = 100000; LEO.tick(host, 75);
    const ins = sent.filter((x) => x.kind === 'performer');
    check('a playhead that starts inside a container: the brick says where it stands, and it is a new pass', ins.length === 3 && ins.every((x) => { const z = bricks.find((b) => String(b.id) === x.data.zone); return x.data.offsetMs === Math.round((75 - z.startTime) * 1000) && x.data.wholeMs === Math.round((z.endTime - z.startTime) * 1000) && x.data.lengthMs === Math.round((z.endTime - 75) * 1000) && x.data.pass === 2; }),
        ins.map((x) => x.data.id + ' ' + x.data.state + ' ' + (x.data.offsetMs / 1000).toFixed(1) + ' s into ' + (x.data.wholeMs / 1000).toFixed(1)).join(' · '));
    sent.length = 0; host.stopPlay();
    check('a stop reaches the engine', sent.length === 1 && sent[0].kind === 'performerstop', sent.map((x) => x.kind).join());
}

console.log(fails ? 'THREE_BODY_CHECK FAIL — ' + fails + ' check(s)' : 'THREE_BODY_CHECK PASS');
process.exit(fails ? 1 : 0);
