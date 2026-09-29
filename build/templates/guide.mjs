/* Guide: article layout (66ch), author line + "Actualizado el", auto table of contents (≥ 4 h2), blocks, FAQ, sources, related, CTA. */
import { h1, cajetin, faqSection, related, ctaBand, figure, defaultAlt, reviewedBy } from '../lib/components.mjs';
import { renderBlocks, serviceFor } from '../lib/blocks.mjs';

export default function render(ctx) {
  const p = ctx.page;
  const d = ctx.doc.dateModified;
  // "Revisado por {name}" joins the byline once site.founder is set (reviewedBy is empty until then).
  const meta = `<p class="byline"><span class="byline__by">${ctx.esc(ctx.t('guide.byline'))}</span>${reviewedBy(ctx).replace('dateline__by', 'byline__by')}<span>${ctx.esc(ctx.t('date.updated'))} <time datetime="${ctx.esc(d)}">${ctx.esc(ctx.fmtDate(d))}</time></span></p>`;
  const heroFig = p.hero && p.hero.image
    ? figure(ctx, { image: p.hero.image, alt: p.hero.alt ? ctx.tok(p.hero.alt) : defaultAlt(ctx, p.hero.image), caption: p.hero.caption, eager: true, sizes: '(min-width: 1024px) 880px, 100vw', className: 'article__figure' })
    : '';
  const hero = `<header class="article__head"><div class="wrap">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.lead)}</p>${meta}</div></header>`;

  const blocks = p.blocks || [];
  const mainBlocks = blocks.filter((b) => b.type !== 'sources');
  const sources = blocks.filter((b) => b.type === 'sources');
  const state = {};
  const before = ctx.collect.headings.length;
  const body = renderBlocks(ctx, mainBlocks, { state, service: serviceFor(ctx) });
  const h2s = ctx.collect.headings.slice(before).filter((h) => h.level === 2);
  const toc = h2s.length >= 4
    ? `<nav class="toc" aria-labelledby="toc-title"><p class="toc__title" id="toc-title">${ctx.esc(ctx.t('h2.toc'))}</p><ol class="toc__list" role="list">${h2s.map((h) => `<li><a href="#${h.id}">${ctx.esc(h.text)}</a></li>`).join('')}</ol></nav>`
    : '';
  const faq = !state.faqPlaced && p.faq && p.faq.length ? faqSection(ctx, p.faq) : '';
  const src = sources.length ? renderBlocks(ctx, sources, {}) : '';
  const html = `<article class="article">${hero}${heroFig ? `<div class="wrap article__hero">${heroFig}</div>` : ''}${cajetin(ctx, p.facts)}`
    + `<div class="wrap article__layout${toc ? '' : ' article__layout--solo'}">${toc ? `<aside class="article__aside">${toc}</aside>` : ''}<div class="article__body">${body}${faq}${src}</div></div></article>`
    + related(ctx, p.related)
    + ctaBand(ctx, { ...(p.cta || {}), service: serviceFor(ctx) });
  return { main: html, bodyClass: 'page-guide' };
}
