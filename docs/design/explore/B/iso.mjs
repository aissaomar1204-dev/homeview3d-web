/* Direction B · generators for the isometric wireframe / plan ornaments (build-time only, no runtime cost).
   Drawings are built as a list of items (paths, circles, texts) and rendered either
   - inline (renderInline), or
   - as CSS mask images (maskLayers): luminance masks where white = visible line and black = eraser.
     Boxes are painted far to near with a black fill, so a nearer box erases the lines of a farther one:
     hidden-line removal with the painter's algorithm, and the drawing has no background colour of its own. */
const C = Math.cos(Math.PI / 6);
const f1 = (n) => (Math.round(n * 10) / 10).toString();
const P = (x, y, z, s) => [(x - y) * C * s, ((x + y) * 0.5 - z) * s];

/* Villa plan in metres (footprint 9,10 x 14,10, like the real model). Segments [x1,y1,x2,y2, thickness]. Gaps are doors. */
export const PLAN_W = 9.1, PLAN_H = 14.1;
export const WALLS = [
  [0, 0, 9.1, 0, .25], [0, 14.1, 9.1, 14.1, .25], [0, 0, 0, 14.1, .25], [9.1, 0, 9.1, 14.1, .25], // outer shell
  [2.6, 0.12, 2.6, 4.8, .14], [2.6, 6.4, 2.6, 9.6, .14], [2.6, 11.2, 2.6, 14, .14],               // terrace edge, two glazed openings
  [2.6, 3.4, 9.1, 3.4, .12], [2.6, 7.2, 9.1, 7.2, .12], [6.0, 3.4, 6.0, 7.2, .12], [5.6, 7.2, 5.6, 14.1, .12], // rooms
  [5.6, 10.4, 9.1, 10.4, .12], [5.6, 12.2, 9.1, 12.2, .12],
];
export const DOORS = [[7, 5.0, 6.0], [8, 3.4, 4.5], [8, 6.9, 7.9], [9, 4.5, 5.5], [10, 9.0, 10.0], [11, 6.6, 7.6]]; // [wall index, from, to] along the wall axis
const FURN = [ // x, y, w, d, h: decorative volumes (sofa, beds, table, bath...)
  [3.0, 3.8, 2.4, .95, .8], [3.2, 5.4, 1.1, 1.1, .4], [6.5, 3.8, 1.8, 2.0, .5], [8.4, 3.8, .5, .5, .5],
  [3.0, 7.6, 1.9, 1.0, .5], [3.0, 8.9, 1.5, .9, .8], [6.0, 7.6, 1.9, 2.0, .5], [8.5, 8.4, .5, 1.6, 1.0],
  [6.0, 10.8, 1.7, .9, .5], [7.9, 10.6, 1.0, 1.4, .5], [6.1, 12.6, 1.0, .5, .9], [7.7, 12.6, 1.2, 1.1, .5],
  [.5, 1.0, 1.1, 2.2, .45], [.5, 4.0, 1.1, 2.2, .45], [.9, 9.5, 1.4, 1.4, .5],
];

function wallBoxes(h, z0 = 0) {
  const out = [];
  WALLS.forEach(([x1, y1, x2, y2, t], i) => {
    const horiz = y1 === y2, a = horiz ? x1 : y1, b = horiz ? x2 : y2;
    const gaps = DOORS.filter((d) => d[0] === i).map((d) => [d[1], d[2]]).sort((p, q) => p[0] - q[0]);
    let cur = a; const segs = [];
    for (const [g1, g2] of gaps) { segs.push([cur, g1]); cur = g2; }
    segs.push([cur, b]);
    for (const [s1, s2] of segs) {
      if (s2 - s1 < .05) continue;
      out.push(horiz ? [s1, y1 - t / 2, z0, s2 - s1, t, h] : [x1 - t / 2, s1, z0, t, s2 - s1, h]);
    }
  });
  return out;
}

/* ── isometric model ───────────────────────────────────────────────────────
   item = { t: 'p', c: class, d } | { t: 't', c, x, y, s, rot } ; classes: p plate, w walls, f furniture, g guide, dm dimension */
