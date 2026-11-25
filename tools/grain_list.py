#!/usr/bin/env python3
"""grain_list.py — THE GRAINS OF A GRANULAR BED, LISTED, as they sounded (the Switch~ piece RUNNING_LOG §536; his "yes, try B4 on one rope").

    python tools/grain_list.py --variant B4 [--seed 1] [--seconds 240]   → bank/grains/<variant>-seed<seed>.json

The bed was made by live-electronics-engine/corpus/granular_bed.py with a fixed seed (the manifest at
H:/switch_2026/audio/set-2025-04-08c/keep/granular/manifest.json). This file walks the SAME random draws in the SAME order — the scatter,
the length, the pitch, the envelope, the level, the pan, the gap — and the same head (which hit it is in, when it moves on), so each grain
comes out as it sounded; but it writes no audio, only the list. The draws do not depend on the audio, only on the hits' LENGTHS (when the
head moves to the next hit), which are read from the hit files. Read only; the engine's file is not touched.

Each grain: [t (the bed's own seconds), player index, hit index, pitch ratio, length (s), level (dB), pan (-1 … 1), envelope]
"""
import argparse
import json
import math
import pathlib
import sys

import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT.parent / "live-electronics-engine" / "corpus"))
from granular_bed import VARIANTS, head_speed   # the recipes and the head, read from the engine's own file

ap = argparse.ArgumentParser()
ap.add_argument("--variant", required=True); ap.add_argument("--seed", type=int, default=1); ap.add_argument("--seconds", type=float)
ap.add_argument("--hits", default="H:/switch_2026/audio/set-2025-04-08c/hits")
ap.add_argument("--manifest", default="H:/switch_2026/audio/set-2025-04-08c/keep/granular/manifest.json")
a = ap.parse_args()
man = json.load(open(a.manifest, encoding="utf-8"))
row = next(r for r in man["variants"] if r["variant"] == a.variant)
seconds = a.seconds or man["seconds"]
v = VARIANTS[a.variant]
files = []
for p in row["hits"]:
    player, nn = p.split("/")
    m = sorted((pathlib.Path(a.hits) / player).glob(nn + "-*.wav"))
    if m: files.append((player, m[0]))
info = [sf.info(str(f)) for _, f in files]
lens = [i.frames / i.samplerate for i in info]
sr = info[0].samplerate
players = sorted({p for p, _ in files})

rng = np.random.default_rng(a.seed)
speed_s = head_speed(int(seconds) + 2, v, rng)
hit_i, pos, t, count = 0, 0.0, 0.0, 0
mean_gap = v["length"] / v["overlap"]
out = []
while t < seconds:
    spd = speed_s[int(t)]
    hlen = lens[hit_i % len(lens)]
    rng.uniform(-v["scatter"], v["scatter"])                               # the start's scatter (where in the hit; not drawn here)
    length = v["length"] * (1 + rng.uniform(-v["vary"], v["vary"]))
    ratio = 1.0
    if v.get("pitch"): ratio = float(v["pitch"][rng.integers(len(v["pitch"]))])
    if v.get("pitch_jitter"): ratio *= 2 ** (rng.uniform(-v["pitch_jitter"], v["pitch_jitter"]) / 12)
    env_kind = v["env"] if isinstance(v["env"], str) else v["env"][rng.integers(len(v["env"]))]
    db = rng.uniform(-2, 2)
    pan = rng.uniform(-v["pan"], v["pan"])
    out.append([round(t, 4), players.index(files[hit_i % len(files)][0]), hit_i % len(files), round(ratio, 4), round(length, 4), round(db, 2), round(pan, 3), env_kind])
    gap = max(mean_gap / 5, rng.exponential(mean_gap))
    t += gap; pos += gap / spd; count += 1
    if pos >= hlen - 0.05:
        hit_i += 1; pos = 0.0

dest = ROOT / "bank" / "grains"; dest.mkdir(parents=True, exist_ok=True)
fn = dest / ("%s-seed%d.json" % (a.variant, a.seed))
json.dump(dict(_about="tools/grain_list.py — the grains of granular-%s-seed%d as they sounded; generated" % (a.variant, a.seed), variant=a.variant, seconds=seconds,
               players=players, hits=row["hits"], fields=["t", "player", "hit", "ratio", "length", "db", "pan", "env"], grains=out), open(fn, "w", encoding="utf-8"))
ok = "MATCHES" if count == row["grains"] and hit_i + 1 == row["hits_visited"] else "DIFFERS"
print("%s: %d grains over %d hits (the manifest: %d over %d) — %s -> %s" % (a.variant, count, hit_i + 1, row["grains"], row["hits_visited"], ok, fn))
