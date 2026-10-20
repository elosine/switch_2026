# tools/palette/lascaux_match.py — A NAMED GUESS: the readings against the maker's colour chart (decibel PLAN 2.2; RUNNING_LOG §306).
#
#   python -I tools/palette/lascaux_match.py
#
# LeWitt's late acrylic wall drawings were painted with LASCAUX ARTIST (the maker's own page for his Zurich murals, 2004 — §305); which
# six of its 54 shades is not published. This reads the maker's colour chart (bank/palette/lascaux_chart/Lascaux_Artist_EN_2026.pdf,
# gitignored — fetched at his word from lascaux.ch) — each shade's number, name, pigments and its printed FULL SHADE and TINT swatches —
# and ranks, for each colour read from the photographs (bank/palette/lewitt_reading.json), the chart's nearest shades.
# IT IS A GUESS WITH A NAME ON IT, twice over: the readings are photographs (§304), and the chart says of itself "The brilliance of the
# Lascaux Artist does not reproduce well in this printing method". So lightness counts for half (the photographs' exposure and the
# chart's ink are both unsure of it); the hue and the pigment are what the guess rests on. Writes bank/palette/lascaux_match.json.
import sys, site, os
sys.path.append(site.getusersitepackages())
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))     # the reader's colour maths, beside this file (never beside a download)
import json, math, re
import numpy as np
import fitz
from lewitt_read import srgb_to_lin, lin_to_lab, hex_of, hue_of

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
PDF = os.path.join(ROOT, 'bank', 'palette', 'lascaux_chart', 'Lascaux_Artist_EN_2026.pdf')
READ = os.path.join(ROOT, 'bank', 'palette', 'lewitt_reading.json')
OUT = os.path.join(ROOT, 'bank', 'palette', 'lascaux_match.json')
L_WEIGHT = 0.5      # how much a difference of lightness counts against one of colour
TOP = 4
PIG = r'P(?:Bk|Br|[YORVBGW])\d+(?::\d+)?'

