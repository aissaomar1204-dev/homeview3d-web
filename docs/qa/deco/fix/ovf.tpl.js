async page => {
  const out = [];
  for (const [w, url] of [[1024, '/'], [1440, '/'], [1920, '/'], [390, '/'], [1440, '/servicios/renders-inmobiliarios/'], [1920, '/preguntas-frecuentes/'], [1280, '/precios/']]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
    await page.goto('http://localhost:8914' + url, { waitUntil: 'load' });
    await page.addStyleTag({ content: 'section,footer,.main>*{content-visibility:visible !important;contain-intrinsic-size:none !important}' });
    await page.waitForTimeout(800);
    out.push(await page.evaluate(([w, url]) => ({ w, url, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }), [w, url]));
  }
  return JSON.stringify(out);
}
