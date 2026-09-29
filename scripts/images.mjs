#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   scripts/images.mjs · renders → responsive AVIF/WebP + OG crops + manifest
   Contract: docs/build/BUILD-SPEC.md §10 (ASSETS). Rules: DESIGN-RULEBOOK A8, A12.

   In:   source/villa3d/renders/*.png            (files starting with "_" are ignored)
   Out:  public/assets/img/<name>-<w>.{avif,webp} widths [480, 800, 1200, 1600, 2400] ≤ source width
         public/assets/img/og/<name>.jpg          1200×630, ≤ 150 KB
         build/generated/images.json              manifest read by the engine (ctx.img / picture())

   Notes
   - RGBA renders keep their alpha (IMG-06); fully opaque sources are encoded without alpha.
   - `<name>_opaco` renders are re-composited from their RGBA sibling over the light
     `--color-stage` token (tokens.css), so opaque plates match the cool-grey B2 palette
     (COLOR-04/07) instead of the warm #EFEBE4 they were rendered on. Change the token → rerun.
   - Budgets are enforced by lowering the quality in steps (never below QMIN); a budget that still
     fails makes the script exit 1.
   - Incremental: a source whose bytes, settings and outputs are unchanged is skipped
     (cache in node_modules/.cache/images.json). `--force` re-encodes everything.

   Usage: node scripts/images.mjs [--force] [--only a,b] [--check]
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'source/villa3d/renders');
const OUT_DIR = path.join(ROOT, 'public/assets/img');
const OG_DIR = path.join(OUT_DIR, 'og');
const MANIFEST = path.join(ROOT, 'build/generated/images.json');
const CACHE = path.join(ROOT, 'node_modules/.cache/images.json');
const PUBLIC_BASE = '/assets/img';

const VERSION = 5;    // bump when the AVIF/WebP encoding logic changes (invalidates those outputs)
const OG_VERSION = 3; // bump when the OG/placeholder logic changes (re-does only the OG crops)
const WIDTHS = [480, 800, 1200, 1600, 2400];
const FALLBACK_W = 1200;
const OG = { width: 1200, height: 630, pad: 40, maxBytes: 150 * 1024 };
const QMIN = { avif: 38, webp: 60, jpeg: 60 };

// Encoder settings, tuned by eye on 2-3x crops against the PNG masters (2026-09-28).
// Full-frame renders (interiors, terrace, OG): AVIF q68 4:2:0 is visually on par with WebP q80 and
// ~25 % smaller, so the AVIF that browsers pick is never heavier than the WebP fallback.
const DEFAULTS = {
  avif: { quality: 68, effort: 6, chromaSubsampling: '4:2:0' },
  webp: { quality: 80, alphaQuality: 90, effort: 6, smartSubsample: true },
  jpeg: { quality: 82, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' },
};
// Per-image overrides (first matching rule wins, merged over DEFAULTS).
// 4:4:4 keeps thin dark lines (poché, joinery, Freestyle) free of colour bleed.
const OVERRIDES = [
  // Line art on white: otherwise the 1.6 px Freestyle lines ring and grey out.
  [/^villa_plano_lineas$/, { avif: { quality: 82, chromaSubsampling: '4:4:4' }, webp: { quality: 90 } }],
  // Hero/LCP objects on transparent film: mostly empty pixels, so high quality stays far below budget.
  // villa_viewer_poster_mobile: the same model-viewer capture framed 4:5 for the portrait stage (≤ 767 px).
  [/^villa_(maqueta_iso|viewer_poster(_mobile)?|despiece_\d)$/, { avif: { quality: 82, chromaSubsampling: '4:4:4' } }],
  [/^villa_(maqueta_iso|muros_completos)(_opaco)?$/, { avif: { quality: 76, chromaSubsampling: '4:4:4' } }],
  // Colour plan: thin black walls between coloured floors, so 4:4:4. It is a tall 2400×3700 plate used as the
  // LCP hero of guides/zones: q66 at effort 9 (≈3× slower, same bytes) keeps SSIM within 0.001 of the old
  // q70/effort 6 (no visible difference on 3× crops, shadow alpha unbanded) and brings 1200w 114 → 100 KB,
  // 1600w 169 → 148 KB (2026-09-28).
  [/^villa_planta_cenital(_opaco)?$/, { avif: { quality: 66, effort: 9, chromaSubsampling: '4:4:4' } }],
  // Eye-level interiors: long, soft gradients on plaster, ceiling and sky. q68 flattens the plaster grain and
  // leaves faint blotches in the wall falloff on 2× crops; q76 keeps them for ~45 KB at 1200w (budget 120 KB).
  [/^villa_interior_/, { avif: { quality: 76 }, webp: { quality: 84 } }],
];
const overridesFor = (name) => OVERRIDES.find(([re]) => re.test(name))?.[1];
// Byte budgets per variant (BUILD-SPEC §10/§11, rulebook IMG-05/PERF-04).
const POSTER_BUDGET = { 'avif-1200': 120 * 1024, 'avif-800': 80 * 1024 };
// LCP plates: the lint measures the AVIF closest to 1200w (phones); 1600w is what DPR-2 desktops pick.
const PLAN_BUDGET = { 'avif-1200': 110 * 1024, 'avif-1600': 150 * 1024 };
// Eye-level interiors (villa_interiores.py): full-bleed stage bands and gallery openers, 1200w AVIF ≤ 120 KB.
const INTERIOR_BUDGET = { 'avif-1200': 120 * 1024 };
const BUDGETS = {
  villa_interior_salon: INTERIOR_BUDGET,
  villa_interior_dormitorio: INTERIOR_BUDGET,
  villa_interior_bano: INTERIOR_BUDGET,
  villa_interior_terraza: INTERIOR_BUDGET,
  villa_maqueta_iso: POSTER_BUDGET,
  villa_viewer_poster: POSTER_BUDGET,
  villa_viewer_poster_mobile: POSTER_BUDGET,
  villa_planta_cenital: PLAN_BUDGET,
  villa_planta_cenital_opaco: PLAN_BUDGET,
};
// Group budgets: sum of variants across several images.
const GROUP_BUDGETS = [
  { names: ['villa_despiece_1', 'villa_despiece_2', 'villa_despiece_3'], variant: 'avif-1200', max: 180 * 1024 },
];

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const CHECK_ONLY = args.includes('--check');
const ONLY = (() => {
  const i = args.indexOf('--only');
  return i >= 0 ? new Set(args[i + 1].split(',').map((s) => s.trim())) : null;
})();

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };
const merge = (a, b) => Object.fromEntries(Object.keys(a).map((k) => [k, { ...a[k], ...(b?.[k] || {}) }]));

/** Light-theme colour token (engine copy first, canonical doc second). The first match is the :root value. */
function token(name, fallback) {
  for (const p of ['src/css/00-tokens.css', 'docs/design/tokens.css']) {
    const f = path.join(ROOT, p);
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, 'utf8').match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
    if (m) return m[1].toUpperCase();
  }
  return fallback;
}
const stageColour = () => token('color-stage', '#E4E7EA');
const hexToRgb = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) });

