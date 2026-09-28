// Hub: where we work (ES only; routes.mjs has no EN path).
// Keyword focus: remote 3D visualisation across Spain from the Costa del Sol (hub level).
// Anti-cannibalisation (02-keywords-es §4.3): «render 3D Marbella» → zona-marbella, «renders Costa del Sol» → zona-costa-del-sol,
// «render 3D Málaga» → zona-malaga. No city pages outside the Costa del Sol (no thin local pages, CONTENT-SCHEMA §5.11).
// No physical presence promised and no local clients cited; the demo villa is located only as «Costa del Sol».
// Stats verified 2026-09-28 in the primary source (text extracted from the PDF):
//  Colegio de Registradores, Estadística Registral Inmobiliaria 2T 2026 (ERI):
//  - Compras de vivienda por extranjeros 2T 2026: provincia de Málaga 37,01 % (2.ª tras Alicante, 46,43 %); España 15,98 %
//    (§6 «Nacionalidad en las compras de vivienda registradas» and its provincial table).
//  - Últimos 12 meses a 2T 2026, provincia de Málaga: 35.839 compraventas de vivienda, 11.727 de obra nueva (provincial annual table).
//  - Peso de Málaga capital sobre su provincia, resultados interanuales: 18,09 % (§5 «Peso de compraventas de vivienda en capital vs provincia»).

const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';

