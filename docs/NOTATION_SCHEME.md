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

## 2 · Section 2 — the piano solo (148.2 → 196.3 s) — FINAL DRAFT 2026-11-21 (§360)

**The page:** `s2-piano-solo`. Black heads at half size, the right hand on the upper staff and the left on the lower, both in treble. Outside a figure, a head's left edge is on its own MIDI time. The figures are taken ONE BY ONE at his word and kept in `notation/hand/s2-piano-solo.units.json`.

**The played-spacing copy (§264):** `s2-piano-solo-played` — the same page and the same hand file, with every figure at its PLAYED time (no grace spacing). Built by the main page's command plus `--id s2-piano-solo-played --unitsFrom s2-piano-solo --timeSpacing`. Both pages carry `--noFitMark` (the red "fit?" left out; the units it marked still want room).

### THE RULES A FIGURE IS BUILT FROM (gathered 2026-11-20, §256 — read these BEFORE drawing; a figure adds no rule of its own)

| the thing | the standing rule | where it lives |
|---|---|---|
| the chord's column | one column; a head a step or less from the one before steps to the other side of the stem | piece 2's locked chord rules — `notation/lib/chord_column.js`, `chordColumn` |
| the accidentals | packed right to left beside the heads, clear of the ledgers; 0.1 from the head in a column, 0.2 between two; the natural beside a same-line neighbor's sign | `objects.accidental` (§479 · §482) |
| the stem | 3.5 ss past the tip-side head, lengthened to the middle line | `objects.stem.lengthSs`, `stemLenFor` |
| the flag | its near edge clears the staff's outer line by 0.38 ss; the law yields past 10.5 ss | `objects.flag.staff · clearMaxSs` (piece 2's flagClearance law) |
| the beam | at the flagged stem's height; no member's stem under the base length; the second beam 0.81 ss under | #4 day 23; `glyphs.json standards.beam` |
| the arpeggio | LilyPond's unit stacked 1 ss apart; RIGHT of the chord; 0.225 ss from the chord's rightmost ink (the flag's, where they meet) | piece 2 `CHORD_SPACING_RULES.md` §5c.D; `glyphs.json arpeggio.unit` |
| the head's place | the left edge of the column on the moment | D49 (`nhAnchor leftEdge`) |
| a tight cluster's spelling | a sharp whose letter another note of the chord has becomes the flat of the next letter, when that letter is free | piece 2 `CHORD_SPACING_RULES.md` §5b (applied to a unit, §258) |
| a grace figure | heads and accidentals 0.707; stem and flag at that scale; the beam at the heads' scale; the stroke on the first stem only, by THE CORNER RULE: anchored where the first stem's left edge meets the top beam's top face, 45 degrees, cutting 1.0 ss of the corner, 0.4 ss past each crossing (§262) | `objects.graceHead · graceSlash.cutSs · jutSs` (Recombination §550 · §591 · §592 · §601 … §604 · §666) |
| the stems of the piano solo | the flag's tail and a beam stand 2 ss clear of the staff | `objects.handUnit.flagClearSs` (§258) |
| a cluster in a notated chord | within one staff, four or more notes each within a whole step of the next = the LOWEST and HIGHEST note with a bar between (half a head wide); the inner notes are not drawn; the two ends in one column, with their accidentals; BESIDE A STEM the bar reaches to the stem — one solid shape (§345) | `objects.handUnit.clusterMinNotes · clusterMaxGap · clusterBarW · clusterBarToStem` (his, §343; the chord symbol's numbers) |
| a flagged chord ABOVE or BELOW the staff | the flag's near end stands 4 ss from the far edge of the head nearest it (the staff-clear law gives nothing there) | `objects.handUnit.flagHeadClearSs` (his, §343) |
| a go line on a notated chord | the unit says `go`; one go line, at the chord's time | his, §343 (the chord at a ribbon's impact) |
| a sign over a notated chord (marcato · accent · tenuto) | LilyPond's glyph, centered on the stem's column. A MARCATO always ABOVE (his, §356). An ACCENT or TENUTO: a beamed group's on the beam side, a lone figure's on the head side. 0.45 ss (the house gap) from the figure's true ink on that side — heads, accidentals, the arpeggio's line, the stem's tip or the beam; never inside the staff. EVERY single struck chord and arpeggiated chord of the piano solo carries a marcato (his, §356) | `objects.handUnit.articGapSs · articStaffSs` (§355 · §356) |
| three notes a half step apart | the note that would share a column with a note a step or less away takes a THIRD column, beyond the default column, away from the stem | HIS RULE 2026-11-20 — `objects.handUnit.thirdColumn` (§260) |
| an accidental beside a STEMMED chord | 0.25 from its head, as a single note's (the stemless column keeps 0.1) | HIS RULE 2026-11-20 — `objects.handUnit.accGapStemmedSs` (§260) |
| a beamed grace group's spacing | the stems at EQUAL distances, the least that clears each stem from its neighbors' heads, ledger lines and accidentals by 0.45 ss; the group centered on the span it was played in. Room on one side only: no rule yet | HIS RULE 2026-11-20 — `objects.handUnit.graceGroupSpacing · graceGroupClearSs` (§261 · §262) |
| a SCATTERED GRACE (sg) — his name | one figure in two hands, each hand its own beam; upper stems up, lower stems down, always; the span from the first played note to the last of either hand; each hand's partials at even distances across it; grace sizes; beams 2 ss clear; the wavy stroke (Recombination's) on each beam's first stem, placed by the corner rule, mirrored below. The played times stay in the IR and in the hand file (`played`) | HIS RULE 2026-11-20 — `objects.handUnit.scatteredGrace` · `objects.groupStub` · `objects.graceSlash.cutSs · jutSs` (§263) |
| a beamed group SPREAD for fit | the same equal spacing as the grace group's, for full-size heads too, when the figure says so; "right" = the first member stays on its played place, the others to its right; "both" = centered. The side is his word per figure. Leftward only: no rule yet | HIS RULE 2026-11-20 — `objects.handUnit.spreadSides` (§265) |
| this page's own | heads and accidentals at 0.5 (his, "eventually I'll make the note heads bigger") | `objects.handUnit` |

