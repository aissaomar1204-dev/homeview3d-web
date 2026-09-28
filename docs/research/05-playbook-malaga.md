# 05 · Playbook técnico heredado de malagatransfer: qué reutilizar, qué adaptar y qué mejorar

> Fecha: 2026-09-28 · Fuente: `E:\AnubisAI\Claude\Webs\transfermalaga\malaga-premium-transfers` (web en producción, bookmalagatransfer.com) y `E:\AnubisAI\Claude\Webs\transfermalaga\Resources\` (documentos de planificación).
> Método: lectura completa de `build/` (build, check, serve, images, lib, data y templates), `js/main.js`, `assets/css/site.css` (por encima), `netlify.toml`, `netlify/_headers`, `netlify/functions/reviews.mjs`, `.htaccess`, `docs/*.md` y de una página generada (`dist/es/transfer-aeropuerto-malaga-marbella/index.html`). **Build y QA ejecutados** sobre una copia en el scratchpad: 46 páginas + 404, 48 URLs en el sitemap, `check.js` con 0 errores y 26 avisos. También se escribió y ejecutó un **prototipo de los checks nuevos** contra ese `dist/`. Los hallazgos marcados con **[medido]** salen de esa ejecución.
> Complementa a `04-geo-2026.md`, que ya define robots.txt, llms.txt, espejos Markdown, IndexNow y la matriz de schema. Aquí no se repite: se enlaza.

---

## 0. Resumen ejecutivo (TL;DR)

1. **La arquitectura se reutiliza tal cual**: generador estático en Node **sin dependencias** (`data → lib/html.js → templates → build.js → dist/ → check.js → Netlify`). Cada plantilla es una función pura `(item, lang) → { path, html }`, los textos viven en ficheros de datos bilingües `{ es, en }` y el build registra cada página para generar sitemap, llms.txt y hreflang. Es rápida (menos de 1 s), auditable y no tiene *lock-in*.
2. **Hay que generalizarla en cuatro puntos**: (a) de 2 idiomas fijos (`alt = lang === 'en' ? 'es' : 'en'`) a **N idiomas con mapa de alternativas**, con ES en la raíz y EN en `/en/`; (b) **hash de contenido en los nombres de fichero** en lugar de `?v=FECHA`, porque hoy hay un fallo real de caché; (c) un **manifiesto de imágenes** (AVIF + WebP y dimensiones reales) en vez de la lista fija de `images.js`; (d) un **manifiesto de hashes por página** para que `lastmod` y `dateModified` sean veraces, ya que hoy cambian en cada build.
3. **Lo mejor que tiene en SEO y GEO** son las URLs reales por idioma con `hreflang` recíproco (**verificado [medido]**: 0 fallos) y un sitemap con `xhtml:link`, el `@graph` JSON-LD con `@id` estables, FAQ autocontenidas con cifras, el bloque «Datos clave» (`<dl>` + párrafo resumen), `llms.txt` generado desde los datos, un 404 real sin *catch-all* y `pretty_urls = false` para no duplicar URLs.
4. **Fallos concretos que NO debemos heredar [medido]**: contraste de **2,6:1** en `.label`, `.muted`, `.small`, `.fact dt` y el pie (30 usos de `--grey-3`, cuando AA exige 4,5:1); `aria-label` en inglés («Menu», «Language», «Main», «Breadcrumb») en las páginas en español; salto de encabezado h1 → h3 en el hub; imagen del CTA sin `width` ni `height` en las 46 páginas; `Article` sin `image`; grupos de robots.txt que **no heredan** el `Disallow: /api/` (ver 04 §3.2); **Netlify no ejecuta `check.js`**, así que el QA no bloquea el deploy.
5. **Rendimiento mejorable**: Google Fonts bloqueando el render (Inter en 5 pesos, de terceros, con riesgo RGPD), 41 KB de CSS sin minificar, **138 KB de JS** en todas las páginas (GSAP + ScrollTrigger + SplitText + main), unos 16 KB de SVG en línea repetidos en cada página (47 SVG en la home; el trazado de WhatsApp, de 1,3 KB, se repite 6 veces), 77 KB de HTML en la home y 14 KB de JSON-LD. El sistema de *reveal* oculta el H1 del hero hasta que cargan GSAP **y** las fuentes, lo que supone riesgo de parpadeo y de LCP.
6. **Lo que es nuevo en nuestro proyecto y no existía en Málaga**: `<model-viewer>` (pesado, **solo bajo demanda**), ficheros GLB y USDZ (tipos MIME, CORS, caché *immutable*, presupuesto de MB), una **ruta `/embed/` que se pueda incrustar en iframe en los portales** (es incompatible con el `X-Frame-Options: SAMEORIGIN` global de Málaga), un formulario B2B de captación (Málaga solo tenía WhatsApp), analítica (Málaga no medía nada) y páginas de E-E-A-T (Málaga no tenía «sobre nosotros» y dejó los datos legales sin rellenar).
7. **Lección de la metodología**: en Málaga se planificó con CSV de keywords, árbol de arquitectura, copy por página, FAQ GEO y prototipo HTML, pero **los documentos se desviaron de lo que se construyó**: precios distintos (68 € frente a 70 €), idioma raíz invertido, anidamiento de URLs y 6 tipos de página planificados que no se hicieron. Además, el copy incluía **testimonios inventados**. En este proyecto, **los ficheros de datos son la única fuente de verdad desde el primer día** y los documentos se generan a partir de ellos o los citan.

---

## 1. Arquitectura del generador

### 1.1 Flujo

```
build/data/*.js ─────────┐   (contenido bilingüe {en, es}, precios, FAQ, slugs; validado al cargar)
build/data/ui.js ────────┤   (cadenas de interfaz por idioma)
build/data/site.js ──────┤   (NAP, dominio, idiomas, locales, Google IDs)
                         ▼
build/lib/html.js  ──►  layout() + componentes (secHead, picture, priceTable, sectionFaq…) + schema (businessSchema, serviceSchema…)
                         ▼
build/templates/*.js ──►  renderHome(lang) / renderDestination(d, lang) / renderHub / renderArticle / renderNotFound
                         ▼            cada una devuelve { path, html }
build/build.js  ──►  1 limpia dist/ y copia assets/, js/, lib/ y los legales
                     2 escribe las páginas y las registra en pages[] {path, lang, alt, priority, changefreq}
                     3 sitemap.xml con xhtml:link (en, es, x-default)
                     4 robots.txt   5 llms.txt (desde los datos)   6 site.webmanifest   7 copia _headers
                         ▼
build/check.js  ──►  QA sobre dist/ (exit 1 si hay errores)
build/serve.js  ──►  vista previa local que imita a Netlify (barra final, 404 real, stub de /api/reviews)
netlify.toml    ──►  command = "node build/build.js", publish = "dist"  (⚠ no ejecuta check.js)
```

Principios que merece la pena conservar:

- **Cero dependencias en tiempo de build.** `sharp` (imágenes) y `gsap` son devDependencies que solo se usan en local. En Netlify se instala con `NPM_FLAGS = "--omit=dev"` y las imágenes optimizadas se suben al repositorio.
- **Contrato de plantilla** sencillo y testeable:

```js
// build/templates/destination.js (patrón)
module.exports = function renderDestination(d, lang) {
  const path = H.pathFor('dest', d, lang);
  const altPath = H.pathFor('dest', d, lang === 'en' ? 'es' : 'en');   // ← generalizar a N idiomas
  const content = `…secciones…`;
  const schema = [H.businessSchema(lang), H.websiteSchema(lang), H.webPageSchema(lang, {…}),
                  H.breadcrumbSchema(crumbs), H.serviceSchema(d, lang, path), H.faqSchema(d.faq[lang])];
  return { path, html: H.layout({ lang, path, altPath, title, desc, schema, bodyClass: 'page-dest', content }) };
};
```

- **Validación temprana de los datos** (`build/data/destinations.js`): el build falla si falta un campo por idioma, si hay un `id` duplicado o si `related` apunta a un id inexistente, y avisa cuando el `title` pasa de 70 caracteres o la descripción de 165. **Este patrón hay que llevarlo a todas las colecciones.**
- **Registro de páginas** (`add()` en build.js): cada página escrita queda en `pages[]` y de ahí salen el sitemap y el llms.txt. **Nada se lista a mano**, salvo los legales.
- **JSON-LD seguro**: un único `<script type="application/ld+json">` con `@graph`, escapando `<`:

```js
const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': schema }).replace(/</g, '\\u003c');
```

### 1.2 Qué reutilizar tal cual, qué adaptar y qué descartar

| Fichero / función | Veredicto | Notas para el nuevo proyecto |
|---|---|---|
| `build/serve.js` | **Tal cual** + tipos MIME | Añadir `.glb` (`model/gltf-binary`), `.gltf` (`model/gltf+json`), `.usdz` (`model/vnd.usdz+zip`), `.ktx2` (`image/ktx2`), `.avif`, `.mp4`, `.webm`, `.md` (`text/markdown; charset=utf-8`), `.wasm` y `.hdr`. Añadir un stub de `/api/lead` como el de `/api/reviews`. Soporte de `Range` para vídeo (opcional). |
| `build.js`: `rmrf`, `copyDir`, `writePage`, patrón `add()` | **Tal cual** | Sustituir `copyDir` global por una **lista blanca** (hoy se publica `assets/credits.json`, con metadatos obsoletos). |
| `build.js`: sitemap | **Adaptar** | N idiomas desde `alternates`, `lastmod` desde el manifiesto de hashes y sin `priority`/`changefreq` (Google los ignora). Los `noindex` y `/embed/` fuera. |
| `build.js`: robots.txt | **Reescribir** | Un único array de reglas → grupos combinados (04 §3.3). |
| `build.js`: llms.txt | **Reescribir** | Formato llmstxt.org con enlaces Markdown, bilingüe, más `llms-full.txt` y `index.md` por página (04 §4). |
| `lib/html.js`: `esc`, `abs`, `strip`, `breadcrumbs`, `breadcrumbSchema`, `faqSchema`, `websiteSchema`, `secHead`, escape del JSON-LD | **Tal cual** | |
| `lib/html.js`: `layout()` | **Adaptar** | N idiomas; CSS/JS con hash; fuente autoalojada con `preload`; OG por página; sin `geo.*`/`ICBM` (Google los ignora); `<link rel="alternate" type="text/markdown">`; `aria-label` traducidos; scripts en línea compatibles con CSP (hash). |
| `lib/html.js`: `pathFor()` | **Adaptar** | Tipos: `home`, `service`, `audience`, `location`, `case`, `guide`, `glossary`, `pricing`, `about`, `quote`, `legal`, `embed`. ES sin prefijo y EN con `/en`. |
| `lib/html.js`: `nav()` / `footer()` | **Adaptar** | Enlaces generados desde los datos (hoy el pie tiene **rutas de artículos escritas a mano**, líneas 185–186) y conmutador de idioma para N idiomas. |
| `lib/html.js`: `picture()` | **Reescribir** | `<picture>` con `<source type="image/avif">` + WebP, y `width`/`height` **obligatorios** leídos del manifiesto. |
| `lib/html.js`: `businessSchema` | **Adaptar** | `Organization` + `ProfessionalService`: el nodo completo en la home, «sobre nosotros» y contacto; un nodo compacto (name, url, logo, sameAs) en el resto. Hoy repite 2,5 KB en cada landing (9,4 KB en la home con el catálogo). |
| `lib/html.js`: `serviceSchema`, `webPageSchema` | **Adaptar** | Service + Offer/PriceSpecification desde `pricing.js`. `dateModified` sale del manifiesto, **no** de `BUILD_DATE`. |
| `lib/html.js`: `factsBlock`, `sectionFaq`, `sectionHow`, `sectionCta`, `relatedCards`, `stickyBar`, `includedList`, `priceTable` | **Adaptar** (patrones) | «Datos clave», FAQ, proceso (plano → modelado → texturas → render → exportación → visor), CTA con **formulario** + WhatsApp + email, tarjetas relacionadas, barra fija «Pedir presupuesto», lista de entregables y tabla de packs. |
| `lib/html.js`: `sectionReviews`, `marquee`, `moreDestinations`, iframe de Maps | **Descartar** por ahora | Sin ficha de Google (bloqueado por el nombre). El marquee duplica todos sus enlaces (accesibilidad) y el iframe de Maps en cada página es un tercero pesado. |
| `lib/html.js`: `ICON` (SVG en línea) | **Reescribir** | Sprite `<symbol>` en un único `/assets/icons.[hash].svg` + `<use href>`. Hoy son unos 16 KB por página [medido]. |
| `data/destinations.js` (validación) | **Tal cual** (patrón) | Generalizar a un `validate(collection, requiredFields, langs)` común. |
| `data/site.js`, `data/ui.js` | **Adaptar** | Misma forma. Sin nombre ni logo todavía: dejar `name`, `logo` y `domain` como marcadores **y hacer que el build falle si se publican con marcadores** (check de «placeholders»). |
| `templates/notfound.js` | **Adaptar** | 404 por idioma (`/404.html` ES + `/en/404.html` vía una regla de Netlify con `status = 404`), `noindex`, enlaces útiles, sin schema de negocio. |
| `images.js` | **Reescribir** | Pipeline guiado por manifiesto (§6.4). |
| `check.js` | **Tal cual + ampliar** | Todos los checks actuales se quedan; se suman los de §5. |
| `netlify.toml` | **Adaptar** | Mantener `pretty_urls = false`, la ausencia de *catch-all*, `NODE_VERSION` y `--omit=dev`. `command = "npm run build && npm run check"`. Mover las redirecciones a `data/redirects.js` y generarlas. |
| `netlify/_headers` | **Adaptar** (generado) | Seguridad y caché como base, más CSP, tipos 3D y excepción de `frame-ancestors` para `/embed/` (§6.8). |
| `netlify/functions/reviews.mjs` | **Patrón** | Mismo esqueleto para `/api/lead`: clave en variable de entorno, respuesta 503 limpia si falta configuración, caché en el CDN y *fallback* en la UI. |
| `.htaccess` | Descartar | Solo si algún día se sale de Netlify. |
| `aviso-legal.html`, `politica-de-privacidad.html` (HTML escrito a mano, con estilos en línea y marcadores `[NIF]` sin rellenar) | **Descartar** | Generar las páginas legales con `layout()` desde `data/legal.js`, en ES y EN, más la política de cookies. |

### 1.3 Estructura propuesta

```
build/
  build.js  check.js  serve.js  images.js  models.js (validación y presupuesto de GLB/USDZ)
  data/     site.js ui.js services.js audiences.js locations.js cases.js guides.js glossary.js
            pricing.js faq.js legal.js redirects.js
  lib/      routes.js (pathFor, alternates) · head.js (layout) · components.js · schema.js
            assets.js (hash + manifiesto) · md.js (espejos Markdown) · validate.js
  templates/ home service audience location case guide glossary pricing about quote legal embed notfound
.build-manifest.json    ← hashes por página → lastmod/dateModified veraces (en git)
assets/img-manifest.json ← dimensiones + variantes por imagen (en git)
```

Enrutado para N idiomas. Sustituye a las 8 apariciones de `lang === 'en' ? 'es' : 'en'` y a las 18 bifurcaciones `lang === 'es' ? … : …` con texto en línea en plantillas y `lib/`; ese texto pasa a `ui.js`:

```js
// data/site.js
langs: ['es', 'en'], defaultLang: 'es', prefix: { es: '', en: '/en' }, locale: { es: 'es_ES', en: 'en_GB' },
xDefault: 'en', // decisión de 04 §8.3: ES en la raíz; x-default → EN para el tráfico internacional (confirmar)

// lib/routes.js
const pathFor = (kind, item, lang) => kind === 'home' ? `${site.prefix[lang]}/` : `${site.prefix[lang]}/${slug(kind, item, lang)}/`;
const alternates = (kind, item) => Object.fromEntries(site.langs.map((l) => [l, pathFor(kind, item, l)]));
// layout(): for (const [l, p] of Object.entries(alt)) → <link rel="alternate" hreflang="l" href="abs(p)">, + x-default
// sitemap: el mismo objeto `alt` en cada <url>, así la reciprocidad es correcta por construcción
```

---

## 2. Anatomía de las plantillas de Málaga

### 2.1 Home (`templates/home.js`), unas 2.000 palabras

| # | Sección | Bloques |
|---|---|---|
| 1 | `section.hero` | Imagen de fondo precargada (`preloadHero`, `fetchpriority=high`, srcset de 640 a 1920), etiqueta, **H1** (dividido por líneas con SplitText), subtítulo `.lead`, 2 CTA (WhatsApp y «Ver precios»), franja de 3 datos («Desde 35 €», «100% eléctrico», «24/7») e indicador de scroll |
| 2 | `marquee` | Todos los destinos con precio (duplicado para el bucle) |
| 3 | `#precios` | secHead + **tabla de precios completa** (destino → página, km, minutos, 2 precios) + 6 tarjetas destacadas |
| 4 | `#como-funciona` | 3 pasos numerados (h3 + p + nota) |
| 5 | `#por-que` | Bloque de flota con imagen en parallax + 4 tarjetas con listas |
| 6 | `#destinos` | Destinos agrupados por zona en píldoras + CTA «¿No ves tu destino?» |
| 7 | `#opiniones` | Insignia de Google + carrusel (fetch a `/api/reviews`) + iframe de Maps |
| 8 | `#datos` | **Párrafo resumen** (`.facts-summary`) + `<dl>` de 7 datos clave |
| 9 | `#faq` | 10 `<details>` (el primero abierto) |
| 10 | `#reservar` | CTA final con imagen de fondo, WhatsApp, teléfono, email y disponibilidad |

Schema: `LocalBusiness` (+ `OfferCatalog` con las 19 ofertas) · `WebSite` · `WebPage` (+ `speakable`) · `FAQPage`.

### 2.2 Landing de destino (`templates/destination.js`), 19 × 2 idiomas

| # | Sección | Bloques |
|---|---|---|
| 1 | `header.page-hero` | Imagen de fondo cargada con prioridad, **migas de pan**, etiqueta «Traslado privado → X», **H1** con la keyword, `.lead` de 1 frase, **franja de 4 datos** (distancia, duración, ruta y precio «desde»), 2 CTA |
| 2 | `#precio` | H2 «Precio del transfer aeropuerto de Málaga – X» + 2 tarjetas de precio (sedán y minivan, «por vehículo», sin recargos, botón) + lista «Todo incluido» |
| 3 | `.route` | H2 «Del aeropuerto de Málaga a X» + 2 párrafos de introducción + h3 «Bueno saberlo» con 2 consejos + recuadro de vuelta · `aside` fijo con chips de zonas, CTA y teléfono |
| 4 | Cómo funciona | Compartido |
| 5 | Por qué elegirnos (compacto) | Compartido |
| 6 | Reseñas | Compartido |
| 7 | FAQ | 5 preguntas propias del destino, con H2 personalizado |
| 8 | Relacionados | 3 tarjetas (`related` en los datos) + «Ver todos» |
| 9 | CTA | Texto de WhatsApp y H2 propios del destino |
| 10 | Barra fija (móvil) | Precio «desde» + botón |

Schema: `LocalBusiness` · `WebSite` · `WebPage` · `BreadcrumbList` · `Service` (2 `Offer` con `eligibleQuantity` y `priceValidUntil`) · `FAQPage`.
**Contenido único por destino [medido]: entre 388 y 555 palabras de unas 1.240 dentro de `<main>` (35–45 %)**. El resto es plantilla compartida. Funcionó para la cola larga local, pero **no basta** para páginas de servicio B2B que compiten en temas informativos.

### 2.3 Hub de destinos (`templates/hub.js`)

Page-hero pequeño (migas, etiqueta, H1, lead) → rejilla de tarjetas por zona (**h3 de zona directamente bajo el H1: salto de encabezado [medido]**) → tabla de precios → reseñas → CTA. Schema: `LocalBusiness` + catálogo · `WebSite` · `CollectionPage` · `BreadcrumbList`.

### 2.4 Artículo o guía (`templates/article.js`), 2 × 2 idiomas

Page-hero pequeño (etiqueta «Guía», H1 formulado como **pregunta**, lead con la respuesta en 1 frase) → `article` con secciones `h2 + html` (la primera se llama «La respuesta corta») + `aside` fijo (tarjeta CTA y destinos destacados) → FAQ (4) → 3 relacionados → CTA. Schema: `Article` (se construye expandiendo `webPageSchema`: `headline`, `author` y `publisher` = negocio, `datePublished` **escrito a mano** y **sin `image` [medido]**) · `BreadcrumbList` · `FAQPage`.
La guía comparativa «transfer frente a taxi» es **honesta**: reconoce cuándo conviene el taxi. Ese formato es muy citable por los LLM y hay que replicarlo (por ejemplo «modelo 3D desde plano frente a Matterport»).

### 2.5 404 (`templates/notfound.js`) y páginas legales

- 404: **una sola página bilingüe** (bloque EN con h1 y bloque ES con h2 y `lang="es"`), `noindex, follow`, enlaces a la home, al hub, a WhatsApp y a los destinos destacados. Netlify la sirve con estado 404 porque no hay *catch-all*.
- Legales: HTML estático fuera del generador, sin hreflang, con estilos en línea y **marcadores legales sin rellenar**.

### 2.6 Correspondencia con nuestras plantillas (URLs en 04 §8.3; bloques en 04 §8.2)

| Málaga | Nuestro proyecto | Qué cambia |
|---|---|---|
| Home | Home (ES `/`, EN `/en/`) | El hero pasa a ser el **póster del caso** (LCP) con «Ver en 3D» / «Ver en AR»; la franja de datos pasa a «12 estancias · 39 texturas · 1 sesión»; la tabla de precios, a packs |
| Destino (landing desde datos) | **Servicio** (5), **audiencia** (4) y **zona** (3) | La misma idea de landing desde datos, pero con **mínimo de palabras únicas** validado (§5) y un bloque demo por servicio |
| Hub | Índice de servicios y de casos | `CollectionPage` + `ItemList` |
| Artículo | **Guía** (comparativas, precio, «qué es») | `Article`/`BlogPosting` con autor `Person`, `image`, fechas reales y tabla comparativa |
| — | **Caso de estudio** (villa en la Costa del Sol, anonimizada) | Visor diferido, galería de renders, CTA de AR, datos del proceso y `3DModel` + `ImageObject` (04 §6) |
| — | **Embed** `/embed/<caso>/` | `noindex`, sin navegación, solo el visor; se puede incrustar en iframe (§6.8) |
| — | Glosario, precios, sobre nosotros, presupuesto (formulario) | `DefinedTermSet`, `OfferCatalog`, `AboutPage`/`ProfilePage` y `ContactPage` |
| 404 | 404 por idioma | |
| Legales a mano | Legales generados (aviso, privacidad, cookies) | Desde `data/legal.js` y con `layout()` |

---

## 3. Técnicas SEO y GEO que usa Málaga (y qué hacemos con cada una)

| Técnica | Implementación en Málaga | Veredicto |
|---|---|---|
| URLs reales por idioma (sin traducción por JS) | `pathFor`; ES bajo `/es/`, slugs traducidos (`transfer-aeropuerto-malaga-marbella` / `malaga-airport-to-marbella-transfer`) | **Mantener**. Invertimos la raíz (ES en `/`) |
| `canonical` autorreferente + `hreflang` en, es y x-default + sitemap con `xhtml:link` | `layout()` y `urlXml()` | **Mantener** y generalizar. 0 fallos de reciprocidad [medido] |
| Meta robots `max-image-preview:large, max-snippet:-1, max-video-preview:-1` | `layout()` | **Mantener** (permite fragmentos largos en AI Overviews) |
| OG y Twitter completos, `og:locale:alternate` | `layout()`, una sola `og-image.jpg` | **Mantener** y usar **OG por página** (render del caso o del servicio) |
| Títulos «keyword principal \| diferenciador con cifra» | «Transfer Aeropuerto Málaga Marbella \| 70 € Precio Fijo · Tesla» | **Mantener** el patrón. 23 descripciones pasaban de 165 caracteres y 1 título de 70, todo como aviso: **convertirlo en error** |
| `@graph` con `@id` estables (`/#business`, `/#website`, URL de página, `#service`) | `lib/html.js` | **Mantener**. Matriz de tipos en 04 §6.3 |
| Service + Offer con precio, `eligibleQuantity` y `priceValidUntil` | `serviceSchema` | **Adaptar** a packs (precio «desde», plazo y número de estancias) |
| `OfferCatalog` en home y hub | `businessSchema({withCatalog})` | **Mantener** en home y precios |
| FAQ **autocontenidas** con cifras, repitiendo sujeto, servicio y lugar | `pages.js` y `destinations/*.js`: respuestas de 25–60 palabras | **Mantener** (es lo que se cita). Los rich results de FAQ ya no existen (04 §0.8): se usan por semántica, no por el SERP |
| Bloque «Datos clave» (`<dl>`) + párrafo resumen con todas las cifras | `factsBlock` y `home.summary` | **Mantener**: es el bloque más citable. Llevarlo a servicios y casos |
| `speakable` (`h1`, `.lead`, `.facts-summary`) | `webPageSchema` | Sin efecto real en Google (solo noticias). Mantener `.lead` como selector del QA (04) |
| `llms.txt` generado desde los datos (precios, URLs y «hechos para respuestas rápidas») | `build.js` §5 | **Mejorar**: formato con enlaces Markdown, `llms-full.txt` y espejos `.md` (04 §4) |
| robots.txt que permite los bots de IA | `build.js` §4 | **Corregir**: grupos sin el `Disallow`; faltan `Claude-SearchBot` y `Perplexity-User`; `anthropic-ai` está obsoleto (04 §3) |
| Malla de enlaces internos | Menú, pie («destinos populares» con precio), tabla de precios, hub, relacionados, marquee y *aside* | **Mantener** la idea (0 páginas con menos de 3 enlaces entrantes [medido]) sin duplicados decorativos. En la home ES, la página de Marbella recibe **8 enlaces** |
| 404 real sin *catch-all*; `pretty_urls = false`; redirecciones 301 de URLs antiguas (`?lang=es` → `/es/`, `.html` sin extensión con `force = true`) | `netlify.toml` | **Mantener**. Explicado en `docs/GUIA-SEO-SEARCH-CONSOLE.md` §1: el *catch-all* provocaba soft 404 |
| Coherencia NAP web ↔ schema ↔ GBP; Bing Webmaster Tools; guía de Search Console | `docs/GUIA-SEO-SEARCH-CONSOLE.md` | **Mantener** como checklist posterior al lanzamiento (con la ficha pendiente del nombre) |
| Página comparativa honesta | `transfer-vs-taxi` | **Replicar** (guías comparativas en 04 §8.3) |
| Precios públicos en cifras en títulos, tablas, FAQ y llms.txt | Datos en un solo sitio | **Mantener**: los LLM citan cifras |
| Meta `geo.region`, `geo.position` e `ICBM` | `layout()` | **Quitar**: Google no las usa |

---

## 4. JavaScript (`js/main.js`, 307 líneas, IIFE sin dependencias más allá de GSAP)

### 4.1 Qué hace

| Función | Comportamiento | Evaluación |
|---|---|---|
| Puerta de animación | `<head>`: `classList.add('js')`. `main.js`: añade `anim` si hay GSAP y no hay `prefers-reduced-motion`; si no, `no-anim`. **Red de seguridad**: `no-anim` a los 2,5 s. CSS: `html.js.anim [data-reveal]… { opacity:0 }` | Buena idea, mal momento: `anim` se añade **después** del primer pintado (el script es diferido), así que el contenido se ve, desaparece y vuelve a aparecer. El timeline del hero espera a `document.fonts.ready` → el **H1 queda oculto** mientras carga Inter |
| `initNav` | Clase `scrolled` a partir de 40 px, oculta la barra al bajar y la muestra al subir, barra de progreso con `scaleX` y un solo rAF por scroll | Mantener (es barato) |
| `initMobileMenu` | `aria-expanded`, `overflow:hidden`, cierra con Escape y al pulsar un enlace | Falta **foco atrapado**, `inert` en el fondo, **devolver el foco** al botón y un `aria-label` traducido («Menu» en ES [medido]) |
| `initFloating` | Botón flotante de WhatsApp y barra fija visibles pasado el 70 % del hero; se ocultan cerca del final | Lee `document.body.offsetHeight` en cada scroll (fuerza *reflow*). Mejor dos centinelas con `IntersectionObserver` |
| `initFaq` | Acordeón sobre **`<details>` nativo** (el contenido está en el HTML y es rastreable), anima la altura con transición CSS y `transitionend`, y respeta *reduced motion* | **Reutilizar** tal cual |
| `initAnimations` (GSAP) | Hero: SplitText por líneas con máscara (`yPercent 110 → 0`, stagger 0,12) + elementos + franja. Fondo del hero: zoom de 1,08 a 1 y parallax `yPercent: 18` con scrub. `[data-parallax-img]`: escala y desplazamiento con scrub. `[data-reveal]`: opacidad y `y: 24` al llegar al 88 %, una vez. `[data-stagger]`: hijos escalonados 0,08 s. Filas de la tabla de precios. `.div-line` que crece con `scaleX`. **Contador** en las cifras de precio | Visualmente cuidado, pero 125 KB de librerías (unos 49 KB gz) en **todas** las páginas por unos *reveals*. El contador cambia el texto de la cifra (malo si el LLM o el lector de pantalla lo leen a mitad) |
| `initReviews` | `fetch('/api/reviews?lang=')`, pinta las tarjetas escapadas, «leer más», flechas, avance automático cada 6 s (pausa con hover, foco o toque y con `document.hidden`), *fallback* con enlace a Google | Patrón correcto de *progressive enhancement*. No aplica hasta que haya ficha y reseñas |

### 4.2 Qué hacemos en el nuevo proyecto

1. **Puerta de animación en el `<head>`, antes del primer pintado**, y **nunca ocultar el elemento LCP** (póster del hero ni H1). El hero solo anima `transform` o nada.

```html
<script>/* hash en la CSP */(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('anim')})(document.documentElement)</script>
```
```css
html.anim [data-reveal]:not(.in){opacity:0;transform:translateY(24px)}
[data-reveal]{transition:opacity .8s var(--ease),transform .8s var(--ease)}
```
```js
// reveal.js (~0,5 KB): sustituye a GSAP en el 90 % de los usos
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('[data-reveal],[data-stagger]>*').forEach((el, i) => { el.style.transitionDelay = el.parentElement.hasAttribute('data-stagger') ? `${(i % 8) * 80}ms` : ''; io.observe(el); });
setTimeout(() => document.documentElement.classList.remove('anim'), 3000); // red de seguridad heredada
```
   GSAP (ahora gratuito, SplitText incluido) **solo en las páginas que lo declaren** (`layout({ gsap: true })`), por ejemplo una secuencia de scroll «plano → 3D» en la home.

2. **`<model-viewer>` diferido** (pesa mucho: incluye three.js; comprobar el tamaño exacto de la versión que se instale). En el HTML inicial va el **póster como `<img>` LCP** y el componente se importa al hacer clic o al acercarse al viewport. Los decodificadores (Draco o meshopt y KTX2) se sirven desde nuestro dominio, no desde gstatic, para no depender de terceros y poder cerrar la CSP.

```html
<figure class="viewer" data-viewer data-src="/assets/3d/villa.3f9a1c.glb" data-ios-src="/assets/3d/villa.b71e02.usdz">
  <img src="/assets/img/villa-poster-1080.avif" width="1080" height="810" alt="Maqueta 3D amueblada de la planta alta de una villa en la Costa del Sol" fetchpriority="high">
  <button type="button" data-load-viewer>Explorar en 3D</button>
