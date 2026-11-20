# THE NOTATION SCHEME — what a player sees, section by section

> This piece's organised notation doc (the pattern is piece 6's `docs/NOTATION_SCHEME.md`, H6-37). Begun 2026-11-19, when the notation phase
> opened (SW-71): section by section, the paradigm settled on ONE case, then spread through the section. Every sign begins with a DEVICE SHEET
> (`docs/PLANNING_METHOD.md`); the rules are rows of `notation/registry/rules.json`, read through `docs/ENGRAVING_RULES.md`.

## 0 · What holds everywhere (decided 2026-11-19)

| | the rule | his word |
|---|---|---|
| the staff | drawn throughout, every pitched part | "there are no staff lines?" (§240) |
| dividing lines between parts | none on a page with staves — a concert score; only a page without staves keeps them | "the staff version of the score should look just like any concert score" (§243) |
| the line at a page's right edge | only where the music ends | "I don't think I need to see a line on every page" (§241) |
| the electronics | ONE tape-part lane at the bottom of the conductor's score, half a player's height, its own bracket, named ELEC; the waveform of the mixed electronics — a placeholder until the mix exists | SW-71 · §242 · §243 |

**BEFORE A SECTION'S FIRST PAGE (2026-11-19, §248):** read `docs/NOTATION_STANDARDS.md` for that kind of material, say in one line which standing rule applies, then build. A gliss with re-breaths is §3 there: ONE header at the entry, ONE smooth curve for the whole gesture, a go line alone at each re-breath. No step or divot at a breath.

## 1 · Section 1 — the sine tones and the long notes that beat against them

### DEVICE SHEET 1 — THE BEATING GLISS *(his words 2026-11-19; BUILT as one gesture, §245 … §248 — `--glissGestures`; the badge at 60 % and the sine tone as a purple line at the lane's top, §249)*

**The case:** the alto sax's first note — F4 (written D5), 16.0 → 34.5 s in three breaths, gliding up 44 cents against a sine tone on F4.

**What he asked for, read back:**

1. **One curve only** — the PITCH curve, in the pitch colour (the lineage's orange), filling the WHOLE height of the lane. No second curve
   for the level (the septets' green curve is not used here).
2. **The real pitch, on the staff** — a note head at the note's written pitch, on the staff, to the left of the go line (not the small
   figure under the staff that the older block draws).
3. **A gliss line going up from that head** — toward an imaginary pitch about a third higher; NO second note head; long enough to be seen.
4. **Niente → fff kept** — the dynamic figure of the old block, as it stands.
5. **The audible-beats badge** — with the rest, to the left of the go line.
6. **Everything of the header stands left of the go line**: (from the left) the badge · the head with its accidental · the gliss line ·
   then the go line; the dynamic figure under them.

**What exists to build it from (read 2026-11-19):**

- the septets' block (`byEnv.morph`, `layout.js` — the head on the staff, a gliss line to a second head, the dynamic chain, the go line at
  every breath) — but this piece's page tool takes the TUBAS' older header (the small figure under the staff), because the septets' path is
  switched on by a setting this piece does not have;
- the pitch curve (`glissCurve`, orange, today on the top half of the lane) and the level curve (`crescCurve`, green, the bottom half);
- piece 6's badge for audible beats (`language.types.beats`), drawn by the sine tone's unit.

**What has to change (the build):**

- the page tool: this piece's gliss notes take the septets' block, not the tubas' header;
- the block: a variant with NO destination head — the gliss line rises a third from the head and ends in the air;
- the level curve left out for this device; the pitch curve given the whole lane;
- the badge added to the block's left end;
- rows in `rules.json` for each (never a number in the code); the rules page regenerated; the checks run.

**Open, his:**

- how long the gliss line is (the septets' is two note heads wide; "enough horizontal room so you can see the gliss line");
- whether the sine tone itself is shown on the sax's lane as well (piece 6 drew a box as long as the sine), or only in the ELEC lane.

### THE BEATING GLISS AS IT STANDS (2026-11-19, §245 … §252) — one sheet, applied the same to every part

| | the players (flute · clarinet · sax · violin · cello) | the crotales (the SINE glides) |
|---|---|---|
| a gesture | the notes of one sine brick and pair; ONE header at its entry, go lines alone at the re-breaths | the same; go lines alone at the re-attacks |
| before the go line | the open head at the written pitch · the gliss line up a third | the open head alone, no gliss line |
| the badge | audible beats, 60 %, the lane's top, the house space before the go line | the same badge, LEFT of the head (the lane is low: the head is in the badge's row) |
| the sine tone | a purple line at the lane's top, through the badge's middle, the curve's two ends | a purple CURVE in the badge's band, the sine's own glide |
| the pitch curve | orange, the whole lane, one smooth curve per gesture, no step at a breath | none (the crotale does not move) |
| the dynamics, to 96.6 s | the part's FIRST entry only: niente · a hairpin of 1.25 s · ff, right of the go line | the same |
| the dynamics, 101.3 s on | every entry: p → arrow → fff before the go line (SW-24, as composed) | the same |
| a word | none | "crotales" at the first entry only (piece 2's rule), the house space right of the go line |

Built by `node tools/notate_section.js … --glissGestures all`. The crotales' dynamic row is nudged 1.3 ss up (`--crotDynNudge`): the joined mallets lane is low, the fit ladder's own rung 4.
