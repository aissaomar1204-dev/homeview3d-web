// Converts the close-up PNGs to JPEG (q88), keeps the "before" baselines as JPEG and removes scratch captures.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const S = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const jpg = async (from, to) => { await sharp(path.join(S, from)).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(S, to)); fs.unlinkSync(path.join(S, from)); };
for (const f of fs.readdirSync(S)) {
  if (/^closeup-.*\.png$/.test(f)) await jpg(f, f.replace(/\.png$/, '.jpg'));
  else if (f === '_baseline-home-1440.png') await jpg(f, 'before-home-1440.jpg');
  else if (f === '_baseline-svc-1440.png') await jpg(f, 'before-service-1440.jpg');
  else if (/^(_|v\d)/.test(f) && f.endsWith('.png')) fs.unlinkSync(path.join(S, f));
}
console.log(fs.readdirSync(S).map((f) => `${f} ${(fs.statSync(path.join(S, f)).size / 1024).toFixed(0)} KB`).join('\n'));
