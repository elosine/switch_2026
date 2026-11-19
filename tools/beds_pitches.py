#!/usr/bin/env python
"""beds_pitches.py — WHICH PITCHES SOUND IN THE ELECTRONICS over a stretch of score time (SW-62, 2026-11-19; his word: "analyze the
electronics and see if there's any pitches going on during those sections").

  python tools/beds_pitches.py --score piece-Section03-H-addTuplets 295.3-298.4 300.9-303.0 [--top 8]

For each stretch: every material brick of the save that sounds there is read from the fund (its own place in its file), the bricks summed
as the engine sums them (the brick's trim), and the long-term spectrum taken (Hann windows of 0.37 s, averaged). Reported: the strongest
PEAKS that stand clear of the noise floor around them (so a pitch is told from a wash), each as its nearest note, how far off in cents,
how far above the floor (dB), and its level against the strongest; then the same per brick. Nothing is written.
"""
import json, subprocess, sys, os
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
args = sys.argv[1:]
score = 'piece-Section03-H-addTuplets'; top = 8; spans = []
i = 0
while i < len(args):
    if args[i] == '--score': score = args[i + 1]; i += 2
    elif args[i] == '--top': top = int(args[i + 1]); i += 2
    else:
        a, b = args[i].split('-'); spans.append((float(a), float(b))); i += 1
save = json.load(open(os.path.join(ROOT, 'scores', score + '.json'), encoding='utf-8'))
idx = json.load(open(os.path.join(ROOT, 'bank', 'materials.json'), encoding='utf-8'))
row = {m['name']: m for m in idx['materials']}
bricks = [o for o in save['objects'] if o.get('type') == 'zone' and o.get('midiModel') == 'elecMaterial' and o.get('elec') and o['elec'].get('name') in row]
SR = 44100
NOTE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']

def read(brick, a, b):
    """the brick's sound between score times a and b, mono, at SR (silence where it does not sound)"""
    s, e = max(a, brick['startTime']), min(b, brick['endTime'])
    out = np.zeros(int(round((b - a) * SR)), dtype=np.float32)
    if e <= s: return out
    el = brick['elec']; f = row[el['name']]['file']; path = f if os.path.isabs(f) else os.path.join(idx['root'], f)
    off = (el.get('offsetMs') or 0) / 1000.0 + (s - brick['startTime'])
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', '%.3f' % off, '-t', '%.3f' % (e - s), '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32) * (10 ** ((el.get('gainDb') or 0) / 20.0))
    k = int(round((s - a) * SR)); n = min(len(x), len(out) - k); out[k:k + n] = x[:n]
    return out

def spectrum(x):
    N = 16384; hop = N // 4; w = np.hanning(N); acc = np.zeros(N // 2 + 1); n = 0
    for k in range(0, max(1, len(x) - N), hop):
        seg = x[k:k + N]
        if len(seg) < N: break
        acc += np.abs(np.fft.rfft(seg * w)) ** 2; n += 1
    return (acc / max(1, n)), SR / N

def peaks(x, top):
    P, df = spectrum(x); db = 10 * np.log10(P + 1e-20); out = []
    lo, hi = int(40 / df), int(5000 / df)
    for k in range(lo + 2, hi - 2):
        if db[k] > db[k - 1] and db[k] >= db[k + 1]:
            w = max(8, int(k * 0.12)); a, b = max(lo, k - w), min(hi, k + w)
            floor = np.median(db[a:b]); prom = db[k] - floor
            if prom >= 9:
                # parabolic refinement of the peak's frequency
                y0, y1, y2 = db[k - 1], db[k], db[k + 1]; d = 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2) if (y0 - 2 * y1 + y2) != 0 else 0
                f = (k + d) * df; m = 69 + 12 * np.log2(f / 440.0); mr = int(round(m))
                out.append((db[k], prom, f, NOTE[mr % 12] + str(mr // 12 - 1), (m - mr) * 100))
    out.sort(key=lambda t: -t[0]); out = out[:top]
    ref = out[0][0] if out else 0
    return [(lvl - ref, prom, f, name, cents) for (lvl, prom, f, name, cents) in out], (10 * np.log10(np.mean(x ** 2) + 1e-20))

for (a, b) in spans:
    print('\n=== %.1f -> %.1f s ===' % (a, b))
    live = [k for k in bricks if k['endTime'] > a and k['startTime'] < b]
    parts = [(k, read(k, a, b)) for k in live]
    mix = sum((p for _, p in parts), np.zeros(int(round((b - a) * SR)), dtype=np.float32))
    pk, rms = peaks(mix, top)
    print('ALL THE BEDS TOGETHER  (level %.1f dB)' % rms)
    if not pk: print('   no peak stands 9 dB clear of the wash around it: noise-like, no pitch')
    for (rel, prom, f, name, cents) in pk: print('   %-4s %+4.0f c   %7.1f Hz   %5.1f dB above the wash   %5.1f dB under the strongest' % (name, cents, f, prom, -rel))
    for k, p in parts:
        pk, rms = peaks(p, 4)
        print('  %s (lane %d, level %.1f dB): %s' % (k['elec']['name'], k['layer'], rms, '  '.join('%s%+.0fc(%.0f)' % (n, c, pr) for (_, pr, _, n, c) in pk) or 'no clear pitch'))
