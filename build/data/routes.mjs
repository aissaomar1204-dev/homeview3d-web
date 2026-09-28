/* ═══════════════════════════════════════════════════════════════
   Route registry: SINGLE SOURCE OF TRUTH for page ids, templates,
   parents (breadcrumbs), URLs per language and sitemap priority.
   - `es` / `en`: path with leading and trailing slash, or null when
     that language version does not exist (no hreflang emitted then).
   - Content lives in build/content/<id>.mjs (see docs/build/CONTENT-SCHEMA.md).
   - Links in content use the page id: [texto](@servicio-plano).
   - `index: false` → noindex + excluded from sitemap/llms.
   ═══════════════════════════════════════════════════════════════ */

export const routes = [
  // ── Core ──────────────────────────────────────────────────────
  { id: 'home',              template: 'home',     parent: null,         es: '/',                                   en: '/en/',                                   priority: 1.0 },
  { id: 'servicios',         template: 'hub',      parent: 'home',       es: '/servicios/',                         en: '/en/services/',                          priority: 0.9 },
  { id: 'servicio-plano',    template: 'service',  parent: 'servicios',  es: '/servicios/plano-2d-a-3d/',           en: '/en/floor-plan-to-3d-model/',            priority: 0.9, pack: 'maqueta' },
  { id: 'servicio-renders',  template: 'service',  parent: 'servicios',  es: '/servicios/renders-inmobiliarios/',   en: '/en/real-estate-3d-rendering/',          priority: 0.9, pack: 'maqueta' },
  { id: 'servicio-tour',     template: 'service',  parent: 'servicios',  es: '/servicios/tour-virtual-3d/',         en: '/en/interactive-3d-floor-plans/',        priority: 0.9, pack: 'maqueta' },
  { id: 'servicio-ar',       template: 'service',  parent: 'servicios',  es: '/servicios/realidad-aumentada-inmobiliaria/', en: '/en/augmented-reality-real-estate/', priority: 0.9, pack: 'maqueta' },
  { id: 'servicio-staging',  template: 'service',  parent: 'servicios',  es: '/servicios/home-staging-virtual/',     en: '/en/virtual-staging/',                   priority: 0.8, pack: 'staging' },

  // ── Audiences ─────────────────────────────────────────────────
  { id: 'soluciones',        template: 'hub',      parent: 'home',       es: '/soluciones/',                        en: null,                                     priority: 0.7 },
  { id: 'sol-inmobiliarias', template: 'audience', parent: 'soluciones', es: '/soluciones/inmobiliarias/',           en: '/en/for-estate-agents/',                 priority: 0.8 },
  { id: 'sol-promotoras',    template: 'audience', parent: 'soluciones', es: '/soluciones/promotoras-obra-nueva/',   en: '/en/off-plan-3d-visualisation/',         priority: 0.8 },
  { id: 'sol-arquitectos',   template: 'audience', parent: 'soluciones', es: '/soluciones/arquitectos-interioristas/', en: null,                                  priority: 0.6 },
  { id: 'sol-vacacional',    template: 'audience', parent: 'soluciones', es: '/soluciones/alquiler-vacacional/',    en: null,                                     priority: 0.5 },

  // ── Proof, process, prices ────────────────────────────────────
  { id: 'caso-villa',        template: 'case',     parent: 'home',       es: '/casos/villa-costa-del-sol/',         en: '/en/case-studies/costa-del-sol-villa/',  priority: 0.9 },
  { id: 'como-funciona',     template: 'process',  parent: 'home',       es: '/como-funciona/',                     en: '/en/how-it-works/',                      priority: 0.8 },
  { id: 'precios',           template: 'pricing',  parent: 'home',       es: '/precios/',                           en: '/en/pricing/',                           priority: 0.9 },

  // ── Local ─────────────────────────────────────────────────────
  { id: 'zonas',             template: 'hub',      parent: 'home',       es: '/zonas/',                             en: null,                                     priority: 0.6 },
  { id: 'zona-marbella',     template: 'zone',     parent: 'zonas',      es: '/zonas/marbella/',                    en: '/en/3d-rendering-marbella/',             priority: 0.8 },
  { id: 'zona-malaga',       template: 'zone',     parent: 'zonas',      es: '/zonas/malaga/',                      en: null,                                     priority: 0.7 },
  { id: 'zona-costa-del-sol', template: 'zone',    parent: 'zonas',      es: '/zonas/costa-del-sol/',               en: null,                                     priority: 0.7 },

  // ── Guides ────────────────────────────────────────────────────
  { id: 'guias',             template: 'hub',      parent: 'home',       es: '/guias/',                             en: '/en/guides/',                            priority: 0.7 },
  { id: 'guia-precio-render', template: 'guide',   parent: 'guias',      es: '/guias/cuanto-cuesta-un-render-3d/',  en: '/en/guides/3d-rendering-cost-spain/',    priority: 0.8 },
  { id: 'guia-precio-plano', template: 'guide',    parent: 'guias',      es: '/guias/cuanto-cuesta-un-plano-3d/',   en: null,                                     priority: 0.7 },
  { id: 'guia-plano-2d-3d',  template: 'guide',    parent: 'guias',      es: '/guias/como-convertir-un-plano-2d-en-3d/', en: null,                                priority: 0.7 },
  { id: 'guia-ia-vs-3d',     template: 'guide',    parent: 'guias',      es: '/guias/ia-o-modelo-3d-real/',         en: '/en/guides/ai-floor-plan-to-3d/',        priority: 0.7 },
  { id: 'guia-sobre-plano',  template: 'guide',    parent: 'guias',      es: '/guias/como-vender-viviendas-sobre-plano/', en: null,                               priority: 0.7 },
  { id: 'guia-matterport',   template: 'guide',    parent: 'guias',      es: '/guias/modelo-3d-vs-matterport/',     en: '/en/guides/3d-model-vs-matterport/',     priority: 0.7 },
  { id: 'guia-ar',           template: 'guide',    parent: 'guias',      es: '/guias/ver-una-vivienda-en-realidad-aumentada/', en: '/en/guides/view-property-in-ar/', priority: 0.7 },

  // ── Reference ─────────────────────────────────────────────────
  { id: 'glosario',          template: 'glossary', parent: 'home',       es: '/glosario/',                          en: '/en/glossary/',                          priority: 0.6 },
  { id: 'faq',               template: 'faq',      parent: 'home',       es: '/preguntas-frecuentes/',              en: '/en/faq/',                               priority: 0.7 },
  { id: 'sobre-nosotros',    template: 'about',    parent: 'home',       es: '/sobre-nosotros/',                    en: '/en/about/',                             priority: 0.6 },
  { id: 'contacto',          template: 'contact',  parent: 'home',       es: '/contacto/',                          en: '/en/contact/',                           priority: 0.8 },

  // ── Utility (noindex) ─────────────────────────────────────────
  { id: 'gracias',           template: 'thanks',   parent: 'home',       es: '/gracias/',                           en: '/en/thanks/',                            index: false },
  { id: 'ar-villa',          template: 'ar',       parent: 'caso-villa', es: '/ar/villa/',                          en: '/en/ar/villa/',                          index: false },
  { id: 'embed-villa',       template: 'embed',    parent: null,         es: '/embed/villa/',                       en: '/en/embed/villa/',                       index: false },

  // ── Legal ─────────────────────────────────────────────────────
  { id: 'aviso-legal',       template: 'legal',    parent: 'home',       es: '/aviso-legal/',                       en: '/en/legal-notice/',                      priority: 0.2 },
  { id: 'privacidad',        template: 'legal',    parent: 'home',       es: '/politica-de-privacidad/',            en: '/en/privacy-policy/',                    priority: 0.2 },
  { id: 'cookies',           template: 'legal',    parent: 'home',       es: '/politica-de-cookies/',               en: '/en/cookie-policy/',                     priority: 0.2 },
];

// 301 redirects (Netlify). Keep truncated URLs from 404ing.
export const redirects = [
  { from: '/casos/', to: '/casos/villa-costa-del-sol/', status: 301 },
  { from: '/en/case-studies/', to: '/en/case-studies/costa-del-sol-villa/', status: 301 },
  { from: '/ar/', to: '/ar/villa/', status: 301 },
  { from: '/index.html', to: '/', status: 301 },
  { from: '/en/index.html', to: '/en/', status: 301 },
];

export const routeById = Object.fromEntries(routes.map((r) => [r.id, r]));
