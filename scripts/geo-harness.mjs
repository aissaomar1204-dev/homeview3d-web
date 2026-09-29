#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   GEO harness (owner: GEO): exercises build/lib/{schema,markdown,machine}.mjs
   and build/check.mjs WITHOUT the engine, using fake registry entries.
     node scripts/geo-harness.mjs [outDir]      (default: <tmp>/geo-harness-dist)
     node scripts/geo-harness.mjs --live <url>  HTTP smoke test of a deploy (see liveChecks below)
   1. builds fake content docs + a fake ctx that follows BUILD-SPEC §3
   2. unit-asserts schemaGraph() and blocksToMarkdown() outputs
   3. writes a tiny fake dist (HTML from the Markdown mirror) and runs
      writeMachineOutputs(), then build/check.mjs --no-lint on it.
   Exit 1 when a unit assertion fails (the check result is printed only).
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { site } from '../build/data/site.mjs';
import { routes, routeById } from '../build/data/routes.mjs';
import { schemaGraph, schemaScript, CASE_RENDERS } from '../build/lib/schema.mjs';
import { blocksToMarkdown, resolveTokensFallback, stripMd, imageManifest, fmtMB, fmtNumber } from '../build/lib/markdown.mjs';
import { writeMachineOutputs, robotsTxt, buildCsp, BUDGETS } from '../build/lib/machine.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ── --live <base-url>: HTTP smoke test of a real deploy (Netlify deploy preview or production) ──
   Checks what only the host can prove (audit G-13): trailing-slash 301 with pretty_urls=false, the
   Accept: text/markdown edge function, per-language 404s, the generated _headers and _redirects.
     node scripts/geo-harness.mjs --live https://deploy-preview-12--<site>.netlify.app
   Exit 1 when a check fails. Works against `node build/serve.mjs` too (no edge function there). */
const liveAt = process.argv.indexOf('--live');
if (liveAt >= 0) {
  process.exit(await liveChecks(process.argv[liveAt + 1]));
}
async function liveChecks(baseArg) {
  if (!/^https?:\/\//.test(baseArg || '')) { console.error('usage: node scripts/geo-harness.mjs --live https://<deploy-url>'); return 2; }
  const base = baseArg.replace(/\/+$/, '');
  let fails = 0;
  const ok = (cond, msg, detail = '') => { if (cond) console.log(`  ✓ ${msg}`); else { fails++; console.log(`  ✗ ${msg}${detail ? `  (${detail})` : ''}`); } };
  // node:http(s) without keep-alive (agent: false): no redirects followed, no sockets left open at exit.
  const { request: httpRequest } = await import(base.startsWith('https:') ? 'node:https' : 'node:http');
  const req = (p, headers = {}, method = 'GET') => new Promise((resolve) => {
    const r = httpRequest(base + p, { method, agent: false, timeout: 15000, headers: { 'user-agent': 'geo-harness (+scripts/geo-harness.mjs)', 'accept-encoding': 'identity', ...headers } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, h: (k) => [].concat(res.headers[k.toLowerCase()] || '').join(', '), body: Buffer.concat(chunks).toString('utf8') }));
    });
    r.on('timeout', () => r.destroy(new Error('timeout')));
    r.on('error', (e) => resolve({ status: 0, h: () => '', body: '', error: e.message }));
    r.end();
  });
  const pricing = routeById.precios.es;
  const noSlash = pricing.replace(/\/$/, '');
  // build/serve.mjs has no edge functions and drops HSTS on localhost: those checks only mean something on Netlify.
  const local = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(base);
  const hostOnly = (cond, msg, detail) => (local ? console.log(`  - ${msg}: skipped on a local server`) : ok(cond, msg, detail));
  console.log(`\n[live] ${base}`);
  const r1 = await req(noSlash);
  ok([301, 308].includes(r1.status) && new URL(r1.h('location'), base).pathname === pricing, `${noSlash} → 301 ${pricing}`, `${r1.status} ${r1.h('location') || r1.error || ''}`);
  const r2 = await req(pricing, { accept: 'text/markdown' });
  hostOnly(r2.status === 200 && /text\/markdown/.test(r2.h('content-type')) && r2.body.startsWith('# '), `Accept: text/markdown on ${pricing} → Markdown (edge function)`, `${r2.status} ${r2.h('content-type')}`);
  hostOnly(/accept/i.test(r2.h('vary')) && r2.h('link').includes(`${base}${pricing}>; rel="canonical"`) && /noindex/.test(r2.h('x-robots-tag')), 'Markdown response: Vary: Accept, Link rel=canonical, X-Robots-Tag noindex', `vary="${r2.h('vary')}" link="${r2.h('link')}"`);
  const r3 = await req(pricing, { accept: 'text/html,application/xhtml+xml,*/*;q=0.8' });
  ok(r3.status === 200 && /text\/html/.test(r3.h('content-type')) && /frame-ancestors 'self'/.test(r3.h('content-security-policy')), `browser request on ${pricing} → HTML with its CSP`, `${r3.status} ${r3.h('content-type')}`);
  for (const [p, lang] of [['/__geo-harness-404__/', site.defaultLang], ...site.langs.filter((l) => l !== site.defaultLang).map((l) => [`/${l}/__geo-harness-404__/`, l])]) {
    const r = await req(p);
    ok(r.status === 404 && new RegExp(`<html[^>]*lang="${lang}`).test(r.body), `${p} → 404 with the ${lang} 404 page`, `${r.status}`);
  }
  const { redirects } = await import('../build/data/routes.mjs');
  for (const rd of redirects) {
    const r = await req(rd.from);
    ok(r.status === (rd.status || 301) && new URL(r.h('location') || '/', base).pathname === rd.to, `${rd.from} → ${rd.status || 301} ${rd.to}`, `${r.status} ${r.h('location')}`);
  }
  const robots = await req('/robots.txt');
  ok(robots.status === 200 && /^Content-Signal: /m.test(robots.body) && !/^Disallow: \/(en\/)?embed\//m.test(robots.body), 'robots.txt: Content-Signal record, /embed/ crawlable', `${robots.status}`);
  for (const p of ['/llms.txt', '/en/llms.txt', '/index.md']) {
    const r = await req(p);
    ok(r.status === 200 && /noindex/.test(r.h('x-robots-tag')) && /text\/(plain|markdown)/.test(r.h('content-type')), `${p}: 200, text, X-Robots-Tag noindex`, `${r.status} ${r.h('content-type')} ${r.h('x-robots-tag')}`);
  }
  const embed = routeById['embed-villa']?.es;
  if (embed) {
    const r = await req(embed);
    ok(r.status === 200 && /indexifembedded/.test(r.h('x-robots-tag')) && /frame-ancestors \*/.test(r.h('content-security-policy')), `${embed}: framable, X-Robots-Tag noindex, indexifembedded`, `${r.h('x-robots-tag')}`);
  }
  const glb = await req('/models/villa.glb', {}, 'HEAD');
  ok(glb.status === 200 && /model\/gltf-binary/.test(glb.h('content-type')) && glb.h('access-control-allow-origin') === '*', '/models/villa.glb: model/gltf-binary + CORS', `${glb.status} ${glb.h('content-type')}`);
  const home = await req('/');
  hostOnly(home.status === 200 && /max-age=\d{7,}/.test(home.h('strict-transport-security')) && /nosniff/.test(home.h('x-content-type-options')), '/: HSTS + nosniff', `${home.status}`);
  const sm = await req('/sitemap.xml');
  ok(sm.status === 200 && /<sitemapindex\b/.test(sm.body), '/sitemap.xml: sitemap index', `${sm.status}`);
  console.log(`\nlive checks: ${fails ? `${fails} FAILED` : 'all passed'}`);
  return fails ? 1 : 0;
}

