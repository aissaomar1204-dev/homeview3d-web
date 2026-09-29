#!/usr/bin/env bash
cd "$(dirname "$0")"
export MSYS_NO_PATHCONV=1
PAGES="/ /servicios/plano-2d-a-3d/ /precios/ /contacto/ /preguntas-frecuentes/ /guias/cuanto-cuesta-un-render-3d/ /casos/villa-costa-del-sol/ /soluciones/promotoras-obra-nueva/ /zonas/marbella/ /en/ /como-funciona/ /glosario/"
: > contrast.log
for cfg in "1440 light" "390 light" "1440 dark" "390 dark"; do
  set -- $cfg
  for p in $PAGES; do
    node contrast.mjs "$p" $1 $2 2>&1 | grep -v -E "DEP0190|trace-deprecation" >> contrast.log
  done
done
echo CBATCH_DONE >> contrast.log
