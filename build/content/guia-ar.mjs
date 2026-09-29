// Guide (ES + EN): how to view a home in augmented reality on iPhone/iPad and Android, for buyers and agents.
// ES: 02-keywords-es.md C5 satellite «ver una vivienda en realidad aumentada», «casa en realidad aumentada iPhone/Android»
// (anti-cannibalisation §4.3: «cómo ver una casa en AR en iPhone» belongs here, not to servicio-ar).
// EN: 03-keywords-en.md C6 «view house in augmented reality», «ar quick look property», FAQ bank 15-17.
// Verified 2026-09-28:
//  - Apple AR Quick Look page: USDZ in Safari, Messages, Mail…; requires iOS 12 / iPadOS 12 or later.
//  - Google Scene Viewer page: ARCore device with Android 7.0+, recent Google app and Google Play Services for AR;
//    falls back to a 3D view when ARCore is not available; resizable=false locks scale in AR.
//  - Google ARCore devices page: device shipped with Google Play Store, Android 7.0+ unless the table says otherwise.
//  - WebKit blog 8421: rel="ar" link needs a single img/picture child; Safari jumps straight into the 3D/AR view;
//    AR integration available in SFSafariViewController clients (in-app browsers may not support it).
// Technical facts from docs/research/06-3d-ar-pipeline.md and build/data/villa.mjs (file sizes via tokens).
// 1:20 footprint of the demo villa: 9.1 × 14.1 m / 20 ≈ 46 × 70 cm. The /ar/villa/ page is noindex: never linked.

const APPLE = 'https://developer.apple.com/augmented-reality/quick-look/';
const SCENE = 'https://developers.google.com/ar/develop/scene-viewer';
const DEVICES = 'https://developers.google.com/ar/devices';
const WEBKIT = 'https://webkit.org/blog/8421/viewing-augmented-reality-assets-in-safari-for-ios/';

import { plate } from '../data/plates.mjs';

