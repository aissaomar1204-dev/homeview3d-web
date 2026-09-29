#!/bin/bash
# usage: shot.sh <out.png|jpg> [url]   (session exploreC, viewport already set)
# Full page in 8000 px chunks (one Chromium capture wraps above 16384 px), joined with stitch.mjs.
OUT="$1"; URL="$2"
ROOT=/e/ProyectosRealStateBlender; WROOT=E:/ProyectosRealStateBlender
if [ -n "$URL" ]; then playwright-cli -s=exploreC goto "$URL" >/dev/null 2>&1; fi
cat > $ROOT/docs/design/explore/C/.shot-run.js <<JS
async page => {
  await page.addStyleTag({content:'.main > section, .main > *, .ch__d{content-visibility:visible !important}'});
  await page.waitForTimeout(600);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(140); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vw = await page.evaluate(() => document.documentElement.clientWidth);
  let i = 0;
  for (let y = 0; y < total; y += 8000) {
    await page.screenshot({ path: '$WROOT/$OUT.part' + (i++) + '.png', fullPage: true, clip: { x: 0, y, width: vw, height: Math.min(8000, total - y) } });
  }
}
JS
playwright-cli -s=exploreC run-code --filename=$ROOT/docs/design/explore/C/.shot-run.js 2>&1 | grep -iE "error"
node $ROOT/docs/design/explore/C/stitch.mjs $ROOT/$OUT
