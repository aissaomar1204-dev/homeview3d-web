# Design review: built site (`dist/`), art direction + UX

> **Date:** 2026-09-28 · **Reviewer:** design QA agent (senior art director + UX) · **Build reviewed:** `dist/` as found (not rebuilt), served with `node build/serve.mjs 8811 dist`.
> **Method:** playwright-cli session `design` (Chromium). 19 URLs × 375 / 768 / 1024 / 1440, light and dark, reduced motion, iPhone and Android user agents for the AR page. Interactions exercised by script (menu, compare slider mouse + keyboard, despiece scroll, calculator, 2-step form + validation, FAQ, viewer load / rooms / tour / walls / top view / AR dialog, language links, keyboard focus).
> **Measured against:** `docs/design/DESIGN-RULEBOOK.md` (Part A, B2, C5, D2), `docs/qa/POLISH-BACKLOG.md`, design-taste-frontend pre-flight, high-end-visual-design, redesign-existing-projects audit, Vercel web-interface-guidelines.
> **Evidence:** everything referenced lives in this folder. `shots/` holds the full matrix (fold captures for every page and width, light + dark, plus interaction states). The `sheet-*` files are full pages cut into side-by-side strips; the `crop-*` files isolate a single defect; the `mock-*` files are in-browser mock-ups of the proposed signature moments (injected CSS/SVG, no source file touched).

---

## 1. Verdict in one paragraph

The site is **correct, calm and clearly not a template**. The B2 "Plano" system is applied with discipline: one añil accent, all-sharp 2px shapes, Archivo expanded headings, a mono voice for data, hairlines instead of cards, honest captions, a real live viewer, real prices. Keyboard, focus, dark mode, reduced motion and overflow all pass. **But it is not yet "increíble".** It reads as a very well typeset technical document, not as the site of a studio whose product is *images*. The three moments that should make a Marbella agency owner lean in are each undersold by a framing defect: the hero maqueta is small and top-aligned, the plan/render slider shows a seam and a 16px handle, and the flagship 3D viewer **crops its own villa** (desktop and mobile). The imagery is monotone: every picture on the site is the same aerial "dollhouse" of the same villa; there is not one eye-level interior, so the "renders fotorrealistas" promise is never actually shown. Inner pages (service, audience, zone, pricing) are FAQ-shaped text walls with the right half of the screen empty. Fixing the P0/P1 list below plus three of the signature upgrades would move this from "trustworthy" to "premium and memorable" without breaking a single rulebook lock or budget.

### Scorecard (1 to 5)

| Area | Score | One-line reason |
|---|---|---|
| Art-direction consistency (B2 locks) | 4.5 | Tokens, shape, accent and type locks hold on every page and in dark mode. |
| First impression / "wow" | 2.5 | Hero model occupies ~24 % of the viewport width and floats high in a flat grey box. |
| Typography | 4 | Archivo expanded is distinctive; H2 capped at 24ch makes 3-line headings; hero/inner leads 36-63 words. |
| Rhythm (home) | 3.5 | Good family variety; one 280px dead gap FAQ → form; two grey bands only. |
| Rhythm (inner pages) | 2.5 | Same "question H2 + bordered answer" block 3-5 times per page, no imagery for 5-8 screens. |
| Imagery | 2.5 | High render quality, zero variety (all aerial cutaways), bento cells not the real media COMP-14 asks for. |
| Signature components | 3 | Viewer is rich but clipped; compare has seam + tiny handle; despiece subtle; cajetín good. |
| Pricing clarity | 3.5 | Clear numbers and calculator; tile rows misaligned (subgrid broken); hub shows a wrong price. |
| Form UX | 3.5 | Excellent a11y behaviour; step button is a weak text link; error state misaligns columns. |
| Mobile | 3 | Solid reflow; bottom bar label wraps and duplicates the hero CTA; viewer poster/live jump; tables clip. |
| Dark mode | 4 | Real parity; only the white plan sheet in the compare slider glares. |
| Accessibility / focus | 4.5 | Skip link, 2px accent outline everywhere, focus return on Esc, inline errors, beforeunload. |
| Conversion | 3 | CTA vocabulary is consistent; case page, guides and contact step 1 lack a strong in-view action. |

