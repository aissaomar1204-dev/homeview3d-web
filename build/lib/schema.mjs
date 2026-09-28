/* ═══════════════════════════════════════════════════════════════
   JSON-LD @graph per page (owner: GEO). BUILD-SPEC §9, 04-geo §6.
   schemaGraph(entry, ctx) → array of nodes for
     {"@context":"https://schema.org","@graph":[…]}
   schemaScript(entry, ctx) → the complete <script> tag, `<` escaped.

   Stable @ids:
     ${domain}/#organization   ProfessionalService (full on home/about/contact, stub elsewhere)
     ${domain}/#website        WebSite
     ${url}#webpage            WebPage subtype (AboutPage, ContactPage, FAQPage, CollectionPage…)
     ${url}#breadcrumb         BreadcrumbList
     ${url}#primaryimage       ImageObject (OG image)
     ${url}#service / #offer   Service + Offer (UnitPriceSpecification, VAT excluded)
     ${url}#catalog            OfferCatalog (pricing)
     ${url}#article / #model   Article + 3DModel (case), Article (guides)
     ${url}#howto              HowTo (process)
     ${url}#set / ${url}#<id>  DefinedTermSet / DefinedTerm (glossary)
     ${url}#faq                FAQPage wherever a FAQ is rendered (text = visible text)
   Only what is visible on the page; empty values are stripped.
   The entry may be partial (no html yet): the layout calls this while rendering <head>.
   ═══════════════════════════════════════════════════════════════ */
import { site } from '../data/site.mjs';
import { routes, routeById } from '../data/routes.mjs';
import { pricing, packById } from '../data/pricing.mjs';
import { villa } from '../data/villa.mjs';
import { process as proc } from '../data/process.mjs';
import { deliverables } from '../data/deliverables.mjs';
import { helpers, LOCALE, fmtMB, glossaryTerms } from './markdown.mjs';

const WD = (q) => `https://www.wikidata.org/wiki/${q}`;
export const ORG_ID = `${site.domain}/#organization`;
export const WEBSITE_ID = `${site.domain}/#website`;

const PLACES = {
  Marbella: { type: 'City', q: 'Q484799' },
  'Málaga': { type: 'City', q: 'Q8851' },
  'Costa del Sol': { type: 'Place', q: 'Q215254' },
  'España': { type: 'Country', q: 'Q29' },
  Spain: { type: 'Country', q: 'Q29' },
};
const place = (name) => { const p = PLACES[name]; return p ? { '@type': p.type, name, sameAs: WD(p.q) } : { '@type': 'Place', name }; };
const SPAIN = (lang) => place(lang === 'es' ? 'España' : 'Spain');

const KNOWS_ABOUT = [
  { q: 'Q254183', es: 'Realidad aumentada', en: 'Augmented reality' },
  { q: 'Q28135989', es: 'glTF', en: 'glTF' },
  { q: 'Q16911860', es: 'Renderizado 3D', en: '3D rendering' },
  { q: 'Q28401684', es: 'Home staging virtual', en: 'Virtual home staging' },
  { q: 'Q18965', es: 'Plano de planta', en: 'Floor plan' },
];
// Glossary term ids that map to a Wikidata item (only verified ids, 04-geo §6.1).
const TERM_WIKIDATA = {
  gltf: 'Q28135989', glb: 'Q28135989', 'gltf-glb': 'Q28135989',
  'realidad-aumentada': 'Q254183', ar: 'Q254183', 'augmented-reality': 'Q254183',
  render: 'Q16911860', renderizado: 'Q16911860', 'render-3d': 'Q16911860',
  'home-staging-virtual': 'Q28401684', 'virtual-staging': 'Q28401684', staging: 'Q28401684',
  plano: 'Q18965', 'plano-de-planta': 'Q18965', 'floor-plan': 'Q18965',
};

