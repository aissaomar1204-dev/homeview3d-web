# 02 · Keywords y SERP en español (España): plano 2D a 3D, renders, visor 3D, AR y home staging

> Fecha: 2026-09-28 · Mercado: España (google.es, `hl=es&gl=es`).
> **Método:**
> 1. Muestreo manual de **33 SERPs reales de google.es**, con extracción de resultados orgánicos, anuncios, PAA (las 4 primeras visibles), búsquedas relacionadas y features. Google geolocalizó la sesión en Andalucía interior: aparecían sugerencias del tipo «…cerca de Córdoba / Puente Genil». Tras unas 33 consultas Google mostró un CAPTCHA; **no se intentó saltarlo** y el muestreo se paró ahí.
> 2. Autocompletado de Google (suggestqueries) para 20 semillas.
> 3. WebSearch y WebFetch para páginas de precios, portales y competidores.
>
> **Limitaciones:** los conectores de Ahrefs y Similarweb no están autorizados en esta sesión, así que **no hay volúmenes numéricos**. La demanda se estima de forma cualitativa (alta/media/baja) a partir de estas señales: número de anunciantes, riqueza del autocompletado, búsquedas relacionadas y tipo de resultados. Hay que validarla con Keyword Planner, Ahrefs o GSC.
> El contenido de terceros se ha tratado como datos. Las PAA se copian **literalmente** (marcadas con [PAA]).
> Este documento complementa `01-competidores.md`.

---

## 0. Resumen ejecutivo

1. **La cabeza «plano 2D a 3D / convertir plano en 3D» NO es comercial en español.** El autocompletado lo confirma: «convertir plano 2d a 3d online **gratis**», «…**con ia**», «plano 3d online gratis», «plano de casa en 3d gratis». En la SERP mandan software y DIY: Cedreo, Planner 5D, Coohom, ideal.house, home.by.me, Reddit, YouTube e IA (Rendair, ReRender, Ovacen). Tiene mucho volumen y convierte poco. **La estrategia es captar esta demanda con una guía honesta** («cómo convertir un plano 2D en 3D: gratis, con IA o con un estudio») y llevarla a la página de servicio. La página de servicio apuntará a los modificadores comerciales: «para inmobiliarias», «amueblado», «fotorrealista», «precio», «servicio».
2. **El dinero está en «renders / infografías para inmobiliarias y promotoras».** «empresa de renders inmobiliarios» tenía **6 anunciantes** (behindpictures, rengix, visualfabrik, fireflies, realrendering, ararenders). Además, «renders para inmobiliarias» y «renders para arquitectos» salen en el autocompletado. La competencia es de dificultad media: muchos estudios, pero ninguno domina. **P1.**
3. **La PAA más repetida de todo el nicho es «¿Cuánto cuesta un render en España?»**, que aparece en 6 SERPs distintas (render 3D inmobiliaria, render 3D Málaga, Valencia, Alicante, renders para promotoras, empresa de renders). **Una guía de precios de mercado con fuentes y fecha es el activo SEO y GEO número 1.**
4. **«Realidad aumentada inmobiliaria» tiene dificultad baja y volumen bajo.** Salen blogs de Paraguay y México y artículos genéricos, no hay anuncios y el autocompletado no da long-tail. Nadie en España vende «AR sin app desde el plano» (Mayo Infografía e Iris360 usan app). **Es la mayor oportunidad GEO**: si un LLM responde «¿quién hace realidad aumentada de viviendas sin app en España?», debe citarnos.
5. **Home staging virtual: volumen alto y competencia alta, muy comoditizada por la IA.** Hay SaaS a 0,3–5 €/imagen (Pedra a 29 €/mes) y AI Overview en la cabeza. idealista tiene su propio «Virtual Home Staging». Aquí no hay que ganar la cabeza, sino el long-tail diferencial: home staging sobre **modelo 3D coherente entre vistas**, obra nueva sin amueblar y AR.
6. **Las SERPs locales de la Costa del Sol son débiles.** «render 3D Marbella» devuelve Instagram, Behance, marbella.studio (interiorismo), 3dojo y freelancers. «render 3D Málaga» devuelve Milanuncios, Instagram y un directorio. **Marbella, Málaga y Costa del Sol son P1 locales de dificultad baja**, siempre con contenido único. El pack local aparece en «infografías 3D Málaga» y «render 3D Alicante», así que hace falta un Google Business Profile (área de servicio).
7. **Los vídeos, los vídeos cortos y el pack de imágenes aparecen en casi el 100 % de las SERPs.** Producir vídeos cortos del visor y de la AR (YouTube Shorts / Reels con VideoObject) no es opcional.
8. **Riesgo de producto y copy:** idealista **solo acepta proveedores multimedia compatibles** para 3D y tour virtual; las guías de terceros lo confirman con envío a su gestor. «Insertable en anuncios de portales» hay que matizarlo: web propia, enlace, QR, WhatsApp y portales donde se admita.

---

## 1. Clusters de keywords (con prioridad, intención, SERP y URL objetivo)

Leyenda de **intención**: T = transaccional, C = comercial (investigación), I = informacional, N = navegacional.
Leyenda de **demanda estimada**: Alta / Media / Baja, estimada de forma cualitativa (ver método).
Leyenda de **dificultad**: Baja / Media / Alta, valorando quién rankea, su antigüedad y su profundidad de contenido.

### Tabla resumen

| # | Cluster | Keyword principal | Intención | Demanda | Dificultad | Prioridad | URL objetivo |
|---|---|---|---|---|---|---|---|
| C1 | Plano 2D a 3D (servicio) | plano 3D para inmobiliarias / convertir plano en 3D | C/T (cola) · I/DIY (cabeza) | Alta (cabeza) · Baja-Media (cola) | Alta (cabeza) · Baja (cola) | **P1** | `/servicios/plano-2d-a-3d/` |
| C1b | Plano 2D a 3D (DIY/IA) | cómo convertir un plano 2D a 3D | I | Alta | Media | **P1** | `/guias/como-convertir-un-plano-2d-en-3d/` |
| C2 | Renders / infografías inmobiliarias | renders para inmobiliarias / render 3D inmobiliaria | C/T | Media-Alta | Media-Alta | **P1** | `/servicios/renders-inmobiliarios/` |
| C3 | Promotoras / obra nueva / venta sobre plano | renders para promotoras / infografías 3D obra nueva | C/T | Media | Media | **P1** | `/soluciones/promotoras-obra-nueva/` |
| C3b | Piso piloto virtual | piso piloto virtual | C | Baja-Media | Baja-Media | **P2** (P1 si hay presupuesto) | `/servicios/piso-piloto-virtual/` |
| C4 | Tour virtual 3D / visor | tour virtual 3D inmobiliaria | C/T | Media | Media-Alta (SaaS) | **P1** | `/servicios/tour-virtual-3d/` |
| C4b | Alternativa a Matterport | alternativa a Matterport | C | Baja | Baja-Media (en ES) | **P2** | `/comparativas/alternativa-a-matterport/` |
| C5 | Realidad aumentada inmobiliaria | realidad aumentada inmobiliaria | I/C | Baja | **Baja** | **P1** (GEO) | `/servicios/realidad-aumentada-inmobiliaria/` |
| C6 | Home staging virtual | home staging virtual (para inmobiliarias) | C/T + DIY-IA | **Alta** | **Alta** | **P1** servicio / P2 cabeza | `/servicios/home-staging-virtual/` |
| C7 | Precios (mercado) | cuánto cuesta un render 3D / precio render en España | I/C | Media-Alta | Media | **P1** | `/guias/cuanto-cuesta-un-render-3d/` (+ satélites) |
| C7b | Precios propios | precios plano 3D / tarifas renders inmobiliarios | T | Media | Media | **P1** | `/precios/` |
| C8 | Locales Costa del Sol | render 3D Marbella / infografías 3D Málaga | C/T | Baja-Media | **Baja** | **P1** | `/zonas/marbella/`, `/zonas/malaga/`, `/zonas/costa-del-sol/` |
| C8b | Locales resto de España | render 3D Madrid / Alicante / Barcelona / Valencia | C/T | Media | Baja (Alicante) · Media (Madrid, BCN) | P2/P3 | `/zonas/{ciudad}/` |
| C9 | Portales | tour virtual idealista / plano 3D idealista | N/I | Media | n/a (idealista) | **P2** | `/guias/como-publicar-un-tour-3d-en-idealista-y-fotocasa/` |
| C10 | IA y vídeo inmobiliario | vídeo inmobiliario con IA / qué IA genera renders | I/C | Media (en alza) | Media-Alta | P2 (guía) · P3 (servicio) | `/guias/ia-o-modelo-3d-real/` |
| C11 | Arquitectos / visualización | renders para arquitectos / visualización arquitectónica | C/I | Media | Media-Alta | **P2** | `/soluciones/arquitectos-interioristas/` |
| C12 | Fuente del plano | dónde conseguir los planos de mi casa | I | Alta | Media | **P2** | `/guias/donde-conseguir-el-plano-de-una-vivienda/` |
| C13 | Alquiler vacacional | tour virtual apartamento turístico / fotos Airbnb | C | Baja-Media | Baja-Media | P3 | `/soluciones/alquiler-vacacional/` |

---

### C1 · Plano 2D a 3D (servicio) — **P1** → `/servicios/plano-2d-a-3d/`

