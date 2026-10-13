// Guide: how to convert a 2D floor plan into 3D (free software, AI tools, a studio). ES + EN.
// Tool facts re-verified with WebFetch on 2026-09-28 (Sweet Home 3D site and user guide, Blender /about,
// Floorplanner pricing, Planner 5D AI page, Pedra pricing, SketchUp Free page). Our prices come ONLY from tokens.

const SRC = {
  sh3d: 'https://www.sweethome3d.com/',
  sh3dGuide: 'https://www.sweethome3d.com/userGuide.jsp',
  blender: 'https://www.blender.org/about/',
  fp: 'https://floorplanner.com/pricing',
  p5d: 'https://planner5d.com/ai/floor-plan-to-3d-model',
  pedra: 'https://pedra.ai/es/pricing',
  sku: 'https://sketchup.trimble.com/en/plans-and-pricing/sketchup-free',
};

import { plate } from '../data/plates.mjs';

export default {
  id: 'guia-plano-2d-3d',
  image: 'villa_plano_lineas',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  es: {
    title: 'Cómo convertir un plano 2D en 3D: gratis, IA o estudio',
    description: 'Tres formas de pasar un plano 2D a 3D: con un programa gratuito, con IA o con un estudio. Qué obtienes, cuánto tardas y cuándo compensa cada una.',
    h1: 'Cómo convertir un plano 2D en 3D',
    lead: 'Hay tres formas de convertir un plano 2D en 3D: dibujarlo tú con un programa gratuito como Sweet Home 3D, subirlo a una herramienta de IA que lo interpreta en minutos, o encargarlo a un estudio que lo modela a escala. Las dos primeras cuestan tu tiempo; {{brand}} lo entrega en {{delivery:plano3d}}.',
    breadcrumb: 'Plano 2D a 3D',
    card: {
      title: 'Cómo convertir un plano 2D en 3D',
      summary: 'Programa gratuito, herramienta de IA o estudio: qué obtienes con cada opción, cuánto tardas y cuándo compensa.',
    },
    facts: [
      ['Programa gratuito', 'Sweet Home 3D o Blender, horas de trabajo'],
      ['Conversor con IA', 'Minutos, resultado que hay que revisar'],
      ['IA generativa', 'Una imagen, no un modelo medible'],
      ['Estudio de visualización', 'Modelo a escala, renders, visor y AR'],
      ['Entrada mínima', 'Un plano en PDF, JPG o PNG'],
      ['Plano 3D en {{brand}}', 'Presupuesto cerrado, en {{delivery:plano3d}}'],
    ],
    hero: {
      image: 'villa_plano_lineas',
      alt: 'Planta 2D de líneas de la villa anonimizada de la Costa del Sol, redibujada a partir de su modelo 3D',
      caption: 'Planta 2D redibujada desde nuestro modelo 3D. Caso demostrativo de {{brand}}.',
    },
    blocks: [
      {
        type: 'answer',
        h2: '¿Cómo puedo convertir un plano 2D a 3D gratis?',
        answer: 'Con un programa gratuito y tu tiempo. Sweet Home 3D es gratuito y de código abierto: importas la imagen del plano como fondo, fijas la escala con una medida conocida y dibujas encima muros, puertas y ventanas. El programa genera la vista 3D a la vez. Blender también es gratis, pero exige mucha más práctica.',
        body: 'Otras opciones con versión gratuita son Floorplanner, que permite 5 proyectos sin coste con exportación en baja resolución y marca de agua, y SketchUp Free, que funciona en el navegador. Todas sirven para ver una distribución en 3D. La diferencia con un estudio no está en el programa, sino en las horas y en el acabado: fotorrealismo, coherencia entre vistas y archivos listos para publicar.',
      },
      {
        type: 'table',
        h2: '¿Programa gratuito, IA o estudio: qué opción te conviene?',
        intro: 'Cuatro caminos para el mismo plano. La tabla compara lo que recibes, no la marca de la herramienta.',
        caption: 'Cuatro formas de pasar un plano 2D a 3D, comparadas (septiembre de 2026)',
        head: ['Criterio', 'Programa gratuito', 'Conversor con IA', 'IA generativa de imágenes', 'Estudio de visualización'],
        rows: [
          ['Ejemplos', 'Sweet Home 3D, Floorplanner, SketchUp Free, Blender', 'Reconocimiento de planos de Planner 5D, Pedra', 'ChatGPT, Gemini y similares', '{{brand}} y otros estudios de visualización'],
          ['Qué obtienes', 'Un modelo sencillo que dibujas tú', 'Un modelo o una imagen 3D generados desde tu plano', 'Una imagen con aspecto 3D', 'Modelo a escala amueblado, renders, visor y realidad aumentada'],
          ['Tiempo', 'Horas, según tu práctica', 'Minutos, más la revisión', 'Segundos por imagen', '{{delivery:plano3d}} el plano 3D, {{delivery:maqueta}} la maqueta completa'],
          ['Fidelidad al plano', 'La que tú dibujes', 'Depende de la calidad del plano que subas', 'No garantizada: puede mover huecos o cambiar proporciones', 'Revisada muro a muro contra el plano'],
          ['Coste', 'Gratis, con límites en las versiones gratuitas', 'Prueba gratuita o suscripción', 'Gratis o suscripción', 'Presupuesto cerrado'],
          ['Para vender una vivienda', 'Resultado básico, pensado para uso propio', 'Sirve para una imagen rápida si la revisas', 'Solo como imagen orientativa y etiquetada', 'Pensado para anuncios, dosieres y obra nueva'],
        ],
        note: 'Las condiciones de cada herramienta cambian: comprueba en su web qué incluye la versión gratuita y si permite uso comercial antes de publicar el resultado.',
      },
      {
        type: 'steps',
        h2: '¿Cómo hacer un plano de tu casa en 3D paso a paso?',
        intro: 'Con Sweet Home 3D o un programa parecido, estos son los pasos. Son los mismos que seguimos en un estudio, sin los scripts.',
        items: [
          { title: 'Consigue un plano con escala', body: 'Un PDF o una imagen nítida de la planta, con al menos una cota o la superficie total. Sin ninguna medida no hay forma de saber el tamaño real de la vivienda.' },
          { title: 'Importa el plano como fondo', body: 'Carga la imagen en el programa y calibra la escala: marcas una línea sobre una distancia que conoces, como una cota del plano, y escribes su longitud real. La guía de usuario de Sweet Home 3D describe este paso.' },
          { title: 'Dibuja los muros', body: 'Traza los muros sobre el fondo con su grosor y su altura. Los muros exteriores suelen ser más gruesos que los tabiques: respeta lo que marque el plano.' },
          { title: 'Coloca puertas y ventanas', body: 'Inserta cada hueco en su posición y con su ancho. Es donde más errores se cometen, así que compáralo dos veces con el plano.' },
          { title: 'Define suelos y amuebla', body: 'Crea cada estancia, asígnale un suelo y añade muebles de la biblioteca del programa a su tamaño real. Un sofá mal escalado engaña más que ningún otro error.' },
          { title: 'Revisa la vista 3D y exporta', body: 'Gira el modelo, corrige lo que no cuadre y exporta imágenes. Sweet Home 3D guarda la vista 3D en PNG y exporta el modelo a OBJ. Si vas a publicarlas, indica que son una recreación virtual.' },
        ],
      },
      {
        type: 'answer',
        h2: '¿Qué IA puede generar planos 3D?',
        answer: 'Hay dos tipos. Los conversores con IA, como el reconocimiento de planos de Planner 5D, leen la imagen del plano y levantan un modelo 3D que después corriges. La IA generativa de imágenes, como ChatGPT, crea una imagen con aspecto 3D, pero no un modelo con medidas que puedas girar, medir o ver en realidad aumentada.',
        body: 'Planner 5D acepta imágenes y archivos DXF o DWG, ofrece una prueba gratuita por persona y avisa en su propia página de que la calidad de la imagen condiciona el resultado. Pedra convierte un plano en un render 3D por 2 créditos, dentro de un plan de 29 € al mes con 100 créditos.\n\nPara decidir, piensa en qué vas a hacer con el resultado. Si es una idea para ti, cualquiera vale. Si va a un anuncio, revisa cada muro y cada hueco contra el plano. Explicamos la diferencia entre una imagen y un modelo en [¿puede la IA convertir un plano en 3D?](@guia-ia-vs-3d).',
      },
      {
        type: 'compare',
        h2: '¿Qué cambia entre el plano 2D y el modelo 3D?',
        intro: 'Desliza para comparar la planta 2D con la planta cenital renderizada desde el modelo 3D de nuestro caso demostrativo. Las dos salen de la misma geometría.',
      },
      {
        type: 'answer',
        h2: '¿Cuándo compensa encargarlo a un estudio?',
        answer: 'Cuando el 3D va a ayudarte a vender una vivienda. Si el resultado se publica en un anuncio, se enseña a un comprador que vive fuera o representa obra nueva que aún no existe, necesitas que todas las vistas coincidan con el plano, que el material aguante una revisión y que llegue en días sin que tú dediques horas.',
        body: 'Estas son las situaciones en las que un estudio suele salir más a cuenta que hacerlo tú:\n\n- **Obra nueva o venta sobre plano:** no hay fotos que redecorar, solo el plano.\n- **Varias salidas del mismo modelo:** plano 3D, [renders](@servicio-renders), [visor 3D](@servicio-tour) y [realidad aumentada](@servicio-ar), coherentes entre sí.\n- **Volumen:** si publicas varias viviendas al mes, el presupuesto por volumen baja el precio por vivienda.\n- **Tiempo:** cada hora que pasas dibujando muros es una hora sin captar ni atender compradores.',
      },
      {
        type: 'table',
        h2: '¿Qué opción elegir según tu caso?',
        caption: 'Qué opción recomendamos según lo que necesitas',
        head: ['Tu caso', 'Opción razonable', 'Por qué'],
        rows: [
          ['Quiero probar cómo quedaría mi casa con otra distribución', 'Programa gratuito', 'Uso propio, sin prisa y sin publicar el resultado'],
          ['Necesito una idea rápida de un plano para una reunión', 'Conversor con IA', 'Minutos, y un error no llega al comprador'],
          ['Quiero redecorar las fotos de un piso que ya existe', 'Staging con IA sobre fotos, o [home staging virtual sobre el modelo](@servicio-staging)', 'Con buenas fotos, la IA es barata; si necesitas coherencia entre vistas, el modelo'],
          ['Vendo un piso vacío de segunda mano', '[Plano 3D amueblado](@servicio-plano)', 'El comprador entiende la distribución y la escala'],
          ['Vendo obra nueva sobre plano a compradores de fuera', 'Maqueta 3D completa', 'Renders, visor y realidad aumentada desde el plano, sin piso piloto'],
          ['Publico 5 viviendas o más cada mes', 'Estudio, con presupuesto por volumen', 'El precio por vivienda baja y cada una sale igual'],
        ],
      },
      {
        type: 'prose',
        h2: '¿Qué sale de un solo plano? Nuestro caso',
        body: 'Para enseñar lo que da de sí un plano, tomamos la planta publicada de una villa en la Costa del Sol, un único plano 2D sin fotos del interior ni cotas, y la modelamos entera en una sola sesión de trabajo. El resultado tiene {{villa:rooms}} estancias, unos {{villa:interiorM2}} m² interiores y {{villa:terracesM2}} m² de terrazas estimados a escala, {{villa:textures}} texturas [PBR](@glosario#pbr) procedurales y {{villa:triangles}} triángulos.\n\nDe ese modelo salieron 6 [renders](@glosario#render), la planta cenital, la planta 2D redibujada que ves arriba, una imagen para redes, un visor web y los archivos de realidad aumentada para iPhone y Android. Puedes [girar el modelo y verlo en tu salón](@caso-villa#visor). El caso está anonimizado: no reproducimos el plano original.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Las medidas de un plano sin cotas son estimaciones',
        body: 'Cuando el plano no trae cotas, cualquier método, sea un programa, una IA o un estudio, estima las medidas a partir de la escala del dibujo. Las superficies resultantes son aproximadas (≈) y así hay que indicarlo al publicarlas. Con el plano acotado del cliente, el modelo es más preciso.',
      },
      {
        type: 'needs',
        h2: '¿Qué necesitamos si lo hacemos nosotros?',
        intro: 'Si prefieres encargarlo, esto es todo lo que nos hace falta. No visitamos la vivienda.',
      },
      plate('es', 'villa_maqueta_iso_opaco'),
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'Sweet Home 3D: web oficial', url: SRC.sh3d, note: 'Gratuito, licencia GNU GPL. Consultado el 28 sep 2026.' },
          { label: 'Sweet Home 3D: guía de usuario', url: SRC.sh3dGuide, note: 'Importar el plano de fondo y fijar la escala; exportar la vista 3D en PNG.' },
          { label: 'Blender: acerca de Blender', url: SRC.blender, note: 'Software libre, uso comercial permitido.' },
          { label: 'Floorplanner: planes y precios', url: SRC.fp, note: '5 proyectos gratis, exportación a 960 × 540 px con marca de agua. Consultado el 28 sep 2026.' },
          { label: 'SketchUp Free', url: SRC.sku, note: 'Versión gratuita en el navegador.' },
          { label: 'Planner 5D: plano a modelo 3D con IA', url: SRC.p5d, note: 'Acepta imágenes, DXF y DWG; una prueba gratuita por persona.' },
          { label: 'pedra.ai: planes y precios', url: SRC.pedra, note: 'Plano a 3D: 2 créditos por render. Consultado el 28 sep 2026.' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Cómo puedo generar un plano en 3D?',
        a: 'Puedes generar un plano en 3D de tres formas: dibujándolo en un programa gratuito como Sweet Home 3D sobre la imagen de tu plano, subiendo el plano a un conversor con IA que levanta un modelo en minutos, o encargándolo a un estudio. {{brand}} lo modela a escala desde un PDF o una imagen y entrega el plano 3D en {{delivery:plano3d}}, con presupuesto cerrado.',
      },
      {
        q: '¿Qué programa gratuito puedo usar para crear planos 3D?',
        a: 'Sweet Home 3D es gratuito y de código abierto, y permite importar tu plano como fondo y verlo en 3D. Floorplanner tiene un plan gratuito de 5 proyectos con exportación en baja resolución, SketchUp Free funciona en el navegador y Blender es gratuito incluso para uso comercial, aunque más difícil. Si prefieres no dedicar horas, {{brand}} hace el plano 3D por ti, con presupuesto cerrado.',
      },
      {
        q: '¿Puedo convertir un plano en PDF a 3D?',
        a: 'Sí. Puedes exportar la página del PDF como imagen e importarla como fondo en un programa gratuito, o subirla a un conversor con IA; Planner 5D, por ejemplo, admite imágenes y archivos DXF o DWG. {{brand}} trabaja directamente con el PDF, la imagen o el enlace del anuncio, y entrega el plano 3D en {{delivery:plano3d}} o la maqueta completa en {{delivery:maqueta}}.',
      },
      {
        q: '¿Qué IA convierte dibujos en modelos 3D?',
        a: 'Para planos de vivienda, los conversores con IA, como el reconocimiento de planos de Planner 5D, levantan un modelo a partir de la imagen del plano. Las IA generativas de chat devuelven imágenes, no modelos. En los dos casos conviene revisar muros y huecos contra el plano original. {{brand}} lo hace muro a muro y entrega el modelo con renders, visor y realidad aumentada.',
      },
      {
        q: '¿Cómo puedo hacer un render desde un plano?',
        a: 'Primero hay que convertir el plano en un modelo 3D; después se asignan materiales, se ilumina la escena, se coloca la cámara y se calcula la imagen con un motor de render, como Cycles en Blender. Con un programa gratuito puedes hacerlo tú. En {{brand}}, 6 renders en 4K van incluidos en la maqueta 3D completa, que entregamos en {{delivery:maqueta}}.',
      },
      {
        q: '¿Se puede pasar a 3D un plano sin medidas?',
        a: 'Sí, siempre que el plano esté dibujado a escala. Las medidas se estiman a partir de esa escala y de cualquier dimensión conocida, como el ancho de una puerta, por lo que las superficies son aproximadas (≈). {{brand}} modeló así su caso demostrativo, una villa en la Costa del Sol con {{villa:rooms}} estancias, y lo indica en la ficha. Con cotas reales, el resultado es más preciso.',
      },
      {
        q: '¿Cuánto cuesta que un estudio convierta mi plano a 3D?',
        a: 'Un plano 3D cuesta en España entre 100 y 800 € por planta según el nivel de acabado, y hay plataformas en línea desde 40 €. En {{brand}} no publicamos tarifas: te mandamos un presupuesto cerrado del plano 3D o de la maqueta completa al ver tu plano. Tienes todos los rangos del mercado en [cuánto cuesta un plano 3D](@guia-precio-plano).',
      },
      {
        q: '¿Qué tengo que revisar en un plano 3D antes de publicarlo?',
        a: 'Revisa que cada puerta y ventana esté donde marca el plano, que el número de dormitorios y baños coincida, que los muebles tengan un tamaño creíble y que las superficies aproximadas se indiquen como tales. Si el mobiliario es virtual, etiquétalo como recreación. {{brand}} entrega el plano 3D con {{revisions:plano3d}} para corregir lo que no cuadre.',
      },
    ],
    related: ['servicio-plano', 'guia-ia-vs-3d', 'guia-precio-plano', 'caso-villa', 'como-funciona'],
    cta: {
      h2: '¿Te pasamos tu plano a 3D?',
      body: 'Envíanos el plano en PDF, JPG o PNG. Te respondemos con precio cerrado y plazo, y si quieres, con una estancia de prueba en realidad aumentada.',
      service: 'plano3d',
    },
  },

  en: {
    title: 'How to convert a floor plan to 3D: free, AI or studio',
    description: 'Three ways to turn a 2D floor plan into 3D: free software, an AI tool or a studio. What you get, how long it takes and when each one makes sense.',
    h1: 'How to convert a 2D floor plan to 3D',
    lead: 'There are three ways to turn a 2D floor plan into 3D: draw it in free software like Sweet Home 3D, upload it to an AI tool that reads it in minutes, or hand it to a studio that models it to scale. The first two cost time; {{brand}} delivers it in {{delivery:plano3d}}.',
    breadcrumb: '2D plan to 3D',
    card: {
      title: 'How to convert a 2D floor plan to 3D',
      summary: 'Free software, an AI tool or a studio: what you get from each option, how long it takes and when it makes sense.',
    },
    facts: [
      ['Free software', 'Sweet Home 3D or Blender, hours of work'],
      ['AI converter', 'Minutes, with a result you need to check'],
      ['Generative AI', 'An image, not a measurable model'],
      ['Visualisation studio', 'To-scale model, renders, viewer and AR'],
      ['Minimum input', 'A floor plan as PDF, JPG or PNG'],
      ['3D floor plan from {{brand}}', 'Fixed quote, in {{delivery:plano3d}}'],
    ],
    hero: {
      image: 'villa_plano_lineas',
      alt: '2D line plan of the anonymised Costa del Sol villa, redrawn from its 3D model',
      caption: '2D plan redrawn from our 3D model. A {{brand}} demonstration case.',
    },
    blocks: [
      {
        type: 'answer',
        h2: 'How can I convert a 2D floor plan to 3D for free?',
        answer: 'With free software and your own time. Sweet Home 3D is free and open source: you import the plan image as a background, set the scale from a known measurement and draw walls, doors and windows on top. The program builds the 3D view as you go. Blender is free too, but takes far more practice.',
        body: 'Other options with a free tier include Floorplanner, which allows 5 projects at no cost with low-resolution, watermarked exports, and SketchUp Free, which runs in the browser. All of them will show a layout in 3D. The difference from a studio is not the software but the hours and the finish: photorealism, consistency between views and files ready to publish.',
      },
      {
        type: 'table',
        h2: 'Free software, AI or a studio: which option suits you?',
        intro: 'Four routes for the same floor plan. The table compares what you receive, not the brand of the tool.',
        caption: 'Four ways to turn a 2D floor plan into 3D, compared (September 2026)',
        head: ['Criterion', 'Free software', 'AI converter', 'Generative AI images', 'Visualisation studio'],
        rows: [
          ['Examples', 'Sweet Home 3D, Floorplanner, SketchUp Free, Blender', 'Planner 5D’s floor plan recognition, Pedra', 'ChatGPT, Gemini and similar', '{{brand}} and other visualisation studios'],
          ['What you get', 'A simple model you draw yourself', 'A 3D model or image generated from your plan', 'An image that looks 3D', 'A furnished, to-scale model, renders, viewer and augmented reality'],
          ['Time', 'Hours, depending on your experience', 'Minutes, plus checking', 'Seconds per image', '{{delivery:plano3d}} for the 3D floor plan, {{delivery:maqueta}} for the complete model'],
          ['Faithfulness to the plan', 'As good as your drawing', 'Depends on the quality of the plan you upload', 'Not guaranteed: it can move openings or change proportions', 'Checked wall by wall against the plan'],
          ['Cost', 'Free, with limits on free tiers', 'Free trial or subscription', 'Free or subscription', 'Fixed quote'],
          ['For selling a home', 'Basic result, meant for personal use', 'Fine for a quick image if you check it', 'Only as an indicative, labelled image', 'Designed for listings, brochures and new builds'],
        ],
        note: 'Each tool’s terms change: check on its website what the free tier includes and whether commercial use is allowed before publishing the result.',
      },
      {
        type: 'steps',
        h2: 'How do you make a 3D floor plan of your home, step by step?',
        intro: 'With Sweet Home 3D or similar software, these are the steps. They are the same ones we follow in a studio, minus the scripts.',
        items: [
          { title: 'Get a plan with a scale', body: 'A PDF or a sharp image of the floor plan, with at least one dimension or the total floor area. Without any measurement there is no way to know the home’s real size.' },
          { title: 'Import the plan as a background', body: 'Load the image into the program and calibrate the scale: draw a line over a distance you know, such as a dimension on the plan, and type in its real length. The Sweet Home 3D user guide describes this step.' },
          { title: 'Draw the walls', body: 'Trace the walls over the background with their thickness and height. External walls are usually thicker than internal partitions: follow what the plan shows.' },
          { title: 'Place doors and windows', body: 'Insert each opening in its position and at its width. This is where most mistakes happen, so check it twice against the plan.' },
          { title: 'Set floors and furnish', body: 'Create each room, give it a floor finish and add furniture from the program’s library at real size. A badly scaled sofa misleads more than any other error.' },
          { title: 'Check the 3D view and export', body: 'Turn the model around, fix whatever does not fit and export images. Sweet Home 3D saves the 3D view as PNG and exports the model to OBJ. If you are going to publish them, say they are a virtual recreation.' },
        ],
      },
      {
        type: 'answer',
        h2: 'Which AI can generate 3D floor plans?',
        answer: 'There are two kinds. AI converters, such as Planner 5D’s floor plan recognition, read the plan image and build a 3D model that you then correct. Generative AI image tools, such as ChatGPT, create an image that looks 3D, but not a model with dimensions you can turn around, measure or view in augmented reality.',
        body: 'Planner 5D accepts images and DXF or DWG files, offers one free trial per person and warns on its own page that image quality affects the result. Pedra turns a floor plan into a 3D render for 2 credits, on a €29 monthly plan with 100 credits.\n\nTo decide, think about what you will do with the result. If it is an idea for yourself, any of them will do. If it is going into a listing, check every wall and opening against the plan. We explain the difference between an image and a model in [can AI turn a floor plan into 3D?](@guia-ia-vs-3d).',
      },
      {
        type: 'compare',
        h2: 'What changes between the 2D plan and the 3D model?',
        intro: 'Slide to compare the 2D plan with the top-down view rendered from the 3D model of our demo case. Both come from the same geometry.',
      },
      {
        type: 'answer',
        h2: 'When is it worth paying a studio?',
        answer: 'When the 3D is going to help you sell a home. If the result goes into a listing, is shown to a buyer living abroad or represents a new build that does not exist yet, you need every view to match the plan, material that stands up to scrutiny and delivery in days without spending hours of your own.',
        body: 'These are the situations where a studio usually works out better value than doing it yourself:\n\n- **New builds or off-plan sales:** there are no photos to restyle, only the plan.\n- **Several outputs from the same model:** 3D floor plan, [renders](@servicio-renders), [3D viewer](@servicio-tour) and [augmented reality](@servicio-ar), all consistent with each other.\n- **Volume:** if you list several homes a month, a volume quote brings down the price per home.\n- **Time:** every hour spent drawing walls is an hour not spent winning instructions or looking after buyers.',
      },
      {
        type: 'table',
        h2: 'Which option should you choose for your case?',
        caption: 'Which option we recommend for what you need',
        head: ['Your case', 'Sensible option', 'Why'],
        rows: [
          ['I want to see how my home would look with another layout', 'Free software', 'Personal use, no rush and nothing published'],
          ['I need a quick idea of a plan for a meeting', 'AI converter', 'Minutes, and a mistake never reaches a buyer'],
          ['I want to restyle the photos of an existing flat', 'AI staging on photos, or [virtual staging on the model](@servicio-staging)', 'With good photos, AI is cheap; if you need consistent views, the model'],
          ['I am selling an empty resale flat', '[Furnished 3D floor plan](@servicio-plano)', 'Buyers understand the layout and the scale'],
          ['I am selling a new build off-plan to buyers abroad', 'Complete 3D model', 'Renders, viewer and augmented reality from the plan, with no show home'],
          ['I list 5 or more homes every month', 'A studio, with a volume quote', 'The price per home drops and every home comes out the same'],
        ],
      },
      {
        type: 'prose',
        h2: 'What can one floor plan produce? Our case',
        body: 'To show what a single plan can yield, we took the published floor plan of a villa on the Costa del Sol, one 2D plan with no interior photos and no dimensions, and modelled it in full in a single working session. The result has {{villa:rooms}} rooms, about {{villa:interiorM2}} m² inside and {{villa:terracesM2}} m² of terraces estimated from the scale, {{villa:textures}} procedural [PBR](@glosario#pbr) textures and {{villa:triangles}} triangles.\n\nThat model produced 6 [renders](@glosario#render), the top-down plan, the redrawn 2D plan you see above, a social media image, a web viewer and the augmented reality files for iPhone and Android. You can [turn the model around and see it in your living room](@caso-villa#visor). The case is anonymised: we do not reproduce the original plan.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Measurements from a plan without dimensions are estimates',
        body: 'When the plan has no dimensions, any method, whether software, AI or a studio, estimates measurements from the drawing’s scale. The resulting areas are approximate (≈) and should be marked as such when published. With the client’s dimensioned plan, the model is more accurate.',
      },
      {
        type: 'needs',
        h2: 'What do we need if we do it for you?',
        intro: 'If you would rather hand it over, this is all we need. We do not visit the home.',
      },
      plate('en', 'villa_maqueta_iso_opaco'),
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'Sweet Home 3D: official website', url: SRC.sh3d, note: 'Free, GNU GPL licence. Checked 28 Sep 2026.' },
          { label: 'Sweet Home 3D: user guide', url: SRC.sh3dGuide, note: 'Importing the background plan and setting the scale; exporting the 3D view as PNG.' },
          { label: 'Blender: about Blender', url: SRC.blender, note: 'Free software, commercial use allowed.' },
          { label: 'Floorplanner: plans and pricing', url: SRC.fp, note: '5 free projects, exports at 960 × 540 px with a watermark. Checked 28 Sep 2026.' },
          { label: 'SketchUp Free', url: SRC.sku, note: 'Free version in the browser.' },
          { label: 'Planner 5D: AI floor plan to 3D model', url: SRC.p5d, note: 'Accepts images, DXF and DWG; one free trial per person.' },
          { label: 'pedra.ai: plans and prices', url: SRC.pedra, note: 'In Spanish. Floor plan to 3D: 2 credits per render. Checked 28 Sep 2026.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How can I make a floor plan in 3D?',
        a: 'You can make a 3D floor plan in three ways: drawing it in free software such as Sweet Home 3D over an image of your plan, uploading the plan to an AI converter that builds a model in minutes, or ordering it from a studio. {{brand}} models it to scale from a PDF or an image and delivers the 3D floor plan in {{delivery:plano3d}}, with a fixed quote.',
      },
      {
        q: 'What free software can I use to create 3D floor plans?',
        a: 'Sweet Home 3D is free and open source, and lets you import your plan as a background and see it in 3D. Floorplanner has a free plan with 5 projects and low-resolution exports, SketchUp Free runs in the browser and Blender is free even for commercial use, although harder to learn. If you would rather not spend the hours, {{brand}} makes the 3D floor plan for you, with a fixed quote.',
      },
      {
        q: 'Can I convert a PDF floor plan to 3D?',
        a: 'Yes. You can export the PDF page as an image and import it as a background in free software, or upload it to an AI converter; Planner 5D, for example, accepts images and DXF or DWG files. {{brand}} works directly from the PDF, the image or the listing link, and delivers the 3D floor plan in {{delivery:plano3d}} or the complete model in {{delivery:maqueta}}.',
      },
      {
        q: 'Which AI turns drawings into 3D models?',
        a: 'For floor plans, AI converters such as Planner 5D’s floor plan recognition build a model from the plan image. Generative chat AI returns images, not models. Either way, it is worth checking walls and openings against the original plan. {{brand}} does that wall by wall and delivers the model with renders, a viewer and augmented reality.',
      },
      {
        q: 'How do I make a render from a floor plan?',
        a: 'First the plan has to become a 3D model; then you assign materials, light the scene, place the camera and compute the image with a render engine, such as Cycles in Blender. With free software you can do it yourself. At {{brand}}, six 4K renders come included in the complete 3D model, which we deliver in {{delivery:maqueta}}.',
      },
      {
        q: 'Can a floor plan without measurements be turned into 3D?',
        a: 'Yes, as long as the plan is drawn to scale. Measurements are estimated from that scale and from any known dimension, such as the width of a door, so the areas are approximate (≈). {{brand}} modelled its demonstration case this way, a Costa del Sol villa with {{villa:rooms}} rooms, and says so on its spec sheet. With real dimensions, the result is more accurate.',
      },
      {
        q: 'How much does a studio charge to convert my floor plan to 3D?',
        a: 'In Spain a 3D floor plan costs between €100 and €800 per floor depending on the level of finish, and online platforms start from €40. {{brand}} does not publish rates: we send you a fixed quote for the 3D floor plan or the complete model once we see your plan. All the market ranges are in [how much a 3D floor plan costs](@guia-precio-plano).',
      },
      {
        q: 'What should I check in a 3D floor plan before publishing it?',
        a: 'Check that every door and window is where the plan shows it, that the number of bedrooms and bathrooms matches, that the furniture is a believable size and that approximate areas are marked as such. If the furniture is virtual, label it as a recreation. {{brand}} delivers the 3D floor plan with {{revisions:plano3d}} to fix anything that does not fit.',
      },
    ],
    related: ['servicio-plano', 'guia-ia-vs-3d', 'guia-precio-plano', 'caso-villa', 'como-funciona'],
    cta: {
      h2: 'Shall we turn your floor plan into 3D?',
      body: 'Send us the floor plan as a PDF, JPG or PNG. We will reply with a fixed price and turnaround and, if you like, a test room in augmented reality.',
      service: 'plano3d',
    },
  },
};
