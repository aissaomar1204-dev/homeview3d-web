// Audience page: developers / new build / off-plan.
// Keyword focus ES: renders para promotoras, infografías 3D obra nueva, maqueta virtual promoción inmobiliaria (never «maqueta 3D» alone).
// Keyword focus EN: off plan property 3d visualisation, 3d visualisation for property developers spain, CGI off-plan marketing.
// «vender viviendas sobre plano» is owned by guia-sobre-plano (linked, not targeted).
// Sources verified 2026-09-28:
//  - Colegio de Registradores, Estadística Registral Inmobiliaria 2T 2026 (pp. 3, 26, 44): Málaga 11.727 compraventas de vivienda nueva en 12 meses (3.ª provincia).
//  - Ministerio de Vivienda y Agenda Urbana, tabla 1.6 (residencia del comprador), 1T-4T 2025: Málaga 10.079 de 36.128 compraventas por no residentes (27,9 %); España 7,4 %.

const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';
const MIVAU = 'https://apps.fomento.gob.es/BoletinOnline2/?nivel=2&orden=34000000';

const faqEs = [
  {
    q: '¿Sirve para vender viviendas sobre plano u obra nueva que aún no existe?',
    a: 'Sí, es su uso principal. {{brand}} construye el modelo 3D desde los planos del proyecto, sin fotos ni visita, así que puedes enseñar cada tipología amueblada antes de empezar la obra: renders 4K, visor web con selector de tipología y realidad aumentada. El pack de promoción parte de {{price:promocion}} + IVA y se entrega en {{delivery:promocion}}.',
  },
  {
    q: '¿Podéis modelar todas las tipologías de la promoción?',
    a: 'Sí. El pack de promoción de {{brand}} incluye hasta 3 tipologías en un mismo visor, con un selector para pasar de una a otra, y cada tipología adicional cuesta {{extra:tipologia}} + IVA. Todas comparten materiales, mobiliario y criterio de luz, así que los renders de la promoción son coherentes entre sí y con lo que el comprador ve en realidad aumentada.',
  },
  {
    q: '¿Qué pasa si cambia el proyecto durante la comercialización?',
    a: '{{brand}} levanta el modelo con scripts de Python en Blender: mover un tabique, cambiar una carpintería o un pavimento se reconstruye en minutos y se vuelve a exportar a renders, visor y realidad aumentada. El pack incluye {{revisions:promocion}}. Si el proyecto cambia después de la entrega, te decimos el coste del ajuste antes de tocar nada.',
  },
  {
    q: '¿Cómo se usa en la sala de ventas o en una feria?',
    a: 'Con una tableta o con el móvil del propio comprador. {{brand}} entrega cada vivienda en realidad aumentada en dos escalas: maqueta 1:20 sobre la mesa y tamaño real para recorrer el salón. En una feria, un código QR abre el visor y la AR en el móvil de cada visitante, sin instalar nada, en iPhone, iPad y móviles Android compatibles con ARCore.',
  },
  {
    q: '¿Se puede incrustar el visor en la web de la promoción?',
    a: 'Sí. {{brand}} entrega el visor 3D con un código iframe listo para pegar en la web de la promoción o en la de tu comercializadora, y un enlace para compartir por email o WhatsApp. Como referencia, el modelo web de nuestro caso demostrativo pesa {{file:glb}}, comprimido para abrirse con fluidez en un móvil.',
  },
  {
    q: '¿Qué necesitáis del estudio de arquitectura?',
    a: 'Las plantas de cada tipología en DWG, DXF o PDF, con cotas si las hay, y la memoria de calidades para definir materiales. Con eso {{brand}} modela, amuebla y renderiza sin visitar la obra. Si los acabados aún no están cerrados, proponemos una línea coherente con el precio de la promoción y la ajustamos en las rondas de cambios.',
  },
  {
    q: '¿Hacéis también renders exteriores del edificio?',
    a: 'El pack de promoción de {{brand}} se centra en el interior de cada tipología: distribución, mobiliario, materiales y terrazas, que es lo que el comprador necesita ver para reservar. Si también necesitas vistas exteriores del edificio o de la urbanización, cuéntanoslo al pedir la demo, con los alzados disponibles, y te confirmamos alcance, precio y plazo antes de empezar.',
  },
  {
    q: '¿Firmáis un acuerdo de confidencialidad?',
    a: 'Sí. Si tu promotora lo necesita, {{brand}} firma un acuerdo de confidencialidad antes de recibir los planos, que usamos solo para tu encargo. No publicamos imágenes de tu promoción sin tu permiso. Nuestro propio caso demostrativo está anonimizado por la misma razón: no mostramos el plano original ni ningún dato que permita identificar la vivienda.',
  },
];

