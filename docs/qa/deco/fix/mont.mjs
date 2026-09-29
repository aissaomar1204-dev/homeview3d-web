// usage: node mont.mjs out.jpg width y0 y1 in1.jpg in2.jpg ...   (y0,y1 in source px of the first image; each image scaled to `width`)
import sharp from 'sharp';
const [,, out, w, y0, y1, ...ins] = process.argv;
const W = +w; const parts = [];
for (const f of ins) {
  const md = await sharp(f, { limitInputPixels: false }).metadata();
  const scale = W / md.width;
  const top = Math.round(+y0), h = Math.min(md.height - top, Math.round(+y1) - top);
  const buf = await sharp(f, { limitInputPixels: false }).extract({ left: 0, top, width: md.width, height: h }).resize({ width: W }).jpeg({ quality: 80 }).toBuffer();
  parts.push(buf);
}
const metas = await Promise.all(parts.map((p) => sharp(p).metadata()));
const H = Math.max(...metas.map((m) => m.height));
const canvas = sharp({ create: { width: W * parts.length + (parts.length - 1) * 8, height: H, channels: 3, background: '#ff00ff' } });
await canvas.composite(parts.map((p, i) => ({ input: p, left: i * (W + 8), top: 0 }))).jpeg({ quality: 80 }).toFile(out);
console.log('ok', out);
