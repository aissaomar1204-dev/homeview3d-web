// usage: node montage.mjs out.jpg cols tileW file1 file2 ...
import sharp from 'sharp';
const [out, cols, tw, ...files] = process.argv.slice(2);
const C = +cols, TW = +tw;
const tiles = [];
for (const f of files) {
  const m = await sharp(f).metadata();
  const h = Math.round(m.height * TW / m.width);
  tiles.push({ buf: await sharp(f).resize(TW, h).jpeg({ quality: 82 }).toBuffer(), h });
}
const rows = Math.ceil(tiles.length / C);
const rowH = []; for (let r = 0; r < rows; r++) rowH.push(Math.max(...tiles.slice(r * C, r * C + C).map(t => t.h)));
const gap = 6; const H = rowH.reduce((a, b) => a + b, 0) + gap * (rows - 1); const W = C * TW + gap * (C - 1);
let y = 0; const comp = [];
for (let r = 0; r < rows; r++) { tiles.slice(r * C, r * C + C).forEach((t, i) => comp.push({ input: t.buf, left: i * (TW + gap), top: y })); y += rowH[r] + gap; }
await sharp({ create: { width: W, height: H, channels: 3, background: '#888' } }).composite(comp).jpeg({ quality: 82 }).toFile(out);
console.log(out, W + 'x' + H);
