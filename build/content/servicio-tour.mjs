// Service page: 3D virtual tour / interactive 3D floor plan (web viewer built from the plan).
// ES cluster C4 (02-keywords-es.md), EN clusters C2 + C9 (03-keywords-en.md).
// Stat verified 2026-09-28 in the primary source (Registradores ERI 2T 2026 PDF, section 6).

const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';

export default {
  id: 'servicio-tour',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Tour virtual 3D inmobiliario desde el plano',
    description: 'Visor 3D para tu anuncio creado desde el plano: estancias con m², recorrido guiado y modo maqueta. Incluido en la maqueta 3D desde {{price:maqueta}} + IVA.',
    h1: 'Tour virtual 3D inmobiliario, sin visita ni cámara',
    lead: 'Creamos un tour virtual 3D a partir del plano, sin visita ni cámara: un visor web que recorre las estancias y corta los muros para ver la distribución. Se comparte con un enlace o se incrusta en tu web. Incluido en la maqueta 3D completa, desde {{price:maqueta}} + IVA en {{delivery:maqueta}}.',
    breadcrumb: 'Tour virtual 3D',
    card: {
      title: 'Tour virtual 3D',
      summary: 'Visor 3D para tu anuncio con estancias, recorrido guiado y modo maqueta, creado desde el plano.',
    },
    hero: {
      image: 'villa_muros_completos',
      alt: 'Vista aérea de la planta alta de la villa con los muros a altura completa, las dos terrazas y la escalera de caracol. Render 3D generado a partir del plano 2D.',
      caption: 'Muros completos a 2,60 m. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Entrada', 'Plano 2D, sin visita ni cámara 360'],
      ['Funciones', 'Estancias con m², recorrido guiado, modo maqueta y luz'],
      ['Publicación', 'Enlace, iframe en tu web y código QR'],
      ['Peso del modelo', '{{file:glb}}, solo si el visitante pulsa el botón del visor'],
      ['Alojamiento', '12 meses incluidos; después, {{extra:hosting}} + IVA al año'],
      ['Realidad aumentada', 'Incluida en iPhone, iPad y Android, sin app'],
      ['Precio desde', '{{price:maqueta}} + IVA, en la maqueta completa'],
      ['Plazo', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué es un tour virtual 3D creado desde el plano?',
        answer: 'Es un modelo 3D de la vivienda que el comprador explora en el navegador: lo gira, se acerca, salta de una estancia a otra y ve la distribución desde arriba con los muros cortados. A diferencia de un tour 360, no hace falta que la vivienda exista ni visitarla con una cámara: basta el plano.',
        body: 'Lo llamamos visor 3D, pero en los anuncios verás también «visita virtual 3D», «recorrido virtual» o «maqueta 3D interactiva»: es lo mismo. Funciona en el móvil, la tableta y el ordenador, y desde el móvil el comprador pasa a la [realidad aumentada sin app](@servicio-ar) con un toque.',
      },
      {
        type: 'viewer',
        h2: 'Prueba el visor con la villa de demostración',
        intro: 'Es el mismo visor que entregamos: {{villa:rooms}} estancias con sus m², recorrido guiado, modo maqueta y control de luz. Lo que ves primero es una imagen; el modelo ({{file:glb}}) solo se descarga cuando pulsas.',
      },
      {
        type: 'answer',
        h2: '¿Qué es el modo maqueta del visor?',
        answer: 'Es una vista que corta todos los muros a {{villa:cutHeight}} m de altura, como la maqueta de un arquitecto. Desde arriba se ven a la vez las estancias amuebladas, los pasos entre ellas y las terrazas. Con un toque vuelves a los muros completos de {{villa:wallHeight}} m para ver la vivienda como se vive.',
        body: 'El [modo maqueta](@glosario#modo-maqueta) se combina con un recorrido guiado que pasa por cada estancia con su nombre y su superficie, una vista de planta cenital y un control de luz. La lista de estancias está también como texto en la página, para buscadores y lectores de pantalla.',
      },
      {
        type: 'embedCode',
        h2: '¿Puedo poner el visor 3D en mi web?',
        intro: 'Sí. Copia este código y pégalo en la ficha de la vivienda, igual que un vídeo de YouTube. El visor se adapta al ancho de la página, funciona en móvil e incluye un pequeño crédito de texto a {{brand}}.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'El visor en los portales inmobiliarios',
        body: 'idealista solo admite visitas virtuales 3D de sus proveedores multimedia compatibles, así que no te prometemos el visor dentro del anuncio del portal. Sí funciona en tu web, en un enlace por WhatsApp o email, con un código QR en el escaparate o en el cartel de la vivienda y en el campo de tour virtual de los portales que acepten enlaces externos.',
      },
      {
        type: 'table',
        h2: '¿Qué diferencia hay entre un tour virtual 360 y un modelo 3D creado desde el plano?',
        intro: 'Los tres sirven para visitar una vivienda a distancia, pero parten de cosas distintas y enseñan cosas distintas.',
        caption: 'Tour 3D desde el plano frente a tour 360 fotográfico y escaneo 3D',
        head: ['Criterio', 'Tour 3D desde el plano ({{brand}})', 'Tour 360 fotográfico', 'Escaneo 3D tipo Matterport'],
        rows: [
          ['Qué hace falta', 'El plano 2D', 'Vivienda terminada, cámara 360 y visita', 'Vivienda terminada, cámara de escaneo y visita'],
          ['Obra nueva sin construir', 'Sí', 'No', 'No'],
          ['Qué enseña', 'La vivienda amueblada y terminada según el plano', 'El estado real el día de las fotos', 'El estado real, con las medidas del escaneo'],
          ['Vista de conjunto', 'Modo maqueta con muros cortados', 'No: se salta de panorámica en panorámica', 'Sí, vista de maqueta del escaneo'],
          ['Realidad aumentada sin app', 'Incluida', 'No', 'Depende de la plataforma'],
        ],
        note: 'Si la vivienda existe y sus acabados venden, un escaneo enseña la realidad tal cual y es la opción honesta. Cuándo compensa cada uno, en [modelo 3D o Matterport](@guia-matterport).',
      },
      {
        type: 'answer',
        h2: '¿El visor 3D ralentiza mi web?',
        answer: 'No. La página carga solo una imagen fija; el código del visor y el modelo de {{file:glb}} se descargan solo cuando el visitante pulsa el botón del visor. Así la ficha abre igual de rápido, la velocidad que mide Google no debería resentirse y solo gasta datos quien quiere recorrer la vivienda.',
        body: 'Lo mismo pasa con el código para incrustar: el iframe no se carga hasta que el visitante se acerca a esa parte de la página.',
      },
      {
        type: 'answer',
        h2: '¿Para qué sirve un tour virtual si el comprador vive fuera?',
        answer: 'Para que decida si merece la pena la visita antes de coger un avión. El comprador que vive en Londres, Ámsterdam o Estocolmo recorre la vivienda desde su casa, entiende la distribución y llega con las dudas resueltas. Tú dedicas las visitas a quien de verdad encaja y compartes el enlace en segundos.',
        body: 'Cómo encaja en el trabajo diario de una agencia, con portales, WhatsApp y captación de exclusivas, lo contamos en [soluciones para inmobiliarias](@sol-inmobiliarias). Si vendes obra nueva a compradores de fuera, sigue con [cómo vender una promoción antes de construirla](@guia-sobre-plano).\n\nTrabajamos en remoto desde Marbella para toda España, con especial foco en la costa malagueña: [tour virtual en Marbella](@zona-marbella), [Málaga capital](@zona-malaga) y el resto de la [Costa del Sol](@zona-costa-del-sol).',
      },
      {
        type: 'stat',
        value: '37,01 %',
        label: 'de las compraventas de vivienda inscritas en la provincia de Málaga en el segundo trimestre de 2026 fueron de compradores extranjeros; solo Alicante tuvo un porcentaje mayor (46,43 %)',
        source: { label: 'Colegio de Registradores, Estadística Registral Inmobiliaria', url: ERI },
        year: '2.º trimestre de 2026',
      },
      {
        type: 'process',
        variant: 'list',
        h2: '¿Cómo se crea el tour virtual a partir del plano?',
        intro: 'El visor es el último paso: primero modelamos, amueblamos y revisamos contigo la vivienda en un enlace privado.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: '¿Cuánto cuesta un tour virtual inmobiliario?',
        intro: 'El visor va incluido en la maqueta 3D completa, con 12 meses de alojamiento. Después, mantenerlo en línea cuesta {{extra:hosting}} por vivienda y año. Todos los precios, sin IVA.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Cómo puedo generar un recorrido virtual?',
        a: 'Hay dos caminos. Si la vivienda existe, una cámara 360 o un escáner capturan su estado real durante una visita. Si no existe o no puedes entrar, {{brand}} genera el recorrido virtual a partir del plano 2D: modelamos la vivienda en 3D, la amueblamos y te entregamos el visor en {{delivery:maqueta}}, desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Cuál es el mejor programa para crear recorridos virtuales?',
        a: 'Depende del punto de partida. Para fotografiar una vivienda existente se usan plataformas de tours 360 o de escaneo 3D; para modelar desde un plano, programas como Blender o SketchUp, que exigen práctica. {{brand}} trabaja con Blender y un visor web basado en model-viewer de Google, y te entrega el tour terminado: no aprendes ningún programa ni pagas licencias.',
      },
      {
        q: '¿Puedo poner el visor en el anuncio de idealista o Fotocasa?',
        a: 'No te lo prometemos. idealista solo admite visitas virtuales 3D de sus proveedores multimedia compatibles y {{brand}} hoy no figura en esa lista. Sí puedes usar el visor en tu web, compartirlo por enlace, WhatsApp o email, ponerlo en un QR del escaparate y pegar el enlace en el campo de tour virtual de los portales que acepten enlaces externos.',
      },
      {
        q: '¿Cuánto tiempo está publicado el visor?',
        a: 'La maqueta 3D completa de {{brand}} incluye 12 meses de alojamiento del visor, con su enlace y su código para incrustar. Si la vivienda sigue a la venta, la renovación cuesta {{extra:hosting}} + IVA por vivienda y año. Con la maqueta recibes también el modelo en GLB, USDZ y BLEND.',
      },
      {
        q: '¿El tour virtual funciona en el móvil?',
        a: 'Sí. El visor de {{brand}} funciona en el navegador del móvil, la tableta y el ordenador, sin instalar nada: se gira con un dedo, se amplía con dos y el recorrido guiado avanza solo. Desde un iPhone, un iPad o un Android compatible, el mismo botón abre la vivienda en realidad aumentada, sobre la mesa o a tamaño real.',
      },
      {
        q: '¿En qué idiomas está el visor?',
        a: 'El visor de {{brand}} está en español y en inglés: botones, nombres de las estancias y superficies. Si tu agencia trabaja con compradores de otros países, pregúntanos por más idiomas al pedir tu demo. La lista de estancias aparece también como texto en la página, así que el traductor del navegador la entiende.',
      },
      {
        q: '¿Se puede ver la vivienda con otros muebles?',
        a: 'Sí. Como el tour sale de un modelo 3D, {{brand}} cambia mobiliario y materiales sobre ese mismo modelo y el cambio aparece a la vez en el visor, en los renders y en la realidad aumentada. Es nuestro [home staging virtual sobre el modelo 3D](@servicio-staging), a {{extra:staging}} + IVA por estancia.',
      },
      {
        q: '¿Cuánto cuesta un tour virtual inmobiliario?',
        a: 'En {{brand}}, el tour virtual 3D va incluido en la maqueta 3D completa desde {{price:maqueta}} + IVA por vivienda de hasta 150 m², junto con 6 renders y la realidad aumentada. Incluye 12 meses de alojamiento; después, {{extra:hosting}} + IVA al año. Para carteras de agencia hay un pack de 5 viviendas por {{volume}} + IVA.',
      },
    ],
    related: ['servicio-ar', 'servicio-plano', 'caso-villa', 'precios', 'guia-matterport'],
    cta: {
      h2: '¿Quieres tu vivienda en un visor 3D?',
      body: 'Envíanos el plano y modelamos gratis una estancia en 3D, con realidad aumentada, para que la compartas con tu equipo antes de decidir. Sin compromiso.',
    },
  },

  en: {
    title: 'Interactive 3D floor plans to embed in your listings',
    description: 'An interactive 3D floor plan built from the 2D plan, with a room list, guided tour, cut-away mode and embed code. From {{price:maqueta}} + VAT.',
    h1: 'Interactive 3D floor plans for property listings',
    lead: 'We build an interactive 3D floor plan from the home’s 2D plan, with no visit and no camera: a web viewer buyers tour room by room, with the walls cut away. Share it as a link or embed it on your site. Included in the complete 3D model, from {{price:maqueta}} + VAT in {{delivery:maqueta}}.',
    breadcrumb: 'Interactive 3D floor plans',
    card: {
      title: 'Interactive 3D floor plans',
      summary: 'An embeddable 3D viewer for your listing, with rooms, a guided tour and cut-away mode, built from the plan.',
    },
    hero: {
      image: 'villa_muros_completos',
      alt: 'Aerial view of the villa’s upper floor with full-height walls, both terraces and the spiral staircase. 3D render generated from the 2D floor plan.',
      caption: 'Full-height walls at 2.60 m. 3D render from the 2D floor plan.',
    },
    facts: [
      ['Input', '2D floor plan, no visit and no 360 camera'],
      ['Features', 'Rooms with m², guided tour, cut-away mode and lighting'],
      ['Publishing', 'Link, iframe embed and QR code'],
      ['Model size', '{{file:glb}}, loaded only when the visitor taps the viewer button'],
      ['Hosting', '12 months included; then {{extra:hosting}} + VAT a year'],
      ['Augmented reality', 'Included on iPhone, iPad and Android, no app'],
      ['Price from', '{{price:maqueta}} + VAT, with the complete model'],
      ['Turnaround', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What is an interactive 3D floor plan?',
        answer: 'It is a 3D model of the home that buyers explore in their browser: they rotate it, zoom in, jump from room to room and see the layout from above with the walls cut away. Unlike a 360 tour, the home does not need to exist and nobody visits it with a camera: the floor plan is enough.',
        body: 'Listings call it many things: a 3D walkthrough, a 3D virtual tour, a virtual tour from the floor plan. It runs on phones, tablets and computers, and on a phone buyers can switch to [app-free augmented reality](@servicio-ar) with one tap.',
      },
      {
        type: 'viewer',
        h2: 'Try the viewer with our demo villa',
        intro: 'This is the same viewer we deliver: {{villa:rooms}} rooms with their floor areas, a guided tour, cut-away mode and a lighting control. What you see first is an image; the model ({{file:glb}}) only downloads when you tap.',
      },
      {
        type: 'answer',
        h2: 'What is cut-away mode in the viewer?',
        answer: 'It is a mode that slices every wall at {{villa:cutHeight}} m, like an architect’s model. From above, buyers see all the furnished rooms at once, how they connect and where the terraces are. One tap restores the full {{villa:wallHeight}} m walls, so they can see the home as it will be lived in.',
        body: '[Cut-away mode](@glosario#modo-maqueta), close to what Matterport calls a dollhouse view, sits alongside a guided tour that stops at each room with its name and floor area, a top-down plan view and a lighting control. The room list is also plain text on the page, so search engines and screen readers can read it.',
      },
      {
        type: 'embedCode',
        h2: 'Can I embed the 3D viewer on my website?',
        intro: 'Yes. Copy this snippet into the property page, just as you would a YouTube video. The viewer adapts to the page width, works on phones and carries a small text credit to {{brand}}.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'The viewer and property portals',
        body: 'We don’t promise an embedded viewer inside a portal listing: idealista, for example, only accepts 3D tours from its list of compatible multimedia providers. The viewer works on your own website, as a link by email or WhatsApp, as a QR code in your office window, and in any portal field that accepts an external virtual-tour link.',
      },
      {
        type: 'table',
        h2: 'How is a 3D model from a plan different from a 360 tour or Matterport?',
        intro: 'All three let buyers view a home remotely, but they start from different things and show different things.',
        caption: 'A 3D tour built from the plan compared with a photographic 360 tour and a 3D scan',
        head: ['Criterion', 'Built from the plan ({{brand}})', 'Photographic 360 tour', 'Matterport-style 3D scan'],
        rows: [
          ['What it needs', 'The 2D floor plan', 'A finished home, a 360 camera and a visit', 'A finished home, a scanning camera and a visit'],
          ['Off-plan, not yet built', 'Yes', 'No', 'No'],
          ['What it shows', 'The home furnished and finished to the plan', 'The home as it was on the day', 'The home as it was, with scanned measurements'],
          ['Whole-home overview', 'Cut-away mode with sliced walls', 'No: buyers hop between panoramas', 'Yes, the scan’s dollhouse view'],
          ['App-free augmented reality', 'Included', 'No', 'Depends on the platform'],
        ],
        note: 'If the home exists and its finishes are a selling point, a scan shows reality as it is and is the honest choice. When each one makes sense: [3D model vs Matterport](@guia-matterport).',
      },
      {
        type: 'answer',
        h2: 'Will the 3D viewer slow down my website?',
        answer: 'No. The page loads a single still image; the viewer code and the {{file:glb}} model only download when the visitor taps the viewer button. The listing opens just as fast, Core Web Vitals should not suffer, and only buyers who want to walk through the home use their data.',
        body: 'The embed behaves the same way: the iframe does not load until the visitor scrolls to it.',
      },
      {
        type: 'answer',
        h2: 'Why does it matter when buyers live abroad?',
        answer: 'Because they can decide whether a viewing is worth a flight. A buyer in London, Amsterdam or Stockholm tours the home from their sofa, understands the layout and arrives with their questions answered. You spend viewing days on buyers who are a real fit, and you share the link in seconds.',
        body: 'How it fits an agency’s daily routine, from portal listings to WhatsApp follow-ups, is covered in [3D for estate agents](@sol-inmobiliarias).\n\nWe work remotely from our Marbella base for clients across Spain and abroad; for the local market, see [3D tours and renders in Marbella](@zona-marbella).',
      },
      {
        type: 'stat',
        value: '37.01%',
        label: 'of home sales registered in Málaga province in Q2 2026 were to foreign buyers; only Alicante had a higher share (46.43%)',
        source: { label: 'Colegio de Registradores (Spain’s association of land registrars), Estadística Registral Inmobiliaria', url: ERI },
        year: 'Q2 2026',
      },
      {
        type: 'process',
        variant: 'list',
        h2: 'How is a 3D walkthrough made from a floor plan?',
        intro: 'The viewer is the last step: first we model and furnish the home, then you review it with us on a private link.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'How much does an interactive 3D floor plan cost?',
        intro: 'The viewer comes with the complete 3D model, including 12 months of hosting. After that, keeping it online costs {{extra:hosting}} per home per year. All prices exclude VAT.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'What can I use instead of Matterport?',
        a: 'When the home cannot be scanned, because it is off-plan, tenanted, abroad or unfinished, a 3D model built from the floor plan does the same job. {{brand}} delivers it with a guided tour, cut-away mode and app-free AR, from {{price:maqueta}} + VAT in {{delivery:maqueta}}. If the home exists and looks good, a scan remains a fair choice.',
      },
      {
        q: 'Can I get a 3D virtual tour from a floor plan alone?',
        a: 'Yes. {{brand}} models the home to scale from its 2D plan, furnishes it and publishes it in a web viewer your buyers can explore room by room. No photos, no site visit and no camera are needed. Floor areas are estimates (≈) when the plan has no dimensions, and we say so in the viewer’s room list.',
      },
      {
        q: 'Can I embed the viewer in a portal listing?',
        a: 'We don’t promise it. Portals decide what can be embedded: idealista, for example, only accepts 3D tours from its compatible providers, and {{brand}} is not on that list today. What always works is your own website, a link by email or WhatsApp, a QR code in your window, and any portal field that accepts an external virtual-tour link.',
      },
      {
        q: 'How long is the viewer hosted?',
        a: 'The {{brand}} complete 3D model includes 12 months of viewer hosting, with its link and embed code. If the property is still on the market, renewal costs {{extra:hosting}} + VAT per home per year. The complete model comes with GLB, USDZ and BLEND files.',
      },
      {
        q: 'Does the 3D viewer work on phones?',
        a: 'Yes. The {{brand}} viewer runs in the browser on phones, tablets and computers, with nothing to install: one finger rotates, two fingers zoom, and the guided tour moves on by itself. On an iPhone, iPad or compatible Android phone, the same button opens the home in augmented reality, on the table or at real size.',
      },
      {
        q: 'Which languages is the viewer available in?',
        a: 'The {{brand}} viewer is in English and Spanish: buttons, room names and floor areas. If your agency sells to Dutch, German or Scandinavian buyers, ask us about more languages when you request your demo. The room list is also plain text on the page, so browser translation handles it well.',
      },
      {
        q: 'Can buyers see the home with different furniture?',
        a: 'Yes. Because the tour comes from a 3D model, {{brand}} can swap furniture and finishes on that same model, and the change appears at once in the viewer, the renders and augmented reality. That is our [3D virtual staging](@servicio-staging), at {{extra:staging}} + VAT per room.',
      },
      {
        q: 'How much does a virtual tour from a floor plan cost?',
        a: 'At {{brand}}, the interactive 3D floor plan comes with the complete 3D model, from {{price:maqueta}} + VAT per home up to 150 m², together with 6 renders and augmented reality. It includes 12 months of hosting, then {{extra:hosting}} + VAT a year. For agency portfolios there is a 5-home Portfolio pack at {{volume}} + VAT.',
      },
    ],
    related: ['servicio-ar', 'servicio-plano', 'caso-villa', 'precios', 'guia-matterport'],
    cta: {
      h2: 'Want your listing in a 3D viewer?',
      body: 'Send us the floor plan and we will model one room in 3D, with augmented reality, free, so you can share it with your team before deciding. No obligation.',
    },
  },
};
