import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [dir, out] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const parts = [];
let H = 0, W = 0;
for (const f of files) { const m = await sharp(path.join(dir, f)).metadata(); parts.push({ input: path.join(dir, f), top: H, left: 0 }); H += m.height; W = m.width; }
await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(parts).png({ compressionLevel: 9 }).toFile(out);
console.log(out, W + 'x' + H, files.length + ' segments');
