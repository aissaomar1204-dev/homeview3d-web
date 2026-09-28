// Home (rulebook C5 blueprint, BUILD-SPEC §6). The hero, cajetín, eyebrows and form wrapper come from the
// template; this file only feeds them. Block order is fixed by C5: compare → deliverables → process[despiece]
// → viewer (#demo) → audiences → pricing[excerpt] → calculator → faq → contactForm.
// Every price, delivery time and villa figure is a token (build/data). No market statistics on this page.

export default {
  id: 'home',
  image: 'og_image',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Modelo 3D desde el plano para inmobiliarias | {{brand}}',
    description: 'Convertimos el plano 2D de una vivienda en un modelo 3D amueblado, con renders, visor web y realidad aumentada sin app. Desde {{price:maqueta}} + IVA, en días.',
    h1: 'Del plano 2D al modelo 3D, sin fotos',
    lead: 'Convertimos el plano de una vivienda en un modelo 3D amueblado, con renders, visor web y realidad aumentada sin app. Para inmobiliarias, promotoras y arquitectos: desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
    breadcrumb: 'Inicio',
    facts: [
      ['Entrada', 'Un plano 2D, sin fotos ni visita'],
      ['Entregas', 'Modelo 3D, renders 4K, visor web y AR'],
      ['Plazo', '{{delivery:maqueta}}'],
      ['Desde', '{{price:plano3d}} + IVA; maqueta completa, {{price:maqueta}}'],
      ['Realidad aumentada', 'iPhone, iPad y Android, sin app'],
      ['Zona', 'Costa del Sol y toda España'],
      ['Idiomas', 'Español e inglés'],
    ],
    blocks: [
      {
        type: 'compare',
        h2: 'Del plano al 3D',
        intro: '{{entity}}\n\nCompruébalo en esta imagen. A un lado, la planta redibujada desde nuestro modelo; al otro, el render cenital a color, con la misma cámara y la misma escala. Todo salió de {{villa:input}}.',
      },
      {
        type: 'deliverables',
        h2: '¿Qué recibes a partir de un solo plano?',
        intro: 'Modelamos la vivienda una vez y de ese modelo salen cinco entregables coherentes entre sí: si cambias el suelo del salón, cambia en los [renders](@glosario#render), en el visor y en la realidad aumentada. Los cuatro primeros van en la [maqueta 3D completa](@servicio-plano); el home staging virtual se añade por estancia.',
      },
      {
        type: 'process',
        variant: 'despiece',
        h2: '¿Cómo se convierte un plano en un modelo 3D?',
        intro: 'Cinco pasos y {{delivery:maqueta}} de principio a fin. La geometría no la inventa una IA: la levantamos con scripts de Python en Blender, a escala, y la revisas antes de la entrega. Herramientas, plazos por fase y control de calidad, en [cómo funciona](@como-funciona).',
      },
      {
        type: 'viewer',
        h2: 'La villa en 3D',
        intro: 'Es el entregable real, no un vídeo: la planta alta de una villa en la Costa del Sol, modelada desde su plano. Gira, acércate, recorre sus {{villa:rooms}} estancias o corta los muros a {{villa:cutHeight}} m con el [modo maqueta](@glosario#modo-maqueta). El modelo pesa {{file:glb}} y solo se descarga si pulsas. Cifras y método, en el [caso demostrativo](@caso-villa).',
      },
      {
        type: 'audiences',
        h2: '¿Para quién trabajamos?',
        intro: 'El mismo modelo resuelve problemas distintos: una vivienda vacía que no se vende por foto, una promoción sin piso piloto, un proyecto que el cliente no entiende en planta o un apartamento turístico que aún no está amueblado.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: '¿Cuánto cuesta el modelo 3D de tu vivienda?',
        intro: 'Precios públicos y cerrados, sin IVA. Para una vivienda estándar no hace falta pedir presupuesto: eliges pack y sabes lo que pagas antes de enviarnos el plano. Extras, volumen y comparativa con el mercado, en la [página de precios](@precios).',
      },
      {
        type: 'calculator',
        intro: 'Si tienes varias viviendas en cartera, el precio de la maqueta completa baja a partir de la quinta. Cambia el número y verás el total con y sin IVA.',
      },
      { type: 'faq' },
      {
        type: 'contactForm',
        h2: 'Pide tu demo: una estancia de tu plano en 3D',
        intro: 'Adjunta el plano o pega el enlace del anuncio. Te respondemos con precio cerrado y plazo y, si quieres, con una estancia modelada en 3D que puedes abrir en realidad aumentada. Gratis y sin compromiso. Contesta una persona.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta convertir el plano de una vivienda en 3D?',
        a: 'En {{brand}}, el plano 3D amueblado cuesta {{price:plano3d}} + IVA por planta de hasta 150 m². La maqueta 3D completa, con 6 renders, visor web y realidad aumentada, cuesta {{price:maqueta}} + IVA por vivienda de hasta 150 m² y {{price:maqueta:1}} hasta 300 m². Las promociones de obra nueva empiezan en {{price:promocion}} + IVA. Todas las tarifas y extras están en [precios](@precios).',
      },
      {
        q: '¿En cuánto tiempo tengo el modelo 3D?',
        a: '{{brand}} entrega la maqueta 3D completa en {{delivery:maqueta}} y el plano 3D en {{delivery:plano3d}}, contando desde que recibimos el plano y resolvemos las dudas. Si el anuncio tiene que salir ya, la entrega urgente en 48 horas lleva un recargo del {{extra:urgente}} sobre el total. Las promociones con varias tipologías tardan {{delivery:promocion}}.',
      },
      {
        q: '¿Qué necesitáis para empezar: plano, fotos, medidas?',
        a: 'Basta con el plano de la vivienda en PDF, JPG o PNG (DWG si lo tienes) y una medida de referencia, como la superficie total. Con eso, {{brand}} modela la vivienda a escala sin visitarla. Las fotos de acabados y el estilo de mobiliario son opcionales: afinan el resultado. Puedes adjuntar el plano en el formulario de esta página o pegar el enlace del anuncio.',
      },
      {
        q: '¿Es fiel el modelo si el plano no tiene cotas?',
        a: 'Es tan fiel como el plano. Si no trae cotas, {{brand}} mide sobre su escala o sobre una medida de referencia y las superficies son aproximadas (≈), como en nuestra villa de demostración. Con un plano acotado o un DWG, el modelo respeta las medidas. Lo indicamos en cada entrega para que tu anuncio no prometa metros exactos.',
      },
      {
        q: '¿El comprador necesita una app para verlo en realidad aumentada?',
        a: 'No. En iPhone y iPad se abre con [AR Quick Look](@glosario#ar-quick-look) desde Safari, y en Android con [Scene Viewer](@glosario#scene-viewer) en móviles compatibles con ARCore: un toque y la vivienda aparece sobre la mesa a escala 1:20 o a tamaño real. Un ordenador no puede mostrar realidad aumentada, así que {{brand}} enseña un código QR para abrirla en el móvil.',
      },
      {
        q: '¿Dónde puedo enseñar el modelo: mi web, portales, WhatsApp?',
        a: 'En tu web, con un código para incrustar el visor; por enlace, en WhatsApp o en un email; y con un código QR en el escaparate o en un folleto. Los renders son imágenes que subes a cualquier portal. {{brand}} no promete incrustar el visor dentro de idealista, que solo admite visitas virtuales de sus proveedores compatibles; donde el portal acepte un enlace, puedes usar el nuestro.',
      },
      {
        q: '¿Cuántos cambios puedo pedir?',
        a: 'La maqueta 3D completa incluye {{revisions:maqueta}} y el plano 3D, {{revisions:plano3d}}. Como {{brand}} construye el modelo con scripts, cambiar un suelo, un mueble o mover un tabique se rehace en minutos y se actualiza a la vez en los renders, el visor y la realidad aumentada. Si la distribución cambia después de la entrega, te pasamos presupuesto antes de tocar nada.',
      },
      {
        q: '¿Cuándo se paga el trabajo?',
        a: 'Cuando lo recibes terminado, no por adelantado. Antes de empezar, {{brand}} te confirma por escrito el precio cerrado sin IVA y el plazo; el IVA del 21 % se añade en la factura. Si prefieres probar primero, modelamos gratis una estancia de tu plano y te la enviamos con realidad aumentada, sin compromiso.',
      },
      {
        q: '¿Qué hacéis con mi plano? ¿Es confidencial?',
        a: 'Tu plano se usa solo para tu encargo. {{brand}} no lo publica ni enseña el resultado como ejemplo sin tu permiso por escrito, y trata tus datos conforme al RGPD. Si eres promotora y lo necesitas, firmamos un acuerdo de confidencialidad antes de recibir los planos. Nuestro propio caso de demostración está anonimizado por la misma razón.',
      },
    ],
    related: ['servicios', 'caso-villa', 'precios', 'como-funciona'],
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'Floor plan to 3D model, renders and AR in Spain | {{brand}}',
    description: 'We turn a home’s 2D floor plan into a furnished 3D model with renders, a web viewer and app-free AR, for agents and developers. From {{price:maqueta}} + VAT.',
    h1: 'From 2D floor plan to 3D, no photos',
    lead: 'We turn a home’s floor plan into a furnished 3D model, with renders, a web viewer and augmented reality that needs no app. For estate agents, developers and architects: from {{price:maqueta}} + VAT, in {{delivery:maqueta}}.',
    breadcrumb: 'Home',
    facts: [
      ['Input', 'One 2D floor plan, no photos or visit'],
      ['Deliverables', '3D model, 4K renders, web viewer and AR'],
      ['Turnaround', '{{delivery:maqueta}}'],
      ['From', '{{price:plano3d}} + VAT; full model {{price:maqueta}}'],
      ['Augmented reality', 'iPhone, iPad and Android, no app'],
      ['Coverage', 'Costa del Sol, all of Spain and abroad'],
      ['Languages', 'English and Spanish'],
    ],
    blocks: [
      {
        type: 'compare',
        h2: 'From plan to 3D',
        intro: '{{entity}}\n\nSee it for yourself. On one side, the plan redrawn from our model; on the other, the colour top-down render, shot with the same camera at the same scale. All of it came from {{villa:input}}.',
      },
      {
        type: 'deliverables',
        h2: 'What do you get from a single floor plan?',
        intro: 'We model the home once, and five consistent deliverables come out of that model: change the living-room floor and it changes in the [renders](@glosario#render), in the viewer and in augmented reality. The first four come with the [complete 3D model](@servicio-plano); virtual staging is added per room.',
      },
      {
        type: 'process',
        variant: 'despiece',
        h2: 'How does a floor plan become a 3D model?',
        intro: 'Five steps and {{delivery:maqueta}} from start to finish. The geometry is not made up by an AI: we build it to scale with Python scripts in Blender, and you review it before delivery. Tools, timings per stage and quality checks are on [how it works](@como-funciona).',
      },
      {
        type: 'viewer',
        h2: 'The villa in 3D',
        intro: 'This is the actual deliverable, not a video: the upper floor of a Costa del Sol villa, modelled from its floor plan. Orbit, zoom, tour its {{villa:rooms}} rooms or cut the walls at {{villa:cutHeight}} m in [cut-away mode](@glosario#modo-maqueta). The model weighs {{file:glb}} and only downloads when you tap. Figures and method are in the [case study](@caso-villa).',
      },
      {
        type: 'audiences',
        h2: 'Who is it for?',
        intro: 'Estate agents with homes that do not sell on photos alone, and developers selling off-plan to buyers who are still in London, Amsterdam or Stockholm. Your buyer opens the same model on their phone, wherever they are.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'How much is a 3D model of your property?',
        intro: 'Public, fixed prices, excluding VAT. For a typical home there is no quote to wait for: pick a package and you know the cost before you send the plan. Extras, volume rates and a market comparison are on the [pricing page](@precios).',
      },
      {
        type: 'calculator',
        intro: 'If you have several properties on your books, the price of the complete model drops from the fifth one. Change the number to see the total with and without VAT.',
      },
      { type: 'faq' },
      {
        type: 'contactForm',
        h2: 'Get your demo: one room of your plan in 3D',
        intro: 'Attach the floor plan or paste the listing link. We reply with a fixed price and turnaround and, if you like, one room modelled in 3D that you can open in augmented reality. Free, with no obligation. A real person replies.',
      },
    ],
    faq: [
      {
        q: 'How much does it cost to turn a floor plan into a 3D model?',
        a: 'At {{brand}}, a furnished 3D floor plan costs {{price:plano3d}} + VAT per floor up to 150 m². The complete 3D model, with 6 renders, a web viewer and augmented reality, costs {{price:maqueta}} + VAT per home up to 150 m², or {{price:maqueta:1}} up to 300 m². New-build developments start at {{price:promocion}} + VAT. Every rate and extra is on our [pricing page](@precios).',
      },
      {
        q: 'How quickly will I get the 3D model?',
        a: '{{brand}} delivers the complete 3D model in {{delivery:maqueta}} and a 3D floor plan in {{delivery:plano3d}}, counted from when we receive the plan and any questions are answered. If the listing has to go live now, rush delivery in 48 hours carries a {{extra:urgente}} surcharge on the total. Developments with several unit types take {{delivery:promocion}}.',
      },
      {
        q: 'What do you need from me: a plan, photos, measurements?',
        a: 'The floor plan as a PDF, JPG or PNG (or a DWG if you have one) plus one reference measurement, such as the total floor area. With that, {{brand}} models the home to scale without a site visit. Photos of finishes and a furniture style are optional: they sharpen the result. Attach the plan to the form on this page or paste the listing link.',
      },
      {
        q: 'How accurate is the model if the plan has no dimensions?',
        a: 'As accurate as the plan. Without dimensions, {{brand}} measures from the plan’s scale or from one reference measurement, so floor areas are approximate (≈), as in our demo villa. With a dimensioned plan or a DWG, the model follows the measurements. We say so in every delivery, so your listing never promises exact square metres.',
      },
      {
        q: 'Do buyers need an app to see the home in augmented reality?',
        a: 'No. On iPhone and iPad it opens in [AR Quick Look](@glosario#ar-quick-look) from Safari; on Android it opens in [Scene Viewer](@glosario#scene-viewer) on ARCore-compatible phones. One tap and the home appears on the table at 1:20 or at real size. A computer cannot show augmented reality, so {{brand}} shows a QR code to open it on a phone.',
      },
      {
        q: 'Where can I show the model: my website, portals, WhatsApp?',
        a: 'On your website, with an embed code for the viewer; by link, on WhatsApp or by email; and through a QR code in the window or on a brochure. The renders are images you can upload to any portal. {{brand}} does not promise an embedded viewer inside Idealista, Rightmove or Kyero, which decide which tour providers they accept; where a portal takes a tour link, ours works.',
      },
      {
        q: 'How many rounds of changes are included?',
        a: 'The complete 3D model includes {{revisions:maqueta}} and the 3D floor plan {{revisions:plano3d}}. Because {{brand}} builds each model with scripts, swapping a floor, a piece of furniture or moving a partition is rebuilt in minutes and updates the renders, the viewer and the AR at once. If the layout changes after delivery, we quote before touching anything.',
      },
      {
        q: 'When do I pay?',
        a: 'When you receive the finished work, not up front. Before we start, {{brand}} confirms the fixed price excluding VAT and the turnaround in writing; Spanish VAT at 21% is added on the invoice, and EU business clients should check how it applies to them. If you would rather try us first, we model one room of your plan free of charge and send it in AR.',
      },
      {
        q: 'What do you do with my floor plan? Is it confidential?',
        a: 'Your plan is used for your project only. {{brand}} does not publish it or show the result as an example without your written permission, and we handle your data under the GDPR. If you are a developer and need one, we sign a non-disclosure agreement before receiving the plans. Our own demo case is anonymised for the same reason.',
      },
    ],
    related: ['servicios', 'caso-villa', 'precios', 'como-funciona'],
  },
};