### What already works (keep it)
- **Lock discipline:** one accent, 2px radius, no pills, no glass, no shadows on content, no gradients; the page theme never inverts (COLOR-08). Dark mode is a true second theme, not an afterthought (`shots/home-1440-dark-fold.jpg`, `sheet-home-1440-dark-full-x00.jpg`).
- **Voice:** Archivo at width 118 for display gives a recognisable, architectural silhouette; the Geist Mono keys (`Datos clave`, `Día 0`, `GLB / USDZ / BLEND`) feel like drawing annotations, not decoration.
- **Cajetín** (title block with `Rev. 28 sep 2026`) and the process **dimension bar** ("De principio a fin: 3 a 5 días laborables" drawn as a cota) are the best expressions of "the plan is the brand". Build on them.
- **Viewer**: numbered hotspots mirror the room rail, room descriptions update in an `aria-live` note, Maqueta/Muros toggle, Planta view, tour with pause, AR dialog with QR and correct focus return (`shots/caso-viewer-room-salon-1440.jpg`, `shots/caso-ar-dialog-1440.jpg`).
- **Honesty**: every render labelled, `≈` on surfaces, "aprox." footprint, no fake logos or testimonials, "Somos parte interesada" in guides.
- **Engineering hygiene**: no horizontal overflow on any of the 19 pages at 375/768/1024/1440; skip link first; focus ring 2px añil offset 2px on every control tested; reduced motion leaves no hidden content; heavy 3D waits for intent or idle-in-view; language links go to real counterparts with `hreflang`.

---

## 2. Findings

Priority: **P0** broken or embarrassing, **P1** clearly hurts premium feel or conversion, **P2** nice to have. Owner: `front` (engine, viewer, CSS, JS, templates), `content` (copy and data), `assets` (renders, captures, video). Rule IDs cite the rulebook.

### P0

**D-01 · The 3D viewer crops its own villa (desktop poster + live model, and mobile poster).** `front` + `assets`
- Where: every viewer instance: `/#demo`, `/casos/villa-costa-del-sol/`, `/embed/villa/`, service and audience pages. Evidence: `crop-viewer-poster-clipped-1440.jpg`, `shots/caso-viewer-ready-1440.jpg`, `mobile-viewer-poster-vs-live-375.jpg`.
- Problem: the poster asset `villa_viewer_poster-*.webp` has its alpha touching the bottom edge (alpha bbox `171,94 → 693,550` on an 800×550 frame), so the front corner of the villa is sliced flat. The live model uses the same framing (`data-orbit="-32deg 50deg 92%"`), so it is clipped too. On mobile the poster gets `transform: scale(1.6)` (`50-viewer.css` L104-107) which crops both side corners; when the model goes live it shrinks by roughly a quarter: a visible jump (backlog item 6). For a studio that sells models, a cut-off model in the flagship demo is the single most embarrassing defect on the site.
- Fix: (1) Set the default orbit radius to about `108%` (`data-orbit="-32deg 50deg 108%"`) and keep `camera-target` on the footprint centre, then verify the full footprint plus shadow has ≥ 6 % margin on all sides at 16:9 and 16:11. (2) Re-capture `villa_viewer_poster` from exactly that camera (COMP-07 seamless swap). (3) For `< 768px` stop scaling the landscape poster: capture a dedicated 4:5 poster (`villa_viewer_poster_4x5`) from the camera model-viewer actually uses in a 4:5 box, serve it with `<source media="(max-width: 767px)">` inside the poster `<picture>`, and delete the `scale(1.6)` rule. Acceptance: overlaying poster and first live frame at 375 and 1440 shows < 2 % size difference and no clipped edge.

**D-02 · Placeholder contact and legal data are visible everywhere and the WhatsApp CTA dials a non-existent number.** `content`
- Where: footer on every page, `/contacto/`, bottom bar (`wa.me/34600000000`), `/aviso-legal/` (`[RAZÓN SOCIAL]`, `[NIF]`, `[DOMICILIO]`), FAQ answers mentioning `hola@estudio3d.example`.
- Problem: known and correctly gated (`site.mjs` → `noindex` while `placeholder: true`), but any client demo of the "finished" site shows `+34 600 000 000` and `.example` addresses, and the second-most-visible CTA on mobile leads nowhere. Listed as P0 only because it blocks launch and any stakeholder preview.
- Fix: fill `build/data/site.mjs` (`contact`, `legal`, `domain`) before any external preview; until then show the WhatsApp action only when `contact.placeholder === false` (hide the bottom-bar WhatsApp button and the "Otras formas de contactar" block rather than link to a fake number).

### P1

