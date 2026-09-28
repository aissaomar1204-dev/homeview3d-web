# Content audit: editorial and factual review (ES + EN)

Date: 2026-09-28 · Scope: `build/content/*.mjs` (34 files), `build/data/{site,pricing,villa,process,deliverables,glossary,ui,ui-viewer}.mjs` and the rendered text in `dist/**/index.md` (the Markdown twins, tokens resolved). Read-only on sources; `dist/` was not rebuilt. `node build/validate-content.mjs` passes (0 errors, 0 warnings).

Companion file: [`CLIENT-CONFIRMATIONS.md`](CLIENT-CONFIRMATIONS.md) (checklist, in Spanish, of every promise, price and policy the owner must confirm before launch).

## 1. Summary

The copy is in good shape: answer-first leads on all 60 indexable pages, no banned vocabulary, no em/en dashes, correct « » / “ ” quotes, sentence case headings, Spain Spanish with *tú*, and British English (two exceptions). Every market statistic was re-fetched and **all Registradores, INE and Ministry figures check out to the unit**. Honesty rules (§5) are respected almost everywhere.

What needs fixing before launch:

| Priority | Count | Themes |
|---|---|---|
| P0 | 1 | Commercial terms are still a proposal (`pricing.confirmed: false`, guarantees marked PROPOSAL). Nothing may launch until the owner signs off `CLIENT-CONFIRMATIONS.md`. |
| P1 | 20 | 2 misquoted competitor sources (BoxBrownie turnaround, studiomkdesign "por ambiente"); 1 inconsistent deliverable promise (BLEND file, 6 different wordings); 1 internal contradiction ("sin descargas" vs "descarga el archivo completo"); wrong button label («Explorar en 3D»); 5 different "render / recreación virtual" label texts; unclear volume-pricing conditions; unclear delivery clock and revision rounds; two false claims on the glossary page; demo case called "caso real"; EN grammar with the placeholder brand ("a Estudio 3D", "Estudio 3D 3D"); 2 US spellings; "Idealista" capitalised. |
| P2 | 24 | Terminology drift (tablet/tableta, sala/oficina de ventas, cut-away mode/view/dollhouse, package/pack…), small punctuation, outdated or redirected links, cannibalising duplicate FAQs, minor ambiguities. |

Duplication is low: about 3 % of author-written sentences repeat across pages (§6.3). The heavy repetition comes from shared blocks (room list, pricing table, process), by design.

## 2. Commercial promises: consistency matrix

Canonical values come from `build/data/pricing.mjs`, `process.mjs` and `site.mjs`. Every price, time and round count in the copy uses tokens, so **the numbers never contradict each other**. The contradictions are in the wording around them.

| Promise | Canonical value | Stated on | Status |
|---|---|---|---|
| Payment | On delivery of the finished work; no deposit, no card | home FAQ, precios (facts, guarantees, 2 FAQs, H2), faq, contacto (steps + FAQ), soluciones, servicios FAQ; EN twins | ✅ Consistent. ⚠ No payment deadline, method or what happens to a hosted viewer if an invoice goes unpaid (confirm). Also applies to 1.490 € developments (confirm). |
| Delivery time | Plano 3D 2 to 3, maqueta 3 to 5, promoción 7 to 10 working days | tokens everywhere | ✅ Values consistent. ❌ **When the clock starts** has 4 wordings (C-05). ❌ Whether **both** revision rounds fit in the window (C-06). |
| Rush | 48 h, +30 % on the total | precios, servicios, plano, renders, staging, como-funciona, guía plano, contacto | ✅ Consistent. ⚠ Not stated whether it applies to the plano 3D and to developments, nor how 2 revision rounds fit in 48 h (confirm). |
| Revisions | Plano 1, maqueta 2, promoción 2 | tokens | ✅. Shared process step says "los aplicamos en dos rondas" also on the plano page (context is the maqueta; acceptable). |
| Hosting | 12 months included with the maqueta; renewal 49 € + IVA per home per year | precios, tour, faq, glosario, inmobiliarias, como-funciona, EN twins | ✅ Consistent. ⚠ Start date of the 12 months not defined; **development pack hosting never mentioned** (pricing.mjs `promocion.includes` has no hosting line). |
| Usage rights | Market that property, no fee per use; studio shows work only with written permission | precios FAQ, faq FAQ, aviso legal ("se regulan en su presupuesto"), arquitectos | ⚠ Lists differ: precios omits "prensa", faq includes it; arquitectos promises reuse "en tus presentaciones"; promotoras guide tells developers to hand the material to partner agencies. Licence scope, duration, exclusivity and sub-licensing need defining (C-09). |
| Reply time | "24 h laborables" / "within one working day", from a person | contacto only (lead, facts, steps, FAQ) | ✅ ES/EN equivalent. ⚠ Not repeated on the thanks page (`ui.mjs` pages.thanks), where it matters most. |
| Pack contents | `pricing.packs[].includes` | pricing tables (engine) + copy | ✅ Renders 6/12, staging 60 €, extras consistent. ❌ **BLEND file** (C-01). ⚠ "4K" never defined; demo renders are 2,000 to 2,800 px wide (C-12). |
| VAT | Prices ex VAT, 21 % added on invoice; foreign/EU clients: ask | all pricing mentions | ✅ Consistent in both languages. |
| Free demo | One room of the client's plan, modelled in 3D, sent with AR, free, no commitment | ~25 CTAs, precios FAQ, contacto, como-funciona | ✅ Mostly consistent. ⚠ Scope drifts: Matterport guide CTA adds "con visor"; tour CTA "para que la compartas con tu equipo". No turnaround, no limit (one per client? per agency?) (confirm). |
| Volume | Pack cartera: 5 maquetas, 2.090 €, use within 6 months, homes ≤ 150 m². Calculator: 490 € (1 to 4), 418 € (5 to 9), 390 € (10 to 20), applied to **all** units | precios, home, inmobiliarias, faq, vacacional, marbella, contacto | ❌ Pack conditions (6 months, ≤ 150 m²) are not attached to the calculator tiers, and the 390 € tier has no stated conditions (C-04). "Baja a partir de la quinta" reads as marginal pricing, but the calculator reprices every unit. |
| Labelling | Renders marked as renders; staging marked as virtual recreation | renders, staging, promotoras, guía sobre plano, vacacional, faq, como-funciona, sobre-nosotros | ❌ 5 different label texts (C-03). Burned-in watermark or caption? (confirm). |
| Portals | Never promise an iframe inside idealista; link where accepted | all pages | ✅ except guía sobre plano, which generalises to all portals (C-07). |
| NDA | Signed before receiving plans, on request | home, promotoras, faq, contacto, privacidad, sobre-nosotros | ✅ Consistent (confirm the owner will actually sign third-party NDAs). |
| > 300 m² / exteriors | Fixed quote after seeing the plan; façades and full exteriors quoted separately | precios, promotoras, guía render, marbella | ✅. ⚠ Marbella FAQ adds "villas… con sótano, planta baja y planta alta" as quote-only even below 300 m² (C-10). |
| Coming soon | AI videos and VR 360 not available | servicios, precios, faq, ia guide, glosario, sobre-nosotros | ✅ Always "próximamente / coming soon". |

