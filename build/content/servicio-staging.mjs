// Service page: virtual home staging on the real 3D model (extra `staging`, per room, on top of a model).
// ES cluster C6 (02-keywords-es.md), EN cluster C7 (03-keywords-en.md).
// Stat verified 2026-09-28 in the primary source (INE press release ETDP July 2026).

const INE = 'https://www.ine.es/dyngs/Prensa/ETDP0726.htm';

export default {
  id: 'servicio-staging',
  image: 'villa_dormitorios_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Home staging virtual sobre un modelo 3D real',
    description: 'Amueblamos la vivienda sobre su modelo 3D: el mismo estilo en cada render, en el visor y en la realidad aumentada. {{extra:staging}} + IVA por estancia.',
    h1: 'Home staging virtual sobre el modelo 3D de la vivienda',
    lead: 'Para inmobiliarias y promotoras: hacemos home staging virtual sobre el modelo 3D de la vivienda, no sobre fotos sueltas. Eliges estilo, muebles y materiales, y el cambio aparece igual en cada render, en el visor web y en la realidad aumentada. Cuesta {{extra:staging}} + IVA por estancia, sobre la maqueta 3D completa desde {{price:maqueta}} + IVA.',
    breadcrumb: 'Home staging virtual',
    card: {
      title: 'Home staging virtual',
      summary: 'Estilo, muebles y materiales sobre el modelo 3D, coherentes en cada render, en el visor y en la realidad aumentada.',
    },
    hero: {
      image: 'villa_dormitorios',
      alt: 'Ala de dormitorios de la villa amueblada, con cama doble, dos camas individuales, vestidor y baño completo, vista desde arriba con los muros cortados. Render 3D generado a partir del plano 2D.',
      caption: 'Dormitorios amueblados sobre el modelo. Render generado a partir del plano 2D.',
    },
    facts: [
      ['Precio', '{{extra:staging}} + IVA por estancia'],
      ['Se suma a', 'Maqueta 3D completa, desde {{price:maqueta}} + IVA'],
      ['Qué cambia', 'Mobiliario, textiles, suelos, paredes y materiales'],
      ['Dónde se ve', 'Renders, visor web y realidad aumentada'],
      ['Entrada', 'Plano 2D; fotos de acabados, opcionales'],
      ['Obra nueva', 'Sí, sin vivienda construida ni piso piloto'],
      ['Etiquetado', '«Recreación virtual» en cada imagen'],
      ['Plazo', 'Con la maqueta, {{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Qué es el home staging virtual?',
        answer: 'El home staging virtual amuebla y decora una vivienda de forma digital para que el comprador entienda su tamaño y su uso. Nosotros lo hacemos sobre el modelo 3D, no sobre fotos: los muebles tienen medidas reales y el mismo estilo se ve en todos los renders, en el visor y en la realidad aumentada.',
        body: 'Sirve para pisos vacíos, viviendas con muebles del propietario que no ayudan, obra nueva sin piso piloto y reformas que el comprador aún no se imagina. Parte de la vivienda en 3D, así que primero la modelamos a partir del plano: lo explicamos en [convertir un plano 2D en un modelo 3D](@servicio-plano).',
      },
      {
        type: 'answer',
        h2: '¿Qué diferencia hay con el mobiliario que ya incluye la maqueta?',
        answer: 'La maqueta 3D completa ya se entrega amueblada, con un estilo que proponemos a partir del plano. El home staging virtual es para cuando quieres decidir tú: otro estilo, piezas concretas, acabados distintos o varias versiones de la misma estancia para compradores diferentes. Se cobra por estancia redecorada, a {{extra:staging}} + IVA.',
        body: 'Los cambios puntuales, como otro sofá o un suelo más claro, entran en las {{revisions:maqueta}} incluidas en la maqueta. El staging es la redecoración completa de una estancia, con sus renders recalculados.',
      },
      {
        type: 'answer',
        h2: '¿En qué se diferencia del home staging virtual con IA?',
        answer: 'La IA decora cada foto por separado: el sofá del salón puede cambiar de una imagen a otra, y hace falta que la vivienda exista y esté fotografiada. Sobre el modelo 3D, el sofá es un objeto a escala colocado una sola vez: aparece igual en cada render, en el visor y en la realidad aumentada, y la distribución nunca se altera.',
      },
      {
        type: 'table',
        h2: '¿Staging con IA, sobre un modelo 3D o home staging físico?',
        intro: 'Tres formas de amueblar una vivienda para venderla, comparadas por lo que necesitan y lo que permiten.',
        caption: 'Formas de amueblar una vivienda para su venta',
        head: ['Criterio', 'Sobre el modelo 3D ({{brand}})', 'IA sobre fotos', 'Home staging físico'],
        rows: [
          ['Qué necesita', 'El plano 2D y la maqueta 3D', 'Fotos de la vivienda', 'Vivienda terminada, muebles y montaje'],
          ['Obra nueva sin construir', 'Sí', 'No', 'No'],
          ['Coherencia entre imágenes', 'Los mismos muebles, en la misma posición, en todas las vistas', 'Cada foto se decora por separado', 'Total, porque es real'],
          ['Muebles a escala', 'Sí, con medidas reales', 'Aproximados por la IA', 'Sí'],
          ['Visor y realidad aumentada', 'Sí, con el mismo mobiliario', 'No', 'No'],
          ['Cambiar de estilo', 'Se recalcula sobre el mismo modelo', 'Nueva generación en cada foto', 'Hay que volver a montar'],
        ],
        note: 'La IA sobre fotos es rápida y barata para decorar una foto concreta de una vivienda que ya existe. Si vendes obra nueva o necesitas coherencia entre todas las vistas, compensa el modelo. Más contexto en [IA o modelo 3D real](@guia-ia-vs-3d).',
      },
      {
        type: 'gallery',
        h2: 'El mobiliario de la villa, sobre el modelo',
        intro: 'La villa de demostración está amueblada en un único estilo, de aire mediterráneo. Cada mueble ocupa su sitio en todas las vistas y en el visor, porque es un solo modelo y no imágenes decoradas por separado.',
        items: [
          {
            image: 'villa_salon_dormitorio',
            alt: 'Salón con sofá rinconera, alfombra y mesa de mármol, junto al dormitorio principal con cama de 180 y butaca, vistos desde arriba. Render 3D generado a partir del plano 2D.',
            caption: 'Salón y dormitorio principal amueblados. Render 3D.',
          },
          {
            image: 'villa_terraza',
            alt: 'Terraza principal con dos tumbonas, sofá exterior, suelo de barro cocido y un olivo en maceta. Render 3D generado a partir del plano 2D.',
            caption: 'Mobiliario exterior en la terraza principal. Render 3D.',
          },
        ],
      },
      {
        type: 'checklist',
        h2: '¿Qué incluye el home staging virtual?',
        intro: 'Por cada estancia redecorada:',
        items: [
          'Mobiliario a escala: sofás, camas, mesas, sillas y almacenaje',
          'Textiles: alfombras, cortinas, cojines y ropa de cama',
          'Iluminación: lámparas y luz natural calculada',
          'Acabados: suelos, paredes, carpinterías y encimeras',
          'Decoración: plantas, cuadros, libros y objetos',
          'Terrazas: mobiliario exterior, macetas y sombra',
          'Renders de la estancia recalculados y el cambio aplicado en el visor y en la realidad aumentada',
        ],
      },
      {
        type: 'answer',
        h2: '¿Sirve para viviendas usadas o solo para obra nueva?',
        answer: 'Para las dos. En obra nueva, el staging sobre el modelo sustituye al piso piloto. En vivienda usada, que es la mayor parte del mercado, sirve para pisos vacíos, con muebles anticuados o con una reforma pendiente: enseñas su potencial sin mover un mueble. Como trabajamos desde el plano, ni siquiera hace falta fotografiarla.',
        body: 'En Marbella y la Costa del Sol se venden muchas villas de reventa amuebladas al gusto del propietario. El [home staging virtual en Marbella](@zona-marbella) cuesta lo mismo que en cualquier otra zona, {{extra:staging}} + IVA por estancia, y se hace en remoto. También trabajamos en [Málaga](@zona-malaga) y en el resto de la [Costa del Sol](@zona-costa-del-sol).',
      },
      {
        type: 'stat',
        value: '78,4 %',
        label: 'de las viviendas vendidas en España en julio de 2026 eran usadas: 48.128 compraventas inscritas en un solo mes',
        source: { label: 'INE, Estadística de Transmisiones de Derechos de la Propiedad', url: INE },
        year: 'julio de 2026',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Recreación virtual, siempre etiquetada',
        body: 'Entregamos cada imagen con staging con su mención, como texto para el pie de foto: «Recreación virtual. Mobiliario no incluido». Mantenla en el anuncio y en el dosier: el comprador sabe qué verá en la visita. El staging no oculta defectos ni cambia la distribución, porque la geometría sale del plano.',
      },
      {
        type: 'process',
        variant: 'list',
        h2: '¿Cómo se encarga el home staging virtual?',
        intro: 'El staging se suma al modelo: puedes pedirlo con la maqueta o añadirlo después, estancia a estancia. Los [renders inmobiliarios](@servicio-renders) y el [visor 3D interactivo](@servicio-tour) se actualizan con el nuevo estilo.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: '¿Cuánto cuesta el home staging virtual?',
        intro: '{{extra:staging}} por estancia redecorada, que se suma a la maqueta 3D completa o al pack de promoción. Todos los precios, sin IVA.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta un home staging?',
        a: 'Depende del tipo. Un home staging físico implica alquilar muebles, transportarlos y montarlos en la vivienda. El home staging virtual de {{brand}} cuesta {{extra:staging}} + IVA por estancia, sobre la maqueta 3D completa desde {{price:maqueta}} + IVA, que ya incluye 6 renders, visor web y realidad aumentada. No hay muebles que mover ni plazos de alquiler.',
      },
      {
        q: '¿Hay home staging virtual gratuito?',
        a: 'Hay apps de IA con pruebas gratuitas o planes baratos. Sirven para decorar una foto concreta de una vivienda que existe, y conviene revisar que no alteren ventanas ni proporciones. Si todavía no existe, o quieres el mismo estilo en todas las vistas, en el visor y en la realidad aumentada, {{brand}} lo hace sobre el modelo 3D.',
      },
      {
        q: '¿Hay que avisar de que las fotos están decoradas virtualmente?',
        a: 'Sí, y te lo recomendamos siempre. {{brand}} entrega cada imagen con staging con la mención «Recreación virtual. Mobiliario no incluido», para que la mantengas en el anuncio y en el dosier. El comprador sabe que los muebles no se incluyen y llega a la visita sin falsas expectativas. No es asesoramiento legal: ante cualquier duda, consulta con tu asesor.',
      },
      {
        q: '¿Se puede hacer home staging de una vivienda que aún no está construida?',
        a: 'Sí, y es donde el staging sobre modelo 3D no tiene alternativa. {{brand}} modela la vivienda desde los planos del proyecto y la amuebla antes de que exista, sin piso piloto. En el pack de promoción, desde {{price:promocion}} + IVA, las tipologías ya llegan amuebladas; cada estilo alternativo cuesta {{extra:staging}} + IVA por estancia.',
      },
      {
        q: '¿Puedo tener dos estilos de la misma vivienda?',
        a: 'Sí. Sobre el mismo modelo, {{brand}} puede preparar, por ejemplo, una versión familiar y otra pensada para alquiler o inversión, y enseñar las dos en renders y en el visor. Cada estancia redecorada cuenta como una estancia de staging, a {{extra:staging}} + IVA. La distribución y las medidas son idénticas en ambas versiones.',
      },
      {
        q: '¿El home staging virtual cambia la distribución o tapa defectos?',
        a: 'No. {{brand}} decora sobre la geometría que sale del plano: muros, huecos, puertas y superficies no se tocan, y no retocamos nada para esconder problemas. Si quieres enseñar una reforma con otra distribución, es un trabajo distinto: la modelamos como una versión aparte y te la presupuestamos antes de empezar.',
      },
      {
        q: '¿Cuánto tarda el home staging virtual?',
        a: 'Si lo pides con la maqueta, {{brand}} lo entrega todo junto en {{delivery:maqueta}}. Si lo añades después sobre un modelo ya hecho, redecorar una estancia es rápido porque la vivienda ya existe en 3D; te confirmamos el plazo al encargarlo. Con entrega urgente en 48 horas, el recargo es del {{extra:urgente}} sobre el total.',
      },
      {
        q: '¿Sirve para alquiler vacacional?',
        a: 'Sí, sobre todo antes de invertir. {{brand}} puede enseñarte cómo quedaría el apartamento con otro estilo antes de comprar muebles, o preparar imágenes de una vivienda turística que aún no está amueblada. Lo contamos en nuestra página de [alquiler vacacional](@sol-vacacional). Etiqueta esas imágenes como recreación virtual también en las plataformas de reservas.',
      },
    ],
    related: ['servicio-renders', 'servicio-tour', 'caso-villa', 'precios', 'sol-inmobiliarias'],
    cta: {
      h2: '¿Vemos tu vivienda amueblada?',
      body: 'Envíanos el plano y modelamos gratis una estancia en 3D, con realidad aumentada, para que veas cómo queda antes de decidir el estilo. Sin compromiso.',
    },
  },

  en: {
    title: '3D virtual staging on a real model, in Spain',
    description: 'Virtual staging on the home’s 3D model: the same furniture in every render, the 3D viewer and AR. {{extra:staging}} + VAT per room.',
    h1: '3D virtual staging on a real model of the home',
    lead: 'For estate agents and developers: we stage homes on their 3D model, not on individual photos. You choose the style, furniture and finishes, and the change appears identically in every render, in the web viewer and in augmented reality. It costs {{extra:staging}} + VAT per room, on top of the complete 3D model from {{price:maqueta}} + VAT.',
    breadcrumb: 'Virtual staging',
    card: {
      title: '3D virtual staging',
      summary: 'Style, furniture and finishes applied to the 3D model, consistent across every render, the viewer and AR.',
    },
    hero: {
      image: 'villa_dormitorios',
      alt: 'Furnished bedroom wing of the villa with a double bed, twin beds, a walk-in wardrobe and the family bathroom, seen from above with the walls cut away. 3D render generated from the 2D floor plan.',
      caption: 'Bedrooms furnished on the model. 3D render from the 2D floor plan.',
    },
    facts: [
      ['Price', '{{extra:staging}} + VAT per room'],
      ['Added to', 'Complete 3D model, from {{price:maqueta}} + VAT'],
      ['What changes', 'Furniture, soft furnishings, floors, walls and finishes'],
      ['Where it shows', 'Renders, web viewer and augmented reality'],
      ['Input', '2D floor plan; photos of finishes optional'],
      ['New builds', 'Yes, with no finished home or show home'],
      ['Labelling', '“Virtually staged” on every image'],
      ['Turnaround', 'With the model, {{delivery:maqueta}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'What is virtual staging?',
        answer: 'Virtual staging furnishes and decorates a home digitally, so buyers can understand its size and how to live in it. We do it on the home’s 3D model rather than on photos: furniture has real dimensions, and the same style appears in every render, in the viewer and in augmented reality.',
        body: 'It works for empty flats, homes dressed in the owner’s tired furniture, off-plan units without a show home and refurbishments buyers cannot yet picture. It starts from the home in 3D, so we first model it from the plan: see [floor plan to 3D model](@servicio-plano).',
      },
      {
        type: 'answer',
        h2: 'How is it different from the furniture already in the 3D model?',
        answer: 'The complete 3D model already arrives furnished, in a style we propose from the plan. Virtual staging is for when you want to decide: a different style, specific pieces, other finishes, or several versions of a room for different buyers. It is charged per restyled room, at {{extra:staging}} + VAT.',
        body: 'Small tweaks, such as another sofa or a lighter floor, fall within the {{revisions:maqueta}} included with the model. Staging is a full restyle of a room, with its renders recalculated.',
      },
      {
        type: 'answer',
        h2: 'How is 3D virtual staging different from AI staging on photos?',
        answer: 'AI tools stage each photo separately: the living room sofa may change from one image to the next, and the home must exist and be photographed first. On a 3D model the sofa is a to-scale object placed once, so it appears identically in every render, in the viewer and in AR, and the layout never shifts.',
      },
      {
        type: 'table',
        h2: 'AI staging, staging on a 3D model or physical home staging?',
        intro: 'Three ways to furnish a home for sale, compared on what they need and what they allow.',
        caption: 'Ways to furnish a home for sale',
        head: ['Criterion', 'On the 3D model ({{brand}})', 'AI on photos', 'Physical home staging'],
        rows: [
          ['What it needs', 'The 2D plan and the 3D model', 'Photos of the home', 'A finished home, furniture and installation'],
          ['Off-plan, not yet built', 'Yes', 'No', 'No'],
          ['Consistency between images', 'The same furniture in the same place in every view', 'Each photo staged separately', 'Complete, because it is real'],
          ['Furniture to scale', 'Yes, real dimensions', 'Approximated by the AI', 'Yes'],
          ['Viewer and AR', 'Yes, with the same furniture', 'No', 'No'],
          ['Changing style', 'Re-rendered on the same model', 'Regenerated photo by photo', 'Everything has to be restaged'],
        ],
        note: 'AI on photos is quick and cheap for dressing a single photo of a home that already exists. For off-plan sales, or when every view has to match, the model is worth it. More context in [AI floor plan to 3D](@guia-ia-vs-3d).',
      },
      {
        type: 'gallery',
        h2: 'The villa’s furniture, on the model',
        intro: 'The demo villa is furnished in a single, Mediterranean-leaning style. Each piece stays in place across every view and in the viewer, because it is one model, not images staged one by one.',
        items: [
          {
            image: 'villa_salon_dormitorio',
            alt: 'Living room with a corner sofa, rug and marble coffee table, next to the main bedroom with a 180 cm bed and an armchair, seen from above. 3D render generated from the 2D floor plan.',
            caption: 'Furnished living room and main bedroom. 3D render.',
          },
          {
            image: 'villa_terraza',
            alt: 'Main terrace with two sun loungers, an outdoor sofa, a terracotta floor and a potted olive tree. 3D render generated from the 2D floor plan.',
            caption: 'Outdoor furniture on the main terrace. 3D render.',
          },
        ],
      },
      {
        type: 'checklist',
        h2: 'What does virtual staging include?',
        intro: 'For each restyled room:',
        items: [
          'Furniture to scale: sofas, beds, tables, chairs and storage',
          'Soft furnishings: rugs, curtains, cushions and bedding',
          'Lighting: lamps and calculated daylight',
          'Finishes: floors, walls, joinery and worktops',
          'Styling: plants, artwork, books and accessories',
          'Terraces: outdoor furniture, planters and shade',
          'The room’s renders recalculated, with the change applied in the viewer and AR',
        ],
      },
      {
        type: 'answer',
        h2: 'Does it work for resale homes or only new builds?',
        answer: 'Both. For off-plan units, staging on the model replaces the show home. For resale homes, which make up most of the market, it suits empty flats, dated interiors or homes awaiting refurbishment: you show their potential without moving a stick of furniture. Because we work from the plan, you do not even need photos.',
        body: 'In Marbella and across the Costa del Sol, many resale villas are still dressed in the owner’s furniture. [Virtual staging in Marbella](@zona-marbella) costs the same as anywhere else, {{extra:staging}} + VAT per room, and is done remotely.',
      },
      {
        type: 'stat',
        value: '78.4%',
        label: 'of homes sold in Spain in July 2026 were resales: 48,128 registered sales in a single month',
        source: { label: 'INE (Spanish National Statistics Institute), Property Transfer Statistics', url: INE },
        year: 'July 2026',
      },
      {
        type: 'callout',
        tone: 'honesty',
        title: 'Virtually staged, always labelled',
        body: 'Every staged image is delivered with its label, as caption text: “Virtually staged. Furniture not included.” Keep that label in the listing and the brochure, so buyers know what they will find at the viewing. Staging never hides defects or changes the layout, because the geometry comes from the plan.',
      },
      {
        type: 'process',
        variant: 'list',
        h2: 'How do I order virtual staging?',
        intro: 'Staging is added to the model: order it with the complete model or add it later, room by room. Your [real estate 3D renders](@servicio-renders) and [interactive 3D floor plan](@servicio-tour) are updated with the new style.',
      },
      {
        type: 'pricing',
        variant: 'excerpt',
        h2: 'How much does virtual staging cost?',
        intro: '{{extra:staging}} per restyled room, added to the complete 3D model or the development package shown here. All prices exclude VAT.',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'How much does virtual staging cost?',
        a: '{{brand}} charges {{extra:staging}} + VAT per restyled room, added to the complete 3D model from {{price:maqueta}} + VAT, which already includes 6 renders, a web viewer and augmented reality. Physical staging, by contrast, means hiring, transporting and installing furniture. With 3D staging there is nothing to move and no rental period to manage.',
      },
      {
        q: 'How can I do virtual staging for free?',
        a: 'AI apps offer free trials or low-cost plans. They are fine for dressing one photo of a home that already exists, as long as you check they have not moved windows or changed proportions. If the home is not built yet, or you need the same style in every view, the viewer and AR, {{brand}} stages it on the 3D model instead.',
      },
      {
        q: 'Could I use ChatGPT for virtual staging instead?',
        a: 'Not for a listing. General AI image tools can restyle a room photo, but each result is a new picture: proportions drift, windows move and the next image will not match. That is fine for inspiration, not for a listing buyers will compare with the real home. {{brand}} stages on a to-scale 3D model, so every render, the viewer and AR show the same furniture.',
      },
      {
        q: 'Should virtually staged images be labelled in property listings?',
        a: 'Yes, and we recommend it every time. {{brand}} delivers every staged image marked “Virtually staged. Furniture not included”, so you can keep the label in the listing and the brochure. Buyers know the furniture is not included and arrive at the viewing with the right expectations. This is best practice, not legal advice: check with your adviser if in doubt.',
      },
      {
        q: 'Can you stage a home that has not been built yet?',
        a: 'Yes, and that is where staging on a 3D model has no real alternative. {{brand}} models the home from the architect’s plans and furnishes it before it exists, with no show home. In the development package, from {{price:promocion}} + VAT, unit types already arrive furnished; each alternative style costs {{extra:staging}} + VAT per room.',
      },
      {
        q: 'Can you show the same property in different furniture styles?',
        a: 'Yes. On the same model, {{brand}} can prepare, for example, a family version and a version aimed at rental investors, and show both in renders and in the viewer. Each restyled room counts as one room of staging, at {{extra:staging}} + VAT. Layout and measurements are identical in both versions.',
      },
      {
        q: 'Is virtual staging legitimate, or does it hide problems?',
        a: 'Done properly, it is simply furniture. {{brand}} dresses the geometry that comes from the plan: walls, openings, doors and floor areas are never altered, and nothing is retouched to hide defects. If you want to show a refurbishment with a different layout, that is separate work: we model it as its own version and quote it first.',
      },
      {
        q: 'How long does virtual staging take?',
        a: 'Ordered with the complete model, {{brand}} delivers everything together in {{delivery:maqueta}}. Added later on an existing model, restyling a room is quick because the home already exists in 3D; we confirm the timing when you order. Rush delivery in 48 hours carries a {{extra:urgente}} surcharge on the total.',
      },
    ],
    related: ['servicio-renders', 'servicio-tour', 'caso-villa', 'precios', 'sol-inmobiliarias'],
    cta: {
      h2: 'Want to see your home furnished?',
      body: 'Send us the floor plan and we will model one room in 3D for free, with augmented reality, so you can see how it looks before choosing a style. No obligation.',
    },
  },
};