</figure>
```
```js
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-load-viewer]'); if (!b) return;
  await import('/lib/model-viewer.[hash].min.js');           // un solo módulo, con hash
  const fig = b.closest('[data-viewer]'), mv = document.createElement('model-viewer');
  Object.assign(mv, { src: fig.dataset.src, iosSrc: fig.dataset.iosSrc, poster: fig.querySelector('img').currentSrc });
  mv.setAttribute('camera-controls', ''); mv.setAttribute('ar', ''); mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
  fig.replaceChildren(mv);
});
```

3. **CTA de AR sin JavaScript** (no hace falta cargar model-viewer para abrir AR, por lo que el INP y el LCP no se ven afectados). Verificar en un iPhone y un Android reales:
   - iOS AR Quick Look: `<a rel="ar" href="/assets/3d/villa.b71e02.usdz#allowsContentScaling=0"><img …></a>`. El `<img>` hijo es obligatorio para que Safari lo trate como AR; con `allowsContentScaling=0` el modelo queda fijo a tamaño real, para «entrar» en la vivienda.
   - Android Scene Viewer: `intent://arvr.google.com/scene-viewer/1.0?file=<URL absoluta del GLB>&mode=ar_preferred&resizable=false#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=<URL del caso>;end;`
   - Detección mínima de plataforma para mostrar solo el enlace que corresponde (el de iOS se detecta con `document.createElement('a').relList.supports('ar')`).

