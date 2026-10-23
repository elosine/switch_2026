# THE SET — Sound Lab 2025-04-08c · piano · baritone guitar · archtop · drums · 6.6 min

The one session the first section's electronics are made from (PLAN 1a; RUNNING_LOG §27 — his choice, 2026-10-23). "All the
capture from the same set": the bed's material AND every voice's driver come from here.

## What goes in this folder

| file | what | who puts it here |
|---|---|---|
| `mix.wav` (or `.aif`) | HIS BOUNCE of the whole session — the full ensemble mix. **Not here yet: he has it at home and brings it** (his to-do list, Compositions). | him — drop the file here, any name with "mix" in it |
| `set.json` | the settings: where the stems are, which part is which, the mix's name and gain, every step's knobs as they are set | the AI, at 1a.1 |
| `analysis.json` | the piece's COPY of the session's analysis, the part `bari-sax` renamed `baritone-guitar` (his correction, §27) | the AI, at 1a.1 |
| `capture/` · `sources/` · `streams/` · `voices/` | the lab's renders, step by step (1a.2 … 1a.6) | the AI |

Audio here is gitignored (`bank/set/.gitignore`); the settings and the drawn captures are in git.

## Where the session's own files are (never moved, never edited)

- the stems: `C:\WindowsDrive\analysis export\Sound Lab 2025-04-08c Piano Bari Arch Drums\` — eight AIFs, L and R per player,
  sample-aligned (all 52,793,110 bytes): `Arch L/R` · `Bari L/R` (the BARITONE GUITAR) · `Drums OH L/R` · `Piano L/R`
- the analysis: `C:\WindowsDrive\analysis export\analysis\Sound Lab 2025-04-08c Piano Bari Arch Drums.json` and `.npz`
  (2026-08-26; the workshop's `live-electronics-engine/corpus/analyze_session.py`); `reference_scale.json` beside them
- the workshop's tools: `live-electronics-engine/corpus/` (`README.md` · `docs/corpus/HANDOFF.md`)

## The stand-in, only at his word

If the mix is wanted before his bounce arrives: the eight stems summed at equal gain (one command, at 1a.1). He said no — *"I have
the mix i just have to get it when at home"* — so nothing is summed unless he asks.
