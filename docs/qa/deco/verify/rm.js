async page => {
  const out = {};
  const reqs = [];
  page.on('request', r => { const u = r.url(); if (/hero|frame|\.avif|\.webp|\.svg|\.png/.test(u)) reqs.push(u.replace('http://localhost:8913', '')); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  out.rm = await page.evaluate(() => {
    const hs = document.querySelector('.hs'); const cv = document.querySelector('.hs canvas');
    const anims = document.getAnimations().map(a => (a.animationName || a.transitionProperty || a.constructor.name)).slice(0, 12);
    return { hsClass: hs && hs.className, canvasVisible: cv ? getComputedStyle(cv).opacity : null, runningAnims: anims.length, anims };
  });
  out.frameReqs = reqs.filter(u => /frame|hero-f|seq/i.test(u)).length;
  out.allImgReqsAtLoad = reqs.length;
  await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/hero/reduced-motion-1440.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  // CSS animation/transition durations sanity across the page (any decoration animating with reduced motion)
  out.animatedEls = await page.evaluate(() => { const r = []; for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); if ((cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0.05) ) r.push(el.tagName + '.' + String(el.className).split(' ')[0] + ':' + cs.animationName); } return r.slice(0, 10); });
  // forced colors
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'no-preference', colorScheme: 'light' });
  await page.goto('http://localhost:8913/', { waitUntil: 'load' });
  await page.addStyleTag({ content: 'section,footer{content-visibility:visible !important;contain-intrinsic-size:none !important}' });
  await page.evaluate(async () => { const sl = ms => new Promise(r => setTimeout(r, ms)); document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; }); const h = () => document.documentElement.scrollHeight; for (let y = 0; y < h(); y += 600) { window.scrollTo(0, y); await sl(60); } window.scrollTo(0, 0); await sl(400); });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  out.fcH = H;
  let n = 0; for (let y = 0; y < Math.min(H, 18000); y += 6000) { await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/_tmp/fc-' + (n++) + '.png', fullPage: true, clip: { x: 0, y, width: 1440, height: Math.min(6000, H - y) } }); }
  return JSON.stringify(out);
}
