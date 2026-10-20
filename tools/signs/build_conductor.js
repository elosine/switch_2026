// tools/signs/build_conductor.js — THE CONDUCTOR'S / PRESENTATION VIEW: how the electronics are hinted at, section by section
// (decibel PLAN 2.7; RUNNING_LOG §320).
//
//   node tools/signs/build_conductor.js [--score piece-3BodyRedo]
//
// The players are NOT shown the returns (his word, DEC-99); the conductor's or presentation score may carry "a generic hint". This draws
// ONE PAGE of a section — the piece's own notes, mic openings and returns, read from the save — once per OPTION for the hint, on the
// whole 1920 × 1080 frame, and writes score/public/signs/conductor.html (http://localhost:5500/signs/conductor.html). The players'
// signs on it (the badge, the mic brick, the conductor's arc) stand where the composer score has them or where nothing is decided yet:
// PROVISIONAL — the lane's vertical map (PLAN 2.6) places them. A section, its window and its options are rows of bank/signs/conductor.json.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const CFG = rd('bank/signs/conductor.json'), MIC = rd('bank/signs/mic_opening.json');
const SCORE = arg('score', CFG.score), S = rd('scores/' + SCORE + '.json');
const { chosenBadge } = require('../language/badge_lib');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const r = v => +v.toFixed(1);

// the frame (notation/registry/container.json: 1920 × 1080, pads 8, gap 4; five lanes; a page is 12 s)
const W = 1920, H = 1080, GUT = 72, PAD = 8, GAP = 4, LINE = '#8a8a8a', GCC = '#FF15A0', SLATE = '#2d3748';
const NAMES = ['BFl', 'BCl', 'Perc', 'Va', 'Vc'], LANE_OF = [0, 1, 2, 2, 3, 4];          // the composer's six layers → the notation's five lanes
const yel = MIC.yellows.find(y => y.id === MIC.chosen.yellow).value, rc = MIC.recipes.find(x => x.id === MIC.chosen.recipe);

