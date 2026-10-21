// Rendering-recipe config — switch 2026 (the port from piece 6 *Approaching*, the new-piece protocol's 3.4, 2026-10-20;
// container 4 fills it in). One entry per TRACK (score/public/composer.html TRACKS[].instKey).
//
// Schema, inherited from pieces #3/#4/#5: { label, port, rangeLow, rangeHigh, mechanism?,
// techniques: [{ key, label, channel, port?, cc0?, ks?, rangeLow?, rangeHigh? }] }.
//   - `port` is the loopMIDI port (case-exact); a technique's own `port` overrides it.
//   - `channel` is 1-based. `cc0` = Xsample articulation select, sent as a prelude before the
//     note. `ks` = keyswitch notes. `oneShot: true` marks presets that revert after one note.
//   - Ranges are MIDI numbers, middle C = 60, SOUNDING pitch. Written pitch is the notation
//     layer's business (notation/registry/ensemble.json), never this file's.
//   - EVERY VOICE KNOWS ITSELF (LGMF PLAN 1m.4.1, 2026-09-22; RUNNING_LOG §243 · §244): every technique entry carries
//     `kind` — `pitched` (the harmony note sounds) · `key` (the key chooses one of N named sounds: the percussion,
//     multiphonics, key clicks, noises — dealt NO pitch, its note IS the key) · `fixed` (open strings, natural harmonics:
//     the nearest to the harmony note) — and `loud`, where its loudness comes from: `vel` (velocity — the dynamics law's
//     struck note) or `mw` (the mod wheel, Xsample's `MW` presets). A `Velocity … MW` preset is `vel` with `shape: "mw"`:
//     the wheel shapes it, the velocity is its loudness. A `key` entry carries `keys: [{ midi, label }]` — the percussion's
//     from the catalog; the SI2 and Xsample by-key voices `keys: "pending"` until 1m.4.2 reads them from his rack. The
//     drawer's name rule (strike_drawer.js kindOf) is the FALLBACK for an entry without `kind`; tools/roster_check.js
//     names any such entry.
//
// ============================ STATUS: PROVISIONAL ============================
// **Nothing here has been heard in this piece.** Written during the port so that the eight lanes exist, material can be
// assigned to them, the placement engines can route around them and the notation can lay them out. Container 4 (the
// instruments) and container 5 (the calibration) replace every value, with the composer at the machine.
//
//   CARRIED from piece 6, verbatim — its measurements are ITS rack's, re-measured at container 5:
//     percussion        Spitfire Abbey Road Orchestra Percussion. The selection (bank/perc_selection.json) is piece 6's
//                       eight; WHICH instruments this piece uses is the composer's, from the call's list, at container 4.
//     bowed_vibraphone  piece 6's Ricotti mallets (crotales · glockenspiel · xylophone · marimba) — the STAND-IN for the
//                       VIBRAPHONE lane (the call's list; journal D7). The key is piece 5's, kept (docs/NAMING.md § 1).
//     cello             Xsample Contemporary Solo Strings — measured in piece 5's rack, carried through piece 6.
//   PLACEHOLDERS — one or two voices each, so the lane is real (container 4 opens with the read-out per instrument, H6-22):
//     flute · clarinet · alto_sax   IRCAM Solo Instruments 2 (UVI), installed whole on this machine — the flute was piece 4's;
//                                   the clarinet and the sax are new instruments of that known family. Nothing read from it yet.
//     piano                         piece 4's and piece 2's record (8Dio Steinway · IRCAM Prepared Piano 2 · the plucked piano).
//     violin                        the strings' roster by the cello's mechanism; none of the cello's measurements.
//
// PORT NAMES carry an `SW` prefix (journal D4): loopMIDI ports are machine-global, and piece 6's rack (`DEC…`), piece 5's
// (`LG…`) and piece 4's (bare names) may still be live on this machine. These names are the SHAPE; container 4 (4.1) makes them.
//
// TECHNIQUE KEYS are the notation registry's names (notation/registry/techniques.json) wherever one exists, so a key that
// reaches the IR is already drawable; tools/palette_check.js lists the recipe keys the registry does not know yet.

