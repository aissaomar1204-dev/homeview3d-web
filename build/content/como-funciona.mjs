// How it works (template `process`, HowTo schema from build/data/process.mjs).
// Real pipeline facts come from docs/research/06-3d-ar-pipeline.md and 07-renders.md (measured 2026-09-28):
// Khronos glTF-Validator with 0 errors, material names preserved after optimisation, < 0.002 % clipped pixels
// per render, no black frames, 39 textures loading. Tool links verified with WebFetch on 2026-09-28.

const SRC = {
  blender: 'https://www.blender.org/about/',
  gltf: 'https://www.khronos.org/gltf/',
  mv: 'https://modelviewer.dev/',
};

export default {
  id: 'como-funciona',
  image: 'villa_muros_completos_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Cómo funciona: del plano 2D al modelo 3D en 5 pasos',
    description: 'Así convertimos tu plano en un modelo 3D con renders, visor y realidad aumentada: 5 pasos en {{delivery:maqueta}}, qué necesitamos y cómo revisamos la calidad.',
    h1: 'Cómo funciona: del plano 2D al modelo 3D en 5 pasos',
    lead: 'Nos envías el plano, lo modelamos a escala con scripts de Python en Blender, lo vestimos con materiales propios, lo revisas en un enlace privado y te entregamos renders, visor web y realidad aumentada. La maqueta completa tarda {{delivery:maqueta}} y cuesta desde {{price:maqueta}} + IVA.',
    breadcrumb: 'Cómo funciona',
    card: {
      title: 'Cómo funciona',
      summary: 'Los 5 pasos del plano al modelo 3D, qué necesitamos de ti, cuánto tarda cada fase y cómo controlamos la calidad.',
    },
    facts: [
      ['Pasos', '5, del plano a la entrega'],
      ['Plazo total', '{{delivery:maqueta}}'],
      ['Tu parte', 'Enviar el plano y revisar el visor'],
      ['Visita a la vivienda', 'No hace falta'],
      ['Herramientas', 'Blender, Python, Cycles, glTF, USDZ y model-viewer'],
      ['Revisiones', '{{revisions:maqueta}}'],
      ['Entrega', 'Renders 4K, visor web, código iframe y archivos AR'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué pasa desde que nos envías el plano?',
        answer: 'Leemos el plano y fijamos la escala; levantamos muros, huecos, puertas y ventanas con scripts de Python en Blender; amueblamos y creamos los materiales; te enviamos el visor en un enlace privado para que pidas cambios; y entregamos renders en 4K, visor web y archivos de realidad aumentada. En total, {{delivery:maqueta}} para la maqueta completa.',
        body: 'No hace falta visitar la vivienda ni que exista todavía: el plano basta. Por eso el mismo proceso sirve para una promoción sobre plano, un piso vacío o una casa en otra ciudad. Lo hicimos así con nuestra [villa en la Costa del Sol](@caso-villa), que partió de {{villa:input}}.',
      },
      {
        type: 'process',
        variant: 'despiece',
        h2: 'Los 5 pasos, con su plazo',
        intro: 'Plazos en días laborables para la [maqueta 3D completa](@servicio-plano). El plano 3D, que no lleva visor ni realidad aumentada, se entrega en {{delivery:plano3d}}.',
      },
      {
        type: 'needs',
        h2: '¿Qué tienes que enviarnos?',
        intro: 'Con el plano basta para empezar. Lo demás afina el resultado y suele ahorrar una ronda de cambios. Puedes adjuntarlo en el [formulario de contacto](@contacto) o pegar el enlace del anuncio donde aparece.',
      },
      {
        type: 'table',
        h2: '¿Cuánto tarda cada fase?',
        intro: 'Calendario de la maqueta 3D completa, contado desde que tenemos el plano y una medida de referencia. Dentro de ese margen, lo que más mueve el plazo es el número de estancias y de muebles.',
        caption: 'Fases de la maqueta 3D completa y quién interviene en cada una',
        head: ['Fase', 'Cuándo', 'Qué hacemos', 'Qué haces tú'],
        rows: [
          ['Lectura del plano', 'Día 0', 'Fijamos la escala, anotamos alturas y carpinterías y te preguntamos lo que no se lee', 'Envías el plano y una medida de referencia'],
          ['Modelado a escala', 'Días 1 y 2', 'Muros, tabiques, huecos, puertas, ventanas y escaleras, generados por script', 'Nada'],
          ['Mobiliario y materiales', 'Días 2 y 3', 'Muebles por estancia, texturas PBR procedurales y luz', 'Nos dices un estilo, si tienes preferencia'],
          ['Revisión', 'Día 4', 'Te enviamos el visor en un enlace privado y aplicamos tus cambios', 'Revisas y pides cambios: {{revisions:maqueta}}'],
          ['Entrega', 'Día 5', 'Renders en 4K, visor publicado, código iframe y archivos de realidad aumentada', 'Publicas en tu web, portales y redes'],
        ],
        note: 'Con urgencia, las mismas fases se comprimen en 48 horas, con un recargo del {{extra:urgente}} sobre el total. Las promociones con varias tipologías tardan {{delivery:promocion}}.',
      },
      {
        type: 'table',
        h2: '¿Qué programas usáis y por qué?',
        intro: 'Software libre y estándares abiertos de principio a fin. Tus archivos no dependen de una licencia nuestra ni de una suscripción: se abren con herramientas gratuitas.',
        caption: 'Herramientas del proceso y motivo de cada elección',
        head: ['Herramienta', 'Para qué la usamos', 'Por qué esta'],
        rows: [
          [`[Blender 5](${SRC.blender})`, 'Modelado, materiales, luz y exportación', 'Software libre con licencia GPL, apto para uso comercial; el archivo .blend se abre sin pagar licencias'],
          ['Python', 'Scripts que levantan muros, huecos y mobiliario desde las medidas del plano', 'Un cambio de distribución se reconstruye en minutos, sin volver a dibujar'],
          ['[Cycles](@glosario#cycles)', 'Cálculo de los [renders](@glosario#render)', 'Motor de trazado de rayos de Blender: la luz y las sombras se calculan, no se pintan'],
          [`[glTF 2.0](${SRC.gltf}) en [GLB](@glosario#glb)`, 'Modelo para el visor web y para Android', 'Estándar abierto de Khronos, sin royalties, que Khronos define como el «JPEG del 3D»'],
          ['[USDZ](@glosario#usdz)', 'Realidad aumentada en iPhone y iPad', 'El formato que abre AR Quick Look sin instalar nada'],
          [`[model-viewer](${SRC.mv})`, 'Visor 3D en tu web y botón de realidad aumentada', 'Componente web de código abierto de Google (Apache 2.0); solo se carga cuando el comprador lo pide'],
          ['Claude, de Anthropic', 'Dirección técnica y escritura de los scripts de Python', 'Acelera el código; no genera la geometría ni las imágenes'],
        ],
      },
      {
        type: 'answer',
        h2: '¿Por qué texturas procedurales y no fotos de stock?',
        answer: 'Porque se generan por código dentro de Blender: se ajustan al color que marca el plano, se repiten sin costuras a cualquier escala y no arrastran licencias de terceros que caduquen o limiten dónde publicas. En la villa de demostración creamos {{villa:textures}} texturas así, sin una sola imagen de banco.',
        body: 'Una textura [PBR](@glosario#pbr) describe algo más que el color: cuánto brilla una superficie, cuánto relieve tiene y cómo refleja la luz. Por eso el porcelánico negro de un baño y el barro cocido de una terraza reaccionan al sol como en la realidad, en el render y en el visor.\n\nY como cada textura es una receta y no una fotografía, cambiar el tono del parqué o el color de un alicatado es mover un valor, no buscar otra imagen. Eso es lo que permite aplicar una ronda de cambios en minutos y que el cambio aparezca igual en todas las vistas.',
      },
      {
        type: 'checklist',
        h2: '¿Cómo controlamos la calidad antes de entregar?',
        intro: 'Cada entrega pasa por comprobaciones automáticas y por una revisión a ojo contra el plano. Estas son las que aplicamos, con los resultados medidos en la villa de demostración:',
        items: [
          'La planta 2D redibujada se superpone al render cenital con la misma cámara: muros, puertas y huecos tienen que coincidir. En la villa, con un margen de ±3 px, el grosor de la línea.',
          'Las superficies de cada estancia se comparan con las del plano. Si el plano no trae cotas, se marcan como aproximadas (≈).',
          'Ningún render sale con zonas quemadas ni fotogramas negros: en la villa, menos del 0,002 % de píxeles saturados por imagen.',
          'Todas las texturas cargan en el render, en el visor y en la realidad aumentada: ningún material vacío.',
          'El modelo web pasa el validador oficial de glTF de Khronos sin errores y conserva todos sus materiales después de comprimirlo.',
          'El corte del [modo maqueta](@glosario#modo-maqueta) a {{villa:cutHeight}} m funciona en el visor, y el archivo de realidad aumentada de mesa se reabre para revisar texturas y corte.',
          'El visor muestra primero una imagen fija y descarga el modelo solo cuando el comprador pulsa: en la villa, {{file:glb}}.',
          'Cada imagen se entrega identificada como render y el mobiliario virtual, como recreación virtual.',
        ],
      },
      {
        type: 'answer',
        h2: '¿Qué pasa si el plano no tiene medidas?',
        answer: 'Buscamos una referencia fiable: la escala gráfica del plano, la superficie del anuncio o una medida que conozcas. Con ella escalamos el plano entero y el resultado es una estimación (≈), suficiente para enseñar distribución, luz y mobiliario, no para medir. Si luego llega el plano acotado, el script reconstruye el modelo con las medidas buenas.',
        body: 'Lo decimos en cada entrega para que el anuncio no prometa metros exactos. El modelo es material comercial: no sustituye al plano de un arquitecto ni sirve para licencias, tasaciones o mediciones oficiales.',
      },
      {
        type: 'table',
        h2: '¿Qué formatos entregáis?',
        intro: 'Todo sale del mismo modelo, así que lo que ves en un render es lo que el comprador encuentra en el visor y en la realidad aumentada.',
        caption: 'Entregables de la maqueta 3D completa y su uso',
        head: ['Entregable', 'Formato', 'Para qué sirve'],
        rows: [
          ['6 renders fotorrealistas', 'PNG y JPG en 4K', 'Anuncio, portales, dosier de venta y redes'],
          ['Planta cenital a color y planta 2D redibujada', 'PNG en 4K', 'Ficha del anuncio y folletos'],
          ['Visor 3D', 'Enlace y código iframe', 'Tu web, WhatsApp, email y códigos QR'],
          ['Realidad aumentada', 'USDZ para iPhone y iPad; GLB para Android', 'Maqueta 1:20 sobre la mesa o vivienda a tamaño real'],
          ['Modelo 3D', 'GLB, USDZ y BLEND', 'Reutilizarlo con tu arquitecto o en otra herramienta'],
        ],
        note: 'El visor queda alojado 12 meses; después, la renovación cuesta {{extra:hosting}} + IVA por vivienda y año. Los detalles de compatibilidad por dispositivo están en [realidad aumentada sin app](@servicio-ar).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Tengo que estar disponible durante el proceso?',
        a: 'Solo en dos momentos: al enviar el plano, por si hay que aclarar algo que no se lee, y en la revisión, cuando {{brand}} te manda el visor en un enlace privado para que pidas cambios. El resto del trabajo no necesita reuniones ni visitas a la vivienda. La maqueta completa llega en {{delivery:maqueta}}.',
      },
      {
        q: '¿La geometría la genera una inteligencia artificial?',
        a: 'No. {{brand}} usa un asistente de IA, Claude, para escribir y depurar los scripts de Python, pero la geometría la levantan esos scripts en Blender a partir de las medidas del plano: cada muro está donde dice el plano. Las imágenes se calculan con Cycles sobre ese modelo, no se generan con IA. Lo explicamos en [IA o modelo 3D real](@guia-ia-vs-3d).',
      },
      {
        q: '¿Qué tipo de cambios entran en las revisiones?',
        a: 'Mobiliario, materiales, colores, encuadres de los renders y ajustes de distribución, como mover un tabique o una puerta. La maqueta completa de {{brand}} incluye {{revisions:maqueta}}; cada ronda recoge todos tus comentarios a la vez. Un cambio de proyecto grande, como redistribuir la planta entera, se presupuesta aparte antes de hacerlo.',
      },
      {
        q: '¿Qué programa necesito para ver el modelo?',
        a: 'Ninguno. El visor de {{brand}} funciona en cualquier navegador actual, en el móvil y en el ordenador, y la realidad aumentada se abre con lo que ya trae el teléfono: [AR Quick Look](@glosario#ar-quick-look) en iPhone y iPad, [Scene Viewer](@glosario#scene-viewer) en Android con ARCore. Si quieres editar el modelo, el archivo .blend se abre con Blender, que es gratuito.',
      },
      {
        q: '¿El visor 3D ralentiza mi web?',
        a: 'No, si lo incrustas como te lo entregamos. El visor de {{brand}} muestra primero una imagen fija y solo descarga el modelo, de {{file:glb}} en la villa de demostración, cuando el visitante pulsa para explorarlo. Así la página carga como si tuviera una foto y el modelo no gasta datos a quien no lo abre.',
      },
      {
        q: '¿Podéis empezar por una sola estancia para probar?',
        a: 'Sí, es nuestra demo gratuita: nos envías el plano, {{brand}} modela una estancia en 3D y te la manda con realidad aumentada para que la abras en tu móvil. Ves el proceso completo con tu vivienda, sin pagar nada ni comprometerte. Si te encaja, seguimos con el resto y la maqueta completa llega en {{delivery:maqueta}}.',
      },
      {
        q: '¿Trabajáis con planos de arquitecto en DWG?',
        a: 'Sí, y es la mejor entrada posible: con un DWG o un DXF, {{brand}} toma las cotas del proyecto y el modelo respeta las medidas reales, sin estimaciones. También sirven un PDF exportado del programa del arquitecto o un plano escaneado. Si hay alzados o memoria de calidades, envíalos: nos ayudan a acertar con alturas, carpinterías y acabados.',
      },
    ],
    related: ['servicio-plano', 'caso-villa', 'precios', 'guia-plano-2d-3d', 'guia-ia-vs-3d'],
    cta: {
      h2: '¿Empezamos con tu plano?',
      body: 'Envíanos el plano y te devolvemos una estancia modelada en 3D, con realidad aumentada, para que veas el proceso con tu propia vivienda antes de decidir. Gratis y sin compromiso.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'How it works: from 2D floor plan to 3D in 5 steps',
    description: 'How we turn your floor plan into a 3D model with renders, a viewer and AR: 5 steps in {{delivery:maqueta}}, what we need from you and how we check quality.',
    h1: 'How it works: from 2D floor plan to 3D in 5 steps',
    lead: 'You send us the floor plan, we model it to scale with Python scripts in Blender, finish it with our own materials, you review it on a private link, and we deliver renders, a web viewer and augmented reality. The complete model takes {{delivery:maqueta}} and starts at {{price:maqueta}} + VAT.',
    breadcrumb: 'How it works',
    card: {
      title: 'How it works',
      summary: 'The 5 steps from floor plan to 3D model, what we need from you, how long each stage takes and how we check quality.',
    },
    facts: [
      ['Steps', '5, from plan to delivery'],
      ['Total turnaround', '{{delivery:maqueta}}'],
      ['Your part', 'Send the plan and review the viewer'],
      ['Site visit', 'Not needed'],
      ['Tools', 'Blender, Python, Cycles, glTF, USDZ and model-viewer'],
      ['Revisions', '{{revisions:maqueta}}'],
      ['Delivery', '4K renders, web viewer, iframe code and AR files'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What happens once you send us the floor plan?',
        answer: 'We read the plan and set the scale; build walls, openings, doors and windows with Python scripts in Blender; furnish the rooms and create the materials; send you the viewer on a private link for your changes; and deliver 4K renders, a web viewer and augmented reality files. That is {{delivery:maqueta}} for the complete model.',
        body: 'Nobody needs to visit the property, and it does not even have to exist yet: the plan is enough. That is why the same process works for an off-plan development, an empty flat or a villa your buyer has never seen. It is how we built our [Costa del Sol villa](@caso-villa), which started from {{villa:input}}.',
      },
      {
        type: 'process',
        variant: 'despiece',
        h2: 'The 5 steps and their timing',
        intro: 'Working days for the [complete 3D model](@servicio-plano). A 3D floor plan, which has no viewer or augmented reality, is delivered in {{delivery:plano3d}}.',
      },
      {
        type: 'needs',
        h2: 'What do you need to send us?',
        intro: 'The plan is enough to start. The rest sharpens the result and usually saves a round of changes. Attach it to the [contact form](@contacto) or paste the link of the listing it appears in.',
      },
      {
        type: 'table',
        h2: 'How long does each stage take?',
        intro: 'Schedule for the complete 3D model, counted from when we have the plan and one reference measurement. Within that window, the number of rooms and pieces of furniture is what moves the timing most.',
        caption: 'Stages of the complete 3D model and who does what',
        head: ['Stage', 'When', 'What we do', 'What you do'],
        rows: [
          ['Reading the plan', 'Day 0', 'Set the scale, note heights and joinery, and ask about anything unclear', 'Send the plan and one reference measurement'],
          ['Modelling to scale', 'Days 1 and 2', 'Walls, partitions, openings, doors, windows and stairs, generated by script', 'Nothing'],
          ['Furniture and materials', 'Days 2 and 3', 'Furniture for every room, procedural PBR textures and lighting', 'Tell us a style, if you have a preference'],
          ['Review', 'Day 4', 'We send the viewer on a private link and apply your changes', 'Review and request changes: {{revisions:maqueta}}'],
          ['Delivery', 'Day 5', '4K renders, live viewer, iframe code and augmented reality files', 'Publish on your site, portals and social media'],
        ],
        note: 'On a rush job the same stages are compressed into 48 hours, with a {{extra:urgente}} surcharge on the total. Developments with several unit types take {{delivery:promocion}}.',
      },
      {
        type: 'table',
        h2: 'Which software do you use, and why?',
        intro: 'Free software and open standards from start to finish. Your files do not depend on our licence or a subscription: free tools open them.',
        caption: 'Tools in our pipeline and why we chose each one',
        head: ['Tool', 'What we use it for', 'Why this one'],
        rows: [
          [`[Blender 5](${SRC.blender})`, 'Modelling, materials, lighting and export', 'Free software under the GPL, cleared for commercial use; the .blend file opens without paying for a licence'],
          ['Python', 'Scripts that build walls, openings and furniture from the plan’s measurements', 'A layout change is rebuilt in minutes, with no redrawing'],
          ['[Cycles](@glosario#cycles)', 'Computing the [renders](@glosario#render)', 'Blender’s path-tracing engine: light and shadow are calculated, not painted in'],
          [`[glTF 2.0](${SRC.gltf}) as [GLB](@glosario#glb)`, 'The model for the web viewer and for Android', 'Royalty-free open standard from Khronos, which calls it the “JPEG of 3D”'],
          ['[USDZ](@glosario#usdz)', 'Augmented reality on iPhone and iPad', 'The format AR Quick Look opens with nothing to install'],
          [`[model-viewer](${SRC.mv})`, 'The 3D viewer on your site and its AR button', 'Google’s open-source web component (Apache 2.0); it loads only when the buyer asks for it'],
          ['Claude, by Anthropic', 'Technical direction and writing the Python scripts', 'It speeds up the code; it does not generate the geometry or the images'],
        ],
      },
      {
        type: 'answer',
        h2: 'Why procedural textures instead of stock photos?',
        answer: 'Because they are generated by code inside Blender: they match the colours on the plan, repeat at any scale without visible joins and carry no third-party licence that could expire or limit where you publish. For the demo villa we created {{villa:textures}} textures this way, without a single stock image.',
        body: 'A [PBR](@glosario#pbr) texture describes more than colour: how glossy a surface is, how much relief it has and how it reflects light. That is why black porcelain tiles in a bathroom and terracotta on a terrace react to sunlight as they would in real life, in the render and in the viewer.\n\nAnd because each texture is a recipe rather than a photograph, changing the tone of an oak floor or the colour of a tiled wall means adjusting a value, not hunting for another image. That is what lets us apply a round of changes in minutes and keep every view consistent.',
      },
      {
        type: 'checklist',
        h2: 'How do you check quality before delivery?',
        intro: 'Every delivery goes through automated checks and a visual review against the plan. These are the checks we run, with the results measured on the demo villa:',
        items: [
          'The redrawn 2D plan is laid over the top-down render from the same camera: walls, doors and openings must line up. On the villa, within ±3 px, the width of the line.',
          'Each room’s floor area is compared with the plan. If the plan has no dimensions, areas are marked as approximate (≈).',
          'No render ships with blown-out areas or black frames: on the villa, fewer than 0.002% of pixels clipped per image.',
          'Every texture loads in the render, in the viewer and in augmented reality: no empty materials.',
          'The web model passes Khronos’s official glTF validator with zero errors and keeps all its materials after compression.',
          'The [cut-away mode](@glosario#modo-maqueta) at {{villa:cutHeight}} m works in the viewer, and the tabletop AR file is reopened to check textures and the cut.',
          'The viewer shows a still image first and downloads the model only when the buyer taps: {{file:glb}} for the villa.',
          'Every image is delivered labelled as a render, and virtual furniture as a virtual recreation.',
        ],
      },
      {
        type: 'answer',
        h2: 'What if the floor plan has no dimensions?',
        answer: 'We find a reliable reference: the plan’s scale bar, the floor area in the listing or a measurement you know. We scale the whole plan from it, so the result is an estimate (≈): good enough to show layout, light and furniture, not to measure from. If the dimensioned plan turns up later, the script rebuilds the model with the correct figures.',
        body: 'We state this in every delivery so your listing never promises exact square metres. The model is marketing material: it does not replace an architect’s drawings and is not valid for planning applications, valuations or official measurements.',
      },
      {
        type: 'table',
        h2: 'Which file formats do you deliver?',
        intro: 'Everything comes from the same model, so what the buyer sees in a render is what they find in the viewer and in augmented reality.',
        caption: 'Deliverables of the complete 3D model and what each is for',
        head: ['Deliverable', 'Format', 'What it is for'],
        rows: [
          ['6 photorealistic renders', '4K PNG and JPG', 'Listings, portals, sales brochures and social media'],
          ['Colour top-down plan and redrawn 2D plan', '4K PNG', 'Listing floor plan and brochures'],
          ['3D viewer', 'Link and iframe code', 'Your website, WhatsApp, email and QR codes'],
          ['Augmented reality', 'USDZ for iPhone and iPad; GLB for Android', '1:20 tabletop model or the home at real size'],
          ['3D model', 'GLB, USDZ and BLEND', 'Reuse with your architect or in other software'],
        ],
        note: 'The viewer is hosted for 12 months; after that, renewal costs {{extra:hosting}} + VAT per home per year. Device-by-device compatibility is covered on [AR property viewing](@servicio-ar).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'Do I need to be available while you work?',
        a: 'Only twice: when you send the plan, in case something is unclear, and at the review stage, when {{brand}} sends you the viewer on a private link so you can ask for changes. The rest of the work needs no meetings and no site visits. The complete model arrives in {{delivery:maqueta}}.',
      },
      {
        q: 'Is the geometry generated by artificial intelligence?',
        a: 'No. {{brand}} uses an AI assistant, Claude, to write and debug the Python scripts, but those scripts build the geometry in Blender from the plan’s measurements: every wall sits where the plan puts it. The images are computed with Cycles from that model, not generated by AI. We go into this in [AI floor plan to 3D](@guia-ia-vs-3d).',
      },
      {
        q: 'What kind of changes can I ask for in a revision?',
        a: 'Furniture, materials, colours, render framing and layout tweaks such as moving a partition or a door. The {{brand}} complete model includes {{revisions:maqueta}}, and each round collects all your comments at once. A major redesign, such as reorganising the whole floor, is quoted separately before we start on it.',
      },
      {
        q: 'What software do I need to open the model?',
        a: 'None. The {{brand}} viewer runs in any current browser, on phones and computers, and augmented reality opens with what the phone already has: [AR Quick Look](@glosario#ar-quick-look) on iPhone and iPad, [Scene Viewer](@glosario#scene-viewer) on ARCore Android phones. If you want to edit the model, the .blend file opens in Blender, which is free.',
      },
      {
        q: 'Will the 3D viewer slow down my website?',
        a: 'Not if you embed it as we deliver it. The {{brand}} viewer shows a still image first and only downloads the model, {{file:glb}} for the demo villa, when the visitor taps to explore it. The page loads as if it held a photo, and the model uses no mobile data for visitors who never open it.',
      },
      {
        q: 'Can you start with a single room as a trial?',
        a: 'Yes, that is our free demo: you send the plan, {{brand}} models one room in 3D and sends it to you in augmented reality to open on your phone. You see the whole process with your own property, without paying or committing. If it works for you, we carry on and the complete model arrives in {{delivery:maqueta}}.',
      },
      {
        q: 'Can you work from an architect’s DWG files?',
        a: 'Yes, and it is the best possible starting point: from a DWG or DXF, {{brand}} takes the project’s dimensions and the model follows the real measurements, with no estimates. A PDF exported from the architect’s software or a scanned plan also works. If you have elevations or a specification sheet, send them too: they help us get heights, joinery and finishes right.',
      },
    ],
    related: ['servicio-plano', 'caso-villa', 'precios', 'guia-ia-vs-3d', 'servicio-tour'],
    cta: {
      h2: 'Shall we start with your floor plan?',
      body: 'Send us the plan and we will send back one room modelled in 3D, with augmented reality, so you can see the process with your own property before deciding. Free, with no obligation.',
      service: 'maqueta',
    },
  },
};
