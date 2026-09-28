# Verification after the fix round (fresh eyes)

- **Date:** 2026-09-28.
- **Build:** a clean `npm run build` into `dist/`, served with `node build/serve.mjs 8831 dist`. The local server is HTTP/1.1 and applies `_headers` and brotli.
- **Browser:** playwright-cli session `verify` (Chromium). I also used a Pixel 7 emulation context (touch, Android UA, DPR 2.625) and an iPhone emulation context for the AR page.
- **Screenshots:** evidence is in `docs/qa/verify/`.
  - Fold captures: `<page>-<375|1440>-<light|dark>-fold.jpg`.
  - Interaction states and crops: `caso-1440-live-*.png`, `crop-*.png`, `embed-*.png`, `stage-*.png`.
- **Scope:** read-only. I changed no source file.

## 1. Commands

| Command | Result |
|---|---|
| `npm run build` | OK in 1.6 s. 2 warnings: placeholders active; pricing not confirmed. Home: HTML 67.9 KB, CSS 43.2 KB (shared sheet 24.2 KB), initial JS 28.8 KB, fonts 60.3 KB, LCP image 50.0 KB. |
| `npm run check` | **Exit 1. 5 errors, 5 warnings.** The errors are all ENGINE budgets: home HTML 67.9 KB, EN home 66.1 KB, case 66.0 KB and EN case 65.2 KB (limit 60 KB); home CSS 43.2 KB (limit 40 KB). The warnings are all LAUNCH placeholders. GEO has 0 errors, CONTENT has 0. |
| `node scripts/design-lint.mjs dist` | **Exit 1. 4 errors** (the same 4 HTML sizes), 0 warnings. |
| `node build/validate-content.mjs` | Exit 0. 34 files, 0 errors, 0 warnings. Not written yet: gracias, ar-villa, embed-villa (template-only pages). |

The HTML budget is raw bytes. The same pages are small over the wire:

| Page | Raw | Brotli |
|---|---|---|
| `/` | 67.9 KB | 14.5 KB |
| `/casos/villa-costa-del-sol/` | 66.0 KB | 13.9 KB |

The largest parts:

- **Home:** viewer block 10.5 KB, form 9.4 KB, JSON-LD 8.1 KB (of which FAQPage 3.9 KB).
- **Case:** JSON-LD 11.3 KB (FAQPage 3.7 KB, Article 3.0 KB, 3DModel 1.8 KB, VideoObject 0.6 KB).

## 2. Lighthouse (13.5.0, mobile default preset, headless Chromium 1228, 2 runs each)

| Page | P | A | BP | SEO | FCP | LCP | TBT | CLS | SI | Bytes |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` run 1 | 99 | 100 | 100 | 69 | 1.5 s | 2.1 s | 20 ms | 0 | 1.5 s | 158 KB |
| `/` run 2 | 98 | 100 | 100 | 69 | 1.5 s | 2.1 s | 10 ms | 0 | 1.5 s | 158 KB |
| `/casos/villa-costa-del-sol/` run 1 | 98 | 100 | 100 | 69 | 1.5 s | 2.3 s | 0 ms | 0 | 1.5 s | 182 KB |
| `/casos/villa-costa-del-sol/` run 2 | 98 | 100 | 100 | 69 | 1.5 s | 2.3 s | 0 ms | 0 | 1.5 s | 182 KB |

**SEO 69** comes only from `is-crawlable`. Every page is `noindex` while the placeholders are active, which is on purpose.

**Changes since PERF-A11Y (same server, same Lighthouse version):**

| Metric | PERF-A11Y | Now |
|---|---|---|
| TBT, home | 228 ms | 10–20 ms |
| TBT, case | 173–440 ms | 0 ms |
| Performance, case | 77–93 (unstable) | 98 in both runs |
| FCP, home | 1.11 s | 1.5 s |

- **Case score:** model-viewer no longer loads before intent. Confirmed on Pixel 7: after load and scroll, only `viewer.css` and `viewer.js` were requested.
- **FCP (V-21):** home FCP went up; see that finding.
- **LCP:** 2.1 s (home) and 2.3 s (case) are above the 2.0 s target in BUILD-SPEC §11.
- **Still flagged:**
  - `webmcp-schema-validity` = 0.5 on `/`, on `input#f-rgpd` (V-22).
  - `render-blocking-insight` lists 8 stylesheets on `/` and on the case page (V-21).
  - `image-delivery-insight` estimates 21 KB (home hero) and 32 KB (case poster).

