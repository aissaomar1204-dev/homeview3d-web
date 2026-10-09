# Rediseño de homeview3d.com · Fase 1: la portada

Trabajas en el repositorio `aissaomar1204-dev/homeview3d-web` (web estática en Node, publicada en Netlify). Objetivo: una portada más corta, con nuestra propia casa y nuestros proyectos, sin romper nada de lo que ya funciona (rendimiento, SEO, accesibilidad, español e inglés). Haz SOLO la fase 1. La fase 2 está al final como contexto: no la empieces.

El antiguo reglamento de diseño (`docs/design/DESIGN-RULEBOOK.md`) se ha eliminado. Si en el código o en `docs/build/` ves referencias a sus reglas (IMG-01, C5, O3…), son históricas: no obligan.

## 0. Antes de tocar nada
1. `git checkout main && git pull`, crea la rama `salva/rediseno-portada`, `npm ci`.
2. `npm run qa` debe salir con 0 errores ANTES de cambiar nada. Si falla, para y avísame.
3. Lee: `docs/rediseno/README.md`, `docs/build/BUILD-SPEC.md` (§6, §11 y §12), `docs/build/CONTENT-SCHEMA.md` (§3, §6 y §9), `build/content/home.mjs`, `build/templates/home.mjs`, `build/lib/blocks.mjs`, `build/lib/chapters.mjs` y `source/villa3d/blender/hero/README.md`.
4. Mide la situación de partida con `npm run preview` a 1440×900: `document.documentElement.scrollHeight` de la portada (hoy unos 15.145 px). Apúntalo para el PR.

## 1. Qué se ha decidido (tablero de ideas, 9 oct 2026)
- **Para hacer (fase 1):** portada con nuestra propia casa · sección «Proyectos» con dos casos · WhatsApp siempre visible · portada a la mitad de alto.
- **Entra también en la fase 1:** «Dos caminos» (agencias y promotoras), porque sustituye al bloque de públicos que sale de la portada y mantiene los enlaces internos a `/soluciones/`.
- **Descartado (no hacer):** showreel en vídeo y testimonio de Jurgita.
- **Sin decidir (no hacer):** revelado de renders en arco.

## 2. Reglas de trabajo
- **Honestidad:** cada imagen dice lo que es. Las de Blender: «Render 3D». Las retocadas con IA: «Imagen retocada con IA a partir del render 3D». Benahavís es un **proyecto de demostración**, no un cliente: no inventes clientes, testimonios ni contadores. Nunca muestres los precios ni los estados de las casas de Benahavís (son de ejemplo).
- **Bilingüe:** todo cambio de texto va en `es` y en `en` en el mismo commit.
- **Mantén el sistema que ya existe:** colores solo desde `src/css/00-tokens.css`, tipografías Archivo y Geist Mono, sin paquetes nuevos, sin rayas (— y –) en los textos y textos fuera de las imágenes (pie debajo).
- **Las comprobaciones automáticas siguen activas** (`npm run qa`, `npm run validate`, `npm run lint:design`). Si una bloquea algo que hemos decidido aquí, cambia solo esa comprobación en `scripts/design-lint.mjs` o en `build/check.mjs` y explícalo en el PR. No las desactives enteras.
- No toques `build/data/pricing.mjs` ni los datos legales. No hagas merge a `main` ni despliegues a producción.

## 3. Tareas de la fase 1 (en este orden, un commit por tarea)

### T1. Imágenes de Benahavís
- Origen: repositorio `2002salvarito-wq/realstate`, rama `comunidad-benahavis`.
  - **Para la web, las retocadas con IA (Nano Banana)**, que lucen más: `ComunidadBenahavis/imagenes/renders_ia_modelo3d/` (JPG): `10_aerea`, `01_jardin_piscina`, `00_fachada_calle`, `03_salon_cocina`, `02_azotea`.
  - **Para el interruptor día/noche (fase 2), las de Blender**, porque son la misma cámara y coinciden al píxel: `ComunidadBenahavis/modelo3d/renders/01_jardin_piscina.png` y `11_jardin_noche.png`.
- Antes de usar cada imagen de IA, compárala con su render de Blender (`modelo3d/renders/`, mismo nombre). La IA a veces inventa detalles: en `01_jardin_piscina` añadió muros de piedra en la planta baja que no están en el proyecto. Si una imagen enseña algo que el proyecto no tiene, usa la de Blender.
- `scripts/images.mjs` solo lee PNG de `source/villa3d/renders/`: convierte los JPG a PNG y guárdalos con el prefijo `benahavis_` (por ejemplo `benahavis_10_aerea.png`). Copia también las dos de Blender como `benahavis_01_jardin_piscina_blender.png` y `benahavis_11_jardin_noche_blender.png`.
- `npm run images` (genera AVIF/WebP y `build/generated/images.json`).
- Añade las claves nuevas a la lista `IMAGES` en `build/validate-content.mjs` **y** en `build/build.mjs` (deben coincidir) y documéntalas en `docs/build/CONTENT-SCHEMA.md` §6.
- Alt y pie en `build/data/plates.mjs`. El comprobador exige que el pie contenga la palabra «render».
  - IA, ES: «Imagen retocada con IA a partir del render 3D del proyecto de demostración Residencial Benahavís.»
  - IA, EN: "AI-enhanced image from the 3D render of the Residencial Benahavís demo project."
  - Blender, ES: «Render 3D del proyecto de demostración Residencial Benahavís.»
  - Blender, EN: "3D render of the Residencial Benahavís demo project."

