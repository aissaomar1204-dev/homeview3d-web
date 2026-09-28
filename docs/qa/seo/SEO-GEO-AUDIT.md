# SEO + GEO audit of `dist/` (independent)

> Date: 2026-09-28 · Scope: the built `dist/` as is (67 HTML files: 59 indexable, 8 utility/404), no rebuild.
> Benchmarks: `docs/research/04-geo-2026.md` (§6 schema matrix, §8 content blocks, §11 checklist), `02-keywords-es.md` (§1 clusters, §4 linking + anti-cannibalisation), `03-keywords-en.md`, and the previous best site `E:\AnubisAI\Claude\Webs\transfermalaga\malaga-premium-transfers\dist`.
> Method: a regex extractor over every HTML file (title, meta, canonical, hreflang, OG, JSON-LD @graph, headings, `.lead`, breadcrumbs, links by region, images, `<time>`, `<summary>`), a link-graph script (inbound links, BFS depth from each home, anchor diversity), shingle overlap between local/commercial pages, FAQ JSON-LD ↔ visible text comparison, the existing `node build/check.mjs` (read-only run), and a local `build/serve.mjs` probe for status codes. Scripts and raw JSON live in the session scratchpad, not in the repo.
> State of the build: placeholders active, so every page is `noindex, follow` on purpose and IndexNow is skipped. Everything below assumes the launch switch flips those.

---

## 0. Verdict

**The site already clearly beats malagatransfer on every SEO/GEO axis we can measure, and is in the top tier of what a static B2B site can ship.** The machine layer (robots from one rules array, sitemap index + hreflang + images, bilingual `llms.txt`, `llms-full.txt` per language, a Markdown mirror per page with a `rel=alternate`, content negotiation edge function, IndexNow diff + `deploySucceeded`, RSS per language) is complete. Content is answer-first almost everywhere: 58 of 59 leads are ≤ 60 words and every commercial/guide lead states what, for whom, a price and a turnaround, **417 FAQ answers are all 40–80 words, 412 name the brand as subject, and all 417 match the visible text word for word**; 0 heading-level skips; 0 broken internal links; hreflang is 100 % reciprocal; zone pages are ≥ 84 % unique.

What is still missing is not plumbing but **four GEO gaps and three schema bugs**:

1. **No "best studios / best ways" list page** (ES or EN). 04 §1.2 and 03 F3: lists are 43.8 % of what ChatGPT cites for "best X" prompts. Two of the 20 test prompts have nothing to cite (§9).
2. **Commercial leads have no subject.** Leads say «Convertimos…» / «We turn…», so the chunk an LLM lifts for «empresa que…» / «company that…» prompts does not carry the entity. The Marbella page never says the studio is *based* in Marbella (only the footer does).
3. **No EN answer to "How much does a 3D floor plan cost?"** (the most repeated EN PAA in 03), and the only EN answer points to a guide that has no floor-plan figures.
4. **Home does not link the local pages or the audience hub in its body**; `/soluciones/` is reachable only through its children's breadcrumbs.
5. Schema bugs: **`wordCount: 0` on every Article** (guides + case); **Service Offer price ≠ visible price** on the developer pages (schema €490, page €1,490) and on 4 pages whose "from" price is €149; **no VideoObject** although the turntable video is already in `dist/assets/video/`.

Launch gates (known, not new): brand/domain/contact/legal placeholders, founder person, prices `confirmed:false`. Until the name exists there is no `logo`, `sameAs`, GBP or Person, which is the biggest GEO lever left (04 §7).

---

## 1. Scorecard against 04 §11 (P0 checklist)

| 04 §11 item | Status | Evidence |
|---|---|---|
| robots.txt from one rules array, `*` + explicit group identical, Bytespider blocked, Sitemap | ✅ | 34 named agents incl. OAI-SearchBot, Claude-SearchBot, Claude-User, Perplexity-User, Google-Extended, Bravebot; groups identical |
| `Content-Signal` | ⚠️ | Emitted only as a comment line (`# Content-Signal: …`), so it has no effect (finding G-09) |
| sitemap index → pages (hreflang) + images, `lastmod` = `dateModified` | ✅ | 59 URLs, 3 hreflang links each where paired; 157 `<image:image>` over 51 URLs; lastmod 2026-09-28 everywhere = visible date |
| `llms.txt` bilingual + `llms-full.txt` from same data | ✅ | 9.6 KB; ES full 350 KB (27 pages), EN full 259 KB (20 pages); preview comment only while placeholders |
| `index.md` per indexable page + `<link rel=alternate type=text/markdown>` | ✅ | 59/59, all ≥ 100 words; mirrors are excellent (answer, Datos clave, tables, steps, FAQ, contact) |
| `_headers`: md/llms noindex + MIME, GLB/USDZ MIME, long cache | ✅ | `/indexnow-*.json` lacks `X-Robots-Tag: noindex` (minor, G-12) |
| IndexNow key file + manifest + pending + deploySucceeded function | ✅ | Key file matches `site.indexNowKey`; pending skipped for placeholder host; function never throws |
| `feed.xml` + `/en/feed.xml` | ✅ / ⚠️ | 8 + 5 items, valid RSS 2.0; **not discoverable**: no `<link rel="alternate" type="application/rss+xml">` in any `<head>` (F-05) |
| `<html lang>`, canonical, hreflang es/en/x-default, robots `max-snippet:-1…`, OG 1200×630 | ✅ | Robots string ready in `layout.mjs` for launch; OG present on 65/65 non-404 pages |
| All text in served HTML, room list as HTML, model-viewer deferred | ✅ | Viewer poster + `<ol>` room list server-side |
| `.lead` ≤ 60 words, Datos clave `<dl>`, visible date + author, contact in text | ✅ | 1 lead at 61 words (EN render-cost guide, already warned by check); author = "Equipo de Estudio 3D" (no person, O-02) |
| One `@graph` per page, stable `@id`s, no empty props | ✅ / ❌ | All `@id` refs resolve (in page or global); **`wordCount: 0`** on Articles (G-01) |
| Launch pages ES+EN (home, 5 services, pricing, process, case, about, contact, FAQ, glossary ≥ 20, legal) + ≥ 2 guides | ✅ | 30 glossary terms per language; 7 ES + 4 EN guides |
| QA: FAQ JSON-LD = visible, prices in schema visible, `dateModified` = visible = lastmod | ✅ / ❌ | FAQ 417/417 identical; **Offer prices not the visible "from" price on 6 ES/EN pages** (G-02) — check.mjs does not test this direction |
| Name decided → sameAs, GBP, logo, legal | ❌ (blocked) | `site.sameAs: []`, `logo: null` (O-01) |

