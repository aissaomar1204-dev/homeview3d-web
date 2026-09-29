#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   scripts/brand.mjs · the Home View 3D logo system, reproducible
   Owner: BRAND. Source of truth: docs/brand/concepts/A (concept A "Habitación", outlined paths).
   Colours are read from src/css/00-tokens.css, so an accent change is one edit there (BRAND-05).

   node scripts/brand.mjs [--only=svg,icons,og] [--verify]

   Out (all deterministic, safe to re-run):
     public/assets/brand/symbol.svg               64 x 64 symbol, two colours, dark variant inside the file
     public/assets/brand/lockup-horizontal.svg    symbol + wordmark, 5.25:1
     public/assets/brand/lockup-stacked.svg       symbol over wordmark
     public/assets/brand/logo-512.png             symbol on the paper colour, 512 x 512 (schema.org logo)
     public/favicon.svg                           tight crop, transparent, adapts with prefers-color-scheme
     public/favicon.ico                           16 / 32 / 48, añil tile + light mark (PNG entries)
     public/apple-touch-icon.png                  180, añil tile + light mark
     public/icon-192.png, public/icon-512.png     maskable: the mark stays inside the 80 % safe zone
     public/assets/img/og-brand/<name>.jpg        every OG JPG of public/assets/img/og/ + a lockup on a paper plate
     build/generated/brand.json                   inline lockup for the header (transforms baked in, 1 decimal,
                                                  relative commands): read by build/lib/layout.mjs

   The originals in public/assets/img/og/ are never modified (scripts/images.mjs owns them); the branded copies are
   rebuilt from them every run, so the result never depends on a previous run.
   --verify rasterises every optimised path against its source and fails above a small pixel difference.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONCEPT = path.join(ROOT, 'docs/brand/concepts/A');
const PUBLIC = path.join(ROOT, 'public');
const BRAND_DIR = path.join(PUBLIC, 'assets/brand');
const OG_SRC = path.join(PUBLIC, 'assets/img/og');
const OG_OUT = path.join(PUBLIC, 'assets/img/og-brand');
const GENERATED = path.join(ROOT, 'build/generated/brand.json');

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const VERIFY = args.includes('--verify');
const want = (k) => !only.length || only.includes(k);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

/* ─── Tokens (colours) ────────────────────────────────────────── */

