// phase_panel.js — THE PHASE MACHINE (the Switch~ piece, SW-42, 2026-11-11; RUNNING_LOG §165): a take from the strikes drawer re-articulated
// by every player as a pulse stream; the streams start together at one tempo and are driven through a PLAN of segments — hold · shift · cut —
// out of phase, into a held phase pattern, into a multi-tempo pattern, back to unison … (phase_engine.js is the arithmetic). Minimal by his
// word ("very, very minimal design … I usually learn what I need when I start doing it"). STRUCTURALLY multitempo_panel.js: its button,
// its draggable box, its MIDI glue through the strikes drawer's routes (the remapped velocity and CC7, the CC0 and the bend as Hear sends
// them), E.panic() the one stop. What is new: the plan, the strategies' shuffle (a seed, re-rolled), LOCK and CAPTURE while it plays, the
// favorites (bank/phase_states.json, a store of its own), and INSERT — the events written into the score as plain struck notes in one group.
//
//   the take     chosen from the strikes drawer's takes (HarmonySel.pool loads it there; D.notesFor('orch') hands out one note or chord per
//                lane with its technique, velocity anchor, cents and the articulation's own length); a lane is a STREAM, toggled on or off
//   bpm          the reference tempo — stream 1's "the one that stays"
//   note         the attack's length: the articulation's own (default) or a fraction of the stream's beat
//   the plan     lines: kind · seconds · target (a strategy + amount + seed, or a favorite) · [take for this segment] — the harmony of a
//                segment is its take's, the plan's take otherwise ("apply a harmony to any given time section")
//   Play         from the first line (or the line chosen); LOCK snaps every stream to the bpm keeping its lag, CAPTURE saves the state as a
//                favorite — a PHASE state (bpm + lags) or a TEMPI pattern (the tempi as they stand); Stop = panic
//   Insert       the whole plan from the playhead, as grp-phase-<id>; the plan into databases.phase
(function (root) {
'use strict';
function HOST() { return (typeof Composer !== 'undefined') ? Composer : null; }
const PE = root.PhaseEngine, E = root.MorphEmit;
const D_ = () => root.StrikeDrawer || null, H_ = () => root.HarmonySel || null;
const TRK = () => (typeof TRACKS !== 'undefined' ? TRACKS : (root.TRACKS || []));
if (!PE || !E) { console.warn('[phase_panel] needs phase_engine.js + morph_emit.js'); return; }

const STORE = 'phase.v1', LIB = 'phase', LEAD_MS = 250, CC0_LEAD_MS = 30, COLOR = '#2E9E8E';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const INP = 'background:#1b1b20;color:#ddd;border:1px solid #444;padding:1px 4px;font:11px system-ui,sans-serif';
const BTN = 'background:#2a2a30;color:#ddd;border:1px solid #555;border-radius:3px;padding:1px 6px;cursor:pointer;font:11px system-ui,sans-serif';
const STRATS = [['unison', 'unison — one tempo, aligned'], ['unison:free', 'unison — one tempo, lags kept'], ['phase:fan', 'phase · fan (lags of 1/N beat)'], ['phase:random', 'phase · random lags'], ['phase:pairs', 'phase · two groups, half a beat apart'], ['phase:canon', 'phase · canon (each AMOUNT beat behind)'],
    ['tempi:neighbors', 'tempi · neighbors (each AMOUNT % above the last)'], ['tempi:ratios', 'tempi · ratios (AMOUNT = 3:4:5)'], ['tempi:spread', 'tempi · spread ± AMOUNT %'], ['tempi:random', 'tempi · random ± AMOUNT %'], ['tempi:cycle', 'tempi · a cycle of AMOUNT s (random ± 8 %, snapped)']];
const NOTE_LEN = [['artic', 'the articulation\'s own'], ['0.125', '⅛ beat'], ['0.25', '¼ beat'], ['0.5', '½ beat'], ['0.9', 'a beat (90 %)'], ['1.8', 'two beats']];

const P = {
    el: null, cfg: { take: '', bpm: 60, noteLen: 'artic', lanesOff: [] },
    plan: { id: 'p' + Date.now().toString(36), segments: [] },
    takes: {},            // name → { lane: [notes] } — the take's notes by lane, cached once loaded
    favorites: {},        // name → { kind, bpm, tempi?, offsets?, note }
    live: null,           // while playing: { base, plan, streams, events, lockedAt }
    status: '',
    init() {
        const host = document.getElementById('mtBtn') || document.getElementById('pulseBtn') || document.getElementById('morphBtn');
        if (!host) { console.warn('[phase_panel] no button to anchor to'); return; }
        const btn = document.createElement('button'); btn.id = 'phBtn'; btn.textContent = 'PHASE';
        btn.title = 'the phase machine: a take re-articulated by every player, the streams driven out of phase and back (SW-42)';
        btn.addEventListener('click', () => this.toggle());
        host.parentNode.insertBefore(btn, host.nextSibling);
        this.restore(); this.build();
        const prev = E.onStop; E.onStop = () => { if (prev) { try { prev(); } catch (e) {} } this.onStopped(); };
    },
    toggle(on) { if (!this.el) return; const show = on != null ? on : this.el.style.display === 'none'; this.el.style.display = show ? 'block' : 'none'; if (show) { this.refreshTakes(); this.libLoad(); this.render(); } },
    save() { try { localStorage.setItem(STORE, JSON.stringify({ cfg: this.cfg, plan: this.plan })); } catch (e) {} },
    restore() { try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s && s.cfg) this.cfg = Object.assign(this.cfg, s.cfg); if (s && s.plan && Array.isArray(s.plan.segments)) this.plan = s.plan; } catch (e) {} },
    setStatus(m, bad) { this.status = m; const s = this.el && this.el.querySelector('#phStatus'); if (s) { s.textContent = m; s.style.color = bad ? '#e88' : '#9a9'; } },

    // ---- the box
    build() {
        const d = document.createElement('div'); d.id = 'phPanel';
        d.style.cssText = 'position:fixed;right:16px;top:150px;width:640px;z-index:9000;background:rgba(28,28,32,0.97);border:1px solid #2E9E8E;border-radius:6px;padding:10px 12px;color:#ddd;font:11px/1.45 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,0.5);display:none';
        d.innerHTML = '<div id="phDrag" style="cursor:move;font-weight:600;color:#7fd6c6;margin:-10px -12px 8px;padding:7px 12px;border-bottom:1px solid #444;background:rgba(46,158,142,0.18)">PHASE &nbsp;<span style="color:#5f9c92;font-weight:400">a take, every player a pulse stream · hold · shift · cut</span><span id="phClose" style="float:right;cursor:pointer;color:#888">&#10005;</span></div>' +
            '<div id="phStatus" style="color:#9a9;margin-bottom:6px;min-height:14px">idle</div>' +
            '<div id="phHead" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px"></div>' +
            '<div id="phLanes" style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;margin-bottom:6px"></div>' +
            '<div id="phPlan" style="margin-bottom:6px"></div>' +
            '<div id="phFav" style="margin-bottom:6px"></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:6px"><button id="phPlay" style="' + BTN + '">Play</button><button id="phStop" style="' + BTN + '">Stop</button><button id="phLock" style="' + BTN + '" title="snap every stream to the bpm, keeping its lag — the drift stops here">LOCK</button><button id="phInsert" style="' + BTN + '" title="write the whole plan into the score from the playhead, as one group">Insert at playhead</button></div>' +
            '<div style="color:#666">SPACE play / stop while this box has focus · a shift with a PHASE target arrives with that pattern exactly; a TEMPI target is a plain glide</div>';
        document.body.appendChild(d); this.el = d;
        d.querySelector('#phClose').addEventListener('click', () => this.toggle(false));
        d.querySelector('#phPlay').addEventListener('click', () => this.play());
        d.querySelector('#phStop').addEventListener('click', () => E.panic());
        d.querySelector('#phLock').addEventListener('click', () => this.lock());
        d.querySelector('#phInsert').addEventListener('click', () => this.insert());
        d.setAttribute('tabindex', '0');
        d.addEventListener('keydown', (e) => { if (e.target.matches('input,select,textarea')) return; if (e.key === ' ') { e.preventDefault(); e.stopPropagation(); E.isPlaying() ? E.panic() : this.play(); } });
        // draggable, as the multitempo box is
        const h = d.querySelector('#phDrag'); let sx = 0, sy = 0, bx = 0, by = 0, on = false;
        h.addEventListener('mousedown', (e) => { on = true; sx = e.clientX; sy = e.clientY; const r = d.getBoundingClientRect(); bx = r.left; by = r.top; e.preventDefault(); });
        window.addEventListener('mousemove', (e) => { if (!on) return; d.style.left = (bx + e.clientX - sx) + 'px'; d.style.top = (by + e.clientY - sy) + 'px'; d.style.right = 'auto'; });
        window.addEventListener('mouseup', () => { on = false; });
    },
    render() {
        if (!this.el) return;
        const c = this.cfg, D = D_(), names = D && D.takeList ? Object.keys(D.takeList).sort((a, b) => String(D.takeList[b].saved || '').localeCompare(String(D.takeList[a].saved || ''))) : [];
        const q = (s) => this.el.querySelector(s);
        q('#phHead').innerHTML = '<label>take <select id="phTake" style="' + INP + ';max-width:220px"><option value="">— choose —</option>' + names.map((n) => '<option value="' + esc(n) + '"' + (n === c.take ? ' selected' : '') + '>' + esc(n) + '</option>').join('') + '</select></label>' +
            '<label>bpm <input id="phBpm" type="number" min="20" max="300" step="1" value="' + c.bpm + '" style="width:48px;' + INP + '"></label>' +
            '<label>note <select id="phLen" style="' + INP + '">' + NOTE_LEN.map(([v, l]) => '<option value="' + v + '"' + (v === c.noteLen ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></label>' +
            '<button id="phReload" style="' + BTN + '" title="re-read the takes">&#8635;</button>';
        q('#phTake').addEventListener('change', (e) => { this.setTake(e.target.value); });
        q('#phBpm').addEventListener('change', (e) => { c.bpm = clamp(+e.target.value || 60, 20, 300); this.save(); this.renderPlan(); });
        q('#phLen').addEventListener('change', (e) => { c.noteLen = e.target.value; this.save(); });
        q('#phReload').addEventListener('click', () => this.refreshTakes(true));
        this.renderLanes(); this.renderPlan(); this.renderFav();
    },
    renderLanes() {
        const T = TRK(), tk = this.takes[this.cfg.take], lanes = tk ? Object.keys(tk).map(Number).sort((a, b) => a - b) : [];
        const box = this.el.querySelector('#phLanes');
        if (!lanes.length) { box.innerHTML = '<span style="color:#777">streams: ' + (this.cfg.take ? 'the take places no notes' : 'choose a take') + '</span>'; return; }
        box.innerHTML = '<span style="color:#9a9">streams</span>' + lanes.map((L) => { const off = this.cfg.lanesOff.includes(L), n = tk[L]; return '<span class="phLane" data-lane="' + L + '" title="' + esc(n.map((x) => this.pn(x.midi) + (x.cents ? ' ' + (x.cents > 0 ? '+' : '') + Math.round(x.cents) + '¢' : '') + ' · ' + x.tech).join(' | ')) + '" style="cursor:pointer;padding:0 6px;border:1px solid #555;border-radius:3px;' + (off ? 'color:#666' : 'background:#2E9E8E;color:#111') + '">' + esc((T[L] || {}).short || L) + ' ' + esc(this.pn(n[0].midi)) + (n.length > 1 ? '+' + (n.length - 1) : '') + '</span>'; }).join('');
        box.querySelectorAll('.phLane').forEach((el) => el.addEventListener('click', () => { const L = +el.dataset.lane, i = this.cfg.lanesOff.indexOf(L); if (i >= 0) this.cfg.lanesOff.splice(i, 1); else this.cfg.lanesOff.push(L); this.save(); this.renderLanes(); this.renderPlan(); }));
    },
    pn(m) { const N = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; return N[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); },
    renderPlan() {
        const box = this.el.querySelector('#phPlan'), segs = this.plan.segments, streams = this.streams(), N = streams.length;
        const favNames = Object.keys(this.favorites).sort();
        const R = N ? PE.run(this.planFor(), streams) : null;
        let h = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px"><span style="color:#9a9">plan</span><button id="phAdd" style="' + BTN + '">+ line</button>' + (R ? '<span style="color:#777">' + N + ' streams · ' + R.events.length + ' attacks · ' + R.end + ' s</span>' : '<span style="color:#777">no streams yet</span>') + '</div>';
        segs.forEach((sg, i) => {
            const t = sg.target || { kind: 'unison' }, isHold = sg.kind === 'hold', key = t.kind === 'unison' ? (t.align === false ? 'unison:free' : 'unison') : t.kind;
            const rec = R && R.segments[i], shown = rec ? (sg.kind === 'hold' ? 'held' : (rec.offsets ? 'lags ' + rec.offsets.map((o) => o.toFixed(2)).join(' ') + ' · ' : '') + 'tempi ' + rec.to.join(' ')) : '';
            h += '<div class="phSeg" data-i="' + i + '" style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;padding:2px 4px;border-left:3px solid ' + (sg.locked ? '#e0b060' : '#2E9E8E') + ';margin-bottom:2px;background:rgba(255,255,255,0.03)">' +
                '<span style="color:#777;width:14px">' + (i + 1) + '</span>' +
                '<select class="phKind" style="' + INP + '">' + PE.KINDS.map((k) => '<option value="' + k + '"' + (k === sg.kind ? ' selected' : '') + '>' + k + '</option>').join('') + '</select>' +
                (sg.kind === 'cut' ? '' : '<input class="phSec" type="number" min="0" step="1" value="' + (sg.seconds || 0) + '" style="width:44px;' + INP + '" title="seconds"><span style="color:#777">s</span>') +
                (isHold ? '<span style="color:#777">— the state as it stands</span>' :
                    '<select class="phStrat" style="' + INP + '">' + STRATS.map(([v, l]) => '<option value="' + v + '"' + (v === key ? ' selected' : '') + '>' + l + '</option>').join('') + (favNames.length ? '<optgroup label="favorites">' + favNames.map((n) => '<option value="state:' + esc(n) + '"' + (t.kind === 'state' && t.name === n ? ' selected' : '') + '>★ ' + esc(n) + '</option>').join('') + '</optgroup>' : '') + '</select>' +
                    (this.hasAmount(key) ? '<input class="phAmt" type="text" value="' + esc(t.amount != null ? t.amount : this.defAmount(key)) + '" style="width:40px;' + INP + '" title="AMOUNT">' : '') +
                    (this.hasSeed(key) ? '<span style="color:#777">seed</span><input class="phSeed" type="number" min="1" step="1" value="' + (t.seed || 1) + '" style="width:40px;' + INP + '"><button class="phRoll" style="' + BTN + '" title="the next seed — a new draw">&#8635;</button>' : '')) +
                '<select class="phTk" style="' + INP + ';max-width:120px" title="the harmony of this segment: its own take, or the plan\'s"><option value="">(plan\'s take)</option>' + Object.keys(D_() && D_().takeList || {}).sort().map((n) => '<option value="' + esc(n) + '"' + (sg.take === n ? ' selected' : '') + '>' + esc(n) + '</option>').join('') + '</select>' +
                '<span style="flex:1 1 auto;color:#8c8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + esc(shown) + '">' + esc(shown) + '</span>' +
                (rec && rec.warn.length ? '<span style="color:#e88" title="' + esc(rec.warn.join(' · ')) + '">!</span>' : '') +
                '<button class="phUp" style="' + BTN + '" title="move up">&#9650;</button><button class="phDn" style="' + BTN + '" title="move down">&#9660;</button><button class="phDel" style="' + BTN + '" title="remove">&#10005;</button></div>';
        });
        box.innerHTML = h;
        box.querySelector('#phAdd').addEventListener('click', () => { segs.push({ kind: segs.length ? 'shift' : 'hold', seconds: segs.length ? 30 : 10, target: { kind: 'tempi:neighbors', amount: 2, seed: 1 } }); this.save(); this.renderPlan(); });
        box.querySelectorAll('.phSeg').forEach((row) => {
            const i = +row.dataset.i, sg = segs[i], q = (s) => row.querySelector(s);
            q('.phKind').addEventListener('change', (e) => { sg.kind = e.target.value; if (sg.kind !== 'hold' && !sg.target) sg.target = { kind: 'tempi:neighbors', amount: 2, seed: 1 }; this.save(); this.renderPlan(); });
            if (q('.phSec')) q('.phSec').addEventListener('change', (e) => { sg.seconds = Math.max(0, +e.target.value || 0); this.save(); this.renderPlan(); });
            if (q('.phStrat')) q('.phStrat').addEventListener('change', (e) => { const v = e.target.value; if (v.startsWith('state:')) sg.target = { kind: 'state', name: v.slice(6) }; else if (v === 'unison:free') sg.target = { kind: 'unison', align: false }; else sg.target = { kind: v, amount: this.defAmount(v), seed: (sg.target && sg.target.seed) || 1 }; this.save(); this.renderPlan(); });
            if (q('.phAmt')) q('.phAmt').addEventListener('change', (e) => { const v = e.target.value.trim(); sg.target.amount = /:/.test(v) ? v : +v; if (sg.target.kind === 'tempi:ratios') sg.target.ratios = v; if (sg.target.kind === 'tempi:cycle') sg.target.cycle = +v; this.save(); this.renderPlan(); });
            if (q('.phSeed')) q('.phSeed').addEventListener('change', (e) => { sg.target.seed = Math.max(1, +e.target.value | 0); this.save(); this.renderPlan(); });
            if (q('.phRoll')) q('.phRoll').addEventListener('click', () => { sg.target.seed = ((sg.target.seed || 1) | 0) + 1; this.save(); this.renderPlan(); });
            q('.phTk').addEventListener('change', (e) => { sg.take = e.target.value || null; if (sg.take) this.loadTakeNotes(sg.take); this.save(); this.renderPlan(); });
            q('.phUp').addEventListener('click', () => { if (i > 0) { [segs[i - 1], segs[i]] = [segs[i], segs[i - 1]]; this.save(); this.renderPlan(); } });
            q('.phDn').addEventListener('click', () => { if (i < segs.length - 1) { [segs[i + 1], segs[i]] = [segs[i], segs[i + 1]]; this.save(); this.renderPlan(); } });
            q('.phDel').addEventListener('click', () => { segs.splice(i, 1); this.save(); this.renderPlan(); });
        });
    },
    hasAmount(k) { return /^(phase:canon|tempi:)/.test(k); },
    hasSeed(k) { return /random|cycle/.test(k); },
    defAmount(k) { return k === 'tempi:ratios' ? '3:4:5' : k === 'tempi:cycle' ? 12 : k === 'phase:canon' ? 0.25 : k === 'tempi:neighbors' ? 2 : 5; },
    renderFav() {
        const box = this.el.querySelector('#phFav'), names = Object.keys(this.favorites).sort();
        box.innerHTML = '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span style="color:#9a9">favorites</span>' +
            '<button id="phCapPh" style="' + BTN + '" title="save the state as it stands NOW (playing: this moment; idle: the plan\'s end) as a PHASE pattern — the bpm and each stream\'s lag">capture phase</button>' +
            '<button id="phCapTp" style="' + BTN + '" title="save the tempi as they stand NOW as a TEMPI pattern">capture tempi</button>' +
            '<button id="phSavePlan" style="' + BTN + '" title="save this plan under a name (bank/phase_states.json)">save plan</button>' +
            '<select id="phLoadPlan" style="' + INP + '"><option value="">load plan…</option>' + Object.keys(this.plans || {}).sort().map((n) => '<option value="' + esc(n) + '">' + esc(n) + '</option>').join('') + '</select></div>' +
            (names.length ? '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:3px">' + names.map((n) => { const f = this.favorites[n]; return '<span class="phFavChip" data-n="' + esc(n) + '" title="' + esc((f.kind || '') + ' · bpm ' + f.bpm + (f.tempi ? ' · tempi ' + f.tempi.join(' ') : '') + (f.offsets ? ' · lags ' + f.offsets.join(' ') : '') + (f.note ? ' · ' + f.note : '') + ' — click to hear it held 12 s; ✕ deletes') + '" style="cursor:pointer;padding:0 5px;border:1px solid #555;border-radius:3px;color:#e0b060">★ ' + esc(n) + ' <span class="phFavDel" style="color:#777">✕</span></span>'; }).join('') + '</div>' : '');
        box.querySelector('#phCapPh').addEventListener('click', () => this.capture('phase'));
        box.querySelector('#phCapTp').addEventListener('click', () => this.capture('tempi'));
        box.querySelector('#phSavePlan').addEventListener('click', () => this.savePlan());
        box.querySelector('#phLoadPlan').addEventListener('change', (e) => { const n = e.target.value; if (n && this.plans[n]) { this.plan = JSON.parse(JSON.stringify(this.plans[n].plan)); if (this.plans[n].cfg) Object.assign(this.cfg, this.plans[n].cfg); this.save(); this.setStatus('plan loaded: ' + n); this.render(); } });
        box.querySelectorAll('.phFavChip').forEach((el) => { el.addEventListener('click', (ev) => { const n = el.dataset.n; if (ev.target.classList.contains('phFavDel')) { if (window.confirm('Delete favorite "' + n + '"?')) this.libDelete('favorite', n); return; } this.hearFavorite(n); }); });
    },

    // ---- the takes: a take's notes by lane
    async refreshTakes(force) { const D = D_(); if (!D) return; try { if (!D.takeList || force) await D.refreshTakes(); } catch (e) {} if (this.cfg.take && !this.takes[this.cfg.take]) await this.loadTakeNotes(this.cfg.take); this.render(); },
    async setTake(name) { this.cfg.take = name; this.save(); if (name) await this.loadTakeNotes(name); this.render(); },
    async loadTakeNotes(name) {
        const D = D_(), H = H_(); if (!D || !H || !name) return null;
        try {
            const pool = await H.pool(name); if (!pool) { this.setStatus('could not load the take "' + name + '"', true); return null; }
            const notes = D.notesFor('orch') || [], byLane = {};
            notes.forEach((n) => { if (n.lane == null || n.lane < 0) return; (byLane[n.lane] = byLane[n.lane] || []).push({ lane: n.lane, tech: n.tech, midi: n.midi, vel: n.vel, durMs: n.durMs, cents: n.cents || 0, partial: n.partial, seat: n.seat }); });
            // one attack per stream: a lane's notes at one onset are its chord; several onsets collapse to the first (the strike's spread rhythm is not wanted)
            Object.keys(byLane).forEach((L) => { const seen = new Set(); byLane[L] = byLane[L].filter((n) => { const k = n.midi + '|' + n.tech + '|' + (n.seat || 0); if (seen.has(k)) return false; seen.add(k); return true; }); });
            this.takes[name] = byLane;
            this.setStatus('take "' + name + '": ' + Object.keys(byLane).length + ' streams');
            return byLane;
        } catch (e) { this.setStatus('the take did not load: ' + (e && e.message || e), true); return null; }
    },
    streams() { const tk = this.takes[this.cfg.take]; if (!tk) return []; return Object.keys(tk).map(Number).sort((a, b) => a - b).filter((L) => !this.cfg.lanesOff.includes(L)).map((L, i) => ({ i, lane: L, durMs: Math.max(30, tk[L][0].durMs || 100) })); },
    planFor() { return { bpm: this.cfg.bpm, noteBeats: this.cfg.noteLen === 'artic' ? null : +this.cfg.noteLen, segments: this.plan.segments, favorites: this.favorites }; },
    notesOf(stream, seg) {   // the notes a stream plays in a segment: the segment's take if it has one and places this lane, else the plan's
        const sg = this.plan.segments[seg], tk = (sg && sg.take && this.takes[sg.take]) || this.takes[this.cfg.take];
        return (tk && tk[stream.lane]) || null;
    },

    // ---- play, lock, capture
    async play(fromSeg) {
        const D = D_(); if (!D) { this.setStatus('the strikes drawer is not loaded', true); return; }
        const streams = this.streams(); if (!streams.length) { this.setStatus('choose a take with placed notes', true); return; }
        if (!this.plan.segments.length) { this.setStatus('the plan is empty — + line', true); return; }
        for (const sg of this.plan.segments) if (sg.take && !this.takes[sg.take]) await this.loadTakeNotes(sg.take);
        E.panic();
        if (!await E.ensureMidi()) { this.setStatus(E._midiError || 'MIDI unavailable', true); return; }
        const plan = JSON.parse(JSON.stringify(this.planFor())), R = PE.run(plan, streams);
        this.live = { base: performance.now() + LEAD_MS, plan, streams, events: R.events, R, lockedAt: null, from: null, t0: 0 };
        this.schedule(R.events, 0);
        E._playing = true;
        this.setStatus('playing · ' + R.events.length + ' attacks · ' + R.end + ' s · ' + R.segments.map((s, i) => (i + 1) + ' ' + s.kind).join(' · '));
        this.ticker();
    },
    schedule(events, fromT) {
        const D = D_(), L = this.live, routes = {}, rk = (n) => n.lane + '|' + n.tech + (n.seat ? '|seat' + n.seat : '');
        const route = (n) => { const k = rk(n); if (!(k in routes)) routes[k] = D.routeFor(n.lane, n.tech, n.seat) || null; return routes[k]; };
        let missing = 0, span = 0;
        events.forEach((ev) => {
            if (ev.t < fromT) return;
            const notes = this.notesOf(L.streams[ev.stream], ev.seg); if (!notes) return;
            const on = L.base + ev.t * 1000, off = on + ev.durS * 1000; span = Math.max(span, off);
            notes.forEach((n) => {
                const r = route(n); if (!r) { missing++; return; }
                const vel = D.remapVel(n.lane, n.midi, n.vel), cc7 = D.remapCc7(n.lane, n.midi, vel, n.vel), cents = +n.cents || 0;
                E._timers.push(setTimeout(() => { try { r.out.send([0xB0 | r.ch, 7, cc7]); if (r.tech && r.tech.cc0 != null) r.out.send([0xB0 | r.ch, 0, r.tech.cc0]); if (cents && E.sendBend) E.sendBend(r, cents); } catch (x) {} }, Math.max(0, on - CC0_LEAD_MS - performance.now())));
                E._timers.push(setTimeout(() => E.noteOn(r, n.midi, vel), Math.max(0, on - performance.now())));
                E._timers.push(setTimeout(() => E.noteOff(r, n.midi), Math.max(0, off - performance.now())));
            });
        });
        E._timers.push(setTimeout(() => E.panic(), Math.max(0, span - performance.now()) + 700));
        if (missing) this.setStatus('some notes have no MIDI port (' + missing + ')', true);
    },
    now() { return this.live ? (performance.now() - this.live.base) / 1000 : null; },
    ticker() { clearInterval(this._tick); this._tick = setInterval(() => { if (!this.live || !E.isPlaying()) { clearInterval(this._tick); return; } const t = this.now(); const S = PE.stateAt(this.live.plan, this.live.streams, t); const s = this.el.querySelector('#phStatus'); if (s) s.textContent = 'playing ' + r2(t) + ' s · line ' + (S.segment + 1) + ' · tempi ' + S.tempi.join(' ') + ' · lags ' + S.offsets.map((o) => o.toFixed(2)).join(' ') + (this.live.lockedAt != null ? ' · LOCKED at ' + this.live.lockedAt : ''); }, 250); },
    lock() {
        if (!this.live || !E.isPlaying()) { this.setStatus('LOCK works while it plays', true); return; }
        const t = this.now(), L = this.lockAtNow(t);
        if (!L) return;
        this.setStatus('LOCKED at ' + r2(t) + ' s — every stream at ' + this.cfg.bpm + ', lags ' + L.capture.offsets.map((o) => o.toFixed(2)).join(' ') + ' · capture phase to keep it');
    },
    lockAtNow(t) {
        const L = this.live, res = PE.lockAt(L.plan, L.streams, t);
        // the timers from now on are replaced: cancel every pending one, re-run the locked plan from t
        E._timers.forEach((x) => clearTimeout(x)); E._timers = [];
        L.plan = res.plan; L.R = PE.run(L.plan, L.streams); L.events = L.R.events; L.lockedAt = r2(t); L.lastCapture = res.capture;
        this.schedule(L.events, t + 0.02);
        // the panel's own plan takes the locked shape too, so Insert writes what he heard
        this.plan.segments = JSON.parse(JSON.stringify(L.plan.segments)); this.favorites = Object.assign({}, this.favorites, { __lock_from__: L.plan.favorites.__lock_from__ }); this.save(); this.renderPlan();
        return res;
    },
    capture(kind) {
        const streams = this.streams(); if (!streams.length) { this.setStatus('no streams', true); return; }
        const t = (this.live && E.isPlaying()) ? this.now() : null;
        const S = t != null ? PE.stateAt(this.live.plan, this.live.streams, t) : PE.stateAt(this.planFor(), streams, 1e9);
        const name = window.prompt('Save this ' + (kind === 'phase' ? 'PHASE pattern (bpm ' + this.cfg.bpm + ', lags ' + S.offsets.map((o) => o.toFixed(2)).join(' ') + ')' : 'TEMPI pattern (' + S.tempi.join(' ') + ')') + ' as:', ''); if (!name) return;
        const fav = kind === 'phase' ? { kind: 'phase', bpm: this.cfg.bpm, offsets: S.offsets, note: 'captured ' + (t != null ? 'at ' + r2(t) + ' s' : 'at the plan\'s end') + ' of take ' + this.cfg.take } : { kind: 'tempi', bpm: this.cfg.bpm, tempi: S.tempi, note: 'captured ' + (t != null ? 'at ' + r2(t) + ' s' : 'at the plan\'s end') };
        this.favorites[name] = fav; this.libPost('favorite', name, fav); this.renderFav(); this.renderPlan();
        this.setStatus('favorite saved: ' + name);
    },
    async hearFavorite(name) {
        const f = this.favorites[name]; if (!f) return;
        const streams = this.streams(); if (!streams.length) { this.setStatus('choose a take first', true); return; }
        E.panic(); if (!await E.ensureMidi()) { this.setStatus(E._midiError || 'MIDI unavailable', true); return; }
        const plan = Object.assign(this.planFor(), { segments: [{ kind: 'cut', target: { kind: 'state', name } }, { kind: 'hold', seconds: 12 }] }), R = PE.run(plan, streams);
        this.live = { base: performance.now() + LEAD_MS, plan, streams, events: R.events, R, lockedAt: null };
        this.schedule(R.events, 0); E._playing = true; this.setStatus('hearing favorite "' + name + '" held 12 s'); this.ticker();
    },
    onStopped() { clearInterval(this._tick); if (this.live) { this.live = null; } if (this.el && this.el.style.display !== 'none') this.setStatus('stopped'); },

    // ---- the library: favorites and plans in bank/phase_states.json (store `phase`)
    async libLoad() {
        try { const r = await fetch('/api/snapshots?store=' + LIB, { cache: 'no-store' }); const j = await r.json(); const p = (j && j.panels) || {}; this.favorites = {}; this.plans = {};
            Object.entries(p.favorite || {}).forEach(([n, e]) => { this.favorites[n] = e.state; }); Object.entries(p.plan || {}).forEach(([n, e]) => { this.plans[n] = e.state; }); }
        catch (e) { this.favorites = this.favorites || {}; this.plans = this.plans || {}; }
        this.renderFav(); this.renderPlan();
    },
    async libPost(panel, name, state, del) {
        try { const r = await fetch('/api/snapshots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(del ? { store: LIB, panel, name, delete: true } : { store: LIB, panel, name, state, comment: state.note || '' }) }); const j = await r.json(); if (!j || !j.success) throw new Error((j && j.error) || 'HTTP ' + r.status); }
        catch (e) { this.setStatus('the library did not save: ' + (e && e.message || e) + ' — the server may need a restart for the phase store', true); }
    },
    async libDelete(panel, name) { await this.libPost(panel, name, null, true); if (panel === 'favorite') delete this.favorites[name]; else delete this.plans[name]; this.renderFav(); this.renderPlan(); },
    savePlan() { const name = window.prompt('Save this plan as:', this.plan.name || ''); if (!name) return; this.plan.name = name; this.plans = this.plans || {}; this.plans[name] = { plan: JSON.parse(JSON.stringify(this.plan)), cfg: { take: this.cfg.take, bpm: this.cfg.bpm, noteLen: this.cfg.noteLen, lanesOff: this.cfg.lanesOff.slice() }, note: 'take ' + this.cfg.take + ' · bpm ' + this.cfg.bpm }; this.libPost('plan', name, this.plans[name]); this.save(); this.renderFav(); this.setStatus('plan saved: ' + name); },

    // ---- INSERT: the plan into the score from the playhead, plain struck notes in one group
    async insert() {
        const C = HOST(); if (!C || typeof C.getTimeAtPlayhead !== 'function') { this.setStatus('the composer is not reachable', true); return; }
        const streams = this.streams(); if (!streams.length || !this.plan.segments.length) { this.setStatus('choose a take and make a plan first', true); return; }
        for (const sg of this.plan.segments) if (sg.take && !this.takes[sg.take]) await this.loadTakeNotes(sg.take);
        const plan = JSON.parse(JSON.stringify(this.planFor())), R = PE.run(plan, streams), t0 = +C.getTimeAtPlayhead().toFixed(3);
        const id = this.plan.id || ('p' + Date.now().toString(36)), group = 'grp-phase-' + id, name = this.plan.name || ('phase ' + id);
        C.pushUndoState();
        const before = C.objects.length; C.objects = C.objects.filter((o) => o.groupId !== group); const gone = before - C.objects.length;
        let written = 0;
        R.events.forEach((ev) => {
            const notes = this.notesOf(streams[ev.stream], ev.seg); if (!notes) return;
            notes.forEach((n) => {
                const start = r3(t0 + ev.t), end = r3(start + ev.durS);
                C.objects.push(Object.assign({ id: 'wc-' + (C.nextId++), type: 'waveCurve', layer: n.lane, groupId: group, startSeconds: start, endSeconds: end,
                    nodes: [{ pos: 0, y: 7.143, smooth: 0.25 }, { pos: 1, y: 7.143, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
                    color: COLOR, fillMode: 'bottom', opacity: 0.55, srcKind: 'phase', properties: { phase: { plan: id, seg: ev.seg, stream: ev.stream, n: ev.n, tempo: ev.tempo } },
                    performanceNotes: name + ' · line ' + (ev.seg + 1) + ' · ' + ev.tempo + ' bpm' + (n.cents ? ' · ' + (n.cents > 0 ? '+' : '') + Math.round(n.cents) + '¢ just' : ''),
                    sonifyNote: n.midi, technique: n.tech, recVel: clamp(Math.round(n.vel || 100), 1, 127) },
                    n.cents ? { morphBend: [[0, +(+n.cents).toFixed(2)], [r3(end - start), +(+n.cents).toFixed(2)]] } : { sonifyMode: 'plain' }));
                written++;
            });
        });
        // a marker at each segment's start, naming it
        R.segments.forEach((s, i) => { if (s.kind === 'hold' && i > 0 && R.segments[i - 1].kind === 'cut' && R.segments[i - 1].t0 === s.t0) return;   // the cut's marker names the hold that follows it
            C.objects.push({ id: 'mk-' + (C.nextId++), type: 'marker', layer: 0, groupId: group, time: r3(t0 + s.t0), label: 'PH' + (i + 1) + ' ' + s.kind + (s.kind === 'hold' ? '' : ' → ' + s.to.join(' ')), color: COLOR, performanceNotes: s.note + (s.offsets ? ' · lags ' + s.offsets.map((o) => o.toFixed(2)).join(' ') : ''), properties: { phase: { plan: id, seg: i, end: r3(t0 + s.t1) } } }); });
        if (!C.databases) C.databases = {}; if (!Array.isArray(C.databases.phase)) C.databases.phase = [];
        const entry = { id, name, group, inserted: new Date().toISOString(), t0, notes: written, plan, take: this.cfg.take, streams: streams.map((s) => s.lane) };
        const k = C.databases.phase.findIndex((x) => x && x.id === id); if (k >= 0) C.databases.phase[k] = entry; else C.databases.phase.push(entry);
        C.lastInsertGroup = group;
        if (C.curveDirty) C.curveDirty(); C.renderAll(); C.markDirty();
        this.setStatus('inserted ' + written + ' notes · ' + t0 + ' → ' + r3(t0 + R.end) + ' s as ' + group + (gone ? ' · replaced ' + gone : '') + ' · the plan is in the score file');
    },
};
root.PhasePanel = P;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => P.init()); else P.init();
})(typeof window !== 'undefined' ? window : this);
