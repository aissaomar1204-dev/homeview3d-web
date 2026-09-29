// Pricing (template `pricing`, OfferCatalog schema from build/data/pricing.mjs).
// Our prices come ONLY from tokens. Market figures in the comparison table were verified with WebFetch on
// 2026-09-28 against the page linked in each row (quoted as published; "+ IVA" only where the source says so).
// `pricing` variant `full` already renders packs, tiers, extras, volume pack, guarantees and the VAT note.

const SRC = {
  box: 'https://www.boxbrownie.com/floor-plans',
  hsd: 'https://homestagerdesign.com/producto/planos-3d/',
  imf: 'https://inmofotomadrid.es/blog/cuanto-cuesta-un-plano-en-3d/',
  ara: 'https://ararenders.com/cuanto-cuesta-un-render-3d-espana/',
  vista: 'https://vistastudiodesign.com/',
  crono: 'https://www.cronoshare.com/cuanto-cuesta/servicio-home-staging',
  mport: 'https://andreasgrunau.com/precios-matterport-espana/',
  bs: 'https://www.estudio3dbs.com/precio-render-3d-profesional-espa%C3%B1a',
  r2u: 'https://r2u.io/en/blog/ar-staging-cost-real-estate-2026/',
};

import { plate } from '../data/plates.mjs';

