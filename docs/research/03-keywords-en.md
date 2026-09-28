# 03 · English keyword and SERP research (EN market)

> Date: 2026-09-28 · Scope: English-language demand from international real-estate agencies operating in Spain (Costa del Sol / Marbella / Málaga first), developers selling off-plan to foreign buyers, and remote clients worldwide (UK, Nordics, NL, DE, holiday-rental owners).
> Brand: none yet. `{{BRAND}}` is used as a placeholder throughout.
> Related: `01-competidores.md` covers the competitor deep-dive (Vista Studio, Viseni, Improntia, Persuadis). The Spanish keyword report should use the same page IDs so the ES and EN URLs pair cleanly under hreflang.

---

## How this research was done, and its limits

- **Live Google SERPs** were captured in a clean browser session (not logged in, non-essential cookies **rejected**) with `hl=en&gl=es`, which is how an English-speaking agent based in Spain searches. The IP geolocated to Andalucía. A control set ran with `gl=uk` for British agencies and UK-based developers. For each SERP we recorded the AI Overview (AIO), ads, local pack, organic results, video and forum blocks, and **People Also Ask (PAA) questions verbatim**. We clicked PAA items open to load the extra questions.
- **Google Autocomplete** (suggestqueries endpoint) was used to expand long-tail terms and gauge demand. If a query returns no suggestions, demand is very low.
- **WebSearch and WebFetch** collected public price lists and pricing guides. Every figure has a URL in section 6.
- **No search-volume tool was available.** The Ahrefs/Similarweb connectors need authorisation, and Google Trends returned HTTP 429. Demand is therefore given as **estimated tiers** (Very high / High / Medium / Low / Very low), based on how rich the autocomplete is, how dense the ads are, and what the SERP contains. **Validate these tiers with Ahrefs, Semrush or Keyword Planner, then with Search Console, before committing budget.**
- Rankings are personalised by location. A searcher in Marbella or London will see somewhat different local packs.

---

## 0. TL;DR

1. **Our category's head terms belong to DIY SaaS and free AI tools.** Examples: "floor plan to 3D", "3D floor plan", "virtual staging". Autocomplete for "floor plan to 3d…" returns only *free / ai / online / converter* variants. The top results are Planner 5D, Homestyler, floor-plan.ai, Dehome, Coohom, Cedreo, Floorplanner, and Fiverr ads. **Do not build the EN strategy around these head terms.** Target them with *service* modifiers ("…service", "for real estate", "for estate agents", "for developers", "Spain", "Marbella", "off-plan") and use content to capture the head terms' questions.
2. **Our clearest opening is the combination nobody sells in English for Spain: "2D floor plan → real, furnished 3D model → photoreal renders → embeddable web viewer → AR with no app, in days".** Each part has competitors. Nobody ranks for the full bundle, and nobody in the AR SERPs is a service provider offering no-app AR from a floor plan. Those SERPs are made up of blogs, dev shops, apps and papers.
3. **Local English terms have high intent, very low volume, and weak incumbents.** Examples: "3d rendering marbella", "architectural visualization marbella", "3d rendering costa del sol", "3d rendering malaga", "virtual staging marbella". "3d rendering marbella" returns **no autocomplete expansions**. The results are a local pack plus small studios (Foc Design, Beautypass, marbella.studio, Zenit Visuals, Egoist Unique, Promas, Improntia, Lobo Studio). For "virtual staging marbella", **no virtual-staging specialist ranks**; only physical home stagers appear. These terms are winnable within 3–6 months.
4. **Price questions appear everywhere** in PAA and AI Overviews ("How much does a 3D floor plan cost?", "How much should a 3D rendering cost?", "How much does virtual staging cost?"). The pages that rank are US-centric USD guides and Reddit threads. **A transparent 2026 price guide in EUR for Spain is a quick SEO win and a GEO asset**, because AI engines quote price ranges from guides.
5. **ChatGPT questions now appear in PAA:** "Can ChatGPT do architectural renderings?", "Can Chatgpt generate a floor plan?", "Does Chatgpt do virtual staging?", "Can ChatGPT create a 3D model?". We should publish the definitive answer, framed as "AI-assisted, code-driven Blender pipeline = accurate geometry; generative AI images ≠ a 3D model".
6. **GEO signal: AI Overviews cite listicles.** The AIO for "company to convert floor plans into 3d models spain" named Lobo Studio, Rendium, Proyecto 3D Valencia, Foc Design and 3DQ Studio, **sourced from the Maverick Frame listicle "Best 3D Rendering Companies in Spain"** (July 2026). RevenueBase ("Top 9 Architectural visualization studios based in Marbella") and Clutch also rank. **Getting into those lists, and publishing our own comparison content, matters as much as on-page SEO.**
7. **Don't copy the ES site 1:1 in English.** Build a **reduced EN set of about 16 pages at launch plus 6–8 later**, covering the core services, the segments (agents, developers, holiday rentals), Marbella/Costa del Sol, the case study, pricing, how-it-works, FAQ and about. Also add **4–6 English guides** aimed at global informational demand (cost, AI vs real 3D, Matterport alternative, AR how-to). Every EN page gets an ES twin under hreflang; ES-only pages (Spanish cities, portal-specific tips) have no EN twin. **Point x-default at the EN twin**, because German, Dutch and Swedish browsers are far more likely to read English than Spanish.
8. **Other languages:** Málaga's foreign buyers in Q2 2026 were **British 6.99 %, Dutch 6.94 %, German 6.11 %** of foreign purchases (Registradores). Foreigners made up 37.01 % of all homes registered in the province. **Plan `/nl/` and `/de/` as phase 3**, with about 6 pages each once EN has traction. Swedish, Norwegian and Danish are low priority for B2B pages (high English proficiency), but it is worth offering **multilingual viewer UI and room labels** as a product feature. French is later still.

---

## 1. Who searches in English, and why it matters

| Segment | Who they are | How they search | What converts them |
|---|---|---|---|
| **International agencies in the Costa del Sol** | British-, Scandinavian-, Dutch- and German-owned agencies in Marbella, Estepona, Benahavís, Mijas, Fuengirola, Nerja. They work in English day to day. | "3d floor plans for estate agents", "3d rendering marbella", "virtual staging marbella", "interactive 3d floor plan real estate". Mostly `gl=es`, `hl=en`. | Speed (days), a fixed price per property, an embeddable viewer, AR "wow" at viewings, and buyers abroad who can't visit. |
| **Developers selling off-plan to foreign buyers** | Promotoras in Málaga province and boutique villa developers. Their buyers are British, Dutch, German and Nordic. | "off plan property 3d visualisation", "cgi for property developers", "3d visualisation for property developers spain", "3d rendering costa del sol". | Every unit type modelled, AR at real size, renders for brochures, and fast changes when the plan changes. |
| **Remote / global clients** | UK and US agents, Nordic agencies, architects, holiday-rental owners. | "2d floor plan to 3d model service", "3d floor plan rendering service", "3d floor plan for holiday rental listing", "matterport alternative without site visit". | Price transparency, turnaround time, a sample, and no site visit. |

**Market data supporting an English-first international layer:**
- In **Málaga province, Q2 2026**, foreign buyers purchased **3,474 homes**, which is **37.01 %** of all homes registered and **+20.79 % year on year**. Top nationalities: **British 6.99 %, Dutch 6.94 %, German 6.11 %** (Colegio de Registradores, via justrealestate.es). The national foreign share was 15.98 %.
- **Spain, Q4 2025:** British 7.93 %, Dutch 6.77 %, German 6.65 %, Moroccan 5.78 %, Romanian 5.45 %, Italian 5.32 %, French 4.93 %, Belgian 4.38 % (Registradores, via idealista/news).
- Conclusion: in Málaga, **more than a third of the housing market is foreign**, so the agencies serving it are English-speaking or multilingual. English is the common B2B language for our buyers, and LLM answers are mostly generated in English.

---

## 2. Findings that apply across all clusters

