async page => {
  await page.setViewportSize({ width: __W__, height: 900 });
  await page.emulateMedia({ colorScheme: '__SCHEME__', reducedMotion: 'no-preference', forcedColors: '__FC__' });
  await page.goto('http://localhost:8914__PATH__', { waitUntil: 'load' });
  await page.evaluate(t => { try { localStorage.setItem('hv-theme', t); } catch (e) {} document.documentElement.setAttribute('data-theme', t); }, '__SCHEME__');
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => { const s = [...document.querySelectorAll('.main > [data-ch]')].map(e => ({ch:e.dataset.ch, bg:getComputedStyle(e).backgroundColor, top: Math.round(e.getBoundingClientRect().top+scrollY), h: Math.round(e.offsetHeight)})); return s; });
  return JSON.stringify(r);
}