export function iso({ layers = ['plate', 'walls'], s = 22, gap = 4.2, cut = 1.15, guides = false, dims = false, pad = 8 } = {}) {
  const boxes = [];
  let z = 0;
  for (const l of layers) {
    if (l === 'plate') boxes.push({ x: -.35, y: -.35, z, w: PLAN_W + .7, d: PLAN_H + .7, h: .3, cls: 'p' });
    if (l === 'walls') wallBoxes(cut, z + .3).forEach(([x, y, zz, w, d, h]) => boxes.push({ x, y, z: zz, w, d, h, cls: 'w' }));
    if (l === 'furn') FURN.forEach(([x, y, w, d, h]) => boxes.push({ x, y, z: z + .3, w, d, h, cls: 'f' }));
    z += gap;
  }
  boxes.sort((a, b) => (Math.round(a.z * 4) - Math.round(b.z * 4)) || ((a.x + a.w + a.y + a.d) - (b.x + b.w + b.y + b.d)));
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  const pts = (arr) => arr.forEach(([px, py]) => { minX = Math.min(minX, px); maxX = Math.max(maxX, px); minY = Math.min(minY, py); maxY = Math.max(maxY, py); });
  const items = [];
  if (guides && layers.length > 1) { // vertical dashed guides at the 4 outer corners between layers
    const zTop = z - gap + .3;
    [[-.35, -.35], [PLAN_W + .35, -.35], [PLAN_W + .35, PLAN_H + .35], [-.35, PLAN_H + .35]].forEach(([cx, cy]) => { const a = P(cx, cy, 0, s), b = P(cx, cy, zTop, s); pts([a, b]); items.push({ t: 'p', c: 'g', d: `M${f1(a[0])} ${f1(a[1])}V${f1(b[1])}` }); });
  }
  if (dims) { // dimension chains outside the two near edges: extension lines, slash ticks, value along the isometric axis
    const W = PLAN_W + .35, H = PLAN_H + .35, o = 1.7, tk = (a) => `M${f1(a[0] - 4)} ${f1(a[1] + 4)}l8 -8`;
    const one = (p1, p2, off, label, ang) => {
      const a = P(p1[0], p1[1], 0, s), b = P(p2[0], p2[1], 0, s);
      const c = P(p1[0] + off[0], p1[1] + off[1], 0, s), d = P(p2[0] + off[0], p2[1] + off[1], 0, s);
      const e1 = P(p1[0] + off[0] * 1.12, p1[1] + off[1] * 1.12, 0, s), e2 = P(p2[0] + off[0] * 1.12, p2[1] + off[1] * 1.12, 0, s);
      pts([c, d, e1, e2]);
      const mx = (c[0] + d[0]) / 2, my = (c[1] + d[1]) / 2;
      items.push({ t: 'p', c: 'dm', d: `M${f1(a[0])} ${f1(a[1])}L${f1(e1[0])} ${f1(e1[1])}M${f1(b[0])} ${f1(b[1])}L${f1(e2[0])} ${f1(e2[1])}M${f1(c[0])} ${f1(c[1])}L${f1(d[0])} ${f1(d[1])}${tk(c)}${tk(d)}` });
      items.push({ t: 't', c: '', x: f1(mx), y: f1(my - 6), a: 'middle', s: label, rot: `${ang} ${f1(mx)} ${f1(my)}` });
    };
    one([-.35, H], [W, H], [0, o], '9,10 m', 30);
    one([W, -.35], [W, H], [o, 0], '14,10 m', -30);
  }
  boxes.forEach((b) => {
    const { x, y, z: bz, w, d, h } = b;
    const top = [P(x, y, bz + h, s), P(x + w, y, bz + h, s), P(x + w, y + d, bz + h, s), P(x, y + d, bz + h, s)];
    const right = [P(x + w, y, bz, s), P(x + w, y + d, bz, s), P(x + w, y + d, bz + h, s), P(x + w, y, bz + h, s)];
    const left = [P(x, y + d, bz, s), P(x + w, y + d, bz, s), P(x + w, y + d, bz + h, s), P(x, y + d, bz + h, s)];
    [top, right, left].forEach(pts);
    const poly = (a) => 'M' + a.map(([px, py]) => f1(px) + ' ' + f1(py)).join('L') + 'Z';
    items.push({ t: 'p', c: b.cls, d: poly(left) + poly(right) + poly(top) });
  });
  const vb = [minX - pad, minY - pad, maxX - minX + 2 * pad, maxY - minY + 2 * pad].map(f1);
  return { vb: vb.join(' '), w: +vb[2], h: +vb[3], items };
}

