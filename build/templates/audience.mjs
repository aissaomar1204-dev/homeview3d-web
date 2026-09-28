/* Audience landing: same anatomy as a service page. */
import { textHero } from '../lib/components.mjs';
import { standardPage, serviceFor } from '../lib/blocks.mjs';

export default function render(ctx) {
  const { html } = standardPage(ctx, { hero: textHero(ctx, { actions: true, service: serviceFor(ctx) }) });
  return { main: html, bodyClass: 'page-audience' };
}
