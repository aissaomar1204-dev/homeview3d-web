async page => {
  const errs = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 200)));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference', forcedColors: 'none' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.setItem('hv-theme', 'light'); } catch (e) {} document.documentElement.setAttribute('data-theme', 'light'); });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.getElementById('demo').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(700);
  const btn = await page.$('#demo button:has-text("Ver la villa en 3D"), #demo .btn');
  if (!btn) return JSON.stringify({ err: 'no button' });
  await btn.click();
  await page.waitForTimeout(9000);
  const st = await page.evaluate(() => { const mv = document.querySelector('model-viewer'); return { mv: !!mv, loaded: mv ? mv.loaded : null, cls: (document.querySelector('#demo .vw, #demo [class*=vw]') || {}).className }; });
  await page.evaluate(() => document.getElementById('demo').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/shots/viewer-live-1440.png' });
  return JSON.stringify({ st, errs });
}