| # | Finding | Evidence | Implication |
|---|---|---|---|
| F1 | Head terms show **DIY/tool intent**. | Autocomplete: "floor plan to 3d model free / ai / free online / converter / ai prompt"; "3d floor plan creator / free / maker / ai / generator / app / prompt"; "virtual staging ai / free / app / software". | Service pages target modifiers. Head terms are captured with guides (for example, "AI floor plan to 3D vs a real 3D model"). |
| F2 | **AI Overviews** appear on most commercial and informational queries (floor plan to 3d, off-plan 3D visualisation, virtual staging spain/price, AR real estate, matterport alternative, 3d rendering costa del sol, architectural visualization marbella, 3d visualisation for property developers spain). | Captured SERPs. | GEO and SEO are the same job now. Write answer-first paragraphs, price tables, and explicit entity facts. |
| F3 | AIOs **name studios taken from listicles and directories**. | The "company to convert floor plans into 3d models spain" AIO drew on maverickframe.com. The "3d rendering costa del sol" AIO named Viseni, Render Marbella, Esferarquitectura and Improntia, and quoted "from €2,500" villa packages. RevenueBase lists rank for "architectural visualization marbella". | Outreach to be included (Maverick Frame, RevenueBase, Clutch, archviz directories). Publish an honest "How to choose a 3D studio in Spain" guide. |
| F4 | **Local packs** appear on "3d rendering marbella", "3d rendering malaga", "virtual staging marbella", "real estate 3d rendering spain" and "3d floor plan rendering service". | Local packs: U 3D Studio, Marbella Studio, Visualfabrik, Beautypass, Mediagenio, Lobo Studio, plus interior designers on the staging queries. | Set up a Google Business Profile as a service-area business, but only with a real, verifiable address. Local citations. |
| F5 | **PAA mentions ChatGPT and AI** often. | "Can ChatGPT do architectural renderings?", "Can Chatgpt generate a floor plan?", "Does Chatgpt do virtual staging?", "Can ChatGPT create a 3D model?", "Will AI replace 3D rendering?", "Is there an AI tool that can render floor plans?" | Publish a flagship guide plus FAQ entries. Our honest story (Claude + Blender + Python gives exact geometry) is a strong differentiator. |
| F6 | **UK English ambiguity:** "rendering" also means wall plastering. | `gl=uk` PAA for "architectural rendering cost per image": "How much do renderers charge per m2?", "Is it cheaper to render or brick?", "How long does house rendering take?" | Always write "3D rendering", "CGI", "3D visualisation" or "renders of the property". Never use "house rendering" or "rendering cost per m2" alone. |
| F7 | **Paid competition in English inside Spain** is light and dominated by marketplaces. | Recurrent ads: Fiverr, Archevio ("3D Property Visualisation, free sample in two days", on 6 queries), Rendair, Rendershots, Pedra, Floorfy, Matterport, realrendering.agency, Behind Pictures, Fireflies Renders, Ararenders. | A small EN Google Ads test on the service long-tail is cheap. Archevio is the paid competitor to watch. |
| F8 | **Video and forum blocks** appear on most SERPs (YouTube, Reddit r/RealEstatePhotography and r/archviz, Facebook groups). | Captured SERPs. | Publish short YouTube demos ("2D floor plan → 3D model → AR in one tap") and take genuine part in Reddit threads. Both are GEO sources too. |

---

## 3. Keyword clusters

Difficulty is judged from the SERP: **H** = big SaaS or marketplace domains plus AIO; **M** = mixed, with niche studios and guides; **L** = small local studios, forums, or no relevant result. Demand tiers are estimates (see the method note above).

### 3.1 Summary table

| # | Cluster | Priority | Intent | Demand (est.) | Difficulty | Proposed EN URL |
|---|---|---|---|---|---|---|
| C1 | Floor plan → 3D model (service) | **P1** | Commercial (head = DIY) | High (head) / Medium (service) | H (head) / M (service) | `/en/floor-plan-to-3d-model/` |
| C2 | 3D floor plans for real estate / estate agents | **P1** | Commercial | Medium | M | `/en/for-estate-agents/` + `/en/interactive-3d-floor-plans/` |
| C3 | Local: 3D rendering Marbella / Costa del Sol / Málaga | **P1** | Transactional, local | Very low–Low | **L–M** | `/en/3d-rendering-marbella/` (P1), `/en/3d-rendering-malaga/` (P2) |
| C4 | Real-estate 3D rendering / CGI (Spain) | **P1** | Commercial | Medium | M–H | `/en/real-estate-3d-rendering/` |
| C5 | Off-plan 3D visualisation (developers) | **P1** | Commercial | Low–Medium | M | `/en/off-plan-3d-visualisation/` |
| C6 | Augmented reality for real estate / AR property viewing | **P1** | Informational → commercial | Low–Medium | **L–M** (no service providers rank) | `/en/augmented-reality-real-estate/` + guide |
| C7 | Virtual staging (3D) | P1 (launch) / P2 (SEO) | Commercial (commodity) | High (global) | H (global) / L (Marbella) | `/en/virtual-staging/` |
| C8 | Pricing / cost questions | **P1** | Informational, commercial investigation | High | M | `/en/pricing/` + `/en/guides/3d-rendering-cost-spain/` |
| C9 | Interactive 3D floor plan / embeddable viewer | **P1** | Commercial | Medium | M–H (Matterport, CubiCasa, Floorplanner) | `/en/interactive-3d-floor-plans/` |
| C10 | Matterport alternative / 3D tour without site visit | P2 | Commercial investigation | Medium | M | `/en/guides/matterport-alternative/` |
| C11 | AI vs real 3D (ChatGPT, AI converters) | P2 | Informational | High (growing) | M | `/en/guides/ai-floor-plan-to-3d/` |
| C12 | Holiday rentals / Airbnb 3D floor plans | P2 | Commercial | Low | **L** | `/en/holiday-rentals/` |
| C13 | AI property videos (coming soon) | P3 | Commercial | Medium (SaaS) | H | `/en/ai-property-videos/` (when live) |
| C14 | VR / 360 virtual tours (coming soon) | P3 | Commercial | Medium | H | `/en/360-virtual-tours/` (when live) |
| C15 | Architects (visualisation for planning or clients) | P3 | Commercial | Low | M | `/en/for-architects/` (later) |

### 3.2 Cluster detail

#### C1 · Floor plan → 3D model service — **P1**, URL `/en/floor-plan-to-3d-model/`
- **Keywords.** Primary: "2d floor plan to 3d model service", "floor plan to 3d model". Secondary: "convert floor plan to 3d", "3d model of house from floor plan", "2d to 3d floor plan conversion service", "floor plan to 3d render", "3d floor plan services", "2d 3d floor plan services", "3d model from floor plan without photos" (long-tail, our unique claim).
- **Intent.** Mixed. "…service" is commercial. The bare head term is DIY ("free", "ai", "online").
- **Who ranks** (`gl=es`): Fiverr (ES gig), Cad Crowd, Reddit (r/microsaas, r/RealEstatePhotography "Convert 2D floor plan into 3D"), Homestyler, BluEntCAD, Architizer, Planner 5D, floor-plan.ai (4.9★ with 798k ratings in the snippet), Dehome, Behance, Pinterest, App Store and Google Play apps. WebSearch also surfaced Cedreo, Roomtodo, Coohom, Edensign ("< $1 per plan"), IndiaCADworks and The 2D3D Floor Plan Company ($79).
- **SERP features.** Ads (Fiverr, Virtual Employee, Outsource2india, IndiaCADworks, Rendair, Rendershots, Coursera), AI Overview (recommends Edensign/Floor Plan AI or "hire freelancers through Cad Crowd"), PAA, Images, Videos, Short videos, Discussions and forums.
- **PAA (verbatim):**
  - "How to convert 2D floor plan to 3D floor plan?"
  - "Can I use an AI to convert my floor plan into a 3D model?"
  - "How can I convert a 2D floor plan to a 3D model in SketchUp?"
  - "How can I convert a 2D engineering drawing to a 3D model?"
- **Related searches:** "2d floor plan to 3d model service online free", "…online", "…free".
- **Difficulty:** H for the head term, M for "service", L for the long-tail ("from a single plan, no photos, with AR").
- **Angle.** "A real, furnished 3D model built from one 2D plan, not an AI picture." Show the demo villa (12 rooms, 39 procedural textures) with a live viewer above the fold, plus an "AI converter vs studio" comparison table. Use `Service` + `Offer` schema.

