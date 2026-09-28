# Content schema (contract between content writers and the engine)

Every indexable page is one ES module in `build/content/<id>.mjs`, where `<id>` is the page id in
`build/data/routes.mjs`. URLs, templates, parents and hreflang pairing come from `routes.mjs`, never
from content. Shared data (prices, villa facts, process, deliverables) comes from `build/data/*.mjs`
and is referenced with tokens, never copied as literal numbers.

Validate your files with: `node build/validate-content.mjs <id> [<id>...]` (0 errors required).

## 1. File shape

```js
// build/content/servicio-plano.mjs
export default {
  id: 'servicio-plano',              // must match routes.mjs
  image: 'villa_planta_cenital',     // image manifest key: OG image + schema primaryImage (see §6)
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',
  es: { /* PageLang */ },
  en: { /* PageLang */ },            // REQUIRED if routes.mjs has an `en` path, FORBIDDEN (omit) if en is null
};
```

### PageLang

| Field | Required | Rules |
|---|---|---|
| `title` | yes | 30 to 55 characters, WITHOUT the brand (the engine appends ` \| {{brand}}`). Close to the real query/prompt. Home only: may contain `{{brand}}` and then is used as is. |
| `description` | yes | 120 to 155 characters. Answer-first, include a figure (price token, days, m²) when relevant. Unique site-wide. |
| `h1` | yes | Up to 60 characters (home: up to 36). One per page. Contains the main keyword naturally. |
| `lead` | yes | Answer-first paragraph, 25 to 60 words: what, for whom, price (token) and time (token). Rendered with class `.lead` (speakable). Inline markdown allowed. |
| `breadcrumb` | no | Short label (1 to 3 words) for breadcrumbs, menus and indexes. Defaults to `h1`. |
| `card` | yes (except home, legal, utility) | `{ title, summary }` used when hubs/indexes list the page. `summary` up to 25 words. |
| `facts` | yes (except legal/utility/hubs) | 4 to 8 `[label, value]` pairs. Rendered as the *cajetín* (title block) right under the hero; this is the page's GEO "key facts" block. Values are short (up to 12 words), may use tokens. |
| `hero` | no | `{ image, alt, caption }` side visual for service/audience/zone/guide heroes. Case/home heroes are fixed by the template. |
| `blocks` | yes | Ordered array of blocks (§3). This is the page body. |
| `faq` | yes (except legal/utility/hubs/faq page) | 6 to 10 `{ q, a }`. `q` phrased like a real question (People Also Ask wording). `a` 40 to 80 words, self-contained: repeats the subject (`{{brand}}`, the service) and the figure. Rendered visibly (first 3 open) and as FAQPage JSON-LD. |
| `related` | yes (except legal/utility) | 3 to 5 page ids for the "Sigue leyendo / Keep reading" list. Must exist in the same language. |
| `cta` | no | `{ h2, body, service }` override of the closing CTA band. `service` = id preselected in the form (`plano3d`, `maqueta`, `promocion`, `staging`, `renders`, `ar`, `visor`). |

## 2. Inline markdown ("md-lite")

Allowed in `lead`, `body`, `answer`, `a`, table cells, list items, captions:
- Paragraphs: separate with a blank line (`\n\n`).
- Lists: consecutive lines starting with `- ` (unordered) or `1. ` (ordered).
- `**bold**`, `*italic*`.
- Internal links by id: `[texto](@servicio-ar)`, with anchor `[texto](@caso-villa#visor)`.
- Glossary links: `[USDZ](@glosario#usdz)` (term ids in `build/data/glossary.mjs`).
- External links (sources only): `[Colegio de Registradores](https://www.registradores.org/...)`. Always a primary source.
- NO raw HTML. NO headings inside bodies (use blocks). NO images inside text (use `figure`).

## 3. Blocks

Every block is `{ type, ...fields }`. `h2` is optional where marked; when present it becomes an `<h2>` with an
auto id (slug of the text) usable as `@page#slug`. Phrase H2s as questions where natural.

