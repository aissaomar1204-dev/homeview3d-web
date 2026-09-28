/* ═══════════════════════════════════════════════════════════════
   Machine outputs (owner: GEO). BUILD-SPEC §9, 04-geo §3-§5.
   await writeMachineOutputs(entries, env) writes into dist/:
     robots.txt                 ONE rules array → `*` group + explicit bots group (identical) + Bytespider blocked
     sitemap.xml                sitemap index → sitemap-pages.xml (hreflang, lastmod = dateModified) + sitemap-images.xml
     llms.txt                   bilingual index (04 §4.3), < 10 KB
     llms-full.txt, en/llms-full.txt   the full content, ONE FILE PER LANGUAGE (see LLMS_FULL below)
     <path>index.md             Markdown mirror per indexable page
     feed.xml, en/feed.xml      RSS 2.0 (guides + case) per language
     <indexNowKey>.txt, indexnow-manifest.json (url → sha256 of the markdown), indexnow-pending.json
     _headers                   security headers + per-page CSP (hashes of the inline scripts found in dist HTML)
     _redirects                 from routes.mjs `redirects` + per-language 404 fallbacks (/en/* → /en/404.html)
     site.webmanifest           PNG icons 192/512 (purpose "any maskable")
   env: { dist?, context? (defaults to process.env.CONTEXT), fetchLive? (default true), log?,
          notFound? ([{ lang, path }] 404 pages written by the engine; default /404.html + /<lang>/404.html) }
   Returns { context, placeholders, indexable, markdown, indexNowPending, indexNowBasis, cspHashes, files, warnings }.
   "Indexable" = route-level (routes.mjs index !== false, real page template). While
   hasPlaceholders() is true every page carries `noindex`, but these files are still generated
   (llms.txt then starts with a preview comment) so previews show the real outputs.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { site, hasPlaceholders } from '../data/site.mjs';
import { routes, routeById, redirects } from '../data/routes.mjs';
import { pricing, packById } from '../data/pricing.mjs';
import { villa } from '../data/villa.mjs';
import { blocksToMarkdown, setRegistry, helpers, markdownPath, fmtMB, fmtNumber, ROOT, LOCALE } from './markdown.mjs';

/* ── Shared definitions (also used by build/check.mjs) ────────── */
const UTILITY_TEMPLATES = new Set(['thanks', 'ar', 'embed', 'notfound']);
/** Route-level indexability for a page id + language. */
export function routeIndexable(id, lang) {
  const r = routeById[id];
  return !!(r && r[lang] && r.index !== false && !UTILITY_TEMPLATES.has(r.template));
}
export const isIndexableEntry = (e) => routeIndexable(e.id, e.lang);

/** Directories that hold embeddable pages (/embed/, /en/embed/), derived from routes. */
export const embedPrefixes = () => [...new Set(routes.filter((r) => r.template === 'embed')
  .flatMap((r) => site.langs.map((l) => r[l]).filter(Boolean))
  .map((p) => `${path.posix.dirname(p.replace(/\/$/, ''))}/`.replace(/\/{2,}/g, '/')))];

/** User agents that get the explicit "allowed" group (04-geo §3.1). */
export const ALLOWED_AGENTS = [
  'Googlebot', 'Googlebot-Image', 'Googlebot-Video', 'Bingbot', 'Applebot', 'DuckDuckBot', 'DuckAssistBot',
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'anthropic-ai', 'Claude-Web',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Google-CloudVertexBot',
  'meta-externalagent', 'meta-externalfetcher', 'Amazonbot', 'MistralAI-User', 'MistralAI-Index', 'CCBot', 'cohere-ai',
  'AI2Bot', 'Diffbot', 'YouBot', 'PhindBot', 'Kimi-SearchBot', 'PetalBot', 'Bravebot',
];
export const BLOCKED_AGENTS = ['Bytespider'];
export const CRITICAL_AGENTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot'];
/** THE rules array: every allowed group gets exactly these lines. */
export const robotsRules = () => [
  ['Allow', '/'],
  ['Disallow', '/models/'],
  ...embedPrefixes().map((p) => ['Disallow', p]),
  ['Disallow', '/.netlify/'],
];
export const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes';

/**
 * llms-full policy (04-geo §4.2 set "< 300 KB" for ONE bilingual file; with ~60 indexable pages the
 * bilingual file reached ~650 KB ≈ 170k tokens, more than most agents' fetch/context limits, and the
 * English half, being last, was the part that got truncated). Decision:
 *   - one file per language: /llms-full.txt (Spanish, default language) and /en/llms-full.txt,
 *     each self-contained (entity, key facts, contact once in the head), each linked from llms.txt;
 *   - only pages with their own substance: hubs (card lists that repeat the pages' summaries) and legal
 *     pages stay out (they remain in llms.txt and have their own index.md);
 *   - per page, the "keep reading" list and the repeated contact block are dropped, and a long paragraph,
 *     table or list already emitted in the same file becomes a one-line pointer to its first URL.
 * Target: ≤ 400 KB per file (≈ 100k tokens, fits the 128k+ windows of current assistants in one fetch).
 * The target is a warning, never an error: content quality wins over the file size.
 */
