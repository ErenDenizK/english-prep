#!/usr/bin/env bash
# Rebuilds assets/fonts/InterVariable.woff2 as a subset of the full Inter
# variable font (docs/ROADMAP.md phase 1, item 3). Dev-time only: fontTools
# is never a runtime dependency, and the full font is not kept in the tree.
#
# Source: Inter 4.001 (git-9221beed3), InterVariable.woff2 from the upstream
# release, as committed in d402e4a. 352,240 bytes,
#   sha256 693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3
# The script reads that blob from git history, so nothing else is needed.
#
# Kept: both axes (opsz 14-32, wght 100-900) and their variation tables;
# the layout features a browser applies by default plus `tnum` (the
# tabular-nums counters) and `case`.
# Codepoints: Basic Latin, Latin-1, Latin Extended-A (Turkish), the common
# combining marks (U+0307 appears when İ is lower-cased outside `tr`),
# general punctuation, euro and lira, ™, arrows U+2190-21FF and the few
# symbols the content and code use. UNICODES below is mirrored verbatim in
# the @font-face `unicode-range` in css/editorial.css, and
# tests/font-subset.test.js fails if any character the app shows falls
# outside either the range or the subset's cmap.
#
# Usage: tools/subset-font.sh [path-to-pyftsubset]
#   pip install fonttools brotli   (in a virtualenv)
set -euo pipefail

SOURCE_COMMIT=d402e4a
SOURCE_SHA256=693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3
UNICODES="U+0000-00FF,U+0100-017F,U+02C6,U+02DA,U+02DC,U+0300-0304,U+0306-0308,U+030A-030C,U+0327-0328,U+2000-206F,U+20AC,U+20BA,U+2122,U+2190-21FF,U+2212,U+2215,U+2260,U+2264-2265,U+2713,U+FEFF,U+FFFD"
FEATURES="ccmp,locl,mark,mkmk,kern,calt,clig,liga,rlig,rclt,rvrn,curs,frac,numr,dnom,tnum,case"

PYFTSUBSET="${1:-pyftsubset}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

git -C "$ROOT" show "$SOURCE_COMMIT:assets/fonts/InterVariable.woff2" > "$WORK/source.woff2"
echo "$SOURCE_SHA256  $WORK/source.woff2" | sha256sum -c --quiet -

"$PYFTSUBSET" "$WORK/source.woff2" \
  --unicodes="$UNICODES" \
  --layout-features="$FEATURES" \
  --flavor=woff2 \
  --notdef-outline \
  --output-file="$ROOT/assets/fonts/InterVariable.woff2"

wc -c < "$ROOT/assets/fonts/InterVariable.woff2"
