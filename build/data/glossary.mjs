/* ═══════════════════════════════════════════════════════════════
   Glossary (DefinedTermSet): /glosario/ and /en/glossary/.
   Contract: docs/build/CONTENT-SCHEMA.md §7.
   - `id` is the anchor (/glosario/#usdz, /en/glossary/#usdz). Content
     links to a term with [USDZ](@glosario#usdz). Never rename an id:
     other pages link to it.
   - `definition`: first sentence defines the term, ≤ 40 words.
   - `body`: md-lite detail, one paragraph, 40 to 120 words.
   - `related`: one page id linked from the term (exists in ES and EN).
   The engine sorts terms alphabetically per language.
   Facts verified on 2026-09-28 against the primary source linked in
   each body (Khronos, Apple, Google, W3C, OpenUSD, Blender, BOE).
   ═══════════════════════════════════════════════════════════════ */

const SRC = {
  quickLook: 'https://developer.apple.com/augmented-reality/quick-look/',
  arcoreDevices: 'https://developers.google.com/ar/devices',
  arkit: 'https://developer.apple.com/news/?id=06052017b',
  blender: 'https://www.blender.org/about/',
  cycles: 'https://docs.blender.org/manual/en/2.91/render/cycles/introduction.html',
  gltf: 'https://www.khronos.org/gltf/',
  gltfSpec: 'https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html',
  iframe: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe',
  modelViewer: 'https://modelviewer.dev/',
  sceneViewer: 'https://developers.google.com/ar/develop/scene-viewer',
  usdz: 'https://openusd.org/release/spec_usdz.html',
  loe: 'https://www.boe.es/buscar/act.php?id=BOE-A-1999-21567',
  webxr: 'https://www.w3.org/TR/webxr/',
  matterport: 'https://matterport.com/cameras',
};

