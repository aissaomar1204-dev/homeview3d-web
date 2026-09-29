async page => {
  const [W, H, URL, OUT, THEME] = ['__W__', '__H__', '__URL__', '__OUT__', '__THEME__'];
  await page.setViewportSize({ width: +W, height: +H });
  await page.emulateMedia({ colorScheme: THEME, reducedMotion: 'no-preference' });
  await page.goto(URL, { waitUntil: 'load' });
  await page.evaluate(t => { try { localStorage.setItem('hv-theme', t); } catch (e) {} document.documentElement.setAttribute('data-theme', t); }, THEME);
  await page.addStyleTag({ content: 'section,footer,.main>*{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(3500);
  await page.evaluate(async () => {
    const sl = ms => new Promise(r => setTimeout(r, ms));
    document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; });
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += 450) { window.scrollTo(0, y); await sl(80); }
    window.scrollTo(0, h()); await sl(300);
    document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in'));
    await Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 6000); })));
    window.scrollTo(0, 0); await sl(500);
  });
  const items = await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.nodeValue.trim();
      if (t.length < 1) continue;
      const el = n.parentElement;
      if (!el || el.closest('script,style,noscript,[hidden],.sr-only,dialog,model-viewer,svg,canvas,.visually-hidden')) continue;
      const dt = el.closest('details:not([open])'); if (dt && !el.closest('summary')) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      let op = 1; for (let e = el; e; e = e.parentElement) { op *= +getComputedStyle(e).opacity; }
      if (op < 0.05) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      const rs = [...rg.getClientRects()].filter(r => r.width > 3 && r.height > 3);
      if (!rs.length) continue;
      const x0 = Math.min(...rs.map(r => r.left)), y0 = Math.min(...rs.map(r => r.top)), x1 = Math.max(...rs.map(r => r.right)), y1 = Math.max(...rs.map(r => r.bottom));
      const sec = el.closest('section,header,footer,article,.dateline-wrap');
      out.push({ t: t.slice(0, 48), x: x0, y: y0 + scrollY, w: x1 - x0, h: y1 - y0, c: cs.color, fs: parseFloat(cs.fontSize), fw: +cs.fontWeight, op, aria: !!el.closest('[aria-hidden="true"]'), s: sec ? ((sec.dataset && sec.dataset.ch ? 'ch=' + sec.dataset.ch + ' ' : '') + (sec.className || sec.tagName)).toString().split(' ').slice(0, 3).join('.') : '' });
    }
    for (const sec of document.querySelectorAll('.main > [data-n]')) {
      const r = sec.getBoundingClientRect();
      const a = getComputedStyle(sec, '::after');
      if (a.content && a.content !== 'none') { const fs = parseFloat(a.fontSize); const txt = (sec.dataset.n + '  ' + sec.dataset.l); out.push({ t: '[idx] ' + txt, x: r.left + parseFloat(a.left), y: r.top + scrollY + parseFloat(a.top), w: txt.length * (fs * 0.62 + fs * 0.09), h: fs, c: a.color, fs, fw: +a.fontWeight, op: 1, aria: true, gen: true, s: 'ch=' + sec.dataset.ch }); }
      const wr = sec.querySelector(':scope > .wrap');
      if (wr) { const b = getComputedStyle(wr, '::before'); if (b.content && b.content !== 'none' && wr.dataset.s) { const wrr = wr.getBoundingClientRect(); const fs = parseFloat(b.fontSize); const txt = wr.dataset.s; const w = txt.length * (fs * 0.62 + fs * 0.09); out.push({ t: '[sheet] ' + txt, x: wrr.right - parseFloat(b.right) - w, y: wrr.top + scrollY + parseFloat(b.top), w, h: fs, c: b.color, fs, fw: +b.fontWeight, op: 1, aria: true, gen: true, s: 'ch=' + sec.dataset.ch }); } }
    }
    return out;
  });
  await page.addStyleTag({ content: '*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;text-decoration-color:transparent!important;caret-color:transparent!important} ::placeholder{color:transparent!important} .main>[data-n]::before{-webkit-text-stroke:0 !important}' });
  await page.waitForTimeout(400);
  const total = await page.evaluate(() => document.documentElement.scrollHeight); const vw = await page.evaluate(() => document.documentElement.clientWidth); let i = 0;
  for (let y = 0; y < total; y += 6000) await page.screenshot({ path: OUT + '.part' + String(i++).padStart(2, '0') + '.png', fullPage: true, clip: { x: 0, y, width: vw, height: Math.min(6000, total - y) } });
  return JSON.stringify(items);
}
