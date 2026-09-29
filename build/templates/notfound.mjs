/* 404 (noindex, search-free): links to home, services, the case study, pricing and contact. A hero sheet and one chapter of links. */
import { heroAttrs, section } from '../lib/components.mjs';
import { heroLegend } from '../lib/hero.mjs';

export default function render(ctx) {
  ctx.chapters = {}; // a drawing set (build/lib/chapters.mjs)
  const ids = ['home', 'servicios', 'caso-villa', 'precios', 'contacto'].filter((id) => ctx.has(id));
  const links = ids.map((id) => `<li class="index__item"><h2 class="index__title"><a href="${ctx.esc(ctx.href(id))}">${ctx.esc(id === 'home' ? ctx.t('crumbs.home') : ctx.label(id))}</a></h2>${ctx.icon('arrow', 'index__arrow')}</li>`).join('');
  const main = `<section class="hero hero--text hero--404"${heroAttrs(ctx)} aria-labelledby="titulo"><div class="wrap hero__grid"><div class="hero__text"><p class="notfound__code num" aria-hidden="true">404</p><h1 id="titulo" class="h1">${ctx.esc(ctx.t('notfound.h1'))}</h1><p class="lead">${ctx.esc(ctx.t('notfound.lead'))}</p>${heroLegend(ctx)}</div></div></section>`
    + section(ctx, { type: 'pages', inner: `<ul class="index" role="list">${links}</ul>`, ch: undefined });
  return { main, bodyClass: 'page-404' };
}
