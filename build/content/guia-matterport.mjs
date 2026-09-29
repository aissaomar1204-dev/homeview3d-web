// Guide (ES + EN): 3D model from a floor plan vs Matterport scan vs photographic 360 tour.
// ES cluster C4b «alternativa a Matterport» (PAA: ¿Cuánto vale Matterport?, ¿Qué cámaras son compatibles con Matterport?,
// ¿Qué es Matterport y para qué se utiliza?). EN cluster C10 «matterport alternative (without site visit)».
// Third-party figures verified on 2026-09-28:
//  - matterport.com/plans (rendered in a browser from Spain, EUR): Free 0 € (1 active space, 2 users); Starter from €13/mo
//    monthly or €11/mo billed annually (5-20 spaces); Professional €65 / €53 (20-150); Business €332 / €277 (100-300);
//    Enterprise on request. Schematic floor plans €20 per space on Starter, €15 on Professional/Business. Starter adds
//    "Share & embed anywhere"; Free lists "Defurnish your property with AI" and capture with "a phone, tablet or 360 camera"
//    ("Limited camera support" on Free and Starter). An Active Space is "the fully immersive 3D digital twin or model of a
//    physical space". No AR placement feature is listed in any plan.
//  - matterport.com/cameras: Pro3 accuracy "+/- 20 mm @ 10" (m); Pro2 and Pro3 only on Professional, Business, Enterprise.
//  - andreasgrunau.com (Matterport Pro3 scanning service, Málaga): 190 € + IVA up to 150 m², 250 € up to 300 m²,
//    470 € up to 1,000 m²; delivery 24/48 h; 6 months of hosting included, then 50 €/year; schematic plan 35 € + IVA.
//  - cronoshare.com (5 Jan 2026): photographic 360 tour 190 to 350 € per pack (national average), 220 to 320 € for
//    90 to 140 m², prices orientative and without VAT unless stated.
// Our own prices come ONLY from tokens.

const MP = 'https://matterport.com/plans';
const MPCAM = 'https://matterport.com/cameras';
const AG = 'https://andreasgrunau.com/precios-matterport-espana/';
const CRONO = 'https://www.cronoshare.com/cuanto-cuesta/tour-virtual-360';

import { plate } from '../data/plates.mjs';

