// node slice.mjs shots/x.png [sliceHeight] -> shots/_s/x-01.png ... (viewing helper)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [file, hArg] = process.argv.slice(2);
const meta = await sharp(file).metadata();
const H = Number(hArg || 1700);
const dir = path.join(path.dirname(file), '_s');
fs.mkdirSync(dir, { recursive: true });
const base = path.basename(file, '.png');
let i = 0;
for (let y = 0; y < meta.height; y += H) {
  const h = Math.min(H, meta.height - y);
  i++;
  await sharp(file).extract({ left: 0, top: y, width: meta.width, height: h }).toFile(path.join(dir, `${base}-${String(i).padStart(2, '0')}.png`));
}
console.log(meta.width, meta.height, i, 'slices');