### T2. Portada con nuestra propia casa
- La villa del hero no es nuestra. Se sustituye por la **casa tipo B de Benahavís** (casa 4, la que no está en simetría), en **planta baja**: salón, comedor y cocina de 72,4 m², garaje de 17,6 m², aseo y núcleo de escalera y ascensor.
- Mismo contrato que hoy (lee el README del hero): 48 fotogramas RGBA 14:9 de 1400×900, `hero_plan_lines.png` registrado al píxel con el fotograma 0, `hero_points.json` con la línea de tiempo y los puntos proyectados, mismas cuatro fases (Plano, Muros, Mobiliario, Luz). El último fotograma tiene que ser idéntico al still final para que no haya salto.
- Escena: adapta `source/villa3d/blender/hero/hero_frames.py` al modelo de Benahavís (`ComunidadBenahavis/generador/m3d_build.py` genera `modelo3d/comunidad_benahavis.blend`). Deja solo la casa 4 y su parcela: suelos (`*_Suelo_*`), muros (`Muros_fachada`, `Tabiques`, `Medianeras` y carpintería) y mobiliario (`Mob_*` y los muebles IA instanciados). Si ya tienes el modelo hecho, encájalo en este contrato.
- Los fotogramas salen de Blender (es una animación del modelo, no de la IA). Renderízalos en el PC con gráfica NVIDIA, no en un portátil (la villa tardó 17,5 min en una RTX 4060). Luego `node scripts/hero-frames.mjs`.
- Textos del cajetín del hero (`build/data/ui-hero.mjs`, ES y EN): obra «Casa tipo B, Benahavís (proyecto de demostración)». Las cifras no se escriben ahí: créalas en un archivo de datos `build/data/casa-b.mjs`, igual que `villa.mjs`.
- Mantén el hero con el texto a la izquierda y el dibujo a la derecha, el plano de líneas como imagen principal ligera (≤ 80 KB en móvil y ≤ 150 KB en escritorio) y que el H1, la entradilla y el botón se vean sin hacer scroll a 1440×900 y a 375×667.
- El visor de `#demo` sigue siendo la villa (caso real).

### T3. Sección «Proyectos» (bloque nuevo `projects`)
- Datos en `build/data/projects.mjs` (ES y EN) con dos proyectos:
  1. **Villa Costa del Sol**, «Caso real (anonimizado)». Imagen `villa_interior_salon`, cifras de `build/data/villa.mjs` (tokens, nunca a mano), enlace a la página del caso (`@caso-villa`).
  2. **Residencial Benahavís**, «Proyecto de demostración». Imagen `benahavis_10_aerea`. Datos: 11 viviendas adosadas, 4 plantas, 358,9 m² construidos por vivienda, 2,39 ha. Sin enlace por ahora: deja un campo `demoUrl: null` y, si es `null`, no pintes botón.
- Diseño: dos tiras verticales en reparto 7/5, imagen recortada en vertical en escritorio y 16:9 en móvil, pie debajo de la imagen y un mini cajetín (`<dl>`) con 3 o 4 datos debajo del pie.
- Regístralo como hacen los demás bloques: renderizado en `build/lib/blocks.mjs`, tono en `CHAPTERS` de `build/lib/chapters.mjs` (banda oscura `k`; que no repita tono con sus vecinos o falla la comprobación), validación en `build/validate-content.mjs`, fila en CONTENT-SCHEMA §3 y CSS en un módulo nuevo siguiendo el patrón de `56-cards.css`.
- Va en la portada justo después del cajetín.

