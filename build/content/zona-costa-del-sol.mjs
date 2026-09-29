// Zone page: Costa del Sol (ES only). Local hub for the coast: sections per municipality, not one page per town.
// Keyword focus (02-keywords C8): renders Costa del Sol, infografías 3D Costa del Sol, render Estepona / Benahavís / Mijas / Fuengirola / Sotogrande.
// Anti-cannibalisation: «render 3D Marbella» → zona-marbella; Málaga capital → zona-malaga.
// No physical presence promised, no local clients; the demo villa is located only as «Costa del Sol».
// Sources verified 2026-09-28:
//  - Ministerio de Vivienda y Agenda Urbana, transacciones de vivienda por municipios (tablas 2 y 2.3), suma 1T-4T 2025:
//    San Roque 1.018 (158 nueva) · Manilva 1.122 (92) · Casares 635 (113) · Estepona 3.466 (888; 2.º municipio de la provincia en nueva)
//    Benahavís 711 (23) · Mijas 3.190 (337) · Fuengirola 2.169 (621) · Benalmádena 2.070 (188) · Torremolinos 1.990 (442)
//    Rincón de la Victoria 860 (214) · Vélez-Málaga 1.410 (160) · Torrox 820 (155) · Nerja 582 (38).
//    Tabla 1.6 (residencia del comprador): provincia de Málaga, no residentes 10.079 de 36.128 (27,9 %) en 2025.
//  - Colegio de Registradores, Estadística Registral Inmobiliaria 2T 2026: la capital supone el 18,09 % de las compraventas
//    de la provincia (12 meses, p. 32); extranjeros 37,01 % en la provincia (2T 2026, p. 44).

const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';
const MIVAU = 'https://apps.fomento.gob.es/BoletinOnline2/?nivel=2&orden=34000000';

const faq = [
  {
    q: '¿Trabajáis en toda la Costa del Sol?',
    a: 'Sí, de Sotogrande a Nerja y en el resto de España. {{brand}} construye el modelo 3D desde el plano, sin visitar la vivienda, así que el precio y el plazo son los mismos en Estepona, Mijas, Fuengirola o la Axarquía: la maqueta 3D completa cuesta desde {{price:maqueta}} + IVA y se entrega en {{delivery:maqueta}}.',
  },
  {
    q: '¿Os desplazáis a Estepona, Benahavís o Sotogrande?',
    a: 'No hace falta. {{brand}} trabaja en remoto: nos envías el plano en PDF, DWG o imagen, o el enlace del anuncio, y resolvemos las dudas por videollamada, email o WhatsApp. Así no pagas desplazamientos y el plazo no depende de la agenda de nadie. Si necesitas medidas exactas de una vivienda existente, las puede tomar tu técnico y nos las pasas.',
  },
  {
    q: '¿Cuánto cuesta un render en la Costa del Sol?',
    a: 'Con {{brand}}, un render adicional en 4K sobre un modelo ya construido cuesta {{extra:render}} + IVA, y la maqueta 3D completa, con varios renders, visor web y realidad aumentada, parte de {{price:maqueta}} + IVA por vivienda. Para una promoción, el pack parte de {{price:promocion}} + IVA. Los rangos de otros estudios de España están en nuestra [guía de precios de renders](@guia-precio-render).',
  },
  {
    q: '¿Podéis modelar todas las tipologías de una promoción en Estepona?',
    a: 'Sí. El pack de promoción de {{brand}} incluye hasta 3 tipologías en un mismo visor, con selector para pasar de una a otra, renders 4K y realidad aumentada para la sala de ventas y las ferias. Cada tipología adicional cuesta {{extra:tipologia}} + IVA. Solo necesitamos las plantas del proyecto y, si existe, la memoria de calidades.',
  },
  {
    q: '¿Sirve para villas con jardín y piscina?',
    a: '{{brand}} modela con detalle la vivienda y sus terrazas, que es donde el comprador pasa el tiempo y lo que más cuesta explicar con fotos. El jardín, la piscina y la parcela se incluyen si aparecen en el plano; cuéntanos al pedir la demo qué quieres enseñar y te confirmamos el alcance y el precio antes de empezar.',
  },
  {
    q: '¿De dónde salen los datos de cada municipio?',
    a: 'De fuentes oficiales, con enlace. Las compraventas por municipio son del Ministerio de Vivienda y Agenda Urbana, que las elabora a partir de escrituras notariales; en esta página sumamos los cuatro trimestres de 2025. El peso de los compradores extranjeros es del Colegio de Registradores. {{brand}} no publica cifras de terceros sin fuente ni estadísticas de resultados que no pueda comprobar.',
  },
  {
    q: '¿Tenéis algún caso en la Costa del Sol?',
    a: 'Tenemos un caso demostrativo, no un encargo de cliente: la planta alta de una villa real de la Costa del Sol, modelada por {{brand}} a partir de su plano publicado, sin fotos del interior. Está anonimizado, así que no indicamos el municipio ni la dirección, y el plano original no se reproduce. Puedes recorrerla en el visor y abrirla en realidad aumentada en la página del caso.',
  },
];

