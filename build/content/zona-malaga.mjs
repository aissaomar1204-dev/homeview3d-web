// Zone page: Málaga capital (ES only).
// Keyword focus (02-keywords C8): render 3D Málaga, infografías 3D Málaga, renders Málaga.
// Unique angle vs Marbella: a city of flats, strong new-build activity in the province, old flats to renovate in the centre.
// No physical presence promised, no local clients.
// Sources verified 2026-09-28:
//  - Ministerio de Vivienda y Agenda Urbana, transacciones de vivienda por municipios (tablas 2, 2.3, 2.4), 1T-4T 2025:
//    Málaga (municipio) 6.301 compraventas, 1.038 de vivienda nueva (16,5 %), 5.263 de segunda mano.
//  - Colegio de Registradores, Estadística Registral Inmobiliaria 2T 2026: capital 3.401 €/m² (+14,7 % interanual, p. 18);
//    peso de la capital 18,09 % de la provincia (12 meses, p. 32); provincia 11.727 compraventas de vivienda nueva en 12 meses
//    (3.ª de España, p. 26); 35.839 compraventas en 12 meses (5.ª); extranjeros 37,01 % (2T 2026, p. 44).

const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';
const MIVAU = 'https://apps.fomento.gob.es/BoletinOnline2/?nivel=2&orden=34000000';

const faq = [
  {
    q: '¿Tenéis que venir al piso o a la obra en Málaga?',
    a: 'No. {{brand}} trabaja en remoto desde el plano: nos lo envías en PDF, DWG o imagen, o con el enlace del anuncio, y las dudas se resuelven por videollamada, email o WhatsApp. Sin desplazamientos, el plazo es el mismo en el centro, en Teatinos o en cualquier otro barrio: {{delivery:plano3d}} para el plano 3D y {{delivery:maqueta}} para la maqueta completa.',
  },
  {
    q: '¿Trabajáis con promotoras de Málaga capital?',
    a: 'Sí. La provincia de Málaga es la tercera de España en compraventas de vivienda nueva, y {{brand}} tiene un pack pensado para vender sobre plano: varias tipologías en 3D con renders, visor con selector de tipología y realidad aumentada para la sala de ventas, desde {{price:promocion}} + IVA y en {{delivery:promocion}}. Lo detallamos en la página para promotoras.',
  },
  {
    q: '¿Podéis modelar un piso antiguo del centro con un plano a mano?',
    a: 'Sí, siempre que el plano sea legible. {{brand}} trabaja con planos escaneados, fotos de un croquis o planos del Catastro. Si no hay cotas, necesitamos al menos una medida de referencia o la superficie aproximada, y estimamos el resto con la escala (≈). Con ese modelo puedes enseñar el estado actual y una propuesta de reforma sobre la misma geometría.',
  },
  {
    q: '¿Cuánto cuesta una infografía 3D de un piso en Málaga?',
    a: 'Con {{brand}}, el plano 3D de un piso, con planta cenital a color y vista isométrica amueblada, cuesta {{price:plano3d}} + IVA por planta en su tramo básico. La maqueta 3D completa, con renders de cada ambiente, visor web y realidad aumentada, parte de {{price:maqueta}} + IVA. Los precios son los mismos en Málaga que en el resto de España.',
  },
  {
    q: '¿Trabajáis también en Torremolinos, Rincón de la Victoria o la Axarquía?',
    a: 'Sí. {{brand}} trabaja desde el plano, así que la ubicación no cambia ni el precio ni el plazo. Torremolinos, Benalmádena, Rincón de la Victoria, Vélez-Málaga, Nerja o cualquier municipio del área metropolitana entran en las mismas tarifas. En la página de la Costa del Sol tienes los datos de compraventas de cada municipio y el tipo de encargo que mejor encaja.',
  },
  {
    q: '¿El visor 3D funciona en la web de mi inmobiliaria?',
    a: 'Sí. {{brand}} entrega el visor con un código iframe que se pega en la ficha de la vivienda de tu web, y un enlace para compartir por WhatsApp o email. No se inserta dentro de idealista, que solo acepta proveedores multimedia compatibles, pero sí puedes subir allí los renders y la planta a color como imágenes del anuncio.',
  },
  {
    q: '¿Qué precisión tienen las medidas de un plano sin cotas?',
    a: 'Son aproximadas. Cuando el plano no trae cotas, {{brand}} calcula la escala con una medida de referencia, como una puerta estándar o la superficie total, y estima el resto. Por eso marcamos esas superficies con ≈. Si la precisión importa, por ejemplo para una reforma o una venta sobre plano, trabajamos con el plano acotado del proyecto o con tus mediciones.',
  },
];

