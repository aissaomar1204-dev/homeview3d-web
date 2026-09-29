/* ═══════════════════════════════════════════════════════════════
   Site configuration: the ONLY place for brand, domain and contact.
   Anything marked `placeholder: true` blocks indexing (every page `noindex`).
   `legal.pending: true` only warns: the company (AS TRINITY, S.L.) is being
   constituted, so NIF and registry data are shown as «en trámite».
   ═══════════════════════════════════════════════════════════════ */

export const site = {
  // Brand. Content files use the {{brand}} token, never a literal name.
  brand: {
    name: 'Home View 3D',
    legalName: 'AS TRINITY, S.L.',
    placeholder: false,
    logo: '/assets/brand/logo-512.png', // schema.org logo (512 x 512, from scripts/brand.mjs); the header uses the inline SVG lockup
  },

  // Canonical origin, no trailing slash (apex; www redirects here on Netlify).
  domain: 'https://homeview3d.com',
  domainPlaceholder: false,

  langs: ['es', 'en'],
  defaultLang: 'es',             // Spanish at the root, English under /en/
  xDefault: 'en',                // hreflang x-default points to the English twin when it exists
  locale: { es: 'es_ES', en: 'en_GB' },

  // Contact. WhatsApp in international format without "+".
  contact: {
    email: 'homeview3d@gmail.com',
    phoneE164: '+34685494982',
    phoneDisplay: '+34 685 49 49 82',
    whatsapp: '34685494982',
    booking: null,               // e.g. a Cal.com 15-min link; null hides the option
    placeholder: false,
  },

  // Where the studio is based / serves (service-area business, no public address yet).
  base: { locality: 'Mijas', region: 'Málaga', country: 'ES', postalCode: '29651', placeholderAddress: false },
  areaServed: {
    es: ['Marbella', 'Málaga', 'Costa del Sol', 'España'],
    en: ['Marbella', 'Málaga', 'Costa del Sol', 'Spain'],
  },

  // One canonical entity sentence, identical everywhere (site, llms.txt, directories, profiles).
  entity: {
    es: '{{brand}} es un estudio de visualización 3D en la Costa del Sol que convierte el plano 2D de una vivienda en un modelo 3D fotorrealista y amueblado, con renders, visor web interactivo y realidad aumentada sin app, para inmobiliarias, promotoras y arquitectos de toda España.',
    en: '{{brand}} is a 3D visualisation studio on the Costa del Sol that turns a home\'s 2D floor plan into a photorealistic, furnished 3D model, with renders, an interactive web viewer and app-free augmented reality, for estate agents, developers and architects across Spain.',
  },

  // Legal data for aviso legal / privacidad (LSSI-CE art. 10).
  // pending: true while the SL is being constituted (NIF and registry data not issued yet).
  legal: {
    razonSocial: 'AS TRINITY, S.L.',
    nif: 'en trámite (sociedad en constitución)',
    domicilio: 'Calle San Daniel 12, 29651 Mijas Costa (Málaga), España',
    registro: 'Inscripción en el Registro Mercantil de Málaga en trámite',
    email: 'homeview3d@gmail.com',
    placeholder: false,
    pending: true,
  },

  // Off-site profiles for Organization.sameAs (fill as they are created).
  sameAs: [],

  // The real person behind the studio (E-E-A-T, 04-geo §9 and §11). null until decided: pages keep
  // "Equipo de {{brand}}" as author. Once filled, schema.mjs emits a Person (@id /sobre-nosotros/#founder)
  // used as Organization.founder and as the author of the guides and the case, and index.md names it.
  // Shape: { name: 'Nombre Apellido', jobTitle: { es: 'Fundador y director técnico', en: 'Founder and technical director' },
  //          image: '/assets/img/founder.jpg' (square, ≥ 400 px, in public/), sameAs: ['https://www.linkedin.com/in/…'] }
  founder: null,

  // Search engine / indexing keys.
  indexNowKey: '4f7a2c9e8b1d4e6fa3c5b7d9e1f20a3c',  // 32 hex, served as /<key>.txt

  // Optional cookieless analytics. null = no analytics script at all.
  analytics: null,               // e.g. { provider: 'plausible', domain: 'estudio3d.com' }

  // Studio facts reused in copy (keep in sync with reality).
  facts: {
    founded: 2026,
    languages: { es: ['español', 'inglés'], en: ['Spanish', 'English'] },
    tools: ['Blender 5', 'Python', 'Cycles', 'glTF 2.0', 'USDZ', 'model-viewer'],
  },
};

/** True while any launch-blocking placeholder remains (drives noindex). */
export const hasPlaceholders = () =>
  site.brand.placeholder || site.domainPlaceholder || site.contact.placeholder || site.legal.placeholder;

/** True while legal data is issued but not final (NIF/registry pending): warning only. */
export const legalPending = () => Boolean(site.legal.pending);
