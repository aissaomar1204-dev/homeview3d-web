// usage: node contrast.mjs <path> <width> <theme> [session]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const [,, urlPath = '/', width = '1440', theme = 'light', session = 'verifyD2'] = process.argv;
const tmp = path.join(HERE, '_tmp', `c-${session}`); fs.mkdirSync(tmp, { recursive: true });
for (const f of fs.readdirSync(tmp)) fs.unlinkSync(path.join(tmp, f));
const outBase = path.join(tmp, 'p').split(path.sep).join('/');
const script = fs.readFileSync(path.join(HERE, 'contrast-run.tpl.js'), 'utf8')
  .replace('__W__', width).replace('__H__', +width < 700 ? 844 : 900).replace('__URL__', `http://localhost:8913${urlPath}`).replace('__OUT__', outBase).replace(/__THEME__/g, theme);
const runFile = path.join(tmp, 'run.js').split(path.sep).join('/'); fs.writeFileSync(runFile, script);
const out = execFileSync('playwright-cli', [`-s=${session}`, 'run-code', `--filename=${runFile}`], { encoding: 'utf8', shell: true, maxBuffer: 64 * 1024 * 1024 });
const m = out.match(/### Result\s*\n"([\s\S]*?)"\n###/);
if (!m) { console.log(out.slice(0, 800)); process.exit(1); }
const items = JSON.parse(JSON.parse('"' + m[1] + '"'));
const parts = fs.readdirSync(tmp).filter(f => f.endsWith('.png')).sort();
let H = 0, Wd = 0; const comp = [];
for (const f of parts) { const md = await sharp(path.join(tmp, f)).metadata(); comp.push({ input: path.join(tmp, f), top: H, left: 0 }); H += md.height; Wd = md.width; }
const img = sharp({ create: { width: Wd, height: H, channels: 3, background: '#fff' }, limitInputPixels: false }).composite(comp);
const { data: raw, info } = await img.raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const parse = (s) => { const k = s.startsWith('color(srgb') ? 255 : 1; const a = s.match(/[0-9.]+/g).map(Number); return { r: a[0] * k, g: a[1] * k, b: a[2] * k, a: a.length > 3 ? a[3] : 1 }; };
const bad = []; let checked = 0;
for (const it of items) {
  const x0 = Math.max(0, Math.floor(it.x)), y0 = Math.max(0, Math.floor(it.y));
  const x1 = Math.min(info.width, Math.ceil(it.x + it.w)), y1 = Math.min(info.height, Math.ceil(it.y + it.h));
  if (x1 - x0 < 2 || y1 - y0 < 2) continue;
  const c = parse(it.c); const lums = []; let sr = 0, sg = 0, sb = 0, n = 0;
  for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) { const i = (y * info.width + x) * ch; lums.push(L(raw[i], raw[i + 1], raw[i + 2])); sr += raw[i]; sg += raw[i + 1]; sb += raw[i + 2]; n++; }
  if (!n) continue;
  const mean = { r: sr / n, g: sg / n, b: sb / n };
  const a = c.a * it.op;
  const tr = c.r * a + mean.r * (1 - a), tg = c.g * a + mean.g * (1 - a), tb = c.b * a + mean.b * (1 - a);
  const lt = L(tr, tg, tb);
  lums.sort((p, q) => p - q);
  const lb = lt > 0.35 ? lums[Math.floor(lums.length * 0.92)] : lums[Math.floor(lums.length * 0.08)];
  const ratio = (Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05);
  const large = it.fs >= 24 || (it.fs >= 18.66 && it.fw >= 700);
  const need = large ? 3 : 4.5;
  checked++;
  if (ratio < need) bad.push({ ratio: +ratio.toFixed(2), need, fs: it.fs, sec: it.s, t: it.t, aria: it.aria, y: Math.round(it.y) });
}
bad.sort((a, b) => a.ratio - b.ratio);
const lines = [`${urlPath} @${width} ${theme}: ${checked} text runs, ${bad.length} below threshold`];
for (const b of bad.slice(0, 40)) lines.push(`  ${b.ratio} (<${b.need}) ${b.fs}px ${b.aria ? '[aria-hidden] ' : ''}[${b.sec}] y=${b.y} ${b.t}`);
console.log(lines.join('\n'));
