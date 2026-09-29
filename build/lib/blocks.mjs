/* ═══════════════════════════════════════════════════════════════
   Block renderers (docs/build/CONTENT-SCHEMA.md §3). Owner: ENGINE.
   renderBlocks(ctx, blocks, opts) → HTML. viewer / ar / formats / embedCode
   are delegated to build/lib/viewer.mjs (VIEWER) when it exists; small
   internal fallbacks keep pages meaningful while it does not.
   ═══════════════════════════════════════════════════════════════ */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './md.mjs';
import { optionalImport } from './context.mjs';
import { chapter } from './chapters.mjs';
import {
  cls, head, section, figure, table, faqSection, faqList, indexList, routePrice, ctaBand, compare, cajetin, related,
  processBlock, deliverablesBlock, pricingBlock, guaranteesBlock, calculator, contactForm, hasImage, linkArrow, tableHtml,
  btnPrimary, contactHref, defaultAlt, renderCaption, sideDrawing,
} from './components.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const viewerImport = await optionalImport(path.join(HERE, 'viewer.mjs'), { label: 'build/lib/viewer.mjs' });
/** VIEWER module (or null while it does not exist). */
export const viewerModule = viewerImport.mod;
export const viewerStatus = viewerImport.mod ? 'loaded' : viewerImport.missing ? 'missing' : 'error';

const SERVICE_IDS = ['servicio-plano', 'servicio-renders', 'servicio-tour', 'servicio-ar', 'servicio-staging'];
const AUDIENCE_IDS = ['sol-inmobiliarias', 'sol-promotoras', 'sol-arquitectos', 'sol-vacacional'];
/**
 * Image cards (C "image cards") for an index of pages, by page id. Audiences: the first is the large card with an eye-level
 * interior, the rest use the opaque aerial views. Services and zones get their own renders. A list becomes cards only when
 * every one of its pages has an image here (a mixed list stays a plain index).
 */
const CARD_IMAGES = {
  'sol-inmobiliarias': 'villa_interior_salon', 'sol-promotoras': 'villa_maqueta_iso_opaco',
  'sol-arquitectos': 'villa_muros_completos_opaco', 'sol-vacacional': 'villa_terraza_opaco',
  'servicio-plano': 'villa_salon_dormitorio_opaco', 'servicio-renders': 'villa_interior_bano', 'servicio-tour': 'villa_dormitorios_opaco',
  'servicio-ar': 'villa_bano_suite_opaco', 'servicio-staging': 'villa_interior_dormitorio',
  'zona-marbella': 'villa_interior_terraza', 'zona-malaga': 'villa_salon_dormitorio_opaco', 'zona-costa-del-sol': 'villa_terraza_opaco',
};
const cardImages = (ctx, ids) => {
  const live = ids.filter((id) => ctx.has(id));
  return ctx.chapters && live.length > 1 && live.every((id) => CARD_IMAGES[id]) ? CARD_IMAGES : undefined;
};

function callViewer(fn, ctx, block, fallback) {
  const f = viewerModule && viewerModule[fn];
  if (typeof f === 'function') {
    const out = f(ctx, block);
    if (typeof out === 'string') return out;
    if (out && typeof out.html === 'string') return out.html;
    return '';
  }
  return fallback();
}

/* ─── Viewer fallbacks (only while viewer.mjs is missing) ─────── */

function viewerFallback(ctx, block, { eyebrow } = {}) {
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.viewer'), intro: block.intro, eyebrow });
  const poster = hasImage(ctx, 'villa_viewer_poster') ? 'villa_viewer_poster' : 'villa_maqueta_iso';
  const rooms = ctx.data.villa.rooms.map((r) => `<li><span>${esc(r[ctx.lang].name)}</span><span class="num">≈${esc(ctx.fmtNumber(r.area, 1))} m²</span></li>`).join('');
  const link = ctx.has('caso-villa') && ctx.route.id !== 'caso-villa' ? `<p class="actions">${linkArrow(ctx, ctx.href('caso-villa', 'visor'), ctx.t('cta.villa'))}</p>` : '';
  const inner = `${hd.html}<div class="viewer-fallback"><figure class="figure figure--stage"><div class="figure__media">${ctx.img(poster, { alt: ctx.t('hero.alt'), sizes: '(min-width: 1024px) 66vw, 100vw' })}</div><figcaption>${esc(ctx.t('viewer.fallbackCaption'))}</figcaption></figure><div><h3>${esc(ctx.t('viewer.rooms'))}</h3><ol class="rooms" role="list">${rooms}</ol>${link}</div></div>`;
  return section(ctx, { type: 'viewer', id: ctx.route.template === 'home' ? 'demo' : undefined, band: 'stage', labelledby: hd.id, inner });
}

