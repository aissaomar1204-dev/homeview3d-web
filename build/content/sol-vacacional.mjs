// Audience page: holiday rentals / viviendas con fines turísticos (ES + EN).
// Keyword focus (02-keywords C13): tour virtual apartamento turístico, plano 3D alquiler vacacional, fotos Airbnb.
// Honest angle: the home already exists and usually has photos, so the use cases are pre-launch, redecoration,
// layout questions and direct-booking websites. No claims about booking platforms' features beyond images.

const faq = [
  {
    q: '¿Sirve para un alquiler vacacional en Airbnb o Booking?',
    a: 'Sí, con matices. En los portales de reservas subes los renders y el plano 3D de {{brand}} como imágenes del anuncio, que es lo que todos admiten. El visor 3D y la realidad aumentada van en tu web de reservas directas y en los canales que gestionas tú, como WhatsApp o el email. Revisa las normas de cada plataforma sobre enlaces externos antes de publicar ninguno.',
  },
  {
    q: '¿Puedo anunciar el apartamento antes de amueblarlo?',
    a: 'Sí, y es el caso en el que más rinde. {{brand}} modela y amuebla la vivienda desde el plano, así que puedes abrir el calendario con renders del modelo mientras terminas la obra o esperas los muebles. Publícalos con su mención de render y sustitúyelos por fotos reales cuando la vivienda esté lista, para que el huésped encuentre lo que ha visto.',
  },
  {
    q: '¿Hay que indicar que las imágenes son virtuales?',
    a: 'Sí. {{brand}} entrega cada imagen con su mención para el pie de foto: «Render 3D. Imagen orientativa; mobiliario no incluido» en los renders y «Recreación virtual. Mobiliario no incluido» en el home staging virtual. Mantenla en el anuncio. Recomendamos usar el modelo para enseñar la distribución y el estilo, nunca para prometer muebles o vistas que el huésped no va a encontrar. Es una cuestión de confianza y de reseñas.',
  },
  {
    q: '¿Cuánto cuesta un plano 3D para un apartamento turístico?',
    a: 'Depende de la superficie y de lo que necesites. El plano 3D de {{brand}} incluye la planta cenital a color y una vista isométrica amueblada, en {{delivery:plano3d}}. Si quieres además renders de cada ambiente, visor web y realidad aumentada, la maqueta 3D completa. En los dos casos te mandamos un presupuesto cerrado al ver el plano.',
  },
  {
    q: '¿Y si gestiono varias viviendas turísticas?',
    a: 'Para gestoras y propietarios con varias viviendas, {{brand}} prepara un presupuesto por volumen: cuantas más viviendas, menor el precio por unidad. Si varias viviendas comparten distribución, como en un edificio de apartamentos, te lo decimos al presupuestar: repetir tipología cuesta menos trabajo que modelar una vivienda nueva.',
  },
  {
    q: '¿Tenéis que venir al apartamento?',
    a: 'No. {{brand}} trabaja en remoto desde el plano del apartamento o de la villa, en PDF o imagen. Si nos envías fotos de los acabados, como el suelo, la cocina o los baños, el modelo se parecerá más a la realidad; si todavía no existen, proponemos materiales. Las dudas se resuelven por email, WhatsApp o videollamada.',
  },
  {
    q: '¿Pueden los huéspedes ver la vivienda en realidad aumentada?',
    a: 'Sí, con la maqueta 3D completa de {{brand}}. Desde tu web o desde el enlace que les envíes, el huésped toca un botón y la vivienda aparece sobre su mesa a escala 1:20 en iPhone, iPad o Android compatible, sin instalar nada. Es útil para familias y grupos que quieren decidir quién duerme dónde antes de llegar.',
  },
];

