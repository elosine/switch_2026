#!/usr/bin/env node
// tools/check_rules.js — THE GATES OF THE ENGRAVING RULES (LGMF PLAN 2e; RUNNING_LOG §448 …). Exit 1 on any failure.
//   node tools/check_rules.js
// (0) the tables are whole: every registry pointer names a row · every row carries a basis and a ref · every device names its anchor
//     row and its member rows, each an existing row · docs/ENGRAVING_RULES.md is what the tables generate
// (1) every drawn kind has an edge row (page_rules.edge) — the renderer's kinds + every kind in a laid-out page
//     [2e.2: + every ANIMATED kind (animobj.kinds())]
// (2) every object the layout draws has an objects row — every item of every notation file laid out, and every kind and glyph the
//     renderer and the animation layer know, matched against the rows' `draws`
// (3) no colour or size literal for a music mark in layout.js / render.js — a colour literal only on a RULES MIRROR line (the code
//     fallbacks for a caller without the registry); `muted` only at the page-furniture sites; a numeric size on a pushed item only on
//     a RULES MIRROR line
// (6) the anchor principle — the head ON its time ↔ no go line: an anchor-A device draws no go line, a B · C · D device draws one
// [2e.3: (8) the fundamental and the cents at sounding pitch in a transposed realization · 2e.4: (4) the fit test · (5) the dot in a
//  space · 2e.5: (7) every device carries `sheet: '§N'` · 2g.1: (1) every kind an objects row draws has its edge row · (7) the
//  vibraphone's bow on its sheet]
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const Rules = require(path.join(ROOT, 'notation', 'lib', 'rules.js'));
const Layout = require(path.join(ROOT, 'notation', 'lib', 'layout.js'));
const Render = require(path.join(ROOT, 'notation', 'lib', 'render.js'));
const AnimObj = require(path.join(ROOT, 'notation', 'lib', 'animobj.js'));
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const R = Rules.loadRules(ROOT);
const raw = rd('notation/registry/container.json');
const pageRules = rd('notation/registry/page_rules.json');
const glyphs = rd('notation/lib/glyphs.json');
let failures = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (cond) console.log('   ok  ' + msg); else { failures++; console.log('  FAIL  ' + msg); } return cond; };
const ANIMATED_EDGES = process.argv.includes('--animated') || (pageRules.edge && Object.keys(pageRules.edge).some(k => k.startsWith('anim:')));

// ---------------------------------------------------------------- (0) the tables are whole
console.log('(0) THE TABLES');
let C = null;
try { C = Rules.compile(raw, R); ok(true, 'every registry pointer names a row (' + Rules.refsOf(raw).length + ' pointers compiled)'); }
catch (e) { ok(false, e.message); }
const noBasis = [];
for (const t of ['principles', 'anchors', 'objects', 'colours', 'faces']) for (const [k, v] of Object.entries(R[t] || {})) {
  if (k.startsWith('_')) continue;
  if (!v.basis || !v.ref) noBasis.push(t + '.' + k);
}
ok(!noBasis.length, 'every row carries its basis and its ref' + (noBasis.length ? ' — missing on ' + noBasis.join(' · ') : ''));
const D = raw.engraving.layout.devices;
const devices = [];
for (const g of ['byEnv', 'byTechnique']) for (const [k, v] of Object.entries(D[g] || {})) if (!k.startsWith('_') && v && typeof v === 'object') devices.push([g + '.' + k, v]);
if (D.byPairBeam) devices.push(['byPairBeam', D.byPairBeam]);
for (const [k, v] of Object.entries(raw.engraving.layout.figures || {})) if (!k.startsWith('_') && v && typeof v === 'object') devices.push(['figures.' + k, v]);
// [2e.3] the technique table's family looks (techniques.json familyDevice) are devices too — the layout falls back to them
const TQ = rd('notation/registry/techniques.json');
for (const [k, v] of Object.entries(TQ.familyDevice || {})) if (!k.startsWith('_') && v && typeof v === 'object') devices.push(['familyDevice.' + k, v]);
const noAnchor = devices.filter(([, v]) => !v.anchorRow || !R.anchors[v.anchorRow]).map(([n]) => n);
ok(!noAnchor.length, 'every device (' + devices.length + ') names an anchor row' + (noAnchor.length ? ' — not: ' + noAnchor.join(' · ') : ''));
const badMember = [];
for (const [n, v] of devices) for (const m of v.memberRows || []) if (!R.objects[m]) badMember.push(n + ' → ' + m);
ok(devices.every(([, v]) => Array.isArray(v.memberRows) && v.memberRows.length) && !badMember.length,
  'every device lists its member rows, each an objects row' + (badMember.length ? ' — unknown: ' + badMember.join(' · ') : ''));
