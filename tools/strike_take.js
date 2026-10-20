#!/usr/bin/env node
// strike_take.js — A TAKE OF THE STRIKES DRAWER INTO A SCORE, without the page (RUNNING_LOG §292, 2026-10-09).
//
//   node tools/strike_take.js --score sec05-strikes-a --take strikes01[,strikes02,…] [--art staccato] [--dyn f]
//                             [--at 2] [--every 4] [--new] [--dry]
//
// His words: "insert the take Strikes 1 … can you use the staccato? I forgot to choose the staccato orchestration for some of
// those … let's have them all go in as F."
//
// WHAT IT DOES — the drawer's own four gestures, in its own code: load the take · press an articulation set (--art: percussive ·
// spiccato · staccato · ordinario) · choose the dynamic (--dyn ppp … fff) · Insert @ playhead (--at seconds; several takes land
// --every seconds apart, start to start). Nothing of the drawer is re-written here: score/public/strike_drawer.js and its mixins
// are LOADED, in the page's order, into a window that has no screen (the DOM calls fall on a stub), and `loadTake` · `applyArtSet` ·
// `insert` are the page's. So a note this tool writes is the note Insert @ playhead writes — the same lanes, voices, folds,
// stand-ins, the second mallet seat as a drawn note, the group bar on META, the height that means the dynamic.
//
// WITHOUT --art the take's own voices stand; without --dyn the take's own dynamic (mf when it names none).
//
// --new   the score must NOT exist: it is made from scores/decibel.json (the day-one empty score) with the page's lanes.
// THE BASE of an existing score is the NEWER of the save and the page's working copy (his unsaved edits kept), as every tool
// here; the result is written as the save — then File ▾ → Reload in the page.
// --dry   prints what would be written, writes nothing.
//
// AS A MODULE (the rig's builder, 17.1 d): require('./strike_take.js') → { openDrawer, placeTake, newScore, lanes }:
//   const D = openDrawer();                              the drawer loaded once (its bank and its takes from disk)
//   placeTake(D, score, 'strikes01', { art, dyn, at })   → { lines: [...], notes: [objects], group }; the score's objects and nextId grown
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'score', 'public');

const die = (msg) => { console.error(msg); process.exit(1); };

// ---- the page's lanes, read from the page
const lanes = () => {
    const html = fs.readFileSync(path.join(PUB, 'composer.html'), 'utf8');
    const tracksSrc = (html.match(/const TRACKS = (\[[\s\S]*?\]);/) || [])[1], metaSrc = (html.match(/const META_LAYER = (\d+);/) || [])[1];
    if (!tracksSrc || metaSrc == null) throw new Error('composer.html: TRACKS or META_LAYER not found');
    return { html, tracksSrc, metaSrc, tracks: vm.runInNewContext(tracksSrc, {}), meta: +metaSrc };
};
// a NEW score from the day-one empty one, with the page's lanes
const newScore = () => {
    const L = lanes(), score = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', 'decibel.json'), 'utf8'));
    score.tracks = L.tracks.map((t) => ({ id: t.id, label: t.label, short: t.short, instKey: t.instKey }));
    score.objects = []; score.markers = []; score.nextId = 1;
    score.metadata = { created: new Date().toISOString(), modified: new Date().toISOString() };
    return score;
};

// ---- a window with no screen: every DOM call falls on a stub
const stubEl = () => ({ style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } }, children: [], innerHTML: '', textContent: '', value: '',
    querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener() {}, removeEventListener() {}, appendChild() {}, insertBefore() {}, remove() {}, closest() { return null; }, setAttribute() {}, getAttribute() { return null; }, getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 }; } });