export default {
  id: 'guia-matterport',
  image: 'villa_muros_completos_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Alternativa a Matterport sin visita: 3D desde el plano',
    description: 'Qué necesita cada opción, si sirve sin la vivienda construida, AR, plazo y precio. Matterport desde 13 € al mes; el modelo desde plano, {{price:maqueta}} + IVA.',
    h1: 'Alternativa a Matterport: modelo 3D desde plano o tour 360',
    lead: 'Si la vivienda no está construida, está ocupada o lejos, elige un modelo 3D desde el plano; si existe y sus acabados venden, un escaneo Matterport o un tour 360. Aquí tienes la comparativa con precios verificados. Nuestro modelo desde plano cuesta desde {{price:maqueta}} + IVA y se entrega en {{delivery:maqueta}}.',
    breadcrumb: 'Modelo 3D o Matterport',
    card: {
      title: '¿Modelo 3D desde plano, Matterport o tour 360?',
      summary: 'Qué necesita cada opción, si sirve para obra nueva, fotorrealismo, realidad aumentada, plazo y precio, con fuentes.',
    },
    hero: {
      image: 'villa_muros_completos',
      alt: 'Modelo 3D de la planta alta de la villa con los muros completos a 2,60 m, en vista aérea. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'Vista de conjunto del modelo, el equivalente a la vista «dollhouse» de un escaneo. Render generado desde el plano 2D.',
    },
    facts: [
      ['Sin vivienda construida', 'Solo sirve el modelo 3D desde el plano'],
      ['Con vivienda terminada', 'Escaneo Matterport o tour 360 fotográfico'],
      ['Matterport', 'Plan gratuito; Starter desde 13 € al mes'],
      ['Escaneo con proveedor', 'Desde 190 € + IVA hasta 150 m² (Málaga)'],
      ['Tour 360 fotográfico', '190 a 350 € por pack, media en España'],
      ['Modelo desde plano', 'Desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}'],
      ['Realidad aumentada sin app', 'Solo incluida en el modelo desde plano'],
      ['Precios revisados', '28 de septiembre de 2026'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué elegir: modelo 3D desde plano, Matterport o tour 360?',
        answer: 'Si la vivienda no está construida, está ocupada o no puedes ir, un modelo 3D desde el plano es la única de las tres opciones que funciona, y la única que se abre en realidad aumentada sin app. Si la vivienda existe y sus acabados reales son su mejor argumento, un escaneo Matterport o un tour 360 los enseñan tal cual, y suelen costar menos.',
        body: 'Matterport define cada escaneo como el gemelo digital en 3D de un espacio físico. Esa es la clave: un escaneo o un tour 360 necesitan que la vivienda exista y que alguien la visite con una cámara. Un modelo desde el plano se construye a partir del dibujo, así que sirve igual para una promoción sin empezar que para un piso alquilado en otra ciudad.\n\nVendemos modelos 3D desde plano, así que somos parte interesada. Por eso cada precio de terceros enlaza a la página que lo publica, con la fecha de consulta.',
      },
      {
        type: 'table',
        h2: '¿En qué se diferencian? Comparativa en 11 criterios',
        intro: 'Precios consultados el 28 de septiembre de 2026 en las páginas enlazadas. Los de Matterport son los que muestra su web en euros: precios «desde», según el número de espacios.',
        caption: 'Modelo 3D desde plano, escaneo Matterport y tour 360 fotográfico (septiembre de 2026)',
        head: ['Criterio', 'Modelo 3D desde plano', 'Escaneo Matterport', 'Tour 360 fotográfico'],
        rows: [
          ['Qué necesita', 'El plano 2D (PDF, JPG o DWG)', 'La vivienda, una visita y un móvil, una cámara 360 o una cámara Matterport', 'La vivienda, una visita y una cámara 360'],
          ['¿Sirve sin la vivienda construida?', 'Sí', 'No', 'No'],
          ['Qué enseña', 'La vivienda amueblada según el plano y los acabados elegidos', 'La vivienda real el día del escaneo', 'La vivienda real el día de las fotos'],
          ['Fotorrealismo', 'Renders 4K con luz calculada; el visor es 3D en tiempo real', 'Panorámicas fotográficas reales dentro del recorrido', 'Panorámicas fotográficas reales'],
          ['Vista de conjunto', '[Modo maqueta](@glosario#modo-maqueta) con muros cortados a {{villa:cutHeight}} m', 'Vista «dollhouse» del escaneo', 'No: se salta de panorámica en panorámica'],
          ['Medidas', 'Las del plano; sin cotas, estimadas (≈)', 'Medición sobre el escaneo', 'No está pensado para medir'],
          ['Realidad aumentada sin app', 'Incluida: maqueta 1:20 y tamaño real', 'No figura en sus planes', 'No'],
          ['Incrustable en tu web', 'Sí, con código iframe', 'Sí, desde el plan Starter', 'Según la plataforma'],
          ['Cambiar muebles o acabados', 'Sí, sobre el mismo modelo', 'No: enseña lo que hay (ofrece vaciado con IA)', 'No: hay que repetir las fotos'],
          ['Plazo', '{{delivery:maqueta}} desde el plano', 'Visita y entrega en 24 a 48 horas (proveedor en Málaga)', 'Visita y edición, según el fotógrafo'],
          ['Precio', 'Desde {{price:maqueta}} + IVA, con 6 renders y AR', 'Servicio desde 190 € + IVA hasta 150 m², o suscripción desde 13 € al mes con captura propia', '190 a 350 € por pack de media; 220 a 320 € para 90 a 140 m²'],
        ],
        note: 'Fuentes: [matterport.com](' + MP + '), [andreasgrunau.com](' + AG + ') para el escaneo con cámara Pro3 en Málaga (IVA aparte) y [cronoshare.com](' + CRONO + ') para el tour 360 (precios orientativos sin IVA, enero de 2026). Comprueba el IVA de cada proveedor al contratar. Si buscas un tour 360 generado por ordenador para obra nueva, sus precios están en [cuánto cuesta un render 3D](@guia-precio-render).',
      },
      {
        type: 'answer',
        h2: '¿Cuánto vale Matterport?',
        answer: 'Matterport tiene un plan gratuito con 1 espacio activo y planes de pago que, según su web, parten de 13 € al mes (Starter, de 5 a 20 espacios) o de 11 € al mes con pago anual. Professional arranca en 65 € y Business en 332 € al mes. A eso se suma la captura: con tu propio equipo o contratando a un proveedor.',
        body: 'Si no quieres comprar cámara ni suscripción, contratas el servicio completo. Un proveedor de Málaga con cámara Pro3 publica 190 € + IVA hasta 150 m², 250 € hasta 300 m² y 470 € hasta 1.000 m², con entrega en 24 a 48 horas, 6 meses de publicación incluidos y 50 € al año después. El plano esquemático se paga aparte: 35 € + IVA.',
      },
      {
        type: 'table',
        caption: 'Planes de Matterport: precios «desde» en euros (28 de septiembre de 2026)',
        head: ['Plan', 'Espacios activos', 'Pago mensual', 'Pago anual, por mes', 'Detalle útil'],
        rows: [
          ['Free', '1', '0 €', '0 €', '2 usuarios; captura con móvil, tableta o cámara 360'],
          ['Starter', '5 a 20', 'Desde 13 €', 'Desde 11 €', 'Compartir e incrustar; plano esquemático a 20 € por espacio'],
          ['Professional', '20 a 150', 'Desde 65 €', 'Desde 53 €', 'Admite las cámaras Pro2 y Pro3; plano a 15 €'],
          ['Business', '100 a 300', 'Desde 332 €', 'Desde 277 €', '50 usuarios; plano a 15 €'],
          ['Enterprise', 'A medida', 'Consultar', 'Consultar', 'Descuentos por volumen en planos'],
        ],
        note: 'Fuente: [planes de Matterport](' + MP + ') y [comparativa de cámaras](' + MPCAM + '). Cada vivienda publicada ocupa un espacio activo mientras siga activa.',
      },
      {
        type: 'checklist',
        h2: '¿Cuándo compensa un modelo 3D desde el plano?',
        intro: 'Cuando la vivienda no se puede o no conviene fotografiar tal como está.',
        items: [
          'La vivienda está sobre plano o en construcción: no hay nada que escanear.',
          'Está alquilada u ocupada y no puedes enseñarla ni fotografiarla bien.',
          'Está vacía o mal amueblada y quieres enseñarla amueblada, con los mismos muebles en renders, visor y realidad aumentada.',
          'Vas a proponer una reforma y el comprador tiene que ver cómo quedará, no cómo está.',
          'El inmueble está lejos y desplazar a un fotógrafo cuesta más que el propio tour.',
          'Quieres que el comprador la coloque sobre su mesa, o a tamaño real, desde su móvil y sin instalar nada.',
          'Necesitas renders fotorrealistas además del recorrido, y que coincidan entre sí.',
        ],
      },
      {
        type: 'checklist',
        h2: '¿Cuándo es mejor Matterport o un tour 360?',
        intro: 'Cuando la vivienda existe y su estado real vende por sí solo.',
        items: [
          'La vivienda está terminada, bien presentada y sus acabados son el argumento de venta.',
          'Las vistas, el jardín o la piscina pesan en el precio: una foto real los enseña mejor que un modelo hecho desde la planta.',
          'Necesitas documentar el estado actual para una reforma o un seguro.',
          'Publicas muchas viviendas terminadas al mes y te compensa una suscripción con captura propia.',
          'Quieres el tour publicado a los dos días de la visita.',
          'Tu portal admite tours de ese proveedor dentro del anuncio.',
        ],
      },
      {
        type: 'answer',
        h2: '¿Se pueden combinar un modelo desde plano y un escaneo?',
        answer: 'Sí, y en obra nueva es lo lógico. Durante la preventa, cada tipología se enseña con el modelo 3D, los renders y la realidad aumentada. Cuando termina la obra, el escaneo o el tour 360 de la vivienda terminada toma el relevo, porque ya hay algo real que enseñar. En segunda mano funciona al revés: se escanea el estado actual y se modela la reforma propuesta.',
        body: 'Cómo se organiza una campaña de preventa completa, en [cómo vender viviendas sobre plano](@guia-sobre-plano). Qué incluye el visor que entregamos, en el [tour virtual 3D sin visita](@servicio-tour).',
      },
      {
        type: 'answer',
        h2: '¿Qué precisión tienen las medidas en cada opción?',
        answer: 'Un escaneo mide la vivienda real: Matterport indica una precisión de ±20 mm a 10 m para su cámara Pro3. Un modelo desde plano es tan preciso como el plano: con cotas o DWG respeta las medidas; sin ellas, las superficies son estimaciones (≈). Un tour 360 fotográfico no está pensado para medir.',
        body: 'En nuestro [caso demostrativo](@caso-villa) partimos de {{villa:input}}; por eso damos las superficies como aproximadas: unos {{villa:interiorM2}} m² interiores y {{villa:terracesM2}} m² de terrazas. En un encargo real trabajamos con el plano acotado del cliente.',
      },
      {
        type: 'viewer',
        h2: 'Compruébalo: una villa modelada solo desde su plano',
        intro: 'Es el modelo de nuestro caso demostrativo: {{villa:rooms}} estancias, sin fotos ni visita. Gíralo, entra en cada estancia y compáralo con cualquier tour 360.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Lo que un modelo desde plano no enseña',
        body: 'El estado real de la vivienda: desgaste, humedades, las vistas exactas desde cada ventana o el ruido de la calle. Un modelo enseña el proyecto o la propuesta, no el inmueble tal como está hoy. Si el comprador necesita eso, la visita, el escaneo o un buen reportaje fotográfico siguen siendo imprescindibles.',
      },
      plate('es', 'villa_salon_dormitorio_opaco'),
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'Matterport: planes y precios', url: MP, note: 'Precios en euros mostrados el 28 sep 2026.' },
          { label: 'Matterport: comparativa de cámaras Pro2 y Pro3', url: MPCAM, note: 'Precisión y planes compatibles.' },
          { label: 'andreasgrunau.com: precios de escaneo Matterport en España', url: AG, note: 'Proveedor en Málaga. Consultado el 28 sep 2026.' },
          { label: 'cronoshare.com: cuánto cuesta un tour virtual 360 (5 ene 2026)', url: CRONO, note: 'Precios orientativos sin IVA.' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué es Matterport y para qué se utiliza?',
        a: 'Matterport es una plataforma que convierte una vivienda o un local existente en un gemelo digital en 3D: se escanea con un móvil, una cámara 360 o una cámara Matterport, y el visitante lo recorre desde el navegador, con su vista «dollhouse». Se usa en inmobiliaria, seguros y reformas. Para viviendas sin construir, {{brand}} crea el modelo 3D a partir del plano.',
      },
      {
        q: '¿Hay una versión gratuita de Matterport?',
        a: 'Sí. El plan Free de Matterport permite 1 espacio activo y 2 usuarios, con captura desde un móvil, una tableta o una cámara 360. Compartir e incrustar el tour aparece en el plan Starter, desde 13 € al mes según su web. {{brand}} no vende suscripciones: el modelo 3D desde plano cuesta desde {{price:maqueta}} + IVA e incluye 12 meses de alojamiento del visor.',
      },
      {
        q: '¿Qué cámaras son compatibles con Matterport?',
        a: 'Según Matterport, cualquier plan permite capturar con un móvil, una tableta o una cámara 360 compatible, con soporte limitado en Free y Starter. Sus cámaras propias, Pro2 y Pro3, exigen el plan Professional o superior; la Pro3 usa lidar. Si la vivienda no existe, no hay nada que escanear: {{brand}} la modela desde el plano en {{delivery:maqueta}}.',
      },
      {
        q: '¿Se puede hacer un tour de Matterport de una vivienda sobre plano?',
        a: 'No. Matterport escanea espacios físicos, así que una vivienda sin construir no se puede capturar; como mucho, se escanea un piso piloto ya montado. Para vender sobre plano, {{brand}} modela cada tipología desde los planos del proyecto, con renders, visor y realidad aumentada, desde {{price:promocion}} + IVA para 3 tipologías, en {{delivery:promocion}}.',
      },
      {
        q: '¿Qué alternativa hay a Matterport si no puedo visitar la vivienda?',
        a: 'Un modelo 3D creado desde el plano. No necesita cámara ni visita: con el plano y una medida de referencia, {{brand}} modela la vivienda amueblada y la entrega con visor web, 6 renders y realidad aumentada, desde {{price:maqueta}} + IVA en {{delivery:maqueta}}. Sirve para viviendas alquiladas, lejanas, vacías o en construcción.',
      },
      {
        q: '¿Cuánto cobra un fotógrafo por un tour 360 en España?',
        a: 'Según cronoshare.com, en enero de 2026 un tour 360 fotográfico costaba en España de 190 a 350 € por pack de media, y de 220 a 320 € para una vivienda de 90 a 140 m², sin IVA y como precio orientativo. Exige que la vivienda exista y esté presentable. El modelo 3D de {{brand}} parte del plano, desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Qué conviene para vender una vivienda de segunda mano?',
        a: 'Si está bien presentada, un escaneo o un tour 360 enseñan su estado real y suelen costar menos. Si está vacía, anticuada, alquilada o lejos, un modelo desde el plano la enseña amueblada o reformada, con los mismos muebles en todas las vistas. {{brand}} lo entrega en {{delivery:maqueta}}, con visor y realidad aumentada, desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Es tan realista un modelo desde plano como un escaneo?',
        a: 'En los renders, sí: {{brand}} calcula cada imagen en 4K con luz física en Blender Cycles y materiales [PBR](@glosario#pbr) creados para cada vivienda. El visor web es 3D en tiempo real, más ligero y algo menos fotográfico. La diferencia de fondo es otra: un escaneo enseña lo que hay; el modelo enseña el proyecto o la propuesta.',
      },
    ],
    related: ['servicio-tour', 'servicio-plano', 'caso-villa', 'guia-sobre-plano', 'precios'],
    cta: {
      h2: '¿Tu vivienda no se puede escanear?',
      body: 'Envíanos el plano: modelamos gratis una estancia y te la mandamos en realidad aumentada, para que la compares con un tour 360. Sin compromiso.',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'Matterport alternative without a site visit: 3D model',
    description: 'What each option needs, whether it works off-plan, AR, turnaround and price. Matterport from €13 a month; a 3D model from the plan from {{price:maqueta}} + VAT.',
    h1: 'Matterport alternative: floor plan 3D model or 360 tour?',
    lead: 'If the home isn’t built yet, is tenanted or is a flight away, use a 3D model from the floor plan; if it exists and its finishes sell it, a Matterport scan or a 360 tour. Here is the comparison, with checked prices. Ours starts at {{price:maqueta}} + VAT, delivered in {{delivery:maqueta}}.',
    breadcrumb: '3D model vs Matterport',
    card: {
      title: '3D model from a plan, Matterport or 360 tour?',
      summary: 'What each option needs, whether it works off-plan, photorealism, AR, turnaround and price, with sources.',
    },
    hero: {
      image: 'villa_muros_completos',
      alt: '3D model of the villa’s upper floor with full-height walls at 2.60 m, aerial view. 3D render generated from the 2D floor plan of an anonymised case.',
      caption: 'Overview of the model, the equivalent of a scan’s dollhouse view. Render generated from the 2D floor plan.',
    },
    facts: [
      ['Home not built yet', 'Only a 3D model from the plan works'],
      ['Finished home', 'Matterport scan or photographic 360 tour'],
      ['Matterport', 'Free plan; Starter from €13 a month'],
      ['Scan by a provider', 'From €190 + VAT up to 150 m² (Málaga)'],
      ['Photographic 360 tour', '€190 to €350 per package, Spanish average'],
      ['Model from the plan', 'From {{price:maqueta}} + VAT, in {{delivery:maqueta}}'],
      ['App-free AR', 'Only included with the model from the plan'],
      ['Prices checked', '28 September 2026'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Which should you choose: a model from the plan, Matterport or a 360 tour?',
        answer: 'If the home is off-plan, tenanted or out of reach, a 3D model built from the floor plan is the only one of the three that works, and the only one buyers can open in augmented reality without an app. If the home exists and its real finishes are its best argument, a Matterport scan or a 360 tour shows them as they are, usually for less.',
        body: 'Matterport describes each scan as the 3D digital twin of a physical space. That is the whole point: a scan or a 360 tour needs the home to exist and someone to walk through it with a camera. A model built from the plan starts from the drawing, so it works as well for a development that hasn’t broken ground as for a flat in Estepona whose owner lives in Oslo.\n\nWe sell 3D models built from plans, so we have a stake in this. That is why every third-party price links to the page that publishes it, with the date we checked it.',
      },
      {
        type: 'table',
        h2: 'How do they compare? 11 criteria side by side',
        intro: 'Prices checked on 28 September 2026 on the pages linked below. Matterport’s are the euro prices its website displayed from Spain: “from” prices that depend on the number of spaces.',
        caption: '3D model from a floor plan, Matterport scan and photographic 360 tour (September 2026)',
        head: ['Criterion', '3D model from the plan', 'Matterport scan', 'Photographic 360 tour'],
        rows: [
          ['What it needs', 'The 2D floor plan (PDF, JPG or DWG)', 'The home, a visit and a phone, 360 camera or Matterport camera', 'The home, a visit and a 360 camera'],
          ['Works before the home is built?', 'Yes', 'No', 'No'],
          ['What it shows', 'The home furnished to the plan and the chosen finishes', 'The real home on the day of the scan', 'The real home on the day of the shoot'],
          ['Photorealism', '4K renders with computed daylight; the viewer is real-time 3D', 'Real photographic panoramas inside the tour', 'Real photographic panoramas'],
          ['Overview', '[Cut-away mode](@glosario#modo-maqueta) with walls cut at {{villa:cutHeight}} m', 'The scan’s dollhouse view', 'No: you jump from panorama to panorama'],
          ['Measurements', 'From the plan; estimated (≈) without dimensions', 'Measured on the scan', 'Not designed for measuring'],
          ['App-free augmented reality', 'Included: 1:20 tabletop and real size', 'Not listed in its plans', 'No'],
          ['Embeddable on your site', 'Yes, with an iframe code', 'Yes, from the Starter plan', 'Depends on the platform'],
          ['Change furniture or finishes', 'Yes, on the same model', 'No: it shows what is there (AI defurnishing on offer)', 'No: reshoot needed'],
          ['Turnaround', '{{delivery:maqueta}} from the plan', 'Visit, then delivery in 24 to 48 hours (Málaga provider)', 'Visit and editing, depending on the photographer'],
          ['Price', 'From {{price:maqueta}} + VAT, with 6 renders and AR', 'Service from €190 + VAT up to 150 m², or a subscription from €13 a month with your own capture', '€190 to €350 per package on average; €220 to €320 for 90 to 140 m²'],
        ],
        note: 'Sources: [matterport.com](' + MP + '), [andreasgrunau.com](' + AG + ') for Pro3 scanning in Málaga (VAT extra) and [cronoshare.com](' + CRONO + ') for 360 tours (indicative prices ex VAT, January 2026). Check VAT with each provider before you buy. Computer-generated 360 tours for off-plan homes are priced in our [3D rendering cost guide](@guia-precio-render).',
      },
      {
        type: 'answer',
        h2: 'How much does Matterport cost?',
        answer: 'Matterport has a free plan with 1 active space, and paid plans that, according to its website, start at €13 a month (Starter, 5 to 20 spaces) or €11 a month billed annually. Professional starts at €65 and Business at €332 a month. On top of that comes capture: your own equipment, or a provider who scans the home for you.',
        body: 'If you don’t want a camera or a subscription, you hire the whole service. A Málaga provider using a Pro3 camera publishes €190 + VAT up to 150 m², €250 up to 300 m² and €470 up to 1,000 m², delivered in 24 to 48 hours, with 6 months of hosting included and €50 a year after that. A schematic floor plan adds €35 + VAT.',
      },
      {
        type: 'table',
        caption: 'Matterport plans: “from” prices in euros (28 September 2026)',
        head: ['Plan', 'Active spaces', 'Billed monthly', 'Billed annually, per month', 'Worth knowing'],
        rows: [
          ['Free', '1', '€0', '€0', '2 users; capture with a phone, tablet or 360 camera'],
          ['Starter', '5 to 20', 'From €13', 'From €11', 'Share and embed; schematic floor plan at €20 per space'],
          ['Professional', '20 to 150', 'From €65', 'From €53', 'Supports the Pro2 and Pro3 cameras; floor plan at €15'],
          ['Business', '100 to 300', 'From €332', 'From €277', '50 users; floor plan at €15'],
          ['Enterprise', 'Custom', 'On request', 'On request', 'Volume discounts on floor plans'],
        ],
        note: 'Source: [Matterport plans](' + MP + ') and [camera comparison](' + MPCAM + '). Matterport shows local currency, so UK visitors will see pounds. Each listed home takes up one active space for as long as it stays active.',
      },
      {
        type: 'checklist',
        h2: 'When does a 3D model from the floor plan make sense?',
        intro: 'Whenever the home can’t, or shouldn’t, be photographed as it stands.',
        items: [
          'The home is off-plan or under construction: there is nothing to scan.',
          'It is tenanted or occupied, and you can’t show or shoot it properly.',
          'It is empty or poorly furnished, and you want it furnished, with the same furniture in the renders, the viewer and AR.',
          'You are selling a renovation project, so buyers need to see the result, not the current state.',
          'The property is far away and sending a photographer costs more than the tour itself.',
          'You want buyers to place the home on their table, or at real size, from their own phone with nothing to install.',
          'You need photorealistic renders as well as the tour, and they must match each other.',
        ],
      },
      {
        type: 'checklist',
        h2: 'When is Matterport or a 360 tour the better choice?',
        intro: 'When the home exists and its real condition sells it.',
        items: [
          'The home is finished, well presented and its finishes are the selling point.',
          'Sea views, the garden or the pool drive the price: a real photo shows them better than a model built from the floor plan.',
          'You need to document the current state for a renovation or an insurer.',
          'You list many finished homes a month, so a subscription with your own capture pays off.',
          'You want the tour live two days after the visit.',
          'Your portal accepts tours from that provider inside the listing.',
        ],
      },
      {
        type: 'answer',
        h2: 'Can you combine a model from the plan with a scan?',
        answer: 'Yes, and for new builds it is the logical sequence. During off-plan sales, each unit type is shown with the 3D model, renders and augmented reality. Once the building is finished, a scan or 360 tour of the completed home takes over, because there is now something real to show. For resales it runs the other way: scan the current state, model the proposed renovation.',
        body: 'For the off-plan side, see [off-plan 3D visualisation](@sol-promotoras). For what our viewer includes, see [interactive 3D floor plans](@servicio-tour).',
      },
      {
        type: 'answer',
        h2: 'How accurate are the measurements in each option?',
        answer: 'A scan measures the real home: Matterport states ±20 mm at 10 m for its Pro3 camera. A model built from the plan is as accurate as the plan: with dimensions or a DWG it follows them; without, floor areas are estimates (≈). A photographic 360 tour is not designed for measuring at all.',
        body: 'In our [demonstration case](@caso-villa) we started from {{villa:input}}, which is why we give floor areas as approximate: about {{villa:interiorM2}} m² inside and {{villa:terracesM2}} m² of terraces. On a real project we work from the client’s dimensioned plan.',
      },
      {
        type: 'viewer',
        h2: 'See for yourself: a villa modelled from its floor plan alone',
        intro: 'This is the model from our demonstration case: {{villa:rooms}} rooms, with no photos and no site visit. Spin it, step into each room and compare it with any 360 tour.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'What a model from the plan can’t show',
        body: 'The home’s real condition: wear and tear, damp, the exact view from each window or the noise from the street. A model shows the project or the proposal, not the property as it stands today. If buyers need that, a viewing, a scan or a good photo shoot is still essential.',
      },
      plate('en', 'villa_salon_dormitorio_opaco'),
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'Matterport: plans and pricing', url: MP, note: 'Euro prices displayed on 28 Sep 2026.' },
          { label: 'Matterport: Pro2 and Pro3 camera comparison', url: MPCAM, note: 'Accuracy and compatible plans.' },
          { label: 'andreasgrunau.com: Matterport scanning prices in Spain', url: AG, note: 'In Spanish; Málaga provider. Checked 28 Sep 2026.' },
          { label: 'cronoshare.com: how much a 360 virtual tour costs (5 Jan 2026)', url: CRONO, note: 'In Spanish; indicative prices ex VAT.' },
        ],
      },
    ],
    faq: [
      {
        q: 'What is Matterport and what is it used for?',
        a: 'Matterport is a platform that turns an existing home or building into a 3D digital twin: it is captured with a phone, a 360 camera or a Matterport camera, and visitors explore it in the browser, including a dollhouse view. It is used in property, insurance and renovation. For homes that aren’t built yet, {{brand}} builds the 3D model from the floor plan instead.',
      },
      {
        q: 'Is there a free version of Matterport?',
        a: 'Yes. Matterport’s Free plan gives you 1 active space and 2 users, captured with a phone, a tablet or a 360 camera. Sharing and embedding tours comes with the Starter plan, from €13 a month according to its website. {{brand}} doesn’t sell subscriptions: a 3D model from the plan costs from {{price:maqueta}} + VAT, with 12 months of viewer hosting included.',
      },
      {
        q: 'Why does Matterport get expensive?',
        a: 'The subscription itself starts low, from €13 a month on Starter according to Matterport’s site. Costs grow with scale and capture: plans are priced by active spaces, Matterport’s own Pro cameras need the Professional plan, from €65 a month, and floor plans are extra. {{brand}} charges once per home instead: from {{price:maqueta}} + VAT, with hosting for 12 months.',
      },
      {
        q: 'Can Matterport scan an off-plan property?',
        a: 'No. Matterport captures physical spaces, so a home that hasn’t been built can’t be scanned; at best you scan a finished show home. For off-plan sales, {{brand}} models each unit type from the project drawings, with renders, a viewer and augmented reality, from {{price:promocion}} + VAT for 3 unit types, delivered in {{delivery:promocion}}.',
      },
      {
        q: 'Is there a Matterport alternative without a site visit?',
        a: 'Yes: a 3D model built from the floor plan. It needs no camera and no visit. From the plan and one reference measurement, {{brand}} models the home fully furnished and delivers a web viewer, 6 renders and augmented reality, from {{price:maqueta}} + VAT in {{delivery:maqueta}}. It suits tenanted, distant, empty and unfinished homes alike.',
      },
      {
        q: 'How much does a 360 virtual tour cost in Spain?',
        a: 'According to cronoshare.com, in January 2026 a photographic 360 tour in Spain cost €190 to €350 per package on average, and €220 to €320 for a 90 to 140 m² home, ex VAT and as a guide price. The home has to exist and be presentable. Our 3D model starts from the floor plan instead, from {{price:maqueta}} + VAT.',
      },
      {
        q: 'Which works better for a resale property in Spain?',
        a: 'If it is well presented, a scan or a 360 tour shows its real condition and usually costs less. If it is empty, dated, tenanted or far away, a model built from the plan shows it furnished or renovated, with the same furniture in every view. {{brand}} delivers it in {{delivery:maqueta}}, with a viewer and augmented reality, from {{price:maqueta}} + VAT.',
      },
      {
        q: 'Is a model built from a floor plan as realistic as a scan?',
        a: 'In the renders, yes: {{brand}} computes each 4K image with physically based light in Blender Cycles, using [PBR](@glosario#pbr) materials made for each home. The web viewer is real-time 3D, lighter and slightly less photographic. The real difference lies elsewhere: a scan shows what is there; the model shows the project or the proposal.',
      },
    ],
    related: ['servicio-tour', 'servicio-plano', 'caso-villa', 'guia-ar', 'precios'],
    cta: {
      h2: 'Can’t scan the property?',
      body: 'Send us the floor plan: we will model one room free of charge and send it back in augmented reality, so you can compare it with a 360 tour. No obligation.',
    },
  },
};
