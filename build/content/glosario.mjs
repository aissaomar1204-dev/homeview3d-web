// Glossary page (ES + EN). The terms themselves live in build/data/glossary.mjs
// (30 terms; a primary source is linked in the body where one exists). This file holds the
// page frame: hero, key facts, one explanatory answer block and the glossary block.

export default {
  id: 'glosario',
  image: 'villa_maqueta_iso_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Glosario de visualización 3D inmobiliaria',
    description: 'Qué es un render, un USDZ, un GLB, AR Quick Look o el modo maqueta: 30 términos de 3D y realidad aumentada inmobiliaria, en menos de 40 palabras cada uno.',
    h1: 'Glosario de 3D y realidad aumentada inmobiliaria',
    lead: 'Los 30 términos que aparecen al pasar el plano 2D de una vivienda a un modelo 3D y al enseñarla en un visor web o en realidad aumentada, definidos en pocas líneas para inmobiliarias, promotoras y arquitectos. La mayoría se aplican en la maqueta 3D completa, desde {{price:maqueta}} + IVA en {{delivery:maqueta}}.',
    breadcrumb: 'Glosario',
    card: {
      title: 'Glosario de 3D inmobiliario',
      summary: '30 términos definidos en pocas líneas: formatos 3D, realidad aumentada, render, visor web y venta sobre plano.',
    },
    facts: [
      ['Términos', '30, en español y en inglés'],
      ['Formatos 3D', 'glTF, GLB y USDZ'],
      ['Realidad aumentada', 'AR Quick Look, Scene Viewer, ARCore, ARKit y WebXR'],
      ['Imagen y modelo', 'Render, infografía 3D, PBR, Cycles y planta cenital'],
      ['Venta', 'Venta sobre plano, piso piloto virtual y home staging virtual'],
      ['Cada definición', 'Menos de 40 palabras; fuente oficial enlazada cuando existe'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Por qué una vivienda en 3D necesita varios formatos?',
        answer: 'Porque cada dispositivo abre un formato distinto. El visor web y los móviles Android leen [GLB](@glosario#glb), la versión compacta de [glTF](@glosario#gltf); el iPhone y el iPad necesitan [USDZ](@glosario#usdz) para abrir la realidad aumentada con [AR Quick Look](@glosario#ar-quick-look). Los [renders](@glosario#render) son imágenes en 4K. Todo sale del mismo modelo 3D.',
        body: 'Por eso {{brand}} entrega un solo modelo con varias salidas. En nuestra [villa de demostración](@caso-villa), el modelo web pesa {{file:glb}}, la maqueta 1:20 para iPhone {{file:usdzMesa}} y la de Android {{file:glbArMesa}}. Quien abre el enlace no tiene que saber nada de esto: el botón «Ver en tu salón» abre el archivo que corresponde a su móvil, y en un ordenador aparece un código QR.',
      },
      { type: 'glossary' },
    ],
    related: ['servicio-ar', 'servicio-tour', 'caso-villa', 'guia-ar', 'faq'],
    cta: {
      h2: '¿Lo vemos con tu propio plano?',
      body: 'Mándanos el plano de una vivienda y te devolvemos una estancia en 3D para abrir en tu móvil, gratis y sin compromiso. Es la forma más rápida de ver en la práctica qué son un GLB, un USDZ y el modo maqueta.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'Glossary of 3D visualisation and AR for property',
    description: 'What is a render, USDZ, GLB, AR Quick Look or cut-away mode? 30 terms in property 3D visualisation and augmented reality, each defined in under 40 words.',
    h1: 'Property 3D and augmented reality glossary',
    lead: 'Plain-English definitions of the 30 terms you meet when a 2D floor plan becomes a 3D model shown in a web viewer or in augmented reality, written for estate agents, developers and architects. Spanish terms such as *infografía* and *cota* are covered too. The complete 3D model starts at {{price:maqueta}} + VAT, delivered in {{delivery:maqueta}}.',
    breadcrumb: 'Glossary',
    card: {
      title: 'Property 3D glossary',
      summary: '30 short definitions: 3D file formats, augmented reality, renders, web viewers and off-plan sales in Spain.',
    },
    facts: [
      ['Terms', '30, in English and Spanish'],
      ['3D formats', 'glTF, GLB and USDZ'],
      ['Augmented reality', 'AR Quick Look, Scene Viewer, ARCore, ARKit and WebXR'],
      ['Images and models', 'Render, CGI, PBR, Cycles and top-down plan'],
      ['Selling', 'Off-plan sales, virtual show homes and virtual staging'],
      ['Each definition', 'Under 40 words; official source linked where one exists'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Why does one 3D home need several file formats?',
        answer: 'Because each device opens a different format. The web viewer and Android phones read [GLB](@glosario#glb), the compact form of [glTF](@glosario#gltf); iPhones and iPads need [USDZ](@glosario#usdz) to open augmented reality in [AR Quick Look](@glosario#ar-quick-look). [Renders](@glosario#render) are 4K images. All of them come from the same 3D model.',
        body: 'That is why {{brand}} delivers one model with several outputs. For our [demo villa](@caso-villa), the web model weighs {{file:glb}}, the 1:20 tabletop model for iPhone {{file:usdzMesa}} and the Android one {{file:glbArMesa}}. Buyers opening the link never need to know any of this: the “View in your room” button opens the right file for their phone, and a computer shows a QR code instead.\n\nIf you work with Spanish developers, you will also meet local terms such as *venta sobre plano* (off-plan sale), *infografía 3D* (CGI) and *cota* (a dimension on a plan). They are listed here under their English names, with the Spanish in brackets.',
      },
      { type: 'glossary' },
    ],
    related: ['servicio-ar', 'servicio-tour', 'caso-villa', 'guia-ar', 'faq'],
    cta: {
      h2: 'Want to see it with your own floor plan?',
      body: 'Send us the plan of a property and we will return one room in 3D to open on your phone, free and with no obligation. It is the quickest way to see what a GLB, a USDZ and cut-away mode mean in practice.',
      service: 'maqueta',
    },
  },
};
