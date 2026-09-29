// Zone page: Marbella (ES) and the single strong English local page for Marbella + Costa del Sol towns (EN).
// Keyword focus ES: render 3D Marbella, infografías 3D Marbella, plano 3D Marbella, home staging virtual Marbella.
// Keyword focus EN: 3d rendering marbella, 3d rendering costa del sol, architectural visualization marbella, virtual staging marbella.
// Anti-cannibalisation: «renders Costa del Sol» (ES) → zona-costa-del-sol. EN has no Costa del Sol twin, so the EN page covers the towns as sections.
// No physical presence promised (remote work from the plan), no local clients, the demo villa is only «Costa del Sol».
// Sources verified 2026-09-28:
//  - Ministerio de Vivienda y Agenda Urbana (boletín online, tablas 2, 2.3, 2.4 por municipios; tabla 1.6 residencia del comprador), 1T-4T 2025:
//    Marbella 4.399 compraventas (450 nueva, 3.949 segunda mano); Benahavís 711 (23); Estepona 3.466 (888, 2.º municipio de la provincia en nueva);
//    Mijas 3.190 (337); Fuengirola 2.169 (621); San Roque 1.018 (158); Málaga 6.301 (1.038). Provincia: no residentes 10.079 de 36.128 (27,9 %).
//  - Colegio de Registradores, Estadística Registral Inmobiliaria 2T 2026: extranjeros 37,01 % en Málaga (2.ª tras Alicante 46,43 %), España 15,98 %;
//    nacionalidades (España): británicos 6,99 %, neerlandeses 6,94 %, alemanes 6,11 %; precio medio provincia 3.347 €/m²; capital 3.401 €/m² (+14,7 %).

const ERI = 'https://www.registradores.org/documents/d/guest/eri_2t_2026';
const MIVAU = 'https://apps.fomento.gob.es/BoletinOnline2/?nivel=2&orden=34000000';

const faqEs = [
  {
    q: '¿Hacéis visitas a viviendas en Marbella?',
    a: 'No hace falta. {{brand}} trabaja en remoto desde el plano de la vivienda: nos lo envías en PDF, en imagen o con el enlace del anuncio, y resolvemos las dudas por videollamada, email o WhatsApp. Así el plazo no depende de desplazamientos: la maqueta 3D completa se entrega en {{delivery:maqueta}}, tanto si la vivienda está en Nueva Andalucía como en San Pedro.',
  },
  {
    q: '¿Trabajáis con agencias de Nueva Andalucía, Puerto Banús o San Pedro?',
    a: 'Sí, con cualquier agencia o asesor inmobiliario de Marbella y del resto de la Costa del Sol, porque {{brand}} solo necesita el plano. El precio no cambia por zona: desde {{price:maqueta}} + IVA por vivienda, o {{volumeUnit}} por vivienda con el pack cartera de 5. La demo de una estancia en 3D con realidad aumentada es gratis.',
  },
  {
    q: '¿Cuánto cuesta un render 3D en Marbella?',
    a: 'Con {{brand}}, un render adicional en 4K sobre el modelo cuesta {{extra:render}} + IVA, y la maqueta 3D completa con renders, visor y realidad aumentada parte de {{price:maqueta}} + IVA. Muchos estudios de la zona presupuestan por proyecto, como verás en nuestra [comparativa de estudios de infografía 3D](@guia-mejores); los rangos publicados en España, con fuente y fecha, están en la [guía de precios de renders](@guia-precio-render).',
  },
  {
    q: '¿Podéis modelar una villa grande o de varias plantas?',
    a: 'Sí. {{brand}} modela cada planta a partir de su plano y la tarifa depende de la superficie total de la vivienda, sumando todas sus plantas: {{price:maqueta}} + IVA hasta 150 m² y {{price:maqueta:1}} + IVA hasta 300 m². Para villas de más de 300 m² te damos un precio cerrado antes de empezar. Nuestro caso demostrativo es la planta alta de una villa.',
  },
  {
    q: '¿En qué idiomas trabajáis?',
    a: 'En español y en inglés. {{brand}} atiende a agencias y promotoras de Marbella en los dos idiomas, y el visor 3D de nuestro caso demostrativo está disponible en ambos, con los nombres de las estancias traducidos. Si tu comprador habla otro idioma, el visor se entiende igual: se gira, se recorre y se abre en realidad aumentada con un toque.',
  },
  {
    q: '¿Sirve para compradores que no pueden viajar a Marbella?',
    a: 'Para eso está pensado. Con el enlace del visor de {{brand}}, el comprador recorre la vivienda estancia a estancia desde su casa y la coloca sobre su mesa en realidad aumentada con un iPhone, un iPad o un móvil Android, sin instalar nada. No sustituye a la visita antes de firmar, pero le ayuda a decidir si la vivienda merece el viaje.',
  },
  {
    q: '¿Podéis enseñar cómo quedaría una villa reformada?',
    a: 'Sí, siempre que la propuesta se pueda dibujar sobre el plano. {{brand}} modela la vivienda y aplica nuevos acabados y mobiliario sobre el mismo modelo, de modo que renders, visor y realidad aumentada muestran la versión reformada. El home staging virtual cuesta {{extra:staging}} + IVA por estancia; si cambia la distribución, te damos precio antes. En el anuncio, se etiqueta como recreación virtual.',
  },
];

