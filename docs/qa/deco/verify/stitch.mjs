import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [dir, out, sliceH] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const parts = []; let H = 0, W = 0;
for (const f of files) { const m = await sharp(path.join(dir, f)).metadata(); parts.push({ input: path.join(dir, f), top: H, left: 0 }); H += m.height; W = m.width; }
const img = sharp({ create: { width: W, height: H, channels: 3, background: '#fff' }, limitInputPixels: false }).composite(parts);
const buf = await img.png().toBuffer();
await sharp(buf, { limitInputPixels: false }).jpeg({ quality: 78 }).toFile(out + '.jpg');
console.log(out, W + 'x' + H);
if (sliceH) {
  const sh = +sliceH; let i = 0;
  for (let y = 0; y < H; y += sh) {
    const hh = Math.min(sh, H - y);
    await sharp(buf, { limitInputPixels: false }).extract({ left: 0, top: y, width: W, height: hh }).jpeg({ quality: 80 }).toFile(`${out}-s${String(i++).padStart(2, '0')}.jpg`);
  }
  console.log(i + ' slices');
}
