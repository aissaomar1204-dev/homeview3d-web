/* Home (rulebook C5, BUILD-SPEC §6): hero → cajetín → blocks → FAQ → form (the form is the end).
   Hero "El plano se vuelve 3D" (build/lib/hero.mjs + src/js/hero.js): text column on the left, on the right a drawing
   sheet that bleeds to the viewport edge. A 2D line plan becomes the furnished 3D maqueta; dimension lines (cotas)
   and rulers follow the model. The served HTML is the FINAL state (still + final cotas); JS upgrades it to the
   animation unless reduced motion, Save-Data or a slow connection say otherwise. */
import { h1, btnPrimary, linkArrow, contactHref, cajetin, faqSection, contactForm } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';
import { heroStage, heroBoot } from '../lib/hero.mjs';

export default function render(ctx) {
  const p = ctx.page;
  const blocks = p.blocks || [];
  const hasDemo = blocks.some((b) => b.type === 'viewer');
  const villaHref = hasDemo ? '#demo' : (ctx.has('caso-villa') ? ctx.href('caso-villa', 'visor') : null);
  const secondary = villaHref ? linkArrow(ctx, villaHref, ctx.t('cta.villa'), { icon: hasDemo ? 'arrowDown' : 'arrow' }) : '';
  const hero = `<section class="hero hero--seq" aria-labelledby="titulo"><div class="hs-grid">`
    + `<div class="hero__text hs-text">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.lead)}</p><p class="actions" data-hero-actions>${btnPrimary(ctx, contactHref(ctx, 'maqueta'), ctx.t('cta.demo'))}${secondary}</p></div>`
    + `${heroStage(ctx)}${heroBoot()}`
    + `</div></section>`;
  const state = {};
  const body = renderBlocks(ctx, blocks, {
    state, service: 'maqueta',
    eyebrows: { compare: ctx.t('eyebrow.compare'), viewer: ctx.t('eyebrow.viewer'), faq: ctx.t('eyebrow.faq') },
  });
  const faq = !state.faqPlaced && p.faq && p.faq.length ? faqSection(ctx, p.faq, { eyebrow: ctx.t('eyebrow.faq'), openCount: 1 }) : '';
  const form = state.formPlaced ? '' : contactForm(ctx, { service: 'maqueta' });
  return { main: hero + cajetin(ctx, p.facts) + body + faq + form, bodyClass: 'page-home' };
}
