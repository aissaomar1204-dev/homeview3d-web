/* Pricing: text hero → cajetín → blocks (pricing[full], calculator, guarantees, tables…) → FAQ → related → CTA. */
import { textHero } from '../lib/components.mjs';
import { standardPage } from '../lib/blocks.mjs';

export default function render(ctx) {
  const { html } = standardPage(ctx, { hero: textHero(ctx, { actions: true, service: 'maqueta' }) });
  return { main: html, bodyClass: 'page-pricing' };
}
