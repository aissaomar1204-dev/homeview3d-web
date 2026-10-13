/* ═══════════════════════════════════════════════════════════════
   Layout (docs/build/BUILD-SPEC.md §4): <head>, header, breadcrumbs,
   footer. Owner: ENGINE; brand parts (inline logo,
   favicons, branded OG): BRAND (scripts/brand.mjs writes the assets this file reads).
   Header and footer follow the new home (build/home/portada.html): floating pill
   with burger menu, footer on the sky with the company name.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './md.mjs';
import { sprite } from './context.mjs';
import { contactHref, BTN_ARROW } from './components.mjs';
import { modulesFor } from './assets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Inline scripts emitted by the layout (machine.mjs hashes every inline script of the built HTML into the CSP). */
export const JS_FLAG_SCRIPT = "document.documentElement.classList.add('js')";
export const meshoptScript = (url) => `self.ModelViewerElement = { meshoptDecoderLocation: '${url}' }`;

/* Light only, like the new home (build/home/estilos.css): no theme toggle, no stored theme, one theme-color. */

/* ─── Brand: the inline lockup (build/generated/brand.json, written by scripts/brand.mjs) ─── */

let LOCKUP = null;
try { LOCKUP = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'generated', 'brand.json'), 'utf8')).horizontal; } catch { /* partial checkout: text wordmark */ }

/**
 * Header logo: the outlined lockup as inline SVG (ink and accent come from the tokens, see
 * .hv-logo in 20-layout.css). The group has an id so the footer can <use> it: the paths ship once per page.
 */
function logoSvg() {
  return `<svg class="hv-logo" viewBox="${LOCKUP.viewBox}" aria-hidden="true" focusable="false"><g id="hv-logo"><path d="${LOCKUP.ink}"/><path class="hv-a" d="${LOCKUP.accent}"/></g></svg>`;
}
const footerLogo = () => `<svg class="hv-logo site-footer__logo" viewBox="${LOCKUP.viewBox}" aria-hidden="true" focusable="false"><use href="#hv-logo"/></svg>`;

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const ROBOTS_NOINDEX = 'noindex, follow';

export function robotsFor(entryIndex, placeholders) {
  return !entryIndex || placeholders ? ROBOTS_NOINDEX : ROBOTS_INDEX;
}

const NAV = [
  ['servicios', 'nav.services'],
  ['como-funciona', 'nav.how'],
  ['precios', 'nav.pricing'],
  ['caso-villa', 'nav.villa'],
  ['guias', 'nav.guides'],
];

function ancestors(ctx, id) {
  const out = [];
  let r = ctx.data.routeById[id];
  while (r && r.parent) { out.push(r.parent); r = ctx.data.routeById[r.parent]; }
  return out;
}

/* ─── Header ──────────────────────────────────────────────────── */

/** One link per other language (ES / EN / DE): to the twin page when it exists, otherwise to that language's home. */
function langLink(ctx, { className = 'lang-link', long = false } = {}) {
  const links = (ctx.otherLangs || []).map((other) => {
    const target = (ctx.twins && ctx.twins[other]) || (ctx.data.routeById.home && ctx.data.routeById.home[other]);
    if (!target) return '';
    const oui = ctx.data.ui ? ctx.data.ui[other] : null;
    const label = oui ? oui.meta.versionLabel : other.toUpperCase();
    const text = long ? label : (oui ? oui.meta.langShort : other.toUpperCase());
    // Label in name (WCAG 2.5.3): the accessible name starts with the visible "EN"/"ES"/"DE".
    return `<a class="${className}" href="${esc(target)}" hreflang="${other}" lang="${other}"${long ? '' : ` aria-label="${esc(`${text}, ${label}`)}"`}>${esc(text)}</a>`;
  }).filter(Boolean);
  return links.join(long ? '<span class="lang-sep" aria-hidden="true"> · </span>' : '');
}

