// Legal notice (template: legal). LSSI-CE art. 10 identification data come from site.legal via {{legal:*}} tokens
// (placeholders block launch). Generic text for a Spanish B2B service business: must be reviewed by a professional
// before launch (noted in the agent result, never on the page). Legal references checked on BOE on 2026-09-28.

const LSSI = 'https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758';

export default {
  id: 'aviso-legal',
  image: 'og_image',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Aviso legal y condiciones de uso de la web',
    description: 'Datos del titular de la web según la LSSI-CE, condiciones de uso, valor de precios y renders, propiedad intelectual, responsabilidad y ley aplicable.',
    h1: 'Aviso legal',
    lead: 'Aquí tienes los datos del titular de esta web, como exige el artículo 10 de la Ley 34/2002 (LSSI-CE), y las condiciones para usarla: qué puedes hacer con sus contenidos, qué valor tienen los precios y los renders que publicamos y qué ley se aplica.',
    breadcrumb: 'Aviso legal',
    blocks: [
      {
        type: 'prose',
        h2: 'Datos del titular',
        body: '- **Titular**: {{legal:razonSocial}}\n- **NIF**: {{legal:nif}}\n- **Domicilio**: {{legal:domicilio}}\n- **Datos registrales**: {{legal:registro}}\n- **Email**: {{legal:email}}\n- **Teléfono**: {{phone}}\n- **Actividad**: estudio de visualización 3D. Convertimos planos 2D de viviendas en modelos 3D, renders, visores web y archivos de realidad aumentada para inmobiliarias, promotoras y arquitectos.\n\n{{brand}} es el nombre comercial con el que {{legal:razonSocial}} presta sus servicios. En este aviso, «nosotros» es el titular y «tú», la persona que visita la web.',
      },
      {
        type: 'prose',
        h2: '¿Para qué sirve esta web?',
        body: 'Esta web explica los servicios de {{brand}}, publica sus precios, guías y un caso demostrativo, y permite pedir presupuesto o una demo. **No se puede contratar ni pagar en línea**: el formulario solo nos envía tu solicitud. Cada encargo se formaliza aparte, con un presupuesto que aceptas por escrito y que fija el precio, el plazo, los entregables y las rondas de cambios.\n\nUsar la web supone aceptar este aviso legal en la versión publicada en ese momento. Si no estás de acuerdo, no la uses.',
      },
      {
        type: 'prose',
        h2: '¿Qué valor tienen los precios publicados?',
        body: 'Los precios de la web son tarifas públicas en euros y **no incluyen el IVA**, que se añade en la factura cuando corresponde. Para cada encargo vale el precio del presupuesto que aceptas. Podemos actualizar las tarifas en cualquier momento; los cambios no afectan a los presupuestos ya aceptados.',
      },
      {
        type: 'prose',
        h2: 'Renders, medidas y caso demostrativo',
        body: 'Las imágenes de esta web son **renders**: imágenes generadas por ordenador a partir de un modelo 3D, no fotografías. El mobiliario, la decoración y los acabados que aparecen en ellas son una recreación virtual.\n\nLa villa en la Costa del Sol que mostramos es un **caso demostrativo anonimizado**. La modelamos a partir de la planta publicada de una villa real, sin fotos ni cotas. No reproducimos ese plano original: la planta que ves está redibujada desde nuestro modelo, y sus superficies son estimaciones (≈) tomadas de la escala del plano.\n\nLos modelos, planos 3D y renders que hacemos son material comercial para enseñar y vender viviendas. No sustituyen al plano de un arquitecto ni sirven para licencias, tasaciones o mediciones oficiales.',
      },
      {
        type: 'prose',
        h2: 'Propiedad intelectual e industrial',
        body: 'Los textos, renders, modelos 3D, el visor, el diseño y el código de esta web son de {{legal:razonSocial}} o se usan con licencia. No puedes copiarlos, modificarlos ni explotarlos comercialmente sin nuestro permiso por escrito. Sí puedes enlazar cualquier página y citar fragmentos breves indicando la fuente.\n\nPuedes **incrustar el visor 3D de la villa** en tu web con el código que ofrecemos en la página del [caso demostrativo](@caso-villa), siempre que no lo modifiques ni quites la mención a {{brand}}.\n\nAlgunos componentes son de terceros y se usan según sus licencias: las fuentes tipográficas Archivo y Geist Mono (SIL Open Font License 1.1) y el visor 3D model-viewer de Google (licencia Apache 2.0). Las marcas de terceros que citamos, como portales inmobiliarios, sistemas operativos o programas, pertenecen a sus titulares y solo las mencionamos para describir compatibilidades.\n\nLos derechos de uso de los renders, modelos y archivos que entregamos a cada cliente se regulan en su presupuesto.',
      },
      {
        type: 'prose',
        h2: 'Uso correcto de la web',
        body: 'Te comprometes a usar la web de forma lícita y a no hacer nada que pueda dañarla o impedir que otras personas la usen: introducir código malicioso, intentar acceder a zonas no públicas o sobrecargar el servidor de forma deliberada.\n\nSi nos envías planos o documentos por el formulario, garantizas que tienes derecho a compartirlos con nosotros para pedir presupuesto y que los datos de contacto que indicas son tuyos o de la empresa a la que representas.',
      },
      {
        type: 'prose',
        h2: 'Responsabilidad',
        body: 'Cuidamos que la información de la web sea correcta y esté al día, y cada página muestra la fecha de su última actualización. Aun así, puede contener errores u omisiones, que corregiremos en cuanto los detectemos. Los datos de mercado que citamos proceden de fuentes públicas enlazadas y su exactitud depende de ellas.\n\nNo respondemos de las interrupciones de la web por mantenimiento, por fallos técnicos ajenos a nosotros o por causas de fuerza mayor, ni de los daños derivados de un uso de la web contrario a este aviso. La realidad aumentada depende de que tu dispositivo sea compatible: AR Quick Look en iPhone y iPad, y Scene Viewer en móviles Android compatibles con ARCore.\n\nNada de lo anterior limita la responsabilidad que la ley no permite excluir.',
      },
      {
        type: 'prose',
        h2: 'Enlaces a otras webs',
        body: 'Enlazamos a fuentes externas, como estadísticas oficiales o documentación técnica, para que puedas comprobar los datos que citamos. No controlamos esas webs ni respondemos de su contenido. Si detectas un enlace a un contenido ilícito, escríbenos a {{legal:email}} y lo retiraremos.',
      },
      {
        type: 'prose',
        h2: 'Protección de datos y cookies',
        body: 'Cómo tratamos los datos que nos envías, cuánto tiempo los guardamos y cómo ejercer tus derechos se explica en la [política de privacidad](@privacidad). Esta web no instala cookies; lo que guarda en tu navegador está en la [política de cookies](@cookies).',
      },
      {
        type: 'prose',
        h2: 'Legislación aplicable y jurisdicción',
        body: `Este aviso legal se rige por la ley española, en particular por la [Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico](${LSSI}) (LSSI-CE). Si contratas como consumidor, conservas los derechos que te reconoce la normativa de consumo y puedes acudir a los juzgados de tu domicilio. En los demás casos, y salvo que la ley disponga otra cosa, las partes se someten a los juzgados y tribunales del domicilio del titular.\n\nPara cualquier duda sobre este aviso, escríbenos a {{legal:email}}.`,
      },
    ],
  },

  en: {
    title: 'Legal notice and website terms of use',
    description: 'Who runs this website under Spain’s LSSI-CE, the terms for using it, what our prices and renders mean, intellectual property, liability and governing law.',
    h1: 'Legal notice',
    lead: 'This page gives the details of the company behind this website, as required by article 10 of Spanish Law 34/2002 (LSSI-CE), and the terms for using the site: what you may do with its content, what our published prices and renders mean, and which law applies.',
    breadcrumb: 'Legal notice',
    blocks: [
      {
        type: 'prose',
        h2: 'Website owner',
        body: '- **Owner**: {{legal:razonSocial}}\n- **Tax ID (NIF)**: {{legal:nif}}\n- **Registered address**: {{legal:domicilio}}\n- **Registry details**: {{legal:registro}}\n- **Email**: {{legal:email}}\n- **Phone**: {{phone}}\n- **Activity**: 3D visualisation studio. We turn 2D floor plans of homes into 3D models, renders, web viewers and augmented reality files for estate agents, developers and architects.\n\n{{brand}} is the trading name under which {{legal:razonSocial}} provides its services. In this notice, “we” means the owner and “you” means anyone visiting the site.\n\nThis English version is provided for convenience. If it differs from the Spanish version, the Spanish version prevails.',
      },
      {
        type: 'prose',
        h2: 'What this website is for',
        body: 'This website describes the services of {{brand}}, publishes its prices, guides and a demo case study, and lets you request a quote or a demo. **You cannot buy or pay for anything online**: the form only sends us your request. Every project is agreed separately, through a written quote you accept, which sets the price, turnaround, deliverables and rounds of changes.\n\nBy using the site you accept this legal notice as published at that time. If you do not agree with it, please do not use the site.',
      },
      {
        type: 'prose',
        h2: 'What our published prices mean',
        body: 'Prices on this website are public rates in euros and **exclude VAT**, which is added to the invoice where it applies. For each project, the price that counts is the one in the quote you accept. We may update our rates at any time; changes never affect quotes that have already been accepted.',
      },
      {
        type: 'prose',
        h2: 'Renders, measurements and the demo case',
        body: 'The images on this website are **renders**: computer-generated images made from a 3D model, not photographs. The furniture, décor and finishes shown in them are a virtual recreation.\n\nThe Costa del Sol villa we show is an **anonymised demo case**. We modelled it from the published floor plan of a real villa, with no photos and no dimensions. We do not reproduce that original plan: the plan you see is redrawn from our own model, and its floor areas are estimates (≈) taken from the plan’s scale.\n\nThe models, 3D floor plans and renders we produce are marketing material for showing and selling homes. They do not replace an architect’s drawings and are not valid for planning applications, valuations or official measurements.',
      },
      {
        type: 'prose',
        h2: 'Intellectual property',
        body: 'The text, renders, 3D models, viewer, design and code of this website belong to {{legal:razonSocial}} or are used under licence. You may not copy, alter or use them commercially without our written permission. You may link to any page and quote short extracts with a credit.\n\nYou may **embed the villa’s 3D viewer** on your own website using the code we provide on the [demo case study](@caso-villa) page, as long as you do not alter it or remove the {{brand}} credit.\n\nSome components belong to third parties and are used under their licences: the Archivo and Geist Mono typefaces (SIL Open Font License 1.1) and Google’s model-viewer 3D viewer (Apache License 2.0). Third-party trade marks we mention, such as property portals, operating systems or software, belong to their owners and are named only to describe compatibility.\n\nUsage rights for the renders, models and files we deliver to each client are set out in that client’s quote.',
      },
      {
        type: 'prose',
        h2: 'Acceptable use',
        body: 'You agree to use the website lawfully and not to do anything that could damage it or stop others from using it, such as introducing malicious code, trying to access non-public areas or deliberately overloading the server.\n\nIf you send us plans or documents through the form, you confirm that you are entitled to share them with us to request a quote, and that the contact details you give are your own or your company’s.',
      },
      {
        type: 'prose',
        h2: 'Liability',
        body: 'We take care to keep the information on this website accurate and up to date, and every page shows when it was last updated. Even so, it may contain errors or omissions, which we will correct as soon as we spot them. Market figures we quote come from linked public sources, and their accuracy depends on those sources.\n\nWe are not liable for interruptions caused by maintenance, technical failures beyond our control or force majeure, nor for damage arising from use of the website contrary to this notice. Augmented reality depends on your device being compatible: AR Quick Look on iPhone and iPad, and Scene Viewer on ARCore-compatible Android phones.\n\nNothing in this notice limits any liability that cannot be excluded by law.',
      },
      {
        type: 'prose',
        h2: 'Links to other websites',
        body: 'We link to external sources, such as official statistics or technical documentation, so you can check the figures we quote. We do not control those websites and are not responsible for their content. If you find a link to unlawful content, email {{legal:email}} and we will remove it.',
      },
      {
        type: 'prose',
        h2: 'Data protection and cookies',
        body: 'How we handle the details you send us, how long we keep them and how to exercise your rights is explained in our [privacy policy](@privacidad). This website sets no cookies; what it stores in your browser is described in our [cookie policy](@cookies).',
      },
      {
        type: 'prose',
        h2: 'Governing law and jurisdiction',
        body: `This legal notice is governed by Spanish law, in particular [Law 34/2002 on information society services and electronic commerce](${LSSI}) (LSSI-CE). If you contract with us as a consumer, you keep the rights consumer law gives you and may bring proceedings in the courts where you live. In all other cases, and unless the law provides otherwise, the parties submit to the courts of the owner’s registered address.\n\nFor any question about this notice, email {{legal:email}}.`,
      },
    ],
  },
};