const OUT = path.resolve(process.argv[2] || path.join(os.tmpdir(), 'geo-harness-dist'));
let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.log(`  ✗ ${msg}`); } else console.log(`  ✓ ${msg}`); };

/* ── Fake content ─────────────────────────────────────────────── */
const faq6 = (lang, topic) => Array.from({ length: 6 }, (_, i) => (lang === 'es'
  ? { q: `¿Pregunta ${i + 1} sobre ${topic}?`, a: `Respuesta ${i + 1}: {{brand}} entrega la [maqueta 3D completa](@precios) desde {{price:maqueta}} + IVA en {{delivery:maqueta}}, con **dos rondas** de cambios y archivos USDZ y GLB para ver la vivienda en realidad aumentada.` }
  : { q: `Question ${i + 1} about ${topic}?`, a: `Answer ${i + 1}: {{brand}} delivers the [complete 3D model](@precios) from {{price:maqueta}} + VAT in {{delivery:maqueta}}, with **two rounds** of changes and USDZ and GLB files to view the home in augmented reality.` }));
const L = (lang, es, en) => (lang === 'es' ? es : en);
function pageLang(id, lang) {
  const r = routeById[id];
  const base = {
    title: L(lang, `Página de prueba ${id} para el arnés GEO`, `Test page ${id} for the GEO harness`),
    description: L(lang, `Descripción de prueba de ${id}: {{brand}} convierte tu plano 2D en un modelo 3D desde {{price:maqueta}} + IVA en {{delivery:maqueta}}.`, `Test description for ${id}: {{brand}} turns your 2D floor plan into a 3D model from {{price:maqueta}} + VAT in {{delivery:maqueta}}.`),
    h1: L(lang, `Título de ${id}`, `Heading for ${id}`),
    lead: L(lang, 'Convertimos el plano 2D de tu vivienda en un modelo 3D amueblado con visor web y [realidad aumentada](@servicio-ar) sin app, desde {{price:maqueta}} + IVA y en {{delivery:maqueta}}.', 'We turn your home\'s 2D floor plan into a furnished 3D model with a web viewer and app-free [augmented reality](@servicio-ar), from {{price:maqueta}} + VAT in {{delivery:maqueta}}.'),
    breadcrumb: L(lang, `Miga ${id}`, `Crumb ${id}`),
    card: { title: L(lang, `Tarjeta ${id}`, `Card ${id}`), summary: L(lang, `Resumen de ${id} con {{villa:rooms}} estancias.`, `Summary of ${id} with {{villa:rooms}} rooms.`) },
    facts: [[L(lang, 'Entrada', 'Input'), L(lang, 'Plano 2D, sin fotos', '2D plan, no photos')], [L(lang, 'Precio', 'Price'), L(lang, 'Desde {{price:maqueta}} + IVA', 'From {{price:maqueta}} + VAT')], [L(lang, 'Plazo', 'Turnaround'), '{{delivery:maqueta}}'], [L(lang, 'Modelo web', 'Web model'), '{{file:glb}}']],
    blocks: [{ type: 'answer', h2: L(lang, '¿Qué incluye?', 'What is included?'), answer: L(lang, 'Incluye el modelo 3D amueblado, 6 renders en 4K y el visor web, con [AR Quick Look](@glosario#usdz) en iPhone. Precio {{price:maqueta:1}} hasta 300 m².', 'It includes the furnished 3D model, 6 renders in 4K and the web viewer, with [AR Quick Look](@glosario#usdz) on iPhone. Price {{price:maqueta:1}} up to 300 m².') }],
    faq: faq6(lang, id),
    related: ['caso-villa', 'precios', 'servicio-plano'].filter((x) => x !== id && routeById[x][lang]),
  };
  const B = base.blocks;
  switch (r.template) {
    case 'home': base.title = '{{brand}}: plano 2D a modelo 3D y AR'; B.push({ type: 'compare' }, { type: 'deliverables' }, { type: 'process', variant: 'despiece' }, { type: 'viewer' }, { type: 'audiences' }, { type: 'pricing', variant: 'excerpt' }, { type: 'calculator' }, { type: 'faq' }, { type: 'contactForm' }); delete base.card; break;
    case 'hub': B.push({ type: 'services' }, { type: 'comingSoon' }); delete base.faq; delete base.facts; break;
    case 'service': B.push({ type: 'table', h2: L(lang, 'Comparativa', 'Comparison'), caption: 'Tabla', head: ['A', 'B'], rows: [['1', '{{price:plano3d}}'], ['2', '{{extra:staging}}']], sources: [{ label: 'INE', url: 'https://www.ine.es/' }] }, { type: 'process', variant: 'list' }, { type: 'formats' }, { type: 'ar' }, { type: 'cta', h2: L(lang, 'Empieza hoy', 'Start today'), body: L(lang, 'Envíanos tu plano.', 'Send us your plan.'), service: 'plano3d' }); break;
    case 'pricing': B.push({ type: 'pricing', variant: 'full' }, { type: 'calculator' }, { type: 'guarantees' }); break;
    case 'case': B.push({ type: 'specs', items: [[L(lang, 'Estancias', 'Rooms'), '{{villa:rooms}}'], ['m²', '{{villa:interiorM2}}']] }, { type: 'gallery', items: [{ image: 'villa_terraza', alt: 'Render', caption: 'Terraza' }] }, { type: 'callout', title: 'Aviso', body: 'Caso anonimizado.', tone: 'honesty' }, { type: 'embedCode' }, { type: 'ar' }); break;
    case 'process': B.push({ type: 'process', variant: 'despiece' }, { type: 'needs' }); break;
    case 'guide':
      B.push({ type: 'prose', h2: 'Contexto', body: 'Texto con [fuente](https://www.registradores.org/) y lista:\n\n- uno\n- dos' }, { type: 'stat', value: '57 %', label: 'valora los planos', source: { label: 'NAR 2025', url: 'https://www.nar.realtor/' }, year: 2025 }, { type: 'sources', items: [{ label: 'INE', url: 'https://www.ine.es/' }] });
      // Comparison guide: a ranked table rendered as an ItemList (external link, internal @link, no link).
      if (id === 'guia-mejores') B.push({ type: 'table', itemList: true, h2: L(lang, 'Estudios comparados', 'Studios compared'), caption: L(lang, 'Estudios comparados', 'Studios compared'), head: ['Estudio', 'Precio'], rows: [['[Ararenders](https://ararenders.com/)', '250 €'], ['[{{brand}}](@home)', '{{price:plano3d}}'], [L(lang, 'Estudio sin web', 'Studio without a website'), '-']] });
      break;
    case 'glossary': B.push({ type: 'glossary' }); delete base.faq; break;
    case 'faq': B.push({ type: 'faqGroups', groups: [{ title: L(lang, 'Precios', 'Pricing'), items: faq6(lang, 'grupo') }] }); delete base.faq; break;
    case 'contact': B.push({ type: 'contactForm' }); break;
    case 'legal': case 'thanks': case 'ar': case 'embed': delete base.faq; delete base.facts; delete base.card; B.push({ type: 'prose', body: 'Texto legal de prueba con {{legal:razonSocial}}.' }); break;
    default: break;
  }
  return base;
}
const docs = routes.map((r) => ({
  id: r.id, image: r.id === 'caso-villa' ? 'villa_maqueta_iso' : 'villa_planta_cenital', datePublished: '2026-09-28', dateModified: '2026-09-28',
  ...Object.fromEntries(site.langs.filter((l) => r[l]).map((l) => [l, pageLang(r.id, l)])),
}));

