# Informe final · web del estudio 3D (integración, 29 sep 2026)

Estado: **la web está construida y pasa todo el QA automático**. Lo que falta para publicarla son datos y
decisiones del cliente (nombre, dominio, contacto, datos legales, precios) y las pruebas que solo se pueden
hacer con el dominio real y con móviles reales. La lista de lanzamiento está al final (§5).

Carpeta de salida: `dist/` (build limpio; se han borrado las carpetas `dist-*` de los agentes).

---

## 1. Qué contiene la web

### 1.1 Páginas

| | ES | EN | Total |
|---|---|---|---|
| Páginas HTML generadas | 38 | 30 | 68 (+ 2 páginas 404, una por idioma) |
| Indexables (cuando se quiten los datos provisionales) | 35 | 27 | 62 |
| Utilitarias, siempre `noindex` (gracias, AR, visor incrustado) | 3 | 3 | 6 |

Por plantilla (ES/EN): portada 1/1 · índices 4/2 · servicios 5/5 · soluciones por público 4/2 · caso de la villa
1/1 · cómo funciona 1/1 · precios 1/1 · zonas 3/1 · guías 8/6 · glosario 1/1 · preguntas frecuentes 1/1 · sobre
nosotros 1/1 · contacto 1/1 · gracias 1/1 · realidad aumentada 1/1 · visor incrustado 1/1 · legales 3/3.

Solo en español: índice de soluciones, arquitectos e interioristas, alquiler vacacional, índice de zonas, Málaga,
Costa del Sol, guía «plano 2D a 3D» y guía «vender sobre plano».

### 1.2 Funciones

- **Visor 3D** de la villa (model-viewer, GLB de 3,1 MB con Meshopt y WebP): imagen fija primero y modelo solo
  al pulsar «Ver la villa en 3D»; 12 estancias con cámara y ficha, recorrido guiado, vista general y planta,
  modo maqueta (corte a 1,15 m) y muros completos (2,60 m), luz, **Medidas** (cotas reales del modelo, se cargan
  solo al pulsar) y etiquetas numeradas de estancia.
- **Realidad aumentada sin app**: Quick Look en iPhone/iPad (USDZ 1:20 y tamaño real) y Scene Viewer en Android
  (GLB 1:20 y tamaño real), con QR para escritorio y página propia `/ar/villa/` (`noindex`).
- **Visor incrustable** (`/embed/villa/`) con código `iframe` para webs de agencias (`noindex, indexifembedded`).
- **Comparador plano 2D / render cenital** (misma cámara ortográfica), despiece animado del proceso, vídeo de la
  maqueta (clic para reproducir), calculadora de precio por volumen, tablas de precios generadas desde
  `pricing.mjs`, formulario de presupuesto en dos pasos (Netlify Forms, adjunto de plano, honeypot, UTM).
- **Renders**: 13 imágenes Cycles de la villa anonimizada (6 vistas aéreas, **4 interiores nuevos a la altura
  de los ojos**, planta cenital, planta de líneas e imagen para redes), en AVIF/WebP responsive y JPG para OG.
- **Modo oscuro** completo, diseño B2 «Plano», barra inferior en móvil («Pide tu demo»).
- **SEO/GEO**: JSON-LD por plantilla (ProfessionalService, Service con Offer, OfferCatalog, Article, 3DModel con
  5 codificaciones, VideoObject, HowTo, FAQPage, DefinedTermSet, ItemList, BreadcrumbList), hreflang ES/EN con
  `x-default`, `robots.txt` con Content-Signal, sitemaps (páginas, imágenes y vídeo), RSS ES/EN, `llms.txt`
  y `llms-full.txt` por idioma, espejo `index.md` de cada página indexable, IndexNow automático, `_headers` con
  CSP por *hash* y `_redirects` con 404 por idioma.

### 1.3 Cambios de esta integración