import { plate } from '../data/plates.mjs';

export default {
  id: 'zona-costa-del-sol',
  image: 'villa_dormitorios_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Renders e infografías 3D en la Costa del Sol',
    description: 'Modelos 3D, renders, visor y realidad aumentada desde el plano en Estepona, Benahavís, Mijas, Fuengirola, Nerja o Sotogrande. Desde {{price:maqueta}} + IVA.',
    h1: 'Renders y modelos 3D en la Costa del Sol',
    lead: '{{brand}}, estudio de visualización 3D con base en Mijas, en la Costa del Sol, hace renders, modelos 3D con visor web y realidad aumentada sin app a partir del plano de viviendas de toda la Costa del Sol, de Sotogrande a Nerja, para agencias y promotoras. Desde {{price:maqueta}} + IVA por vivienda, en {{delivery:maqueta}}.',
    breadcrumb: 'Costa del Sol',
    card: {
      title: 'Costa del Sol',
      summary: 'De Sotogrande a Nerja: qué se vende en cada municipio y cómo encaja el modelo 3D, con datos oficiales.',
    },
    hero: {
      image: 'villa_dormitorios',
      alt: 'Ala de dormitorios de una villa en la Costa del Sol con cama doble, dormitorio de dos camas y baño completo amueblados. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'Ala de dormitorios del caso demostrativo, una villa en la Costa del Sol. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Municipios', 'De Sotogrande (San Roque) a Nerja'],
      ['Fuera de la capital', 'Más del 80 % de las compraventas de la provincia'],
      ['Compras por extranjeros', '37,01 % en la provincia (2.º trimestre de 2026)'],
      ['No residentes', '27,9 % de las compraventas de la provincia en 2025'],
      ['Entrada', 'El plano de la vivienda, sin visita'],
      ['Precio', 'Desde {{price:maqueta}} + IVA'],
      ['Plazo', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Por qué la Costa del Sol necesita otra forma de enseñar las viviendas?',
        answer: 'Porque la mayor parte de las operaciones de la provincia de Málaga ocurre en la costa y muchos compradores no viven aquí. Málaga capital solo concentra el 18,09 % de las compraventas de vivienda de la provincia, y en 2025 el 27,9 % de las compraventas provinciales las firmaron personas que no residen en España.',
        body: 'Para una agencia o una promotora de la costa, eso significa vender a alguien que hace la primera visita desde el móvil, en otro país y en otro idioma. Un modelo 3D con visor por enlace y realidad aumentada le enseña la vivienda antes del viaje. Si trabajas en Marbella o en Málaga capital, tienen su propia página: [modelos 3D y renders en Marbella](@zona-marbella) y [render 3D en Málaga](@zona-malaga).',
      },
      {
        type: 'table',
        h2: 'Compraventas de vivienda por municipio en 2025',
        intro: 'De oeste a este. La columna de la derecha es nuestra recomendación según el tipo de vivienda que más se vende en cada municipio.',
        caption: 'Compraventas de vivienda por municipio de la Costa del Sol en 2025 y qué encaja mejor',
        head: ['Municipio', 'Compraventas 2025', 'Obra nueva', 'Qué encaja mejor'],
        rows: [
          ['San Roque (Sotogrande)', '1.018', '158 (15,5 %)', 'Maqueta completa con AR para villas y apartamentos'],
          ['Manilva', '1.122', '92 (8,2 %)', 'Maqueta completa para apartamentos y adosados en urbanización'],
          ['Casares', '635', '113 (17,8 %)', 'Maqueta completa para urbanizaciones de costa y golf'],
          ['Estepona', '3.466', '888 (25,6 %)', 'Tipologías de obra nueva en 3D con visor y AR'],
          ['Benahavís', '711', '23 (3,2 %)', 'Maqueta completa y staging virtual para villas de reventa'],
          ['Mijas', '3.190', '337 (10,6 %)', 'Maqueta completa para villas y adosados de reventa'],
          ['Fuengirola', '2.169', '621 (28,6 %)', 'Plano 3D para pisos y visor para las promociones'],
          ['Benalmádena', '2.070', '188 (9,1 %)', 'Plano 3D y renders para apartamentos de reventa'],
          ['Torremolinos', '1.990', '442 (22,2 %)', 'Plano 3D para pisos y tipologías para obra nueva'],
          ['Rincón de la Victoria', '860', '214 (24,9 %)', 'Tipologías de obra nueva y plano 3D para pisos'],
          ['Vélez-Málaga', '1.410', '160 (11,3 %)', 'Plano 3D y renders para pisos y casas'],
          ['Torrox', '820', '155 (18,9 %)', 'Plano 3D y maqueta para apartamentos'],
          ['Nerja', '582', '38 (6,5 %)', 'Plano 3D y renders para apartamentos y casas de reventa'],
        ],
        note: 'Fuente: Ministerio de Vivienda y Agenda Urbana, transacciones inmobiliarias de vivienda por municipios, a partir de escrituras notariales (suma de los cuatro trimestres de 2025). Los datos de San Roque, en la provincia de Cádiz, incluyen todo el municipio y no solo Sotogrande.',
        sources: [{ label: 'Ministerio de Vivienda y Agenda Urbana: transacciones inmobiliarias por municipios', url: MIVAU }],
      },
      plate('es', 'villa_terraza_opaco'),
      {
        type: 'prose',
        h2: 'Estepona: obra nueva y venta sobre plano',
        body: 'Estepona registró 888 compraventas de vivienda nueva en 2025, la segunda cifra de la provincia después de Málaga capital y más que Marbella, Manilva, Casares y Benahavís juntos. Es el municipio del oeste de la costa donde más se vende sobre plano: promociones de apartamentos y adosados, muchas dirigidas a compradores extranjeros.\n\nAquí el entregable útil es cada tipología en 3D, con un visor con selector para la web de la promoción y realidad aumentada para la sala de ventas y las ferias. Lo explicamos en [soluciones para promotoras](@sol-promotoras), y el proceso comercial completo, en la [guía de venta sobre plano](@guia-sobre-plano).',
      },
      {
        type: 'prose',
        h2: 'Benahavís: villas en urbanizaciones cerradas',
        body: 'Benahavís es lo contrario: 711 compraventas en 2025 y solo 23 de obra nueva. Se venden sobre todo villas de segunda mano en urbanizaciones cerradas y parcelas grandes, a menudo decoradas al gusto del propietario anterior.\n\nPara estas viviendas funciona la maqueta 3D completa con [home staging virtual](@servicio-staging): el comprador ve la casa como podría vivirla, etiquetada como recreación virtual. Y la realidad aumentada a tamaño real le permite recorrer el salón y la terraza desde su casa.',
      },
      {
        type: 'prose',
        h2: 'Mijas y Fuengirola: del adosado al piso',
        body: 'Mijas sumó 3.190 compraventas en 2025, en su mayoría de segunda mano: villas, adosados y apartamentos en las urbanizaciones de la costa. Aquí la maqueta completa ayuda a vender a quien compara varias viviendas parecidas en pocos días.\n\nFuengirola, más urbana y compacta, registró 2.169 compraventas, con un 28,6 % de obra nueva. Predominan los pisos, y para muchos anuncios basta un [plano 3D](@servicio-plano) a color que explique la distribución, desde {{price:plano3d}} + IVA por planta.',
      },
      {
        type: 'prose',
        h2: 'Benalmádena y Torremolinos',
        body: 'Benalmádena (2.070 compraventas en 2025) y Torremolinos (1.990) son mercados de apartamentos, con perfiles distintos: en Benalmádena la obra nueva fue el 9,1 % de las operaciones y en Torremolinos el 22,2 %. En la reventa, el plano 3D y un par de renders suelen bastar para explicar la vivienda; en las promociones nuevas, las tipologías en 3D ayudan a vender antes de terminar la obra.',
      },
      {
        type: 'prose',
        h2: 'Sotogrande, Manilva y Casares',
        body: 'En el extremo oeste, Sotogrande pertenece a San Roque, ya en la provincia de Cádiz, que registró 1.018 compraventas en 2025. Villas y apartamentos junto al puerto deportivo y los campos de golf, con un comprador internacional parecido al de Marbella: la maqueta completa con realidad aumentada es la opción natural.\n\nManilva (1.122 compraventas) y Casares (635, con un 17,8 % de obra nueva) combinan apartamentos y adosados en urbanizaciones de costa y golf, a menudo vendidos a compradores que no viven en España.',
      },
      {
        type: 'prose',
        h2: 'Nerja y la Axarquía',
        body: 'Al este de Málaga, el mercado cambia de escala. Nerja registró 582 compraventas en 2025 y solo 38 de obra nueva: apartamentos y casas de reventa, donde un plano 3D y renders de las estancias principales explican la vivienda. Vélez-Málaga sumó 1.410 y Torrox 820.\n\nRincón de la Victoria es la excepción: 860 compraventas, casi una de cada cuatro de obra nueva. Allí encajan las tipologías en 3D para promociones y el plano 3D para los pisos.',
      },
      {
        type: 'ar',
        h2: '¿Cómo ve la vivienda un comprador que está fuera?',
        intro: 'Con el móvil, sin instalar nada. Abre en realidad aumentada la villa de nuestro [caso demostrativo](@caso-villa), una villa en la Costa del Sol modelada desde un único plano: con [AR Quick Look](@glosario#ar-quick-look) en iPhone o iPad y con [Scene Viewer](@glosario#scene-viewer) en Android. ¿No se abre? Mira [cómo ver una vivienda en realidad aumentada paso a paso](@guia-ar).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Cómo trabajamos en la costa',
        body: 'Trabajamos en remoto desde el plano: no hace falta que nadie se desplace a la vivienda, y las dudas se resuelven por videollamada. Si el plano no trae cotas, las superficies del modelo son estimaciones a escala (≈). No citamos clientes ni cifras de ventas que no podamos comprobar, y las tarifas, iguales en toda la costa, están en [precios](@precios).',
      },
      { type: 'faq' },
    ],
    faq,
    related: ['zona-marbella', 'zona-malaga', 'sol-promotoras', 'caso-villa', 'precios'],
    cta: {
      h2: '¿Qué vivienda de la costa vemos en 3D?',
      body: 'Envíanos el plano, sea de Sotogrande o de Nerja, y te devolvemos una estancia en 3D con realidad aumentada, gratis y sin compromiso.',
      service: 'maqueta',
    },
  },
};