export default {
  id: 'zonas',
  image: 'villa_terraza_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Visualización 3D en remoto: Costa del Sol y España',
    description: 'Desde la Costa del Sol, en remoto para toda España y agencias extranjeras, solo con el plano y al mismo precio y plazo. Maqueta desde {{price:maqueta}} + IVA.',
    h1: 'Dónde trabajamos: Costa del Sol y toda España',
    lead: '{{brand}} tiene su base en la Costa del Sol y trabaja en remoto para inmobiliarias, promotoras y arquitectos de toda España, y para agencias extranjeras que venden aquí. Solo necesitamos el plano, así que la ubicación no cambia el precio ni el plazo: maqueta 3D completa desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
    breadcrumb: 'Zonas',
    card: {
      title: 'Dónde trabajamos',
      summary: 'Marbella, Málaga y la Costa del Sol con datos oficiales de su mercado, y el resto de España en remoto, al mismo precio.',
    },
    facts: [
      ['Base', 'Costa del Sol, provincia de Málaga'],
      ['Páginas locales', 'Marbella, Málaga y Costa del Sol'],
      ['Resto de España', 'En remoto, con el plano y sin visita'],
      ['Compras por extranjeros', '37,01 % en la provincia de Málaga (2.º trimestre de 2026)'],
      ['Precio y plazo', 'Iguales en cualquier zona'],
      ['Maqueta 3D completa', 'Desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}'],
      ['Idiomas', 'Español e inglés'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Por qué en la Costa del Sol hay que enseñar las viviendas a distancia?',
        answer: 'Porque buena parte del comprador no vive aquí. En la provincia de Málaga, el 37,01 % de las compras de vivienda del segundo trimestre de 2026 las hicieron extranjeros, según el Colegio de Registradores: la segunda provincia de España después de Alicante y más del doble de la media nacional, del 15,98 %.',
        body: 'Ese comprador busca desde su país, llega con pocas visitas y a menudo decide con alguien que no viaja. Si el anuncio no le explica la vivienda, no entra en su lista. Un [visor 3D](@glosario#visor-3d) que se abre desde un enlace de WhatsApp, y una [realidad aumentada](@glosario#realidad-aumentada) que le deja recorrer el salón a tamaño real desde su casa, trabajan justo en ese momento.\n\nEl mercado, además, está repartido por toda la costa. La provincia sumó 35.839 compraventas de vivienda en los 12 meses cerrados en el segundo trimestre de 2026, 11.727 de ellas de obra nueva, y Málaga capital concentró solo el 18,09 %, según la misma [estadística del Colegio de Registradores](' + ERI + '). Por eso hay una página para la capital y otra para el resto de la costa, municipio a municipio.',
      },
      {
        type: 'stat',
        value: '37,01 %',
        label: 'de las compras de vivienda registradas en la provincia de Málaga en el segundo trimestre de 2026 las hicieron compradores extranjeros; la media de España fue del 15,98 %',
        source: { label: 'Colegio de Registradores, Estadística Registral Inmobiliaria', url: ERI },
        year: '2.º trimestre de 2026',
      },
      {
        type: 'pages',
        h2: '¿Qué zonas tienen página propia?',
        intro: 'Tres páginas con datos oficiales de cada mercado, el tipo de vivienda que más se vende y el entregable que suele encajar. Solo abrimos una página local cuando tenemos algo propio que contar de esa zona.',
        ids: ['zona-marbella', 'zona-malaga', 'zona-costa-del-sol'],
      },
      {
        type: 'table',
        h2: '¿Qué encaja en cada zona?',
        intro: 'Un resumen de las tres páginas locales. Las cifras de cada municipio, con su fuente, están en cada una.',
        caption: 'Tipo de vivienda, comprador y entregable recomendado por zona (precios sin IVA)',
        head: ['Zona', 'Qué se vende sobre todo', 'Comprador habitual', 'Qué suele encajar'],
        rows: [
          ['[Marbella](@zona-marbella)', 'Villas, áticos y apartamentos de segunda mano, muchos con la decoración del anterior propietario', 'Internacional, que decide desde su país', 'Maqueta completa con realidad aumentada y [home staging virtual](@servicio-staging), desde {{price:maqueta}}'],
          ['[Málaga capital](@zona-malaga)', 'Pisos, obra nueva y viviendas para reformar', 'Local de primera vivienda, inversor y extranjero', '[Plano 3D](@servicio-plano) para pisos, desde {{price:plano3d}}; tipologías en 3D para promociones'],
          ['[Resto de la Costa del Sol](@zona-costa-del-sol)', 'De Sotogrande a Nerja: obra nueva en Estepona, villas en Benahavís, apartamentos en Fuengirola, Benalmádena y Torremolinos', 'Local o internacional, según el municipio', 'Del plano 3D a la [maqueta 3D interactiva](@servicio-tour) o el [pack de promoción](@sol-promotoras)'],
        ],
      },
      {
        type: 'answer',
        h2: '¿Trabajáis fuera de la Costa del Sol?',
        answer: 'Sí, en toda España y con agencias de fuera que venden aquí. Como el modelo se construye desde el plano, no necesitamos pisar la vivienda: una promoción en Valencia o un piso en Madrid se encargan igual que una villa en Benahavís, con el mismo precio y el mismo plazo, {{delivery:maqueta}} para la maqueta completa.',
        body: 'No tenemos páginas para Madrid, Barcelona, Valencia o Alicante porque todavía no tenemos nada propio que contar de esos mercados, y una página que solo cambia el nombre de la ciudad no te ayuda a decidir. Si tu vivienda está allí, el proceso es el que describimos en [cómo funciona](@como-funciona).\n\nCon agencias británicas, neerlandesas, alemanas o nórdicas que venden en España trabajamos en inglés. El visor y la realidad aumentada funcionan igual para su comprador, esté donde esté: en iPhone o iPad con [AR Quick Look](@glosario#ar-quick-look) y en Android con [Scene Viewer](@glosario#scene-viewer).',
      },
      {
        type: 'steps',
        h2: '¿Cómo es trabajar con nosotros a distancia?',
        intro: 'Sin desplazamientos de nadie. Así va un encargo cuando la vivienda, tú y nosotros estamos en sitios distintos.',
        items: [
          { title: 'Nos envías el plano', body: 'En PDF, JPG, PNG, DWG o DXF, por el formulario, por email o por WhatsApp. También vale el enlace del anuncio donde aparece el plano o una foto nítida del folleto.', time: 'Día 0' },
          { title: 'Resolvemos las dudas sin quedar en la vivienda', body: 'Si el plano no trae cotas, te pedimos una medida de referencia, como la superficie total o el ancho de una estancia. Si hace falta, lo hablamos en una videollamada corta. Con eso te cerramos precio y plazo.', time: 'Antes de empezar' },
          { title: 'Revisas el modelo desde tu pantalla', body: 'Te enviamos el visor en un enlace privado y los renders para revisarlos desde el ordenador o el móvil. Los cambios nos los pides por escrito: la maqueta completa incluye {{revisions:maqueta}}.', time: 'Antes de la entrega' },
          { title: 'Publicas donde está tu comprador', body: 'Imágenes en 4K para el portal y el dosier, el visor en tu web con un [iframe](@glosario#iframe) o por enlace, y la realidad aumentada con un toque desde el móvil del comprador o con un código QR.', time: '{{delivery:maqueta}}' },
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'De dónde salen las cifras',
        body: 'Los datos de esta página son del Colegio de Registradores y se refieren a toda la provincia de Málaga, no a un municipio concreto. Las cifras por municipio están en cada página local, con el enlace a su fuente oficial. No citamos clientes locales ni ventas que no podamos comprobar, y nuestra villa de demostración solo se sitúa como «Costa del Sol».',
      },
    ],
    related: ['caso-villa', 'precios', 'sol-inmobiliarias', 'sol-promotoras', 'sobre-nosotros'],
    cta: {
      h2: '¿Dónde está tu próxima vivienda?',
      body: 'Nos da igual: envíanos el plano y te respondemos con precio y plazo cerrados. Si quieres verlo antes de decidir, modelamos gratis una estancia y te la enviamos con realidad aumentada.',
      service: 'maqueta',
    },
  },
};
