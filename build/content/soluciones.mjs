// Hub: solutions by type of client (ES only; routes.mjs has no EN path).
// Keyword focus: «visualización 3D para inmobiliarias, promotoras y arquitectos» (hub level).
// Anti-cannibalisation (02-keywords-es §4.3): «renders para inmobiliarias» → servicio-renders / sol-inmobiliarias,
// «renders para promotoras» → sol-promotoras. This hub only routes and compares; it does not target those heads.
// No statistics here: every figure is a price/delivery/villa token from build/data.

export default {
  id: 'soluciones',
  image: 'villa_salon_dormitorio_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Modelos 3D para agencias, promotoras y arquitectos',
    description: 'Qué pack de visualización 3D encaja con tu inmobiliaria, promotora, estudio o alquiler vacacional, y cómo lo usa cada uno. Desde {{price:plano3d}} + IVA.',
    h1: 'Visualización 3D para cada tipo de cliente inmobiliario',
    lead: 'Un mismo modelo 3D, hecho desde el plano 2D sin fotos, se usa distinto según quién vende: la agencia lo pone en el anuncio, la promotora en la sala de ventas, el arquitecto ante su cliente y el alquiler vacacional en su web. Plano 3D desde {{price:plano3d}} + IVA en {{delivery:plano3d}}; maqueta completa desde {{price:maqueta}} + IVA.',
    breadcrumb: 'Soluciones',
    card: {
      title: 'Soluciones por tipo de cliente',
      summary: 'Inmobiliarias, promotoras, arquitectos y alquiler vacacional: qué pack encaja con cada uno y cómo usa el modelo 3D.',
    },
    facts: [
      ['Para', 'Inmobiliarias, promotoras, arquitectos y alquiler vacacional'],
      ['Entrada', 'El plano 2D, sin fotos ni visita'],
      ['Plano 3D', 'Desde {{price:plano3d}} + IVA, en {{delivery:plano3d}}'],
      ['Maqueta 3D completa', 'Desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}'],
      ['Promoción de obra nueva', 'Desde {{price:promocion}} + IVA, hasta 3 tipologías'],
      ['Pack cartera', '5 maquetas por {{volume}} + IVA'],
      ['Zona', 'Costa del Sol y toda España, en remoto'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué cambia entre una agencia, una promotora y un estudio de arquitectura?',
        answer: 'Cambia el problema, no el modelo. La agencia tiene que explicar una vivienda vacía o que el comprador no puede visitar, la promotora vender una que aún no existe, el arquitecto conseguir que su cliente apruebe un proyecto y el alquiler vacacional abrir reservas antes de amueblar. Cada uno necesita entregables distintos del mismo modelo 3D.',
        body: 'Todo parte del mismo trabajo: levantamos la vivienda en 3D y a escala a partir del plano, con muros, huecos, mobiliario y materiales. De ese modelo salen el [plano 3D a color](@servicio-plano), los [renders fotorrealistas](@servicio-renders), el [visor 3D para tu web](@servicio-tour), la [realidad aumentada sin app](@servicio-ar) y el [home staging virtual](@servicio-staging). Lo que varía de un cliente a otro es cuánto de eso necesita y en qué canal lo enseña.\n\nAsí trabajamos la [villa en la Costa del Sol](@caso-villa) que puedes recorrer en esta web: partimos de {{villa:input}} y el resultado tiene {{villa:rooms}} estancias amuebladas, visor y realidad aumentada. Ese caso sirve de ejemplo para las cuatro soluciones.',
      },
      {
        type: 'pages',
        h2: 'Soluciones por tipo de cliente',
        intro: 'Cada página explica el problema de ese cliente, qué entregables usa, cómo encajan en su forma de trabajar y cuánto cuestan.',
        ids: ['sol-inmobiliarias', 'sol-promotoras', 'sol-arquitectos', 'sol-vacacional'],
      },
      {
        type: 'table',
        h2: '¿Qué pack encaja con tu negocio?',
        intro: 'Nuestra recomendación de partida para cada situación. Si tu caso no cabe en ninguna fila, te lo decimos al ver el plano.',
        caption: 'Pack recomendado según el tipo de cliente y la situación (precios sin IVA)',
        head: ['Tu situación', 'Qué necesitas enseñar', 'Pack recomendado', 'Desde'],
        rows: [
          ['Agencia con una vivienda vacía, alquilada o por reformar', 'La vivienda amueblada y recorrible, sin depender de las fotos', '[Maqueta 3D completa para inmobiliarias](@sol-inmobiliarias)', '{{price:maqueta}} por vivienda'],
          ['Agencia que solo necesita explicar la distribución', 'Cómo se conectan las estancias, en una imagen para el portal', '[Plano 3D amueblado](@servicio-plano)', '{{price:plano3d}} por planta'],
          ['Agencia con varias captaciones al mes', 'Lo mismo en cada vivienda, con un coste por unidad cerrado', 'Pack cartera: 5 maquetas completas para usar en 6 meses', '{{volume}} ({{volumeUnit}} por vivienda)'],
          ['Promotora que vende sobre plano', 'Cada tipología amueblada, para la web, la sala de ventas y las ferias', '[Pack de promoción de obra nueva](@sol-promotoras): 3 tipologías y 12 renders', '{{price:promocion}}; tipología adicional, {{extra:tipologia}}'],
          ['Arquitecto o interiorista que presenta un proyecto', 'El proyecto en 3D, con cambios rápidos entre versiones', '[Maqueta 3D completa y renders adicionales](@sol-arquitectos)', '{{price:maqueta}}; render adicional, {{extra:render}}'],
          ['Alquiler vacacional antes de amueblar o de la temporada', 'La distribución y el ambiente, para que el huésped sepa qué reserva', '[Plano 3D y staging virtual si hace falta](@sol-vacacional)', '{{price:plano3d}}; staging, {{extra:staging}} por estancia'],
        ],
        note: 'La maqueta completa incluye {{revisions:maqueta}} y 12 meses de alojamiento del visor. Pagas cuando recibes el trabajo terminado. El detalle de cada pack, los extras y los tramos por superficie están en [precios](@precios).',
      },
      {
        type: 'prose',
        h2: '¿Cómo usa el modelo 3D cada tipo de cliente?',
        body: '- **Inmobiliarias.** El modelo trabaja en tres momentos: en la captación, para enseñar al propietario cómo se presentará su vivienda; en el anuncio, con el plano 3D y los renders junto a las fotos; y con el comprador que está lejos, que recibe el visor por WhatsApp y abre la vivienda en realidad aumentada. Rinde más en viviendas vacías, alquiladas o por reformar, donde las fotos no ayudan.\n- **Promotoras.** Aquí no hay fotos posibles, porque la vivienda no existe. Modelamos cada tipología desde los planos del proyecto y se enseña con un selector en el visor, en realidad aumentada sobre la mesa de la sala de ventas y en renders para el folleto. Si el proyecto cambia, el modelo se actualiza sin empezar de cero.\n- **Arquitectos e interioristas.** El modelo sirve para decidir antes de construir: el cliente recorre el proyecto, lo ve a tamaño real y pide cambios. Como lo construimos con scripts, mover un tabique o cambiar un suelo se regenera en minutos, y te entregamos los archivos en [GLB](@glosario#glb), [USDZ](@glosario#usdz) y BLEND.\n- **Alquiler vacacional.** El huésped reserva por la distribución: cuántas camas hay, qué baño comparte con quién, si la terraza sale del salón. Una [planta cenital](@glosario#planta-cenital) a color lo responde en una imagen y te deja abrir el calendario antes de amueblar, con las imágenes etiquetadas como recreación virtual.',
      },
      {
        type: 'answer',
        h2: '¿Qué es igual para todos los clientes?',
        answer: 'El proceso, los precios y la forma de pago. Todos los encargos empiezan con un plano, siguen los mismos cinco pasos y tienen un precio público que te cerramos antes de empezar. Y cualquiera puede pedir la misma prueba: modelamos gratis una estancia de su plano y se la enviamos con realidad aumentada.',
        body: 'Los pasos y sus tiempos están en [cómo funciona](@como-funciona). Trabajamos en remoto para toda España y para agencias extranjeras que venden aquí, en español y en inglés; lo contamos en [dónde trabajamos](@zonas).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Sin logos ni testimonios, de momento',
        body: '{{brand}} empezó en 2026 y todavía no publica logos de clientes, testimonios ni cifras de ventas: no vamos a inventarlos. La prueba es la [villa de demostración](@caso-villa), que puedes recorrer y abrir en realidad aumentada, y una estancia de tu propio plano modelada gratis. Lo explicamos en [quiénes somos](@sobre-nosotros).',
      },
    ],
    related: ['servicios', 'precios', 'caso-villa', 'como-funciona', 'zonas'],
    cta: {
      h2: '¿Qué pack encaja con tu caso?',
      body: 'Cuéntanos qué vendes y envíanos un plano. Te decimos qué pack encaja, con precio y plazo cerrados, y si quieres te devolvemos una estancia en 3D con realidad aumentada, gratis. Contesta una persona.',
      service: 'maqueta',
    },
  },
};
