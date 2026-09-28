// Tiny static server for local tests (no dependencies). Mirrors the Netlify _headers MIME types
// so .glb/.usdz behave like production. Usage: node scripts/serve.mjs [port] [root]
//   node scripts/serve.mjs            -> http://localhost:8799/ serving the project root
//   node scripts/serve.mjs 8799 public
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.argv[2] || process.env.PORT || 8799);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', process.argv[3] || '.');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.usdz': 'model/vnd.usdz+zip',
  '.hdr': 'image/vnd.radiance', '.ktx2': 'image/ktx2',
};
// Compress text like Netlify does. GLB is NOT compressed by default (conservative: Netlify's compressible
// type list is not documented for model/gltf-binary); SERVE_COMPRESS_GLB=1 to simulate a CDN that does.
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.md', '.txt', '.svg', '.gltf',
  ...(process.env.SERVE_COMPRESS_GLB === '1' ? ['.glb', '.bin'] : [])]);

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404'); console.log(404, url.pathname); return; }
  const ext = path.extname(file).toLowerCase();
  const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' };
  // SERVE_CSP="<policy>" adds a Content-Security-Policy to HTML responses (to test the production CSP locally).
  if (ext === '.html' && process.env.SERVE_CSP) headers['Content-Security-Policy'] = process.env.SERVE_CSP;
  let body = fs.readFileSync(file);
  if (COMPRESSIBLE.has(ext) && /\bbr\b/.test(req.headers['accept-encoding'] || '')) {
    body = zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } });
    headers['Content-Encoding'] = 'br';
    headers.Vary = 'Accept-Encoding';
  }
  headers['Content-Length'] = body.length;
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
  console.log(200, url.pathname, headers['Content-Type'], headers['Content-Encoding'] || '', body.length);
}).listen(PORT, () => console.log(`serving ${ROOT} at http://localhost:${PORT}/`));