export function header(ctx) {
  const here = ctx.route ? ctx.route.id : null;
  const anc = here ? ancestors(ctx, here) : [];
  const items = NAV.filter(([id]) => ctx.has(id)).map(([id, key]) => {
    const cur = id === here ? ' aria-current="page"' : anc.includes(id) ? ' class="is-section"' : '';
    return `<li><a href="${esc(ctx.href(id))}"${cur}>${esc(ctx.t(key))}</a></li>`;
  }).join('');
  const home = ctx.href('home');
  const brand = ctx.site.brand;
  const logo = LOCKUP ? logoSvg() : `<span class="brand__word">${esc(brand.name)}</span>`;
  const cta = `<a class="btn btn--primary btn--header" href="${esc(contactHref(ctx))}">${esc(ctx.t('cta.demo'))}${BTN_ARROW}</a>`;
  // The floating pill of the home (logo, links, «Pide una demo», burger). Below 1024px the nav becomes the full-screen
  // menu of the home; main.js (data-menu / data-nav) opens it, traps focus and closes it with Escape.
  return `<header class="site-header" data-header><div class="site-header__bar">`
    + `<a class="brand" href="${esc(home)}" aria-label="${esc(ctx.t('meta.homeLabel'))}">${logo}</a>`
    + `<nav class="site-nav" id="site-nav" aria-label="${esc(ctx.t('nav.label'))}" data-nav><ul class="site-nav__list" role="list">${items}</ul>`
    + `<p class="site-nav__extra">${langLink(ctx, { className: 'lang-link lang-link--sheet', long: true })}<a class="btn btn--primary" href="${esc(contactHref(ctx))}">${esc(ctx.t('cta.demo'))}${BTN_ARROW}</a></p></nav>`
    + `<div class="site-header__actions">${langLink(ctx)}${cta}`
    + `<button type="button" class="menu-btn" aria-expanded="false" aria-controls="site-nav" aria-label="${esc(ctx.t('nav.menu'))}" data-menu data-label-open="${esc(ctx.t('nav.menu'))}" data-label-close="${esc(ctx.t('nav.close'))}"><span></span><span></span></button>`
    + `</div></div></header>`;
}

/* ─── Breadcrumbs (GEO-06) ────────────────────────────────────── */

export function breadcrumbs(ctx, crumbs, { hidden = false } = {}) {
  if (!crumbs || crumbs.length < 2) return '';
  const items = crumbs.map((c, i) => (i === crumbs.length - 1
    ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
    : `<li><a href="${esc(c.path)}">${esc(c.name)}</a></li>`)).join('');
  return `<nav class="crumbs${hidden ? ' sr-only' : ''}" aria-label="${esc(ctx.t('crumbs.label'))}"><div class="wrap"><ol class="crumbs__list" role="list">${items}</ol></div></nav>`;
}

/** Breadcrumb trail [{ name, path }] from routes.mjs parents. */
export function crumbTrail(ctx) {
  const out = [];
  let r = ctx.route;
  const seen = new Set();
  while (r && !seen.has(r.id)) {
    seen.add(r.id);
    // Ancestors that are not rendered (partial builds) are skipped so the trail never links to a 404.
    if (r[ctx.lang] && (r === ctx.route || r.id === 'home' || ctx.has(r.id))) out.unshift({ id: r.id, name: r.id === 'home' ? ctx.t('crumbs.home') : ctx.label(r.id), path: r[ctx.lang] });
    r = r.parent ? ctx.data.routeById[r.parent] : null;
  }
  if (out.length && out[0].id !== 'home' && ctx.data.routeById.home[ctx.lang]) out.unshift({ id: 'home', name: ctx.t('crumbs.home'), path: ctx.data.routeById.home[ctx.lang] });
  return out.map(({ name, path }) => ({ name, path }));
}

/* ─── Footer (COMP-20): three link groups; hub headings are links (inbound links to the hubs) ─── */

