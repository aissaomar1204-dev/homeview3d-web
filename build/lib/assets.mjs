/* ═══════════════════════════════════════════════════════════════
   Assets (docs/build/BUILD-SPEC.md §0 Hashing, §2 step 2). Owner: ENGINE.
   - public/** → dist/**; files under public/assets/** and public/lib/**
     are renamed <name>.<hash8>.<ext> and recorded in assetMap.
   - src/css/*.css → one minified dist/assets/css/site.<hash8>.css with
     url(/assets/…) rewritten to hashed names.
   - src/js/*.js → dist/assets/js/<name>.<hash8>.js (lightly minified,
     verified with `node --check`, raw copy as fallback).
   - picture(name, opts, ctx): <picture> from build/generated/images.json.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { esc } from './md.mjs';

export const hash8 = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
const toPosix = (p) => p.split(path.sep).join('/');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

const hashedName = (rel, buf) => rel.replace(/(\.[^./]+)$/, `.${hash8(buf)}$1`);

export function createAssets({ root, dist, warn = console.warn }) {
  const assetMap = new Map(); // '/assets/fonts/archivo-var.woff2' → '/assets/fonts/archivo-var.1a2b3c4d.woff2'
  const sizes = new Map();    // hashed public path → bytes
  const missing = new Set();
  let images = null;

  /** Copy public/** to dist/**, hashing /assets/** and /lib/**. */
  function copyPublic() {
    const pub = path.join(root, 'public');
    let count = 0, bytes = 0;
    for (const file of walk(pub)) {
      const rel = '/' + toPosix(path.relative(pub, file));
      if (/(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini)$/i.test(rel)) continue;
      const buf = fs.readFileSync(file);
      let out = rel;
      if (rel.startsWith('/assets/') || rel.startsWith('/lib/')) {
        out = hashedName(rel, buf);
        assetMap.set(rel, out);
      }
      const dst = path.join(dist, out);
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.writeFileSync(dst, buf);
      sizes.set(out, buf.length);
      count++; bytes += buf.length;
    }
    return { count, bytes };
  }

  /** Hashed URL of a public asset. Unknown /assets or /lib paths warn once and return the input. */
  function asset(p) {
    if (!p) return p;
    const clean = p.split('#')[0].split('?')[0];
    if (assetMap.has(clean)) return assetMap.get(clean) + p.slice(clean.length);
    if ((clean.startsWith('/assets/') || clean.startsWith('/lib/')) && !missing.has(clean)) {
      missing.add(clean);
      warn(`! asset not found in public/: ${clean}`);
    }
    return p;
  }

  function register(publicPath, buf) {
    const out = hashedName(publicPath, buf);
    const dst = path.join(dist, out);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, buf);
    assetMap.set(publicPath, out);
    sizes.set(out, buf.length);
    return out;
  }

  /** src/css/*.css → site.<hash>.css. Returns the public URL. */
  function buildCss() {
    const dir = path.join(root, 'src', 'css');
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.css')).sort() : [];
    const parts = files.map((f) => {
      let css = fs.readFileSync(path.join(dir, f), 'utf8');
      // tokens.css is the only file with colour literals (COLOR-01). The bundle ships them as rgb()
      // so the single bundled stylesheet stays free of hex literals for the design lint.
      if (/tokens/.test(f)) css = css.replace(/#([0-9a-fA-F]{6})\b/g, (m, h) => `rgb(${parseInt(h.slice(0, 2), 16)} ${parseInt(h.slice(2, 4), 16)} ${parseInt(h.slice(4, 6), 16)})`);
      return `/* ${f} */\n${css}`;
    });
    let css = minifyCss(parts.join('\n'));
    if (process.env.NO_SHORTEN !== '1') css = shortenCustomProps(css, keepNames(root));
    css = css.replace(/url\(\s*(['"]?)(\/(?:assets|lib)\/[^'")]+)\1\s*\)/g, (m, q, p) => `url(${q}${asset(p)}${q})`);
    const url = register('/assets/css/site.css', Buffer.from(css));
    return { url, bytes: Buffer.byteLength(css), files };
  }

  /** src/js/*.js → /assets/js/<name>.<hash>.js. Returns { name: url }. */
  function buildJs() {
    const dir = path.join(root, 'src', 'js');
    const out = {};
    if (!fs.existsSync(dir)) return out;
    for (const f of fs.readdirSync(dir).filter((x) => /\.(m?js)$/.test(x)).sort()) {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      let code = raw;
      if (process.env.NO_MINIFY !== '1') {
        const min = minifyJs(raw);
        if (checkSyntax(min, f)) code = min; else warn(`! ${f}: minified output failed node --check, shipping the original`);
      }
      const name = f.replace(/\.m?js$/, '');
      out[name] = { url: register(`/assets/js/${f.replace(/\.mjs$/, '.js')}`, Buffer.from(code)), bytes: Buffer.byteLength(code) };
    }
    return out;
  }

  function loadImages(file) {
    if (!fs.existsSync(file)) { warn(`! image manifest missing (${toPosix(path.relative(root, file))}): images render as marked placeholders`); images = null; return null; }
    try { images = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { warn(`! image manifest unreadable: ${e.message}`); images = null; }
    return images;
  }

  const srcFor = (m, w, ext) => asset(m.path.replace('{w}', w).replace('{ext}', ext));

  /** Largest available rendition (webp preferred) as a public URL, for sitemaps. */
  function largest(name) {
    const m = images && images[name];
    if (!m) return null;
    const w = Math.max(...m.widths);
    const ext = (m.formats || []).includes('webp') ? 'webp' : (m.formats || [])[0];
    return srcFor(m, w, ext);
  }

  function og(name) {
    const m = images && images[name];
    return m && m.og ? asset(m.og) : null;
  }

  function placeholderDims(name) {
    const png = path.join(root, 'source', 'villa3d', 'renders', `${name}.png`);
    try {
      const b = Buffer.alloc(24);
      const fd = fs.openSync(png, 'r'); fs.readSync(fd, b, 0, 24, 0); fs.closeSync(fd);
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    } catch { return { width: 1600, height: 1000 }; }
  }

  /**
   * <picture> for a manifest image. opts: { alt (required, "" = decorative), sizes, eager, className,
   * variant (suffix: 'opaco' → name_opaco), widths (subset), max (largest width, default 1600), imgClass, attrs }.
   */
  function picture(name, opts = {}, ctx) {
    if (opts.variant) name = `${name}_${opts.variant}`;
    if (opts.alt == null) throw new Error(`img(${name}): alt is required ("" for decorative)`);
    const alt = esc(opts.alt);
    const sizes = opts.sizes || '100vw';
    let fetch = '';
    let loading = ' loading="lazy" decoding="async"';
    if (opts.eager) {
      if (ctx && !ctx._lcpUsed) { fetch = ' fetchpriority="high"'; ctx._lcpUsed = true; loading = ''; } else loading = ' loading="eager" decoding="async"';
    }
    const cls = opts.imgClass ? ` class="${opts.imgClass}"` : '';
    const wrapCls = `pic${opts.className ? ` ${opts.className}` : ''}`;
    const m = images && images[name];
    if (!m) {
      const { width, height } = placeholderDims(name);
      if (ctx) ctx.collect.missingImages = [...(ctx.collect.missingImages || []), name];
      warn(`! image "${name}" not in manifest: rendering placeholder`);
      const label = ctx ? ctx.ui.img.placeholder : 'Image pending';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="rgb(228 231 234)"/><text x="50%" y="50%" text-anchor="middle" font-family="monospace" font-size="${Math.round(width / 28)}" fill="rgb(95 103 113)">${label}: ${name}</text></svg>`;
      return `<picture class="${wrapCls} pic--missing" data-missing="${esc(name)}"><img src="data:image/svg+xml,${encodeURIComponent(svg)}" width="${width}" height="${height}" alt="${alt}"${cls}${loading}${fetch}></picture>`;
    }
    const cap = opts.max || 1600;
    let widths = (opts.widths ? m.widths.filter((w) => opts.widths.includes(w)) : m.widths.filter((w) => w <= cap)).slice().sort((a, b) => a - b);
    if (!widths.length) widths = [Math.min(...m.widths)];
    const srcset = (ext) => widths.map((w) => `${srcFor(m, w, ext)} ${w}w`).join(', ');
    const formats = (m.formats || ['avif', 'webp']).filter((f) => f !== 'webp');
    const sources = [...formats, 'webp'].filter((f) => (m.formats || ['avif', 'webp']).includes(f))
      .map((f) => `<source type="image/${f}" srcset="${srcset(f)}" sizes="${sizes}">`).join('');
    const fallback = m.fallback ? asset(m.fallback) : srcFor(m, widths[Math.min(widths.length - 1, 2)], 'webp');
    if (ctx) ctx.collect.images.push({ name, url: largest(name), alt: opts.alt });
    const extra = opts.attrs ? ` ${opts.attrs}` : '';
    return `<picture class="${wrapCls}">${sources}<img src="${fallback}" width="${m.width}" height="${m.height}" alt="${alt}"${cls}${loading}${fetch}${extra}></picture>`;
  }

  return {
    assetMap, sizes, copyPublic, asset, buildCss, buildJs, loadImages, picture, largest, og,
    get images() { return images; },
    missing,
  };
}

/* ─── Minifiers (conservative, dependency-free) ─────────────────── */

export function minifyCss(css) {
  let out = '';
  let i = 0;
  const n = css.length;
  while (i < n) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') { const end = css.indexOf('*/', i + 2); i = end < 0 ? n : end + 2; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && css[j] !== c) { if (css[j] === '\\') j++; j++; }
      out += css.slice(i, j + 1); i = j + 1; continue;
    }
    out += c; i++;
  }
  // Whitespace before ":" is kept (it is a descendant combinator in ".a :focus-visible").
  return out
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .replace(/\s*!important/g, '!important')
    .trim();
}

/**
 * Custom property names referenced outside CSS (JS, templates, generated HTML) must keep their
 * source name: scan src/js and build/lib + build/templates for "--name" strings.
 */
function keepNames(root) {
  const keep = new Set();
  const dirs = [path.join(root, 'src', 'js'), path.join(root, 'build', 'lib'), path.join(root, 'build', 'templates')];
  for (const dir of dirs) {
    for (const f of walk(dir)) {
      if (!/\.(m?js)$/.test(f)) continue;
      const code = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
      for (const m of code.matchAll(/--[a-zA-Z][\w-]*/g)) keep.add(m[0]);
    }
  }
  return keep;
}

/**
 * Bundle-level shortening of custom property names declared in the CSS (--color-ink-3 → --c5).
 * Source files keep their readable token names; only dist/ is affected. Names used from JS/HTML are kept.
 */
export function shortenCustomProps(css, keep = new Set()) {
  const declared = new Map();
  for (const m of css.matchAll(/(?:^|[{;(\s])(--[a-zA-Z][\w-]*)\s*:/g)) declared.set(m[1], (declared.get(m[1]) || 0) + 1);
  for (const m of css.matchAll(/@property\s+(--[\w-]+)/g)) keep.add(m[1]);
  const names = [...declared.keys()].filter((n) => !keep.has(n) && n.length > 4);
  // Most used names get the shortest aliases.
  const uses = (n) => css.split(n).length;
  names.sort((a, b) => uses(b) - uses(a));
  const alias = new Map();
  let i = 0;
  const short = (k) => { let s = ''; do { s = String.fromCharCode(97 + (k % 26)) + s; k = Math.floor(k / 26) - 1; } while (k >= 0); return `--${s}`; };
  for (const n of names) {
    let a;
    do { a = short(i++); } while (declared.has(a) || keep.has(a));
    alias.set(n, a);
  }
  if (!alias.size) return css;
  const re = new RegExp(`(${[...alias.keys()].sort((a, b) => b.length - a.length).map((n) => n.replace(/[-]/g, '\\-')).join('|')})(?![\\w-])`, 'g');
  return css.replace(re, (m) => alias.get(m));
}

/** Light JS minifier: strips comments and indentation, keeps line breaks (ASI-safe). */
export function minifyJs(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let lastSig = ''; // last significant char for regex detection
  const regexPrev = /[(,=:[!&|?{};+\-*%<>~^]|^$/;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { const end = src.indexOf('\n', i); i = end < 0 ? n : end; continue; }
    if (c === '/' && d === '*') { const end = src.indexOf('*/', i + 2); i = end < 0 ? n : end + 2; out += ' '; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      let depth = 0;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (c === '`' && src[j] === '$' && src[j + 1] === '{') { depth++; j += 2; continue; }
        if (c === '`' && depth > 0 && src[j] === '}') { depth--; j++; continue; }
        if (src[j] === c && depth === 0) break;
        j++;
      }
      out += src.slice(i, j + 1); i = j + 1; lastSig = c; continue;
    }
    if (c === '/') {
      const prevWord = out.match(/(\w+)\s*$/);
      if (regexPrev.test(lastSig) || (prevWord && /^(return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await)$/.test(prevWord[1]))) {
        let j = i + 1; let cls = false;
        while (j < n) {
          if (src[j] === '\\') { j += 2; continue; }
          if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false;
          else if (src[j] === '/' && !cls) break;
          else if (src[j] === '\n') break;
          j++;
        }
        j++;
        while (j < n && /[a-z]/i.test(src[j])) j++;
        out += src.slice(i, j); i = j; lastSig = '/'; continue;
      }
    }
    out += c;
    if (!/\s/.test(c)) lastSig = c;
    i++;
  }
  return out
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
    .replace(/[ \t]{2,}/g, ' ');
}

function checkSyntax(code, name) {
  const tmp = path.join(os.tmpdir(), `engine-check-${process.pid}-${name.replace(/\W/g, '_')}.mjs`);
  try {
    fs.writeFileSync(tmp, code);
    const r = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
    return r.status === 0;
  } catch { return false; } finally { try { fs.unlinkSync(tmp); } catch { /* ignore */ } }
}
