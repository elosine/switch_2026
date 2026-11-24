// notation/lib/elec_wave.js — THE ELECTRONICS' WAVEFORM IN THE SCORE (the Switch~ piece, RUNNING_LOG §468; his SW-71 "the equivalent of a tape part … show the
// waveform", and 2026-11-23 "we need the waveform of the demo in the score"). The ELEC lane (ensemble part 8, no staff) draws the mixed electronics of the demo:
// bank/elec_wave.json, written by tools/elec_wave.js. One filled shape, mirrored round the lane's middle, for the window a view shows. Its look is one row,
// rules.json objects.elecWave. Used by the film (tools/export_video.js) and the notation app.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NotationElecWave = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function svg(view, wave, rule) {
    if (!view || !wave || !rule || !Array.isArray(wave.peaks)) return '';
    const lane = (view.systems || []).find(s => s.part === rule.part);
    if (!lane) return '';
    const t0 = view.window[0], t1 = view.window[1], x0 = view.xOfSeconds(t0), x1 = view.xOfSeconds(t1);
    const mid = (lane.yTopPx + lane.yBotPx) / 2, half = (lane.yBotPx - lane.yTopPx) / 2 * rule.heightFrac;
    const n = Math.max(2, Math.ceil((x1 - x0) / rule.columnPx)), top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const a = t0 + (t1 - t0) * (i - 0.5) / n, b = t0 + (t1 - t0) * (i + 0.5) / n;
      const ia = Math.max(0, Math.floor(a * wave.rate)), ib = Math.min(wave.peaks.length, Math.max(ia + 1, Math.ceil(b * wave.rate)));
      let p = 0;
      for (let k = ia; k < ib; k++) if (wave.peaks[k] > p) p = wave.peaks[k];
      const h = Math.max(p > 0 ? rule.minPx : 0, Math.pow(p / wave.full, rule.curve) * half), x = (x0 + (x1 - x0) * i / n).toFixed(1);
      top.push(x + ' ' + (mid - h).toFixed(1));
      bot.push(x + ' ' + (mid + h).toFixed(1));
    }
    return '<path class="elec-wave" d="M' + top.join('L') + 'L' + bot.reverse().join('L') + 'Z" fill="' + rule.color + '" stroke="none"/>';
  }
  return { svg };
}));
