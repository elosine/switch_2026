// tools/palette/build_page.js — THE PALETTE'S WORKING PAGE (decibel PLAN 2.2; RUNNING_LOG §304).
//
//   node tools/palette/build_page.js
//
// Reads bank/palette/clr.json (his named colours) and bank/palette/lewitt_reading.json (tools/palette/lewitt_read.py) and writes
// score/public/palette/index.html — served by the score server at http://localhost:5500/palette/index.html. A page of swatches for
// his eye: LeWitt's colours as the photographs give them, each photograph's own reading beside the mean, and his own colours of the
// same family next to them. No photograph is on the page (other people's pictures). Regenerated at will — do not edit the page.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const CLR = rd('bank/palette/clr.json'), LW = rd('bank/palette/lewitt_reading.json'), SRC = rd('bank/palette/lewitt_sources.json');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const ORDER = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black'];
const lum = hex => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ink = hex => (lum(hex) > 0.45 ? '#111' : '#fff');
const agree = d => (d < 4 ? 'the photographs agree' : d < 8 ? 'the photographs differ a little' : 'the photographs differ plainly');

// one use-strip under a swatch: the colour as a thin line, and as a 30 % tint — how the score would use it
const strip = hex => '<div class="use"><span class="line" style="background:' + hex + '"></span><span class="tint" style="background:' + hex + '"></span></div>';
const big = (hex, name, sub) => '<div class="big"><div class="sw" style="background:' + hex + ';color:' + ink(hex) + '">' + esc(hex) + '</div>' + strip(hex) +
  '<div class="nm">' + esc(name) + '</div>' + (sub ? '<div class="sub">' + esc(sub) + '</div>' : '') + '</div>';
const small = (hex, label, cls) => '<div class="small' + (cls ? ' ' + cls : '') + '" title="' + esc(label + ' ' + hex) + '"><div class="sw" style="background:' + hex + '"></div><div class="lb">' + esc(label) + '</div><div class="hx">' + esc(hex) + '</div></div>';

const fam = LW.families;
let lewitt = '';
for (const name of ORDER) {
  const f = fam[name]; if (!f) continue;
  // TWO large swatches where the two readings differ (§305): the photographs with the white wall beside the drawing, as read · every
  // photograph, the ceiling-lit ones EVENED (their exposure set right through a paint they share with the wall photographs)
  const wo = f.wallOnly, wb = f.wallAndBridged;
  const plural = n => n + ' photograph' + (n > 1 ? 's' : '');
  const wall = f.samples.filter(s => s.ref === 'wall'), ceil = f.samples.filter(s => s.ref !== 'wall');
  const evened = ceil.filter(s => s.bridgedHex && s.bridge !== name), forced = ceil.filter(s => s.bridge === name);
  lewitt += '<section class="fam"><h3>' + esc(name) + '</h3><div class="row">' +
    (wo ? big(wo.hex, 'white-wall photographs', plural(wo.n) + ' · ' + agree(wo.spreadMeanDE)) : '') +
    (wb && (!wo || wb.n > wo.n) ? big(wb.hex, 'all photographs, evened', plural(wb.n) + ' · ' + agree(wb.spreadMeanDE)) : '') +
    (!wo && !wb ? big(f.all.hex, 'as photographed', plural(f.all.n)) : '') +
    '<div class="each"><div class="cap">each photograph with a white wall beside the drawing</div><div class="smalls">' + (wall.length ? wall.map(s => small(s.hex, s.sample)).join('') : '<span class="none">none</span>') + '</div>' +
    (evened.length ? '<div class="cap dim">the other photographs, evened through a paint they share (' + [...new Set(evened.map(s => s.bridge))].join(' · ') + ')</div><div class="smalls">' + evened.map(s => small(s.bridgedHex, s.sample, 'dim')).join('') + '</div>' : '') +
    (forced.length ? '<div class="cap dim">the photographs evened BY this colour — shown as photographed, too bright; not evidence</div><div class="smalls">' + forced.map(s => small(s.hex, s.sample, 'dim')).join('') + '</div>' : '') +
    '</div></div></section>';
}

