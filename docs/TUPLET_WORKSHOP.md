# THE TUPLET WORKSHOP — what it is, its file, and the techniques he can call by name

> For any AI working on Section 3 of the Switch~ piece. Written 2026-11-19 at his word: *"I like that technique. I don't know if we can give it
> a name or codify it somewhere … you don't have to put it into the GUI. I guess remember it and I can call on it."* His words are in
> `docs/COMPOSITION_NOTES.md` SW-45 … SW-55; the making of it in `docs/RUNNING_LOG.md` §216 … §229. Read `docs/TUPLET_BANDS.md` for the bands.

## What it is

- A page of its own for the instrumental part of Section 3 (277.8 → 480 s): `http://localhost:5640/`, started by
  `node C:\Users\jwloy\GitHub\switch_2026\tools\tuplet_workshop.js`. Players only, over Web MIDI in his Chrome.
- It reads the single strikes of the phase form from his save `piece-Section03-H-addTuplets` and never writes to it.
- **Everything he makes is in ONE file, `bank/tuplet_chunks.json`.** The page autosaves into it; an AI may write it too, and the page takes
  the change within two seconds. Bookmarks of it go in `bank/tuplet_versions/`.
- `node tools/tuplet_render.js` writes the result into the EXPERIMENTAL composer save `piece-Section03-X-tuplets` (overwritten each run), to
  hear it with the electronics in the composer score.

## The file

| key | what it holds |
|---|---|
| `ceiling` | 10 — never more strikes a second, any player |
| `bands` | slow 1–3 · medium 3–6 · fast 6–10 strikes a second |
| `chunks` | the TUPLET chunks: `start · end · band · players · shareFrom · shareTo · rate · seed` |
| `harmonies` | the HARMONY bricks: `start · end` and either `take` (a take of the strikes drawer) or `pcs` (note names — see below) |
| `sets` · `artic` | the articulation sets (one technique per player) and the one in force |
| `dynamics` | the players' dynamics: `marks` (the written ones, for the notation — `mf < fff` with its two times) and `points` (the line they make); `tuplets.js` `levelAt` · `velOf` |
| `marks` | score times he named (292: the tuplets start) |
| `takeDeck` | the takes not yet used by `harmony_fill.js` (no take twice until all are used) |

The rules of the tuplet draw are at the top of `workshop/tuplets/tuplets.js` (one copy, used by the page and by the tools).

## The techniques, by the names to call them

### OCTAVE SCATTER *(the name is the AI's proposal, 2026-11-19 — his to change)*

- **What he hears:** a few note names (G and D, a fifth) held over a stretch; on EVERY STRIKE each player plays one of those notes in another
  octave of its range. The harmony stands still; the register jumps.
- **How to make one:** a harmony brick with `pcs` instead of `take`:
  `{ "id": "h31", "start": 317.6, "end": 324.3, "pcs": [7, 2], "label": "G · D — a new octave on every strike", "seed": 1 }`
  (`pcs` are pitch classes: C 0 · C♯ 1 · D 2 · E♭ 3 · E 4 · F 5 · F♯ 6 · G 7 · G♯ 8 · A 9 · B♭ 10 · B 11).
- **Any set of notes works:** two stacked fifths G D A = `[7, 2, 9]`; a fourth = `[0, 5]`; a whole interval stack = its pitch classes.
  Several bricks in a row = a progression of scatters.
- **The rule (`keysAt` in `tuplets.js`):** the keys of those notes inside the player's technique range; one drawn per strike from the
  brick's id, the player and the strike's time; never the key the player has just played. `seed` + 1 = another draw.
- **Not in the page's controls** beyond the brick's own row (what it does · `new draw`). He asks in the chat; the AI writes the brick.

### ONE NOTE FOR EVERYONE *(2026-11-19)*

- **What he hears:** the unison as it is on D where no brick stands, on another note — everyone the same note, held, no scatter.
- **How to make one:** `"unison": <pitch class>` on a harmony brick, e.g. `{ "start": 415.2, "end": 417.4, "unison": 10 }` = B♭. Each player's own D
  key is moved the nearest way to that note (the glockenspiel's key with it).

### A STACK HELD *(2026-11-19)*

- **What he hears:** a few note names (a fifth, three or four stacked fifths) as a steady chord — each player on one note, no octave change.
- **How to make one:** `"pcs": [...]` with `"hold": true`. The notes go up the ensemble in the stack's order (cello · piano · alto sax ·
  clarinet · violin · flute · glockenspiel, round again); each on the key nearest the player's own D. `seed` + 1 deals the notes one player on.

### SHUFFLE WITHIN THE CHORD *(his phrase, 2026-11-19)*

- **What he hears:** the chord stays (its take), but every strike of a player is another note of it — "each player is playing a different
  note every time, even if some of the notes come back".
- **How to make one:** `"shuffle": true` on a take brick (a tick box on the brick's row; `new draw` beside it). The candidates are ALL the
  take's keys, each as written where the player reaches it, else moved by octaves into its range; never the key just played.

### THE CHORD RHYTHM (how long each chord lasts) — `tools/harmony_fill.js` and by hand

- **The coin and two buckets.** A baseline tempo (68; a beat = 0.882 s). Each chord's length is a coin flip between a SHORT bucket and a
  LONG one, e.g. `--short 2 --long 2.5,3,3.5`. `--jitter 0.25` moves each length by up to a sixteenth so they do not sound equal.
- **By ear.** He names score times ("295.2, 296, 296.8, 297.7"); each becomes a change of chord.
- **A steady quick pulse.** A change every N beats (0.75) with a small jitter (a thirty-second).
- **A growing series.** A first length (0.70 s), each next about a sixteenth longer, the step itself varied a little.
- **The pace by band.** The chord rhythm follows the tuplet chunk under it: fast = a change every beat at 68 · medium = a sixteenth longer
  (1.25 beats) · slow = another sixteenth (1.5 beats).
- **The takes.** Drawn from the full set of his `MTch…` takes (144 on 2026-11-19) WITHOUT REPEATS until all are used
  (`--takes "^MTch(ord)?\d+(st|c|d)?$"`, `--keep-deck` to go on with the unused ones).

### THE TUPLETS (`docs/TUPLET_BANDS.md`, `tuplets.js`)

- A chunk = a stretch of time, a band, the players it applies to. Inside it a strike is always a subdivision (never the single strike).
- `rate` 0 … 5: one tuplet for the whole chunk · 2–5 beats each · 2–4 · 1–3 · 1–2 · a new tuplet every beat. Lengths are always uneven; a
  figure does not come straight back; never a round.
- `shareFrom → shareTo`: how many strikes become tuplets across the chunk (the slide from singles to tuplets).

## The passes still to come (his list, SW-51)

1. Finish the electronics for the end (the beds swell and end together at 480).
2. The harmony pass (in hand: 291.8 → 324.3 placed on 2026-11-19).
3. The crescendo pass.
4. The accent pass.
