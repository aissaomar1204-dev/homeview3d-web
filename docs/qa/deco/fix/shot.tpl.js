async page => {
  const H = +'__W__' < 700 ? 844 : 900;
  await page.setViewportSize({ width: +'__W__', height: H });
  await page.emulateMedia({ colorScheme: '__SYS__', reducedMotion: 'no-preference', forcedColors: '__FC__' });
  await page.goto('http://localhost:8914__URLP__', { waitUntil: 'load' });
  await page.evaluate(t => { try { localStorage.setItem('hv-theme', t); } catch (e) {} document.documentElement.setAttribute('data-theme', t); }, '__SCHEME__');
  await page.addStyleTag({ content: 'section,footer,.main>*{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}' });
  await page.addStyleTag({ content: `__CSS__` });
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    const sl = ms => new Promise(r => setTimeout(r, ms));
    document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; });
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += 450) { window.scrollTo(0, y); await sl(70); }
    window.scrollTo(0, h()); await sl(300);
    document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in'));
    await Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 6000); })));
    window.scrollTo(0, 0); await sl(400);
  });
  const el = page.locator('__SEL__').nth(+'__NTH__');
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await el.screenshot({ path: '__OUT__', type: 'jpeg', quality: 80 });
  return JSON.stringify({ ok: 1 });
}
