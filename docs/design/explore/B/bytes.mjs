/* Byte report for direction B: CSS through the real build minifier + token shortener, HTML before/after (raw, gzip, brotli). */
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minifyCss, shortenCustomProps } from '../../../../build/lib/assets.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..', '..');
const gz = (b) => zlib.gzipSync(b, { level: 9 }).length;
const br = (b) => zlib.brotliCompressSync(b).length;
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const src = fs.readFileSync(path.join(HERE, 'explore-B.css'), 'utf8');
const min = minifyCss(src);
// shorten only my own tokens the way the build does (site tokens already have short names in dist)
const short = shortenCustomProps(min, new Set());
const out = { css: { source: src.length, minified: Buffer.byteLength(min), shortened: Buffer.byteLength(short), gzip: gz(short), brotli: br(short) } };
console.log('CSS  source', kb(out.css.source), '· minified', kb(out.css.minified), '· + token shortening', kb(out.css.shortened), '· gzip', kb(out.css.gzip), '· brotli', kb(out.css.brotli));
const pages = { home: 'index.html', servicio: 'servicios/plano-2d-a-3d/index.html', precios: 'precios/index.html' };
for (const [n, f] of Object.entries(pages)) {
  const a = fs.readFileSync(path.join(ROOT, 'dist', f)), b = fs.readFileSync(path.join(ROOT, 'dist-explore-B', f));
  console.log(`HTML ${n.padEnd(8)} raw ${kb(a.length)} → ${kb(b.length)} (+${kb(b.length - a.length)}) · gzip ${kb(gz(a))} → ${kb(gz(b))} (+${kb(gz(b) - gz(a))}) · brotli ${kb(br(a))} → ${kb(br(b))} (+${kb(br(b) - br(a))})`);
}
const dir = path.join(HERE, 'assets');
console.log('assets', fs.existsSync(dir) ? fs.readdirSync(dir).length + ' files' : 'none (0 B): every ornament is inline SVG or CSS; no extra request except explore-B.css');
