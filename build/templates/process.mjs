/* Process (/como-funciona/): text hero → cajetín → blocks (process[despiece], needs…) → FAQ → related → CTA. HowTo on the GEO side. */
import { textHero } from '../lib/components.mjs';
import { standardPage } from '../lib/blocks.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set: every block is a chapter (build/lib/chapters.mjs)
  const { html } = standardPage(ctx, { hero: textHero(ctx, { actions: true, service: 'maqueta' }) });
  return { main: html, bodyClass: 'page-process' };
}
