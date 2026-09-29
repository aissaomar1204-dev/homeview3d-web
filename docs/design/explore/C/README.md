# Dirección C · «Claroscuro cinematográfico»

Página clara (blancos y grises) puntuada por capítulos casi negros donde los renders brillan. El sitio conserva estructura, textos, marca (añil, Archivo, logo, hero animado plano a 3D) y el ADN de plano de arquitecto; lo que cambia es el ritmo de fondos y la decoración de cada fondo.

Todo se prototipa sin tocar `src/`, `build/`, `public/` ni `dist/`. Salida: `dist-explore-C/`.

```
node docs/design/explore/C/apply.mjs                 # copia dist/ a dist-explore-C/ y aplica la dirección
node build/serve.mjs 8903 dist-explore-C             # http://localhost:8903/  y  /servicios/plano-2d-a-3d/
docs/design/explore/C/capture-all.sh                 # rehace todas las capturas (playwright-cli -s=exploreC)
```

## 1. Concepto

1. **Letterbox.** Cabecera negra con borde de regla milimetrada, hero claro y franja negra de "Datos clave" justo debajo: el hero queda como una pantalla iluminada entre dos barras negras. Bajo el visor del hero, la tira de fases y el cajetín pasan a grafito (como la claqueta de una película).
2. **Luz, no color.** Los degradados son solo grises y un único toque de luz cálida (rgb 255 214 168) que se cuela por una esquina de los capítulos oscuros, tomada del propio render. Ningún degradado de color, ningún blob, ningún cristal esmerilado, ningún emoji.
3. **Los renders son la iluminación.** Tres capítulos abren con un render interior a sangre que se funde en negro (baño, terraza, dormitorio). Los renders RGBA de la maqueta y el despiece se ven sobre pozos de luz radiales, como objetos en un plató.
4. **Papel milimetrado.** Cada fondo claro lleva rejilla arquitectónica (48 px / 192 px) con máscara radial, marcas de recorte en las esquinas y, según el capítulo, numerales huecos enormes que llevan una cifra real de la página (5 entregables, 12 estancias, 4 requisitos, 5 pasos).
5. **Un solo acento.** Añil. En los capítulos negros el botón primario es añil vivo (#3652B8, blanco encima 6,7:1) con un resplandor del mismo tono; el resto del añil no cambia.

## 2. Mapa de ritmo (blanco / gris / negro)

Home (ES, `/`):

| # | Sección | Tono | Decoración clave |
|---|---------|------|------------------|
| 0 | Cabecera | negro | regla con marcas de 10/50 px, CTA añil con resplandor |
| 1 | Hero | blanco luminoso (grises 55/100/85 %) | reglas verticales en el margen, rejilla, plano de líneas de fondo al 6,5 %, luz cálida en la esquina, marco doble con sombra, corchetes de encuadre, tira de fases negra |
| 2 | Datos clave | negro | grano fino, rejilla, marco de hairline blanco, valores a 28 px |
| 3 | Del plano al 3D | gris «mesa» (#D4D8DC a #CACFD3) | rejilla, pozo de luz tras el comparador, texto fantasma «2D→3D», sombra larga |
| 4 | ¿Qué recibes? | negro | apertura con render del baño + luz cálida, «5» hueco, bento sobre pozos de luz con corchetes |
| 5 | ¿Cómo se convierte? | blanco lámina | numerales huecos 1 a 5, despiece sobre plató grafito dentro de la hoja blanca |
| 6 | La villa en 3D | negro | foco frío tras el visor, «12» hueco, plató radial, grano |
| 7 | ¿Para quién? | gris papel | 4 teselas fotográficas (una grande y tres apiladas), zoom lento al pasar el ratón |
| 8 | Precios | negro | apertura con render de la terraza (parallax), pack recomendado con borde y halo añil, importes a 64 px |
| 9 | Calculadora | negro (mismo capítulo) | widget con halo añil, total a 72 px |
| 10 | FAQ | gris papel | hoja blanca elevada con sombra, «?» hueco |
| 11 | Pide tu demo | negro | apertura con render del dormitorio (luz de las lámparas), formulario en tokens oscuros |
| 12 | Pie | negro abismo (#06080A) | «HOME VIEW 3D» como línea hueca a ancho completo |

Servicio (`/servicios/plano-2d-a-3d/`): hero claro con figura enmarcada · Datos clave negro · respuesta (papel) · comparador (mesa) · tarjeta de precio negra en hoja blanca · **lámina cinematográfica** negra a sangre con la terraza (parallax, letterbox) · tabla en hoja elevada (sus dos opciones marcadas) · proceso con numerales · requisitos en celdas (mesa) · respuesta con figura · dato clave negro · **cifra «11.727» a 17 rem** sobre negro + precios negros · aviso «≈» · FAQ en hoja · «sigue leyendo» (mesa) · CTA negro con render del salón y figura enmarcada · pie.

Las páginas interiores dejan de ser muros de texto: cada capítulo alterna tono, tiene figura enmarcada o tarjeta oscura en el lado vacío, y los huecos de la derecha los ocupan numerales, tarjetas de dato o imagen.

## 3. Inventario de decoración

| Recurso | Cómo | Dónde |
|---------|------|-------|
| Rejilla arquitectónica 48/192 px | 4 `linear-gradient` en una variable `--grid`, con `mask` radial | `.ch__d::after`, todos los capítulos |
| Marcas de recorte / corchetes | 8 `linear-gradient` (`--crop`, `currentColor`) | esquinas de cada capítulo (`.ch::before`) y de cada plató de imagen |
| Grano de película | SVG feTurbulence de 240 px (345 B) como fondo | capítulos negros |
| Fuga de luz cálida | `radial-gradient` con `--warm` | esquina superior de negros, hero (más suave en oscuro) |
| Pozo de luz | `radial-gradient` grises tras cada render | bento, despiece, visor, hero, figuras de interiores |
| Numerales / texto hueco | `content: var(--ghost) / ""` + `-webkit-text-stroke`, con alt vacío (no se lee) | `5`, `12`, `4`, `?`, `≈`, `2D→3D`, pasos 1 a 5, «HOME VIEW 3D» |
| Regla milimetrada | `repeating-linear-gradient` | borde de cabecera y margen izquierdo del hero |
| Plano de líneas de fondo | crop de `villa_plano_lineas` al 6,5 %, `filter: invert(var(--plan-invert))` en oscuro | hero (solo ≥ 768 px) |
| Fotos de apertura y teselas | fondos CSS de renders existentes, con velo en tablet y móvil | 3 aperturas, 4 teselas, CTA del servicio |
| Sombras largas tintadas | `box-shadow` del tono del fondo, sin negro puro | comparador, hero, FAQ, tabla, tarjetas |

## 4. Movimiento (motivado, sin JS)

- **Parallax de las aperturas y de la lámina:** `animation-timeline` con `view-timeline` de la sección, solo `transform`, ±44 px (o ±5 % con zoom 1,14 en la lámina). Explica profundidad y da ritmo al scroll. Con `prefers-reduced-motion: reduce` no existe (comprobado: `animation-name: none`).
- **Hover de bento y teselas:** zoom 1,035 a 1,05 con `--ease-out`, solo con `(hover: hover) and (pointer: fine)`.
- No hay bucles, marquees, ni scroll listeners. El hero conserva su animación original.

## 5. Coste en bytes

| Concepto | Bytes |
|----------|-------|
| `explore-C.css` fuente legible (con comentarios) | 19.903 |
| `explore-C.css` como se sirve (minificado y con tokens acortados por las mismas funciones del build) | 15.761 (gzip 4.211, **brotli 3.678**) |
| Referencia: `site.css` actual | 23.143 (brotli 5.603) |
| HTML añadido | +713 B en la home (11 `<i class="ch__d">` y clases), +1.007 B en el servicio |
| `grain.svg` | 345 (gzip 239) |
| Foto del plano de fondo del hero (`plano-800.avif`), única imagen decorativa antes de hacer scroll; no se pide bajo 768 px | 36.346 |
| Fotos decorativas, todas perezosas (se piden al acercarse la sección): baño 48.110, terraza 43.364, dormitorio 49.783, salón 49.050; teselas 23.002 + 18.153 + 31.168 | ≈ 292 KB en escritorio con toda la home recorrida; ≈ 150 KB en móvil (variantes de 800 px) |
| JS añadido | 0 |

Se comprobó con un listener de peticiones que, al cargar `/`, solo se piden `explore-C.css` y `plano-800.avif`; el resto llega al hacer scroll (la capa `.ch__d` usa `content-visibility: auto` porque el sitio observa `#contacto` y Chrome maquetaba esa sección desde el inicio).

## 6. Verificaciones hechas

- **Contraste, medido sobre píxeles:** en cada captura sin texto se muestrea el fondo real tras cada fragmento de texto (peor caso: el 8 % más claro para texto claro) y se compara con el color computado. Resultado: **0 textos por debajo de 4,5:1 (3:1 en ≥ 24 px)** en 8 combinaciones: home y servicio, 390 y 1440 px, claro y oscuro, más home a 768 y 1024 px. Script: `contrast.mjs` (usa `contrast-run.js`).
  Tres correcciones salieron de esa medición: velo oscuro sobre las fotos por debajo de 1280 px, tokens de texto propios en el gris «mesa» y más opacidad en las teselas pequeñas.
- **Sin scroll horizontal** de 320 a 2560 px en las dos páginas.
- Modo oscuro (`data-theme="dark"`) revisado: los capítulos claros pasan a las superficies oscuras del sitio y los negros a un escalón más profundo; el botón primario es el mismo añil vivo en todo el sitio.
- Navegación móvil (hoja de menú y barra de acciones) revisada: sigue funcionando, ahora en negro.
- Las capturas de página completa se hacen en tramos de 8.000 px y se unen (`stitch.mjs`): una sola captura de Chromium por encima de 16.384 px se repite.

## 7. Cómo se integraría en el código real

1. **Tokens** (`src/css/00-tokens.css`): mover aquí todos los literales de color de `explore-C.css` (COLOR-01): `--night #0C0F12`, `--night-2 #13171B`, `--abyss #06080A`, `--cta #3652B8`, `--cta-hi #4B68CE`, `--warm`, las opacidades blancas de hairline y los grises de los pozos de luz. El ámbito oscuro (`.ch--night`, `.ch--abyss`, cabecera, barra móvil, pie, tira del hero, teselas, tarjetas) redeclara los tokens del tema oscuro un escalón más profundo: en código real es un bloque `[data-tone="night"]` junto a los del tema, y se repite en los dos bloques oscuros (media y atributo) como ya hace el archivo.
2. **Nueva hoja** `src/css/25-chapters.css` con las secciones 0, 1, 2 y 3 de este CSS (capas, tonos, cabecera, pie, botón). Las secciones específicas van como módulos que ya soporta `build/lib/assets.mjs` (`@module chapters-open ch--open`, `@module tiles block--audiences`, `@module plate ch--plate`), de modo que cada página solo carga lo que usa. Estimación del núcleo: ≈ 3,7 KB brotli en todas las páginas, dentro del límite de CSS de PERF-02 (40 KB en total).
3. **Plantillas:**
   - `build/lib/components.mjs`, función `section()`: nueva opción `tone` (`hero | night | paper | sheet | mesa | abyss`) más `open`, `photo`, `ghost`; emite las clases `ch ch--…` y el `<i class="ch__d" aria-hidden="true"></i>`.
   - `build/templates/home.mjs` y `service.mjs` pasan el tono de cada bloque según la tabla del apartado 2 (el orden ya está en `HOME` y `SERVICE` de `apply.mjs`, con el índice de cada sección).
   - `build/lib/layout.mjs`: la cabecera, el pie y la barra móvil no cambian de marcado (solo de tokens). El `dateline` pasa a ser una franja oscura cuando sigue a un capítulo negro.
4. **Imágenes:** las fotos de apertura, teselas y el plano de fondo salen de `build/generated/images.json` (mismo pipeline, con hash). Aquí van como AVIF sueltos; en producción cada crop tendría AVIF + WebP con `image-set()` o, mejor, `<img loading="lazy">` dentro de la capa decorativa. El plano de fondo del hero debería cargarse con `<img loading="lazy" fetchpriority="low">` para no competir con el LCP.
5. **Plantilla de la lámina** (`ch--plate`): el `sizes` de su `<picture>` debe ser `100vw` (aquí sale la variante de 1200 px estirada a 1440 y se ve algo blanda) y su leyenda mantiene la etiqueta de render (IMG-03).
6. **Reglas del rulebook que se levantan por encargo del cliente** (dejar constancia en `DESIGN-RULEBOOK.md`): rejilla decorativa y marcas de recorte (SLOP-06), sombras, bandas oscuras y capítulos que invierten el tema (COLOR-08), texto sobre imágenes con velo (IMG-08, cuidando 4,5:1), grano (solo en negro) y numerales huecos. Se mantiene: un único acento, sin `#000` ni `#FFF` puros (el negro más profundo es #06080A), tipografía, formas de 0 y 2 px, animaciones solo con `transform` y `opacity`, sin JS, sin bucles.
7. **Copia nueva:** ninguna frase nueva. El texto hueco es de adorno y va con alt vacío: «2D→3D», «HOME VIEW 3D» (nombre de marca del pie, en `site.mjs`), y cifras que ya salen en la página. Si el nombre cambia, hay que leerlo de `brand.name` al generar el pie.

## 8. Riesgos y notas honestas

- La cabecera y el pie negros cambian la primera impresión del sitio entero: es la decisión más visible de esta dirección. Si el cliente los quiere claros, basta quitar `.site-header` y `.site-footer` del ámbito oscuro.
- Los numerales huecos usan `content: … / ""` (texto alternativo vacío). Firefox lo admite desde la 128; en versiones anteriores la declaración se ignora y el numeral simplemente no aparece.
- El parallax y los `view-timeline` requieren Chrome/Edge/Safari recientes; sin soporte, los fondos quedan quietos (fallback correcto).
- Los fondos de foto son AVIF sin WebP de respaldo; sin AVIF queda el negro del capítulo con su luz y rejilla, que sigue siendo legible.
- `explore-C.css` está escrito con los nombres de token legibles; `apply.mjs` lo pasa por `minifyCss`, `customPropAliases` y la inlinación de tokens del propio build, y comprueba que el mapa de alias coincide con el `site.css` de `dist/` antes de servirlo.
- No se han tocado `/precios/` ni la versión inglesa; el mismo plan de tonos se aplica añadiendo el índice de sus secciones a `PAGES` en `apply.mjs`.

## 9. Archivos

```
apply.mjs            construye dist-explore-C/
explore-C.css        la dirección (≤ 20 KB, legible)
assets/grain.svg     grano de película
capture-all.sh       reconstruye y rehace todas las capturas
shot.sh, stitch.mjs  captura de página completa por tramos
closeups.js          capturas de momentos clave con scroll real
contrast.mjs / contrast-run.js   medición de contraste sobre píxeles
finalize.mjs         convierte a JPEG y limpia
shots/               capturas (ver abajo)
```

Capturas en `shots/`:

- Página completa: `home-1440-light.jpg`, `home-390-light.jpg`, `home-1440-dark.jpg`, `service-1440-light.jpg`, `service-390-light.jpg`, `service-1440-dark.jpg`.
- Momentos clave (1440 × 900): `closeup-1-hero`, `closeup-2-entregables`, `closeup-3-visor`, `closeup-4-audiencias`, `closeup-5-precios`, `closeup-6-precios-packs`, `closeup-7-contacto`, `closeup-8-footer`, `closeup-svc-1-hero`, `closeup-svc-2-plate`, `closeup-svc-3-stat`, `closeup-svc-4-cta`.
- Antes: `before-home-1440.jpg`, `before-service-1440.jpg`.
