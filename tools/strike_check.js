#!/usr/bin/env node
// strike_check.js — THE STRIKE WINDOW, HEADLESS (PLAN.md 1.9 · 17.1 e; RUNNING_LOG §297): the page's pure functions, the catalogue,
// the rig score and the brick under a stub window — no page, no engine, no MIDI.
//   THE FUNCTIONS   the nine transformations on known lists (retrograde of 0 · 100 · 300 = 0 · 200 · 300; the inversion; a share
//                   dropped, never the first; a share doubled; the dice reproduce; one onset survives everything)
//   THE TIMINGS     every draw inside its range; call and response from the strike's length, with its floor
//   THE CATALOGUE   bank/strike_responses.json names only what the module knows; the dials a brick sends are its numbers
//   THE RIG         scores/strike-rig.json: a window over every take, every transformation and every timing on several, no pair
//                   twice; the sheet's expected answers are the functions' own
//   THE BRICK       under a stub window (the engine's le_objects.js · le_strike.js): the label, the message with its dials, the
//                   transport's tick sends each window once and tells the engine ONLY the notes inside a window, with their marks;
//                   the panel's preview is the functions' answer; a stop reaches the engine; the key makes a window over a strike
//   node tools/strike_check.js [--score strike-rig]          exit 0: STRIKE_CHECK PASS · 1: FAIL, each check named
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SC = require(path.join(ROOT, 'electronics', 'score', 'le_strike.js'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const NAME = arg('score', 'strike-rig'), FILE = path.join(ROOT, 'scores', NAME + '.json');
const CAT = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'strike_responses.json'), 'utf8'));
let fails = 0;
const check = (what, ok, detail) => { console.log('  ' + (ok ? 'ok   ' : 'FAIL ') + what + ' — ' + detail); if (!ok) fails++; };
const near = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 0.01 : tol);
const times = (l) => l.map((o) => Math.round(o.atMs * 1000) / 1000), marks = (l) => l.map((o) => o.mark).join(' ');
const mk = (l) => l.map(([t, m]) => ({ atMs: t, mark: m }));

