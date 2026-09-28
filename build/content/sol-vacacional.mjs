// Audience page: holiday rentals / viviendas con fines turísticos (ES only).
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
    a: 'El plano 3D de {{brand}} cuesta {{price:plano3d}} + IVA por planta en su tramo básico e incluye la planta cenital a color y una vista isométrica amueblada, en {{delivery:plano3d}}. Si quieres además renders de cada ambiente, visor web y realidad aumentada, la maqueta 3D completa parte de {{price:maqueta}} + IVA.',
  },
  {
    q: '¿Y si gestiono varias viviendas turísticas?',
    a: 'Para gestoras y propietarios con varias viviendas, {{brand}} ofrece el pack cartera: 5 maquetas 3D completas por {{volume}} + IVA, es decir, {{volumeUnit}} por vivienda. Si varias viviendas comparten distribución, como en un edificio de apartamentos, te lo decimos al presupuestar: repetir tipología cuesta menos trabajo que modelar una vivienda nueva.',
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

export default {
  id: 'sol-vacacional',
  image: 'villa_terraza_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Plano 3D y visor 3D para alquiler vacacional',
    description: 'Plano 3D a color, renders y visor para tu apartamento turístico o villa de alquiler, incluso antes de amueblarla. Plano 3D desde {{price:plano3d}} + IVA.',
    h1: 'Plano 3D, renders y visor para alquiler vacacional',
    lead: 'Convertimos el plano de tu apartamento turístico o de tu villa de alquiler en un plano 3D a color y, si lo necesitas, en renders y un visor 3D para tu web de reservas, para anunciarla antes de amueblar. Plano 3D desde {{price:plano3d}} + IVA, en {{delivery:plano3d}}; con renders y visor, desde {{price:maqueta}} + IVA.',
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
      ['Opción básica', 'Plano 3D desde {{price:plano3d}} + IVA'],
      ['Opción completa', 'Maqueta 3D desde {{price:maqueta}} + IVA'],
      ['Staging virtual', '{{extra:staging}} + IVA por estancia'],
      ['Plazo del plano 3D', '{{delivery:plano3d}}'],
      ['Varias viviendas', 'Pack de 5 por {{volume}} + IVA'],
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
        caption: 'Qué te recomendamos según el momento de tu vivienda turística (precios sin IVA)',
        head: ['Tu situación', 'Qué te recomendamos', 'Desde'],
        rows: [
          ['Vivienda nueva o recién reformada, sin amueblar', 'Maqueta 3D completa, con renders para abrir reservas antes', '{{price:maqueta}}'],
          ['Anuncio con fotos, pero con dudas sobre la distribución', '[Plano 3D](@servicio-plano): planta cenital a color y vista isométrica', '{{price:plano3d}} por planta'],
          ['Vas a redecorar o a cambiar el mobiliario', '[Home staging virtual](@servicio-staging) sobre el modelo para comparar estilos', '{{extra:staging}} por estancia'],
          ['Tienes web propia de reservas directas', '[Visor 3D](@servicio-tour) incrustado y realidad aumentada', 'Incluido en la maqueta'],
          ['Gestionas varias viviendas', 'Pack cartera de 5 maquetas 3D completas', '{{volume}}'],
        ],
        note: 'Todas las tarifas, tramos por superficie y extras están en [precios](@precios).',
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
        answer: 'Divide el coste entre tu tarifa por noche. Ejemplo con supuestos: con un apartamento a 150 € la noche, el plano 3D ({{price:plano3d}} + IVA por planta) se cubre con muy pocas noches reservadas. Y si el modelo te permite abrir el calendario antes de amueblar, cada semana adelantada cuenta.',
        body: 'Es un ejemplo con cifras supuestas, no un resultado medido. Haz la cuenta con tu tarifa media y tu ocupación real.',
      },
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
};
