/* ═══════════════════════════════════════════════════════════════
   Layout (docs/build/BUILD-SPEC.md §4): <head>, header, breadcrumbs,
   footer and the mobile bottom bar. Owner: ENGINE; brand and theme parts
   (inline logo, favicons, branded OG, theme scripts and toggle): BRAND
   (scripts/brand.mjs writes the assets this file reads).
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './md.mjs';
import { sprite } from './context.mjs';
import { contactHref, formAnchor } from './components.mjs';
import { modulesFor, minifyJs } from './assets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Inline scripts emitted by the layout (machine.mjs hashes every inline script of the built HTML into the CSP). */
export const JS_FLAG_SCRIPT = "document.documentElement.classList.add('js')";
export const meshoptScript = (url) => `self.ModelViewerElement = { meshoptDecoderLocation: '${url}' }`;

/**
 * Theme, part 1: the inline head script, before the CSS, so the stored choice is on <html> before the first paint
 * (no flash). Light is the default: <html> ships with data-theme="light". 'hv-theme' holds 'dark' or 'auto'
 * ('auto' removes data-theme so the system preference decides, see 00-tokens.css); no key or 'light' = light. Storage is a per-visitor convenience: the access is inside try/catch and the page works without it.
 */
export const THEME_HEAD_SCRIPT = "try{var t=localStorage.getItem('hv-theme'),r=document.documentElement;if(t==='dark')r.dataset.theme='dark';else if(t==='auto')delete r.dataset.theme}catch(e){}";

/**
 * Theme, part 2: the toggle (deferred file, cached like every hashed asset, so the HTML carries only the tag).
 * Cycles light → dark → automatic, persists ('auto' is stored explicitly; no key means light), keeps <meta name="theme-color"> and
 * <meta name="color-scheme"> in step, updates the button's aria-label and tooltip (three strings joined with "|" in
 * data-l, from ui.mjs) and announces the new state in a polite live region it creates next to the button. Other tabs
 * follow through "storage".
 */
export function themeToggleJs({ light = '#F4F5F6', dark = '#0F1215' } = {}) {
  const src = `
(function () {
  var d = document, r = d.documentElement, K = 'hv-theme', C = { light: '${light}', dark: '${dark}' }, S = ['', 'light', 'dark'],
    b = d.querySelector('[data-theme-toggle]'), o;
  if (!b) return;
  o = d.createElement('span');
  o.className = 'sr-only';
  o.setAttribute('role', 'status');
  b.after(o);
  function ok(v) { return S.indexOf(v) > 0 ? v : ''; }
  function put(t, say) {
    var m = d.querySelectorAll('meta[name=theme-color]'), c = d.querySelector('meta[name=color-scheme]'), l = b.dataset.l.split('|')[S.indexOf(t)], i;
    if (t) r.dataset.theme = t; else delete r.dataset.theme;
    for (i = 0; i < m.length; i++) m[i].content = C[t || (/dark/.test(m[i].getAttribute('media')) ? 'dark' : 'light')];
    if (c) c.content = t || 'light dark';
    b.setAttribute('aria-label', l);
    b.title = l;
    if (say) o.textContent = l;
  }
  put(ok(r.dataset.theme));
  b.addEventListener('click', function () {
    var n = S[(S.indexOf(ok(r.dataset.theme)) + 1) % 3];
    try { localStorage.setItem(K, n || 'auto'); } catch (e) {}
    put(n, 1);
  });
  addEventListener('storage', function (e) { if (e.key === K) put(e.newValue === 'auto' ? '' : e.newValue === 'dark' ? 'dark' : 'light'); });
})();`;
  return minifyJs(src).split('\n').join('');
}

/** Emits /assets/js/theme.<hash>.js once per build (same bytes, same URL) and returns its URL. */
const themeJsUrl = new Map();
function themeAsset(ctx, colors) {
  const code = themeToggleJs(colors);
  if (!themeJsUrl.has(code)) themeJsUrl.set(code, ctx.emitAsset('/assets/js/theme.js', code));
  return themeJsUrl.get(code);
}