console.log('STRIKE_CHECK the functions:');
{
    const ons = mk([[0, 'f'], [100, 'mf'], [300, 'p']]), D = SC.dialsFor(CAT, 'retrograde', 'rightAfter');
    const rg = SC.transform('retrograde', ons, D, SC.rng(1));
    check('retrograde of 0 · 100 · 300 is 0 · 200 · 300, the marks reversed with their onsets', times(rg).join(' ') === '0 200 300' && marks(rg) === 'p mf f', times(rg).join(' ') + ' · ' + marks(rg));
    const iv = SC.transform('invert', ons, D, SC.rng(1));
    check('inverted: each gap becomes longest + shortest − itself (100 · 200 → 200 · 100)', times(iv).join(' ') === '0 200 300' && marks(iv) === 'f mf p', times(iv).join(' '));
    const ap = SC.transform('asPlayed', ons, D, SC.rng(1));
    check('as played is unchanged', times(ap).join(' ') === '0 100 300' && marks(ap) === 'f mf p', times(ap).join(' '));
    const sp = SC.transform('spread', ons, SC.dialsFor(CAT, 'spread', 'rightAfter'), SC.rng(2)), f = sp[1].atMs / 100;
    check('spread: every gap × one draw in range', near(sp[2].atMs, 100 * f + 200 * f) && f >= CAT.transformations.spread.range[0] && f <= CAT.transformations.spread.range[1], '× ' + f.toFixed(3));
    const cp = SC.transform('compress', ons, SC.dialsFor(CAT, 'compress', 'rightAfter'), SC.rng(2)), g = cp[1].atMs / 100;
    check('compressed: × a draw in its range', near(cp[2].atMs, 300 * g) && g >= CAT.transformations.compress.range[0] && g <= CAT.transformations.compress.range[1], '× ' + g.toFixed(3));
    const six = mk([[0, 'f'], [98, 'mf'], [157, 'f'], [191, 'mp'], [237, 'ff'], [397, 'f']]);
    const sc1 = SC.transform('scramble', six, {}, SC.rng(3)), sc2 = SC.transform('scramble', six, {}, SC.rng(3)), sc3 = SC.transform('scramble', six, {}, SC.rng(4));
    const gaps = (l) => l.slice(1).map((o, i) => Math.round(o.atMs - l[i].atMs)).sort((a, b) => a - b).join(' ');
    check('scrambled: the same gaps in another order; the same seed, the same order; another seed, another', gaps(sc1) === gaps(six) && times(sc1).join() === times(sc2).join() && times(sc1).join() !== times(sc3).join() && marks(sc1) === marks(six), times(sc1).join(' ') + ' | ' + times(sc3).join(' '));
    const ro = SC.transform('rotate', six, {}, SC.rng(3));
    check('rotated: the gaps rotated, the span kept', gaps(ro) === gaps(six) && near(ro[5].atMs, 397) && times(ro).join() !== times(six).join(), times(ro).join(' '));
    const th = SC.transform('thin', six, SC.dialsFor(CAT, 'thin', 'rightAfter'), SC.rng(3));
    check('thinned: a share dropped (2 … 3 of 6), never the first, the rest at their times', th.length >= 3 && th.length <= 4 && th[0].atMs === 0 && th.every((o) => six.some((s) => s.atMs === o.atMs && s.mark === o.mark)), th.length + ' of 6: ' + times(th).join(' '));
    const tk = SC.transform('thicken', six, SC.dialsFor(CAT, 'thicken', 'rightAfter'), SC.rng(3)), [cLo, cHi] = CAT.transformations.thicken.copyMs;
    const copies = tk.filter((o) => !six.some((s) => s.atMs === o.atMs));
    check('thickened: a share doubled (2 … 3 of 6), each copy ' + cLo + ' … ' + cHi + ' ms after an original at its mark, the list in time order',
        copies.length >= 2 && copies.length <= 3 && copies.every((c) => six.some((s) => c.atMs - s.atMs >= cLo && c.atMs - s.atMs <= cHi && s.mark === c.mark)) && tk.every((o, i) => !i || o.atMs >= tk[i - 1].atMs), tk.length + ' onsets: ' + times(tk).join(' '));
    const one = mk([[0, 'p']]);
    check('one onset survives every transformation at 0', SC.TYPES.every((t) => { const r = SC.transform(t, one, SC.dialsFor(CAT, t, 'rightAfter'), SC.rng(9)); return r.length === 1 && r[0].atMs === 0 && r[0].mark === 'p'; }), SC.TYPES.length + ' transformations');
    const r1 = SC.rng(3), r2 = SC.rng(3);
    check('the dice: the same seed, the same draws; every draw in [0, 1)', [1, 2, 3, 4, 5].every(() => { const a = r1(), b = r2(); return a === b && a >= 0 && a < 1; }), 'a Lehmer generator, 16807 mod 2^31 − 1');
}
console.log('STRIKE_CHECK the timings:');
{
    const lenMs = 397;
    for (const tm of SC.TIMINGS) {
        const W = CAT.timings[tm], D = SC.dialsFor(CAT, 'asPlayed', tm);
        const draws = [1, 2, 3, 4, 5, 6, 7, 8].map((s) => SC.timing(tm, lenMs, D, SC.rng(s)));
        const lo = W.rangeS ? W.rangeS[0] * 1000 : Math.max(W.minMs, lenMs) * W.ofStrike[0], hi = W.rangeS ? W.rangeS[1] * 1000 : Math.max(W.minMs, lenMs) * W.ofStrike[1];
        check(SC.TIMING_NAME[tm] + ': every draw inside ' + Math.round(lo) + ' … ' + Math.round(hi) + ' ms', draws.every((d) => d >= lo - 1e-6 && d <= hi + 1e-6), draws.map((d) => Math.round(d)).join(' '));
    }
    const D = SC.dialsFor(CAT, 'asPlayed', 'callResponse');
    check('call and response counts a one-onset strike as ' + CAT.timings.callResponse.minMs + ' ms long', SC.timing('callResponse', 0, D, SC.rng(1)) >= CAT.timings.callResponse.minMs * CAT.timings.callResponse.ofStrike[0], Math.round(SC.timing('callResponse', 0, D, SC.rng(1))) + ' ms');
}
console.log('STRIKE_CHECK the catalogue:');
{
    const tk = Object.keys(CAT.transformations || {}), wk = Object.keys(CAT.timings || {});
    check('every transformation and timing named is one the module knows, and every one the module knows is named', tk.every((k) => SC.TYPES.includes(k)) && wk.every((k) => SC.TIMINGS.includes(k)) && SC.TYPES.every((k) => tk.includes(k)) && SC.TIMINGS.every((k) => wk.includes(k)), tk.length + ' + ' + wk.length);
    const d = SC.dialsFor(CAT, 'thicken', 'callResponse');
    check('the dials a brick sends are the catalogue\'s numbers', d.lo === CAT.transformations.thicken.share[0] && d.copyHi === CAT.transformations.thicken.copyMs[1] && d.wLo === CAT.timings.callResponse.ofStrike[0] && d.minMs === CAT.timings.callResponse.minMs, SC.dialsText(d));
    check('the text form of the dials parses back whole', JSON.stringify(SC.dialsParse(SC.dialsText(d))) === JSON.stringify(d), SC.dialsText(d));
    check('the module\'s defaults are the file\'s numbers (the engine mirrors the defaults)', JSON.stringify(SC.dialsFor(null, 'spread', 'muchLater')) === JSON.stringify(SC.dialsFor(CAT, 'spread', 'muchLater')) && SC.DEFAULTS.gapMs === CAT.gapMs, SC.dialsText(SC.dialsFor(null, 'spread', 'muchLater')));
}
console.log('STRIKE_CHECK the rig (' + NAME + '):');
const score = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : null;
let wins = [], notes = [];
if (!score) check('the rig score exists', false, FILE + ' — node tools/build_strike_rig.js');
else {
    wins = score.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecStrike').sort((a, b) => a.startTime - b.startTime);
    notes = score.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.layer < score.tracks.length);
    // the page's save drops metadata.rig (his save of the rig, 2026-10-09): the takes are then read from the windows' own tags
    const takes = ((score.metadata || {}).rig || {}).takes || wins.map((w) => ((w.properties || {}).rig || {}).take).filter(Boolean);
    check('a window over every take, each with a rhythm, a timing and its own seed', wins.length === takes.length && wins.every((w) => SC.TYPES.includes(w.elec.type) && SC.TIMINGS.includes(w.elec.timing) && w.elec.seed > 0) && new Set(wins.map((w) => w.elec.seed)).size === wins.length, wins.length + ' windows, ' + takes.length + ' takes');
    const under = (w) => notes.filter((n) => n.startSeconds >= w.startTime - 0.05 && n.startSeconds <= w.endTime);
    check('every window holds its take\'s notes, and no other window\'s', wins.every((w) => under(w).length > 0 && under(w).every((n) => n.groupId === under(w)[0].groupId)) && wins.every((w, i) => !i || w.startTime > wins[i - 1].endTime), wins.map((w) => under(w).length).join(' '));
    const tc = {}, wc = {}, pairs = new Set();
    wins.forEach((w) => { tc[w.elec.type] = (tc[w.elec.type] || 0) + 1; wc[w.elec.timing] = (wc[w.elec.timing] || 0) + 1; pairs.add(w.elec.type + '/' + w.elec.timing); });
    check('every transformation and every timing on several strikes; no pair twice', SC.TYPES.every((t) => tc[t] >= 2) && SC.TIMINGS.every((t) => wc[t] >= 2) && pairs.size === wins.length, Object.entries(tc).map(([k, v]) => k + ' ' + v).join(' · ') + ' | ' + Object.entries(wc).map(([k, v]) => k + ' ' + v).join(' · '));
    check('every note of the rig is in the set and at the dynamic the builder says', notes.every((n) => n.recVel === notes[0].recVel) && notes.filter((n) => n.layer === 4 || n.layer === 5).every((n) => n.technique === 'stac_vel'), (score.metadata.rig || {}).art + ' · ' + (score.metadata.rig || {}).dyn + ' · ' + notes.length + ' notes');
}
let LEO_ = null;   // the module under the stub, kept for the section's checks below
console.log('STRIKE_CHECK the brick (the engine\'s module under a stub window):');
{
    const sent = [], doc = { createElement: () => { const n = { children: [], style: {}, appendChild(k) { this.children.push(k); return k; }, addEventListener() {}, setAttribute() {}, blur() {} }; return n; } };
    const WHO = { port0: 'bfl', port1: 'bcl', port2: 'perc', port3: 'perc', port4: 'va', port5: 'vc' };
    let nowMs = 0;
    const win = { addEventListener() {}, document: doc, LE: { cfg: { players: [] }, ready: Promise.resolve(), playerOf: (port) => WHO[port] || null, send: (kind, data) => { sent.push({ kind, data }); return Promise.resolve(null); } } };
    const ctx = vm.createContext({ window: win, LE: win.LE, document: doc, fetch: () => Promise.resolve({ ok: false }), performance: { now: () => nowMs }, setTimeout, clearTimeout, console, Promise });
    for (const f of ['le_objects.js', 'le_strike.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'electronics', 'score', f), 'utf8'), ctx, { filename: f });
    const LEO = win.LEObjects; LEO_ = LEO;
    const objs = score ? score.objects : [];
    const host = { objects: objs, playStartTime: 0, playStartOffset: 0, pixelsPerSecond: 30, activeLane: 2, selectedObject: null, isPartAudible: () => true, stopPlay() {}, renderZone() {}, showPropertyPanel() {}, markDirty() {}, pushUndoState() {}, getTimeAtPlayhead: () => 50,
        createZone(p) { const z = Object.assign({ id: 'zn-new-' + (objs.length + 1), type: 'zone', properties: {} }, p); objs.push(z); return z; }, saveStatus: {} };
    LEO.attach(host, { lanes: 6, portOf: (l) => 'port' + l, laneLabel: (l) => 'L' + l });
    const w1 = wins[0];
    if (w1) {
        const m = LEO.strikeMessage(w1, null, 80), d = SC.dialsParse(m.dials);
        check('a window\'s message: its span, its rhythm and timing, its seed, its gap, its level and deal, the dials of the catalogue', m.id === w1.elec.id && m.type === w1.elec.type && m.timing === w1.elec.timing && m.seed === w1.elec.seed && m.lengthMs === Math.round((w1.endTime - w1.startTime) * 1000) && m.dueMs === 80 && m.gapMs === CAT.gapMs && m.level === 'mimic' && m.deal === 'robin' && m.processed === 1 && JSON.stringify(d) === JSON.stringify(SC.dialsFor(CAT, w1.elec.type, w1.elec.timing)) && !('offsetMs' in m),
            LEO.strikeLabel(w1) + ' | dials ' + m.dials);
        const x = LEO.strikeExpected(host, w1), ons = x.notes.map((o) => ({ atMs: Math.round((o.startSeconds - x.notes[0].startSeconds) * 10000) / 10, mark: LEO.noteMark(o) }));
        const a = SC.answer(ons, w1.elec, SC.dialsFor(CAT, w1.elec.type, w1.elec.timing));
        check('the panel\'s preview is the functions\' own answer, from the notes under the window with their marks', x.onsets.length === a.onsets.length && x.onsets.every((o, i) => near(o.atMs, a.onsets[i].atMs) && o.mark === a.onsets[i].mark) && near(x.afterMs, a.afterMs) && ons.every((o) => o.mark === 'f'),
            x.notes.length + ' notes · ' + x.onsets.map((o) => Math.round(o.atMs)).join(' ') + ' · +' + (x.afterMs / 1000).toFixed(2) + ' s · marks ' + [...new Set(ons.map((o) => o.mark))].join(' '));
        // the transport: the first three windows, a frame every 16 ms
        const end = wins[2] ? wins[2].endTime + 1 : w1.endTime + 1;
        for (let t = 0; t <= end; t += 0.016) { nowMs = t * 1000; LEO.tick(host, t); }
        const st = sent.filter((s) => s.kind === 'strike'), on = sent.filter((s) => s.kind === 'onset');
        const inside = notes.filter((n) => n.startSeconds > 0 && n.startSeconds <= end && wins.some((w) => n.startSeconds >= w.startTime - 0.05 && n.startSeconds <= w.endTime)).sort((a, b) => a.startSeconds - b.startSeconds);
        const wantW = wins.filter((w) => w.startTime <= end).length;
        check('played from the start: each window sends its message once, ahead of its start; the engine is told ONLY the notes inside a window, each with its player and its mark',
            st.length === wantW && new Set(st.map((s) => s.data.zone)).size === wantW && st.every((s) => s.data.dueMs >= 0 && s.data.dueMs <= 101 && s.data.pass === 1)
            && on.length === inside.length && on.every((s, i) => s.data.sim === 1 && s.data.id === inside[i].id && s.data.mark === 'f' && WHO['port' + inside[i].layer] === s.data.player),
            st.length + ' windows · ' + on.length + ' onsets told (notes inside the windows there: ' + inside.length + '; notes in the stretch: ' + notes.filter((n) => n.startSeconds <= end).length + ')');
        sent.length = 0; host.playStartTime = 100000; host.playStartOffset = (w1.startTime + 0.2) * 30; nowMs = 100000; LEO.tick(host, w1.startTime + 0.2);
        const ins = sent.filter((s) => s.kind === 'strike');
        check('a playhead that starts inside a window: the message says where it stands, and it is a new pass', ins.length === 1 && ins[0].data.offsetMs === 200 && ins[0].data.wholeMs === Math.round((w1.endTime - w1.startTime) * 1000) && ins[0].data.pass === 2, JSON.stringify({ offsetMs: ins[0] && ins[0].data.offsetMs, wholeMs: ins[0] && ins[0].data.wholeMs }));
        sent.length = 0; host.stopPlay();
        check('a stop reaches the engine', sent.length === 1 && sent[0].kind === 'strikestop', sent.map((s) => s.kind).join());
        // the key: a window over the selected strike's group
        const n0 = notes.find((n) => n.groupId === wins[1].properties.rig && false) || notes.filter((n) => n.startSeconds >= wins[1].startTime && n.startSeconds <= wins[1].endTime)[0];
        host.selectedObject = n0; const before = objs.length, z = LEO.addStrike(), grp = notes.filter((n) => n.groupId === n0.groupId);
        check('the key over a selected strike makes a window from its first note − 0.3 s to its last + 0.5 s, with the catalogue\'s defaults', z && objs.length === before + 1 && near(z.startTime, Math.min(...grp.map((n) => n.startSeconds)) - 0.3, 0.002) && near(z.endTime, Math.max(...grp.map((n) => n.startSeconds)) + 0.5, 0.002) && z.elec.type === 'asPlayed' && z.elec.timing === 'rightAfter' && z.elec.gapMs === CAT.gapMs && z.layer === n0.layer,
            z ? z.startTime + ' → ' + z.endTime + ' s on L' + z.layer + ' · ' + LEO.strikeLabel(z) : 'no zone');
        // the panel
        const sec = doc.createElement('div'), el = (tag, props, kids) => { const n = doc.createElement(tag); Object.assign(n, props || {}); (kids || []).forEach((k) => n.appendChild(k)); return n; };
        LEO.strikePanel(w1, sec, { el, rowEl: (label, c) => el('div', {}, [el('label', { textContent: label }), c]), note: (t) => el('div', { textContent: t }), commit: (fn) => fn() });
        const labels = sec.children.map((r) => r.children[0] && r.children[0].textContent).filter(Boolean);
        check('the panel: its rows, and the preview line', ['Window', 'Rhythm', 'Timing', 'Seed', 'Gap (ms)', 'Level', 'Deal', 'Processed too', 'Players', 'Samples', 'Answer of', 'Label'].every((l) => labels.includes(l)) && sec.children.some((r) => /notes under the window/.test(r.textContent || '')), labels.join(' · '));
        LEO.strikeApply(w1, { type: 'thin', timing: 'muchLater', level: 'ff', deal: 'all', answerOf: 'W1', players: ['bfl', 'vc'], samples: ['a-1', 'b-2'] });
        const m2 = LEO.strikeMessage(w1, null, 0);
        check('the box writes the whole setting; the message carries it', m2.type === 'thin' && m2.timing === 'muchLater' && m2.level === 'ff' && m2.deal === 'all' && m2.answerOf === 'W1' && m2.players === 'bfl,vc' && m2.samples === 'a-1,b-2' && /wLo=6,wHi=15/.test(m2.dials), LEO.strikeLabel(w1));
    } else check('a window to test the brick on', false, 'no rig');
}
// ---- THE SECTION (PLAN.md 1.9 · 17.3; RUNNING_LOG §346): his strikes under the windows tools/strike_windows.js laid — run after a change to
// bank/strike_section.json or the tool, the score laid again first. Skipped, said, where no score of that name holds such windows.
{
    const SNAME = arg('section', 'sec05b'), SFILE = path.join(ROOT, 'scores', SNAME + '.json');
    const sec = fs.existsSync(SFILE) ? JSON.parse(fs.readFileSync(SFILE, 'utf8')) : null;
    const zs = sec ? sec.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecStrike' && o.properties && o.properties.strikeSection).sort((a, b) => a.startTime - b.startTime) : [];
    console.log('STRIKE_CHECK the section (' + SNAME + '):');
    if (!zs.length) console.log('  —    no windows of tools/strike_windows.js in scores/' + SNAME + '.json: skipped');
    else {
        const W = require(path.join(ROOT, 'tools', 'strike_windows.js')), C = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'strike_section.json'), 'utf8'));
        const strikes = W.strikesOf(sec), bare = +C.noElectronicsLast || 0, n = strikes.length - bare;
        const byGroup = new Map(strikes.map((x) => [x.group, x])), own = (z) => byGroup.get(z.properties.strikeSection.group);
        check('a window over every strike but the last ' + bare + ', in time order, each on its own strike', zs.length === n && zs.every((z, i) => own(z) === strikes[i] && z.elec.id === 'W' + (i + 1)), zs.length + ' windows · ' + strikes.length + ' strikes');
        check('each window says a word — notated or open (the file\'s letters at a first lay; a window laid before keeps its word, a new strike takes newStrikes — DEC-124)', zs.every((z) => z.elec.mode === 'open' || z.elec.mode === 'notated'), zs.filter((z) => z.elec.mode === 'open').length + ' open · ' + zs.filter((z) => z.elec.mode === 'notated').length + ' notated · as laid: ' + zs.map((z) => (z.elec.mode === 'open' ? 'O' : 'N')).join(''));
        const mg = (+C.minGapMs || 50) / 1000;
        check('no two windows overlap; at least ' + ms(mg) + ' ms between them', zs.every((z, i) => !i || z.startTime - zs[i - 1].endTime >= mg - 0.0015), 'the least: ' + ms(Math.min(...zs.slice(1).map((z, i) => z.startTime - zs[i].endTime))) + ' ms');
        // the engine's ear: a window takes a hit from 50 ms before its start to its grace after its end
        const hears = (z, t) => t >= z.startTime - 0.05 && t <= z.endTime + (z.elec.graceMs != null ? z.elec.graceMs : z.elec.gapMs) / 1000;
        const all = strikes.flatMap((x, i) => x.notes.map((o) => ({ t: o.startSeconds, i })));
        check('every hit of a strike with electronics is heard by its own window and by no other; no hit of the bare last strikes by any', all.every((h) => { const by = zs.map((z, k) => (hears(z, h.t) ? k : -1)).filter((k) => k >= 0); return h.i < n ? by.length === 1 && by[0] === h.i : by.length === 0; }), all.length + ' hits');
        check('the silence that ends a strike is longer than the strike\'s own widest gap', zs.every((z) => z.elec.gapMs > own(z).widest * 1000), 'gaps ' + Math.min(...zs.map((z) => z.elec.gapMs)) + ' … ' + Math.max(...zs.map((z) => z.elec.gapMs)) + ' ms');
        const F = +(C.open || {}).factor || 2, opens = zs.filter((z) => z.elec.mode === 'open');
        check('an open window holds its strike and is ' + F + ' × its length (the engine\'s least 50 ms)', opens.every((z) => { const x = own(z), L = x.l - x.f; return z.startTime <= x.f + 0.0006 && z.endTime >= x.l - 0.0006 && z.endTime - z.startTime >= Math.max(F * L, 0.05) - 0.002; }),
            opens.length + ' open, ' + ms(Math.min(...opens.map((z) => z.endTime - z.startTime))) + ' … ' + ms(Math.max(...opens.map((z) => z.endTime - z.startTime))) + ' ms');
        // the form: the answers by where a strike falls — 1 · 2 · 3 · 1 in time, each stretch shorter, the shortest ≥ minRatio of the longest
        const runs = []; zs.forEach((z) => { const a = SC.chainOf(z.elec).length + 1; if (!runs.length || runs[runs.length - 1].a !== a) runs.push({ a, from: own(z).f, k: 0 }); runs[runs.length - 1].k++; });
        const ST = C.stretches || {}, want = ST.answers || [1], seed = zs[0].properties.strikeSection.seed, grow = Math.round(+ST.grow || 0);
        const L = W.lay(sec, C, CAT, seed), len = L.stretches.map((q) => q.lengthS);   // the score as it stands: the windows in it give the words (DEC-124)
        // by his counts (stretches.strikes, DEC-127): each stretch holds the count the tool gave it; else the rolled shape in time
        const shapeOk = L.byCount ? runs.map((r) => r.k).join() === L.byCount.counts.join() : grow
            ? len.slice(0, grow).every((v, i) => !i || v > len[i - 1]) && len[0] / len[grow - 1] >= (+ST.minRatio || 0) - 1e-9 && len.slice(grow).every((v, i, a) => v < (i ? a[i - 1] : len[0]))   // rising to the peak, then a coda each shorter and shorter than the opening
            : len.every((v, i) => !i || v < len[i - 1]) && Math.min(...len) / Math.max(...len) >= (+ST.minRatio || 0) - 1e-9;
        check('the form: the strikes answered ' + want.join(' · ') + ' times in turn; ' + (L.byCount ? 'cut by his counts of strikes (' + (ST.strikes || []).join(' · ') + (L.byCount.exact ? '' : ' — shared out in proportion') + ')' : grow ? 'the first ' + grow + ' stretches rising (the first ≥ ' + ST.minRatio + ' of the peak), then a coda each shorter than the one before and than the opening' : 'each stretch shorter than the one before, the shortest ≥ ' + ST.minRatio + ' of the longest'),
            runs.map((r) => r.a).join() === want.join() && shapeOk,
            runs.map((r) => '×' + r.a + ': ' + r.k + ' strikes').join(' · ') + ' | ' + len.map((v) => v.toFixed(1)).join(' · ') + ' s');
        if ((CAT.samples || {}).raw === false) check('the replies play the processed versions only (the catalogue\'s samples.raw false): every window says so', zs.every((z) => z.elec.raw === false) && (LEO_ ? LEO_.strikeMessage(zs[0], null, 0).raw === 0 : true), zs.length + ' windows');
        check('the score\'s windows are what the tool lays from his file at seed ' + seed + ' (a window changed by hand in the page shows here)', L.wins.length === zs.length && L.wins.every((w, i) => w.start === zs[i].startTime && w.end === zs[i].endTime && JSON.stringify(w.elec) === JSON.stringify(zs[i].elec)), L.wins.length + ' windows');
        const ends = L.wins.map((w) => w.cas[w.cas.length - 1].endS), firstBare = strikes[n];
        if (C.keepEndingClear && firstBare) check('the ending is kept clear: the last answer is over before the first bare strike (a lone answer that cannot fit is said)', L.wins.every((w) => w.cas[w.cas.length - 1].endS < firstBare.f || w.unavoidable), Math.max(...ends).toFixed(2) + ' s against ' + firstBare.f.toFixed(2) + ' s · ' + L.wins.filter((w) => w.swapped.length || w.dropped).length + ' windows kept clear, ' + L.wins.filter((w) => w.unavoidable).length + ' over');
        // the cascade on the brick: the message, the label, the preview
        const z3 = zs.find((z) => SC.chainOf(z.elec).length === 2), x3 = z3 && own(z3);
        if (z3 && LEO_) {
            const m = LEO_.strikeMessage(z3, null, 0), ch = SC.chainOf(z3.elec), cas = SC.cascade(x3.ons, z3.elec, CAT);
            check('a window answered three times: its message says so — the links, each link\'s own numbers, its word, its grace', m.answers === 3 && m.chain === ch.map((l) => l.type + ':' + l.timing + ':' + l.seed).join(',') && m.dials2 === SC.dialsText(SC.dialsFor(CAT, ch[0].type, ch[0].timing)) && m.dials3 === SC.dialsText(SC.dialsFor(CAT, ch[1].type, ch[1].timing)) && m.mode === z3.elec.mode && m.graceMs === z3.elec.graceMs && m.gapMs === z3.elec.gapMs,
                LEO_.strikeLabel(z3) + ' | chain ' + m.chain);
            const xp = LEO_.strikeExpected({ objects: sec.objects, isPartAudible: () => true }, z3);
            check('its preview is the cascade: answer 2 from answer 1\'s rhythm, answer 3 from answer 2\'s, each begun after the one before',
                xp && xp.answers.length === 3 && xp.answers.every((a, i) => a.onsets.length === cas[i].onsets.length && a.onsets.every((o, j) => near(o.atMs, cas[i].onsets[j].atMs)) && near(a.fromMs, cas[i].fromMs))
                && cas.every((a, i) => !i || JSON.stringify(a.onsets) === JSON.stringify(SC.answer(cas[i - 1].onsets, ch[i - 1], SC.dialsFor(CAT, ch[i - 1].type, ch[i - 1].timing)).onsets)) && cas.every((a, i) => !i || a.fromMs > cas[i - 1].fromMs + SC.spanMs(cas[i - 1].onsets)),
                xp ? xp.answers.map((a) => SC.TYPE_NAME[a.type] + ' at ' + a.startS.toFixed(2) + ' s').join(' → ') : 'no preview');
            const one = zs.find((z) => !SC.chainOf(z.elec).length), m1 = LEO_.strikeMessage(one, null, 0);
            check('a window answered once sends no chain — the message as it always was, with its word and its grace', !('chain' in m1) && !('answers' in m1) && !('dials2' in m1) && m1.mode === one.elec.mode && m1.graceMs === one.elec.graceMs, LEO_.strikeLabel(one));
        }
    }
    function ms(x) { return Math.round(x * 1000); }
}
console.log(fails ? 'STRIKE_CHECK FAIL — ' + fails + ' check(s)' : 'STRIKE_CHECK PASS');
process.exit(fails ? 1 : 0);
