/* ═══════════════════════════════════════════════════════════════
   viewer-dims.js · "Medidas" on the live 3D model (S3, V-03). Owner: VIEWER.
   ES module imported by src/js/viewer.js on the first press of Medidas
   (hashed URL in data-dims-js), so it never weighs on the initial JS.
   Real dimension lines (data, not decoration): the footprint w × d as
   ground cotas 0.8 m outside the base, each broken where its value sits
   (never struck through) and ended with 45° ticks, plus the wall or cut
   height beside the south-east corner with its value to the right of the
   line. While Medidas is on, the camera dollies out just enough to keep
   every end and value inside the stage; the previous framing comes back
   when it turns off. Looking straight down (plan view) the height line
   collapses into a point, so it is left out.
   ═══════════════════════════════════════════════════════════════ */
const NS = 'http://www.w3.org/2000/svg';
const TICK = 5;  // half length of a 45° end tick, px
const GAP = 4;   // clearance between a value and its line, and between the drawing and the stage edge, px
const SIDE = 10; // the height value sits this far right of its line, px (CSS .vw-dim--h)
// glTF: x east, y up, z = -north. Cotas on the ground (G) 0.8 m (O) outside the base, like a drawing.
const G = -0.6;
const O = 0.8;
const f1 = (n) => Math.round(n * 10) / 10;
const flat = (phi) => phi < 0.2;
const rad = (v) => (/rad$/.test(v) ? parseFloat(v) : (parseFloat(v) * Math.PI) / 180);
const vec3 = (s) => String(s).trim().split(/\s+/).map((v) => parseFloat(v));

/** [t0, t1] of the segment p→q inside box b = [x0, y0, x1, y1] (Liang–Barsky), or null. */
function clip(p, q, b) {
  let t0 = 0; let t1 = 1;
  const dx = q.x - p.x; const dy = q.y - p.y;
  for (const [a, c] of [[-dx, p.x - b[0]], [dx, b[2] - p.x], [-dy, p.y - b[1]], [dy, b[3] - p.y]]) {
    if (a === 0) { if (c < 0) return null; continue; }
    const r = c / a;
    if (a < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; }
  }
  return t0 < t1 ? [t0, t1] : null;
}

/** Dimension line p→q with 45° ticks, broken around box b (its value). */
function dimPath(p, q, b) {
  const dx = q.x - p.x; const dy = q.y - p.y;
  const len = Math.hypot(dx, dy);
  if (len < 2) return '';
  const ux = dx / len; const uy = dy / len;
  const tx = (ux - uy) * Math.SQRT1_2 * TICK; const ty = (ux + uy) * Math.SQRT1_2 * TICK;
  const at = (t) => `${f1(p.x + dx * t)} ${f1(p.y + dy * t)}`;
  const c = b && clip(p, q, b);
  const line = c ? `M${at(0)}L${at(c[0])}M${at(c[1])}L${at(1)}` : `M${at(0)}L${at(1)}`;
  const tick = (e) => `M${f1(e.x - tx)} ${f1(e.y - ty)}L${f1(e.x + tx)} ${f1(e.y + ty)}`;
  return line + tick(p) + tick(q);
}

/**
 * @param {object} v { mv, root, stage, ds, buttons, jump(), cutOn() → bool, homeR() → overview radius in metres }
 * @returns { on, toggle(), off(restore), cut(), moved(), viewOrbit(orbit, target) }
 */