| type | Fields | Renders |
|---|---|---|
| `prose` | `h2?`, `body` | Section with heading and md-lite body |
| `answer` | `h2` (a question), `answer` (40 to 60 words), `body?` | Question H2 + highlighted answer-first paragraph + optional detail |
| `table` | `h2?`, `intro?`, `caption`, `head: []`, `rows: [[]]`, `note?`, `sources?: [{label,url}]` | Real `<table>` with `<caption>` and `<th scope>`; cells are inline md |
| `steps` | `h2`, `intro?`, `items: [{ title, body, time? }]` | Numbered `<ol>` (custom steps; for OUR process use `process`) |
| `checklist` | `h2`, `intro?`, `items: [string]` | Check list |
| `figure` | `image`, `alt`, `caption`, `layout?: 'wide'\|'inline'` | Responsive `<picture>` with caption (always say it is a render) |
| `gallery` | `h2?`, `intro?`, `items: [{ image, alt, caption }]` | Captioned plates |
| `compare` | `h2?`, `intro?` | Registered slider: 2D line plan vs colour top-down render (fixed images) |
| `viewer` | `h2?`, `intro?` | 3D viewer band (poster, loads on click, room list in HTML) |
| `ar` | `h2?`, `intro?` | AR handoff: iPhone/iPad and Android buttons, QR on desktop |
| `formats` | `h2?`, `intro?` | Shared compatibility table (devices, formats, how it opens) |
| `embedCode` | `h2?`, `intro?` | The iframe snippet to embed the viewer, with a copy button |
| `deliverables` | `h2?`, `intro?` | Shared 5 deliverables (build/data/deliverables.mjs) |
| `comingSoon` | `h2?`, `intro?` | Shared "próximamente" list (AI video, VR 360) |
| `process` | `h2?`, `intro?`, `variant?: 'despiece'\|'list'` | Shared 5-step process (build/data/process.mjs). `despiece` = scroll exploded axonometric (home, como-funciona) |
| `needs` | `h2?`, `intro?` | Shared "what we need from you" checklist (process.needs) |
| `services` | `h2?`, `intro?` | Index of the 5 service pages (their `card`) |
| `audiences` | `h2?`, `intro?` | Index of audience pages available in this language |
| `pages` | `h2?`, `intro?`, `ids: []` | Index of any pages (their `card`), e.g. hubs |
| `pricing` | `h2?`, `intro?`, `variant: 'excerpt'\|'full'` | From pricing.mjs. `excerpt` = 3 packs; `full` = packs + tiers table + extras + volume + guarantees + VAT note |
| `calculator` | `h2?`, `intro?` | Volume calculator (Maqueta 3D completa × units) |
| `guarantees` | `h2?` | Shared guarantees list |
| `stat` | `value`, `label`, `source: { label, url }`, `year` | One sourced statistic. ONLY verified primary sources |
| `callout` | `title?`, `body`, `tone?: 'note'\|'honesty'` | Highlighted note (limits, precision, legal caveats) |
| `specs` | `h2?`, `items: [[k, v]]` | Spec sheet `<dl>` (case study) |
| `sources` | `h2?`, `items: [{ label, url, note? }]` | Source list (guides with market data) |
| `faq` | (none) | Where `faq` is rendered. If absent, FAQ goes before the closing CTA |
| `faqGroups` | `groups: [{ title, items: [{q,a}] }]` | FAQ hub page only |
| `glossary` | (none) | Glossary page only (terms from build/data/glossary.mjs) |
| `contactForm` | `h2?`, `intro?` | The quote form (contact page, home end) |
| `cta` | `h2`, `body`, `service?` | Mid-page CTA band (the closing one is automatic) |

The engine automatically adds: header, breadcrumbs, hero (H1 + lead + hero visual), cajetín (facts),
the FAQ (if not placed), "keep reading" (related), closing CTA, contact details in text, visible
"Actualizado el …" date, footer. Do not add those as blocks.

## 4. Tokens (write these instead of literals)

