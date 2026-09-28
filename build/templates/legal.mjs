/* Legal: plain reading layout, prose blocks. */
import { textHero } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';

export default function render(ctx) {
  const body = renderBlocks(ctx, ctx.page.blocks || [], {});
  return { main: `${textHero(ctx, { figureSide: false })}<div class="legal">${body}</div>`, bodyClass: 'page-legal' };
}
