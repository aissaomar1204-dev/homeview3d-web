#!/usr/bin/env bash
# usage: exp.sh <out.jpg> <urlpath> <width> <scheme> <selector> <nth> <clipHeight> <css>
cd "$(dirname "$0")"; export MSYS_NO_PATHCONV=1
OUT="$(pwd -W)/$1"
node run.mjs exp.tpl.js OUT="$OUT" URLP="$2" W="$3" SCHEME="$4" SEL="$5" NTH="$6" CH="$7" CSS="$8" 2>&1 | grep -v -i deprecat
