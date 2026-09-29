#!/usr/bin/env bash
# usage: shot.sh <out.jpg> <urlpath> <width> <light|dark> <selector> [nth] [forcedColors none|active]
cd "$(dirname "$0")"; export MSYS_NO_PATHCONV=1
OUT="$(pwd -W)/$1"
node run.mjs shot.tpl.js OUT="$OUT" URLP="$2" W="$3" SCHEME="$4" SEL="$5" NTH="${6:-0}" FC="${7:-none}" SYS="${8:-$4}" CSS="${9:-/*x*/}" 2>&1 | grep -v Deprecation | grep -v trace-deprecation