4. **Menú móvil accesible**: `inert` en `main` y `footer` al abrir, foco en el primer enlace, Escape cierra y devuelve el foco al botón, y `aria-label` desde `ui.js`.
5. **FAQ**: reutilizar `initFaq`. Según 04 §1.1 (Bing), el contenido crítico no debe quedar oculto: dejar abierta la primera pregunta o, en las guías, mostrar la respuesta directa fuera del acordeón.
6. **Formulario de captación** (nuevo): `fetch('/api/lead')` con *honeypot*, validación nativa, `aria-live="polite"` para el estado y *fallback* sin JS (`action` hacia la función con redirección a `/gracias/`, que irá con `noindex`). Eventos de analítica: `lead_submit`, `viewer_open`, `ar_open_ios`, `ar_open_android`, `whatsapp_click` (04 §10).

---

## 5. QA: `check.js` actual y checks que añadimos

### 5.1 Qué comprueba hoy (75 líneas, exit 1 si hay errores)

| Check | Nivel |
|---|---|
| Cada `href`/`src` interno existe en `dist/` (incluidos absolutos al propio dominio) | error |
| Cada URL de `srcset` existe | error |
| Exactamente un `<h1>` (salvo el 404) | error |
| `rel="canonical"` presente | error |
| `hreflang="x-default"` presente | aviso |
| `<title>` y meta description presentes y **únicos** en todo el sitio | error |
| Título de más de 70 caracteres y descripción de más de 165 | aviso |
| JSON-LD que parsea | error |
| Restos: `undefined`, `[object Object]`, `NaN` (fuera de `<script>`) y `${` | error |
| `<img>` sin `alt` | error |
| Cada `<loc>` y cada `hreflang` del sitemap resuelven | error |

