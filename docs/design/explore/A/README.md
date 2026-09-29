# Direction A · «Monografía blanco y negro»

Architecture-monograph editorial. The site keeps its structure, copy, logo, Archivo type, añil accent and the animated plan-to-3D hero, and gains a strong **chapter rhythm**: paper-white sheets, cool-grey "mats" and full-bleed graphite chapters, each drawn like a sheet of a drawing set (grid, corner marks, outlined chapter numeral, index row, hatch cuts, isometric grid, line-plan watermarks) and separated by full-bleed interior-render plates with plate numbers.

Nothing under `src/`, `build/`, `public/` or `dist/` was touched. Everything lives in this folder; `apply.mjs` produces `dist-explore-A/`.

## Run it

```bash
node docs/design/explore/A/apply.mjs            # dist/ -> dist-explore-A/ (fresh each run)
node build/serve.mjs 8901 dist-explore-A        # http://localhost:8901/  and  /servicios/plano-2d-a-3d/
node docs/design/explore/A/make-assets.mjs      # only if plan-lines.webp must be regenerated (needs dist/)
docs/design/explore/A/shoot.sh home-1440-light / 1440 light      # full-page shot via playwright-cli -s=exploreA
```

`apply.mjs` does four things:
1. copies `dist/` and adds `<link rel="stylesheet" href="/explore-A.css">` after the last stylesheet of **all 70 pages** (ES + EN), so the whole site inherits the rhythm;
2. sets `data-ch` (tone) and `data-n` (chapter number) on every top-level `<main>` section and injects the index row (`.ch-ix`) and the A-E axes (`.ch-ax`), from a class-to-tone table (`RULES`);
3. injects the extra markup on the home (ES and EN) and on `/servicios/plano-2d-a-3d/`: hero legend, two plate bands, contact-column render, exploded drawing beside the process steps;
4. bridges token names (see "Prototype-only token bridge").

## Section rhythm map

Tones: **W** white sheet (`#FCFCFD`, dotted drafting paper) · **P** paper (`#EDEFF2`, drafting grid) · **G** grey mat (`#E4E7EA`, white cutting-mat grid) · **K** graphite (`#0E1114`, glow + fine grain + grid) · **K+** footer graphite (`#080A0C`) · **IMG** full-bleed render plate.

Home `/`:

| # | Section | Tone | What makes it rich |
|---|---|---|---|
| - | Header | W | 3 px graphite top rule, hairline always on |
| - | Hero "Del plano 2D al modelo 3D" | W | drafting grid 24/120 px, ruler with ticks, registration crosses on the sheet, north arrow + scale bar + sheet id, rotated line-plan watermark (>= 1024 px) |
| - | Datos clave (cajetín) | K strip | section-cut hatch on the top edge, añil keys on graphite |
| 01 | Del plano al 3D (slider) | G | axes bubbles A-E, cutting-mat grid, the plan sheet lifts off the mat (tinted shadow) |
| plate 02 | Salón, eye level | IMG | full-bleed, black caption strip "LÁM. 02" |
| 02 | Qué recibes (bento) | W | dotted paper, grey plates, outlined numeral |
| 03 | Proceso + despiece | K | isometric grid behind the exploded axonometric, outlined step numerals 01-05 |
| 04 | La villa en 3D (viewer) | G | axes, viewer stage and room rail as plates on the mat |
| plates 03-04 | Dormitorio + baño | IMG | diptych 7/5, one caption strip each |
| 05 | Para quién trabajamos | W | outlined index 01-04 with hairline grid, line-plan watermark |
| 06 | Precios | G | white plates, **recommended pack turns graphite** (token override, no new component) |
| 07 | Calculadora | K | widget with a double keyline frame |
| 08 | FAQ | W | every question on a grey plate, open one gets a 3 px ink edge |
| 09 | Pide tu demo (form) | K | inputs re-themed by the graphite tokens, baño render under the contact list |
| - | Date line | K | continues the contact chapter |
| - | Footer | K+ | hatch cut, outlined masthead "Home View 3D", añil column titles |

Service page `/servicios/plano-2d-a-3d/` (17 chapters, no two neighbours alike): hero W (+ figure with plate caption) → cajetín K → 01 answer W → 02 compare G → 03 answer P → plate G (edge-to-edge terrace) → 04 table W (graphite header row) → 05 process K (**exploded drawing sticky in the empty right half**) → 06 needs G (four numbered plates) → 07 answer W → 08 answer P → 09 stat K (**11.727 at 17vw**) → 10 pricing G → callout P (hatch edge) → FAQ W → related P → closing CTA K → footer K+.

Other pages (precios, casos, contacto, guías, como-funciona, all EN) get the same engine from the class table; I checked precios, casos, contacto, guías and como-funciona at 1440.

## Palette and tokens

All new tokens are declared in `explore-A.css` and marked `(T)`: they move to `00-tokens.css` (light `:root`, the `prefers-color-scheme` block and `[data-theme="dark"]`, in that order).