/** Pipeline for a source: plain file, or `_opaco` rebuilt from its RGBA sibling over the stage colour. */
function sourceOf(name, file, stage) {
  const sibling = name.endsWith('_opaco') ? path.join(SRC_DIR, `${name.slice(0, -6)}.png`) : null;
  if (sibling && fs.existsSync(sibling)) {
    return { file: sibling, recomposed: true, open: () => sharp(sibling).flatten({ background: stage }) };
  }
  return { file, recomposed: false, open: () => sharp(file) };
}

async function encode(pipeline, fmt, opts) {
  if (fmt === 'avif') return pipeline.avif(opts).toBuffer();
  if (fmt === 'webp') return pipeline.webp(opts).toBuffer();
  return pipeline.jpeg(opts).toBuffer();
}

/** Encode with the configured quality; if a budget is set and exceeded, step the quality down. */
async function encodeWithin(make, fmt, opts, max) {
  let q = opts.quality;
  for (;;) {
    const buf = await encode(make(), fmt, { ...opts, quality: q });
    if (!max || buf.length <= max || q <= QMIN[fmt]) return { buf, quality: q, over: max && buf.length > max };
    q = Math.max(QMIN[fmt], q - 4);
  }
}

/** Fraction of pixels with alpha < 8 (sampled on a 256 px thumbnail). */
async function transparentFraction(open) {
  const { data, info } = await open().resize({ width: 256 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 8) n++;
  return n / (info.width * info.height);
}

/** Top-left pixel colour (the paper of an opaque plate); a transparent corner means "sits on the stage". */
async function cornerColour(open, stage) {
  const { data } = await open().extract({ left: 0, top: 0, width: 1, height: 1 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return data[3] < 128 ? stage : { r: data[0], g: data[1], b: data[2] };
}

/**
 * OG crop, 1200×630 JPG.
 * - Objects on transparent film (≥ 15 % transparent): trim, contain with padding, flatten on the stage.
 * - Portrait/square opaque plates: trim the paper, contain with padding on the paper colour.
 * - Landscape plates (aspect ≥ 1.3): cover crop, centred.
 */
async function makeOg(src, meta, tFrac, stage, jpegOpts) {
  const { width: W, height: H, pad } = OG;
  const aspect = meta.width / meta.height;
  let make;
  if (meta.hasAlpha && tFrac >= 0.15) {
    const trimmed = await src.open().trim({ threshold: 4 }).png().toBuffer();
    // Two pipelines: sharp applies flatten() before resize/extend, so the padding must exist first.
    const framed = await sharp(trimmed)
      .resize({ width: W - 2 * pad, height: H - 2 * pad, fit: 'contain', background: { ...stage, alpha: 0 } })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { ...stage, alpha: 0 } })
      .png().toBuffer();
    make = () => sharp(framed).flatten({ background: stage });
  } else if (aspect < 1.3) {
    const paper = await cornerColour(src.open, stage);
    const trimmed = await src.open().flatten({ background: paper }).trim({ threshold: 6 }).png().toBuffer();
    make = () => sharp(trimmed)
      .resize({ width: W - 2 * pad, height: H - 2 * pad, fit: 'contain', background: paper })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: paper });
  } else {
    make = () => src.open().flatten({ background: stage }).resize({ width: W, height: H, fit: 'cover', position: 'centre' });
  }
  return encodeWithin(make, 'jpeg', jpegOpts, OG.maxBytes);
}