Carencias estructurales: **no se ejecuta en Netlify** (el comando es solo `build.js`); los avisos se ignoran (hay 26 acumulados: 23 descripciones largas, 1 título largo y 2 legales sin hreflang); `exists()` da por buenas las rutas relativas (`if (!clean.startsWith('/')) return true`).

### 5.2 Resultado del prototipo de checks nuevos contra el `dist/` de Málaga [medido]

| Check | Resultado |
|---|---|
| Reciprocidad de hreflang y canonical autorreferente | 0 fallos |
| Páginas con menos de 3 páginas enlazándolas | 0 |
| Saltos de encabezado | 4: hub EN y ES (h1 → h3) y legales (h2 → h4) |
| `<img>` sin `width`/`height` | 46: la imagen de fondo del CTA en todas las páginas |
| HTML de más de 45 KB | 43 de 49 (home 77 KB, hub 55 KB, destinos 48–51 KB; entre 31 y 53 SVG en línea) |
| `Article` sin campos obligatorios | 4 páginas sin `image` |
| Número de FAQ en el schema frente a las visibles | 0 diferencias |
| URLs de llms.txt que resuelven | 46 de 46 |
| CSS que bloquea el render | Google Fonts + `site.css` |
| JS por página | 138 KB (sin comprimir) |
| Enlaces sin nombre accesible o con texto genérico | 0 (bien: las flechas llevan `aria-label`) |