/* ─── Brand: the inline lockup (build/generated/brand.json, written by scripts/brand.mjs) ─── */

let LOCKUP = null;
try { LOCKUP = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'generated', 'brand.json'), 'utf8')).horizontal; } catch { /* partial checkout: text wordmark */ }

/**
 * Header logo: the outlined lockup as inline SVG so it follows the theme (ink and accent come from the tokens, see
 * .hv-logo in 20-layout.css). The group has an id so the footer can <use> it: the paths ship once per page.
 */
function logoSvg() {
  return `<svg class="hv-logo" viewBox="${LOCKUP.viewBox}" aria-hidden="true" focusable="false"><g id="hv-logo"><path d="${LOCKUP.ink}"/><path class="hv-a" d="${LOCKUP.accent}"/></g></svg>`;
}
const footerLogo = () => `<svg class="hv-logo site-footer__logo" viewBox="${LOCKUP.viewBox}" aria-hidden="true" focusable="false"><use href="#hv-logo"/></svg>`;

/* Theme toggle icons (256 grid, stroke style of the site's icon set): half disc = auto, sun = light, moon = dark. Only the
   group of the current state is shown (CSS on html[data-theme], 20-layout.css). */
const THEME_ICON = '<svg class="icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false">'
  + '<g class="ic-a"><circle cx="128" cy="128" r="92"/><path d="M128 36a92 92 0 0 1 0 184z" fill="currentColor"/></g>'
  + '<g class="ic-l"><circle cx="128" cy="128" r="44"/><path d="M128 52V28M128 204v24M52 128H28M204 128h24M74 74L57 57M182 74l17-17M74 182l-17 17M182 182l17 17"/></g>'
  + '<g class="ic-d"><path d="M224 136A96 96 0 1 1 120 32a75 75 0 0 0 104 104z"/></g></svg>';

/** The toggle button (visible only with JS, see html:not(.js) in 20-layout.css). Its polite live region is added by theme.js. */
function themeButton(ctx) {
  const labels = ['auto', 'light', 'dark'].map((k) => ctx.t(`theme.${k}`));
  return `<button type="button" class="theme-btn" data-theme-toggle aria-label="${esc(labels[1])}" data-l="${esc(labels.join('|'))}">${THEME_ICON}</button>`;
}

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