**No rule yet — to discuss when met:** a stem, flag and beam at the small head's size (they are full size now) · the lane's room for a long figure (the layout's own flag, the red "fit?").

### OPEN — no rule yet; each waits for his word, then becomes a row (2026-11-20, §258 · §259)

| the case | what the standing rule gives | the AI's recommendation (NOT built) |
|---|---|---|
| the distance between beamed grace notes — **HIS RULE, BUILT 2026-11-20 (§262)**: `objects.handUnit.graceGroupSpacing · graceGroupClearSs` | none: each stands at its own time | built as read back below; figure 6 measured 1.37 ss stem to stem, 0.45 ss from the first stem to the high C's ledger lines |
| THE GRACE STROKE'S PLACE — **HIS RULE, BUILT 2026-11-20 (§262)**: `objects.graceSlash.cutSs` 1 · `jutSs` 0.4, the corner rule below; the row beside is what it replaced | Recombination's (§601 … §604): centered on the stem–beam corner, slid 0.5 ss toward the heads, the far half longer by twice that. He finds it unreliable and "potentially a little too long" | the two-number rule below |
| stems, flags and beams beside small heads | full size | his, when the head size is settled |
| a long figure's room in the lane | the layout's red "fit?" (4 units on `s2-piano-solo`) | his, on the page |

**THE GRACE STROKE — his brief (2026-11-20, verbatim):** "figure out a consistent placement for the slash and how to do it … we'll figure out the angle and then some measurement, maybe from the point, the top beam, left topmost point. Maybe we can do some sort of coordinate at a certain angle. And then I want like an equal amount jutting out to the left and an equal amount jutting out above to the right. And that one might be potentially a little too long."

**The AI's recommendation, to build at his word:** ONE anchor and TWO numbers, the same for every grace figure.
- **The anchor P** = the outer corner of the figure: where the FIRST stem's outer edge (its left edge) meets the outer face of the outermost beam (the top face of the top beam when the stems go up). For a flagged single grace, P = the stem's tip at its left edge.
- **The angle** = 45 degrees, rising to the right (stems up); mirrored for stems down.
- **`cutSs`** = how much of the corner the stroke cuts: it crosses the stem's left edge `cutSs` below P and the beam's top face `cutSs` to the right of P (equal, because the angle is 45).
- **`jutSs`** = how far it sticks out past each crossing: its left end `jutSs` left of the stem's edge, its right end `jutSs` above the beam's top face. Equal on both ends by construction — his "an equal amount jutting out to the left and … above to the right".
- So: left end (P.x − jut, P.y − cut − jut), right end (P.x + cut + jut, P.y + jut), with y up. It does not depend on how many beams there are or how long the stem is.
- First numbers to try: `cutSs` 1.0, `jutSs` 0.4, both at the grace scale (the stroke is shorter than today's). Two rows in `objects.graceSlash`; the old `at` · `reachSs` · `beamInsetSs` retire for hand units.

**THE GRACE GROUP'S SPACING — his rule (2026-11-20, verbatim):** "Yes, the beamed grace notes minimum distance. I guess there'll need to be clearance for the ledger too. And let's make, well, it depends, but for these ones, let's make everything, or there'll be one version that's equal horizontal distance. So these ones should have equal horizontal distance. And this is hard to codify in a rule, but I guess we'll have to push where there's room. In this case, there's room to the left and to the right. So I guess if that's the case, we'll push out both sides. So the leftmost will go a little bit more left, the rightmost chord will go a little bit more right, and there'll be enough space so that the stems clear the ledger lines and the note head in the middle will be in between."

**Read back, for the build (the AI's reading — the numbers are rows, his to move):**
- The members of a beamed grace group stand at EQUAL horizontal distances (this version; he expects another version later — "there'll be one version that's equal horizontal distance").
- The distance is the least that lets every stem clear its neighbor's head AND that head's ledger lines (a ledger line is wider than its head: the head's width plus a quarter of it each side), plus the house space.
- The group is PUSHED OUT WHERE THERE IS ROOM: with room on both sides, both sides — the first member a little earlier than played, the last a little later, the middle ones between; the group stays centered on the span it was played in.
- Room on one side only, or on neither: NO RULE YET — put it to him when a figure meets it.
- Figure 6 is the first case: room both sides; the high C (on ledger lines) between the two chords. Its hand `at` goes when the rule is built.

**IN THE REAL SCORE (§361 · §362):** the page `s2-piano-solo-final` of the notation app. Its standard figures are a page like any other (written by `node tools/solo_to_score.js` from the working version: the replaced notes left out, `layoutPolicy.noOttava`); the signs of the other kinds and their motion are the workshop's own drawing, asked of the score server for each window (`layoutPolicy.furniture: "work"` → `/api/notation/furniture`). So the workshop stays the ONE place the kinds are drawn, and the score shows exactly what it shows. Video and zoom views; print and the exported film are not built.

**ITS PACE (§366):** 4.8 seconds across a page (`bank/piano_solo_work.json` pageSeconds) — his workshop setting.

### THE DRAFT SCORE (§368)

The score so far is a LIST of pages in the order of the piece — `notation/ir/index.json` "draft".order: `s1-sines` → `s2-piano-solo-final` → `s2-ctpt-heads`. The notation app marks them "DRAFT n of N" in its picker and plays them as one score: where a page ends, the next begins, the clock running. A section taken into the score is added to the list.

### THE PACE OF A SECTION (his rule, §366: "each section its own pace")

Every page of the score may say its own pace — how many seconds stand across one page: `layoutPolicy.pageSeconds` in the page, written by `notate_section.js --pageSeconds N` (or, for the solo, by `solo_to_score.js`). The app and the film read it. A page that says nothing takes the registry's pace, 12 s. Set so far: the piano solo 4.8. The workshop shows any stretch as a pace ("score pace … s/page" beside its Stretch).

## 2b · Section 2 — the counterpoint (200 → 253 s) — OPENED 2026-11-21 (§360)

**The page:** `s2-ctpt-heads` (in the notation app's picker: "Section 2 - the counterpoint, 200 to 253 s: note heads at their played times"). Seven parts — flute · clarinet · alto sax · percussion · vibraphone · piano · violin; the cello rests. 296 notes. Every note is a head AT THE TIME IT IS PLAYED (`--timeSpacing`, `--alone 199-254`: no pulse is read into it), with its accidental. What the standing rules already draw for a technique (a gestural curve on a staccato, a duration bar, a technique's word) is left in, at his word. NOTHING IS DECIDED HERE YET: the rhythm first (his), then the articulations.

**Built by:** `node tools/notate_section.js --score piece-FirstDraft-Final-B-noFadeAt96 --w0 199 --w1 254 --parts 0-6 --alone 199-254 --exp --noFitMark --timeSpacing --id s2-ctpt-heads --label "Section 2 - the counterpoint, 200 to 253 s: note heads at their played times (a working page)"`

**THE PAGE IS NOW BUILT BY ONE FILE, `node tools/build_ctpt_page.js`** (§369) — the command above plus every decision taken on the page; a decision is a line added there.

### THE RECIPE FOR A PART OF THE COUNTERPOINT (kept at his word, §375: "keep track of … the process and the decisions, because then we'll repeat … something similar with the other parts")

Worked out on the FLUTE (and the first of the clarinet). A new part is taken by these steps, in this order; where a step meets something it has no answer for, the AI lists it for him and does not guess.

1. **Every note is a head at the time it is played**, with its accidental. Black for a short note, white for a held one. All at the standard size.
2. **Each playing technique has ONE look.** Settled: staccato = the flagged staccato (black, dot, flag, go line, curve) · tongue ram = the same · jet whistle = the same without the dot. A technique with no look yet is LISTED for him with an example time — he says what it is (the flute's flutter-tongue is still a white head and a bar).
3. **Beams.** Two notes of the part 0.33 s apart or less go on one beam (the clarinet's pair at 217.37 is the measure). Pairs a little wider (to about 0.5 s) are LISTED for him; he beams by eye past the measure (the flute's 220.33 and 248.95).
4. **A beamed group's regime.** The left edge of each head is its moment; the first one stands on the curve's go time; no go line.
5. **A note just before another** (0.05 s or less, not the same instant) is a GRACE-NOTE PICKUP to it: small, its own flag and stroke, a little to the left, no slur, never on the beam, its stem down to the main note's flag or beam; no go line, dynamic or curve of its own.
6. **Two notes at the same instant** (under 0.01 s) are LISTED for him: on a wind, one player cannot play both (the flute's 221.34 and 233.97); and where both are the SAME pitch only one sounds (the flute's D5 at 206.00).
7. **The curves stay**, one per note or per beamed group, for now.
8. **The technique's word** stands ON EVERY NOTE of that technique — a TRY of his (§378: "the techniques are changing quite a bit"); the standing rule is the change rule (once, and at each change). The flute's: T. R. · jet whistle · flz.
9. **After every build the AI runs `node tools/check_rules.js`** and says what is red. Its part (10) MEASURES the page: every flag's clearance from the staff, every ottava bracket's gap before a go line, every staccato dot's clearance from a line (§376).
10. **Then:** dynamics (next), articulations.

Everything decided is a line in `tools/build_ctpt_page.js` (the beams, the pickups) or a row of the rules (the looks, the sizes, the distances). The table below is the record, decision by decision.

**Decided so far (§369 … §374, flute and clarinet only):**

| the thing | his decision | how it is written |
|---|---|---|
| THE BEAMING THRESHOLD | two notes of one part no farther apart than the clarinet's pair at 217.37 → 217.70 s (0.329 s) are beamed; "for now" — and the pairs he names beyond it (the flute's 220.33 · 248.95, §374) | `tools/build_ctpt_page.js` BEAMS (eight so far) |
| A BEAMED GROUP'S REGIME (the tubas' rule; the lineage's D43 · D49 — HIS, re-stated §374: "let's make sure we get this as the standard") | the LEFT EDGE of the first note's head stands on the gestural curve's go time — every head's left edge is its moment — and there is NO GO LINE (a go line marks a head that stands off its moment) | each beamed note: `{ nhAnchor: "leftEdge", goLine: false }`, written by the build file for every member of BEAMS |
| the heads | black for a short note, white for a held one — kept; ALL AT THE STANDARD SIZE (his, §370) | the standing devices; `objects.cueHead.size` 1 |
| the gestural curves | kept, for now | the standing devices |
| a note just before another (the clarinet 230.37 · the flute 206.00) | a GRACE-NOTE PICKUP: small, its own flag and stroke, standing a little to the LEFT of its main note (2.2 ss; 1.2 more past an accidental), NO slur, never on the main note's beam; no go line, dynamic or gestural curve of its own (§369 · §371); ITS STEM REACHES the height of the main note's stem tip — that flag's far end, or the beam (§374, `objects.graceHead.pickupStemToMain`) | `--hand <grace>:{grace, pickupTo, goLine:false, dynMark:false}` · `--noGc`; `objects.graceHead.pickupLeadSs · pickupAccSs` |
| a TONGUE RAM | the flagged staccato: a black note with its dot, flag, go line and gestural curve — the staccato unit's look whole (§373) | `container.json` devices.byTechnique.tongue_ram |
| the flute's WORDS | T. R. (tongue ram — the lineage's word, #5 §401g) · jet whistle, IN FULL (looked up, §378: there is no standard sign or abbreviation; a score names it in words and explains it in its key) · flz. (flutter-tongue). ON EVERY NOTE, a try (§378). A staccato needs no word: its dot says it | `container.json` devices … `instrText`; `techniques.json` flz `notate` |
| THE STACK ABOVE OR BELOW A NOTE (the column's order, `column.order`, §420 · §421 — now built above the note too, §380) | outward from the note: the dot · the accent · the DYNAMIC · the OTTAVA bracket · the technique's WORD. Each stands the house gap (0.45 ss) from the outer ink of the one inside it; none inside the staff. A word also stands at least 1 ss above the top staff line (§561) | `layout.js` "THE STACK ABOVE A NOTE"; `objects.instruction.aboveNoteSs · staffClearSs`; measured by `check_rules` (10): no dynamic, bracket and word share ink |
| a WORD and its note's moment | a technique's word never stands on the go line: over a note that stands before its go line, a word that would reach it is RIGHT-JUSTIFIED on the head (it ends at the head's right edge); over a beamed note, whose head's left edge is the moment, the word BEGINS at that edge (his, §379; the lineage's §401b and D49 made general) | `objects.instruction.goLineClearSs`; measured by `check_rules` (10) |
| a FLAG and its staff | the flag's near end stands 2 ss clear of the staff's outer line, in the whole score (his, §378; it was 0.38); a beam stands at that height | `objects.flag.staff` |
| a staccato DOT beside a line | it keeps from a staff or ledger line the tight gap it keeps from its head (0.15 ss); nearer, it goes to the middle of the next space (his eye, §376) | `objects.staccatoDot.lineClearSs` |
| an OTTAVA bracket beside a go line | the bracket's end is the unit's ink: it — not the head — keeps the unit's gap before the go line (the standing "hook is ink", now on every unit; his eye, §376) | `objects.ottava.hookIsInk` |
| a JET WHISTLE (short here) | a black note with its flag, go line and gestural curve — the staccato unit's look without the dot (§372) | `container.json` devices.byTechnique.jet_whistle |

**Its pace:** the registry's 12 seconds a page (no pace of its own yet).

## 3 · SHAPE ACTION NOTATION (his name, SW-84, 2026-11-20) — a PROTOTYPE, not yet a sign of the score

**The name is three words — Shape Action Notation** (his correction, §285; the AI first took it as "action notation").

**What it is for:** the flows of the piano solo — one hand's wave of notes played into a point of gravity and out of it. The fixed structures (his jabs and strikes) stay in STANDARD notation, the figures of § 2; the two kinds alternate. A third kind, a STUTTER notation (a quick repetitive shake), is HELD (SW-84). A fourth, POINTILLISTIC — CONSTELLATION NOTATION: points that suggest a density over a ZONE, without exact rhythmic places — is named for later (SW-85).

**Where it lives today:** only in the notation workshop (`http://localhost:5650/`, the page "prototype: ribbon"), drawn by `tools/gravity_furniture.js` from `bank/gravity_proto.json` — ONE example, the left hand, 157.82 → 159.64 s. It is not in `layout.js`, has no rows in `rules.json`, and is on no page of the score.

| the part | as it stands | whose |
|---|---|---|
| the arc | the lineage's GC (`gc.js`, piece 2's preset): from the flow's first note, through the impact, to its last note; the ball rides it | his ("use the gc design I've been using") |
| the inner movement | the arc is a RIBBON: its width is the hand's busyness, up to 24 px, exaggerated (power 2.4) | his ("lets go with the ribbon, maybe") |
| the ball | larger than the ribbon under it (1.35 × its half width + 2 px), a white rim | his word, the AI's numbers |
| the hand's shape | a chord ON THE STAFF in a thin tight box, with accidentals; four or more pitches no more than a whole step apart = a CLUSTER BAR (the lowest and highest note, a bar between — piece 2's bar, half a head wide here) | his; the bar's width and the "four" are the AI's |
| a second shape | only when the pitches after the impact differ from those before by 3 or more (added + dropped); never at the impact — it begins 30 % up the rising arc | his word, the AI's numbers |
| the boxes' place | each begins at its moment and stays inside the arc's span | his |
| played notes | none drawn | his |

**HIS NOTE FOR THE SECOND PASS (SW-104, 2026-11-21) — A SPECTRUM OF EACH KIND:** the pebble drops in a GRADATION — of density, and of where the weight lies (weighted in the front, weighted in the back); the repeats likewise — sparsely repeated, ones that grow bigger, and so on. "Let's find a variety of those." What exists to draw on: the plain drop (26 pebbles) and the hill (weighted to the back, §317 · §322); the repeat signs sparse · 29 growing · 28 fading · 30 gathering · 31 spreading, and the catalog page `http://localhost:5650/pages/stutter`.

**HIS NOTE TO COME BACK TO (SW-102, 2026-11-20):** refine the pebble drops' DENSITIES — so they reflect the playing a little, and so there is variety among the drops (today every drop but the hill at 170.3 has the same 26 pebbles).

**OPEN (his method's steps, SW-83's third word):** which notes stand on which side of the impact (the first reading puts the impact on the hand's heaviest moment) · how the arc's physics and shape are decided (today the GC's fixed curve, stretched in time) · the other hand · how it meets the standard figures beside it.
