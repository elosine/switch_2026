// tools/signs/build_layout.js — THE LANE'S LAYOUT, section by section, drawn on the notation's own frame
// (decibel PLAN 2.6; RUNNING_LOG §324).
//
//   node tools/signs/build_layout.js
//
// He decides where things sit in a lane by eye. This draws a section's pages as the notation app and the film draw them — the frame
// is built exactly as tools/export_video.js builds it and the page comes from notation/lib/static_page.js (names, brackets, the
// staff's opening snippet with its clef, the grey lines) — with the section's NOTES LEFT OUT and the signs decided for it ADDED from
// the piece's save: the mic openings and the announcing badge. The places are rows of bank/signs/layout.json, provisional.
// Writes score/public/signs/layout.html (http://localhost:5500/signs/layout.html). This is NOT yet the notation engine's own drawing
// of these signs: a settled place becomes a row of notation/registry/rules.json by a device sheet, and the extractor then carries it.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const lib = n => require(path.join(ROOT, 'notation', 'lib', n));
const Coords = lib('coords.js'), Layout = lib('layout.js'), Splice = lib('splice.js'), StaticPage = lib('static_page.js'), Fit = lib('fit.js');
const { chosenBadge } = require('../language/badge_lib');
const CFG = rd('bank/signs/layout.json'), MIC = rd('bank/signs/mic_opening.json');
const C = lib('rules.js').loadContainer(ROOT), glyphs = rd('notation/lib/glyphs.json'), pageRules = rd('notation/registry/page_rules.json');
const ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json'), S = rd('scores/' + CFG.score + '.json');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const r = v => +v.toFixed(1);
const yel = MIC.yellows.find(y => y.id === MIC.chosen.yellow).value, rc = MIC.recipes.find(x => x.id === MIC.chosen.recipe);

// ---- the frame, as tools/export_video.js builds it (the presentation score: the realization video-jury, as the app's page)
const RZ = (C.realizations || {})['video-jury'] || {};
const ENS = Layout.ensembleFor(ens, RZ), ensPart = p => (ENS && ENS.parts.find(q => q.part === p)) || null, PARTS = ENS.parts.map(p => p.part);
const W = (C.frame && C.frame.widthPx) || 1920, H = (C.frame && C.frame.heightPx) || 1080;
const PAGE_S = (C.timeScale && C.timeScale.defaults && C.timeScale.defaults.trance) || 12;
const FRAME = Coords.ensembleFrame(PARTS, {
  heightPx: H, lanes: RZ.lanes || { padTopPx: 8, padBotPx: 8, gapPx: 4 }, staffHeightPx: (C.staff && C.staff.staffHeightPx) || 31.6,
  grandStaff: ((C.engraving || {}).layout || {}).grandStaff, weightOf: p => (ensPart(p) && ensPart(p).weight) || 1,
  stavesOf: p => (ensPart(p) && ensPart(p).staves && ensPart(p).staves.length) || 1, ensemble: ENS,
});
const EDGES = Coords.edgesOf(C);
const rootTag = vb => '<svg xmlns="http://www.w3.org/2000/svg" class="frame" viewBox="' + vb + '">';

