/* ═══════════════════════════════════════════════════════════════
   Home hero "El plano se vuelve 3D". Owner: HERO.
   Build-time half of the hero (the run-time half is src/js/hero.js):
   - loadHero(root): reads + validates build/generated/hero.json against public/assets/hero (fails loudly).
   - heroStage(ctx): the drawing sheet as HTML: still, plan drawing, canvas, phase rail and title block. The served
     markup is the FINAL state (still), so no-JS, reduced motion and Save-Data need nothing else. The cotas, rulers,
     chips and the replay button are built by hero.js (they are data and JS-only controls: building them there keeps
     about 2.6 KB out of every home HTML); their styles are the lazy 23-hero-live.css.
   - heroBoot(): the tiny inline loader that injects hero.js after `load` (so it is not initial JS).
   Geometry: hero.json gives the 4 footprint corners of every frame. A homography per frame (plan metres → frame
   pixels) projects the dimension lines, so the cotas sit ON the floor plane and follow the camera exactly. The
   per-frame numbers ship in one hashed JSON asset (hero-geo.<hash>.json), not in the HTML.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { uiHero } from '../data/ui-hero.mjs';
import { seriesOf } from './chapters.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const pad = (i, n = 3) => String(i).padStart(n, '0');

/* Cota layout: plan metres (offset from the outer face, gap before the extension line, overshoot beyond the
   dimension line) and frame pixels (1400 × 900 space) for the height cota. */
const OFF = 1.0; const GAP = 0.2; const OVER = 0.4;
const H_DX = 50; const H_GAP = 8; const H_OVER = 12;

/* ─── Load + validate ─────────────────────────────────────────── */

let memo = null;

export function loadHero(root = ROOT) {
  if (memo && memo.root === root) return memo;
  const file = path.join(root, 'build', 'generated', 'hero.json');
  const errs = [];
  const E = (m) => errs.push(m);
  if (!fs.existsSync(file)) throw new Error(`hero: ${path.relative(root, file)} is missing (node scripts/hero-frames.mjs)`);
  let hero;
  try { hero = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { throw new Error(`hero: hero.json is not valid JSON: ${e.message}`); }
  const n = hero.frames;
  if (!(n > 1)) E('frames must be > 1');
  if (!Array.isArray(hero.points) || hero.points.length !== n) E(`points has ${hero.points && hero.points.length} entries, expected ${n}`);
  if (!hero.width || !hero.height || Math.abs(hero.width / hero.height - 14 / 9) > 0.01) E('frame size must be 14:9');
  if (!Array.isArray(hero.phases) || hero.phases.length < 2) E('phases missing');
  else {
    hero.phases.forEach((p, i) => {
      if (!p.es || !p.en) E(`phase ${p.id}: es/en label missing`);
      if (i && p.from <= hero.phases[i - 1].from) E(`phase ${p.id}: from must increase`);
      if (p.from < 0 || p.from >= n) E(`phase ${p.id}: from out of range`);
    });
  }
  if (hero.finalFrame !== n - 1) E('finalFrame must be the last frame');
  if (!hero.footprintMeters || !hero.footprintMeters.width || !hero.footprintMeters.depth) E('footprintMeters missing');
  for (const [i, p] of (hero.points || []).entries()) {
    if (p.f !== i || !Array.isArray(p.corners) || p.corners.length !== 4 || !p.cut || typeof p.cut.heightM !== 'number' || !p.cut.sw) { E(`points[${i}] malformed`); break; }
  }
  for (const set of ['desktop', 'mobile']) {
    const s = hero[set];
    if (!s || !s.pattern) { E(`${set} frame set missing`); continue; }
    for (let i = 0; i < n; i++) {
      const rel = s.pattern.replace('{i}', pad(i, s.pad || 3));
      if (!fs.existsSync(path.join(root, 'public', rel))) { E(`${set}: ${rel} not in public/`); break; }
    }
  }
  for (const set of ['desktop', 'mobile']) {
    const rel = hero.planLines && hero.planLines[set];
    if (!rel || !fs.existsSync(path.join(root, 'public', rel))) E(`planLines.${set} missing in public/`);
  }
  if (errs.length) throw new Error(`hero: build/generated/hero.json is invalid:\n  - ${errs.join('\n  - ')}`);
  const geo = hero.points.map((p) => frameGeo(p, hero));
  memo = { root, hero, geo };
  return memo;
}

/* ─── Geometry ────────────────────────────────────────────────── */

/** Solve A x = b (Gaussian elimination with partial pivoting). */
function solve(A, b) {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
    x[r] = s / M[r][r];
  }
  return x;
}

