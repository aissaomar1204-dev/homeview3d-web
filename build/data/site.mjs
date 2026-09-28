/* ═══════════════════════════════════════════════════════════════
   Site configuration: the ONLY place for brand, domain and contact.
   Everything marked `placeholder: true` must be replaced before launch.
   While any placeholder remains, every page is rendered `noindex`
   and the build prints a warning (see build/check.mjs).
   ═══════════════════════════════════════════════════════════════ */

export const site = {
  // Brand (no name or logo yet). Content files use the {{brand}} token, never a literal name.
  brand: {
    name: 'Estudio 3D',          // placeholder wordmark shown in the header and titles
    legalName: '[RAZÓN SOCIAL]',
    placeholder: true,
    logo: null,                  // path to an SVG/PNG in public/ once it exists; null = text wordmark
  },

  // Canonical origin, no trailing slash. `.example` is reserved: safe placeholder.
  domain: 'https://www.estudio3d.example',
  domainPlaceholder: true,

  langs: ['es', 'en'],
  defaultLang: 'es',             // Spanish at the root, English under /en/
  xDefault: 'en',                // hreflang x-default points to the English twin when it exists
  locale: { es: 'es_ES', en: 'en_GB' },

  // Contact (placeholders). WhatsApp in international format without "+".
  contact: {
    email: 'hola@estudio3d.example',
    phoneE164: '+34600000000',
    phoneDisplay: '+34 600 000 000',
    whatsapp: '34600000000',
    booking: null,               // e.g. a Cal.com 15-min link; null hides the option
    placeholder: true,
  },

  // Where the studio is based / serves (service-area business, no public address yet).
  base: { locality: 'Marbella', region: 'Málaga', country: 'ES', placeholderAddress: true },
  areaServed: {
    es: ['Marbella', 'Málaga', 'Costa del Sol', 'España'],
    en: ['Marbella', 'Málaga', 'Costa del Sol', 'Spain'],
  },

  // One canonical entity sentence, identical everywhere (site, llms.txt, directories, profiles).
  entity: {
    es: '{{brand}} es un estudio de visualización 3D en la Costa del Sol que convierte el plano 2D de una vivienda en un modelo 3D fotorrealista y amueblado, con renders, visor web interactivo y realidad aumentada sin app, para inmobiliarias, promotoras y arquitectos de toda España.',
    en: '{{brand}} is a 3D visualisation studio on the Costa del Sol that turns a home\'s 2D floor plan into a photorealistic, furnished 3D model, with renders, an interactive web viewer and app-free augmented reality, for estate agents, developers and architects across Spain.',
  },

  // Legal data for aviso legal / privacidad (LSSI-CE art. 10). Placeholders block launch.
  legal: {
    razonSocial: '[RAZÓN SOCIAL]',
    nif: '[NIF]',
    domicilio: '[DOMICILIO]',
    registro: '[DATOS REGISTRALES, si aplica]',
    email: 'hola@estudio3d.example',
    placeholder: true,
  },

  // Off-site profiles for Organization.sameAs (fill as they are created).
  sameAs: [],

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

/** True while any launch-blocking placeholder remains. */
export const hasPlaceholders = () =>
  site.brand.placeholder || site.domainPlaceholder || site.contact.placeholder || site.legal.placeholder;