| Token | Output (es / en) |
|---|---|
| `{{brand}}` | Studio name (placeholder "Estudio 3D"). NEVER write a studio name literally. |
| `{{entity}}` | The canonical one-sentence entity description (site.entity) |
| `{{email}}` `{{phone}}` `{{whatsapp}}` | Contact details (display format) |
| `{{price:<packId>}}` | Base price of a pack: `plano3d`, `maqueta`, `promocion` → "490 €" / "€490" |
| `{{price:<packId>:<tier>}}` | Tier price (0-based index in `tiers`) |
| `{{extra:<extraId>}}` | Extra price (`render`, `staging`, `tipologia`, `hosting`) or percentage (`urgente` → "30 %"/"30%") |
| `{{volume}}` `{{volumeUnit}}` | Portfolio pack price and per-unit price |
| `{{delivery:<packId>}}` | "3 a 5 días laborables" / "3 to 5 working days" |
| `{{revisions:<packId>}}` | "2 rondas de cambios" / "2 rounds of changes" |
| `{{villa:<spec>}}` | Any key of `villa.specs` (numbers are locale-formatted, e.g. `{{villa:interiorM2}}` → "75") |
| `{{file:<key>}}` | Size of a villa delivery file in MB, e.g. `{{file:glb}}` → "3,1 MB" / "3.1 MB" |
| `{{legal:<field>}}` | Legal data (`razonSocial`, `nif`, `domicilio`, `registro`, `email`) |
| `{{year}}` | Current year |

Unknown tokens fail the build.

## 5. Writing rules (both languages)

Read `docs/design/DESIGN-RULEBOOK.md` §A1 (anti-slop) and §A11 (copy mechanics) and `docs/research/04-geo-2026.md` §8 before writing.

1. **Answer first.** The lead answers what / for whom / price / time in ≤ 60 words. Every `answer` block answers in its first sentence.
2. **Numbers, not adjectives.** m², rooms, days, €, MB. Banned: "innovador", "revolucionario", "de última generación", "solución integral", "cutting-edge", "seamless", "unlock", "elevate", "game-changer", "in today's fast-paced".
3. **Zero em dashes (—) and en dashes (–)** anywhere, including ranges: write "de 3 a 5 días", "100 a 250 €", "€100 to €250". Use commas, colons or parentheses.
4. **Quotes:** Spanish « », English “ ”. Ellipsis character "…". Sentence case for all headings and buttons.
5. **Register:** Spanish uses *tú* (Spain Spanish). English is British English ("visualisation", "colour"), natural, NOT a literal translation: adapt the angle to international agents and off-plan buyers.
6. **Honesty (non-negotiable):**
   - No invented testimonials, client names, logos, project counts, ratings, awards or "+X % sales" statistics.
   - Statistics only from primary sources (Colegio de Registradores, INE, Notariado, NAR PDF…) with URL and year, verified by you with WebFetch. If you cannot verify it, do not use it.
   - The studio is new: our proof is the anonymised villa case (numbers in `build/data/villa.mjs`). Present it as "caso demostrativo".
   - The case is anonymised: never name the villa, agency, listing, street or exact location beyond "Costa del Sol". Never show or describe the original third-party plan as ours; we show "planta redibujada desde nuestro modelo".
   - Measurements from a plan without dimensions are estimates (≈). Say so where precision matters.
   - Portals: idealista only accepts approved multimedia providers for 3D tours; never promise an iframe inside idealista/Fotocasa. Promise: your own website (iframe), a shareable link, and the portal's virtual tour/URL field where the portal accepts it.
   - AR: iPhone/iPad via AR Quick Look (Safari), Android via Scene Viewer on ARCore-compatible phones. Desktop cannot show AR: it shows a QR code.
   - Virtual staging must be labelled as a virtual recreation in listings.
   - Prices are **without VAT** ("+ IVA" / "+ VAT") and come ONLY from tokens.
   - AI videos and VR 360 are "próximamente / coming soon": never describe them as available.
