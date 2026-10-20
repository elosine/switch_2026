# tools/palette/lewitt_read.py — LEWITT'S LATE ACRYLIC COLOURS, READ FROM PHOTOGRAPHS (decibel PLAN 2.2; RUNNING_LOG §303 · §304).
#
#   python -I tools/palette/lewitt_read.py [--diag]
#
# Reads bank/palette/lewitt_sources.json (the photographs, the regions) and bank/palette/photos/*.jpg; writes
# bank/palette/lewitt_reading.json. A colour picker reads ONE pixel, and a pixel is the paint x the gallery's light x the camera x the
# reflections x the JPEG. This reads MANY pixels of SEVERAL photographs against ONE reference:
#   1. THE WHITE of each photograph — bright, near-neutral, unclipped pixels in the sample's `white` rectangle (the wall the drawing is
#      on where there is one) — and the photograph corrected by it: the colour cast out, the exposure set so that white reads as a white
#      wall of reflectance WHITE_Y. Every colour is then a SURFACE colour relative to that wall.
#   2. THE FIELDS — inside the sample's `region` (a rectangle holding only the painted wall), the INTERIOR pixels (each like its
#      neighbours: edges, JPEG ringing and the mixing between small shapes fall away), the saturated ones clustered in Lab.
#   3. A FIELD'S COLOUR = the MEDIAN of its cluster (glare and the brush fall away); each cluster named a family by its hue.
#   4. ACROSS THE PHOTOGRAPHS — per family the mean in Lab and the SPREAD (how far the samples lie from it): the spread is the honest
#      size of the doubt. The result is a colour DERIVED FROM LeWitt, never a measurement of his paint.
# -I: Python loads no code from the photographs' folder or the environment; the image library sits in the user's site folder, named below.
import sys, site
sys.path.append(site.getusersitepackages())
import os, json, math
import numpy as np
from PIL import Image

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(ROOT, 'bank', 'palette', 'lewitt_sources.json')
PHOTOS = os.path.join(ROOT, 'bank', 'palette', 'photos')
OUT = os.path.join(ROOT, 'bank', 'palette', 'lewitt_reading.json')

WHITE_Y = 0.88        # a white gallery wall taken as 88 % reflectance
SAT_MIN = 30.0        # the chroma (Lab C*) a pixel needs to count as paint
INTERIOR_DE = 4.5     # a pixel is INTERIOR when its neighbours at 1 and 2 px lie within this many dE of it
K = 10                # clusters asked of a region (more than the paints: a lit and a shaded stretch of one paint may split, then merge)
MERGE_DE = 7.0        # clusters whose medians lie within this are one field
MIN_SHARE = 0.012     # a field smaller than this share of the region's paint is not reported
SPLIT_HUE = 4.0       # two warm fields of one region this many degrees of hue apart are two paints: the red and the orange
FAMILIES = [('red', 18, 41.5), ('orange', 41.5, 68), ('yellow', 70, 104), ('green', 122, 176), ('blue', 244, 292), ('purple', 292, 336)]

def srgb_to_lin(u8):
    c = u8.astype(np.float64) / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def lin_to_srgb8(lin):
    lin = np.clip(lin, 0.0, 1.0)
    c = np.where(lin <= 0.0031308, lin * 12.92, 1.055 * np.power(lin, 1 / 2.4) - 0.055)
    return np.clip(np.round(c * 255.0), 0, 255).astype(int)

M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
MI = np.linalg.inv(M)
WP = np.array([0.95047, 1.0, 1.08883])

def lin_to_lab(lin):
    xyz = np.clip(lin, 0, None) @ M.T / WP
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], axis=-1)

def lab_to_lin(lab):
    lab = np.asarray(lab, dtype=np.float64)
    fy = (lab[..., 0] + 16) / 116; fx = fy + lab[..., 1] / 500; fz = fy - lab[..., 2] / 200
    inv = lambda f: np.where(f ** 3 > 216 / 24389, f ** 3, (116 * f - 16) / (24389 / 27))
    return (np.stack([inv(fx), inv(fy), inv(fz)], axis=-1) * WP) @ MI.T

def hex_of(lab):
    lin = lab_to_lin(lab)
    r, g, b = lin_to_srgb8(lin)
    return '#%02X%02X%02X' % (r, g, b), bool((lin < -0.002).any() or (lin > 1.002).any())   # the hex, and whether it had to be clipped into sRGB

def hue_of(lab): return (math.degrees(math.atan2(lab[2], lab[1])) + 360) % 360
def family_of(h):
    for name, a, b in FAMILIES:
        if a <= h < b: return name
    return None

