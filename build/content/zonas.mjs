// Hub: where we work (ES + EN).
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
  dateModified: '2026-10-12',

  es: {
    title: 'Visualización 3D en remoto: Costa del Sol y España',
    description: 'Desde la Costa del Sol, en remoto para toda España y agencias extranjeras, solo con el plano y al mismo precio y plazo. Presupuesto cerrado antes de empezar.',
    h1: 'Dónde trabajamos: Costa del Sol y toda España',
    lead: '{{brand}} tiene su base en la Costa del Sol y trabaja en remoto para inmobiliarias, promotoras y arquitectos de toda España, y para agencias extranjeras que venden aquí. Solo necesitamos el plano, así que la ubicación no cambia el precio ni el plazo: maqueta 3D completa en {{delivery:maqueta}}, con presupuesto cerrado.',
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
      ['Maqueta 3D completa', 'En {{delivery:maqueta}}, con presupuesto cerrado'],
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
        caption: 'Tipo de vivienda, comprador y entregable recomendado por zona',
        head: ['Zona', 'Qué se vende sobre todo', 'Comprador habitual', 'Qué suele encajar'],
        rows: [
          ['[Marbella](@zona-marbella)', 'Villas, áticos y apartamentos de segunda mano, muchos con la decoración del anterior propietario', 'Internacional, que decide desde su país', 'Maqueta completa con realidad aumentada y [home staging virtual](@servicio-staging)'],
          ['[Málaga capital](@zona-malaga)', 'Pisos, obra nueva y viviendas para reformar', 'Local de primera vivienda, inversor y extranjero', '[Plano 3D](@servicio-plano) para pisos; tipologías en 3D para promociones'],
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

  en: {
    title: 'Remote 3D visualisation: Costa del Sol and Spain',
    description: 'From the Costa del Sol, remotely for all of Spain and for agencies abroad, from the floor plan alone, at the same price and turnaround. Fixed quote first.',
    h1: 'Where we work: the Costa del Sol and all of Spain',
    lead: '{{brand}} is based on the Costa del Sol and works remotely for estate agents, developers and architects across Spain, and for agencies abroad that sell here. All we need is the floor plan, so location changes neither price nor turnaround: a complete 3D model in {{delivery:maqueta}}, with a fixed quote.',
    breadcrumb: 'Areas',
    card: {
      title: 'Where we work',
      summary: 'Marbella, Málaga and the Costa del Sol with official market data, and the rest of Spain remotely, at the same price.',
    },
    facts: [
      ['Base', 'Costa del Sol, Málaga province'],
      ['Local pages', 'Marbella, Málaga and the Costa del Sol'],
      ['Rest of Spain', 'Remotely, from the plan, no site visit'],
      ['Foreign buyers', '37.01% of purchases in Málaga province (Q2 2026)'],
      ['Price and turnaround', 'The same in every area'],
      ['Complete 3D model', 'In {{delivery:maqueta}}, with a fixed quote'],
      ['Languages', 'English and Spanish'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Why do homes on the Costa del Sol have to be shown remotely?',
        answer: 'Because many of the buyers do not live here. In Málaga province, 37.01% of home purchases in the second quarter of 2026 were made by foreign nationals, according to the Colegio de Registradores (Spain’s land registrars): the second-highest share of any province after Alicante, and more than double the Spanish average of 15.98%.',
        body: 'Those buyers search from home, fly out for a handful of viewings and often decide with someone who does not travel. If the listing does not explain the property, it never makes their shortlist. A [3D viewer](@glosario#visor-3d) that opens from a WhatsApp link, and [augmented reality](@glosario#realidad-aumentada) that lets them walk the living room at real size from their own sofa, work at exactly that moment.\n\nThe market is also spread along the whole coast. The province recorded 35,839 home sales in the 12 months to the end of Q2 2026, 11,727 of them new builds, and Málaga city accounted for only 18.09%, according to the same [Colegio de Registradores statistics](' + ERI + '). That is why there is one page for the city and another for the rest of the coast, town by town.',
      },
      {
        type: 'stat',
        value: '37.01%',
        label: 'of home purchases registered in Málaga province in the second quarter of 2026 were made by foreign buyers; the Spanish average was 15.98%',
        source: { label: 'Colegio de Registradores (Spain’s association of land registrars), Estadística Registral Inmobiliaria', url: ERI },
        year: 'Q2 2026',
      },
      {
        type: 'pages',
        h2: 'Which areas have their own page?',
        intro: 'Three pages with official data for each market, the type of home that sells most and the output that usually fits. We only open a local page when we have something of our own to say about that area.',
        ids: ['zona-marbella', 'zona-malaga', 'zona-costa-del-sol'],
      },
      {
        type: 'table',
        h2: 'What fits each area?',
        intro: 'A summary of the three local pages. Each one has the figures for every town, with their source.',
        caption: 'Type of home, typical buyer and recommended output by area',
        head: ['Area', 'What sells most', 'Typical buyer', 'What usually fits'],
        rows: [
          ['[Marbella](@zona-marbella)', 'Resale villas, penthouses and apartments, many still decorated by the previous owner', 'International, deciding from abroad', 'Complete model with augmented reality and [virtual staging](@servicio-staging)'],
          ['[Málaga city](@zona-malaga)', 'Flats, new builds and homes to renovate', 'Local first-time buyers, investors and foreign buyers', '[3D floor plan](@servicio-plano) for flats; unit types in 3D for developments'],
          ['[Rest of the Costa del Sol](@zona-costa-del-sol)', 'From Sotogrande to Nerja: new builds in Estepona, villas in Benahavís, apartments in Fuengirola, Benalmádena and Torremolinos', 'Local or international, depending on the town', 'From the 3D floor plan to the [interactive 3D model](@servicio-tour) or the [development package](@sol-promotoras)'],
        ],
      },
      {
        type: 'answer',
        h2: 'Do you work outside the Costa del Sol?',
        answer: 'Yes, across Spain and with agencies abroad that sell here. Because the model is built from the floor plan, we never need to set foot in the home: a development in Valencia or a flat in Madrid is ordered exactly like a villa in Benahavís, at the same price and turnaround, {{delivery:maqueta}} for the complete model.',
        body: 'We have no pages for Madrid, Barcelona, Valencia or Alicante because we do not yet have anything of our own to say about those markets, and a page that only swaps the city name will not help you decide. If your property is there, the process is the one described on [how it works](@como-funciona).\n\nWe work in English with British, Dutch, German and Nordic agencies selling in Spain. The viewer and augmented reality work the same for their buyers wherever they are: on iPhone or iPad with [AR Quick Look](@glosario#ar-quick-look) and on Android with [Scene Viewer](@glosario#scene-viewer).',
      },
      {
        type: 'steps',
        h2: 'What is it like to work with us remotely?',
        intro: 'Nobody has to travel. This is how a job runs when the home, you and we are all in different places.',
        items: [
          { title: 'You send us the floor plan', body: 'As a PDF, JPG, PNG, DWG or DXF, through the form, by email or on WhatsApp. A link to the listing that shows the plan, or a sharp photo of the brochure, also works.', time: 'Day 0' },
          { title: 'We clear up questions without a site visit', body: 'If the plan has no dimensions, we ask for one reference measurement, such as the total floor area or the width of a room. If needed, we talk it through on a short video call. Then we confirm price and turnaround.', time: 'Before we start' },
          { title: 'You review the model on your screen', body: 'We send you the viewer on a private link and the renders to check on a computer or phone. You ask for changes in writing: the complete model includes {{revisions:maqueta}}.', time: 'Before delivery' },
          { title: 'You publish where your buyer is', body: '4K images for the portal and the brochure, the viewer on your website with an [iframe](@glosario#iframe) or by link, and augmented reality with one tap on the buyer’s phone or from a QR code.', time: '{{delivery:maqueta}}' },
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Where the figures come from',
        body: 'The data on this page come from the Colegio de Registradores and cover the whole of Málaga province, not any one town. Figures for each town are on its local page, with a link to the official source. We do not cite local clients or sales we cannot verify, and our demonstration villa is located only as “Costa del Sol”.',
      },
    ],
    related: ['caso-villa', 'precios', 'sol-inmobiliarias', 'sol-promotoras', 'sobre-nosotros'],
    cta: {
      h2: 'Where is your next property?',
      body: 'It makes no difference to us: send us the floor plan and we will reply with a fixed price and turnaround. If you would like to see it before deciding, we model one room free of charge and send it to you with augmented reality.',
      service: 'maqueta',
    },
  },
};