#### C2 · 3D floor plans for real estate / estate agents — **P1**, URLs `/en/for-estate-agents/` (segment) and `/en/interactive-3d-floor-plans/` (product)
- **Keywords:** "3d floor plans real estate", "3d floor plans for estate agents" (UK), "3d floor plan rendering service", "3d floor plan services", "real estate floor plans 3d", "3d floor plans for realtors" (US).
- **Who ranks.** `gl=es`: Floorplanner, floor-plan.ai, RoomSketcher, Matterport, Smplrspace, CubiCasa. The local pack showed **US and Canadian studios** (SolidRender, 3D World renderings, Render 3D Quick), a sign that **no Spanish provider is relevant for this English query**. `gl=uk`: PropertyBox, PlanUp, 360virtualview, Photoplan, CP Creative, Joanna James, AIMIR CG, MyConstructor, Houzz Pro.
- **SERP features:** AIO (lists PlanUp £21.99–39.99 + VAT per office, RoomSketcher from about £30/month, Matterport, Metropix/Photoplan), PAA, Images, "Find related products" block (RoomSketcher, CubiCasa, Magicplan).
- **PAA (verbatim):**
  - From "3d floor plan rendering service", `gl=es`, expanded: "How much should a 3D rendering cost?", "How much does a 3D floor plan cost?", "How can I create a 3D rendering from a floor plan?", "Is there an AI tool that can render floor plans?", "How much do renderers charge per m2?", "How much rendering cost per m2 in the UK?", "How much do 3D modelers cost?", "Is there a free way to create a 3D floor plan?", "How much are interior renderings?", "Can ChatGPT do architectural renderings?"
  - From "3d floor plans for estate agents", `gl=uk`: "How much does a 3D floor plan cost?", "Is there a free 3D floor plan app?", "Can Chatgpt generate a floor plan?", "How to create a 3D view of a floor plan?"
  - From "3d floor plan services", `gl=uk`: "What is the best 3D floor plan software?", "How can I make my floor plan 3D?", "How to convert floor plan to 3D for free?"
- **Difficulty:** M. The UK SERP is full of software; `gl=es` has no Spanish player.
- **Angle.** For agencies: "Win instructions and sell to buyers abroad. 3D model + viewer + AR per listing, fixed price, delivered in days, white-label embed." Add volume packs, like Vista Studio's 5-unit pack.

