// tools/signs/build_page.js — THE SIGNS' WORKING PAGE (decibel PLAN 2.4; RUNNING_LOG §318).
//
//   node tools/signs/build_page.js
//
// Reads bank/signs/mic_opening.json (how the composer score draws the mic opening, the highlighter yellows found, the recipes) and
// writes score/public/signs/index.html — served at http://localhost:5500/signs/index.html. Every yellow in every recipe, drawn AT THE
// NOTATION'S OWN SCALE on a white lane with its grey line: a short opening (an impulse's 500 ms) with the short attacks' badge under
// it, and the start of a long one (a drone's). Regenerated at will; a yellow or a recipe is a row of the JSON.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const M = rd('bank/signs/mic_opening.json');
const { chosenBadge } = require('../language/badge_lib');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const r = v => +v.toFixed(2);
const shade = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('').toUpperCase();

const LANE = M.frame.laneHeightPx, PPS = M.frame.pxPerSecond;
const BH = r(LANE / 5), SHORT = r(0.5 * PPS), LEAD = r(0.1 * PPS);      // the brick's height · an impulse's opening · the note 100 ms into it
const LINE = '#8a8a8a';                                                   // the lane line (rules.json objects.laneLine)

// one brick: the rounded rectangle, its outline, the two circles
function brick(x, y, w, colour, rc) {
  const edge = rc.strokeShade < 1 ? shade(colour, rc.strokeShade) : colour, sign = rc.sign === 'shade' ? shade(colour, Math.min(rc.strokeShade, 0.62)) : rc.sign;
  const cx = x + 11.5, cy = y + BH / 2;
  return '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + BH + '" rx="3" fill="' + colour + '" fill-opacity="' + rc.fillOpacity + '" stroke="' + edge + '" stroke-width="' + rc.strokeWidth + '" stroke-opacity="' + rc.strokeOpacity + '"/>' +
    '<circle cx="' + r(cx) + '" cy="' + r(cy) + '" r="5.3" fill="none" stroke="' + sign + '" stroke-width="1.3"/><circle cx="' + r(cx) + '" cy="' + r(cy) + '" r="2.3" fill="' + sign + '"/>';
}
const badge = chosenBadge('shortAttacks', 36);
const GW = 372, W = GW * M.recipes.length, H = 152, TOP = 9;

function strip(colour) {
  let s = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '"><rect width="' + W + '" height="' + H + '" fill="#fff"/>' +
    '<rect x="0" y="' + (TOP - 1) + '" width="' + W + '" height="1" fill="' + LINE + '"/>';
  M.recipes.forEach((rc, i) => {
    const x = i * GW + 14, y = TOP + 2;
    s += brick(x, y, SHORT, colour, rc) + brick(x + SHORT + 26, y, 232, colour, rc);
    if (badge) s += '<g transform="translate(' + r(x + LEAD) + ',' + r(y + BH + 20) + ')">' + badge + '</g>';
    s += '<text x="' + x + '" y="' + (H - 8) + '" font-size="12" fill="#555" font-family="Segoe UI, sans-serif">' + esc(rc.name) + '</text>';
  });
  return s + '</svg>';
}
// the composer's own brick, for reference: its teal, its recipe
const ref = (() => { const rc = M.recipes[0], c = M.composer.colour.slice(0, 7); return '<svg width="380" height="70" viewBox="0 0 380 70"><rect width="380" height="70" fill="#fff"/><rect x="0" y="8" width="380" height="1" fill="' + LINE + '"/>' + brick(14, 11, SHORT, c, rc) + brick(14 + SHORT + 26, 11, 232, c, rc) + '</svg>'; })();

