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
     ${url}#video              VideoObject for each `video` block (+ Article/WebPage `video`)
     ${url}#list               ItemList (hubs; guides: a `table` block with `itemList: true`)
     ${aboutUrl}#founder       Person (only when site.founder is filled): about page, Article author
   Only what is visible on the page; empty values are stripped.
   The entry may be partial (no html yet): the layout calls this while rendering <head>.
   ═══════════════════════════════════════════════════════════════ */
import { site } from '../data/site.mjs';
import { routes, routeById } from '../data/routes.mjs';
import { pricing, packById } from '../data/pricing.mjs';
import { villa } from '../data/villa.mjs';
import { process as proc } from '../data/process.mjs';
import { deliverables } from '../data/deliverables.mjs';
import { slugify } from './md.mjs';
import { helpers, LOCALE, fmtMB, glossaryTerms, imageManifest, videoManifest, blocksToMarkdown, stripMd, countWords, directContact } from './markdown.mjs';

const WD = (q) => `https://www.wikidata.org/wiki/${q}`;
export const ORG_ID = `${site.domain}/#organization`;
export const WEBSITE_ID = `${site.domain}/#website`;
/** The founder (a real person, 04-geo §9): null until site.founder is filled in. */
export const founder = () => (site.founder && site.founder.name && !site.founder.placeholder ? site.founder : null);
const ABOUT_ID = 'sobre-nosotros';
/** One @id for the founder in both languages (the default-language about page). */
export const FOUNDER_ID = routeById[ABOUT_ID] ? `${site.domain}${routeById[ABOUT_ID][site.defaultLang]}#founder` : `${site.domain}/#founder`;

const PLACES = {
  Marbella: { type: 'City', q: 'Q484799' },
  'Málaga': { type: 'City', q: 'Q8851' },
  'Costa del Sol': { type: 'Place', q: 'Q215254' },
  'España': { type: 'Country', q: 'Q29' },
  Spain: { type: 'Country', q: 'Q29' },
};
const place = (name) => { const p = PLACES[name]; return p ? { '@type': p.type, name, sameAs: WD(p.q) } : { '@type': 'Place', name }; };
const SPAIN = (lang) => place(lang === 'es' ? 'España' : 'Spain');

// Wikidata ids verified against wikidata.org (labels checked 2026-09-28).
const KNOWS_ABOUT = [
  { q: 'Q254183', es: 'Realidad aumentada', en: 'Augmented reality' },
  { q: 'Q28135989', es: 'glTF', en: 'glTF' },
  { q: 'Q54809843', es: 'USDZ', en: 'USDZ' },
  { q: 'Q16911860', es: 'Renderizado 3D', en: '3D rendering' },
  { q: 'Q28401684', es: 'Home staging virtual', en: 'Virtual home staging' },
  { q: 'Q18965', es: 'Plano de planta', en: 'Floor plan' },
  { q: 'Q173136', es: 'Blender', en: 'Blender' },
];
// Glossary term ids that map to a Wikidata item (only verified ids, 04-geo §6.1).
const TERM_WIKIDATA = {
  gltf: 'Q28135989', glb: 'Q28135989', 'gltf-glb': 'Q28135989',
  usdz: 'Q54809843',
  'realidad-aumentada': 'Q254183', ar: 'Q254183', 'augmented-reality': 'Q254183',
  render: 'Q16911860', renderizado: 'Q16911860', 'render-3d': 'Q16911860',
  'home-staging-virtual': 'Q28401684', 'virtual-staging': 'Q28401684', staging: 'Q28401684',
  plano: 'Q18965', 'plano-2d': 'Q18965', 'plano-de-planta': 'Q18965', 'floor-plan': 'Q18965',
  blender: 'Q173136',
  'gemelo-digital': 'Q25099680',
};
/**
 * Pricing packs / extras → the page whose Service node sells them (OfferCatalog itemOffered, 04-geo §6.3).
 * maqueta → the floor-plan service (the pack that page prices), promocion → the developers' page.
 */
