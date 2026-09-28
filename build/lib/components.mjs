/* ═══════════════════════════════════════════════════════════════
   Shared components (docs/build/BUILD-SPEC.md §7, rulebook A9). Owner: ENGINE.
   Pure functions (ctx, …) → HTML strings. No colour, spacing or motion
   values here: every visual decision lives in src/css via tokens.
   ═══════════════════════════════════════════════════════════════ */
import { esc } from './md.mjs';

/* ─── Primitives ──────────────────────────────────────────────── */

export const cls = (...xs) => xs.filter(Boolean).join(' ');

/** Section heading group: optional eyebrow, h2 (auto id), optional intro (md). Returns { html, id }. */
export function head(ctx, { h2, intro, eyebrow, level = 2, className = '' } = {}) {
  if (!h2) return { html: intro ? `<div class="block__intro">${ctx.md(intro)}</div>` : '', id: null };
  const text = ctx.tok(h2);
  const id = ctx.headingId(text);
  ctx.collect.headings.push({ level, id, text });
  const eb = eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : '';
  const html = `<div class="${cls('block__head', className)}">${eb}<h${level} id="${id}">${ctx.mdInline(h2)}</h${level}>${intro ? `<div class="block__intro">${ctx.md(intro)}</div>` : ''}</div>`;
  return { html, id };
}

/** <section> wrapper with an inner container. */
export function section(ctx, { type, id, labelledby, band, className = '', inner, wrap = true, attrs = '' }) {
  const idAttr = id ? ` id="${id}"` : '';
  const lab = labelledby ? ` aria-labelledby="${labelledby}"` : '';
  return `<section class="${cls('block', type && `block--${type}`, band && 'band', band && typeof band === 'string' && `band--${band}`, className)}"${idAttr}${lab}${attrs ? ` ${attrs}` : ''}>${wrap ? `<div class="wrap">${inner}</div>` : inner}</section>`;
}

export function btnPrimary(ctx, href, label) {
  return `<a class="btn btn--primary" href="${esc(href)}">${esc(label)}</a>`;
}

export function linkArrow(ctx, href, label, { icon = 'arrow', attrs = '' } = {}) {
  return `<a class="link-arrow" href="${esc(href)}"${attrs ? ` ${attrs}` : ''}><span>${esc(label)}</span>${ctx.icon(icon)}</a>`;
}

export function whatsappLink(ctx, { className = 'link-arrow', label } = {}) {
  return `<a class="${className}" href="${esc(ctx.whatsappUrl())}" rel="noopener">${ctx.icon('chat')}<span>${esc(label || ctx.t('cta.whatsapp'))}</span></a>`;
}

/** Link to the contact form with a preselected service (and extra query params). */
export function contactHref(ctx, service, extra = {}) {
  const q = new URLSearchParams();
  if (service) q.set('servicio', service);
  for (const [k, v] of Object.entries(extra)) q.set(k, v);
  const qs = q.toString();
  return `${ctx.href('contacto')}${qs ? `?${qs}` : ''}#${formAnchor(ctx)}`;
}

export const formAnchor = (ctx) => (ctx.lang === 'es' ? 'contacto' : 'contact');
export const calcAnchor = (ctx) => (ctx.lang === 'es' ? 'calculadora' : 'calculator');

/** Is the image in the manifest (so optional visuals can be skipped instead of placeholder'd)? */
export const hasImage = (ctx, name) => !!(ctx.images && ctx.images[name]);
const isAlpha = (ctx, name) => !!(ctx.images && ctx.images[name] && ctx.images[name].alpha);

/** Render caption (villa.renders) for an image key, or null. */
export function renderCaption(ctx, name) {
  const base = String(name).replace(/_opaco$/, '');
  const r = ctx.data.villa.renders.find((x) => x.image === base);
  return r ? r[ctx.lang] : null;
}

/** Default alt text for an image key: caption + honesty label (IMG-03). */
export function defaultAlt(ctx, name) {
  const cap = renderCaption(ctx, name);
  return cap ? `${cap}. ${ctx.t('img.renderLabel')}.` : `${ctx.t('img.renderLabel')}.`;
}

/** <figure> with a picture on the stage (RGBA renders sit on --color-stage). */
export function figure(ctx, { image, alt, caption, layout, sizes, eager, className = '' }) {
  const stage = isAlpha(ctx, image) || !hasImage(ctx, image) ? ' figure--stage' : '';
  const s = sizes || (layout === 'inline' ? '(min-width: 1024px) 66ch, 100vw' : '(min-width: 1320px) 1224px, 100vw');
  const cap = caption ? `<figcaption>${ctx.mdInline(caption)}</figcaption>` : '';
  return `<figure class="${cls('figure', layout && `figure--${layout}`, stage, className)}"><div class="figure__media">${ctx.img(image, { alt: alt ?? defaultAlt(ctx, image), sizes: s, eager, max: layout === 'inline' ? 1200 : undefined })}</div>${cap}</figure>`;
}