function readTokens() {
  const src = fs.readFileSync(path.join(ROOT, 'src/css/00-tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const get = (text, name) => {
    const m = text.match(new RegExp(`${name}\\s*:\\s*(#[0-9a-fA-F]{6})`));
    if (!m) throw new Error(`token ${name} not found in src/css/00-tokens.css`);
    return m[1].toUpperCase();
  };
  const names = { bg: '--color-bg', ink: '--color-ink', accent: '--color-accent', onAccent: '--color-on-accent' };
  const dark = src.split(/prefers-color-scheme:\s*dark/)[1] || '';
  const light = Object.fromEntries(Object.entries(names).map(([k, n]) => [k, get(src, n)]));
  const night = Object.fromEntries(Object.entries(names).map(([k, n]) => [k, get(dark, n)]));
  return { light, dark: night };
}
const T = readTokens();

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/* ─── SVG path tools: parse, bake a transform, re-serialise short ─ */

const ARITY = { M: 2, L: 2, H: 1, V: 1, Q: 4, C: 6, S: 4, T: 2, Z: 0 };

/** Path data → absolute segments [{ c: 'M'|'L'|'Q'|'C'|'Z', p: [numbers] }]. Arcs are not used by this logo. */
export function parsePath(d) {
  const tokens = [...d.matchAll(/([A-Za-z])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/gi)].map((m) => (m[1] ? m[1] : Number(m[2])));
  const out = [];
  let i = 0;
  let cx = 0, cy = 0, sx = 0, sy = 0, cmd = '';
  while (i < tokens.length) {
    if (typeof tokens[i] === 'string') { cmd = tokens[i++]; } else if (!cmd) throw new Error('path data starts with a number');
    const up = cmd.toUpperCase();
    if (!(up in ARITY)) throw new Error(`unsupported path command ${cmd}`);
    const rel = cmd !== up;
    if (up === 'Z') { out.push({ c: 'Z', p: [] }); cx = sx; cy = sy; continue; }
    const n = ARITY[up];
    const a = tokens.slice(i, i + n);
    i += n;
    if (a.length < n || a.some((v) => typeof v !== 'number')) throw new Error(`bad arguments for ${cmd}`);
    const ox = rel ? cx : 0, oy = rel ? cy : 0;
    if (up === 'M') { cx = a[0] + ox; cy = a[1] + oy; sx = cx; sy = cy; out.push({ c: 'M', p: [cx, cy] }); cmd = rel ? 'l' : 'L'; }
    else if (up === 'L') { cx = a[0] + ox; cy = a[1] + oy; out.push({ c: 'L', p: [cx, cy] }); }
    else if (up === 'H') { cx = a[0] + ox; out.push({ c: 'L', p: [cx, cy] }); }
    else if (up === 'V') { cy = a[0] + oy; out.push({ c: 'L', p: [cx, cy] }); }
    else if (up === 'Q') { out.push({ c: 'Q', p: [a[0] + ox, a[1] + oy, a[2] + ox, a[3] + oy] }); cx = a[2] + ox; cy = a[3] + oy; }
    else if (up === 'C') { out.push({ c: 'C', p: [a[0] + ox, a[1] + oy, a[2] + ox, a[3] + oy, a[4] + ox, a[5] + oy] }); cx = a[4] + ox; cy = a[5] + oy; }
    else throw new Error(`unsupported path command ${cmd} (smooth curves are not used by this logo)`);
  }
  return out;
}

/** Uniform scale + translate of absolute segments. */
export const transformSegs = (segs, { s = 1, tx = 0, ty = 0 } = {}) => segs.map(({ c, p }) => ({ c, p: p.map((v, k) => v * s + (k % 2 ? ty : tx)) }));

/** "translate(a b) scale(k)" → { s, tx, ty } (the two forms the concept files use). */
export function parseTransform(t = '') {
  const tr = t.match(/translate\(\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*\)/);
  const sc = t.match(/scale\(\s*(-?[\d.]+)\s*\)/);
  return { s: sc ? Number(sc[1]) : 1, tx: tr ? Number(tr[1]) : 0, ty: tr ? Number(tr[2]) : 0 };
}

/**
 * Absolute segments → shortest path data at `decimals` places: relative commands, h/v for axis-aligned lines,
 * t for smooth quadratic joints, no separators where the syntax allows. Rounding is done on the absolute grid, so
 * errors never accumulate along the outline.
 */
export function serialize(segs, decimals = 2) {
  const g = 10 ** decimals;
  const q = (v) => Math.round(v * g);
  const num = (n) => {
    const neg = n < 0;
    let s = String(Math.abs(n));
    if (decimals) {
      s = s.padStart(decimals + 1, '0');
      s = `${s.slice(0, -decimals)}.${s.slice(-decimals)}`.replace(/\.?0+$/, '').replace(/^0(?=\.)/, '');
    }
    return (neg ? '-' : '') + (s === '' ? '0' : s);
  };
  let out = '';
  let last = '';
  let prev = null; // the last number written (string), null right after a command letter
  let cx = 0, cy = 0, sx = 0, sy = 0;
  let prevCtrl = null; // last quadratic control point (grid units), for t
  const push = (cmd, nums) => {
    // A repeated command letter is implicit (never for m/z: an implicit m would become l).
    if (!(cmd === last && !'mz'.includes(cmd))) { out += cmd; prev = null; }
    for (const n of nums) {
      const t = num(n);
      // "1-2" and "1.5.5" parse unambiguously; everything else needs a space.
      if (prev !== null && !(t.startsWith('-') || (t.startsWith('.') && prev.includes('.')))) out += ' ';
      out += t;
      prev = t;
    }
    last = cmd;
  };
  segs.forEach(({ c, p }, idx) => {
    if (c === 'Z') { push('z', []); cx = sx; cy = sy; prevCtrl = null; return; }
    if (c === 'M') {
      const x = q(p[0]), y = q(p[1]);
      if (idx === 0) push('M', [x, y]); else push('m', [x - cx, y - cy]);
      cx = x; cy = y; sx = x; sy = y; prevCtrl = null; return;
    }
    if (c === 'L') {
      const x = q(p[0]), y = q(p[1]);
      const dx = x - cx, dy = y - cy;
      if (dy === 0 && dx !== 0) push('h', [dx]); else if (dx === 0 && dy !== 0) push('v', [dy]); else if (dx || dy) push('l', [dx, dy]);
      cx = x; cy = y; prevCtrl = null; return;
    }
    if (c === 'Q') {
      const c1x = q(p[0]), c1y = q(p[1]), x = q(p[2]), y = q(p[3]);
      let ctrl = [c1x, c1y];
      if (prevCtrl && Math.abs(c1x - (2 * cx - prevCtrl[0])) <= 1 && Math.abs(c1y - (2 * cy - prevCtrl[1])) <= 1) {
        ctrl = [2 * cx - prevCtrl[0], 2 * cy - prevCtrl[1]];
        push('t', [x - cx, y - cy]);
      } else push('q', [c1x - cx, c1y - cy, x - cx, y - cy]);
      prevCtrl = ctrl; cx = x; cy = y; return;
    }
    if (c === 'C') {
      const a = p.map(q);
      push('c', [a[0] - cx, a[1] - cy, a[2] - cx, a[3] - cy, a[4] - cx, a[5] - cy]);
      cx = a[4]; cy = a[5]; prevCtrl = null;
    }
  });
  return out;
}

const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];

