async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.goto('http://localhost:8914/', { waitUntil: 'load' });
  await page.addStyleTag({ content: 'section,footer,.main>*{content-visibility:visible !important;contain-intrinsic-size:none !important}' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const ax = document.querySelector('.block--compare .ch-ax');
    if (!ax) return 'no ax';
    const s = document.querySelector('.block--compare'); const sr = s.getBoundingClientRect();
    const bs = [...ax.querySelectorAll('b')].map(b => { const r = b.getBoundingClientRect(); const cs = getComputedStyle(b); return { t: b.textContent, x: Math.round(r.x), y: Math.round(r.y - sr.y), w: r.width, color: cs.color, bg: cs.backgroundColor, disp: cs.display }; });
    return JSON.stringify({ axRect: ax.getBoundingClientRect().toJSON(), secTop: sr.y, bs });
  });
  return typeof r === 'string' ? r : JSON.stringify(r);
}