**D-03 · Hero maqueta is small, top-aligned and sits in a visible box.** `front` + `assets`
- Where: `/` and `/en/` at ≥ 1024px (worst at 1024: `hero-768-vs-1024.jpg`), mobile hero under the bottom bar (`shots/home-375-light-fold.jpg`).
- Problem: at 1440×900 the stage is 696×547 but the `<img>` renders 568×365 at the top of a 568×451 `<picture>` box (the `height: 100%` never reaches the img), leaving ~86px of empty stage below. The model fills only ~61 % of its own frame (alpha > 200 bbox `331,53 → 1302,930` on 1600×1029), so the villa is ~345px wide, about 24 % of the viewport. The RGBA shadow-catcher has alpha 1-9 at the frame edges, so a faint rectangle shows against `--color-stage` (`crop-hero-render-rectangle-autocontrast.jpg`). The `sizes="(min-width: 1024px) 60vw"` over-states the slot (~39vw rendered), so desktop downloads the 1200w file instead of 800w.
- Fix (CSS, `20-layout.css` ≥ 1024 block):
  ```css
  .hero__stage { height: min(72dvh, 44vw); padding: var(--space-5); overflow: clip; }
  .hero__stage .pic { display: grid; place-items: center; height: 100%; }
  .hero__stage .hero__img { width: 100%; height: 100%; object-fit: contain; }
  ```
  Markup: `sizes="(min-width: 1024px) 46vw, 100vw"`. Assets: trim the RGBA render to the model + shadow with a 4 % transparent margin and multiply the shadow-catcher alpha by an edge mask that reaches 0 at 3 % from the frame, so no rectangle can appear on any background. Target: model ≥ 50 % of viewport width at 1440, ≥ 88 % of stage width at 375. See `mock-hero-plano-1440.jpg` (only CSS changed plus a 1.3 scale to simulate the trimmed asset) and signature upgrade S1.

**D-04 · Plan/render slider: seam, 16px handle, empty column, white glare in dark mode.** `front` + `assets`
- Where: `/#del-plano-al-3d`, `/servicios/plano-2d-a-3d/`, case page. Evidence: `shots/home-compare-focus-1440.jpg`, `crop-compare-dark-1440.jpg`.
- Problem: the under-layer is a white line plan on `--color-surface`, the over-layer is the `_opaco` render on stage grey with a heavy dark cast shadow on its right edge, so the divider reads as "white sheet vs grey photo" instead of "same drawing, two states". The visible handle is 16×44px (`.compare__handle::after`), weak as an affordance even though the whole stage is the hit area. At 1440 the 459px figure is centred in its column, so its right edge does not align with the container (1332) and the text column has ~450px of empty space under it (backlog 2 and 3). In dark mode the white sheet is the brightest object on the page.
- Fix: use the RGBA `villa_planta_cenital` for the over-layer so both states sit on the same sheet colour (or re-export the line plan on transparent and set `.compare__stage { background: var(--color-stage) }`). Handle: `width: var(--tap-min); height: var(--tap-min); left: calc(-1 * var(--tap-min) / 2)` with two Phosphor carets inside, plus a live value chip *outside* the image under the figure ("Plano 38 %", reuses `aria-valuetext`). Layout: `.compare__figure { justify-self: end; }` so it aligns with the grid edge, and fill the sticky text column with the room legend (name + m², from the viewer data). Dark mode: `@media (prefers-color-scheme: dark) { .compare__layer--under .compare__img { filter: invert(1) hue-rotate(180deg); } }` (line art only; static, not animated). See `mock-compare-plano-1440.jpg` and S2.

**D-05 · Pricing tiles: the subgrid never engages, prices and CTAs are misaligned.** `front`
- Where: home pricing, `/precios/`, service pages. Evidence: `crop-pricing-tiles-misaligned-1440.jpg`.
- Problem: `.pack { grid-row: span 7; grid-template-rows: subgrid; }` targets the `<article>`, but the grid children of `.packs` are the `div.packs__item[role=listitem]` wrappers, so no row is shared. Measured at 1440: price rows at y 7660 / 7634 / 7691 (57px spread), feature lists 7847 / 7820 / 7878, CTAs 7995 / 8088 / 8082 (93px spread), tile heights 623 / 718 / 711. COMP-16 requires aligned title/price blocks and CTAs pinned to the bottom.
- Fix (`40-blocks.css`, ≥ 1024):
  ```css
  .packs__item { display: grid; grid-row: span 7; grid-template-rows: subgrid; }
  .pack { grid-row: 1 / -1; grid-template-rows: subgrid; }
  ```
  Keep the empty `.pack__flag` row so the "Recomendado" row exists in all three tiles.

**D-06 · Contact form: the step-1 action is a text link, and the step-2 error state breaks the two-column alignment.** `front`
- Where: `/contacto/`, home `#contacto`. Evidence: `shots/contacto-step2-errors-1440.jpg`, `sheet-home-1440-light-full-x02.jpg`.
- Problem: "Continuar" is styled as `.link-arrow` (secondary), so the only action of the most important form on the site is the weakest element on screen; inside the form there is no filled button until step 2. When errors appear under Nombre/Email, the right-column inputs (Empresa, Teléfono) stretch to ~60px while the left ones stay 44px, so rows no longer line up: the form looks broken exactly when the user is under stress.
- Fix: render the step button as a filled button that is not counted as a CTA label (e.g. `.btn.btn--step`, same visuals as primary, excluded from the COMP-03 lint) with a trailing arrow icon. Add `.field { align-content: start; }` and `.form__row { align-items: start; }` in `40-blocks.css` so a stretched grid row never grows the input.

