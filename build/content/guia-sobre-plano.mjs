// Guide (ES only): how to sell homes off-plan, from a developer's marketing point of view.
// Keyword owner of «vender viviendas sobre plano» (02-keywords-es.md C3, §4.3). PAA: «¿Cómo funciona la compra
// de vivienda sobre plano?», «¿Cómo se paga un piso comprado sobre plano?».
// Legal texts verified 2026-09-28 in the consolidated BOE/BOJA texts linked below:
//  - RD 515/1989 arts. 2, 3, 4, 5, 6, 8 (publicity must match reality, state if under construction, is enforceable; brochures).
//  - RDL 1/2007 (TRLGDCU) art. 61 (advertising content is enforceable even if not in the contract).
//  - Ley 38/1999 (LOE) DA 1.ª, apartados Uno and Seis (guarantee of advance payments, special account, mention in advertising).
//  - Decreto 218/2005 de Andalucía, arts. 4, 5 and 6 (content of advertising; free Documento Informativo Abreviado with a
//    furnished, dimensioned floor plan at 1:100 minimum). Still cited as current by juntadeandalucia.es (checked same day).
// Statistic verified 2026-09-28 in the Registradores ERI 2T 2026 PDF, p. 44: Málaga 37,01 % foreign buyers (2nd after Alicante 46,43 %).
// Our prices and delivery times come ONLY from tokens.

const RD515 = 'https://www.boe.es/buscar/act.php?id=BOE-A-1989-11181';
const TRLGDCU = 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555#a61';
const LOE = 'https://www.boe.es/buscar/act.php?id=BOE-A-1999-21567#daprimera';
const BOJA = 'https://www.juntadeandalucia.es/boja/2005/217/1';
const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';

