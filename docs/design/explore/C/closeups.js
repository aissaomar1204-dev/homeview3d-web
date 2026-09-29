async page => {
  const D = 'E:/ProyectosRealStateBlender/docs/design/explore/C/shots/';
  await page.setViewportSize({ width: 1440, height: 900 });
  const go = async (url) => { await page.goto('http://localhost:8903' + url); await page.waitForTimeout(700); };
  const to = async (sel, delta, name) => {
    // sections that were skipped (content-visibility) change height once rendered: approach, settle, re-measure, land
    const top = () => page.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
    await page.evaluate(y => window.scrollTo(0, y), Math.max(0, (await top()) + delta - 900));
    await page.waitForTimeout(700);
    await page.evaluate(y => window.scrollTo(0, y), Math.max(0, (await top()) + delta - 300));
    await page.waitForTimeout(700);
    await page.evaluate(y => window.scrollTo(0, y), Math.max(0, (await top()) + delta));
    await page.waitForTimeout(1600);
    await page.screenshot({ path: D + name + '.png' });
  };
  await go('/');
  await page.waitForTimeout(5500);
  await page.screenshot({ path: D + 'closeup-1-hero.png' });
  await to('.block--deliverables', -64, 'closeup-2-entregables');
  await to('.block--viewer', 90, 'closeup-3-visor');
  await to('.block--audiences', 380, 'closeup-4-audiencias');
  await to('.block--pricing', -64, 'closeup-5-precios');
  await to('.block--pricing', 640, 'closeup-6-precios-packs');
  await to('.block--form', -64, 'closeup-7-contacto');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: D + 'closeup-8-footer.png' });
  await go('/servicios/plano-2d-a-3d/');
  await page.waitForTimeout(800);
  await page.screenshot({ path: D + 'closeup-svc-1-hero.png' });
  await to('.ch--plate', -64, 'closeup-svc-2-plate');
  await to('.ch--stat', -64, 'closeup-svc-3-stat');
  await to('.block--cta', -64, 'closeup-svc-4-cta');
}
