async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: '__SCHEME__', reducedMotion: 'no-preference' });
  await page.goto('http://localhost:8914__URLP__', { waitUntil: 'load' });
  await page.evaluate(t => { try { localStorage.setItem('hv-theme', t); } catch (e) {} document.documentElement.setAttribute('data-theme', t); }, '__SCHEME__');
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const L = c => { const m = c.match(/[\d.]+/g).map(Number); return .2126 * lin(m[0]) + .7152 * lin(m[1]) + .0722 * lin(m[2]); };
    const out = []; let prev = null;
    for (const e of document.querySelectorAll('.main > [data-ch], .main > article[data-ch]')) {
      const bg = getComputedStyle(e).backgroundColor; const l = L(bg);
      out.push({ ch: e.dataset.ch, n: e.dataset.n || '', bg, ratio: prev == null ? null : +((Math.max(l, prev) + .05) / (Math.min(l, prev) + .05)).toFixed(3) });
      prev = l;
    }
    return out;
  });
  return JSON.stringify(r);
}
