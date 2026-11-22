// node tools/port/scratch/audit_horizontal.js <ir id> [parts 0,1,2,6]   — run from the repo root. AN AUDIT, it changes nothing (RUNNING_LOG §392):
// for every note of the page, WHERE ITS MARKS STAND SIDEWAYS against its own head — the dynamic, the word, the dot, the accent, the sign —
// as the offset of the mark's centre from the head's centre, in staff spaces, grouped by playing technique. A technique whose marks are all
// at 0 is a centred column; anything else is listed with its count. Also: every tremolo slash against the ledger lines of its own note.
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..', '..', '..');
const lib = n => require(path.join(ROOT, 'notation', 'lib', n));
const Layout = lib('layout.js'), Rules = lib('rules.js'), Fit = lib('fit.js');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const C = Rules.loadContainer(ROOT), glyphs = rd('notation/lib/glyphs.json'), ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json');
const id = process.argv[2], only = new Set((process.argv[3] || '0,1,2,6').split(',').map(Number)), ir = rd('notation/ir/' + id + '.ir.json');
const ENS = Layout.ensembleFor(ens, (C.realizations || {})['video-jury']), PARTS = ENS.parts.map(p => p.part);
const m = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: PARTS, ensemble: ENS, techniques: T, fitBoxes: Fit.boxesFor(C, ENS, PARTS) }, (C.engraving && C.engraving.layout) || {}));
const evById = new Map(ir.events.map(e => [e.id, e]));
const hand = new Map(); for (const o of ir.overlays || []) if (o.target && o.target.event && o.value && o.value.device) hand.set(o.target.event, Object.assign(hand.get(o.target.event) || {}, o.value.device));
const tally = {}, slashRows = [], kinds = new Set();
const r2 = x => (Math.round(x * 100) / 100).toFixed(2);
for (const s of m.systems) { if (!only.has(s.part)) continue; const its = s.items || [];
  const byT = new Map(); for (const it of its) { if (typeof it.t !== 'number') continue; const k = it.t.toFixed(4); if (!byT.has(k)) byT.set(k, []); byT.get(k).push(it); }
  for (const [k, group] of byT) {
    const heads = group.filter(it => it.k === 'glyph' && /^notehead/.test(it.g || '')); for (const it of group) if (it.k === 'glyph') kinds.add(String(it.g).replace(/-.*/, ''));
    if (heads.length !== 1) continue; const h = heads[0], G = (glyphs.notehead || {})[String(h.g).replace(/^notehead-/, '')] || {}, w = (G.wSs || 1.25) * (h.scale || 1);
    const hc = h.align === 'center' ? h.dxSs : h.dxSs + w / 2;   // the head's centre
    const ev = evById.get(h.ev) || ir.events.find(e => Math.abs(e.onset - h.t) < 1e-3 && (ir.chunks.find(c => (c.events || []).includes(e.id)) || {}).part === s.part);
    const hd = ev ? hand.get(ev.id) || {} : {}, tech = (ev ? ev.technique : '?') + (hd.grace ? ' (grace)' : hd.nhAnchor === 'leftEdge' ? ' (in a beam)' : '');
    const add = (what, off) => { const key = tech + ' | ' + what; (tally[key] = tally[key] || {})[r2(off)] = ((tally[key] || {})[r2(off)] || 0) + 1; };
    for (const it of group) {
      if (it.k === 'glyph' && /^dyn-/.test(it.g)) add('dynamic', it.dxSs - hc);
      else if (it.k === 'glyph' && /^artic-/.test(it.g)) add(it.g.replace('artic-', 'sign '), it.dxSs - hc);
      else if (it.k === 'dot' || (it.k === 'glyph' && /dot/.test(it.g || ''))) add('dot', it.dxSs - hc);
      else if (it.k === 'text' && it.seq === 'techText') { const wT = String(it.text).length * 0.5 * (it.sizeSs || it.em || 1.6), c = it.anchor === 'middle' ? it.dxSs : it.anchor === 'end' ? it.dxSs - wT / 2 : it.dxSs + wT / 2; add('word "' + it.text + '" [' + it.anchor + ']', c - hc); }
    }
    const sl = group.filter(it => it.k === 'slash' && it.seq === 'tremolo'), led = group.filter(it => it.k === 'ledger');
    if (sl.length && led.length) { let near = Infinity; for (const a of sl) for (const l of led) { const y = l.ySs != null ? l.ySs : l.y; const lo = Math.min(a.y0Ss, a.y1Ss) - a.thickSs / 2, hi = Math.max(a.y0Ss, a.y1Ss) + a.thickSs / 2; near = Math.min(near, y >= lo && y <= hi ? 0 : Math.min(Math.abs(y - lo), Math.abs(y - hi))); }
      slashRows.push('part ' + s.part + ' @' + h.t.toFixed(2) + ': ' + led.length + ' ledger line(s), the nearest slash edge ' + r2(near) + ' ss from one'); }
  }
}
console.log('HEAD GLYPH KINDS SEEN: ' + [...kinds].join(' '));
console.log('SIDEWAYS — the mark\'s centre against the head\'s centre (ss): offset × how many');
for (const k of Object.keys(tally).sort()) console.log('  ' + k + ': ' + Object.entries(tally[k]).sort((a, b) => a[0] - b[0]).map(([o, n]) => o + ' ×' + n).join(' · '));
console.log('TREMOLO SLASHES ON NOTES WITH LEDGER LINES: ' + slashRows.length); for (const r of slashRows) console.log('  ' + r);
