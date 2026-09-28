// Texture step of usdz_web.py (sharp). Reads a JSON job list and writes JPEGs:
//   [{ "in": abs path, "out": abs path (.jpg), "max": 1024, "quality": 90, "normal": true }]
// Normal maps keep 4:4:4 chroma (no subsampling: X/Y live in R/G). A JPEG that needs no resize is copied as is.
// Usage: node source/villa3d/blender/usdz_textures.mjs jobs.json
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let before = 0;
let after = 0;
for (const j of jobs) {
  const meta = await sharp(j.in).metadata();
  const inBytes = fs.statSync(j.in).size;
  fs.mkdirSync(path.dirname(j.out), { recursive: true });
  const needsResize = Math.max(meta.width, meta.height) > j.max;
  if (!needsResize && meta.format === 'jpeg' && /\.jpe?g$/i.test(j.out)) {
    fs.copyFileSync(j.in, j.out);
  } else {
    await sharp(j.in)
      .resize({ width: j.max, height: j.max, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
      .removeAlpha()
      .jpeg({ quality: j.quality, mozjpeg: true, chromaSubsampling: j.normal ? '4:4:4' : '4:2:0' })
      .toFile(j.out);
  }
  const outBytes = fs.statSync(j.out).size;
  before += inBytes;
  after += outBytes;
  const m2 = await sharp(j.out).metadata();
  console.log(`  ${path.basename(j.in).padEnd(22)} ${meta.width}x${meta.height} ${(inBytes / 1024).toFixed(0).padStart(4)} KB -> `
    + `${path.basename(j.out).padEnd(22)} ${m2.width}x${m2.height} ${(outBytes / 1024).toFixed(0).padStart(4)} KB`);
}
console.log(`  textures: ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB`);