/** Homography from 4 plan points to 4 image points. */
function homography(src, dst) {
  const A = []; const b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]; const [X, Y] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X);
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y);
  }
  const h = solve(A, b);
  return (x, y) => {
    const w = h[6] * x + h[7] * y + 1;
    return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w];
  };
}

/** Least-squares affine map plan → image; returns its singular values (px per metre across / along the view). */
function scales(src, dst) {
  const fit = (k) => {
    const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; const r = [0, 0, 0];
    src.forEach(([x, y], i) => {
      const v = [x, y, 1];
      for (let a = 0; a < 3; a++) { for (let c = 0; c < 3; c++) A[a][c] += v[a] * v[c]; r[a] += v[a] * dst[i][k]; }
    });
    return solve(A, r);
  };
  const [a, b] = fit(0); const [c, d] = fit(1);
  const S = a * a + b * b + c * c + d * d;
  const D = Math.sqrt(((a * a + b * b - c * c - d * d) / 2) ** 2 + (a * c + b * d) ** 2);
  const s1 = Math.sqrt(S / 2 + D);
  const s2 = Math.abs(a * d - b * c) / s1;
  return [s1, s2];
}

const r0 = (v) => Math.round(v);
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;

/**
 * 43 numbers per frame, frame pixels (1400 × 900 space). hero.js reads them by index:
 *  0-11  W cota (long side) : ext1 from (x,y), ext1 to (x,y), dim end 1, ext2 from, ext2 to, dim end 2
 *  12-23 S cota (short side): same layout
 *  24-35 height cota        : same layout (dim end 1 = floor, dim end 2 = cut height)
 *  36 height in metres · 37 x0 · 38 y0 (ruler origins, px) · 39 s1 · 40 s2 (px per metre) · 41 Lx · 42 Ly (ruler lengths, m)
 * The rulers measure the footprint's screen extent: s1 across the view, s2 along it (foreshortened by the tilt).
 */
function frameGeo(p, hero) {
  const { width: W, depth: D } = hero.footprintMeters;
  const px = p.corners.map(([x, y]) => [x * hero.width, y * hero.height]);
  // Corner order NW, NE, SE, SW; plan metres x east, y north.
  const plan = [[0, D], [W, D], [W, 0], [0, 0]];
  const P = homography(plan, px);
  const seg = (a, b, c) => [...P(...a), ...P(...b), ...P(...c)];
  const w1 = seg([-GAP, 0], [-OFF - OVER, 0], [-OFF, 0]); const w2 = seg([-GAP, D], [-OFF - OVER, D], [-OFF, D]);
  const s1p = seg([0, -GAP], [0, -OFF - OVER], [0, -OFF]); const s2p = seg([W, -GAP], [W, -OFF - OVER], [W, -OFF]);
  const [bx, by] = px[2];
  const vx = (p.cut.sw[0] - p.corners[3][0]) * hero.width; const vy = (p.cut.sw[1] - p.corners[3][1]) * hero.height;
  const q1 = [bx + H_DX, by]; const q2 = [q1[0] + vx, q1[1] + vy];
  const h1 = [bx + H_GAP, by, bx + H_DX + H_OVER, by, ...q1];
  const h2 = [bx + H_GAP + vx, by + vy, q2[0] + H_OVER, q2[1], ...q2];
  const xs = px.map((q) => q[0]); const ys = px.map((q) => q[1]);
  const [sx, sy] = scales(plan, px);
  const x0 = Math.min(...xs); const y0 = Math.min(...ys);
  return [
    ...[...w1, ...w2, ...s1p, ...s2p, ...h1, ...h2].map(r0),
    r2(p.cut.heightM), r1(x0), r1(y0), r2(sx), r2(sy), r1((Math.max(...xs) - x0) / sx), r1((Math.max(...ys) - y0) / sy),
  ];
}

/* ─── Markup ──────────────────────────────────────────────────── */

/** Base URL and 8-hex hashes of one frame set, from the hashed public URLs (hero.js rebuilds the URLs). */
function frameSet(ctx, set, hero) {
  const hashes = [];
  let base = '';
  for (let i = 0; i < hero.frames; i++) {
    const url = ctx.asset(set.pattern.replace('{i}', pad(i, set.pad || 3)));
    const m = url.match(/^(.*\/hero-)\d{3}\.([0-9a-f]{8})\.webp$/);
    if (!m) throw new Error(`hero: frame ${i} is not a hashed asset (${url})`);
    base = m[1];
    hashes.push(m[2]);
  }
  return { base, hashes };
}

