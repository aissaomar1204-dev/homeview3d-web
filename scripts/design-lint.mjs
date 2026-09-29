#!/usr/bin/env node
/* Design lint for the generated site (ESM, Node >= 20, no dependencies).
   Copy of docs/design/design-lint.mjs adapted to this project's dist/ (owner: GEO):
     node scripts/design-lint.mjs dist      (also run and merged by build/check.mjs)
   Mechanical checks from docs/design/DESIGN-RULEBOOK.md (Part D1). Exit code 1 on any error.
   Adaptations (rules unchanged):
   - src/css/*.css are concatenated into ONE hashed dist/assets/css/site.<hash>.css, so the
     "hex only in tokens" rule is enforced on the sources (only 00-tokens.css may hold hex
     colours) and, in dist, hex colours are allowed only inside custom-property declarations.
   - The Netlify honeypot is named `bot-field` (BUILD-SPEC §7).
   - Straight quotes inside <pre>/<code> (the iframe embed snippet) are code, not prose.
   - LCP weight is measured on the AVIF candidate closest to 1200w when the LCP <img> sits in a <picture>
     with an AVIF source (what a phone downloads); the <img src> is only the fallback for browsers without AVIF.
   - Copy findings (dashes, "...", banned words) quote ~70 characters around the match.
   - Drawing-set rules (rulebook Overrides O3, 2026-09-29): the decoration the client asked for (chapter tones, crop marks,
     grids, outlined numerals, plates, láminas, dark chapters) is allowed but disciplined: known tones, no two neighbouring
     chapters alike, decoration hidden from assistive tech, decorative pictures with alt="", plate captions that say render,
     and generated text in CSS always with an empty-alt fallback.
   - Page weight budgets (BUILD-SPEC §11) come from BUDGETS in build/lib/machine.mjs (same numbers as
     build/check.mjs): HTML raw AND brotli per page, shared stylesheet, total CSS per page and the number of
     render-blocking stylesheet requests. The local fallback below is used only if that module cannot load. */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(process.argv[2] || path.join(HERE, '..', process.env.OUT_DIR || 'dist'));