const faqEn = [
  {
    q: 'Do you visit properties in Marbella?',
    a: 'There is no need. {{brand}} works remotely from the floor plan: you send it as a PDF, an image or the listing link, and we sort out questions by video call, email or WhatsApp. Turnaround doesn’t depend on anyone driving anywhere, so the complete 3D model arrives in {{delivery:maqueta}}, whether the home is in Nueva Andalucía, Benahavís or Sotogrande.',
  },
  {
    q: 'Do you work with agencies in Nueva Andalucía, Puerto Banús or San Pedro?',
    a: 'Yes, with any agency or independent agent in Marbella and along the Costa del Sol, because {{brand}} only needs the floor plan. Prices are the same everywhere: from {{price:maqueta}} + VAT per home, or {{volumeUnit}} per home with the 5-home portfolio pack. The demo, one room in 3D with augmented reality, is free.',
  },
  {
    q: 'How much does 3D rendering cost in Marbella?',
    a: 'With {{brand}}, an extra 4K render on an existing model costs {{extra:render}} + VAT, and the complete 3D model with renders, viewer and augmented reality starts at {{price:maqueta}} + VAT. Many local studios quote per project, as our [round-up of 3D studios in Spain](@guia-mejores) shows; our [3D rendering cost guide](@guia-precio-render) compares the price ranges published in Spain, with sources and dates.',
  },
  {
    q: 'Can you model a large villa over several floors?',
    a: 'Yes. {{brand}} models each floor from its plan, and the price depends on the home’s total floor area, all floors added together: {{price:maqueta}} + VAT up to 150 m² and {{price:maqueta:1}} + VAT up to 300 m². For villas over 300 m², we give you a fixed quote before we start. Our demo case is the upper floor of a villa.',
  },
  {
    q: 'Do you also cover Estepona, Benahavís and Sotogrande?',
    a: 'Yes. {{brand}} works from the floor plan, so location makes no difference to price or turnaround: the same packages apply in Estepona, Benahavís, Mijas, Fuengirola, Sotogrande or Málaga, and outside the Costa del Sol too. Each area has a different mix of villas, apartments and new builds; the sections on this page explain where 3D fits in each one.',
  },
  {
    q: 'Can buyers who can’t travel view the home in augmented reality?',
    a: 'That is what it is for. With our viewer link, buyers tour the home room by room from their sofa in London or Stockholm, then place it on their table in augmented reality on an iPhone, iPad or Android phone, with no app. It doesn’t replace a viewing before they sign, but it helps them decide whether the trip is worth making.',
  },
  {
    q: 'Can you show what a dated villa would look like renovated?',
    a: 'Yes, as long as the proposal can be drawn on the plan. {{brand}} models the home and applies new finishes and furniture to the same model, so renders, viewer and AR all show the renovated version. Virtual staging costs {{extra:staging}} + VAT per room; if the layout changes, we quote first. In the listing, label the images as a virtual recreation.',
  },
  {
    q: 'Is the viewer available in English?',
    a: 'Yes. Our viewer for the demo case runs in English and Spanish, with translated room names, and we work with agencies in both languages. For buyers who speak neither, the viewer still makes sense on its own: they spin the home, tap a room to step into it and open it in augmented reality, with very little text involved.',
  },
];

