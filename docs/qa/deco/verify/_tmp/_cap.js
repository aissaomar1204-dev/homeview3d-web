async page => {
  const sleep = ms => page.waitForTimeout(ms);
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.evaluate(t => { try { localStorage.setItem('hv-theme', t); } catch (e) {} document.documentElement.setAttribute('data-theme', t); }, 'light');
  await sleep(4500);
  await page.evaluate(async () => {
    const sl = ms => new Promise(r => setTimeout(r, ms));
    const st = document.createElement('style');
    st.textContent = '.main > section,footer,section{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}';
    document.head.appendChild(st);
    document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; });
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += 500) { window.scrollTo(0, y); await sl(70); }
    window.scrollTo(0, h()); await sl(300);
    document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in'));
    await Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 6000); })));
    await sl(400);
    window.scrollTo(0, 0); await sl(300);
  });
  const dims = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth }));
  const STEP = 6000; let n = 0;
  for (let y = 0; y < dims.h; y += STEP) {
    const hh = Math.min(STEP, dims.h - y);
    await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/_tmp/seg/seg-' + String(n++).padStart(2, '0') + '.png', fullPage: true, clip: { x: 0, y, width: dims.w, height: hh } });
  }
  return JSON.stringify({ n, ...dims });
}
