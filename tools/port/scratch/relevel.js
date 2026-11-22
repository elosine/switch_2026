// node relevel.js <lane> [<lane> …]   — run from the repo root. After tools/dyn_deal.js has written new written dynamics for a lane: each note's
// SENT values (velAbs, and the Kontakt voices' cc7Plain) are moved along the parity its own voice already has (the three measured points
// 83 · 100 · 127 kept on its notes), so an f (109) is sent between the mf and the fff points. The rack is not touched. (RUNNING_LOG §384 · §387)
const fs = require('fs'), f = 'scores/piece-FirstDraft-Final-D-ctptCello.json', j = JSON.parse(fs.readFileSync(f, 'utf8'));
const lanes = process.argv.slice(2).map(Number);
const interp = (m, w, k) => { const ks = Object.keys(m).map(Number).filter(x => m[x][k] != null).sort((a, b) => a - b); if (!ks.length) return null; if (m[w] && m[w][k] != null) return m[w][k]; if (w <= ks[0]) return m[ks[0]][k]; if (w >= ks[ks.length - 1]) return m[ks[ks.length - 1]][k];
  for (let i = 1; i < ks.length; i++) if (w <= ks[i]) { const a = ks[i - 1], b = ks[i]; return Math.round(m[a][k] + (m[b][k] - m[a][k]) * (w - a) / (b - a)); } };
for (const L of lanes) {
  const ns = j.objects.filter(o => o.type === 'waveCurve' && o.layer === L && o.startSeconds >= 199 && o.startSeconds < 254), map = {}, tally = {};
  for (const o of ns) { const p = (o.properties || {}).parity; if (!p || p.written == null || p.releveled) continue; (map[o.technique] = map[o.technique] || {})[p.written] = [o.velAbs == null ? null : o.velAbs, o.cc7Plain == null ? null : o.cc7Plain]; }
  let n = 0, miss = 0;
  for (const o of ns) { const m = map[o.technique]; if (!m || !o.properties || !o.properties.dyn) { miss++; continue; }
    const v = interp(m, o.recVel, 0), c = interp(m, o.recVel, 1);
    if (v != null) o.velAbs = v; else delete o.velAbs; if (c != null) o.cc7Plain = c; else delete o.cc7Plain;
    o.properties.parity = Object.assign({}, o.properties.parity, { written: o.recVel, velAbs: v, cc7: c, releveled: '§420: the new written dynamic sent by this voice\'s own parity (between its measured points for an f); the rack untouched' });
    n++; const k = o.technique + ' ' + o.properties.dyn.level + ' → ' + (v != null ? 'velocity ' + v : '') + (c != null ? ' CC7 ' + c : ''); tally[k] = (tally[k] || 0) + 1; }
  console.log('lane ' + L + ': ' + n + ' re-leveled' + (miss ? ', ' + miss + ' without a parity to follow' : '')); for (const k of Object.keys(tally).sort()) console.log('   ' + tally[k] + ' × ' + k);
}
fs.writeFileSync(f, JSON.stringify(j));
