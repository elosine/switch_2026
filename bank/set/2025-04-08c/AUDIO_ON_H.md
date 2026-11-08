# THE SET'S AUDIO LIVES ON THE EXTERNAL DRIVE (his word, 2026-11-08: "I'm running out of space")

**`H:\switch_2026\audio\set-2025-04-08c\`** — the same sub-folders as here: `bed\` · `slow\` · `stretch\` · `tremolo\` · `tuplets\` ·
`stutter\` · `sources\grabs\` · `lab\` · `sources\reels\`. Moved whole on 2026-11-08 (RUNNING_LOG §69); nothing of it was ever in
git (`bank/set/.gitignore` keeps every `.wav` · `.ogg` · `.mp3` · `.flac` · `.aif` out). What stays HERE is the data: `analysis.json` ·
`set.json` · `samples.json` (its `dir` now points to H:) · every `manifest.json` and `*-steps-*.json` · `capture/` (the drawn capture) ·
`sources/index.html` (its players point at files that are now on H:; it is history).

**The tools write to H: from now on** — every `--out` in RUNNING_LOG §69 onward names `H:\switch_2026\audio\…`. If H: is not mounted,
the lab's samples are not found: mount it, or point `samples.json`'s `dir` back at a copy.
