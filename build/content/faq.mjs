// FAQ hub (ES + EN): /preguntas-frecuentes/ and /en/faq/.
// Questions follow People Also Ask wording from docs/research/02-keywords-es.md §3
// and the EN FAQ bank in docs/research/03-keywords-en.md §7, reworded so they do not
// repeat verbatim the FAQs already on service, audience, zone and guide pages.
// Prices, times and villa figures come only from tokens. Legal reference verified on
// 2026-09-28 in the BOE consolidated text (RD 515/1989, art. 3).

const RD515 = 'https://www.boe.es/buscar/act.php?id=BOE-A-1989-11181';

export default {
  id: 'faq',
  image: 'villa_planta_cenital_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Preguntas frecuentes sobre modelos 3D y AR',
    description: 'Precios desde {{price:plano3d}} + IVA, plazos, precisión de las medidas, realidad aumentada sin app, portales y confidencialidad: 37 respuestas claras.',
    h1: 'Preguntas frecuentes: del plano 2D al modelo 3D',
    lead: 'Respuestas directas a las preguntas habituales de inmobiliarias, promotoras y arquitectos antes de encargar: qué entregamos, cuánto cuesta (plano 3D desde {{price:plano3d}} + IVA y maqueta completa desde {{price:maqueta}} + IVA), cuánto se tarda ({{delivery:maqueta}}), qué precisión tienen las medidas y cómo se publica en tu web y en los portales.',
    breadcrumb: 'Preguntas frecuentes',
    card: {
      title: 'Preguntas frecuentes',
      summary: '37 respuestas cortas sobre entregables, precios, plazos, medidas, realidad aumentada, portales y confidencialidad.',
    },
    facts: [
      ['Precio desde', '{{price:plano3d}} + IVA por planta; maqueta, {{price:maqueta}} + IVA'],
      ['Plazo de la maqueta', '{{delivery:maqueta}}'],
      ['Revisiones', '{{revisions:maqueta}} en la maqueta completa'],
      ['Entrada', 'Un plano 2D, sin fotos ni visita'],
      ['Realidad aumentada', 'iPhone, iPad y Android, sin instalar apps'],
      ['Pago', 'Cuando recibes el trabajo terminado'],
    ],
    blocks: [
      {
        type: 'faqGroups',
        groups: [
          {
            title: 'Servicio y entregables',
            items: [
              {
                q: '¿Qué hacéis exactamente a partir del plano de una vivienda?',
                a: '{{brand}} convierte el plano 2D en un modelo 3D a escala y amueblado, sin fotos ni visita. De ese modelo salen la planta cenital a color, los renders fotorrealistas en 4K, un visor web para el anuncio y la realidad aumentada para iPhone y Android. El plano 3D cuesta desde {{price:plano3d}} + IVA por planta y la maqueta completa, desde {{price:maqueta}} + IVA.',
              },
              {
                q: '¿Qué incluye la maqueta 3D completa?',
                a: 'La maqueta 3D completa de {{brand}} incluye el modelo amueblado con materiales a medida, 6 renders en 4K, la planta cenital a color, la planta 2D redibujada, el visor web con estancias, recorrido y [modo maqueta](@glosario#modo-maqueta), la realidad aumentada en maqueta 1:20 y a tamaño real, 12 meses de alojamiento del visor y {{revisions:maqueta}}. Cuesta {{price:maqueta}} + IVA hasta 150 m².',
              },
              {
                q: '¿En qué se diferencian el plano 3D, los renders y el visor 3D?',
                a: 'El plano 3D enseña la distribución: una planta cenital a color y una vista isométrica amueblada. Los renders enseñan el ambiente de cada estancia a la altura de los ojos. El visor 3D deja al comprador girar y recorrer la vivienda por su cuenta. En {{brand}} los tres salen del mismo modelo, así que coinciden entre sí; la maqueta completa los reúne desde {{price:maqueta}} + IVA.',
              },
              {
                q: '¿En qué formatos entregáis los archivos?',
                a: '{{brand}} entrega los renders y las plantas en PNG o JPG a 4K; el modelo 3D en [GLB](@glosario#glb) para la web y Android, en [USDZ](@glosario#usdz) para iPhone y iPad, y en BLEND si trabajas con Blender. El visor llega como enlace y como código iframe para tu web. En nuestra villa de demostración, el modelo web pesa {{file:glb}}.',
              },
              {
                q: '¿Tenéis vídeos con IA o recorridos en realidad virtual?',
                a: 'Todavía no. En {{brand}} tenemos dos servicios en preparación: vídeos de recorrido generados con IA a partir de los renders, que irán etiquetados como tales, y panorámicas 360° para gafas de realidad virtual. Los anunciaremos cuando estén disponibles. Hoy entregamos renders, visor 3D con recorrido guiado y realidad aumentada sin app, incluidos en la maqueta completa desde {{price:maqueta}} + IVA.',
              },
            ],
          },
          {
            title: 'Precios y pagos',
            items: [
              {
                q: '¿Cuáles son vuestras tarifas?',
                a: 'Las tarifas de {{brand}} son públicas y sin IVA. Plano 3D: {{price:plano3d}} por planta hasta 150 m² y {{price:plano3d:1}} hasta 300 m². Maqueta 3D completa: {{price:maqueta}} por vivienda hasta 150 m² y {{price:maqueta:1}} hasta 300 m². Promoción de obra nueva: desde {{price:promocion}} con 3 tipologías. Home staging virtual: {{extra:staging}} por estancia. Extras y packs, en [precios](@precios).',
              },
              {
                q: '¿Cómo se cobra un dúplex o una vivienda de dos plantas?',
                a: 'El plano 3D de {{brand}} se cobra por planta: un dúplex con dos plantas de hasta 150 m² cada una son dos veces {{price:plano3d}} + IVA. La maqueta 3D completa se cobra por vivienda según su superficie total: {{price:maqueta}} + IVA hasta 150 m² y {{price:maqueta:1}} + IVA hasta 300 m². Para viviendas mayores te damos precio cerrado al ver el plano.',
              },
              {
                q: '¿Los precios de la web llevan el IVA incluido?',
                a: 'No. Todos los precios de {{brand}} se publican sin IVA y en la factura se suma el IVA general del 21 %. Por ejemplo, la maqueta 3D completa figura como {{price:maqueta}} + IVA y un render adicional, como {{extra:render}} + IVA. Si tu empresa factura desde fuera de España, dínoslo al pedir presupuesto y te confirmamos cómo se aplica el impuesto en tu caso.',
              },
              {
                q: '¿Hay que pagar algo por adelantado?',
                a: 'No. {{brand}} te confirma por escrito el precio cerrado y el plazo, modela la vivienda, te enseña el visor en un enlace privado, aplica tus cambios dentro de las {{revisions:maqueta}} de la maqueta completa y emite la factura con la entrega final. Pagas cuando recibes el trabajo terminado. Antes de encargar, puedes pedir la demo gratuita de una estancia de tu plano con realidad aumentada.',
              },
              {
                q: '¿Qué precio tiene encargar varias viviendas al año?',
                a: 'Baja con el volumen. El pack cartera de {{brand}} incluye 5 maquetas 3D completas por {{volume}} + IVA, es decir, {{volumeUnit}} por vivienda, para usar en 6 meses en viviendas de hasta 150 m². A partir de 10 viviendas, el precio unitario vuelve a bajar. La calculadora de la página de [precios](@precios) te da el total exacto según el número de viviendas.',
              },
              {
                q: '¿Cuánto cuestan los extras, como un render más o la entrega urgente?',
                a: 'En {{brand}}, cada render adicional en 4K cuesta {{extra:render}} + IVA; el home staging virtual sobre el modelo, {{extra:staging}} + IVA por estancia; una tipología más en una promoción, {{extra:tipologia}} + IVA; y la entrega urgente en 48 horas, un recargo del {{extra:urgente}} sobre el total. Renovar el alojamiento del visor después del primer año cuesta {{extra:hosting}} + IVA por vivienda.',
              },
            ],
          },
          {
            title: 'Plazos y proceso',
            items: [
              {
                q: '¿Desde cuándo se cuentan los días de entrega?',
                a: 'Desde que tenemos el plano y las dudas resueltas: la superficie o una medida de referencia y el estilo de mobiliario. A partir de ahí, {{brand}} entrega el plano 3D en {{delivery:plano3d}}, la maqueta completa en {{delivery:maqueta}} y una promoción de hasta 3 tipologías en {{delivery:promocion}}. Son días laborables, y la primera revisión con tus cambios ya entra en ese plazo.',
              },
              {
                q: '¿Qué tengo que mandaros para pedir presupuesto?',
                a: 'Con el plano basta: PDF, JPG, PNG o DWG, o el enlace del anuncio donde aparece. Si sabes la superficie o una medida, añádela; si la vivienda existe, unas fotos de suelos, cocina y baños ayudan a acertar con los acabados. Envíalo por el [formulario de contacto](@contacto), por email a {{email}} o por WhatsApp, y {{brand}} te responde con precio cerrado y plazo.',
              },
              {
                q: '¿Cómo reviso el trabajo antes de la entrega final?',
                a: 'En un enlace privado. Antes de entregar, {{brand}} te envía el visor 3D con la vivienda amueblada para que la recorras en el móvil o en el ordenador. Nos indicas los cambios de muebles, materiales o distribución y los aplicamos: la maqueta completa incluye {{revisions:maqueta}} y el plano 3D, {{revisions:plano3d}}. Los renders finales se calculan cuando das el visto bueno.',
              },
              {
                q: '¿Qué cuenta como una ronda de cambios?',
                a: 'Una ronda es una lista de cambios que nos envías de una vez: cambiar un sofá, el color de un suelo, mover un tabique o probar otra cocina. {{brand}} la aplica completa y te devuelve el visor actualizado. La maqueta 3D completa incluye {{revisions:maqueta}} y el plano 3D, {{revisions:plano3d}}. Redistribuir la planta entera es otro proyecto: te lo presupuestamos antes de hacerlo.',
              },
              {
                q: '¿Hace falta reunirse en persona?',
                a: 'No. {{brand}} trabaja en remoto desde la Costa del Sol con agencias, promotoras y arquitectos de toda España y de otros países: el plano llega por email o WhatsApp, la revisión se hace sobre el visor en un enlace y la entrega es una descarga. Atendemos en español y en inglés, por escrito o por teléfono en el {{phone}}, y contesta una persona.',
              },
            ],
          },
          {
            title: 'Precisión y medidas',
            items: [
              {
                q: '¿Puedo anunciar los metros cuadrados que salen del modelo 3D?',
                a: 'Mejor no. La superficie que publiques debe salir de una fuente oficial, como la nota simple, el catastro o la medición de un técnico, porque en la venta de vivienda los datos de la publicidad son exigibles según el [Real Decreto 515/1989](' + RD515 + '). Los metros del modelo de {{brand}} sirven para orientar y, sin cotas en el plano, son aproximados (≈). No es asesoramiento legal.',
              },
              {
                q: '¿Cómo sabéis la altura de los techos si el plano no la indica?',
                a: 'Si no nos la das, {{brand}} usa una altura habitual en vivienda, como los {{villa:wallHeight}} m de la villa de nuestro [caso demostrativo](@caso-villa), y lo indicamos en la entrega. Si la vivienda tiene dobles alturas, techos inclinados o falsos techos, dínoslo o envía una sección del proyecto: la altura cambia cómo se ven los renders y el recorrido a tamaño real en realidad aumentada.',
              },
              {
                q: '¿Qué pasa si el plano no coincide con la vivienda real?',
                a: '{{brand}} modela lo que dice el plano, así que si la vivienda se reformó o se construyó con cambios, el modelo repetirá esa diferencia. Si lo sabes, avísanos con una foto o un croquis del cambio y lo corregimos antes de tu revisión. Si lo descubres tras la entrega, mover tabiques se reconstruye en minutos y te presupuestamos el ajuste antes de hacerlo.',
              },
              {
                q: '¿El modelo reproduce los muebles y acabados reales?',
                a: 'Solo si nos los enseñas. Con fotos de suelos, cocina, baños o carpinterías, {{brand}} reproduce esos acabados en el modelo. El mobiliario, en cambio, suele ser propuesto: amueblamos cada estancia con un estilo coherente con la vivienda y su precio, o con el que nos pidas. Por eso las imágenes con muebles se publican como recreación virtual, ya que esos muebles no entran en la venta.',
              },
              {
                q: '¿El modelo 3D vale como plano técnico o para una tasación?',
                a: 'No. El modelo 3D de {{brand}} es material comercial para enseñar y vender la vivienda. No sustituye al plano de un arquitecto ni vale para licencias, tasaciones, certificados o mediciones oficiales, y cuando el plano no trae [cotas](@glosario#cota), sus superficies son estimaciones. Si necesitas documentación técnica, encárgala a un arquitecto o arquitecto técnico; después podemos modelar a partir de sus planos.',
              },
            ],
          },
          {
            title: 'Realidad aumentada y visor',
            items: [
              {
                q: '¿Qué necesita el comprador para ver la vivienda en realidad aumentada?',
                a: 'Solo su móvil y el enlace. En iPhone o iPad con iOS 12 o posterior, la vivienda se abre desde Safari con [AR Quick Look](@glosario#ar-quick-look); en Android 7.0 o posterior compatible con [ARCore](@glosario#arcore), con [Scene Viewer](@glosario#scene-viewer). No instala ninguna app. Ayudan una habitación con buena luz y una mesa o un suelo despejados. {{brand}} la incluye en la maqueta completa, desde {{price:maqueta}} + IVA.',
              },
              {
                q: '¿Qué diferencia hay entre la maqueta 1:20 y el tamaño real?',
                a: 'La maqueta 1:20 coloca la vivienda entera sobre una mesa, como una maqueta de arquitectura, para entender la distribución de un vistazo. El tamaño real la apoya en el suelo a escala 1:1, para caminar por el salón o la terraza y medir el espacio con el cuerpo; necesita sitio libre. {{brand}} entrega las dos versiones, para iPhone y para Android, en la maqueta completa.',
              },
              {
                q: '¿Qué es el modo maqueta del visor 3D?',
                a: 'Es la vista que corta todos los muros a {{villa:cutHeight}} m para mirar la vivienda desde arriba, como una maqueta de arquitectura, y ver a la vez la distribución y los muebles de cada estancia. Con un botón vuelves a los muros completos de {{villa:wallHeight}} m. Va en el visor de toda maqueta 3D completa de {{brand}}; pruébalo en la [villa de demostración](@caso-villa#visor).',
              },
              {
                q: '¿Afecta el visor 3D a la velocidad de carga de la web de mi agencia?',
                a: 'Muy poco. El visor de {{brand}} se incrusta con un iframe de carga diferida: el navegador no lo pide hasta que el visitante se acerca a él, y el modelo 3D, de {{file:glb}} en nuestra villa, solo se descarga cuando alguien pulsa para explorarlo. Hasta entonces la ficha carga como si tuviera una foto más. Además, alojamos el visor nosotros, sin ocupar espacio en tu servidor.',
              },
              {
                q: '¿Qué hago si el botón de realidad aumentada no funciona?',
                a: 'Revisa tres cosas. Que el enlace esté abierto en Safari (iPhone) o en Chrome (Android), no dentro de WhatsApp, Instagram o una app de correo. Que el móvil sea compatible: iOS 12 o posterior, o Android con [ARCore](@glosario#arcore). Y, en Android, que la app de Google y los Servicios de Google Play para RA estén actualizados. Si sigue sin abrir, escribe a {{email}} y {{brand}} lo revisa contigo.',
              },
            ],
          },
          {
            title: 'Portales y publicación',
            items: [
              {
                q: '¿Qué parte del trabajo puedo publicar en idealista o Fotocasa?',
                a: 'Las imágenes: los renders en 4K, la planta cenital a color y la vista isométrica se suben como cualquier foto del anuncio. El visor 3D de {{brand}} no se incrusta dentro de idealista, que solo admite visitas 3D de sus proveedores multimedia compatibles. Sí puedes pegar su enlace en el campo de visita virtual de los portales que acepten una URL externa y usarlo en tu propia web.',
              },
              {
                q: '¿Cómo pongo el visor 3D en la ficha de mi web?',
                a: 'Con el código [iframe](@glosario#iframe) que te entrega {{brand}}: lo copias y lo pegas en un bloque HTML de la ficha, en WordPress, Wix o cualquier gestor que admita HTML. El visor ocupa el ancho disponible de la página y funciona en el móvil. Si tu web la lleva una agencia externa, reenvíale el código: no hay que instalar nada en tu servidor.',
              },
              {
                q: '¿Cómo comparto la vivienda en 3D con un comprador?',
                a: 'Con el enlace del visor, que {{brand}} te entrega junto al código para tu web. Lo envías por WhatsApp o email, lo pegas en el anuncio o lo conviertes en un código QR para folletos y escaparates. El comprador lo abre sin registrarse ni instalar nada y, desde el mismo enlace, pasa a la realidad aumentada en su móvil. El alojamiento dura 12 meses con la maqueta completa.',
              },
              {
                q: '¿Tengo que indicar en el anuncio que las imágenes son renders?',
                a: 'Te lo recomendamos siempre. En la venta de vivienda, la publicidad no puede inducir a error y sus datos son exigibles aunque no figuren en el contrato, según el [Real Decreto 515/1989](' + RD515 + '). Una mención como «Recreación virtual» o «Imagen orientativa» evita malentendidos con muebles y acabados. En {{brand}} la aplicamos a todo el mobiliario virtual. No es asesoramiento legal.',
              },
              {
                q: '¿Puedo poner un código QR del visor en el escaparate o en un cartel?',
                a: 'Sí. El enlace del visor de {{brand}} funciona como cualquier URL, así que puedes convertirlo en un código QR para el escaparate, el cartel de «Se vende», un folleto o la mesa de la oficina de ventas. Quien lo escanea abre la vivienda en 3D en su móvil y, si el teléfono es compatible, la coloca en realidad aumentada sobre la mesa o a tamaño real.',
              },
            ],
          },
          {
            title: 'Confidencialidad y datos',
            items: [
              {
                q: '¿Quién puede usar los renders y el modelo 3D?',
                a: 'Tú, para comercializar esa vivienda: renders, plantas y archivos 3D sirven en tu web, portales, redes, dosieres, prensa y cartelería, sin pagar más por cada uso. El visor sigue en línea mientras esté alojado: 12 meses incluidos y después {{extra:hosting}} + IVA al año. {{brand}} solo enseña tu vivienda como ejemplo si nos das permiso por escrito. Si vas a ceder el modelo a terceros, lo hablamos antes.',
              },
              {
                q: '¿Compartís mis planos con alguien?',
                a: 'No los cedemos ni los publicamos. {{brand}} usa tus planos solo para tu presupuesto y tu encargo; los guarda el proveedor que aloja la web, con acceso restringido a nuestro equipo, como detalla la [política de privacidad](@privacidad). Si tu promotora lo necesita, firmamos un acuerdo de confidencialidad antes de recibirlos. Un consejo: tapa en el plano el nombre del propietario o la dirección, porque no los necesitamos para modelar.',
              },
              {
                q: '¿Publicáis en vuestra web las viviendas que modeláis?',
                a: 'Solo con tu permiso. {{brand}} no enseña en su web, redes o portfolio ninguna vivienda de un cliente sin autorización por escrito, y si la enseñamos, la anonimizamos como la [villa de nuestro caso](@caso-villa): sin dirección, sin el nombre de la agencia y sin el plano original. Mientras no haya permiso, tus renders y tu visor solo aparecen donde tú los publiques.',
              },
              {
                q: '¿Podéis borrar mis planos y archivos al terminar?',
                a: 'Sí. Cuando acabe el encargo, o cuando la vivienda se venda, pídenos por email que eliminemos los planos, el modelo y los archivos de trabajo, y {{brand}} lo hace y te lo confirma por escrito; solo conservamos lo que la ley obliga, como las facturas. Ten en cuenta que, sin el modelo, el visor y la realidad aumentada dejan de funcionar. Tus derechos sobre los datos personales están en la [política de privacidad](@privacidad).',
              },
              {
                q: '¿Puede haber problemas de licencias con las texturas o las imágenes?',
                a: 'Con las texturas, no. {{brand}} crea cada material como [textura procedural](@glosario#textura-procedural), generada por código y sin fotos de bancos de imágenes; solo para la villa de demostración creamos {{villa:textures}}. Así, lo que publicas en portales, dosieres o vallas no depende de licencias de imagen de terceros. Blender, el programa con el que trabajamos, es software libre y admite uso comercial.',
              },
              {
                q: '¿Por qué el caso de la villa es anónimo?',
                a: 'Porque partimos de la planta publicada de una villa real de la Costa del Sol, que {{brand}} redibujó y no reproduce. No nombramos la vivienda, la agencia ni su ubicación exacta, y la presentamos como caso demostrativo, no como encargo de un cliente. El plano no traía cotas, así que sus superficies, unos {{villa:interiorM2}} m² interiores, son estimaciones (≈).',
              },
            ],
          },
        ],
      },
    ],
    related: ['precios', 'como-funciona', 'caso-villa', 'glosario', 'contacto'],
    cta: {
      h2: '¿No está tu pregunta?',
      body: 'Escríbenos con el plano o con tu duda y te contestamos con precio y plazo concretos. Si quieres verlo antes de decidir, modelamos gratis una estancia y te la mandamos en realidad aumentada. Contesta una persona.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'FAQ: floor plan to 3D model, viewer and AR',
    description: 'Prices from {{price:plano3d}} + VAT, {{delivery:maqueta}} turnaround, measurement accuracy, app-free AR, property portals and confidentiality: 33 answers.',
    h1: 'Floor plan to 3D: frequently asked questions',
    lead: 'Straight answers for estate agents, developers and architects, in Spain or abroad, before ordering: what you get, what it costs (a 3D floor plan from {{price:plano3d}} + VAT, the complete 3D model from {{price:maqueta}} + VAT), how long it takes ({{delivery:maqueta}}), how accurate it is and how buyers view it on your site, on portals and in AR.',
    breadcrumb: 'FAQ',
    card: {
      title: 'Frequently asked questions',
      summary: '33 short answers on deliverables, pricing, turnaround, accuracy, augmented reality, portals and confidentiality.',
    },
    facts: [
      ['Price from', '{{price:plano3d}} + VAT per floor; full model {{price:maqueta}} + VAT'],
      ['Full model turnaround', '{{delivery:maqueta}}'],
      ['Revisions', '{{revisions:maqueta}} with the complete model'],
      ['Input', 'One 2D floor plan, no photos or site visit'],
      ['Augmented reality', 'iPhone, iPad and Android, no app'],
      ['Payment', 'When you receive the finished work'],
    ],
    blocks: [
      {
        type: 'faqGroups',
        groups: [
          {
            title: 'Service and deliverables',
            items: [
              {
                q: 'What exactly do you do with a floor plan?',
                a: '{{brand}} turns a 2D floor plan into a furnished, to-scale 3D model, with no photos and no site visit. From that one model come a colour top-down plan, photorealistic 4K renders, a web viewer for your listing and app-free augmented reality on iPhone and Android. A 3D floor plan starts at {{price:plano3d}} + VAT per floor; the complete 3D model at {{price:maqueta}} + VAT.',
              },
              {
                q: 'What is included in the complete 3D model?',
                a: 'The {{brand}} complete 3D model includes the furnished model with custom materials, 6 renders in 4K, a colour top-down plan, a redrawn 2D plan, the web viewer with rooms, guided tour and [cut-away mode](@glosario#modo-maqueta), augmented reality as a 1:20 tabletop model and at real size, 12 months of viewer hosting and {{revisions:maqueta}}. It costs {{price:maqueta}} + VAT for homes up to 150 m².',
              },
              {
                q: 'What is the difference between a 3D floor plan, a 3D render and an interactive 3D model?',
                a: 'A 3D floor plan shows the layout: a colour top-down plan and a furnished isometric view. A 3D render shows the feel of a room at eye level, like a photograph. An interactive 3D model lets buyers rotate and walk through the home on their own. At {{brand}} all three come from the same model, so they always match; the complete 3D model bundles them from {{price:maqueta}} + VAT.',
              },
              {
                q: 'Can you work from photos alone, with no floor plan?',
                a: 'Not reliably. Photos show finishes but not how rooms connect or how big they are, and {{brand}} builds every model to scale from a plan. With no plan, a clear hand sketch with the main measurements, or the plan from an old brochure or listing, is usually enough to start. Send us what you have and we will tell you whether it works; the full model then takes {{delivery:maqueta}}.',
              },
              {
                q: 'Which file formats do you deliver?',
                a: 'Renders and plans come as 4K PNG or JPG files. The 3D model comes as [GLB](@glosario#glb) for the web and Android, [USDZ](@glosario#usdz) for iPhone and iPad, and BLEND if you work in Blender. The viewer arrives as a shareable link plus iframe code for your website. For reference, the web model of the {{brand}} demo villa weighs {{file:glb}}.',
              },
            ],
          },
          {
            title: 'Pricing and payment',
            items: [
              {
                q: 'What are your prices?',
                a: 'All {{brand}} prices are public and exclude VAT. 3D floor plan: {{price:plano3d}} per floor up to 150 m², {{price:plano3d:1}} up to 300 m². Complete 3D model: {{price:maqueta}} per home up to 150 m², {{price:maqueta:1}} up to 300 m². New-build development: from {{price:promocion}} for 3 unit types. Virtual staging: {{extra:staging}} per room. Extras and packages are on the [pricing page](@precios).',
              },
              {
                q: 'Are your prices shown with or without Spanish VAT?',
                a: 'Without. Every {{brand}} price is published ex VAT, and Spanish VAT at the standard 21% rate is added on the invoice: the complete 3D model, for example, is {{price:maqueta}} + VAT and an extra render {{extra:render}} + VAT. If your agency or company is based outside Spain, tell us when you ask for a quote and we will confirm how VAT applies to your invoice.',
              },
              {
                q: 'How is a two-storey house priced?',
                a: 'The 3D floor plan is priced per floor, so a two-storey house with floors of up to 150 m² each costs twice {{price:plano3d}} + VAT. The complete 3D model is priced per home by total floor area: {{price:maqueta}} + VAT up to 150 m² and {{price:maqueta:1}} + VAT up to 300 m². For larger villas, {{brand}} gives you a fixed quote once we see the plans.',
              },
              {
                q: 'Do I have to pay a deposit?',
                a: 'No. {{brand}} confirms the fixed price and turnaround in writing, models the home, shares the viewer on a private link, applies your changes within the {{revisions:maqueta}} of the complete model and invoices on final delivery. You pay when you receive the finished work. Before committing, you can ask for the free demo: one room of your plan modelled in 3D and sent to you in augmented reality.',
              },
              {
                q: 'How much does it cost for several homes a year?',
                a: 'Less per home. The {{brand}} portfolio pack covers 5 complete 3D models for {{volume}} + VAT, or {{volumeUnit}} per home, to be used within 6 months on homes up to 150 m². From 10 homes the unit price drops again. Developments use a separate package from {{price:promocion}} + VAT, with each extra unit type at {{extra:tipologia}} + VAT. The calculator on our [pricing page](@precios) gives exact totals.',
              },
            ],
          },
          {
            title: 'Turnaround and process',
            items: [
              {
                q: 'How does the process work, step by step?',
                a: 'Five steps. You send the plan; {{brand}} models the home to scale in Blender; we furnish it and build the materials; you review the viewer on a private link and ask for changes; and we deliver renders, the viewer and augmented reality files ready to publish. For the complete 3D model, all of that fits into {{delivery:maqueta}}. Each stage is explained in [how it works](@como-funciona).',
              },
              {
                q: 'When does the turnaround clock start?',
                a: 'Once we have the plan and any questions are answered: the floor area or one reference measurement, and the furniture style. From then, {{brand}} delivers a 3D floor plan in {{delivery:plano3d}}, the complete 3D model in {{delivery:maqueta}} and a development of up to 3 unit types in {{delivery:promocion}}. These are working days, and your first review with changes is already built in.',
              },
              {
                q: 'Do we need to meet in person?',
                a: 'No. {{brand}} works remotely from the Costa del Sol with agents, developers and architects across Spain and abroad: the plan arrives by email or WhatsApp, you review the work in the viewer on a link, and delivery is a download. We work in English and Spanish, in writing or by phone on {{phone}}, and a real person replies.',
              },
              {
                q: 'What counts as a round of changes?',
                a: 'A round is one list of changes sent together: swap a sofa, change a floor colour, move a partition or try a different kitchen. {{brand}} applies the whole list and sends back the updated viewer. The complete 3D model includes {{revisions:maqueta}} and the 3D floor plan {{revisions:plano3d}}. Redesigning the entire layout is a new project, and we quote it before starting.',
              },
            ],
          },
          {
            title: 'Accuracy and measurements',
            items: [
              {
                q: 'Can I advertise the floor area shown in the 3D model?',
                a: 'Better not. The area in your listing should come from an official source, such as the Land Registry extract, the Catastro or a surveyor’s measurement: under Spain’s [Royal Decree 515/1989](' + RD515 + '), details in housing advertising are binding on the seller. {{brand}} model areas are a guide and, without dimensions on the plan, approximate (≈). This is not legal advice.',
              },
              {
                q: 'How do you know the ceiling height if the plan does not show it?',
                a: 'If you do not give it to us, {{brand}} uses a typical residential height, such as the {{villa:wallHeight}} m of the villa in our [case study](@caso-villa), and states it on delivery. If the home has double-height spaces, sloping ceilings or dropped ceilings, tell us or send a section drawing: height changes how the renders look and how the real-size AR walk-through feels.',
              },
              {
                q: 'What if the plan does not match the property as built?',
                a: '{{brand}} models what the plan says, so if the home was altered or built with changes, the model will repeat that difference. If you know, send a photo or a quick sketch of the change and we correct it before your review. If you only find out after delivery, moving partitions rebuilds in minutes, and we quote the adjustment before touching anything.',
              },
              {
                q: 'Is the 3D model valid as a technical drawing or for a valuation?',
                a: 'No. A {{brand}} 3D model is marketing material, made to show and sell a home. It does not replace an architect’s drawings and is not valid for planning applications, valuations, certificates or official measurements; when the plan has no [dimensions](@glosario#cota), its areas are estimates. For technical documents, hire an architect or surveyor, and we can then model from their plans.',
              },
            ],
          },
          {
            title: 'Augmented reality and the viewer',
            items: [
              {
                q: 'What does a buyer need to open the home in AR?',
                a: 'A phone and the link, with no app to download. Buyers open the {{brand}} home in augmented reality straight from the browser: [AR Quick Look](@glosario#ar-quick-look) on an iPhone or iPad with iOS 12 or later, and [Scene Viewer](@glosario#scene-viewer) on Android 7.0 or later phones that support [ARCore](@glosario#arcore). Good light and a clear table or floor help. AR is included in the complete 3D model from {{price:maqueta}} + VAT.',
              },
              {
                q: 'What is the difference between the 1:20 tabletop model and real size?',
                a: 'The 1:20 tabletop model puts the whole home on a table, like an architect’s model, so the layout makes sense at a glance. Real size sets it on the floor at 1:1, so buyers can walk into the living room or out to the terrace and feel the space; it needs room to move. {{brand}} delivers both, for iPhone and Android, with the complete 3D model.',
              },
              {
                q: 'What is the cut-away (dollhouse) view?',
                a: 'It is the {{brand}} viewer mode that slices every wall at {{villa:cutHeight}} m, so you look down into the home like an architect’s model and see each room’s layout and furniture at once. One button restores the full-height {{villa:wallHeight}} m walls. It comes with every complete 3D model, and you can try it now on the [demo villa](@caso-villa#visor).',
              },
              {
                q: 'Does embedding the viewer affect my site’s page speed?',
                a: 'Very little. The {{brand}} viewer is embedded with a lazy-loading iframe, so the browser does not request it until the visitor scrolls near it, and the 3D model, {{file:glb}} for our demo villa, only downloads when someone taps to explore. Until then the page loads as if it had one more photo. We also host the viewer ourselves, so it takes no space on your server.',
              },
              {
                q: 'What if the AR button does not work?',
                a: 'Check three things. That the link is open in Safari on iPhone or Chrome on Android, not inside WhatsApp, Instagram or an email app. That the phone is supported: iOS 12 or later, or an Android phone with [ARCore](@glosario#arcore). And, on Android, that the Google app and Google Play Services for AR are up to date. Still stuck? Email {{email}} and {{brand}} will sort it out with you.',
              },
              {
                q: 'What do people see on a desktop computer?',
                a: 'The full 3D viewer: they can rotate the home, move through it room by room and switch to cut-away or plan view. What a computer cannot do is augmented reality, because it lacks a phone’s camera and motion sensors. Instead, {{brand}} shows a QR code that opens the same home on their phone in one step, ready to place on a table or at real size.',
              },
            ],
          },
          {
            title: 'Portals and publishing',
            items: [
              {
                q: 'What can I upload to property portals?',
                a: 'The images: 4K renders, the colour top-down plan and the isometric view upload like any listing photo, on Idealista, Fotocasa, Kyero or Rightmove. The {{brand}} 3D viewer does not embed inside Idealista, which only accepts 3D tours from its approved providers. Instead, paste its link into a portal’s virtual tour field where external URLs are accepted, and embed it on your own website.',
              },
              {
                q: 'How do I add the viewer to a listing on my own website?',
                a: 'With the [iframe](@glosario#iframe) code {{brand}} gives you: copy it and paste it into an HTML block on the property page, in WordPress, Wix or any system that accepts HTML. The viewer fills the available width and works on phones as well as desktops. If a web agency runs your site, forward them the code; nothing needs installing on your server.',
              },
              {
                q: 'Should renders of an off-plan home be labelled in listings?',
                a: 'We recommend it every time. Under Spain’s [Royal Decree 515/1989](' + RD515 + '), housing advertising must not mislead, and its details are binding even when the contract leaves them out. A caption such as “Computer-generated image” or “Virtual recreation” avoids disputes over furniture and finishes. {{brand}} applies that practice to all virtual furniture. This is not legal advice.',
              },
              {
                q: 'Can I share the 3D home by WhatsApp, email or QR code?',
                a: 'Yes. {{brand}} delivers a viewer link alongside the embed code. Send it by WhatsApp or email, add it to your listing, or turn it into a QR code for brochures, window displays and property fairs. Buyers open it with no sign-up and no app, and from the same link they can place the home in augmented reality on their phone. Hosting runs 12 months with the complete 3D model.',
              },
            ],
          },
          {
            title: 'Confidentiality and data',
            items: [
              {
                q: 'Who can use the renders, the 3D model and the AR files?',
                a: 'You use them to market that property: renders, plans and 3D files work on your website, portals, social media, brochures, press and signage, with no fee per use. The viewer stays online while it is hosted: 12 months included, then {{extra:hosting}} + VAT a year. {{brand}} only shows your property as an example with your written permission. If you plan to pass the model to a third party, talk to us first.',
              },
              {
                q: 'Do you share my plans with anyone?',
                a: 'We neither pass them on nor publish them. {{brand}} uses your plans only for your quote and your project; they are stored by our website host, with access restricted to our team, as our [privacy policy](@privacidad) explains. If your company needs it, we sign a non-disclosure agreement before receiving them. A tip: blank out the owner’s name or the address on the plan, as we do not need them to model the home.',
              },
              {
                q: 'Do you use stock textures or images with licensing restrictions?',
                a: 'No. {{brand}} builds every material as a [procedural texture](@glosario#textura-procedural), generated by code rather than taken from a stock photo library; the demo villa alone has {{villa:textures}}. So what you publish on portals, in brochures or on billboards does not depend on third-party image licences. Blender, the software we work in, is free and open source and allows commercial use.',
              },
              {
                q: 'Can you delete my plans and files afterwards?',
                a: 'Yes. When the project ends, or when the home sells, email us and {{brand}} will delete the plans, the model and the working files, and confirm it in writing; we keep only what the law requires, such as invoices. Bear in mind that once the model is deleted, the viewer and the augmented reality stop working. Your rights over personal data are set out in our [privacy policy](@privacidad).',
              },
              {
                q: 'Why is your villa case study anonymised?',
                a: 'Because we started from the published floor plan of a real villa on the Costa del Sol, which {{brand}} redrew and does not reproduce. We name neither the property, the agency nor its exact location, and we present it as a demonstration, not a client project. The plan had no dimensions, so its areas, about {{villa:interiorM2}} m² inside, are estimates (≈).',
              },
            ],
          },
        ],
      },
    ],
    related: ['precios', 'como-funciona', 'caso-villa', 'glosario', 'contacto'],
    cta: {
      h2: 'Question not answered here?',
      body: 'Send us the floor plan or your question and we will reply with a specific price and turnaround. If you would like to see our work first, we model one room free of charge and send it to you in augmented reality. A real person replies.',
      service: 'maqueta',
    },
  },
};
