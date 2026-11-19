#!/usr/bin/env python
"""beds_envelope.py — THE LOUDNESS OF THE ELECTRONICS OVER SECTION 3, and where it SWELLS (SW-64, 2026-11-19; his word: "analyze the
electronics and find me the timings of crescendos … a visualization of the electronics on another track … where you think crescendos are
… the more pronounced crescendos, start and peak points, more or less. I don't need to see every fluctuation").

  python tools/beds_envelope.py [--score piece-Section03-H-addTuplets] [--from 269] [--to 482] [--rise 6]

The save's material bricks are summed as beds_pitches.py sums them. Two curves of level in dB: a FINE one for the picture (0.1 s steps,
smoothed over 0.3 s) and a BROAD one for the swells (smoothed over 2 s). A CRESCENDO = a low point of the broad curve followed by a high
point at least --rise dB above it (default 6), found with a 3 dB hysteresis so a wobble on the way up does not end it; its start is the
low point, its peak the high point. Written to workshop/tuplets/beds_envelope.json (the workshop page draws it) and printed.
"""
import json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import beds_pitches as BP

ROOT = BP.ROOT; SR = BP.SR
args = sys.argv[1:]; score = 'piece-Section03-H-addTuplets'; A, B, RISE = 269.0, 482.0, 6.0
i = 0
while i < len(args):
    if args[i] == '--score': score = args[i + 1]
    elif args[i] == '--from': A = float(args[i + 1])
    elif args[i] == '--to': B = float(args[i + 1])
    elif args[i] == '--rise': RISE = float(args[i + 1])
    i += 2
idx, row, bricks = BP.load(score)
x, parts = BP.mix(idx, row, bricks, A, B)
DT = 0.1; hop = int(SR * DT); n = len(x) // hop
p = np.array([np.mean(x[k * hop:(k + 1) * hop] ** 2) for k in range(n)]) + 1e-12
def smooth(v, secs):
    w = max(1, int(round(secs / DT))); k = np.hanning(w + 2)[1:-1] if w > 2 else np.ones(w); k = k / k.sum()
    return np.convolve(v, k, mode='same')
fine = 10 * np.log10(smooth(p, 0.3)); broad = 10 * np.log10(smooth(p, 2.0))
# the swells: valley -> peak on the broad curve, with hysteresis
HYST = 3.0; cres = []; lo_i = 0; hi_i = 0; rising = True
for k in range(1, n):
    if rising:
        if broad[k] > broad[hi_i]: hi_i = k
        if broad[k] < broad[hi_i] - HYST:           # the way up is over: was it a swell?
            if broad[hi_i] - broad[lo_i] >= RISE: cres.append((lo_i, hi_i))
            rising = False; lo_i = k
    else:
        if broad[k] < broad[lo_i]: lo_i = k
        if broad[k] > broad[lo_i] + HYST: rising = True; hi_i = k
if rising and broad[hi_i] - broad[lo_i] >= RISE: cres.append((lo_i, hi_i))
out = {'_about': 'THE ELECTRONICS OF SECTION 3: their level and their swells (tools/beds_envelope.py from scores/' + score + '.json; drawn by the tuplet workshop)',
       't0': A, 'dt': DT, 'db': [round(float(v), 1) for v in fine], 'broad': [round(float(v), 1) for v in broad],
       'crescendos': [{'start': round(A + a * DT, 1), 'peak': round(A + b * DT, 1), 'fromDb': round(float(broad[a]), 1), 'toDb': round(float(broad[b]), 1)} for a, b in cres],
       'bricks': [{'name': k['elec']['name'], 'start': k['startTime'], 'end': k['endTime']} for k, _ in parts]}
dest = os.path.join(ROOT, 'workshop', 'tuplets', 'beds_envelope.json')
json.dump(out, open(dest, 'w', encoding='utf-8'))
print('%d crescendos of %.0f dB or more, %.0f -> %.0f s  (written: workshop/tuplets/beds_envelope.json)' % (len(cres), RISE, A, B))
for c in out['crescendos']: print('  %6.1f -> %6.1f   %4.1f s   %+5.1f dB   (%.1f -> %.1f dB)' % (c['start'], c['peak'], c['peak'] - c['start'], c['toDb'] - c['fromDb'], c['fromDb'], c['toDb']))
