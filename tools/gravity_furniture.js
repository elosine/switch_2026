// gravity_furniture.js — what the gravity PROTOTYPE draws over its staff (SW-83; the Switch~ piece RUNNING_LOG §273 · §276), as SVG for the
// notation workshop's page AND its film (one drawing, so they agree):
//   1. THE GC ARC — the lineage's own curve (notation/lib/gc.js) from the arc's first note through the impact to its last, the ring at the impact.
//   2. THE FLOW ("like a star chart … a visual sketch … an at a glance sense of busyness or density", his words): in a strip of its own under
//      the staff, a curve of how busy the hand is (each played note a bump as wide as flow.sigmaS, as tall as its loudness, summed), and a DOT
//      on the curve at each played event — two notes together a bigger dot. Up and down here is NOT pitch.
//   3. THE SHAPES — the hand's position as a vertical chord ON THE STAFF in a thin tight box, with accidentals: the pitches of one side of the
//      impact. A second shape only where the hand's set really changes (shapeRule.changeMin pitches added or dropped); else its new pitches
//      join the first. Built by the standing chord rules: the column (a head a step or less from one in its column moves over — piece 2's
//      column, then the third column of §260), the accidentals packed by chord_column.js's accidentalColumn, LilyPond's glyphs.
//      A FOURTH column (five chromatic notes inside a third need it) has NO RULE YET — it is taken provisionally and flagged in the result.
'use strict';
module.exports = function furniture(o) {
  const { proto: P, ir, glyphs, ChordColumn, Gc, xOf, staff, w, preset, look, gaps } = o;
  const out = [], flags = [], r1 = x => (+x).toFixed(1), r3 = x => (+x).toFixed(3);
  const ss = (staff[1] - staff[0]) / 4, mid = (staff[0] + staff[1]) / 2;
  const band = P.band, A = P.arc, F = Object.assign({ heightPx: 46, sigmaS: 0.12 }, P.flow || {}), pad = 10, yBot = band[0] + band[1];
  const INK = '#111';
  const byId = new Map(ir.events.map(e => [e.id.replace(/^ev-/, ''), e]));
  const pick = ids => (ids || []).map(id => byId.get(id)).filter(Boolean).map(e => ({ t: e.onset, v: e.vel != null ? e.vel : 64, sp: e.pitch.spelled, midi: e.pitch.midi }));
  const notes = pick([].concat(P.in || [], P.impact || [], P.out || [])).sort((a, b) => a.t - b.t);

  // the strip's ground: white over whatever part stands below the piano
  out.push('<rect x="0" y="' + yBot + '" width="' + w + '" height="' + (F.heightPx + pad) + '" fill="#fff"/>');

  // 1 · the GC arc
  const GP = Gc.params(Object.assign({}, preset, { duration: A.t1 - A.t0, descentRatio: 100 * (A.bounce - A.t0) / (A.t1 - A.t0) }));
  const imp = yBot - 8, apex = band[0] + 8, gy = s => imp - Gc.heightFrac(GP, s - A.bounce) * (imp - apex);
  { const pts = []; for (let i = 0; i <= 200; i++) { const s = A.t0 + (A.t1 - A.t0) * i / 200; pts.push(r1(xOf(s)) + ',' + r1(gy(s))); }
    out.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + look.color + '" stroke-width="' + look.arcStrokePx + '"/>');
    out.push('<circle cx="' + r1(xOf(A.bounce)) + '" cy="' + r1(imp) + '" r="' + look.impactRadiusPx + '" fill="none" stroke="' + look.color + '" stroke-width="' + look.arcStrokePx + '"/>'); }

  // 2 · the flow
  if (notes.length) {
    const I = s => notes.reduce((a, n) => a + n.v * Math.exp(-0.5 * Math.pow((s - n.t) / F.sigmaS, 2)), 0);
    const N = 160, S = []; let mx = 0;
    for (let i = 0; i <= N; i++) { const s = A.t0 + (A.t1 - A.t0) * i / N, v = I(s); S.push([s, v]); if (v > mx) mx = v; }
    const base = yBot + pad / 2 + F.heightPx - 3, top = yBot + pad / 2 + 3, fy = v => base - (mx > 0 ? v / mx : 0) * (base - top);
    out.push('<line x1="' + r1(xOf(A.t0)) + '" y1="' + r1(base) + '" x2="' + r1(xOf(A.t1)) + '" y2="' + r1(base) + '" stroke="#bbb" stroke-width="0.5"/>');
    out.push('<polyline points="' + S.map(p => r1(xOf(p[0])) + ',' + r1(fy(p[1]))).join(' ') + '" fill="none" stroke="' + INK + '" stroke-width="0.8"/>');
    const ev = []; for (const n of notes) { const x = ev[ev.length - 1]; if (x && n.t - x.t1 < 0.05) { x.n++; x.t1 = n.t; x.ts.push(n.t); } else ev.push({ t1: n.t, n: 1, ts: [n.t] }); }
    for (const e of ev) { const s = e.ts.reduce((a, b) => a + b, 0) / e.ts.length; out.push('<circle cx="' + r1(xOf(s)) + '" cy="' + r1(fy(I(s))) + '" r="' + (1.7 + 0.9 * (e.n - 1)).toFixed(1) + '" fill="' + INK + '"/>'); }
  }

  // 3 · the shapes
  const LET = 'CDEFGAB', NH = glyphs.notehead.filled, W = NH.wSs, HH = NH.hSs, lf = (glyphs.standards.ledgerLine && glyphs.standards.ledgerLine.lengthFraction) || 0.25, lt = (glyphs.standards.ledgerLine && glyphs.standards.ledgerLine.thickness) || 0.1;
  const setOf = list => [...new Map(list.map(n => [n.midi, n])).values()].sort((a, b) => a.midi - b.midi);
  const sideIn = setOf(pick(P.in)), sideOut = setOf(pick([].concat(P.impact || [], P.out || [])));
  const R = Object.assign({ changeMin: 3 }, P.shapeRule || {});
  const diff = sideOut.filter(n => !sideIn.some(m => m.midi === n.midi)).length + sideIn.filter(n => !sideOut.some(m => m.midi === n.midi)).length;
  const shapes = !sideIn.length ? [{ at: A.t0, set: sideOut }] : (sideOut.length && diff >= R.changeMin) ? [{ at: A.t0, set: sideIn }, { at: A.bounce, set: sideOut }] : [{ at: A.t0, set: setOf(sideIn.concat(sideOut)) }];
  for (const sh of shapes) {
    // [§277 — his "lets write clusters as a bar with noteheads on top and bottom the actual top note and bottom note of the cluster, including
    // accidentals"] THE CLUSTER BAR: a shape of clusterMinNotes or more pitches with no gap wider than clusterMaxGap semitones is written as
    // its LOWEST and HIGHEST note with a bar between them. The bar is piece 2's cluster bar (NOTATION_SYSTEM_PLAN §17e.1, makeClusterBarGlyph:
    // a filled rectangle over the cluster's span) — there one head wide and WITHOUT heads; with the two heads shown it is narrower
    // (clusterBarW of a head's width, the AI's number, his to move) and runs from head center to head center.
    const gapsOk = sh.set.every((n, i) => !i || n.midi - sh.set[i - 1].midi <= (R.clusterMaxGap != null ? R.clusterMaxGap : 2));
    sh.cluster = sh.set.length >= (R.clusterMinNotes != null ? R.clusterMinNotes : 4) && gapsOk;
    const drawn = sh.cluster ? [sh.set[0], sh.set[sh.set.length - 1]] : sh.set;
    const m = drawn.map(n => ({ sp: n.sp, y: (n.sp.octave * 7 + LET.indexOf(n.sp.step) - 34) * 0.5 }));   // staff spaces above the middle line, treble (B4 = 0)
    const placed = [];
    for (const x of m.slice().sort((a, b) => a.y - b.y || (a.sp.alter || 0) - (b.sp.alter || 0))) {
      const free = c => !placed.some(p => Math.abs(p.dx - c) < 1e-9 && Math.abs(p.y - x.y) <= 0.5 + 1e-9);
      x.dx = [0, W, -W, 2 * W].find(free); if (x.dx == null) x.dx = 3 * W;
      if (x.dx >= 2 * W - 1e-9) flags.push('a fourth column at ' + sh.at + ' s (no rule yet)');
      placed.push(x);
    }
    const accKey = x => x.sp.alter === 1 ? 'sharp' : x.sp.alter === -1 ? 'flat' : x.sp.alter ? null : (!sh.cluster && m.some(y => y !== x && y.sp.step === x.sp.step && y.sp.octave === x.sp.octave && y.sp.alter) ? 'natural' : null);
    const led = [];
    const low = m.filter(x => x.y <= -3), high = m.filter(x => x.y >= 3);
    for (let L = -3; low.length && L >= Math.ceil(Math.min(...low.map(x => x.y)) - 1e-9); L--) { const on = low.filter(x => x.y <= L + 1e-9); if (on.length) led.push({ y: L, x0: Math.min(...on.map(x => x.dx)) - W * lf, x1: Math.max(...on.map(x => x.dx)) + W + W * lf }); }
    for (let L = 3; high.length && L <= Math.floor(Math.max(...high.map(x => x.y)) + 1e-9); L++) { const on = high.filter(x => x.y >= L - 1e-9); if (on.length) led.push({ y: L, x0: Math.min(...on.map(x => x.dx)) - W * lf, x1: Math.max(...on.map(x => x.dx)) + W + W * lf }); }
    const withAcc = m.filter(x => accKey(x) && glyphs.accidental[accKey(x)]);
    const accs = withAcc.map(x => { const a = glyphs.accidental[accKey(x)], nY = a.anchors && a.anchors.noteY, tp = nY ? nY.y : a.hSs / 2; return { w: a.wSs, topExt: tp, botExt: a.hSs - tp, ySs: x.y, a, tp }; });
    const packed = ChordColumn.accidentalColumn(accs, m.map(x => ({ xLeft: x.dx, ySs: x.y, hSs: HH })), led.map(l => ({ ySs: l.y, xLeft: l.x0 })), { gapToNotehead: gaps.toHead, minLateralGap: gaps.between, yTol: 0.05 });
    // the ink's extent, in staff spaces
    const xs0 = Math.min(...m.map(x => x.dx), ...packed.map(p => p.leftEdge), ...led.map(l => l.x0)), xs1 = Math.max(...m.map(x => x.dx + W), ...led.map(l => l.x1));
    const ys1 = Math.max(...m.map(x => x.y + HH / 2), ...accs.map(a => a.ySs + a.topExt)), ys0 = Math.min(...m.map(x => x.y - HH / 2), ...accs.map(a => a.ySs - a.botExt));
    const bp = 0.3, X0 = xOf(sh.at) - (0.6 + bp + xs1) * ss, px = x => X0 + x * ss, py = y => mid - y * ss;   // the box ends 0.6 ss before its moment
    const g = [];
    g.push('<rect x="' + r1(px(xs0 - bp)) + '" y="' + r1(py(ys1 + bp)) + '" width="' + r1((xs1 - xs0 + 2 * bp) * ss) + '" height="' + r1((ys1 - ys0 + 2 * bp) * ss) + '" fill="#fff" fill-opacity="0.88" stroke="none"/>');
    for (const l of led) g.push('<rect x="' + r1(px(l.x0)) + '" y="' + r1(py(l.y) - lt * ss / 2) + '" width="' + r1((l.x1 - l.x0) * ss) + '" height="' + (lt * ss).toFixed(2) + '"/>');
    if (sh.cluster && m.length === 2) { const bw = W * (R.clusterBarW != null ? R.clusterBarW : 0.5), cx = m[0].dx + W / 2;
      g.push('<rect x="' + r1(px(cx - bw / 2)) + '" y="' + r1(py(m[1].y)) + '" width="' + r1(bw * ss) + '" height="' + r1((m[1].y - m[0].y) * ss) + '"/>'); }
    for (const x of m) g.push('<g transform="translate(' + r3(px(x.dx)) + ' ' + r3(py(x.y) - NH.anchors.center.y * ss) + ') scale(' + ss.toFixed(5) + ')"><path d="' + NH.path + '"/></g>');
    withAcc.forEach((x, i) => g.push('<g transform="translate(' + r3(px(packed[i].leftEdge)) + ' ' + r3(py(x.y) - accs[i].tp * ss) + ') scale(' + ss.toFixed(5) + ')"><path d="' + accs[i].a.path + '"/></g>'));
    g.push('<rect x="' + r1(px(xs0 - bp)) + '" y="' + r1(py(ys1 + bp)) + '" width="' + r1((xs1 - xs0 + 2 * bp) * ss) + '" height="' + r1((ys1 - ys0 + 2 * bp) * ss) + '" fill="none" stroke="' + INK + '" stroke-width="0.7"/>');
    out.push('<g fill="' + INK + '">' + g.join('') + '</g>');
    sh.pitches = sh.set.map(n => n.sp.step + (n.sp.alter === 1 ? '#' : n.sp.alter === -1 ? 'b' : '') + n.sp.octave);
  }
  return { svg: out.join(''), extraH: F.heightPx + pad, shapes: shapes.map(s => ({ at: s.at, pitches: s.pitches })), flags };
};