// the drawer loaded once: strike_drawer.js and its mixins, in the page's own order, with the pure modules they read before them
function openDrawer() {
    const L = lanes(), said = [];
    const Composer = { objects: [], nextId: 1, isPlaying: false, pixelsPerSecond: 50, scrollOffset: 0, _t: 0,
        getTimeAtPlayhead() { return this._t; }, pushUndoState() {}, renderAll() {}, markDirty() {}, loadVelocityRemap() {} };
    const box = { console: { log() {}, warn(...a) { said.push('warn: ' + a.join(' ')); }, error(...a) { said.push('error: ' + a.join(' ')); } },
        document: Object.assign(stubEl(), { readyState: 'complete', body: stubEl(), getElementById() { return null; }, createElement() { return stubEl(); } }),
        localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
        setTimeout() { return 0; }, clearTimeout() {}, setInterval() { return 0; }, clearInterval() {}, requestAnimationFrame() { return 0; },
        performance: { now: () => Date.now() }, navigator: {}, Composer,
        fetch: (url, opt) => {   // the page's own reads of the bank, served from disk — GET only; nothing is ever posted
            const u = String(url).split('?')[0], rel = u === '/api/snapshots' ? 'bank/panel_snapshots.json' : /^\/bank\/[A-Za-z0-9_.-]+\.json$/.test(u) ? u.slice(1) : null;
            if ((opt && opt.method && opt.method !== 'GET') || !rel || !fs.existsSync(path.join(ROOT, rel))) return Promise.reject(new Error('strike_take.js reads the bank only: ' + u));
            const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
            return Promise.resolve({ ok: true, status: 200, json: async () => JSON.parse(text), text: async () => text });
        } };
    box.self = box; box.window = box; box.addEventListener = () => {}; box.removeEventListener = () => {};
    vm.createContext(box);
    const run = (src, label) => { try { vm.runInContext(src, box, { filename: label }); } catch (e) { throw new Error('could not load ' + label + ': ' + e.message); } };
    run('const TRACKS = ' + L.tracksSrc + '; const META_LAYER = ' + L.metaSrc + ';', 'the lanes (composer.html)');
    run(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8'), 'sandbox/instruments.js');
    const order = L.html.split('\n').map((l) => (l.match(/<script src="\/([a-z_]+\.js)"/) || [])[1]).filter(Boolean);
    const from = order.indexOf('strike_chords.js'), to = order.indexOf('spectrum_ui.js');
    if (from < 0 || to < 0) throw new Error('composer.html: the drawer\'s scripts not found');
    ['velocity_remap.js', 'accel_calc.js', 'beating_calc.js', 'cresc.js', 'spacing.js'].concat(order.slice(from, to + 1)).forEach((f) => run(fs.readFileSync(path.join(PUB, f), 'utf8'), f));
    const D = box.StrikeDrawer;
    if (!D) throw new Error('the strikes drawer did not load');
    // the drawer, given its bank and its takes; its screen calls silenced (painting only — the state is cfg · voices · rowKeys)
    D.el = stubEl(); D.render = () => {}; D.writeFields = () => {}; D.save = () => {};
    D.setStatus = (msg, bad) => { said.push((bad ? 'REFUSED: ' : '') + msg); };
    D.db = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'scattered_strikes.json'), 'utf8'));
    D.takeList = ((JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels || {}).strikes) || {};
    return { D, Composer, said, tracks: L.tracks, meta: L.meta };
}

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], nm = (m) => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
// one take into a score: the drawer's four gestures; the score's objects and nextId are grown in place
async function placeTake(drawer, score, take, o) {
    const { D, Composer, said, tracks } = drawer, art = o && o.art, dyn = o && o.dyn, at = +((o && o.at) != null ? o.at : 2);
    if (!D.takeList[take]) throw new Error('no take named "' + take + '" in bank/panel_snapshots.json (the strikes panel has: ' + Object.keys(D.takeList).join(' · ') + ')');
    Composer.objects = score.objects; Composer.nextId = score.nextId || 1;
    said.length = 0;
    D.strike = null;                                   // a take is loaded from nothing, as after an F5
    await D.loadTake(take);                            // async since the harmony sources (harm_source_ui.js)
    if (!D.strike) throw new Error('take "' + take + '": its strike ' + D.takeList[take].state.strikeId + ' is not in bank/scattered_strikes.json');
    if (art) { D.applyArtSet(art); if (D.cfg.artSet !== art) throw new Error('--art: no articulation set named "' + art + '"'); }
    if (dyn) { D.cfg.dyn = dyn; if (D.dynName() !== dyn) throw new Error('--dyn: one of ppp pp p mp mf f ff fff'); }
    const t = +at.toFixed(3), before = Composer.objects.length;
    Composer._t = t;
    D.insert();
    const made = Composer.objects.slice(before), notes = made.filter((x) => x.sonifyNote != null);
    if (!notes.length) throw new Error('take "' + take + '": nothing inserted — ' + said.join(' | '));
    score.objects = Composer.objects; score.nextId = Composer.nextId;   // Insert REPLACES the host's array (its filter of an earlier insert): the score takes the new one
    const silent = D.voices.filter((v) => !D.sounds(v)).map((v) => nm(v.pitch));
    const lines = [take + ' — strike #' + D.strike.index + ' · ' + (D.artSetNow() || 'a mixed set') + ' · ' + D.dynName() + ' · at ' + t.toFixed(3) + ' s · ' + notes.length + ' notes, ' + (made.length - notes.length) + ' group bar'
        + (silent.length ? ' · ' + silent.length + ' pitches of the chord have no player in the take (' + silent.join(' ') + ')' : '')];
    notes.slice().sort((a, b) => a.startSeconds - b.startSeconds).forEach((x) => lines.push('    ' + (x.startSeconds.toFixed(3) + ' → ' + x.endSeconds.toFixed(3)).padEnd(18) + ((tracks[x.layer] || {}).short || ('L' + x.layer)).padEnd(5) + nm(x.sonifyNote).padEnd(5) + x.technique + (x.sonifyMode === 'plain' ? '' : '  (drawn — the second mallet seat)')));
    said.filter((s) => /^(REFUSED|warn|error)/.test(s)).forEach((s) => lines.push('    ' + s));
    return { lines, notes, made, group: made[0] && made[0].groupId, strike: D.strike.index, art: D.artSetNow(), dyn: D.dynName() };
}