const SERVICE_TYPE = {
  'servicio-plano': { es: 'Modelado 3D de viviendas a partir de planos 2D', en: '3D modelling of homes from 2D floor plans' },
  'servicio-renders': { es: 'Renders 3D fotorrealistas para inmobiliarias', en: 'Photorealistic real estate 3D rendering' },
  'servicio-tour': { es: 'Visor 3D web interactivo para anuncios inmobiliarios', en: 'Interactive web 3D viewer for property listings' },
  'servicio-ar': { es: 'Realidad aumentada inmobiliaria sin app', en: 'App-free augmented reality for real estate' },
  'servicio-staging': { es: 'Home staging virtual', en: 'Virtual home staging' },
};
const GENERIC_SERVICE = { es: 'Visualización 3D inmobiliaria a partir de planos', en: 'Real estate 3D visualisation from floor plans' };
const AUDIENCE = {
  default: { es: 'Inmobiliarias, promotoras de obra nueva y arquitectos', en: 'Estate agents, property developers and architects' },
  'sol-inmobiliarias': { es: 'Agencias inmobiliarias', en: 'Estate agents' },
  'sol-promotoras': { es: 'Promotoras de obra nueva y venta sobre plano', en: 'Off-plan property developers' },
  'sol-arquitectos': { es: 'Arquitectos e interioristas', en: 'Architects and interior designers' },
  'sol-vacacional': { es: 'Propietarios y gestores de alquiler vacacional', en: 'Holiday rental owners and managers' },
};
const ZONE_PLACE = { 'zona-marbella': 'Marbella', 'zona-malaga': 'Málaga', 'zona-costa-del-sol': 'Costa del Sol' };
const SERVICE_IDS = Object.keys(SERVICE_TYPE);

const PAGE_TYPE = {
  hub: 'CollectionPage', faq: 'FAQPage', about: 'AboutPage', contact: 'ContactPage',
};
const FULL_ORG = new Set(['home', 'about', 'contact']);

/** Recursively drop null/undefined/''/[]/{} and NaN so no empty property ever reaches the page. */
export function clean(v) {
  if (Array.isArray(v)) { const a = v.map(clean).filter((x) => x !== undefined); return a.length ? a : undefined; }
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) { const c = clean(x); if (c !== undefined) o[k] = c; }
    return Object.keys(o).length ? o : undefined;
  }
  if (v === null || v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) return undefined;
  return v;
}

const ref = (id) => (id ? { '@id': id } : undefined);

/* ── Offers ───────────────────────────────────────────────────── */
function unitSpec(price, unitText, extra = {}) {
  return { '@type': 'UnitPriceSpecification', price, priceCurrency: pricing.currency, unitText, valueAddedTaxIncluded: false, ...extra };
}
/** Offer for a pack id or an extra id (e.g. route.pack 'staging' is an extra). `tiers` adds the tier specs. */
function offerFor(id, lang, h, { atId, tiers = false } = {}) {
  const pricesUrl = h.absHref('precios');
  const common = {
    '@type': 'Offer',
    '@id': atId,
    url: pricesUrl,
    priceCurrency: pricing.currency,
    availability: 'https://schema.org/InStock',
    priceValidUntil: pricing.priceValidUntil,
    eligibleRegion: { '@type': 'Country', name: 'ES' },
  };
  const pack = packById(id);
  if (pack) {
    const upTo = pack.tiers?.[0]?.maxM2;
    const unit = pack.unit[lang] + (upTo ? (lang === 'es' ? `, hasta ${upTo} m²` : `, up to ${upTo} m²`) : '');
    const specs = [unitSpec(pack.price, unit, pack.from ? { minPrice: pack.price } : {})];
    if (tiers && pack.tiers?.length > 1) {
      pack.tiers.slice(1).forEach((t, i) => {
        const prev = pack.tiers[i].maxM2;
        specs.push(unitSpec(t.price, `${pack.unit[lang]}, ${lang === 'es' ? `de ${prev} a ${t.maxM2} m²` : `${prev} to ${t.maxM2} m²`}`));
      });
    }
    return { ...common, name: pack.name[lang], description: pack.summary[lang], price: pack.price, priceSpecification: specs.length === 1 ? specs[0] : specs };
  }
  const x = pricing.extras.find((e) => e.id === id);
  if (x && x.price != null) {
    return { ...common, name: x.name[lang], price: x.price, priceSpecification: unitSpec(x.price, x.unit[lang]) };
  }
  return undefined;
}

