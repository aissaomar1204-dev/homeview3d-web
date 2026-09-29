/* Builds the small decorative assets of direction A from renders that already ship in dist/.
   plan-lines.webp: the redrawn line plan (villa_plano_lineas) turned into an alpha mask (white where there is ink),
   so CSS can tint it with `mask` in any chapter colour and in both themes. Run: node docs/design/explore/A/make-assets.mjs */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const root = path.resolve(import.meta.dirname, '../../../..');
const img = path.join(root, 'dist/assets/img');
const src = fs.readdirSync(img).find((f) => /^villa_plano_lineas-1200\..*\.webp$/.test(f));
const out = path.join(import.meta.dirname, 'assets');
fs.mkdirSync(out, { recursive: true });
const W = 720;
const grey = await sharp(path.join(img, src)).flatten({ background: '#ffffff' }).resize({ width: W }).greyscale().normalise().linear(1.25, -40).negate().raw().toBuffer({ resolveWithObject: true });
const { data, info } = grey;
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < data.length; i++) { rgba[i * 4] = 255; rgba[i * 4 + 1] = 255; rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = data[i] < 14 ? 0 : data[i]; }
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 70, alphaQuality: 60, effort: 6 }).toFile(path.join(out, 'plan-lines.webp'));
console.log('plan-lines.webp', fs.statSync(path.join(out, 'plan-lines.webp')).size, 'bytes', info.width + 'x' + info.height);