// CHOSEN (bank/signs/mic_opening.json `chosen`): the one strip, first on the page
const CH = M.chosen && { y: M.yellows.find(y => y.id === M.chosen.yellow), rc: M.recipes.find(x => x.id === M.chosen.recipe) };
const chosenHtml = CH && CH.y && CH.rc ? (() => { const rc = CH.rc, c = CH.y.value; let g = '<svg width="420" height="152" viewBox="0 0 420 152"><rect width="420" height="152" fill="#fff"/><rect x="0" y="' + (TOP - 1) + '" width="420" height="1" fill="' + LINE + '"/>' + brick(14, TOP + 2, SHORT, c, rc) + brick(14 + SHORT + 26, TOP + 2, 280, c, rc) + (badge ? '<g transform="translate(' + r(14 + LEAD) + ',' + r(TOP + 2 + BH + 20) + ')">' + badge + '</g>' : '') + '</svg>';
  return '<h2>The mic opening — chosen</h2><p><b>' + esc(CH.y.name) + ', ' + esc(CH.y.value) + ' — ' + esc(rc.name) + '.</b> ' + esc(M.chosen.reads) + '</p>' + g; })() : '';
const facts = ['shape', 'fill', 'outline', 'height', 'place', 'sign', 'length'].map(k => '<li><b>' + k + ':</b> ' + esc(M.composer[k]) + '</li>').join('');
const blocks = M.yellows.map((y, i) => '<section class="y"><div class="yh"><span class="letter">' + String.fromCharCode(97 + i) + '</span><span class="sw" style="background:' + y.value + '"></span><span class="yn">' + esc(y.name) + '</span><span class="hx">' + esc(y.value) + '</span></div>' +
  '<div class="from">' + esc(y.from) + '</div>' + strip(y.value) + '</section>').join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>The signs — working page</title>
<style>
 body { margin: 0; background: #fff; color: #111; font: 15px/1.45 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
 main { max-width: 1180px; margin: 0 auto; padding: 28px 28px 90px; }
 h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 20px; margin: 44px 0 6px; padding-top: 18px; border-top: 2px solid #111; }
 p { margin: 4px 0 10px; max-width: 800px; } .note { color: #555; font-size: 13.5px; }
 ul { margin: 6px 0 10px 18px; padding: 0; } li { font-size: 14px; margin: 0 0 2px; }
 .refrow { display: flex; gap: 30px; align-items: flex-start; flex-wrap: wrap; }
 .y { padding: 18px 0 14px; border-bottom: 1px solid #ddd; } .yh { display: flex; align-items: center; gap: 12px; }
 .letter { font: 700 20px Consolas, monospace; } .sw { width: 54px; height: 26px; border: 1px solid #ccc; } .yn { font-size: 18px; font-weight: 600; } .hx { font: 13px Consolas, monospace; color: #555; }
 .from { color: #555; font-size: 14px; margin: 2px 0 10px 32px; max-width: 800px; } .y svg { display: block; margin-left: 18px; max-width: 100%; height: auto; }
 ol { margin: 6px 0 0 20px; padding: 0; } ol li { margin: 0 0 4px; }
</style></head><body><main>
<h1>The signs — working page</h1>
<p>The mic opening first. Everything is drawn at the score's own scale: one pixel here is one pixel of the score.</p>

${chosenHtml}

<h2>The mic opening — as the composer score draws it</h2>
<div class="refrow"><div>${ref}<div class="note">its colour there, ${esc(M.composer.colour)} — a short opening and the start of a long one</div></div>
<ul>${facts}</ul></div>

<h2>The mic opening — the yellows tried</h2>
<p>The same elements: the rounded rectangle, the two circles, the outline, the see-through fill. Five yellows, each drawn three ways.</p>
<ol>${M.recipes.map(rc => '<li><b>' + esc(rc.name) + '.</b> ' + esc(rc.note) + '</li>').join('')}</ol>
<p class="note">In each strip: the grey line is the top of the lane. The short brick is an impulse's opening, half a second, with the short attacks' badge under it where its note falls. The long one is the start of a drone's opening.</p>
${blocks}

<p class="note" style="margin-top:48px">Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} by node tools/signs/build_page.js from bank/signs/mic_opening.json. The lane ${LANE} px tall, the brick ${BH} px, half a second ${SHORT} px.</p>
</main></body></html>
`;
const out = path.join(ROOT, 'score', 'public', 'signs', 'index.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('wrote score/public/signs/index.html —', M.yellows.length, 'yellows ×', M.recipes.length, 'recipes · brick', BH, 'px tall, the short opening', SHORT, 'px');
