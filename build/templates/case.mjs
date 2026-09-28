/* Case study (caso-villa): H1 + lead → viewer app (#visor, poster eager) → cajetín → blocks → FAQ → related → CTA. */
import { h1, hasImage } from '../lib/components.mjs';
import { standardPage, viewerModule } from '../lib/blocks.mjs';

function viewerFallback(ctx) {
  const v = ctx.data.villa;
  const poster = hasImage(ctx, 'villa_viewer_poster') ? 'villa_viewer_poster' : 'villa_maqueta_iso';
  const rooms = v.rooms.map((r) => `<li><span>${ctx.esc(r[ctx.lang].name)}</span><span class="num">≈${ctx.esc(ctx.fmtNumber(r.area, 1))} m²</span></li>`).join('');
  return `<section class="block block--viewer band band--stage" id="visor" aria-label="${ctx.esc(ctx.t('viewer.open'))}"><div class="wrap viewer-fallback">`
    + `<figure class="figure figure--stage"><div class="figure__media">${ctx.img(poster, { alt: ctx.t('hero.alt'), eager: true, sizes: '(min-width: 1024px) 66vw, 100vw' })}</div><figcaption>${ctx.esc(ctx.t('viewer.fallbackCaption'))}</figcaption></figure>`
    + `<div><h2>${ctx.esc(ctx.t('viewer.rooms'))}</h2><ol class="rooms" role="list">${rooms}</ol></div></div></section>`;
}

export default function render(ctx) {
  const p = ctx.page;
  const hero = `<section class="hero hero--text hero--case" aria-labelledby="titulo"><div class="wrap hero__grid"><div class="hero__text">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.lead)}</p></div></div></section>`;
  let app;
  if (viewerModule && typeof viewerModule.renderViewerApp === 'function') {
    ctx.needs.add('viewer');
    const out = viewerModule.renderViewerApp(ctx, { id: 'visor', eager: true });
    app = typeof out === 'string' ? out : (out && out.html) || '';
  } else {
    app = viewerFallback(ctx);
  }
  const { html } = standardPage(ctx, {
    hero: hero + app,
    cta: { h2: ctx.t('cta_band.caseH2'), body: ctx.t('cta_band.caseBody'), service: 'maqueta' },
  });
  return { main: html, bodyClass: 'page-case' };
}
