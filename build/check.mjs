#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Post-build QA (owner: GEO): node build/check.mjs [distDir] [flags]
   BUILD-SPEC §9 + §11, 05-playbook §5.3 (25 checks), 04-geo §11, then
   runs scripts/design-lint.mjs and merges its result. Exit 1 on errors.

   Flags
     --placeholders-ok   placeholders never fail (same as ALLOW_PLACEHOLDERS=1)
     --production        simulate the Netlify production context
     --no-lint           skip the design lint
     --verbose           print every finding (default: 25 per category)
     --json <file>       also write the report as JSON
   Report
     Findings are grouped by OWNER (engine, viewer, content, assets, geo, launch: see OWNERS
     near the end), each line tagged with its category; content findings name the content
     file, over-budget pages list their heaviest parts. --json adds `byOwner` for dispatching.
   Modes
     PRODUCTION = CONTEXT=production (Netlify) or --production.
     In PRODUCTION, unless ALLOW_PLACEHOLDERS=1 or --placeholders-ok,
     every placeholder (site.mjs flags, [NIF], .example domain…) is an ERROR.
     Elsewhere placeholders are reported as warnings.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { site, hasPlaceholders } from './data/site.mjs';
import { routes, routeById, redirects as routeRedirects } from './data/routes.mjs';
import { pricing, formatPrice } from './data/pricing.mjs';
import { villa } from './data/villa.mjs';
import {
  routeIndexable, embedPrefixes, ALLOWED_AGENTS, BLOCKED_AGENTS, CRITICAL_AGENTS, inlineScriptHashes, LLMS_FULL, LLMS_INDEX, EMBED_ROBOTS, CONTENT_SIGNAL,
} from './lib/machine.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

/* ── Arguments and mode ───────────────────────────────────────── */
const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const optVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const positional = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--json');
const DIST = path.resolve(positional[0] || path.join(ROOT, process.env.OUT_DIR || 'dist'));
const PRODUCTION = process.env.CONTEXT === 'production' || flag('--production');
const PLACEHOLDERS_FAIL = PRODUCTION && process.env.ALLOW_PLACEHOLDERS !== '1' && !flag('--placeholders-ok');
const PLACEHOLDERS = hasPlaceholders();
const VERBOSE = flag('--verbose');
const DOMAIN = site.domain.replace(/\/$/, '');
const HOST = new URL(DOMAIN).host;

if (!fs.existsSync(DIST)) { console.error(`check: ${DIST} does not exist. Run "npm run build" first.`); process.exit(1); }

/* ── Report ───────────────────────────────────────────────────── */
const CATS = ['links', 'structure', 'meta', 'schema', 'content', 'images', 'budgets', 'discovery', 'headers', 'redirects', 'orphans', 'forms', '3d', 'placeholders', 'design-lint'];
const report = Object.fromEntries(CATS.map((c) => [c, { errors: [], warnings: [] }]));
const rel = (p) => (p ? path.relative(DIST, p).split(path.sep).join('/') || '.' : '');
/** Findings are { where, msg, owner? }: `owner` forces the owner, otherwise ownerOf() decides (see Owners). */
const err = (cat, where, msg, owner) => report[cat].errors.push({ where: String(where).replace(/\\/g, '/'), msg, owner });
const warn = (cat, where, msg, owner) => report[cat].warnings.push({ where: String(where).replace(/\\/g, '/'), msg, owner });
const info = [];

