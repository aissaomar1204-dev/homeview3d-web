// Guide (ES + EN): best 3D visualisation studios and tools for property in Spain (seo-geo-audit O-03;
// docs/research/04-geo-2026.md §8.2 «Guía mejores formas/empresas», 01-competidores.md).
// Honest list: visible criteria, 10 real options grouped by type (NOT a ranking; we go last), a prominent
// conflict-of-interest notice, a price only where the company publishes one, and a quarterly review date.
// The table with `itemList: true` becomes the page's ItemList in JSON-LD (build/lib/schema.mjs).
//
// Every third-party fact below was checked on the company's own website on 2026-09-29:
//  - viseni.com: «Urbanización Lunamar. Marbella (Málaga)», «desde 2008»; renders, animación 3D, realidad virtual,
//    realidad aumentada, maquetas 3D interactivas, apps de venta, eventos; no prices; «Respondemos en menos de 24h».
//  - improntia.com: «Urb. Parque Botánico W409 Benahavís - Málaga»; fotografía inmobiliaria, vídeo, dron, tour 360°,
//    planos esquemáticos y 3D, virtual staging, renders 3D; packs Pro, Superior y Sublime «Pide un presupuesto».
//  - persuadis.com (+ inmoshowroom.com): Persuadis Publicidad SL, Rambla de Catalunya 123, Barcelona; «España ·
//    Portugal · Perú · México»; render y vídeos IA, estrategia, branding, material comercial, call center,
//    Inmoshowroom (showroom virtual por videollamada); no prices.
//  - floorfy.com (/prices, /terms-of-use): FLOORFY, S.L., Barcelona; 3D virtual tours with 360° cameras, floor plans,
//    AI videos and AI home staging; Small 19 €/mo (5 active tours), Medium 59 € (20), Large 99 € (50); free floor
//    plan editor (0 €/mo); «14 days free».
//  - matterport.com/plans (browser, EUR): Free (1 active space, capture with a phone, tablet or 360 camera);
//    Starter €13/mo monthly, €11/mo billed annually.
//  - andreasgrunau.com/precios-matterport-espana: Matterport Pro3 scanning, Málaga, 190 € + IVA up to 150 m².
//  - cubi.casa (/pricing in a browser, «The pricing displayed on this page applies in Spain»; /about): PLUS 3D 65 €
//    (3D floor plan, furniture, colours and textures, 48 h); «First 2D floor plan is free!»; plans from an indoor scan
//    with its app; HQ Oulu, Finland.
//  - boxbrownie.com/floor-plans: 3D full colour €40 per floor, 48 h; tailored 3D from €200.
//  - homestagerdesign.com/producto/planos-3d: 3D color amueblado 119,95 € «por plano (60m2) y planta», from 72 h,
//    1 revision included.
//  - vistastudiodesign.com: «startup de tecnología inmobiliaria fundada en Barcelona»; AI renders and AI video tours
//    from phone photos; Pack Render 129 € (up to 6 rooms), Walkthrough 290 €, «sin IVA»; renders in 24 working hours.
// Our own prices come ONLY from tokens. Next review: December 2026 (CLIENT-CONFIRMATIONS §13).

const SRC = {
  viseni: 'https://www.viseni.com/',
  improntia: 'https://improntia.com/',
  persuadis: 'https://www.persuadis.com/',
  inmoshowroom: 'https://inmoshowroom.com/',
  floorfy: 'https://floorfy.com/prices',
  matterport: 'https://matterport.com/plans',
  grunau: 'https://andreasgrunau.com/precios-matterport-espana/',
  cubi: 'https://www.cubi.casa/pricing/',
  box: 'https://www.boxbrownie.com/floor-plans',
  hsd: 'https://homestagerdesign.com/producto/planos-3d/',
  vista: 'https://vistastudiodesign.com/',
};