export function createDims(v) {
  const { mv, root, stage, ds } = v;
  const [dw, dd, wallH, cutH, lw, ld, lWall, lCut] = JSON.parse(ds.dims || '[9.1,14.1,2.6,1.15,"","","",""]');
  const dimH = () => (v.cutOn() ? cutH : wallH);
  const pts = () => ({
    w1: [0, G, O], w2: [dw, G, O], d1: [-O, G, 0], d2: [-O, G, -dd], h1: [dw + O / 2, 0, 0], h2: [dw + O / 2, dimH(), 0],
    lw: [dw / 2, G, O], ld: [-O, G, -dd / 2], lh: [dw + O / 2, dimH() / 2, 0],
  });
  const posStr = (p) => `${p[0]}m ${p[1]}m ${p[2]}m`;
  const labels = {};
  const size = (n) => { const el = labels[n]; return [(el && el.offsetWidth) || 64, (el && el.offsetHeight) || 22]; };
  let prev = null; // framing to restore when Medidas turns off (dropped once the visitor moves the camera)
  const maxOrbit = mv.getAttribute('max-camera-orbit') || 'auto auto auto';

  // One SVG with three paths, and the ends and values as model-viewer hotspots (they follow the camera).
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'vw-dims');
  svg.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i++) svg.append(document.createElementNS(NS, 'path'));
  stage.append(svg);
  for (const [n, p] of Object.entries(pts())) {
    const h = document.createElement('span');
    h.slot = `hotspot-dim-${n}`;
    h.className = n[0] === 'l' ? `vw-dim${n === 'lh' ? ' vw-dim--h' : ''}` : 'vw-dim-pt';
    h.dataset.position = posStr(p);
    h.textContent = { lw, ld, lh: v.cutOn() ? lCut : lWall }[n] || '';
    if (n[0] === 'l') labels[n] = h;
    mv.append(h);
  }

  function draw() {
    if (!api.on) return;
    const pt = (n) => { const h = mv.queryHotspot(`hotspot-dim-${n}`); return h ? h.canvasPosition : null; };
    const box = (n) => {
      const c = pt(n);
      if (!c) return null;
      const [w, h] = size(n);
      return [c.x - w / 2 - GAP, c.y - h / 2 - GAP, c.x + w / 2 + GAP, c.y + h / 2 + GAP];
    };
    [['w1', 'w2', 'lw'], ['d1', 'd2', 'ld'], ['h1', 'h2', '']].forEach(([a, z, l], i) => {
      const p = pt(a); const q = pt(z);
      const off = !p || !q || (i === 2 && Math.hypot(q.x - p.x, q.y - p.y) < 16);
      if (i === 2) labels.lh.classList.toggle('is-off', off);
      svg.children[i].setAttribute('d', off ? '' : dimPath(p, q, l ? box(l) : null));
    });
  }
  function place() {
    for (const [n, p] of Object.entries(pts())) mv.updateHotspot({ name: `hotspot-dim-${n}`, position: posStr(p) });
    labels.lh.textContent = v.cutOn() ? lCut : lWall;
    redraw();
  }
  // Hotspot positions follow the render after a camera change: draw on the next frame, at most once per frame.
  let queued = 0;
  function redraw() { if (!queued) queued = requestAnimationFrame(() => { queued = 0; draw(); }); }
  mv.addEventListener('camera-change', redraw);

  /* Camera maths with three.js conventions (model-viewer's): orbit (theta, phi, radius) around a target, vertical
     field of view = mv.getFieldOfView(), aspect = the stage. Returns stage pixels, or null behind the camera. */
  function project(P, theta, phi, r, T, W, H) {
    const sp = Math.sin(phi); const cp = Math.cos(phi); const st = Math.sin(theta); const ct = Math.cos(theta);
    const C = [T[0] + r * sp * st, T[1] + r * cp, T[2] + r * sp * ct];
    const F = [-sp * st, -cp, -sp * ct];
    const R = [ct, 0, -st];
    const U = [R[1] * F[2] - R[2] * F[1], R[2] * F[0] - R[0] * F[2], R[0] * F[1] - R[1] * F[0]];
    const d = [P[0] - C[0], P[1] - C[1], P[2] - C[2]];
    const dot = (a) => a[0] * d[0] + a[1] * d[1] + a[2] * d[2];
    const z = dot(F);
    if (z <= 0.01) return null;
    const t = Math.tan(((mv.getFieldOfView ? mv.getFieldOfView() : Number(ds.fov) || 30) * Math.PI) / 360);
    return { x: (dot(R) / (z * t * (W / H)) + 1) * W / 2, y: (1 - dot(U) / (z * t)) * H / 2 };
  }
  /** Every end (with its tick) and every value inside the stage at this radius? side: height value right (1) or left (-1). */
  function fits(theta, phi, r, T, side) {
    const W = stage.clientWidth || 1; const H = stage.clientHeight || 1;
    const P = pts();
    const top = flat(phi);
    const M = TICK + 8;
    const inside = (x0, y0, x1, y1) => x0 >= GAP && y0 >= GAP && x1 <= W - GAP && y1 <= H - GAP;
    for (const n of ['w1', 'w2', 'd1', 'd2', ...(top ? [] : ['h1', 'h2'])]) {
      const c = project(P[n], theta, phi, r, T, W, H);
      if (!c || !inside(c.x - M, c.y - M, c.x + M, c.y + M)) return false;
    }
    for (const n of ['lw', 'ld', ...(top ? [] : ['lh'])]) {
      const c = project(P[n], theta, phi, r, T, W, H);
      if (!c) return false;
      const [w, h] = size(n);
      const x0 = n !== 'lh' ? c.x - w / 2 : side > 0 ? c.x + SIDE : c.x - SIDE - w;
      if (!inside(x0 - GAP, c.y - h / 2 - GAP, x0 + w + GAP, c.y + h / 2 + GAP)) return false;
    }
    return true;
  }
  /** Smallest radius ≥ r0 that keeps the whole drawing on stage (Medidas never moves the camera closer). */
  function radius(theta, phi, T, r0, side) {
    if (fits(theta, phi, r0, T, side)) return r0;
    let lo = r0; let hi = r0 * 1.25;
    while (!fits(theta, phi, hi, T, side) && hi < r0 * 6) { lo = hi; hi *= 1.25; }
    for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (fits(theta, phi, mid, T, side)) hi = mid; else lo = mid; }
    return hi * 1.02;
  }
  /**
   * Framing for the drawing: the height value goes right of its line when that costs little (≤ 15 % more distance),
   * else on whichever side needs the smaller dolly (narrow portrait stages put it on the model side, left).
   */
  function best(theta, phi, T, r0) {
    const right = radius(theta, phi, T, r0, 1);
    if (right <= r0 * 1.15) return { r: right, side: 1 };
    const left = radius(theta, phi, T, r0, -1);
    return left < right ? { r: left, side: -1 } : { r: right, side: 1 };
  }
  /** Apply a framing's value side; returns its radius. */
  function use(b) {
    labels.lh.classList.toggle('vw-dim--hl', b.side < 0);
    return b.r;
  }
  /** Dolly out from the current camera when the drawing does not fit. */
  function frame() {
    const o = mv.getCameraOrbit(); const t = mv.getCameraTarget();
    const r = use(best(o.theta, o.phi, [t.x, t.y, t.z], o.radius));
    if (r > o.radius + 0.01) { mv.cameraOrbit = `${o.theta}rad ${o.phi}rad ${r.toFixed(2)}m`; v.jump(); }
    redraw();
  }
  function set(on, restore = true) {
    if (on === api.on) return;
    api.on = on;
    root.toggleAttribute('data-dims-on', on);
    for (const b of v.buttons) b.setAttribute('aria-pressed', String(on));
    if (on) {
      const o = mv.getCameraOrbit(); const t = mv.getCameraTarget();
      prev = { orbit: `${o.theta}rad ${o.phi}rad ${o.radius}m`, target: `${t.x}m ${t.y}m ${t.z}m` };
      // Room to dolly out past model-viewer's automatic maximum distance (set once, before any move).
      const lim = maxOrbit.split(/\s+/);
      mv.maxCameraOrbit = `${lim[0] || 'auto'} ${lim[1] || 'auto'} ${(Math.max(v.homeR(), o.radius) * 2).toFixed(2)}m`;
      // The values have a size once they are displayed: place and measure on the next frame, then frame.
      requestAnimationFrame(() => { place(); frame(); });
      return;
    }
    mv.maxCameraOrbit = maxOrbit;
    if (restore && prev) {
      mv.cameraTarget = prev.target;
      mv.cameraOrbit = prev.orbit;
      v.jump();
    }
    prev = null;
  }

  const api = {
    on: false,
    toggle() { set(!api.on); },
    /** Turn off; restore = false keeps the camera where the visitor or a room put it. */
    off(restore = true) { set(false, restore); },
    /** Maqueta ↔ muros completos: the height line and its value follow. */
    cut() { if (api.on) { place(); requestAnimationFrame(frame); } },
    /** The visitor moved the camera: turning Medidas off keeps their view. */
    moved() { prev = null; },
    /** Orbit for a named view while Medidas is on (the plain one is what "off" returns to). */
    viewOrbit(orbit, target) {
      if (!api.on) return orbit;
      prev = { orbit, target };
      const [th, ph, r] = orbit.split(/\s+/);
      const r0 = /%$/.test(r) ? v.homeR() || mv.getCameraOrbit().radius : parseFloat(r);
      return `${rad(th)}rad ${rad(ph)}rad ${use(best(rad(th), rad(ph), vec3(target), r0)).toFixed(2)}m`;
    },
  };
  return api;
}