/* ─── Heroes ──────────────────────────────────────────────────── */

/** H1 with the long-title size step (TYPE-05: > 36 characters uses the h2 size). */
export function h1(ctx, text, id = 'titulo') {
  const plain = ctx.tok(text);
  ctx.collect.headings.push({ level: 1, id, text: plain });
  return `<h1 id="${id}" class="${plain.length > 36 ? 'h1 h1--long' : 'h1'}">${ctx.mdInline(text)}</h1>`;
}

export function heroActions(ctx, { service, secondary = 'villa' } = {}) {
  const primary = btnPrimary(ctx, contactHref(ctx, service), ctx.t('cta.demo'));
  let sec = '';
  if (secondary === 'villa' && ctx.has('caso-villa') && ctx.route.id !== 'caso-villa') sec = linkArrow(ctx, ctx.href('caso-villa', 'visor'), ctx.t('cta.villa'));
  return `<p class="actions">${primary}${sec}</p>`;
}

/** Left-aligned text hero with an optional side figure (page.hero). */
export function textHero(ctx, { actions = false, service, meta = '', figureSide = true, className = '' } = {}) {
  const p = ctx.page;
  const hero = figureSide && p.hero && p.hero.image ? p.hero : null;
  const text = `<div class="hero__text">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.lead)}</p>${meta}${actions ? heroActions(ctx, { service }) : ''}</div>`;
  const fig = hero ? `<figure class="hero__figure${isAlpha(ctx, hero.image) ? ' figure--stage' : ''}"><div class="figure__media">${ctx.img(hero.image, { alt: hero.alt ?? defaultAlt(ctx, hero.image), sizes: '(min-width: 1024px) 40vw, 100vw', eager: true, max: 1200 })}</div>${hero.caption ? `<figcaption>${ctx.mdInline(hero.caption)}</figcaption>` : ''}</figure>` : '';
  return `<section class="${cls('hero hero--text', hero && 'hero--figure', className)}" aria-labelledby="titulo"><div class="wrap hero__grid">${text}${fig}</div></section>`;
}

/* ─── Cajetín (title block of key facts, COMP-13) ─────────────── */

export function cajetin(ctx, facts, { date } = {}) {
  if (!facts || !facts.length) return '';
  const n = facts.length;
  const cells = facts.map(([k, v]) => `<div class="cajetin__cell"><dt>${ctx.mdInline(k)}</dt><dd>${ctx.mdInline(v)}</dd></div>`).join('');
  const d = date || ctx.doc?.dateModified;
  const rev = d ? `<span class="cajetin__rev">${esc(ctx.t('date.revised'))} <time datetime="${esc(d)}">${esc(ctx.fmtDate(d))}</time></span>` : '';
  return `<section class="cajetin-band" aria-label="${esc(ctx.t('cajetin.label'))}"><div class="wrap"><div class="cajetin cajetin--n${n}" data-reveal="line"><p class="cajetin__head"><span>${esc(ctx.t('cajetin.head'))}</span>${rev}</p><dl class="cajetin__grid">${cells}</dl></div></div></section>`;
}

/* ─── Tables (GEO-03) ─────────────────────────────────────────── */

export function table(ctx, { caption, head: cols, rows, note, sources, className = '', rowHeaders = true }) {
  const id = ctx.uid('tabla');
  const thead = `<thead><tr>${cols.map((c) => `<th scope="col">${ctx.mdInline(String(c))}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 && rowHeaders ? `<th scope="row">${ctx.mdInline(String(c))}</th>` : `<td>${ctx.mdInline(String(c))}</td>`)).join('')}</tr>`).join('')}</tbody>`;
  const src = sources && sources.length ? `<p class="table__sources">${esc(ctx.t('stat.source'))}: ${sources.map((s) => `<a href="${esc(s.url)}" rel="noopener">${esc(ctx.tok(s.label))}</a>`).join(', ')}</p>` : '';
  const nt = note ? `<div class="table__note">${ctx.md(note)}</div>` : '';
  return `<div class="${cls('table', className)}"><div class="table__scroll" role="region" tabindex="0" aria-labelledby="${id}"><table><caption id="${id}">${ctx.mdInline(caption)}</caption>${thead}${tbody}</table></div>${nt}${src}</div>`;
}

