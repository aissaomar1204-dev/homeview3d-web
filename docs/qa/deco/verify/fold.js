async page => {
  const D = 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/shots/';
  for (const [w, h] of [[1366, 768], [1280, 720], [1536, 864]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference', forcedColors: 'none' });
    await page.goto('http://localhost:8913/', { waitUntil: 'load' });
    await page.evaluate(() => { try { localStorage.setItem('hv-theme', 'light'); } catch (e) {} document.documentElement.setAttribute('data-theme', 'light'); });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: D + 'fold-' + w + 'x' + h + '.png' });
  }
  return 'ok';
}
