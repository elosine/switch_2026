r"""word_widths.py — THE TRUE WIDTH OF EVERY TECHNIQUE WORD, measured in the score's italic face (the Switch~ piece RUNNING_LOG §393).
Prints the table for rules.json objects.instruction.widthEm (a word's width in ems). The layout places a word against its go line by
this width; a word not in the table falls back to half an em per character, which is about 40 % too wide.
Usage:  python tools/word_widths.py "(slap)" "jeté" ...      (no arguments: every instrText / instrFirst of container.json)
"""
import json, os, sys
from fontTools.ttLib import TTFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
f = TTFont(os.path.join(ROOT, 'notation', 'app', 'fonts', 'CrimsonPro-LightItalic.ttf'))
c, h, u = f.getBestCmap(), f['hmtx'], f['head'].unitsPerEm
words = sys.argv[1:]
if not words:
    seen = set()
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ('instrText', 'instrFirst') and isinstance(v, str): seen.add(v)
                else: walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    walk(json.load(open(os.path.join(ROOT, 'notation', 'registry', 'container.json'), encoding='utf-8')))
    words = sorted(seen)
print(json.dumps({w: round(sum(h[c[ord(ch)]][0] for ch in w) / u, 3) for w in words}, ensure_ascii=True))
