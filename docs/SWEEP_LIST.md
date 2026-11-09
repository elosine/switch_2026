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