### 2.1 Contradictions (file + quote)

| ID | Contradiction | Quotes |
|---|---|---|
| C-01 | **Is the BLEND file delivered?** Six wordings. | `como-funciona.mjs:125` «Modelo 3D · GLB, USDZ y BLEND» (always) · `precios.mjs` table «Sí, en GLB, USDZ y BLEND» · `sol-arquitectos.mjs:21,104` «y, si lo necesitas, el archivo de Blender» (on request) · `faq.mjs:56` «y en BLEND si trabajas con Blender» · `servicio-tour.mjs:130` «Con la maqueta recibes también los archivos del modelo en GLB y USDZ» (no BLEND) · `precios.mjs:162` «conservas los renders y los archivos GLB y USDZ» · `dist/llms.txt` «modelo 3D amueblado (GLB y USDZ)». |
| C-02 | **AR "without downloads"** vs "the phone downloads the whole file". | `servicio-ar.mjs:18` title «Realidad aumentada inmobiliaria, sin app ni descargas»; `:57` «sin descargas ni registros»; `:191` EN «with no download and no sign-up» · vs same page FAQ «El teléfono descarga el archivo completo antes de mostrarlo» / «Phones download the whole file». |
| C-03 | **Five label texts** for the same practice. | `servicio-renders.mjs:123` «Render 3D generado a partir del plano 2D» + suggests «Imagen orientativa, mobiliario no incluido» · `servicio-staging.mjs:119` «Recreación virtual. Mobiliario no incluido» · `sol-promotoras.mjs:194` «infografía orientativa, no contractual» · `guia-sobre-plano.mjs:128` «Infografía orientativa; mobiliario no incluido» · `sol-vacacional` «recreación virtual» o «imagen generada por ordenador» · `faq` «Recreación virtual» o «Imagen orientativa». EN: “3D render generated from the 2D floor plan”, “Virtually staged. Furniture not included”, “indicative image, not contractual”, “Computer-generated image” or “Virtual recreation”. |
| C-04 | **Volume conditions.** Pack: 5 units, 6 months, ≤ 150 m². Calculator and FAQs: tiers with no conditions. | `precios.mjs:96` «el precio va por tramos: el unitario baja a partir de la quinta vivienda y vuelve a bajar a partir de la décima» · `faq.mjs:85` «A partir de 10 viviendas, el precio unitario vuelve a bajar» · `home.mjs:63` «el precio de la maqueta completa baja a partir de la quinta» (calculator in `src/js/main.js:134` applies the tier price to **every** unit). |
| C-05 | **Delivery clock start**, four wordings. | `home.mjs:79`, `servicio-plano.mjs:123` «desde que recibimos el plano y resolvemos las dudas» · `servicios.mjs:108` «desde que recibimos el plano» · `como-funciona.mjs:59` «desde que tenemos el plano y una medida de referencia» · `faq.mjs:98` «Desde que tenemos el plano y las dudas resueltas: la superficie o una medida de referencia y el estilo de mobiliario». |
| C-06 | **Revision rounds inside the delivery window?** | `process.mjs:24` Día 4 «los aplicamos en dos rondas» → Día 5 entrega (both rounds inside 3 to 5 days) · `faq.mjs:98` «la primera revisión con tus cambios ya entra en ese plazo» (implies the second may not) · `como-funciona` «Con urgencia, las mismas fases se comprimen en 48 horas» (two rounds in 48 h?). |
| C-07 | **Portals.** | `guia-sobre-plano.mjs:148` «Los portales solo publican tours 3D de sus proveedores homologados» vs everywhere else «idealista solo admite… proveedores compatibles» and «el campo de tour virtual de los portales que acepten enlaces externos». |
| C-08 | **Viewer button label.** | `servicio-tour.mjs:32,85,175,228` «solo al pulsar «Explorar en 3D»» / “Explore in 3D” vs the real button `ui-viewer.mjs:19,127` «Ver la villa en 3D» / “View the villa in 3D”. |
| C-09 | **Usage rights lists.** | `precios` FAQ «en tu web, en portales, en redes sociales, en el dosier de venta o en cartelería» vs `faq` «web, portales, redes, dosieres, prensa y cartelería… Si vas a ceder el modelo a terceros, lo hablamos antes» vs `sol-arquitectos.mjs:21` «puedes reutilizar la geometría amueblada en tus presentaciones» vs `guia-sobre-plano` «Da el mismo material a las agencias colaboradoras» vs `aviso-legal` «se regulan en su presupuesto». |
| C-10 | **Multi-storey homes.** | `faq` «La maqueta 3D completa se cobra por vivienda según su superficie total» vs `zona-marbella` FAQ «Para villas mayores, o con sótano, planta baja y planta alta, te damos un precio cerrado» and table «Villa de 150 a 300 m² · Maqueta 3D completa, planta a planta · 690 €». |
| C-11 | **Plan retention.** | `sobre-nosotros` FAQ «Lo conservamos mientras dura el encargo y sus revisiones» vs `privacidad` «Mientras dure el encargo y el alojamiento del visor que contrates» / «12 meses desde nuestro último contacto, si no llegas a encargar nada». |
| C-12 | **Plano 3D delivers the model?** | `servicio-plano.mjs:32-33` facts «Entregables: … y modelo 3D» / «Formatos: … modelo en GLB, USDZ y BLEND» vs `precios` «Modelo 3D amueblado, a escala · Plano 3D: Sirve de base para las imágenes; no se entrega». |

## 3. Fact check of external sources

Every external URL was fetched on 2026-09-28 (WebFetch, curl, the Ministry XLS files parsed with xlrd, the Registradores PDF extracted with pdftotext, Matterport read in a browser because prices load by geolocation).

### 3.1 Official statistics: all verified

