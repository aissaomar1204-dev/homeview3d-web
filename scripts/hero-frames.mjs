// Hero sequence encoder: Blender masters -> web frames + build/generated/hero.json
//
//   node scripts/hero-frames.mjs [--src DIR] [--desktop-budget BYTES] [--mobile-budget BYTES] [--rung N]
//
// In : source/villa3d/renders/hero/hero_000.png .. hero_047.png   (1400x900 RGBA masters)
//      source/villa3d/renders/hero/hero_plan_lines.png            (registered with frame 0)
//      source/villa3d/renders/hero/hero_points.json               (timeline + projected points, from hero_frames.py)
// Out: public/assets/hero/d/hero-###.webp                (1400 px wide, RGBA)
//      public/assets/hero/m/hero-###.webp                (700 px wide, RGBA)
//      public/assets/hero/hero-plan-lines-1400.webp / -700.webp
//      build/generated/hero.json                         (what the front-end reads)
//
// Budgets (all 48 frames together, decimal MB): desktop <= 2.4 MB, mobile <= 0.9 MB.
//
// Why the alpha channel gets its own treatment: the transparent background carries a soft ground shadow
// (shadow catcher) whose alpha has ~2 % render noise. Lossless alpha coded that noise (120 KB per frame, more than
// the whole picture). So the pixels that are pure shadow (colour exactly black, not opaque) are denoised with an
// edge-preserving bilateral filter (crisp shadow edges and the model silhouette are kept) and, if the budget needs it,
// reduced to 128-160 levels (steps of about 2 code values on the light stage: no visible banding). Geometry pixels
// (anything with colour, including 1 px railings and antialiased edges) are never touched.
// The encoder walks a quality ladder (colour quality, shadow levels) and takes the best rung that fits the budget.
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, def) => {
  const i = process.argv.indexOf('--' + name);
  return i > 0 ? process.argv[i + 1] : def;
};
const SRC = path.resolve(ROOT, arg('src', 'source/villa3d/renders/hero'));
const OUT = path.join(ROOT, 'public/assets/hero');
const GEN = path.join(ROOT, 'build/generated/hero.json');
const DESKTOP_BUDGET = +arg('desktop-budget', 2_400_000);
const MOBILE_BUDGET = +arg('mobile-budget', 900_000);
const FIXED_RUNG = arg('rung', null);
const WIDTHS = { d: 1400, m: 700 };
const PAD = 3;
const pad = (n) => String(n).padStart(PAD, '0');

// best -> worst. q = WebP colour quality, levels = alpha levels kept in the shadow (256 = full 8 bit)
const LADDER = [
  { q: 80, levels: 256 }, { q: 75, levels: 256 }, { q: 70, levels: 192 }, { q: 66, levels: 160 },
  { q: 62, levels: 160 }, { q: 60, levels: 128 }, { q: 56, levels: 128 }, { q: 52, levels: 128 },
  { q: 50, levels: 96 }, { q: 46, levels: 96 }, { q: 42, levels: 96 }, { q: 38, levels: 80 },
];

const meta = JSON.parse(await readFile(path.join(SRC, 'hero_points.json'), 'utf8'));
const NF = meta.frames;

// ---------------------------------------------------------------------------------------------------
// shadow alpha clean-up
// ---------------------------------------------------------------------------------------------------
/** Bilateral filter on the alpha of shadow-only pixels. Returns a Float32Array (0-1) or null if nothing to do. */
function smoothShadow(raw, { rad, ss, sr, iters }) {
  const { data, width: W, height: H } = raw;
  const N = W * H;
  const mask = new Uint8Array(N);
  const A = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const a = data[i * 4 + 3];
    A[i] = a / 255;
    // shadow catcher output: colour exactly black, alpha below opaque. Fully transparent pixels take part too.
    mask[i] = a === 0 || (a < 250 && data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2] <= 6) ? 1 : 0;
  }
  // integral image of "has some alpha": only filter where the window sees a shadow (skip empty space)
  const S = new Int32Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) {
    let row = 0;
    for (let x = 0; x < W; x++) {
      row += data[(y * W + x) * 4 + 3] > 0 ? 1 : 0;
      S[(y + 1) * (W + 1) + x + 1] = S[y * (W + 1) + x + 1] + row;
    }
  }
  const win = (x, y) => {
    const x0 = Math.max(0, x - rad), x1 = Math.min(W, x + rad + 1), y0 = Math.max(0, y - rad), y1 = Math.min(H, y + rad + 1);
    return S[y1 * (W + 1) + x1] - S[y0 * (W + 1) + x1] - S[y1 * (W + 1) + x0] + S[y0 * (W + 1) + x0];
  };
  const taps = [];
  for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
    taps.push([dy * W + dx, dx, dy, Math.exp(-(dx * dx + dy * dy) / (2 * ss * ss))]);
  }
  let cur = A;
  for (let it = 0; it < iters; it++) {
    const nxt = Float32Array.from(cur);
    for (let y = rad; y < H - rad; y++) {
      for (let x = rad; x < W - rad; x++) {
        const i = y * W + x;
        if (!mask[i] || !win(x, y)) continue;
        const c = cur[i];
        let s = 0, n = 0;
        for (const [off, , , w] of taps) {
          const j = i + off;
          if (!mask[j]) continue;
          const d = cur[j] - c;
          const wr = w * Math.exp(-(d * d) / (2 * sr * sr));
          s += cur[j] * wr;
          n += wr;
        }
        nxt[i] = s / n;
      }
    }
    cur = nxt;
  }
  return { A: cur, mask };
}

