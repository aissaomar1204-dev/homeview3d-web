/* Legal: a quiet drawing set (white and paper sheets only): hero sheet without legend, one chapter per prose block. */
import { textHero } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';

export default function render(ctx) {
  ctx.chapters = { quiet: true }; // white/paper chapters only; CSS (.page-legal) drops the outlined numerals
  const hero = textHero(ctx, { figureSide: false });
  const body = renderBlocks(ctx, ctx.page.blocks || [], {});
  return { main: `${hero}${body}`, bodyClass: 'page-legal' };
}