export const LLMS_FULL = {
  targetBytes: 400 * 1024,
  excludeTemplates: new Set(['legal', 'hub']),
  path: (lang) => (lang === site.defaultLang ? '/llms-full.txt' : `/${lang}/llms-full.txt`),
};

/* ── Small utilities ──────────────────────────────────────────── */
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const xml = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const rfc822 = (d) => new Date(`${d}T09:00:00Z`).toUTCString();
function writeFile(dist, rel, content) {
  const fp = path.join(dist, rel.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content);
  return rel;
}
const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const toUrlPath = (dist, file) => {
  const rel = `/${path.relative(dist, file).split(path.sep).join('/')}`;
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};

/* ── robots.txt ───────────────────────────────────────────────── */
export function robotsTxt() {
  const rules = robotsRules().map(([k, v]) => `${k}: ${v}`);
  const brand = site.brand.name;
  return [
    `# ${brand} · robots.txt · generated by build/lib/machine.mjs from one rules array`,
    '# B2B lead generation: search engines and AI assistants may read, cite and remember this site.',
    '# /models/ holds heavy 3D binaries (GLB/USDZ) and /embed/ the iframe viewer: no text for crawlers.',
    `# Content-Signal: ${CONTENT_SIGNAL}`,
    '',
    'User-agent: *',
    ...rules,
    '',
    '# Same rules, declared explicitly for search engines and AI assistants',
    ...ALLOWED_AGENTS.map((a) => `User-agent: ${a}`),
    ...rules,
    '',
    ...BLOCKED_AGENTS.map((a) => `User-agent: ${a}`),
    'Disallow: /',
    '',
    `Sitemap: ${site.domain}/sitemap.xml`,
    '',
  ].join('\n');
}