---

## 2. Titles, H1, leads vs target keyword (02 §1, 03 §5.1)

`✓` = aligned; `~` = aligned with a caveat; `✗` = misaligned. "Fig" = key figure in the lead's first 60 words.

| URL | Target (research) | Title / H1 | Lead fig | Verdict / note |
|---|---|---|---|---|
| `/` | empresa modelos 3D desde plano para inmobiliarias | "Modelo 3D desde el plano para inmobiliarias" / "Del plano 2D al modelo 3D, sin fotos" | 490 €, 3–5 días | ~ Lead has no brand, no "estudio", no Costa del Sol/Marbella; title overlaps `/servicios/plano-2d-a-3d/` and `/soluciones/inmobiliarias/` (C-05) |
| `/servicios/plano-2d-a-3d/` | plano 3D para inmobiliarias / convertir plano en 3D (C1) | "Plano 2D a 3D para inmobiliarias, sin fotos" / "Plano 3D para inmobiliarias…" | 149 € / 490 € | ✓ Best page for C1. FAQ holds 3 questions owned by guides (C-04) |
| `/servicios/renders-inmobiliarios/` | renders para inmobiliarias / render 3D inmobiliaria (C2) | ✓ | 490 € (6 renders), 90 € extra | ~ FAQ «¿Cuánto cuesta un render en España?» = head question of the price guide (C-03) |
| `/servicios/tour-virtual-3d/` | tour virtual 3D inmobiliaria (C4) | ✓ | 490 € | ✓ |
| `/servicios/realidad-aumentada-inmobiliaria/` | realidad aumentada inmobiliaria (C5) | ✓ "…sin app ni descargas" | 490 €, 1:20 / real | ✓ strongest GEO page of the niche |
| `/servicios/home-staging-virtual/` | home staging virtual para inmobiliarias (C6) | ✓ | 60 €/estancia | ✓ |
| `/soluciones/promotoras-obra-nueva/` | renders para promotoras / infografías 3D obra nueva (C3) | ✓ | 1.490 € | ✓ copy; ❌ schema says 490 € (G-02) |
| `/soluciones/inmobiliarias/` | renders / planos 3D para inmobiliarias | "Modelos 3D y realidad aumentada para inmobiliarias" | 490 € | ~ overlaps home + C1 (C-05) |
| `/soluciones/arquitectos-interioristas/` | renders para arquitectos (C11) | ✓ | 490 € | ✓ |
| `/soluciones/alquiler-vacacional/` | C13 | ✓ | 149 € | ✓ copy; schema 490 € (G-02) |
| `/precios/` | precios plano 3D / tarifas (C7b) | "Tarifas de modelos 3D y renders inmobiliarios 2026" | 149 € / 490 € | ✓ market table with 10 sourced rows is excellent |
| `/como-funciona/` | cómo pasar un plano a 3D (04) | ✓ | 5 pasos, 3–5 días, 490 € | ~ same intent as C1b guide; keep "our process" framing |
| `/casos/villa-costa-del-sol/` | proof | ✓ | 12 estancias, 75 m², 9 renders, 490 € | ✓ |
| `/zonas/marbella/` | render 3D Marbella (C8) | "Render 3D y maqueta virtual en Marbella" | 490 € | ~ lead lacks subject + "con base en Marbella" (C-01) |
| `/zonas/malaga/` | render 3D / infografías 3D Málaga | ✓ | 149 € / 490 € | ✓ copy; schema 490 € only (G-02) |
| `/zonas/costa-del-sol/` | renders Costa del Sol | ✓ | 490 € | ✓ |
| `/guias/cuanto-cuesta-un-render-3d/` | cuánto cuesta un render 3D (C7 hub) | ✓ | 200–450 € int., 300–1.200 € ext. | ✓ #1 GEO asset |
| `/guias/cuanto-cuesta-un-plano-3d/` | cuánto cuesta un plano 3D | ✓ | 100–800 €, 40 € online | ✓ |
| `/guias/como-convertir-un-plano-2d-en-3d/` | C1b | ✓ | 3 vías, 149 € | ✓ |
| `/guias/ia-o-modelo-3d-real/` | C10 | ✓ «Sí, pero en imagen» | 490 € | ✓ |
| `/guias/como-vender-viviendas-sobre-plano/` | C3 B2B | ✓ | 1.490 € | ✓ |
| `/guias/modelo-3d-vs-matterport/` | alternativa a Matterport (C4b) | "Modelo 3D desde plano vs Matterport vs tour 360" | 490 €, Matterport 13 €/mes | ~ "alternativa" nowhere in title/H1 (C-06) |
| `/guias/ver-una-vivienda-en-realidad-aumentada/` | cómo ver una casa en AR | ✓ | iOS 12+, ARCore, 490 € | ✓ only 4 inbound links (C-08) |
| `/glosario/`, `/preguntas-frecuentes/` | definitions / FAQ hub | ✓ | — | ✓ 30 terms ≤ 40 words, 5 with Wikidata |
| `/en/` | floor plan to 3D model for real estate | ✓ | €490 | ~ same as ES home (C-01, C-05) |
| `/en/floor-plan-to-3d-model/` | 2d floor plan to 3d model service | ✓ | €149 / €490 | ✓; FAQ "How much does a 3D floor plan cost?" gives only our price and sends to a guide with no floor-plan data (C-02) |
| `/en/real-estate-3d-rendering/` | real estate 3d rendering spain | ✓ | €490, €90 | ✓ |
| `/en/interactive-3d-floor-plans/` | interactive 3d floor plan | ✓ | €490 | ✓ |
| `/en/augmented-reality-real-estate/` | augmented reality real estate | ✓ | €490 | ✓ |
| `/en/virtual-staging/` | 3d virtual staging | ✓ | €60/room | ✓ |
| `/en/for-estate-agents/` | 3d floor plans for estate agents | ✓ | €490 only | ~ the €149 "3D floor plan" (the product in the keyword) is not in the lead (C-07) |
| `/en/off-plan-3d-visualisation/` | off plan property 3d visualisation | ✓ | €1,490 | ✓ copy; schema €490 (G-02) |
| `/en/3d-rendering-marbella/` | 3d rendering marbella / costa del sol | ✓ | €490 | ~ subject-less lead (C-01) |
| `/en/pricing/` | 3d floor plan price | ✓ | €149 / €490 | ✓ |
| `/en/guides/3d-rendering-cost-spain/` | how much does 3d rendering cost spain | ✓ | €200–450 | ✓ (61-word lead) |
| `/en/guides/ai-floor-plan-to-3d/` | can AI / chatgpt… | ✓ | €490 | ✓ |
| `/en/guides/3d-model-vs-matterport/` | matterport alternative without site visit | "3D model from a floor plan vs Matterport vs 360 tour" | €490 | ~ "alternative" missing (C-06) |
| `/en/guides/view-property-in-ar/` | view house in AR | ✓ | iOS 12+ | ✓ |

