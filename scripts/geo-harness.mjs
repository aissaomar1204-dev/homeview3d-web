#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   GEO harness (owner: GEO): exercises build/lib/{schema,markdown,machine}.mjs
   and build/check.mjs WITHOUT the engine, using fake registry entries.
     node scripts/geo-harness.mjs [outDir]      (default: <tmp>/geo-harness-dist)
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
import { schemaGraph, schemaScript } from '../build/lib/schema.mjs';
import { blocksToMarkdown, resolveTokensFallback, stripMd, imageManifest, fmtMB, fmtNumber } from '../build/lib/markdown.mjs';
import { writeMachineOutputs, robotsTxt, buildCsp } from '../build/lib/machine.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
    case 'guide': B.push({ type: 'prose', h2: 'Contexto', body: 'Texto con [fuente](https://www.registradores.org/) y lista:\n\n- uno\n- dos' }, { type: 'stat', value: '57 %', label: 'valora los planos', source: { label: 'NAR 2025', url: 'https://www.nar.realtor/' }, year: 2025 }, { type: 'sources', items: [{ label: 'INE', url: 'https://www.ine.es/' }] }); break;
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
  assert(s?.offers?.priceSpecification?.valueAddedTaxIncluded === false && s.offers.price === 490, 'service: Offer 490 + UnitPriceSpecification VAT excluded');
  assert(Object.keys(svc.find((n) => n['@id'] === `${site.domain}/#organization`)).length <= 4, 'service: Organization is a stub (full only on home/about/contact)');
  assert(byType(svc, 'BreadcrumbList')[0]?.itemListElement.length === 3, 'service: 3-level breadcrumb');
  const st = byType(g('servicio-staging'), 'Service')[0];
  assert(st?.offers?.price === 60, 'staging: Offer from pricing.extras (60 per room)');
  const pr = g('precios');
  const cat = byType(pr, 'OfferCatalog')[0];
  assert(cat && cat.itemListElement.length >= 8, `pricing: OfferCatalog with ${cat?.itemListElement.length} offers`);
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
  const home = blocksToMarkdown(get('home'), get('home').ctx, { entries });
  assert(home.includes('Salón') && home.includes('```') === false && home.includes('Del plano 2D al modelo 3D'), 'home: viewer room list + compare');
  const cmd = blocksToMarkdown(get('caso-villa'), get('caso-villa').ctx, { entries });
  assert(cmd.includes('<iframe src="') && cmd.includes('/embed/villa/'), 'case: embed snippet');
  assert(/[\u2013\u2014]/.test(home + md + pmd + cmd) === false, 'no em/en dashes in generated Markdown');
}
console.log('\n[robots + CSP]');
{
  const r = robotsTxt();
  assert(/User-agent: \*\nAllow: \/\nDisallow: \/models\/\nDisallow: \/embed\/\nDisallow: \/en\/embed\//.test(r), 'robots: * group with /models/ and embed dirs');
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