export default {
  id: 'guia-sobre-plano',
  image: 'villa_bano_suite_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Cómo vender viviendas sobre plano: guía para promotoras',
    description: 'Qué necesita ver un comprador sobre plano, qué exige la ley a la publicidad y 8 pasos para la preventa con renders, visor y AR. Desde {{price:promocion}} + IVA.',
    h1: '¿Cómo vender viviendas sobre plano? Guía para promotoras',
    lead: 'Vender sobre plano es lograr reservas de viviendas que aún no existen: el comprador debe entender distribución, acabados y amplitud, y tu publicidad, ajustarse a lo que construirás. Aquí tienes qué enseñar, qué exige la ley y cómo montar la preventa. Con {{brand}}, 3 tipologías en 3D desde {{price:promocion}} + IVA, en {{delivery:promocion}}.',
    breadcrumb: 'Vender sobre plano',
    card: {
      title: 'Cómo vender viviendas sobre plano',
      summary: 'Qué necesita ver el comprador, qué exige la ley a los renders y folletos, y una campaña de preventa en 8 pasos.',
    },
    hero: {
      image: 'villa_bano_suite',
      alt: 'Baño en suite con bañera exenta redonda, porcelánico negro y ducha de lluvia en verde oliva. Render 3D de la villa anonimizada de la Costa del Sol, generado a partir de su plano 2D.',
      caption: 'Un acabado de la memoria de calidades, visto antes de construirlo. Render generado desde el plano 2D, sin fotos.',
    },
    facts: [
      ['Para', 'Promotoras, comercializadoras y agencias de obra nueva'],
      ['Qué decide la reserva', 'Distribución, acabados, amplitud, precio y garantías'],
      ['Normas clave', 'RD 515/1989, Ley 38/1999 y, en Andalucía, Decreto 218/2005'],
      ['Regla de oro', 'Lo que muestra la publicidad es exigible'],
      ['Campaña', '8 pasos, de los planos a la sala de ventas'],
      ['Pack de promoción', 'Desde {{price:promocion}} + IVA, hasta 3 tipologías'],
      ['Plazo del 3D', '{{delivery:promocion}}'],
      ['Normas revisadas', '28 de septiembre de 2026'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Cómo funciona la venta de viviendas sobre plano?',
        answer: 'Vender sobre plano es comercializar viviendas en proyecto o en construcción. El comprador reserva, firma un contrato privado y entrega cantidades a cuenta mientras se construye; el resto lo paga al escriturar, con la vivienda terminada y su licencia de ocupación. Durante meses decide solo con planos, una memoria de calidades e imágenes.',
        body: 'Para una promotora, comercializar es traducir: pasar de un plano a escala 1:100 y de una lista de materiales a algo que el comprador entienda y se imagine habitando.\n\nLas cantidades a cuenta tampoco son un detalle comercial. La [Ley de Ordenación de la Edificación](' + LOE + ') obliga a garantizarlas con un seguro de caución o un aval, que cubre impuestos e interés legal, y a cobrarlas en una cuenta especial. Esa garantía debe aparecer además en la publicidad.',
      },
      {
        type: 'stat',
        value: '37,01 %',
        label: 'de las compras de vivienda en la provincia de Málaga en el segundo trimestre de 2026 fueron de extranjeros, el segundo porcentaje de España tras Alicante.',
        source: { label: 'Colegio de Registradores, Estadística Registral Inmobiliaria, p. 44', url: ERI },
        year: '2.º trimestre de 2026',
      },
      {
        type: 'table',
        h2: '¿Qué necesita ver un comprador antes de reservar sobre plano?',
        intro: 'Las preguntas habituales de quien compra obra nueva, el documento que las responde y el formato que las hace comprensibles.',
        caption: 'Qué pregunta el comprador sobre plano y cómo responderle',
        head: ['Pregunta del comprador', 'Documento que la responde', 'Formato que la hace comprensible'],
        rows: [
          ['¿Cómo es la distribución?', 'Plano de la vivienda con superficie útil', 'Plano 3D amueblado y visor con los muros cortados'],
          ['¿Es grande el salón? ¿Cabe mi sofá?', 'Cotas del plano', 'Modelo a escala y realidad aumentada a tamaño real'],
          ['¿Cómo serán los acabados?', 'Memoria de calidades', 'Renders con los materiales exactos de la memoria'],
          ['¿Qué luz y qué vistas tendrá?', 'Plano de emplazamiento y orientación', 'Renders con luz natural; para las vistas, fotos reales desde el solar'],
          ['¿Cuánto pagaré y cuándo?', 'Nota explicativa del precio y forma de pago', 'Una tabla clara en el dosier: aquí el 3D no aporta'],
          ['¿Está protegido mi dinero?', 'Seguro o aval de las cantidades a cuenta', 'Mencionarlo en la publicidad, como exige la ley'],
          ['¿Cuándo me la entregan?', 'Fecha de entrega y fase de la obra', 'Fotos de obra actualizadas en la web de la promoción'],
        ],
        note: 'Si el comprador vive fuera, cada fila se resuelve a distancia: por enlace, videollamada o WhatsApp.',
      },
      {
        type: 'answer',
        h2: '¿Por qué no basta con el plano y la memoria de calidades?',
        answer: 'Porque son documentos técnicos pensados para contratar, no para imaginar. Un plano a escala 1:100 enseña muros y cotas, pero no volumen, luz ni muebles; una memoria dice «porcelánico de gran formato» sin enseñar cómo queda en un salón. El 3D no sustituye a esos documentos: los hace legibles para quien va a vivir allí.',
        body: 'Los [renders inmobiliarios](@servicio-renders) venden en portales y dosieres. El [visor 3D](@servicio-tour) deja recorrer la vivienda desde casa. La [realidad aumentada sin app](@servicio-ar) pone la tipología sobre la mesa de la sala de ventas.\n\nLo importante es que salgan del mismo modelo 3D: así el suelo del render es el del visor y el de la realidad aumentada, y si cambia la memoria, cambian los tres a la vez.',
      },
      {
        type: 'figure',
        image: 'villa_dormitorios',
        alt: 'Ala de dormitorios y baño completo de la villa anonimizada de la Costa del Sol, amueblados. Render 3D generado a partir de su plano 2D.',
        caption: 'Una zona de la vivienda vista antes de que exista. Render generado desde el plano 2D.',
        layout: 'wide',
      },
      {
        type: 'table',
        h2: '¿Renders, visor 3D, realidad aumentada o piso piloto?',
        intro: 'Qué aporta cada formato a una preventa, dónde se usa y cuál es su límite. No son excluyentes.',
        caption: 'Formatos para enseñar una vivienda sobre plano',
        head: ['Formato', 'Qué aporta', 'Dónde se usa', 'Límite'],
        rows: [
          ['Renders 4K', 'Acabados, luz y ambiente de cada estancia', 'Portales, web, dosier, redes y vallas', 'Imágenes fijas: no se recorren'],
          ['Plano 3D amueblado', 'La distribución de un vistazo, con muebles a escala', 'Fichas de tipología y anuncios', 'Una vista cenital o isométrica, sin recorrido'],
          ['Visor 3D web', 'Recorrer la vivienda estancia a estancia, con [modo maqueta](@glosario#modo-maqueta)', 'Web de la promoción, email y WhatsApp', 'Necesita conexión'],
          ['Realidad aumentada', 'La tipología sobre la mesa a escala 1:20 o a tamaño real', 'Sala de ventas, ferias y casa del comprador', 'Solo en móvil o tableta compatible'],
          ['Maqueta física del edificio', 'El volumen del conjunto y las zonas comunes', 'Sala de ventas', 'No enseña el interior de cada vivienda'],
          ['Piso piloto físico', 'Tocar materiales y medir el espacio real', 'Vivienda terminada o local habilitado', 'Coste de montaje; una sola tipología'],
        ],
        note: '{{brand}} produce los cuatro primeros a partir de los planos del proyecto; la maqueta física y el piso piloto son trabajos de otros oficios.',
      },
      {
        type: 'answer',
        h2: '¿Qué dice la ley sobre las imágenes en la publicidad de obra nueva?',
        answer: 'Que lo que enseñas se puede exigir. El Real Decreto 515/1989 obliga a que la publicidad de viviendas se ajuste a sus características reales, diga si están en construcción y no induzca a error. Y los datos sobre construcción, instalaciones o servicios que incluya son exigibles aunque no figuren en el contrato.',
        body: 'Lo dicen los [artículos 2 y 3 del Real Decreto 515/1989](' + RD515 + '#a3), y lo repite para cualquier bien o servicio el [artículo 61 de la Ley General para la Defensa de los Consumidores](' + TRLGDCU + '): el contenido de la publicidad se integra en el contrato. Traducido a imágenes: si el render enseña tarima de roble y la memoria dice porcelánico, tu comprador tiene un argumento.\n\nEn Andalucía, el [Decreto 218/2005](' + BOJA + ') detalla qué debe llevar la publicidad: estado de la obra, ubicación, promotor, número de viviendas, superficie útil si describes estancias, impuestos si publicas precio y la garantía de los anticipos. Quien ofrezca viviendas en proyecto o en construcción, también como intermediario, debe entregar gratis un Documento Informativo Abreviado con planta de amueblamiento acotada a escala mínima 1:100.\n\nY la [Ley de Ordenación de la Edificación](' + LOE + ') exige que esa publicidad mencione la entidad aseguradora o avalista y el banco de la cuenta especial.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'No es asesoramiento jurídico',
        body: 'Somos un estudio de visualización 3D, no un despacho, y vendemos el material que describe esta guía. Resumimos normas del BOE y el BOJA con enlace a cada texto: pide a tu asesor jurídico que revise folletos, web y contratos. Fuera de Andalucía, consulta la normativa de consumo de tu comunidad.',
      },
      {
        type: 'checklist',
        h2: '¿Qué debe llevar cada render y cada folleto de la promoción?',
        intro: 'Para revisar el material antes de publicarlo: obligaciones legales, con su norma, y buenas prácticas nuestras.',
        items: [
          'Acabados del render iguales a los de la memoria: suelos, carpinterías, sanitarios, cocina y fachada.',
          'Mobiliario y decoración marcados como no incluidos, con una mención visible del tipo «Infografía orientativa; mobiliario no incluido».',
          'Estado de la vivienda: en proyecto, en construcción o terminada (RD 515/1989, art. 2).',
          'Superficie útil de cada tipología si describes dormitorios o estancias, no solo la construida (Decreto 218/2005, art. 5).',
          'Identidad del promotor y ubicación de la promoción (Decreto 218/2005, art. 5).',
          'Aseguradora o avalista y banco de la cuenta especial, si cobras cantidades a cuenta (Ley 38/1999, DA 1.ª).',
          'Impuestos y gastos a cargo del comprador, si publicas el precio (Decreto 218/2005, art. 5).',
          'En los folletos, el periodo de validez de los datos y dónde consultar la documentación (RD 515/1989, art. 8).',
          'En Andalucía, el derecho a recibir el Documento Informativo Abreviado y dónde pedirlo (Decreto 218/2005, art. 5).',
          'Fecha y versión del proyecto en el nombre de cada render, para saber a qué memoria corresponde.',
        ],
      },
      {
        type: 'steps',
        h2: '¿Cómo se prepara una campaña de preventa, paso a paso?',
        intro: 'De los planos a la sala de ventas. Los plazos del 3D son los nuestros; el resto depende de tu calendario.',
        items: [
          { title: 'Cierra tipologías y memoria de calidades', body: 'Antes de producir una sola imagen: cada cambio posterior obliga a revisar renders, visor y folletos.', time: 'Antes de empezar' },
          { title: 'Encarga el modelo 3D de cada tipología', body: 'Plantas en DWG, DXF o PDF y la memoria. Sin cotas, las superficies son estimaciones (≈) y así se indica.', time: '{{delivery:promocion}} para 3 tipologías' },
          { title: 'Revisa con arquitectura y con dirección comercial', body: 'Un enlace privado al visor para pedir cambios de mobiliario, acabados o distribución. El pack incluye {{revisions:promocion}}.' },
          { title: 'Monta la web de la promoción', body: 'Una página por tipología con renders, plano 3D, superficie útil, visor incrustado y formulario. La documentación legal, descargable.' },
          { title: 'Prepara el dosier y los anuncios', body: 'Renders y plantas en el dosier y los portales. Los portales solo publican tours 3D de sus proveedores homologados: el visor va en tu web, por enlace o con un código QR.' },
          { title: 'Equipa la sala de ventas y las ferias', body: 'Una tableta con cada tipología en realidad aumentada a escala 1:20 y un código QR en el stand que abra el visor en el móvil del visitante.' },
          { title: 'Da el mismo material a las agencias colaboradoras', body: 'Mismo enlace, mismos renders y mismas fichas: ninguna enseña una memoria antigua ni redondea superficies.' },
          { title: 'Actualiza durante la obra', body: 'Si cambia un acabado, se actualiza el modelo y se reexportan renders, visor y AR. Al terminar la obra, cambia los renders por fotos reales.', time: 'Hasta la entrega' },
        ],
      },
      {
        type: 'answer',
        h2: '¿Cuánto cuesta preparar el material 3D de una promoción?',
        answer: 'Con {{brand}}, el pack de promoción cuesta desde {{price:promocion}} + IVA e incluye 3 tipologías modeladas y amuebladas, 12 renders en 4K, visor con selector de tipología y realidad aumentada para la sala de ventas, en {{delivery:promocion}}. Cada tipología adicional cuesta {{extra:tipologia}} + IVA.',
        body: 'Los rangos que publican otros estudios, con su fuente, están en [cuánto cuesta un render 3D en España](@guia-precio-render). El detalle de cada pack, en [precios](@precios), y un ejemplo terminado en el [caso de la villa en la Costa del Sol](@caso-villa): {{villa:rooms}} estancias modeladas desde {{villa:input}}. Cómo trabajamos con tu equipo, en [visualización para promotoras](@sol-promotoras).',
      },
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'BOE: Real Decreto 515/1989, información en la compraventa de viviendas, arts. 2 a 8', url: RD515, note: 'Consultado el 28 sep 2026.' },
          { label: 'BOE: Ley General para la Defensa de los Consumidores, art. 61', url: TRLGDCU, note: 'Consultado el 28 sep 2026.' },
          { label: 'BOE: Ley 38/1999 de Ordenación de la Edificación, disposición adicional primera', url: LOE, note: 'Consultado el 28 sep 2026.' },
          { label: 'BOJA: Decreto 218/2005, información al consumidor en la compraventa de viviendas en Andalucía', url: BOJA, note: 'Arts. 4 a 6.' },
          { label: 'Colegio de Registradores: Estadística Registral Inmobiliaria, 2.º trimestre de 2026', url: ERI, note: 'Página 44.' },
        ],
      },
    ],
    faq: [
      {
        q: '¿Cómo funciona la compra de vivienda sobre plano?',
        a: 'El comprador reserva una vivienda en proyecto o en construcción, firma un contrato privado y entrega cantidades a cuenta durante la obra; el resto lo paga al escriturar, con la vivienda terminada. {{brand}} convierte los planos en renders, visor y realidad aumentada para esa preventa, desde {{price:promocion}} + IVA.',
      },
      {
        q: '¿Cómo se paga un piso comprado sobre plano?',
        a: 'Lo habitual es una reserva, pagos a cuenta durante la obra y el resto al escriturar, a menudo con hipoteca. La Ley 38/1999 obliga al promotor a cobrar los anticipos en una cuenta especial y a garantizarlos con un seguro de caución o un aval, impuestos e interés legal incluidos.',
      },
      {
        q: '¿Es obligatorio poner «imagen orientativa» en los renders?',
        a: 'Ninguna de las normas que citamos exige esa frase literal: exigen que la publicidad no induzca a error, y hacen exigible lo que muestra. La mención cubre mobiliario y decoración, no un acabado distinto del de la memoria. Por eso {{brand}} modela suelos, carpinterías y sanitarios según la memoria de calidades.',
      },
      {
        q: '¿Se puede vender sobre plano sin piso piloto?',
        a: 'Sí. Un piso piloto necesita una vivienda terminada o un local, y enseña una sola tipología. Con un modelo 3D, cada tipología se recorre en el visor y se coloca sobre la mesa en realidad aumentada antes de la obra. {{brand}} lo entrega para 3 tipologías desde {{price:promocion}} + IVA, en {{delivery:promocion}}.',
      },
      {
        q: '¿Qué información hay que dar al comprador de obra nueva en Andalucía?',
        a: 'Quien ofrece viviendas en proyecto o en construcción en Andalucía, también como intermediario, debe entregar gratis un Documento Informativo Abreviado a quien pida información: promotor, planta de amueblamiento acotada a escala mínima 1:100, superficie útil, calidades, precio con impuestos y garantía de los anticipos. El plano 3D de {{brand}} lo complementa; no lo sustituye.',
      },
      {
        q: '¿Hay que cambiar los renders si cambia la memoria de calidades?',
        a: 'Sí, y cuanto antes: lo que muestra la publicidad es exigible aunque no esté en el contrato. {{brand}} genera el modelo con scripts de Python en Blender, así que cambiar un suelo o una carpintería se reconstruye en minutos y se reexportan renders, visor y realidad aumentada.',
      },
      {
        q: '¿Cómo se enseña una promoción a compradores que viven en el extranjero?',
        a: 'Con un enlace: el comprador recorre la tipología en el visor 3D y la abre en realidad aumentada en su móvil, sin instalar nada. En la provincia de Málaga, el 37,01 % de las compras de vivienda del segundo trimestre de 2026 fueron de extranjeros. El visor de {{brand}} está en español y en inglés.',
      },
      {
        q: '¿Cuánto cuestan los renders de una promoción sobre plano?',
        a: 'En {{brand}}, el pack de promoción cuesta desde {{price:promocion}} + IVA e incluye 3 tipologías, 12 renders en 4K, visor y realidad aumentada; cada tipología adicional, {{extra:tipologia}} + IVA. Las tarifas publicadas por otros estudios están en [cuánto cuesta un render 3D](@guia-precio-render).',
      },
    ],
    related: ['sol-promotoras', 'servicio-renders', 'servicio-ar', 'caso-villa', 'precios'],
    cta: {
      h2: 'Enseña cada tipología antes de la obra',
      body: 'Envíanos las plantas y la memoria de calidades. Te respondemos con precio cerrado y plazo, y si quieres, con una estancia de prueba en realidad aumentada.',
      service: 'promocion',
    },
  },
};
