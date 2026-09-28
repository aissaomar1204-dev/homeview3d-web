// Audience page: architects, interior designers and renovation companies (ES only).
// Keyword focus: renders para arquitectos, visualización arquitectónica (PAA «¿Qué es la visualización arquitectónica?»), interioristas.
// Angle (02-keywords C11): fast iteration because the model is built by code, AR to present to the end client, embeddable viewer.
// «¿Cuánto cobra un arquitecto por un render?» is owned by guia-precio-render (linked, not targeted).

const faq = [
  {
    q: '¿Qué formatos de plano aceptáis?',
    a: '{{brand}} trabaja con DWG y DXF, que son los más precisos, y también con PDF, JPG o PNG de las plantas. Con un archivo CAD acotado, el modelo sale a medida. Con una imagen sin cotas, estimamos las medidas con la escala del plano y lo marcamos con ≈. Si tienes alzados o secciones, envíalos también: ayudan con alturas, huecos y carpinterías.',
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
    a: 'Sí. Además de los renders 4K y del visor web, {{brand}} entrega los archivos 3D del modelo: GLB para web y Android, USDZ para iPhone y, si lo necesitas, el archivo de Blender. Así puedes reutilizar la geometría amueblada en tus presentaciones o pedirnos nuevas vistas más adelante, cada render adicional a {{extra:render}} + IVA.',
  },
  {
    q: '¿Cuál es la mejor IA para renders arquitectónicos?',
    a: 'Depende de para qué la quieras. Las IA generativas crean imágenes atractivas a partir de un boceto o una foto, pero no respetan medidas ni mantienen la coherencia entre vistas. {{brand}} usa scripts para construir en Blender un modelo 3D a escala y lo renderiza con Cycles: cada vista sale de la misma geometría. Lo comparamos en la guía [IA o modelo 3D real](@guia-ia-vs-3d).',
  },
  {
    q: '¿Cuánto cuesta un render adicional sobre el modelo?',
    a: 'Con el modelo ya construido, cada render adicional en 4K cuesta {{extra:render}} + IVA en {{brand}}. La maqueta 3D completa, con el modelo, varios renders, visor web y realidad aumentada, parte de {{price:maqueta}} + IVA por vivienda. Si quieres comparar con otras tarifas del mercado español, tienes los rangos publicados en nuestra [guía de precios de renders](@guia-precio-render).',
  },
  {
    q: '¿Trabajáis con interioristas y empresas de reformas?',
    a: 'Sí. Para un interiorista, {{brand}} amuebla y materializa el modelo con tu propuesta y la cambia de estilo sin rehacerlo. Para una empresa de reformas, modelamos el estado actual y la propuesta sobre el mismo plano, de modo que el cliente compara antes y después en renders, en el visor y en realidad aumentada. El home staging virtual cuesta {{extra:staging}} + IVA por estancia.',
  },
];

export default {
  id: 'sol-arquitectos',
  image: 'villa_muros_completos_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Visualización 3D para arquitectos e interioristas',
    description: 'Del plano al modelo 3D con renders 4K, visor web y AR para presentar e iterar tu proyecto, con cambios en minutos. Desde {{price:maqueta}} + IVA.',
    h1: 'Renders y modelo 3D para arquitectos e interioristas',
    lead: 'Convertimos tus plantas en un modelo 3D amueblado con renders 4K, visor web y realidad aumentada, para que tu cliente entienda el proyecto y lo apruebe antes. Como el modelo se construye por código, cada cambio se regenera en minutos. Desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
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
      ['Precio', 'Desde {{price:maqueta}} + IVA'],
      ['Render adicional', '{{extra:render}} + IVA'],
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
        image: 'villa_muros_completos',
        alt: 'Planta alta de una villa en la Costa del Sol con todos los muros a altura completa, dormitorios, baños y terrazas amueblados. Render 3D generado a partir del plano 2D.',
        caption: 'Muros completos a {{villa:wallHeight}} m, la misma geometría que en el modo maqueta. Render generado a partir del plano 2D.',
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
          { title: 'Recibes los archivos', body: 'Renders 4K, visor web con código de inserción, archivos de realidad aumentada en [USDZ](@glosario#usdz) y [GLB](@glosario#glb) y, si lo necesitas, el archivo de Blender.' },
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
        answer: 'Compara el precio con tus horas. Ejemplo con supuestos: si preparar tú el modelo, los materiales y los renders te lleva 20 horas y tu hora de estudio vale 50 €, son 1.000 € de tiempo que no dedicas a proyectar. La maqueta 3D completa cuesta {{price:maqueta}} + IVA e incluye además visor web y realidad aumentada.',
        body: 'Si tus horas multiplicadas por tu tarifa superan el precio del encargo, externalizar compensa. Y si no, quizá te interese solo la parte que no haces: el visor y la realidad aumentada para presentar al cliente. Consulta todas las tarifas en [precios](@precios).',
      },
      {
        type: 'table',
        caption: 'Ejemplo ilustrativo: horas propias frente a encargo (supuestos, no resultados)',
        head: ['Concepto', 'Valor en el ejemplo'],
        rows: [
          ['Horas de modelado, materiales y renders (supuesto)', '20 h'],
          ['Coste de tu hora de estudio (supuesto)', '50 €'],
          ['Coste interno estimado', '1.000 €'],
          ['Maqueta 3D completa con visor y realidad aumentada', '{{price:maqueta}} + IVA'],
          ['Regla práctica', 'Si horas × tarifa supera el precio, externalizar compensa'],
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
};