| Token | Light | Dark theme | Measured |
|---|---|---|---|
| `--k0` graphite bg | `#0E1114` | `#050708` | |
| `--k1` raised plate | `#14181C` | `#0B0E10` | |
| `--k2` stage on graphite | `#1A1F25` | `#101418` | |
| `--k-ink` / `--k-ink2` / `--k-ink3` | `#EEF0F3` / `#B4BBC3` / `#8E969F` | same | 16.6 / 9.8 / 6.3 :1 on k0 (ink3 on k2 5.5) |
| `--k-line` | `#262D35` | `#1C2329` | decorative only |
| `--k-strong` | `#6A747F` | same | 4.0:1 on k0, 3.75 on k1 (graphics >= 3:1) |
| `--k-acc` / `--k-acch` / `--k-soft` | `#A2B3EA` / `#B8C5F2` / `#1C2640` | same | 9.2:1 on k0; button text k0 on acc 9.2:1 |
| `--w0` white sheet | `#FCFCFD` | `#161A1E` | |
| `--paper` | `#EDEFF2` | `#0F1215` | ink-3 5.0:1 |
| `--mat` grey mat | `#E4E7EA` | `#232A31` | ink-3 4.6:1 (dark 4.6:1) |
| `--foot` | `#080A0C` | `#030405` | |

The graphite set is applied by **overriding the existing `--color-*` tokens on the chapter** (`.main > [data-ch=k]`, `.pack--featured`, `.site-footer`, plate captions), so buttons, inputs, tables, the calculator, the viewer rail and `--plan-invert` re-theme themselves. No component knows about the theme.

## Decoration inventory (all CSS/SVG, no JS)

| Decoration | Technique | Where |
|---|---|---|
| Drafting grid 24/120 px | 4 `linear-gradient` layers + radial vignette in the tone colour | hero, P, G, K |
| Dotted drafting paper | one `radial-gradient` tile | W |
| Cutting-mat grid (white on grey) | same layers, lines from `--color-surface` | G |
| Fine grain + downlight | 180 px `feTurbulence` SVG tile (alpha .11) + radial glow | K |
| Corner marks | 8 gradient strokes on `::after` | every chapter |
| Outlined chapter numeral | `::before`, `content: attr(data-n) / ""`, `-webkit-text-stroke` | every numbered chapter (shrinks to a folio at <= 767 px) |
| Index row = dimension line | `.ch-ix`: number, name, rule with end ticks, sheet id | every numbered chapter |
| Axes bubbles A-E | `.ch-ax`: dash-dot gradients, circles, masked fade | G and P |
| Section-cut hatch | `repeating-linear-gradient(135deg)` | strip top, footer top, callout edge |
| Isometric grid | two 30/150 deg repeating gradients | despiece stage, service side drawing |
| Ruler with ticks | two repeat-x gradients aligned to the grid | hero top |
| Registration crosses | two gradient strokes | hero sheet, inner hero figure |
| North arrow + scale bar | 0.7 KB inline SVG + CSS bar | hero |
| Line-plan watermark | `plan-lines.webp` (21 KB) as an alpha **mask** tinted by `currentColor`: works on any tone and both themes | hero, audiences, contact, CTA |
| Plate bands | real renders, `<picture>` AVIF/WebP, lazy, caption strip with plate number | home x2, service x1 |
| Outlined numerals in lists | CSS counters, no markup | steps, audiences, needs |
| Depth | tinted long shadows on 5 plates (sheet, viewer stage, featured pack, answer card, calculator keyline) | see above |
| Footer masthead | `content: attr(data-w) / ""` in outlined Archivo 125 % | footer |

## Cost

| Item | Size |
|---|---|
| `explore-A.css` as written (readable names, comments) | 22.8 KB, 257 lines |
| shipped in the prototype (names shortened) | 21.0 KB |
| minified with the project's `minifyCss` | **17.9 KB** |
| gzip / brotli | 4.9 KB / **4.3 KB** |
| `plan-lines.webp` (4 uses, cached once) | 21.3 KB |
| HTML delta, home ES / EN | +4.8 KB raw (71.6 -> 76.4), +0.6 KB brotli |
| HTML delta, service | +4.0 KB raw (52.3 -> 56.3), +0.5 KB brotli |
| Lazy image bytes added to the home (1440 @1x) | about 131 KB: salón 1600w 48, dormitorio 1200w 33, baño 800w 19 + 480w 10, plan mask 21 |
| Lazy image bytes added to the service page | about 87 KB (three despiece layers, AVIF 800w) |
| JS | 0 |
| Measured on the prototype | home: 0 console errors, CLS 0 at 1440 and 390, LCP element unchanged (`img.hs__plan`); home, service and precios: no horizontal scroll at 320/390/768/1024/1280/1920 |

The only added request above the fold is the plan mask in the hero, and only from 1024 px up.

## Prototype-only token bridge