// (7) [2e.5] every device carries its SHEET — the § of the device sheet (or the decision that stands for one) that made it
const noSheet = devices.filter(([, v]) => !(typeof v.sheet === 'string' && v.sheet.trim())).map(([n]) => n);
ok(!noSheet.length, '(7) every device carries `sheet` — the § that decided it (' + devices.length + ')' + (noSheet.length ? ' — none on ' + noSheet.join(' · ') : ''));
// [2g.1] the vibraphone's bow (PLAN 2g): its sheet is §466, it stands on anchor A, its members include the timed hairpin
{
  const vb = (D.byEnv || {}).vibBow;
  ok(!!vb && /§466/.test(vb.sheet || '') && vb.anchorRow === 'A' && (vb.memberRows || []).includes('hairpinTimed') && !!R.vibMarks,
    '(7) the vibraphone\'s bow `byEnv.vibBow` carries its sheet (§466), stands on anchor A with the timed hairpin among its members, and its reader\'s rules are a table (`vibMarks`)');
}
// [2k.1] the morph (PLAN 2k): its sheet is §506, it stands on anchor B with the gliss line and both curves among its members, the
// gliss curve names its scale, and the vibrato word is by section kind (a morph's word the sequence's — LG-117)
{
  const mo = (D.byEnv || {}).morph, TC = R.techniqueChange || {};
  ok(!!mo && /§506/.test(mo.sheet || '') && mo.anchorRow === 'B' && ['glissLine', 'glissCurve', 'crescCurve'].every(m => (mo.memberRows || []).includes(m))
    && R.objects.glissCurve.scale === 'travel' && !!TC.byKind && TC.byKind.morph === TC.byKind.sequence && Array.isArray(TC.eligible) && !TC.byEnv && !TC.texts,
    '(7) the morph `byEnv.morph` carries its sheet (§506), stands on anchor B with the gliss line and both curves; `glissCurve.scale` travel; the vibrato word by kind (`techniqueChange.byKind`, the morph\'s = the sequence\'s)');
}
// [2m.1] the long tone (PLAN 2m): its sheet is §531, it stands on anchor A with no go line, the ring bar its full length and the
// dynamic among its members, the name on the dynamic row
{
  const lt = (D.byEnv || {}).longTone;
  ok(!!lt && /§531/.test(lt.sheet || '') && lt.anchorRow === 'A' && lt.goLine === false && ['ringBar', 'dynamic'].every(m => (lt.memberRows || []).includes(m))
    && lt.ringBar === true && lt.ringBarFull === true && lt.dynMark === 'band' && lt.dynOnRow === true,
    '(7) the long tone `byEnv.longTone` carries its sheet (§531), stands on anchor A with no go line, the ring bar its full length, one band name per note on the dynamic row');
}
// [§547] the plain note (his ask 2026-09-29 — the EH's first notes of section 2 as black noteheads with stems): its sheet is §547, it
// stands on anchor A with no go line and no GC, a FILLED head with a PLAIN stem among its members, no bar, the band name on the dynamic row
{
  const pn = (D.byEnv || {}).plainNote;
  ok(!!pn && /§547/.test(pn.sheet || '') && pn.anchorRow === 'A' && pn.goLine === false && pn.gc === false && ['head', 'stem', 'dynamic'].every(m => (pn.memberRows || []).includes(m))
    && pn.nhHead === 'filled' && pn.nhStem === 'plain' && pn.ringBar === false && pn.dynMark === 'band' && pn.dynOnRow === true,
    '(7) the plain note `byEnv.plainNote` carries its sheet (§547), stands on anchor A with no go line, a filled head with a plain stem, one band name per note on the dynamic row');
}
// [§611] the one-off (his ask 2026-09-30 — the bassoon's one-offs as the GC unit of #4's staccato / #5's strike, "precisely that way", a
// model in the registry): its sheet is §611, it stands on anchor C with the go line at the GC's impact and the GC among its members, and it
// equals byEnv.strike on EVERY field the strike has except the accent (nhArtic), which it leaves off — the dot back at §612 — and at §612 takes the
// section's word into its column (instrPlace 'column', instrAlign 'middle' — anchor C's columnAlign centre) with every one-off its band name
{
  const oo = (D.byEnv || {}).oneOff, st = (D.byEnv || {}).strike;
  const same = !!st && !!oo && Object.keys(st).filter(k => !['sheet', 'memberRows', 'nhArtic'].includes(k)).every(k => JSON.stringify(st[k]) === JSON.stringify(oo[k]));
  ok(!!oo && /§611/.test(oo.sheet || '') && oo.anchorRow === 'C' && oo.goLine === true && oo.gc === true && ['cueHead', 'stem', 'flag', 'dynamic', 'goLine', 'gc'].every(m => (oo.memberRows || []).includes(m))
    && same && oo.nhDot === true && oo.nhArtic === undefined && oo.dynMark === 'band' && oo.dynBesideStem === true
    && oo.instrPlace === 'column' && oo.instrAlign === 'middle' && (oo.memberRows || []).includes('staccatoDot') && (oo.memberRows || []).includes('instruction'),
    '(7) the one-off `byEnv.oneOff` carries its sheet (§611), stands on anchor C with the go line at the GC\'s impact, is `byEnv.strike` field for field without the accent (the dot back, §612), and takes the section\'s word into its column, centred (§612)');
}
const gen = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'gen_engraving_rules.js'), '--check'], { encoding: 'utf8' });
ok(gen.status === 0, 'docs/ENGRAVING_RULES.md is what the tables generate' + (gen.status ? ' — run node tools/gen_engraving_rules.js' : ''));

// ---------------------------------------------------------------- lay out every notation file once (the gates below read the items)
const ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json');
const ENS = Layout.ensembleFor(ens, ((C || raw).realizations || {})['video-jury']);
const irFiles = fs.readdirSync(path.join(ROOT, 'notation', 'ir')).filter(f => f.endsWith('.ir.json')).sort();
const sigs = new Map();         // signature → first place seen
const M10 = { linedStaves: 0, badLined: [], stemMarks: 0, acrossStem: [], graceFlags: 0, badGraceFlags: [], graceGap: (((R.objects || {}).graceHead || {}).flagHeadGapSs) || 0.45, widthEm: ((R.objects || {}).instruction || {}).widthEm || {}, slashes: 0, badSlashes: [], seenT: new Set(), moments: 0, clashes: [], words: 0, badWords: [], wordEm: (((R.objects || {}).instruction || {}).size || 0.75) * 1.3, flags: 0, badFlags: [], hooks: 0, badHooks: [], dots: 0, badDots: [], flagClear: ((R.objects || {}).flag || {}).staff || 0.38, flagMax: ((R.objects || {}).flag || {}).clearMaxSs || 10.5, hookGap: ((R.objects || {}).ottava || {}).stack || 0.45,
  dotClear: ((R.objects || {}).staccatoDot || {}).lineClearSs || 0, dotR: (((R.objects || {}).staccatoDot || {}).diameterSs || 0.4) / 2 };
