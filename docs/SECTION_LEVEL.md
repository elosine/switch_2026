# SECTION LEVEL — one loudness for one written velocity across a section's parts

*His ask (2026-11-10, RUNNING_LOG §136 · §137): "I want velocity 100 in each of these parts to sound approximately the same actual measured
level … when I change to velocity 70, I want that velocity 70 to be about the same volume across all six parts." The calibration card
(container 5) measured the ordinary voices; a section's parts play other articulations, so the section is measured for itself.*

## The technique, in three steps

1. **Measure** — each part's voice AS THE SECTION USES IT (the technique its notes carry most), played solo through the rack: isolated notes
   0.75 s apart, eight velocities (16 … 127) at three pitches of the part's own range in the section, CC7 at 127 first; Reaper's meter on the
   receiving track (found by the part's port and channel) read every tick; per part a curve velocity → dB (the mean over the pitches, made
   non-decreasing). The curves go to `bank/section_levels/<score>.json`.
2. **Map** — the TARGET curve is the mean of the parts' curves, shifted down so its 127 is the QUIETEST part's 127 (every part can reach every
   level). Each played-in note keeps its WRITTEN velocity (`recVel`, what he struck or typed); its `velAbs` becomes the velocity on its own
   part's curve that gives the target level for that written velocity. The notation does not change.
3. **Verify** — every mapped note played isolated and metered, the levels gathered by written mark; the spread across the parts is the result
   (the counterpoint at 199 s: within 1.7 dB at ff, where it had been 15 … 20).

## The commands

```bash
node tools/section_level.js --measure --score <save> --from 195 --to 253
```
```bash
node tools/section_level.js --apply --score <save> --from 195 --to 253
```
```bash
node tools/part_meter.js --score <save> --from 195 --to 253 --isolate 0.75
```
`--apply --undo` takes the map off. `--lanes flute,piano` limits either to named lanes.

## When the articulations change

Re-run **measure** — the tool reads the technique each part's notes carry NOW and measures that voice; then **apply**. A part whose voice did
not change is simply measured again (the same curve comes back). When only the dynamics change (velocities edited), **apply** alone.

## What 127 means

The ceiling of the field is the quietest part's 127. A written 127 is sent as the velocity that reaches THAT level on each part — the quietest
part sends 127 itself, a hotter part sends less. Nothing is asked for above 127, nothing clips; the field is normalised to the quietest voice's
top. The price is that the hot, narrow voices (the SI2 staccatos: 14 dB from 16 to 127) play from the soft end of their samples; if the timbre
objects, the other lever is a per-section CC7 offset per part (level on the fader, timbre on the velocity) — to build at his word (NITS).

## What is NOT covered

- The sine bricks and the material bricks (the electronics): their levels are their own (the brick's Mark, the Trim).
- A shaped note (a drawn or generated curve, `sonifyMode` not `plain`): the dynamics law's own device plays it; the map leaves it.
- The measure is the track's peak (post-fader), not the card's K-weighted loudness — right for "about the same", rougher than the card.
