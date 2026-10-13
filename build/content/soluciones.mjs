// Hub: solutions by type of client (ES + EN).
// Keyword focus: «visualización 3D para inmobiliarias, promotoras y arquitectos» (hub level).
// Anti-cannibalisation (02-keywords-es §4.3): «renders para inmobiliarias» → servicio-renders / sol-inmobiliarias,
// «renders para promotoras» → sol-promotoras. This hub only routes and compares; it does not target those heads.
// No statistics here: every figure is a price/delivery/villa token from build/data.

export default {
  id: 'soluciones',
  image: 'villa_salon_dormitorio_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  es: {
    title: 'Modelos 3D para agencias, promotoras y arquitectos',
    description: 'Qué pack de visualización 3D encaja con tu inmobiliaria, promotora, estudio o alquiler vacacional, y cómo lo usa cada uno, con presupuesto cerrado.',
    h1: 'Visualización 3D para cada tipo de cliente inmobiliario',
    lead: 'Un mismo modelo 3D, hecho desde el plano 2D sin fotos, se usa distinto según quién vende: la agencia lo pone en el anuncio, la promotora en la sala de ventas, el arquitecto ante su cliente y el alquiler vacacional en su web. Presupuesto cerrado para cada encargo.',
    breadcrumb: 'Soluciones',
    card: {
      title: 'Soluciones por tipo de cliente',
      summary: 'Inmobiliarias, promotoras, arquitectos y alquiler vacacional: qué pack encaja con cada uno y cómo usa el modelo 3D.',
    },
    facts: [
      ['Para', 'Inmobiliarias, promotoras, arquitectos y alquiler vacacional'],
      ['Entrada', 'El plano 2D, sin fotos ni visita'],
      ['Plano 3D', 'En {{delivery:plano3d}}'],
      ['Maqueta 3D completa', 'En {{delivery:maqueta}}'],
      ['Promoción de obra nueva', 'Cada tipología en {{delivery:promocion}}'],
      ['Precio', 'Presupuesto cerrado y por escrito para cada encargo'],
      ['Zona', 'Costa del Sol y toda España, en remoto'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué cambia entre una agencia, una promotora y un estudio de arquitectura?',
        answer: 'Cambia el problema, no el modelo. La agencia tiene que explicar una vivienda vacía o que el comprador no puede visitar, la promotora vender una que aún no existe, el arquitecto conseguir que su cliente apruebe un proyecto y el alquiler vacacional abrir reservas antes de amueblar. Cada uno necesita entregables distintos del mismo modelo 3D.',
        body: 'Todo parte del mismo trabajo: levantamos la vivienda en 3D y a escala a partir del plano, con muros, huecos, mobiliario y materiales. De ese modelo salen el [plano 3D a color](@servicio-plano), los [renders fotorrealistas](@servicio-renders), el [visor 3D para tu web](@servicio-tour), la [realidad aumentada sin app](@servicio-ar) y el [home staging virtual](@servicio-staging). Lo que varía de un cliente a otro es cuánto de eso necesita y en qué canal lo enseña.\n\nAsí trabajamos la [villa en la Costa del Sol](@caso-villa) que puedes recorrer en esta web: partimos de {{villa:input}}, y el resultado tiene {{villa:rooms}} estancias amuebladas, visor y realidad aumentada. Ese caso sirve de ejemplo para las cuatro soluciones.',
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
        caption: 'Pack recomendado según el tipo de cliente y la situación',
        head: ['Tu situación', 'Qué necesitas enseñar', 'Pack recomendado'],
        rows: [
          ['Agencia con una vivienda vacía, alquilada o por reformar', 'La vivienda amueblada y recorrible, sin depender de las fotos', '[Maqueta 3D completa para inmobiliarias](@sol-inmobiliarias)'],
          ['Agencia que solo necesita explicar la distribución', 'Cómo se conectan las estancias, en una imagen para el portal', '[Plano 3D amueblado](@servicio-plano)'],
          ['Agencia con varias captaciones al mes', 'Lo mismo en cada vivienda, con un coste por unidad cerrado', 'Varias maquetas completas, con presupuesto por volumen'],
          ['Promotora que vende sobre plano', 'Cada tipología amueblada, para la web, la sala de ventas y las ferias', '[Pack de promoción de obra nueva](@sol-promotoras): cada tipología con sus renders'],
          ['Arquitecto o interiorista que presenta un proyecto', 'El proyecto en 3D, con cambios rápidos entre versiones', '[Maqueta 3D completa y renders adicionales](@sol-arquitectos)'],
          ['Alquiler vacacional antes de amueblar o de la temporada', 'La distribución y el ambiente, para que el huésped sepa qué reserva', '[Plano 3D y staging virtual si hace falta](@sol-vacacional)'],
        ],
        note: 'La maqueta completa incluye {{revisions:maqueta}} y 12 meses de alojamiento del visor. Pagas cuando recibes el trabajo terminado. Cómo presupuestamos cada pack, en [precios](@precios).',
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

  en: {
    title: '3D models for agents, developers and architects',
    description: 'Which 3D visualisation package suits your estate agency, development, design studio or holiday let, and how each one uses it, with a fixed quote.',
    h1: '3D visualisation for every kind of property client',
    lead: 'The same 3D model, built from a 2D floor plan with no photos, works differently depending on who is selling: the agent puts it in the listing, the developer in the sales suite, the architect in front of a client and the holiday let on its booking site. Every job gets a fixed quote.',
    breadcrumb: 'Solutions',
    card: {
      title: 'Solutions by type of client',
      summary: 'Estate agents, developers, architects and holiday rentals: which package suits each one and how they use the 3D model.',
    },
    facts: [
      ['For', 'Estate agents, developers, architects and holiday rentals'],
      ['Input', 'The 2D floor plan, no photos or site visit'],
      ['3D floor plan', 'In {{delivery:plano3d}}'],
      ['Complete 3D model', 'In {{delivery:maqueta}}'],
      ['New-build development', 'Each unit type in {{delivery:promocion}}'],
      ['Price', 'A fixed written quote for every job'],
      ['Coverage', 'Costa del Sol and all of Spain, remotely'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What changes between an agency, a developer and an architect?',
        answer: 'The problem changes, not the model. An agent has to explain a home that is empty or that the buyer cannot visit, a developer has to sell one that does not exist yet, an architect needs a client to sign off a design and a holiday let wants bookings before the furniture arrives. Each needs different outputs from the same 3D model.',
        body: 'It all starts with the same work: we build the home in 3D and to scale from the floor plan, with walls, openings, furniture and materials. That model gives you the [colour 3D floor plan](@servicio-plano), the [photorealistic renders](@servicio-renders), the [3D viewer for your website](@servicio-tour), [augmented reality with no app](@servicio-ar) and [virtual staging](@servicio-staging). What varies from one client to another is how much of that they need and where they show it.\n\nThat is how we produced the [Costa del Sol villa](@caso-villa) you can explore on this site: we started from {{villa:input}}, and the result has {{villa:rooms}} furnished rooms, a viewer and augmented reality. It serves as the example for all four solutions.',
      },
      {
        type: 'pages',
        h2: 'Solutions by type of client',
        intro: 'Each page covers that client’s problem, the outputs they use, how they fit the way they work and how we quote for them.',
        ids: ['sol-inmobiliarias', 'sol-promotoras', 'sol-arquitectos', 'sol-vacacional'],
      },
      {
        type: 'table',
        h2: 'Which package suits your business?',
        intro: 'Our starting recommendation for each situation. If yours does not fit any row, we will tell you once we see the plan.',
        caption: 'Recommended package by type of client and situation',
        head: ['Your situation', 'What you need to show', 'Recommended package'],
        rows: [
          ['Agency with a home that is empty, tenanted or needs renovating', 'The home furnished and explorable, without relying on photos', '[Complete 3D model for estate agents](@sol-inmobiliarias)'],
          ['Agency that only needs to explain the layout', 'How the rooms connect, in one image for the portal', '[Furnished 3D floor plan](@servicio-plano)'],
          ['Agency with several new instructions a month', 'The same output for every home, at a fixed cost per unit', 'Several complete models, with a volume quote'],
          ['Developer selling off-plan', 'Every unit type furnished, for the website, the sales suite and fairs', '[Off-plan development package](@sol-promotoras): each unit type with its renders'],
          ['Architect or interior designer presenting a project', 'The design in 3D, with quick changes between versions', '[Complete 3D model and extra renders](@sol-arquitectos)'],
          ['Holiday let before furnishing or before the season', 'The layout and the feel, so guests know what they are booking', '[3D floor plan, plus virtual staging if needed](@sol-vacacional)'],
        ],
        note: 'The complete model includes {{revisions:maqueta}} and 12 months of viewer hosting. You pay when you receive the finished work. How we quote each package is on the [pricing page](@precios).',
      },
      {
        type: 'prose',
        h2: 'How does each type of client use the 3D model?',
        body: '- **Estate agents.** The model works at three moments: when winning the instruction, to show the owner how the home will be presented; in the listing, with the 3D floor plan and renders next to the photos; and with buyers far away, who get the viewer by WhatsApp and open the home in augmented reality. It pays off most with empty, tenanted or dated homes, where photos do not help.\n- **Developers.** No photos are possible here, because the home does not exist. We model each unit type from the project drawings, and it is shown with a selector in the viewer, in augmented reality on the sales suite table and in renders for the brochure. If the design changes, the model is updated without starting again.\n- **Architects and interior designers.** The model helps decisions get made before building: the client walks through the design, sees it at real size and asks for changes. Because we build it with scripts, moving a partition or changing a floor regenerates in minutes, and you receive the files in [GLB](@glosario#glb), [USDZ](@glosario#usdz) and BLEND.\n- **Holiday rentals.** Guests book on the layout: how many beds there are, which bathroom they share with whom, whether the terrace opens off the living room. A colour [top-down floor plan](@glosario#planta-cenital) answers that in one image and lets you open the calendar before furnishing, with the images labelled as a virtual recreation.',
      },
      {
        type: 'answer',
        h2: 'What is the same for every client?',
        answer: 'The process, the way we quote and the way you pay. Every job starts with a floor plan, follows the same five steps and gets a fixed written quote before we start. And anyone can ask for the same test: we model one room of their plan free of charge and send it back with augmented reality.',
        body: 'The steps and their timings are on [how it works](@como-funciona). We work remotely across Spain and for agencies abroad that sell here, in English and Spanish; more on [where we work](@zonas).',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'No logos or testimonials, for now',
        body: '{{brand}} started in 2026 and does not yet publish client logos, testimonials or sales figures: we are not going to make them up. The proof is the [demonstration villa](@caso-villa), which you can explore and open in augmented reality, and one room from your own plan modelled free of charge. More on [about us](@sobre-nosotros).',
      },
    ],
    related: ['servicios', 'precios', 'caso-villa', 'como-funciona', 'zonas'],
    cta: {
      h2: 'Which package suits your project?',
      body: 'Tell us what you sell and send us a floor plan. We will tell you which package fits, with a fixed price and turnaround, and if you like we will send back one room in 3D with augmented reality, free. A real person replies.',
      service: 'maqueta',
    },
  },
};