## 3. Interactions exercised

| Interaction | Result |
|---|---|
| Mobile menu (375) | `aria-expanded` works, focus moves to "Servicios", `main` is inert, Esc closes it and returns focus to "Menú". **Pass.** |
| Compare slider | Home, PageUp and arrow keys work, and `aria-valuetext` is "Plano 2D 11 %". Checked: 44 px handle, value chip, scale bar 0-1-2-5 m, room legend, inverted plan in dark mode. **Pass.** |
| Calculator | 4 homes → 1.960 €, 5 → 418 € and "Ahorras 360 €", 12 → 4.680 € and "Ahorras 1.200 €", 20 → 7.800 €. At 21 and 600 it shows the written-quote message. The active tier row is highlighted. 0 is clamped to 1. The CTA carries `unidades`, and `/contacto/?servicio=maqueta&unidades=12#contacto` prefills both fields and lands at 80 px. **Pass**, but see V-06 for the note under the table. |
| Form (`/contacto/`) | Step 1 empty: focus goes to the first radio, which has `aria-describedby="f-tipo-error"` and `aria-invalid`, and the status reads "Revisa los campos marcados.". Step 2: "Paso 2 de 2" is announced. Empty submit: 3 fields are marked `aria-invalid`, all inputs stay 44 px and rows stay aligned. A bad email gets its specific message. The `beforeunload` guard fires. No POST was sent. **Pass.** |
| Viewer (case, 1440) | The model loads in 2.4 s, the live region announces it, and focus moves to "Vista general". Room selection writes the note (`3. Dormitorio principal, ≈ 16,2 m²…`). Planta, Muros completos, tour and Esc all work (the label resets to "Recorrido"). **Pass**, except the framing (V-01) and the Medidas toggle (V-03). |
| AR dialog (desktop) | Native modal with QR; focus goes to Close; Esc returns focus to "Ver en tu salón". **Pass.** |
| AR on phones | Pixel 7: "Ver en tu salón" is first, full width and filled ink (D-14 fixed). iPhone `/ar/villa/`: both `rel="ar"` tiles appear in the first screen and the bottom bar is hidden (D-23 fixed). **Pass.** |
| Video (case) | `preload="none"`, poster, click to play and pause. No autoplay with reduced motion. **Pass.** |
| Anchors with `content-visibility` | `#demo` lands at 80 px at 375 and 1440. `/precios/#preguntas-frecuentes`, `/precios/#calculadora` and `/#contacto` land at 80 px on a fresh load. **Pass.** |
| Sweep of 31 URLs (ES and EN, 1280) | No console errors and no 4xx except the intentional 404. One H1 per page, no image without `alt`, no empty links, no `{{`/`undefined`/`NaN`. The only horizontal overflow is `/embed/villa/` (V-04). |
| Overflow on the 6 key pages | `scrollWidth == innerWidth` at 375 and 1440, light and dark. |
| Reduced motion | After a full scroll, 0 elements have opacity below 1 and 0 animations are running. |

## 4. Verified as fixed

**Design review:**

| Item | What I checked |
|---|---|
| D-03 / S1 | Larger "Lámina" hero with cotas registered to the model. |
| D-04 / S2 | Compare slider rework. |
| D-05 | Pricing prices and CTAs share rows. |
| D-06 | Filled "Continuar"; aligned error state. |
| D-09 | Answer asides and one image band. |
| D-11 | Bottom bar is one line, 60 px, hidden while the hero CTA is visible. |
| D-12 | Stacked tables on phones. |
| D-13 | The services hub shows 149 €. |
| D-14, D-16, D-23, D-26 | Fixed. |
| D-18 | The empty cell is fixed (the last cell spans 2). The type-size part is still open (V-11). |
| D-20b, D-20d | Tour label resets; console is clean. |
| D-21 / S6 | Calculator tiers, savings and written-quote message. |
| S3 | The Medidas toggle now exists, but see V-03. |
| S4 | Video plate. |