export function heroStage(ctx) {
  const { hero, geo } = loadHero();
  const ui = uiHero[ctx.lang];
  const esc = ctx.esc;
  const villa = ctx.data.villa.specs;
  const fmt = (n, d = 2) => ctx.fmtNumber(n, d);

  // Geometry + frame lists: one hashed JSON asset, fetched by hero.js.
  const d = frameSet(ctx, hero.desktop, hero);
  const m = frameSet(ctx, hero.mobile, hero);
  const geoUrl = ctx.emitAsset('/assets/hero/hero-geo.json', JSON.stringify({ n: hero.frames, ph: hero.phases.map((p) => p.from), cm: hero.timeline.camera, bd: d.base, hd: d.hashes, bm: m.base, hm: m.hashes, g: geo }));
  const jsUrl = ctx.asset('/assets/js/hero.js');

  // Plan drawing: the LCP candidate (small line art, registered with frame 0). The only fetchpriority=high image.
  ctx._lcpUsed = true;
  const planD = esc(ctx.asset(hero.planLines.desktop));
  const plan = `<img class="hs__plan" src="${planD}" srcset="${esc(ctx.asset(hero.planLines.mobile))} 700w, ${planD} 1400w" sizes="(min-width: 1024px) 1100px, 50vw" width="${hero.width}" height="${hero.height}" alt="" fetchpriority="high">`;
  // Final still: identical framing to the last frame, crisp on retina (2400 w AVIF). Lazy: it only loads once it is shown.
  const still = ctx.img('villa_maqueta_iso', { alt: ctx.t('hero.alt'), sizes: '(min-width: 1024px) 1200px, 100vw', widths: [800, 1200, 2400], className: 'hs__still' });

  const art = `<div class="hs__art" role="img" aria-label="${esc(ctx.t('hero.alt'))}">${still}${plan}<canvas class="hs__cv" aria-hidden="true"></canvas></div>`;

  const last = hero.phases.length - 1;
  const phases = hero.phases.map((p, i) => `<li${i === last ? ' class="is-on"' : ''}><span class="hs__b"><i class="mono">${pad(i + 1, 2)}</i><b>${esc(p[ctx.lang])}</b></span></li>`).join('');
  const tr = (k, v) => `<div><dt class="mono">${esc(ui.title[k])}</dt><dd>${esc(v)}</dd></div>`;
  const floor = ui.title.floorValue.replace('{interior}', fmt(villa.interiorM2, 0)).replace('{terraces}', fmt(villa.terracesM2, 0));
  const strip = `<div class="hs__strip"><ol class="hs__rail" role="list" aria-label="${esc(ui.railLabel)}">${phases}</ol>`
    + `<dl class="hs__title">${tr('project', ui.title.projectValue)}${tr('floor', floor)}${tr('source', ui.title.sourceValue)}</dl></div>`;

  // data-t: cota labels (long side | short side); data-u: length unit; data-r: label of the replay button (built by hero.js);
  // data-x: phone scroll intro strings (one line per phase | hint | skip).
  const attrs = `data-hero data-g="${esc(geoUrl)}" data-j="${esc(jsUrl)}" data-c="${esc(ctx.asset('/assets/css/herolive.css'))}" data-t="${fmt(villa.footprint.d)}|${fmt(villa.footprint.w)}" data-u="${esc(ui.unit)}" data-r="${esc(ui.replay)}" data-x="${esc([...ui.scrub, ui.hint, ui.skip].join('|'))}"`;
  return `<figure class="hs" ${attrs}><div class="hs__stage">${art}</div>${strip}</figure>`;
}

/** North arrow, scale bar and sheet id under the hero copy (decoration: aria-hidden, drawn by 24-chapters.css). */
export function heroLegend(ctx) {
  // The sheet id follows the page's series (home A-00, a service S-00, a guide G-00…, see chapters.mjs).
  const sheet = ctx.t('hero.legend.sheet').replace(/[A-Z]-00$/, `${seriesOf(ctx)}-00`);
  return `<div class="hv-leg" aria-hidden="true"><i class="hv-na"></i><span class="hv-sb"><b>0</b><b>2</b><b>5 m</b></span><p>${ctx.esc(ctx.t('hero.legend.scale'))}<br>${ctx.esc(sheet)}</p></div>`;
}

/**
 * Inline loader: injects hero.js after `load` and once the LCP entry exists (lab tools count requests made before the LCP
 * against it; 1 s fallback where the entry type is missing), so the script is not part of the initial JS
 * (BUILD-SPEC §11). machine.mjs adds this script's sha256 to the CSP.
 */
export function heroBoot() {
  return '<script>addEventListener("load",function(){var d,h=function(){if(d)return;d=1;var s=document.createElement("script");s.src=document.querySelector("[data-j]").dataset.j;document.head.append(s)};try{new PerformanceObserver(h).observe({type:"largest-contentful-paint",buffered:true})}catch(e){}setTimeout(h,1e3)})</script>';
}
