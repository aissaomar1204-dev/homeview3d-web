// Audience page: architects, interior designers and renovation companies (ES + EN).
// Keyword focus: renders para arquitectos, visualización arquitectónica (PAA «¿Qué es la visualización arquitectónica?»), interioristas.
// Angle (02-keywords C11): fast iteration because the model is built by code, AR to present to the end client, embeddable viewer.
// «¿Cuánto cobra un arquitecto por un render?» is owned by guia-precio-render (linked, not targeted).

const faq = [
  {
    q: '¿Podéis trabajar con mis archivos DWG o DXF?',
    a: 'Sí. {{brand}} trabaja con DWG y DXF, que son los más precisos, y también con PDF, JPG o PNG de las plantas. Con un archivo CAD acotado, el modelo sale a medida. Con una imagen sin cotas, estimamos las medidas con la escala del plano y lo marcamos con ≈. Si tienes alzados o secciones, envíalos también: ayudan con alturas, huecos y carpinterías.',
  },
  {
    q: '¿Cuánto tarda una ronda de cambios?',
    a: 'El cambio en el modelo es rápido: {{brand}} genera la geometría por script, así que mover un tabique o cambiar un pavimento se reconstruye en minutos. Lo que lleva más tiempo es volver a renderizar las vistas y revisarlas. La maqueta 3D completa incluye {{revisions:maqueta}}, y al recibir tus comentarios te confirmamos el plazo de cada ronda.',
  },
  {
    q: '¿Puedo presentar el proyecto a mi cliente en realidad aumentada?',
    a: 'Sí. {{brand}} entrega el proyecto en realidad aumentada en dos escalas: una maqueta 1:20 que tu cliente ve sobre la mesa de la reunión y una versión a tamaño real para recorrer el salón. Se abre con un toque en iPhone o iPad (AR Quick Look) y en móviles Android compatibles (Scene Viewer), sin instalar ninguna app.',
  },
  {
    q: '¿Me entregáis el modelo 3D para seguir trabajando con él?',
    a: 'Sí. Además de los renders 4K y del visor web, {{brand}} entrega el modelo en GLB para web y Android, en USDZ para iPhone y en BLEND, el archivo editable de Blender. Así puedes reutilizar la geometría amueblada en las presentaciones de ese proyecto o pedirnos nuevas vistas más adelante, sobre el mismo modelo.',
  },
  {
    q: '¿Cuál es la mejor IA para renders arquitectónicos?',
    a: 'Depende de para qué la quieras. Las IA generativas crean imágenes atractivas a partir de un boceto o una foto, pero no respetan medidas ni mantienen la coherencia entre vistas. {{brand}} usa scripts para construir en Blender un modelo 3D a escala y lo renderiza con Cycles: cada vista sale de la misma geometría. Lo comparamos en la guía [IA o modelo 3D real](@guia-ia-vs-3d).',
  },
  {
    q: '¿Cuánto cuesta un render adicional sobre el modelo?',
    a: 'Con el modelo ya construido, cada render adicional en 4K se hace sobre la misma geometría, así que cuesta poco trabajo. La maqueta 3D completa de {{brand}}, con el modelo, varios renders, visor web y realidad aumentada, va con presupuesto cerrado al ver las plantas. Si quieres comparar con otras tarifas del mercado español, tienes los rangos publicados en nuestra [guía de precios de renders](@guia-precio-render).',
  },
  {
    q: '¿Trabajáis con interioristas y empresas de reformas?',
    a: 'Sí. Para un interiorista, {{brand}} amuebla y materializa el modelo con tu propuesta y la cambia de estilo sin rehacerlo. Para una empresa de reformas, modelamos el estado actual y la propuesta sobre el mismo plano, de modo que el cliente compara antes y después en renders, en el visor y en realidad aumentada. El home staging virtual se presupuesta por estancia.',
  },
];

