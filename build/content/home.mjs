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
    title: 'Estudio de visualización 3D inmobiliaria | {{brand}}',
    description: '{{brand}} convierte el plano 2D de una vivienda en modelo 3D amueblado, renders, visor web y AR sin app. Desde {{price:maqueta}} + IVA, en {{delivery:maqueta}}.',
    h1: 'Del plano 2D al modelo 3D, sin fotos',
    // Hero subtext (rulebook LAYOUT-02 / COPY-05): entity + base first (SEO C-01), no price teaser; prices sit in the cajetín.
    lead: '{{brand}}, estudio de visualización 3D en la Costa del Sol: modelo 3D fotorrealista, visor web y realidad aumentada a partir del plano de la vivienda. En días.',
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
        intro: 'Misma cámara, misma escala: a la izquierda, la planta redibujada desde el modelo; a la derecha, el render. Arrastra y compara. Todo salió de {{villa:input}}.',
      },
      {
        type: 'plate',
        images: [
          { image: 'villa_interior_salon', alt: 'Salón de la villa a la altura de los ojos, con sofá rinconera y hojas correderas hacia la terraza. Render 3D de la villa anonimizada.', caption: 'Salón hacia la terraza. Render 3D de la villa anonimizada.' },
        ],
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
        intro: 'Cinco pasos y {{delivery:maqueta}} de principio a fin. La geometría no la inventa una IA: la levantamos con scripts de Python en Blender, a escala, y la revisas antes de la entrega. Herramientas, plazos por fase y control de calidad, en [el proceso completo, fase a fase](@como-funciona).',
      },
      {
        type: 'viewer',
        h2: 'La villa en 3D',
        intro: 'Es el entregable real, no un vídeo: la planta alta de una villa en la Costa del Sol, modelada desde su plano. Gira, acércate, recorre sus {{villa:rooms}} estancias o corta los muros a {{villa:cutHeight}} m con el [modo maqueta](@glosario#modo-maqueta). El modelo pesa {{file:glb}} y solo se descarga si pulsas. Cifras y método, en el [caso demostrativo](@caso-villa).',
      },
      {
        type: 'plate',
        images: [
          { image: 'villa_interior_dormitorio', alt: 'Dormitorio principal de la villa con cabecero de obra, mesillas con lámparas y salida a la terraza. Render 3D de la villa anonimizada.', caption: 'Dormitorio principal. Render 3D de la villa anonimizada.' },
          { image: 'villa_interior_bano', alt: 'Baño en suite de la villa con bañera exenta redonda y porcelánico negro. Render 3D de la villa anonimizada.', caption: 'Baño en suite. Render 3D de la villa anonimizada.' },
        ],
      },
      {
        type: 'audiences',
        h2: '¿Para quién trabajamos?',
        intro: 'El mismo modelo resuelve problemas distintos: una vivienda vacía que no se vende por foto, una promoción sin piso piloto, un proyecto que el cliente no entiende en planta o un apartamento turístico que aún no está amueblado. [Ver todas las soluciones](@soluciones).\n\nDónde trabajamos: tenemos la base en Marbella ([render 3D en Marbella](@zona-marbella)) y trabajamos en remoto, sin visitar la vivienda, en [Málaga](@zona-malaga), en toda la [Costa del Sol](@zona-costa-del-sol) y en el resto de España, con el mismo precio y plazo.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: '¿Cuánto cuesta el modelo 3D de tu vivienda?',
        intro: 'Precios públicos y cerrados, sin IVA. Para una vivienda estándar no hace falta pedir presupuesto: eliges pack y sabes lo que pagas antes de enviarnos el plano. Extras, volumen y comparativa con el mercado, en la [página de precios](@precios).',
      },
      {
        type: 'calculator',
        intro: 'Con 5 o más maquetas completas de viviendas de hasta 150 m², el precio baja para todas las del encargo, no solo a partir de la quinta, y con 10 o más vuelve a bajar. Cambia el número y verás el total con y sin IVA.',
      },
      { type: 'faq' },
      {
        type: 'contactForm',
        h2: 'Pide tu demo: una estancia de tu plano en 3D',
        intro: 'Adjunta el plano o pega el enlace del anuncio. Te respondemos con precio cerrado y plazo y, si quieres, con una estancia modelada en 3D que puedes abrir en realidad aumentada. Gratis y sin compromiso. Contesta una persona.',
        image: 'villa_interior_dormitorio',
        imageAlt: 'Dormitorio principal de la villa con cabecero de obra, mesillas con lámparas y salida a la terraza. Render 3D de la villa anonimizada.',
        imageCaption: 'Dormitorio principal. Render 3D de la villa anonimizada.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta convertir el plano de una vivienda en 3D?',
        a: 'En {{brand}}, el plano 3D cuesta {{price:plano3d}} + IVA por planta, y la maqueta 3D completa, con renders, visor web y realidad aumentada, {{price:maqueta}} + IVA por vivienda de hasta 150 m². Las promociones de obra nueva empiezan en {{price:promocion}} + IVA. Qué incluye cada opción, en [plano 2D a 3D](@servicio-plano); tarifas y extras, en [precios](@precios).',
      },
      {
        q: '¿En cuánto tiempo tengo el modelo 3D?',
        a: '{{brand}} entrega la maqueta 3D completa en {{delivery:maqueta}} y el plano 3D en {{delivery:plano3d}}. Los días cuentan desde que tenemos el plano y una medida de referencia, e incluyen las rondas de cambios si nos las envías en 24 h. Con entrega urgente, 48 horas por un {{extra:urgente}} más sobre el total.',
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
        q: '¿Qué hacéis con mi plano? ¿Es confidencial?',
        a: 'Tu plano se usa solo para tu encargo. {{brand}} no lo publica ni enseña el resultado como ejemplo sin tu permiso por escrito, y trata tus datos conforme al RGPD. Si eres promotora y lo necesitas, firmamos un acuerdo de confidencialidad antes de recibir los planos. Nuestro propio caso de demostración está anonimizado por la misma razón.',
      },
    ],
    related: ['servicios', 'caso-villa', 'precios', 'como-funciona'],
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: '3D visualisation studio for real estate in Spain | {{brand}}',
    description: '{{brand}} turns a home’s 2D floor plan into a furnished 3D model, renders, web viewer and app-free AR. From {{price:maqueta}} + VAT, in {{delivery:maqueta}}.',
    h1: 'From 2D floor plan to 3D, no photos',
    // Hero subtext (rulebook LAYOUT-02 / COPY-05): entity + base first (SEO C-01), no price teaser; prices sit in the cajetín.
    lead: '{{brand}}, a 3D visualisation studio based in Mijas, on the Costa del Sol: photoreal 3D model, web viewer and augmented reality from the property’s floor plan. In days.',
    breadcrumb: 'Home',
    facts: [
      ['Input', 'One 2D floor plan, no photos or visit'],
      ['Deliverables', '3D model, 4K renders, web viewer and AR'],
      ['Turnaround', '{{delivery:maqueta}}'],
      ['From', '{{price:plano3d}} + VAT; complete model {{price:maqueta}}'],
      ['Augmented reality', 'iPhone, iPad and Android, no app'],
      ['Coverage', 'Costa del Sol, all of Spain and abroad'],
      ['Languages', 'English and Spanish'],
    ],
    blocks: [
      {
        type: 'compare',
        h2: 'From plan to 3D',
        intro: 'Same camera, same scale: on the left, the plan redrawn from the model; on the right, the render. Drag to compare. All of it came from {{villa:input}}.',
      },
      {
        type: 'plate',
        images: [
          { image: 'villa_interior_salon', alt: 'Living room of the villa at eye level, with a corner sofa and sliding panels towards the terrace. 3D render of the anonymised villa.', caption: 'Living room towards the terrace. 3D render of the anonymised villa.' },
        ],
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
        intro: 'Five steps and {{delivery:maqueta}} from start to finish. The geometry is not made up by an AI: we build it to scale with Python scripts in Blender, and you review it before delivery. Tools, timings per stage and quality checks are in [our process, stage by stage](@como-funciona).',
      },
      {
        type: 'viewer',
        h2: 'The villa in 3D',
        intro: 'This is the actual deliverable, not a video: the upper floor of a Costa del Sol villa, modelled from its floor plan. Orbit, zoom, tour its {{villa:rooms}} rooms or cut the walls at {{villa:cutHeight}} m in [cut-away mode](@glosario#modo-maqueta). The model weighs {{file:glb}} and only downloads when you tap. Figures and method are in the [case study](@caso-villa).',
      },
      {
        type: 'plate',
        images: [
          { image: 'villa_interior_dormitorio', alt: 'Main bedroom of the villa with a built-in headboard, bedside lamps and terrace access. 3D render of the anonymised villa.', caption: 'Main bedroom. 3D render of the anonymised villa.' },
          { image: 'villa_interior_bano', alt: 'En-suite bathroom of the villa with a round freestanding tub and black porcelain tiles. 3D render of the anonymised villa.', caption: 'En-suite bathroom. 3D render of the anonymised villa.' },
        ],
      },
      {
        type: 'audiences',
        h2: 'Who is it for?',
        intro: 'Estate agents with homes that do not sell on photos alone, and developers selling off-plan to buyers who are still in London, Amsterdam or Stockholm. Your buyer opens the same model on their phone, wherever they are. [See all our services](@servicios).\n\nWhere we work: we are based in Mijas, on the Costa del Sol ([3D rendering in Marbella](@zona-marbella)) and work remotely, with no site visit, across the Costa del Sol, the rest of Spain and abroad, at the same price and turnaround.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'How much is a 3D model of your property?',
        intro: 'Public, fixed prices, excluding VAT. For a typical home there is no quote to wait for: pick a package and you know the cost before you send the plan. Extras, volume rates and a market comparison are on the [pricing page](@precios).',
      },
      {
        type: 'calculator',
        intro: 'Order 5 or more complete models for homes up to 150 m² and the unit price drops for every home in the order, not just from the fifth; from 10 it drops again. Change the number to see the total with and without VAT.',
      },
      { type: 'faq' },
      {
        type: 'contactForm',
        h2: 'Get your demo: one room of your plan in 3D',
        intro: 'Attach the floor plan or paste the listing link. We reply with a fixed price and turnaround and, if you like, one room modelled in 3D that you can open in augmented reality. Free, with no obligation. A real person replies.',
        image: 'villa_interior_dormitorio',
        imageAlt: 'Main bedroom of the villa with a built-in headboard, bedside lamps and terrace access. 3D render of the anonymised villa.',
        imageCaption: 'Main bedroom. 3D render of the anonymised villa.',
      },
    ],
    faq: [
      {
        q: 'How much does it cost to turn a floor plan into a 3D model?',
        a: 'At {{brand}}, a 3D floor plan costs {{price:plano3d}} + VAT per floor, and the complete 3D model, with renders, a web viewer and augmented reality, {{price:maqueta}} + VAT per home up to 150 m². New-build developments start at {{price:promocion}} + VAT. What each option includes is on [floor plan to 3D model](@servicio-plano); every rate and extra, on our [pricing page](@precios).',
      },
      {
        q: 'How quickly will I get the 3D model?',
        a: '{{brand}} delivers the complete 3D model in {{delivery:maqueta}} and a 3D floor plan in {{delivery:plano3d}}. The clock starts once we have the plan and one reference measurement, and it includes the rounds of changes if you send them within 24 hours. Rush delivery takes 48 hours, with a {{extra:urgente}} surcharge on the total.',
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
        a: 'On your website, with an embed code for the viewer; by link, on WhatsApp or by email; and through a QR code in the window or on a brochure. The renders are images you can upload to any portal. {{brand}} does not promise an embedded viewer inside idealista, Rightmove or Kyero, which decide which tour providers they accept; where a portal takes a tour link, ours works.',
      },
      {
        q: 'How many rounds of changes are included?',
        a: 'The complete 3D model includes {{revisions:maqueta}} and the 3D floor plan {{revisions:plano3d}}. Because {{brand}} builds each model with scripts, swapping a floor, a piece of furniture or moving a partition is rebuilt in minutes and updates the renders, the viewer and the AR at once. If the layout changes after delivery, we quote before touching anything.',
      },
      {
        q: 'What do you do with my floor plan? Is it confidential?',
        a: 'Your plan is used for your project only. {{brand}} does not publish it or show the result as an example without your written permission, and we handle your data under the GDPR. If you are a developer and need one, we sign a non-disclosure agreement before receiving the plans. Our own demo case is anonymised for the same reason.',
      },
    ],
    related: ['servicios', 'caso-villa', 'precios', 'como-funciona'],
  },
};