7. **Question H2s** use People Also Ask wording from `docs/research/02-keywords-es.md` / `03-keywords-en.md` where it fits.
8. **Glossary links** on the first mention of a technical term (USDZ, GLB, glTF, AR Quick Look, Scene Viewer, render, PBR, modo maqueta…).
9. **Internal links** follow the product flow (plano → renders & visor; visor → AR; staging → renders & visor) and every commercial page links to `@caso-villa` and `@precios`. Vary anchors.
10. **Length (unique words, excluding shared blocks):** service/audience/zone ≥ 700 (ES) / ≥ 600 (EN); guides 1,200 to 2,200; case ≥ 900; hubs ≥ 250; home: whatever the blueprint needs, concise.
11. **No thin local pages:** each zone page needs ≥ 5 unique elements (local market context with a primary source, property types, buyer profile, how our deliverables fit, local FAQ).

## 6. Image keys available

From `source/villa3d/renders/` (manifest `build/generated/images.json`, generated by `scripts/images.mjs`):
`villa_maqueta_iso` (RGBA, hero), `villa_maqueta_iso_opaco`, `villa_planta_cenital` / `_opaco`, `villa_plano_lineas`,
`villa_salon_dormitorio` / `_opaco`, `villa_dormitorios` / `_opaco`, `villa_bano_suite` / `_opaco`, `villa_terraza` / `_opaco`,
`villa_muros_completos` / `_opaco`, `og_image`. Later: `villa_despiece_1..3`, `villa_viewer_poster`.
Always write alt text describing the image AND that it is a 3D render of the anonymised villa.

## 7. Glossary data (`build/data/glossary.mjs`)

```js
export const glossary = [
  {
    id: 'usdz',                         // anchor: /glosario/#usdz and /en/glossary/#usdz; link with [USDZ](@glosario#usdz)
    related: 'servicio-ar',             // page id linked from the term
    es: { term: 'USDZ', definition: 'Formato de archivo 3D de Apple … (≤ 40 words, first sentence defines it)', body: 'md-lite detail (40 to 120 words)' },
    en: { term: 'USDZ', definition: '…', body: '…' },
  },
];
```
Term ids are lowercase ASCII slugs. 20 to 30 terms. Alphabetical order is applied by the engine per language.

## 8. Minimal example

```js
export default {
  id: 'servicio-ar',
  image: 'villa_terraza_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',
  es: {
    title: 'Realidad aumentada inmobiliaria sin app',
    description: 'Tu comprador coloca la vivienda sobre la mesa o a tamaño real desde su iPhone o Android, con un toque y sin instalar nada. Desde {{price:maqueta}} + IVA.',
    h1: 'Realidad aumentada inmobiliaria, sin app',
    lead: 'Convertimos el plano de la vivienda en un modelo 3D que tu comprador abre en realidad aumentada con un toque, en iPhone, iPad o Android. Incluido en la [maqueta 3D completa](@precios) desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
    breadcrumb: 'Realidad aumentada',
    card: { title: 'Realidad aumentada sin app', summary: 'La vivienda sobre la mesa a escala 1:20 o a tamaño real, desde el móvil del comprador.' },
    facts: [['Entrada', 'Plano 2D, sin fotos'], ['Dispositivos', 'iPhone, iPad y Android'], ['Formatos', 'USDZ y GLB'], ['Precio', 'Desde {{price:maqueta}} + IVA'], ['Plazo', '{{delivery:maqueta}}']],
    blocks: [
      { type: 'answer', h2: '¿Cómo se ve una vivienda en realidad aumentada?', answer: '…' },
      { type: 'ar' },
      { type: 'formats', h2: '¿Funciona en iPhone y en Android?' },
      { type: 'faq' },
    ],
    faq: [ { q: '¿Hace falta instalar una app para ver la vivienda en realidad aumentada?', a: 'No. {{brand}} entrega …' } ],
    related: ['servicio-tour', 'caso-villa', 'guia-ar', 'precios'],
  },
  en: { /* … British English … */ },
};
```