Meta: all titles ≤ 68 chars and unique, descriptions 117–160 and unique, one H1 per page, 0 heading skips, H2s phrased as questions on 50–75 % of commercial pages. No ES/EN language leakage (no "IVA" on EN pages, no "VAT" on ES pages).

### 2.1 Anti-cannibalisation (02 §4.3)

| Risk | Pages | Evidence | Fix |
|---|---|---|---|
| **High-value PAA duplicated in a service FAQ** | `/servicios/renders-inmobiliarios/` ↔ `/guias/cuanto-cuesta-un-render-3d/` | Service FAQPage has «¿Cuánto cuesta un render en España?» (the PAA seen in 6 SERPs, owned by the guide) | C-03 |
| Guide-owned questions in C1 service FAQ | `/servicios/plano-2d-a-3d/` ↔ 3 guides | «¿Qué IA puede generar planos 3D?» (verbatim duplicate of the IA guide), «¿Cómo puedo convertir un plano 2D a 3D gratis?» (C1b target), «¿Cuánto vale hacer una casa en 3D?» (02 §3 #2 → plano price guide) | C-04 |
| Same head intent on three pages | `/` · `/servicios/plano-2d-a-3d/` · `/soluciones/inmobiliarias/` (EN: `/en/` · `/en/floor-plan-to-3d-model/` · `/en/for-estate-agents/`) | All three titles = "modelo/plano 3D … para inmobiliarias" | C-05 |
| Near-duplicate FAQs (Jaccard ≥ 0.6) | 19 pairs, e.g. promotoras ↔ costa-del-sol "tipologías", tour ↔ inmobiliarias "idealista/Fotocasa" | Different pages, same question | Acceptable (answers are localised); dedupe only the 5 verbatim duplicates listed in §5 |

---

## 3. Internal link graph

Computed over all `<a href>` (header, main, footer, other), internal only. "Main" = links inside `<main>` (contextual). Depth = BFS clicks from `/` (ES) or `/en/` (EN).

- **0 broken internal links, 0 true orphans, every indexable page ≤ 2 clicks from its home.**
- Case page = central proof node: 38 inbound (35 contextual, 13 distinct anchors). Contact 37/31, pricing 37/28. ✓ 02 §4.1.2.
- Service chain (02 §4.1.3): plano→renders+tour ✓, tour→AR+plano ✓, AR→tour+promotoras ✓, staging→renders+tour ✓. Case→each service ✓. Audiences ↔ services ✓. Guides → money page ✓. Zones: Costa del Sol ↔ Marbella/Málaga ✓.

Weakest pages (contextual inbound):

| Page | Inbound all / main | Depth (all / main-only) | Note |
|---|---|---|---|
| `/soluciones/` | **4 / 0** | 2 / unreachable | Only its 4 children's breadcrumbs link it; not in header, footer or home body (F-01) |
| `/en/about/` | 28 / 0 | 1 / unreachable | footer only |
| `/servicios/`, `/guias/`, `/zonas/`, `/sobre-nosotros/` | 36–37 / 2 | 1 / unreachable | nav/footer only; home body links none of the hubs (02 §4.1.1) (C-09) |
| `/guias/ver-una-vivienda-en-realidad-aumentada/` | 4 / 3 | 2 | the AR block on 9 pages and `/ar/villa/` do not link it (C-08) |
| `/guias/como-vender-viviendas-sobre-plano/` | 4 / 4 | 2 | 1 anchor text only |
| `/zonas/marbella/`, `/zonas/malaga/` | 5–6 / 5 | 2 | not linked from home; only `servicio-plano` links a zone (Costa del Sol) — 02 §4.1.7 wants a "Trabajamos en" block on services (C-09) |

Anchor diversity: good on money pages (plano 8 distinct anchors / 35 links, tour 11/38, case 13/104). Monotone on `/como-funciona/` (20× "cómo funciona"), `/en/how-it-works/` (19×), `/zonas/marbella/` (7× "marbella").

---

## 4. Technical

| Area | Result |
|---|---|
| Canonical | Self-referencing absolute on 65/65 pages; none on 404s ✓; `og:url` = canonical ✓ |
| hreflang | 100 % reciprocal; self + x-default present; ES-only pages emit `es` + x-default self; paired pages x-default → EN (03 rule) ✓ |
| Sitemaps | Index → pages (hreflang in XML) + images ✓. Image URLs are content-hashed WebP: every re-encode changes the URL Google Images indexed (acceptable; note for G-07) |
| robots.txt | ✓ policy. Two issues: `Content-Signal` only as a comment (G-09); `Disallow: /embed/` hides the embed's brand credit and room list from Google when partners iframe it (G-06) |
| `_headers` | Per-page CSP with inline-script hashes, HSTS, nosniff, COOP, Permissions-Policy with `xr-spatial-tracking=(self)`; `/embed/*` framable + noindex; `/models/*` CORS + MIME + noindex; md/llms noindex ✓. Gaps: `/indexnow-*.json` without `X-Robots-Tag` (G-12); 404 responses on unknown paths get no CSP (only `/*` rule) — cosmetic |
| `_redirects` | `/casos/`, `/en/case-studies/`, `/ar/` 301 ✓; per-language 404 fallbacks with status 404 ✓ |
| 404 behaviour (local `serve.mjs`) | `/no-existe/` → 404 + ES 404 page; `/en/nope` → 404 + EN page; `/precios` → 301 `/precios/`; `/casos/` → 301. **Verify the same on a Netlify deploy preview** (trailing-slash handling with `pretty_urls=false`) and `curl -H "Accept: text/markdown" /precios/` (G-13) |
| Robots meta at launch | `layout.mjs` switches to `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` when placeholders clear ✓ |
| Performance (SEO-relevant) | Already reported by `check.mjs` to ENGINE: home HTML 70.5 KB (> 60), CSS 51.4 KB (> 40), case pages 67 KB. LCP image 50 KB ✓ |

---

## 5. Machine files for agents

**`llms.txt`** follows llmstxt.org (H1, blockquote bilingual entity + prices, key-facts list, H2 sections, `## Optional`). It already gives an agent the entity, all prices, delivery times, method, AR platforms, case numbers and contact in the first 25 lines — better than malagatransfer. Gaps:
- Guide lines have **no notes**: `- [¿Cuánto cuesta un render 3D en España?](…)` without the answer. The guides hold the market figures LLMs quote; put the answer in the note ("200–450 € interior, 300–1.200 € exterior, 2026, con fuentes") (G-08).
- No **quick-answers section** (malagatransfer had "Facts for quick answers"): 8–10 prompt-shaped Q→A lines (price of a render in Spain, AR without app?, Matterport alternative off-plan, can AI do it, turnaround, where based) (G-08).
- 9.6 KB, close to the 10 KB target from 04 §4.2: move the 8 legal/about links of `## Optional` onto 2 lines to make room.

**`llms-full.txt`**: one file per language, canonical URL + date + author per page, hubs/legal excluded with a pointer. ✓

**`index.md` mirrors**: generated from the same blocks; answer blockquote, Datos clave, real Markdown tables with source links, numbered steps, FAQ, contact. ✓ Best-in-class.

**Feeds**: valid, but no `<link rel="alternate" type="application/rss+xml">` in `<head>` (F-05).

**IndexNow**: manifest hashes the Markdown, so a JSON-LD-only or title-only change is never pinged. Acceptable; re-submit manually with `scripts/indexnow.mjs --all` after schema releases.

---

## 6. JSON-LD per page type (04 §6.3)

| Page type | Nodes found | Missing / wrong vs 04 §6.3 |
|---|---|---|
| Home | ProfessionalService (full), WebSite, ImageObject, WebPage, FAQPage (9), ItemList (5 services) | `logo`, `sameAs`, `founder`, `legalName` (blocked, O-01); Organization `image` changes per page (home = og_image, about = dormitorios) (G-05); `contactType: "ventas"` → use "sales" |
| Service ×5 (+EN) | WebPage, Service (+Offer + UnitPriceSpecification, VAT excl.), FAQPage, BreadcrumbList, ImageObject, `isRelatedTo` other services | **Offer price ≠ visible "from" price on plano (149 € shown, 490 € in schema)** (G-02); no `serviceOutput` (3DModel) |
| Audience ×4 (+2 EN) | WebPage, Service (audience), FAQPage, BreadcrumbList | **promotoras ES/EN: Offer 490 € vs visible 1.490 €; vacacional: 490 € vs 149 €** (G-02) |
| Local ×3 (+1 EN) | WebPage (+`contentLocation` City/Place with Wikidata), Service (`areaServed` City), FAQPage, BreadcrumbList | Málaga: Offer 490 € vs visible "desde 149 €" (G-02) |
| Pricing | WebPage, OfferCatalog (3 packs with tier specs, 5 extras, volume pack), FAQPage, BreadcrumbList | `itemOffered` are anonymous Services instead of `@id` refs to the service pages (G-10) |
| Case | WebPage, Article, **3DModel** (5 `encoding` MediaObjects GLB/USDZ with contentSize), 10 ImageObjects, FAQPage, BreadcrumbList | **`wordCount: 0`** (G-01); gallery ImageObjects lack `license`/`acquireLicensePage` (G-07); **no VideoObject** although `dist/assets/video/villa-turntable.*` exists and no page uses it (F-03) |
| Process | WebPage, HowTo (5 steps, tools, supplies, `totalTime` P5D), FAQPage, BreadcrumbList | steps without `url`/`image` (optional) |
| Guides ×7 (+4 EN) | WebPage, Article (`citation` from sources, `about` → service @id), FAQPage, BreadcrumbList | **`wordCount: 0`** (G-01); author = Organization (no Person, O-02); no `mentions` Wikidata |
| Hubs | CollectionPage + ItemList | ✓ |
| Glossary | WebPage + DefinedTermSet (30 DefinedTerm, `@id` = visible anchor, 5 with Wikidata) | ✓ all anchors exist, all definitions ≤ 40 words |
| FAQ hub | FAQPage as page type | ✓ |
| About | AboutPage + full ProfessionalService | no ProfilePage/Person (O-02) |
| Contact | ContactPage + full ProfessionalService + FAQPage | ✓ |

Graph integrity: every `@id` reference resolves on the page or to a global/sibling-page node; one `<script type="application/ld+json">` per page; no `{{`, `null` or empty arrays. Speakable declares `.cajetin` on 6 legal pages that have none (G-11, trivial).

---

## 7. OG / Twitter / images

- OG + Twitter complete on every non-404 page (type website/article, locale + alternate only when a twin exists, 1200×630 JPG 25–83 KB, `og:image:alt`). Only 11 distinct images for 65 pages, all plain render crops without the page's claim. A per-page OG card (H1 + key figure on a render) would lift share CTR on LinkedIn/WhatsApp, the B2B channel (A-01, P2).
- `article:modified_time` / `article:published_time` missing on `og:type=article` pages (F-05).
- Image alts: 81 distinct, descriptive, bilingual, say "render 3D generado a partir del plano" (transparency). Empty alts only on decorative despiece layers 2–3 and on AR-link thumbnails whose link has visible text ✓. All images have width/height; one `fetchpriority=high` max per page ✓.

---

## 8. Comparison with the previous best site (malagatransfer)

| Element | malagatransfer `dist` | This site | Better? |
|---|---|---|---|
| robots AI agents | 10 agents, `*` group only `Disallow: /api/` | 34 agents, identical groups, Bytespider blocked | ✅ |
| llms.txt | 6.9 KB, EN only, "Facts for quick answers" | 9.6 KB, bilingual, key facts + all prices | ✅ (copy its quick-answers idea, G-08) |
| llms-full / md mirrors / Accept: text/markdown | none | 2 files + 59 mirrors + edge function | ✅ |
| IndexNow / feeds | none | diff manifest + event function; 2 RSS | ✅ |
| Sitemap | 48 URLs, hreflang, no images | index + 59 URLs hreflang + 157 images | ✅ |
| Schema | LocalBusiness (+geo, openingHours), Service/Offer, OfferCatalog, FAQ, Breadcrumb, Article, speakable | + ProfessionalService with Wikidata areaServed/knowsAbout, 3DModel+encoding, DefinedTermSet, HowTo, Article+citation, ContactPage/AboutPage/CollectionPage, ImageObject credit | ✅ (geo/openingHours/GBP only because it had a real business: O-01) |
| FAQ discipline | FAQ blocks | 417 answers, all 40–80 words, 100 % schema = visible | ✅ |
| Headers | basic, X-Frame-Options | per-page CSP hashes, framable embed, model MIME/CORS | ✅ |
| Entity off-site | GBP link in llms.txt | none yet | ❌ blocked by name |

---

## 9. GEO prompt test (20 prospect prompts)

"Cited page" = the URL that should win. "Quotable" = a self-contained answer with the key figure in the first 60 words of the lead (or of the matching FAQ). Brand = the sentence names the studio.

| # | Prompt | Should cite | Quotable answer + figure ≤ 60 words? | Gap |
|---|---|---|---|---|
| 1 | «empresa que convierta planos en 3D para inmobiliaria en Marbella» | `/zonas/marbella/` | ⚠️ Figure yes (490 €, 3–5 días); subject «Convertimos…», no brand, no "con base en Marbella" | C-01 |
| 2 | «cuánto cuesta una maqueta 3D de una vivienda» | `/precios/` | ✅ «la maqueta 3D completa… 490 € + IVA por vivienda» + market table | — |
| 3 | «cuánto cuesta un render 3D en España» | `/guias/cuanto-cuesta-un-render-3d/` | ✅ 200–450 € interior, 300–1.200 € exterior, 2026, sourced | service FAQ competes (C-03) |
| 4 | «cuánto cuesta un plano 3D» | `/guias/cuanto-cuesta-un-plano-3d/` | ✅ 100–800 € por planta, 40 € online | — |
| 5 | «cómo enseñar una vivienda sobre plano en realidad aumentada sin app» | `/servicios/realidad-aumentada-inmobiliaria/` | ✅ 1:20 o tamaño real, iPhone/Android, sin app, 490 € | — |
| 6 | «¿se puede ver una casa en AR en el iPhone sin descargar una app?» | `/guias/ver-una-vivienda-en-realidad-aumentada/` | ✅ iOS 12+, ARCore, sin instalar nada | few inbound links (C-08) |
| 7 | «alternativa a Matterport para una promoción que aún no está construida» | `/guias/modelo-3d-vs-matterport/` | ✅ lead answers; ⚠️ title/H1 never say "alternativa" | C-06 |
| 8 | «mejores estudios de renders 3D en la Costa del Sol» | — | ❌ no list/comparison-of-providers page | O-03 |
| 9 | «home staging virtual en Marbella precio» | `/servicios/home-staging-virtual/` (+ Marbella) | ⚠️ 60 €/estancia on staging page but no Marbella; Marbella page has 60 € only in a table far below | C-09 (zone block on services) |
| 10 | «¿puede ChatGPT convertir un plano en 3D?» | `/guias/ia-o-modelo-3d-real/` | ✅ «Sí, pero en imagen…» | — |
| 11 | «renders para promotoras de obra nueva en Málaga precio» | `/soluciones/promotoras-obra-nueva/` | ✅ copy 1.490 € / 3 tipologías; ❌ JSON-LD says 490 € (an LLM reading the graph can misquote) | G-02 |
| 12 | «qué es un archivo USDZ» | `/glosario/#usdz` | ✅ definition ≤ 40 words + DefinedTerm | — |
| 13 | "floor plan to 3D model service for real estate agencies in Spain" | `/en/floor-plan-to-3d-model/` | ✅ €149 / €490, 2–3 days | — |
| 14 | "company that makes AR models of off-plan property in Marbella" | `/en/3d-rendering-marbella/` | ⚠️ figure yes; subject "We", no brand, no "based in Marbella" | C-01 |
| 15 | "how to show an off-plan apartment in AR without an app" | `/en/augmented-reality-real-estate/` | ✅ | — |
| 16 | "how much does 3D rendering cost in Spain" | `/en/guides/3d-rendering-cost-spain/` | ✅ €200–450 interior (61-word lead) | — |
| 17 | "how much does a 3D floor plan cost in Spain" | none suitable | ❌ only our €149; the FAQ sends to a guide with no floor-plan figures; market range sits in a table on `/en/pricing/` | C-02, O-04 |
| 18 | "Matterport alternative without a site visit" | `/en/guides/3d-model-vs-matterport/` | ✅ lead; ⚠️ no "alternative" in title | C-06 |
| 19 | "virtual staging Marbella price" | `/en/virtual-staging/` | ⚠️ €60/room but no Marbella on that page | C-09 |
| 20 | "best 3D visualisation studios on the Costa del Sol for developers" | — | ❌ no list page | O-03 |

Result: **12 ✅ · 6 ⚠️ · 2 ❌ (plus 1 ❌ on EN floor-plan cost)**. All ⚠️ are fixed by copy edits; the ❌ need two new pages.

---

## 10. Findings (prioritised)

| ID | P | Owner | Where | Problem | Fix |
|---|---|---|---|---|---|
| O-01 | P0 | orchestrator | `build/data/site.mjs` | Placeholders (brand, domain, contact, legal) keep every page noindex and block the entity (no `logo`, `sameAs`, `legalName`, GBP, Bing Places, YouTube/LinkedIn). Prices `confirmed:false` will be memorised by LLMs once indexed. | Decide the name (04 §7.1), fill `site.mjs` (+ `logo`, `sameAs` as profiles go live), confirm `pricing.mjs` **before** the first indexable deploy; then GSC + BWT + Brave submit + `indexnow --all`. |
| G-01 | P1 | geo | `build/lib/schema.mjs:345,385` + `build/build.mjs:256,275` | Every Article (7 ES + 4 EN guides, 2 cases) ships `"wordCount":0`: schema runs before `entry.wordCount` is computed. | Omit `wordCount` when falsy, or compute it from the rendered `<main>` before `schemaScript()` is called; add a check.mjs rule "wordCount > 0 or absent". |
| G-02 | P1 | geo | `schema.mjs` `serviceNode`/`offerFor`; pages `/servicios/plano-2d-a-3d/`, `/en/floor-plan-to-3d-model/`, `/soluciones/promotoras-obra-nueva/`, `/en/off-plan-3d-visualisation/`, `/soluciones/alquiler-vacacional/`, `/zonas/malaga/` | Service `offers` always uses `route.pack \|\| 'maqueta'` (€490) while the lead/description "from" price is €149 (plano3d) or €1,490 (promocion). Schema contradicts visible price. | Emit one Offer per pack whose `{{price:…}}` token appears on the page (array, lead's pack first), or an `AggregateOffer` with `lowPrice`; add a check that the lowest schema price equals the "desde/from" price in the meta description. Together with O-05. |
| O-05 | P1 | orchestrator | `build/data/routes.mjs` | `sol-promotoras` has no `pack`, so it inherits `maqueta`. | Add `pack: 'promocion'` to `sol-promotoras` (and `pack: 'plano3d'` to `sol-vacacional` if G-02 is not done as an array). |
| O-03 | P1 | orchestrator | new routes `/guias/mejores-estudios-visualizacion-3d-espana/` + `/en/guides/best-3d-visualisation-studios-spain/` (content file `guia-mejores.mjs`) | No "best X" page: prompts 8 and 20 have nothing to cite; lists are 43.8 % of ChatGPT citations for recommendation prompts (04 §1.2). | Honest list per 04 §8.2: visible criteria, ItemList of 6–10 real options (Floorfy, CubiCasa, RoomSketcher, Getfloorplan, local studios such as Viseni/Improntia, us) with "ideal para" + public price, conflict-of-interest notice, quarterly date; Article + ItemList schema. |
| O-04 | P1 | orchestrator | `routes.mjs` `guia-precio-plano` `en: null` | No EN page answers "How much does a 3D floor plan cost?" (top EN PAA across C1/C2/C8/C12 in 03). | Add `en: '/en/guides/3d-floor-plan-cost-spain/'` and the EN content (market table €40–€800 per floor, EUR, sources, our €149). |
| C-01 | P1 | content | `build/content/home.mjs`, `zona-marbella.mjs`, `zona-malaga.mjs`, `zona-costa-del-sol.mjs`, `sol-inmobiliarias.mjs`, `sol-promotoras.mjs` (ES + EN) | Leads start «Convertimos…» / «We turn…»: the most-quoted chunk carries no entity; Marbella pages never say the studio is based there (footer only); home lead has no location. | Start these leads with the subject: «{{brand}}, estudio de visualización 3D con base en Marbella, convierte…» / "{{brand}}, a 3D visualisation studio based in Marbella, turns…", keep price + days within 60 words. |
| C-02 | P1 | content | `build/content/servicio-plano.mjs` [en] FAQ "How much does a 3D floor plan cost?" | Gives only our price and says "Market ranges are in our 3D rendering cost guide", which contains no floor-plan figures. | First sentence = market range ("In Spain a 3D floor plan costs €40 on online platforms and €100–€800 per floor from studios, 2026"), then our €149; link `/en/pricing/` (market table) or O-04's guide. |
| C-03 | P1 | content | `build/content/servicio-renders.mjs` [es] FAQ | «¿Cuánto cuesta un render en España?» duplicates the head question of `/guias/cuanto-cuesta-un-render-3d/` (niche's #1 PAA) inside a FAQPage. | Rephrase to «¿Cuánto cuestan vuestros renders?» (6 incluidos en 490 €, extra 90 €) and link the guide with the anchor «cuánto cuesta un render 3D en España». Check EN twin too. |
| F-01 | P1 | front | `build/lib/layout.mjs` footer | `/soluciones/` is linked only by its children's breadcrumbs (4 inbound, 0 contextual). | Make the footer column heading "Soluciones" a link to `/soluciones/` (same for "Servicios" → `/servicios/`), or drop the hub. |
| C-09 | P1 | content | `home.mjs` (ES/EN), `servicio-*.mjs` | Home body links no hub and no zone; services (except plano) link no zone; staging pages never mention Marbella (prompts 9, 19). | Home: one "Dónde trabajamos" line linking Marbella, Málaga, Costa del Sol (EN: `/en/3d-rendering-marbella/`) + "Ver todas las soluciones" → `/soluciones/`. Services: a "Trabajamos en" sentence with 3 zone links (02 §4.1.7); staging: one sentence with "home staging virtual en Marbella… 60 € por estancia". |
| O-02 | P1 | orchestrator | `site.mjs` (+ `sobre-nosotros.mjs`, `schema.mjs`) | No real person anywhere: author = "Equipo de Estudio 3D", no Person/ProfilePage, no founder photo/LinkedIn (04 §9, §11 P0 "Sobre nosotros (fundador…)"). | Add `site.founder` (name, jobTitle, photo, LinkedIn); about page section; Person `@id /sobre-nosotros/#founder` as Article `author`, org `founder`; visible "Revisado por …" line. |
| C-04 | P2 | content | `servicio-plano.mjs` [es] FAQ | 3 guide-owned questions in the C1 service FAQ («¿Qué IA puede generar planos 3D?» verbatim duplicate, «…gratis?», «¿Cuánto vale hacer una casa en 3D?»). | Replace with service-intent questions («¿Qué entregáis en el plano 3D?», «¿Sirve para obra nueva sin construir?») and link the guides in the body. Move «¿Cuánto vale hacer una casa en 3D?» to `guia-precio-plano.mjs`. Also dedupe the other verbatim pairs: home/contacto «¿Cuándo se paga el trabajo?», plano/arquitectos «¿Qué formatos de plano aceptáis?», plano/vacacional «¿Necesitáis visitar la vivienda?», EN plano/agents "Do you need to visit the property?". |
| C-05 | P2 | content | `home.mjs`, `sol-inmobiliarias.mjs` (ES/EN) | Home, C1 service and agents page share the head "modelo/plano 3D para inmobiliarias". | Home title = category + entity ("Estudio de visualización 3D inmobiliaria: del plano al 3D y AR"); agents page = job-to-be-done ("Maqueta 3D y AR para captar exclusivas y vender a distancia"); C1 keeps "Plano 3D para inmobiliarias". |
| C-06 | P2 | content | `guia-matterport.mjs` (ES/EN) | Target "alternativa a Matterport" / "Matterport alternative without site visit" absent from title/H1. | Title: «Alternativa a Matterport sin visita: modelo 3D desde plano vs tour 360» / "Matterport alternative without a site visit: 3D model from a floor plan vs 360 tour" (≤ 60 chars before the brand if possible). |
| C-07 | P2 | content | `sol-inmobiliarias.mjs` [en] | Target "3d floor plans for estate agents" but the lead only prices the €490 model. | Add "a 3D floor plan from €149 + VAT per floor in 2 to 3 working days" to the lead. |
| C-08 | P2 | content | `servicio-tour.mjs`, `sol-promotoras.mjs`, `zona-*.mjs` | AR how-to guide (4 inbound) and sobre-plano guide (4, one anchor) are under-linked. | Add a contextual link from the AR block pages ("¿No se abre? cómo ver una vivienda en realidad aumentada paso a paso") and from tour/zones to the sobre-plano guide with varied anchors; vary anchors to `/como-funciona/` and `/zonas/marbella/`. |
| F-03 | P2 | front | `build/templates/case.mjs` (+ geo `schema.mjs`, `machine.mjs`) | Turntable video built (`dist/assets/video/villa-turntable.*`, 8 s) but unused; no VideoObject, no video sitemap; SERPs in this niche always show video (02 §0.7). | Click-to-play video on the case (POLISH-BACKLOG #5); VideoObject (name, description, thumbnailUrl, uploadDate, duration PT8S, contentUrl) + `sitemap-video.xml` in the index; stable (unhashed) video URL. |
| G-06 | P2 | geo | `machine.mjs` robots rules + `_headers` `/embed/*` | `Disallow: /embed/` prevents Google from rendering partner iframes, so the "Visor 3D de Estudio 3D" credit and room list are invisible where the viewer is embedded (04 §7.2 "crédito en el visor"). | Remove `/embed/` from Disallow; send `X-Robots-Tag: noindex, indexifembedded` on `/embed/*`; add `rel="nofollow"` to the credit link (widget-link policy). |
| G-07 | P2 | geo | `schema.mjs` ImageObject nodes | No `license` / `acquireLicensePage` on ImageObjects (Google Images "Licensable" badge; 04 §6.4). | Add `license` (image-use section of aviso legal) and `acquireLicensePage` → `/contacto/` on primary + gallery ImageObjects. |
| G-08 | P2 | geo | `machine.mjs` llms.txt | Guide links have no notes; no quick-answers block (malagatransfer had one). | Note = the guide's answer with figure; add "## Respuestas rápidas / Quick answers" (8–10 lines); compress `## Optional` to stay ≤ 10 KB. |
| G-05 | P2 | geo | `schema.mjs` full Organization | Organization `image` = the current page's OG image, so the global entity has a different image on home/about/contact. | Use one fixed image (future logo; meanwhile `og_image`). Set `contactType: "sales"`. |
| G-10 | P2 | geo | `schema.mjs` pricing case | OfferCatalog `itemOffered` are anonymous Services. | `itemOffered: {"@id": "<service url>#service"}` for packs tied to a service page (plano3d → plano, staging → staging). |
| G-09 | P2 | geo | `machine.mjs` `robotsTxt()` | `Content-Signal` written as a comment, so it signals nothing. | Emit `Content-Signal: search=yes, ai-input=yes, ai-train=yes` as a real line in both groups (parsers that don't know it ignore it, RFC 9309). |
| F-05 | P2 | front | `build/lib/layout.mjs` `<head>` | Feeds not discoverable; no `article:published_time`/`modified_time` on article pages (04 §6 head template). | Add `<link rel="alternate" type="application/rss+xml" href="/feed.xml">` (EN `/en/feed.xml`) and `article:*_time` meta for `og:type=article`. |
| A-01 | P2 | assets | `scripts/images.mjs` OG crops | 11 generic OG images for 65 pages, no claim on them. | Per-template OG cards: render + H1 + key figure (e.g. «Render 3D en España: 200–450 €») for guides, pricing, services. |
| G-11 | P2 | geo | `schema.mjs` speakable | Speakable lists `.cajetin` on 6 legal pages that have none. | Skip speakable on `legal` template (or selector `.lead` only). |
| G-12 | P2 | geo | `machine.mjs` `_headers` | `/indexnow-manifest.json` and `/indexnow-pending.json` without `X-Robots-Tag: noindex` (04 §11). | Add the header to both rules. |
| G-13 | P2 | geo | Netlify deploy preview | Local server behaves; Netlify trailing slash (`pretty_urls=false`) and `Accept: text/markdown` negotiation are untested in production. | On the first deploy preview: `curl -I /precios` (expect 301 → `/precios/`), `curl -H "Accept: text/markdown" /precios/` (expect md + `Link: rel=canonical`), unknown path → 404 with the right language page. |
| C-10 | P2 | content | content roadmap | Research P2 pages not yet built: ES price guides for staging and tour (02 C7 satellites), piso piloto virtual (C3b), dónde conseguir el plano (C12), idealista/Fotocasa (C9); EN holiday rentals (03 C12). | Schedule after launch, one per month, each with its own route and PAA set (avoid reusing service FAQs). |

---

## 11. What not to change

- The FAQ system (40–80 words, brand as subject, first 3 open, schema = visible) and the Markdown mirrors: they are the strongest GEO assets on the site.
- One rules array for robots, the per-page CSP with hashes, the embed CSP split, the IndexNow diff.
- The market-price tables with dated primary sources on `/precios/` and the guides: this is exactly the "information gain" 04 §8.1.9 asks for.
