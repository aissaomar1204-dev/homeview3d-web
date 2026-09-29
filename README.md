# Web del estudio 3D · build, despliegue y lanzamiento

Sitio estático generado con Node (sin frameworks) y publicado en Netlify. Convierte los datos de
`build/data/` y los textos de `build/content/` en `dist/`: páginas HTML en español (raíz) e inglés
(`/en/`), visor 3D, realidad aumentada sin app y todos los ficheros para buscadores y asistentes de IA
(`robots.txt`, sitemaps, `llms.txt`, espejos Markdown, IndexNow, JSON-LD).

Especificación: `docs/build/BUILD-SPEC.md` · contrato de contenidos: `docs/build/CONTENT-SCHEMA.md` ·
diseño: `docs/design/DESIGN-RULEBOOK.md` · estrategia GEO: `docs/research/04-geo-2026.md`.

**Orden del lanzamiento:** §0 qué falta → §1 datos → §2 comprobación local → §3 Netlify → §4 formularios →
§5 a §7 indexación → §8 y §9 presencia fuera de la web → §10 medición mensual.

---

## 0. Qué falta para lanzar

La web está construida; lo que falta para publicarla son sobre todo **decisiones y datos del cliente**. La
lista completa, para marcar punto por punto, está en
[`docs/qa/content/CLIENT-CONFIRMATIONS.md`](docs/qa/content/CLIENT-CONFIRMATIONS.md).

1. **Datos de la empresa:** el nombre (Home View 3D), el logotipo, el dominio (homeview3d.com), el contacto y la
   sede (Mijas) ya están en `build/data/site.mjs` y sus `placeholder` están en `false`. **Queda un dato
   provisional: el NIF y los datos registrales de AS TRINITY, S.L., sociedad en constitución** (`legal.pending:
   true`, §1.1). No bloquea el build ni el deploy, pero `npm run check` lo repite en la sección **LAUNCH**
   («NIF y datos registrales en trámite») y el aviso legal y la política de privacidad dicen «en trámite» hasta que
   se sustituya: en cuanto la sociedad esté inscrita, rellena `legal.nif` y `legal.registro`, pon
   `legal.pending: false` y repasa el aviso legal.
2. **Precios y condiciones:** precios, qué incluye cada pack, plazos y rondas, pago, demo gratis, alojamiento del
   visor, derechos de uso, atención, cobertura y uso de IA (CLIENT-CONFIRMATIONS §2 a §12). Se aplican en
   `build/data/pricing.mjs` (y las páginas que indica el documento); después, `confirmed: true` (§1.2).
3. **Fundador** en `site.founder` (autoría real de guías y caso, §1.1) y los perfiles que ya existan en `sameAs`.
4. **Antes de publicar:** revisión legal y fechas de los datos de terceros (CLIENT-CONFIRMATIONS §13).
5. **Día del lanzamiento:** `CONTEXT=production npm run check` con 0 errores (§2), Netlify con dominio y sin
   `ALLOW_PLACEHOLDERS` (§3), `node scripts/geo-harness.mjs --live <url>` con 0 fallos, formulario probado de
   punta a punta (§4), realidad aumentada probada en un iPhone y un Android reales, y alta en Search Console,
   Bing, IndexNow y Brave (§5 a §7).

---

## 1. Antes del lanzamiento: rellenar los datos provisionales

Mientras quede un dato provisional (`placeholder: true` en `site.mjs`):

- **todas las páginas salen con `noindex, follow`** (las vistas previas no llegan a Google),
- `llms.txt` y `llms-full.txt` empiezan con un comentario de «vista previa»,
- IndexNow no envía nada,
- **el deploy de producción falla a propósito** (salvo `ALLOW_PLACEHOLDERS=1`, ver §3).

### 1.1 `build/data/site.mjs`

