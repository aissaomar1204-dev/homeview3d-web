# 01 · Análisis competitivo — vistastudiodesign.com + competidores en España

> Fecha del análisis: 2026-09-28 · Método: HTML en bruto con curl (cabeceras, `<head>`, JSON-LD, JS), inspección en navegador (rendimiento vía Performance API), WebFetch y WebSearch. PageSpeed Insights no estaba disponible (cuota diaria agotada), así que el rendimiento se evalúa con datos medidos en el navegador y con los pesos reales de los recursos.
> Todo el contenido de terceros se ha tratado como datos. No se reproduce texto largo de sus webs: se resume.

---

## 0. Resumen ejecutivo (TL;DR)

1. **Vista Studio (la referencia del cliente) no compite en «plano → 3D».** Es una startup de Barcelona (dominio registrado el **10-07-2026**) que vende **renders de reforma/amueblado virtual con IA a partir de FOTOS** y **video-tours generados con IA** a partir de esas fotos. No trabaja desde planos, no hace modelo 3D real, ni visor interactivo, ni AR.
2. **Lo que hace muy bien:** oferta B2B clarísima, **precios públicos con calculadora por volumen**, garantía fuerte (si no convence, no se factura; pago por transferencia a 15 días tras la entrega), **demo gratuita sobre un inmueble de la cartera del cliente**, comparador antes/después con 9 estancias, FAQ que desmonta objeciones, dosier corporativo en PDF.
3. **Lo que hace mal (y es nuestra oportunidad):** SEO/GEO prácticamente **inexistentes**. Es una sola página, sin `robots.txt`, `sitemap.xml`, `llms.txt`, canonical, hreflang, Open Graph ni JSON-LD. El EN/CA se traduce con JS en el cliente (Google no lo ve) y **no está indexada**. Además, carece de páginas legales, recoge los leads con formsubmit.co hacia un Gmail personal, sin captcha y sin casilla de privacidad (riesgo RGPD/LSSI), y el rendimiento es mejorable: vídeo de fondo sincronizado con el scroll, 11 `backdrop-filter`, 13 MB de vídeo en el hero, JPG/PNG sin lazy-load.
4. **El competidor real en SEO/GEO de la Costa del Sol es Viseni (Marbella, desde 2008).** Tiene Nuxt, 136 URLs ES/EN, páginas locales (Marbella, La Zagaleta, Sotogrande, Málaga…), `llms.txt`, robots que abre la puerta a los bots de IA, JSON-LD rico (FAQPage, Service, Organization, BreadcrumbList, VideoObject) y sitemap de vídeo. Pero es un estudio de alta gama que trabaja por presupuesto, en semanas (renders en 2–4 semanas, VR en 3–5 y maquetas interactivas en 6–10), y está enfocado a promotoras/villas de lujo y a eventos. **No vende a agencias un «plano → modelo 3D + visor + AR» a precio cerrado y en días.**
5. **Hueco de mercado claro:** nadie en España combina en la misma oferta, con precio público: (a) **entrada = plano 2D** (sin fotos, válido para obra nueva/venta sobre plano), (b) **modelo 3D geométricamente fiel**, (c) **visor web embebible** con recorrido guiado, cortes de maqueta y luz, (d) **AR nativa sin app** (USDZ/Quick Look + GLB/Scene Viewer), (e) home staging sobre el mismo modelo y (f) renders Cycles, todo en **días y no en semanas**, a un precio accesible para agencias.

---

## 1. vistastudiodesign.com — análisis profundo

### 1.1 Arquitectura de información / páginas

| URL | Estado | Contenido |
|---|---|---|
| `/` | 200 (135 KB HTML, CSS y JS inline) | One-page con anclas: Antes/Después · Cómo funciona · Beneficios · Packs · Dosier · FAQ · Contacto |
| `/dosier` (y `/dosier?print=1` para PDF) | 200 (45 KB) | Dosier corporativo en HTML imprimible: introducción, «justificación financiera», caso de estudio (piso en el Eixample, 8 estancias), flujo de trabajo, tabla de tarifas y condiciones |
| `/servicios`, `/portfolio`, `/precios`, `/about`, `/contacto`, `/blog`, `/en`, `/ca`, `/privacidad` | **404** | No existen |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | **404** | No existen |
| Pie: Privacidad / Términos / Aviso legal | `href="#"` | **Enlaces vacíos**: no hay páginas legales |

- Hosting: **Netlify** (cabeceras `Server: Netlify`, `Cache-Status: Netlify Edge`). Página 404 por defecto de Netlify.
- Dominio: registrado el **2026-07-10** con IONOS, así que tiene unos 2,5 meses.
- Indexación: `site:vistastudiodesign.com` no devuelve nada y la marca no aparece en las búsquedas → **sin presencia orgánica**.
- Idiomas: selector ES/EN/CA que **reescribe los nodos de texto con un diccionario JS** y guarda la elección en `localStorage`. No hay URLs por idioma: **Google y los LLM solo ven el español**.

