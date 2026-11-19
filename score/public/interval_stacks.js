// interval_stacks.js — INTERVAL STACKS IN THE STRIKES DRAWER (the Switch~ piece, SW-52 · RUNNING_LOG §223, 2026-11-19).
//
// His words: *"I want to do stacks of intervals essentially, but I want them per ensemble or at least in number configuration. So in this
// case 7 … a cluster of 7 chromatic pitches. That's the stack base. And then I'd like to be able to choose the transposition … take any one
// of those transpositions and basically make it like a tone row … a button to shuffle the order vertically on the ensemble … in order from
// bottom to top, but you give it to them in their proper octave … then reshuffle, keeping the same pitch, but potentially a different octave
// … present all the available C's in its range … I can also manually assign a different C to the cello. And then repeat this stack process
// with fifths … minor thirds … major thirds, fourths … major and minor sevenths to start."* On the stacks that hold fewer notes than
// players (the thirds, the minor sevenths): *"make sure the same note in any given octave maybe isn't present if possible, and maybe have a
// way of showing that in the available octaves."* His answers: bottom to top = cello · piano · alto sax · clarinet · violin · flute ·
// glockenspiel; the extra copy of a note = another transposition (so every stack lists its twelve).
//
// FOUR STAGES, one banner (INTERVAL STACKS, under the harmonic series) and one strip on the keyboard:
//   1 · THE STACK          an interval and a size (the ensemble's — 7 here)                       id `is:<kind>:<size>:<transposition>`
//   2 · THE TRANSPOSITION  the bottom note, C … B
//   3 · THE ORDER          `stacked` — the stack's own order up the players, bottom to top · `shuffle the order` — the same notes dealt
//                          as a row, another order each press (seeded)
//   4 · THE OCTAVES        each player takes its note in an octave of its range; `shuffle the octaves` picks again, the note kept —
//                          NEVER TWO PLAYERS ON THE SAME NOTE IN THE SAME OCTAVE while the ranges allow it; a column per player to the
//                          right of the keys shows every octave it could take (filled = playing · small = free · hollow = another player
//                          is there). SINCE SW-53 the columns are THE MAP OF KEYS (every key of the chord a player can reach; ONE CLICK places it) and a
//                          chord as placed can be kept as a SHAPE — see the two blocks below.
// A mixin over the drawer, loaded after spectrum_ui.js; the strike has the shape Spectrum.makeStrike gives, so takes, Hear and Insert
// treat it as any harmony. The deal respects the ticked rows. A voicing preset or a transpose of the core re-voices from the stack (the
// octaves chosen here are then dealt again by `shuffle the octaves`).
(function (root) {
'use strict';
const D = root.StrikeDrawer;
if (!D) { console.warn('[interval_stacks] the strikes drawer is not loaded'); return; }
const INST = () => (typeof INSTRUMENTS !== 'undefined' ? INSTRUMENTS : (root.INSTRUMENTS || {}));
const KINDS = [['cluster', 'cluster (semitones)', 1], ['m3', 'minor thirds', 3], ['M3', 'major thirds', 4], ['P4', 'fourths', 5], ['P5', 'fifths', 7], ['m7', 'minor sevenths', 10], ['M7', 'major sevenths', 11]];
const STEP = Object.fromEntries(KINDS.map(k => [k[0], k[2]])), KNAME = Object.fromEntries(KINDS.map(k => [k[0], k[1]]));
const BOTTOM_UP = ['cello', 'piano', 'alto_sax', 'clarinet', 'violin', 'flute', 'bowed_vibraphone'];   // his order, 2026-11-19
const PAL = ['#ff8a80', '#ffd180', '#fff59d', '#c5e1a5', '#80deea', '#90caf9', '#b39ddb', '#f48fb1', '#bcaaa4', '#a5d6a7', '#81d4fa', '#ce93d8'];   // a colour per note of the chord
const PCN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
const nm = m => PCN[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const INP = 'background:#111114;color:#ddd;border:1px solid #444;padding:0 2px;font-size:10px';
const BTN = 'background:#26262c;color:#e8cf9a;border:1px solid #555;border-radius:3px;padding:0 6px;font-size:10px;cursor:pointer';
function rng(seed) { let a = (seed >>> 0) || 1; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const parseId = id => { const m = /^is:([A-Za-z0-9]+):(\d+):(\d+)$/.exec(String(id || '')); return m && STEP[m[1]] ? { kind: m[1], n: +m[2], tr: +m[3] % 12 } : null; };
const idFor = (kind, n, tr) => 'is:' + kind + ':' + n + ':' + tr;
// the stack as written: n notes, each the interval above the last, from the transposition's note in the octave of C2 (kept on the 88 keys)
function stackMidis(kind, n, tr) { const out = []; for (let i = 0; i < n; i++) { let m = 36 + tr + i * STEP[kind]; while (m > 108) m -= 12; out.push(m); } return out; }
function makeStrike(kind, n, tr, id) {
    const midis0 = stackMidis(kind, n, tr), vel = 100, durMs = 100;
    const notes = midis0.map((m, i) => ({ objectId: 'is-' + kind + '-' + n + '-' + tr + '-' + i, layer: 2, instKey: 'piano', midi: m, technique: 'main', vel, durMs, dtMs: 0, dtNorm: 0, dtUnits: null, stackIndex: i }));
    const midis = midis0.slice().sort((a, b) => a - b), pcs = [...new Set(midis.map(m => m % 12))].sort((a, b) => a - b);
    const name = n + ' ' + KNAME[kind] + ' from ' + PCN[tr], index = 'stack@' + kind + ':' + n + ':' + PCN[tr];
    return { id: id || idFor(kind, n, tr), synthetic: true, istack: { kind, n, tr },
        harm: { value: 'istack:' + kind, root: PCN[tr], id: index, name, group: 'INTERVAL STACKS' },
        source: 'INTERVAL STACKS', index, t0: 0, tLast: 0, spanMs: 0, label: 'INTERVAL STACKS · ' + name + ' · ' + pcs.length + ' different note' + (pcs.length === 1 ? '' : 's'),
        notes, harmony: { count: midis.length, midis, pcs, instKeys: ['piano'] },
        rhythm: { simultaneityMs: 60, onsetsMs: [0], onsetsNorm: [0], onsetsUnits: [null], gapsMs: [], medianGapMs: null, groups: [{ dtMs: 0, objectIds: notes.map(x => x.objectId) }] },
        stats: { noteCount: midis.length, keptCount: 1, redactedCount: Math.max(0, midis.length - 1), midi: { min: midis[0], max: midis[midis.length - 1] }, vel: { avg: vel, min: vel, max: vel } } };
}

Object.assign(D, {
    istk() { const c = this.cfg; if (!c.istk || typeof c.istk !== 'object') c.istk = {}; const s = c.istk; if (!STEP[s.kind]) s.kind = 'cluster'; if (!(s.n >= 2 && s.n <= 12)) s.n = 7; if (!(s.tr >= 0 && s.tr < 12)) s.tr = 0; if (s.order !== 'row') s.order = 'stacked'; s.oSeed = s.oSeed || 1; s.octSeed = s.octSeed || 1; return s; },
    isStackId(id) { return !!parseId(id); },
    stackStrike(id) { const p = parseId(id); if (!p) return null; const C = this._isCache || (this._isCache = {}); return C[id] || (C[id] = makeStrike(p.kind, p.n, p.tr, id)); },
    // the players bottom to top, as lanes — the ticked rows only
    stackLanes() { const T = this.tracks(), B = this.busyLanes ? this.busyLanes() : null, out = []; BOTTOM_UP.forEach(key => { const l = T.findIndex(t => t.instKey === key && t.seatOf == null); if (l >= 0 && (!this.laneTicked || this.laneTicked(l, B))) out.push(l); }); return out; },
    // every octave of a voice's note its player can take with the technique it holds
    stackOctaves(v) {
        const inst = this.instOf(v.lane); if (!inst) return [];
        const q = (inst.techniques || []).find(t => t.key === v.tech) || {}, lo = q.rangeLow != null ? q.rangeLow : inst.rangeLow, hi = q.rangeHigh != null ? q.rangeHigh : inst.rangeHigh, out = [];
        for (let m = v.pc; m <= 127; m += 12) if (m >= lo && m <= hi) out.push(m);
        return out;
    },
    // stage 3: the notes to the players — voice k of the stack (or of the row) to the k-th player from the bottom
    stackDeal() {
        const s = this.istk(), lanes = this.stackLanes(), T = this.tracks(), vs = this.voices;
        const was = {}; vs.forEach(v => { if (v.lane >= 0 && v.tech) was[v.lane] = v.tech; });   // a row keeps the articulation he chose on it (the glockenspiel on the Vibraphone row) through a new deal
        vs.forEach(v => { v.lane = -1; delete v.restLane; v.pitch = v.pitch0; v.pc = ((v.pitch0 % 12) + 12) % 12; v.also = []; v.fold = 0; v.standIn = null; v.skip = false; v.piano = false; });
        let order = vs.map((_, i) => i);
        if (s.order === 'row') { const r = rng(s.oSeed * 7919 + 11); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; } }
        lanes.forEach((lane, k) => { const v = vs[order[k]]; if (!v) return; v.lane = lane; v.tech = was[lane] || this.defaultTech(lane); if (T[lane] && T[lane].instKey === 'piano') v.piano = true; });
        this.stackPickOctaves();
    },
    // stage 4: an octave for every player, its note kept — never two players on one key while another octave is free (the players with the
    // fewest octaves choose first, so a narrow range is not left without one)
    stackPickOctaves() {
        const s = this.istk(), r = rng(s.octSeed * 104729 + 5), used = new Set();
        const placed = this.voices.filter(v => v.lane >= 0).map(v => ({ v, c: this.stackOctaves(v) })).sort((a, b) => a.c.length - b.c.length);
        let shared = 0;
        placed.forEach(({ v, c }) => {
            if (!c.length) { v.skip = true; return; }
            const free = c.filter(m => !used.has(m)), pool = free.length ? free : c; if (!free.length) shared++;
            v.pitch = pool[Math.floor(r() * pool.length)]; used.add(v.pitch); v.fold = 0; v.standIn = null; v.skip = false; this.fitVoice(v);
        });
        this._isShared = shared;
    },
    stackStatus(what) {
        const st = this.strike, n = this.voices.filter(v => v.lane >= 0 && !v.skip).length, left = this.voices.length - n;
        this.setStatus((what ? what + ' · ' : '') + st.label + ' · ' + (this.istk().order === 'row' ? 'dealt as a row' : 'stacked bottom to top') + ' · ' + n + ' players' + (left > 0 ? ' · ' + left + ' note' + (left === 1 ? '' : 's') + ' with no player (more notes than ticked players)' : '') + (this._isShared ? ' · ' + this._isShared + ' unison' + (this._isShared === 1 ? '' : 's') + ' (no other octave was free)' : ''));
    },
    stackRedo(what, lanesToo) { if (!this.strike || !this.strike.istack) return; this.snapshot(); if (!lanesToo) this.voices.forEach(v => { if (v.lane < 0 && v.restLane != null) { v.lane = v.restLane; delete v.restLane; } }); if (lanesToo) this.stackDeal(); else this.stackPickOctaves(); this.save(); this.render(); this.refreshStackBanner(); this.stackStatus(what); },
    stackChoose() { const s = this.istk(); this.save(); this.select(idFor(s.kind, s.n, s.tr)); },
    // a player put on another octave of its note by hand (a double-click in its column)
    stackSetOctave(i, m) { const v = this.voices[i]; if (!v || v.lane < 0) return; this.snapshot(); v.pitch = m; v.fold = 0; v.standIn = null; v.skip = false; this.fitVoice(v); this.save(); this.render(); const T = this.tracks(); const twin = this.voices.find(w => w !== v && w.lane >= 0 && w.pitch === m); this.setStatus((T[v.lane] || {}).short + ' on ' + nm(m) + (twin ? ' — in unison with ' + ((T[twin.lane] || {}).short || '?') : '')); },

    refreshStackBanner() { const list = this.el && this.el.querySelector('#skSeq'); if (!list) return; list.querySelectorAll('.skBanner[data-bank="istack"], .skIsRow').forEach(e => e.remove()); this.renderStackBanner(); },
    renderStackBanner() {
        const list = this.el && this.el.querySelector('#skSeq'); if (!list || list.querySelector('.skBanner[data-bank="istack"]')) return;
        if (!this._isShapes) { this._isShapes = []; this.stackLoadShapes(); }
        const s = this.istk(), on = !!(this.strike && this.strike.istack), cur = this.cfg.strikeId === idFor(s.kind, s.n, s.tr);
        const opt = (v, t, sel) => '<option value="' + esc(v) + '"' + (sel ? ' selected' : '') + '>' + esc(t) + '</option>';
        let h = '<div class="skBanner" data-bank="istack" title="INTERVAL STACKS — a stack of one interval, as many notes as players; its transposition; the order up the ensemble; the octaves" style="position:static;background:#1b1b20;padding:3px 8px;color:#e8cf9a;border-bottom:1px solid #333;font-weight:600;white-space:nowrap;display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
            '<span style="flex:none">INTERVAL STACKS</span>' +
            '<select class="skIsKind" title="1 · the interval stacked" style="' + INP + ';font-weight:normal">' + KINDS.map(k => opt(k[0], k[1], k[0] === s.kind)).join('') + '</select>' +
            '<input class="skIsN" type="number" min="2" max="12" value="' + s.n + '" title="how many notes — the size of the ensemble" style="' + INP + ';width:34px;font-weight:normal">' +
            '<select class="skIsTr" title="2 · the transposition: the bottom note of the stack" style="' + INP + ';font-weight:normal">' + PCN.map((p, i) => opt(i, 'from ' + p, i === s.tr)).join('') + '</select>' +
            '<button class="skIsGo" title="take this stack: its notes go to the players" style="' + BTN + (cur ? ';background:rgba(201,160,90,.35)' : '') + '">' + (cur ? 'chosen' : 'choose') + '</button></div>';
        h += '<div class="skIsRow" style="padding:3px 8px;display:flex;gap:4px 6px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #2a2a30;' + (on ? '' : 'opacity:.45') + '">' +
            
            '<button class="skIsStacked" title="3 · the stack\'s own order up the players: cello, piano, alto sax, clarinet, violin, flute, glockenspiel" style="' + BTN + (on && s.order === 'stacked' ? ';background:rgba(201,160,90,.35)' : '') + '">stacked</button>' +
            '<button class="skIsRowBtn" title="3 · the same notes dealt to the players in another order (a row) — another order each press" style="' + BTN + (on && s.order === 'row' ? ';background:rgba(201,160,90,.35)' : '') + '">shuffle order</button>' +
            '<button class="skIsOct" title="4 · every player keeps its note and takes another octave of its range — never two players on the same key while another octave is free" style="' + BTN + '">shuffle octaves</button></div>';
        { const shapes = this._isShapes || [];
          h += '<div class="skIsRow skIsShapes" style="padding:3px 8px;display:flex;gap:4px 6px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #2a2a30;' + (on ? '' : 'opacity:.45') + '">' +
            '<button class="skIsSave" title="read the groups of the chord as it stands (how many notes, in which octave, how wide) and keep them as a shape" style="' + BTN + '">save shape</button>' +
            '<button class="skIsAgain" title="another chord of the chosen shape: the groups stay, the notes and the players change" style="' + BTN + (s.shape ? '' : ';opacity:.5') + '">shuffle in shape</button>' +
            shapes.map(x => '<button class="skIsShape" data-name="' + esc(x.name) + '" title="put this stack into the shape: ' + esc(x.name) + '" style="' + BTN + ';color:#cfe' + (on && s.shape === x.name ? ';background:rgba(120,200,170,.3)' : '') + '">' + esc(x.name) + '</button>').join('') + '</div>'; }
        const first = list.querySelector('.skBanner[data-bank]:not([data-bank="strikes"]):not([data-bank="spectrum"])');
        if (first) first.insertAdjacentHTML('beforebegin', h); else list.insertAdjacentHTML('beforeend', h);
        const b = list.querySelector('.skBanner[data-bank="istack"]'), row = list.querySelector('.skIsRow');
        b.querySelectorAll('select,input,button').forEach(el => ['mousedown', 'click', 'dblclick', 'keydown', 'keyup'].forEach(t => el.addEventListener(t, ev => ev.stopPropagation())));
        const take = () => { s.kind = b.querySelector('.skIsKind').value; s.n = Math.max(2, Math.min(12, Math.round(+b.querySelector('.skIsN').value) || 7)); s.tr = +b.querySelector('.skIsTr').value; this.stackChoose(); };
        b.querySelector('.skIsKind').addEventListener('change', take); b.querySelector('.skIsTr').addEventListener('change', take); b.querySelector('.skIsN').addEventListener('change', take);
        b.querySelector('.skIsGo').addEventListener('click', take);
        row.querySelector('.skIsStacked').addEventListener('click', () => { s.order = 'stacked'; this.stackRedo('stacked', true); });
        row.querySelector('.skIsRowBtn').addEventListener('click', () => { s.order = 'row'; s.oSeed = (s.oSeed || 1) + 1; this.stackRedo('a new order', true); });
        { const sr = list.querySelector('.skIsShapes'); if (sr) { sr.querySelector('.skIsSave').addEventListener('click', () => this.stackSaveShape()); sr.querySelector('.skIsAgain').addEventListener('click', () => { if (s.shape) this.stackApplyShape(s.shape, true); else this.setStatus('choose a shape first, or save one', true); }); sr.querySelectorAll('.skIsShape').forEach(b2 => b2.addEventListener('click', () => this.stackApplyShape(b2.dataset.name, false))); } }
        row.querySelector('.skIsOct').addEventListener('click', () => { s.octSeed = (s.octSeed || 1) + 1; this.stackRedo('new octaves', false); });
    },
    // ---------------------------------------------------------------- THE MAP OF KEYS (SW-53, 2026-11-19)
    // His words: "I see all the available pitches of that cluster across the whole range of all the instruments … and then, by color or
    // something, the available pitches per instrument" · "an easier method to manually assign … more visual feedback and fewer clicks".
    // To the right of the keys: one column per player, bottom player first; a dot on EVERY key of the chord the player can reach, each
    // note of the chord its own colour; the key it plays is the big ringed dot; a hollow dot is a key another player holds. ONE CLICK puts
    // the player there (and sounds it); a click on its own key rests the player (its column stays: a click brings it back). On the keys
    // themselves a faint mark shows every key of the chord.
    stackVoiceOn(lane) { return this.voices.find(v => v.lane === lane) || this.voices.find(v => v.lane < 0 && v.restLane === lane) || null; },
    stackRange(lane, tech) { const inst = this.instOf(lane); if (!inst) return null; const q = (inst.techniques || []).find(x => x.key === tech) || {}; return [q.rangeLow != null ? q.rangeLow : inst.rangeLow, q.rangeHigh != null ? q.rangeHigh : inst.rangeHigh]; },
    stackPcs() { const st = this.strike; return st && st.harmony ? st.harmony.pcs.slice() : []; },
    stackKeysFor(lane, tech) { const R = this.stackRange(lane, tech), pcs = this.stackPcs(), out = []; if (!R) return out; for (let m = R[0]; m <= R[1]; m++) if (pcs.indexOf(m % 12) >= 0) out.push(m); return out; },
    stackSetKey(lane, m) {
        const v = this.stackVoiceOn(lane), T = this.tracks(), short = (T[lane] || {}).short || ''; if (!v) return;
        this.snapshot();
        if (v.lane === lane && v.pitch === m) { v.restLane = lane; v.lane = -1; v.piano = false; this.save(); this.render(); this.setStatus(short + ' rests — click a dot in its column to bring it back'); return; }
        v.lane = lane; delete v.restLane; v.tech = v.tech || this.defaultTech(lane); v.pitch = m; v.pc = m % 12; v.fold = 0; v.standIn = null; v.skip = false; this.fitVoice(v);
        if (T[lane] && T[lane].instKey === 'piano') v.piano = true;
        this.save(); this.render();
        const twin = this.voices.find(w => w !== v && w.lane >= 0 && w.pitch === m);
        this.setStatus(short + ' on ' + nm(m) + (twin ? ' — in unison with ' + ((T[twin.lane] || {}).short || '?') : ''));
        try { const p = this.playNotes([{ lane, tech: v.tech, midi: m, vel: 100, onMs: 0, durMs: 600, cents: 0 }], short + ' ' + nm(m)); if (p && p.catch) p.catch(() => {}); } catch (e) {}
    },
    paintStackOctaves() {
        const svg = this.el && this.el.querySelector('#skKb'), wrap = this.el && this.el.querySelector('#skKbWrap'); if (!svg || !wrap || !this.strike || !this.strike.istack) return;
        const T = this.tracks(), h = this.rh(), R = this.range(), X0 = 176, DX = 20, r = Math.max(2.2, Math.min(5, h * 0.36)), pcs = this.stackPcs();
        const col = pc => PAL[Math.max(0, pcs.indexOf(pc)) % PAL.length];
        const lanes = this.stackLanes().filter(l => this.stackVoiceOn(l));
        const at = {}; this.voices.forEach(v => { if (v.lane >= 0) (at[v.pitch] = at[v.pitch] || []).push(v); });
        let s = '<style>.skIsDot:hover{stroke:#fff!important;stroke-width:2.6px!important;opacity:1!important}</style>';
        for (let m = R.lo; m <= R.hi; m++) if (pcs.indexOf(m % 12) >= 0) s += '<rect x="148" y="' + (this.keyY(m) + h * 0.25) + '" width="5" height="' + (h * 0.5) + '" fill="' + col(m % 12) + '" opacity="0.55"><title>' + nm(m) + ' — a key of this chord</title></rect>';
        lanes.forEach((lane, k) => {
            const v = this.stackVoiceOn(lane), cx = X0 + k * DX, short = (T[lane] || {}).short || '', resting = v.lane < 0;
            s += '<text x="' + cx + '" y="9" font-size="9" fill="' + (resting ? '#777' : '#ddd') + '" text-anchor="middle">' + esc(short) + '</text>';
            this.stackKeysFor(lane, v.tech || this.defaultTech(lane)).forEach(m => {
                if (m < R.lo || m > R.hi) return;
                const cy = this.keyY(m) + h / 2, mine = !resting && v.pitch === m, other = (at[m] || []).find(w => w !== v), c = col(m % 12);
                const tip = short + ' · ' + nm(m) + (mine ? ' — playing this · click: rest' : other ? ' — ' + ((T[other.lane] || {}).short || '') + ' is here · click: a unison' : ' — click: ' + short + ' plays this');
                s += '<circle class="skIsDot" data-lane="' + lane + '" data-m="' + m + '" cx="' + cx + '" cy="' + cy + '" r="' + (mine ? r * 1.35 : r) + '" fill="' + (other && !mine ? 'none' : c) + '" stroke="' + (mine ? '#fff' : c) + '" stroke-width="' + (mine ? 2 : 1.1) + '" opacity="' + (mine ? 1 : other ? 0.85 : 0.5) + '" style="cursor:pointer"><title>' + esc(tip) + '</title></circle>';
            });
        });
        svg.insertAdjacentHTML('beforeend', '<g class="skIsCols">' + s + '</g>');
        const W = Math.max(+svg.getAttribute('width') || 0, X0 + lanes.length * DX + 10);
        wrap.style.flex = '0 0 ' + W + 'px'; svg.setAttribute('width', W); svg.style.width = W + 'px';
        svg.querySelectorAll('.skIsDot').forEach(d => { d.addEventListener('dblclick', ev => ev.stopPropagation()); d.addEventListener('click', ev => { ev.stopPropagation(); this.stackSetKey(+d.dataset.lane, +d.dataset.m); }); });
    },

    // ---------------------------------------------------------------- SHAPES (SW-53, 2026-11-19)
    // His scenario: "in the 4th octave I assemble a 5-note cluster, and then 1 low and 1 high … that gets saved as a shape … I shuffle
    // within that shape … the next time I come back, I have that shape as an option for any of the stacks."
    // A SHAPE is the chord's GROUPS read from the keys as placed, bottom to top: a jump of a fourth or more starts a new group; each group
    // remembers how many notes, its lowest key and how wide it is. APPLIED to a stack: each group takes that many of the stack's notes, each
    // on the key of its note nearest the group's middle (as close together as the harmony allows), and the keys go to players who can reach
    // them — another draw of notes and players at every press. Kept in bank/panel_snapshots.json under `stackShapes` (the takes' store).
    stackShapeNow() {
        const ps = this.voices.filter(v => v.lane >= 0 && !v.skip).map(v => v.pitch).sort((a, b) => a - b); if (!ps.length) return null;
        const groups = []; let g = null;
        ps.forEach((p, i) => { if (!g || p - ps[i - 1] >= 5) { g = { n: 0, lo: p, span: 0 }; groups.push(g); } g.n++; g.span = p - g.lo; });
        return { n: ps.length, groups, name: groups.map(x => x.n + ' in oct ' + (Math.floor(x.lo / 12) - 1) + (x.n > 1 && x.span > 12 ? ' wide' : '')).join(' - ') };
    },
    async stackLoadShapes() { try { const file = await fetch('/api/snapshots', { cache: 'no-store' }).then(x => x.json()); const b = (file && file.panels && file.panels.stackShapes) || {}; this._isShapes = Object.keys(b).map(k => Object.assign({ name: k }, b[k].state || {})).filter(x => Array.isArray(x.groups)); } catch (e) { this._isShapes = this._isShapes || []; } this.refreshStackBanner(); },
    async stackSaveShape() {
        const sh = this.stackShapeNow(); if (!sh) { this.setStatus('no shape to save: no player has a key', true); return; }
        try { const r = await fetch('/api/snapshots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ panel: 'stackShapes', name: sh.name, comment: 'a shape read from ' + (this.strike ? this.strike.label : '') + ' as placed', state: { n: sh.n, groups: sh.groups } }) }).then(x => x.json()); if (!r.success) throw new Error(r.error || '?'); }
        catch (e) { this.setStatus('shape not saved: ' + e.message, true); return; }
        this.istk().shape = sh.name; this.save(); await this.stackLoadShapes(); this.setStatus('shape saved: ' + sh.name + ' — it is a button under INTERVAL STACKS now, for any stack');
    },
    // the stack put into a shape: a draw of which note goes in which group and which player takes which key
    stackApplyShape(name, bump) {
        const sh = (this._isShapes || []).find(x => x.name === name); if (!sh || !this.strike || !this.strike.istack) return;
        const s = this.istk(); s.shape = name; if (bump) s.shapeSeed = (s.shapeSeed || 1) + 1;
        const lanes = this.stackLanes().filter(l => this.stackVoiceOn(l)), pcsAll = this.strike.notes.map(n => n.midi % 12);
        const want = sh.groups.reduce((a, g) => a + g.n, 0), N = Math.min(want, lanes.length, pcsAll.length);
        const R = {}; lanes.forEach(l => { const v = this.stackVoiceOn(l); R[l] = this.stackRange(l, v.tech || this.defaultTech(l)); });
        const r = rng((s.shapeSeed || 1) * 15485863 + 7); let done = null;
        for (let tries = 0; tries < 300 && !done; tries++) {
            const pcs = pcsAll.slice(); for (let i = pcs.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = pcs[i]; pcs[i] = pcs[j]; pcs[j] = x; }
            const keys = [], seen = new Set(); let k = 0;
            for (const g of sh.groups) { const mid = g.lo + g.span / 2; for (let i = 0; i < g.n && k < N; i++, k++) { const pc = pcs[k]; let m = pc + 12 * Math.round((mid - pc) / 12), d = 12; while (seen.has(m)) { m += d; d = d > 0 ? -(d + 12) : -(d - 12); } seen.add(m); keys.push(m); } }
            // every key to a player who can reach it, nobody twice: the keys with the fewest able players first, then a search
            const able = keys.map(m => lanes.filter(l => R[l] && m >= R[l][0] && m <= R[l][1])), order = keys.map((_, i) => i).sort((a, b) => able[a].length - able[b].length), give = {}, used = new Set();
            const dfs = (j) => { if (j === order.length) return true; const i = order[j], c = able[i].filter(l => !used.has(l)); for (let q = c.length - 1; q > 0; q--) { const z = Math.floor(r() * (q + 1)); const x = c[q]; c[q] = c[z]; c[z] = x; } for (const l of c) { used.add(l); give[i] = l; if (dfs(j + 1)) return true; used.delete(l); } return false; };
            if (dfs(0)) done = { keys, give };
        }
        if (!done) { this.setStatus('the shape "' + name + '" does not fit these players with this stack — no draw puts every key on a player who can reach it', true); this.refreshStackBanner(); return; }
        this.snapshot();
        const T = this.tracks(), taken = new Set(Object.values(done.give));
        lanes.forEach(l => { const v = this.stackVoiceOn(l); if (!taken.has(l)) { v.restLane = l; v.lane = -1; v.piano = false; } });
        done.keys.forEach((m, i) => { const l = done.give[i], v = this.stackVoiceOn(l); v.lane = l; delete v.restLane; v.tech = v.tech || this.defaultTech(l); v.pitch = m; v.pc = m % 12; v.fold = 0; v.standIn = null; v.skip = false; this.fitVoice(v); v.piano = !!(T[l] && T[l].instKey === 'piano'); });
        this.save(); this.render(); this.refreshStackBanner();
        this.setStatus('shape ' + name + ' · ' + done.keys.length + ' players' + (want !== N ? ' (the shape has ' + want + ' notes, ' + N + ' used)' : '') + ' — "shuffle in shape" gives another');
    },

});

// ---------------------------------------------------------------- the hooks (each wraps what is there; nothing of the core is edited)
const _strikeById = D.strikeById;
D.strikeById = function (id) { return _strikeById.call(this, id) || (this.isStackId(id) ? this.stackStrike(id) : null); };
const _select = D.select;
D.select = function (id) {
    _select.call(this, id);
    if (!this.strike || this.strike.id !== id || !this.strike.istack) { try { this.refreshStackBanner(); } catch (e) {} return; }
    const p = this.strike.istack, s = this.istk(); s.kind = p.kind; s.n = p.n; s.tr = p.tr;
    this.stackDeal(); this.save(); this.render(); this.refreshStackBanner(); this.stackStatus('');
};
const _renderBanners = D.renderBanners;
D.renderBanners = function () { const r = _renderBanners.apply(this, arguments); try { this.renderStackBanner(); } catch (e) { console.warn('[interval_stacks] banner:', e); } return r; };
const _renderKeyboard = D.renderKeyboard;
D.renderKeyboard = function () { const r = _renderKeyboard.apply(this, arguments); try { this.paintStackOctaves(); } catch (e) { console.warn('[interval_stacks] keyboard:', e); } return r; };
root.IntervalStacks = { KINDS, parseId, idFor, stackMidis, makeStrike };
}(typeof self !== 'undefined' ? self : this));