| Claim (pages) | Source | Result |
|---|---|---|
| 37,01 % foreign purchases, Málaga province, Q2 2026; 2nd after Alicante (46,43 %) (tour, zonas, marbella, malaga, costa-del-sol, sobre-plano guide; EN twins) | Registradores ERI 2T 2026, p. 4 and p. 44 | ✅ Exact. "p. 44" citation correct. |
| 15,98 % foreign share in Spain, "algo más de 26.800", record high (AR, zonas) | ERI p. 3 «15,98%… máximo histórico, alcanzando algo más de 26.800 compras» | ✅ |
| British 6,99 %, Dutch 6,94 %, German 6,11 % led foreign purchases (AR, marbella) | ERI p. 3 «Las nacionalidades cabeceras han sido británicos (6,99%), neerlandeses (6,94%), alemanes (6,11%)» | ✅ (shares of foreign purchases, correctly worded). |
| 11.727 new-build sales, Málaga province, 12 months to Q2 2026; 3rd after Madrid and Barcelona; of 35.839 total (plano, promotoras, zonas, malaga) | ERI annual table p. 28: Madrid 15.689, Barcelona 14.407, Málaga 11.727; Málaga total 35.839 | ✅ |
| Málaga capital 18,09 % of provincial sales, 12 months (zonas, malaga, costa-del-sol) | ERI p. 32, annual capital-vs-province table | ✅ |
| Málaga capital 3.401 €/m², +14,7 % (malaga, EN marbella) | ERI p. 18, annual capitals table | ✅ |
| Málaga province 3.347 €/m², Q2 2026 (marbella) | ERI quarterly provincial table «Málaga 3.347 0,2 %» | ✅ (quarterly figure; the annual one is 3.254 €/m²; label says "2.º trimestre", correct). |
| INE ETDP July 2026: 21,6 % new (13.289), 78,4 % used (48.128) (renders, staging) | ine.es/dyngs/Prensa/ETDP0726.htm, published 25/09/2026 | ✅ Exact. |
| Ministry 2025 municipal sales: Marbella 4.399 / 450 new; Málaga 6.301 / 1.038; San Roque 1.018/158; Manilva 1.122/92; Casares 635/113; Estepona 3.466/888; Benahavís 711/23; Mijas 3.190/337; Fuengirola 2.169/621; Benalmádena 2.070/188; Torremolinos 1.990/442; Rincón 860/214; Vélez-Málaga 1.410/160; Torrox 820/155; Nerja 582/38 | XLS 34010210 (total) and 34010240 (new) by municipality, sum of Q1 to Q4 2025 | ✅ All 15 municipalities match to the unit; all percentages recomputed correctly. |
| Estepona 2nd in new-build in the province after Málaga city; more than Marbella + Manilva + Casares + Benahavís | Same XLS: Málaga 1.038, Estepona 888, Fuengirola 621, Marbella 450… (450+92+113+23 = 678) | ✅ |
| 27,9 % of Málaga province sales by non-residents in 2025 (10.079 of 36.128); Spain 7,4 % | XLS 340101d0 (by buyer residence), sum 2025: 10.079 / 36.128 = 27,90 %; Spain 55.411 / 751.907 = 7,37 % | ✅ Wording "no residen en España" is right (includes non-resident Spaniards). |

### 3.2 Market prices (third-party pages)

