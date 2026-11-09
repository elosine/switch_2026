#!/usr/bin/env node
// beat_end.js — EVERY BEATING LANE CARRIED TO ONE END, with a fade (SW-22, RUNNING_LOG §125, 2026-11-09: "extend them all to 96.6 … a 2-second
// fade ending at 96.6 in all parts"). For each lane that holds a sine brick: the player's held tones go on past the last pair — at the pitch,
// holding the beating where it stood (the bend flat at its last cents; a crotale straight) — by bank/breath_rules.json, the last one ending
// exactly at --end with a diminuendo to niente over its last --fade seconds; the sine runs to --end (a constant sine's brick stretched; a
// gliding sine's last brick stretched with its line kept in time and its last value held) and falls to silence over --fade (fadeOutMs).
//
//   node tools/beat_end.js --score <name> --end 96.6 --fade 2 [--lanes alto_sax,clarinet,…] [--dry]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const r1 = (x) => Math.round(x * 10) / 10, r3 = (x) => Math.round(x * 1000) / 1000;
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const name = arg('score') || die('--score'), END = +arg('end', 96.6), FADE = +arg('fade', 2);
const file = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(file)) die('no such score');
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const LANES = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'sine_behaviours.json'), 'utf8')).lanes;
const BR = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'breath_rules.json'), 'utf8'));
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
let nextId = s.nextId || (Math.max(0, ...s.objects.map((o) => +((/-(\d+)$/.exec(o.id || '') || [])[1] || 0))) + 1);
let seed = 7; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const roll = (r) => r[0] + rnd() * (r[1] - r[0]);
const only = arg('lanes') ? String(arg('lanes')).split(',') : null;
const lanes = [...new Set(s.objects.filter((o) => o.midiModel === 'elecSine').map((o) => o.layer))].filter((l) => !only || only.includes(TRACKS[l].instKey) || only.includes(TRACKS[l].id));
const out = [];
for (const lane of lanes) {
    const instKey = TRACKS[lane].instKey, L = LANES[instKey] || {}, WHO = L.who === 'sine' ? 'sine' : 'player';
    const isString = /violin|viola|cello|bass/.test(instKey), isCrotale = WHO === 'sine' && /vib|crot|perc|glock/.test(instKey);
    const notes = s.objects.filter((o) => o.type === 'waveCurve' && o.layer === lane && o.sonifyNote != null).sort((p, q) => p.startSeconds - q.startSeconds);
    const bricks = s.objects.filter((o) => o.midiModel === 'elecSine' && o.layer === lane).sort((p, q) => p.startTime - q.startTime);
    if (!notes.length || !bricks.length) continue;
    const last = notes[notes.length - 1], mark = (last.properties && last.properties.sine && last.properties.sine.was ? null : null) || null;
    const noteMark = (bricks[bricks.length - 1].properties.beat || {}).note || 'f';
    const dynCol = MARKS.indexOf(noteMark) < 3 ? 'p' : MARKS.indexOf(noteMark) <= 4 ? 'mf' : 'f';
    // the held tones on, to END
    const lastCents = last.morphBend ? last.morphBend[last.morphBend.length - 1][1] : 0;
    let t = last.endSeconds; const added = [];
    const gapR = isCrotale ? [BR.crotale.gapS, BR.crotale.gapS] : isString ? BR.bowChangeS : BR.inhaleS;
    const ceil = isCrotale ? BR.crotale.targetS : (isString ? BR.bowCeilingS : (BR.ceilingS.find((q) => last.sonifyNote >= q.lo && last.sonifyNote <= q.hi) || BR.ceilingS[BR.ceilingS.length - 1]))[dynCol];
    while (END - t > 0.3) {
        const gap = roll(gapR); let a = r3(t + gap);
        if (END - a < BR.minLastS) { // too little left: the previous tone takes the rest
            const prev = added.length ? added[added.length - 1] : last; prev.endSeconds = END; if (prev.morphBend) prev.morphBend[prev.morphBend.length - 1][0] = r3(END - prev.startSeconds); break;
        }
        let len = isCrotale ? Math.min(BR.crotale.ceilingS, ceil * (0.8 + rnd() * 0.4)) : ceil * roll(BR.heldShare);
        if (a + len > END || END - (a + len) < BR.minLastS + gapR[0]) len = END - a;
        const n = JSON.parse(JSON.stringify(last)); n.id = 'wc-' + (nextId++); n.startSeconds = a; n.endSeconds = r3(a + len);
        if (n.morphBend) n.morphBend = [[0, lastCents], [r3(len), lastCents]];
        if (n.properties && n.properties.sine) { n.properties.sine.held = { k: 'on', fromCents: lastCents, toCents: lastCents, extended: true }; }
        n.performanceNotes = (last.performanceNotes || '').replace(/held tone \d+ of \d+:.*$/, '').replace(/held \d+ of \d+.*$/, '') + ' · held on at ' + lastCents + ' c (the end, SW-22)';
        added.push(n); t = n.endSeconds;
    }
    if (!added.length && last.endSeconds < END) { last.endSeconds = END; if (last.morphBend) last.morphBend[last.morphBend.length - 1][0] = r3(END - last.startSeconds); }
    // the diminuendo on the final tone: its level to niente over the last FADE seconds (the nodes' heights; the stack performs a shape through the fader)
    const fin = added.length ? added[added.length - 1] : last, len = fin.endSeconds - fin.startSeconds, y = fin.nodes[0].y;
    fin.nodes = len > FADE + 0.2 ? [{ pos: 0, y, smooth: 0.25 }, { pos: r3((len - FADE) / len), y, smooth: 0.25 }, { pos: 1, y: 0.05, smooth: 0.25 }] : [{ pos: 0, y, smooth: 0.25 }, { pos: 1, y: 0.05, smooth: 0.25 }];
    fin.segments = fin.nodes.slice(1).map(() => ({ model: 'power', slope: 0 }));
    fin.performanceNotes = (fin.performanceNotes || '') + ' · dim. al niente over the last ' + FADE + ' s';
    s.objects.push(...added);
    // the sine to END, falling over FADE
    const lastB = bricks[bricks.length - 1];
    if (WHO === 'player') { lastB.endTime = END; }
    else {   // a gliding sine: the line kept in TIME, the last value held to the new end
        const oldLen = lastB.endTime - lastB.startTime, newLen = END - lastB.startTime, g = lastB.elec.gliss || {};
        if (Array.isArray(g.points) && g.points.length) { const pts = g.points.map(([f, c]) => [r3(f * oldLen / newLen), c]); pts.push([1, pts[pts.length - 1][1]]); g.points = pts.slice(0, 8); }
        lastB.endTime = END;
    }
    lastB.elec.fadeOutMs = Math.round(FADE * 1000);
    if (lastB.properties && lastB.properties.beat) { lastB.properties.beat.endS = END; lastB.properties.beat.fadeOutMs = Math.round(FADE * 1000); }
    out.push(TRACKS[lane].label.padEnd(10) + ' → ' + END + ' s: ' + (added.length ? added.length + ' held tone(s) on (' + added.map((n) => r1(n.endSeconds - n.startSeconds) + ' s').join(' ') + ')' : 'the last tone stretched') + ' at ' + lastCents + ' c · the final tone dim. over ' + FADE + ' s · the sine ' + (WHO === 'player' ? 'constant' : 'gliding, its line kept') + ' to ' + END + ', out over ' + FADE + ' s');
}
s.objects.sort((p, q) => (p.startTime != null ? p.startTime : p.startSeconds) - (q.startTime != null ? q.startTime : q.startSeconds));
console.log(out.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.nextId = nextId; s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json — ' + s.objects.length + ' objects · File ▾ → Reload in the page');