#### C3 · Local: 3D rendering Marbella / Costa del Sol / Málaga — **P1**, URLs `/en/3d-rendering-marbella/` (P1) and `/en/3d-rendering-malaga/` (P2)
- **Keywords:** "3d rendering marbella", "3d renders marbella", "architectural visualization marbella", "3d rendering costa del sol", "3d rendering malaga", "3d visualisation marbella", "virtual staging marbella", "3d floor plans marbella", "cgi marbella". People also search for: "3d rendering marbella spain", "3d rendering marbella cost", "3d rendering costa del sol cost".
- **Who ranks:**
  - *3d rendering marbella:* Foc Design (wearefoc.com, #1), then the local pack (U 3D Studio, Marbella Studio, Visualfabrik), Beautypass, marbella.studio, Renders.es, Pinterest, Promas Building, Zenit Visuals, Egoist Unique, Instagram (@indraftsmarbella), Lab66.
  - *architectural visualization marbella:* sponsored places (DANIELI Architects, LIVING KITS, Helena Rocha), then an AIO naming Viseni, Visualfabrik, UDesign, Marbella Studio and Esferarquitectura, then RevenueBase, marbella.studio, udesign.es, Alejandro Giménez, Visualfabrik.
  - *3d rendering costa del sol:* an AIO naming Viseni, Render Marbella, Esferarquitectura and Improntia, which states "Standard packages for luxury residential villas (such as 6 exterior and 4 interior photorealistic shots) typically start from €2,500" and gives timelines of "Interiors: 1 to 2 business days per single room / Exteriors: 2 to 4 business days per view". Then Foc Design, Promas, marbella.studio, Improntia, Beautypass.
  - *3d rendering malaga:* local pack (Beautypass, Mediagenio, Lobo Studio), Lobo Studio, Areadesign (ES), Behind Pictures, Vimap Studio, Fireflies Renders (ES), ruzafa14studio (ES).
  - *virtual staging marbella:* only physical home stagers and interior designers (Tania Tsygel, Alba Menasalvas, VIBES Interiors, Ideal Furniture, EIRE Interiors, Nvoga, Eichholtz by IdHouse). **No virtual-staging specialist.**
- **PAA** ("architectural visualization marbella"): "How much does architectural visualization cost?", "Can ChatGPT do architectural renderings?" (the other two are irrelevant celebrity/architecture trivia).
- **Difficulty:** L–M. The pages are thin and often ES-first with English as an afterthought. Viseni is strong on structure but slow and has no public prices (see `01-competidores.md`).
- **Angle.** Make one strong EN local page for Marbella and the Costa del Sol, covering Marbella, Nueva Andalucía, Puerto Banús, San Pedro, Benahavís, Estepona, Mijas and Sotogrande as sections, not as separate thin pages. Embed the anonymised Costa del Sol villa case with a live viewer and AR button. Add `areaServed` and GeoCircle in the JSON-LD. Create a Google Business Profile if a real address is available.

#### C4 · Real-estate 3D rendering / CGI (Spain) — **P1**, URL `/en/real-estate-3d-rendering/`
- **Keywords:** "real estate 3d rendering spain", "3d rendering for real estate", "3d rendering services for real estate", "3d rendering for real estate marketing", "3d visualization real estate", "property cgi", "cgi for property developers" (UK), "photorealistic renders for property listings".
- **Who ranks** ("real estate 3d rendering spain", `gl=es`): Biverso, RevenueBase list, local pack (Maverick Frame London, Arquitecturas 3D, Vimap Studio), Renderby (Alicante), Facebook and YouTube videos, Adrián Gómez (LinkedIn, "accelerate luxury real estate pre-sales by 40-60%"), Berga & González, Plus Render (Bilbao), Archello, Upwork. Ads: realrendering.agency, Fiverr, **Archevio**, Behind Pictures. In `gl=uk` for "cgi for property developers": Modunite, Charles Roberts Studios, NPA Visuals, 3dlines, Kisiel, iCreate.
- **PAA (verbatim):**
  - "real estate 3d rendering spain": "How much do 3D renderings cost?", "Can ChatGPT do architectural renderings?", "What is the best 3D rendering software for real estate?", "What is 3D rendering in real estate?"
  - "3d rendering for real estate", expanded: "What is 3D rendering in real estate?", "How much should a 3D rendering cost?", "What is the best 3D rendering software for real estate?", "How can I create a 3D render of my house?", "How difficult is 3D rendering?", "Will AI replace 3D rendering?", "Is house rendering worth the cost?", "How long does a rendering take?", "Is there a free 3D rendering software?"
  - "cgi for property developers", `gl=uk`: "What is CGI in property?", "What does CGI stand for?" (the rest are about developer salaries).
- **Difficulty:** M–H. Many established archviz studios, but few pair "Spain" with "real estate agency" in English.
- **Angle.** Renders come from the same model as the viewer and AR, so they are consistent and can be rebuilt in minutes. Blender Cycles. Procedural PBR textures, so no stock licensing issues.

#### C5 · Off-plan 3D visualisation for developers — **P1**, URL `/en/off-plan-3d-visualisation/`
- **Keywords:** "off plan property 3d visualisation" / "visualization", "3d visualization for real estate developers", "3d renders for off-plan properties", "3d visualisation for property developers spain", "sell off-plan with 3d", "new build 3d visualisation spain", "cgi off plan marketing".
- **Who ranks:**
  - "off plan property 3d visualisation", `gl=es`: an AIO (CGI stills, interactive walkthroughs, 3D masterplans and unit selectors, 3D floor plans, and "Average Costs: Single Render: Typically ranges from $300 to $2,500 per image"), bepresent.be, marketika.dev, vinode.io, ecompapistudio.com.au, Visengine, Realting.com, **inmueblemedia.com (Tenerife, off-plan visualisation for luxury developers in Spain)**, immotro.ch. Ads: Archevio, Chaos, Bentley, Fiverr.
  - "3d visualisation for property developers spain": an AIO naming **Town Visuals (Madrid and Marbella)**, Lobo Studio, Visualfabrik and Play-time, and stating "Individual Renders: Roughly €300 to €2,500 per image". Organic: townvisuals.com. Ads: globalsnopek.es, ararenders.com, Behind Pictures, KeyShot.
- **PAA** ("how to sell off plan property"): "How do I sell my off-plan property?", "What does it mean to sell a property off-plan?" (the rest are about flipping and Dubai).
- **Autocomplete:** "off plan property…" is dominated by **Dubai, London, Abu Dhabi, Riyadh, Manchester**. Nothing Spanish appears, so qualify with "Spain", "Costa del Sol" or "Marbella".
- **Difficulty:** M. Global content is generic; Spain-specific English pages are rare.
- **Angle.** "Every unit type as a navigable 3D model and AR at real size, so foreign buyers can walk in before they fly in." Link to the case study and to a developer pack with per-unit pricing.

#### C6 · Augmented reality for real estate / AR property viewing — **P1**, URL `/en/augmented-reality-real-estate/` + guide `/en/guides/view-property-in-ar/` (P2)
- **Keywords:** "augmented reality real estate", "ar property viewing", "ar real estate app", "view house in augmented reality", "augmented reality floor plan", "augmented reality property marketing" (UK), "ar quick look property", "see house before it's built ar", "augmented reality real estate examples" (autocomplete).
- **Who ranks:**
  - `gl=es`: an AIO (use cases: virtual staging, pre-construction sales, interactive floor plans, renovation previews), Visengine, Onirix, YouTube, Innowise, LinkedIn, ScienceDirect, Genesis Augmented, Fingent, HQSoftwareLab, TheClose.
  - "view house in augmented reality floor plan": Live Home 3D, Floor Plan AR (Google Play), Apple RoomPlan, Authenticus, 3D Walkabout (AU), Kemper Apps, Assysto, HomeByMe.
  - `gl=uk`: Scene3D, Visengine, InReality, Sanders Studios, Property Studios.
- **PAA (verbatim)**, from "augmented reality property marketing", `gl=uk`: "How is augmented reality used in marketing?", "What is AR in real estate?", "What are the four types of augmented reality?", "What are 10 real-world examples of augmented reality?", "How is AR different from AI?"
- **Difficulty:** L–M. **No provider ranks with a concrete, try-it-now, no-app AR demo.** The SERP is dev shops, apps and theory.
- **Angle.** "Open this villa in AR now: iPhone/iPad (AR Quick Look, USDZ) and Android (Scene Viewer, GLB). Tabletop at 1:20 or real size to walk in. One tap, no app." Put a QR code on desktop and a button on mobile. This page is our most shareable asset and a natural backlink magnet.

#### C7 · Virtual staging — P1 at launch (conversion), P2 for SEO, URL `/en/virtual-staging/`
- **Keywords:** "virtual staging spain", "virtual staging marbella", "virtual staging price", "virtual staging real estate", "3d virtual staging", "virtual staging companies", "virtual staging for new builds".
- **Who ranks:**
  - "virtual staging spain": an AIO (DIY AI tools "ImmoStage, Rehavitat, and Pedra … from €2 to €49 per image", professional services in Madrid, Barcelona and Valencia, Stagè), Galicia & Green Spain, Ideal House, Clutch, realestatephotographer.es, InstantRoom, Stagè, Spacely AI, Home Staging España. Ads: Pedra, Archevio.
  - "virtual staging price": an AIO ("between $0.25 and $150 per image"; AI at $0.25–$3, human at $20–$150+; physical staging $1,500–$5,000+), Reddit, Virtual Staging AI, BoxBrownie, GenRoom.
- **PAA (verbatim):**
  - "virtual staging price": "How much to charge for virtual staging?", "Is virtual staging AI free?", "How much does it cost to stage a 3 bed house?", "How to do virtual staging for free?"
  - "virtual staging real estate": "How much does virtual staging cost?", "What is virtual staging?", "What is the best virtual staging app for real estate?", "How to do virtual staging for real estate?", "How to do virtual staging for free?", "What are the biggest home staging mistakes?"
  - "virtual staging", `gl=uk`: "Does Chatgpt do virtual staging?", "What is virtual staging and how is it used?", "How do I virtually stage my home?", "Which AI tool is best for virtual staging?", "Is virtual staging AI legit?", "What is the purpose of staging?"
- **Difficulty:** H globally, where AI SaaS makes it a commodity. L for "virtual staging marbella".
- **Angle.** **Don't compete on price per photo.** Position it as "3D virtual staging on the real model: restyle furniture and materials, then re-render every room consistently, inside the viewer and in AR". This is an upsell after the model.

#### C8 · Pricing / cost — **P1**, URLs `/en/pricing/` (our prices, transactional) and `/en/guides/3d-rendering-cost-spain/` (market guide, informational, citable)
- **Keywords:** "how much does a 3d rendering cost", "how much does a 3d floor plan cost", "3d rendering cost spain", "3d rendering marbella cost", "architectural rendering cost per image", "virtual staging price", "3d floor plan price", "matterport cost".
- **Who ranks:**
  - "how much does a 3d rendering cost": Reddit (r/archviz, several threads), Quora, CYLIND, Omegarender, RealSpace 3D, NoTriangle Studio (published 15 hours earlier), Vibe3D, YouTube (Melos Azemi), Pelicad.
  - "how much does a 3d floor plan cost": an AIO ("between $100 and $800 per floor"), Cad Crowd, Ritn3D, Reddit, Homestyler, Roomagen, Facebook, TWOBUILD (EUR), Cedreo, NoTriangle.
- **PAA (verbatim):** "How much do 3D renderings cost?", "How much should I pay for rendering?", "How much do 3D modelers cost?", "How can I get a 3D rendering of my house?", "How much should a 3D rendering cost?", "Is there a free way to create a 3D floor plan?", "How much is a 3D house plan?", "How much does a 3D model cost?", "How much does architectural visualization cost?", "How much do architects charge for renderings?", "How much does 3D rendering cost?"
- **Related searches:** "3D rendering cost per hour", "Interior design rendering cost", "3D render freelance price", "Cost of 3D architectural rendering".
- **Difficulty:** M. Nearly all guides quote USD for the US market. **An EUR guide for Spain, updated in 2026, has almost no competition.**
- **Angle.** Show public "from" prices and the market ranges we collected (section 6) in a comparison table. Answer-first. Add a `dateModified` field. Mark prices up with `Offer` / `PriceSpecification`.

#### C9 · Interactive 3D floor plan / embeddable viewer — **P1**, URL `/en/interactive-3d-floor-plans/`
- **Keywords:** "interactive 3d floor plan real estate", "interactive floor plan for listings", "3d model viewer for property listings", "embed 3d model website real estate", "dollhouse view floor plan", "3d walkthrough from floor plan".
- **Who ranks:** Floorplanner, then an AIO citing Matterport, CubiCasa, Floorplanner, Smplrspace, YouTube, Homestyler, AIMIR CG and FloorPlanOnline. WebSearch also surfaced RoomSketcher Live 3D, Zillow 3D Home, Kroscloud (iframe embed) and Blinqlab. Ads: Archevio, Matterport, Bentley, Rendair.
- **Difficulty:** M–H, because it's a software category. Our edge: the viewer is **built from a plan with no scan**, includes a cut-away "maqueta" mode (walls cut at 1.15 m), a room list, a guided tour and light control, has **AR built in**, and embeds in any listing page.
- **Angle.** Put a live viewer on the page. Name features exactly as users search for them ("dollhouse view", "cut-away view", "room-by-room tour", "embed code").

#### C10 · Matterport alternative / 3D tour without a site visit — P2, URL `/en/guides/matterport-alternative/`
- **Keywords:** "matterport alternative", "matterport alternative without site visit", "3d tour without visiting property", "virtual tour from floor plan", "3d virtual tour from floor plan", "matterport price".
- **Who ranks:**
  - "matterport alternative without site visit": an AIO (Metareal Stage, Panoee/Kuula, CloudPano), pin360, Reddit (r/RealEstatePhotography, three threads; Giraffe360 recommended), Facebook groups, YouTube (Ben Claremont, "The Matterport ALTERNATIVE…", 372k views), see3d.ai (UK, "Matterport charges from £39/month just to host your tours"), TeliportMe.
  - "virtual tour from floor plan": Houseplans.com, then an AIO (Getfloorplan, Floor-plan.ai, Dehome, Archilogic "within 24 to 48 hours"), Create It Better, We Get Around Network forum. Ads: Archevio, Coursera, **Floorfy** (ES proptech), Simple Virtual Tour.
- **PAA (verbatim):** "What can I use instead of Matterport?", "Is iGUIDE better than Matterport?", "Is there a free version of Matterport?", "Why is Matterport so expensive?"
- **Difficulty:** M.
- **Angle.** "When you *can't* scan: off-plan, tenanted, abroad, or before a renovation. From a plan to a 3D model and AR, with no camera and no visit." Be honest about when Matterport is the better choice (it captures the real finishes of an existing home).

#### C11 · AI vs a real 3D model (ChatGPT, AI converters) — P2, URL `/en/guides/ai-floor-plan-to-3d/`
- **Keywords:** "floor plan to 3d ai", "ai floor plan to 3d model", "can chatgpt generate a floor plan", "can chatgpt create a 3d model", "can chatgpt do architectural renderings", "is there an ai tool that can render floor plans", "will ai replace 3d rendering".
- **Who ranks:** Floor-plan.ai, Planner 5D, Dehome, Coohom, Edensign, Rendair, meltflexai.com ("9 Free AI Tools Tested (2026)"), and YouTube tutorials (Melos Azemi "Floor Plan to 3D Render in 9.8 seconds", "Nano Banana" tutorials).
- **PAA:** see F5 above.
- **Difficulty:** M. The lists are written by tool vendors, so a neutral practitioner's view is missing.
- **Angle.** Tested comparison: a generative AI image vs an AI converter vs a code-built Blender model, compared on geometry accuracy, consistency across rooms, AR/GLB export, editability and licensing. Show our pipeline honestly: Claude writes the Blender Python, and a human checks it against the plan. **This is the page LLMs will cite when asked "can AI turn a floor plan into 3D?"**

#### C12 · Holiday rentals / Airbnb — P2, URL `/en/holiday-rentals/`
- **Keywords:** "3d floor plan for holiday rental listing", "airbnb 3d floor plan", "3d floor plan for vacation rental", "villa rental 3d tour marbella".
- **Who ranks:** Facebook groups, Roomagen ("Professional floor plans cost $100–$300 per property and are flat/abstract"), Rental Tonic (2016), Pinterest, Fiverr ("US$25.00 to US$45.00").
- **PAA (verbatim):** "How to create a 3D view of a floor plan?", "Can Chatgpt generate a floor plan?", "How much does a 3D floor plan cost?", "How can I create a 3D floor plan for free?", "Can ChatGPT create a 3D model?"
- **Difficulty:** **L.** This is a weak SERP.
- **Angle.** "Guests see the layout, which bedroom has the en-suite, and where the terrace is, so there are fewer questions and fewer bad reviews." Include a light package.

#### C13 · AI property videos (coming soon) — P3, URL `/en/ai-property-videos/` (publish only when the service is live)
- **Who ranks:** AutoReel, VideoTour.ai, PropertyVideos.ai (photo-to-video SaaS). Ads: BytePlus Seedance, Storyteq. **Vista Studio** sells this in Spain (€290 per walkthrough).
- **Angle.** "Cinematic video from photoreal renders of a home that *doesn't exist yet*" (off-plan), not from phone photos.

#### C14 · VR / 360° virtual tours (coming soon) — P3, URL `/en/360-virtual-tours/`
- High competition (Matterport, Floorfy, Kuula, Panoee, Giraffe360). Publish only when the service is live, and link it from C9 and C10.

#### C15 · Architects — P3, URL `/en/for-architects/`
- "3d visualization for architects", "architectural rendering service spain". The SERP is saturated with archviz studios. Lower lead value for us, so it can wait.

---

## 4. Should the EN site mirror the ES site 1:1?

**Recommendation: no. Build a reduced EN set, with strict ES↔EN pairing for the pages that exist in both.**

Why:
1. **English local demand is thin.** "3d rendering marbella" has no autocomplete expansions, and "off plan property…" autocompletes to Dubai and London. Mirroring every Spanish city or portal page in English would create thin pages with near-zero demand and dilute crawl budget and quality signals.
2. **English global head terms are SaaS territory.** Hitting them needs a few excellent guides, not many translated pages.
3. **GEO needs English on the core facts.** ChatGPT, Perplexity, Claude and Copilot answer most B2B queries in English and cite English pages. **Every core fact (services, process, deliverables, prices, case study, FAQ, company facts) must exist in English.**
4. **Quality over coverage.** Every EN page needs native-level copy (British English for the Costa del Sol audience), not machine translation. A smaller set can be done well.

**Rules:**
- **Page IDs are shared.** Each page has an ID (for example `svc-floorplan-3d`) with `es` and `en` slugs in the generator config. hreflang is emitted **only when both exist**. Pages that exist in only one language get no alternate.
- **x-default points to the EN URL** for paired pages. The ES home remains the canonical home for Spain. Users whose browser language is DE, NL, SV or FR land on English, which they can read.
- **EN slugs are in English**, lowercase and hyphenated, with no dates and 2–5 words, keyword first, and a trailing slash consistent with the generator. Leave out stop words where it reads naturally.
- **Spelling.** Use British English in copy ("visualisation", "colour", "estate agents", "off-plan"). Add US variants naturally in body text and FAQs ("visualization", "realtors", "real estate agents"). Avoid the word in slugs where possible, except `off-plan-3d-visualisation`, which matches the UK/Spain query.
- **Never write "house rendering" or "rendering cost per m2"** on its own (see F6).
- A **language switcher** links to the exact twin, or to the EN/ES home if there is no twin. It uses no JS-based translation (Vista Studio's mistake, see `01-competidores.md`).

---

## 5. Proposed EN URL map (with target keywords)

The `ES twin` column is indicative. Align it with the ES keyword report and the IA.

### 5.1 Launch set (P1)

| Page ID | EN URL | Primary keyword | Secondary keywords | Title tag draft (≤ 60 chars, + brand) | ES twin |
|---|---|---|---|---|---|
| home | `/en/` | floor plan to 3D model for real estate | 3D renders, AR property viewing, Spain, Costa del Sol | Floor Plan to 3D Model, Renders & AR · Spain | `/` |
| svc-floorplan-3d | `/en/floor-plan-to-3d-model/` | 2d floor plan to 3d model service | convert floor plan to 3d, 3d model of house from floor plan, 3d floor plan services | 2D Floor Plan to 3D Model Service for Real Estate | yes |
| svc-renders | `/en/real-estate-3d-rendering/` | real estate 3d rendering spain | 3d rendering for real estate, property CGI, photorealistic renders | Real Estate 3D Rendering in Spain · Photoreal CGI | yes |
| svc-viewer | `/en/interactive-3d-floor-plans/` | interactive 3d floor plan real estate | embeddable 3d viewer, dollhouse view, 3d walkthrough from floor plan | Interactive 3D Floor Plans to Embed in Listings | yes |
| svc-ar | `/en/augmented-reality-real-estate/` | augmented reality real estate | AR property viewing, view house in AR iPhone Android, no app | AR Property Viewing on iPhone & Android · No App | yes |
| svc-staging | `/en/virtual-staging/` | 3d virtual staging | virtual staging spain, virtual staging marbella, restyle furniture | 3D Virtual Staging on a Real Model · Spain | yes |
| seg-developers | `/en/off-plan-3d-visualisation/` | off plan property 3d visualisation | 3d visualisation for property developers spain, sell off-plan, new build | Off-Plan 3D Visualisation for Developers in Spain | yes (obra nueva / venta sobre plano) |
| seg-agents | `/en/for-estate-agents/` | 3d floor plans for estate agents | real estate agencies Spain, listing marketing 3D, AR viewings | 3D Models, Renders & AR for Estate Agents in Spain | yes (inmobiliarias) |
| loc-marbella | `/en/3d-rendering-marbella/` | 3d rendering marbella | 3d rendering costa del sol, architectural visualization marbella, virtual staging marbella, Estepona, Benahavís | 3D Rendering & 3D Models in Marbella · Costa del Sol | yes |
| case-villa | `/en/case-studies/costa-del-sol-villa/` | villa floor plan to 3d model (case study) | Marbella villa 3D, AR villa demo | Case Study: Costa del Sol Villa in 3D & AR | yes |
| pricing | `/en/pricing/` | 3d floor plan price | 3d rendering price spain, AR model price, packs for agencies | Pricing: 3D Models, Renders & AR (EUR) | yes |
| guide-cost | `/en/guides/3d-rendering-cost-spain/` | how much does 3d rendering cost (spain) | how much does a 3d floor plan cost, virtual staging price, AR cost | 3D Rendering Cost in Spain (2026): Real EUR Prices | yes |
| how | `/en/how-it-works/` | how to turn a floor plan into a 3d model | Blender, procedural textures, USDZ/GLB, turnaround | How We Turn a 2D Floor Plan into a 3D Model | yes |
| faq | `/en/faq/` | (FAQ hub; FAQPage schema) | all PAA questions | FAQ: 3D Floor Plans, Renders & AR | yes |
| about | `/en/about/` | (entity page for GEO) | studio facts, tools, founder, service area | About {{BRAND}} · 3D Studio in Spain | yes |
| contact | `/en/contact/` | get a quote 3d floor plan | upload your floor plan | Get a Quote: Upload Your Floor Plan | yes |
| legal | `/en/legal-notice/`, `/en/privacy-policy/`, `/en/cookie-policy/` | (legal) | | | yes |

### 5.2 Phase 2 (months 1–3)

| Page ID | EN URL | Primary keyword | Notes |
|---|---|---|---|
| guide-ai | `/en/guides/ai-floor-plan-to-3d/` | floor plan to 3d ai / can chatgpt… | C11. The flagship GEO article. |
| guide-matterport | `/en/guides/matterport-alternative/` | matterport alternative without site visit | C10 |
| guide-ar | `/en/guides/view-property-in-ar/` | how to view a house in AR iPhone Android | C6 how-to, with a QR demo |
| seg-rentals | `/en/holiday-rentals/` | 3d floor plan for holiday rental | C12, low difficulty |
| loc-malaga | `/en/3d-rendering-malaga/` | 3d rendering malaga | Only with unique content (Málaga city and east coast: Nerja, Rincón, Torremolinos, Benalmádena, Fuengirola) |
| guide-choose | `/en/guides/choose-3d-studio-spain/` | best 3d rendering companies spain / how to choose | Honest comparison criteria. A GEO counterweight to competitor listicles. |

### 5.3 Phase 3 (months 3–9, or when services launch)

`/en/ai-property-videos/` (C13), `/en/360-virtual-tours/` (C14), `/en/for-architects/` (C15), `/en/guides/selling-off-plan-to-foreign-buyers/`, `/en/guides/virtual-staging-disclosure/` (a best-practice note, not legal advice), and more case studies under `/en/case-studies/…`.

**ES-only (no EN twin):** Spanish city pages outside the Costa del Sol (Madrid, Sevilla, Valencia…), Idealista/Fotocasa-specific tips, and Spain-specific procedural content aimed at Spanish agencies.

**Internal linking.** Home → every service. Each service links to the case study, pricing and a relevant FAQ anchor. Guides link to the service page they support. The Marbella page links to the case and the developer page. Breadcrumbs go on every page (`BreadcrumbList`).

---

## 6. Public price ranges collected (with sources)

> These are market references for our pricing page and the EUR guide. Figures are as published, in the currency shown. USD sources are US- or global-market. Items marked *(snippet)* come from the Google result snippet or AI Overview and were not re-verified on the page.

### 6.1 3D floor plans (static image)
| Provider / source | Price | Notes | URL |
|---|---|---|---|
| BoxBrownie | **€40 per floor** (3D full colour); tailored 3D **from €200**; 2D €30–35 | 24 h for 2D, 48 h for 3D | https://www.boxbrownie.com/floor-plans |
| Bella Virtual Staging | **$70 per plan** (3D); 2D $20–25 | 2–4 business days | https://www.bellavirtual.com/pages/3d-floor-plans |
| The 2D3D Floor Plan Company | 3D **from $79**; 2D $49 | *(snippet)* | https://the2d3dfloorplancompany.com/pricing/3d-floor-plan/ |
| Home Stager Design (Spain) | **€119.95** 3D colour furnished per floor (~60 m²) | 72 h, see 01-competidores | https://homestagerdesign.com |
| Ritn3D guide (2026) | Freelancers $100–$1,200; agencies' 3D floor plan render **$150–$500**; 3D walkthrough video $500–$2,000; AI tools $9.99–$19.99/month | | https://www.ritn3d.com/blog/how-much-does-3d-floor-plan-cost/ |
| RealSpace 3D guide (2026) | 3D floor plans **$300–$800** | | https://www.realspace3d.com/resources/3d-rendering-pricing-guide/ |
| Cad Crowd | **$300–$900 per floor** | *(snippet)* | https://www.cadcrowd.com/blog/3d-floor-plan-rendering-services-for-companies-costs-rates-and-pricing/ |
| TWOBUILD | **EUR 80–500 per unit** (EUR 150–600 by size and furnishing) | *(snippet; the page returned 404 on fetch)* | https://www.twobuild.cc/blog/ |
| Roomagen | AI from $0.23 per view; pro **$200–$800 per floor**; Airbnb pro plans $100–$300 per property | *(snippet)* | https://roomagen.com/tools/3d-floor-plan-cost |
| Google AIO ("how much does a 3d floor plan cost") | **$100–$800 per floor** | AI Overview | — |
| UK: 360virtualview | floor plans **from £20** each | *(snippet)* | https://360virtualview.co.uk |
| UK: MyConstructor | "£400–£6,000" | *(snippet, outlier)* | https://myconstructor.co.uk/services/3d-floor-plan |

### 6.2 3D renders (still images)
| Source | Price | URL |
|---|---|---|
| Maverick Frame, "Best 3D Rendering Companies in Spain" (Jul 2026) | **€150–€600 per still exterior** in Spain; interiors and premium studios higher | https://maverickframe.com/blog/best-3d-rendering-companies-in-spain/ |
| RealSpace 3D (2026) | $300–$3,000 per image; house $399–$1,500; interior $600–$1,500; exterior $800–$2,500; aerial $1,000–$3,000; animation $4,000–$12,000 per minute; extra revision round $100–$400 | https://www.realspace3d.com/resources/3d-rendering-pricing-guide/ |
| Google AIO ("3d visualisation for property developers spain") | **€300–€2,500 per image** | — |
| Google AIO ("3d rendering costa del sol") | Luxury villa packages (6 exteriors + 4 interiors) "from **€2,500**" (attributed to Viseni; not visible on viseni.com) | — |
| CYLIND | House $1,000–$3,000 per image *(snippet)* | https://www.cylind.com |
| Omegarender | Average $1,500 per image; $8,000 per minute of animation *(snippet)* | https://omegarender.com |
| Vibe3D | $150–$2,800 per image *(snippet)* | https://vibe3d.ai |
| Pelicad | $700–$1,500 *(snippet)* | https://www.pelicad.com/blog/rendering-services-cost |
| NoTriangle Studio | $250–$5,000+ per still; 3D floor plan $250–$1,200 *(snippet)* | https://notrianglestudio.com |
| **Vista Studio (Spain, competitor)** | Pack Render **€129 per property** (6 rooms), Walkthrough **€290**, Signature **€390**, extra room €8, ex-VAT | https://vistastudiodesign.com/ |

### 6.3 Virtual staging
| Source | Price | URL |
|---|---|---|
| Maverick Frame guide (Jul 2026) | AI $3–$15 per image; human $20–$50; premium $50–$100+; full listing $60–$300 | https://maverickframe.com/blog/virtual-staging-cost/ |
| BoxBrownie | **€30 per image** (EU page); 360° staging €60; US$24 on the US page | https://www.boxbrownie.com/floor-plans · https://www.boxbrownie.com/virtual-staging |
| Bella Virtual | $37 per photo, 24–48 h | https://www.bellavirtual.com/pages/3d-floor-plans |
| Virtual Staging AI | $16/month for 6 photos ($2.67 per photo); $19/month for 20 photos | https://www.virtualstagingai.app/prices |
| Google AIO ("virtual staging spain") | Spanish AI tools (ImmoStage, Rehavitat, Pedra) **€2–€49 per image** | — |
| Google AIO ("virtual staging price") | AI $0.25–$3; human $20–$150+; physical staging **$1,500–$5,000+** | — |
| Lift My Place (Spain) | from €0.60 per image; €19–€199/month (see 01-competidores) | https://liftmyplace.com |

### 6.4 Interactive 3D, tours and AR
| Source | Price | URL |
|---|---|---|
| R2U (Apr 2026) | Browser-based 3D Sales Platform **from ~$2,700**; Apple Vision Pro sales-gallery experience from ~$5,400; 3–10 weeks and 4–14 weeks | https://r2u.io/en/blog/ar-staging-cost-real-estate-2026/ |
| Matterport (third-party 2026 summaries) | Free (1 space), Starter ~$9.99/month, Professional ~$69/month, Business $309+/month; add-ons billed separately | https://sofabrain.com/learn/matterport-pricing/ · https://3dtourmaker.com/matterport-pricing |
| see3d.ai (UK) | "Matterport charges from £39/month just to host your tours" *(snippet)* | https://www.see3d.ai |
| Kroscloud | Positions itself as cheaper than Matterport ($69–$309/month); free plan | https://www.kroscloud.com/compare/matterport-alternative |
| Viseni (Marbella) | No public prices; renders 2–4 weeks, VR 3–5 weeks, interactive models 6–10 weeks (see 01-competidores) | https://www.viseni.com/renders-3d |

**What this means for pricing.** A static 3D floor plan is a commodity at €40–€120. A single render in Spain costs €150–€600. Interactive platforms start at about $2,700 per project. **Our bundle (real model + viewer + AR + renders, in days) sits in an empty middle band.** Publish "from" prices so we get cited in price answers, and justify them against the €2,700+ interactive/AR anchors, not against €40 floor plans. The client sets the final figures.

---

## 7. FAQ bank (English, 37 questions)

(PAA) marks a question seen verbatim in Google People Also Ask. Answers should open with a direct, 1–2 sentence reply for GEO, then give detail. Use `FAQPage` JSON-LD on `/en/faq/` and on each service page with its own subset. Don't duplicate the same FAQ block across pages.

**Service and process**
1. How do you convert a 2D floor plan into a 3D model? *(adapted from the PAA "How to convert 2D floor plan to 3D floor plan?")*. Answer: we read the plan, then model it in Blender with Python scripts, with walls, openings, furniture and materials, then render and export.
2. Can you create a furnished 3D model from a single floor plan, without interior photos?
3. Can you build the 3D model from photos only, if there is no floor plan?
4. What files can I send: PDF, JPG, DWG, or a photo of a brochure plan?
5. How accurate is a 3D model built from a floor plan? Answer: measurements are taken from the plan's scale; we state tolerances and use measured plans when available.
6. Do you need to visit the property?
7. How long does it take to turn a floor plan into a 3D model? *(related PAA: "How long does a rendering take?")*
8. What happens if the plan changes? How fast are revisions? Answer: the model is generated by code, so changes rebuild in minutes.

**Deliverables**
9. What is the difference between a 3D floor plan, a 3D render and an interactive 3D model?
10. What is 3D rendering in real estate? (PAA)
11. What is an interactive 3D floor plan, and how do buyers use it?
12. Can I embed the 3D viewer on my website and in my property listings?
13. What is the cut-away (dollhouse) view?
14. What is AR in real estate? (PAA)
15. How can buyers view a property in augmented reality without downloading an app?
16. Which phones and tablets support AR viewing (iPhone/iPad AR Quick Look; Android Scene Viewer)?
17. Can buyers walk through the home at real size in AR, or see it as a tabletop model?
18. What is virtual staging? (PAA)
19. How is 3D virtual staging different from AI virtual staging on photos?
20. Can you show the same property in different furniture styles or finishes?

**Pricing and timing**
21. How much does a 3D floor plan cost? (PAA)
22. How much should a 3D rendering cost? (PAA)
23. How much does virtual staging cost? (PAA)
24. Is 3D visualisation worth it for a property that is already built? *(adapted from the PAA "Is house rendering worth the cost?")*
25. Do you offer volume pricing for agencies, or for developments with several unit types?

**Off-plan and developers**
26. How do I sell my off-plan property faster with 3D? *(adapted from the PAA "How do I sell my off-plan property?")*
27. Can you model every unit type in a new development, and keep them consistent?
28. Can foreign buyers explore an off-plan home remotely before travelling to Spain?

**AI and technology**
29. Can ChatGPT do architectural renderings? (PAA)
30. Can I use an AI to convert my floor plan into a 3D model? (PAA)
31. Will AI replace 3D rendering? (PAA)
32. What software do you use? Answer: Blender with Cycles, Python automation, Claude for scripting, Google model-viewer, glTF/GLB and USDZ.
33. What can I use instead of Matterport? (PAA). Answer: when a 3D scan isn't possible (off-plan, tenanted, abroad), a model built from the plan.

**Rights, markets and practicalities**
34. Who owns the 3D model, renders and AR files, and can I use them on any portal?
35. Do you use stock 3D assets or textures with licensing restrictions? Answer: no. Textures are procedural PBR created per project.
36. Should virtually staged images be labelled in property listings? Answer: best practice is yes; mark them "virtually staged". This is not legal advice.
37. Do you work outside the Costa del Sol and outside Spain, and is the viewer available in several languages?

---

## 8. Recommendations

### 8.1 SEO (on-page and technical, EN-specific)
1. **Service pages target modifiers, not head terms.** Put "service", "for real estate", "for estate agents", "Spain", "Marbella" and "off-plan" in the H1 and title. Win the head terms ("floor plan to 3D", "virtual staging") through C8/C11 guides and the case study.
2. **Put a live demo above the fold on every service page.** Use a poster image first (LCP-safe). Load `<model-viewer>` lazily on interaction or when visible, and keep the GLB off the critical path. Put the AR button and a QR code on the AR page. Core Web Vitals come first: no 3D in the LCP element, and reserve dimensions to avoid CLS.
3. **Answer-first copy.** Each H2 is phrased as a question and opens with a 40–60 word direct answer. Include price and turnaround tables in HTML, not in images.
4. **Structured data per page:** `Organization` (plus `sameAs` once profiles exist), `WebSite`, `Service` (`serviceType`, `areaServed`: Spain, Andalucía, Marbella…; `offers` with `PriceSpecification` "from"), `FAQPage`, `BreadcrumbList`, `VideoObject` (demos), and **`3DModel`** (schema.org, with `encoding` → `MediaObject` GLB/USDZ) on the case study. `3DModel` is a rare, distinctive signal. Use `HowTo`-style markup on how-it-works for semantics only, since Google no longer shows HowTo rich results.
5. **hreflang:** paired pages only, `x-default` → EN (see §4), plus a sitemap with `xhtml:link` alternates, reusing the transfermalaga generator pattern.
6. **British English copy, with US variants in body and FAQs.** Never use "rendering" alone for the service (F6).
7. **Local:** set up a Google Business Profile as a service-area business if a real address exists, with categories like "3D rendering service" or "Graphic designer"; confirm which categories are available. Build NAP-consistent citations (Clutch, Houzz, Kyero partner directory if one exists, Marbella business directories). Put English reviews from international agencies on the site.

### 8.2 GEO (being cited by ChatGPT, Claude, Perplexity, Gemini and Copilot)
1. **`/llms.txt`** with an English section: who we are, the one-line offer, services with EN URLs, the case study URL, the pricing URL, service area, turnaround, and contact. Optionally add `/llms-full.txt` with the FAQ in plain text. Use `robots.txt` to allow GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot and Applebot-Extended.
2. **Bing Webmaster Tools and IndexNow.** ChatGPT search and Copilot rely heavily on Bing's index; submit the EN sitemap on day 1.
3. **Get listed where AIOs source their names (F3):**
   - Pitch Maverick Frame's "Best 3D Rendering Companies in Spain" with the case study plus a unique angle (AR, no app, from a plan).
   - Claim or complete the RevenueBase company profile.
   - Create a Clutch profile.
   - Get listed in archviz directories.
   - Publish on Behance and ArtStation, which rank in the SERPs.
   - Get a YouTube channel with EN demos.
4. **Keep entity facts consistent** everywhere (site, llms.txt, directories, YouTube, LinkedIn): the same one-sentence description, service area, founding year and deliverables. Once the brand exists, write one canonical sentence, for example: "{{BRAND}} turns 2D floor plans into photorealistic 3D models, renders, web viewers and no-app AR for real estate in Spain."
5. **Citable numbers:** publish our own data honestly, for example "12 rooms, 39 procedural textures, one work session" from the case study. Give turnaround and price "from" figures. Add a dated "Updated September 2026" line to guides.
6. **Own the AI question.** C11 is the page an LLM will quote for "can AI turn a floor plan into 3D?". Make it neutral, tested and specific.
7. **Reddit and forums:** answer real questions in r/RealEstatePhotography ("Convert 2D floor plan into 3D", "Matterport alternatives") and r/archviz from a named account. No spam. These threads rank in Google and feed LLMs.

### 8.3 Paid test (optional)
- A small EN Google Ads campaign in Spain, UK, NL and DE on exact and phrase service long-tails: "floor plan to 3d model service", "3d floor plans for estate agents", "off plan 3d visualisation spain", "3d rendering marbella". Exclude "free", "ai", "app", "software", "download", "tutorial", "sketchup" and "course" as negatives. Archevio is the main advertiser to benchmark against.

### 8.4 Other languages (after EN)
| Language | Evidence | Recommendation |
|---|---|---|
| **Dutch (`/nl/`)** | Dutch buyers were 6.94 % of foreign purchases in Málaga in Q2 2026 and nearly overtook the British. Dutch transactions grew about 50 % from 2023 to 2025. "3d plattegrond laten maken" is a real query. | **Phase 3, first**: about 6 pages (home, floor-plan-to-3d, off-plan, pricing, case, contact), human-written. |
| **German (`/de/`)** | German buyers were 6.11 % of foreign purchases in Málaga in Q2 2026 and 6.65 % nationally. "3d grundriss erstellen lassen" is a real query. | **Phase 3, second**, with the same 6-page set. |
| Swedish / Norwegian / Danish | A large Nordic community on the Costa del Sol, but high English proficiency among B2B buyers. "3d planritning" shows thin demand. | No full site. Offer **multilingual viewer UI and room labels** (EN/ES/DE/NL/SV/NO/DA) as a product feature for agencies' listings. Revisit with GSC data. |
| French (`/fr/`) | French buyers are 4.93 % and Belgians 4.38 % nationally. The Costa del Sol focus is weaker. | Later (phase 4), or only if leads show demand. |

The product feature matters more than extra site languages in the short term: **"a viewer and AR in your buyer's language" is a selling point for international agencies.**

---

## 9. Risks and caveats
- **No verified search volumes.** Demand tiers are inferred. Validate them before ad spend and reprioritise after 8–12 weeks of Search Console data.
- **Head-term realism.** Ranking for "floor plan to 3D" or "virtual staging" against Planner 5D, Homestyler, floor-plan.ai, BoxBrownie and Virtual Staging AI is a 12+ month effort, and the traffic is largely DIY with low lead value.
- **Local pack eligibility** needs a verifiable address. Without one, local visibility depends on organic results and citations.
- **Anonymised case study.** The source plan came from a third-party listing. Show only a redrawn plan, never the original image. Give no address, agency or listing ID. Present measurements as estimates.
- **Portal embeds.** Don't promise iframe embeds inside Idealista, Rightmove or Kyero. Promise "your website plus a link in the portal's virtual-tour or video field" unless each portal's policy is verified.
- **Price anchors** from AIO snippets (for example Viseni's "from €2,500") are not verified on source pages. Don't cite them publicly as a competitor's price.
- **Thin-content and hreflang errors** are the main technical risks of a reduced EN set. Enforce pairing in the generator and in `check.js`.
- **SERP volatility.** AIOs and PAA change weekly. Re-run this SERP capture quarterly.

---

## 10. Sources

**SERPs captured** (Google, 2026-09-28, `hl=en`, `gl=es` unless noted): 2d floor plan to 3d model service · floor plan to 3d · 3d floor plan rendering service · real estate 3d rendering spain · 3d rendering marbella · architectural visualization marbella · off plan property 3d visualisation · virtual staging spain · virtual staging price · augmented reality real estate · how much does a 3d rendering cost · 3d model of house from floor plan · interactive 3d floor plan real estate · 3d rendering costa del sol · matterport alternative without site visit · 3d floor plans for estate agents (`gl=uk`) · virtual staging marbella · 3d rendering malaga · virtual tour from floor plan · view house in augmented reality floor plan · how much does a 3d floor plan cost · 3d visualisation for property developers spain · 3d floor plans real estate · virtual staging real estate · 3d rendering for real estate · how to sell off plan property · buying off plan in spain · augmented reality property marketing (`gl=uk`) · architectural rendering cost per image (`gl=uk`) · virtual staging (`gl=uk`) · 3d floor plan for holiday rental listing · ai property video from renders real estate · company to convert floor plans into 3d models spain · cgi for property developers (`gl=uk`) · 3d floor plan services (`gl=uk`).

**Autocomplete** (suggestqueries.google.com): "floor plan to 3d ", "3d floor plan ", "3d floor plan service", "virtual staging ", "3d rendering real estate ", "off plan property ", "augmented reality real estate ", "3d rendering marbella", "new build marbella ", "3d grundriss erstellen lassen" (de), "3d plattegrond laten maken" (nl), "3d planritning" (sv), "plan 3d maison a partir d'un plan 2d" (fr).

**Market data**
- https://justrealestate.es/foreign-buyers-in-malaga-q2-2026 (Registradores, Málaga Q2 2026)
- https://www.idealista.com/en/news/property-for-sale-in-spain/2026/02/25/885160-british-german-and-dutch-buyers-lead-spain-s-international-property-market
- https://www.idealista.com/en/news/property-for-sale-in-spain/2026/02/11/883167-foreign-buyers-near-100-000-home-purchases-in-spain-in-2025

**Pricing and competitors**
- https://vistastudiodesign.com/
- https://maverickframe.com/blog/best-3d-rendering-companies-in-spain/
- https://maverickframe.com/blog/virtual-staging-cost/
- https://www.realspace3d.com/resources/3d-rendering-pricing-guide/
- https://www.ritn3d.com/blog/how-much-does-3d-floor-plan-cost/
- https://www.boxbrownie.com/floor-plans
- https://www.bellavirtual.com/pages/3d-floor-plans
- https://the2d3dfloorplancompany.com/pricing/3d-floor-plan/
- https://www.cadcrowd.com/blog/3d-floor-plan-rendering-services-for-companies-costs-rates-and-pricing/
- https://roomagen.com/tools/3d-floor-plan-cost
- https://www.virtualstagingai.app/prices
- https://r2u.io/en/blog/ar-staging-cost-real-estate-2026/
- https://sofabrain.com/learn/matterport-pricing/
- https://3dtourmaker.com/matterport-pricing
- https://www.kroscloud.com/compare/matterport-alternative
- https://www.viseni.com/renders-3d
- https://www.inmueblemedia.com/off-plan-visualisation
- https://planner5d.com/ai/floor-plan-to-3d-model
- https://cedreo.com/floor-plans/convert-2d-floor-plan-to-3d/
- https://edensign.io/2d-to-3d
- https://floor-plan.ai/floor-plan-to-3d
- https://www.wearefoc.com/3d-rendering
- https://improntia.com/3d-renders-architecture-marbella-malaga-new-buildings.php
- https://townvisuals.com/about
- https://visengine.com/augmented-reality/
- https://www.onirix.com
