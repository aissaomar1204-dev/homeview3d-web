async page => {
  const D = 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/';
  const res = [];
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [scheme, label] of [['light', 'fc-light'], ['dark', 'fc-dark']]) {
    await page.emulateMedia({ forcedColors: 'active', colorScheme: scheme, reducedMotion: 'no-preference' });
    await page.goto('http://localhost:8913/', { waitUntil: 'load' });
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: D + 'shots/' + label + '-top.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
    const info = await page.evaluate(() => { const l = document.querySelector('.hv-logo'); const cs = getComputedStyle(l); const hdr = getComputedStyle(document.querySelector('.site-header')); return { theme: document.documentElement.getAttribute('data-theme'), fill: cs.fill, headerBg: hdr.backgroundColor, headerColor: hdr.color }; });
    // scroll to strip + process
    await page.evaluate(() => { const el = document.querySelector('.cajetin-band, [data-ch=k]'); el && el.scrollIntoView({ block: 'start' }); });
    await page.waitForTimeout(500);
    await page.screenshot({ path: D + 'shots/' + label + '-strip.png' });
    res.push({ scheme, ...info });
  }
  await page.emulateMedia({ forcedColors: 'none', colorScheme: 'light' });
  return JSON.stringify(res);
}