// ---- one section: its pages on the real frame, the signs added
function section(sec, badgeAt, onlyFirst) {
  const ir = rd('notation/ir/' + sec.ir + '.ir.json');
  ir.events = []; ir.chunks = []; ir.overlays = [];   // the players' page of this section draws no notes
  const model = Layout.layoutSection(ir, glyphs, Object.assign(
    { m4AttackLines: false, frameParts: PARTS, ensemble: ENS, techniques: T, fitBoxes: Fit.boxesFor(C, ENS, PARTS) }, (C.engraving && C.engraving.layout) || {}));
  const SRC0 = ir.source.window[0] - Splice.leadInOf(pageRules, RZ), pages = Splice.tilePages(ir, pageRules, PAGE_S, SRC0);
  const s0 = sec.window[0], s1 = sec.window[1], G = CFG.lane.gapPx, BP = CFG.badge.px;
  const opens = S.objects.filter(o => o.midiModel === 'elecOpen' && o.startTime >= s0 - 1e-6 && o.startTime < s1)
    .map(o => ({ a: o.startTime, b: o.endTime, part: o.layer })).sort((u, v) => u.a - v.a);
  const badge = sec.badge ? chosenBadge(sec.badge, BP) : null, out = [];
  pages.forEach((pg, i) => {
    if (onlyFirst && i) return;
    const t0 = pg.t0, t1 = t0 + PAGE_S;
    const view = Coords.makeView(Object.assign({ widthPx: W, heightPx: H, window: [t0, t1], systems: FRAME.systems, ssPerSystem: FRAME.ssPerSystem }, EDGES));
    const band = part => { const y = view.system(part); return { top: y.yTopPx, bot: y.yBotPx, h: y.yBotPx - y.yTopPx }; };
    const X = view.xOfSeconds, micH = bd => Math.max(CFG.mic.minPx, bd.h * CFG.mic.heightFrac);
    const first = new Map();                             // a lane (by its band's top) -> its first opening of the section
    for (const o of opens) { const k = r(band(o.part).top); if (!first.has(k)) first.set(k, o); }
    let add = '<g class="signs">', n = 0;
    for (const o of opens) {
      if (!(o.b > t0 && o.a < t1)) continue;
      const bd = band(o.part), bh = micH(bd), x = X(o.a), w = X(o.b) - x, y = bd.top + G, cy = y + bh / 2; n++;
      add += '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(bh) + '" rx="3" fill="' + yel + '" fill-opacity="' + rc.fillOpacity + '" stroke="' + yel + '" stroke-width="' + rc.strokeWidth + '" stroke-opacity="' + rc.strokeOpacity + '"/>' +
        '<circle cx="' + r(x + 11.5) + '" cy="' + r(cy) + '" r="5.3" fill="none" stroke="' + rc.sign + '" stroke-width="1.3"/><circle cx="' + r(x + 11.5) + '" cy="' + r(cy) + '" r="2.3" fill="' + rc.sign + '"/>';
    }
    if (badge) for (const o of first.values()) {
      const at = badgeAt === 'sectionStart' ? s0 : o.a; if (!(at >= t0 - 1e-9 && at < t1)) continue;
      const bd = band(o.part), y = bd.top + G + (micH(bd) - BP) / 2, x = badgeAt === 'sectionStart' ? X(s0) : X(o.a) - CFG.badge.gapPx - BP;
      add += '<g transform="translate(' + r(x) + ',' + r(y) + ')">' + badge + '</g>';
    }
    const svg = StaticPage.staticPageSvg({ model, view, glyphs, C, ensemble: ENS, srcEnd: Infinity, ownsEnd: false, edgeBar: false, reshow: pg.reshow,
      screenEdges: { edge: pageRules.edge || {}, first: t0 <= SRC0 + 1e-9, clampGoLine: pageRules.clampGoLine }, append: add + '</g>' });
    out.push({ i, t0, t1, n, view, raw: svg, svg: svg.replace(/<svg[^>]*>/, rootTag('0 0 ' + W + ' ' + H)) });
  });
  return { pages: out, opens };
}

