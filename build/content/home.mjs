// Home (rulebook C5 blueprint, BUILD-SPEC §6). The hero, cajetín, eyebrows and form wrapper come from the
// template; this file only feeds them. Block order is fixed by C5: compare → deliverables → process[despiece]
// → viewer (#demo) → audiences → faq → contactForm (no pricing or calculator while prices are not public).
// Every price, delivery time and villa figure is a token (build/data). No market statistics on this page.

export default {
  id: 'home',
  image: 'og_image',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  // ─────────────────────────────────────────────────────────────── ES
  // The Spanish home is the developer showroom page (build/templates/home.mjs + build/home/portada.html). The HTML lives
  // in portada.html; this file feeds its <head>, its FAQ (HTML and FAQPage) and the Markdown mirror (index.md, llms).
  es: {
    title: 'Showroom virtual 3D para promotoras de obra nueva | {{brand}}',
    description: 'Showrooms 3D para promotoras de villas, chalets y adosados en Marbella, Benahavís y Estepona. Tu comprador elige casa y la recorre antes de que exista.',
    h1: 'Showroom virtual',
    lead: 'Para promotoras de obra nueva en la Costa del Sol. Tu promoción, antes de construirla: tu comprador elige su casa, la recorre por plantas y te escribe. En un enlace con tu marca.',
    breadcrumb: 'Inicio',
    facts: [
      ['Para quién', 'Promotoras de obra nueva en la Costa del Sol'],
      ['Qué es', 'Un showroom web con tu marca, en un solo enlace'],
      ['Incluye', 'Masterplan, casas por plantas, planos, estancias y visitas 360°'],
      ['Qué necesitamos', 'Planos en PDF o DWG, memoria de calidades, ubicación y logo'],
      ['Promociones', 'De una a cinco viviendas'],
      ['Zona', 'Marbella, Benahavís, Estepona y el resto de la Costa del Sol'],
      ['Precio', 'Propuesta con precio cerrado cuando vemos tu proyecto'],
    ],
    blocks: [
      {
        type: 'prose',
        h2: 'Así lo vive tu comprador',
        body: 'Residencial Benahavís es una promoción de ejemplo, con casas, estados y precios ficticios. Funciona igual en el ordenador, la tablet o el móvil.\n\n1. **Elige su casa.** Toda la promoción desde el aire, con cada casa y su estado: disponible, reservada o vendida.\n2. **Entra por plantas.** La casa sin tejado, de sótano a azotea, con su ficha, sus metros y su precio.\n3. **Entiende el plano.** Cada planta con sus estancias, dibujada con los datos de tu proyecto.\n4. **Se imagina viviendo allí.** Cada estancia a pantalla completa. Si le encaja, te pide una llamada sin salir de la casa.',
      },
      {
        type: 'prose',
        h2: 'Tu comprador no imagina la casa. La recorre',
        body: 'Cada showroom se arma con las piezas que necesita tu promoción y lleva tu marca:\n\n- **Masterplan con disponibilidad**: cada casa con su estado, al día.\n- **La casa por plantas**: sin tejado, de sótano a azotea.\n- **Fichas y planos**: metros, estancias y precio.\n- **Estancias**: cada espacio a pantalla completa.\n- **Visitas 360°**: mirar alrededor dentro de cada estancia.\n- **De día y de noche**: la promoción con otra luz.',
      },
      {
        type: 'prose',
        h2: 'De tus planos a una casa que se recorre',
        body: 'No hace falta que la casa exista, ni renders previos. Con la documentación del proyecto levantamos cada vivienda con sus medidas reales y la vestimos con tus acabados. Necesitamos:\n\n- **Planos** en PDF o DWG: plantas, alzados y parcela.\n- **Memoria de calidades**: suelos, carpinterías, cocina y baños.\n- **Ubicación**: la parcela y su entorno, con vistas, orientación y accesos.\n- **Tu marca**: logo y colores, para que el showroom sea tuyo.',
      },
      {
        type: 'prose',
        h2: 'Todos mandan un PDF. Tú mandas la casa',
        body: 'Tu comprador mira diez promociones a la vez y las diez le llegan igual: un dossier que se descarga, se abre una vez y se olvida. Con {{brand}} mandas un enlace que abre la promoción en su móvil: la recorre, elige casa y te contesta desde dentro.\n\n- **Vendes antes de construir.** Mientras solo hay planos, una casa que se puede recorrer convence más que una lámina. Y el banco quiere ver ventas antes de financiar la obra.\n- **Llegas a quien compra desde fuera.** Buena parte de tus compradores vive en otro país y decide a distancia. El enlace viaja por WhatsApp y por email.\n- **Tus agencias enseñan lo mismo.** Cada agente comparte el mismo enlace, con tu marca y la disponibilidad al día. Nadie enseña una versión antigua.',
      },
      {
        type: 'prose',
        h2: 'Una herramienta de venta para tu equipo comercial',
        body: '- **En la sala de ventas**: tus comerciales presentan cada vivienda en una tablet, con su disponibilidad y su precio al día.\n- **En la venta a distancia**: el mismo enlace llega al comprador internacional por WhatsApp o por email.\n- **En ferias y agencias**: un código QR en el stand o en el folleto abre la promoción completa.',
      },
      {
        type: 'prose',
        h2: 'Villas, adosados o una urbanización entera',
        body: 'Promociones de una a cinco viviendas en Marbella, Benahavís y Estepona. Dentro del showroom, cada una se ve con su maqueta, sus plantas y sus estancias, con su estado y su ficha. Las imágenes de esta página son ilustrativas y los datos, de ejemplo.',
      },
      {
        type: 'prose',
        h2: 'Mándanos el plano. Te enseñamos la casa',
        body: 'Cuéntanos tu promoción y te preparamos una demo con tus propios planos: el antes y el después de una de tus viviendas. Escríbenos a {{email}}, por WhatsApp o al {{phone}}.',
      },
    ],
    faq: [
      { q: '¿Qué necesitáis de mi promoción?', a: 'Los planos en PDF o DWG, la memoria de calidades, la ubicación de la parcela y tu logo. Si tienes renders o referencias de acabados, también ayudan.' },
      { q: '¿Para qué promociones es?', a: 'Para obra nueva de villas, chalets, pareados y adosados en la Costa del Sol. Empezamos con promociones de una a cinco viviendas; si la tuya es más grande, cuéntanosla.' },
      { q: '¿Mi comprador tiene que instalar algo?', a: 'No. El showroom se abre en el navegador del móvil, la tablet o el ordenador, desde un enlace o un código QR.' },
      { q: '¿Pueden usarlo mis agencias?', a: 'Sí. Todas comparten el mismo enlace, con tu marca, así que cada comprador ve la misma promoción, la enseñe quien la enseñe.' },
      { q: '¿Cuánto cuesta?', a: 'Depende del número de viviendas y de las piezas que incluya. Cuando vemos tu proyecto te mandamos una propuesta con precio cerrado.' },
      { q: '¿Residencial Benahavís es una promoción real?', a: 'No. Es una promoción ficticia que hemos creado para enseñar cómo funciona un showroom. Sus casas, estados y precios son de ejemplo.' },
    ],
    related: ['sol-promotoras', 'servicios', 'contacto'],
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: '3D visualisation studio for real estate in Spain | {{brand}}',
    description: '{{brand}} turns a home’s 2D floor plan into a furnished 3D model, renders, web viewer and app-free AR. A fixed quote, delivered in {{delivery:maqueta}}.',
    h1: 'From 2D floor plan to 3D, no photos',
    // Hero subtext (rulebook LAYOUT-02 / COPY-05): entity + base first (SEO C-01), no price teaser; prices sit in the cajetín.
    lead: '{{brand}}, a 3D visualisation studio based in Mijas, on the Costa del Sol: photoreal 3D model, web viewer and augmented reality from the property’s floor plan. In days.',
    breadcrumb: 'Home',
    facts: [
      ['Input', 'One 2D floor plan, no photos or visit'],
      ['Deliverables', '3D model, 4K renders, web viewer and AR'],
      ['Turnaround', '{{delivery:maqueta}}'],
      ['Price', 'A fixed written quote before work starts'],
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
        a: 'It depends on floor area, the number of floors and what you need: a 3D floor plan, or the complete 3D model with renders, a web viewer and augmented reality. {{brand}} sends you a fixed written quote as soon as it sees the plan, with the turnaround. What each option includes is on [floor plan to 3D model](@servicio-plano); how we quote, on our [pricing page](@precios).',
      },
      {
        q: 'How quickly will I get the 3D model?',
        a: '{{brand}} delivers the complete 3D model in {{delivery:maqueta}} and a 3D floor plan in {{delivery:plano3d}}. The clock starts once we have the plan and one reference measurement, and it includes the rounds of changes if you send them within 24 hours. Rush delivery in 48 hours is quoted separately, when the schedule allows.',
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
