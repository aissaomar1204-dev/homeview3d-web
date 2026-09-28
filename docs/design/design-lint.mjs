#!/usr/bin/env node
/* Design lint for the generated site (ESM, Node >= 20, no dependencies).
   Copy to scripts/design-lint.mjs and run after the build: node scripts/design-lint.mjs [distDir]
   Mechanical checks from docs/design/DESIGN-RULEBOOK.md (Part D1). Exit code 1 on any error. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(process.argv[2] || path.join(HERE, '..', 'dist'));
const TOKENS_CSS = 'tokens.css'; // the ONLY css file allowed to contain raw hex colours
const BUDGET = { htmlKB: 60, initialJsKB: 30, fontFiles: 3, fontKB: 60, lcpImageKB: 120, backdropFilters: 1 };
const CTA = {
  es: ['Pide tu demo', 'Ver la villa en 3D', 'Ver en tu salón', 'Calcular precio', 'Enviar solicitud', 'Escribir por WhatsApp'],
  en: ['Get your demo', 'View the villa in 3D', 'View in your room', 'Estimate price', 'Send request', 'Message on WhatsApp'],
};
const BANNED_WORDS = [
  /\belevat(e|es|ing)\b/i, /\bseamless(ly)?\b/i, /\bunleash/i, /\bnext-gen\b/i, /\brevolutioni[sz]e/i,
  /\bgame[- ]changer\b/i, /\bdelve\b/i, /\btapestry\b/i, /\bin the world of\b/i, /\bcutting-edge\b/i,
  /\beleva(r|mos|ndo)?\b/i, /\bsin fisuras\b/i, /\brevolucion(a|ar|amos)\b/i, /\bde (última|nueva) generación\b/i,
  /\bsiguiente nivel\b/i, /\bdesbloque/i, /\bsoluciones integrales\b/i, /\bde vanguardia\b/i,
  /\bscroll to explore\b/i, /\bdesliza para (descubrir|explorar)\b/i, /\blorem ipsum\b/i,
];
// Em dash U+2014 and en dash U+2013, built from code points so the source stays ASCII-safe.
const DASHES = new RegExp(`[${String.fromCharCode(0x2014, 0x2013)}]`);
const LEFTOVERS = [/\bTODO\b/, /\bFIXME\b/, /\{\{\s*BRAND\s*\}\}/, /picsum\.photos/, /images\.unsplash\.com/, /fonts\.googleapis\.com/, /fonts\.gstatic\.com/];

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const files = walk(DIST);
let errors = 0;
let warnings = 0;
const err = (f, m) => { errors++; console.log(`  x ${path.relative(DIST, f)}: ${m}`); };
const warn = (f, m) => { warnings++; console.log(`  ! ${path.relative(DIST, f)}: ${m}`); };
const kb = (bytes) => Math.round(bytes / 1024);

// Text extraction. keepLd=true keeps JSON-LD strings (public content for search/LLMs) for dash and wording checks.
const extractText = (html, keepLd) => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<template[\s\S]*?<\/template>/gi, ' ')
  .replace(keepLd ? /<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi : /<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ');
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i')); return m ? m[1] : null; };
// Human-facing attribute values: alt, aria-label, title, placeholder, and <meta content>.
const attrText = (html) => [
  ...[...html.matchAll(/\b(?:alt|aria-label|title|placeholder)="([^"]*)"/gi)].map((m) => m[1]),
  ...[...html.matchAll(/<meta\b[^>]*\bcontent="([^"]*)"/gi)].map((m) => m[1]),
].join(' ');

for (const f of files.filter((x) => x.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  const text = `${extractText(html, true)} ${attrText(html)}`;
  const visible = extractText(html, false);
  const lang = (html.match(/<html[^>]*\blang="([a-z]{2})/i) || [])[1] || 'es';

  if (fs.statSync(f).size > BUDGET.htmlKB * 1024) err(f, `HTML ${kb(fs.statSync(f).size)} KB > ${BUDGET.htmlKB} KB`);
  if (DASHES.test(text)) err(f, 'em/en dash in content (use a period, comma, colon or hyphen)');
  if (/\.\.\./.test(text)) err(f, '"..." found, use the ellipsis character');
  if (/"|&quot;/.test(visible)) warn(f, 'straight double quote in visible text (ES: « », EN: curly quotes)');
  for (const re of BANNED_WORDS) if (re.test(text)) err(f, `banned copy pattern ${re}`);
  for (const re of LEFTOVERS) if (re.test(html)) err(f, `leftover/forbidden string ${re}`);

  // Headings
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1 !== 1 && !/404/.test(f)) err(f, `${h1} <h1> elements (must be exactly 1)`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) err(f, `heading level jumps h${levels[i - 1]} -> h${l}`); });

  // Eyebrow budget: max ceil(sections / 3)
  const sections = (html.match(/<section[\s>]/gi) || []).length;
  const eyebrows = (html.match(/class="[^"]*\beyebrow\b/gi) || []).length;
  if (sections && eyebrows > Math.ceil(sections / 3)) err(f, `${eyebrows} eyebrows for ${sections} sections (max ${Math.ceil(sections / 3)})`);

  // Images
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  imgs.forEach((tag, i) => {
    if (attr(tag, 'alt') === null) err(f, `img without alt: ${tag.slice(0, 90)}`);
    if (!attr(tag, 'width') || !attr(tag, 'height')) err(f, `img without width/height: ${tag.slice(0, 90)}`);
    const eager = attr(tag, 'fetchpriority') === 'high';
    if (!eager && attr(tag, 'loading') !== 'lazy') warn(f, `img #${i + 1} not lazy and not fetchpriority=high`);
    if (eager && attr(tag, 'loading') === 'lazy') err(f, 'LCP image must not be loading=lazy');
  });
  if ((html.match(/fetchpriority="high"/g) || []).length > 1) err(f, 'more than one fetchpriority=high');

  // Interaction semantics
  if (/<(div|span)[^>]*\bonclick=/i.test(html)) err(f, 'click handler on div/span (use <button> or <a>)');
  if (/<a\b[^>]*href="#"/i.test(html)) err(f, 'dead link href="#"');
  for (const m of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const inner = m[1].replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<[^>]+>/g, '').trim();
    if (!inner && !/aria-label="/.test(m[0])) err(f, `icon-only button without aria-label: ${m[0].slice(0, 90)}`);
    if (!/\btype="(button|submit|reset)"/.test(m[0])) warn(f, `button without explicit type: ${m[0].slice(0, 70)}`);
  }
  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
    const tag = m[0];
    if (/type="(hidden|submit)"/.test(tag) || /\bname="(website|url_hp)"/.test(tag)) continue; // honeypot excluded
    const id = attr(tag, 'id');
    const labelled = attr(tag, 'aria-label') || (id && new RegExp(`<label[^>]*for="${id}"`).test(html));
    if (!labelled) err(f, `form control without label: ${tag.slice(0, 90)}`);
    if (!attr(tag, 'name')) err(f, `form control without name: ${tag.slice(0, 90)}`);
  }
  if (/user-scalable=no|maximum-scale=1(\.0)?\b/i.test(html)) err(f, 'viewport disables zoom');
  if (/<script\b[^>]*src="[^"]*model-viewer/i.test(html)) err(f, 'model-viewer loaded eagerly (must be dynamic import after interaction)');

  // Primary CTA vocabulary (one label per intent)
  for (const m of html.matchAll(/<(a|button)\b[^>]*class="[^"]*\bbtn--primary\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const label = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!(CTA[lang] || CTA.es).includes(label)) err(f, `primary CTA label not in dictionary: "${label}"`);
  }

  // Initial JS budget (classic + module scripts referenced in the page)
  let js = 0;
  for (const m of html.matchAll(/<script\b[^>]*src="\/([^"]+)"/gi)) {
    const p = path.join(DIST, m[1]);
    if (fs.existsSync(p)) js += fs.statSync(p).size;
  }
  if (js > BUDGET.initialJsKB * 1024) err(f, `initial JS ${kb(js)} KB > ${BUDGET.initialJsKB} KB`);

  // LCP image weight
  const lcp = imgs.find((t) => attr(t, 'fetchpriority') === 'high');
  if (lcp && attr(lcp, 'src') && attr(lcp, 'src').startsWith('/')) {
    const p = path.join(DIST, attr(lcp, 'src'));
    if (fs.existsSync(p) && fs.statSync(p).size > BUDGET.lcpImageKB * 1024) err(f, `LCP image ${kb(fs.statSync(p).size)} KB > ${BUDGET.lcpImageKB} KB`);
  }
}

for (const f of files.filter((x) => x.endsWith('.css'))) {
  const css = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  if (/transition\s*:\s*all\b/i.test(css)) err(f, 'transition: all (list properties explicitly)');
  if (/outline\s*:\s*(none|0)\b/i.test(css) && !/:focus-visible/.test(css)) err(f, 'outline removed without :focus-visible replacement');
  if (/\b100vh\b/.test(css)) err(f, '100vh used (use 100dvh / svh)');
  if (/#000(000)?\b|#fff(fff)?\b/i.test(css)) err(f, 'pure black/white hex');
  if (/cursor\s*:\s*(none|url\()/i.test(css)) err(f, 'custom cursor');
  if (path.basename(f) !== TOKENS_CSS && /#[0-9a-f]{3,8}\b/i.test(css)) err(f, 'raw hex colour outside tokens.css (use var(--color-*))');
  const bf = (css.match(/backdrop-filter\s*:/gi) || []).length;
  if (bf > BUDGET.backdropFilters) err(f, `${bf} backdrop-filter rules (max ${BUDGET.backdropFilters})`);
  if (/@import\s+url\([^)]*fonts\.googleapis/i.test(css)) err(f, 'Google Fonts @import (self-host woff2)');
}

const fonts = files.filter((x) => x.endsWith('.woff2'));
if (fonts.length > BUDGET.fontFiles) err(DIST, `${fonts.length} font files (max ${BUDGET.fontFiles})`);
for (const f of fonts) if (fs.statSync(f).size > BUDGET.fontKB * 1024) err(f, `font ${kb(fs.statSync(f).size)} KB > ${BUDGET.fontKB} KB`);

console.log(`\nDesign lint: ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