function formatsFallback(ctx, block) {
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.formats'), intro: block.intro });
  const rows = Object.values(ctx.data.villa.files).map((f) => [esc(f.label[ctx.lang]), { html: esc(ctx.fmtBytes(f.bytes)), num: true }]);
  return section(ctx, { type: 'formats', labelledby: hd.id, inner: `${hd.html}${tableHtml(ctx, { caption: esc(ctx.t('formats.caption')), cols: ctx.t('formats.head').map(esc), rows })}` });
}

function simpleFallback(ctx, block, key) {
  const hd = head(ctx, { h2: block.h2 || ctx.t(`h2.${key}`), intro: block.intro });
  const link = ctx.has('caso-villa') && ctx.route.id !== 'caso-villa' ? `<p class="actions">${linkArrow(ctx, ctx.href('caso-villa', 'visor'), ctx.t('cta.villa'))}</p>` : '';
  return section(ctx, { type: key, labelledby: hd.id, inner: `${hd.html}${link}` });
}

/* ─── Individual blocks ───────────────────────────────────────── */

/** Index of pages (services / audiences / pages blocks). Skipped when none of the pages is rendered. */
function indexBlock(ctx, b, type, ids, opts) {
  if (!ids.some((id) => ctx.has(id))) return '';
  const hd = head(ctx, { h2: b.h2 || ctx.t(`h2.${type}`), intro: b.intro });
  const images = opts.images === undefined ? cardImages(ctx, ids) : opts.images;
  return section(ctx, { type, labelledby: hd.id, inner: `${hd.html}${indexList(ctx, ids, { ...opts, images })}` });
}

/* ─── Answers on inner pages (D-09): answer + aside, alternating sides, one stage band ─── */

/** Templates whose answers get the two-column layout (guides keep their reading column). */
const SPLIT = new Set(['service', 'audience', 'zone', 'pricing', 'process', 'about']);
/** Renders offered to asides: eye-level interiors interleaved with the aerial cut-away views.
 *  villa_interior_bano stays out: its tight 1.6 m room crops the basin, fine in galleries but not as a full-bleed band. */
const ASIDE_IMAGES = [
  'villa_interior_salon', 'villa_salon_dormitorio', 'villa_interior_terraza', 'villa_terraza', 'villa_interior_dormitorio',
  'villa_bano_suite', 'villa_dormitorios', 'villa_muros_completos', 'villa_planta_cenital', 'villa_maqueta_iso',
];
/** Renders for the automatic full-bleed plate of a page that has none of its own: opaque and landscape (they are cropped to fill). */
const PLATE_IMAGES = [
  'villa_interior_salon', 'villa_interior_dormitorio', 'villa_terraza_opaco', 'villa_muros_completos_opaco',
  'villa_salon_dormitorio_opaco', 'villa_dormitorios_opaco', 'villa_maqueta_iso_opaco', 'villa_interior_bano',
]; // villa_interior_terraza is the pricing chapter's backdrop

const baseName = (n) => String(n).replace(/_opaco$/, '');

/** Images the page places itself (hero, figures, galleries), so an aside never repeats one that comes later. */
function pageImages(ctx) {
  const p = ctx.page || {};
  const out = new Set();
  if (p.hero && p.hero.image) out.add(baseName(p.hero.image));
  for (const b of p.blocks || []) {
    if (b.type === 'figure' && b.image) out.add(baseName(b.image));
    if (b.type === 'gallery') for (const it of b.items || []) out.add(baseName(it.image));
    if (b.type === 'plate') for (const it of b.images || []) out.add(baseName(it.image));
  }
  return out;
}

function nextImage(ctx, list = ASIDE_IMAGES) {
  const used = new Set([...ctx.collect.images.map((i) => baseName(i.name)), ...pageImages(ctx)]);
  // Each page starts the rotation at a different render, so neighbouring pages do not open on the same image.
  const start = [...ctx.route.id].reduce((t, ch) => t + ch.charCodeAt(0), 0) % list.length;
  const order = list.slice(start).concat(list.slice(0, start));
  return order.find((n) => hasImage(ctx, n) && !used.has(baseName(n))) || null;
}