### 5.3 Checks que añadimos (todos como **error** salvo que se indique)

| # | Check | Regla o umbral |
|---|---|---|
| 1 | Reciprocidad de hreflang | Cada alternativa existe, apunta de vuelta y el grupo es idéntico en todas sus páginas y en el sitemap |
| 2 | Canonical | Absoluta, autorreferente y a la versión con barra final; las páginas `noindex` no están en el sitemap |
| 3 | El sitemap coincide con las páginas indexables | Coincidencia exacta (ni sobran ni faltan). `/embed/`, `/gracias/` y el 404 quedan fuera |
| 4 | Páginas huérfanas o poco enlazadas | Error con 0 enlaces entrantes de páginas indexables; **aviso** con menos de 3. Cada servicio debe recibir enlaces desde la home, desde su índice y desde al menos 1 guía |
| 5 | Orden de encabezados | Sin saltos (h2 → h4) y un solo h1 |
| 6 | Calidad del texto de enlace | Prohibidos «leer más», «aquí», «click here», «más» y «ver más»; los enlaces sin texto necesitan `aria-label` o `img[alt]` |
| 7 | Imágenes | `width` y `height` obligatorios y **coherentes con el manifiesto** (proporción ±1 %); una sola `fetchpriority=high` por página; la imagen LCP sin `loading=lazy`; el resto lazy |
| 8 | Presupuestos de peso (§8) | HTML de 60 KB como máximo, JSON-LD de 8 KB, CSS de 30 KB minificado, JS inicial de 15 KB gz sin GSAP, imagen LCP de 120 KB. GLB y USDZ según §8 |
| 9 | JSON-LD por tipo | `Article`: `headline`, `image`, `datePublished`, `dateModified`, `author`. `Service`: `provider`, `areaServed`, `offers`. `Offer`: `price`/`priceSpecification` y `priceCurrency`. `3DModel`: `encoding[]` con `contentUrl` existente y `encodingFormat`. `BreadcrumbList`: posiciones consecutivas. Los `@id` referenciados existen en el mismo grafo |
| 10 | Coherencia schema ↔ contenido visible | Número y texto de las FAQ iguales a los `<details>`; el precio del schema aparece en el HTML; el `headline` coincide con el h1 |
| 11 | Longitud de meta (en error, no en aviso) | Título de 30 a 60 caracteres y descripción de 110 a 158. Opcional: ancho en píxeles aproximado |
| 12 | Respuesta directa | Existe `.lead` o `[data-answer]` de 40–60 palabras en servicios y guías (04 §8.1) |
| 13 | Mínimo de contenido único | En servicio, audiencia y zona, al menos 600 palabras únicas (texto de `<main>` menos los bloques compartidos) |
| 14 | llms.txt, llms-full.txt y espejos `.md` | Cada URL resuelve; cada página indexable tiene su `index.md`; el tamaño queda por debajo de los límites de 04 §4.2 |
| 15 | robots.txt | Se genera desde el array; ningún grupo específico pierde un `Disallow` del grupo general; hay línea `Sitemap:` |
| 16 | Redirecciones | Ningún origen existe como página; todos los destinos existen; sin cadenas ni bucles |
| 17 | `_headers` | Existe CSP; `/embed/*` tiene `frame-ancestors` y **no** tiene `X-Frame-Options`; `.glb`/`.usdz` con su `Content-Type` |
| 18 | Idioma | `<html lang>` correcto; los `aria-label`, `alt` y `title` no contienen cadenas del otro idioma (lista de palabras de `ui.js`) |
| 19 | Sin marcadores | Prohibidos `[MARCA]`, `[NIF]`, `TODO`, `lorem` y `example.com` en `dist/` (en Málaga se publicaron `[NIF]` y `[NOMBRE…]`) |
| 20 | IDs duplicados y `aria-controls` que apuntan a ids inexistentes | Error |
| 21 | Enlaces externos | `target=_blank` siempre con `rel="noopener"`; sin enlaces `http:` |
| 22 | Fechas | `dateModified` ≥ `datePublished`; `lastmod` = `dateModified` del manifiesto |
| 23 | Recursos 3D | GLB válido (cabecera `glTF`, versión 2); tamaño dentro del presupuesto; texturas de 2048 px como máximo en web y 1024 px en AR; póster presente |
| 24 | Accesibilidad automática (en CI) | `pa11y-ci` o `axe` sobre 1 página por plantilla; contraste AA |
| 25 | Lighthouse CI | Móvil ≥ 95 en rendimiento y 100 en SEO y accesibilidad, en 1 página por plantilla (fuera del build de Netlify: GitHub Action o local antes de publicar) |