const faqEn = [
  {
    q: 'Can you work with my DWG or DXF files?',
    a: 'Yes. {{brand}} works with DWG and DXF, which are the most accurate, and also with PDF, JPG or PNG floor plans. With a dimensioned CAD file, the model is built to measure. With an image that has no dimensions, we estimate from the drawing’s scale and mark the figures with ≈. Send elevations or sections too if you have them: they help with heights, openings and joinery.',
  },
  {
    q: 'How long does a round of changes take?',
    a: 'The change to the model itself is fast: {{brand}} generates the geometry by script, so moving a partition or swapping a floor finish rebuilds in minutes. What takes longer is re-rendering the views and checking them. The complete 3D model includes {{revisions:maqueta}}, and when we receive your comments we confirm the turnaround for each round.',
  },
  {
    q: 'Can I present the design to my client in augmented reality?',
    a: 'Yes. {{brand}} delivers the design in augmented reality at two scales: a 1:20 model your client sees on the meeting table, and a real-size version to walk around the living room. It opens with one tap on iPhone or iPad (AR Quick Look) and on compatible Android phones (Scene Viewer), with no app to install.',
  },
  {
    q: 'Do you hand over the 3D model so I can keep working with it?',
    a: 'Yes. Alongside the 4K renders and the web viewer, {{brand}} delivers the model as GLB for the web and Android, USDZ for iPhone and BLEND, the editable Blender file. You can reuse the furnished geometry in later presentations of that project, or ask us for new views on the same model further down the line.',
  },
  {
    q: 'What is the best AI for architectural renders?',
    a: 'It depends on what you need it for. Generative AI makes attractive images from a sketch or a photo, but it does not respect dimensions or keep views consistent with each other. {{brand}} uses scripts to build a to-scale 3D model in Blender and renders it with Cycles, so every view comes from the same geometry. We compare both in our guide [AI floor plan to 3D](@guia-ia-vs-3d).',
  },
  {
    q: 'What does an extra render on the model cost?',
    a: 'Once the model is built, each extra 4K render uses the same geometry, so it takes little work. The {{brand}} complete 3D model, with the model, several renders, web viewer and augmented reality, gets a fixed quote once we see the plans. To compare with other rates in the Spanish market, see the published ranges in our [3D rendering cost guide](@guia-precio-render).',
  },
  {
    q: 'Do you work with interior designers and renovation companies?',
    a: 'Yes. For an interior designer, {{brand}} furnishes and finishes the model to your scheme and can switch its style without rebuilding it. For a renovation company, we model the current state and the proposal on the same plan, so the client compares before and after in renders, in the viewer and in augmented reality. Virtual staging is quoted per room.',
  },
];

import { plate } from '../data/plates.mjs';