### 1.2 Servicios y entregables

| Servicio | Qué es | Entrada |
|---|---|---|
| **Render** (reforma y amueblado virtual) | Hasta 6 estancias en «4K fotorrealista», elección de estilo, arquitectura intacta (paredes, ventanas, proporciones) | Fotos de móvil (mín. ~1600 px de lado largo) |
| **Walkthrough** (video-tour con IA) | Recorrido de cámara «cinematográfico» generado con IA; 16:9 para portales y 9:16 nativo para Reels/TikTok, con música | Fotos existentes del anuncio |
| **Signature** | Render + video-tour del piso ya reformado virtualmente («la cámara recorre un piso que aún no existe») | Fotos |
| **Agency** | Lotes (10/20/50 anuncios), plan mensual, prioridad de cola, estilos a medida. **Solo para quien ya ha sido cliente** | — |

- Propuesta de valor: sin videógrafo, sin jornada de rodaje y sin volver al piso. Renders en menos de 24 h laborables; el plazo del vídeo se confirma al aceptar el pedido.
- Etiqueta de «imagen virtual» en cada entrega (argumento de cumplimiento en los portales).
- **Incoherencias detectadas:** la home dice «4 estilos de reforma» y el dosier habla de «1 estilo a elegir entre 6». Los tres packs con precio muestran la misma insignia «🏆 Pack Cartera · Más Popular», lo que resta credibilidad.

### 1.3 Precios (exactos, sin IVA del 21 %)

Calculadora con stepper de cantidad en cada tarjeta:

| Unidades | Pack Render (€/ud · total) | Pack Walkthrough (€/ud · total) | Pack Signature (€/ud · total) |
|---|---|---|---|
| 1 | 129 · 129 | 290 · 290 | 390 · 390 |
| 2 | 119 · 238 | 270 · 540 | 370 · 740 |
| 3 | 109 · 327 | 250 · 750 | 350 · 1.050 |
| 4 | 99 · 396 | 230 · 920 | 330 · 1.320 |
| 5 | 89 · 445 | **999 cerrado** («Pack Cartera») | **1.499 cerrado** («Pack Cartera») |
| 6+ | 89/ud | 200/ud | 300/ud |

- Estancia adicional en Render: **8 €**.
- Agency: «a medida».
- Condiciones: sin permanencia · pago por transferencia a 15 días **después** de la entrega · **si no convence, no se factura** · 2 rondas de revisión · **demo gratuita** (renderizan gratis un piso completo de la cartera del cliente).
- En el dosier aparece la «tesis operativa»: con 129 € o 290 € por activo, la inversión se amortiza con el primer contacto cualificado adicional.

### 1.4 Proceso (3 pasos)
1. Envías las fotos desde cualquier dispositivo. 2. La IA genera el video-tour respetando la distribución y la luz. 3. Descargas el vídeo en 16:9 y 9:16.
En el dosier añaden un paso de control de calidad de «dirección de arte» y piden referencia, servicio y estilo en el envío.

### 1.5 CTAs y captación de leads
- CTA principal repetido: **«SOLICITAR INFORMACIÓN»** (en la nav, el hero y el formulario). CTA secundario en el hero: «Ver cómo funciona».
- En cada pack: **«PIDE TU DEMO GRATUITA»**. Un script JS **preselecciona el pack en el `<select>` del formulario y rellena el comentario** («Me interesa el Pack X»). Es un buen detalle de UX que conviene copiar.
- Formulario (5 campos): nombre de la agencia*, tu nombre*, email corporativo*, pack de interés* (select: Demo gratuita / Render / Walkthrough / Signature / Cartera / Agency) y comentarios (opcional). Envío a **formsubmit.co → Gmail personal** (nombre y apellidos del fundador), con `_captcha=false`.
- Mensaje de éxito en la propia página («Te contactaremos en 24 h»).
- **No tiene:** teléfono, WhatsApp, reserva de llamada (Calendly/Cal.com), subida de fotos en el formulario, chat, casilla de privacidad, UTM ni analítica. **No hay ningún tag de medición** (ni GA4, ni GTM, ni Meta Pixel), así que no pueden medir la conversión.
- Microcopy de contacto: «Contesta una persona, no un formulario» · «Sin compromiso, sin tarjeta de crédito» · «Respuesta en menos de 24 horas» · «Cobertura nacional e internacional».

