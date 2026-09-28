/* Home (rulebook C5, BUILD-SPEC §6): hero split 5/7 → cajetín → blocks → FAQ → form (the form is the end). */
import { h1, btnPrimary, linkArrow, contactHref, cajetin, faqSection, contactForm, hasImage } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';

export default function render(ctx) {
  const p = ctx.page;
  const blocks = p.blocks || [];
  const hasDemo = blocks.some((b) => b.type === 'viewer');
  const villaHref = hasDemo ? '#demo' : (ctx.has('caso-villa') ? ctx.href('caso-villa', 'visor') : null);
  const secondary = villaHref ? linkArrow(ctx, villaHref, ctx.t('cta.villa'), { icon: hasDemo ? 'arrowDown' : 'arrow' }) : '';
  const visual = ctx.img('villa_maqueta_iso', {
    alt: ctx.t('hero.alt'), eager: true, sizes: '(min-width: 1024px) 60vw, 100vw', imgClass: 'hero__img',
  });
  const hero = `<section class="hero hero--home" aria-labelledby="titulo"><div class="hero__grid">`
    + `<div class="hero__text">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.lead)}</p><p class="actions">${btnPrimary(ctx, contactHref(ctx, 'maqueta'), ctx.t('cta.demo'))}${secondary}</p></div>`
    + `<figure class="hero__visual"><div class="hero__stage${hasImage(ctx, 'villa_maqueta_iso') ? '' : ' hero__stage--missing'}">${visual}</div><figcaption class="hero__caption">${ctx.esc(ctx.t('hero.caption'))}</figcaption></figure>`
    + `</div></section>`;
  const state = {};
  const body = renderBlocks(ctx, blocks, {
    state, service: 'maqueta',
    eyebrows: { compare: ctx.t('eyebrow.compare'), viewer: ctx.t('eyebrow.viewer'), faq: ctx.t('eyebrow.faq') },
  });
  const faq = !state.faqPlaced && p.faq && p.faq.length ? faqSection(ctx, p.faq, { eyebrow: ctx.t('eyebrow.faq') }) : '';
  const form = state.formPlaced ? '' : contactForm(ctx, { service: 'maqueta' });
  return { main: hero + cajetin(ctx, p.facts) + body + faq + form, bodyClass: 'page-home' };
}