const faqEn = [
  {
    q: 'How do I sell my off-plan property faster with 3D?',
    a: 'Nobody can honestly promise a faster sale, and {{brand}} doesn’t. What 3D does is remove the reasons buyers hesitate: they see every unit type furnished in 4K renders, explore it in an interactive viewer and place it on their table, or at real size, in augmented reality. Our development package starts at {{price:promocion}} + VAT, delivered in {{delivery:promocion}}.',
  },
  {
    q: 'Can you model every unit type in a development and keep them consistent?',
    a: 'Yes. The {{brand}} development package covers up to 3 unit types in one viewer, with a selector to switch between them, and each extra unit type costs {{extra:tipologia}} + VAT. All of them share the same materials, furniture and lighting, so the CGI across the development is consistent, and it matches what buyers see in augmented reality.',
  },
  {
    q: 'Can foreign buyers explore an off-plan home before travelling to Spain?',
    a: 'That is exactly what it is for. With our viewer link, a buyer in Manchester or Utrecht moves through the unit room by room and opens it in augmented reality on an iPhone, iPad or ARCore-compatible Android phone, with no app. It doesn’t replace a visit before signing, but it helps buyers decide whether the development deserves the trip.',
  },
  {
    q: 'What happens if the plans change during sales?',
    a: '{{brand}} builds the model with Python scripts in Blender, so moving a partition, changing a window or swapping a floor finish rebuilds in minutes and re-exports to renders, viewer and AR. The package includes {{revisions:promocion}}. If the project changes after delivery, we quote the update before touching anything.',
  },
  {
    q: 'How is it used in a sales suite or at a property fair?',
    a: 'On a tablet, or on the buyer’s own phone. {{brand}} delivers each unit in augmented reality at two scales: a 1:20 model on the table and real size to walk through the living room. At a fair, a QR code on the stand opens the viewer and the AR on every visitor’s phone, with nothing to install.',
  },
  {
    q: 'Can the viewer go on the development’s website?',
    a: 'Yes. {{brand}} delivers the 3D viewer with an iframe code ready to paste into the development’s website or your sales agent’s site, plus a shareable link for email and WhatsApp. For reference, the web model of our demo case weighs {{file:glb}}, compressed so it opens smoothly on a phone.',
  },
  {
    q: 'Do you produce exterior CGI of the building?',
    a: 'The {{brand}} development package focuses on the interior of each unit type: layout, furniture, finishes and terraces, which is what buyers need to see before reserving. If you also need exterior views of the building or the grounds, tell us when you ask for the demo, send the elevations you have, and we will confirm scope, price and timing before starting.',
  },
  {
    q: 'Will you sign an NDA?',
    a: 'Yes. If your company needs one, {{brand}} signs a non-disclosure agreement before receiving the drawings, which we use only for your project. We never publish images of your development without permission. Our own demo case is anonymised for the same reason: we don’t show the original plan or anything that could identify the property.',
  },
];

import { plate } from '../data/plates.mjs';