export default {
  id: 'guia-ar',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Ver una casa en realidad aumentada: iPhone y Android',
    description: 'Paso a paso para ver una vivienda en realidad aumentada en iPhone, iPad o Android sin instalar nada: requisitos, maqueta 1:20, tamaño real y soluciones.',
    h1: 'Cómo ver una vivienda en realidad aumentada, paso a paso',
    lead: 'Para ver una vivienda en realidad aumentada basta un iPhone o iPad con iOS 12 o posterior, o un Android compatible con ARCore: tocas el botón, apuntas a la mesa o al suelo y aparece, sin instalar nada. Aquí tienes los pasos y qué hacer si falla. {{brand}} la incluye en cada maqueta 3D, desde {{price:maqueta}} + IVA.',
    breadcrumb: 'Ver en realidad aumentada',
    card: {
      title: 'Cómo ver una vivienda en realidad aumentada',
      summary: 'Pasos en iPhone y Android, requisitos, maqueta 1:20 o tamaño real, problemas frecuentes y cómo compartirla.',
    },
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Maqueta 3D de la planta alta de la villa, seccionada a 1,15 m y amueblada, en vista de tres cuartos. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'La maqueta que aparece sobre la mesa a escala 1:20, con los muros cortados. Render, no captura de pantalla.',
    },
    facts: [
      ['iPhone y iPad', 'iOS o iPadOS 12 o posterior, con Safari'],
      ['Android', '7.0 o posterior y compatible con ARCore'],
      ['App que instalar', 'Ninguna: AR Quick Look y Scene Viewer'],
      ['Modos', 'Maqueta 1:20 sobre la mesa y tamaño real'],
      ['Mesa para la maqueta', 'Unos 46 × 70 cm en la villa de demostración'],
      ['Descarga de la demo', '{{file:usdzMesa}} en iPhone; {{file:glbArMesa}} en Android'],
      ['En ordenador', 'Código QR para abrirla en el móvil'],
      ['Requisitos revisados', '28 de septiembre de 2026'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué hace falta para ver una casa en realidad aumentada?',
        answer: 'Un móvil o una tableta compatible y el enlace de la vivienda. En iPhone y iPad, iOS o iPadOS 12 o posterior y Safari. En Android, la versión 7.0 o posterior en un móvil compatible con ARCore. No hay que instalar ninguna app: la realidad aumentada se abre con los visores de Apple y de Google.',
        body: 'En Apple, el visor es [AR Quick Look](@glosario#ar-quick-look), que abre archivos [USDZ](@glosario#usdz) desde Safari, según la [documentación de Apple](' + APPLE + '). En Android es [Scene Viewer](@glosario#scene-viewer), de Google, que abre archivos [GLB](@glosario#glb); pide además una versión reciente de la app de Google y de los Servicios de Google Play para RA, como explica su [página de Scene Viewer](' + SCENE + ').\n\nGoogle publica la lista de [dispositivos compatibles con ARCore](' + DEVICES + '). Como regla general, el móvil tiene que haber salido de fábrica con Google Play Store y tener Android 7.0 o posterior, salvo que la lista indique otra versión.',
      },
      {
        type: 'ar',
        h2: 'Pruébalo en tu mesa con la villa de demostración',
        intro: 'En el móvil, toca el botón. En el ordenador, escanea el código QR con la cámara del teléfono. Es la planta alta de una villa en la Costa del Sol modelada desde un único plano; en el [caso completo](@caso-villa) tienes además el visor 3D y los renders.',
      },
      {
        type: 'steps',
        h2: '¿Cómo se ve en un iPhone o un iPad?',
        intro: 'Con la villa de demostración o con el enlace que te haya enviado tu agencia.',
        items: [
          { title: 'Abre el enlace en Safari', body: 'Si te llegó por WhatsApp, Instagram o LinkedIn, ábrelo en Safari desde el menú de compartir: el navegador interno de algunas apps no lanza la realidad aumentada.' },
          { title: 'Toca «Ver en tu salón» y elige el modo', body: '«Maqueta 1:20 sobre la mesa» para ver la distribución entera, o «Tamaño real» para recorrer las estancias a su escala.' },
          { title: 'Espera a que termine la descarga', body: 'El iPhone descarga el archivo completo antes de mostrar nada: {{file:usdzMesa}} la maqueta de la demo y {{file:usdzReal}} el tamaño real.' },
          { title: 'Apunta a la mesa o al suelo', body: 'Mueve el iPhone despacio hasta que detecte la superficie. La vivienda se coloca sola sobre ella.' },
          { title: 'Muévete alrededor', body: 'Acércate a cada estancia. Arrastra con un dedo para desplazarla y gira con dos. En la maqueta puedes pellizcar para cambiar el tamaño; a tamaño real la escala está fija al 100 %.' },
          { title: 'Cambia a «Objeto» si no hay sitio', body: 'Arriba tienes «AR» y «Objeto»: la segunda muestra la vivienda en 3D sin la cámara. Para salir, toca la cruz.' },
        ],
      },
      {
        type: 'steps',
        h2: '¿Y en un móvil Android?',
        intro: 'El proceso es casi igual; cambia el visor, que en Android es el de Google.',
        items: [
          { title: 'Abre el enlace en Chrome', body: 'Si lo abriste dentro de otra app, pásalo a Chrome desde el menú de esa app.' },
          { title: 'Toca el botón y acepta los permisos', body: 'Se abre Scene Viewer. La primera vez puede pedirte acceso a la cámara, o que instales o actualices los Servicios de Google Play para RA desde Google Play: es el componente de Google que hace funcionar la realidad aumentada.' },
          { title: 'Apunta al suelo o a la mesa', body: 'Mueve el móvil despacio hasta que detecte la superficie y aparezca la vivienda. La maqueta de la demo pesa {{file:glbArMesa}} y el tamaño real, {{file:glbAr}}.' },
          { title: 'Explórala', body: 'Arrastra para moverla y gira con dos dedos. La maqueta se puede ampliar; a tamaño real la escala está bloqueada, como en el iPhone.' },
          { title: 'Si tu móvil no es compatible', body: 'Scene Viewer muestra la vivienda en 3D en la pantalla, sin cámara. Puedes seguir explorándola así o volver al visor 3D de la página.' },
        ],
      },
      {
        type: 'table',
        h2: '¿Qué ves en cada modo: maqueta 1:20 o tamaño real?',
        intro: 'La misma vivienda en dos escalas. A 1:20, cada metro real ocupa 5 cm sobre la mesa.',
        caption: 'Los dos modos de realidad aumentada de la villa de demostración',
        head: ['Aspecto', 'Maqueta 1:20', 'Tamaño real 1:1'],
        rows: [
          ['Dónde ponerla', 'Una mesa, una encimera o el suelo', 'Un suelo despejado: salón, terraza, jardín o el propio solar'],
          ['Qué ves', 'Toda la planta desde arriba, con los muros cortados a {{villa:cutHeight}} m', 'Las estancias a su tamaño, a tu alrededor'],
          ['Espacio necesario', 'Unos 46 × 70 cm', '{{villa:footprint}} para la planta entera'],
          ['Escala', 'Se puede ampliar o reducir', 'Fija al 100 %'],
          ['Para qué sirve', 'Entender la distribución y enseñarla a varias personas a la vez', 'Juzgar la amplitud: si cabe el sofá o si el pasillo es ancho'],
          ['Archivo en iPhone', '{{file:usdzMesa}}', '{{file:usdzReal}}'],
          ['Archivo en Android', '{{file:glbArMesa}}', '{{file:glbAr}}'],
        ],
        note: 'Si el plano no traía cotas, las medidas a tamaño real son aproximadas (≈), como en nuestra villa de demostración.',
      },
      {
        type: 'formats',
        h2: '¿Qué archivo abre cada dispositivo?',
        intro: 'Cada sistema recibe su formato. Son los archivos reales de la demo y lo que pesan.',
      },
      {
        type: 'table',
        h2: '¿Por qué no se abre la realidad aumentada?',
        intro: 'Los fallos más habituales y cómo resolverlos en el momento, con el cliente delante.',
        caption: 'Problemas frecuentes al ver una vivienda en realidad aumentada',
        head: ['Qué pasa', 'Por qué', 'Qué hacer'],
        rows: [
          ['No aparece el botón en el ordenador', 'Los navegadores de escritorio no abren estos visores', 'Escanea el código QR con el móvil'],
          ['El botón no hace nada dentro de WhatsApp, Instagram o LinkedIn', 'El navegador interno de algunas apps no lanza la realidad aumentada', 'Abre el enlace en Safari o en Chrome'],
          ['En el iPhone se abre el archivo o una página en blanco', 'El enlace no se ha abierto en Safari', 'Cópialo y ábrelo en Safari'],
          ['En Android se ve en 3D, pero sin cámara', 'El móvil no es compatible con ARCore', 'Consulta la lista de Google; mientras, explórala en 3D'],
          ['Android pide instalar los Servicios de Google Play para RA', 'Scene Viewer los necesita', 'Acepta: se instalan desde Google Play'],
          ['La vivienda no se coloca o se mueve sola', 'Poca luz, una superficie lisa y brillante o movimientos rápidos', 'Más luz, una superficie con textura y movimientos lentos'],
          ['Tarda mucho en abrir', 'El móvil descarga el archivo entero antes de mostrarlo', 'Usa wifi y empieza por la maqueta, que pesa menos'],
          ['A tamaño real no cabe', 'La planta de la villa mide {{villa:footprint}}', 'Sal a una terraza o un jardín, o usa la maqueta'],
        ],
        note: 'Según el [equipo de WebKit](' + WEBKIT + '), la realidad aumentada de Safari también funciona en las apps que abren enlaces con la vista de Safari; otros navegadores internos pueden no admitirla.',
      },
      {
        type: 'prose',
        h2: '¿Cómo comparte un agente la realidad aumentada: enlace, QR o WhatsApp?',
        body: 'Con un enlace a la página de la vivienda, nunca con el archivo suelto. La página detecta si el cliente la abre en iPhone, Android u ordenador y le enseña el botón correcto; el archivo suelto no se abre igual en todos los móviles y no le deja al comprador un camino para contactarte.\n\n- **WhatsApp o email:** envía el enlace con una línea de instrucciones, por ejemplo: «Te paso la vivienda en 3D. Ábrela en Safari o Chrome, toca “Ver en tu salón” y apunta a la mesa».\n- **Código QR:** en el cartel de «Se vende», el escaparate, el folleto de la promoción o la mesa de la sala de ventas, siempre apuntando a la página.\n- **Tu web:** el visor 3D con el botón de realidad aumentada, incrustado con un iframe.\n- **Portales:** usa el enlace donde el portal lo admita. No prometemos incrustar el visor dentro del anuncio: idealista, por ejemplo, solo acepta tours de sus proveedores compatibles.\n\n{{brand}} entrega el enlace, el código para incrustar el visor y los archivos de realidad aumentada con cada [maqueta 3D completa](@precios). Lo que incluye el servicio, en [realidad aumentada inmobiliaria](@servicio-ar).',
      },
      {
        type: 'checklist',
        h2: '¿Cómo se enseña en una visita o en la sala de ventas?',
        intro: 'Cinco minutos de preparación evitan el «no me carga» delante del cliente.',
        items: [
          'Pruébala en tu móvil antes de la cita, con el mismo enlace que vas a usar.',
          'Conéctate a una wifi o comprueba la cobertura: el archivo se descarga entero.',
          'Busca una mesa despejada y bien iluminada, que no sea de cristal ni de lacado brillante.',
          'Empieza por la maqueta 1:20 para explicar la distribución; pasa a tamaño real en una terraza o un espacio amplio.',
          'Deja que sea el comprador quien sostenga el móvil y camine alrededor.',
          'Al terminar, envíale el enlace por WhatsApp para que la enseñe en casa.',
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Lo que la realidad aumentada no sustituye',
        body: '- La visita: la realidad aumentada enseña distribución y escala, no el estado real de una vivienda construida.\n- Las medidas oficiales: si el plano no trae cotas, las medidas son aproximadas (≈).\n- El ordenador: en escritorio solo verás el código QR o el visor 3D.\n- Los móviles Android no compatibles con ARCore: verán la vivienda en 3D, sin cámara.',
      },
      plate('es', 'villa_interior_salon'),
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'Apple Developer: AR Quick Look', url: APPLE, note: 'Requisitos: iOS o iPadOS 12 o posterior.' },
          { label: 'Google for Developers: Scene Viewer', url: SCENE, note: 'Requisitos, formatos y modo 3D sin ARCore.' },
          { label: 'Google for Developers: dispositivos compatibles con ARCore', url: DEVICES, note: 'Lista actualizada por Google.' },
          { label: 'WebKit: realidad aumentada en Safari para iOS', url: WEBKIT, note: 'Cómo abre Safari los enlaces de AR.' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Necesito descargar alguna app para ver la vivienda en realidad aumentada?',
        a: 'No. En iPhone y iPad, la realidad aumentada se abre con AR Quick Look desde Safari; en Android, con Scene Viewer de Google. Lo único que Android puede pedirte la primera vez es instalar o actualizar los Servicios de Google Play para RA, el componente de Google que la hace funcionar. {{brand}} entrega cada vivienda lista para abrirse con un toque.',
      },
      {
        q: '¿Qué iPhone necesito para ver una casa en realidad aumentada?',
        a: 'Según Apple, AR Quick Look funciona en iPhone y iPad con iOS o iPadOS 12 o posterior. Ábrelo en Safari, porque el navegador interno de algunas apps no lanza la realidad aumentada. La maqueta de la villa de demostración de {{brand}} pesa {{file:usdzMesa}}, así que conviene tener wifi o buena cobertura antes de tocar el botón.',
      },
      {
        q: '¿Cómo sé si mi Android es compatible con ARCore?',
        a: 'Google publica la lista de dispositivos compatibles con ARCore. En general, el móvil debe haber salido de fábrica con Google Play Store y tener Android 7.0 o posterior, salvo que la lista indique otra versión. Si no es compatible, Scene Viewer muestra la vivienda en 3D, sin cámara. {{brand}} prepara un archivo específico para Android en cada entrega.',
      },
      {
        q: '¿Por qué no se abre la realidad aumentada desde WhatsApp?',
        a: 'Porque WhatsApp, Instagram y otras apps abren los enlaces en su propio navegador interno, que puede no lanzar la realidad aumentada. La solución es abrir el mismo enlace en Safari, en iPhone, o en Chrome, en Android. En las viviendas que entrega {{brand}}, la página muestra ese aviso para que el comprador no se quede atascado.',
      },
      {
        q: '¿Se puede ver una casa en realidad aumentada desde el ordenador?',
        a: 'No: los navegadores de escritorio no abren los visores de realidad aumentada de Apple y Google. En el ordenador, la página de la vivienda muestra un código QR; lo escaneas con la cámara del móvil y la realidad aumentada se abre en el teléfono. Mientras, en la pantalla grande puedes recorrer la vivienda en el visor 3D de {{brand}}.',
      },
      {
        q: '¿Cuánto espacio necesito para ver la vivienda a tamaño real?',
        a: 'El que ocupe la vivienda. La planta alta de nuestra villa de demostración mide {{villa:footprint}}, así que en un salón normal caben una o dos estancias y en un jardín o una terraza grande, bastante más. La maqueta a escala 1:20 cabe en unos 46 × 70 cm de mesa. {{brand}} entrega los dos modos con cada vivienda.',
      },
      {
        q: '¿Cuántos datos móviles gasta la realidad aumentada?',
        a: 'Lo que pese el archivo, que el móvil descarga entero antes de mostrarlo. En la villa de demostración de {{brand}}, la maqueta pesa {{file:usdzMesa}} en iPhone y {{file:glbArMesa}} en Android; el tamaño real, {{file:usdzReal}} y {{file:glbAr}}. Con wifi o buena cobertura tarda unos segundos; si vas justo de datos, empieza por la maqueta.',
      },
      {
        q: '¿Cómo mando la realidad aumentada a un cliente?',
        a: 'Con el enlace de la página de la vivienda, por WhatsApp o por email, y con un código QR en carteles y folletos. No envíes el archivo suelto: la página elige el formato correcto para iPhone o Android. {{brand}} incluye el enlace, el visor y la realidad aumentada en la maqueta 3D completa, desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
      },
    ],
    related: ['servicio-ar', 'caso-villa', 'servicio-tour', 'guia-matterport', 'sol-inmobiliarias'],
    cta: {
      h2: '¿Quieres ver tu vivienda en realidad aumentada?',
      body: 'Envíanos el plano: modelamos gratis una estancia y te mandamos el enlace para abrirla en tu móvil, sobre la mesa o a tamaño real. Sin compromiso.',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'How to view a property in AR on iPhone and Android',
    description: 'Step by step: view a home in augmented reality on iPhone, iPad or Android with nothing to install. Requirements, 1:20 tabletop or real size, and quick fixes.',
    h1: 'How to view a property in augmented reality, step by step',
    lead: 'To view a home in augmented reality you need an iPhone or iPad on iOS 12 or later, or an ARCore-compatible Android phone: tap the button, point at a table or the floor and the property appears, with nothing to install. Here are the steps and the fixes. {{brand}} includes AR with every 3D model, from {{price:maqueta}} + VAT.',
    breadcrumb: 'View a property in AR',
    card: {
      title: 'How to view a property in augmented reality',
      summary: 'Steps for iPhone and Android, requirements, 1:20 tabletop or real size, common problems and how to share it.',
    },
    hero: {
      image: 'villa_maqueta_iso',
      alt: 'Furnished 3D model of the villa’s upper floor, cut away at 1.15 m, three-quarter view. 3D render generated from the 2D floor plan of an anonymised case.',
      caption: 'The model that appears on the table at 1:20, with its walls cut away. A render, not a screenshot.',
    },
    facts: [
      ['iPhone and iPad', 'iOS or iPadOS 12 or later, in Safari'],
      ['Android', '7.0 or later, ARCore-compatible'],
      ['App to install', 'None: AR Quick Look and Scene Viewer'],
      ['Modes', '1:20 tabletop model and real size'],
      ['Table space', 'About 46 × 70 cm for the demo villa'],
      ['Demo download', '{{file:usdzMesa}} on iPhone; {{file:glbArMesa}} on Android'],
      ['On a computer', 'QR code to open it on a phone'],
      ['Requirements checked', '28 September 2026'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What do you need to view a property in AR?',
        answer: 'A compatible phone or tablet and the link to the property. On iPhone and iPad, iOS or iPadOS 12 or later and Safari. On Android, version 7.0 or later on an ARCore-compatible phone. There is no app to install: augmented reality opens in viewers Apple and Google already provide.',
        body: 'On Apple devices the viewer is [AR Quick Look](@glosario#ar-quick-look), which opens [USDZ](@glosario#usdz) files from Safari, according to [Apple’s documentation](' + APPLE + '). On Android it is Google’s [Scene Viewer](@glosario#scene-viewer), which opens [GLB](@glosario#glb) files; it also needs recent versions of the Google app and Google Play Services for AR, as its [Scene Viewer page](' + SCENE + ') explains.\n\nGoogle keeps the list of [ARCore-supported devices](' + DEVICES + '). As a rule, the phone must have shipped with the Google Play Store and run Android 7.0 or later, unless the list gives a different minimum.',
      },
      {
        type: 'ar',
        h2: 'Try it on your table with our demo villa',
        intro: 'On a phone, tap the button. On a computer, scan the QR code with your phone’s camera. It is the upper floor of a Costa del Sol villa modelled from a single floor plan; the [full case study](@caso-villa) adds the 3D viewer and the renders.',
      },
      {
        type: 'steps',
        h2: 'How do you view it on an iPhone or iPad?',
        intro: 'With our demo villa, or with the link your estate agent sent you.',
        items: [
          { title: 'Open the link in Safari', body: 'If it arrived by WhatsApp, Instagram or LinkedIn, open it in Safari from the share menu: some apps’ built-in browsers won’t launch augmented reality.' },
          { title: 'Tap “View in your room” and pick a mode', body: '“1:20 model on your table” shows the whole layout; “Real size” lets you walk through the rooms at their true scale.' },
          { title: 'Let the download finish', body: 'The iPhone downloads the whole file before showing anything: {{file:usdzMesa}} for the demo tabletop model and {{file:usdzReal}} for real size.' },
          { title: 'Point at the table or the floor', body: 'Move the iPhone slowly until it detects the surface. The home settles onto it by itself.' },
          { title: 'Walk around it', body: 'Lean in to each room. Drag with one finger to move it and twist with two to rotate. On the tabletop model you can pinch to resize; at real size the scale is fixed at 100%.' },
          { title: 'Switch to “Object” if space is tight', body: 'At the top you’ll see “AR” and “Object”: the second shows the home in 3D without the camera. Tap the cross to close.' },
        ],
      },
      {
        type: 'steps',
        h2: 'And on an Android phone?',
        intro: 'Almost the same; only the viewer changes, as Android uses Google’s.',
        items: [
          { title: 'Open the link in Chrome', body: 'If it opened inside another app, move it to Chrome from that app’s menu.' },
          { title: 'Tap the button and accept the prompts', body: 'Scene Viewer opens. The first time, it may ask for camera access, or ask you to install or update Google Play Services for AR from Google Play: that is the Google component that runs augmented reality.' },
          { title: 'Point at the floor or a table', body: 'Move the phone slowly until it finds the surface and the home appears. The demo tabletop model is {{file:glbArMesa}} and the real-size one {{file:glbAr}}.' },
          { title: 'Explore it', body: 'Drag to move it and twist with two fingers to rotate. The tabletop model can be resized; at real size the scale is locked, as on iPhone.' },
          { title: 'If your phone isn’t compatible', body: 'Scene Viewer shows the home in 3D on screen, without the camera. You can keep exploring it that way or go back to the 3D viewer on the page.' },
        ],
      },
      {
        type: 'table',
        h2: 'What do you see in each mode: 1:20 tabletop or real size?',
        intro: 'The same home at two scales. At 1:20, every real metre takes up 5 cm on the table.',
        caption: 'The two augmented reality modes of the demo villa',
        head: ['Aspect', '1:20 tabletop model', 'Real size 1:1'],
        rows: [
          ['Where to place it', 'A table, a kitchen worktop or the floor', 'Clear floor space: a living room, terrace, garden or the plot itself'],
          ['What you see', 'The whole floor from above, walls cut at {{villa:cutHeight}} m', 'The rooms at their true size, all around you'],
          ['Space needed', 'About 46 × 70 cm', '{{villa:footprint}} for the whole floor'],
          ['Scale', 'Can be enlarged or reduced', 'Fixed at 100%'],
          ['What it is for', 'Grasping the layout and showing it to several people at once', 'Judging the space: will the sofa fit, is the hallway wide enough'],
          ['iPhone file', '{{file:usdzMesa}}', '{{file:usdzReal}}'],
          ['Android file', '{{file:glbArMesa}}', '{{file:glbAr}}'],
        ],
        note: 'If the floor plan had no dimensions, real-size measurements are approximate (≈), as they are for our demo villa.',
      },
      {
        type: 'formats',
        h2: 'Which file does each device open?',
        intro: 'Each system gets its own format. These are the actual demo files and their sizes.',
      },
      {
        type: 'table',
        h2: 'Why won’t augmented reality open?',
        intro: 'The most common problems, and how to fix them on the spot with the buyer watching.',
        caption: 'Common problems when viewing a property in augmented reality',
        head: ['What happens', 'Why', 'What to do'],
        rows: [
          ['No AR button on the computer', 'Desktop browsers don’t open these viewers', 'Scan the QR code with a phone'],
          ['The button does nothing inside WhatsApp, Instagram or LinkedIn', 'Some apps’ built-in browsers don’t launch AR', 'Open the link in Safari or Chrome'],
          ['On iPhone the file downloads or a blank page opens', 'The link didn’t open in Safari', 'Copy it and open it in Safari'],
          ['On Android it shows in 3D but without the camera', 'The phone doesn’t support ARCore', 'Check Google’s list; meanwhile, explore it in 3D'],
          ['Android asks to install Google Play Services for AR', 'Scene Viewer needs it', 'Accept: it installs from Google Play'],
          ['The home won’t settle, or drifts', 'Low light, a plain glossy surface or fast movements', 'More light, a textured surface and slow movements'],
          ['It takes a long time to open', 'The phone downloads the whole file first', 'Use Wi-Fi and start with the tabletop model, which is smaller'],
          ['Real size doesn’t fit', 'The villa’s floor plate measures {{villa:footprint}}', 'Step onto a terrace or into the garden, or use the tabletop model'],
        ],
        note: 'According to the [WebKit team](' + WEBKIT + '), Safari’s augmented reality also works in apps that open links in Safari’s own view; other in-app browsers may not support it.',
      },
      {
        type: 'prose',
        h2: 'How do agents share AR: a link, a QR code or WhatsApp?',
        body: 'With a link to the property page, never the bare file. The page detects whether the buyer is on an iPhone, an Android phone or a computer and shows the right button; a bare file doesn’t open the same way on every phone and leaves the buyer no route back to you.\n\n- **WhatsApp or email:** send the link with one line of instructions, for example: “Here’s the home in 3D. Open it in Safari or Chrome, tap ‘View in your room’ and point at a table.”\n- **QR code:** on the for-sale board, in the office window, on the development brochure or on the sales-suite table, always pointing to the page.\n- **Your website:** the 3D viewer with its AR button, embedded with an iframe.\n- **Portals:** use the link wherever the portal allows one. We don’t promise the viewer embedded inside a portal listing: idealista, for instance, only accepts tours from its approved providers.\n\nFor a buyer in Manchester or Rotterdam, that WhatsApp link is often the first time they see the layout at scale. {{brand}} delivers the link, the embed code and the AR files with every [complete 3D model](@precios); the service itself is described in [augmented reality for real estate](@servicio-ar).',
      },
      {
        type: 'checklist',
        h2: 'How do you demo it at a viewing or in a sales suite?',
        intro: 'Five minutes of preparation save you from “it won’t load” in front of the client.',
        items: [
          'Test it on your phone before the meeting, with the exact link you will use.',
          'Get on Wi-Fi or check your signal: the file downloads in full.',
          'Find a clear, well-lit table that isn’t glass or high-gloss lacquer.',
          'Start with the 1:20 model to explain the layout; switch to real size on a terrace or in a large room.',
          'Let the buyer hold the phone and walk around the model.',
          'Afterwards, send them the link on WhatsApp so they can show it at home.',
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'What augmented reality doesn’t replace',
        body: '- A viewing: AR shows layout and scale, not the real condition of a finished home.\n- Official measurements: if the plan has no dimensions, measurements are approximate (≈).\n- A computer: on desktop you only get the QR code or the 3D viewer.\n- Android phones without ARCore support: they show the home in 3D, without the camera.',
      },
      plate('en', 'villa_interior_salon'),
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'Apple Developer: AR Quick Look', url: APPLE, note: 'Requirements: iOS or iPadOS 12 or later.' },
          { label: 'Google for Developers: Scene Viewer', url: SCENE, note: 'Requirements, formats and 3D fallback without ARCore.' },
          { label: 'Google for Developers: ARCore supported devices', url: DEVICES, note: 'List maintained by Google.' },
          { label: 'WebKit: viewing augmented reality assets in Safari for iOS', url: WEBKIT, note: 'How Safari opens AR links.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Do buyers need to download an app to view a property in AR?',
        a: 'No. On iPhone and iPad, augmented reality opens in AR Quick Look from Safari; on Android, in Google’s Scene Viewer. The only thing Android may ask the first time is to install or update Google Play Services for AR, the Google component that runs it. {{brand}} delivers every home ready to open with one tap, with nothing of ours to install.',
      },
      {
        q: 'Which iPhones can show a property in AR?',
        a: 'According to Apple, AR Quick Look works on iPhone and iPad running iOS or iPadOS 12 or later. Open the link in Safari, because some apps’ built-in browsers won’t launch augmented reality. The tabletop model of the {{brand}} demo villa is {{file:usdzMesa}}, so it is worth being on Wi-Fi or a good signal before you tap the button.',
      },
      {
        q: 'How do I know if my Android phone supports ARCore?',
        a: 'Google publishes the list of ARCore-supported devices. As a rule, the phone must have shipped with the Google Play Store and run Android 7.0 or later, unless the list says otherwise. If it isn’t supported, Scene Viewer shows the home in 3D without the camera. {{brand}} prepares a separate file for Android in every delivery.',
      },
      {
        q: 'Why won’t AR open from WhatsApp?',
        a: 'Because WhatsApp, Instagram and other apps open links in their own built-in browser, which may not launch augmented reality. The fix is to open the same link in Safari on iPhone or Chrome on Android. On the homes {{brand}} delivers, the page shows that tip, so buyers abroad aren’t left stuck with a button that does nothing.',
      },
      {
        q: 'Can I view a property in AR on a laptop?',
        a: 'No: desktop browsers don’t open Apple’s or Google’s augmented reality viewers. On a computer, the property page shows a QR code instead; scan it with your phone’s camera and AR opens on the phone. Meanwhile, on the big screen you can explore the home in our 3D viewer, room by room.',
      },
      {
        q: 'How much space do I need to see the home at real size?',
        a: 'As much as the home takes up. The upper floor of our demo villa measures {{villa:footprint}}, so a normal living room fits one or two rooms and a garden or large terrace fits far more. The 1:20 tabletop model needs about 46 × 70 cm of table. {{brand}} delivers both modes with every home.',
      },
      {
        q: 'How much mobile data does AR use?',
        a: 'As much as the file, which the phone downloads in full before showing it. For the {{brand}} demo villa, the tabletop model is {{file:usdzMesa}} on iPhone and {{file:glbArMesa}} on Android; real size is {{file:usdzReal}} and {{file:glbAr}}. On Wi-Fi or good 4G or 5G it takes a few seconds; if data is tight, start with the tabletop model.',
      },
      {
        q: 'How do I send the AR view to a buyer abroad?',
        a: 'Send the link to the property page by WhatsApp or email, and put a QR code on boards and brochures. Don’t send the bare file: the page picks the right format for iPhone or Android. {{brand}} includes the link, the viewer and augmented reality with the complete 3D model, from {{price:maqueta}} + VAT, delivered in {{delivery:maqueta}}.',
      },
    ],
    related: ['servicio-ar', 'caso-villa', 'servicio-tour', 'guia-matterport', 'sol-promotoras'],
    cta: {
      h2: 'Want to see your property in AR?',
      body: 'Send us the floor plan: we will model one room free of charge and send you the link to open it on your phone, on the table or at real size. No obligation.',
    },
  },
};