function col(ctx, title, ids, hub) {
  const links = ids.filter((id) => ctx.has(id)).map((id) => `<li><a href="${esc(ctx.href(id))}">${esc(id === 'faq' ? ctx.t('footer.faqLabel') : ctx.label(id))}</a></li>`).join('');
  const head = hub && ctx.has(hub) ? `<a href="${esc(ctx.href(hub))}">${esc(title)}</a>` : esc(title);
  return links ? `<div class="footer-col"><h2 class="footer-col__title">${head}</h2><ul role="list">${links}</ul></div>` : '';
}

/** The three link columns of the footer (services, solutions, studio). */
function footerCols(ctx) {
  const L = ctx.lang;
  const byTemplate = (t) => ctx.data.routes.filter((r) => r.template === t && r[L]).map((r) => r.id);
  const studio = ['caso-villa', ...(ctx.has('zonas') ? ['zonas'] : byTemplate('zone')), 'guias', 'glosario', 'faq', 'sobre-nosotros', 'contacto'];
  return [
    col(ctx, ctx.t('footer.services'), byTemplate('service'), 'servicios'),
    col(ctx, ctx.t('footer.solutions'), byTemplate('audience'), 'soluciones'),
    col(ctx, ctx.t('footer.studio'), studio),
  ].join('');
}