**D-07 · Case page first viewport shows no product and no action.** `front`
- Where: `/casos/villa-costa-del-sol/` (`shots/caso-viewer-poster-1440.jpg`, `shots/caso-375-light-fold.jpg`).
- Problem: C5 says the case hero *is* the viewer facade. At 1440×900 the hero is a text block with an empty right half; the stage starts at y=534 and the villa and "Ver la villa en 3D" are below the fold (button bottom at y≈1047). At 375 the 54-word lead fills the screen.
- Fix: make the hero a split (`hero--figure` pattern): H1 + ≤ 20-word lead + "Ver la villa en 3D" on the left (cols 1-5), the viewer facade on the right (cols 6-12) at 4:3; move the long lead into the first answer block. On mobile: H1, short lead, then the stage directly.

**D-08 · All imagery is the same aerial "dollhouse"; bento cells are not the media they claim.** `assets` (+ `front` for placement)
- Where: home bento, `/servicios/`, case gallery, hero figures of inner pages (`shots/home-768-bento.jpg`, `sheet-caso-1440-light-full-x00.jpg`).
- Problem: 100 % of the images (hero, 5 bento cells, 9 gallery renders, inner heroes, CTA bands) are high aerial cutaways of the same villa, several are near-duplicates. There is no eye-level interior anywhere, so "Renders fotorrealistas" is illustrated by another cutaway; "Visor 3D para tu anuncio" shows a top-down render, not the viewer; "Realidad aumentada sin app" shows a cutaway, not a phone capture; "Home staging virtual" is not "the same room in two styles" (COMP-14, SLOP-03 spirit). The 8-second Cycles turntable exists (`build/generated/videos.json`) but is used nowhere (backlog 5).
- Fix: render 3-4 eye-level interiors at 1.60m with lens-shift verticals (IMG-07): salón toward the terrace at golden hour, dormitorio principal, baño en suite, terraza with the olive tree. Capture a real viewer screenshot (toolbar + rail visible) and a real iPhone Quick Look capture for the bento. Render the salón in a second furniture style for home staging. Then: "Renders fotorrealistas" cell = eye-level salón; case gallery opens with the eye-level plates before the cutaways; the turntable becomes a click-to-play plate (S4).

**D-09 · Inner pages are text walls with a lopsided layout.** `front` + `content`
- Where: `/servicios/plano-2d-a-3d/`, `/servicios/realidad-aumentada-inmobiliaria/`, `/soluciones/promotoras-obra-nueva/`, `/zonas/marbella/`, `/precios/`, `/como-funciona/` (`sheet-svc-plano-1440-light-full-x00.jpg`, `sheet-svc-plano-1440-light-full-x01.jpg`, `sheet-precios-1440-light-full-x01.jpg`).
- Problem: the `block--answer` pattern (question H2, bordered answer, small paragraph) repeats 3-5 times per page; 12 of 15 content sections on the plano service page and 14 of 15 on `/precios/` carry no image. Content is left-aligned at ≤ 66ch inside a 1224px container, so the right ~45 % of the desktop screen is empty for 5-8 consecutive screens. LAYOUT-06 (each family at most once) is broken by design here, and scanning buyers see an FAQ, not a studio.
- Fix: give `block--answer` a desktop two-column variant, answer in cols 1-7 and in cols 9-12 one of: a supporting render crop with caption, the relevant cajetín fact, or a sticky mini CTA card ("Precio: desde 149 € + IVA · Pide tu demo"); alternate the side every other answer. Merge adjacent short answers into one block with `h3`s. Insert one full-bleed stage band with an eye-level render (D-08) after the second answer on each service/audience/zone page.

**D-10 · Hero and inner-page leads are 2-3× the budget.** `content`
- Where: home lead 36 words / 6 lines at 375 (LAYOUT-02 and COPY-05: ≤ 20 words, ≤ 4 lines, no price teaser); inner-page leads 48-63 words, 5-6 lines at 1440 and 7-9 lines at 375 (TYPE-06 lead ≤ 48ch measure).
- Problem: the first thing a buyer reads is a paragraph, and the price inside the hero lead is a "price teaser" the rulebook bans in the hero. On mobile the primary CTA of service pages lands at y≈554-581.
- Fix: home: use the reference string "Modelo 3D fotorrealista, visor web y realidad aumentada a partir del plano de la vivienda. En días." (17 words); prices live in the cajetín right below. Inner pages: one ≤ 25-word lead; move the GEO sentence (brand + price + delivery) into the first `block--answer` paragraph where it still sits in the initial HTML.

