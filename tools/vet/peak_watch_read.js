#!/usr/bin/env node
// peak_watch_read.js (vet, 2026-10-10 RUNNING_LOG §421 · §423 · §427) — A TAKE IS READ, NOT ONLY HEARD.
// Reads the meter watch of a take (tools/vet/peak_watch_take.lua: every track's pre-fader peak, 50 ms) against the score the take
// played, and says for every note whether ITS OWN track rose near its start. It found nineteen notes with no sound under their keys
// in take 01 of piece-Draft01d that his ear had only suspected.
//
//   node tools/vet/peak_watch_read.js --score piece-Draft01d --take 02 [--from 672] [--to 784] [--floor -45] [--all]
//
// THE WATCH FILE: the Lua job writes %APPDATA%/REAPER/bridge/outbox/peak_watch_take.json and the NEXT take writes over it — so this
// reader keeps a copy in the take's own folder (notation/audio/takes/<score>/<NN>/peak_watch.json) the first time it runs for a take,
// and reads that copy afterwards. Run it once right after `take.js stop`.
// THE ORDER AT A TAKE: `node tools/take.js start --score <name>` → `REAPER_PROJECT=<name>_take node tools/reaper_job.js run
// tools/vet/peak_watch_take.lua` → his ▶ → `node tools/take.js stop` (it aligns) → this.
// WHAT IT SAYS AND DOES NOT: the meter is BEFORE the fader (RUNNING_LOG §54) — a row says the instrument SOUNDED, not how loud at the
// master; the watch's tick leads or trails a note by up to ~150 ms — it says WHETHER, not when (the alignment says when).
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : d; };
const score = arg('score'), take = arg('take');
if (!score || !take) { console.error('usage: node tools/vet/peak_watch_read.js --score <name> --take NN [--from s] [--to s] [--floor -45] [--all]'); process.exit(2); }
const FROM = +arg('from', -1e9), TO = +arg('to', 1e9), FLOOR = +arg('floor', -45), ALL = process.argv.includes('--all');
const dir = path.join(ROOT, 'notation', 'audio', 'takes', score, take), kept = path.join(dir, 'peak_watch.json');
const outbox = path.join(process.env.REAPER_BRIDGE || path.join(process.env.APPDATA, 'REAPER', 'bridge'), 'outbox', 'peak_watch_take.json');
if (!fs.existsSync(kept)) {
  if (!fs.existsSync(outbox)) { console.error('no watch for this take: neither ' + kept + ' nor the bridge\'s outbox file'); process.exit(1); }
  fs.copyFileSync(outbox, kept); console.log('(the watch copied from the bridge\'s outbox into the take\'s folder — check it is THIS take\'s: run right after its stop)');
}
const W = JSON.parse(fs.readFileSync(kept, 'utf8')), off = JSON.parse(fs.readFileSync(path.join(dir, 'align.json'), 'utf8')).offsetS;
const rows = W.rows.map(([p, i, d]) => ({ t: p - off, i: i - 1, d }));
const sc = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', score + '.json'), 'utf8'));
const INS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
// a note's own track(s), by the rack's track names (reaper/decibel_rack.rpp): a wind or a string has one; the percussion's is its
// voice's CHANNEL (bank/perc_selection.json: bongos 1 … toms 8); a mallet voice's is its instrument (the Ricotti four)
const PERC = { 1: 'Bongos ARO', 2: 'Shime Daiko ARO', 3: 'Bass Drum Alt ARO', 4: 'Wood Blocks ARO', 5: 'China Cymbal ARO', 6: 'Spring Coil ARO', 7: 'Suspended Cymbals ARO', 8: 'Toms ARO' };
const LANE = { bass_flute: [/^Bass Flute/], bass_clarinet: [/^Bass Clarinet/], viola: [/^Viola/], cello: [/^Cello/], bowed_vibraphone: [/ RM$/] };
const tracksOf = (n) => {
  const inst = sc.tracks[n.layer].instKey;
  if (inst === 'percussion') { const t = (INS.percussion.techniques || []).find(x => x.key === n.technique); return t && PERC[t.channel] ? [W.tracks.indexOf(PERC[t.channel])] : W.tracks.map((x, i) => / ARO$/.test(x) ? i : -1).filter(i => i >= 0); }
  return W.tracks.map((x, i) => (LANE[inst] || []).some(re => re.test(x)) ? i : -1).filter(i => i >= 0);
};
const notes = sc.objects.filter(o => o.type === 'waveCurve' && o.sonifyNote != null && o.startSeconds >= FROM && o.startSeconds <= TO).sort((a, b) => a.startSeconds - b.startSeconds);
let silent = 0;
console.log('take ' + take + ' of ' + score + ' · the watch ended: ' + W.why + ' · ' + W.rows.length + ' rows · score 0 at ' + off + ' s · ' + notes.length + ' notes read');
for (const n of notes) {
  const idx = tracksOf(n), win = rows.filter(r => idx.includes(r.i) && r.t >= n.startSeconds - 0.25 && r.t <= n.startSeconds + 0.35);
  const best = win.length ? win.reduce((m, r) => r.d > m.d ? r : m) : null, mx = best ? best.d : -150, quiet = mx <= FLOOR;
  if (quiet) silent++;
  if (quiet || ALL) console.log((quiet ? '  SILENT ' : '         ') + n.startSeconds.toFixed(3).padStart(8) + ' ' + sc.tracks[n.layer].short.padEnd(4) + ' ' + String(n.id).padEnd(8) + ' k' + String(n.sonifyNote).padEnd(4) + String(n.technique).padEnd(38) + (best ? mx.toFixed(0).padStart(4) + ' dB  ' + W.tracks[best.i] : 'nothing on ' + idx.map(i => W.tracks[i]).join(' · ')));
}
console.log(silent + ' of ' + notes.length + ' notes did not lift their own track above ' + FLOOR + ' dB (a held note that begins under another on the same track can hide here; a quiet patch reads low — look, then listen)');