### 1.6 Señales de confianza
- ✅ Comparador antes/después interactivo con **9 pares** del mismo piso (salón, comedor ×2, cocina, dormitorio, despacho, baño, pasillo y terraza).
- ✅ Vídeo de ejemplo en el hero, rotulado como ejemplo real. Es un plano aéreo de dron de un edificio, lo que resulta poco representativo de un tour interior.
- ✅ Garantía de 4 puntos en franja (total, sin permanencia, pago tras entrega, fotos de móvil).
- ✅ Dosier con código de documento («DOS-VS-2026-016») y ficha técnica del caso, que le da aire institucional.
- ⚠️ Cifras de mercado de terceros (**+403 % de consultas con vídeo, NAR**, y −31 % de tiempo de venta) con un descargo de que no son resultados propios.
- ⚠️ «Más de 80 inmobiliarias en lista de acceso anticipado» (solo en el dosier, sin verificar).
- ❌ Sin testimonios, logos de clientes, reseñas de Google, equipo/fundador, dirección fiscal, CIF ni aviso legal.
- ⚠️ El dosier declara que las fotos del estado actual **proceden de fotocasa.es**, lo que supone un posible problema de derechos de imagen. **Nosotros ya anonimizamos el caso («villa en la Costa del Sol»); hay que mantenerlo y no publicar el plano original.**

### 1.7 Tono y fórmulas de titular
- Tono: B2B cercano y seguro, frases cortas, tuteo y foco en la agencia («tus captaciones», «tu cartera»). El dosier sube a un registro corporativo-financiero (rotación, precio, capital).
- H1 (única cita literal): «El comprador recorre el piso antes de visitarlo». Fórmula: **beneficio para el comprador final + anticipación temporal**, con la segunda mitad en cursiva de color.
- Otras fórmulas (parafraseadas):
  - **Contraste en dos frases** («la misma foto, otro inmueble»).
  - **Transparencia en el precio** («precios claros, sin sorpresas»).
  - **Pregunta-marca** («¿Por qué [marca]?»).
  - **Invitación a ser pionero** en el CTA final («sé el primero en…»).
- Beneficios con **una cifra grande por tarjeta** (< 24 h · +403 % · 0 visitas extra · 9:16).
- FAQ orientada a objeciones: qué envío, qué es, cuánto tardáis de verdad, formatos, «¿y si no me gusta?», legalidad de la imagen virtual, si tocan la estructura, permanencia y forma de pago.

### 1.8 Diseño visual
- **Paleta** (tokens CSS; se llaman `--blue-*` porque vienen de una plantilla azul reconvertida a terracota; el patrón de rejilla sigue en azul `#60A5FA`):
  - Primario (CTA): **`#B4552F`** terracota · hover **`#9A4A28`**
  - Acento/arena: **`#D8A46A`** (hover `#E5B57F`)
  - Fondos crema: **`#FBF6EF`**, **`#F7EEE4`**, `#F3E6D8` · blanco `#FFFFFF`
  - Texto/oscuros: **`#2A2018`**, `#3B2F25`, `#241B14` (pie y secciones oscuras) · texto secundario `#8C7B69`
- **Tipografía**: *Plus Jakarta Sans* 600/700/800 (titulares, `letter-spacing -0.015em`, `line-height 1.12`) + *Inter* 300–700 (cuerpo, 16 px/1.6), servidas desde Google Fonts: 7 pesos cargados.
- **Patrones de layout**: contenedor de 1200 px, secciones con `padding clamp(64px, 8vw, 120px)`, *eyebrow* en mayúsculas de 11 px con tracking .18em, títulos centrados con divisor, tarjetas con radios de 12/20/30 px y botones pill, hero a 2 columnas (copy + vídeo), grid de 4 precios, franja de garantías, FAQ en acordeón y contacto a 2 columnas sobre fondo oscuro.
- **Motion**: **vídeo de fondo fijo que avanza/retrocede con el scroll** (`video.currentTime` en `requestAnimationFrame`, con anclas por sección), secciones «glass» con `backdrop-filter: blur()` sobre el vídeo, *reveal* con IntersectionObserver, hover con elevación en los botones y shake de validación en el formulario. Respeta `prefers-reduced-motion` ✅.
- **Imágenes**: JPG de unos 120–220 KB por imagen del comparador, logo PNG de 1088 px (102 KB) y **vídeo del hero de 13 MB**. No hay 3D interactivo en ningún sitio.
- Accesibilidad razonable: `aria-label`, `<label for>`, `:focus-visible` y `aria-expanded` en la FAQ.

### 1.9 SEO técnico

| Elemento | Estado |
|---|---|
| `<html lang>` | `es` (fijo; se cambia por JS) |
| `<title>` | «Vista Studio · Video-Tours con IA para Inmobiliarias» (correcto, con marca delante) |
| Meta description | Existe, 176 caracteres (algo larga) |
| Canonical | ❌ No |
| hreflang | ❌ No (EN/CA solo por JS) |
| Open Graph / Twitter Card | ❌ No, así que al compartir en WhatsApp/LinkedIn sale sin imagen |
| JSON-LD / schema.org | ❌ Ninguno (ni en `/` ni en `/dosier`) |
| Encabezados | 1 H1 · H2: Antes/Después, Cómo funciona, ¿Por qué?, Precios, Dosier, FAQ, Contacto · H3 en los packs. La estructura es correcta pero **sin keywords** («plano», «render», «home staging», ciudad…) |
| robots.txt / sitemap.xml / llms.txt | ❌ Los tres dan 404 |
| Páginas de servicio / locales / blog | ❌ No |
| Favicon | PNG de 12 KB; sin `apple-touch-icon` ni manifest |
| Analítica | ❌ Ninguna |

