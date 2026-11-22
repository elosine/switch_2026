// node tools/port/scratch/fit_at.js <ir id> <part> <t>   — a scratch look: the lane box of a part, and how far the unit at t passes it (the fit's own numbers)
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..', '..', '..'), lib = n => require(path.join(ROOT, 'notation', 'lib', n));
const L = lib('layout.js'), R = lib('rules.js'), F = lib('fit.js'), rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const C = R.loadContainer(ROOT), g = rd('notation/lib/glyphs.json'), ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json'), ir = rd('notation/ir/' + process.argv[2] + '.ir.json');
const E = L.ensembleFor(ens, (C.realizations || {})['video-jury']), P = E.parts.map(p => p.part), boxes = F.boxesFor(C, E, P);
console.log('parts', P.join(','), 'box', JSON.stringify(boxes.byKey[process.argv[3]]), 'ssPerSec', boxes.ssPerSec);
const m = L.layoutSection(ir, g, Object.assign({ m4AttackLines: false, frameParts: P, ensemble: E, techniques: T, fitBoxes: boxes }, (C.engraving && C.engraving.layout) || {}));
const rows = F.measureModel(m, boxes, g, 1.3).filter(r => String(r.part) === process.argv[3] && Math.abs(r.t - +process.argv[4]) < 0.05);
console.log(JSON.stringify(rows).slice(0, 700));
for (const r of (m.fit || []).filter(r => String(r.part) === process.argv[3] && Math.abs(r.t - +process.argv[4]) < 0.05)) console.log('MODEL.FIT', JSON.stringify(r).slice(0, 1500));
console.log('model.fit rows:', (m.fit || []).length, (m.fit || []).map(r => r.part + '@' + (+r.t).toFixed(2) + ':' + r.rung).join(' ').slice(0, 900));