export function footer(ctx) {
  const c = ctx.site.contact;
  const L = ctx.lang;
  const cols = footerCols(ctx);
  const legal = ['aviso-legal', 'privacidad', 'cookies'].filter((id) => ctx.has(id)).map((id) => `<li><a href="${esc(ctx.href(id))}">${esc(ctx.label(id))}</a></li>`).join('');
  const wa = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(ctx.t('cta.whatsappText'))}`;
  const year = new Date().getFullYear();
  // Same footer as the home (build/home/portada.html, .foot): on the sky, logo and the entity line, contact, the link
  // columns (inbound links to every hub and service) and the legal line with the company name.
  return `<footer class="site-footer" data-footer><div class="site-footer__in">`
    + `<div class="site-footer__top">`
    + `<div class="site-footer__about"><a class="site-footer__home" href="${esc(ctx.href('home'))}" aria-label="${esc(ctx.t('meta.homeLabel'))}">${LOCKUP ? footerLogo() : `<span class="brand__word brand__word--footer">${esc(ctx.site.brand.name)}</span>`}</a>`
    + `<p class="site-footer__entity">${esc(ctx.tok(ctx.site.entity[L]))}</p>`
    + `<p class="site-footer__base">${esc(ctx.t('footer.base'))}</p>`
    + `<ul class="site-footer__contact" role="list" aria-label="${esc(ctx.t('footer.contact'))}">`
    + `<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`
    // Phone and WhatsApp only with real contact data (V-02): no tel:/wa.me link to a placeholder number.
    + (ctx.phoneLink ? `<li><a href="tel:${esc(c.phoneE164)}">${esc(c.phoneDisplay)}</a></li>` : '')
    + (ctx.directContact ? `<li><a href="${esc(wa)}" rel="noopener">${esc(ctx.t('footer.whatsapp'))}</a></li>` : '')
    + `</ul></div>`
    + `<div class="site-footer__cols">${cols}</div>`
    + `</div>`
    + `<div class="site-footer__bottom"><ul class="site-footer__legal" role="list" aria-label="${esc(ctx.t('footer.legal'))}">${legal}</ul>`
    + `<p class="site-footer__lang">${langLink(ctx, { className: 'lang-link lang-link--footer', long: true })}</p>`
    + `<p class="site-footer__rights">${esc(ctx.t('footer.rights', { year }))}</p></div>`
    + `</div></footer>`;
}

/* ─── Document ────────────────────────────────────────────────── */

/**
 * The OG image of a page with the brand lockup on a paper plate (scripts/brand.mjs writes
 * public/assets/img/og-brand/<image>.jpg from the originals in public/assets/img/og/). Falls back to the plain crop
 * while the branded copy does not exist (partial checkout), so the meta never points to a missing file.
 */
const brandedExists = new Map();
function brandedOg(ctx, og) {
  if (!og || !og.url) return null;
  if (!og.name) return og.url;
  const p = `/assets/img/og-brand/${og.name}.jpg`;
  if (!brandedExists.has(p)) brandedExists.set(p, fs.existsSync(path.join(ROOT, 'public', p)));
  return brandedExists.get(p) ? ctx.abs(ctx.asset(p)) : og.url;
}

/**
 * @param ctx
 * @param o { main, layout: 'default'|'bare'|'standalone', head, bodyClass, entry, graph, assets: { css, js: { main, viewer }, font, meshopt,
 *            favicons: { ico, svg, apple }, manifest: bool, markdown: bool }, themeColors: { light }, placeholders, dateline }
 *          'standalone': `main` is the whole <body> (own header, footer, CSS and JS, see build/templates/home.mjs) and `head`
 *          replaces the site stylesheet, scripts and theme meta; the SEO head (meta, canonical, hreflang, OG, JSON-LD) stays.
 */
export function renderDocument(ctx, o) {
  const { entry, assets: A } = o;
  const L = ctx.lang;
  const standalone = o.layout === 'standalone';
  const robots = robotsFor(entry.index, o.placeholders);
  const alt = entry.alternates || {};
  const hreflang = Object.keys(alt).length > 1
    ? Object.entries(alt).map(([hl, p]) => `<link rel="alternate" hreflang="${hl}" href="${esc(ctx.abs(p))}">`).join('')
    : '';
  const og = entry.image;
  const ogUrl = brandedOg(ctx, og);
  const ogType = ['guide', 'case'].includes(entry.template) ? 'article' : 'website';
  const articleMeta = ogType === 'article'
    ? (entry.datePublished ? `<meta property="article:published_time" content="${esc(entry.datePublished)}">` : '')
      + (entry.dateModified ? `<meta property="article:modified_time" content="${esc(entry.dateModified)}">` : '')
    : '';
  const feed = A.markdown && o.layout !== 'bare' && !standalone
    ? `<link rel="alternate" type="application/rss+xml" title="${esc(ctx.t('meta.feed'))}" href="${L === ctx.site.defaultLang ? '/feed.xml' : `/${L}/feed.xml`}">`
    : '';
  // Shared stylesheet + ONE bundle of the feature modules this page uses (build/lib/assets.mjs buildCss / cssBundle):
  // never more than two render-blocking CSS requests (V-21).
  // The <body> classes count too (a module may be keyed on the template, e.g. the inner-page decoration `page-service`).
  const mods = modulesFor(`${o.main}<i class="${o.bodyClass || ''}"></i>`, A.cssModules);
  const bundle = mods.length ? (A.cssBundle ? A.cssBundle(mods) : null) : null;
  const styles = [A.css, ...(bundle ? [bundle.url] : mods.map((m) => m.url))].map((u) => `<link rel="stylesheet" href="${esc(u)}">`).join('');
  const locales = ctx.site.locale;
  const ogAlt = Object.keys(alt).filter((k) => k !== L && k !== 'x-default' && locales[k]).map((k) => `<meta property="og:locale:alternate" content="${locales[k]}">`).join('');
  const ld = o.graph && o.graph.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': o.graph }).replace(/</g, '\\u003c')}</script>`
    : '';
  const needsViewer = !standalone && ctx.needs.has('viewer') && A.js.viewer;
  const viewerScripts = needsViewer
    ? `<script>${meshoptScript(A.meshopt)}</script><script type="module" src="${esc(A.js.viewer)}"></script>`
    : '';
  const icons = [
    A.favicons.ico ? '<link rel="icon" href="/favicon.ico" sizes="32x32">' : '', // 16/32/48 inside; 32x32 keeps Chrome on the SVG below
    A.favicons.svg ? '<link rel="icon" href="/favicon.svg" type="image/svg+xml">' : '',
    A.favicons.apple ? '<link rel="apple-touch-icon" href="/apple-touch-icon.png">' : '',
    A.manifest ? '<link rel="manifest" href="/site.webmanifest">' : '',
  ].join('');
  const mdAlt = A.markdown && entry.index ? `<link rel="alternate" type="text/markdown" href="${esc(entry.path)}index.md">` : '';
  // Optional cookieless analytics (BUILD-SPEC §0): Plausible only, deferred, never on bare/embed pages.
  const an = ctx.site.analytics;
  const analytics = an && an.provider === 'plausible' && o.layout !== 'bare' && !standalone
    ? `<script defer data-domain="${esc(an.domain)}" src="${esc(`${an.host || 'https://plausible.io'}/js/script.js`)}"></script>`
    : '';

  const headHtml = `<meta charset="utf-8">`
    + `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
    + `<title>${esc(entry.title)}</title>`
    + `<meta name="description" content="${esc(entry.description)}">`
    + `<meta name="robots" content="${robots}">`
    + `<link rel="canonical" href="${esc(entry.url)}">`
    + hreflang
    + `<meta property="og:type" content="${ogType}">`
    + `<meta property="og:site_name" content="${esc(ctx.site.brand.name)}">`
    + `<meta property="og:locale" content="${locales[L]}">${ogAlt}`
    + `<meta property="og:url" content="${esc(entry.url)}">`
    + `<meta property="og:title" content="${esc(entry.title)}">`
    + `<meta property="og:description" content="${esc(entry.description)}">`
    + articleMeta
    + (og && ogUrl ? `<meta property="og:image" content="${esc(ogUrl)}"><meta property="og:image:width" content="${og.width}"><meta property="og:image:height" content="${og.height}"><meta property="og:image:alt" content="${esc(og.alt)}">` : '')
    // X/Twitter reads og:title, og:description and og:image when its own tags are absent: only the card type is needed.
    + `<meta name="twitter:card" content="summary_large_image">`
    + (standalone ? (o.head || '') + `<meta name="color-scheme" content="light">` + `<meta name="format-detection" content="telephone=no">` + icons + mdAlt + ld
      : `<meta name="theme-color" content="${o.themeColors.light}">`
      + `<meta name="color-scheme" content="light">`
      + `<meta name="format-detection" content="telephone=no">`
      + (A.font ? `<link rel="preload" href="${esc(A.font)}" as="font" type="font/woff2" crossorigin>` : '')
      + styles
      + icons + mdAlt + feed
      + `<script>${JS_FLAG_SCRIPT}</script>`
      + ld
      + (A.js.main ? `<script src="${esc(A.js.main)}" defer></script>` : '')
      + viewerScripts
      + analytics);

  const bodyClass = [o.bodyClass, `t-${entry.template}`].filter(Boolean).join(' ');
  let body;
  if (standalone) {
    return `<!doctype html><html lang="${L}" dir="ltr" data-layout="standalone"><head>${headHtml}</head><body class="${esc(bodyClass)}">${o.main}</body></html>\n`;
  }
  if (o.layout === 'bare') {
    body = `<main id="main" class="main main--bare">${o.main}</main>`;
  } else {
    const utility = entry.template === 'ar';
    const crumbs = entry.template === 'home' ? '' : breadcrumbs(ctx, entry.breadcrumbs, { hidden: utility });
    body = `<a class="skip" href="#main">${esc(ctx.t('meta.skip'))}</a>`
      + `<div class="header-sentinel" data-header-sentinel aria-hidden="true"></div>`
      + header(ctx)
      + crumbs
      + `<main id="main" class="main" tabindex="-1">${o.main}${o.dateline || ''}</main>`
      + footer(ctx);
  }
  body = sprite(body) + body;
  return `<!doctype html><html lang="${L}" dir="ltr"><head>${headHtml}</head><body class="${esc(bodyClass)}">${body}</body></html>\n`;
}