// GEO_WRITE_CONTENT=<dir>: also dump the fake docs as content modules (to run the real engine on a scratch copy).
if (process.env.GEO_WRITE_CONTENT) {
  fs.mkdirSync(process.env.GEO_WRITE_CONTENT, { recursive: true });
  for (const d of docs) fs.writeFileSync(path.join(process.env.GEO_WRITE_CONTENT, `${d.id}.mjs`), `export default ${JSON.stringify(d, null, 2)};\n`);
  console.log(`fake content written to ${process.env.GEO_WRITE_CONTENT}`);
}

/* ── Fake ctx (BUILD-SPEC §3) ─────────────────────────────────── */
function makeCtx(lang, route, doc) {
  return {
    lang, route, doc, page: doc[lang], site, entryPath: route[lang],
    href(id, anchor) { const r = routeById[id]; if (!r?.[lang]) throw new Error(`no ${id} in ${lang}`); return r[lang] + (anchor ? `#${anchor}` : ''); },
    abs: (p) => site.domain + p,
    asset: (p) => p,
    tok: (s) => stripMd(resolveTokensFallback(s, lang)),
    fmtNumber: (n, d) => fmtNumber(n, lang, d),
    fmtBytes: (b) => fmtMB(b, lang),
    needs: new Set(),
  };
}
const imgs = imageManifest();
const entries = [];
for (const doc of docs) {
  const route = routeById[doc.id];
  for (const lang of site.langs) {
    if (!route[lang]) continue;
    const ctx = makeCtx(lang, route, doc);
    const page = doc[lang];
    const crumbs = [];
    for (let r = route; r; r = r.parent ? routeById[r.parent] : null) crumbs.unshift({ name: r.id === 'home' ? L(lang, 'Inicio', 'Home') : (r.id === route.id ? page.breadcrumb : `Miga ${r.id}`), path: r[lang] || r.es });
    const alternates = {};
    for (const l of site.langs) if (route[l]) alternates[l] = route[l];
    alternates['x-default'] = route[site.xDefault] || route[site.defaultLang];
    const title = page.title.includes('{{brand}}') ? ctx.tok(page.title) : `${ctx.tok(page.title)} | ${site.brand.name}`;
    const faq = [...(page.faq || []), ...((page.blocks || []).find((b) => b.type === 'faqGroups')?.groups.flatMap((g) => g.items) || [])].map((f) => ({ q: ctx.tok(f.q), a: ctx.tok(f.a) }));
    entries.push({
      id: doc.id, lang, template: route.template, path: route[lang], url: site.domain + route[lang], index: false,
      alternates, title, description: ctx.tok(page.description), h1: ctx.tok(page.h1), lead: ctx.tok(page.lead),
      facts: (page.facts || []).map(([k, v]) => [ctx.tok(k), ctx.tok(v)]), breadcrumbs: crumbs, parentId: route.parent,
      image: { name: doc.image, url: site.domain + (imgs[doc.image]?.og || `/assets/img/og/${doc.image}.jpg`), width: 1200, height: 630, alt: 'Render 3D de la villa anonimizada' },
      images: [{ url: site.domain + (imgs.villa_terraza?.fallback || '/assets/img/villa_terraza-1200.webp'), caption: 'Terraza', alt: 'Render' }],
      datePublished: doc.datePublished, dateModified: doc.dateModified, faq, blocks: page.blocks, page, doc, ctx, wordCount: 900,
    });
  }
}

