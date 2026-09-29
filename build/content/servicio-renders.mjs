// Service page: photorealistic real estate renders / infografías 3D from the plan.
// ES cluster C2 (02-keywords-es.md), EN cluster C4 (03-keywords-en.md).
// Stat verified 2026-09-28 in the primary source (INE press release ETDP July 2026).

const INE = 'https://www.ine.es/dyngs/Prensa/ETDP0726.htm';

export default {
  id: 'servicio-renders',
  image: 'villa_interior_salon',
  datePublished: '2026-09-28',
  dateModified: '2026-09-29',

  es: {
    title: 'Renders inmobiliarios fotorrealistas desde el plano',
    description: 'Renders e infografías 3D en 4K a partir del plano, sin fotos: 6 incluidos en la maqueta 3D desde {{price:maqueta}} + IVA. Render extra: {{extra:render}}.',
    h1: 'Renders inmobiliarios fotorrealistas a partir del plano',
    lead: 'Hacemos renders inmobiliarios fotorrealistas en 4K a partir del plano 2D, sin fotos, para agencias y promotoras. Salen del mismo modelo 3D que el visor y la realidad aumentada, así que todo coincide. La maqueta 3D completa incluye 6 renders desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}; cada render adicional, {{extra:render}} + IVA.',
    breadcrumb: 'Renders inmobiliarios',
    card: {
      title: 'Renders inmobiliarios',
      summary: 'Renders fotorrealistas en 4K desde el plano, coherentes entre sí, con el visor y con la realidad aumentada.',
    },
    hero: {
      image: 'villa_interior_salon',
      alt: 'Salón de la villa a la altura de los ojos, con sofá, lámpara de pie encendida y tres hojas correderas abiertas a la terraza con tumbonas. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
      caption: 'Salón a la altura de los ojos. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
    },
    facts: [
      ['Entrada', 'Plano 2D, sin fotos de la vivienda'],
      ['Resolución', '4K, en PNG o JPG'],
      ['Incluidos', '6 renders en la maqueta completa; 12 en promociones'],
      ['Render adicional', '{{extra:render}} + IVA por imagen'],
      ['Motor', 'Blender Cycles con luz solar física'],
      ['Plazo', '{{delivery:maqueta}}; urgente en 48 h (+{{extra:urgente}})'],
      ['Revisiones', '{{revisions:maqueta}}'],
      ['Etiquetado', 'Cada imagen indica que es un render'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué es un render 3D inmobiliario?',
        answer: 'Un [render 3D](@glosario#render) es una imagen fotorrealista calculada por ordenador a partir de un modelo 3D: geometría, materiales y luz. En inmobiliaria sirve para enseñar una vivienda que aún no existe, que está vacía o que necesita reforma. Promotoras y arquitectos lo llaman [infografía 3D](@glosario#infografia-3d); es lo mismo.',
        body: 'Calculamos cada imagen con Blender Cycles, que simula cómo rebota la luz del sol en cada superficie: por eso las sombras, los reflejos y el vidrio se comportan como en una foto. Las texturas se crean para cada proyecto, sin bancos de imágenes ni licencias de terceros.',
      },
      {
        type: 'gallery',
        h2: 'Renders de la villa de demostración',
        intro: 'Todas las imágenes son renders 3D de la villa anonimizada de nuestro caso, en la Costa del Sol, generados a partir de su plano 2D y sin fotos: primero a la altura de los ojos, con techo y lámparas encendidas, y después desde arriba con los muros cortados. Las {{villa:renders}} imágenes del caso (6 vistas aéreas, 4 a la altura de los ojos, la planta cenital, la planta de líneas y la imagen para redes) se calcularon en unos {{villa:renderMinutes}} minutos en total con una sola tarjeta gráfica. El cielo y el mar que se ven por las ventanas son un fondo ilustrativo.',
        items: [
          {
            image: 'villa_interior_dormitorio',
            alt: 'Dormitorio principal a la altura de los ojos, con cama de 180, cabecero de obra, lámparas de mesilla encendidas y puerta corredera a la terraza. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
            caption: 'Dormitorio principal con luz de media tarde. Render 3D de la villa anonimizada.',
          },
          {
            image: 'villa_interior_bano',
            alt: 'Baño en suite a la altura de los ojos, con bañera exenta redonda, porcelánico negro, espejo redondo y pared de terrazo. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
            caption: 'Baño en suite con bañera exenta. Render 3D de la villa anonimizada.',
          },
          {
            image: 'villa_terraza',
            alt: 'Terraza principal de la villa vista desde arriba, con suelo de barro cocido, dos tumbonas, sofá exterior y un olivo en maceta. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
            caption: 'La terraza principal desde arriba. Render 3D de la villa anonimizada.',
          },
          {
            image: 'villa_interior_terraza',
            alt: 'La misma terraza a la altura de los ojos, con sofá exterior, mesa baja, olivo en maceta y el peto blanco. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
            caption: 'La misma terraza, a la altura de los ojos. Render 3D de la villa anonimizada.',
          },
          {
            image: 'villa_salon_dormitorio',
            alt: 'Salón y dormitorio principal de la villa amueblados, vistos desde arriba con los muros cortados. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
            caption: 'Salón y dormitorio principal con los muros cortados. Render 3D de la villa anonimizada.',
          },
          {
            image: 'villa_muros_completos',
            alt: 'Vista aérea exterior de la planta alta de la villa con los muros a altura completa y las dos terrazas. Render 3D de la villa anonimizada, generado a partir del plano 2D.',
            caption: 'Muros completos a 2,60 m. Render 3D de la villa anonimizada.',
          },
        ],
      },
      {
        type: 'answer',
        h2: '¿Por qué renders desde un modelo 3D y no con IA sobre fotos?',
        answer: 'Porque todas las imágenes salen de la misma geometría: la ventana del salón está en el mismo sitio en cada render, en el visor y en la realidad aumentada. La IA sobre fotos genera cada imagen por separado, necesita que la vivienda exista y puede inventar huecos o cambiar proporciones sin avisar.',
        body: 'La IA es rápida y barata para redecorar una foto concreta, y a veces basta. Para obra nueva, para una promoción con varias tipologías o para un dosier que el comprador va a revisar con lupa, compensa que cada imagen sea fiel al plano. Lo comparamos a fondo en [IA o modelo 3D real](@guia-ia-vs-3d).',
      },
      {
        type: 'table',
        h2: '¿Render desde un modelo 3D, IA sobre fotos o estudio de infografía?',
        intro: 'Tres formas de conseguir imágenes para un anuncio o una promoción, comparadas por lo que importa a una agencia.',
        caption: 'Formas de conseguir renders para vender una vivienda',
        head: ['Criterio', 'Render desde modelo 3D ({{brand}})', 'Render con IA sobre fotos', 'Estudio de infografía por encargo'],
        rows: [
          ['Punto de partida', 'Plano 2D', 'Fotos de la vivienda', 'Planos y reuniones de proyecto'],
          ['Obra nueva sin construir', 'Sí', 'No', 'Sí'],
          ['Coherencia entre imágenes', 'Misma geometría en todas las vistas', 'Cada imagen se genera aparte', 'Sí, si parte de un modelo'],
          ['Visor web y realidad aumentada', 'Incluidos en la maqueta completa', 'No', 'Según el estudio, con presupuesto aparte'],
          ['Precio', 'Público: 6 renders desde {{price:maqueta}} + IVA', 'Público en muchas herramientas', 'Normalmente bajo presupuesto'],
          ['Plazo habitual', '{{delivery:maqueta}}', 'Minutos u horas', 'De días a semanas, según el estudio'],
        ],
        note: 'Los rangos de precio del mercado español, con fuentes enlazadas, están en [cuánto cuesta un render 3D en España](@guia-precio-render).',
      },
      {
        type: 'answer',
        h2: '¿Qué vistas incluye un pack de renders?',
        answer: 'Las que necesite tu anuncio. Con la maqueta completa eliges 6 vistas en 4K: lo habitual es salón, cocina, dormitorio principal, un baño, la terraza y una vista aérea de la maqueta seccionada, que enseña toda la distribución de un vistazo. Cada vista extra cuesta {{extra:render}} + IVA.',
        body: 'Para interiores usamos cámaras a la altura de los ojos o vistas elevadas con los muros cortados, como las de la villa. La luz es la de una tarde mediterránea, calculada en el render y no añadida después. La planta cenital a color y la planta 2D redibujada van incluidas aparte de esas 6 vistas.',
      },
      {
        type: 'process',
        variant: 'list',
        h2: '¿Cómo es un encargo de renders inmobiliarios?',
        intro: 'Primero el modelo, después las cámaras. Por eso cambiar un material o un encuadre no obliga a empezar de nuevo.',
      },
      {
        type: 'answer',
        h2: '¿Hacéis renders para promociones de obra nueva?',
        answer: 'Sí. El pack de promoción incluye 3 tipologías modeladas y amuebladas, 12 renders en 4K, visor con selector de tipología y realidad aumentada, desde {{price:promocion}} + IVA en {{delivery:promocion}}. Cada tipología adicional cuesta {{extra:tipologia}} + IVA, con los mismos materiales para que toda la promoción se vea coherente.',
        body: 'Si vendes sobre plano, mira también nuestra página para [promotoras de obra nueva](@sol-promotoras): cómo usar renders, visor y AR en la sala de ventas y en ferias.\n\nTrabajamos en remoto desde Marbella para toda España. Si tu cartera está en la costa malagueña, mira también el [render 3D en Marbella](@zona-marbella), los [renders de obra nueva en Málaga](@zona-malaga) y nuestro trabajo en la [Costa del Sol](@zona-costa-del-sol).',
      },
      {
        type: 'stat',
        value: '21,6 %',
        label: 'de las viviendas vendidas en España en julio de 2026 eran nuevas: 13.289 compraventas inscritas en un solo mes',
        source: { label: 'INE, Estadística de Transmisiones de Derechos de la Propiedad', url: INE },
        year: 'julio de 2026',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Cada render va etiquetado como render',
        body: 'Entregamos cada imagen con su mención, como texto para el pie de foto del anuncio: «Render 3D. Imagen orientativa; mobiliario no incluido». En obra nueva añadimos «no contractual», porque los acabados finales pueden cambiar. Así el comprador sabe qué está viendo y la visita no le decepciona.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: '¿Cuánto cuestan los renders inmobiliarios?',
        intro: 'Precios públicos, sin IVA. La maqueta completa incluye 6 renders en 4K y el pack de promoción, 12. Cada render adicional cuesta {{extra:render}}. Para ver cómo encaja con el mercado, consulta [cuánto cuesta un render 3D en España](@guia-precio-render).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Cuánto cuestan vuestros renders?',
        a: 'En {{brand}}, 6 renders en 4K van incluidos en la maqueta 3D completa desde {{price:maqueta}} + IVA, junto con el modelo, el visor web y la realidad aumentada. Cada render adicional cuesta {{extra:render}} + IVA, y el pack de promoción incluye 12. Si quieres compararlo con el mercado, lee [cuánto cuesta un render 3D en España](@guia-precio-render).',
      },
      {
        q: '¿Qué es una infografía 3D?',
        a: 'Una infografía 3D es lo mismo que un render 3D: una imagen fotorrealista de un espacio calculada a partir de un modelo digital. El término es habitual entre promotoras y arquitectos en España; las agencias suelen decir render. {{brand}} entrega infografías 3D de viviendas en 4K a partir del plano 2D, sin fotos, en {{delivery:maqueta}}.',
      },
      {
        q: '¿Se pueden hacer renders sin fotos de la vivienda?',
        a: 'Sí. {{brand}} hace los renders a partir del plano 2D: modelamos la vivienda a escala, la amueblamos y calculamos la luz. Si la vivienda existe y nos mandas fotos de los acabados, los reproducimos; si es obra nueva, usamos la memoria de calidades o te proponemos materiales. La villa de nuestro caso se hizo sin una sola foto.',
      },
      {
        q: '¿Cuánto tarda un render?',
        a: '{{brand}} entrega los renders con la maqueta 3D completa en {{delivery:maqueta}}, porque primero hay que modelar la vivienda. Con el modelo hecho, calcular una imagen es rápido: las {{villa:renders}} imágenes de nuestra villa de demostración, vistas y plantas incluidas, se calcularon en unos {{villa:renderMinutes}} minutos. Si lo necesitas antes, la entrega urgente en 48 horas tiene un recargo del {{extra:urgente}}.',
      },
      {
        q: '¿Puedo pedir cambios en los muebles o los materiales?',
        a: 'Sí. La maqueta 3D completa incluye {{revisions:maqueta}}: puedes cambiar muebles, suelos, colores o encuadres y {{brand}} vuelve a calcular las imágenes sobre el mismo modelo. Si quieres decorar la vivienda en otro estilo completo, eso es [home staging virtual sobre el modelo 3D](@servicio-staging), a {{extra:staging}} + IVA por estancia.',
      },
      {
        q: '¿Cuál es la mejor IA para crear renders?',
        a: 'Depende de lo que necesites. Las herramientas de IA son rápidas para redecorar una foto existente, pero no sirven si la vivienda no está construida y cada imagen se genera por separado. {{brand}} trabaja sobre un modelo 3D a escala, así que las vistas, el visor y la realidad aumentada coinciden. Lo comparamos en [IA o modelo 3D real](@guia-ia-vs-3d).',
      },
      {
        q: '¿Puedo publicar los renders en idealista y Fotocasa?',
        a: 'Sí. Los renders de {{brand}} son imágenes en 4K que subes al anuncio como cualquier foto. Te recomendamos mantener la mención de que son renders, sobre todo en obra nueva, para que el comprador sepa qué está viendo. Además puedes enlazar el visor 3D de la misma vivienda desde tu web, por email o por WhatsApp.',
      },
      {
        q: '¿Qué diferencia hay entre un render y una foto retocada?',
        a: 'Una foto retocada parte de algo que existe; un render parte del modelo 3D, así que puede enseñar una vivienda sin construir o una reforma sin hacer. {{brand}} calcula cada render con luz física en Blender Cycles, por eso sombras y reflejos son coherentes. Y cada imagen se entrega etiquetada como render, para no confundir al comprador.',
      },
    ],
    related: ['servicio-staging', 'servicio-tour', 'caso-villa', 'precios', 'guia-precio-render'],
    cta: {
      h2: '¿Quieres ver tu plano en renders?',
      body: 'Envíanos el plano y modelamos gratis una estancia en 3D, con realidad aumentada, para que compruebes la calidad antes de encargar. Sin compromiso y con respuesta de una persona.',
    },
  },

  en: {
    title: 'Real estate 3D rendering in Spain, from floor plans',
    description: 'Photorealistic 4K property CGI from the floor plan, no photos needed. 6 renders come with the complete 3D model, from {{price:maqueta}} + VAT.',
    h1: 'Real estate 3D rendering and CGI from the floor plan',
    lead: 'Photorealistic 4K renders made from the 2D floor plan with no photos, for estate agents and developers selling in Spain. They come from the same 3D model as the web viewer and AR. The complete 3D model includes 6 renders from {{price:maqueta}} + VAT in {{delivery:maqueta}}; extra renders cost {{extra:render}} + VAT.',
    breadcrumb: '3D rendering',
    card: {
      title: 'Real estate 3D rendering',
      summary: 'Photorealistic 4K renders from the floor plan, consistent with each other, with the web viewer and with AR.',
    },
    hero: {
      image: 'villa_interior_salon',
      alt: 'The villa’s living room at eye level, with a sofa, a lit floor lamp and three sliding panels open onto the terrace and its sun loungers. 3D render of the anonymised villa, generated from the 2D floor plan.',
      caption: 'Living room at eye level. 3D render of the anonymised villa, from the 2D floor plan.',
    },
    facts: [
      ['Input', '2D floor plan, no photos of the home'],
      ['Resolution', '4K, as PNG or JPG'],
      ['Included', '6 renders with the complete model; 12 for developments'],
      ['Extra render', '{{extra:render}} + VAT per image'],
      ['Engine', 'Blender Cycles with physically based sunlight'],
      ['Turnaround', '{{delivery:maqueta}}; 48 h rush (+{{extra:urgente}})'],
      ['Revisions', '{{revisions:maqueta}}'],
      ['Labelling', 'Every image is marked as a 3D render'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What is 3D rendering in real estate?',
        answer: 'A [3D render](@glosario#render) is a photorealistic image calculated by a computer from a 3D model: geometry, materials and light. Estate agents and developers use renders, often called property CGI in the UK, to show a home that is not built yet, is empty, or needs refurbishing, long before a photographer could.',
        body: 'We calculate every image in Blender Cycles, which simulates how sunlight bounces off each surface, so shadows, reflections and glass behave as they would in a photograph. Textures are created for each project, with no stock libraries and no third-party licences to worry about.',
      },
      {
        type: 'gallery',
        h2: 'Renders from the demo villa',
        intro: 'Every image below is a 3D render of the anonymised villa from our case study on the Costa del Sol, generated from its 2D floor plan with no photos: first at eye level, with ceilings and the lamps switched on, then from above with the walls cut away. The case’s {{villa:renders}} images (6 aerial views, 4 eye-level views, the top-down plan, the line plan and the social media image) took about {{villa:renderMinutes}} minutes to render in total on a single graphics card. The sky and sea seen through the windows are an illustrative backdrop.',
        items: [
          {
            image: 'villa_interior_dormitorio',
            alt: 'Main bedroom at eye level, with a 180 cm bed, a built-in headboard, lit bedside lamps and a sliding door to the terrace. 3D render of the anonymised villa, generated from the 2D floor plan.',
            caption: 'Main bedroom in late-afternoon light. 3D render of the anonymised villa.',
          },
          {
            image: 'villa_interior_bano',
            alt: 'En-suite bathroom at eye level, with a round freestanding tub, black porcelain tiles, a round mirror and a terrazzo wall. 3D render of the anonymised villa, generated from the 2D floor plan.',
            caption: 'En-suite bathroom with a freestanding tub. 3D render of the anonymised villa.',
          },
          {
            image: 'villa_terraza',
            alt: 'The villa’s main terrace seen from above, with a terracotta floor, two sun loungers, an outdoor sofa and a potted olive tree. 3D render of the anonymised villa, generated from the 2D floor plan.',
            caption: 'The main terrace from above. 3D render of the anonymised villa.',
          },
          {
            image: 'villa_interior_terraza',
            alt: 'The same terrace at eye level, with an outdoor sofa, a low table, a potted olive tree and the white parapet. 3D render of the anonymised villa, generated from the 2D floor plan.',
            caption: 'The same terrace, at eye level. 3D render of the anonymised villa.',
          },
          {
            image: 'villa_salon_dormitorio',
            alt: 'Furnished living room and main bedroom of the villa, seen from above with the walls cut away. 3D render of the anonymised villa, generated from the 2D floor plan.',
            caption: 'Living room and main bedroom with the walls cut away. 3D render of the anonymised villa.',
          },
          {
            image: 'villa_muros_completos',
            alt: 'Aerial exterior view of the villa’s upper floor with full-height walls and both terraces. 3D render of the anonymised villa, generated from the 2D floor plan.',
            caption: 'Full-height walls at 2.60 m. 3D render of the anonymised villa.',
          },
        ],
      },
      {
        type: 'answer',
        h2: 'Why render from a 3D model rather than use AI on photos?',
        answer: 'Because every image comes from the same geometry: the living room window sits in the same place in each render, in the viewer and in AR. AI staging on photos generates each image separately, needs the home to exist, and can quietly invent openings or change proportions.',
        body: 'AI is quick and cheap for restyling a single photo, and sometimes that is all you need. For off-plan sales, a development with several unit types, or a brochure a buyer in London or Amsterdam will study closely, it pays for every image to match the plan. Our [AI vs real 3D model guide](@guia-ia-vs-3d) goes into detail.',
      },
      {
        type: 'table',
        h2: 'Model-based renders, AI on photos or a CGI studio?',
        intro: 'Three ways to get images for a listing or a development, compared on what matters to an agency.',
        caption: 'Ways to get renders for selling a home',
        head: ['Criterion', 'Rendered from a 3D model ({{brand}})', 'AI render from photos', 'Bespoke CGI studio'],
        rows: [
          ['Starting point', '2D floor plan', 'Photos of the home', 'Drawings and project meetings'],
          ['Off-plan, not yet built', 'Yes', 'No', 'Yes'],
          ['Consistency between images', 'Same geometry in every view', 'Each image generated separately', 'Yes, if built from a model'],
          ['Web viewer and AR', 'Included with the complete model', 'No', 'Varies, usually quoted separately'],
          ['Price', 'Public: 6 renders from {{price:maqueta}} + VAT', 'Public for many tools', 'Usually on request'],
          ['Typical turnaround', '{{delivery:maqueta}}', 'Minutes to hours', 'Days to weeks, depending on the studio'],
        ],
        note: 'Market price ranges in euros, with linked sources, are in our [3D rendering cost guide for Spain](@guia-precio-render).',
      },
      {
        type: 'answer',
        h2: 'Which views come with a render package?',
        answer: 'Whichever your listing needs. With the complete model you choose 6 views in 4K: typically the living room, kitchen, main bedroom, a bathroom, the terrace and an aerial view of the cut-away model, which shows the whole layout at a glance. Each extra view costs {{extra:render}} + VAT.',
        body: 'Interiors are shot either at eye level or from above with the walls cut away, as in the villa. The light is a Mediterranean late afternoon, calculated in the render rather than painted in afterwards. The colour top-down plan and the redrawn 2D plan come on top of those 6 views.',
      },
      {
        type: 'process',
        variant: 'list',
        h2: 'How does a rendering project work?',
        intro: 'Model first, cameras second. That is why changing a material or a camera angle never means starting again.',
      },
      {
        type: 'answer',
        h2: 'Do you render off-plan developments?',
        answer: 'Yes. The development package covers 3 unit types, modelled and furnished, with 12 renders in 4K, a viewer with a unit-type selector and augmented reality, from {{price:promocion}} + VAT in {{delivery:promocion}}. Each extra unit type costs {{extra:tipologia}} + VAT and shares the same materials, so the whole scheme looks consistent.',
        body: 'Selling off-plan to buyers abroad? See our page on [off-plan 3D visualisation](@sol-promotoras) for how renders, the viewer and AR work in a sales suite and at property fairs.\n\nWe work remotely from Marbella for clients across Spain and abroad; for local context, see [3D rendering in Marbella and the Costa del Sol](@zona-marbella).',
      },
      {
        type: 'stat',
        value: '21.6%',
        label: 'of homes sold in Spain in July 2026 were new builds: 13,289 registered sales in a single month',
        source: { label: 'INE (Spanish National Statistics Institute), Property Transfer Statistics', url: INE },
        year: 'July 2026',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Every render is labelled as a render',
        body: 'We deliver every image with its label, as caption text for the listing: “3D render. Indicative image; furniture not included.” For off-plan homes we add “not contractual”, because final finishes may change. Buyers know what they are looking at, and the viewing does not disappoint.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'How much should a 3D rendering cost?',
        intro: 'Public prices, excluding VAT. The complete model includes 6 renders in 4K and the development package 12; each extra render costs {{extra:render}}. For wider context, see [3D rendering costs in Spain](@guia-precio-render), with sourced market ranges.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'How much do your renders cost?',
        a: 'At {{brand}}, 6 renders in 4K come with the complete 3D model from {{price:maqueta}} + VAT, together with the model, the web viewer and augmented reality. Each extra render costs {{extra:render}} + VAT, and the development package includes 12. To compare with the wider market, read [how much 3D rendering costs in Spain](@guia-precio-render).',
      },
      {
        q: 'What is CGI in property?',
        a: 'In property marketing, CGI (computer-generated imagery) means renders: photorealistic images of a home produced from a 3D model rather than a camera. UK developers use the term for off-plan brochures and hoardings. {{brand}} produces property CGI in 4K from the 2D floor plan, with no photos, in {{delivery:maqueta}}.',
      },
      {
        q: 'Can you render a home without any photos?',
        a: 'Yes. {{brand}} renders from the 2D floor plan: we model the home to scale, furnish it and calculate the light. If the home exists and you send photos of its finishes, we match them; for new builds we follow the developer’s specification sheet or propose materials. Our demo villa was produced without a single photo.',
      },
      {
        q: 'How long does a rendering take?',
        a: '{{brand}} delivers renders with the complete 3D model in {{delivery:maqueta}}, because the home has to be modelled first. Once the model exists, rendering is quick: the {{villa:renders}} images of our demo villa, views and plans included, took about {{villa:renderMinutes}} minutes in total. If you need them sooner, 48-hour rush delivery carries a {{extra:urgente}} surcharge.',
      },
      {
        q: 'Do you use ChatGPT or other AI to make your renders?',
        a: 'No. General AI chatbots and image tools can produce convincing pictures of rooms, but they invent the space rather than follow your plan, and each image comes out different. For a listing you need views that match the real layout. {{brand}} renders from a to-scale 3D model, so every view, the viewer and AR agree. We compare both in our [AI floor plan guide](@guia-ia-vs-3d).',
      },
      {
        q: 'Can AI images replace a rendered 3D model in a listing?',
        a: 'Not for a listing that has to match the plan. AI already handles quick photo restyling well. What it does not replace is a measured model: the thing that keeps every render, the interactive viewer and the AR file consistent with the floor plan. {{brand}} sells that model, with renders from {{price:maqueta}} + VAT, not one-off pictures.',
      },
      {
        q: 'Can I change furniture or finishes after the first draft?',
        a: 'Yes. The complete 3D model includes {{revisions:maqueta}}: change furniture, flooring, colours or camera angles and {{brand}} re-renders on the same model. If you want the home dressed in a completely different style, that is [3D virtual staging](@servicio-staging), at {{extra:staging}} + VAT per room.',
      },
      {
        q: 'Is 3D visualisation worth it for a home that is already built?',
        a: 'Often, yes: when the home is empty, tenanted, dated or dressed in the owner’s furniture, good photos alone rarely sell the space. {{brand}} can show it furnished and finished from the plan, and give buyers abroad a viewer and AR to explore it before booking flights. If the home looks great as it is, a photographer may be all you need.',
      },
    ],
    related: ['servicio-staging', 'servicio-tour', 'caso-villa', 'precios', 'guia-precio-render'],
    cta: {
      h2: 'Want to see your plan rendered?',
      body: 'Send us the floor plan and we will model one room in 3D, with augmented reality, free, so you can judge the quality before you order. No obligation, and a real person replies.',
    },
  },
};