export default {
  id: 'sol-arquitectos',
  image: 'villa_muros_completos_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  es: {
    title: 'Visualización 3D para arquitectos e interioristas',
    description: 'Del plano al modelo 3D con renders 4K, visor web y AR para presentar e iterar tu proyecto, con cambios en minutos y presupuesto cerrado.',
    h1: 'Renders y modelo 3D para arquitectos e interioristas',
    lead: 'Convertimos tus plantas en un modelo 3D amueblado con renders 4K, visor web y realidad aumentada, para que tu cliente entienda el proyecto y lo apruebe antes. Como el modelo se construye por código, cada cambio se regenera en minutos. Entrega en {{delivery:maqueta}}, con presupuesto cerrado.',
    breadcrumb: 'Arquitectos e interioristas',
    card: {
      title: 'Para arquitectos e interioristas',
      summary: 'Presenta e itera el proyecto con renders, visor 3D y realidad aumentada sobre un modelo que cambia en minutos.',
    },
    hero: {
      image: 'villa_muros_completos',
      alt: 'Planta alta de una villa en la Costa del Sol con los muros a altura completa, vista aérea. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'La planta del caso demostrativo con muros completos. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Para', 'Arquitectos, interioristas y empresas de reformas'],
      ['Entrada', 'Plantas en DWG, DXF, PDF o imagen'],
      ['Entregas', 'Renders 4K, visor web, AR y archivos 3D'],
      ['Formatos 3D', 'GLB, USDZ y BLEND'],
      ['Cambios', '{{revisions:maqueta}}, regenerados en minutos'],
      ['Precio', 'Presupuesto cerrado antes de empezar'],
      ['Render adicional', 'Sobre el mismo modelo'],
      ['Plazo', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué es la visualización arquitectónica?',
        answer: 'Es la representación de un proyecto en imágenes, recorridos o modelos 3D antes de construirlo, para que quien no lee planos lo entienda. En {{brand}} parte de tus plantas: un modelo 3D a escala del que salen renders fotorrealistas, un visor web navegable y la vivienda en realidad aumentada.',
        body: 'Nuestro enfoque es práctico. No hacemos imágenes de concurso: resolvemos lo que más tiempo te quita en el día a día de un proyecto residencial, que es explicárselo al cliente, cambiarlo y volver a explicarlo. Por eso todo sale de un mismo modelo y no de imágenes sueltas.',
      },
      {
        type: 'table',
        h2: '¿Dónde te ahorra tiempo el modelo 3D?',
        intro: 'Las fases de un proyecto en las que el cliente suele atascarse, y qué cambia cuando trabaja sobre un modelo 3D en lugar de sobre plantas.',
        caption: 'Fases de un proyecto residencial y qué aporta el modelo 3D',
        head: ['Fase', 'Lo habitual', 'Con el modelo 3D'],
        rows: [
          ['Primera propuesta', 'Plantas y alguna perspectiva que el cliente no termina de entender', 'Renders amueblados y un enlace al visor que el cliente gira por su cuenta'],
          ['Iteración', 'Cada cambio obliga a rehacer las vistas', 'El modelo se genera por script: un tabique o un suelo nuevos se reconstruyen en minutos'],
          ['Reunión con el cliente', 'La pantalla del portátil y mucha explicación', 'La vivienda sobre la mesa a escala 1:20 en realidad aumentada, o el salón a tamaño real'],
          ['Materiales y acabados', 'Muestras físicas y catálogos sueltos', 'Materiales PBR con relieve aplicados al modelo, coherentes en todas las vistas'],
          ['Web y portfolio', 'Imágenes fijas', 'El visor 3D incrustado con un iframe y renders en 4K'],
        ],
      },
      {
        type: 'figure',
        image: 'villa_interior_dormitorio',
        alt: 'Dormitorio principal a la altura de los ojos, con cabecero de obra rematado en madera, ropa de cama en lino, lámparas de mesilla encendidas y puerta corredera a la terraza. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
        caption: 'Madera, textiles y luz de media tarde sobre el mismo modelo, a la altura de los ojos. Render 3D de la villa anonimizada.',
        layout: 'wide',
      },
      {
        type: 'steps',
        h2: '¿Cómo trabajamos con tu estudio?',
        intro: 'Tú mantienes el proyecto y el criterio; nosotros construimos el modelo y las imágenes.',
        items: [
          { title: 'Nos pasas las plantas', body: 'DWG o DXF si los tienes; si no, PDF o imagen. Con cotas, el modelo sale a medida; sin ellas, estimamos a escala y lo marcamos (≈).' },
          { title: 'Acordamos el criterio', body: 'Estilo de mobiliario, paleta de materiales y vistas clave. Si tienes referencias o una memoria de acabados, las seguimos; si no, te proponemos una línea.' },
          { title: 'Revisas en el visor', body: 'Te enviamos un enlace privado con el modelo. Marcas los cambios de distribución, mobiliario o materiales y los aplicamos en {{revisions:maqueta}}.' },
          { title: 'Recibes los archivos', body: 'Renders 4K, visor web con código de inserción y el modelo en [USDZ](@glosario#usdz), [GLB](@glosario#glb) y BLEND, listo para abrir en Blender.' },
        ],
      },
      {
        type: 'viewer',
        h2: '¿Cómo verá tu cliente el proyecto?',
        intro: 'Prueba el [modo maqueta](@glosario#modo-maqueta) con la villa de nuestro [caso demostrativo](@caso-villa): muros cortados a {{villa:cutHeight}} m para leer la distribución de un vistazo, y muros completos cuando quieras ver el volumen.',
      },
      {
        type: 'answer',
        h2: '¿Compensa externalizar los renders?',
        answer: 'Compara el precio con tus horas. Ejemplo con supuestos: si preparar tú el modelo, los materiales y los renders te lleva 20 horas y tu hora de estudio vale 50 €, son 1.000 € de tiempo que no dedicas a proyectar. Compáralo con el presupuesto cerrado de la maqueta 3D completa, que incluye además visor web y realidad aumentada.',
        body: 'Si tus horas multiplicadas por tu tarifa superan el precio del encargo, externalizar compensa. Y si no, quizá te interese solo la parte que no haces: el visor y la realidad aumentada para presentar al cliente. Cómo presupuestamos, en [precios](@precios).',
      },
      plate('es', 'villa_dormitorios_opaco'),
      {
        type: 'table',
        caption: 'Ejemplo ilustrativo: horas propias frente a encargo (supuestos, no resultados)',
        head: ['Concepto', 'Valor en el ejemplo'],
        rows: [
          ['Horas de modelado, materiales y renders (supuesto)', '20 h'],
          ['Coste de tu hora de estudio (supuesto)', '50 €'],
          ['Coste interno estimado', '1.000 €'],
          ['Regla práctica', 'Si horas × tarifa supera el presupuesto del encargo, externalizar compensa'],
        ],
        note: 'Cifras supuestas para mostrar el cálculo. Pon tus propias horas y tu tarifa.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Qué no hacemos',
        body: 'No firmamos ni revisamos proyectos: la geometría sale de tus planos y la responsabilidad técnica sigue siendo tuya. Las imágenes son representaciones orientativas del proyecto. Si el plano no trae cotas, las medidas del modelo son estimaciones a escala (≈).',
      },
      { type: 'faq' },
    ],
    faq,
    related: ['servicio-renders', 'servicio-tour', 'servicio-ar', 'caso-villa', 'precios'],
    cta: {
      h2: '¿Probamos con tu próximo proyecto?',
      body: 'Envíanos una planta y te devolvemos una estancia modelada en 3D con realidad aumentada, gratis, para que se la enseñes a tu cliente.',
      service: 'maqueta',
    },
  },

  en: {
    title: '3D visualisation for architects and designers',
    description: 'From floor plan to 3D model, with 4K renders, a web viewer and AR to present and iterate your design, changes in minutes and a fixed quote.',
    h1: 'Renders and 3D models for architects and interior designers',
    lead: 'We turn your floor plans into a furnished 3D model with 4K renders, a web viewer and augmented reality, so your client understands the design and signs it off sooner. Because the model is built in code, every change regenerates in minutes. Delivered in {{delivery:maqueta}}, with a fixed quote.',
    breadcrumb: 'Architects and designers',
    card: {
      title: 'For architects and interior designers',
      summary: 'Present and iterate the design with renders, a 3D viewer and augmented reality, on a model that changes in minutes.',
    },
    hero: {
      image: 'villa_muros_completos',
      alt: 'Aerial view of the upper floor of a Costa del Sol villa with its walls at full height. 3D render generated from the 2D floor plan of an anonymised case.',
      caption: 'The floor plan of our demo case with full-height walls. Rendered from the 2D floor plan.',
    },
    facts: [
      ['For', 'Architects, interior designers and renovation firms'],
      ['Input', 'Floor plans as DWG, DXF, PDF or image'],
      ['Outputs', '4K renders, web viewer, AR and 3D files'],
      ['3D formats', 'GLB, USDZ and BLEND'],
      ['Changes', '{{revisions:maqueta}}, regenerated in minutes'],
      ['Price', 'A fixed quote before we start'],
      ['Extra renders', 'On the same model'],
      ['Turnaround', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What is architectural visualisation?',
        answer: 'It is showing a project as images, walkthroughs or 3D models before it is built, so that people who cannot read drawings understand it. At {{brand}} it starts from your floor plans: a to-scale 3D model that produces photorealistic renders, a web viewer you can explore and the home in augmented reality.',
        body: 'Our approach is practical. We do not make competition imagery: we tackle what eats most of your time on a residential project, which is explaining it to the client, changing it and explaining it again. That is why everything comes from one model rather than from separate images.',
      },
      {
        type: 'table',
        h2: 'Where does the 3D model save you time?',
        intro: 'The stages of a project where clients tend to get stuck, and what changes when they work from a 3D model instead of from floor plans.',
        caption: 'Stages of a residential project and what the 3D model adds',
        head: ['Stage', 'The usual way', 'With the 3D model'],
        rows: [
          ['First proposal', 'Plans and the odd perspective the client never quite understands', 'Furnished renders and a link to the viewer the client can turn around on their own'],
          ['Iteration', 'Every change means redoing the views', 'The model is generated by script: a new partition or floor rebuilds in minutes'],
          ['Client meeting', 'A laptop screen and a lot of explaining', 'The home on the table at 1:20 in augmented reality, or the living room at real size'],
          ['Materials and finishes', 'Physical samples and loose catalogues', 'PBR materials with real surface relief on the model, consistent in every view'],
          ['Website and portfolio', 'Still images', 'The 3D viewer embedded with an iframe, plus 4K renders'],
        ],
      },
      {
        type: 'figure',
        image: 'villa_interior_dormitorio',
        alt: 'Eye-level 3D render of the anonymised villa’s main bedroom: built-in headboard finished in timber, linen bedding, lit bedside lamps and a sliding door to the terrace. Generated from the 2D floor plan.',
        caption: 'Timber, textiles and late-afternoon light on the same model, at eye level. 3D render of the anonymised villa.',
        layout: 'wide',
      },
      {
        type: 'steps',
        h2: 'How do we work with your practice?',
        intro: 'You keep the design and the judgement calls; we build the model and the images.',
        items: [
          { title: 'You send us the floor plans', body: 'DWG or DXF if you have them; otherwise PDF or an image. With dimensions, the model is built to measure; without them, we estimate from the scale and mark it (≈).' },
          { title: 'We agree the brief', body: 'Furniture style, material palette and key views. If you have references or a finishes schedule, we follow them; if not, we propose a direction.' },
          { title: 'You review in the viewer', body: 'We send you a private link to the model. You mark changes to layout, furniture or materials and we apply them in {{revisions:maqueta}}.' },
          { title: 'You receive the files', body: '4K renders, the web viewer with its embed code and the model as [USDZ](@glosario#usdz), [GLB](@glosario#glb) and BLEND, ready to open in Blender.' },
        ],
      },
      {
        type: 'viewer',
        h2: 'How will your client see the design?',
        intro: 'Try [cut-away mode](@glosario#modo-maqueta) on the villa from our [demo case](@caso-villa): walls cut at {{villa:cutHeight}} m to read the layout at a glance, and full-height walls when you want to see the volume.',
      },
      {
        type: 'answer',
        h2: 'Is outsourcing your renders worth it?',
        answer: 'Compare the price with your own hours. An example built on assumptions: if preparing the model, materials and renders yourself takes 20 hours and your studio time is worth €50 an hour, that is €1,000 of time not spent designing. Set that against the fixed quote for the complete 3D model, which also includes a web viewer and augmented reality.',
        body: 'If your hours multiplied by your rate exceed the price of the job, outsourcing pays. If not, you might only want the part you do not do yourself: the viewer and augmented reality for client presentations. How we quote is on the [pricing page](@precios).',
      },
      plate('en', 'villa_dormitorios_opaco'),
      {
        type: 'table',
        caption: 'Illustrative example: your own hours versus outsourcing (assumptions, not results)',
        head: ['Item', 'Value in the example'],
        rows: [
          ['Hours of modelling, materials and renders (assumed)', '20 h'],
          ['Cost of an hour of your studio time (assumed)', '€50'],
          ['Estimated internal cost', '€1,000'],
          ['Rule of thumb', 'If hours × rate exceeds the quote for the job, outsourcing pays'],
        ],
        note: 'Assumed figures to show the calculation. Use your own hours and rate.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'What we do not do',
        body: 'We do not sign off or check designs: the geometry comes from your drawings and technical responsibility stays with you. The images are indicative representations of the project. If the plan has no dimensions, the model’s measurements are scale estimates (≈).',
      },
      { type: 'faq' },
    ],
    faq: faqEn,
    related: ['servicio-renders', 'servicio-tour', 'servicio-ar', 'caso-villa', 'precios'],
    cta: {
      h2: 'Shall we try it on your next project?',
      body: 'Send us a floor plan and we will send back one room modelled in 3D with augmented reality, free, for you to show your client.',
      service: 'maqueta',
    },
  },
};