// ---- the page
let body = '', said = [];
for (const sec of CFG.sections) {
  const A = section(sec, CFG.badge.at), B = CFG.badge.alt ? section(sec, CFG.badge.alt, true) : null;
  const p1 = A.pages[0], v = p1.view, b0 = v.system(PARTS[0]), b1 = v.system(PARTS[1]), lh = b0.yBotPx - b0.yTopPx;
  const G = CFG.lane.gapPx, bh = Math.max(CFG.mic.minPx, lh * CFG.mic.heightFrac), st = (C.staff && C.staff.staffHeightPx) || 31.6;
  // the close-up: the top two lanes from the frame's left edge to the first mic opening — the same drawing, enlarged
  const cx0 = 0, cx1 = v.xOfSeconds(A.opens[0].b) + 60, cy0 = b0.yTopPx - 7, cy1 = b1.yBotPx + 7;
  const close = p1.raw.replace(/<svg[^>]*>/, rootTag(r(cx0) + ' ' + r(cy0) + ' ' + r(cx1 - cx0) + ' ' + r(cy1 - cy0)));
  const cap = p => '<div class="cap">Page ' + (p.i + 1) + ' &nbsp;·&nbsp; ' + p.t0 + ' … ' + p.t1 + ' s &nbsp;·&nbsp; ' + p.n + ' mic openings</div>';
  body += '<h2 id="' + sec.id + '">' + esc(sec.name) + '</h2><p>' + esc(sec.shows) + '</p>' +
    '<h3>A lane, top to bottom</h3><table class="map">' +
    '<tr><td>the gap under the dividing line</td><td>0 … ' + G + ' px</td></tr>' +
    '<tr><td><b>the mic opening</b> — and the badge, in the same row</td><td>' + G + ' … ' + r(G + bh) + ' px</td></tr>' +
    '<tr><td>free</td><td>' + r(G + bh) + ' … ' + r(lh / 2 - st / 2) + ' px</td></tr>' +
    '<tr><td>the staff, where it shows</td><td>' + r(lh / 2 - st / 2) + ' … ' + r(lh / 2 + st / 2) + ' px</td></tr>' +
    '<tr><td>free</td><td>' + r(lh / 2 + st / 2) + ' … ' + r(lh - G) + ' px</td></tr>' +
    '<tr><td>the gap above the next dividing line</td><td>' + r(lh - G) + ' … ' + r(lh) + ' px</td></tr></table>' +
    '<p class="note">A lane is ' + r(lh) + ' px tall. The mic opening is a fifth of it, ' + r(bh) + ' px. The badge is ' + CFG.badge.px + ' px.</p>' +
    '<h3>Close-up — the top two lanes, from the left edge to the first mic opening, enlarged</h3>' + close +
    '<h3>The pages</h3>' + A.pages.map(p => cap(p) + p.svg).join('');
  if (B) body += '<h3>The other way for the badge — all five in a column where the section begins</h3><p class="note">Page 1 again. Above, each lane\'s badge stands just left of that player\'s first mic opening.</p>' + B.pages.map(p => p.svg).join('');
  said.push(sec.name + ': ' + A.pages.length + ' pages, ' + A.opens.length + ' mic openings');
}
const css = 'body{margin:0;background:#f4f3f0;color:#111;font:15px/1.45 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif}' +
  '@font-face{font-family:"Crimson Pro Light";font-style:normal;font-weight:300;src:url("/notation/app/fonts/CrimsonPro-Light.ttf") format("truetype")}' +
  '@font-face{font-family:"Crimson Pro Light";font-style:italic;font-weight:300;src:url("/notation/app/fonts/CrimsonPro-LightItalic.ttf") format("truetype")}' +
  'main{max-width:1700px;margin:0 auto;padding:26px 26px 90px}h1{font-size:26px;margin:0 0 4px}' +
  'h2{font-size:21px;margin:40px 0 6px;padding-top:16px;border-top:2px solid #111}h3{font-size:16px;margin:30px 0 8px}' +
  'p{margin:4px 0 10px;max-width:860px}.note{color:#555;font-size:13.5px}.cap{margin:22px 0 6px;font-weight:600}' +
  '.frame{display:block;width:100%;height:auto;border:1px solid #bbb;background:#fff}' +
  '.map{border-collapse:collapse;margin:6px 0}.map td{padding:3px 22px 3px 0;border-bottom:1px solid #ddd}.map td+td{font-family:Consolas,monospace;font-size:13.5px}';
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The lane\'s layout — working page</title><style>' + css + '</style></head><body><main>' +
  '<h1>The lane\'s layout — working page</h1>' +
  '<p>Where things sit in a lane, section by section. The page is the notation\'s own: the names, the brackets, the snippet of staff at the start, the grey lines. The mic openings are the piece\'s own, read from the save.</p>' +
  '<p class="note">The mic opening is at the TOP of the lane, for now. The gap of ' + CFG.lane.gapPx + ' px is a first number. No notes, no dynamics, no words, nothing of what the electronics play back.</p>' +
  body +
  '<p class="note" style="margin-top:48px">Generated ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' by node tools/signs/build_layout.js from scores/' + esc(CFG.score) + '.json and bank/signs/layout.json. Each frame is the score\'s own, 1920 × 1080, shown reduced to the window.</p>' +
  '</main></body></html>';
fs.writeFileSync(path.join(ROOT, 'score', 'public', 'signs', 'layout.html'), html);
console.log('wrote score/public/signs/layout.html —', said.join(' · '));