def box(arr, r):
    h, w = arr.shape[:2]
    return arr[round(r[1] * h):round(r[3] * h), round(r[0] * w):round(r[2] * w)]

def white_of(px8, lin):
    """The white of a rectangle: (linear RGB, how many pixels, how near clipping). Two passes: the cast, then the pixels neutral ABOUT it."""
    p = px8.reshape(-1, 3); l = lin.reshape(-1, 3)
    lab = lin_to_lab(l); C = np.hypot(lab[:, 1], lab[:, 2])
    ok = p.max(axis=1) < 251
    cand = ok & (lab[:, 0] > 72) & (C < 22)
    if cand.sum() < 150: cand = ok & (lab[:, 0] > 58) & (C < 26)
    if cand.sum() < 50: return None
    a0, b0 = np.median(lab[cand, 1]), np.median(lab[cand, 2])
    near = cand & (np.hypot(lab[:, 1] - a0, lab[:, 2] - b0) < 6)
    top = near & (lab[:, 0] >= np.percentile(lab[near, 0], 55))     # the lit wall, not its shaded stretches
    W = np.median(l[top], axis=0)
    blown = float(((p.max(axis=1) >= 251) & (p.min(axis=1) > 200)).sum() / max(1, p.shape[0]))
    return W, int(top.sum()), blown

def kmeans(X, k, iters=30):
    # farthest-point start (deterministic): the first centre the most saturated pixel
    c = [X[np.argmax(np.hypot(X[:, 1], X[:, 2]))]]
    d = ((X - c[0]) ** 2).sum(axis=1)
    for _ in range(1, k):
        c.append(X[np.argmax(d)]); d = np.minimum(d, ((X - c[-1]) ** 2).sum(axis=1))
    c = np.array(c)
    for _ in range(iters):
        lab = np.argmin(((X[:, None, :] - c[None, :, :]) ** 2).sum(axis=2), axis=1)
        new = np.array([X[lab == j].mean(axis=0) if (lab == j).any() else c[j] for j in range(k)])
        if np.allclose(new, c, atol=0.02): break
        c = new
    return lab

