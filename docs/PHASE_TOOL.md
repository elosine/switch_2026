# THE PHASE MACHINE — a take re-articulated by every player, the streams driven out of phase and back

*SW-42 (2026-11-11), built the same day; RUNNING_LOG §165. The button **PHASE** beside **MT** in the composer score.*
*Code: `score/public/phase_engine.js` (pure; `node tools/phase_check.js`) · `score/public/phase_panel.js` · the store `bank/phase_states.json`.*

## What it is, in five lines

- A **take** from the strikes drawer gives each player one note (or chord) with its articulation. Each player becomes a pulse **stream**
  that re-articulates it at its own tempo.
- The streams start together at one **bpm** and are driven through a **plan** of lines: **hold** (the state stays) · **shift** (every
  stream glides to a target over N seconds) · **cut** (an instant jump).
- A **target** is a strategy with a seed, re-rolled by ⟳ (his "shuffle"), or a saved **favorite**. Phase targets are reached EXACTLY: the
  glide gets a slight bulge so the streams arrive with the asked lags. Tempi targets are plain glides.
- While it plays: **LOCK** snaps every stream to the bpm keeping its lag (the drift stops, the pattern holds); **capture phase** /
  **capture tempi** saves the state as a favorite, to be a target later.
- **Insert at playhead** writes the whole plan into the score as plain struck notes in one group, a marker per line; the plan goes into
  the score file (`databases.phase`).

## The strategies (the target pull-down)

| target | what it makes |
|---|---|
| unison — aligned | every tempo = bpm, every stream on the beat together ("converge") |
| unison — lags kept | every tempo = bpm, each stream keeps the lag it has |
| phase · fan | lags of 1/N beat — a fan |
| phase · random | random lags, by the seed |
| phase · pairs | two groups half a beat apart |
| phase · canon | each stream AMOUNT of a beat behind the last |
| tempi · neighbors | each stream AMOUNT % faster than the last; the first stays — his first idea |
| tempi · ratios | AMOUNT = `3:4:5`: the multitempo rig's small-integer tempi — a pattern that REPEATS (every r1 · 60/bpm s) |
| tempi · spread | tempi spread evenly over ± AMOUNT % |
| tempi · random | tempi drawn within ± AMOUNT %, by the seed |
| tempi · cycle | random tempi snapped so the whole pattern repeats every AMOUNT seconds |
| ★ a favorite | a captured phase pattern or tempi pattern |

## The shape he described, as a plan

hold 10 (unison) → shift 40 to `tempi · neighbors 2 %` (they drift apart) → **LOCK** while listening, capture the phase → hold 15 → shift 30
to a favorite phase pattern → hold 10 → cut to `tempi · ratios 3:4:5` → hold 20 → shift 30 to unison aligned (they converge).

## Rules it keeps

- The **harmony of a line** is its own take if it names one, else the plan's — "apply a harmony to any given time section".
- The **note length** is the articulation's own by default, or a fraction of the stream's beat.
- A stream (a lane) can be switched off with its chip.
- A phase target the seconds cannot reach is **refused with !** (hover for the words) and the line runs as a plain glide.
- The sound goes through the strikes drawer's routes exactly as its Hear does (the remapped velocity and CC7, the CC0, the bend for a
  just note); Stop is the one panic.
- **His server must be restarted once** for the favorites store (`snapshots.js` learned a sixth store); the panel says so if a save fails.
