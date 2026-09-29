/* About: text hero → (cajetín) → blocks → FAQ (if any) → related → CTA. AboutPage on the GEO side. */
import { textHero } from '../lib/components.mjs';
import { standardPage } from '../lib/blocks.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set: every block is a chapter (build/lib/chapters.mjs)
  const { html } = standardPage(ctx, { hero: textHero(ctx) });
  return { main: html, bodyClass: 'page-about' };
}
