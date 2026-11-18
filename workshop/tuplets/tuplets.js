// tuplets.js — THE DRAW: the phase form's single strikes + the chunks → the strikes actually played (SW-45 … SW-49; docs/TUPLET_BANDS.md).
// One copy, used by the workshop page (the browser) and by the tools (node): the same chunks give the same notes in both.
//
//   Tuplets.build(hits, players, db) → { [player]: [ { t, src, step, band, k? } … ] }   t in score seconds; src = the single strike it came from
//
// THE RULES (each his word, 2026-11-14 … 18):
//   · A player's BEAT is the gap from one of its strikes to its next. A chunk (start · end · band · players · seed · shareFrom · shareTo ·
//     rate) claims every strike of its players whose time falls inside it (a later chunk in the list wins an overlap).
//   · A claimed strike becomes a tuplet with the chunk's SHARE (a chance sliding from shareFrom to shareTo across the chunk; 100 % = all).
//   · THE TUPLET IS ALWAYS A SUBDIVISION, never the single strike: drawn among the ladder's steps (2 … 8 per beat; 3 · 5 · 7 · 9 · 11 in two
//     beats) whose speed (strikes per second) lies inside the band and under the ceiling. None fits → the nearest subdivision under the ceiling.
//   · THE RATE OF CHANGE (chunk.rate, 1 slow … 5 fast): how many beats a tuplet lasts before another is drawn — 5: every beat · 4: 1–2 ·
//     3: 1–3 · 2: 2–4 · 1: 2–5 beats · 0: ONE TUPLET for the whole chunk, per player (his word 2026-11-18; "new draw" re-rolls it). ALWAYS UNEVEN: two tuplets in a row never last the same number of beats (where the range has two).
//   · NO FIGURE COMES BACK TOO SOON: the last two figures used are set aside (the last one, when the band is narrow); a new figure is, when
//     the band has one, at least a quarter faster or slower than the one before; the plain tuplets are drawn 3 times as often as the two-beat ones.
//   · THE CHUNK'S END CUTS THE TUPLET: the strikes of a beat that would fall after the end are dropped.
//   · Seeded per chunk and player: the same chunk gives the same tuplets until its seed changes ("new draw").
(function (root) {
  'use strict';
  const WHOLE = [2, 3, 4, 5, 6, 7, 8], HALF = [1.5, 2.5, 3.5, 4.5, 5.5];
  const NAMES = { 1: 'single', 1.5: '3 in 2', 2: 'eighths', 2.5: '5 in 2', 3: 'triplet', 3.5: '7 in 2', 4: 'sixteenths', 4.5: '9 in 2', 5: 'quintuplet', 5.5: '11 in 2', 6: 'sextuplet', 7: 'septuplet', 8: 'thirty-seconds' };
  const RATES = { 0: [1e9, 1e9], 5: [1, 1], 4: [1, 2], 3: [1, 3], 2: [2, 4], 1: [2, 5] }, RATE_TEXT = { 0: 'one tuplet, no change', 5: 'every beat', 4: '1–2 beats each', 3: '1–3 beats each', 2: '2–4 beats each', 1: '2–5 beats each' };
  function rng(seed) { let a = (seed >>> 0) || 1; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function chunkOf(db, player, t) { let c = null; for (const k of db.chunks) if (t >= k.start && t < k.end && (!k.players || k.players.indexOf(player) >= 0)) c = k; return c; }
  function build(hits, players, db) {
    const ceiling = db.ceiling || 10, out = {};
    for (const p of players) {
      const h = hits[p] || [], ev = []; out[p] = ev;
      const rands = {}, state = {};
      for (let i = 0; i < h.length; i++) {
        const t = h[i], c = chunkOf(db, p, t), gap = i + 1 < h.length ? h[i + 1] - t : null;
        const band = c && db.bands[c.band];
        if (!c || !band || gap == null || gap <= 0) { ev.push({ t, src: i, step: 1, band: null }); continue; }
        const id = c.id + '|' + p, R = rands[id] || (rands[id] = rng(hash(id + '|' + (c.seed || 1))));
        const st = state[id] || (state[id] = { step: null, left: 0, lastLen: 0, used: [] });
        const u = c.end > c.start ? (t - c.start) / (c.end - c.start) : 0, sf = c.shareFrom == null ? 1 : c.shareFrom, sTo = c.shareTo == null ? sf : c.shareTo;
        const rShare = R(), rLen = R(), rPick = R();
        if (rShare >= sf + (sTo - sf) * u) { ev.push({ t, src: i, step: 1, band: c.band, plain: true }); continue; }
        // the subdivisions that fit: whole steps over this beat; half steps over two beats when the next strike is this chunk's too
        const fits = [], lo = band[0], hi = Math.min(band[1], ceiling);
        for (const s of WHOLE) { const r = s / gap; if (r >= lo && r <= hi) fits.push(s); }
        const two = i + 2 < h.length && chunkOf(db, p, h[i + 1]) === c ? h[i + 2] - t : null;
        if (two) for (const s of HALF) { const r = (s * 2) / two; if (r >= lo && r <= hi) fits.push(s); }
        let step;
        if (st.left > 0 && st.step != null && (fits.indexOf(st.step) >= 0 || !fits.length)) step = st.step;   // the figure is still running
        else {
          let pool = fits;
          if (!pool.length) {   // nothing lands in the band at this pulse: the nearest subdivision under the ceiling
            const mid = Math.sqrt(lo * hi); let best = 2, bd = 1e9;
            for (const s of WHOLE) { const r = s / gap; if (r > ceiling) continue; const d = Math.abs(Math.log(r / mid)); if (d < bd) { bd = d; best = s; } }
            if (two) for (const s of HALF) { const r = (s * 2) / two; if (r > ceiling) continue; const d = Math.abs(Math.log(r / mid)); if (d < bd) { bd = d; best = s; } }
            pool = [best];
          } else {
            // NO FIGURE BACK TOO SOON, AND NEVER A ROUND: (1) the last two figures set aside and the new one a quarter faster or slower —
            // while that leaves a real choice (two or more); (2) else only the last one set aside; (3) nothing that would complete a
            // repeating round of two or three figures (A B A B · A B C A B C) — a narrow band otherwise falls into 3 5 4 3 5 4 …
            const far = (list) => st.step == null ? list : list.filter((s) => Math.max(s / st.step, st.step / s) >= 1.25);
            const recent = st.used.slice(-2), a = far(pool.filter((s) => recent.indexOf(s) < 0)), b = pool.filter((s) => s !== st.step), bf = far(b);
            let cand = a.length >= 2 ? a : bf.length >= 2 ? bf : b.length ? b : pool;
            const U = st.used, n = U.length, round = (s) => (n >= 3 && s === U[n - 2] && U[n - 1] === U[n - 3]) || (n >= 5 && s === U[n - 3] && U[n - 1] === U[n - 4] && U[n - 2] === U[n - 5]);
            const free = cand.filter((s) => !round(s)); if (free.length) cand = free; else { const f2 = b.filter((s) => !round(s)); if (f2.length) cand = f2; }
            pool = cand;
          }
          const w = pool.map((s) => s % 1 === 0 ? 3 : 1), sum = w.reduce((x, y) => x + y, 0); let r = rPick * sum, j = 0; while (j < pool.length - 1 && r >= w[j]) { r -= w[j]; j++; }
          step = pool[j];
          const rg = RATES[c.rate] || RATES[3], lens = []; for (let n = rg[0]; n <= rg[1]; n++) if (n !== st.lastLen || rg[0] === rg[1]) lens.push(n);
          const len = lens[Math.floor(rLen * lens.length)];
          if (step !== st.step) st.used.push(step);
          st.step = step; st.left = len; st.lastLen = len;
        }
        if (step % 1 !== 0 && two) { const n = step * 2; for (let k = 0; k < n; k++) { const tk = t + two * k / n; if (k && tk >= c.end) break; ev.push({ t: tk, src: i, step, band: c.band, k }); } i++; st.left -= 2; }   // two beats: the next strike is used up
        else { const n = Math.max(2, Math.round(step)); for (let k = 0; k < n; k++) { const tk = t + gap * k / n; if (k && tk >= c.end) break; ev.push({ t: tk, src: i, step: n, band: c.band, k }); } st.left -= 1; }
      }
    }
    return out;
  }
  // THE ARTICULATION SETS (SW-51): a named set = one technique per player; the first is what the phase form plays
  const SETS = {
    'staccato': { flute: 'staccato', clarinet: 'staccato', alto_sax: 'staccato', glockenspiel: 'glock_shorts_hard', piano: 'main', violin: 'stac_vel', cello: 'stac_vel' },
    'spiccato strings': { flute: 'staccato', clarinet: 'staccato', alto_sax: 'staccato', glockenspiel: 'glock_shorts_hard', piano: 'main', violin: 'spicc_vel', cello: 'spicc_vel' },
  };
  const fold = (pitch, lo, hi) => { let k = pitch; if (lo != null) while (k < lo) k += 12; if (hi != null) while (k > hi) k -= 12; return k; };
  // the keys a player sounds at score time t: its pitches in the take of the harmony brick there (a later brick wins), folded into the
  // technique's range; no brick, or no pitch for this player in the take → its own D
  function keysAt(db, takes, routes, set, p, t) {
    const R = routes[p], q = R.tech[(set || {})[p]] || R.tech[R.home] || {}; let h = null;
    for (const b of (db.harmonies || [])) if (t >= b.start && t < b.end) h = b;
    const tk = h && takes[h.take], ps = tk && tk.lanes[R.lane];
    if (!ps || !ps.length) return [R.homeKey];
    return [...new Set(ps.map((x) => fold(x, q.lo, q.hi)))];
  }
  const api = { build, NAMES, WHOLE, HALF, RATES, RATE_TEXT, SETS, fold, keysAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Tuplets = api;
})(typeof window !== 'undefined' ? window : globalThis);