Fragmentos del prototipo (ya probados):

```js
// Reciprocidad de hreflang
for (const [u, h] of Object.entries(pages)) {
  for (const m of h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) {
    const target = m[2].replace(DOMAIN, ''), th = pages[target];
    if (!th) err(u, `hreflang → página inexistente ${target}`);
    else if (!th.includes(`href="${DOMAIN}${u}"`)) err(u, `hreflang no recíproco con ${target}`);
  }
}
// Enlaces entrantes por página (huérfanas)
const inbound = Object.fromEntries(Object.keys(pages).map((u) => [u, new Set()]));
for (const [u, h] of Object.entries(pages)) for (const m of h.matchAll(/<a\b[^>]*href="([^"#?]+)/g)) {
  const t = m[1].startsWith(DOMAIN) ? m[1].slice(DOMAIN.length) : m[1];
  if (inbound[t] && t !== u) inbound[t].add(u);
}
for (const [u, s] of Object.entries(inbound)) if (!s.size && !NOINDEX.has(u)) err(u, 'página huérfana');
// Saltos de encabezado
const hs = [...h.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) err(u, `h${hs[i - 1]} → h${hs[i]}`);
```

---

## 6. Debilidades de Málaga y cómo las resolvemos

### 6.1 Fuentes
- **Ahora**: `fonts.googleapis.com` con Inter 300/400/500/600/700 como hoja que bloquea el render, y dos `preconnect` a terceros en cada página (y en los legales). Riesgo RGPD (la IP del visitante va a Google) y dependencia de un tercero en la ruta crítica.
- **Nuevo**: **autoalojar** una woff2 **variable** con subconjunto latin + latin-ext (unos 30–45 KB), con `<link rel="preload" as="font" type="font/woff2" crossorigin>` y `font-display: swap`, y una fuente de reserva con `size-adjust`/`ascent-override` para que el cambio no provoque CLS. Como mucho 2 familias (texto + titular opcional). Caché de 1 año con hash.

### 6.2 CSS
- **Ahora**: `site.css` de 41 KB sin minificar (8,4 KB gz), único y bloqueante (asumible), con `?v=AAAAMMDD`.
- **Nuevo**: minificar en el build (un minificador sencillo sin dependencias o `lightningcss` como devDependency), nombre con hash y `immutable`. CSS crítico en línea **solo** si Lighthouse lo pide (con menos de 10 KB gz no suele compensar). Tokens de color en `:root` con contraste AA verificado (§6.6).

### 6.3 JavaScript
- **Ahora**: 4 scripts diferidos (138 KB, unos 49 KB gz solo las librerías GSAP) en todas las páginas, incluso en los legales. Contador de precios que reescribe texto.
- **Nuevo**: `main.[hash].js` de menos de 15 KB gz sin GSAP (nav, menú, FAQ, reveal, cargador del visor y formulario). GSAP y model-viewer se cargan bajo demanda (§4.2). Sin librerías de terceros en `<head>`. Sin `setInterval` salvo pausados con `document.hidden`.

### 6.4 Pipeline de imágenes (los renders SON el producto)
- **Ahora**: `images.js` con una lista fija (hero, road, interior, OG y favicons), **solo WebP** y anchos elegidos a mano. `picture()` coge el ancho del medio como `src` y **los `width`/`height` son opcionales** (el CTA no los lleva [medido]). Una sola imagen OG. Sin AVIF ni marcadores de baja resolución (LQIP).
- **Nuevo** (`build/images.js` guiado por datos):
  - Recorre `source/**/renders/*.{png,exr→png,jpg}`. Para cada imagen genera AVIF (calidad 50–55) y WebP (70) en anchos `[480, 768, 1080, 1440, 1920, 2560]` sin ampliar, OG de 1200 × 630 en JPEG y un LQIP de 16 px en base64.
  - Escribe `assets/img-manifest.json` `{ id: { w, h, variants: {avif:[…], webp:[…]}, lqip, alt: {es, en}, credit, license } }`. `picture(id, {sizes})` lee de ahí: **dimensiones siempre correctas**.
  - Nombres con el hash del original (caché inmutable).
  - `ImageObject` con `creator`, `copyrightNotice`, `license` y `acquireLicensePage` para los renders propios (texturas procedurales: sin problemas de licencia, lo que conviene decir en el schema).
  - Solo procesa lo que ha cambiado (cachea por el hash del original) para que `npm run images` sea incremental.