- **Keywords objetivo (servicio):** convertir plano en 3D para inmobiliaria · plano 2D a 3D vivienda · plano 3D amueblado · plano 3D vivienda · planos 3D para inmobiliarias · modelo 3D desde plano · renders a partir de planos · plano 3D fotorrealista · pasar plano a 3D profesional · plano 3D precio · plano 3D obra nueva.
- **Sinónimos que hay que usar en el copy:** «plano 3D», «plano en 3D», «planta 3D», «plano de planta 3D», «vista cenital 3D», «dollhouse» / «casa de muñecas», «maqueta virtual».
- **Autocompletado:** «plano 3d casa», «plano 3d online gratis», «plano 3d gratis», «plano de casa en 3d con inteligencia artificial», «plano de casa 3d con tres habitaciones cocina y closet», «convertir plano 2d a 3d online gratis con ia», «convertir plano pdf a 3d online gratis».
- **Intención:** la cabeza es DIY/herramienta (I) y la cola con «para inmobiliarias / precio / amueblado» es comercial (C/T).
- **Quién rankea (google.es, 28-09-2026):**
  - «convertir plano en 3D»: Reddit, YouTube (tutoriales de AutoCAD), foros, Cedreo (imágenes). Anuncio: BricsCAD (octave.com).
  - «plano 2D a 3D»: Reddit, powerkh, simio, corestudiobim, haztek (BIM).
  - «plano 3D vivienda»: magnific (imágenes de stock), Planner 5D, Houzz Pro, Pinterest, LiDAR.
  - «plano 3D amueblado»: Planner 5D, **maverickframe (render de planos amueblados)**, Coohom, Cedreo, ideal.house, home.by.me, magnific.
  - «planos 3D para inmobiliarias»: Floorfy (anuncio y orgánico), estudiotallergrafico, cloudpano, pedra.ai, dotsmaps.
  - «renders a partir de planos»: ideal.house, ReRender AI, Ovacen, Rendair, archivinci, renders.es, pedra.ai. Anuncios: rendair.ai, octave, adobe, projectum.
- **Features:** PAA, vídeos + vídeos cortos (siempre), pack de imágenes (siempre), anuncios en variantes con «render».
- **PAA recogidas:**
  - [PAA] ¿Cómo puedo generar un plano en 3D?
  - [PAA] ¿Qué programa gratuito puedo usar para crear planos 3D?
  - [PAA] ¿Cómo puedo convertir un plano 2D a 3D gratis?
  - [PAA] ¿Qué IA puede generar planos 3D?
  - [PAA] ¿Qué IA convierte dibujos en modelos 3D?
  - [PAA] ¿Cómo hacer un plano de mi casa en 3D?
  - [PAA] ¿Dónde puedo encontrar planos 3D de casas?
  - [PAA] **¿Cuánto vale hacer una casa en 3D?**
  - [PAA] ¿Qué aplicación gratuita puedo usar para hacer planos de casa en 3D?
  - [PAA] ¿Dónde hacer planos en 3D gratis?
  - [PAA] ¿Cuál es el mejor programa gratuito para hacer planos de casas?
  - [PAA] ¿Cómo puedo hacer un render desde un plano?
- **Dificultad:** la cabeza es **Alta** (marcas SaaS con mucha autoridad, contenido en muchos idiomas); la cola de servicio es **Baja**, porque casi ningún estudio español tiene una página dedicada a «plano → modelo 3D navegable + AR».
- **Ángulo ganador:** «Desde un único plano 2D, sin fotos ni visita: modelo 3D amueblado, renders, visor web y AR». Hay que diferenciarlo de las herramientas DIY y de la IA (que generan una imagen, no un modelo medible y coherente).

### C1b · Cómo convertir un plano 2D en 3D (guía DIY/IA) — **P1** → `/guias/como-convertir-un-plano-2d-en-3d/`

- Capta el volumen DIY y las PAA sobre IA. Debe ser **honesta**: comparar programas gratis (Planner 5D, Sweet Home 3D, SketchUp), herramientas de IA y un estudio profesional, con una tabla de «qué obtienes / tiempo / precisión / uso comercial». El CTA va hacia el servicio.
- Sirve también de respuesta GEO a «¿Qué IA puede generar planos 3D?», con un matiz propio: la IA genera imágenes y un estudio genera un modelo 3D real, medible y reutilizable (renders + visor + AR + staging).

### C2 · Renders / infografías inmobiliarias — **P1** → `/servicios/renders-inmobiliarios/`

- **Keywords:** render 3D inmobiliaria · renders inmobiliarios · renders para inmobiliarias · infografía 3D inmobiliaria · infografías 3D · renders fotorrealistas vivienda · render 3D casa · render interior vivienda · render exterior villa · renders proyectos inmobiliarios · empresa de renders inmobiliarios · estudio de renders.
- **Autocompletado:** «renders inmobiliarios», «renders proyectos inmobiliarios», «renders para desarrollos inmobiliarios» (LatAm), «renders para inmobiliarias», «renders para arquitectos», «render 3d arquitectura», «render 3d casa», «render 3d realista», «infografia 3d arquitectura».
- **Intención:** C/T.
- **Quién rankea:**
  - «render 3D inmobiliaria»: gammarender, behindpictures, domingoloro, luft-render (x2), davantstudio, osogordo-lab, envato. Anuncios: rengix.es, behindpictures.
  - «infografía 3D inmobiliaria»: 3detail, luft-render, infografista3d (páginas por ciudad), ladinamo, arquitecturas3d, innovados, domingoloro, delineanteinfografia3d. Anuncio: floorfy.
  - «empresa de renders inmobiliarios»: renders.es, vimapstudio, davantstudio, lobostudio, domingoloro, behindpictures, lavoltastudio, biverso, weaversight. **Anuncios: behindpictures, firefliesrenders, visualfabrik, realrendering.agency, rengix, ararenders.** Hay panel de empresa (knowledge panel) de un estudio.
- **Features:** PAA, vídeos, imágenes, anuncios (2–6), panel de empresa local.
- **PAA:**
  - [PAA] **¿Cuánto cuesta un render en España?**
  - [PAA] ¿Qué es el render 3D?
  - [PAA] ¿Dónde hacer renders gratis?
  - [PAA] ¿Cuánto cobrar renders?
  - [PAA] ¿Cuánto se cobra por renders?
  - [PAA] ¿Cuál es la mejor IA para crear renders?
  - [PAA] ¿Qué es una infografía 3D?
- **Búsquedas relacionadas:** Empresa de renders arquitectura · Render Estudio · Renders interiorismo · Renders Barcelona · Empresas de diseño de interiores en España.
- **Dificultad:** **Media-Alta**. Hay muchos estudios con portfolios y blogs de años (domingoloro lleva más de 25 años con cientos de URLs de portfolio), pero ninguno domina todas las SERPs.
- **Nota de vocabulario:** en España, promotoras y arquitectos dicen «**infografía 3D**» y las agencias dicen «**render**». Hay que usar ambos términos (H1 con «renders» y H2 o párrafo con «infografías 3D»).

### C3 · Promotoras, obra nueva y venta sobre plano — **P1** → `/soluciones/promotoras-obra-nueva/`

- **Keywords:** renders para promotoras · renders promociones inmobiliarias · infografías 3D obra nueva · marketing inmobiliario obra nueva · maqueta virtual promoción inmobiliaria · maqueta 3D interactiva · tour virtual obra nueva · vender viviendas sobre plano · preventa inmobiliaria renders · catálogo comercial promoción.
- **Quién rankea:**
  - «renders para promotoras»: biverso, domingoloro, behindpictures, weaversight, inmoblog, grup3d, gammarender, vimapstudio (renders con IA). Anuncio: behindpictures.
  - «infografías 3D obra nueva»: gammarender, domingoloro, 3dojo, maverickframe, dinpro, proyecto3dvalencia, **viseni (Málaga)**, Instagram.
  - «maqueta virtual promoción inmobiliaria»: imascono, activitas, iris360studios, unexia, areadesign, Instagram, riunet (TFG sobre AR). Anuncios: floorfy, virtualmente.
  - «tour virtual obra nueva»: homestagerdesign, framearq, viviendasnuevas (portal), gralusa, lujama, idealista (cómo crear tours 360).
  - «venta sobre plano»: **SERP legal/de consumidor** (abogados: garberipenal, inmoabogados, beneyto, favelegal; apivirtual; soloarquitectura) más promotoras de Marbella y Estepona (mpdunne, thepropertyagent).
- **PAA:**
  - [PAA] ¿Cómo funciona la compra de vivienda sobre plano?
  - [PAA] ¿Cómo se paga un piso comprado sobre plano?
  - [PAA] ¿Cuánto pagan por hacer renders?
  - [PAA] ¿Qué IA genera renders?
  - [PAA] ¿Cuál es el mejor CRM para inmobiliarias?
- **Dificultad:** Media. «venta sobre plano» sola **no es nuestra intención** (es de compradores o litigios), así que se ataca con una guía B2B: `/guias/como-vender-viviendas-sobre-plano/`.
- **Aviso:** «maqueta 3D vivienda» devuelve **maquetas físicas o kits de madera y spam**. Hay que usar «maqueta virtual», «maqueta digital» o «maqueta 3D interactiva», nunca «maqueta 3D» a secas como keyword principal.

