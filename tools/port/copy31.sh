#!/usr/bin/env bash
# 3.1 the copy, byte-exact — piece 6 (Approaching, decibel_TENOR_2026) at its HEAD commit; nothing is written there.
# EVERY file is taken from the COMMIT (`git show HEAD:path`), never from the working tree — piece 6's deviations 3.1 · 3.2:
# the source holds a modified file of his, and the blob-hash proof is the step's proof.
# Proof: `git hash-object` of each copied file = the source commit's blob hash (from `git ls-tree -r HEAD`), N / N.
set -euo pipefail
SP="$(cd "$(dirname "$0")" && pwd)"
S=/c/Users/jwloy/GitHub/decibel_TENOR_2026
D=/c/Users/jwloy/GitHub/switch_2026
HEADS=$(git -C "$S" rev-parse HEAD)
[ "${HEADS:0:7}" = "9796edd" ] || { echo "STOP: the source HEAD moved: $HEADS"; exit 1; }
L="$SP/copy_list.txt"
echo "copy list: $(wc -l < "$L") paths from $S @ ${HEADS:0:7}"

# the guard: a path on the copy list may not already exist here (the kit's files are on the leave list by construction)
n=0
while IFS= read -r p; do [ -e "$D/$p" ] && { echo "REFUSED: exists here already: $p"; n=$((n+1)); }; done < "$L"
[ "$n" = 0 ] || exit 1

# the copy, from the commit
git -C "$S" ls-tree -r HEAD | awk '{print $3, $4}' > "$SP/src_blobs.txt"
while IFS= read -r p; do
  mkdir -p "$D/$(dirname "$p")"
  git -C "$S" show "HEAD:$p" > "$D/$p"
done < "$L"

# the proof: blob hash of every copied file against the source commit
ok=0; bad=0
while IFS= read -r p; do
  want=$(grep -F " $p" "$SP/src_blobs.txt" | awk -v P="$p" '$2==P{print $1}')
  have=$(git -C "$D" hash-object "$D/$p")
  if [ "$want" = "$have" ]; then ok=$((ok+1)); else bad=$((bad+1)); echo "DIFFERS $p ($want vs $have)"; fi
done < "$L"
echo "blob hash against the source commit: $ok / $(wc -l < "$L") identical, $bad differ"
[ "$bad" = 0 ]
