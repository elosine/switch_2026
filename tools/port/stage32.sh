#!/usr/bin/env bash
# 3.2 — stage the data the batteries read, from each source's HEAD (never a working tree), by a list written FIRST.
# Piece 6's recipe (its tools/port/stage32.sh), re-pointed: S6 is now piece 6 (Approaching, decibel_TENOR_2026), and its data is
# THIS run's leave list. Order: piece 4's tuba pages and scores (the tuba-page batteries' fixtures are hashes of them),
# piece 5's four septet pages, then piece 6's data (its files win a same-name path).
# Refuses any path that already exists here before staging — so deleting by the list can never delete an engine file.
# A path this repo TRACKS is this piece's own and is never staged over; one that exists untracked is a leftover: refused.
set -euo pipefail
SP="$(cd "$(dirname "$0")" && pwd)"
D=/c/Users/jwloy/GitHub/switch_2026
S4=/c/Users/jwloy/GitHub/for_seven_tubas
S5=/c/Users/jwloy/GitHub/septet_2026
S6=/c/Users/jwloy/GitHub/decibel_TENOR_2026
L="$SP/staged_list.txt"; SRC="$SP/staged_sources.txt"
: > "$SRC"

git -C "$S4" ls-files notation/ir | sed "s#^#S4\t#" >> "$SRC"
for n in tranceA002f piece-final-draft-001 piece-s25-finished01 piece-s23 piece-s27 piece-s28 cloud02-10track cloud02i-b cloud02i-b2; do printf 'S4\tscores/%s.json\n' "$n" >> "$SRC"; done
for n in piece-septet strike1 trill1 0i-test-b; do printf 'S5\tnotation/ir/%s.ir.json\n' "$n" >> "$SRC"; done
grep -E '^(bank|scores|probes)/|^notation/(ir|video)/|^print/cover/cover-a3-landscape[.]svg$' "$SP/leave_list.txt" | grep -v '^bank/samples/\|^bank/backup/' | sed "s#^#S6\t#" >> "$SRC"
# the engine's index the page fetches at load (piece 6's, 1 MB) — staged too, so the page's attach line finds a file
printf 'S6\tbank/samples/index.json\n' >> "$SRC"

OWN="$SP/staged_own.txt"; : > "$L"; : > "$OWN"; n=0
while IFS= read -r p; do
  if git -C "$D" ls-files --error-unmatch -- "$p" > /dev/null 2>&1; then echo "$p" >> "$OWN"
  elif [ -e "$D/$p" ]; then echo "REFUSED: exists here, untracked: $p"; n=$((n+1))
  else echo "$p" >> "$L"; fi
done < <(cut -f2 "$SRC" | sort -u)
[ "$n" = 0 ] || exit 1
[ -s "$OWN" ] && echo "this repo's own, not staged: $(tr '\n' ' ' < "$OWN")"
echo "staged list written: $(wc -l < "$L") paths (from $(wc -l < "$SRC") source rows)"

stage() {
  local repo; case "$1" in S4) repo="$S4";; S5) repo="$S5";; S6) repo="$S6";; esac
  mkdir -p "$D/$(dirname "$2")"
  git -C "$repo" show "HEAD:$2" > "$D/$2" 2>/dev/null || { echo "MISSING at $1 HEAD: $2"; rm -f "$D/$2"; }
}
while IFS=$'\t' read -r tag p; do grep -Fxq -- "$p" "$OWN" && continue; stage "$tag" "$p"; done < "$SRC"

node -e "
const fs=require('fs');const D=process.argv[1];
for(const n of ['piece-septet','strike1','trill1','0i-test-b']){try{const j=JSON.parse(fs.readFileSync(D+'/notation/ir/'+n+'.ir.json','utf8'));const s=(j.source&&j.source.score)||(j.provenance&&j.provenance.score)||'';console.log(n+'\t'+s);}catch(e){console.log(n+'\tERR '+e.message);}}
" "$D" > "$SP/s5_scores.txt"
while IFS=$'\t' read -r page sc; do
  [ -n "$sc" ] || continue
  f="scores/${sc%.json}.json"; f="${f#scores/scores/}"; case "$f" in scores/*) ;; *) f="scores/$f";; esac
  if grep -Fxq "$f" "$L"; then continue; fi
  [ -e "$D/$f" ] && { echo "REFUSED second pass: exists: $f"; continue; }
  echo "$f" >> "$L"; stage S5 "$f"
done < "$SP/s5_scores.txt"
sort -u "$L" -o "$L"
echo "staged: $(wc -l < "$L") paths; on disk: $(while IFS= read -r p; do [ -e "$D/$p" ] && echo x; done < "$L" | wc -l)"