const SRC_CSS = path.join(HERE, '..', 'src', 'css');
const TOKENS_CSS = /(^|[-.])tokens\.css$/; // the ONLY source css file allowed to contain raw hex colours (00-tokens.css)
let SHARED = { htmlRawKB: 90, htmlBrotliKB: 19, brotliQuality: 11, cssSharedKB: 42, cssPageKB: 72, cssBlockingMax: 2, initialJsKB: 30, lcpImageTargetKB: 120 };
try { SHARED = { ...SHARED, ...(await import('../build/lib/machine.mjs')).BUDGETS }; } catch { /* standalone copy: local fallback */ }
const BUDGET = {
  htmlKB: SHARED.htmlRawKB, htmlBrotliKB: SHARED.htmlBrotliKB, brotliQuality: SHARED.brotliQuality,
  cssSharedKB: SHARED.cssSharedKB, cssPageKB: SHARED.cssPageKB, cssBlockingMax: SHARED.cssBlockingMax,
  initialJsKB: SHARED.initialJsKB, fontFiles: 3, fontKB: 60, lcpImageKB: SHARED.lcpImageTargetKB, backdropFilters: 1,
};
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
const kb1 = (bytes) => (bytes / 1024).toFixed(1);
const brotli = (buf) => zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: BUDGET.brotliQuality } }).length;
const fileSize = (p) => { try { return fs.statSync(p).size; } catch { return 0; } };
/** Stylesheets linked by a page (+ their @imports), with render-blocking status (media "print"/"not all" do not block). */
const cssImportsOf = (file) => {
  let css = '';
  try { css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''); } catch { return []; }
  return [...css.matchAll(/@import\s+(?:url\(\s*)?["']?(\/[^"')\s;]+)["']?\s*\)?([^;]*);/g)].map((m) => ({ file: path.join(DIST, m[1].split(/[?#]/)[0]), media: m[2].trim() }));
};
function pageStylesheets(html) {
  const out = [];
  const seen = new Set();
  const add = (file, media) => {
    if (seen.has(file) || !fs.existsSync(file)) return;
    seen.add(file);
    out.push({ file, bytes: fileSize(file), blocking: !/^\s*(print|not\s+all)\s*$/i.test(media || '') });
    for (const im of cssImportsOf(file)) add(im.file, im.media || media);
  };
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\brel="[^"]*\bstylesheet\b[^"]*"/i.test(tag) || /\sdisabled\b/i.test(tag)) continue;
    const href = attr(tag, 'href');
    if (href && href.startsWith('/') && !href.startsWith('//')) add(path.join(DIST, href.split(/[?#]/)[0]), attr(tag, 'media'));
  }
  return out;
}
const cssUse = new Map(); // stylesheet → number of pages linking it (shared sheet detection)
let pagesWithCss = 0;

// Text extraction. keepLd=true keeps JSON-LD strings (public content for search/LLMs) for dash and wording checks.
const extractText = (html, keepLd) => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<template[\s\S]*?<\/template>/gi, ' ')
  .replace(keepLd ? /<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi : /<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ');
/** ~70 characters around the first match, so the owner can find the string. */
const around = (text, re) => {
  const t = text.replace(/\s+/g, ' ');
  const m = t.match(re);
  return m ? t.slice(Math.max(0, m.index - 35), m.index + m[0].length + 35).trim() : '';
};
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

  // Page weight (BUILD-SPEC §11): raw AND brotli.
  const raw = fs.readFileSync(f);
  if (raw.length > BUDGET.htmlKB * 1024) err(f, `HTML ${kb1(raw.length)} KB > ${BUDGET.htmlKB} KB`);
  const br = brotli(raw);
  if (br > BUDGET.htmlBrotliKB * 1024) err(f, `HTML ${kb1(br)} KB brotli > ${BUDGET.htmlBrotliKB} KB`);
  const sheets = pageStylesheets(html);
  if (sheets.length) pagesWithCss++;
  for (const s of sheets) cssUse.set(s.file, (cssUse.get(s.file) || 0) + 1);
  const cssTotal = sheets.reduce((n, s) => n + s.bytes, 0);
  const blocking = sheets.filter((s) => s.blocking);
  if (cssTotal > BUDGET.cssPageKB * 1024) err(f, `CSS ${kb1(cssTotal)} KB on this page > ${BUDGET.cssPageKB} KB (${sheets.length} stylesheets)`);
  if (blocking.length > BUDGET.cssBlockingMax) err(f, `${blocking.length} render-blocking stylesheet requests (max ${BUDGET.cssBlockingMax}): ${blocking.map((s) => path.basename(s.file)).join(', ')}`);
  if (DASHES.test(text)) err(f, `em/en dash in content (use a period, comma, colon or hyphen) near «${around(text, DASHES)}»`);
  if (/\.\.\./.test(text)) err(f, `"..." found, use the ellipsis character, near «${around(text, /\.\.\./)}»`);
  const prose = extractText(html.replace(/<(pre|code)\b[\s\S]*?<\/\1>/gi, ' '), false);
  if (/"|&quot;/.test(prose)) warn(f, 'straight double quote in visible text (ES: « », EN: curly quotes)');
  for (const re of BANNED_WORDS) if (re.test(text)) err(f, `banned copy pattern ${re} near «${around(text, re)}»`);
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

  // Drawing-set chapters (O3): known tones, neighbours differ, decoration is aria-hidden, decorative pictures have alt="".
  const TONES = new Set(['h', 'w', 'p', 'g', 'k', 'c', 'plate']);
  const tones = [...html.matchAll(/<(?:section|article)\b[^>]*\sdata-ch="(\w+)"/gi)].map((m) => m[1]);
  for (const t of tones) if (!TONES.has(t)) err(f, `unknown chapter tone data-ch="${t}" (allowed: ${[...TONES].join(' ')})`);
  tones.forEach((t, i) => { if (i && t === tones[i - 1] && t !== 'plate') err(f, `two neighbouring chapters share the tone "${t}" (no rhythm)`); });
  for (const c of ['ch-ax', 'hv-leg', 'bento__tb', 'ch-bg', 'index__media', 'site-footer__cut', 'process__side']) {
    for (const m of html.matchAll(new RegExp(`<(?:div|p)\\b[^>]*class="[^"]*\\b${c}\\b[^"]*"[^>]*>`, 'g'))) if (!/aria-hidden="true"/.test(m[0])) err(f, `decoration .${c} must be aria-hidden="true"`);
  }
  // On a page with chapters every top-level block section IS a chapter (a block type missing from CHAPTERS would be a plain strip
  // between two tones). Sections inside an <article> (the guide's reading column) are content, not chapters.
  if (tones.length) {
    const mainHtml = (html.match(/<main\b[^>]*>([\s\S]*)<\/main>/) || [, ''])[1];
    const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'path', 'use', 'circle', 'rect', 'line', 'polyline', 'polygon']);
    const stack = [];
    for (const m of mainHtml.matchAll(/<(\/?)([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
      const [, close, name, rest] = m; const tag = name.toLowerCase();
      if (VOID.has(tag) || /\/\s*$/.test(rest)) continue;
      if (close) { const i = stack.lastIndexOf(tag); if (i >= 0) stack.length = i; continue; }
      if (tag === 'section' && stack.length === 0 && !/\sdata-ch=/.test(rest)) {
        const cls = (rest.match(/class="([^"]*)"/) || [, ''])[1];
        err(f, `top-level <section${cls ? ` class="${cls}"` : ''}> is not a chapter (add its block type to CHAPTERS, build/lib/chapters.mjs)`);
      }
      stack.push(tag);
    }
  }
  for (const m of html.matchAll(/<div class="(?:ch-bg|index__media)"[^>]*>([\s\S]*?)<\/div>/g)) for (const im of m[1].matchAll(/<img\b[^>]*>/g)) if (attr(im[0], 'alt') !== '') err(f, 'decorative chapter picture must have alt=""');
  for (const m of html.matchAll(/<section\b[^>]*block--vista[\s\S]*?<\/section>/g)) {
    const figs = (m[0].match(/<figure\b/g) || []).length;
    const caps = [...m[0].matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)].map((x) => x[1].replace(/<[^>]+>/g, ''));
    if (caps.length !== figs) err(f, 'render plate without a caption');
    for (const c of caps) if (!/render/i.test(c)) err(f, `plate caption must say it is a render (IMG-03): «${c.slice(0, 50)}»`);
  }

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
    if (/type="(hidden|submit)"/.test(tag) || /\bname="(website|url_hp|bot-field)"/.test(tag)) continue; // honeypot excluded
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

  // LCP image weight. Inside a <picture> with an AVIF <source>, a phone downloads the AVIF candidate
  // closest to 1200w (375 px × DPR 3 ≈ 1125 px), not the <img src> fallback (WebP, for browsers without
  // AVIF): that candidate is what we measure. A plain <img> is measured on its src.
  const lcp = imgs.find((t) => attr(t, 'fetchpriority') === 'high');
  let lcpFile = lcp ? attr(lcp, 'src') : null;
  if (lcp) {
    const before = html.slice(0, html.indexOf(lcp));
    const open = before.lastIndexOf('<picture');
    const pic = open > before.lastIndexOf('</picture>') ? before.slice(open) : '';
    const avif = [...pic.matchAll(/<source\b[^>]*>/gi)].map((m) => m[0]).find((t) => /avif/.test(attr(t, 'type') || ''));
    const cands = avif ? (attr(avif, 'srcset') || '').split(',').map((x) => x.trim().split(/\s+/)).filter(([u]) => u).map(([u, w]) => ({ u, w: parseInt(w, 10) || 0 })) : [];
    const pick = cands.sort((a, b) => Math.abs(a.w - 1200) - Math.abs(b.w - 1200))[0];
    if (pick && pick.u.startsWith('/')) lcpFile = pick.u;
  }
  if (lcpFile && lcpFile.startsWith('/')) {
    const p = path.join(DIST, lcpFile.split(/[?#]/)[0]);
    if (fs.existsSync(p) && fs.statSync(p).size > BUDGET.lcpImageKB * 1024) err(f, `LCP image ${kb(fs.statSync(p).size)} KB > ${BUDGET.lcpImageKB} KB (${lcpFile})`);
  }
}

// Shared stylesheet: linked by (nearly) every page with CSS, or named site.<hash>.css by the engine.
for (const [file, n] of cssUse) {
  const shared = /(^|[\\/])site\.[0-9a-f]{6,}\.css$/.test(file) || (pagesWithCss > 2 && n >= pagesWithCss * 0.9);
  if (shared && fileSize(file) > BUDGET.cssSharedKB * 1024) err(file, `shared stylesheet ${kb1(fileSize(file))} KB > ${BUDGET.cssSharedKB} KB (linked by ${n} of ${pagesWithCss} pages)`);
}

// Hex colours: only inside custom-property declarations (the concatenated tokens) in dist CSS.
const hexOutsideTokens = (css) => /#[0-9a-f]{3,8}\b/i.test(css.replace(/--[\w-]+\s*:[^;}]*[;}]/g, ' '));
// Source stylesheets (when present): only the tokens file may contain hex at all.
if (fs.existsSync(SRC_CSS)) {
  for (const f of fs.readdirSync(SRC_CSS).filter((x) => x.endsWith('.css')).map((x) => path.join(SRC_CSS, x))) {
    const css = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    if (!TOKENS_CSS.test(path.basename(f)) && /#[0-9a-f]{3,8}\b/i.test(css)) err(f, 'raw hex colour outside tokens.css (use var(--color-*))');
  }
}

// Generated text in the drawing-set stylesheets (numerals, index rows, sheet ids, plate numbers) must never reach a screen reader:
// every content: attr()/counter() has a sibling content: … / "" (the alt form), unless the element itself is aria-hidden (.bento__tb).
if (fs.existsSync(SRC_CSS)) {
  for (const name of ['24-chapters.css', '42-process.css', '43-bento.css', '56-cards.css', '57-inner.css', '49-article.css', '48-glossary.css']) {
    const p = path.join(SRC_CSS, name);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of src.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const decls = [...m[2].matchAll(/(?:^|;)\s*content\s*:\s*([^;]+)/g)].map((x) => x[1]);
      const text = decls.filter((d) => /attr\(|counter\(/.test(d));
      if (text.length && !decls.some((d) => /\/\s*""\s*$/.test(d)) && !/bento__tb/.test(m[1])) err(p, `generated text without an empty-alt fallback in «${m[1].trim().slice(0, 60)}» (add content: … / "")`);
    }
  }
}

for (const f of files.filter((x) => x.endsWith('.css'))) {
  const css = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  if (/transition\s*:\s*all\b/i.test(css)) err(f, 'transition: all (list properties explicitly)');
  if (/outline\s*:\s*(none|0)\b/i.test(css) && !/:focus-visible/.test(css)) err(f, 'outline removed without :focus-visible replacement');
  if (/\b100vh\b/.test(css)) err(f, '100vh used (use 100dvh / svh)');
  if (/#000(000)?\b|#fff(fff)?\b/i.test(css)) err(f, 'pure black/white hex');
  if (/cursor\s*:\s*(none|url\()/i.test(css)) err(f, 'custom cursor');
  if (!TOKENS_CSS.test(path.basename(f)) && hexOutsideTokens(css)) err(f, 'raw hex colour outside tokens.css (use var(--color-*))');
  const bf = (css.match(/backdrop-filter\s*:/gi) || []).length;
  if (bf > BUDGET.backdropFilters) err(f, `${bf} backdrop-filter rules (max ${BUDGET.backdropFilters})`);
  if (/@import\s+url\([^)]*fonts\.googleapis/i.test(css)) err(f, 'Google Fonts @import (self-host woff2)');
}

const fonts = files.filter((x) => x.endsWith('.woff2'));
if (fonts.length > BUDGET.fontFiles) err(DIST, `${fonts.length} font files (max ${BUDGET.fontFiles})`);
for (const f of fonts) if (fs.statSync(f).size > BUDGET.fontKB * 1024) err(f, `font ${kb(fs.statSync(f).size)} KB > ${BUDGET.fontKB} KB`);

console.log(`\nDesign lint: ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
