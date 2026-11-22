// node tools/port/scratch/quartet_signs.js — a look-only sheet: the string quartet's (piece 1's) own engraved figures for bow overpressure,
// col legno and pizzicato behind the bridge, rendered side by side into probes/quartet_signs/sheet.png (RUNNING_LOG §391). Reads piece 1; writes only here.
// Each LilyPond page is mostly empty paper: it is rendered large, the ink's box found by its pixels, and that box cut out.
const fs = require('fs'), path = require('path'), { Resvg } = require('@resvg/resvg-js');
const SRC = 'C:/Users/jwloy/GitHub/string_quartet_no1-composer/lilypond_code', OUT = path.join(__dirname, '..', '..', '..', 'probes', 'quartet_signs');
fs.mkdirSync(OUT, { recursive: true });
const items = [
  ['1 bow overpressure', 'BowOverpressureAccent_noStaff.svg'],
  ['2 overpressure, pp (sfz)', 'BowOverpressureAccent_noStaff-pp_sfz.svg'],
  ['3 overpressure, in the score', 'm6_vln1_bowOverpressureAccent_C3_final.svg'],
  ['4 short accented overpressure', 'short_accented_overpressure-render.svg'],
  ['5 col legno battuto', 'clb_template_stemUp.svg'],
  ['6 col legno battuto ricochet', 'col legno battuto ricochet.svg'],
  ['7 ricochet', 'M2a_ricochet_inkscape.svg'],
  ['8 two-handed pizz. (f.b. / b.b.)', 'Two-Handed Pizzicato Clusters_render.svg'],
];
const H = 360, CW = 420, cells = [];
for (const [label, f] of items) {
  const p = path.join(SRC, f); if (!fs.existsSync(p)) { console.log('missing ' + f); continue; }
  try {
    const r = new Resvg(fs.readFileSync(p), { fitTo: { mode: 'width', value: 2400 }, background: 'white', font: { loadSystemFonts: true } }).render(), px = r.pixels, W = r.width, Hh = r.height;
    let x0 = W, y0 = Hh, x1 = -1, y1 = -1;
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (px[i] < 200 || px[i + 1] < 200 || px[i + 2] < 200) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    if (x1 < 0) { console.log('EMPTY ' + f); continue; }
    const m = 12; x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(W, x1 + m); y1 = Math.min(Hh, y1 + m);
    const bw = x1 - x0, bh = y1 - y0, k = Math.min(H / bh, CW / bw), w = Math.round(bw * k), h = Math.round(bh * k);
    cells.push({ label, w, h, vb: x0 + ' ' + y0 + ' ' + bw + ' ' + bh, W, Hh, png: r.asPng().toString('base64') }); console.log(f + ' ink ' + bw + 'x' + bh + ' of ' + W + 'x' + Hh);
  } catch (e) { console.log('FAILED ' + f + ' ' + e.message); }
}
const COLS = 4, RH = H + 80, rowsN = Math.ceil(cells.length / COLS), SW = COLS * (CW + 40) + 20;
const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + SW + '" height="' + (rowsN * RH + 20) + '"><rect width="100%" height="100%" fill="white"/>' +
  cells.map((c, i) => { const x = 20 + (i % COLS) * (CW + 40), y = Math.floor(i / COLS) * RH;
    return '<text x="' + x + '" y="' + (y + 36) + '" font-family="Arial" font-size="24" fill="#222">' + c.label + '</text><svg x="' + x + '" y="' + (y + 56) + '" width="' + c.w + '" height="' + c.h + '" viewBox="' + c.vb + '"><image width="' + c.W + '" height="' + c.Hh + '" xlink:href="data:image/png;base64,' + c.png + '"/></svg>'; }).join('') + '</svg>';
fs.writeFileSync(path.join(OUT, 'sheet.png'), new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log('sheet ' + SW);