const PACK_SERVICE_PAGE = {
  plano3d: 'servicio-plano', maqueta: 'servicio-plano', promocion: 'sol-promotoras',
  staging: 'servicio-staging', render: 'servicio-renders',
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
        // «de 151 a 300 m²» / "151 to 300 m²": a 150 m² home belongs to the first band only (content audit F-33/F-38).
        specs.push(unitSpec(t.price, `${pack.unit[lang]}, ${lang === 'es' ? `de ${prev + 1} a ${t.maxM2} m²` : `${prev + 1} to ${t.maxM2} m²`}`));
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
  if (!packById(packId) && new RegExp(`\\{\\{extra:${packId}\\}\\}`).test(s)) return true;
  return (page?.blocks || []).some((b) => b.type === 'pricing' || b.type === 'calculator');
}
const firstPriceToken = (s) => (String(s || '').match(/\{\{(?:price|extra):([\w-]+)[:}]/) || [])[1] || null;
/**
 * The page's headline ("desde / from") pack: route.pack, else the pack priced in the meta description,
 * else in the lead. Its Offer comes first and is the lowest price the description quotes.
 */
export function primaryPack(route, page) {
  return route?.pack || firstPriceToken(page?.description) || firstPriceToken(page?.lead) || 'maqueta';
}
/**
 * Service.offers (G-02): one Offer per pack the page's answer-first summary prices (meta description +
 * lead), headline pack first. Packs only priced further down (e.g. the 149 € floor plan in a table of an
 * agents page whose headline is «desde 490 €») stay out, so the lowest Offer is always the «desde /
 * from» figure of the description (build/check.mjs checks it) and every Offer price is visible.
 * Service pages only list packs that include that service (pricing.packs[].services).
 * One offer → a single object, several → an array.
 */
function serviceOffers(entry, route, page, lang, h, url, template) {
  const primary = primaryPack(route, page);
  const s = `${page?.description || ''} ${page?.lead || ''}`;
  const priced = (id) => new RegExp(`\\{\\{price:${id}[:}]`).test(s);
  const ids = [];
  if (pageShowsPrice(page, primary)) ids.push(primary);
  for (const p of pricing.packs) {
    if (ids.includes(p.id) || !priced(p.id)) continue;
    if (template === 'service' && !(p.services || []).includes(entry.id)) continue;
    ids.push(p.id);
  }
  const offers = ids.map((id, i) => offerFor(id, lang, h, { atId: i === 0 ? `${url}#offer` : `${url}#offer-${id}` })).filter(Boolean);
  return offers.length > 1 ? offers : offers[0];
}

/* ── Organization / WebSite ───────────────────────────────────── */
function orgNode(entry, lang, h, full) {
  const stub = { '@type': 'ProfessionalService', '@id': ORG_ID, name: site.brand.name, url: `${site.domain}/` };
  if (!full) return stub;
  const catalog = h.absHref('precios');
  const legalOk = !site.legal.placeholder && site.brand.legalName && !/^\[/.test(site.brand.legalName);
  // Logo: public/assets/brand/logo-512.png (scripts/brand.mjs): the symbol on the paper colour, 512 x 512, crawlable.
  const logo = site.brand.logo ? h.assetUrl(site.brand.logo) : undefined;
  const f = founder();
  return {
    ...stub,
    legalName: legalOk ? site.brand.legalName : undefined,
    description: h.plain(site.entity[lang]),
    foundingDate: site.facts?.founded ? String(site.facts.founded) : undefined,
    founder: f ? ref(FOUNDER_ID) : undefined,
    logo: logo ? { '@type': 'ImageObject', '@id': `${site.domain}/#logo`, url: logo, contentUrl: logo, width: 512, height: 512, caption: site.brand.name } : undefined,
    // One fixed image for the global entity on every page (the logo once it exists, the OG render until then).
    image: logo || entityImage(h),
    email: site.contact.email,
    telephone: directContact() ? site.contact.phoneE164 : undefined, // no placeholder number (V-02)
    address: { '@type': 'PostalAddress', addressLocality: site.base.locality, addressRegion: site.base.region, addressCountry: site.base.country },
    areaServed: (site.areaServed[lang] || site.areaServed.es).map(place),
    knowsAbout: KNOWS_ABOUT.map((k) => ({ '@type': 'Thing', name: k[lang], sameAs: WD(k.q) })),
    knowsLanguage: site.langs.map((l) => LOCALE[l]),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales', // schema.org examples and Google use English values in every language
      email: site.contact.email,
      telephone: directContact() ? site.contact.phoneE164 : undefined,
      availableLanguage: site.langs.map((l) => LOCALE[l]),
      areaServed: 'ES',
      url: h.absHref('contacto'),
    },
    sameAs: site.sameAs?.length ? site.sameAs : undefined,
    hasOfferCatalog: catalog ? ref(`${catalog}#catalog`) : undefined,
    priceRange: '€€',
  };
}
/** Full WebSite where the full Organization is (home, about, contact); elsewhere a stub that pages reference. */
function websiteNode(lang, h, full) {
  const stub = { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${site.domain}/`, name: site.brand.name };
  if (!full) return stub;
  return { ...stub, inLanguage: site.langs.map((l) => LOCALE[l]), publisher: ref(ORG_ID) };
}
/** Absolute URL of the site-wide OG render (build/generated/images.json og_image.og), or undefined. */
function entityImage(h) {
  const og = imageManifest().og_image?.og;
  return og ? h.assetUrl(og) : undefined;
}

/* ── Founder (Person) ─────────────────────────────────────────── */
/** Full Person node (about page) or a compact one (Article author). null while site.founder is empty. */
function personNode(lang, h, full) {
  const f = founder();
  if (!f) return null;
  const about = h.absHref(ABOUT_ID);
  const base = { '@type': 'Person', '@id': FOUNDER_ID, name: f.name, url: about || undefined };
  if (!full) return base;
  return {
    ...base,
    jobTitle: typeof f.jobTitle === 'object' ? f.jobTitle[lang] : f.jobTitle,
    image: f.image ? h.assetUrl(f.image) : undefined,
    sameAs: f.sameAs?.length ? f.sameAs : undefined,
    worksFor: ref(ORG_ID),
    knowsLanguage: site.langs.map((l) => LOCALE[l]),
  };
}
/** Article author: the founder once there is one, the organisation until then. */
const authorOf = (lang, h) => personNode(lang, h, false) || ref(ORG_ID);

/* ── Image licence (Google Images "Licensable", 04-geo §6.4) ──── */
/**
 * license → the intellectual-property section of the legal notice (anchor = the engine's heading slug),
 * acquireLicensePage → contact. Undefined when the legal page is not built.
 */
function imageRights(lang, h) {
  const legal = h.absHref('aviso-legal');
  if (!legal) return {};
  let anchor = '';
  try {
    const blocks = h.ctx?.docs?.get?.('aviso-legal')?.[lang]?.blocks || [];
    const b = blocks.find((x) => /propiedad intelectual|intellectual property/i.test(x.h2 || ''));
    if (b) anchor = `#${slugify(h.plain(b.h2))}`;
  } catch { /* no docs in this ctx: page URL only */ }
  return { license: `${legal}${anchor}`, acquireLicensePage: h.absHref('contacto') || undefined };
}

/* ── Video (build/generated/videos.json, `video` block) ───────── */
/**
 * Lean VideoObject (8 KB JSON-LD budget): name (the block heading), description (the caption, or the intro
 * when there is no caption), thumbnailUrl, contentUrl (MP4), uploadDate, duration. The video sitemap
 * (machine.mjs pageVideos) carries the longer description.
 */
function videoNodes(page, lang, h, url, datePublished) {
  const blocks = (page.blocks || []).filter((b) => b.type === 'video' && b.video);
  const man = videoManifest();
  return blocks.map((b, i) => {
    const v = man[b.video];
    if (!v) return null;
    const mp4 = (v.sources || []).find((s) => /mp4/.test(s.type || s.src)) || (v.sources || [])[0];
    const caption = h.plain(b.caption || '');
    return {
      '@type': 'VideoObject', '@id': `${url}#video${i ? `-${i + 1}` : ''}`,
      name: h.plain(b.h2 || '') || caption,
      description: caption || h.plain(b.intro || '') || undefined,
      thumbnailUrl: h.assetUrl(v.posterJpg || v.poster),
      contentUrl: mp4 ? h.assetUrl(mp4.src) : undefined,
      uploadDate: datePublished,
      duration: v.duration ? `PT${Math.round(v.duration)}S` : undefined,
    };
  }).filter(Boolean);
}

/* ── Article word count (G-01) ────────────────────────────────── */
/**
 * The engine fills entry.wordCount only after the page is rendered (after this graph is built), so the
 * count comes from the Markdown mirror of the same content: lead, key facts, blocks and FAQ, without
 * the header lines, URLs and the contact block. Undefined (never 0) when it cannot be computed.
 */
function articleWordCount(entry, ctx) {
  if (entry.wordCount > 0) return entry.wordCount;
  try {
    const md = blocksToMarkdown(entry, ctx);
    const body = md.split(/\n## (?:Contacto|Contact)\s*\n/)[0]
      .split('\n').filter((l) => !/^(URL canónica|Canonical URL|Idioma|Language|English|Español):/.test(l)).join('\n')
      .replace(/\]\([^)\s]*\)/g, ']').replace(/https?:\/\/\S+/g, ' ');
    const n = countWords(stripMd(body));
    return n > 0 ? n : undefined;
  } catch { return undefined; }
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
  nodes.push(websiteNode(lang, h, fullOrg));

  // Primary image
  const primaryId = entry.image?.url ? `${url}#primaryimage` : undefined;
  const rights = indexable ? imageRights(lang, h) : {};
  if (primaryId) {
    nodes.push({
      '@type': 'ImageObject', '@id': primaryId, contentUrl: entry.image.url,
      width: entry.image.width || 1200, height: entry.image.height || 630, caption: entry.image.alt,
      creator: ref(ORG_ID), creditText: site.brand.name, copyrightNotice: `© ${year} ${site.brand.name}`,
      license: rights.license, acquireLicensePage: rights.acquireLicensePage,
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

  // Speakable: only selectors the page really renders (legal pages have neither a lead block nor a cajetín).
  const facts = entry.facts?.length ? entry.facts : page.facts;
  const speakSel = template === 'legal' ? [] : ['.lead', ...(facts?.length ? ['.cajetin'] : [])];

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
    speakable: indexable && speakSel.length ? { '@type': 'SpeakableSpecification', cssSelector: speakSel } : undefined,
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
  const serviceNode = (extra = {}) => ({
    '@type': 'Service', '@id': `${url}#service`, name: h1, url,
    serviceType: (SERVICE_TYPE[entry.id] || GENERIC_SERVICE)[lang],
    description,
    provider: ref(ORG_ID),
    areaServed: [SPAIN(lang), place('Costa del Sol')],
    audience: { '@type': 'BusinessAudience', audienceType: (AUDIENCE[entry.id] || AUDIENCE.default)[lang] },
    image: ref(primaryId),
    offers: serviceOffers(entry, route, page, lang, h, url, template),
    ...extra,
  });
  // Videos (`video` blocks): one VideoObject each, referenced from the Article (case, guides) or the WebPage.
  const videos = videoNodes(page, lang, h, url, datePublished || dateModified);
  const videoRefs = videos.map((v) => ref(v['@id']));
  let videoOwner = webpage;

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
      // Child pages actually built in this language (a route whose content is still missing is left out).
      const kids = routes.filter((r) => r.parent === entry.id && r[lang] && r.index !== false).map((r) => h.absHref(r.id)).filter(Boolean);
      if (kids.length) {
        const listId = `${url}#list`;
        nodes.push({ '@type': 'ItemList', '@id': listId, itemListElement: kids.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: u })) });
        webpage.mainEntity = ref(listId);
      }
      break;
    }
    case 'service': {
      const related = SERVICE_IDS.filter((s) => s !== entry.id).map((s) => h.absHref(s)).filter(Boolean).map((u) => ref(`${u}#service`));
      nodes.push(serviceNode({ isRelatedTo: related }));
      webpage.mainEntity = ref(`${url}#service`);
      break;
    }
    case 'audience': {
      nodes.push(serviceNode());
      webpage.mainEntity = ref(`${url}#service`);
      break;
    }
    case 'zone': {
      const zp = ZONE_PLACE[entry.id];
      const s = serviceNode();
      if (zp) { s.areaServed = place(zp); webpage.contentLocation = place(zp); }
      nodes.push(s);
      webpage.mainEntity = ref(`${url}#service`);
      break;
    }
    case 'about': {
      const person = personNode(lang, h, true);
      if (person) nodes.push(person);
      break;
    }
    case 'case': {
      const articleId = `${url}#article`;
      const modelId = `${url}#model`;
      // Renders (8 KB budget without the FAQ, BUILD-SPEC §11): #primaryimage by @id (it carries creator,
      // credit, copyright and acquireLicensePage once) + up to CASE_RENDERS other renders in page order, each
      // with URL, caption and `license` (enough for the Licensable badge). One entry per render: variants of
      // the same image (villa_maqueta_iso = the primary's villa_maqueta_iso_opaco, *_mobile crops) are skipped.
      // The image sitemap still lists every image of the page.
      const renders = caseRenders(entry).map((im) => ({ '@type': 'ImageObject', contentUrl: im.url, caption: im.caption || im.alt, license: rights.license }));
      const article = {
        '@type': 'Article', '@id': articleId, headline: h1, // description: on the WebPage (mainEntity → this Article)
        image: [ref(primaryId), ...renders],
        datePublished, dateModified, inLanguage,
        author: authorOf(lang, h), publisher: ref(ORG_ID),
        about: ref(modelId),
        wordCount: articleWordCount(entry, ctx),
      };
      nodes.push(article);
      videoOwner = article;
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
        image: ref(primaryId),
        copyrightHolder: ref(ORG_ID), // creator: the Article author/publisher
        dateCreated: datePublished,
        contentLocation: place('Costa del Sol'), // the Article links here with `about` (no isPartOf back: same edge)
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
      // Ranked / comparison lists ("best studios", 04-geo §8.2): a `table` block with `itemList: true`
      // becomes an ItemList, one ListItem per row (name = first cell, url = its first https link).
      const lists = (page.blocks || []).filter((b) => b.type === 'table' && b.itemList && Array.isArray(b.rows) && b.rows.length);
      const listIds = lists.map((b, li) => {
        const id = `${url}#list${li ? `-${li + 1}` : ''}`;
        nodes.push({
          '@type': 'ItemList', '@id': id, name: h.plain(b.caption || b.h2 || ''), numberOfItems: b.rows.length,
          itemListElement: b.rows.map((row, i) => {
            const cell = String(row[0] ?? '');
            // First link of the first cell: external https, or an internal [text](@id) resolved to its absolute URL.
            const link = (h.inline(cell).match(/\]\((https:\/\/[^)\s]+)\)/) || [])[1];
            return { '@type': 'ListItem', position: i + 1, name: h.plain(cell), url: link };
          }),
        });
        return ref(id);
      });
      const article = {
        '@type': 'Article', '@id': articleId, headline: h1, description,
        image: entry.image?.url ? [entry.image.url] : undefined,
        datePublished, dateModified, inLanguage,
        author: authorOf(lang, h), publisher: ref(ORG_ID),
        citation: uniq, about, hasPart: listIds.length ? listIds : undefined, wordCount: articleWordCount(entry, ctx),
      };
      nodes.push(article);
      videoOwner = article;
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
      // itemOffered → the Service node of the page that sells the pack (G-10), anonymous Service otherwise.
      const offered = (id, name, desc) => {
        const u = PACK_SERVICE_PAGE[id] ? h.absHref(PACK_SERVICE_PAGE[id]) : null;
        return u ? ref(`${u}#service`) : { '@type': 'Service', name, description: desc };
      };
      // Compact offers (the catalog repeats ~10 of them: keep the JSON-LD near the 8 KB budget).
      const slim = (o, itemOffered) => ({ '@type': 'Offer', name: o.name, price: o.price, priceCurrency: o.priceCurrency, priceSpecification: o.priceSpecification, itemOffered });
      const items = pricing.packs.map((p) => slim(offerFor(p.id, lang, h, { tiers: true }), offered(p.id, p.name[lang], p.summary[lang])));
      for (const x of pricing.extras.filter((e) => e.price != null)) items.push(slim(offerFor(x.id, lang, h), offered(x.id, x.name[lang])));
      const v = pricing.volume;
      items.push({
        '@type': 'Offer', name: v.name[lang], description: v.note[lang], price: v.price, priceCurrency: pricing.currency,
        priceSpecification: unitSpec(v.price, lang === 'es' ? `${v.units} viviendas` : `${v.units} homes`),
        eligibleQuantity: { '@type': 'QuantitativeValue', value: v.units },
        itemOffered: offered(v.packId, packById(v.packId).name[lang]),
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
        // Terms carry only @id (= the visible anchor URL), name, description and Wikidata sameAs:
        // `url` would repeat the @id and `inDefinedTermSet` is implied by hasDefinedTerm.
        nodes.push({
          '@type': 'DefinedTermSet', '@id': setId, name: h1, url, inLanguage,
          hasDefinedTerm: terms.map((t) => ({
            '@type': 'DefinedTerm', '@id': `${url}#${t.id}`, name: t[lang].term, description: h.plain(t[lang].definition),
            sameAs: TERM_WIKIDATA[t.id] ? WD(TERM_WIKIDATA[t.id]) : undefined,
          })),
        });
        webpage.mainEntity = ref(setId);
      }
      break;
    }
    default: break;
  }
  if (videos.length) {
    nodes.push(...videos);
    videoOwner.video = videoRefs.length === 1 ? videoRefs[0] : videoRefs;
  }
  return finalize(nodes);
}

