// Guide (ES + EN): how to sell homes off-plan, from a developer's marketing point of view.
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

import { plate } from '../data/plates.mjs';

export default {
  id: 'guia-sobre-plano',
  image: 'villa_bano_suite_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  es: {
    title: 'Cómo vender viviendas sobre plano: guía para promotoras',
    description: 'Qué necesita ver un comprador sobre plano, qué exige la ley a la publicidad y 8 pasos para la preventa con renders, visor y AR, con presupuesto cerrado.',
    h1: '¿Cómo vender viviendas sobre plano? Guía para promotoras',
    lead: 'Vender sobre plano es lograr reservas de viviendas que aún no existen: el comprador tiene que entender la vivienda y tu publicidad, ajustarse a lo que construirás. Aquí tienes qué enseñar, qué exige la ley y cómo montar la preventa. Con {{brand}}, cada tipología en 3D en {{delivery:promocion}}, con presupuesto cerrado.',
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
      ['Promoción en 3D', 'Presupuesto cerrado según el número de tipologías'],
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
        label: 'de las compras de vivienda en la provincia de Málaga en el segundo trimestre de 2026 fueron de extranjeros, el segundo porcentaje de España tras Alicante',
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
          'Mobiliario y decoración marcados como no incluidos, con una mención visible como la que entregamos con cada render: «Render 3D. Imagen orientativa, no contractual; mobiliario no incluido».',
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
          { title: 'Prepara el dosier y los anuncios', body: 'Renders y plantas en el dosier y los portales. idealista solo publica tours 3D de sus proveedores compatibles: el visor va en tu web, por enlace, con un código QR o en el campo de tour virtual de los portales que acepten enlaces externos.' },
          { title: 'Equipa la sala de ventas y las ferias', body: 'Una tableta con cada tipología en realidad aumentada a escala 1:20 y un código QR en el stand que abra el visor en el móvil del visitante.' },
          { title: 'Da el mismo material a las agencias colaboradoras', body: 'Mismo enlace, mismos renders y mismas fichas: ninguna enseña una memoria antigua ni redondea superficies.' },
          { title: 'Actualiza durante la obra', body: 'Si cambia un acabado, se actualiza el modelo y se reexportan renders, visor y AR. Al terminar la obra, cambia los renders por fotos reales.', time: 'Hasta la entrega' },
        ],
      },
      {
        type: 'answer',
        h2: '¿Cuánto cuesta preparar el material 3D de una promoción?',
        answer: 'Con {{brand}}, el presupuesto de una promoción depende del número de tipologías y de lo que incluya: cada tipología modelada y amueblada, renders en 4K, visor con selector de tipología y realidad aumentada para la sala de ventas, en {{delivery:promocion}}. Te lo mandamos cerrado y por escrito al ver los planos.',
        body: 'Los rangos que publican otros estudios, con su fuente, están en [cuánto cuesta un render 3D en España](@guia-precio-render). El detalle de cada pack, en [precios](@precios), y un ejemplo terminado en el [caso de la villa en la Costa del Sol](@caso-villa): {{villa:rooms}} estancias modeladas desde {{villa:input}}. Cómo trabajamos con tu equipo, en [visualización para promotoras](@sol-promotoras).',
      },
      plate('es', 'villa_interior_salon'),
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
        a: 'El comprador reserva una vivienda en proyecto o en construcción, firma un contrato privado y entrega cantidades a cuenta durante la obra; el resto lo paga al escriturar, con la vivienda terminada. {{brand}} convierte los planos en renders, visor y realidad aumentada para esa preventa, con presupuesto cerrado.',
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
        a: 'Sí. Un piso piloto necesita una vivienda terminada o un local, y enseña una sola tipología. Con un modelo 3D, cada tipología se recorre en el visor y se coloca sobre la mesa en realidad aumentada antes de la obra. {{brand}} lo entrega para cada tipología en {{delivery:promocion}}, con presupuesto cerrado.',
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
        a: 'Depende del número de tipologías y de lo que incluya: renders en 4K, visor y realidad aumentada. {{brand}} no publica tarifas: te manda un presupuesto cerrado y por escrito en cuanto ve los planos. Las tarifas publicadas por otros estudios están en [cuánto cuesta un render 3D](@guia-precio-render).',
      },
    ],
    related: ['sol-promotoras', 'servicio-renders', 'servicio-ar', 'caso-villa', 'precios'],
    cta: {
      h2: 'Enseña cada tipología antes de la obra',
      body: 'Envíanos las plantas y la memoria de calidades. Te respondemos con precio cerrado y plazo, y si quieres, con una estancia de prueba en realidad aumentada.',
      service: 'promocion',
    },
  },

  en: {
    title: 'Selling off-plan property in Spain: a developer’s guide',
    description: 'What off-plan buyers need to see, what Spanish law requires of advertising and 8 pre-sale steps with renders, a viewer and AR, with a fixed quote.',
    h1: 'How do you sell homes off-plan? A guide for developers',
    lead: 'Selling off-plan means securing reservations for homes that don’t exist yet: buyers must understand the home, and your advertising must match what you will build. Here is what to show, what Spanish law requires and how to run the pre-sale. With {{brand}}, every unit type in 3D in {{delivery:promocion}}, with a fixed quote.',
    breadcrumb: 'Selling off-plan',
    card: {
      title: 'How to sell homes off-plan in Spain',
      summary: 'What buyers need to see, what Spanish law requires of renders and brochures, and a pre-sale campaign in 8 steps.',
    },
    hero: {
      image: 'villa_bano_suite',
      alt: 'En-suite bathroom with a round freestanding tub, black porcelain tiles and an olive-green rain shower. 3D render of the anonymised Costa del Sol villa, generated from its 2D floor plan.',
      caption: 'A finish from the specification sheet, seen before it is built. Rendered from the 2D floor plan, with no photos.',
    },
    facts: [
      ['For', 'Developers, sales agents and new-build agencies'],
      ['What decides a reservation', 'Layout, finishes, space, price and guarantees'],
      ['Key rules', 'RD 515/1989, Law 38/1999 and, in Andalusia, Decree 218/2005'],
      ['Golden rule', 'What your advertising shows is enforceable'],
      ['Campaign', '8 steps, from the drawings to the sales suite'],
      ['Development in 3D', 'Fixed quote based on the number of unit types'],
      ['3D turnaround', '{{delivery:promocion}}'],
      ['Rules checked', '28 September 2026'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'How does selling homes off-plan work in Spain?',
        answer: 'Selling off-plan means marketing homes that are still at the design stage or under construction. The buyer reserves, signs a private contract and makes stage payments during the build; the balance is paid on completion before a notary, once the home is finished and has its occupation licence. For months, they decide on plans, a specification sheet and images alone.',
        body: 'For a developer, marketing is translation: turning a 1:100 plan and a list of materials into something buyers understand and can picture themselves living in.\n\nStage payments are not a sales detail either. Spain’s [Building Act, Ley 38/1999](' + LOE + '), requires them to be guaranteed by a surety insurance policy or a bank guarantee covering taxes and legal interest, and to be paid into a special account. That guarantee must also be mentioned in your advertising.',
      },
      {
        type: 'stat',
        value: '37.01%',
        label: 'of home purchases in Málaga province in the second quarter of 2026 were made by foreign buyers, the second-highest share in Spain after Alicante',
        source: { label: 'Colegio de Registradores (Spain’s association of land registrars), Estadística Registral Inmobiliaria, p. 44', url: ERI },
        year: 'Q2 2026',
      },
      {
        type: 'table',
        h2: 'What does a buyer need to see before reserving off-plan?',
        intro: 'The usual questions from new-build buyers, the document that answers each one and the format that makes it understandable.',
        caption: 'What off-plan buyers ask and how to answer them',
        head: ['Buyer’s question', 'Document that answers it', 'Format that makes it understandable'],
        rows: [
          ['What is the layout?', 'Floor plan of the home with usable floor area', 'Furnished 3D floor plan and a viewer with the walls cut away'],
          ['Is the living room big? Will my sofa fit?', 'Dimensions on the plan', 'To-scale model and real-size augmented reality'],
          ['What will the finishes be like?', 'Specification sheet', 'Renders with the exact materials in the specification'],
          ['What light and views will it have?', 'Site plan and orientation', 'Renders with natural light; for views, real photos taken from the plot'],
          ['How much will I pay, and when?', 'Price and payment schedule', 'A clear table in the brochure: 3D adds nothing here'],
          ['Is my money protected?', 'Insurance or bank guarantee for stage payments', 'Mention it in your advertising, as the law requires'],
          ['When will it be handed over?', 'Completion date and build stage', 'Up-to-date construction photos on the development website'],
        ],
        note: 'If the buyer lives abroad, every row can be handled remotely: by link, video call or WhatsApp.',
      },
      {
        type: 'answer',
        h2: 'Why are the plans and the specification sheet not enough?',
        answer: 'Because they are technical documents written for contracts, not for imagination. A 1:100 plan shows walls and dimensions, but not volume, light or furniture; a specification says “large-format porcelain tiles” without showing how they look in a living room. 3D does not replace those documents: it makes them readable for the people who will live there.',
        body: '[Property renders](@servicio-renders) sell on portals and in brochures. The [3D viewer](@servicio-tour) lets buyers walk through the home from their sofa. [App-free augmented reality](@servicio-ar) puts the unit type on the sales suite table.\n\nWhat matters is that they all come from the same 3D model: that way the floor in the render is the floor in the viewer and in augmented reality, and if the specification changes, all three change together.',
      },
      {
        type: 'figure',
        image: 'villa_dormitorios',
        alt: 'Furnished bedroom wing and family bathroom of the anonymised Costa del Sol villa. 3D render generated from its 2D floor plan.',
        caption: 'Part of the home seen before it exists. Rendered from the 2D floor plan.',
        layout: 'wide',
      },
      {
        type: 'table',
        h2: 'Renders, a 3D viewer, augmented reality or a show home?',
        intro: 'What each format adds to a pre-sale, where it is used and where it falls short. They are not mutually exclusive.',
        caption: 'Formats for showing an off-plan home',
        head: ['Format', 'What it adds', 'Where it is used', 'Limit'],
        rows: [
          ['4K renders', 'Finishes, light and atmosphere in each room', 'Portals, website, brochure, social media and billboards', 'Still images: you cannot walk through them'],
          ['Furnished 3D floor plan', 'The layout at a glance, with furniture to scale', 'Unit type sheets and listings', 'A top-down or isometric view, no walkthrough'],
          ['3D web viewer', 'Walking through the home room by room, with [cut-away mode](@glosario#modo-maqueta)', 'Development website, email and WhatsApp', 'Needs a connection'],
          ['Augmented reality', 'The unit type on the table at 1:20 or at real size', 'Sales suite, fairs and the buyer’s home', 'Only on a compatible phone or tablet'],
          ['Physical scale model of the building', 'The volume of the scheme and the communal areas', 'Sales suite', 'Does not show the inside of each home'],
          ['Physical show home', 'Touching materials and measuring the real space', 'A finished home or fitted-out premises', 'Set-up cost; a single unit type'],
        ],
        note: '{{brand}} produces the first four from the project drawings; the physical model and the show home are jobs for other trades.',
      },
      {
        type: 'answer',
        h2: 'What does Spanish law say about images in new-build advertising?',
        answer: 'That what you show can be enforced. Royal Decree 515/1989 requires home advertising to match the homes’ real features, to say whether they are under construction and not to mislead. And any details it gives about construction, installations or services are enforceable even if they are not in the contract.',
        body: 'That is set out in [articles 2 and 3 of Royal Decree 515/1989](' + RD515 + '#a3), and [article 61 of Spain’s General Law for the Defence of Consumers and Users](' + TRLGDCU + ') repeats it for any product or service: the content of advertising becomes part of the contract. In terms of images: if the render shows oak flooring and the specification says porcelain tiles, your buyer has a case.\n\nIn Andalusia, [Decree 218/2005](' + BOJA + ') details what advertising must include: the build stage, location, developer, number of homes, usable floor area if you describe rooms, taxes if you publish a price and the guarantee for stage payments. Anyone offering homes at the design stage or under construction, including as an intermediary, must hand over a free Documento Informativo Abreviado (a short information document) with a dimensioned furniture layout plan at a minimum scale of 1:100.\n\nAnd the [Building Act](' + LOE + ') requires that advertising to name the insurer or guarantor and the bank holding the special account.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'This is not legal advice',
        body: 'We are a 3D visualisation studio, not a law firm, and we sell the material this guide describes. We summarise rules from the BOE (Spain’s official gazette) and the BOJA (Andalusia’s), with a link to each text: ask your legal adviser to review brochures, website and contracts. Outside Andalusia, check your region’s consumer rules.',
      },
      {
        type: 'checklist',
        h2: 'What should every render and brochure for the development include?',
        intro: 'To check your material before publishing it: legal requirements, with the rule behind each, and our own good practice.',
        items: [
          'Render finishes that match the specification sheet: floors, joinery, sanitaryware, kitchen and façade.',
          'Furniture and decoration marked as not included, with a visible label like the one we deliver with every render: “3D render. Indicative image, not contractual; furniture not included.”',
          'The status of the home: at design stage, under construction or finished (RD 515/1989, art. 2).',
          'Usable floor area of each unit type if you describe bedrooms or rooms, not just the built area (Decree 218/2005, art. 5).',
          'The developer’s identity and the development’s location (Decree 218/2005, art. 5).',
          'The insurer or guarantor and the bank holding the special account, if you take stage payments (Law 38/1999, first additional provision).',
          'Taxes and costs payable by the buyer, if you publish the price (Decree 218/2005, art. 5).',
          'In brochures, how long the information is valid and where the documentation can be consulted (RD 515/1989, art. 8).',
          'In Andalusia, the right to receive the Documento Informativo Abreviado and where to ask for it (Decree 218/2005, art. 5).',
          'The project date and version in each render’s file name, so you know which specification it matches.',
        ],
      },
      {
        type: 'steps',
        h2: 'How do you prepare a pre-sale campaign, step by step?',
        intro: 'From the drawings to the sales suite. The 3D timings are ours; the rest depends on your schedule.',
        items: [
          { title: 'Fix the unit types and the specification sheet', body: 'Before producing a single image: every later change means reviewing renders, viewer and brochures.', time: 'Before starting' },
          { title: 'Order the 3D model of each unit type', body: 'Floor plans as DWG, DXF or PDF, plus the specification. Without dimensions, areas are estimates (≈) and are marked as such.', time: '{{delivery:promocion}} for 3 unit types' },
          { title: 'Review with the architects and the sales director', body: 'A private link to the viewer to request changes to furniture, finishes or layout. The package includes {{revisions:promocion}}.' },
          { title: 'Build the development website', body: 'One page per unit type with renders, 3D floor plan, usable floor area, embedded viewer and a form. Legal documentation available to download.' },
          { title: 'Prepare the brochure and the listings', body: 'Renders and floor plans in the brochure and on portals. idealista only publishes 3D tours from its approved providers: the viewer goes on your website, by link, on a QR code or in the virtual tour field of portals that accept external links.' },
          { title: 'Equip the sales suite and the fairs', body: 'A tablet with every unit type in augmented reality at 1:20 and a QR code on the stand that opens the viewer on each visitor’s phone.' },
          { title: 'Give partner agencies the same material', body: 'The same link, the same renders and the same sheets: none of them shows an old specification or rounds up floor areas.' },
          { title: 'Update during the build', body: 'If a finish changes, the model is updated and the renders, viewer and AR are re-exported. When the build is finished, replace the renders with real photos.', time: 'Until handover' },
        ],
      },
      {
        type: 'answer',
        h2: 'How much does the 3D material for a development cost?',
        answer: 'With {{brand}}, the quote for a development depends on the number of unit types and on what it includes: each unit type modelled and furnished, 4K renders, a viewer with a unit-type selector and augmented reality for the sales suite, in {{delivery:promocion}}. We send it to you fixed and in writing once we see the drawings.',
        body: 'The ranges other studios publish, with their sources, are in [how much 3D rendering costs in Spain](@guia-precio-render). The detail of each package is on the [pricing page](@precios), and a finished example in the [Costa del Sol villa case study](@caso-villa): {{villa:rooms}} rooms modelled from {{villa:input}}. How we work with your team is on [off-plan 3D visualisation for developers](@sol-promotoras).',
      },
      plate('en', 'villa_interior_salon'),
      { type: 'faq' },
      {
        type: 'sources',
        items: [
          { label: 'BOE: Royal Decree 515/1989 on consumer information in home sales, arts. 2 to 8', url: RD515, note: 'In Spanish. Checked 28 Sep 2026.' },
          { label: 'BOE: General Law for the Defence of Consumers and Users, art. 61', url: TRLGDCU, note: 'In Spanish. Checked 28 Sep 2026.' },
          { label: 'BOE: Law 38/1999 on Building (Ley de Ordenación de la Edificación), first additional provision', url: LOE, note: 'In Spanish. Checked 28 Sep 2026.' },
          { label: 'BOJA: Decree 218/2005, consumer information in home sales in Andalusia', url: BOJA, note: 'In Spanish. Arts. 4 to 6.' },
          { label: 'Colegio de Registradores: Estadística Registral Inmobiliaria, Q2 2026', url: ERI, note: 'In Spanish. Page 44.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How does buying a home off-plan work in Spain?',
        a: 'The buyer reserves a home at the design stage or under construction, signs a private contract and makes stage payments during the build; the balance is paid on completion before a notary, once the home is finished. {{brand}} turns the drawings into renders, a viewer and augmented reality for that pre-sale, with a fixed quote.',
      },
      {
        q: 'How do you pay for an off-plan property in Spain?',
        a: 'The usual pattern is a reservation fee, stage payments during the build and the balance on completion, often with a mortgage. Spain’s Building Act, Ley 38/1999, requires the developer to pay stage payments into a special account and to guarantee them with a surety insurance policy or a bank guarantee, taxes and legal interest included.',
      },
      {
        q: 'Do renders have to say “indicative image”?',
        a: 'None of the rules we cite requires that exact wording: they require advertising not to mislead, and they make what it shows enforceable. The label covers furniture and decoration, not a finish that differs from the specification sheet. That is why {{brand}} models floors, joinery and sanitaryware according to the specification.',
      },
      {
        q: 'Can you sell off-plan without a show home?',
        a: 'Yes. A show home needs a finished unit or premises, and shows a single unit type. With a 3D model, every unit type can be explored in the viewer and placed on a table in augmented reality before construction starts. {{brand}} delivers it for each unit type in {{delivery:promocion}}, with a fixed quote.',
      },
      {
        q: 'What information must new-build buyers receive in Andalusia?',
        a: 'Anyone offering homes at the design stage or under construction in Andalusia, including as an intermediary, must give a free Documento Informativo Abreviado to anyone asking for information: developer, a dimensioned furniture layout plan at a minimum scale of 1:100, usable floor area, specification, price with taxes and the guarantee for stage payments. The {{brand}} 3D floor plan complements it; it does not replace it.',
      },
      {
        q: 'Do the renders need changing if the specification sheet changes?',
        a: 'Yes, and the sooner the better: what your advertising shows is enforceable even if it is not in the contract. {{brand}} generates the model with Python scripts in Blender, so changing a floor or a window frame rebuilds in minutes, and the renders, viewer and augmented reality are re-exported.',
      },
      {
        q: 'How do you show a development to buyers who live abroad?',
        a: 'With a link: buyers walk through the unit type in the 3D viewer and open it in augmented reality on their phone, with nothing to install. In Málaga province, 37.01% of home purchases in the second quarter of 2026 were made by foreign buyers. The {{brand}} viewer is available in English and Spanish.',
      },
      {
        q: 'How much do renders for an off-plan development cost?',
        a: 'It depends on the number of unit types and on what is included: 4K renders, a viewer and augmented reality. {{brand}} does not publish rates: we send a fixed, written quote as soon as we see the drawings. Rates published by other studios are in [how much 3D rendering costs](@guia-precio-render).',
      },
    ],
    related: ['sol-promotoras', 'servicio-renders', 'servicio-ar', 'caso-villa', 'precios'],
    cta: {
      h2: 'Show every unit type before you build',
      body: 'Send us the floor plans and the specification sheet. We will reply with a fixed price and turnaround and, if you like, a test room in augmented reality.',
      service: 'promocion',
    },
  },
};