function asideFigure(ctx, name, sizes) {
  const cap = renderCaption(ctx, name);
  return `<figure class="figure figure--stage"><div class="figure__media">${ctx.img(name, { alt: defaultAlt(ctx, name), sizes, widths: [480, 800, 1200] })}</div>${cap ? `<figcaption>${esc(cap)}. ${esc(ctx.t('img.renderLabel'))}.</figcaption>` : ''}</figure>`;
}

/**
 * Price card beside an answer. The pack is the route's own pack, else the first {{price:x}} / {{delivery:x}} token of
 * that answer (V-14). Without either (e.g. a pricing answer about the portfolio pack), there is no card: the aside
 * falls back to a fact or a render, so a card never shows a price the answer is not about.
 */
function priceCard(ctx, o, b = {}) {
  const r = ctx.route;
  const packs = ctx.data.pricing.packs;
  let packId = r.pack && packs.some((p) => p.id === r.pack) ? r.pack : null;
  const extra = !packId && r.pack && ctx.data.pricing.extras.some((e) => e.id === r.pack);
  let service = o.service;
  if (!packId && !extra) {
    const tok = String(b.answer || '').match(/\{\{(?:price|delivery):(\w+)/);
    packId = tok && packs.some((p) => p.id === tok[1]) ? tok[1] : null;
    if (packId) service = packId;
    // The pricing page is all prices: a card there must match its answer, or not be shown. Elsewhere the entry pack.
    else if (r.template === 'pricing') return '';
    else packId = 'plano3d';
  }
  const price = packId ? esc(ctx.t('services.from', { price: ctx.price(packId) })) : routePrice(ctx, r.id);
  const days = ctx.delivery(packId || 'plano3d');
  return `<div class="answer-card"><p class="mono">${esc(ctx.t('answers.price'))}</p><p class="answer-card__price">${price}</p>`
    + `<p>${esc(ctx.t('answers.delivery', { days }))}</p><p class="actions">${btnPrimary(ctx, contactHref(ctx, service), ctx.t('cta.demo'))}</p></div>`;
}

function answerAside(ctx, n, o, b) {
  const facts = ctx.page.facts || [];
  if (n % 4 === 2) { const card = priceCard(ctx, o, b); if (card) return card; }
  if (n % 4 === 0 && facts.length) {
    const [k, v] = facts[(n / 4) % facts.length];
    return `<p class="answer-fact"><span class="mono">${ctx.mdInline(k)}</span><strong>${ctx.mdInline(v)}</strong></p>`;
  }
  const img = nextImage(ctx);
  if (img) return asideFigure(ctx, img, '(min-width: 1320px) 390px, (min-width: 1024px) 30vw, 100vw');
  const card = priceCard(ctx, o, b);
  if (card || !facts.length) return card;
  const [k, v] = facts[n % facts.length];
  return `<p class="answer-fact"><span class="mono">${ctx.mdInline(k)}</span><strong>${ctx.mdInline(v)}</strong></p>`;
}

/**
 * Full-bleed render plate after the second answer of a page that has no `plate` block of its own: breaks the run of text.
 * Caption and alt are the render's own (villa.renders) plus the honesty label, so it never claims more than it is.
 */
export function plateBand(ctx) {
  if ((ctx.page.blocks || []).some((b) => b.type === 'plate')) return '';
  const img = nextImage(ctx, PLATE_IMAGES);
  if (!img) return '';
  const cap = renderCaption(ctx, img);
  return plateSection(ctx, [{ image: img, alt: defaultAlt(ctx, img), caption: `${cap ? `${cap}. ` : ''}${ctx.t('img.renderLabel')}.` }]);
}

/** One or two figures edge to edge (diptych 7/5), captions on a graphite strip below with «Vista NN» drawn by CSS. */
function plateSection(ctx, items) {
  const two = items.length > 1;
  const figs = items.map((it, i) => {
    const n = String((ctx.plateCount = (ctx.plateCount || 0) + 1)).padStart(2, '0');
    const sizes = two ? (i === 0 ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 42vw, 100vw') : '100vw';
    const cap = it.caption ? `<figcaption data-n="${n}" data-p="${esc(ctx.t('plate.view'))}">${ctx.mdInline(it.caption)}</figcaption>` : '';
    return `<figure>${ctx.img(it.image, { alt: ctx.tok(it.alt), sizes, widths: [480, 800, 1200, 1600, 2400], max: 2400 })}${cap}</figure>`;
  }).join('');
  return section(ctx, { type: 'vista', className: two ? 'block--vista2' : '', wrap: false, inner: figs, ch: chapter(ctx, 'plate') });
}

const R = {
  prose(ctx, b) {
    const hd = head(ctx, { h2: b.h2 });
    return section(ctx, { type: 'prose', labelledby: hd.id, inner: `${hd.html}<div class="prose">${ctx.md(b.body)}</div>` });
  },

  answer(ctx, b, o) {
    const hd = head(ctx, { h2: b.h2 });
    const body = b.body ? `<div class="prose">${ctx.md(b.body)}</div>` : '';
    const main = `${hd.html}<div class="answer" data-answer>${ctx.md(b.answer)}</div>${body}`;
    if (!SPLIT.has(ctx.route.template)) return section(ctx, { type: 'answer', labelledby: hd.id, inner: main });
    const n = (o.state.answers = (o.state.answers || 0) + 1);
    const aside = answerAside(ctx, n, o, b);
    const inner = `<div class="answer-split${n % 2 === 0 ? ' answer-split--flip' : ''}"><div class="answer-split__main">${main}</div><aside class="answer-split__aside">${aside}</aside></div>`;
    return section(ctx, { type: 'answer', labelledby: hd.id, inner }) + (n === 2 ? plateBand(ctx) : '');
  },

  table(ctx, b) {
    const hd = head(ctx, { h2: b.h2, intro: b.intro });
    return section(ctx, { type: 'table', labelledby: hd.id, inner: `${hd.html}${table(ctx, b)}` });
  },

  steps(ctx, b) {
    const hd = head(ctx, { h2: b.h2, intro: b.intro });
    const items = (b.items || []).map((it) => `<li class="step" data-reveal>${it.time ? `<p class="step__time">${ctx.mdInline(it.time)}</p>` : ''}<h3 class="step__title">${ctx.mdInline(it.title)}</h3><div class="step__body">${ctx.md(it.body)}</div></li>`).join('');
    // Chapters: outlined numerals and a line drawing that stays beside the steps (fills the empty half), a different one each time.
    if (ctx.chapters) return section(ctx, { type: 'steps', labelledby: hd.id, inner: `${hd.html}<div class="process process--side"><div class="process__steps"><ol class="steps steps--process" role="list">${items}</ol></div>${sideDrawing(ctx)}</div>` });
    return section(ctx, { type: 'steps', labelledby: hd.id, inner: `${hd.html}<ol class="steps" role="list">${items}</ol>` });
  },

  checklist(ctx, b) {
    const hd = head(ctx, { h2: b.h2, intro: b.intro });
    const items = (b.items || []).map((x) => `<li>${ctx.mdInline(x)}</li>`).join('');
    return section(ctx, { type: 'checklist', labelledby: hd.id, inner: `${hd.html}<ul class="checks checks--grid" role="list">${items}</ul>` });
  },

  figure(ctx, b) {
    return section(ctx, { type: 'figure', className: b.layout === 'wide' ? 'block--wide' : '', inner: figure(ctx, { image: b.image, alt: ctx.tok(b.alt), caption: b.caption, layout: b.layout || 'wide' }) });
  },

  gallery(ctx, b) {
    const hd = head(ctx, { h2: b.h2 || ctx.t('h2.gallery'), intro: b.intro });
    const n = (b.items || []).length;
    const items = (b.items || []).map((it, i) => {
      // Plates: odd count starts with a full-width plate; pairs alternate 7/5 and 5/7 (no equal widths side by side).
      const k = n % 2 ? i - 1 : i;
      const span = n % 2 && i === 0 ? 'full' : (Math.floor(k / 2) % 2 === 0 ? (k % 2 === 0 ? 'wide' : 'narrow') : (k % 2 === 0 ? 'narrow' : 'wide'));
      const sizes = { full: '(min-width: 1320px) 1224px, 100vw', wide: '(min-width: 1320px) 704px, (min-width: 1024px) 54vw, 100vw', narrow: '(min-width: 1320px) 496px, (min-width: 1024px) 38vw, 100vw' }[span];
      return `<li class="plate plate--${span}" data-reveal>${figure(ctx, { image: it.image, alt: ctx.tok(it.alt), caption: it.caption, sizes })}</li>`;
    }).join('');
    return section(ctx, { type: 'gallery', labelledby: hd.id, inner: `${hd.html}<ul class="plates" role="list">${items}</ul>` });
  },

  /**
   * Render plates between chapters: one full-bleed image, or a diptych (7/5) of two. The caption sits on a graphite
   * strip below the image (IMG-08) and always says it is a render; the plate number is drawn by CSS (data-n, data-p).
   */
  plate(ctx, b) {
    const items = b.images || [];
    return items.length ? plateSection(ctx, items) : '';
  },

  compare(ctx, b, o) { return compare(ctx, b, { eyebrow: o.eyebrows?.compare }); },

  /** Click-to-play render video: poster, preload none, muted, playsinline, visible play/pause, caption. */
  video(ctx, b) {
    const v = ctx.data.videos && ctx.data.videos[b.video];
    if (!v) return '';
    ctx.needs.add('video');
    const hd = head(ctx, { h2: b.h2, intro: b.intro });
    const caption = ctx.tok(b.caption);
    const mp4 = (v.sources || []).find((x) => /mp4/.test(x.type)) || v.sources[0];
    const poster = ctx.asset(v.poster);
    ctx.collect.videos.push({
      key: b.video, name: ctx.tok(b.h2 || caption), caption, width: v.width, height: v.height, duration: v.duration,
      contentUrl: ctx.abs(ctx.asset(mp4.src)), thumbnailUrl: ctx.abs(poster), embedUrl: null,
    });
    const sources = (v.sources || []).map((x) => `<source src="${esc(ctx.asset(x.src))}" type="${esc(x.type)}">`).join('');
    // `controls` for no-JS visitors; main.js swaps them for the play/pause button below the frame.
    const fig = `<figure class="video" data-video><div class="video__frame"><video controls muted playsinline preload="none" poster="${esc(poster)}" width="${v.width}" height="${v.height}" aria-label="${esc(ctx.t('video.label', { caption }))}">${sources}</video></div>`
      + `<button type="button" class="btn btn--neutral video__btn" data-video-toggle><span data-when="paused">${ctx.icon('play')}${esc(ctx.t('video.play'))}</span><span data-when="playing">${ctx.icon('pause')}${esc(ctx.t('video.pause'))}</span></button>`
      + `<figcaption>${ctx.mdInline(b.caption)}</figcaption></figure>`;
    return section(ctx, { type: 'video', labelledby: hd.id, inner: `${hd.html}${fig}` });
  },

  viewer(ctx, b, o) {
    ctx.needs.add('viewer');
    return callViewer('renderViewerBand', ctx, b, () => { ctx.needs.delete('viewer'); return viewerFallback(ctx, b, { eyebrow: o.eyebrows?.viewer }); });
  },
  ar(ctx, b) {
    ctx.needs.add('viewer');
    return callViewer('renderArBlock', ctx, b, () => { ctx.needs.delete('viewer'); return simpleFallback(ctx, b, 'ar'); });
  },
  formats(ctx, b) { return callViewer('renderFormats', ctx, b, () => formatsFallback(ctx, b)); },
  embedCode(ctx, b) { return callViewer('renderEmbedCode', ctx, b, () => simpleFallback(ctx, b, 'embedCode')); },

  deliverables(ctx, b) { return deliverablesBlock(ctx, b); },

  comingSoon(ctx, b) {
    const hd = head(ctx, { h2: b.h2 || ctx.t('h2.comingSoon'), intro: b.intro });
    const items = (ctx.data.comingSoon || []).map((s) => `<li class="soon__item"><h3>${esc(s[ctx.lang].title)}</h3><p>${ctx.mdInline(s[ctx.lang].body)}</p></li>`).join('');
    return section(ctx, { type: 'soon', labelledby: hd.id, ch: chapter(ctx, 'comingSoon', { head: !!hd.id }), inner: `${hd.html}<ul class="soon" role="list">${items}</ul>` });
  },

  process(ctx, b) { return processBlock(ctx, b); },

  needs(ctx, b) {
    const hd = head(ctx, { h2: b.h2 || ctx.t('h2.needs'), intro: b.intro });
    const items = (ctx.data.process.needs[ctx.lang] || []).map((x) => `<li>${ctx.mdInline(x)}</li>`).join('');
    return section(ctx, { type: 'needs', labelledby: hd.id, inner: `${hd.html}<ul class="checks checks--grid${ctx.chapters ? ' checks--plates' : ''}" role="list">${items}</ul>` });
  },

  services(ctx, b) { return indexBlock(ctx, b, 'services', SERVICE_IDS, { className: 'index--services', meta: (id) => routePrice(ctx, id) }); },
  audiences(ctx, b) { return indexBlock(ctx, b, 'audiences', AUDIENCE_IDS, { className: 'index--grid', images: CARD_IMAGES }); },
  pages(ctx, b) { return indexBlock(ctx, b, 'pages', b.ids || [], { className: (b.ids || []).length > 3 ? 'index--grid' : '' }); },

  pricing(ctx, b) { return pricingBlock(ctx, b); },
  calculator(ctx, b) { return calculator(ctx, b); },
  guarantees(ctx, b) { return guaranteesBlock(ctx, b); },

  stat(ctx, b) {
    const src = b.source ? `<p class="stat__source">${esc(ctx.t('stat.source'))}: <a href="${esc(b.source.url)}" rel="noopener">${esc(ctx.tok(b.source.label))}</a>${b.year ? `, ${esc(b.year)}` : ''}</p>` : '';
    return section(ctx, { type: 'stat', inner: `<figure class="stat" data-reveal><p class="stat__value num">${ctx.mdInline(String(b.value))}</p><figcaption><p class="stat__label">${ctx.mdInline(b.label)}</p>${src}</figcaption></figure>` });
  },

  callout(ctx, b) {
    const title = b.title ? `<p class="callout__title">${ctx.mdInline(b.title)}</p>` : '';
    return section(ctx, { type: 'callout', inner: `<aside class="callout callout--${b.tone || 'note'}">${title}<div class="callout__body">${ctx.md(b.body)}</div></aside>` });
  },

  specs(ctx, b) {
    const hd = head(ctx, { h2: b.h2 || ctx.t('h2.specs') });
    const rows = (b.items || []).map(([k, v]) => `<div class="specs__row"><dt>${ctx.mdInline(k)}</dt><dd>${ctx.mdInline(String(v))}</dd></div>`).join('');
    return section(ctx, { type: 'specs', labelledby: hd.id, inner: `${hd.html}<dl class="specs">${rows}</dl>` });
  },

  sources(ctx, b) {
    const hd = head(ctx, { h2: b.h2 || ctx.t('h2.sources') });
    const items = (b.items || []).map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(ctx.tok(s.label))}</a>${s.note ? `<span class="sources__note">${ctx.mdInline(s.note)}</span>` : ''}</li>`).join('');
    return section(ctx, { type: 'sources', labelledby: hd.id, inner: `${hd.html}<ol class="sources">${items}</ol>` });
  },

  faq(ctx, b, o) {
    o.state.faqPlaced = true;
    return faqSection(ctx, ctx.page.faq || [], { eyebrow: o.eyebrows?.faq, h2: b.h2 });
  },

  faqGroups(ctx, b, o) {
    o.state.faqPlaced = true;
    return (b.groups || []).map((g) => {
      const hd = head(ctx, { h2: g.title });
      return section(ctx, { type: 'faq', className: 'faq-group', labelledby: hd.id, inner: `${hd.html}${faqList(ctx, g.items || [], { openCount: 3 })}` });
    }).join('');
  },

  glossary(ctx) { return glossaryBlock(ctx); },

  contactForm(ctx, b, o) { o.state.formPlaced = true; return contactForm(ctx, { ...b, service: b.service || o.service }); },

  cta(ctx, b, o) { return ctaBand(ctx, { h2: b.h2, body: b.body, service: b.service || o.service, image: null, className: 'cta-band--inline' }); },
};

/* ─── Glossary (A–Z index + terms, DefinedTermSet on the GEO side) ── */

export function glossaryTerms(ctx) {
  const list = (ctx.data.glossary || []).filter((t) => t[ctx.lang] && t[ctx.lang].term);
  const coll = new Intl.Collator(ctx.lang === 'es' ? 'es' : 'en', { sensitivity: 'base' });
  return list.slice().sort((a, b) => coll.compare(a[ctx.lang].term, b[ctx.lang].term));
}

function glossaryBlock(ctx) {
  const terms = glossaryTerms(ctx);
  if (!terms.length) return '';
  const letterOf = (t) => t[ctx.lang].term.normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0).toUpperCase();
  const first = new Map();
  for (const t of terms) { const L = letterOf(t); if (!first.has(L)) first.set(L, t.id); }
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const idxId = ctx.uid('indice');
  const index = `<nav class="az" aria-labelledby="${idxId}"><h2 id="${idxId}" class="az__title">${esc(ctx.t('h2.glossaryIndex'))}</h2><ul class="az__letters" role="list">${letters.map((L) => (first.has(L) ? `<li><a href="#${esc(first.get(L))}">${L}</a></li>` : `<li><span aria-hidden="true">${L}</span></li>`)).join('')}</ul></nav>`;
  const items = terms.map((t) => {
    const L = t[ctx.lang];
    ctx.collect.headings.push({ level: 2, id: t.id, text: L.term });
    const rel = t.related && ctx.has(t.related) ? `<p class="term__related">${esc(ctx.t('glossary.related'))}: <a href="${esc(ctx.href(t.related))}">${esc(ctx.label(t.related))}</a></p>` : '';
    return `<section class="term" id="${esc(t.id)}" aria-labelledby="${esc(t.id)}-t"><h2 class="term__name" id="${esc(t.id)}-t"><dfn>${esc(L.term)}</dfn></h2><p class="term__def">${ctx.mdInline(L.definition)}</p>${L.body ? `<div class="term__body prose">${ctx.md(L.body)}</div>` : ''}${rel}</section>`;
  }).join('');
  return section(ctx, { type: 'glossary', inner: `<div class="glossary">${index}<div class="glossary__terms">${items}</div></div>` });
}

/* ─── Public API ──────────────────────────────────────────────── */

/**
 * Render an array of blocks.
 * opts: { eyebrows: { compare, viewer, faq }, service, skip: Set(types), state: {} }
 * After the call, opts.state.faqPlaced / formPlaced tell the template what is already on the page.
 */
export function renderBlocks(ctx, blocks, opts = {}) {
  const o = { eyebrows: {}, state: {}, skip: new Set(), ...opts };
  if (!o.state) o.state = {};
  const out = [];
  for (const b of blocks || []) {
    if (o.skip.has(b.type)) continue;
    const fn = R[b.type];
    if (!fn) throw new Error(`Unknown block type "${b.type}" in ${ctx.route.id}[${ctx.lang}]`);
    out.push(fn(ctx, b, o));
  }
  opts.state = o.state;
  return out.join('');
}

/* ─── Page composer shared by the templates ───────────────────── */

const SERVICE_BY_PAGE = {
  'servicio-plano': 'maqueta', 'servicio-renders': 'renders', 'servicio-tour': 'visor', 'servicio-ar': 'ar',
  'servicio-staging': 'staging', 'sol-promotoras': 'promocion', 'caso-villa': 'maqueta', precios: 'maqueta',
};
export const serviceFor = (ctx) => (ctx.page && ctx.page.cta && ctx.page.cta.service) || SERVICE_BY_PAGE[ctx.route.id] || 'maqueta';

/**
 * hero → cajetín → blocks → FAQ (if not placed) → extra → related → closing CTA.
 * opts: { hero (html), facts (bool), faq (bool), related (bool), cta (bool | { h2, body, service }), eyebrows, afterBlocks (html) }
 */
export function standardPage(ctx, opts = {}) {
  const p = ctx.page;
  const service = serviceFor(ctx);
  const state = {};
  // The key-facts strip is drawn before the blocks (chapter tones and numbers follow the page order), placed right after the hero.
  const facts = opts.facts !== false ? cajetin(ctx, p.facts) : '';
  const blocks = renderBlocks(ctx, p.blocks || [], { state, service, eyebrows: opts.eyebrows });
  const parts = [opts.hero || ''];
  if (opts.facts !== false) parts.push(facts);
  if (opts.beforeBlocks) parts.push(opts.beforeBlocks);
  parts.push(blocks);
  if (opts.afterBlocks) parts.push(opts.afterBlocks);
  if (opts.faq !== false && !state.faqPlaced && p.faq && p.faq.length) parts.push(faqSection(ctx, p.faq));
  if (opts.related !== false) parts.push(related(ctx, p.related));
  if (opts.cta !== false) {
    const c = { ...(typeof opts.cta === 'object' ? opts.cta : {}), ...(p.cta || {}) };
    parts.push(ctaBand(ctx, { h2: c.h2, body: c.body, service: c.service || service }));
  }
  return { html: parts.join(''), state };
}

export { SERVICE_IDS, AUDIENCE_IDS, cls };
