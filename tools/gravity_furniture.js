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
  const band = P.arcBand || P.band, A = P.arc,   /* [§291] the arc's own lane (the hand's staff), when the picture shows more than that */ F = Object.assign({ heightPx: 46, sigmaS: 0.12 }, P.flow || {}), pad = 10, yBot = band[0] + band[1];
  const INK = '#111';
  const byId = new Map(ir.events.map(e => [e.id.replace(/^ev-/, ''), e]));
  const pick = ids => (ids || []).map(id => byId.get(id)).filter(Boolean).map(e => ({ t: e.onset, v: e.vel != null ? e.vel : 64, sp: e.pitch.spelled, midi: e.pitch.midi }));
  const notes = pick([].concat(P.in || [], P.impact || [], P.out || [])).sort((a, b) => a.t - b.t);

  // [§282] HOW THE INNER MOVEMENT IS DRAWN — flow.style (his "yes lets try the ribbon and then can I see a stroboscopic version"):
  //   'ribbon'  the arc itself is a RIBBON, its width the hand's busyness (the flow map's way: one path, its width a second quantity)
  //   'strobe'  the arc a thin line with a TICK across it at each played event (the stroboscopic picture's way: where they crowd, it is busy)
  //   'strip'   §279's filled curve in a strip of its own under the staff (set aside: two drawings read as two instructions, §281)
  const style = F.style || 'ribbon', strip = style === 'strip';
  if (strip) out.push('<rect x="0" y="' + yBot + '" width="' + w + '" height="' + (F.heightPx + pad) + '" fill="#fff"/>');

  // the busyness: each played note a bell sigmaS wide and as tall as its loudness, summed; stretched between its own low and high over the
  // arc and raised to flow.power (the exaggeration) — 0 … 1
  const I = s => notes.reduce((acc, n) => acc + n.v * Math.exp(-0.5 * Math.pow((s - n.t) / F.sigmaS, 2)), 0);
  const N = 200, S = []; let mx = 0, mn = Infinity;
  for (let i = 0; i <= N; i++) { const s = A.t0 + (A.t1 - A.t0) * i / N, v = notes.length ? I(s) : 0; S.push([s, v]); if (v > mx) mx = v; if (v < mn) mn = v; }
  // [§311] normSpan: the low and high of the busyness are taken over a LONGER span than this arc (a multi-bounce ribbon's whole length), so
  // its several arcs share one scale of width
  if (P.normSpan && notes.length) { mx = 0; mn = Infinity; for (let i = 0; i <= 400; i++) { const v = I(P.normSpan[0] + (P.normSpan[1] - P.normSpan[0]) * i / 400); if (v > mx) mx = v; if (v < mn) mn = v; } }
  const pw = F.power != null ? F.power : 1.6, ex = v => Math.pow(mx > mn ? Math.max(0, (v - mn) / (mx - mn)) : 0, pw);

  // 1 · the GC arc (notation/lib/gc.js's own curve), as a line or as a ribbon
  const GP = Gc.params(Object.assign({}, preset, { duration: A.t1 - A.t0, descentRatio: 100 * (A.bounce - A.t0) / (A.t1 - A.t0) }));
  // [§283 — his "can you fix my view so I can see more of the top of the image"] the arc keeps clear of the picture's edges by the ribbon's own
  // half width; and what stands under the piano (coverFrom down) is covered in white, so the picture may run lower than the piano's lane
  if (P.coverFrom != null && !strip && yBot > P.coverFrom) out.push('<rect x="0" y="' + P.coverFrom + '" width="' + w + '" height="' + (yBot - P.coverFrom) + '" fill="#fff"/>');
  const RW = style === 'ribbon' ? (F.ribbonMaxPx != null ? F.ribbonMaxPx : 13) : 0;
  const imp = yBot - 6 - Math.max(look.impactRadiusPx, RW / 2), apex = band[0] + 6 + RW / 2, gy = s => imp - Gc.heightFrac(GP, s - A.bounce) * (imp - apex);
  const P2 = S.map(p => ({ s: p[0], x: xOf(p[0]), y: gy(p[0]), e: ex(p[1]) }));
  // [§296 — HIS WORD: the playing is "just kind of a guideline"; the ribbon has "its own dynamic"] A DESIGNED PROFILE (flow.profile) replaces the
  // measured busyness: on the FALL the width follows the DROP itself — a hair while the arc is almost level, growing all the way down
  // (in: "depth", raised to inPower); on the REBOUND it runs through the keyframes `out` — [how far up the rebound 0 … 1, width 0 … 1] —
  // eased between them. Width 1 = the ribbon's greatest.
  if (F.profile) {
    const PR = F.profile, kf = (PR.out || [[0, 1], [1, 0]]).slice().sort((p, q) => p[0] - q[0]);
    const outAt = u => { if (u <= kf[0][0]) return kf[0][1]; for (let i = 1; i < kf.length; i++) if (u <= kf[i][0]) { const a2 = kf[i - 1], b2 = kf[i], v = (u - a2[0]) / ((b2[0] - a2[0]) || 1), c = (1 - Math.cos(Math.PI * v)) / 2; return a2[1] + (b2[1] - a2[1]) * c; } return kf[kf.length - 1][1]; };
    for (const p of P2) p.e = p.s <= A.bounce ? Math.pow(Math.max(0, 1 - Gc.heightFrac(GP, p.s - A.bounce)), PR.inPower != null ? PR.inPower : 1) : outAt((p.s - A.bounce) / ((A.t1 - A.bounce) || 1));
  }
  const normalAt = i => { const p = P2[Math.max(0, i - 1)], q = P2[Math.min(P2.length - 1, i + 1)], dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1; return { nx: -dy / L, ny: dx / L }; };
  if (style === 'ribbon') {
    // the fall and the rebound are two ribbons that meet at the impact (the corner there is the arc's own)
    const wMin = F.ribbonMinPx != null ? F.ribbonMinPx : look.arcStrokePx, wMax = F.ribbonMaxPx != null ? F.ribbonMaxPx : 13;
    const ib = P2.reduce((best, p, i) => Math.abs(p.s - A.bounce) < Math.abs(P2[best].s - A.bounce) ? i : best, 0);
    for (const [i0, i1] of [[0, ib], [ib, P2.length - 1]]) {
      if (i1 <= i0) continue;
      const L = [], Rr = [];
      for (let i = i0; i <= i1; i++) {
        const p = P2[i], a2 = P2[Math.max(i0, i - 1)], b2 = P2[Math.min(i1, i + 1)], dx = b2.x - a2.x, dy = b2.y - a2.y, len = Math.hypot(dx, dy) || 1, h = (wMin + (wMax - wMin) * p.e) / 2;
        L.push(r1(p.x - dy / len * h) + ',' + r1(p.y + dx / len * h)); Rr.push(r1(p.x + dy / len * h) + ',' + r1(p.y - dx / len * h));
      }
      out.push('<polygon points="' + L.concat(Rr.reverse()).join(' ') + '" fill="' + look.color + '" stroke="none"/>');
    }
  } else out.push('<polyline points="' + P2.map(p => r1(p.x) + ',' + r1(p.y)).join(' ') + '" fill="none" stroke="' + look.color + '" stroke-width="' + look.arcStrokePx + '"/>');
  out.push('<circle cx="' + r1(xOf(A.bounce)) + '" cy="' + r1(imp) + '" r="' + look.impactRadiusPx + '" fill="' + (style === 'ribbon' ? '#fff' : 'none') + '" stroke="' + look.color + '" stroke-width="' + look.arcStrokePx + '"/>');

  // 2 · the inner movement's other two forms
  if (style === 'strobe') {
    // one tick per played event (notes within 50 ms are one event; two or more together a heavier tick), ACROSS the arc at its own moment
    const ev = []; for (const n of notes) { const x = ev[ev.length - 1]; if (x && n.t - x.t1 < 0.05) { x.n++; x.t1 = n.t; x.ts.push(n.t); } else ev.push({ t1: n.t, n: 1, ts: [n.t] }); }
    const half = (F.tickPx != null ? F.tickPx : 11) / 2;
    for (const e of ev) {
      const s = e.ts.reduce((p, q) => p + q, 0) / e.ts.length, i = Math.max(0, Math.min(N, Math.round((s - A.t0) / (A.t1 - A.t0) * N))), nn = normalAt(i), x = xOf(s), y = gy(s);
      out.push('<line x1="' + r1(x - nn.nx * half) + '" y1="' + r1(y - nn.ny * half) + '" x2="' + r1(x + nn.nx * half) + '" y2="' + r1(y + nn.ny * half) + '" stroke="' + look.color + '" stroke-width="' + (e.n > 1 ? 2.2 : 1.2) + '" stroke-linecap="round"/>');
    }
  } else if (strip && notes.length) {
    const base = yBot + pad / 2 + F.heightPx - 3, top = yBot + pad / 2 + 3, fl = F.floor != null ? F.floor : 0.06, ey = v => base - (fl + (1 - fl) * ex(v)) * (base - top);
    out.push('<polygon points="' + r1(xOf(A.t0)) + ',' + r1(base) + ' ' + S.map(p => r1(xOf(p[0])) + ',' + r1(ey(p[1]))).join(' ') + ' ' + r1(xOf(A.t1)) + ',' + r1(base) + '" fill="' + (F.fill || '#2b2b2b') + '" stroke="none"/>');
  }

  // 3 · the shapes
  const LET = 'CDEFGAB', NH = glyphs.notehead.filled, W = NH.wSs, HH = NH.hSs, lf = (glyphs.standards.ledgerLine && glyphs.standards.ledgerLine.lengthFraction) || 0.25, lt = (glyphs.standards.ledgerLine && glyphs.standards.ledgerLine.thickness) || 0.1;
  const setOf = list => [...new Map(list.map(n => [n.midi, n])).values()].sort((a, b) => a.midi - b.midi);
  // [§279 — his "lets try to avoid chord changes near the impact so you can move the 2nd to a point on the up arc"] the impact's own notes belong to
  // the FIRST shape; the second is the notes AFTER the impact and stands on the rising arc, its box BEGINNING afterImpact of the way up
  const sideIn = setOf(pick([].concat(P.in || [], P.impact || []))), sideOut = setOf(pick(P.out));
  const R = Object.assign({ changeMin: 3 }, P.shapeRule || {});
  const diff = sideOut.filter(n => !sideIn.some(m => m.midi === n.midi)).length + sideIn.filter(n => !sideOut.some(m => m.midi === n.midi)).length;
  const shapes = P.noShapes ? [] : !sideIn.length ? [{ at: A.t0, set: sideOut }] : (sideOut.length && diff >= R.changeMin) ? [{ at: A.t0, set: sideIn, from: true }, { at: A.bounce + (R.afterImpact != null ? R.afterImpact : 0.3) * (A.t1 - A.bounce), set: sideOut, from: true }] : [{ at: A.t0, set: setOf(sideIn.concat(sideOut)) }];
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
    // [§280 — his "keep the chord boxes in the gc horizontal so the shape box is drawn after the start of the gc arc and ends before the end of gc arc"]
    // a box BEGINS at its moment and is held inside the arc's span: never left of the arc's first note, never right of its last (inset from each)
    const bp = 0.3, ins = (R.insetSs != null ? R.insetSs : 0.3) * ss, lo = xOf(A.t0) + ins + (bp - xs0) * ss, hi = xOf(A.t1) - ins - (xs1 + bp) * ss;
    const X0 = sh.from ? Math.max(lo, Math.min(hi, xOf(sh.at) + ins + (bp - xs0) * ss)) : xOf(sh.at) - (0.6 + bp + xs1) * ss, px = x => X0 + x * ss, py = y => mid - y * ss;   // the box ends 0.6 ss before its moment
    const g = [];
    // [§296] no ground under a shape: a border only, the staff lines through it (his word)
    for (const l of led) g.push('<rect x="' + r1(px(l.x0)) + '" y="' + r1(py(l.y) - lt * ss / 2) + '" width="' + r1((l.x1 - l.x0) * ss) + '" height="' + (lt * ss).toFixed(2) + '"/>');
    if (sh.cluster && m.length === 2) { const bw = W * (R.clusterBarW != null ? R.clusterBarW : 0.5), cx = m[0].dx + W / 2;
      g.push('<rect x="' + r1(px(cx - bw / 2)) + '" y="' + r1(py(m[1].y)) + '" width="' + r1(bw * ss) + '" height="' + r1((m[1].y - m[0].y) * ss) + '"/>'); }
    for (const x of m) g.push('<g transform="translate(' + r3(px(x.dx)) + ' ' + r3(py(x.y) - NH.anchors.center.y * ss) + ') scale(' + ss.toFixed(5) + ')"><path d="' + NH.path + '"/></g>');
    withAcc.forEach((x, i) => g.push('<g transform="translate(' + r3(px(packed[i].leftEdge)) + ' ' + r3(py(x.y) - accs[i].tp * ss) + ') scale(' + ss.toFixed(5) + ')"><path d="' + accs[i].a.path + '"/></g>'));
    g.push('<rect x="' + r1(px(xs0 - bp)) + '" y="' + r1(py(ys1 + bp)) + '" width="' + r1((xs1 - xs0 + 2 * bp) * ss) + '" height="' + r1((ys1 - ys0 + 2 * bp) * ss) + '" fill="none" stroke="' + INK + '" stroke-width="0.7"/>');
    out.push('<g fill="' + INK + '">' + g.join('') + '</g>');
    sh.pitches = sh.set.map(n => n.sp.step + (n.sp.alter === 1 ? '#' : n.sp.alter === -1 ? 'b' : '') + n.sp.octave);
  }
  // the ribbon's half width along the arc, for the ball (it must show outside the ribbon)
  const wMinR = F.ribbonMinPx != null ? F.ribbonMinPx : look.arcStrokePx, ribbon = style === 'ribbon' ? P2.filter((p, i) => i % 4 === 0 || i === P2.length - 1).map(p => [+p.s.toFixed(3), +((wMinR + (RW - wMinR) * p.e) / 2).toFixed(2)]) : null;
  return { svg: out.join(''), arcY: { imp, apex }, ribbon, extraH: strip ? F.heightPx + pad : 0, shapes: shapes.map(s => ({ at: s.at, pitches: s.pitches })), flags };
};
