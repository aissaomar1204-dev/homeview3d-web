async page => {
  const [W, H, URL, OUT, THEME] = ['__W__', '__H__', '__URL__', '__OUT__', '__THEME__'];
  await page.setViewportSize({ width: +W, height: +H });
  await page.goto(URL);
  if (THEME !== 'light') { await page.evaluate(t => { document.documentElement.dataset.theme = t; }, THEME); }
  await page.addStyleTag({ content: '.main > section, .main > *, .ch__d{content-visibility:visible !important}' });
  await page.waitForTimeout(500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  const items = await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.nodeValue.trim();
      if (t.length < 2) continue;
      const el = n.parentElement;
      if (!el || el.closest('script,style,noscript,[hidden],.sr-only,dialog,model-viewer,svg,canvas,[aria-hidden="true"]')) continue;
      const dt = el.closest('details:not([open])'); if (dt && !el.closest('summary')) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      const rs = [...rg.getClientRects()].filter(r => r.width > 3 && r.height > 3);
      if (!rs.length) continue;
      const x0 = Math.min(...rs.map(r => r.left)), y0 = Math.min(...rs.map(r => r.top)), x1 = Math.max(...rs.map(r => r.right)), y1 = Math.max(...rs.map(r => r.bottom));
      const sec = el.closest('section,header,footer,.dateline-wrap');
      out.push({ t: t.slice(0, 48), x: x0, y: y0 + scrollY, w: x1 - x0, h: y1 - y0, c: cs.color, fs: parseFloat(cs.fontSize), fw: +cs.fontWeight, s: sec ? (sec.className || sec.tagName).toString().split(' ').filter(c => /^ch--|^block--|site-/.test(c)).join('.') : '' });
    }
    return out;
  });
  await page.addStyleTag({ content: '*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;text-decoration-color:transparent!important;caret-color:transparent!important} ::placeholder{color:transparent!important}' });
  await page.waitForTimeout(300);
  const total = await page.evaluate(() => document.documentElement.scrollHeight); const vw = await page.evaluate(() => document.documentElement.clientWidth); let i = 0;
  for (let y = 0; y < total; y += 8000) await page.screenshot({ path: OUT + '.part' + (i++) + '.png', fullPage: true, clip: { x: 0, y, width: vw, height: Math.min(8000, total - y) } });
  return JSON.stringify(items);
}
