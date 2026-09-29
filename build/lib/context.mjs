/* ═══════════════════════════════════════════════════════════════
   Render context factory (docs/build/BUILD-SPEC.md §3). Owner: ENGINE.
   ctx = { lang, route, doc, page, site, ui, entryPath, t, href, abs, asset,
           img, md, mdInline, tok, price, extra, delivery, fmtNumber,
           fmtBytes, needs, … extras documented below }
   Extras (stable, other agents may use them):
     ctx.has(id)            page id rendered in ctx.lang
     ctx.label(id)          breadcrumb label of a page in ctx.lang (plain)
     ctx.card(id)           { title, summary, href } of a page in ctx.lang
     ctx.data               { pricing, villa, process, deliverables, comingSoon, glossary, routes, routeById }
     ctx.docs               Map id → content doc
     ctx.icon(name, cls?)   inline <svg><use> from the sprite (arrow, arrowDown, plus, minus, check, close, menu, copy, upload,
                            chat, external, arrowsH, play, pause, cube)
     ctx.esc(str)           HTML escape
     ctx.fmtDate(iso)       "28 sep 2026" / "28 Sep 2026"
     ctx.uid(prefix)        unique id within the page
     ctx.slug(text)         heading slug (same function as auto h2 ids)
     ctx.fill(str, vars)    replaces {name} placeholders
     ctx.whatsappUrl(text?) wa.me link with a prefilled message
     ctx.directContact      false while site.contact is a placeholder: no WhatsApp actions (V-02)
     ctx.phoneLink          false while site.contact is a placeholder: no tel: links (V-02)
     ctx.revisions(packId), ctx.volume(), ctx.volumeUnit()
     ctx.collect            { images: [], faq: [], headings: [], videos: [] } filled while rendering
     ctx.emitAsset(p, text) writes a generated file as a hashed asset, returns its URL
     ctx.images             image manifest (or null)
     ctx.otherLang, ctx.twinPath
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { esc, slugify, renderInline, renderMd, toPlain } from './md.mjs';
import { formatPrice, packById } from '../data/pricing.mjs';

/** Dynamic import that tolerates a missing module (other agents' files). */
export async function optionalImport(file, { label = file, warn = console.warn } = {}) {
  if (!fs.existsSync(file)) return { mod: null, missing: true };
  try {
    return { mod: await import(pathToFileURL(file).href + `?v=${fs.statSync(file).mtimeMs}`), missing: false };
  } catch (e) {
    warn(`! ${label} failed to load: ${e.message}`);
    return { mod: null, missing: false, error: e };
  }
}

const NBSP = ' ';
const locale = (lang) => (lang === 'es' ? 'es-ES' : 'en-GB');

export function fmtNumber(n, lang, decimals) {
  const opts = { useGrouping: 'always' };
  if (decimals != null) { opts.minimumFractionDigits = decimals; opts.maximumFractionDigits = decimals; } else { opts.maximumFractionDigits = 2; }
  return new Intl.NumberFormat(locale(lang), opts).format(n);
}

/** Price with a non-breaking space between number and currency (COPY-03). */
export const fmtPrice = (n, lang) => formatPrice(n, lang).replace(/ /g, NBSP);

