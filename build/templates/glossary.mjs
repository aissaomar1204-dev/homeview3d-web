/* Glossary: text hero → cajetín → A–Z index + one <section id="term"> per term → related → CTA. DefinedTermSet on the GEO side. */
import { textHero } from '../lib/components.mjs';
import { standardPage } from '../lib/blocks.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set: every block is a chapter (build/lib/chapters.mjs)
  const p = ctx.page;
  const hasBlock = (p.blocks || []).some((b) => b.type === 'glossary');
  const saved = ctx.page;
  if (!hasBlock) ctx.page = { ...p, blocks: [...(p.blocks || []), { type: 'glossary' }] };
  const { html } = standardPage(ctx, { hero: textHero(ctx) });
  ctx.page = saved;
  return { main: html, bodyClass: 'page-glossary' };
}
