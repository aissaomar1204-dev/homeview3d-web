#!/bin/bash
# Rebuilds the prototype and re-takes every screenshot of the deliverable (needs: node build/serve.mjs 8903 dist-explore-C running).
# Full pages go through shot.sh (8000 px chunks stitched), close-ups through closeups.js (real scrolling, parallax and photos settled).
set -e
ROOT=/e/ProyectosRealStateBlender; C=docs/design/explore/C; S=$C/shots
cd $ROOT
node $C/apply.mjs
P="playwright-cli -s=exploreC"
$P localstorage-clear >/dev/null 2>&1 || true; $P clear-reduced-motion >/dev/null 2>&1 || true
$P resize 1440 900 >/dev/null
$C/shot.sh $S/home-1440-light.jpg http://localhost:8903/
$C/shot.sh $S/service-1440-light.jpg http://localhost:8903/servicios/plano-2d-a-3d/
$P localstorage-set hv-theme dark >/dev/null
$C/shot.sh $S/home-1440-dark.jpg http://localhost:8903/
$C/shot.sh $S/service-1440-dark.jpg http://localhost:8903/servicios/plano-2d-a-3d/
$P localstorage-clear >/dev/null
$P resize 390 844 >/dev/null
$C/shot.sh $S/home-390-light.jpg http://localhost:8903/
$C/shot.sh $S/service-390-light.jpg http://localhost:8903/servicios/plano-2d-a-3d/
$P resize 1440 900 >/dev/null
$P run-code --filename=$ROOT/$C/closeups.js | grep -i error || true
echo all captured
