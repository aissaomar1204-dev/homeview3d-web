// Service page: 2D floor plan → 3D (plano 3D + maqueta 3D completa).
// ES cluster C1 (02-keywords-es.md), EN cluster C1 (03-keywords-en.md).
// Stats verified 2026-09-28 in the primary source (Registradores ERI 2T 2026 PDF).

const ERI = {
  url: 'https://www.registradores.org/documents/d/guest/eri_2t_2026',
};

export default {
  id: 'servicio-plano',
  image: 'villa_planta_cenital_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-29',

  es: {
    title: 'Plano 2D a 3D para inmobiliarias, sin fotos',
    description: 'Plano 3D amueblado o modelo 3D completo a partir del plano 2D de tu vivienda, sin fotos ni visita. Desde {{price:plano3d}} + IVA en {{delivery:plano3d}}.',
    h1: 'Plano 3D para inmobiliarias: del plano 2D al modelo 3D',
    lead: 'Para inmobiliarias y promotoras: convertimos el plano 2D de una vivienda en un modelo 3D amueblado y a escala, sin fotos ni visita. El plano 3D cuesta desde {{price:plano3d}} + IVA por planta y llega en {{delivery:plano3d}}. La maqueta completa, con renders, visor web y realidad aumentada, desde {{price:maqueta}} + IVA en {{delivery:maqueta}}.',
    breadcrumb: 'Plano 2D a 3D',
    card: {
      title: 'Plano 2D a 3D',
      summary: 'Planta cenital, vista isométrica y modelo 3D amueblado a partir de un único plano, sin fotos ni visita.',
    },
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Maqueta 3D de la villa seccionada a 1,15 m, con las estancias amuebladas vistas desde arriba. Render 3D generado a partir del plano 2D.',
      caption: 'Maqueta seccionada. Render generado a partir del plano 2D, sin fotos.',
    },
    facts: [
      ['Entrada', 'Un plano 2D (PDF, JPG, PNG o DWG), sin fotos ni visita'],
      ['Entregables', 'Planta cenital, vista isométrica y planta 2D; con la maqueta, modelo 3D'],
      ['Formatos', 'PNG en 4K; con la maqueta, GLB, USDZ y BLEND'],
      ['Precio desde', '{{price:plano3d}} + IVA por planta; maqueta, {{price:maqueta}}'],
      ['Plazo', '{{delivery:plano3d}}; maqueta, {{delivery:maqueta}}'],
      ['Revisiones', '{{revisions:plano3d}}; maqueta, {{revisions:maqueta}}'],
      ['Zona', 'Costa del Sol y toda España, en remoto'],
      ['Idiomas', 'Español e inglés'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Se puede hacer un modelo 3D de una vivienda solo con el plano?',
        answer: 'Sí. Con un único plano 2D levantamos la vivienda a escala: muros, huecos, puertas, ventanas, mobiliario y materiales. No necesitamos fotos ni visitar el inmueble, así que sirve para obra nueva, viviendas vacías, alquiladas o en otra ciudad. Si el plano no trae cotas, estimamos las medidas con su escala.',
        body: 'Así hicimos la [villa en la Costa del Sol](@caso-villa) que puedes recorrer en esta web. Partimos de {{villa:input}}. El resultado tiene {{villa:rooms}} estancias amuebladas, unos {{villa:interiorM2}} m² interiores y {{villa:textures}} texturas [PBR](@glosario#pbr) creadas para ese modelo, sin bancos de imágenes.',
      },
      {
        type: 'compare',
        h2: 'Del plano 2D al plano 3D, con la misma cámara',
        intro: 'La planta de líneas está redibujada desde nuestro modelo, no copiada del plano original. El render cenital a color sale de la misma cámara y la misma escala, por eso las dos capas coinciden.',
      },
      {
        type: 'answer',
        h2: '¿Qué diferencia hay entre un plano 3D y una maqueta 3D completa?',
        answer: 'El plano 3D son imágenes fijas en 4K: la planta cenital a color y una vista isométrica amueblada. La maqueta 3D completa es el modelo navegable: incluye esas plantas, 6 renders fotorrealistas, el visor web para tu anuncio y la realidad aumentada en iPhone y Android.',
        body: 'Los dos parten del mismo trabajo: modelar la vivienda en 3D a partir del plano. El plano 3D basta para la ficha de un portal o un dosier de venta. La maqueta compensa cuando el comprador necesita recorrer la vivienda: obra nueva, compradores que viven fuera o pisos sin amueblar.\n\nDe ese mismo modelo salen los [renders inmobiliarios fotorrealistas](@servicio-renders) y el [recorrido virtual desde el plano](@servicio-tour), sin volver a empezar.',
      },
      {
        type: 'table',
        h2: '¿Plano 3D, render con IA o tour 360? Qué obtienes con cada opción',
        intro: 'Las opciones que suele barajar una agencia para enseñar la distribución de una vivienda, comparadas por lo que entregan y por lo que necesitan.',
        caption: 'Opciones para enseñar la distribución de una vivienda en un anuncio',
        head: ['Opción', 'Qué obtienes', 'Qué hace falta', '¿Sirve sin la vivienda construida?'],
        rows: [
          ['Plano 3D de {{brand}}', 'Planta cenital e isométrica amuebladas en 4K, generadas desde un modelo 3D', 'El plano 2D', 'Sí'],
          ['Maqueta 3D completa de {{brand}}', 'Modelo navegable, 6 renders, visor web y realidad aumentada sin app', 'El plano 2D', 'Sí'],
          ['Plano 3D de bajo coste', 'Una imagen cenital estática, sin modelo navegable ni más vistas', 'El plano 2D', 'Sí'],
          ['Render con IA a partir de fotos', 'Imágenes sueltas: cada una se genera por separado y puede alterar huecos o proporciones', 'Fotos de la vivienda', 'No'],
          ['Tour 360 o escaneo tipo Matterport', 'El estado real de la vivienda el día de la visita', 'Vivienda terminada, cámara y visita', 'No'],
        ],
        note: 'Si la vivienda ya existe y quieres enseñar sus acabados reales, un escaneo es buena opción: lo explicamos en [modelo 3D o Matterport](@guia-matterport). Si prefieres hacerlo tú con programas gratuitos, lee [cómo convertir un plano 2D en 3D](@guia-plano-2d-3d).',
      },
      {
        type: 'process',
        variant: 'list',
        h2: '¿Cómo se convierte un plano 2D en un modelo 3D?',
        intro: 'Cinco pasos y {{delivery:maqueta}} para la maqueta completa. Las herramientas y el control de calidad, en detalle, en [nuestro método de trabajo](@como-funciona).',
      },
      {
        type: 'needs',
        h2: '¿Qué necesito enviaros para empezar?',
        intro: 'Con el plano basta para empezar; lo demás afina el resultado. Puedes adjuntarlo en el formulario o pegar el enlace del anuncio donde aparece.',
      },
      {
        type: 'answer',
        h2: '¿Qué precisión tienen las medidas del modelo 3D?',
        answer: 'La del plano de partida. Con un plano acotado o un DWG, el modelo respeta las cotas. Si el plano solo tiene escala gráfica, medimos sobre ella y las superficies son aproximadas (≈), como en nuestra villa de demostración. Lo indicamos en cada entrega para que el anuncio no prometa medidas exactas.',
      },
      {
        type: 'answer',
        h2: '¿Sirve para vender obra nueva sobre plano?',
        answer: 'Sí, y es donde más rinde. Una vivienda sin construir no tiene fotos, pero sí planos. Con ellos modelamos cada tipología amueblada y la enseñas en renders, en el visor y en realidad aumentada antes de empezar la obra. Para promociones de hasta 3 tipologías hay un pack desde {{price:promocion}} + IVA.',
        body: 'Lo contamos con más detalle en la página para [promotoras de obra nueva](@sol-promotoras).\n\nTrabajamos en remoto desde Marbella para toda España, y sobre todo en la costa malagueña: [maquetas 3D en Marbella](@zona-marbella), [Málaga capital](@zona-malaga) y el resto de la [Costa del Sol](@zona-costa-del-sol).',
      },
      {
        type: 'stat',
        value: '11.727',
        label: 'compraventas de vivienda nueva inscritas en la provincia de Málaga en los 12 meses cerrados en el segundo trimestre de 2026: casi un tercio de las 35.839 del total',
        source: { label: 'Colegio de Registradores, Estadística Registral Inmobiliaria', url: ERI.url },
        year: '2.º trimestre de 2026',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: '¿Cuánto cuesta pasar un plano a 3D?',
        intro: 'Precios públicos, sin IVA. El plano 3D cuesta {{price:plano3d}} por planta de hasta 150 m² y {{price:plano3d:1}} hasta 300 m². Para compararlo con otras tarifas publicadas, consulta la [guía de precios del plano 3D](@guia-precio-plano).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Material comercial, no un plano técnico',
        body: 'El plano 3D y la maqueta sirven para enseñar y vender la vivienda. No sustituyen al plano de un arquitecto ni valen para licencias, tasaciones o mediciones oficiales. Cuando el plano no trae cotas, las superficies son estimaciones (≈) y así lo indicamos.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta vuestro plano 3D?',
        a: 'En {{brand}}, el plano 3D amueblado cuesta {{price:plano3d}} + IVA por planta de hasta 150 m² y {{price:plano3d:1}} hasta 300 m². La maqueta 3D completa, con renders, visor web y realidad aumentada, cuesta {{price:maqueta}} + IVA por vivienda de hasta 150 m² y {{price:maqueta:1}} hasta 300 m². Para comparar con otras tarifas del mercado, consulta la [guía de precios del plano 3D](@guia-precio-plano).',
      },
      {
        q: '¿Cuánto tardáis en convertir un plano 2D en 3D?',
        a: '{{brand}} entrega el plano 3D en {{delivery:plano3d}} y la maqueta 3D completa en {{delivery:maqueta}}. Los días cuentan desde que tenemos el plano y una medida de referencia, e incluyen las rondas de cambios si nos las envías en 24 h. Si tienes prisa, hay entrega urgente en 48 horas con un recargo del {{extra:urgente}} sobre el total. Las promociones de obra nueva, de hasta 3 tipologías, tardan {{delivery:promocion}}.',
      },
      {
        q: '¿Qué formatos de plano aceptáis?',
        a: 'Trabajamos con PDF, JPG, PNG y, si lo tienes, DWG o DXF. También vale una foto nítida del plano de un folleto o el enlace del anuncio donde aparece. {{brand}} solo necesita un plano legible y una medida de referencia, como la superficie total o el ancho de una estancia; con eso modelamos la vivienda a escala.',
      },
      {
        q: '¿Qué pasa si el plano cambia o quiero mover un tabique?',
        a: '{{brand}} construye el modelo con scripts de Python en Blender, así que mover un tabique, cambiar un suelo o girar una cocina se reconstruye en minutos. El plano 3D incluye {{revisions:plano3d}} y la maqueta completa, {{revisions:maqueta}}. Si la distribución cambia después de la entrega, te enviamos presupuesto antes de tocar nada.',
      },
      {
        q: '¿Qué entregáis exactamente en el plano 3D?',
        a: 'El plano 3D de {{brand}} son imágenes PNG en 4K: la planta cenital a color, una vista isométrica amueblada y la planta 2D redibujada en limpio, con {{revisions:plano3d}}. El modelo 3D no se entrega en este pack: los archivos GLB, USDZ y BLEND, el visor y la realidad aumentada van con la [maqueta 3D completa](@precios), desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Vuestro plano 3D está hecho con IA?',
        a: 'No. {{brand}} levanta la vivienda con scripts de Python en Blender a partir de las medidas del plano, y las imágenes se calculan con Cycles sobre ese modelo. Una herramienta de IA genera imágenes sueltas que pueden mover ventanas o cambiar proporciones; nuestro plano 3D sale de un modelo a escala. Lo comparamos en [IA o modelo 3D real](@guia-ia-vs-3d).',
      },
      {
        q: '¿Necesitáis visitar la vivienda?',
        a: 'No. {{brand}} trabaja en remoto desde la [Costa del Sol](@zona-costa-del-sol) para agencias y promotoras de toda España: con el plano y una medida de referencia modelamos la vivienda sin pisarla. Si existe y nos mandas fotos de suelos, cocina o baños, reproducimos esos acabados; si no, proponemos materiales coherentes con el estilo que nos indiques.',
      },
      {
        q: '¿Puedo usar el plano 3D en idealista y Fotocasa?',
        a: 'Sí, como imágenes del anuncio: el plano 3D de {{brand}} son archivos PNG en 4K que subes junto a las fotos. Lo que no prometemos es incrustar el visor 3D dentro del portal, porque idealista solo admite visitas virtuales de sus proveedores compatibles. El visor funciona en tu web, por enlace, por WhatsApp o con un código QR.',
      },
    ],
    related: ['servicio-renders', 'servicio-tour', 'caso-villa', 'precios', 'guia-plano-2d-3d'],
    cta: {
      h2: '¿Vemos tu plano en 3D?',
      body: 'Envíanos el plano y te devolvemos una estancia modelada en 3D, con realidad aumentada, gratis y sin compromiso. Si te encaja, seguimos con la vivienda completa. Contesta una persona.',
    },
  },

  en: {
    title: '2D floor plan to 3D model service in Spain',
    description: 'A furnished 3D floor plan or a complete 3D model from your 2D plan, with no photos or site visit. From {{price:plano3d}} + VAT in {{delivery:plano3d}}.',
    h1: 'Floor plan to 3D model service, no photos needed',
    lead: 'For estate agents and developers: we turn a home’s 2D floor plan into a furnished, to-scale 3D model, with no photos and no site visit. A 3D floor plan starts at {{price:plano3d}} + VAT per floor, delivered in {{delivery:plano3d}}. The complete model, with renders, web viewer and AR, starts at {{price:maqueta}} + VAT.',
    breadcrumb: 'Floor plan to 3D',
    card: {
      title: 'Floor plan to 3D model',
      summary: 'Top-down plan, isometric view and a furnished 3D model from a single floor plan, with no photos or site visit.',
    },
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Cut-away 3D model of the villa at 1.15 m, with furnished rooms seen from above. 3D render generated from the 2D floor plan.',
      caption: 'Cut-away model. 3D render generated from the 2D floor plan.',
    },
    facts: [
      ['Input', 'One 2D plan (PDF, JPG, PNG or DWG), no photos'],
      ['Deliverables', 'Top-down plan, isometric view and 2D plan; 3D model with the complete package'],
      ['Formats', '4K PNG; with the complete model, GLB, USDZ and BLEND'],
      ['Price from', '{{price:plano3d}} + VAT per floor; complete model {{price:maqueta}}'],
      ['Turnaround', '{{delivery:plano3d}}; complete model {{delivery:maqueta}}'],
      ['Revisions', '{{revisions:plano3d}}; complete model {{revisions:maqueta}}'],
      ['Coverage', 'Costa del Sol, all of Spain and remote clients abroad'],
      ['Languages', 'English and Spanish'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Can you build a 3D model of a home from the floor plan alone?',
        answer: 'Yes. From a single 2D floor plan we build the home to scale: walls, openings, doors, windows, furniture and finishes. We need no photos and no site visit, so it works for off-plan units, empty or tenanted homes, and properties your buyer has never seen. Without dimensions on the plan, we measure from its scale.',
        body: 'That is exactly how we built the [Costa del Sol villa](@caso-villa) you can explore on this site. We started from {{villa:input}}. The result has {{villa:rooms}} furnished rooms, roughly {{villa:interiorM2}} m² of interior space and {{villa:textures}} [PBR](@glosario#pbr) textures made for that model, with no stock libraries.',
      },
      {
        type: 'compare',
        h2: 'From 2D plan to 3D floor plan, same camera',
        intro: 'The line plan is redrawn from our own model, not copied from the original drawing. The colour top-down render comes from the same camera and scale, which is why the two layers line up.',
      },
      {
        type: 'answer',
        h2: 'What is the difference between a 3D floor plan and a complete 3D model?',
        answer: 'A 3D floor plan is a set of 4K stills: a colour top-down plan and a furnished isometric view. The complete 3D model is the navigable version: it includes those plans plus 6 photorealistic renders, a web viewer for your listing and augmented reality on iPhone and Android.',
        body: 'Both start with the same work: modelling the home in 3D from the plan. A 3D floor plan is enough for a portal listing or a sales brochure. The complete model pays off when the buyer needs to walk through the home: off-plan sales, buyers based in the UK, the Netherlands or Scandinavia, or empty properties.\n\nThe same model produces our [real estate 3D renders](@servicio-renders) and an [interactive 3D floor plan](@servicio-tour) for your listing, with no extra modelling.',
      },
      {
        type: 'table',
        h2: '3D floor plan, AI render or 360 tour: what do you actually get?',
        intro: 'The options agents usually weigh up to show a home’s layout, compared by what they deliver and what they need from you.',
        caption: 'Ways to show a home’s layout in a property listing',
        head: ['Option', 'What you get', 'What it needs', 'Works before the home is built?'],
        rows: [
          ['Our 3D floor plan', 'Furnished 4K top-down and isometric views, generated from a 3D model', 'The 2D plan', 'Yes'],
          ['Our complete 3D model', 'Navigable model, 6 renders, web viewer and app-free AR', 'The 2D plan', 'Yes'],
          ['Budget 3D floor plan', 'A single static top-down image, with no navigable model or extra views', 'The 2D plan', 'Yes'],
          ['AI render from photos', 'Separate images: each one is generated on its own and can alter openings or proportions', 'Photos of the home', 'No'],
          ['360 tour or Matterport-style scan', 'The home exactly as it was on the day of the shoot', 'A finished home, a camera and a visit', 'No'],
        ],
        note: 'If the home already exists and you want to show its real finishes, a scan is a sound choice: we explain when in [3D model vs Matterport](@guia-matterport). Wondering whether an AI converter would do? Read [AI floor plan to 3D](@guia-ia-vs-3d).',
      },
      {
        type: 'process',
        variant: 'list',
        h2: 'How do you convert a 2D floor plan into a 3D model?',
        intro: 'Five steps and {{delivery:maqueta}} for the complete model. Tools and quality checks are covered in [our production process](@como-funciona).',
      },
      {
        type: 'needs',
        h2: 'What do you need from me to start?',
        intro: 'The plan is enough to start; the rest sharpens the result. Attach it to the form or paste the link of the listing it appears in.',
      },
      {
        type: 'answer',
        h2: 'How accurate is a 3D model built from a floor plan?',
        answer: 'As accurate as the plan it comes from. With a dimensioned plan or a DWG, the model follows the measurements. If the plan only has a scale bar, we measure from it and floor areas are approximate (≈), as in our demo villa. We say so in every delivery, so your listing never promises exact figures.',
      },
      {
        type: 'answer',
        h2: 'Does it work for off-plan property in Spain?',
        answer: 'Yes, and that is where it earns its keep. A home that has not been built has no photos, but it does have plans. We model every unit type fully furnished, so buyers abroad can see it in renders, in the viewer and in AR before ground is broken. Developments with up to 3 unit types start at {{price:promocion}} + VAT.',
        body: 'More on this on our page about [off-plan 3D visualisation](@sol-promotoras).\n\nWe work remotely from our base in Marbella for clients across Spain and abroad, with a focus on [3D rendering in Marbella and the Costa del Sol](@zona-marbella).',
      },
      {
        type: 'stat',
        value: '11,727',
        label: 'new-build home sales registered in Málaga province in the 12 months to Q2 2026: almost a third of the 35,839 total',
        source: { label: 'Colegio de Registradores (Spain’s association of land registrars), Estadística Registral Inmobiliaria', url: ERI.url },
        year: 'Q2 2026',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'How much does a 3D floor plan cost?',
        intro: 'Public prices, excluding VAT. A 3D floor plan costs {{price:plano3d}} per floor up to 150 m² and {{price:plano3d:1}} up to 300 m². Market rates for 3D floor plans in Spain, with sources, are in our [3D floor plan cost guide](@guia-precio-plano); all our rates are on the [pricing page](@precios).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Marketing material, not a technical drawing',
        body: 'Our 3D floor plans and models are made to show and sell a home. They do not replace an architect’s plan and are not valid for planning applications, valuations or official measurements. When the plan has no dimensions, floor areas are estimates (≈), and we label them as such.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'How much does a 3D floor plan cost?',
        a: 'In Spain, a 3D floor plan costs about €40 per floor on online platforms and €100 to €800 or more from studios, according to rates published in 2026. At {{brand}} it costs {{price:plano3d}} + VAT per floor up to 150 m², or {{price:plano3d:1}} up to 300 m², and the complete 3D model starts at {{price:maqueta}} + VAT. The sourced comparison is in [how much a 3D floor plan costs in Spain](@guia-precio-plano).',
      },
      {
        q: 'How long does it take to turn a floor plan into a 3D model?',
        a: '{{brand}} delivers a 3D floor plan in {{delivery:plano3d}} and the complete 3D model in {{delivery:maqueta}}. The clock starts once we have the plan and one reference measurement, and it includes the rounds of changes if you send them within 24 hours. Rush delivery in 48 hours carries a {{extra:urgente}} surcharge on the total. Developments of up to 3 unit types take {{delivery:promocion}}.',
      },
      {
        q: 'Is your 3D floor plan made with AI?',
        a: 'No. {{brand}} builds the home with Python scripts in Blender from the plan’s measurements, and the images are computed in Cycles from that model. AI tools can turn a floor plan into a 3D-looking image in seconds, but each view may move windows or change proportions, and you cannot walk through it or open it in AR. See our comparison of [AI tools and a real 3D model](@guia-ia-vs-3d).',
      },
      {
        q: 'What files can I send: PDF, JPG, DWG or a brochure photo?',
        a: 'All of them. {{brand}} works from PDF, JPG and PNG plans, and from DWG or DXF files if you have them. A sharp photo of a brochure plan or the link to the listing also works. We only need a legible plan and one reference measurement, such as the total floor area or the width of one room.',
      },
      {
        q: 'Do you need to visit the property?',
        a: 'No. {{brand}} works remotely from [Marbella](@zona-marbella) on the Costa del Sol for agencies and developers across Spain and abroad: with the plan and one reference measurement we model the home without setting foot in it. If the home exists and you send photos of floors, kitchen or bathrooms, we match those finishes; otherwise we propose materials that fit the style you choose.',
      },
      {
        q: 'What happens if the plan changes after you start?',
        a: '{{brand}} builds each model with Python scripts in Blender, so moving a partition, swapping a floor finish or turning a kitchen round is rebuilt in minutes. A 3D floor plan includes {{revisions:plano3d}} and the complete model {{revisions:maqueta}}. If the layout changes after delivery, we quote the work before touching anything.',
      },
      {
        q: 'Is there a free way to create a 3D floor plan?',
        a: 'Yes, if you have the time: apps with free tiers such as Sweet Home 3D or Planner 5D let you redraw a plan in 3D yourself, and some AI tools generate a quick image from it. {{brand}} makes sense when you need a photorealistic result that matches the plan, in {{delivery:plano3d}}, ready for a listing and without learning new software.',
      },
      {
        q: 'Can I use the 3D floor plan on property portals?',
        a: 'Yes, as listing images: our 3D floor plan is a set of 4K PNG files you upload alongside the photos. What we do not promise is an embedded 3D viewer inside a portal listing, because idealista, for example, only accepts 3D tours from its approved providers. The viewer works on your own website, by link, over WhatsApp or through a QR code.',
      },
    ],
    related: ['servicio-renders', 'servicio-tour', 'caso-villa', 'precios', 'guia-ia-vs-3d'],
    cta: {
      h2: 'Shall we see your floor plan in 3D?',
      body: 'Send us the plan and we will model one room in 3D, with augmented reality, free and with no obligation. If you like it, we carry on with the whole home. A real person replies.',
    },
  },
};