/** Renders listed by the case Article besides #primaryimage (see the `case` branch). */
export const CASE_RENDERS = 6;
const imageBase = (name) => String(name || '').replace(/_(opaco|mobile)$/, '');
export function caseRenders(entry) {
  const seenUrl = new Set([entry.image?.url].filter(Boolean));
  const seenBase = new Set([imageBase(entry.image?.name)].filter(Boolean));
  // An art-directed crop (…_mobile) gives way to its full image when the page has both, whatever the order.
  const names = new Set((entry.images || []).map((im) => im?.name).filter(Boolean));
  const isCrop = (im) => /_mobile$/.test(im.name || '') && names.has(im.name.replace(/_mobile$/, ''));
  const out = [];
  for (const im of entry.images || []) {
    if (!im?.url || seenUrl.has(im.url) || isCrop(im)) continue;
    const base = im.name ? imageBase(im.name) : null;
    if (base && seenBase.has(base)) continue;
    seenUrl.add(im.url);
    if (base) seenBase.add(base);
    out.push(im);
    if (out.length === CASE_RENDERS) break;
  }
  return out;
}

function finalize(nodes) {
  return nodes.map(clean).filter(Boolean);
}

/** Full `<script type="application/ld+json">` tag (the `<` of any string is escaped). */
export function schemaScript(entry, ctx = entry?.ctx) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph(entry, ctx) }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}
