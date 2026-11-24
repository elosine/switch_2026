// notation/lib/elec_wave.js — THE ELECTRONICS' WAVEFORM IN THE SCORE (the Switch~ piece, RUNNING_LOG §468 · §469; his SW-71 "the equivalent of a tape part … show the
// waveform", 2026-11-23 "we need the waveform of the demo in the score", and 2026-11-24 his pick of the styles, "lets do f"). The ELEC lane (ensemble part 8, no staff)
// draws the mixed electronics of the demo: bank/elec_wave.json, written by tools/elec_wave.js. Mirrored round the lane's middle, for the window a view shows.
// Its look is one row, rules.json objects.elecWave: style 'peakBody' (his F) = the peaks pale, a smoothed body dark inside them; else one filled shape in `color`.
// Used by the film (tools/export_video.js) and the notation app.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NotationElecWave = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // the shape over the window: h(t0', t1') -> a height 0 … 1 for each column
  function shape(view, lane, rule, height, scale) {
    const t0 = view.window[0], t1 = view.window[1], x0 = view.xOfSeconds(t0), x1 = view.xOfSeconds(t1);
    const mid = (lane.yTopPx + lane.yBotPx) / 2, half = (lane.yBotPx - lane.yTopPx) / 2 * rule.heightFrac * scale;
    const n = Math.max(2, Math.ceil((x1 - x0) / rule.columnPx)), top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const v = height(t0 + (t1 - t0) * (i - 0.5) / n, t0 + (t1 - t0) * (i + 0.5) / n, t0 + (t1 - t0) * i / n);
      const h = Math.max(v > 0 ? rule.minPx : 0, Math.pow(v, rule.curve) * half), x = (x0 + (x1 - x0) * i / n).toFixed(1);
      top.push(x + ' ' + (mid - h).toFixed(1));
      bot.push(x + ' ' + (mid + h).toFixed(1));
    }
    return 'M' + top.join('L') + 'L' + bot.reverse().join('L') + 'Z';
  }
  function svg(view, wave, rule) {
    if (!view || !wave || !rule || !Array.isArray(wave.peaks)) return '';
    const lane = (view.systems || []).find(s => s.part === rule.part);
    if (!lane) return '';
    const P = wave.peaks, R = wave.rate, F = wave.full;
    const peak = (a, b) => { let p = 0; for (let k = Math.max(0, Math.floor(a * R)), e = Math.min(P.length, Math.max(k + 1, Math.ceil(b * R))); k < e; k++) if (P[k] > p) p = P[k]; return p / F; };
    if (rule.style !== 'peakBody') return '<path class="elec-wave" d="' + shape(view, lane, rule, peak, 1) + '" fill="' + rule.color + '" stroke="none"/>';
    const r = rule.bodySmoothS;
    const body = (a, b, t) => { let s = 0, n = 0; for (let k = Math.max(0, Math.floor((t - r) * R)), e = Math.min(P.length, Math.ceil((t + r) * R)); k < e; k++) { s += P[k]; n++; } return n ? s / n / F : 0; };
    return '<path class="elec-wave elec-wave-peak" d="' + shape(view, lane, rule, peak, 1) + '" fill="' + rule.peakColor + '" stroke="none"/>' +
      '<path class="elec-wave elec-wave-body" d="' + shape(view, lane, rule, body, rule.bodyScale) + '" fill="' + rule.bodyColor + '" stroke="none"/>';
  }
  return { svg };
}));
