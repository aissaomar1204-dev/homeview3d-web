async page => {
  const out = [];
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  for (const theme of ['light', 'dark']) {
    await page.goto('http://localhost:8913/', { waitUntil: 'load' });
    await page.evaluate(t => { try { localStorage.setItem('hv-theme', t); } catch (e) {} document.documentElement.setAttribute('data-theme', t); }, theme);
    await page.addStyleTag({ content: 'section,footer{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}' });
    await page.waitForTimeout(800);
    await page.keyboard.press('Tab');
    const sels = [
      ['header-cta', '.site-header .btn'],
      ['datos-none', null],
      ['deliv-link', '.block--bento a, .bento a'],
      ['process-link', '[data-ch=k] .block__intro a'],
      ['audience-card-large', '.index--n4 a, .index a'],
      ['pack-link', '.pack:not(.pack--featured) a'],
      ['pack-featured-btn', '.pack--featured a'],
      ['calc-plus', '.calc__widget button'],
      ['faq-summary', '.faq__item summary'],
      ['form-radio', '.choice input'],
      ['form-input', '#contacto input[type=text], #contacto input:not([type=radio])'],
      ['footer-link', '.site-footer nav a'],
    ];
    for (const [name, sel] of sels) {
      if (!sel) continue;
      const h = (await page.evaluateHandle(sel => [...document.querySelectorAll(sel)].find(e => { const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 && getComputedStyle(e).visibility !== 'hidden'; }) || null, sel)).asElement();
      if (!h) { out.push({ theme, name, missing: true }); continue; }
      await h.evaluate(el => el.scrollIntoView({block:"center"}));
      await page.evaluate(el => el.focus({ focusVisible: true }), h);
      await page.waitForTimeout(120);
      const info = await h.evaluate(el => {
        const cs = getComputedStyle(el);
        return { outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor + ' off ' + cs.outlineOffset, fv: el.matches(':focus-visible'), tag: el.tagName + '.' + String(el.className).split(' ')[0] };
      });
      const box = await h.boundingBox();
      const clip = box ? { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 24), width: Math.min(1440, box.width + 48), height: box.height + 48 } : undefined;
      if (clip) await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/focus/' + theme + '-' + name + '.png', clip });
      out.push({ theme, name, ...info });
    }
  }
  return JSON.stringify(out);
}
