// Guide: how to convert a 2D floor plan into 3D (free software, AI tools, a studio). ES only.
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

export default {
  id: 'guia-plano-2d-3d',
  image: 'villa_plano_lineas',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Cómo convertir un plano 2D en 3D: gratis, IA o estudio',
    description: 'Tres formas de pasar un plano 2D a 3D: con un programa gratuito, con IA o con un estudio. Qué obtienes, cuánto tardas y cuándo compensa cada una.',
    h1: 'Cómo convertir un plano 2D en 3D',
    lead: 'Hay tres formas de convertir un plano 2D en 3D: dibujarlo tú con un programa gratuito como Sweet Home 3D, subirlo a una herramienta de IA que lo interpreta en minutos, o encargarlo a un estudio que lo modela a escala. Las dos primeras cuestan tu tiempo; en {{brand}}, desde {{price:plano3d}} + IVA en {{delivery:plano3d}}.',
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
      ['Plano 3D en {{brand}}', 'Desde {{price:plano3d}} + IVA, {{delivery:plano3d}}'],
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
          ['Coste', 'Gratis, con límites en las versiones gratuitas', 'Prueba gratuita o suscripción', 'Gratis o suscripción', 'Desde {{price:plano3d}} + IVA'],
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
        body: 'Estas son las situaciones en las que un estudio suele salir más a cuenta que hacerlo tú:\n\n- **Obra nueva o venta sobre plano:** no hay fotos que redecorar, solo el plano.\n- **Varias salidas del mismo modelo:** plano 3D, [renders](@servicio-renders), [visor 3D](@servicio-tour) y [realidad aumentada](@servicio-ar), coherentes entre sí.\n- **Volumen:** si publicas varias viviendas al mes, el pack cartera de 5 maquetas completas cuesta {{volume}} + IVA.\n- **Tiempo:** cada hora que pasas dibujando muros es una hora sin captar ni atender compradores.',
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
          ['Publico 5 viviendas o más cada mes', 'Pack cartera', '{{volume}} + IVA por 5 maquetas completas'],
        ],
      },
      {
        type: 'prose',
        h2: '¿Qué sale de un solo plano? Nuestro caso',
        body: 'Para enseñar lo que da de sí un plano, tomamos la planta publicada de una villa en la Costa del Sol, un único plano 2D sin fotos del interior ni cotas, y la modelamos entera en una sola sesión de trabajo. El resultado tiene {{villa:rooms}} estancias, unos {{villa:interiorM2}} m² interiores y {{villa:terracesM2}} m² de terrazas estimados a escala, {{villa:textures}} texturas [PBR](@glosario#pbr) procedurales y {{villa:triangles}} triángulos.\n\nDe ese modelo salieron {{villa:renders}} [renders](@glosario#render), la planta cenital, la planta 2D redibujada que ves arriba, un visor web y los archivos de realidad aumentada para iPhone y Android. Puedes [girar el modelo y verlo en tu salón](@caso-villa#visor). El caso está anonimizado: no reproducimos el plano original.',
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
        a: 'Puedes generar un plano en 3D de tres formas: dibujándolo en un programa gratuito como Sweet Home 3D sobre la imagen de tu plano, subiendo el plano a un conversor con IA que levanta un modelo en minutos, o encargándolo a un estudio. {{brand}} lo modela a escala desde un PDF o una imagen y entrega el plano 3D desde {{price:plano3d}} + IVA en {{delivery:plano3d}}.',
      },
      {
        q: '¿Qué programa gratuito puedo usar para crear planos 3D?',
        a: 'Sweet Home 3D es gratuito y de código abierto, y permite importar tu plano como fondo y verlo en 3D. Floorplanner tiene un plan gratuito de 5 proyectos con exportación en baja resolución, SketchUp Free funciona en el navegador y Blender es gratuito incluso para uso comercial, aunque más difícil. Si prefieres no dedicar horas, {{brand}} hace el plano 3D desde {{price:plano3d}} + IVA.',
      },
      {
        q: '¿Puedo convertir un plano en PDF a 3D?',
        a: 'Sí. Puedes exportar la página del PDF como imagen e importarla como fondo en un programa gratuito, o subirla a un conversor con IA; Planner 5D, por ejemplo, admite imágenes y archivos DXF o DWG. {{brand}} trabaja directamente con el PDF, la imagen o el enlace del anuncio, y entrega el plano 3D en {{delivery:plano3d}} o la maqueta completa en {{delivery:maqueta}}.',
      },
      {
        q: '¿Qué IA convierte dibujos en modelos 3D?',
        a: 'Para planos de vivienda, los conversores con IA, como el reconocimiento de planos de Planner 5D, levantan un modelo a partir de la imagen del plano. Las IA generativas de chat devuelven imágenes, no modelos. En los dos casos conviene revisar muros y huecos contra el plano original. {{brand}} lo hace muro a muro y entrega el modelo con renders, visor y realidad aumentada desde {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Cómo puedo hacer un render desde un plano?',
        a: 'Primero hay que convertir el plano en un modelo 3D; después se asignan materiales, se ilumina la escena, se coloca la cámara y se calcula la imagen con un motor de render, como Cycles en Blender. Con un programa gratuito puedes hacerlo tú. En {{brand}}, 6 renders en 4K van incluidos en la maqueta 3D completa, desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
      },
      {
        q: '¿Se puede pasar a 3D un plano sin medidas?',
        a: 'Sí, siempre que el plano esté dibujado a escala. Las medidas se estiman a partir de esa escala y de cualquier dimensión conocida, como el ancho de una puerta, por lo que las superficies son aproximadas (≈). {{brand}} modeló así su caso demostrativo, una villa en la Costa del Sol con {{villa:rooms}} estancias, y lo indica en la ficha. Con cotas reales, el resultado es más preciso.',
      },
      {
        q: '¿Cuánto cuesta que un estudio convierta mi plano a 3D?',
        a: 'Un plano 3D cuesta en España entre 100 y 800 € por planta según el nivel de acabado, y hay plataformas online desde 40 €. En {{brand}}, el plano 3D cuesta {{price:plano3d}} + IVA por planta de hasta 150 m² y la maqueta completa con renders, visor y realidad aumentada, desde {{price:maqueta}} + IVA. Tienes todos los rangos en [cuánto cuesta un plano 3D](@guia-precio-plano).',
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
};