1. **Interiores a la altura de los ojos** (`villa_interior_salon`, `_dormitorio`, `_bano`, `_terraza`):
   - dados de alta en `IMAGES` de `build/validate-content.mjs` y `build/build.mjs`;
   - primeras 4 láminas de la galería del caso (ES/EN), con pie «Render 3D de la villa anonimizada» (todas las
     láminas de esa galería lo dicen ahora);
   - **renders inmobiliarios**: portada con el salón y galería de 6 (dormitorio, baño, la terraza desde arriba y
     a la altura de los ojos, salón-dormitorio y muros completos);
   - **home staging**: portada con el dormitorio y galería de 4 que enseña el mismo salón y la misma terraza a la
     altura de los ojos y desde arriba;
   - celda «Renders fotorrealistas» de la portada (`deliverables.mjs`), figura ancha de arquitectos e
     interioristas (dormitorio), portada de Málaga (terraza);
   - rotación de imágenes laterales y bandas (`ASIDE_IMAGES` en `blocks.mjs`): salón, terraza y dormitorio
     intercalados con las vistas aéreas. El baño queda fuera de las bandas a toda anchura por su encuadre;
   - el cielo y el mar de las ventanas se declaran **fondo ilustrativo** en las galerías del caso y de renders;
   - `villa.specs`: 13 imágenes en unos 21 minutos (antes 9 en 7), y los textos «(6 vistas aéreas, 4 a la altura
     de los ojos, las dos plantas y la imagen para redes)» en caso, precios y guía de precios de render;
   - `CONTENT-SCHEMA.md` §6 reescrito (tabla de claves y dónde se usa cada grupo) y CLIENT-CONFIRMATIONS §5.
2. **Sin imágenes repetidas en una misma página**: las imágenes laterales saltan cualquier render que la página ya
   ponga en portada, figuras o galerías, y la banda de cierre elige el primer render que la página no enseña (en el
   caso, que los enseña todos, la banda queda solo con texto). Quedan repeticiones intencionadas: el recorte de la
   maqueta en la portada de la home y su celda del bento, el comparador y la celda del visor, y las miniaturas
   decorativas de los enlaces AR.
3. **Precios**: la segunda columna de tramos dice «De 151 a 300 m²» / "151 to 300 m²" en las tablas visibles,
   igual que el Markdown y el schema.
4. **Caso**: «≈ 75 m² interiores y ≈ 28 m² de terrazas» ya no se parte entre número y unidad.
5. **Guías con plano vertical**: la portada de «cuánto cuesta un plano 3D» (ES/EN) medía unos 1.380 px de alto en
   escritorio; ahora se limita a 640 px dentro del fondo de escenario, sin salto de maquetación al cargar.
6. `build/build.mjs` lee los presupuestos de `BUDGETS` (`build/lib/machine.mjs`), igual que el QA y el *design lint*.
7. README: nota del fundador al día («Revisado por …» ya existe).

---

## 2. Resultados del QA (build limpio en `dist/`)

| Comprobación | Resultado |
|---|---|
| `npm run build` | 68 páginas + 2 × 404, **0 avisos**; 26 paquetes CSS |
| `npm run check` | **0 errores**, 5 avisos, todos de lanzamiento (datos provisionales de `site.mjs`, precios sin confirmar, dominio de ejemplo, 36 marcadores `[…]` en 8 ficheros legales y el teléfono de ejemplo en 18 ficheros) |
| `node scripts/design-lint.mjs dist` | **0 errores, 0 avisos** |
| `node build/validate-content.mjs` | 35 ficheros, **0 errores, 0 avisos** |
| `node scripts/geo-harness.mjs` | sale con 0: todas las aserciones unitarias pasan |

Presupuestos (§11 de BUILD-SPEC):

| Presupuesto | Valor | Límite | Página |
|---|---|---|---|
| HTML sin comprimir (la más pesada) | 67,0 KB | 72 KB | caso de la villa |
| HTML brotli q11 (la más pesada) | 14,4 KB | 16 KB | portada |
| CSS común | 24,4 KB | 25 KB | `site.css` |
| CSS total por página | 43,5 KB | 45 KB | portada EN |
| Hojas que bloquean el pintado | 2 | 2 | todas |
| JS inicial de la portada | 27,4 KB | 30 KB | |
| Fuentes | 60,3 KB | 110 KB | |
| Imagen LCP de la portada (AVIF 1200 w) | 50,0 KB | 150 KB | |

Margen justo: la hoja CSS común (0,6 KB libres) y el brotli de la portada si el CDN comprime a calidad 5 (15,8 KB).

### 2.1 Lighthouse móvil