/* ── Sitemaps ─────────────────────────────────────────────────── */
function alternatesFor(e, byKey) {
  const out = [];
  for (const l of site.langs) {
    const tw = byKey.get(`${e.id}|${l}`);
    if (tw && isIndexableEntry(tw)) out.push([l, tw.url]);
  }
  if (out.length > 1) {
    const x = out.find(([l]) => l === site.xDefault) || out.find(([l]) => l === site.defaultLang);
    out.push(['x-default', x[1]]);
  }
  return out;
}
function sitemapPages(indexable, byKey) {
  const urls = indexable.map((e) => {
    const alts = alternatesFor(e, byKey);
    return [
      '  <url>',
      `    <loc>${xml(e.url)}</loc>`,
      e.dateModified ? `    <lastmod>${xml(e.dateModified)}</lastmod>` : null,
      ...alts.map(([l, u]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xml(u)}"/>`),
      '  </url>',
    ].filter(Boolean).join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}
function sitemapImages(indexable) {
  const urls = indexable.filter((e) => (e.images || []).length).map((e) => {
    const seen = new Set();
    const imgs = e.images.filter((im) => im?.url && !seen.has(im.url) && seen.add(im.url)).slice(0, 1000);
    return ['  <url>', `    <loc>${xml(e.url)}</loc>`, ...imgs.map((im) => `    <image:image><image:loc>${xml(im.url)}</image:loc></image:image>`), '  </url>'].join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`;
}
function sitemapIndex(indexable) {
  const last = indexable.map((e) => e.dateModified).filter(Boolean).sort().at(-1);
  const sm = (name) => `  <sitemap>\n    <loc>${xml(`${site.domain}/${name}`)}</loc>${last ? `\n    <lastmod>${last}</lastmod>` : ''}\n  </sitemap>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm('sitemap-pages.xml')}\n${sm('sitemap-images.xml')}\n</sitemapindex>\n`;
}

/* ── llms.txt ─────────────────────────────────────────────────── */
const PREVIEW_COMMENT = '<!-- VISTA PREVIA / PREVIEW: marca, dominio, contacto o datos legales todavía provisionales (build/data/site.mjs). No es la versión de lanzamiento. -->';

function linkLine(e, h, withNote = true) {
  const card = e.page?.card;
  const title = h.plain(card?.title || e.page?.breadcrumb || e.h1 || e.title);
  const note = !withNote ? '' : card?.summary ? h.plain(card.summary) : (e.description || '');
  return `- [${title}](${e.url})${note ? `: ${note}` : ''}`;
}
/** "Full content" line for llms.txt / llms-full heads, only with the files actually written. */
function fullLine(lang, fullLangs) {
  const name = { es: { es: 'español', en: 'English' }, en: { es: 'Spanish', en: 'English' } }[lang] || {};
  const order = [lang, ...fullLangs.filter((l) => l !== lang)].filter((l) => fullLangs.includes(l));
  const list = order.map((l) => `${site.domain}${LLMS_FULL.path(l)} (${name[l] || l})`).join(lang === 'es' ? ' y ' : ' and ');
  if (!list) return null;
  return lang === 'es'
    ? `- Cada página tiene una versión Markdown en <ruta>/index.md. Todo el contenido, un fichero por idioma: ${list}.`
    : `- Every page has a Markdown version at <path>/index.md. Full content, one file per language: ${list}.`;
}
function keyFacts(lang, h, fullLangs = site.langs) {
  const p = (id) => h.tokens(`{{price:${id}}}`);
  const d = (id) => h.tokens(`{{delivery:${id}}}`);
  const pk = (id) => packById(id);
  const sp = villa.specs;
  const tiers = (id) => (pk(id).tiers?.[0]?.maxM2 ? (lang === 'es' ? ` (hasta ${pk(id).tiers[0].maxM2} m²)` : ` (up to ${pk(id).tiers[0].maxM2} m²)`) : '');
  const contact = h.absHref('contacto');
  if (lang === 'es') {
    return [
      `- Entrada mínima: un plano 2D (PDF, JPG o PNG). Las fotos y las cotas son opcionales: las medidas se estiman con la escala del plano (≈).`,
      `- Entregables: modelo 3D amueblado (GLB y USDZ), renders fotorrealistas en 4K, visor 3D web con lista de estancias, recorrido guiado y modo maqueta (muros cortados a ${fmtNumber(sp.cutHeight, 'es')} m), realidad aumentada sin app a escala 1:20 o a tamaño real y home staging virtual sobre el mismo modelo.`,
      `- Precios sin IVA: ${pk('plano3d').name.es} ${p('plano3d')} ${pk('plano3d').unit.es}${tiers('plano3d')}; ${pk('maqueta').name.es} ${p('maqueta')} ${pk('maqueta').unit.es}${tiers('maqueta')}; ${pk('promocion').name.es} desde ${p('promocion')} (${pk('promocion').unit.es}); ${pricing.volume.name.es} por ${h.tokens('{{volume}}')}.`,
      `- Plazos: ${d('plano3d')} (${pk('plano3d').name.es}), ${d('maqueta')} (${pk('maqueta').name.es}), ${d('promocion')} (${pk('promocion').name.es}).`,
      `- Método: modelado por código (Blender 5 y Python), texturas PBR procedurales propias sin bancos de imágenes, render en Cycles y exportación optimizada para web y realidad aumentada (glTF/GLB y USDZ).`,
      `- Realidad aumentada: iPhone y iPad con AR Quick Look (USDZ), Android con Scene Viewer (GLB). En ordenador se muestra un código QR.`,
      `- Caso demostrativo: villa anonimizada en la Costa del Sol (${villa.scope.es}), ≈ ${fmtNumber(sp.interiorM2, 'es')} m² interiores y ≈ ${fmtNumber(sp.terracesM2, 'es')} m² de terrazas, ${sp.rooms} estancias, ${sp.textures} texturas procedurales, modelo web GLB de ${fmtMB(villa.files.glb.bytes, 'es')}. Partió de ${sp.input.es}.`,
      `- Próximamente: vídeos cinematográficos con IA a partir de los renders y tours de realidad virtual 360°.`,
      `- Zona: ${site.areaServed.es.slice(0, -1).join(', ')} y el resto de España en remoto. Idiomas: español e inglés.`,
      `- Contacto: ${site.contact.email} · ${site.contact.phoneDisplay} · WhatsApp https://wa.me/${site.contact.whatsapp}${contact ? ` · ${contact}` : ''}`,
      fullLine('es', fullLangs),
    ].filter(Boolean);
  }
  return [
    `- Minimum input: a 2D floor plan (PDF, JPG or PNG). Photos and dimensions are optional: measurements are estimated from the plan's scale (≈).`,
    `- Deliverables: furnished 3D model (GLB and USDZ), photorealistic 4K renders, web 3D viewer with a room list, guided tour and cut-away mode (walls cut at ${fmtNumber(sp.cutHeight, 'en')} m), app-free augmented reality at 1:20 or real size, and virtual staging on the same model.`,
    `- Prices excluding VAT: ${pk('plano3d').name.en} ${p('plano3d')} ${pk('plano3d').unit.en}${tiers('plano3d')}; ${pk('maqueta').name.en} ${p('maqueta')} ${pk('maqueta').unit.en}${tiers('maqueta')}; ${pk('promocion').name.en} from ${p('promocion')} (${pk('promocion').unit.en}); ${pricing.volume.name.en} for ${h.tokens('{{volume}}')}.`,
    `- Turnaround: ${d('plano3d')} (${pk('plano3d').name.en}), ${d('maqueta')} (${pk('maqueta').name.en}), ${d('promocion')} (${pk('promocion').name.en}).`,
    `- Method: code-driven modelling (Blender 5 and Python), in-house procedural PBR textures with no stock libraries, Cycles rendering and optimised web/AR export (glTF/GLB and USDZ).`,
    `- Augmented reality: iPhone and iPad through AR Quick Look (USDZ), Android through Scene Viewer (GLB). Computers show a QR code.`,
    `- Demo case: anonymised Costa del Sol villa (${villa.scope.en}), ≈ ${fmtNumber(sp.interiorM2, 'en')} m² indoors and ≈ ${fmtNumber(sp.terracesM2, 'en')} m² of terraces, ${sp.rooms} rooms, ${sp.textures} procedural textures, ${fmtMB(villa.files.glb.bytes, 'en')} GLB web model. Built from ${sp.input.en}.`,
    `- Coming soon: AI cinematic videos generated from the renders and 360° virtual reality tours.`,
    `- Area: ${site.areaServed.en.slice(0, -1).join(', ')} and the rest of Spain remotely. Languages: Spanish and English.`,
    `- Contact: ${site.contact.email} · ${site.contact.phoneDisplay} · WhatsApp https://wa.me/${site.contact.whatsapp}${contact ? ` · ${contact}` : ''}`,
    fullLine('en', fullLangs),
  ].filter(Boolean);
}
export function llmsTxt(indexable, placeholders, fullLangs = site.langs) {
  const get = (id, lang) => indexable.find((e) => e.id === id && e.lang === lang);
  const ctxFor = (lang) => indexable.find((e) => e.lang === lang && e.ctx)?.ctx;
  const hs = helpers(ctxFor('es'), 'es');
  const he = helpers(ctxFor('en'), 'en');
  const brand = site.brand.name;
  const lines = [];
  if (placeholders) lines.push(PREVIEW_COMMENT, '');
  lines.push(`# ${brand}`, '');
  const fromPrice = (h) => h.tokens(`{{price:${pricing.packs[0].id}}}`);
  lines.push(`> ${hs.plain(site.entity.es)} Precios públicos sin IVA desde ${fromPrice(hs)}; ${packById('maqueta').name.es} ${hs.tokens('{{price:maqueta}}')} por vivienda, entrega en ${hs.tokens('{{delivery:maqueta}}')}.`);
  lines.push(`> EN: ${he.plain(site.entity.en)} Public pricing excluding VAT from ${fromPrice(he)}; ${packById('maqueta').name.en} ${he.tokens('{{price:maqueta}}')} per home, delivered in ${he.tokens('{{delivery:maqueta}}')}.`);
  lines.push('', 'Datos clave:', ...keyFacts('es', hs, fullLangs), '');

  // Notes (card summaries) only where they add facts; hubs, guides and reference pages are listed by title
  // so the file stays under ~10 KB (llmstxt.org: a concise index).
  const section = (title, items, h) => {
    const ls = items.filter(Boolean).map((e) => linkLine(e, h, !['hub', 'guide', 'glossary', 'faq', 'contact'].includes(e.template)));
    if (ls.length) lines.push(`## ${title}`, ...ls, '');
  };
  const byTemplate = (t, lang) => routes.filter((r) => r.template === t).map((r) => get(r.id, lang));
  const ids = (list, lang) => list.map((id) => get(id, lang));

  section('Servicios', [get('servicios', 'es'), ...byTemplate('service', 'es')], hs);
  section('Precios y proceso', ids(['precios', 'como-funciona'], 'es'), hs);
  section('Caso demostrativo', ids(['caso-villa'], 'es'), hs);
  section('Para inmobiliarias, promotoras y arquitectos', [get('soluciones', 'es'), ...byTemplate('audience', 'es')], hs);
  section('Zonas', [get('zonas', 'es'), ...byTemplate('zone', 'es')], hs);
  section('Guías y comparativas', [get('guias', 'es'), ...byTemplate('guide', 'es')], hs);
  section('Referencia', ids(['glosario', 'faq', 'contacto'], 'es'), hs);

  // English block: blockquote facts + EN pages
  const en = indexable.filter((e) => e.lang === 'en' && !['legal', 'about'].includes(e.template));
  if (en.length) {
    lines.push('## English');
    const order = ['home', 'servicios', ...routes.filter((r) => r.template === 'service').map((r) => r.id), 'precios', 'como-funciona', 'caso-villa',
      ...routes.filter((r) => ['audience', 'zone'].includes(r.template)).map((r) => r.id), 'guias', ...routes.filter((r) => r.template === 'guide').map((r) => r.id), 'glosario', 'faq', 'contacto'];
    const enLines = order.map((id) => get(id, 'en')).filter(Boolean).map((e) => linkLine(e, he, false));
    if (fullLangs.includes('en')) enLines.push(`- [Full English content in one file](${site.domain}${LLMS_FULL.path('en')}): every English page above as Markdown`);
    lines.push(...enLines, '');
  }
  const optional = [...ids(['sobre-nosotros', 'aviso-legal', 'privacidad', 'cookies'], 'es'), ...ids(['sobre-nosotros', 'aviso-legal', 'privacidad', 'cookies'], 'en')].filter(Boolean);
  if (optional.length) lines.push('## Optional', ...optional.map((e) => linkLine(e, e.lang === 'es' ? hs : he, false)), '');
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

/**
 * Full content of ONE language as Markdown (policy: LLMS_FULL above).
 * @param {string} lang
 * @param {object[]} pages indexable entries of that language that have a Markdown mirror
 * @param {Map} mdByKey `${id}|${lang}` → Markdown
 */
function llmsFullTxt(lang, pages, mdByKey, placeholders, fullLangs) {
  const h = helpers(pages.find((e) => e.ctx)?.ctx, lang);
  const es = lang === 'es';
  const included = pages.filter((e) => !LLMS_FULL.excludeTemplates.has(e.template));
  const left = pages.filter((e) => LLMS_FULL.excludeTemplates.has(e.template));
  const head = [];
  if (placeholders) head.push(PREVIEW_COMMENT, '');
  head.push(`# ${site.brand.name}: ${es ? 'contenido completo del sitio en español' : 'full site content in English'}`, '');
  head.push(`> ${h.plain(site.entity[lang])}`, '');
  head.push(es ? 'Datos clave:' : 'Key facts:', ...keyFacts(lang, h, fullLangs), '');
  head.push(es
    ? `${included.length} páginas en este fichero, cada una con su URL canónica. Índice: ${site.domain}/llms.txt. Fuera de este fichero (siguen en llms.txt y en su index.md): ${left.length ? left.map((e) => e.url).join(', ') : 'ninguna'}.`
    : `${included.length} pages in this file, each with its canonical URL. Index: ${site.domain}/llms.txt. Not in this file (still in llms.txt and in their own index.md): ${left.length ? left.map((e) => e.url).join(', ') : 'none'}.`);
  const DROP = /^## (Sigue leyendo|Keep reading|Contacto|Contact)\s*$/;
  const pointer = es ? 'Contenido compartido, igual que en' : 'Shared content, same as';
  const seen = new Map();
  const pagesMd = included.map((e) => {
    const [headPart, ...sections] = mdByKey.get(`${e.id}|${e.lang}`).trim().split(/\n(?=## )/);
    const out = [headPart];
    for (const sec of sections) {
      if (DROP.test(sec.split('\n', 1)[0])) continue;
      // Chunk-level dedupe: tables, lists and long paragraphs (> 250 chars) already emitted in this file.
      const chunks = [];
      let lastWasPointer = false;
      for (const chunk of sec.trim().split(/\n{2,}/)) {
        const key = chunk.replace(/\s+/g, ' ').trim();
        if (key.length > 250 && !chunk.startsWith('#') && seen.has(key)) {
          if (!lastWasPointer) chunks.push(`${pointer} ${seen.get(key)}`);
          lastWasPointer = true;
          continue;
        }
        if (key.length > 250 && !seen.has(key)) seen.set(key, e.url);
        chunks.push(chunk);
        lastWasPointer = false;
      }
      if (chunks.length > 1 || (chunks.length === 1 && !chunks[0].startsWith('## '))) out.push(chunks.join('\n\n'));
    }
    return out.join('\n\n');
  });
  return `${head.join('\n')}\n\n---\n\n${pagesMd.join('\n\n---\n\n')}\n`;
}

/* ── Feeds ────────────────────────────────────────────────────── */
function feedXml(lang, items, h) {
  const feedPath = lang === site.defaultLang ? '/feed.xml' : `/${lang}/feed.xml`;
  const home = h.absHref('home') || `${site.domain}/`;
  const title = lang === 'es' ? `${site.brand.name}: guías y casos` : `${site.brand.name}: guides and case studies`;
  const last = items.map((e) => e.dateModified).filter(Boolean).sort().at(-1);
  const body = items.map((e) => [
    '    <item>',
    `      <title>${xml(e.h1 || e.title)}</title>`,
    `      <link>${xml(e.url)}</link>`,
    `      <guid isPermaLink="true">${xml(e.url)}</guid>`,
    e.datePublished ? `      <pubDate>${rfc822(e.datePublished)}</pubDate>` : null,
    `      <description>${xml(e.description || e.lead || '')}</description>`,
    '    </item>',
  ].filter(Boolean).join('\n'));
  return {
    path: feedPath,
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${xml(title)}</title>\n    <link>${xml(home)}</link>\n    <atom:link href="${xml(site.domain + feedPath)}" rel="self" type="application/rss+xml"/>\n    <description>${xml(h.plain(site.entity[lang]))}</description>\n    <language>${LOCALE[lang]}</language>\n${last ? `    <lastBuildDate>${rfc822(last)}</lastBuildDate>\n` : ''}${body.join('\n')}\n  </channel>\n</rss>\n`,
  };
}

/* ── IndexNow ─────────────────────────────────────────────────── */
async function fetchLiveManifest(env) {
  const host = new URL(site.domain).hostname;
  if (site.domainPlaceholder || /\.(example|test|invalid|localhost)$/.test(host)) return { ok: false, reason: 'placeholder domain' };
  if (env.fetchLive === false || process.env.INDEXNOW_OFFLINE === '1') return { ok: false, reason: 'offline' };
  try {
    const res = await fetch(`${site.domain}/indexnow-manifest.json`, { signal: AbortSignal.timeout(5000), headers: { 'cache-control': 'no-cache' } });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const json = await res.json();
    return { ok: true, manifest: json.urls && typeof json.urls === 'object' ? json.urls : json };
  } catch (e) { return { ok: false, reason: e.name === 'TimeoutError' ? 'timeout' : e.message }; }
}

/* ── _headers ─────────────────────────────────────────────────── */
export function inlineScriptHashes(html) {
  const out = new Set();
  for (const m of String(html).matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue;
    const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1]?.toLowerCase();
    if (type && !['text/javascript', 'module', 'application/javascript', 'importmap'].includes(type)) continue; // data blocks (JSON-LD) are not executed
    if (!m[2].length) continue;
    out.add(crypto.createHash('sha256').update(m[2], 'utf8').digest('base64'));
  }
  return out;
}
function analyticsOrigins() {
  const a = site.analytics;
  if (!a) return [];
  if (a.provider === 'plausible') return [a.host || 'https://plausible.io'];
  return a.host ? [a.host] : [];
}
export function buildCsp({ hashes = [], frameAncestors = "'self'" } = {}) {
  const extra = analyticsOrigins();
  return [
    "default-src 'self'",
    `script-src ${["'self'", "'wasm-unsafe-eval'", ...[...hashes].sort().map((x) => `'sha256-${x}'`), ...extra].join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    `connect-src ${["'self'", 'data:', 'blob:', ...extra].join(' ')}`,
    "worker-src 'self' blob:",
    "font-src 'self'",
    `frame-ancestors ${frameAncestors}`,
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ');
}
const MIME = {
  '.glb': 'model/gltf-binary', '.usdz': 'model/vnd.usdz+zip', '.gltf': 'model/gltf+json', '.json': 'application/json; charset=utf-8',
};
function headersFile(dist, htmlFiles, extraHtml, mdPaths, keyFile, llmsPaths = ['/llms.txt', '/llms-full.txt']) {
  const hashes = new Set();
  for (const f of htmlFiles) for (const x of inlineScriptHashes(fs.readFileSync(f, 'utf8'))) hashes.add(x);
  for (const html of extraHtml) for (const x of inlineScriptHashes(html)) hashes.add(x);
  const embeds = embedPrefixes();
  const pagePaths = [...new Set(htmlFiles.map((f) => toUrlPath(dist, f)))].filter((p) => !embeds.some((e) => p.startsWith(e))).sort();
  const cspPage = buildCsp({ hashes, frameAncestors: "'self'" });
  const cspEmbed = buildCsp({ hashes, frameAncestors: '*' });
  const block = (p, lines) => [p, ...lines.map((l) => `  ${l}`), ''].join('\n');
  const out = [
    '# Generated by build/lib/machine.mjs. Do not edit: change the generator instead.',
    '# Netlify merges every matching rule and joins repeated header names with commas,',
    '# so each header name is defined in rules that never overlap (CSP is set per page path;',
    '# /embed/ pages get their own CSP with frame-ancestors *). No X-Frame-Options anywhere.',
    '',
    block('/*', [
      'Strict-Transport-Security: max-age=63072000; includeSubDomains',
      'X-Content-Type-Options: nosniff',
      'Referrer-Policy: strict-origin-when-cross-origin',
      'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), xr-spatial-tracking=(self)',
      'Cross-Origin-Opener-Policy: same-origin',
    ]),
    '# HTML pages: CSP + revalidate',
    ...pagePaths.map((p) => block(p, [`Content-Security-Policy: ${cspPage}`, 'Cache-Control: public, max-age=0, must-revalidate'])),
    '# Embeddable viewer: can be framed by any site, never indexed',
    ...embeds.map((p) => block(`${p}*`, [`Content-Security-Policy: ${cspEmbed}`, 'X-Robots-Tag: noindex', 'Cache-Control: public, max-age=0, must-revalidate'])),
    '# Hashed, immutable assets',
    block('/assets/*', ['Cache-Control: public, max-age=31536000, immutable']),
    block('/lib/*', ['Cache-Control: public, max-age=31536000, immutable', 'Access-Control-Allow-Origin: *']),
    '# 3D models: stable URLs (AR links, QR codes, third-party embeds)',
    block('/models/*', ['Access-Control-Allow-Origin: *', 'Cross-Origin-Resource-Policy: cross-origin', 'Cache-Control: public, max-age=86400, stale-while-revalidate=604800', 'X-Robots-Tag: noindex']),
  ];
  const models = walk(path.join(dist, 'models')).filter((f) => MIME[path.extname(f).toLowerCase()]);
  for (const f of models.sort()) out.push(block(toUrlPath(dist, f), [`Content-Type: ${MIME[path.extname(f).toLowerCase()]}`]));
  out.push('# Machine-readable files for agents: readable, never indexed');
  for (const p of llmsPaths) out.push(block(p, ['Content-Type: text/plain; charset=utf-8', 'X-Robots-Tag: noindex', 'Cache-Control: public, max-age=3600']));
  for (const p of mdPaths.sort()) out.push(block(p, ['Content-Type: text/markdown; charset=utf-8', 'X-Robots-Tag: noindex', 'Cache-Control: public, max-age=3600']));
  for (const p of ['/indexnow-manifest.json', '/indexnow-pending.json']) out.push(block(p, ['Content-Type: application/json; charset=utf-8', 'X-Robots-Tag: noindex', 'Cache-Control: public, max-age=0, must-revalidate']));
  out.push(block(keyFile, ['Content-Type: text/plain; charset=utf-8', 'X-Robots-Tag: noindex']));
  for (const p of ['/feed.xml', '/en/feed.xml']) if (fs.existsSync(path.join(dist, p))) out.push(block(p, ['Content-Type: application/rss+xml; charset=utf-8', 'Cache-Control: public, max-age=3600']));
  out.push(block('/site.webmanifest', ['Content-Type: application/manifest+json; charset=utf-8', 'Cache-Control: public, max-age=86400']));
  return { text: out.join('\n'), hashes: [...hashes] };
}

/* ── _redirects ───────────────────────────────────────────────── */
/**
 * routes.mjs `redirects` (301) first, then one 404 fallback per language, most specific prefix first:
 *   /en/*  /en/404.html  404      (English visitors get the English 404)
 *   /*     /404.html     404      (Netlify's default, stated explicitly so the order is visible)
 * None is forced ("!"): Netlify only applies a non-forced rule when no file exists at the path, so real
 * pages, assets, /models/, llms*.txt and the index.md mirrors are never shadowed. Rewrites to a 404 page
 * keep the 404 status (not a soft 404). No 200 catch-all anywhere.
 * @param {string[]} notFound 404 page paths written by the engine (env.notFound[].path)
 */
export function redirectsFile(notFound = []) {
  const lines = ['# Generated by build/lib/machine.mjs from build/data/routes.mjs `redirects` + the per-language 404 pages.'];
  // Never forced ("!"): Netlify normalises URLs before matching, so forcing /index.html → / risks a loop.
  // When a file exists at the source (e.g. /index.html) the rule is shadowed and the page's canonical covers it.
  for (const r of redirects) lines.push(`${r.from}  ${r.to}  ${r.status || 301}`);
  const fallbacks = notFound
    .map((p) => ({ p, dir: path.posix.dirname(p) }))
    .sort((a, b) => b.dir.length - a.dir.length); // /en before /
  if (fallbacks.length) lines.push('', '# 404 fallbacks per language (most specific first; status 404, never 200)');
  for (const { p, dir } of fallbacks) lines.push(`${dir === '/' ? '' : dir}/*  ${p}  404`);
  return `${lines.join('\n')}\n`;
}

/* ── site.webmanifest ─────────────────────────────────────────── */
function tokenColour(name, fallback) {
  for (const f of [path.join(ROOT, 'src', 'css', '00-tokens.css'), path.join(ROOT, 'docs', 'design', 'tokens.css')]) {
    try { const m = fs.readFileSync(f, 'utf8').match(new RegExp(`${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`)); if (m) return m[1]; } catch { /* next */ }
  }
  return fallback;
}
function webmanifest(dist, h) {
  // PNG icons only (public/icon-192.png, icon-512.png from the assets pipeline): flat añil square with the
  // mark inside the maskable safe zone, so one file serves both purposes.
  const icons = [['/icon-192.png', '192x192'], ['/icon-512.png', '512x512']]
    .filter(([p]) => fs.existsSync(path.join(dist, p)))
    .map(([src, sizes]) => ({ src, sizes, type: 'image/png', purpose: 'any maskable' }));
  const m = {
    id: '/',
    name: site.brand.name,
    short_name: site.brand.name,
    description: h.plain(site.entity[site.defaultLang]),
    lang: site.defaultLang,
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: tokenColour('--color-bg', '#F4F5F6'),
    theme_color: tokenColour('--color-bg', '#F4F5F6'),
  };
  if (icons.length) m.icons = icons;
  return `${JSON.stringify(m, null, 2)}\n`;
}

/* ── Main ─────────────────────────────────────────────────────── */
export async function writeMachineOutputs(entries, env = {}) {
  const dist = path.resolve(env.dist || env.distDir || path.join(ROOT, 'dist'));
  const context = env.context || process.env.CONTEXT || 'dev';
  const log = env.log || ((m) => console.log(m));
  const placeholders = hasPlaceholders();
  const written = [];
  const warnings = [];
  fs.mkdirSync(dist, { recursive: true });
  setRegistry(entries);

  const byKey = new Map(entries.map((e) => [`${e.id}|${e.lang}`, e]));
  const rank = (e) => { const i = routes.findIndex((r) => r.id === e.id); return (site.langs.indexOf(e.lang) * 1000) + (i < 0 ? 999 : i); };
  const indexable = entries.filter(isIndexableEntry).sort((a, b) => rank(a) - rank(b));
  for (const e of indexable) if (!e.url) e.url = site.domain + e.path;

  // 1. Markdown mirrors
  const mdByKey = new Map();
  const mdPaths = [];
  for (const e of indexable) {
    let md;
    try { md = blocksToMarkdown(e, e.ctx, { entries }); }
    catch (err) { warnings.push(`index.md ${e.id}[${e.lang}]: ${err.message}`); continue; }
    mdByKey.set(`${e.id}|${e.lang}`, md);
    const p = markdownPath(e.path);
    written.push(writeFile(dist, p, md));
    mdPaths.push(p);
  }
  const withMd = indexable.filter((e) => mdByKey.has(`${e.id}|${e.lang}`));

  // 2. robots + sitemaps
  written.push(writeFile(dist, '/robots.txt', robotsTxt()));
  written.push(writeFile(dist, '/sitemap.xml', sitemapIndex(indexable)));
  written.push(writeFile(dist, '/sitemap-pages.xml', sitemapPages(indexable, byKey)));
  written.push(writeFile(dist, '/sitemap-images.xml', sitemapImages(indexable)));

  // 3. llms.txt (bilingual index) + llms-full per language (LLMS_FULL policy)
  const fullLangs = site.langs.filter((l) => withMd.some((e) => e.lang === l && !LLMS_FULL.excludeTemplates.has(e.template)));
  const fullPaths = [];
  for (const lang of fullLangs) {
    const full = llmsFullTxt(lang, withMd.filter((e) => e.lang === lang), mdByKey, placeholders, fullLangs);
    const p = LLMS_FULL.path(lang);
    const bytes = Buffer.byteLength(full);
    if (bytes > LLMS_FULL.targetBytes) warnings.push(`${p.slice(1)} is ${Math.round(bytes / 1024)} KB (> ${LLMS_FULL.targetBytes / 1024} KB target)`);
    written.push(writeFile(dist, p, full));
    fullPaths.push(p);
  }
  const llms = llmsTxt(withMd, placeholders, fullLangs);
  if (Buffer.byteLength(llms) > 10 * 1024) warnings.push(`llms.txt is ${Math.round(Buffer.byteLength(llms) / 1024)} KB (> 10 KB target)`);
  written.push(writeFile(dist, '/llms.txt', llms));

  // 4. feeds (guides + case), one per language
  for (const lang of site.langs) {
    const items = indexable.filter((e) => e.lang === lang && ['guide', 'case'].includes(e.template))
      .sort((a, b) => String(b.datePublished).localeCompare(String(a.datePublished)) || String(b.dateModified).localeCompare(String(a.dateModified)));
    if (!items.length) continue;
    const f = feedXml(lang, items, helpers(items[0].ctx, lang));
    written.push(writeFile(dist, f.path, f.xml));
  }

  // 5. IndexNow
  const key = site.indexNowKey;
  const keyFile = `/${key}.txt`;
  written.push(writeFile(dist, keyFile, key));
  const manifest = Object.fromEntries(withMd.map((e) => [e.url, sha256(mdByKey.get(`${e.id}|${e.lang}`))]).sort(([a], [b]) => a.localeCompare(b)));
  written.push(writeFile(dist, '/indexnow-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`));
  const live = await fetchLiveManifest(env);
  let urls = [];
  let basis;
  if (placeholders || site.domainPlaceholder) { basis = 'skipped: placeholders in build/data/site.mjs'; }
  else if (live.ok) {
    const prev = live.manifest;
    urls = [...Object.keys(manifest).filter((u) => prev[u] !== manifest[u]), ...Object.keys(prev).filter((u) => !(u in manifest))];
    basis = 'diff with the live manifest';
  } else { urls = Object.keys(manifest); basis = `all URLs (live manifest unavailable: ${live.reason})`; }
  const host = new URL(site.domain).host;
  const pending = { generatedAt: new Date().toISOString(), context, host, key, keyLocation: `${site.domain}${keyFile}`, basis, count: urls.length, urls: urls.slice(0, 10000) };
  written.push(writeFile(dist, '/indexnow-pending.json', `${JSON.stringify(pending, null, 2)}\n`));

  // 6. _redirects, webmanifest
  const notFound = (Array.isArray(env.notFound) && env.notFound.length ? env.notFound.map((n) => n.path) : ['/404.html', ...site.langs.filter((l) => l !== site.defaultLang).map((l) => `/${l}/404.html`)])
    .filter((p) => p && fs.existsSync(path.join(dist, p)));
  written.push(writeFile(dist, '/_redirects', redirectsFile(notFound)));
  written.push(writeFile(dist, '/site.webmanifest', webmanifest(dist, helpers(indexable.find((e) => e.lang === site.defaultLang)?.ctx, site.defaultLang))));

  // 7. _headers last (it lists the files written above and hashes the inline scripts of every HTML page)
  const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
  const extraHtml = entries.map((e) => e.html).filter((x) => typeof x === 'string');
  const headers = headersFile(dist, htmlFiles, extraHtml, mdPaths, keyFile, ['/llms.txt', ...fullPaths]);
  written.push(writeFile(dist, '/_headers', headers.text));

  const summary = {
    context, placeholders, indexable: indexable.length, markdown: mdPaths.length, indexNowPending: urls.length, indexNowBasis: basis,
    cspHashes: headers.hashes.length, files: written.length, warnings,
  };
  log(`  machine outputs: ${written.length} files · ${indexable.length} indexable pages · ${mdPaths.length} index.md · IndexNow ${urls.length} pending (${basis}) · CSP ${headers.hashes.length} inline hash(es)${placeholders ? ' · llms.txt marked as PREVIEW' : ''}`);
  for (const w of warnings) log(`  ! ${w}`);
  return summary;
}