function langLink(ctx, { className = 'lang-link', long = false } = {}) {
  const other = ctx.otherLang;
  if (!other) return '';
  const target = ctx.twinPath || (ctx.data.routeById.home && ctx.data.routeById.home[other]);
  if (!target) return '';
  const oui = ctx.data.ui ? ctx.data.ui[other] : null;
  const label = oui ? oui.meta.versionLabel : other.toUpperCase();
  const text = long ? label : (oui ? oui.meta.langShort : other.toUpperCase());
  // Label in name (WCAG 2.5.3): the accessible name starts with the visible "EN"/"ES".
  return `<a class="${className}" href="${esc(target)}" hreflang="${other}" lang="${other}"${long ? '' : ` aria-label="${esc(`${text}, ${label}`)}"`}>${esc(text)}</a>`;
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
  const cta = `<a class="btn btn--primary btn--header" href="${esc(contactHref(ctx))}">${esc(ctx.t('cta.demo'))}</a>`;
  return `<header class="site-header" data-header><div class="wrap site-header__bar">`
    + `<a class="brand" href="${esc(home)}" aria-label="${esc(ctx.t('meta.homeLabel'))}">${logo}</a>`
    + `<nav class="site-nav" id="site-nav" aria-label="${esc(ctx.t('nav.label'))}" data-nav><ul class="site-nav__list" role="list">${items}</ul>`
    + `<p class="site-nav__extra">${langLink(ctx, { className: 'lang-link lang-link--sheet', long: true })}<a class="btn btn--primary" href="${esc(contactHref(ctx))}">${esc(ctx.t('cta.demo'))}</a></p></nav>`
    + `<div class="site-header__actions">${langLink(ctx)}${themeButton(ctx)}${cta}`
    + `<button type="button" class="menu-btn" aria-expanded="false" aria-controls="site-nav" data-menu data-label-open="${esc(ctx.t('nav.menu'))}" data-label-close="${esc(ctx.t('nav.close'))}">${ctx.icon('menu', 'menu-btn__open')}${ctx.icon('close', 'menu-btn__close')}<span data-menu-label>${esc(ctx.t('nav.menu'))}</span></button>`
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

export function footer(ctx) {
  const c = ctx.site.contact;
  const L = ctx.lang;
  const routes = ctx.data.routes;
  const byTemplate = (t) => routes.filter((r) => r.template === t && r[L]).map((r) => r.id);
  const studio = ['caso-villa', ...(ctx.has('zonas') ? ['zonas'] : byTemplate('zone')), 'guias', 'glosario', 'faq', 'sobre-nosotros', 'contacto'];
  const cols = [
    col(ctx, ctx.t('footer.services'), byTemplate('service'), 'servicios'),
    col(ctx, ctx.t('footer.solutions'), byTemplate('audience'), 'soluciones'),
    col(ctx, ctx.t('footer.studio'), studio),
  ].join('');
  const legal = ['aviso-legal', 'privacidad', 'cookies'].filter((id) => ctx.has(id)).map((id) => `<li><a href="${esc(ctx.href(id))}">${esc(ctx.label(id))}</a></li>`).join('');
  const wa = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(ctx.t('cta.whatsappText'))}`;
  const year = new Date().getFullYear();
  return `<footer class="site-footer" data-footer><div class="wrap">`
    + `<div class="site-footer__top">`
    + `<div class="site-footer__about">${LOCKUP ? footerLogo() : `<p class="brand__word brand__word--footer">${esc(ctx.site.brand.name)}</p>`}`
    + `<p class="site-footer__entity">${esc(ctx.tok(ctx.site.entity[L]))}</p>`
    + `<p class="site-footer__base">${esc(ctx.t('footer.base'))}</p>`
    + `<dl class="site-footer__contact">`
    + `<div><dt>${esc(ctx.t('footer.email'))}</dt><dd><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></dd></div>`
    // Phone and WhatsApp only with real contact data (V-02): no tel:/wa.me link to a placeholder number.
    + (ctx.phoneLink ? `<div><dt>${esc(ctx.t('footer.phone'))}</dt><dd><a href="tel:${esc(c.phoneE164)}">${esc(c.phoneDisplay)}</a></dd></div>` : '')
    + (ctx.directContact ? `<div><dt>${esc(ctx.t('footer.whatsapp'))}</dt><dd><a href="${esc(wa)}" rel="noopener">${esc(ctx.tok('{{whatsapp}}'))}</a></dd></div>` : '')
    + `</dl></div>`
    + `<div class="site-footer__cols">${cols}</div>`
    + `</div>`
    + `<div class="site-footer__bottom"><ul class="site-footer__legal" role="list" aria-label="${esc(ctx.t('footer.legal'))}">${legal}</ul>`
    + `<p class="site-footer__lang">${langLink(ctx, { className: 'lang-link lang-link--footer', long: true })}</p>`
    + `<p class="site-footer__rights">${esc(ctx.t('footer.rights', { year }))}</p></div>`
    + `</div></footer>`;
}

/* ─── Mobile bottom bar (COMP-06) ─────────────────────────────── */

export function bottomBar(ctx) {
  const onContact = ctx.route && ctx.route.id === 'contacto';
  const demoHref = onContact ? `#${formAnchor(ctx)}` : contactHref(ctx);
  // One line at every width: the visible label is "WhatsApp", the accessible name is the full COMP-03 label (it contains it).
  // While the contact data are placeholders there is no WhatsApp action: the demo button takes the full width (V-02).
  const wa = ctx.directContact
    ? `<a class="btn btn--neutral" href="${esc(ctx.whatsappUrl())}" rel="noopener" aria-label="${esc(ctx.t('cta.whatsapp'))}">${ctx.icon('chat')}<span>${esc(ctx.t('cta.whatsappShort'))}</span></a>`
    : '';
  return `<div class="bottom-bar${wa ? '' : ' bottom-bar--solo'}" data-bottom-bar role="region" aria-label="${esc(ctx.t('cta.barLabel'))}"><a class="btn btn--primary" href="${esc(demoHref)}">${esc(ctx.t('cta.demo'))}</a>${wa}</div>`;
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
 * @param o { main, layout: 'default'|'bare', bodyClass, entry, graph, assets: { css, js: { main, viewer }, font, meshopt,
 *            favicons: { ico, svg, apple }, manifest: bool, markdown: bool }, themeColors: { light, dark }, placeholders, dateline }
 */
export function renderDocument(ctx, o) {
  const { entry, assets: A } = o;
  const L = ctx.lang;
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
  const feed = A.markdown && o.layout !== 'bare'
    ? `<link rel="alternate" type="application/rss+xml" title="${esc(ctx.t('meta.feed'))}" href="${L === ctx.site.defaultLang ? '/feed.xml' : `/${L}/feed.xml`}">`
    : '';
  // Shared stylesheet + ONE bundle of the feature modules this page uses (build/lib/assets.mjs buildCss / cssBundle):
  // never more than two render-blocking CSS requests (V-21).
  const mods = modulesFor(o.main, A.cssModules);
  const bundle = mods.length ? (A.cssBundle ? A.cssBundle(mods) : null) : null;
  const styles = [A.css, ...(bundle ? [bundle.url] : mods.map((m) => m.url))].map((u) => `<link rel="stylesheet" href="${esc(u)}">`).join('');
  const locales = ctx.site.locale;
  const ogAlt = Object.keys(alt).filter((k) => k !== L && k !== 'x-default' && locales[k]).map((k) => `<meta property="og:locale:alternate" content="${locales[k]}">`).join('');
  const ld = o.graph && o.graph.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': o.graph }).replace(/</g, '\\u003c')}</script>`
    : '';
  const needsViewer = ctx.needs.has('viewer') && A.js.viewer;
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
  const analytics = an && an.provider === 'plausible' && o.layout !== 'bare'
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
    + `<meta name="theme-color" media="(prefers-color-scheme: light)" content="${o.themeColors.light}">`
    + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${o.themeColors.light}">`
    + `<meta name="color-scheme" content="light">`
    + `<script>${THEME_HEAD_SCRIPT}</script>`
    + `<meta name="format-detection" content="telephone=no">`
    + (A.font ? `<link rel="preload" href="${esc(A.font)}" as="font" type="font/woff2" crossorigin>` : '')
    + styles
    + icons + mdAlt + feed
    + `<script>${JS_FLAG_SCRIPT}</script>`
    + ld
    + (o.layout !== 'bare' ? `<script src="${esc(themeAsset(ctx, o.themeColors))}" defer></script>` : '')
    + (A.js.main ? `<script src="${esc(A.js.main)}" defer></script>` : '')
    + viewerScripts
    + analytics;

  const bodyClass = [o.bodyClass, `t-${entry.template}`].filter(Boolean).join(' ');
  let body;
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
      + footer(ctx)
      + (utility ? '' : bottomBar(ctx));
  }
  body = sprite(body) + body;
  return `<!doctype html><html lang="${L}" dir="ltr" data-theme="light"><head>${headHtml}</head><body class="${esc(bodyClass)}">${body}</body></html>\n`;
}
