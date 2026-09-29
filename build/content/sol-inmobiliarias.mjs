// Audience page: estate agencies (ES) / estate agents (EN).
// Keyword focus ES: visualización 3D / modelos 3D y AR para inmobiliarias (captar exclusivas, vender a distancia).
// Keyword focus EN: 3D floor plans for estate agents, real estate agencies Spain, AR viewings.
// Anti-cannibalisation: «plano 3D para inmobiliarias» (servicio-plano) and «renders para inmobiliarias» (servicio-renders) are linked, not targeted.

const faqEs = [
  {
    q: '¿Qué gana una inmobiliaria con un modelo 3D de la vivienda?',
    a: 'Con el modelo 3D de {{brand}}, la agencia llega a la captación con un argumento que otras no tienen y publica un anuncio que explica la vivienda mejor que las fotos: renders amueblados, visor 3D por estancias y realidad aumentada sin app. El comprador entiende la distribución antes de pedir visita. Cuesta desde {{price:maqueta}} + IVA por vivienda y se entrega en {{delivery:maqueta}}.',
  },
  {
    q: '¿Puedo poner el visor 3D en idealista o en Fotocasa?',
    a: 'Dentro de idealista, no: solo acepta tours de proveedores multimedia compatibles, y {{brand}} no promete lo contrario. Lo que sí puedes hacer es subir los renders y la planta a color como imágenes del anuncio, incrustar el visor en la ficha de tu web con un iframe, enviar el enlace por WhatsApp o email y usarlo en el campo de tour virtual de los portales que admitan una URL externa.',
  },
  {
    q: '¿Sirve para vender una vivienda vacía o sin reformar?',
    a: 'Sí, es donde más se nota. {{brand}} amuebla el modelo 3D a partir del plano, así que no dependes de fotos de habitaciones vacías o de una decoración antigua. Con el home staging virtual ({{extra:staging}} + IVA por estancia) pruebas otro estilo sobre el mismo modelo. Esas imágenes se publican etiquetadas como recreación virtual, porque el mobiliario no se incluye en la venta.',
  },
  {
    q: '¿Hacéis descuentos por volumen para agencias?',
    a: 'Sí. {{brand}} ofrece el pack cartera: 5 maquetas 3D completas por {{volume}} + IVA, es decir, {{volumeUnit}} por vivienda de hasta 150 m². Con 10 o más, el precio vuelve a bajar y se aplica a todas las viviendas del encargo; la calculadora de esta página te da el total al momento. Cada maqueta incluye el modelo 3D amueblado, los renders, el visor web para tu anuncio y la realidad aumentada para iPhone y Android.',
  },
  {
    q: '¿Tengo que ir a la vivienda a hacer fotos o a medir?',
    a: 'No. {{brand}} trabaja desde el plano: basta con un PDF, una imagen o el enlace del anuncio. Si tienes una cota de referencia o la superficie aproximada, la precisión mejora; si no, estimamos las medidas con la escala del plano y lo indicamos con el signo ≈. Las fotos de acabados son opcionales y sirven para acertar con suelos, cocina y baños.',
  },
  {
    q: '¿Cómo ven la vivienda los compradores que están en el extranjero?',
    a: 'Con un enlace. El comprador abre el visor 3D de {{brand}} en el móvil o en el ordenador, recorre la vivienda estancia a estancia y, con un toque, la coloca sobre su mesa en realidad aumentada: con AR Quick Look en iPhone y iPad y con Scene Viewer en Android. No instala ninguna app. Si lo abre en un ordenador, ve un código QR para pasar al móvil.',
  },
  {
    q: '¿Qué pasa con el visor cuando la vivienda se vende?',
    a: 'La maqueta 3D completa de {{brand}} incluye el primer año de alojamiento del visor. Si la vivienda se vende antes, lo retiramos cuando nos lo pidas. Si quieres mantenerlo más tiempo, por ejemplo para enseñarlo en futuras captaciones como muestra de tu trabajo, la renovación cuesta {{extra:hosting}} + IVA por vivienda y año.',
  },
  {
    q: '¿Qué diferencia hay entre el plano 3D y la maqueta 3D completa?',
    a: 'El plano 3D de {{brand}} ({{price:plano3d}} + IVA por planta) son imágenes: la planta cenital a color y una vista isométrica amueblada. La maqueta 3D completa ({{price:maqueta}} + IVA) añade renders de cada ambiente, el visor web para tu anuncio y la realidad aumentada. Para un piso de reventa con buenas fotos suele bastar el plano 3D.',
  },
];

