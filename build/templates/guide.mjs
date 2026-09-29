/* Guide: hero sheet (with the hero render beside the title), key facts, then the article on one dotted sheet: a reading column
   (66ch) with a sticky table of contents drawn as a sheet, blocks, FAQ, sources; closing plates, related, cinema CTA.
   The body is NOT a stack of full-bleed chapters (a 50rem column cannot host them): the article is one chapter and its blocks
   are decorated by CSS (49-article.css). `plate` blocks come out of the column and render full bleed after the article. */
import { cajetin, faqSection, related, ctaBand, textHero, reviewedBy } from '../lib/components.mjs';
import { renderBlocks, serviceFor, plateBand } from '../lib/blocks.mjs';
import { noteTone } from '../lib/chapters.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set (build/lib/chapters.mjs)
  const p = ctx.page;
  const d = ctx.doc.dateModified;
  // "Revisado por {name}" joins the byline once site.founder is set (reviewedBy is empty until then).
  const meta = `<p class="byline"><span class="byline__by">${ctx.esc(ctx.t('guide.byline'))}</span>${reviewedBy(ctx).replace('dateline__by', 'byline__by')}<span>${ctx.esc(ctx.t('date.updated'))} <time datetime="${ctx.esc(d)}">${ctx.esc(ctx.fmtDate(d))}</time></span></p>`;
  const hero = textHero(ctx, { meta, className: 'hero--guide' });
  const facts = cajetin(ctx, p.facts);

  const blocks = p.blocks || [];
  const mainBlocks = blocks.filter((b) => b.type !== 'sources' && b.type !== 'plate');
  const sources = blocks.filter((b) => b.type === 'sources');
  const plates = blocks.filter((b) => b.type === 'plate');
  const state = {};
  const before = ctx.collect.headings.length;
  // The reading column renders without chapters (plain blocks styled by .article__body); the state is restored for the rest.
  const chapters = ctx.chapters;
  ctx.chapters = null;
  const body = renderBlocks(ctx, mainBlocks, { state, service: serviceFor(ctx) });
  const h2s = ctx.collect.headings.slice(before).filter((h) => h.level === 2);
  const toc = h2s.length >= 4
    ? `<nav class="toc" aria-labelledby="toc-title"><p class="toc__title" id="toc-title">${ctx.esc(ctx.t('h2.toc'))}</p><ol class="toc__list" role="list">${h2s.map((h) => `<li><a href="#${h.id}">${ctx.esc(h.text)}</a></li>`).join('')}</ol></nav>`
    : '';
  const faq = !state.faqPlaced && p.faq && p.faq.length ? faqSection(ctx, p.faq) : '';
  const src = sources.length ? renderBlocks(ctx, sources, {}) : '';
  ctx.chapters = chapters;
  noteTone(ctx, 'w');
  const article = `<article class="article" data-ch="w"><div class="wrap article__layout${toc ? '' : ' article__layout--solo'}">${toc ? `<aside class="article__aside">${toc}</aside>` : ''}<div class="article__body">${body}${faq}${src}</div></div></article>`;
  const html = hero + facts + article
    + (plates.length ? renderBlocks(ctx, plates, {}) : plateBand(ctx))
    + related(ctx, p.related)
    + ctaBand(ctx, { ...(p.cta || {}), service: serviceFor(ctx) });
  return { main: html, bodyClass: 'page-guide' };
}
