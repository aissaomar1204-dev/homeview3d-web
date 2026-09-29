async page => {
  const D = 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/shots/';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ forcedColors: 'active', colorScheme: 'dark', reducedMotion: 'no-preference' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.setItem('hv-theme', 'light'); } catch (e) {} document.documentElement.setAttribute('data-theme', 'light'); });
  await page.addStyleTag({ content: '@media (forced-colors: active){ .main > [data-ch], .site-footer, .dateline-wrap { background-image: none !important } .hv-logo { fill: CanvasText } .hv-a { fill: Highlight } }' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: D + 'fcfix-top.png', clip: { x: 0, y: 0, width: 1440, height: 120 } });
  await page.evaluate(() => { const el = document.querySelector('.cajetin-band, [data-ch=k]'); el && el.scrollIntoView({ block: 'start' }); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: D + 'fcfix-strip.png', clip: { x: 0, y: 0, width: 1440, height: 500 } });
  await page.emulateMedia({ forcedColors: 'none', colorScheme: 'light' });
  return 'ok';
}
