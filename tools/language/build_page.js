// tools/language/build_page.js — THE LANGUAGE'S WORKING PAGE (decibel PLAN 2.3; RUNNING_LOG §307 · §308).
//
//   node tools/language/build_page.js
//
// Reads bank/language/language.json (his six sound types, the badge format, the candidate signs), bank/palette/sol.json · clr.json (the
// colours) and notation/lib/glyphs.json (the notation's own font) and writes score/public/language/index.html — served at
// http://localhost:5500/language/index.html. A type he has CHOSEN (`symbol` + `colour`) shows its badge; the type in hand shows every
// candidate sign as a BADGE in the format of pieces #1 and #2, large and at its true 36 px, in each colour — for his eye.
// A candidate's `<glyph name='articulation.trill' x y h/>` is drawn from the notation font's own outline (LilyPond's Emmentaler).
// Regenerated at will; a candidate, a colour, a choice or a type is a row of the JSON.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const L = rd('bank/language/language.json'), SOL = rd('bank/palette/sol.json'), CLR = rd('bank/palette/clr.json'), G = rd('notation/lib/glyphs.json');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const B = L.badge;

// the notation font's glyph, by its key in glyphs.json — top-left at x, y, scaled to the height h (the paths are in staff spaces, y down)
function withGlyphs(svg) {
  return svg.replace(/<glyph\s+name='([\w.]+)'\s+x='([-\d.]+)'\s+y='([-\d.]+)'\s+h='([\d.]+)'\s*\/>/g, (m, name, x, y, h) => {
    const g = name.split('.').reduce((o, k) => (o ? o[k] : undefined), G);
    if (!g || !g.path || !(g.hSs > 0)) throw new Error('language page: no glyph "' + name + '" in notation/lib/glyphs.json');
    const s = +h / g.hSs;
    return "<path transform='translate(" + x + ',' + y + ') scale(' + s.toFixed(4) + ")' d='" + g.path + "'/>";
  });
}
// a badge: the rounded square, the sign in it in `colour`, at `px` across
const badge = (svg, colour, px) => '<svg class="bdg" width="' + px + '" height="' + px + '" viewBox="0 0 36 36" style="color:' + colour + '"><rect width="36" height="36" rx="' + B.cornerPx + '" ry="' + B.cornerPx + '" fill="' + B.ground + '"/>' + withGlyphs(svg).replace(/'/g, '"') + '</svg>';
const colourOf = n => { if (n === B.colourName) return B.icon; if (B.plainColours && B.plainColours[n]) return B.plainColours[n];   // … and white   // the format's own blue, a name a type may take (language.json badge.colourName)
  const c = SOL.colours.find(c => c.name === n) || CLR.colours.find(c => c.name === n || 'clr_' + c.name === n); if (!c) throw new Error('language page: no colour "' + n + '"'); return c.value; };
const cand = (t, id) => ((L.candidates || {})[t.id] || []).find(c => c.id === id);
const chosen = L.types.filter(t => t.symbol && t.colour);
const takenBy = {}; for (const t of chosen) takenBy[t.colour] = t.name;
// the colours a sign is tried in: the format's own blue, white, and the SOL colours
const TRY = [['the format’s blue', B.icon, takenBy[B.colourName] || null], ['white', '#FFFFFF', takenBy.white || null]].concat(['SOL_yellow', 'SOL_orange', 'SOL_red', 'SOL_green', 'SOL_blue', 'SOL_purple'].map(n => [n, colourOf(n), takenBy[n] || null]));

let types = '';
for (const t of L.types) {
  const c = t.symbol && cand(t, t.symbol);
  types += '<tr><td class="tn">' + esc(t.name) + (t.nameOptions ? '<div class="opt">' + t.nameOptions.map(esc).join(' · ') + '</div>' : '') + (t.nameFrom ? '<div class="opt">' + esc(t.nameFrom) + '</div>' : '') + '</td>' +
    '<td>' + (t.braxton ? 'Braxton ' + t.braxton.n + ', ' + esc(t.braxton.name.toLowerCase()) + '<div class="opt">his sign: ' + esc(t.braxton.sign) + '</div>' : '<span class="opt">not one of Braxton’s twelve — the piece’s own</span>') + '</td>' +
    '<td>' + esc(t.inThePiece) + '</td><td>' + (c ? '<div class="pick">' + badge(c.svg, colourOf(t.colour), 72) + badge(c.svg, colourOf(t.colour), B.sizePx) + '<div class="opt">' + esc(c.name) + '<br>' + esc(t.colour === B.colourName ? 'the format’s blue' : t.colour) + '</div></div>' : '<span class="opt">—</span>') + '</td></tr>';
}

let sections = '';
for (const t of L.types) {
  const cands = (L.candidates || {})[t.id]; if (!cands) continue;
  if (t.symbol && t.colour) {
    // CHOSEN: its badge, and any candidate marked as the same sign in another drawing, beside it for his eye
    const c = cand(t, t.symbol), also = cands.filter(x => x.id !== t.symbol && x.id.indexOf(t.symbol) === 0);
    sections += '<h2 id="' + t.id + '">' + esc(t.name) + (t.reopen ? ' — chosen so far, REOPENED' : ' — chosen') + '</h2><div class="tries" style="margin-left:0">' +
      '<div class="try">' + badge(c.svg, colourOf(t.colour), 96) + badge(c.svg, colourOf(t.colour), B.sizePx) + '<div class="tl"><b>' + esc(c.name) + '</b> · ' + esc(t.colour === B.colourName ? 'the format’s blue' : t.colour) + '</div></div>' +
      also.map(x => '<div class="try">' + badge(x.svg, colourOf(t.colour), 96) + badge(x.svg, colourOf(t.colour), B.sizePx) + '<div class="tl">' + esc(x.name) + '</div></div>').join('') + '</div>' +
      (also.length && !t.reopen ? '<p class="note">The second is the same sign drawn by the notation font. Say which you want; the first stands until you do.</p>' : '');
    // [§313] `reopen`: a chosen type he wants to look at again — its badge above stands until he says; every candidate is shown below
    if (!t.reopen) continue;
    sections += '<p>' + esc(t.reopen) + '</p>';
  }
  let rows = '';
  cands.forEach((c, i) => {
    const mine = t.symbol === c.id;
    rows += '<div class="cand"><div class="chead"><span class="letter">' + String.fromCharCode(97 + i) + '</span><span class="cname">' + esc(c.name) + '</span>' + (mine ? '<span class="now">the one chosen so far</span>' : '') + '</div>' +
      '<div class="cwhy"><div>' + esc(c.from) + '</div><div class="for">' + esc(c.for) + '</div></div>' +
      '<div class="tries">' + TRY.map(([label, col, tk]) => { const taken = tk && tk !== t.name ? tk : null, own = tk === t.name;   // a type's own colour is not "taken" from it
        return '<div class="try' + (taken ? ' taken' : '') + '">' + badge(c.svg, col, 96) + badge(c.svg, col, B.sizePx) + '<div class="tl">' + esc(label) + (taken ? '<br><i>taken: ' + esc(taken) + '</i>' : own ? '<br><i>its colour so far</i>' : '') + '</div></div>'; }).join('') + '</div></div>';
  });
  sections += '<h2' + (t.symbol ? '' : ' id="' + t.id + '"') + '>' + esc(t.name) + ' — the candidates</h2>' +
    (t.braxton ? '<p>Braxton’s Language Type ' + t.braxton.n + '. His sign: ' + esc(t.braxton.sign) + '.</p>' : '') +
    '<p class="note">Each sign twice: large, and at its true size in the score, 36 px. The row of colours is the same for every sign.</p>' + rows;
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>The language — working page</title>
<style>
 body { margin: 0; background: #fff; color: #111; font: 15px/1.45 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
 main { max-width: 1180px; margin: 0 auto; padding: 28px 28px 90px; }
 h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 20px; margin: 46px 0 6px; padding-top: 18px; border-top: 2px solid #111; }
 p { margin: 4px 0 10px; max-width: 780px; } .note { color: #555; font-size: 13.5px; }
 table { border-collapse: collapse; margin: 10px 0 0; } td, th { text-align: left; vertical-align: top; padding: 9px 22px 9px 0; border-bottom: 1px solid #ddd; font-size: 14.5px; }
 th { font-size: 12.5px; text-transform: uppercase; letter-spacing: .07em; color: #555; } .tn { font-weight: 600; white-space: nowrap; } .opt { color: #666; font-size: 13px; font-weight: 400; white-space: normal; max-width: 340px; }
 .pick { display: flex; align-items: flex-end; gap: 8px; }
 .cand { padding: 20px 0 22px; border-bottom: 1px solid #ddd; }
 .chead { display: flex; align-items: baseline; gap: 12px; } .now { font-size: 12.5px; font-weight: 600; color: #fff; background: #111; padding: 2px 8px; border-radius: 3px; } .letter { font: 700 20px Consolas, monospace; } .cname { font-size: 18px; font-weight: 600; }
 .cwhy { margin: 2px 0 12px 32px; max-width: 760px; color: #333; } .for { color: #555; font-size: 14px; }
 .tries { display: flex; flex-wrap: wrap; gap: 14px 20px; margin-left: 32px; } .try { display: flex; flex-direction: column; align-items: flex-start; }
 .try .bdg:first-child { margin-bottom: 8px; } .tl { font-size: 12px; color: #555; margin-top: 4px; } .try.taken .tl { color: #999; }
 .fmt { display: flex; align-items: center; gap: 18px; margin: 10px 0; }
 ol { margin: 6px 0 0 20px; padding: 0; columns: 2; max-width: 900px; } li { margin: 0 0 3px; font-size: 14px; }
</style></head><body><main>
<h1>The language — working page</h1>
<p>The piece's sound types, after Anthony Braxton's Language Music. Each type gets a badge: a sign and a colour. One type at a time.</p>

<h2>The badge</h2>
<div class="fmt">${badge(B.exampleSvg, B.icon, 96)}${badge(B.exampleSvg, B.icon, 36)}<div><b>The format of pieces 1 and 2.</b><br>${esc(B.from)}<br><span class="note">Shown: the string quartet's flocking badge as drawn there, large and at 36 px.</span></div></div>

<h2>The six types</h2>
<table><tr><th>the type</th><th>after</th><th>in the piece</th><th>its badge</th></tr>${types}</table>

${sections}

<h2>For reference — Braxton's twelve</h2>
<p class="note">From his own handout, in the Anthony Braxton Papers at the Library of Congress. The signs are described here in words; the handout is on the Library's site.</p>
<ol>${L.braxtonTwelve.map(x => '<li>' + esc(x.replace(/^\d+\s/, '')) + '</li>').join('')}</ol>

<p class="note" style="margin-top:48px">Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} by node tools/language/build_page.js from bank/language/language.json, bank/palette/sol.json and the notation font (notation/lib/glyphs.json). ${CLR.colours.length} named colours of his own are on the palette page.</p>
</main></body></html>
`;
const out = path.join(ROOT, 'score', 'public', 'language', 'index.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('wrote score/public/language/index.html —', L.types.length, 'types,', chosen.length, 'chosen;', L.types.filter(t => (L.candidates || {})[t.id] && !(t.symbol && t.colour)).map(t => t.name + ': ' + L.candidates[t.id].length + ' candidates').join(' · '));