### 1.10 Rendimiento (pistas)
- Transferencia inicial medida en el navegador: **~1,2 MB** sin contar los vídeos en streaming (poster de 129 KB, logos PNG de 102 KB + 73 KB, 5 JPG del comparador y portada de 150–220 KB cada uno).
- **13 MB** de `walkthrough-vista-studio.mp4` (con `preload="metadata"`) + **0,9 MB** de `video.mp4` con `preload="auto"` para el fondo que sigue al scroll.
- Sin `loading="lazy"`, sin `srcset`/`<picture>`, sin WebP/AVIF. Las imágenes del comparador no tienen `width`/`height`, con riesgo de CLS.
- Google Fonts externas con 7 pesos, lo que retrasa el FCP en 3G/4G.
- **11 reglas `backdrop-filter`** sobre un vídeo fijo que se re-decodifica en cada scroll: coste alto de composición y de INP en móviles de gama media. (En la sesión de inspección, las capturas de pantalla fallaban repetidamente por timeout de render, lo que encaja con ese coste.)
- A favor: no carga librerías JS externas; todo el JS es vanilla e inline.

### 1.11 Preparación GEO (motores generativos)
- **Muy baja.** No está indexada; sin `llms.txt`, sin schema, sin URLs por idioma ni por servicio, y sin menciones de terceros (prensa, directorios, reseñas).
- Aun así, el **contenido sí es «citable»**: FAQ con datos concretos (resolución mínima, plazos, formatos, forma de pago) y tabla de precios en HTML dentro del dosier. Si lo arreglaran técnicamente, subirían rápido. **Hay que moverse antes que ellos.**

---

## 2. Otros competidores directos en España (perfiles breves)

### 2.1 Viseni Design — viseni.com (Marbella, desde 2008) · **el rival SEO/GEO a batir en la Costa del Sol**
- **Oferta**: renders 3D, animación/cine arquitectónico, **tours VR** (navegador, Meta Quest y kiosko; embebibles y compartibles por WhatsApp), **maquetas 3D interactivas** (unidades filtrables por precio, superficie y orientación, con panel de administración), apps de venta para promotoras, «herramientas AR» (sin detalle técnico) y una línea de eventos (FITUR, MWC, IA para eventos).
- **Precios**: no publica ninguno; propuesta en 24 h. **Plazos**: renders en 2–4 semanas (express en 5–7 días laborables), VR en 3–5 semanas (6–10 con configurador de materiales), maquetas interactivas en 6–10 semanas (12–16 si son complejas).
- **Confianza**: 17 años, «240+ proyectos», clientes públicos (ADIF, AENA, Renfe, Red.es, Turespaña, Junta de Andalucía) y proyectos con nombre (La Zagaleta, Villa Esmeralda…).
- **SEO/GEO (fuerte)**: Nuxt, imágenes WebP, **136 URLs ES/EN** con hreflang y x-default, canonical, **páginas por ubicación** (Marbella, La Zagaleta, Sotogrande, Málaga, Madrid-La Moraleja, La Finca, Mallorca-Andratx, Ibiza, Costa Brava), páginas por tipología (villas de lujo, obra nueva, hoteles, concursos), **`llms.txt` bien hecho** (hechos clave, páginas principales y ubicaciones), **robots.txt que permite explícitamente GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot y Google-Extended**, sitemap y **sitemap de vídeo**, y JSON-LD con Organization, WebSite, Service, FAQPage, BreadcrumbList, VideoObject, Place/GeoCoordinates y OpeningHours. Captación: formulario (nombre/empresa, email corporativo, tipo de proyecto, plazo, teléfono, descripción), WhatsApp, teléfono y «respuesta en < 24 h».
- **Debilidades**: alta gama por presupuesto y lenta (semanas); dispersa entre arquitectura y eventos; no le habla a la **agencia inmobiliaria media** con una ficha de venta; sin precio ni AR nativa concreta (Quick Look / Scene Viewer); no ofrece «plano 2D de una vivienda de segunda mano → 3D en días».