### 6.5 Caché y *cache busting*: **fallo real**
- **Ahora**: `site.css?v=20260928` con `Cache-Control: max-age=604800` (7 días). **Si se publica dos veces el mismo día con cambios en el CSS o el JS, los visitantes que vuelven se quedan con la versión anterior hasta 7 días.** `/lib/*` va con `immutable` y **sin hash**, así que actualizar GSAP con el mismo nombre dejaría la versión vieja en caché durante 1 año.
- **Nuevo**: `lib/assets.js` copia cada recurso como `nombre.[sha256:10].ext` y devuelve la ruta; todo lo que lleva hash se sirve con `public, max-age=31536000, immutable` y el HTML con `max-age=0, must-revalidate`.

```js
const crypto = require('crypto');
function asset(rel) {                                   // asset('assets/css/site.css') → '/assets/css/site.1a2b3c4d5e.css'
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const out = rel.replace(/(\.\w+)$/, `.${crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10)}$1`);
  fs.mkdirSync(path.dirname(path.join(DIST, out)), { recursive: true });
  fs.writeFileSync(path.join(DIST, out), buf);
  return '/' + out.replace(/\\/g, '/');
}
```

### 6.6 Accesibilidad [medido]
| Problema | Evidencia | Arreglo |
|---|---|---|
| Contraste de 2,61:1 (AA exige 4,5:1) | `--grey-3: rgba(255,255,255,.3)` sobre `#0A0A0A`, en `.label`, `.muted`, `.small`, `.fact dt`, `.hub-meta`, `.fbrand p`… (30 usos). `--grey-2` da 6,28:1 (bien) | Ningún token de texto por debajo de 4,5:1; check de contraste en CI |
| `aria-label` en inglés en las páginas ES | «Menu», «Language», «WhatsApp»; `aria-label="Main"` y «Breadcrumb» fijos | Todo desde `ui.js` + check 18 |
| Menú móvil | Sin foco atrapado, sin `inert` y sin devolver el foco | §4.2 |
| Marquee | Todos los enlaces duplicados (2 paradas de tabulación por destino) y `aria-label` en un `div` sin rol | No usar; si hay carrusel decorativo, la copia va con `aria-hidden="true"` e `inert` |
| Salto h1 → h3 en el hub | Zonas en h3 directamente | Check 5 |
| Contenido oculto por la animación | `opacity:0` hasta que llega el scroll o GSAP | La puerta en el `<head>` y la red de seguridad no ocultan el LCP |
| Aciertos que se conservan | Enlace de salto, `:focus-visible`, `.sr`, `<details>` nativo, `prefers-reduced-motion` en CSS y JS, estilos de impresión, `aria-current` en las migas | Reutilizar |

Cruzar con `docs/guidelines/web-interface-guidelines.md` en cada plantilla.

### 6.7 Profundidad de contenido y E-E-A-T
- **Ahora**: entre el 35 y el 45 % de contenido único en las landings; sin página «sobre nosotros», sin autor (`author` = el negocio), `datePublished` escrito a mano, legales con marcadores, sin casos ni fotos del equipo, y **testimonios inventados en el copy** (acabaron sustituidos por la API de reseñas, pero el riesgo existió).
- **Nuevo**: al menos 600 palabras únicas por servicio (check 13); caso de estudio con cifras reales del proceso (12 estancias, 39 texturas procedurales, 1 sesión de trabajo, medidas estimadas a partir de la escala del plano, **anonimizado** como «villa en la Costa del Sol»); página «sobre nosotros» con el método y las herramientas (Blender 5, Python, Cycles, model-viewer, USDZ y glTF); autor `Person` en las guías; **ningún testimonio ni logotipo de cliente hasta que existan**. Las secciones «Próximamente» (vídeo con IA y tours VR 360) van dentro de los servicios, no como páginas vacías (04 §8.3).

### 6.8 Cabeceras de seguridad, CSP e incrustación
- **Ahora**: `nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy` (camera, micrófono, geolocalización y pago desactivados), HSTS con preload y COOP. **Sin CSP.**
- **Problema nuevo**: el visor debe poder **incrustarse en los portales y webs de las agencias** (`<iframe>`). Un `X-Frame-Options: SAMEORIGIN` global lo impediría. Además, si algún día se usa AR por WebXR dentro de un iframe, hace falta `xr-spatial-tracking`.
- **Nuevo**: el build **genera `_headers`** a partir del registro de páginas (conoce todas las rutas):
  - Páginas normales: `Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; script-src 'self' 'sha256-<hash del script del head>' 'wasm-unsafe-eval'; style-src 'self'; font-src 'self'; connect-src 'self' blob: data:; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'` (**probarla primero como `Content-Security-Policy-Report-Only`** con el visor cargado: model-viewer y los decodificadores wasm necesitan `blob:` y `wasm-unsafe-eval`). No usar `X-Frame-Options` global.
  - `/embed/*`: `frame-ancestors *` (o una lista blanca de portales), `Permissions-Policy: xr-spatial-tracking=*` y `X-Robots-Tag: noindex`.
  - Comprobar en un deploy de previsualización cómo combina Netlify las cabeceras cuando varias reglas coinciden (riesgo de valores duplicados o concatenados). Por eso es mejor emitir reglas **por ruta explícita** que usar comodines que se solapen.
  - `Permissions-Policy`: añadir `xr-spatial-tracking=(self)` en las páginas con visor.

### 6.9 Recursos 3D (no existían en Málaga)
- **Estado actual de `source/villa3d/`**: `villa-modelo.json` (glTF, 514 KB) + `villa-geometria.wasm` (**es el `.bin` de 5,3 MB renombrado**) + 39 texturas JPG (5 MB) → unos 11 MB para la web; `villa_tamano_real.usdz` de **10,7 MB**; `poster.jpg` de 1400 × 1050.
- **Nuevo**:
  - Empaquetar en **un solo `.glb`** con `gltf-transform` (dedupe, weld, **meshopt** o Draco, texturas **KTX2/UASTC-ETC1S** o WebP limitadas a 2048 px) → objetivo de 2–4 MB. USDZ para AR con texturas de 1024 px → objetivo de 8 MB como máximo. **No renombrar extensiones**: servir los tipos MIME correctos.
  - `_headers`: `/assets/3d/*` → `Cache-Control: public, max-age=31536000, immutable`, `Access-Control-Allow-Origin: *` (Scene Viewer y las incrustaciones) y `X-Robots-Tag: noindex`; `*.glb` → `Content-Type: model/gltf-binary`; `*.usdz` → `Content-Type: model/vnd.usdz+zip`.
  - Coste: Netlify factura el ancho de banda por créditos (04 §3.3). Un caso con 15 MB (GLB + USDZ) por cada apertura del visor y del AR sale caro con tráfico. **Evaluar servir `/assets/3d/` desde un bucket sin coste de salida (Cloudflare R2 u otro)** con CORS, dejando el HTML en Netlify.
  - `build/models.js`: valida la cabecera del GLB, el tamaño, los póster y copia con hash.

