> **Provenance (decibel TENOR 2026, 2026-10-04):** copied from piece #6 `septet_LGMF_2026/docs/RENDER.md` @ `0d70fda` (the new-piece protocol's 3.1 · 3.6). The text below is unchanged: it describes the tool as built for the EARLIER pieces — the instrument names, the lanes, the measurements and every `§N` are theirs (`#6 §N`, or `#5` where it says so). It is tidied when the tool is next used here (his word 2026-10-04, RUNNING_LOG §11).

> **Provenance (septet LGMF 2026, 2026-09-17):** copied unchanged from piece #5 `septet_2026/docs/RENDER.md` with the port of the code it describes (PLAN 0b / 0g). **It describes the tool as it was built for the TEMPUS septet: its instrument names, its `§N` references into that piece's `RUNNING_LOG`, and its measurements are piece #5's.** The mechanism is what carries. Where this piece changes the tool, the change is recorded here and dated. **Nothing in it runs yet:** it describes capturing the composer's playback through the Reaper bridge, and this piece has no rack (0e).

> **THIS PIECE (decibel TENOR 2026, 2026-10-10 — PLAN 2.8; RUNNING_LOG §384 … §386): THE AUDIO IS A TAKE, NOT A RENDER.** § 0 below is this piece's route. Everything from "# The audio render" on is the OFFLINE render of pieces #4 … #6, unchanged — it has no electronics in it; here it is only the fallback for the players' part (not built: `take.js mix --players offline`). Its measure-and-gain step is shared with the take: `tools/lib/gain_step.js`.

# § 0 The take — the piece played once with the live electronics, recorded, aligned, mixed

**Why:** the electronics are a LIVE process (the engine hears the players over ReaRoute, is told by the page at play time, rolls at the moment; its sound returns on the track `ELEC RETURN`). An offline render has no engine in it. So the piece is PLAYED in real time and recorded.

```
node tools/take.js start --score <name> [--from 0] [--to S]     # a COPY of the rack opens in its own tab and RECORDS
        ▶ on the composer page, from --from — HIS (his Chrome has the MIDI)
node tools/take.js stop                                         # stops, gathers, closes the tab, ALIGNS
node tools/take.js mix [--out <name>] [--elec-db 0] [--up --maxUp 6]   # the stems summed → the gain step → notation/audio/<name>.wav
node tools/take.js list
```

Needs: Reaper open on the rack, SAVED, the bridge alive · his engine up (`start_electronics.bat`) — asked one hello, never started or stopped · the composer page on the score, in his Chrome.

| # | Rule | Why |
|---|---|---|
| 1 | **The rack is never written** — the take is a copy (`reaper/<score>_take.rpp`) in its own tab; a rack with unsaved changes refuses | the rack is his; the copy would miss the changes |
| 2 | **Three things on one timeline:** `REC`'s output (the players' sum, post-fader) · `ELEC RETURN`'s output (the engine) · the sixteen instrument tracks' MIDI | two stems for the mix; the MIDI is the alignment's reference |
| 3 | **Both stems are recorded as OUTPUTS** | an input recording is moved by Reaper's latency compensation, an output recording is not; recorded alike, the files hold the relation he hears |
| 4 | **Only `ELEC RETURN`'s record mode moves** ("do not record" → "output"); no arm, no monitoring changes | the sound path of the copy is the rack's |
| 5 | **32-bit float** | piece #4's clip lesson: a peak over 0 dBFS is measured, not clipped |
| 6 | **Aligned by the recorded MIDI, by time alone** — the offset AND the drift | the page runs on the system clock, the recording on the audio clock; the recorded notes are the one written on the other |
| 7 | **A drift past 16 ms at the take's end is resampled; under it, shared between the two ends** | half a frame of the film; under it the correction is not worth a resampling |
| 8 | **The mix is what he heard** — REC's own fader undone, the master's applied, the electronics at unity (`--elec-db` moves the MIX only) | the take is a recording of the room, not a re-balance |
| 9 | **The gain step is the render's** — the true peak measured on the float file, ONE plain gain to −1 dBTP, 24-bit; no limiter, no normalize | the loudness range is the composition |
| 10 | **A take of a part says `--out`** — it may not write the piece's WAV | a dry run must not replace the piece's audio |
| 11 | **Each take is another roll of the electronics** — by design; the players' part is the same every time | the engine decides at the moment |

