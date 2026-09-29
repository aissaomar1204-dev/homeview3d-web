// preview.mjs - rasterise one deco SVG for a quick look.
//   node preview.mjs <svg> <out.png> [--bg #F4F5F6] [--ink #14171B] [--w 1400]
import fs from 'node:fs';
import sharp from 'sharp';

const args = process.argv.slice(2);
const svgPath = args[0];
const out = args[1];
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const bg = opt('--bg', '#F4F5F6');
const ink = opt('--ink', '#14171B');
const w = parseInt(opt('--w', '1400'), 10);
let svg = fs.readFileSync(svgPath, 'utf8').replaceAll('currentColor', ink);
const crop = opt('--crop', '');
let img = sharp(Buffer.from(svg), { density: 96 }).resize({ width: w }).flatten({ background: bg });
if (crop) {
  const [x, y, cw, ch] = crop.split(',').map(Number);
  const buf = await img.png().toBuffer();
  img = sharp(buf).extract({ left: x, top: y, width: cw, height: ch });
}
await img.png().toFile(out);
console.log('ok', out);
