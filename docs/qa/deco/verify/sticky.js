async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', forcedColors: 'none' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.setItem('hv-theme', 'light'); } catch (e) {} document.documentElement.setAttribute('data-theme', 'light'); });
  await page.addStyleTag({ content: 'section,footer{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(500);
  const samples = [];
  const secTop = await page.evaluate(() => { const s = document.querySelector('.main > [data-ch=k][data-n="03"]'); return s.getBoundingClientRect().top + scrollY; });
  for (const dy of [0, 300, 600, 900, 1200, 1500]) {
    await page.evaluate(y => window.scrollTo(0, y), secTop + dy);
    await page.waitForTimeout(150);
    const r = await page.evaluate(() => { const d = document.querySelector('.process__drawing'); const b = d.getBoundingClientRect(); const s = document.querySelector('.main > [data-ch=k][data-n="03"]').getBoundingClientRect(); return { figTop: Math.round(b.top), figBottom: Math.round(b.bottom), secTop: Math.round(s.top), secBottom: Math.round(s.bottom) }; });
    samples.push({ dy, ...r });
  }
  await page.evaluate(y => window.scrollTo(0, y), secTop + 900);
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/shots/process-sticky-scrolled.png' });
  return JSON.stringify(samples);
}
