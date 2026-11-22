// node tools/port/scratch/items_at.js <ir id> <part> <t0> <t1>   — a scratch look: the drawn items of one part in a time window (after the fit)
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..', '..', '..'), lib = n => require(path.join(ROOT, 'notation', 'lib', n));
const L = lib('layout.js'), R = lib('rules.js'), F = lib('fit.js'), rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const C = R.loadContainer(ROOT), g = rd('notation/lib/glyphs.json'), ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json'), ir = rd('notation/ir/' + process.argv[2] + '.ir.json');
const E = L.ensembleFor(ens, (C.realizations || {})['video-jury']), P = E.parts.map(p => p.part);
const m = L.layoutSection(ir, g, Object.assign({ m4AttackLines: false, frameParts: P, ensemble: E, techniques: T, fitBoxes: F.boxesFor(C, E, P) }, (C.engraving && C.engraving.layout) || {}));
for (const s of m.systems) if (s.part === +process.argv[3]) for (const it of s.items || []) { const t = it.t != null ? it.t : it.t0; if (t >= +process.argv[4] && t <= +process.argv[5] && !/ledger|brick/.test(it.k)) console.log(JSON.stringify(it).slice(0, 240)); }
