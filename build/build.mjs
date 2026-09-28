#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Static site generator (docs/build/BUILD-SPEC.md §2). Owner: ENGINE.
   node build/build.mjs  →  dist/
   load → validate → assets → render → machine outputs → report
   Env:
     CONTENT_DIR=path     content modules (default build/content)
     STRICT=1             missing content files / other agents' module errors fail the build
     SKIP_INVALID=1       skip pages whose content has validation errors instead of aborting (dev only)
     VERBOSE=1            print every content warning
     NO_MINIFY=1          ship src/js unminified
     CONTEXT=production   Netlify context: fails while placeholders remain unless ALLOW_PLACEHOLDERS=1
   Zero runtime dependencies.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { site, hasPlaceholders } from './data/site.mjs';
import { routes, routeById } from './data/routes.mjs';
import { pricing } from './data/pricing.mjs';
import { villa } from './data/villa.mjs';
import { process as processData } from './data/process.mjs';
import { deliverables, comingSoon } from './data/deliverables.mjs';
import { UI } from './data/ui.mjs';
import { createContext, optionalImport } from './lib/context.mjs';
import { createAssets } from './lib/assets.mjs';
import { renderDocument, crumbTrail, robotsFor } from './lib/layout.mjs';
import { dateLine, renderCaption, defaultAlt } from './lib/components.mjs';
import { viewerStatus } from './lib/blocks.mjs';
import { stripTags, countWords } from './lib/md.mjs';

const t0 = Date.now();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.resolve(ROOT, process.env.CONTENT_DIR || path.join('build', 'content'));
const STRICT = process.env.STRICT === '1';
const VERBOSE = process.env.VERBOSE === '1';
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

const warnings = [];
const warn = (m) => { warnings.push(m); console.warn(m); };
const quietWarn = (m) => { warnings.push(m); if (VERBOSE) console.warn(m); };
const fail = (m) => { console.error(`\n✗ BUILD FAILED: ${m}\n`); process.exit(1); };

console.log(`Building ${site.brand.name} → ${rel(DIST)}  (content: ${rel(CONTENT)})`);

/* ─── 0. Launch gate ──────────────────────────────────────────── */
const placeholders = hasPlaceholders();
if (process.env.CONTEXT === 'production' && placeholders && process.env.ALLOW_PLACEHOLDERS !== '1') {
  fail('placeholders remain in build/data/site.mjs (brand, domain, contact or legal). Set ALLOW_PLACEHOLDERS=1 to publish a preview on production.');
}

/* ─── 1. Load data and content ────────────────────────────────── */
let glossary = [];
{
  const g = await optionalImport(path.join(HERE, 'data', 'glossary.mjs'), { label: 'build/data/glossary.mjs', warn });
  if (g.mod) glossary = g.mod.glossary || g.mod.default || [];
}
const data = { pricing, villa, process: processData, deliverables, comingSoon, glossary, ui: UI };

const docs = new Map();
const docFiles = new Map();
const loadErrors = [];
if (fs.existsSync(CONTENT)) {
  for (const f of fs.readdirSync(CONTENT).filter((x) => x.endsWith('.mjs')).sort()) {
    const id = f.replace(/\.mjs$/, '');
    const file = path.join(CONTENT, f);
    try {
      const mod = await import(pathToFileURL(file).href + `?v=${fs.statSync(file).mtimeMs}`);
      docs.set(id, mod.default);
      docFiles.set(id, file);
    } catch (e) {
      loadErrors.push(`✗ ${id}: import failed: ${e.message}`);
    }
  }
}

