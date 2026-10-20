// tools/signs/build_state_signs.js — THE STATE SIGNS' WORKING PAGE (decibel PLAN 2.6; RUNNING_LOG §364; DEC-136).
//
//   node tools/signs/build_state_signs.js
//
// Reads bank/signs/state_signs.json (the four signs of the three body problem's states with their bigger dots; the grounds to try) and
// the states' colours from notation/registry/rules.json (objects.stateWedge.states — a sign is in its wedge's colour), and writes
// score/public/signs/state_signs.html — served at http://localhost:5500/signs/state_signs.html. Every sign on every ground, on white
// paper as it will stand in the score: large, at the score's own size, and over a piece of its own wedge. For CHOOSING only: the
// notation is not touched (it still draws rules.json stateSigns). A ground or a sign is a row of the JSON.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const B = rd('bank/signs/state_signs.json'), R = rd('notation/registry/rules.json');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const deref = (v) => { const m = /^@colours\.([A-Za-z0-9_]+)\.value$/.exec(String(v)); return m && R.colours[m[1]] ? R.colours[m[1]].value : v; };
const U = B.format.units, RX = B.format.cornerUnits, PX = B.format.sizePx;
const colourOf = (st) => deref(((R.objects.stateWedge || {}).states || {})[st.id] ? R.objects.stateWedge.states[st.id].colour : '@colours.' + st.colour + '.value');
// one sign on one ground, `px` wide
function badge(st, g, px) {
  const col = colourOf(st), fill = g.fill === 'state' ? col : g.fill, stroke = g.stroke === 'state' ? col : g.stroke;
  const ground = fill === 'none' && !stroke ? '' : '<rect x="' + (stroke ? 0.6 : 0) + '" y="' + (stroke ? 0.6 : 0) + '" width="' + (U - (stroke ? 1.2 : 0)) + '" height="' + (U - (stroke ? 1.2 : 0)) + '" rx="' + RX + '" fill="' + (fill || 'none') + '"' +
    (g.opacity != null && fill !== 'none' ? ' fill-opacity="' + g.opacity + '"' : '') + (stroke ? ' stroke="' + stroke + '" stroke-width="1.2"' : '') + '/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + U + ' ' + U + '" width="' + px + '" height="' + px + '">' + ground + String(st.sign).split('currentColor').join(col) + '</svg>';
}
// the sign at the score's size above a piece of its own wedge, as it will stand (its bottom a gap above the wedge's top)
function inPlace(st, g) {
  const col = colourOf(st), th = ((R.objects.stateWedge.states[st.id] || {}).thick), t = Array.isArray(th) ? th[1] : th, hPx = Math.max(2, Math.round((+t || 1) / 10 * 70));
  return '<div class="place">' + badge(st, g, PX) + '<div class="wedge" style="height:' + hPx + 'px;background:' + col + ';opacity:' + R.objects.stateWedge.fillOpacity + '"></div></div>';
}
const rows = B.grounds.map((g) => '<tr><th><div class="g"><span class="letter">' + esc(g.id) + '</span><div><span class="gname">' + esc(g.name) + '</span><span class="gnum">' +
  esc(g.fill === 'state' ? 'the state\'s colour' : g.fill === 'none' ? (g.stroke ? 'outline only' : 'nothing') : g.fill) + (g.opacity != null && g.fill !== 'none' ? ' · ' + Math.round(g.opacity * 100) + ' %' : '') + '</span><span class="gfrom">' + esc(g.from || '') + '</span></div></div></th>' +
  B.states.map((st) => '<td>' + badge(st, g, 96) + inPlace(st, g) + '</td>').join('') + '</tr>').join('\n');
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>State signs — working page</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>' +
  'body{margin:0;background:#fff;color:#222;font:15px/1.5 system-ui,Segoe UI,Arial,sans-serif}main{max-width:1320px;margin:0 auto;padding:28px 24px 60px}' +
  'h1{font-size:22px;margin:0 0 6px}p{margin:6px 0;max-width:820px}.one{font-weight:600;margin:14px 0 22px}' +
  'table{border-collapse:collapse;width:100%;min-width:1100px}thead th{font-weight:600;text-align:left;padding:8px 14px;border-bottom:2px solid #222;font-size:14px}thead th.s{text-align:center}' +
  'tbody tr{border-bottom:1px solid #ddd}tbody th{text-align:left;font-weight:400;padding:16px 14px 16px 0;vertical-align:middle;width:300px}' +
  '.g{display:flex;gap:10px;align-items:flex-start}.letter{font-weight:700;font-size:22px;line-height:1.1;width:26px;flex:none}.gname{display:block;font-weight:600}.gnum{display:block;color:#555;font:13px ui-monospace,Consolas,monospace}.gfrom{display:block;color:#666;font-size:13px}.wrap{overflow-x:auto}' +
  'td{padding:16px 14px;text-align:center;vertical-align:middle;white-space:nowrap}td svg{vertical-align:middle}' +
  '.place{display:inline-block;vertical-align:middle;margin-left:26px;width:90px;text-align:left}.place svg{display:block;margin-bottom:8px}.wedge{width:90px}' +
  '.foot{color:#555;font-size:13px;margin-top:22px}' +
  '</style></head><body><main>' +
  '<h1>The three body problem — the state signs, on ' + B.grounds.length + ' grounds</h1>' +
  '<p>The four signs as you kept them, with the dots 50 % bigger. Each row is one ground; each column one state.</p>' +
  '<p>In every cell: the sign large, then the sign at its size in the score (' + PX + ' px) standing a gap above a piece of its own wedge.</p>' +
  '<p class="one">The one decision: a letter for the ground.</p>' +
  '<div class="wrap"><table><thead><tr><th>ground</th>' + B.states.map((st) => '<th class="s">' + esc(st.name) + '</th>').join('') + '</tr></thead><tbody>\n' + rows + '\n</tbody></table></div>' +
  '<p class="foot">Rows a … d are the ones you asked for; e … k are suggestions. The notation score is not changed by this page: when you name a letter, the bigger dots, the ground and the place above the wedge go in together. Built by <code>node tools/signs/build_state_signs.js</code> from <code>bank/signs/state_signs.json</code>.</p>' +
  '</main></body></html>\n';
const out = path.join(ROOT, 'score', 'public', 'signs', 'state_signs.html');
fs.writeFileSync(out, html);
console.log('wrote score/public/signs/state_signs.html — ' + B.states.length + ' signs × ' + B.grounds.length + ' grounds · http://localhost:5500/signs/state_signs.html');
