# Performance + accessibility audit

- **Date:** 2026-09-28
- **Build audited:** `dist/` as built (not rebuilt), served locally with `node build/serve.mjs 8814 dist`. The local server applies `_headers` (CSP, cache) and brotli, like Netlify.
- **Tools:**
  - Lighthouse 13.5.0 (Chromium 149 headless, from Playwright). Mobile runs use the default preset (slow 4G simulated, 4× CPU); desktop runs use `--preset=desktop`.
  - axe-core 4.13.0: 16 pages × light/dark × 1280/375 through a Playwright script, cross-checked on 4 EN pages with `playwright-cli -s=a11y run-code`.
  - Custom Playwright checks for keyboard flows, target sizes, reflow at 320 px and 640 px, text spacing, reduced motion, forced colors, bfcache, Event Timing latency at 4× CPU, image sizing, CSS coverage, and an A/B layout-cost test.
- **Scope:** audit only. No source file was changed. Screenshots are in this folder.

## Verdict

The accessibility base is strong:

- **axe:** 0 violations on 16 pages, in light and dark, at 1280 and 375 px.
- **Lighthouse:** Accessibility 100 and Best Practices 100 on every run.
- **Keyboard:** every flow works. This covers the skip link, the menu (focus trap, Esc, focus return), the slider, the stepper, the form, the FAQ, the viewer and the AR dialog.

Desktop performance is 100 on all 7 pages. Mobile performance is 95–99, except the case page at **77–93**, where model-viewer loads before the user asks for it.

The remaining problems:

1. model-viewer (260 KB br / 1 MB) preloads without intent on `/casos/…`. It also turns off bfcache on every page where it loads (WebXR probe).
2. A forced synchronous layout in `main.js` (reveals) makes TBT 138–241 ms on every mobile page.
3. The mobile bottom bar grows to 74–94 px, but the page reserves only 60 px for it. At 320 px it fully covers focused links, which fails WCAG 2.2 2.4.11.
4. The viewer stage breaks in short/narrow viewports (landscape phones, 200 % zoom): a 250 px left-aligned box with a cropped poster.

SEO scores 66–69 only because of `noindex` (placeholder phase; `is-crawlable` is the only failing SEO audit). This is expected and ignored here.

---

## 1. Lighthouse scores

**P / A / BP / SEO** = Performance / Accessibility / Best Practices / SEO. SEO is 66–69 only because of `noindex`. Metrics come from Lighthouse's simulated throttling. TBT is the INP lab proxy; max-FID is max potential FID.