/* ─── 1b. Content validation (same rules as build/validate-content.mjs) ── */
const validation = validateContent(docs);
for (const e of loadErrors) validation.errors.push(e);
validation.warnings.forEach((w) => quietWarn(w));
if (validation.errors.length) {
  validation.errors.forEach((e) => console.error(e));
  if (process.env.SKIP_INVALID === '1') {
    const bad = new Set(validation.errors.map((e) => (e.match(/^✗ ([\w-]+)/) || [])[1]).filter(Boolean));
    for (const id of bad) docs.delete(id);
    warn(`! SKIP_INVALID=1: skipped ${bad.size} page(s) with content errors: ${[...bad].join(', ')}`);
  } else {
    fail(`${validation.errors.length} content error(s). Fix them (node build/validate-content.mjs) or run with SKIP_INVALID=1 while drafting.`);
  }
}
console.log(`  content: ${docs.size} file(s), ${validation.warnings.length} warning(s)${VERBOSE ? '' : ' (VERBOSE=1 to list)'}`);

// Utility pages may have no content file: synthesise them from ui.mjs (noindex anyway).
const SYNTH = { thanks: 'thanks', ar: 'ar', embed: 'embed' };
for (const r of routes) {
  if (docs.has(r.id) || !SYNTH[r.template]) continue;
  const doc = { id: r.id, synthetic: true };
  for (const l of site.langs) if (r[l]) doc[l] = { ...UI[l].pages[SYNTH[r.template]], blocks: [] };
  docs.set(r.id, doc);
}

const missingContent = routes.filter((r) => !docs.has(r.id)).map((r) => r.id);
if (missingContent.length) {
  const m = `! content missing for ${missingContent.length} route(s), skipped: ${missingContent.join(', ')}`;
  if (STRICT) fail(m); else warn(m);
}

/* ─── 2. Templates and other agents' modules ──────────────────── */
const templates = new Map();
for (const name of [...new Set([...routes.map((r) => r.template), 'notfound'])]) {
  const { mod, missing } = await optionalImport(path.join(HERE, 'templates', `${name}.mjs`), { label: `build/templates/${name}.mjs`, warn });
  if (mod && typeof mod.default === 'function') templates.set(name, mod.default);
  else {
    const m = `! template "${name}" ${missing ? 'missing' : 'failed to load'}: its pages are skipped`;
    if (STRICT && !missing) fail(m); else warn(m);
  }
}
const schemaMod = (await optionalImport(path.join(HERE, 'lib', 'schema.mjs'), { label: 'build/lib/schema.mjs', warn })).mod;
const machineMod = (await optionalImport(path.join(HERE, 'lib', 'machine.mjs'), { label: 'build/lib/machine.mjs', warn })).mod;
if (!schemaMod) warn('! build/lib/schema.mjs not available: pages get a minimal JSON-LD fallback');
if (!machineMod) warn('! build/lib/machine.mjs not available: robots, sitemaps, llms and _headers are not written');
if (viewerStatus !== 'loaded') warn(`! build/lib/viewer.mjs ${viewerStatus}: viewer/ar/formats/embedCode blocks use engine fallbacks`);

// Pages that will be rendered (route × language with content and a template).
const rendered = new Set();
for (const r of routes) {
  const doc = docs.get(r.id);
  if (!doc || !templates.has(r.template)) continue;
  for (const l of site.langs) if (r[l] && doc[l]) rendered.add(`${r.id}:${l}`);
}

/* ─── 3. Assets ───────────────────────────────────────────────── */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
const assets = createAssets({ root: ROOT, dist: DIST, warn });
const pub = assets.copyPublic();
const css = assets.buildCss();
const js = assets.buildJs();
assets.loadImages(path.join(HERE, 'generated', 'images.json'));
const fontPath = '/assets/fonts/archivo-var.woff2';
const exists = (p) => fs.existsSync(path.join(ROOT, 'public', p));
const pageAssets = {
  css: css.url,
  js: { main: js.main && js.main.url, viewer: js.viewer && js.viewer.url },
  font: assets.assetMap.has(fontPath) ? assets.asset(fontPath) : null,
  meshopt: assets.asset(villa.viewer.meshoptDecoder),
  favicons: { ico: exists('/favicon.ico'), svg: exists('/favicon.svg'), apple: exists('/apple-touch-icon.png') },
  manifest: !!machineMod,
  markdown: !!machineMod,
};
if (!pageAssets.font) warn(`! ${fontPath} not in public/: fonts fall back to the metric-matched system faces`);
const themeColors = readThemeColors(path.join(ROOT, 'src', 'css', '00-tokens.css'));
console.log(`  assets: ${pub.count} public file(s), css ${kb(css.bytes)}, js ${Object.entries(js).map(([k, v]) => `${k} ${kb(v.bytes)}`).join(', ') || 'none'}`);