/** Apply the smoothed shadow alpha (quantised to `levels`) to a copy of the RGBA buffer. */
function withShadowAlpha(raw, sm, levels) {
  const out = Buffer.from(raw.data);
  const { A, mask } = sm;
  const N = raw.width * raw.height;
  for (let i = 0; i < N; i++) {
    if (!mask[i]) continue;
    let v = A[i];
    if (levels < 256) v = Math.round(v * (levels - 1)) / (levels - 1);
    out[i * 4 + 3] = Math.max(0, Math.min(255, Math.round(v * 255)));
  }
  return out;
}

async function loadRaw(file, width) {
  const img = sharp(file).ensureAlpha();
  const m = await img.metadata();
  const w = width, h = Math.round((width * m.height) / m.width);
  const { data, info } = await (m.width === w ? img : img.resize(w, h, { kernel: 'lanczos3' }))
    .raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

const encodeBuf = (buf, width, height, quality, extra = {}) =>
  sharp(buf, { raw: { width, height, channels: 4 } })
    .webp({ quality, alphaQuality: 100, effort: 6, smartSubsample: true, ...extra })
    .toBuffer();

async function encodeSet(raws, sms, rung) {
  const r = LADDER[rung];
  const bufs = [];
  for (let i = 0; i < raws.length; i++) {
    const px = withShadowAlpha(raws[i], sms[i], r.levels);
    bufs.push(await encodeBuf(px, raws[i].width, raws[i].height, r.q));
  }
  return bufs;
}

async function fitLadder(raws, sms, budget, label) {
  if (FIXED_RUNG !== null) {
    const bufs = await encodeSet(raws, sms, +FIXED_RUNG);
    return { rung: +FIXED_RUNG, bufs, bytes: bufs.reduce((s, b) => s + b.length, 0) };
  }
  let lo = 0, hi = LADDER.length - 1, best = null;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const bufs = await encodeSet(raws, sms, mid);
    const bytes = bufs.reduce((s, b) => s + b.length, 0);
    console.log(`  ${label} rung ${mid} (q${LADDER[mid].q}, ${LADDER[mid].levels} levels): ${(bytes / 1024).toFixed(0)} KB`);
    if (bytes <= budget) { best = { rung: mid, bufs, bytes }; hi = mid - 1; } else lo = mid + 1;
  }
  if (!best) throw new Error(`${label}: even the last rung does not fit ${budget} bytes`);
  return best;
}

// bounding box (0-1) of the visible pixels of a frame: handy to lay out captions / dimension lines
function visibleBounds(raw, threshold = 24) {
  const { data, width, height } = raw;
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > threshold) {
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  const r = (v) => Math.round(v * 10000) / 10000;
  return [r(x0 / width), r(y0 / height), r((x1 + 1) / width), r((y1 + 1) / height)];
}

// ---------------------------------------------------------------------------------------------------
await rm(OUT, { recursive: true, force: true });
await mkdir(path.join(OUT, 'd'), { recursive: true });
await mkdir(path.join(OUT, 'm'), { recursive: true });

const files = [];
for (let f = 0; f < NF; f++) files.push(path.join(SRC, `hero_${pad(f)}.png`));
const have = new Set(await readdir(SRC));
const missing = files.filter((p) => !have.has(path.basename(p)));
if (missing.length) throw new Error('missing masters: ' + missing.map((p) => path.basename(p)).join(', '));

console.log('loading masters and cleaning the shadow alpha...');
const desktopRaw = [], mobileRaw = [], dSm = [], mSm = [];
const cache = new Map();   // identical masters (frames 0-5) share the work
for (const f of files) {
  const key = createHash('md5').update(await readFile(f)).digest('hex');
  if (cache.has(key)) {
    const c = cache.get(key);
    desktopRaw.push(c.d); mobileRaw.push(c.m); dSm.push(c.ds); mSm.push(c.ms);
    continue;
  }
  const d = await loadRaw(f, WIDTHS.d), m = await loadRaw(f, WIDTHS.m);
  const ds = smoothShadow(d, { rad: 3, ss: 2, sr: 0.05, iters: 2 });
  const ms = smoothShadow(m, { rad: 2, ss: 1.4, sr: 0.05, iters: 2 });
  cache.set(key, { d, m, ds, ms });
  desktopRaw.push(d); mobileRaw.push(m); dSm.push(ds); mSm.push(ms);
}
const { width, height } = desktopRaw[0];

