/* Contact: H1 + lead → form + alternatives (WhatsApp, email, phone, booking) → other blocks → FAQ → cajetín. ContactPage on the GEO side. */
import { textHero, contactForm, cajetin } from '../lib/components.mjs';
import { standardPage } from '../lib/blocks.mjs';

export default function render(ctx) {
  const p = ctx.page;
  const hasForm = (p.blocks || []).some((b) => b.type === 'contactForm');
  const { html } = standardPage(ctx, {
    hero: textHero(ctx, { figureSide: false, className: 'hero--contact' }),
    facts: false,
    beforeBlocks: hasForm ? '' : contactForm(ctx, { service: 'maqueta' }),
    related: false,
    cta: false,
  });
  return { main: html + cajetin(ctx, p.facts), bodyClass: 'page-contact' };
}
