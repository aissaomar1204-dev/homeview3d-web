// Privacy policy (template: legal). RGPD (EU 2016/679) + LOPDGDD (LO 3/2018). Controller data from site.legal
// via {{legal:*}} tokens. Processors: Netlify (hosting + form submissions) and a generic email provider.
// Verified 2026-09-28: Netlify privacy policy (updated 10 Apr 2026) and Netlify DPA (version 2026-06-09, §14):
// Netlify, Inc. is certified under the EU-U.S. DPF (+ UK Extension); restricted transfers rely on the DPF, with the
// EU SCCs (Decision 2021/914) as fallback; Netlify processes customer data as a processor.
// BOE checked: LOPDGDD arts. 7, 19 and 32; Código de Comercio art. 30.1 (six years). AEPD complaint channels checked on aepd.es.
// The 12-month retention for quotes that never become a project is a PROPOSAL. Must be reviewed by a professional before launch.

const SRC = {
  rgpd: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
  lopdgdd: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673',
  netlify: 'https://www.netlify.com/privacy/',
  netlifySub: 'https://trust.netlify.com/?itemUid=e3fae2ca-94a9-416b-b577-5c90e382df57', // subprocessor list (old /legal/subprocessors/ 301s here; checked 2026-09-28)
  dpf: 'https://www.dataprivacyframework.gov/list',
  whatsapp: 'https://www.whatsapp.com/legal/privacy-policy-eea',
  aepd: 'https://www.aepd.es/',
  aepdSede: 'https://sedeagpd.gob.es/sede-electronica-web/',
};