**D-11 · Mobile bottom bar: two-line WhatsApp label, duplicate CTA in the first screen, covers the hero render.** `front`
- Where: every page < 768px (`shots/home-375-light-fold.jpg`, `mobile-ar-embed-404-service-375.jpg`).
- Problem: `grid-template-columns: auto minmax(0, 1fr)` plus `white-space: normal` makes "Escribir por WhatsApp" wrap to two lines in a 56px bar; on load the hero "Pide tu demo" and the bar "Pide tu demo" are both visible and the bar sits on top of the hero render.
- Fix: `grid-template-columns: 1fr 1fr`; visible label "WhatsApp" with `aria-label="Escribir por WhatsApp"` (COMP-06 names the bar action "WhatsApp (glyph + label)"); add the hero `.actions` to the IntersectionObserver list that hides the bar (it already hides for `#contacto` and the footer), so the bar appears only once the hero CTA scrolls away.

**D-12 · Data tables clip on mobile with no affordance.** `front`
- Where: guides, `/precios/`, `/como-funciona/`, zone pages at 375 (`crop-guide-table-overflow-375.jpg`).
- Problem: 3-4 column tables scroll horizontally inside their wrapper; the third column is cut mid-word ("Efect…", "Tarifas low-") with no edge cue, and the mono `<caption>` scrolls away with the table. Guides are the GEO entry pages, mostly read on phones.
- Fix: below 640px render `.table` rows as stacked definition blocks (`display: grid` per `tr`, `td::before { content: attr(data-label) }`, `data-label` emitted by the template from the `th` text), keep `<caption>` outside the scroller, and for the two genuinely wide comparison tables keep the scroll but add a right-edge fade mask (`mask-image: linear-gradient(to right, #000 85%, transparent)` scoped to the scroller while `scrollLeft < max`).

**D-13 · Services hub shows the wrong price for "Plano 2D a 3D".** `content`
- Where: `/servicios/` list ("Plano 2D a 3D · Desde 490 € + IVA"), EN mirror.
- Problem: the plano service page, cajetín and FAQ all say 149 € + IVA por planta; the hub row says 490 €. On a site whose argument is public, consistent prices, this is a trust bug.
- Fix: `build/data/routes.mjs`, route `servicio-plano`: `pack: 'plano3d'` (currently `pack: 'maqueta'`), or make the hub row read the page's own "desde" price.

**D-14 · AR on phones is a ghost button.** `front`
- Where: viewer toolbar on every page, most important at < 768px (`shots/caso-375-viewer-toolbar.jpg`).
- Problem: "Ver en tu salón" is an accent-outlined button (`.vw-ar-open`), the ghost style COMP-02 bans, and on phones it sits last, after 6 other controls. One-tap AR is the most impressive thing the site can do on a phone.
- Fix: on `(pointer: coarse)` place the AR action first in the toolbar as a filled neutral button (`btn--neutral` with `background: var(--color-ink); color: var(--color-bg)`, AR cube icon), full width; on desktop keep it right-aligned but use `btn--neutral` without the accent outline.

### P2

**D-15 · H2 max-width forces 3-line headlines.** `front` · `20-layout.css` L132 `.block__head > h2 { max-width: 24ch }` makes most H2s break into 3 lines at 44px on a 1440 screen ("¿Se puede hacer un / modelo 3D de una / vivienda solo con el plano?"). Use `max-width: min(32ch, 100%)` and keep `text-wrap: balance`; target ≤ 2 lines for ≤ 60 characters.

**D-16 · 280px dead zone with two hairlines between FAQ and the form (home).** `front` · `60-pages.css` L8 gives `.page-home .form-section` both `margin-top: var(--section-y)` and `padding-block: var(--section-y)` plus a border, and the block head adds its own rule (`crop-faq-to-form-gap-1440.jpg`). Set `margin-top: 0` and drop the `.block__head` border inside `.form-section`.

**D-17 · Home FAQ opens 3 answers in the left column only.** `front` · the first three `<details open>` make the left column ~3× taller than the right (4 closed items), leaving a large empty area. Open only the first item, or balance by splitting the list with CSS columns (`columns: 2; column-gap: var(--space-8)` on the list, `break-inside: avoid` on items).

**D-18 · Cajetín: empty cell and cramped values.** `front` + `content` · 7 facts in a 4-column grid leave an empty eighth slot inside the border on home and `/servicios/` (`crop-cajetin-empty-cell-1440.jpg`); on mobile, values at `--fs-h3` weight 600 wrap to 3-4 lines in 170px cells (`crop-cajetin-375.jpg`). Make the last cell span the remainder (`.cajetin__cell:last-child { grid-column: span var(--rest) }` computed at build) or ship 6/8 facts; set values to `--fs-lead` weight 560, cap each value at ~5 words and move detail to a second mono line.

**D-19 · Despiece reads as a static picture.** `front` + `assets` · the scroll-linked separation is only −41/−83px and the layers carry baked soft shadows that show a faint rectangle on the stage (`shots/home-despiece-1-1440.jpg`). Increase travel to −64/−128px on desktop, fade the shadow alpha at the frame edges (same fix as D-03), and set the legend as three aligned rows with a 16px leader to each layer (drawn cotas, not numbering chips).

