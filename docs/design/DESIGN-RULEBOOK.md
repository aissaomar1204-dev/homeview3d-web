# Design rulebook

> **Status:** v1, 2026-09-28. **Applies to:** every page, template and component of the studio website (ES first, EN second).
> **Audience:** builder agents (implement) and reviewer agents (verify). Every rule has an ID you can cite in a review.
> **Companion files:**
> - `docs/design/tokens.css`: canonical tokens for the recommended direction (Part B2). If a table here and `tokens.css` disagree, `tokens.css` wins.
> - `docs/design/design-lint.mjs`: mechanical checks for Part D1. It is tested and runs on Node 20 or newer, ESM, with no dependencies.
> - `docs/research/01-competidores.md`: competitor analysis (vistastudiodesign.com, Viseni, Improntia, Persuadis).
>
> **Distilled from:** design-taste-frontend (read in full), high-end-visual-design, minimalist-ui, gpt-taste, redesign-existing-projects, stitch-design-taste (+ DESIGN.md), full-output-enforcement, the typeui design-system skills (premium, refined, editorial, immersive, impeccable, spacious, storytelling, terracotta, sleek), Vercel Web Interface Guidelines (`docs/guidelines/web-interface-guidelines.md`) and playwright-cli (for visual QA).
> Font sizes, contrast ratios, fallback metrics and the model-viewer bundle size in this document were **measured** on 2026-09-28, not estimated.

---

## 0. How to use this rulebook

### 0.1 Reading order
- **Builders:** 0.3 → 0.5 → Part A (all) → Part B2 → Part C6 → Part D before opening a PR.
- **Reviewers:** Part D top to bottom, citing Part A IDs for every failure (`COLOR-06 fails: ink-3 on stage 4.1:1`).

### 0.2 Rule language and verification tags
- **MUST**: non-negotiable. Everything in Part A is MUST unless it says SHOULD.
- **SHOULD**: default. Deviating requires a one-line reason in the PR.
- Verification tags: **[lint]** checked by `design-lint.mjs` · **[pw]** checked with playwright-cli (Part D2) · **[lh]** Lighthouse / network panel · **[eye]** human or agent review of screenshots and markup.

### 0.3 Design read and dials
**Reading this as:** a multi-page B2B service site (ES/EN) for real-estate agency owners, developers (obra nueva, venta sobre plano), architects and holiday-rental owners on the Costa del Sol. The language is gallery-white technical precision. It is built as a static Node site with vanilla CSS tokens, native scroll-driven CSS and a lazily loaded `<model-viewer>`.

| Dial (design-taste-frontend) | Recommended (B2 Plano) | Why |
|---|---|---|
| `DESIGN_VARIANCE` | **6** | Trust-first B2B buyers pull toward 3-4; a premium studio with a live product demo pulls toward 7-8. Offset asymmetric, never chaotic. |
| `MOTION_INTENSITY` | **5** | "Fluid CSS" band. Motion only where it explains the product (plan to model, cutaway, light). |
| `VISUAL_DENSITY` | **4** | Pricing, facts and FAQ must be scannable; marketing sections stay airy. |

### 0.4 Precedence when rules conflict
1. Legal and honesty: RGPD/LSSI, the anonymized case, labelling virtual images, no fabricated proof.
2. Accessibility: WCAG 2.2 AA.
3. Performance budgets (A12).
4. The locks in this rulebook: theme, colour, shape, type, CTA vocabulary.
5. The chosen art-direction tokens (`tokens.css`).
6. Source-skill defaults.

A rule in this rulebook overrides a skill. When two rules here conflict, the one with the lower precedence number wins.

### 0.5 Stack translation (the skills assume React/Tailwind; we do not)
Our build follows the proven transfermalaga model: Node templates generate static HTML per language, one CSS system and a tiny vanilla JS layer. The project is ESM (`"type": "module"`), so scripts are `.mjs`.

| Skill says | We do |
|---|---|
| React / Next.js / Server Components | Static HTML from Node templates. No framework runtime. |
| Tailwind classes (`py-24`, `max-w-7xl`, `min-h-[100dvh]`) | CSS custom properties from `tokens.css` + plain CSS. Read Tailwind values in the skills as px (`py-24` = 96px). |
| Motion (`motion/react`), `useReducedMotion`, `whileInView` | CSS transitions/keyframes, `matchMedia('(prefers-reduced-motion: reduce)')`, one shared IntersectionObserver module. |
| GSAP ScrollTrigger pin/scrub | CSS scroll-driven animations (`animation-timeline: view()`) inside `@supports`, with a static fallback. GSAP is not installed (MOTION-12). |
| Spring `stiffness: 100, damping: 20` | That spring is critically damped (no overshoot). `--ease-out` at 480-600 ms approximates it. No spring library. |
| `next/font` | Self-hosted woff2, instanced and subset, with metric-matched fallbacks (`tokens.css`, Appendix 1). |
| `next/image priority` | `<picture>` AVIF → WebP with `width`/`height`; `fetchpriority="high"` on the single LCP image. |
| `@phosphor-icons/react` | `@phosphor-icons/core` SVGs compiled into one sprite at build, one weight. |
| Image-gen tool / `picsum.photos` | Our own Blender Cycles renders and real device captures only (A8). |
| shadcn / Radix / Material | None. No component library. |

### 0.6 Conflicts between the source skills, resolved