/** Parses a concept SVG: two paint groups (ink, accent), each with paths that may carry a transform. */
function readConcept(file) {
  const svg = fs.readFileSync(file, 'utf8');
  const viewBox = attr(svg.match(/<svg[^>]*>/)[0], 'viewBox');
  const groups = [...svg.matchAll(/<g\b([^>]*)>([\s\S]*?)<\/g>/g)];
  if (groups.length !== 2) throw new Error(`${file}: expected 2 paint groups, got ${groups.length}`);
  const segsOf = (inner) => [...inner.matchAll(/<path\b([^>]*)\/>/g)].flatMap((m) => transformSegs(parsePath(attr(m[0], 'd')), parseTransform(attr(m[0], 'transform'))));
  return { viewBox, ink: segsOf(groups[0][2]), accent: segsOf(groups[1][2]) };
}

/* ─── Standalone SVG files ─────────────────────────────────────── */

const styleBlock = () => `<style>path{fill:${T.light.ink}}.a{fill:${T.light.accent}}@media(prefers-color-scheme:dark){path{fill:${T.dark.ink}}.a{fill:${T.dark.accent}}}</style>`;
const round1 = (n) => Math.round(n * 100) / 100;

function standalone({ viewBox, ink, accent }, label, px) {
  const [, , w, h] = viewBox.split(/\s+/).map(Number);
  const size = px ? ` width="${round1(w * px / h)}" height="${px}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${size} role="img" aria-label="${label}">${styleBlock()}<path d="${serialize(ink, 2)}"/><path class="a" d="${serialize(accent, 2)}"/></svg>\n`;
}

