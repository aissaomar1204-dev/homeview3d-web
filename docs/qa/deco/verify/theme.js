async page => {
  const out = [];
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'load' });
  const snap = async label => {
    const s = await page.evaluate(() => { const b = document.querySelector('[data-theme-toggle], .theme-toggle, button[aria-label*="tema" i], button[aria-label*="theme" i]'); const bg = getComputedStyle(document.querySelector('.main > [data-ch=w]') || document.body).backgroundColor; return { attr: document.documentElement.getAttribute('data-theme'), ls: (() => { try { return localStorage.getItem('hv-theme'); } catch (e) { return 'x'; } })(), btn: b ? (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 40) : null, whiteChapterBg: bg }; });
    out.push({ label, ...s });
  };
  await snap('first visit, OS=dark');
  const btn = await page.$('[data-theme-toggle], .theme-toggle, button[aria-label*="tema" i], button[aria-label*="theme" i]');
  if (!btn) return JSON.stringify({ err: 'no toggle', out });
  for (let i = 0; i < 4; i++) { await btn.click(); await page.waitForTimeout(150); await snap('click ' + (i + 1)); }
  await page.emulateMedia({ colorScheme: 'light' });
  return JSON.stringify(out);
}
