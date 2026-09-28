// Downscale the supersampled model-viewer capture to the final poster (lanczos3, premultiplied alpha).
//   node source/villa3d/blender/capture/finish-poster.mjs [_poster_2x.png] [villa_viewer_poster.png] [1600x1100]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RENDERS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../renders');
const [inName = '_poster_2x.png', outName = 'villa_viewer_poster.png', size = '1600x1100'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const src = path.join(RENDERS, inName);
const dst = path.join(RENDERS, outName);
await sharp(src).resize({ width: W, height: H, kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toFile(dst);
fs.rmSync(src);
const m = await sharp(dst).metadata();
console.log(`[poster] ${outName} ${m.width}×${m.height} ${m.channels === 4 ? 'RGBA' : 'RGB'} ${fs.statSync(dst).size} bytes`);