function frame(sec, opt) {
  const [t0, t1] = sec.window, pps = (W - GUT) / (t1 - t0), X = t => GUT + (t - t0) * pps;
  const elec = opt.kind === 'lane' ? 62 : 0;                                            // an electronics lane takes its height from the five
  const lh = (H - 2 * PAD - 4 * GAP - (elec ? elec + GAP : 0)) / 5, top = i => PAD + i * (lh + GAP), bot = i => top(i) + lh;
  const inWin = (a, b) => b > t0 && a < t1;
  const notes = S.objects.filter(o => o.type === 'waveCurve' && inWin(o.startSeconds, o.endSeconds)).map(o => ({ t: o.startSeconds, lane: LANE_OF[o.layer] }));
  const opens = S.objects.filter(o => o.midiModel === 'elecOpen' && inWin(o.startTime, o.endTime)).map(o => ({ a: o.startTime, b: o.endTime, lane: LANE_OF[o.layer] }));
  const plays = S.objects.filter(o => o.midiModel === 'elecPlay' && inWin(o.startTime, o.endTime)).map(o => ({ a: o.startTime, b: o.endTime, lane: LANE_OF[o.layer], n: (o.elec && Array.isArray(o.elec.names) && o.elec.names.length) || 1, id: o.id }));
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="frame"><rect width="' + W + '" height="' + H + '" fill="#fff"/>';
  for (let i = 0; i < 5; i++) {
    if (i) s += '<rect x="40" y="' + r(top(i) - GAP / 2 - 0.5) + '" width="' + (W - 80) + '" height="1" fill="' + LINE + '"/>';
    s += '<text x="10" y="' + r(top(i) + lh / 2 + 6) + '" font-size="19" fill="' + LINE + '" font-family="Georgia, serif">' + NAMES[i] + '</text>';
  }
  // the players' signs — PROVISIONAL places: the mic brick at the lane's top as in the composer score, the badge under it, the arc whole-lane
  const BH = r(lh / 5), badge = chosenBadge('shortAttacks', 36);
  for (const o of opens) {
    const x = X(o.a), w = (o.b - o.a) * pps, y = top(o.lane) + 2;
    s += '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + BH + '" rx="3" fill="' + yel + '" fill-opacity="' + rc.fillOpacity + '" stroke="' + yel + '" stroke-width="' + rc.strokeWidth + '" stroke-opacity="' + rc.strokeOpacity + '"/>' +
      '<circle cx="' + r(x + 11.5) + '" cy="' + r(y + BH / 2) + '" r="5.3" fill="none" stroke="#333" stroke-width="1.3"/><circle cx="' + r(x + 11.5) + '" cy="' + r(y + BH / 2) + '" r="2.3" fill="#333"/>';
  }
  for (const n of notes) {
    const x = X(n.t), a = top(n.lane), b = bot(n.lane);
    s += '<g fill="none" stroke="' + GCC + '" stroke-width="1.5"><path d="M' + r(x - 46) + ',' + r(a) + ' C' + r(x - 18) + ',' + r(a + 12) + ' ' + r(x - 4) + ',' + r(b - 70) + ' ' + r(x) + ',' + r(b) + '"/><path d="M' + r(x + 46) + ',' + r(a) + ' C' + r(x + 18) + ',' + r(a + 12) + ' ' + r(x + 4) + ',' + r(b - 70) + ' ' + r(x) + ',' + r(b) + '"/></g><circle cx="' + r(x) + '" cy="' + r(b) + '" r="3" fill="' + GCC + '"/>';
    if (badge) s += '<g transform="translate(' + r(x + 4) + ',' + r(a + 2 + BH + 8) + ')">' + badge + '</g>';
  }
  // THE HINT — the electronics' returns, by the option
  const noteOf = p => { const c = notes.filter(n => n.lane === p.lane && n.t >= p.a - 0.05 && n.t <= p.b + 0.05).sort((u, v) => Math.abs(u.t - (p.a + p.b) / 2) - Math.abs(v.t - (p.a + p.b) / 2))[0]; return c ? c.t : (p.a + p.b) / 2; };
  const rnd = seed => { let z = seed | 0; return () => { z = z + 0x6D2B79F5 | 0; let t = Math.imul(z ^ z >>> 15, 1 | z); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  plays.forEach((p, k) => {
    const xa = X(p.a), xb = X(p.b), mid = (top(p.lane) + bot(p.lane)) / 2, R = rnd(k * 97 + 13);
    if (opt.kind === 'echoTriangles') {
      // one small open triangle per returning sound, loosely across the stretch the return covers — the short attacks' own sign, greyed
      for (let i = 0; i < p.n; i++) { const x = xa + (xb - xa) * (i + 0.5 + (R() - 0.5) * 0.5) / p.n, y = mid + 36 + (R() - 0.5) * 34, q = 8;
        s += '<polygon points="' + r(x + q) + ',' + r(y - q) + ' ' + r(x + q) + ',' + r(y + q) + ' ' + r(x - q * 0.9) + ',' + r(y) + '" fill="none" stroke="' + LINE + '" stroke-width="1.6" stroke-linejoin="round"/>'; }
    } else if (opt.kind === 'band') {
      // a pale bar at the lane's bottom over the stretch, a dot per returning sound
      const y = bot(p.lane) - 34, h = 28;
      s += '<rect x="' + r(xa) + '" y="' + r(y) + '" width="' + r(xb - xa) + '" height="' + h + '" rx="3" fill="' + SLATE + '" fill-opacity="0.08" stroke="' + SLATE + '" stroke-opacity="0.35" stroke-width="1"/>';
      for (let i = 0; i < p.n; i++) s += '<circle cx="' + r(xa + 14 + i * 13) + '" cy="' + r(y + h / 2) + '" r="3.2" fill="' + SLATE + '" fill-opacity="0.55"/>';
    } else if (opt.kind === 'echoArcs') {
      // sound-wave arcs after the attack, one per returning sound
      const x = X(noteOf(p)) + 10, y = bot(p.lane) - 40;
      for (let i = 0; i < p.n; i++) { const q = 11 + i * 8, a = 0.7; s += '<path d="M' + r(x + q * Math.cos(a)) + ',' + r(y - q * Math.sin(a)) + ' A' + q + ',' + q + ' 0 0 1 ' + r(x + q * Math.cos(a)) + ',' + r(y + q * Math.sin(a)) + '" fill="none" stroke="' + LINE + '" stroke-width="1.7" stroke-linecap="round"/>'; }
    } else if (opt.kind === 'lane') {
      // a thin lane of its own under the five: a bar per return, on the row of the player whose sound it is
      const y0 = bot(4) + GAP, y = y0 + 6 + p.lane * 10.5;
      s += '<rect x="' + r(xa) + '" y="' + r(y) + '" width="' + r(xb - xa) + '" height="7" rx="2" fill="' + SLATE + '" fill-opacity="0.5"/>';
    }
  });
  if (opt.kind === 'lane') { const y0 = bot(4) + GAP; s += '<rect x="40" y="' + r(y0 - GAP / 2 - 0.5) + '" width="' + (W - 80) + '" height="1" fill="' + LINE + '"/><text x="10" y="' + r(y0 + 38) + '" font-size="19" fill="' + LINE + '" font-family="Georgia, serif">Elec</text>' + NAMES.map((n, i) => '<text x="' + (GUT - 4) + '" y="' + r(y0 + 13 + i * 10.5) + '" font-size="9" text-anchor="end" fill="' + LINE + '" font-family="Segoe UI, sans-serif">' + n + '</text>').join(''); }
  return { svg: s + '</svg>', counts: { notes: notes.length, opens: opens.length, plays: plays.length } };
}

let body = '';
for (const sec of CFG.sections) {
  if (!sec.options) { body += '<h2>' + esc(sec.name) + '</h2><p>' + esc(sec.does) + '</p><p class="note">Options to come, at its turn.</p>'; continue; }
  body += '<h2 id="' + sec.id + '">' + esc(sec.name) + ' — the options</h2><p><b>What the electronics do:</b> ' + esc(sec.does) + '</p><p class="note">The page shown: ' + sec.window[0] + ' … ' + sec.window[1] + ' s of the piece. ' + esc(sec.windowNote || '') + '</p>';
  sec.options.forEach((opt, i) => {
    const f = frame(sec, opt);
    body += '<div class="opt"><div class="oh"><span class="letter">' + String.fromCharCode(97 + i) + '</span><span class="on">' + esc(opt.name) + '</span></div><div class="od">' + esc(opt.what) + '</div><div class="of">' + esc(opt.for) + '</div>' + (opt.kind === 'none' ? '' : f.svg) + '</div>';
  });
}
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>The conductor's view — working page</title>
<style>
 body { margin: 0; background: #fff; color: #111; font: 15px/1.45 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
 main { max-width: 1180px; margin: 0 auto; padding: 28px 28px 90px; }
 h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 20px; margin: 44px 0 6px; padding-top: 18px; border-top: 2px solid #111; }
 p { margin: 4px 0 10px; max-width: 820px; } .note { color: #555; font-size: 13.5px; }
 .opt { padding: 20px 0 10px; border-bottom: 1px solid #ddd; } .oh { display: flex; align-items: baseline; gap: 12px; }
 .letter { font: 700 20px Consolas, monospace; } .on { font-size: 18px; font-weight: 600; } .od { margin: 2px 0 0 32px; max-width: 800px; } .of { margin: 0 0 12px 32px; color: #555; font-size: 14px; max-width: 800px; }
 .frame { display: block; width: 100%; height: auto; border: 1px solid #ccc; }
 ol { margin: 6px 0 0 20px; padding: 0; } ol li { margin: 0 0 5px; max-width: 820px; }
</style></head><body><main>
<h1>The conductor's view — working page</h1>
<p>The players do not see what the electronics play back. A conductor's or presentation score may carry a hint of it. One section at a time.</p>
<p class="note">On every frame the players' own signs — the yellow mic brick, the red badge, the pink arc — stand where the composer score has them or where nothing is decided yet. Their places are provisional. Look at the GREY marks: those are the hint.</p>

<h2>What the electronics do, section by section</h2>
<ol>${CFG.sections.map(x => '<li><b>' + esc(x.name) + '.</b> ' + esc(x.does) + '</li>').join('')}</ol>

${body}

<p class="note" style="margin-top:48px">Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} by node tools/signs/build_conductor.js from scores/${esc(SCORE)}.json and bank/signs/conductor.json. The frame is the score's own, 1920 × 1080, shown reduced.</p>
</main></body></html>
`;
const out = path.join(ROOT, 'score', 'public', 'signs', 'conductor.html');
fs.writeFileSync(out, html);
console.log('wrote score/public/signs/conductor.html —', CFG.sections.filter(x => x.options).map(x => x.name + ': ' + x.options.length + ' options').join(' · '));