| Claim | Source | Result |
|---|---|---|
| BoxBrownie 3D floor plan **40 € por planta, en 24 horas** (guía plano table, level table, FAQ) | boxbrownie.com/floor-plans: «3D Full Color · €40 POR PISO · **48 HORAS**» | ❌ **24 h is wrong: 48 h.** `precios` says 48 h (correct). |
| BoxBrownie "a medida" **desde 200 €, en 48 horas** (guía plano; FAQ «el plano a medida en 48») | «Tailored 3D Floor Plans · Desde €200», no turnaround shown | ❌ Turnaround unsupported; remove it. Note: BoxBrownie shows prices in the visitor's currency (EUR for Spain). |
| homestagerdesign 119,95 €, 1 revision, from 72 h, **"hasta 60 m²"** | «Precio por plano (60m2) y planta»; «Una revisión incluida»; «a partir de 72 horas» | ⚠ Price ✅; the source says "(60 m²)", not "hasta". `precios` wording «de unos 60 m²» is right. |
| inmofotomadrid 12 feb 2026: básico 100 to 250, estándar 250 to 400, premium 400 to 800+ | «entre 150 € y 250 €… versiones más simples entre 100 € y 150 €»; «250 € a 400 €»; «400 € a 800 € o más» | ✅ (100 to 250 merges the two basic tiers; acceptable). |
| ararenders 13 jun 2026: 200 to 450; 400 to 1.000 (2 to 4 views); 1.500 to 4.000; 800 to 2.500 (360); 1.500 to 5.000 (animation); urgency 20 to 40 % | fetched | ✅ All. |
| estudio3dbs 2026: 200 to 400; 400 to 800 (4K); 300 to 600; 600 to 1.200; 500 to 1.500 aerial; 300 to 800 plan; 800 to 2.000 (3 to 5); 2.000 to 6.000 (8 to 12); 700 to 2.500 (360); 1.500 to 5.000 (30 to 60 s) | fetched | ✅ All. |
| proyecto3dvalencia: from 246 € + IVA interior, 396 € + IVA exterior, ~1.400 € + IVA house | fetched, «Precios sin IVA» | ✅ |
| studiomkdesign: interior desde 350 € por ambiente; **pack inmobiliaria 2 ambientes** desde 850 €; **plano 3D humanizado desde 250 €**; extra revision 60 € | «Renders de Interiores: Desde 350€ Por Ambiente»; «**Pack Starter** (2 ambientes): Desde 850€»; «Plano Humanizado 3D: Desde 250€ **Por Ambiente**»; «60€» | ❌ The plan price is **per room**, not per plan: "Desde 250 €" understates it. ⚠ The pack is called "Pack Starter", not "para inmobiliaria". |
| renders.es: 50 to 150 € + IVA, 70 to 200 €, 300 to 500 € (6), 50 to 100 € plan, 60 to 250 € modelling, "estimated" | fetched: «Los precios que aquí mostramos son estimados» | ✅ |
| maverickframe 24 jul 2026: €150 to €600 per still exterior | fetched | ✅ |
| vistastudiodesign: 129 € sin IVA, up to 6 rooms, AI from photos | «129 € · sin IVA», «Hasta 6 estancias», «Precios sin IVA (21%)» | ✅ ("por inmueble" is our paraphrase; fine). |
| cronoshare staging 9 ene 2026: 60 to 400 € per room | fetched | ✅ (cronoshare treats prices as ex VAT by default). |
| cronoshare 360 tour 5 ene 2026: 190 to 350 € per pack; 220 to 320 € for 90 to 140 m²; orientative, ex VAT | fetched | ✅ |
| andreasgrunau (Málaga, Pro3): 190 / 250 / 470 € + IVA; 24 to 48 h; 6 months included; 50 €/year; schematic plan 35 € + IVA | fetched | ✅ All. Prices apply to Málaga and surroundings (travel charged elsewhere); the page already says "Málaga". |
| tucasaapunto: desde 165 € + IVA | fetched | ✅ |
| pedra.ai: 29 €/month, 100 credits, plan-to-3D 2 credits (≈ 0,58 €) | fetched | ✅ |
| floorplanner free: 5 projects, 960 × 540 px, watermark | fetched | ✅ |
| Planner 5D AI: images, DXF, DWG; one free trial per person; quality warning | fetched | ✅ (also accepts PDF). |
| r2u: from about US$2,700, 3 to 10 weeks | fetched: «starts around $2,700… 3 to 10 weeks» | ✅ (article date not shown; "2026" is from the title). |
| RealSpace 3D (April 2026): US$300 to 3,000; interiors 600 to 1,500; exteriors 800 to 2,500 | fetched, «Last updated: April 2026» | ✅ |
| Matterport: Free (1 space, 2 users); Starter €13/€11; Professional €65/€53; Business €332/€277; schematic plan €20 (Starter) / €15; Pro2/Pro3 need Professional+; Pro3 ±20 mm at 10 m; AI defurnish | matterport.com/plans and /cameras read in a browser from Spain | ✅ All (EUR values from the page's price table: €20 / €15). |
| idealista has its own virtual staging tool (staging FAQ) | idealista launched "Virtual Home Staging (VHS)" in 2020 (idealista/news) | ✅ true but **unsourced on the page** (P2: add link). |
| idealista only accepts compatible multimedia providers | idealista/tools help «Proveedores multimedia compatibles» | ✅ |

### 3.3 Technical and legal references

| Claim | Source | Result |
|---|---|---|
| AR Quick Look needs iOS/iPadOS 12 or later; Safari, Messages, Mail; Vision Pro | developer.apple.com: «Requires a device running iOS 12 or iPadOS 12, or later, or visionOS 1 or later» | ✅ (P2 nuance: ARKit also needs an A9 chip or later, so an iPhone 5s on iOS 12 cannot show AR). |
| Scene Viewer: Android 7.0+, ARCore device, up-to-date Google Play Services for AR and Google app; 3D fallback | developers.google.com/ar/develop/scene-viewer | ✅ |
| ARCore devices: shipped with Play Store, Android 7.0+ unless listed | developers.google.com/ar/devices | ✅ |
| AR works in SFSafariViewController, not all in-app browsers | webkit.org/blog/8421 | ✅ |
| ARKit introduced with iOS 11, June 2017 | developer.apple.com/news/?id=06052017b (5 June 2017) | ✅ |
| WebXR is a W3C Candidate Recommendation Draft (June 2026) | w3.org/TR/webxr «Candidate Recommendation Draft, 9 June 2026» | ✅ |
| glTF royalty-free, "JPEG of 3D", ISO/IEC 12113:2022 | khronos.org/gltf | ✅ |
| Blender GPL, commercial use allowed | blender.org/about | ✅ |
| model-viewer by Google, Apache 2.0 | modelviewer.dev | ✅ |
| Cycles "physically-based path tracer for production" | docs.blender.org/manual/**en/2.91**/… | ✅ text, ⚠ link points to the Blender 2.91 manual while the site says "Blender 5" (P2: use `/manual/en/latest/`). |
| Ley 2/1974 art. 14 (added by Ley 25/2009): no fee scales | BOE-A-1974-289#a14 | ✅ |
| RD 515/1989 arts. 2, 3.2, 8 | BOE-A-1989-11181 | ✅ (construction status, advertising binding, validity period in brochures). |
| TRLGDCU art. 61 | BOE-A-2007-20555#a61 | ✅ (URL 200; well-known content). |
| LOE DA 1.ª: guarantee by seguro de caución or aval solidario, amounts + taxes + legal interest, cuenta especial, guarantor and bank named in advertising | BOE-A-1999-21567#daprimera | ✅ |
| Decreto 218/2005 (Andalucía): art. 5 advertising contents; DIA with furnished plan at 1:100 minimum; applies to intermediaries | BOJA 2005/217/1 | ✅ |
| EU AI Act: art. 3(60) «ultrasuplantación», art. 50(4) deployer disclosure, art. 113 general application 2 Aug 2026 | BOE DOUE-L-2024-81079 (verbatim extract) | ✅ Original text. ⚠ Ask the legal adviser to confirm no later amendment (Digital Omnibus proposals) changed dates for art. 50 before launch. |
| Netlify certified under the EU-US DPF; SCCs 2021/914 | netlify.com/privacy | ✅ ⚠ `netlify.com/legal/subprocessors/` now 301-redirects to `trust.netlify.com` (P2: update the link). |
| LSSI, LOPDGDD, RGPD, AEPD, WhatsApp EEA policy, MDN, openusd, Khronos spec, SketchUp Free, Sweet Home 3D (+ user guide) | HTTP 200 | ✅ Links live. |

### 3.4 Internal figures (villa case) checked against project files

| Claim | Evidence | Result |
|---|---|---|
| 3,1 MB web GLB; 5,3 / 8,2 MB USDZ; 7 / 8,3 MB GLB AR | `dist/models/*` byte sizes | ✅ |
| 178.704 triangles, 82 materials, 39 textures; web file "menos de un tercio" of the export | `dist/models/villa.report.json`: 3.132.584 vs 11.258.258 bytes (27,8 %) | ✅ |
| Footprint 9,1 × 14,1 m | report bounds 9,16 × 14,10 m | ✅ |
| 12 rooms ≈ 75 m² interior + ≈ 28 m² terraces | `villa.rooms`: interior 75,0 m²; terraces 28,2 m² | ✅ |
| **"9 renders… en unos 7 minutos"** | `source/villa3d/renders/_render_log.txt`: 9 images, **428 s** total, including **og_image (1200 × 630)** and **villa_plano_lineas** (line drawing, 32 samples). Photoreal stills are **2.000 to 2.800 px wide**, not 4K. | ⚠ True as stated, but the case page lists only 8 («Aquí van seis; la planta cenital y la planta de líneas…») and the social image is never mentioned. Readers may assume "9 renders in 4K in 7 minutes" (see F-16). |
| < 0,002 % clipped pixels per render | `_timings.json` max clip on a photoreal still: 1,3 × 10⁻⁵ (0,0013 %) | ✅ |
| "Rehacerlo entero… unos 26 segundos" (case, step 5) | no log found in the repo | ⚠ Keep only if the owner can reproduce it. |
| Baños «2 + ducha» | villa rooms list: en-suite (tub + rain shower) and family bathroom; no separate shower room listed | ⚠ Confirm against the plan, or write «2 (el de suite con bañera y ducha)». |

## 4. Honesty rules (CONTENT-SCHEMA §5)

| Rule | Status | Notes |
|---|---|---|
| No invented testimonials, clients, logos, counts, ratings, "+X % sales" | ✅ | Explicit notices on soluciones, sobre-nosotros, zonas. Illustrative ROI tables are labelled "supuestos, no resultados". |
| Statistics only from primary sources, verified | ✅ | All verified (§3.1). Market prices are secondary by nature and are labelled as third-party published rates with dates. |
| Villa anonymised, "caso demostrativo" | ✅ with 1 exception | ❌ `zona-costa-del-sol.mjs:43-44` «¿Tenéis un caso real en la Costa del Sol? — Sí: nuestro caso demostrativo…» A "caso real" answered "Sí" suggests a client job (F-12). |
| Measurements ≈ | ✅ | Consistent everywhere, with the "publica la superficie oficial" advice. |
| Portals caveat | ✅ with 1 exception | C-07 (guía sobre plano) and EN capitalisation "Idealista". |
| AR device claims | ✅ | Consistent iOS/iPadOS 12, Android 7.0 + ARCore, desktop QR. C-02 "sin descargas" contradiction. |
| Staging labelled | ✅ practice / ❌ wording | 5 label texts (C-03). |
| Prices ex VAT from tokens | ✅ | No literal own prices found outside tokens, except "Tipología adicional: 390 €" (from pricing data) and competitor prices (correct). |
| AI video / VR 360 coming soon | ✅ | Never described as available. |
| AI use disclosed honestly | ⚠ | `como-funciona.mjs:84,235` and `sobre-nosotros.mjs:65,189`: Claude is credited with «la dirección técnica del proyecto». That clashes with «Una persona revisa cada entrega» and «La IA no decide dónde va un muro», and it is a business choice to name a vendor (confirm, F-15). |

## 5. Language quality

### 5.1 Spanish (Spain, tú)

- Register: *tú* throughout; *vosotros* only when the user addresses the studio («¿Qué necesitáis…?») or with a plural subject («ni tú ni el propietario tenéis», correct agreement). No *usted*. ✅
- Mechanics: no em/en dashes, « » quotes, "…" not "...", non-breaking "21 %", thousands dot "1.490 €". No repeated words or spacing errors found by automated scan. ✅
- Issues found by reading:
  - `soluciones.mjs:37` missing comma: «partimos de {{villa:input}} y el resultado tiene…» → «partimos de {{villa:input}}, y el resultado tiene…».
  - `sol-promotoras.mjs:123,150` stat labels end in a full stop before «(Fuente: …)», giving «…tras Madrid y Barcelona. (Fuente: …, 2026).» Other stat blocks have no inner full stop. The source label also repeats the period («2.º trimestre de 2026, 2026»).
  - `contacto.mjs:100` «calculador de precios» → «calculadora de precios» (the other 4 mentions use *calculadora*).
  - Anglicisms used inconsistently: *tablet* 16 / *tableta* 10; *online* 17 / *en línea* 4. Recommend *tableta* (RAE) and «plataforma en línea / web».
  - «mantas chevron» (villa data): acceptable in fashion; optionally «mantas de espiga».
- Tone: consistent, concrete and sober; the "somos parte interesada" callouts give the guides credibility.

### 5.2 English (British)

- Spelling: British everywhere (visualisation, colour, licence, modelling, programme-free) except **2 × "visualization"** in `guia-precio-render.mjs:435-436` («How much does architectural visualization software cost?» / «…price of architectural visualization…»). ❌
- Estate agency vocabulary is right for a UK reader (instruction, valuation, sole agency, vendor, on your books, show home, sales suite). ✅
- Issues:
  - **"a Estudio 3D"** ×8 (`servicio-plano.mjs:289`, `sol-inmobiliarias.mjs:44`, `sol-promotoras.mjs:58`, `zona-marbella.mjs:70`, `faq.mjs:344`, `guia-precio-render.mjs:354`, `guia-matterport.mjs:361`, `glossary.mjs:202`) → the article depends on the final brand name. Rephrase without an article before `{{brand}}` («our 3D model», «with an {{brand}}…» only once the name is known).
  - **"Estudio 3D 3D model / viewer / floor plan"** ×11 (the placeholder already contains "3D"). Use «our 3D viewer», «{{brand}}'s 3D floor plan», or drop the brand where it adds nothing.
  - **"Idealista"** capitalised ×8 (`home.mjs:196`, `faq.mjs:382`, `sol-inmobiliarias.mjs:47,48,280,296`, …) vs "idealista" ×5. The brand is lowercase.
  - `sobre-nosotros.mjs:171` «a cheap flat image»: in British English *flat* = apartment, so it reads "an image of a cheap flat". → «a cheap, static image».
  - `servicio-staging.mjs:304` «How to do virtual staging for free?» is a fragment (search wording) → «How can I do virtual staging for free?»; `:324` «Is virtual staging legit…» → «Is virtual staging legitimate, or does it hide problems?».
  - Registradores gloss appears in 3 forms: "(Spanish Land Registry)" ×3, "(Spain’s Land Registrars)" ×2, "Land Registry" ×5. The Colegio is the association of land registrars, not the registry → use «Colegio de Registradores (Spain’s association of land and property registrars)» once per page.
  - `servicio-tour.mjs:228` «Core Web Vitals are unaffected» is an absolute claim → «Core Web Vitals should not suffer». ES equivalent «la velocidad que mide Google no se resiente» → «no debería resentirse».

### 5.3 Duplicated sentences and paragraphs (quantified)

Author-written text only (all string fields of `build/content/*.mjs`, legal pages excluded, sentences of 7 or more words):

| | Sentences | Unique | Repeated on 2+ pages (keys) | Occurrences | Share |
|---|---|---|---|---|---|
| ES | 2.872 | 2.808 | 38 | 95 | 3,3 % |
| EN | 2.114 | 2.076 | 28 | 62 | 2,9 % |

Most repeats are captions («Render generado a partir del plano 2D», 13 × on 11 pages), fact values and source labels, which is fine.

Exact duplicate FAQ questions across pages (these compete for the same People Also Ask slot):

- ES: «¿Cuándo se paga el trabajo?» (home, contacto) · «¿Qué IA puede generar planos 3D?» (servicio-plano, guia-ia-vs-3d) · «¿Qué formatos de plano aceptáis?» (servicio-plano, sol-arquitectos) · «¿Necesitáis visitar la vivienda?» (servicio-plano, sol-vacacional).
- EN: «Do you need to visit the property?» (servicio-plano, sol-inmobiliarias).
- Near-duplicate answers (word 3-gram Jaccard 0,38 to 0,52): home vs servicio-plano on price («¿Cuánto cuesta convertir el plano…» / «¿Cuánto vale hacer una casa en 3D?») and on turnaround, in both languages. Recommend keeping the full answer on servicio-plano and giving home a shorter, link-first answer.

Rendered pages (shared blocks included): share of words in lines repeated on 3 or more pages. Home 41 %, services hub 35 %, tour 34 %, AR 28 % and developers 28 % are the highest; guides, FAQ and glossary are at 3 to 9 %. The main repeated block is the 12-room list (on 9 ES pages) plus the pricing table and the 5-step process. Consider a shorter room list (3 rooms plus a link, as the audience pages already do) on home and the service pages.

## 6. Terminology and CTA consistency

| Concept | ES usage (count) | EN usage (count) | Recommendation |
|---|---|---|---|
| Rendered image | render (dominant); infografía 3D explained as synonym | render (528), CGI (25, explained) | ✅ Keep. |
| Product names | «Plano 3D» 142 / «planta 3D» 7; «maqueta 3D completa» 106 / «maqueta completa» 51 | «3D floor plan»; «complete 3D model» 109 / «full model» 10 / «full 3D model» 1 | Replace «planta 3D» with «plano 3D» (vacacional lead, zone copy) and «full model» with «complete model» in facts. |
| Viewer | «visor 3D» 67, tour virtual 19, visita virtual 2, recorrido virtual 4 (as synonyms on purpose) | «3D viewer» 91, «web viewer» 66, «interactive 3D floor plan» 10 | ✅ Synonyms are explained on the tour page. |
| Cut-away | «modo maqueta» 43 | «cut-away mode» 23 / «cut-away view» 16 / «dollhouse» 7 | EN: use «cut-away mode» everywhere; mention "dollhouse" once as the Matterport term. |
| AR | «realidad aumentada», «AR» 81, «RA» 3 | «augmented reality», «AR» | ✅ (ES "AR" is industry usage; «RA» only in Google's product name). |
| Sales space | «sala de ventas» 33 / «oficina de ventas» 16 | «sales suite» 30 | ES: pick «sala de ventas». |
| Show home | «piso piloto» 18 / «piso de muestra» 2 | «show home» 10 / «show flat» 3 | EN: «show home». |
| Package | «pack» | «package» 47 / «pack» 30 | EN: «package», except the product name «Portfolio pack». |
| Tablet | tablet 16 / tableta 10 | tablet | ES: «tableta». |
| Labels | 5 variants (C-03) | 4 variants | One policy (see CLIENT-CONFIRMATIONS §7). |
| Primary CTA | «Pide tu demo» (nav, bands, contact) | «Get your demo» | ✅ Consistent. Closing-band H2s vary by page (intentional). |
| AR button | «Ver en tu salón» | “View in your room” | ✅ Consistent across copy, glossary and UI. |
| Viewer button | copy says «Explorar en 3D»; UI says «Ver la villa en 3D» | “Explore in 3D” vs “View the villa in 3D” | ❌ C-08. |
| Reply promise | «Contesta una persona» ×6 + 24 h on contact | «A real person replies» ×9 + one working day | ✅ |

## 7. Does each page answer its main question in the first lines?

All 60 indexable pages open with an answer-first lead (what, for whom, price token, time token), and every service, audience, zone and guide page puts an `answer` block or question H2 first. Exceptions and weak spots:

| Page | Issue | Fix |
|---|---|---|
| `soluciones/alquiler-vacacional` (ES) | Lead promises «una planta 3D a color, renders y un visor 3D» and then quotes only «Plano 3D desde 149 €». Renders and the viewer need the 490 € maqueta. | See F-13. |
| `zonas/marbella`, `en/3d-rendering-marbella` | Lead leads with «viviendas de obra nueva» although the page's own data shows 89,8 % resale. | Put resale first: «villas, áticos y viviendas de reventa u obra nueva». |
| `home` (ES description) | «Desde 490 € + IVA, en días.» vague (schema asks for a figure). | Use «en 3 a 5 días laborables» if the 155-character limit allows. |
| `glosario` | Lead ends with a false claim (F-11). | See F-11. |

## 8. Findings with corrected text

Owner is `content` unless stated. File paths are relative to `build/`.

| ID | P | File (lang) | Current | Corrected |
|---|---|---|---|---|
| F-01 | P0 | `data/pricing.mjs` (`confirmed: false`), `guarantees` (PROPOSAL) | Every price, time, round, hosting term and guarantee is still a proposal. | Owner signs off `CLIENT-CONFIRMATIONS.md`; then set `confirmed: true`. Owner: orchestrator. |
| F-02 | P1 | `content/guia-precio-plano.mjs:63,85,192` (ES) | «40 € por planta, en 24 horas» · «Una imagen cenital a color, en 24 horas» · «BoxBrownie entrega su plano 3D estándar en 24 horas y el plano a medida en 48» | «40 € por planta, en 48 horas» · «Una imagen cenital a color, en 48 horas» · «BoxBrownie entrega su plano 3D a color en 48 horas y homestagerdesign.com indica desde 72 horas.» Also change the FAQ opener «Entre 24 horas y unos pocos días» → «Entre 48 horas y unos pocos días». |
| F-03 | P1 | `content/guia-precio-plano.mjs:64` (ES) | «A medida, plataforma online · Desde 200 €, en 48 horas» | «A medida, plataforma en línea · Desde 200 €» (no turnaround published). |
| F-04 | P1 | `content/guia-precio-plano.mjs:71` (ES); `guia-precio-render.mjs:90` (ES/EN) | «Plano 3D «humanizado» · Desde 250 €» · «Pack para inmobiliaria, 2 ambientes · Desde 850 €» | «Plano 3D «humanizado» · Desde 250 € por ambiente» · «Pack Starter, 2 ambientes · Desde 850 €» (EN: “From €250 per room”, “Starter pack, 2 rooms”). |
| F-05 | P1 | BLEND: `como-funciona.mjs:125`, `precios.mjs` table + `:162`/`:327`, `sol-arquitectos.mjs:21,62,104`, `faq.mjs:56`, `servicio-tour.mjs:130,273`, `servicio-plano.mjs:33`, `deliverables.mjs` (ES/EN) | Six different promises (C-01). | After the owner decides (CLIENT-CONFIRMATIONS §5), use one sentence everywhere, e.g. if always included: «Con la maqueta recibes el modelo en GLB, USDZ y BLEND.» / “The complete model comes with GLB, USDZ and BLEND files.” and add BLEND to `pricing.packs.maqueta.includes` and llms.txt. |
| F-06 | P1 | `content/servicio-ar.mjs:18,57,191` (ES/EN) | title «Realidad aumentada inmobiliaria, sin app ni descargas»; «sin descargas ni registros»; “with no download and no sign-up” | title «Realidad aumentada inmobiliaria, sin instalar ninguna app»; «sin instalar nada ni registrarse»; “with nothing to install and no sign-up”. |
| F-07 | P1 | `content/servicio-tour.mjs:32,85,175,228` (ES/EN) | «solo al pulsar «Explorar en 3D»» / “when “Explore in 3D” is tapped” | «solo al pulsar «Ver la villa en 3D»» or, generic: «solo cuando el visitante pulsa el botón del visor» / “only when the visitor taps the viewer button”. |
| F-08 | P1 | `content/guia-sobre-plano.mjs:148` (ES) | «Los portales solo publican tours 3D de sus proveedores homologados: el visor va en tu web, por enlace o con un código QR.» | «idealista solo publica tours 3D de sus proveedores compatibles: el visor va en tu web, por enlace, con un código QR o en el campo de tour virtual de los portales que acepten enlaces externos.» |
| F-09 | P1 | Labels: `servicio-renders.mjs:123`, `servicio-staging.mjs:119`, `sol-promotoras.mjs:194`, `guia-sobre-plano.mjs:128`, `sol-vacacional`, `faq` (ES/EN) | 5 texts (C-03). | One policy, e.g. renders: «Render 3D. Imagen orientativa; mobiliario no incluido.» / “3D render. Indicative image; furniture not included.” Staging: «Recreación virtual. Mobiliario no incluido.» / “Virtually staged. Furniture not included.” Off-plan: add «no contractual» / “not contractual”. State once whether it is burned into the image or supplied as a caption. |
| F-10 | P1 | `home.mjs:63,164`; `precios.mjs:96,261`; `faq.mjs:85,302` (ES/EN) | «el precio de la maqueta completa baja a partir de la quinta» · «el unitario baja a partir de la quinta vivienda y vuelve a bajar a partir de la décima» · «A partir de 10 viviendas, el precio unitario vuelve a bajar» | Once conditions are confirmed: «Si encargas 5 o más maquetas, todas pasan a 418 € + IVA cada una, y con 10 o más, a 390 €, para viviendas de hasta 150 m² encargadas en un plazo de 6 meses.» EN: “Order 5 or more complete models and each one drops to €418 + VAT, or €390 from 10, for homes up to 150 m² ordered within 6 months.” |
| F-11 | P1 | `content/glosario.mjs:16,28,64` (ES/EN) | «Todos se aplican en la maqueta 3D completa…» · «Menos de 40 palabras, con su fuente oficial enlazada» / “with its official source linked” | «La mayoría se aplican en la maqueta 3D completa…» · «Menos de 40 palabras; fuente oficial enlazada cuando existe» / “Under 40 words; official source linked where one exists” (16 of 30 terms have no external link). |
| F-12 | P1 | `content/zona-costa-del-sol.mjs:43-44` (ES) | «¿Tenéis un caso real en la Costa del Sol?» «Sí: nuestro caso demostrativo es…» | «¿Tenéis algún caso en la Costa del Sol?» «Tenemos un caso demostrativo, no un encargo de cliente: la planta alta de una villa real de la Costa del Sol, modelada por {{brand}} a partir de su plano publicado…» |
| F-13 | P1 | `content/sol-vacacional.mjs:47` (ES) | «…en una planta 3D a color, renders y un visor 3D para tu web de reservas… Plano 3D desde 149 € + IVA, en 2 a 3 días laborables.» | «…en una planta 3D a color, y si lo necesitas en renders y un visor 3D para tu web de reservas… Plano 3D desde {{price:plano3d}} + IVA en {{delivery:plano3d}}; con renders y visor, desde {{price:maqueta}} + IVA.» (check the 60-word limit). |
| F-14 | P1 | `content/servicio-plano.mjs:32-33` (ES; check EN facts) | «Entregables: Planta cenital, vista isométrica, planta 2D redibujada y modelo 3D» · «Formatos: Imágenes PNG en 4K; modelo en GLB, USDZ y BLEND» | «Entregables: Planta cenital, vista isométrica y planta 2D redibujada; con la maqueta, el modelo 3D» · «Formatos: PNG en 4K; con la maqueta, GLB, USDZ (y BLEND si se confirma)». |
| F-15 | P1 | `como-funciona.mjs:84,235`; `sobre-nosotros.mjs:65,189` (ES/EN) | «Claude, de Anthropic · Dirección técnica y escritura de los scripts de Python» · «para la dirección técnica del proyecto» | If the owner keeps the mention: «Claude, de Anthropic · Escritura y depuración de los scripts de Python» · «para escribir y depurar los scripts de Python» (EN: “writing and debugging the Python scripts”). |
| F-16 | P1 | `servicio-renders.mjs:48`, `caso-villa.mjs:69` + facts, `guia-ia-vs-3d`, `precios`, `guia-precio-render` (ES/EN) | «El set completo, 9 imágenes, se calculó en 7 minutos» · «Aquí van seis; la planta cenital y la planta de líneas están en el comparador» | «Las 9 imágenes del caso (6 vistas, la planta cenital, la planta de líneas y la imagen para redes) se calcularon en unos 7 minutos en total». Then confirm the **4K** definition for deliverables (demo stills are 2.000 to 2.800 px wide) or re-render the demo at 3.840 px. |
| F-17 | P1 | EN: 8 × "a {{brand}}", 11 × "{{brand}} 3D …" (see §5.2) | “a Estudio 3D 3D floor plan is a set of 4K PNG files” · “With a Estudio 3D viewer link” | “Our 3D floor plan is a set of 4K PNG files” · “With our viewer link”. |
| F-18 | P1 | EN `home.mjs:196`, `faq.mjs:382`, `sol-inmobiliarias.mjs:47,48,280,296` | “Idealista” | “idealista”. |
| F-19 | P1 | `content/guia-precio-render.mjs:435-436` (EN) | “architectural visualization” ×2 | “architectural visualisation”. |
| F-20 | P1 | `sol-promotoras.mjs:19,54`; `zona-costa-del-sol.mjs:32` (ES/EN) | «El pack de promoción… incluye varias tipologías en un mismo visor» / “puts several unit types in one viewer” | «incluye hasta 3 tipologías en un mismo visor» / “covers up to 3 unit types in one viewer”. |
| F-21 | P1 | Delivery clock (C-05, C-06): `home.mjs:79`, `servicio-plano.mjs:123`, `servicios.mjs:108`, `como-funciona.mjs:59`, `faq.mjs:98,315`, `process.mjs:24` | Four starting points; unclear whether round 2 is inside the window. | After confirmation, one sentence everywhere: «Los días cuentan desde que tenemos el plano y una medida de referencia, e incluyen las 2 rondas de cambios si nos las envías en 24 h.» (or whatever the owner confirms). |
| F-22 | P2 | `data/ui.mjs:284-291, 579-586` (thanks page) | No reply time. | Add «Te contestamos en 24 h laborables.» / “We reply within one working day.” |
| F-23 | P2 | `guia-precio-plano.mjs:65` (ES) | «A color y amueblado, hasta 60 m²» | «A color y amueblado, plano de unos 60 m²». |
| F-24 | P2 | EN source labels: `servicio-ar.mjs:221`, `servicio-plano.mjs:241`, `servicio-tour.mjs:241`, `sol-promotoras.mjs:243`, `zona-marbella.mjs:231` | “(Spanish Land Registry)” / “(Spain’s Land Registrars)” | One gloss: “Colegio de Registradores (Spain’s association of land registrars)”. |
| F-25 | P2 | `sol-promotoras.mjs:123,150,242,269` (ES/EN) | stat labels ending in «…tras Madrid y Barcelona.» / «…fue del 7,4 %.» before «(Fuente: …)» | Drop the final full stop inside the label, and drop the duplicated year in the source label. |
| F-26 | P2 | `soluciones.mjs:37` (ES) | «partimos de {{villa:input}} y el resultado tiene» | «partimos de {{villa:input}}, y el resultado tiene». |
| F-27 | P2 | `contacto.mjs:100` (ES) | «El [calculador de precios](@precios)» | «La [calculadora de precios](@precios)». |
| F-28 | P2 | ES corpus | *tablet* 16 / *tableta* 10; *oficina de ventas* 16 / *sala de ventas* 33; *online* 17 | «tableta», «sala de ventas», «en línea» (or keep "online" only in competitor labels). |
| F-29 | P2 | EN corpus | cut-away mode 23 / view 16 / dollhouse 7; package 47 / pack 30; show flat 3 | «cut-away mode»; «package» (except “Portfolio pack”); «show home». |
| F-30 | P2 | `data/glossary.mjs:20` | Cycles link to the Blender **2.91** manual | `https://docs.blender.org/manual/en/latest/render/cycles/introduction.html`. |
| F-31 | P2 | `content/privacidad.mjs` (ES/EN) | `https://www.netlify.com/legal/subprocessors/` (301) | the final URL on `trust.netlify.com` (confirm the exact page). |
| F-32 | P2 | `sobre-nosotros.mjs:171` (EN) | “a cheap flat image” | “a cheap, static image”. |
| F-33 | P2 | `servicio-staging.mjs:304,324` (EN) | “How to do virtual staging for free?” · “Is virtual staging legit, or does it hide problems?” | “How can I do virtual staging for free?” · “Is virtual staging legitimate, or does it hide problems?”. |
| F-34 | P2 | `servicio-tour.mjs:85,228` (ES/EN) | «la velocidad que mide Google no se resiente» / “Core Web Vitals are unaffected” | «la velocidad que mide Google no debería resentirse» / “Core Web Vitals should not suffer”. |
| F-35 | P2 | `zona-marbella.mjs:160` (+ FAQ) (ES/EN) | «Villa de 150 a 300 m² · Maqueta 3D completa, planta a planta · 690 €» | «Villa de 150 a 300 m² en total · Maqueta 3D completa (todas las plantas) · 690 €», once C-10 is confirmed. |
| F-36 | P2 | `data/villa.mjs:21` | «2 + ducha» / “2 + shower” | Confirm against the plan; if the shower is in the en-suite, «2 (la suite con bañera y ducha)». Owner: content + assets. |
| F-37 | P2 | Duplicate FAQs (§5.3) | 4 ES + 1 EN exact duplicates; home vs servicio-plano price/time near-duplicates | Rephrase one of each pair (e.g. sol-vacacional «¿Tenéis que venir al apartamento?»), shorten the home answers and link to servicio-plano. |
| F-38 | P2 | Engine: `lib/markdown.mjs:309`, `lib/schema.mjs:121` | «de 150 a 300 m²» (150 m² falls in both bands) | «de 151 a 300 m²» or «más de 150 y hasta 300 m²». Owner: front. |
| F-39 | P2 | Engine: `{{file:glbArMesa}}` | «7 MB» next to «5,3 MB», «8,2 MB», «8,3 MB» | Keep one decimal: «7,0 MB» / “7.0 MB”. Owner: front. |
| F-40 | P2 | `servicio-ar.mjs`, `guia-ar.mjs`, `faq.mjs`, glossary (ES/EN) | «basta un iPhone o iPad con iOS 12 o posterior» | «un iPhone o iPad compatible con ARKit (iPhone 6s o posterior) con iOS 12 o posterior». Optional: Apple's page only says iOS 12. |
| F-41 | P2 | `servicio-staging.mjs:142,305` (ES/EN) | «algunos portales, como idealista, tienen su propia herramienta de staging virtual» (unsourced) | Add the idealista/news link (Virtual Home Staging, 2020) or drop the example. |
| F-42 | P2 | `guia-matterport.mjs:200` (ES; check EN) | «te la mandamos con visor y realidad aumentada» | Match the demo scope confirmed by the owner (default: «te la mandamos en realidad aumentada»). |
| F-43 | P2 | Usage rights (C-09): `precios` FAQ, `faq`, `sol-arquitectos.mjs:21` | Different lists | After confirmation, one sentence: «Puedes usar renders, plantas, visor y archivos para comercializar esa vivienda en cualquier canal (web, portales, redes, dosier, prensa y cartelería), sin pagar por cada uso…» |
| F-44 | P2 | Retention (C-11): `sobre-nosotros` FAQ | «Lo conservamos mientras dura el encargo y sus revisiones» | «Lo conservamos mientras dura el encargo y el alojamiento del visor; si no llegas a encargar nada, 12 meses. Puedes pedir que lo borremos antes.» |
| F-45 | P2 | Cookie policy (legal) | sessionStorage stores landing/referrer/UTM without consent while the page itself cites LSSI art. 22.2 | Ask the legal adviser whether this attribution storage is exempt; otherwise store only after the user starts the form. Owner: orchestrator. |

## 9. Method notes

- Rendered text read from `dist/**/index.md` (60 pages) plus `dist/llms.txt`; sources in `build/content`, `build/data`.
- Duplication: scratch scripts `dups.mjs` (sentence and FAQ duplicates, Jaccard on word 3-grams) and `rendered-dups.mjs` (shared lines on 3 or more pages); terminology counts by string match.
- Market and official data: see §3; the Ministry XLS (`34010210`, `34010240`, `340101d0`) and the ERI PDF were parsed locally; Matterport prices read in a browser from Spain (EUR).
- Not verified (no public source to check): the owner's own capacity claims (turnaround, 26 s rebuild, ±3 px overlay), Rightmove/Kyero tour-link policies (the copy hedges them), and whether the AI Act dates were amended after the original text.