| Page | Preset | P | A | BP | SEO | FCP | LCP | TBT | CLS | SI | max-FID | Bytes | LCP element |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | **95** | 100 | 100 | 69 | 1.11 s | 2.10 s | **228 ms** | 0 | 1.18 s | 278 ms | 232 KB | hero `img` villa_maqueta_iso-800.avif |
| `/` | desktop | 100 | 100 | 100 | 69 | 0.40 s | 0.47 s | 0 | 0 | 0.43 s | 82 ms | 252 KB | hero `img` …iso-1200.avif |
| `/en/` | mobile | **95** | 100 | 100 | 69 | 1.06 s | 2.03 s | **241 ms** | 0 | 1.06 s | 291 ms | 232 KB | hero `img` …iso-800.avif |
| `/en/` | desktop | 100 | 100 | 100 | 69 | 0.38 s | 0.47 s | 0 | 0.002 | 0.45 s | 86 ms | 252 KB | hero `img` …iso-1200.avif |
| `/servicios/plano-2d-a-3d/` | mobile | 98 | 100 | 100 | 69 | 0.91 s | 1.66 s | 147 ms | 0 | 0.91 s | 197 ms | 120 KB | `p.lead` (text) |
| `/servicios/plano-2d-a-3d/` | desktop | 100 | 100 | 100 | 69 | 0.24 s | 0.42 s | 0 | 0 | 0.27 s | 35 ms | 222 KB | hero `img` …iso-800.avif |
| `/casos/villa-costa-del-sol/` | mobile | **77–93** (4 runs: 89, 84, 93, 77) | 100 | 100 | 69 | 1.1–2.0 s | **2.0–3.8 s** | **173–440 ms** | 0 | 1.1–2.0 s | 220–432 ms | 396 KB | poster `img` villa_viewer_poster-800.avif |
| same, model-viewer blocked (A/B) | mobile | **97–99** | 100 | 100 | 69 | 1.19 s | 1.96 s | 78–164 ms | 0 | 1.19 s | 155–226 ms | 128 KB | same |
| `/casos/villa-costa-del-sol/` | desktop | 100 | 100 | 100 | 69 | 0.30 s | 0.45 s | 0 | 0 | 0.39 s | 42 ms | 413 KB | poster `img` …poster-1200.avif |
| `/precios/` | mobile | 98 | 100 | 100 | 69 | 0.91 s | 1.51 s | 180 ms | 0 | 0.91 s | 230 ms | 91 KB | `p.lead` (text) |
| `/precios/` | desktop | 100 | 100 | 100 | 69 | 0.25 s | 0.37 s | 0 | 0 | 0.29 s | 38 ms | 91 KB | `p.lead` |
| `/guias/cuanto-cuesta-un-render-3d/` | mobile | 98 | 100 | 100 | 69 | 0.91 s | 1.66 s | 158 ms | 0 | 0.91 s | 208 ms | 126 KB | figure `img` villa_salon_dormitorio-800.avif |
| `/guias/cuanto-cuesta-un-render-3d/` | desktop | 100 | 100 | 100 | 69 | 0.27 s | 0.41 s | 0 | 0 | 0.29 s | 16 ms | 149 KB | figure `img` …-1200.avif |
| `/contacto/` | mobile | 99 | 100 | 100 | 66 | 0.91 s | 1.50 s | 138 ms | 0 | 0.91 s | 188 ms | 89 KB | `p.lead` (text) |
| `/contacto/` | desktop | 100 | 100 | 100 | 66 | 0.31 s | 0.37 s | 0 | 0 | 0.31 s | 16 ms | 89 KB | `p.lead` |

- **LCP discovery is correct everywhere.** The LCP image is in the initial HTML, has `fetchpriority=high`, and is not `loading=lazy`. The LCP breakdown shows almost no load delay. The observed "element render delay" (200–410 ms before throttling) is main-thread style and layout work, not network (see §3).
- **CLS is 0** on every page. The metric-matched font fallbacks work.
- **Best Practices** only flags `valid-source-maps` on the case page. `model-viewer.min.js` ends with `//# sourceMappingURL=model-viewer.min.js.map`, and that map is not shipped.
- **Lighthouse 13 WebMCP audit** `webmcp-schema-validity` = 0.5 on pages with the form. The declarative tool `solicitar_presupuesto` is found, but the radio group `tipo` and the checkbox `rgpd` have no parameter description.

## 2. Heavy resources before intent

