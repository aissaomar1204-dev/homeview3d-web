/* 404 (noindex, search-free): links to home, services, the case study, pricing and contact. */

export default function render(ctx) {
  const ids = ['home', 'servicios', 'caso-villa', 'precios', 'contacto'].filter((id) => ctx.has(id));
  const links = ids.map((id) => `<li class="index__item"><h2 class="index__title"><a href="${ctx.esc(ctx.href(id))}">${ctx.esc(id === 'home' ? ctx.t('crumbs.home') : ctx.label(id))}</a></h2>${ctx.icon('arrow', 'index__arrow')}</li>`).join('');
  const main = `<section class="hero hero--text hero--404" aria-labelledby="titulo"><div class="wrap hero__grid"><div class="hero__text"><p class="notfound__code num" aria-hidden="true">404</p><h1 id="titulo" class="h1">${ctx.esc(ctx.t('notfound.h1'))}</h1><p class="lead">${ctx.esc(ctx.t('notfound.lead'))}</p></div></div></section>`
    + `<section class="block block--pages"><div class="wrap"><ul class="index" role="list">${links}</ul></div></section>`;
  return { main, bodyClass: 'page-404' };
}