export default {
  id: 'precios',
  image: 'villa_bano_suite_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-29',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Tarifas de modelos 3D y renders inmobiliarios 2026',
    description: 'Plano 3D desde {{price:plano3d}} y maqueta 3D con renders, visor y AR desde {{price:maqueta}}, sin IVA. Packs, extras, volumen y comparativa con el mercado.',
    h1: 'Precios de plano 3D, renders y realidad aumentada',
    lead: 'El plano 3D cuesta {{price:plano3d}} + IVA por planta y la maqueta 3D completa, con 6 renders, visor web y realidad aumentada, {{price:maqueta}} + IVA por vivienda, en {{delivery:maqueta}}. Precios públicos y cerrados: para una vivienda estándar no hace falta pedir presupuesto.',
    breadcrumb: 'Precios',
    card: {
      title: 'Precios',
      summary: 'Tarifas públicas sin IVA: plano 3D, maqueta 3D completa, promociones, extras y pack para agencias.',
    },
    facts: [
      ['Plano 3D', 'Desde {{price:plano3d}} + IVA por planta'],
      ['Maqueta 3D completa', 'Desde {{price:maqueta}} + IVA por vivienda'],
      ['Promoción de obra nueva', 'Desde {{price:promocion}} + IVA, hasta 3 tipologías'],
      ['Pack cartera', '{{volume}} + IVA por 5 maquetas completas'],
      ['Entrega urgente', '48 horas, con un recargo del {{extra:urgente}}'],
      ['Pago', 'Cuando recibes el trabajo terminado'],
      ['IVA', '21 %, no incluido en los precios'],
      ['Precios publicados', 'Septiembre de 2026'],
    ],
    blocks: [
      {
        type: 'pricing',
        variant: 'full',
        h2: '¿Cuánto cuesta cada pack?',
        intro: 'Tres packs según lo que necesites enseñar. El precio depende de la superficie, no del número de fotos ni de cuántas veces se abra el visor. El IVA se añade en la factura.',
      },
      {
        type: 'table',
        h2: '¿Qué incluye cada pack y qué no?',
        intro: 'La decisión habitual de una agencia es entre el plano 3D y la maqueta completa. Esta es la diferencia, línea a línea.',
        caption: 'Plano 3D y maqueta 3D completa de {{brand}}: qué incluye cada uno (precios sin IVA)',
        head: ['Qué recibes', 'Plano 3D', 'Maqueta 3D completa'],
        rows: [
          ['Modelo 3D amueblado, a escala', 'Sirve de base para las imágenes; no se entrega', 'Sí, en GLB, USDZ y BLEND'],
          ['Planta cenital a color en 4K', 'Sí', 'Sí'],
          ['Planta 2D redibujada en limpio', 'Sí', 'Sí'],
          ['Imágenes fotorrealistas en 4K', 'Una vista isométrica amueblada', '6 [renders](@glosario#render) con los encuadres que elijas'],
          ['Visor 3D web con estancias, recorrido y modo maqueta', 'No', 'Sí, alojado 12 meses'],
          ['Realidad aumentada en iPhone y Android', 'No', 'Sí: maqueta 1:20 y tamaño real'],
          ['Rondas de cambios', '{{revisions:plano3d}}', '{{revisions:maqueta}}'],
          ['Plazo', '{{delivery:plano3d}}', '{{delivery:maqueta}}'],
          ['Hasta 150 m²', '{{price:plano3d}} + IVA por planta', '{{price:maqueta}} + IVA por vivienda'],
          ['De 151 a 300 m²', '{{price:plano3d:1}} + IVA por planta', '{{price:maqueta:1}} + IVA por vivienda'],
        ],
        note: 'Si solo necesitas enseñar la distribución en un portal, el [plano 3D](@servicio-plano) basta. Si el comprador tiene que recorrer la vivienda, porque está en otro país, es obra nueva o el piso está vacío, compensa la maqueta completa, con su [visor 3D](@servicio-tour) y su [realidad aumentada](@servicio-ar).',
      },
      {
        type: 'checklist',
        h2: '¿Qué no está incluido en el precio?',
        intro: 'Para que no haya sorpresas en la factura, esto se paga aparte o directamente no lo hacemos:',
        items: [
          'Fachadas y exteriores completos con entorno: necesitan alzados y más modelado, así que llevan presupuesto propio.',
          'Viviendas de más de 300 m²: te damos precio cerrado en cuanto vemos el plano.',
          'Renders por encima de los incluidos: {{extra:render}} + IVA cada uno, sobre el mismo modelo.',
          'Home staging virtual con otro estilo: {{extra:staging}} + IVA por estancia.',
          'Alojamiento del visor a partir del segundo año: {{extra:hosting}} + IVA por vivienda y año.',
          'Cambios de proyecto después de la entrega: presupuesto por escrito antes de tocar nada.',
          'Vídeos con IA y tours de realidad virtual 360: llegarán próximamente; hoy no los vendemos.',
          'Planos técnicos, mediciones oficiales o documentación para licencias: no es nuestro trabajo.',
        ],
      },
      {
        type: 'answer',
        h2: '¿Cuánto cuesta una promoción de obra nueva?',
        answer: 'Desde {{price:promocion}} + IVA por hasta 3 tipologías modeladas y amuebladas, con 12 renders en 4K, un visor 3D con selector de tipología y realidad aumentada para la sala de ventas y las ferias. Cada tipología adicional cuesta {{extra:tipologia}} + IVA. El plazo es de {{delivery:promocion}}, contado desde que tenemos los planos y una medida de referencia.',
        body: 'Una promoción no se vende con una sola imagen: el comprador quiere comparar el bajo con jardín y el ático, y ver su tipología amueblada antes de que exista. Lo contamos en la página para [promotoras de obra nueva](@sol-promotoras), y la comercialización completa, en la [guía para vender obra nueva sobre plano](@guia-sobre-plano).',
      },
      {
        type: 'answer',
        h2: '¿Hay precio especial para agencias con varias viviendas?',
        answer: 'Sí. El pack cartera incluye 5 maquetas 3D completas por {{volume}} + IVA, {{volumeUnit}} por vivienda, para usar en 6 meses en viviendas de hasta 150 m². Si encargas más a la vez, la calculadora aplica el precio por tramos a todas las viviendas del encargo, no solo a partir de la quinta: de 5 a 9, {{volumeUnit}} + IVA cada una, y desde 10, menos todavía. La calculadora te da el total.',
      },
      plate('es', 'villa_interior_salon'),
      {
        type: 'calculator',
        h2: '¿Cuánto costarían tus viviendas?',
        intro: 'Precio de la maqueta 3D completa según el número de viviendas, para viviendas de hasta 150 m². Ves el total sin IVA y con IVA.',
      },
      {
        type: 'answer',
        h2: '¿Cuánto cuesta la entrega urgente?',
        answer: 'Un {{extra:urgente}} sobre el total. Con urgencia entregamos en 48 horas desde que tenemos el plano y una medida de referencia, en lugar de {{delivery:maqueta}}. Para una promoción con fecha de feria o de lanzamiento, dinos el día antes de encargar y te confirmamos por escrito si llegamos, antes de que pagues nada.',
      },
      {
        type: 'answer',
        h2: '¿Cómo se paga y qué garantías tienes?',
        answer: 'Pagas cuando recibes el trabajo terminado, no por adelantado, y el precio queda cerrado por escrito antes de empezar. Antes de decidir puedes pedir la demo gratis: modelamos una estancia de tu plano y te la enviamos con realidad aumentada. Y la maqueta completa incluye {{revisions:maqueta}} para ajustar lo que no te encaje.',
      },
      {
        type: 'table',
        h2: '¿Cómo se comparan estos precios con el mercado?',
        intro: 'Tarifas públicas de otros proveedores que venden en España, consultadas el 28 de septiembre de 2026. No son productos idénticos, así que indicamos qué entrega cada uno. Copiamos los precios tal y como se publican.',
        caption: 'Precios publicados de visualización inmobiliaria en España (septiembre de 2026)',
        head: ['Servicio', 'Precio publicado', 'Qué entrega', 'Fuente'],
        rows: [
          ['Plano 3D en plataforma en línea', '40 € por planta', 'Una imagen 3D a color de la planta, en 48 horas', `[boxbrownie.com](${SRC.box})`],
          ['Plano 3D amueblado en tienda en línea', '119,95 € por planta de unos 60 m²', 'Una imagen 3D a color, 1 revisión, desde 72 horas', `[homestagerdesign.com](${SRC.hsd})`],
          ['Plano 3D de estudio, de básico a premium', '100 a 800 € o más', 'Imagen estática; sube con el detalle y el fotorrealismo', `[inmofotomadrid.es](${SRC.imf}), 12 feb 2026`],
          ['Render interior de estudio', '200 a 450 € por imagen', 'Una imagen fija de una estancia', `[ararenders.com](${SRC.ara}), 13 jun 2026`],
          ['Renders con IA a partir de fotos', '129 € sin IVA por inmueble, hasta 6 estancias', 'Fotos del piso redecoradas con IA; no hay modelo 3D', `[vistastudiodesign.com](${SRC.vista})`],
          ['Home staging virtual', '60 a 400 € + IVA por estancia', 'Imágenes amuebladas de una estancia', `[cronoshare.com](${SRC.crono}), 9 ene 2026`],
          ['Tour Matterport en Málaga', '190 € + IVA hasta 150 m²; 250 € + IVA hasta 300 m²', 'Escaneo 3D de una vivienda ya construida, con visita; 6 meses de publicación', `[andreasgrunau.com](${SRC.mport})`],
          ['Tour virtual 360 generado por ordenador', '700 a 2.500 €', 'Recorrido 360 de una vivienda sin construir', `[estudio3dbs.com](${SRC.bs})`],
          ['Plataforma 3D interactiva de ventas', 'Desde unos 2.700 US$ por proyecto', 'Plataforma en el navegador para promociones, de 3 a 10 semanas', `[r2u.io](${SRC.r2u}), 2026`],
          ['Maqueta 3D completa de {{brand}}', '{{price:maqueta}} + IVA hasta 150 m²', 'Modelo 3D desde el plano, 6 renders, visor web y realidad aumentada, en {{delivery:maqueta}}', 'Esta página'],
        ],
        note: 'Cuando la fuente no indica «+ IVA» o «sin IVA», no aclara si el precio lo incluye: pregúntalo antes de comparar. Los rangos de renders y planos, con más fuentes y factores de precio, están en [cuánto cuesta un render 3D en España](@guia-precio-render) y [cuánto cuesta un plano 3D](@guia-precio-plano).',
      },
      {
        type: 'answer',
        h2: '¿Dónde encaja nuestro precio?',
        answer: 'En la franja intermedia, con más entregables. Un plano 3D en línea cuesta de 40 a 120 € y es una imagen; un render de estudio, de 200 a 450 € por imagen; una plataforma 3D interactiva, desde unos 2.700 US$. Por {{price:maqueta}} + IVA, {{brand}} entrega el modelo 3D con 6 renders, visor web y realidad aumentada, en {{delivery:maqueta}}.',
        body: 'No lo conseguimos recortando calidad, sino automatizando: los muros, huecos y muebles se colocan con scripts de Python en Blender y los materiales son procedurales, así que un cambio cuesta minutos y no una tarde. La prueba está en nuestro [caso demostrativo](@caso-villa): {{villa:rooms}} estancias, {{villa:textures}} texturas creadas para ese modelo y {{villa:renders}} imágenes (6 vistas aéreas, 4 a la altura de los ojos, las dos plantas y la imagen para redes) calculadas en unos {{villa:renderMinutes}} minutos. El proceso completo, en [nuestro proceso, paso a paso](@como-funciona).',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Precios publicados en septiembre de 2026',
        body: 'Si una tarifa cambia, lo verás en esta página con su nueva fecha de actualización. El precio que te confirmemos por escrito para un encargo se mantiene aunque la tarifa cambie después.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Los precios incluyen el IVA?',
        a: 'No. Todos los precios de {{brand}} se publican sin IVA y el IVA del 21 % se añade en la factura. La maqueta 3D completa cuesta {{price:maqueta}} + IVA y el plano 3D, {{price:plano3d}} + IVA por planta. La calculadora de esta página muestra el total con y sin IVA según el número de viviendas.',
      },
      {
        q: '¿Cuándo se paga el encargo?',
        a: 'Cuando recibes el trabajo terminado. {{brand}} te confirma por escrito el precio cerrado y el plazo antes de empezar, modela la vivienda, aplica tus rondas de cambios y te entrega los archivos; entonces facturamos. No pedimos adelanto ni tarjeta para empezar, y la demo de una estancia es gratis.',
      },
      {
        q: '¿Qué pasa si necesito más cambios de los incluidos?',
        a: 'La maqueta 3D completa de {{brand}} incluye {{revisions:maqueta}} y el plano 3D, {{revisions:plano3d}}. Si después necesitas más, te decimos el precio antes de hacerlos. Los cambios pequeños, como un color o un mueble, suelen ser rápidos porque el modelo se genera con scripts. Nunca facturamos un cambio que no hayas aprobado antes.',
      },
      {
        q: '¿Qué pasa con el visor 3D después de los 12 meses?',
        a: 'La maqueta 3D completa de {{brand}} incluye 12 meses de alojamiento del visor. Si la vivienda sigue a la venta o quieres conservarlo como muestra para futuras captaciones, la renovación cuesta {{extra:hosting}} + IVA por vivienda y año. Si no renuevas, retiramos el visor, pero conservas los renders y el modelo en GLB, USDZ y BLEND que te entregamos.',
      },
      {
        q: '¿Cómo funciona el pack cartera de 5 viviendas?',
        a: 'Pagas {{volume}} + IVA por 5 maquetas 3D completas, {{volumeUnit}} por vivienda en lugar de {{price:maqueta}}, y las usas en los 6 meses siguientes en viviendas de hasta 150 m². Cada maqueta del pack de {{brand}} incluye lo mismo que la suelta: 6 renders, visor web, realidad aumentada y {{revisions:maqueta}}.',
      },
      {
        q: '¿Puedo usar los renders y el visor donde quiera?',
        a: 'Sí, para comercializar esa vivienda en cualquier canal: web, portales, redes sociales, dosier de venta, prensa y cartelería, sin pagar más por cada uso. {{brand}} solo te pide permiso para enseñar el trabajo como ejemplo en su propia web, y si no lo das, no lo publicamos. Los renders se entregan identificados como tales.',
      },
      {
        q: '¿Cómo se calcula la superficie para el precio?',
        a: 'Con la superficie de la vivienda que indica el plano o el anuncio. Hasta 150 m² se aplica el primer tramo y hasta 300 m² el segundo: la maqueta 3D completa de {{brand}} cuesta {{price:maqueta}} o {{price:maqueta:1}} + IVA. El plano 3D se cobra por planta. Si la vivienda supera los 300 m², te damos precio cerrado al ver el plano.',
      },
      {
        q: '¿La demo gratis me compromete a algo?',
        a: 'No. {{brand}} modela una estancia de tu plano en 3D y te la envía con realidad aumentada para que la abras en tu móvil. No pedimos tarjeta ni firma. Si te convence, te pasamos el precio cerrado de la vivienda completa, que es el de esta página; si no, la conversación termina ahí.',
      },
    ],
    related: ['guia-precio-render', 'guia-precio-plano', 'caso-villa', 'servicio-plano', 'sol-inmobiliarias'],
    cta: {
      h2: 'Te damos el precio exacto con tu plano',
      body: 'Envíanos el plano y te contestamos con el precio cerrado y el plazo. Si antes quieres ver cómo trabajamos, modelamos gratis una estancia y te la mandamos con realidad aumentada. Contesta una persona.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: '3D floor plan, 3D model and render pricing 2026',
    description: '3D floor plans from {{price:plano3d}}; the complete 3D model with renders, viewer and AR from {{price:maqueta}}, ex VAT. Extras, volume and market rates.',
    h1: 'Pricing for 3D floor plans, renders and AR',
    lead: 'A 3D floor plan costs {{price:plano3d}} + VAT per floor, and the complete 3D model, with 6 renders, a web viewer and augmented reality, {{price:maqueta}} + VAT per home, delivered in {{delivery:maqueta}}. Public, fixed prices: for a typical property there is no quote to wait for.',
    breadcrumb: 'Pricing',
    card: {
      title: 'Pricing',
      summary: 'Public prices excluding VAT: 3D floor plan, complete 3D model, developments, extras and a portfolio pack for agencies.',
    },
    facts: [
      ['3D floor plan', 'From {{price:plano3d}} + VAT per floor'],
      ['Complete 3D model', 'From {{price:maqueta}} + VAT per home'],
      ['New-build development', 'From {{price:promocion}} + VAT, up to 3 unit types'],
      ['Portfolio pack', '{{volume}} + VAT for 5 complete models'],
      ['Rush delivery', '48 hours, with a {{extra:urgente}} surcharge'],
      ['Payment', 'When you receive the finished work'],
      ['VAT', 'Spanish VAT at 21%, not included'],
      ['Prices published', 'September 2026'],
    ],
    blocks: [
      {
        type: 'pricing',
        variant: 'full',
        h2: 'What does each package cost?',
        intro: 'Three packages, depending on what you need to show. The price depends on floor area, not on the number of images or how often the viewer is opened. VAT is added on the invoice.',
      },
      {
        type: 'table',
        h2: 'What is included, and what is not?',
        intro: 'Most agents choose between the 3D floor plan and the complete model. Here is the difference, line by line.',
        caption: 'Our 3D floor plan and complete 3D model: what each includes (prices ex VAT)',
        head: ['What you get', '3D floor plan', 'Complete 3D model'],
        rows: [
          ['Furnished 3D model, to scale', 'Used to produce the images; not delivered', 'Yes, as GLB, USDZ and BLEND'],
          ['4K colour top-down plan', 'Yes', 'Yes'],
          ['Clean redrawn 2D plan', 'Yes', 'Yes'],
          ['Photorealistic 4K images', 'One furnished isometric view', '6 [renders](@glosario#render), framed as you choose'],
          ['Web 3D viewer with rooms, guided tour and cut-away mode', 'No', 'Yes, hosted for 12 months'],
          ['Augmented reality on iPhone and Android', 'No', 'Yes: 1:20 tabletop and real size'],
          ['Rounds of changes', '{{revisions:plano3d}}', '{{revisions:maqueta}}'],
          ['Turnaround', '{{delivery:plano3d}}', '{{delivery:maqueta}}'],
          ['Up to 150 m²', '{{price:plano3d}} + VAT per floor', '{{price:maqueta}} + VAT per home'],
          ['151 to 300 m²', '{{price:plano3d:1}} + VAT per floor', '{{price:maqueta:1}} + VAT per home'],
        ],
        note: 'If you only need to show the layout on a portal, the [3D floor plan](@servicio-plano) is enough. If the buyer needs to walk through the home, because they live abroad, the property is off-plan or it is empty, the complete model pays off, with its [interactive 3D viewer](@servicio-tour) and [app-free AR](@servicio-ar).',
      },
      {
        type: 'checklist',
        h2: 'What is not included in the price?',
        intro: 'So the invoice holds no surprises, these are charged separately or are simply not something we do:',
        items: [
          'Full façades and exteriors with landscaping: they need elevation drawings and more modelling, so they are quoted separately.',
          'Homes larger than 300 m²: we give you a fixed price as soon as we see the plan.',
          'Renders beyond those included: {{extra:render}} + VAT each, from the same model.',
          'Virtual staging in a second style: {{extra:staging}} + VAT per room.',
          'Viewer hosting from the second year: {{extra:hosting}} + VAT per home per year.',
          'Design changes after delivery: a written quote before we touch anything.',
          'AI videos and 360° VR tours: coming soon; we do not sell them yet.',
          'Technical drawings, official measurements or planning paperwork: not our line of work.',
        ],
      },
      {
        type: 'answer',
        h2: 'How much does an off-plan development cost?',
        answer: 'From {{price:promocion}} + VAT for up to 3 unit types, modelled and furnished, with 12 renders in 4K, a 3D viewer with a unit-type selector and augmented reality for the sales suite and property fairs. Each extra unit type costs {{extra:tipologia}} + VAT. Turnaround is {{delivery:promocion}}, counted from when we have the plans and one reference measurement.',
        body: 'A development does not sell on a single image: buyers want to compare the ground-floor unit with a garden against the penthouse, and to see their own unit furnished before it exists. More on our page about [off-plan 3D visualisation](@sol-promotoras).',
      },
      {
        type: 'answer',
        h2: 'Do you offer volume pricing for agencies?',
        answer: 'Yes. The portfolio pack covers 5 complete 3D models for {{volume}} + VAT, {{volumeUnit}} per home, to be used within 6 months on homes up to 150 m². Order more at once and the calculator applies tiered pricing to every home in the order, not just from the fifth: from 5 to 9 homes each costs {{volumeUnit}} + VAT, and from 10 it drops again. The calculator below works out the total.',
      },
      plate('en', 'villa_interior_salon'),
      {
        type: 'calculator',
        h2: 'What would your properties cost?',
        intro: 'Price of the complete 3D model by number of homes, for homes up to 150 m². You see the total with and without VAT.',
      },
      {
        type: 'answer',
        h2: 'How much is rush delivery?',
        answer: 'A {{extra:urgente}} surcharge on the total. On a rush job we deliver in 48 hours from receiving the plan and one reference measurement, instead of {{delivery:maqueta}}. For a development with a fair or launch date, tell us the date before you order and we will confirm in writing whether we can meet it, before you pay anything.',
      },
      {
        type: 'answer',
        h2: 'How do I pay, and what guarantees do I get?',
        answer: 'You pay when you receive the finished work, not up front, and the price is fixed in writing before we start. Before deciding, you can ask for the free demo: we model one room of your plan and send it to you in augmented reality. The complete model also includes {{revisions:maqueta}} to adjust anything that is not right.',
      },
      {
        type: 'table',
        h2: 'How do these prices compare with the market?',
        intro: 'Published rates from other providers selling in Spain, checked on 28 September 2026. They are not identical products, so we show what each one delivers. Prices are quoted exactly as published, in the currency shown.',
        caption: 'Published prices for property visualisation in Spain (September 2026)',
        head: ['Service', 'Published price', 'What you get', 'Source'],
        rows: [
          ['3D floor plan, online platform', '€40 per floor', 'One colour 3D image of the floor plan, in 48 hours', `[boxbrownie.com](${SRC.box})`],
          ['Furnished 3D floor plan, online shop', '€119.95 per floor of about 60 m²', 'One colour 3D image, 1 revision, from 72 hours', `[homestagerdesign.com](${SRC.hsd}) (Spanish)`],
          ['Studio 3D floor plan, basic to premium', '€100 to €800 or more', 'A still image; the price rises with detail and realism', `[inmofotomadrid.es](${SRC.imf}) (Spanish), 12 Feb 2026`],
          ['Studio interior render', '€200 to €450 per image', 'One still image of one room', `[ararenders.com](${SRC.ara}) (Spanish), 13 Jun 2026`],
          ['AI renders from photos', '€129 ex VAT per property, up to 6 rooms', 'Photos of the flat restyled by AI; no 3D model', `[vistastudiodesign.com](${SRC.vista}) (Spanish)`],
          ['Virtual staging', '€60 to €400 + VAT per room', 'Furnished images of one room', `[cronoshare.com](${SRC.crono}) (Spanish), 9 Jan 2026`],
          ['Matterport tour in Málaga', '€190 + VAT up to 150 m²; €250 + VAT up to 300 m²', '3D scan of a finished home, with a site visit; 6 months online', `[andreasgrunau.com](${SRC.mport})`],
          ['Computer-generated 360° tour', '€700 to €2,500', '360° walkthrough of a home that is not yet built', `[estudio3dbs.com](${SRC.bs}) (Spanish)`],
          ['Interactive 3D sales platform', 'From about US$2,700 per project', 'Browser-based platform for developments, in 3 to 10 weeks', `[r2u.io](${SRC.r2u}), 2026`],
          ['{{brand}} complete 3D model', '{{price:maqueta}} + VAT up to 150 m²', '3D model from the plan, 6 renders, web viewer and augmented reality, in {{delivery:maqueta}}', 'This page'],
        ],
        note: 'Where a source does not say “+ VAT” or “ex VAT”, it does not state whether the price includes it, so ask before comparing. For more sources and the factors behind the prices, see our guides to [3D rendering costs in Spain](@guia-precio-render) and to [3D floor plan prices](@guia-precio-plano).',
      },
      {
        type: 'answer',
        h2: 'Where does our price sit?',
        answer: 'In the middle band, with more deliverables. An online 3D floor plan costs €40 to €120 and is one image; a studio render, €200 to €450 per image; an interactive 3D platform, from about US$2,700. For {{price:maqueta}} + VAT, {{brand}} delivers the 3D model with 6 renders, a web viewer and augmented reality, in {{delivery:maqueta}}.',
        body: 'We get there by automating, not by cutting corners: walls, openings and furniture are placed by Python scripts in Blender and the materials are procedural, so a change takes minutes rather than an afternoon. The proof is our [case study](@caso-villa): {{villa:rooms}} rooms, {{villa:textures}} textures made for that model and {{villa:renders}} images (6 aerial views, 4 eye-level views, both plans and the social media image) computed in about {{villa:renderMinutes}} minutes. The full process is in [our step-by-step process](@como-funciona).',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Prices published in September 2026',
        body: 'If a rate changes, you will see it on this page with a new update date. Any price we confirm to you in writing for a project stands, even if the published rate changes afterwards.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'Do your prices include VAT?',
        a: 'No. Every {{brand}} price is published excluding VAT, and Spanish VAT at 21% is added on the invoice. The complete 3D model costs {{price:maqueta}} + VAT and the 3D floor plan {{price:plano3d}} + VAT per floor. Business clients elsewhere in the EU should check with their adviser how VAT applies to them. The calculator shows totals with and without VAT.',
      },
      {
        q: 'When do I pay for the work?',
        a: 'When you receive the finished work. {{brand}} confirms the fixed price and turnaround in writing before starting, models the home, applies your rounds of changes and hands over the files; then we invoice. We ask for no deposit and no card details to get started, and the one-room demo is free.',
      },
      {
        q: 'What if I need more changes than are included?',
        a: 'The {{brand}} complete 3D model includes {{revisions:maqueta}} and the 3D floor plan {{revisions:plano3d}}. If you need more afterwards, we tell you the price before doing them. Small changes, such as a colour or a piece of furniture, are usually quick because the model is generated by scripts. We never invoice a change you have not approved first.',
      },
      {
        q: 'What happens to the 3D viewer after 12 months?',
        a: 'The {{brand}} complete 3D model includes 12 months of viewer hosting. If the property is still on the market, or you want to keep it as a sample for future valuations, renewal costs {{extra:hosting}} + VAT per home per year. If you do not renew, we take the viewer down, but you keep the renders and the GLB, USDZ and BLEND files we delivered.',
      },
      {
        q: 'How does the 5-home portfolio pack work?',
        a: 'You pay {{volume}} + VAT for 5 complete 3D models, {{volumeUnit}} per home instead of {{price:maqueta}}, and use them over the following 6 months on homes up to 150 m². Each model in the Portfolio pack includes the same as a single one: 6 renders, a web viewer, augmented reality and {{revisions:maqueta}}.',
      },
      {
        q: 'Can I use the renders and the viewer anywhere?',
        a: 'Yes, to market that property in any channel: website, portals, social media, sales brochures, press and signage, with no extra fee per use. {{brand}} only asks your permission to show the work as an example on our own site, and if you say no, we do not publish it. Renders are delivered clearly labelled as renders.',
      },
      {
        q: 'How is floor area measured for pricing?',
        a: 'We use the floor area stated on the plan or in the listing. Up to 150 m² falls in the first band and up to 300 m² in the second: the {{brand}} complete 3D model costs {{price:maqueta}} or {{price:maqueta:1}} + VAT. The 3D floor plan is priced per floor. For homes over 300 m², we give you a fixed price once we see the plan.',
      },
      {
        q: 'Does the free demo commit me to anything?',
        a: 'No. {{brand}} models one room of your plan in 3D and sends it to you in augmented reality to open on your phone. We ask for no card and no signature. If you like it, we send the fixed price for the whole home, which is the one on this page; if not, that is the end of it.',
      },
    ],
    related: ['guia-precio-render', 'guia-precio-plano', 'caso-villa', 'servicio-plano', 'sol-inmobiliarias'],
    cta: {
      h2: 'Get the exact price for your floor plan',
      body: 'Send us the plan and we reply with a fixed price and turnaround. If you would like to see how we work first, we model one room free of charge and send it to you in augmented reality. A real person replies.',
      service: 'maqueta',
    },
  },
};
