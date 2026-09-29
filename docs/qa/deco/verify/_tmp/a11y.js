async page => {
  const pages = ["/","/404.html","/aviso-legal/","/casos/villa-costa-del-sol/","/como-funciona/","/contacto/","/en/","/en/3d-rendering-marbella/","/en/404.html","/en/about/","/en/augmented-reality-real-estate/","/en/case-studies/costa-del-sol-villa/","/en/contact/","/en/cookie-policy/","/en/faq/","/en/floor-plan-to-3d-model/","/en/for-estate-agents/","/en/glossary/","/en/guides/","/en/guides/3d-floor-plan-cost-spain/","/en/guides/3d-model-vs-matterport/","/en/guides/3d-rendering-cost-spain/","/en/guides/ai-floor-plan-to-3d/","/en/guides/best-3d-visualisation-studios-spain/","/en/guides/view-property-in-ar/","/en/how-it-works/","/en/interactive-3d-floor-plans/","/en/legal-notice/","/en/off-plan-3d-visualisation/","/en/pricing/","/en/privacy-policy/","/en/real-estate-3d-rendering/","/en/services/","/en/thanks/","/en/virtual-staging/","/glosario/","/gracias/","/guias/","/guias/como-convertir-un-plano-2d-en-3d/","/guias/como-vender-viviendas-sobre-plano/","/guias/cuanto-cuesta-un-plano-3d/","/guias/cuanto-cuesta-un-render-3d/","/guias/ia-o-modelo-3d-real/","/guias/mejores-estudios-visualizacion-3d-espana/","/guias/modelo-3d-vs-matterport/","/guias/ver-una-vivienda-en-realidad-aumentada/","/politica-de-cookies/","/politica-de-privacidad/","/precios/","/preguntas-frecuentes/","/servicios/","/servicios/home-staging-virtual/","/servicios/plano-2d-a-3d/","/servicios/realidad-aumentada-inmobiliaria/","/servicios/renders-inmobiliarios/","/servicios/tour-virtual-3d/","/sobre-nosotros/","/soluciones/","/soluciones/alquiler-vacacional/","/soluciones/arquitectos-interioristas/","/soluciones/inmobiliarias/","/soluciones/promotoras-obra-nueva/","/zonas/","/zonas/costa-del-sol/","/zonas/malaga/","/zonas/marbella/"];
  const res = [];
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const p of pages) {
    await page.goto('http://localhost:8913' + p, { waitUntil: 'load' });
    const r = await page.evaluate(() => {
      const out = [];
      const foc = 'a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';
      const fh = [...document.querySelectorAll('[aria-hidden="true"]')].flatMap(e => [...(e.matches(foc) ? [e] : []), ...e.querySelectorAll(foc)]).filter(e => !e.closest('.hs') && !e.disabled).map(e => e.tagName + '.' + String(e.className).split(' ')[0]);
      if (fh.length) out.push('focusable-in-aria-hidden: ' + [...new Set(fh)].slice(0, 5).join(','));
      const noalt = [...document.images].filter(i => !i.hasAttribute('alt')).map(i => (i.currentSrc || i.src).split('/').pop());
      if (noalt.length) out.push('img-no-alt: ' + noalt.slice(0, 3).join(','));
      const ids = {}; document.querySelectorAll('[id]').forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1; }); const dup = Object.keys(ids).filter(k => ids[k] > 1); if (dup.length) out.push('dup-ids: ' + dup.slice(0, 4).join(','));
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]; if (document.querySelectorAll('h1').length !== 1) out.push('h1 count ' + document.querySelectorAll('h1').length);
      let prev = 0; for (const h of hs) { const l = +h.tagName[1]; if (prev && l > prev + 1) { out.push('heading-jump h' + prev + '>h' + l + ' ' + h.textContent.trim().slice(0, 24)); break; } prev = l; }
      const unnamed = [...document.querySelectorAll('a[href],button')].filter(e => !(e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.textContent.trim() || e.querySelector('img[alt]:not([alt=""])'))).map(e => e.tagName + '.' + String(e.className).split(' ')[0]); if (unnamed.length) out.push('unnamed: ' + unnamed.slice(0, 3).join(','));
      const deco = [...document.querySelectorAll('.main > [data-ch] :is(.ch-ax,.hv-leg,.ch-bg)')].filter(e => e.getAttribute('aria-hidden') !== 'true').length; if (deco) out.push('deco-not-aria-hidden ' + deco);
      const secNoChap = [...document.querySelectorAll('.main > section')].filter(s => !s.dataset.ch).length; if (secNoChap && !/embed/.test(location.pathname)) out.push('section-without-data-ch ' + secNoChap);
      return out;
    });
    if (r.length) res.push({ p, r });
  }
  return JSON.stringify(res);
}