const faqEn = [
  {
    q: 'What does an estate agent gain from a 3D model of a property?',
    a: 'With our 3D model, you walk into the valuation with something the other agents don’t offer, and you publish a listing that explains the home better than photos can: furnished renders, a room-by-room 3D viewer and app-free augmented reality. Buyers understand the layout before they ask to view. It costs from {{price:maqueta}} + VAT per home, delivered in {{delivery:maqueta}}.',
  },
  {
    q: 'Can I put the 3D viewer on idealista, Kyero or Rightmove?',
    a: 'Not inside the portal page itself. idealista only accepts tours from its approved multimedia providers, and {{brand}} won’t promise otherwise for any portal. What you can do: upload the renders and the colour plan as listing photos, embed the viewer on your own website with an iframe, send the link by WhatsApp or email, and paste it into a portal’s virtual tour field where the portal accepts an external URL.',
  },
  {
    q: 'Does it work for an empty or dated property?',
    a: 'That is where it helps most. {{brand}} furnishes the 3D model from the floor plan, so you no longer depend on photos of bare rooms or tired décor. With virtual staging ({{extra:staging}} + VAT per room) you can show a different style on the same model. Those images should be labelled as a virtual recreation in the listing, because the furniture is not part of the sale.',
  },
  {
    q: 'Is there a discount if my agency orders several models?',
    a: 'Yes. {{brand}} has a Portfolio pack: 5 complete 3D models for {{volume}} + VAT, which works out at {{volumeUnit}} per home up to 150 m². From 10 homes the unit price drops again and applies to every home in the order; the calculator on this page gives you the total straight away. Every model includes the furnished 3D model, the renders, the web viewer for your listing and augmented reality for iPhone and Android.',
  },
  {
    q: 'Do I have to go back to the property to measure or take photos?',
    a: 'No. {{brand}} works from the floor plan: a PDF, an image or the listing link is enough. A reference dimension or the approximate floor area improves accuracy; without one, we estimate measurements from the plan’s scale and mark them as approximate (≈). Photos of the finishes are optional and help us get floors, kitchen and bathrooms right.',
  },
  {
    q: 'How do buyers abroad view the property?',
    a: 'Through a link. Buyers open our 3D viewer on their phone or computer, move through the home room by room and, with one tap, place it on their table in augmented reality: AR Quick Look on iPhone and iPad, Scene Viewer on Android. There is no app to install. On a computer they see a QR code that opens the model on their phone.',
  },
  {
    q: 'What happens to the viewer once the property sells?',
    a: 'Our complete 3D model includes the first year of viewer hosting. If the home sells sooner, we take the viewer down whenever you ask. If you want to keep it online for longer, for example to show vendors at future valuations what you do for your listings, renewal costs {{extra:hosting}} + VAT per home per year.',
  },
  {
    q: 'What is the difference between a 3D floor plan and the complete 3D model?',
    a: 'Our 3D floor plan ({{price:plano3d}} + VAT per floor) gives you images: a colour top-down plan and a furnished isometric view. The complete 3D model ({{price:maqueta}} + VAT) adds renders of each room, the web viewer for your listing and augmented reality. For a resale flat that already has good photos, the 3D floor plan is often enough.',
  },
];

import { plate } from '../data/plates.mjs';