| Campo | Qué poner | Al terminar |
|---|---|---|
| `brand.name` | Nombre definitivo. Único y sin colisiones: compruébalo en Google, Bing, Wikidata, LinkedIn, Instagram, YouTube y OEPM/EUIPO (`04-geo-2026.md` §7.1). Nada genérico tipo «3D Studio». | — |
| `brand.legalName` | Razón social | — |
| `brand.logo` | Logo para schema.org (`Organization.logo`): PNG cuadrado, hoy `/assets/brand/logo-512.png` (512 × 512, lo genera `scripts/brand.mjs`, §2.1). La cabecera y el pie usan el SVG en línea, no este campo. | — |
| `brand.placeholder` | | `false` |
| `domain` | `https://www.tudominio.com`, sin barra final. Es la base de **todas** las URL canónicas, hreflang, sitemaps, schema, `llms.txt` e IndexNow. Decide ahora con o sin `www` y no lo cambies. | `domainPlaceholder: false` |
| `contact.email`, `contact.phoneE164` (`+34…`), `contact.phoneDisplay`, `contact.whatsapp` (sin `+`), `contact.booking` (enlace de Cal.com o `null`) | Datos reales: salen en texto en cada página, en el schema y en `llms.txt` | `contact.placeholder: false` |
| `base.locality`, `base.region` | Localidad y provincia de la sede. Es un negocio de área de servicio: no se publica calle. | `placeholderAddress: false` |
| `legal.razonSocial`, `legal.nif`, `legal.domicilio`, `legal.registro`, `legal.email` | Datos LSSI-CE (aviso legal, privacidad). Si queda un `[NIF]` o similar, el QA de producción falla. Mientras la sociedad esté en constitución, `nif` y `registro` dicen «en trámite» y `legal.pending` es `true`: solo avisa (LAUNCH en `npm run check`). | `legal.placeholder: false`; al inscribirse la sociedad, `legal.pending: false` |
| `entity.es`, `entity.en` | La **frase canónica**: idéntica en la web, `llms.txt`, LinkedIn, YouTube, Google Business Profile y directorios. Revísala cuando haya nombre. | — |
| `sameAs` | URL de cada perfil a medida que exista (LinkedIn, YouTube, Instagram, GBP, Clutch, Sortlist, Houzz, Behance, Sketchfab, GitHub…). Van a `Organization.sameAs`. | Rebuild |
| `founder` | La persona real detrás del estudio (E-E-A-T, `04-geo-2026.md` §9): `{ name, jobTitle: { es, en }, image: '/assets/img/founder.jpg', sameAs: ['https://www.linkedin.com/in/…'] }`. Con él, el schema publica un `Person` (`/sobre-nosotros/#founder`) como fundador de la organización y autor de las guías y del caso, y los `index.md` lo citan como autor. `null` = «Equipo de …». Las guías y el caso muestran entonces «Revisado por {nombre}», enlazado a «Sobre nosotros». Falta una sección con foto en «Sobre nosotros» (la plantilla aún no la pinta). | Rebuild |
| `indexNowKey` | Puede quedarse. Para una nueva: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`. Se publica sola como `/<clave>.txt`. | — |
| `analytics` | `null` (sin analítica, sin banner) o `{ provider: 'plausible', domain: 'tudominio.com' }` (sin cookies; la CSP se amplía sola). | — |
| `facts` | Año de fundación, idiomas y herramientas: comprueba que siguen siendo ciertos. | — |

### 1.2 `build/data/pricing.mjs`

Los precios son una **propuesta** (`confirmed: false`). Todo lo relacionado con precios sale de este
fichero: textos (tokens `{{price:…}}`), tablas, calculadora, FAQ, schema `Offer`/`OfferCatalog` y
`llms.txt`. **Nunca escribas un precio a mano en un contenido.**

Revisa y aprueba: `packs` (precio base, `tiers` por m², `deliveryDays`, `revisions`, `includes`),
`extras` (render, staging, tipología, hosting, urgente en %), `volume` (pack cartera), `calculator.steps`,
`guarantees`, `vatRate`, `validFrom` y `priceValidUntil` (va al schema). Cuando estén aprobados:
`confirmed: true` (desaparece el aviso del build). Los precios se muestran siempre **sin IVA** («+ IVA»).

### 1.3 Otros datos que dependen de ti

- `build/data/villa.mjs`: cifras del caso demostrativo (m², estancias, tamaños de los ficheros). El QA
  avisa si el tamaño declarado de un GLB/USDZ no coincide con el fichero publicado.
- Fechas `dateModified` de cada `build/content/<id>.mjs`: mandan en el sitemap, el schema y la fecha
  visible. Súbelas solo cuando cambie el contenido de verdad.

---

## 2. Comandos locales

Requisitos: Node 24 (vale ≥ 20) y `npm install` una vez.

| Comando | Qué hace |
|---|---|
| `npm run build` | Genera `dist/`: páginas, 404 por idioma, `robots.txt`, sitemaps, `llms.txt`, `llms-full.txt` (ES) y `en/llms-full.txt` (EN), un `index.md` por página indexable, feeds RSS, IndexNow, `_headers`, `_redirects`, `site.webmanifest`. |
| `OUT_DIR=dist-x npm run build` · `OUT_DIR=dist-x npm run check` | Lo mismo en otra carpeta (varias personas o agentes a la vez sin pisarse `dist/`). Las carpetas `dist-*/` no se suben a Git. En PowerShell: `$env:OUT_DIR='dist-x'; npm run build; npm run check; Remove-Item Env:OUT_DIR`. |
| `SKIP_INVALID=1 npm run build` | Solo mientras se redacta: omite las páginas con errores de contenido en lugar de parar el build (el QA avisa de las rutas sin construir). |
| `npm run check` | QA sobre `dist/` (ver abajo). Código de salida 1 si hay algún error. |
| `npm run qa` | `build` + `check`: exactamente lo que ejecuta Netlify. |
| `npm run preview` | Build y servidor local de `dist/` (barras finales, 404 real, MIME de GLB/USDZ/Markdown). |
| `node build/serve.mjs <puerto> <carpeta>` | Sirve una carpeta ya construida (por ejemplo `node build/serve.mjs 8831 dist-x`) con `_headers`, `_redirects` y brotli, como Netlify. |
| `npm run validate` | Valida los ficheros de contenido (`build/content/*.mjs`). |
| `npm run lint:design` | Solo el *design lint* (`scripts/design-lint.mjs dist`; otra carpeta: `node scripts/design-lint.mjs dist-x`). |
| `npm run indexnow` | Lista las URL pendientes de IndexNow (ver §6). |
| `npm run images` | Regenera AVIF/WebP/OG desde los renders. |
| `node scripts/geo-harness.mjs` | Prueba aislada de los módulos GEO (schema, Markdown, ficheros para máquinas) con datos falsos. |
| `node scripts/geo-harness.mjs --live <url>` | Prueba HTTP de un deploy (vista previa de Netlify o producción): barra final (301), Markdown por `Accept`, 404 por idioma, redirecciones, cabeceras de `robots`, `llms`, embed y modelos (ver §3). Con `http://localhost:<puerto>` (`build/serve.mjs`) omite lo que solo existe en Netlify. |

**Qué comprueba `npm run check`:** enlaces, recursos y anclas rotos; un solo `h1` y orden de encabezados;
canonical autorreferente; hreflang recíproco con `x-default`; títulos y descripciones únicos y con
longitud correcta; JSON-LD (se parsea, campos obligatorios por tipo, `@id` resueltos, FAQ del schema =
FAQ visible, precios del schema visibles en la página, el precio «desde» de la descripción es una `Offer` del
`Service`, `wordCount` > 0, `speakable` solo con selectores que existen, licencia de imágenes y vídeo que
resuelven, `ItemList` coherentes con la página); `.lead` y datos clave; imágenes con `alt`,
`width`/`height` y una sola `fetchpriority="high"`; páginas huérfanas; sitemaps, `robots.txt`, `llms*.txt`,
espejos `index.md`, feeds e IndexNow; `_headers` (CSP con los *hash* de los scripts en línea, embed
enmarcable, MIME y CORS de los modelos); `_redirects` (sin bucles, 404 por idioma); formulario de Netlify;
modelos 3D (cabeceras GLB, USDZ sin compresión y alineado a 64 bytes, texturas, tamaños); datos
provisionales; presupuestos de peso en **cada página** y el *design lint*.

**Presupuestos de peso** (`docs/build/BUILD-SPEC.md` §11; los números están en un solo sitio, `BUDGETS` en
`build/lib/machine.mjs`, y los usan el QA y el *design lint*):

| Qué | Límite |
|---|---|
| HTML de cada página | ≤ 72 KB sin comprimir **y** ≤ 16 KB en brotli |
| Hoja CSS común (`site.<hash>.css`) | ≤ 25 KB |
| CSS total de una página | ≤ 45 KB |
| Hojas CSS que bloquean el primer pintado | ≤ 2 por página (la común + un paquete) |
| JS inicial · fuentes · imagen LCP · JSON-LD | ≤ 30 KB · ≤ 110 KB · ≤ 150 KB (objetivo 120) · ≤ 8 KB sin las preguntas FAQ (aviso) |

*Por qué 72 KB y 16 KB brotli (antes 60 KB):* con las páginas ya hechas, las más pesadas medían 66-68 KB sin
comprimir pero solo 14-15 KB en brotli, y Lighthouse móvil daba 98-99. Esos bytes son contenido que buscadores y
asistentes tienen que leer en el HTML (respuestas completas de la FAQ, estancias del visor, formulario, JSON-LD):
recortarlo no acelera nada que se note. Lo que descarga el móvil es la página comprimida, así que el límite en
brotli es el que protege de verdad; el de 72 KB vigila que el HTML no crezca sin control. En CSS pesa más el
número de hojas que bloquean el render que su tamaño total: por eso cada página enlaza la hoja común y un solo
paquete.

El informe se agrupa **por responsable** (ENGINE, VIEWER, CONTENT, ASSETS, GEO, LAUNCH), indica el fichero
de contenido afectado y, en las páginas que superan el presupuesto de HTML, qué partes pesan más. Al final
muestra la tabla de presupuestos con la página más pesada de cada uno.
Opciones: `--verbose` (todo), `--production` (simula producción), `--placeholders-ok`, `--no-lint`,
`--json informe.json`.

**Comprobación final antes de publicar:**

```bash
npm run qa                                  # 0 errores
CONTEXT=production npm run check            # simula producción: los datos provisionales son errores
# PowerShell:  $env:CONTEXT='production'; npm run check; Remove-Item Env:CONTEXT
```

Fuera del build (05 §5.3, n.º 24 y 25), antes del lanzamiento y tras cambios grandes: Lighthouse móvil
(≥ 95 en rendimiento, 100 en SEO y accesibilidad) y axe/pa11y en una página de cada plantilla (home, un
servicio, el caso, precios, una guía y contacto).

### 2.1 Logotipo, iconos y tema claro / oscuro

**Logotipo.** Concepto A «Habitación» (`docs/brand/concepts/A/`, trazados vectoriales, sin depender de la
fuente). `node scripts/brand.mjs` genera todo lo derivado y es reproducible (`--verify` compara el SVG optimizado
con el original; `--only=svg,icons,og` limita el trabajo):

| Salida | Uso |
|---|---|
| `public/assets/brand/symbol.svg`, `lockup-horizontal.svg`, `lockup-stacked.svg` | Símbolo y lockups a dos colores, con variante oscura dentro del fichero (para `<img>`, firmas de correo, prensa). |
| `public/assets/brand/logo-512.png` | `Organization.logo` (schema.org): símbolo sobre el color papel, 512 × 512. |
| `build/generated/brand.json` | Lockup horizontal en línea para la cabecera (y el pie, con `<use>`): sigue el tema porque usa los tokens. 32 px de alto desde 1024 px, 28 px por debajo (24 px por debajo de 350 px). |
| `public/favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | Iconos: el SVG se adapta al modo claro/oscuro del navegador; los PNG llevan el símbolo claro sobre azul añil (los de 192 y 512 son *maskable*, símbolo dentro del 80 % central). |
| `public/assets/img/og-brand/<imagen>.jpg` | Cada imagen OG (1200 × 630) con el lockup sobre una placa de color papel abajo a la izquierda. Las originales de `public/assets/img/og/` no se tocan; la cabecera apunta a las de `og-brand/`. |

Los colores salen de `src/css/00-tokens.css`: cambiar el acento es un solo cambio ahí y volver a ejecutar el script.
**Tras `npm run images`, vuelve a ejecutar `node scripts/brand.mjs`**: `scripts/images.mjs` todavía reescribe los
iconos de `public/` con un cuadrado liso (mientras no se quite su función `favicons()`).

**Tema.** Un botón en la cabecera (junto al idioma, también en móvil) recorre Automático → Claro → Oscuro; la
elección se guarda en `localStorage['hv-theme']` (Automático borra la clave). Un script mínimo en `<head>`, antes
del CSS, pone `data-theme` en `<html>` antes del primer pintado (sin parpadeo); `theme.js` (con `defer`) mueve el
botón, su etiqueta y los `theme-color`. Los tokens aplican la paleta oscura con `:root[data-theme="dark"]` o con
sistema oscuro y sin `data-theme="light"`. Las hojas de estilo solo leen tokens: **una regla propia con
`@media (prefers-color-scheme)` no obedece al botón** (`npm run check` lo avisa; si hace falta una diferencia por
tema, se añade un token, como `--plan-invert`). La paleta oscura aparece dos veces en `00-tokens.css` (el QA exige
que coincidan) y `docs/design/tokens.css` es una copia idéntica.

---

## 3. Netlify

1. **Crear el sitio** desde el repositorio Git: *Add new site → Import an existing project* → elige el
   repositorio y la rama principal. `netlify.toml` ya fija todo:
   - comando `npm run build && npm run check` y carpeta `dist`,
   - Node 24 (`NODE_VERSION`),
   - funciones en `netlify/functions` (IndexNow tras cada deploy de producción) y *edge functions* en
     `netlify/edge-functions` (Markdown para agentes; se declara en el propio fichero y solo se ejecuta
     si la petición pide `Accept: text/markdown`),
   - *pretty URLs* desactivadas.

   No añadas cabeceras, redirecciones ni *snippet injection* en la interfaz: `_headers` y `_redirects`
   los genera el build (una regla duplicada en la interfaz se fusiona y rompe la CSP o el visor embebido).
2. **Variables de entorno** (*Site configuration → Environment variables*):
   - `ALLOW_PLACEHOLDERS=1` **solo en el contexto Production y solo antes del lanzamiento**, si quieres
     publicar la web en `*.netlify.app` con datos provisionales (las páginas siguen en `noindex`).
     **Bórrala el día del lanzamiento**: desde entonces un dato provisional vuelve a bloquear el deploy.
   - Las *deploy previews* y los *branch deploys* no la necesitan: ahí los datos provisionales son avisos.
3. **Dominio**: *Domain management* → añade el dominio, apunta el DNS (o usa Netlify DNS) y activa HTTPS.
   La versión principal (con o sin `www`) tiene que ser la misma que `site.domain`; Netlify redirige la otra.
4. **Deploy previews**: cada *pull request* genera una vista previa con el mismo QA.
5. **Comprobaciones en la primera vista previa (deploy preview) y tras el primer deploy de producción.**
   En local todo esto ya pasa con `build/serve.mjs`, pero Netlify decide dos cosas por su cuenta: la barra
   final con `pretty_urls = false` y la *edge function* de Markdown. Automático:

```bash
node scripts/geo-harness.mjs --live https://deploy-preview-1--<sitio>.netlify.app   # 0 fallos
```

   Lo mínimo que tiene que dar (a mano, sustituye la URL):
   `curl -sI $D/precios` → `301` con `location: /precios/`;
   `curl -sI -H "Accept: text/markdown" $D/precios/` → `200`, `content-type: text/markdown`, `vary: Accept`,
   `link: <…/precios/>; rel="canonical"`; `curl -sI $D/en/no-such-page/` → `404` con la página 404 en inglés.
   Si algo falla, no lances la web: revisa `netlify.toml` y `netlify/edge-functions/markdown.js`.
   Más comprobaciones:

```bash
D=https://www.tudominio.com
curl -sI $D/ | grep -i -E "content-security-policy|strict-transport|x-content-type"
curl -sI $D/models/villa.glb | grep -i -E "content-type|access-control|cache-control"      # model/gltf-binary
curl -sI $D/models/villa_maqueta_1a20.usdz | grep -i content-type                          # model/vnd.usdz+zip
curl -sI $D/embed/villa/ | grep -i -E "content-security-policy|x-robots-tag"                # frame-ancestors * · noindex, indexifembedded
curl -sI $D/no-existe/ | head -1                                                           # HTTP/2 404 (404 en español)
curl -sI $D/en/no-such-page/ | head -1                                                     # HTTP/2 404 (404 en inglés)
curl -s -H "Accept: text/markdown" $D/precios/ | head -5                                   # Markdown (edge function)
curl -s $D/robots.txt | head -20 ; curl -s $D/llms.txt | head -20
```

   Abre la home y el caso de la villa con la consola del navegador abierta: **0 errores de CSP**; el visor
   carga con texturas al pulsar «Ver la villa en 3D» y los modos Maqueta/Muros completos funcionan.
   Prueba la realidad aumentada en un iPhone (Safari) y en un Android con ARCore escaneando el QR del caso.

---

## 4. Formularios (Netlify Forms) y avisos por email

- El formulario `presupuesto` (página de contacto y final de la home) se detecta en cada deploy. En
  *Forms* activa *Form detection* si está desactivado y comprueba que aparece «presupuesto».
- **Avisos por email**: *Site configuration → Notifications → Emails and webhooks → Form submission
  notifications → Add notification → Email notification*, formulario `presupuesto`, al correo del estudio.
  Añade el remitente de Netlify a contactos para que no vaya a spam. (Opcional: Slack o *webhook* a un CRM.)
- **Antispam**: el formulario lleva *honeypot* (`bot-field`); deja activado el filtro de spam de Netlify.
- **Adjuntos**: el plano se sube con el formulario (límite de Netlify: 8 MB por envío); la web ofrece
  pegar un enlace de descarga para archivos mayores.
- **Prueba real**: envía una solicitud con un PDF pequeño, comprueba que llega el email y que redirige a
  `/gracias/` (o `/en/thanks/`); revisa los campos ocultos (`utm_*`, `referrer`, `landing`) y «¿Cómo nos
  conociste?» (ChatGPT, Perplexity, Gemini, Claude, Copilot, Google…): es la mejor medida de la IA.
- Los envíos contienen datos personales: responde en plazo y borra los que no se conviertan (RGPD).

---

## 5. Google Search Console

1. Añade una **propiedad de dominio** (verificación por registro TXT en el DNS).
2. **Sitemaps** → envía `https://www.tudominio.com/sitemap.xml` (índice con `sitemap-pages.xml` y
   `sitemap-images.xml`).
3. **Inspección de URL** → solicita la indexación de: home ES y EN, los 5 servicios, precios, caso de la
   villa, cómo funciona y contacto.
4. **No** actives ningún control de exclusión de funciones de IA generativa.
5. Cada mes: informe de rendimiento en IA generativa (AI Overviews, AI Mode), indexación y Core Web Vitals.

## 6. Bing Webmaster Tools + IndexNow

1. En Bing Webmaster Tools, **importa el sitio desde Search Console** (trae la verificación y el sitemap).
2. **Primer envío completo por IndexNow** (Bing, Yandex, Seznam, Naver, Yep) el día del lanzamiento,
   después del primer deploy de producción con el dominio real:

```bash
npm run build
npm run indexnow -- --all            # revisa la lista (no envía nada)
npm run indexnow -- --all --submit   # comprueba que /<clave>.txt está publicado y envía todas las URL
```

3. Después es **automático**: el build compara el *hash* de cada página (su Markdown, título, descripción
   y JSON-LD) con el manifiesto publicado (`/indexnow-manifest.json`) y escribe `/indexnow-pending.json`; al publicarse cada deploy de
   **producción**, `netlify/functions/deploy-succeeded.mjs` envía solo las URL nuevas, cambiadas o
   eliminadas. Se ve en *Logs → Functions → deploy-succeeded* (`[indexnow] HTTP 200 · N URL(s)`).
4. Cada mes: informe **AI Performance** de Bing (citas, páginas citadas y *grounding queries*: son ideas
   de contenido).

## 7. Brave Search (el índice que usa Claude)

Envía en <https://search.brave.com/submit-url> la home, los 5 servicios, precios y el caso (sin cuenta).
Repite tras cambios grandes. Brave sigue las reglas de Googlebot: por eso `robots.txt` nunca bloquea
contenido a Googlebot.

---

## 8. Google Business Profile (negocio de área de servicio)

- Crea el perfil como **negocio de área de servicio**: sin dirección visible si no hay oficina abierta al
  público (la dirección se usa solo para verificar). Área: Marbella, Málaga y Costa del Sol (puedes añadir
  más municipios; no pongas toda España).
- Categoría principal: la más cercana disponible (prueba «Diseñador arquitectónico», «Agencia de diseño»
  o similar); secundarias relacionadas.
- Nombre, teléfono y web **idénticos** a los de la web. Web con UTM:
  `https://www.tudominio.com/?utm_source=gbp&utm_medium=organic`.
- Descripción = la frase canónica (`site.entity.es`). Servicios con los precios de `pricing.mjs`.
  Fotos = renders de la villa (indica que son renders). Publica novedades cuando haya un caso nuevo.
- Pide reseñas reales a cada cliente tras la entrega (nunca incentivadas ni inventadas).
- **Bing Places**: importa desde Google Business Profile. **Apple Business Connect**: mismos datos.
- Añade la URL pública del perfil a `site.sameAs` y haz un deploy.

## 9. Directorios y perfiles (las menciones hacen que la IA nos cite)

En todos: mismo nombre, misma frase canónica, mismo teléfono y enlace a la web. Cada perfil creado → su
URL en `site.sameAs` → deploy. Nada de menciones falsas ni reseñas compradas.

| Prioridad | Dónde | Por qué |
|---|---|---|
| P0 | **Google Business Profile**, **Bing Places**, **Apple Business Connect** (§8) | Gemini, Maps, AI Mode, Copilot, Siri |
| P0 | **LinkedIn**: página de empresa + perfil del fundador (cargo y frase canónica), artículos | Canal B2B con agencias; Perplexity y ChatGPT citan LinkedIn |
| P0 | **YouTube** (ES y EN): AR en iPhone (tamaño real y 1:20), recorrido del visor, «del plano al 3D», Shorts de 30 s; descripción con la frase canónica y enlace | Gran predictor de visibilidad en IA |
| P1 | **Sketchfab** (modelos con enlace a la web), **Behance**, **ArtStation** | Portafolio 3D indexable y `sameAs` |
| P1 | **Clutch**, **Sortlist**, **GoodFirms**, **DesignRush** | Los LLM los citan en «mejor agencia de…» |
| P1 | **Houzz** (profesionales), **Habitissimo**, **Páginas Amarillas**, **Cylex**, **Europages** | Datos estructurados de terceros |
| P1 | **GitHub**: una pieza pequeña del pipeline en abierto con README que enlace la web | Autoridad para los LLM |
| P1 | **Comunidad Blender**: artículo técnico en BlenderNation, Blender Artists y r/blender | Menciones y enlaces reales |
| P2 | Prensa del sector (Idealista/news, Inmodiario, Observatorio Inmobiliario, Brainsre.news) y prensa en inglés de la Costa del Sol (Sur in English, The Olive Press, Euro Weekly News) | Menciones editoriales |
| P2 | Listas «mejores estudios de renders/3D en España» y blogs *proptech*: ofrecer la demo AR | Entrar en las listas que usan los LLM |
| P3 | **Wikidata**, solo cuando haya fuentes independientes (prensa, directorios) | Anclaje de entidad |

---

## 10. Medición mensual: panel de *prompts* GEO

Una vez al mes, en ventana privada y sin sesión iniciada, lanza cada *prompt* en **ChatGPT, Perplexity,
Gemini, Google AI Mode, Claude y Copilot**. Apunta en una hoja de cálculo: ¿nos menciona? · ¿cita una URL
nuestra (cuál)? · posición · competidores citados · fecha. Amplía la lista con las *grounding queries* de
Bing y las consultas de Search Console.

**Español**
1. ¿Qué empresa convierte planos en modelos 3D para inmobiliarias en Málaga?
2. ¿Cómo mostrar una vivienda de obra nueva sobre plano en realidad aumentada?
3. ¿Cuánto cuesta un modelo 3D de una vivienda a partir del plano?
4. Alternativa a Matterport para una promoción que aún no está construida.
5. Mejores estudios de renders 3D en la Costa del Sol.
6. Home staging virtual en Marbella: precio.
7. ¿Se puede ver una casa en realidad aumentada en el iPhone sin descargar una app?
8. ¿Cuánto cuesta un render 3D de una vivienda en España?
9. ¿La IA puede convertir un plano 2D en 3D de forma fiable?
10. Tour virtual 3D para anuncios de inmobiliaria sin visitar la vivienda.

**English**
1. Floor plan to 3D model service for real estate agencies in Spain.
2. Company that makes AR models of off-plan property in Marbella.
3. 3D rendering studio on the Costa del Sol for developers.
4. How to show a new-build home in augmented reality without an app.
5. Virtual staging Marbella price.
6. How much does 3D rendering cost in Spain?
7. Interactive 3D floor plan for a property listing.

**KPIs del mes:** visitas desde asistentes de IA, **solicitudes atribuidas a IA** (referrer + campo «¿Cómo
nos conociste?»), citas en Bing AI Performance, impresiones de IA en Search Console y cuota de menciones
del panel. Con esos datos: una guía o un caso nuevo al mes y revisión trimestral de precios y guías.

---

## 11. Qué genera el build para buscadores y agentes

| Fichero | Para qué |
|---|---|
| `/robots.txt` | Todo abierto a buscadores y asistentes de IA con una sola lista de reglas (grupo `*` y grupo explícito idénticos, con el registro `Content-Signal: search=yes, ai-input=yes, ai-train=yes`); cerrado `/models/`; `/embed/` abierto para que Google pinte el visor dentro de las webs que lo incrustan; `Bytespider` bloqueado; `Sitemap:`. |
| `/sitemap.xml` → `/sitemap-pages.xml`, `/sitemap-images.xml` (+ `/sitemap-video.xml`) | Páginas indexables con `hreflang` y `lastmod` = fecha real del contenido; renders; el vídeo del caso cuando una página tiene un bloque `video`. |
| `/llms.txt`, `/en/llms.txt` | Índice para agentes por idioma (< 10 KB cada uno): frase canónica (ES y EN en el raíz), datos clave con precios y plazos, **respuestas rápidas** con forma de pregunta (la guía comparativa responde con su propia entradilla), cada página con su nota (en las guías, la respuesta y la cifra con que abre; si ya tiene respuesta rápida, solo el título). Las guías nuevas entran solas por su plantilla. El raíz enlaza el índice inglés. Teléfono y WhatsApp solo cuando `site.contact` tenga datos reales. |
| `/llms-full.txt`, `/en/llms-full.txt` | Todo el contenido en Markdown, **un fichero por idioma** (≤ 400 KB cada uno, unas 100 000 *tokens*: cabe en una sola lectura de un asistente). Sin índices ni legales (siguen en `llms.txt`); el contenido compartido se cita una vez. |
| `/<ruta>/index.md` | Versión Markdown de cada página indexable; también se sirve en la URL de la página con `Accept: text/markdown`. |
| `/feed.xml`, `/en/feed.xml` | RSS de guías y del caso. |
| `/<clave>.txt`, `/indexnow-manifest.json`, `/indexnow-pending.json` | IndexNow (§6). |
| `/_headers` | Seguridad (HSTS, CSP por página con los *hash* de los scripts en línea, sin `X-Frame-Options`), `/embed/*` enmarcable (`frame-ancestors *`) con `X-Robots-Tag: noindex, indexifembedded` (no sale sola en Google, pero cuenta dentro de la página que la incrusta), MIME y CORS de los modelos 3D, caché inmutable de `/assets/` y `/lib/`, `noindex` en los ficheros para máquinas. |
| `/_redirects` | 301 de `routes.mjs` y 404 por idioma (`/en/*` → `/en/404.html`, `/*` → `/404.html`, con estado 404). Sin reglas comodín con estado 200. |
| `/site.webmanifest` | Nombre («Home View 3D»), nombre corto («HomeView3D»), colores de los tokens e iconos PNG 192 y 512 (`any maskable`). |

## 12. Mantenimiento

- Cada trimestre: precios (`pricing.mjs`), guías y comparativas; `dateModified` solo de lo que cambie.
- Cada mes: panel de *prompts* (§10), informes de IA de Search Console y Bing, formularios.
- Cada 6 meses: lista de *user agents* de IA en `build/lib/machine.mjs` (`ALLOWED_AGENTS`).
- Tras cambiar el acento o el logotipo (`src/css/00-tokens.css`, `docs/brand/concepts/A/`): `node scripts/brand.mjs` y después `npm run build`.
- Si se añade un script en línea a una plantilla, el build recalcula la CSP. Si Netlify inyecta scripts
  (analítica de Netlify, *snippet injection*), la CSP los bloqueará: no los actives.
- USDZ: el QA avisa por encima de 10 MB porque AR Quick Look descarga el fichero entero antes de mostrar
  nada; el GLB web, por encima de 4 MB.