module.exports = { openDrawer, placeTake, newScore, lanes };

// ---- the CLI
if (require.main === module) {
    const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i >= 0 && process.argv[i + 1] != null && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : def; };
    const flag = (name) => process.argv.includes('--' + name);
    const name = arg('score', null), takes = String(arg('take', '')).split(',').map((s) => s.trim()).filter(Boolean);
    if (!name || !takes.length) die('usage: node tools/strike_take.js --score <name> --take <take>[,<take>…] [--art staccato] [--dyn f] [--at 2] [--every 4] [--new] [--dry]');
    const art = arg('art', null), dyn = arg('dyn', null), at = +arg('at', 2), every = +arg('every', 4), dry = flag('dry'), isNew = flag('new');
    const file = path.join(ROOT, 'scores', name + '.json'), work = path.join(ROOT, 'scores', name + '-work.json');
    if (isNew && fs.existsSync(file)) die('--new: scores/' + name + '.json exists already');
    if (!isNew && !fs.existsSync(file)) die('no such score: scores/' + name + '.json (a new one: --new)');
    let score, base;
    if (isNew) { score = newScore(); base = '(a NEW score, from scores/decibel.json)'; }
    else {
        const useWork = fs.existsSync(work) && fs.statSync(work).mtimeMs > fs.statSync(file).mtimeMs;
        score = JSON.parse(fs.readFileSync(useWork ? work : file, 'utf8'));
        base = useWork ? '(the base: HIS working copy — unsaved edits kept)' : '(the base: the save)';
    }
    (async () => {
        const drawer = openDrawer(), out = [base];
        for (let k = 0; k < takes.length; k++) out.push(...(await placeTake(drawer, score, takes[k], { art, dyn, at: at + k * every })).lines);
        score.metadata = score.metadata || {}; score.metadata.modified = new Date().toISOString();
        if (dry) out.push('(dry — nothing written)');
        else { fs.writeFileSync(file, JSON.stringify(score)); out.push('written: scores/' + name + '.json — ' + score.objects.length + ' objects' + (isNew ? '' : ' · in the page: File ▾ → Reload')); }
        console.log(out.join('\n'));
    })().catch((e) => die(e.message || String(e)));
}
