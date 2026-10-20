// tools/language/badge_lib.js — a language type's CHOSEN badge as an <svg> string, for any page that wants to show one
// (decibel PLAN 2.3 · 2.4; RUNNING_LOG §318). The same reading as tools/language/build_page.js: bank/language/language.json (the
// format, the type's `symbol` and `colour`), bank/palette/sol.json · clr.json (the colours), notation/lib/glyphs.json (a drawing's
// `<glyph name='…' x y h/>` is the notation font's own outline).
//
//   const { chosenBadge } = require('../language/badge_lib');   chosenBadge('shortAttacks', 36)  →  '<svg …>' | null (not chosen yet)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

function load() {
  const L = rd('bank/language/language.json'), SOL = rd('bank/palette/sol.json'), CLR = rd('bank/palette/clr.json'), G = rd('notation/lib/glyphs.json'), B = L.badge;
  const withGlyphs = svg => svg.replace(/<glyph\s+name='([\w.]+)'\s+x='([-\d.]+)'\s+y='([-\d.]+)'\s+h='([\d.]+)'\s*\/>/g, (m, name, x, y, h) => {
    const g = name.split('.').reduce((o, k) => (o ? o[k] : undefined), G);
    if (!g || !g.path || !(g.hSs > 0)) throw new Error('badge_lib: no glyph "' + name + '" in notation/lib/glyphs.json');
    return "<path transform='translate(" + x + ',' + y + ') scale(' + (+h / g.hSs).toFixed(4) + ")' d='" + g.path + "'/>";
  });
  const colourOf = n => {
    if (n === B.colourName) return B.icon;
    if (B.plainColours && B.plainColours[n]) return B.plainColours[n];
    const c = SOL.colours.find(c => c.name === n) || CLR.colours.find(c => c.name === n || 'clr_' + c.name === n);
    if (!c) throw new Error('badge_lib: no colour "' + n + '"'); return c.value;
  };
  const badge = (svg, colour, px) => '<svg class="bdg" width="' + px + '" height="' + px + '" viewBox="0 0 36 36" style="color:' + colour + '"><rect width="36" height="36" rx="' + B.cornerPx + '" ry="' + B.cornerPx + '" fill="' + B.ground + '"/>' + withGlyphs(svg).replace(/'/g, '"') + '</svg>';
  return { L, B, colourOf, badge, withGlyphs };
}
function chosenBadge(typeId, px) {
  const { L, colourOf, badge } = load();
  const t = L.types.find(t => t.id === typeId); if (!t || !t.symbol || !t.colour) return null;
  const c = ((L.candidates || {})[typeId] || []).find(c => c.id === t.symbol); if (!c) return null;
  return badge(c.svg, colourOf(t.colour), px || 36);
}
function chosenTypes() { const { L } = load(); return L.types.filter(t => t.symbol && t.colour).map(t => ({ id: t.id, name: t.name, colour: t.colour })); }
// [RUNNING_LOG §325] a chosen type as the notation registry takes it: its sign with every font glyph resolved to its outline (currentColor kept)
function chosenSign(typeId) {
  const { L, withGlyphs } = load();
  const t = L.types.find(t => t.id === typeId); if (!t || !t.symbol || !t.colour) return null;
  const c = ((L.candidates || {})[typeId] || []).find(c => c.id === t.symbol); if (!c) return null;
  return { id: t.id, name: t.name, symbol: t.symbol, colour: t.colour, sign: withGlyphs(c.svg) };
}
module.exports = { chosenBadge, chosenTypes, chosenSign, load };
