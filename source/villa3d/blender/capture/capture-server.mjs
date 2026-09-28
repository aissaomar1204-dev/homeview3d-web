// Capture helper for frames taken from <model-viewer> (viewer poster, turntable frames).
// Serves the project root (GET, production MIME types) and accepts
//   POST /__save?name=<file>.png   → source/villa3d/renders/<file>.png
//   POST /__save?dir=<sub>&name=f_0001.png → <scratch>/<sub>/f_0001.png  (CAPTURE_TMP env, frames)
// Local tooling only (binds 127.0.0.1). Usage: node source/villa3d/blender/capture/capture-server.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.argv[2] || 8802);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const RENDERS = path.join(ROOT, 'source/villa3d/renders');
const TMP = process.env.CAPTURE_TMP || path.join(ROOT, 'node_modules/.cache/capture');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.css': 'text/css; charset=utf-8',
};
const SAFE = /^[a-z0-9_-]+\.png$/i;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/__save') {
    const name = url.searchParams.get('name') || '';
    const dir = url.searchParams.get('dir');
    if (!SAFE.test(name) || (dir && !/^[a-z0-9_-]+$/i.test(dir))) { res.writeHead(400).end('bad name'); return; }
    const outDir = dir ? path.join(TMP, dir) : RENDERS;
    fs.mkdirSync(outDir, { recursive: true });
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      fs.writeFileSync(path.join(outDir, name), buf);
      console.log('saved', path.relative(ROOT, path.join(outDir, name)), buf.length);
      res.writeHead(200, { 'Content-Type': 'text/plain' }).end(`ok ${buf.length}`);
    });
    return;
  }
  const file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end('404'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`capture server: http://127.0.0.1:${PORT}/ (root ${ROOT})`));