export default {
  id: 'sol-promotoras',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-29',

  es: {
    title: 'Renders e infografías 3D para promotoras de obra nueva',
    description: 'Cada tipología de tu promoción en 3D: renders, maqueta virtual interactiva y realidad aumentada para vender sobre plano. Desde {{price:promocion}} + IVA.',
    h1: 'Renders y maqueta virtual para promotoras de obra nueva',
    lead: '{{brand}}, estudio de visualización 3D de la Costa del Sol, modela cada tipología de tu promoción desde los planos del proyecto: renders 4K, una maqueta virtual interactiva con selector de tipología y realidad aumentada para la sala de ventas y las ferias. Desde {{price:promocion}} + IVA hasta 3 tipologías, en {{delivery:promocion}}.',
    breadcrumb: 'Promotoras',
    card: {
      title: 'Para promotoras de obra nueva',
      summary: 'Vende sobre plano con cada tipología en 3D, renders y realidad aumentada para la sala de ventas y las ferias.',
    },
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Maqueta 3D seccionada de la planta alta de una villa en la Costa del Sol, vista aérea en tres cuartos. Render generado a partir del plano 2D de un caso anonimizado.',
      caption: 'Maqueta seccionada del caso demostrativo, como la verá un comprador antes de la obra. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Para', 'Promotoras, comercializadoras y gestoras de cooperativas'],
      ['Entrada', 'Planos del proyecto en DWG, DXF o PDF'],
      ['Incluye', 'Tipologías en 3D, renders 4K, visor y AR'],
      ['Precio', 'Desde {{price:promocion}} + IVA'],
      ['Tipología adicional', '{{extra:tipologia}} + IVA'],
      ['Plazo', '{{delivery:promocion}}'],
      ['Cambios', '{{revisions:promocion}}'],
      ['Canales', 'Web, sala de ventas, ferias y WhatsApp'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Cómo se vende una vivienda que todavía no existe?',
        answer: 'Enseñándola antes de construirla. Con el modelo 3D de cada tipología, el comprador recorre la vivienda en el visor, ve los acabados en renders 4K y la coloca sobre la mesa, o a tamaño real, con su móvil. Es lo que hace un piso piloto, pero sin esperar a la obra ni montar un piso de muestra.',
        body: 'En la preventa, el comprador firma una reserva con un plano y una memoria de calidades. Cuanto mejor entiende la vivienda, menos dudas llegan a la sala de ventas y menos tiempo pasa tu equipo explicando planos. El proceso comercial completo, de la preventa a la escritura, está en la [guía para vender una promoción sobre plano](@guia-sobre-plano).',
      },
      {
        type: 'stat',
        value: '11.727',
        label: 'compraventas de vivienda nueva registradas en la provincia de Málaga en los 12 meses hasta el segundo trimestre de 2026: la tercera provincia de España, tras Madrid y Barcelona',
        source: { label: 'Colegio de Registradores, Estadística Registral Inmobiliaria', url: ERI },
        year: '2.º trimestre de 2026',
      },
      {
        type: 'table',
        h2: '¿Qué problemas resuelve en una promoción?',
        intro: 'Cada fase de la comercialización tiene su propio cuello de botella. Así encaja el modelo 3D en cada una.',
        caption: 'Problemas habituales de una promoción sobre plano y qué aporta el modelo 3D',
        head: ['Momento', 'El problema', 'Qué aporta el modelo 3D'],
        rows: [
          ['Preventa sobre plano', 'No hay piso piloto y el comprador reserva con un plano', 'Recorre cada tipología amueblada en el visor y en realidad aumentada'],
          ['Sala de ventas', 'La maqueta física enseña el edificio, no el interior de cada vivienda', 'Con una tableta, la vivienda a escala 1:20 sobre la mesa o el salón a tamaño real'],
          ['Ferias y presentaciones', 'Llevar toda la promoción a un stand de pocos metros', 'Un código QR que abre el visor y la AR en el móvil de cada visitante'],
          ['Compradores extranjeros', 'Reservan a distancia y viajan una vez, si viajan', 'El enlace por WhatsApp o email con el visor y la realidad aumentada'],
          ['Cambios de proyecto', 'Un tabique o un acabado cambian a mitad de la comercialización', 'El modelo se genera por script: el cambio se reconstruye en minutos'],
          ['Comercializadoras externas', 'Cada agencia enseña la promoción a su manera', 'El mismo enlace, los mismos renders y la misma información para todas'],
        ],
      },
      {
        type: 'viewer',
        h2: 'Una tipología en 3D, como la verán tus compradores',
        intro: 'Así funciona con la villa de nuestro [caso demostrativo](@caso-villa): {{villa:rooms}} estancias de una planta alta, modeladas desde un único plano. En una promoción, el visor añade un selector para cambiar de tipología.',
      },
      {
        type: 'stat',
        value: '27,9 %',
        label: 'de las compraventas de vivienda de la provincia de Málaga en 2025 las firmaron compradores que no residen en España (10.079 de 36.128), frente a una media nacional del 7,4 %',
        source: { label: 'Ministerio de Vivienda y Agenda Urbana, transacciones inmobiliarias según residencia del comprador', url: MIVAU },
        year: '2025',
      },
      {
        type: 'steps',
        h2: '¿Cómo trabajamos con tu equipo y con el estudio de arquitectura?',
        intro: 'Un único interlocutor por tu parte basta. El resto lo resolvemos en remoto, por email y videollamada.',
        items: [
          { title: 'Recibimos el proyecto', body: 'Plantas de cada tipología en DWG, DXF o PDF y, si existe, la memoria de calidades. Con cotas, el modelo sale a medida; si solo hay plantas comerciales, estimamos a escala y lo indicamos (≈).' },
          { title: 'Modelamos y amueblamos', body: 'Cada tipología con muros, huecos, carpinterías y un mobiliario acorde con el comprador al que se dirige la promoción. Los materiales siguen la memoria de calidades, con texturas propias y sin bancos de imágenes.' },
          { title: 'Revisa tu equipo', body: 'Dirección comercial y arquitectura reciben el visor en un enlace privado y piden cambios de mobiliario, materiales o distribución, que aplicamos en {{revisions:promocion}}.' },
          { title: 'Lo usas en todos los canales', body: 'Web de la promoción (iframe), dosier comercial y portales (renders), sala de ventas y ferias (realidad aumentada), agencias colaboradoras y compradores (enlace).' },
        ],
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'Precios para promociones y viviendas sueltas',
        intro: 'El pack de promoción incluye hasta 3 tipologías; cada tipología adicional cuesta {{extra:tipologia}} + IVA. Detalle completo en [precios](@precios).',
      },
      {
        type: 'answer',
        h2: '¿Cuánto pesa la visualización 3D en el presupuesto de una promoción?',
        answer: 'Muy poco en proporción. Ejemplo con supuestos: 24 viviendas de 3 tipologías a un precio medio de 350.000 € suman 8,4 millones de euros en ventas. El pack de promoción cuesta {{price:promocion}} + IVA, menos del 0,1 % de ese volumen. Un piso piloto físico, además, exige obra terminada o un local donde montarlo.',
        body: 'No te prometemos que vendas antes: eso depende del producto, el precio y tu equipo comercial. Lo que sí puedes medir es cuántas dudas dejan de llegar a la sala de ventas y cuántos compradores reservan sin haber visitado.\n\nSi estás comparando proveedores, nuestra [guía de estudios de visualización 3D en España](@guia-mejores) reúne a los que trabajan para promotoras, con lo que publica cada uno.',
      },
      plate('es', 'villa_interior_dormitorio'),
      {
        type: 'table',
        caption: 'Ejemplo ilustrativo para una promoción (supuestos, no resultados)',
        head: ['Concepto', 'Valor en el ejemplo'],
        rows: [
          ['Viviendas de la promoción (supuesto)', '24, en 3 tipologías'],
          ['Precio medio por vivienda (supuesto)', '350.000 €'],
          ['Volumen de ventas', '8.400.000 €'],
          ['Pack de promoción', '{{price:promocion}} + IVA'],
          ['Peso sobre el volumen de ventas', 'Menos del 0,1 %'],
        ],
        note: 'Cifras supuestas para ilustrar el cálculo. No es una previsión de ventas.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Imágenes orientativas',
        body: 'Los renders de obra nueva muestran la vivienda amueblada y con los acabados propuestos. Los entregamos con su mención, como texto para el pie de foto: «Render 3D. Imagen orientativa, no contractual; mobiliario no incluido». Mantenla al publicarlos y usa la memoria de calidades como referencia. Si el plano no trae cotas, las superficies son estimaciones a escala (≈).',
      },
      { type: 'faq' },
    ],
    faq: faqEs,
    related: ['servicio-renders', 'servicio-ar', 'servicio-tour', 'guia-sobre-plano', 'caso-villa'],
    cta: {
      h2: '¿Enseñamos tu promoción antes de construirla?',
      body: 'Envíanos la planta de una tipología y te devolvemos una estancia en 3D con realidad aumentada, gratis y sin compromiso.',
      service: 'promocion',
    },
  },

  en: {
    title: 'Off-plan 3D visualisation for developers in Spain',
    description: 'Every unit type as a 3D model with 4K CGI, an interactive viewer and app-free AR for your sales suite and fairs. From {{price:promocion}} + VAT.',
    h1: 'Off-plan 3D visualisation for property developers',
    lead: '{{brand}}, a 3D visualisation studio on the Costa del Sol, models every unit type in your development from the project drawings: 4K CGI, an interactive 3D viewer with a unit-type selector and app-free augmented reality for the sales suite and property fairs. From {{price:promocion}} + VAT for up to 3 unit types, in {{delivery:promocion}}.',
    breadcrumb: 'Developers',
    card: {
      title: 'For developers selling off-plan',
      summary: 'Every unit type in 3D, with CGI and augmented reality for the sales suite, fairs and buyers abroad.',
    },
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Cut-away 3D model of the upper floor of a Costa del Sol villa, three-quarter aerial view. Rendered from the 2D floor plan of an anonymised case.',
      caption: 'The cut-away model from our demo case, as a buyer would see it before construction. Rendered from the 2D floor plan.',
    },
    facts: [
      ['For', 'Developers, sales agents and off-plan marketers'],
      ['Input', 'Project drawings in DWG, DXF or PDF'],
      ['Includes', 'Unit types in 3D, 4K CGI, viewer and AR'],
      ['Price', 'From {{price:promocion}} + VAT'],
      ['Extra unit type', '{{extra:tipologia}} + VAT'],
      ['Turnaround', '{{delivery:promocion}}'],
      ['Changes', '{{revisions:promocion}}'],
      ['Channels', 'Website, sales suite, fairs and WhatsApp'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'How do you sell a home that hasn’t been built yet?',
        answer: 'By letting buyers step inside it first. With a 3D model of each unit type, buyers tour the home in the viewer, judge the finishes in 4K renders and place it on their table, or at real size, from their phone. It does the job of a show home without waiting for the build.',
        body: 'Off-plan, buyers commit to a reservation on the strength of a floor plan and a specification sheet. The better they understand the home, the fewer doubts reach your sales suite, and the less time your team spends explaining drawings to people who don’t read them.',
      },
      {
        type: 'stat',
        value: '11,727',
        label: 'new-build home sales were registered in Málaga province in the 12 months to the end of Q2 2026, the third-highest total of any Spanish province after Madrid and Barcelona',
        source: { label: 'Colegio de Registradores (Spain’s association of land registrars), Estadística Registral Inmobiliaria', url: ERI },
        year: 'Q2 2026',
      },
      {
        type: 'table',
        h2: 'Where does 3D help an off-plan launch?',
        intro: 'Each stage of an off-plan sales campaign has its own bottleneck. This is where the 3D model fits.',
        caption: 'Common off-plan sales problems and what a 3D model adds',
        head: ['Stage', 'The problem', 'What the 3D model adds'],
        rows: [
          ['Pre-launch and reservations', 'No show home, so buyers reserve from a plan', 'Every unit type furnished, in the viewer and in augmented reality'],
          ['Sales suite', 'The physical scale model shows the building, not the homes inside it', 'A 1:20 unit on the table from a tablet, or the living room at real size'],
          ['Property fairs', 'Fitting a whole development onto a small stand', 'A QR code that opens the viewer and the AR on each visitor’s phone'],
          ['Buyers abroad', 'They reserve remotely and fly out once, if at all', 'A link by WhatsApp or email with the viewer and augmented reality'],
          ['Design changes', 'A partition or a finish changes halfway through sales', 'The model is generated by script, so the change rebuilds in minutes'],
          ['External sales agents', 'Every agency presents the development differently', 'The same link, the same renders and the same facts for all of them'],
        ],
      },
      {
        type: 'viewer',
        h2: 'One unit type in 3D, as your buyers will see it',
        intro: 'Here it is with the villa from our [demo case](@caso-villa): {{villa:rooms}} rooms on an upper floor, modelled from a single floor plan. For a development, the viewer adds a selector to switch between unit types.',
      },
      {
        type: 'stat',
        value: '27.9%',
        label: 'of home sales in Málaga province in 2025 were signed by buyers who don’t live in Spain (10,079 out of 36,128), against a Spanish average of 7.4%',
        source: { label: 'Spanish Ministry of Housing and Urban Agenda, property transactions by buyer residence', url: MIVAU },
        year: '2025',
      },
      {
        type: 'steps',
        h2: 'How do we work with your sales team and your architects?',
        intro: 'One point of contact on your side is enough. Everything else happens remotely, by email and video call.',
        items: [
          { title: 'We receive the project', body: 'Floor plans for each unit type in DWG, DXF or PDF, plus the specification sheet if there is one. With dimensions, the model is built to measure; with marketing plans only, we estimate from the scale and mark it (≈).' },
          { title: 'We model and furnish', body: 'Each unit type gets walls, openings, joinery and furniture that suit the buyers the development is aimed at. Finishes follow the specification, using our own textures rather than stock libraries.' },
          { title: 'Your team reviews', body: 'Sales and architecture get the viewer on a private link and ask for changes to furniture, finishes or layout, which we apply in {{revisions:promocion}}.' },
          { title: 'You use it everywhere', body: 'Development website (iframe), brochure and portals (renders), sales suite and fairs (augmented reality), partner agencies and buyers (link).' },
        ],
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'Prices for developments and single homes',
        intro: 'The development package covers up to 3 unit types; each extra unit type costs {{extra:tipologia}} + VAT. Full details on our [pricing page](@precios).',
      },
      {
        type: 'answer',
        h2: 'What does 3D cost relative to the development’s value?',
        answer: 'Very little, proportionally. A worked example with assumptions: 24 homes across 3 unit types at an average of €350,000 add up to €8.4 million in sales. The development package costs {{price:promocion}} + VAT, under 0.1% of that. A physical show home also needs a finished unit, or premises to build one in.',
        body: 'We won’t promise you’ll sell faster; that depends on product, price and your sales team. What you can track is how many questions stop reaching the sales suite, and how many buyers reserve without having visited.\n\nIf you are comparing suppliers, our [guide to the best 3D visualisation studios in Spain](@guia-mejores) covers those that work with developers, and what each one publishes.',
      },
      plate('en', 'villa_interior_dormitorio'),
      {
        type: 'table',
        caption: 'Illustrative example for a development (assumptions, not results)',
        head: ['Item', 'Value in the example'],
        rows: [
          ['Homes in the development (assumption)', '24, across 3 unit types'],
          ['Average price per home (assumption)', '€350,000'],
          ['Total sales value', '€8,400,000'],
          ['Development package', '{{price:promocion}} + VAT'],
          ['Share of total sales value', 'Under 0.1%'],
        ],
        note: 'Assumed figures to illustrate the calculation. This is not a sales forecast.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Indicative images',
        body: 'Off-plan CGI shows each home furnished and with the proposed finishes. We deliver it with its label, as caption text: “3D render. Indicative image, not contractual; furniture not included.” Keep it when you publish, and use the specification sheet as the reference. If the plans carry no dimensions, areas are scale estimates (≈).',
      },
      { type: 'faq' },
    ],
    faq: faqEn,
    related: ['servicio-renders', 'servicio-ar', 'servicio-tour', 'zona-marbella', 'caso-villa'],
    cta: {
      h2: 'Shall we show your development before it’s built?',
      body: 'Send us the plan of one unit type and we will send back one room in 3D with augmented reality, free and with no commitment.',
      service: 'promocion',
    },
  },
};
