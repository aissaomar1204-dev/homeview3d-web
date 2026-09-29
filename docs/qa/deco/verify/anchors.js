async page => {
  const out = [];
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto('http://localhost:8913/', { waitUntil: 'load' });
    await page.evaluate(() => { try { localStorage.setItem('hv-theme', 'light'); } catch (e) {} document.documentElement.setAttribute('data-theme', 'light'); });
    await page.waitForTimeout(600);
    const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#"], a[href^="/#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1))]);
    for (const href of links) {
      await page.goto('http://localhost:8913/', { waitUntil: 'load' });
      await page.waitForTimeout(300);
      const id = href.replace(/^\/?#/, '');
      await page.evaluate(hh => { const a = [...document.querySelectorAll('a')].find(x => x.getAttribute('href') === hh && x.getBoundingClientRect().width > 0); if (a) a.click(); else location.hash = hh; }, href);
      await page.waitForTimeout(900);
      const r = await page.evaluate(id => { const el = document.getElementById(id); if (!el) return { id, missing: true }; const b = el.getBoundingClientRect(); const hdr = document.querySelector('.site-header'); return { id, targetTop: Math.round(b.top), headerH: hdr ? Math.round(hdr.getBoundingClientRect().height) : null, scrollY: Math.round(scrollY), tag: el.tagName }; }, id);
      out.push({ w, href, ...r });
    }
  }
  return JSON.stringify(out);
}