const faqEn = [
  {
    q: 'Does it work for a holiday let on Airbnb or Booking.com?',
    a: 'Yes, with a caveat. On booking platforms you upload the {{brand}} renders and 3D floor plan as listing photos, which every platform accepts. The 3D viewer and augmented reality go on your direct-booking website and in the channels you run yourself, such as WhatsApp or email. Check each platform’s rules on external links before posting any.',
  },
  {
    q: 'Can I list the apartment before it is furnished?',
    a: 'Yes, and that is where it pays off most. {{brand}} models and furnishes the home from the floor plan, so you can open your calendar with renders of the model while the works finish or the furniture is on its way. Publish them with their render label and swap them for real photos once the home is ready, so guests find what they saw.',
  },
  {
    q: 'Do I have to say the images are virtual?',
    a: 'Yes. {{brand}} delivers every image with its caption label: “3D render. Indicative image; furniture not included.” on renders and “Virtually staged. Furniture not included.” on virtual staging. Keep it in the listing. Use the model to show the layout and the style, never to promise furniture or views that guests will not find. It is a matter of trust, and of reviews.',
  },
  {
    q: 'How much does a 3D floor plan for a holiday apartment cost?',
    a: 'It depends on the floor area and on what you need. The {{brand}} 3D floor plan includes a colour top-down plan and a furnished isometric view, in {{delivery:plano3d}}. If you also want renders of each room, a web viewer and augmented reality, that is the complete 3D model. Either way, we send you a fixed quote once we see the floor plan.',
  },
  {
    q: 'What if I manage several holiday rentals?',
    a: 'For management companies and owners with several properties, {{brand}} prepares a volume quote: the more homes, the lower the price per unit. If several homes share a layout, as in an apartment building, we take that into account when quoting, because repeating a unit type is less work than modelling a new home.',
  },
  {
    q: 'Do you need to visit the apartment?',
    a: 'No. {{brand}} works remotely from the floor plan of the apartment or villa, as a PDF or image. If you send photos of the finishes, such as the floors, kitchen or bathrooms, the model will look closer to reality; if they do not exist yet, we propose materials. Questions are handled by email, WhatsApp or video call.',
  },
  {
    q: 'Can guests view the home in augmented reality?',
    a: 'Yes, with the {{brand}} complete 3D model. From your website or a link you send them, guests tap a button and the home appears on their table at 1:20 scale on an iPhone, iPad or compatible Android phone, with nothing to install. It helps families and groups decide who sleeps where before they arrive.',
  },
];

import { plate } from '../data/plates.mjs';