/* ─── 4. Render ───────────────────────────────────────────────── */
const entries = [];
const counts = {};
const errors = [];
for (const r of routes) {
  for (const lang of site.langs) {
    if (!rendered.has(`${r.id}:${lang}`)) continue;
    try {
      const entry = renderPage(r, lang);
      entries.push(entry);
      counts[lang] = (counts[lang] || 0) + 1;
    } catch (e) {
      errors.push(`✗ ${r.id}[${lang}]: ${e.stack || e.message}`);
    }
  }
}
// 404 per language (noindex, not in the registry).
const notFound = [];
if (templates.has('notfound')) {
  const nfRoute = { id: 'notfound', template: 'notfound', parent: null, index: false };
  for (const l of site.langs) nfRoute[l] = l === site.defaultLang ? '/404.html' : `/${l}/404.html`;
  for (const l of site.langs) rendered.add(`notfound:${l}`);
  for (const lang of site.langs) {
    try { notFound.push(renderNotFound(nfRoute, lang)); } catch (e) { errors.push(`✗ 404[${lang}]: ${e.stack || e.message}`); }
  }
}
if (errors.length) { errors.forEach((e) => console.error(e)); fail(`${errors.length} page(s) failed to render`); }

/* ─── 5. Machine outputs (GEO) ────────────────────────────────── */
if (machineMod && typeof machineMod.writeMachineOutputs === 'function') {
  try {
    const res = await machineMod.writeMachineOutputs(entries, { dist: DIST, root: ROOT, context: process.env.CONTEXT, notFound, assets: { map: Object.fromEntries(assets.assetMap), css: css.url, js: pageAssets.js }, log: (m) => console.log(`  ${m}`) });
    if (res && Array.isArray(res.warnings)) res.warnings.forEach((w) => warn(`! machine: ${w}`));
  } catch (e) {
    const m = `! writeMachineOutputs failed: ${e.stack || e.message}`;
    if (STRICT) fail(m); else warn(m);
  }
}

/* ─── 6. Report ───────────────────────────────────────────────── */
report();

/* ═══ Helpers ═════════════════════════════════════════════════ */

function baseContext(route, lang, doc) {
  return createContext({
    lang, route, doc, site, ui: UI, data, routes, routeById, rendered, docs,
    assets: { asset: assets.asset, picture: assets.picture }, images: assets.images,
  });
}

