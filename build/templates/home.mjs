/* Home (rulebook C5, BUILD-SPEC §6): hero split 5/7 → cajetín → blocks → FAQ → form (the form is the end).
   Hero "Lámina" (S1): the maqueta render cropped to the model, with static dimension lines (cotas) whose
   end points are the real footprint projected through the render camera. */
import { h1, btnPrimary, linkArrow, contactHref, cajetin, faqSection, contactForm, hasImage } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';

/* Camera of `villa_maqueta_iso`, replicated from source/villa3d/blender/villa_render.py (SHOTS + fit_perspective):
   perspective, lens 50 mm on a 36 mm sensor, azimuth 212°, elevation 42°, the FOOT box fitted with a 6 % margin,
   then lens-shifted to centre it. Plan metres: x east, y north, z up (floor 0, base of the maqueta at -0.60). */
const SHOT = { W: 2800, H: 1800, lens: 50, sensor: 36, az: 212, el: 42, margin: 0.06, box: [-0.03, -0.03, 9.13, 14.08, -0.6, 1.15] };
/* Model body (alpha ≥ 200) and its contact shadow (alpha ≥ 60) in the RGBA master, image pixels [x0, y0, x1, y1]. */
const BODY = [579, 92, 2278, 1626];
const SHADOW_X1 = 2496;

function camera(s) {
  const r = Math.PI / 180;
  const d = [Math.sin(s.az * r) * Math.cos(s.el * r), Math.cos(s.az * r) * Math.cos(s.el * r), Math.sin(s.el * r)];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const up = [-d[0] * d[2], -d[1] * d[2], 1 - d[2] * d[2]];
  const n = Math.hypot(...up);
  const Y = up.map((v) => v / n);
  const X = [Y[1] * d[2] - Y[2] * d[1], Y[2] * d[0] - Y[0] * d[2], Y[0] * d[1] - Y[1] * d[0]];
  const [x0, y0, x1, y1, z0, z1] = s.box;
  const pts = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push([x, y, z]);
  const target = [0, 1, 2].map((i) => pts.reduce((t, p) => t + p[i], 0) / pts.length);
  const k = s.lens / s.sensor;
  const hw = s.H / s.W;
  let sx = 0; let sy = 0; let dist = 20;
  const uv = (p, dd) => {
    const q = p.map((v, i) => v - (target[i] + d[i] * dd));
    const z = -dot(q, d);
    return [dot(q, X) / z * k + 0.5 - sx, (dot(q, Y) / z * k + 0.5 * hw - sy) / hw];
  };
  const span = (dd) => { const a = pts.map((p) => uv(p, dd)); const u = a.map((x) => x[0]); const v = a.map((x) => x[1]); return [Math.min(...u), Math.max(...u), Math.min(...v), Math.max(...v)]; };
  for (let it = 0; it < 6; it++) {
    let lo = 1; let hi = 300;
    for (let j = 0; j < 40; j++) {
      dist = (lo + hi) / 2;
      const [u0, u1, v0, v1] = span(dist);
      if (u1 - u0 <= 1 - 2 * s.margin && v1 - v0 <= 1 - 2 * s.margin / hw) hi = dist; else lo = dist;
    }
    dist = hi;
    const [u0, u1, v0, v1] = span(dist);
    sx += (u0 + u1) / 2 - 0.5;
    sy += ((v0 + v1) / 2 - 0.5) * hw;
  }
  return (p) => { const [u, v] = uv(p, dist); return [u * s.W, (1 - v) * s.H]; };
}

/** Crop box [x0, y0, x1, y1] grown by a share of its size on every side (room for the edge fade). */
const grow = ([x0, y0, x1, y1], f) => { const w = (x1 - x0) * f; const h = (y1 - y0) * f; return [x0 - w, y0 - h, x1 + w, y1 + h]; };
const clampBox = ([x0, y0, x1, y1], W, H) => [Math.max(0, x0), Math.max(0, y0), Math.min(W, x1), Math.min(H, y1)];
const pct = (n) => `${+(n * 100).toFixed(3)}%`;
const cropVars = (p, [x0, y0, x1, y1], W, H) => {
  const w = x1 - x0; const h = y1 - y0;
  return `--${p}l:${pct(-x0 / w)};--${p}t:${pct(-y0 / h)};--${p}w:${pct(W / w)};--${p}r:${+(w / h).toFixed(4)}`;
};

