#!/usr/bin/env bash
# THE PRINT SCORE, END TO END — the answer to "how do I re-render after I change
# the score?" (composer, piece #4 day 37; the septet's 2026-09-17; piece #6's 2026-10-03;
# made THIS piece's — Approaching — 2026-10-11, decibel PLAN 2.16 step 1, RUNNING_LOG §476).
#
# THE CHAIN, and the step that is easy to miss:
#
#     scores/piece-Draft01d.json --(notate_section)--> notation/ir/approaching.ir.json --(export_print)--> PDF
#                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#     The print score is drawn from the IR, NOT from the save file. Edit the
#     score, re-run export_print alone, and you render the OLD notation with no
#     error of any kind. That is why --rebuild-ir exists.
#
#   bash print/score/build.sh                 # render the PDF from the IR as it stands
#   bash print/score/build.sh --proof         # the proof PDFs only (one page per section · the front matter · the density trio), fast
#   bash print/score/build.sh --rebuild-ir    # rebuild the IR from the score FIRST, then render
#
# DRAFT 01 IS PRINTED WITHOUT --rebuild-ir (PLAN 2.16): the print is OF the page that was filmed (the tag
# Approaching-Draft01-film_1.0). A rebuild moves the page under the film and the audio — if the score moves,
# the page, the take and the film move first (PLAN 2.16, "if the score moves"), then this.
# The exporter says "piece-Draft01d.json is NEWER than approaching.ir.json": true and meant — the save took the
# take's fixes (keys that sound, levels) after the page was cut, and none of them is drawn (RUNNING_LOG §423).
# The rebuild goes through tools/reextract.js, which re-runs the IR's OWN recorded build (`provenance.build`)
# on a fresh copy of the save. [Carried from piece #6; NOT run from this script here.]
#
# Density, margins, the instructions' break: pass through, e.g.
#   bash print/score/build.sh --sec 12
#   bash print/score/build.sh --margin 0.4
#   bash print/score/build.sh --insBreak "Language Music"
#
# THE SHEET IS A3 LANDSCAPE, at his word (2026-10-11, RUNNING_LOG §476 — "a yes"): the house format since the tubas —
# 419.7 x 296.8 mm drawn, inside DIN A3. It is the exporter's default; Tabloid (11 x 17 in) is the US near-equivalent:
# --format tabloid-landscape, and a cover for that sheet first (print/cover/make_cover.ps1 -Format tabloid-landscape).
#
# THE ELECTRONICS' LAYER IS ON PAPER, at his word ("b yes") — the grey panes and purple bars of the presentation score.
# The pane's GRAIN is not: it is an SVG filter, and a filter prints as a picture (export_print drops it; --grain on keeps it).
#
# THE PIECE ENDS ON A FINAL BAR LINE at 783 s — this piece's page carries its own (the item `finalbar`, rules.json
# objects.finalBar, RUNNING_LOG §411) through every lane; check_print_pages FAILS a score without exactly one.
set -e
cd "$(dirname "$0")/../.."
OUT=print/score/Approaching-score-JYang.pdf
IR=approaching
# one moment per section: the opening · the three-body problem · the trills and accented long tones · the multiphonics ·
# the audible beats · the scattered strikes
AT=20,80,150,300,560,720
# the density trio's moment: a page of section three (trills, bouncing balls, mic openings — the densest kind of page)
DENS=150

REBUILD=0
PROOF=0
PASS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --rebuild-ir) REBUILD=1; shift;;
    --proof) PROOF=1; shift;;
    *) PASS+=("$1"); shift;;
  esac
done

if [ "$REBUILD" = "1" ]; then
  echo "=== REBUILDING $IR FROM ITS OWN provenance.build (tools/reextract.js) ==="
  # snapshot first: the IR schema is a GATE and a rejected build DELETES the page
  cp "notation/ir/$IR.ir.json" "notation/ir/$IR.ir.json.bak"
  echo "  snapshot: notation/ir/$IR.ir.json.bak"
  IR="$IR" node tools/reextract.js ""
  echo "=== IR rebuilt — the film and the audio are now of an OLDER page ==="
fi

# THE TWO CHECKS THAT MUST PASS BEFORE A PAGE IS BELIEVED:
#   the frame  — the printed page is the filmed page (systems, labels, brackets, census — from the ensemble)
#   the front  — the cover's face resolved, and no column is being clipped
echo "=== CHECKS ==="
node tools/check_print_frame.js --ir "$IR" --at "$AT"
node tools/check_print_front.js --ir "$IR" "${PASS[@]}"

if [ "$PROOF" = "1" ]; then
  echo "=== THE PROOF PAGES (one per section) ==="
  node tools/export_print.js --ir "$IR" --at "$AT" --out print/score/PROOF-A3-frame.pdf "${PASS[@]}"
  node tools/export_print.js --ir "$IR" --cover on --instructions on --pages 1 --out print/score/PROOF-front-matter.pdf "${PASS[@]}"
  echo "=== THE DENSITY TRIO (the same moment at three densities — the lane never changes, only the time a page holds) ==="
  node tools/export_print.js --ir "$IR" --sec 8.5 --at "$DENS" --out print/score/PROOF-density-8.5.pdf
  node tools/export_print.js --ir "$IR"           --at "$DENS" --out print/score/PROOF-density-10.3.pdf   # the default = the film's own density
  node tools/export_print.js --ir "$IR" --sec 12  --at "$DENS" --out print/score/PROOF-density-12.pdf
  echo "=== THE PAGE-EDGE CALLS (PLAN 2.16 step 2: page 1 · a page turn in the opening · a trill page with restated badges · the last page) ==="
  node tools/export_print.js --ir "$IR" --at 1,12,157,782 --out print/score/PROOF-edge-calls.pdf "${PASS[@]}"
  echo "=== CHECKING THE PROOF FILES ==="
  for F in print/score/PROOF-A3-frame.pdf print/score/PROOF-front-matter.pdf print/score/PROOF-edge-calls.pdf; do node tools/check_print_pdf.js --pdf "$F"; done
  echo "=== DONE (proofs) ==="
  exit 0
fi

echo "=== RENDERING THE PRINT SCORE ==="
node tools/export_print.js --ir "$IR" --cover on --instructions on --out "$OUT" "${PASS[@]}"
echo "=== CHECKING THE PDF ==="
node tools/check_print_pdf.js --pdf "$OUT"
echo "=== WALKING EVERY PAGE ==="
node tools/check_print_pages.js --ir "$IR" "${PASS[@]}"
echo "=== THE PAGE EDGES (the cut placed by the objects) ==="
node tools/check_print_edges.js --ir "$IR" "${PASS[@]}"
echo "=== DONE ==="
ls -la "$OUT"