export default {
  id: 'zona-malaga',
  image: 'villa_planta_cenital_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Render 3D e infografías 3D en Málaga',
    description: 'Infografías y modelos 3D desde el plano para promotoras, agencias y reformas en Málaga capital, con visor y realidad aumentada. Desde {{price:plano3d}} + IVA.',
    h1: 'Render 3D e infografías desde plano en Málaga',
    lead: 'Convertimos planos de pisos, obra nueva y viviendas a reformar en Málaga en modelos 3D amueblados, con renders, visor para el anuncio y realidad aumentada sin app. Plano 3D desde {{price:plano3d}} + IVA; maqueta 3D completa desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}, sin visitar la vivienda.',
    breadcrumb: 'Málaga',
    card: {
      title: 'Málaga',
      summary: 'Pisos, obra nueva y reformas en Málaga capital: infografías y modelos 3D desde el plano, con realidad aumentada.',
    },
    hero: {
      image: 'villa_planta_cenital',
      alt: 'Planta cenital a color de la planta alta de una villa en la Costa del Sol, con salón, dormitorios, baños y terrazas amueblados. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'Planta cenital a color del caso demostrativo. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Zona', 'Málaga capital y área metropolitana'],
      ['Compraventas en 2025', '6.301 viviendas, 1.038 de obra nueva'],
      ['Precio medio en la capital', '3.401 €/m², un 14,7 % más en un año'],
      ['Obra nueva en la provincia', '11.727 compraventas en 12 meses, 3.ª de España'],
      ['Entrada', 'El plano del piso o del proyecto'],
      ['Precio', 'Desde {{price:plano3d}} + IVA'],
      ['Plazo de la maqueta completa', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Cómo es el mercado de vivienda en Málaga capital?',
        answer: 'Un mercado de pisos, con mucha obra nueva en la provincia y precios al alza. Málaga capital registró 6.301 compraventas de vivienda en 2025, 1.038 de ellas de obra nueva, según el Ministerio de Vivienda. Su precio medio registrado alcanzó 3.401 €/m², un 14,7 % más en un año, según el Colegio de Registradores.',
        body: 'A diferencia de Marbella, aquí predominan los pisos en edificios de varias plantas, las promociones de obra nueva en barrios en crecimiento como Teatinos o el litoral oeste, y los pisos antiguos del centro y de barrios consolidados que se venden para reformar. Cada caso pide una pieza distinta del modelo 3D.',
      },
      {
        type: 'table',
        h2: 'Málaga en cifras',
        caption: 'Compraventas y precios de vivienda en Málaga capital y en la provincia',
        head: ['Dato', 'Cifra', 'Periodo', 'Fuente'],
        rows: [
          ['Compraventas de vivienda en Málaga capital', '6.301', 'Año 2025', 'Ministerio de Vivienda'],
          ['De ellas, obra nueva', '1.038 (16,5 %)', 'Año 2025', 'Ministerio de Vivienda'],
          ['Precio medio registrado en la capital', '3.401 €/m² (+14,7 %)', '12 meses hasta el 2.º trimestre de 2026', 'Colegio de Registradores'],
          ['Peso de la capital en las compraventas de la provincia', '18,09 %', '12 meses hasta el 2.º trimestre de 2026', 'Colegio de Registradores'],
          ['Compraventas de vivienda nueva en la provincia', '11.727 (3.ª de España)', '12 meses hasta el 2.º trimestre de 2026', 'Colegio de Registradores'],
          ['Compras por extranjeros en la provincia', '37,01 %', '2.º trimestre de 2026', 'Colegio de Registradores'],
        ],
        note: 'Las compraventas del Ministerio proceden de escrituras notariales y se cuentan por municipio de la vivienda (suma de los cuatro trimestres de 2025). Los datos del Colegio de Registradores se refieren a compraventas inscritas.',
        sources: [
          { label: 'Ministerio de Vivienda y Agenda Urbana: transacciones inmobiliarias por municipios', url: MIVAU },
          { label: 'Colegio de Registradores: Estadística Registral Inmobiliaria, 2.º trimestre de 2026', url: ERI },
        ],
      },
      {
        type: 'compare',
        h2: 'Del plano del piso a la infografía 3D',
        intro: 'Arrastra el control: debajo, la planta 2D redibujada; encima, la planta cenital a color que sale del modelo 3D. Es la misma geometría, así que las medidas coinciden.',
      },
      {
        type: 'prose',
        h2: '¿Qué encargan en Málaga promotoras, agencias y reformistas?',
        body: '- **Promotoras.** La provincia es la tercera de España en compraventas de vivienda nueva. Para vender sobre plano, cada tipología en 3D con visor y realidad aumentada para la sala de ventas y para el comprador que reserva a distancia. Lo explicamos en [soluciones para promotoras](@sol-promotoras).\n- **Agencias.** En un piso de dos o tres dormitorios, la planta explica más que diez fotos. Un [plano 3D](@servicio-plano) a color resuelve la distribución por {{price:plano3d}} + IVA por planta, y la maqueta completa añade renders, visor y realidad aumentada para las viviendas de más valor.\n- **Reformas.** Los pisos antiguos suelen tener una distribución muy compartimentada. Sobre el modelo enseñas el estado actual y la propuesta, con mobiliario y acabados nuevos, antes de pedir presupuestos de obra. Más en [arquitectos e interioristas](@sol-arquitectos).',
      },
      {
        type: 'prose',
        h2: '¿Quién compra en Málaga y cómo le llega el anuncio?',
        body: 'En Málaga capital conviven el comprador local de primera vivienda, el inversor y el comprador extranjero. En el conjunto de la provincia, el 37,01 % de las compras de vivienda del segundo trimestre de 2026 las hicieron extranjeros, según el Colegio de Registradores, aunque la capital solo concentra el 18,09 % de las compraventas provinciales: el grueso del mercado está en la costa.\n\nPara el comprador que vive en Málaga, la realidad aumentada es sobre todo una herramienta de la sala de ventas o de la oficina: la vivienda a escala 1:20 sobre la mesa mientras le explicas la promoción. Para el que busca desde fuera, lo que funciona es el enlace al visor por WhatsApp o email, que abre en cualquier móvil sin instalar nada.',
      },
      {
        type: 'ar',
        h2: 'Pruébalo en tu móvil',
        intro: 'Abre la villa de nuestro [caso demostrativo](@caso-villa) en realidad aumentada: en iPhone o iPad con [AR Quick Look](@glosario#ar-quick-look) y en Android con [Scene Viewer](@glosario#scene-viewer). Desde un ordenador, escanea el código QR.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Cómo trabajamos en Málaga',
        body: 'Trabajamos en remoto desde el plano, así que no hace falta que nos desplacemos al piso ni a la obra: las dudas se resuelven por videollamada. Si el plano no trae cotas, las superficies del modelo son estimaciones a escala (≈). Los precios, los mismos en toda España, están en la página de [precios](@precios).',
      },
      { type: 'faq' },
    ],
    faq,
    related: ['sol-promotoras', 'servicio-plano', 'zona-costa-del-sol', 'caso-villa', 'precios'],
    cta: {
      h2: '¿Vemos tu piso o tu promoción en 3D?',
      body: 'Envíanos el plano y te devolvemos una estancia modelada en 3D con realidad aumentada, gratis y sin compromiso.',
      service: 'maqueta',
    },
  },
};