const byFam = {};
for (const c of CLR.colours) (byFam[c.family] = byFam[c.family] || []).push(c);
let side = '';
for (const name of ['red', 'orange', 'yellow', 'green', 'blue', 'purple']) {
  const f = fam[name]; const wo = f && f.wallOnly, wb = f && f.wallAndBridged;
  const lw = (c, label) => '<div class="sidesw lw" style="background:' + c.hex + ';color:' + ink(c.hex) + '">LeWitt · ' + label + '<br>' + esc(c.hex) + '</div>';
  side += '<div class="siderow"><div class="sidename">' + esc(name) + '</div>' +
    (wo ? lw(wo, 'white wall') : '') + (wb && (!wo || wb.n > wo.n) ? lw(wb, 'all, evened') : '') +
    (byFam[name] || []).map(c => '<div class="sidesw" style="background:' + c.value + ';color:' + ink(c.value) + '">' + esc(c.name) + '<br>' + esc(c.value) + '</div>').join('') + '</div>';
}
let mine = '';
for (const name of ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey', 'magenta'])
  mine += (byFam[name] || []).map(c => big(c.value, c.name, c.inThisStack ? 'in this piece\'s score today' : '')).join('');

// A NAMED GUESS (RUNNING_LOG §306): the maker's chart, each family's nearest shades — only when tools/palette/lascaux_match.py has run
let MATCH = null; try { MATCH = rd('bank/palette/lascaux_match.json'); } catch (e) { /* no chart read yet */ }
// THE SOL COLOURS (RUNNING_LOG §307): the readings NAMED — bank/palette/sol.json, his to rename or move
let SOLC = null; try { SOLC = rd('bank/palette/sol.json'); } catch (e) { /* not named yet */ }
const solHtml = SOLC ? '<h2>The SOL colours</h2><p>The seven, named. Each value is one pick from the reading below; the line under it says what the maker\'s chart suggests.</p><div class="grid">' +
  SOLC.colours.map(c => big(c.value, c.name, c.chart)).join('') + '</div>' : '';
let guess = '';
if (MATCH) for (const name of ['red', 'orange', 'yellow', 'green', 'blue', 'purple']) {
  const m = MATCH.match[name], f = fam[name]; if (!m || !f) continue;
  const lwc = f.wallAndBridged || f.wallOnly, top = m.nearest.slice(0, 3), d = top[0].distance;
  const word = m.firm ? 'One shade stands out: ' + top[0].number + ' ' + top[0].name + '.'
    : d <= 6.5 ? 'Near, but the photographs cannot tell these apart.'
    : d <= 10 ? 'Only roughly near. The photographs cannot tell these apart.'
    : 'No shade of the chart is near. A mix, a special make, or the limit of the comparison.';
  guess += '<div class="siderow"><div class="sidename">' + esc(name) + '</div>' +
    '<div class="sidesw lw" style="background:' + lwc.hex + ';color:' + ink(lwc.hex) + '">LeWitt, read<br>' + esc(lwc.hex) + '</div>' +
    top.map(c => '<div class="sidesw" style="background:' + c.hex + ';color:' + ink(c.hex) + '">' + esc(c.number + ' ' + c.name) + '<br>' + esc(c.pigments.join(' ')) + '</div>').join('') +
    '</div><p class="verdict">' + esc(word) + '</p>';
}
const works = [...new Set(LW.samples.map(s => s.id + ' = Wall Drawing ' + s.work))].join(' · ');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>The palette — working page</title>
<style>
 body { margin: 0; background: #fff; color: #111; font: 15px/1.45 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
 main { max-width: 1180px; margin: 0 auto; padding: 28px 28px 80px; }
 h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 20px; margin: 46px 0 6px; padding-top: 18px; border-top: 2px solid #111; }
 h3 { font-size: 15px; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 8px; }
 p { margin: 4px 0 10px; max-width: 760px; } .note { color: #555; font-size: 13.5px; }
 .fam { padding: 16px 0; border-bottom: 1px solid #ddd; } .row { display: flex; gap: 34px; align-items: flex-start; flex-wrap: wrap; }
 .big { width: 190px; } .big .sw { height: 120px; display: flex; align-items: flex-end; padding: 8px 10px; box-sizing: border-box; font: 600 15px/1 Consolas, monospace; }
 .use { display: flex; align-items: center; gap: 10px; height: 26px; } .use .line { flex: 1; height: 3px; } .use .tint { width: 70px; height: 18px; opacity: .3; }
 .nm { font-weight: 600; } .sub { color: #555; font-size: 13px; }
 .each { flex: 1; min-width: 320px; } .cap { font-size: 13px; color: #333; margin: 0 0 6px; } .cap.dim { margin-top: 14px; color: #777; }
 .smalls { display: flex; gap: 10px; flex-wrap: wrap; } .small { width: 78px; } .small .sw { height: 56px; } .small.dim .sw { height: 38px; }
 .lb { font-size: 12.5px; font-weight: 600; margin-top: 3px; } .hx { font: 12px Consolas, monospace; color: #555; } .none { color: #999; font-size: 13px; }
 .siderow { display: flex; align-items: stretch; flex-wrap: wrap; margin: 0 0 14px; } .sidename { width: 90px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; font-size: 13px; padding-top: 6px; }
 .sidesw { width: 150px; height: 96px; box-sizing: border-box; padding: 8px 10px; font: 12.5px/1.35 Consolas, monospace; display: flex; align-items: flex-end; }
 .sidesw.lw { width: 190px; font-weight: 700; }
 .grid { display: flex; flex-wrap: wrap; gap: 22px 26px; }
 .verdict { margin: -6px 0 22px 90px; color: #333; font-size: 14px; }
</style></head><body><main>
<h1>The palette — working page</h1>
<p>Your named colours, and LeWitt's late acrylic colours as photographs of four wall drawings at MASS MoCA give them. Under each large swatch: the colour as a thin line and as a pale tint, the two ways a score uses a colour.</p>
<p class="note">A colour here is DERIVED from photographs. It is not a measurement of the paint. Each one is a starting value for your eye.</p>

${solHtml}

<h2>1 · LeWitt, read from the photographs</h2>
<p>Two large swatches for each colour. The first is the mean of the photographs in which the drawing sits on a white wall. The second adds the other photographs, their brightness evened through a paint they share with the first group. The small ones are each photograph alone, so you can see how far they disagree.</p>
<p class="note">The paint: Lascaux Artist acrylic, six colours, in layers — the maker's own page for LeWitt's Zurich murals of 2004 says so. Its shade names are not published.</p>
<p class="note">${esc(works)}</p>
${lewitt}

<h2>2 · Side by side — LeWitt's and yours, by family</h2>
<p>The swatches touch, so a difference shows at the join.</p>
${side}

${guess ? `<h2>3 · A named guess — the nearest shades of the maker's chart</h2>
<p>LeWitt's paint was Lascaux Artist, a range of 54 shades. Which six he used is not published. Here each reading sits beside the three chart shades nearest to it. The chart's swatches are printed approximations, so this names candidates and identifies nothing.</p>
${guess}` : ''}

<h2>${guess ? '4' : '3'} · Your named colours</h2>
<p>${CLR.colours.length} colours, as written in the string quartet's page and the two pianos piece.</p>
<div class="grid">${mine}</div>

<p class="note" style="margin-top:48px">Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} by node tools/palette/build_page.js from bank/palette/clr.json and bank/palette/lewitt_reading.json. The photographs' addresses: bank/palette/lewitt_sources.json (${Object.keys(SRC.photos).length} photographs read).</p>
</main></body></html>
`;
const out = path.join(ROOT, 'score', 'public', 'palette', 'index.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('wrote score/public/palette/index.html —', Object.keys(fam).length, 'LeWitt families,', CLR.colours.length, 'named colours');
