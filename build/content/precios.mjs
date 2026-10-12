// Pricing (template `pricing`). Since 2026-10-12 there are NO public prices (build/data/pricing.mjs, public: false):
// this page explains how a quote is made and what each option includes. No figures, ours or the market's: market
// rates with sources live in the two pricing guides (guia-precio-render, guia-precio-plano).

import { plate } from '../data/plates.mjs';

export default {
  id: 'precios',
  image: 'villa_bano_suite_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Precio de un modelo 3D: presupuesto cerrado',
    description: 'Cómo presupuestamos el plano 3D, la maqueta 3D con renders, visor y realidad aumentada y las promociones: precio cerrado y por escrito antes de empezar.',
    h1: 'Precios: presupuesto cerrado para cada encargo',
    lead: 'No publicamos tarifas: cada vivienda y cada promoción son distintas. Nos mandas el plano, te decimos qué incluye, cuánto cuesta y cuándo lo tienes, por escrito y antes de empezar. Ese precio no cambia después.',
    breadcrumb: 'Precios',
    card: {
      title: 'Precios',
      summary: 'Cómo presupuestamos: precio cerrado y por escrito para el plano 3D, la maqueta 3D completa y las promociones.',
    },
    facts: [
      ['Precio', 'Presupuesto cerrado y por escrito, antes de empezar'],
      ['De qué depende', 'Superficie, plantas, tipologías y lo que incluya'],
      ['Plazo del plano 3D', '{{delivery:plano3d}}'],
      ['Plazo de la maqueta 3D', '{{delivery:maqueta}}'],
      ['Pago', 'Cuando recibes el trabajo terminado'],
      ['Demo', 'Una estancia de tu plano en 3D, gratis'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Cómo calculamos el precio?',
        answer: 'Con tu plano delante. El precio depende de la superficie y del número de plantas, de cuántas tipologías tiene una promoción y de las piezas que necesites: solo el plano 3D o la maqueta 3D completa, con renders, visor web y realidad aumentada. Te lo mandamos por escrito, cerrado, junto con el plazo y las rondas de cambios.',
        body: 'Para una vivienda suelta contestamos en un día laborable desde que tenemos el plano. Para una promoción, en cuanto vemos los planos de las tipologías y la memoria de calidades. El precio que te confirmamos es el que pagas: si después cambia el proyecto, te pasamos un presupuesto nuevo antes de tocar nada.',
      },
      {
        type: 'table',
        h2: '¿Qué incluye cada opción y qué no?',
        intro: 'La decisión habitual de una agencia es entre el plano 3D y la maqueta completa. Esta es la diferencia, línea a línea.',
        caption: 'Plano 3D y maqueta 3D completa de {{brand}}: qué incluye cada uno',
        head: ['Qué recibes', 'Plano 3D', 'Maqueta 3D completa'],
        rows: [
          ['Modelo 3D amueblado, a escala', 'Sirve de base para las imágenes; no se entrega', 'Sí, en GLB, USDZ y BLEND'],
          ['Planta cenital a color en 4K', 'Sí', 'Sí'],
          ['Planta 2D redibujada en limpio', 'Sí', 'Sí'],
          ['Imágenes fotorrealistas en 4K', 'Una vista isométrica amueblada', '6 [renders](@glosario#render) con los encuadres que elijas'],
          ['Visor 3D web con estancias, recorrido y modo maqueta', 'No', 'Sí, alojado 12 meses'],
          ['Realidad aumentada en iPhone y Android', 'No', 'Sí: maqueta 1:20 y tamaño real'],
          ['Rondas de cambios', '{{revisions:plano3d}}', '{{revisions:maqueta}}'],
          ['Plazo', '{{delivery:plano3d}}', '{{delivery:maqueta}}'],
        ],
        note: 'Si solo necesitas enseñar la distribución en un portal, el [plano 3D](@servicio-plano) basta. Si el comprador tiene que recorrer la vivienda, porque está en otro país, es obra nueva o el piso está vacío, compensa la maqueta completa, con su [visor 3D](@servicio-tour) y su [realidad aumentada](@servicio-ar).',
      },
      {
        type: 'checklist',
        h2: '¿Qué se presupuesta aparte?',
        intro: 'Para que no haya sorpresas, esto va con presupuesto propio o directamente no lo hacemos:',
        items: [
          'Fachadas y exteriores completos con entorno: necesitan alzados y más modelado.',
          'Renders por encima de los incluidos, sobre el mismo modelo.',
          'Home staging virtual con otro estilo, por estancia.',
          'Alojamiento del visor a partir del segundo año.',
          'Entrega urgente en 48 horas, si el calendario lo permite.',
          'Cambios de proyecto después de la entrega: presupuesto por escrito antes de tocar nada.',
          'Vídeos con IA y tours de realidad virtual 360: llegarán próximamente; hoy no los vendemos.',
          'Planos técnicos, mediciones oficiales o documentación para licencias: no es nuestro trabajo.',
        ],
      },
      {
        type: 'answer',
        h2: '¿Cómo se presupuesta una promoción de obra nueva?',
        answer: 'Por tipologías. Modelamos y amueblamos cada tipología de la promoción y la enseñamos con renders en 4K, un visor 3D con selector de tipología y realidad aumentada para la sala de ventas y las ferias. El presupuesto cerrado depende del número de tipologías y de las piezas que incluya, y el plazo es de {{delivery:promocion}} desde que tenemos los planos y una medida de referencia.',
        body: 'Una promoción no se vende con una sola imagen: el comprador quiere comparar el bajo con jardín y el ático, y ver su tipología amueblada antes de que exista. Lo contamos en la página para [promotoras de obra nueva](@sol-promotoras), y la comercialización completa, en la [guía para vender obra nueva sobre plano](@guia-sobre-plano).',
      },
      {
        type: 'answer',
        h2: '¿Hay condiciones para agencias con varias viviendas?',
        answer: 'Sí. Si nos encargas varias viviendas a la vez o a lo largo de unos meses, el presupuesto lo tiene en cuenta: el trabajo se organiza mejor y el precio por vivienda baja. Cuéntanos cuántas viviendas mueves al mes y te mandamos una propuesta cerrada para tu cartera.',
      },
      plate('es', 'villa_interior_salon'),
      {
        type: 'answer',
        h2: '¿Cómo se paga y qué garantías tienes?',
        answer: 'Pagas cuando recibes el trabajo terminado, no por adelantado, y el precio queda cerrado por escrito antes de empezar. Antes de decidir puedes pedir la demo gratis: modelamos una estancia de tu plano y te la enviamos con realidad aumentada. Y la maqueta completa incluye {{revisions:maqueta}} para ajustar lo que no te encaje.',
      },
      {
        type: 'answer',
        h2: '¿Por qué no publicamos tarifas?',
        answer: 'Porque dos viviendas con los mismos metros pueden necesitar trabajos muy distintos: una planta o tres, un ático con terrazas o un piso interior, una vivienda suelta o una promoción con cinco tipologías. Preferimos darte un precio cerrado que corresponda a tu proyecto antes que una tarifa que luego no encaja.',
        body: 'Lo que sí te contamos es cómo trabajamos: los muros, huecos y muebles se colocan con scripts de Python en Blender y los materiales son procedurales, así que un cambio cuesta minutos y no una tarde. La prueba está en nuestro [caso demostrativo](@caso-villa) y el proceso completo, en [nuestro proceso, paso a paso](@como-funciona). Si quieres saber qué cobra el mercado, tienes las tarifas publicadas, con sus fuentes, en [cuánto cuesta un render 3D en España](@guia-precio-render) y [cuánto cuesta un plano 3D](@guia-precio-plano).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta pasar el plano de una vivienda a 3D?',
        a: 'Depende de la superficie, del número de plantas y de lo que necesites: solo el plano 3D o la maqueta 3D completa, con renders, visor web y realidad aumentada. {{brand}} te manda un presupuesto cerrado y por escrito en cuanto ve el plano, con el plazo y las rondas de cambios. Ese precio no cambia después, salvo que cambie el proyecto.',
      },
      {
        q: '¿Cuándo se paga el encargo?',
        a: 'Cuando recibes el trabajo terminado. {{brand}} te confirma por escrito el precio cerrado y el plazo antes de empezar, modela la vivienda, aplica tus rondas de cambios y te entrega los archivos; entonces facturamos. No pedimos adelanto ni tarjeta para empezar, y la demo de una estancia es gratis.',
      },
      {
        q: '¿Qué pasa si necesito más cambios de los incluidos?',
        a: 'La maqueta 3D completa de {{brand}} incluye {{revisions:maqueta}} y el plano 3D, {{revisions:plano3d}}. Si después necesitas más, te decimos el precio antes de hacerlos. Los cambios pequeños, como un color o un mueble, suelen ser rápidos porque el modelo se genera con scripts. Nunca facturamos un cambio que no hayas aprobado antes.',
      },
      {
        q: '¿Qué pasa con el visor 3D después de los 12 meses?',
        a: 'La maqueta 3D completa de {{brand}} incluye 12 meses de alojamiento del visor. Si la vivienda sigue a la venta o quieres conservarlo como muestra para futuras captaciones, te pasamos el precio de la renovación antes de que venza. Si no renuevas, retiramos el visor, pero conservas los renders y el modelo en GLB, USDZ y BLEND que te entregamos.',
      },
      {
        q: '¿Puedo usar los renders y el visor donde quiera?',
        a: 'Sí, para comercializar esa vivienda en cualquier canal: web, portales, redes sociales, dosier de venta, prensa y cartelería, sin pagar más por cada uso. {{brand}} solo te pide permiso para enseñar el trabajo como ejemplo en su propia web, y si no lo das, no lo publicamos. Los renders se entregan identificados como tales.',
      },
      {
        q: '¿La demo gratis me compromete a algo?',
        a: 'No. {{brand}} modela una estancia de tu plano en 3D y te la envía con realidad aumentada para que la abras en tu móvil. No pedimos tarjeta ni firma. Si te convence, te pasamos el presupuesto cerrado de la vivienda completa; si no, la conversación termina ahí.',
      },
    ],
    related: ['guia-precio-render', 'guia-precio-plano', 'caso-villa', 'servicio-plano', 'sol-inmobiliarias'],
    cta: {
      h2: 'Te damos el precio exacto con tu plano',
      body: 'Envíanos el plano y te contestamos con el precio cerrado y el plazo. Si antes quieres ver cómo trabajamos, modelamos gratis una estancia y te la mandamos con realidad aumentada. Contesta una persona.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'Real estate 3D model pricing: a fixed quote',
    description: 'How we quote 3D floor plans, complete 3D models with renders, a web viewer and AR, and developments: a fixed price in writing before work starts.',
    h1: 'Pricing: a fixed quote for every job',
    lead: 'We do not publish rates: every home and every development is different. Send us the plan and we tell you what is included, what it costs and when you get it, in writing and before we start. That price does not change afterwards.',
    breadcrumb: 'Pricing',
    card: {
      title: 'Pricing',
      summary: 'How we quote: a fixed written price for 3D floor plans, complete 3D models and developments.',
    },
    facts: [
      ['Price', 'A fixed written quote, before work starts'],
      ['What it depends on', 'Floor area, floors, unit types and what is included'],
      ['3D floor plan turnaround', '{{delivery:plano3d}}'],
      ['3D model turnaround', '{{delivery:maqueta}}'],
      ['Payment', 'When you receive the finished work'],
      ['Demo', 'One room of your plan in 3D, free'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'How do we work out the price?',
        answer: 'With your plan in front of us. The price depends on floor area and the number of floors, on how many unit types a development has and on what you need: just the 3D floor plan, or the complete 3D model with renders, a web viewer and augmented reality. We send it to you in writing, fixed, together with the turnaround and the rounds of changes.',
        body: 'For a single home we reply within one working day of receiving the plan. For a development, as soon as we have seen the plans of each unit type and the specification. The price we confirm is the price you pay: if the design changes later, you get a new quote before we touch anything.',
      },
      {
        type: 'table',
        h2: 'What is included, and what is not?',
        intro: 'Most agents choose between the 3D floor plan and the complete model. Here is the difference, line by line.',
        caption: 'Our 3D floor plan and complete 3D model: what each includes',
        head: ['What you get', '3D floor plan', 'Complete 3D model'],
        rows: [
          ['Furnished 3D model, to scale', 'Used to produce the images; not delivered', 'Yes, as GLB, USDZ and BLEND'],
          ['4K colour top-down plan', 'Yes', 'Yes'],
          ['Clean redrawn 2D plan', 'Yes', 'Yes'],
          ['Photorealistic 4K images', 'One furnished isometric view', '6 [renders](@glosario#render), framed as you choose'],
          ['Web 3D viewer with rooms, guided tour and cut-away mode', 'No', 'Yes, hosted for 12 months'],
          ['Augmented reality on iPhone and Android', 'No', 'Yes: 1:20 tabletop and real size'],
          ['Rounds of changes', '{{revisions:plano3d}}', '{{revisions:maqueta}}'],
          ['Turnaround', '{{delivery:plano3d}}', '{{delivery:maqueta}}'],
        ],
        note: 'If you only need to show the layout on a portal, the [3D floor plan](@servicio-plano) is enough. If the buyer needs to walk through the home, because they live abroad, the property is off-plan or it is empty, the complete model pays off, with its [interactive 3D viewer](@servicio-tour) and [app-free AR](@servicio-ar).',
      },
      {
        type: 'checklist',
        h2: 'What is quoted separately?',
        intro: 'So there are no surprises, these get their own quote or are simply not something we do:',
        items: [
          'Full façades and exteriors with landscaping: they need elevation drawings and more modelling.',
          'Renders beyond those included, from the same model.',
          'Virtual staging in a second style, per room.',
          'Viewer hosting from the second year.',
          'Rush delivery in 48 hours, when the schedule allows.',
          'Design changes after delivery: a written quote before we touch anything.',
          'AI videos and 360° VR tours: coming soon; we do not sell them yet.',
          'Technical drawings, official measurements or planning paperwork: not our line of work.',
        ],
      },
      {
        type: 'answer',
        h2: 'How is an off-plan development quoted?',
        answer: 'By unit type. We model and furnish every unit type in the development and show it with 4K renders, a 3D viewer with a unit-type selector and augmented reality for the sales suite and property fairs. The fixed quote depends on the number of unit types and what is included, and turnaround is {{delivery:promocion}} from when we have the plans and one reference measurement.',
        body: 'A development does not sell on a single image: buyers want to compare the ground-floor unit with a garden against the penthouse, and to see their own unit furnished before it exists. More on our page about [off-plan 3D visualisation](@sol-promotoras).',
      },
      {
        type: 'answer',
        h2: 'Are there terms for agencies with several homes?',
        answer: 'Yes. If you order several homes at once or over a few months, the quote reflects it: the work is easier to plan and the price per home comes down. Tell us how many homes you list each month and we send you a fixed proposal for your portfolio.',
      },
      plate('en', 'villa_interior_salon'),
      {
        type: 'answer',
        h2: 'How do I pay, and what guarantees do I get?',
        answer: 'You pay when you receive the finished work, not in advance, and the price is fixed in writing before we start. Before deciding you can ask for the free demo: we model one room of your plan and send it to you in augmented reality. And the complete model includes {{revisions:maqueta}} to adjust anything that is not right.',
      },
      {
        type: 'answer',
        h2: 'Why do we not publish rates?',
        answer: 'Because two homes with the same floor area can need very different work: one floor or three, a penthouse with terraces or an inner flat, a single home or a development with five unit types. We would rather give you a fixed price that matches your project than a rate that does not fit it.',
        body: 'What we do tell you is how we work: walls, openings and furniture are placed by Python scripts in Blender and the materials are procedural, so a change takes minutes rather than an afternoon. The proof is in our [demo case](@caso-villa) and the full process is in [how it works, step by step](@como-funciona). If you want to know what the market charges, published rates with sources are in [how much a 3D render costs in Spain](@guia-precio-render) and [how much a 3D floor plan costs](@guia-precio-plano).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'How much does it cost to turn a floor plan into 3D?',
        a: 'It depends on floor area, the number of floors and what you need: just the 3D floor plan, or the complete 3D model with renders, a web viewer and augmented reality. {{brand}} sends you a fixed written quote as soon as it sees the plan, with the turnaround and the rounds of changes. That price does not change unless the design does.',
      },
      {
        q: 'When do I pay?',
        a: 'When you receive the finished work. {{brand}} confirms the fixed price and turnaround in writing before starting, models the home, applies your rounds of changes and delivers the files; then we invoice. We ask for no deposit or card to start, and the one-room demo is free.',
      },
      {
        q: 'What if I need more changes than are included?',
        a: 'The complete 3D model from {{brand}} includes {{revisions:maqueta}} and the 3D floor plan {{revisions:plano3d}}. If you need more afterwards, we tell you the price before making them. Small changes, such as a colour or a piece of furniture, are usually quick because the model is generated by scripts. We never invoice a change you have not approved.',
      },
      {
        q: 'What happens to the 3D viewer after 12 months?',
        a: 'The complete 3D model from {{brand}} includes 12 months of viewer hosting. If the home is still on the market, or you want to keep it as a sample for future listings, we send you the renewal price before it expires. If you do not renew, we take the viewer down, but you keep the renders and the GLB, USDZ and BLEND model we delivered.',
      },
      {
        q: 'Can I use the renders and the viewer anywhere?',
        a: 'Yes, to market that home on any channel: website, portals, social media, sales brochure, press and signage, with no extra fee per use. {{brand}} only asks your permission to show the work as an example on its own website, and if you say no, we do not publish it. Renders are delivered labelled as renders.',
      },
      {
        q: 'Does the free demo commit me to anything?',
        a: 'No. {{brand}} models one room of your plan in 3D and sends it to you in augmented reality so you can open it on your phone. We ask for no card and no signature. If you like it, we send you the fixed quote for the whole home; if not, the conversation ends there.',
      },
    ],
    related: ['guia-precio-render', 'guia-precio-plano', 'caso-villa', 'servicio-plano', 'sol-inmobiliarias'],
    cta: {
      h2: 'Get the exact price for your plan',
      body: 'Send us the plan and we reply with a fixed price and turnaround. If you would like to see how we work first, we model one room free of charge and send it to you in augmented reality. A real person replies.',
      service: 'maqueta',
    },
  },
};
