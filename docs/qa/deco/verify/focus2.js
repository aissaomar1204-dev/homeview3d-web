async page => {
  const out = [];
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const theme of ['light', 'dark']) {
    await page.goto('http://localhost:8913/', { waitUntil: 'load' });
    await page.evaluate(t => { try { localStorage.setItem('hv-theme', t); } catch (e) {} document.documentElement.setAttribute('data-theme', t); }, theme);
    await page.addStyleTag({ content: 'section,footer{content-visibility:visible !important;contain-intrinsic-size:none !important}html{scroll-behavior:auto !important}' });
    await page.waitForTimeout(700);
    await page.keyboard.press('Tab');
    const sels = [['card-large', '.index__item--media a', '.index__item--media'], ['card-small', '.index__item--media:nth-child(2) a', '.index__item--media:nth-child(2)'], ['lamina', '.bento__cell a', '.bento__cell'], ['radio', '.choice input', '.choice']];
    for (const [name, sel, parentSel] of sels) {
      const ok = await page.evaluate(([sel]) => { const e = [...document.querySelectorAll(sel)].find(e => e.getBoundingClientRect().width > 0 || e.closest('.choice')); if (!e) return false; e.scrollIntoView({ block: 'center' }); e.focus({ focusVisible: true }); return true; }, [sel]);
      await page.waitForTimeout(150);
      const info = await page.evaluate(([sel, parentSel]) => { const e = document.activeElement; const p = e.closest(parentSel) || e; const cs = getComputedStyle(p); return { p: p.className, outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor + ' off ' + cs.outlineOffset }; }, [sel, parentSel]);
      const box = await page.evaluate(([parentSel]) => { const e = document.activeElement.closest(parentSel) || document.activeElement; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, [parentSel]);
      const clip = { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: Math.min(1440 - Math.max(0, box.x - 20), box.w + 40), height: Math.min(900 - Math.max(0, box.y - 20), box.h + 40) };
      await page.screenshot({ path: 'E:/ProyectosRealStateBlender/docs/qa/deco/verify/focus/v2-' + theme + '-' + name + '.png', clip });
      out.push({ theme, name, ok, ...info });
    }
  }
  return JSON.stringify(out);
}
