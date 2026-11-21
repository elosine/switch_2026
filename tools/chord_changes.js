// chord_changes.js — HOW OFTEN THE HAND'S SHAPE CHANGES: alternatives to look at (SW-88; the Switch~ piece RUNNING_LOG §293 — his word:
// "do kind of an analysis of this section of both hands and give me a couple alternatives of what the [chord] changes would look like …
// put them in the boxes about where they're meant to be done … I want to see how the [chord] changes might look, or how often").
//
// THE ONE KNOB of an alternative: SPAN — how far a hand may reach before its shape is said again. Each hand's notes are read in order;
// a note joins the current shape while the shape's lowest-to-highest stays within `span` semitones; the first note that would stretch it
// further begins a NEW shape, written at that note's moment. A wide span = few changes (big shapes); a narrow span = many (tight shapes).
// A shape is drawn as Shape Action Notation draws it (tools/gravity_furniture.js, §276 … §280): four pitches or more with no gap over a
// whole step = a CLUSTER BAR (lowest and highest note, a bar between); anything else = all its notes in columns; accidentals; a thin box.
//
//   module.exports.segment(notes, span)        → [{ at, t1, set:[{midi, sp}] }]          (one hand's notes, [{t, midi, sp}])
//   module.exports.draw({ shapes, xOf, staff, glyphs, ChordColumn, gaps })  → svg         (one hand's shapes on its staff)
'use strict';
function segment(notes, span) {
  // notes struck together (within 45 ms of each other) are ONE event and are never split between two shapes
  const ev = []; for (const n of notes.slice().sort((a, b) => a.t - b.t || a.midi - b.midi)) { const x = ev[ev.length - 1]; if (x && n.t - x.t1 < 0.045) { x.notes.push(n); x.t1 = n.t; } else ev.push({ t: n.t, t1: n.t, notes: [n] }); }
  const out = []; let cur = null;
  for (const e of ev) {
    const lo = Math.min(...e.notes.map(n => n.midi)), hi = Math.max(...e.notes.map(n => n.midi));
    if (cur && Math.max(cur.hi, hi) - Math.min(cur.lo, lo) <= span) { cur.lo = Math.min(cur.lo, lo); cur.hi = Math.max(cur.hi, hi); cur.t1 = e.t1; cur.notes.push(...e.notes); }
    else { cur = { at: e.t, t1: e.t1, lo, hi, notes: e.notes.slice() }; out.push(cur); }
  }
  for (const s of out) s.set = [...new Map(s.notes.map(n => [n.midi, n])).values()].sort((a, b) => a.midi - b.midi);
  return out;
}
// [§294 — HIS CRITERION, replacing the span: "if it's like a pitch set. So if a set of pitches … lasts for a little while … does that group of notes
// change at a certain point? Or it could be that it's just mostly a bottom and the top cluster all the time"] THE PERSISTENT SETS of one hand:
// the hand's current PLACE is the range of the notes it has been using. An event that falls inside it (within tolSemis of its edges) belongs
// to it. An event outside it is looked at with what FOLLOWS: if, over the next lookS seconds, at least `share` of the notes are outside the
// place too, the hand has MOVED — a new set begins there; if not, the event was a passing reach (kept as an outlier, not part of the set).
// A set that lasts less than minDurS is BRIEF — a particular harmony at one point, for the standard notation's second pass, not a shape.
function persistent(notes, opts) {
  // A set is FOUNDED on what the hand plays in its first foundS seconds (as long as that stays within foundSpan semitones); after that its
  // place is HELD: it never grows, so a hand that wanders is seen to have left it. (The first version let the place grow with every note
  // and it swallowed everything — §294.)
  const O = Object.assign({ tolSemis: 2, lookS: 1.0, share: 0.6, minDurS: 0.8, foundS: 0.8, foundSpan: 9 }, opts || {});
  const ev = []; for (const n of notes.slice().sort((p, q) => p.t - q.t || p.midi - q.midi)) { const x = ev[ev.length - 1]; if (x && n.t - x.t1 < 0.045) { x.notes.push(n); x.t1 = n.t; } else ev.push({ t: n.t, t1: n.t, notes: [n] }); }
  const out = []; let cur = null;
  const inside = (c, m) => m >= c.lo - O.tolSemis && m <= c.hi + O.tolSemis;
  for (let i = 0; i < ev.length; i++) {
    const e = ev[i];
    if (cur) {
      const founding = e.t - cur.at <= O.foundS;
      const inN = e.notes.filter(n => founding ? Math.max(cur.hi, n.midi) - Math.min(cur.lo, n.midi) <= O.foundSpan : inside(cur, n.midi));
      if (inN.length * 2 >= e.notes.length) {
        for (const n of inN) { if (founding) { cur.lo = Math.min(cur.lo, n.midi); cur.hi = Math.max(cur.hi, n.midi); } cur.notes.push(n); }
        cur.out.push(...e.notes.filter(n => !inN.includes(n))); cur.t1 = e.t1; continue;
      }
      const ahead = []; for (let j = i; j < ev.length && ev[j].t <= e.t + O.lookS; j++) ahead.push(...ev[j].notes);
      if (ahead.filter(n => !inside(cur, n.midi)).length / ahead.length < O.share) { cur.out.push(...e.notes); continue; }   // a passing reach
    }
    cur = { at: e.t, t1: e.t1, lo: Math.min(...e.notes.map(n => n.midi)), hi: Math.max(...e.notes.map(n => n.midi)), notes: e.notes.slice(), out: [] }; out.push(cur);
  }
  out.forEach((x, i) => { x.until = i < out.length - 1 ? out[i + 1].at : x.t1; x.brief = x.t1 - x.at < O.minDurS; x.set = [...new Map(x.notes.map(n => [n.midi, n])).values()].sort((p, q) => p.midi - q.midi); });
  return out;
}
function draw(o) {
  const { shapes, xOf, staff, glyphs, ChordColumn, gaps } = o, R = Object.assign({ clusterMinNotes: 4, clusterMaxGap: 2, clusterBarW: 0.5 }, o.rule || {});
  const ss = (staff[1] - staff[0]) / 4, mid = (staff[0] + staff[1]) / 2, INK = '#111', r1 = x => (+x).toFixed(1), r3 = x => (+x).toFixed(3), out = [];
  const LET = 'CDEFGAB', NH = glyphs.notehead.filled, W = NH.wSs, HH = NH.hSs, lf = (glyphs.standards.ledgerLine && glyphs.standards.ledgerLine.lengthFraction) || 0.25, lt = (glyphs.standards.ledgerLine && glyphs.standards.ledgerLine.thickness) || 0.1;
  let lastRight = -Infinity;
  for (const sh of shapes) {
    const cluster = sh.set.length >= R.clusterMinNotes && sh.set.every((n, i) => !i || n.midi - sh.set[i - 1].midi <= R.clusterMaxGap);
    const drawn = cluster ? [sh.set[0], sh.set[sh.set.length - 1]] : sh.set;
    const m = drawn.map(n => ({ sp: n.sp, y: (n.sp.octave * 7 + LET.indexOf(n.sp.step) - 34) * 0.5 })), placed = [];
    for (const x of m.slice().sort((a, b) => a.y - b.y || (a.sp.alter || 0) - (b.sp.alter || 0))) {
      const free = c => !placed.some(p => Math.abs(p.dx - c) < 1e-9 && Math.abs(p.y - x.y) <= 0.5 + 1e-9);
      x.dx = [0, W, -W, 2 * W].find(free); if (x.dx == null) x.dx = 3 * W; placed.push(x);
    }
    const accKey = x => x.sp.alter === 1 ? 'sharp' : x.sp.alter === -1 ? 'flat' : x.sp.alter ? null : (!cluster && m.some(y => y !== x && y.sp.step === x.sp.step && y.sp.octave === x.sp.octave && y.sp.alter) ? 'natural' : null);
    const led = [], low = m.filter(x => x.y <= -3), high = m.filter(x => x.y >= 3);
    for (let L = -3; low.length && L >= Math.ceil(Math.min(...low.map(x => x.y)) - 1e-9); L--) { const on = low.filter(x => x.y <= L + 1e-9); if (on.length) led.push({ y: L, x0: Math.min(...on.map(x => x.dx)) - W * lf, x1: Math.max(...on.map(x => x.dx)) + W + W * lf }); }
    for (let L = 3; high.length && L <= Math.floor(Math.max(...high.map(x => x.y)) + 1e-9); L++) { const on = high.filter(x => x.y >= L - 1e-9); if (on.length) led.push({ y: L, x0: Math.min(...on.map(x => x.dx)) - W * lf, x1: Math.max(...on.map(x => x.dx)) + W + W * lf }); }
    const withAcc = m.filter(x => accKey(x) && glyphs.accidental[accKey(x)]);
    const accs = withAcc.map(x => { const a = glyphs.accidental[accKey(x)], nY = a.anchors && a.anchors.noteY, tp = nY ? nY.y : a.hSs / 2; return { w: a.wSs, topExt: tp, botExt: a.hSs - tp, ySs: x.y, a, tp }; });
    const packed = ChordColumn.accidentalColumn(accs, m.map(x => ({ xLeft: x.dx, ySs: x.y, hSs: HH })), led.map(l => ({ ySs: l.y, xLeft: l.x0 })), { gapToNotehead: gaps.toHead, minLateralGap: gaps.between, yTol: 0.05 });
    const xs0 = Math.min(...m.map(x => x.dx), ...packed.map(p => p.leftEdge), ...led.map(l => l.x0)), xs1 = Math.max(...m.map(x => x.dx + W), ...led.map(l => l.x1));
    const ys1 = Math.max(...m.map(x => x.y + HH / 2), ...accs.map(a => a.ySs + a.topExt)), ys0 = Math.min(...m.map(x => x.y - HH / 2), ...accs.map(a => a.ySs - a.botExt));
    // the box BEGINS at the shape's first note; a box that would run into the one before it stands just after it (said in `pushed`)
    const bp = 0.3, want = xOf(sh.at) + (bp - xs0) * ss, least = lastRight + 0.35 * ss + (bp - xs0) * ss, X0 = Math.max(want, least), px = x => X0 + x * ss, py = y => mid - y * ss;
    sh.pushed = X0 > want + 0.5; sh.cluster = cluster; lastRight = px(xs1 + bp); sh.x1 = lastRight; sh.yMid = py((ys0 + ys1) / 2);
    const g = [], box = 'x="' + r1(px(xs0 - bp)) + '" y="' + r1(py(ys1 + bp)) + '" width="' + r1((xs1 - xs0 + 2 * bp) * ss) + '" height="' + r1((ys1 - ys0 + 2 * bp) * ss) + '"';
    // [§296 — his "the bounding box should be completely transparent. So just a border, no fill. You should see the staff lines"] no ground under a shape
    for (const l of led) g.push('<rect x="' + r1(px(l.x0)) + '" y="' + r1(py(l.y) - lt * ss / 2) + '" width="' + r1((l.x1 - l.x0) * ss) + '" height="' + (lt * ss).toFixed(2) + '"/>');
    if (cluster && m.length === 2) { const bw = W * R.clusterBarW, cx = m[0].dx + W / 2; g.push('<rect x="' + r1(px(cx - bw / 2)) + '" y="' + r1(py(m[1].y)) + '" width="' + r1(bw * ss) + '" height="' + r1((m[1].y - m[0].y) * ss) + '"/>'); }
    for (const x of m) g.push('<g transform="translate(' + r3(px(x.dx)) + ' ' + r3(py(x.y) - NH.anchors.center.y * ss) + ') scale(' + ss.toFixed(5) + ')"><path d="' + NH.path + '"/></g>');
    withAcc.forEach((x, i) => g.push('<g transform="translate(' + r3(px(packed[i].leftEdge)) + ' ' + r3(py(x.y) - accs[i].tp * ss) + ') scale(' + ss.toFixed(5) + ')"><path d="' + accs[i].a.path + '"/></g>'));
    if (o.box !== false) g.push('<rect ' + box + ' fill="none" stroke="' + INK + '" stroke-width="0.7"/>');   // box false: plain notes (the stutter's two keys, §305)
    out.push('<g fill="' + INK + '">' + g.join('') + '</g>');
  }
  return out.join('');
}
module.exports = { segment, persistent, draw };
