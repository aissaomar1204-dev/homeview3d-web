// usage: node stitch.mjs <out.png|jpg> ; joins <out>.part0.png ... (tall pages above 16384 px wrap in one Chromium capture)
import fs from 'node:fs';
import sharp from 'sharp';
const out = process.argv[2];
const parts = [];
for (let i = 0; fs.existsSync(`${out}.part${i}.png`); i++) parts.push(`${out}.part${i}.png`);
if (!parts.length) throw new Error('no parts for ' + out);
const metas = await Promise.all(parts.map((p) => sharp(p).metadata()));
const width = metas[0].width;
const height = metas.reduce((s, m) => s + m.height, 0);
let top = 0;
const composite = [];
for (let i = 0; i < parts.length; i++) { composite.push({ input: parts[i], top, left: 0 }); top += metas[i].height; }
const img = sharp({ create: { width, height, channels: 3, background: '#000' } }).composite(composite);
if (/\.jpe?g$/.test(out)) await img.jpeg({ quality: 88, mozjpeg: true }).toFile(out); else await img.png({ compressionLevel: 9 }).toFile(out);
for (const p of parts) fs.unlinkSync(p);
console.log(out, width + 'x' + height);
