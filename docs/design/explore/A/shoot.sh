#!/usr/bin/env bash
# usage: shoot.sh <name> <url-path> <width> [light|dark] [dpr-note]
# Full-page screenshot into shots/<name>.png: scroll-through (lazy images, reveals, content-visibility), then 6000px segments
# (Chromium cannot capture > 16384px in one go) stitched with sharp.
cd "$(dirname "$0")"
S=exploreA
W=${3:-1440}; SCHEME=${4:-light}
H=900; if [ "$W" -lt 500 ]; then H=844; fi
playwright-cli -s=$S resize $W $H >/dev/null 2>&1
playwright-cli -s=$S set-color-scheme $SCHEME >/dev/null 2>&1
playwright-cli -s=$S goto "http://localhost:8901$2" >/dev/null 2>&1
playwright-cli -s=$S eval "() => { try { localStorage.setItem('hv-theme','$SCHEME') } catch(e){}; document.documentElement.setAttribute('data-theme','$SCHEME'); return 1 }" >/dev/null 2>&1
playwright-cli -s=$S eval "$(cat prep.js)" 2>&1 | sed -n 2p
D="$(pwd -W)/shots/_seg"; rm -rf "$D"; mkdir -p "$D"
sed "s#__DIR__#$D#" seg.tpl.js > _seg.js
playwright-cli -s=$S run-code --filename=_seg.js >/dev/null 2>&1
node stitch.mjs "$D" "shots/$1.png"