### 2.2 Improntia — improntia.com (Marbella / Costa del Sol, EN + ES)
- **Oferta**: renders 3D interiores y exteriores, animaciones, tours CGI 360°, **planos 3D** y fotografía inmobiliaria. Paquetes **Pro / Superior / Platinum** (p. ej. Platinum = 8 interiores + 5 exteriores) **sin precio** («solicita presupuesto»).
- **Plazos**: render interior en 1–2 días laborables; exterior en 2–4.
- **Confianza**: «97 proyectos», «120.325 m² renderizados», «15+ años». Sin testimonios ni clientes con nombre, y con «tasas de conversión de leads» del 75/84/95 % por paquete acompañadas de un descargo, lo que resulta poco creíble.
- **Técnico**: canonical, hreflang es/en, JSON-LD `LocalBusiness` + `Service`, GTM, **chat Tawk.to + WhatsApp**, ~64 URLs en el sitemap y sin `llms.txt`. H1 kilométrico con keyword stuffing y ningún H2. Vídeos rotos («video tag unsupported»).
- **Debilidades**: copy repetitivo, precios opacos, sin 3D interactivo ni AR y marcado de encabezados pobre.

### 2.3 Persuadis — persuadis.com (Barcelona, Madrid, **Málaga**, Lisboa)
- **Oferta**: agencia de **marketing inmobiliario integral para promotoras** (estudios de mercado, branding de promoción, oficina de ventas, call center), **renders y vídeos con IA**, **maquetas virtuales interactivas 3D** y showroom virtual/realidad mixta.
- **Confianza**: 16 años y «400+ promotoras», con logos grandes (Metrovacesa, Acciona, Neinor, Habitat) y cobertura en prensa sectorial (El Inmobiliario mes a mes, Observatorio Inmobiliario, APROIN).
- **Precios**: ninguno. Captación: dos WhatsApp, formulario (nombre, email, teléfono, mensaje, privacidad, newsletter) y «¿Hablamos?».
- **Técnico/SEO débil**: home sin meta description, sin canonical, sin OG, sin JSON-LD y con **3 H1**.
- **Relevancia**: compite por el **presupuesto de promotoras** (obra nueva y venta sobre plano), no por el de agencias de segunda mano. Su fuerza son la marca, las relaciones y la PR.

### 2.4 Segmento «plano 3D low-cost / home staging» (referencias de precio)
- **Home Stager Design** (homestagerdesign.com, e-commerce): **plano 2D B/N 49,95 €**, **2D color amueblado 69,95 €**, **3D color amueblado 119,95 €** por planta (~60 m²). Se sube una foto del plano (≥1024×768), se elige estilo, incluye 1 revisión, entrega **desde 72 h** y se paga online en el checkout. Es la **referencia de precio mínimo** para «plano 3D» estático (una imagen cenital, no un modelo navegable).
- **Rangos de mercado publicados** (guías de inmofotomadrid.es y de otros estudios, 2026): plano 3D básico **100–250 €**, estándar **250–400 €**, premium **400–800 €+**; render de interiores **150–600 €/imagen**; primer exterior **400–600 €**.
- **Home staging virtual con IA (SaaS)**: Lift My Place desde **0,60 €/imagen**, con suscripciones de 19–199 €/mes; tiene `llms.txt` y 20+ landings por ciudad («Home Staging Virtual en Madrid: Tarifas 2026») con schema `AggregateOffer`. Otros fotógrafos ofrecen staging desde 9–25 €/foto. **El staging con IA sobre foto se ha convertido en una commodity**, así que no debemos competir ahí en precio.
- **Plataformas interactivas internacionales**: R2U (plano interactivo, desde unos **2.700 $** por proyecto) y CubiCasa (planos desde escaneo con móvil + vídeo 3D). Sirven como ancla de precio «premium» para el visor.

### 2.5 Tabla comparativa

| | Entrada | Modelo 3D real | Visor web embebible | AR sin app | Precio público | Plazo típico | SEO/GEO |
|---|---|---|---|---|---|---|---|
| Vista Studio | Fotos | ❌ (IA generativa) | ❌ | ❌ | ✅ 129–390 € | < 24 h renders | ❌ muy débil |
| Viseni | Planos/modelo | ✅ | ✅ (VR/maqueta) | ~ (sin detalle) | ❌ | 2–16 semanas | ✅✅ fuerte |
| Improntia | Planos | ✅ | ~ (360°) | ❌ | ❌ | 1–4 días/render | ~ medio |
| Persuadis | Proyecto | ✅ | ✅ (maqueta) | ~ (RM) | ❌ | Proyecto | ❌ débil (marca fuerte) |
| Home Stager Design | Foto del plano | ❌ (imagen) | ❌ | ❌ | ✅ 49,95–119,95 € | 72 h | ~ |
| **Nosotros (objetivo)** | **Plano 2D o fotos** | **✅ geometría exacta** | **✅ model-viewer** | **✅ USDZ + GLB** | **✅** | **días** | **✅✅✅** |

---

## 3. Cómo les ganamos