function renderPage(route, lang) {
  const doc = docs.get(route.id);
  const ctx = baseContext(route, lang, doc);
  const tpl = templates.get(route.template);
  const out = tpl(ctx) || {};
  const main = out.main || '';
  const layout = out.layout || 'default';
  const page = ctx.page;
  const brand = site.brand.name;
  const rawTitle = page.title || page.h1 || '';
  const title = rawTitle.includes('{{brand}}') ? ctx.tok(rawTitle) : `${ctx.tok(rawTitle)} | ${brand}`;
  const index = route.index !== false;

  const alternates = {};
  for (const l of site.langs) if (route[l] && rendered.has(`${route.id}:${l}`)) alternates[l] = route[l];
  alternates['x-default'] = alternates[site.xDefault] || alternates[site.defaultLang] || route[lang];

  const imgName = doc.image || 'og_image';
  const ogUrl = assets.og(imgName) || assets.og('og_image') || assets.largest(imgName);
  const images = [];
  const seen = new Set();
  for (const im of ctx.collect.images) {
    if (!im.url || seen.has(im.url)) continue;
    seen.add(im.url);
    images.push({ url: ctx.abs(im.url), caption: renderCaption(ctx, im.name) || im.alt, alt: im.alt, name: im.name });
  }

  const entry = {
    id: route.id, lang, template: route.template, path: route[lang], url: ctx.abs(route[lang]), index,
    robots: robotsFor(index, placeholders), noindex: !index || placeholders,
    alternates,
    title,
    description: ctx.tok(page.description || ''),
    h1: ctx.tok(page.h1 || ''),
    lead: page.lead ? ctx.tok(page.lead) : '',
    facts: (page.facts || []).map(([k, v]) => [ctx.tok(k), ctx.tok(v)]),
    breadcrumbs: crumbTrail(ctx),
    parentId: route.parent || null,
    image: { name: imgName, url: ogUrl ? ctx.abs(ogUrl) : null, width: 1200, height: 630, alt: page.hero && page.hero.image === imgName && page.hero.alt ? ctx.tok(page.hero.alt) : defaultAlt(ctx, imgName) },
    images,
    datePublished: doc.datePublished || null,
    dateModified: doc.dateModified || null,
    faq: ctx.collect.faq.slice(),
    blocks: page.blocks || [],
    page, doc,
    headings: ctx.collect.headings.slice(),
    needs: [...ctx.needs],
    html: '', wordCount: 0,
    ctx,
  };

  let graph = [];
  if (schemaMod && typeof schemaMod.schemaGraph === 'function') {
    try {
      const g = schemaMod.schemaGraph(entry, ctx);
      graph = Array.isArray(g) ? g : (g && g['@graph']) || [];
    } catch (e) {
      const m = `! schemaGraph failed for ${route.id}[${lang}]: ${e.message}`;
      if (STRICT) throw new Error(m); else warn(m);
      graph = fallbackGraph(entry);
    }
  } else graph = fallbackGraph(entry);

  const dl = index && layout !== 'bare' ? `<div class="wrap dateline-wrap">${dateLine(ctx)}</div>` : '';
  const html = renderDocument(ctx, { main, layout, bodyClass: out.bodyClass, entry, graph, assets: pageAssets, themeColors, placeholders, dateline: dl });
  entry.html = html;
  entry.wordCount = countWords(stripTags((html.match(/<main[\s\S]*<\/main>/) || [''])[0]));
  writePage(route[lang], html);
  return entry;
}

function renderNotFound(route, lang) {
  const doc = { id: 'notfound', [lang]: { title: UI[lang].notfound.title, description: UI[lang].notfound.description, h1: UI[lang].notfound.h1, lead: UI[lang].notfound.lead, blocks: [] } };
  const ctx = baseContext(route, lang, doc);
  const out = templates.get('notfound')(ctx);
  const entry = {
    id: 'notfound', lang, template: 'notfound', path: route[lang], url: ctx.abs(route[lang]), index: false,
    alternates: {}, title: `${ctx.t('notfound.title')} | ${site.brand.name}`, description: ctx.t('notfound.description'),
    breadcrumbs: [], image: null,
  };
  const html = renderDocument(ctx, { main: out.main, layout: 'default', bodyClass: out.bodyClass, entry, graph: [], assets: pageAssets, themeColors, placeholders, dateline: '' })
    .replace(/<link rel="canonical"[^>]*>/, '');
  const file = path.join(DIST, route[lang]);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return { lang, path: route[lang], html };
}

function fallbackGraph(entry) {
  return [
    { '@type': 'WebPage', '@id': entry.url, url: entry.url, name: entry.title, description: entry.description, inLanguage: entry.lang, dateModified: entry.dateModified || undefined },
    entry.breadcrumbs.length > 1 ? { '@type': 'BreadcrumbList', itemListElement: entry.breadcrumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: site.domain + c.path })) } : null,
  ].filter(Boolean);
}