/** Same as table() but with pre-rendered HTML cells (no md processing). */
export function tableHtml(ctx, { caption, cols, rows, className = '', rowHeaders = true }) {
  const id = ctx.uid('tabla');
  const numCol = cols.map((_, i) => i > 0 && rows.every((r) => r[i] && typeof r[i] === 'object' && r[i].num));
  const thead = `<thead><tr>${cols.map((c, i) => `<th scope="col"${numCol[i] ? ' class="num"' : ''}>${c}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map((r) => `<tr>${r.map((c, i) => {
    const cell = typeof c === 'object' && c !== null ? c : { html: c };
    const span = cell.colspan ? ` colspan="${cell.colspan}"` : '';
    return i === 0 && rowHeaders ? `<th scope="row"${span}>${cell.html}</th>` : `<td${span}${cell.num ? ' class="num"' : ''}>${cell.html}</td>`;
  }).join('')}</tr>`).join('')}</tbody>`;
  return `<div class="${cls('table', className)}"><div class="table__scroll" role="region" tabindex="0" aria-labelledby="${id}"><table><caption id="${id}">${caption}</caption>${thead}${tbody}</table></div></div>`;
}

/* ─── FAQ (COMP-17) ───────────────────────────────────────────── */

/** Two columns of <details>; first `openCount` open. Records the rendered FAQ in ctx.collect.faq. */
export function faqList(ctx, items, { openCount = 3 } = {}) {
  if (!items || !items.length) return '';
  const rendered = items.map((f, i) => {
    ctx.collect.faq.push({ q: ctx.tok(f.q), a: ctx.tok(f.a) });
    return `<details class="faq__item"${i < openCount ? ' open' : ''}><summary><span class="faq__q">${ctx.mdInline(f.q)}</span><span class="faq__icon" aria-hidden="true"></span></summary><div class="faq__a">${ctx.md(f.a)}</div></details>`;
  });
  const half = Math.ceil(rendered.length / 2);
  const cols = rendered.length > 3 ? [rendered.slice(0, half), rendered.slice(half)] : [rendered];
  return `<div class="faq${cols.length > 1 ? ' faq--2' : ''}">${cols.map((c) => `<div class="faq__col">${c.join('')}</div>`).join('')}</div>`;
}

export function faqSection(ctx, items, { eyebrow, h2 } = {}) {
  if (!items || !items.length) return '';
  const hd = head(ctx, { h2: h2 || ctx.t('h2.faq'), eyebrow });
  return section(ctx, { type: 'faq', labelledby: hd.id, inner: `${hd.html}${faqList(ctx, items)}` });
}

/* ─── Index lists (related, pages, audiences, services) ───────── */

export function indexList(ctx, ids, { className = '', meta } = {}) {
  const items = ids.filter((id) => ctx.has(id)).map((id) => {
    const c = ctx.card(id);
    const m = meta ? meta(id) : '';
    return `<li class="index__item"><h3 class="index__title"><a href="${esc(c.href)}">${esc(c.title)}</a></h3>${c.summary ? `<p class="index__summary">${c.summary}</p>` : ''}${m ? `<p class="index__meta">${m}</p>` : ''}${ctx.icon('arrow', 'index__arrow')}</li>`;
  });
  if (!items.length) return '';
  return `<ul class="${cls('index', className)}" role="list">${items.join('')}</ul>`;
}

export function related(ctx, ids) {
  const list = (ids || []).filter((id) => ctx.has(id) && id !== ctx.route.id);
  if (!list.length) return '';
  const hd = head(ctx, { h2: ctx.t('h2.related') });
  return section(ctx, { type: 'related', labelledby: hd.id, inner: `${hd.html}${indexList(ctx, list, { className: 'index--related' })}` });
}

/** "Desde 490 € + IVA" for a route's pack (packs, or an extra such as staging). */
export function routePrice(ctx, id) {
  const r = ctx.data.routeById[id];
  if (!r || !r.pack) return '';
  const pack = ctx.data.pricing.packs.find((p) => p.id === r.pack);
  if (pack) return esc(ctx.t('services.from', { price: ctx.price(pack.id) }));
  const extra = ctx.data.pricing.extras.find((e) => e.id === r.pack);
  if (extra && extra.price != null) return `${esc(ctx.t('services.from', { price: ctx.extra(extra.id) }))} ${esc(extra.unit[ctx.lang])}`;
  return '';
}

/* ─── CTA band (closing + mid-page) ───────────────────────────── */

export function ctaBand(ctx, { h2, body, service, image = 'villa_terraza', className = '' } = {}) {
  const hd = head(ctx, { h2: h2 || ctx.t('cta_band.h2') });
  const text = ctx.md(body || ctx.t('cta_band.body'));
  const fig = image && hasImage(ctx, image)
    ? `<figure class="cta-band__figure${isAlpha(ctx, image) ? ' figure--stage' : ''}"><div class="figure__media">${ctx.img(image, { alt: ctx.t('cta_band.alt'), sizes: '(min-width: 1024px) 40vw, 100vw', max: 1200 })}</div></figure>`
    : '';
  const inner = `<div class="cta-band__grid${fig ? '' : ' cta-band__grid--solo'}"><div class="cta-band__text">${hd.html}<div class="cta-band__body">${text}</div><p class="actions">${btnPrimary(ctx, contactHref(ctx, service), ctx.t('cta.demo'))}${whatsappLink(ctx)}</p></div>${fig}</div>`;
  return section(ctx, { type: 'cta', className: cls('cta-band', className), labelledby: hd.id, inner });
}

/* ─── Date line ───────────────────────────────────────────────── */

export function dateLine(ctx, { author = false } = {}) {
  const d = ctx.doc?.dateModified;
  if (!d) return '';
  const by = author ? `<span class="dateline__by">${esc(ctx.t('guide.byline'))}</span>` : '';
  return `<p class="dateline">${by}<span>${esc(ctx.t('date.updated'))} <time datetime="${esc(d)}">${esc(ctx.fmtDate(d))}</time></span></p>`;
}

/* ─── Compare slider (COMP-12) ────────────────────────────────── */

export function compare(ctx, block = {}, { eyebrow } = {}) {
  ctx.needs.add('slider');
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.compare'), intro: block.intro, eyebrow });
  const id = ctx.uid('comparar');
  const under = ctx.img('villa_plano_lineas', { alt: ctx.t('compare.altPlan'), sizes: '(min-width: 1024px) 560px, 100vw', imgClass: 'compare__img', max: 1200 });
  const over = ctx.img('villa_planta_cenital_opaco', { alt: ctx.t('compare.altModel'), sizes: '(min-width: 1024px) 560px, 100vw', imgClass: 'compare__img', max: 1200 });
  const vt = ctx.t('compare.valuetext', { n: 50 });
  const fig = `<figure class="compare__figure"><div class="compare__labels" aria-hidden="true"><span>${esc(ctx.t('compare.plan'))}</span><span>${esc(ctx.t('compare.model'))}</span></div>`
    + `<div class="compare__stage" data-compare data-valuetext="${esc(ctx.t('compare.valuetext'))}">`
    + `<div class="compare__layer compare__layer--under">${under}</div><div class="compare__layer compare__layer--over">${over}</div>`
    + `<span class="compare__handle" aria-hidden="true"></span>`
    + `<input class="compare__range" type="range" id="${id}" name="${id}" min="0" max="100" step="1" value="50" aria-label="${esc(ctx.t('compare.aria'))}" aria-valuetext="${esc(vt)}">`
    + `</div><figcaption>${esc(ctx.t('compare.caption'))}</figcaption></figure>`;
  const inner = `<div class="compare"><div class="compare__text">${hd.html}<p class="compare__hint">${esc(ctx.t('compare.hint'))}</p></div>${fig}</div>`;
  return section(ctx, { type: 'compare', band: 'stage', labelledby: hd.id, inner });
}

/* ─── Process (list and despiece variants, COMP-15) ───────────── */

export function processSteps(ctx, { headingLevel = 3 } = {}) {
  const steps = ctx.data.process.steps;
  return `<ol class="steps steps--process" role="list">${steps.map((s, i) => {
    const L = s[ctx.lang];
    return `<li class="step" data-reveal><p class="step__time">${esc(L.time)}</p><h${headingLevel} class="step__title">${esc(L.title)}</h${headingLevel}><p class="step__body">${ctx.mdInline(L.body)}</p></li>`;
  }).join('')}</ol>`;
}

function totalCota(ctx) {
  const { min, max } = ctx.data.process.totalDays;
  const days = ctx.lang === 'es' ? `${min} a ${max} días laborables` : `${min} to ${max} working days`;
  return `<p class="cota" data-reveal="line"><span class="cota__label">${esc(ctx.t('process.total'))}: <strong>${esc(days)}</strong></span></p>`;
}

export function processBlock(ctx, block = {}) {
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.process'), intro: block.intro });
  const steps = processSteps(ctx);
  if (block.variant !== 'despiece') {
    return section(ctx, { type: 'process', labelledby: hd.id, inner: `${hd.html}${steps}${totalCota(ctx)}` });
  }
  ctx.needs.add('despiece');
  const layers = ['villa_despiece_1', 'villa_despiece_2', 'villa_despiece_3'];
  const have = layers.every((l) => hasImage(ctx, l));
  let drawing;
  if (have) {
    const stages = ctx.t('process.stages');
    drawing = `<figure class="despiece" data-despiece><div class="despiece__stage">${layers.map((l, i) => `<div class="despiece__layer despiece__layer--${i + 1}">${ctx.img(l, { alt: i === 0 ? ctx.t('process.layerAlt') : '', sizes: '(min-width: 1024px) 50vw, 100vw', max: 1200 })}</div>`).join('')}</div><figcaption><ol class="despiece__legend" role="list">${stages.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></figcaption></figure>`;
  } else {
    drawing = `<figure class="despiece despiece--static"><div class="despiece__stage">${ctx.img('villa_maqueta_iso', { alt: ctx.t('process.fallbackAlt'), sizes: '(min-width: 1024px) 50vw, 100vw', max: 1200 })}</div><figcaption>${esc(ctx.t('hero.caption'))}</figcaption></figure>`;
  }
  const inner = `${hd.html}<div class="process process--despiece"><div class="process__drawing">${drawing}</div><div class="process__steps">${steps}${totalCota(ctx)}</div></div>`;
  return section(ctx, { type: 'process', labelledby: hd.id, inner });
}

/* ─── Deliverables bento (COMP-14) ────────────────────────────── */

export function deliverablesBlock(ctx, block = {}) {
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.deliverables'), intro: block.intro });
  const items = ctx.data.deliverables;
  const cells = items.map((d, i) => {
    const L = d[ctx.lang];
    const title = ctx.has(d.page) ? `<a href="${esc(ctx.href(d.page))}">${esc(L.title)}</a>` : esc(L.title);
    const formats = String(L.formats || '').split(/\s*·\s*/).filter(Boolean).map((f) => `<li>${esc(f)}</li>`).join('');
    const img = ctx.img(d.image, { alt: defaultAlt(ctx, d.image), sizes: i === 0 ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 40vw, 100vw', max: i === 0 ? 1600 : 1200 });
    return `<li class="bento__cell bento__cell--${i + 1}" data-reveal><div class="bento__media${isAlpha(ctx, d.image) || !hasImage(ctx, d.image) ? ' figure--stage' : ''}">${img}</div><div class="bento__text"><h3 class="bento__title">${title}</h3><p>${ctx.mdInline(L.body)}</p>${formats ? `<ul class="bento__formats" role="list" aria-label="${esc(ctx.t('deliverables.formats'))}">${formats}</ul>` : ''}</div></li>`;
  }).join('');
  const soon = ctx.data.comingSoon || [];
  const soonLine = soon.length ? `<p class="bento__soon"><span>${esc(ctx.t('deliverables.soon'))}:</span> ${soon.map((s) => esc(s[ctx.lang].title)).join(ctx.lang === 'es' ? ' y ' : ' and ')}.</p>` : '';
  return section(ctx, { type: 'deliverables', labelledby: hd.id, inner: `${hd.html}<ul class="bento bento--${items.length}" role="list">${cells}</ul>${soonLine}` });
}

/* ─── Pricing (COMP-16) ───────────────────────────────────────── */

function packTile(ctx, p, onPricingPage) {
  const L = ctx.lang;
  const id = ctx.uid(`pack-${p.id}`);
  const flag = p.featured ? `<p class="pack__flag">${esc(ctx.t('pricing.featured'))}</p>` : '<p class="pack__flag pack__flag--empty" aria-hidden="true"></p>';
  const cta = p.featured
    ? btnPrimary(ctx, contactHref(ctx, p.id), ctx.t('cta.demo'))
    : linkArrow(ctx, contactHref(ctx, p.id), ctx.t('cta.demo'));
  return `<article class="pack${p.featured ? ' pack--featured' : ''}" aria-labelledby="${id}">`
    + flag
    + `<h3 class="pack__name" id="${id}">${esc(p.name[L])}</h3>`
    + `<p class="pack__summary">${esc(p.summary[L])}</p>`
    + `<p class="pack__price"><span class="pack__from">${esc(ctx.t('pricing.from'))}</span> <strong class="num">${esc(ctx.price(p.id))}</strong> <span class="pack__vat">${esc(ctx.t('pricing.vat'))}</span><span class="pack__unit">${esc(p.unit[L])}</span></p>`
    + `<dl class="pack__meta"><div><dt>${esc(ctx.t('pricing.delivery'))}</dt><dd>${esc(ctx.delivery(p.id))}</dd></div><div><dt>${esc(ctx.t('pricing.revisions'))}</dt><dd>${esc(ctx.revisions(p.id))}</dd></div></dl>`
    + `<ul class="checks pack__includes" role="list" aria-label="${esc(ctx.t('pricing.includes'))}">${p.includes[L].map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
    + `<p class="pack__cta">${cta}</p>`
    + '</article>';
}

export function guaranteesList(ctx) {
  const g = ctx.data.pricing.guarantees[ctx.lang] || [];
  return `<ul class="guarantees" role="list">${g.map((x, i) => `<li data-reveal>${ctx.mdInline(x)}</li>`).join('')}</ul>`;
}

export function pricingBlock(ctx, block = {}) {
  const { pricing } = ctx.data;
  const onPricing = ctx.route.id === 'precios';
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.pricing'), intro: block.intro });
  const tiles = `<div class="packs" role="list" aria-label="${esc(ctx.t('pricing.packsLabel'))}">${pricing.packs.map((p) => `<div role="listitem" class="packs__item${p.featured ? ' packs__item--featured' : ''}">${packTile(ctx, p, onPricing)}</div>`).join('')}</div>`;
  const vat = `<p class="pricing__vat">${esc(ctx.t('pricing.vatNote'))}</p>`;
  let more = '';
  if (block.variant === 'full') {
    const maxTiers = Math.max(...pricing.packs.map((p) => (p.tiers ? p.tiers.length : 0)));
    const tierCols = pricing.packs.find((p) => p.tiers && p.tiers.length === maxTiers).tiers.map((t) => esc(ctx.t('pricing.upTo', { m2: t.maxM2 })));
    const cols = [esc(ctx.t('pricing.tierHead')), ...tierCols, esc(ctx.t('pricing.delivery'))];
    const rows = pricing.packs.map((p) => {
      const cells = p.tiers
        ? p.tiers.map((t) => ({ html: esc(ctx.fmtPrice(t.price)), num: true }))
        : [{ html: `${esc(ctx.t('pricing.from'))} ${esc(ctx.price(p.id))} (${esc(p.unit[ctx.lang])})`, colspan: maxTiers }];
      return [esc(p.name[ctx.lang]), ...cells, esc(ctx.delivery(p.id))];
    });
    const tiersTable = tableHtml(ctx, { caption: esc(ctx.t('pricing.tiersCaption')), cols, rows, className: 'table--pricing' });
    const extrasRows = pricing.extras.map((x) => [esc(x.name[ctx.lang]), { html: esc(ctx.extra(x.id)), num: true }, esc(x.unit[ctx.lang])]);
    const extrasTable = tableHtml(ctx, { caption: esc(ctx.t('pricing.extrasCaption')), cols: ctx.t('pricing.extrasHead').map(esc), rows: extrasRows, className: 'table--extras' });
    const v = pricing.volume;
    const volume = `<div class="volume" data-reveal><p class="volume__name">${esc(v.name[ctx.lang])}</p><p class="volume__price"><strong class="num">${esc(ctx.volume())}</strong> <span>${esc(ctx.t('pricing.vat'))}</span></p><p class="volume__unit">${esc(ctx.t('pricing.volumeUnit', { unit: ctx.volumeUnit() }))}. ${esc(v.note[ctx.lang])}</p><p class="volume__cta">${linkArrow(ctx, contactHref(ctx, 'maqueta', { unidades: v.units }), ctx.t('cta.demo'))}</p></div>`;
    const gHead = head(ctx, { h2: ctx.t('h2.guarantees'), level: 3 });
    more = `<div class="pricing__tables">${tiersTable}${extrasTable}</div>${volume}<div class="pricing__guarantees">${gHead.html}${guaranteesList(ctx)}</div>`;
  } else {
    const links = [];
    if (!onPricing && ctx.has('precios')) links.push(linkArrow(ctx, ctx.href('precios'), ctx.t('pricing.allPrices')));
    more = links.length ? `<p class="actions actions--quiet">${links.join('')}</p>` : '';
  }
  return section(ctx, { type: 'pricing', labelledby: hd.id, inner: `${hd.html}${tiles}${vat}${more}` });
}

export function guaranteesBlock(ctx, block = {}) {
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.guarantees') });
  return section(ctx, { type: 'guarantees', labelledby: hd.id, inner: `${hd.html}${guaranteesList(ctx)}` });
}

/* ─── Calculator (volume, COMP-16) ────────────────────────────── */

export function calculator(ctx, block = {}) {
  ctx.needs.add('calculator');
  const { pricing } = ctx.data;
  const c = pricing.calculator;
  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.calculator'), intro: block.intro });
  const steps = c.steps;
  const rows = steps.map((s, i) => {
    const to = i < steps.length - 1 ? steps[i + 1].from - 1 : c.maxUnits;
    const label = to === s.from ? String(s.from) : ctx.t('calc.range', { from: s.from, to });
    return [esc(label), { html: `${esc(ctx.fmtPrice(s.unit))} ${esc(ctx.t('calc.plusVat'))}`, num: true }];
  });
  const tbl = tableHtml(ctx, { caption: esc(ctx.t('calc.caption')), cols: ctx.t('calc.head').map(esc), rows, className: 'table--calc' });
  const inputId = ctx.uid('calc-unidades');
  const unit0 = steps[0].unit;
  const vat = pricing.vatRate;
  const base = contactHref(ctx, c.packId).split('#')[0];
  const widget = `<div class="calc__widget" data-calc hidden`
    + ` data-steps="${esc(JSON.stringify(steps))}" data-min="${c.minUnits}" data-max="${c.maxUnits}" data-vat="${vat}"`
    + ` data-locale="${ctx.lang === 'es' ? 'es-ES' : 'en-GB'}" data-per-unit="${esc(ctx.t('calc.perUnit'))}" data-href="${esc(base)}" data-anchor="${formAnchor(ctx)}">`
    + `<label class="calc__label" for="${inputId}">${esc(ctx.t('calc.units'))}</label>`
    + `<div class="stepper"><button type="button" class="stepper__btn" data-step="-1" aria-label="${esc(ctx.t('calc.less'))}" aria-controls="${inputId}">${ctx.icon('minus')}</button>`
    + `<input class="stepper__input num" type="number" id="${inputId}" name="unidades" inputmode="numeric" min="${c.minUnits}" max="${c.maxUnits}" step="1" value="1" autocomplete="off">`
    + `<button type="button" class="stepper__btn" data-step="1" aria-label="${esc(ctx.t('calc.more'))}" aria-controls="${inputId}">${ctx.icon('plus')}</button></div>`
    + `<output class="calc__out" for="${inputId}" aria-live="polite">`
    + `<span class="calc__unit" data-out="unit">${esc(ctx.fmtPrice(unit0))} ${esc(ctx.t('calc.perUnit'))}</span>`
    + `<span class="calc__total"><span class="calc__total-label">${esc(ctx.t('calc.total'))}</span> <strong class="num" data-out="total">${esc(ctx.fmtPrice(unit0))}</strong> <span>${esc(ctx.t('calc.plusVat'))}</span></span>`
    + `<span class="calc__vat"><span class="num" data-out="vat">${esc(ctx.fmtPrice(Math.round(unit0 * (1 + vat) * 100) / 100))}</span> ${esc(ctx.t('calc.vatIncl'))}</span>`
    + `</output><p class="calc__cta"><a class="btn btn--primary" data-out="cta" href="${esc(`${base}${base.includes('?') ? '&' : '?'}unidades=1#${formAnchor(ctx)}`)}">${esc(ctx.t('cta.demo'))}</a></p></div>`;
  const inner = `<div class="calc"><div class="calc__text">${hd.html}${tbl}<p class="calc__note">${esc(ctx.t('calc.note'))}</p></div>${widget}</div>`;
  return section(ctx, { type: 'calculator', id: calcAnchor(ctx), labelledby: hd.id, inner });
}

/* ─── Lead form (Netlify Forms, COMP-18/19, A11Y-09) ──────────── */

export function contactForm(ctx, block = {}, { alternatives = true } = {}) {
  ctx.needs.add('form');
  const f = (k) => esc(ctx.t(`form.${k}`));
  const req = `<span class="field__req">(${f('required')})</span>`;
  const opt = `<span class="field__opt">(${f('optional')})</span>`;
  const u = (name) => ctx.uid(`f-${name}`);
  const ids = Object.fromEntries(['tipo', 'servicio', 'unidades', 'nombre', 'empresa', 'email', 'tel', 'plano', 'enlace', 'mensaje', 'origen', 'rgpd', 'hp'].map((k) => [k, u(k)]));
  const err = (k) => `<p class="field__error" id="${ids[k]}-error" data-error hidden></p>`;
  const hint = (k, text) => `<p class="field__hint" id="${ids[k]}-hint">${text}</p>`;

  const tipos = Object.entries(ctx.t('form.tipos'));
  const tipo = `<fieldset class="field field--choice" id="${ids.tipo}" aria-describedby="${ids.tipo}-error"><legend class="field__label">${f('tipo')} ${req}</legend><div class="choices">${tipos.map(([v, l], i) => `<label class="choice" for="${ids.tipo}-${v}"><input type="radio" id="${ids.tipo}-${v}" name="tipo" value="${v}"${i === 0 ? ' required data-m="choice"' : ''}><span>${esc(l)}</span></label>`).join('')}</div>${err('tipo')}</fieldset>`;
  const servicio = `<div class="field"><label class="field__label" for="${ids.servicio}">${f('servicio')} ${opt}</label><select id="${ids.servicio}" name="servicio" class="input" data-preselect="servicio">${Object.entries(ctx.t('form.servicios')).map(([v, l]) => `<option value="${v}"${v === (block.service || 'maqueta') ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;
  const unidades = `<div class="field field--short"><label class="field__label" for="${ids.unidades}">${f('unidades')} ${opt}</label><input id="${ids.unidades}" name="unidades" class="input num" type="number" inputmode="numeric" min="1" max="500" step="1" autocomplete="off" data-preselect="unidades" aria-describedby="${ids.unidades}-hint">${hint('unidades', f('unidadesHint'))}</div>`;

  const text = (k, { type = 'text', autocomplete, inputmode, required, spell, ph = true, msg } = {}) =>
    `<div class="field"><label class="field__label" for="${ids[k]}">${f(k)} ${required ? req : opt}</label><input id="${ids[k]}" name="${k}" class="input" type="${type}"${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${spell === false ? ' spellcheck="false"' : ''}${required ? ' required' : ''}${ph ? ` placeholder="${f(`${k}Ph`)}"` : ''}${msg ? ` data-m="${msg}"` : ''} aria-describedby="${ids[k]}-error">${err(k)}</div>`;

  const plano = `<div class="field field--file"><label class="field__label" for="${ids.plano}">${f('plano')} ${opt}</label><div class="file"><input id="${ids.plano}" name="plano" class="file__input" type="file" accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf" data-max="8000000" data-m="file" aria-describedby="${ids.plano}-hint ${ids.plano}-error"><span class="file__ui" aria-hidden="true">${ctx.icon('upload')}<span data-file-name>${f('plano')}</span></span><button type="button" class="file__remove" data-file-remove hidden>${f('planoRemove')}</button></div>${hint('plano', f('planoHint'))}${err('plano')}</div>`;
  const enlace = text('enlace', { type: 'url', autocomplete: 'url', inputmode: 'url', spell: false, msg: 'url' });
  const mensaje = `<div class="field"><label class="field__label" for="${ids.mensaje}">${f('mensaje')} ${opt}</label><textarea id="${ids.mensaje}" name="mensaje" class="input" rows="4" autocomplete="off" placeholder="${f('mensajePh')}"></textarea></div>`;
  const origen = `<div class="field"><label class="field__label" for="${ids.origen}">${f('origen')} ${opt}</label><select id="${ids.origen}" name="origen" class="input"><option value="">${f('origenPh')}</option>${Object.entries(ctx.t('form.origenes')).map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div>`;
  const rgpd = `<div class="field field--check"><label class="check" for="${ids.rgpd}"><input id="${ids.rgpd}" name="rgpd" type="checkbox" value="si" required data-m="rgpd" aria-describedby="${ids.rgpd}-error"><span>${ctx.tHtml('form.rgpd')}</span></label>${err('rgpd')}</div>`;
  const hp = `<p class="hp" aria-hidden="true"><label for="${ids.hp}">${f('honeypot')}</label><input id="${ids.hp}" name="bot-field" type="text" tabindex="-1" autocomplete="off"></p>`;
  const hidden = ['utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'landing'].map((n) => `<input type="hidden" name="${n}" value="">`).join('')
    + `<input type="hidden" name="form-name" value="presupuesto"><input type="hidden" name="idioma" value="${ctx.lang}">`;

  const action = ctx.href('gracias');
  const formId = ctx.uid('form-presupuesto');
  const form = `<form class="form" id="${formId}" name="presupuesto" method="POST" action="${esc(action)}" enctype="multipart/form-data" data-netlify="true" netlify-honeypot="bot-field" data-form`
    + ` toolname="solicitar_presupuesto" tooldescription="${f('toolDescription')}"`
    + ` data-step-label="${f('step')}" data-msg-required="${f('errRequired')}" data-msg-choice="${f('errChoice')}" data-msg-email="${f('errEmail')}" data-msg-url="${f('errUrl')}" data-msg-rgpd="${f('errRgpd')}" data-msg-file="${f('errFile')}"`
    + ` data-msg-summary="${f('errSummary')}" data-msg-unsaved="${f('unsaved')}" data-sending="${esc(ctx.t('cta.sending'))}">`
    + hidden + hp
    + `<p class="form__progress" data-form-progress aria-live="polite" hidden>${esc(ctx.t('form.step', { n: 1 }))}</p>`
    + `<fieldset class="form__step" data-step="1"><legend class="form__legend">${f('legend1')}</legend>${tipo}${servicio}${unidades}<p class="form__nav" data-step-nav hidden><button type="button" class="link-arrow link-arrow--button" data-next><span>${f('next')}</span>${ctx.icon('arrow')}</button></p></fieldset>`
    + `<fieldset class="form__step" data-step="2"><legend class="form__legend">${f('legend2')}</legend>`
    + `<div class="form__row">${text('nombre', { autocomplete: 'name', required: true })}${text('empresa', { autocomplete: 'organization' })}</div>`
    + `<div class="form__row">${text('email', { type: 'email', autocomplete: 'email', inputmode: 'email', spell: false, required: true })}${text('tel', { type: 'tel', autocomplete: 'tel', inputmode: 'tel' })}</div>`
    + plano + enlace + mensaje + origen + rgpd
    + `<p class="form__status" data-form-status role="status" aria-live="polite"></p>`
    + `<p class="form__submit"><button type="submit" class="btn btn--primary" data-submit>${esc(ctx.t('cta.send'))}</button><button type="button" class="link-back" data-back hidden>${f('back')}</button></p>`
    + `<p class="form__privacy">${f('privacy')}</p>`
    + `</fieldset></form>`;

  const hd = head(ctx, { h2: block.h2 || ctx.t('h2.contactForm'), intro: block.intro });
  const alt = alternatives ? contactAlternatives(ctx) : '';
  const inner = `<div class="contact">${`<div class="contact__main">${hd.html}${form}</div>`}${alt}</div>`;
  return section(ctx, { type: 'form', id: formAnchor(ctx), className: 'form-section', labelledby: hd.id, inner });
}

export function contactAlternatives(ctx) {
  const c = ctx.site.contact;
  const items = [
    `<li><span class="alt__k">${esc(ctx.t('form.altWhatsapp'))}</span>${whatsappLink(ctx, { className: 'btn btn--neutral' })}</li>`,
    `<li><span class="alt__k">${esc(ctx.t('form.altEmail'))}</span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`,
    `<li><span class="alt__k">${esc(ctx.t('form.altPhone'))}</span><a href="tel:${esc(c.phoneE164)}">${esc(c.phoneDisplay)}</a></li>`,
  ];
  if (c.booking) items.push(`<li><span class="alt__k">${esc(ctx.t('form.altBooking'))}</span><a href="${esc(c.booking)}" rel="noopener">${esc(ctx.t('form.altBooking'))}</a></li>`);
  const altId = ctx.uid('alt');
  return `<aside class="contact__alt" aria-labelledby="${altId}"><h3 id="${altId}" class="alt__title">${esc(ctx.t('form.altTitle'))}</h3><ul class="alt" role="list">${items.join('')}</ul><p class="alt__note">${esc(ctx.t('form.altReply'))}</p></aside>`;
}
