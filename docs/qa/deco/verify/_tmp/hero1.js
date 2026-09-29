async page => {
  const errs = [];
  page.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text().slice(0, 300)); });
  page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 300)));
  page.on('requestfailed', r => errs.push('reqfailed: ' + r.url() + ' ' + (r.failure() && r.failure().errorText)));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  const t0 = Date.now();
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  const shots = [0, 1200, 2500, 3800, 5500];
  for (const t of shots) {
    const el = Date.now() - t0;
    if (t > el) await page.waitForTimeout(t - el);
    await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/hero/desk-light-t' + String(t).padStart(4, '0') + '.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  }
  const info = await page.evaluate(() => {
    const c = document.querySelector('.hs canvas, canvas');
    return { canvas: !!c, cw: c && c.width, ch: c && c.height, hsClass: (document.querySelector('.hs')||{}).className, still: !!document.querySelector('.hs__still'), rail: [...document.querySelectorAll('.hs__rail button, .hs [role=tab], .hs__phase')].map(b => b.textContent.trim().slice(0,20)), scrollW: document.documentElement.scrollWidth, cw2: document.documentElement.clientWidth };
  });
  return JSON.stringify({ errs, info });
}