**Perf/a11y audit:** P1-A, P1-B (`ar` is not set on model-viewer), P1-C (TBT), P1-E, P2-3, P2-4, P2-5, P2-8 and P2-9.

**SEO/GEO audit:**

| Item | What I checked |
|---|---|
| G-01 | `wordCount` is 2551 on the render guide and 2518 on the case. |
| G-02 | The promotoras Offer is 1490; the plano service has 149 and 490. |
| G-06 | Crawlable and `indexifembedded`; `nofollow` is still missing (V-16). |
| G-09 | Real `Content-Signal` record. |
| G-12 | Headers on the IndexNow files. |
| F-03 | VideoObject and `sitemap-video.xml` in the index. |
| F-05 | RSS `<link>` and `article:*_time`. |
| C-01 | Marbella lead. |
| C-03 | The renders FAQ question is gone. |
| C-06 | "Alternativa a Matterport" titles. |

**Factual checks:** the case figures match `dist/models/villa.report.json` (178.704 triangles, 82 materials, 39 textures, 11.26 MB → 3.13 MB, which is under a third). The AR file sizes 5,3 / 8,2 / 7,0 / 7,9 MB match the files.

## 5. Findings that remain

Owner keys: `front` (engine, viewer, CSS, JS, templates, `ui*.mjs`), `geo`, `content`, `assets`, `orchestrator` (decisions, unowned data files, docs).

### P0

**V-01 · The flagship viewer still crops its own villa (D-01).** Owner: `assets`.
- **Where:** every viewer instance: the case hero, the home `#demo` band, `/embed/villa/`, and the service and audience bands.
- **Problem:** the markup still has `camera-orbit="-32deg 50deg 92%"`.
  - At 1440 and 1024, the front corner of the villa is sliced by the bottom edge of the stage, in the poster (`caso-1440-poster-stage.png`) and in the live model (`caso-1440-live-home.png`).
  - At 375 and 412, the 4:5 mobile poster and the live model both cut the east corner at the right edge (`caso-375-poster-stage.png`, `caso-pixel7-live.png`).
  - At 1024 and 700 px, the start button also covers the model.
- **Fix:**
  1. In `build/data/villa.mjs`, set `viewer.cameraOrbit` to `'-32deg 50deg 108%'` and `cameraTarget` to the footprint centre (`'4.55m 0.3m -7.02m'`).
  2. Re-capture `villa_viewer_poster` (16:11) and `villa_viewer_poster_mobile` (4:5) from exactly that camera.
  3. Re-run `scripts/images.mjs`.
- **Acceptance:** the footprint plus shadow keeps at least 6 % margin at 16:9, 16:11 and 4:5, and the poster and the first live frame differ by less than 2 %.

**V-02 · Placeholder contact and legal data, and a WhatsApp CTA that dials a fake number (D-02).** Owner: `orchestrator`.
- **Where:**
  - `wa.me/34600000000` appears on 65 HTML pages: the bottom bar on every page under 768 px, the contact aside, and the CTA bands.
  - `/aviso-legal/` shows `[RAZÓN SOCIAL]`, `[NIF]` and `[DOMICILIO]`.
  - The footer shows `hola@estudio3d.example` and `+34 600 000 000`.
- **Problem:** this blocks launch and any stakeholder preview.
- **Fix:** fill `build/data/site.mjs` (contact, legal, domain) and set `placeholder: false`. Until then, front should render the WhatsApp actions (bottom bar, "Otras formas de contactar", CTA-band link) only when `site.contact.placeholder === false`.

### P1

**V-03 · The new "Medidas" toggle ships visibly broken.** Owner: `front`.
- **Where:** `src/js/viewer.js` lines 271–288, on every viewer.
- **Problem:**
  - **Struck-through label:** the height label (`1,15 m` or `2,60 m`) sits on the midpoint of its own vertical line, so the line crosses the text (`crop-medidas-label.png`).
  - **Clipped lines:** in the default view, the 14,10 m and 9,10 m lines run off the bottom of the stage and have no visible ends (`caso-1440-live-medidas.png`).
  - **Plan view:** in "Planta" the height line collapses into a tick drawn over its label, and the 9,10 m label is cut by the stage edge (`crop-top-dims.png`).