function buildSvgs() {
  fs.mkdirSync(BRAND_DIR, { recursive: true });
  const files = {};
  const sym = readConcept(path.join(CONCEPT, 'symbol.svg'));
  const hor = readConcept(path.join(CONCEPT, 'lockup-horizontal.svg'));
  const stk = readConcept(path.join(CONCEPT, 'lockup-stacked.svg'));
  files['symbol.svg'] = standalone(sym, 'Home View 3D', 64);
  files['lockup-horizontal.svg'] = standalone(hor, 'Home View 3D', 64);
  files['lockup-stacked.svg'] = standalone(stk, 'Home View 3D', 128);
  for (const [name, text] of Object.entries(files)) write(path.join(BRAND_DIR, name), text);

  // Inline lockup for the header/footer: redrawn in a 32-unit-tall system (1 unit = 1 px at the desktop size, 0.875 px on
  // phones) with one decimal, i.e. at most 0.05 px off at 32 px tall. Numbers get shorter, so the markup is about a
  // third of the concept file. --verify rasterises it at 1x, 2x and 3x against the original.
  const inline = inlineLockup(hor);
  const s2 = Buffer.byteLength(serialize(hor.ink, 2) + serialize(hor.accent, 2));
  const s1 = Buffer.byteLength(inline.ink + inline.accent);
  write(GENERATED, `${JSON.stringify({ horizontal: inline }, null, 2)}
`);
  console.log(`[brand] svg: ${Object.entries(files).map(([n, t]) => `${n} ${kb(Buffer.byteLength(t))}`).join(' · ')} · inline lockup ${s1} B (concept file paths at 2 decimals: ${s2} B)`);
  return { sym, hor, stk, inline };
}

/** The horizontal lockup in a viewBox 32 units tall (the desktop header height), one decimal. */
export const INLINE_H = 32;
function inlineLockup(hor) {
  const [, , vw, vh] = hor.viewBox.split(/\s+/).map(Number);
  const k = INLINE_H / vh;
  const t = (segs) => serialize(transformSegs(segs, { s: k }), 1);
  return { viewBox: `0 0 ${Math.round(vw * k * 100) / 100} ${INLINE_H}`, ink: t(hor.ink), accent: t(hor.accent) };
}

/* ─── Verification (raster diff against the concept files) ─────── */