**D-20 · Viewer polish.** `front` · (a) The toolbar reflows when "Recorrido" becomes "Pausar recorrido" / "Seguir recorrido" (segmented control jumps ~45px): give the tour button `min-inline-size: 16ch`. (b) After Esc stops the tour the label stays "Seguir recorrido"; reset to "Recorrido" when the tour is stopped rather than paused. (c) At 1024-1279px the room rail is ~110px wide and names wrap to two lines: switch to the chip row above the stage below 1280px. (d) The vendored `model-viewer.min.*.js` prints debug logs (`[$updateSource] called!`, `BAILING OUT EARLY!`, `IntersectionObserver fired!`; 248 lines in this session): strip `console.log` in `npm run vendor:viewer` or pin a clean build.

**D-21 · Calculator silently clamps above 20 homes.** `front` + `content` · typing 600 shows 20 homes and 7.800 €. For a developer this is misleading. Allow any value, keep 390 € up to 20, and above 20 replace the total with "Más de 20 viviendas: te damos precio cerrado por escrito" + the CTA with `unidades` prefilled. Also highlight the active tier row in the volume table (see S6).

**D-22 · Footer and page end.** `front` · four link groups (COMP-20 allows three), the brand paragraph duplicates the GEO sentence, and the sequence CTA band (surface) → "Actualizado" strip (bg) → footer (surface) makes a three-tint stripe. Merge "Recursos" into "Estudio", move the dateline inside the last content block, and let the CTA band flow straight into the footer on the same surface with a single hairline.

**D-23 · AR landing on phones buries the two AR options.** `front` · on iPhone/Android UAs (`shots/ar-villa-iphone.jpg`) the two-line breadcrumb and display-size H1 push "Maqueta 1:20" and "Tamaño real" to the fold; the bottom bar then covers the second tile. This page is where QR scans land: hide breadcrumbs visually on this utility template (keep the JSON-LD), use the `--fs-h2` size for the H1, and hide the bottom bar on `/ar/*`.

**D-24 · Tablet bento becomes a 2×2 of identical cells.** `front` · at 768px the bottom four cells are equal 341px squares (LAYOUT-08: adjacent cells never identical widths). Use `grid-template-columns: 3fr 2fr` then `2fr 3fr` for the two rows at 768-1023px.

**D-25 · Performance leftovers that affect the design budget.** `front` · Home HTML is 72 KB and the case 68.8 KB (budget 60 KB, backlog 8); hero `sizes` mismatch (D-03). Moving FAQ answers that duplicate `/preguntas-frecuentes/` behind shorter summaries on the home, and the inline sprite to an external cached SVG, both help.

**D-26 · "Del plano al 3D" opens with GEO boilerplate.** `content` · the showcase section starts "Estudio 3D es un estudio de visualización 3D en la Costa del Sol que convierte…", the same sentence as the footer. In a visual proof section it reads robotic (SLOP-11). Lead with the proof ("Misma cámara, misma escala: a la izquierda la planta redibujada desde el modelo; a la derecha, el render. Arrastra y compara.") and keep the definition sentence in the footer and the "Por qué" answer.

---

## 3. Signature upgrades (memorable, within the rulebook and budgets)

All six keep MOTION-05 (nothing animates on load above the fold), use only real data (dimension lines are data, IMG-08 exception), add no library, and stay inside PERF budgets.

**S1 · "Lámina" hero: the maqueta as a dimensioned drawing.** `front` + `assets`
Bigger maqueta (D-03) with two static cotas drawn on the stage: 14,10 m along the terrace edge and 9,10 m along the front edge, 1px `--color-line-strong` (3.2:1 on stage), 45° architectural ticks, extension lines with a 6px gap, Geist Mono 13px labels knocked out on `--color-stage`. The caption becomes a drawing label row (a mini cajetín): **Dibujo** "Planta alta, maqueta cortada a 1,15 m" · **Huella** "9,10 × 14,10 m aprox." · **Origen** "Render 3D generado del plano 2D, sin fotos". Registration must not be eyeballed: have the Blender export project the four footprint corners with `world_to_camera_view` into `build/generated/images.json` (`cotas: {a:[x,y], b:[x,y], c:[x,y]}` in image pixels) and have the template emit an inline `<svg viewBox="0 0 W H">` layered over the `<img>` in a wrapper with the same aspect ratio. Cost: < 1.5 KB inline SVG, no JS, no LCP impact. Mock: `mock-hero-plano-1440.jpg` (lines placed by eye for the mock; production uses the projected points). Optional below the fold only: the cajetín's top rule draws in once (already specified as the cota motion in B2).

