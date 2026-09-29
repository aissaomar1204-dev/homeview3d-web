async page => {
  const out = {};
  for (const w of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
    await page.goto('http://localhost:8914__URLP__', { waitUntil: 'load' });
    await page.addStyleTag({ content: 'section,footer,.main>*{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}' });
    await page.waitForTimeout(1200);
    out[w] = await page.evaluate(() => {
      const sec = document.querySelector('.main > [data-ch]:has(.calc__widget)');
      const s = getComputedStyle(sec, '::before'); const r = sec.getBoundingClientRect();
      const wd = sec.querySelector('.calc__widget'); const wr = wd.getBoundingClientRect();
      const fs = parseFloat(s.fontSize); const top = parseFloat(s.top);
      const y0 = r.top + scrollY;
      return { n: sec.dataset.n, secTop: Math.round(y0), fs: Math.round(fs), numTop: Math.round(top), boxBottom: Math.round(top + fs * .8), glyphBottomEst: Math.round(top + fs * .734), widgetTop: Math.round(wr.top + scrollY - y0), widgetMargin: getComputedStyle(wd).marginTop, pos: getComputedStyle(wd).position };
    });
  }
  return JSON.stringify(out);
}