const kindsSeen = new Set();
for (const f of irFiles) {
  let m;
  try {
    const ir = rd(path.join('notation', 'ir', f));
    m = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: ENS ? ENS.parts.map(p => p.part) : undefined, ensemble: ENS, techniques: T },
      ((C || raw).engraving || {}).layout || {}));
  } catch (e) { ok(false, f + ' does not lay out: ' + e.message); continue; }
  // [§376] (10) measured on every page: the flag's clearance from its staff · the ottava's hook before a go line · the dot's clearance from a line
  // [§429] THE LINED STAFF'S TWO ROWS: every dynamic of a lined (percussion) staff at ONE height, every word at ONE height under it, the stack gap between them
  for (const s of m.systems) { if (!s.staffLines) continue; const pg = f.replace('.ir.json', ''), dy = new Set(), wy = new Set(); let dH = 0;
    for (const it of s.items || []) { if (it.k === 'glyph' && /^dyn-/.test(it.g || '')) { dy.add(it.ySs.toFixed(2)); dH = Math.max(dH, ((glyphs.dynamic[it.g.slice(4)] || {}).hSs || 0)); } if (it.k === 'text' && it.seq === 'techText' && it.ySs != null) wy.add(it.ySs.toFixed(2)); }
    if (!dy.size && !wy.size) continue; M10.linedStaves++;
    if (dy.size > 1) M10.badLined.push(pg + ' p' + s.part + ' dynamics at ' + [...dy].join(' / '));
    if (wy.size > 1) M10.badLined.push(pg + ' p' + s.part + ' words at ' + [...wy].join(' / '));
    if (dy.size === 1 && wy.size === 1) { const gap = (+[...dy][0] - Math.max(...Object.values(glyphs.dynamic).map(g => g.hSs || 0)) / 2) - (+[...wy][0] + 0.8 * M10.wordEm); if (gap < 0.44) M10.badLined.push(pg + ' p' + s.part + ' the word ' + gap.toFixed(2) + ' ss under the dynamics'); } }
  for (const s of m.systems) { if (s.staffLines) continue; const its = s.items || [], pg = f.replace('.ir.json', '');
    for (const it of its) {
      if (it.k === 'glyph' && /^flag-/.test(it.g || '') && !(it.scale < 1) && !it.unit) {   // a grace's flag and a hand unit's (its own 2 ss rule) are not this gate's
        const G = glyphs.flag[it.g.replace('flag-', '')], h = G.hSs * (it.scaleY || 1), down = /down/.test(it.g), st = its.find(x => x.k === 'stem' && Math.abs(x.t - it.t) < 1e-9 && Math.abs(x.dxSs - it.dxSs) < 1e-6);
        const clear = down ? -2 - (it.ySs + h) : (it.ySs - h) - 2, len = st ? Math.abs(st.yB - st.yA) : 0;
        M10.flags++; if (clear < M10.flagClear - 0.01 && len + (M10.flagClear - clear) <= M10.flagMax + 0.01) M10.badFlags.push(pg + ' p' + s.part + '@' + it.t.toFixed(2) + ' ' + clear.toFixed(2)); }
      if (it.k === 'ottava' && !it.seq) { const go = its.find(x => x.k === 'goline' && Math.abs(x.t - it.t) < 1e-9); if (go) { M10.hooks++; if (-it.dx1Ss < M10.hookGap - 0.01) M10.badHooks.push(pg + ' p' + s.part + '@' + it.t.toFixed(2) + ' ' + (-it.dx1Ss).toFixed(2)); } }
      if (it.k === 'text' && it.seq === 'techText' && typeof it.text === 'string' && it.yAt !== 'top') { const go = its.find(x => x.k === 'goline' && Math.abs(x.t - it.t) < 1e-9); if (go) {
        const w = (M10.widthEm[it.text] > 0 ? M10.widthEm[it.text] : it.text.length * 0.5) * M10.wordEm, right = it.anchor === 'end' ? it.dxSs : it.anchor === 'middle' ? it.dxSs + w / 2 : it.dxSs + w, left = right - w;
        M10.words++; if (right > -0.01 && left < 0.01) M10.badWords.push(pg + ' p' + s.part + '@' + it.t.toFixed(2) + ' "' + it.text + '"'); } }
      // [§380] THE COLLISION GATE: at one moment no two of these may share ink — a dynamic · an ottava bracket · a technique's word
      if (it.k === 'glyph' && /^notehead/.test(it.g || '') && !M10.seenT.has(pg + '|' + s.part + '|' + (s.staff || 0) + '|' + it.t.toFixed(6))) { M10.seenT.add(pg + '|' + s.part + '|' + (s.staff || 0) + '|' + it.t.toFixed(6));
        const G = its.filter(x => typeof x.t === 'number' && Math.abs(x.t - it.t) < 1e-9), boxes = [];
        for (const x of G) {
          if (x.k === 'glyph' && /^dyn-/.test(x.g || '')) { const g = glyphs.dynamic[x.g.slice(4)] || {}, w = (g.wSs || 1) * (x.scale || 1), h = (g.hSs || 1) * (x.scale || 1); boxes.push({ n: 'dynamic', x0: x.dxSs - w / 2, x1: x.dxSs + w / 2, y0: x.ySs - h / 2, y1: x.ySs + h / 2 }); }
          else if (x.k === 'ottava') boxes.push({ n: 'ottava', x0: x.dx0Ss, x1: x.dx1Ss, y0: x.dir === 'above' ? x.ySs - 0.8 : x.ySs - 0.33, y1: x.dir === 'above' ? x.ySs + 0.33 : x.ySs + 0.8 });
          else if (x.k === 'text' && x.seq === 'techText' && typeof x.text === 'string' && x.yAt !== 'top' && x.ySs != null) { const w = (M10.widthEm[x.text] > 0 ? M10.widthEm[x.text] : x.text.length * 0.5) * M10.wordEm, r = x.anchor === 'end' ? x.dxSs : x.anchor === 'middle' ? x.dxSs + w / 2 : x.dxSs + w; boxes.push({ n: '"' + x.text + '"', x0: r - w, x1: r, y0: x.ySs - 0.2 * M10.wordEm, y1: x.ySs + 0.8 * M10.wordEm }); }
        }
        M10.moments++;
        for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) { const A = boxes[a], B = boxes[b]; if (A.n === B.n) continue;
          if (Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0) > 0.05 && Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0) > 0.05) M10.clashes.push(pg + ' p' + s.part + '@' + it.t.toFixed(2) + ' ' + A.n + ' × ' + B.n); } }
      // [§406] NOTHING IS WRITTEN ACROSS A STEM (his rule: "I don't think anything should be written over the stem"): a technique's word or a dynamic
      // whose height lies within its own note's stem never spans that stem sideways
      if ((it.k === 'text' && it.seq === 'techText' && typeof it.text === 'string' && it.ySs != null && it.yAt !== 'top') || (it.k === 'glyph' && /^dyn-/.test(it.g || ''))) {
        let x0, x1, y0, y1; if (it.k === 'text') { const w = (M10.widthEm[it.text] > 0 ? M10.widthEm[it.text] : it.text.length * 0.5) * M10.wordEm; x1 = it.anchor === 'end' ? it.dxSs : it.anchor === 'middle' ? it.dxSs + w / 2 : it.dxSs + w; x0 = x1 - w; y0 = it.ySs - 0.2 * M10.wordEm; y1 = it.ySs + 0.8 * M10.wordEm; }
        else { const g = glyphs.dynamic[it.g.slice(4)] || {}, w = (g.wSs || 1) * (it.scale || 1), h = (g.hSs || 1) * (it.scale || 1); x0 = it.dxSs - w / 2; x1 = it.dxSs + w / 2; y0 = it.ySs - h / 2; y1 = it.ySs + h / 2; }
        M10.stemMarks++;
        for (const st of its) if (st.k === 'stem' && Math.abs(st.t - it.t) < 1e-9 && x0 < st.dxSs - 0.07 && x1 > st.dxSs + 0.07 && Math.min(y1, Math.max(st.yA, st.yB)) - Math.max(y0, Math.min(st.yA, st.yB)) > 0.05) { M10.acrossStem.push(pg + ' p' + s.part + '@' + it.t.toFixed(2) + ' ' + (it.text ? '"' + it.text + '"' : it.g.slice(4))); break; } }
      // [§404] A GRACE NOTE'S FLAG ENDS CLEAR OF ITS HEAD: the stem at least the head's half height + objects.graceHead.flagHeadGapSs (at the grace's scale) + the flag
      if (it.k === 'glyph' && /^flag-(up|down)[0-9]+$/.test(it.g || '') && it.scale < 1) { const G = glyphs.flag[it.g.replace('flag-', '')], st = its.find(x => x.k === 'stem' && Math.abs(x.t - it.t) < 1e-9 && Math.abs(x.dxSs - it.dxSs) < 1e-6);
        if (st) { M10.graceFlags++; const need = glyphs.notehead.filled.hSs * it.scale / 2 + M10.graceGap * it.scale + G.hSs * it.scale * (it.scaleY || 1); if (Math.abs(st.yB - st.yA) < need - 0.02) M10.badGraceFlags.push(pg + ' p' + s.part + '@' + it.t.toFixed(2) + ' ' + Math.abs(st.yB - st.yA).toFixed(2) + ' < ' + need.toFixed(2)); } }
      // [§393] THE SLASHES PAST THE LEDGER LINES: a tremolo slash of a note outside the staff lies wholly inside the staff's outer lines
      if (it.k === 'slash' && it.seq === 'tremolo') { const hd = its.find(x => x.k === 'glyph' && /^notehead/.test(x.g || '') && Math.abs(x.t - it.t) < 1e-9 && !(x.scale < 1)); if (hd && Math.abs(hd.ySs) > 2.5) { M10.slashes++;
        const lo = Math.min(it.y0Ss, it.y1Ss) - it.thickSs / 2, hi = Math.max(it.y0Ss, it.y1Ss) + it.thickSs / 2; if (hd.ySs < 0 ? lo < -2.01 : hi > 2.01) M10.badSlashes.push(pg + ' p' + s.part + '@' + it.t.toFixed(2)); } }
      if (it.k === 'dot') { const hd = its.find(x => x.k === 'glyph' && /^notehead/.test(x.g || '') && Math.abs(x.t - it.t) < 1e-9 && Math.abs(x.dxSs - it.dxSs) < 1e-6); if (hd) {
        const lines = [-2, -1, 0, 1, 2]; for (let L = 3; L <= Math.abs(hd.ySs) + 0.01; L++) lines.push(hd.ySs > 0 ? L : -L);
        const dl = Math.min(...lines.map(L => Math.abs(it.ySs - L))) - M10.dotR; M10.dots++; if (dl < M10.dotClear - 0.02) M10.badDots.push(pg + ' p' + s.part + '@' + it.t.toFixed(2) + ' ' + dl.toFixed(2)); } }
    } }
  for (const s of m.systems) for (const it of s.items || []) {
    kindsSeen.add(it.k);
    const sig = it.k === 'glyph' ? 'glyph:' + it.g : it.k + (it.seq ? '[' + it.seq + ']' : '');
    if (!sigs.has(sig)) sigs.set(sig, f.replace('.ir.json', ''));
  }
}

