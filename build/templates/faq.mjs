/* FAQ hub: text hero → grouped <details> (first 3 of each group open) → related → CTA. FAQPage on the GEO side. */
import { textHero } from '../lib/components.mjs';
import { standardPage } from '../lib/blocks.mjs';

export default function render(ctx) {
  const { html } = standardPage(ctx, { hero: textHero(ctx) });
  return { main: html, bodyClass: 'page-faq' };
}