### 3.1 Qué COPIAR (lo que funciona)
1. **Precios públicos con calculadora por volumen** (stepper y total en vivo), escalones claros y un «pack cartera» con precio cerrado. En GEO, los LLM citan mucho más a quien publica cifras concretas.
2. **Garantía de riesgo cero**: demo gratuita sobre un plano real del cliente, 2 rondas de revisión, «si no te convence, no pagas» y pago tras entrega (transferencia a 15 días). En nuestro caso, la automatización abarata la demo: **«Envíanos un plano y te devolvemos una estancia en 3D + AR gratis»**.
3. **El CTA de cada pack lleva al formulario con el pack preseleccionado** y el comentario prerrellenado.
4. **FAQ centrada en objeciones**: qué necesito enviar, plazos reales, formatos, qué pasa si no me gusta, legalidad de la imagen virtual («infografía orientativa, mobiliario no incluido»), si se toca la estructura (en nuestro caso, **nunca: la geometría sale del plano**), permanencia y forma de pago.
5. **Comparador antes/después**, en nuestra versión **plano 2D → render / modelo 3D** (arrastrable), con varias estancias de la villa demo.
6. **Dosier/caso de estudio imprimible (PDF)** para promotoras: ficha técnica (m², estancias, texturas, horas), proceso y tarifas. Sirve para enviarlo por email al comité de la promotora.
7. **Una cifra grande por beneficio** y la franja de garantías bajo los precios.
8. Microcopy humano: «Contesta una persona», «Respuesta en < 24 h», «Sin compromiso».

### 3.2 Qué MEJORAR (donde ellos fallan y nosotros ganamos)
**Producto/mensaje**
- **Posicionamiento único**: «De plano 2D a modelo 3D fotorrealista, navegable y en realidad aumentada, sin fotos y en días». Esto sirve para **obra nueva / venta sobre plano** (donde aún no hay fotos ni se puede grabar) y para **segunda mano** (planos de listing y reformas). Vista Studio y el staging con IA **necesitan fotos**; Viseni tarda **semanas**.
- **Fidelidad verificable frente a IA generativa**: nuestro modelo es geometría real a escala (medidas estimadas desde la escala del plano), así que no hay «alucinaciones» de ventanas ni puertas. El vídeo cinematográfico con IA (próximamente) partirá de renders de un modelo coherente, no de fotos sueltas. Es el mensaje contra Vista Studio.
- **Demostrarlo en vivo en la propia web**: la villa de la Costa del Sol en `<model-viewer>` con lista de estancias, recorrido guiado, modo maqueta (muros cortados a 1,15 m), control de luz y **botón «Ver en tu salón» (AR)**. Ningún competidor enseña el entregable funcionando en su web.
- **Pruebas propias en lugar de estadísticas de EE. UU.**: datos del caso (12 estancias, 39 texturas procedurales, ~75 m² + ~28 m² de terrazas, 1 sesión de trabajo). Cuando haya clientes: tiempo en ficha, clics a «ver en 3D», leads del anuncio. Si citamos fuentes sectoriales, que sean españolas o europeas (portales, APCEspaña…), con enlace.
- **Texturas procedurales propias = sin problemas de licencias**, y un caso **anonimizado** (sin fotos de portales de terceros, a diferencia de Vista Studio).
- **Segmentos explícitos** con landing propia: agencias (segunda mano), promotoras (obra nueva/sobre plano), arquitectos/interioristas y propietarios de alquiler vacacional.

**Captación de leads**
- Formulario en 2 pasos: (1) tipo de cliente, servicio y nº de inmuebles al mes; (2) nombre, empresa, email, teléfono/WhatsApp y **subida del plano** (PDF/JPG/PNG; alternativa: enlace al anuncio). Casilla RGPD, honeypot + Turnstile/hCaptcha, UTMs ocultas y email de dominio propio. Gestión con **Netlify Forms o una función propia**, nunca un Gmail personal.
- **WhatsApp flotante** con mensaje prerrellenado, **reserva de videollamada de 15 min** (Cal.com/Calendly) y teléfono visible (en la Costa del Sol el WhatsApp convierte muchísimo; Viseni, Improntia y Persuadis lo usan).
- Lead magnets: **demo gratis de una estancia**, **calculadora de precio** y **dosier PDF** a cambio del email (opcional).
- Medición desde el día 1: GA4 o Plausible con eventos (`generate_lead`, `whatsapp_click`, `ar_launch`, `viewer_interaction`, `pricing_calc`) y conversiones en Search Console/Ads.

