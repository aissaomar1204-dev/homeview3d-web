async page => {
  const out = [];
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    for (const p of ['/', '/servicios/plano-2d-a-3d/', '/precios/']) {
      await page.setViewportSize({ width: w, height: h });
      const reqs = [];
      const onReq = r => reqs.push(r.url().replace('http://localhost:8913', ''));
      page.on('request', onReq);
      await page.addInitScript(() => { window.__cls = 0; window.__shifts = []; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; window.__shifts.push([Math.round(e.value * 1000) / 1000, (e.sources || []).map(s => s.node && (s.node.nodeName + '.' + String(s.node.className).split(' ')[0])).join(',')]); } }).observe({ type: 'layout-shift', buffered: true }); });
      await page.goto('http://localhost:8913' + p, { waitUntil: 'load' });
      await page.waitForTimeout(1500);
      const atLoad = reqs.filter(u => /\.(avif|webp|png|jpg|svg)/.test(u) && !/hero-frames|hero\//.test(u)).map(u => u.split('/').pop());
      const frames = reqs.filter(u => /hero/.test(u)).length;
      // scroll slowly to the end like a person
      await page.evaluate(async () => { const sl = ms => new Promise(r => setTimeout(r, ms)); const h = () => document.documentElement.scrollHeight; for (let y = 0; y < h(); y += 300) { window.scrollTo(0, y); await sl(60); } await sl(500); });
      const cls = await page.evaluate(() => ({ cls: Math.round(window.__cls * 1000) / 1000, shifts: window.__shifts.slice(0, 5) }));
      const allDeco = reqs.filter(u => /deco\//.test(u)).map(u => u.split('/').pop());
      out.push({ w, p, imgsAtLoad: atLoad, heroReqs: frames, deco: [...new Set(allDeco)], ...cls });
      page.off('request', onReq);
    }
  }
  return JSON.stringify(out);
}