export function fmtBytes(bytes, lang) {
  const mb = bytes / 1e6;
  // One decimal below 10 MB, always shown (7,0 MB next to 5,3 MB), whole numbers above.
  const dec = mb < 10 ? 1 : 0;
  const s = new Intl.NumberFormat(locale(lang), { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(mb);
  return `${s}${NBSP}MB`;
}

export function fmtDate(iso, lang, ui) {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return String(iso);
  return `${d}${NBSP}${ui.date.months[m - 1]}${NBSP}${y}`;
}

export const fill = (str, vars = {}) => String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

function deep(obj, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

const ICONS = {
  // Geometry after Phosphor Icons Regular (MIT), 256 grid. Stroke styles live in CSS (.icon).
  arrow: 'M40 128h176M144 56l72 72-72 72',
  arrowDown: 'M128 40v176M56 144l72 72 72-72',
  plus: 'M40 128h176M128 40v176',
  minus: 'M40 128h176',
  check: 'M40 144l56 56L224 72',
  close: 'M200 56 56 200M200 200 56 56',
  menu: 'M40 128h176M40 64h176M40 192h176',
  copy: 'M168 168h48V40H88v48M40 88h128v128H40z',
  upload: 'M128 152V40M216 152v56H40v-56M88 80l40-40 40 40',
  chat: 'M79.93 211.11a96 96 0 1 0-35-35L32.42 213.46a8 8 0 0 0 10.12 10.12Z',
  external: 'M64 192 192 64M88 64h104v104',
  arrowsH: 'M48 128h160M80 96l-32 32 32 32M176 96l32 32-32 32',
  play: 'M72 39.88v176.24a8 8 0 0 0 12.15 6.88l144.08-88.12a7.82 7.82 0 0 0 0-13.76L84.15 33a8 8 0 0 0-12.15 6.88Z',
  pause: 'M168 40h32a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8h-32a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8ZM56 40h32a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8Z',
  cube: 'M224 177.32V78.68a8 8 0 0 0-4.07-7l-88-49.5a8 8 0 0 0-7.86 0l-88 49.5a8 8 0 0 0-4.07 7v98.64a8 8 0 0 0 4.07 7l88 49.5a8 8 0 0 0 7.86 0l88-49.5a8 8 0 0 0 4.07-7ZM32.55 74.54 128 128l95.45-53.46M128 128v107.9',
};

/** Inline SVG sprite with only the icons used on the page (placed once at the top of <body>). */
export function sprite(html = null) {
  const used = html ? new Set([...String(html).matchAll(/#i-([A-Za-z]+)/g)].map((m) => m[1])) : new Set(Object.keys(ICONS));
  const symbols = Object.entries(ICONS).filter(([id]) => used.has(id))
    .map(([id, d]) => `<symbol id="i-${id}" viewBox="0 0 256 256"><path d="${d}"/></symbol>`)
    .join('');
  return symbols ? `<svg class="sprite" aria-hidden="true"><defs>${symbols}</defs></svg>` : '';
}

export const icon = (name, cls = '') => {
  if (!ICONS[name]) throw new Error(`Unknown icon "${name}"`);
  return `<svg class="icon${cls ? ` ${cls}` : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
};

/**
 * @param {object} o
 *  lang, route, doc, site, ui (UI object with es/en), data ({ pricing, villa, process, deliverables, comingSoon, glossary }),
 *  routes, routeById, rendered (Set of "id:lang"), docs (Map), assets ({ asset(p), picture(name, opts, ctx) }), images
 */
export function createContext(o) {
  const { lang, route, doc, site, data, routeById, rendered, docs, assets } = o;
  const ui = o.ui[lang];
  const page = doc ? doc[lang] : null;
  const otherLang = site.langs.find((l) => l !== lang);
  const ids = new Map();

  const ctx = {
    lang, route, doc, page, site, ui,
    entryPath: route ? route[lang] : null,
    needs: new Set(),
    collect: { images: [], faq: [], headings: [], videos: [] },
    data: { ...data, routes: o.routes, routeById },
    docs,
    images: o.images || null,
    otherLang,
    esc, fill, icon,
    slug: slugify,
  };

  const tokenEnv = { lang, token: (name, args) => token(name, args), link: (id, anchor) => ctx.href(id, anchor) };

  function token(name, args) {
    const { pricing, villa } = data;
    switch (name) {
      case 'brand': return site.brand.name;
      case 'entity': return toPlain(site.entity[lang], tokenEnv);
      case 'email': return site.contact.email;
      case 'phone': return site.contact.phoneDisplay;
      case 'whatsapp': return whatsappDisplay(site);
      case 'year': return String(new Date().getFullYear());
      case 'price': return ctx.price(args[0], args[1] != null ? Number(args[1]) : undefined);
      case 'extra': return ctx.extra(args[0]);
      case 'volume': return fmtPrice(pricing.volume.price, lang);
      case 'volumeUnit': return fmtPrice(Math.round(pricing.volume.price / pricing.volume.units), lang);
      case 'delivery': return ctx.delivery(args[0]);
      case 'revisions': return ctx.revisions(args[0]);
      case 'villa': {
        if (!(args[0] in villa.specs)) throw new Error(`Unknown villa spec {{villa:${args[0]}}}`);
        const v = villa.specs[args[0]];
        // Heights keep two decimals (1,15 m / 2,60 m) to match the viewer labels.
        if (typeof v === 'number') return fmtNumber(v, lang, /Height$/.test(args[0]) ? 2 : undefined);
        if (v && typeof v === 'object' && 'w' in v && 'd' in v) return `${fmtNumber(v.w, lang)}${NBSP}×${NBSP}${fmtNumber(v.d, lang)}${NBSP}m`;
        if (v && typeof v === 'object' && lang in v) return v[lang];
        return String(v);
      }
      case 'file': {
        const f = villa.files[args[0]];
        if (!f) throw new Error(`Unknown file {{file:${args[0]}}}`);
        return fmtBytes(f.bytes, lang);
      }
      case 'legal': {
        if (!(args[0] in site.legal)) throw new Error(`Unknown legal field {{legal:${args[0]}}}`);
        return String(site.legal[args[0]]);
      }
      default: return null;
    }
  }

  ctx.t = (key, vars) => {
    const v = deep(ui, key);
    if (v === undefined) throw new Error(`ui string missing: ${lang}.${key}`);
    if (typeof v !== 'string') return v;
    const s = toPlain(v.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'), tokenEnv);
    return vars ? fill(s, vars) : s;
  };
  /** ui string rendered as inline md (links allowed), tokens resolved. */
  ctx.tHtml = (key, vars) => {
    const v = deep(ui, key);
    if (typeof v !== 'string') throw new Error(`ui string missing: ${lang}.${key}`);
    return renderInline(vars ? fill(v, vars) : v, tokenEnv);
  };

  ctx.has = (id) => !!(routeById[id] && routeById[id][lang] && rendered.has(`${id}:${lang}`));
  ctx.href = (id, anchor) => {
    const r = routeById[id];
    if (!r) throw new Error(`href: unknown page id "${id}"`);
    const p = r[lang];
    if (!p) throw new Error(`href: page "${id}" has no ${lang} version`);
    return anchor ? `${p}#${anchor}` : p;
  };
  ctx.abs = (p) => (/^https?:\/\//.test(p) ? p : site.domain + p);
  ctx.asset = (p) => assets.asset(p);
  ctx.img = (name, opts = {}) => assets.picture(name, opts, ctx);
  /** Write a generated file as a hashed, cached asset (e.g. the AR QR code) and return its public URL. */
  ctx.emitAsset = (publicPath, content) => (assets.register ? assets.register(publicPath, Buffer.from(content)) : null);

  ctx.md = (str, opts) => renderMd(str, tokenEnv, opts);
  ctx.mdInline = (str) => renderInline(str, tokenEnv);
  ctx.tok = (str) => toPlain(str, tokenEnv);

  ctx.price = (packId, tier) => {
    const p = packById(packId);
    if (!p) throw new Error(`price: unknown pack "${packId}"`);
    if (tier != null) {
      if (!p.tiers || !p.tiers[tier]) throw new Error(`price: pack "${packId}" has no tier ${tier}`);
      return fmtPrice(p.tiers[tier].price, lang);
    }
    return fmtPrice(p.price, lang);
  };
  ctx.extra = (id) => {
    const x = data.pricing.extras.find((e) => e.id === id);
    if (!x) throw new Error(`extra: unknown extra "${id}"`);
    if (x.pct != null) return lang === 'es' ? `${x.pct}${NBSP}%` : `${x.pct}%`;
    return fmtPrice(x.price, lang);
  };
  ctx.delivery = (packId) => {
    const p = packById(packId);
    if (!p) throw new Error(`delivery: unknown pack "${packId}"`);
    const { min, max } = p.deliveryDays;
    if (lang === 'es') return min === max ? `${min} días laborables` : `${min} a ${max} días laborables`;
    return min === max ? `${min} working days` : `${min} to ${max} working days`;
  };
  ctx.revisions = (packId) => {
    const p = packById(packId);
    if (!p) throw new Error(`revisions: unknown pack "${packId}"`);
    const n = p.revisions;
    if (lang === 'es') return `${n} ${n === 1 ? 'ronda' : 'rondas'} de cambios`;
    return `${n} ${n === 1 ? 'round' : 'rounds'} of changes`;
  };
  ctx.volume = () => token('volume', []);
  ctx.volumeUnit = () => token('volumeUnit', []);
  ctx.fmtNumber = (n, decimals) => fmtNumber(n, lang, decimals);
  ctx.fmtBytes = (b) => fmtBytes(b, lang);
  ctx.fmtPrice = (n) => fmtPrice(n, lang);
  ctx.fmtDate = (iso) => fmtDate(iso, lang, ui);

  ctx.label = (id) => {
    const d = docs.get(id);
    const p = d && d[lang];
    if (p) return ctx.tok(p.breadcrumb || p.h1 || p.title);
    if (id === 'home') return ui.crumbs.home;
    const nav = { servicios: 'services', 'como-funciona': 'how', precios: 'pricing', 'caso-villa': 'villa', guias: 'guides' }[id];
    if (nav) return ui.nav[nav];
    return id.replace(/-/g, ' ').replace(/^./, (x) => x.toUpperCase());
  };
  ctx.card = (id) => {
    const d = docs.get(id);
    const p = d && d[lang];
    const c = (p && p.card) || {};
    return {
      title: ctx.tok(c.title || (p && (p.breadcrumb || p.h1)) || id),
      summary: c.summary ? ctx.mdInline(c.summary) : '',
      summaryPlain: c.summary ? ctx.tok(c.summary) : '',
      href: ctx.href(id),
    };
  };

  ctx.uid = (prefix = 'u') => {
    const n = (ids.get(prefix) || 0) + 1;
    ids.set(prefix, n);
    return n === 1 ? prefix : `${prefix}-${n}`;
  };
  /** Unique heading id from text (used for h2 anchors). */
  ctx.headingId = (text) => ctx.uid(slugify(text));

  ctx.twinPath = route && otherLang && route[otherLang] && rendered.has(`${route.id}:${otherLang}`) ? route[otherLang] : null;

  ctx.whatsappUrl = (text) => `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text || ui.cta.whatsappText)}`;
  /**
   * Direct channels (WhatsApp actions, tel: links) render only once site.contact holds real data (V-02): a placeholder
   * number must never be dialled. They come back on their own when site.contact.placeholder is false.
   */
  ctx.directContact = site.contact.placeholder !== true && !!site.contact.whatsapp;
  ctx.phoneLink = site.contact.placeholder !== true && !!site.contact.phoneE164;

  return ctx;
}

export function whatsappDisplay(site) {
  const digits = String(site.contact.whatsapp || '');
  if (`+${digits}` === site.contact.phoneE164) return site.contact.phoneDisplay;
  return `+${digits}`;
}