function lamina(ctx) {
  const name = 'villa_maqueta_iso';
  const m = ctx.images && ctx.images[name];
  const { W, H } = SHOT;
  // Mobile crop: the model and most of its shadow. Desktop crop: also the dimension lines and their labels.
  let mobile = clampBox(grow([BODY[0], BODY[1], Math.min(SHADOW_X1, BODY[2] + 160), BODY[3]], 0.05), W, H);
  let desktop = mobile;
  let cotas = '';
  let labels = '';
  const registered = m && m.width === W && m.height === H;
  if (registered) {
    const P = camera(SHOT);
    const { w, d } = ctx.data.villa.specs.footprint;
    const z = -0.6; const off = 0.8; const e0 = 0.15; const e1 = off + 0.2; const t = 0.16;
    const seg = (a, b) => [P([...a, z]), P([...b, z])];
    const tick = (x, y) => seg([x - t, y - t], [x + t, y + t]);
    const lines = [
      seg([-off, 0], [-off, d]), seg([-e0, 0], [-e1, 0]), seg([-e0, d], [-e1, d]), tick(-off, 0), tick(-off, d),
      seg([0, -off], [w, -off]), seg([0, -e0], [0, -e1]), seg([w, -e0], [w, -e1]), tick(0, -off), tick(w, -off),
    ];
    const r = (n) => Math.round(n);
    cotas = `<svg class="lamina__cotas" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${lines.map(([a, b]) => `M${r(a[0])} ${r(a[1])}L${r(b[0])} ${r(b[1])}`).join('')}"/></svg>`;
    const lbl = (p, text) => `<span class="lamina__lbl" style="left:${pct(p[0] / W)};top:${pct(p[1] / H)}" aria-hidden="true">${ctx.esc(text)}</span>`;
    const midW = P([-off, d / 2, z]); const midS = P([w / 2, -off, z]);
    labels = lbl(midW, `${ctx.fmtNumber(d, 2)} m`) + lbl(midS, `${ctx.fmtNumber(w, 2)} m`);
    const xs = lines.flat().map((p) => p[0]).concat(midW[0] - 130, midS[0] + 130);
    const ys = lines.flat().map((p) => p[1]).concat(midW[1] - 40, midS[1] + 40);
    desktop = clampBox(grow([Math.min(BODY[0], ...xs), Math.min(BODY[1], ...ys), Math.min(SHADOW_X1, BODY[2] + 160), Math.max(BODY[3], ...ys)], 0.04), W, H);
  } else {
    mobile = [0, 0, W, H];
    desktop = mobile;
  }
  const iw = m ? m.width : W; const ih = m ? m.height : H;
  const img = ctx.img(name, { alt: ctx.t('hero.alt'), eager: true, sizes: '(min-width: 1024px) 60vw, (min-width: 768px) 110vw, 140vw', imgClass: 'hero__img' });
  const vars = `${cropVars('m', mobile, iw, ih)};${cropVars('d', desktop, iw, ih)}`;
  return `<div class="lamina" style="${vars}"><div class="lamina__frame">${img}${cotas}${labels}</div></div>`;
}

function drawingLabel(ctx) {
  const v = ctx.data.villa.specs;
  const row = (k, val) => `<div><dt>${ctx.esc(ctx.t(`hero.drawing.${k}`))}</dt><dd>${ctx.esc(val)}</dd></div>`;
  return `<dl class="lamina-label">`
    + row('scope', ctx.t('hero.drawing.scopeValue', { cut: `${ctx.fmtNumber(v.cutHeight, 2)} m` }))
    + row('footprint', ctx.t('hero.drawing.footprintValue', { w: ctx.fmtNumber(v.footprint.w, 2), d: ctx.fmtNumber(v.footprint.d, 2) }))
    + row('source', ctx.t('hero.drawing.sourceValue'))
    + '</dl>';
}

export default function render(ctx) {
  const p = ctx.page;
  const blocks = p.blocks || [];
  const hasDemo = blocks.some((b) => b.type === 'viewer');
  const villaHref = hasDemo ? '#demo' : (ctx.has('caso-villa') ? ctx.href('caso-villa', 'visor') : null);
  const secondary = villaHref ? linkArrow(ctx, villaHref, ctx.t('cta.villa'), { icon: hasDemo ? 'arrowDown' : 'arrow' }) : '';
  const hero = `<section class="hero hero--home" aria-labelledby="titulo"><div class="hero__grid">`
    + `<div class="hero__text">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.lead)}</p><p class="actions" data-hero-actions>${btnPrimary(ctx, contactHref(ctx, 'maqueta'), ctx.t('cta.demo'))}${secondary}</p></div>`
    + `<figure class="hero__visual"><div class="hero__stage${hasImage(ctx, 'villa_maqueta_iso') ? '' : ' hero__stage--missing'}">${lamina(ctx)}</div><figcaption class="hero__caption">${drawingLabel(ctx)}</figcaption></figure>`
    + `</div></section>`;
  const state = {};
  const body = renderBlocks(ctx, blocks, {
    state, service: 'maqueta',
    eyebrows: { compare: ctx.t('eyebrow.compare'), viewer: ctx.t('eyebrow.viewer'), faq: ctx.t('eyebrow.faq') },
  });
  const faq = !state.faqPlaced && p.faq && p.faq.length ? faqSection(ctx, p.faq, { eyebrow: ctx.t('eyebrow.faq'), openCount: 1 }) : '';
  const form = state.formPlaced ? '' : contactForm(ctx, { service: 'maqueta' });
  return { main: hero + cajetin(ctx, p.facts) + body + faq + form, bodyClass: 'page-home' };
}