/* ── 1. Unit checks ───────────────────────────────────────────── */
console.log('\n[schemaGraph]');
const get = (id, lang = 'es') => entries.find((e) => e.id === id && e.lang === lang);
const g = (id, lang) => schemaGraph(get(id, lang), get(id, lang).ctx);
const byType = (graph, t) => graph.filter((n) => [].concat(n['@type']).includes(t));
{
  const home = g('home');
  const org = home.find((n) => n['@id'] === `${site.domain}/#organization`);
  assert(org && org.areaServed?.length === 4 && org.areaServed.every((a) => /wikidata\.org\/wiki\/Q\d+/.test(a.sameAs)), 'home: full ProfessionalService with Wikidata areaServed');
  assert(org.knowsAbout.some((k) => k.sameAs?.endsWith('Q28135989')), 'home: knowsAbout includes glTF (Q28135989)');
  assert(!byType(home, 'BreadcrumbList').length, 'home: no BreadcrumbList');
  assert(byType(home, 'ItemList').length === 1, 'home: ItemList of services');
  assert(byType(home, 'FAQPage').length === 1, 'home: FAQPage (FAQ rendered)');
  const svc = g('servicio-plano');
  const s = byType(svc, 'Service')[0];
  const offers = [].concat(s?.offers || []);
  assert(offers.length && offers.every((o) => o.priceSpecification?.valueAddedTaxIncluded === false), 'service: Offers with UnitPriceSpecification VAT excluded');
  assert(offers[0]?.price === 149 && offers.some((o) => o.price === 490), `service: headline pack first (route.pack plano3d 149), then the lead's maqueta 490 (got ${offers.map((o) => o.price).join(', ')})`);
  const rs = [].concat(byType(g('servicio-renders'), 'Service')[0]?.offers || []);
  assert(rs.length === 1 && rs[0].price === 490, 'service renders: one Offer (490), the only pack its description/lead price');
  assert(Object.keys(svc.find((n) => n['@id'] === `${site.domain}/#organization`)).length <= 4, 'service: Organization is a stub (full only on home/about/contact)');
  assert(byType(svc, 'BreadcrumbList')[0]?.itemListElement.length === 3, 'service: 3-level breadcrumb');
  const st = byType(g('servicio-staging'), 'Service')[0];
  assert(st?.offers?.price === 60, 'staging: Offer from pricing.extras (60 per room)');
  const pr = g('precios');
  const cat = byType(pr, 'OfferCatalog')[0];
  assert(cat && cat.itemListElement.length >= 8, `pricing: OfferCatalog with ${cat?.itemListElement.length} offers`);
  assert(cat.itemListElement[0].itemOffered?.['@id'] === `${site.domain}/servicios/plano-2d-a-3d/#service`, 'pricing: plano3d itemOffered → the floor-plan Service @id');
  const aboutOrg = byType(g('sobre-nosotros'), 'ProfessionalService')[0];
  assert(aboutOrg?.contactPoint?.contactType === 'sales' && aboutOrg.image === byType(g('home'), 'ProfessionalService')[0].image, 'organization: contactType sales + one fixed image on every page');
  const legal = g('aviso-legal').find((n) => n['@id']?.endsWith('#webpage'));
  assert(!legal.speakable, 'legal: no speakable (no .lead/.cajetin to read)');
  const terms = byType(g('glosario'), 'DefinedTermSet')[0]?.hasDefinedTerm || [];
  assert(terms.length && terms.every((t) => !t.url && !t.inDefinedTermSet), 'glossary: DefinedTerm without url / inDefinedTermSet');
  const primary = byType(g('caso-villa'), 'ImageObject').find((n) => n['@id']?.endsWith('#primaryimage'));
  assert(/\/aviso-legal\/(#|$)/.test(primary?.license || '') && /\/contacto\/$/.test(primary?.acquireLicensePage || ''), 'images: license + acquireLicensePage on #primaryimage');
  const e0 = { ...get('guia-precio-render'), wordCount: 0 };
  const wc = byType(schemaGraph(e0, e0.ctx), 'Article')[0]?.wordCount;
  assert(wc > 0, `guide: wordCount computed from the content when the engine has none yet (${wc})`);
  const caseG = g('caso-villa', 'en');
  const model = byType(caseG, '3DModel')[0];
  assert(model?.encoding?.some((e) => e.encodingFormat === 'model/vnd.usdz+zip') && model.encoding.some((e) => e.encodingFormat === 'model/gltf-binary'), 'case: 3DModel with GLB + USDZ encodings');
  assert(byType(caseG, 'Article').length === 1, 'case: Article');
  assert(byType(g('como-funciona'), 'HowTo')[0]?.step.length === 5, 'process: HowTo with 5 steps');
  const guide = byType(g('guia-precio-render'), 'Article')[0];
  assert(guide?.citation?.length >= 2, 'guide: Article with citations');
  const faqPage = g('faq');
  assert(faqPage.find((n) => n['@id']?.endsWith('#webpage'))['@type'] === 'FAQPage', 'faq: WebPage node is FAQPage');
  assert(g('sobre-nosotros').find((n) => n['@id']?.endsWith('#webpage'))['@type'] === 'AboutPage', 'about: AboutPage');
  assert(g('contacto').find((n) => n['@id']?.endsWith('#webpage'))['@type'] === 'ContactPage', 'contact: ContactPage');
  assert(g('servicios').find((n) => n['@id']?.endsWith('#webpage'))['@type'] === 'CollectionPage', 'hub: CollectionPage');
  const thanks = g('gracias');
  assert(!byType(thanks, 'FAQPage').length && !byType(thanks, 'Service').length, 'thanks (noindex): minimal graph');
  const all = JSON.stringify(entries.map((e) => schemaGraph(e, e.ctx)));
  assert(!/null|\[\]|""|\{\{|undefined|NaN/.test(all), 'no null / [] / "" / {{ / undefined in any graph');
  // Video block → VideoObject referenced from the Article
  const vc = get('caso-villa');
  const withVideo = { ...vc, page: { ...vc.page, blocks: [...vc.page.blocks, { type: 'video', video: 'villa-turntable', h2: '¿Cómo se ve la maqueta en movimiento?', caption: 'Una vuelta de cámara alrededor de la maqueta. Animación 3D calculada con Cycles.' }] } };
  const vg = schemaGraph(withVideo, vc.ctx);
  const vo = byType(vg, 'VideoObject')[0];
  assert(vo && vo.duration === 'PT8S' && vo.uploadDate === vc.datePublished && /\.mp4$/.test(vo.contentUrl) && /poster/.test(vo.thumbnailUrl) && byType(vg, 'Article')[0].video?.['@id'] === vo['@id'], 'video: VideoObject (PT8S, uploadDate = datePublished, mp4, poster) linked from the Article');
  const vmd = blocksToMarkdown(withVideo, vc.ctx, { entries });
  assert(vmd.includes('## ¿Cómo se ve la maqueta en movimiento?') && /\[Ver el vídeo \(MP4, 8 s, [^\]]+\]\([^)]+\.mp4\)/.test(vmd) && vmd.includes('*Una vuelta de cámara'), 'video: Markdown mirror links the MP4 and keeps the caption');
  // Case graph within the JSON-LD budget (BUILD-SPEC §11): lean VideoObject, renders capped, 3DModel encodings kept.
  const caseImgs = ['villa_viewer_poster_mobile', 'villa_viewer_poster', 'villa_maqueta_iso', 'villa_salon_dormitorio', 'villa_dormitorios', 'villa_bano_suite', 'villa_terraza', 'villa_muros_completos', 'villa_plano_lineas', 'villa_planta_cenital']
    .map((name) => ({ name, url: `${site.domain}/assets/img/${name}-2400.0123abcd.webp`, caption: `Render ${name}`, alt: `Render 3D ${name}` }));
  const fullCase = { ...withVideo, image: { ...vc.image, name: 'villa_maqueta_iso_opaco' }, images: caseImgs };
  const cg = schemaGraph(fullCase, vc.ctx);
  const cImgs = byType(cg, 'Article')[0].image.map((i) => i.contentUrl || i['@id']);
  assert(cImgs.length === 1 + CASE_RENDERS && cImgs[0].endsWith('#primaryimage') && !cImgs.some((u) => /_mobile-|villa_maqueta_iso-/.test(u)) && cImgs.some((u) => /villa_viewer_poster-/.test(u)), `case: Article images = #primaryimage + ${CASE_RENDERS} renders, no crop or variant of the primary (${cImgs.length})`);
  assert(byType(cg, '3DModel')[0].encoding.length === 5, 'case: 3DModel keeps its 5 encodings (GLB, 2 USDZ, 2 AR GLB)');
  const vKeys = Object.keys(byType(cg, 'VideoObject')[0]).sort().join(',');
  assert(vKeys === '@id,@type,contentUrl,description,duration,name,thumbnailUrl,uploadDate', `case: lean VideoObject (${vKeys})`);
  const ctag = schemaScript(fullCase, vc.ctx);
  let faqB = 0;
  for (const n of cg) if (n['@type'] === 'FAQPage') for (const q of n.mainEntity) faqB += Buffer.byteLength(JSON.stringify(q));
  const ldB = Buffer.byteLength(ctag.slice(ctag.indexOf('>') + 1, ctag.lastIndexOf('</'))) - faqB;
  assert(ldB <= BUDGETS.jsonLdKB * 1024, `case: JSON-LD ${(ldB / 1024).toFixed(1)} KB without the FAQ (max ${BUDGETS.jsonLdKB} KB)`);
  assert(Object.keys(byType(cg, 'WebSite')[0]).length === 4 && byType(g('home'), 'WebSite')[0].publisher, 'WebSite: full on the home, stub (@id, url, name) elsewhere');
  // Tier bands: «de 151 a 300 m²» / "151 to 300 m²" (content audit F-33), in the Offers
  const tierUnits = JSON.stringify(byType(g('precios'), 'OfferCatalog')[0]) + JSON.stringify(byType(g('precios', 'en'), 'OfferCatalog')[0]);
  assert(tierUnits.includes('de 151 a 300 m²') && tierUnits.includes('151 to 300 m²') && !/más de 150|over 150/.test(tierUnits), 'pricing: tier unitText «de 151 a 300 m²» / "151 to 300 m²"');
  // Comparison guide → ItemList (only when the route exists)
  if (routeById['guia-mejores']) {
    const il = byType(g('guia-mejores'), 'ItemList')[0];
    const els = il?.itemListElement || [];
    assert(il && il.numberOfItems === 3 && els[0]?.url === 'https://ararenders.com/' && els[1]?.url === `${site.domain}/` && !els[2]?.url && byType(g('guia-mejores'), 'Article')[0].hasPart?.[0]?.['@id'] === il['@id'], 'guide: `table` with itemList: true → ItemList (external + internal @link resolved), Article hasPart');
  }
  // Founder (Person) only once site.founder is filled in
  site.founder = { name: 'Nombre Apellido', jobTitle: { es: 'Fundador', en: 'Founder' }, sameAs: ['https://www.linkedin.com/in/ejemplo'] };
  const person = byType(g('sobre-nosotros'), 'Person')[0];
  const author = byType(g('guia-precio-render'), 'Article')[0].author;
  const fOrg = byType(g('home'), 'ProfessionalService')[0].founder;
  site.founder = null;
  assert(person?.['@id'] === `${site.domain}/sobre-nosotros/#founder` && author?.['@id'] === person['@id'] && fOrg?.['@id'] === person['@id'], 'founder: Person on the about page, Article author and Organization founder');
  assert(!byType(g('sobre-nosotros'), 'Person').length, 'founder: no Person while site.founder is null');
  const tag = schemaScript(get('home'), get('home').ctx);
  assert(!tag.slice(tag.indexOf('>') + 1, tag.lastIndexOf('</')).includes('<'), 'schemaScript escapes "<"');
}
console.log('\n[blocksToMarkdown]');
{
  const md = blocksToMarkdown(get('servicio-plano'), get('servicio-plano').ctx, { entries });
  assert(md.startsWith('# Título de servicio-plano'), 'starts with H1');
  assert(md.includes(`URL canónica: ${site.domain}/servicios/plano-2d-a-3d/`) && md.includes(`English: ${site.domain}/en/floor-plan-to-3d-model/`), 'canonical + twin URL');
  assert(!/\]\((\/|@)/.test(md) && md.includes(`](${site.domain}/glosario/#usdz)`), 'links absolute, glossary anchor kept');
  assert(!/\{\{/.test(md) && md.includes('490 €') && md.includes('690 €'), 'tokens resolved (490 €, tier 690 €)');
  assert(/\| Dispositivo \| Cómo se abre \| Formato \| Tamaño \|/.test(md), 'formats table');
  assert(md.includes('## Preguntas frecuentes') && md.includes('## Sigue leyendo') && md.includes('## Contacto'), 'FAQ, related and contact sections');
  const pmd = blocksToMarkdown(get('precios', 'en'), get('precios', 'en').ctx, { entries });
  assert(pmd.includes('€1,490') && pmd.includes('€2,090') && pmd.includes('+30%'), 'pricing full (EN): packs, volume, rush extra');
  const pmdEs = blocksToMarkdown(get('precios'), get('precios').ctx, { entries });
  assert(pmdEs.includes('| de 151 a 300 m² |') && pmd.includes('| 151 to 300 m² |'), 'pricing tiers table: «de 151 a 300 m²» / "151 to 300 m²"');
  assert(site.contact.placeholder !== true || !/\+34 600 000 000|wa\.me\//.test(md + pmd), 'contact block: no placeholder phone / WhatsApp while site.contact is a placeholder (V-02)');
  const home = blocksToMarkdown(get('home'), get('home').ctx, { entries });
  assert(home.includes('Salón') && home.includes('```') === false && home.includes('Del plano 2D al modelo 3D'), 'home: viewer room list + compare');
  const cmd = blocksToMarkdown(get('caso-villa'), get('caso-villa').ctx, { entries });
  assert(cmd.includes('<iframe src="') && cmd.includes('/embed/villa/'), 'case: embed snippet');
  assert(/[\u2013\u2014]/.test(home + md + pmd + cmd) === false, 'no em/en dashes in generated Markdown');
}
console.log('\n[robots + CSP]');
{
  const r = robotsTxt();
  assert(/User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: \/\nDisallow: \/models\/\n/.test(r), 'robots: * group with a real Content-Signal record and /models/ closed');
  assert(!/Disallow: \/(en\/)?embed\//.test(r), 'robots: /embed/ crawlable (partner iframes render; noindex, indexifembedded header)');
  assert(/User-agent: Bytespider\nDisallow: \//.test(r) && r.includes(`Sitemap: ${site.domain}/sitemap.xml`), 'robots: Bytespider blocked + Sitemap');
  const csp = buildCsp({ hashes: ['abc='] });
  assert(csp.includes("'wasm-unsafe-eval'") && csp.includes("'sha256-abc='") && csp.includes("frame-ancestors 'self'"), 'CSP: wasm-unsafe-eval + hashes + frame-ancestors');
}

/* ── 2. Fake dist + machine outputs + check ───────────────────── */
console.log(`\n[fake dist] ${OUT}`);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const inl = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
function mdToHtml(md) {
  const out = []; const lines = md.split('\n'); let list = null; let table = null; let code = null;
  const flush = () => { if (list) out.push(`<${list.t}>${list.items.map((i) => `<li>${inl(i)}</li>`).join('')}</${list.t}>`); list = null; if (table) { out.push(`<table><caption>t</caption><tr>${table[0].map((c) => `<th scope="col">${inl(c)}</th>`).join('')}</tr>${table.slice(2).map((r) => `<tr>${r.map((c) => `<td>${inl(c)}</td>`).join('')}</tr>`).join('')}</table>`); table = null; } };
  for (const l of lines) {
    if (code) { if (l.startsWith('```')) { out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); code = null; } else code.push(l); continue; }
    if (l.startsWith('```')) { flush(); code = []; continue; }
    const h = l.match(/^(#{1,3}) (.*)$/);
    if (h) { flush(); out.push(`<h${h[1].length} id="${slug(h[2])}">${inl(h[2])}</h${h[1].length}>`); continue; }
    if (/^\|/.test(l)) { if (list) flush(); table = table || []; table.push(l.slice(1, -1).split(' | ').map((c) => c.trim())); continue; }
    const li = l.match(/^(?:- |\d+\. )(.*)$/);
    if (li) { if (table) flush(); const t = /^- /.test(l) ? 'ul' : 'ol'; if (list && list.t !== t) flush(); list = list || { t, items: [] }; list.items.push(li[1]); continue; }
    flush();
    if (l.startsWith('> ')) out.push(`<p class="lead">${inl(l.slice(2))}</p>`);
    else if (l.trim() && !/^(URL canónica|Canonical URL|Idioma|Language|English|Español):/.test(l)) out.push(`<p>${inl(l)}</p>`);
  }
  flush();
  return out.join('\n');
}
const inlineJs = "document.documentElement.classList.add('js')";
const footer = (lang) => `<footer><p>${esc(site.contact.email)} · ${esc(site.contact.phoneDisplay)}</p><ul>${entries.filter((e) => e.lang === lang && !['gracias', 'ar-villa', 'embed-villa'].includes(e.id)).map((e) => `<li><a href="${e.path}">${esc(e.page.breadcrumb)}</a></li>`).join('')}</ul></footer>`;
for (const e of entries) {
  const md = blocksToMarkdown(e, e.ctx, { entries });
  const body = mdToHtml(md).replace(/<p class="lead">/, '<p class="lead">').replace(/(<p class="lead">[\s\S]*?<\/p>)/, `$1<dl class="cajetin">${e.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`);
  const noindex = e.template === 'thanks' || e.template === 'ar' || e.template === 'embed';
  const alts = Object.entries(e.alternates).map(([l, p]) => `<link rel="alternate" hreflang="${l}" href="${site.domain}${p}">`).join('');
  const html = `<!doctype html><html lang="${e.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(e.title)}</title><meta name="description" content="${esc(e.description)}"><meta name="robots" content="${noindex ? 'noindex, follow' : 'noindex, follow'}"><link rel="canonical" href="${e.url}">${noindex ? '' : alts}<meta property="og:title" content="${esc(e.title)}"><meta property="og:description" content="${esc(e.description)}"><meta property="og:image" content="${e.image.url}"><meta property="og:url" content="${e.url}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">${noindex ? '' : `<link rel="alternate" type="text/markdown" href="${e.path}index.md">`}<script>${inlineJs}</script>${schemaScript(e, e.ctx)}</head><body><nav aria-label="Migas">${e.breadcrumbs.map((c) => `<a href="${c.path}">${esc(c.name)}</a>`).join(' ')}</nav><main id="main"><div id="visor"></div><div id="demo"></div>${body}<p>${L(e.lang, 'Actualizado el', 'Updated')} <time datetime="${e.dateModified}">${e.dateModified}</time></p></main>${footer(e.lang)}</body></html>`;
  e.html = html;
  const fp = path.join(OUT, e.path, 'index.html');
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, html);
}
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><html lang="es"><head><title>404</title><meta name="description" content="Página no encontrada en el sitio de prueba del arnés GEO, vuelve al inicio."><link rel="canonical" href="${site.domain}/404.html"><script>${inlineJs}</script></head><body><main><h1>404</h1></main></body></html>`);
// Referenced static files (placeholders) + real models
const need = new Set();
for (const f of [...entries.map((e) => e.html), ...entries.map((e) => blocksToMarkdown(e, e.ctx, { entries }))]) for (const m of f.matchAll(new RegExp(`${site.domain.replace(/\./g, '\\.')}(/(?:assets|img)/[^")\\s<]+)`, 'g'))) need.add(m[1]);
for (const p of need) { const fp = path.join(OUT, p); fs.mkdirSync(path.dirname(fp), { recursive: true }); fs.writeFileSync(fp, 'x'); }
fs.cpSync(path.join(ROOT, 'public', 'models'), path.join(OUT, 'models'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'en'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'en', '404.html'), fs.readFileSync(path.join(OUT, '404.html'), 'utf8').replace('lang="es"', 'lang="en"').replace('/404.html', '/en/404.html'));
for (const ic of ['icon-192.png', 'icon-512.png']) if (fs.existsSync(path.join(ROOT, 'public', ic))) fs.copyFileSync(path.join(ROOT, 'public', ic), path.join(OUT, ic));

const summary = await writeMachineOutputs(entries, { dist: OUT, context: 'dev', fetchLive: false, notFound: [{ path: '/404.html' }, { path: '/en/404.html' }] });
assert(summary.markdown === entries.filter((e) => routeById[e.id].index !== false).length, `writeMachineOutputs: ${summary.markdown} index.md files`);
const llms = fs.readFileSync(path.join(OUT, 'llms.txt'), 'utf8');
assert(llms.startsWith('<!--') && /\n# /.test(llms) && Buffer.byteLength(llms) < 10240, `llms.txt preview comment + H1, ${Buffer.byteLength(llms)} bytes`);
const hdr = fs.readFileSync(path.join(OUT, '_headers'), 'utf8');
assert(hdr.includes('/embed/*') && hdr.includes('frame-ancestors *') && !/^\s+X-Frame-Options:/mi.test(hdr), '_headers: embed rule, no X-Frame-Options');
assert(/\/embed\/\*\n[^\n]*\n\s+X-Robots-Tag: noindex, indexifembedded/.test(hdr), '_headers: embed X-Robots-Tag noindex, indexifembedded');
const llmsEn = fs.readFileSync(path.join(OUT, 'en', 'llms.txt'), 'utf8');
if (routeById['guia-mejores']) {
  const u = (l) => `${site.domain}${routeById['guia-mejores'][l]}`;
  assert(llms.includes(`](${u('es')}): `) && (!routeById['guia-mejores'].en || llmsEn.includes(`](${u('en')}): `)), 'llms: the comparison guide answers a quick question (its own lead) and is listed');
}
assert(llms.includes('## Respuestas rápidas') && llmsEn.includes('## Quick answers') && llms.includes(`${site.domain}/en/llms.txt`) && Buffer.byteLength(llmsEn) < 10240 && hdr.includes('/en/llms.txt'), `llms: ES + EN indexes with quick answers (${Buffer.byteLength(llmsEn)} bytes EN)`);
const fullEs = fs.readFileSync(path.join(OUT, 'llms-full.txt'), 'utf8');
const fullEn = fs.readFileSync(path.join(OUT, 'en', 'llms-full.txt'), 'utf8');
assert(fullEs.includes(`URL canónica: ${site.domain}/precios/`) && !fullEs.includes('Canonical URL: ') && fullEn.includes(`Canonical URL: ${site.domain}/en/pricing/`) && !fullEn.includes('URL canónica: '), 'llms-full: one file per language');
assert(!fullEs.includes('URL canónica: https://www.estudio3d.example/aviso-legal/') && !fullEs.includes('URL canónica: https://www.estudio3d.example/servicios/\n'), 'llms-full: legal pages and hubs left out');
assert(llms.includes(`${site.domain}/en/llms-full.txt`) && hdr.includes('/en/llms-full.txt'), 'llms.txt + _headers know /en/llms-full.txt');
const redir = fs.readFileSync(path.join(OUT, '_redirects'), 'utf8');
assert(/^\/en\/\*\s+\/en\/404\.html\s+404$/m.test(redir) && /^\/\*\s+\/404\.html\s+404$/m.test(redir) && redir.indexOf('/en/*') < redir.indexOf('\n/*'), '_redirects: /en/* 404 before /* 404');
const wm = JSON.parse(fs.readFileSync(path.join(OUT, 'site.webmanifest'), 'utf8'));
assert(!fs.existsSync(path.join(OUT, 'icon-192.png')) || wm.icons?.every((i) => i.type === 'image/png' && i.purpose === 'any maskable'), 'webmanifest: PNG icons, purpose "any maskable"');
console.log(`\nunit assertions: ${failures ? `${failures} FAILED` : 'all passed'}\n\n[check.mjs --no-lint on the fake dist]`);
const r = spawnSync(process.execPath, [path.join(ROOT, 'build', 'check.mjs'), OUT, '--no-lint'], { encoding: 'utf8' });
console.log(r.stdout, r.stderr);
process.exit(failures ? 1 : 0);
