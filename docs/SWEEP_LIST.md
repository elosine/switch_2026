# SWEEP LIST — faults met while composing, logged not fixed

*(Per piece, started empty. The device is piece 4's — `septet_2026/docs/SWEEP_LIST.md`, opened 2026-09-10, `#5 §352–353` in the old
numbering. The rule: when a tool blocks, write one line here and route around it — a console line, a different card, a re-insert.
Do not stop to fix. The sweep, in its own session and on a copy, takes this list and returns ONE report; the composer
gives verdicts once; ONE global fix follows. A line is closed here only when the fix is verified in the running app.
`docs/NITS.md` stays what it is — deferred and not now; this list is real and batched soon. Piece 6's `his` test rows are closed
at this start, never carried.)*

**Format:** date · where (which card / drawer / mode) · what I did · what happened · what I expected · blocking? (Y/N)

| # | Date | Where | What I did | What happened | Expected | Blocking |
|---|---|---|---|---|---|---|
| 1 | 2026-11-09 | the materials drawer (PLAN 1a.8) | dragged a row onto a lane | nothing landed | a material brick at the drop | N — **FIXED the same hour** (RUNNING_LOG §109: the lane wiring ran before the host had lanes; now it waits). Proven on the throwaway by a synthetic drag; closed when his real drag lands |
| 2 | 2026-11-09 | the score, play, a material brick on Elec 1 | pressed play | no sound | the material on ELEC RETURN | N — **CAUSE FOUND the same hour** (RUNNING_LOG §110): the full rack had no ELEC RETURN track (the 2026-11-07 NITS line); `node tools/elec.js route` run — track 25 in his open Reaper, his CTRL+S pending. **Still silent with the route in (§111): a SECOND cause, the engine's — the material synth started before its file was cued (SuperCollider evaluates the cue's completion function before the read); fixed in `material.scd`, the engine to be restarted.** Closed when he hears it |
| 3 | 2026-11-09 | the sine brick, play from inside its span | pressed play mid-span | the sine popped in | the 1 s fade | N — **FIXED** (§123): the page sent a 15 ms rise for a start inside the brick (the AI's own rule); now the brick's fadeInMs. Closed when he hears the fade |
| 4 | 2026-11-12 | the composer score's bar, looking for the phase machine (SW-42) | opened Panels ▾ | no Phase entry, no PHASE button anywhere | the PHASE button beside MT (PHASE_TOOL.md) | N — **FIXED the same minute**: the Panels ▾ menu is a fixed list in `composer.html` and the new button, anchored after MT in the hidden bar, was never listed; `['phBtn', 'Phase']` added. Closed when he opens it after F5 |
| 5 | 2026-11-12 | a material brick's panel, Start (s) | sliced a brick, then typed a new start | the brick grew the sliced part back; the sound stayed put | the whole brick moves, its sound with it | N — **FIXED the same hour** (`composer.html` applyPanelField: a brick's typed start shifts its end too, so the edge rule reads a move). Closed when he types a start and the brick moves whole |

- **2026-11-19 — THE TUPLET WORKSHOP WENT QUIET WHILE PLAYING, THEN BLIPS** (his report: "the page was playing for a while, and then all of a
  sudden it stopped making noise … when I shut the server there was a little blip … still little blips coming through the Reaper rack"; he
  closed every server and Reaper and restarted the machine). NOT REPRODUCED; no evidence gathered at the time. A real weakness found in the
  page and cured (RUNNING_LOG §228): its notes were driven by the page's own 40 ms timer, which Chrome slows to one a second or less when
  the tab is not in front — notes then leave late and in bunches. Whether that WAS the cause is not known (was the tab in front? unasked /
  unanswered). The blips after the page and servers were closed are NOT explained by it. If it happens again: his screen first (the page's
  line under Play, Reaper's MIDI activity), before anything is closed.

- **2026-11-22 · the notation, Section 3 (`s3-phase`), RUNNING_LOG §446:** a group with NO BEAM on both piano staves (three quarters over two beats) takes the cross-staff level — its stems run up to one height and its bracket stands over that. Where its top note is very high (373.4) the stems' ends and the bracket reach the glockenspiel's staff. To mend: an unbeamed group keeps each note's own stem (no leveling), and its bracket goes to the side with room. Seen by him at 373.4; the worst of it (stems stopping inside the treble staff, the bracket through the staff) is mended.