**S2 · "Calco" compare as a true drawing sheet.** `front` + `assets`
Both layers on one sheet (D-04), a 44px square handle with carets, a value chip under the image, a **true scale bar** under the plan (0-1-2-5 m; the plan is orthographic at ~123 px/m on the 1200w asset, measured from the wall extents 9,1 × 14,1 m; at the 459px display width that is ~47 px/m, so the 5 m mark sits ~235 px from zero), and the room legend with m² in the sticky left column. Upgrade path: export room polygons from the Blender model as an SVG layer; hovering or focusing a legend row outlines that room on both layers in `--color-accent` (state change, `--dur-state`). Add a north arrow only if the source plan has one (otherwise it would be invented data). Mock: `mock-compare-plano-1440.jpg`.

**S3 · "Medidas" toggle in the live viewer.** `front`
A toolbar toggle (`aria-pressed`) that shows live 3D dimension lines on the model: footprint 9,10 × 14,10 m, wall height 2,60 m, cut height 1,15 m in Maqueta mode. Implementation is model-viewer's documented dimensions pattern: hotspots at the bounding-box corners (`data-position` from `getBoundingBoxCenter()`/`getDimensions()` or from the known footprint), an absolutely positioned SVG whose `<line>`s are updated on the `camera-change` event with `queryHotspot()`. About 1.5 KB added to `viewer.js`, loaded only after intent. This turns the core claim ("real geometry at scale, not AI guessing") into something the buyer can switch on.

**S4 · Turntable plate, click to play.** `front` + `assets`
Use the existing 8s Cycles orbit (`villa-turntable.webm` 1.4 MB / `.mp4` 1.5 MB, poster 32 KB) as the first plate of the case gallery and as an optional plate in the home deliverables: `preload="none"`, poster, click to play, muted, `playsinline`, visible pause, caption "Render 3D generado del plano 2D", off under reduced motion (IMG-10, MOTION-08). Cinematic movement with zero load cost.

**S5 · Eye-level "hora dorada" plates.** `assets` + `front`
Three eye-level interiors (D-08) presented as one full-bleed stage band between the process and the live demo on the home, and as the first two images of the case gallery: salón toward the terrace at golden hour (terracotta tiles and olive tree carry the Mediterranean warmth the UI deliberately withholds), dormitorio principal, baño en suite. Same camera height and sun as the rest of the set (IMG-07), captions below, AVIF ≤ 120 KB each at 1440w, lazy. This is the image that makes a Marbella agency owner say "that looks like a photo" and it is currently missing.

**S6 · Calculator that speaks in tiers.** `front`
When the count changes, the matching row of the volume table ("De 10 a 20 · 390 € + IVA") takes the room-rail active style (`--color-accent-soft` + 2px accent bar), the calculator adds "Ahorras 1.200 € frente a precio unitario" in tabular figures, and above 20 homes it switches to a written-quote message (D-21). Pure state change, no animation, a few lines of JS.

---

## 4. Page notes (what to look at first)

| Page | Main issues | Evidence |
|---|---|---|
| `/` | D-03, D-04, D-05, D-11, D-16, D-17, D-18, D-26 | `sheet-home-1440-light-full-x00..02.jpg`, `sheet-home-375-light-full-x00..02.jpg` |
| `/en/` | Parity is good; same fixes apply | `shots/en-home-1440-light-fold.jpg` |
| `/servicios/plano-2d-a-3d/` | D-09, D-10, D-04 | `sheet-svc-plano-1440-light-full-x00.jpg`, `x01` |
| `/servicios/realidad-aumentada-inmobiliaria/` | D-09, D-14 (AR is the product here) | `shots/svc-ar-1440-light-fold.jpg` |
| `/soluciones/promotoras-obra-nueva/` | D-09; the big stat blocks (11.727, 27,9 %) are good data moments but float alone at the left | `shots/sol-promotoras-1440-light-fold.jpg` |
| `/zonas/marbella/` | D-09; no local visual identity (acceptable, IMG-01), consider the S1 drawing label naming "Marbella · villas, áticos, obra nueva" types instead of a map | `shots/zona-marbella-1440-light-fold.jpg` |
| `/casos/villa-costa-del-sol/` | D-01, D-07, D-08; cajetín + "La villa en números" duplicate the same facts twice (COMP-13 at most one) | `sheet-caso-1440-light-full-x00.jpg`, `shots/caso-viewer-*.jpg` |
| `/como-funciona/` | D-09 light; despiece D-19 | `shots/como-funciona-1440-light-fold.jpg` |
| `/precios/` | D-05, D-09, D-21, S6 | `sheet-precios-1440-light-full-x01.jpg`, `shots/precios-calc-12-1440.jpg` |
| `/guias/cuanto-cuesta-un-render-3d/` | D-12; first in-content CTA at y≈8.500px (1440) / 11.500px (375): add one CTA card after the price tables | `crop-guide-table-overflow-375.jpg` |
| `/glosario/` | Good A-Z index; first in-content CTA at y≈13.700px | `shots/glosario-1440-light-fold.jpg` |
| `/preguntas-frecuentes/` | Good grouping with H2 per category | `shots/faq-1440-light-fold.jpg` |
| `/contacto/` | D-02, D-06 | `shots/contacto-step2-errors-1440.jpg` |
| `/servicios/`, `/guias/` | D-13 on the services hub; guides hub is clean | `shots/servicios-1440-light-fold.jpg` |
| `/aviso-legal/` | Plain reading layout as specified; placeholders D-02 | `shots/aviso-legal-1440-light-fold.jpg` |
| 404 | Clean, useful links; fine | `shots/404-1440-light-fold.jpg` |
| `/ar/villa/` | D-23 | `shots/ar-villa-iphone.jpg` |
| `/embed/villa/` | D-01 (clipped poster) | `crop-viewer-poster-clipped-1440.jpg` |