| Resource | Loads before intent? | Evidence |
|---|---|---|
| `/models/villa.glb` (3.1 MB) and the AR GLB/USDZ | **No.** Only on "Ver la villa en 3D", a room click or the tour. | No request after 3.5 s idle on 9 viewer pages. Requested only after `Enter` on the start button. |
| `/lib/model-viewer/model-viewer.min.js` (1.07 MB raw / **260 KB br**) + `meshopt_decoder.js` (8 KB br) | **Yes, on `/casos/villa-costa-del-sol/` (mobile and desktop) at page load, with no interaction.** On the other 17 pages with `data-preload="visible"` it loads when the user scrolls within 200 px of the viewer. | The script (`viewer.js` l.112-121) runs `warm()` after `load` + idle when the stage intersects, unless Save-Data/2g/3g. On the case page the stage is at y≈556–625, inside the first viewport. Lighthouse includes the request in the LCP graph, which makes mobile swing between 77 and 93. Blocking it gives 97–99 (LCP 1.96 s, TBT 78–164 ms). It also adds a 196–220 ms long task (parse/compile at 4× CPU). |
| model-viewer → **bfcache** | **Ineligible once loaded** | CDP `Page.backForwardCacheNotUsed`: `WebXR (PageSupportNeeded)`. Home not scrolled: restored from bfcache. Home scrolled to the viewer band: **not restored**. `/casos/` idle 5 s: **not restored**. `/precios/`: restored. Cause: `ar ar-modes="webxr quick-look"` (`build/lib/viewer.mjs` l.273). model-viewer calls `navigator.xr.isSessionSupported('immersive-ar')` as soon as it upgrades. |
| `/embed/villa/` iframe on `/casos/` | Lazy (`loading="lazy"`), loads only near the viewport. It then loads its own `viewer.js` with `data-preload="intent"`. | OK |
| Turntable video (`assets/video/*.mp4/webm`, 1.4–1.5 MB) | Not referenced by any page yet (backlog #5). | When it is added: `preload="none"`, poster, click-to-play. |

## 3. Main-thread, render-blocking, unused bytes

- **Render-blocking:** only `site.a0453d73.css`: 52.6 KB raw, 11.5 KB br. Lighthouse estimates 150 ms savings on mobile. JS is `defer` or `module`. No third-party requests. No preconnects needed.
- **Unused CSS** (Chromium coverage after a full scroll): home 51 % used (1280: 59 %), case 43 %, precios 33 %, contacto 31 %, guía 29 %. That is 21–36 KB raw unused per page (≈5–8 KB br). Lighthouse does not flag it because it is under its threshold, but it is the render-blocking file. `50-viewer.css` is shipped to every page.
- **Unused JS:** `main.js` (12.6 KB) and `viewer.js` (14.6 KB, only on viewer pages) are fine. `model-viewer.min.js` has 158 of 259 KB unused on the case page (it is a library; the fix is to not load it early).
- **Forced reflow (every page):** Lighthouse `forced-reflow-insight` points to `main.js` line 56 of the build, which is `src/js/main.js` l.65-73. The code first writes `el.style.setProperty('--i', …)` on every `[data-reveal]` element, then reads `getBoundingClientRect()` on each of them. That costs **56–151 ms of forced layout** per load. It is the **188–291 ms main.js long task** (4× CPU) that produces TBT 138–241 ms on all mobile pages.
- **Style and layout cost:** home mobile at 4× CPU: Style & Layout 638 ms, DOM 875 elements. A/B test at 4× CPU, 375 px, 3-run averages, styles injected in the browser only:

| Page | Baseline task time | `*{text-wrap:wrap}` | `main > section:not(:first-child){content-visibility:auto; contain-intrinsic-size:auto 900px}` |
|---|---|---|---|
| `/` | 725 ms (layout 264, style 136) | 602 ms | **373 ms** (layout 164, style 58) |
| `/casos/…` | 1036 ms | 846 ms | **666 ms** |
| `/precios/` | 449 ms | 462 ms | **406 ms** |

- **Interaction latency (INP proxy, Event Timing API, 4× CPU, 375 px):**

  | Interaction | Latency |
  |---|---|
  | Menu open | 88 ms |
  | Menu close | 16 ms |
  | Compare tap | 40 ms |
  | Calculator + | 16 ms |
  | FAQ toggle | 24 ms |
  | Viewer start tap | 112 ms |
  | Room tap (model ready) | 56 ms |

  All are under 200 ms. The risk to real INP is the 200 ms model-viewer compile landing while the user interacts (P1-A).

- **Images:** every `<img>` has `width`/`height`. Lazy-loading is correct below the fold. AVIF/WebP use 480/800/1200/1600 widths. At 390 px @3x the chosen candidates are right. On desktop, several `sizes` overstate the rendered width, so larger files than needed are fetched (Lighthouse `image-delivery-insight` home desktop ≈101 KB, mobile 20 KB):

| Image (template) | `sizes` | Rendered at 1440 px / 1280 px | Candidate fetched (DPR 1) |
|---|---|---|---|
| Hero `villa_maqueta_iso` (`templates/home.mjs`) | `(min-width:1024px) 60vw` = 864 px | **568 px** | 1200w (800w is enough) |
| Compare `villa_plano_lineas`, `villa_planta_cenital_opaco` (`components.mjs` l.216-217) | `560px` | **394 px** | 800w@1x / 1200w@2x (800w is enough) |
| Case plates (`blocks.mjs` l.108) | `58vw` = 835 px | **496 px** | 1200w |
| Home bento cells 2-5 (`components.mjs` l.274) | `40vw` = 576 px | **288–392 px** | 800w |
| Case poster (mobile) | `100vw` | stage 4:5, poster scaled 1.6× and cropped | backlog #6 |

- **Headers (geo):** fine. Hashed `/assets/*` and `/lib/*` are `max-age=31536000, immutable`. HTML is `max-age=0, must-revalidate`. Text is served with br. Models get 1 day + SWR with correct MIME types. Lighthouse `cache-insight` passes. Nothing to change for performance.
- **Fonts:** `archivo-var` (48 KB) is preloaded. `geist-mono-var` (13 KB) is discovered late through the CSS (critical chain HTML → CSS → font, 242 ms observed), but it is used above the fold (eyebrows, `EN`, cajetín). This is a minor swap, not blocking.

## 4. Accessibility: automated

- **axe-core 4.13** with tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`:
  - **0 violations** on 16 pages × light/dark × 1280/375 (64 runs). Pages: `/`, `/en/`, `/servicios/plano-2d-a-3d/`, `/casos/villa-costa-del-sol/`, `/precios/`, `/guias/cuanto-cuesta-un-render-3d/`, `/contacto/`, `/preguntas-frecuentes/`, `/glosario/`, `/como-funciona/`, `/ar/villa/`, `/embed/villa/`, `/zonas/marbella/`, `/en/contact/`, `/sobre-nosotros/`, 404.
  - Also 0 on the viewer in the *ready* state and with the AR dialog open.
- **Needs review (incomplete):**
  - `color-contrast`: 1–64 per page. Axe could not resolve the background (pseudo-elements, the fixed bottom bar overlapping on mobile, gradients). A custom contrast pass (text colour vs. composited ancestor background, WCAG formula) on 13 pages in light and dark found **0 failures and no text over images**.
  - `aria-prohibited-attr`: `<pre aria-labelledby="vw-embed-code-label">` on `/casos/` (`build/lib/viewer.mjs` l.428). `aria-labelledby` is not allowed on a generic role.
  - `frame-tested`: the embed iframe, tested on its own page → 0 violations.
- **Contrast tokens** (measured): ink-3 captions 5.3:1 on bg (light) and 6.0:1 (dark); line-strong input borders 3.2–3.9:1 (non-text ≥ 3:1). The focus ring (accent) is 8.0:1 light and 8.5:1 dark.

## 5. Accessibility: keyboard and interaction flows

| Flow | Result |
|---|---|
| Skip link | First Tab stop, visible (176×51 px at top 8 px), `Enter` → focus on `main#main` (`tabindex=-1`, no ring on programmatic focus). Pass. |
| Header nav (1280) | Logical order: brand → 5 links → EN → CTA. `aria-current="page"` on Precios. Visible 2 px accent ring on every stop. Pass. |
| Mobile menu (375) | Reached in 4 Tabs. `Enter` → `aria-expanded=true`, label becomes "Cerrar", focus moves to the first link, `main`/`footer`/skip get `inert`, `html` is `overflow:hidden`. Tab and Shift+Tab cycle only through the sheet and the button. `Esc` closes and returns focus to the button. Sheet links are 343×60 px. Pass. Note: the header `EN` link stays visible but is outside the cycle (P2-6). |
| Compare slider | `input[type=range]` with `aria-label` "Comparar plano 2D y modelo 3D" and `aria-valuetext` "Plano 2D 50 %". Arrow keys ±1, PgUp/PgDn ±10, Home/End work. The ring is drawn on the stage (`:has(:focus-visible)`). The hit area is the whole stage (394×608). Pass. The visual handle is small (backlog #2). |
| Calculator stepper (`/precios/`) | Input labelled "Viviendas". − and + have names ("Una vivienda menos/más"), are 44×44 and use `aria-controls`. Results sit in one `<output aria-live="polite">`. `Enter`/`Space` work. Typing 999 clamps to 20, 0 to 1. Pass. |
| Contact form | 16 fields, all labelled. "(obligatorio)/(opcional)" is in the label text. `autocomplete` is on name/org/email/tel/url. **Continuar** with an empty step 1 → focus to the first radio, `aria-invalid`, error text shown. Step 2 → focus to Nombre, "Paso 2 de 2" is announced (`aria-live`). Empty submit → focus to Nombre, 3 fields `aria-invalid`, status `role=status` says "Revisa los campos marcados.", no navigation (POSTs were blocked during testing). Bad email on blur → specific message, cleared when fixed. The file input has an opacity-0 overlay (702×66) with a visible ring. Pass. Radio error is not tied to the radio itself (P2-5). |
| FAQ `<details>` | `summary` is focusable, `Enter` and `Space` toggle, 55 px tall, ring visible. Pass. |
| Viewer (`/casos/`, 1280) | Start button "Ver la villa en 3D" (44 px). `Enter` → `aria-busy` → ready in 2.5 s. The live region (`polite`) says "Modelo 3D cargado…" and focus moves to "Vista general". Toolbar order: Vista general, Planta, Recorrido, Maqueta/Muros (`aria-pressed`), Luz (range with `aria-valuetext`), −/+. A room button sets `aria-pressed=true` and updates the note (`aria-live=polite`). The canvas is `tabindex=0 role=img` with the full alt text. `+`/`-` zoom. The tour is user-started and pauses on Esc or any input (2.2.2 OK). Pass. The 12 room buttons come **before** the start button in tab order (P2-8). |
| AR dialog | Native `showModal()`, `aria-labelledby`, focus to "Cerrar" (44×44). `Esc` and the close button both close it and return focus to "Ver en tu salón". Tab stays in the dialog (wraps via browser chrome). axe 0. Pass. |
| Embed iframe | Titled. Keyboard enters it and leaves after 15 stops (no trap). |
| Language switch | `EN`/`ES` links with `lang` + `hreflang`. They point to the equivalent page (`/precios/` → `/en/pricing/`, `/casos/…` → `/en/case-studies/…`). `<html lang>` is correct. The accessible name "English version" does not contain the visible "EN" (P2-3). |

## 6. Accessibility: visual and preferences

- **Focus visible:** every stop in 5 desktop walks (60–70 Tabs each) and 3 mobile walks shows a 2 px accent outline, or a ring on the wrapper (radios, stepper, compare, index rows).
- **Focus not obscured (2.4.11):**
  - Desktop: no case. The sticky header never covers focus, because `scroll-padding-top` works.
  - Mobile: **the bottom bar covers focus.**
    - The bar is 74 px tall at 375 px and **94 px at 320 px**, because "Escribir por WhatsApp" wraps onto 2–3 lines.
    - `body` `padding-bottom` and `scroll-padding-bottom` are fixed at 60 px.
    - At 320×640, focused links are **entirely hidden**: `studiomkdesign.es` and `ararenders.com` on the render guide, and "Tour virtual 3D" on the case page. Screenshot: `focus-obscured-320_guias_cuanto-cuesta-un-render-3d_.png`.
    - At 375 px, 8–16 elements per page are partially covered.
- **Target size:**
  - 2.5.8 (24 px): passes everywhere, but some links qualify only through the spacing exception.
  - Small but spaced targets: breadcrumbs 16 px tall, footer email/phone 16 px, source links in tables 16 px, the AR link "Abrir la página de realidad aumentada" 16 px, bento titles 22 px.
  - Primary touch controls (buttons, inputs, nav, menu, stepper, viewer toolbar, bottom bar) are all ≥ 44 px. Index rows use a stretched link (whole row).
- **Reflow and zoom:**
  - No horizontal scroll at **320 px** (400 % zoom) or **640 px** (200 % of 1280) on 14 pages. Text spacing (1.4.12 bookmarklet) causes no overflow or clipping.
  - **Viewer stage problem** (`50-viewer.css` l.94-107):
    - Below 768 px the stage is `aspect-ratio:4/5; max-height:78svh`. On short viewports (640×400 ≈ 1280×800 at 200 %, or landscape phones) it shrinks to **250×312 px, left-aligned**.
    - The poster is scaled 1.6× and cropped, so the model is cut off. Screenshots: `reflow-640-viewer.png`, `reflow-320-viewer.png`.
- **Reduced motion:** with `reduce`, no animations or transitions run (`document.getAnimations()` is empty after a full scroll). Smooth scroll is off, the compare "peek" is off, and the despiece scroll-timeline is off. Without the preference: 480 ms reveals, a one-time 900 ms peek, the despiece on a ViewTimeline, and no autoplay. Pass.
- **Forced colors** (light and dark): buttons, inputs, radios, stepper, pricing and viewer all keep their borders, and the compare handle uses `Highlight`. The focus ring survives: it is an outline, rendered double in forced colors. There is no `forced-color-adjust:none`. Screenshots: `fc-*.png`. Pass.
- **Dark theme:** same results as light (axe 0, contrast 0 failures).

---

## 7. Findings (prioritised)

**P0:** none.

### P1

**P1-A (front/viewer): model-viewer loads without intent on the case page.**
- `data-preload="visible"` plus the 200 px `rootMargin` start a 260 KB br / 1 MB import right after `load` on `/casos/villa-costa-del-sol/`, where the stage is in the first viewport.
- Mobile Lighthouse drops to 77–93 (97–99 without it), with a 200 ms parse task and extra data on mobile.
- **Fix (`src/js/viewer.js` l.112-121 and `build/lib/viewer.mjs` l.285/351/364):**
  - Only warm on "visible" when `matchMedia('(pointer: fine) and (min-width: 1024px)').matches` and `navigator.connection?.effectiveType === '4g'`, with no `saveData`, and `(navigator.deviceMemory ?? 8) >= 4`. On touch devices, rely on the existing `touchstart`/`focusin`/`pointerenter` intent.
  - Also defer the first warm until after the first user scroll or pointer event, so a lab load never includes it. For example: `addEventListener('scroll', …, {once:true, passive:true})` before arming the IntersectionObserver.
  - Alternative: set `preload:'intent'` for the case template only.

**P1-B (front/viewer): bfcache is off wherever model-viewer has loaded.**
- `ar ar-modes="webxr quick-look"` makes model-viewer call `navigator.xr.isSessionSupported()`, which registers WebXR. Back and forward navigation to the home page (after the viewer band), the case page and the other 16 viewer pages then do a full reload.
- **Fix:**
  - Remove `ar`/`ar-modes` from the markup (`build/lib/viewer.mjs` l.273).
  - In `viewer.js`, set `mv.ar = true; mv.arModes = PLATFORM === 'android' ? 'webxr scene-viewer' : 'quick-look'` only when `PLATFORM !== 'desktop'`, before `loadLib()`. Desktop only uses the QR dialog anyway.
  - Or drop `webxr` entirely and use `scene-viewer quick-look` (the `/ar/villa/` page already uses Scene Viewer intents).
- Re-test with `performance.getEntriesByType('navigation')[0].notRestoredReasons`.

**P1-C (front/js): forced synchronous layout in the reveal init.**
- `src/js/main.js` l.65-73 writes `--i` inline on every `[data-reveal]`, then calls `getBoundingClientRect()` on each. That is 56–151 ms of forced layout and a 188–291 ms long task at 4× CPU, which gives TBT 138–241 ms on all mobile pages (home 228 ms, max-potential-FID 278 ms).
- **Fix:**
  1. Drop the JS `--i` writes and set the stagger in CSS (`[data-reveal]:nth-child(2){--i:1}` … `:nth-child(n+6){--i:5}`).
  2. Drop the rect loop. Observe everything. In the first IntersectionObserver callback, add `is-in` to the entries that intersect, then add `reveal-ready` to `<html>` inside a `requestAnimationFrame`. On-screen elements are already `is-in` before transitions exist (MOTION-05 is kept) and no sync layout is needed.

**P1-D (front/css): first style and layout is the largest main-thread cost** (home Style & Layout 638 ms at 4×, and it explains the 200–400 ms "element render delay").
- **Fix:** add `content-visibility:auto; contain-intrinsic-size:auto 900px` (tune per block) to `main > section` after the hero/first band, in `20-layout.css`. Measured: home 725 → 373 ms of main-thread task time (−49 %), case 1036 → 666 ms (−36 %).
- Before shipping, verify: the sticky `.process__drawing`, the despiece `view-timeline`, anchor jumps (`#demo`, `#contacto`) and find-in-page. Remove the `content-visibility` from the section that holds the `view-timeline` if its animation misbehaves.

**P1-E (front/css): the mobile bottom bar hides focused elements** (WCAG 2.2 2.4.11 fails at 320 px; partially covered at 375 px).
- The bar grows to 74 px at 375 and 94 px at 320 because `.bottom-bar .btn--neutral span {white-space:normal}` lets "Escribir por WhatsApp" wrap. `body` `padding-bottom` and `html` `scroll-padding-bottom` are fixed at `44+16=60px` (`20-layout.css` l.245-264).
- **Fix:**
  - Keep the bar one line: `white-space:nowrap`, and the short label "WhatsApp" below 400 px with the full label in `aria-label`, or icon-only below 360 px with visually hidden text.
  - Or define `--bar-h` once, e.g. `calc(var(--tap-min) + 2*var(--space-2) + env(safe-area-inset-bottom))` with the button height locked to `--tap-min`, and use it for padding, `scroll-padding` and the bar itself.
- Re-test: at 320 px, Tab through `/guias/cuanto-cuesta-un-render-3d/`; nothing may sit fully under the bar.

**P1-F (front/viewer css): the viewer stage collapses on short viewports** (landscape phones, 200 % zoom).
- `.vw-stage{aspect-ratio:4/5; max-height:78svh; margin-inline:calc(-1*var(--gutter))}` becomes 250×312 px, left-aligned, at 640×400. It is about 234 px wide on a 667×375 landscape iPhone. The poster (`transform:scale(1.6)`) is cropped.
- **Fix (`50-viewer.css` l.94-107):**
  - Use `width:auto; margin-inline:auto` so a capped stage stays centred. Better: `height:min(125vw, 78svh); aspect-ratio:auto; width:calc(100% + 2*var(--gutter))`, so the stage is always full-bleed and the poster/model letterboxes.
  - Add `@media (orientation: landscape) and (max-width: 767px) { .vw-stage{aspect-ratio:16/11} }`.
  - Apply the 1.6× poster zoom only in portrait (`@media (orientation: portrait)`).

### P2

**P2-1 (front/css): render-blocking CSS is 52.6 KB for every page; 29–36 % is used on non-viewer pages.**
- Emit `50-viewer.css` as its own stylesheet only on viewer pages (backlog #7), and split the form, compare, calc and glossary blocks the same way.
- Optionally inline the header + hero critical CSS on the home and landing templates.
- Target: ≤ 40 KB raw / ≤ 9 KB br for the shared sheet. Lighthouse estimates 150 ms FCP/LCP savings on mobile.

**P2-2 (front/templates): `sizes` overstate the rendered width on desktop** (about 100 KB wasted on home desktop).
- Set the hero to `(min-width:1024px) 568px` or a `min()` of the stage (`templates/home.mjs`).
- Set compare to `(min-width:1024px) 400px` (`components.mjs` l.216-217).
- Set case plates to `(min-width:1024px) 500px` (`blocks.mjs` l.108).
- Set bento 2-5 to `(min-width:1024px) 400px` (`components.mjs` l.274).
- Or measure the real columns once and derive the values from the grid tokens.

**P2-3 (front/templates): the `EN`/`ES` header link's accessible name does not include its visible label** (WCAG 2.5.3 Label in Name, voice control).
- `aria-label="English version"` on visible "EN" (`build/lib/layout.mjs` l.37).
- **Fix:** remove the `aria-label` and render `EN<span class="sr-only"> · English version</span>`, or use `aria-label="EN, English version"`.

**P2-4 (front/viewer): `<pre aria-labelledby>` on the embed-code block is prohibited ARIA** (axe "needs review").
- **Fix (`build/lib/viewer.mjs` l.428):** `<pre role="region" tabindex="0" aria-labelledby="…">`. A horizontally scrollable code block needs `tabindex=0` for keyboard scrolling anyway. Or wrap it in `<figure>` with a `<figcaption>`.

**P2-5 (front/js+templates): the radio-group error ("Elige una opción para continuar.") is referenced only by the fieldset.**
- Screen readers may not announce it when focus lands on the first radio. The status region is not updated when "Continuar" fails.
- **Fix:** add `aria-describedby="f-tipo-error"` to each radio (or `aria-errormessage`). In the `data-next` handler, set `status.textContent = data-msg-summary` on failure, the same as on submit.

**P2-6 (front/css): with the mobile menu open, the header `EN` link is visible but not reachable by Tab.**
- The sheet already has "English version".
- **Fix:** `.menu-open .site-header__actions .lang-link{visibility:hidden}`, or add it to `focusables()` in `main.js` l.34.

**P2-7 (front/css): small hit areas on touch** (they pass 2.5.8 by spacing, but are 16–22 px tall).
- Breadcrumbs `.crumbs__list a`, footer contact `.site-footer__contact a`, table source links, the AR QR caption link, and `.bento__title a`.
- **Fix:** `display:inline-flex; align-items:center; min-height:var(--tap-min)` below 1024 px, or `padding-block` for crumbs and footer contact. Give the bento cells the same stretched-link pattern as `.index__title a::after`.

**P2-8 (front/viewer): 12 room buttons come before the primary "Ver la villa en 3D" button in tab order** (home, case and every viewer band).
- Keyboard users need 13 Tabs to reach the main action. The rooms do trigger the load too, so nothing is broken.
- **Fix:** put the stage and start button before the rail in DOM order and keep the visual order with grid. Or render the start button in the rail header.

**P2-9 (front/vendor): the model-viewer source map returns 404** (Lighthouse BP `valid-source-maps`, DevTools noise).
- **Fix:** strip the `//# sourceMappingURL=` line in `scripts/3d/vendor-model-viewer.mjs`, or ship the `.map`.

**P2-10 (front/templates, agent-facing): WebMCP schema warnings** (Lighthouse 13 `webmcp-schema-validity` 0.5).
- **Fix:** add `toolparamdescription` to the `tipo` radio group (the first radio or the fieldset, per the spec) and to the `rgpd` checkbox in the form template. Coordinate the wording with GEO.

**P2-11 (assets): the poster is captured at 16:11, but the mobile stage is 4:5.**
- The front zooms it 1.6× and crops it (backlog #6).
- **Fix:** render a 4:5 `villa_viewer_poster_movil` (same camera framing as the model-viewer mobile orbit) at 480/800/1200 in AVIF/WebP, served with `<source media="(max-width: 767px)">`. The poster→model jump disappears and no crop is needed.

**P2-12 (front): Geist Mono (13 KB) is late-discovered through the CSS** and is used above the fold.
- **Fix (optional):** `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/geist-mono-var…woff2">` only on templates whose first viewport shows mono labels. Re-check mobile LCP afterwards, because it competes with the hero image on slow 4G.

**No change needed:**
- **geo (headers):** caching, compression, CSP and MIME are correct. If P1-B drops WebXR, keep `xr-spatial-tracking=(self)` only if Android WebXR stays.
- **Video (backlog #5):** when added, use `preload="none"` and a poster, never autoplay.

## 8. Artifacts in this folder

- `kbd-*.png`: skip link, open menu at 375, compare focus, calculator, form error, viewer ready, AR dialog.
- `focus-obscured-320_*.png`: bottom bar hiding focus (P1-E).
- `reflow-320-*.png`, `reflow-640-viewer.png`, `reflow-320-viewer.png`: reflow and viewer stage (P1-F).
- `fc-{light,dark}-*.png`: forced colors (home, CTA focus, compare, calc, pricing, form, viewer, FAQ).

## 9. How to reproduce

```bash
node build/serve.mjs 8814 dist
# Lighthouse (Playwright Chromium)
CHROME_PATH="$LOCALAPPDATA/ms-playwright/chromium-1228/chrome-win64/chrome.exe" \
  npx -y lighthouse@latest http://localhost:8814/casos/villa-costa-del-sol/ --output=json --output-path=lh.json --chrome-flags="--headless=new"
# A/B for P1-A: add --blocked-url-patterns="*model-viewer*"
# axe via playwright-cli (session a11y): run-code a script that page.evaluate()s axe.min.js, then axe.run()
# (inline <script> injection is blocked by the page CSP; CDP evaluation is not)
# bfcache: launch Chromium without Playwright's --disable-back-forward-cache and listen to Page.backForwardCacheNotUsed
```