export default {
  id: 'sol-inmobiliarias',
  image: 'villa_salon_dormitorio_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Modelo 3D y AR: capta exclusivas y vende a distancia',
    description: 'Maqueta 3D, renders, visor para tu anuncio y AR sin app desde el plano, para captar exclusivas y vender a distancia. Desde {{price:maqueta}} + IVA.',
    h1: 'Maqueta 3D, renders y realidad aumentada para inmobiliarias',
    lead: '{{brand}}, estudio de visualización 3D de la Costa del Sol, convierte el plano de cada vivienda que captas en un modelo 3D amueblado con renders, visor para tu anuncio y realidad aumentada sin app, para que el comprador entienda la casa antes de visitarla. Desde {{price:maqueta}} + IVA por vivienda, en {{delivery:maqueta}}.',
    breadcrumb: 'Inmobiliarias',
    card: {
      title: 'Para inmobiliarias',
      summary: 'Capta exclusivas y vende viviendas vacías, o a compradores que están lejos, con el modelo 3D de cada inmueble.',
    },
    hero: {
      image: 'villa_salon_dormitorio',
      alt: 'Salón y dormitorio principal amueblados de una villa en la Costa del Sol. Render 3D generado a partir del plano 2D de un caso anonimizado.',
      caption: 'Salón y dormitorio principal del caso demostrativo. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Para', 'Agencias inmobiliarias y asesores independientes'],
      ['Entrada', 'El plano de la vivienda, sin fotos'],
      ['Entregas', 'Modelo 3D, renders 4K, visor web y AR'],
      ['Precio por vivienda', 'Desde {{price:maqueta}} + IVA'],
      ['Pack cartera', '5 maquetas por {{volume}} + IVA'],
      ['Plazo', '{{delivery:maqueta}}'],
      ['Opción ligera', 'Plano 3D desde {{price:plano3d}} + IVA'],
      ['Idiomas', 'Español e inglés'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Cómo ayuda un modelo 3D a una inmobiliaria?',
        answer: 'Te ayuda en los dos momentos que más cuestan: la captación y la venta. En la captación, llegas a la cita con el propietario con algo que otras agencias no ofrecen. En la venta, el comprador entiende la distribución, las terrazas y el tamaño de cada estancia antes de pedir visita, aunque viva en otro país.',
        body: 'Todo sale de un único modelo construido desde el plano: los [renders para el anuncio](@servicio-renders), el [visor 3D](@servicio-tour) que se gira y se recorre estancia a estancia, y la realidad aumentada que el comprador abre en su móvil. Si cambias un mueble o un suelo, cambia en todas las vistas a la vez.\n\nTrabajamos en remoto con agencias de [Marbella](@zona-marbella), [Málaga](@zona-malaga), el resto de la [Costa del Sol](@zona-costa-del-sol) y toda España.',
      },
      {
        type: 'table',
        h2: '¿Qué problemas resuelve en el día a día de una agencia?',
        intro: 'Cuatro situaciones que cualquier agencia reconoce, y lo que cambia cuando la vivienda tiene su modelo 3D.',
        caption: 'Situaciones habituales de una agencia y qué aporta el modelo 3D',
        head: ['Situación', 'Qué le falta al anuncio', 'Qué aporta el modelo 3D'],
        rows: [
          ['El propietario está entrevistando a tres agencias', 'Una razón para firmar la exclusiva contigo', 'Le enseñas en la tableta cómo se verá su casa en 3D y en realidad aumentada'],
          ['La vivienda está vacía o sin reformar', 'Fotos de habitaciones desnudas que no transmiten tamaño ni uso', 'Renders amueblados y [home staging virtual](@servicio-staging) sobre el mismo modelo, etiquetados como recreación'],
          ['El comprador vive en Londres, Oslo o Madrid', 'Una forma de entender la casa sin coger un avión', 'El enlace al visor por WhatsApp y la vivienda sobre su mesa en realidad aumentada'],
          ['Llegan visitas que no encajan', 'Contexto: cómo se conectan las estancias y cuánto miden las terrazas', 'Planta cenital a color y recorrido por estancias antes de concertar la visita'],
        ],
      },
      {
        type: 'viewer',
        h2: 'Así lo verá tu comprador',
        intro: 'Es la villa de nuestro [caso demostrativo](@caso-villa): {{villa:rooms}} estancias modeladas a partir de un único plano, sin fotos del interior. Gírala, entra en cada estancia o ábrela en tu salón.',
      },
      {
        type: 'table',
        h2: '¿Qué pack encaja con cada vivienda de tu cartera?',
        caption: 'Qué encargar según el tipo de captación (precios sin IVA)',
        head: ['Tu captación', 'Qué te recomendamos', 'Precio', 'Plazo'],
        rows: [
          ['Piso de reventa con buenas fotos', '[Plano 3D](@servicio-plano): planta cenital a color y vista isométrica amueblada', 'Desde {{price:plano3d}} por planta', '{{delivery:plano3d}}'],
          ['Vivienda vacía, a reformar o exclusiva de valor', 'Maqueta 3D completa: modelo, renders, visor y realidad aumentada', 'Desde {{price:maqueta}}', '{{delivery:maqueta}}'],
          ['Vivienda que necesita otro ambiente', 'Home staging virtual sobre la maqueta', '{{extra:staging}} por estancia', 'Con la maqueta'],
          ['Varias captaciones en los próximos meses', 'Pack cartera: 5 maquetas 3D completas', '{{volume}} ({{volumeUnit}} por vivienda)', '{{delivery:maqueta}} cada una'],
        ],
        note: 'Precios sin IVA. Los tramos por superficie y todos los extras están en la página de [precios](@precios).',
      },
      {
        type: 'steps',
        h2: '¿Cómo encaja en el trabajo de tu agencia?',
        intro: 'No cambias tu forma de trabajar: añades un enlace y unas imágenes a lo que ya haces.',
        items: [
          {
            title: 'En la captación',
            body: 'Si el propietario te pasa el plano antes de la cita, puedes llevar ya una estancia modelada: la primera te la hacemos gratis como demo. En la visita de valoración le enseñas su casa en 3D y, si quieres, sobre la mesa en realidad aumentada. Es un argumento concreto para pedir la exclusiva.',
          },
          {
            title: 'En el anuncio',
            body: 'Subes los renders y la planta a color al portal como imágenes. El visor 3D va en la ficha de tu web con un iframe, y el enlace en el campo de tour virtual cuando el portal admite una URL externa. No prometemos insertarlo dentro de idealista: solo acepta proveedores multimedia compatibles.',
          },
          {
            title: 'Con el comprador',
            body: 'Envías el enlace por WhatsApp o email. El comprador gira la vivienda, entra en cada estancia y la coloca sobre su mesa con un toque, en iPhone o Android, sin instalar nada. En un ordenador ve un código QR para abrirla en el móvil.',
          },
          {
            title: 'En la oficina y en la visita',
            body: 'Con una tableta enseñas la maqueta a escala 1:20 o recorres el salón a tamaño real. También sirve para explicar una posible reforma: el comprador ve la propuesta sobre el mismo modelo, etiquetada como recreación virtual.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Lo que no prometemos',
        body: 'No insertamos el visor dentro de idealista ni de otros portales que solo aceptan proveedores concretos. No inventamos medidas: si el plano no trae cotas, las superficies son estimaciones a escala (≈) y lo decimos. Y las imágenes con mobiliario virtual deben publicarse etiquetadas como recreación virtual.',
      },
      {
        type: 'answer',
        h2: '¿Compensa pagar un modelo 3D por cada captación?',
        answer: 'Depende de tus honorarios medios y de cuántas viviendas captes. Ejemplo con supuestos: en una vivienda de 400.000 € con honorarios del 3 %, la agencia factura 12.000 € + IVA, y la maqueta 3D completa cuesta {{price:maqueta}} + IVA. Si el modelo te ayuda a firmar una sola exclusiva más al año, cubre el coste de muchas maquetas.',
        body: 'La cuenta que importa es sencilla: divide lo que te costarían las maquetas del año entre tus honorarios medios por operación. Si el resultado es menor que una operación, el riesgo es bajo. Pon tus propias cifras en la tabla.',
      },
      plate('es', 'villa_interior_salon'),
      {
        type: 'table',
        caption: 'Ejemplo ilustrativo de rentabilidad para una agencia (supuestos, no resultados)',
        head: ['Concepto', 'Valor en el ejemplo'],
        rows: [
          ['Precio de la vivienda (supuesto)', '400.000 €'],
          ['Honorarios de la agencia (supuesto: 3 %)', '12.000 € + IVA'],
          ['Maqueta 3D completa de esa vivienda', '{{price:maqueta}} + IVA'],
          ['Coste por vivienda con el pack cartera', '{{volumeUnit}} + IVA'],
          ['Punto de equilibrio', 'Una operación adicional cubre las maquetas de muchas viviendas'],
        ],
        note: 'Ejemplo con cifras supuestas para mostrar el cálculo. No es un resultado medido ni una promesa de ventas.',
      },
      { type: 'calculator', h2: 'Calcula el coste para tu cartera', intro: 'Precio por vivienda de la maqueta 3D completa según cuántas encargues, con los descuentos por volumen aplicados.' },
      { type: 'faq' },
    ],
    faq: faqEs,
    related: ['servicio-plano', 'servicio-staging', 'servicio-tour', 'caso-villa', 'precios'],
    cta: {
      h2: '¿Probamos con tu próxima captación?',
      body: 'Envíanos el plano de una vivienda de tu cartera y te devolvemos una estancia en 3D con realidad aumentada, gratis y sin compromiso.',
      service: 'maqueta',
    },
  },

  en: {
    title: '3D floor plans and AR for estate agents in Spain',
    description: 'A 3D floor plan from {{price:plano3d}} + VAT, or a complete 3D model with renders, a listing viewer and app-free AR, to win instructions and sell abroad.',
    h1: '3D floor plans, renders and AR for estate agents',
    lead: '{{brand}}, a 3D visualisation studio on the Costa del Sol, turns the floor plan of every home you list into a 3D floor plan from {{price:plano3d}} + VAT per floor in {{delivery:plano3d}}, or a complete 3D model with renders, a listing viewer and app-free AR from {{price:maqueta}} + VAT in {{delivery:maqueta}}.',
    breadcrumb: 'Estate agents',
    card: {
      title: 'For estate agents',
      summary: 'Win instructions and sell empty homes, or homes to buyers abroad, with a 3D model of every listing.',
    },
    hero: {
      image: 'villa_salon_dormitorio',
      alt: 'Furnished living room and main bedroom of a Costa del Sol villa. 3D render generated from the 2D floor plan of an anonymised case.',
      caption: 'Living room and main bedroom from our demo case. Rendered from the 2D floor plan.',
    },
    facts: [
      ['For', 'Estate agencies and independent agents in Spain'],
      ['Input', 'The floor plan, no photos needed'],
      ['You get', '3D model, 4K renders, web viewer and AR'],
      ['Price per home', 'From {{price:maqueta}} + VAT'],
      ['Portfolio pack', '5 models for {{volume}} + VAT'],
      ['Turnaround', '{{delivery:maqueta}}'],
      ['Lighter option', '3D floor plan from {{price:plano3d}} + VAT'],
      ['Languages', 'English and Spanish'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'How does a 3D model help an estate agent?',
        answer: 'It helps at the two hardest moments: winning the instruction and finding the buyer. At the valuation, you show the vendor something the other agents don’t offer. On the listing, buyers grasp the layout, the terraces and the size of each room before they ask for a viewing, even from another country.',
        body: 'Everything comes from one model built from the floor plan: the [renders for your listing](@servicio-renders), the [interactive 3D viewer](@servicio-tour) buyers can spin and tour room by room, and the augmented reality they open on their phone. Change a sofa or a floor finish and it changes in every view at once.\n\nWe work remotely with agents in [Marbella and across the Costa del Sol](@zona-marbella), the rest of Spain and abroad.',
      },
      {
        type: 'table',
        h2: 'Which problems does it solve for an agency?',
        intro: 'Five situations every agent on the coast will recognise, and what changes once the property has its own 3D model.',
        caption: 'Common agency situations and what a 3D model adds',
        head: ['Situation', 'What the listing lacks', 'What the 3D model adds'],
        rows: [
          ['The vendor is interviewing three agents', 'A reason to give you the sole agency', 'You show their home in 3D and in augmented reality on a tablet at the valuation'],
          ['The property is empty or dated', 'Photos of bare rooms that convey neither size nor use', 'Furnished renders and [virtual staging](@servicio-staging) on the same model, labelled as a recreation'],
          ['The buyer lives in London, Oslo or Amsterdam', 'A way to understand the home without flying out', 'A viewer link on WhatsApp and the home on their table in augmented reality'],
          ['The decision is made by a family back home', 'Something the partner who didn’t travel can explore', 'The same link, opened on any phone, with nothing to install'],
          ['Viewings that were never going to work', 'Context: how rooms connect and how big the terraces are', 'A colour top-down plan and a room-by-room tour before the viewing is booked'],
        ],
      },
      {
        type: 'viewer',
        h2: 'What your buyers will see',
        intro: 'This is the villa from our [demo case](@caso-villa): {{villa:rooms}} rooms modelled from a single floor plan, with no interior photos. Spin it, step into each room or open it in your own living room.',
      },
      {
        type: 'table',
        h2: 'Which package suits each listing?',
        caption: 'What to order for each type of instruction (prices excluding VAT)',
        head: ['Your listing', 'What we recommend', 'Price', 'Turnaround'],
        rows: [
          ['Resale flat with good photos', '[3D floor plan](@servicio-plano): colour top-down plan and furnished isometric view', 'From {{price:plano3d}} per floor', '{{delivery:plano3d}}'],
          ['Empty, dated or high-value home', 'Complete 3D model: model, renders, viewer and augmented reality', 'From {{price:maqueta}}', '{{delivery:maqueta}}'],
          ['A home that needs a different feel', 'Virtual staging on the model', '{{extra:staging}} per room', 'With the model'],
          ['Several instructions coming up', 'Portfolio pack: 5 complete 3D models', '{{volume}} ({{volumeUnit}} per home)', '{{delivery:maqueta}} each'],
        ],
        note: 'Prices exclude VAT. Size bands and every extra are listed on our [pricing page](@precios).',
      },
      {
        type: 'steps',
        h2: 'How does it fit your agency’s workflow?',
        intro: 'Nothing about the way you work has to change: you add a link and a set of images to what you already do.',
        items: [
          {
            title: 'At the valuation',
            body: 'If the vendor sends you the plan before the appointment, you can arrive with one room already modelled: the first one is our free demo. Show them their home in 3D, or on the coffee table in augmented reality. It is a concrete reason to instruct you.',
          },
          {
            title: 'On the listing',
            body: 'Upload the renders and the colour plan to idealista, Kyero or Rightmove as photos. The 3D viewer goes on the property page of your own website with an iframe, and the link goes into a portal’s virtual tour field where the portal accepts an external URL.',
          },
          {
            title: 'With the buyer',
            body: 'Send the link by WhatsApp or email. Buyers spin the home, step into each room and place it on their table with one tap, on iPhone or Android, with no app. On a laptop they get a QR code to open it on their phone.',
          },
          {
            title: 'In the office and at viewings',
            body: 'On a tablet, show the 1:20 model on the desk or walk through the living room at real size. It also helps with renovation questions: buyers see a proposed layout on the same model, labelled as a virtual recreation.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'What we don’t promise',
        body: 'We don’t embed the viewer inside idealista or any portal that only accepts named providers. We don’t invent measurements: if the plan has no dimensions, areas are scale estimates (≈) and we say so. And images with virtual furniture should always be labelled as a virtual recreation.',
      },
      {
        type: 'answer',
        h2: 'Is a 3D model worth it for every instruction?',
        answer: 'It depends on your average fee and how many homes you list. A worked example with assumptions: on a €400,000 sale at a 3% fee, the agency earns €12,000 + VAT, and the complete 3D model costs {{price:maqueta}} + VAT. If the model helps you win just one extra instruction a year, it pays for many models.',
        body: 'The sum that matters is simple: divide what a year of 3D models would cost by your average fee per sale. If the answer is less than one sale, the risk is small. Try it with your own figures below.',
      },
      plate('en', 'villa_interior_salon'),
      {
        type: 'table',
        caption: 'Illustrative return for an agency (assumptions, not results)',
        head: ['Item', 'Value in the example'],
        rows: [
          ['Sale price (assumption)', '€400,000'],
          ['Agency fee (assumption: 3%)', '€12,000 + VAT'],
          ['Complete 3D model of that home', '{{price:maqueta}} + VAT'],
          ['Cost per home with the portfolio pack', '{{volumeUnit}} + VAT'],
          ['Break-even', 'One extra sale covers the models for many homes'],
        ],
        note: 'Assumed figures to show the calculation. This is not a measured result or a sales forecast.',
      },
      { type: 'calculator', h2: 'Estimate the cost for your portfolio', intro: 'Price per home for the complete 3D model depending on how many you order, with volume discounts applied.' },
      { type: 'faq' },
    ],
    faq: faqEn,
    related: ['servicio-plano', 'servicio-staging', 'servicio-tour', 'caso-villa', 'precios'],
    cta: {
      h2: 'Shall we try it on your next listing?',
      body: 'Send us the floor plan of a home on your books and we will send back one room in 3D with augmented reality, free and with no commitment.',
      service: 'maqueta',
    },
  },
};