---

## 5. Interaction log (what was tested and passed)

| Interaction | Result |
|---|---|
| Mobile menu (375) | Opens a solid full-screen sheet, focus moves to the first link, Esc closes and returns focus to "Menú", bottom bar hidden while open. Pass. `shots/home-375-menu-open.jpg` |
| Compare slider | Mouse drag to 19 %, Home/End, arrows (step 1), PageUp (+10), `aria-valuetext` "Plano 2D n %" updates, focus ring on the stage. Pass (visual issues D-04). |
| Despiece | Scroll-linked `translateY` 0 → −41 / −83 → 0; reduced motion shows the assembled state. Pass (D-19). |
| Calculator | Stepper and typing work, totals with and without IVA in tabular figures, CTA carries `unidades`; clamps 0 → 1 and 600 → 20 silently (D-21). |
| Form | Step 1 error focuses the first radio with an inline message; step 2 marks `aria-invalid`, focuses the first invalid field, specific email message ("falta la @ o el dominio"), `beforeunload` guard fires. Pass (layout D-06). |
| FAQ | Native `<details>`, answers in HTML, +/− state. Pass (D-17). |
| Viewer | Model-viewer JS fetched only when the section is near (case) or on intent; GLB (3,1 MB) only on click; ready in ~3,9 s locally; rooms move the camera and fill the note; numbered hotspots; Maqueta/Muros toggle; Planta; tour pause/resume; AR dialog with QR, focus on close, Esc returns focus to the trigger. Pass (framing D-01, polish D-20). |
| Language switch | Real counterpart URLs with `hreflang` and `lang` on every page tested. Pass. |
| Keyboard focus | Skip link first; 2px añil outline with 2px offset on nav, CTA, links, slider, stepper. Pass. |
| Overflow | `scrollWidth <= innerWidth` on all 19 URLs at 375 / 768 / 1024 / 1440. Pass. |
| Reduced motion | No element left at opacity < 1, `scroll-behavior: auto`, despiece static. Pass. `shots/home-reduced-motion-process-1440.jpg` |
| Console | Clean except the vendored model-viewer debug logs (D-20d) and the expected 404 on the 404 test URL. |

## 6. Screenshot index

- Mock-ups: `mock-hero-plano-1440.jpg`, `mock-compare-plano-1440.jpg`.
- Defect crops: `crop-viewer-poster-clipped-1440.jpg`, `crop-hero-render-rectangle-autocontrast.jpg`, `crop-pricing-tiles-misaligned-1440.jpg`, `crop-faq-to-form-gap-1440.jpg`, `crop-cajetin-empty-cell-1440.jpg`, `crop-cajetin-375.jpg`, `crop-compare-dark-1440.jpg`, `crop-guide-table-overflow-375.jpg`.
- Comparisons: `hero-768-vs-1024.jpg`, `mobile-viewer-poster-vs-live-375.jpg`, `mobile-ar-embed-404-service-375.jpg`.
- Full-page strips: `sheet-home-1440-light-full-x00..02.jpg`, `sheet-home-1440-dark-full-x00.jpg`, `sheet-home-375-light-full-x00..02.jpg`, `sheet-home-768-light-full-x00.jpg`, `sheet-caso-1440-light-full-x00.jpg`, `sheet-precios-1440-light-full-x01.jpg`, `sheet-svc-plano-1440-light-full-x00..01.jpg`.
- Matrix (`shots/`): `<page>-<width>-<light|dark>-fold.jpg` for 19 pages (light at 375/768/1024/1440, dark at 375/1440), full pages for home, case, pricing, plano service and contact at 1440, interaction states (`caso-viewer-*`, `caso-ar-dialog-1440`, `home-compare-*`, `home-despiece-0..4-1440`, `contacto-step*`, `precios-calc-12-1440`, `home-375-menu-open`, `ar-villa-iphone`, `ar-villa-android`).
- Note: Chromium full-page captures taller than 16.384 px repeat the top of the page (the 375 home is 18.058 px); this is a capture artefact, not a site bug.
