// tuplets.js — THE DRAW: the phase form's single strikes + the chunks → the strikes actually played (SW-45 … SW-48; docs/TUPLET_BANDS.md).
// One copy, used by the workshop page (the browser) and by the tools (node): the same chunks give the same notes in both.
//
//   Tuplets.build(hits, players, db) → { [player]: [ { t, src, step, band } … ] }   t in score seconds; src = the single strike it came from
//
// THE RULE. A player's BEAT is the gap from one of its strikes to its next. A chunk (start · end · band · players · seed · shareFrom ·
// shareTo · hold) claims every strike of its players whose time falls inside it (a later chunk in the list wins an overlap). A claimed
// strike becomes a tuplet with the chunk's SHARE (a chance, sliding from shareFrom to shareTo across the chunk); the tuplet is drawn among
// the ladder's steps whose speed (step ÷ beat, strikes per second) lies inside the band and under the ceiling; with the chunk's HOLD chance
// the step of the beat before is kept when it still fits. A half step (3 in 2, 5 in 2 …) spans two beats and uses up the next strike.
// Nothing fits → the nearest step under the ceiling. The draw is seeded: the same chunk gives the same tuplets until its seed changes.
(function (root) {
  'use strict';
  const WHOLE = [1, 2, 3, 4, 5, 6, 7, 8], HALF = [1.5, 2.5, 3.5, 4.5, 5.5];
  const NAMES = { 1: 'single', 1.5: '3 in 2', 2: 'eighths', 2.5: '5 in 2', 3: 'triplet', 3.5: '7 in 2', 4: 'sixteenths', 4.5: '9 in 2', 5: 'quintuplet', 5.5: '11 in 2', 6: 'sextuplet', 7: 'septuplet', 8: 'thirty-seconds' };
  function rng(seed) { let a = (seed >>> 0) || 1; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function chunkOf(db, player, t) { let c = null; for (const k of db.chunks) if (t >= k.start && t < k.end && (!k.players || k.players.indexOf(player) >= 0)) c = k; return c; }
  function build(hits, players, db) {
    const ceiling = db.ceiling || 10, out = {};
    for (const p of players) {
      const h = hits[p] || [], ev = []; out[p] = ev;
      const rands = {}, last = {};
      for (let i = 0; i < h.length; i++) {
        const t = h[i], c = chunkOf(db, p, t), gap = i + 1 < h.length ? h[i + 1] - t : null;
        const band = c && db.bands[c.band];
        if (!c || !band || gap == null || gap <= 0) { ev.push({ t, src: i, step: 1, band: null }); continue; }
        const id = c.id + '|' + p, R = rands[id] || (rands[id] = rng(hash(id + '|' + (c.seed || 1))));
        const u = c.end > c.start ? (t - c.start) / (c.end - c.start) : 0;
        const share = (c.shareFrom == null ? 1 : c.shareFrom) + ((c.shareTo == null ? (c.shareFrom == null ? 1 : c.shareFrom) : c.shareTo) - (c.shareFrom == null ? 1 : c.shareFrom)) * u;
        const rShare = R(), rHold = R(), rPick = R();
        if (rShare >= share) { ev.push({ t, src: i, step: 1, band: c.band, plain: true }); last[id] = null; continue; }
        // the steps that fit: whole steps over this beat; half steps over two beats when the next strike is this chunk's too
        const fits = []; const lo = band[0], hi = Math.min(band[1], ceiling);
        for (const s of WHOLE) { if (s === 1) continue; const r = s / gap; if (r >= lo && r <= hi) fits.push(s); }   // NEVER THE SINGLE STRIKE inside a chunk (his word 2026-11-18): a tuplet is always a subdivision
        const two = i + 2 < h.length && chunkOf(db, p, h[i + 1]) === c ? h[i + 2] - t : null;
        if (two) for (const s of HALF) { const r = (s * 2) / two; if (r >= lo && r <= hi) fits.push(s); }
        let step;
        if (!fits.length) { let best = 1, bd = 1e9; const mid = Math.sqrt(lo * hi); best = 2; for (const s of WHOLE) { if (s === 1) continue; const r = s / gap; if (r > ceiling) continue; const d = Math.abs(Math.log(r / mid)); if (d < bd) { bd = d; best = s; } } if (two) for (const s of HALF) { const r = (s * 2) / two; if (r > ceiling) continue; const d = Math.abs(Math.log(r / mid)); if (d < bd) { bd = d; best = s; } } step = best; }
        else if (last[id] != null && fits.indexOf(last[id]) >= 0 && rHold < (c.hold == null ? 0.45 : c.hold)) step = last[id];
        else {   // THE CONTRAST RULE (his word 2026-11-18): a new pick is clearly another speed than the last (a quarter faster or slower, when the band
          // has one), and the plain tuplets (whole steps) are drawn three times as often as the two-beat ones
          let pool = fits; if (last[id] != null) { const far = fits.filter((s) => Math.max(s / last[id], last[id] / s) >= 1.25); if (far.length) pool = far; else { const other = fits.filter((s) => s !== last[id]); if (other.length) pool = other; } }
          const w = pool.map((s) => s % 1 === 0 ? 3 : 1), sum = w.reduce((x, y) => x + y, 0); let r = rPick * sum, j = 0; while (j < pool.length - 1 && r >= w[j]) { r -= w[j]; j++; }
          step = pool[j];
        }
        last[id] = step;
        if (step % 1 !== 0) { const n = step * 2; for (let k = 0; k < n; k++) { const tk = t + two * k / n; if (k && tk >= c.end) break; ev.push({ t: tk, src: i, step, band: c.band, k }); } i++; }   // two beats: the next strike is used up
        else for (let k = 0; k < step; k++) { const tk = t + gap * k / step; if (k && tk >= c.end) break; ev.push({ t: tk, src: i, step, band: c.band, k }); }   // THE CHUNK'S END CUTS THE TUPLET (his eye 2026-11-18): a beat that began inside runs past the end — its strikes after the end are dropped
      }
    }
    return out;
  }
  const api = { build, NAMES, WHOLE, HALF };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Tuplets = api;
})(typeof window !== 'undefined' ? window : globalThis);
