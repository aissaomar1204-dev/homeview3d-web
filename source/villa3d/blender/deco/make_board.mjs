// make_board.mjs - preview board of every deco asset, on paper and on graphite.
//   node make_board.mjs            -> board.html (here) + ../../../../docs/design/deco/board.png
//   node make_board.mjs --html     -> board.html only
// Uses the real files from public/assets/deco (SVGs inlined so currentColor works) and playwright-cli
// (session "deco") for the screenshot.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
const execP = promisify(exec);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(HERE, '../../../../public/assets/deco');
const DOCS = path.resolve(HERE, '../../../../docs/design/deco');
const rel = (f) => path.relative(HERE, path.join(ASSETS, f)).replaceAll('\\', '/');

const items = [
  { id: 'iso', file: 'villa-iso-lines.svg', label: 'villa-iso-lines.svg', note: 'hero camera, walls cut at 1.15 m', span: 1 },
  { id: 'axo', file: 'villa-axo-exploded.svg', label: 'villa-axo-exploded.svg', note: 'floors / walls / furniture, guides', span: 1 },
  { id: 'plan', file: 'villa-plan-lines.svg', label: 'villa-plan-lines.svg', note: 'plan, poche walls, door swings', span: 1 },
  { id: 'section', file: 'villa-section.svg', label: 'villa-section.svg', note: 'cross section A-A through terrace and salon', span: 2 },
  { id: 'long', file: 'villa-section-long.svg', label: 'villa-section-long.svg', note: 'longitudinal section B-B', span: 2 },
];

const kb = (f) => (fs.statSync(path.join(ASSETS, f)).size / 1024).toFixed(1) + ' KB';
const svg = (f) => fs.readFileSync(path.join(ASSETS, f), 'utf8');

const panel = (it, theme) => `
  <figure class="panel ${theme} span${it.span} ${it.id}">
    <div class="art">${svg(it.file)}</div>
    <div class="grain"></div>
    <figcaption><b>${it.label}</b><span>${kb(it.file)} - ${it.note}</span><i>${theme === 'paper' ? 'on paper' : 'on graphite'}</i></figcaption>
  </figure>`;