### T4. Portada a la mitad de alto
- Nuevo orden de `build/content/home.mjs` (ES y EN): hero → cajetín (máximo 5 datos; se queda «Desde») → `projects` → `deliverables` → `viewer` (#demo) → `paths` (T5) → `pricing` (excerpt) → `faq` (5 preguntas) → `contactForm`.
- Salen de la portada: `compare`, los dos `plate`, `process` (despiece), `audiences` y `calculator`. Siguen existiendo en `/como-funciona/`, `/precios/`, `/soluciones/` y el caso. Comprueba que nada enlaza a anclas que desaparecen (busca `#` en `build/content`).
- FAQ de la portada: precio, plazo, qué necesitáis, realidad aumentada sin app y confidencialidad. Las demás siguen en `/preguntas-frecuentes/`.
- Actualiza el comentario de cabecera de `home.mjs` y el orden de la portada en BUILD-SPEC §6.
- **Objetivo medible:** `scrollHeight` ≤ 7.500 px a 1440×900. Si te pasas, compacta `deliverables` sin cambiar su contenido.

### T5. «Dos caminos» (bloque nuevo `paths`, sustituye a `audiences` en la portada)
- Dos tarjetas con imagen y un enlace cada una:
  - **Agencias** → `@sol-inmobiliarias`: del plano al 3D, precio cerrado ({{price:plano3d}}), en {{delivery:maqueta}}.
  - **Promotoras** → `@sol-promotoras`: maqueta 3D, renders, visor y realidad aumentada de la promoción, presupuesto a medida.
- Promete solo lo que ya figura en servicios y precios. La visita 360° está como «próximamente» (`build/data/deliverables.mjs`) y el recorrido libre no aparece en ningún servicio: no los anuncies aquí.
- Mismo registro que T3 (CHAPTERS, validación, CONTENT-SCHEMA, CSS).

### T6. WhatsApp siempre visible
- En móvil ya está en la barra inferior (`bottomBar` en `build/lib/layout.mjs`). Falta en escritorio (≥ 768 px): un botón fijo abajo a la derecha.
- Reutiliza lo que ya hay: `ctx.whatsappUrl()`, la clase `btn btn--neutral`, el icono `ctx.icon('chat')`, el texto `cta.whatsappShort` y el `aria-label` `cta.whatsapp`. Solo si `ctx.directContact` es verdadero.
- Se oculta en los mismos casos que la barra móvil: cuando están a la vista `.form-section`, `[data-footer]` o `[data-hero-actions]` (reutiliza ese IntersectionObserver de `src/js/main.js`, no crees otro).
- `z-index: var(--z-sticky)`, objetivo táctil de 44 px, mismo color neutro que el resto de botones (sin el verde de WhatsApp), sin animaciones si hay `prefers-reduced-motion`. No puede tapar los controles del visor ni el aviso de cookies.

## 4. Comprobación (todo en verde antes del PR)
- `npm run qa`, `npm run validate` y `npm run lint:design`: 0 errores.
- `npm run preview`: capturas de la portada en ES y EN a 375×667 y 1440×900, en claro y oscuro.
- `scrollHeight` de la portada a 1440×900 ≤ 7.500 px.
- Lighthouse móvil ≥ 95 en todas las categorías en la portada y en una página de servicio (BUILD-SPEC §12).
- Consola sin errores; el visor carga al pulsar y el corte funciona; la animación del hero se reproduce una vez y con «reducir movimiento» se ve el estado final.
- Ningún enlace interno roto.

## 5. Entrega
- PR de `salva/rediseno-portada` a `main` titulado «Rediseño de la portada, fase 1».
- En la descripción: qué hace cada tarea, comprobaciones que hayas cambiado y por qué, alto de la portada antes y después, puntuaciones de Lighthouse y las capturas.
- No lo mezcles: lo revisamos Álvaro y tú antes.

## 6. Fase 2 (solo contexto: NO empezar sin el visto bueno de la fase 1)
- Tarjeta flotante «Entra en la casa» en el hero, con miniatura de la demo.
- Portada en una frase: entradilla de 12 palabras como máximo.
- Página por proyecto, por ejemplo `/casos/residencial-benahavis/` (antes hay que decidir si lleva visor propio o enlaza al showroom).
- Explorador de entregables (showroom web, visita 360°, recorrido 3D, AR, Google Earth y renders) con la demo real al lado, en lugar del bento actual.
- «Ver en 3D» fijo en la cabecera (la cabecera tiene sitio para 5 enlaces: habría que pasar «Cómo funciona» al pie).
- Enlace a la demo de Benahavís en Netlify (pide la dirección a Aissa: es interna y no debe aparecer en este repositorio público) cuando Álvaro y Aissa la aprueben para clientes.
- Interruptor día/noche con `benahavis_01_jardin_piscina_blender` y `benahavis_11_jardin_noche_blender` (misma cámara), con fundido en `--dur-reveal`.
- Cifras propias (solo datos verificables de `build/data`).
- Formulario «Sube tu plano» (comprobar que el formulario de Netlify acepta el archivo).
- Más bandas oscuras a sangre, con los tonos `k` y `c` del motor de capítulos.

## 7. Datos de referencia
- **Casa tipo B (Benahavís):** 358,9 m² construidos, 291,5 m² útiles, parcela de 256 m², 4 plantas (sótano, baja, primera y azotea con solárium de 90,3 m²), 3 dormitorios, 3 baños y aseo, garaje para 2 coches, piscina privada y ascensor.
- **Comunidad:** 11 viviendas en 2,39 ha.
- **Fuentes:** `ComunidadBenahavis/datos/casas.json`, `ComunidadBenahavis/modelo3d/QA_medidas.md`, `ComunidadBenahavis/modelo3d/renders/` e `ComunidadBenahavis/imagenes/renders_ia_modelo3d/`, en `2002salvarito-wq/realstate`, rama `comunidad-benahavis`.
- **Análisis, referencias y estado del tablero:** `docs/rediseno/README.md`. Tablero vivo: https://claude.ai/artifact/UDyxESa4QnbJ1wyHFFyJRD
