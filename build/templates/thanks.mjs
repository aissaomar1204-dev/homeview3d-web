/* Thanks (noindex): confirmation, next steps, links to the case study and the guides. A short drawing set: hero sheet + one chapter. */
import { textHero, linkArrow, section, head } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set (build/lib/chapters.mjs)
  const hero = textHero(ctx, { figureSide: false });
  const steps = ctx.t('pages.thanks.steps');
  const list = `<ol class="steps steps--compact" role="list">${steps.map((s) => `<li class="step"><p class="step__body">${ctx.esc(s)}</p></li>`).join('')}</ol>`;
  const links = [
    ctx.has('caso-villa') ? linkArrow(ctx, ctx.href('caso-villa', 'visor'), ctx.t('cta.villa')) : '',
    ctx.has('guias') ? linkArrow(ctx, ctx.href('guias'), ctx.label('guias')) : '',
  ].join('');
  const hd = head(ctx, { h2: ctx.t('h2.nextSteps') });
  const next = section(ctx, { type: 'next', labelledby: hd.id, inner: `${hd.html}${list}${links ? `<p class="actions actions--quiet">${links}</p>` : ''}`, ch: undefined });
  const extra = renderBlocks(ctx, ctx.page.blocks || [], {});
  return { main: hero + next + extra, bodyClass: 'page-thanks' };
}