import { plate } from '../data/plates.mjs';

export default {
  id: 'zona-marbella',
  image: 'villa_terraza_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-29',

  es: {
    title: 'Render 3D y maqueta virtual en Marbella',
    description: 'Modelos 3D, renders, visor y realidad aumentada desde el plano para agencias y promotoras de Marbella, sin visitas y en días. Desde {{price:maqueta}} + IVA.',
    h1: 'Render 3D y modelos 3D desde plano en Marbella',
    lead: '{{brand}}, estudio de visualización 3D de la Costa del Sol, convierte el plano de villas, áticos y viviendas de reventa u obra nueva en un modelo 3D amueblado con renders, visor para el anuncio y realidad aumentada sin app, para compradores que a menudo deciden desde otro país. Desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
    breadcrumb: 'Marbella',
    card: {
      title: 'Marbella',
      summary: 'Villas, áticos y reventa para compradores internacionales: modelo 3D, renders y realidad aumentada desde el plano.',
    },
    hero: {
      image: 'villa_terraza',
      alt: 'Terraza principal de una villa en la Costa del Sol con tumbonas, sofá exterior, suelo de barro cocido y un olivo en maceta. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'Terraza principal del caso demostrativo, una villa en la Costa del Sol. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Zona', 'Marbella, Nueva Andalucía, San Pedro y Puerto Banús'],
      ['Compraventas en 2025', '4.399 viviendas, un 10,2 % de obra nueva'],
      ['Compras por extranjeros', '37,01 % en la provincia (2.º trimestre de 2026)'],
      ['Entrada', 'El plano de la vivienda, sin visita'],
      ['Precio', 'Desde {{price:maqueta}} + IVA'],
      ['Plazo', '{{delivery:maqueta}}'],
      ['Idiomas', 'Español e inglés'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué se vende en Marbella y qué necesita el anuncio?',
        answer: 'Sobre todo vivienda de segunda mano: de las 4.399 compraventas de vivienda de Marbella en 2025, solo 450 fueron de obra nueva, según el Ministerio de Vivienda. Son villas, áticos y apartamentos que se venden con la decoración del propietario, o por reformar, y buena parte de los compradores de la provincia no reside en España.',
        body: 'Para una agencia de Marbella eso plantea dos retos: vender viviendas cuyo estado actual no ayuda, con una decoración de otra época o una reforma pendiente, y explicar la casa a alguien que la verá, con suerte, en un único viaje. El modelo 3D resuelve los dos desde el plano, sin fotos ni visita.',
      },
      {
        type: 'table',
        h2: 'El mercado de Marbella en cifras',
        caption: 'Compraventas de vivienda en Marbella y datos de la provincia de Málaga',
        head: ['Dato', 'Cifra', 'Periodo', 'Fuente'],
        rows: [
          ['Compraventas de vivienda en Marbella', '4.399', 'Año 2025', 'Ministerio de Vivienda'],
          ['De ellas, obra nueva', '450 (10,2 %)', 'Año 2025', 'Ministerio de Vivienda'],
          ['De ellas, segunda mano', '3.949 (89,8 %)', 'Año 2025', 'Ministerio de Vivienda'],
          ['Compras de vivienda por extranjeros, provincia de Málaga', '37,01 %', '2.º trimestre de 2026', 'Colegio de Registradores'],
          ['Compradores no residentes en España, provincia de Málaga', '27,9 %', 'Año 2025', 'Ministerio de Vivienda'],
          ['Precio medio registrado, provincia de Málaga', '3.347 €/m²', '2.º trimestre de 2026', 'Colegio de Registradores'],
        ],
        note: 'Las compraventas del Ministerio proceden de escrituras notariales, se cuentan por municipio de la vivienda y suman los cuatro trimestres de 2025. El porcentaje de extranjeros del Colegio de Registradores se refiere a compras inscritas en el trimestre.',
        sources: [
          { label: 'Ministerio de Vivienda y Agenda Urbana: transacciones inmobiliarias por municipios y por residencia del comprador', url: MIVAU },
          { label: 'Colegio de Registradores: Estadística Registral Inmobiliaria, 2.º trimestre de 2026', url: ERI },
        ],
      },
      plate('es', 'villa_interior_terraza'),
      {
        type: 'prose',
        h2: '¿Qué tipo de viviendas modelamos en Marbella?',
        body: '- **Villas con terrazas y porches** en Nueva Andalucía, la Milla de Oro o Elviria. Modelamos cada planta por separado, con sus terrazas, y el comprador recorre el salón o el porche a tamaño real en realidad aumentada.\n- **Áticos y apartamentos en urbanizaciones**, junto a Puerto Banús o en primera línea. Aquí el valor está en la terraza: el modelo enseña sus metros y cómo se conecta con el salón. Las vistas al mar no se modelan; esas las enseñan tus fotos.\n- **Viviendas para reformar**. Sobre el mismo modelo enseñas una propuesta de acabados y mobiliario con [home staging virtual](@servicio-staging), etiquetada como recreación virtual.\n- **Villas y promociones sobre plano**. Aunque en Marbella pesan menos que en Estepona, cada tipología se puede enseñar en 3D antes de construirla. Lo explicamos en [soluciones para promotoras](@sol-promotoras) y en la guía [vender obra nueva antes de construirla](@guia-sobre-plano).',
      },
      {
        type: 'prose',
        h2: '¿Quién compra en Marbella y cómo decide?',
        body: 'En la provincia de Málaga, el 37,01 % de las compras de vivienda del segundo trimestre de 2026 las hicieron extranjeros, el porcentaje más alto de España después de Alicante, según el Colegio de Registradores. En el conjunto de España, las nacionalidades con más compras fueron la británica (6,99 %), la neerlandesa (6,94 %) y la alemana (6,11 %).\n\nEn la práctica, el comprador internacional de Marbella suele:\n\n- buscar desde su país y concentrar las visitas en un viaje corto;\n- decidir con su pareja o su familia, que no siempre viaja;\n- comparar varias viviendas parecidas en muy pocos días.\n\nEl visor 3D por enlace y la realidad aumentada en su móvil llegan a quien no viaja. Y un modelo amueblado ayuda a recordar cuál era cuál después de ver seis villas en dos días.',
      },
      {
        type: 'viewer',
        h2: 'Pruébalo con una villa de la Costa del Sol',
        intro: 'Nuestro [caso demostrativo](@caso-villa) es la planta alta de una villa en la Costa del Sol: {{villa:rooms}} estancias, unos {{villa:interiorM2}} m² interiores y unos {{villa:terracesM2}} m² de terrazas, modelados desde un único plano y sin fotos.',
      },
      {
        type: 'table',
        h2: '¿Qué encargar para una vivienda en Marbella?',
        caption: 'Qué te recomendamos según el tipo de vivienda (precios sin IVA)',
        head: ['Vivienda', 'Qué te recomendamos', 'Precio'],
        rows: [
          ['Apartamento o ático de hasta 150 m²', 'Maqueta 3D completa: modelo, renders, visor y realidad aumentada', '{{price:maqueta}}'],
          ['Villa de más de 150 y hasta 300 m² en total', 'Maqueta 3D completa, con todas sus plantas', '{{price:maqueta:1}}'],
          ['Vivienda con decoración antigua o por reformar', 'Maqueta más home staging virtual en las estancias clave', '{{extra:staging}} por estancia'],
          ['Piso de reventa con buenas fotos', '[Plano 3D](@servicio-plano) para explicar la distribución', '{{price:plano3d}} por planta'],
          ['Varias captaciones en la zona', 'Pack cartera de 5 maquetas 3D completas', '{{volume}}'],
        ],
        note: 'Tramos por superficie, extras y condiciones en la página de [precios](@precios).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Cómo trabajamos en Marbella',
        body: 'Trabajamos en remoto desde el plano: ni tú ni el propietario tenéis que quedar con nosotros en la vivienda, y las dudas se resuelven por videollamada. Si el plano no trae cotas, las superficies del modelo son estimaciones a escala (≈). Y si trabajas también en Estepona, Benahavís o Mijas, tienes sus datos en la página de la [Costa del Sol](@zona-costa-del-sol).',
      },
      { type: 'faq' },
    ],
    faq: faqEs,
    related: ['sol-inmobiliarias', 'sol-promotoras', 'zona-costa-del-sol', 'caso-villa', 'precios'],
    cta: {
      h2: '¿Tienes una villa en cartera?',
      body: 'Envíanos su plano y te devolvemos una estancia en 3D con realidad aumentada, gratis y sin compromiso.',
      service: 'maqueta',
    },
  },

  en: {
    title: '3D rendering in Marbella and on the Costa del Sol',
    description: '3D models, CGI, a listing viewer and app-free AR from the floor plan for agents and developers in Marbella and the Costa del Sol, from {{price:maqueta}} + VAT.',
    h1: '3D rendering, 3D models and AR in Marbella',
    lead: '{{brand}}, a 3D visualisation studio on the Costa del Sol, turns floor plans of villas, penthouses and resale or off-plan homes along the Costa del Sol into furnished 3D models with renders, a listing viewer and app-free AR, for buyers who often decide from abroad. From {{price:maqueta}} + VAT, in {{delivery:maqueta}}.',
    breadcrumb: 'Marbella',
    card: {
      title: 'Marbella and the Costa del Sol',
      summary: 'Villas, penthouses and off-plan homes for international buyers: 3D model, renders and AR from the floor plan.',
    },
    hero: {
      image: 'villa_terraza',
      alt: 'Main terrace of a Costa del Sol villa with sun loungers, an outdoor sofa, terracotta floor tiles and a potted olive tree. 3D render generated from the 2D floor plan of an anonymised case.',
      caption: 'Main terrace from our demo case, a villa on the Costa del Sol. Rendered from the 2D floor plan.',
    },
    facts: [
      ['Area', 'Marbella, Benahavís, Estepona, Mijas, Fuengirola and Sotogrande'],
      ['Marbella home sales, 2025', '4,399, of which 10.2% new build'],
      ['Foreign buyers', '37.01% of purchases in Málaga province (Q2 2026)'],
      ['Input', 'The floor plan, no site visit'],
      ['Price', 'From {{price:maqueta}} + VAT'],
      ['Turnaround', '{{delivery:maqueta}}'],
      ['Languages', 'English and Spanish'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What does a Marbella listing need that others don’t?',
        answer: 'It has to work for someone who isn’t here. Most homes sold in Marbella are resales, many come with a previous owner’s décor or need updating, and more than a quarter of home sales in Málaga province go to buyers who live outside Spain. A 3D model, a viewer link and AR explain the home before anyone books a flight.',
        body: 'That is the gap we fill. From a single floor plan, with no photos and no site visit, we build a furnished, to-scale 3D model of the home. The renders, the interactive viewer and the augmented reality all come from that one model, so every view matches.',
      },
      {
        type: 'table',
        h2: 'The Marbella market in numbers',
        caption: 'Home sales in Marbella and figures for Málaga province',
        head: ['Figure', 'Value', 'Period', 'Source'],
        rows: [
          ['Home sales in Marbella', '4,399', '2025', 'Ministry of Housing'],
          ['Of which new build', '450 (10.2%)', '2025', 'Ministry of Housing'],
          ['Of which resales', '3,949 (89.8%)', '2025', 'Ministry of Housing'],
          ['Purchases by foreign nationals, Málaga province', '37.01%', 'Q2 2026', 'Colegio de Registradores'],
          ['Buyers not resident in Spain, Málaga province', '27.9%', '2025', 'Ministry of Housing'],
          ['Average registered price, Málaga province', '€3,347/m²', 'Q2 2026', 'Colegio de Registradores'],
        ],
        note: 'Ministry figures come from notarial deeds, are counted by the municipality where the home is and add up the four quarters of 2025. The Registradores foreign share refers to purchases registered in the quarter.',
        sources: [
          { label: 'Spanish Ministry of Housing and Urban Agenda: property transactions by municipality and by buyer residence', url: MIVAU },
          { label: 'Colegio de Registradores (Spain’s association of land registrars): Estadística Registral Inmobiliaria, Q2 2026', url: ERI },
        ],
      },
      plate('en', 'villa_interior_terraza'),
      {
        type: 'prose',
        h2: 'Who buys on the Costa del Sol, and how do they decide?',
        body: 'Foreign nationals made 37.01% of home purchases registered in Málaga province in Q2 2026, the second-highest share in Spain after Alicante, according to the Colegio de Registradores. Across Spain as a whole, British (6.99%), Dutch (6.94%) and German (6.11%) buyers made the most foreign purchases that quarter.\n\nIn practice, the international buyer in Marbella tends to:\n\n- search from home and pack the viewings into one short trip;\n- decide with a partner or family who don’t always travel;\n- compare several similar properties in a couple of days.\n\nA viewer link and augmented reality on their own phone reach the person who stayed at home. And a furnished model helps buyers remember which villa was which after six viewings in two days.',
      },
      {
        type: 'prose',
        h2: 'Marbella: villas, penthouses and resales',
        body: '- **Villas with terraces and porches** in Nueva Andalucía, the Golden Mile or Elviria. We model each floor separately, terraces included, and buyers can walk the living room or porch at real size in augmented reality.\n- **Penthouses and apartments** near Puerto Banús or on the beachfront. The value is in the terrace, so the model shows its size and how it connects to the living room. Sea views are not modelled: your photos show those.\n- **Homes that need work**. On the same model you can show new finishes and furniture with [virtual staging](@servicio-staging), labelled as a virtual recreation.\n- **Villas and developments sold off-plan**. Less common in Marbella than in Estepona, but every unit type can be shown in 3D before it is built; see [off-plan 3D visualisation](@sol-promotoras).',
      },
      {
        type: 'table',
        h2: 'Where else do we work along the coast?',
        intro: 'The Costa del Sol is not one market. Here is how the main towns compare, and where a 3D model tends to fit best in each.',
        caption: 'Home sales by municipality in 2025 and where 3D fits',
        head: ['Town', 'Home sales, 2025', 'New build', 'Where 3D fits best'],
        rows: [
          ['Estepona', '3,466', '888 (25.6%)', 'Off-plan unit types in 3D with viewer and AR'],
          ['Mijas', '3,190', '337 (10.6%)', 'Complete models for resale villas and townhouses'],
          ['Fuengirola', '2,169', '621 (28.6%)', '3D floor plans for flats, viewer for new developments'],
          ['San Roque (Sotogrande)', '1,018', '158 (15.5%)', 'Complete models with AR for villas and apartments'],
          ['Benahavís', '711', '23 (3.2%)', 'Complete models and virtual staging for resale villas'],
          ['Málaga city', '6,301', '1,038 (16.5%)', '3D floor plans for flats, unit types for developers'],
        ],
        note: 'Source: Spanish Ministry of Housing and Urban Agenda, home transactions by municipality (sum of the four quarters of 2025). San Roque figures cover the whole municipality, not only Sotogrande.',
        sources: [{ label: 'Spanish Ministry of Housing and Urban Agenda: home transactions by municipality', url: MIVAU }],
      },
      {
        type: 'prose',
        h2: 'Estepona and Benahavís',
        body: '**Estepona** is where off-plan selling happens on the western Costa del Sol. Its 888 new-build sales in 2025 were the second-highest of any municipality in Málaga province, behind only Málaga city, and more than Marbella, Manilva, Casares and Benahavís put together. For developers here, the useful deliverable is every unit type in 3D, with AR for the sales suite and a link for buyers abroad.\n\n**Benahavís** is the opposite: 711 home sales in 2025, almost all of them resales. Think villas on large plots in gated communities, often furnished to a previous owner’s taste. A complete model with virtual staging shows the house as a buyer might live in it. We model the house and its terraces in detail; gardens and pools only if they appear on the plan.',
      },
      {
        type: 'prose',
        h2: 'Mijas, Fuengirola, Sotogrande and Málaga',
        body: '**Mijas** recorded 3,190 home sales in 2025, mostly resales of villas, townhouses and apartments in its coastal urbanisations. **Fuengirola**, more compact and urban, had 2,169, with new build at 28.6% of the total; flats are the norm, so a colour [3D floor plan](@servicio-plano) often does the job.\n\n**Sotogrande** belongs to San Roque, in Cádiz province, which recorded 1,018 home sales in 2025. Villas and marina apartments there sell to a largely international clientele, the same profile as Marbella.\n\n**Málaga city** is a different market again: 6,301 home sales in 2025 and an average registered price of €3,401/m², up 14.7% year on year (Colegio de Registradores, 12 months to Q2 2026). Flats and new developments dominate, so a 3D floor plan or developer unit types usually fit best.',
      },
      {
        type: 'viewer',
        h2: 'Try it with a Costa del Sol villa',
        intro: 'Our [demo case](@caso-villa) is the upper floor of a villa on the Costa del Sol: {{villa:rooms}} rooms, about {{villa:interiorM2}} m² inside and {{villa:terracesM2}} m² of terraces, modelled from a single floor plan with no photos.',
      },
      {
        type: 'table',
        h2: 'What should you order for a Marbella property?',
        caption: 'What we recommend by type of home (prices excluding VAT)',
        head: ['Property', 'What we recommend', 'Price'],
        rows: [
          ['Apartment or penthouse up to 150 m²', 'Complete 3D model: model, renders, viewer and augmented reality', '{{price:maqueta}}'],
          ['Villa of over 150 and up to 300 m² in total', 'Complete 3D model, all floors included', '{{price:maqueta:1}}'],
          ['Dated home or renovation project', 'Model plus virtual staging in the key rooms', '{{extra:staging}} per room'],
          ['Resale flat with good photos', '[3D floor plan](@servicio-plano) to explain the layout', '{{price:plano3d}} per floor'],
          ['Several instructions in the area', 'Portfolio pack of 5 complete 3D models', '{{volume}}'],
        ],
        note: 'Size bands, extras and terms on our [pricing page](@precios).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'How we work on the Costa del Sol',
        body: 'We work remotely from the floor plan: neither you nor the vendor needs to meet us at the property, and questions are handled by video call. If the plan has no dimensions, areas in the model are scale estimates (≈). We never name clients or show their plans; our demo villa is anonymised and located only as “Costa del Sol”.',
      },
      { type: 'faq' },
    ],
    faq: faqEn,
    related: ['sol-inmobiliarias', 'sol-promotoras', 'servicio-renders', 'caso-villa', 'precios'],
    cta: {
      h2: 'Got a villa on your books?',
      body: 'Send us its floor plan and we will send back one room in 3D with augmented reality, free and with no commitment.',
      service: 'maqueta',
    },
  },
};
