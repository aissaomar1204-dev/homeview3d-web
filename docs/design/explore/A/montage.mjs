// node montage.mjs shots/x.png out.png [cols] -> overview: the page cut into equal columns side by side
import sharp from 'sharp';
const [file, out, colsArg] = process.argv.slice(2);
const cols = Number(colsArg || 5);
const m = await sharp(file).metadata();
const ch = Math.ceil(m.height / cols);
const scale = 0.28;
const parts = [];
for (let i = 0; i < cols; i++) {
  const top = i * ch, h = Math.min(ch, m.height - top);
  const b = await sharp(file).extract({ left: 0, top, width: m.width, height: h }).resize({ width: Math.round(m.width * scale) }).toBuffer();
  parts.push({ input: b, left: i * (Math.round(m.width * scale) + 8), top: 0 });
}
await sharp({ create: { width: cols * (Math.round(m.width * scale) + 8), height: Math.round(ch * scale) + 4, channels: 3, background: '#888' } }).composite(parts).png().toFile(out);
