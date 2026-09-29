async page => {
  const pages = ["/","/404.html","/ar/villa/","/aviso-legal/","/casos/villa-costa-del-sol/","/como-funciona/","/contacto/","/embed/villa/","/en/","/en/3d-rendering-marbella/","/en/404.html","/en/about/","/en/ar/villa/","/en/augmented-reality-real-estate/","/en/case-studies/costa-del-sol-villa/","/en/contact/","/en/cookie-policy/","/en/embed/villa/","/en/faq/","/en/floor-plan-to-3d-model/","/en/for-estate-agents/","/en/glossary/","/en/guides/","/en/guides/3d-floor-plan-cost-spain/","/en/guides/3d-model-vs-matterport/","/en/guides/3d-rendering-cost-spain/","/en/guides/ai-floor-plan-to-3d/","/en/guides/best-3d-visualisation-studios-spain/","/en/guides/view-property-in-ar/","/en/how-it-works/","/en/interactive-3d-floor-plans/","/en/legal-notice/","/en/off-plan-3d-visualisation/","/en/pricing/","/en/privacy-policy/","/en/real-estate-3d-rendering/","/en/services/","/en/thanks/","/en/virtual-staging/","/glosario/","/gracias/","/guias/","/guias/como-convertir-un-plano-2d-en-3d/","/guias/como-vender-viviendas-sobre-plano/","/guias/cuanto-cuesta-un-plano-3d/","/guias/cuanto-cuesta-un-render-3d/","/guias/ia-o-modelo-3d-real/","/guias/mejores-estudios-visualizacion-3d-espana/","/guias/modelo-3d-vs-matterport/","/guias/ver-una-vivienda-en-realidad-aumentada/","/politica-de-cookies/","/politica-de-privacidad/","/precios/","/preguntas-frecuentes/","/servicios/","/servicios/home-staging-virtual/","/servicios/plano-2d-a-3d/","/servicios/realidad-aumentada-inmobiliaria/","/servicios/renders-inmobiliarios/","/servicios/tour-virtual-3d/","/sobre-nosotros/","/soluciones/","/soluciones/alquiler-vacacional/","/soluciones/arquitectos-interioristas/","/soluciones/inmobiliarias/","/soluciones/promotoras-obra-nueva/","/zonas/","/zonas/costa-del-sol/","/zonas/malaga/","/zonas/marbella/"];
  const res = []; const seenOK = {};
  page.on('console', m => { if (['error','warning'].includes(m.type())) res.push({ t: m.type(), u: page.url(), m: m.text().slice(0, 240) }); });
  page.on('pageerror', e => res.push({ t: 'pageerror', u: page.url(), m: String(e).slice(0, 240) }));
  page.on('requestfailed', r => res.push({ t: 'reqfail', u: page.url(), m: r.url() + ' ' + (r.failure() && r.failure().errorText) }));
  page.on('response', r => { if (r.status() >= 400) res.push({ t: 'http' + r.status(), u: page.url(), m: r.url() }); });
  await page.addInitScript(() => { document.addEventListener('securitypolicyviolation', e => { console.error('CSP violation: ' + e.violatedDirective + ' ' + e.blockedURI); }); });
  for (const theme of ['light', 'dark']) {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const p of pages) {
      await page.goto('http://localhost:8913' + p, { waitUntil: 'load' });
      await page.evaluate(t => { document.documentElement.setAttribute('data-theme', t); }, theme);
      await page.evaluate(async () => { const sl = ms => new Promise(r => setTimeout(r, ms)); const h = () => document.documentElement.scrollHeight; for (let y = 0; y < h(); y += 700) { window.scrollTo(0, y); await sl(30); } window.scrollTo(0, 0); });
      await page.waitForTimeout(250);
    }
  }
  const uniq = {}; for (const r of res) { const k = r.t + '|' + r.m; if (!uniq[k]) uniq[k] = { ...r, n: 0 }; uniq[k].n++; }
  return JSON.stringify(Object.values(uniq));
}