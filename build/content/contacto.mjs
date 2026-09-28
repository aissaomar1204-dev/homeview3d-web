// Contact / quote request page (template: contact → ContactPage schema).
// ES target: «presupuesto plano 3D», «pedir presupuesto render»; EN target: “get a quote 3d floor plan”, “upload your floor plan”
// (03-keywords-en.md §4 page map). The 24 h reply time is a PROPOSAL (COPY-06: only while it is true).
// The form and the contact aside (WhatsApp, email, phone) are rendered by the engine; these blocks add the guidance around them.

export default {
  id: 'contacto',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Pide presupuesto para tu plano 3D o una demo gratis',
    description: 'Sube el plano de tu vivienda y te contestamos en 24 h laborables con precio y plazo cerrados, o con una demo gratis. Maqueta 3D desde {{price:maqueta}} + IVA.',
    h1: 'Pide presupuesto o una demo gratis con tu plano',
    lead: 'Sube el plano de la vivienda (PDF, JPG, PNG o DWG) y cuéntanos qué necesitas. Una persona te contesta en 24 h laborables con precio y plazo cerrados y, si quieres verlo antes, con una estancia modelada en 3D gratis. La maqueta 3D completa cuesta desde {{price:maqueta}} + IVA y llega en {{delivery:maqueta}}.',
    breadcrumb: 'Contacto',
    card: {
      title: 'Pide presupuesto',
      summary: 'Sube el plano y recibe precio y plazo cerrados en 24 h laborables, o una estancia en 3D gratis como demo.',
    },
    facts: [
      ['Respuesta', 'En 24 h laborables, de una persona'],
      ['Canales', 'Formulario, WhatsApp, email o teléfono'],
      ['Qué adjuntar', 'Plano en PDF, JPG, PNG, DWG o DXF'],
      ['Sin archivo', 'Enlace del anuncio o de descarga'],
      ['Demo gratis', 'Una estancia en 3D con realidad aumentada'],
      ['Precio desde', '{{price:plano3d}} + IVA; maqueta completa, {{price:maqueta}}'],
      ['Idiomas', 'Español e inglés'],
    ],
    blocks: [
      {
        type: 'contactForm',
        h2: '¿Qué vivienda quieres ver en 3D?',
        intro: 'Dos pasos: primero la vivienda, después tus datos. Solo son obligatorios el tipo de cliente, tu nombre, tu email y la casilla de privacidad. El plano puedes adjuntarlo ahora o mandarlo después por WhatsApp o por email.',
      },
      {
        type: 'prose',
        h2: '¿Prefieres escribir por WhatsApp, email o teléfono?',
        body: 'Usa el canal que te resulte más cómodo. Todos llegan al mismo equipo y la respuesta tiene el mismo plazo.\n\n- **WhatsApp ({{whatsapp}})**: lo más rápido si tienes el plano en el móvil. Mándanos el PDF o una foto nítida, dinos la superficie aproximada y qué servicio te interesa.\n- **Email ({{email}})**: mejor para archivos pesados, planos en DWG o varias tipologías de una promoción. Si no caben en un correo, pega un enlace de descarga.\n- **Teléfono ({{phone}})**: si prefieres contarlo de viva voz antes de enviar nada. Te decimos qué pack encaja y cuánto cuesta.\n\nEscribas por donde escribas, te contestamos en español o en inglés. Mientras esperas, puedes recorrer la [villa en 3D de nuestro caso demostrativo](@caso-villa) o repasar las [tarifas públicas](@precios).',
      },
      {
        type: 'needs',
        h2: '¿Qué necesitamos para darte precio?',
        intro: 'Para cerrar precio y plazo nos basta con el plano y una medida de referencia, como la superficie total o el ancho de una estancia. Lo demás afina el resultado y puede llegar después.',
      },
      {
        type: 'steps',
        h2: '¿Qué pasa después de enviar la solicitud?',
        intro: 'Nada se pone en marcha sin tu visto bueno. Estos son los pasos desde que recibimos tu mensaje.',
        items: [
          {
            title: 'Leemos tu solicitud y revisamos el plano',
            body: 'Una persona comprueba que el plano se lee bien y que trae una medida de referencia. Si falta algo, te lo pedimos antes de darte precio, para que el presupuesto no cambie después.',
            time: 'Al recibirla',
          },
          {
            title: 'Te enviamos precio y plazo cerrados',
            body: 'Por email o por WhatsApp: el pack que encaja con tu vivienda, qué incluye y la fecha de entrega. Son las mismas tarifas que publicamos en [precios](@precios), sin IVA; el IVA se suma en la factura.',
            time: 'En 24 h laborables',
          },
          {
            title: 'Si quieres, una demo gratis',
            body: 'Antes de decidir, modelamos una estancia de tu plano y te la mandamos con [realidad aumentada](@servicio-ar) para que la abras en tu móvil. Si no te encaja, no pagas nada.',
            time: 'Opcional',
          },
          {
            title: 'Confirmas y empezamos',
            body: 'Con tu confirmación por escrito arrancamos el encargo. El plano 3D llega en {{delivery:plano3d}}; la maqueta 3D completa, en {{delivery:maqueta}}, con {{revisions:maqueta}} incluidas.',
            time: 'Inicio del encargo',
          },
          {
            title: 'Revisas, recibes y pagas',
            body: 'Te enviamos el visor en un enlace privado, aplicamos tus cambios y entregamos los archivos finales. Pagas cuando recibes el trabajo terminado. El detalle de cada fase está en [cómo funciona](@como-funciona).',
            time: 'Al entregar',
          },
        ],
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Cuánto tardáis en contestar a una solicitud de presupuesto?',
        a: '{{brand}} contesta cada solicitud en 24 h laborables, y lo hace una persona, no una respuesta automática. En ese mensaje tienes el precio cerrado, lo que incluye y la fecha de entrega, o las dudas que necesitamos resolver sobre el plano. Si escribes en fin de semana o en festivo, el plazo empieza a contar el siguiente día laborable.',
      },
      {
        q: '¿Pedir presupuesto o la demo gratis me compromete a algo?',
        a: 'No. Pedir presupuesto a {{brand}} es gratis y sin compromiso, y la demo también: modelamos en 3D una estancia de tu plano y te la enviamos con realidad aumentada para que la abras en tu móvil. Si te convence, seguimos con la vivienda completa desde {{price:maqueta}} + IVA; si no, no pagas nada y no volvemos a insistir.',
      },
      {
        q: '¿Puedo pedir presupuesto si todavía no tengo el plano?',
        a: 'Sí. Pega el enlace del anuncio donde aparece el plano, manda una foto nítida del folleto o, en obra nueva, pide los planos de tipologías al estudio de arquitectura y envíalos después. Con la superficie ya sabes el tramo: la maqueta 3D completa de {{brand}} cuesta {{price:maqueta}} + IVA hasta 150 m² y {{price:maqueta:1}} hasta 300 m². Lo confirmamos al ver el plano.',
      },
      {
        q: '¿Qué hago si el plano pesa más de 8 MB o son varios archivos?',
        a: 'El formulario de {{brand}} admite un archivo de hasta 8 MB en PDF, JPG, PNG, DWG o DXF. Si pesa más o son varios planos, pega en el formulario un enlace de descarga (Google Drive, Dropbox, WeTransfer o similar) o mándalo a {{email}}. Para una promoción con varias tipologías, lo más cómodo es una carpeta compartida con un plano por tipología.',
      },
      {
        q: '¿Cómo pido presupuesto para varias viviendas o una promoción?',
        a: 'Indica en el formulario cuántas viviendas o tipologías son. Para agencias con cartera, {{brand}} tiene un pack de 5 maquetas 3D completas por {{volume}} + IVA ({{volumeUnit}} por vivienda), para usar en 6 meses. Las promociones de obra nueva de hasta 3 tipologías cuestan desde {{price:promocion}} + IVA, y cada tipología adicional, {{extra:tipologia}}. El [calculador de precios](@precios) te da el total antes de escribirnos.',
      },
      {
        q: '¿Es confidencial el plano que os envío?',
        a: 'Sí. {{brand}} usa el plano y tus datos solo para preparar el presupuesto y, si lo encargas, para hacer el trabajo. No publicamos imágenes de tu vivienda sin tu permiso ni cedemos el plano a terceros. Si tu promotora lo necesita, firmamos un acuerdo de confidencialidad antes de recibirlo. Plazos de conservación y derechos, en la [política de privacidad](@privacidad).',
      },
      {
        q: '¿Cuándo se paga el trabajo?',
        a: 'Cuando lo recibes terminado. {{brand}} no cobra nada por el presupuesto ni por la demo, y la factura llega con el trabajo entregado y revisado. Nuestros precios se publican sin IVA, que se suma en la factura: por ejemplo, el plano 3D de una planta de hasta 150 m² cuesta {{price:plano3d}} + IVA y la maqueta completa, {{price:maqueta}} + IVA.',
      },
      {
        q: '¿Puedo hablar con alguien antes de enviar nada?',
        a: 'Claro. Llama al {{phone}} o escribe por WhatsApp al {{whatsapp}} y cuéntanos la vivienda: tipo, superficie aproximada, para qué la quieres (anuncio, web o sala de ventas) y para cuándo. En {{brand}} te decimos qué pack encaja y cuánto cuesta. Si tienes prisa, hay entrega urgente en 48 horas con un recargo del {{extra:urgente}}.',
      },
    ],
    related: ['precios', 'como-funciona', 'caso-villa', 'servicio-plano'],
  },

  en: {
    title: 'Get a quote: upload your floor plan',
    description: 'Upload your floor plan and get a fixed price and delivery date within one working day, or a free one-room 3D demo. Full model from {{price:maqueta}} + VAT.',
    h1: 'Get a quote or a free demo from your floor plan',
    lead: 'Upload the floor plan (PDF, JPG, PNG or DWG) and tell us what you need. A real person replies within one working day with a fixed price and delivery date, plus a free one-room 3D demo if you would like to see it first. The complete 3D model starts at {{price:maqueta}} + VAT, delivered in {{delivery:maqueta}}.',
    breadcrumb: 'Contact',
    card: {
      title: 'Get a quote',
      summary: 'Upload a floor plan and get a fixed price and delivery date within one working day, or a free one-room 3D demo.',
    },
    facts: [
      ['Reply time', 'Within one working day, from a person'],
      ['Channels', 'Form, WhatsApp, email or phone'],
      ['What to attach', 'Plan as PDF, JPG, PNG, DWG or DXF'],
      ['No file to hand?', 'A listing or download link'],
      ['Free demo', 'One room in 3D with augmented reality'],
      ['Price from', '{{price:plano3d}} + VAT; complete model {{price:maqueta}}'],
      ['Languages', 'English and Spanish'],
      ['Time zone', 'Spain (CET/CEST)'],
    ],
    blocks: [
      {
        type: 'contactForm',
        h2: 'Which property would you like to see in 3D?',
        intro: 'Two short steps: the property first, then your details. Only your client type, name, email and the privacy box are required. You can attach the plan now or send it later by WhatsApp or email.',
      },
      {
        type: 'prose',
        h2: 'Prefer WhatsApp, email or a phone call?',
        body: 'Use whichever suits you. Every channel reaches the same team and gets the same reply time.\n\n- **WhatsApp ({{whatsapp}})**: quickest if the plan is on your phone. Send the PDF or a sharp photo, the approximate floor area and the service you are after.\n- **Email ({{email}})**: best for large files, DWG drawings or several unit types in one development. If they are too big to attach, paste a download link.\n- **Phone ({{phone}})**: if you would rather talk it through before sending anything. We will tell you which pack fits and what it costs.\n\nWe work on Spanish time, one hour ahead of the UK, and reply in English or Spanish. While you wait, explore [our demo villa in 3D](@caso-villa) or check our [published prices](@precios).',
      },
      {
        type: 'needs',
        h2: 'What do we need to give you a price?',
        intro: 'To fix the price and delivery date, the plan and one reference measurement are enough: the total floor area or the width of one room. Everything else sharpens the result and can follow later.',
      },
      {
        type: 'steps',
        h2: 'What happens after I send my request?',
        intro: 'Nothing starts without your go-ahead. These are the steps from the moment your message reaches us.',
        items: [
          {
            title: 'We read your request and check the plan',
            body: 'A real person checks that the plan is legible and has a reference measurement. If anything is missing, we ask before quoting, so the price does not change later.',
            time: 'On arrival',
          },
          {
            title: 'You get a fixed price and delivery date',
            body: 'By email or WhatsApp: the pack that fits the property, what it includes and the delivery date. The rates are the ones on our [pricing page](@precios), excluding VAT, which is added to the invoice where it applies.',
            time: 'Within one working day',
          },
          {
            title: 'A free demo, if you want one',
            body: 'Before you decide, we model one room of your plan and send it with [augmented reality](@servicio-ar), so you can open it on your phone. If it is not for you, you pay nothing.',
            time: 'Optional',
          },
          {
            title: 'You confirm and we start',
            body: 'Once you confirm in writing, the work begins. A 3D floor plan takes {{delivery:plano3d}}; the complete 3D model takes {{delivery:maqueta}}, with {{revisions:maqueta}} included.',
            time: 'Project start',
          },
          {
            title: 'You review, receive and pay',
            body: 'You get the viewer on a private link, we apply your changes and deliver the final files. You pay when you receive the finished work. Each stage is explained in [how it works](@como-funciona).',
            time: 'On delivery',
          },
        ],
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'How quickly will I hear back about a quote?',
        a: '{{brand}} replies to every request within one working day, and the reply comes from a real person, not an autoresponder. It gives you a fixed price, what is included and a delivery date, or the questions we need answered about the plan first. Requests sent at the weekend or on a Spanish public holiday are answered on the next working day.',
      },
      {
        q: 'Is the free demo really free, with no obligation?',
        a: 'Yes. A quote from {{brand}} costs nothing and commits you to nothing, and neither does the demo: we model one room of your plan in 3D and send it with augmented reality, so you can open it on your phone. If you like it, we carry on with the whole home from {{price:maqueta}} + VAT; if not, you pay nothing and we will not chase you.',
      },
      {
        q: 'Can I get a quote without the floor plan to hand?',
        a: 'Yes. Paste the link of the listing that shows the plan, send a clear photo of the brochure or, for an off-plan development, ask the architect for the unit plans and forward them later. The floor area alone tells you the price band: a complete 3D model from {{brand}} costs {{price:maqueta}} + VAT up to 150 m² and {{price:maqueta:1}} up to 300 m². We confirm it once we see the plan.',
      },
      {
        q: 'What if my plan is over 8 MB or split across several files?',
        a: 'The {{brand}} form accepts one file of up to 8 MB as PDF, JPG, PNG, DWG or DXF. For anything larger, or several plans, paste a download link (Google Drive, Dropbox, WeTransfer or similar) into the form, or email it to {{email}}. For a development with several unit types, a shared folder with one plan per unit type is the easiest option.',
      },
      {
        q: 'Can you quote for a whole portfolio or an off-plan development?',
        a: 'Yes. Tell us in the form how many homes or unit types there are. For agencies with several listings, {{brand}} offers a pack of 5 complete 3D models for {{volume}} + VAT ({{volumeUnit}} per home), to be used within 6 months. Off-plan developments with up to 3 unit types start at {{price:promocion}} + VAT, and each extra unit type costs {{extra:tipologia}}. The [price calculator](@precios) shows the total before you get in touch.',
      },
      {
        q: 'Is my floor plan kept confidential?',
        a: 'Yes. {{brand}} uses your plan and details only to prepare the quote and, if you go ahead, to do the work. We never publish images of your property without your permission or pass the plan to third parties. If your developer or agency needs one, we sign a non-disclosure agreement before receiving the plans. Retention periods and your rights are set out in our [privacy policy](@privacidad).',
      },
      {
        q: 'When do I pay, and do your prices include VAT?',
        a: 'You pay when you receive the finished work. {{brand}} charges nothing for the quote or the demo, and the invoice arrives with the delivered, reviewed files. Published prices exclude VAT, which is added to the invoice where it applies: a 3D floor plan for one floor up to 150 m² costs {{price:plano3d}} + VAT, and the complete 3D model {{price:maqueta}} + VAT.',
      },
      {
        q: 'Can I speak to someone before sending anything?',
        a: 'Of course. Call {{phone}} or message {{whatsapp}} on WhatsApp and tell us about the property: type, approximate floor area, where you will use it (listing, website or sales suite) and your deadline. {{brand}} will tell you which pack fits and what it costs. We are on Spanish time, one hour ahead of the UK. Rush delivery in 48 hours carries a {{extra:urgente}} surcharge.',
      },
    ],
    related: ['precios', 'como-funciona', 'caso-villa', 'servicio-plano'],
  },
};
