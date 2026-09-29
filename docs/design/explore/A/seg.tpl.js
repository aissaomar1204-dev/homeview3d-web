async page => {
  const dims = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.clientWidth }));
  const STEP = 6000; let n = 0;
  for (let y = 0; y < dims.h; y += STEP) {
    const h = Math.min(STEP, dims.h - y);
    await page.screenshot({ path: '__DIR__/seg-' + String(n++).padStart(2, '0') + '.png', fullPage: true, clip: { x: 0, y, width: dims.w, height: h } });
  }
  return JSON.stringify({ n, ...dims });
}