export default {
  id: 'guia-mejores',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-29',
  dateModified: '2026-09-29',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Mejores estudios de visualización 3D en España (2026)',
    description: 'Comparativa 2026 de 10 estudios y herramientas de visualización 3D inmobiliaria en España: qué ofrece cada uno, para quién es y su precio si lo publica.',
    h1: 'Mejores estudios de infografía 3D inmobiliaria en España',
    lead: 'Diez estudios y herramientas de visualización 3D inmobiliaria que trabajan en España en 2026, según lo que necesites: Viseni o Improntia en la Costa del Sol, Persuadis para promotoras, Floorfy o Matterport para tours, CubiCasa, BoxBrownie o Home Stager Design para planos, Vista Studio para IA sobre fotos y {{brand}}, desde {{price:plano3d}} + IVA.',
    breadcrumb: 'Mejores estudios 3D',
    card: {
      title: 'Mejores estudios de visualización 3D en España',
      summary: 'Diez estudios y herramientas comparados con criterios a la vista, precio publicado y para quién es cada uno. Somos uno de ellos.',
    },
    facts: [
      ['Opciones comparadas', '10 estudios y herramientas, {{brand}} incluido'],
      ['Criterios', 'Entrada, entregables, precio público, plazo y zona'],
      ['En la Costa del Sol', 'Viseni (Marbella), Improntia (Benahavís) y {{brand}}'],
      ['Con precio publicado', '7 de las 10 opciones'],
      ['Orden', 'Por tipo de servicio; no es un ranking'],
      ['Parte interesada', 'Sí: {{brand}} escribe esta guía y aparece en ella'],
      ['Datos revisados', '29 de septiembre de 2026'],
      ['Próxima revisión', 'Diciembre de 2026'],
    ],
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Maqueta 3D seccionada de la villa anonimizada de la Costa del Sol, render generado desde su plano 2D',
      caption: 'Render de nuestro caso demostrativo. {{brand}} es uno de los estudios de esta comparativa.',
    },
    blocks: [
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Somos {{brand}}, uno de los estudios de la lista',
        body: 'Esta comparativa la escribe un estudio que compite con varios de los que aparecen, así que no es neutral. Para que te sirva igual: los criterios están a la vista, cada dato de otra empresa sale de su propia web (consultada el 29 de septiembre de 2026 y enlazada), solo damos un precio si la empresa lo publica y no ordenamos por calidad, sino por tipo de servicio. Ninguna empresa ha pagado por aparecer. Si un dato ha cambiado, escríbenos a {{email}} y lo corregimos.',
      },
      {
        type: 'answer',
        h2: '¿Cuál es el mejor estudio de visualización 3D en España?',
        answer: 'No hay uno mejor para todo: depende de lo que tengas (un plano, fotos o la vivienda terminada), de lo que necesites entregar y del plazo. Para una preventa de villas de lujo con presupuesto a medida, un estudio de alta gama; para una vivienda terminada, un tour o un escaneo; para una planta rápida, una plataforma en línea.',
        body: 'Por eso esta guía no da un número uno. Reúne diez opciones reales de [infografía 3D](@glosario#infografia-3d), tours y planos que trabajan en España, dice qué ofrece cada una y para quién es, y enlaza a su web para que compruebes lo que afirmamos. Antes, los criterios con los que las miramos.',
      },
      {
        type: 'table',
        h2: '¿Con qué criterios las comparamos?',
        intro: 'Seis criterios que puedes aplicar a cualquier proveedor, también a los que no están en esta lista.',
        caption: 'Criterios de la comparativa',
        head: ['Criterio', 'Qué miramos', 'Por qué importa'],
        rows: [
          ['Entrada', 'Qué necesita el proveedor: un plano, fotos o visitar la vivienda', 'Una promoción sobre plano no se puede fotografiar ni escanear'],
          ['Entregables', 'Imágenes, [tour 360°](@glosario#tour-virtual-360), plano, modelo 3D, [visor web](@glosario#visor-3d) o [realidad aumentada](@glosario#realidad-aumentada)', 'Una imagen se publica; un modelo se reutiliza para renders, visor y realidad aumentada'],
          ['Precio público', 'Si la web publica una tarifa o solo da presupuesto', 'Con una tarifa publicada puedes presupuestar sin esperar respuesta'],
          ['Plazo', 'Si la web publica un plazo de entrega', 'Una preventa o una feria tienen fecha fija'],
          ['Zona', 'Dónde tiene su base y si trabaja en remoto', 'Un escaneo o una sesión de fotos exigen desplazarse a la vivienda'],
          ['Para quién', 'Agencias, promotoras, arquitectos o fotógrafos', 'Un proveedor pensado para tu caso te pide menos trabajo'],
        ],
      },
      {
        type: 'table',
        h2: '¿Qué estudios y herramientas de visualización 3D hay en España?',
        intro: 'Diez opciones reales, agrupadas por tipo: estudios de la Costa del Sol, una agencia de marketing para promotoras, plataformas de tours y escaneo, planos en línea, renders con IA y, al final, nosotros. El orden no es un ranking. Los datos salen de la web de cada empresa, consultada el 29 de septiembre de 2026.',
        caption: 'Estudios y herramientas de visualización 3D inmobiliaria en España (septiembre de 2026)',
        itemList: true,
        head: ['Estudio o herramienta', 'Qué ofrece', 'Ideal para', 'Precio publicado'],
        rows: [
          [`[Viseni](${SRC.viseni})`, 'Estudio de visualización con base en Marbella desde 2008: renders, animación 3D, tours de realidad virtual, realidad aumentada y maquetas 3D interactivas', 'Promotoras de villas de lujo y arquitectos que preparan una preventa o un concurso', 'No publica precios; responde a las peticiones de presupuesto en menos de 24 h'],
          [`[Improntia](${SRC.improntia})`, 'Estudio con base en Benahavís: fotografía inmobiliaria, vídeo y dron, tour virtual 360°, planos 2D y 3D, [home staging virtual](@glosario#home-staging-virtual) y renders', 'Agencias de la Costa del Sol que quieren fotos, planos y tour de una vivienda terminada con un solo proveedor', 'No publica precios; packs Pro, Superior y Sublime con presupuesto'],
          [`[Persuadis](${SRC.persuadis})`, 'Agencia de marketing inmobiliario con sede en Barcelona: renders y vídeos con IA, estrategia, branding, material comercial, call center e Inmoshowroom, un showroom virtual por videollamada', 'Promotoras que quieren externalizar la comercialización de una promoción de obra nueva', 'No publica precios'],
          [`[Floorfy](${SRC.floorfy})`, 'Software de Barcelona para crear tours virtuales con cámara 360°, planos, vídeos y home staging con IA', 'Agencias que fotografían sus propias viviendas terminadas y publican muchos anuncios al mes', 'De 19 a 99 € al mes (de 190 a 990 € al año) según los tours activos; editor de planos gratis; 14 días de prueba'],
          [`[Matterport](${SRC.matterport})`, `Plataforma de [gemelos digitales](@glosario#gemelo-digital): escaneas una vivienda que ya existe con el móvil, una tableta o una cámara 360°, o encargas el escaneo a un [proveedor, también en Málaga](${SRC.grunau})`, 'Viviendas terminadas en las que el comprador quiere recorrer el estado real', 'Plan gratuito con 1 espacio activo; Starter, 13 € al mes u 11 € al mes con pago anual; escaneo en Málaga desde 190 € + IVA'],
          [`[CubiCasa](${SRC.cubi})`, 'App finlandesa: escaneas la vivienda con el móvil y recibes el plano 2D o el plano 3D amueblado', 'Fotógrafos y agentes que ya visitan la vivienda y quieren el plano sin dibujarlo', 'Plano 3D amueblado, 65 € en 48 h; el primer plano 2D es gratis'],
          [`[BoxBrownie](${SRC.box})`, 'Plataforma en línea de edición inmobiliaria: planos 2D y 3D dibujados a partir del plano que subes', 'Anuncios de segunda mano que necesitan una planta a color rápida', 'Plano 3D a color, 40 € por planta en 48 h; a medida, desde 200 €'],
          [`[Home Stager Design](${SRC.hsd})`, 'Tienda en línea de planos: 2D en blanco y negro, 2D a color y 3D a color amueblado a partir de una imagen del plano', 'Pisos pequeños que necesitan un plano 3D con precio cerrado', '119,95 € el plano 3D por planta de unos 60 m², desde 72 h y con 1 revisión'],
          [`[Vista Studio](${SRC.vista})`, 'Estudio de Barcelona de renders y vídeo tours generados con IA a partir de fotos hechas con el móvil', 'Redecorar o reformar virtualmente pisos que ya existen y tienen fotos', 'Renders de hasta 6 estancias, 129 €; vídeo tour, 290 €; sin IVA'],
          ['[{{brand}}](@home)', 'Estudio con base en Mijas, en la Costa del Sol: modelo 3D amueblado desde el plano 2D, sin fotos ni visita, con renders, visor web y realidad aumentada sin app', 'Obra nueva, [venta sobre plano](@glosario#venta-sobre-plano) y viviendas vacías o lejanas que el comprador ve a distancia', 'Plano 3D desde {{price:plano3d}}; maqueta 3D completa desde {{price:maqueta}}; sin IVA'],
        ],
        note: 'Precios tal como los publica cada empresa. Vista Studio, el proveedor de Matterport en Málaga y {{brand}} dicen de forma expresa que sus precios son sin IVA; en el resto, confírmalo. Los precios de Matterport y CubiCasa son los que sus webs muestran para España.',
      },
      {
        type: 'table',
        h2: '¿Qué opción encaja con cada situación?',
        intro: 'Si aún dudas, empieza por lo que tienes delante: qué vivienda es y qué necesitas enseñar.',
        caption: 'Qué tipo de proveedor encaja según tu caso',
        head: ['Tu situación', 'Qué tipo de opción', 'Ejemplos de la lista'],
        rows: [
          ['Preventa de villas de lujo con presupuesto a medida', 'Estudio de visualización de alta gama', 'Viseni'],
          ['Comercialización completa de una promoción', 'Agencia de marketing inmobiliario', 'Persuadis'],
          ['Vivienda terminada en la Costa del Sol que necesita fotos, planos y tour', 'Fotógrafo inmobiliario con servicios 3D', 'Improntia'],
          ['Muchas viviendas terminadas al mes, con equipo propio', 'Software de tours con cámara 360° o escaneo', 'Floorfy, Matterport'],
          ['Solo la planta de un piso de segunda mano', 'Plano en línea o app de escaneo', 'BoxBrownie, Home Stager Design, CubiCasa'],
          ['Piso con fotos que quieres redecorar', 'Renders con IA a partir de fotos', 'Vista Studio'],
          ['Obra nueva o vivienda vacía que el comprador verá a distancia', 'Modelo 3D desde el plano, con visor y realidad aumentada', '{{brand}}'],
        ],
      },
      {
        type: 'checklist',
        h2: '¿Cómo elegir un estudio de visualización 3D?',
        intro: 'Siete comprobaciones antes de encargar, elijas a quien elijas.',
        items: [
          'Si la vivienda aún no existe, descarta el escaneo y los renders con IA a partir de fotos: necesitas a alguien que modele desde el plano.',
          'Si la vivienda está terminada y sus acabados la venden, un tour 360° o un escaneo enseñan su estado real.',
          'Pide un ejemplo terminado que puedas abrir y girar, no solo imágenes de portfolio.',
          'Pide el precio por escrito, con entregables, rondas de cambios, plazo e IVA.',
          'Pregunta qué recibes además de imágenes: el modelo, un visor que puedas incrustar o archivos de realidad aumentada.',
          'Comprueba si hace falta visitar la vivienda y quién paga el desplazamiento.',
          'Confirma que las imágenes se entregan etiquetadas como recreación virtual para los portales.',
        ],
      },
      {
        type: 'answer',
        h2: '¿Cuánto cuesta contratar un estudio de visualización 3D?',
        answer: 'Depende del entregable. Según las tarifas publicadas que recogemos en nuestras guías, un render interior cuesta en España de 200 a 450 € por imagen, y un plano 3D, de 100 a 800 € según el nivel o 40 € por planta en una plataforma en línea. Los estudios de alta gama presupuestan por proyecto.',
        body: 'Las tablas completas, con la fuente de cada cifra, están en [cuánto cuesta un render 3D en España](@guia-precio-render) y en [precios de un plano 3D por planta](@guia-precio-plano). Si dudas entre escanear la vivienda o modelarla desde el plano, lee la [comparativa entre un modelo 3D, Matterport y un tour 360](@guia-matterport).',
      },
      {
        type: 'answer',
        h2: '¿Dónde encajamos nosotros?',
        answer: '{{brand}} encaja cuando solo hay un plano: obra nueva, venta sobre plano o una vivienda vacía que el comprador verá desde otro país. Del plano sacamos el modelo 3D, 6 renders, un visor web y realidad aumentada sin app, desde {{price:maqueta}} + IVA y en {{delivery:maqueta}}, sin visitar la vivienda.',
        body: 'No somos la mejor opción para todo. No hacemos fotografía, vídeo con dron ni escaneos, y una fachada completa con su entorno la presupuestamos aparte. Somos un estudio nuevo: en lugar de testimonios, te enseñamos un [caso demostrativo](@caso-villa) que puedes abrir en el visor y en tu móvil, y publicamos todas nuestras [tarifas](@precios). Si vendes obra nueva, mira también cómo trabajamos para [promotoras](@sol-promotoras).',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Cómo mantenemos esta lista',
        body: 'Revisamos la lista cada tres meses; la próxima revisión será en diciembre de 2026. Añadimos o quitamos opciones solo con datos de su propia web y cambiamos la fecha de actualización cuando cambia algo. Si tienes un estudio o una herramienta que encaja con estos criterios, o ves un dato que ha cambiado, escríbenos a {{email}}.',
      },
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'viseni.com', url: SRC.viseni, note: 'Servicios, base en Marbella desde 2008 y plazo de respuesta. Consultado el 29 sep 2026.' },
          { label: 'improntia.com', url: SRC.improntia, note: 'Servicios, dirección en Benahavís y packs. Consultado el 29 sep 2026.' },
          { label: 'persuadis.com', url: SRC.persuadis, note: 'Servicios y sede en Barcelona. Consultado el 29 sep 2026.' },
          { label: 'inmoshowroom.com', url: SRC.inmoshowroom, note: 'Showroom virtual de Persuadis Publicidad SL. Consultado el 29 sep 2026.' },
          { label: 'floorfy.com: precios y suscripciones', url: SRC.floorfy, note: 'Planes mensuales y editor de planos gratis. Consultado el 29 sep 2026.' },
          { label: 'matterport.com: planes y precios', url: SRC.matterport, note: 'Precios en euros mostrados en el navegador. Consultado el 29 sep 2026.' },
          { label: 'andreasgrunau.com: precios Matterport en España', url: SRC.grunau, note: 'Escaneo con cámara Pro3 en Málaga, IVA aparte. Consultado el 29 sep 2026.' },
          { label: 'cubi.casa: precios', url: SRC.cubi, note: 'Precios que la web muestra para España. Consultado el 29 sep 2026.' },
          { label: 'boxbrownie.com: planos 2D y 3D', url: SRC.box, note: 'Consultado el 29 sep 2026.' },
          { label: 'homestagerdesign.com: planos 3D', url: SRC.hsd, note: 'Consultado el 29 sep 2026.' },
          { label: 'vistastudiodesign.com: packs y precios', url: SRC.vista, note: 'Precios sin IVA. Consultado el 29 sep 2026.' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuál es el mejor estudio de renders 3D de la Costa del Sol?',
        a: 'Depende del encargo. Para una preventa de villas de lujo con presupuesto a medida, Viseni, en Marbella desde 2008, hace renders, animación y realidad virtual. Para fotos, planos y tour de una vivienda terminada, Improntia, en Benahavís. Para modelar desde el plano con visor y realidad aumentada a precio publicado, {{brand}}, desde {{price:maqueta}} + IVA. Somos parte interesada: compruébalo en sus webs.',
      },
      {
        q: '¿Qué estudios de visualización 3D publican sus precios?',
        a: 'De las diez opciones de esta comparativa, siete publican precio: Floorfy (planes de 19 a 99 € al mes), Matterport (plan gratuito, y Starter a 13 € al mes u 11 € con pago anual), CubiCasa (plano 3D por 65 €), BoxBrownie (40 € por planta), Home Stager Design (119,95 €), Vista Studio (129 € sin IVA) y {{brand}} (plano 3D desde {{price:plano3d}} + IVA). Viseni, Improntia y Persuadis trabajan con presupuesto.',
      },
      {
        q: '¿Qué empresa convierte planos en modelos 3D para inmobiliarias?',
        a: 'Varias, con resultados distintos. BoxBrownie y Home Stager Design convierten la imagen de un plano en un plano 3D, que es una imagen. Estudios de infografía como Viseni hacen renders de viviendas antes de construirlas, con presupuesto. {{brand}} construye desde el plano 2D un modelo 3D completo, con renders, visor web y realidad aumentada, desde {{price:maqueta}} + IVA y en {{delivery:maqueta}}.',
      },
      {
        q: '¿Es mejor un estudio de infografía o una herramienta de IA?',
        a: 'Para una vivienda que ya existe y tiene fotos, la IA es rápida y barata: Vista Studio redecora pisos por 129 € sin IVA y entrega en 24 horas laborables. Para obra nueva sin fotos, o si todas las vistas deben coincidir entre sí, hace falta un modelo 3D. {{brand}} construye ese modelo desde el plano y explica la diferencia en [IA o modelo 3D real](@guia-ia-vs-3d).',
      },
      {
        q: '¿Matterport o un estudio de visualización 3D?',
        a: 'Matterport escanea una vivienda que ya existe: sirve cuando está terminada y sus acabados la venden, con plan gratuito y Starter a 13 € al mes (11 € con pago anual), más el escaneo. Un estudio modela desde el plano, así que también sirve para obra nueva. En {{brand}}, el modelo 3D con visor y realidad aumentada cuesta desde {{price:maqueta}} + IVA. Lo comparamos en [modelo 3D o Matterport](@guia-matterport).',
      },
      {
        q: '¿Por qué aparecéis en una lista que escribís vosotros?',
        a: 'Porque somos una opción real para una parte de los casos, y ocultarlo sería peor. Para compensar el conflicto de interés, {{brand}} publica los criterios, enlaza la web de cada empresa, no ordena la lista por calidad y dice cuándo te conviene más otra opción. Nuestro precio también está a la vista: el plano 3D, desde {{price:plano3d}} + IVA, y la maqueta completa, desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Cada cuánto se actualiza esta comparativa?',
        a: 'Cada tres meses. Los datos actuales se consultaron en la web de cada empresa el 29 de septiembre de 2026, y la próxima revisión será en diciembre de 2026. Si una empresa cambia sus precios o sus servicios antes, {{brand}} corrige el dato cuando lo detecta o cuando alguien lo avisa en {{email}}, y cambia la fecha de actualización de la página.',
      },
      {
        q: '¿Puede aparecer mi estudio en esta lista?',
        a: 'Sí, si encaja con los criterios y su web publica lo que ofrece. {{brand}} no cobra por aparecer ni por el orden, que va por tipo de servicio. Escríbenos a {{email}} con la dirección de tu web: comprobamos los datos en ella y, si encajan, te incluimos en la siguiente revisión trimestral, con la fecha de consulta a la vista.',
      },
    ],
    related: ['guia-precio-render', 'guia-matterport', 'caso-villa', 'precios', 'sol-promotoras'],
    cta: {
      h2: '¿Nos comparas con tu propio plano?',
      body: 'Envíanos el plano de una vivienda y modelamos gratis una estancia en 3D, que te mandamos en realidad aumentada. Así comparas con un resultado, no con promesas.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  // Angle: international agencies and developers selling on the Costa del Sol, often from abroad.
  en: {
    title: 'Best 3D visualisation studios in Spain (2026)',
    description: 'Ten 3D property visualisation studios and tools in Spain compared for 2026: what each offers, who it suits and its price where published. We are one of them.',
    h1: 'Best 3D visualisation studios for property in Spain',
    lead: 'Ten 3D property visualisation studios and tools working in Spain in 2026, by what you need: Viseni or Improntia on the Costa del Sol, Persuadis for developers, Floorfy or Matterport for tours, CubiCasa, BoxBrownie or Home Stager Design for floor plans, Vista Studio for AI on photos and {{brand}}, from {{price:plano3d}} + VAT.',
    breadcrumb: 'Best 3D studios',
    card: {
      title: 'Best 3D visualisation studios in Spain',
      summary: 'Ten studios and tools compared on visible criteria, with published prices and who each one suits. We are one of them.',
    },
    facts: [
      ['Options compared', '10 studios and tools, {{brand}} included'],
      ['Criteria', 'Input, deliverables, public price, turnaround and location'],
      ['On the Costa del Sol', 'Viseni (Marbella), Improntia (Benahavís) and {{brand}}'],
      ['Published prices', '7 of the 10 options'],
      ['Order', 'By type of service; not a ranking'],
      ['Interested party', 'Yes: {{brand}} writes this guide and appears in it'],
      ['Data checked', '29 September 2026'],
      ['Next review', 'December 2026'],
    ],
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Cut-away 3D model of the anonymised Costa del Sol villa, a render produced from its 2D floor plan',
      caption: 'A render from our demonstration case. {{brand}} is one of the studios in this comparison.',
    },
    blocks: [
      {
        type: 'callout',
        tone: 'honesty',
        title: 'We are {{brand}}, one of the studios on this list',
        body: 'This comparison is written by a studio that competes with several of the companies in it, so it is not neutral. To make it useful anyway: the criteria are visible, every fact about another company comes from its own website (checked on 29 September 2026 and linked), we only give a price where the company publishes one, and the list is grouped by type of service, not ranked by quality. No company has paid to appear. If something has changed, email us at {{email}} and we will correct it.',
      },
      {
        type: 'answer',
        h2: 'What is the best 3D visualisation studio in Spain?',
        answer: 'There is no single best one: it depends on what you have (a floor plan, photos or a finished home), what you need to deliver and how much time you have. For a luxury villa pre-sale with a bespoke budget, a high-end studio; for a finished home, a tour or a scan; for a quick layout image, an online platform.',
        body: 'So this guide does not name a winner. It brings together ten real options for [CGI](@glosario#infografia-3d), tours and floor plans in Spain, says what each one offers and who it suits, and links to each website so you can check what we say. If you sell Spanish property to buyers abroad, the question that matters most is whether the home exists yet. First, the criteria we used.',
      },
      {
        type: 'table',
        h2: 'Which criteria do we compare them on?',
        intro: 'Six criteria you can apply to any provider, including the ones that are not on this list.',
        caption: 'Comparison criteria',
        head: ['Criterion', 'What we look at', 'Why it matters'],
        rows: [
          ['Input', 'What the provider needs: a floor plan, photos or a visit to the property', 'An off-plan development cannot be photographed or scanned'],
          ['Deliverables', 'Images, a [360° tour](@glosario#tour-virtual-360), a floor plan, a 3D model, a [web viewer](@glosario#visor-3d) or [augmented reality](@glosario#realidad-aumentada)', 'An image is published once; a model is reused for renders, a viewer and AR'],
          ['Public price', 'Whether the website publishes a rate or only gives quotes', 'With a published rate you can budget without waiting for a reply'],
          ['Turnaround', 'Whether the website publishes a delivery time', 'A pre-sale launch or a property fair has a fixed date'],
          ['Location', 'Where it is based and whether it works remotely', 'A scan or a photo shoot means someone has to travel to the property'],
          ['Who it is for', 'Estate agents, developers, architects or photographers', 'A provider built for your case asks less of you'],
        ],
      },
      {
        type: 'table',
        h2: 'Which 3D visualisation studios and tools work in Spain?',
        intro: 'Ten real options, grouped by type: Costa del Sol studios, a marketing agency for developers, tour and scanning platforms, online floor plans, AI renders and, last, us. The order is not a ranking. The facts come from each company’s website, checked on 29 September 2026; several of those sites are in Spanish.',
        caption: '3D property visualisation studios and tools in Spain (September 2026)',
        itemList: true,
        head: ['Studio or tool', 'What it offers', 'Best for', 'Published price'],
        rows: [
          [`[Viseni](${SRC.viseni})`, 'Visualisation studio based in Marbella since 2008: renders, 3D animation, virtual reality tours, augmented reality and interactive 3D models', 'Luxury villa developers and architects preparing a pre-sale or a competition entry', 'No published prices; replies to quote requests within 24 hours'],
          [`[Improntia](${SRC.improntia})`, 'Studio based in Benahavís: property photography, video and drone, 360° virtual tours, 2D and 3D floor plans, [virtual staging](@glosario#home-staging-virtual) and renders', 'Costa del Sol agents who want photos, plans and a tour of a finished home from one supplier', 'No published prices; Pro, Superior and Sublime packages on quote'],
          [`[Persuadis](${SRC.persuadis})`, 'Property marketing agency based in Barcelona: AI renders and videos, strategy, branding, sales material, a call centre and Inmoshowroom, a virtual showroom over video call', 'Developers who want to outsource the marketing of a new-build scheme', 'No published prices'],
          [`[Floorfy](${SRC.floorfy})`, 'Barcelona software for virtual tours shot with a 360° camera, floor plans, videos and AI virtual staging', 'Agencies that shoot their own finished homes and publish many listings a month', '€19 to €99 a month (€190 to €990 a year) depending on active tours; free floor plan editor; 14-day trial'],
          [`[Matterport](${SRC.matterport})`, `[Digital twin](@glosario#gemelo-digital) platform: you scan an existing home with a phone, tablet or 360° camera, or book a [scanning provider, including in Málaga](${SRC.grunau})`, 'Finished homes where buyers want to walk through the property as it really is', 'Free plan with 1 active space; Starter at €13 a month, or €11 a month billed annually; scanning in Málaga from €190 + VAT'],
          [`[CubiCasa](${SRC.cubi})`, 'Finnish app: you scan the home with your phone and receive a 2D plan or a furnished 3D floor plan', 'Photographers and agents who already visit the property and want the plan without drawing it', 'Furnished 3D floor plan, €65 in 48 hours; first 2D floor plan free'],
          [`[BoxBrownie](${SRC.box})`, 'Online property editing platform: 2D and 3D floor plans drawn from the plan you upload', 'Resale listings that need a quick colour layout', 'Colour 3D plan, €40 per floor in 48 hours; tailored plans from €200'],
          [`[Home Stager Design](${SRC.hsd})`, 'Online floor plan shop: black and white 2D, colour 2D and furnished colour 3D plans from an image of the plan', 'Small flats that need a 3D floor plan at a fixed price', '€119.95 for a 3D plan per floor of about 60 m², from 72 hours, 1 revision included'],
          [`[Vista Studio](${SRC.vista})`, 'Barcelona studio producing AI renders and AI video tours from phone photos', 'Virtually restyling or renovating flats that already exist and have photos', 'Renders for up to 6 rooms, €129; video tour, €290; ex VAT'],
          ['[{{brand}}](@home)', 'Studio based in Mijas (Costa del Sol): a furnished 3D model built from the 2D floor plan, with no photos or site visit, plus renders, a web viewer and app-free augmented reality', '[Off-plan](@glosario#venta-sobre-plano), new-build and empty or distant homes that buyers view remotely', '3D floor plan from {{price:plano3d}}; complete 3D model from {{price:maqueta}}; ex VAT'],
        ],
        note: 'Prices as each company publishes them. Vista Studio, the Matterport provider in Málaga and {{brand}} state outright that their prices exclude VAT; with the others, ask, as Spanish VAT is 21%. Matterport and CubiCasa prices are the ones their websites show for Spain.',
      },
      {
        type: 'table',
        h2: 'Which option fits your situation?',
        intro: 'Still unsure? Start from what is in front of you: what kind of home it is and what you need to show.',
        caption: 'Which type of provider fits each case',
        head: ['Your situation', 'Type of option', 'Examples from the list'],
        rows: [
          ['Luxury villa pre-sale with a bespoke budget', 'High-end visualisation studio', 'Viseni'],
          ['Marketing an entire new-build scheme', 'Property marketing agency', 'Persuadis'],
          ['Finished home on the Costa del Sol that needs photos, plans and a tour', 'Property photographer with 3D services', 'Improntia'],
          ['Many finished homes a month, with your own team', 'Tour software with a 360° camera, or scanning', 'Floorfy, Matterport'],
          ['Just the layout of a resale flat', 'Online floor plan or scanning app', 'BoxBrownie, Home Stager Design, CubiCasa'],
          ['A flat with photos that you want to restyle', 'AI renders from photos', 'Vista Studio'],
          ['Off-plan or empty home that buyers will view from abroad', '3D model from the floor plan, with a viewer and augmented reality', '{{brand}}'],
        ],
      },
      {
        type: 'checklist',
        h2: 'How do you choose a 3D visualisation studio?',
        intro: 'Seven checks before you commission anyone, whoever you choose.',
        items: [
          'If the home does not exist yet, rule out scans and AI renders from photos: you need someone who models from the floor plan.',
          'If the home is finished and its finishes sell it, a 360° tour or a scan shows it as it really is.',
          'Ask for a finished example you can open and spin, not just portfolio images.',
          'Get the price in writing, with deliverables, rounds of changes, turnaround and VAT.',
          'Ask what you get besides images: the model, a viewer you can embed or augmented reality files.',
          'Check whether someone has to visit the property, and who pays for the trip.',
          'Confirm that images come labelled as virtual recreations for property portals.',
        ],
      },
      {
        type: 'answer',
        h2: 'How much does a 3D visualisation studio cost in Spain?',
        answer: 'It depends on the deliverable. Based on the published rates collected in our guides, an interior render in Spain costs €200 to €450 per image, and a 3D floor plan €100 to €800 depending on the level, or €40 per floor on an online platform. High-end studios quote per project.',
        body: 'The full tables, with a source for every figure, are in our guides to [3D rendering costs in Spain](@guia-precio-render) and to [what a 3D floor plan costs per floor](@guia-precio-plano). If you are weighing a scan against a model built from the plan, read our [comparison of a 3D model, Matterport and a 360 tour](@guia-matterport).',
      },
      {
        type: 'answer',
        h2: 'Where do we fit in?',
        answer: '{{brand}} fits when all you have is a floor plan: an off-plan development, a new build or an empty home that buyers will view from another country. From the plan we produce the 3D model, 6 renders, a web viewer and app-free augmented reality, from {{price:maqueta}} + VAT in {{delivery:maqueta}}, with no site visit.',
        body: 'We are not the right choice for everything. We do not do photography, drone video or scans, and a full façade with its surroundings is quoted separately. We are a new studio: instead of testimonials, we show you a [demonstration case](@caso-villa) you can open in the viewer and on your phone, and every one of our [rates is published](@precios). If you are marketing a scheme, see how we work on [off-plan 3D visualisation](@sol-promotoras).',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'How we keep this list up to date',
        body: 'We review the list every three months; the next review is due in December 2026. We only add or remove options based on facts from their own websites, and we change the “Updated” date whenever something changes. If you run a studio or tool that meets these criteria, or you spot a fact that has changed, email us at {{email}}.',
      },
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'viseni.com', url: SRC.viseni, note: 'Services, Marbella base since 2008 and reply time. Checked 29 Sep 2026.' },
          { label: 'improntia.com', url: SRC.improntia, note: 'Services, Benahavís address and packages. Checked 29 Sep 2026.' },
          { label: 'persuadis.com', url: SRC.persuadis, note: 'In Spanish. Services and Barcelona head office. Checked 29 Sep 2026.' },
          { label: 'inmoshowroom.com', url: SRC.inmoshowroom, note: 'In Spanish. Persuadis’s virtual showroom. Checked 29 Sep 2026.' },
          { label: 'floorfy.com: prices and subscriptions', url: SRC.floorfy, note: 'Monthly plans and free floor plan editor. Checked 29 Sep 2026.' },
          { label: 'matterport.com: plans and pricing', url: SRC.matterport, note: 'Euro prices shown in a browser. Checked 29 Sep 2026.' },
          { label: 'andreasgrunau.com: Matterport prices in Spain', url: SRC.grunau, note: 'In Spanish. Pro3 scanning in Málaga, VAT extra. Checked 29 Sep 2026.' },
          { label: 'cubi.casa: pricing', url: SRC.cubi, note: 'Prices shown for Spain. Checked 29 Sep 2026.' },
          { label: 'boxbrownie.com: 2D and 3D floor plans', url: SRC.box, note: 'Checked 29 Sep 2026.' },
          { label: 'homestagerdesign.com: 3D floor plans', url: SRC.hsd, note: 'In Spanish. Checked 29 Sep 2026.' },
          { label: 'vistastudiodesign.com: packages and prices', url: SRC.vista, note: 'In Spanish, prices ex VAT. Checked 29 Sep 2026.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Which is the best 3D rendering studio on the Costa del Sol?',
        a: 'It depends on the brief. For a luxury villa pre-sale with a bespoke budget, Viseni, based in Marbella since 2008, produces renders, animation and virtual reality. For photos, plans and a tour of a finished home, Improntia in Benahavís. To model from the floor plan with a viewer and augmented reality at a published price, {{brand}}, from {{price:maqueta}} + VAT. We are an interested party, so check their websites.',
      },
      {
        q: 'Which 3D visualisation studios publish their prices?',
        a: 'Seven of the ten options in this comparison publish prices: Floorfy (plans from €19 to €99 a month), Matterport (a free plan, and Starter at €13 a month or €11 billed annually), CubiCasa (a 3D floor plan for €65), BoxBrownie (€40 per floor), Home Stager Design (€119.95), Vista Studio (€129 ex VAT) and {{brand}} (3D floor plans from {{price:plano3d}} + VAT). Viseni, Improntia and Persuadis work on quotes.',
      },
      {
        q: 'Which company turns floor plans into 3D models for estate agents?',
        a: 'Several, with different results. BoxBrownie and Home Stager Design turn the image of a plan into a 3D floor plan, which is a picture. Visualisation studios such as Viseni render homes before they are built, on a quote. {{brand}} builds a complete 3D model from the 2D plan, with renders, a web viewer and augmented reality, from {{price:maqueta}} + VAT in {{delivery:maqueta}}.',
      },
      {
        q: 'Should I use a visualisation studio or an AI tool?',
        a: 'For a home that already exists and has photos, AI is fast and cheap: Vista Studio restyles flats for €129 ex VAT and delivers within 24 working hours. For off-plan homes with no photos, or when every view has to match the others, you need a 3D model. {{brand}} builds that model from the floor plan and explains the difference in [Can AI turn a floor plan into 3D?](@guia-ia-vs-3d).',
      },
      {
        q: 'Matterport or a 3D visualisation studio?',
        a: 'Matterport scans a home that already exists, so it suits finished properties whose finishes sell them, with a free plan and Starter at €13 a month (€11 billed annually) plus the scan itself. A studio models from the floor plan, so it also works off-plan. At {{brand}}, the 3D model with a viewer and augmented reality starts at {{price:maqueta}} + VAT. We compare both in [3D model vs Matterport](@guia-matterport).',
      },
      {
        q: 'Why are you on a list you wrote yourselves?',
        a: 'Because we are a genuine option for some of these cases, and hiding that would be worse. To offset the conflict of interest, {{brand}} publishes the criteria, links to every company’s website, does not rank the list by quality and says when another option suits you better. Our prices are public too: 3D floor plans from {{price:plano3d}} + VAT and the complete model from {{price:maqueta}} + VAT.',
      },
      {
        q: 'How often is this comparison updated?',
        a: 'Every three months. The current facts were checked on each company’s website on 29 September 2026, and the next review is due in December 2026. If a company changes its prices or services before then, {{brand}} corrects the entry when we spot it or when someone tells us at {{email}}, and updates the date on the page.',
      },
      {
        q: 'Can my studio be added to this list?',
        a: 'Yes, if it meets the criteria and its website publishes what it offers. {{brand}} does not charge for inclusion or for position, and the order follows the type of service. Email us at {{email}} with your website address: we check the facts there and, if they fit, add you at the next quarterly review, with the date we checked them.',
      },
    ],
    related: ['guia-precio-render', 'guia-matterport', 'caso-villa', 'precios', 'sol-promotoras'],
    cta: {
      h2: 'Compare us using your own floor plan',
      body: 'Send us the plan of a property and we model one room in 3D free of charge, then send it to you in augmented reality. That way you compare a real result, not promises.',
      service: 'maqueta',
    },
  },
};