The production build (`build/lib/assets.mjs`) inlines static tokens (`--space-3` -> `12px`) and shortens every other custom property (`--color-ink` -> `--a`). `explore-A.css` is written with the **source** names, as it would live in `src/css`, so `apply.mjs` rewrites them to the built names by aligning `src/css/00-tokens.css` with the `:root` block of the built `site.css` (and inlines the dropped ones). When the file lives in `src/css` the real build does this by itself. (Anyone prototyping against `dist/` with `var(--color-ink)` will get transparent nothing: the names do not exist there.)

## Integration into the real source

1. **Tokens**: add the `(T)` block to `src/css/00-tokens.css`, three places (light, media dark, `data-theme=dark`). `scripts/brand.mjs` only reads `--color-bg/ink/accent`, unaffected.
2. **CSS files**
   - new core file `src/css/24-chapters.css` (no `@module`, so it ships in `site.css`): chapter engine, header, hero sheet, key-facts strip, footer, date line, small-screen rules;
   - component blocks go to their module files: bento -> `43-bento.css`, process + `.ch-side` -> `42-process.css`, compare -> `41-compare.css`, viewer rail -> `50-viewer.css`, packs + calculator -> `44-pricing.css` / `45-calc.css`, FAQ + index lists + figure captions -> `30-components.css`, answers/plates -> `55-answers.css`, tables -> `31-tables.css`, stat/callout -> `35-data.css`, CTA band -> `36-cta.css`, contact aside -> `46-form.css`, plate bands (`.a-plate`, rename `.plate-band`) -> `47-plates.css`.
3. **Templates**
   - `build/lib/blocks.mjs` (section wrapper): a `chapter(tone, label)` helper that emits `data-ch`, `data-n` and the `.ch-ix` row (or, cheaper, `data-label` + `data-sheet` and build the row with `::before`/`::after`, which saves about 2 KB of HTML). The tone table is `RULES` in `apply.mjs` (block type -> tone -> label ES/EN).
   - `build/lib/hero.mjs`: the `.hv-leg` legend (home and inner hero).
   - `build/lib/layout.mjs`: `data-w="${brand.name}"` on `.site-footer__top`.
   - content model: a `plate` block (1 or 2 images from `images.json`, caption with the IMG-03 label), used on the home and the service pages; contact aside figure; `steps` option `aside: "despiece"` for the inner-page process.
4. **Asset**: `plan-lines.webp` to `public/assets/brand/`, generated by a script derived from `make-assets.mjs`; `--ch-plan` points at it.
5. **Rulebook and lint** (the client lifted grids, shadows and dark bands; these also change): SLOP-06 (section-number eyebrows, decorative grid lines), LAYOUT-07 (eyebrow count: the index rows are `aria-hidden`, use a different class), COLOR-08 (Page Theme Lock: add graphite `k` as a fourth tint step), COLOR-02 (añil now also labels index rows and plate numbers), COLOR-01 (the new tokens must sit in `00-tokens.css`), PERF-02 budgets.
6. **Budgets** (`scripts/design-lint.mjs` is at 0 errors on `dist/`): the prototype trips CSS-per-page (home 44.8 KB -> 65.7 and service 31.0 -> 52.0 with the unminified file, about 62.7 and 48.9 once the build minifies it, against 45), HTML (home 76.4 KB against 72, brotli 16.5 against 16) and the 2-stylesheet rule (only because the prototype adds a third file). Integrated in the bundle the last one disappears; the first two need new limits or the trimmings above.

## Known limits

- Static on purpose: no scroll effects added, the existing despiece and hero motion are untouched.
- Needs `color-mix()` (Chrome 111, Safari 16.2, Firefox 113) and `:has()` for the process side layout. Without `color-mix` a chapter falls back to its flat tone colour and loses grid and numerals, nothing breaks.
- The numerals and masthead are pseudo-elements with an empty alt (`content: ... / ""`); older screen readers may still announce them.
- In the dark theme the rhythm compresses (five near-black tones); `--mat` and `--k0` were pushed apart to keep it readable. Screenshots included.
- The EN service page was not given the plates and the exploded drawing (the table and tones apply); the EN home has everything.
- Alt text of the new plates is written per language in `apply.mjs`; in the real build it comes from `build/data`.

## Files

`apply.mjs`, `explore-A.css`, `assets/plan-lines.webp`, `make-assets.mjs`, helpers (`shoot.sh`, `prep.js`, `seg.tpl.js`, `stitch.mjs`, `slice.mjs`, `montage.mjs`, `boxes.js`, `crops.mjs`).

Screenshots in `shots/`:
- `home-1440-light.jpg`, `home-390-light.jpg`, `home-1440-dark.jpg`, `home-en-1440-light.jpg`
- `service-1440-light.jpg`, `service-1440-dark.jpg`, `service-390-light.jpg`
- `baseline-home-1440.jpg` (before)
- signature moments: `moment-1` hero + key facts, `-2` process on graphite, `-3` pricing on the grey mat, `-4` plate diptych + outlined index, `-5` contact + footer masthead, `-6` service stat + pricing, `-7` service process with the sticky exploded drawing, `-8` service table, `-9..12` the same at 390 px