async function placeholder(src, alpha) {
  let p = src.open().resize({ width: 24 }).blur(0.6);
  if (!alpha) p = p.removeAlpha();
  const buf = await p.webp({ quality: 45, alphaQuality: 50, effort: 6 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function processImage(name, file, stage, cache) {
  const src = sourceOf(name, file, stage);
  const bytes = fs.readFileSync(src.file);
  const settings = merge(DEFAULTS, overridesFor(name));
  const hash = (o) => crypto.createHash('sha1').update(bytes).update(JSON.stringify(o)).digest('hex');
  const recomposedOn = src.recomposed ? stage : null;
  const key = hash({ VERSION, settings: { avif: settings.avif, webp: settings.webp }, WIDTHS, stage: recomposedOn, budget: BUDGETS[name] || null });
  const ogKey = hash({ OG_VERSION, jpeg: settings.jpeg, OG, stage });

  const meta = await src.open().metadata();
  const stats = await src.open().stats();
  const alpha = src.recomposed ? false : meta.hasAlpha && !stats.isOpaque;
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  const outFile = (w, ext) => path.join(OUT_DIR, `${name}-${w}.${ext}`);
  const ogFile = path.join(OG_DIR, `${name}.jpg`);

  const cached = cache[name];
  const variantsExist = widths.every((w) => fs.existsSync(outFile(w, 'avif')) && fs.existsSync(outFile(w, 'webp')));
  const variantsFresh = !FORCE && cached && cached.key === key && variantsExist;
  const ogFresh = !FORCE && cached && cached.ogKey === ogKey && fs.existsSync(ogFile);
  if (variantsFresh && ogFresh) return { entry: cached.entry, skipped: true, qualities: cached.qualities };
  if (CHECK_ONLY) throw new Error(`${name}: outputs missing or stale (run npm run images)`);

  const entry = variantsFresh ? { ...cached.entry, bytes: { ...cached.entry.bytes } } : {
    width: meta.width,
    height: meta.height,
    alpha,
    widths,
    formats: ['avif', 'webp'],
    path: `${PUBLIC_BASE}/${name}-{w}.{ext}`,
    fallback: `${PUBLIC_BASE}/${name}-${widths.includes(FALLBACK_W) ? FALLBACK_W : widths.filter((w) => w <= FALLBACK_W).pop() ?? widths[0]}.webp`,
    og: `${PUBLIC_BASE}/og/${name}.jpg`,
    placeholder: '',
    bytes: {},
  };
  const qualities = variantsFresh ? { ...cached.qualities } : {};
  const budgets = BUDGETS[name] || {};

  for (const w of variantsFresh ? [] : widths) {
    const make = () => {
      let p = src.open().resize({ width: w, kernel: 'lanczos3' });
      if (!alpha) p = p.removeAlpha();
      return p;
    };
    for (const fmt of ['avif', 'webp']) {
      const k = `${fmt}-${w}`;
      const r = await encodeWithin(make, fmt, settings[fmt], budgets[k]);
      if (r.over) console.warn(`  ! ${name} ${k} ${kb(r.buf.length)} exceeds budget ${kb(budgets[k])} even at q${r.quality}`);
      fs.writeFileSync(outFile(w, fmt), r.buf);
      entry.bytes[k] = r.buf.length;
      qualities[k] = r.quality;
    }
  }

  const tFrac = meta.hasAlpha && !src.recomposed ? await transparentFraction(src.open) : 0;
  const og = await makeOg(src, meta, tFrac, hexToRgb(stage), settings.jpeg);
  if (og.over) console.warn(`  ! ${name} og ${kb(og.buf.length)} exceeds ${kb(OG.maxBytes)}`);
  fs.writeFileSync(ogFile, og.buf);
  entry.bytes.og = og.buf.length;
  qualities.og = og.quality;
  entry.placeholder = await placeholder(src, alpha);

  cache[name] = { key, ogKey, entry, qualities };
  return { entry, skipped: false, qualities };
}

/* ---------- Favicons (rulebook BRAND-04): flat square in --color-accent, no letter mark ----------
   Regenerated from the token on every run, so a new accent in tokens.css updates them (BRAND-05). */
const PUBLIC = path.join(ROOT, 'public');

/** ICO container with PNG-compressed entries (supported by every browser since IE Vista-era). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o); dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2); dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8); dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]);
}

async function favicons() {
  const accent = token('color-accent', '#2D4596');
  const square = (size) => sharp({ create: { width: size, height: size, channels: 3, background: accent } })
    .png({ compressionLevel: 9, palette: true }).toBuffer();
  const out = {
    'favicon.svg': Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${accent}"/></svg>
`),
    'favicon.ico': ico([{ size: 16, buf: await square(16) }, { size: 32, buf: await square(32) }]),
    'apple-touch-icon.png': await square(180),
    'icon-192.png': await square(192),
    'icon-512.png': await square(512),
  };
  const sizes = {};
  for (const [name, buf] of Object.entries(out)) {
    const f = path.join(PUBLIC, name);
    if (!fs.existsSync(f) || !fs.readFileSync(f).equals(buf)) fs.writeFileSync(f, buf);
    sizes[name] = buf.length;
  }
  console.log(`[images] favicons ${accent}: ${Object.entries(sizes).map(([n, b]) => `${n} ${b} B`).join(' · ')}`);
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
}

async function main() {
  const t0 = Date.now();
  fs.mkdirSync(OG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  const stage = stageColour();
  if (!CHECK_ONLY) await favicons();
  const cache = FORCE ? {} : readJson(CACHE, {});
  const previous = readJson(MANIFEST, {});

  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.png') && !f.startsWith('_')).sort();
  const todo = files.map((f) => ({ name: f.slice(0, -4), file: path.join(SRC_DIR, f) }));
  const selected = ONLY ? todo.filter((t) => ONLY.has(t.name)) : todo;

  console.log(`[images] ${selected.length} source(s) · stage ${stage}${FORCE ? ' · --force' : ''}`);
  const results = await pool(selected, 3, async (t) => {
    const r = await processImage(t.name, t.file, stage, cache);
    const b = r.entry.bytes;
    const line = r.entry.widths.map((w) => `${w}: ${kb(b[`avif-${w}`])}/${kb(b[`webp-${w}`])}`).join(' · ');
    console.log(`  ${r.skipped ? '=' : '+'} ${t.name.padEnd(32)} ${r.entry.width}×${r.entry.height}${r.entry.alpha ? ' α' : '  '}  avif/webp ${line} · og ${kb(b.og)}`);
    return [t.name, r.entry];
  });

  // Manifest: every current source (entries for sources not selected with --only are kept from the previous run).
  const manifest = {};
  for (const t of todo) {
    const hit = results.find(([n]) => n === t.name);
    if (hit) manifest[t.name] = hit[1];
    else if (previous[t.name]) manifest[t.name] = previous[t.name];
  }
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(CACHE, JSON.stringify(cache));

  // Remove outputs of sources that no longer exist (only files that follow our naming scheme).
  if (!ONLY) {
    const keep = new Set();
    for (const [name, e] of Object.entries(manifest)) {
      for (const w of e.widths) for (const ext of e.formats) keep.add(`${name}-${w}.${ext}`);
      keep.add(`og/${name}.jpg`);
    }
    for (const f of fs.readdirSync(OUT_DIR)) {
      if (/-\d+\.(avif|webp)$/.test(f) && !keep.has(f)) { fs.rmSync(path.join(OUT_DIR, f)); console.log(`  - removed stale ${f}`); }
    }
    for (const f of fs.readdirSync(OG_DIR)) {
      if (f.endsWith('.jpg') && !keep.has(`og/${f}`)) { fs.rmSync(path.join(OG_DIR, f)); console.log(`  - removed stale og/${f}`); }
    }
  }

  // Budgets.
  let failed = false;
  for (const [name, b] of Object.entries(BUDGETS)) {
    const e = manifest[name];
    if (!e) continue;
    for (const [k, max] of Object.entries(b)) {
      if (e.bytes[k] > max) { failed = true; console.error(`  ✗ budget ${name} ${k}: ${kb(e.bytes[k])} > ${kb(max)}`); }
      else console.log(`  ✓ budget ${name} ${k}: ${kb(e.bytes[k])} ≤ ${kb(max)}`);
    }
  }
  for (const g of GROUP_BUDGETS) {
    if (!g.names.every((n) => manifest[n])) continue;
    const sum = g.names.reduce((s, n) => s + manifest[n].bytes[g.variant], 0);
    if (sum > g.max) { failed = true; console.error(`  ✗ budget ${g.names.join('+')} ${g.variant}: ${kb(sum)} > ${kb(g.max)}`); }
    else console.log(`  ✓ budget ${g.names.join('+')} ${g.variant}: ${kb(sum)} ≤ ${kb(g.max)}`);
  }
  for (const [name, e] of Object.entries(manifest)) {
    if (e.bytes.og > OG.maxBytes) { failed = true; console.error(`  ✗ og ${name}: ${kb(e.bytes.og)} > ${kb(OG.maxBytes)}`); }
  }

  const total = Object.values(manifest).reduce((s, e) => s + Object.values(e.bytes).reduce((a, b) => a + b, 0), 0);
  console.log(`[images] ${Object.keys(manifest).length} images · ${(total / 1024 / 1024).toFixed(2)} MB of variants · ${((Date.now() - t0) / 1000).toFixed(1)} s → ${path.relative(ROOT, MANIFEST)}`);
  if (failed) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