- **Fix:**
  - Anchor `lh` beside the line, not on it: position it at `${dw + O/2 + 0.9}m`, or use a CSS `transform: translate(8px, -50%)` on the label.
  - While `dimsOn`, dolly out to about 120 % radius and restore the previous orbit when the toggle turns off.
  - Hide the `h` line and the `lh` label when the view is `top`.
  - Add 45° end ticks.
- **Acceptance:** all six endpoints and three labels are inside the canvas in the home and top views, at 16:9, 16:11 and 4:5.

**V-04 · The embed does not fit the iframe it gives to partners.** Owner: `front`.
- **Where:** `/embed/villa/`. The embed code says `width="100%" height="560"`. The styles are in `src/css/52-embed.css` (`.vw--embed .vw-stage { height: 56dvh }` and `70dvh`).
- **Problem:**
  - **Vertical overflow:** `scrollHeight` is 624 at 700, 768 and 900 × 560, 703 at 1024 and 1200 × 560, and 678 at 375 × 560. Partner iframes therefore show an inner scrollbar or clipped text, and the case page's own "Así se ve el visor incrustado" preview shows a cut-off line.
  - **Horizontal overflow at 1280 × 800:** `scrollWidth` is 1358 because `.vw-stage` ends at 1358 px.
- **Fix:**
  - Make `.vw--embed` a `height: 100dvh` grid with rows auto / `1fr` / auto.
  - Give the stage `height: auto; min-height: 0; max-width: 100%`, with no negative gutter.
  - Keep one horizontal chip row for the rooms at every width.
  - In the embed, hide the two hint paragraphs and keep only the size note.
- **Acceptance:** `scrollHeight ≤ innerHeight` and `scrollWidth ≤ innerWidth` at 375×560, 700×560, 1200×560 and 1280×800.

**V-05 · The QA gate is red: `npm run check` and design-lint exit 1 on budgets.** Owner: `orchestrator`.
- **Where:** `build/check.mjs` budgets and BUILD-SPEC §11.
- **Problem:** the budgets that fail are home HTML 67.9 KB (EN 66.1 KB), case 66.0 KB (EN 65.2 KB) and home CSS 43.2 KB. Every other owner is clean. The pages are only 14.5 KB and 13.9 KB brotli, and Lighthouse gives 98–99, so the raw-byte limit is what fails, not user-facing weight.
- **Fix:** decide one of these, then make `npm run qa` green:
  - **(a) Trim the pages.**
    - GEO removes the gallery ImageObjects from the case Article (about −2.3 KB).
    - Front moves the viewer's `data-rooms` descriptions (1.2 KB) to the lazy `viewer.js` payload.
    - Content cuts the home FAQ to 5 items; the whole FAQ block is 4.9 KB today.
    - These trims alone leave the home near 64–65 KB, still over 60 KB.
  - **(b) Re-baseline the budgets.** In `check.mjs` and BUILD-SPEC §11, set HTML to 70 KB raw **and** 16 KB brotli, and CSS to shared ≤ 25 KB plus per page ≤ 45 KB. I recommend (b) plus the GEO trim.

**V-06 · The calculator note contradicts the pricing rule.** Owner: `front`.
- **Where:** `build/data/ui.mjs:165` ('Para viviendas de hasta 150 m² por planta. Precios sin IVA.') and `:480` ('For homes up to 150 m² per floor.'). It is shown under the volume table on `/`, `/precios/` and the EN pages.
- **Problem:** every other source says the tier is by **total** area:
  - the calculator intro right above the table;
  - the pack cartera note in `pricing.mjs:94` ("Viviendas de hasta 150 m²");
  - the JSON-LD `unitText` "por vivienda, hasta 150 m²";
  - the content-editor's "total area everywhere" rule.

  A two-storey home of 250 m² qualifies under the note but not anywhere else.
- **Fix:** ES 'Para viviendas de hasta 150 m² en total. Precios sin IVA.'; EN 'For homes up to 150 m² in total. Prices exclude VAT.'