const rows = [
  ['iso', 'axo'].flatMap((id) => []),
];

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Deco linework board</title>
<style>
  :root { --paper:#F4F5F6; --ink:#14171B; --graphite:#14171B; --line-on-dark:#E4E7EA; --stage:#E4E7EA; }
  * { box-sizing:border-box; margin:0; }
  body { width:2400px; background:#C9CDD2; font:13px/1.35 ui-monospace, Menlo, Consolas, monospace; color:#14171B; padding:40px; }
  h1 { font:600 15px ui-monospace, Consolas, monospace; letter-spacing:.14em; text-transform:uppercase; margin:0 0 6px; }
  p.lede { color:#3B4148; margin-bottom:28px; max-width:1500px }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  .panel { position:relative; overflow:hidden; display:flex; flex-direction:column; }
  .panel .art { flex:1; display:flex; align-items:center; justify-content:center; padding:48px 48px 24px; }
  .panel .art svg { width:100%; height:auto; max-height:1500px; display:block; }
  .panel.plan .art svg { max-height:1500px; width:auto; }
  .panel figcaption { display:flex; gap:18px; align-items:baseline; padding:14px 24px 16px; font-size:12px; border-top:1px solid; }
  .panel figcaption b { font-weight:600; }
  .panel figcaption span { opacity:.75; flex:1 }
  .panel figcaption i { font-style:normal; letter-spacing:.12em; text-transform:uppercase; opacity:.7 }
  .paper { background:var(--paper); color:var(--ink); }
  .paper figcaption { border-color:rgba(20,23,27,.16); }
  .graphite { background:linear-gradient(180deg,#171A1F 0%,#111418 100%); color:var(--line-on-dark); }
  .graphite figcaption { border-color:rgba(228,231,234,.16); }
  .graphite svg #poche { opacity:.6; }
  .graphite svg #footprint-hatch, .graphite svg #hatch { opacity:.7; }
  .grain { position:absolute; inset:0; background:url(${rel('paper-grain.png')}); background-size:256px 256px; opacity:.9; pointer-events:none; }
  .span2 { grid-column:1 / -1; }
  .span2 .art svg { max-height:900px; }
  .sec { grid-column:1 / -1; margin-top:18px; letter-spacing:.14em; text-transform:uppercase; font-size:12px; color:#3B4148; }
  .swatches { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; grid-column:1/-1; }
  .sw { height:340px; position:relative; overflow:hidden; display:flex; align-items:flex-end; padding:12px 16px; font-size:12px; }
  .sw.p { background:var(--paper); color:var(--ink); } .sw.g { background:#14171B; color:#E4E7EA; }
  .sw .grain { background-size:256px 256px; }
  .sw.big .grain { background-size:768px 768px; image-rendering:pixelated; }
  .sw.h { background-image:url(${rel('hatch-45.svg')}); background-size:8px 8px; }
  .sw.hm { -webkit-mask:none; }
  .sw .lab { position:relative; background:var(--paper); color:var(--ink); padding:3px 8px; }
  .sw.g .lab { background:#14171B; color:#E4E7EA; }
  .demo { height:520px; position:relative; overflow:hidden; display:flex; align-items:flex-end; padding:14px 18px; }
  .demo .lab { position:relative; z-index:2; padding:3px 8px; background:var(--paper); color:var(--ink) }
  .demo.d1 { background:var(--paper); }
  .demo.d1 img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.13; }
  .demo.d2 { background:#14171B; }
  .demo.d2::before { content:""; position:absolute; inset:0; background:#E4E7EA; opacity:.16; -webkit-mask:url(${rel('villa-iso-lines.svg')}) center/contain no-repeat; mask:url(${rel('villa-iso-lines.svg')}) center/contain no-repeat; }
  .demo.d2 .lab { background:#14171B; color:#E4E7EA }
  .demo.d3 { background:#E4E7EA; color:#2D4596; }
  .demo.d3::before { content:""; position:absolute; inset:0; background:#2D4596; opacity:.55; -webkit-mask:url(${rel('villa-plan-lines.svg')}) 60% 30%/auto 190% no-repeat; mask:url(${rel('villa-plan-lines.svg')}) 60% 30%/auto 190% no-repeat; }
  .demos { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; grid-column:1/-1; }
</style></head><body>
<h1>Deco linework - villa demo</h1>
<p class="lede">Vector line drawings of the demo villa, stroke only, currentColor, generated from the Blender scene (see README). Left: ink #14171B on paper #F4F5F6. Right: #E4E7EA on graphite. The faint speckle is paper-grain.png (256 px tile, ${kb('paper-grain.png')}) laid over both. On graphite the poche group is dimmed to 60% with one CSS rule (#poche { opacity:.6 }).</p>
<div class="grid">
  ${panel(items[0], 'paper')}${panel(items[0], 'graphite')}
  ${panel(items[1], 'paper')}${panel(items[1], 'graphite')}
  ${panel(items[2], 'paper')}${panel(items[2], 'graphite')}
  ${panel(items[3], 'paper')}
  ${panel(items[3], 'graphite')}
  ${panel(items[4], 'paper')}
  ${panel(items[4], 'graphite')}
  <div class="sec">textures and use as a background</div>
  <div class="swatches">
    <div class="sw p"><div class="grain"></div><span class="lab">paper-grain.png on paper, 1x</span></div>
    <div class="sw g"><div class="grain"></div><span class="lab">paper-grain.png on graphite, 1x</span></div>
    <div class="sw p big"><div class="grain"></div><span class="lab">paper-grain.png, 3x zoom</span></div>
    <div class="sw p h" style="color:#14171B"><span class="lab">hatch-45.svg as background-image (black)</span></div>
  </div>
  <div class="demos">
    <div class="demo d1"><img src="${rel('villa-axo-exploded.svg')}" alt=""><span class="lab">img, black, opacity .13 (watermark)</span></div>
    <div class="demo d2"><span class="lab">CSS mask-image + background currentColor-style</span></div>
    <div class="demo d3"><span class="lab">mask, brand accent, cropped by the container</span></div>
  </div>
</div>
</body></html>`;

const out = path.join(HERE, 'board.html');
fs.writeFileSync(out, html);
console.log('wrote', out);

if (!process.argv.includes('--html')) {
  fs.mkdirSync(DOCS, { recursive: true });
  const shot = path.join(DOCS, 'board.png');
  const ROOT = path.resolve(HERE, '../../../..');
  const TYPES = { '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.css': 'text/css' };
  const server = http.createServer((req, res) => {
    const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}/` + path.relative(ROOT, out).split(path.sep).join('/');
  const run = async (c) => (await execP(c)).stdout;
  try { await run('playwright-cli -s=deco close'); } catch {}
  try {
    await run(`playwright-cli -s=deco open ${url}`);
    await run('playwright-cli -s=deco resize 2480 1600');
    await run(`playwright-cli -s=deco goto ${url}`);
    console.log(await run(`playwright-cli -s=deco screenshot --full-page --filename="${shot}"`));
  } finally {
    try { await run('playwright-cli -s=deco close'); } catch {}
    server.close();
  }
  // flat colours + faint speckle: an 8-bit palette keeps it crisp at a fraction of the size
  const sharp = (await import('sharp')).default;
  const buf = await sharp(shot).png({ palette: true, colors: 256, quality: 100, effort: 10, dither: 0.6 }).toBuffer();
  fs.writeFileSync(shot, buf);
  console.log('board ->', shot, (buf.length / 1024 / 1024).toFixed(2) + ' MB');
}