Lighthouse 13.5.0 (copia local ya instalada, sin descargar nada), Chromium 1228 de Playwright en modo
`--headless=new`, perfil móvil con throttling simulado, servidor local `build/serve.mjs` (brotli, `_headers`).

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|
| `/` | **99** | **100** | **100** | 69* | 1,4 s | 2,0 s | 10 ms | 0 | 1,4 s |
| `/casos/villa-costa-del-sol/` | **99** | **100** | **100** | 69* | 1,4 s | 2,1 s | 0 ms | 0 | 1,4 s |

\* El SEO baja solo por `is-crawlable`: mientras haya datos provisionales todas las páginas salen con
`noindex`, a propósito. En una copia idéntica sin `noindex` las dos páginas dan **SEO 100**. Peso transferido:
152 KB en 10 peticiones (portada) y 169 KB en 11 (caso); ninguna petición del visor ni del GLB.
Informes completos: `docs/qa/final/lighthouse/` (HTML y JSON).

### 2.2 Verificación visual (playwright-cli, sesión `integrate`, `node build/serve.mjs 8861 dist`)

34 capturas en `docs/qa/final/integrate/`, revisadas una a una: portada a 375 y 1440 en claro y oscuro (página
completa), caso (imagen fija, visor cargado y Medidas, a 375 y 1440), renders, home staging, precios, arquitectos,
comparativa de estudios, guía de precio del plano en ES y EN, contacto (375 y 1440), y el visor incrustado a
375×560 y 1280×560 antes y después de cargar.

- **0 errores de consola** en todas las páginas y estados; 0 imágenes rotas; 0 desbordamientos horizontales.
- **Visor**: la cámara en vivo coincide con la imagen fija (`-32deg 50deg 96%`); el modelo no se recorta en ningún
  tamaño, tampoco con Medidas ni en vista de planta. El incrustado no hace *scroll* interno (560 px) antes ni
  después de cargar; en 375 px la barra de herramientas se desliza en horizontal, por diseño.
- **Nada del visor antes de la intención**: al cargar cualquier página no se pide model-viewer ni el GLB; en móvil
  tampoco al hacer *scroll*. En escritorio (puntero fino, ≥ 1024 px, 4G) la librería se precarga tras el primer
  *scroll* con el visor a la vista (política P1-A); el GLB (`/models/villa.glb`) solo se pide al pulsar.
- **Datos provisionales**: la barra inferior muestra solo «Pide tu demo», y no hay enlaces `wa.me` ni `tel:` en
  ninguna página revisada.

---

## 3. Pendiente conocido (no bloquea el QA)

- **Teléfono de ejemplo en el texto**: los enlaces de llamada y WhatsApp están ocultos, pero el texto de contacto,
  preguntas frecuentes, sobre nosotros y aviso legal sigue escribiendo «+34 600 000 000» (tokens `{{phone}}` y
  `{{whatsapp}}`). Desaparece al rellenar `site.mjs`.
- **Comparativa «mejores estudios»**: necesita la revisión legal de publicidad comparativa y los compromisos de
  CLIENT-CONFIRMATIONS §14 antes de publicarse.
- **Interiores**: el mar de las ventanas es ilustrativo (lo decide el cliente en CLIENT-CONFIRMATIONS §5). El baño,
  de 1,6 m de ancho, deja el lavabo cortado; solo se usa en galerías.
- **Del plan D-08 falta**: una captura real del visor para la celda «Visor 3D» del bento, una captura de Quick Look
  en iPhone y el salón con un segundo estilo de mobiliario para home staging.
- Lighthouse se ha medido en local; hay que repetirlo sobre el dominio real (§5).

---

## 4. Documentos de referencia

`README.md` (build, despliegue y lanzamiento) · `docs/qa/content/CLIENT-CONFIRMATIONS.md` (decisiones del
cliente, §1 a §14) · `docs/build/BUILD-SPEC.md` · `docs/build/CONTENT-SCHEMA.md` · informes de QA en `docs/qa/`.

---

## 5. Lista de lanzamiento

### 5.1 Datos que bloquean el lanzamiento

