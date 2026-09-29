async page => {
  const out = [];
  const client = await page.context().newCDPSession(page);
  for (const [w, h, rate] of [[1440, 900, 1], [1440, 900, 4], [390, 844, 4]]) {
    await page.setViewportSize({ width: w, height: h });
    await client.send('Emulation.setCPUThrottlingRate', { rate });
    for (const p of ['/', '/servicios/plano-2d-a-3d/', '/precios/']) {
      await page.goto('http://localhost:8913' + p, { waitUntil: 'load' });
      await page.evaluate(() => { try { localStorage.setItem('hv-theme', 'light'); } catch (e) {} document.documentElement.setAttribute('data-theme', 'light'); });
      await page.waitForTimeout(4500);
      const r = await page.evaluate(async () => {
        const H = document.documentElement.scrollHeight - innerHeight;
        const deltas = []; let last = performance.now(); let y = 0; const step = 40;
        await new Promise(res => { function tick(t) { deltas.push(t - last); last = t; y += step; window.scrollTo(0, y); if (y < H) requestAnimationFrame(tick); else res(); } requestAnimationFrame(tick); });
        deltas.shift();
        const sorted = [...deltas].sort((a, b) => a - b);
        return { frames: deltas.length, avg: Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length * 10) / 10, p95: Math.round(sorted[Math.floor(sorted.length * 0.95)] * 10) / 10, worst: Math.round(sorted[sorted.length - 1]), over50: deltas.filter(d => d > 50).length, over100: deltas.filter(d => d > 100).length, H };
      });
      out.push({ w, rate, p, ...r });
    }
  }
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  return JSON.stringify(out);
}
