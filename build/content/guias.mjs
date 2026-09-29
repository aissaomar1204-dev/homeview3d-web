// Hub: guides index (ES + EN).
// ES children (routes.mjs): guia-precio-render, guia-precio-plano, guia-plano-2d-3d, guia-ia-vs-3d, guia-matterport, guia-mejores, guia-sobre-plano, guia-ar.
// EN children: guia-precio-render, guia-precio-plano, guia-ia-vs-3d, guia-matterport, guia-mejores, guia-ar (plano-2d-3d and sobre-plano are ES only).
// The `pages` block skips any guide whose content file is not rendered yet; counts are deliberately not written in copy.
// No statistics here: the guides carry their own sourced figures.

export default {
  id: 'guias',
  image: 'villa_planta_cenital_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-29',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Guías sobre renders, planos 3D y realidad aumentada',
    description: 'Guías con fuentes para decidir cómo enseñar una vivienda en 3D: precios de renders y planos, IA o modelo real, Matterport, estudios de España y AR.',
    h1: 'Guías de visualización 3D inmobiliaria',
    lead: 'Guías para inmobiliarias, promotoras y arquitectos que están decidiendo cómo enseñar una vivienda en 3D: qué cuesta en España, cómo se hace, qué alternativa conviene y qué exige la ley. Cada cifra de mercado enlaza a su fuente, y nuestra tarifa va aparte: plano 3D desde {{price:plano3d}} + IVA, en {{delivery:plano3d}}.',
    breadcrumb: 'Guías',
    card: {
      title: 'Guías',
      summary: 'Precios de mercado con fuentes, plano a 3D, IA frente a modelo real, Matterport, estudios de España, venta sobre plano y realidad aumentada.',
    },
    facts: [
      ['Para', 'Inmobiliarias, promotoras y arquitectos'],
      ['Precios', 'Renders y planos 3D en España, con fuente y fecha'],
      ['Comparativas', 'IA o modelo 3D; Matterport o tour 360; estudios de España'],
      ['Cómo se hace', 'Plano 2D a 3D, venta sobre plano y realidad aumentada'],
      ['Datos revisados', 'Septiembre de 2026'],
      ['Autoría', 'Equipo de {{brand}}, parte interesada'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué guía te sirve ahora?',
        answer: 'La que responde a la decisión que tienes delante. Si preparas presupuesto, empieza por los precios de mercado. Si dudas entre hacerlo tú, usar IA o encargarlo, lee cómo convertir un plano en 3D y la comparativa con la IA. Si vendes obra nueva, la guía de venta sobre plano.',
        body: 'Las guías son de tres tipos. Las de **precios** reúnen tarifas publicadas por estudios y plataformas que trabajan en España, con el enlace a cada una. Las **comparativas** ponen dos opciones frente a frente con los mismos criterios y dicen cuándo conviene cada una, también cuando la respuesta no somos nosotros. Las de **cómo se hace** explican un proceso paso a paso, del plano al modelo o del modelo al móvil del comprador.',
      },
      {
        type: 'table',
        h2: '¿Qué guía responde a cada pregunta?',
        caption: 'Guías por pregunta y por momento de la decisión',
        head: ['Tu pregunta', 'Guía', 'Te sirve sobre todo si…'],
        rows: [
          ['¿Cuánto cuesta un render 3D en España?', '[Precio de un render 3D](@guia-precio-render)', 'Comparas presupuestos de renders por imagen, por vivienda o por promoción'],
          ['¿Cuánto cuesta un plano 3D?', '[Precio de un plano 3D](@guia-precio-plano)', 'Solo necesitas la planta amueblada para el anuncio y quieres saber qué precio es razonable'],
          ['¿Puedo pasar un plano a 3D yo mismo?', '[Cómo convertir un plano 2D en 3D](@guia-plano-2d-3d)', 'Tienes tiempo y quieres probar con un programa gratuito o una herramienta de IA'],
          ['¿La IA ya hace esto sola?', '[IA o modelo 3D real](@guia-ia-vs-3d)', 'Te han enseñado una imagen generada con IA y dudas si basta para vender'],
          ['¿Necesito Matterport o un tour 360?', '[Modelo 3D, Matterport o tour 360](@guia-matterport)', 'Dudas entre escanear o fotografiar la vivienda y modelarla desde el plano, o aún no está construida'],
          ['¿Qué estudio de visualización 3D elijo?', '[Mejores estudios de visualización 3D en España](@guia-mejores)', 'Comparas proveedores y quieres saber qué ofrece cada uno, para quién es y qué precio publica'],
          ['¿Cómo vendo una promoción que aún no existe?', '[Cómo vender viviendas sobre plano](@guia-sobre-plano)', 'Preparas una preventa y necesitas saber qué enseñar y qué exige la ley a la publicidad'],
          ['¿Cómo abre mi comprador la vivienda en realidad aumentada?', '[Ver una vivienda en realidad aumentada](@guia-ar)', 'Vas a enviar la AR a un comprador y quieres explicarle cómo abrirla en iPhone o Android'],
        ],
      },
      {
        type: 'pages',
        h2: 'Todas las guías',
        intro: 'Ordenadas desde la decisión de presupuesto hasta el uso con el comprador.',
        ids: ['guia-precio-render', 'guia-precio-plano', 'guia-plano-2d-3d', 'guia-ia-vs-3d', 'guia-matterport', 'guia-mejores', 'guia-sobre-plano', 'guia-ar'],
      },
      {
        type: 'prose',
        h2: '¿Cómo hacemos estas guías?',
        body: 'Con cuatro reglas que puedes comprobar en cada una:\n\n- **Cada cifra de mercado enlaza a la página que la publica**, con la fecha en que la consultamos. Si un estudio da un rango, copiamos el rango; si da un «desde», copiamos el «desde».\n- **Solo fuentes primarias para los datos del mercado inmobiliario**, como el Colegio de Registradores, el Ministerio de Vivienda o el BOE. No citamos cifras que solo aparecen en resúmenes de buscadores o de IA.\n- **Separamos lo nuestro de lo ajeno.** Las tarifas de otros estudios van en las tablas de mercado; las nuestras, en [precios](@precios), y cuando las comparamos lo decimos.\n- **Avisamos de que somos parte interesada.** Vendemos visualización 3D, así que ninguna de estas guías es neutral. Por eso explicamos también cuándo te conviene otra opción: un escaneo si la vivienda está terminada, un programa gratuito si tienes tiempo o un estudio de exteriores si solo necesitas una fachada.\n\nLa fecha de «Actualizado el» de cada guía cambia solo cuando cambia su contenido.',
      },
      {
        type: 'steps',
        h2: '¿Por dónde empiezo si nunca he encargado un modelo 3D?',
        intro: 'Un orden de lectura que va de ver un resultado a pedir precio.',
        items: [
          { title: 'Mira un resultado real', body: 'Abre la [villa en la Costa del Sol](@caso-villa) en el visor y en realidad aumentada. Es nuestro caso demostrativo: {{villa:rooms}} estancias modeladas desde un único plano, sin fotos.' },
          { title: 'Sitúa el precio en el mercado', body: 'Lee [cuánto cuesta un render 3D en España](@guia-precio-render) o, si solo quieres la planta, [cuánto cuesta un plano 3D](@guia-precio-plano).' },
          { title: 'Descarta lo que no te sirve', body: 'Si dudas entre la IA, un escaneo o un modelo, las comparativas [IA o modelo 3D real](@guia-ia-vs-3d) y [modelo 3D, Matterport o tour 360](@guia-matterport) te dicen qué obtienes con cada opción. Si ya sabes qué necesitas, la [comparativa de estudios y herramientas de España](@guia-mejores) te dice quién lo hace.' },
          { title: 'Pide precio cerrado', body: 'Con el plano delante te decimos qué pack encaja y cuánto cuesta, y si quieres modelamos antes una estancia gratis. Nuestras tarifas están en [precios](@precios).' },
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        title: '¿Un término técnico te frena?',
        body: 'Cada término técnico de las guías, como [USDZ](@glosario#usdz), [AR Quick Look](@glosario#ar-quick-look) o el [modo maqueta](@glosario#modo-maqueta), enlaza a su definición en el glosario, en menos de 40 palabras. Las dudas rápidas sobre plazos, precios y portales están en las [preguntas frecuentes](@faq).',
      },
    ],
    related: ['caso-villa', 'precios', 'glosario', 'faq', 'como-funciona'],
    cta: {
      h2: '¿Prefieres preguntarlo directamente?',
      body: 'Envíanos el plano o tu duda y te contesta una persona, con precio y plazo cerrados si nos lo pides. Si quieres ver el resultado antes, modelamos gratis una estancia y te la enviamos con realidad aumentada.',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'Guides to 3D property visualisation in Spain',
    description: 'Sourced guides for estate agents and developers: 3D rendering costs in Spain, AI vs a real 3D model, Matterport vs a 3D model and viewing homes in AR.',
    h1: 'Guides to 3D visualisation for property',
    lead: 'Guides for estate agents, developers and architects deciding how to show a property in 3D: what it costs in Spain, whether AI or a scan will do, and how buyers open a home in augmented reality. Every market figure links to its source. Our rates sit apart: 3D floor plans from {{price:plano3d}} + VAT, in {{delivery:plano3d}}.',
    breadcrumb: 'Guides',
    card: {
      title: 'Guides',
      summary: 'Sourced 3D rendering and floor plan prices for Spain, AI vs a real 3D model, Matterport and studios compared, and AR viewing step by step.',
    },
    facts: [
      ['For', 'Estate agents, developers and architects'],
      ['Prices', '3D rendering and 3D floor plans in Spain, with sources'],
      ['Comparisons', 'AI vs a 3D model; Matterport or 360 tour; studios in Spain'],
      ['How-to', 'Viewing a property in AR on iPhone and Android'],
      ['Data checked', 'September 2026'],
      ['Written by', 'The {{brand}} team, an interested party'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Which guide do you need?',
        answer: 'The one that matches the decision in front of you. Budgeting for a listing or a launch? Start with 3D rendering or 3D floor plan costs in Spain. Shown an AI image and wondering if it will do? Read AI vs a real 3D model. Weighing a scan against a model? See our Matterport comparison. Choosing a supplier? Read our studio round-up.',
        body: 'The guides come in three kinds. **Price guides** gather rates published by studios and platforms working in Spain, in euros, each linked to its source; handy if you are used to UK or North American price guides. **Comparisons** set two options side by side on the same criteria and say when each one makes sense, including when the answer isn’t us. **How-to guides** walk through a task step by step, such as opening a property in AR on a buyer’s phone.\n\nWe publish two further guides in Spanish for agencies and developers in Spain: converting a plan to 3D yourself, and selling off-plan under Spanish advertising rules. The language switch at the top of this page takes you to them.',
      },
      {
        type: 'table',
        h2: 'Which guide answers your question?',
        caption: 'Our English guides by question and stage of the decision',
        head: ['Your question', 'Guide', 'Most useful when…'],
        rows: [
          ['How much does 3D rendering cost in Spain?', '[3D rendering cost in Spain](@guia-precio-render)', 'You are comparing quotes per image, per home or per development, in euros'],
          ['How much does a 3D floor plan cost in Spain?', '[3D floor plan cost in Spain](@guia-precio-plano)', 'You only need the furnished layout for a listing and want to know what a fair price per floor is'],
          ['Can AI turn my floor plan into 3D?', '[AI floor plan to 3D](@guia-ia-vs-3d)', 'Someone has shown you an AI image and you wonder whether it is enough to sell with'],
          ['Do I need Matterport or a 360 tour?', '[3D model, Matterport or 360 tour](@guia-matterport)', 'You are torn between scanning or photographing the home and modelling it from the plan, or it has not been built yet'],
          ['Which 3D visualisation studio should I use?', '[Best 3D visualisation studios in Spain](@guia-mejores)', 'You are comparing suppliers and want to know what each offers, who it suits and what it charges'],
          ['How does a buyer view a home in AR?', '[Viewing a property in AR](@guia-ar)', 'You are about to send AR to a buyer abroad and want to explain how to open it on an iPhone or Android phone'],
        ],
      },
      {
        type: 'pages',
        h2: 'All our guides in English',
        intro: 'From setting a budget to putting the home on your buyer’s coffee table.',
        ids: ['guia-precio-render', 'guia-precio-plano', 'guia-ia-vs-3d', 'guia-matterport', 'guia-mejores', 'guia-ar'],
      },
      {
        type: 'prose',
        h2: 'How do we write these guides?',
        body: 'Four rules you can check in every guide:\n\n- **Every market figure links to the page that publishes it**, with the date we checked it. Ranges are quoted as ranges and “from” prices as “from” prices.\n- **Primary sources only for property market data**, such as the Colegio de Registradores (Spain’s land registrars), government ministries or the BOE, Spain’s official gazette. We do not quote figures that only appear in search engine or AI summaries.\n- **Our prices are kept apart.** Other studios’ rates go in the market tables; ours are on the [pricing page](@precios), and we say so whenever we compare.\n- **We declare our interest.** We sell 3D visualisation, so none of these guides is neutral. That is why each one also says when another option suits you better: a scan if the home is finished, a free app if you have the time, or an exterior specialist if all you need is a façade.\n\nThe “Updated” date on each guide changes only when its content does.',
      },
      {
        type: 'steps',
        h2: 'Where should I start if I have never ordered a 3D model?',
        intro: 'A reading order that runs from seeing a result to asking for a price.',
        items: [
          { title: 'Look at a real result', body: 'Open the [Costa del Sol villa](@caso-villa) in the viewer and in augmented reality. It is our demonstration case: {{villa:rooms}} rooms modelled from a single floor plan, with no photos.' },
          { title: 'Put the price in context', body: 'Read [how much 3D rendering costs in Spain](@guia-precio-render) or, if you only need the layout, [what a 3D floor plan costs](@guia-precio-plano), with published rates alongside our own.' },
          { title: 'Rule out what won’t work', body: 'If you are weighing AI, a scan or a model, the comparisons [AI floor plan to 3D](@guia-ia-vs-3d) and [3D model, Matterport or 360 tour](@guia-matterport) show what you get from each. Once you know what you need, our [round-up of studios and tools in Spain](@guia-mejores) shows who does it.' },
          { title: 'Ask for a fixed price', body: 'With your floor plan in front of us, we tell you which package fits and what it costs, and if you like we model one room free of charge first. Our rates are on the [pricing page](@precios).' },
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Stuck on a technical term?',
        body: 'Technical terms in the guides, such as [USDZ](@glosario#usdz), [AR Quick Look](@glosario#ar-quick-look) or [cut-away mode](@glosario#modo-maqueta), link to a definition of under 40 words in our glossary. Quick answers on turnaround, prices and property portals are in the [FAQ](@faq).',
      },
    ],
    related: ['caso-villa', 'precios', 'glosario', 'faq', 'como-funciona'],
    cta: {
      h2: 'Would you rather just ask?',
      body: 'Send us your floor plan or your question and a real person replies, with a fixed price and turnaround if you want one. To see the result first, we model one room free of charge and send it to you in augmented reality.',
    },
  },
};
