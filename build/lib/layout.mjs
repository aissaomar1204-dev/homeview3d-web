/* ═══════════════════════════════════════════════════════════════
   Layout (docs/build/BUILD-SPEC.md §4): <head>, header, breadcrumbs,
   footer and the mobile bottom bar. Owner: ENGINE.
   ═══════════════════════════════════════════════════════════════ */
import { esc } from './md.mjs';
import { sprite } from './context.mjs';
import { contactHref, formAnchor } from './components.mjs';
import { modulesFor } from './assets.mjs';

/** Inline scripts emitted by the layout (their sha256 goes into the CSP, see build.mjs). */
export const JS_FLAG_SCRIPT = "document.documentElement.classList.add('js')";
export const meshoptScript = (url) => `self.ModelViewerElement = { meshoptDecoderLocation: '${url}' }`;

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
  const logo = brand.logo
    ? `<img src="${esc(ctx.asset(brand.logo))}" alt="${esc(brand.name)}" width="180" height="32">`
    : `<span class="brand__word">${esc(brand.name)}</span>`;
  const cta = `<a class="btn btn--primary btn--header" href="${esc(contactHref(ctx))}">${esc(ctx.t('cta.demo'))}</a>`;
  return `<header class="site-header" data-header><div class="wrap site-header__bar">`
    + `<a class="brand" href="${esc(home)}" aria-label="${esc(ctx.t('meta.homeLabel'))}">${logo}</a>`
    + `<nav class="site-nav" id="site-nav" aria-label="${esc(ctx.t('nav.label'))}" data-nav><ul class="site-nav__list" role="list">${items}</ul>`
    + `<p class="site-nav__extra">${langLink(ctx, { className: 'lang-link lang-link--sheet', long: true })}<a class="btn btn--primary" href="${esc(contactHref(ctx))}">${esc(ctx.t('cta.demo'))}</a></p></nav>`
    + `<div class="site-header__actions">${langLink(ctx)}${cta}`
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
    + `<div class="site-footer__about"><p class="brand__word brand__word--footer">${esc(ctx.site.brand.name)}</p>`
    + `<p class="site-footer__entity">${esc(ctx.tok(ctx.site.entity[L]))}</p>`
    + `<p class="site-footer__base">${esc(ctx.t('footer.base'))}</p>`
    + `<dl class="site-footer__contact">`
    + `<div><dt>${esc(ctx.t('footer.email'))}</dt><dd><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></dd></div>`
    + `<div><dt>${esc(ctx.t('footer.phone'))}</dt><dd><a href="tel:${esc(c.phoneE164)}">${esc(c.phoneDisplay)}</a></dd></div>`
    + `<div><dt>${esc(ctx.t('footer.whatsapp'))}</dt><dd><a href="${esc(wa)}" rel="noopener">${esc(ctx.tok('{{whatsapp}}'))}</a></dd></div>`
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
  return `<div class="bottom-bar" data-bottom-bar role="region" aria-label="${esc(ctx.t('cta.barLabel'))}"><a class="btn btn--primary" href="${esc(demoHref)}">${esc(ctx.t('cta.demo'))}</a><a class="btn btn--neutral" href="${esc(ctx.whatsappUrl())}" rel="noopener" aria-label="${esc(ctx.t('cta.whatsapp'))}">${ctx.icon('chat')}<span>${esc(ctx.t('cta.whatsappShort'))}</span></a></div>`;
}

/* ─── Document ────────────────────────────────────────────────── */

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
  const ogType = ['guide', 'case'].includes(entry.template) ? 'article' : 'website';
  const articleMeta = ogType === 'article'
    ? (entry.datePublished ? `<meta property="article:published_time" content="${esc(entry.datePublished)}">` : '')
      + (entry.dateModified ? `<meta property="article:modified_time" content="${esc(entry.dateModified)}">` : '')
    : '';
  const feed = A.markdown && o.layout !== 'bare'
    ? `<link rel="alternate" type="application/rss+xml" title="${esc(ctx.t('meta.feed'))}" href="${L === ctx.site.defaultLang ? '/feed.xml' : `/${L}/feed.xml`}">`
    : '';
  // Shared stylesheet + the feature modules this page uses (build/lib/assets.mjs buildCss).
  const styles = [A.css, ...modulesFor(o.main, A.cssModules).map((m) => m.url)].map((u) => `<link rel="stylesheet" href="${esc(u)}">`).join('');
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
    A.favicons.ico ? '<link rel="icon" href="/favicon.ico" sizes="32x32">' : '',
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
    + (og && og.url ? `<meta property="og:image" content="${esc(og.url)}"><meta property="og:image:width" content="${og.width}"><meta property="og:image:height" content="${og.height}"><meta property="og:image:alt" content="${esc(og.alt)}">` : '')
    // X/Twitter reads og:title, og:description and og:image when its own tags are absent: only the card type is needed.
    + `<meta name="twitter:card" content="summary_large_image">`
    + `<meta name="theme-color" media="(prefers-color-scheme: light)" content="${o.themeColors.light}">`
    + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${o.themeColors.dark}">`
    + `<meta name="color-scheme" content="light dark">`
    + `<meta name="format-detection" content="telephone=no">`
    + (A.font ? `<link rel="preload" href="${esc(A.font)}" as="font" type="font/woff2" crossorigin>` : '')
    + styles
    + icons + mdAlt + feed
    + `<script>${JS_FLAG_SCRIPT}</script>`
    + ld
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
  return `<!doctype html><html lang="${L}" dir="ltr"><head>${headHtml}</head><body class="${esc(bodyClass)}">${body}</body></html>\n`;
}
