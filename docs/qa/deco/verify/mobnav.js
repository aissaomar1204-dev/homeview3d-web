async page => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const D = 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/shots/';
  // menu open
  const menuBtn = await page.$('.nav-toggle, button[aria-controls], [aria-label*="Menú" i], button:has-text("Menú")');
  if (menuBtn) { await menuBtn.click(); await page.waitForTimeout(500); await page.screenshot({ path: D + 'mob-nav-open-light.png' }); await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
  // scrolled over dark chapter (process) with bar
  await page.evaluate(() => { const el = document.querySelector('[data-ch=k][data-n]'); el && el.scrollIntoView({ block: 'start' }); window.scrollBy(0, 400); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: D + 'mob-dark-chapter-bar.png' });
  await page.evaluate(() => { document.querySelector('.block--pricing, [data-ch=c]').scrollIntoView({ block: 'start' }); window.scrollBy(0, 300); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: D + 'mob-cinema-bar.png' });
  // dark theme + nav
  await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); window.scrollTo(0, 0); });
  await page.waitForTimeout(300);
  if (menuBtn) { const mb = await page.$('.nav-toggle, button[aria-controls], [aria-label*="Menú" i], button:has-text("Menú")'); await mb.click(); await page.waitForTimeout(500); await page.screenshot({ path: D + 'mob-nav-open-dark.png' }); }
  return JSON.stringify({ hasMenu: !!menuBtn });
}
