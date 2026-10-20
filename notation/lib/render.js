// render.js — Phase B5: layout model + coords view → SVG string (pass 5).
// Pure, dual-load. The ONLY place pixels exist. Ink is black-on-paper; the
// parachute bricks and read-through labels use muted color so mixed
// fidelity is visible at a glance.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./stamps.js'), require('./gc.js'), require('./edge_rules.js'));
  } else {
    root.NotationRender = factory(root.NotationStamps, root.NotationGC, root.NotationEdgeRules);
  }
})(typeof self !== 'undefined' ? self : this, function (Stamps, GC, EdgeRules) {

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // [D42, RUNNING_LOG §447] THE CURVE LOOK, from the two-piano piece's final performance score (builds/performance, renderCurve):
  // ONE closed path — fill = the colour at fillOpacity, a stroke of the same colour and strokeWPx ROUND THE WHOLE SHAPE (top, sides and
  // baseline), and pathOpacity on the path itself. With #2's numbers (0.3 · 2 px · 0.3) the interior shows at 0.3 × 0.3 = 9 % and the
  // outline at 30 % — the border he saw. The composer, 2026-09-13: the standard for these curves, across the board.
  function curvePathD42(C, d) {
    return '<path d="' + d + '" fill="' + C.color + '" fill-opacity="' + (C.fillOpacity != null ? C.fillOpacity : 0.3) +
      '" stroke="' + (C.strokeColor || C.color) + '" stroke-width="' + (C.strokeWPx != null ? C.strokeWPx : 2) +
      '" stroke-opacity="' + (C.strokeOpacity != null ? C.strokeOpacity : 1) + '" stroke-linejoin="round" opacity="' + C.pathOpacity + '"/>';
  }

  // [2c.6] THE ENGRAVING DEFAULTS, once — renderSection merges the registry over a fresh copy; inkSpanSs does the same, so the
  // clamp on screen and the print plan measure a unit with the numbers it is drawn with
  function engravingDefaults() {
    return {
      fontFamily: 'sans-serif',
      partLabel: { xPx: 4, yOffsetSs: 0.9, sizeSs: 1.1 },
      textScale: 1.3,
      clefInsetSs: 0.6, clefGutterGapSs: 0.75,
      attackLine: { wSs: 0.18, hSs: 2.2, offsetSs: 1.1 },
      tick: { wSs: 0.12, hSs: 0.8 },
      brickOpacity: 0.45,
      reshow: { xSs: 4.2, sizeSs: 0.75 },
      // the env-curve device (day 22, retuned same day by composer verdicts:
      // "no outline to curve" -> fill-only, opacity raised to read alone;
      // "go line not visible" -> thicker/darker dashes, AI-intuited numbers).
      // Green = this piece's surge color (#2E7D32).
      envCurve: { strokeWPx: 0, strokeOpacity: 0, fillOpacity: 0.3, color: '#2E7D32' },   // RULES MIRROR (the tuba's V0.10 — the registry wins)
      // the morph glissando (day 35): brightOrange, TOP HALF of the lane, filled
      // to the half-lane baseline. Code default = the census value, so the live
      // view (which does not pass opts.engraving) and the export agree.
      glissCurve: { strokeWPx: 0, strokeOpacity: 0, fillOpacity: 0.22, color: '#F04B00' },   // RULES MIRROR
      // the trance bar line + tempo mark (day 35)
      barLine: { thickSs: 0.13, tempoYSs: 4.4, tempoSizeSs: 1.0, tempoHeadScale: 0.7, tempoStemSs: 2.1, tempoGapSs: 0.85 },
      // the crescendo: the glissando's twin in the bottom half, limeGreen
      // (#99FF00 — piece #1's crescendo colour, and p2's staff-1 green)
      crescCurve: { strokeWPx: 0, strokeOpacity: 0, fillOpacity: 0.22, color: '#99FF00' },   // RULES MIRROR
      // the morph SECTION HEADER (day 35). circleDiaSs = the measured height of
      // the `m` in mf (0.4695 ss — mp and mf agree); spacer = the 0.45 house
      // standard; medium = gapMediumSs. dynBelowSs mirrors dynY's 2.6 ss
      // distance from the staff, on the under side.
      sectionHead: { spacerSs: 0.45, mediumSs: 0.3, circleDiaSs: 0.4695,
                     arrowLenSs: 2, headSs: 0.45, thickSs: 0.13, dynBelowSs: 4.6 },
      // go line: near-black (composer, day 22 second note: "always black
      // gray" — the surge green was never meant for it); width/opacity/dash
      // = the retuned numbers, untouched
      goLine: { wPx: 1.5, opacity: 0.85, dash: '5,4', color: '#333' },   // RULES MIRROR
      // the ring bar (wc-23 element 2): 2/3 of the brick height, always black
      ringBar: { hSs: 0.667, color: '#111', opacity: 1 },   // RULES MIRROR
    };
  }
  function boxForOf(S) {
    return g => {
      if (g === 'notehead') return S.notehead();
      if (g === 'notehead-open') return S.noteheadOpen();
      if (g.startsWith('dyn-')) return S.dynamic(g.slice(4));
      if (/^flag-(up|down)\d+$/.test(g)) { const m = g.match(/^flag-(up|down)(\d+)$/); return S.flagN(+m[2], m[1]); }
      if (g.startsWith('artic-')) return S.articulation(g.slice('artic-'.length));
      if (g.startsWith('accidental-')) return S.accidental(g.slice('accidental-'.length));
      if (g.startsWith('text-')) return S.text(g.slice('text-'.length));       // [2h.5] piece #2's baked 'pizz.'
      if (g.startsWith('pedal-')) return S.pedal(g.slice('pedal-'.length));    // [2h.5] piece #2's 'Ped.'
      throw new Error('render: unknown glyph item "' + g + '"');
    };
  }
  // [2c.4 → 2c.6] A POINT ITEM'S INK, in staff spaces, relative to x(it.t) — [left, right] — from the drawing's own numbers (a glyph's
  // box about its anchor, a ledger's width, a dot's radius, an ottava's widened label …); null for a kind that is not a unit's.
  // The screen clamp multiplies it by the system's ssPx; the print plan (export_print, Splice.edgeIntervals) turns it into seconds.
  function spanSsOf(it, c) {
    const { boxFor, glyphs, E } = c, stds = glyphs.standards, dx = it.dxSs || 0;
    switch (it.k) {
      case 'glyph': {
        const b0 = boxFor(it.g), kx = it.scale || 1, a = it.align ? (b0.anchors[it.align] || { x: 0 }) : { x: 0 };
        return [dx - a.x * kx, dx + (b0.wSs - a.x) * kx];
      }
      case 'rest': { const rg = glyphs.rest['rest' + it.dur]; return [dx, dx + ((rg && rg.wSs) || 1)]; }
      case 'stem': { const h = stds.stem.thickness / 2; return [dx - h, dx + h]; }
      case 'dot': { const r = glyphs.standards.staccatoDot.diameter / 2; return [dx - r, dx + r]; }
      case 'ledger': { const w = (it.wSs || glyphs.notehead.filled.wSs) * (1 + 2 * stds.ledgerLine.lengthFraction); return [dx - w / 2, dx + w / 2]; }
      case 'text': {   // no font metrics here: half an em a character, the anchor honoured
        const w = String(it.text || '').length * 0.5 * (it.size || 1) * E.textScale;
        return it.anchor === 'middle' ? [dx - w / 2, dx + w / 2] : it.anchor === 'end' ? [dx - w, dx] : [dx, dx + w];
      }
      case 'barline': { const h = E.barLine.thickSs / 2; return [dx - h, dx + h]; }
      case 'tempotext': { const hw = glyphs.notehead.filled.wSs * E.barLine.tempoHeadScale / 2; return [dx - hw, dx + E.barLine.tempoGapSs + 3]; }
      case 'glissline': case 'dynarrow': case 'hairpin': { const a = it.dx0Ss || 0, b = it.dx1Ss || 0; return [Math.min(a, b), Math.max(a, b)]; }
      case 'niente': { const r = (it.diaSs || 0.47) / 2; return [dx - r, dx + r]; }
      case 'ottava': {
        const O = stds.ottava || {}, lg = glyphs.ottavaText && glyphs.ottavaText[it.label];
        let xl = it.dx0Ss || 0;
        const xh = it.dx1Ss || 0, lgW = lg ? lg.wSs + (O.textGapBeforeLineSs || 0.1) : 0, minSpan = O.minBracketSpanSs || 1.37;
        if (xh - (xl + lgW) < minSpan) xl = xh - minSpan - lgW;
        return [xl, xh];
      }
      case 'lvslur': return [dx, dx + ((glyphs.letRing && glyphs.letRing.wSs) || 1.6)];
      case 'slash': case 'squiggle': { const a = it.dx0Ss || 0, b = it.dx1Ss || 0; return [Math.min(a, b), Math.max(a, b)]; }   // [§550 · §557] the grace's stroke, the uneven group's
      // the go-time indicators sit at x(t) — in a unit's span, never the reason it is wide
      case 'goline': return [0, 0];
      case 'attackline': return [-E.attackLine.wSs / 2, E.attackLine.wSs / 2];
      // [2b-P.1] a beat frame's line carries its own width (the 0.3 ss band, §581) — the span is the drawing's own number, as below at
      // the rect. It was the plain tick's 0.12: the print cut landed half a band inside a line at 319.03 and it straddled the gutter
      case 'tick': { const w = it.wSs > 0 ? it.wSs : E.tick.wSs; return [-w / 2, w / 2]; }
      default: return null;
    }
  }
  // [decibel PLAN 2.16 step 2, RUNNING_LOG §477] A BADGE'S INK FOR THE PRINT PLAN — [left, right] in staff spaces from x(it.t), by the
  // very numbers the badge branch of renderSection places it with: its row's size and gap (objects.badge · elecBadge · stateSign, a
  // method's badge scaled by objects.methodBadge.scale), its place (before · at · after), its slot, its dx. The print planner could not
  // measure a badge (§396 · §398: a badge before its mic opening hung back across a page cut), so a cut could fall between a badge and
  // what it announces. With this span a badge is part of the UNIT at its time, and the mic opening, the trill, the line or the pane
  // that begins there goes over the page WITH it. PRINT ONLY, deliberately: it is read by inkSpanSs (the print plan), NOT by spanSsOf —
  // on the screen a badge has its own clamp (page_rules edge.badge), and its span inside a unit would move the film's pages.
  // 'topGap' (a trill's badge beside its go line) needs the lane's half gap, which only a view knows: 0.3 ss stands in, a little wide.
  function badgeSpanSs(it, E) {
    const elec = it.row === 'elec', meth = it.row === 'method', stt = it.row === 'state';
    const BG = elec ? E.elecBadge : stt ? E.stateSign : E.badge, MO = E.micOpening || {};
    if (!BG || !(BG.sizeSs > 0)) return null;
    const bs = BG.sizeSs * (meth && E.methodBadge ? E.methodBadge.scale : 1), gap = BG.gapSs || 0;
    const dx = it.dx === 'topGap' ? (MO.gapSs || 0) + 0.3 : (it.dxSs || 0);
    const off = it.place === 'at' ? 0 : it.place === 'after' ? gap : -(gap + bs);
    const l = dx + off - (it.slot ? it.slot * (gap + BG.sizeSs) : 0);
    return [l, l + bs];
  }
  const _stampsOf = new WeakMap();
  // the same span for a caller with no view (export_print's plan): the registry's engraving merged over the defaults, as renderSection does
  function inkSpanSs(it, glyphs, engraving) {
    const E = Object.assign(engravingDefaults(), engraving || {});
    if (it.k === 'badge') return badgeSpanSs(it, E);
    let S = _stampsOf.get(glyphs);
    if (!S) { S = boxForOf(Stamps.makeStamps(glyphs)); _stampsOf.set(glyphs, S); }
    return spanSsOf(it, { boxFor: S, glyphs, E });
  }
  // a GC item's reach in SECONDS — [pre, post] — by the params render draws it with (the registry preset under the item's own)
  function gcPrePost(it, engraving) {
    const E = engraving || {};
    const P = GC.params(GC.presetFor((E.gc && E.gc.preset) || {}, it.preset || {}, Object.assign({}, E.gc && E.gc.look, it.geom ? { geom: it.geom } : {}, it.spread > 0 ? { spread: it.spread } : {})));   // [§593] the reach by the geometry's aperture · [§656] a hand's
    return [P.pre, P.post];
  }

  function renderSection(model, view, glyphs, opts) {
    const o = Object.assign({ ink: '#111', brick: '#4E7A9B', muted: '#8a8a8a', paper: '#fff' }, opts || {});   // RULES MIRROR (rules.json colours)
    // engraving registry (V0.10/V1): every look number in one mergeable
    // block; code defaults = the census values, so a caller without opts
    // renders identically. The shell passes container.json engraving.render.
    const E = Object.assign(engravingDefaults(), (opts && opts.engraving) || {});
    const FONT = esc0 => String(esc0).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const fontAttr = ' font-family="' + FONT(E.fontFamily).replace(/"/g, '&quot;') + '"';
    const S = Stamps.makeStamps(glyphs);
    const boxFor = boxForOf(S);
    const stds = glyphs.standards;
    const SPANCTX = { boxFor, glyphs, E };   // [2c.6] what spanSsOf reads — the clamp here and the print plan (inkSpanSs) share it
    // [2a, the septet] the ensemble registry (notation/registry/ensemble.json)
    // — labels, brackets, the brace. Absent = the tuba page exactly.
    const ENS = (opts && opts.ensemble) || null;
    // [2c.1] THE MARGINS: the label block starts at the left margin, the clef column and the reshow at the music's start
    // (margin + gutter). A view without margins has ML 0 and MX0 = gutterPx — the page exactly as before.
    const ML = view.marginLeftPx || 0;
    const MX0 = view.musicX0Px != null ? view.musicX0Px : (view.gutterPx || 0);
    const CLEF_AT = { bass: { line: 1, anchor: 'fLine' }, treble: { line: -1, anchor: 'gLine' }, alto: { line: 0, anchor: 'cLine' } };
    const parts = [];
    parts.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + view.widthPx + '" height="' + view.heightPx +
      '" viewBox="0 0 ' + view.widthPx + ' ' + view.heightPx + '" style="background:' + o.paper + '">');
    parts.push('<rect x="0" y="0" width="' + view.widthPx + '" height="' + view.heightPx + '" fill="' + o.paper + '"/>');
    // [decibel PLAN 2.1 — RUNNING_LOG §300 · §302; rules.json objects.laneLine → engraving.render.laneLine] THE LANE LINE (his "a" — the string
    // quartet's look: the lanes white, a thin grey line between them): one line at the middle of the gap between adjacent LANES — page
    // furniture, under every mark. The lanes are read from the view's own bands: a staff of a grand staff and a member of a joined lane lie
    // inside their lane's band, so merging the overlapping bands gives the lanes whatever the ensemble. `outer`: also at the frame's first and
    // last lane edge. ABSENT from the registry = no line — every earlier page unchanged.
    if (E.laneLine && E.laneLine.thickSs > 0 && Array.isArray(view.systems) && view.systems.length) {
      const bands = view.systems.map(s => [s.yTopPx, s.yBotPx, s.ssPx]).sort((a, b) => a[0] - b[0] || b[1] - a[1]);
      const lanesY = [];
      for (const b of bands) { const L = lanesY[lanesY.length - 1]; if (L && b[0] < L[1] - 1e-6) L[1] = Math.max(L[1], b[1]); else lanesY.push(b.slice()); }
      const th = E.laneLine.thickSs * lanesY[0][2], xa = view.marginLeftPx || 0, ys = [];
      let xb = view.widthPx - (view.marginRightPx || 0);
      // [decibel PLAN 2.16 step 1, RUNNING_LOG §476] ON PAPER THE LANES END AT THE FINAL BAR LINE: on a print page (opts.printEdges) that
      // holds the notation's own final bar (an item `finalbar`), the lane lines stop at the bar's right edge — a sheet does not run on past
      // the end of the piece. The screen and the film (no printEdges) are untouched: there the dividers run on, as built at §411.
      if (opts && opts.printEdges && E.finalBar) {
        const fbIt = ((model && model.systems) || []).reduce((f, sm) => f || (sm.items || []).find(it => it.k === 'finalbar'), null);
        if (fbIt && fbIt.t > view.window[0] && fbIt.t <= view.window[1])
          xb = Math.min(xb, view.xOfSeconds(fbIt.t) + (E.finalBar.thinSs + E.finalBar.gapSs + E.finalBar.thickSs) * lanesY[0][2]);
      }
      for (let i = 0; i + 1 < lanesY.length; i++) ys.push((lanesY[i][1] + lanesY[i + 1][0]) / 2);
      if (E.laneLine.outer) { ys.unshift(lanesY[0][0]); ys.push(lanesY[lanesY.length - 1][1]); }
      if (ys.length) parts.push('<g class="lane-lines" fill="' + E.laneLine.colour + '">' + ys.map(y => '<rect x="' + xa.toFixed(2) + '" y="' + (y - th / 2).toFixed(2) +
        '" width="' + (xb - xa).toFixed(2) + '" height="' + th.toFixed(2) + '"/>').join('') + '</g>');
    }

    // [decibel §395] THE DIVIDER'S DISTANCE FROM A LANE'S TOP: the lane line stands at the middle of the gap between adjacent lanes (just above),
    // so it is half that gap — the same for every lane, the frame's first included (which has no line over it: its marks keep the others' place)
    const laneHalfGapPx = (() => {
      if (!Array.isArray(view.systems) || view.systems.length < 2) return 0;
      const bands = view.systems.map(s => [s.yTopPx, s.yBotPx]).sort((a, b) => a[0] - b[0] || b[1] - a[1]), Ls = [];
      for (const b of bands) { const q = Ls[Ls.length - 1]; if (q && b[0] < q[1] - 1e-6) q[1] = Math.max(q[1], b[1]); else Ls.push(b.slice()); }
      return Ls.length > 1 ? Math.max(0, (Ls[1][0] - Ls[0][1]) / 2) : 0;
    })();

    const [w0, w1] = view.window;
    // Page ownership is HALF-OPEN at the right edge (an event exactly on a
    // cut belongs to the NEXT page — review finding: it inked on both).
    // The final page of a tiling (or a standalone window) owns its end:
    // pass opts.ownsEnd = true.
    const ownsEnd = !opts || opts.ownsEnd !== false;
    const inWin = t => t >= w0 - 1e-9 && (ownsEnd ? t <= w1 + 1e-9 : t < w1 - 1e-9);
    // [PLAN 2b.7.1, D59] A PRINTED PAGE OWNS [cut, next cut). A POINT EVENT — a
    // strike and everything attached to it — draws only on the page that owns
    // its ONSET, and draws WHOLE; a LONG ITEM draws on every page it crosses,
    // clipped to the drawn span. opts.owned carries the two cuts; the page's
    // WINDOW is wider than what it owns, and the reserves it gains (2b.7.2/.3)
    // are where the overflowing ink goes. ABSENT = today's behaviour exactly —
    // the film keeps its overlap on purpose (the ball needs its approach), so
    // with no owned span the approved video renders byte-identical.
    const OWN = (opts && opts.owned) || null;
    const owns = OWN
      ? (t => t >= OWN[0] - 1e-9 && (ownsEnd ? t <= OWN[1] + 1e-9 : t < OWN[1] - 1e-9))
      : inWin;
    // [2c.2, LGMF 2026-09-25 — RUNNING_LOG §340] A TILED SCREEN PAGE (page_rules.screenPlan 'tile'): opts.screenEdges =
    // { edge: page_rules.edge, first }. The window IS the page, so a point item is owned half-open as above; a kind whose edge
    // entry says boundary 'before' is owned (t0, tω] instead — at exactly tω on this page, at exactly t0 on the page before
    // (the first page keeps its t0). ABSENT = today's behaviour exactly.
    const SCR = (opts && opts.screenEdges) || null;
    const PRE = (opts && opts.printEdges) || null;   // [2c.6] a print page of the objects plan (page_rules.printPlan 'objects'): page_rules.edge
    // [2c.6] on such a page a curve is cut EXACTLY at the page's edges: its end points interpolated at max(t0, w0) and min(t1, inkEnd)
    // (db1 p51: a 102 s crescendo of 401 samples left 0.23 s — one sample — on its last page, and was not drawn at all)
    const edgeCurvePts = (it, yOf) => {
      const s = it.samples, n = s.length, ta = Math.max(it.t0, w0), tb = Math.min(it.t1, wInk), pts = [];
      if (!(n >= 2 && tb > ta && it.t1 > it.t0)) return pts;
      const vAt = t => { const u = (t - it.t0) / (it.t1 - it.t0) * (n - 1), i = Math.min(n - 2, Math.max(0, Math.floor(u))); return s[i] + (s[i + 1] - s[i]) * (u - i); };
      pts.push([view.xOfSeconds(ta), yOf(vAt(ta))]);
      for (let i = 0; i < n; i++) { const t = it.t0 + (it.t1 - it.t0) * (i / (n - 1)); if (t > ta + 1e-9 && t < tb - 1e-9) pts.push([view.xOfSeconds(t), yOf(s[i])]); }
      pts.push([view.xOfSeconds(tb), yOf(vAt(tb))]);
      return pts;
    };
    const EDGE = SCR ? (SCR.edge || {}) : null;
    const boundaryBefore = k => !!(EDGE && EDGE[k] && EDGE[k].boundary === 'before');
    const ownsBefore = t => (t > w0 + 1e-9 || !!SCR.first) && t <= w1 + 1e-9;
    // [2c.3] THE MATISSE CUT (the composer: "arc starts on p1, ends 1/2 way down at page cut so 1/2 of a descending magenta line, p2
    // picks up the line 1/2 way on descent, but nothing in gutter"): a kind whose edge entry says screen 'cut' is drawn on every page
    // it crosses — WHOLE, not sampled to the window — inside a clip to [x(t0), x(tω)], so the shape keeps its identity and the
    // remainder starts on the next page at x(t0) at the same height by construction. Point items are never clipped (2c.4).
    const cutKind = k => !!(EDGE && EDGE[k] && EDGE[k].screen === 'cut');
    // [RUNNING_LOG §695 — his watch-through: "at around 30 seconds, the curves stopped rendering"] A CUT CURVE IS DRAWN OVER ITS PAGE, NOT WHOLE:
    // 2c.3 emitted every sample of a curve on every page it crosses and let the clip trim it — a sequence's level line is ONE path of ~15 000
    // points over 22 000 px, and the film's rasterizer (resvg) stops drawing such a path once the page lies far along it (the app's Chrome
    // draws it — so the page looked right and the film did not). The samples kept are the page's own window and CUT_PAD_S beyond each
    // end: the same points at the same heights, so the cut at x(t0) · x(tω) is unchanged; the path's closing edges fall outside the clip.
    const CUT_PAD_S = 0.5;
    const CLIP_ID = SCR ? ('twclip-' + Math.round(w0 * 1000)) : null;
    const clipOpen = CLIP_ID ? '<g class="tw-cut" clip-path="url(#' + CLIP_ID + ')">' : '';
    // [2c.4] on a tiled screen page only (so every other page stays byte-identical): a go-time indicator carries its time, the
    // clef is marked as the gutter's furniture — what tools/check_screen_edges.js reads
    const GO = t => SCR ? ' data-go="' + t + '"' : '';
    const CLEF_OPEN = SCR ? '<g class="clef">' : '', CLEF_CLOSE = SCR ? '</g>' : '';
    if (CLIP_ID) {
      const cx0 = view.xOfSeconds(w0), cx1 = view.xOfSeconds(w1);
      parts.push('<defs><clipPath id="' + CLIP_ID + '"><rect x="' + cx0.toFixed(2) + '" y="0" width="' + (cx1 - cx0).toFixed(2) +
        '" height="' + view.heightPx + '"/></clipPath></defs>');
    }
    // [2b.7.4] THE SYSTEM ENDS WHERE THE PAGE'S MUSIC ENDS: staff, ruler and
    // long items stop at the cut + the right reserve rather than at the window
    // edge — the ragged right edge of a page whose cut fell early. In a
    // proportional score blank staff reads as SILENCE, and the scale may never
    // change page to page (distance is time). Absent = the window edge.
    const wInk = (opts && opts.inkEnd != null) ? Math.min(opts.inkEnd, w1) : w1;
    // WHICH PAGES A LONG ITEM APPEARS ON (his eye on the first 2b.7 render, 2026-09-17:
    // "pg 2 in piano, extra from next page trill"). D59: a long item draws on every page
    // it CROSSES — crosses what the page OWNS, not what the page draws. The first build
    // tested it against the drawn span, so a trill starting just AFTER the cut left a
    // 0.3 s stub of its curve in the right reserve: next page's music, on this page.
    // HOW FAR it is then drawn is a separate question and unchanged — out to wInk, so a
    // sound continuing over the page turn still reaches the edge of the system.
    const crosses = OWN
      ? ((t0, t1) => t1 > OWN[0] + 1e-9 && (ownsEnd ? t0 <= OWN[1] + 1e-9 : t0 < OWN[1] - 1e-9))
      : ((t0, t1) => !(t1 < w0 || t0 > wInk));

    // [2a, LGMF 2026-09-25] a system's staff lines come from its model (a lined staff: registry part.staff); five at 1 ss otherwise
    const modelByKey = new Map(model.systems.map(sm => [sm.key !== undefined ? sm.key : sm.part, sm]));
    const linesOf = sm => (sm && sm.staffLines) || [-2, -1, 0, 1, 2];
    const elecHeads = [];   // [§370] a computer player's head in the gutter, one a page it plays on: { who, yT, yB, ss }
    for (const sysModel of model.systems) {
      let sys;
      // [2a.1] a staff of a multi-staff part is its own system ('<part>:<i>')
      try { sys = view.system(sysModel.key !== undefined ? sysModel.key : sysModel.part); } catch (e) { continue; } // part not in this view
      const ssPx = sys.ssPx;
      // §401d: a staff of a multi-staff part is its own system, but the GO LINE and the GC belong to the
      // PART's whole lane — the ball (animobj) already lands on the lane edge; the composer, on seeing the
      // piano's arc on one staff: 'the arc and the go line need to span entire staff'. laneOf = the first
      // staff's top to the last staff's bottom; a single-staff part is its own lane, unchanged.
      const laneOf = (sm, sy) => {
        if (sm.key === undefined || typeof sm.part !== 'number') return sy;
        const pc = o.ensemble && o.ensemble.parts && o.ensemble.parts.find(q => q.part === sm.part);
        const nSt = (pc && pc.staves && pc.staves.length) || 1;
        if (nSt < 2) return sy;
        try {
          const a = view.system(sm.part + ':0'), b = view.system(sm.part + ':' + (nSt - 1));
          return { yTopPx: a.yTopPx, yBotPx: b.yBotPx, heightPx: b.yBotPx - a.yTopPx, ssPx: sy.ssPx };
        } catch (e) { return sy; }
      };
      const lane = laneOf(sysModel, sys);
      // [decibel PLAN 2.6, RUNNING_LOG §325] THE MIC'S ROW of this lane (rules.json objects.micOpening: place · gapSs · heightFrac · minSs): where a mic
      // opening stands, and a badge with it — laneTop (under the dividing line by the standard gap) · laneMiddle · laneBottom
      const micRow = MO => {
        const mh = Math.max(MO.minSs * ssPx, (lane.yBotPx - lane.yTopPx) * MO.heightFrac), gp = MO.gapSs * ssPx;
        // [§328, DEC-105] THE ROW IS AS TALL AS THE TALLEST THING THAT MAY STAND IN IT — the mic opening, or a badge beside it (his badge is the taller
        // since §328). The row keeps the standard gap; where the two stand in it is the row's `align` (just below). So the mic is at ONE height whether
        // or not a badge stands beside it (his rule, DEC-102), and a badge never crosses the dividing line.
        const rh = Math.max(mh, E.badge ? E.badge.sizeSs * ssPx : mh);
        const ry = MO.place === 'laneBottom' ? lane.yBotPx - gp - rh : MO.place === 'laneMiddle' ? (lane.yTopPx + lane.yBotPx - rh) / 2 : lane.yTopPx + gp;
        // [§329, DEC-106 — his "push the mic openings back up to the top … by shorter, I meant from the bottom"] WHERE A THING OF HEIGHT h STANDS IN
        // THE ROW — the row's `align`: 'edge' = hung from the row's own edge (its top under laneTop, its bottom over laneBottom), so a thing made
        // less tall loses height on the far side and its edge stays put · 'centre' = centred in the row. laneMiddle is centred either way.
        const yOf = h => (MO.place === 'laneMiddle' || MO.align === 'centre') ? ry + (rh - h) / 2 : MO.place === 'laneBottom' ? ry + rh - h : ry;
        return { h: mh, y: yOf(mh), yOf };
      };
      // [decibel PLAN 2.7, RUNNING_LOG §335 — DEC-111] THE ELECTRONICS' ROW of this lane (rules.json objects.elecReturn: place · gapSs · perSoundFrac ·
      // capSounds · minSs; objects.elecBadge: sizeSs) — the presentation view's own row, the mirror of the mic's: where a return brick stands,
      // and the electronics' badge with it. laneBottom by his word ('purple at the bottom': the mic at the top — into the microphone above,
      // out of the speakers below) · laneMiddle · laneTop. As tall as the tallest thing that may stand in it (a brick of capSounds sounds, or the
      // badge); its 'align' as the mic row's: 'edge' = hung from the row's own edge, 'centre' = centred.
      const elecRow = ER => {
        const bh = Math.max(ER.minSs * ssPx, (lane.yBotPx - lane.yTopPx) * ER.perSoundFrac * ER.capSounds), gp = ER.gapSs * ssPx;
        const rh = Math.max(bh, E.elecBadge ? E.elecBadge.sizeSs * ssPx : bh);
        const ry = ER.place === 'laneTop' ? lane.yTopPx + gp : ER.place === 'laneMiddle' ? (lane.yTopPx + lane.yBotPx - rh) / 2 : lane.yBotPx - gp - rh;
        const yOf = h => (ER.place === 'laneMiddle' || ER.align === 'centre') ? ry + (rh - h) / 2 : ER.place === 'laneTop' ? ry : ry + rh - h;
        return { yOf, ry, rh };
      };
      let elecGrainDefined = false;   // [§336] the window's grain filter is defined once a sheet
      const hasGc = new Set((sysModel.items || []).filter(x => x.k === 'gc' && x.ev).map(x => x.ev));   // §401h
      // [decibel RUNNING_LOG §411, DEC-181 — his "keep the mic openings unoccluded. That's the window to play in"] THE BADGES THAT MUST LEAVE THE
      // MIC OPENINGS UNCOVERED (a badge item's avoid 'mic', with its opening's end tEnd): each lane's are placed here, once, in time order —
      // BEFORE its opening where that place is free, else AFTER it where that is free, else NOT AT ALL. Free = on no other mic opening of the
      // lane and on no badge already placed. In page pixels; the differences are the same on every page, so a badge cut at a page turn
      // stands the same on both sides of it.
      const avoidPlace = new Map();
      {
        const AV = (sysModel.items || []).filter(x => x.k === 'badge' && x.avoid === 'mic' && x.tEnd != null && !x.row).sort((p, q) => p.t - q.t);
        if (AV.length && E.badge) {
          const bsA = E.badge.sizeSs * ssPx, gpA = E.badge.gapSs * ssPx, xA = tt => view.xOfSeconds(tt);
          const micsA = (sysModel.items || []).filter(x => x.k === 'mic').map(m => [xA(m.t0), xA(m.t1)]), placedA = [];
          const freeA = (x0, own) => !micsA.some(m => m !== own && m[1] > x0 + 0.5 && m[0] < x0 + bsA - 0.5) && !placedA.some(q => q + bsA > x0 + 0.5 && q < x0 + bsA - 0.5);
          for (const b of AV) {
            const own = micsA.find(m => Math.abs(m[0] - xA(b.t)) < 0.01 && Math.abs(m[1] - xA(b.tEnd)) < 0.01) || null;
            const xBefore = xA(b.t) - gpA - bsA, xAfter = xA(b.tEnd) + gpA;
            const x0 = freeA(xBefore, own) ? xBefore : freeA(xAfter, own) ? xAfter : null;
            avoidPlace.set(b, x0);
            if (x0 != null) placedA.push(x0);
          }
        }
      }
      // [2c.4] curShift: the clamp's shift for the item being drawn (0 unless it is a clamp kind in a shifted unit — x + 0 = x)
      let curShift = 0;
      const X = (t, dxSs) => view.xOfSeconds(t) + (dxSs || 0) * ssPx + curShift;
      const Y = ss => sys.yOfSs(ss);
      // [§495] an item placed against ANOTHER staff of the same part (the beamed
      // pair's bass stem reaching the treble beam, its pizz. on the treble row)
      const sysYOf = key => { try { const s2 = view.system(key); return ss => s2.yOfSs(ss); } catch (e) { return Y; } };
      // [2c.4] THE CLAMP (the composer, §340: "all of the notation gets pushed right so its beginning, left side, clears the left
      // starting point … it all depends on go time indicators; in some cases there is a go line, this has to be pixel/time accurate,
      // the rest can work around it"). On a tiled screen page a UNIT is the clamp-kind items of ONE system at ONE time (a chord's
      // heads, their accidentals and ledgers, the marks beside them). If a unit's ink reaches left of x(t0) the whole unit is shifted
      // right by the difference; the go-time indicators (the atomic kinds — go line · attack line · tick · the GC impact) are never
      // moved, and a beam tip, a tuplet end and a ring bar follow the unit they belong to. At the right edge nothing is clamped: ink
      // may overhang into the right margin (2c.1 sized it). A shifted unit that reaches the next unit is FLAGGED in opts.edgeReport,
      // never resolved by a rule (his word: case by case). The spans below use the drawing's own numbers.
      const clampKind = k => !!(EDGE && EDGE[k] && EDGE[k].screen === 'clamp');
      const tk = t => Math.round(t * 1e6);
      const shiftAt = new Map();
      const addGo = [];   // [2c.6] the go lines the exception adds (clampGoLine 'add')
      // [2c.6] the unit's ink from the ONE span function (module level, spanSsOf) — the print plan reads the same numbers
      const inkSpanPx = it => {
        const e = spanSsOf(it, SPANCTX);
        if (!e) return null;
        const x = view.xOfSeconds(it.t);
        return [x + e[0] * ssPx, x + e[1] * ssPx];
      };
      if (SCR) {
        const X0 = view.xOfSeconds(w0);
        const L = new Map(), R = new Map();
        for (const it of sysModel.items) {
          if (!clampKind(it.k) || it.t === undefined || !owns(it.t)) continue;
          const e = inkSpanPx(it);
          if (!e) continue;
          const k = tk(it.t);
          L.set(k, Math.min(L.has(k) ? L.get(k) : Infinity, e[0]));
          R.set(k, Math.max(R.has(k) ? R.get(k) : -Infinity, e[1]));
        }
        for (const [k, s] of EdgeRules.unitShifts(L, X0)) shiftAt.set(k, s);   // [2e.2] the ONE edge function — the animation layer pushes through it too
        const goAt = new Set(sysModel.items.filter(x => (x.k === 'goline' || x.k === 'attackline' || x.k === 'tick' || x.k === 'gc') && x.t !== undefined).map(x => tk(x.t)));
        // [2c.6 — his "2a", 2026-09-25] THE GO-LINE EXCEPTION as a switch (page_rules.clampGoLine): 'add' = a clamped unit with no go-time
        // indicator of its own takes a go line at x(t), so its time stays exact (PLAN 2c.4 (b), one per note); 'flag' (the default) =
        // reported only. The decision is his, deferred to the specific notation (RUNNING_LOG §347) — this is the machinery for it.
        if (SCR.clampGoLine === 'add') for (const k of shiftAt.keys()) if (!goAt.has(k)) addGo.push({ k: 'goline', t: k / 1e6, added: true });
        if (shiftAt.size && opts && Array.isArray(opts.edgeReport)) {
          const keys = [...L.keys()].sort((a, b) => a - b);
          for (const [k, s] of shiftAt) {
            const nx = keys.find(q => q > k);
            const overlap = nx === undefined ? 0 : (R.get(k) + s) - (L.get(nx) + (shiftAt.get(nx) || 0));
            opts.edgeReport.push({ part: sysModel.part, t: k / 1e6, shiftPx: +s.toFixed(2), collidesPx: overlap > 0 ? +overlap.toFixed(2) : 0,
              goLine: goAt.has(k) ? true : (SCR.clampGoLine === 'add' ? 'added' : false) });
          }
        }
      }
      const shiftOf = t => shiftAt.get(tk(t)) || 0;
      // class carries the part so a caller can restyle ONE lane without a
      // re-render — the per-part solo dim (day 24). Presentation-neutral:
      // a class attribute adds no ink and no geometry.
      parts.push('<g class="sys sys-p' + sysModel.part + '" fill="' + o.ink + '">');
      // part label at the left edge (inside the gutter when one exists) —
      // [2a.1] the ensemble's short name (the score's tracks[].short), once
      // per part: a grand staff is labelled on its top staff only
      const pcfg = ENS && ENS.parts && ENS.parts.find(p => p.part === sysModel.part);
      // VERTICALLY (composer, 2026-09-11: "center them on the appropriate
      // staff, so centered on the middle staff line"): with the ensemble the
      // label's visual middle sits ON the staff's middle line — for a grand
      // staff on the lane's middle, between its two staves. baselineBelowEm
      // (registry partLabel) is where the baseline goes below that line, as a
      // fraction of the font size: an explicit number, so Chrome and the
      // export rasterizer agree (no dominant-baseline). Without the ensemble:
      // the tuba's top-of-lane label, unchanged.
      if (sysModel.lineLabels && sysModel.staffLines) {
        // [2a] a lined staff names its LINES in the gutter (his short names, top to bottom), centred on each line as a part label is
        const sz = E.partLabel.sizeSs * (E.partLabel.lineLabelScale || 0.85) * ssPx;
        const below = (E.partLabel.baselineBelowEm != null ? E.partLabel.baselineBelowEm : 0.32) * sz;
        sysModel.lineLabels.forEach((lab, i) => {
          if (!lab || sysModel.staffLines[i] === undefined) return;
          parts.push('<text x="' + (ML + E.partLabel.xPx) + '" y="' + (Y(sysModel.staffLines[i]) + below).toFixed(1) + '" font-size="' + sz.toFixed(1) + '"' + fontAttr + ' fill="' + o.muted + '">' + esc(lab) + '</text>');
        });
      } else if (!(sysModel.staff > 0) && !(pcfg && pcfg.noLabel)) {   // [decibel 2.1] `noLabel`: a member of an overlaid lane the lane's one label stands for
        let ly = sys.yTopPx + E.partLabel.yOffsetSs * ssPx;
        if (ENS) {
          let lane = sys;
          try { lane = view.system(sysModel.part); } catch (e) { /* no lane entry: the staff itself */ }
          ly = lane.yMidPx + (E.partLabel.baselineBelowEm != null ? E.partLabel.baselineBelowEm : 0.32) * E.partLabel.sizeSs * ssPx;
        }
        parts.push('<text x="' + (ML + E.partLabel.xPx) + '" y="' + ly.toFixed(1) + '" font-size="' + (E.partLabel.sizeSs * ssPx).toFixed(1) +
          '"' + fontAttr + ' fill="' + o.muted + '">' + (pcfg ? esc(pcfg.short) : 'T' + (sysModel.part + 1)) + '</text>');
      }
      // page-edge rule: a chunk continuing across the cut re-shows its tempo
      // label at the page start (splice.js planPages -> page.reshow)
      for (const rs of (opts && opts.reshow) || []) {
        if (rs.part !== sysModel.part) continue;
        parts.push('<text x="' + (MX0 + E.reshow.xSs * ssPx).toFixed(1) + '" y="' + Y(4.6).toFixed(1) + '" font-size="' +
          (E.reshow.sizeSs * ssPx * E.textScale).toFixed(1) + '"' + fontAttr + ' fill="' + o.muted + '">' + esc(rs.text) + '</text>');
      }

      // DRAWING LAYERS (day 22, composer): notation ink first, the env
      // curve OVER the notation, the go line over the curve. (The animation
      // overlay is its own SVG above everything; within a layer, push order
      // holds — stable sort.)
      // [decibel RUNNING_LOG §400, DEC-168 — his "let's place them behind everything. So the electronics are just a … courtesy display. So they
      // don't need to be in front of anything"] THE ELECTRONICS' LAYER — the pane, the return bricks, the electronics' badges, a computer player's
      // wedge — is drawn FIRST, under every mark of the players' (the trill's curve, a GC, a mic opening pass over it): the pane lowest, then
      // the bricks and the wedge, then the badge.
      const ELEC_LAYER = it => (it.k === 'elecwin' ? -3 : (it.k === 'elecret' || (it.k === 'wedge' && it.row === 'elec')) ? -2 : (it.k === 'badge' && it.row === 'elec') ? -1 : null);
      const LAYER = it => { const e = ELEC_LAYER(it); return e != null ? e : it.k === 'envcurve' ? 1 : it.k === 'goline' ? 2 : it.k === 'gc' ? 3 : 0; };   // [decibel §411, DEC-181 — his "on everywhere in the score, let's put the GCs on top"] the GC is drawn LAST, over every other mark of its lane
      const itemsInLayers = [...sysModel.items, ...addGo].sort((a, b) => LAYER(a) - LAYER(b));
      for (const it of itemsInLayers) {
        // [2c.3] a cut kind's ink goes inside the page's clip — wrapped in `finally`, so every branch's `continue` is honoured
        const cutMark = ((cutKind(it.k) && it.k !== 'gc') || (SCR && it.k === 'badge' && it.edge === 'cut')) ? parts.length : -1;   // [§411] a badge marked edge 'cut' is cut like paper too   // the GC wraps its arc alone (its impact is a point)
        curShift = (SCR && it.t !== undefined && clampKind(it.k)) ? shiftOf(it.t) : 0;   // [2c.4] the unit's clamp
        try {
        if (it.k === 'staff') {
          // staff is FURNITURE: in a free window wider than the material
          // (opts.staffFull, notation-view window mode) the outer segments
          // extend to the view edges instead of stopping where the section
          // ends — "staff lines cut short" verdict, day 22. Interior
          // staff-off spans keep their authored extents.
          const mw = model.window || [it.t0, it.t1];
          // §401b (the composer: 'put the staff lines to the end of the page'): registry
          // engraving.render.staffFull makes every view draw the staff to the page edges
          const full = (opts && opts.staffFull) || !!E.staffFull;
          // [§489] a staff segment wholly off this page (the percussion's opening snippet in the lead-in, [−4, −3.75], on every later
          // page) draws nothing — and a segment that ends before the window is never stretched to the page's edge
          if (it.t1 <= w0 + 1e-9 || it.t0 >= wInk - 1e-9) continue;
          const t0 = (full && it.t0 <= mw[0] + 1e-9 && it.t1 >= mw[0] - 1e-9) ? w0 : Math.max(it.t0, w0);
          const t1 = (full && it.t1 >= mw[1] - 1e-9) ? wInk : Math.min(it.t1, wInk);
          const x0 = view.xOfSeconds(t0), x1 = view.xOfSeconds(t1);
          for (const line of linesOf(sysModel)) {
            const y = Y(line) - (stds.staff.lineThickness * ssPx) / 2;
            parts.push('<rect x="' + x0.toFixed(2) + '" y="' + y.toFixed(2) + '" width="' + (x1 - x0).toFixed(2) +
              '" height="' + (stds.staff.lineThickness * ssPx).toFixed(2) + '"/>');
          }
        } else if (it.k === 'clef') {
          // [decibel PLAN 2.1 — RUNNING_LOG §301 · §302; rules.json staffLines.ensemble.clefWithStaff] THE CLEF ONLY WHERE THE STAFF IS: a clef the
          // layout marks `withStaff` draws only on a page whose left edge a staff segment of this system covers. "Covers" as the staff branch
          // above DRAWS it: with staffFull a segment that begins at the laid-out window's start is stretched back to the page's edge (a page cut
          // from the middle of a staffed stretch — found on the beating section's window, whose staff begins at 423 on a page that begins at 416)
          if (it.withStaff) {
            const mwC = model.window || [w0, w1], fullC = (opts && opts.staffFull) || !!E.staffFull;
            if (!sysModel.items.some(s => s.k === 'staff' && s.t1 > w0 + 1e-9 && (s.t0 <= w0 + 1e-9 || (fullC && s.t0 <= mwC[0] + 1e-9 && s.t1 >= mwC[0] - 1e-9)))) continue;
          }
          // with a prefatory gutter the clef lives IN the dead space,
          // right-aligned toward the music start (A21c — it must never sit
          // over the first notes); without one it pins to the view's left
          // edge as before (staff furniture, always shown)
          // [2a.2] the system's own clef, sat on the line it names: bass on
          // F3 (+1 ss), treble on G4 (−1), alto on C4 (the middle line)
          const ck = sysModel.clef || 'bass';
          const CL = CLEF_AT[ck] || CLEF_AT.bass;
          const cStamp = ck === 'bass' ? S.clefBass() : S.clef(ck);
          if (view.gutterPx > 0) {
            // clamp at the left edge: a clef too big for the gutter pokes
            // VISIBLY into the music (protrusion-detector territory) rather
            // than vanishing off-screen — invisible failure is worse
            const cw = glyphs.clef[ck].wSs * ssPx;
            const cx = Math.max(ML + 2, MX0 - cw - E.clefGutterGapSs * ssPx);
            parts.push(CLEF_OPEN + Stamps.toSvg(cStamp, { xPx: cx, yPx: Y(CL.line), ssPx, align: CL.anchor }) + CLEF_CLOSE);
          } else {
            const cx = Math.max(view.xOfSeconds(it.t), ML);
            parts.push(CLEF_OPEN + Stamps.toSvg(cStamp, { xPx: cx + E.clefInsetSs * ssPx, yPx: Y(CL.line), ssPx, align: CL.anchor }) + CLEF_CLOSE);
          }
        } else if (it.k === 'glyph') {
          if (!owns(it.t)) continue;
          // [§494 — the running order's step 1, his "demonstrate the color head"] a bow's head in its SEAT's hue when rules.json
          // vibMarks.headColour is 'seat' — the bar's own colours (render.ringBar.color · colorSeat2); every other glyph the group's ink
          const seatFill = it.seat != null && E.ringBar && E.ringBar.headColour === 'seat' ? (it.seat === 1 && E.ringBar.colorSeat2 ? E.ringBar.colorSeat2 : E.ringBar.color) : null;
          const gBox = (it.scale || it.scaleY) ? Stamps.scaled(boxFor(it.g), it.scale || 1, it.scaleY != null ? it.scaleY : (it.scale || 1)) : boxFor(it.g);
          // [decibel §389] laneTopGapSs: a sign with no note under it (the trill's tr) hangs from the LANE's top — its top ink that gap under the
          // dividing line, whatever the staff does; placed by its own height (its anchor is its centre)
          const gY = it.laneTopGapSs != null ? lane.yTopPx + (it.laneTopGapSs + gBox.hSs / 2) * ssPx : (it.sys ? sysYOf(it.sys) : Y)(it.ySs);
          const stamp = Stamps.toSvg(gBox, { xPx: X(it.t, it.dxSs), yPx: gY, ssPx, align: it.align });
          parts.push(seatFill ? '<g fill="' + seatFill + '">' + stamp + '</g>' : stamp);
        } else if (it.k === 'rest') {
          // day 23: a rest at LP's own vertical placement — the glyph's topSs
          // is where its bbox top sits above the staff middle line, so the
          // rest lands exactly where LilyPond would put it.
          if (!owns(it.t)) continue;
          const rg = glyphs.rest['rest' + it.dur];
          // LEFT EDGE on the rest's time (day 24): a rest is placed like a note
          // of its value, and noteheads in this piece put their left edge on the
          // moment. The old half-width subtraction centred the glyph, hanging
          // half of it back into the sounding note before it.
          const rx = X(it.t, it.dxSs);
          parts.push(Stamps.toSvg(S.rest(it.dur), { xPx: rx, yPx: Y(it.ySs != null ? it.ySs : rg.topSs), ssPx, align: 'topLeft' }));
          // AUGMENTATION DOT (day 24): a dotted rest is the glyph plus a dot to
          // its right, vertically on the rest's own middle. Same diameter as the
          // staccato dot (glyphs.standards) — one dot size in the piece.
          if (it.dotted) {
            const dd = ((glyphs.standards.augmentationDot || glyphs.standards.staccatoDot).diameter) * ssPx;
            const gap = ((E.restDotGapSs != null) ? E.restDotGapSs : 0.28) * ssPx;
            parts.push('<circle cx="' + (rx + rg.wSs * ssPx + gap + dd / 2).toFixed(2) + '" cy="' +
              (Y(it.ySs != null ? it.ySs : rg.topSs) + (rg.hSs / 2) * ssPx).toFixed(2) + '" r="' + (dd / 2).toFixed(2) + '"/>');
          }
        } else if (it.k === 'stem') {
          if (!owns(it.t)) continue;
          const x = X(it.t, it.dxSs) - (stds.stem.thickness * ssPx) / 2;
          const YB = it.sysB ? sysYOf(it.sysB) : Y;   // [§495] the cross-staff stem's far end
          const yTop = Math.min(Y(it.yA), YB(it.yB)), h = Math.abs(Y(it.yA) - YB(it.yB));
          parts.push('<rect x="' + x.toFixed(2) + '" y="' + yTop.toFixed(2) + '" width="' + (stds.stem.thickness * ssPx).toFixed(2) + '" height="' + h.toFixed(2) + '"/>');
        } else if (it.k === 'dot') {
          if (!owns(it.t)) continue;
          parts.push('<circle cx="' + X(it.t, it.dxSs).toFixed(2) + '" cy="' + Y(it.ySs).toFixed(2) + '" r="' + (glyphs.standards.staccatoDot.diameter / 2 * ssPx).toFixed(2) + '"/>');
        } else if (it.k === 'ledger') {
          if (!owns(it.t)) continue;
          // day 22: honor the item's dxSs (was silently dropped — a shifted
          // head left its ledgers behind) and its own head width (the open
          // head is wider than filled)
          const w = (it.wSs || glyphs.notehead.filled.wSs) * (1 + 2 * stds.ledgerLine.lengthFraction) * ssPx;
          parts.push('<rect x="' + (X(it.t, it.dxSs) - w / 2).toFixed(2) + '" y="' + (Y(it.ySs) - stds.ledgerLine.thickness * ssPx / 2).toFixed(2) +
            '" width="' + w.toFixed(2) + '" height="' + (stds.ledgerLine.thickness * ssPx).toFixed(2) + '"/>');
        } else if (it.k === 'beam') {
          // [2c.3] cut: every tip, on each page the beam crosses — the clip ends it at the page's edge like paper
          const tips = cutKind('beam') ? it.tips : it.tips.filter(p => owns(p.t));
          if (tips.length < 2) continue;
          if (cutKind('beam') && !crosses(Math.min(...tips.map(p => p.t)), Math.max(...tips.map(p => p.t)))) continue;
          // beam thickness extends TOWARD the noteheads: down the page for
          // up-stems, up the page for down-stems (review finding: down-stem
          // beams hung beyond the tips)
          const t = stds.beam.thickness * (it.scale || 1) * ssPx * (it.dir === 'down' ? -1 : 1);   // [§592] a grace group's beam at the heads' scale
          // [2c.4] each tip follows its own unit's clamp (shiftOf is 0 off a tiled screen page)
          const fwd = tips.map(p => (X(p.t, p.dxSs) + shiftOf(p.t)).toFixed(2) + ',' + Y(p.ySs).toFixed(2));
          const back = tips.slice().reverse().map(p => (X(p.t, p.dxSs) + shiftOf(p.t)).toFixed(2) + ',' + (Y(p.ySs) + t).toFixed(2));
          parts.push('<polygon points="' + fwd.concat(back).join(' ') + '"/>');
        } else if (it.k === 'text') {
          if (!owns(it.t)) continue;
          // [2j.2, §540] yAt 'top': the text's TOP on the system's top edge — where a surge curve's cut edge peaks (the envcurve
          // is drawn to sys.yTopPx) — through the hanging baseline; "sempre secco" is the one user so far
          const yTxt = it.yAt === 'top' ? sys.yTopPx : Y(it.ySs);
          parts.push('<text x="' + X(it.t, it.dxSs).toFixed(1) + '" y="' + yTxt.toFixed(1) + '" font-size="' + ((it.size || 1) * ssPx * E.textScale).toFixed(1) +
            '"' + fontAttr + (it.anchor && it.anchor !== 'start' ? ' text-anchor="' + it.anchor + '"' : '') + (it.italic ? ' font-style="italic"' : '') + (it.yAt === 'top' ? ' dominant-baseline="hanging"' : '') + ' xml:space="preserve" fill="' + (it.color || o.ink) + '">' + esc(it.text) + '</text>');   // [2e.3, §427 A5] a text item names its colour from its row; the fallback is ink, never the furniture grey
        } else if (it.k === 'attackline') {
          if (!owns(it.t)) continue;
          // M4: a vertical stroke straddling the pitch position
          parts.push('<rect' + GO(it.t) + ' x="' + (X(it.t, 0) - E.attackLine.wSs / 2 * ssPx).toFixed(2) + '" y="' + (Y(it.ySs + E.attackLine.offsetSs)).toFixed(2) +
            '" width="' + (E.attackLine.wSs * ssPx).toFixed(2) + '" height="' + (E.attackLine.hSs * ssPx).toFixed(2) + '"/>');
        } else if (it.k === 'tick') {
          if (!owns(it.t)) continue;
          const tH = it.hSs != null ? it.hSs : E.tick.hSs;   // [§564] a beat grid's tick is shorter (rules.json objects.tick.subHSs)
          // [§565] a beat grid's tick hangs from the LANE'S TOP EDGE (yAt 'top') in the DURATION LINE's colour and opacity (E.ringBar — rules.json
          // objects.ringBar through objects.tick.gridColour · gridOpacity); the GC's tick keeps the tick row and the ink
          const tY = it.yAt === 'top' ? sys.yTopPx : Y(it.ySs) - tH * ssPx;
          // [§578, his "alternate colors for the ball and the lines for each new rhythm group … the olive from the vibraphones"] a grid line
          // carries its FRAME's colour (layout stamps it from rules.json objects.tick.gridColours by the frame's index on the part)
          const tFill = it.grid ? ' fill="' + (it.colour || E.ringBar.color) + '"' + (E.ringBar.opacity != null && E.ringBar.opacity !== 1 ? ' fill-opacity="' + E.ringBar.opacity + '"' : '') : '';
          const tW = it.wSs > 0 ? it.wSs : E.tick.wSs;   // [§581] a beat frame's line carries its own width (a band; layout stamps objects.tick.gridWSs)
          parts.push('<rect' + GO(it.t) + ' x="' + (X(it.t, 0) - tW / 2 * ssPx).toFixed(2) + '" y="' + tY.toFixed(2) +
            '" width="' + (tW * ssPx).toFixed(2) + '" height="' + (tH * ssPx).toFixed(2) + '"' + tFill + '/>');
        } else if (it.k === 'envcurve') {
          // the drawn level curve over the FULL lane band (piece #1: value
          // 0..1 maps bottom -> top of the track), clipped to the window
          if (!crosses(it.t0, it.t1)) continue;
          // [decibel PLAN 2.16 step 2, RUNNING_LOG §477 — the second of §396's three print calls; the AI's recommendation, his eye at the
          // proof] ON PAPER A CURVE THAT COMES OVER FROM THE PAGE BEFORE IS RESTATED BY ITS BADGE. A level curve is `continue` in print:
          // broken at the cut and carried on. The page it arrives on would show a curve with nothing to say what it is a curve OF (the
          // lineage restated a trill's line with "(tr)"; here a trill is its badge). So on a PRINT page (opts.printEdges), a curve that
          // began before the page's start draws the badge that stands at its own start — the same sign, the same size and row — at the
          // page's start, the badge's usual side gap in from the edge. The screen and the film (no printEdges) never do this.
          if (PRE && it.t0 < w0 - 1e-6 && it.t1 > w0 + 1e-6 && E.badge && E.language && E.micOpening) {
            const tb = (sysModel.items || []).find(x => x.k === 'badge' && x.place === 'at' && !x.row && Math.abs(x.t - it.t0) < 1e-6);
            const tyR = tb && E.language.types && E.language.types[tb.type];
            if (tyR) {
              const bsR = E.badge.sizeSs * ssPx, uR = E.language.format.viewUnits;
              const bxR = view.xOfSeconds(w0) + E.micOpening.gapSs * ssPx + laneHalfGapPx, byR = micRow(E.micOpening).yOf(bsR);
              parts.push('<g class="badge badge-' + esc(tb.type) + ' badge-restated" transform="translate(' + bxR.toFixed(2) + ' ' + byR.toFixed(2) + ') scale(' + (bsR / uR).toFixed(5) + ')">' +
                '<rect width="' + uR + '" height="' + uR + '" rx="' + E.language.format.cornerUnits + '" fill="' + E.language.format.ground + '"/>' + String(tyR.sign).split('currentColor').join(tyR.colour) + '</g>');
            }
          }
          const EC = E.envCurve;
          // [2f.4] band 'lane': a multi-staff part's curve spans its whole lane (the piano's trills), as its go line does
          const yT = it.band === 'lane' ? lane.yTopPx : sys.yTopPx, yB = it.band === 'lane' ? lane.yBotPx : sys.yBotPx;
          // cut (surge): the RISE, truncated at its peak sample, is mapped
          // over the FULL note span so it meets the note end at full height —
          // a SHARP top-right corner, then the 90° vertical back edge (the
          // fill closure). Round 2 verdict: the first build held a 2% shelf
          // at the peak ("why it isn't a sharp right top corner"); the shelf
          // was the drawn cut-ramp's honest x — legibility wins, the <=2%
          // time stretch of the rise is accepted. Sounding data untouched.
          // day 40: the truncation moved to layout.drawnLevelSamples — the
          // samples arrive FINAL (one source for the page and the meters);
          // the stretch over the full note span is implicit in n-over-[t0,t1].
          const samples = it.samples;
          const n = samples.length;
          const pts = [];
          const whole = cutKind('envcurve');   // [2c.3] cut like paper: every sample, the clip trims it at the page's edges
          for (let i = 0; i < n; i++) {
            const t = it.t0 + (it.t1 - it.t0) * (i / (n - 1));
            if (whole ? (t < w0 - CUT_PAD_S || t > w1 + CUT_PAD_S) : (t < w0 - 1e-9 || t > wInk + 1e-9)) continue;   // [§695] a cut curve: the page's own stretch + the pad, not the whole path
            pts.push([view.xOfSeconds(t), yB - samples[i] * (yB - yT)]);
          }
          if (PRE && OWN) pts.splice(0, pts.length, ...edgeCurvePts(it, v => yB - v * (yB - yT)));   // [2c.6]
          if (pts.length >= 2) {
            const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
            if (EC.pathOpacity != null) {   // [D42] the two-piano look: one closed path, stroked round, opacity on the whole
              parts.push(curvePathD42(EC, line + ' L' + pts[pts.length - 1][0].toFixed(1) + ',' + yB.toFixed(1) + ' L' + pts[0][0].toFixed(1) + ',' + yB.toFixed(1) + ' Z'));
            } else if (EC.fillOpacity > 0) {
              parts.push('<path d="' + line + ' L' + pts[pts.length - 1][0].toFixed(1) + ',' + yB.toFixed(1) +
                ' L' + pts[0][0].toFixed(1) + ',' + yB.toFixed(1) + ' Z" fill="' + EC.color +
                '" fill-opacity="' + EC.fillOpacity + '" stroke="none"/>');
            }
            if (EC.pathOpacity == null && EC.strokeWPx > 0 && EC.strokeOpacity > 0) {
              parts.push('<path d="' + line + '" fill="none" stroke="' + EC.color + '" stroke-width="' + EC.strokeWPx +
                '" stroke-opacity="' + EC.strokeOpacity + '"/>');
            }
          }
        } else if (it.k === 'barline') {
          // THE TRANCE BAR LINE (day 35, composer): one at every new tempo,
          // sitting a MEDIUM space left of the bar's leftmost ink so it never
          // crowds the downbeat. Full staff height, stem thickness.
          if (!owns(it.t)) continue;
          const BL = E.barLine;
          const x = X(it.t, it.dxSs) - (BL.thickSs * ssPx) / 2;
          parts.push('<rect x="' + x.toFixed(2) + '" y="' + Y(2).toFixed(2) +
            '" width="' + (BL.thickSs * ssPx).toFixed(2) +
            '" height="' + (Math.abs(Y(-2) - Y(2))).toFixed(2) + '"/>');
        } else if (it.k === 'tempotext') {
          // the tempo, stated once at the top of the system, one decimal place.
          // The quarter note is DRAWN (small notehead + stem) rather than typed —
          // Crimson has no musical glyph, and everything else on this page comes
          // from the glyph set, so a typed character would be the odd one out.
          if (!owns(it.t)) continue;
          const BL = E.barLine;
          const tx = X(it.t, it.dxSs), ty = Y(BL.tempoYSs);
          const ns = ssPx * BL.tempoHeadScale;
          const nhq = glyphs.notehead.filled;
          parts.push(Stamps.toSvg(Stamps.scaled(S.notehead(), BL.tempoHeadScale, BL.tempoHeadScale),
            { xPx: tx, yPx: ty, ssPx, align: 'center' }));
          const stemX = tx + (nhq.anchors.stemAttachUp.x - nhq.anchors.center.x) * ns;
          parts.push('<rect x="' + (stemX - (BL.thickSs * ssPx) / 2).toFixed(2) + '" y="' + (ty - BL.tempoStemSs * ssPx).toFixed(2) +
            '" width="' + (BL.thickSs * ssPx).toFixed(2) + '" height="' + (BL.tempoStemSs * ssPx).toFixed(2) + '"/>');
          parts.push('<text x="' + (tx + BL.tempoGapSs * ssPx).toFixed(2) + '" y="' + ty.toFixed(2) +
            '" font-size="' + (BL.tempoSizeSs * ssPx).toFixed(2) + '" font-family="' + E.fontFamily +
            // ONE DECIMAL WHERE FRACTIONAL (day 36): the per-part map holds
            // both kinds — 150, 80, 120 are whole, 93.8 and 45.8 are not — and
            // "150.0" states a precision the number does not have.
            '" font-style="italic">= ' + esc(Math.abs(it.bpm - Math.round(it.bpm)) < 0.05
              ? String(Math.round(it.bpm)) : it.bpm.toFixed(1)) + '</text>');
        } else if (it.k === 'glissline') {
          // the gliss line between the section's two pitches (day 35): a plain
          // rule at stem thickness, its length the diameter of TWO regular
          // half-note heads, a standard spacer clear of each head
          if (!owns(it.t)) continue;
          const gy = Y(it.ySs + (it.liftSs || 0)), gt = it.thickSs * ssPx;   // [§672] liftSs: a level line on a staff line, drawn off it (objects.glissLine.onStaffLine)
          if (it.y1Ss != null && it.y1Ss !== it.ySs) {
            // [PLAN 2h.2] D45: the start and the destination on different lines — the rule slants
            // from head to head, the same vertical thickness as the level one
            const xa = X(it.t, it.dx0Ss), xb = X(it.t, it.dx1Ss), gy1 = Y(it.y1Ss);
            parts.push('<polygon points="' + [[xa, gy - gt / 2], [xb, gy1 - gt / 2], [xb, gy1 + gt / 2], [xa, gy + gt / 2]]
              .map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ') + '"/>');
          } else
          parts.push('<rect x="' + X(it.t, it.dx0Ss).toFixed(2) + '" y="' + (gy - gt / 2).toFixed(2) +
            '" width="' + ((it.dx1Ss - it.dx0Ss) * ssPx).toFixed(2) + '" height="' + gt.toFixed(2) + '"/>');
        } else if (it.k === 'niente') {
          // the NIENTE CIRCLE (day 35). No LilyPond glyph exists for it — in
          // LilyPond the circled tip is DRAWN — so it is drawn here: an open
          // circle the diameter of the `m` in mf (measured 0.4695 ss), stroked
          // at the arrow's own thickness, sitting on the dynamic row.
          if (!owns(it.t)) continue;
          // centred ON the arrow's axis, so the two read as one gesture
          // (the composer's reference image: circle then hairpin, one line)
          const r = it.diaSs * ssPx / 2;
          parts.push('<circle cx="' + X(it.t, it.dxSs).toFixed(2) + '" cy="' + Y(it.ySs).toFixed(2) +
            '" r="' + r.toFixed(2) + '" fill="none" stroke="' + o.ink +
            '" stroke-width="' + (it.thickSs * ssPx).toFixed(2) + '"/>');
        } else if (it.k === 'cresccurve') {
          // THE CRESCENDO (day 35, composer): the glissando's twin — one
          // interpolated curve for the whole section, limeGreen, taking the
          // BOTTOM HALF of the lane. Filled, no border, like its twin.
          // `full` (day 36, composer: "the curve only reaches half track
          // height, can you make the curve full track height"): the half-lane
          // above exists because on a MORPH page the glissando owns the top
          // half. The trance section has no glissando, so its final crescendo
          // takes the whole lane. Opt-in per overlay — morph pages unchanged.
          if (!crosses(it.t0, it.t1)) continue;
          const CC = E.crescCurve;
          const yB = sys.yBotPx;
          const yCeil = it.full ? sys.yTopPx : (sys.yTopPx + sys.yBotPx) / 2;
          const n2 = it.samples.length, cp = [];
          const whole = cutKind('cresccurve');   // [2c.3]
          for (let i = 0; i < n2; i++) {
            const t = it.t0 + (it.t1 - it.t0) * (i / (n2 - 1));
            if (whole ? (t < w0 - CUT_PAD_S || t > w1 + CUT_PAD_S) : (t < w0 - 1e-9 || t > wInk + 1e-9)) continue;   // [§695] a cut curve: the page's own stretch + the pad, not the whole path
            cp.push([view.xOfSeconds(t), yB - it.samples[i] * (yB - yCeil)]);
          }
          if (PRE && OWN) cp.splice(0, cp.length, ...edgeCurvePts(it, v => yB - v * (yB - yCeil)));   // [2c.6]
          if (cp.length >= 2) {
            const cline = cp.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
            if (CC.pathOpacity != null) {   // [D42]
              parts.push(curvePathD42(CC, cline + ' L' + cp[cp.length - 1][0].toFixed(1) + ',' + yB.toFixed(1) + ' L' + cp[0][0].toFixed(1) + ',' + yB.toFixed(1) + ' Z'));
            } else if (CC.fillOpacity > 0) {
              parts.push('<path d="' + cline + ' L' + cp[cp.length - 1][0].toFixed(1) + ',' + yB.toFixed(1) +
                ' L' + cp[0][0].toFixed(1) + ',' + yB.toFixed(1) + ' Z" fill="' + CC.color +
                '" fill-opacity="' + CC.fillOpacity + '" stroke="none"/>');
            }
            if (CC.pathOpacity == null && CC.strokeWPx > 0 && CC.strokeOpacity > 0) {
              parts.push('<path d="' + cline + '" fill="none" stroke="' + CC.color +
                '" stroke-width="' + CC.strokeWPx + '" stroke-opacity="' + CC.strokeOpacity + '"/>');
            }
          }
        } else if (it.k === 'glisscurve') {
          // THE MORPH GLISSANDO (day 35, composer): one smooth interpolated
          // line for the whole section, brightOrange, taking PRECISELY the TOP
          // HALF of the lane. The bottom half belongs to the crescendo.
          if (!crosses(it.t0, it.t1)) continue;
          const GC2 = E.glissCurve;
          // [LGMF 2k.4, his B §505] the vertical scale is the rule's (`scale`, rules.json objects.glissCurve): `travel` = the samples are
          // 0 … 1 of the part's own travel, the half-lane its extremes. A curve extracted on another scale than the rule's is not drawn —
          // it would say a range it was not measured on (an item with no `scale` is the tuba's, travel by construction)
          if (it.scale && it.scale !== (GC2.scale || 'travel')) continue;
          const yT = sys.yTopPx, yMid = (sys.yTopPx + sys.yBotPx) / 2;
          const n = it.samples.length, gp = [];
          const whole = cutKind('glisscurve');   // [2c.3]
          for (let i = 0; i < n; i++) {
            const t = it.t0 + (it.t1 - it.t0) * (i / (n - 1));
            if (whole ? (t < w0 - CUT_PAD_S || t > w1 + CUT_PAD_S) : (t < w0 - 1e-9 || t > wInk + 1e-9)) continue;   // [§695] a cut curve: the page's own stretch + the pad, not the whole path
            gp.push([view.xOfSeconds(t), yMid - it.samples[i] * (yMid - yT)]);
          }
          if (PRE && OWN) gp.splice(0, gp.length, ...edgeCurvePts(it, v => yMid - v * (yMid - yT)));   // [2c.6]
          if (gp.length >= 2) {
            const line = gp.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
            // the fill closes on the HALF-LANE baseline, not the lane floor —
            // the glissando owns the top half only
            if (GC2.pathOpacity != null) {   // [D42]
              parts.push(curvePathD42(GC2, line + ' L' + gp[gp.length - 1][0].toFixed(1) + ',' + yMid.toFixed(1) + ' L' + gp[0][0].toFixed(1) + ',' + yMid.toFixed(1) + ' Z'));
            } else if (GC2.fillOpacity > 0) {
              parts.push('<path d="' + line +
                ' L' + gp[gp.length - 1][0].toFixed(1) + ',' + yMid.toFixed(1) +
                ' L' + gp[0][0].toFixed(1) + ',' + yMid.toFixed(1) + ' Z" fill="' + GC2.color +
                '" fill-opacity="' + GC2.fillOpacity + '" stroke="none"/>');
            }
            // no border on top: fill-only unless a stroke is explicitly asked for
            // (composer, day 35 — the same verdict the env curve got on day 22)
            if (GC2.pathOpacity == null && GC2.strokeWPx > 0 && GC2.strokeOpacity > 0) {
              parts.push('<path d="' + line +
                '" fill="none" stroke="' + GC2.color + '" stroke-width="' + GC2.strokeWPx +
                '" stroke-opacity="' + GC2.strokeOpacity + '" stroke-linecap="round"/>');
            }
          }
        } else if (it.k === 'dynarrow') {
          // the surge's hairpin replacement: a short rightward arrow between
          // the two marks — line + solid triangular head, stem-thickness
          if (!owns(it.t)) continue;
          const x0 = X(it.t, it.dx0Ss), x1 = X(it.t, it.dx1Ss);
          const yA = Y(it.ySs);
          const headL = (it.headSs || 0.45) * ssPx, thick = (it.thickSs || 0.13) * ssPx;
          parts.push('<line x1="' + x0.toFixed(2) + '" y1="' + yA.toFixed(2) + '" x2="' + (x1 - headL).toFixed(2) +
            '" y2="' + yA.toFixed(2) + '" stroke="' + o.ink + '" stroke-width="' + thick.toFixed(2) + '"/>');
          parts.push('<path d="M' + x1.toFixed(2) + ',' + yA.toFixed(2) +
            ' L' + (x1 - headL).toFixed(2) + ',' + (yA - headL * 0.45).toFixed(2) +
            ' L' + (x1 - headL).toFixed(2) + ',' + (yA + headL * 0.45).toFixed(2) + ' Z"/>');
        } else if (it.k === 'hairpin') {
          // [LGMF 2f.6, §460] THE FADE SIGNS' HAIRPIN: two lines from the closed tip, opening to hSs (rules.json objects.hairpin —
          // LilyPond's Hairpin height), stem-thickness; dir 'cresc' = the tip at the left (○—<), 'decresc' = the tip at the right (—>)
          if (!owns(it.t)) continue;
          const x0 = X(it.t, it.dx0Ss), x1 = X(it.t, it.dx1Ss), yA = Y(it.ySs);
          const hh = (it.hSs || 0.667) * ssPx / 2, thick = (it.thickSs || 0.13) * ssPx;   // RULES MIRROR
          const tip = it.dir === 'decresc' ? x1 : x0, open = it.dir === 'decresc' ? x0 : x1;
          parts.push('<path d="M' + open.toFixed(2) + ',' + (yA - hh).toFixed(2) + ' L' + tip.toFixed(2) + ',' + yA.toFixed(2) +
            ' L' + open.toFixed(2) + ',' + (yA + hh).toFixed(2) + '" fill="none" stroke="' + o.ink + '" stroke-width="' + thick.toFixed(2) + '" stroke-linejoin="miter"/>');
        } else if (it.k === 'slash') {
          // [§550] the acciaccatura's stroke — one line through the grace's stem and flag (rules.json objects.graceSlash)
          if (!owns(it.t)) continue;
          const thick = (it.thickSs || 0.13) * ssPx;   // RULES MIRROR
          parts.push('<line x1="' + X(it.t, it.dx0Ss).toFixed(2) + '" y1="' + Y(it.y0Ss).toFixed(2) + '" x2="' + X(it.t, it.dx1Ss).toFixed(2) + '" y2="' + Y(it.y1Ss).toFixed(2) +
            '" stroke="' + o.ink + '" stroke-width="' + thick.toFixed(2) + '" stroke-linecap="round"/>');
        } else if (it.k === 'squiggle') {
          // [§557] the uneven-group sign's stroke — the acciaccatura's slash made a wave (rules.json objects.groupStub): a line from
          // (dx0, y0) to (dx1, y1) with a sine across it, ampSs high, waves along
          if (!owns(it.t)) continue;
          const ax = X(it.t, it.dx0Ss), ay = Y(it.y0Ss), bx = X(it.t, it.dx1Ss), by = Y(it.y1Ss);
          const ddx = bx - ax, ddy = by - ay, L = Math.hypot(ddx, ddy) || 1, nx = -ddy / L, ny = ddx / L;
          const amp = (it.ampSs || 0.15) * ssPx, waves = it.waves || 2.5, thick = (it.thickSs || 0.13) * ssPx;   // RULES MIRROR
          const N = 48, pts = [];
          // [§558] hand-drawn: two incommensurable waves (the second at 2.3× the first, half the height, offset) — irregular, and the same every time
          const wave = s => it.hand ? amp * (Math.sin(2 * Math.PI * waves * s + 0.6) + 0.5 * Math.sin(2 * Math.PI * waves * 2.3 * s + 2.0)) : amp * Math.sin(2 * Math.PI * waves * s);
          for (let i = 0; i <= N; i++) { const s = i / N, w = wave(s); pts.push((ax + ddx * s + nx * w).toFixed(2) + ',' + (ay + ddy * s + ny * w).toFixed(2)); }
          parts.push('<path d="M' + pts.join(' L') + '" fill="none" stroke="' + o.ink + '" stroke-width="' + thick.toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/>');
        } else if (it.k === 'slur') {
          // [§555] THE SLUR (rules.json objects.slur — LilyPond's): a filled shape between two cubics — the outer peaks at heightSs, the
          // inner thickSs less, so the middle is thickSs thick; the outline stroked endThickSs so the ends have LilyPond's line-thickness.
          // Its ends sit at their own times (t0 · t1); drawn on every page it crosses, clipped like paper
          if (!crosses(it.t0, it.t1)) continue;
          const x0 = X(it.t0, it.dx0Ss), x1 = X(it.t1, it.dx1Ss), ya = Y(it.y0Ss), yb = Y(it.y1Ss);
          const sgn = it.dir === 'below' ? 1 : -1, thick = (it.thickSs || 0.12) * ssPx, endThick = (it.endThickSs || 0.08) * ssPx;   // RULES MIRROR
          const kOut = sgn * ((it.heightSs || 0) * ssPx) / 0.75, kIn = sgn * Math.max(0, (it.heightSs || 0) * ssPx - thick) / 0.75;
          const cx0 = x0 + (x1 - x0) / 3, cx1 = x0 + 2 * (x1 - x0) / 3, cy0 = ya + (yb - ya) / 3, cy1 = ya + 2 * (yb - ya) / 3;
          const f = v => v.toFixed(2);
          // [§663] THE STEEP SLUR (it.perp): the bow is measured PERPENDICULAR to the chord, on the side the item names (below = the normal
          // that points down the page) — a vertical offset on a near-vertical chord gave a straight line with a hook
          let ux = 0, uy = 1;
          if (it.perp) { const cl = Math.hypot(x1 - x0, yb - ya) || 1; ux = -(yb - ya) / cl; uy = (x1 - x0) / cl; if (uy * sgn < 0 || (uy === 0 && ux > 0)) { ux = -ux; uy = -uy; } ux *= sgn; uy *= sgn; }
          const P = (cx, cy, k) => f(cx + (it.perp ? ux : 0) * k) + ',' + f(cy + (it.perp ? uy : 1) * k);
          parts.push('<path d="M' + f(x0) + ',' + f(ya) + ' C' + P(cx0, cy0, kOut) + ' ' + P(cx1, cy1, kOut) + ' ' + f(x1) + ',' + f(yb) +
            ' C' + P(cx1, cy1, kIn) + ' ' + P(cx0, cy0, kIn) + ' ' + f(x0) + ',' + f(ya) + ' Z" fill="' + o.ink + '" stroke="' + o.ink +
            '" stroke-width="' + f(endThick) + '" stroke-linejoin="round"/>');
        } else if (it.k === 'hairpin-timed') {
          // [LGMF 2g.4, §464 · §466] THE VIBRAPHONE'S TIMED HAIRPIN: its length the time of the movement — from x(t0) (never before
          // `after`, the mark before it + its gap) to x(t1) + dx1Ss (before the name it reaches); dropped when shorter than `minSs` (the
          // names stand). A spanning graphic (edge cut · stub): drawn on every page it crosses, the wedge cut at the page's edges by
          // interpolation, so a page draws exactly its share of the opening
          if (!crosses(it.t0, it.t1)) continue;
          let xa = X(it.t0, it.dx0Ss), xb = X(it.t1, it.dx1Ss);
          if (it.after) xa = Math.max(xa, X(it.after.t, it.after.dxSs));
          if (xb - xa < (it.minSs || 0) * ssPx) continue;
          const hh = (it.hSs || 0.667) * ssPx / 2, thick = (it.thickSs || 0.13) * ssPx, yA = Y(it.ySs);   // RULES MIRROR
          const open = x => hh * (it.dir === 'decresc' ? (xb - x) : (x - xa)) / (xb - xa);   // the half-opening at x: 0 at the tip
          const ca = Math.max(xa, view.xOfSeconds(w0)), cb = Math.min(xb, view.xOfSeconds(wInk));
          if (cb - ca < 0.5) continue;
          parts.push('<path d="M' + ca.toFixed(2) + ',' + (yA - open(ca)).toFixed(2) + ' L' + cb.toFixed(2) + ',' + (yA - open(cb)).toFixed(2) +
            ' M' + ca.toFixed(2) + ',' + (yA + open(ca)).toFixed(2) + ' L' + cb.toFixed(2) + ',' + (yA + open(cb)).toFixed(2) +
            '" fill="none" stroke="' + o.ink + '" stroke-width="' + thick.toFixed(2) + '" stroke-linecap="round"/>');
        } else if (it.k === 'tuplet') {
          // THE TUPLET BRACKET (day 23) — the composer's LilyPond standard,
          // measured: a FLAT bracket (their own flatten-tuplet-bracket), hooks
          // descending toward the notes, the horizontal in TWO segments with a
          // gap for the numeral, which straddles the line. Geometry:
          // engraving.layout.tuplet.
          // [2c.3] a bracket off this page is not drawn at all (it had no gate) · [2c.6] nor on a print page of the objects plan, where
          // every tuplet in the score was drawn off to the right of page 1 (db1: to x 11046 — under D59's reserves too)
          if ((cutKind('tuplet') || (PRE && OWN)) && !crosses(it.t0, it.t1)) continue;
          const TP = E.tuplet || {};
          const th = (TP.thicknessSs || 0.16) * ssPx, hook = (TP.hookLengthSs || 0.7) * ssPx;
          const yL = Y(it.ySs);
          // day 29 (composer): adjacent groups' brackets abutted edge to edge
          // and read as one line — each end pulls in by hGapSs so neighbours
          // show daylight. Registry: engraving.layout.tuplet.hGapSs.
          const hIn = (TP.hGapSs != null ? TP.hGapSs : 0.35) * ssPx;
          // dx1Ss: layout anchored the right end to the bracket's own trailing
          // rest glyph (day 29) — use it instead of the symmetric inset
          const x0 = view.xOfSeconds(it.t0) + hIn + shiftOf(it.t0);   // [2c.4] the ends follow their units' clamps
          const x1 = (it.dx1Ss != null ? view.xOfSeconds(it.t1) + it.dx1Ss * ssPx : view.xOfSeconds(it.t1) - hIn) + shiftOf(it.t1);
          const size = (TP.numeralSizeSs || 1.2348) * ssPx;
          const gap = (it.text || '3:2').length * (TP.numeralGapPerCharSs || 0.88) * ssPx;
          const gMid = (x0 + x1) / 2, gA = gMid - gap / 2, gB = gMid + gap / 2;
          const dir = it.dir === 'down' ? -1 : 1;      // hooks point toward the notes
          const seg = (a, b) => '<rect x="' + Math.min(a, b).toFixed(2) + '" y="' + (yL - th / 2).toFixed(2) +
            '" width="' + Math.abs(b - a).toFixed(2) + '" height="' + th.toFixed(2) + '"/>';
          const vert = x => '<rect x="' + (x - th / 2).toFixed(2) + '" y="' + (dir > 0 ? yL : yL - hook).toFixed(2) +
            '" width="' + th.toFixed(2) + '" height="' + hook.toFixed(2) + '"/>';
          parts.push(seg(x0, gA), seg(gB, x1), vert(x0), vert(x1));
          const baseY = yL + (TP.numeralBaselineBelowSs || 0.41) * ssPx;
          parts.push('<text x="' + gMid.toFixed(1) + '" y="' + baseY.toFixed(1) + '" font-size="' + size.toFixed(1) +
            '" text-anchor="middle" font-style="italic"' + fontAttr + ' fill="' + o.ink + '">' + esc(it.text || '3:2') + '</text>');
        } else if (it.k === 'ottava') {
          // piece #2 session-57 bracket over the NOTEHEAD ONLY (round 2):
          // label · dashes RIGHT-ALIGNED stepping back from the hook (p2's
          // emitDashes — the connecting dash meets the hook, forming the L),
          // hook at the head's right edge. Geometry: glyphs.standards.ottava.
          if (!owns(it.t)) continue;
          const O = stds.ottava || {};
          const lg = glyphs.ottavaText && glyphs.ottavaText[it.label];
          const yLine = Y(it.ySs);
          let xLabel = X(it.t, it.dx0Ss || 0);
          const xHook = X(it.t, it.dx1Ss || 0);
          // a too-narrow unit widens the bracket leftward to its minimum span
          const minSpan = (O.minBracketSpanSs || 1.37) * ssPx;
          const lgW = lg ? (lg.wSs + (O.textGapBeforeLineSs || 0.1)) * ssPx : 0;
          if (xHook - (xLabel + lgW) < minSpan) xLabel = xHook - minSpan - lgW;
          let xDashStart = xLabel;
          if (lg) {
            // text baseline straddles the line (lineAttachAboveBaselineSs)
            const ty = yLine + (O.lineAttachAboveBaselineSs || 0.32) * ssPx - lg.hSs * ssPx;
            parts.push('<g transform="translate(' + xLabel.toFixed(2) + ',' + ty.toFixed(2) + ') scale(' + ssPx + ')">' +
              '<path d="' + lg.path + '"/></g>');
            xDashStart = xLabel + lgW;
          }
          const thick = (O.lineThicknessSs || 0.067) * ssPx;
          const dashLen = (O.dashLengthSs || 0.3) * ssPx, dashGap = (O.gapBetweenDashesSs || 0.7) * ssPx;
          let xEnd = xHook;
          while (xEnd - dashLen >= xDashStart - 1e-6) {
            parts.push('<line x1="' + (xEnd - dashLen).toFixed(2) + '" y1="' + yLine.toFixed(2) + '" x2="' + xEnd.toFixed(2) +
              '" y2="' + yLine.toFixed(2) + '" stroke="' + o.ink + '" stroke-width="' + thick.toFixed(2) + '"/>');
            xEnd -= dashLen + dashGap;
          }
          // hook extends from the line BACK TOWARD the staff
          const hook = (O.hookLengthSs || 0.8) * ssPx * (it.dir === 'above' ? 1 : -1);
          parts.push('<line x1="' + xHook.toFixed(2) + '" y1="' + yLine.toFixed(2) + '" x2="' + xHook.toFixed(2) +
            '" y2="' + (yLine + hook).toFixed(2) + '" stroke="' + o.ink + '" stroke-width="' + thick.toFixed(2) + '"/>');
        } else if (it.k === 'lvslur') {
          // [2h.5] the let-ring slur (§486): piece #2's baked l.v. crescent —
          // a filled outline with LilyPond's 0.1 ss stroke. The attachment
          // line sits at ySs; the crescent rises away from the head ('above')
          // or is mirrored about that line ('below').
          if (!owns(it.t)) continue;
          const LV = glyphs.letRing;
          if (!LV) continue;
          const ax = X(it.t, it.dxSs), ay = Y(it.ySs), ky = it.dir === 'below' ? -1 : 1;
          parts.push('<g transform="translate(' + ax.toFixed(2) + ',' + (ay - ky * LV.anchors.leftAttach.y * ssPx).toFixed(2) +
            ') scale(' + ssPx + ',' + (ky * ssPx) + ')"><path d="' + LV.path + '" fill="' + o.ink + '" stroke="' + o.ink + '" stroke-width="' + LV.strokeSs +
            '" stroke-linejoin="round"/></g>');
        } else if (it.k === 'goline') {
          // dotted vertical at go time, full lane band (piece #1's go-time
          // marker: 0.5 @ 0.4, dasharray 2,2)
          if (!owns(it.t)) continue;
          const GL = E.goLine;
          const gx = view.xOfSeconds(it.t).toFixed(2);
          // §401h: the top at the GC arc's top when this note carries a GC and the registry says so; a
          // multi-staff part's bottom trimmed by multiStaffBottomTrimPx (at the 1080 frame, scaled)
          let gy1 = lane.yTopPx, gy2 = lane.yBotPx;
          if (GL.topAtGcArc && (hasGc.has(it.ev) || it.topAsGc)) {   // [2f.4] topAsGc: a trill's go line, the strikes' length
            const Gg = GC.laneGeom(GC.systemOf(view, sysModel.part), view, E.gc && E.gc.look);
            gy1 = Math.max(gy1, Gg.impactY - Gg.h);
          }
          // §401i (the composer: 'make it the same amount below bottom staff as currently above top staff'):
          // on a multi-staff part the go line ends below the LAST staff's bottom line by exactly the distance
          // its top sits above the FIRST staff's top line — a mirror, not a pixel count
          if (lane !== sys && GL.multiStaffBottomMirrorsTop) {
            try {
              const pc = o.ensemble.parts.find(q => q.part === sysModel.part);
              const a = view.system(sysModel.part + ':0'), b = view.system(sysModel.part + ':' + (pc.staves.length - 1));
              gy2 = b.yOfSs(-2) + (a.yOfSs(2) - gy1);
            } catch (e) { /* no ensemble or staves: the lane bottom stands */ }
          }
          parts.push('<line' + GO(it.t) + ' x1="' + gx + '" y1="' + gy1.toFixed(1) + '" x2="' + gx + '" y2="' + gy2.toFixed(1) +
            '" stroke="' + GL.color + '" stroke-width="' + GL.wPx + '" stroke-opacity="' + GL.opacity +
            '" stroke-dasharray="' + GL.dash + '"/>');
        } else if (it.k === 'gc') {
          // THE GC OBJECT's static ink (day 23, piece #1's renderGC verbatim):
          // the trajectory polyline across TIME, stroke = the GC color at
          // 1.5 px, no fill; the impact marker r 4 px on the go line, 5 px
          // above the lane bottom. Sizes at the 1080 frame × magnification.
          // Clipped to the page like the ring bar (an arc may cross a cut).
          const lookM = Object.assign({}, E.gc && E.gc.look, it.geom ? { geom: it.geom } : {}, it.staffTop != null ? { staffTopSs: it.staffTop } : {}, it.impactSs != null ? { impactSs: it.impactSs } : {}, it.spread > 0 ? { spread: it.spread } : {});   // [§592] the item's geometry ('beatBall') · [§650] 'staffTop' with the staff's top line · [§653] a named impact · [§656] a hand's aperture
          const P = GC.params(GC.presetFor((E.gc && E.gc.preset) || {}, it.preset || {}, lookM));   // [§593] the aperture by the geometry
          // [2b.7.1] the arc follows ITS STRIKE: owned = drawn whole, unowned =
          // not drawn at all. That is what kills the ghost arc over the clef —
          // the note gated on inWin and the arc on range intersection, so a
          // strike just BEFORE the window left its arc behind. With no owned
          // span the old range test stands: the film's approach is deliberate.
          if (OWN) { if (!owns(it.t)) continue; }
          else if (it.t + P.post < w0 || it.t - P.pre > w1) continue;
          // §401e: the GC's own system (the first staff of a multi-staff part) — a single lane's height, the
          // impact between the piano's staves; the go line above keeps the whole lane
          const G = GC.laneGeom(GC.systemOf(view, sysModel.part), view, lookM);
          const color = (E.gc && E.gc.color) || G.look.color;
          const d = GC.trajectory(P).map((p, i) =>
            (i ? 'L' : 'M') + view.xOfSeconds(it.t + p.dt).toFixed(2) + ' ' + (G.impactY - p.frac * G.h).toFixed(2)).join(' ');
          const arc = '<path class="gc-arc" d="' + d + '" stroke="' + color + '" stroke-width="' + (G.look.arcStrokePx * G.k).toFixed(2) + '" fill="none"/>';
          parts.push(cutKind('gc') ? clipOpen + arc + '</g>' : arc);   // [2c.3] the arc cut like paper; the impact below is a point
          if (OWN || (boundaryBefore('gc') ? ownsBefore(it.t) : inWin(it.t))) parts.push('<circle class="gc-impact"' + GO(it.t) + ' cx="' + view.xOfSeconds(it.t).toFixed(2) + '" cy="' + G.impactY.toFixed(2) +
            '" r="' + (G.look.impactRadiusPx * G.k).toFixed(2) + '" fill="' + color + '"/>');
        } else if (it.k === 'bowlead') {
          // [§495, 2i.7] THE BOW LEAD: a dotted vertical line at the head's left edge from the head's centre to the far edge of its seat's
          // bar (rules.json objects.bowLead — the thickness, the dash; `colour` seat = the bar's hue, else a colour key of the registry)
          if (!owns(it.t)) continue;
          const BL = E.bowLead || {}, RBc = E.ringBar || {};
          const col = BL.colour === 'seat' ? (it.seat === 1 && RBc.colorSeat2 ? RBc.colorSeat2 : RBc.color) : (BL.colour || o.ink);
          const x = X(it.t, it.dxSs), d = (BL.dashSs || 0.18) * ssPx, g = (BL.gapSs || 0.18) * ssPx;   // RULES MIRROR
          parts.push('<line x1="' + x.toFixed(2) + '" y1="' + Y(it.y0Ss).toFixed(2) + '" x2="' + x.toFixed(2) + '" y2="' + Y(it.y1Ss).toFixed(2) +
            '" stroke="' + col + '" stroke-width="' + ((BL.thickSs || 0.08) * ssPx).toFixed(2) + '" stroke-dasharray="' + d.toFixed(2) + ' ' + g.toFixed(2) + '" stroke-linecap="round"/>');
        } else if (it.k === 'headswatch') {
          // [§495] THE HEAD SWATCH: a pale rounded patch behind the head in its seat's bar colour at the bar's opacity (objects.headSwatch)
          if (!owns(it.t)) continue;
          const HS = E.headSwatch || {}, RBc = E.ringBar || {};
          const col = HS.colour === 'seat' ? (it.seat === 1 && RBc.colorSeat2 ? RBc.colorSeat2 : RBc.color) : (HS.colour || o.ink);
          const w = it.wSs * ssPx, h = it.hSs * ssPx, cx = X(it.t, it.dxSs), cy = Y(it.ySs);
          parts.push('<rect x="' + (cx - w / 2).toFixed(2) + '" y="' + (cy - h / 2).toFixed(2) + '" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '" rx="' + (h / 4).toFixed(2) + '" fill="' + col + '" opacity="' + (HS.opacity != null ? HS.opacity : 0.3) + '"/>');   // RULES MIRROR
        } else if (it.k === 'ringbar') {
          // the sounding-length bar: left edge flush with the go line,
          // right edge at onset + sounding length, centered on the written
          // head; clipped to the page like a brick
          if (!crosses(it.t0, it.t1)) continue;
          const RB = E.ringBar;
          // dx0Ss (day 24): the bar begins after the nh-unit's ink, not at the
          // go line — layout computes it from the unit's own right edge.
          const x0 = X(Math.max(it.t0, w0), it.t0 >= w0 ? it.dx0Ss : 0) + (it.t0 >= w0 ? shiftOf(it.t0) : 0), x1 = view.xOfSeconds(Math.min(it.t1, wInk));   // [2c.4] after its unit's ink
          // [LGMF 2g.3 → 2h.4, §477] `offSs` (the vibraphone's close rule, layout.js): the WHOLE bar moved off its head's centre to the
          // head's far edge (+ above, − below); a side change along the bar (`segs`) steps to each segment's own offset; absent = the
          // bar centred on its head, exactly as before. 2g.3's half-height bars (`hFrac`) are retired.
          const h = RB.hSs * ssPx, yC = Y(it.ySs + (it.offSs || 0));
          // [§484, his word 2026-09-28] the bowed vibraphone's SECOND seat (chain 1) in its own colour (rules.json objects.ringBar.colourSeat2,
          // olive); the first seat and every other part's bar the ring bar's own colour; the marks ink for both
          const fillRB = it.seat === 1 && RB.colorSeat2 ? RB.colorSeat2 : RB.color;
          if (it.segs) {   // the side changes along the bar (the voices cross through a unison): one rect a segment
            for (let i = 0; i < it.segs.length; i++) {
              const sa = i === 0 ? x0 : Math.max(x0, view.xOfSeconds(Math.max(it.segs[i].t, w0)));
              const sb = i + 1 < it.segs.length ? Math.min(x1, view.xOfSeconds(Math.min(it.segs[i + 1].t, wInk))) : x1;
              if (sb - sa < 0.5) continue;
              const yS = Y(it.ySs + (it.segs[i].offSs || 0));
              parts.push('<rect x="' + sa.toFixed(2) + '" y="' + (yS - h / 2).toFixed(2) + '" width="' + (sb - sa).toFixed(2) +
                '" height="' + h.toFixed(2) + '" fill="' + fillRB + '" opacity="' + RB.opacity + '"/>');
            }
          } else
          parts.push('<rect x="' + x0.toFixed(2) + '" y="' + (yC - h / 2).toFixed(2) + '" width="' + Math.max(1, x1 - x0).toFixed(2) +
            '" height="' + h.toFixed(2) + '" fill="' + fillRB + '" opacity="' + RB.opacity + '"/>');
        } else if (it.k === 'finalbar') {
          // [decibel RUNNING_LOG §411 — DEC-181; rules.json objects.finalBar → engraving.render.finalBar] THE FINAL BAR LINE: a thin line and a thick
          // one, the thin line's left edge on its time, through the WHOLE system — each lane draws its own stretch, reaching over half the gap
          // to its neighbours, so the bar is one unbroken line from the first lane's top to the last lane's bottom. The lanes' dividers run on.
          const FB = E.finalBar;
          if (!FB || !owns(it.t)) continue;
          const allTop = Math.min.apply(null, view.systems.map(s => s.yTopPx)), allBot = Math.max.apply(null, view.systems.map(s => s.yBotPx));
          const yF1 = lane.yTopPx <= allTop + 0.5 ? lane.yTopPx : lane.yTopPx - laneHalfGapPx, yF2 = lane.yBotPx >= allBot - 0.5 ? lane.yBotPx : lane.yBotPx + laneHalfGapPx;
          const xF = view.xOfSeconds(it.t), thinF = FB.thinSs * ssPx, gapF = FB.gapSs * ssPx, thickF = FB.thickSs * ssPx;
          parts.push('<rect class="final-bar" x="' + xF.toFixed(2) + '" y="' + yF1.toFixed(2) + '" width="' + thinF.toFixed(2) + '" height="' + (yF2 - yF1).toFixed(2) + '" fill="' + FB.colour + '"/>' +
            '<rect class="final-bar" x="' + (xF + thinF + gapF).toFixed(2) + '" y="' + yF1.toFixed(2) + '" width="' + thickF.toFixed(2) + '" height="' + (yF2 - yF1).toFixed(2) + '" fill="' + FB.colour + '"/>');
        } else if (it.k === 'sinebox') {
          // [decibel PLAN 2.12 — RUNNING_LOG §404; DEC-173; rules.json objects.sineBox → engraving.render.sineBox] THE SINE'S BOX: how a sine tone
          // of the electronics is written — the open head of its pitch on its time, and round the head a box in the electronics' purple (the
          // return brick's recipe: a pale fill, a solid outline, rounded corners) that runs out to the sine's end, in the place of a duration
          // line. padSs of room over, under and to the LEFT of the head; its right edge the sine's end exactly. A LONG kind: on a tiled screen
          // page drawn whole inside the page's clip (cut like paper at a turn). It follows its head when the head's unit is clamped at a page start.
          // [§406, DEC-175] the box as the layout measured it — dxSs its left edge from x(t0), topSs · botSs its edges on the staff — round ALL the
          // notation, which stands BEFORE the go line; the go line inside it, the box's own height, at the moment the sine starts (it never
          // moves: a go-time mark); the right edge the sine's end. An item without the measures (a page laid out before §406) = round the head.
          const SB = E.sineBox;
          if (!SB || !crosses(it.t0, it.t1)) continue;
          const wholeS = cutMark >= 0, padS = SB.padSs * ssPx, headH = glyphs.notehead.open.hSs * ssPx;
          const xGoS = view.xOfSeconds(it.t0), shS = it.t0 >= w0 ? shiftOf(it.t0) : 0;
          const xS0 = it.dxSs != null ? Math.min(xGoS + it.dxSs * ssPx + shS, xGoS - padS) : xGoS - padS + shS;
          const yST = it.topSs != null ? Y(it.topSs) : Y(it.ySs) - headH / 2 - padS, ySB = it.botSs != null ? Y(it.botSs) : Y(it.ySs) + headH / 2 + padS;
          const xSa = wholeS ? xS0 : Math.max(xS0, view.xOfSeconds(w0)), xSb = view.xOfSeconds(wholeS ? it.t1 : Math.min(it.t1, wInk));
          parts.push('<rect class="sine-box" x="' + xSa.toFixed(2) + '" y="' + yST.toFixed(2) + '" width="' + Math.max(1, xSb - xSa).toFixed(2) + '" height="' + (ySB - yST).toFixed(2) +
            '" rx="' + (SB.cornerSs * ssPx).toFixed(2) + '" fill="' + SB.colour + '" fill-opacity="' + SB.fillOpacity + '" stroke="' + SB.colour +
            '" stroke-width="' + (SB.strokeSs * ssPx).toFixed(2) + '" stroke-opacity="' + SB.strokeOpacity + '"/>');
          if (it.go && E.goLine && owns(it.t0)) {
            const GLs = E.goLine;
            // [§408, DEC-177 — his "go line from top of the purple box [to] the bottom, all the way connecting the two borders … I know it's a
            // dotted line"] BORDER TO BORDER: the go line's own dash length, the GAPS eased so that a whole number of dashes fills the box —
            // a dash begins on the top border and one ends on the bottom
            const dsS = String(GLs.dash || '').split(',').map(Number), LhS = ySB - yST;
            let dashS = GLs.dash;
            if (dsS.length === 2 && dsS[0] > 0 && dsS[1] >= 0 && LhS > 2 * dsS[0]) {
              const nS = Math.max(2, Math.round((LhS + dsS[1]) / (dsS[0] + dsS[1]))), gS = (LhS - nS * dsS[0]) / (nS - 1);
              if (gS >= 0.5) dashS = dsS[0] + ',' + gS.toFixed(3);
            }
            parts.push('<line' + GO(it.t0) + ' class="sine-go" x1="' + xGoS.toFixed(2) + '" y1="' + yST.toFixed(2) + '" x2="' + xGoS.toFixed(2) + '" y2="' + ySB.toFixed(2) +
              '" stroke="' + GLs.color + '" stroke-width="' + GLs.wPx + '" stroke-opacity="' + GLs.opacity + '" stroke-dasharray="' + dashS + '"/>');
          }
        } else if (it.k === 'mic') {
          // [decibel PLAN 2.4 · 2.6 — RUNNING_LOG §325; rules.json objects.micOpening → engraving.render.micOpening] THE MIC OPENING: when the
          // player plays into the microphone, and for how long — the composer score's own brick (a rounded rectangle, its colour as a pale
          // fill and a stronger outline, the sign of two circles at its start). It belongs to the LANE, not to the staff: in the lane's mic
          // row. A LONG kind: on a tiled screen page it is drawn whole inside the page's clip (edge class `cut` — a long opening is cut like
          // paper at the turn and goes on at the next page's start); elsewhere over the page's own span. No row in the registry = no ink.
          const MO = E.micOpening;
          if (!MO || !crosses(it.t0, it.t1)) continue;
          const whole = cutMark >= 0, row = micRow(MO);
          // [decibel §410, DEC-180] a VARIANT (rules.json objects.micOpening.variants.<name>) changes the COLOUR alone — the strikes' Stabilo yellow;
          // the fill's and the outline's opacity, the corners, the row and the two circles are the mic opening's own
          const micCol = (it.variant && MO.variants && MO.variants[it.variant] && MO.variants[it.variant].colour) || MO.colour;
          const xa = view.xOfSeconds(whole ? it.t0 : Math.max(it.t0, w0)), xb = view.xOfSeconds(whole ? it.t1 : Math.min(it.t1, wInk));
          const micRect = ('<rect class="mic-open" x="' + xa.toFixed(2) + '" y="' + row.y.toFixed(2) + '" width="' + Math.max(1, xb - xa).toFixed(2) + '" height="' + row.h.toFixed(2) +
            '" rx="' + (MO.cornerSs * ssPx).toFixed(2) + '" fill="' + micCol + '" fill-opacity="' + MO.fillOpacity + '" stroke="' + micCol +
            '" stroke-width="' + (MO.strokeSs * ssPx).toFixed(2) + '" stroke-opacity="' + MO.strokeOpacity + '"/>');
          const SG = MO.sign;
          let micSign = '';
          if (SG && !it.noSign && (whole || it.t0 >= w0 - 1e-9)) {   // [§411] noSign: a window to play in with NO microphone (the last, bare strikes) — the brick alone   // the sign stands at the opening's own start
            const sx = view.xOfSeconds(it.t0) + SG.insetSs * ssPx, sy = row.y + row.h / 2;
            micSign = ('<circle cx="' + sx.toFixed(2) + '" cy="' + sy.toFixed(2) + '" r="' + (SG.ringSs * ssPx).toFixed(2) + '" fill="none" stroke="' + SG.colour +
              '" stroke-width="' + (SG.ringStrokeSs * ssPx).toFixed(2) + '"/><circle cx="' + sx.toFixed(2) + '" cy="' + sy.toFixed(2) + '" r="' + (SG.dotSs * ssPx).toFixed(2) + '" fill="' + SG.colour + '"/>');
          }
          // [§332, DEC-109 — his 'and on top of the black circles'] THE SIGN'S LAYER (objects.micOpening.sign.layer): 'under' = the yellow is drawn
          // OVER the two circles, as a highlighter goes over print · 'over' (or absent) = the circles on top of the yellow
          parts.push(SG && SG.layer === 'under' ? micSign + micRect : micRect + micSign);
        } else if (it.k === 'badge') {
          // [decibel PLAN 2.3 · 2.6 — RUNNING_LOG §325; rules.json objects.badge · the table `language` → engraving.render.badge · .language]
          // A LANGUAGE BADGE: what KIND of sound — a rounded square of the format's ground, the type's sign in the type's colour (the drawing
          // and the colour are rows of rules.json `language`: his choices). It stands in the mic's row: `place` 'before' = its right edge the
          // badge's gap before x(t) (a badge before its mic opening) · 'at' = its left edge on x(t). A POINT kind: drawn once, whole, on the
          // page that owns its time; on a tiled screen page never left of the page's own start (edge class `clamp`).
          // [§335, DEC-111] A badge whose 'row' is 'elec' is THE ELECTRONICS' badge (rules.json electronics.badges · objects.elecBadge): the same
          // format, drawn in the lane's electronics' row — the presentation view's layer.
          // [§355, DEC-126] A badge whose 'row' is 'method' is A METHOD'S badge (rules.json methods.badges · objects.methodBadge): in the mic's row,
          // objects.methodBadge.scale times the language badge. `slot` n = it stands n language badges (each with its gap) further from its
          // time than a badge with none — the method's badge with the badge of the section's material beside it.
          // [§360, DEC-132 — his '1b'] A badge whose 'row' is 'state' is A STATE SIGN (rules.json stateSigns.types · objects.stateSign): a small
          // picture-sign in the mic's row, its colour THE STATE'S OWN (objects.stateWedge.states.<state>.colour), its left edge on its time —
          // on a screen page kept whole inside the page. An electronics' badge may also be one of the LANGUAGE's types (the material a
          // computer player plays), at the electronics' badge's size.
          const elec = it.row === 'elec', meth = it.row === 'method', stt = it.row === 'state';
          const BG = elec ? E.elecBadge : stt ? E.stateSign : E.badge, LG = E.language, MO = E.micOpening, ER = E.elecReturn;
          const TB = elec ? (E.electronics && E.electronics.badges) : meth ? (E.methods && E.methods.badges) : stt ? (E.stateSigns && E.stateSigns.types) : (LG && LG.types);
          // [§399, DEC-167] a METHOD-row badge may be one of the LANGUAGE's types too: a section announced by its material's badge at the method
          // badge's size (the drones: the multiphonics badge 'same size as a three body problem')
          const ty = (TB && TB[it.type]) || ((elec || meth) && LG && LG.types && LG.types[it.type]) || null;
          const sttCol = stt && E.stateWedge && E.stateWedge.states && E.stateWedge.states[it.type] ? E.stateWedge.states[it.type].colour : null;
          // [decibel §411, DEC-181 — his "those edge cases, you can just let the badge bleed over … cut like the Matisse … I'd rather the full mic window
          // be seen"] edge 'cut' (set by the cutter on a section's badges): at a page's edge the badge is CUT LIKE PAPER — drawn where its ink
          // falls, on every page it crosses, inside the page's clip — and never pushed right onto its own mic opening
          const cutB = !!(SCR && it.edge === 'cut');
          if (!BG || !ty || !LG || (!cutB && !owns(it.t)) || (elec ? !ER : !MO) || (stt && !sttCol)) continue;
          const bs = BG.sizeSs * ssPx * (meth && E.methodBadge ? E.methodBadge.scale : 1), row = elec ? elecRow(ER) : micRow(MO), u = LG.format.viewUnits;
          // [decibel §394] dxSs: a badge 'at' its time that stands a small gap RIGHT of it (a trill's badge beside its go line — the layout's techBadge)
          // [decibel §395, DEC-163 — his "the gap between the go line and the left edge of the trill badge should be the same as the gap between
          // the top of the trill badge and … the lane divider"] dx 'topGap': the badge stands as far RIGHT of its time's line as its top stands
          // UNDER the divider above its lane — the row's standard gap plus the divider's own distance from the lane's top. One measure, two sides.
          const dxPx = it.dx === 'topGap' ? MO.gapSs * ssPx + laneHalfGapPx : (it.dxSs ? it.dxSs * ssPx : 0);
          // [§397, DEC-165] place 'after': the badge's LEFT edge the badge's gap after x(t) — a badge hand-placed to the right of its mic opening
          // (t = the opening's END), where 'before' would have put it on something else
          const offPx = it.place === 'at' ? 0 : it.place === 'after' ? BG.gapSs * ssPx : -(BG.gapSs * ssPx + bs);
          let bx = view.xOfSeconds(it.t) + dxPx + offPx - (it.slot ? it.slot * (BG.gapSs + BG.sizeSs) * ssPx : 0);
          // [§411, DEC-181 — his "move the badge to the right side of the mic opening … anywhere where the badge is overlaying the mic opening in
          // the left … keep the mic openings unoccluded. That's the window to play in"] avoid 'mic': a badge before its opening that would lie
          // over ANOTHER mic opening of the lane (the strike before, less than a badge away) stands AFTER its own opening instead — the
          // badge's gap right of the opening's end (tEnd)
          // (placed once a lane, in time order — avoidPlace, at the system's start: before its opening where that is free, else after it where
          // THAT is free, else not drawn — in a run of strikes closer than a badge, the neighbours' badges and the opening's own colour say it)
          if (avoidPlace.has(it)) { const xP = avoidPlace.get(it); if (xP == null) continue; bx = xP; }
          if (SCR && stt) bx = Math.min(bx, view.xOfSeconds(wInk) - bs);
          // [decibel RUNNING_LOG §397, DEC-165 — his "on the right edge, let's use clamping … badges have an … alternative position to the left of
          // the go line … the same gap … That'll be the default clamping for badges. So let's write that in"] THE BADGES' CLAMP AT A PAGE'S END
          // (page_rules.json edge.badge.screenEnd 'mirror'): a badge that stands AFTER its line — 'at' its time with a gap — and would run past the
          // frame takes its ALTERNATE place, BEFORE the line: its right edge the same gap before it. The line itself never moves.
          if (SCR && EDGE && EDGE.badge && EDGE.badge.screenEnd === 'mirror' && it.place === 'at' && dxPx > 0 && bx + bs > view.widthPx) bx = view.xOfSeconds(it.t) - dxPx - bs;
          if (SCR && !cutB) bx = Math.max(bx, view.xOfSeconds(w0));
          if (cutB && !(bx + bs > view.xOfSeconds(w0) && bx < view.xOfSeconds(w1))) continue;   // none of its ink on this page
          // [§365, DEC-134 · DEC-137] A STATE SIGN'S PLACE AND GROUND (objects.stateSign): `place` aboveWedge = its BOTTOM stands `gapSs` above
          // THE HIGHEST POINT OF THE LINE WEDGE — the top of the wedge's thickest state, so every sign of a lane stands at one height — and
          // not in the mic's row; `ground` = its square's own fill (colour 'state' = the state's colour) at its opacity, not the badges' ground.
          let by = row.yOf(bs);
          // [§399, DEC-167 — his "Let's center it vertically"] v 'middle': the badge stands about the LANE's middle (where a line wedge runs), not in the mic's row
          if (it.v === 'middle') by = (lane.yTopPx + lane.yBotPx - bs) / 2;
          // [decibel §406, DEC-175 — his "at the bottom of the lane with the appropriate gap from the bottom of the lane up to the bottom of the …
          // badge"] v 'bottom': the badge stands at the LANE's bottom, the standard gap (the mic row's own, mirrored) under it
          if (it.v === 'bottom') by = lane.yBotPx - MO.gapSs * ssPx - bs;
          const SWb = E.stateWedge;
          if (stt && BG.place === 'aboveWedge' && SWb && SWb.states) {
            const TENb = 10, maxPxB = (lane.yBotPx - lane.yTopPx) * SWb.maxFrac;   // the composer score's thickness scale
            const topTh = Object.keys(SWb.states).reduce((m, k) => { const th = SWb.states[k].thick; return Math.max(m, Array.isArray(th) ? Math.max(+th[0], +th[1]) : +th); }, 0);
            const cyB = SWb.place === 'laneTop' ? lane.yTopPx + maxPxB / 2 : SWb.place === 'laneBottom' ? lane.yBotPx - maxPxB / 2 : (lane.yTopPx + lane.yBotPx) / 2;
            by = cyB - (topTh / TENb) * maxPxB / 2 - BG.gapSs * ssPx - bs;
          }
          const gFill = stt && BG.ground ? (BG.ground.colour === 'state' ? sttCol : BG.ground.colour) : LG.format.ground;
          const gOp = stt && BG.ground && BG.ground.opacity != null ? '" fill-opacity="' + BG.ground.opacity : '';
          parts.push('<g class="badge badge-' + esc(it.type) + (stt ? ' state-sign' : '') + '" transform="translate(' + bx.toFixed(2) + ' ' + by.toFixed(2) + ') scale(' + (bs / u).toFixed(5) + ')">' +
            '<rect width="' + u + '" height="' + u + '" rx="' + LG.format.cornerUnits + '" fill="' + gFill + gOp + '"/>' + String(ty.sign).split('currentColor').join(stt ? sttCol : ty.colour) + '</g>');
        } else if (it.k === 'wedge') {
          // [decibel PLAN 2.6 — RUNNING_LOG §355; DEC-102 · DEC-126; rules.json objects.stateWedge → engraving.render.stateWedge] THE STATE WEDGE:
          // the composer score's own line wedge — a filled band about the lane's middle, its thickness 0 … 10 of `maxFrac` of the lane's
          // height — drawn ONCE a player through a whole section, one stretch after another with no gap: in a STATE its colour and its
          // thickness (a number, or [from, to] for a wedge inside the state); across a CHANGE a ramp from the state before's end to the
          // state after's start, in a gradient from the one colour to the other. A LONG kind, cut like paper at a page turn (on a tiled
          // screen page drawn whole inside the page's clip; elsewhere cut at the page's own span, its thickness read at the cut).
          // No row in the registry = no ink; a state with no row draws nothing.
          const SW = E.stateWedge;
          if (!SW || !SW.states || !crosses(it.t0, it.t1)) continue;
          // [§360, DEC-132 — his '2b'] row 'elec': A COMPUTER PLAYER's wedge — the same stretches and colours, small, in the lane's electronics'
          // row (inside its window): as tall at the most as objects.stateWedge.elec.rowFrac of that row, about the row's middle.
          const elecW = it.row === 'elec', rowE = elecW && E.elecReturn ? elecRow(E.elecReturn) : null;
          if (elecW && !rowE) continue;
          // [§370, DEC-141] its HEAD in the gutter (the bracket and the name, drawn with the system-start groups below — outside the page's clip)
          if (elecW && it.who && E.elecBracket) { const padW = E.elecWindow ? E.elecWindow.padSs * ssPx : 0; elecHeads.push({ who: it.who, yT: rowE.ry - padW, yB: rowE.ry + rowE.rh + padW, ss: ssPx }); }
          const whole = cutMark >= 0, TEN = 10;   // the composer score's thickness scale
          const maxPx = elecW ? rowE.rh * ((SW.elec && SW.elec.rowFrac) || 1) : (lane.yBotPx - lane.yTopPx) * SW.maxFrac;
          // [decibel §406, DEC-175 — his "center the line wedge vertically on the badge"] row 'badgeLow': THE PLAYER'S LINE — about the middle of a
          // badge that stands at the lane's BOTTOM (the standard gap under it): its own badge's height, whatever the line's thickness
          const lowW = it.row === 'badgeLow' && E.badge && E.micOpening;
          const cy = elecW ? rowE.ry + rowE.rh / 2 : lowW ? lane.yBotPx - E.micOpening.gapSs * ssPx - E.badge.sizeSs * ssPx / 2 : SW.place === 'laneTop' ? lane.yTopPx + maxPx / 2 : SW.place === 'laneBottom' ? lane.yBotPx - maxPx / 2 : (lane.yTopPx + lane.yBotPx) / 2;
          const halfOf = v => (v / TEN) * maxPx / 2;
          const endsOf = st => { const r = SW.states[st]; if (!r) return null; const th = Array.isArray(r.thick) ? r.thick : [r.thick, r.thick]; return { c: r.colour, a: +th[0], b: +th[1] }; };
          for (let si = 0; si < it.segs.length; si++) {
            const sg = it.segs[si];
            if (!crosses(sg.t0, sg.t1)) continue;
            let c0, c1, h0, h1;
            // [decibel RUNNING_LOG §399, DEC-167] A SECTION'S OWN LINE (the overlay's `line` → rules.json objects.stateWedge.lines.<name>.colour): a
            // stretch that carries its thickness itself — thick [from, to] on the composer score's 0 … 10 — in the line's one colour: his dictated
            // shape in time, not a method's states. Same place, same maxFrac, same cut at a page as the state wedge.
            const LN = it.line && SW.lines ? SW.lines[it.line] : null;
            if (Array.isArray(sg.thick)) {
              if (!LN) continue;
              c0 = c1 = LN.colour; h0 = +sg.thick[0]; h1 = +sg.thick[1];
            } else if (sg.state === 'change') {
              const A = endsOf(sg.from) || (si > 0 ? endsOf(it.segs[si - 1].state) : null), B = endsOf(sg.to) || (si + 1 < it.segs.length ? endsOf(it.segs[si + 1].state) : null);
              if (!A || !B) continue;
              c0 = A.c; c1 = B.c; h0 = A.b; h1 = B.a;
            } else { const S = endsOf(sg.state); if (!S) continue; c0 = c1 = S.c; h0 = S.a; h1 = S.b; }
            const ta = whole ? sg.t0 : Math.max(sg.t0, w0), tb = whole ? sg.t1 : Math.min(sg.t1, wInk);
            if (!(tb > ta)) continue;
            const at = t => h0 + (h1 - h0) * (t - sg.t0) / (sg.t1 - sg.t0), ha = halfOf(at(ta)), hb = halfOf(at(tb));
            // [decibel RUNNING_LOG §401, DEC-169] leadSs: a section's line BEGINS that far left of its first time — the room of the first mic
            // opening's own badge and its gaps — at its first thickness, so the eye meets the line before the section's first mark
            const lead = (it.leadSs > 0 && si === 0 && ta === sg.t0) ? it.leadSs * ssPx : 0;
            const xa = view.xOfSeconds(ta) - lead, xb = view.xOfSeconds(tb);
            let fill = c0;
            if (c0 !== c1) {   // the gradient is laid over the stretch's own span, cut or not; its id is this lane's, this stretch's, this page's
              const gid = 'swg-' + sysModel.part + (elecW ? 'e' : '') + '-' + Math.round(sg.t0 * 1000) + '-' + Math.round(w0 * 1000);
              parts.push('<defs><linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="' + view.xOfSeconds(sg.t0).toFixed(2) + '" y1="0" x2="' + view.xOfSeconds(sg.t1).toFixed(2) +
                '" y2="0"><stop offset="0" stop-color="' + c0 + '"/><stop offset="1" stop-color="' + c1 + '"/></linearGradient></defs>');
              fill = 'url(#' + gid + ')';
            }
            parts.push('<path class="state-wedge state-' + esc(sg.state) + '" d="M' + xa.toFixed(2) + ' ' + (cy - ha).toFixed(2) + 'L' + xb.toFixed(2) + ' ' + (cy - hb).toFixed(2) +
              'L' + xb.toFixed(2) + ' ' + (cy + hb).toFixed(2) + 'L' + xa.toFixed(2) + ' ' + (cy + ha).toFixed(2) + 'Z" fill="' + fill + '" fill-opacity="' + SW.fillOpacity + '"/>');
          }
        } else if (it.k === 'elecwin') {
          // [decibel PLAN 2.7 — RUNNING_LOG §336; DEC-112; rules.json objects.elecWindow → engraving.render.elecWindow] THE ELECTRONICS' WINDOW: a
          // see-through slate-grey pane over a lane's whole electronics' row for the stretch — the badge and the bricks lie ON it — that says
          // "these are the electronics": a plain rectangle (no corners), a pale fill, a stronger outline, and a very subtle grain (an SVG
          // fractal-noise filter, defined once a sheet, laid over the pane at grain.opacity; 0 = none). It reaches left to the badge before
          // the first brick when the overlay says so. A LONG kind, cut like paper at a page turn. No row in the registry = no ink.
          const EW = E.elecWindow, ER = E.elecReturn, BG = E.elecBadge;
          if (!EW || !ER || !crosses(it.t0, it.t1)) continue;
          const whole = cutMark >= 0, row = elecRow(ER), pad = EW.padSs * ssPx;
          const xa0 = view.xOfSeconds(it.t0) - (it.badgeLeft && BG ? (BG.gapSs + BG.sizeSs) * ssPx : 0) - pad, xb0 = view.xOfSeconds(it.t1) + pad;
          const xa = whole ? xa0 : Math.max(xa0, view.xOfSeconds(w0)), xb = whole ? xb0 : Math.min(xb0, view.xOfSeconds(wInk));
          const wy = row.ry - pad, wh = row.rh + 2 * pad, ww = Math.max(1, xb - xa);
          const G = EW.grain || {}, grain = G.opacity > 0;
          if (grain && !elecGrainDefined) {
            elecGrainDefined = true;
            parts.push('<defs><filter id="elecGrain" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="' + (G.freq || 0.9) + '" numOctaves="' + (G.octaves || 1) + '" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="saturate" values="0"/></filter></defs>');
          }
          parts.push('<rect class="elec-window" x="' + xa.toFixed(2) + '" y="' + wy.toFixed(2) + '" width="' + ww.toFixed(2) + '" height="' + wh.toFixed(2) +
            '" fill="' + EW.colour + '" fill-opacity="' + EW.fillOpacity + '" stroke="' + EW.colour + '" stroke-width="' + (EW.strokeSs * ssPx).toFixed(2) + '" stroke-opacity="' + EW.strokeOpacity + '"/>' +
            (grain ? '<rect class="elec-grain" x="' + xa.toFixed(2) + '" y="' + wy.toFixed(2) + '" width="' + ww.toFixed(2) + '" height="' + wh.toFixed(2) + '" filter="url(#elecGrain)" opacity="' + G.opacity + '"/>' : ''));
        } else if (it.k === 'elecret') {
          // [decibel PLAN 2.7 — RUNNING_LOG §335; DEC-111; rules.json objects.elecReturn → engraving.render.elecReturn] THE ELECTRONICS' RETURN, the
          // presentation view's hint: a brick over the region the engine answers in — the mic opening's own recipe (a rounded rectangle, a pale
          // fill, a solid outline) in the electronics' purple, in the lane's electronics' row; its LENGTH the region, its HEIGHT the number of
          // sounds it carries (perSoundFrac of the lane a sound, capped at capSounds — the whole bank is drawn at the cap). No sign on it. A
          // LONG kind, cut like paper at a page turn (edge class 'cut'). No row in the registry = no ink.
          const ER = E.elecReturn;
          if (!ER || !crosses(it.t0, it.t1)) continue;
          const whole = cutMark >= 0, row = elecRow(ER);
          const n = it.all ? ER.capSounds : Math.max(1, Math.min(it.count || 1, ER.capSounds));
          const h = Math.max(ER.minSs * ssPx, (lane.yBotPx - lane.yTopPx) * ER.perSoundFrac * n);
          const xa = view.xOfSeconds(whole ? it.t0 : Math.max(it.t0, w0)), xb = view.xOfSeconds(whole ? it.t1 : Math.min(it.t1, wInk));
          parts.push('<rect class="elec-return" x="' + xa.toFixed(2) + '" y="' + row.yOf(h).toFixed(2) + '" width="' + Math.max(1, xb - xa).toFixed(2) + '" height="' + h.toFixed(2) +
            '" rx="' + (ER.cornerSs * ssPx).toFixed(2) + '" fill="' + ER.colour + '" fill-opacity="' + ER.fillOpacity + '" stroke="' + ER.colour +
            '" stroke-width="' + (ER.strokeSs * ssPx).toFixed(2) + '" stroke-opacity="' + ER.strokeOpacity + '"/>');
        } else if (it.k === 'brick') {
          if (o.hideBricks) continue;   // day 22: the bricks toggle
          if (!crosses(it.t0, it.t1)) continue;
          const x0 = view.xOfSeconds(Math.max(it.t0, w0)), x1 = view.xOfSeconds(Math.min(it.t1, wInk));
          // native tooltip (day 22): hover a brick to see what it is; the
          // brick must opt back into pointer events — the sheet SVG is
          // otherwise passive and the anim overlay above is pointer-inert.
          const tip = it.tip ? '<title>' + esc(it.tip) + '</title>' : '';
          parts.push('<rect x="' + x0.toFixed(2) + '" y="' + (Y(it.ySs) - 0.5 * ssPx).toFixed(2) + '" width="' + Math.max(1, x1 - x0).toFixed(2) +
            '" height="' + (1 * ssPx).toFixed(2) + '" fill="' + o.brick + '" opacity="' + E.brickOpacity + '"' +
            (tip ? ' pointer-events="all">' + tip + '</rect>' : '/>'));
        }
        } finally {
          if (cutMark >= 0 && parts.length > cutMark) { parts.splice(cutMark, 0, clipOpen); parts.push('</g>'); }
        }
      }
      parts.push('</g>');
    }

    // [2a.1] THE SYSTEM-START GROUPS (D10: winds bracket · piano brace ·
    // strings bracket), in the gutter left of the clefs. LilyPond's own
    // glyphs: a bracket is a thick line from the first staff's top line to
    // the last staff's bottom line, a brackettip at each end; the brace is
    // the emmentaler-brace glyph nearest the span, scaled the last few
    // percent to fit it exactly. Geometry: engraving.render.systemStart.
    if (ENS && ENS.groups && view.gutterPx > 0) {
      const SS = Object.assign({ bracketThickSs: 0.45, gapSs: 0.5, braceGapSs: 0.3 }, E.systemStart || {});
      const keysOf = p => {
        const pc = ENS.parts.find(q => q.part === p);
        const n = (pc && pc.staves && pc.staves.length) || 1;
        return n > 1 ? [p + ':0', p + ':' + (n - 1)] : [p, p];
      };
      // the clef column: its left edge is the widest clef's, so every group
      // sits clear of every clef whatever the parts
      const clefW = Math.max(...Object.keys(CLEF_AT).map(k => (glyphs.clef[k] || { wSs: 0 }).wSs));
      for (const g of ENS.groups) {
        let top, bot;
        try { top = view.system(keysOf(g.parts[0])[0]); bot = view.system(keysOf(g.parts[g.parts.length - 1])[1]); }
        catch (e) { continue; }   // a group whose parts are not all in this view
        const ss = top.ssPx;
        const kT = keysOf(g.parts[0])[0], kB = keysOf(g.parts[g.parts.length - 1])[1];
        const yT = top.yOfSs(Math.max(...linesOf(modelByKey.get(kT)))), yB = bot.yOfSs(Math.min(...linesOf(modelByKey.get(kB))));   // [2a] a lined staff's outer lines
        const clefLeft = MX0 - (clefW + E.clefGutterGapSs) * ss;
        const tipW = ((glyphs.bracketTip && glyphs.bracketTip.up) || { wSs: 0 }).wSs;
        const xL = clefLeft - (SS.gapSs + tipW) * ss;       // the bracket line's left edge
        const cls = ' class="sysgrp sysgrp-' + g.kind + '"';
        if (g.kind === 'bracket') {
          const th = SS.bracketThickSs * ss;
          parts.push('<g' + cls + ' fill="' + o.ink + '">');
          parts.push('<rect x="' + xL.toFixed(2) + '" y="' + yT.toFixed(2) + '" width="' + th.toFixed(2) + '" height="' + (yB - yT).toFixed(2) + '"/>');
          if (glyphs.bracketTip) {
            parts.push(Stamps.toSvg(S.bracketTip('up'), { xPx: xL, yPx: yT, ssPx: ss, align: 'origin' }));
            parts.push(Stamps.toSvg(S.bracketTip('down'), { xPx: xL, yPx: yB, ssPx: ss, align: 'origin' }));
          }
          parts.push('</g>');
        } else if (g.kind === 'brace' && glyphs.brace) {
          const spanSs = (yB - yT) / ss;
          const keys = Object.keys(glyphs.brace).filter(k => k[0] !== '_');
          const key = keys.reduce((a, b) => Math.abs(glyphs.brace[b].hSs - spanSs) < Math.abs(glyphs.brace[a].hSs - spanSs) ? b : a);
          const bg = glyphs.brace[key], k = spanSs / bg.hSs;
          // right edge a small gap left of the clef column, like the
          // bracket's tips
          const xR = clefLeft - SS.braceGapSs * ss;
          parts.push('<g' + cls + ' fill="' + o.ink + '">' +
            Stamps.toSvg(Stamps.scaled(S.brace(key), k, k), { xPx: xR - bg.wSs * k * ss, yPx: yT, ssPx: ss, align: 'topLeft' }) + '</g>');
        }
      }
    }

    // [decibel PLAN 2.7 — RUNNING_LOG §370; DEC-141; rules.json objects.elecBracket · electronics.players] A COMPUTER PLAYER'S HEAD (his words:
    // 'a small bracket at the left edge of the page alongside the other brackets. Just the height of the electronics … like if it was
    // another staff … ELEC1 … ELEC2 … ELEC3', per page 'like the current headers'): the system bracket's own line and tips, as tall as
    // that player's electronics' window, at the other brackets' x; its name where the part labels stand, in their face, centred on the
    // window. On every page the player's wedge crosses. No row in the registry = no ink.
    if (E.elecBracket && elecHeads.length && view.gutterPx > 0) {
      const SS = Object.assign({ bracketThickSs: 0.45, gapSs: 0.5 }, E.systemStart || {}), EB = E.elecBracket;
      const clefW = Math.max(...Object.keys(CLEF_AT).map(k => (glyphs.clef[k] || { wSs: 0 }).wSs));
      const tipW = ((glyphs.bracketTip && glyphs.bracketTip.up) || { wSs: 0 }).wSs;
      const names = (E.electronics && E.electronics.players) || {};
      for (const h of elecHeads) {
        const ss = h.ss, xL = MX0 - (clefW + E.clefGutterGapSs) * ss - (SS.gapSs + tipW) * ss, th = (EB.thickSs != null ? EB.thickSs : SS.bracketThickSs) * ss;
        parts.push('<g class="sysgrp sysgrp-elec" fill="' + o.ink + '">');
        parts.push('<rect x="' + xL.toFixed(2) + '" y="' + h.yT.toFixed(2) + '" width="' + th.toFixed(2) + '" height="' + (h.yB - h.yT).toFixed(2) + '"/>');
        if (EB.tips !== false && glyphs.bracketTip) {
          parts.push(Stamps.toSvg(S.bracketTip('up'), { xPx: xL, yPx: h.yT, ssPx: ss, align: 'origin' }));
          parts.push(Stamps.toSvg(S.bracketTip('down'), { xPx: xL, yPx: h.yB, ssPx: ss, align: 'origin' }));
        }
        parts.push('</g>');
        const lab = names[h.who] && names[h.who].label;
        if (lab) {
          const sz = E.partLabel.sizeSs * (EB.labelScale || 1) * ss, below = (E.partLabel.baselineBelowEm != null ? E.partLabel.baselineBelowEm : 0.32) * sz;
          parts.push('<text class="elec-name" x="' + (ML + E.partLabel.xPx) + '" y="' + ((h.yT + h.yB) / 2 + below).toFixed(1) + '" font-size="' + sz.toFixed(1) + '"' + fontAttr + ' fill="' + o.muted + '">' + esc(lab) + '</text>');
        }
      }
    }

    // read-through marker labels along the top (S1, not IR — passed in opts)
    for (const mk of ((model && model.hideMarkers) ? [] : ((opts && opts.markers) || []))) {
      if (!owns(mk.time)) continue;
      parts.push('<text x="' + view.xOfSeconds(mk.time).toFixed(1) + '" y="12" font-size="10" font-family="sans-serif" fill="' + o.muted + '">' + esc(mk.label) + '</text>');
    }
    parts.push('</svg>');
    return parts.join('\n');
  }

  // [PLAN 2b.7.5] THE CENSUS, stated where the gates are. A POINT kind is drawn
  // once, on the page that owns its `t`; a LONG kind is drawn on every page it
  // crosses and clipped to the drawn span; FURNITURE is neither (it belongs to
  // the page, not to the music). check_print_edges reads these rather than
  // keeping a second list that could quietly disagree with the loop above.
  const POINT_KINDS = ['glyph', 'rest', 'stem', 'dot', 'ledger', 'beam', 'text', 'attackline', 'tick',
    'barline', 'tempotext', 'glissline', 'niente', 'dynarrow', 'hairpin', 'ottava', 'lvslur', 'goline', 'gc', 'slash', 'squiggle', 'badge', 'finalbar'];   // [§550] the grace's stroke · [§557] the uneven group's
  const LONG_KINDS = ['envcurve', 'cresccurve', 'glisscurve', 'ringbar', 'brick', 'hairpin-timed', 'slur', 'mic', 'elecret', 'elecwin', 'wedge', 'sinebox'];   // [§335] the electronics' return brick spans its region · [§336] the window spans the lane's stretch   // [2g.4] the timed hairpin spans time · [§555] the slur spans its notes
  const FURNITURE_KINDS = ['staff', 'clef'];
  // 'tuplet' is neither: it has no window gate at all, because a tuplet bracket
  // belongs to a beam group and the splicer is stamp-atomic — no cut severs a
  // beam (measured 0 of 63 on this score), so a bracket never crosses a cut.

  return { renderSection, POINT_KINDS, LONG_KINDS, FURNITURE_KINDS, inkSpanSs, gcPrePost };
});