/* ── Helpers ──────────────────────────────────────────────────── */
const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', laquo: '«', raquo: '»', hellip: '…', middot: '·', euro: '€', times: '×' };
const decode = (s) => String(s ?? '')
  .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const parseAttrs = (s) => {
  const o = {};
  for (const m of String(s).matchAll(/([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) o[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  return o;
};
const tagsOf = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map((m) => ({ a: parseAttrs(m[1]), raw: m[0], index: m.index }));
const stripNonVisible = (html) => html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ');
const textOf = (html) => decode(stripNonVisible(html).replace(/<[^>]+>/g, ' ')).replace(/[\u00a0\u202f]/g, ' ').replace(/\s+/g, ' ').trim();
const norm = (s) => decode(String(s ?? '')).toLowerCase().normalize('NFC').replace(/[\u00a0\u202f]/g, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const words = (s) => String(s ?? '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const size = (p) => { try { return fs.statSync(p).size; } catch { return 0; } };

/** Resolve a URL path inside dist: page dir (index.html), file, or null. */
function distFile(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath.split('#')[0].split('?')[0]); } catch { p = urlPath.split('#')[0].split('?')[0]; }
  if (!p.startsWith('/')) return null;
  const fp = path.join(DIST, p);
  if (p.endsWith('/')) { const ix = path.join(fp, 'index.html'); return fs.existsSync(ix) ? ix : null; }
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) return fp;
  if (fs.existsSync(path.join(fp, 'index.html'))) return path.join(fp, 'index.html');
  return null;
}
/** Classify a reference found in a page. */
function classify(ref, fromPath) {
  const r = ref.trim();
  if (!r) return { kind: 'empty' };
  if (/^javascript:/i.test(r)) return { kind: 'js' };
  if (/^(mailto:|tel:|sms:|data:|blob:|about:)/i.test(r)) return { kind: 'skip' };
  if (/^intent:/i.test(r)) { const m = r.match(/[?&]file=([^&#;]+)/); return m ? classify(decodeURIComponent(m[1]), fromPath) : { kind: 'skip' }; }
  if (r.startsWith('#')) return { kind: 'anchor', path: fromPath, hash: r.slice(1) };
  if (/^https?:\/\//i.test(r) || r.startsWith('//')) {
    const u = new URL(r.startsWith('//') ? `https:${r}` : r);
    if (u.host === HOST) return { kind: 'internal', path: u.pathname, hash: decodeURIComponent(u.hash.slice(1)), abs: true, http: u.protocol === 'http:' };
    return { kind: 'external', http: u.protocol === 'http:' };
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(r)) return { kind: 'skip' };
  const u = new URL(r, `https://${HOST}${fromPath}`);
  return { kind: 'internal', path: u.pathname, hash: decodeURIComponent(u.hash.slice(1)), relative: !r.startsWith('/') };
}

/* ── Load pages ───────────────────────────────────────────────── */
const pathMap = new Map(); // url path → { id, lang, route }
for (const r of routes) for (const l of site.langs) if (r[l]) pathMap.set(r[l], { id: r.id, lang: l, route: r });

const allFiles = walk(DIST);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const pages = new Map(); // url path → page
for (const f of htmlFiles) {
  const r = `/${rel(f)}`;
  const urlPath = r.endsWith('/index.html') ? r.slice(0, -'index.html'.length) : r;
  const html = fs.readFileSync(f, 'utf8');
  const route = pathMap.get(urlPath) || null;
  const is404 = /(^|\/)404\.html$/.test(r);
  const metas = tagsOf(html, 'meta');
  const links = tagsOf(html, 'link');
  const metaContent = (k, v) => metas.find((m) => m.a[k] === v)?.a.content ?? null;
  const robots = (metaContent('name', 'robots') || '').toLowerCase();
  const ld = [...html.matchAll(/<script\b[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  pages.set(urlPath, {
    file: f, where: rel(f), urlPath, html, route, is404,
    id: route?.id, lang: route?.lang, template: route?.route.template,
    indexable: route ? routeIndexable(route.id, route.lang) : false,
    htmlLang: (html.match(/<html\b[^>]*\blang=["']?([a-zA-Z-]+)/i) || [])[1] || null,
    robots, noindex: /\bnoindex\b/.test(robots),
    title: decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim() || null,
    description: metaContent('name', 'description'),
    canonical: links.find((l) => (l.a.rel || '').split(/\s+/).includes('canonical'))?.a.href || null,
    hreflang: links.filter((l) => (l.a.rel || '').split(/\s+/).includes('alternate') && l.a.hreflang).map((l) => [l.a.hreflang, l.a.href]),
    mdAlt: links.find((l) => (l.a.rel || '').includes('alternate') && l.a.type === 'text/markdown')?.a.href || null,
    metas, links, ld, graph: [], text: textOf(html), ids: new Map(),
    ogImage: metaContent('property', 'og:image'),
  });
}
for (const p of pages.values()) {
  p.textNorm = norm(p.text);
  for (const m of p.html.matchAll(/\sid=["']([^"']+)["']/g)) p.ids.set(m[1], (p.ids.get(m[1]) || 0) + 1);
}
const routePages = [...pages.values()].filter((p) => p.route);
const indexablePages = routePages.filter((p) => p.indexable);
const expectedIndexable = [];
for (const r of routes) for (const l of site.langs) if (routeIndexable(r.id, l)) expectedIndexable.push(r[l]);
const missingPages = expectedIndexable.filter((p) => !pages.has(p));
if (missingPages.length) warn('discovery', 'routes', `${missingPages.length} indexable route(s) not built (content missing?): ${missingPages.join(' ')}`);
const home = pages.get(routeById.home?.[site.defaultLang] || '/');

/* ═══ 1. Links, assets, anchors ═══════════════════════════════ */
const URL_ATTRS = new Set(['href', 'src', 'poster', 'action', 'ios-src', 'data-src', 'data-mv', 'data-decoder', 'data-href', 'data-poster', 'data-glb', 'data-usdz', 'xlink:href']);
const anchorTargets = []; // [page, targetPath, hash, ref]
const inbound = new Map(); // target path → Set(source path)
const BAD_LINK_TEXT = /^(leer m[aá]s|aqu[ií]|pincha aqu[ií]|haz clic aqu[ií]|click here|here|read more|more|m[aá]s|ver m[aá]s|see more|learn more|this link)$/i;
for (const p of pages.values()) {
  const refs = [];
  for (const m of p.html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
    const tag = m[1].toLowerCase();
    if (tag === 'script' && !/\bsrc=/.test(m[2])) { /* inline script */ }
    const a = parseAttrs(m[2]);
    for (const [k, v] of Object.entries(a)) {
      if (URL_ATTRS.has(k) || (k.startsWith('data-') && /^\/[^\s]*\.[a-z0-9]{2,5}([?#].*)?$/i.test(v))) refs.push({ tag, attr: k, value: v, a });
      if (k === 'srcset' || k === 'imagesrcset') for (const part of v.split(',')) { const u = part.trim().split(/\s+/)[0]; if (u) refs.push({ tag, attr: k, value: u, a }); }
    }
    if (tag === 'meta' && /^(og:image|og:url|twitter:image)$/.test(a.property || a.name || '')) refs.push({ tag, attr: 'content', value: a.content || '', a });
  }
  for (const r of refs) {
    const c = classify(r.value, p.urlPath);
    if (c.kind === 'empty') { err('links', p.where, `empty ${r.attr} on <${r.tag}>`); continue; }
    if (c.kind === 'js') { err('links', p.where, `javascript: URL in ${r.attr}`); continue; }
    if (c.kind === 'external') { if (c.http) err('links', p.where, `insecure http: link ${r.value}`); continue; }
    if (c.kind === 'skip') continue;
    if (c.kind === 'anchor') { anchorTargets.push([p, p.urlPath, c.hash, r.value]); continue; }
    if (c.http) err('links', p.where, `http: link to own domain ${r.value}`);
    if (c.relative) warn('links', p.where, `relative URL ${r.value} (use root-relative)`);
    const target = distFile(c.path);
    if (!target) { err('links', p.where, `broken ${r.attr} → ${r.value}`); continue; }
    if (r.tag === 'a' && r.attr === 'href' && !c.path.endsWith('/') && target.endsWith('index.html')) warn('links', p.where, `link without trailing slash ${r.value}`);
    if (c.hash && target.endsWith('.html')) anchorTargets.push([p, c.path.endsWith('/') ? c.path : `${c.path}/`, c.hash, r.value]);
    if (r.tag === 'a' && target.endsWith('.html')) {
      const tp = c.path.endsWith('/') ? c.path : `${c.path}/`;
      if (tp !== p.urlPath) { if (!inbound.has(tp)) inbound.set(tp, new Set()); inbound.get(tp).add(p.urlPath); }
    }
  }
  // link text quality + external link hygiene
  for (const m of p.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const a = parseAttrs(m[1]);
    const text = textOf(m[2]);
    const imgAlt = [...m[2].matchAll(/<img\b[^>]*\balt=["']([^"']+)["']/gi)].map((x) => x[1]).join(' ');
    if (!text && !a['aria-label'] && !a['aria-labelledby'] && !imgAlt.trim() && !/<svg\b[^>]*aria-label/i.test(m[2])) err('content', p.where, `link without accessible name → ${a.href || '(no href)'}`);
    if (BAD_LINK_TEXT.test(text.replace(/[.…:→›»\s]+$/u, '').trim()) && !a['aria-label']) err('content', p.where, `generic link text «${text}» → ${a.href}`);
    if (a.target === '_blank' && !/\bnoopener\b|\bnoreferrer\b/.test(a.rel || '')) err('content', p.where, `target=_blank without rel=noopener → ${a.href}`);
  }
}
for (const [p, tp, hash, ref] of anchorTargets) {
  if (!hash || /[=&]/.test(hash)) continue; // AR Quick Look fragments (#canonicalWebPageURL=…) are parameters, not anchors
  const target = pages.get(tp);
  if (!target) continue;
  if (!target.ids.has(hash)) err('links', p.where, `anchor #${hash} not found in ${tp} (${ref})`);
}
// CSS url() references
for (const f of allFiles.filter((x) => x.endsWith('.css'))) {
  const css = fs.readFileSync(f, 'utf8');
  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    const u = m[1];
    if (/^(data:|#|https?:)/.test(u)) continue;
    const abs = u.startsWith('/') ? u : new URL(u, `https://${HOST}/${rel(f)}`).pathname;
    if (!distFile(abs)) err('links', rel(f), `broken url(${u})`);
  }
}

/* ═══ 2. Structure ════════════════════════════════════════════ */
for (const p of pages.values()) {
  const levels = [...p.html.matchAll(/<h([1-6])\b/gi)].map((m) => +m[1]);
  const h1 = levels.filter((l) => l === 1).length;
  if (!p.is404 && h1 !== 1) err('structure', p.where, `${h1} <h1> elements (exactly 1 required)`);
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) err('structure', p.where, `heading jump h${levels[i - 1]} → h${l}`); });
  if (!p.htmlLang) err('structure', p.where, 'missing <html lang>');
  else if (p.lang && p.htmlLang.slice(0, 2).toLowerCase() !== p.lang) err('structure', p.where, `<html lang="${p.htmlLang}"> but the route language is ${p.lang}`);
  for (const [id, n] of p.ids) if (n > 1) err('structure', p.where, `duplicate id="${id}" (${n}×)`);
  for (const m of p.html.matchAll(/\s(aria-controls|aria-labelledby|aria-describedby|aria-owns|for|list|form)=["']([^"']+)["']/gi)) {
    if (m[1].toLowerCase() === 'form' && !/^[\w-]+$/.test(m[2])) continue;
    for (const id of m[2].split(/\s+/)) if (id && !p.ids.has(id)) err('structure', p.where, `${m[1]}="${id}" points to a missing id`);
  }
  if (!/<main\b/i.test(p.html) && !p.is404 && p.template !== 'embed') warn('structure', p.where, 'no <main> landmark');
}

/* ═══ 3. Meta: canonical, hreflang, titles, robots, OG ════════ */
const titles = new Map();
const descs = new Map();
for (const p of pages.values()) {
  if (p.is404) continue;
  const self = DOMAIN + p.urlPath;
  // canonical
  if (!p.canonical) err('meta', p.where, 'missing rel=canonical');
  else {
    if (!/^https:\/\//.test(p.canonical)) err('meta', p.where, `canonical not absolute https: ${p.canonical}`);
    if (p.route && p.canonical !== self) err('meta', p.where, `canonical ${p.canonical} is not self-referencing (${self})`);
    if (p.route && !p.canonical.endsWith('/')) err('meta', p.where, 'canonical without trailing slash');
  }
  // title + description
  const sev = p.indexable ? err : warn;
  if (!p.title) err('meta', p.where, 'missing <title>');
  else {
    if (titles.has(p.title)) err('meta', p.where, `duplicate title with ${titles.get(p.title)}`); else titles.set(p.title, p.where);
    if (p.title.length > 70) sev('meta', p.where, `title ${p.title.length} chars (max 70): «${p.title}»`);
    if (/\{\{|\}\}/.test(p.title)) err('meta', p.where, 'unresolved token in title');
  }
  if (!p.description) err('meta', p.where, 'missing meta description');
  else {
    if (descs.has(p.description)) err('meta', p.where, `duplicate description with ${descs.get(p.description)}`); else descs.set(p.description, p.where);
    const n = p.description.length;
    if (n < 70 || n > 160) sev('meta', p.where, `description ${n} chars (70 to 160)`);
  }
  // robots
  if (p.route) {
    if (!p.indexable) { if (!p.noindex) err('meta', p.where, `noindex route without meta robots noindex (${p.robots || 'none'})`); }
    else if (PLACEHOLDERS) { if (!p.noindex) err('meta', p.where, 'placeholders are active (site.mjs) but the page is indexable: must be noindex, follow'); }
    else {
      if (p.noindex) err('meta', p.where, `indexable page has noindex (${p.robots})`);
      if (/nosnippet|max-snippet:0/.test(p.robots)) err('meta', p.where, `indexable page restricts snippets (${p.robots})`);
      if (!/max-image-preview:large/.test(p.robots) || !/max-snippet:-1/.test(p.robots)) warn('meta', p.where, `robots without max-image-preview:large / max-snippet:-1 (${p.robots || 'none'})`);
    }
    if (/nosnippet/.test(p.robots)) err('meta', p.where, 'nosnippet in meta robots');
  }
  // OG
  if (p.indexable) {
    const og = (k) => p.metas.find((m) => m.a.property === k)?.a.content;
    for (const k of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) if (!og(k)) err('meta', p.where, `missing ${k}`);
    if (og('og:image') && !og('og:image').startsWith('https://')) err('meta', p.where, 'og:image must be an absolute https URL');
    if (og('og:url') && og('og:url') !== p.canonical) warn('meta', p.where, `og:url ${og('og:url')} ≠ canonical`);
    if (!p.metas.some((m) => m.a.name === 'twitter:card')) warn('meta', p.where, 'missing twitter:card');
    if (!p.mdAlt) err('meta', p.where, 'missing <link rel="alternate" type="text/markdown">');
    else {
      const c = classify(p.mdAlt, p.urlPath);
      if (c.kind !== 'internal' || c.path !== `${p.urlPath}index.md`) err('meta', p.where, `markdown alternate should be ${p.urlPath}index.md (got ${p.mdAlt})`);
    }
  }
}
// hreflang reciprocity and groups
for (const p of routePages) {
  const hl = p.hreflang;
  const expectedLangs = site.langs.filter((l) => p.route.route[l] && pages.has(p.route.route[l]));
  if (!hl.length) { if (p.indexable) err('meta', p.where, 'no hreflang alternates (at least self + x-default)'); continue; }
  const map = new Map(hl);
  if (hl.length !== map.size) err('meta', p.where, 'duplicate hreflang values');
  if (!map.has('x-default')) err('meta', p.where, 'missing hreflang="x-default"');
  if (map.get(p.lang) !== DOMAIN + p.urlPath) err('meta', p.where, `hreflang="${p.lang}" must point to itself`);
  for (const l of expectedLangs) if (!map.has(l) && pages.get(p.route.route[l])?.indexable === p.indexable) err('meta', p.where, `missing hreflang="${l}" (the ${l} twin exists)`);
  const xExpected = DOMAIN + (p.route.route[site.xDefault] && pages.has(p.route.route[site.xDefault]) ? p.route.route[site.xDefault] : p.route.route[site.defaultLang] || p.urlPath);
  if (map.has('x-default') && map.get('x-default') !== xExpected) err('meta', p.where, `x-default → ${map.get('x-default')} (expected ${xExpected})`);
  for (const [l, href] of hl) {
    const c = classify(href, p.urlPath);
    if (c.kind !== 'internal' || !c.abs) { err('meta', p.where, `hreflang ${l} must be an absolute own-domain URL: ${href}`); continue; }
    const t = pages.get(c.path);
    if (!t) { err('meta', p.where, `hreflang ${l} → missing page ${c.path}`); continue; }
    if (l === 'x-default') continue;
    if (t.indexable !== p.indexable) warn('meta', p.where, `hreflang ${l} mixes indexable and noindex pages (${c.path})`);
    const back = new Map(t.hreflang);
    if (![...back.values()].includes(DOMAIN + p.urlPath)) err('meta', p.where, `hreflang ${l} → ${c.path} is not reciprocal`);
    else if (JSON.stringify([...back].sort()) !== JSON.stringify([...map].sort())) err('meta', p.where, `hreflang group differs from ${c.path}`);
  }
}

/* ═══ 4. JSON-LD ══════════════════════════════════════════════ */
const definedIds = new Map(); // @id → page where defined
const refsToCheck = []; // [page, id]
const typesOf = (n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).filter(Boolean);
function walkJson(v, fn, pathStr = '') {
  fn(v, pathStr);
  if (Array.isArray(v)) v.forEach((x, i) => walkJson(x, fn, `${pathStr}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walkJson(x, fn, pathStr ? `${pathStr}.${k}` : k);
}
const isRefOnly = (o) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).length === 1 && '@id' in o;
const hasClass = (html, cls) => [...html.matchAll(/class=["']([^"']+)["']/g)].some((m) => m[1].split(/\s+/).includes(cls));
/** «Desde 149 €» / «desde 1.490 €» / "From €149" in a meta description → 149 (null when there is none). */
const fromPriceIn = (desc) => {
  const m = decode(desc || '').replace(/[\u00a0\u202f]/g, ' ').match(/\b(?:desde|from)\s+(?:€\s?([\d.,]+)|([\d.,]+)\s?€)/i);
  return m ? Number((m[1] || m[2]).replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.')) : null;
};
/** Absolute own-domain URL whose page exists in dist and, with a #fragment, has that id. */
const pageAnchorExists = (u) => {
  const c = classify(String(u), '/');
  if (c.kind !== 'internal') return true;
  const f = distFile(c.path);
  if (!f) return false;
  if (!c.hash) return true;
  const pg = pages.get(c.path.endsWith('/') ? c.path : `${c.path}/`);
  return !pg || pg.ids.has(c.hash);
};
const visiblePriceIn = (p, price) => {
  const lang = p.lang || 'es';
  const f = formatPrice(Number(price), lang).replace(/[\u00a0\u202f]/g, ' ');
  return p.text.includes(f) || p.text.includes(f.replace(' ', '')) || p.text.replace(/\s/g, '').includes(f.replace(/\s/g, ''));
};
for (const p of pages.values()) {
  if (p.is404) continue;
  if (!p.ld.length) { if (p.route) err('schema', p.where, 'no JSON-LD'); continue; }
  if (p.ld.length > 1) warn('schema', p.where, `${p.ld.length} JSON-LD scripts (one @graph expected)`);
  for (const raw of p.ld) {
    if (/<\/?[a-z]/i.test(raw.replace(/\\u003c/gi, ''))) warn('schema', p.where, 'unescaped "<" in JSON-LD');
    let json;
    try { json = JSON.parse(raw); } catch (e) { err('schema', p.where, `JSON-LD does not parse: ${e.message}`); continue; }
    // Budget 8 KB (05 §5.3 #8) for the structured-data overhead. The FAQ Questions are excluded: they must
    // mirror the visible FAQ word for word (6 to 10 answers of 40 to 80 words ≈ 4 KB), so their size is
    // content, not markup. The glossary IS its DefinedTermSet (every visible definition), so it gets 24 KB.
    let faqBytes = 0;
    walkJson(json, (v) => { if (v && typeof v === 'object' && !Array.isArray(v) && v['@type'] === 'Question') faqBytes += Buffer.byteLength(JSON.stringify(v)); });
    const ldBytes = Buffer.byteLength(raw) - faqBytes;
    const ldMax = p.template === 'glossary' ? 24 * 1024 : 8 * 1024;
    if (ldBytes > ldMax) warn('budgets', p.where, `JSON-LD ${kb(ldBytes)} without the FAQ questions (> ${kb(ldMax)})`);
    if (json['@context'] !== 'https://schema.org') err('schema', p.where, '@context must be "https://schema.org"');
    const graph = Array.isArray(json['@graph']) ? json['@graph'] : [json];
    if (!Array.isArray(json['@graph'])) warn('schema', p.where, 'JSON-LD without @graph');
    p.graph.push(...graph);
    walkJson(json, (v, at) => {
      if (v === null) err('schema', p.where, `null at ${at}`);
      else if (Array.isArray(v) && !v.length) err('schema', p.where, `empty array at ${at}`);
      else if (v === '') err('schema', p.where, `empty string at ${at}`);
      else if (typeof v === 'string' && /\{\{|\}\}|\bundefined\b|\bNaN\b|\[object Object\]/.test(v)) err('schema', p.where, `leftover in ${at}: «${v.slice(0, 60)}»`);
      else if (v && typeof v === 'object' && !Array.isArray(v) && '@id' in v) {
        if (isRefOnly(v)) refsToCheck.push([p, v['@id']]);
        else if (!definedIds.has(v['@id'])) definedIds.set(v['@id'], p.where);
      }
    });
  }
}
for (const [p, id] of refsToCheck) {
  if (definedIds.has(id)) continue;
  const base = id.split('#')[0];
  const c = classify(base, '/');
  const targetBuilt = c.kind === 'internal' && pages.has(c.path.endsWith('/') ? c.path : `${c.path}/`);
  (targetBuilt ? err : warn)('schema', p.where, `@id reference ${id} is not defined on any page${targetBuilt ? '' : ' (target page not built)'}`);
}
// Required fields and visible-content coherence
const need = (p, n, keys, label) => { for (const k of keys) if (n[k] == null) err('schema', p.where, `${label || typesOf(n).join('/')} ${n['@id'] || ''} missing ${k}`); };
const urlExists = (u) => { const c = classify(String(u), '/'); return c.kind !== 'internal' || !!distFile(c.path); };
for (const p of pages.values()) {
  if (!p.graph.length) continue;
  const all = [];
  walkJson(p.graph, (v) => { if (v && typeof v === 'object' && !Array.isArray(v) && v['@type']) all.push(v); });
  const webpage = p.graph.find((n) => /#webpage$/.test(n['@id'] || ''));
  if (p.route && !webpage) err('schema', p.where, 'no WebPage node (#webpage)');
  const visibleDates = [...p.html.matchAll(/<time\b[^>]*datetime=["'](\d{4}-\d{2}-\d{2})/gi)].map((m) => m[1]);
  let faqNodes = 0;
  for (const n of all) {
    const t = typesOf(n);
    if (t.some((x) => /Page$/.test(x)) && n['@id']?.endsWith('#webpage')) {
      need(p, n, ['url', 'name', 'inLanguage', 'isPartOf'], t.join('/'));
      if (n.url && n.url !== DOMAIN + p.urlPath) err('schema', p.where, `WebPage url ${n.url} ≠ page URL`);
      if (n.datePublished && n.dateModified && n.dateModified < n.datePublished) err('schema', p.where, `dateModified ${n.dateModified} < datePublished ${n.datePublished}`);
      if (p.indexable && n.dateModified && !visibleDates.includes(n.dateModified)) err('schema', p.where, `dateModified ${n.dateModified} is not shown in a visible <time datetime> (found: ${visibleDates.join(', ') || 'none'})`);
      if (p.indexable && !n.dateModified) err('schema', p.where, 'WebPage without dateModified');
    }
    if (t.includes('ProfessionalService') || t.includes('Organization')) need(p, n, ['name', 'url']);
    if (t.includes('WebSite')) need(p, n, ['url', 'name']);
    if (t.includes('BreadcrumbList')) {
      const items = n.itemListElement || [];
      items.forEach((it, i) => {
        if (it.position !== i + 1) err('schema', p.where, `BreadcrumbList position ${it.position} at index ${i}`);
        if (!it.name || !it.item) err('schema', p.where, `BreadcrumbList item ${i + 1} needs name and item`);
        else { if (!urlExists(it.item)) err('schema', p.where, `BreadcrumbList item → missing page ${it.item}`); if (!p.textNorm.includes(norm(it.name))) warn('schema', p.where, `breadcrumb «${it.name}» not visible on the page`); }
      });
    }
    if (t.includes('Article')) {
      need(p, n, ['headline', 'image', 'datePublished', 'dateModified', 'author', 'publisher']);
      // wordCount: > 0 or absent (G-01). It is counted from the content (Markdown mirror): flag a count far from <main>.
      if ('wordCount' in n) {
        if (!(Number(n.wordCount) > 0)) err('schema', p.where, `Article wordCount ${n.wordCount} (must be > 0 or absent)`);
        else {
          const mainWords = words(textOf((p.html.match(/<main\b[\s\S]*?<\/main>/i) || [''])[0]));
          if (mainWords && (n.wordCount < mainWords * 0.5 || n.wordCount > mainWords * 1.5)) warn('schema', p.where, `Article wordCount ${n.wordCount} far from the ${mainWords} words in <main>`);
        }
      }
      const h1 = textOf((p.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
      if (n.headline && norm(n.headline) !== norm(h1)) err('schema', p.where, `Article headline «${n.headline}» ≠ h1 «${h1}»`);
      if (n.headline && n.headline.length > 110) err('schema', p.where, 'Article headline > 110 chars');
      if (n.datePublished && n.dateModified && n.dateModified < n.datePublished) err('schema', p.where, 'Article dateModified < datePublished');
    }
    if (t.includes('Service')) {
      if (n['@id']) need(p, n, ['provider', 'areaServed', 'name']);
      if (n['@id'] && !n.offers) warn('schema', p.where, `Service ${n['@id']} without offers (the page does not show a price token)`);
      // G-02: the lowest Offer price is the «desde / from» figure the meta description quotes.
      const offerPrices = [].concat(n.offers || []).map((o) => Number(o.price)).filter((x) => Number.isFinite(x));
      const from = fromPriceIn(p.description);
      // Not an Offer at all = the graph contradicts the page (error, GEO); an Offer but not the lowest = the
      // description understates what the lead prices (content: quote the lowest price or drop the cheaper pack from the lead).
      if (n['@id'] && offerPrices.length && from != null && !offerPrices.includes(from)) err('schema', p.where, `the meta description's «desde/from» price ${from} is not an Offer of the Service (offers: ${offerPrices.join(', ')})`);
      else if (n['@id'] && offerPrices.length && from != null && Math.min(...offerPrices) !== from) warn('schema', p.where, `meta description says «desde/from» ${from} but the lead also prices ${Math.min(...offerPrices)} (Service offers: ${offerPrices.join(', ')}): quote the lowest price in the description`, 'content');
    }
    if (t.includes('Offer')) {
      if (n.price == null && !n.priceSpecification) err('schema', p.where, `Offer ${n.name || ''} without price/priceSpecification`);
      if (!n.priceCurrency && !(n.priceSpecification && [].concat(n.priceSpecification).every((s) => s.priceCurrency))) err('schema', p.where, 'Offer without priceCurrency');
      if (n.price != null && !visiblePriceIn(p, n.price)) err('schema', p.where, `Offer price ${n.price} (${formatPrice(Number(n.price), p.lang || 'es')}) is not visible on the page`);
    }
    if (t.includes('UnitPriceSpecification')) {
      need(p, n, ['price', 'priceCurrency']);
      if (n.valueAddedTaxIncluded !== false) err('schema', p.where, 'UnitPriceSpecification must have valueAddedTaxIncluded:false (prices + IVA)');
      if (n.price != null && !visiblePriceIn(p, n.price)) err('schema', p.where, `price ${n.price} (${formatPrice(Number(n.price), p.lang || 'es')}) is not visible on the page`);
    }
    if (t.includes('OfferCatalog') && !(n.itemListElement || []).length) err('schema', p.where, 'OfferCatalog without itemListElement');
    if (t.includes('3DModel') && n['@id']) {
      const enc = [].concat(n.encoding || []);
      if (!enc.length) err('schema', p.where, '3DModel without encoding');
      for (const e of enc) {
        if (!e.contentUrl || !e.encodingFormat) err('schema', p.where, '3DModel encoding needs contentUrl and encodingFormat');
        else if (!urlExists(e.contentUrl)) err('schema', p.where, `3DModel encoding ${e.contentUrl} does not exist in dist`);
      }
    }
    if (t.includes('ImageObject')) {
      const u = n.contentUrl || n.url;
      if (!u && !isRefOnly(n)) err('schema', p.where, 'ImageObject without contentUrl/url');
      else if (u && !urlExists(u)) err('schema', p.where, `ImageObject ${u} does not exist in dist`);
      for (const k of ['license', 'acquireLicensePage']) if (n[k] && !pageAnchorExists(n[k])) err('schema', p.where, `ImageObject ${k} ${n[k]} does not resolve to a page (and anchor) in dist`);
    }
    if (t.includes('VideoObject')) {
      need(p, n, ['name', 'description', 'thumbnailUrl', 'uploadDate']);
      for (const k of ['thumbnailUrl', 'contentUrl']) for (const u of [].concat(n[k] || [])) if (!urlExists(u)) err('schema', p.where, `VideoObject ${k} ${u} does not exist in dist`);
      if (!n.contentUrl && !n.embedUrl) err('schema', p.where, 'VideoObject needs contentUrl or embedUrl');
      if (n.duration && !/^PT(\d+H)?(\d+M)?(\d+(\.\d+)?S)?$/.test(n.duration)) err('schema', p.where, `VideoObject duration ${n.duration} is not ISO 8601 (PT8S)`);
      if (!/<video\b/i.test(p.html)) warn('schema', p.where, 'VideoObject but no <video> element in the served HTML (Google needs the video on the page: render <video preload="none" poster> server-side, play on click)', 'engine');
    }
    if (t.includes('SpeakableSpecification')) {
      for (const sel of [].concat(n.cssSelector || [])) {
        const cls = (String(sel).match(/^\.([\w-]+)$/) || [])[1];
        if (cls && !hasClass(p.html, cls)) err('schema', p.where, `speakable selector ${sel} matches nothing on the page`);
      }
    }
    if (t.includes('HowTo')) { need(p, n, ['name']); if (!(n.step || []).length) err('schema', p.where, 'HowTo without steps'); }
    if (t.includes('DefinedTermSet') && !(n.hasDefinedTerm || []).length) err('schema', p.where, 'DefinedTermSet without terms');
    if (t.includes('DefinedTerm')) {
      need(p, n, ['name', 'description']);
      const anchor = (n['@id'] || '').split('#')[1];
      if (anchor && !p.ids.has(anchor)) err('schema', p.where, `DefinedTerm #${anchor} has no matching id on the page`);
    }
    if (t.includes('FAQPage') && Array.isArray(n.mainEntity)) {
      faqNodes++;
      for (const q of n.mainEntity) {
        const a = q.acceptedAnswer?.text;
        if (!q.name || !a) { err('schema', p.where, 'FAQ Question needs name and acceptedAnswer.text'); continue; }
        if (!p.textNorm.includes(norm(q.name))) err('schema', p.where, `FAQ question not visible verbatim: «${q.name.slice(0, 70)}»`);
        if (!p.textNorm.includes(norm(a))) err('schema', p.where, `FAQ answer differs from the visible text: «${q.name.slice(0, 60)}»`);
      }
    }
  }
  const visibleFaq = (p.html.match(/<details\b/gi) || []).length;
  if (p.indexable && visibleFaq >= 3 && !faqNodes) warn('schema', p.where, `${visibleFaq} <details> but no FAQPage in JSON-LD`);
}
// Global entity on the home page
if (home) {
  const org = home.graph.find((n) => n['@id'] === `${DOMAIN}/#organization`);
  if (!org) err('schema', home.where, 'home has no Organization node (#organization)');
  else for (const k of ['description', 'areaServed', 'knowsAbout', 'contactPoint']) if (!org[k]) err('schema', home.where, `full Organization on home missing ${k}`);
  if (!home.graph.some((n) => n['@id'] === `${DOMAIN}/#website`)) err('schema', home.where, 'home has no WebSite node (#website)');
}

/* ═══ 5. Content ══════════════════════════════════════════════ */
const FACTS_ERROR = new Set(['service', 'case', 'zone']);
const FACTS_WARN = new Set(['home', 'audience', 'process', 'pricing', 'guide', 'about', 'contact', 'faq', 'glossary']);
const LANG_LEAK = {
  es: [/\b(Close|Open menu|Menu|Language|Previous|Next|Loading|Skip to content|Breadcrumb)\b/],
  en: [/\b(Cerrar|Abrir|Menú|Idioma|Anterior|Siguiente|Cargando|Saltar al contenido|Migas)\b/, /[ñ¿¡]/],
};
for (const p of pages.values()) {
  const bare = stripNonVisible(p.html);
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(bare.replace(/<[^>]+>/g, ' '))) err('content', p.where, 'contains undefined / NaN / [object Object]');
  if (/\{\{|\}\}/.test(bare)) err('content', p.where, 'unresolved {{token}}');
  if (/\$\{/.test(bare)) err('content', p.where, 'unexpanded ${…} template literal');
  const handlers = [...p.html.matchAll(/<[a-z][\w-]*\b[^>]*\s(on[a-z]+)\s*=/gi)].map((m) => m[1]);
  if (handlers.length) err('content', p.where, `inline event handler(s) ${[...new Set(handlers)].join(', ')} (blocked by the CSP)`);
  if (!p.indexable) continue;
  const lead = p.html.match(/<(\w+)\b[^>]*class=["'][^"']*\blead\b[^"']*["'][^>]*>([\s\S]*?)<\/\1>/i);
  if (!lead) { if (p.template !== 'legal') err('content', p.where, 'no .lead answer paragraph'); }
  else { const w = words(textOf(lead[2])); if (w > 60) warn('content', p.where, `.lead has ${w} words (≤ 60)`); }
  // The engine renders <div class="cajetin …"><dl class="cajetin__grid">: a "cajetin" class token plus a <dl>.
  const hasCajetin = [...p.html.matchAll(/class=["']([^"']+)["']/g)].some((m) => m[1].split(/\s+/).includes('cajetin')) && /<dl\b/i.test(p.html);
  if (!hasCajetin && FACTS_ERROR.has(p.template)) err('content', p.where, 'no <dl class="cajetin"> key facts block');
  else if (!hasCajetin && FACTS_WARN.has(p.template)) warn('content', p.where, 'no <dl class="cajetin"> key facts block');
  if (!/<time\b[^>]*datetime=/i.test(p.html)) err('content', p.where, 'no visible updated date (<time datetime>)');
  if (!p.text.includes(site.contact.email)) warn('content', p.where, `contact email ${site.contact.email} not in the page text`);
  // Human-facing attributes, skipping elements explicitly marked in another language (the language switch: lang="es").
  const attrsText = [...p.html.matchAll(/<[a-z][\w-]*\b([^>]*)>/gi)].map((m) => parseAttrs(m[1]))
    .filter((a) => !a.lang || a.lang.slice(0, 2) === p.lang)
    .flatMap((a) => ['alt', 'aria-label', 'title', 'placeholder'].map((k) => a[k]).filter(Boolean)).join(' | ');
  for (const re of LANG_LEAK[p.lang] || []) { const m = attrsText.match(re); if (m) warn('content', p.where, `attribute text in the other language: «${m[0]}»`); }
}

/* ═══ 6. Images ═══════════════════════════════════════════════ */
let manifest = {};
try { manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'generated', 'images.json'), 'utf8')); } catch { /* optional */ }
const imageName = (src) => { const m = String(src).match(/\/assets\/img\/(?:og\/)?([a-z0-9_]+?)(?:-\d+)?(?:\.[0-9a-f]{6,12})?\.(avif|webp|jpe?g|png)$/i); return m ? m[1] : null; };
for (const p of pages.values()) {
  const imgs = tagsOf(p.html, 'img');
  const high = imgs.filter((i) => i.a.fetchpriority === 'high');
  if (high.length > 1) err('images', p.where, `${high.length} images with fetchpriority=high (max 1)`);
  for (const i of imgs) {
    const s = i.a.src || '';
    if (!('alt' in i.a)) err('images', p.where, `img without alt: ${s}`);
    if (!i.a.width || !i.a.height) { err('images', p.where, `img without width/height: ${s}`); continue; }
    if (i.a.fetchpriority === 'high' && i.a.loading === 'lazy') err('images', p.where, 'LCP image (fetchpriority=high) must not be loading=lazy');
    const name = imageName(s);
    const m = name && manifest[name];
    if (m && !/\/og\//.test(s)) {
      const r1 = m.width / m.height; const r2 = +i.a.width / +i.a.height;
      if (Math.abs(r1 - r2) / r1 > 0.01) err('images', p.where, `img ${name} ${i.a.width}×${i.a.height} does not match the manifest ratio ${m.width}×${m.height}`);
    }
  }
}

/* ═══ 7. Budgets (§11) + heavy 3D never in initial HTML ═══════ */
for (const p of pages.values()) {
  const bytes = Buffer.byteLength(p.html);
  if (bytes > 60 * 1024) err('budgets', p.where, `HTML ${kb(bytes)} > 60 KB`);
  if (/<script\b[^>]*\bsrc=["'][^"']*model-viewer/i.test(p.html)) err('budgets', p.where, 'model-viewer <script src> in the initial HTML (must be a dynamic import on intent)');
  for (const l of p.links) {
    const relv = (l.a.rel || '').toLowerCase();
    if (/preload|modulepreload|prefetch|prerender/.test(relv) && /model-viewer|\.glb\b|\.usdz\b/i.test(l.a.href || '')) err('budgets', p.where, `${relv} of a heavy 3D asset: ${l.a.href}`);
  }
  // §11: no third-party request before interaction (fonts, scripts, images, iframes are self-hosted).
  const thirdParty = new Set();
  for (const m of p.html.matchAll(/<(script|link|img|source|iframe|video|audio)\b([^>]*)>/gi)) {
    const a = parseAttrs(m[2]);
    const urls = [a.src, m[1].toLowerCase() === 'link' && !/^(canonical|alternate|author|license|me)$/i.test(a.rel || '') ? a.href : null, ...(a.srcset || '').split(',').map((x) => x.trim().split(/\s+/)[0])].filter(Boolean);
    for (const u of urls) { const c = classify(u, p.urlPath); if (c.kind === 'external') thirdParty.add(new URL(u.startsWith('//') ? `https:${u}` : u).host); }
  }
  const allowedHosts = site.analytics ? [new URL(site.analytics.host || 'https://plausible.io').host] : [];
  const offenders = [...thirdParty].filter((h) => !allowedHosts.includes(h));
  if (offenders.length) err('budgets', p.where, `third-party request(s) in the initial HTML: ${offenders.join(', ')} (self-host it)`);
  for (const mv of tagsOf(p.html, 'model-viewer')) {
    if (mv.a.src && mv.a.reveal !== 'manual') err('budgets', p.where, '<model-viewer> with src must use reveal="manual" (no GLB before intent)');
    if (mv.a.src && mv.a.loading && mv.a.loading !== 'lazy') err('budgets', p.where, '<model-viewer> must use loading="lazy"');
  }
}
const fontFiles = allFiles.filter((f) => f.endsWith('.woff2'));
const fontBytes = fontFiles.reduce((s, f) => s + size(f), 0);
const budgetRows = [];
if (fontBytes > 110 * 1024) err('budgets', 'fonts', `${kb(fontBytes)} of woff2 > 110 KB`);
budgetRows.push(['Fonts (all woff2)', fontBytes, 110 * 1024]);
if (home) {
  const hb = Buffer.byteLength(home.html);
  budgetRows.push(['Home HTML', hb, 60 * 1024]);
  const css = home.links.filter((l) => (l.a.rel || '').includes('stylesheet')).map((l) => distFile(classify(l.a.href, '/').path || '')).filter(Boolean);
  const cssBytes = css.reduce((s, f) => s + size(f), 0);
  budgetRows.push(['Home CSS', cssBytes, 40 * 1024]);
  if (cssBytes > 40 * 1024) err('budgets', home.where, `CSS ${kb(cssBytes)} > 40 KB`);
  const js = tagsOf(home.html, 'script').filter((s) => s.a.src).map((s) => distFile(classify(s.a.src, '/').path || '')).filter(Boolean);
  const jsBytes = js.reduce((s, f) => s + size(f), 0);
  budgetRows.push(['Home initial JS', jsBytes, 30 * 1024]);
  if (jsBytes > 30 * 1024) err('budgets', home.where, `initial JS ${kb(jsBytes)} > 30 KB`);
  const preFonts = home.links.filter((l) => (l.a.rel || '').includes('preload') && l.a.as === 'font');
  if (preFonts.length > 1) err('budgets', home.where, `${preFonts.length} preloaded fonts (1 max)`);
  for (const f of preFonts) if (!('crossorigin' in f.a)) err('budgets', home.where, `font preload without crossorigin: ${f.a.href}`);
  // LCP image: the fetchpriority=high <img>, measured on the AVIF candidate closest to 1200 w
  const lcpTag = tagsOf(home.html, 'img').find((i) => i.a.fetchpriority === 'high');
  if (!lcpTag) warn('budgets', home.where, 'no fetchpriority=high image on the home (LCP hint)');
  else {
    const pic = home.html.slice(0, lcpTag.index).split(/<picture\b/i).pop();
    const cands = [];
    for (const s of tagsOf(`<x ${pic}`, 'source')) {
      for (const part of (s.a.srcset || '').split(',')) { const [u, w] = part.trim().split(/\s+/); if (u) cands.push({ u, w: parseInt(w, 10) || 0, avif: /avif/.test(s.a.type || u) }); }
    }
    const avif = cands.filter((c) => c.avif);
    const pool = avif.length ? avif : cands;
    const pick = pool.sort((a, b) => Math.abs(a.w - 1200) - Math.abs(b.w - 1200))[0];
    const file = distFile(classify(pick ? pick.u : lcpTag.a.src, '/').path || '');
    const b = file ? size(file) : 0;
    budgetRows.push([`Home LCP image (${pick ? `${pick.w || '?'}w ${pick.avif ? 'AVIF' : ''}` : 'src'})`, b, 150 * 1024]);
    if (b > 150 * 1024) err('budgets', home.where, `LCP image ${kb(b)} > 150 KB`);
    else if (b > 120 * 1024) warn('budgets', home.where, `LCP image ${kb(b)} > 120 KB target`);
  }
}

/* ═══ 8. Discovery: robots, sitemaps, llms, md mirrors, feeds, IndexNow, manifest ═══ */
const readDist = (p) => { try { return fs.readFileSync(path.join(DIST, p), 'utf8'); } catch { return null; } };
// robots.txt
const robots = readDist('robots.txt');
if (!robots) err('discovery', 'robots.txt', 'missing');
else {
  const groups = []; let cur = null; let lastWasAgent = false; const sitemaps = [];
  for (const line of robots.split(/\r?\n/)) {
    const l = line.replace(/#.*/, '').trim();
    if (!l) continue;
    const [k, ...rest] = l.split(':'); const key = k.trim().toLowerCase(); const val = rest.join(':').trim();
    if (key === 'user-agent') { if (!lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(val.toLowerCase()); lastWasAgent = true; continue; }
    lastWasAgent = false;
    if (key === 'sitemap') { sitemaps.push(val); continue; }
    if (cur) cur.rules.push(`${key}:${val}`);
  }
  const groupOf = (agent) => groups.find((g) => g.agents.includes(agent.toLowerCase())) || groups.find((g) => g.agents.includes('*'));
  const star = groups.find((g) => g.agents.includes('*'));
  if (!star) err('discovery', 'robots.txt', 'no "User-agent: *" group');
  if (!sitemaps.includes(`${DOMAIN}/sitemap.xml`)) err('discovery', 'robots.txt', `no "Sitemap: ${DOMAIN}/sitemap.xml" line`);
  // Content-Signal must be a record of the groups (a "# Content-Signal" comment signals nothing).
  if (!star?.rules.some((r) => r === `content-signal:${CONTENT_SIGNAL}`)) warn('discovery', 'robots.txt', `no "Content-Signal: ${CONTENT_SIGNAL}" record in the * group`);
  const rulesKey = (g) => JSON.stringify([...g.rules].sort());
  for (const a of ALLOWED_AGENTS) {
    const g = groupOf(a);
    if (!g) continue;
    if (g.rules.includes('disallow:/')) err('discovery', 'robots.txt', `${a} is disallowed from /`);
    if (star && rulesKey(g) !== rulesKey(star)) err('discovery', 'robots.txt', `${a} group rules differ from the * group (a named group ignores the * rules)`);
  }
  for (const a of CRITICAL_AGENTS) if (!groups.some((g) => g.agents.includes(a.toLowerCase()))) warn('discovery', 'robots.txt', `${a} not declared explicitly`);
  for (const a of BLOCKED_AGENTS) if (!groupOf(a)?.rules.includes('disallow:/')) err('discovery', 'robots.txt', `${a} should be blocked (Disallow: /)`);
  const disallows = (g) => g.rules.filter((r) => r.startsWith('disallow:') && r !== 'disallow:').map((r) => r.slice(9));
  for (const a of ['*', 'googlebot', 'bingbot', 'oai-searchbot', 'claude-user', 'perplexitybot']) {
    const g = groupOf(a); if (!g) continue;
    for (const p of indexablePages) for (const d of disallows(g)) if (p.urlPath.startsWith(d)) err('discovery', 'robots.txt', `${a} cannot crawl indexable page ${p.urlPath} (Disallow: ${d})`);
  }
  if (star && !disallows(star).includes('/models/')) err('discovery', 'robots.txt', 'missing "Disallow: /models/" for all bots');
  // The iframe viewer must stay crawlable: Google renders it inside partner pages (noindex, indexifembedded).
  for (const d of embedPrefixes()) if (star && disallows(star).some((x) => d.startsWith(x) && x !== '/')) err('discovery', 'robots.txt', `"Disallow: ${d}" hides the embedded viewer from Google in partner pages (use X-Robots-Tag: ${EMBED_ROBOTS})`);
}
// sitemaps
const smIndex = readDist('sitemap.xml');
const locsOf = (x) => [...String(x).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
if (!smIndex) err('discovery', 'sitemap.xml', 'missing');
else if (!/<sitemapindex\b/.test(smIndex)) err('discovery', 'sitemap.xml', 'must be a sitemap index');
else for (const l of locsOf(smIndex)) { const c = classify(l, '/'); if (c.kind !== 'internal' || !distFile(c.path)) err('discovery', 'sitemap.xml', `child sitemap missing: ${l}`); }
const smPages = readDist('sitemap-pages.xml');
if (!smPages) err('discovery', 'sitemap-pages.xml', 'missing');
else {
  const blocks = [...smPages.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  const seen = new Set();
  for (const b of blocks) {
    const loc = decode((b.match(/<loc>([^<]+)<\/loc>/) || [])[1] || '');
    const c = classify(loc, '/');
    const pg = c.kind === 'internal' ? pages.get(c.path) : null;
    if (!pg) { err('discovery', 'sitemap-pages.xml', `URL without page: ${loc}`); continue; }
    seen.add(c.path);
    if (!pg.indexable) err('discovery', 'sitemap-pages.xml', `non-indexable page listed: ${loc}`);
    if (!PLACEHOLDERS && pg.noindex) err('discovery', 'sitemap-pages.xml', `page with noindex listed: ${loc}`);
    const lastmod = (b.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
    const wp = pg.graph.find((n) => /#webpage$/.test(n['@id'] || ''));
    if (!lastmod) err('discovery', 'sitemap-pages.xml', `no lastmod for ${loc}`);
    else if (wp?.dateModified && lastmod !== wp.dateModified) err('discovery', 'sitemap-pages.xml', `lastmod ${lastmod} ≠ dateModified ${wp.dateModified} for ${loc}`);
    const alts = [...b.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map((m) => [m[1], decode(m[2])]);
    for (const [, href] of alts) { const cc = classify(href, '/'); if (cc.kind !== 'internal' || !pages.has(cc.path)) err('discovery', 'sitemap-pages.xml', `hreflang URL without page: ${href}`); }
    const htmlGroup = pg.hreflang.filter(([l]) => l !== 'x-default');
    if (htmlGroup.length > 1 && JSON.stringify([...alts].sort()) !== JSON.stringify([...pg.hreflang].sort())) err('discovery', 'sitemap-pages.xml', `hreflang group for ${loc} differs from the page's <link rel=alternate>`);
  }
  for (const p of indexablePages) if (!seen.has(p.urlPath)) err('discovery', 'sitemap-pages.xml', `indexable page missing from the sitemap: ${p.urlPath}`);
}
const smImages = readDist('sitemap-images.xml');
if (!smImages) err('discovery', 'sitemap-images.xml', 'missing');
else {
  for (const m of smImages.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) { const u = decode(m[1]); const c = classify(u, '/'); if (c.kind === 'internal' && !distFile(c.path)) err('discovery', 'sitemap-images.xml', `image missing: ${u}`); }
  for (const m of smImages.matchAll(/<loc>([^<]+)<\/loc>/g)) { const u = decode(m[1]); const c = classify(u, '/'); if (c.kind !== 'internal' || !pages.get(c.path)?.indexable) err('discovery', 'sitemap-images.xml', `page URL not indexable/built: ${u}`); }
}
// sitemap-video.xml (only when a page renders a `video` block): listed in the index, files exist, pages indexable.
const smVideo = readDist('sitemap-video.xml');
const pagesWithVideo = indexablePages.filter((p) => /<video\b/i.test(p.html) && p.graph.some((n) => typesOf(n).includes('VideoObject')));
if (smVideo) {
  if (smIndex && !locsOf(smIndex).includes(`${DOMAIN}/sitemap-video.xml`)) err('discovery', 'sitemap.xml', 'sitemap-video.xml exists but is not in the index');
  for (const b of [...smVideo.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1])) {
    const loc = decode((b.match(/<loc>([^<]+)<\/loc>/) || [])[1] || '');
    const c = classify(loc, '/');
    if (c.kind !== 'internal' || !pages.get(c.path)?.indexable) err('discovery', 'sitemap-video.xml', `page URL not indexable/built: ${loc}`);
    for (const m of b.matchAll(/<video:(thumbnail_loc|content_loc)>([^<]+)<\/video:\1>/g)) { const u = decode(m[2]); const cc = classify(u, '/'); if (cc.kind === 'internal' && !distFile(cc.path)) err('discovery', 'sitemap-video.xml', `${m[1]} missing: ${u}`); }
    for (const k of ['thumbnail_loc', 'title', 'description']) if (!new RegExp(`<video:${k}>[^<]+</video:${k}>`).test(b)) err('discovery', 'sitemap-video.xml', `video for ${loc} without video:${k}`);
  }
} else if (pagesWithVideo.length) warn('discovery', 'sitemap-video.xml', `missing (${pagesWithVideo.length} page(s) with a VideoObject)`);
// llms.txt: one index per language (LLMS_INDEX policy in build/lib/machine.mjs), each ≤ 10 KB target;
// the root one links every llms-full file and the other languages' indexes.
const mdLinks = (s) => [...String(s).matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
const llms = readDist('llms.txt');
if (!llms) err('discovery', 'llms.txt', 'missing');
for (const lang of site.langs) {
  const fp = LLMS_INDEX.path(lang).slice(1);
  const idx = lang === site.defaultLang ? llms : readDist(fp);
  if (!idx) {
    if (lang !== site.defaultLang && indexablePages.some((p) => p.lang === lang)) err('discovery', fp, `missing (${lang} pages exist)`);
    continue;
  }
  const hasPreview = /^<!--[\s\S]*?-->/.test(idx.trimStart());
  const body = idx.trimStart().replace(/^<!--[\s\S]*?-->\s*/, '');
  if (!body.startsWith('# ')) err('discovery', fp, 'must start with "# <name>" (after the optional preview comment)');
  if (!/^> /m.test(body)) err('discovery', fp, 'no "> " summary blockquote');
  if (PLACEHOLDERS && !hasPreview) err('discovery', fp, `placeholders are active but ${fp} has no preview comment`);
  if (!PLACEHOLDERS && hasPreview) err('discovery', fp, 'preview comment left in a launch build');
  if (/\{\{|\}\}|\bundefined\b|\bNaN\b/.test(idx)) err('discovery', fp, 'unresolved token / undefined');
  if (Buffer.byteLength(idx) > LLMS_INDEX.targetBytes) warn('discovery', fp, `${kb(Buffer.byteLength(idx))} (> ${kb(LLMS_INDEX.targetBytes)} target)`);
  for (const u of mdLinks(idx)) {
    const c = classify(u, '/');
    if (c.kind !== 'internal') continue;
    const pg = pages.get(c.path);
    if (!pg && !distFile(c.path)) err('discovery', fp, `link does not resolve: ${u}`);
    else if (pg && !pg.indexable) err('discovery', fp, `links to a non-indexable page: ${u}`);
  }
  // Every indexable page of the language except hubs and the home is listed (hubs only repeat their children).
  for (const p of indexablePages.filter((x) => x.lang === lang && !['hub', 'home'].includes(x.template))) {
    const u = DOMAIN + p.urlPath;
    if (![')', ' ', '\n'].some((end) => idx.includes(u + end))) warn('discovery', fp, `page not listed: ${p.urlPath}`);
  }
  if (lang !== site.defaultLang && llms && !llms.includes(`${DOMAIN}${LLMS_INDEX.path(lang)}`)) warn('discovery', 'llms.txt', `does not link ${LLMS_INDEX.path(lang)}`);
  if (/[–—]/.test(idx)) warn('discovery', fp, 'em/en dash found');
}
// llms-full: one file per language (LLMS_FULL policy in build/lib/machine.mjs), each ≤ 400 KB target.
for (const lang of site.langs) {
  const fp = LLMS_FULL.path(lang).slice(1);
  const hasPages = indexablePages.some((p) => p.lang === lang && !LLMS_FULL.excludeTemplates.has(p.template));
  const full = readDist(fp);
  if (!full) { if (hasPages) err('discovery', fp, `missing (${lang} pages exist)`); continue; }
  const bytes = Buffer.byteLength(full);
  if (bytes > LLMS_FULL.targetBytes) warn('discovery', fp, `${kb(bytes)} (> ${kb(LLMS_FULL.targetBytes)} target per language file)`);
  if (/\{\{|\}\}|\bundefined\b|\bNaN\b|\[object Object\]/.test(full)) err('discovery', fp, 'unresolved token / undefined');
  if (PLACEHOLDERS !== /^<!--/.test(full.trimStart())) err('discovery', fp, PLACEHOLDERS ? 'placeholders are active but there is no preview comment' : 'preview comment left in a launch build');
  for (const p of indexablePages.filter((x) => x.lang === lang && !LLMS_FULL.excludeTemplates.has(x.template))) {
    if (!full.includes(DOMAIN + p.urlPath)) err('discovery', fp, `page missing from the file: ${p.urlPath}`);
  }
  for (const u of new Set(mdLinks(full))) { const c = classify(u, '/'); if (c.kind === 'internal' && !distFile(c.path)) err('discovery', fp, `link does not resolve: ${u}`); }
  if (/[–—]/.test(full)) warn('discovery', fp, 'em/en dash found');
  if (llms && !llms.includes(DOMAIN + LLMS_FULL.path(lang))) warn('discovery', 'llms.txt', `does not link ${LLMS_FULL.path(lang)}`);
}
// index.md mirrors
for (const p of indexablePages) {
  const mdRel = `${p.urlPath}index.md`.replace(/^\//, '');
  const md = readDist(mdRel);
  if (md == null) { err('discovery', mdRel, 'missing Markdown mirror'); continue; }
  const w = words(md);
  if (w < 100) (p.template === 'legal' ? warn : err)('discovery', mdRel, `only ${w} words (≥ 100)`);
  if (/\{\{|\}\}|\bundefined\b|\bNaN\b|\[object Object\]/.test(md)) err('discovery', mdRel, 'unresolved token / undefined');
  if (/\]\((\/|@|\.\.?\/)/.test(md)) err('discovery', mdRel, 'relative or @id link (links must be absolute URLs)');
  if (!md.includes(DOMAIN + p.urlPath)) warn('discovery', mdRel, 'canonical URL not stated');
  if (!md.startsWith('# ')) err('discovery', mdRel, 'must start with "# <h1>"');
  if (/[\u2013\u2014]/.test(md)) warn('discovery', mdRel, 'em/en dash found');
  for (const u of mdLinks(md)) { const c = classify(u, '/'); if (c.kind === 'internal' && !distFile(c.path)) err('discovery', mdRel, `link does not resolve: ${u}`); }
}
// feeds
for (const lang of site.langs) {
  const guides = indexablePages.filter((p) => p.lang === lang && ['guide', 'case'].includes(p.template));
  const feedRel = lang === site.defaultLang ? 'feed.xml' : `${lang}/feed.xml`;
  const feed = readDist(feedRel);
  if (!guides.length) continue;
  if (!feed) { err('discovery', feedRel, 'missing (guides exist in this language)'); continue; }
  if (!/<rss\b[\s\S]*<channel>/.test(feed)) err('discovery', feedRel, 'not an RSS 2.0 document');
  for (const m of feed.matchAll(/<link>([^<]+)<\/link>/g)) { const c = classify(decode(m[1]), '/'); if (c.kind === 'internal' && !pages.has(c.path)) err('discovery', feedRel, `item link without page: ${m[1]}`); }
}
// IndexNow
const key = site.indexNowKey;
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key || '')) err('discovery', 'site.mjs', 'indexNowKey must be 8-128 chars [a-zA-Z0-9-]');
else {
  const kf = readDist(`${key}.txt`);
  if (kf == null) err('discovery', `${key}.txt`, 'IndexNow key file missing');
  else if (kf.trim() !== key) err('discovery', `${key}.txt`, 'IndexNow key file content ≠ key');
}
try {
  const man = JSON.parse(readDist('indexnow-manifest.json') || 'null');
  if (!man || typeof man !== 'object') err('discovery', 'indexnow-manifest.json', 'missing or invalid');
  else for (const p of indexablePages) if (!man[DOMAIN + p.urlPath]) err('discovery', 'indexnow-manifest.json', `no hash for ${p.urlPath}`);
} catch (e) { err('discovery', 'indexnow-manifest.json', `invalid JSON: ${e.message}`); }
try {
  const pend = JSON.parse(readDist('indexnow-pending.json') || 'null');
  if (!pend || !Array.isArray(pend.urls)) err('discovery', 'indexnow-pending.json', 'missing or without urls[]');
  else {
    if (pend.key !== key || pend.host !== HOST) err('discovery', 'indexnow-pending.json', 'host/key do not match site.mjs');
    if (pend.urls.some((u) => !u.startsWith(DOMAIN))) err('discovery', 'indexnow-pending.json', 'URL from another host');
    info.push(`IndexNow pending: ${pend.urls.length} URL(s) (${pend.basis})`);
  }
} catch (e) { err('discovery', 'indexnow-pending.json', `invalid JSON: ${e.message}`); }
// web manifest
try {
  const wm = JSON.parse(readDist('site.webmanifest') || 'null');
  if (!wm) err('discovery', 'site.webmanifest', 'missing');
  else {
    if (!wm.name) err('discovery', 'site.webmanifest', 'no name');
    if (!wm.icons?.length) warn('discovery', 'site.webmanifest', 'no icons (public/icon-192.png, icon-512.png not found)', 'assets');
    for (const i of wm.icons || []) if (!distFile(i.src)) err('discovery', 'site.webmanifest', `icon missing: ${i.src}`);
    for (const sz of ['192x192', '512x512']) {
      const ic = (wm.icons || []).find((i) => i.sizes === sz && i.type === 'image/png');
      if (!ic) warn('discovery', 'site.webmanifest', `no ${sz} PNG icon`);
      else if (!/\bmaskable\b/.test(ic.purpose || '')) warn('discovery', 'site.webmanifest', `${ic.src} without purpose "maskable"`);
      else if (distFile(ic.src)) {
        const b = fs.readFileSync(distFile(ic.src));
        const dim = b.toString('ascii', 1, 4) === 'PNG' ? `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}` : null;
        if (dim !== sz) err('discovery', 'site.webmanifest', `${ic.src} is ${dim || 'not a PNG'} (declared ${sz})`, 'assets');
      }
    }
  }
} catch (e) { err('discovery', 'site.webmanifest', `invalid JSON: ${e.message}`); }

/* ═══ 9. _headers ═════════════════════════════════════════════ */
const headersTxt = readDist('_headers');
const hRules = [];
if (!headersTxt) err('headers', '_headers', 'missing');
else {
  let cur = null;
  for (const line of headersTxt.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = { pattern: line.trim(), headers: [] }; hRules.push(cur); continue; }
    const i = line.indexOf(':');
    if (cur && i > 0) cur.headers.push([line.slice(0, i).trim().toLowerCase(), line.slice(i + 1).trim()]);
  }
}
const patRe = (p) => new RegExp(`^${p.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:[a-z]\w*/gi, '[^/]+')).join('.*')}$`);
const rulesFor = (urlPath) => hRules.filter((r) => patRe(r.pattern).test(urlPath));
const headerValues = (urlPath, name) => rulesFor(urlPath).flatMap((r) => r.headers.filter(([k]) => k === name).map(([, v]) => v));
const duplicateHeaders = (urlPath) => {
  const count = new Map();
  for (const r of rulesFor(urlPath)) for (const k of new Set(r.headers.map(([n]) => n))) count.set(k, (count.get(k) || 0) + 1);
  return [...count].filter(([, n]) => n > 1).map(([k]) => k);
};
if (hRules.length) {
  const star = hRules.find((r) => r.pattern === '/*');
  if (!star) err('headers', '_headers', 'no /* rule with the security headers');
  else {
    const has = (k, re) => star.headers.some(([n, v]) => n === k && (!re || re.test(v)));
    if (!has('strict-transport-security', /max-age=\d{7,}/)) err('headers', '_headers', '/* missing Strict-Transport-Security (≥ 1 year)');
    if (!has('x-content-type-options', /nosniff/)) err('headers', '_headers', '/* missing X-Content-Type-Options: nosniff');
    if (!has('referrer-policy')) err('headers', '_headers', '/* missing Referrer-Policy');
    if (!has('permissions-policy', /xr-spatial-tracking=\(self\)/)) err('headers', '_headers', '/* Permissions-Policy must allow xr-spatial-tracking=(self)');
    if (!has('cross-origin-opener-policy')) err('headers', '_headers', '/* missing Cross-Origin-Opener-Policy');
  }
  if (hRules.some((r) => r.headers.some(([n]) => n === 'x-frame-options'))) err('headers', '_headers', 'X-Frame-Options found: it would block the embeddable viewer (use CSP frame-ancestors)');
  const embeds = embedPrefixes();
  const REQUIRED_CSP = [/default-src 'self'/, /script-src [^;]*'self'/, /script-src [^;]*'wasm-unsafe-eval'/, /img-src [^;]*blob:/, /connect-src [^;]*blob:/, /worker-src [^;]*blob:/, /object-src 'none'/, /base-uri 'self'/, /form-action 'self'/];
  for (const p of pages.values()) {
    if (p.is404) continue;
    const csp = headerValues(p.urlPath, 'content-security-policy');
    if (csp.length !== 1) { err('headers', p.where, `${csp.length} CSP rules match ${p.urlPath} (exactly 1 expected; Netlify joins overlapping values)`); if (!csp.length) continue; }
    const v = csp[0];
    for (const re of REQUIRED_CSP) if (!re.test(v)) err('headers', p.where, `CSP lacks ${re.source.replace(/\\/g, '')}`);
    const isEmbed = embeds.some((e) => p.urlPath.startsWith(e));
    if (isEmbed && !/frame-ancestors \*/.test(v)) err('headers', p.where, 'embed page CSP must have frame-ancestors *');
    if (!isEmbed && !/frame-ancestors 'self'/.test(v)) err('headers', p.where, "CSP must have frame-ancestors 'self'");
    if (isEmbed && !headerValues(p.urlPath, 'x-robots-tag').some((x) => /noindex/.test(x))) err('headers', p.where, 'embed page without X-Robots-Tag: noindex');
    else if (isEmbed && !headerValues(p.urlPath, 'x-robots-tag').some((x) => /indexifembedded/.test(x))) warn('headers', p.where, `embed page X-Robots-Tag without indexifembedded (expected "${EMBED_ROBOTS}")`);
    const script = (v.match(/script-src ([^;]+)/) || [])[1] || '';
    if (/'unsafe-inline'/.test(script)) warn('headers', p.where, "script-src uses 'unsafe-inline'");
    else for (const h of inlineScriptHashes(p.html)) if (!script.includes(`'sha256-${h}'`)) err('headers', p.where, `inline script sha256-${h.slice(0, 12)}… not allowed by the CSP (it would be blocked)`);
    const dup = duplicateHeaders(p.urlPath);
    if (dup.length) err('headers', p.where, `header(s) defined by overlapping rules (values get comma-joined): ${dup.join(', ')}`);
  }
  const noindexCheck = (urlPath, label) => { if (!headerValues(urlPath, 'x-robots-tag').some((x) => /noindex/.test(x))) err('headers', label, `${urlPath} without X-Robots-Tag: noindex`); };
  for (const f of allFiles.filter((x) => path.basename(x) === 'index.md')) { // the Markdown mirrors (license .md files under /assets and /lib are plain assets)
    const u = `/${rel(f)}`;
    noindexCheck(u, rel(f));
    if (!headerValues(u, 'content-type').some((x) => /text\/markdown/.test(x))) err('headers', rel(f), 'no Content-Type: text/markdown');
  }
  for (const u of [...site.langs.map((l) => LLMS_INDEX.path(l)), ...site.langs.map((l) => LLMS_FULL.path(l)), '/indexnow-manifest.json', '/indexnow-pending.json']) if (distFile(u)) noindexCheck(u, u.slice(1));
  for (const f of allFiles.filter((x) => /\.(glb|usdz)$/i.test(x))) {
    const u = `/${rel(f)}`;
    const want = f.toLowerCase().endsWith('.glb') ? 'model/gltf-binary' : 'model/vnd.usdz+zip';
    if (!headerValues(u, 'content-type').includes(want)) err('headers', rel(f), `Content-Type must be ${want}`);
    if (!headerValues(u, 'access-control-allow-origin').includes('*')) err('headers', rel(f), 'no Access-Control-Allow-Origin: *');
    if (!headerValues(u, 'cache-control').length) err('headers', rel(f), 'no Cache-Control');
    const dup = duplicateHeaders(u);
    if (dup.length) err('headers', rel(f), `header(s) defined by overlapping rules: ${dup.join(', ')}`);
  }
  for (const dir of ['assets', 'lib']) {
    const sample = allFiles.find((f) => rel(f).startsWith(`${dir}/`));
    if (sample && !headerValues(`/${rel(sample)}`, 'cache-control').some((x) => /immutable/.test(x) && /max-age=31536000/.test(x))) err('headers', rel(sample), `/${dir}/* must be public, max-age=31536000, immutable`);
  }
}

/* ═══ 10. _redirects ══════════════════════════════════════════ */
const redirTxt = readDist('_redirects');
if (routeRedirects.length && !redirTxt) err('redirects', '_redirects', 'missing');
if (redirTxt) {
  const rules = redirTxt.split(/\r?\n/).map((l) => l.replace(/#.*/, '').trim()).filter(Boolean).map((l) => { const [from, to, st] = l.split(/\s+/); return { from, to, status: st || '301', force: /!$/.test(st || '') }; });
  const froms = new Set(rules.map((r) => r.from));
  // Splat rules: only 404 fallbacks to a 404 page are allowed (status 404, not forced); a 200/30x catch-all
  // would turn every missing URL into a soft 404 or a redirect.
  const is404Fallback = (r) => /\/\*$/.test(r.from) && /^404$/.test(r.status) && /(^|\/)404\.html$/.test(r.to);
  for (const r of rules.filter((x) => /\*/.test(x.from))) {
    if (!is404Fallback(r)) err('redirects', '_redirects', `splat rule ${r.from} → ${r.to} ${r.status} (only "<prefix>/*  <prefix>/404.html  404" fallbacks are allowed)`);
    else {
      const prefix = r.from.slice(0, -1); // "/en/" or "/"
      if (!r.to.startsWith(prefix)) err('redirects', '_redirects', `404 fallback ${r.from} → ${r.to} serves a page from another section`);
      const more = rules.findIndex((x) => is404Fallback(x) && x !== r && x.from.startsWith(prefix) && x.from.length > r.from.length);
      if (more > rules.indexOf(r)) err('redirects', '_redirects', `404 fallback ${r.from} comes before the more specific ${rules[more].from} (first match wins)`);
    }
  }
  const notFoundPages = allFiles.filter((f) => path.basename(f) === '404.html').map((f) => `/${rel(f)}`);
  for (const p of notFoundPages) {
    const dir = path.posix.dirname(p);
    const from = `${dir === '/' ? '' : dir}/*`;
    if (!rules.some((r) => r.from === from && r.to === p && r.status === '404')) (p === '/404.html' ? warn : err)('redirects', '_redirects', `no "${from}  ${p}  404" fallback (visitors of ${dir === '/' ? 'the site' : dir} get ${p === '/404.html' ? "Netlify's default" : 'the wrong-language'} 404 page)`);
  }
  for (const r of rules) {
    if (/\*/.test(r.from)) continue;
    const srcPage = r.from.endsWith('/') ? pages.get(r.from) : null;
    if (srcPage) err('redirects', '_redirects', `source ${r.from} is an existing page`);
    if (!r.from.endsWith('/') && distFile(r.from) && !r.force) info.push(`_redirects: ${r.from} exists as a file, so the rule is shadowed (harmless: the page's canonical covers it)`);
    if (r.force && /(^|\/)index\.html$/.test(r.from)) err('redirects', '_redirects', `forced redirect from ${r.from} risks a loop (Netlify normalises index.html)`);
    const c = classify(r.to, '/');
    if (c.kind === 'internal' && !distFile(c.path)) err('redirects', '_redirects', `destination missing: ${r.to}`);
    if (froms.has(c.path) || froms.has(r.to)) err('redirects', '_redirects', `chain/loop: ${r.from} → ${r.to} → …`);
  }
  for (const r of routeRedirects) if (!rules.some((x) => x.from === r.from && x.to === r.to)) err('redirects', '_redirects', `routes.mjs redirect ${r.from} → ${r.to} not emitted`);
}

/* ═══ 11. Orphans ═════════════════════════════════════════════ */
for (const p of indexablePages) {
  if (p.id === 'home') continue;
  const from = [...(inbound.get(p.urlPath) || [])].filter((u) => pages.get(u)?.indexable);
  if (!from.length) err('orphans', p.where, 'orphan: no indexable page links here');
  else if (from.length < 3) warn('orphans', p.where, `only ${from.length} indexable page(s) link here (< 3)`);
}

// 05 §5.3 #4: every service page is linked from its language home, its hub and at least one guide.
for (const p of indexablePages.filter((x) => x.template === 'service')) {
  const from = inbound.get(p.urlPath) || new Set();
  const homePath = routeById.home?.[p.lang];
  const hubPath = routeById[p.route.route.parent]?.[p.lang];
  if (homePath && pages.has(homePath) && !from.has(homePath)) warn('orphans', p.where, 'service not linked from the home');
  if (hubPath && pages.has(hubPath) && !from.has(hubPath)) warn('orphans', p.where, `service not linked from its hub ${hubPath}`);
  if (indexablePages.some((x) => x.lang === p.lang && x.template === 'guide') && ![...from].some((u) => pages.get(u)?.template === 'guide')) warn('orphans', p.where, 'service not linked from any guide');
}
// 05 §5.3 #13: enough text on service / audience / zone pages (the content validator measures unique words).
for (const p of indexablePages.filter((x) => ['service', 'audience', 'zone'].includes(x.template))) {
  const main = (p.html.match(/<main\b[\s\S]*?<\/main>/i) || [''])[0];
  const w = words(textOf(main));
  const min = p.lang === 'es' ? 700 : 600;
  if (w < min) warn('content', p.where, `${w} words in <main> (content target ≥ ${min})`);
}

/* ═══ 12. Forms (Netlify) ═════════════════════════════════════ */
const formFields = new Map();
for (const p of pages.values()) {
  for (const m of p.html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    const a = parseAttrs(m[1]);
    if (!('data-netlify' in a) && !('netlify' in a)) continue;
    const name = a.name || '(no name)';
    if (!a.name) err('forms', p.where, 'Netlify form without name');
    if (a['netlify-honeypot'] !== 'bot-field') err('forms', p.where, `form ${name}: netlify-honeypot="bot-field" missing`);
    if (!new RegExp(`name=["']bot-field["']`).test(m[2])) err('forms', p.where, `form ${name}: honeypot input bot-field missing`);
    const fn = m[2].match(/<input\b[^>]*name=["']form-name["'][^>]*>/i);
    if (!fn || parseAttrs(fn[0]).value !== a.name) err('forms', p.where, `form ${name}: hidden form-name input with value "${a.name}" missing`);
    if (/type=["']file["']/i.test(m[2]) && a.enctype !== 'multipart/form-data') err('forms', p.where, `form ${name}: file input requires enctype="multipart/form-data"`);
    if (a.action) { const c = classify(a.action, p.urlPath); if (c.kind === 'internal' && !distFile(c.path)) err('forms', p.where, `form ${name}: action ${a.action} does not exist`); }
    if (!/type=["']checkbox["'][^>]*required|required[^>]*type=["']checkbox["']/i.test(m[2])) warn('forms', p.where, `form ${name}: no required privacy (RGPD) checkbox`);
    const fields = [...new Set([...m[2].matchAll(/\bname=["']([^"']+)["']/g)].map((x) => x[1]))].sort().join(',');
    if (formFields.has(name) && formFields.get(name).fields !== fields) warn('forms', p.where, `form ${name} has different fields than on ${formFields.get(name).where} (Netlify registers one field set per name)`);
    else if (!formFields.has(name)) formFields.set(name, { fields, where: p.where });
  }
}
const contactPages = routePages.filter((p) => p.template === 'contact');
for (const p of contactPages) if (!/<form\b[^>]*data-netlify/i.test(p.html)) err('forms', p.where, 'contact page without the Netlify form (lead capture)');
if (routePages.length && !formFields.has('presupuesto')) warn('forms', 'site', 'no Netlify form named "presupuesto" found');

/* ═══ 13. 3D assets ═══════════════════════════════════════════ */
const USDZ_BUDGET = 10e6;
for (const f of allFiles.filter((x) => /\.(glb|usdz)$/i.test(x))) {
  const fd = fs.openSync(f, 'r'); const b = Buffer.alloc(12); fs.readSync(fd, b, 0, 12, 0); fs.closeSync(fd);
  if (f.toLowerCase().endsWith('.glb')) {
    if (b.toString('ascii', 0, 4) !== 'glTF' || b.readUInt32LE(4) !== 2) err('3d', rel(f), 'not a glTF 2.0 binary (bad header)');
    if (path.basename(f) === 'villa.glb' && size(f) > 4e6) warn('3d', rel(f), `web GLB ${(size(f) / 1e6).toFixed(2)} MB (> 4 MB budget)`);
    else if (path.basename(f) !== 'villa.glb' && size(f) > USDZ_BUDGET) warn('3d', rel(f), `AR GLB ${(size(f) / 1e6).toFixed(2)} MB (> ${USDZ_BUDGET / 1e6} MB: Scene Viewer downloads the whole file first)`);
  } else {
    if (b.toString('ascii', 0, 2) !== 'PK') err('3d', rel(f), 'USDZ is not a zip archive');
    // 10 MB: AR Quick Look downloads the WHOLE file before showing anything (no streaming, no progressive
    // load) on the buyer's mobile connection, and the size is shown next to the button; above ~10 MB the
    // wait on 4G (≈ 10-20 s) makes people give up. Today: tamaño real 8.24 MB, maqueta 1:20 5.26 MB.
    if (size(f) > USDZ_BUDGET) warn('3d', rel(f), `USDZ ${(size(f) / 1e6).toFixed(2)} MB (> ${USDZ_BUDGET / 1e6} MB budget: Quick Look downloads the whole file before showing it)`);
  }
  // Textures (05 §5.3 #23): ≤ 2048 px in the web GLB, ≤ 1024 px recommended for AR files (phone memory).
  try {
    const tex = f.toLowerCase().endsWith('.glb') ? glbTextures(fs.readFileSync(f)) : usdzEntries(fs.readFileSync(f), rel(f));
    const max = tex.reduce((m, t) => Math.max(m, t.w || 0, t.h || 0), 0);
    const ar = path.basename(f) !== 'villa.glb';
    if (max > 2048) warn('3d', rel(f), `texture of ${max} px (> 2048)`);
    else if (ar && max > 1024) info.push(`${rel(f)}: largest texture ${max} px (AR guideline 1024 px, 05 §5.3 #23)`);
  } catch (e) { warn('3d', rel(f), `could not inspect textures: ${e.message}`); }
}
/** Pixel size of a PNG / JPEG / WebP buffer, or null. */
function imageSize(b) {
  if (b.length > 24 && b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
    if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i + 9 < b.length;) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}
/** Embedded textures of a GLB (images stored in bufferViews of the BIN chunk). */
function glbTextures(buf) {
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.toString('utf8', 20, 20 + jsonLen));
  const binStart = 20 + jsonLen + 8;
  return (json.images || []).filter((im) => im.bufferView != null).map((im) => {
    const bv = json.bufferViews[im.bufferView];
    const s = binStart + (bv.byteOffset || 0);
    return imageSize(buf.subarray(s, s + Math.min(bv.byteLength, 64 * 1024))) || {};
  });
}
/**
 * USDZ = zip with every entry STORED (no compression) and its data 64-byte aligned (Apple's USDZ spec):
 * AR Quick Look refuses files that break it. Returns the image entries' sizes.
 */
function usdzEntries(buf, where) {
  const out = [];
  for (let o = 0; o + 30 <= buf.length && buf.readUInt32LE(o) === 0x04034b50;) {
    const method = buf.readUInt16LE(o + 8);
    const csize = buf.readUInt32LE(o + 18);
    const nameLen = buf.readUInt16LE(o + 26);
    const extraLen = buf.readUInt16LE(o + 28);
    const name = buf.toString('utf8', o + 30, o + 30 + nameLen);
    const data = o + 30 + nameLen + extraLen;
    if (method !== 0) err('3d', where, `USDZ entry ${name} is compressed (method ${method}): Quick Look needs stored entries`);
    if (data % 64 !== 0) err('3d', where, `USDZ entry ${name} data is not 64-byte aligned (offset ${data})`);
    if (/\.(png|jpe?g|webp)$/i.test(name)) out.push(imageSize(buf.subarray(data, data + Math.min(csize, 64 * 1024))) || {});
    o = data + csize;
  }
  return out;
}
for (const [k, v] of Object.entries(villa.files)) {
  const f = distFile(v.url);
  if (!f) err('3d', 'villa.mjs', `files.${k} ${v.url} is not in dist`);
  else if (size(f) !== v.bytes) warn('3d', 'villa.mjs', `files.${k}.bytes = ${v.bytes} but ${v.url} is ${size(f)} bytes`);
}
if (!manifest.villa_viewer_poster) warn('3d', 'images.json', 'villa_viewer_poster not generated yet (poster → live swap may jump)');

/* ═══ 14. Placeholders ════════════════════════════════════════ */
const phFail = PLACEHOLDERS_FAIL ? err : warn;
const flags = [['site.brand.placeholder', site.brand.placeholder], ['site.domainPlaceholder', site.domainPlaceholder], ['site.contact.placeholder', site.contact.placeholder], ['site.legal.placeholder', site.legal.placeholder]].filter(([, v]) => v).map(([k]) => k);
if (flags.length) phFail('placeholders', 'build/data/site.mjs', `placeholders active: ${flags.join(', ')}${PLACEHOLDERS_FAIL ? ' (production build: fill them or set ALLOW_PLACEHOLDERS=1)' : ''}`);
if (!pricing.confirmed) warn('placeholders', 'build/data/pricing.mjs', 'prices are a PROPOSAL (confirmed: false)');
const PH_PATTERNS = [
  [/\[(?:RAZÓN SOCIAL|NIF|DOMICILIO|DATOS REGISTRALES[^\]]*|MARCA|NOMBRE[^\]]*|CIF)\]/g, 'bracket placeholder'],
  [/\blorem ipsum\b/gi, 'lorem ipsum'],
  [/\bTODO\b|\bFIXME\b|\bTBD\b/g, 'TODO/FIXME/TBD'],
  [/\bexample\.com\b/g, 'example.com'],
];
if (site.domainPlaceholder) PH_PATTERNS.push([new RegExp(HOST.replace(/\./g, '\\.'), 'g'), `placeholder domain ${HOST}`]);
if (site.contact.placeholder) PH_PATTERNS.push([new RegExp(site.contact.phoneDisplay.replace(/[+]/g, '\\+').replace(/\s/g, '\\s?'), 'g'), `placeholder phone ${site.contact.phoneDisplay}`]);
const phHits = new Map();
for (const f of allFiles.filter((x) => /\.(html|md|txt|xml|json|webmanifest)$/.test(x) && !/[\\/](lib|models)[\\/]/.test(x))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const [re, label] of PH_PATTERNS) {
    const n = (s.match(re) || []).length;
    if (n) { const h = phHits.get(label) || { files: 0, n: 0, first: rel(f) }; h.files++; h.n += n; phHits.set(label, h); }
  }
}
for (const [label, h] of phHits) phFail('placeholders', 'dist', `${label}: ${h.n}× in ${h.files} file(s) (e.g. ${h.first})`);

/* ═══ 15. Design lint (merged) ════════════════════════════════ */
let lintSummary = 'skipped';
if (!flag('--no-lint')) {
  const lintScript = path.join(ROOT, 'scripts', 'design-lint.mjs');
  if (!fs.existsSync(lintScript)) err('design-lint', 'scripts/design-lint.mjs', 'missing');
  else {
    const r = spawnSync(process.execPath, [lintScript, DIST], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    // Lint lines are "  x <file>: <message>" / "  ! <file>: <message>" (file relative to dist, or an absolute source path).
    const parse = (s) => { const i = s.indexOf(': '); return i > 0 ? [s.slice(0, i), s.slice(i + 2)] : ['design-lint', s]; };
    for (const line of (r.stdout || '').split(/\r?\n/)) {
      if (/^\s+x /.test(line)) {
        const [where, msg] = parse(line.replace(/^\s+x /, ''));
        // Same rule as budgets "HTML > 60 KB" (already reported there, with a breakdown): not repeated.
        if (/^HTML \d+ KB > 60 KB$/.test(msg) && report.budgets.errors.some((x) => x.where === where.replace(/\\/g, '/') && /^HTML /.test(x.msg))) continue;
        err('design-lint', where, msg);
      }
      else if (/^\s+! /.test(line)) warn('design-lint', ...parse(line.replace(/^\s+! /, '')));
    }
    lintSummary = ((r.stdout || '').match(/Design lint: .*/) || [r.stderr?.trim() || `exit ${r.status}`])[0];
    // Exit ≠ 0 without any "x" line (all duplicates are fine) means the lint itself crashed.
    if (r.status !== 0 && !/^\s+x /m.test(r.stdout || '')) err('design-lint', 'scripts/design-lint.mjs', `failed: ${(r.stderr || '').trim().slice(0, 300)}`, 'geo');
  }
}

/* ── Owners: every finding is attributed to the agent/module that has to fix it ── */
const OWNERS = {
  engine: 'build/build.mjs, build/lib/{context,md,assets,layout,blocks,components}.mjs, build/templates/*, build/data/ui.mjs, src/css/*, src/js/main.js',
  viewer: 'build/lib/viewer.mjs, build/templates/{ar,embed}.mjs, build/data/ui-viewer.mjs, src/js/viewer.js, src/css/50-viewer.css',
  content: 'build/content/<id>.mjs, build/data/glossary.mjs',
  assets: 'scripts/images.mjs, build/generated/images.json, public/assets/*, public/models/*, build/data/villa.mjs (bytes)',
  geo: 'build/lib/{schema,markdown,machine}.mjs, build/check.mjs, scripts/design-lint.mjs, netlify.toml, netlify/*',
  launch: 'humans before launch: build/data/site.mjs, build/data/pricing.mjs (README.md, section 1)',
};
const pageByWhere = new Map([...pages.values()].map((p) => [p.where, p]));
const pageOf = (where) => pageByWhere.get(String(where).replace(/^\.?\//, '')) || null;
const VIEWER_TEMPLATES = new Set(['ar', 'embed']);
/** Route of a broken internal page link, from a "broken href → /path/" message (for "content missing" findings). */
const routeOfHref = (msg) => { const m = msg.match(/→ (\/[^\s#?]*)/); return m ? pathMap.get(m[1].endsWith('/') ? m[1] : `${m[1]}/`) || null : null; };
/**
 * Ordered rules, first match wins: [category ('*' = any), message regex (null = any), owner].
 * Page findings on viewer templates (/ar/, /embed/) go to VIEWER before these generic rules.
 */
const OWNER_RULES = [
  ['placeholders', null, 'launch'],
  ['headers', null, 'geo'], ['redirects', null, 'geo'], ['schema', null, 'geo'],
  ['discovery', /indexable route\(s\) not built/, 'content'], ['discovery', null, 'geo'],
  ['3d', null, 'assets'], ['forms', null, 'engine'], ['orphans', null, 'content'],
  ['*', /model-viewer|\bvw-|data-vw|viewer\.js|50-viewer|ui-viewer/, 'viewer'],
  ['budgets', /JSON-LD/, 'geo'], ['budgets', /LCP image|woff2|font/i, 'assets'], ['budgets', null, 'engine'],
  ['links', /→ \/(assets\/img|models)\//, 'assets'], ['links', /anchor #/, 'content'], ['links', /insecure http:|target=_blank/, 'content'], ['links', null, 'engine'],
  ['content', /\.lead has|words in <main>|generic link text|unresolved \{\{token\}\}|undefined \/ NaN|cajetin|target=_blank/, 'content'], ['content', null, 'engine'],
  ['meta', /^title \d+ chars|^description \d+ chars|^duplicate (title|description)|unresolved token in title/, 'content'], ['meta', null, 'engine'],
  ['design-lint', /^HTML \d+ KB|initial JS|primary CTA|eyebrows|button|form control|heading|<h1>|dead link|viewport|transition|outline|100vh|hex|backdrop|cursor|img /, 'engine'],
  ['design-lint', /LCP image|font/i, 'assets'],
  ['design-lint', /dash|"\.\.\."|banned copy|straight double quote|leftover/, 'content'],
  ['structure', null, 'engine'], ['images', null, 'engine'],
];
function ownerOf(cat, f) {
  if (f.owner) return f.owner;
  if (cat === 'links' && /^broken href/.test(f.msg)) { const r = routeOfHref(f.msg); if (r && !pages.has(r.route[r.lang])) return 'content'; }
  const pg = pageOf(f.where);
  if (pg && VIEWER_TEMPLATES.has(pg.template) && !['placeholders', 'headers', 'redirects', 'schema', 'discovery', 'budgets', '3d'].includes(cat)) return 'viewer';
  for (const [c, re, owner] of OWNER_RULES) if ((c === '*' || c === cat) && (!re || re.test(f.msg))) return owner;
  return 'engine';
}
/** Where to look: the content file of the page (content findings) or of a missing link target. */
function hintOf(cat, f, owner) {
  if (owner !== 'content') return '';
  if (cat === 'links') { const r = routeOfHref(f.msg); if (r && !pages.has(r.route[r.lang])) return `build/content/${r.id}.mjs missing (or without "${r.lang}")`; }
  if (cat === 'discovery') return 'build/content/<id>.mjs for each route listed';
  const pg = pageOf(f.where);
  return pg?.id ? `build/content/${pg.id}.mjs [${pg.lang}]` : '';
}
/** Byte breakdown of an over-budget page: what to cut first (engine/viewer/geo/content). */
function htmlBreakdown(html) {
  const parts = [];
  const add = (label, re) => { let n = 0; for (const m of html.matchAll(re)) n += Buffer.byteLength(m[0]); if (n) parts.push([label, n]); };
  add('JSON-LD (geo)', /<script\b[^>]*application\/ld\+json[\s\S]*?<\/script>/gi);
  add('inline <svg>', /<svg\b[\s\S]*?<\/svg>/gi);
  add('site <header>', /<header\b[^>]*\bsite-header\b[\s\S]*?<\/header>/gi);
  add('site <footer>', /<footer\b[^>]*\bsite-footer\b[\s\S]*?<\/footer>/gi);
  for (const m of html.matchAll(/<section\b[^>]*class="[^"]*\bblock--([\w-]+)[^"]*"[\s\S]*?<\/section>/gi)) parts.push([`section.block--${m[1]}`, Buffer.byteLength(m[0])]);
  return parts.sort((a, b) => b[1] - a[1]).slice(0, 7).map(([k, n]) => `${k} ${kb(n)}`).join(' · ');
}
for (const f of report.budgets.errors) {
  const pg = /^HTML [\d.]+ KB > 60 KB/.test(f.msg) ? pageOf(f.where) : null;
  if (pg) f.detail = `largest parts: ${htmlBreakdown(pg.html)}`;
}
for (const f of report.budgets.errors.filter((x) => /^CSS /.test(x.msg))) {
  const src = path.join(ROOT, 'src', 'css');
  try {
    const files = fs.readdirSync(src).filter((x) => x.endsWith('.css'))
      .map((x) => [x, Buffer.byteLength(fs.readFileSync(path.join(src, x), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' '))]);
    f.detail = `src/css without comments/whitespace: ${files.sort((a, b) => b[1] - a[1]).map(([x, n]) => `${x} ${kb(n)}`).join(' · ')}`;
  } catch { /* no sources */ }
}

/* ── Output (grouped by owner, then category) ─────────────────── */
const LIMIT = VERBOSE ? Infinity : 30;
const mode = PRODUCTION ? `PRODUCTION${PLACEHOLDERS_FAIL ? '' : ' (placeholders allowed)'}` : 'preview/local';
console.log(`\nQA check · ${DIST} · mode: ${mode}${PLACEHOLDERS ? ' · placeholders active (all pages noindex)' : ''}`);
console.log(`${pages.size} HTML files (${indexablePages.length} indexable, ${routePages.length - indexablePages.length} utility, ${[...pages.values()].filter((p) => !p.route).length} other)\n`);
const byOwner = Object.fromEntries(Object.keys(OWNERS).map((o) => [o, { errors: [], warnings: [] }]));
let totalE = 0; let totalW = 0;
for (const c of CATS) {
  for (const sev of ['errors', 'warnings']) {
    for (const f of report[c][sev]) {
      const owner = ownerOf(c, f);
      byOwner[owner][sev].push({ cat: c, where: f.where, msg: f.msg, detail: f.detail || '', hint: hintOf(c, f, owner) });
      if (sev === 'errors') totalE++; else totalW++;
    }
  }
}
for (const [owner, { errors, warnings }] of Object.entries(byOwner)) {
  if (!errors.length && !warnings.length) continue;
  console.log(`■ ${owner.toUpperCase()}: ${errors.length} error(s), ${warnings.length} warning(s)   (${OWNERS[owner]})`);
  const line = (sym, f) => console.log(`  ${sym} [${f.cat}] ${f.where}: ${f.msg}${f.detail ? ` [${f.detail}]` : ''}${f.hint ? `  → ${f.hint}` : ''}`);
  errors.slice(0, LIMIT).forEach((f) => line('✗', f));
  if (errors.length > LIMIT) console.log(`  … ${errors.length - LIMIT} more errors (--verbose)`);
  warnings.slice(0, LIMIT).forEach((f) => line('!', f));
  if (warnings.length > LIMIT) console.log(`  … ${warnings.length - LIMIT} more warnings (--verbose)`);
  console.log('');
}
const catLine = CATS.map((c) => [c, report[c].errors.length, report[c].warnings.length]).filter(([, e, w]) => e || w).map(([c, e, w]) => `${c} ${e}/${w}`).join(' · ');
if (catLine) console.log(`By category (errors/warnings): ${catLine}`);
if (budgetRows.length) {
  console.log('\nBudgets (§11):');
  for (const [k, v, max] of budgetRows) console.log(`  ${v > max ? '✗' : '✓'} ${k.padEnd(34)} ${kb(v).padStart(10)}  / ${kb(max)}`);
}
for (const i of info) console.log(`  · ${i}`);
console.log(`  · design lint: ${lintSummary}`);
const ownerSummary = Object.entries(byOwner).filter(([, v]) => v.errors.length).map(([o, v]) => `${o} ${v.errors.length}`).join(', ');
console.log(`\n${totalE ? '✗' : '✓'} ${totalE} error(s), ${totalW} warning(s)${ownerSummary ? `  ·  errors by owner: ${ownerSummary}` : ''}`);
const jsonOut = optVal('--json');
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ dist: DIST, mode, errors: totalE, warnings: totalW, owners: OWNERS, byOwner, report }, null, 2));
process.exit(totalE ? 1 : 0);