**SEO técnico (partiendo del generador de transfermalaga)**
- Sitio estático generado con Node, **una URL por idioma** (`/` ES, `/en/`) con hreflang es/en/x-default, canonical, sitemap con alternates, OG/Twitter con imagen 1200×630 por página y `check.js` de QA (títulos únicos, JSON-LD válido, enlaces rotos, pesos).
- **Arquitectura de páginas objetivo** (clusters):
  - **Servicios**: plano a 3D · renders fotorrealistas · visor 3D interactivo para anuncios · realidad aumentada inmobiliaria · home staging virtual · (próximamente) vídeo cinematográfico con IA y tour VR 360.
  - **Audiencias**: agencias · promotoras / venta sobre plano · arquitectos · alquiler vacacional.
  - **Ubicaciones** (con contenido local real, no plantillas vacías): Marbella, Málaga, Estepona, Benahavís, Mijas, Fuengirola, Nueva Andalucía, Sotogrande y Costa del Sol; más adelante Madrid, Barcelona, Valencia, Alicante y Baleares.
  - **Precios** (página propia con tabla HTML), **Caso de estudio** (villa Costa del Sol), **Cómo funciona**, **FAQ**, **Demo AR**, **Sobre nosotros** (personas reales), **Contacto** y **legales** (aviso legal, privacidad, cookies).
  - **Guías/blog** con intención comercial: cuánto cuesta un plano 3D en 2026, render vs tour 360 vs Matterport vs modelo 3D, qué es la AR sin app (USDZ/Quick Look), cómo vender sobre plano con 3D, normativa sobre imágenes virtuales en portales (Idealista/Fotocasa), home staging virtual: precios y límites de la IA.
- **Keywords a cubrir que ellos no trabajan**: «plano a 3D», «convertir plano 2D en 3D», «plano 3D inmobiliaria», «modelo 3D vivienda», «maqueta virtual», «venta sobre plano 3D», «realidad aumentada inmobiliaria», «visor 3D anuncio inmobiliario», «infografías 3D Marbella/Málaga», «home staging virtual Marbella», «render obra nueva Costa del Sol»; en EN: «floor plan to 3D Spain», «3D floor plan Marbella», «AR property viewer», «virtual staging Marbella».
- **Schema por página (@graph)**: `Organization`/`ProfessionalService` (areaServed: Costa del Sol, España; `knowsAbout`), `WebSite`, `Service` + `Offer`/`PriceSpecification` (precios reales), `FAQPage`, `BreadcrumbList`, **`3DModel`** (con `encoding` GLB y USDZ) y `ImageObject` para la demo, `VideoObject` para los vídeos, `CreativeWork`/`Article` para el caso de estudio y las guías (con autor y fecha de actualización) y `HowTo` para el proceso (semántico).

**GEO (que ChatGPT, Claude, Perplexity, Gemini y Copilot nos citen)**
- `robots.txt` que **permita explícitamente** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended y Bingbot (Viseni ya lo hace; hay que igualarlo y ampliarlo).
- `llms.txt` + `llms-full.txt` generados en el build: definición en una frase, **hechos clave** (servicios, entrada = plano, formatos GLB/USDZ, plazos, precios «desde», zonas, idiomas, contacto) y enlaces a cada página y guía. Viseni tiene uno bueno, así que el nuestro debe ser **más específico y con precios**.
- En cada página, un bloque **«Datos clave»** con frases definitorias autocontenidas («[Estudio] convierte planos 2D de viviendas en modelos 3D fotorrealistas con visor web y realidad aumentada para inmobiliarias y promotoras en España; entrega en X días; desde X €»), tablas comparativas en HTML, FAQs de respuesta directa y fecha de «Última actualización».
- **Bing es la fuente de Copilot y de parte de ChatGPT Search**: dar de alta Bing Webmaster Tools + **IndexNow** en el build, además de Google Search Console.
- **Menciones de terceros** (los LLM citan fuentes externas): Google Business Profile (área de servicio), LinkedIn de empresa, directorios (habitissimo, homify, Houzz, Clutch/Sortlist, proveedores.com), notas de prensa en El Inmobiliario mes a mes / Observatorio Inmobiliario / Idealista News (Persuadis y Virtual Estate aparecen ahí), vídeos en YouTube de la demo con descripción rica y posts en foros o grupos de agentes (API, colegios).
- **Test de referencia GEO** antes del lanzamiento y cada mes: preguntar a los 5 motores «empresa que convierta planos 2D en 3D para inmobiliarias en España / Marbella», «realidad aumentada para vender viviendas sobre plano», etc., y registrar quién aparece citado.

**Rendimiento (Core Web Vitals)**
- Hero con **póster AVIF/WebP optimizado como LCP** (≤ 120 KB, `fetchpriority="high"`, con `width`/`height`). **`model-viewer` (~250 KB JS) solo al interactuar** o cuando el visor entra en viewport (`IntersectionObserver` + `import()`), nunca bloqueando el LCP.
- GLB con **Meshopt/Draco + texturas KTX2/WebP**, objetivo ≤ 5–8 MB para la demo completa, con carga progresiva (poster → modelo). USDZ aparte, servido solo en iOS. Cabeceras de caché inmutables.
- Nada de vídeo de fondo sincronizado con el scroll ni de `backdrop-filter` masivo. Vídeos con `preload="none"`, póster, versión móvil ≤ 3–4 MB y reproducción al hacer clic.
- Fuentes autoalojadas en woff2 con subset y como máximo 2 familias / 3–4 pesos, con `preload` de la fuente del titular. Imágenes con `srcset` + `loading="lazy"` fuera del viewport.
- Presupuesto: HTML ≤ 60 KB, JS inicial ≤ 30 KB (sin contar el visor diferido), LCP móvil < 2,0 s, CLS < 0,05, INP < 150 ms. Lighthouse ≥ 95 en las 4 categorías, verificado en el `check.js`.