| Topic | What the skills say | Ruling for this site |
|---|---|---|
| Serif | design-taste: very discouraged, Fraunces/Instrument Serif banned. stitch: Fraunces/Instrument Serif OK. minimalist: Newsreader/Playfair/Instrument Serif. high-end: serif for real estate. | Serif appears only in direction B1, for display text only (Newsreader). Fraunces, Instrument Serif and Playfair are banned. The recommended direction uses no serif. |
| Inter | premium/sleek/storytelling tokens use Inter; design-taste/high-end/minimalist/stitch ban it. | Banned. Plus Jakarta Sans is banned too (it is the competitor's font). |
| typeui colour tokens (`#3B82F6`, `#8B5CF6`, `#111827`) | Generic Tailwind defaults repeated across premium, refined, spacious, sleek, storytelling. | **Values rejected.** We keep their process: semantic tokens, explicit states, must/should language, QA checklist, 8pt grid, 44px targets. |
| Eyebrows | high-end: a pill eyebrow above every H2. design-taste: at most 1 per 3 sections. | design-taste wins: `≤ ceil(sections / 3)`, no pills (LAYOUT-07). |
| Button shape | high-end: pill + nested "button-in-button" icon. minimalist: 4-6px, no pills. | Each direction has its own shape lock. B2: 2px, no pills, no nested icon circles. |
| Amount of motion | high-end/gpt-taste: nothing appears statically, GSAP everywhere, blur-in. stitch: perpetual loops on every active component. design-taste: motion must be motivated. | design-taste + Vercel win: motion must be motivated, there are no blur reveals and no perpetual loops, and LCP content is never animated in (MOTION-05). |
| Hero | gpt-taste: centered cinematic preferred. design-taste/stitch: no centered hero when variance > 4. stitch: 1 CTA, no secondary. | Asymmetric hero. 1 primary button + at most 1 secondary **text link** with a distinct intent (see the live demo). |
| Text over images | stitch: never overlap. Others allow scrims. | No text over renders. Captions go below. Only viewer controls, hotspots and dimension lines (data) sit on the stage. |
| Sticky nav | high-end bans a glued edge-to-edge sticky nav and wants a floating glass pill. | For B2B conversion, a compact 64px **solid** sticky header is allowed. No floating glass pill in B2. |
| FAQ | redesign: accordions are a cliché. minimalist: an accordion with bottom borders. | Native `<details>` (indexable, zero JS), grouped by objection, 2 columns on desktop. |
| Case | Vercel: Title Case headings/buttons. redesign: sentence case. | Sentence case in both languages. Spanish orthography requires it, and one rule is easier to enforce. |
| Person | Vercel: second person, avoid first person. | Lead with the reader ("tú"). Use "nosotros" only for commitments ("Te respondemos en menos de 24 h"). |
| Missing assets | design-taste: leave `<!-- TODO -->` slots. full-output-enforcement: TODO is a failure. | We have a render pipeline, so a missing asset fails the build. No `TODO` in `dist/` [lint]. |
| Logo wall / social proof | design-taste: invent SVG marks for invented brands. | Never invent clients, logos, testimonials or counters. There is no logo wall until real clients exist (SLOP-04). |
| Section backgrounds | impeccable: alternating cream/orange sections. immersive: one continuous canvas. | One continuous theme per page (COLOR-08). Only same-family tint steps (`bg`, `surface`, `stage`). |
| Randomized layout picks | gpt-taste: pseudo-random "Python RNG" selection. | Not used. Directions are chosen deliberately in this document. |
| Grain / noise | minimalist/redesign: add grain against flatness. | Not in B2: the renders supply texture. If a direction uses it (B1), it goes on a fixed `pointer-events: none` layer at ≤ 0.03 opacity. |
| Dark mode | design-taste: both modes mandatory. | Both modes via `prefers-color-scheme`. A toggle is not required. |
| Full output | full-output-enforcement: no skeletons, no "rest follows the same pattern". | Builders deliver complete pages and components. A partially built interaction is removed, not shipped (MOTION-01). |

---

## Part A · Non-negotiable rules (builder + reviewer checklist)

### A1. Anti-slop and anti-generic
- [ ] **SLOP-01** No AI-purple/blue glow, neon, mesh blobs, aurora gradients, gradient text on headings, or outer glows. [eye]
- [ ] **SLOP-02** No "three equal cards in a row" for features, services or audiences. The same goes for three icon-in-circle features. [eye]
- [ ] **SLOP-03** No fake UI built from divs: no fake dashboards, phones, browser chrome, or mock Idealista/Fotocasa listings. Show the real viewer, real screenshots and real iPhone/Android AR captures. Never use a portal's UI or logo. [eye]
- [ ] **SLOP-04** No fabricated social proof: no invented client logos, testimonials, star ratings, "trusted by" rows or counters (`+200 proyectos`). Until real clients exist, the proof is the live demo, the case facts, the transparent process and the guarantee. [eye]
- [ ] **SLOP-05** No borrowed statistics as headline claims (the competitor's NAR "+403 %"). Use our own numbers from `build/data`. Sector numbers are allowed only if they are Spanish/European, linked and labelled. [eye]
- [ ] **SLOP-06** Banned decorative tells: version labels in the hero (`BETA`, `v2`); section-number eyebrows (`01 / Servicios`); `01/4` pagination on images; the middle dot `·` as a default separator (max 1 per line); decorative status dots; scroll cues (`Desliza`, `Scroll`, bouncing chevrons); locale/time/weather strips; hero-bottom strips (`RENDER. AR. 3D.`); pills or tags overlaid on images; fake photo credits; vertical rotated text; decorative crosshair or grid lines; custom cursors; emojis. [lint partial, eye]
- [ ] **SLOP-07** No split section header (big headline left, small paragraph floating right) unless the right column carries a visual or interactive element. Otherwise stack the headline over the body (max 66ch). [eye]
- [ ] **SLOP-08** No filler vocabulary. EN: elevate, seamless, unleash, next-gen, revolutionize, game-changer, delve, tapestry, cutting-edge, "in the world of". ES: elevar, sin fisuras, revolucionar, de última/nueva generación, siguiente nivel, desbloquear, soluciones integrales, de vanguardia. [lint]
- [ ] **SLOP-09** **Zero em dashes (—) and en dashes (–)** anywhere a human or an LLM can read them: body, headings, buttons, alt, `<title>`, meta, JSON-LD, `llms.txt`. Use a period, comma, colon, parentheses or a hyphen. [lint]
- [ ] **SLOP-10** No generic placeholders (`Acme`, `John Doe`, `Lorem ipsum`). Example names in UI (form placeholders) are realistic Spanish examples and are never presented as clients. [lint]
- [ ] **SLOP-11** Copy self-audit before the PR: re-read every visible string. Replace cute wordplay, forced metaphors and "thoughtful AI" phrasing with a plain functional sentence. [eye]
- [ ] **SLOP-12** One register per page: direct B2B, "tú". Do not mix mono-technical jargon and marketing punch in one block. [eye]

### A2. Brand placeholder (no name and no logo yet)
- [ ] **BRAND-01** The brand name exists only in `build/data/site.js` (`brand.name`). During development the literal token `{{BRAND}}` is allowed; `design-lint` fails if it reaches `dist/`. [lint]
- [ ] **BRAND-02** No invented logo, monogram or symbol. Until the logo exists, the header shows `brand.name` as a text wordmark: `--font-display`, weight 600, `font-stretch: 112%`, 18px, `--color-ink`. [eye]
- [ ] **BRAND-03** The logo slot is a fixed box: height 28px (<1024px) or 32px (≥1024px), `max-width: 180px`, `flex-shrink: 0`. The future logo is an SVG using `currentColor`, so it works in both themes and drops in with zero CLS. [eye]
- [ ] **BRAND-04** Temporary favicon: a flat square in `--color-accent` (32, 192 and 512 px, plus apple-touch-icon). No letter mark. Replace it when the logo lands. [eye]
- [ ] **BRAND-05** If the future logo needs a different accent, only `tokens.css` changes. That is why colour literals are banned outside it (COLOR-01). [lint]
- [ ] **BRAND-06** OG images (1200×630) are generated at build from renders + `brand.name`, so they regenerate when the brand changes. [eye]

### A3. Typography
- [ ] **TYPE-01** At most **2 families and 3 woff2 files**, each ≤ 60 KB, ≤ 110 KB in total. Fonts are self-hosted, instanced to the axes actually used, and subset to the ES/EN glyph set (Appendix 1). No Google Fonts `<link>` or `@import` in production. [lint]
- [ ] **TYPE-02** Banned families: Inter, Inter Tight, Roboto, Open Sans, Montserrat, Poppins, Plus Jakarta Sans (competitor), Fraunces, Instrument Serif, Playfair / Playfair Display. Arial/Helvetica appear only as metric fallbacks. [eye]
- [ ] **TYPE-03** Preload exactly one font file, the one the H1 uses (`<link rel="preload" as="font" type="font/woff2" crossorigin>`). Use `font-display: swap` plus the metric-matched fallback faces in `tokens.css`. [eye]
- [ ] **TYPE-04** Font sizes come only from the `--fs-*` tokens. Body text is 17px. Nothing is smaller than 13px (`--fs-meta`). [eye]
- [ ] **TYPE-05** Exactly one `<h1>` per page. **Home hero H1 ≤ 36 characters** (in B2 that is 2 lines at 1440px and at most 3 lines at 375px; measured with Archivo at width 118, about 19 characters per line at 64px in 640px). An inner-page H1 ≤ 60 characters; above 36 characters it uses the `--fs-h2` size. [lint h1 count, pw line count]
- [ ] **TYPE-06** Headings get `text-wrap: balance` and paragraphs `text-wrap: pretty`. Body measure ≤ 66ch; lead ≤ 48ch. [eye]
- [ ] **TYPE-07** Display line-height ≥ 1.0 so accented Spanish capitals (Á É Í Ó Ú Ñ) never collide. Italic words with descenders (g j p q y) need line-height ≥ 1.1 plus a 4px bottom reserve. [pw zoom]
- [ ] **TYPE-08** Emphasis inside a headline uses the weight or italic of the **same** family, never a second family. [eye]
- [ ] **TYPE-09** Prices, m², counts, calculator totals and table figures use `font-variant-numeric: tabular-nums lining-nums`. Monospace is reserved for measurements, data keys and short labels, and stays under 10% of the page's text. [eye]
- [ ] **TYPE-10** Tracking: display negative (tokens), body 0, mono +0.01em. Any small uppercase wide-tracked label counts as an eyebrow (LAYOUT-07). [lint]
- [ ] **TYPE-11** Headings are never hyphenated. Body may use `hyphens: auto` below 480px only, with the correct `lang`. [eye]

### A4. Spacing, grid and layout mechanics
- [ ] **SPACE-01** Margins, paddings and gaps come only from the `--space-*` tokens: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160 px. [eye]
- [ ] **SPACE-02** Vertical section padding = `--section-y`. Hero top padding ≤ 96px on desktop. Bottom padding may exceed top padding by up to 16px (optical correction). [pw]
- [ ] **SPACE-03** Container ≤ `--container`. The gutter is `clamp(16px, 4vw, 48px)`, exactly 16px at 375px. No horizontal scroll at any width from 320 to 2560px. [pw eval]
- [ ] **SPACE-04** Grid: 12 columns ≥ 1024px (24px gap), 8 columns from 768 to 1023px, 4 columns below 768px (16px gap). Use CSS Grid for structure, never `calc()` percentage flex math. [eye]
- [ ] **SPACE-05** Every multi-column block declares its below-768px collapse (single column, full width) in the same component's CSS. [eye]
- [ ] **SPACE-06** Full-height blocks use `min-height: 100dvh`. Never `100vh`, and never a fixed `height`. [lint]
- [ ] **SPACE-07** Prevent sideways scroll with `overflow-x: clip` on wrappers, not `hidden` (`hidden` breaks `position: sticky`). [eye]
- [ ] **SPACE-08** `z-index` values come only from the `--z-*` tokens (raised 10, sticky 100, overlay 200, modal 300, toast 400, skip link 500). [eye]

### A5. Colour calibration
- [ ] **COLOR-01** Every colour comes from `tokens.css`. No hex/rgb literals in any other file. [lint]
- [ ] **COLOR-02** **One accent.** Use it only for the primary CTA fill, focus rings, selected/active states, link hover and progress. Never use it for large backgrounds, body text or decoration. Split is 60/30/10: at least 60% bg/surface, about 30% ink/stage/renders, at most 10% accent. [eye]
- [ ] **COLOR-03** Colour Consistency Lock: the same accent on every page and component. That includes WhatsApp, which gets a neutral button with the WhatsApp glyph and **no `#25D366` green**. The cookie panel and form states follow the lock too. [eye]
- [ ] **COLOR-04** One grey family per direction (cool blue-grey in B2). Never mix warm and cool greys. [eye]
- [ ] **COLOR-05** No pure `#000` / `#FFF`. [lint]
- [ ] **COLOR-06** Contrast, measured: text ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1; input borders, focus indicators, dimension lines and other meaningful graphics ≥ 3:1 (WCAG 1.4.11). The token tables already pass. Any **new pair must be measured** before use. `--color-line` is decorative only (about 1.3:1) and must never be the only boundary of a control. [pw + axe]
- [ ] **COLOR-07** Banned palettes. (a) The competitor's terracotta/cream/sand: `#B4552F`, `#D8A46A`, `#FBF6EF`, `#F7EEE4`, `#2A2018`. (b) The premium-consumer default: beige `#f5f1ea` family + brass `#b08947` family + espresso `#1a1714` family. (c) The Marbella-luxury black + gold. Terracotta may appear **inside renders** (the terrace tiles), never in UI. [eye]
- [ ] **COLOR-08** Page Theme Lock: the whole page follows `prefers-color-scheme`. No section inverts theme. Allowed tint steps are `bg`, `surface` and `stage` only. [pw dark]
- [ ] **COLOR-09** `:root { color-scheme: light dark }`. Two `<meta name="theme-color">` tags with `media` attributes, matching `--color-bg` in each theme. Native `<select>` gets an explicit `background-color` and `color`. [eye]
- [ ] **COLOR-10** Danger/success colours only express form or status state, never decoration. [eye]

### A6. Motion (with `prefers-reduced-motion`)
- [ ] **MOTION-01** Every animation has a one-sentence reason, written as a CSS comment above the rule: hierarchy, storytelling (plan → model), feedback or state change. "Looks cool" is not a reason. A half-working effect is removed, not shipped. [eye]
- [ ] **MOTION-02** Animate only `transform` and `opacity`. The comparison slider's `clip-path` is input-driven, not an animation, and is the only exception. Never animate width, height, top, left, `filter: blur()` or `box-shadow`. [eye]
- [ ] **MOTION-03** Never `transition: all`; list the properties. [lint]
- [ ] **MOTION-04** Durations and easings come only from the `--dur-*` / `--ease-*` tokens. `linear` is allowed only on scroll-linked timelines, where progress is the input. [eye]
- [ ] **MOTION-05** **Nothing above the fold animates in on load.** The H1, hero text, CTA and LCP image paint at their final state on first paint, because entrance animations delay LCP. [lh + pw]
- [ ] **MOTION-06** Reveals: `opacity 0→1` + `translateY(12px→0)`, `--dur-reveal`, once, staggered by `--stagger` (max 6 items per group). Use a single IntersectionObserver (threshold 0.15) and unobserve after reveal. Content starts hidden only when `html.js` is set **and** `prefers-reduced-motion: no-preference`, so no-JS users and crawlers see everything. [eye]
- [ ] **MOTION-07** Scroll-linked effects use CSS scroll-driven animations inside `@supports (animation-timeline: view())`, with a static fallback. Banned: `window` scroll listeners, `scrollY` maths, rAF loops touching layout, scroll-jacking, and smooth-scroll libraries (Lenis etc.). [eye]
- [ ] **MOTION-08** No perpetual autoplay loops. Any autoplay motion longer than 5 s (guided tour, auto-rotate, video) has a visible pause control, stops on any user input, and is off under reduced motion. At most one marquee per site; B2 uses none. [pw]
- [ ] **MOTION-09** Under `prefers-reduced-motion: reduce`: all durations are 0 (tokens), scroll-driven effects show their final state, the guided tour and room buttons jump the camera (`jumpCameraToGoal()`) instead of interpolating, there is no auto-rotate, and `scroll-behavior` is `auto`. Listen for runtime changes (`matchMedia(...).addEventListener('change', …)`). [pw set-reduced-motion]
- [ ] **MOTION-10** Hover effects only under `@media (hover: hover) and (pointer: fine)`. `:active` press feedback (`translateY(1px)`) applies everywhere. [eye]
- [ ] **MOTION-11** Animations are interruptible: use CSS transitions, not chained timeouts. Set `transform-origin` explicitly. SVG transforms go on a `<g>` with `transform-box: fill-box`. [eye]
- [ ] **MOTION-12** Not used: GSAP, Lenis, Motion One, raw Three.js, Lottie. Model-viewer is the only heavy library and is lazily imported (COMP-07). An exception needs a PR note with the byte cost and why CSS cannot do it. [eye, package.json]
- [ ] **MOTION-13** Set `will-change` only right before an effect and remove it afterwards. Never set it statically on more than 2 elements. [eye]

### A7. Page layout
- [ ] **LAYOUT-01** The hero fits the first viewport at 1440×900 and at 375×667: H1, subtext and the primary CTA are visible without scrolling. [pw]
- [ ] **LAYOUT-02** The hero has at most 4 text elements: an optional eyebrow, the H1, a subtext of ≤ 20 words (≤ 4 lines), and a CTA row (1 primary button + at most 1 secondary text link). A caption of ≤ 12 words under the visual is also allowed, because it carries the honesty label (IMG-03). Banned in the hero: trust strips, price teasers, bullet lists, badges and a tagline under the CTAs. [eye]
- [ ] **LAYOUT-03** The home hero is asymmetric (text/visual split), never centered. Inner pages use a left-aligned text hero. [eye]
- [ ] **LAYOUT-04** The hero visual is the real product: the villa render that the viewer section brings to life. No gradient blob, abstract 3D shapes or stock. [eye]
- [ ] **LAYOUT-05** Navigation: one line at 1024px; height 64px (72px max); at most 5 links + the language link + the primary CTA; `aria-current="page"` on the active item. Below 1024px: a labelled "Menú" button opens a full-screen sheet with a solid surface. Below 768px, a bottom action bar is added (COMP-06). [pw]
- [ ] **LAYOUT-06** Layout families: each family appears at most once per page. A page with ≥ 8 sections uses ≥ 4 families. At most 2 consecutive image+text splits. [eye]
- [ ] **LAYOUT-07** **Eyebrows ≤ ceil(sections / 3)**, and an eyebrow in one section blocks eyebrows in the next 2. The class name is `.eyebrow` so the lint can count it. [lint]
- [ ] **LAYOUT-08** Bento/feature grids: the cell count equals the item count exactly; ≥ 3 cells carry real imagery; no empty cells; adjacent cells in a row never have identical widths. [eye]
- [ ] **LAYOUT-09** Lists of more than 5 items use grouping (2-column groups, chips, an index), not one long divided list. Tables appear only where the data is the content (pricing page, comparison guide) and use grouped dividers, never a double border on every row. [eye]
- [ ] **LAYOUT-10** Default section shape: headline ≤ 8 words, paragraph ≤ 25 words, one asset or one CTA. Exempt: pricing, FAQ, guides and legal pages. [eye]
- [ ] **LAYOUT-11** Quotes (once real clients exist): ≤ 3 lines of body; attribution is name + role + company. [eye]
- [ ] **LAYOUT-12** Sticky elements never cover the focused element. Set `scroll-padding-top: calc(var(--header-h) + 16px)`. The mobile action bar hides while the contact form or the footer is in view, and `scroll-padding-bottom` equals the bar height. [pw keyboard]

### A8. Images, renders and 3D assets
- [ ] **IMG-01** Every image is our own: Blender Cycles renders, real-time viewer captures, or real iPhone/Android AR screen captures. No stock, no picsum/Unsplash, no AI-generated "photos" of property. [lint + eye]
- [ ] **IMG-02** **Anonymization.** Never publish the original third-party plan, the listing photos, the address, the agency name, the exact location or coordinates. The case is only "villa en la Costa del Sol". Plan graphics are **redrawn from our own model**: an orthographic top view rendered as line art, or an SVG exported by script. [eye]
- [ ] **IMG-03** Honest labelling. Every render has a caption or alt text saying it is a render: ES "Render 3D generado a partir del plano 2D", EN "3D render generated from the 2D floor plan". Measures are marked "aprox.", and the case page says "Medidas estimadas a partir de la escala del plano". [eye]
- [ ] **IMG-04** Use `<picture>` with AVIF, then WebP (JPEG only for OG images). sRGB, 8-bit. Widths 480 / 768 / 1080 / 1440 / 1920 (2560 only for full-bleed). Explicit `width` + `height`. [lint]
- [ ] **IMG-05** Exactly one image per page has `fetchpriority="high"`: not lazy, preloaded with `imagesrcset`/`imagesizes`, ≤ 120 KB at desktop width and ≤ 80 KB at 768w. All others use `loading="lazy" decoding="async"`. [lint]
- [ ] **IMG-06** Posters and layered drawings are rendered with transparent film (RGBA) and exported as AVIF/WebP with alpha. The same asset then sits on `--color-stage` in light **and** dark themes. [eye]
- [ ] **IMG-07** Render consistency across the set:
  - AgX view transform and one sun direction.
  - Interior cameras at 1.60 m eye level, with verticals corrected by lens shift, not tilt.
  - Axonometric/cutaway cameras orthographic, or FOV ≤ 30°.
  - Every before/after or layered pair uses the **same camera**, so layers register pixel-exact. [eye]
- [ ] **IMG-08** No overlays on images: no pills, tags, numbering, or gradients carrying text. Captions sit below the image, ≤ 12 words, functional. Exceptions: viewer controls, hotspots and dimension lines (they are data, not decoration). [eye]
- [ ] **IMG-09** Alt text describes the room, what is visible, and that it is a render. Decorative layers get `alt=""`. Never "image", never keyword stuffing. [lint + eye]
- [ ] **IMG-10** Video (the "próximamente" AI videos):
  - `preload="none"`, a poster, click-to-play, `muted`, `playsinline`.
  - A captions track, and a mobile rendition of ≤ 4 MB (H.264 MP4, optionally AV1/WebM).
  - No background video and no scroll-scrubbed video (the competitor's mistake). [eye]
- [ ] **IMG-11** 3D assets:
  - The GLB is optimized (Meshopt + KTX2/WebP textures), with a target of ≤ 6 MB for the full villa.
  - The USDZ is referenced only through `ios-src`, so it is fetched only on an iOS AR tap.
  - Filenames are hashed and served with `Cache-Control: public, max-age=31536000, immutable`. [lh network]
- [ ] **IMG-12** One OG image per page: 1200×630 JPEG, ≤ 150 KB, generated from renders + the brand name. [eye]

### A9. Components
**Buttons and links**
- [ ] **COMP-01** Button anatomy:
  - `min-height: var(--tap-min)` (44px), inline padding 20px, `--radius-1`.
  - Label ≤ 3 words, on one line at ≥ 768px. Optional trailing Phosphor icon at 20px.
  - States: default · hover (`--color-accent-hover`) · `:focus-visible` (outline 2px accent, offset 2px) · `:active` (`translateY(1px)`) · loading (label "Enviando…", `aria-busy="true"`, inline progress).
  - Avoid disabled buttons: submit stays enabled and validation explains what is missing. [eye]
- [ ] **COMP-02** Variants:
  - **Primary**: accent fill, `--color-on-accent` text.
  - **Secondary**: a text link, underlined with a 4px offset, with a trailing arrow **icon** (not the → glyph). No ghost/outline buttons, and no buttons over images.
  - **Icon button**: 44×44 with `aria-label`. [eye]
- [ ] **COMP-03** **CTA vocabulary, one label per intent** (enforced by the lint for `.btn--primary`):

  | Intent | ES | EN | Where |
  |---|---|---|---|
  | Lead / demo request | Pide tu demo | Get your demo | nav, hero, pricing tiles, contact |
  | See the live product | Ver la villa en 3D | View the villa in 3D | hero secondary link, viewer facade, case page |
  | Launch AR | Ver en tu salón | View in your room | viewer toolbar |
  | Price estimate | Calcular precio | Estimate price | pricing |
  | Submit the form | Enviar solicitud | Send request | form |
  | Chat | Escribir por WhatsApp | Message on WhatsApp | mobile bar, contact |

  Repeating the same label for the same intent is correct. Two labels for one intent is a failure.
- [ ] **COMP-04** Use `<a>` for navigation and `<button type="button|submit">` for actions. No `href="#"`, no click handlers on div/span. [lint]

**Header and mobile bar**
- [ ] **COMP-05** Header:
  - 64px, sticky, solid `--color-bg`. A bottom hairline appears after scrolling, toggled by an IntersectionObserver sentinel (never a scroll listener).
  - Order: logo slot · nav · language link · primary CTA.
  - The language link is a real URL to the translated page, with `hreflang`, `lang`, the visible text `EN`/`ES` and an `aria-label` ("English version" / "Versión en español"). [eye]
- [ ] **COMP-06** Mobile action bar (<768px):
  - Two actions: "Pide tu demo" (primary) and WhatsApp (neutral, glyph + label).
  - Height 56px + `env(safe-area-inset-bottom)`, `z-index: var(--z-sticky)`.
  - Hidden while `#contacto` or the footer is in view. [pw]

**The 3D viewer (the most important component)**
- [ ] **COMP-07** Facade pattern. The viewer ships as a poster `<img>` (a real-time capture, so the swap is seamless) plus a "Ver la villa en 3D" button.
  - Model-viewer is **self-hosted** (vendored by the 3D pipeline, `npm run vendor:viewer`) and **dynamically imported**.
  - Import it on click, or when the section is within one viewport (IntersectionObserver) **and** the browser is idle (`requestIdleCallback`) **and** `navigator.connection?.saveData !== true` **and** the effective type is not 2g/3g.
  - Never put it in the initial HTML as a `<script src>`. Measured cost: v4.3.1 is 1.07 MB raw, about 288 KB gzip, about 235 KB brotli. [lint]
- [ ] **COMP-08** Layout (B2):
  - The stage is a full-bleed band in `--color-stage`: no frame, radius 0, no shadow.
  - Desktop: a room rail (grid columns 1-3) beside the stage (4-12).
  - Mobile: the stage is full width at 4:5, with the room chips as a horizontal scroll-snap row above the toolbar.
  - The **toolbar sits below the stage**, never floating over the model. [eye]
- [ ] **COMP-09** Controls, all 44px, keyboard-reachable, with visible text labels:
  - **Estancias**: 12 buttons with names and m², each moving the camera. They double as the gesture alternative.
  - **Vista general**: resets the camera.
  - **Zoom − / +**.
  - **Recorrido**: guided tour with play/pause; stops on any input.
  - **Maqueta**: `aria-pressed` toggle between walls cut at 1.15 m and full height.
  - **Luz**: segmented control, Mañana / Tarde.
  - **Ver en tu salón**: two choices, "Maqueta 1:20" and "Tamaño real". On iOS/Android it opens native AR. On desktop it opens a `<dialog>` with a build-generated QR code and one sentence of instructions. [pw]
- [ ] **COMP-10** Viewer states:
  - Poster (default).
  - Loading: a 2px accent progress line at the stage bottom (`transform: scaleX(progress)`), plus `aria-live="polite"` text "Cargando modelo 3D… 48 %".
  - Ready.
  - Error: "No se ha podido cargar el 3D." plus a link to the renders.
  - No WebGL: the poster stays, 3D-only controls hide, and the AR link is still offered on mobile.
  - Reduced motion: camera jumps, no interpolation. [pw route 404]
- [ ] **COMP-11** A static hint below the stage: "Arrastra para girar. Pellizca o usa la rueda para acercar." Set `interaction-prompt="none"`, so there is no animated hand. [eye]

**Signature and content components**
- [ ] **COMP-12** Plan/render comparison slider:
  - Two registered images (same camera, IMG-07).
  - Driven by a native `<input type="range">` (0-100, step 1) with `aria-label="Comparar plano y render"` and `aria-valuetext` ("Plano 40 %").
  - 44px handle hit area. Arrows, Home and End work. `touch-action: pan-y` on the container.
  - The labels "Plano" and "Render" sit **outside** the image. Default position 50%. [pw keyboard]
- [ ] **COMP-13** "Datos clave" title block (the *cajetín*, like the title block of an architectural drawing):
  - A grid with a 1px `--color-line-strong` outer border and `--color-line` inner dividers. 3×2 on desktop, 2×3 on mobile.
  - Keys in mono `--fs-meta` (`--color-ink-3`); values in the sans at weight 600, `--fs-h3`, tabular.
  - At most one per page. Values come only from `build/data`. This is also the GEO facts block (GEO-02). [eye]
- [ ] **COMP-14** Deliverables bento: 5 deliverables = exactly 5 cells, each with real media.
  - Modelo 3D: cutaway render.
  - Renders: interior render.
  - Visor web: a real screenshot of our viewer.
  - Realidad aumentada: a real iPhone Quick Look capture.
  - Home staging: the same room in two styles.
  - "Próximamente" items (AI video, VR 360) go in one text line under the grid, not in empty cells. [eye]
- [ ] **COMP-15** Process: 5 steps with verb-first titles, never "Paso 1":
  - "Leemos el plano"
  - "Modelamos por código"
  - "Creamos las texturas"
  - "Iluminamos y renderizamos"
  - "Publicamos en web y AR"

  On desktop the exploded axonometric is sticky in columns 1-6 and the steps scroll in columns 7-12. On mobile they stack, drawing first. [eye]
- [ ] **COMP-16** Pricing:
  - At most 3 tiles. One is recommended, marked with a 2px accent outline, not by being taller.
  - "Desde" prices are tabular. Title/price blocks have a fixed height so the feature lists align. CTAs are pinned to the bottom.
  - Each tile's "Pide tu demo" links to the form with the pack preselected (`?pack=anuncio`) and the comment prefilled.
  - Calculator: − / + stepper (44px) + a number input; the live total sits in `aria-live="polite"` and is formatted with `Intl.NumberFormat`.
  - A guarantee strip follows: 3-4 short facts in plain text, no icons in circles. [eye]
- [ ] **COMP-17** FAQ: native `<details>`/`<summary>` grouped by objection category, with an `<h3>` per group and 2 columns on desktop. The +/− icon rotates (`--dur-state`). Every answer is in the HTML, and the first sentence answers the question. [eye]
- [ ] **COMP-18** Lead form, in two steps:
  - Step 1 (a fieldset with a legend): client type (radio cards), service, properties per month.
  - Step 2: name, company, email, phone/WhatsApp, plan upload **or** listing URL, comment, RGPD checkbox (unticked).
  - The progress text reads "Paso 1 de 2" (functional). Without JS it degrades to one long form.
  - Anti-spam: a honeypot `name="website"` inside an `aria-hidden` wrapper with `tabindex="-1"`, plus Turnstile loaded on first focus.
  - Success replaces the form inline with the next steps. Errors are inline (A10). [pw]
- [ ] **COMP-19** Plan upload:
  - `<input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp">` with a visible label and the stated maximum ("Máx. 15 MB").
  - The drop zone is also a click target and keyboard-reachable (it is the input).
  - After selection it shows the filename + a "Quitar" button. [pw]
- [ ] **COMP-20** Footer:
  - At most 3 link groups (Servicios, Zonas, Estudio).
  - A legal row (Aviso legal, Privacidad, Cookies) pointing to real pages.
  - Contact as text links; social icons only for profiles that exist.
  - The language link is repeated. No newsletter pop-up. [eye]
- [ ] **COMP-21** Consent: prefer cookieless analytics, so no banner is needed. If consent is legally required, use a fixed bottom panel with no layout shift, and give "Aceptar" and "Rechazar" **equal visual weight**. It stacks above the mobile action bar. [eye]
- [ ] **COMP-22** Icons: one family, Phosphor (MIT), one weight (Regular in B2). 20px in UI, 24px standalone. Compiled from `@phosphor-icons/core` into a sprite. No hand-drawn icon paths (plan drawings and dimension lines are data graphics, not icons). Decorative icons get `aria-hidden="true"`. [eye]
- [ ] **COMP-23** Cards only where elevation expresses hierarchy (the recommended pricing tile, popovers, dialogs). Otherwise group with spacing and hairlines. [eye]
- [ ] **COMP-24** Loading, empty and error states:
  - Skeletons match the final shape. The only spinner allowed is the one inside the submit button.
  - Error messages state the problem and the next step, for example "No hemos podido enviar tu solicitud. Revisa tu conexión y vuelve a intentarlo, o escríbenos por WhatsApp."
  - No "Oops", no exclamation marks. [eye]
- [ ] **COMP-25** "Embebible en tu ficha":
  - A real `<iframe loading="lazy" title="…">` of our `/embed/` viewer page.
  - A copyable snippet (`<pre><code>`) with a "Copiar" button that announces "Copiado" via `aria-live`.
  - Never a mock of a portal. [eye]

### A10. Accessibility, focus and forms (Vercel Web Interface Guidelines + WCAG 2.2 AA)
- [ ] **A11Y-01** Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`. The first focusable element is the skip link ("Saltar al contenido"). [eye]
- [ ] **A11Y-02** One `h1`, no skipped heading levels. Headings describe their content. [lint]
- [ ] **A11Y-03** Focus: `:focus-visible { outline: var(--focus-width) solid var(--color-accent); outline-offset: var(--focus-offset) }` on every interactive element. Use `outline` (not box-shadow) so it survives forced-colors mode. Use `:focus-within` on compound controls (slider, stepper, segmented control). Never remove the outline without a replacement. [lint + pw forced-colors]
- [ ] **A11Y-04** Keyboard:
  - Everything is operable with Tab, Enter/Space, and arrows (radio groups, slider, segmented control).
  - Esc closes menus and dialogs and returns focus to the trigger.
  - Dialogs use native `<dialog>` + `showModal()` and `overscroll-behavior: contain`. [pw]
- [ ] **A11Y-05** Gesture alternatives: orbit and pinch have button equivalents (rooms, Vista general, zoom ±); the slider has keyboard control; drag-and-drop upload has click. [eye]
- [ ] **A11Y-06** Touch targets are ≥ 44×44px, using padding or pseudo-element hit areas for small icons. Controls get `touch-action: manipulation`. Remove the tap highlight only where a custom `:active` state exists. [pw]
- [ ] **A11Y-07** Every `<img>` has `alt`. Decorative SVGs get `aria-hidden="true"`. Icon-only buttons get `aria-label`. [lint]
- [ ] **A11Y-08** `aria-live="polite"` on: form status, viewer loading/errors, calculator total, and copy confirmation. [eye]
- [ ] **A11Y-09** Forms:
  - A visible `<label for>` above every control (explicit `for`/`id`, which the lint checks). No placeholder-as-label.
  - Placeholders show an example and end with "…" (`ana@tuinmobiliaria.es…`).
  - Correct `type`, `inputmode` and `autocomplete` (`name`, `organization`, `email`, `tel`, `url`). `spellcheck="false"` on email and URL.
  - Never block paste.
  - Errors are inline under the field (`aria-describedby` + `aria-invalid`). On submit, focus the first invalid field.
  - Submit stays enabled until the request starts, then shows "Enviando…".
  - Checkbox/radio label and control share one hit target. The RGPD box starts unticked. `autocomplete="off"` only on non-personal free-text fields.
  - Warn with `beforeunload` if step 2 has unsaved input. [lint partial + pw]
- [ ] **A11Y-10** `<html lang="es|en">`. Fragments in the other language get `lang`. Format and brand tokens (USDZ, GLB, AR Quick Look, Scene Viewer, Blender) are wrapped in `translate="no"`. [eye]
- [ ] **A11Y-11** Never disable zoom. The layout reflows at 320px width and at 200% zoom. [lint + pw]
- [ ] **A11Y-12** Under `prefers-contrast: more`, dividers switch to `--color-line-strong` and `--color-ink-3` text becomes `--color-ink-2`. Under `forced-colors: active`, selected states use borders (not just fills). [pw]
- [ ] **A11Y-13** Media alternatives: videos have captions. The 3D model has a text alternative: model-viewer `alt`, plus the HTML room list with m² next to it. [eye]
- [ ] **A11Y-14** DOM order = visual order. Never reorder meaningful content with CSS `order` or grid placement. [eye]

### A11. Copy mechanics (ES/EN)
- [ ] **COPY-01** ES is the default, in the "tú" register. EN mirrors the meaning, not the words. Sentence case everywhere.
- [ ] **COPY-02** Punctuation:
  - Use "…" (never "...").
  - Quotes: ES « » (nested “ ”); EN “ ” and the ’ apostrophe.
  - Zero em and en dashes (SLOP-09). Ranges use a hyphen ("2-4 días").
  - No exclamation marks in UI. Loading text ends with "…" ("Cargando…", "Enviando…"). [lint]
- [ ] **COPY-03** Format numbers at build with `Intl.NumberFormat`: ES "1,15 m", "129 €"; EN "1.15 m", "€129". Use a non-breaking space between number and unit (`75&nbsp;m²`, `129&nbsp;€`, `24&nbsp;h`). Write counts as numerals ("12 estancias").
- [ ] **COPY-04** Every number comes from `build/data`, the single source shared by the page, JSON-LD, `llms.txt` and the PDF dossier. Estimates carry "aprox.". No invented precision.
- [ ] **COPY-05** Reference strings, used to size the hero:
  - H1 ES "Del plano 2D al modelo 3D, sin fotos" (36 characters); EN "From 2D floor plan to 3D, no photos" (35).
  - Subtext ES "Modelo 3D fotorrealista, visor web y realidad aumentada a partir del plano de la vivienda. En días." (17 words).
- [ ] **COPY-06** Human microcopy: "Contesta una persona", "Respuesta en menos de 24 h" (only while it is true), "Sin compromiso".
- [ ] **COPY-07** The case is always "villa en la Costa del Sol" (IMG-02).

### A12. Performance budgets (mobile, Lighthouse simulated slow 4G)
- [ ] **PERF-01** LCP < 2.0 s · CLS < 0.05 · INP < 150 ms (field) / TBT < 150 ms (lab). Lighthouse ≥ 95 in Performance, Accessibility, Best Practices and SEO. [lh]
- [ ] **PERF-02** Size budgets:
  - HTML ≤ 60 KB, uncompressed [lint].
  - Critical CSS inline ≤ 14 KB; total CSS ≤ 40 KB.
  - **Initial JS ≤ 30 KB**, with no framework [lint].
  - Third-party JS before interaction: 0. Analytics is ≤ 2 KB and loads after `load`.
- [ ] **PERF-03** Fonts: ≤ 3 files, ≤ 110 KB, 1 preload. B2 measures 58 KB (Archivo 46 KB + Geist Mono 12 KB). [lint]
- [ ] **PERF-04** Images: the LCP image ≤ 120 KB [lint]; ≤ 250 KB of image bytes above the fold; everything else lazy.
- [ ] **PERF-05** Model-viewer (about 288 KB gzip), the GLB and the USDZ are **never requested before intent** or the idle rule in COMP-07. Verify in the network list (D2). [pw requests]
- [ ] **PERF-06** At most 1 `backdrop-filter` rule (B2 uses none) [lint]. No blur or shadow animation. Use `content-visibility: auto` + `contain-intrinsic-size` on long below-fold guide sections.
- [ ] **PERF-07** Every asset comes from our own origin. Hashed filenames + `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`. HTML revalidates.
- [ ] **PERF-08** No layout reads (`getBoundingClientRect`, `offsetHeight`) in scroll, resize or input handlers. Batch DOM writes.

### A13. Design rules that protect SEO and GEO
- [ ] **GEO-01** All meaningful content is HTML text in the initial response. No JS-injected copy, no text baked into images, no client-side i18n (the competitor's mistake). Room names and m² shown in the viewer also exist in the HTML list.
- [ ] **GEO-02** Each page has one "Datos clave" block (COMP-13) with self-contained factual sentences, plus a visible "Última actualización" in a `<time datetime>` element.
- [ ] **GEO-03** Pricing and comparison data use a real `<table>` with `<caption>` and `<th scope>`, never a div grid.
- [ ] **GEO-04** Headings on dedicated pages are descriptive: "Precio de un modelo 3D a partir del plano", not "Precios". Anchor ids use `scroll-margin-top`.
- [ ] **GEO-05** FAQ answers are visible in HTML (COMP-17).
- [ ] **GEO-06** Inner pages show visible breadcrumbs that match the `BreadcrumbList` JSON-LD.
- [ ] **GEO-07** Tab panels, if any, all exist in the DOM (hidden with the `hidden` attribute), never rendered only on click.

---

## Part B · Three candidate art directions

### B0. What every direction shares
- **Spacing tokens:** `--space-1` to `--space-11` = 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160 px.
- **Grid:** 12 / 8 / 4 columns; breakpoints 640 / 768 / 1024 / 1280 / 1536.
- **Gutter:** `clamp(16px, 4vw, 48px)`.
- **Z-index scale and motion token names:** as in `tokens.css`.
- **Content model:** components from A9, the home blueprint from C6, and every Part A rule.
- **What differs:** palette, type, shape, motion character, signature interactions, hero composition, and how the viewer sits in the page.

### B1. "Monografía": Mediterranean editorial, architectural monograph

**Concept.** The site reads like a printed monograph devoted to one house:
- Large plates (full renders) with captions, and an index of rooms.
- Serif titles, generous margins and a calm, page-turning pace.
- Warmth comes from limestone white and an olive-ink accent (the olive tree on the terrace).
- The serif is justified because developers and premium Marbella agencies buy through printed brochures and dossiers. The register says "architectural publication", and it makes the downloadable PDF dossier feel native.

Mood: *quiet, literate, lime-washed.* Dials: VARIANCE 7 · MOTION 4 · DENSITY 3.

**Palette** (every pair measured):

| Token | Light | Dark | Role / contrast |
|---|---|---|---|
| `--color-bg` "Cal" | `#F2F2EE` | `#121410` | Page. Deliberately greyer than the banned cream family. |
| `--color-surface` | `#FAFAF8` | `#1A1C17` | Inputs, menus |
| `--color-stage` | `#E6E7E1` | `#20231D` | Viewer and plate backdrop |
| `--color-ink` | `#1B1E19` | `#ECEDE6` | 15.0:1 / 15.7:1 on bg |
| `--color-ink-2` | `#474C43` | `#B8BCB0` | 7.9:1 / 9.6:1 |
| `--color-ink-3` | `#62675D` | `#969B8E` | 5.2:1 / 6.5:1 (4.7 / 5.6 on stage) |
| `--color-line` | `#D5D7CE` | `#2F332B` | Decorative rules only |
| `--color-line-strong` | `#7C8175` | `#6B7064` | Input borders, ≥ 3.1:1 on every surface |
| `--color-accent` "Olivo" | `#4D5A2C` | `#B7C48C` | 6.7:1 / 10.0:1 on bg; saturation 34% |
| `--color-accent-hover` | `#3D4822` | `#C9D4A3` | |
| `--color-on-accent` | `#FAFAF8` | `#121410` | 7.1:1 / 10.0:1 |
| `--color-accent-soft` | `#E2E6D3` | `#2A3020` | Selected rows |
| `--color-danger` / `--color-success` | `#A3312A` / `#2E6A3B` | `#F08A80` / `#8FCB98` | |

**Fonts (2 families, ≤ 91 KB):**
- **Newsreader** (display only; instanced at `opsz 72`, `wght 400-600`): **36 KB**.
- Optional **Newsreader Italic** (`opsz 72`, `wght 400`) for same-family emphasis: **21 KB**.
- **Schibsted Grotesk** (text, UI, prices; `wght 400-700`; has `tnum`): **34 KB**.

Rules: the serif is never used for UI, buttons, prices, forms or body text. Newsreader is pinned at opsz 72, so it must never go below 28px.

**Type scale:**

| Role | Family / settings | Size |
|---|---|---|
| H1 | Newsreader 420, lh 1.06, tracking -0.015em | `clamp(2.375rem, 1.55rem + 3.5vw, 4.5rem)` (38 → 72) |
| H2 | Newsreader 420, lh 1.1 | `clamp(1.875rem, 1.4rem + 2vw, 3.125rem)` (30 → 50) |
| H3 | Schibsted 600, lh 1.25 | `clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem)` (20 → 24) |
| Lead | Schibsted 400, lh 1.5 | `clamp(1.1875rem, 1.1rem + 0.4vw, 1.4375rem)` (19 → 23) |
| Body | Schibsted 400, lh 1.62 | 1.0625rem (17) |
| Caption | Schibsted 400, `--color-ink-2`, lh 1.45 | 0.875rem (14) |
| Meta | Schibsted 500, +0.02em | 0.8125rem (13) |

Hero H1 budget: ≤ 34 characters in 5 columns (about 22 characters per line at 64px in 640px).

**Spacing:** `--section-y: clamp(72px, 8vw + 32px, 176px)` · container 1240px · plates may break out to 100vw.

**Radius:** 0 on media, sections and the stage; 4px on buttons, inputs and chips. No cards.

**Borders and shadows:** 1px `--color-line` rules above section heads (the print *filete*). **Zero shadows.** Optional grain on a fixed `pointer-events: none` layer at ≤ 0.03 opacity.

**Motion ("page turn"):**
- Durations: hover 200ms, state 300ms, reveal 700ms (rise 16px, stagger 80ms), sequence 1000ms.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Plate "uncover": a cover element animates `transform: scaleY(1 → 0)` from the top, 900ms in-out, once.
- The room index crossfades plates in 260ms.
- Never: parallax, scroll-linked sequences, auto-rotate.

**Signature interactions:**
1. **Índice de estancias**: a 2-column index of the 12 rooms (name + m²). Hover or focus swaps the plate (loaded on first intent) and highlights the room on a small plan thumbnail.
2. **Calco**: the plan drawn as tracing paper over the render, with a crossfade slider (COMP-12 mechanics).
3. **Captioned plates**: render + one-line caption, never numbered.
4. **Viewer as a plate**, framed by margins.

**Hero:**
```
| logo   Servicios  Proceso  Precios  La villa  FAQ              EN  [Pide tu demo] |
| cols 1-5                         | cols 6-12: plate, interior render at 4:5       |
|                                  |                                                |
| Del plano a la casa              |                                                |
| que aún no existe      (serif)   |                                                |
| subtext (<= 20 words)            |                                                |
| [Pide tu demo]  Ver la villa en 3D                                                |
|                                  | Salón y terraza. Render a partir del plano 2D. |
```
Mobile: text first, then the plate full-bleed at 4:5, then the caption.

**Viewer blend:** contained in the grid with plate margins, on `--color-stage`. The caption sits below, then a text-button toolbar. No full-bleed.

**Direction-specific risks:**
- Looks like the Marbella luxury-agency register (serif + neutral), so it is less distinctive.
- The serif costs an extra 36-57 KB.
- An editorial pace slows B2B scanning.

### B2. "Plano": gallery-white technical precision with a Mediterranean añil (**recommended**)

**Concept.** *The plan is the brand.*
- The site reads like a well-drawn architectural set: gallery-white sheets, graphite ink, and hairlines that carry **real dimensions**.
- A title block (*cajetín*) holds the key facts.
- One **añil** accent: the blue of Andalusian lime-washed plinths and of blueprint ink.
- All warmth comes from the renders (golden light, oak, terracotta tiles, the olive tree). The UI stays neutral so the product is the colour.

The visual language itself proves the differentiator: *real geometry at scale, not generative AI guessing.*

Mood: *exact, calm, confident.* Dials: VARIANCE 6 · MOTION 5 · DENSITY 4.

**Palette** (canonical values in `tokens.css`, every pair measured):

| Token | Light | Dark | Role / contrast |
|---|---|---|---|
| `--color-bg` "Papel" | `#F4F5F6` | `#0F1215` | Page. Ink 16.5:1 / 15.7:1 |
| `--color-surface` "Lámina" | `#FCFCFD` | `#161A1E` | Inputs, menus, dialogs |
| `--color-stage` "Mesa" | `#E4E7EA` | `#1B2025` | Viewer and render backdrop, matched to the poster |
| `--color-ink` "Grafito" | `#14171B` | `#E8EBEE` | Headings, body |
| `--color-ink-2` | `#434A52` | `#AEB5BD` | 8.2:1 / 9.1:1 |
| `--color-ink-3` | `#5F6771` | `#8A929B` | 5.3:1 / 6.0:1 on bg; 4.6:1 / 5.2:1 on stage |
| `--color-line` | `#D6DAE0` | `#283038` | Decorative hairlines only |
| `--color-line-strong` | `#79818B` | `#66707B` | Input borders, dimension lines, ≥ 3.1:1 on every surface (3.2 on stage) |
| `--color-accent` "Añil" | `#2D4596` | `#A2B3EA` | 8.0:1 on bg / 8.5:1 on surface; saturation 54% / 63% |
| `--color-accent-hover` | `#233A80` | `#B8C5F2` | |
| `--color-on-accent` | `#FCFCFD` | `#0F1215` | 8.5:1 / 9.1:1 |
| `--color-accent-soft` | `#E2E7F4` | `#1C2640` | Active room row: ink 14.5:1 / 12.5:1 |
| `--color-danger` | `#B3261E` | `#F2877E` | 6.4:1 / 7.1:1 on surface |
| `--color-success` | `#1F7245` | `#7FCB9E` | 5.8:1 / 9.1:1 |

The añil is deliberately not Tailwind blue-500/600/700. It is a muted ultramarine that sits complementary to the terracotta and oak in the renders.

**Fonts (2 families, 58 KB total, one preload):**
- **Archivo** (Omnibus-Type, Google Fonts, OFL): variable, instanced to `wdth 100-125` and `wght 400-650`, ES/EN subset, **46 KB**. One file serves display (expanded) and text (normal width), and it has `tnum`.
- **Geist Mono**: `wght 400-500`, **12 KB**. Measurements, data keys and dimension labels only.
- Metric fallbacks are in `tokens.css`:
  - Text: size-adjust 98.4%, ascent 89.2%, descent 21.3%.
  - Display S (width 106): 107.6% / 81.6% / 19.5%.
  - Display L (width 118): 121.6% / 72.2% / 17.3%.

**Type scale** (`font-stretch` drives the width axis):

| Role | Settings | Size token |
|---|---|---|
| Display (≤ 5-word statements) | Archivo 560, stretch 106% (<1024) / 118% (≥1024), lh 1.04, -0.022em | `--fs-display` `clamp(2.5rem, 1.5rem + 4.3vw, 5.25rem)` (40 → 84) |
| H1 | same | `--fs-h1` `clamp(2.125rem, 1.45rem + 2.9vw, 4rem)` (34 → 64) |
| H2 | Archivo 560, stretch 112%, lh 1.1, -0.018em | `--fs-h2` `clamp(1.75rem, 1.35rem + 1.7vw, 2.75rem)` (28 → 44) |
| H3 | Archivo 600, stretch 100%, lh 1.2, -0.01em | `--fs-h3` `clamp(1.3125rem, 1.2rem + 0.5vw, 1.625rem)` (21 → 26) |
| Lead | Archivo 400, lh 1.5 | `--fs-lead` (18 → 21) |
| Body | Archivo 400, lh 1.6 | `--fs-base` 17px |
| UI / buttons | Archivo 560, +0.005em | `--fs-sm` 15px to `--fs-base` |
| Meta / dimension labels | Geist Mono 450, +0.01em, lh 1.4, sentence case | `--fs-meta` 13px |

**Spacing:** `--section-y: clamp(64px, 6vw + 40px, 136px)` · container 1320px · the stage band and hero visual bleed to the viewport edge.

**Radius:** an **all-sharp system**. `--radius-0: 0` for images, stage, sections and title blocks; `--radius-1: 2px` for buttons, inputs, chips, toggles and menus. No pills, no 12-30px cards.

**Borders and shadows:**
- Structure is drawn with 1px hairlines (`--color-line`) that group real content, never decorative grids.
- Controls and dimension lines use `--color-line-strong`.
- **No shadows on content.** `--shadow-pop` is only for popovers, menus and dialogs; in dark mode it becomes a 1px line plus a deep tinted shadow.
- No `backdrop-filter` anywhere.

**Motion language ("measured, mechanical"):**

| What animates | How | Duration / easing | Why |
|---|---|---|---|
| Dimension lines (*cotas*) on the title block and drawings | 1px line `scaleX(0 → 1)` from the left, then the label fades in | 480ms `--ease-out`, then 180ms | Storytelling: these are measured facts |
| Exploded axonometric (*despiece*) in "Cómo lo hacemos" | 3 aligned RGBA layers (plan lines, walls, furniture) go from separated (`translateY` 0 / -48px / -96px) to assembled | Scroll-driven, `view()` timeline, range `entry 10%` to `cover 50%` | Shows plan → walls → furnished |
| Comparison slider first view | One peek (50 → 38 → 50%) | 900ms `--ease-in-out`, once | Teaches the affordance |
| Reveals | opacity + 12px rise, stagger 60ms, max 6 | 480ms `--ease-out` | Hierarchy |
| Toggles (Maqueta, Luz, room selection indicator) | transform / opacity | 260ms `--ease-in-out` | State change |
| Hover / press | colour / `translateY(1px)` | 180ms / 120ms | Feedback |

Never: parallax, blur, magnetic buttons, marquees, auto-rotate by default, animated hand prompts, animated entrances in the hero. Under reduced motion everything shows its final state, and the despiece becomes the assembled image with its 3 captions.

**Signature interactions:**
1. **"Del plano al 3D" registered slider.** The line plan (redrawn from our model, walls in solid ink, dimension strings) is compared against the furnished top-down render, from the same orthographic camera, pixel-registered (COMP-12).
2. **Despiece.** The scroll-driven exploded axonometric tied to the 5 process steps. It costs three AVIF layers with alpha, ≤ 180 KB total.
3. **Maqueta interactiva.** The viewer with a room rail showing m², the 1.15 m cutaway toggle, the Mañana/Tarde light control, the guided tour and hotspots (COMP-08 to COMP-11).
4. **"Ver en tu salón".** A one-tap AR handoff (Maqueta 1:20 or Tamaño real), with a QR dialog on desktop.
5. **Cajetín.** The title block of key facts (COMP-13), used on every page as the GEO facts block.
6. **Pricing calculator** with a stepper and a live tabular total.

A scroll-driven model rotation was considered and rejected as the default. It needs model-viewer (about 288 KB gzip) plus the GLB before intent, and it fights page scroll on touch. The despiece delivers the same "plan becomes model" story for about 180 KB with transform-only animation. If ever added, it would be a desktop-only 24-frame AVIF turntable (≤ 900 KB), loaded only with `(pointer: fine)`, no Save-Data and no reduced motion.

**Hero composition:**
```
Desktop (>= 1024)
| logo slot   Servicios  Cómo funciona  Precios  La villa  FAQ     EN  [Pide tu demo] |  64px
|-------------------------------------------------------------------------------------|
| cols 1-5 (text)                       | cols 6-12, bleeds to the right edge         |
|                                       | +---------- stage #E4E7EA ---------------+  |
| Del plano 2D al modelo                | |  cutaway isometric of the villa         |  |
| 3D, sin fotos                (H1)     | |  (AVIF with alpha, LCP, fetchpriority)  |  |
|                                       | |                                         |  |
| Modelo 3D fotorrealista, visor web    | +-----------------------------------------+  |
| y realidad aumentada a partir del     | Villa en la Costa del Sol. Render generado  |
| plano de la vivienda. En días.        | a partir del plano 2D, sin fotos. (caption) |
|                                       |                                             |
| [Pide tu demo]   Ver la villa en 3D (arrow icon, scrolls to #demo)                  |

Mobile (< 768)
| logo slot                     [Menú] |
| H1 (<= 3 lines)                      |
| subtext                              |
| [Pide tu demo]      (full width)     |
| Ver la villa en 3D                   |
| stage full-bleed 4:5, poster         |
| caption                              |
| [Pide tu demo] [WhatsApp]  bottom bar|
```
The hero visual is a still poster with no overlaid button (IMG-08). The live 3D lives in `#demo`. On mobile the H1 is the likely LCP element, which is why Archivo is the preloaded font.

**How the viewer blends in:**
- The `#demo` section is a full-bleed band in `--color-stage`, the same colour the RGBA poster sits on. The model appears to rest on the page's own "drawing table" with no frame, radius or shadow.
- A real-time capture from the default camera is the `poster`, so the swap from poster to live model is invisible.
- The room rail (desktop, columns 1-3) lists the 12 rooms with m² in tabular figures. The active room uses `--color-accent-soft` and a 2px accent bar.
- The toolbar sits below the stage, left-aligned, with the hint text under it.
- Recommended model-viewer settings:

```html
<model-viewer
  src="/assets/3d/villa.[hash].glb" ios-src="/assets/3d/villa-1a20.[hash].usdz"
  poster="/assets/img/villa-viewer-poster.[hash].avif" alt="Modelo 3D de una villa en la Costa del Sol, planta alta con 12 estancias"
  loading="lazy" reveal="auto" camera-controls touch-action="pan-y" interaction-prompt="none"
  tone-mapping="agx" environment-image="neutral" exposure="1" shadow-intensity="0.6" shadow-softness="0.8"
  field-of-view="30deg" camera-orbit="-30deg 55deg auto" min-camera-orbit="auto 10deg auto" max-camera-orbit="auto 85deg auto"
  ar ar-modes="webxr scene-viewer quick-look" ar-placement="floor">
</model-viewer>
```
Notes on these settings:
- `tone-mapping="agx"` matches the Blender AgX renders.
- `touch-action="pan-y"` lets the page scroll on phones.
- "Tamaño real" (1:1, walk-in) and "Maqueta 1:20" are two baked asset variants. The pipeline decides the file names; the design only needs two clearly labelled buttons.
- Hotspots are `<button slot="hotspot-…">` elements with visible room labels in `--fs-meta`, a `--color-surface` fill, a 1px `--color-line-strong` border and 2px radius. They appear only after the model is ready.

**Direction-specific bans:** no glassmorphism; no pills; no Geist Mono for paragraphs; no fake "blueprint grid" backgrounds (lines must carry real data); no cyan-on-navy "blueprint" cliché (the page stays white-ground).

### B3. "Nocturno": dark cinematic (blue hour)

**Concept.** The villa at *hora azul*:
- A dark stage where the renders glow: warm interior light, deep blue sky.
- Imagery is letterboxed at 21:9, and the page reads as a film sequence in chapters.
- One cool accent, **agua** (the pool water, the teal cushion in the demo).
- It suits the upcoming AI cinematic videos.

Mood: *nocturnal, filmic, spacious.* Dials: VARIANCE 7 · MOTION 6 · DENSITY 3.

**Palette** (dark is the default; light follows `prefers-color-scheme: light`):

| Token | Dark (default) | Light | Role / contrast |
|---|---|---|---|
| `--color-bg` | `#0B0E11` | `#EDF0F1` | Ink 16.1:1 / 16.2:1 |
| `--color-surface` | `#12161A` | `#F8FAFA` | Panels, control bar |
| `--color-stage` | `#171C21` | `#DFE4E6` | Viewer |
| `--color-ink` | `#E7EBEE` | `#0F1417` | |
| `--color-ink-2` | `#A8B1B8` | `#3E484F` | 8.9:1 / 8.2:1 |
| `--color-ink-3` | `#86909A` | `#5A646C` | 6.0:1 / 5.3:1 |
| `--color-line` | `#232A31` | `#CDD4D8` | Decorative |
| `--color-line-strong` | `#65717C` | `#748089` | ≥ 3.1:1 on every surface |
| `--color-accent` "Agua" | `#7CC6BC` | `#1D6A62` | 9.8:1 on bg / 5.6:1 on bg; saturation 39% / 57% |
| `--color-accent-hover` | `#98D5CD` | `#15544D` | |
| `--color-on-accent` | `#0B0E11` | `#F8FAFA` | 9.8:1 / 6.1:1 |
| `--color-accent-soft` | `#15302D` | `#D6E9E6` | |
| `--color-danger` / `--color-success` | `#F08A80` / `#86CFA0` | `#B3261E` / `#1F7245` | |

**Fonts (2 families, 72 KB):**
- **Mona Sans** (Google Fonts, OFL): instanced to `wdth 75-100` and `wght 400-650`, **60 KB**. Condensed width (82-88) gives film-title headings; width 100 is for text. Has `tnum`.
- **Geist Mono** `400-500`, **12 KB**, for measurements only.
- No timecodes or "REC" gimmicks (SLOP-06).

**Type scale:**

| Role | Settings | Size |
|---|---|---|
| H1 | Mona Sans 600, stretch 82%, lh 1.0, -0.01em | `clamp(2.5rem, 1.5rem + 4.3vw, 5.25rem)` (40 → 84) |
| H2 | Mona Sans 600, stretch 88%, lh 1.05 | `clamp(1.875rem, 1.3rem + 2.4vw, 3.5rem)` (30 → 56) |
| H3 | Mona Sans 600, stretch 100%, lh 1.2 | `clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem)` |
| Body | Mona Sans 400, lh 1.65 (extra leading on dark) | 1.0625rem |
| Meta | Geist Mono 450 | 0.8125rem |

Hero H1 budget: ≤ 56 characters (about 27 characters per line at 64px in 640px).

**Spacing:** `--section-y: clamp(80px, 9vw + 32px, 192px)` (chapters) · container 1440px · letterbox media spans 100vw.

**Radius:** a documented mixed system. 0 on full-bleed media; 12px on contained media, panels and dialogs; `999px` on buttons and chips.

**Borders and shadows:** no drop shadows (invisible on dark). Elevation comes from surface steps (`bg` → `surface` → `stage`), a 1px `--color-line`, and an inner highlight (`inset 0 1px 0 rgb(231 235 238 / 0.05)`). `backdrop-filter: blur(16px)` is allowed **only on the fixed header**, with a solid fallback under `@supports not (backdrop-filter: blur(1px))` and `prefers-reduced-transparency: reduce`.

**Motion ("cinematic but earned"):**
- Durations: hover 200ms, state 320ms, reveal 800ms, sequence 1200ms.
- Easing: `cubic-bezier(0.25, 1, 0.5, 1)`; crossfades use `cubic-bezier(0.7, 0, 0.3, 1)`.
- Hero "slow push": `scale(1.06 → 1)` over 1400ms, once. It is LCP-safe because opacity stays 1.
- A scroll-linked "dolly" on chapter plates (`scale(1.08 → 1)`, `view()` range `entry 0%` to `cover 60%`).
- A day to dusk crossfade (900ms).
- Never: blur reveals, glow, neon, looping ambient motion.

**Signature interactions:**
1. **Day ↔ dusk light slider** over the same camera (two renders, opacity driven by a range input). It mirrors the viewer's light control.
2. **Letterbox chapters** with the scroll dolly.
3. **Full-bleed viewer** with dusk lighting and a guided tour styled as a camera path (play/pause).
4. **Video chapter** (when the AI videos exist): click-to-play, captions.

**Hero:**
```
| logo            Servicios  Proceso  Precios  La villa  FAQ   EN  (Pide tu demo) |  fixed, blurred
| +------------------ 21:9 dusk render, full-bleed (LCP) ------------------------+ |
| |                                                                              | |
| +------------------------------------------------------------------------------+ |
| H1 (cols 1-8, condensed, no overlap with the image)                              |
| subtext (cols 1-6)                                                               |
| (Pide tu demo)  Ver la villa en 3D                                               |
```
Mobile: the render is art-directed to a 4:5 crop (≤ 80 KB AVIF), and the text sits below it.

**Viewer blend:** a full-bleed dark stage; the model lit by a dim environment (exposure 0.9). The control bar floats at the bottom-left of the stage as a solid `--color-surface` pill group (controls may overlap the canvas; text content may not). Rooms open in a side sheet (`<dialog>`) on mobile.

**Direction-specific risks:**
- Dark, cinematic presentation is common in arch-viz portfolios, so it tends to read as "portfolio" rather than "service with public prices".
- Pricing, FAQ and forms are harder to read on dark.
- The 21:9 full-bleed imagery raises byte weight.
- Model lighting needs separate tuning for dark.

### B4. Side-by-side

| | B1 Monografía | **B2 Plano** | B3 Nocturno |
|---|---|---|---|
| Default theme | Light (+ dark) | Light (+ dark) | Dark (+ light) |
| Accent | Olivo `#4D5A2C` | Añil `#2D4596` | Agua `#7CC6BC` |
| Fonts (measured) | Newsreader + Schibsted Grotesk, 70-91 KB | Archivo + Geist Mono, **58 KB** | Mona Sans + Geist Mono, 72 KB |
| Shape | 0 / 4px | 0 / 2px (all sharp) | 0 / 12px / pill |
| Shadows | none | popovers only | none (surface steps) |
| `backdrop-filter` | none | none | header only |
| Signature | room index, calco, plates | plan/render slider, despiece, cajetín, maqueta | day/dusk slider, letterbox dolly |
| Main risk | looks like Marbella luxury agencies | can feel cold (renders fix it) | reads as a portfolio; weaker for forms and prices |

---

## Part C · Recommendation

### C1. Verdict
**Build B2 "Plano".** Borrow two things from B1: captioned editorial plates on the case-study page, and the room index as the room rail. Borrow one thing from B3: a single dusk render as one chapter of the case study. The page theme and tokens stay B2.

### C2. Why

| Criterion (weight) | B1 | **B2** | B3 |
|---|---|---|---|
| B2B conversion clarity (30%) | 4 | **5** | 3 |
| Performance headroom (25%) | 4 | **5** | 3 |
| Distinctiveness vs vistastudiodesign.com and the Costa del Sol market (20%) | 3 | **4** | 4 |
| Fit with the core message "real geometry, not AI guessing" (15%) | 3 | **5** | 3 |
| Fit with our renders and the no-logo state (10%) | 4 | **4** | 3 |
| **Weighted score** | 3.65 | **4.70** | 3.20 |

1. **Conversion for B2B real-estate buyers.**
   - Agency owners and developers scan for five things: what it is, whether it works for their listings, price, speed and how to start.
   - B2 puts the working product in the hero and the `#demo` band, states facts in a title block with tabular numbers, and keeps one high-contrast CTA (añil fill, 8.5:1) with a single label everywhere.
   - A light ground is the most readable for pricing tables and the two-step form.
   - The embedded viewer looks native inside light portal listings (Idealista and Fotocasa are light), which is the exact use case we sell.
2. **Performance.**
   - The lightest type payload: 58 KB, one preload, metric fallbacks.
   - No shadows, blur or background video.
   - RGBA posters reuse one asset across both themes.
   - The despiece costs about 180 KB where a scroll-rotated model would cost about 288 KB of JS + a 6 MB GLB.
   - Everything heavy waits for intent (COMP-07).
3. **Distinctiveness vs vistastudiodesign.com** (from `docs/research/01-competidores.md`):

   | | vistastudiodesign.com | B2 |
   |---|---|---|
   | Palette | Warm terracotta `#B4552F` + cream `#FBF6EF` + espresso | Cool papel/grafito + añil |
   | Type | Plus Jakarta Sans + Inter, 7 Google Fonts weights | Archivo expanded + Geist Mono, self-hosted, 58 KB |
   | Shape | Pill buttons, 12/20/30px radii | 2px everywhere |
   | Headings | Centered, with an 11px uppercase eyebrow on every section | Left-aligned, ≤ 1 eyebrow per 3 sections |
   | Motion | Glass sections over a 13 MB scroll-scrubbed video | No video, no glass |
   | Proof | Before/after of **photos** | A **plan-to-render** slider (our input is the plan) plus live 3D + AR, which no competitor shows working on its own site |

   Against high-end arch-viz studios that sell by quote and show portfolios (the Viseni type: no public prices, delivery in weeks), B2 reads as a *service with public prices and a live demo*, not a portfolio.
4. **Message fit.** The competitive wedge is geometric fidelity versus AI-generated staging. A drawing-set language with real dimension lines demonstrates that claim instead of asserting it.
5. **GEO fit.** The *cajetín* makes a self-contained facts block visually natural on every page, so LLM-quotable sentences and tables look designed rather than bolted on.
6. **No-logo resilience.** A neutral system with a single accent token absorbs any future logo, changing one file at most.

### C3. Risks and mitigations
- **Could feel cold.** Every section with a visual uses a warm render (golden light, oak, terracotta tiles, olive tree). Captions stay human. The añil has 54% saturation, not neon.
- **Could look SaaS-generic.** No icon bentos, gradients, glass or pills. Architectural vocabulary does the work: dimension lines with real values, the title block, orthographic plan drawings. Archivo expanded headings instead of the Geist/Inter look.
- **Scroll-driven support gaps.** The despiece sits behind `@supports`. The fallback is a once-only IntersectionObserver transition, and reduced motion shows the assembled image with 3 captions.
- **The poster-to-live swap is visible.** The viewer poster must be a real-time capture from the default camera (COMP-07). The hero keeps the Cycles render.

### C4. What would change the decision
- If the first real leads skew heavily to luxury developers buying branded brochures, B1 wins. That would be a **site-wide** switch, because theme and type locks cannot differ per page.
- If AI cinematic video becomes the flagship product, revisit B3.
- If the future logo carries a strong colour, change only the accent tokens and re-measure contrast (COLOR-06).

### C5. Home page blueprint (B2)

| # | Section | Layout family | Eyebrow | Motion |
|---|---|---|---|---|
| 1 | Hero | Asymmetric split 5/7, visual bleeds right | no | none on load (MOTION-05) |
| 2 | Datos clave (*cajetín*) | Data-grid band | no | dimension lines draw once |
| 3 | Del plano al 3D | Full-width interactive comparison | **yes** | slider peek once |
| 4 | Qué recibes (5 deliverables) | Asymmetric bento, exactly 5 cells | no | reveal stagger |
| 5 | Cómo lo hacemos (5 steps) | Sticky split: despiece left, steps right | no | scroll-driven despiece |
| 6 | La villa en 3D (`#demo`) | Full-bleed app band with room rail | **yes** | viewer only |
| 7 | Para quién (agencias, promotoras, arquitectos, alquiler vacacional) | Index list, 2×2 grouped rows linking to landing pages | no | none |
| 8 | Precios | Tiles + calculator + guarantee strip | no | none |
| 9 | Preguntas frecuentes | 2-column grouped `<details>` | **yes** | icon rotate |
| 10 | Contacto | Form panel + alternatives (WhatsApp, videollamada, email) stacked below | no | none |

This gives 10 sections, 3 eyebrows (limit 4, spaced ≥ 3 apart), 10 distinct families, and no 3 consecutive splits. AIDA mapping: Attention (1) · Interest (2-4) · Desire (5-7) · Action (8-10).

**Other templates** reuse the same components:
- **Service and audience pages:** left-aligned text hero, then *cajetín* → relevant render/viewer excerpt → process → pricing excerpt → FAQ → contact.
- **Location pages:** must contain real local content (property types, typical requests in that area), never swapped city names.
- **Case study (`/caso/villa-costa-del-sol/`):** the hero **is** the viewer facade.
- **Guides:** 66ch reading column, table of contents, tables for comparisons.
- **Legal pages:** plain reading layout.

---

## Part D · Pre-flight checklist (run before every ship)

### D1. Mechanical (must be 0 errors)
- [ ] `node scripts/design-lint.mjs dist` (copy from `docs/design/design-lint.mjs`). It checks:
  - **Copy:** em/en dashes, `...`, straight quotes (warning), banned vocabulary ES/EN.
  - **Leftovers:** `TODO`/`FIXME`/`{{BRAND}}`, picsum/unsplash/Google Fonts URLs.
  - **Structure:** exactly one `h1`, heading jumps, the eyebrow budget.
  - **Images:** alt, width/height, lazy loading, a single `fetchpriority="high"`, LCP weight ≤ 120 KB.
  - **Interaction:** div/span click handlers, `href="#"`, icon buttons without `aria-label`, buttons without `type`, form controls without label/name, disabled zoom.
  - **Loading and budgets:** eager model-viewer script, primary CTA labels outside the dictionary, HTML ≤ 60 KB, initial JS ≤ 30 KB.
  - **CSS:** `transition: all`, removed outlines, `100vh`, pure black/white, custom cursors, hex outside `tokens.css`, `backdrop-filter` count.
  - **Fonts:** ≤ 3 files, each ≤ 60 KB.
- [ ] The SEO/QA check (the transfermalaga-style `check.js`: links, canonical, hreflang, unique titles/descriptions, valid JSON-LD, sitemap) passes.
- [ ] `grep -rn "will-change\|z-index: *[0-9]" dist/assets/css` returns only token-based or documented uses.

### D2. Visual QA with playwright-cli
Serve `dist/` locally (`npm run serve`), then run the following. In PowerShell, prefix URLs that contain `&` with `--%`.

```bash
playwright-cli open --browser=chrome http://localhost:PORT/
# Viewports x themes: screenshot every template at each size, light and dark
playwright-cli resize 375 812   && playwright-cli screenshot --filename=qa/home-375-light.png
playwright-cli resize 768 1024  && playwright-cli screenshot --filename=qa/home-768-light.png
playwright-cli resize 1024 768  && playwright-cli screenshot --filename=qa/home-1024-light.png
playwright-cli resize 1440 900  && playwright-cli screenshot --filename=qa/home-1440-light.png
playwright-cli set-color-scheme dark && playwright-cli screenshot --filename=qa/home-1440-dark.png
playwright-cli resize 375 812   && playwright-cli screenshot --filename=qa/home-375-dark.png
playwright-cli clear-color-scheme

# Layout assertions (each must print true)
playwright-cli eval "document.documentElement.scrollWidth <= window.innerWidth"
playwright-cli eval "document.querySelector('.hero .btn--primary').getBoundingClientRect().bottom <= window.innerHeight"
playwright-cli eval "(() => { const h = document.querySelector('h1'); return Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)) <= (innerWidth >= 1024 ? 2 : 3); })()"
playwright-cli resize 320 640 && playwright-cli eval "document.documentElement.scrollWidth <= window.innerWidth"

# Heavy assets must NOT load before intent (PERF-05): no model-viewer, .glb or .usdz in the list
playwright-cli requests
playwright-cli find "Ver la villa en 3D"          # get the ref, then:
playwright-cli click <ref> && playwright-cli requests   # now model-viewer + .glb appear

# Viewer error state (COMP-10)
playwright-cli route "**/*.glb" --status=404 && playwright-cli reload
playwright-cli click <ref> && playwright-cli screenshot --filename=qa/viewer-error.png && playwright-cli unroute

# Keyboard and focus (A11Y-03/04, LAYOUT-12): skip link first, visible ring, nothing hidden under sticky bars
playwright-cli press Tab && playwright-cli screenshot --filename=qa/focus-01.png   # repeat through the page
playwright-cli press Escape

# Preferences
playwright-cli set-reduced-motion reduce && playwright-cli reload && playwright-cli screenshot --filename=qa/reduced-motion.png
playwright-cli set-forced-colors active && playwright-cli screenshot --filename=qa/forced-colors.png && playwright-cli clear-forced-colors
playwright-cli set-contrast more && playwright-cli screenshot --filename=qa/contrast-more.png && playwright-cli clear-contrast

# Console must be clean
playwright-cli console

# iPhone (WebKit): AR link present, bottom bar respects the safe area, 4:5 stage
playwright-cli close && playwright-cli open --browser=webkit --device="iPhone 15" http://localhost:PORT/
playwright-cli screenshot --filename=qa/iphone-home.png

# Motion review (record, then watch for jank, surprise motion, anything moving on load)
playwright-cli video-start qa/motion.webm && playwright-cli mousewheel 0 4000 && playwright-cli video-stop
playwright-cli close
```

Review the screenshots against: SLOP-01..12, COLOR-02/03/08, LAYOUT-01..08, IMG-08, the hero composition in B2, and dark-mode parity (a CTA that pops in light pops in dark).

### D3. Performance
- [ ] Lighthouse mobile on home, one service page, pricing, the case study and one guide: Performance/Accessibility/Best Practices/SEO ≥ 95; LCP < 2.0 s; CLS < 0.05; TBT < 150 ms (PERF-01).
- [ ] Budgets met (PERF-02..04): HTML, CSS, JS, fonts and LCP image weights recorded in the PR.
- [ ] The network waterfall before interaction contains only HTML, CSS, fonts (1 preload), the LCP image, ≤ 30 KB JS and nothing third-party (PERF-05).
- [ ] After deploy: PageSpeed Insights on the production URL, then Search Console CWV once field data exists.
- [ ] **Real devices, by a human:** an iPhone (Safari, AR Quick Look at 1:20 and 1:1) and an Android phone (Chrome, Scene Viewer). One tap opens AR and scale is correct.

### D4. Accessibility
- [ ] Automated: the Lighthouse a11y score plus axe (browser extension or `@axe-core/cli`) show 0 serious/critical issues.
- [ ] Keyboard-only pass through: nav, menu, slider, viewer controls, AR dialog, calculator, FAQ, both form steps, file upload (A11Y-04/05).
- [ ] Screen reader smoke test (NVDA on Windows, VoiceOver on iOS): the headings list makes sense, landmarks exist, form errors and viewer loading are announced, and the room list is readable.
- [ ] 200% zoom and 320px reflow (A11Y-11); forced colors and contrast-more screenshots reviewed (A11Y-12).
- [ ] Every new colour pair introduced in the PR has its contrast ratio stated (COLOR-06).

### D5. Content, legal and honesty
- [ ] Copy self-audit done (SLOP-11). Zero em/en dashes, correct ES/EN quotes, "…" (COPY-02).
- [ ] Every number matches `build/data`; estimates say "aprox." (COPY-04).
- [ ] Anonymization: no original plan, listing photo, address, agency or coordinates anywhere, including image metadata (strip EXIF/XMP) (IMG-02).
- [ ] Every render is labelled as a render; the case page states that measures are estimated (IMG-03).
- [ ] No fabricated proof (SLOP-04). CTA labels match the dictionary in both languages (COMP-03).
- [ ] Legal pages exist and are linked. The RGPD checkbox is unticked with a link to the privacy policy. Consent (if any) has equal-weight reject (COMP-21).
- [ ] ES and EN pages are at parity (same sections, same facts, same CTAs).

### D6. SEO/GEO surface (design side)
- [ ] One descriptive H1; meaningful H2s; the *cajetín* facts block present; "Última actualización" visible (GEO-01/02/04).
- [ ] Pricing/comparison as semantic tables; FAQ in HTML (GEO-03/05).
- [ ] Breadcrumbs visible on inner pages (GEO-06); the language link points to the real counterpart URL (COMP-05).
- [ ] No meaningful text inside images; alt text written (IMG-09); an OG image exists per page (IMG-12).

### D7. Sign-off
1. The builder runs D1 and D2 and attaches the screenshots (375 and 1440, light and dark, reduced motion, viewer error) to the PR.
2. The reviewer runs D3 to D6 and cites rule IDs for every finding.
3. Ship only with 0 lint errors, all MUST rules ticked, and budgets met. **If one box cannot be honestly ticked, the page is not done.**

---

## Appendix 1 · Font build recipe (reproducible, measured 2026-09-28)
```bash
pip install fonttools brotli
# 1. Fetch the latin woff2 from the css2 API with a modern User-Agent (or use the variable TTF from github.com/google/fonts)
#    Archivo:    https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900
#    Geist Mono: https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900
# 2. Instance to the axes we use
python -m fontTools.varLib.instancer Archivo.woff2 wdth=100:125 wght=400:650 -o archivo-inst.ttf
python -m fontTools.varLib.instancer GeistMono.woff2 wght=400:500 -o geist-mono-inst.ttf
# 3. Subset to the ES/EN glyph set (Latin-1 includes ñ á é í ó ú ü ¿ ¡ « » ² ×) and keep the features we rely on
UNI="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+20AC,U+2122,U+2212"
FEAT="kern,liga,calt,tnum,lnum,pnum,case,ccmp,locl,mark,mkmk"
python -m fontTools.subset archivo-inst.ttf    --unicodes="$UNI" --layout-features="$FEAT" --flavor=woff2 --output-file=archivo-var.woff2      # ~46 KB
python -m fontTools.subset geist-mono-inst.ttf --unicodes="$UNI" --layout-features="$FEAT" --flavor=woff2 --output-file=geist-mono-var.woff2   # ~12 KB
```
Measured alternatives for the other directions:
- Newsreader at opsz 72, wght 400-600: 36 KB (italic at 400: 21 KB).
- Schibsted Grotesk 400-700: 34 KB.
- Mona Sans width 75-100, wght 400-650: 60 KB.

Arrows in the UI are Phosphor icons, not the → glyph, which is not in the Google latin subset.

## Appendix 2 · Glossary used in copy and class names
| ES | EN | Meaning here |
|---|---|---|
| Cota | Dimension line | A 1px line + measured value; data, never decoration |
| Cajetín | Title block | The "Datos clave" facts grid (COMP-13) |
| Despiece | Exploded view | The plan → walls → furniture scroll sequence |
| Maqueta (modo) | Cutaway / model mode | Walls cut at 1.15 m in the viewer |
| Mesa | Stage | `--color-stage`, the backdrop for renders and the viewer |
| Añil | Indigo / ultramarine | The single accent of B2 |
| Calco | Tracing overlay | The B1 plan-over-render slider |

---

## Overrides 2026-09-29

Two decisions taken after the first build review. Where this section and the rules above disagree, **this section wins**.

### O1. Home hero "El plano se vuelve 3D" (owner HERO)

The owner found the still-image hero weak next to the rest of the site. The hero is now a drawing sheet: a 2D line plan becomes the furnished 3D maqueta (48 pre-rendered RGBA frames, `build/generated/hero.json`), with dimension lines (*cotas*) and rulers that follow the model, a phase rail and a title block. Code: `build/lib/hero.mjs` (build), `src/js/hero.js` (run time), `src/css/22-hero-seq.css` (critical) and `23-hero-live.css` (lazy), strings in `build/data/ui-hero.mjs`.

| Rule | Exception | Why it is acceptable |
|---|---|---|
| MOTION-05 (nothing above the fold animates in on load) | The sequence starts after `load` + idle. Until then the hero is painted in a final, static state: the text, the CTAs and the LCP element (the line-plan `<img>`, `fetchpriority="high"`, 34 KB on phones, 78 KB on desktop) never animate in. `hero.js` is not in the HTML: a 300-byte inline loader adds it after `load`, so it is not initial JS. | LCP is measured on a static image; the animation is an enhancement of an already complete picture. Lighthouse mobile after the change: Performance 99, LCP 2.0 s, CLS 0, TBT 30-60 ms. |
| MOTION-02 (only `transform` and `opacity`) | Canvas draws (the frames) and SVG attribute updates: the cotas and rulers are re-projected for every frame, because they must follow the camera. The cota lines draw themselves once with `stroke-dashoffset`. Layer changes (plan, canvas, still) are opacity only. | The cotas are data (a homography of the footprint corners per frame), not a CSS effect. No layout property is animated: the canvas and the overlay are absolutely positioned inside a container-query box (`cqw`/`cqh` units), so per-frame updates cause paint only. Measured: no long task, CLS 0. |
| MOTION-04 (durations from tokens) | CSS uses `--dur-reveal`, `--dur-state`, `--dur-hover`, `--ease-*`. The timeline constants live in `hero.js`: hold 700 ms, crossfade 480 ms (= `--dur-reveal`), play 2100 ms eased out (about 20 fps, 42 frames), still crossfade 260 ms (= `--dur-state`). | A frame sequence needs a JS clock; it uses the same values as the tokens where a token exists. |
| MOTION-08 (autoplay over 5 s needs a pause control) | Total length is about 3.3 s (hold + crossfade + play), plays once, never loops. It also pauses when the stage leaves the viewport. The visible controls are "Ver de nuevo / Replay" and the four phase buttons (they jump to the start of a phase and play on). | Under the 5 s limit; the controls are there anyway. |
| MOTION-09 (reduced motion = final state) | Kept as is: with `prefers-reduced-motion: reduce`, Save-Data, 2G/3G, no `createImageBitmap` or no JS, **no frame is downloaded**. The sheet shows the final still (AVIF, 2400 w on retina) and, with JS, the final cotas and rulers. If frames fail or the sequence has not started after 6 s, the still fades in over whatever is showing and the frame requests are aborted. | Same rule, more paths. |
| SLOP-06 (numbered eyebrows, decorative rulers, overlaid tags) and LAYOUT-02 (at most 4 text elements) | The sheet carries a numbered phase rail (01 Plano … 04 Luz, real buttons), coordinate rulers in metres, cota labels and a title block. | All of them are data or controls, not decoration: the rulers measure the footprint's screen extent (metres across and along the view), the cotas are the real 14,10 × 9,10 m and the wall height (0,00 m growing to 1,15 m), the rail scrubs the timeline. The hero text stays H1 + lead + two CTAs. |
| TYPE-05 (home H1 in 2 lines at 1440) | The H1 keeps its text but is set at display scale (Archivo at 118 % width, up to 84 px, `min(--fs-display, 13.2cqi)`): 3 lines on desktop, 2 on phones. | Owner request ("bigger, more confident"). It is still the LCP-safe text: it paints in its final state. |
| Mobile stage 14:9 | The frames are 14:9, but the phone stage is 5:4 (tablet 14:9) and shows the middle of the frame (fit by height, cropped sides), so the model is 25 % larger. Nothing is lost: the model and its cotas fit in the middle 80 % of the frame. | Legibility of the cota labels at 390 px. |

Budgets: the hero CSS is split in a critical part (`herohs`, 2.9 KB, in the home bundle) and a lazy part (`herolive`, 1.6 KB, added by `hero.js` and awaited before the overlay is built). The dead CSS of the previous home hero (`.hero--home`, `.lamina*`, `.hero__stage`, about 3.5 KB) was removed from `20-layout.css` and `10-base.css`, which also brings the shared sheet under 25 KB. `hero.js` (6.3 KB minified by the site's light minifier, 3.2 KB gzip) and `hero-geo.<hash>.json` (10 KB, 2.4 KB gzip) load after `load`. The frames are 2.2 MB (desktop) or 0.88 MB (phones), fetched four at a time in order, decoded a few frames ahead of the playhead (ImageBitmap, the rest closed), never before `load`.

### O2. Theme toggle (light / dark / automatic, owner BRAND)

The header has a three-state toggle (automatic, light, dark). It sets `data-theme="light|dark"` on `<html>` from an inline head script (`localStorage` key `hv-theme`, no key = follow the system). The dark tokens exist twice in `00-tokens.css` (the `prefers-color-scheme: dark` block, guarded with `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`); the rule for every other stylesheet is: **never test the theme, read a token**. The hero follows it through `--plan-invert` (0 in light, 0.91 in dark): the line plan has near-white floors, so in dark it is dimmed with `filter: brightness(calc(1 - var(--plan-invert) * .42))` (about 62 %) and the crossfade into the coloured frames does not flash. The frames are RGBA and sit on `--color-stage` in both themes.