/* ── orthographic plan, landscape (x,y swapped): axes, dimension chains, door swings, tags ───────────────
   classes: w wall, d door swing, x axis, b bubble, m dimension chain, t/t2 room tags */
export function plan({ s = 60 } = {}) {
  const X = (y) => y * s, Y = (x) => x * s; // transpose: plan x -> vertical, plan y -> horizontal
  const ox = 70, oy = 70, items = [];
  const path = (c, d) => items.push({ t: 'p', c, d });
  const text = (c, x, y, str, a = 'middle') => items.push({ t: 't', c, x: f1(x), y: f1(y), a, s: str });
  const W = PLAN_H * s, H = PLAN_W * s;
  // axes with bubbles (dash-dot): letters along the long side, numbers along the short one
  [[0, 'A'], [3.4, 'B'], [7.2, 'C'], [10.4, 'D'], [PLAN_H, 'E']].forEach(([py, l]) => { const x = ox + X(py); path('x', `M${f1(x)} ${f1(oy - 34)}V${f1(oy + H + 26)}`); items.push({ t: 'c', c: 'b', cx: f1(x), cy: f1(oy - 46), r: 11 }); text('', x, oy - 42, l); });
  [[0, '1'], [2.6, '2'], [6.0, '3'], [PLAN_W, '4']].forEach(([px, n]) => { const y = oy + Y(px); path('x', `M${f1(ox - 34)} ${f1(y)}H${f1(ox + W + 26)}`); items.push({ t: 'c', c: 'b', cx: f1(ox - 46), cy: f1(y), r: 11 }); text('', ox - 46, y + 4, n); });
  // walls (rectangles) and door swings
  WALLS.forEach(([x1, y1, x2, y2, t], i) => {
    const horiz = y1 === y2, a = horiz ? x1 : y1, b = horiz ? x2 : y2;
    const gaps = DOORS.filter((d) => d[0] === i).map((d) => [d[1], d[2]]).sort((p, q) => p[0] - q[0]);
    let cur = a; const segs = [];
    for (const [g1, g2] of gaps) { segs.push([cur, g1]); cur = g2; }
    segs.push([cur, b]);
    for (const [s1, s2] of segs) {
      if (s2 - s1 < .05) continue;
      const [px, py, pw, ph] = horiz ? [X(y1) - t * s / 2, Y(s1), t * s, (s2 - s1) * s] : [X(s1), Y(x1) - t * s / 2, (s2 - s1) * s, t * s];
      path('w', `M${f1(ox + px)} ${f1(oy + py)}h${f1(pw)}v${f1(ph)}h${f1(-pw)}Z`);
    }
  });
  DOORS.forEach(([i, g1, g2]) => {
    const [x1, y1, , y2] = WALLS[i]; const horiz = y1 === y2, r = (g2 - g1) * s;
    if (horiz) { const cx = ox + X(y1), cy = oy + Y(g1); path('d', `M${f1(cx)} ${f1(cy)}h${f1(r)}M${f1(cx + r)} ${f1(cy)}A${f1(r)} ${f1(r)} 0 0 1 ${f1(cx)} ${f1(cy + r)}`); }
    else { const cx = ox + X(g1), cy = oy + Y(x1); path('d', `M${f1(cx)} ${f1(cy)}v${f1(r)}M${f1(cx)} ${f1(cy + r)}A${f1(r)} ${f1(r)} 0 0 0 ${f1(cx + r)} ${f1(cy)}`); }
  });
  // dimension chains
  const tick = (x, y) => `M${f1(x - 5)} ${f1(y + 5)}l10 -10`;
  const chainB = [0, 3.4, 7.2, 10.4, PLAN_H], dy = oy + H + 44;
  path('m', `M${f1(ox)} ${f1(dy)}H${f1(ox + W)}${chainB.map((v) => tick(ox + X(v), dy)).join('')}`);
  chainB.slice(1).forEach((v, k) => text('', ox + X((v + chainB[k]) / 2), dy - 7, (v - chainB[k]).toFixed(2).replace('.', ',')));
  const chainR = [0, 2.6, 6.0, PLAN_W], dx = ox + W + 44;
  path('m', `M${f1(dx)} ${f1(oy)}V${f1(oy + H)}${chainR.map((v) => tick(dx, oy + Y(v))).join('')}`);
  chainR.slice(1).forEach((v, k) => text('', dx + 16, oy + Y((v + chainR[k]) / 2) + 4, (v - chainR[k]).toFixed(2).replace('.', ','), 'start'));
  // room tags
  [['TERRAZA', 1.3, 7.0, '23,0'], ['SALÓN', 4.3, 5.3, '11,5'], ['DORM. 1', 7.5, 5.3, '16,2'], ['DORM. 2', 5.85, 1.7, '8,1'], ['DORM. 3', 4.1, 10.6, '8,1'], ['BAÑO', 7.35, 8.8, '8,2']].forEach(([n, px, py, m]) => {
    text('t', ox + X(py), oy + Y(px), n); text('t2', ox + X(py), oy + Y(px) + 13, `≈ ${m} m²`);
  });
  // north arrow
  const nx = ox + W + 88, ny = oy - 20;
  items.push({ t: 'c', c: 'b', cx: nx, cy: ny, r: 18 }); path('n', `M${nx} ${ny - 26}L${nx - 7} ${ny + 8}L${nx} ${ny + 3}L${nx + 7} ${ny + 8}Z`); text('', nx, ny - 32, 'N');
  return { vb: `0 0 ${ox + W + 140} ${oy + H + 100}`, w: ox + W + 140, h: oy + H + 100, items };
}