### C3b · Piso piloto virtual — **P2** → `/servicios/piso-piloto-virtual/`

- **SERP:** domingoloro (#1, «Piso piloto virtual 3D»), **proyecto3dvalencia («Piso piloto virtual o físico: comparativa de coste y resultado»)**, viacelere, neinorhomes (tour Panotour), framearq, cosasdearquitectos, nuevosvecinos (foro).
- **PAA:** [PAA] ¿Qué son los pisos pilotos? · [PAA] ¿Qué son las casas piloto?
- **Dificultad:** Baja-Media. Encaja al 100 % con el producto (modelo + staging + visor + AR sin construir el piso piloto). Guía satélite: `/guias/piso-piloto-virtual-vs-fisico/`.

### C4 · Tour virtual 3D / visor interactivo — **P1** → `/servicios/tour-virtual-3d/`

- **Keywords:** tour virtual 3D inmobiliaria · tour virtual inmobiliaria · tour virtual para inmobiliarias · tour virtual inmobiliaria precio · recorrido virtual vivienda · visita virtual vivienda · visita virtual 3D · maqueta 3D interactiva · visor 3D vivienda · tour virtual sin visita / desde plano.
- **Autocompletado:** «tour virtual inmobiliaria precio», «tour virtual 360 inmobiliaria», «tour virtual para inmobiliarias». «visita virtual» a secas es de museos, así que **no sirve sola**.
- **Quién rankea:**
  - «tour virtual 3D inmobiliaria»: imascono, pixeldreams, rimontgo, whiterock.studio, YouTube, atrioinmobiliaria, mrhouse. Anuncios: maquetas.tech, rengix.
  - «recorrido virtual vivienda»: v3darq, npsys, **5 vídeos de YouTube** (SERP muy de vídeo).
  - «planos 3D para inmobiliarias»: Floorfy, cloudpano (SaaS).
- **PAA:**
  - [PAA] ¿Cómo puedo generar un recorrido virtual?
  - [PAA] ¿Cómo hacer un tour virtual 360 gratis?
  - [PAA] ¿Cuál es el mejor programa para crear recorridos virtuales?
  - [PAA] ¿Qué IA puedo usar para hacer recorridos virtuales?
- **Dificultad:** Media-Alta. La cabeza es de SaaS 360 (Floorfy, Matterport, 3DVista, CloudPano) y de fotógrafos.
- **Ángulo:** «Tour 3D **sin visita y sin cámara**: desde el plano. Ideal para obra nueva, viviendas ocupadas o propietarios en el extranjero». Incluye recorrido guiado, lista de estancias, **modo maqueta** (corte de muros a 1,15 m) y control de luz.
- **Naming:** en la página hay que usar «tour virtual 3D», «visita virtual 3D», «recorrido virtual» y «maqueta 3D interactiva». idealista lo llama «visita virtual» y Fotocasa «visita virtual 3D / tour virtual».

### C4b · Alternativa a Matterport — **P2** → `/comparativas/alternativa-a-matterport/`

- **SERP:** Reddit r/3DScanning, G2, hugepano, kamaradas, splattour, panoee, docusketch (en inglés o traducido). **Anuncios: matterport.com y floorfy.com.**
- **PAA:** [PAA] ¿Cuánto vale Matterport? · [PAA] ¿Qué cámaras son compatibles con Matterport? · [PAA] ¿Qué es Matterport y para qué se utiliza? · [PAA] ¿Cuál es el mejor programa para crear recorridos virtuales?
- **Autocompletado:** «matterport precio», «matterport que es», «matterport españa».
- **Dificultad:** Baja-Media en español, porque casi no hay contenido nativo. El ángulo es «cuándo **no** necesitas Matterport»: vivienda sin construir, sin acceso o sin amueblar, y necesidad de AR.

### C5 · Realidad aumentada inmobiliaria — **P1 (GEO)** → `/servicios/realidad-aumentada-inmobiliaria/`

- **Keywords:** realidad aumentada inmobiliaria · realidad aumentada para inmobiliarias · realidad aumentada vivienda sobre plano · ver vivienda en realidad aumentada · maqueta en realidad aumentada · casa en realidad aumentada iPhone / Android · realidad aumentada sin app · AR inmobiliaria · realidad virtual inmobiliaria (vecina).
- **Autocompletado:** solo devuelve la propia semilla, así que la **demanda es baja**. Aun así, es la pregunta exacta que se hace a los LLMs.
- **Quién rankea:**
  - «realidad aumentada inmobiliaria»: elemental.com.py, alfisinmobiliaria, andreasgrunau, virtualarena, finquesfalcon, alfamexico, Instagram, rafaaguilar. Sin anuncios.
  - «realidad virtual inmobiliaria»: vrprojects, tworeality, abc.es, inmogesco, xnova360, cassandra-ai, agenciamediterranea, arteana. Anuncio: virtualmente.com.
  - «ver casa en realidad aumentada iphone»: App Store (Live Home 3D), xataka, masmovil, livehome3d. Es intención de consumidor, pero demuestra que **nadie explica AR inmobiliaria sin app**.
- **PAA:**
  - [PAA] ¿Cuál es la mejor IA para inmobiliarias?
  - [PAA] ¿Cuáles son los 4 tipos principales de realidad aumentada?
  - [PAA] ¿Qué programas usan las inmobiliarias?
  - [PAA] ¿Cuáles son los 4 tipos de realidad virtual?
  - [PAA] ¿Qué aplicación para iPhone puedo usar para diseñar casas?
- **Competidores reales de AR en España:**
  - Mayo Infografía: «Maqueta virtual Tabletop AR» y «Plano interactivo / Pop-Up Plan», **con app de Google Play**.
  - Iris360 Studios: AR para arquitectura.
  - CMYK Arquitectos: AR para ver la casa antes de construir.
  - Viseni (Marbella): maquetas interactivas **sin AR**.
- **Dificultad: Baja.** Ángulo: «**Un toque, sin app**: iPhone y iPad (AR Quick Look) y Android (Scene Viewer). Maqueta a escala 1:20 sobre la mesa o a tamaño real para "entrar" en la vivienda».
- Guía satélite para el cómo: `/guias/ver-una-vivienda-en-realidad-aumentada/` (iPhone y Android paso a paso, con vídeo).

### C6 · Home staging virtual — **P1 servicio / P2 cabeza** → `/servicios/home-staging-virtual/`

- **Keywords:** home staging virtual · home staging virtual para inmobiliarias · home staging virtual precio / tarifas · home staging virtual idealista · home staging virtual IA · amueblar piso virtualmente · decoración virtual vivienda · home staging obra nueva · home staging virtual sobre plano.
- **Autocompletado (rico, lo que indica demanda alta):** «home staging virtual gratis», «…ia», «…idealista», «…para inmobiliarias», «…tarifas», «…software gratis», «…free», «…ai», «…software».
- **Quién rankea:**
  - «home staging virtual»: homestagerdesign, pedra.ai, casasdelmediterraneo, iacrea («¿es legal y hay que declararlo?»), freedesstudio, inmersiastudio, helpmycash, magiceraser. **Anuncio: pedra.ai. AI Overview presente.**
  - «home staging virtual precio»: app.instantdeco.ai («desde 4 € por foto»), domoblock, proddigia, ideal.house, inmoplus, blog.floorfy, roomagen, apivirtual. Anuncios: styleathome.es, roomstaging.net.
  - «home staging virtual para inmobiliarias»: fotografo-interiores, homestagerdesign, **idealista (Virtual Home Staging)**, roomlab.app, inmoblog, inmoedit, homestagestudio. Anuncios: pedra.ai, styleathome.es.
- **PAA:**
  - [PAA] ¿Hay home staging virtual gratuito?
  - [PAA] ¿Cuánto cuesta un home staging?
  - [PAA] ¿Cuánto cobra un home staging?
  - [PAA] ¿Qué incluye el home staging?
  - [PAA] ¿Qué es el home staging?
  - [PAA] ¿Qué software puedo usar para remodelar mi casa?
  - [PAA] ¿Qué software gratuito hay para inmobiliarias?
- **Búsquedas relacionadas:** Virtual Home idealista · Home Staging curso · Programa home staging · Diseño de interiores para inmobiliarias · Tour virtual inmobiliaria · Web para inmobiliarias · Fotografía para inmobiliarias · Planos para inmobiliaria.
- **Dificultad: Alta.** Hay SaaS de IA con contenido masivo y precios de 0,3–5 €/imagen. **No hay que competir en precio.**
- **Ángulo:** staging sobre **el mismo modelo 3D** (muebles, materiales y estilos coherentes en todas las vistas, en el visor y en la AR). Válido para obra nueva sin construir, con etiqueta de «recreación virtual» (cumplimiento en portales).

### C7 · Precios de mercado — **P1** → guía hub + satélites · C7b → `/precios/`

- **Keywords:** cuánto cuesta un render 3D · precio render en España · render 3D precio · precio de render por m2 · cuánto cuesta hacer un render · precios de renders arquitectura · precio imagen render · tarifas renders · infografía 3D precio · cuánto cuesta un plano 3D · cuánto vale hacer una casa en 3D · tour virtual inmobiliaria precio · Matterport precio · home staging virtual tarifas / precio.
- **Búsquedas relacionadas (literales de la SERP):** «Precio render en España», «Render 3D precio», «Precio de render por m2», «Cuanto cuesta hacer un render», «Precios de renders arquitectura», «Precio imagen render», «Tarifas renders», «Renders 3D».
- **Autocompletado:** «precio render en españa», «precio render arquitectura». Hay ruido de cripto («precio render token») y LatAm («precio renders argentina 2026»), así que hace falta **siempre «España» y «€»** en el title.
- **Quién rankea:**
  - «cuánto cuesta un render 3D»: proyecto3dvalencia, renders.es, Reddit, yosoyarquitecto, vimapstudio, estudiolatarq (Argentina), myarchitectai, the3dcube, grup3d. Anuncio: fiverr.
  - «renders inmobiliarios precio»: visualre (Pamplona, Murcia), reportajesfotoinmobiliaria, rendersa, proyecto3dvalencia, grwestate («Render y vídeo con IA para inmobiliarias: guía 2026»), domingoloro. Anuncios: rengix, fiverr.
  - «infografía 3D precio»: proyecto3dvalencia, soloarquitectura, domingoloro, pragmamedios, the3dcube, motionrendering, 3droom, zaask, innovados. Anuncio: fiverr.
- **PAA:**
  - [PAA] ¿Cuánto cuesta un render en España?
  - [PAA] ¿Cuánto cuesta el m2 de render?
  - [PAA] ¿Cuánto vale hacer un render?
  - [PAA] ¿Cuánto cobrar renders?
  - [PAA] ¿Cuánto cuesta el programa de render?
  - [PAA] ¿Cuánto se cobra por hacer un render?
  - [PAA] ¿Cuánto puede costar un render?
  - [PAA] ¿Cuál es el precio de un modelado 3D?
  - [PAA] ¿Cuánto se cobra por un modelo 3D?
  - [PAA] ¿Cuánto cuesta un modelado 3D?
  - [PAA] ¿Cuánto cobra un arquitecto por un render?
  - [PAA] ¿Cuánto cuesta un render de arquitectura?
- **Dificultad:** Media. Las guías existentes son de estudios concretos, con sus propias tarifas y muy dispares (de 50 € a 800 € por imagen). **Ninguna agrega el mercado con fuentes enlazadas.** Esa es la brecha GEO: una tabla con rangos, fuentes y fecha que los LLMs puedan citar.
- **Estructura recomendada:**
  - Hub: `/guias/cuanto-cuesta-un-render-3d/` (P1).
  - Satélites: `/guias/cuanto-cuesta-un-plano-3d/` (P1), `/guias/precio-home-staging-virtual/` (P2), `/guias/precio-tour-virtual-inmobiliario/` (P2).
  - `/precios/` = **nuestras tarifas** (transaccional). Así se evita la canibalización: las guías son «estudio de mercado» y enlazan a /precios/, y /precios/ enlaza a las guías como «contexto de mercado».

### C8 · Locales Costa del Sol — **P1** → `/zonas/marbella/`, `/zonas/malaga/`, `/zonas/costa-del-sol/`

- **Keywords:**
  - Marbella: render 3D Marbella · infografías 3D Marbella · renders Marbella · plano 3D Marbella · home staging virtual Marbella · tour virtual Marbella.
  - Málaga: render 3D Málaga · infografías 3D Málaga · renders Málaga.
  - Costa del Sol: renders Costa del Sol · infografías 3D Costa del Sol · render Estepona / Benahavís / Mijas / Fuengirola / Sotogrande.
- **Quién rankea:**
  - «render 3D Marbella»: magnumreformas (interiorismo), marbella.studio (x2, cines/interiorismo), Instagram (freelance), 3dojo, estudibasic, Behance, zenitvisuals. **Sin PAA útiles ni anuncios. SERP débil.**
  - Vía WebSearch aparecen además: domingoloro (portfolio Marbella), dikaestudio («Infografías y render 3D en Málaga y Marbella»), proyectaenlanube (página de ciudad programática), beautypass, luft-render, egoistunique, esferarquitectura, y un artículo de economiademallorca («renders 3D en el lujo de Marbella»).
  - «render 3D Málaga»: render-arquitectura, 3dojo, Instagram, Milanuncios, assistadesign, LinkedIn, delineanteinfografia3d, tusclasesparticulares. Búsquedas relacionadas: «Render España», «Empresas de renders».
  - «infografías 3D Málaga»: **improntia (Tour virtual y render 3D en Marbella, Málaga y Costa del Sol)**, Instagram, homify (Visualfabrik), Houzz, **viseni (La Zagaleta)**, mediagenio, zenitvisuals, rendersa (Estepona). **Pack local presente.**
- **Dificultad: Baja.** Para el pack local: Google Business Profile como **negocio de área de servicio** (Marbella, Málaga, Costa del Sol) y reseñas.
- **Contexto de demanda B2B:** el autocompletado de «obra nueva marbella» es rico («promociones obra nueva marbella», «pisos obra nueva marbella», «obra nueva marbella idealista», «obra nueva elviria marbella»). Hay mucha actividad de promotoras y agencias, que son nuestro cliente.

### C8b · Locales resto de España — P2/P3

| Ciudad | Quién rankea | Pack local | Dificultad | Prioridad |
|---|---|---|---|---|
| Alicante / Costa Blanca | Instagram (efeNOU, Benissa), Milanuncios, ardis3d (Moraira), domingoloro (Guardamar), 3dojo, Instagram, iberinform, angelgalera | **Sí** | **Baja** | **P2** (compradores extranjeros y obra nueva, igual que la Costa del Sol) |
| Madrid | lobostudio, Houzz, Milanuncios, luft-render, proyectaenlanube, pandemiafilms, townvisuals, angelgalera, 3d-infografia | No detectado | Media | P2 |
| Barcelona | davantstudio, domingoloro, 360vr, arqpro, Instagram, trustlocal, luft-render, Wallapop, cataloxy | No detectado | Media (y catalán) | P3 |
| Valencia | Instagram, assistadesign, avfempresas (armarios), proyecto3dvalencia, infobel, cylex, arquitectosdevalencia, Pinterest | No detectado | Baja-Media | P3 |

### C9 · Portales (idealista / Fotocasa) — **P2** → `/guias/como-publicar-un-tour-3d-en-idealista-y-fotocasa/`

- «plano 3D idealista»: las **9 posiciones son de idealista** (crear planos, idealista/maps, tour virtual, planos de viviendas…). Búsquedas relacionadas: «Tour virtual idealista», «Hacer planos online gratis», «Valoración idealista gratis».
- Hechos clave para el copy y la guía:
  - **idealista solo acepta 3D o tour 360 de «proveedores multimedia compatibles»** (Matterport, 3DVista, AvaiBook…). En su centro de ayuda es una lista cerrada. Guías de terceros como my360 indican que el código se envía a su gestor. **Un visor propio no se puede pegar libremente en idealista.**
  - Fotocasa publica tours desde **Inmofactory** pegando la URL del proveedor y eligiendo «Tour virtual» (blog profesional de Fotocasa). Tiene su propia «Visita Express».
  - idealista tiene **Virtual Home Staging (VHS)** para profesionales, con efecto cortina antes/después, y tours 360 propios.
- **Acción:** verificar con idealista y Fotocasa si nuestro visor (URL pública con `model-viewer`) se admite como «tour virtual», y valorar solicitar el alta como proveedor compatible. Mientras tanto, en el copy hay que decir «en tu web, en el enlace del anuncio, por WhatsApp o con QR en el cartel de la vivienda».

### C10 · IA y vídeo inmobiliario — P2 guía / P3 servicio

- «vídeo inmobiliario con IA»: vibepeak.ai, nodalview, inmoedit, instantdeco, inmotek, YouTube, pedra.ai. Anuncios: artlist.io, adobe.
- **PAA:**
  - [PAA] ¿Qué IA puedo usar para crear videos inmobiliarios?
  - [PAA] ¿Cuál es la mejor IA para inmobiliarias?
  - [PAA] ¿Qué aplicación puedo usar para hacer videos inmobiliarios?
  - [PAA] ¿Hay inteligencia artificial gratuita para inmobiliarias?
  - [PAA] ¿Qué IA genera renders?
  - [PAA] ¿Cuál es la mejor IA para renders arquitectónicos?
- La guía `/guias/ia-o-modelo-3d-real/` responde a todas estas PAA con una comparación honesta. Vista Studio (referencia del cliente) y Pedra venden exactamente «render o vídeo con IA desde fotos».
- **No crear la página de servicio de vídeo IA hasta lanzarlo.** Se menciona como «próximamente» en `/servicios/` para evitar páginas finas.

### C11 · Arquitectos e interioristas — P2 → `/soluciones/arquitectos-interioristas/`

- «visualización arquitectónica»: SERP informacional (powerkh, qzymodels, archdaily, enscape-latam, behindpictures, domestika, ruc.udc.es). Anuncios: maquetas.tech, keyshot.
- **PAA:** [PAA] ¿Qué es la visualización arquitectónica? · [PAA] ¿Cuáles son las vistas arquitectónicas? · [PAA] ¿Cuál es la mejor IA para renders arquitectónicos?
- Dificultad Media-Alta. El ángulo para arquitectos: iteración rápida (cambios que se regeneran en minutos porque el modelo se construye por código), AR para presentar al cliente final y visor embebible en su web.

### C12 · Fuente del plano — P2 → `/guias/donde-conseguir-el-plano-de-una-vivienda/`

- **SERP:** idealista/news («¿Cómo conseguir los planos de mi casa?»), certicalia, aelca, housfy (plano del Catastro para vender), lasose, properfy, almanova, gohipoteca, inmobiliarianucleo.
- **PAA:** [PAA] ¿Dónde consigo los planos de una casa? · [PAA] ¿Cómo hacer un plano de un inmueble? · [PAA] ¿Dónde puedo encontrar planos de casas gratuitos?
- **Utilidad:** es tráfico informacional de alto volumen y **responde a la objeción «no tengo plano»**. Explica Catastro (unos 10 € por copia según las guías), ayuntamiento (10–50 €), colegio de arquitectos, promotora, croquis a mano o fotos y medidas. CTA: «envíanos lo que tengas».

### C13 · Alquiler vacacional — P3 → `/soluciones/alquiler-vacacional/`

- «fotos profesionales airbnb…»: Airbnb (fotografía y Airbnb Elevate), nachovillafoto («Fotógrafo Airbnb en Málaga, Granada y Marbella»), fotoarq, turno, marbellapropertyphoto, masterguest. Relacionadas: «Fotógrafo Airbnb», «Contratar fotógrafo airbnb», «Airbnb Elevate».
- «tour virtual apartamento turístico»: AvaiBook (de idealista), 3dspaces, comoestaralli, q-creativos.
- El encaje es menor, porque la vivienda ya existe y suele tener fotos. Los casos de uso son: **pre-lanzamiento** (VFT nueva aún sin amueblar), **redecoración** (staging antes de invertir), **plano 3D de distribución** para la ficha y **AR/visor** como diferencial en la web de reservas directas. Se publica cuando haya un caso real.

---

## 2. Arquitectura del sitio recomendada (en español)

> Principios: (1) **una keyword principal por URL** (tabla anti-canibalización en el §4.3); (2) slugs cortos en español, sin tildes ni stop-words innecesarias y con barra final (misma convención que el proyecto de transfers); (3) español en la raíz `/` y espejo inglés en `/en/` con hreflang recíproco (fuera del alcance de este documento); (4) **no publicar páginas «próximamente» ni páginas locales sin contenido propio**.

```
/                                         Home (P1)
├── /servicios/                           Hub de servicios (P1)
│   ├── /servicios/plano-2d-a-3d/                     P1  «plano 3D para inmobiliarias / convertir plano en 3D»
│   ├── /servicios/renders-inmobiliarios/             P1  «renders para inmobiliarias / infografías 3D»
│   ├── /servicios/tour-virtual-3d/                   P1  «tour virtual 3D inmobiliaria» (visor web + modo maqueta)
│   ├── /servicios/realidad-aumentada-inmobiliaria/   P1  «realidad aumentada inmobiliaria» (sin app)
│   ├── /servicios/home-staging-virtual/              P1  «home staging virtual para inmobiliarias»
│   └── /servicios/piso-piloto-virtual/               P2  «piso piloto virtual»
│       (vídeo IA y VR 360: sección «Próximamente» dentro de /servicios/, sin URL propia hasta el lanzamiento)
├── /soluciones/                          Hub por audiencia (P1)
│   ├── /soluciones/inmobiliarias/                    P1  «renders / planos 3D para inmobiliarias»
│   ├── /soluciones/promotoras-obra-nueva/            P1  «renders para promotoras / infografías obra nueva»
│   ├── /soluciones/arquitectos-interioristas/        P2  «renders para arquitectos»
│   └── /soluciones/alquiler-vacacional/              P3
├── /casos/                               Hub de casos (P1)
│   └── /casos/villa-costa-del-sol/                   P1  Caso demo anonimizado (visor + AR + renders + cifras)
├── /como-trabajamos/                     P1  Proceso: plano → Blender/Python → PBR procedural → Cycles → GLB/USDZ → visor
├── /precios/                             P1  Tarifas propias (packs, «desde», volumen agencias)
├── /zonas/                               Hub local (P1, enlazado desde el footer)
│   ├── /zonas/marbella/                              P1
│   ├── /zonas/malaga/                                P1
│   ├── /zonas/costa-del-sol/                         P1  (Estepona, Benahavís, Mijas, Fuengirola, Benalmádena, Nerja, Sotogrande…)
│   ├── /zonas/alicante-costa-blanca/                 P2
│   ├── /zonas/madrid/                                P2
│   └── /zonas/barcelona/  /zonas/valencia/  /zonas/baleares/   P3 (solo con caso local)
├── /guias/                               Hub de guías / blog (P1)
│   ├── /guias/cuanto-cuesta-un-render-3d/            P1  (hub de precios de mercado)
│   ├── /guias/cuanto-cuesta-un-plano-3d/             P1
│   ├── /guias/como-convertir-un-plano-2d-en-3d/      P1
│   ├── /guias/como-vender-viviendas-sobre-plano/     P1  (B2B promotoras)
│   ├── /guias/precio-home-staging-virtual/           P2
│   ├── /guias/precio-tour-virtual-inmobiliario/      P2
│   ├── /guias/home-staging-virtual-es-legal/         P2  (etiquetado «recreación virtual», portales)
│   ├── /guias/ver-una-vivienda-en-realidad-aumentada/ P2 (iPhone/Android, paso a paso + vídeo)
│   ├── /guias/como-publicar-un-tour-3d-en-idealista-y-fotocasa/ P2
│   ├── /guias/donde-conseguir-el-plano-de-una-vivienda/ P2
│   ├── /guias/piso-piloto-virtual-vs-fisico/         P2
│   ├── /guias/ia-o-modelo-3d-real/                   P2
│   ├── /guias/fotos-render-o-tour-3d-que-necesita-cada-vivienda/ P3
│   └── /guias/marketing-inmobiliario-3d-costa-del-sol/ P3
├── /comparativas/                        (P2)
│   ├── /comparativas/alternativa-a-matterport/       P2
│   ├── /comparativas/tour-3d-vs-tour-360/            P2
│   └── /comparativas/home-staging-ia-vs-modelo-3d/   P2
├── /glosario/                            P2  Una página con anclas (#render, #usdz…) + DefinedTermSet
├── /preguntas-frecuentes/                P1  FAQ central (las FAQ también se reparten por páginas)
├── /sobre-nosotros/                      P1  E-E-A-T: quién, herramientas, método, dónde (Costa del Sol)
├── /contacto/                            P1  Formulario con subida del plano (PDF/JPG/DWG) + «servicio» preseleccionado
└── /aviso-legal/  /politica-de-privacidad/  /politica-de-cookies/
```

### 2.1 Qué debe contener cada tipo de página (enfocado a keyword y a GEO)

- **Home:** H1 orientado a «de plano 2D a modelo 3D fotorrealista para inmobiliarias y promotoras». Primer párrafo con **frase-entidad** citable: «[Estudio] es un estudio de visualización 3D en la Costa del Sol (Málaga) que convierte planos 2D en modelos 3D amueblados, renders, visores web y realidad aumentada sin app para inmobiliarias y promotoras de toda España». Incluye el visor del caso con **póster estático y carga al hacer clic** (Core Web Vitals), los 5 servicios, las 4 audiencias, cifras del caso y un CTA.
- **Servicios:** respuesta directa de 40–60 palabras bajo el H1, bloque «qué recibes» (entregables y formatos), bloque «qué necesitamos» (plano; las medidas se estiman con la escala), proceso en 4–5 pasos, plazo, «desde» X € con enlace a /precios/, 5–8 FAQ con redacción de PAA, enlace al caso y schema `Service` + `Offer`.
- **Soluciones (audiencias):** dolor del segmento (inmobiliaria: captar exclusivas y vender vivienda vacía o sin reformar; promotora: preventa sin piso piloto; arquitecto: presentar y iterar; vacacional: pre-lanzamiento), qué combinación de servicios le conviene, objeciones y CTA.
- **Caso villa Costa del Sol (anonimizado):** son **datos originales citables**: unos 75 m² interiores y unos 28 m² de terrazas, 12 estancias, 39 texturas procedurales, 3 dormitorios, 2 baños + ducha, suite con bañera exenta, vestidor, 2 terrazas (olivo con tumbonas, césped artificial con escalera de caracol), realizado en **una sola sesión de trabajo**. Añadir pesos GLB/USDZ, tiempo de carga del visor y número de renders. Aviso: «medidas estimadas a partir de la escala del plano». No mostrar el plano original de terceros ni datos identificables.
- **Zonas (sin contenido fino):** cada página necesita **al menos 5 elementos únicos**:
  1. contexto del mercado local (tipologías: villas con terrazas, áticos, obra nueva en Estepona/Benahavís, compradores extranjeros que compran a distancia);
  2. qué pide ese mercado (AR y visor para compradores internacionales, bilingüe);
  3. un caso o ejemplo local (la villa sirve para Costa del Sol y Marbella);
  4. FAQ locales (p. ej. «¿Hacéis visitas en Marbella?», «¿Trabajáis con agencias de Nueva Andalucía / La Zagaleta?»);
  5. datos de zona con fuente (p. ej. peso de la compra extranjera o de la obra nueva en la provincia).

  **No duplicar plantillas cambiando solo la ciudad.** Madrid, Barcelona, Valencia y Baleares solo se publican con caso o testimonio local.
- **Guías de precios:** tabla de rangos con **fuente enlazada y fecha** (ver §5), explicación de los factores de precio, «cómo pedir un presupuesto comparable», «dónde encaja nuestro precio» y la fecha «Actualizado: septiembre 2026» (y actualizarla de verdad cada trimestre).

---

## 3. FAQ priorizadas (35+ preguntas en español)

> Uso: (a) el FAQ central `/preguntas-frecuentes/`; (b) repartir 5–8 por página de servicio, audiencia y zona; (c) schema `FAQPage`. Google limita desde 2023 el rich result de FAQ, pero el marcado y el formato pregunta-respuesta **siguen ayudando a los LLMs y a las PAA**. Hay que responder en la primera frase (respuesta directa) y ampliar después.
> [PAA] = pregunta literal vista en las SERPs de google.es.

### P1 — decisión de compra y objeciones (implementar en el lanzamiento)

| # | Pregunta | Página principal |
|---|---|---|
| 1 | ¿Cuánto cuesta un render en España? [PAA ×6] | /guias/cuanto-cuesta-un-render-3d/ · /precios/ |
| 2 | ¿Cuánto vale hacer una casa en 3D? [PAA] | /guias/cuanto-cuesta-un-plano-3d/ |
| 3 | ¿Se puede hacer un modelo 3D de una vivienda solo con el plano, sin fotos ni visita? | /servicios/plano-2d-a-3d/ |
| 4 | ¿Qué necesito enviaros para empezar? (plano en PDF/JPG/DWG, cotas si las hay, referencias de acabados) | /servicios/plano-2d-a-3d/ · /contacto/ |
| 5 | ¿Cuánto tardáis en entregar el modelo 3D, los renders y el visor? | /como-trabajamos/ |
| 6 | ¿Cómo puedo convertir un plano 2D a 3D gratis? [PAA] (y cuándo compensa un estudio) | /guias/como-convertir-un-plano-2d-en-3d/ |
| 7 | ¿Qué IA puede generar planos 3D? [PAA] ¿Es mejor la IA o un modelo 3D real? | /guias/ia-o-modelo-3d-real/ |
| 8 | ¿Cómo ven mis clientes la vivienda en realidad aumentada? ¿Tienen que instalar una app? | /servicios/realidad-aumentada-inmobiliaria/ |
| 9 | ¿Funciona en iPhone y en Android? | /servicios/realidad-aumentada-inmobiliaria/ |
| 10 | ¿Puedo poner el visor 3D en mi web o en el anuncio de idealista o Fotocasa? | /servicios/tour-virtual-3d/ · guía de portales |
| 11 | ¿Qué diferencia hay entre un tour virtual 360 (tipo Matterport) y un modelo 3D creado desde el plano? | /comparativas/tour-3d-vs-tour-360/ |
| 12 | ¿Sirve para vender viviendas sobre plano u obra nueva que aún no existe? | /soluciones/promotoras-obra-nueva/ |
| 13 | ¿Qué precisión tienen las medidas del modelo? | /como-trabajamos/ |
| 14 | ¿Cuántas revisiones incluye? ¿Qué pasa si cambia el plano o la distribución? | /precios/ · /como-trabajamos/ |
| 15 | ¿Quién tiene los derechos de uso de las imágenes y del modelo 3D? | /precios/ |
| 16 | ¿Es legal el home staging virtual? ¿Hay que avisar de que las fotos están decoradas virtualmente? | /guias/home-staging-virtual-es-legal/ |
| 17 | ¿Cuánto cobra un home staging? [PAA] (virtual frente a físico) | /guias/precio-home-staging-virtual/ |
| 18 | ¿Hay home staging virtual gratuito? [PAA] | /servicios/home-staging-virtual/ |
| 19 | ¿Qué es el render 3D? [PAA] | /glosario/#render · /servicios/renders-inmobiliarios/ |
| 20 | ¿Qué es una infografía 3D? [PAA] | /glosario/#infografia-3d |

### P2 — evaluación y contexto (primeros 3 meses)

| # | Pregunta | Página principal |
|---|---|---|
| 21 | ¿Cuánto cuesta un tour virtual inmobiliario? | /guias/precio-tour-virtual-inmobiliario/ |
| 22 | ¿Cuánto vale Matterport? [PAA] | /comparativas/alternativa-a-matterport/ |
| 23 | ¿Qué es un piso piloto virtual y cuánto cuesta frente a uno físico? | /servicios/piso-piloto-virtual/ |
| 24 | ¿Cómo funciona la compra de vivienda sobre plano? [PAA] (con enfoque de cómo lo facilita el 3D) | /guias/como-vender-viviendas-sobre-plano/ |
| 25 | ¿Dónde consigo los planos de una casa? [PAA] | /guias/donde-conseguir-el-plano-de-una-vivienda/ |
| 26 | ¿Cómo hacer un plano de mi casa en 3D? [PAA] | /guias/como-convertir-un-plano-2d-en-3d/ |
| 27 | ¿Qué es la visualización arquitectónica? [PAA] | /soluciones/arquitectos-interioristas/ |
| 28 | ¿Qué formatos entregáis? (JPG/PNG 4K, GLB, USDZ, enlace al visor, código de inserción) | /como-trabajamos/ |
| 29 | ¿Trabajáis fuera de Málaga y Marbella? ¿Y con agencias internacionales que operan en España? | /zonas/ · /sobre-nosotros/ |
| 30 | ¿Podéis cambiar muebles, materiales o estilos sobre el mismo modelo? | /servicios/home-staging-virtual/ |
| 31 | ¿Qué es el «modo maqueta» o corte de muros del visor? | /servicios/tour-virtual-3d/ |
| 32 | ¿El visor 3D ralentiza mi web? | /servicios/tour-virtual-3d/ |
| 33 | ¿Cuánto pesa el modelo en realidad aumentada y cuánto tarda en abrir con datos móviles? | /servicios/realidad-aumentada-inmobiliaria/ |
| 34 | ¿Hacéis descuentos por volumen o planes para agencias? | /precios/ |
| 35 | ¿Qué es la realidad aumentada y cómo se usa en inmobiliaria? | /servicios/realidad-aumentada-inmobiliaria/ |
| 36 | ¿Cuál es la mejor IA para inmobiliarias? [PAA] (respuesta honesta: para qué sirve la IA y para qué un modelo 3D) | /guias/ia-o-modelo-3d-real/ |

### P3 — cola larga, técnica y futuro

| # | Pregunta | Página principal |
|---|---|---|
| 37 | ¿Hacéis vídeos inmobiliarios con IA? (próximamente, a partir de los renders) | /servicios/ |
| 38 | ¿Hacéis tours de realidad virtual 360? (próximamente) | /servicios/ |
| 39 | ¿Se puede ver la vivienda a tamaño real y «caminar» por ella con el móvil? | /servicios/realidad-aumentada-inmobiliaria/ |
| 40 | ¿Qué programas usáis? (Blender, Cycles, scripts en Python, texturas procedurales) | /como-trabajamos/ |
| 41 | ¿Usáis texturas o modelos de stock? ¿Puede haber problemas de licencias? | /como-trabajamos/ |
| 42 | ¿Sirve para alquiler vacacional (Airbnb, Booking)? | /soluciones/alquiler-vacacional/ |
| 43 | ¿Cuánto cobra un arquitecto por un render? [PAA] | /guias/cuanto-cuesta-un-render-3d/ |
| 44 | ¿Qué IA genera renders? [PAA] | /guias/ia-o-modelo-3d-real/ |
| 45 | ¿Cuánto cuesta el m2 de render? [PAA] | /guias/cuanto-cuesta-un-render-3d/ |

**PAA descartadas por ser off-topic** (no usar): «¿Cuál es el mejor crowdfunding inmobiliario en España?», «¿Qué va a pasar con el precio de la vivienda en 2027?», «¿Cuánto es la entrada de un piso de 200.000 euros?», «¿Quién es un arquitecto famoso de Madrid?», «¿Cuáles son 3 tipos de infografías?» (infografía gráfica, no 3D).

---

## 4. Enlazado interno

### 4.1 Modelo hub-and-spoke

1. **Home → hubs:** /servicios/, /soluciones/, /casos/villa-costa-del-sol/, /precios/ y /zonas/ en el cuerpo, no solo en el menú.
2. **El caso es el nodo de prueba central.** Todas las páginas comerciales (servicios, soluciones y zonas) enlazan al caso («ver el modelo 3D de una villa en la Costa del Sol»). El caso enlaza de vuelta a **cada servicio usado** (plano → 3D, renders, visor, AR, staging) con anclas descriptivas.
3. **Cadena de servicios**, siguiendo el flujo de producto; cada servicio enlaza a los 2 siguientes:
   - plano-2d-a-3d → renders-inmobiliarios + tour-virtual-3d
   - tour-virtual-3d → realidad-aumentada-inmobiliaria + plano-2d-a-3d
   - realidad-aumentada → tour-virtual-3d + promotoras-obra-nueva
   - home-staging-virtual → renders-inmobiliarios + tour-virtual-3d
   - piso-piloto-virtual → home-staging-virtual + realidad-aumentada
4. **Audiencia ↔ servicios:** cada página de /soluciones/ enlaza a los 3–4 servicios relevantes y cada servicio a 1–2 audiencias («Para promotoras: preventa sin piso piloto»).
5. **Guías → servicio (dinero):** cada guía tiene 1 enlace contextual en el primer tercio y un bloque «Siguiente paso» al final hacia su servicio. Además enlaza a 1–2 guías hermanas del mismo cluster (las guías de precios se enlazan entre sí y con /precios/).
6. **Glosario:** la **primera mención** de un término técnico en cualquier página (USDZ, GLB, AR Quick Look, Scene Viewer, texturas PBR, Cycles, infografía 3D, modo maqueta) enlaza a `/glosario/#termino`. Cada definición del glosario enlaza a la página que lo desarrolla.
7. **Zonas:** /zonas/costa-del-sol/ es el hub local y enlaza a /zonas/marbella/ y /zonas/malaga/ (y viceversa). Las zonas enlazan a servicios, caso y contacto. Los servicios llevan un bloque «Trabajamos en» con 3–5 zonas. **Evitar un footer con 20 ciudades.**
8. **Breadcrumbs** visibles en todas las páginas con `BreadcrumbList`.
9. **Contacto con contexto:** los CTA de cada servicio llevan a `/contacto/?servicio=plano-3d` (o equivalente) para **preseleccionar el servicio** (patrón que funciona en Vista Studio). La URL con parámetro debe tener canonical a `/contacto/` y no aparecer en el sitemap.

### 4.2 Mapa de anclas recomendado (variar, no repetir siempre la exacta)

| Destino | Anclas sugeridas |
|---|---|
| /servicios/plano-2d-a-3d/ | «convertir un plano 2D en un modelo 3D», «plano 3D amueblado», «modelo 3D desde el plano», «planos 3D para inmobiliarias» |
| /servicios/renders-inmobiliarios/ | «renders inmobiliarios fotorrealistas», «infografías 3D para vender», «renders para inmobiliarias» |
| /servicios/tour-virtual-3d/ | «tour virtual 3D sin visita», «visor 3D interactivo», «recorrido virtual desde el plano», «maqueta 3D interactiva» |
| /servicios/realidad-aumentada-inmobiliaria/ | «realidad aumentada sin app», «ver la vivienda en realidad aumentada», «maqueta en AR sobre la mesa» |
| /servicios/home-staging-virtual/ | «home staging virtual sobre el modelo 3D», «amueblar virtualmente», «decoración virtual coherente en todas las vistas» |
| /servicios/piso-piloto-virtual/ | «piso piloto virtual», «alternativa al piso piloto físico» |
| /guias/cuanto-cuesta-un-render-3d/ | «cuánto cuesta un render 3D en España», «precios de renders en 2026», «guía de precios de visualización inmobiliaria» |
| /casos/villa-costa-del-sol/ | «caso: villa en la Costa del Sol», «ver el modelo 3D de ejemplo», «probar la realidad aumentada» |

### 4.3 Tabla anti-canibalización (keyword principal → URL única)

| Keyword principal | URL | Keywords que NO debe atacar (van a otra URL) |
|---|---|---|
| plano 3D para inmobiliarias / convertir plano en 3D (servicio) | /servicios/plano-2d-a-3d/ | «cómo convertir plano 2D a 3D gratis» → guía |
| cómo convertir un plano 2D a 3D | /guias/como-convertir-un-plano-2d-en-3d/ | «precio plano 3D» → guía de precios |
| cuánto cuesta un plano 3D | /guias/cuanto-cuesta-un-plano-3d/ | tarifas propias → /precios/ |
| renders para inmobiliarias / render 3D inmobiliaria | /servicios/renders-inmobiliarios/ | «renders para promotoras» → /soluciones/promotoras-obra-nueva/ |
| renders para promotoras / infografías 3D obra nueva | /soluciones/promotoras-obra-nueva/ | «piso piloto virtual» → su servicio |
| cuánto cuesta un render 3D / precio render España | /guias/cuanto-cuesta-un-render-3d/ | — |
| precios / tarifas (marca) | /precios/ | «cuánto cuesta un render» (mercado) → guía |
| tour virtual 3D inmobiliaria | /servicios/tour-virtual-3d/ | «alternativa a Matterport» → comparativa; «precio tour virtual» → guía |
| realidad aumentada inmobiliaria | /servicios/realidad-aumentada-inmobiliaria/ | «cómo ver una casa en AR en iPhone» → guía |
| home staging virtual (para inmobiliarias) | /servicios/home-staging-virtual/ | «precio home staging virtual» → guía; «¿es legal?» → guía |
| render 3D Marbella | /zonas/marbella/ | «renders Costa del Sol» → /zonas/costa-del-sol/ |

---

## 5. Precios públicos de mercado en España (para la guía informativa, con fuente)

> Hay que citarlos **como rangos de terceros, con enlace y fecha**, y no presentarlos como nuestros. Varían mucho (de low-cost a estudio premium). Conviene explicar los factores: número de vistas, si existe modelo previo, nivel de detalle, plazo (urgencia del **+20–40 %** según ararenders) y derechos de uso.

### 5.1 Renders (imagen fija)

| Concepto | Rango | Fuente (fecha) |
|---|---|---|
| Render de una estancia (interior) | 200–450 € | [ararenders.com](https://ararenders.com/cuanto-cuesta-un-render-3d-espana/) (13-06-2026) |
| Interior residencial simple / alto detalle 4K | 200–400 € / 400–800 € | [estudio3dbs.com](https://www.estudio3dbs.com/precio-render-3d-profesional-espa%C3%B1a) (2026) |
| Exterior vivienda unifamiliar simple / con paisajismo y piscina | 300–600 € / 600–1.200 € | estudio3dbs.com (2026) |
| Vista aérea | 500–1.500 € | estudio3dbs.com (2026) |
| Render interior / exterior (tarifa de referencia) | desde 246 € + IVA / desde 396 € + IVA por vista | [proyecto3dvalencia.es](https://proyecto3dvalencia.es/precios-renders-3d/) (s. f.) |
| Vivienda unifamiliar completa (2 exteriores + 3 interiores) | ~1.400 € + IVA | proyecto3dvalencia.es |
| Vivienda completa (2–4 vistas) | 400–1.000 € | ararenders.com (2026) |
| Pack promoción obra nueva | 1.500–4.000 € (8–12 vistas) | ararenders.com (2026) |
| Pack promoción básico / completo | 800–2.000 € (3–5 vistas) / 2.000–6.000 € (8–12 vistas) | estudio3dbs.com (2026) |
| Low-cost por render (interior / exterior) | 50–150 € / 70–200 € + IVA («estimados») | [renders.es/precios](https://renders.es/precios/) |
| Render interior (estudio) | desde 350 € por ambiente | [studiomkdesign.es/precios](https://studiomkdesign.es/precios/) |
| Render de reforma o amueblado con IA desde fotos | 129 € (1 inmueble, hasta 6 estancias) → 89 €/ud desde 5 | vistastudiodesign.com (ver `01-competidores.md`) |

### 5.2 Plano 3D

| Concepto | Rango | Fuente (fecha) |
|---|---|---|
| Plano 3D básico / estándar / premium | 100–250 € / 250–400 € / 400–800 €+ | [inmofotomadrid.es](https://inmofotomadrid.es/blog/cuanto-cuesta-un-plano-en-3d/) (12-02-2026) |
| Plano 3D cenital con cotas | 300–800 € | estudio3dbs.com (2026) |
| Plano 3D inmobiliario | desde 165 € + IVA | [tucasaapunto.com](https://www.tucasaapunto.com/servicio/plano-3d/) |
| Plano 3D «humanizado» | desde 250 € | studiomkdesign.es |
| Renders de planos | 50–100 € + IVA | renders.es |
| Plano esquemático añadido a un escaneo Matterport | 35 € + IVA | [andreasgrunau.com](https://andreasgrunau.com/precios-matterport-espana/) |
| Plano a render con IA (SaaS) | ~0,3–0,6 € por render (2 créditos; plan de 29 €/mes con 100 créditos) | [pedra.ai](https://pedra.ai/es/pricing) |

### 5.3 Home staging virtual (y físico, como referencia)

| Concepto | Rango | Fuente (fecha) |
|---|---|---|
| Por foto (volumen) | 25 € (1–3) · 18 € (4–6) · 16 € (7–10) · 13 € (11+) + IVA | [inmofotomadrid.es](https://inmofotomadrid.es/blog/home-staging-virtual/) (28-04-2026) |
| Estudio profesional / herramientas IA | 25–60 €/imagen / desde ~5 €/imagen | [maverickframe.com](https://maverickframe.com/es/blog/home-staging-virtual/) (16-06-2026) |
| Por estancia (virtual) | 60–400 € + IVA (típico 120–180 €) | [cronoshare.com](https://www.cronoshare.com/cuanto-cuesta/servicio-home-staging) (09-01-2026) |
| Por ambiente (estudio premium) | desde 400 € | studiomkdesign.es |
| Por inmueble (virtual) | 120–180 € | [helpmycash.com](https://www.helpmycash.com/blog/home-staging-virtual-en-que-casos-vale-la-pena-y-cuanto-cuesta/) (2021: dato antiguo, usar solo como histórico) |
| **Físico:** básico / total / vivienda vacía amueblada | 350–900 € / 990–3.500 € / 2.000–10.000 € + IVA | cronoshare.com (09-01-2026) |

### 5.4 Tours virtuales y vídeo

| Concepto | Rango | Fuente (fecha) |
|---|---|---|
| Tour 360 fotográfico (España) | 60–900 €; media 190–350 € por pack; piso de 3–4 dormitorios 220–320 € | [cronoshare.com](https://www.cronoshare.com/cuanto-cuesta/tour-virtual-360) (05-01-2026) |
| Servicio Matterport en Málaga | 190 € (≤150 m²) · 250 € (≤300 m²) · 470 € (≤1.000 m²) + IVA; hosting 50 €/año tras 6 meses | [andreasgrunau.com](https://andreasgrunau.com/precios-matterport-espana/) (2026) |
| Suscripción Matterport | Starter 9,99 $/mes · Professional 22 $/mes · Business 65 $/mes; cámara Pro3 2.495 € | [inmorobot.com](https://www.inmorobot.com/blog/matterport-inmobiliarias-tours-virtuales) (03-07-2026) |
| Tour 360 CGI (vivienda no construida) | 700–2.500 € / 800–2.500 € | estudio3dbs.com / ararenders.com (2026) |
| Tour virtual 360 (estudio) | desde 400 € | studiomkdesign.es |
| Tour 3D virtual CGI (EE. UU. / internacional) | desde 1.800 $ | [maverickframe.com](https://maverickframe.com/services/3d-virtual-tours/) |
| Animación arquitectónica 30–60 s | 1.500–5.000 € | estudio3dbs.com · ararenders.com (2026) |
| Vídeo animado (estudio) | desde 450 € | studiomkdesign.es |
| Video-tour generado con IA desde fotos | 290 € (1) → 200 €/ud desde 6 | vistastudiodesign.com |
| SaaS de tours (Floorfy) | ~29–89 €/mes (**dato de un resumen de búsqueda: verificar** en floorfy.com antes de citarlo) | floorfy.com / capterra |

**Estadísticas: no citar sin fuente primaria.** Circulan cifras como «las propiedades con home staging virtual se venden hasta un 30 % más rápido» o «las ventas en Marbella aumentan hasta un 45 % con renders», pero ninguna página que las repite enlaza un estudio. Si se usan, que sea con la fuente original. Lo preferible es publicar **datos propios** (tiempos, pesos, métricas del caso).

---

## 6. Recomendaciones específicas SEO + GEO derivadas de la investigación

1. **Formato «respuesta primero»:** bajo cada H2 con forma de pregunta (redacción PAA), una respuesta autónoma de 40–60 palabras con cifra o dato, seguida del desarrollo. Así se aumenta la probabilidad de PAA, featured snippet y cita en LLMs.
2. **Tablas con rangos, fuentes y fecha** en las guías de precios (§5). Es el formato que más citan Perplexity, ChatGPT y Copilot.
3. **Datos originales del caso** (12 estancias, 39 texturas, una sesión, pesos y tiempos de carga), con `Dataset`/`CreativeWork` o simplemente bien etiquetados.
4. **Vídeo en todas las SERPs:** 6–10 vídeos cortos (15–40 s): «plano → 3D en 60 s», «AR en iPhone sin app», «AR a tamaño real», «modo maqueta», «home staging sobre el modelo». Publicarlos en YouTube y Shorts, incrustarlos con fachada ligera (póster + clic) y marcarlos con `VideoObject`.
5. **Imágenes:** todas las SERPs tienen pack de imágenes. Usar renders en AVIF/WebP con nombres descriptivos en español (`render-salon-villa-costa-del-sol.avif`), alt descriptivo e `ImageObject` en el caso.
6. **Directorios y listados que citan los LLMs:** Sortlist («mejores servicios de renderizado 3D en España/Madrid»), Houzz, Habitissimo, Cronoshare, Zaask, Trustlocal, Google Business Profile, Clutch. Hay listicles de estudios («Empresas de renders 3D en España» de domingoloro, vimapstudio, maverickframe, freedesstudio, estudiolatarq): conviene hacer outreach para aparecer y publicar nuestra propia comparativa neutral.
7. **Consistencia de entidad:** misma frase-entidad, nombre, zona (Costa del Sol / Málaga) y servicios en web, GBP, directorios y `llms.txt`.
8. **Vocabulario dual en todas las páginas clave:** render/infografía 3D, tour/visita/recorrido virtual, maqueta virtual/interactiva, realidad aumentada/AR, home staging/decoración virtual.

---

## 7. Riesgos y avisos

- **Sin volúmenes numéricos:** las prioridades se basan en señales cualitativas. Hay que validarlas con Keyword Planner o Ahrefs antes de fijar el calendario editorial y revisarlas con GSC a los 60–90 días.
- **Muestra de SERP parcial:** 33 SERPs antes del CAPTCHA de Google, desde una geolocalización de Andalucía interior. Las SERPs de Marbella y Málaga vistas desde allí pueden diferir de las de un usuario en Marbella, sobre todo en el pack local.
- **La cabeza «plano 2D a 3D» convierte poco:** es DIY y gratis. No hay que medir el éxito por su posición, sino por los leads de la cola y de las páginas de audiencia.
- **Comoditización por IA** (Pedra 29 €/mes, instantdeco desde 4 €/foto, Vista Studio 129 €): posicionarse en fidelidad al plano, modelo navegable, AR y coherencia entre vistas, no en precio.
- **Portales:** idealista solo admite proveedores multimedia compatibles para 3D y tours. No prometer «se inserta en idealista» sin verificarlo. Fotocasa admite URLs de proveedores vía Inmofactory, pero también hay que verificar si acepta una URL genérica.
- **Transparencia del staging:** los portales piden indicar que es una recreación virtual. Hay que añadir la etiqueta «Imagen virtual / recreación» en las entregas y explicarlo (también es un argumento comercial).
- **Caso demo:** el plano original viene de un anuncio de terceros. Hay que publicarlo **anonimizado** (sin dirección, sin agencia, sin fotos del anuncio, sin reproducir el plano original) y valorar sustituirlo por un plano propio o con permiso. Hay que indicar que las medidas son estimadas.
- **Páginas locales finas:** con la política de «scaled content abuse» de Google, no hay que clonar plantillas por ciudad. Solo se publican zonas con contenido y casos propios.
- **«Maqueta 3D»** a secas atrae intención de maqueta física o kits. **«Visita virtual»** a secas atrae museos. Hay que añadir siempre calificadores (inmobiliaria, vivienda, interactiva).
- **Estadísticas sin fuente** muy repetidas en el sector: no reproducirlas.

---

## 8. Fuentes consultadas (además de las 33 SERPs de google.es y el autocompletado de Google)

- Precios de renders: https://ararenders.com/cuanto-cuesta-un-render-3d-espana/ · https://www.estudio3dbs.com/precio-render-3d-profesional-espa%C3%B1a · https://renders.es/precios/ · https://proyecto3dvalencia.es/precios-renders-3d/ · https://studiomkdesign.es/precios/
- Plano 3D: https://inmofotomadrid.es/blog/cuanto-cuesta-un-plano-en-3d/ · https://www.tucasaapunto.com/servicio/plano-3d/ · https://pedra.ai/es/pricing
- Home staging: https://inmofotomadrid.es/blog/home-staging-virtual/ · https://maverickframe.com/es/blog/home-staging-virtual/ · https://www.cronoshare.com/cuanto-cuesta/servicio-home-staging · https://www.helpmycash.com/blog/home-staging-virtual-en-que-casos-vale-la-pena-y-cuanto-cuesta/
- Tours: https://www.cronoshare.com/cuanto-cuesta/tour-virtual-360 · https://andreasgrunau.com/precios-matterport-espana/ · https://www.inmorobot.com/blog/matterport-inmobiliarias-tours-virtuales · https://maverickframe.com/services/3d-virtual-tours/
- Portales: https://www.idealista.com/tools/centrodeayuda/articulos/proveedores-multimedia-compatibles/ (403 a WebFetch; contenido confirmado por resultados de búsqueda) · https://my360propertyvirtualtours.com/es/como-publicar-tu-propio-tour-virtual-en-idealista/ · https://blogprofesional.fotocasa.es/fotocasa-incorpora-visitas-virtuales-anuncios-inmobiliarios/ · https://www.idealista.com/news/inmobiliario/blog-de-idealista/2020/05/05/782354-idealista-lanza-virtual-home-staging-vhs-una-sofisticada-y-revolucionaria
- Competidores AR / maquetas: https://mayoinfografia.com/realidad-aumentada-la-evolucion-de-la-representacion-de-activos-en-el-sector-inmobiliario/ · https://www.viseni.com/tecnologia/maquetas-3d-interactivas · https://3dtwin.com/property-virtual-tours/ · https://www.iris360studios.com/realidad-aumentada-arquitectura · https://cmyk-arq.es/realidad-aumentada-para-visualizar-tu-casa-antes-de-construir/
- Listados de «mejores estudios» (objetivo de outreach GEO): https://www.sortlist.com/i/s/3d-rendering/spain-es · https://vimapstudio.com/empresas-de-renders-de-arquitectura-en-espana/ · https://www.domingoloro.com/portfolio-renders-3d/1539-empresas-de-renders-3d-en-espana-visualizacion-arquitectonica-y-diseno-fotorrealista · https://maverickframe.com/blog/best-3d-rendering-companies-in-spain/ · https://freedesstudio.com/es/blog/mejores-empresas-de-renderizado-3d/
- Referencia del cliente: https://vistastudiodesign.com/ (análisis completo en `01-competidores.md`)