// ---------------------------------------------------------------- (1) every drawn kind has an edge row
console.log('(1) THE EDGES');
const CLASSES = new Set(['cut', 'clamp', 'atomic', 'furniture']);
const drawnKinds = [...new Set([].concat(Render.POINT_KINDS, Render.LONG_KINDS, Render.FURNITURE_KINDS, ['tuplet'], [...kindsSeen]))].sort();
const noEdge = drawnKinds.filter(k => !(pageRules.edge && pageRules.edge[k] && CLASSES.has(pageRules.edge[k].screen)));
ok(!noEdge.length, 'every drawn kind (' + drawnKinds.length + ') carries its edge class' + (noEdge.length ? ' — not: ' + noEdge.join(' · ') : ''));
if (ANIMATED_EDGES) {
  const noAnim = AnimObj.kinds().concat(['cursor']).filter(k => !(pageRules.edge['anim:' + k] && CLASSES.has(pageRules.edge['anim:' + k].screen) && pageRules.edge['anim:' + k].print === 'none'));
  ok(!noAnim.length, 'every ANIMATED kind (' + (AnimObj.kinds().length + 1) + ') carries its edge class, print none' + (noAnim.length ? ' — not: ' + noAnim.join(' · ') : ''));
} else console.log('   --  the animated kinds\' edge rows arrive at 2e.2');
// [2g.1] every KIND an objects row draws carries its edge class — a kind no page draws yet included (the vibraphone's `hairpin-timed`)
{
  const rowKinds = [];
  for (const [k, o] of Object.entries(R.objects)) if (!k.startsWith('_')) for (const d of o.draws || []) if (!/^(glyph|anim):/.test(d)) rowKinds.push([k, d.replace(/\[.*\]$/, '')]);
  const noEdgeRow = rowKinds.filter(([, d]) => !(pageRules.edge[d] && CLASSES.has(pageRules.edge[d].screen)));
  ok(!noEdgeRow.length, 'every kind an objects row draws (' + new Set(rowKinds.map(x => x[1])).size + ') carries its edge class — `hairpin-timed` ' +
    (pageRules.edge['hairpin-timed'] ? pageRules.edge['hairpin-timed'].screen + ' · ' + pageRules.edge['hairpin-timed'].print : 'MISSING') + (noEdgeRow.length ? ' — not: ' + noEdgeRow.map(x => x[0] + ' → ' + x[1]).join(' · ') : ''));
}

