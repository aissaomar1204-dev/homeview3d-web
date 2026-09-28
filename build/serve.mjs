#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Preview server for dist/ (no dependencies). Owner: ENGINE.
   node build/serve.mjs [port] [dir]     (PORT env also works; default 8765)
   Mimics Netlify:
   - /foo → 301 /foo/ when /foo/index.html exists (pretty_urls = false)
   - unknown paths → real 404 with /404.html (or /en/404.html under /en/)
   - MIME for glb, usdz, avif, webp, md, webmanifest, wasm, ktx2…
   - brotli/gzip for text, never for glb/usdz (conservative, like the CDN)
   - applies dist/_headers (path rules) and dist/_redirects (simple 301/302/200)
     SERVE_HEADERS=0 disables _headers. HSTS and upgrade-insecure-requests are
     stripped locally (they would break http://localhost).
   - binds the next free port if the requested one is taken
   ═══════════════════════════════════════════════════════════════ */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.resolve(ROOT, process.argv[3] || 'dist');
let PORT = Number(process.argv[2] || process.env.PORT || 8765);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
  '.usdz': 'model/vnd.usdz+zip', '.ktx2': 'image/ktx2', '.hdr': 'image/vnd.radiance', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.mjs', '.json', '.md', '.txt', '.xml', '.svg', '.webmanifest', '.gltf']);

/* ─── Netlify _headers / _redirects (subset) ──────────────────── */
function patternToRegex(p) {
  const re = p.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:(\w+)/g, '[^/]+')).join('.*');
  return new RegExp(`^${re}$`);
}
function loadHeaders() {
  const file = path.join(DIST, '_headers');
  if (process.env.SERVE_HEADERS === '0' || !fs.existsSync(file)) return [];
  const rules = [];
  let cur = null;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) { cur = { re: patternToRegex(raw.trim()), headers: [] }; rules.push(cur); continue; }
    const i = raw.indexOf(':');
    if (cur && i > 0) cur.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
  }
  return rules;
}
function loadRedirects() {
  const file = path.join(DIST, '_redirects');
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/)).filter((p) => p.length >= 2)
    .map(([from, to, status = '301']) => ({ re: patternToRegex(from), from, to, status: parseInt(status, 10) || 301 }));
}
let headerRules = loadHeaders();
let redirectRules = loadRedirects();
let loadedAt = Date.now();
function refreshRules() {
  // dist/ is rebuilt often: reload the rule files at most once per second.
  if (Date.now() - loadedAt > 1000) { headerRules = loadHeaders(); redirectRules = loadRedirects(); loadedAt = Date.now(); }
}

function applyHeaders(res, urlPath) {
  for (const rule of headerRules) {
    if (!rule.re.test(urlPath)) continue;
    for (const [k, v] of rule.headers) {
      if (/^strict-transport-security$/i.test(k)) continue;
      const value = /^content-security-policy/i.test(k) ? v.replace(/;?\s*upgrade-insecure-requests/gi, '') : v;
      res.setHeader(k, value);
    }
  }
}

function notFound(req, res, urlPath) {
  const lang = urlPath.startsWith('/en/') ? 'en' : null;
  const page = [lang && path.join(DIST, lang, '404.html'), path.join(DIST, '404.html')].find((f) => f && fs.existsSync(f));
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(page ? fs.readFileSync(page) : '<!doctype html><title>404</title><p>404</p>');
  log(404, urlPath);
}

function log(status, p, extra = '') {
  if (process.env.SERVE_QUIET === '1') return;
  console.log(`${status} ${p}${extra ? ` ${extra}` : ''}`);
}

const server = http.createServer((req, res) => {
  refreshRules();
  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch { res.writeHead(400).end(); return; }
  let urlPath;
  try { urlPath = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }

  for (const r of redirectRules) {
    if (!r.re.test(urlPath)) continue;
    if (r.status === 200) { urlPath = r.to; break; }
    if (r.status === 404) break;
    res.writeHead(r.status, { Location: r.to + (url.search || '') }).end();
    log(r.status, urlPath, `→ ${r.to}`);
    return;
  }

  let file = path.join(DIST, urlPath);
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!urlPath.endsWith('/')) {
      if (fs.existsSync(path.join(file, 'index.html'))) { res.writeHead(301, { Location: `${urlPath}/${url.search}` }).end(); log(301, urlPath); return; }
      return notFound(req, res, urlPath);
    }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return notFound(req, res, urlPath);

  const ext = path.extname(file).toLowerCase();
  res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache');
  if (['.glb', '.gltf', '.usdz', '.bin', '.wasm'].includes(ext)) res.setHeader('Access-Control-Allow-Origin', '*');
  applyHeaders(res, urlPath);

  let body = fs.readFileSync(file);
  const ae = String(req.headers['accept-encoding'] || '');
  if (COMPRESSIBLE.has(ext) && body.length > 1024) {
    if (/\bbr\b/.test(ae)) { body = zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }); res.setHeader('Content-Encoding', 'br'); }
    else if (/\bgzip\b/.test(ae)) { body = zlib.gzipSync(body); res.setHeader('Content-Encoding', 'gzip'); }
    res.setHeader('Vary', 'Accept-Encoding');
  }
  res.setHeader('Content-Length', body.length);
  res.writeHead(200);
  res.end(req.method === 'HEAD' ? undefined : body);
  log(200, urlPath);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE' && PORT < 65535) { PORT += 1; setTimeout(() => server.listen(PORT), 50); return; }
  console.error(e); process.exit(1);
});
server.listen(PORT, () => console.log(`Preview: http://localhost:${PORT}/  (${path.relative(ROOT, DIST) || '.'})`));
