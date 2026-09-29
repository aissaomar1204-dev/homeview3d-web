async page => {
  const pages = ['/', '/servicios/plano-2d-a-3d/', '/precios/', '/contacto/', '/preguntas-frecuentes/', '/casos/villa-costa-del-sol/', '/soluciones/promotoras-obra-nueva/', '/zonas/marbella/', '/como-funciona/', '/servicios/', '/soluciones/', '/sobre-nosotros/', '/servicios/realidad-aumentada-inmobiliaria/', '/servicios/tour-virtual-3d/', '/en/'];
  const res = [];
  for (const w of [1024, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const p of pages) {
      await page.goto('http://localhost:8913' + p, { waitUntil: 'load' });
      await page.addStyleTag({ content: 'section,footer{content-visibility:visible !important;contain-intrinsic-size:none !important}' });
      await page.evaluate(async () => { const sl = ms => new Promise(r => setTimeout(r, ms)); document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; }); const h = () => document.documentElement.scrollHeight; for (let y = 0; y < h(); y += 800) { window.scrollTo(0, y); await sl(30); } window.scrollTo(0, 0); await sl(300); });
      const r = await page.evaluate(() => {
        const out = [];
        for (const sec of document.querySelectorAll('.main > [data-n]')) {
          const cs = getComputedStyle(sec, '::before'); if (!cs.content || cs.content === 'none') continue; if (cs.display === 'none') continue;
          const sr = sec.getBoundingClientRect(); const fs = parseFloat(cs.fontSize); const n = sec.dataset.n.length;
          const right = sr.right - parseFloat(cs.right); const width = n * fs * 0.78 + fs * 0.1; const left = right - width;
          const top = sr.top + scrollY + parseFloat(cs.top); const bottom = top + fs * 0.8;
          for (const el of sec.querySelectorAll('.wrap *')) {
            if (el.closest('[aria-hidden=true]')) continue;
            const c = getComputedStyle(el); if (c.visibility === 'hidden' || c.display === 'none') continue;
            const hasText = [...el.childNodes].some(nd => nd.nodeType === 3 && nd.nodeValue.trim().length > 0);
            const opaque = c.backgroundColor !== 'rgba(0, 0, 0, 0)' && !c.backgroundColor.endsWith(', 0)');
            const isImg = el.tagName === 'IMG' || el.tagName === 'CANVAS';
            if (!hasText && !opaque && !isImg) continue;
            const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
            const t = r.top + scrollY; const b = t + r.height;
            const ix = Math.min(right, r.right) - Math.max(left, r.left); const iy = Math.min(bottom, b) - Math.max(top, t);
            if (ix > 6 && iy > 6) { out.push({ ch: sec.dataset.ch, n: sec.dataset.n, l: sec.dataset.l, el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0], hasText, opaque, ix: Math.round(ix), iy: Math.round(iy), txt: (el.textContent || '').trim().slice(0, 24) }); break; }
          }
        }
        return out;
      });
      if (r.length) res.push({ w, p, r });
    }
  }
  return JSON.stringify(res);
}