// ---------------------------------------------------------------- (2) every drawn object has an objects row
console.log('(2) THE OBJECTS');
const pats = [];
for (const [k, o] of Object.entries(R.objects)) if (!k.startsWith('_')) for (const d of o.draws || []) pats.push({ row: k, re: new RegExp('^' + d.replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '$') });
const rowOf = sig => { const hit = pats.find(p => p.re.test(sig)); if (hit) return hit.row; const bare = sig.replace(/\[.*\]$/, ''); const h2 = bare !== sig && pats.find(p => p.re.test(bare)); return h2 ? h2.row : null; };
// the universe the code can draw, whether or not a page draws it today
const universe = new Map(sigs);
for (const k of drawnKinds) if (k !== 'glyph' && !universe.has(k)) universe.set(k, 'the renderer');
universe.set('glyph:notehead', universe.get('glyph:notehead') || 'the renderer'); universe.set('glyph:notehead-open', universe.get('glyph:notehead-open') || 'the renderer');
const fam = { dynamic: 'dyn-', articulation: 'artic-', accidental: 'accidental-', text: 'text-', pedal: 'pedal-' };
for (const [f, pre] of Object.entries(fam)) for (const n of Object.keys(glyphs[f] || {})) if (!n.startsWith('_')) { const s = 'glyph:' + pre + n; if (!universe.has(s)) universe.set(s, 'glyphs.json'); }
for (const n of Object.keys(glyphs.flag || {})) if (!n.startsWith('_')) { const s = 'glyph:flag-' + n; if (!universe.has(s)) universe.set(s, 'glyphs.json'); }
for (const k of AnimObj.kinds().concat(['cursor'])) universe.set('anim:' + k, 'animobj');
const noRow = [...universe].filter(([s]) => !rowOf(s));
ok(!noRow.length, 'every drawable object (' + universe.size + ' kinds and glyphs; ' + sigs.size + ' drawn on ' + irFiles.length + ' pages) has an objects row' +
  (noRow.length ? ' — not: ' + noRow.map(([s, w]) => s + ' (' + w + ')').join(' · ') : ''));

