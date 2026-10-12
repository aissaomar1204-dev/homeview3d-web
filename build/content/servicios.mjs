// Hub: services index + decision table + deliverables + pricing excerpt + audiences + coming soon.
// ES §2.1 «Servicios» and FAQ P3 #37-38 (02-keywords-es.md); EN launch set (03-keywords-en.md §5.1).

export default {
  id: 'servicios',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  es: {
    title: 'Servicios de visualización 3D inmobiliaria',
    description: 'Plano 2D a 3D, renders, tour virtual 3D, realidad aumentada sin app y home staging virtual, desde un modelo 3D real, con presupuesto cerrado.',
    h1: 'Servicios de visualización 3D para inmobiliarias',
    lead: 'Todo parte de un modelo 3D real construido desde el plano 2D, sin fotos: de él salen el plano 3D, los renders, el visor web, la realidad aumentada y el home staging virtual. Para inmobiliarias, promotoras y arquitectos, con presupuesto cerrado y el plano 3D listo en {{delivery:plano3d}}.',
    breadcrumb: 'Servicios',
    card: {
      title: 'Servicios',
      summary: 'Plano 2D a 3D, renders, tour virtual 3D, realidad aumentada sin app y home staging virtual, desde un solo modelo.',
    },
    facts: [
      ['Entrada', 'Un plano 2D, sin fotos ni visita'],
      ['Servicios', 'Plano 3D, renders, visor 3D, realidad aumentada y staging'],
      ['Precio', 'Presupuesto cerrado y por escrito, al ver el plano'],
      ['Plazo', 'Plano 3D, {{delivery:plano3d}}; maqueta, {{delivery:maqueta}}'],
      ['Formatos', 'PNG y JPG en 4K, GLB, USDZ, enlace e iframe'],
      ['Zona', 'Costa del Sol y toda España, en remoto'],
      ['Idiomas', 'Español e inglés'],
    ],
    blocks: [
      {
        type: 'services',
        h2: '¿Qué servicio de visualización 3D necesitas?',
        intro: 'Cinco servicios y un solo modelo. Puedes pedir solo el plano 3D o la maqueta completa, que ya incluye renders, visor y realidad aumentada.',
      },
      {
        type: 'table',
        h2: '¿Qué encaja con cada vivienda?',
        intro: 'Una guía rápida según la situación de la vivienda y de quien la compra.',
        caption: 'Qué servicio recomendamos según el caso',
        head: ['Situación', 'Qué recomendamos'],
        rows: [
          ['Solo necesitas enseñar la distribución en el anuncio', '[Plano 3D](@servicio-plano): planta cenital e isométrica amuebladas'],
          ['Obra nueva o vivienda sin fotos', 'Maqueta 3D completa con [renders fotorrealistas](@servicio-renders), visor y realidad aumentada'],
          ['Compradores que viven en otro país', '[Tour virtual 3D](@servicio-tour) y [realidad aumentada sin app](@servicio-ar), incluidos en la maqueta'],
          ['Piso vacío o con muebles que no ayudan', 'Maqueta completa y [home staging virtual](@servicio-staging) por estancia'],
          ['Promoción con varias tipologías', 'Pack de [promoción de obra nueva](@sol-promotoras), con renders, visor y realidad aumentada para cada tipología'],
          ['Cartera de agencia', 'Varias maquetas completas, con presupuesto por volumen'],
        ],
      },
      {
        type: 'answer',
        h2: '¿Por qué un modelo 3D y no imágenes sueltas?',
        answer: 'Porque un modelo se hace una vez y sirve para todo. Las imágenes sueltas, sean renders por encargo o fotos decoradas con IA, no se pueden recorrer ni abrir en realidad aumentada, y cada una puede contar una vivienda algo distinta. Con el modelo, renders, visor, realidad aumentada y staging enseñan exactamente la misma casa.',
        body: 'Lo demostramos con la [villa en la Costa del Sol](@caso-villa): {{villa:rooms}} estancias amuebladas, {{villa:textures}} texturas creadas para el proyecto y {{villa:renders}} imágenes en render, todo a partir de {{villa:input}}. Si quieres ver cómo trabajamos, está en [nuestro método, paso a paso](@como-funciona).',
      },
      {
        type: 'deliverables',
        h2: 'Qué recibes con la maqueta 3D completa',
        intro: 'Cinco entregables que salen del mismo modelo, cada uno con sus formatos.',
      },
      {
        type: 'audiences',
        h2: '¿Para quién trabajamos?',
        intro: 'Soluciones por tipo de cliente, con la combinación de servicios que mejor encaja en cada caso.',
      },
      {
        type: 'comingSoon',
        h2: 'Próximamente: vídeo con IA y realidad virtual 360°',
        intro: 'Todavía no los ofrecemos. Los anunciaremos en esta página cuando estén listos.',
      },
      {
        type: 'pages',
        h2: 'Dónde trabajamos',
        intro: 'Tenemos la base en la Costa del Sol y trabajamos en remoto para toda España.',
        ids: ['zona-marbella', 'zona-malaga', 'zona-costa-del-sol'],
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Qué servicio necesito para vender una vivienda de obra nueva?',
        a: 'Para obra nueva recomendamos la maqueta 3D completa de {{brand}}: el modelo amueblado, 6 renders en 4K, visor web y realidad aumentada, con presupuesto cerrado al ver el plano. Si son varias tipologías de una promoción, el pack de promoción las incluye todas, cada una con sus renders.',
      },
      {
        q: '¿Puedo contratar solo los renders o solo la realidad aumentada?',
        a: 'Los renders, el visor y la realidad aumentada salen del mismo modelo 3D, y modelar la vivienda es la mayor parte del trabajo. Por eso {{brand}} los entrega juntos en la maqueta completa. Si solo necesitas enseñar la distribución, basta el plano 3D, que cuesta menos trabajo y menos dinero.',
      },
      {
        q: '¿Hacéis vídeos inmobiliarios con IA?',
        a: 'Todavía no. {{brand}} tiene en preparación vídeos de recorrido generados a partir de los renders del modelo, etiquetados como contenido generado con IA, pero hoy no es un servicio disponible y lo anunciaremos aquí cuando lo sea. Mientras tanto, el visor 3D con recorrido guiado cubre buena parte de lo que se busca en un vídeo.',
      },
      {
        q: '¿Hacéis tours de realidad virtual 360?',
        a: 'Aún no: las panorámicas 360° para gafas de realidad virtual y para la web están en preparación y las anunciaremos en esta página. Hoy {{brand}} ofrece el visor 3D, que se recorre en cualquier navegador, y la realidad aumentada sin app en iPhone, iPad y Android, ambos incluidos en la maqueta 3D completa.',
      },
      {
        q: '¿Hacéis encargos fuera de la Costa del Sol?',
        a: 'Sí. {{brand}} tiene su base en la Costa del Sol, pero trabaja en remoto para inmobiliarias, promotoras y arquitectos de toda España y para agencias internacionales que venden aquí. Solo necesitamos el plano, así que la ubicación de la vivienda no cambia el precio ni el plazo: {{delivery:maqueta}} para la maqueta completa. Más en [zonas](@zonas).',
      },
      {
        q: '¿Cuánto tardáis en entregar?',
        a: '{{brand}} entrega el plano 3D en {{delivery:plano3d}}, la maqueta 3D completa en {{delivery:maqueta}} y una promoción en {{delivery:promocion}}. Los días cuentan desde que tenemos el plano y una medida de referencia, e incluyen las rondas de cambios si nos las envías en 24 h. Hay entrega urgente en 48 horas, con presupuesto aparte. Y pagas cuando recibes el trabajo terminado.',
      },
    ],
    related: ['precios', 'caso-villa', 'como-funciona', 'faq', 'guias'],
  },

  en: {
    title: 'Real estate 3D visualisation services in Spain',
    description: 'Floor plan to 3D, property renders, interactive 3D floor plans, app-free AR and virtual staging from one real 3D model, with a fixed quote.',
    h1: '3D visualisation services for estate agents and developers',
    lead: 'Everything starts from a 3D model built from the 2D floor plan, with no photos: the 3D floor plan, renders, web viewer, augmented reality and virtual staging all come from it. For estate agents, developers and architects, with a fixed quote and a 3D floor plan ready in {{delivery:plano3d}}.',
    breadcrumb: 'Services',
    card: {
      title: 'Services',
      summary: 'Floor plan to 3D, renders, interactive 3D floor plans, app-free AR and virtual staging, all from one model.',
    },
    facts: [
      ['Input', 'One 2D floor plan, no photos or site visit'],
      ['Services', '3D floor plan, renders, 3D viewer, AR and staging'],
      ['Price', 'A fixed written quote, once we see the plan'],
      ['Turnaround', '3D floor plan {{delivery:plano3d}}; complete model {{delivery:maqueta}}'],
      ['Formats', '4K PNG and JPG, GLB, USDZ, link and iframe'],
      ['Coverage', 'Costa del Sol, all of Spain and remote clients abroad'],
      ['Languages', 'English and Spanish'],
    ],
    blocks: [
      {
        type: 'services',
        h2: 'Which 3D visualisation service do you need?',
        intro: 'Five services, one model. Order just the 3D floor plan, or the complete model, which already includes renders, the viewer and augmented reality.',
      },
      {
        type: 'table',
        h2: 'What suits each property?',
        intro: 'A quick guide based on the property and on who is buying it.',
        caption: 'Which service we recommend in each case',
        head: ['Situation', 'What we recommend'],
        rows: [
          ['You only need to show the layout in the listing', '[3D floor plan](@servicio-plano): furnished top-down and isometric views'],
          ['Off-plan, or a home with no usable photos', 'Complete 3D model with [photorealistic renders](@servicio-renders), viewer and AR'],
          ['Buyers living abroad', '[Interactive 3D floor plan](@servicio-tour) and [app-free AR](@servicio-ar), both included in the complete model'],
          ['Empty home, or furniture that does not help', 'Complete model plus [3D virtual staging](@servicio-staging) per room'],
          ['Development with several unit types', '[Off-plan development package](@sol-promotoras) with renders, viewer and AR for every unit type'],
          ['Agency portfolio', 'Several complete models, with a volume quote'],
        ],
      },
      {
        type: 'answer',
        h2: 'Why a 3D model rather than one-off images?',
        answer: 'Because a model is built once and does everything. One-off images, whether commissioned renders or photos restyled with AI, cannot be walked through or opened in AR, and each may tell a slightly different story about the home. With a model, the renders, viewer, AR and staging all show exactly the same property.',
        body: 'We proved it with the [Costa del Sol villa](@caso-villa): {{villa:rooms}} furnished rooms, {{villa:textures}} textures made for the project and {{villa:renders}} rendered images, all from {{villa:input}}. The step-by-step is in [how we work, stage by stage](@como-funciona).',
      },
      {
        type: 'deliverables',
        h2: 'What you get with the complete 3D model',
        intro: 'Five deliverables from the same model, each with its formats.',
      },
      {
        type: 'audiences',
        h2: 'Who do we work for?',
        intro: 'Solutions by type of client, with the mix of services that fits each one.',
      },
      {
        type: 'comingSoon',
        h2: 'Coming soon: AI video and 360° virtual reality',
        intro: 'We do not offer these yet. We will announce them on this page when they are ready.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'Which service do I need for an off-plan development?',
        a: 'For off-plan homes we recommend the {{brand}} complete 3D model: the furnished model, 6 renders in 4K, a web viewer and augmented reality, with a fixed quote once we see the plan. For a development with several unit types, the development package covers them all, each with its renders.',
      },
      {
        q: 'Can I order just the renders, or just the AR?',
        a: 'Renders, the viewer and augmented reality all come from the same 3D model, and modelling the home is most of the work. That is why {{brand}} delivers them together in the complete model. If you only need to show the layout, a 3D floor plan is enough, with less work and a lower price.',
      },
      {
        q: 'Do you make AI property videos?',
        a: 'Not yet. {{brand}} is preparing video walkthroughs generated from the model’s renders and labelled as AI-generated content, but they are not available today; we will announce them on this page when they are. In the meantime, the 3D viewer’s guided tour covers much of what agents want from a video.',
      },
      {
        q: 'Do you offer 360° virtual reality tours?',
        a: 'Not yet: 360° panoramas for VR headsets and the web are in preparation and will be announced on this page. Today {{brand}} offers the 3D viewer, which works in any browser, and app-free augmented reality on iPhone, iPad and Android, both included in the complete 3D model.',
      },
      {
        q: 'Do you work outside the Costa del Sol and outside Spain?',
        a: 'Yes. {{brand}} is based on the Costa del Sol and works remotely for estate agents, developers and architects across Spain, and for international agencies selling here. We only need the floor plan, so the property’s location changes neither the price nor the turnaround. Local detail is on our [Marbella 3D rendering](@zona-marbella) page.',
      },
      {
        q: 'How long does delivery take?',
        a: '{{brand}} delivers a 3D floor plan in {{delivery:plano3d}}, the complete 3D model in {{delivery:maqueta}} and a development in {{delivery:promocion}}. The clock starts once we have the plan and one reference measurement, and it includes the rounds of changes if you send them within 24 hours. Rush delivery in 48 hours is available, quoted separately. You pay when you receive the finished work.',
      },
    ],
    related: ['precios', 'caso-villa', 'como-funciona', 'faq', 'guias'],
  },
};