console.log('desktop 1400 px, budget', (DESKTOP_BUDGET / 1024).toFixed(0), 'KB');
const dsk = await fitLadder(desktopRaw, dSm, DESKTOP_BUDGET, 'desktop');
console.log('mobile 700 px, budget', (MOBILE_BUDGET / 1024).toFixed(0), 'KB');
const mob = await fitLadder(mobileRaw, mSm, MOBILE_BUDGET, 'mobile');

for (let f = 0; f < NF; f++) {
  await writeFile(path.join(OUT, 'd', `hero-${pad(f)}.webp`), dsk.bufs[f]);
  await writeFile(path.join(OUT, 'm', `hero-${pad(f)}.webp`), mob.bufs[f]);
}
const dBytes = dsk.bytes, mBytes = mob.bytes;
const dR = LADDER[dsk.rung], mR = LADDER[mob.rung];

// registered line drawing (frame-0 camera). Line art: lossless keeps the 1 px strokes crisp.
const linesFile = path.join(SRC, 'hero_plan_lines.png');
const planLines = {};
for (const [k, w] of [['desktop', 1400], ['mobile', 700]]) {
  const raw = await loadRaw(linesFile, w);
  const buf = await encodeBuf(raw.data, raw.width, raw.height, 100, { lossless: true, effort: 6, smartSubsample: false });
  const name = `hero-plan-lines-${w}.webp`;
  await writeFile(path.join(OUT, name), buf);
  planLines[k] = { src: `/assets/hero/${name}`, bytes: buf.length };
}

// ---------------------------------------------------------------------------------------------------
const r4 = (v) => Math.round(v * 10000) / 10000;
const rp = (p) => p.map(r4);
const points = meta.points.map((p, f) => ({
  f: p.f,
  corners: p.corners.map(rp),
  wallTop: { ne: rp(p.wallTop.ne), sw: rp(p.wallTop.sw), heightM: p.wallTop.heightM },
  cut: { ne: rp(p.cut.ne), sw: rp(p.cut.sw), heightM: p.cut.heightM },
  bounds: visibleBounds(desktopRaw[f]),
}));

const hero = {
  frames: NF,
  fps: meta.fps,
  width: meta.width,
  height: meta.height,
  aspect: meta.aspect,
  desktop: { pattern: '/assets/hero/d/hero-{i}.webp', pad: PAD, width: 1400, height: 900, bytes: dBytes },
  mobile: { pattern: '/assets/hero/m/hero-{i}.webp', pad: PAD, width: 700, height: 450, bytes: mBytes },
  planLines: {
    desktop: planLines.desktop.src,
    mobile: planLines.mobile.src,
    bytes: { desktop: planLines.desktop.bytes, mobile: planLines.mobile.bytes },
    registeredWithFrame: 0,
  },
  finalMatches: meta.finalMatches,
  finalFrame: NF - 1,
  staticFrames: [0, meta.timeline.walls[0]],
  timeline: meta.timeline,
  phases: [
    { id: 'plan', from: 0, to: meta.timeline.walls[0], es: 'Plano', en: 'Plan' },
    { id: 'walls', from: meta.timeline.walls[0], to: meta.timeline.walls[1], es: 'Muros', en: 'Walls' },
    { id: 'furniture', from: meta.timeline.furniture[0], to: meta.timeline.furniture[1], es: 'Mobiliario', en: 'Furniture' },
    { id: 'light', from: meta.timeline.light[0], to: meta.timeline.light[1], es: 'Luz', en: 'Light' },
  ],
  cornerOrder: meta.cornerOrder,
  footprintMeters: meta.footprintMeters,
  rooms: meta.rooms,
  points,
};
await mkdir(path.dirname(GEN), { recursive: true });
await writeFile(GEN, JSON.stringify(hero) + '\n');

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log('\nhero frames written');
console.log(`  desktop: ${NF} x ${width}x${height} q${dR.q} shadow ${dR.levels} levels  ${kb(dBytes)} (${dBytes} B)  budget ${DESKTOP_BUDGET} B  ${dBytes <= DESKTOP_BUDGET ? 'OK' : 'OVER'}`);
console.log(`  mobile : ${NF} x 700x450 q${mR.q} shadow ${mR.levels} levels  ${kb(mBytes)} (${mBytes} B)  budget ${MOBILE_BUDGET} B  ${mBytes <= MOBILE_BUDGET ? 'OK' : 'OVER'}`);
console.log(`  plan lines: ${kb(planLines.desktop.bytes)} desktop, ${kb(planLines.mobile.bytes)} mobile`);
console.log(`  hero.json: ${kb(Buffer.byteLength(JSON.stringify(hero)))}`);
console.log('  desktop KB per frame:', dsk.bufs.map((b, i) => `${i}:${(b.length / 1024).toFixed(0)}`).join(' '));
if (dBytes > DESKTOP_BUDGET || mBytes > MOBILE_BUDGET) process.exitCode = 1;
