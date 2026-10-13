// Zone page: Costa del Sol (ES + EN). Local hub for the coast: sections per municipality, not one page per town.
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
    a: 'Sí, de Sotogrande a Nerja y en el resto de España. {{brand}} construye el modelo 3D desde el plano, sin visitar la vivienda, así que el precio y el plazo son los mismos en Estepona, Mijas, Fuengirola o la Axarquía: la maqueta 3D completa se entrega en {{delivery:maqueta}}, con presupuesto cerrado antes de empezar.',
  },
  {
    q: '¿Os desplazáis a Estepona, Benahavís o Sotogrande?',
    a: 'No hace falta. {{brand}} trabaja en remoto: nos envías el plano en PDF, DWG o imagen, o el enlace del anuncio, y resolvemos las dudas por videollamada, email o WhatsApp. Así no pagas desplazamientos y el plazo no depende de la agenda de nadie. Si necesitas medidas exactas de una vivienda existente, las puede tomar tu técnico y nos las pasas.',
  },
  {
    q: '¿Cuánto cuesta un render en la Costa del Sol?',
    a: 'Depende de cuántas imágenes necesites y de si quieres solo renders o la maqueta 3D completa, con varios renders, visor web y realidad aumentada. {{brand}} te manda un presupuesto cerrado en cuanto ve el plano, y los renders adicionales se hacen sobre el mismo modelo. Los rangos de otros estudios de España están en nuestra [guía de precios de renders](@guia-precio-render).',
  },
  {
    q: '¿Podéis modelar todas las tipologías de una promoción en Estepona?',
    a: 'Sí. El pack de promoción de {{brand}} incluye hasta 3 tipologías en un mismo visor, con selector para pasar de una a otra, renders 4K y realidad aumentada para la sala de ventas y las ferias. Si la promoción tiene más tipologías, se suman al mismo presupuesto. Solo necesitamos las plantas del proyecto y, si existe, la memoria de calidades.',
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

const faqEn = [
  {
    q: 'Do you cover the whole Costa del Sol?',
    a: 'Yes, from Sotogrande to Nerja and across the rest of Spain. {{brand}} builds the 3D model from the floor plan, without visiting the home, so price and turnaround are the same in Estepona, Mijas, Fuengirola or the Axarquía: the complete 3D model is delivered in {{delivery:maqueta}}, with a fixed quote before we start.',
  },
  {
    q: 'Will you come out to Estepona, Benahavís or Sotogrande?',
    a: 'There is no need. {{brand}} works remotely: you send the floor plan as a PDF, DWG or image, or a link to the listing, and we settle questions by video call, email or WhatsApp. That way you pay no travel costs and turnaround does not depend on anyone’s diary. If you need exact measurements of an existing home, your surveyor can take them and pass them on.',
  },
  {
    q: 'How much does a render cost on the Costa del Sol?',
    a: 'It depends on how many images you need and whether you want renders only or the complete 3D model, with several renders, a web viewer and augmented reality. {{brand}} sends a fixed quote as soon as it sees the floor plan, and extra renders are produced on the same model. Other Spanish studios’ ranges are in our [3D rendering cost guide](@guia-precio-render).',
  },
  {
    q: 'Can you model every unit type in an Estepona development?',
    a: 'Yes. The {{brand}} development package includes up to 3 unit types in one viewer, with a selector to switch between them, 4K renders and augmented reality for the sales suite and fairs. If the development has more unit types, they are added to the same quote. All we need is the project floor plans and, if there is one, the specification sheet.',
  },
  {
    q: 'Does it work for villas with a garden and pool?',
    a: '{{brand}} models the home and its terraces in detail, because that is where buyers spend their time and what photos struggle most to explain. The garden, pool and plot are included if they appear on the plan; tell us what you want to show when you ask for a demo and we will confirm the scope and price before we start.',
  },
  {
    q: 'Where do the figures for each town come from?',
    a: 'From official sources, with a link. Sales by town come from Spain’s Ministry of Housing and Urban Agenda, which compiles them from notarial deeds; on this page we add up the four quarters of 2025. The share of foreign buyers comes from the Colegio de Registradores. {{brand}} does not publish third-party figures without a source or results statistics it cannot verify.',
  },
  {
    q: 'Do you have a case study on the Costa del Sol?',
    a: 'We have a demonstration case, not a client job: the upper floor of a real Costa del Sol villa, modelled by {{brand}} from its published floor plan, with no photos of the interior. It is anonymised, so we do not give the town or address, and the original plan is not reproduced. You can explore it in the viewer and open it in augmented reality on the case study page.',
  },
];

import { plate } from '../data/plates.mjs';

export default {
  id: 'zona-costa-del-sol',
  image: 'villa_dormitorios_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  es: {
    title: 'Renders e infografías 3D en la Costa del Sol',
    description: 'Modelos 3D, renders, visor y realidad aumentada desde el plano en Estepona, Benahavís, Mijas, Fuengirola, Nerja o Sotogrande, con presupuesto cerrado.',
    h1: 'Renders y modelos 3D en la Costa del Sol',
    lead: '{{brand}}, estudio de visualización 3D con base en Mijas, en la Costa del Sol, hace renders, modelos 3D con visor web y realidad aumentada sin app a partir del plano de viviendas de toda la Costa del Sol, de Sotogrande a Nerja, para agencias y promotoras. Presupuesto cerrado por vivienda y entrega en {{delivery:maqueta}}.',
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
      ['Precio', 'Presupuesto cerrado antes de empezar'],
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
        body: 'Mijas sumó 3.190 compraventas en 2025, en su mayoría de segunda mano: villas, adosados y apartamentos en las urbanizaciones de la costa. Aquí la maqueta completa ayuda a vender a quien compara varias viviendas parecidas en pocos días.\n\nFuengirola, más urbana y compacta, registró 2.169 compraventas, con un 28,6 % de obra nueva. Predominan los pisos, y para muchos anuncios basta un [plano 3D](@servicio-plano) a color que explique la distribución.',
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

  en: {
    title: '3D renders on the Costa del Sol, town by town',
    description: '3D models, renders, a viewer and augmented reality from the floor plan in Estepona, Benahavís, Mijas, Fuengirola, Nerja or Sotogrande, at a fixed quote.',
    h1: 'Renders and 3D models from Sotogrande to Nerja',
    lead: '{{brand}}, a 3D visualisation studio based in Mijas on the Costa del Sol, produces renders and 3D models with a web viewer and app-free augmented reality from the floor plans of homes all along the coast, from Sotogrande to Nerja, for agents and developers. A fixed quote per home and delivery in {{delivery:maqueta}}.',
    breadcrumb: 'Costa del Sol',
    card: {
      title: 'Costa del Sol',
      summary: 'From Sotogrande to Nerja: what sells in each town and how a 3D model fits, with official data.',
    },
    hero: {
      image: 'villa_dormitorios',
      alt: 'Bedroom wing of a Costa del Sol villa with a furnished double bedroom, twin bedroom and family bathroom. 3D render generated from the 2D floor plan of an anonymised case.',
      caption: 'Bedroom wing of our demo case, a villa on the Costa del Sol. Rendered from the 2D floor plan.',
    },
    facts: [
      ['Towns', 'From Sotogrande (San Roque) to Nerja'],
      ['Outside Málaga city', 'Over 80% of the province’s home sales'],
      ['Foreign buyers', '37.01% in the province (Q2 2026)'],
      ['Non-residents', '27.9% of the province’s home sales in 2025'],
      ['Input', 'The home’s floor plan, no site visit'],
      ['Price', 'A fixed quote before we start'],
      ['Turnaround', '{{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Why does the Costa del Sol need a different way to show homes?',
        answer: 'Because most of Málaga province’s sales happen on the coast, and many buyers do not live here. Málaga city accounts for only 18.09% of the province’s home sales, and in 2025 people who do not live in Spain signed 27.9% of all home sales in the province.',
        body: 'For an agency or developer on the coast, that means selling to someone whose first viewing happens on a phone, in another country and in another language. A 3D model with a viewer link and augmented reality shows them the home before they travel. If you work in Marbella or Málaga city, they have their own pages: [3D rendering in Marbella](@zona-marbella) and [3D rendering in Málaga](@zona-malaga).',
      },
      {
        type: 'table',
        h2: 'Home sales by town in 2025',
        intro: 'From west to east. The right-hand column is our recommendation based on the type of home that sells most in each town.',
        caption: 'Home sales by Costa del Sol town in 2025 and what fits best',
        head: ['Town', 'Home sales 2025', 'New builds', 'What fits best'],
        rows: [
          ['San Roque (Sotogrande)', '1,018', '158 (15.5%)', 'Complete model with AR for villas and apartments'],
          ['Manilva', '1,122', '92 (8.2%)', 'Complete model for apartments and townhouses on gated estates'],
          ['Casares', '635', '113 (17.8%)', 'Complete model for coastal and golf developments'],
          ['Estepona', '3,466', '888 (25.6%)', 'New-build unit types in 3D with viewer and AR'],
          ['Benahavís', '711', '23 (3.2%)', 'Complete model and virtual staging for resale villas'],
          ['Mijas', '3,190', '337 (10.6%)', 'Complete model for resale villas and townhouses'],
          ['Fuengirola', '2,169', '621 (28.6%)', '3D floor plan for flats and a viewer for developments'],
          ['Benalmádena', '2,070', '188 (9.1%)', '3D floor plan and renders for resale apartments'],
          ['Torremolinos', '1,990', '442 (22.2%)', '3D floor plan for flats and unit types for new builds'],
          ['Rincón de la Victoria', '860', '214 (24.9%)', 'New-build unit types and 3D floor plans for flats'],
          ['Vélez-Málaga', '1,410', '160 (11.3%)', '3D floor plan and renders for flats and houses'],
          ['Torrox', '820', '155 (18.9%)', '3D floor plan and complete model for apartments'],
          ['Nerja', '582', '38 (6.5%)', '3D floor plan and renders for resale apartments and houses'],
        ],
        note: 'Source: Spanish Ministry of Housing and Urban Agenda, home sales by municipality, compiled from notarial deeds (sum of the four quarters of 2025). San Roque, in Cádiz province, covers the whole municipality, not just Sotogrande.',
        sources: [{ label: 'Spanish Ministry of Housing and Urban Agenda: property transactions by municipality', url: MIVAU }],
      },
      plate('en', 'villa_terraza_opaco'),
      {
        type: 'prose',
        h2: 'Estepona: new builds and off-plan sales',
        body: 'Estepona recorded 888 new-build home sales in 2025, the second-highest figure in the province after Málaga city and more than Marbella, Manilva, Casares and Benahavís combined. It is the town on the western coast where most homes are sold off-plan: apartment and townhouse developments, many aimed at foreign buyers.\n\nThe useful output here is every unit type in 3D, with a viewer and selector for the development’s website and augmented reality for the sales suite and fairs. We explain it in [solutions for developers](@sol-promotoras), and the full sales process in our [guide to selling off-plan](@guia-sobre-plano).',
      },
      {
        type: 'prose',
        h2: 'Benahavís: villas on gated estates',
        body: 'Benahavís is the opposite: 711 sales in 2025 and only 23 of them new builds. What sells is mostly resale villas on gated estates and large plots, often decorated to the previous owner’s taste.\n\nFor these homes the complete 3D model with [virtual staging](@servicio-staging) works: buyers see the house as they could live in it, labelled as a virtual recreation. And real-size augmented reality lets them walk the living room and terrace from their own home.',
      },
      {
        type: 'prose',
        h2: 'Mijas and Fuengirola: from townhouses to flats',
        body: 'Mijas recorded 3,190 sales in 2025, most of them resales: villas, townhouses and apartments on the coastal estates. Here the complete model helps sell to buyers comparing several similar homes in a few days.\n\nFuengirola, more urban and compact, recorded 2,169 sales, 28.6% of them new builds. Flats dominate, and for many listings a colour [3D floor plan](@servicio-plano) that explains the layout is enough.',
      },
      {
        type: 'prose',
        h2: 'Benalmádena and Torremolinos',
        body: 'Benalmádena (2,070 sales in 2025) and Torremolinos (1,990) are apartment markets with different profiles: in Benalmádena new builds made up 9.1% of sales, in Torremolinos 22.2%. For resales, a 3D floor plan and a couple of renders usually explain the home; for new developments, unit types in 3D help sell before the build is finished.',
      },
      {
        type: 'prose',
        h2: 'Sotogrande, Manilva and Casares',
        body: 'At the western end, Sotogrande belongs to San Roque, already in Cádiz province, which recorded 1,018 sales in 2025. Villas and apartments by the marina and the golf courses, with an international buyer much like Marbella’s: the complete model with augmented reality is the natural choice.\n\nManilva (1,122 sales) and Casares (635, with 17.8% new builds) mix apartments and townhouses on coastal and golf estates, often sold to buyers who do not live in Spain.',
      },
      {
        type: 'prose',
        h2: 'Nerja and the Axarquía',
        body: 'East of Málaga, the market changes scale. Nerja recorded 582 sales in 2025 and only 38 new builds: resale apartments and houses, where a 3D floor plan and renders of the main rooms explain the home. Vélez-Málaga recorded 1,410 and Torrox 820.\n\nRincón de la Victoria is the exception: 860 sales, almost one in four of them new builds. There, unit types in 3D suit the developments and 3D floor plans suit the flats.',
      },
      {
        type: 'ar',
        h2: 'How does a buyer abroad see the home?',
        intro: 'On their phone, with nothing to install. Open the villa from our [demo case](@caso-villa) in augmented reality, a Costa del Sol villa modelled from a single floor plan: with [AR Quick Look](@glosario#ar-quick-look) on iPhone or iPad and with [Scene Viewer](@glosario#scene-viewer) on Android. Not opening? See [how to view a property in AR, step by step](@guia-ar).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'How we work on the coast',
        body: 'We work remotely from the floor plan: nobody needs to visit the home, and questions are settled on a video call. If the plan has no dimensions, the model’s areas are scale estimates (≈). We do not cite clients or sales figures we cannot verify, and prices are the same along the whole coast; how we quote is on the [pricing page](@precios).',
      },
      { type: 'faq' },
    ],
    faq: faqEn,
    related: ['zona-marbella', 'zona-malaga', 'sol-promotoras', 'caso-villa', 'precios'],
    cta: {
      h2: 'Which home on the coast shall we see in 3D?',
      body: 'Send us the floor plan, from Sotogrande or from Nerja, and we will send back one room in 3D with augmented reality, free and with no commitment.',
      service: 'maqueta',
    },
  },
};