def read_sample(s, cache, diag):
    if s['file'] not in cache:
        im = Image.open(os.path.join(PHOTOS, s['file'])).convert('RGB')
        px = np.asarray(im); cache[s['file']] = (px, srgb_to_lin(px))
    px, lin = cache[s['file']]
    w = white_of(box(px, s['white']), box(lin, s['white']))
    if w is None: raise SystemExit('no white found for ' + s['id'])
    W, wn, blown = w
    gain = WHITE_Y / W
    rp, rl = box(px, s['region']), box(lin, s['region']) * gain
    lab = lin_to_lab(rl)
    H, Wd = lab.shape[:2]
    # INTERIOR: like its neighbours at 1 and 2 px, in the four directions
    inner = np.ones((H, Wd), dtype=bool)
    for dy, dx in [(0, 1), (1, 0), (0, 2), (2, 0)]:
        near = np.sqrt(((lab[dy:, dx:] - lab[:H - dy, :Wd - dx]) ** 2).sum(axis=2)) < INTERIOR_DE   # each pixel against the one dy, dx on
        ahead = np.ones((H, Wd), dtype=bool); ahead[:H - dy, :Wd - dx] = near                         # … the neighbour ahead of it
        behind = np.ones((H, Wd), dtype=bool); behind[dy:, dx:] = near                                # … and the one behind (the frame's edge counts as like)
        inner &= ahead & behind
    C = np.hypot(lab[..., 1], lab[..., 2])
    unclipped = rp.max(axis=2) < 252
    paint = inner & (C > SAT_MIN)
    X = lab[paint]; clip_share = float((paint & ~unclipped).sum() / max(1, paint.sum()))
    fields = []
    if X.shape[0] > 400:
        rng = np.random.default_rng(7)
        Xs = X if X.shape[0] <= 60000 else X[rng.choice(X.shape[0], 60000, replace=False)]
        lab_k = kmeans(Xs, min(K, max(2, Xs.shape[0] // 200)))
        cl = []
        for j in range(lab_k.max() + 1):
            P = Xs[lab_k == j]
            if P.shape[0] < 30: continue
            cl.append({'n': int(P.shape[0]), 'P': P, 'med': np.median(P, axis=0)})
        cl.sort(key=lambda c: -c['n'])
        merged = []
        for c in cl:                                               # clusters on one field become one
            for m in merged:
                if math.dist(c['med'], m['med']) < MERGE_DE:
                    m['P'] = np.vstack([m['P'], c['P']]); m['n'] += c['n']; m['med'] = np.median(m['P'], axis=0); break
            else: merged.append(c)
        tot = sum(m['n'] for m in merged)
        for m in merged:
            share = m['n'] / tot
            if share < MIN_SHARE: continue
            med = m['med']; q = np.percentile(m['P'], [25, 75], axis=0)
            hx, clipped = hex_of(med)
            fields.append({'family': family_of(hue_of(med)), 'hue': round(hue_of(med), 1), 'chroma': round(float(math.hypot(med[1], med[2])), 1),
                           'lab': [round(float(v), 2) for v in med], 'iqr': [round(float(v), 1) for v in (q[1] - q[0])], 'share': round(float(share), 3),
                           'hex': hx, 'outOfGamut': clipped})
        fields.sort(key=lambda f: f['hue'])
        # RED AGAINST ORANGE, told inside ONE photograph: in these photographs his orange is a red-orange only ~6 degrees of hue from his red
        # (found on 1112 and 1152 — a fixed boundary put both in "red"). Where a region's two largest warm fields differ by SPLIT_HUE degrees
        # or more, the lower is the red and the higher the orange; where they do not, they are one paint in two lights.
        warm = sorted([f for f in fields if 18 <= f['hue'] < 68], key=lambda f: -f['share'])
        if len(warm) >= 2 and abs(warm[0]['hue'] - warm[1]['hue']) >= SPLIT_HUE:
            lo, hi = sorted([warm[0]['hue'], warm[1]['hue']])
            for f in warm: f['family'] = 'red' if abs(f['hue'] - lo) <= abs(f['hue'] - hi) else 'orange'
    dark = inner & (lab[..., 0] < 20) & (C < 14)
    black = None
    if dark.sum() / (H * Wd) > 0.02:
        mb = np.median(lab[dark], axis=0); black = {'lab': [round(float(v), 2) for v in mb], 'hex': hex_of(mb)[0], 'share': round(float(dark.sum() / (H * Wd)), 3)}
    out = {'id': s['id'], 'work': s['work'], 'file': s['file'], 'ref': s['ref'],
           'white': {'asPhotographed': [int(v) for v in lin_to_srgb8(W)], 'lab': [round(float(v), 2) for v in lin_to_lab(W)], 'pixels': wn,
                     'gain': [round(float(v), 3) for v in gain], 'blownShare': round(blown, 3)},
           'region': {'pixels': int(H * Wd), 'interiorShare': round(float(inner.mean()), 3), 'paintPixels': int(paint.sum()), 'paintClippedShare': round(clip_share, 3)},
           'fields': fields, 'black': black}
    if diag:
        print('\n%s · %s · %s · white %s (Lab %s, %d px, ref %s) · gain %s · interior %.0f%% · paint px %d · clipped %.1f%%' % (
            s['id'], s['work'], s['file'], out['white']['asPhotographed'], out['white']['lab'], wn, s['ref'], out['white']['gain'],
            100 * out['region']['interiorShare'], out['region']['paintPixels'], 100 * clip_share))
        for f in fields: print('   %-7s hue %5.1f  C* %5.1f  share %4.1f%%  Lab %-24s iqr %-17s %s%s' % (f['family'] or '?', f['hue'], f['chroma'], 100 * f['share'], f['lab'], f['iqr'], f['hex'], '  (clipped into sRGB)' if f['outOfGamut'] else ''))
        if black: print('   black   share %4.1f%%  Lab %s %s' % (100 * black['share'], black['lab'], black['hex']))
    return out

def main():
    diag = '--diag' in sys.argv
    src = json.load(open(SRC, encoding='utf-8'))
    cache = {}
    samples = [read_sample(s, cache, diag) for s in src['samples']]
    # ACROSS THE PHOTOGRAPHS: per family, each sample's field (its largest of that family), the mean in Lab, the spread
    fam = {}
    for name in [f[0] for f in FAMILIES] + ['black']:
        rows = []
        for s in samples:
            if name == 'black':
                if s['black']: rows.append({'sample': s['id'], 'work': s['work'], 'ref': s['ref'], 'lab': s['black']['lab'], 'hex': s['black']['hex']})
                continue
            fs = [f for f in s['fields'] if f['family'] == name]
            if fs:
                f = max(fs, key=lambda f: f['share'])
                rows.append({'sample': s['id'], 'work': s['work'], 'ref': s['ref'], 'lab': f['lab'], 'hex': f['hex'], 'chroma': f['chroma'], 'hue': f['hue'], 'share': f['share']})
        if not rows: continue
        def centre(rs):
            L = np.array([r['lab'] for r in rs]); m = L.mean(axis=0)
            de = np.sqrt(((L - m) ** 2).sum(axis=1))
            hx, clipped = hex_of(m)
            return {'lab': [round(float(v), 2) for v in m], 'hex': hx, 'outOfGamut': clipped, 'n': len(rs), 'spreadMeanDE': round(float(de.mean()), 1), 'spreadMaxDE': round(float(de.max()), 1)}
        wall = [r for r in rows if r['ref'] == 'wall']
        fam[name] = {'all': centre(rows), 'wallOnly': centre(wall) if wall else None, 'samples': rows, '_centre': centre}
    # THE BRIDGE (RUNNING_LOG §305): a photograph whose only white is the ceiling has its EXPOSURE wrong (the beams are in other light than
    # the wall: on 901 and 1081 the yellow came out lighter than the white). A paint it SHARES with the wall photographs sets it right: its
    # exposure is scaled until that paint is as light as the wall photographs' mean of it — the YELLOW where it has one (the family they
    # agree on best), else the GREEN (880 is orange and green only). One number per photograph; the hue and the cast are left as read.
    # It assumes the shared paint is the same paint in both works. The bridge family's own row is not evidence (it was forced).
    Y_of = lambda lab: ((lab[0] + 16) / 116) ** 3
    for s in samples:
        if s['ref'] == 'wall': continue
        mine = {n: next((r for r in v['samples'] if r['sample'] == s['id']), None) for n, v in fam.items()}
        via = next((b for b in ('yellow', 'green') if mine.get(b) and fam[b]['wallOnly']), None)
        if not via: continue
        k = Y_of(fam[via]['wallOnly']['lab']) / Y_of(mine[via]['lab'])
        for n, r in mine.items():
            if not r: continue
            lab_b = lin_to_lab(lab_to_lin(np.array(r['lab'])) * k)
            r['bridge'] = via; r['bridgeK'] = round(float(k), 3)
            r['bridgedLab'] = [round(float(v), 2) for v in lab_b]; r['bridgedHex'] = hex_of(lab_b)[0]
    for name, v in fam.items():
        centre = v.pop('_centre')
        rs = [{'lab': r['lab']} for r in v['samples'] if r['ref'] == 'wall'] + [{'lab': r['bridgedLab']} for r in v['samples'] if r.get('bridgedLab') and r.get('bridge') != name]
        v['wallAndBridged'] = centre(rs) if rs else None
    out = {'_doc': 'LeWitt\'s late acrylic colours read from photographs — tools/palette/lewitt_read.py (decibel PLAN 2.2, RUNNING_LOG §304 · §305). `families.<name>.all` = the mean of every sample as read; `wallOnly` = of the samples whose white is the wall the drawing is on (the better reference); `wallAndBridged` = those plus the ceiling samples with their exposure set right through a shared paint (a sample\'s `bridge` · `bridgeK` · `bridgedHex`); `spread…DE` = how far the samples lie from the mean, in Lab dE (2 is a just-seen difference, 10 a plain one). A colour DERIVED FROM the photographs, not a measurement of the paint.',
           'method': {'whiteY': WHITE_Y, 'satMin': SAT_MIN, 'interiorDE': INTERIOR_DE, 'k': K, 'mergeDE': MERGE_DE, 'minShare': MIN_SHARE, 'families': FAMILIES},
           'families': fam, 'samples': samples}
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh: json.dump(out, fh, indent=1, ensure_ascii=False); fh.write('\n')
    print('\n=== ACROSS THE PHOTOGRAPHS')
    for name, v in fam.items():
        a, w = v['all'], v['wallOnly']
        print('%-7s all %s (n %d, spread mean %.1f max %.1f)%s' % (name, a['hex'], a['n'], a['spreadMeanDE'], a['spreadMaxDE'],
              '   wall-only %s (n %d, spread mean %.1f max %.1f)' % (w['hex'], w['n'], w['spreadMeanDE'], w['spreadMaxDE']) if w else ''))
        print('        ' + '  '.join('%s %s' % (r['sample'], r['hex']) for r in v['samples']))
        br = [r for r in v['samples'] if r.get('bridgedHex')]
        if br:
            b = v['wallAndBridged']
            print('        bridged: ' + '  '.join('%s %s (via %s x%.2f)' % (r['sample'], r['bridgedHex'], r['bridge'], r['bridgeK']) for r in br))
            if b: print('        wall + bridged %s (n %d, spread mean %.1f max %.1f)' % (b['hex'], b['n'], b['spreadMeanDE'], b['spreadMaxDE']))
    print('\nwrote', os.path.relpath(OUT, ROOT))

if __name__ == '__main__': main()
