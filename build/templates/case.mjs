/* Case study (caso-villa, rulebook C5): the hero IS the viewer facade (D-07). H1 + lead + CTA in cols 1-5, the viewer
   app (#visor, poster eager = LCP) in cols 6-12; on phones: H1, lead, then the stage. → cajetín → blocks → FAQ →
   related → CTA. */
import { h1, hasImage, heroActions } from '../lib/components.mjs';
import { standardPage, viewerModule } from '../lib/blocks.mjs';

function viewerFallback(ctx) {
  const v = ctx.data.villa;
  const poster = hasImage(ctx, 'villa_viewer_poster') ? 'villa_viewer_poster' : 'villa_maqueta_iso';
  const rooms = v.rooms.map((r) => `<li><span>${ctx.esc(r[ctx.lang].name)}</span><span class="num">≈${ctx.esc(ctx.fmtNumber(r.area, 1))} m²</span></li>`).join('');
  return `<figure class="figure figure--stage"><div class="figure__media">${ctx.img(poster, { alt: ctx.t('hero.alt'), eager: true, sizes: '(min-width: 1024px) 56vw, 100vw' })}</div><figcaption>${ctx.esc(ctx.t('viewer.fallbackCaption'))}</figcaption></figure>`
    + `<div><h2>${ctx.esc(ctx.t('viewer.rooms'))}</h2><ol class="rooms" role="list">${rooms}</ol></div>`;
}

export default function render(ctx) {
  const p = ctx.page;
  let app;
  if (viewerModule && typeof viewerModule.renderViewerApp === 'function') {
    ctx.needs.add('viewer');
    const out = viewerModule.renderViewerApp(ctx, { id: 'visor', eager: true, bare: true, railLevel: 2 });
    app = typeof out === 'string' ? out : (out && out.html) || '';
  } else {
    app = viewerFallback(ctx);
  }
  const text = `<div class="hero__text">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.heroLead || p.lead)}</p>${heroActions(ctx, { service: 'maqueta', secondary: null })}</div>`;
  const hero = `<section class="hero hero--text hero--case" id="visor" aria-labelledby="titulo"><div class="wrap hero__grid">${text}<div class="hero__app">${app}</div></div></section>`;
  const { html } = standardPage(ctx, {
    hero,
    cta: { h2: ctx.t('cta_band.caseH2'), body: ctx.t('cta_band.caseBody'), service: 'maqueta' },
  });
  return { main: html, bodyClass: 'page-case' };
}
