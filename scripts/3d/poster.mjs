// Poster variants for the viewer's LCP image (the <img> shown before model-viewer loads).
//   source/villa3d/poster.jpg (1400x1050) -> public/img/villa/villa-poster-{640,960,1400}.{avif,webp,jpg}
// Posters live OUTSIDE /models/ on purpose: robots.txt may disallow the heavy binaries, but Googlebot
// must be able to fetch the poster (image search + rendering).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ROOT, kb } from './lib.mjs';

const SRC = path.join(ROOT, 'source/villa3d/poster.jpg');
const OUT = path.join(ROOT, 'public/img/villa');
const WIDTHS = [640, 960, 1400];
fs.mkdirSync(OUT, { recursive: true });

const meta = await sharp(SRC).metadata();
for (const w of WIDTHS.filter((w) => w <= meta.width)) {
  const base = sharp(SRC).resize({ width: w, kernel: 'lanczos3' });
  const outs = {
    avif: await base.clone().avif({ quality: 55, effort: 6 }).toBuffer(),
    webp: await base.clone().webp({ quality: 78, effort: 6, smartSubsample: true }).toBuffer(),
    jpg: await base.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer(),
  };
  for (const [ext, buf] of Object.entries(outs)) fs.writeFileSync(path.join(OUT, `villa-poster-${w}.${ext}`), buf);
  console.log(`[poster] ${w}x${Math.round((w * meta.height) / meta.width)}  avif ${kb(outs.avif.length)} · webp ${kb(outs.webp.length)} · jpg ${kb(outs.jpg.length)}`);
}