export const glossary = [
  // ── Formats ────────────────────────────────────────────────────
  {
    id: 'gltf',
    related: 'caso-villa',
    es: {
      term: 'glTF',
      definition: 'Formato abierto y libre de regalías para transmitir y cargar escenas y modelos 3D, publicado por el Khronos Group. Su versión 2.0 es la norma internacional ISO/IEC 12113:2022.',
      body: `Khronos lo presenta como «el JPEG del 3D»: modelos ligeros para navegadores, móviles y motores gráficos. Usa materiales [PBR](@glosario#pbr) de tipo metálico y rugosidad, así que un modelo se ve igual en visores distintos. Se guarda como varios archivos o como uno solo, el [GLB](@glosario#glb). Más en la [página oficial de glTF](${SRC.gltf}).`,
    },
    en: {
      term: 'glTF',
      definition: 'An open, royalty-free format for transmitting and loading 3D scenes and models, published by the Khronos Group. Version 2.0 is the international standard ISO/IEC 12113:2022.',
      body: `Khronos calls it “the JPEG of 3D”: lightweight models for browsers, phones and engines. It uses metallic-roughness [PBR](@glosario#pbr) materials, so a model looks the same in different viewers. It can be saved as several files or as a single one, the [GLB](@glosario#glb). More on the [official glTF page](${SRC.gltf}).`,
    },
  },
  {
    id: 'glb',
    related: 'servicio-tour',
    es: {
      term: 'GLB',
      definition: 'Versión binaria de glTF: guarda en un único archivo .glb la geometría, los materiales y las texturas de un modelo 3D. Es el formato habitual para mostrar modelos en la web y en Android.',
      body: `Un GLB se aloja y se comparte como una imagen: un archivo, una URL. El [visor 3D](@glosario#visor-3d) de {{brand}} carga un GLB comprimido, que en nuestra villa pesa {{file:glb}} con {{villa:triangles}} triángulos. Para la realidad aumentada en Android entregamos otros GLB, que abre [Scene Viewer](@glosario#scene-viewer).`,
    },
    en: {
      term: 'GLB',
      definition: 'The binary version of glTF: a single .glb file holding a 3D model’s geometry, materials and textures. It is the usual format for showing models on the web and on Android.',
      body: `A GLB is hosted and shared like an image: one file, one URL. The {{brand}} [3D viewer](@glosario#visor-3d) loads a compressed GLB, which weighs {{file:glb}} with {{villa:triangles}} triangles for our villa. For augmented reality on Android we deliver separate GLB files, opened by [Scene Viewer](@glosario#scene-viewer).`,
    },
  },
  {
    id: 'usdz',
    related: 'servicio-ar',
    es: {
      term: 'USDZ',
      definition: 'Formato 3D creado por Pixar sobre Universal Scene Description: un paquete zip sin compresión con el modelo, sus materiales y texturas. Es el que abre AR Quick Look en iPhone y iPad.',
      body: `Sin él, la realidad aumentada no se abre en un iPhone. Por eso {{brand}} entrega cada vivienda también en USDZ, en dos versiones: maqueta 1:20 para la mesa y tamaño real para el suelo, que en nuestra villa pesan {{file:usdzMesa}} y {{file:usdzReal}}. En Android el equivalente es el [GLB](@glosario#glb). Especificación en [openusd.org](${SRC.usdz}).`,
    },
    en: {
      term: 'USDZ',
      definition: 'A 3D file format created by Pixar on top of Universal Scene Description: an uncompressed zip package that holds a model, its materials and textures in one file. It is the format AR Quick Look opens on iPhone and iPad.',
      body: `Without it, augmented reality will not open on an iPhone. That is why every {{brand}} home is also delivered as USDZ, in two versions: a 1:20 tabletop model and a real-size one for the floor, which weigh {{file:usdzMesa}} and {{file:usdzReal}} for our villa. On Android the equivalent is [GLB](@glosario#glb). Specification on [openusd.org](${SRC.usdz}).`,
    },
  },

  // ── Augmented reality ──────────────────────────────────────────
  {
    id: 'realidad-aumentada',
    related: 'servicio-ar',
    es: {
      term: 'Realidad aumentada',
      definition: 'Tecnología que superpone objetos digitales a la imagen real de la cámara del móvil, anclados al suelo o a una mesa, de modo que parecen estar en la habitación. Se abrevia AR o RA.',
      body: `En inmobiliaria permite ver una vivienda como maqueta sobre la mesa o a tamaño real en el salón, sin app: en iPhone y iPad la abre [AR Quick Look](@glosario#ar-quick-look) y en Android, [Scene Viewer](@glosario#scene-viewer). Un ordenador no puede mostrarla y enseña un código QR. {{brand}} la incluye en la maqueta 3D completa, desde {{price:maqueta}} + IVA.`,
    },
    en: {
      term: 'Augmented reality (AR)',
      definition: 'Technology that overlays digital objects on the live image from a phone’s camera, anchored to the floor or a table, so they appear to be in the room.',
      body: `In property it lets buyers see a home as a model on their table or at real size in their living room, with no app: [AR Quick Look](@glosario#ar-quick-look) opens it on iPhone and iPad, [Scene Viewer](@glosario#scene-viewer) on Android. A computer cannot show it, so it displays a QR code. {{brand}} includes it in the complete 3D model, from {{price:maqueta}} + VAT.`,
    },
  },
  {
    id: 'ar-quick-look',
    related: 'guia-ar',
    es: {
      term: 'AR Quick Look',
      definition: 'Visor de realidad aumentada integrado en iPhone, iPad y Apple Vision Pro que abre archivos USDZ desde Safari, Mensajes o Mail, sin instalar ninguna app. Requiere iOS o iPadOS 12 o posterior.',
      body: `Así ve la vivienda un comprador con iPhone: toca «Ver en tu salón» en la web y el sistema coloca el modelo [USDZ](@glosario#usdz) sobre la imagen de la cámara. En nuestro [caso demostrativo](@caso-villa), la maqueta 1:20 pesa {{file:usdzMesa}}. Apple lo documenta en su [página de AR Quick Look](${SRC.quickLook}); en Android, el equivalente es [Scene Viewer](@glosario#scene-viewer).`,
    },
    en: {
      term: 'AR Quick Look',
      definition: 'Apple’s built-in augmented reality viewer on iPhone, iPad and Apple Vision Pro. It opens USDZ files from Safari, Messages or Mail with no app to install, on iOS or iPadOS 12 or later.',
      body: `This is how a buyer with an iPhone sees the home: they tap “View in your room” on the web page and the system places the [USDZ](@glosario#usdz) model over the camera image. In our [case study](@caso-villa), the 1:20 tabletop model weighs {{file:usdzMesa}}. Apple documents it on its [AR Quick Look page](${SRC.quickLook}); the Android equivalent is [Scene Viewer](@glosario#scene-viewer).`,
    },
  },
  {
    id: 'scene-viewer',
    related: 'servicio-ar',
    es: {
      term: 'Scene Viewer',
      definition: 'Visor de Google que abre modelos glTF o GLB desde una web o una app de Android y los coloca en realidad aumentada en móviles compatibles con ARCore y Android 7.0 o posterior.',
      body: `Se abre con un enlace desde el navegador y necesita actualizadas la app de Google y los Servicios de Google Play para RA. Si el móvil no es compatible con [ARCore](@glosario#arcore), muestra el modelo en 3D sin cámara. {{brand}} entrega para Android la maqueta 1:20 ({{file:glbArMesa}} en nuestra villa) y el tamaño real. Guía oficial en [Google for Developers](${SRC.sceneViewer}).`,
    },
    en: {
      term: 'Scene Viewer',
      definition: 'Google’s viewer that opens glTF or GLB models from a website or an Android app and places them in augmented reality on ARCore-supported phones running Android 7.0 or later.',
      body: `It opens from a link in the browser and needs up-to-date versions of the Google app and Google Play Services for AR. If the phone does not support [ARCore](@glosario#arcore), it shows the model in 3D without the camera. {{brand}} delivers a 1:20 tabletop model ({{file:glbArMesa}} for our villa) and a real-size one for Android. Official guide on [Google for Developers](${SRC.sceneViewer}).`,
    },
  },
  {
    id: 'arcore',
    related: 'guia-ar',
    es: {
      term: 'ARCore',
      definition: 'Plataforma de realidad aumentada de Google. Permite al móvil seguir su posición, detectar suelos y mesas y estimar la luz de la habitación. Funciona en teléfonos Android compatibles con la versión 7.0 o posterior.',
      body: `Sin ARCore no hay realidad aumentada en Android: [Scene Viewer](@glosario#scene-viewer) lo usa para apoyar la vivienda sobre una superficie real. Google publica la [lista de dispositivos compatibles](${SRC.arcoreDevices}). Si el móvil del comprador no está en ella, el enlace de {{brand}} le enseña igualmente el modelo en 3D en la pantalla. El equivalente de Apple es [ARKit](@glosario#arkit).`,
    },
    en: {
      term: 'ARCore',
      definition: 'Google’s augmented reality platform. It lets a phone track its position, detect floors and tables and estimate the room’s lighting. It runs on supported Android phones with version 7.0 or later.',
      body: `Without ARCore there is no augmented reality on Android: [Scene Viewer](@glosario#scene-viewer) uses it to set the home down on a real surface. Google publishes the [list of supported devices](${SRC.arcoreDevices}). If a buyer’s phone is not on it, the {{brand}} link still shows the model in 3D on screen. Apple’s equivalent is [ARKit](@glosario#arkit).`,
    },
  },
  {
    id: 'arkit',
    related: 'servicio-ar',
    es: {
      term: 'ARKit',
      definition: 'Marco de desarrollo de Apple para crear experiencias de realidad aumentada en iPhone y iPad. Se presentó con iOS 11 en junio de 2017.',
      body: `Es la pieza con la que se programan apps. Para enseñar una vivienda no hace falta ninguna: [AR Quick Look](@glosario#ar-quick-look), que viene en el sistema, abre el [USDZ](@glosario#usdz) desde Safari, y por eso la realidad aumentada de {{brand}} funciona con un enlace. Apple lo anunció en su [nota para desarrolladores](${SRC.arkit}). En Android, el equivalente es [ARCore](@glosario#arcore).`,
    },
    en: {
      term: 'ARKit',
      definition: 'Apple’s framework for building augmented reality experiences on iPhone and iPad. It was introduced with iOS 11 in June 2017.',
      body: `It is what app developers build with. Showing a home needs no app at all: [AR Quick Look](@glosario#ar-quick-look), built into the system, opens the [USDZ](@glosario#usdz) file from Safari, which is why {{brand}} augmented reality works from a link. Apple announced it in a [developer news post](${SRC.arkit}). On Android, the equivalent is [ARCore](@glosario#arcore).`,
    },
  },
  {
    id: 'webxr',
    related: 'guia-ar',
    es: {
      term: 'WebXR',
      definition: 'Interfaz estándar del W3C (WebXR Device API) que permite a una página web acceder a dispositivos de realidad virtual y aumentada, como gafas y sensores del móvil, sin instalar apps.',
      body: `Es el camino de la web abierta hacia la realidad aumentada, pero su soporte varía según el navegador y el dispositivo, y la especificación sigue como borrador de Recomendación Candidata del W3C (junio de 2026). Por eso {{brand}} usa [AR Quick Look](@glosario#ar-quick-look) en iPhone y [Scene Viewer](@glosario#scene-viewer) en Android. Borrador en [w3.org](${SRC.webxr}).`,
    },
    en: {
      term: 'WebXR',
      definition: 'A W3C standard interface (the WebXR Device API) that lets a web page access virtual and augmented reality devices, such as headsets and phone sensors, with no app to install.',
      body: `It is the open web’s route to augmented reality, but support varies by browser and device, and the specification is still a W3C Candidate Recommendation Draft (June 2026). That is why {{brand}} uses [AR Quick Look](@glosario#ar-quick-look) on iPhone and [Scene Viewer](@glosario#scene-viewer) on Android. Draft on [w3.org](${SRC.webxr}).`,
    },
  },

  // ── Viewer ─────────────────────────────────────────────────────
  {
    id: 'visor-3d',
    related: 'servicio-tour',
    es: {
      term: 'Visor 3D',
      definition: 'Aplicación web que muestra un modelo 3D en el navegador para girarlo, acercarlo y recorrerlo sin instalar nada. Se comparte con un enlace o se incrusta en otra web con un iframe.',
      body: `El visor de {{brand}} añade lo que necesita un anuncio: estancias con sus metros, recorrido guiado, vista en planta, [modo maqueta](@glosario#modo-maqueta), control de luz y botón de realidad aumentada. Solo descarga el modelo, de {{file:glb}} en nuestra villa, cuando el visitante lo pide. La maqueta 3D completa incluye 12 meses de alojamiento del visor.`,
    },
    en: {
      term: '3D viewer',
      definition: 'A web application that displays a 3D model in the browser, to rotate, zoom and walk through with nothing to install. It is shared as a link or embedded in another site with an iframe.',
      body: `The {{brand}} viewer adds what a listing needs: rooms with floor areas, a guided tour, a plan view, [cut-away mode](@glosario#modo-maqueta), a light control and an augmented reality button. It only downloads the model, {{file:glb}} for our villa, when the visitor asks. The complete 3D model includes 12 months of viewer hosting.`,
    },
  },
  {
    id: 'model-viewer',
    related: 'servicio-tour',
    es: {
      term: 'model-viewer',
      definition: 'Componente web de código abierto, desarrollado por Google con licencia Apache 2.0, que muestra modelos 3D interactivos en una página y los abre en realidad aumentada en móviles compatibles.',
      body: `Es la base del [visor 3D](@glosario#visor-3d) de {{brand}}: lee el [GLB](@glosario#glb), se gira y se acerca con los dedos y conecta con [AR Quick Look](@glosario#ar-quick-look) en iPhone. Lo alojamos en nuestro servidor y solo se descarga cuando el visitante pulsa para explorar, así que la página carga rápido. Documentación en [modelviewer.dev](${SRC.modelViewer}).`,
    },
    en: {
      term: 'model-viewer',
      definition: 'An open-source web component developed by Google under the Apache 2.0 licence. It displays interactive 3D models on a web page and opens them in augmented reality on supported phones.',
      body: `It powers the {{brand}} [3D viewer](@glosario#visor-3d): it reads the [GLB](@glosario#glb), rotates and zooms with your fingers and hands over to [AR Quick Look](@glosario#ar-quick-look) on iPhone. We host it on our own server and it only downloads when a visitor taps to explore, so the page stays fast. Documentation at [modelviewer.dev](${SRC.modelViewer}).`,
    },
  },
  {
    id: 'modo-maqueta',
    related: 'servicio-tour',
    es: {
      term: 'Modo maqueta',
      definition: 'Vista del visor 3D de {{brand}} que corta todos los muros a {{villa:cutHeight}} m de altura para ver desde arriba la distribución y el mobiliario de cada estancia, como en una maqueta de arquitectura.',
      body: `Con los muros completos, a {{villa:wallHeight}} m, la vivienda es un volumen cerrado. Con el corte, el comprador ve de un vistazo cómo se conectan salón, dormitorios, baños y terrazas, algo que ni las fotos ni un [tour virtual 360](@glosario#tour-virtual-360) enseñan. Pruébalo en la [villa de nuestro caso](@caso-villa#visor).`,
    },
    en: {
      term: 'Cut-away mode (dollhouse view)',
      definition: 'A {{brand}} 3D viewer mode that slices every wall at {{villa:cutHeight}} m, so you look down into each room and read the layout and furniture, like an architect’s scale model.',
      body: `With full-height walls, at {{villa:wallHeight}} m, the home reads as a closed box. With the cut, buyers see at a glance how the living room, bedrooms, bathrooms and terraces connect, which neither photos nor a [360° virtual tour](@glosario#tour-virtual-360) can show. Try it on the [villa in our case study](@caso-villa#visor).`,
    },
  },
  {
    id: 'iframe',
    related: 'servicio-tour',
    es: {
      term: 'Iframe',
      definition: 'Elemento HTML que inserta otra página web dentro de la actual, en un recuadro. Es la forma estándar de incrustar un visor 3D, un mapa o un vídeo en la web de una inmobiliaria.',
      body: `{{brand}} entrega el visor con un código iframe listo para pegar en la ficha de la vivienda, en cualquier web que admita HTML, con carga diferida y permisos de pantalla completa y realidad aumentada. En los portales depende de cada uno: idealista solo admite visitas 3D de sus proveedores compatibles. Referencia técnica en [MDN](${SRC.iframe}).`,
    },
    en: {
      term: 'Iframe',
      definition: 'An HTML element that places another web page inside the current one, in a frame. It is the standard way to embed a 3D viewer, a map or a video on an estate agent’s website.',
      body: `{{brand}} delivers the viewer with iframe code ready to paste into the property page, on any website that accepts HTML, with lazy loading and permission for full screen and augmented reality. On portals it depends on each one: Idealista only accepts 3D tours from its approved providers. Technical reference on [MDN](${SRC.iframe}).`,
    },
  },

  // ── Images and plans ───────────────────────────────────────────
  {
    id: 'render',
    related: 'servicio-renders',
    es: {
      term: 'Render',
      definition: 'Imagen generada por ordenador a partir de un modelo 3D, calculando cómo ilumina la luz sus materiales. En inmobiliaria enseña una vivienda sin construir, vacía o reformada.',
      body: `Renderizar es el proceso; el render, la imagen. La calidad depende del modelo, los materiales y la luz más que del programa. {{brand}} renderiza en 4K con [Cycles](@glosario#cycles) sobre el modelo de la vivienda, y la maqueta 3D completa incluye 6, desde {{price:maqueta}} + IVA. Precios de mercado, en [cuánto cuesta un render 3D](@guia-precio-render).`,
    },
    en: {
      term: 'Render',
      definition: 'A computer-generated image made from a 3D model by calculating how light falls on its materials. In property, a photorealistic render shows a home that is unbuilt, empty or yet to be renovated.',
      body: `Rendering is the process; the render is the image, often called CGI in British property marketing. Quality depends on the model, the materials and the light more than on the software. {{brand}} renders in 4K with [Cycles](@glosario#cycles) from the model of the home; the complete 3D model includes 6, from {{price:maqueta}} + VAT. Market prices: [3D rendering cost guide](@guia-precio-render).`,
    },
  },
  {
    id: 'infografia-3d',
    related: 'servicio-renders',
    es: {
      term: 'Infografía 3D',
      definition: 'Nombre que se da en España a la imagen fotorrealista de un edificio o una vivienda generada por ordenador a partir de un modelo 3D. En la práctica es sinónimo de render arquitectónico.',
      body: `Viene de la arquitectura y la promoción: las «infografías de la promoción» son las imágenes del folleto y la web de una obra nueva, y no tienen que ver con la infografía de datos. {{brand}} las entrega en 4K, calculadas con [Cycles](@glosario#cycles), y las etiqueta como recreación cuando la vivienda aún no existe.`,
    },
    en: {
      term: 'Infografía 3D (Spanish for CGI)',
      definition: 'The usual Spanish term for a photorealistic, computer-generated image of a building or home made from a 3D model. In practice it means an architectural render, or CGI.',
      body: `You will meet it in Spanish developers’ brochures and briefs: *infografías de la promoción* are the CGI images of a new-build scheme, nothing to do with data infographics. {{brand}} delivers them in 4K, rendered with [Cycles](@glosario#cycles), and labels them as virtual when the home is not built yet.`,
    },
  },
  {
    id: 'plano-2d',
    related: 'servicio-plano',
    es: {
      term: 'Plano 2D',
      definition: 'Dibujo a escala de una vivienda vista desde arriba, con líneas para muros, puertas y ventanas. Puede llevar cotas, superficies y nombres de estancias. Es el punto de partida de un modelo 3D.',
      body: `Llega de muchas formas: el PDF del arquitecto, un DWG, el folleto de una promoción o el plano de un anuncio. A {{brand}} le basta uno legible y una medida de referencia para levantar la vivienda en 3D, sin fotos ni visita. Si no trae [cotas](@glosario#cota), medimos sobre su escala y lo indicamos.`,
    },
    en: {
      term: '2D floor plan',
      definition: 'A scale drawing of a home seen from above, with lines for walls, doors and windows. It may show dimensions, floor areas and room names. It is the starting point for a 3D model.',
      body: `It arrives in many forms: an architect’s PDF, a DWG file, a development brochure or the plan on a listing. {{brand}} only needs a legible one and one reference measurement to build the home in 3D, with no photos and no site visit. If it has no [dimensions](@glosario#cota), we measure from its scale and say so.`,
    },
  },
  {
    id: 'planta-cenital',
    related: 'servicio-plano',
    es: {
      term: 'Planta cenital',
      definition: 'Imagen de una vivienda vista desde arriba en vertical, sin techo, que muestra a color la distribución, el mobiliario y los suelos. Es el formato más habitual del llamado plano 3D.',
      body: `{{brand}} la genera con una cámara ortográfica sobre el modelo 3D, sin perspectiva, así que las proporciones se mantienen y la imagen coincide con el [plano 2D](@glosario#plano-2d) redibujado. Se entrega en 4K dentro del plano 3D, desde {{price:plano3d}} + IVA por planta, en {{delivery:plano3d}}.`,
    },
    en: {
      term: 'Top-down floor plan',
      definition: 'An image of a home seen straight from above with the roof removed, showing the layout, furniture and floor finishes in colour. It is the most common form of a so-called 3D floor plan.',
      body: `{{brand}} produces it with an orthographic camera over the 3D model, with no perspective, so room proportions hold and the image lines up with the redrawn [2D floor plan](@glosario#plano-2d). It is delivered in 4K as part of the 3D floor plan, from {{price:plano3d}} + VAT per floor, in {{delivery:plano3d}}.`,
    },
  },
  {
    id: 'vista-isometrica',
    related: 'servicio-plano',
    es: {
      term: 'Vista isométrica',
      definition: 'Representación en 3D vista desde arriba y en diagonal, con los tres ejes a la misma escala y sin puntos de fuga, de modo que las medidas no se deforman con la distancia.',
      body: `En inmobiliaria enseña una planta amueblada con volumen: muros, muebles y alturas a la vez, algo que la [planta cenital](@glosario#planta-cenital) no muestra. {{brand}} la entrega en 4K dentro del plano 3D, desde {{price:plano3d}} + IVA por planta; con la maqueta completa, además, giras la vivienda a tu gusto en el [visor 3D](@glosario#visor-3d).`,
    },
    en: {
      term: 'Isometric view',
      definition: 'A 3D drawing seen from above at an angle, with all three axes at the same scale and no vanishing points, so measurements do not shrink with distance.',
      body: `In property it shows a furnished plan with depth: walls, furniture and heights at once, which a [top-down floor plan](@glosario#planta-cenital) cannot. {{brand}} delivers it in 4K as part of the 3D floor plan, from {{price:plano3d}} + VAT per floor; with the complete model you can also turn the home any way you like in the [3D viewer](@glosario#visor-3d).`,
    },
  },
  {
    id: 'cota',
    related: 'servicio-plano',
    es: {
      term: 'Cota',
      definition: 'Medida escrita sobre un plano junto a una línea con marcas en sus extremos, que indica la longitud real de un muro, un hueco o una estancia.',
      body: `Las cotas deciden la precisión del modelo. Con un plano acotado o un DWG, {{brand}} respeta las medidas. Si solo hay escala gráfica, medimos sobre ella y marcamos las superficies como aproximadas (≈), como en la [villa de nuestro caso](@caso-villa). Para empezar basta una cota de referencia, como el ancho del salón o la superficie total.`,
    },
    en: {
      term: 'Dimension (cota)',
      definition: 'A measurement written on a plan next to a line with end marks, giving the real length of a wall, an opening or a room. Spanish plans call it a *cota*.',
      body: `Dimensions decide how accurate the model can be. With a dimensioned plan or a DWG, {{brand}} follows the measurements. With only a scale bar, we measure from it and mark floor areas as approximate (≈), as with the [villa in our case study](@caso-villa). One reference measurement is enough to start, such as the width of the living room or the total floor area.`,
    },
  },

  // ── Materials and tools ────────────────────────────────────────
  {
    id: 'pbr',
    related: 'como-funciona',
    es: {
      term: 'PBR',
      definition: 'Siglas de *physically based rendering*: forma de describir los materiales por sus propiedades físicas (color base, rugosidad, metal y relieve) para que reaccionen a la luz de manera realista en cualquier visor o motor.',
      body: `Gracias al PBR, un suelo de madera o un porcelánico negro se ven igual en un render de [Cycles](@glosario#cycles), en el [visor 3D](@glosario#visor-3d) y en realidad aumentada. [glTF](@glosario#gltf) usa el modelo metálico y rugosidad como material de base ([especificación](${SRC.gltfSpec})). Para nuestra villa creamos {{villa:textures}} texturas PBR, todas [procedurales](@glosario#textura-procedural).`,
    },
    en: {
      term: 'PBR (physically based rendering)',
      definition: 'A way of describing materials by their physical properties (base colour, roughness, metalness and relief) so they react to light realistically in any viewer or engine.',
      body: `Thanks to PBR, a timber floor or black porcelain tiles look the same in a [Cycles](@glosario#cycles) render, in the [3D viewer](@glosario#visor-3d) and in augmented reality. [glTF](@glosario#gltf) uses the metallic-roughness model as its core material ([specification](${SRC.gltfSpec})). For our villa we created {{villa:textures}} PBR textures, all of them [procedural](@glosario#textura-procedural).`,
    },
  },
  {
    id: 'textura-procedural',
    related: 'como-funciona',
    es: {
      term: 'Textura procedural',
      definition: 'Textura generada con fórmulas y nodos en lugar de fotografías: madera, piedra, azulejo o tela se describen con parámetros de color, escala y relieve que se ajustan sin volver a fotografiar nada.',
      body: `Dos ventajas para un anuncio: no hay derechos de imagen de terceros, porque nada sale de un banco de fotos, y cambiar el tono de un suelo o el tamaño de una baldosa es ajustar un valor y volver a renderizar. Todas las texturas de {{brand}} son [PBR](@glosario#pbr) procedurales; para nuestra villa creamos {{villa:textures}}.`,
    },
    en: {
      term: 'Procedural texture',
      definition: 'A texture generated from formulas and nodes rather than photographs: wood, stone, tiles or fabric are described by colour, scale and relief parameters that can be adjusted without reshooting anything.',
      body: `Two advantages for a listing: there are no third-party image rights, because nothing comes from a stock photo library, and changing a floor’s tone or a tile’s size means adjusting a value and rendering again. Every {{brand}} texture is procedural [PBR](@glosario#pbr); for our villa we created {{villa:textures}}.`,
    },
  },
  {
    id: 'blender',
    related: 'como-funciona',
    es: {
      term: 'Blender',
      definition: 'Programa libre y de código abierto para crear gráficos 3D: modelado, materiales, iluminación, animación y render. Se distribuye con licencia GNU GPL y puede usarse con fines comerciales sin pagar licencias.',
      body: `Es la herramienta central de {{brand}}. La automatizamos con scripts de Python que levantan muros, huecos, puertas y ventanas desde el plano, así que mover un tabique se reconstruye en minutos. Renderizamos con [Cycles](@glosario#cycles) y exportamos a [glTF](@glosario#gltf). La licencia se explica en [blender.org](${SRC.blender}).`,
    },
    en: {
      term: 'Blender',
      definition: 'Free and open-source 3D software for modelling, materials, lighting, animation and rendering. It is released under the GNU GPL and can be used commercially with no licence fees.',
      body: `It is the core tool at {{brand}}. We drive it with Python scripts that build walls, openings, doors and windows from the plan, so moving a partition rebuilds in minutes. We render with [Cycles](@glosario#cycles) and export to [glTF](@glosario#gltf). The licence is explained on [blender.org](${SRC.blender}).`,
    },
  },
  {
    id: 'cycles',
    related: 'servicio-renders',
    es: {
      term: 'Cycles',
      definition: 'Motor de render de Blender basado en trazado de rayos (path tracing): simula cómo rebota la luz para producir imágenes físicamente correctas. Calcula en el procesador o en la tarjeta gráfica.',
      body: `Con Cycles, la luz del sol entra por las ventanas y rebota en suelos y paredes como en la realidad, sin sombras pintadas a mano. Los {{villa:renders}} renders de nuestro [caso demostrativo](@caso-villa) tardaron {{villa:renderMinutes}} minutos en total en una RTX 4060. El [manual de Blender](${SRC.cycles}) lo define como un trazador de rayos físico para producción.`,
    },
    en: {
      term: 'Cycles',
      definition: 'Blender’s render engine based on path tracing: it simulates how light bounces to produce physically correct images. It can run on the processor or the graphics card.',
      body: `With Cycles, sunlight comes through the windows and bounces off floors and walls as it would in reality, with no hand-painted shadows. The {{villa:renders}} renders in our [case study](@caso-villa) took {{villa:renderMinutes}} minutes in total on an RTX 4060. The [Blender manual](${SRC.cycles}) calls it a physically based path tracer for production rendering.`,
    },
  },

  // ── Selling and marketing ──────────────────────────────────────
  {
    id: 'home-staging-virtual',
    related: 'servicio-staging',
    es: {
      term: 'Home staging virtual',
      definition: 'Técnica que amuebla o redecora digitalmente una vivienda para un anuncio, sin muebles reales. Se hace retocando fotos, generando imágenes con IA o cambiando el mobiliario de un modelo 3D.',
      body: `Sobre un modelo 3D, el nuevo estilo es coherente en todas las vistas, en el [visor 3D](@glosario#visor-3d) y en la realidad aumentada; con fotos, cada imagen se edita aparte. En {{brand}} cuesta {{extra:staging}} + IVA por estancia. Las imágenes se publican etiquetadas como recreación virtual, porque los muebles no entran en la venta.`,
    },
    en: {
      term: 'Virtual staging',
      definition: 'Furnishing or restyling a home digitally to show it in a listing, without bringing in real furniture. It is done by editing photos, generating images with AI or changing the furniture in a 3D model.',
      body: `On a 3D model, a new style stays consistent across every view, the [3D viewer](@glosario#visor-3d) and augmented reality; with photos, each image is edited on its own. At {{brand}} it costs {{extra:staging}} + VAT per room. The images should be labelled as virtually staged, because the furniture is not part of the sale.`,
    },
  },
  {
    id: 'tour-virtual-360',
    related: 'guia-matterport',
    es: {
      term: 'Tour virtual 360',
      definition: 'Recorrido por una vivienda hecho con fotografías panorámicas de 360° tomadas desde varios puntos, entre los que se salta con un clic. Muestra el estado real del inmueble el día de la captura.',
      body: `Necesita una vivienda terminada, una cámara 360 y una visita, y no enseña la distribución desde arriba ni permite cambiar muebles. Un [visor 3D](@glosario#visor-3d) creado desde el plano no retrata la realidad, pero sirve antes de construir y tiene [modo maqueta](@glosario#modo-maqueta). En {{brand}}, las panorámicas 360° están en preparación.`,
    },
    en: {
      term: '360° virtual tour',
      definition: 'A walk-through of a home made from 360° panoramic photos taken at several points, with a click to jump between them. It shows the property exactly as it was on the day of the shoot.',
      body: `It needs a finished home, a 360 camera and a visit, and it cannot show the layout from above or swap the furniture. A [3D viewer](@glosario#visor-3d) built from the plan does not record reality, but it works before anything is built and has [cut-away mode](@glosario#modo-maqueta). At {{brand}}, 360° panoramas are coming soon.`,
    },
  },
  {
    id: 'matterport',
    related: 'guia-matterport',
    es: {
      term: 'Matterport',
      definition: 'Plataforma que crea recorridos 3D inmersivos y gemelos digitales de espacios reales a partir de capturas hechas con cámara, como su modelo Pro3 con lidar.',
      body: `Para capturar, la vivienda tiene que existir, estar terminada y visitarse con la cámara ([cámaras de Matterport](${SRC.matterport})). Por eso un escaneo no sirve para vender sobre plano y un modelo creado desde el plano sí. Si la vivienda ya está construida y quieres enseñar su estado real, un escaneo es una buena opción.`,
    },
    en: {
      term: 'Matterport',
      definition: 'A platform that creates immersive 3D tours and digital twins of real spaces from camera captures, for example with its Pro3 lidar camera.',
      body: `Capturing requires the home to exist, be finished and be visited with the camera ([Matterport’s cameras](${SRC.matterport})). That is why a scan cannot sell an off-plan home and a model built from the plan can. If the property is already built and you want to show its real condition, a scan is a sound choice.`,
    },
  },
  {
    id: 'gemelo-digital',
    related: 'caso-villa',
    es: {
      term: 'Gemelo digital',
      definition: 'Réplica digital de un objeto, un edificio o un espacio real que reproduce su geometría y, en usos avanzados, sus datos de funcionamiento. En inmobiliaria se llama así al modelo 3D navegable de un inmueble.',
      body: `Se aplica sobre todo a escaneos de viviendas construidas, como los de [Matterport](@glosario#matterport). Un modelo creado desde el plano, como los de {{brand}}, no es un gemelo en sentido estricto: representa la vivienda proyectada y amueblada a propósito, con medidas que dependen del plano. Por eso sirve para obra nueva, donde no hay nada que escanear.`,
    },
    en: {
      term: 'Digital twin',
      definition: 'A digital replica of a real object, building or space that reproduces its geometry and, in advanced uses, its operating data. In property the term is used for a navigable 3D model of a home.',
      body: `It is mostly applied to scans of built homes, such as [Matterport](@glosario#matterport) captures. A model built from the plan, like those {{brand}} makes, is not a twin in the strict sense: it represents the home as designed, deliberately furnished, with measurements that depend on the plan. That is why it works for new builds, where there is nothing to scan.`,
    },
  },
  {
    id: 'maqueta-virtual',
    related: 'sol-promotoras',
    es: {
      term: 'Maqueta virtual',
      definition: 'Modelo 3D digital de una vivienda o un edificio que sustituye a la maqueta física de las oficinas de venta: se gira, se acerca y se recorre en una pantalla o en realidad aumentada.',
      body: `Una maqueta física se construye una vez y se queda en la sala de ventas; la virtual viaja en un enlace. Con la [realidad aumentada](@glosario#realidad-aumentada), el comprador la coloca sobre su mesa a escala 1:20 o la recorre a tamaño real. En {{brand}}, el pack de promoción cuesta desde {{price:promocion}} + IVA.`,
    },
    en: {
      term: 'Virtual scale model',
      definition: 'A digital 3D model of a home or building that replaces the physical architectural model in a sales suite: it can be rotated, zoomed and walked through on a screen or in augmented reality.',
      body: `A physical model is built once and stays in the sales suite; a virtual one travels in a link. With [augmented reality](@glosario#realidad-aumentada), buyers set it on their table at 1:20 scale or walk through it at real size. At {{brand}}, the development package starts at {{price:promocion}} + VAT.`,
    },
  },
  {
    id: 'piso-piloto-virtual',
    related: 'sol-promotoras',
    es: {
      term: 'Piso piloto virtual',
      definition: 'Versión digital del piso de muestra de una promoción: la vivienda tipo, amueblada, que el comprador recorre en renders, en un visor 3D o en realidad aumentada sin desplazarse.',
      body: `Un piso piloto físico exige una vivienda terminada y amueblada, y solo lo ve quien viaja a la promoción. El virtual se enseña antes de empezar la obra y llega por un enlace a compradores de otros países. {{brand}} lo hace con el pack de promoción: 3 tipologías, 12 renders, visor y realidad aumentada, desde {{price:promocion}} + IVA.`,
    },
    en: {
      term: 'Virtual show home',
      definition: 'A digital version of a development’s show home: the typical unit, furnished and dressed, which buyers explore in renders, a 3D viewer or augmented reality instead of visiting in person.',
      body: `A physical show home needs a finished, furnished unit, and only buyers who travel to the site see it. A virtual one can be shown before construction starts and reaches buyers abroad through a link. {{brand}} covers it with the development package: 3 unit types, 12 renders, a viewer and augmented reality, from {{price:promocion}} + VAT.`,
    },
  },
  {
    id: 'venta-sobre-plano',
    related: 'sol-promotoras',
    es: {
      term: 'Venta sobre plano',
      definition: 'Compraventa de una vivienda antes de que esté construida o terminada, con el proyecto y los planos como referencia. El comprador suele adelantar parte del precio mientras dura la obra.',
      body: `En España, la [disposición adicional primera de la Ley 38/1999](${SRC.loe}) obliga al promotor a garantizar esas cantidades con un seguro de caución o un aval de una entidad de crédito, y a ingresarlas en una cuenta especial. Sin nada que fotografiar, la venta se apoya en planos, [infografías](@glosario#infografia-3d), modelos 3D y realidad aumentada. No es asesoramiento legal.`,
    },
    en: {
      term: 'Off-plan sale (venta sobre plano)',
      definition: 'Buying a home before it is built or finished, with the project and its plans as the reference. Buyers usually pay part of the price in instalments while construction is under way.',
      body: `In Spain, the [first additional provision of Ley 38/1999](${SRC.loe}), the Building Act, requires developers to guarantee those payments with surety insurance or a credit institution’s guarantee, and to hold them in a special account. With nothing to photograph, off-plan sales rely on plans, [CGI](@glosario#infografia-3d), 3D models and augmented reality. This is not legal advice.`,
    },
  },
];

export default glossary;