/* ── inline rendering (kept for comparison: it costs HTML bytes on every page) ── */
export function renderInline(o) {
  return o.items.map((it) => it.t === 'p' ? `<path class="${it.c}" d="${it.d}"/>`
    : it.t === 'c' ? `<circle class="${it.c}" cx="${it.cx}" cy="${it.cy}" r="${it.r}"/>`
    : `<text${it.c ? ` class="${it.c}"` : ''} x="${it.x}" y="${it.y}" text-anchor="${it.a}"${it.rot ? ` transform="rotate(${it.rot})"` : ''}>${it.s}</text>`).join('');
}

/* ── mask rendering ─────────────────────────────────────────────────────────
   One SVG per paint colour. `ink` decides which item classes are drawn white in this layer; every filled item
   (boxes, plan walls) is also painted black in the other layers, so it erases what lies behind it.
   sw = stroke width in viewBox units (chosen so the line is ~1px at the size the drawing is shown). */
export function maskLayers(o, { ink, sw = 1, noText = false, erase = ['p', 'w', 'f'], dash = { g: '3 4', x: '10 3 2 3' } }) {
  const font = `font-family="ui-monospace,Consolas,Menlo,monospace" font-size="10" letter-spacing=".4"`;
  const body = o.items.map((it) => {
    if (it.t === 't') {
      if (noText || !ink.includes(it.c || 'txt')) return '';
      return `<text ${font} fill="#fff" x="${it.x}" y="${it.y}" text-anchor="${it.a}"${it.rot ? ` transform="rotate(${it.rot})"` : ''}>${it.s}</text>`;
    }
    const filled = erase.includes(it.c), white = ink.includes(it.c);
    if (!filled && !white) return '';
    const st = `stroke="${white ? '#fff' : '#000'}" stroke-width="${sw}" stroke-linejoin="round"`;
    const da = dash[it.c] && white ? ` stroke-dasharray="${dash[it.c]}"` : '';
    if (it.t === 'c') return `<circle cx="${it.cx}" cy="${it.cy}" r="${it.r}" fill="${filled ? '#000' : 'none'}" ${st}/>`;
    return `<path d="${it.d}" fill="${filled ? '#000' : 'none'}" ${st}${da}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.vb}" width="${o.w}" height="${o.h}">${body}</svg>`;
}