**V-07 · The case first screen on phones still shows no product (D-07, content part).** Owner: `content`.
- **Where:** `build/content/caso-villa.mjs`, ES and EN.
- **Problem:** the hero lead is 54 words. At 375 and 412 the H1 plus lead fill the first screen, and the viewer stage starts at y ≈ 575 (`caso-375-light-fold.jpg`). The template already supports `heroLead`, but no content uses it.
- **Fix:** add a `heroLead` of 20 words or fewer. ES: «Una villa real de la Costa del Sol, modelada en 3D desde un único plano 2D. Gírala aquí.» EN: "A real Costa del Sol villa, modelled in 3D from a single 2D floor plan. Spin it here." Move the long lead into the first answer block, so the price and GEO sentence stay in the HTML.

### P2

| ID | Owner | Where | Problem | Fix |
|---|---|---|---|---|
| V-08 | front | FAQ blocks at ≥ 1024 px on `/`, the case page and services | The first 3 items open in the left column. The left column is 676–730 px tall and the right one 223–269 px, leaving about a 450 px hole (D-17). | Keep 3 open (GEO), but lay out the list with `columns: 2; column-gap: var(--space-8)` and `break-inside: avoid` on each `details`. |
| V-09 | front | Every page under 768 px, at the end of the page | `body { padding-bottom: 60px }` stays while the bar is hidden over the footer, so a 60 px strip of body colour (#f4f5f6) shows under the lighter footer (#fcfcfd). | Move the reserved space into `.site-footer` `padding-bottom` below 768 px, and drop it from `body`. |
| V-10 | front | Viewer on a landscape phone (667×375) | The stage is 464×319 and left-aligned, with 203 px empty on the right, and the bottom bar covers "Ver la villa en 3D" (`caso-667x375-landscape.jpg`). This is what remains of P1-F. | Centre a capped stage (`margin-inline: auto` or `justify-self: center`), and hide the bottom bar at `(max-height: 500px)` or while the viewer stage intersects. |
| V-11 | front | Cajetín on service, pricing and case pages | Values are 26 px (`--fs-h3`) and wrap to 3–4 lines, for example "Planta cenital, vista isométrica y planta 2D; con la maqueta, modelo 3D" (D-18, second half). | Set values to `--fs-lead` weight 560, and allow a mono second line for detail; content should cap each value at about 5 words. |
| V-12 | front | `build/lib/components.mjs:313` (the "Próximamente" line on `/`) | The line reads «Vídeos cinematográficos con IA y Tours de realidad virtual 360°.», with a capital T in the middle of a sentence. | For ES, lowercase the first letter of every title after the first before joining, or add short labels to `deliverables.mjs`. |
| V-13 | front | Image band (`plateBand` in `build/lib/blocks.mjs`) on `/precios/` and `/servicios/plano-2d-a-3d/` | At 1440 the `img` box is 1224 px, but `object-fit: contain` draws the picture 878 px wide and centred. The caption starts at x = 108 and the image at x = 281, so they don't line up (`precios-1440-plate-band.jpg`). | Size the figure to the image (`width: fit-content; margin-inline: auto`), or use a fixed aspect with `object-fit: cover`. |
| V-14 | front | `priceCard()` in `build/lib/blocks.mjs:89-96` | Routes without a `pack` fall back to plano3d. On `/precios/`, next to "¿Hay precio especial para agencias con varias viviendas?" (maqueta cartera 418 € / 2.090 €), the card says "Desde 149 € + IVA · Entrega en 2 a 3 días". | Take the pack from the first `{{price:x}}` token in that answer, or skip price cards on the pricing template. |
| V-15 | content | `build/content/guia-precio-render.mjs` (ES/EN), `glosario.mjs` | The first in-content contact CTA is at y = 15.042 of 20.831 px (render guide, 375) and 8.426 of 12.688 (1440). In the glossary it is at 18.130 of 20.040 px (375). The design-review page notes asked for a CTA card after the price tables. | Add a `cta` or callout block right after the first market table (and after the glossary intro), for example «¿Quieres tu precio cerrado? Pide tu demo con el plano.» |
| V-16 | front | `build/templates/embed.mjs:25` | The embed credit link is `rel="noopener"` with no `nofollow` (G-06 remainder; widget-link policy). | Use `rel="noopener nofollow"`. |
| V-17 | front | `build/data/ui.mjs:306` and `:621` (thanks page) | No reply time is given (F-22). | ES: append « Te contestamos en 24 h laborables.»; EN: append " We reply within one working day." |
| V-18 | geo | `build/lib/machine.mjs:276` and `:288`; `build/data/pricing.mjs` `maqueta.includes` | The pages say the complete model ships with GLB, USDZ and BLEND: the bento reads "GLB / USDZ / BLEND" and the service cajetín reads "con la maqueta, GLB, USDZ y BLEND". But llms.txt and llms-full say "(GLB y USDZ)", and the pack includes list has no BLEND. AI assistants read the machine files. | Once the owner confirms (CLIENT-CONFIRMATIONS §5), write "(GLB, USDZ y BLEND)" / "(GLB, USDZ and BLEND)" and add BLEND to `includes`. If the owner does not confirm, remove BLEND from the page copy. |
| V-19 | content | `build/content/zona-marbella.mjs:160` | «Villa de 150 a 300 m² en total» overlaps the «hasta 150 m²» band (F-35/F-38). | «Villa de más de 150 y hasta 300 m² en total». |
| V-20 | orchestrator | `build/data/process.mjs:24-25` (step 4, shown on `/`, `/como-funciona/` and services) | «…y los aplicamos en dos rondas.» leaves out the 24 h condition that the site states everywhere else (F-21 data side). | «…y los aplicamos en dos rondas si nos envías cada lista en 24 h.» / "…if you send each list within 24 hours." (pending owner confirmation). |
| V-21 | front | CSS modules (`build/lib/assets.mjs` `modulesFor`) | The home and the case page now each have 8 render-blocking stylesheets (shared sheet plus 7 modules). Lighthouse `render-blocking-insight` scores 0 (estimated 540 ms). Under the same local HTTP/1.1 server and Lighthouse version, home FCP rose from 1.11 s to 1.5 s, and LCP (2.1 s home, 2.3 s case) stays above the 2.0 s target in §11. | Re-measure on a Netlify deploy preview (HTTP/2) first. If the rise holds, emit one hashed bundle per module set, so each page has at most 2 render-blocking CSS requests. |
| V-22 | front | Form template, `input#f-rgpd` | Lighthouse 13.5 `webmcp-schema-validity` is still 0.5 on `/`. Chrome reports `FormModelContextParameterMissingTitleAndDescription` for the rgpd checkbox, although it has `toolparamdescription` (the `tipo` radios are no longer flagged). | Add `toolparamtitle` to the checkbox as well (for example "Privacidad aceptada"), then re-run Lighthouse. |
| V-23 | front | `build/data/ui-viewer.mjs:129` | EN desktop reads "Interactive 3D model, 3.1 MB. Downloads when you tap." (visible at 1440). | "Downloads only when you open it." (the ES «al pulsar» is fine). |
| V-24 | content | `build/content/caso-villa.mjs` | The case shows the same facts twice: the "Datos clave" cajetín and "La villa en números" repeat surface, rooms, images, web model and AR (COMP-13 allows one; design-review page notes). | Keep the cajetín for the 8 headline facts, and cut "La villa en números" to the technical rows that are not in the cajetín (textures, materials, triangles, wall height, file sizes). |
| V-25 | orchestrator | `docs/build/BUILD-SPEC.md:47` and §2 step 2 | The spec still describes a single `site.css`. | Use the front agent's proposed text (`@module` files → `/assets/css/<name>.<hash>.css`, linked by `modulesFor`; `53-viewer-live.css` added on intent). |

## 6. Not re-reported: open decisions already owned elsewhere

- O-01 / F-01: brand, domain, legal data, and `pricing.confirmed`.
- O-02: founder person.
- O-03: "best studios" list page.
- O-04: EN floor-plan cost guide.
- F-35: the LSSI question for the lawyer.
- D-08 / S-5: eye-level interiors and a real viewer or Quick Look capture.
- A-01: per-template OG cards.
- G-13: live check on a Netlify deploy preview.

The fixers listed these correctly as blocked on the owner or on assets.