**Diseño**
- No copiar su terracota/crema: quedaríamos como un clon. Proponer una identidad propia, pensada para cuando llegue el logo: por ejemplo piedra/blanco roto + tinta profunda + un acento **oliva/salvia** (guiño al olivo de la terraza demo), con fotografía/render en protagonismo.
- Patrones que sí aprovechar: *eyebrows*, cifras grandes, tarjetas de precio con stepper, franja de garantías, acordeón FAQ y contacto a 2 columnas.
- El «wow» debe ser **el propio producto 3D/AR**, no efectos de fondo.

### 3.3 Qué EVITAR (errores observados)
- ❌ One-page sin URLs de servicio, ubicación ni idioma, con **i18n por JS en el cliente** (invisible para Google y los LLM).
- ❌ Falta de `robots.txt`, `sitemap.xml`, `llms.txt`, canonical, OG o schema.
- ❌ **Sin páginas legales ni casilla RGPD** y formulario a un Gmail personal vía formsubmit sin captcha: riesgo legal y de spam, y señal de poca seriedad para promotoras.
- ❌ Usar **fotos de portales de terceros** en casos de estudio (derechos de imagen). Nuestro caso sigue anonimizado y sin reproducir el plano original.
- ❌ Estadísticas ajenas (NAR +403 %) como argumento principal; mejor datos propios o fuentes españolas con enlace.
- ❌ Incoherencias de copy (4 frente a 6 estilos; tres tarjetas «Más popular»). Una única fuente de verdad en `build/data` para precios y cifras, reutilizada en la web, el `llms.txt`, el JSON-LD y el PDF.
- ❌ Vídeo de hero de 13 MB, vídeo de fondo con scrubbing, 11 `backdrop-filter`, PNG/JPG sin optimizar ni lazy-load, y 7 pesos de Google Fonts.
- ❌ Vídeo de ejemplo poco representativo (dron exterior para vender un tour interior). Nuestro hero debe mostrar **el entregable real** (modelo/AR de la villa).
- ❌ «Pack Agency solo para quien ya fue cliente»: frena a las agencias grandes. Nosotros ofrecemos piloto de 3 inmuebles con precio de volumen desde el inicio.
- ❌ Sin analítica: no se puede optimizar lo que no se mide.

### 3.4 Posicionamiento de precio sugerido (hipótesis a validar con el cliente)
- **Suelo de mercado**: plano 3D estático ~120 € (Home Stager Design). **Referencia de Vista Studio**: render 129 €, vídeo 290 €, combo 390 €. **Techo**: estudios de alta gama sin precio, visores interactivos desde ~2.700 $.
- Propuesta de estructura (las cifras exactas las decide el cliente):
  - «**Plano 3D + visor web**»: entrada, por vivienda y hasta X m².
  - «**Pack Anuncio**»: modelo + visor + AR + N renders.
  - «**Pack Promoción**»: por tipología, con descuento por unidades y maqueta del conjunto.
  - Extras: estancia/render adicional, home staging alternativo, vídeo IA (próximamente).
  - Escalones por volumen y **pack cartera de 5** a precio cerrado (copiando la mecánica de Vista Studio), con precios «desde» visibles en HTML y en el JSON-LD `Offer`.

---

## 4. Fuentes consultadas
- https://vistastudiodesign.com/ (HTML en bruto, cabeceras, JS de precios e i18n) y https://vistastudiodesign.com/dosier
- RDAP del dominio vistastudiodesign.com (fecha de registro)
- https://www.viseni.com/ · /3d · /renders-3d/malaga · /tecnologia/realidad-virtual-inmobiliaria · /tecnologia/maquetas-3d-interactivas · /robots.txt · /llms.txt · /sitemap.xml
- https://improntia.com/3d-renders-architecture-marbella-malaga-new-buildings.php
- https://www.persuadis.com/ · https://elinmobiliariomesames.com/actualidad/maquetas-virtuales-interactivas-3d-experiencias-inmersivas-para-impulsar-la-comercializacion-inmobiliaria/
- https://homestagerdesign.com/producto/planos-3d/
- https://inmofotomadrid.es/blog/cuanto-cuesta-un-plano-en-3d/
- https://liftmyplace.com/es/madrid · https://liftmyplace.com/llms.txt
- https://observatorioinmobiliario.es/noticias/organizaciones/un-real-estate-cada-vez-mas-virtual/ (Virtual Estate)
- https://r2u.io/en/blog/interactive-floor-plan-real-estate/ · https://www.cubi.casa/3d-walkthrough-video-renders/
- Proyecto de referencia interno: E:\AnubisAI\Claude\Webs\transfermalaga\malaga-premium-transfers (README, netlify.toml)
