#!/usr/bin/env bash
cd "$(dirname "$0")"
declare -A P=( [home]=/ [svc]=/servicios/plano-2d-a-3d/ [precios]=/precios/ [contacto]=/contacto/ [faq]=/preguntas-frecuentes/ [guia]=/guias/cuanto-cuesta-un-render-3d/ [caso]=/casos/villa-costa-del-sol/ [audiencia]=/soluciones/promotoras-obra-nueva/ [zona]=/zonas/marbella/ )
ORDER="home svc precios contacto faq guia caso audiencia zona"
for theme in light dark; do
 for w in 1440 390; do
  for n in $ORDER; do
    f="$n-$w-$theme"
    if [ -f "shots/$f.jpg" ] && [ "$FORCE" != "1" ]; then continue; fi
    sl=1900; [ $w -lt 500 ] && sl=2600
    echo "== $f"; ./shoot.sh $f "${P[$n]}" $w $theme $sl 2>&1 | tail -3
  done
 done
done
echo BATCH_DONE