### 6.10 Otros
| Tema | Ahora | Nuevo |
|---|---|---|
| `lastmod` y `dateModified` | `BUILD_DATE` en todas las páginas y en cada build (todo parece «modificado hoy»; Google deja de fiarse del lastmod) | `.build-manifest.json`: hash del HTML sin partes volátiles → la fecha solo cambia si cambia el contenido |
| 404 | Una sola bilingüe (bien) con schema de negocio (innecesario) | 404 por idioma + regla `/en/* → /en/404.html 404` + enlaces a servicios y al caso |
| Legales | HTML a mano con marcadores y teléfono escrito a mano | Generados con `layout()`; check 19 |
| Analítica | Ninguna | Plausible/Umami sin cookies o GA4 con Consent Mode v2 (04 §10); eventos de §4.2 |
| Captación | Solo WhatsApp (B2C) | Formulario B2B (nombre, agencia, email, teléfono, tipo de inmueble, m², número de planos, plazo, subida del plano opcional) + WhatsApp + email; casilla de privacidad (RGPD/LSSI); *honeypot* |
| Deploy | Netlify solo ejecuta `build.js` | `npm run build && npm run check` → **un error bloquea la publicación** |
| Copia de estáticos | `assets/`, `js/` y `lib/` completos (publica `credits.json`) | Lista blanca + recursos con hash |
| Imagen OG | Una para todo el sitio | Una por página (render del servicio o del caso) generada por `images.js` |
| Nombre y logo pendientes | — | `site.name` como marcador + check 19 bloquea la publicación; el diseño no depende del logo (monograma o texto) |

---

## 7. Metodología de planificación (Resources) y lecciones

Artefactos que se produjeron para Málaga, en este orden:

1. **`keywords_*.csv/.xlsx`**: columnas `Keyword · Tipo (intención) · Idioma · Notas estratégicas` (por ejemplo «Alta intención. Incluye destino y precio → landing específica Marbella»).
2. **`arquitectura_web_*.html`**: árbol interactivo con **una keyword principal y su clúster por URL**, tipo de página (Home, Servicio, Destino, Blog, Soporte, Reservar), ★ de prioridad y contadores («32 páginas · 19 con objetivo SEO · 7 prioritarias · 0 canibalizaciones»). También en PDF (`arbolSEOtransfer.pdf`).
3. **`copy_home_*.md`**: copy completo por secciones con meta title y description, H1, marcadores `[COMPONENTE: …]` para el maquetador, flechas `→` para los CTA y **notas técnicas** (schema recomendado, keywords extra, hreflang y **enlazado interno obligatorio**).
4. **`faq_geo_llms_*.md`**: 10 preguntas con respuestas autocontenidas y el bloque **«Información de referencia para LLMs»** (ficha de datos). Ese bloque acabó siendo el «Datos clave» de la home y el llms.txt.
5. **`prototipo_home_*.html`** (49 KB): prototipo estático y después el generador.

Desviaciones detectadas entre lo planificado y lo construido (lecciones):

| Planificado | Construido | Lección |
|---|---|---|
| Marbella 68 €, Granada 155 €, Fuengirola 42 € | 70 €, 165 € y 45 € | **Una sola fuente de verdad** (`data/pricing.js`); los documentos citan los datos, no los copian |
| ES en la raíz y EN en `/en/` | EN en la raíz y ES en `/es/` | Decidirlo una vez (04 §8.3: ES en la raíz) y documentarlo en `site.js` |
| `/destinos/transfer-…/` anidado | Plano `/transfer-…/` | Definir el esquema de URLs antes del copy; las redirecciones antiguas quedan en `redirects.js` |
| Servicios, flota, tarifas, blog, nosotros y contacto | Solo destinos, hub y 2 guías | El árbol de arquitectura debe ser **el registro de plantillas del build**; el check avisa de las páginas planificadas que faltan |
| Testimonios inventados en el copy | Sustituidos por la API de Google | Prohibido publicar testimonios, cifras de clientes o logotipos que no existan |
| Respuestas FAQ de 150–250 palabras, conversacionales | 25–60 palabras, densas en cifras | Respuesta directa de 40–60 palabras + ampliación opcional en la página (04 §8.1) |
| `AggregateRating`/`Review` con testimonios | Sin rating en el schema (bien: las reseñas propias no dan estrellas) | No marcar reseñas propias |

Para este proyecto, `01`–`04` ya cubren el equivalente a los pasos 1 y 4. **Falta el paso 2 como artefacto vinculado al build** (mapa de URLs con clúster de keywords por URL, a partir de 04 §8.3 y 02/03), luego el copy por plantilla y después los ficheros de datos.

---

## 8. Presupuestos (definición de terminado) y orden de implementación

### 8.1 Presupuestos (los verifica `check.js`; lo marcado con † lo verifica Lighthouse CI)

| Métrica | Presupuesto | Málaga (referencia) |
|---|---|---|
| LCP p75 móvil † | ≤ 2,0 s (laboratorio ≤ 2,5 s en 4G lenta) | Sin datos de campo |
| CLS † | ≤ 0,05 | — |
| INP † | ≤ 150 ms | — |
| HTML por página | ≤ 60 KB sin comprimir | Home 77 KB, destinos unos 50 KB |
| JSON-LD por página | ≤ 8 KB | Home 14 KB, destino 7,4 KB |
| SVG en línea por página | ≤ 4 KB (sprite externo) | Unos 16 KB |
| CSS | ≤ 30 KB minificado (≤ 8 KB gz) | 41 KB sin minificar |
| JS inicial | ≤ 15 KB gz; GSAP y model-viewer solo bajo demanda | Unos 55 KB gz en todas las páginas |
| Fuentes | 1 woff2 variable autoalojada ≤ 45 KB, precargada | Google Fonts, 5 pesos |
| Imagen LCP | ≤ 120 KB (AVIF a 1080 px en móvil) | Hero de 1440 px en WebP: 113 KB |
| Peso inicial sin 3D (móvil) † | ≤ 600 KB | — |
| GLB del visor web | ≤ 4 MB (objetivo 2–3 MB) | Actual unos 11 MB sin empaquetar |
| USDZ de AR | ≤ 8 MB | Actual 10,7 MB |

### 8.2 Orden de implementación

1. Andamiaje: copiar `serve.js`, `check.js`, los helpers de `build.js` y de `lib/html.js` (§1.2 «tal cual»); `package.json` con `build`, `check`, `preview` e `images`; `netlify.toml` con `build && check`.
2. `site.js` + `routes.js` para N idiomas + registro de páginas + `validate.js`.
3. `assets.js` (hash), fuente autoalojada, `images.js` con manifiesto, `models.js`.
4. `head.js` (layout) + `schema.js` (04 §6) + `components.js`.
5. Plantillas por impacto: home → caso de estudio (con visor diferido y AR) → servicio → precios → presupuesto (formulario + `/api/lead`) → sobre nosotros → guía → glosario → audiencia y zona → legales → 404 → embed.
6. Descubrimiento: sitemap con lastmod del manifiesto, robots (04 §3.3), llms.txt + llms-full.txt + `.md` (04 §4), `_headers` generado (§6.8, §6.9) e IndexNow (04 §5).
7. `check.js` ampliado (§5.3) + Lighthouse CI y pa11y en 1 URL por plantilla.
8. JS: nav, menú accesible, FAQ, reveal con IntersectionObserver, cargador del visor, AR sin JS, formulario y eventos de analítica.

---

## Anexo · Ejecución de referencia

```
$ node build/build.js          (copia en el scratchpad, Node 24)
  16 avisos de validación de datos: meta description de 166–187 caracteres
  46 pages + 404, sitemap.xml (48 URLs), robots.txt, llms.txt
$ node build/check.js
  Checked 49 HTML files, 48 sitemap URLs → 0 errors, 26 warnings
  (23 descripciones de más de 165 caracteres + 1 título de más de 70 + 2 legales sin hreflang)
Nodos JSON-LD: home → LocalBusiness 9,4 KB (con OfferCatalog) · FAQPage 3,6 KB
               destino → LocalBusiness 2,5 KB · Service 1,5 KB · FAQPage 2,0 KB
Tamaños gz: index.html 14,3 KB · site.css 8,4 KB · gsap + ScrollTrigger + SplitText 48,9 KB
```