// ---------------------------------------------------------------- (3) no colour or size literal for a music mark
console.log('(3) THE LITERALS');
const MIRROR = /RULES MIRROR/;
const FURNITURE_MUTED = [/E\.partLabel/, /E\.reshow/, /mk\.label/, /pcfg \? esc\(pcfg\.(name \|\| pcfg\.)?short\)/];   // the part's name: its display `name` where the registry gives one (the Switch~ piece's ELEC), else its short
for (const f of ['notation/lib/layout.js', 'notation/lib/render.js']) {
  const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split(/\r?\n/);
  const col = [], mut = [], size = [];
  lines.forEach((ln, i) => {
    const code = ln.replace(/\/\/.*$/, '');
    if (/#[0-9a-fA-F]{3,6}\b|rgba?\(\s*\d/.test(code) && !MIRROR.test(ln)) col.push(i + 1);
    if (/\bo\.muted\b/.test(code) && !FURNITURE_MUTED.some(r => r.test(ln)) && !MIRROR.test(ln)) mut.push(i + 1);
    if (f.endsWith('layout.js') && /[{,]\s*(size|scale)\s*:\s*[0-9.]+/.test(code) && !MIRROR.test(ln)) size.push(i + 1);   // a key, not a ternary's `: 1`
    if (f.endsWith('render.js') && /font-size="[0-9]/.test(code) && !/mk\.label/.test(ln)) size.push(i + 1);
  });
  ok(!col.length, f + ': no colour literal outside a RULES MIRROR line' + (col.length ? ' — lines ' + col.join(', ') : ''));
  ok(!mut.length, f + ': `muted` only at the page-furniture sites' + (mut.length ? ' — lines ' + mut.join(', ') : ''));
  ok(!size.length, f + ': no numeric size literal on a music item outside a RULES MIRROR line' + (size.length ? ' — lines ' + size.join(', ') : ''));
}

// ---------------------------------------------------------------- (6) the anchor principle
console.log('(6) THE ANCHOR PRINCIPLE');
const CD = C ? C.engraving.layout.devices : D;
const compiledOf = n => { const [g, k] = n.split('.'); return g === 'byPairBeam' ? CD.byPairBeam : g === 'figures' ? (C || raw).engraving.layout.figures[k] : g === 'familyDevice' ? TQ.familyDevice[k] : CD[g][k]; };
const bad6 = [], prov6 = [];
for (const [n, v] of devices) {
  const d = compiledOf(n), a = v.anchorRow, row = R.anchors[a];
  if (!row || row.goLine === null) continue;
  const gl = d.goLine;
  // a PROVISIONAL look (2a's family devices) is reported by name, and must stand on the decisions-needed list — not failed
  if (v.provisional && !!gl !== row.goLine) { prov6.push(n); continue; }
  if (row.goLine === false && gl === 'gc' && v.anchorRowGc && R.anchors[v.anchorRowGc] && R.anchors[v.anchorRowGc].goLine === true) continue;   // a figure: the GC member alone takes C
  if (row.goLine === false && gl) bad6.push(n + ' is on ' + a + ' (the head on its time) but draws a go line');
  if (row.goLine === true && !gl) bad6.push(n + ' is on ' + a + ' (a go line) but draws none');
}
ok(!bad6.length, 'every device obeys its anchor: the head on its time ↔ no go line (' + devices.length + ' devices)' + (bad6.length ? ' — ' + bad6.join(' · ') : ''));
if (prov6.length) {
  const listed = (R.decisionsNeeded || []).some(d => d.status !== 'decided' && prov6.every(n => (d.what || '').includes(n.split('.')[1])));
  ok(listed, prov6.length + ' PROVISIONAL device(s) break the principle and stand on the decisions-needed list: ' + prov6.join(' · '));
}

// ---------------------------------------------------------------- (4) THE FIT TEST · (5) the staccato dot in a space
console.log('(4) THE FIT · (5) THE DOT');
{
  const Fit = require(path.join(ROOT, 'notation', 'lib', 'fit.js'));
  const LO = ((C || raw).engraving || {}).layout || {};
  const boxes = Fit.boxesFor(C || raw, ENS, ENS.parts.map(p => p.part));
  let pages = 0, left = 0, unreported = [], dots = 0, onLine = [];
  const lined = new Set((ens.parts || []).filter(p => p.staff && Array.isArray(p.staff.lines)).map(p => p.part));   // a lined staff (the percussion's seven) has its own spaces
  for (const f of irFiles) {
    const ir = rd(path.join('notation', 'ir', f));
    const m = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: ENS.parts.map(p => p.part), ensemble: ENS, techniques: T, fitBoxes: boxes }, LO));
    pages++;
    // (4) after the ladder, every unit still failing rung 0 is on the model's report at rung 8 — nothing touches unreported
    const rest = Fit.measureModel(m, boxes, glyphs, 1.3).filter(x => x.reasons.length);
    const rep = new Set((m.fit || []).filter(u => u.rung === 8).map(u => u.key + '|' + u.t.toFixed(6)));
    left += (m.fit || []).length;
    for (const x of rest) if (!rep.has(x.key + '|' + x.t.toFixed(6))) unreported.push(f.replace('.ir.json', '') + ' p' + x.key + '@' + x.t.toFixed(2));
    // (5) a staccato dot sits in a SPACE of a five-line staff (a half-integer staff position), never on a line
    for (const s of m.systems) if (!lined.has(s.part)) for (const it of s.items || []) if (it.k === 'dot') {
      dots++;
      const unitLines = [-2, -1, 0, 1, 2].concat((s.items || []).filter(x => x.k === 'ledger' && Math.abs(x.t - it.t) < 1e-9).map(x => x.ySs));   // the staff's lines and the unit's ledgers
      if (unitLines.some(Lx => Math.abs(it.ySs - Lx) < 0.25 - 1e-9)) onLine.push(f.replace('.ir.json', '') + ' p' + s.part + '@' + it.t.toFixed(2) + ' y ' + it.ySs);
    }
  }
  ok(LO.ladder && LO.ladder.on === true, 'the ladder is ON (rules.json ladder.built, compiled into engraving.layout.ladder)');
  ok(!unreported.length, 'the fit test over ' + pages + ' page(s): every unit that fails rung 0 after the ladder is on the report at rung 8 (' + left + ' left rung 0)' + (unreported.length ? ' — unreported: ' + unreported.slice(0, 6).join(' · ') : ''));
  ok(!onLine.length, 'no staccato dot touches a line — the staff’s or a ledger (' + dots + ' dots)' + (onLine.length ? ' — on a line: ' + onLine.slice(0, 6).join(' · ') : ''));
  // the ladder's walk, forced: the proto's block with its lane shrunk 2 ss under it and no room above — rungs 1 · 2 · 3 tried, reported at 8, marked red
  const proto = irFiles.includes('lgmf-eh-proto.ir.json') ? rd('notation/ir/lgmf-eh-proto.ir.json') : null;
  if (proto) {
    const B2 = Fit.boxesFor(C || raw, ENS, ENS.parts.map(p => p.part)); B2.byKey['0'] = Object.assign({}, B2.byKey['0'], { top: 7.0, bot: 2.94 });
    const mf = Layout.layoutSection(JSON.parse(JSON.stringify(proto)), glyphs, Object.assign({ m4AttackLines: false, frameParts: ENS.parts.map(p => p.part), ensemble: ENS, techniques: T, fitBoxes: B2 }, LO));
    const u = (mf.fit || []).find(x => x.part === 0 && x.t === 0), red = mf.systems.find(s => s.part === 0).items.some(i => i.seq === 'alert' && i.t === 0);
    const walked = u ? [...new Set(u.tried.map(x => String(x.rung)))].join(',') : '';
    ok(u && u.rung === 8 && walked === '1,3,2,4-7' && red, 'a unit forced 2 ss past its lane walks rungs 1 → 3 (the annotation) → 2 → 3 (the pitch data) and is reported at 8, marked red — walked ' + walked + ', rung ' + (u && u.rung));
    // the WORKING page (no realization — the EH in F, D♯6 on two ledgers), its own lane boxes: the block's column tops the lane by 0.30 ss
    const ENSW = Layout.ensembleFor(ens, null), BW = Fit.boxesFor(C || raw, ENSW, ENSW.parts.map(p => p.part));
    const mf3 = Layout.layoutSection(JSON.parse(JSON.stringify(proto)), glyphs, Object.assign({ m4AttackLines: false, frameParts: ENSW.parts.map(p => p.part), ensemble: ENSW, techniques: T, fitBoxes: BW }, LO));
    const u3 = (mf3.fit || []).find(x => x.part === 0 && x.t === 0);
    // [§458, his (a)] the flip by class: the word goes under the dynamic row, the cents and the partial stay over the head
    const it3 = mf3.systems.find(s => s.part === 0).items.filter(i => i.t === 0 && i.k === 'text');
    const numsUp = it3.filter(i => i.seq === 'cents' || i.seq === 'partial'), wordDown = it3.filter(i => i.seq === 'techText');
    ok(u3 && u3.rung === 3 && numsUp.length === 2 && numsUp.every(i => i.ySs > 2.5) && wordDown.length === 1 && wordDown[0].ySs < -4.6,
      'the block on the WORKING page (0.30 ss past the lane top) is placed by rung 3, THE FLIP BY CLASS (§458): the word under the dynamic row, the cents and the partial kept over the head — rung ' + (u3 && u3.rung) + ', numbers y ' + numsUp.map(i => i.ySs.toFixed(2)).join(' · ') + ', word y ' + wordDown.map(i => i.ySs.toFixed(2)).join(''));
  }
}

