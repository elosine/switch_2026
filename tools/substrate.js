// substrate.js — THE SUBSTRATES of *synthesi-alpha*, for the scattered strike's curtain (SW-93; the Switch~ piece RUNNING_LOG §298 — his word:
// "I want a proper like substrate … let's use one of those … like a bucket of sand or different pebbles. We designed a whole bunch of them").
//
// PORTED from the generator of that piece's score, `live-electronics-engine/tools/score_valpha.py` (its functions `sand` · `smooth_rock` ·
// `shard` · `comma_grain` · `ring_grain` · `block_grain` · `burr_grain`), recipe for recipe: the same skeletons, counts and proportions.
// Only the random numbers differ (numpy's generator there, a small seeded one here), so a rock here is a rock OF THAT SPECIES, not the same rock.
//   shape(species, r, seed) → an SVG path, centered on 0,0, about r in radius
'use strict';
function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const f1 = x => x.toFixed(1);
const normal = R => { let u = 0, v = 0; while (u === 0) u = R(); v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const sortedAngles = (R, k) => Array.from({ length: k }, () => R()).sort((a, b) => a - b).map(x => x * 2 * Math.PI);
// a closed curve through the midpoints of a polygon, its corners the control points (the boulder's, the comma's and the ring's outline)
const curved = (qx, qy) => { const k = qx.length, mx = qx.map((x, i) => (x + qx[(i + 1) % k]) / 2), my = qy.map((y, i) => (y + qy[(i + 1) % k]) / 2); const d = ['M' + f1(mx[k - 1]) + ' ' + f1(my[k - 1])]; for (let i = 0; i < k; i++) d.push('Q' + f1(qx[i]) + ' ' + f1(qy[i]) + ' ' + f1(mx[i]) + ' ' + f1(my[i])); return d.join(' ') + ' Z'; };
const SPECIES = {
  // sand: "grains as sand under a microscope - jagged, rock-like" — 6 … 9 corners, straight edges
  sand(r, R) { const k = 6 + Math.floor(R() * 4), ang = sortedAngles(R, k), pts = ang.map(a => { const rad = r * (0.45 + R() * 0.9); return f1(rad * Math.cos(a)) + ' ' + f1(rad * Math.sin(a)); }); return 'M' + pts.join(' L') + ' Z'; },
  // boulders: "same skeleton as sand, corners curved" — the smooth rock, a pebble
  boulders(r, R) { const k = 6 + Math.floor(R() * 3), ang = sortedAngles(R, k), tight = 0.6, rad = ang.map(() => r * (1 - tight / 2 + R() * tight)); return curved(ang.map((a, i) => rad[i] * Math.cos(a)), ang.map((a, i) => rad[i] * Math.sin(a))); },
  // shards: "tall thin vertical slivers"
  shards(r, R) { const w = r * (0.22 + R() * 0.16), h = r * (3.2 + R() * 2.2), lean = (R() - 0.5) * 1.2 * w; return 'M' + f1(-w / 2 - lean) + ' ' + f1(-h / 2) + ' L' + f1(w / 2 - lean) + ' ' + f1(-h / 2 + h * 0.07) + ' L' + f1(w / 2 + lean) + ' ' + f1(h / 2) + ' L' + f1(-w / 2 + lean) + ' ' + f1(h / 2 - h * 0.09) + ' Z'; },
  // commas: "a teardrop with a tail, all leaning the same way"
  commas(r, R) { const k = 9, rad = Array.from({ length: k }, () => r * (0.9 + R() * 0.2)); rad[0] *= 2.6 + R() * 0.9; rad[1] *= 1.3; rad[k - 1] *= 1.3; const a = 0.5 + normal(R) * 0.10, ca = Math.cos(a), sa = Math.sin(a), qx = [], qy = [];
    for (let i = 0; i < k; i++) { const an = 2 * Math.PI * i / k, px = rad[i] * Math.cos(an), py = rad[i] * Math.sin(an) * 0.72; qx.push(px * ca - py * sa); qy.push(px * sa + py * ca); } return curved(qx, qy); },
  // rings: "a rough hollow circle" (drawn stroked, not filled)
  rings(r, R) { const k = 10, ang = sortedAngles(R, k), rad = ang.map(() => r * (0.85 + R() * 0.3)); return curved(ang.map((a, i) => rad[i] * Math.cos(a)), ang.map((a, i) => rad[i] * Math.sin(a))); },
  // blocks: "a chunky quad, near axis-aligned"
  blocks(r, R) { const w = r * (1.3 + R() * 0.7), h = r * (0.9 + R() * 0.5), a = normal(R) * 0.06, ca = Math.cos(a), sa = Math.sin(a); return 'M' + [[w, h], [-w, h], [-w, -h], [w, -h]].map(p => f1(p[0] * ca - p[1] * sa) + ' ' + f1(p[0] * sa + p[1] * ca)).join(' L') + ' Z'; },
  // burrs: "a spiked star"
  burrs(r, R) { const k = 6 + Math.floor(R() * 3), a0 = R() * 3.14, pts = []; for (let i = 0; i < 2 * k; i++) { const rr = r * (i % 2 === 0 ? 1.0 : 0.28) * (0.85 + R() * 0.3), a = a0 + i * Math.PI / k; pts.push(f1(rr * Math.cos(a)) + ' ' + f1(rr * Math.sin(a))); } return 'M' + pts.join(' L') + ' Z'; },
};
function shape(species, r, seed) { const fn = SPECIES[species] || SPECIES.sand; return fn(r, rng(seed)); }
module.exports = { shape, rng, species: Object.keys(SPECIES), stroked: { rings: true } };
