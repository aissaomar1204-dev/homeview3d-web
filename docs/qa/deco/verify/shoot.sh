#!/usr/bin/env bash
# usage: shoot.sh <name> <path> <width> <light|dark> [slice] [wait ms]
cd "$(dirname "$0")"
S=${SESSION:-verifyD}
W=$3; SCHEME=$4; SL=${5:-0}; WAIT=${6:-4500}
H=900; if [ "$W" -lt 500 ]; then H=844; fi
D="$(pwd -W)/_tmp/seg"; rm -rf "$D"; mkdir -p "$D"
sed -e "s#__DIR__#$D#" -e "s#__W__#$W#" -e "s#__H__#$H#" -e "s#__SCHEME__#$SCHEME#g" -e "s#__PATH__#$2#" -e "s#__WAIT__#$WAIT#" cap.tpl.js > _tmp/_cap.js
playwright-cli -s=$S run-code --filename=_tmp/_cap.js 2>&1 | grep -E "Result|Error|error|\"n\"" | head -5
if [ "$SL" != "0" ]; then node stitch.mjs "$D" "shots/$1" "$SL"; else node stitch.mjs "$D" "shots/$1"; fi
