/* Thanks (noindex): confirmation, next steps, links to the case study and the guides. */
import { textHero, linkArrow } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';

export default function render(ctx) {
  const steps = ctx.t('pages.thanks.steps');
  const list = `<ol class="steps steps--compact" role="list">${steps.map((s) => `<li class="step"><p class="step__body">${ctx.esc(s)}</p></li>`).join('')}</ol>`;
  const links = [
    ctx.has('caso-villa') ? linkArrow(ctx, ctx.href('caso-villa', 'visor'), ctx.t('cta.villa')) : '',
    ctx.has('guias') ? linkArrow(ctx, ctx.href('guias'), ctx.label('guias')) : '',
  ].join('');
  const next = `<section class="block block--next" aria-labelledby="siguientes"><div class="wrap"><div class="block__head"><h2 id="siguientes">${ctx.esc(ctx.t('h2.nextSteps'))}</h2></div>${list}${links ? `<p class="actions actions--quiet">${links}</p>` : ''}</div></section>`;
  const extra = renderBlocks(ctx, ctx.page.blocks || [], {});
  return { main: textHero(ctx, { figureSide: false }) + next + extra, bodyClass: 'page-thanks' };
}