// ---------------------------------------------------------------- (8) the numbers at sounding pitch in every realization
console.log('(8) SOUNDING PITCH');
{
  // [2e.3 (5), §440 · §441] a transposed part moves the HEADS and the accidental picture only: the cents and the partial's fundamental
  // are the same text, at the same time, in the working realization (the EH and the horn in F, the trumpet in B♭) and in the one in C
  const texts = E => {
    const out = new Map();
    for (const f of irFiles) {
      const ir = rd(path.join('notation', 'ir', f));
      if (!(ir.overlays || []).some(o => o.kind === 'sequence')) continue;
      const m = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: E.parts.map(p => p.part), ensemble: E, techniques: T },
        ((C || raw).engraving || {}).layout || {}));
      for (const s of m.systems) for (const it of s.items || []) if (it.k === 'text' && (it.seq === 'cents' || it.seq === 'partial'))
        out.set(f + '|' + s.part + '|' + it.t.toFixed(4) + '|' + it.seq, it.text);
    }
    return out;
  };
  const inC = texts(ENS), working = texts(Layout.ensembleFor(ens, null));
  const bad = [...inC].filter(([k, v]) => working.get(k) !== v).map(([k, v]) => k + ' ' + v + ' ≠ ' + working.get(k));
  const tr = (ens.parts || []).filter(p => p.transpose).map(p => p.short || p.part);
  ok(inC.size > 0 && inC.size === working.size && !bad.length, 'the cents and the partial read the same in C and in the transposed parts (' + tr.join(' · ') + '): ' + inC.size + ' texts' +
    (bad.length ? ' — differ: ' + bad.slice(0, 4).join(' · ') : '') + (!inC.size ? ' — no sequence page to compare' : ''));
}