export default {
  id: 'privacidad',
  image: 'og_image',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Política de privacidad y protección de datos',
    description: 'Qué datos tratamos cuando pides presupuesto o nos envías un plano, para qué, cuánto tiempo los guardamos, quién los procesa y cómo ejercer tus derechos.',
    h1: 'Política de privacidad',
    lead: 'Usamos los datos que nos das al pedir presupuesto o una demo solo para contestarte, preparar la propuesta y, si nos encargas el trabajo, hacerlo y facturarlo. No los vendemos, no hacemos publicidad con ellos y esta web no usa cookies. Aquí tienes el detalle, según el RGPD y la LOPDGDD.',
    breadcrumb: 'Privacidad',
    blocks: [
      {
        type: 'prose',
        h2: '¿Quién es el responsable del tratamiento?',
        body: `- **Responsable**: {{legal:razonSocial}}, que presta sus servicios con el nombre comercial {{brand}}\n- **NIF**: {{legal:nif}}\n- **Domicilio**: {{legal:domicilio}}\n- **Email para cuestiones de privacidad**: {{legal:email}}\n\nNo tenemos delegado de protección de datos porque nuestra actividad no obliga a nombrarlo. Para cualquier duda sobre tus datos, escríbenos al email anterior.\n\nEsta política aplica el [Reglamento (UE) 2016/679](${SRC.rgpd}), Reglamento General de Protección de Datos (RGPD), y la [Ley Orgánica 3/2018](${SRC.lopdgdd}), de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).`,
      },
      {
        type: 'prose',
        h2: '¿Qué datos tratamos?',
        body: 'Solo los que nos das y los mínimos para que la web funcione:\n\n- **Formulario de presupuesto**: tipo de cliente, servicio que te interesa, número de viviendas, nombre, empresa, email, teléfono, el plano o el enlace que adjuntes, tus comentarios y, si nos lo dices, cómo nos conociste.\n- **Origen de la visita**, que el formulario añade al enviarse: la página por la que entraste, la web de la que venías, los parámetros de campaña del enlace (utm), si los hay, y el idioma de la página.\n- **Mensajes** que nos envías por email, WhatsApp o teléfono.\n- **Datos del encargo**, si contratas: los de facturación y los archivos del proyecto.\n- **Datos técnicos de conexión**, como la dirección IP, el navegador y la página solicitada, que el servidor registra para servir la web y protegerla de abusos.\n\nLos planos pueden incluir datos de otras personas, como el nombre del propietario o la dirección de la vivienda. No los necesitamos para modelar: si puedes, tápalos antes de enviar el plano. Si nos los envías, confirmas que puedes compartirlos con nosotros para este fin.',
      },
      {
        type: 'table',
        h2: '¿Para qué usamos tus datos y con qué base legal?',
        intro: 'Cada uso tiene su base jurídica y su plazo. No usamos tus datos para nada que no aparezca en esta tabla.',
        caption: 'Finalidades, bases jurídicas y plazos de conservación',
        head: ['Finalidad', 'Base jurídica', 'Cuánto tiempo'],
        rows: [
          ['Contestar tu solicitud y enviarte el presupuesto o la demo', 'Medidas precontractuales que nos pides (art. 6.1.b RGPD)', '12 meses desde nuestro último contacto, si no llegas a encargar nada'],
          ['Hacer el trabajo, entregarlo y atender las revisiones', 'Ejecución del contrato (art. 6.1.b RGPD)', 'Mientras dure el encargo y el alojamiento del visor que contrates'],
          ['Facturar y cumplir las obligaciones contables y fiscales', 'Obligación legal (art. 6.1.c RGPD)', 'Seis años, como exige el artículo 30 del Código de Comercio'],
          ['Saber qué canales nos traen solicitudes (origen de la visita)', 'Interés legítimo en medir nuestra captación sin cookies (art. 6.1.f RGPD)', 'El mismo plazo que la solicitud a la que acompañan'],
          ['Mantener la web segura y disponible (registros técnicos)', 'Interés legítimo en proteger el servicio (art. 6.1.f RGPD)', 'El plazo limitado que fija el proveedor de alojamiento'],
        ],
        note: 'Si escribes en nombre de una empresa, tratamos tus datos de contacto profesionales por interés legítimo en la relación comercial (art. 6.1.f RGPD y art. 19 LOPDGDD). Al terminar cada plazo, bloqueamos los datos: solo quedan a disposición de jueces, tribunales y autoridades mientras puedan exigirse responsabilidades (art. 32 LOPDGDD), y después los borramos. Si no llegas a encargar nada, el plano se borra con el resto de tu solicitud.',
      },
      {
        type: 'prose',
        body: 'No tomamos decisiones automatizadas ni elaboramos perfiles: una persona lee cada solicitud y decide la respuesta. Tampoco te enviaremos boletines ni publicidad; si algún día queremos hacerlo, te pediremos permiso aparte y podrás retirarlo cuando quieras.',
      },
      {
        type: 'prose',
        h2: '¿Quién más puede ver tus datos?',
        body: `No vendemos ni cedemos tus datos. Solo acceden a ellos los proveedores que necesitamos para prestar el servicio, como **encargados del tratamiento**, con un contrato que les obliga a usarlos solo según nuestras instrucciones y a protegerlos:\n\n- **Netlify, Inc.** (Estados Unidos): aloja esta web y recibe y guarda los envíos del formulario, incluidos los planos adjuntos. Netlify publica los [subencargados](${SRC.netlifySub}) en los que se apoya.\n- **Nuestro proveedor de correo electrónico**: gestiona el buzón con el que recibimos tus mensajes y te contestamos.\n\nAdemás, comunicamos datos a la Agencia Tributaria y a otras administraciones cuando la ley nos obliga, y a nuestra entidad bancaria para gestionar los cobros.\n\nSi nos escribes por **WhatsApp**, ese servicio lo presta WhatsApp Ireland Limited con sus propias condiciones y su [política de privacidad](${SRC.whatsapp}). Nosotros usamos esa conversación solo para atender tu solicitud.`,
      },
      {
        type: 'prose',
        h2: '¿Salen tus datos del Espacio Económico Europeo?',
        body: `Sí, en un caso: Netlify, Inc. tiene su sede en Estados Unidos. Netlify está certificada en el [Marco de Privacidad de Datos UE-EE. UU.](${SRC.dpf}) (Data Privacy Framework), que cuenta con una decisión de adecuación de la Comisión Europea, y su contrato de encargo del tratamiento prevé las cláusulas contractuales tipo aprobadas por la Comisión (Decisión de Ejecución 2021/914) si ese marco dejara de aplicarse. Los detalles están en la [política de privacidad de Netlify](${SRC.netlify}).\n\nSi nuestro proveedor de correo electrónico trata datos fuera del Espacio Económico Europeo, solo lo hará con una decisión de adecuación de la Comisión Europea o con cláusulas contractuales tipo.`,
      },
      {
        type: 'prose',
        h2: '¿Qué derechos tienes?',
        body: '- **Acceso**: saber si tratamos datos tuyos y obtener una copia.\n- **Rectificación**: corregir los que sean inexactos o estén incompletos.\n- **Supresión**: pedir que los borremos, por ejemplo cuando ya no sean necesarios.\n- **Oposición**: oponerte a los tratamientos basados en nuestro interés legítimo.\n- **Limitación**: pedir que dejemos de usarlos mientras comprobamos su exactitud o resolvemos tu oposición.\n- **Portabilidad**: recibir en un formato de uso común los datos que nos diste para un encargo.\n- **Retirar tu consentimiento**, cuando sea la base de un tratamiento, sin que afecte a lo hecho antes.',
      },
      {
        type: 'prose',
        h2: '¿Cómo ejerces tus derechos?',
        body: 'Escríbenos a {{legal:email}} con el asunto «Protección de datos» e indica qué derecho quieres ejercer y dónde te contestamos. Solo te pediremos un documento que acredite tu identidad si tenemos dudas razonables de que la solicitud es tuya.\n\nEs gratis. Te contestamos en el plazo máximo de un mes, que la ley permite ampliar dos meses más en casos complejos o con muchas solicitudes; si fuera así, te lo diríamos dentro del primer mes.',
      },
      {
        type: 'prose',
        h2: '¿Dónde puedes reclamar?',
        body: `Si crees que no hemos tratado bien tus datos o que no hemos atendido tu solicitud, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en su [sede electrónica](${SRC.aepdSede}) o informarte en [aepd.es](${SRC.aepd}). Si vives en otro país de la Unión Europea, también puedes reclamar ante la autoridad de protección de datos de tu país. Te agradeceremos que antes nos escribas: casi todo se resuelve con un email.`,
      },
      {
        type: 'prose',
        h2: '¿Cómo protegemos tus datos y tus planos?',
        body: 'La web solo funciona con conexión cifrada (HTTPS). Los envíos del formulario y los planos quedan en el panel privado del proveedor de alojamiento, con acceso restringido al equipo de {{brand}}.\n\nUsamos tus planos solo para tu presupuesto y tu encargo: no los publicamos, no los usamos en otros proyectos y no enseñamos imágenes de tu vivienda sin tu permiso. Si tu empresa lo necesita, firmamos un acuerdo de confidencialidad antes de recibir los planos.',
      },
      {
        type: 'prose',
        h2: 'Menores de edad',
        body: 'Nuestros servicios se dirigen a profesionales y a propietarios adultos. Si tienes menos de 14 años, no nos envíes tus datos: la LOPDGDD (art. 7) exige para ello el consentimiento de tus padres o tutores.',
      },
      {
        type: 'prose',
        h2: 'Cambios en esta política',
        body: 'Si cambiamos cómo tratamos tus datos, por ejemplo al incorporar un proveedor, actualizaremos esta página y su fecha de actualización. Si el cambio afecta a una solicitud o a un encargo en curso, te avisaremos por email.',
      },
    ],
  },

  en: {
    title: 'Privacy policy and how we handle your data',
    description: 'What data we process when you request a quote or send a floor plan, why, how long we keep it, who processes it and how to exercise your GDPR rights.',
    h1: 'Privacy policy',
    lead: 'We use the details you give us when you request a quote or a demo only to reply, prepare our proposal and, if you commission the work, carry it out and invoice it. We do not sell your data or use it for advertising, and this website sets no cookies. The details follow, under the GDPR and Spanish law.',
    breadcrumb: 'Privacy',
    blocks: [
      {
        type: 'prose',
        h2: 'Who is the data controller?',
        body: `- **Controller**: {{legal:razonSocial}}, trading as {{brand}}\n- **Tax ID (NIF)**: {{legal:nif}}\n- **Registered address**: {{legal:domicilio}}\n- **Email for privacy matters**: {{legal:email}}\n\nWe have not appointed a data protection officer because our activity does not require one. For any question about your data, email the address above.\n\nThis policy applies [Regulation (EU) 2016/679](${SRC.rgpd}), the General Data Protection Regulation (GDPR), and Spain’s [Organic Law 3/2018](${SRC.lopdgdd}) on personal data protection and digital rights (LOPDGDD). This English version is provided for convenience; if it differs from the Spanish version, the Spanish version prevails.`,
      },
      {
        type: 'prose',
        h2: 'What data do we process?',
        body: 'Only what you give us and the minimum needed to run the website:\n\n- **Quote form**: client type, the service you are interested in, number of homes, name, company, email, phone, the plan or link you attach, your comments and, if you tell us, how you heard about us.\n- **Visit source**, added by the form when you send it: the page you arrived on, the website you came from, any campaign parameters in the link (utm) and the language of the page.\n- **Messages** you send us by email, WhatsApp or phone.\n- **Project data**, if you commission us: billing details and the project files.\n- **Technical connection data**, such as your IP address, browser and the page requested, which the server logs to deliver the website and protect it from abuse.\n\nFloor plans can contain other people’s details, such as the owner’s name or the property’s address. We do not need them to build the model, so please blank them out before sending the plan if you can. If you do send them, you confirm you are entitled to share them with us for this purpose.',
      },
      {
        type: 'table',
        h2: 'Why do we use your data, and on what legal basis?',
        intro: 'Each use has its own legal basis and retention period. We do not use your data for anything that is not in this table.',
        caption: 'Purposes, legal bases and retention periods',
        head: ['Purpose', 'Legal basis', 'How long'],
        rows: [
          ['Replying to your request and sending the quote or demo', 'Steps taken at your request before a contract (GDPR art. 6(1)(b))', '12 months from our last contact, if no project follows'],
          ['Doing the work, delivering it and handling revisions', 'Performance of the contract (GDPR art. 6(1)(b))', 'For the duration of the project and of any viewer hosting you buy'],
          ['Invoicing and meeting accounting and tax obligations', 'Legal obligation (GDPR art. 6(1)(c))', 'Six years, as required by article 30 of the Spanish Commercial Code'],
          ['Knowing which channels bring us requests (visit source)', 'Legitimate interest in measuring enquiries without cookies (GDPR art. 6(1)(f))', 'The same period as the request it comes with'],
          ['Keeping the website secure and available (technical logs)', 'Legitimate interest in protecting the service (GDPR art. 6(1)(f))', 'The limited period set by the hosting provider'],
        ],
        note: 'If you write on behalf of a company, we process your business contact details on the basis of our legitimate interest in the business relationship (GDPR art. 6(1)(f) and LOPDGDD art. 19). When each period ends, we block the data: it is kept only for courts and authorities while legal claims remain possible (LOPDGDD art. 32), and then deleted. If no project follows, your plan is deleted along with the rest of your request.',
      },
      {
        type: 'prose',
        body: 'We make no automated decisions and build no profiles: a real person reads every request and decides the reply. We will not send you newsletters or advertising either; if we ever want to, we will ask for your permission separately, and you can withdraw it at any time.',
      },
      {
        type: 'prose',
        h2: 'Who else can see your data?',
        body: `We do not sell or share your data. The only parties with access are the providers we need to deliver our service, acting as **processors** under a contract that obliges them to use the data only on our instructions and to keep it secure:\n\n- **Netlify, Inc.** (United States): hosts this website and receives and stores form submissions, including attached plans. Netlify publishes the [sub-processors](${SRC.netlifySub}) it relies on.\n- **Our email provider**: runs the mailbox where we receive your messages and reply to them.\n\nWe also disclose data to the Spanish Tax Agency and other public bodies where the law requires it, and to our bank to process payments.\n\nIf you message us on **WhatsApp**, that service is provided by WhatsApp Ireland Limited under its own terms and [privacy policy](${SRC.whatsapp}). We use the conversation only to deal with your request.`,
      },
      {
        type: 'prose',
        h2: 'Does your data leave the European Economic Area?',
        body: `Yes, in one case: Netlify, Inc. is based in the United States. Netlify is certified under the [EU-U.S. Data Privacy Framework](${SRC.dpf}), which is covered by a European Commission adequacy decision, and its data processing agreement provides for the Standard Contractual Clauses approved by the Commission (Implementing Decision 2021/914) should that framework cease to apply. Details are in [Netlify’s privacy policy](${SRC.netlify}).\n\nIf our email provider processes data outside the European Economic Area, it will do so only under a European Commission adequacy decision or Standard Contractual Clauses.`,
      },
      {
        type: 'prose',
        h2: 'What are your rights?',
        body: '- **Access**: find out whether we process your data and get a copy.\n- **Rectification**: correct data that is inaccurate or incomplete.\n- **Erasure**: ask us to delete it, for example when it is no longer needed.\n- **Objection**: object to processing based on our legitimate interest.\n- **Restriction**: ask us to stop using it while we check its accuracy or consider your objection.\n- **Portability**: receive the data you gave us for a project in a commonly used format.\n- **Withdrawing consent**, where consent is the basis for processing, without affecting anything done before.',
      },
      {
        type: 'prose',
        h2: 'How do you exercise your rights?',
        body: 'Email {{legal:email}} with the subject “Data protection”, saying which right you want to exercise and where we should reply. We will only ask for proof of identity if we have reasonable doubts that the request comes from you.\n\nIt is free. We reply within one month at most, which the law allows us to extend by two further months for complex or numerous requests; if that happens, we will tell you within the first month.',
      },
      {
        type: 'prose',
        h2: 'Where can you complain?',
        body: `If you believe we have mishandled your data or not dealt with your request, you can lodge a complaint with the Spanish Data Protection Agency (AEPD) through its [online office](${SRC.aepdSede}) or find more information at [aepd.es](${SRC.aepd}). If you live elsewhere in the EU, you can also complain to the data protection authority in your own country. We would appreciate the chance to put things right first: most issues are solved with one email.`,
      },
      {
        type: 'prose',
        h2: 'How do we protect your data and your plans?',
        body: 'The website only works over an encrypted connection (HTTPS). Form submissions and plans are stored in the hosting provider’s private dashboard, with access restricted to the {{brand}} team.\n\nWe use your plans only for your quote and your project: we do not publish them, reuse them in other projects or show images of your property without your permission. If your company needs one, we sign a non-disclosure agreement before receiving the plans.',
      },
      {
        type: 'prose',
        h2: 'Children',
        body: 'Our services are aimed at professionals and adult property owners. If you are under 14, please do not send us your details: Spanish law (LOPDGDD art. 7) requires the consent of your parents or guardians for that.',
      },
      {
        type: 'prose',
        h2: 'Changes to this policy',
        body: 'If we change how we handle your data, for example by adding a provider, we will update this page and its date. If the change affects a request or project in progress, we will let you know by email.',
      },
    ],
  },
};
