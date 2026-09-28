// Service page: app-free augmented reality (AR Quick Look + Scene Viewer), 1:20 tabletop and real size.
// ES cluster C5 (02-keywords-es.md), EN cluster C6 (03-keywords-en.md).
// Verified 2026-09-28: Registradores ERI 2T 2026 PDF (section 6), Apple AR Quick Look page,
// Google Scene Viewer page and ARCore supported devices page.

const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';
const APPLE = 'https://developer.apple.com/augmented-reality/quick-look/';
const SCENE = 'https://developers.google.com/ar/develop/scene-viewer';
const DEVICES = 'https://developers.google.com/ar/devices';

export default {
  id: 'servicio-ar',
  image: 'villa_terraza_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Realidad aumentada inmobiliaria, sin app ni descargas',
    description: 'Tu comprador ve la vivienda sobre su mesa a escala 1:20 o a tamaño real desde iPhone o Android, sin instalar nada. Incluida desde {{price:maqueta}} + IVA.',
    h1: 'Realidad aumentada inmobiliaria: la vivienda en tu mesa',
    lead: 'Tu comprador coloca la vivienda sobre su mesa como una maqueta a escala 1:20, o a tamaño real en el suelo, desde su iPhone, iPad o Android y sin instalar ninguna app. La creamos a partir del plano 2D y va incluida en la maqueta 3D completa, desde {{price:maqueta}} + IVA, con entrega en {{delivery:maqueta}}.',
    breadcrumb: 'Realidad aumentada',
    card: {
      title: 'Realidad aumentada sin app',
      summary: 'La vivienda sobre la mesa a escala 1:20 o a tamaño real, desde el móvil del comprador y sin instalar nada.',
    },
    hero: {
      image: 'villa_terraza',
      alt: 'Terraza principal de la villa con suelo de barro cocido, tumbonas, sofá exterior y un olivo en maceta. Render 3D generado a partir del plano 2D.',
      caption: 'Terraza principal. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Entrada', 'Plano 2D, sin fotos'],
      ['Dispositivos', 'iPhone y iPad con Safari; Android compatible con ARCore'],
      ['Sin app', 'AR Quick Look en Apple y Scene Viewer en Android'],
      ['Modos', 'Maqueta 1:20 sobre la mesa y tamaño real'],
      ['Formatos', 'USDZ y GLB'],
      ['En ordenador', 'Código QR para abrirla en el móvil'],
      ['Precio desde', '{{price:maqueta}} + IVA, en la maqueta completa'],
      ['Plazo', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Cómo ven mis clientes la vivienda en realidad aumentada?',
        answer: 'Abren el anuncio en el móvil, tocan «Ver en tu salón» y la vivienda aparece sobre su mesa como una maqueta a escala 1:20, con los muros cortados. Pueden rodearla, acercarse y mirar cada estancia amueblada. Con la versión a tamaño real, recorren el salón o la terraza en el suelo de su casa.',
        body: 'Es la misma vivienda del [tour virtual 3D](@servicio-tour) y de los renders: un solo modelo y tres formas de verlo, sin diferencias entre ellas.',
      },
      {
        type: 'ar',
        h2: 'Pruébalo ahora con la villa de demostración',
        intro: 'En el móvil, toca el botón. En el ordenador, escanea el código QR con la cámara del teléfono: la realidad aumentada solo funciona en móviles y tabletas.',
      },
      {
        type: 'answer',
        h2: '¿Tienen que instalar una app para verla?',
        answer: 'No. Usamos los visores que ya traen los teléfonos: [AR Quick Look](@glosario#ar-quick-look) en iPhone y iPad, que abre archivos [USDZ](@glosario#usdz) desde Safari, y [Scene Viewer](@glosario#scene-viewer) en Android, que abre archivos [GLB](@glosario#glb) en móviles compatibles con ARCore. El comprador toca un botón y la vivienda aparece, sin descargas ni registros.',
        body: 'Lo documentan Apple en su página de [AR Quick Look](' + APPLE + ') y Google en la de [Scene Viewer](' + SCENE + '). En Apple hace falta iOS o iPadOS 12 o posterior; en Android, la versión 7.0 o posterior y los servicios de Google Play para realidad aumentada.',
      },
      {
        type: 'formats',
        h2: '¿Funciona en iPhone y en Android?',
        intro: 'Sí, y cada sistema recibe su formato. Estos son los archivos reales de la villa de demostración y lo que pesan.',
      },
      {
        type: 'table',
        h2: '¿Maqueta sobre la mesa o a tamaño real?',
        intro: 'Entregamos las dos versiones de cada vivienda, porque sirven para cosas distintas.',
        caption: 'Dos formas de ver la vivienda en realidad aumentada',
        head: ['Modo', 'Escala', 'Para qué sirve'],
        rows: [
          ['Maqueta sobre la mesa', '1:20', 'Entender la distribución de un vistazo, en la oficina de ventas, en una feria o en casa del comprador'],
          ['Tamaño real', '1:1', 'Recorrer el salón o la terraza en el suelo y hacerse una idea del espacio'],
        ],
        note: 'A tamaño real, la planta de la villa ocupa unos {{villa:footprint}}: en un salón normal se recorren una o dos estancias; en un jardín o una parcela, la vivienda entera.',
      },
      {
        type: 'answer',
        h2: '¿Qué es la realidad aumentada y cómo se usa en inmobiliaria?',
        answer: 'La realidad aumentada superpone un objeto 3D a lo que ve la cámara del móvil, anclado a la mesa o al suelo. En inmobiliaria sirve para enseñar una vivienda que no existe o que está lejos: en la oficina de ventas, en ferias, en la visita a un solar o por WhatsApp a un comprador que vive en otro país.',
        body: 'Ese comprador extranjero pesa cada vez más: en el segundo trimestre de 2026, británicos (6,99 %), neerlandeses (6,94 %) y alemanes (6,11 %) encabezaron las compras de vivienda de extranjeros en España, según la [Estadística Registral Inmobiliaria](' + ERI + ').\n\nPara promotoras es una alternativa ligera al piso piloto: cada tipología cabe en una mesa. Lo contamos en [visualización 3D para promotoras](@sol-promotoras). Y si quieres el paso a paso para enseñárselo a un cliente, tienes la guía [cómo ver una vivienda en realidad aumentada](@guia-ar).',
      },
      {
        type: 'stat',
        value: '15,98 %',
        label: 'de las compraventas de vivienda en España en el segundo trimestre de 2026 fueron de compradores extranjeros, algo más de 26.800 operaciones: el máximo de la serie histórica',
        source: { label: 'Colegio de Registradores, Estadística Registral Inmobiliaria', url: ERI },
        year: '2.º trimestre de 2026',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Dónde no funciona, para que no te pille por sorpresa',
        body: '- En un ordenador no hay realidad aumentada: mostramos un código QR para abrirla en el móvil.\n- En Android hace falta un móvil compatible con ARCore; en los demás, el comprador puede seguir viendo la vivienda en el visor 3D.\n- Si el enlace se abre dentro de otra app, como Instagram o WhatsApp, puede que el botón no lance la realidad aumentada: basta con abrirlo en Safari o Chrome.\n- Si el plano no trae cotas, las medidas a tamaño real son aproximadas (≈).',
      },
      {
        type: 'process',
        variant: 'list',
        h2: '¿Cómo preparamos la vivienda para la realidad aumentada?',
        intro: 'La realidad aumentada sale del mismo modelo que los renders y el visor. En la entrega recibes los archivos USDZ y GLB y el visor con los botones de realidad aumentada ya integrados.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: '¿Cuánto cuesta la realidad aumentada para una vivienda?',
        intro: 'No tiene precio aparte: va incluida en la maqueta 3D completa y en el pack de promoción, junto con los renders y el visor. Precios sin IVA.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Puedo usar la realidad aumentada en una feria o en la oficina de ventas?',
        a: 'Sí, y es donde más luce. Con la maqueta a escala 1:20, cualquier mesa sirve de expositor: el comercial abre la vivienda en una tableta o en el móvil del cliente y la rodean juntos, sin gafas ni equipos especiales. {{brand}} incluye la realidad aumentada en la maqueta completa, desde {{price:maqueta}} + IVA, y en cada tipología del pack de promoción.',
      },
      {
        q: '¿Qué móviles son compatibles con la realidad aumentada?',
        a: 'Funciona en iPhone y iPad con iOS o iPadOS 12 o posterior, desde Safari, y en móviles con Android 7.0 o posterior compatibles con ARCore; Google publica la [lista de dispositivos compatibles](' + DEVICES + '). En un ordenador, {{brand}} muestra un código QR para abrir la vivienda en el móvil.',
      },
      {
        q: '¿Se puede ver la vivienda a tamaño real y caminar por ella?',
        a: 'Sí. Además de la maqueta a escala 1:20, {{brand}} entrega una versión a tamaño real que se apoya en el suelo: el comprador camina por el salón o la terraza y se hace una idea del espacio. Necesitas sitio libre, porque la planta de nuestra villa mide unos {{villa:footprint}}. Si el plano no traía cotas, las medidas son aproximadas.',
      },
      {
        q: '¿Cuánto pesa el modelo y cuánto tarda en abrir con datos móviles?',
        a: 'En nuestra villa de demostración, la maqueta para iPhone pesa {{file:usdzMesa}} y la de Android {{file:glbArMesa}}; las versiones a tamaño real, {{file:usdzReal}} y {{file:glbAr}}. El teléfono descarga el archivo completo antes de mostrarlo, así que con wifi o buena cobertura tarda unos segundos. {{brand}} optimiza cada modelo para que pese lo menos posible.',
      },
      {
        q: '¿Cuánto cuesta la realidad aumentada?',
        a: 'La realidad aumentada no tiene precio aparte: va incluida en la maqueta 3D completa de {{brand}}, desde {{price:maqueta}} + IVA por vivienda, junto con 6 renders en 4K y el visor web, y se entrega en {{delivery:maqueta}}. En promociones de obra nueva, el pack desde {{price:promocion}} + IVA incluye realidad aumentada para cada tipología.',
      },
      {
        q: '¿Cuáles son los 4 tipos principales de realidad aumentada?',
        a: 'Se suelen citar cuatro: con marcadores (la cámara reconoce una imagen impresa), sin marcadores (el móvil detecta el suelo o la mesa), por proyección y por superposición sobre un objeto real. La que usa {{brand}} es sin marcadores: el comprador apunta a la mesa o al suelo y la vivienda aparece, sin imprimir nada ni instalar ninguna app.',
      },
      {
        q: '¿Puedo enviar la realidad aumentada por WhatsApp?',
        a: 'Sí. Envías el enlace de la vivienda y el comprador toca «Ver en tu salón». Si WhatsApp lo abre en su navegador interno y la realidad aumentada no arranca, basta con abrirlo en Safari o Chrome. El mismo enlace de {{brand}} sirve para crear un código QR para folletos, carteles o la mesa de la oficina de ventas.',
      },
      {
        q: '¿Sirve para vender obra nueva sobre plano?',
        a: 'Sí. {{brand}} modela cada tipología desde los planos del proyecto, antes de que exista nada construido, y el comprador la ve sobre la mesa de la oficina de ventas o en su casa. El pack de promoción incluye 3 tipologías con renders, visor con selector y realidad aumentada, desde {{price:promocion}} + IVA en {{delivery:promocion}}.',
      },
    ],
    related: ['servicio-tour', 'sol-promotoras', 'caso-villa', 'guia-ar', 'precios'],
    cta: {
      h2: '¿Quieres ver tu vivienda sobre la mesa?',
      body: 'Envíanos el plano: modelamos gratis una estancia y te la mandamos en realidad aumentada para que la abras en tu móvil. Sin compromiso y con respuesta de una persona.',
    },
  },

  en: {
    title: 'AR property viewing on iPhone and Android, no app',
    description: 'Buyers place the home on their table at 1:20 or at real size from an iPhone or Android phone, with nothing to install. From {{price:maqueta}} + VAT.',
    h1: 'Augmented reality for real estate, with no app',
    lead: 'Buyers place the home on their table as a 1:20 model, or at real size on the floor, from their iPhone, iPad or Android phone, with no app to install. We build it from the 2D floor plan, and it comes with the complete 3D model, from {{price:maqueta}} + VAT in {{delivery:maqueta}}.',
    breadcrumb: 'Augmented reality',
    card: {
      title: 'App-free augmented reality',
      summary: 'The home on the table at 1:20 or at real size, from the buyer’s own phone, with nothing to install.',
    },
    hero: {
      image: 'villa_terraza',
      alt: 'Main terrace of the villa with a terracotta floor, sun loungers, an outdoor sofa and a potted olive tree. 3D render generated from the 2D floor plan.',
      caption: 'Main terrace. 3D render generated from the 2D floor plan.',
    },
    facts: [
      ['Input', '2D floor plan, no photos'],
      ['Devices', 'iPhone and iPad with Safari; ARCore-compatible Android'],
      ['No app', 'AR Quick Look on Apple, Scene Viewer on Android'],
      ['Modes', '1:20 tabletop model and real size'],
      ['Formats', 'USDZ and GLB'],
      ['On a computer', 'QR code to open it on a phone'],
      ['Price from', '{{price:maqueta}} + VAT, with the complete model'],
      ['Turnaround', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What is AR in real estate?',
        answer: 'Augmented reality places a 3D model of a home into the live camera view of a phone, anchored to a table or the floor. Buyers tap “View in your room” and the property appears as a 1:20 model they can walk around and zoom into. The real-size version lets them pace out the living room or terrace at home.',
        body: 'It is the same home as the [interactive 3D floor plan](@servicio-tour) and the renders: one model, three ways to see it, and no mismatches between them.',
      },
      {
        type: 'ar',
        h2: 'Try it now with our demo villa',
        intro: 'On a phone, tap the button. On a computer, scan the QR code with your phone’s camera: augmented reality only works on phones and tablets.',
      },
      {
        type: 'answer',
        h2: 'Do buyers need to install an app?',
        answer: 'No. We use the viewers already built into phones: [AR Quick Look](@glosario#ar-quick-look) on iPhone and iPad, which opens [USDZ](@glosario#usdz) files from Safari, and [Scene Viewer](@glosario#scene-viewer) on Android, which opens [GLB](@glosario#glb) files on ARCore-compatible phones. Buyers tap a button and the home appears, with no download and no sign-up.',
        body: 'Apple documents it on its [AR Quick Look](' + APPLE + ') page and Google on its [Scene Viewer](' + SCENE + ') page. Apple devices need iOS or iPadOS 12 or later; Android phones need version 7.0 or later with Google Play Services for AR.',
      },
      {
        type: 'formats',
        h2: 'Does it work on iPhone and Android?',
        intro: 'Yes, and each system gets its own format. These are the actual files of the demo villa and their sizes.',
      },
      {
        type: 'table',
        h2: 'Tabletop model or real size?',
        intro: 'We deliver both versions of every home, because they do different jobs.',
        caption: 'Two ways to view a home in augmented reality',
        head: ['Mode', 'Scale', 'What it is for'],
        rows: [
          ['Tabletop model', '1:20', 'Grasping the layout at a glance, in a sales suite, at a property fair or at the buyer’s kitchen table'],
          ['Real size', '1:1', 'Walking through the living room or terrace on the floor to get a feel for the space'],
        ],
        note: 'At real size the villa’s floor plate covers about {{villa:footprint}}: a normal living room fits one or two rooms; a garden or an empty plot fits the whole home.',
      },
      {
        type: 'answer',
        h2: 'How is augmented reality used in property marketing?',
        answer: 'To show a home that does not exist yet or is far away. Developers put unit types on the table in the sales suite and at property fairs; agents send a link over WhatsApp to buyers in the UK, the Netherlands or Germany, who open the home on their own phone before deciding whether to fly out for a viewing.',
        body: 'Those buyers matter: in Q2 2026, British (6.99%), Dutch (6.94%) and German (6.11%) buyers led foreign home purchases in Spain, according to the Land Registry’s [Estadística Registral Inmobiliaria](' + ERI + ').\n\nFor developers it is a light alternative to a show flat: every unit type fits on a table. More in [off-plan 3D visualisation](@sol-promotoras). For a step-by-step you can send a client, see [how to view a property in AR](@guia-ar).',
      },
      {
        type: 'stat',
        value: '15.98%',
        label: 'of home purchases in Spain in Q2 2026 were by foreign buyers, just over 26,800 sales and the highest share on record',
        source: { label: 'Colegio de Registradores (Spanish Land Registry), Estadística Registral Inmobiliaria', url: ERI },
        year: 'Q2 2026',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Where it does not work, so nobody is caught out',
        body: '- Computers cannot show augmented reality: we display a QR code to open it on a phone.\n- Android needs an ARCore-compatible phone; on others, buyers can still explore the home in the 3D viewer.\n- If the link opens inside another app, such as Instagram or WhatsApp, the AR button may not launch: opening it in Safari or Chrome fixes that.\n- If the plan has no dimensions, real-size measurements are approximate (≈).',
      },
      {
        type: 'process',
        variant: 'list',
        h2: 'How do you prepare a home for augmented reality?',
        intro: 'AR comes from the same model as the renders and the viewer. At delivery you receive the USDZ and GLB files and the viewer with the AR buttons already built in.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'How much does augmented reality cost per home?',
        intro: 'There is no separate price: AR is included in the complete 3D model and in the development package, together with the renders and the viewer. Prices exclude VAT.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'Can I use AR at a property fair or in a sales suite?',
        a: 'Yes, and that is where it shines. With the 1:20 tabletop model, any table becomes a display stand: your sales team opens the home on a tablet or on the client’s own phone and they walk around it together, with no headset or special kit. {{brand}} includes AR with the complete 3D model, from {{price:maqueta}} + VAT, and for every unit type in the development package.',
      },
      {
        q: 'Which phones and tablets support AR viewing?',
        a: 'iPhones and iPads on iOS or iPadOS 12 or later, using Safari, and Android phones on version 7.0 or later that support ARCore; Google publishes the [list of supported devices](' + DEVICES + '). On a computer, {{brand}} shows a QR code so buyers can open the home on their phone.',
      },
      {
        q: 'Can buyers walk through the home at real size?',
        a: 'Yes. Alongside the 1:20 tabletop model, {{brand}} delivers a real-size version that sits on the floor, so buyers can walk through the living room or terrace and judge the space. They need room to move: our demo villa’s floor plate is about {{villa:footprint}}. When the plan has no dimensions, measurements are approximate.',
      },
      {
        q: 'How big are the AR files, and how long do they take to open on mobile data?',
        a: 'For our demo villa, the iPhone tabletop model is {{file:usdzMesa}} and the Android one {{file:glbArMesa}}; the real-size versions are {{file:usdzReal}} and {{file:glbAr}}. Phones download the whole file before showing it, so on Wi-Fi or good 4G or 5G it takes a few seconds. {{brand}} optimises every model to keep it as light as possible.',
      },
      {
        q: 'Can you see a house before it’s built in AR?',
        a: 'Yes, that is where AR is most useful. {{brand}} models each unit type from the architect’s plans before anything is built, and buyers see it on the sales-suite table or at home. The development package covers 3 unit types with renders, a viewer with a unit selector and AR, from {{price:promocion}} + VAT in {{delivery:promocion}}.',
      },
      {
        q: 'What are the four types of augmented reality?',
        a: 'Four are commonly listed: marker-based (the camera recognises a printed image), markerless (the phone detects the floor or a table), projection-based and superimposition onto a real object. {{brand}} uses markerless AR: buyers point their phone at a table or the floor and the home appears, with nothing to print and no app to install.',
      },
      {
        q: 'How is AR different from AI?',
        a: 'They solve different problems. Augmented reality displays a real 3D model in your surroundings; generative AI creates new images or text from a prompt. The AR home {{brand}} delivers is not generated on the fly: it is the same to-scale model as the renders and viewer, built from your floor plan, so what buyers see on the table matches the plan.',
      },
      {
        q: 'How much does augmented reality cost?',
        a: 'There is no separate AR price: augmented reality is included in the {{brand}} complete 3D model, from {{price:maqueta}} + VAT per home, together with 6 renders in 4K and the web viewer, delivered in {{delivery:maqueta}}. For off-plan developments, the package from {{price:promocion}} + VAT includes AR for every unit type.',
      },
    ],
    related: ['servicio-tour', 'sol-promotoras', 'caso-villa', 'guia-ar', 'precios'],
    cta: {
      h2: 'Want to see your home on the table?',
      body: 'Send us the floor plan: we will model one room for free and send it to you in augmented reality, ready to open on your phone. No obligation, and a real person replies.',
    },
  },
};