A take's folder: `notation/audio/takes/<score>/<NN>/` — the two recorded files (Reaper's names; `take.json` says which), `midi.json`, `take.json`, `align.json`, `aligned/players.wav` · `aligned/elec.wav` (score time, sample 0 = `--from`). Gitignored.

## § 0.2 FOR THE NEXT TAKE — what a re-render must look at *(collected as it is found; a line is struck when a take has it right)*

- **SEVENTEEN PERCUSSION STRIKE NOTES AND TWO VIOLA NOTES WERE SILENT BY THEIR KEYS in take 01 of D** (2026-10-10, the meter watch; RUNNING_LOG §421; SWEEP_LIST #21) — the placeholder voice `main` sounds only on a bongo key (ten notes), a by-key voice’s keys are sparse inside its declared range (seven notes), the viola’s Bartók has no sound at 77 · 78 (two notes). ALL MOVED onto the nearest sounding key of the same voice in `piece-Draft01d` (§422; `properties.keyFix` · `rangeFix`); `strike_perc.js` draws from the voice’s key list now; the table’s row `viola.bartok_vel` is [50, 66]. The notation draws no pitch for a strike: no re-cut needed for the look (the IR’s note pitches differ from D until the next cut). AT THE NEXT TAKE: the watch again — every percussion note of the section should show. **✓ TAKE 02 OF D: 16 of 17 sound (−13 … −31 dB on their tracks); the spring coil at 702.716 s FAINT, −46 dB (a quiet patch: its loudest moment in the take −30) — his ear; the viola’s two sound.**

- **The viola's first note is silent** (2026-10-10, RUNNING_LOG §400; SWEEP_LIST #20) — `wc-22`, 4.480 s, Bartók pizzicato, **key 77** (the pitch roll of §373 put it there; it was 71): the MIDI arrives, the viola makes no sound, its microphone window is empty, and the returns of `va-impulse-1` play the capture of BEFORE the roll. Before a take: a key that sounds there (`node tools/impulse_pitches.js --score <the piece> --off` puts every rolled note back; or the table's row `viola.bartok_vel` narrowed and another seed). Of the take's 79 microphone windows this is the only silent one. **CHANGED 2026-10-10 (RUNNING_LOG §420, DEC-189): back to key 71 in `piece-Draft01d` (the bank holds that capture).** **✓ TAKE 01 OF D: it sounds (key 71, −15 dB on its track).**
- **The percussion at 236.4 s is too quiet** (2026-10-10, his ear on take 02; RUNNING_LOG §407, DEC-176) — the percussionist's FIRST DRONE RECORDING: the bowed China cymbal `wc-737` (236.607 … 245.457 s, key 57, a plain note at velocity 64) under the mic opening `perc-drone-1` (236.507 … 243.977 s). NOTED ONLY, at his word — nothing changed, nothing diagnosed. Before a re-take: its level, his to say how much (the note's velocity is the first thing to look at; the drones made from this recording take their source from it). **CHANGED 2026-10-10 (§420, DEC-189): the note on the builder’s sounding fields, velocity 100, as the clarinet’s at §382; the cymbal’s stretch is passed before the take so its drones come from the new recording.** **TAKE 01 OF D, his ear (DEC-190): still a little quiet at velocity 100, and recording 2 a little too → the China Cymbal track’s fader +4 dB (−3.99 → +0.01, his CTRL+S) and recording 1’s note at 127 (§421 · §422). To hear in the next take.** **TAKE 02 OF D: +4 dB at the master on all three recordings (the fader); velocity 127 did nothing to the bow (−30.3 vs −30.9 pre-fader, DEC-192) — his ear; another step is the fader again.**
- **The bass clarinet at 527.75 s is too quiet** (2026-10-10, his ear on take 02; RUNNING_LOG §409, DEC-178) — its beating pair that begins at 528.007 s: the note `wc-917`, F♯2 (key 42), senza vibrato, velocity 37 (the page's p), to 557.107 s; its sine `zn-918` is written f. NOTED ONLY, at his word — nothing changed, nothing diagnosed. Before a re-take: its level, his to say how much. **CHANGED 2026-10-10 (RUNNING_LOG §419, DEC-188): the clarinet’s FIVE low pairs (F2 / F♯2 at 510.4 · 528.0 · 567.4 · 607.4 · 626.2 s) have their notes at mf (velocity 72) in `piece-Draft01d`; the sines stay f. To hear in the take of D.** **In takes 01 · 02 of D at mf (velocity 72) — his ear unsaid.**
- **THE RUN OF STRIKES AT ~680.6 s (679.9 … 683.9 s) — his ear: some may not sound, or not on time** (2026-10-10, RUNNING_LOG §418, DEC-187). ELIMINATED: the notation (every GC there is on its note's own time, 40 of 40; drawn at its x to the pixel) and THE SENDING in take 02 (its recorded MIDI: all 29 notes of the stretch sent within 1.4 ms of their time, on the right track and key). NOT CHECKED, AND WHAT IS LEFT: whether each instrument SOUNDED — the take's players are one summed stem. In take 02 the bass clarinet's arc at 682.791 s has no note under it at all (added after the take; so the clarinet's at 677.058 s and the flute's at 678.915 s). AT THE NEXT TAKE: listen to that stretch, or read the tracks' own meters during the pass (`reaper/bridge/jobs/peak_watch.lua`); voices there that sit at the edge of a range and have not been measured: the bass clarinet's slap on key 64 (682.791 s) · the cello's Bartók on key 71 (683.310 s). **CHANGED 2026-10-10 (§420, DEC-189): the two edge notes an octave down (the clarinet’s slap 64 → 52, the cello’s Bartók 71 → 59); during the take every track’s meter is read (`tools/vet/peak_watch_take.lua`) — the run is read from that file.** **TAKE 01 OF D, THE WATCH: every wind and string note sounded; the two octave-moved notes sounded; TWO PERCUSSION HITS DID NOT (681.877 · 683.258 s) — and thirteen more across the section: THE KEYS (§421); moved onto keys that sound (§422).**
- **THE NEXT TAKE IS OF `piece-Draft01d`** (2026-10-10, RUNNING_LOG §414, DEC-184): his new version of the piece, with ELEVEN STRIKES REPLACED by his A takes (`tools/strike_swap.js` — twelve notes added, three moved, two re-pitched; the strike windows at 724.8 · 730.3 · 741.3 s re-spanned). `node tools/take.js start --score piece-Draft01d`; THE MAIN SCORE IS CUT FROM D since §416 — so its ♪ render chip finds NO audio until this take exists (`notation/audio/piece-Draft01d.wav`); take 02 (`piece-Draft01c.wav`) is the piece before the thirteen notes. The last of them, 11:49.2, was replaced again by `strikes31aa` (§415): EVERY WRITTEN STRIKE HAS ITS FIVE PLAYERS (13 notes added in all). **✓ MADE — take 01 of D (§421); the next is of D again, after §422’s fixes.**
- ~~**THE STRIKES: 21 strikes lack a player's note — 25 places**~~ *(superseded by the line above for the eleven written ones; the ten free ones stand)* **— as it read:** (2026-10-10, his eye on the notation; RUNNING_LOG §411, DEC-181: "some parts aren't filled in … I must have done a shuffle and the note wasn't assigned that instrument"). In the WRITTEN strikes (the player has no attack): 676.9 (bass clarinet) · 678.7 (bass flute) · 682.4 (bass clarinet) · 709.1 (bass flute, viola) · 717.0 (bass clarinet) · 721.8 (bass clarinet) · 724.8 (percussion, viola) · 727.0 (percussion) · 729.2 (viola) · 730.3 (bass clarinet) · 741.3 (bass clarinet). In the FREE strikes: 685.7 (percussion) · 689.0 (bass clarinet) · 690.7 (percussion) · 695.0 (bass clarinet) · 705.5 (bass clarinet, percussion) · 715.3 (bass clarinet) · 718.7 (bass clarinet, percussion) · 742.4 (bass clarinet) · 744.7 (bass flute) · 752.2 (percussion). NOT FILLED IN — each needs a time, a pitch and a voice, and one more hit changes the rhythm the electronics answer; his to say (the notation draws the window on every lane regardless).
- **The strike window at 742.37 s is twice as long in the score as in take 02** (§412, DEC-182: `zn-1650` now ends 742.514 s) — the electronics listen that much longer there. **✓ in take 01 of D.**
- **THE ELEVEN WRITTEN STRIKES THAT LACK A PART — time code · take** (§412; he will bring rhythms): 11:17.0 strikes01 (bass clarinet) · 11:18.8 strikes02 (bass flute) · 11:22.5 strikes06 (bass clarinet) · 11:49.2 strikes31 (bass flute, viola) · 11:57.1 strikes36 (bass clarinet) · 12:01.9 strikes39 (bass clarinet) · 12:04.9 strikes40 (percussion, viola) · 12:07.1 strikes41 (percussion) · 12:09.3 strikes42 (viola) · 12:10.4 strikes44 (bass clarinet) · 12:21.4 strikes45 (bass clarinet).
- **Two mic openings are shorter in the score than in take 02** (§393): `vc-petal-30` now ends 151.906 s, `perc-petal-13` 154.577 s. A take after his Reload has them. **✓ in take 01 of D.**
- **The clock's drift** was 9.65 ms over the piece in take 02, left and shared between the two ends. It can be taken out of an existing take with no new one: `node tools/take.js align --take NN --resample always` then `mix`.
- **A full pass first** — the returns of a take play the captures of the pass before it.
- **The notation's page for the audio:** the official score `approaching` names `piece-Draft01c`; a take of another score name needs the score re-cut from it (PLAN 2.10).

## § 0.1 Register — the takes *(append-only)*

- **2026-10-10 — TAKE 02 OF `piece-Draft01d`, 0 … 778.732 s — THE PIECE’S AUDIO** (RUNNING_LOG §423; the save with §419 … §422’s fixes; the rack as he saved it 22:34 — the China Cymbal fader +0.01 dB; his engine of 12:30:41, mode `compose`; recorded 22:34; no pass before it). 822.8 s recorded · 1,399 notes on 16 tracks. Aligned: score 0 at 14.6551 s · notes **686/686** (±0.45 ms) · drift **−9.78 ms (−12.6 ppm)**, left, shared. Players: first sound 1.532 s · −20.6 LUFS · 0.1 dBTP. Electronics: first sound 6.51 s · −19.9 LUFS · −1.9 dBTP. Mix (as heard): **784.732 s** · float **0.9 dBTP** · −17.8 LUFS · LRA 12.1 · gain **−1.9 dB** → **−1.0 dBTP · −19.7 LUFS** → `notation/audio/piece-Draft01d.wav` (take 01 of D replaced) — the main score `approaching` plays it. THE WATCH: 16 of the 17 moved percussion notes sound, the spring coil at 702.7 s faint (−46 dB pre-fader); the viola’s two Bartók notes sound; the bowed cymbal’s lift is the fader’s (velocity does nothing on it, DEC-192). His ear: pending.

- **2026-10-10 — TAKE 01 OF `piece-Draft01d`, 0 … 778.732 s** (RUNNING_LOG §421; the save with §419 · §420’s fixes; the rack as saved 2026-10-09; his engine of 12:30:41, mode `compose`; recorded 22:04). 843.8 s recorded · 1,399 notes on 16 tracks. Aligned: score 0 at 40.8806 s · notes **686/686** (±0.44 ms) · drift **−9.76 ms (−12.5 ppm)**, left, shared. Players: first sound 1.532 s · −20.5 LUFS · 0.1 dBTP. Electronics: first sound 6.431 s · −19.9 LUFS · 0.1 dBTP. Mix (as heard): **784.732 s** · float **0.5 dBTP** · −17.7 LUFS · LRA 12.1 · gain **−1.5 dB** → **−1.0 dBTP · −19.2 LUFS** → `notation/audio/piece-Draft01d.wav` — the main score `approaching` plays it. THE METER WATCH ran through it (`tools/vet/peak_watch_take.lua`, every track’s pre-fader peak, 50 ms): fifteen percussion notes and two viola notes silent by their KEYS (§421) — moved onto sounding keys for the next take (§422). His ear: the two bowed China cymbals still a little quiet (DEC-190).

- **2026-10-10 — the DRY RUN, take 01 of `piece-Draft01c`, 0 … 37 s** (RUNNING_LOG §387; the save of 12:41; his engine of 12:30:41, mode `compose`). 82.8 s recorded · 49 notes on 12 tracks. Aligned: score 0 at 17.9471 s · notes 30/30 (±0.34 ms) · drift 0.13 ms over 37 s (3.4 ppm), left. Players: first sound 1.527 s (first note 1.525) · −20.8 LUFS · −1.3 dBTP. Electronics: first sound 6.516 s (the first return, an `ar` roll 123 ms before its centre) · −20.4 LUFS · −0.9 dBTP. Mix (as heard): 43.000 s · float −0.9 dBTP · −19.0 LUFS · LRA 15.5 · gain **−0.1 dB** → **−1.0 dBTP · −19.1 LUFS** → `notation/audio/piece-Draft01c-dry.wav` (a part: not the piece's WAV). His ear: unsaid — he went on to the full take.
- **2026-10-10 — THE FIRST FULL TAKE, take 02 of `piece-Draft01c`, 0 … 778.732 s** (RUNNING_LOG §388; the save of 12:41; the rack as saved 2026-10-09 03:54 UTC; his engine of 12:30:41, mode `compose`). 817 s recorded · 1,386 notes on 16 tracks. Aligned: score 0 at 13.9195 s · notes **673/673** (±0.45 ms) · drift **−9.65 ms over 778.7 s (−12.4 ppm)**, left, shared between the ends. Players: first sound 1.533 s (first note 1.525) · −20.7 LUFS · +0.1 dBTP. Electronics: first sound 6.479 s · −19.9 LUFS · −1.0 dBTP. Mix (as heard, 0 dB / 0 dB): **784.732 s** · float **+0.4 dBTP** · −17.8 LUFS · LRA 11.6 · gain **−1.4 dB** → **−1.0 dBTP · −19.2 LUFS** → `notation/audio/piece-Draft01c.wav`. Not linked to a notation page yet (the pages name `piece-3BodyRedo`). His ear: pending. **LINKED 2026-10-10 (RUNNING_LOG §398): the official score `approaching` (0 … 209 s) names `piece-Draft01c` — the ♪ render chip shows this WAV on it.** (The save has two mic openings 107 and 160 ms shorter since §393; the take is of the save before.)

---

# The audio render — the composer's playback, recorded in Reaper, linked to the notation score

*RUNNING_LOG §453 (2026-09-13). The composer: "Let's prep the recording and sort out the trill midi and then generate the midi file and
do a record and then link it to the notation score … can you look at … the specs for the tuba piece? because there was clipping, and we
had to redo it a couple times and reduce the volume."*

## §1 The route — three commands

```
node tools/capture_composer_midi.js          # ~13 min · the composer's own playback, message by message → midi/piece-septet.capture.json
node tools/export_midi.js --capture midi/piece-septet.capture.json   # seconds · checked, laid out as the rack → midi/
node tools/render_reaper.js                  # minutes · Reaper renders through the bridge → notation/audio/piece-septet.wav
```

Needs: the score server on :5300 (`node score/server.js`), Reaper open with the bridge alive, the rack SAVED (the render copies the file).
Then: the notation page (CTRL+SHIFT+R) → the MAIN file → **♪ render** → the page's clock follows the WAV.

**Re-render whenever the score is saved again** — the WAV is the playback of `scores/piece-septet.json` at the moment of the capture
(`notation/audio/raw/piece-septet-render.json` records when). The export warns if the file was saved after the capture.

## §2 The rules, and where each one lives

| # | Rule | Why | Where |
|---|---|---|---|
| 1 | **The events are the composer's own playback** — composer.html run headless under a virtual clock, its MIDI sends recorded | the shared computation (`sonify_core`) never learned the septet's rules: trills, eaten notes, the measured velocity and CC7, the secco cut, the late switch beside a trill (§441–§443). A second copy drifts; the composer IS the engine | `tools/capture_composer_midi.js` |
| 2 | **The capture cannot write** — every non-GET request refused; the score is loaded from its FILE, never the working copy | a second composer tab clobbers the working copy (PLAN 2d.5.8) | same |
| 3 | **Checked against the score before a file is written** — every trill note at its time (±3 ms), every sounding note once, the eaten notes silent, nothing unexplained, nothing left hanging, the file read back | a render of a wrong stream costs a render | `tools/export_midi.js` |
| 4 | **Each track gets what its live input gets** — the whole port, all channels (four piano tracks = the Piano port each; two bass clarinet tracks = the BassCl port each); a track with no MIDI input gets one inert message | the rack is calibrated on live input; the file must reproduce it, not reinterpret it | same (`RACK_PORT`, read from the .rpp) |
| 5 | **60 BPM / 960 PPQ; the project set to 60** — one beat = one second | piece #4: the rack sat at 120 and would have halved every duration | the files · `render_reaper.js` |
| 6 | **Placed BY TRACK NAME, never by position** (the n-th file of a name on the n-th track of that name) | piece #4: a duplicated Tuba8 pair shifted a positional drop one pair low | `render_reaper.js` · `reaper/place_piece-septet_midi.lua` (by hand) |
| 7 | **The REC folder is NOT muted** | in this rack REC is the folder every part sums through; piece #4's REC was a second send (+6 dB on two tubas) and had to be muted | `render_reaper.js` |
| 8 | **The render is 32-bit FLOAT; the peak is measured on the FILE** (ebur128 true peak), then ONE plain gain brings it to −1 dBTP (never up), written as 24-bit | piece #4's first render clipped at +4.2 dBFS because the pre-flight measured a SUSTAINED loud passage while the peaks were SIMULTANEOUS ATTACKS, 11.6 dB higher; the fix was the master −6 → −13.5 and a second render. Float cannot clip, so there is no second render | `render_reaper.js` |
| 9 | **No limiter, no normalize** | the loudness range is the composition (piece #4: LRA 19.8) | same |
| 10 | **Proved off the file** — the length from the sample count, the first sound against the first onset | piece #4: 762.000 s exactly; the first sound 32 ms after the first onset (the sampler's attack, constant, not drift) | same |
| 11 | **The WAV's name = the IR's `source.score`** (`notation/audio/piece-septet.wav`) | the page's `detectRender` matches `<source.score>.*` | same |
| 12 | **The rack is never written** — the render is a COPY in its own tab (`reaper/piece-septet_render.rpp`), closed afterwards | the rack is the composer's | same |

## §3 By hand, if the bridge is not running

1. In Reaper: File → Save project as… `reaper/piece-septet_render.rpp` (a copy of the rack). Project settings → tempo **60**.
2. Actions → Show action list → New action → Load ReaScript → `reaper/place_piece-septet_midi.lua` → Run. It sets 60 BPM and places every
   part by name, building each item directly (no import prompt); its message lists each track with its note count. (Or drag
   `midi/piece-septet.mid` onto **Flute SI2** at 0:00 — its 14 tracks are the rack's order — answer Reaper's "Import 16-channel MIDI as…"
   with **Multichannel item on a single track**, and check each item landed on the track of its name.)
3. File → Render: master mix · bounds custom 0 → the last note + 6 s · WAV **32-bit float** · 48 kHz · stereo · no normalize.
4. Then the measure-and-gain step: `node tools/render_reaper.js --skip-render`.

## §4 Register

*(append-only)*

- **2026-09-13 — the first septet render** (RUNNING_LOG §453). `piece-septet.json` as saved 02:12. Capture: 37 627 frames, 20 565 messages,
  0 writes. Checks: trill notes 2066/2066, notes 1739/1739, 11 eaten silent, 0 unexplained, 0 hanging. Reaper: 14 items by name, counts
  equal. Render: 150 s · 630.100 s · float true peak **+2.0 dBTP** (would have clipped at 24-bit) · −22.7 LUFS · LRA 14.1 · gain **−3.0 dB** →
  **−1.0 dBTP** · first sound 3.7 ms after the first onset. The first attempt stopped on Reaper's MIDI-import prompt → items now built
  directly (`tools/reaper_midi_place.js`). Linked: ♪ render ✓ on the MAIN file. His ear on the sync: pending.
- **2026-09-16 — the re-render, PLAN 2i.9** (RUNNING_LOG §553–§554). `piece-septet.json` as saved 16:03. Capture: 37 627 frames, 20 789
  messages, 0 writes. Checks: trill notes 2066/2066, notes 1737/1737, 11 eaten silent, 0 hanging, **bend (e): 183 bent notes, every bend in
  place, none on a bent channel** (the check now reads each instrument's measured range — the Xsample parts bend ~1 st). Reaper: 14 items by
  name, counts equal. Render: 141 s · 630.100 s · float true peak **+1.9 dBTP** · −21.8 LUFS · LRA 13.8 · gain **−2.9 dB** → **−1.0 dBTP** ·
  first sound 3.7 ms after the first onset. The first attempt refused on the bridge guard's heartbeat race → the tool now waits for the
  heartbeat to name the render tab. His ear: pending.
- **2026-09-17 — the Bloom practice videos' renders, PLAN 2h.7** (RUNNING_LOG §599–§600; not the piece's WAV — `render_reaper.js --dir/--only/--out/
  --end/--gainWindow`, refused without an `--out` of another name). Pair recordings, 0 → 312 s, gain read in the used window and allowed UP (demo files
  only): `demo-bloom-bclvc.wav` +13.3 dB · `demo-bloom-vn1va.wav` +13.4 · `demo-bloom-flvn2.wav` +16.2. Held dyads `demo-bloom-heldmax` (six takes a
  pair, 0 → 660 s, 69 s). **Found:** every Xsample note-on lands ±1–2 c from its bend (the SI2 flute is exact) — one strike is a draw; the takes
  are picked by `tools/pick_bloom_takes.js`. `piece-septet.wav` sha unchanged throughout.
- **2026-09-26 — THIS PIECE'S FIRST RENDER: Draft 01** (RUNNING_LOG §405 · §406; `scores/piece-Recombination-Draft01-done.json` as saved
  00:28 UTC, its notes = `e9f340a`). The tool re-pointed at this rack (`export_midi.js` `RACK_PORT`: 29 tracks → 11 `LG` ports) and the
  capture's frame 0 stepped (a note at 0.000 s was one frame late). Capture: 1076/1076 notes, 436 bends in place, 0 hanging. Reaper: 29 items
  by name, counts equal; 276 s. Render: 886.664 s · float true peak **−11.0 dBTP** · **−28.8 LUFS** · LRA 20.1 · gain **0 dB** · first sound
  1.700 s (the EH opens from niente — CC7 0 rising; the sync is right). `notation/audio/piece-Recombination-Draft01-done.wav`. Not yet linked:
  the MAIN IR's `source.score` is still `piece-LGMF-Sec01-Sec02-sec03a`. His ear: pending.
- **2026-09-26 — Draft 01, the level at his word "b"** (RUNNING_LOG §407): `render_reaper.js --skip-render --up` — gain **+10.0 dB** (plain) →
  **−1.0 dBTP**, ≈ −18.8 LUFS, LRA 20.1 untouched. `--up` is new: the piece's gain may go up to `--peak`; **a future render of the piece passes
  it.** Linked: `piece-lgmf` re-extracted from Draft 01 (`source.score` = `piece-Recombination-Draft01-done`). His ear: pending.
- **2026-10-01 — Draft 01 re-rendered after session 18's changes** (RUNNING_LOG §671; `scores/piece-Recombination-Draft01-done.json`
  as saved 12:46 UTC — §669's chord unison (82 onsets), the EH's 343.12 lengthened · 389.8 D6 → D5, the DB's 329.26 A5 → A4 · 309.96 C♯5 → C♯4).
  Capture: 24 800 messages · 53 020 frames · 0 writes. Checks: notes 1076/1076, 436 bends in place, 0 hanging, read-back ok. Reaper: 29 items
  by name; 273 s. Render: 886.664 s · float true peak **−10.9 dBTP** · −28.8 LUFS · LRA 20.1 · `--up --maxUp 6` (§670, its first use): the
  gain to −1 dBTP would be +9.9 dB, **capped at +6.0 dB** → **−4.9 dBTP · −22.8 LUFS**, the LRA untouched · first sound 1.700 s (as before).
  Linked: `source.score` unchanged, the server lists the WAV — no re-extraction. His ear: pending.
- **2026-10-01 — Draft 01 re-rendered at the notation's lock** (RUNNING_LOG §689; the save as of §675 — the vibraphone's `wc-4819` deleted,
  `wc-4820` on 765.0). Capture: 24 788 messages · 53 020 frames in 280 s · 0 writes. Checks: notes 1075/1075, 435 bends in place, 0 hanging,
  read-back ok; moved against the committed MIDI: the vibraphone, the whole-piece file, and 7 bytes of `28 Bass XS` (same length — not
  traced). Reaper: the rack as saved 18:48 UTC, 29 items by name; 288 s. Render: 886.664 s · float true peak **−11.0 dBTP** · −28.8 LUFS ·
  LRA 20 · `--up --maxUp 6`: +10 to −1 dBTP, **capped at +6.0 dB** → **−5.0 dBTP · −22.8 LUFS** · first sound 1.686 s. Linked: unchanged.
- **2026-10-01 — Draft 01 re-rendered with the trumpet at 367.80 in unison** (RUNNING_LOG §697 · §698; the save as edited at his word —
  `wc-3599` 367.975 → 367.804). Capture: 24 788 messages · 53 020 frames in 305 s · 0 writes. Checks: notes 1075/1075, 435 bends in place,
  0 hanging, read-back ok; moved against the committed MIDI: `08 Trumpet SI2` and the whole-piece file only (the trumpet's note-on at
  367.804 read off the track). Reaper: 29 items by name; 285 s. Render: 886.664 s · float **−11.0 dBTP** · −28.8 LUFS · LRA 20 ·
  `--up --maxUp 6`: **capped at +6.0 dB** → **−5.0 dBTP · −22.8 LUFS** · first sound 1.686 s. Linked: unchanged. The film re-made from it.

## §5 The print score *(a pointer — it is not an audio render)*

The print score is made by `bash print/score/build.sh` (PLAN § 2.16; the commands, the five gates and paper's own rules:
CLAUDE.md § Apps, THE PRINT SCORE). It is drawn from the page `notation/ir/approaching.ir.json` AS FILMED, never from the save, and
never rebuilt for a draft that has its film. **The order when the score moves:** the page → the take (§ 0) → the film → the print.
The approved file of Draft 01: `print/score/approved/2026-10-11-draft01/` (its README says what made it; the tag
`Approaching-Draft01-print_1.0`).