- [ ] `build/data/site.mjs` (README §1.1): nombre y logo, dominio definitivo (con o sin `www`), email, teléfono y
      WhatsApp, localidad y provincia, razón social, NIF, domicilio y registro, frase canónica ES/EN, perfiles
      `sameAs`, fundador (activa el autor real y «Revisado por …»). Después, todos los `placeholder` a `false`.
- [ ] `build/data/pricing.mjs` (README §1.2): precios, tramos, extras, plazos, rondas, pack cartera y fechas de
      validez aprobados → `confirmed: true`.
- [ ] CLIENT-CONFIRMATIONS §1 a §12: identidad y datos legales, precios, qué incluye cada pack, plazos, entregables
      (BLEND, 4K, etiquetado, datos de la villa e interiores), pago, demo gratis, alojamiento del visor, derechos de
      uso, atención, cobertura y uso de IA.
- [ ] CLIENT-CONFIRMATIONS §13: volver a comprobar los datos de terceros y cambiar la fecha «consultado el …» si
      la web sale más tarde; revisión legal de la guía de venta sobre plano.
- [ ] CLIENT-CONFIRMATIONS §14: revisión legal y compromisos de la comparativa de estudios (o no publicarla).

### 5.2 Comprobación local

- [ ] `npm run qa` → 0 errores.
- [ ] `CONTEXT=production npm run check` → 0 errores (los datos provisionales pasan a ser errores).

### 5.3 Netlify (README §3 y §4)

- [ ] Importar el repositorio (`netlify.toml` fija build, Node 24, funciones y *edge function*). Sin cabeceras ni
      redirecciones en la interfaz.
- [ ] `ALLOW_PLACEHOLDERS=1` solo si se publica una vista previa antes del lanzamiento; **borrarla el día del
      lanzamiento**.
- [ ] Dominio y HTTPS; la versión principal igual que `site.domain`.
- [ ] `node scripts/geo-harness.mjs --live <url de la vista previa>` → 0 fallos, y las comprobaciones `curl` del
      README (301 con barra final, Markdown por `Accept`, 404 por idioma, CSP, MIME de GLB y USDZ, cabeceras del
      incrustado).
- [ ] Consola abierta en la portada y el caso: 0 errores de CSP; el visor carga con texturas y los modos
      maqueta y muros completos funcionan.
- [ ] Formularios: detección activada, aviso por email al correo del estudio, envío real con un PDF pequeño que
      llega por email y redirige a `/gracias/` (y `/en/thanks/`), campos ocultos y «¿Cómo nos conociste?».

### 5.4 Realidad aumentada en dispositivos reales

- [ ] iPhone con Safari (Quick Look): maqueta 1:20 sobre la mesa y tamaño real; escala, texturas y corte;
      desde el QR del caso y desde la página `/ar/villa/`.
- [ ] Android con ARCore (Scene Viewer): GLB 1:20 y tamaño real, mismas comprobaciones.
- [ ] Navegadores dentro de apps (WhatsApp, Instagram, LinkedIn): la web muestra el aviso «abre esta página en Safari o en Chrome»; comprobar que se entiende.
- [ ] Guardar una captura de Quick Look para la web (pendiente D-08).

### 5.5 Indexación y presencia (README §5 a §9)

- [ ] Google Search Console: propiedad de dominio (TXT), enviar `sitemap.xml`, pedir indexación de portada ES y
      EN, los 5 servicios, precios, caso, cómo funciona y contacto. No activar exclusiones de funciones de IA.
- [ ] Bing Webmaster Tools: importar desde Search Console; primer envío completo por IndexNow con
      `npm run indexnow -- --all` (revisar) y `npm run indexnow -- --all --submit`. Después es automático en cada
      deploy de producción (`netlify/functions/deploy-succeeded.mjs`).
- [ ] Brave Search: enviar portada, servicios, precios y caso.
- [ ] Google Business Profile como negocio de área de servicio, Bing Places y Apple Business Connect con los
      mismos datos; directorios y perfiles (LinkedIn, YouTube, Sketchfab, Behance, Clutch, Sortlist…), cada URL a
      `site.sameAs` y nuevo deploy.
- [ ] Lighthouse móvil sobre el dominio real (objetivo ≥ 95 rendimiento, 100 SEO y accesibilidad) y axe en una
      página de cada plantilla.
- [ ] Panel mensual de *prompts* GEO (README §10).
