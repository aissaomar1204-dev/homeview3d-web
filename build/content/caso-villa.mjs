// Case study (template `case`): the anonymised Costa del Sol villa, our central proof page.
// Only REAL facts: build/data/villa.mjs (tokens), docs/research/06-3d-ar-pipeline.md (validator 0 errors,
// web GLB under a third of the Blender export) and 07-renders.md (9 Cycles images in ≈ 7 min on an RTX 4060:
// 6 views + top-down plan + line plan + og_image; plan/render overlay within ±3 px, < 0.002 % clipped pixels,
// known model limits). The "≈ 26 s rebuild" claim was removed until it is re-measured (content audit F-34).
// No hours per phase: they were not timed separately. The honesty notice is villa.notice (single source).

import { villa } from '../data/villa.mjs';

export default {
  id: 'caso-villa',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Villa en la Costa del Sol en 3D: caso desde el plano',
    description: 'Caso demostrativo: villa en la Costa del Sol modelada en 3D desde un único plano, sin fotos: {{villa:rooms}} estancias amuebladas, renders, visor web y AR.',
    h1: 'Villa en la Costa del Sol: del plano 2D al 3D',
    lead: '{{brand}} modeló en 3D la planta alta de una villa en la Costa del Sol desde {{villa:input}}. Resultado: {{villa:rooms}} estancias amuebladas en unos {{villa:interiorM2}} m², renders, visor web y realidad aumentada. Es nuestro caso demostrativo, anonimizado; un encargo así cuesta desde {{price:maqueta}} + IVA.',
    // Hero (D-07/V-07): ≤ 20 words so the viewer stage reaches the first screen on phones. The full lead
    // (price + GEO sentence) is the first answer block below and stays the Markdown/llms summary.
    heroLead: 'Una villa real de la Costa del Sol, modelada en 3D desde un único plano 2D. Gírala aquí.',
    breadcrumb: 'Villa en la Costa del Sol',
    card: {
      title: 'Caso: villa en la Costa del Sol',
      summary: 'Una villa modelada desde un único plano, sin fotos: cifras, renders, visor, realidad aumentada y límites del caso.',
    },
    facts: [
      ['Entrada', 'Un plano 2D publicado, sin fotos ni cotas'],
      ['Alcance', 'Planta alta de una villa, con dos terrazas'],
      ['Superficie', '≈ {{villa:interiorM2}} m² interiores y ≈ {{villa:terracesM2}} m² de terrazas'],
      ['Estancias', '{{villa:rooms}}, con {{villa:bedrooms}} dormitorios'],
      ['Imágenes', '{{villa:renders}} en unos {{villa:renderMinutes}} minutos de cálculo en total'],
      ['Modelo web', '{{file:glb}}, con recorrido y modo maqueta'],
      ['Realidad aumentada', 'iPhone, iPad y Android: 1:20 y tamaño real'],
      ['Trabajo', 'Una sola sesión, del plano a la exportación'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué hicimos con esta villa?',
        answer: '{{brand}} modeló en 3D la planta alta de una villa en la Costa del Sol desde {{villa:input}}. Resultado: {{villa:rooms}} estancias amuebladas en unos {{villa:interiorM2}} m², renders, visor web y realidad aumentada. Es nuestro caso demostrativo, anonimizado; un encargo así cuesta desde {{price:maqueta}} + IVA.',
      },
      {
        type: 'answer',
        h2: '¿Por qué partir de un plano y no de fotos?',
        answer: 'Porque un plano es lo único que tiene una agencia o una promotora cuando no hay nada que fotografiar: obra nueva, una vivienda vacía o una casa en otra ciudad. Quisimos probar el caso más exigente, un plano publicado sin una sola foto del interior y sin cotas. Todo lo que ves en esta página sale de ese plano.',
        body: 'Arriba tienes el visor con el modelo real: gira la villa, entra en cada estancia, activa el [modo maqueta](@glosario#modo-maqueta) para cortar los muros a {{villa:cutHeight}} m o súbelos a su altura completa de {{villa:wallHeight}} m. Es exactamente lo que recibiría tu comprador en un enlace o incrustado en tu web.',
      },
      {
        type: 'specs',
        h2: 'La villa en números',
        items: [
          ['Punto de partida', 'Un único plano 2D publicado por terceros, sin fotos del interior ni cotas'],
          ['Alcance', 'Planta alta completa, con dos terrazas'],
          ['Huella del modelo', '{{villa:footprint}}'],
          ['Superficie interior', '≈ {{villa:interiorM2}} m², estimada a escala'],
          ['Terrazas', '≈ {{villa:terracesM2}} m², en dos terrazas'],
          ['Estancias', '{{villa:rooms}}, terrazas, escalera y lavadero incluidos'],
          ['Dormitorios', '{{villa:bedrooms}}'],
          ['Baños', '2: el de la suite, con bañera y ducha de lluvia, y el completo'],
          ['Texturas PBR procedurales', '{{villa:textures}}, creadas para este modelo'],
          ['Materiales', '{{villa:materials}}'],
          ['Triángulos', '{{villa:triangles}}'],
          ['Altura de muros', '{{villa:wallHeight}} m; corte de maqueta a {{villa:cutHeight}} m'],
          ['Imágenes', '{{villa:renders}}: 6 vistas, planta cenital, planta de líneas e imagen para redes; unos {{villa:renderMinutes}} minutos de Cycles en total'],
          ['Modelo web', '{{file:glb}}, GLB con compresión Meshopt y texturas WebP'],
          ['Realidad aumentada en iPhone', '{{file:usdzMesa}} la maqueta 1:20 y {{file:usdzReal}} el tamaño real (USDZ)'],
          ['Realidad aumentada en Android', '{{file:glbArMesa}} la maqueta 1:20 y {{file:glbAr}} el tamaño real (GLB)'],
          ['Tiempo de trabajo', 'Una sola sesión: modelado, texturas y exportación'],
        ],
      },
      {
        type: 'gallery',
        h2: 'Los renders de la villa',
        intro: 'Las {{villa:renders}} imágenes del caso (6 vistas, la planta cenital, la planta de líneas y la imagen para redes) se calcularon con Cycles en unos {{villa:renderMinutes}} minutos en total, con la misma luz de media tarde mediterránea. Ninguna es una foto ni una imagen generada con IA. Aquí van las 6 vistas; las dos plantas están en el comparador de más abajo. Así trabajamos los [renders inmobiliarios](@servicio-renders).',
        items: [
          { image: 'villa_maqueta_iso', alt: 'Maqueta 3D de la planta alta de la villa seccionada a {{villa:cutHeight}} m, vista aérea en tres cuartos con las estancias amuebladas. Render 3D de la villa anonimizada de la Costa del Sol.', caption: 'Maqueta seccionada a {{villa:cutHeight}} m, vista aérea en tres cuartos. Render 3D.' },
          { image: 'villa_salon_dormitorio', alt: 'Render 3D del salón con sofá rinconera y del dormitorio principal de la villa anonimizada, con luz de media tarde.', caption: 'Salón y dormitorio principal. Render 3D.' },
          { image: 'villa_dormitorios', alt: 'Render 3D del ala de dormitorios y del baño completo de la villa anonimizada, con la terraza de césped y la escalera de caracol.', caption: 'Ala de dormitorios y baño completo. Render 3D.' },
          { image: 'villa_bano_suite', alt: 'Render 3D del baño en suite de la villa anonimizada, con bañera exenta redonda, porcelánico negro y pared de terrazo.', caption: 'Baño en suite con bañera exenta. Render 3D.' },
          { image: 'villa_terraza', alt: 'Render 3D de la terraza principal de la villa anonimizada, con suelo de barro cocido, dos tumbonas, sofá exterior y un olivo en maceta.', caption: 'Terraza principal con tumbonas y olivo. Render 3D.' },
          { image: 'villa_muros_completos', alt: 'Render 3D de la villa anonimizada con los muros a su altura completa de {{villa:wallHeight}} m, vista aérea exterior en tres cuartos.', caption: 'Muros completos a {{villa:wallHeight}} m. Render 3D.' },
        ],
      },
      {
        type: 'video',
        video: 'villa-turntable',
        h2: '¿Cómo se ve la maqueta en movimiento?',
        caption: 'Una vuelta de cámara alrededor de la maqueta seccionada a {{villa:cutHeight}} m, con la misma luz que los renders. Animación 3D calculada con Cycles, sin sonido; no es una grabación.',
      },
      {
        type: 'compare',
        h2: 'La planta: redibujada y en color',
        intro: 'El plano original es de terceros y no lo publicamos. A la izquierda ves la planta 2D redibujada desde nuestro modelo; a la derecha, el render cenital a color. Salen de la misma cámara ortográfica y los contornos coinciden con un margen de ±3 px, el grosor de la línea.',
      },
      {
        type: 'steps',
        h2: '¿Cómo se hizo, paso a paso?',
        intro: 'Cronología real del trabajo, hecha en una sola sesión. Solo damos tiempos donde los medimos: no cronometramos cada fase por separado, así que no nos inventamos horas. El proceso estándar, con sus plazos, está en [cómo trabajamos un encargo](@como-funciona).',
        items: [
          {
            title: 'Lectura del plano',
            body: 'Partimos de la planta publicada de la villa. Sin cotas, fijamos la escala con el propio plano y medimos sobre ella cada muro y cada hueco. Anotamos lo que el plano no dice: alturas, carpinterías y tipo de suelo.',
          },
          {
            title: 'Modelado por script',
            body: 'Un script de Python levanta en Blender los muros de {{villa:wallHeight}} m, los tabiques, los huecos, las puertas y ventanas, la escalera a la planta baja y la de caracol de la terraza. Como la geometría sale de datos, mover un tabique es cambiar una cifra y volver a ejecutar. Es el mismo método de nuestro servicio de [plano 2D a 3D](@servicio-plano).',
          },
          {
            title: 'Mobiliario y materiales',
            body: 'Amueblamos las {{villa:rooms}} estancias según lo que el plano dibuja y creamos {{villa:textures}} [texturas procedurales](@glosario#textura-procedural): barro cocido, terrazo, porcelánico negro, madera y césped artificial, entre otras. Ninguna viene de un banco de imágenes.',
          },
          {
            title: 'Luz y renders',
            time: '≈ {{villa:renderMinutes}} min',
            body: 'Luz de media tarde mediterránea: sol cálido y bajo, y cielo físico. [Cycles](@glosario#cycles) calculó las {{villa:renders}} imágenes (6 vistas, las dos plantas y la imagen para redes) en unos {{villa:renderMinutes}} minutos en total en una tarjeta gráfica RTX 4060, con control automático de píxeles quemados y de texturas que no cargan.',
          },
          {
            title: 'Exportación a web y realidad aumentada',
            body: 'Exportamos a [glTF](@glosario#gltf) y un proceso automático limpia, comprime y valida el modelo: el archivo web queda en {{file:glb}}, menos de un tercio del export original, con los mismos {{villa:triangles}} triángulos y {{villa:materials}} materiales. Después de un cambio, basta con volver a ejecutar ese proceso, sin retoques a mano. Aparte generamos los [USDZ](@glosario#usdz) para iPhone y los [GLB](@glosario#glb) para Android.',
          },
          {
            title: 'Visor y comprobación',
            body: 'Montamos el visor con [model-viewer](@glosario#model-viewer): lista de estancias, recorrido guiado, luz y corte a {{villa:cutHeight}} m. Lo probamos con la conexión limitada: la imagen fija aparece primero y el modelo solo se descarga al pulsar.',
          },
        ],
      },
      {
        type: 'answer',
        h2: '¿Qué cambiaría con fotos o con un plano acotado?',
        answer: 'La precisión y los acabados. Con un plano acotado o un DWG, las superficies dejarían de ser estimaciones (≈) y el modelo respetaría cada cota. Con fotos del interior, reproduciríamos los suelos, la cocina y los baños reales en vez de interpretarlos. El proceso y el plazo serían los mismos.',
        body: 'En este caso, el plano no traía cotas: medimos sobre su escala, así que las medidas del modelo pueden diferir de las de la obra real. Parte del mobiliario también es interpretación nuestra, porque un plano de anuncio solo dibuja siluetas. Para enseñar la distribución, la luz y el uso de cada estancia no importa; para encargar un armario a medida, sí, y por eso lo decimos.\n\nHay además dos límites del modelo que el render no oculta. La bañera exenta, blanca y a pleno sol, se lee casi como un cilindro macizo aunque tiene cubeta. Y el follaje del olivo de la terraza es escaso. Son detalles de modelado que en un encargo real se pulen en la ronda de cambios.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Qué es real y qué es estimado',
        body: villa.notice.es,
      },
      {
        type: 'embedCode',
        h2: '¿Puedo poner este visor en mi web?',
        intro: 'Sí: es un iframe. Copia este código y pégalo en tu web; con tu vivienda te entregamos el mismo código apuntando a tu modelo. Funciona igual en una ficha de propiedad, en la web de una promoción o en una landing. Más detalles en el [visor 3D para anuncios](@servicio-tour).',
      },
      {
        type: 'ar',
        h2: 'Ábrela en realidad aumentada',
        intro: 'En iPhone o iPad se abre con [AR Quick Look](@glosario#ar-quick-look); en Android, con [Scene Viewer](@glosario#scene-viewer). Elige la maqueta 1:20 para ponerla sobre la mesa o el tamaño real para recorrerla. En un ordenador, escanea el código QR con el móvil. Así funciona nuestra [realidad aumentada sin app](@servicio-ar); si no se abre, sigue [cómo ver una vivienda en realidad aumentada paso a paso](@guia-ar).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Es una villa real?',
        a: 'Sí. Partimos de la planta publicada de una villa real de la Costa del Sol, pero el caso está anonimizado: no mostramos el plano original, ni la dirección, ni el anuncio, ni la agencia. {{brand}} redibujó la planta desde su propio modelo. Las superficies son estimaciones a escala (≈) y parte del mobiliario es interpretación nuestra.',
      },
      {
        q: '¿Cuánto costaría un modelo 3D como este?',
        a: 'Un modelo así entra en la maqueta 3D completa de {{brand}}: {{price:maqueta}} + IVA para viviendas de hasta 150 m², con 6 renders en 4K, visor web, realidad aumentada y {{revisions:maqueta}}, en {{delivery:maqueta}}. Cada render por encima de los 6 incluidos cuesta {{extra:render}} + IVA. Todas las tarifas están en [precios](@precios).',
      },
      {
        q: '¿Cuánto se tardó en hacer?',
        a: 'El modelado, las texturas y la exportación se hicieron en una sola sesión de trabajo, y las {{villa:renders}} imágenes del caso (6 vistas, las dos plantas y la imagen para redes) se calcularon en unos {{villa:renderMinutes}} minutos en total. Un encargo real de {{brand}} lleva {{delivery:maqueta}} porque incluye tu revisión: te enviamos el visor en un enlace privado y aplicamos {{revisions:maqueta}} antes de la entrega.',
      },
      {
        q: '¿Son exactas las superficies que aparecen en el visor?',
        a: 'No, y lo indicamos con ≈. El plano de esta villa no traía cotas, así que {{brand}} midió sobre su escala: los {{villa:interiorM2}} m² interiores y los {{villa:terracesM2}} m² de terrazas son estimaciones. Con un plano acotado o un DWG, el modelo respeta las medidas del proyecto. En un anuncio, publica siempre la superficie oficial, no la del modelo.',
      },
      {
        q: '¿Puedo ver esta villa en realidad aumentada en mi móvil?',
        a: 'Sí. En iPhone o iPad, pulsa «Ver en tu salón» en Safari y se abre con AR Quick Look; en Android, con Scene Viewer en móviles compatibles con ARCore. Puedes elegir la maqueta 1:20 sobre la mesa, de {{file:usdzMesa}} en iPhone, o la vivienda a tamaño real. Desde un ordenador, {{brand}} muestra un código QR.',
      },
      {
        q: '¿Podría ver esta villa con otro estilo de muebles?',
        a: 'Sí, sin rehacer la vivienda: el [home staging virtual](@servicio-staging) se aplica sobre el mismo modelo, por {{extra:staging}} + IVA por estancia, y el cambio aparece a la vez en los renders, el visor y la realidad aumentada. {{brand}} crea los materiales por código, así que cambiar el parqué o el color de un sofá es ajustar un valor.',
      },
      {
        q: '¿Por qué solo la planta alta?',
        a: 'Porque la planta publicada que usamos era esa. {{brand}} modeló lo que el plano define y no inventó la planta baja ni la fachada, que habría tenido que suponer. En un encargo real modelamos todas las plantas que nos envíes; el precio depende de la superficie total y te lo damos cerrado al ver los planos.',
      },
      {
        q: '¿Puedo enseñar esta villa a mis clientes como ejemplo?',
        a: 'Sí, puedes enseñarles esta página o el visor para que vean qué recibirían. Ten en cuenta que no es una vivienda en venta: es una demostración anonimizada de {{brand}}, sin precio, ubicación ni agencia. Si quieres lo mismo con una vivienda de tu cartera, pide la demo gratis y modelamos una estancia de tu plano.',
      },
    ],
    related: ['servicio-tour', 'servicio-ar', 'servicio-renders', 'precios', 'como-funciona'],
    cta: {
      h2: 'Quiero esto para mi promoción',
      body: 'Mismo proceso, con tu plano: modelo 3D amueblado, renders, visor para tu anuncio y realidad aumentada, desde {{price:maqueta}} + IVA y en {{delivery:maqueta}}. Empezamos, si quieres, con una estancia gratis.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'Costa del Sol villa in 3D: a floor plan case study',
    description: 'Case study: a Costa del Sol villa modelled in 3D from a single floor plan, with no photos: {{villa:rooms}} furnished rooms, renders, web viewer and AR.',
    h1: 'Costa del Sol villa: from 2D floor plan to 3D',
    lead: '{{brand}} modelled the upper floor of a Costa del Sol villa in 3D from {{villa:input}}. The result: {{villa:rooms}} furnished rooms across about {{villa:interiorM2}} m², renders, a web viewer and augmented reality. It is our anonymised demonstration case, and a project like it starts at {{price:maqueta}} + VAT.',
    heroLead: 'A real Costa del Sol villa, modelled in 3D from a single 2D floor plan. Spin it here.',
    breadcrumb: 'Costa del Sol villa',
    card: {
      title: 'Case study: Costa del Sol villa',
      summary: 'A villa modelled from a single floor plan, with no photos: figures, renders, viewer, augmented reality and the limits of the case.',
    },
    facts: [
      ['Input', 'One published 2D plan, no photos or dimensions'],
      ['Scope', 'Upper floor of a villa, with two terraces'],
      ['Floor area', '≈ {{villa:interiorM2}} m² indoors and ≈ {{villa:terracesM2}} m² of terraces'],
      ['Rooms', '{{villa:rooms}}, including {{villa:bedrooms}} bedrooms'],
      ['Images', '{{villa:renders}} in about {{villa:renderMinutes}} minutes of compute in total'],
      ['Web model', '{{file:glb}}, with guided tour and cut-away mode'],
      ['Augmented reality', 'iPhone, iPad and Android: 1:20 and real size'],
      ['Work', 'A single session, from plan to export'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What did we do with this villa?',
        answer: '{{brand}} modelled the upper floor of a Costa del Sol villa in 3D from {{villa:input}}. The result: {{villa:rooms}} furnished rooms across about {{villa:interiorM2}} m², renders, a web viewer and augmented reality. It is our anonymised demonstration case, and a project like it starts at {{price:maqueta}} + VAT.',
      },
      {
        type: 'answer',
        h2: 'Why start from a floor plan rather than photos?',
        answer: 'Because a floor plan is often all an agent or developer has when there is nothing to photograph: an off-plan unit, an empty home or a villa your buyer cannot fly out to see. We chose the hardest case, a published plan with not one interior photo and no dimensions. Everything on this page comes from that plan.',
        body: 'The viewer above holds the actual model: orbit the villa, step into each room, switch on [cut-away mode](@glosario#modo-maqueta) to slice the walls at {{villa:cutHeight}} m, or raise them to their full {{villa:wallHeight}} m. It is exactly what your buyer would get by link or embedded on your website.',
      },
      {
        type: 'specs',
        h2: 'The villa in numbers',
        items: [
          ['Starting point', 'One 2D floor plan published by a third party, with no interior photos or dimensions'],
          ['Scope', 'The full upper floor, with two terraces'],
          ['Model footprint', '{{villa:footprint}}'],
          ['Interior floor area', '≈ {{villa:interiorM2}} m², estimated from the plan’s scale'],
          ['Terraces', '≈ {{villa:terracesM2}} m², across two terraces'],
          ['Rooms', '{{villa:rooms}}, counting terraces, stairs and laundry'],
          ['Bedrooms', '{{villa:bedrooms}}'],
          ['Bathrooms', '2: the en-suite, with a tub and rain shower, and a family bathroom'],
          ['Procedural PBR textures', '{{villa:textures}}, created for this model'],
          ['Materials', '{{villa:materials}}'],
          ['Triangles', '{{villa:triangles}}'],
          ['Wall height', '{{villa:wallHeight}} m; cut-away at {{villa:cutHeight}} m'],
          ['Images', '{{villa:renders}}: 6 views, top-down plan, line plan and social image; about {{villa:renderMinutes}} minutes of Cycles in total'],
          ['Web model', '{{file:glb}}, GLB with Meshopt compression and WebP textures'],
          ['AR on iPhone', '{{file:usdzMesa}} for the 1:20 tabletop model and {{file:usdzReal}} at real size (USDZ)'],
          ['AR on Android', '{{file:glbArMesa}} for the 1:20 tabletop model and {{file:glbAr}} at real size (GLB)'],
          ['Working time', 'A single session: modelling, texturing and export'],
        ],
      },
      {
        type: 'gallery',
        h2: 'The villa’s renders',
        intro: 'The case’s {{villa:renders}} images (6 views, the top-down plan, the line plan and the social media image) were computed in Cycles in about {{villa:renderMinutes}} minutes in total, under the same Mediterranean late-afternoon light. None is a photo or an AI-generated picture. The 6 views are shown here; both plans are in the comparison slider below. This is how we approach [real estate 3D rendering](@servicio-renders).',
        items: [
          { image: 'villa_maqueta_iso', alt: 'Cut-away 3D model of the villa’s upper floor at {{villa:cutHeight}} m, three-quarter aerial view with furnished rooms. 3D render of the anonymised Costa del Sol villa.', caption: 'Cut-away model at {{villa:cutHeight}} m, three-quarter aerial view. 3D render.' },
          { image: 'villa_salon_dormitorio', alt: '3D render of the living room with a corner sofa and the main bedroom of the anonymised villa, in late-afternoon light.', caption: 'Living room and main bedroom. 3D render.' },
          { image: 'villa_dormitorios', alt: '3D render of the bedroom wing and family bathroom of the anonymised villa, with the lawn terrace and spiral staircase.', caption: 'Bedroom wing and family bathroom. 3D render.' },
          { image: 'villa_bano_suite', alt: '3D render of the anonymised villa’s en-suite bathroom, with a round freestanding tub, black porcelain tiles and a terrazzo wall.', caption: 'En-suite bathroom with freestanding tub. 3D render.' },
          { image: 'villa_terraza', alt: '3D render of the anonymised villa’s main terrace, with a terracotta floor, two sun loungers, an outdoor sofa and a potted olive tree.', caption: 'Main terrace with sun loungers and an olive tree. 3D render.' },
          { image: 'villa_muros_completos', alt: '3D render of the anonymised villa with walls at their full {{villa:wallHeight}} m height, three-quarter exterior aerial view.', caption: 'Full-height walls at {{villa:wallHeight}} m. 3D render.' },
        ],
      },
      {
        type: 'video',
        video: 'villa-turntable',
        h2: 'What does the model look like in motion?',
        caption: 'One camera orbit around the model, cut away at {{villa:cutHeight}} m, under the same light as the renders. 3D animation computed in Cycles, with no sound; it is not filmed footage.',
      },
      {
        type: 'compare',
        h2: 'The floor plan, redrawn and in colour',
        intro: 'The original plan belongs to a third party and we do not publish it. On the left is the 2D plan redrawn from our model; on the right, the colour top-down render. Both come from the same orthographic camera, and the outlines match within ±3 px, the width of the line.',
      },
      {
        type: 'steps',
        h2: 'How was it made, step by step?',
        intro: 'The real sequence of work, done in a single session. We only give times where we measured them: we did not time each stage separately, so we are not going to invent hours. The standard process and its timings are in [how we run a project](@como-funciona).',
        items: [
          {
            title: 'Reading the plan',
            body: 'We started from the villa’s published floor plan. With no dimensions, we set the scale from the plan itself and measured every wall and opening against it. We noted what the plan leaves out: heights, joinery and floor finishes.',
          },
          {
            title: 'Modelling by script',
            body: 'A Python script builds the {{villa:wallHeight}} m walls in Blender, along with the partitions, openings, doors and windows, the stairs down to the ground floor and the spiral staircase on the terrace. Because the geometry comes from data, moving a partition means changing a figure and running it again. It is the same method behind our [floor plan to 3D model service](@servicio-plano).',
          },
          {
            title: 'Furniture and materials',
            body: 'We furnished all {{villa:rooms}} rooms according to what the plan shows and created {{villa:textures}} [procedural textures](@glosario#textura-procedural): terracotta, terrazzo, black porcelain, timber and artificial lawn, among others. Not one comes from a stock library.',
          },
          {
            title: 'Lighting and renders',
            time: '≈ {{villa:renderMinutes}} min',
            body: 'Mediterranean late-afternoon light: a warm, low sun and a physical sky. [Cycles](@glosario#cycles) computed the {{villa:renders}} images (6 views, both plans and the social media image) in about {{villa:renderMinutes}} minutes in total on an RTX 4060 graphics card, with automatic checks for blown-out pixels and textures that fail to load.',
          },
          {
            title: 'Export for web and augmented reality',
            body: 'We export to [glTF](@glosario#gltf) and an automated pipeline cleans, compresses and validates the model: the web file comes out at {{file:glb}}, under a third of the original export, with the same {{villa:triangles}} triangles and {{villa:materials}} materials. After a change, we simply run that pipeline again, with no manual clean-up. We also produce the [USDZ](@glosario#usdz) files for iPhone and the [GLB](@glosario#glb) files for Android.',
          },
          {
            title: 'Viewer and checks',
            body: 'We set up the viewer with [model-viewer](@glosario#model-viewer): room list, guided tour, lighting control and the cut at {{villa:cutHeight}} m. We tested it on a throttled connection: the still image appears first and the model only downloads on tap.',
          },
        ],
      },
      {
        type: 'answer',
        h2: 'What would change with photos or a dimensioned plan?',
        answer: 'Precision and finishes. With a dimensioned plan or a DWG, floor areas would stop being estimates (≈) and the model would follow every dimension. With interior photos, we would reproduce the real floors, kitchen and bathrooms instead of interpreting them. The process and the turnaround would stay the same.',
        body: 'Here the plan had no dimensions: we measured from its scale, so the model’s measurements may differ from the built villa. Some of the furniture is also our interpretation, because a listing plan only draws outlines. None of that matters for showing layout, light and how each room works; it would matter if you were ordering fitted wardrobes, which is why we say so.\n\nThere are also two modelling limits the render does not hide. The white freestanding tub, in full sun, reads almost as a solid cylinder even though it has a basin. And the olive tree on the terrace is sparse. These are modelling details that a real project polishes in the round of changes.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'What is real and what is estimated',
        body: villa.notice.en,
      },
      {
        type: 'embedCode',
        h2: 'Can I put this viewer on my website?',
        intro: 'Yes: it is an iframe. Copy this code and paste it into your site; for your property we deliver the same code pointing at your model. It works the same on a property page, a development website or a landing page. More on our [interactive 3D floor plans](@servicio-tour).',
      },
      {
        type: 'ar',
        h2: 'Open it in augmented reality',
        intro: 'On iPhone or iPad it opens in [AR Quick Look](@glosario#ar-quick-look); on Android, in [Scene Viewer](@glosario#scene-viewer). Choose the 1:20 model to place it on a table, or real size to walk through it. On a computer, scan the QR code with your phone. This is how our [app-free AR](@servicio-ar) works; if it does not open, follow [how to view a property in AR, step by step](@guia-ar).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'Is this a real villa?',
        a: 'Yes. We started from the published floor plan of a real villa on the Costa del Sol, but the case is anonymised: we show neither the original plan, nor the address, the listing or the agency. {{brand}} redrew the plan from its own model. Floor areas are estimates from the plan’s scale (≈), and some of the furniture is our interpretation.',
      },
      {
        q: 'How much would a 3D model like this cost?',
        a: 'A model like this falls under the {{brand}} complete 3D model: {{price:maqueta}} + VAT for homes up to 150 m², with 6 renders in 4K, a web viewer, augmented reality and {{revisions:maqueta}}, delivered in {{delivery:maqueta}}. Each render beyond the 6 included costs {{extra:render}} + VAT. Every rate is on our [pricing page](@precios).',
      },
      {
        q: 'How long did it take?',
        a: 'Modelling, texturing and export were done in a single work session, and the case’s {{villa:renders}} images (6 views, both plans and the social media image) took about {{villa:renderMinutes}} minutes to compute in total. A real {{brand}} project takes {{delivery:maqueta}} because it includes your review: we send you the viewer on a private link and apply {{revisions:maqueta}} before delivery.',
      },
      {
        q: 'Are the floor areas in the viewer exact?',
        a: 'No, and we mark them with ≈. This villa’s plan had no dimensions, so {{brand}} measured from its scale: the {{villa:interiorM2}} m² indoors and {{villa:terracesM2}} m² of terraces are estimates. With a dimensioned plan or a DWG, the model follows the project’s measurements. In a listing, always publish the official floor area, not the model’s.',
      },
      {
        q: 'Can I view this villa in augmented reality on my phone?',
        a: 'Yes. On iPhone or iPad, tap “View in your room” in Safari and it opens in AR Quick Look; on Android, it opens in Scene Viewer on ARCore-compatible phones. You can choose the 1:20 tabletop model, {{file:usdzMesa}} on iPhone, or the home at real size. On a computer, {{brand}} shows a QR code instead.',
      },
      {
        q: 'Could I see this villa in a different furniture style?',
        a: 'Yes, without rebuilding the home: [virtual staging](@servicio-staging) is applied to the same model, at {{extra:staging}} + VAT per room, and the change shows up at once in the renders, the viewer and the AR. {{brand}} creates materials in code, so changing the flooring or the colour of a sofa means adjusting a value.',
      },
      {
        q: 'Why only the upper floor?',
        a: 'Because that was the floor plan published. {{brand}} modelled what the plan defines and did not invent a ground floor or a façade, which would have meant guessing. On a real project we model every floor you send us; the price depends on the total floor area, and we fix it once we see the plans.',
      },
      {
        q: 'Can I show this villa to my clients as an example?',
        a: 'Yes, show them this page or the viewer so they can see what they would get. Bear in mind it is not a property for sale: it is an anonymised {{brand}} demonstration, with no price, location or agency. If you want the same for a property on your books, ask for the free demo and we will model one room of your plan.',
      },
    ],
    related: ['servicio-tour', 'servicio-ar', 'servicio-renders', 'precios', 'como-funciona'],
    cta: {
      h2: 'I want this for my development',
      body: 'Same process, with your plan: a furnished 3D model, renders, a viewer for your listing and augmented reality, from {{price:maqueta}} + VAT in {{delivery:maqueta}}. If you like, we start with one room for free.',
      service: 'maqueta',
    },
  },
};