export default {
  id: 'sol-vacacional',
  image: 'villa_terraza_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  es: {
    title: 'Plano 3D y visor 3D para alquiler vacacional',
    description: 'Plano 3D a color, renders y visor para tu apartamento turístico o villa de alquiler, incluso antes de amueblarla, con presupuesto cerrado.',
    h1: 'Plano 3D, renders y visor para alquiler vacacional',
    lead: 'Convertimos el plano de tu apartamento turístico o de tu villa de alquiler en un plano 3D a color y, si lo necesitas, en renders y un visor 3D para tu web de reservas, para anunciarla antes de amueblar. Plano 3D en {{delivery:plano3d}}; con renders y visor, en {{delivery:maqueta}}.',
    breadcrumb: 'Alquiler vacacional',
    card: {
      title: 'Para alquiler vacacional',
      summary: 'Lanza el anuncio antes de amueblar y enseña la distribución con plano 3D, renders y visor para reservas directas.',
    },
    hero: {
      image: 'villa_terraza',
      alt: 'Terraza principal de una villa en la Costa del Sol con tumbonas, sofá exterior, suelo de barro cocido y un olivo en maceta. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'Terraza principal del caso demostrativo. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Para', 'Propietarios y gestoras de viviendas turísticas'],
      ['Entrada', 'El plano del apartamento o de la villa'],
      ['Opción básica', 'Plano 3D a color'],
      ['Opción completa', 'Maqueta 3D con renders, visor y realidad aumentada'],
      ['Staging virtual', 'Por estancia, sobre el modelo'],
      ['Plazo del plano 3D', '{{delivery:plano3d}}'],
      ['Varias viviendas', 'Presupuesto por volumen'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Sirve el 3D para un alquiler vacacional?',
        answer: 'Sí, en tres casos concretos: cuando la vivienda aún no está amueblada y quieres abrir reservas, cuando vas a redecorar y quieres probar antes de comprar muebles, y cuando los huéspedes preguntan una y otra vez cómo se reparten los dormitorios. Si ya tienes buenas fotos y el anuncio funciona, quizá no lo necesites.',
        body: 'A diferencia de una agencia o una promotora, tú no vendes la vivienda: vendes noches. Lo que importa es llegar antes al calendario y que el huésped reserve sabiendo exactamente qué va a encontrar.',
      },
      {
        type: 'table',
        h2: '¿Qué encargar según tu situación?',
        caption: 'Qué te recomendamos según el momento de tu vivienda turística',
        head: ['Tu situación', 'Qué te recomendamos'],
        rows: [
          ['Vivienda nueva o recién reformada, sin amueblar', 'Maqueta 3D completa, con renders para abrir reservas antes'],
          ['Anuncio con fotos, pero con dudas sobre la distribución', '[Plano 3D](@servicio-plano): planta cenital a color y vista isométrica'],
          ['Vas a redecorar o a cambiar el mobiliario', '[Home staging virtual](@servicio-staging) sobre el modelo para comparar estilos'],
          ['Tienes web propia de reservas directas', '[Visor 3D](@servicio-tour) incrustado y realidad aumentada, incluidos en la maqueta'],
          ['Gestionas varias viviendas', 'Varias maquetas 3D completas, con presupuesto por volumen'],
        ],
        note: 'Cómo presupuestamos cada opción, en [precios](@precios).',
      },
      {
        type: 'prose',
        h2: '¿Qué preguntas del huésped responde un plano 3D?',
        body: 'Las que llegan por mensaje antes de reservar, y las que terminan en una reseña regular cuando la respuesta no era la esperada:\n\n- ¿Qué dormitorio tiene baño propio?\n- ¿Las camas son dobles o individuales, y dónde está el sofá cama?\n- ¿La terraza da al salón o a un dormitorio?\n- ¿Hay que atravesar una habitación para llegar al baño?\n- ¿Cabe una familia de cinco sin que nadie duerma en el salón?\n\nUna planta cenital a color con el mobiliario dibujado responde a todas de un vistazo, y sin traducir nada: sirve igual para un huésped alemán que para uno de Sevilla.',
      },
      {
        type: 'figure',
        image: 'villa_planta_cenital',
        alt: 'Planta cenital a color de la planta alta de una villa en la Costa del Sol, con dormitorios, baños, salón y terrazas amueblados. Render 3D generado a partir del plano 2D.',
        caption: 'Planta cenital del caso demostrativo: {{villa:rooms}} estancias y {{villa:bedrooms}} dormitorios leídos de un vistazo. Render generado a partir del plano 2D.',
        layout: 'wide',
      },
      {
        type: 'steps',
        h2: '¿Cómo lo usas en cada canal?',
        intro: 'Cada canal admite cosas distintas. Esta es la forma de aprovechar el modelo sin saltarte las normas de nadie.',
        items: [
          { title: 'Portales de reservas', body: 'Subes los renders y la planta a color como fotos del anuncio. Revisa las normas de cada plataforma sobre enlaces externos: lo que siempre puedes publicar son imágenes.' },
          { title: 'Tu web de reservas directas', body: 'Incrustas el visor 3D con un iframe. El huésped gira la vivienda, entra en cada estancia y, desde el móvil, la coloca sobre la mesa en realidad aumentada. Es un argumento que los portales no te dan.' },
          { title: 'Mensajes con huéspedes', body: 'En los canales que gestionas tú, como WhatsApp o el email, envías el enlace del visor a quien pregunta por la distribución, las camas o la terraza.' },
          { title: 'Antes de abrir', body: 'Si la vivienda está a medio amueblar, publicas con renders del modelo, cada uno con su mención de render, y los sustituyes por fotos reales cuando esté lista.' },
        ],
      },
      {
        type: 'viewer',
        h2: 'Así verá tu huésped la vivienda',
        intro: 'Es la villa de nuestro [caso demostrativo](@caso-villa), con terraza principal, terraza de dormitorio y {{villa:bedrooms}} dormitorios, modelada desde un único plano. Gírala, entra en cada estancia o ábrela en realidad aumentada.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Recreación virtual',
        body: 'Cada imagen te llega con su mención para el pie de foto: «Render 3D. Imagen orientativa; mobiliario no incluido» en los renders y «Recreación virtual. Mobiliario no incluido» en el home staging virtual. Mantenla en el anuncio. El huésped debe encontrar lo que ha visto: usa el modelo para enseñar la distribución y el estilo, no para prometer muebles que no vas a poner. Las vistas desde la terraza no se modelan: esas las enseñan tus fotos.',
      },
      {
        type: 'answer',
        h2: '¿Cuántas noches necesitas para cubrirlo?',
        answer: 'Divide el coste entre tu tarifa por noche. Con el presupuesto cerrado delante, compara cuántas noches reservadas lo cubren: en un apartamento turístico suelen ser pocas. Y si el modelo te permite abrir el calendario antes de amueblar, cada semana adelantada cuenta.',
        body: 'Es un ejemplo con cifras supuestas, no un resultado medido. Haz la cuenta con tu tarifa media y tu ocupación real.',
      },
      plate('es', 'villa_interior_dormitorio'),
      { type: 'faq' },
    ],
    faq,
    related: ['servicio-plano', 'servicio-staging', 'servicio-tour', 'caso-villa', 'precios'],
    cta: {
      h2: '¿Vemos tu vivienda en 3D antes de amueblarla?',
      body: 'Envíanos el plano y te devolvemos una estancia en 3D con realidad aumentada, gratis y sin compromiso.',
      service: 'plano3d',
    },
  },

  en: {
    title: '3D floor plans and 3D tours for holiday rentals',
    description: 'A colour 3D floor plan, renders and a viewer for your holiday apartment or rental villa, even before it is furnished, with a fixed quote.',
    h1: '3D floor plans, renders and a viewer for holiday rentals',
    lead: 'We turn the floor plan of your holiday apartment or rental villa into a colour 3D floor plan and, if you need them, renders and a 3D viewer for your direct-booking website, so you can list it before it is furnished. 3D floor plan in {{delivery:plano3d}}; with renders and viewer, in {{delivery:maqueta}}.',
    breadcrumb: 'Holiday rentals',
    card: {
      title: 'For holiday rentals',
      summary: 'Launch the listing before furnishing and show the layout with a 3D floor plan, renders and a viewer for direct bookings.',
    },
    hero: {
      image: 'villa_terraza',
      alt: 'Main terrace of a Costa del Sol villa with sun loungers, an outdoor sofa, terracotta floor tiles and a potted olive tree. 3D render generated from the 2D floor plan of an anonymised case.',
      caption: 'Main terrace of our demo case. Rendered from the 2D floor plan.',
    },
    facts: [
      ['For', 'Owners and managers of holiday rentals'],
      ['Input', 'The floor plan of the apartment or villa'],
      ['Basic option', 'Colour 3D floor plan'],
      ['Full option', 'Complete 3D model with renders, viewer and AR'],
      ['Virtual staging', 'Per room, on the model'],
      ['3D floor plan turnaround', '{{delivery:plano3d}}'],
      ['Several properties', 'Volume quote'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Is 3D worth it for a holiday rental?',
        answer: 'Yes, in three specific cases: when the home is not furnished yet and you want to open bookings, when you are about to redecorate and want to try it before buying furniture, and when guests keep asking how the bedrooms are arranged. If you already have good photos and the listing performs, you may not need it.',
        body: 'Unlike an agency or a developer, you are not selling the home: you are selling nights. What matters is reaching the calendar sooner and having guests book knowing exactly what they will find.',
      },
      {
        type: 'table',
        h2: 'What should you order for your situation?',
        caption: 'What we recommend at each stage of your holiday rental',
        head: ['Your situation', 'What we recommend'],
        rows: [
          ['New or newly renovated home, not yet furnished', 'Complete 3D model, with renders to open bookings sooner'],
          ['Listing with photos, but guests unsure about the layout', '[3D floor plan](@servicio-plano): colour top-down plan and isometric view'],
          ['You are about to redecorate or change the furniture', '[Virtual staging](@servicio-staging) on the model to compare styles'],
          ['You have your own direct-booking website', 'Embedded [3D viewer](@servicio-tour) and augmented reality, both included in the complete model'],
          ['You manage several properties', 'Several complete 3D models, with a volume quote'],
        ],
        note: 'How we quote each option is on the [pricing page](@precios).',
      },
      {
        type: 'prose',
        h2: 'Which guest questions does a 3D floor plan answer?',
        body: 'The ones that arrive by message before booking, and the ones that end in a lukewarm review when the answer was not what guests expected:\n\n- Which bedroom has its own bathroom?\n- Are the beds doubles or singles, and where is the sofa bed?\n- Does the terrace open off the living room or a bedroom?\n- Do you have to walk through a bedroom to reach the bathroom?\n- Can a family of five stay without anyone sleeping in the living room?\n\nA colour top-down plan with the furniture drawn in answers all of them at a glance, with nothing to translate: it works as well for a guest from Germany as for one from Leeds.',
      },
      {
        type: 'figure',
        image: 'villa_planta_cenital',
        alt: 'Colour top-down plan of the upper floor of a Costa del Sol villa, with furnished bedrooms, bathrooms, living room and terraces. 3D render generated from the 2D floor plan.',
        caption: 'Top-down plan of our demo case: {{villa:rooms}} rooms and {{villa:bedrooms}} bedrooms readable at a glance. Rendered from the 2D floor plan.',
        layout: 'wide',
      },
      {
        type: 'steps',
        h2: 'How do you use it on each channel?',
        intro: 'Each channel accepts different things. This is how to make the most of the model without breaking anyone’s rules.',
        items: [
          { title: 'Booking platforms', body: 'You upload the renders and the colour floor plan as listing photos. Check each platform’s rules on external links: images are what you can always publish.' },
          { title: 'Your direct-booking website', body: 'You embed the 3D viewer with an iframe. Guests turn the home around, step into each room and, on their phone, place it on the table in augmented reality. It is a selling point the platforms do not give you.' },
          { title: 'Messages with guests', body: 'In the channels you run yourself, such as WhatsApp or email, you send the viewer link to anyone asking about the layout, the beds or the terrace.' },
          { title: 'Before opening', body: 'If the home is half furnished, you list it with renders of the model, each with its render label, and swap them for real photos once it is ready.' },
        ],
      },
      {
        type: 'viewer',
        h2: 'How your guests will see the home',
        intro: 'This is the villa from our [demo case](@caso-villa), with a main terrace, a bedroom terrace and {{villa:bedrooms}} bedrooms, modelled from a single floor plan. Turn it around, step into each room or open it in augmented reality.',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Virtual recreation',
        body: 'Every image comes with its caption label: “3D render. Indicative image; furniture not included.” on renders and “Virtually staged. Furniture not included.” on virtual staging. Keep it in the listing. Guests should find what they saw: use the model to show the layout and the style, not to promise furniture you will not put in. Views from the terrace are not modelled: your photos show those.',
      },
      {
        type: 'answer',
        h2: 'How many nights does it take to cover the cost?',
        answer: 'Divide the cost by your nightly rate. With the fixed quote in front of you, work out how many booked nights cover it: for a holiday apartment it is usually only a few. And if the model lets you open the calendar before furnishing, every week gained counts.',
        body: 'This is a worked method, not a measured result. Do the sums with your own average rate and your real occupancy.',
      },
      plate('en', 'villa_interior_dormitorio'),
      { type: 'faq' },
    ],
    faq: faqEn,
    related: ['servicio-plano', 'servicio-staging', 'servicio-tour', 'caso-villa', 'precios'],
    cta: {
      h2: 'Shall we see your home in 3D before you furnish it?',
      body: 'Send us the floor plan and we will send back one room in 3D with augmented reality, free and with no commitment.',
      service: 'plano3d',
    },
  },
};
