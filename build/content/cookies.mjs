// Cookie policy (template: legal). True to BUILD-SPEC: no cookies, no analytics (site.analytics = null), self-hosted
// fonts and model-viewer, CSP default-src 'self'. The ONLY browser storage is sessionStorage in src/js/main.js
// (keys: landing, referrer, utm_source, utm_medium, utm_campaign) used to fill the hidden attribution fields of the
// quote form. LSSI-CE art. 22.2 (checked on BOE 2026-09-28) covers any storage device, not only cookies, so it is
// disclosed here. Whether it needs consent is flagged for the professional legal review (agent result, not on page).
// If site.analytics is enabled later (cookieless Plausible), add it to the table below with the date.

const LSSI = 'https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758';

export default {
  id: 'cookies',
  image: 'og_image',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  es: {
    title: 'Política de cookies: esta web no usa cookies',
    description: 'Esta web no instala cookies ni analítica, publicidad o rastreadores de terceros. Solo recuerda, mientras dura tu visita, por qué página entraste.',
    h1: 'Política de cookies',
    lead: 'Esta web no instala cookies: ni de analítica, ni de publicidad, ni de redes sociales. Por eso no te mostramos un aviso de cookies. Lo único que guarda en tu navegador, y solo mientras dura la visita, es por dónde llegaste, para añadirlo a tu solicitud si nos escribes.',
    breadcrumb: 'Cookies',
    blocks: [
      {
        type: 'prose',
        h2: '¿Qué son las cookies?',
        body: `Son pequeños archivos que una web guarda en tu navegador para recordar información entre páginas o entre visitas. La ley española, en el artículo 22.2 de la [Ley 34/2002](${LSSI}) (LSSI-CE), aplica las mismas reglas a cualquier técnica parecida, como el almacenamiento local del navegador: hay que informarte y, salvo que sea estrictamente necesaria para un servicio que tú pides, pedirte permiso antes de usarla.`,
      },
      {
        type: 'table',
        h2: '¿Qué guarda esta web en tu navegador?',
        intro: 'Ninguna cookie. Solo estos datos, en el almacenamiento de sesión del navegador (sessionStorage): son propios de esta web, no se comparten con nadie y se borran al cerrar la pestaña.',
        caption: 'Datos que esta web guarda en tu navegador',
        head: ['Dato', 'Para qué sirve', 'Duración', 'Quién lo usa'],
        rows: [
          ['landing', 'Recordar la primera página que visitaste', 'Hasta que cierras la pestaña', 'Solo esta web'],
          ['referrer', 'Recordar la web desde la que llegaste, si vienes de otro sitio', 'Hasta que cierras la pestaña', 'Solo esta web'],
          ['utm_source, utm_medium y utm_campaign', 'Recordar los parámetros de campaña del enlace que seguiste, si los tiene', 'Hasta que cierras la pestaña', 'Solo esta web'],
        ],
        note: 'Estos datos no salen de tu navegador salvo que envíes el formulario de presupuesto: entonces viajan con tu solicitud, como explicamos en la [política de privacidad](@privacidad). Si no lo envías, desaparecen al cerrar la pestaña.',
      },
      {
        type: 'prose',
        h2: '¿Hay analítica, publicidad o contenido de terceros?',
        body: 'No. Esta web no carga Google Analytics, píxeles de redes sociales, mapas, vídeos incrustados ni publicidad. Las fuentes tipográficas y el visor 3D se sirven desde nuestro propio dominio, sin llamadas a servidores de terceros mientras navegas.\n\nSi en el futuro añadimos una herramienta de estadísticas, será una opción **sin cookies** que no identifique a nadie, y la incluiremos en esta página con su nombre y la fecha. Si alguna vez usáramos cookies que requieran tu permiso, te lo pediríamos antes, con un aviso en el que aceptar y rechazar tengan el mismo peso.',
      },
      {
        type: 'prose',
        h2: '¿Y WhatsApp, la realidad aumentada o el visor incrustado en otras webs?',
        body: '- **WhatsApp y enlaces externos**: si pulsas «Escribir por WhatsApp» o un enlace a otra web, sales de este sitio y el destino aplica su propia política de cookies.\n- **Realidad aumentada**: en iPhone y iPad la abre AR Quick Look y en Android, Scene Viewer de Google. Son funciones de tu móvil, sujetas a las condiciones de Apple o de Google; esta web no instala cookies en ese paso.\n- **Visor incrustado**: si una inmobiliaria incrusta nuestro [visor 3D](@servicio-tour) en su web, el visor tampoco instala cookies. La web que lo incrusta tiene su propia política.',
      },
      {
        type: 'prose',
        h2: '¿Cómo borrar o bloquear cookies en tu navegador?',
        body: 'Aunque esta web no las usa, puedes ver, borrar o bloquear las cookies y los datos de cualquier sitio en los ajustes de privacidad de tu navegador (Chrome, Safari, Firefox o Edge). El almacenamiento de sesión de esta web se borra solo al cerrar la pestaña, y también si borras los datos del sitio.',
      },
      {
        type: 'prose',
        h2: 'Cambios en esta política',
        body: 'Si cambia lo que esta web guarda en tu navegador, lo reflejaremos aquí antes de activarlo, con su fecha de actualización. Para cualquier duda, escríbenos a {{legal:email}}. Quién es el titular de la web está en el [aviso legal](@aviso-legal).',
      },
    ],
  },

  en: {
    title: 'Cookie policy: this site uses no cookies',
    description: 'This website sets no cookies and runs no analytics, advertising or third-party trackers. It only remembers, for the length of your visit, how you arrived.',
    h1: 'Cookie policy',
    lead: 'This website sets no cookies: no analytics, advertising or social media cookies. That is why you see no cookie banner. The only thing it keeps in your browser, and only while your visit lasts, is how you arrived, so it can be added to your request if you get in touch.',
    breadcrumb: 'Cookies',
    blocks: [
      {
        type: 'prose',
        h2: 'What are cookies?',
        body: `Cookies are small files a website stores in your browser to remember information between pages or visits. Spanish law, in article 22.2 of [Law 34/2002](${LSSI}) (LSSI-CE), applies the same rules to any similar technique, such as the browser’s local storage: you must be told about it and, unless it is strictly necessary for a service you have asked for, your permission must be requested before it is used.`,
      },
      {
        type: 'table',
        h2: 'What does this website store in your browser?',
        intro: 'No cookies. Only the items below, in the browser’s session storage (sessionStorage): they belong to this website alone, are shared with no one and are deleted when you close the tab.',
        caption: 'Items this website stores in your browser',
        head: ['Item', 'What it is for', 'How long', 'Who uses it'],
        rows: [
          ['landing', 'Remembering the first page you visited', 'Until you close the tab', 'This website only'],
          ['referrer', 'Remembering the website you came from, if you arrived from another site', 'Until you close the tab', 'This website only'],
          ['utm_source, utm_medium and utm_campaign', 'Remembering the campaign parameters of the link you followed, if it had any', 'Until you close the tab', 'This website only'],
        ],
        note: 'These items never leave your browser unless you send the quote form: they then travel with your request, as explained in our [privacy policy](@privacidad). If you do not send it, they disappear when you close the tab.',
      },
      {
        type: 'prose',
        h2: 'Is there any analytics, advertising or third-party content?',
        body: 'No. This website loads no Google Analytics, social media pixels, maps, embedded videos or advertising. Its typefaces and 3D viewer are served from our own domain, with no calls to third-party servers while you browse.\n\nIf we add a statistics tool in future, it will be a **cookieless** option that identifies no one, and we will list it on this page with its name and the date. If we ever used cookies that need your permission, we would ask first, with a banner where accepting and rejecting carry equal weight.',
      },
      {
        type: 'prose',
        h2: 'What about WhatsApp, augmented reality or the viewer on other websites?',
        body: '- **WhatsApp and external links**: if you tap “Message on WhatsApp” or a link to another website, you leave this site and the destination applies its own cookie policy.\n- **Augmented reality**: on iPhone and iPad it opens in AR Quick Look, and on Android in Google’s Scene Viewer. These are features of your phone, governed by Apple’s or Google’s terms; this website sets no cookies at that step.\n- **Embedded viewer**: if an estate agency embeds our [3D viewer](@servicio-tour) on its website, the viewer sets no cookies there either. The host website has its own policy.',
      },
      {
        type: 'prose',
        h2: 'How do you delete or block cookies in your browser?',
        body: 'Although this website uses none, you can view, delete or block cookies and site data for any website in your browser’s privacy settings (Chrome, Safari, Firefox or Edge). This website’s session storage clears itself when you close the tab, and also when you clear the site’s data.',
      },
      {
        type: 'prose',
        h2: 'Changes to this policy',
        body: 'If what this website stores in your browser changes, we will update this page, with its date, before the change goes live. For any question, email {{legal:email}}. Details of the website owner are in our [legal notice](@aviso-legal).\n\nThis English version is provided for convenience; if it differs from the Spanish version, the Spanish version prevails.',
      },
    ],
  },
};