/** True when the page text references the price of `packId` (so the Offer is visible on the page). */
function pageShowsPrice(page, packId) {
  const s = JSON.stringify(page || {});
  if (new RegExp(`\\{\\{(price|delivery):${packId}\\b`).test(s)) return true;
  if (packId === 'staging' && /\{\{extra:staging\}\}/.test(s)) return true;
  return (page?.blocks || []).some((b) => b.type === 'pricing' || b.type === 'calculator');
}

/* ── Organization / WebSite ───────────────────────────────────── */
function orgNode(entry, lang, h, full) {
  const stub = { '@type': 'ProfessionalService', '@id': ORG_ID, name: site.brand.name, url: `${site.domain}/` };
  if (!full) return stub;
  const catalog = h.absHref('precios');
  const legalOk = !site.legal.placeholder && site.brand.legalName && !/^\[/.test(site.brand.legalName);
  return {
    ...stub,
    legalName: legalOk ? site.brand.legalName : undefined,
    description: h.plain(site.entity[lang]),
    foundingDate: site.facts?.founded ? String(site.facts.founded) : undefined,
    logo: site.brand.logo ? { '@type': 'ImageObject', url: h.assetUrl(site.brand.logo) } : undefined,
    image: entry.image?.url,
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    address: { '@type': 'PostalAddress', addressLocality: site.base.locality, addressRegion: site.base.region, addressCountry: site.base.country },
    areaServed: (site.areaServed[lang] || site.areaServed.es).map(place),
    knowsAbout: [...KNOWS_ABOUT.map((k) => ({ '@type': 'Thing', name: k[lang], sameAs: WD(k.q) })), 'USDZ', 'Blender'],
    knowsLanguage: site.langs.map((l) => LOCALE[l]),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: lang === 'es' ? 'ventas' : 'sales',
      email: site.contact.email,
      telephone: site.contact.phoneE164,
      availableLanguage: site.langs.map((l) => LOCALE[l]),
      areaServed: 'ES',
      url: h.absHref('contacto'),
    },
    sameAs: site.sameAs?.length ? site.sameAs : undefined,
    hasOfferCatalog: catalog ? ref(`${catalog}#catalog`) : undefined,
    priceRange: '€€',
  };
}
function websiteNode(lang, h, entry) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${site.domain}/`,
    name: site.brand.name,
    inLanguage: site.langs.map((l) => LOCALE[l]),
    publisher: ref(ORG_ID),
  };
}

/* ── FAQ (plain text identical to what is rendered) ───────────── */
function faqItems(entry, h) {
  if (Array.isArray(entry.faq)) return entry.faq.filter((f) => f && f.q && f.a);
  const page = entry.page || {};
  const items = [];
  const groups = (page.blocks || []).filter((b) => b.type === 'faqGroups').flatMap((b) => b.groups || []);
  for (const g of groups) for (const f of g.items || []) items.push(f);
  for (const f of page.faq || []) items.push(f);
  return items.map((f) => ({ q: h.plain(f.q), a: h.plain(f.a) }));
}
const questions = (items) => items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }));

/* ── Main ─────────────────────────────────────────────────────── */
export function schemaGraph(entry, ctx = entry?.ctx) {
  const lang = entry.lang || ctx?.lang || site.defaultLang;
  const h = helpers(ctx, lang);
  const route = routeById[entry.id] || {};
  const template = entry.template || route.template || 'page';
  const page = entry.page || entry.doc?.[lang] || {};
  const doc = entry.doc || {};
  const url = entry.url || h.abs(entry.path || route[lang] || '/');
  const inLanguage = LOCALE[lang];
  const indexable = route.index !== false && template !== 'notfound';
  const datePublished = entry.datePublished || doc.datePublished;
  const dateModified = entry.dateModified || doc.dateModified;
  const h1 = entry.h1 || h.plain(page.h1 || '');
  const title = entry.title || h.plain(page.title || '');
  const description = entry.description || h.plain(page.description || '');
  const year = (datePublished || '').slice(0, 4) || String(new Date().getFullYear());

  const nodes = [];
  const fullOrg = FULL_ORG.has(template);
  nodes.push(orgNode(entry, lang, h, fullOrg));
  nodes.push(websiteNode(lang, h, entry));

  // Primary image
  const primaryId = entry.image?.url ? `${url}#primaryimage` : undefined;
  if (primaryId) {
    nodes.push({
      '@type': 'ImageObject', '@id': primaryId, contentUrl: entry.image.url,
      width: entry.image.width || 1200, height: entry.image.height || 630, caption: entry.image.alt,
      creator: ref(ORG_ID), creditText: site.brand.name, copyrightNotice: `© ${year} ${site.brand.name}`,
    });
  }

  // Breadcrumbs (not on home, not on bare/embed pages)
  const crumbs = (entry.breadcrumbs || []).filter((c) => c && c.name && c.path);
  const breadcrumbId = crumbs.length >= 2 && !['home', 'embed'].includes(template) ? `${url}#breadcrumb` : undefined; // embed: bare layout, no visible crumbs
  if (breadcrumbId) {
    nodes.push({
      '@type': 'BreadcrumbList', '@id': breadcrumbId,
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: h.plain(c.name), item: h.abs(c.path) })),
    });
  }

  // FAQ
  const faq = indexable ? faqItems(entry, h) : [];
  const faqAsPage = template === 'faq';
  const faqId = faq.length && !faqAsPage ? `${url}#faq` : undefined;

  // WebPage
  const webpage = {
    '@type': PAGE_TYPE[template] || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage,
    isPartOf: ref(WEBSITE_ID),
    about: fullOrg ? ref(ORG_ID) : undefined,
    primaryImageOfPage: ref(primaryId),
    datePublished,
    dateModified,
    breadcrumb: ref(breadcrumbId),
    speakable: indexable ? { '@type': 'SpeakableSpecification', cssSelector: ['.lead', '.cajetin'] } : undefined,
    hasPart: ref(faqId),
    mainEntity: fullOrg && template !== 'home' ? ref(ORG_ID) : undefined,
  };
  if (faqAsPage && faq.length) webpage.mainEntity = questions(faq);
  nodes.push(webpage);

  if (faqId) {
    nodes.push({ '@type': 'FAQPage', '@id': faqId, inLanguage, isPartOf: ref(`${url}#webpage`), mainEntity: questions(faq) });
  }

  if (!indexable) return finalize(nodes);

  // ── Template-specific nodes ──
  const serviceNode = (packId, extra = {}) => {
    const offer = packId ? offerFor(packId, lang, h, { atId: `${url}#offer` }) : undefined;
    return {
      '@type': 'Service', '@id': `${url}#service`, name: h1, url,
      serviceType: (SERVICE_TYPE[entry.id] || GENERIC_SERVICE)[lang],
      description,
      provider: ref(ORG_ID),
      areaServed: [SPAIN(lang), place('Costa del Sol')],
      audience: { '@type': 'BusinessAudience', audienceType: (AUDIENCE[entry.id] || AUDIENCE.default)[lang] },
      image: ref(primaryId),
      offers: offer,
      ...extra,
    };
  };

  switch (template) {
    case 'home': {
      const items = deliverables.map((d) => ({ d, u: h.absHref(d.page) })).filter((x) => x.u);
      if (items.length) {
        nodes.push({
          '@type': 'ItemList', '@id': `${url}#services`, name: lang === 'es' ? 'Servicios' : 'Services',
          itemListElement: items.map(({ d, u }, i) => ({ '@type': 'ListItem', position: i + 1, name: d[lang].title, url: u })),
        });
      }
      break;
    }
    case 'hub': {
      const kids = routes.filter((r) => r.parent === entry.id && r[lang] && r.index !== false);
      if (kids.length) {
        const listId = `${url}#list`;
        nodes.push({ '@type': 'ItemList', '@id': listId, itemListElement: kids.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: h.abs(r[lang]) })) });
        webpage.mainEntity = ref(listId);
      }
      break;
    }
    case 'service': {
      const packId = route.pack || 'maqueta';
      const related = SERVICE_IDS.filter((s) => s !== entry.id).map((s) => h.absHref(s)).filter(Boolean).map((u) => ref(`${u}#service`));
      nodes.push(serviceNode(pageShowsPrice(page, packId) ? packId : null, { isRelatedTo: related }));
      webpage.mainEntity = ref(`${url}#service`);
      break;
    }
    case 'audience': {
      const packId = route.pack || 'maqueta';
      nodes.push(serviceNode(pageShowsPrice(page, packId) ? packId : null));
      webpage.mainEntity = ref(`${url}#service`);
      break;
    }
    case 'zone': {
      const packId = route.pack || 'maqueta';
      const zp = ZONE_PLACE[entry.id];
      const s = serviceNode(pageShowsPrice(page, packId) ? packId : null);
      if (zp) { s.areaServed = place(zp); webpage.contentLocation = place(zp); }
      nodes.push(s);
      webpage.mainEntity = ref(`${url}#service`);
      break;
    }
    case 'case': {
      const articleId = `${url}#article`;
      const modelId = `${url}#model`;
      // Gallery renders: URL + caption only (creator/copyright are stated once on #primaryimage and by the
      // Article's author/publisher); the image sitemap lists every render as well. Keeps the graph small.
      const seenImg = new Set([entry.image?.url]);
      const renders = (entry.images || []).filter((im) => im?.url && !seenImg.has(im.url) && seenImg.add(im.url)).slice(0, 10)
        .map((im) => ({ '@type': 'ImageObject', contentUrl: im.url, caption: im.caption || im.alt }));
      nodes.push({
        '@type': 'Article', '@id': articleId, headline: h1, description,
        image: [ref(primaryId), ...renders],
        datePublished, dateModified, inLanguage,
        author: ref(ORG_ID), publisher: ref(ORG_ID),
        mainEntityOfPage: ref(`${url}#webpage`),
        about: ref(modelId),
        wordCount: entry.wordCount,
      });
      const f = villa.files;
      const enc = (k, fmt) => ({ '@type': 'MediaObject', name: f[k].label[lang], contentUrl: h.abs(f[k].url), encodingFormat: fmt, contentSize: fmtMB(f[k].bytes, lang) });
      const sp = villa.specs;
      const num = (n) => new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB').format(n);
      nodes.push({
        '@type': '3DModel', '@id': modelId,
        name: `${villa.name[lang]} (${villa.scope[lang]})`,
        description: lang === 'es'
          ? `Modelo 3D fotorrealista y amueblado reconstruido a partir de ${sp.input.es}: ${sp.rooms} estancias, ${sp.textures} texturas PBR procedurales, unos ${num(sp.interiorM2)} m² interiores y ${num(sp.terracesM2)} m² de terrazas (medidas estimadas a partir de la escala del plano).`
          : `Photorealistic, furnished 3D model rebuilt from ${sp.input.en}: ${sp.rooms} rooms, ${sp.textures} procedural PBR textures, about ${num(sp.interiorM2)} m² indoors and ${num(sp.terracesM2)} m² of terraces (areas estimated from the plan's scale).`,
        url: h.absHref('caso-villa', 'visor') || url,
        encoding: [enc('glb', 'model/gltf-binary'), enc('usdzMesa', 'model/vnd.usdz+zip'), enc('usdzReal', 'model/vnd.usdz+zip'), enc('glbArMesa', 'model/gltf-binary'), enc('glbAr', 'model/gltf-binary')],
        thumbnailUrl: entry.image?.url,
        creator: ref(ORG_ID), copyrightHolder: ref(ORG_ID),
        dateCreated: datePublished,
        contentLocation: place('Costa del Sol'),
        isPartOf: ref(articleId),
      });
      webpage.mainEntity = ref(articleId);
      break;
    }
    case 'guide': {
      const articleId = `${url}#article`;
      const citations = [];
      for (const b of page.blocks || []) {
        if (b.type === 'sources') for (const s of b.items || []) citations.push({ '@type': 'CreativeWork', name: h.plain(s.label), url: s.url });
        if (b.type === 'stat' && b.source?.url) citations.push({ '@type': 'CreativeWork', name: h.plain(b.source.label), url: b.source.url });
        if (b.type === 'table') for (const s of b.sources || []) citations.push({ '@type': 'CreativeWork', name: h.plain(s.label), url: s.url });
      }
      const seen = new Set();
      const uniq = citations.filter((c) => (seen.has(c.url) ? false : seen.add(c.url)));
      const about = (page.related || []).filter((id) => routeById[id]?.template === 'service').map((id) => h.absHref(id)).filter(Boolean).map((u) => ref(`${u}#service`));
      nodes.push({
        '@type': 'Article', '@id': articleId, headline: h1, description,
        image: entry.image?.url ? [entry.image.url] : undefined,
        datePublished, dateModified, inLanguage,
        author: ref(ORG_ID), publisher: ref(ORG_ID),
        mainEntityOfPage: ref(`${url}#webpage`),
        citation: uniq, about, wordCount: entry.wordCount,
      });
      webpage.mainEntity = ref(articleId);
      break;
    }
    case 'process': {
      const howtoId = `${url}#howto`;
      nodes.push({
        '@type': 'HowTo', '@id': howtoId, name: h1, description, inLanguage,
        totalTime: `P${proc.totalDays.max}D`,
        image: ref(primaryId),
        tool: (site.facts?.tools || ['Blender 5', 'Python', 'Cycles']).map((t) => ({ '@type': 'HowToTool', name: t })),
        supply: proc.needs[lang].map((n) => ({ '@type': 'HowToSupply', name: n })),
        step: proc.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s[lang].title, text: s[lang].body })),
      });
      webpage.mainEntity = ref(howtoId);
      break;
    }
    case 'pricing': {
      const catalogId = `${url}#catalog`;
      const brand = site.brand.name;
      // Compact offers (the catalog repeats ~10 of them: keep the JSON-LD near the 8 KB budget).
      const slim = (o, itemOffered) => ({ '@type': 'Offer', name: o.name, price: o.price, priceCurrency: o.priceCurrency, priceSpecification: o.priceSpecification, itemOffered });
      const items = pricing.packs.map((p) => slim(offerFor(p.id, lang, h, { tiers: true }), { '@type': 'Service', name: p.name[lang], description: p.summary[lang] }));
      for (const x of pricing.extras.filter((e) => e.price != null)) items.push(slim(offerFor(x.id, lang, h), { '@type': 'Service', name: x.name[lang] }));
      const v = pricing.volume;
      items.push({
        '@type': 'Offer', name: v.name[lang], description: v.note[lang], price: v.price, priceCurrency: pricing.currency,
        priceSpecification: unitSpec(v.price, lang === 'es' ? `${v.units} viviendas` : `${v.units} homes`),
        eligibleQuantity: { '@type': 'QuantitativeValue', value: v.units },
        itemOffered: { '@type': 'Service', name: packById(v.packId).name[lang] },
      });
      nodes.push({
        '@type': 'OfferCatalog', '@id': catalogId, url,
        name: lang === 'es' ? `Precios de ${brand}` : `${brand} pricing`,
        description: lang === 'es' ? `Precios sin IVA, válidos hasta ${pricing.priceValidUntil}.` : `Prices excluding VAT, valid until ${pricing.priceValidUntil}.`,
        provider: ref(ORG_ID),
        itemListElement: items,
      });
      webpage.mainEntity = ref(catalogId);
      break;
    }
    case 'glossary': {
      const terms = glossaryTerms().filter((t) => t[lang]);
      if (terms.length) {
        const setId = `${url}#set`;
        nodes.push({
          '@type': 'DefinedTermSet', '@id': setId, name: h1, url, inLanguage,
          hasDefinedTerm: terms.map((t) => ({
            '@type': 'DefinedTerm', '@id': `${url}#${t.id}`, name: t[lang].term, description: h.plain(t[lang].definition),
            url: `${url}#${t.id}`, inDefinedTermSet: ref(setId), sameAs: TERM_WIKIDATA[t.id] ? WD(TERM_WIKIDATA[t.id]) : undefined,
          })),
        });
        webpage.mainEntity = ref(setId);
      }
      break;
    }
    default: break;
  }
  return finalize(nodes);
}

function finalize(nodes) {
  return nodes.map(clean).filter(Boolean);
}

/** Full `<script type="application/ld+json">` tag (the `<` of any string is escaped). */
export function schemaScript(entry, ctx = entry?.ctx) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph(entry, ctx) }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}