def main():
    doc = fitz.open(PDF)
    page = next(p for p in doc if len(p.get_images(full=True)) > 20)        # the page of swatches
    text = re.sub(r'\s+', ' ', page.get_text())
    rows = {}
    for m in re.finditer(r'\b(1\d\d)\s+([1-4])\s+(\*{2,3})\s+([A-Z][A-Za-z ]+?)\s+((?:' + PIG + r'\s*)+)', text):
        rows[m.group(1)] = {'number': m.group(1), 'series': int(m.group(2)), 'lightfast': m.group(3), 'name': m.group(4).strip(), 'pigments': m.group(5).split()}
    words = page.get_text('words')
    labels = {w[4]: w for w in words if re.fullmatch(r'1\d\d', w[4]) and w[4] in rows}
    imgs = [fitz.Rect(i['bbox']) for i in page.get_image_info()]
    scale = 200 / 72.0
    pix = page.get_pixmap(dpi=200, colorspace=fitz.csRGB, alpha=False)
    arr = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3)
    def patch(r, fx0, fx1):
        x0, x1 = r.x0 + fx0 * r.width, r.x0 + fx1 * r.width; y0, y1 = r.y0 + 0.18 * r.height, r.y0 + 0.82 * r.height
        p = arr[int(y0 * scale):int(y1 * scale), int(x0 * scale):int(x1 * scale)].reshape(-1, 3)
        lab = lin_to_lab(srgb_to_lin(np.median(p, axis=0)))
        return {'hex': hex_of(lab)[0], 'lab': [round(float(v), 2) for v in lab], 'hue': round(hue_of(lab), 1), 'chroma': round(float(math.hypot(lab[1], lab[2])), 1)}
    chart = []
    for num, w in sorted(labels.items()):
        # the swatch is the image that ends just above this label and starts at its left edge
        above = [r for r in imgs if abs(r.x0 - w[0]) < 8 and 0 <= w[1] - r.y1 < 14]
        row = rows[num]
        if above:
            r = max(above, key=lambda r: r.width * r.height)
            row['fullShade'] = patch(r, 0.08, 0.42); row['tint'] = patch(r, 0.58, 0.92)
        chart.append(row)
    read = json.load(open(READ, encoding='utf-8'))['families']
    def dist(a, b): return math.sqrt((L_WEIGHT * (a[0] - b[0])) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
    match = {}
    for fam in ['red', 'orange', 'yellow', 'green', 'blue', 'purple']:
        f = read.get(fam)
        if not f: continue
        refs = {k: f[k] for k in ('wallOnly', 'wallAndBridged') if f.get(k)}
        # THE EVIDENCE is each PHOTOGRAPH, not the mean (a first pass ranked against the two means and put three REDS at the head of
        # the orange: one warm photograph carries two of its five samples). A shade's score = its MEDIAN distance over the samples —
        # one odd photograph cannot carry it. The samples: a white-wall one as read, a ceiling one evened (§305), never a family the
        # photograph was evened BY.
        ev = [(s['sample'], s['lab']) for s in f['samples'] if s['ref'] == 'wall'] + \
             [(s['sample'], s['bridgedLab']) for s in f['samples'] if s['ref'] != 'wall' and s.get('bridgedLab') and s.get('bridge') != fam]
        usable = [c for c in chart if 'fullShade' in c and c['fullShade']['chroma'] >= 18]
        ref_lab = np.median(np.array([lab for _, lab in ev]), axis=0)
        cands = []
        for c in usable:
            ds = sorted(dist(lab, c['fullShade']['lab']) for _, lab in ev)
            dh = ((c['fullShade']['hue'] - hue_of(ref_lab) + 180) % 360) - 180
            cands.append({'number': c['number'], 'name': c['name'], 'pigments': c['pigments'], 'hex': c['fullShade']['hex'], 'tintHex': c['tint']['hex'],
                          'distance': round(float(np.median(ds)), 1), 'nearestSample': round(ds[0], 1), 'dHue': round(dh, 1),
                          'dLightness': round(float(c['fullShade']['lab'][0] - ref_lab[0]), 1), 'dChroma': round(float(c['fullShade']['chroma'] - math.hypot(ref_lab[1], ref_lab[2])), 1)})
        cands.sort(key=lambda c: c['distance'])
        votes = {}
        for sid, lab in ev:
            n = min(usable, key=lambda c: dist(lab, c['fullShade']['lab']))['number']; votes.setdefault(n, []).append(sid)
        gap = cands[1]['distance'] - cands[0]['distance']
        match[fam] = {'readings': {k: v['hex'] for k, v in refs.items()}, 'samples': len(ev), 'nearest': cands[:TOP],
                      'votes': dict(sorted(votes.items(), key=lambda kv: -len(kv[1]))), 'gapToSecond': round(gap, 1),
                      'firm': bool(gap >= 3.0 and len(votes.get(cands[0]['number'], [])) > len(ev) / 2)}
    out = {'_doc': 'A NAMED GUESS — the colours read from the photographs (lewitt_reading.json) against the maker\'s chart of Lascaux Artist (decibel PLAN 2.2; RUNNING_LOG §306). `chart`: the 54 shades — number, name, pigments, price series, lightfastness stars — and the FULL SHADE and TINT swatches as the chart PDF renders them on a screen (the chart: "The brilliance of the Lascaux Artist does not reproduce well in this printing method"). `match.<family>.nearest`: the chart\'s nearest full shades, each scored by its MEDIAN distance over the family\'s photographs (`distance`, lightness counted at ' + str(L_WEIGHT) + '; `nearestSample` its distance to the closest one; `dHue` in degrees, `dLightness`, `dChroma` against the photographs\' median); `votes`: which shade each photograph is nearest to; `firm`: the first is 3 or more ahead of the second AND most photographs vote for it. Which six shades LeWitt\'s studio used is NOT published: this names candidates, it identifies nothing.',
           'source': {'file': 'bank/palette/lascaux_chart/Lascaux_Artist_EN_2026.pdf', 'url': 'https://lascaux.ch/dbFile/8943/u-ce4c/Lascaux_Artist_EN_2026.pdf', 'page': 'https://lascaux.ch/en/products/colours/lascaux-artist', 'edition': '51000.02 – 01.26'},
           'lWeight': L_WEIGHT, 'chart': chart, 'match': match}
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh: json.dump(out, fh, indent=1, ensure_ascii=False); fh.write('\n')
    print('chart: %d shades named, %d with a swatch read' % (len(chart), sum(1 for c in chart if 'fullShade' in c)))
    for fam, m in match.items():
        print('\n%-7s read %s · %d photographs · %s (the first leads by %.1f)' % (fam, ' / '.join(m['readings'].values()), m['samples'], 'FIRM' if m['firm'] else 'not separated', m['gapToSecond']))
        for c in m['nearest']:
            print('   %s %-26s %-18s %s  median %5.1f  closest %5.1f  dHue %+6.1f  dL %+6.1f  dC %+6.1f' % (c['number'], c['name'], ' '.join(c['pigments']), c['hex'], c['distance'], c['nearestSample'], c['dHue'], c['dLightness'], c['dChroma']))
        print('   votes: ' + ' · '.join('%s x%d (%s)' % (n, len(v), ' '.join(v)) for n, v in m['votes'].items()))
    print('\nwrote', os.path.relpath(OUT, ROOT))

if __name__ == '__main__': main()
