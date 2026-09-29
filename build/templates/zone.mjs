/* Zone (local) page: same anatomy as a service page, with local content blocks. */
import { textHero } from '../lib/components.mjs';
import { standardPage, serviceFor } from '../lib/blocks.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set: every block is a chapter (build/lib/chapters.mjs)
  const { html } = standardPage(ctx, { hero: textHero(ctx, { actions: true, service: serviceFor(ctx) }) });
  return { main: html, bodyClass: 'page-zone' };
}