function writePage(urlPath, html) {
  const file = urlPath.endsWith('/') ? path.join(DIST, urlPath, 'index.html') : path.join(DIST, urlPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function readThemeColors(file) {
  const out = { light: '', dark: '' };
  try {
    const src = fs.readFileSync(file, 'utf8');
    const light = src.match(/--color-bg:\s*(#[0-9a-fA-F]{6})/);
    const darkBlock = src.split(/prefers-color-scheme:\s*dark/)[1] || '';
    const dark = darkBlock.match(/--color-bg:\s*(#[0-9a-fA-F]{6})/);
    out.light = light ? light[1] : '';
    out.dark = dark ? dark[1] : '';
  } catch { /* tokens missing */ }
  return out;
}

function kb(bytes) { return `${(bytes / 1024).toFixed(1)} KB`; }

function report() {
  const home = entries.find((e) => e.id === 'home' && e.lang === site.defaultLang);
  const size = (p) => { try { return fs.statSync(path.join(DIST, p)).size; } catch { return 0; } };
  console.log('\n── Report ─────────────────────────────────────────');
  console.log(`  pages: ${Object.entries(counts).map(([l, n]) => `${l} ${n}`).join(' · ') || 'none'} (+ ${notFound.length} × 404)`);
  if (home) {
    const htmlB = Buffer.byteLength(home.html);
    const jsB = [...home.html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].reduce((s, m) => s + size(m[1]), 0);
    const fontB = [...assets.assetMap.values()].filter((p) => p.endsWith('.woff2')).reduce((s, p) => s + size(p), 0);
    const lcp = (home.html.match(/<img\b[^>]*fetchpriority="high"[^>]*>/) || [''])[0];
    const lcpName = (home.images[0] || {}).name;
    const m = lcpName && assets.images && assets.images[lcpName];
    const lcpB = m && m.bytes ? (m.bytes['avif-1200'] || m.bytes['webp-1200'] || 0) : 0;
    console.log(`  home: HTML ${kb(htmlB)} · CSS ${kb(css.bytes)} · initial JS ${kb(jsB)} · fonts ${kb(fontB)} · LCP image ${lcp ? (lcpB ? `${kb(lcpB)} (avif 1200w)` : 'n/a (no manifest bytes)') : 'none'}`);
    if (htmlB > 60 * 1024) warn(`! home HTML ${kb(htmlB)} > 60 KB budget`);
    if (css.bytes > 40 * 1024) warn(`! CSS ${kb(css.bytes)} > 40 KB budget`);
    if (js.main && js.main.bytes > 15 * 1024) warn(`! main.js ${kb(js.main.bytes)} > 15 KB budget`);
  }
  if (placeholders) console.warn('\n  ⚠  PLACEHOLDERS: brand/domain/contact/legal data in build/data/site.mjs are placeholders.\n     Every page is rendered "noindex, follow". Production deploys fail unless ALLOW_PLACEHOLDERS=1.');
  if (!pricing.confirmed) console.warn('  ⚠  PRICING NOT CONFIRMED: build/data/pricing.mjs is a proposal (confirmed: false).');
  if (assets.missing.size) console.warn(`  ⚠  ${assets.missing.size} asset(s) referenced but missing in public/`);
  const miss = entries.flatMap((e) => e.ctx.collect.missingImages || []);
  if (miss.length) console.warn(`  ⚠  ${new Set(miss).size} image(s) rendered as placeholders: ${[...new Set(miss)].join(', ')}`);
  console.log(`  ${warnings.length} warning(s) · ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
}

/* ─── Content validation (ported from build/validate-content.mjs; keep in sync) ── */
function validateContent(allDocs) {
  const errors = [], warns = [];
  const E = (id, lang, m) => errors.push(`✗ ${id}${lang ? `[${lang}]` : ''}: ${m}`);
  const W = (id, lang, m) => warns.push(`! ${id}${lang ? `[${lang}]` : ''}: ${m}`);
  const glossaryIds = glossary.length ? new Set(glossary.map((t) => t.id)) : null;
  const IMAGES = new Set([
    'villa_maqueta_iso', 'villa_maqueta_iso_opaco', 'villa_planta_cenital', 'villa_planta_cenital_opaco', 'villa_plano_lineas',
    'villa_salon_dormitorio', 'villa_salon_dormitorio_opaco', 'villa_dormitorios', 'villa_dormitorios_opaco',
    'villa_bano_suite', 'villa_bano_suite_opaco', 'villa_terraza', 'villa_terraza_opaco',
    'villa_muros_completos', 'villa_muros_completos_opaco', 'og_image',
    'villa_despiece_1', 'villa_despiece_2', 'villa_despiece_3', 'villa_viewer_poster',
  ]);
  const BLOCKS = {
    prose: ['body'], answer: ['h2', 'answer'], table: ['caption', 'head', 'rows'], steps: ['h2', 'items'], checklist: ['h2', 'items'],
    figure: ['image', 'alt', 'caption'], gallery: ['items'], compare: [], viewer: [], ar: [], formats: [], embedCode: [],
    deliverables: [], comingSoon: [], process: [], needs: [], services: [], audiences: [], pages: ['ids'], pricing: ['variant'],
    calculator: [], guarantees: [], stat: ['value', 'label', 'source', 'year'], callout: ['body'], specs: ['items'],
    sources: ['items'], faq: [], faqGroups: ['groups'], glossary: [], contactForm: [], cta: ['h2', 'body'],
  };
  const BANNED = [
    /\binnovador(a|es|as)?\b/i, /\brevolucionari[oa]s?\b/i, /de última generación/i, /solución integral/i, /\bsin precedentes\b/i,
    /cutting[- ]edge/i, /\bseamless(ly)?\b/i, /\bunlock\b/i, /\belevate\b/i, /game[- ]changer/i, /fast-paced/i, /\bdelve\b/i,
    /\blorem\b/i, /\bTODO\b/, /\bTBD\b/, /\bXXX\b/,
  ];
  const NO_FACTS = new Set(['legal', 'thanks', 'ar', 'embed', 'hub']);
  const NO_FAQ = new Set(['legal', 'thanks', 'ar', 'embed', 'hub', 'faq', 'glossary']);
  const NO_CARD = new Set(['home', 'legal', 'thanks', 'ar', 'embed']);
  const MIN_WORDS = { service: [700, 600], audience: [700, 600], zone: [700, 600], guide: [1200, 1000], case: [900, 800], hub: [250, 200] };
  const words = (s) => String(s).replace(/\{\{[^}]+\}\}/g, 'x').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length;
  const strings = (o, out = []) => {
    if (typeof o === 'string') out.push(o);
    else if (Array.isArray(o)) o.forEach((x) => strings(x, out));
    else if (o && typeof o === 'object') Object.values(o).forEach((x) => strings(x, out));
    return out;
  };
  const checkTokens = (id, lang, s) => {
    for (const m of s.matchAll(/\{\{([^}]*)\}\}/g)) {
      const [name, a, b] = m[1].split(':');
      const ok = (() => {
        switch (name) {
          case 'brand': case 'entity': case 'email': case 'phone': case 'whatsapp': case 'volume': case 'volumeUnit': case 'year': return !a;
          case 'price': { const p = pricing.packs.find((x) => x.id === a); return !!p && (b === undefined || (p.tiers && p.tiers[+b])); }
          case 'extra': return pricing.extras.some((x) => x.id === a);
          case 'delivery': case 'revisions': return pricing.packs.some((x) => x.id === a);
          case 'villa': return a in villa.specs;
          case 'file': return a in villa.files;
          case 'legal': return a in site.legal;
          default: return false;
        }
      })();
      if (!ok) E(id, lang, `unknown/unresolvable token {{${m[1]}}}`);
    }
  };
  const checkLinks = (id, lang, s) => {
    for (const m of s.matchAll(/\]\(([^)]+)\)/g)) {
      const href = m[1];
      if (href.startsWith('@')) {
        const [pid, anchor] = href.slice(1).split('#');
        const r = routeById[pid];
        if (!r) { E(id, lang, `link to unknown page id @${pid}`); continue; }
        if (!r[lang]) E(id, lang, `link @${pid} has no ${lang} version`);
        if (pid === 'glosario' && anchor && glossaryIds && !glossaryIds.has(anchor)) E(id, lang, `unknown glossary term #${anchor}`);
        if (pid === 'glosario' && !anchor) W(id, lang, 'glossary link without #term');
      } else if (!/^https:\/\//.test(href)) E(id, lang, `link must be @id or https URL: ${href}`);
    }
  };
  const checkText = (id, lang, s) => {
    if (/[—–]/.test(s)) E(id, lang, `em/en dash in: «${s.slice(0, 70)}…»`);
    for (const re of BANNED) if (re.test(s)) E(id, lang, `banned word ${re} in: «${s.slice(0, 60)}…»`);
    if (/<[a-z][^>]*>/i.test(s)) E(id, lang, `raw HTML in: «${s.slice(0, 60)}…»`);
    if (/\.\.\./.test(s)) W(id, lang, 'use the … character instead of "..."');
    if (lang === 'es' && /"[^"]+"/.test(s)) W(id, lang, `straight quotes (use « »): «${s.slice(0, 50)}…»`);
    if (lang === 'en' && /(^|\s)"[^"]+"/.test(s)) W(id, lang, `straight quotes (use “ ”): «${s.slice(0, 50)}…»`);
    if (/\bEstudio 3D\b/.test(s)) E(id, lang, 'literal brand name: use {{brand}}');
    checkTokens(id, lang, s);
    checkLinks(id, lang, s);
  };
  const seen = { titles: new Map(), descs: new Map() };
  const checkLang = (doc, route, lang) => {
    const id = doc.id, L = doc[lang], t = route.template;
    if (!L) return E(id, lang, 'missing language block');
    const need = (k, cond = true) => { if (cond && (L[k] == null || L[k] === '')) E(id, lang, `missing ${k}`); };
    need('title'); need('description'); need('h1'); need('lead'); need('blocks');
    need('card', !NO_CARD.has(t));
    need('facts', (!NO_FACTS.has(t) && !NO_CARD.has(t)) || t === 'home');
    need('faq', !NO_FAQ.has(t));
    need('related', !['legal', 'thanks', 'ar', 'embed'].includes(t));
    if (L.title) {
      const n = L.title.length;
      if (!L.title.includes('{{brand}}') && (n < 30 || n > 55)) W(id, lang, `title ${n} chars (30–55 without brand)`);
      if (seen.titles.has(L.title)) E(id, lang, `duplicate title with ${seen.titles.get(L.title)}`); else seen.titles.set(L.title, `${id}[${lang}]`);
    }
    if (L.description) {
      const n = L.description.length;
      if (n < 110 || n > 160) W(id, lang, `description ${n} chars (120–155)`);
      if (seen.descs.has(L.description)) E(id, lang, `duplicate description with ${seen.descs.get(L.description)}`); else seen.descs.set(L.description, `${id}[${lang}]`);
    }
    if (L.h1 && L.h1.length > (t === 'home' ? 40 : 64)) W(id, lang, `h1 ${L.h1.length} chars`);
    if (L.lead) { const w = words(L.lead); if (w > 64 || w < 20) W(id, lang, `lead ${w} words (25–60)`); }
    if (L.facts) {
      if (!Array.isArray(L.facts) || L.facts.some((f) => !Array.isArray(f) || f.length !== 2)) E(id, lang, 'facts must be [label, value] pairs');
      else if (L.facts.length < 4 || L.facts.length > 8) W(id, lang, `facts ${L.facts.length} pairs (4–8)`);
    }
    if (L.card && (!L.card.title || !L.card.summary)) E(id, lang, 'card needs title and summary');
    if (L.hero?.image && !IMAGES.has(L.hero.image)) E(id, lang, `unknown hero image ${L.hero.image}`);
    for (const [i, b] of (L.blocks || []).entries()) {
      if (!BLOCKS[b.type]) { E(id, lang, `block #${i}: unknown type "${b.type}"`); continue; }
      for (const k of BLOCKS[b.type]) if (b[k] == null || b[k] === '') E(id, lang, `block #${i} (${b.type}) missing ${k}`);
      if (b.type === 'figure' && !IMAGES.has(b.image)) E(id, lang, `block #${i}: unknown image ${b.image}`);
      if (b.type === 'gallery') for (const it of b.items || []) if (!IMAGES.has(it.image)) E(id, lang, `gallery: unknown image ${it.image}`);
      if (b.type === 'pages') for (const pid of b.ids || []) if (!routeById[pid]?.[lang]) E(id, lang, `pages block: @${pid} missing in ${lang}`);
      if (b.type === 'table' && Array.isArray(b.head) && Array.isArray(b.rows)) for (const row of b.rows) if (row.length !== b.head.length) E(id, lang, `table "${b.caption}": row has ${row.length} cells, head has ${b.head.length}`);
      if (b.type === 'answer' && b.answer) { const w = words(b.answer); if (w < 25 || w > 75) W(id, lang, `answer block "${b.h2}" ${w} words (40–60)`); }
      if (b.type === 'stat' && !/^https:\/\//.test(b.source?.url || '')) E(id, lang, 'stat needs source.url (https)');
      if (b.type === 'pricing' && !['excerpt', 'full'].includes(b.variant)) E(id, lang, 'pricing.variant must be excerpt|full');
    }
    if (L.faq) {
      if (!NO_FAQ.has(t) && (L.faq.length < 6 || L.faq.length > 10)) W(id, lang, `faq ${L.faq.length} items (6–10)`);
      for (const f of L.faq) {
        if (!f.q || !f.a) { E(id, lang, 'faq item needs q and a'); continue; }
        const w = words(f.a); if (w < 35 || w > 95) W(id, lang, `faq answer ${w} words (40–80): «${f.q.slice(0, 50)}»`);
      }
    }
    for (const x of L.related || []) if (!routeById[x]?.[lang]) E(id, lang, `related @${x} missing in ${lang}`);
    for (const s of strings(L)) checkText(id, lang, s);
    const min = MIN_WORDS[t];
    if (min) {
      const total = words(strings({ lead: L.lead, blocks: L.blocks, faq: L.faq }).join(' '));
      const needW = lang === 'es' ? min[0] : min[1];
      if (total < needW) W(id, lang, `only ${total} words (min ${needW} for ${t})`);
    }
  };
  for (const [id, doc] of allDocs) {
    const route = routeById[id];
    if (!route) { E(id, null, 'id not in routes.mjs'); continue; }
    if (!doc || typeof doc !== 'object') { E(id, null, 'default export missing'); continue; }
    if (doc.id !== id) E(id, null, `export id "${doc.id}" ≠ filename`);
    if (doc.image && !IMAGES.has(doc.image)) E(id, null, `unknown image key ${doc.image}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.dateModified || '')) E(id, null, 'dateModified YYYY-MM-DD required');
    for (const lang of site.langs) {
      if (route[lang]) checkLang(doc, route, lang);
      else if (doc[lang]) E(id, lang, `routes.mjs has no ${lang} path: remove this language block`);
    }
  }
  return { errors, warnings: warns };
}