// ---------------------------------------------------------------- (9) [§502] THE OTTAVA ON EVERY HEAD · THE PITCH DATA OUTSIDE THE STAFF · NO 0
console.log('(9) THE OTTAVA ON EVERY HEAD · THE COLUMN OUTSIDE THE STAFF · NO 0');
{
  // his eye 2026-09-28 (RUNNING_LOG §502): the sequence block's head stood on six ledger lines with no sign (its own head placement never
  // folded), a column flipped by the ladder sat between the staff lines, and a 0 was written for no deviation. Over EVERY page here:
  const Fit = require(path.join(ROOT, 'notation', 'lib', 'fit.js'));
  const LO = ((C || raw).engraving || {}).layout || {};
  const boxes = Fit.boxesFor(C || raw, ENS, ENS.parts.map(p => p.part));
  const th = 2 + (LO.ottavaLedgerThreshold != null ? LO.ottavaLedgerThreshold : 3);
  const lined = new Set((ens.parts || []).filter(p => p.staff && Array.isArray(p.staff.lines)).map(p => p.part));
  let heads = 0, far = [], cols = 0, inStaff = [], zeros = [], signs = 0, folded = 0, hooks = [], gls = 0, glOn = 0, glHid = [];
  const GLS = LO.glissOnStaffLine || {};
  for (const f of irFiles) {
    const ir = rd(path.join('notation', 'ir', f));
    const m = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: ENS.parts.map(p => p.part), ensemble: ENS, techniques: T, fitBoxes: boxes }, LO));
    const name = f.replace('.ir.json', '');
    for (const s of m.systems) {
      if (lined.has(s.part)) continue;
      for (const it of s.items || []) {
        if (it.k === 'glyph' && /^notehead/.test(it.g || '')) { heads++; if (Math.abs(it.ySs) > th + 0.5 + 1e-9) far.push(name + ' p' + s.part + '@' + it.t.toFixed(2) + ' y ' + it.ySs.toFixed(1)); }
        if (it.k === 'ottava') signs++;
        // [§672] THE GLISS LINE ON A STAFF LINE (piece #1's rule): a level gliss line on one of the five lines carries its lift — the row's
        // offset on the row's side — and no other gliss line carries one
        if (it.k === 'glissline') {
          gls++;
          const on = (it.y1Ss == null || it.y1Ss === it.ySs) && Number.isInteger(it.ySs) && Math.abs(it.ySs) <= 2;
          const want = on ? (GLS.side === 'down' ? -1 : 1) * GLS.offsetSs : undefined;
          if (on) glOn++;
          if (it.liftSs !== want) glHid.push(name + ' p' + s.part + '@' + it.t.toFixed(2) + ' y ' + it.ySs + ' lift ' + it.liftSs);
        }
        // [§528] THE HOOK IS INK: a folded sequence head's hook (justHead's items, seq 'ottava') ends ON its spacer — anchor B's 0.45
        // before the go line (the block, the breaths, a morph's two heads) — never past it (on HEAD before §528: 0.3 past, 0.15 from the line)
        if (it.k === 'ottava' && it.seq === 'ottava') { folded++; if (it.dx1Ss > -R.anchors.B.gapSs + 1e-6) hooks.push(name + ' p' + s.part + '@' + it.t.toFixed(2) + ' hook ' + it.dx1Ss.toFixed(2)); }
        if (it.k === 'text' && (it.seq === 'cents' || it.seq === 'partial')) {
          cols++;
          const e = Fit.inkOf(it, glyphs, 1.3);
          if (e && e.hi > -2 + 1e-9 && e.lo < 2 - 1e-9) inStaff.push(name + ' p' + s.part + '@' + it.t.toFixed(2) + ' ' + it.seq + ' y ' + it.ySs.toFixed(2));
          if (it.seq === 'cents' && String(it.text) === '0') zeros.push(name + ' p' + s.part + '@' + it.t.toFixed(2));
        }
      }
    }
  }
  ok(!far.length, '(9) every head on a five-line staff lies within the ottava threshold — ' + LO.ottavaLedgerThreshold + ' ledger lines, a second\'s tolerance for a trill\'s neighbour (' + heads + ' heads, ' + signs + ' signs)' + (far.length ? ' — beyond it: ' + far.slice(0, 6).join(' · ') : ''));
  ok(!inStaff.length, '(9) no cents or partial stands inside the staff after the ladder (' + cols + ' numbers)' + (inStaff.length ? ' — inside: ' + inStaff.slice(0, 6).join(' · ') : ''));
  ok(!zeros.length, '(9) a rounded 0 cents is not written (number.centsZero ' + LO.centsZero + ')' + (zeros.length ? ' — written: ' + zeros.slice(0, 6).join(' · ') : ''));
  ok(!hooks.length, '(9) a folded sequence head\x27s hook ends on its spacer, never past it — objects.ottava.hookIsInk (' + folded + ' hooks, the spacer ' + R.anchors.B.gapSs + ' before the go line)' + (hooks.length ? ' — past it: ' + hooks.slice(0, 6).join(' · ') : ''));
  ok(GLS.offsetSs > 0 && !glHid.length, '(9) a level gliss line on a staff line is drawn off it — objects.glissLine.onStaffLine ' + GLS.offsetSs + ' ' + GLS.side + ' (' + glOn + ' of ' + gls + ' gliss lines)' + (glHid.length ? ' — wrong: ' + glHid.slice(0, 6).join(' · ') : ''));
}

console.log('');
console.log('(10) MEASURED ON EVERY PAGE — the flag · the ottava\'s hook · the dot (§376)');
ok(!M10.badFlags.length, '(10) every flag clears its staff\'s outer line by objects.flag.staff ' + M10.flagClear + ' ss, or its stem has reached clearMaxSs (' + M10.flags + ' flags)' + (M10.badFlags.length ? ' — not: ' + M10.badFlags.slice(0, 8).join(' · ') : ''));
ok(!M10.badHooks.length, '(10) every ottava bracket beside a go line ends the spacer ' + M10.hookGap + ' ss or more before it — the hook is ink (' + M10.hooks + ' brackets)' + (M10.badHooks.length ? ' — not: ' + M10.badHooks.slice(0, 8).join(' · ') : ''));
ok(!M10.badDots.length, '(10) every staccato dot keeps objects.staccatoDot.lineClearSs ' + M10.dotClear + ' ss from a line (' + M10.dots + ' dots)' + (M10.badDots.length ? ' — not: ' + M10.badDots.slice(0, 8).join(' · ') : ''));
ok(!M10.badLined.length, '(10) on a lined staff every dynamic stands on one row and every word on one row the stack gap under it — column.rows.dynamicLinedBelowSs (' + M10.linedStaves + ' lined staves with marks)' + (M10.badLined.length ? ' — not: ' + M10.badLined.slice(0, 8).join(' · ') : ''));
ok(!M10.acrossStem.length, '(10) nothing is written across a stem — no word and no dynamic spans its own note\u2019s stem (' + M10.stemMarks + ' marks)' + (M10.acrossStem.length ? ' — across: ' + [...new Set(M10.acrossStem)].slice(0, 10).join(' · ') : ''));
ok(!M10.badGraceFlags.length, '(10) every flagged grace note has its flag clear of its head — objects.graceHead.flagHeadGapSs ' + M10.graceGap + ' ss at its scale (' + M10.graceFlags + ' grace flags)' + (M10.badGraceFlags.length ? ' — not: ' + M10.badGraceFlags.slice(0, 8).join(' · ') : ''));
ok(!M10.badSlashes.length, '(10) no tremolo slash sits among ledger lines — objects.tremoloSlash.pastLedgers (' + M10.slashes + ' slashes on notes outside the staff)' + (M10.badSlashes.length ? ' — among them: ' + [...new Set(M10.badSlashes)].slice(0, 8).join(' · ') : ''));
ok(!M10.badWords.length, '(10) no technique word stands across its own go line (' + M10.words + ' words beside a go line)' + (M10.badWords.length ? ' — across: ' + M10.badWords.slice(0, 8).join(' · ') : ''));
ok(!M10.clashes.length, '(10) at no moment do a dynamic, an ottava bracket and a technique\'s word share ink (' + M10.moments + ' moments)' + (M10.clashes.length ? ' — ' + M10.clashes.length + ' clash(es): ' + M10.clashes.slice(0, 10).join(' · ') : ''));
console.log(failures ? 'RULES RED: ' + failures + ' of ' + checks + ' checks failed' : 'RULES GREEN: ' + checks + ' checks');
process.exit(failures ? 1 : 0);
