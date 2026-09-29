/* Hub: text hero → cajetín (optional) → blocks (services / pages / comingSoon) → related → closing CTA. */
import { textHero } from '../lib/components.mjs';
import { standardPage } from '../lib/blocks.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set: every block is a chapter (build/lib/chapters.mjs)
  const { html } = standardPage(ctx, { hero: textHero(ctx), faq: true });
  return { main: html, bodyClass: 'page-hub' };
}