const INSTRUMENTS = {

  // ---- FLUTE — IRCAM Solo Instruments 2 "Flute in C" (UVI), two instances CLONED from piece 4 (container 4, 2026-10-20; RUNNING_LOG §18) ----
  // The rows are piece 4's (septet_2026/sandbox/instruments.js, re-rostered there 2026-09-03 from his UVI browser: 19 presets — 16 on the
  // first instance, 3 on the `b`, three Ordinario curve copies on the `b`'s parts 4 · 5 · 6). The keyswitch notes and ranges are its
  // (its screenshots); the parts (port · channel) are DERIVED by tools/apply_uvi_parts.js from the running rack. Piece 4's "Flute strikes"
  // lane is not carried. Range sounding C4–C7 (+B3). Loudness: NOT measured absolutely (piece 4 was relative) — container 5.
  flute: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2.0,   /* piece 4 MEASURED 2.0 st on this instance (its MEASURED_BEND) */
    label: "Flute", port: "SWFlute", rangeLow: 59, rangeHigh: 96, channels: { main: 1, curve: [2, 3, 4] },
    techniques: [
      // A1 · Flute Aeolian KS
      { key: "aeolian_and_ord", label: "Aeolian & Ordinario",        preset: "Flute Aeolian KS",            channel: 1,  ks: 36, rangeLow: 60, rangeHigh: 83, kind: "pitched", loud: "vel" },   // native C3–B4 (UVI) = MIDI 60–83; tan extension 37–59 and 84+ (screenshot 2026-09-03)
      { key: "aeolian",         label: "Aeolian",                    preset: "Flute Aeolian KS",            channel: 1,  ks: 37, rangeLow: 60, rangeHigh: 83, kind: "pitched", loud: "vel" },   // C#1 red? — composer to confirm (manual: second switch)
      // A2 · Flute Chromatic Scale
      { key: "chrom_scale",     label: "Chromatic Scale",            preset: "Flute Chromatic Scale",       channel: 2,  rangeLow: 48, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A2 screenshot: white C2→ past C5 (right end cut; 96 = the instrument top, provisional); no red keys; purple at C3 + C4 — meaning not in the manual legend; no tan
      // A3 · Flute Cresc & Decrescendo KS
      { key: "cresc",           label: "Crescendo",                  preset: "Flute Cresc & Decrescendo KS", channel: 3, ks: 36, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A3 screenshot: red C1 + C#1; white C3→C6 and beyond (cut ~D6); grey below C3, no tan
      { key: "cresc_decresc",   label: "Crescendo to Decrescendo",   preset: "Flute Cresc & Decrescendo KS", channel: 3, ks: 37, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },
      { key: "decresc",         label: "Decrescendo",                preset: "Flute Cresc & Decrescendo KS", channel: 3, ks: 38, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // D1 looked GREY in the A3 screenshot, not red — the manual's third switch; verify by pressing it
      // A4 · Flute Durations KS (fixed-length notes; manual: C2 / C#2)
      { key: "dur_0_5s",        label: "Duration 0.5 s",             preset: "Flute Durations KS",          channel: 4,  ks: 48, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A4 screenshot: red C2 (48) ✓ manual; C#2 looked black (second switch unconfirmed); white C3→C6+, grey below, no tan
      { key: "dur_1s",          label: "Duration 1 s",               preset: "Flute Durations KS",          channel: 4,  ks: 49, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // C#2 — verify (not red on screen)
      // A5 · Flute FX KS
      { key: "jet_whistle",     label: "Jet Whistle",                preset: "Flute FX KS",                 channel: 5,  ks: 36, rangeLow: 48, rangeHigh: 83, kind: "pitched", loud: "vel" },   // A5 screenshot: red C1 + C#1; tan D1–B1 (38–47) and C5+ (84+); white C2–B4 native; PURPLE C4
      { key: "key_click",       label: "Key Click",                  preset: "Flute FX KS",                 channel: 5,  ks: 37, rangeLow: 48, rangeHigh: 83, kind: "pitched", loud: "vel" },
      { key: "tongue_ram",      label: "Tongue Ram",                 preset: "Flute FX KS",                 channel: 5,  ks: 38, rangeLow: 48, rangeHigh: 83, kind: "pitched", loud: "vel" },   // D1 is TAN on screen, not red — the manual's third switch (tongue ram); verify by pressing   // UNVERIFIED in the loaded patch (composer, 2026-09-04: "i dont see a tongue ram in the sampler") — only C1/C#1 were red in the A5 screenshot; press D1 (38) on the FX KS part to settle it; until then the written tongue ram uses the pizzicato sample
      // A6 · Flute Finger Modes KS
      { key: "harmonic_fing",   label: "Harmonic Fingering",         preset: "Flute Finger Modes KS",       channel: 6,  ks: 36, rangeLow: 79, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A6 screenshot: red C1; white only from ≈G4 (display) → C6+ = MIDI ≈79–96 (upper register); grey elsewhere, no tan
      { key: "discolored_fing", label: "Discolored Fingering",       preset: "Flute Finger Modes KS",       channel: 6,  ks: 37, rangeLow: 79, rangeHigh: 96, kind: "pitched", loud: "vel" },   // C#1 not red on screen — verify
      // A7 · Flute Flatterzunge
      { key: "flz",             label: "Flatterzunge",               preset: "Flute Flatterzunge",          channel: 7,  rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A7 screenshot: no red keys; white C3→C6 (60–96), grey beyond C6 — the top is C6 display = MIDI 96; no tan
      // A8 · Flute Fortepiano
      { key: "fortepiano",      label: "Fortepiano",                 preset: "Flute Fortepiano",            channel: 8,  rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A8 screenshot: no red keys; white C3→C6 (60–96), grey beyond; no tan
      // A9 · Flute Multiphonics Menu (one multiphonic per key)
      { key: "multiphonics",    label: "Multiphonics Menu",          preset: "Flute Multiphonics Menu",     channel: 9,  rangeLow: 60, rangeHigh: 89, kind: "key", keys: "pending", loud: "vel" },   // A9 screenshot: no red keys; white C3→F5 DISPLAY = MIDI 60–89, one multiphonic per key (30, = the manual's table C3..F5 read as display names); tan below C3 and above F5
      // A10 · Flute Ord & Aeolian KS (the two transitions)
      { key: "ord_to_aeolian",  label: "Ordinario to Aeolian",       preset: "Flute Ord & Aeolian KS",      channel: 10, ks: 36, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A10 screenshot: red C1; C#1 not red; white C3→C6 (60–96); grey elsewhere, no tan
      { key: "aeolian_to_ord",  label: "Aeolian to Ordinario",       preset: "Flute Ord & Aeolian KS",      channel: 10, ks: 37, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // C#1 — verify
      // A11 · Flute Ord & Flatterzunge KS (the two transitions)
      { key: "ord_to_flz",      label: "Ordinario to Flatterzunge",  preset: "Flute Ord & Flatterzunge KS", channel: 11, ks: 36, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A11 screenshot: as A10 — red C1, white C3→C6, grey elsewhere
      { key: "flz_to_ord",      label: "Flatterzunge to Ordinario",  preset: "Flute Ord & Flatterzunge KS", channel: 11, ks: 37, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // C#1 — verify
      // A12 · Flute Ordinario
      { key: "ord",             label: "Ordinario",                  preset: "Flute Ordinario",             channel: 12, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A12 screenshot: no red keys; white C3→C6 (60–96); B2 grey (the manual's B3 extension is not in this patch); no tan
      // A13 · Flute Pizzicato
      { key: "pizzicato",       label: "Pizzicato",                  preset: "Flute Pizzicato",  notate: "tongue ram",             channel: 13, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },   // A13 screenshot: no red keys; white C3→C5 native (60–84); tan below C3 and above C5 (stretched)   // NOTATES AS TONGUE RAM (composer, 2026-09-04: "pizzicato sounds loud in sample, just note that we'll notate this as tongue ram") — the SI2 pizzicato sample stands in for the written tongue ram; RUNNING_LOG §44
      // A14 · Flute Play & Sing KS
      { key: "play_sing",       label: "Play and Sing (sung C4)",    preset: "Flute Play & Sing KS",        channel: 14, ks: 36, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A14 screenshot: red C1; C#1 not red; tan C#1–B2 (37–59) below; white from C3 (60), right end cut in the frame (top provisional 96)
      { key: "play_sing_unison",label: "Play and Sing Unison",       preset: "Flute Play & Sing KS",        channel: 14, ks: 37, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // C#1 — verify
      // A15 · Flute Quartertones Ordinario
      { key: "ord_1q",          label: "Ordinario quarter-tone",     preset: "Flute Quartertones Ordinario", channel: 15, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A15 screenshot: no red keys; white C3→C6 (60–96), grey elsewhere, no tan. Which quarter-tone each key sounds (above? below?) — 0c, by ear
      // A16 · Flute Sforzando
      { key: "sforzando",       label: "Sforzando",                  preset: "Flute Sforzando",             channel: 16, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // A16 screenshot: no red keys; white C3→C6 (60–96); grey elsewhere, no tan
      // ---- second instance "Fluteb" (A1–A3) ----
      { key: "staccato",        label: "Staccato",                   preset: "Flute Staccato",              port: "SWFluteb", channel: 1, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // Fluteb A1 screenshot: no red keys; white C3→C6 (60–96) native; tan below C3 and above C6 (stretched)
      { key: "trill_m2",        label: "Trill minor 2nd",            preset: "Flute Trills KS",             port: "SWFluteb", channel: 2, ks: 36, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // Fluteb A2 screenshot: red C1; C#1 not red; white C3→C6 (60–96); grey elsewhere, no tan
      { key: "trill_M2",        label: "Trill major 2nd",            preset: "Flute Trills KS",             port: "SWFluteb", channel: 2, ks: 37, rangeLow: 60, rangeHigh: 96, kind: "pitched", loud: "vel" },   // C#1 — verify
      { key: "whistle_tones",   label: "Whistle Tones",              preset: "Flute Whistle Tones",         port: "SWFluteb", channel: 3, rangeLow: 48, rangeHigh: 84, kind: "pitched", loud: "vel" },   // Fluteb A3 screenshot: no red keys; white C2→C5 (48–84) native; tan below C2 and above C5
    ],
  },

  // ---- CLARINET in B♭ — IRCAM Solo Instruments 2 (UVI), ONE instance, his thirteen loads of 2026-10-20 (RUNNING_LOG §17) ----
  // The order is his browser's (A1 … A13); the three Ordinario curve copies on parts 14 · 15 · 16 as text (§18). Keyswitch notes from the
  // manual's "Layers & Keyswitches — Clarinet" (C1 = 36, the flute's zone) — VERIFY on the red keys at the first sound. Range sounding
  // D3–F6 = 50–89 (the manual), NOT measured; the by-key voices' keys `pending` until read from his rack.
  clarinet: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2, label: "Clarinet", port: "SWClar", rangeLow: 50, rangeHigh: 89, channels: { main: 1, curve: [14, 15, 16] },
    techniques: [
      { key: "ord", label: "Ordinario", preset: "Clarinet Ordinario", channel: 1, kind: "pitched", loud: "vel" },
      { key: "aeolian_and_ord", label: "Aeolian & Ordinario", preset: "Clarinet Aeolian & Ordinario", channel: 2, kind: "pitched", loud: "vel" },
      { key: "cresc", label: "Crescendo", preset: "Clarinet Cresc & Decrescendo KS", channel: 3, kind: "pitched", loud: "vel", ks: 36 },
      { key: "cresc_decresc", label: "Crescendo to Decrescendo", preset: "Clarinet Cresc & Decrescendo KS", channel: 3, kind: "pitched", loud: "vel", ks: 37 },
      { key: "decresc", label: "Decrescendo", preset: "Clarinet Cresc & Decrescendo KS", channel: 3, kind: "pitched", loud: "vel", ks: 38 },
      { key: "dur_0_5s", label: "Duration 0.5 s", preset: "Clarinet Durations KS", channel: 4, kind: "pitched", loud: "vel", ks: 36 },
      { key: "dur_1s", label: "Duration 1 s", preset: "Clarinet Durations KS", channel: 4, kind: "pitched", loud: "vel", ks: 37 },
      { key: "flz", label: "Flatterzunge", preset: "Clarinet Flatterzunge", channel: 5, kind: "pitched", loud: "vel" },
      { key: "fortepiano", label: "Fortepiano", preset: "Clarinet Fortepiano", channel: 6, kind: "pitched", loud: "vel" },
      { key: "glissando_menu", label: "Glissando Menu (one glissando per key)", preset: "Clarinet Glissando Menu", channel: 7, kind: "key", keys: "pending", loud: "vel" },
      { key: "key_click", label: "Key Click", preset: "Clarinet Key Click", channel: 8, kind: "key", keys: "pending", loud: "vel" },
      { key: "multiphonics", label: "Multiphonics Menu (one multiphonic per key)", preset: "Clarinet Multiphonics Menu", channel: 9, kind: "key", keys: "pending", loud: "vel" },
      { key: "ord_1q", label: "Ordinario quarter-tone", preset: "Clarinet Quartertones Ordinario", channel: 10, kind: "pitched", loud: "vel" },
      { key: "sforzando", label: "Sforzando", preset: "Clarinet Sforzando", channel: 11, kind: "pitched", loud: "vel" },
      { key: "staccato", label: "Staccato", preset: "Clarinet Staccato", channel: 12, kind: "pitched", loud: "vel" },
      { key: "trill_m2", label: "Trill minor 2nd", preset: "Clarinet Trills KS", channel: 13, kind: "pitched", loud: "vel", ks: 36 },
      { key: "trill_M2", label: "Trill major 2nd", preset: "Clarinet Trills KS", channel: 13, kind: "pitched", loud: "vel", ks: 37 },
    ],
  },

  // ---- ALTO SAXOPHONE in E♭ — IRCAM Solo Instruments 2 (UVI), TWO instances, his twenty-two loads of 2026-10-20 (RUNNING_LOG §17) ----
  // A1 … A16 on the first instance (SWSax), B1 … B6 on the second (SWSaxb), the three Ordinario curve copies on the second's parts
  // 14 · 15 · 16 as text (§18 — the first cross-instance clone, proven by its 141 sample players). Keyswitch notes from the manual's
  // "Layers & Keyswitches — Saxophone Alto" (C1 = 36) — VERIFY at the first sound; "FX KS" is one preset of many switches (pending).
  // Range sounding D♭3–A5 = 49–81 (the manual), NOT measured.
  alto_sax: { ordinary: "ord", playerBendSt: 1, bendRangeSt: 2, label: "Alto Sax", port: "SWSax", rangeLow: 49, rangeHigh: 81, channels: { main: 1, curve: [{ port: "SWSaxb", ch: 14 }, { port: "SWSaxb", ch: 15 }, { port: "SWSaxb", ch: 16 }] },
    techniques: [
      { key: "ord", label: "Ordinario", preset: "Saxophone Alto Ordinario", channel: 1, kind: "pitched", loud: "vel" },
      { key: "aeolian", label: "Aeolian", preset: "Saxophone Alto Aeolian", channel: 2, kind: "pitched", loud: "vel" },
      { key: "backwards", label: "Backwards", preset: "Saxophone Alto Backwards", channel: 3, kind: "pitched", loud: "vel" },
      { key: "bisbigliando", label: "Bisbigliando", preset: "Saxophone Alto Bisbigliando", channel: 4, kind: "pitched", loud: "vel" },
      { key: "blow_without_reed", label: "Blow Without Reed", preset: "Saxophone Alto Blow Without Reed", channel: 5, kind: "key", keys: "pending", loud: "vel" },
      { key: "chrom_scale", label: "Chromatic Scale", preset: "Saxophone Alto Chromatic Scale", channel: 6, kind: "pitched", loud: "vel" },
      { key: "cresc", label: "Crescendo", preset: "Saxophone Alto Cresc & Decrescendo KS", channel: 7, kind: "pitched", loud: "vel", ks: 36 },
      { key: "cresc_decresc", label: "Crescendo to Decrescendo", preset: "Saxophone Alto Cresc & Decrescendo KS", channel: 7, kind: "pitched", loud: "vel", ks: 37 },
      { key: "decresc", label: "Decrescendo", preset: "Saxophone Alto Cresc & Decrescendo KS", channel: 7, kind: "pitched", loud: "vel", ks: 38 },
      { key: "double_tonguing", label: "Double Tonguing", preset: "Saxophone Alto Double Tonguing", channel: 8, kind: "pitched", loud: "vel" },
      { key: "fx_ks", label: "FX KS (the extended switches — which key is which: pending)", preset: "Saxophone Alto FX KS", channel: 9, kind: "key", keys: "pending", loud: "vel" },
      { key: "discolored_fing", label: "Discolored Fingering", preset: "Saxophone Alto Finger Modes KS", channel: 10, kind: "pitched", loud: "vel", ks: 36 },
      { key: "harmonic_fing", label: "Harmonic Fingering", preset: "Saxophone Alto Finger Modes KS", channel: 10, kind: "pitched", loud: "vel", ks: 37 },
      { key: "flz", label: "Flatterzunge", preset: "Saxophone Alto Flatterzunge", channel: 11, kind: "pitched", loud: "vel" },
      { key: "fortepiano", label: "Fortepiano", preset: "Saxophone Alto Fortepiano", channel: 12, kind: "pitched", loud: "vel" },
      { key: "glissando_menu", label: "Glissando Menu KS (one glissando per key)", preset: "Saxophone Alto Glissando Menu KS", channel: 13, kind: "key", keys: "pending", loud: "vel" },
      { key: "key_click", label: "Key Click", preset: "Saxophone Alto Key Click", channel: 14, kind: "key", keys: "pending", loud: "vel" },
      { key: "bell_down_up", label: "Moving Bell, down to up", preset: "Saxophone Alto Moving Bell", channel: 15, kind: "pitched", loud: "vel", ks: 36 },
      { key: "bell_left_right", label: "Moving Bell, left to right", preset: "Saxophone Alto Moving Bell", channel: 15, kind: "pitched", loud: "vel", ks: 37 },
      { key: "multiphonics", label: "Multiphonics Menu (one multiphonic per key)", preset: "Saxophone Alto Multiphonics Menu", channel: 16, kind: "key", keys: "pending", loud: "vel" },
      // ---- second instance "SWSaxb" (B1 … B6) ----
      { key: "ord_to_flz", label: "Ordinario to Flatterzunge", preset: "Saxophone Alto Ord & Flatterzunge KS", channel: 1, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 37 },
      { key: "flz_to_ord", label: "Flatterzunge to Ordinario", preset: "Saxophone Alto Ord & Flatterzunge KS", channel: 1, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 38 },
      { key: "play_sing_m2", label: "Play and Sing, major 2nd up", preset: "Saxophone Alto Play & Sing", channel: 2, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 36 },
      { key: "play_sing_gliss", label: "Play and Sing, glissando", preset: "Saxophone Alto Play & Sing", channel: 2, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 37 },
      { key: "play_sing_unison", label: "Play and Sing, unison", preset: "Saxophone Alto Play & Sing", channel: 2, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 38 },
      { key: "ord_1q", label: "Ordinario quarter-tone", preset: "Saxophone Alto Quartertones Ordinario", channel: 3, kind: "pitched", loud: "vel", port: "SWSaxb" },
      { key: "slap_pitched", label: "Slap, pitched", preset: "Saxophone Alto Slap Modes KS", channel: 4, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 36 },
      { key: "slap_unpitched", label: "Slap, unpitched", preset: "Saxophone Alto Slap Modes KS", channel: 4, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 37 },
      { key: "slap_exploding", label: "Exploding slap, pitched", preset: "Saxophone Alto Slap Modes KS", channel: 4, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 38 },
      { key: "staccato", label: "Staccato", preset: "Saxophone Alto Staccato", channel: 5, kind: "pitched", loud: "vel", port: "SWSaxb" },
      { key: "trill_m2", label: "Trill minor 2nd", preset: "Saxophone Alto Trills KS", channel: 6, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 36 },
      { key: "trill_M2", label: "Trill major 2nd", preset: "Saxophone Alto Trills KS", channel: 6, kind: "pitched", loud: "vel", port: "SWSaxb", ks: 37 },
    ],
  },

  // ---- PERCUSSION — ONE PLAYER, ONE LANE (P4) ----
  // Spitfire Abbey Road Orchestra Percussion (D6 — piece #2's library, its journal decision 4:
  // Metal 58 instruments · High 62 · Low 20, in Spitfire's own plugin, NOT Kontakt and NOT UVI —
  // a mechanism this stack has never driven; that is real work at 0c). ARO has no tuned mallets,
  // which is why he needs a bowed vibraphone (LG-9) and has still to acquire one.
  //
  // The instrument in hand is a TECHNIQUE on this lane, exactly as #5's D6 made the flute's
  // doubling a technique. THE INSTRUMENTS ARE NOT CHOSEN — he has named one (the bowed vibraphone,
  // LG-9) and it is the one library that is missing. Until they are, `main` is a placeholder voice
  // (the registry's own key, as #5's piano used it) so the lane can hold material and be laid out;
  // its range 21–108 is so `laneCanPlay` never routes material away from the percussionist, NOT a
  // claim about any instrument's compass.
  //
  // THE SCAFFOLDING (0c, 2026-09-17): the ARO instruments are CATALOGUED, never typed here —
  //   bank/aro_percussion_catalog.json  what the library offers: 78 instruments, the MIDI key →
  //                                     beater/articulation map of each All-in-One preset as piece #2
  //                                     measured it key by key (35 verified · 39 skeleton, no keys yet)
  //   bank/perc_selection.json          which of them THIS PIECE uses, on which channel — empty now
  //   tools/apply_perc.js               writes the selection into the ARO_PERC block below: one
  //                                     technique per instrument × beater, applied at load
  // Choosing an instrument = one line in the selection + one Reaper track filtering on its channel +
  // the tool + palette_check — and its technique keys registered (principle 3) before material uses them.
  percussion: {
    label: "Percussion", port: "SWPerc", rangeLow: 21, rangeHigh: 108,
    ordinary: "main", beating: false, playerBendSt: 0, bendRangeSt: 0,
    // curveTechniques: [] — NO percussion voice may use the curve channels (2026-10-04, RUNNING_LOG §35): on DECPerc channels 2 … 4 are
    // OTHER INSTRUMENTS (the shime daiko, the bass drum, the wood blocks), not curve copies. Without the gate a HELD note on this lane was
    // dealt to 2 · 3 · 4 in rotation — found by capturing the app's own playback of the first-sound score, before he heard it.
    channels: { main: 1, curve: [2, 3, 4], curveTechniques: [] },
    techniques: [
      // 1m.4.1: `main` is PITCHED on purpose — the placeholder takes any note it is dealt (his harmony takes carry 241 percussion
      // notes on it, RUNNING_LOG §212); a real instrument is chosen by NAME from the by-key voices below it.
      { key: "main", label: "struck, plain (the placeholder — ch 1, the rack's Bongos track)", channel: 1, kind: "pitched", loud: "vel" },
      // (Piece #6 kept a hand-typed claves voice here for the Texture panel's click; this rack has no claves. The click is the
      // wood blocks' — a generated voice, named in score/public/texture_panel.js — 2026-10-04, RUNNING_LOG §45.)
    ],
  },

  // ---- THE PITCHED PERCUSSION LANE — Spitfire Ricotti Mallets (Kontakt): crotales · glockenspiel · xylophone · marimba ----
  // His word, 2026-10-04 (COMPOSITION_NOTES DEC-5): "the pitch lane will hold all four mallet instruments" — ONE lane, the
  // SAME player as Percussion; two sounding at once is the notation's question, later (opposite stems "or something like that").
  // THE KEY IS STILL `bowed_vibraphone` — piece #6's, kept on purpose: the engine's tools know the pitched lane by that key
  // (the strike drawer, the texture panel, the rhythm sequencer's "a percussion dot become pitched", the beating tool), and a
  // rename is cosmetic (docs/NAMING.md § 1; NITS). What he sees is the LABEL, Mallets. Piece #6's vibraphone (Xsample Mallets
  // Extended) is not in this rack; its roster, its balance, its bend and its dynamics curve left with it.
  // THE ROSTER IS GENERATED, never typed: bank/ricotti_catalog.json → tools/apply_ricotti.js → the RICOTTI block below. One
  // technique per PATCH — 39 — each on its instrument's own PORT (DECCrotales · DECGlock · DECXylo · DECMarimba; a technique's
  // port overrides the lane's) and its own channel; the ranges are his (a screenshot each) with every edge proven by
  // tools/key_sweep.js. Struck: the velocity IS the dynamic. `curveTechniques: []` — NO patch may use the curve channels: on
  // these ports channels 2 … 4 are OTHER PATCHES, not copies (docs/DYNAMICS_LAW.md; composer.html's curve bank gates on it).
  // `ordinary` = crot_main_metal, THE AI'S CALL, his to change with one word. The rolls, the tremolos and the bowed patches
  // take their dynamic from CC1 in this library (its manual) — NOT wired: they sound at the wheel's resting value (NITS).
  bowed_vibraphone: {
    ordinary: "crot_main_metal", beating: false, playerBendSt: 0, bendRangeSt: 2,
    label: "Vibraphone", port: "SWCrotales", rangeLow: 36, rangeHigh: 96,
    channels: { main: 1, curve: [2, 3, 4], curveTechniques: [] },
    techniques: [{ key: "crot_main_metal", label: "Crotales · Main (Metal)", channel: 3, kind: "pitched", loud: "vel" }],   // replaced whole by applyRicotti()
  },

  // ---- PIANO — PLACEHOLDER (container 4; THE PIANO IS A ROLE — the profile's roles line) ----
  // One struck voice so the lane and the piano-role modules are real. Piece 4's recipe (8Dio Steinway + IRCAM Prepared Piano 2,
  // two ports Piano1 · Piano2) and piece 2's record (the harmonics piano, the plucked piano, the CC120 secco cutoff) are
  // container 4's sources. Struck: the velocity IS the dynamic; no breath, no bow, no bend — not a beating partner.
  piano: { ordinary: "main", beating: false, playerBendSt: 0, bendRangeSt: 0, label: "Piano", port: "SWPiano", rangeLow: 21, rangeHigh: 108, channels: { main: 1, curve: [2, 3, 4], curveTechniques: [] },
    techniques: [{ key: "main", label: "struck, plain (the placeholder)", channel: 1, kind: "pitched", loud: "vel" }] },

  // ---- VIOLIN — by the CELLO's mechanism, PROVISIONAL (container 4) ----
  // The roster is generated by the strings' helper, so the key set is the cello's (Xsample Contemporary Solo Strings: 88
  // presets, CC#0 = preset − 1; Sul G / D / A / E) — piece 4's violins were this library and this helper. NOTHING of the
  // cello's MEASUREMENTS is shared: no balanceDb, no measured ranges, no measured bend — a shared mechanism never shares a
  // measurement. Range 55–100 (G3–E7 sounding) is the instrument's compass, not re-measured. The preset numbers are VERIFY at 4.
  violin: { ordinary: "senza_vel", playerBendSt: 1, bendRangeSt: 1, label: "Violin", port: "SWViolin", rangeLow: 55, rangeHigh: 100, mechanism: "cc0", channels: { main: 1, curve: [2, 3, 4] }, techniques: xsStringTechs(["G", "D", "A", "E"], 55, 100) },

  // ---- CELLO — Xsample Contemporary Solo Strings (Kontakt), CC#0 selects the preset ----
  // PIECE #5'S ENTRY, CARRIED VERBATIM (D6) — the one recipe in this file that has been heard,
  // and its measured ranges and bend range come across with it (the tables below). Only the PORT
  // name changes, and only because loopMIDI ports are machine-global (see the header).
  // The full Xsample roster is 88 presets, identical across the instruments except the string
  // names; CC#0 = preset − 1. Channels per D11: 1 main · 2–4 curve A/B/C.
  cello: { balanceDb: -3.87, ordinary: "senza_vel", playerBendSt: 12, /* the PLAYER's reach, his (2026-10-08, RUNNING_LOG §263): a cellist slides along the string — a tritone for the beating section; the sampler's ±1 st is re-keyed by the GO */ bendRangeSt: 2, label: "Cello", port: "SWCello", rangeLow: 36, rangeHigh: 83, mechanism: "cc0", channels: { main: 1, curve: [2, 3, 4] }, techniques: xsStringTechs(["C", "G", "D", "A"], 36, 83) },
};

// The composer's practice (R8): the VELOCITY presets by default — the MW ones "sound different" and are
// chosen deliberately; under D11 that keeps most string material on the main channel.
// The one Xsample string roster, instantiated per instrument (fresh arrays, so per-instrument
// range exceptions at 0c never bleed across). `s` = the four open strings low→high; lo/hi = the
// instrument's standard zone. Hoisted function declaration, so the table above may use it.
// 1m.4.1 (2026-09-22): what an Xsample preset IS (`kind`) and where its loudness comes from (`loud`), read from the preset NAME —
// `Velocity` in the name = the velocity; a bare `MW` = the wheel; both = the velocity, shaped by the wheel (`shape: "mw"`). The
// by-key and the fixed voices are named per roster; everything else is pitched. Hoisted, like the rosters.
function xsLoud(label) { const v = /Velocity/.test(label), m = /\bMW\b/.test(label); return v ? (m ? { loud: "vel", shape: "mw" } : { loud: "vel" }) : (m ? { loud: "mw" } : { loud: "vel" }); }
function xsKind(key, fixed, byKey) { return byKey.has(key) ? { kind: "key", keys: "pending" } : fixed.has(key) ? { kind: "fixed" } : { kind: "pitched" }; }
function xsStringTechs(s, lo, hi, ranges) {
  const r = ranges || {};   // per-preset zone exceptions, registered as the composer uses them: { key: [lo, hi] }
  // 1m.4.1: the strings' FIXED voices — the open strings and the natural harmonics (the nearest string to the harmony note) — and
  // their BY-KEY voices — tailpiece · behind the bridge · peg box · finger · body · undefined — whose keys 1m.4.2 reads from his rack
  const FIXED = new Set(["arco_open_vel", "arco_open_mw", "marcato_stac_open_vel", "spicc_open_vel", "stac_open_vel", "trem_open_vel", "trem_open_mw",
    "nh_gliss_slow_vel", "nh_gliss_slow_mw", "nh_gliss_fast_vel", "nh_gliss_fast_mw", "nh_sul1_vel", "nh_sul1_mw", "nh_sul2_vel", "nh_sul2_mw", "nh_sul3_vel", "nh_sul3_mw", "nh_sul4_vel", "nh_sul4_mw",
    "sord_open_vel", "sord_open_mw", "sord_spicc_open_vel", "pizz_open_vel", "pizz_h_sul1_vel", "pizz_h_sul2_vel", "pizz_h_sul3_vel", "pizz_h_sul4_vel", "pizz_sp_open_vel"]);
  const KEY = new Set(["tailpiece_vel", "tailpiece_mw", "pizz_behind_bridge_vel", "pizz_peg_box_vel", "finger_vel", "body_vel", "undef_vel", "undef_mw"]);
  const P = (n, key, label, mw) => ({ key, label: label + " (#" + n + ")", channel: 1, cc0: n - 1, rangeLow: (r[key] || [lo, hi])[0], rangeHigh: (r[key] || [lo, hi])[1], ...(mw ? { mw: true } : {}), ...xsKind(key, FIXED, KEY), ...xsLoud(label) });
  return [
    P(1, "vib_vel_mwinv", "Vibrato Velocity + MW inverted", true),
    P(2, "vib_vel", "Vibrato Velocity"),
    P(3, "vib_mw", "Vibrato MW", true),
    P(4, "accent_vib_vel", "Accent Vibrato Velocity"),
    P(5, "senza_vel_mwinv", "Senza Vibrato Velocity + MW inverted", true),
    P(6, "senza_vel", "Senza Vibrato Velocity"),
    P(7, "arco_open_vel", "Arco Open Strings Velocity"),
    P(8, "senza_mw", "Senza Vibrato MW", true),
    P(9, "arco_open_mw", "Arco Open Strings MW", true),
    P(10, "accent_senza_vel", "Accent Senza Vibrato Velocity"),
    P(11, "light_accent_hi_vel", "Light Accent Velocity - high position"),
    P(12, "marcato_sfz_vel", "Marcato sfz Velocity"),
    P(13, "marcato_stac_vel", "Marcato Staccato Velocity"),
    P(14, "marcato_stac_open_vel", "Marcato Staccato Open Strings Velocity"),
    P(15, "marcato_spicc_vel", "Marcato + Spiccato Velocity"),
    P(16, "spicc_vel", "Spiccato Velocity"),
    P(17, "spicc_open_vel", "Spiccato Open Strings Velocity"),
    P(18, "spicc_vel_soft_x_bright_mw", "Spiccato Velocity - Soft X Bright MW", true),
    P(19, "stac_vel", "Staccato Velocity"),
    P(20, "stac_open_vel", "Staccato Open Strings Velocity"),
    P(21, "gettato_vel", "Gettato Velocity"),
    P(22, "trem_vel_mwinv", "Tremolo Velocity + MW inverted", true),
    P(23, "trem_vel", "Tremolo Velocity"),
    P(24, "trem_open_vel", "Tremolo Open Strings Velocity"),
    P(25, "trem_mw", "Tremolo MW", true),
    P(26, "trem_open_mw", "Tremolo Open Strings MW", true),
    P(27, "nh_gliss_slow_vel", "Natural Harmonics Glissando Slow Velocity"),
    P(28, "nh_gliss_slow_mw", "Natural Harmonics Glissando Slow MW", true),
    P(29, "nh_gliss_fast_vel", "Natural Harmonics Glissando Fast Velocity"),
    P(30, "nh_gliss_fast_mw", "Natural Harmonics Glissando Fast MW", true),
    P(31, "nh_sul1_vel", "Natural Harmonics Sul " + s[0] + " Velocity"),
    P(32, "nh_sul1_mw", "Natural Harmonics Sul " + s[0] + " MW", true),
    P(33, "nh_sul2_vel", "Natural Harmonics Sul " + s[1] + " Velocity"),
    P(34, "nh_sul2_mw", "Natural Harmonics Sul " + s[1] + " MW", true),
    P(35, "nh_sul3_vel", "Natural Harmonics Sul " + s[2] + " Velocity"),
    P(36, "nh_sul3_mw", "Natural Harmonics Sul " + s[2] + " MW", true),
    P(37, "nh_sul4_vel", "Natural Harmonics Sul " + s[3] + " Velocity"),
    P(38, "nh_sul4_mw", "Natural Harmonics Sul " + s[3] + " MW", true),
    P(39, "ah_vel", "Artificial Harmonics Velocity"),
    P(40, "ah_mw", "Artificial Harmonics MW", true),
    P(41, "ah_spicc_vel", "Artificial Harmonics Spiccato Velocity"),
    P(42, "ah_trem_mw", "Artificial Harmonics Tremolo MW", true),
    P(43, "flaut_vel", "Flautando Fragile Velocity"),
    P(44, "flaut_mw", "Flautando Fragile MW", true),
    P(45, "flaut_x_sp_mw_vel", "Flautando Fragile X Sul Ponticello MW - Velocity", true),
    P(46, "sp_vel", "Sul Ponticello Velocity"),
    P(47, "sp_mw", "Sul Ponticello MW", true),
    P(48, "sp_spicc_vel", "Sul Ponticello Spiccato Velocity"),
    P(49, "sp_trem_vel", "Sul Ponticello Tremolo Velocity"),
    P(50, "sp_trem_mw", "Sul Ponticello Tremolo MW", true),
    P(51, "sp_trem_x_sp_mw_vel", "Sul Ponticello Tremolo X Sul Ponticello MW - Velocity", true),
    P(52, "circ_bow_vel", "Circular Bowing Velocity"),
    P(53, "circ_bow_mw", "Circular Bowing MW", true),
    P(54, "bow_op_vel", "Bow Overpressure Velocity"),
    P(55, "bow_op_mw", "Bow Overpressure MW", true),
    P(56, "bow_op_x_marcato_sfz_mw_vel", "Bow Overpressure X Marcato sfz MW - Velocity", true),
    P(57, "bow_op_stac_vel", "Bow Overpressure Staccato Velocity"),
    P(58, "tailpiece_vel", "Tailpiece Bowed Velocity"),
    P(59, "tailpiece_mw", "Tailpiece Bowed MW", true),
    P(60, "sord_vib_vel_mwinv", "Sordino Vibrato Velocity + MW inverted", true),
    P(61, "sord_vib_vel", "Sordino Vibrato Velocity"),
    P(62, "sord_vib_mw", "Sordino Vibrato MW", true),
    P(63, "sord_senza_vel_mwinv", "Sordino Senza Vibrato Velocity + MW inverted", true),
    P(64, "sord_senza_vel", "Sordino Senza Vibrato Velocity"),
    P(65, "sord_open_vel", "Sordino Open Strings Velocity"),
    P(66, "sord_senza_mw", "Sordino Senza Vibrato MW", true),
    P(67, "sord_open_mw", "Sordino Open Strings MW", true),
    P(68, "sord_spicc_vel", "Sordino Spiccato Velocity"),
    P(69, "sord_spicc_open_vel", "Sordino Spiccato Open Strings Velocity"),
    P(70, "pizz_vel", "Pizzicato Velocity"),
    P(71, "pizz_vib_vel", "Pizzicato Vibrato Velocity"),
    P(72, "pizz_open_vel", "Pizzicato Open Strings Velocity"),
    P(73, "pizz_h_sul1_vel", "Pizzicato Harmonics Sul " + s[0] + " Velocity"),
    P(74, "pizz_h_sul2_vel", "Pizzicato Harmonics Sul " + s[1] + " Velocity"),
    P(75, "pizz_h_sul3_vel", "Pizzicato Harmonics Sul " + s[2] + " Velocity"),
    P(76, "pizz_h_sul4_vel", "Pizzicato Harmonics Sul " + s[3] + " Velocity"),
    P(77, "pizz_sp_vel", "Pizzicato Sul Ponticello Velocity"),
    P(78, "pizz_sp_open_vel", "Pizzicato Sul Ponticello Open Strings Velocity"),
    P(79, "pizz_x_sp_mw_vel", "Pizzicato X Sul Ponticello MW - Velocity", true),
    P(80, "bartok_vel", "Bartok Pizzicato Velocity"),
    P(81, "pizz_behind_bridge_vel", "Pizzicato Behind Bridge Velocity"),
    P(82, "pizz_peg_box_vel", "Pizzicato In Peg Box Velocity"),
    P(83, "col_legno_vel", "Col Legno Velocity"),
    P(84, "col_legno_gett_vel", "Col Legno Gettato Velocity"),
    P(85, "finger_vel", "Finger Velocity"),
    P(86, "body_vel", "Body Strokes Velocity"),
    P(87, "undef_vel", "Undefined Sounds Velocity"),
    P(88, "undef_mw", "Undefined Sounds MW", true),
  ];
}



// The Xsample English Horn roster — his Preset Menu, 2026-09-17 (RUNNING_LOG §32). Hoisted, like xsStringTechs.
// lo/hi = the assumed zone until 0d measures each preset. `mw` = the wheel shapes the dynamic (curve-channel material, D11).
function xsEnglishHornTechs(lo, hi) {
  // 1m.4.1: the by-key voices — multiphonics (2) · key noises · various noises · air noises (2) · undefined tones; their keys at 1m.4.2
  const KEY = new Set(["mp_short", "mp_loop", "key_noises", "various_noises", "air_noises", "air_noises_mw", "undef_tones"]);
  const P = (n, key, label, mw) => ({ key, label: label + " (#" + n + ")", channel: 1, cc0: n - 1, rangeLow: lo, rangeHigh: hi, ...(mw ? { mw: true } : {}), ...xsKind(key, new Set(), KEY), ...xsLoud(label) });
  return [
    P(1,  "vib_mw",               "Vibrato MW", true),
    P(2,  "senza_mw",             "Senza Vibrato MW", true),
    P(3,  "stac_vel_mwshape",     "Staccato Velocity 1 MW Shape", true),
    P(4,  "stac2_mwshape",        "Staccato Velocity 2 MW Shape", true),
    P(5,  "flutter_mw",           "Flutter Tongue MW", true),
    P(6,  "mp_short",             "Multiphonics Velocity"),
    P(7,  "crow_vel_mwshape",     "Crow On Reed Velocity MW Shape", true),   // NEW
    P(8,  "key_noises",           "Key Noises Velocity"),
    P(9,  "various_noises",       "Various Noises Velocity"),   // NEW
    P(10, "air_noises",           "Air Noises Velocity CC4"),   // CC4 = the air amount, per the menu name; measured at 0d
    P(11, "vib_vel",              "Vibrato Velocity"),
    P(12, "senza_vel",            "Senza Vibrato Velocity"),
    P(13, "flutter_vel",          "Flutter Tongue Velocity"),
    P(14, "vib_x_senza_vxmw",     "Vibrato - Senza Vibrato Velocity X MW", true),   // NEW
    P(15, "vib_senza_mw2d_cc2",   "Vibrato + Senza Vibrato MW 2 dimensional X CC2", true),   // NEW
    P(16, "triple16",             "Triple Tongue 16T"),
    P(17, "morph_vxmw",           "Senza Vibrato + Flutter Tongue Velocity X MW", true),
    P(18, "vib_flutter_vxmw",     "Vibrato + Flutter Tongue Velocity X MW", true),   // NEW
    P(19, "stac_vel",             "Staccato Velocity"),
    P(20, "accent_vel",           "With Accent Velocity"),
    P(21, "mp_loop",              "Multiphonics MW", true),
    P(22, "crow_vel",             "Crow On Reed Velocity"),   // NEW
    P(23, "air_noises_mw",        "Air Noises MW", true),
    P(24, "undef_tones",          "Undefined Tones Velocity"),
    P(25, "cresc_espr",           "Crescendo Espressivo"),   // NEW
    P(26, "cresc",                "Crescendo"),
    P(27, "portato",              "Portato Velocity"),
    P(28, "secco",                "Secco Velocity"),
    P(29, "vib_to_senza",         "Vibrato to Senza Vibrato Velocity"),   // NEW
    P(30, "senza_to_vib",         "Senza Vibrato to Vibrato Velocity"),   // NEW
    P(31, "vib_vel_mwinv",        "Vibrato Velocity + MW inverted", true),
    P(32, "senza_vel_mwinv",      "Senza Vibrato Velocity + MW inverted", true),
    P(33, "pseudo_bsn_vel_mwinv", "Pseudo Bassoon Velocity + MW inverted", true),   // NEW
    P(34, "pseudo_bsn_stac",      "Pseudo Bassoon Staccato Velocity"),   // NEW
    P(35, "pseudo_ob_vel_mwinv",  "Pseudo Oboe Velocity + MW inverted", true),   // NEW
    P(36, "pseudo_ob_stac",       "Pseudo Oboe Staccato Velocity"),   // NEW
    // 37–39 Free Preset — empty slots, not techniques
  ];
}

// The Xsample BASS FLUTE roster — his Preset Menu, 2026-10-04 (RUNNING_LOG §26): 32 factory presets, CC#0 = number − 1. The keys
// are the english horn's and the bass clarinet's wherever the preset is the same playing style, so the registry and the tools meet
// names they know. lo/hi = the assumed zone (measured on #15) until each preset is read. By-key voices: the jet whistles (with
// the slaps on one preset), the key noises, the multiphonics (2), the air noises (2) — their keys when the music asks (his word).
function xsBassFluteTechs(lo, hi) {
  const KEY = new Set(["jet_slap", "key_noises", "mp_short", "air_noises", "mp_loop", "air_noises_mw"]);
  const P = (n, key, label, mw) => ({ key, label: label + " (#" + n + ")", channel: 1, cc0: n - 1, rangeLow: lo, rangeHigh: hi, ...(mw ? { mw: true } : {}), ...xsKind(key, new Set(), KEY), ...xsLoud(label) });
  return [
    P(1,  "vib_mw",                  "Vibrato MW", true),
    P(2,  "molto_vib_mw",            "Molto Vibrato MW", true),
    P(3,  "stac_vel_mwshape",        "Staccato Velocity 1 MW Shape", true),
    P(4,  "stac2_mwshape",           "Staccato Velocity 2 MW Shape", true),
    P(5,  "flutter_mw",              "Flutter Tongue MW", true),
    P(6,  "jet_slap",                "Jet Whistle + Slap Tongue"),
    P(7,  "slap",                    "Slap Tongue Velocity"),
    P(8,  "airy_secco",              "Airy Secco Velocity"),
    P(9,  "key_noises",              "Key Noises Velocity"),
    P(10, "harmonics_vel",           "Harmonics Velocity"),
    P(11, "mp_short",                "Multiphonics Velocity"),
    P(12, "air_noises",              "Air Noises Velocity"),
    P(13, "voice_breath_oct",        "Voice Breathing octave"),
    P(14, "voice_breath_4th",        "Voice Breathing fourth"),
    P(15, "vib_vel",                 "Vibrato Velocity"),                       // THE ORDINARY VOICE (his choice, 2026-10-04) — the factory preset, round robin as shipped (he skipped round robin, RUNNING_LOG §39 · §43)
    P(16, "molto_vib_vel",           "Molto Vibrato Velocity"),
    P(17, "flutter_vel",             "Flutter Tongue Velocity"),
    P(18, "vib_vel_mwinv",           "Vibrato Velocity + MW inverted", true),
    P(19, "stac_keynoise_x_air_vmw", "Staccato + Key Noises X Air Velocity MW", true),
    P(20, "vib_flutter_vxmw",        "Vibrato + Flutter Tongue Velocity X MW", true),
    P(21, "triple16",                "Triple Tongue 16T"),
    P(22, "stac_vel",                "Staccato Velocity"),
    P(23, "mp_loop",                 "Multiphonics MW", true),
    P(24, "air_noises_mw",           "Air Noises MW", true),
    P(25, "voice_breath_mw",         "Voice Breathing MW", true),
    P(26, "accent_vel",              "With Accent Velocity"),
    P(27, "cresc",                   "Crescendo"),
    P(28, "portato",                 "Portato Velocity"),
    P(29, "vib_x_molto_vxmw",        "Vibrato - Molto Vibrato Velocity X MW", true),
    P(30, "flutter_vel_mwinv",       "Flutter Tongue Velocity + MW inverted", true),
    P(31, "pseudo_cb_vel_mwinv",     "Pseudo Contrabass Velocity + MW inverted", true),   // NOT in the manual's list of 30 — his menu has it
    P(32, "pseudo_cb_stac",          "Pseudo Contrabass Staccato Velocity"),              // the same
    // 33 … Free Preset — empty slots, not techniques. (For a few hours on 2026-10-04 the ordinary voice pointed at a preset 33 of his making;
    // the instrument card found it took its loudness from the mod wheel — RUNNING_LOG §42 — and the instrument was reset to factory, §43.)
  ];
}

// The Xsample BASS CLARINET roster — piece #5's, carried (its screenshots R5, 2026-09-03; piece #3's deep map): 33 factory presets
// + #34 Flutter LOCK. CC#0 = number − 1. The zones are per preset, as piece #5 read them from his Kontakt: standard 34–65; the
// flutter-tongue presets stop at 60; the glissandi 34–42; the multiphonics 34–46; #34 55–93. `kind` is new here (piece #5 predates
// it): the multiphonics, the noises, the undefined tones and the two glissando gestures go BY KEY; everything else is pitched.
function xsBassClarinetTechs() {
  const KEY = new Set(["gliss_undef", "undef_tones", "key_noises", "mp_short", "air_noises", "gliss_undef_mw", "mp_loop", "air_noises_mw"]);
  const P = (n, key, label, lo, hi, mw) => ({ key, label: label + " (#" + n + ")", channel: 1, cc0: n - 1, rangeLow: lo, rangeHigh: hi, ...(mw ? { mw: true } : {}), ...xsKind(key, new Set(), KEY), ...xsLoud(label) });
  return [
    P(1,  "senza_mw",            "Senza Vibrato MW", 34, 65, true),
    P(2,  "natural_vib_mw",      "Natural Vibrato MW", 34, 65, true),
    P(3,  "stac_vel_mwshape",    "Staccato Velocity MW Shape", 34, 65, true),
    P(4,  "stac2_mwshape",       "Staccato 2 MW Shape", 34, 65, true),
    P(5,  "flutter_mw",          "Flutter Tongue MW", 34, 60, true),
    P(6,  "slap",                "Slap Tongue Velocity", 34, 65),                 // channel 1 here (piece #5: channel 5, its strike lane)
    P(7,  "gliss_undef",         "Glissando Undefined MW Shape", 34, 42, true),
    P(8,  "undef_tones",         "Undefined Tones Velocity", 34, 65),
    P(9,  "key_noises",          "Key Noises Velocity", 34, 65),
    P(10, "mp_short",            "Multiphonics Velocity", 34, 46),                // 13 keys, cataloged in piece #3's map § 6c
    P(11, "air_noises",          "Air Noises Velocity", 34, 65),
    P(12, "cresc",               "Crescendo", 34, 65),
    P(13, "senza_vel",           "Senza Vibrato Velocity", 34, 65),               // THE ORDINARY VOICE (piece #5's)
    P(14, "natural_vib_vel",     "Natural Vibrato Velocity", 34, 65),
    P(15, "morph_vxmw",          "Senza Vibrato + Flutter Tongue Velocity X MW", 34, 60, true),
    P(16, "flutter_vel",         "Flutter Tongue Velocity", 34, 60),
    P(17, "senza_vel_mwinv",     "Senza Vibrato Velocity + MW inverted", 34, 65, true),
    P(18, "triple16",            "Triple Tongue 16T", 34, 65),
    P(19, "stac_vel",            "Staccato Velocity", 34, 65),
    P(20, "accent_vel",          "With Accent Velocity", 34, 65),
    P(21, "gliss_undef_mw",      "Glissando Undefined MW", 34, 42, true),
    P(22, "mp_loop",             "Multiphonics MW", 34, 46, true),
    P(23, "air_noises_mw",       "Air Noises MW", 34, 65, true),
    P(24, "vib_mw",              "Vibrato MW", 34, 65, true),
    P(25, "vib_vel",             "Vibrato Velocity", 34, 65),
    P(26, "vib_vel_mwinv",       "Vibrato Velocity + MW inverted", 34, 65, true),
    P(27, "secco",               "Secco Velocity", 34, 65),
    P(28, "portato",             "Portato Velocity", 34, 65),
    P(29, "flutter_vel_mwinv",   "Flutter Tongue Velocity + MW inverted", 34, 60, true),
    P(30, "pseudo_cb_vel_mwinv", "Pseudo Contrabass Velocity + MW inverted", 34, 65, true),   // zone NOT read (piece #5: VERIFY)
    P(31, "pseudo_cb_stac",      "Pseudo Contrabass Staccato Velocity", 34, 65),              // zone NOT read
    P(32, "pseudo_cl_vel_mwinv", "Pseudo Clarinet Velocity + MW inverted", 34, 65, true),     // zone NOT read
    P(33, "pseudo_cl_stac",      "Pseudo Clarinet Staccato Velocity", 34, 65),                // zone NOT read
    P(34, "flutter_lock",        "Flutter LOCK — his bespoke preset from piece #3", 55, 93),
  ];
}


// ---- UVI PARTS (generated by tools/apply_uvi_parts.js from the running rack — do not edit by hand) ----
const UVI_PARTS = {   // read from the running rack 2026-10-21 02:21 — flute: 30 techniques on 22 parts, 3 curve copies · clarinet: 17 techniques on 16 parts, 3 curve copies · alto_sax: 32 techniques on 25 parts, 3 curve copies
  flute: {
    techniques: { aeolian_and_ord: {"port":"SWFlute","channel":1}, aeolian: {"port":"SWFlute","channel":1}, chrom_scale: {"port":"SWFlute","channel":2}, cresc: {"port":"SWFlute","channel":3}, cresc_decresc: {"port":"SWFlute","channel":3}, decresc: {"port":"SWFlute","channel":3}, dur_0_5s: {"port":"SWFlute","channel":4}, dur_1s: {"port":"SWFlute","channel":4}, jet_whistle: {"port":"SWFlute","channel":5}, key_click: {"port":"SWFlute","channel":5}, tongue_ram: {"port":"SWFlute","channel":5}, harmonic_fing: {"port":"SWFlute","channel":6}, discolored_fing: {"port":"SWFlute","channel":6}, flz: {"port":"SWFlute","channel":7}, fortepiano: {"port":"SWFlute","channel":8}, multiphonics: {"port":"SWFlute","channel":9}, ord_to_aeolian: {"port":"SWFlute","channel":10}, aeolian_to_ord: {"port":"SWFlute","channel":10}, ord_to_flz: {"port":"SWFlute","channel":11}, flz_to_ord: {"port":"SWFlute","channel":11}, ord: {"port":"SWFlute","channel":12}, pizzicato: {"port":"SWFlute","channel":13}, play_sing: {"port":"SWFlute","channel":14}, play_sing_unison: {"port":"SWFlute","channel":14}, ord_1q: {"port":"SWFlute","channel":15}, sforzando: {"port":"SWFlute","channel":16}, staccato: {"port":"SWFluteb","channel":1}, trill_m2: {"port":"SWFluteb","channel":2}, trill_M2: {"port":"SWFluteb","channel":2}, whistle_tones: {"port":"SWFluteb","channel":3} },
    main: {"port":"SWFlute","channel":12}, curve: [{"port":"SWFluteb","ch":4},{"port":"SWFluteb","ch":5},{"port":"SWFluteb","ch":6}], curveTechniques: ["ord"],
    parts: [{"track":"Flute SI2","part":"Part 1","ch":1,"program":"Flute Aeolian KS"},
            {"track":"Flute SI2","part":"Part 2","ch":2,"program":"Flute Chromatic Scale"},
            {"track":"Flute SI2","part":"Part 3","ch":3,"program":"Flute Cresc & Decrescendo KS"},
            {"track":"Flute SI2","part":"Part 4","ch":4,"program":"Flute Durations KS"},
            {"track":"Flute SI2","part":"Part 5","ch":5,"program":"Flute FX KS"},
            {"track":"Flute SI2","part":"Part 6","ch":6,"program":"Flute Finger Modes KS"},
            {"track":"Flute SI2","part":"Part 7","ch":7,"program":"Flute Flatterzunge"},
            {"track":"Flute SI2","part":"Part 8","ch":8,"program":"Flute Fortepiano"},
            {"track":"Flute SI2","part":"Part 9","ch":9,"program":"Flute Multiphonics Menu"},
            {"track":"Flute SI2","part":"Part 10","ch":10,"program":"Flute Ord & Aeolian KS"},
            {"track":"Flute SI2","part":"Part 11","ch":11,"program":"Flute Ord & Flatterzunge KS"},
            {"track":"Flute SI2","part":"Part 12","ch":12,"program":"Flute Ordinario"},
            {"track":"Flute SI2","part":"Part 13","ch":13,"program":"Flute Pizzicato"},
            {"track":"Flute SI2","part":"Part 14","ch":14,"program":"Flute Play & Sing KS"},
            {"track":"Flute SI2","part":"Part 15","ch":15,"program":"Flute Quartertones Ordinario"},
            {"track":"Flute SI2","part":"Part 16","ch":16,"program":"Flute Sforzando"},
            {"track":"Fluteb SI2","part":"Part 1","ch":1,"program":"Flute Staccato"},
            {"track":"Fluteb SI2","part":"Part 2","ch":2,"program":"Flute Trills KS"},
            {"track":"Fluteb SI2","part":"Part 3","ch":3,"program":"Flute Whistle Tones"},
            {"track":"Fluteb SI2","part":"Part 4","ch":4,"program":"Flute Ordinario"},
            {"track":"Fluteb SI2","part":"Part 5","ch":5,"program":"Flute Ordinario"},
            {"track":"Fluteb SI2","part":"Part 6","ch":6,"program":"Flute Ordinario"}],
  },
  clarinet: {
    techniques: { ord: {"port":"SWClar","channel":1}, aeolian_and_ord: {"port":"SWClar","channel":2}, cresc: {"port":"SWClar","channel":3}, cresc_decresc: {"port":"SWClar","channel":3}, decresc: {"port":"SWClar","channel":3}, dur_0_5s: {"port":"SWClar","channel":4}, dur_1s: {"port":"SWClar","channel":4}, flz: {"port":"SWClar","channel":5}, fortepiano: {"port":"SWClar","channel":6}, glissando_menu: {"port":"SWClar","channel":7}, key_click: {"port":"SWClar","channel":8}, multiphonics: {"port":"SWClar","channel":9}, ord_1q: {"port":"SWClar","channel":10}, sforzando: {"port":"SWClar","channel":11}, staccato: {"port":"SWClar","channel":12}, trill_m2: {"port":"SWClar","channel":13}, trill_M2: {"port":"SWClar","channel":13} },
    main: {"port":"SWClar","channel":1}, curve: [{"port":"SWClar","ch":14},{"port":"SWClar","ch":15},{"port":"SWClar","ch":16}], curveTechniques: ["ord"],
    parts: [{"track":"Clarinet SI2","part":"Part 1","ch":1,"program":"Clarinet Ordinario"},
            {"track":"Clarinet SI2","part":"Part 2","ch":2,"program":"Clarinet Aeolian & Ordinario"},
            {"track":"Clarinet SI2","part":"Part 3","ch":3,"program":"Clarinet Cresc & Decrescendo KS"},
            {"track":"Clarinet SI2","part":"Part 4","ch":4,"program":"Clarinet Durations KS"},
            {"track":"Clarinet SI2","part":"Part 5","ch":5,"program":"Clarinet Flatterzunge"},
            {"track":"Clarinet SI2","part":"Part 6","ch":6,"program":"Clarinet Fortepiano"},
            {"track":"Clarinet SI2","part":"Part 7","ch":7,"program":"Clarinet Glissando Menu"},
            {"track":"Clarinet SI2","part":"Part 8","ch":8,"program":"Clarinet Key Click"},
            {"track":"Clarinet SI2","part":"Part 9","ch":9,"program":"Clarinet Multiphonics Menu"},
            {"track":"Clarinet SI2","part":"Part 10","ch":10,"program":"Clarinet Quartertones Ordinario"},
            {"track":"Clarinet SI2","part":"Part 11","ch":11,"program":"Clarinet Sforzando"},
            {"track":"Clarinet SI2","part":"Part 12","ch":12,"program":"Clarinet Staccato"},
            {"track":"Clarinet SI2","part":"Part 13","ch":13,"program":"Clarinet Trills KS"},
            {"track":"Clarinet SI2","part":"Part 14","ch":14,"program":"Clarinet Ordinario"},
            {"track":"Clarinet SI2","part":"Part 15","ch":15,"program":"Clarinet Ordinario"},
            {"track":"Clarinet SI2","part":"Part 16","ch":16,"program":"Clarinet Ordinario"}],
  },
  alto_sax: {
    techniques: { ord: {"port":"SWSax","channel":1}, aeolian: {"port":"SWSax","channel":2}, backwards: {"port":"SWSax","channel":3}, bisbigliando: {"port":"SWSax","channel":4}, blow_without_reed: {"port":"SWSax","channel":5}, chrom_scale: {"port":"SWSax","channel":6}, cresc: {"port":"SWSax","channel":7}, cresc_decresc: {"port":"SWSax","channel":7}, decresc: {"port":"SWSax","channel":7}, double_tonguing: {"port":"SWSax","channel":8}, fx_ks: {"port":"SWSax","channel":9}, discolored_fing: {"port":"SWSax","channel":10}, harmonic_fing: {"port":"SWSax","channel":10}, flz: {"port":"SWSax","channel":11}, fortepiano: {"port":"SWSax","channel":12}, glissando_menu: {"port":"SWSax","channel":13}, key_click: {"port":"SWSax","channel":14}, bell_down_up: {"port":"SWSax","channel":15}, bell_left_right: {"port":"SWSax","channel":15}, multiphonics: {"port":"SWSax","channel":16}, ord_to_flz: {"port":"SWSaxb","channel":1}, flz_to_ord: {"port":"SWSaxb","channel":1}, play_sing_m2: {"port":"SWSaxb","channel":2}, play_sing_gliss: {"port":"SWSaxb","channel":2}, play_sing_unison: {"port":"SWSaxb","channel":2}, ord_1q: {"port":"SWSaxb","channel":3}, slap_pitched: {"port":"SWSaxb","channel":4}, slap_unpitched: {"port":"SWSaxb","channel":4}, slap_exploding: {"port":"SWSaxb","channel":4}, staccato: {"port":"SWSaxb","channel":5}, trill_m2: {"port":"SWSaxb","channel":6}, trill_M2: {"port":"SWSaxb","channel":6} },
    main: {"port":"SWSax","channel":1}, curve: [{"port":"SWSaxb","ch":14},{"port":"SWSaxb","ch":15},{"port":"SWSaxb","ch":16}], curveTechniques: ["ord"],
    parts: [{"track":"Alto Sax SI2","part":"Part 1","ch":1,"program":"Saxophone Alto Ordinario"},
            {"track":"Alto Sax SI2","part":"Part 2","ch":2,"program":"Saxophone Alto Aeolian"},
            {"track":"Alto Sax SI2","part":"Part 3","ch":3,"program":"Saxophone Alto Backwards"},
            {"track":"Alto Sax SI2","part":"Part 4","ch":4,"program":"Saxophone Alto Bisbigliando"},
            {"track":"Alto Sax SI2","part":"Part 5","ch":5,"program":"Saxophone Alto Blow Without Reed"},
            {"track":"Alto Sax SI2","part":"Part 6","ch":6,"program":"Saxophone Alto Chromatic Scale"},
            {"track":"Alto Sax SI2","part":"Part 7","ch":7,"program":"Saxophone Alto Cresc & Decrescendo KS"},
            {"track":"Alto Sax SI2","part":"Part 8","ch":8,"program":"Saxophone Alto Double Tonguing"},
            {"track":"Alto Sax SI2","part":"Part 9","ch":9,"program":"Saxophone Alto FX KS"},
            {"track":"Alto Sax SI2","part":"Part 10","ch":10,"program":"Saxophone Alto Finger Modes KS"},
            {"track":"Alto Sax SI2","part":"Part 11","ch":11,"program":"Saxophone Alto Flatterzunge"},
            {"track":"Alto Sax SI2","part":"Part 12","ch":12,"program":"Saxophone Alto Fortepiano"},
            {"track":"Alto Sax SI2","part":"Part 13","ch":13,"program":"Saxophone Alto Glissando Menu KS"},
            {"track":"Alto Sax SI2","part":"Part 14","ch":14,"program":"Saxophone Alto Key Click"},
            {"track":"Alto Sax SI2","part":"Part 15","ch":15,"program":"Saxophone Alto Moving Bell"},
            {"track":"Alto Sax SI2","part":"Part 16","ch":16,"program":"Saxophone Alto Multiphonics Menu"},
            {"track":"Alto Sax SI2 b","part":"Part 1","ch":1,"program":"Saxophone Alto Ord & Flatterzunge KS"},
            {"track":"Alto Sax SI2 b","part":"Part 2","ch":2,"program":"Saxophone Alto Play & Sing"},
            {"track":"Alto Sax SI2 b","part":"Part 3","ch":3,"program":"Saxophone Alto Quartertones Ordinario"},
            {"track":"Alto Sax SI2 b","part":"Part 4","ch":4,"program":"Saxophone Alto Slap Modes KS"},
            {"track":"Alto Sax SI2 b","part":"Part 5","ch":5,"program":"Saxophone Alto Staccato"},
            {"track":"Alto Sax SI2 b","part":"Part 6","ch":6,"program":"Saxophone Alto Trills KS"},
            {"track":"Alto Sax SI2 b","part":"Part 14","ch":14,"program":"Saxophone Alto Ordinario"},
            {"track":"Alto Sax SI2 b","part":"Part 15","ch":15,"program":"Saxophone Alto Ordinario"},
            {"track":"Alto Sax SI2 b","part":"Part 16","ch":16,"program":"Saxophone Alto Ordinario"}],
  },
};
function applyUviParts(all, gen) {   // the rack decides the channel and the port of every SI2 technique; the recipe keeps the preset and the keyswitch
  for (const [inst, g] of Object.entries(gen || {})) {
    const R = all[inst]; if (!R || !R.techniques) continue;
    for (const q of R.techniques) { const v = g.techniques[q.key]; if (!v) { if (q.channel == null && g.main) q.channel = g.main.channel; continue; } q.channel = v.channel; if (v.port !== R.port) q.port = v.port; else delete q.port; q.placed = true; }
    if (g.main) R.channels = { main: g.main.channel, mainPort: g.main.port !== R.port ? g.main.port : undefined, curve: g.curve.map(c => ({ port: c.port, ch: c.ch })), curveTechniques: g.curveTechniques.slice() };
    R.uviParts = g.parts.slice();
  }
}
applyUviParts(INSTRUMENTS, UVI_PARTS);
// ---- end of the UVI parts ----

// ---- ARO PERCUSSION (generated by tools/apply_perc.js from bank/perc_selection.json — do not edit by hand) ----
const ARO_PERC = {   // 8 instrument(s) selected 2026-10-04: bongos ch1 · shime_daiko ch2 · bass_drum_alt ch3 · wood_blocks ch4 · china_cymbals ch5 · small_metals_spring_coil ch6 · susp_cymbals_bright ch7 · toms_high ch8
  port: "SWPerc",
  instruments: [
    { slug: "bongos", name: "Bongos", library: "ARO High Percussion", status: "verified", port: "SWPerc", channel: 1, techniques: [
      { key: "bongos_hands", label: "Bongos — Hands", channel: 1, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 52,
        keys: [{"midi":36,"label":"Low · Low Hand Hit L"},{"midi":38,"label":"Low · Low Hand Hit R"},{"midi":40,"label":"Low · Low Hand Roll"},{"midi":48,"label":"High · High Hand Hit L"},{"midi":49,"label":"High · High Hand Hit Closed L"},{"midi":50,"label":"High · High Hand Hit R"},{"midi":51,"label":"High · High Hand Hit Closed R"},{"midi":52,"label":"High · High Hand Roll"}] },
      { key: "bongos_fingers", label: "Bongos — Fingers", channel: 1, kind: "key", loud: "vel", rangeLow: 41, rangeHigh: 57,
        keys: [{"midi":41,"label":"Low · Low Finger Hit L"},{"midi":43,"label":"Low · Low Finger Hit R"},{"midi":45,"label":"Low · Low Finger Roll"},{"midi":53,"label":"High · High Finger Hit L"},{"midi":54,"label":"High · High Finger Hit Closed L"},{"midi":55,"label":"High · High Finger Hit R"},{"midi":56,"label":"High · High Finger Hit Closed R"},{"midi":57,"label":"High · High Finger Roll"}] },
      { key: "bongos_sticks", label: "Bongos — Sticks", channel: 1, kind: "key", loud: "vel", rangeLow: 60, rangeHigh: 79,
        keys: [{"midi":60,"label":"Low · Low Stick Hit L"},{"midi":62,"label":"Low · Low Stick Hit R"},{"midi":64,"label":"Low · Low Stick Roll"},{"midi":65,"label":"Low · Low Rim Shot L"},{"midi":67,"label":"Low · Low Rim Shot R"},{"midi":72,"label":"High · High Stick Hit L"},{"midi":74,"label":"High · High Stick Hit R"},{"midi":76,"label":"High · High Stick Roll"},{"midi":77,"label":"High · High Rim Shot L"},{"midi":79,"label":"High · High Rim Shot R"}] },
    ] },
    { slug: "shime_daiko", name: "Shime Daiko", library: "ARO High Percussion", status: "verified", port: "SWPerc", channel: 2, techniques: [
      { key: "shime_daiko_hands", label: "Shime Daiko — Hands", channel: 2, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 38,
        keys: [{"midi":36,"label":"Hit L"},{"midi":38,"label":"Hit R"}] },
      { key: "shime_daiko_taiko_sticks", label: "Shime Daiko — Taiko Sticks", channel: 2, kind: "key", loud: "vel", rangeLow: 41, rangeHigh: 45,
        keys: [{"midi":41,"label":"Hit L"},{"midi":43,"label":"Hit R"},{"midi":45,"label":"Roll"}] },
      { key: "shime_daiko_rods", label: "Shime Daiko — Rods", channel: 2, kind: "key", loud: "vel", rangeLow: 48, rangeHigh: 57,
        keys: [{"midi":48,"label":"Hit L"},{"midi":50,"label":"Hit R"},{"midi":52,"label":"Roll"},{"midi":53,"label":"Rim Hit L"},{"midi":55,"label":"Rim Hit R"},{"midi":57,"label":"Rim Roll"}] },
    ] },
    { slug: "bass_drum_alt", name: "Bass Drum (Alt)", library: "ARO Low Percussion", status: "verified", port: "SWPerc", channel: 3, techniques: [
      { key: "bass_drum_alt_sticks", label: "Bass Drum (Alt) — Sticks", channel: 3, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 45,
        keys: [{"midi":36,"label":"Single Hit L"},{"midi":37,"label":"Hand Damped Hit L"},{"midi":38,"label":"Single Hit R"},{"midi":39,"label":"Hand Damped Hit R"},{"midi":40,"label":"Roll"},{"midi":41,"label":"Rim Hit L"},{"midi":43,"label":"Rim Hit R"},{"midi":45,"label":"Rim Roll"}] },
      { key: "bass_drum_alt_hard_felt", label: "Bass Drum (Alt) — Hard Felt", channel: 3, kind: "key", loud: "vel", rangeLow: 48, rangeHigh: 52,
        keys: [{"midi":48,"label":"Single Hit L"},{"midi":50,"label":"Single Hit R"},{"midi":52,"label":"Roll"}] },
      { key: "bass_drum_alt_hard_felt_cloth_damped", label: "Bass Drum (Alt) — Hard Felt (Cloth Damped)", channel: 3, kind: "key", loud: "vel", rangeLow: 53, rangeHigh: 57,
        keys: [{"midi":53,"label":"Single Hit L"},{"midi":55,"label":"Single Hit R"},{"midi":57,"label":"Roll"}] },
      { key: "bass_drum_alt_medium_felt", label: "Bass Drum (Alt) — Medium Felt", channel: 3, kind: "key", loud: "vel", rangeLow: 60, rangeHigh: 64,
        keys: [{"midi":60,"label":"Single Hit L"},{"midi":61,"label":"Hand Damped Hit L"},{"midi":62,"label":"Single Hit R"},{"midi":63,"label":"Hand Damped Hit R"},{"midi":64,"label":"Roll"}] },
      { key: "bass_drum_alt_rods", label: "Bass Drum (Alt) — Rods", channel: 3, kind: "key", loud: "vel", rangeLow: 65, rangeHigh: 70,
        keys: [{"midi":65,"label":"Single Hit L"},{"midi":66,"label":"Rim Hit L"},{"midi":67,"label":"Single Hit R"},{"midi":68,"label":"Rim Hit R"},{"midi":69,"label":"Roll"},{"midi":70,"label":"Rim Roll"}] },
      { key: "bass_drum_alt_brushes", label: "Bass Drum (Alt) — Brushes", channel: 3, kind: "key", loud: "vel", rangeLow: 72, rangeHigh: 88,
        keys: [{"midi":72,"label":"Center Hit Open L"},{"midi":73,"label":"Center Hit Closed L"},{"midi":74,"label":"Center Hit Open R"},{"midi":75,"label":"Center Hit Closed R"},{"midi":76,"label":"Roll"},{"midi":77,"label":"Edge Hit Open L"},{"midi":78,"label":"Edge Hit Closed L"},{"midi":79,"label":"Edge Hit Open R"},{"midi":80,"label":"Edge Hit Closed R"},{"midi":84,"label":"Short Sweep L"},{"midi":85,"label":"Long Sweep L"},{"midi":86,"label":"Short Sweep R"},{"midi":87,"label":"Long Sweep R"},{"midi":88,"label":"Swirling"}] },
    ] },
    { slug: "wood_blocks", name: "Wood Blocks", library: "ARO High Percussion", status: "verified", port: "SWPerc", channel: 4, techniques: [
      { key: "wood_blocks_hard_mallets", label: "Wood Blocks — Hard Mallets", channel: 4, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 44,
        keys: [{"midi":36,"label":"Block 4 · Hit L"},{"midi":37,"label":"Block 3 · Hit L"},{"midi":38,"label":"Block 4 · Hit R"},{"midi":39,"label":"Block 3 · Hit R"},{"midi":41,"label":"Block 2 · Hit L"},{"midi":42,"label":"Block 1 · Hit L"},{"midi":43,"label":"Block 2 · Hit R"},{"midi":44,"label":"Block 1 · Hit R"}] },
      { key: "wood_blocks_soft_mallets", label: "Wood Blocks — Soft Mallets", channel: 4, kind: "key", loud: "vel", rangeLow: 48, rangeHigh: 56,
        keys: [{"midi":48,"label":"Block 4 · Hit L"},{"midi":49,"label":"Block 3 · Hit L"},{"midi":50,"label":"Block 4 · Hit R"},{"midi":51,"label":"Block 3 · Hit R"},{"midi":53,"label":"Block 2 · Hit L"},{"midi":54,"label":"Block 1 · Hit L"},{"midi":55,"label":"Block 2 · Hit R"},{"midi":56,"label":"Block 1 · Hit R"}] },
    ] },
    { slug: "china_cymbals", name: "China Cymbals", library: "ARO Metal Percussion", status: "verified", port: "SWPerc", channel: 5, techniques: [
      { key: "china_cymbals_felt_mallet", label: "China Cymbals — Felt Mallet", channel: 5, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 44,
        keys: [{"midi":36,"label":"Single Hit"},{"midi":37,"label":"Single Hit Choked"},{"midi":38,"label":"Single Hit"},{"midi":39,"label":"Single Hit Choked"},{"midi":41,"label":"Roll"},{"midi":42,"label":"Swells"},{"midi":43,"label":"Roll Choked"},{"midi":44,"label":"Swells Choked"}] },
      { key: "china_cymbals_bow", label: "China Cymbals — Bow", channel: 5, kind: "key", loud: "vel", rangeLow: 48, rangeHigh: 57,
        keys: [{"midi":48,"label":"Half Bow 1"},{"midi":49,"label":"Half Bow 2"},{"midi":50,"label":"Half Bow 3"},{"midi":51,"label":"Half Bow 4"},{"midi":53,"label":"Full Bow 1"},{"midi":54,"label":"Full Bow 2"},{"midi":55,"label":"Full Bow 3"},{"midi":56,"label":"Full Bow 4"},{"midi":57,"label":"Long Continuous Bowing"}] },
      { key: "china_cymbals_scrape", label: "China Cymbals — Scrape", channel: 5, kind: "key", loud: "vel", rangeLow: 60, rangeHigh: 68,
        keys: [{"midi":60,"label":"Fast Scrape 1"},{"midi":61,"label":"Fast Scrape 2"},{"midi":62,"label":"Fast Scrape 3"},{"midi":63,"label":"Fast Scrape 4"},{"midi":65,"label":"Medium Scrape 1"},{"midi":66,"label":"Medium Scrape 2"},{"midi":67,"label":"Medium Scrape 3"},{"midi":68,"label":"Medium Scrape 4"}] },
      { key: "china_cymbals_stick", label: "China Cymbals — Stick", channel: 5, kind: "key", loud: "vel", rangeLow: 72, rangeHigh: 75,
        keys: [{"midi":72,"label":"Single Hit L"},{"midi":73,"label":"Single Hit Choked"},{"midi":74,"label":"Single Hit"},{"midi":75,"label":"Single Hit Choked"}] },
    ] },
    { slug: "small_metals_spring_coil", name: "Spring Coil", library: "ARO Metal Percussion", status: "verified", port: "SWPerc", channel: 6, techniques: [
      { key: "small_metals_spring_coil", label: "Spring Coil", channel: 6, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 68,
        keys: [{"midi":36,"label":"Open Hit L"},{"midi":37,"label":"Muted Hit L"},{"midi":38,"label":"Open Hit R"},{"midi":39,"label":"Muted Hit R"},{"midi":41,"label":"Open Rake Fast"},{"midi":42,"label":"Muted Rake Fast"},{"midi":43,"label":"Open Rake Slow"},{"midi":44,"label":"Muted Rake Slow"},{"midi":60,"label":"Open Hit L"},{"midi":61,"label":"Muted Hit L"},{"midi":62,"label":"Open Hit R"},{"midi":63,"label":"Muted Hit R"},{"midi":65,"label":"Open Rake Fast"},{"midi":66,"label":"Muted Rake Fast"},{"midi":67,"label":"Open Rake Slow"},{"midi":68,"label":"Muted Rake Slow"}] },
    ] },
    { slug: "susp_cymbals_bright", name: "Suspended Cymbals Bright", library: "ARO Metal Percussion", status: "verified", port: "SWPerc", channel: 7, techniques: [
      { key: "susp_cymbals_bright_felt_mallet", label: "Suspended Cymbals Bright — Felt Mallet", channel: 7, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 44,
        keys: [{"midi":36,"label":"16\" Bright Single Hit"},{"midi":37,"label":"16\" Bright Single Hit Choked"},{"midi":38,"label":"16\" Bright Single Hit"},{"midi":39,"label":"16\" Bright Single Hit Choked"},{"midi":41,"label":"16\" Bright Roll"},{"midi":42,"label":"16\" Bright Swells"},{"midi":43,"label":"16\" Bright Roll Choked"},{"midi":44,"label":"16\" Bright Swells Choked"}] },
      { key: "susp_cymbals_bright_brush", label: "Suspended Cymbals Bright — Brush", channel: 7, kind: "key", loud: "vel", rangeLow: 48, rangeHigh: 56,
        keys: [{"midi":48,"label":"16\" Bright Single Hit"},{"midi":49,"label":"16\" Bright Single Hit Choked"},{"midi":50,"label":"16\" Bright Single Hit"},{"midi":51,"label":"16\" Bright Single Hit Choked"},{"midi":53,"label":"16\" Bright Roll"},{"midi":54,"label":"16\" Bright Swells"},{"midi":55,"label":"16\" Bright Roll Choked"},{"midi":56,"label":"16\" Bright Swells Choked"}] },
      { key: "susp_cymbals_bright_stick", label: "Suspended Cymbals Bright — Stick", channel: 7, kind: "key", loud: "vel", rangeLow: 60, rangeHigh: 63,
        keys: [{"midi":60,"label":"16\" Bright Single Hit"},{"midi":61,"label":"16\" Bright Single Hit Choked"},{"midi":62,"label":"16\" Bright Single Hit"},{"midi":63,"label":"16\" Bright Single Hit Choked"}] },
      { key: "susp_cymbals_bright_scrape", label: "Suspended Cymbals Bright — Scrape", channel: 7, kind: "key", loud: "vel", rangeLow: 72, rangeHigh: 80,
        keys: [{"midi":72,"label":"16\" Bright Fast Scrape 1"},{"midi":73,"label":"16\" Bright Fast Scrape 2"},{"midi":74,"label":"16\" Bright Fast Scrape 3"},{"midi":75,"label":"16\" Bright Fast Scrape 4"},{"midi":77,"label":"16\" Bright Medium Scrape 1"},{"midi":78,"label":"16\" Bright Medium Scrape 2"},{"midi":79,"label":"16\" Bright Medium Scrape 3"},{"midi":80,"label":"16\" Bright Medium Scrape 4"}] },
      { key: "susp_cymbals_bright_bow", label: "Suspended Cymbals Bright — Bow", channel: 7, kind: "key", loud: "vel", rangeLow: 84, rangeHigh: 93,
        keys: [{"midi":84,"label":"16\" Bright Half Bow 1"},{"midi":85,"label":"16\" Bright Half Bow 2"},{"midi":86,"label":"16\" Bright Half Bow 3"},{"midi":87,"label":"16\" Bright Half Bow 4"},{"midi":89,"label":"16\" Bright Full Bow 1"},{"midi":90,"label":"16\" Bright Full Bow 2"},{"midi":91,"label":"16\" Bright Full Bow 3"},{"midi":92,"label":"16\" Bright Full Bow 4"},{"midi":93,"label":"16\" Bright Long Continuous Bowing"}] },
    ] },
    { slug: "toms_high", name: "Toms High", library: "ARO Low Percussion", status: "verified", port: "SWPerc", channel: 8, techniques: [
      { key: "toms_high_sticks", label: "Toms High — Sticks", channel: 8, kind: "key", loud: "vel", rangeLow: 36, rangeHigh: 70,
        keys: [{"midi":36,"label":"12\" Stick Damped Single Hit L"},{"midi":38,"label":"12\" Stick Damped Single Hit R"},{"midi":40,"label":"12\" Stick Damped Roll"},{"midi":41,"label":"12\" Stick Single Hit L"},{"midi":42,"label":"12\" Stick Rim Hit L"},{"midi":43,"label":"12\" Stick Single Hit R"},{"midi":44,"label":"12\" Stick Rim Hit R"},{"midi":45,"label":"12\" Stick Roll"},{"midi":46,"label":"12\" Stick Rim Roll"},{"midi":60,"label":"10\" Stick Damped Single Hit L"},{"midi":62,"label":"10\" Stick Damped Single Hit R"},{"midi":64,"label":"10\" Stick Damped Roll"},{"midi":65,"label":"10\" Stick Single Hit L"},{"midi":66,"label":"10\" Stick Rim Hit L"},{"midi":67,"label":"10\" Stick Single Hit R"},{"midi":68,"label":"10\" Stick Rim Hit R"},{"midi":69,"label":"10\" Stick Roll"},{"midi":70,"label":"10\" Stick Rim Roll"}] },
      { key: "toms_high_felt", label: "Toms High — Felt", channel: 8, kind: "key", loud: "vel", rangeLow: 48, rangeHigh: 76,
        keys: [{"midi":48,"label":"12\" Felt Single Hit L"},{"midi":50,"label":"12\" Felt Single Hit R"},{"midi":52,"label":"12\" Felt Roll"},{"midi":72,"label":"10\" Felt Single Hit L"},{"midi":74,"label":"10\" Felt Single Hit R"},{"midi":76,"label":"10\" Felt Roll"}] },
      { key: "toms_high_rods", label: "Toms High — Rods", channel: 8, kind: "key", loud: "vel", rangeLow: 53, rangeHigh: 81,
        keys: [{"midi":53,"label":"12\" Rods Single Hit L"},{"midi":55,"label":"12\" Rods Single Hit R"},{"midi":57,"label":"12\" Rods Roll"},{"midi":77,"label":"10\" Rods Single Hit L"},{"midi":79,"label":"10\" Rods Single Hit R"},{"midi":81,"label":"10\" Rods Roll"}] },
      { key: "toms_high_brushes", label: "Toms High — Brushes", channel: 8, kind: "key", loud: "vel", rangeLow: 54, rangeHigh: 82,
        keys: [{"midi":54,"label":"12\" Brushes Single Hit L"},{"midi":56,"label":"12\" Brushes Single Hit R"},{"midi":58,"label":"12\" Brushes Roll"},{"midi":78,"label":"10\" Brushes Single Hit L"},{"midi":80,"label":"10\" Brushes Single Hit R"},{"midi":82,"label":"10\" Brushes Roll"}] },
    ] },
  ],
};
function applyAroPerc(all, sel) {   // the selection is ADDED beside the placeholder `main`, which stays the ordinary voice on its own channels; nothing selected → nothing changes
  const P = all.percussion; if (!P || !sel || !sel.instruments || !sel.instruments.length) return;
  const techs = [];
  for (const I of sel.instruments) for (const q of I.techniques) techs.push(Object.assign({}, q, { keys: q.keys.slice() }));
  const gen = new Set(techs.map(q => q.key));
  P.techniques = P.techniques.filter(q => !gen.has(q.key)).concat(techs);
  P.aroInstruments = sel.instruments.map(I => ({ slug: I.slug, name: I.name, port: I.port, channel: I.channel }));
}
applyAroPerc(INSTRUMENTS, ARO_PERC);
// ---- end of the ARO percussion ----

// ---- RICOTTI MALLETS (generated by tools/apply_ricotti.js from bank/ricotti_catalog.json — do not edit by hand) ----
const RICOTTI = {   // Crotales 9 @DECCrotales 60–84 · Glockenspiel 12 @DECGlock 55–84 · Xylophone 10 @DECXylo 53–95 · Marimba 8 @DECMarimba 36–96 — generated 2026-10-09
  lane: "bowed_vibraphone",
  instruments: [
    {slug: "crotales", name: "Crotales", port: "SWCrotales", track: "Crotales RM", rangeLow: 60, rangeHigh: 84, patches: 9},
    {slug: "glockenspiel", name: "Glockenspiel", port: "SWGlock", track: "Glockenspiel RM", rangeLow: 55, rangeHigh: 84, patches: 12},
    {slug: "xylophone", name: "Xylophone", port: "SWXylo", track: "Xylophone RM", rangeLow: 53, rangeHigh: 95, patches: 10},
    {slug: "marimba", name: "Marimba", port: "SWMarimba", track: "Marimba RM", rangeLow: 36, rangeHigh: 96, patches: 8},
  ],
  techniques: [
    { key: "crot_main_felt", label: "Crotales · Main (Felt)", port: "SWCrotales", channel: 1, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "crot_main_metal_damped", label: "Crotales · Main (Metal damped)", port: "SWCrotales", channel: 2, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "crot_main_metal", label: "Crotales · Main (Metal)", port: "SWCrotales", channel: 3, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "crot_main_plastic_damped", label: "Crotales · Main (Plastic damped)", port: "SWCrotales", channel: 4, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "crot_main_plastic", label: "Crotales · Main (Plastic)", port: "SWCrotales", channel: 5, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "crot_bowed", label: "Crotales · Bowed", port: "SWCrotales", channel: 6, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel", cc1: "vel" },
    { key: "crot_rolls_metal", label: "Crotales · Rolls (Metal)", port: "SWCrotales", channel: 7, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "crot_rolls_plastic", label: "Crotales · Rolls (Plastic)", port: "SWCrotales", channel: 8, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "crot_rolls_rubber", label: "Crotales · Rolls (Rubber)", port: "SWCrotales", channel: 9, rangeLow: 60, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_main_extra_soft", label: "Glockenspiel · Main (Extra Soft)", port: "SWGlock", channel: 1, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_main_hard", label: "Glockenspiel · Main (Hard)", port: "SWGlock", channel: 2, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_main_medium_soft", label: "Glockenspiel · Main (Medium Soft)", port: "SWGlock", channel: 3, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_main_medium", label: "Glockenspiel · Main (Medium)", port: "SWGlock", channel: 4, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_main_soft", label: "Glockenspiel · Main (Soft)", port: "SWGlock", channel: 5, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_glisses", label: "Glockenspiel · Glisses", port: "SWGlock", channel: 6, rangeLow: 36, rangeHigh: 107, kind: "key", loud: "vel", keys: "pending" },
    { key: "glock_rolls_hard", label: "Glockenspiel · Rolls (Hard)", port: "SWGlock", channel: 7, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_rolls_soft", label: "Glockenspiel · Rolls (Soft)", port: "SWGlock", channel: 8, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_shorts_hard", label: "Glockenspiel · Shorts (Hard)", port: "SWGlock", channel: 9, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_shorts_medium_soft", label: "Glockenspiel · Shorts (Medium Soft)", port: "SWGlock", channel: 10, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_tremolo_hard", label: "Glockenspiel · Tremolo (Hard)", port: "SWGlock", channel: 11, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "glock_tremolo_soft", label: "Glockenspiel · Tremolo (Soft)", port: "SWGlock", channel: 12, rangeLow: 55, rangeHigh: 84, kind: "pitched", loud: "vel" },
    { key: "xylo_main", label: "Xylophone · Main", port: "SWXylo", channel: 1, rangeLow: 53, rangeHigh: 95, kind: "pitched", loud: "vel" },
    { key: "xylo_main_hot_rods", label: "Xylophone · Main - (Hot Rods)", port: "SWXylo", channel: 2, rangeLow: 53, rangeHigh: 91, kind: "pitched", loud: "vel" },
    { key: "xylo_main_extra_soft", label: "Xylophone · Main (Extra Soft)", port: "SWXylo", channel: 3, rangeLow: 53, rangeHigh: 91, kind: "pitched", loud: "vel" },
    { key: "xylo_main_hard", label: "Xylophone · Main (Hard)", port: "SWXylo", channel: 4, rangeLow: 53, rangeHigh: 95, kind: "pitched", loud: "vel" },
    { key: "xylo_main_medium", label: "Xylophone · Main (Medium)", port: "SWXylo", channel: 5, rangeLow: 53, rangeHigh: 95, kind: "pitched", loud: "vel" },
    { key: "xylo_main_soft", label: "Xylophone · Main (Soft)", port: "SWXylo", channel: 6, rangeLow: 53, rangeHigh: 95, kind: "pitched", loud: "vel" },
    { key: "xylo_glisses", label: "Xylophone · Glisses", port: "SWXylo", channel: 7, rangeLow: 36, rangeHigh: 107, kind: "key", loud: "vel", keys: "pending" },
    { key: "xylo_rolls_hard", label: "Xylophone · Rolls (Hard)", port: "SWXylo", channel: 8, rangeLow: 53, rangeHigh: 95, kind: "pitched", loud: "vel" },
    { key: "xylo_rolls_hot_rods", label: "Xylophone · Rolls (Hot Rods)", port: "SWXylo", channel: 9, rangeLow: 53, rangeHigh: 91, kind: "pitched", loud: "vel" },
    { key: "xylo_rolls_soft", label: "Xylophone · Rolls (Soft)", port: "SWXylo", channel: 10, rangeLow: 53, rangeHigh: 95, kind: "pitched", loud: "vel" },
    { key: "mar_main", label: "Marimba · Main", port: "SWMarimba", channel: 1, rangeLow: 36, rangeHigh: 96, kind: "pitched", loud: "vel" },
    { key: "mar_main_full_hard", label: "Marimba · Main - Full (Hard)", port: "SWMarimba", channel: 2, rangeLow: 36, rangeHigh: 96, kind: "pitched", loud: "vel" },
    { key: "mar_main_full_soft", label: "Marimba · Main - Full (Soft)", port: "SWMarimba", channel: 3, rangeLow: 36, rangeHigh: 96, kind: "pitched", loud: "vel" },
    { key: "mar_main_rubber", label: "Marimba · Main - Rubber", port: "SWMarimba", channel: 4, rangeLow: 36, rangeHigh: 76, kind: "pitched", loud: "vel" },
    { key: "mar_main_trems", label: "Marimba · Main - Trems", port: "SWMarimba", channel: 5, rangeLow: 36, rangeHigh: 96, kind: "pitched", loud: "vel" },
    { key: "mar_fx_bows", label: "Marimba · FX - Bows", port: "SWMarimba", channel: 6, rangeLow: 36, rangeHigh: 93, kind: "pitched", loud: "vel" },
    { key: "mar_hotrod", label: "Marimba · Hotrod", port: "SWMarimba", channel: 7, rangeLow: 36, rangeHigh: 96, kind: "pitched", loud: "vel" },
    { key: "mar_hotrod_flams", label: "Marimba · Hotrod (Flams)", port: "SWMarimba", channel: 8, rangeLow: 36, rangeHigh: 96, kind: "pitched", loud: "vel" },
  ],
};
function applyRicotti(all, gen) {   // the lane's roster IS the generated one; the lane entry above carries only what is the lane's (label, ordinary, channels)
  const M = all[gen.lane]; if (!M) throw new Error("RICOTTI: no lane " + gen.lane);
  M.techniques = gen.techniques.map(q => Object.assign({}, q));
  M.malletInstruments = gen.instruments.map(I => Object.assign({}, I));
  if (!M.techniques.some(q => q.key === M.ordinary)) throw new Error("RICOTTI: the lane's ordinary voice " + M.ordinary + " is not a patch of the catalog");
}
applyRicotti(INSTRUMENTS, RICOTTI);
// ---- end of the Ricotti mallets ----


// ---- MEASURED RANGES — piece #5's, for the CELLO ONLY ----
// Measured 2026-09-06T14:50 in the Tempus rack (01-REC-260906_1415.wav): per technique [lo, hi]
// of the keys that actually sounded, silent keys listed. The cello is the same library and the
// same instrument, so the measurement carries; every other instrument's rows were left behind
// with piece #5 and are re-measured here at 0d.
const MEASURED_RANGES = {
  cello: {
    "bartok_vel": { lo: 36, hi: 71 },   // silent: 72 73 74 75 76 77 78 79 80 81 82 83
    "gettato_vel": { lo: 36, hi: 76 },   // silent: 77 78 79 80 81 82 83
    "senza_vel": { lo: 36, hi: 83 },
    "accent_senza_vel": { lo: 36, hi: 83 },
    "marcato_sfz_vel": { lo: 36, hi: 83 },
    "marcato_stac_vel": { lo: 36, hi: 83 },
    "spicc_vel": { lo: 36, hi: 83 },
    "stac_vel": { lo: 36, hi: 83 },
  },
};
function applyMeasuredRanges(all, measured) {   // the measured span replaces the keyboard zone where it is narrower
  for (const [inst, techs] of Object.entries(measured || {})) {
    const I = all[inst]; if (!I || !I.techniques) continue;
    for (const q of I.techniques) {
      const m = techs[q.key]; if (!m) continue;
      const lo = q.rangeLow != null ? q.rangeLow : I.rangeLow, hi = q.rangeHigh != null ? q.rangeHigh : I.rangeHigh;
      q.zoneLow = lo; q.zoneHigh = hi; q.measured = true;
      q.rangeLow = Math.max(lo, m.lo); q.rangeHigh = Math.min(hi, m.hi);
      if (m.gaps && m.gaps.length) q.silentKeys = m.gaps.slice();
    }
  }
}
applyMeasuredRanges(INSTRUMENTS, MEASURED_RANGES);
// ---- end of the measured ranges ----


// ---- MEASURED BEND RANGES (generated by tools/apply_bend_ranges.js — do not edit by hand) ----
const MEASURED_BEND = {   // measured 2026-09-19T12:20 (30-REC-260919_0803.wav): semitones per full bend on the ordinary voice; RPN 0 honoured = MIDI can change it
  cello: { rangeSt: 1.012, spreadSt: undefined, mutableByMidi: false, residueCents: null, pitch: 60 },   // OK (1b.2, one fraction)
};
function applyMeasuredBend(all, measured) {   // the measured range replaces the provisional bendRangeSt
  for (const [inst, m] of Object.entries(measured || {})) {
    const I = all[inst]; if (!I || !m) continue;
    I.bendRangeSt = m.rangeSt; I.bendMeasured = true; I.bendMutableByMidi = !!m.mutableByMidi; I.bendResidueCents = m.residueCents;
  }
}
applyMeasuredBend(INSTRUMENTS, MEASURED_BEND);
// ---- end of the measured bend ranges ----


// ---- 1m.4.1 (2026-09-22): THE SI2 THREE KNOW THEMSELVES ----
// The three IRCAM tables above are typed by hand, one line per preset, and stay readable: their `kind` and `loud` are stamped here
// from ONE table that names the by-key voices — everything else of these three is pitched, by velocity (on UVI the loudness is the
// velocity; no wheel). The horn and the trumpet have no by-key voice on the manual's list; 1m.4.2 checks at the rack (RUNNING_LOG
// §244: suspects, not facts). ONLY the instruments named here are stamped — an entry of any other instrument without `kind` is
// caught by tools/roster_check.js, never defaulted.
const SI2_KINDS = {};   // EMPTY at the port (2026-10-04) — piece #6's rows (bassoon · horn · trumpet) left with it
function applySi2Kinds(all, table) {
  for (const [inst, byKey] of Object.entries(table)) {
    const I = all[inst]; if (!I || !I.techniques) continue;
    for (const q of I.techniques) {
      if (q.kind == null) q.kind = byKey[q.key] || "pitched";
      if (q.loud == null) q.loud = "vel";
      if (q.kind === "key" && q.keys == null) q.keys = "pending";
    }
  }
}
applySi2Kinds(INSTRUMENTS, SI2_KINDS);
// ---- end of the SI2 kinds ----

// ---- THE BY-KEY MAPS (1m.4.2, 2026-09-22) — where each by-key voice's keys sit ----
// A voice's keys come from one of three sources, named per entry: his PICTURE of the sampler's keyboard (Kontakt names its keys
// C3 = 60, RUNNING_LOG §3820 · §287) · the SI2 MANUAL's own list (the bassoon's multiphonics: one line per key, the label the
// pitches it sounds in the manual's own naming, '+' a quarter-tone up; UVI names C1 = 36) · the instrument's RANGE assumed where
// nothing better is on file (marked assumed — a dead key is silent, his ear trims it). { lo, hi } = every key from lo to hi, named
// by its note (C4 = 60, the app's naming); keys: [...] = as listed. A voice not named here stays pending (tools/roster_check.js
// prints them). His word (2026-09-22): "just put them in there. We don't have to give them labels yet."
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function noteName(midi) { return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1); }
const BY_KEY_MAPS = {};   // EMPTY at the port (2026-10-04) — piece #6's rows (english_horn · bassoon · double_bass) left with it; a by-key voice's keys are read from his rack (container 4)
function applyKeyMaps(all, table) {
  for (const [inst, byKey] of Object.entries(table)) {
    const I = all[inst]; if (!I || !I.techniques) throw new Error("BY_KEY_MAPS: no instrument " + inst);
    for (const [key, m] of Object.entries(byKey)) {
      const q = I.techniques.find(t => t.key === key); if (!q) throw new Error("BY_KEY_MAPS: no voice " + inst + "/" + key);
      if (q.kind !== "key") throw new Error("BY_KEY_MAPS: " + inst + "/" + key + " is not a key voice");
      q.keys = m.keys ? m.keys.map(k => ({ midi: k.midi, label: k.label })) : Array.from({ length: m.hi - m.lo + 1 }, (_, i) => ({ midi: m.lo + i, label: noteName(m.lo + i) }));
      q.keySource = m.source;
    }
  }
}
applyKeyMaps(INSTRUMENTS, BY_KEY_MAPS);
// ---- end of the by-key maps ----


// Hardware capture input. Keystation 88 MK3 exposes "Keystation 88 MK3" (keys) and
// "MIDIIN2 (Keystation 88 MK3)" (DAW control - never bind). See piece #3's SAMPLER_QUIRKS.md.
const INPUT_MATCH = /keystation/i;
const INPUT_EXCLUDE = /^MIDIIN\d+/i;
