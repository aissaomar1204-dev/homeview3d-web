/* Service: text hero (+ side figure) → cajetín → blocks → FAQ → related → closing CTA (preselected service). */
import { textHero } from '../lib/components.mjs';
import { standardPage, serviceFor } from '../lib/blocks.mjs';

export default function render(ctx) {
  const { html } = standardPage(ctx, { hero: textHero(ctx, { actions: true, service: serviceFor(ctx) }) });
  return { main: html, bodyClass: 'page-service' };
}