async function raster(svg, w) {
  const vw = Number(svg.match(/viewBox="[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)/)[1]);
  const { data, info } = await sharp(Buffer.from(svg), { density: (72 * w) / vw }).resize({ width: w }).flatten({ background: '#ffffff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  return { data, ...info };
}
async function verify(name, conceptFile, ours) {
  const src = fs.readFileSync(conceptFile, 'utf8').replace(/<style>[\s\S]*?<\/style>/, '').replace(/style="[^"]*"/g, '');
  const black = (s) => s.replace(/currentColor/g, '#000');
  const a = await raster(black(src.replace(/ width="[^"]*" height="[^"]*"/, '')), 2400);
  const b = await raster(ours, 2400);
  let diff = 0;
  for (let i = 0; i < a.data.length; i++) if (Math.abs(a.data[i] - b.data[i]) > 96) diff++;
  const pct = (diff / a.data.length) * 100;
  const ok = pct < 0.06;
  console.log(`  ${ok ? '✓' : '✗'} verify ${name}: ${pct.toFixed(4)} % of pixels differ (>96/255) at 2400 px wide`);
  if (!ok) process.exitCode = 1;
}
async function verifyAll(parts) {
  const mono = ({ viewBox, ink, accent }, dec) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="#000" d="${serialize(ink, dec)}"/><path fill="#000" d="${serialize(accent, dec)}"/></svg>`;
  await verify('lockup-horizontal (2 decimals)', path.join(CONCEPT, 'lockup-horizontal.svg'), mono(parts.hor, 2));
  await verify('lockup-stacked (2 decimals)', path.join(CONCEPT, 'lockup-stacked.svg'), mono(parts.stk, 2));
  await verify('symbol (2 decimals)', path.join(CONCEPT, 'symbol.svg'), mono(parts.sym, 2));
  // The inline header lockup at what a browser really paints: 32 px and 28 px tall, at 1x, 2x and 3x device pixels.
  const inl = parts.inline;
  const inlSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${inl.viewBox}"><path fill="#000" d="${inl.ink}"/><path fill="#000" d="${inl.accent}"/></svg>`;
  const orig = fs.readFileSync(path.join(CONCEPT, 'lockup-horizontal.svg'), 'utf8').replace(/<title[\s\S]*?<\/title>/, '').replace(/style="[^"]*"/g, '').replace(/currentColor/g, '#000').replace(/ width="[^"]*" height="[^"]*"/, '');
  for (const h of [28, 32]) for (const dpr of [1, 2, 3]) {
    const w = Math.round((525.24 / 100) * h * dpr);
    const a = await raster(orig, w), b = await raster(inlSvg, w);
    let sum = 0, worst = 0;
    for (let i = 0; i < a.data.length; i++) { const d = Math.abs(a.data[i] - b.data[i]); sum += d; if (d > worst) worst = d; }
    const mean = sum / a.data.length;
    const ok = mean < 1.2 && worst < 110; // sub-pixel edge shifts only (max 0.05 px at 32 px tall)
    console.log(`  ${ok ? '✓' : '✗'} verify inline lockup at ${h}px x${dpr}: mean abs difference ${mean.toFixed(3)}/255, worst pixel ${worst}/255`);
    if (!ok) process.exitCode = 1;
  }
}

/* ─── Icons ───────────────────────────────────────────────────── */

/** Bounding box of absolute segments (control points included: a safe over-estimate for the safe zone). */
function bounds(segs) {
  const xs = [], ys = [];
  for (const { p } of segs) p.forEach((v, i) => (i % 2 ? ys : xs).push(v));
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/**
 * Square icon: `bg` tile (or none) and the symbol in `ink` (+ `floor` for the añil part), centred by its bounding
 * box. `height` = the symbol's height as a fraction of the tile; `fit` bounds its half diagonal (maskable safe zone).
 */
function iconSvg(sym, size, { bg, ink, floor, height, safeRadius }) {
  const all = [...sym.ink, ...sym.accent];
  const b = bounds(all);
  const w = b.x1 - b.x0, h = b.y1 - b.y0;
  let s = (size * height) / h;
  if (safeRadius) s = Math.min(s, (size * safeRadius) / (Math.hypot(w, h) / 2));
  const tx = size / 2 - ((b.x0 + b.x1) / 2) * s, ty = size / 2 - ((b.y0 + b.y1) / 2) * s;
  const d = (segs) => serialize(transformSegs(segs, { s, tx, ty }), 3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''}<path fill="${ink}" d="${d(sym.ink)}"/><path fill="${floor}" d="${d(sym.accent)}"/></svg>`;
}
const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** ICO container with PNG entries (Vista and later, every current browser). */
function ico(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const dir = images.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size; e[1] = size >= 256 ? 0 : size;
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  return Buffer.concat([head, ...dir, ...images.map((i) => i.buf)]);
}

async function buildIcons(sym) {
  const tile = T.light.accent;
  const mark = T.light.onAccent;
  const one = (size, height, safeRadius) => iconSvg(sym, size, { bg: tile, ink: mark, floor: mark, height, safeRadius });
  const out = {};
  // Tab / shortcut sizes: a bigger mark keeps the door notch readable.
  out['favicon.ico'] = ico(await Promise.all([[16, 0.88], [32, 0.78], [48, 0.74]].map(async ([size, h]) => ({ size, buf: await png(one(size, h), size) }))));
  out['apple-touch-icon.png'] = await png(one(180, 0.62), 180);
  // Maskable: the whole mark (its half diagonal) inside the 80 % safe circle, with a little air.
  out['icon-192.png'] = await png(one(192, 0.7, 0.36), 192);
  out['icon-512.png'] = await png(one(512, 0.7, 0.36), 512);
  // Themeable favicon: transparent, colours switch with the browser's colour scheme inside the file.
  const b = bounds([...sym.ink, ...sym.accent]);
  const pad = 1.5;
  const vb = [b.x0 - pad, b.y0 - pad, b.x1 - b.x0 + 2 * pad, b.y1 - b.y0 + 2 * pad].map((v) => Math.round(v * 100) / 100);
  const side = Math.max(vb[2], vb[3]);
  vb[0] -= (side - vb[2]) / 2; vb[1] -= (side - vb[3]) / 2; vb[2] = side; vb[3] = side;
  out['favicon.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map((v) => Math.round(v * 100) / 100).join(' ')}">${styleBlock()}<path d="${serialize(sym.ink, 2)}"/><path class="a" d="${serialize(sym.accent, 2)}"/></svg>\n`;
  for (const [name, buf] of Object.entries(out)) write(path.join(PUBLIC, name), buf);
  // Logo for schema.org: the symbol on the paper colour, opaque.
  const logo = iconSvg(sym, 512, { bg: T.light.bg, ink: T.light.ink, floor: T.light.accent, height: 0.62 });
  const logoPng = await png(logo, 512);
  write(path.join(BRAND_DIR, 'logo-512.png'), logoPng);
  console.log(`[brand] icons: ${[...Object.entries(out), ['assets/brand/logo-512.png', logoPng]].map(([n, b2]) => `${n} ${kb(b2.length)}`).join(' · ')}`);
}

/* ─── OG images ───────────────────────────────────────────────── */

async function buildOg(hor) {
  fs.mkdirSync(OG_OUT, { recursive: true });
  const inl = inlineLockup(hor);
  const [, , vw, vh] = inl.viewBox.split(/\s+/).map(Number);
  const lockH = 46; // px in the 1200 x 630 frame: the wordmark cap is 16.8 px, readable in 600 px wide link previews
  const lockW = (vw * lockH) / vh;
  const padX = 26, padY = 18, margin = 36;
  const plateW = Math.round(lockW + 2 * padX), plateH = lockH + 2 * padY;
  const x = margin, y = 630 - margin - plateH;
  const k = lockH / vh;
  const [pr, pg, pb] = hex(T.light.bg);
  const ink = inl.ink, acc = inl.accent;
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">`
    + `<rect x="${x}" y="${y}" width="${plateW}" height="${plateH}" fill="rgb(${pr} ${pg} ${pb})" fill-opacity="0.94"/>`
    + `<g transform="translate(${x + padX} ${y + padY}) scale(${k})"><path fill="${T.light.ink}" d="${ink}"/><path fill="${T.light.accent}" d="${acc}"/></g></svg>`);
  const names = fs.existsSync(OG_SRC) ? fs.readdirSync(OG_SRC).filter((f) => /\.jpe?g$/i.test(f)).sort() : [];
  let total = 0, skipped = 0;
  const keep = new Set();
  for (const f of names) {
    const src = path.join(OG_SRC, f);
    const meta = await sharp(src).metadata();
    if (meta.width !== 1200 || meta.height !== 630) { skipped++; continue; }
    // Same encoder family as scripts/images.mjs; lower the quality in steps if a plate ever pushed it past 150 KB (IMG-12).
    let buf;
    for (const quality of [84, 80, 76, 72, 68]) {
      buf = await sharp(src).composite([{ input: overlay }]).jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' }).toBuffer();
      if (buf.length <= 150 * 1024) break;
    }
    write(path.join(OG_OUT, f), buf);
    keep.add(f);
    total += buf.length;
  }
  // Branded copies whose original is gone are stale.
  for (const f of fs.existsSync(OG_OUT) ? fs.readdirSync(OG_OUT) : []) if (!keep.has(f) && /\.jpe?g$/i.test(f)) { fs.rmSync(path.join(OG_OUT, f)); console.log(`  - removed stale og-brand/${f}`); }
  console.log(`[brand] og: ${keep.size} branded (${kb(total)} total, plate ${plateW}x${plateH} at ${x},${y})${skipped ? `, ${skipped} skipped (not 1200x630)` : ''}`);
}

/* ─── Helpers ─────────────────────────────────────────────────── */

/** Writes only when the bytes changed (keeps mtimes stable for the incremental steps that watch them). */
function write(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buf)) return;
  fs.writeFileSync(file, buf);
}

async function main() {
  const t0 = Date.now();
  console.log(`[brand] tokens: paper ${T.light.bg} · ink ${T.light.ink} · añil ${T.light.accent} | dark ink ${T.dark.ink} · añil ${T.dark.accent}`);
  const parts = buildSvgs();
  if (VERIFY) await verifyAll(parts);
  if (want('icons')) await buildIcons(parts.sym);
  if (want('og')) await buildOg(parts.hor);
  console.log(`[brand] done in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
