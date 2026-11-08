#!/usr/bin/env python3
"""Three more orchestrated four-voice mixes for the keep folder — each from four NEW stretched clips, trimmed, each clip under a
DIFFERENT tremolo mapping and player, orchestrated by the session, mastered (his word 2026-11-09, RUNNING_LOG §76).

    python tools/set_mixes.py            (the sets are written below; the tools are the workshop's corpus/)
"""
import json
import pathlib
import subprocess
import sys

R = pathlib.Path(__file__).resolve().parent.parent
W = pathlib.Path("C:/Users/jwloy/GitHub/live-electronics-engine/corpus")
H = pathlib.Path("H:/switch_2026/audio/set-2025-04-08c")
A = R / "bank/set/2025-04-08c/analysis.json"
Z = "C:/WindowsDrive/analysis export/analysis/Sound Lab 2025-04-08c Piano Bari Arch Drums.npz"
PY = sys.executable

# four clips a set, one from each busy region and a fourth; each clip its own mapping and player
SETS = {
    "set2": [("r1-t182.0", "drums", "A"), ("r2-t110.0", "piano", "B"), ("r3-t070.0", "archtop", "C"), ("r1-t198.8", "baritone-guitar", "Dbr")],
    "set3": [("r2-t116.0", "archtop", "Dbr"), ("r3-t075.0", "drums", "B"), ("r1-t194.0", "baritone-guitar", "A"), ("r2-t123.8", "piano", "C")],
    "set4": [("r3-t073.2", "piano", "Dbr"), ("r1-t187.2", "archtop", "A"), ("r2-t113.8", "drums", "C"), ("r3-t077.2", "baritone-guitar", "B")],
}
AZ = [(-45, 40, 150, 0), (-15, 45, 190, 90), (15, 45, 230, 200), (45, 40, 170, 300)]   # centre, swing, period, phase


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True)


def duration(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(out.stdout.strip())


def main():
    (H / "keep").mkdir(exist_ok=True)
    for name, clips in SETS.items():
        voices = []
        for clip, part, mapping in clips:
            bed = H / "bed" / ("%s-x625-full.wav" % clip)
            if not bed.exists():
                run(PY, W / "trim_quiet.py", H / "slow" / ("%s-x625-4pass.wav" % clip), bed)
            variant, bright = ("D", True) if mapping == "Dbr" else (mapping, False)
            cmd = [PY, W / "tremolo_render.py", "--bed", bed, "--analysis", A, "--npz", Z, "--part", part, "--from", "150", "--variant", variant,
                   "--speed-min", "2", "--speed-max", "20", "--density-max", "0", "--depth-min", "0.65", "--depth-max", "1.0", "--out", H / "tremolo"]
            if part == "baritone-guitar":
                cmd += ["--npz-part", "bari-sax"]
            if bright:
                cmd += ["--brightness"]
            run(*cmd)
            fn = H / "tremolo" / ("trem-%s%s-%s-x625-full-%s-from150s-s2-20-d65-100.wav" % (variant, "br" if bright else "", clip, part))
            voices.append((fn, part))
        secs = int(min(duration(f) for f, _ in voices))
        out = H / "keep" / ("mix-%s-orchestrated-%dm%02d.wav" % (name, secs // 60, secs % 60))
        cmd = [PY, W / "orchestrate_mix.py", "--analysis", A, "--from", "150", "--out", out, "--seconds", str(secs)]
        for (f, part), (az, sw, per, ph) in zip(voices, AZ):
            cmd += ["--voice", f, part, str(az), "0.4"]
        for az, sw, per, ph in AZ:
            cmd += ["--move", str(sw), str(per), str(ph)]
        run(*cmd)
        run(PY, W / "master_mix.py", out, out.with_name(out.stem + "-master.wav"), "--lufs", "-16")
        print("==", name, "->", out.name, "and its master")
        json.dump(dict(set=name, clips=[dict(clip=c, player=p, mapping=m) for c, p, m in clips], seconds=secs),
                  open(out.with_suffix(".json").with_name(out.stem + "-recipe.json"), "w", encoding="utf-8"), indent=1)


if __name__ == "__main__":
    main()
