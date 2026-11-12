// tap_tempo.js — a TAP TEMPO on the composer score (his ask 2026-11-12, RUNNING_LOG §181): "it's just when I leave the browser window, it
// stops playing" — so he taps HERE, on the page that plays. The button TAP in the bar after Panels ▾, and the key K (free; T is the trill,
// SPACE is play). Each tap within 2.5 s of the last extends the run; the readout is the mean of the last eight gaps, in bpm, with the count.
// A pause of more than 2.5 s starts a new run. Nothing is written anywhere.
(function () {
'use strict';
const GAP_MS = 2500, KEEP = 8;
const T = { taps: [], btn: null, out: null };
function tap() {
    const now = performance.now();
    if (T.taps.length && now - T.taps[T.taps.length - 1] > GAP_MS) T.taps = [];
    T.taps.push(now); if (T.taps.length > KEEP + 1) T.taps.shift();
    show();
    if (T.btn) { T.btn.style.background = '#2e9e8e'; setTimeout(() => { T.btn.style.background = ''; }, 90); }
}
function show() {
    if (!T.out) return;
    const n = T.taps.length - 1;
    if (n < 1) { T.out.textContent = '— bpm'; return; }
    const mean = (T.taps[T.taps.length - 1] - T.taps[0]) / n;
    T.out.textContent = (60000 / mean).toFixed(1) + ' bpm · ' + n;
}
function init() {
    const anchor = document.getElementById('menuPanels'); if (!anchor) return;
    const wrap = document.createElement('span'); wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-left:6px';
    const btn = document.createElement('button'); btn.id = 'tapBtn'; btn.textContent = 'TAP'; btn.title = 'tap tempo — click, or the key K; a pause of 2.5 s starts over';
    btn.addEventListener('click', (e) => { e.preventDefault(); tap(); btn.blur(); });
    const out = document.createElement('span'); out.id = 'tapOut'; out.style.cssText = 'font-variant-numeric:tabular-nums;color:#9fe3d3;min-width:92px;font-size:12px';
    out.textContent = '— bpm';
    wrap.appendChild(btn); wrap.appendChild(out);
    anchor.insertAdjacentElement('afterend', wrap);
    T.btn = btn; T.out = out;
    document.addEventListener('keydown', (e) => {
        const inField = e.target && typeof e.target.matches === 'function' && e.target.matches('input, textarea, select');
        if ((e.key === 'k' || e.key === 'K') && !e.ctrlKey && !e.altKey && !e.metaKey && !inField) { e.preventDefault(); tap(); }
    }, true);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
