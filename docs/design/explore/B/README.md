# Dirección B · «Blueprint luxe / estudio técnico»

Prototipo para el feedback del cliente («la web es buen cimiento pero demasiado simple, fondo triste, sin juego de blancos, negros y grises, sin diseños en el fondo»). Se conserva la estructura, el contenido, la marca (añil, Archivo, logo, hero animado plano a 3D). Cambia lo que rodea al contenido: un ritmo de capítulos blanco / gris hormigón / grafito y un fondo dibujado como una lámina de estudio de arquitectura.

No se ha tocado `src/`, `build/`, `public/` ni `dist/`. Todo sale de `dist-explore-B/` (ignorado por git).

```
node docs/design/explore/B/apply.mjs          # copia dist/ -> dist-explore-B/ e inyecta CSS + marcado + máscaras
node build/serve.mjs 8902 dist-explore-B      # http://localhost:8902/  ·  /servicios/plano-2d-a-3d/  ·  /precios/
node docs/design/explore/B/bytes.mjs          # coste en bytes
node docs/design/explore/B/contrast.mjs       # ratios de contraste de la paleta
```

## Concepto

La web pasa a ser un juego de láminas de un estudio técnico. El fondo de cada capítulo es papel de plano: una rejilla fina de 10 px y otra mayor de 100 px con nodos, enmascaradas con un degradado radial para que «brillen» alrededor del contenido y se apaguen hacia los bordes. Sobre ella se dibujan ornamentos con datos plausibles (cotas de 9,10 x 14,10 m, niveles +1,15 y +2,60, corte A-A', ejes A-E y 1-4, superficies de las estancias de la villa real). Las tarjetas son láminas (borde fino, dos hojas asomando detrás, marcas de corte en las esquinas, cajetín al pie). Añil solo aparece en resaltes: cotas, números, barra luminosa de los planos oscuros, CTA. El capítulo oscuro no es negro puro: grafito `#15181D` con la misma rejilla en blanco al 6 %.

Tres decisiones que lo separan de una «landing con fondo oscuro»:

1. Los bloques oscuros son capítulos con función (datos clave, proceso, contacto, cierre) y una lámina clara «incrustada» (el visor del hero, el despiece, el plano comparado). La luz del render se lee como una pantalla en una sala oscura.
2. Todo ornamento es un dibujo técnico con eliminación de líneas ocultas (pintado de lejos a cerca), no un adorno genérico. La maqueta isométrica de las capas es la misma villa que el visor.
3. Cero degradados de colores, cero blur/glass, cero emojis. Las sombras son de «papel apilado» y una sombra ambiental difusa.

## Mapa de ritmo (paleta y sección)

Paleta nueva (todo lo demás son los tokens existentes; tokens nuevos `--hb-*`, en `00-tokens.css` al integrar):

| Token | Claro | Oscuro (tema) | Uso |
|---|---|---|---|
| papel (`--color-bg`) | `#F4F5F6` | `#0F1215` | fondo base |
| lámina blanca (`--color-surface`) | `#FCFCFD` | `#161A1E` | capítulos blancos, tarjetas |
| `--hb-cc` hormigón | `#E1E5E9` | `#171B20` | capítulos grises |
| `--hb-c2` hormigón profundo | `#D2D7DD` | `#1D2228` | visor |
| `--hb-g0` grafito | `#15181D` | `#07090B` | capítulos oscuros |
| `--hb-g1` / `--hb-g2` | `#1C2026` / `#2A3038` | `#0F1215` / `#232930` | superficie elevada y línea sobre grafito |
| `--hb-deep` | `#0E1013` | `#040506` | pie de página |
| `--hb-lit` | `#A2B3EA` | igual | añil sobre grafito (8,6:1) |

Contraste medido (WCAG): texto sobre grafito 15,0:1; ink-2 9,2:1; ink-3 6,0:1; añil claro 8,6:1; ink-3 de hormigón (`#56606A` / `#4C545E`) 5,1:1 y 5,3:1. Auditoría automática del texto visible en home, servicio y precios, claro y oscuro, a 1440, 768 y 390: 0 fallos reales (1 falso positivo: el pie de foto del hero de servicio, que va sobre un panel gráfico que es hermano en el DOM, no ancestro; su ratio real es 6,0:1).

Home, de arriba abajo:

| Zona | Fondo | Fondo dibujado |
|---|---|---|
| Franja superior | grafito | punto añil luminoso, dato de precio |
| Cabecera | papel | regla de 10/100 px bajo la barra |
| Hero | papel con halo blanco | rejilla, maqueta isométrica fantasma con cotas (se traza), regla de niveles, marcador A-A', panel grafito a la derecha con cajetín, rejilla y marcas de corte |
| Datos clave | **grafito** | cajetín invertido |
| § 01 Del plano al 3D | **hormigón** `#E1E5E9` | rejilla, maqueta isométrica con cotas bajo la leyenda, láminas con marcas de corte |
| § 02 Qué recibes | papel | rejilla, 5 láminas con hojas apiladas y cajetín (LÁM. 01/05...) |
| § 03 Proceso | **grafito** | rejilla, halo añil, regla +2,60/+1,15/±0,00, cajetín del despiece, planta fantasma, números de paso en contorno |
| § 04 La villa en 3D | **hormigón profundo** `#D2D7DD` | rejilla, planta acotada con ejes en trazo, visor como lámina |
| § 05 Para quién | **blanco** | tarjetas-lámina con numerales enormes en contorno |
| § 06 Precios | **hormigón** | rejilla; pack recomendado en **grafito** con barra luminosa añil |
| § 07 Calculadora | papel | rejilla; widget grafito con barra luminosa |
| § 08 FAQ | **blanco** | numeración mono, fila abierta con filo añil |
| § 09 Contacto | **grafito** | rejilla, halo, maqueta isométrica en capas con guías, formulario re-tematizado |
| Pie | **grafito profundo** | planta a escala grande y muy tenue, wordmark en contorno |

Página de servicio (`/servicios/plano-2d-a-3d/`): hero papel con panel grafito y cajetín; datos clave grafito; § 01 papel; § 02 hormigón (comparador con maqueta acotada); § 03 blanco con **ficha de precio grafito** y dibujo isométrico bajo ella (rellena la mitad vacía); lámina grafito para el render a altura de ojos con marcas de corte y cajetín; § 04 tabla-lámina con las dos filas propias resaltadas; § 05 proceso sobre hormigón con maqueta en capas; § 06 requisitos como 4 láminas; § 07 y § 08 respuestas alternas con figuras como impresiones; monumento grafito para la cifra de Registradores (11.727 a 230 px) con planta al fondo; precios; aviso «material comercial» como hoja con margen rayado; FAQ; relacionados; banda CTA grafito; pie. Las páginas interiores dejan de ser un muro de texto con la mitad derecha vacía: cada columna vacía recibe un dibujo o una lámina.

Precios (`/precios/`): aplicado de forma genérica (ritmo por tipo de sección) para comprobar que el sistema escala a las demás páginas interiores sin marcado a mano.

## Inventario de decoración

- **Rejilla de plano** (CSS, 2 gradientes + máscara radial): 10 px y 100 px con nodos; `--gx/--gy` mueven la luz, `--m1/--m2` el radio.
- **Halo de luz** (radial, blanco en claro, añil al 10 % en oscuro).
- **Maquetas isométricas en línea** (SVG máscara, 4 dibujos): hero, comparador, capas con guías, aside de servicio. Líneas ocultas eliminadas dentro del propio SVG, sin fondo propio.
- **Planta acotada** (SVG máscara): ejes con burbujas, cadenas de cotas, giros de puerta, etiquetas de estancia con m² reales de la villa, norte. Versión sin texto para el pie.
- **Regla de niveles** (+2,60 / +1,15 / ±0,00), **marcador de corte A-A'**, **regla de 10/100 px** bajo la cabecera.
- **Marcas de corte** (8 segmentos con una variable de longitud) en láminas, visor, comparador, figuras.
- **Láminas**: hojas apiladas con `box-shadow` (se abren de 4 a 7 px al pasar el ratón), cajetín al pie (LÁM. 01/05...).
- **Numerales**: `§ 01` mono, cifra de capítulo enorme en contorno, números de paso, numerales de audiencia, «Tarifa 01/02/03», «Req. 01».
- **Barras luminosas** añil (3 px + halo) en el pack recomendado, el widget de la calculadora y la ficha de precio.
- **Wordmark en contorno** de pie de página y planta fantasma.
- **Trazado (draw-on)**: barrido `--p` con `@property` que revela el dibujo de izquierda a derecha. Hero por tiempo (2,8 s tras 0,3 s); el resto con `animation-timeline: view()`. Sin soporte o con `prefers-reduced-motion`, el dibujo está entero. Sin JS.
- **Grafito «incrustado»**: los capítulos oscuros re-declaran los tokens (`.hb-dk`), así que formulario, tabla, cajetín y enlaces se re-tematizan solos. En el tema oscuro del sitio el grafito se hace más profundo (`#07090B`) y el papel pasa a `#0F1215`; el ritmo se conserva.

## Qué cuesta

Medido con el minificador y el acortador de tokens reales de `build/lib/assets.mjs`:

| Pieza | Bytes |
|---|---|
| `explore-B.css` fuente (con comentarios) | 28,7 KB |
| minificado | 23,2 KB |
| minificado + tokens propios acortados | **21,4 KB** (ligeramente por encima del objetivo de 20 KB) |
| gzip / brotli | 5,4 KB / **4,7 KB** |
| 9 máscaras SVG (`assets/`, se piden al pintar, no bloquean el render) | 58,8 KB en bruto, **10,0 KB brotli** entre las 9 (una página pide 5 a 9) |
| HTML de la home | +2,6 KB en bruto, +0,5 KB brotli |
| HTML del servicio | +1,8 KB en bruto, +0,4 KB brotli |
| HTML de precios | +1,0 KB en bruto, +0,2 KB brotli |
| Imágenes nuevas | 0. Se reutilizan los renders existentes. |
| JS nuevo | 0 |

Coste real en carga: ~4,7 KB brotli de CSS crítico (bloqueante) más ~10 KB brotli de máscaras decorativas que se descargan en paralelo y tras el primer pintado del hero.

### Avisos de presupuesto (`BUDGETS` en `build/lib/machine.mjs`)

- La home ya suma 44,8 KB de CSS (site 23,1 + bundle 22,7) frente a `cssPageKB: 45`, y `cssBlockingMax: 2` no permite una tercera hoja bloqueante. Integrar exige tocar los presupuestos o repartir: **tokens y colores de capítulo (~4 KB) al `site.css`** (`cssSharedKB` de 25 a 30) y **el resto como módulo `@module deco`** cargado con los mismos disparadores que el resto de bundles.
- HTML de la home: 71,6 KB frente a `htmlRawKB: 72` y 15,9 KB brotli frente a `htmlBrotliKB: 16`. Este prototipo se pasa (74,2 KB / 16,4 KB). Se recupera moviendo a CSS los textos decorativos (cajetines de las láminas, panel del hero, rótulos de las reglas) mediante `content: attr(data-*)` o `content` fijo: el HTML añadido baja a ~0,6 KB.

## Cómo se integraría en el código real

Ningún cambio de contenido ni de rutas.

1. `src/css/00-tokens.css`: añadir los `--hb-*` de la primera sección de `explore-B.css` (claro, `@media` oscuro y `[data-theme="dark"]`, duplicados a propósito como el resto). Es el único fichero que puede llevar valores en bruto (lint de diseño); el resto del CSS usa `var()`. Renombrar `--hb-*` a la nomenclatura del sistema si se prefiere (`--color-graphite`, `--color-concrete`...).
2. Nuevo `src/css/62-deco.css` (`/* @module deco ... */` con las clases disparadoras `hb-ch hb-dk hb-gr hb-mk`) con el resto de `explore-B.css`. La sección «Chapter scopes» es el corazón: `.hb-dk` re-declara tokens y todo lo demás sigue funcionando.
3. `build/lib/layout.mjs` y las plantillas de sección: las clases de capítulo salen de un dato por bloque, no del regex de `apply.mjs`. Mapa: `hb-ch` (capítulo), `hb-pp` papel / `hb-wh` blanco / `hb-cc` hormigón / `hb-c2` hormigón profundo / `hb-dk` grafito, `hb-gr` (rejilla), `hb-lit` (halo). Añadir un campo `tone` a cada bloque del contenido o a la plantilla (`tone: 'dark' | 'concrete' | 'white' | 'paper'`) mantiene el ritmo editable desde un único sitio, y `number()` de `helpers.mjs` pasa a ser un contador de plantilla que escribe `data-n`.
4. `build/lib/components.mjs`: los componentes ya emiten las clases que el CSS engancha (`.bento__cell`, `.pack`, `.index__item`, `.cajetin`...). Añadir el cajetín al pie del bento (`.hb-tb`) desde los datos del bento, y los `<div class="hb-mk hb-i-hero hb-sd">` como partial `ornament(name, cls)`.
5. `public/assets/deco/*.svg`: las 9 máscaras generadas por `iso.mjs`. Pasar `iso.mjs` a `scripts/deco.mjs` (generador de build, ya sin dependencias) con la geometría de `build/data/villa.mjs` en vez de la copia decorativa, así las cotas y las superficies de las etiquetas salen del mismo dato que el visor. Las URL entran en el pipeline de hash como `/assets/...` (el acortador de CSS ya las reescribe).
6. `_headers` / CSP: sin cambios (mismo origen, `img-src 'self'`; las máscaras son SVG de mismo origen, `mask-image` se rige por `img-src`).
7. Hero: `.hs::before` (marcas de corte) y el panel grafito solo dependen de `.hero--seq`. `hero.js` no cambia.
8. Modo oscuro y toggle: sin JS nuevo. La plantilla de `theme.js` sigue mandando.

## Notas y límites

- Verificado en 390, 768, 1024, 1440 y 1920: sin desbordamiento horizontal; sin errores de consola; hero animado conservado (fotogramas del plano al 3D dentro de la lámina clara sobre el panel grafito).
- El comparador, el visor `model-viewer` y la calculadora no se han tocado: solo se re-visten.
- Las máscaras usan `mask-mode: luminance`, `mask-composite: intersect` y `@property` (Chromium 120+, Safari 16.4+, Firefox 128+). Sin soporte, `.hb-mk` se oculta con un `@supports` (ya incluido): el navegador antiguo ve el capítulo sin dibujo, nunca un rectángulo relleno.
- Las capturas a pantalla completa se hicieron con `prefers-reduced-motion: reduce` (estado final de cada dibujo). El trazado en vivo se comprobó con capturas a 0,6 s y 2,2 s del hero.
- Los cajetines («Rev. B · 28.09.2026», «Lám. 01/05», «Esc. 1:100») son ornamento plausible con datos reales (cotas y m² de la villa, precio y plazos del cajetín existente). Antes de publicar conviene decidir si el estudio quiere mantener números de revisión inventados o quitarlos.

## Capturas (`shots/`)

- `home-1440-light.png`, `home-390-light.png`, `home-1440-dark.png`
- `service-1440-light.png`, `service-390-light.png`, `precios-1440-light.png`
- Momentos: `close-1-hero`, `close-2-compare`, `close-3-laminas`, `close-4-graphite-process`, `close-5-pricing`, `close-6-footer`, `close-7-service-hero`, `close-8-service-price-plate`
