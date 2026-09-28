// Flagship GEO guide: generative AI vs a real, code-built 3D model (ES + EN).
// Answers the ChatGPT People Also Ask questions honestly. Facts re-verified with WebFetch / BOE on 2026-09-28:
// EU AI Act art. 3(60), 50 and 113 (BOE DOUE-L-2024-81079), Blender /about, Planner 5D AI page, Pedra pricing,
// Vista Studio packs. Villa figures come from build/data/villa.mjs tokens; our prices only from tokens.

const SRC = {
  aiActEs: 'https://www.boe.es/buscar/doc.php?id=DOUE-L-2024-81079',
  aiActEn: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  blender: 'https://www.blender.org/about/',
  p5d: 'https://planner5d.com/ai/floor-plan-to-3d-model',
  pedraEs: 'https://pedra.ai/es/pricing',
  vista: 'https://vistastudiodesign.com/',
};

export default {
  id: 'guia-ia-vs-3d',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: '¿Puede la IA convertir un plano en 3D? Guía 2026',
    description: 'La IA convierte un plano en una imagen 3D en segundos, pero no en un modelo con medidas. Qué hace ChatGPT, qué no y cómo usamos la IA con Blender.',
    h1: '¿Puede la IA convertir un plano en 3D? IA vs modelo real',
    lead: 'Sí, pero en imagen. La IA generativa, como ChatGPT o Gemini, convierte un plano en una imagen con aspecto 3D; no crea un modelo medible, coherente entre vistas ni apto para realidad aumentada. {{brand}} usa la IA para escribir el código que construye ese modelo en Blender, desde {{price:maqueta}} + IVA en {{delivery:maqueta}}.',
    breadcrumb: 'IA o modelo 3D',
    card: {
      title: '¿Puede la IA convertir un plano en 3D?',
      summary: 'Qué hacen ChatGPT y los conversores con IA, qué no pueden hacer y dónde encaja un modelo 3D construido con código.',
    },
    facts: [
      ['IA generativa', 'Imágenes con aspecto 3D, sin medidas'],
      ['Conversor con IA', 'Modelo básico que hay que revisar'],
      ['Modelo 3D con código', 'Geometría a escala, exportable a GLB y USDZ'],
      ['Coherencia entre vistas', 'Solo garantizada con un modelo'],
      ['IA en nuestro flujo', 'Escribe y corrige los scripts de Blender'],
      ['Revisión humana', 'Cada muro y cada hueco contra el plano'],
      ['Imágenes virtuales', 'Siempre etiquetadas como tales'],
      ['Maqueta 3D en {{brand}}', 'Desde {{price:maqueta}} + IVA'],
    ],
    hero: {
      image: 'villa_maqueta_iso_opaco',
      alt: 'Maqueta 3D seccionada de la villa anonimizada de la Costa del Sol, render de un modelo construido con código a partir de su plano 2D',
      caption: 'Render de un modelo 3D construido con scripts de Python en Blender desde un único plano 2D. Caso demostrativo de {{brand}}.',
    },
    blocks: [
      {
        type: 'answer',
        h2: '¿Puede la IA convertir un plano en 3D?',
        answer: 'Depende de qué entiendas por 3D. La IA generativa convierte un plano en una imagen con aspecto 3D en segundos, y los conversores con IA levantan un modelo básico que hay que revisar. Ninguna de las dos garantiza hoy un modelo a escala, amueblado y coherente en todas las vistas, que es lo que necesita un anuncio o una venta sobre plano.',
        body: 'La diferencia de fondo es entre **píxeles** y **geometría**. Una imagen generada es una cuadrícula de colores que parece una vivienda: no sabe cuánto mide el salón ni qué hay al otro lado de la pared. Un modelo 3D es un conjunto de muros, huecos y superficies con coordenadas reales. De él se saca cualquier vista, se mide una estancia o se exporta un archivo [GLB](@glosario#glb) o [USDZ](@glosario#usdz) para verlo en realidad aumentada.\n\nEsta guía responde a las preguntas que la gente hace a los buscadores y a los asistentes de IA sobre ChatGPT y planos, con lo que sabemos por construir nuestro propio flujo de trabajo, que combina IA y geometría.',
      },
      {
        type: 'answer',
        h2: '¿Puede ChatGPT generar un plano de planta?',
        answer: 'Puede dibujar una imagen de un plano, describir una distribución e incluso escribir código que la dibuje. Lo que no hace es garantizar medidas: un plano generado puede tener tabiques imposibles, puertas que no abren o superficies que no suman. Sirve para una idea inicial, no para vender una vivienda concreta ni para tramitar una obra.',
        body: 'Si la vivienda ya existe, su plano no hay que inventarlo: está en la documentación de la propiedad o lo redibuja un técnico. Si es un proyecto nuevo, lo firma un arquitecto. En los dos casos la IA puede ayudar a ordenar ideas, pero el plano de referencia sale de una persona que responde por él.',
      },
      {
        type: 'answer',
        h2: '¿Puede ChatGPT hacer renders arquitectónicos?',
        answer: 'Puede crear imágenes con aspecto de render a partir de un texto, un plano o una foto, y algunas son muy convincentes. El problema es la coherencia: cada imagen se genera por separado, así que la segunda vista del mismo salón puede mover una ventana, cambiar la altura del techo o añadir un pilar. Para vender una vivienda concreta, eso es un riesgo.',
        body: 'Para una imagen de ambiente o una propuesta de estilo, la IA generativa es rápida y barata. Para un [render](@glosario#render) que el comprador va a comparar con el plano, con la vivienda real o con el resto del dosier, necesitas que todas las imágenes salgan de la misma geometría. Es lo que da un modelo: seis cámaras sobre el mismo salón producen seis imágenes que coinciden entre sí.',
      },
      {
        type: 'answer',
        h2: '¿Hace ChatGPT home staging virtual?',
        answer: 'Puede redecorar la foto de una estancia y cambiar muebles, colores o estilo en segundos. Pero al regenerar la imagen puede alterar lo que no debería tocar, como ventanas, puertas, suelos o la luz real de la habitación. Si publicas el resultado, revisa cada foto contra la original y etiquétala como recreación virtual.',
        body: 'El [home staging virtual sobre el modelo 3D](@servicio-staging) funciona al revés: la arquitectura está fijada por la geometría y solo cambian muebles y materiales. Por eso el mismo estilo se ve igual en todos los renders, en el visor y en la realidad aumentada, y sirve también para obra nueva, donde no hay fotos que redecorar.',
      },
      {
        type: 'answer',
        h2: '¿Puede ChatGPT crear un modelo 3D?',
        answer: 'No de forma directa y fiable para una vivienda completa, amueblada y a escala. Lo que sí hace bien un asistente de IA es escribir código: scripts de Python que construyen muros, huecos y materiales dentro de un programa 3D como Blender. Ahí la IA acelera mucho el trabajo, siempre que una persona revise el resultado contra el plano.',
        body: 'También hay modelos de IA que generan una malla 3D a partir de una imagen o de un texto. Están pensados para objetos sueltos, como un mueble o una figura, y no trabajan a partir de las cotas de un plano: no devuelven muros a escala, huecos en su sitio ni superficies que se puedan medir. Para una vivienda, el camino fiable sigue siendo construir la geometría desde el plano.',
      },
      {
        type: 'table',
        h2: '¿Qué diferencia hay entre una imagen de IA y un modelo 3D real?',
        intro: 'Tres tecnologías que a menudo se venden con el mismo nombre. La tabla compara el tipo de resultado, no marcas concretas.',
        caption: 'IA generativa, conversor de planos con IA y modelo 3D construido con código (septiembre de 2026)',
        head: ['Criterio', 'IA generativa de imágenes', 'Conversor de planos con IA', 'Modelo 3D construido con código'],
        rows: [
          ['Qué produce', 'Una imagen (píxeles)', 'Un modelo básico o una imagen desde el plano', 'Geometría a escala: muros, huecos, suelos y muebles'],
          ['Medidas', 'No tiene', 'Aproximadas, según la calidad del plano', 'Tomadas del plano; estimadas (≈) si no hay cotas'],
          ['Coherencia entre vistas', 'No garantizada', 'Dentro de su propio modelo', 'Sí: todas las vistas salen de la misma geometría'],
          ['Obra nueva sin fotos', 'Desde texto o plano, sin garantía de fidelidad', 'Sí', 'Sí'],
          ['Realidad aumentada', 'No', 'Según la herramienta', 'Sí: USDZ para iPhone y GLB para Android, sin app'],
          ['Cambios', 'Se regenera la imagen y puede cambiar todo', 'Se edita dentro de la herramienta', 'Se cambia un dato del script y se reconstruye en minutos'],
          ['Fotorrealismo', 'Alto en una imagen suelta', 'Variable', 'Alto y coherente, con luz física calculada'],
          ['Coste de referencia', 'Gratis o suscripción', 'Menos de 1 € por render en pedra.ai', 'Desde {{price:maqueta}} + IVA en {{brand}}'],
        ],
        note: 'No hemos hecho un test controlado de herramientas. La tabla describe qué tipo de resultado produce cada tecnología y las condiciones que cada proveedor publicaba en septiembre de 2026.',
      },
      {
        type: 'steps',
        h2: '¿Cómo usamos nosotros la IA, y dónde no?',
        intro: 'Usamos IA todos los días, pero no para inventar la vivienda. Así se reparte el trabajo en nuestro flujo, del plano al archivo de realidad aumentada.',
        items: [
          { title: 'Lectura del plano', body: 'Una persona lee el plano, fija la escala con las cotas o con una medida conocida y anota cada estancia. Si faltan medidas, lo decimos y las marcamos como estimadas.' },
          { title: 'Scripts de modelado', body: 'Un asistente de IA (trabajamos con Claude, de Anthropic) escribe y corrige los scripts de Python que levantan en Blender muros, huecos, puertas y ventanas a partir de esas medidas. La IA acelera el código; no decide dónde va un muro.' },
          { title: 'Revisión contra el plano', body: 'Una persona compara el modelo con el plano, muro a muro y hueco a hueco. Si algo no cuadra, se corrige el dato de entrada y el script reconstruye la geometría.' },
          { title: 'Materiales y mobiliario', body: 'Los materiales son texturas [PBR](@glosario#pbr) procedurales escritas como código, sin bancos de imágenes: para la villa de nuestro caso creamos {{villa:textures}}. Cada mueble se coloca a su tamaño real.' },
          { title: 'Render y exportación', body: 'Cycles calcula los renders con luz física y el modelo se exporta a GLB para la web y Android, y a USDZ para iPhone y iPad. En la villa, los {{villa:renders}} renders tardaron {{villa:renderMinutes}} minutos en total en una tarjeta RTX 4060.' },
        ],
      },
      {
        type: 'prose',
        h2: '¿Qué sale de un modelo que no sale de una imagen?',
        body: 'Nuestro [caso demostrativo](@caso-villa) es una villa en la Costa del Sol construida desde un único plano 2D, sin fotos del interior ni cotas. El modelo tiene {{villa:rooms}} estancias con su superficie estimada, {{villa:triangles}} triángulos y {{villa:materials}} materiales. De esa geometría salieron, en una sola sesión de trabajo:\n\n- 6 renders coherentes entre sí y una imagen para redes.\n- La planta cenital a color y la planta 2D redibujada.\n- Un [visor web](@servicio-tour) con lista de estancias, recorrido guiado y [modo maqueta](@glosario#modo-maqueta), que corta los muros a {{villa:cutHeight}} m.\n- Archivos de [realidad aumentada](@servicio-ar) para ver la villa sobre la mesa a escala 1:20 o a tamaño real.\n\nNinguna de esas salidas se puede obtener de una imagen generada. Lo puedes comprobar en el [visor del caso](@caso-villa#visor).',
      },
      {
        type: 'answer',
        h2: '¿Va a sustituir la IA al render 3D?',
        answer: 'La IA ya sustituye parte del trabajo: imágenes de ambiente, redecoración de fotos y renders baratos de viviendas que existen. Lo que no sustituye es la geometría de referencia cuando alguien compra por metros y por distribución. Nuestra apuesta es combinar las dos cosas: la IA escribe el código y el modelo pone las medidas.',
        body: 'Por eso los vídeos cinematográficos generados con IA a partir de nuestros renders, que llegarán próximamente, partirán de un modelo coherente y no de fotos sueltas, y se etiquetarán como contenido generado con IA.',
      },
      {
        type: 'answer',
        h2: '¿Hay que avisar de que una imagen está hecha con IA?',
        answer: 'Sí, y con base legal. El Reglamento europeo de inteligencia artificial obliga a quien publica imágenes generadas o manipuladas con IA que se parecen a lugares u objetos reales y pueden pasar por auténticas a decir que son artificiales. El Reglamento es aplicable con carácter general desde el 2 de agosto de 2026. En inmobiliaria, lo prudente es etiquetar siempre.',
        body: 'La obligación está en el [artículo 50 del Reglamento (UE) 2024/1689](' + SRC.aiActEs + '), que llama «ultrasuplantación» a ese tipo de contenido. Una foto de un piso redecorada con IA puede encajar en esa definición. Esto no es asesoramiento jurídico: si tienes dudas sobre un caso concreto, consúltalo con tu asesor.\n\nEn {{brand}} etiquetamos cada render como render y cada estancia amueblada virtualmente como recreación virtual, se haya usado IA o no.',
      },
      {
        type: 'table',
        h2: '¿Qué opción usar según lo que necesitas?',
        caption: 'IA o modelo 3D según el objetivo',
        head: ['Necesitas', 'Opción razonable', 'Por qué'],
        rows: [
          ['Una idea de estilo para una reunión', 'IA generativa', 'Segundos, y nadie compra por esa imagen'],
          ['Redecorar fotos de un piso que ya existe', 'Staging con IA sobre fotos, revisado y etiquetado', 'Barato y rápido si las fotos son buenas'],
          ['Ver una distribución en 3D para ti', 'Conversor con IA o [programa gratuito](@guia-plano-2d-3d)', 'Minutos u horas, sin coste'],
          ['Vender obra nueva sin fotos', '[Modelo 3D desde el plano](@servicio-plano)', 'Da renders coherentes, visor y AR sin que la vivienda exista'],
          ['Un comprador que vive fuera y no puede visitar', 'Modelo 3D con visor y realidad aumentada', 'Recorre la vivienda y la ve a tamaño real desde su móvil'],
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Somos parte interesada',
        body: 'Construimos modelos 3D, así que nos interesa que una imagen no te baste. Por eso decimos también cuándo la IA es suficiente, usamos la IA en nuestro propio trabajo y no inventamos pruebas que no hemos hecho. Los precios de terceros enlazan a la página que los publica.',
      },
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'BOE: Reglamento (UE) 2024/1689 de inteligencia artificial, artículos 3, 50 y 113', url: SRC.aiActEs, note: 'Definición de «ultrasuplantación» (art. 3.60), obligaciones de transparencia (art. 50) y aplicación (art. 113).' },
          { label: 'Blender: acerca de Blender', url: SRC.blender, note: 'Software libre, uso comercial permitido.' },
          { label: 'Planner 5D: plano a modelo 3D con IA', url: SRC.p5d, note: 'Consultado el 28 sep 2026.' },
          { label: 'pedra.ai: planes y precios', url: SRC.pedraEs, note: 'Plano a 3D: 2 créditos por render, plan de 29 €/mes con 100 créditos. Consultado el 28 sep 2026.' },
          { label: 'vistastudiodesign.com: packs y precios', url: SRC.vista, note: 'Renders y vídeos con IA a partir de fotos. Consultado el 28 sep 2026.' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué IA puede generar planos 3D?',
        a: 'Hay conversores con IA, como el reconocimiento de planos de Planner 5D, que levantan un modelo 3D desde la imagen del plano, y plataformas como pedra.ai que lo convierten en un render por 2 créditos. La IA generativa de chat crea imágenes, no modelos. {{brand}} usa la IA para escribir el código del modelo y lo revisa contra el plano, desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Qué IA genera renders?',
        a: 'Los asistentes generales, como ChatGPT o Gemini, y herramientas específicas para inmobiliaria generan imágenes con aspecto de render a partir de texto, planos o fotos. Son rápidas y baratas, pero cada imagen se genera por separado y no garantiza la geometría. {{brand}} calcula sus renders con Cycles sobre un modelo 3D real: 6 van incluidos en la maqueta desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Cuál es la mejor IA para inmobiliarias?',
        a: 'Depende de la tarea. Para textos de anuncios y respuestas, un asistente general. Para redecorar fotos de una vivienda que existe, una herramienta de staging con IA, revisando cada imagen. Para obra nueva o para que todas las vistas coincidan, ninguna IA sustituye hoy a un modelo 3D desde el plano, que {{brand}} entrega con renders, visor y realidad aumentada en {{delivery:maqueta}}.',
      },
      {
        q: '¿Hay inteligencia artificial gratuita para inmobiliarias?',
        a: 'Sí: muchos asistentes y herramientas de imagen tienen versión gratuita o de prueba, y Planner 5D ofrece una prueba gratuita de su conversor de planos. Sirven para ideas y borradores. Para publicar, revisa el resultado y etiquétalo como imagen virtual. Si necesitas un modelo 3D a escala, {{brand}} modela gratis una estancia de tu plano como demo, con realidad aumentada.',
      },
      {
        q: '¿Usa {{brand}} inteligencia artificial?',
        a: 'Sí, para escribir y corregir código. Un asistente de IA genera los scripts de Python que construyen el modelo en Blender, y una persona revisa cada muro y cada hueco contra el plano. La IA no inventa la vivienda ni sus medidas. {{brand}} entrega el modelo con renders, visor web y realidad aumentada desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
      },
      {
        q: '¿Es más barato un render hecho con IA?',
        a: 'Sí, bastante. Un render con IA a partir de un plano cuesta menos de 1 € en una suscripción como la de pedra.ai, y un pack de renders con IA desde fotos, 129 € sin IVA por inmueble en vistastudiodesign.com. A cambio no hay modelo 3D, visor ni realidad aumentada, y las vistas no siempre coinciden. La maqueta de {{brand}} cuesta desde {{price:maqueta}} + IVA con todo eso incluido.',
      },
      {
        q: '¿Puede la IA leer las medidas de un plano?',
        a: 'Puede leer cotas escritas en un plano limpio y ayudar a transcribirlas, pero con planos escaneados, fotos de folletos o cotas pequeñas se equivoca con facilidad, así que cualquier medida debe comprobarse. En {{brand}} una persona fija la escala y verifica las medidas antes de modelar; si el plano no trae cotas, las superficies se marcan como estimadas (≈).',
      },
      {
        q: '¿Se puede ver en realidad aumentada una imagen hecha con IA?',
        a: 'No. La realidad aumentada necesita un modelo 3D con geometría y materiales, en formato USDZ para iPhone y iPad o GLB para Android, y una imagen es plana. Por eso {{brand}} construye primero el modelo: de él salen los renders y los archivos para ver la vivienda sobre la mesa a escala 1:20 o a tamaño real, sin instalar ninguna app.',
      },
    ],
    related: ['servicio-plano', 'guia-plano-2d-3d', 'servicio-staging', 'caso-villa', 'como-funciona'],
    cta: {
      h2: 'Compruébalo con tu propio plano',
      body: 'Envíanos el plano y modelamos gratis una estancia en 3D, con realidad aumentada, para que veas la diferencia con una imagen de IA.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'Can AI turn a floor plan into 3D? An honest 2026 guide',
    description: 'Generative AI turns a floor plan into a 3D-looking image in seconds, not a measurable model. What ChatGPT can and can’t do, and how we use AI with Blender.',
    h1: 'Can AI turn a floor plan into a 3D model?',
    lead: 'Yes, but only as a picture. Generative AI such as ChatGPT or Gemini turns a floor plan into a 3D-looking image; it does not create a measurable model, consistent views or AR support. {{brand}} uses AI to write the code that builds that model in Blender, from {{price:maqueta}} + VAT in {{delivery:maqueta}}.',
    breadcrumb: 'AI or a real 3D model',
    card: {
      title: 'Can AI turn a floor plan into 3D?',
      summary: 'What ChatGPT and AI floor plan converters can and cannot do, and where a code-built 3D model fits.',
    },
    facts: [
      ['Generative AI', '3D-looking images, no measurements'],
      ['AI floor plan converter', 'A basic model that needs checking'],
      ['Code-built 3D model', 'To-scale geometry, exports to GLB and USDZ'],
      ['Consistent views', 'Only guaranteed with a model'],
      ['AI in our workflow', 'Writes and fixes the Blender scripts'],
      ['Human check', 'Every wall and opening against the plan'],
      ['Virtual images', 'Always labelled as virtual'],
      ['{{brand}} complete 3D model', 'From {{price:maqueta}} + VAT'],
    ],
    hero: {
      image: 'villa_maqueta_iso_opaco',
      alt: 'Cut-away 3D model of the anonymised Costa del Sol villa, a render of a model built with code from its 2D floor plan',
      caption: 'Render of a 3D model built with Python scripts in Blender from a single 2D floor plan. {{brand}} demonstration case.',
    },
    blocks: [
      {
        type: 'answer',
        h2: 'Can I use an AI to convert my floor plan into a 3D model?',
        answer: 'Partly. Generative AI turns a floor plan into a 3D-looking image in seconds, and AI floor plan converters build a basic model you then have to check. Neither currently guarantees a furnished, to-scale model that stays consistent across every view, which is what a listing or an off-plan sale needs.',
        body: 'The underlying difference is **pixels** versus **geometry**. A generated image is a grid of colours that looks like a home: it does not know how big the living room is or what sits behind the wall. A 3D model is a set of walls, openings and surfaces with real coordinates. You can take any view from it, measure a room or export a [GLB](@glosario#glb) or [USDZ](@glosario#usdz) file to see it in augmented reality.\n\nThis guide answers the questions people put to search engines and AI assistants about ChatGPT and floor plans, based on what we have learned building our own workflow, which combines AI with real geometry.',
      },
      {
        type: 'answer',
        h2: 'Can ChatGPT generate a floor plan?',
        answer: 'It can draw a picture of a floor plan, describe a layout and even write code that draws one. What it cannot do is guarantee dimensions: a generated plan may contain impossible partitions, doors that cannot open or room areas that do not add up. It is fine for an early idea, not for marketing a specific property or for planning permission.',
        body: 'If the home already exists, there is no need to invent its plan: it is in the property’s documentation or a surveyor can redraw it. If it is a new project, an architect signs it off. Either way, AI can help you think, but the reference plan comes from a person who is accountable for it.',
      },
      {
        type: 'answer',
        h2: 'Can ChatGPT do architectural renderings?',
        answer: 'It can create render-like images from text, a floor plan or a photo, and some are very convincing. The problem is consistency: each image is generated separately, so a second view of the same living room may move a window, change the ceiling height or add a column. When you are selling a specific home, that is a risk.',
        body: 'For a mood image or a style proposal, generative AI is fast and cheap. For a [render](@glosario#render) that a buyer will compare with the plan, with the finished home or with the rest of the brochure, every image has to come from the same geometry. That is what a model gives you: six cameras in the same living room produce six images that match.',
      },
      {
        type: 'answer',
        h2: 'Does ChatGPT do virtual staging?',
        answer: 'It can restyle a photo of a room, changing furniture, colours or style in seconds. But because it regenerates the image, it may also change what it should leave alone, such as windows, doors, floors or the room’s real light. If you publish the result, check each photo against the original and label it as virtually staged.',
        body: '[Virtual staging on the 3D model](@servicio-staging) works the other way round: the architecture is fixed by the geometry and only furniture and finishes change. That is why a style looks the same in every render, in the viewer and in augmented reality, and why it works for off-plan homes, where there are no photos to restyle.',
      },
      {
        type: 'answer',
        h2: 'Can ChatGPT create a 3D model?',
        answer: 'Not directly or reliably for a whole home that is furnished and to scale. What an AI assistant does well is write code: Python scripts that build walls, openings and materials inside 3D software such as Blender. That is where AI speeds up the work dramatically, as long as a person checks the result against the plan.',
        body: 'There are also AI models that generate a 3D mesh from an image or a prompt. They are designed for single objects, such as a chair or a figurine, and do not work from the dimensions on a floor plan: they do not return to-scale walls, correctly placed openings or measurable rooms. For a home, the dependable route is still to build the geometry from the plan.',
      },
      {
        type: 'table',
        h2: 'What is the difference between an AI image and a real 3D model?',
        intro: 'Three technologies that are often sold under the same name. The table compares the kind of output, not specific brands.',
        caption: 'Generative AI, AI floor plan converters and code-built 3D models compared (September 2026)',
        head: ['Criterion', 'Generative AI image', 'AI floor plan converter', 'Code-built 3D model'],
        rows: [
          ['Output', 'An image (pixels)', 'A basic model or an image from the plan', 'To-scale geometry: walls, openings, floors and furniture'],
          ['Measurements', 'None', 'Approximate, depending on plan quality', 'Taken from the plan; estimated (≈) when it has no dimensions'],
          ['Consistent views', 'Not guaranteed', 'Within its own model', 'Yes: every view comes from the same geometry'],
          ['Off-plan, no photos', 'From a prompt or plan, with no guarantee of accuracy', 'Yes', 'Yes'],
          ['Augmented reality', 'No', 'Depends on the tool', 'Yes: USDZ for iPhone and GLB for Android, no app'],
          ['Changes', 'The image is regenerated and anything may change', 'Edited inside the tool', 'Change one value in the script and it rebuilds in minutes'],
          ['Photorealism', 'High in a single image', 'Variable', 'High and consistent, with physically based light'],
          ['Reference cost', 'Free or subscription', 'Under €1 per render at pedra.ai', 'From {{price:maqueta}} + VAT at {{brand}}'],
        ],
        note: 'We have not run a controlled test of tools. The table describes the type of output each technology produces and the terms each provider published in September 2026.',
      },
      {
        type: 'answer',
        h2: 'Is there an AI tool that can render floor plans?',
        answer: 'Yes. AI floor plan tools turn an image of a plan into a 3D-style render in minutes, for well under €1 per image on a subscription: pedra.ai charges 2 credits per floor-plan-to-3D render on a €29 monthly plan with 100 credits. Planner 5D’s converter accepts images and DXF or DWG files, with one free trial per person.',
        body: 'They are useful for a quick visual. Planner 5D itself notes that image quality affects the result, so check every wall and opening before a render reaches a buyer. For views that match each other and files that open in augmented reality, you still need a model built from the plan.',
      },
      {
        type: 'steps',
        h2: 'How do we use AI, and where do we not?',
        intro: 'We use AI every day, but not to invent the home. This is how the work is split in our workflow, from floor plan to augmented reality file.',
        items: [
          { title: 'Reading the plan', body: 'A person reads the plan, sets the scale from the dimensions or a known measurement and lists every room. Where measurements are missing, we say so and mark them as estimates.' },
          { title: 'Modelling scripts', body: 'An AI assistant (we work with Anthropic’s Claude) writes and fixes the Python scripts that build walls, openings, doors and windows in Blender from those measurements. AI speeds up the code; it does not decide where a wall goes.' },
          { title: 'Checking against the plan', body: 'A person compares the model with the plan, wall by wall and opening by opening. If something is off, the input value is corrected and the script rebuilds the geometry.' },
          { title: 'Materials and furniture', body: 'Materials are procedural [PBR](@glosario#pbr) textures written as code, with no stock libraries: we created {{villa:textures}} for the villa in our case study. Every piece of furniture is placed at its real size.' },
          { title: 'Rendering and export', body: 'Cycles computes the renders with physically based light, and the model is exported to GLB for the web and Android and to USDZ for iPhone and iPad. For the villa, the {{villa:renders}} renders took {{villa:renderMinutes}} minutes in total on an RTX 4060 graphics card.' },
        ],
      },
      {
        type: 'prose',
        h2: 'What do you get from a model that you cannot get from an image?',
        body: 'Our [demonstration case](@caso-villa) is a Costa del Sol villa built from a single 2D floor plan, with no interior photos and no dimensions. The model has {{villa:rooms}} rooms with estimated areas, {{villa:triangles}} triangles and {{villa:materials}} materials. In a single work session, that geometry produced:\n\n- 6 renders that match each other, plus a social media image.\n- The colour top-down plan and the redrawn 2D plan.\n- A [web viewer](@servicio-tour) with a room list, a guided tour and a [cut-away mode](@glosario#modo-maqueta) that slices the walls at {{villa:cutHeight}} m.\n- [Augmented reality](@servicio-ar) files to place the villa on a table at 1:20 scale or at real size.\n\nNone of that can come from a generated image. You can check for yourself in the [case study viewer](@caso-villa#visor).',
      },
      {
        type: 'answer',
        h2: 'Will AI replace 3D rendering?',
        answer: 'AI is already replacing part of the work: mood images, photo restyling and cheap renders of homes that exist. What it does not replace is reference geometry when someone is buying by square metres and layout. Our approach is to combine the two: AI writes the code, and the model supplies the measurements.',
        body: 'That is also why our AI cinematic videos, coming soon, will start from renders of a consistent model rather than from loose photos, and will be labelled as AI-generated content.',
      },
      {
        type: 'answer',
        h2: 'Do AI-generated property images have to be labelled?',
        answer: 'In the EU, increasingly yes. The EU Artificial Intelligence Act requires anyone who publishes AI-generated or AI-manipulated images that resemble real places or objects, and could pass as authentic, to disclose that they are artificial. The Act has applied generally since 2 August 2026. In property marketing, the safe practice is to always label virtual images.',
        body: 'The duty is in [Article 50 of Regulation (EU) 2024/1689](' + SRC.aiActEn + '), which calls this kind of content a “deep fake”. A photo of a flat restyled with AI may fall within that definition. This is not legal advice: for a specific case, check with your adviser.\n\nAt {{brand}}, every render is labelled as a render and every virtually furnished room as a virtual recreation, whether or not AI was involved.',
      },
      {
        type: 'table',
        h2: 'Which option should you use?',
        caption: 'AI or a 3D model, depending on the goal',
        head: ['You need', 'Sensible option', 'Why'],
        rows: [
          ['A style idea for a meeting', 'Generative AI', 'Seconds, and nobody buys on the strength of that image'],
          ['To restyle photos of a flat that already exists', 'AI staging on photos, checked and labelled', 'Cheap and quick if the photos are good'],
          ['To see a layout in 3D for yourself', 'An AI converter or free software', 'Minutes or hours, at no cost'],
          ['To sell an off-plan home with no photos', '[A 3D model from the floor plan](@servicio-plano)', 'Consistent renders, a viewer and AR before the home exists'],
          ['A buyer abroad who cannot visit', 'A 3D model with a viewer and augmented reality', 'They walk through the home and see it at real size on their phone'],
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'We have a stake in this',
        body: 'We build 3D models, so we have an interest in an image not being enough for you. That is why we also say when AI will do, why we use AI in our own work and why we do not claim tests we have not run. Third-party prices link to the page that publishes them.',
      },
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'EUR-Lex: Regulation (EU) 2024/1689 (Artificial Intelligence Act), Articles 3, 50 and 113', url: SRC.aiActEn, note: 'Definition of “deep fake” (Art. 3(60)), transparency obligations (Art. 50) and application dates (Art. 113).' },
          { label: 'Blender: about Blender', url: SRC.blender, note: 'Free and open source, commercial use allowed.' },
          { label: 'Planner 5D: AI floor plan to 3D model', url: SRC.p5d, note: 'Checked 28 Sep 2026.' },
          { label: 'pedra.ai: plans and prices', url: SRC.pedraEs, note: 'In Spanish. Floor plan to 3D: 2 credits per render, €29 monthly plan with 100 credits. Checked 28 Sep 2026.' },
          { label: 'vistastudiodesign.com: packages and prices', url: SRC.vista, note: 'In Spanish. AI renders and videos from photos. Checked 28 Sep 2026.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Which AI can turn a floor plan into 3D?',
        a: 'AI floor plan converters, such as Planner 5D’s plan recognition, build a basic 3D model from an image of the plan, and platforms such as pedra.ai turn it into a render for 2 credits. General chat AI creates images, not models. {{brand}} uses AI to write the code that builds the model and checks it against the plan, from {{price:maqueta}} + VAT.',
      },
      {
        q: 'Which AI tool is best for architectural renders?',
        a: 'For a mood image, general assistants such as ChatGPT or Gemini and dedicated property tools are fast and cheap, but each image is generated separately and the geometry is not guaranteed. For renders a buyer will scrutinise, you need a model. {{brand}} computes its renders with Cycles on a real 3D model, and 6 are included in the complete model from {{price:maqueta}} + VAT.',
      },
      {
        q: 'What is the best AI for estate agents?',
        a: 'It depends on the job. For listing copy and replies, a general assistant. For restyling photos of a home that exists, an AI staging tool, checking every image. For off-plan sales or views that must match, no AI currently replaces a 3D model built from the plan, which {{brand}} delivers with renders, a web viewer and augmented reality in {{delivery:maqueta}}.',
      },
      {
        q: 'Is virtual staging with AI legit?',
        a: 'It is a legitimate marketing tool as long as it is honest: the architecture must stay as it is and the image must be labelled as virtually staged. In the EU, the AI Act also requires disclosure of realistic AI-generated images. {{brand}} stages rooms on the 3D model instead, so walls and windows cannot drift, and labels every furnished room as a virtual recreation.',
      },
      {
        q: 'Does {{brand}} use AI?',
        a: 'Yes, to write and fix code. An AI assistant produces the Python scripts that build the model in Blender, and a person checks every wall and opening against the plan. AI does not invent the home or its measurements. {{brand}} delivers the model with renders, a web viewer and augmented reality from {{price:maqueta}} + VAT, in {{delivery:maqueta}}.',
      },
      {
        q: 'Are AI renders cheaper?',
        a: 'Yes, considerably. An AI render from a floor plan costs under €1 on a subscription such as pedra.ai, and an AI render package from photos costs €129 ex VAT per property at vistastudiodesign.com. In exchange there is no 3D model, viewer or augmented reality, and views do not always match. The {{brand}} complete 3D model costs from {{price:maqueta}} + VAT with all of that included.',
      },
      {
        q: 'Can AI read the dimensions on a floor plan?',
        a: 'It can read dimensions printed on a clean plan and help transcribe them, but with scanned plans, brochure photos or small figures it easily gets them wrong, so every measurement should be checked. At {{brand}}, a person sets the scale and verifies the measurements before modelling; if the plan has no dimensions, areas are marked as estimates (≈).',
      },
      {
        q: 'Can an AI-generated image be viewed in augmented reality?',
        a: 'No. Augmented reality needs a 3D model with geometry and materials, in USDZ format for iPhone and iPad or GLB for Android, and an image is flat. That is why {{brand}} builds the model first: the renders and the files to place the home on a table at 1:20 scale or at real size both come from it, with no app to install.',
      },
    ],
    related: ['servicio-plano', 'servicio-staging', 'guia-precio-render', 'caso-villa', 'como-funciona'],
    cta: {
      h2: 'Try it with your own floor plan',
      body: 'Send us your plan and we will model one room in 3D free of charge, with augmented reality, so you can compare it with an AI image.',
      service: 'maqueta',
    },
  },
};
