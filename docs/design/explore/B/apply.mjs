#!/usr/bin/env node
/* Direction B · "Blueprint luxe / estudio técnico" — prototype applier.
   Copies dist/ → dist-explore-B/ (fresh), rewrites explore-B.css from readable token names to the
   shortened names the real build emits, generates the ornament masks (assets/*.svg), injects the stylesheet
   and the decorative markup into the home, /servicios/plano-2d-a-3d/ and /precios/.
   Never touches src/, public/, build/ or dist/.
   Run:  node docs/design/explore/B/apply.mjs   then   node build/serve.mjs 8902 dist-explore-B */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { iso, plan, maskLayers } from './iso.mjs';
import { number, cls, after, before, sec, secId } from './helpers.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..', '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'dist-explore-B');

/* ── 1. fresh copy ─────────────────────────────────────────────── */
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(DIST, OUT, { recursive: true });

/* ── 2. token map: readable source names → the shortened names in dist ──
   dist/site.css declares the tokens of src/css/00-tokens.css in the same order but with short names
   (--color-ink → --a). They are matched sequentially by value, so explore-B.css is written with the
   readable names it will have in the real source. */
const siteCssFile = fs.readdirSync(path.join(DIST, 'assets/css')).find((f) => /^site\.[0-9a-f]+\.css$/.test(f));
const siteCss = fs.readFileSync(path.join(DIST, 'assets/css/' + siteCssFile), 'utf8');
const distRoot = siteCss.match(/:root\{color-scheme:light dark;([^}]*)\}/)[1];
const distDecl = distRoot.split(';').map((d) => { const i = d.indexOf(':'); return [d.slice(0, i), d.slice(i + 1)]; });
const srcTokens = fs.readFileSync(path.join(ROOT, 'src/css/00-tokens.css'), 'utf8');
const srcRoot = srcTokens.match(/:root \{\s*color-scheme: light dark;([\s\S]*?)\n\}/)[1];
const norm = (v) => v.replace(/\/\*.*?\*\//g, '').trim().replace(/\s+/g, '').replace(/0\.(\d)/g, '.$1').toLowerCase();
const srcDecl = [...srcRoot.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2]]);
const map = new Map();
let cursor = 0;
for (const [name, value] of srcDecl) {
  for (let j = cursor; j < distDecl.length; j++) {
    if (norm(distDecl[j][1]) === norm(value)) { map.set(name, distDecl[j][0]); cursor = j + 1; break; }
  }
}

/* ── 3. stylesheet ─────────────────────────────────────────────── */
let css = fs.readFileSync(path.join(HERE, 'explore-B.css'), 'utf8');
const names = [...map.keys()].sort((x, y) => y.length - x.length);
css = css.replace(new RegExp('(' + names.join('|') + String.raw`)(?![\w-])`, 'g'), (n) => map.get(n));
const declared = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const used = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]));
const distNames = new Set(distDecl.map((d) => d[0]));
const undef = [...used].filter((n) => !declared.has(n) && !distNames.has(n));
if (undef.length) console.warn('  ! undefined custom properties (not declared here, not in dist):', undef.join(', '));
fs.writeFileSync(path.join(OUT, 'explore-B.css'), css);

/* ── 4. ornament masks: drawings generated once, shipped as small cached SVG files ──
   Each drawing is two luminance masks (lines / accent lines) painted by CSS with the theme colours. */
const D = {
  hero: iso({ layers: ['plate', 'walls', 'furn'], gap: 0, s: 18, dims: true }),
  cmp: iso({ layers: ['plate', 'walls'], gap: 0, s: 16, dims: true }),
  stack: iso({ layers: ['plate', 'walls', 'furn'], gap: 3.4, s: 15, guides: true }),
  plan: plan({ s: 56 }),
};
const ISO_LN = ['p', 'w', 'g', 'txt'], ISO_ACC = ['f', 'dm'];
const PLAN_LN = ['w', 'd', 'x', 'b', 'n', 't', 't2', 'txt'], PLAN_ACC = ['m'];
const MASKS = [
  ['i-hero.ln', D.hero, { ink: ISO_LN, at: 700 }], ['i-hero.acc', D.hero, { ink: ISO_ACC, at: 700 }],
  ['i-cmp.ln', D.cmp, { ink: ISO_LN, at: 430 }], ['i-cmp.acc', D.cmp, { ink: ISO_ACC, at: 430 }],
  ['i-stack.ln', D.stack, { ink: ISO_LN, at: 460 }], ['i-stack.acc', D.stack, { ink: ISO_ACC, at: 460 }],
  ['plan.ln', D.plan, { ink: PLAN_LN, at: 900, erase: ['w'] }], ['plan.acc', D.plan, { ink: PLAN_ACC, at: 900, erase: ['w'] }],
  ['plan-g.ln', D.plan, { ink: PLAN_LN, at: 900, erase: ['w'], noText: true }],
];
const assetsDir = path.join(HERE, 'assets');
fs.mkdirSync(assetsDir, { recursive: true });
const ratios = {};
for (const [name, o, { at, ...opt }] of MASKS) {
  fs.writeFileSync(path.join(assetsDir, name + '.svg'), maskLayers(o, { sw: +(o.w / at).toFixed(2), ...opt }));
  ratios[name.split('.')[0]] = `${Math.round(o.w)} / ${Math.round(o.h)}`;
}
fs.cpSync(assetsDir, path.join(OUT, 'explore-B'), { recursive: true });

/* ── 5. markup ─────────────────────────────────────────────────── */
function patch(file, fn) {
  const p = path.join(OUT, file);
  if (!fs.existsSync(p)) return;
  fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8')));
}
const LINK = '<link rel="stylesheet" href="/explore-B.css">';
const addCss = (h) => h.replace(/(<link rel="stylesheet" href="\/assets\/css\/[^"]+">)(?![\s\S]*<link rel="stylesheet" href="\/assets\/css\/)/, `$1${LINK}`);
/** A drawing: two masked layers painted by CSS. `cl` = extra classes (position, draw-on). */
const mk = (name, cl = '') => `<div class="hb-mk hb-${name} ${cl}" aria-hidden="true"><i></i></div>`;

const TOP = '<div class="hb-top" role="note"><div class="wrap"><span><i></i>Estudio de visualización 3D · <b>&nbsp;Costa del Sol</b></span><span>Plano 3D desde <b>&nbsp;149 € + IVA&nbsp;</b> · maqueta completa en 3 a 5 días laborables</span></div></div>';
const SEC = '<div class="hb-orn hb-sec" aria-hidden="true"><span class="hb-bub">A</span><span>CORTE A–A′ · ESC. 1:100</span><i></i><span class="hb-bub">A′</span></div>';
const RULER = (a, b) => `<div class="hb-orn hb-ruler" aria-hidden="true"><span style="top:0">+2,60</span><span style="top:${a}">+1,15</span><span style="top:${b};transform:translateY(-100%)">±0,00</span></div>`;
const PANEL = (t1, t2, t3, t4 = '') => `<div class="hb-panel hb-dk hb-gr" aria-hidden="true"><span class="t1"><b>Lám. 01</b> · ${t1}</span><span class="t2">${t2}</span><span class="t3">${t3}</span>${t4 ? `<span class="t4">${t4}</span>` : ''}</div>`;
const BENTO = [['01/05', 'Modelo 3D', 'Esc. 1:20 · 1:1'], ['02/05', 'Render 4K', '6 vistas'], ['03/05', 'Visor web', '12 estancias'], ['04/05', 'AR sin app', 'iPhone · Android'], ['05/05', 'Por estancia', 'Rev. A']]
  .map(([n, a, b]) => `<p class="hb-tb"><span>Lám. <b>${n}</b></span><span>${a}</span><span>${b}</span></p>`);
const PTB = '<dl class="hb-tbl" aria-hidden="true"><div><dt>Lámina</dt><dd>02 · Despiece axonométrico</dd></div><div><dt>Capas</dt><dd>3 · forjado, muros, mobiliario</dd></div><div><dt>Cotas</dt><dd>9,10 × 14,10 m · H 2,60 m · corte 1,15 m</dd></div><div><dt>Revisión</dt><dd>B · 28.09.2026</dd></div></dl>';

function common(h) {
  h = addCss(h);
  return h.replace('<header class="site-header" data-header>', TOP + '<header class="site-header" data-header>');
}
const footer = (h) => {
  h = cls(h, /<footer class="site-footer"[^>]*>/, 'hb-dk hb-gr');
  return after(h, /<footer class="site-footer[^>]*>/, mk('plan-g', 'hb-orn hb-orn--plan hb-sd'));
};

/* ── HOME ── */
function home(h) {
  h = common(h);
  h = cls(h, sec('hero--seq'), 'hb-gr hb-lit');
  h = after(h, sec('hero--seq'), PANEL('Maqueta seccionada', 'Rev. B · 28.09.2026', 'Planta alta · esc. 1:100', 'Render generado desde el plano 2D') + mk('i-hero', 'hb-orn hb-orn--iso hb-dr') + SEC + RULER('32%', '100%'));
  h = cls(h, sec('cajetin-band'), 'hb-dk');
  h = cls(h, sec('block--compare'), 'hb-ch hb-cc hb-gr');
  h = h.replace('</ul></div><figure class="compare__figure">', `</ul>${mk('i-cmp', 'hb-orn hb-sd')}</div><figure class="compare__figure">`);
  h = cls(h, sec('block--deliverables'), 'hb-ch hb-pp hb-gr');
  let n = 0;
  h = h.replace(/(<ul class="bento__formats"[\s\S]*?<\/ul>)(<\/div>)(<\/li>)/g, (m, a, b, c) => a + b + BENTO[n++] + c);
  h = cls(h, sec('block--process'), 'hb-ch hb-dk hb-gr hb-lit');
  h = after(h, sec('block--process'), mk('plan-g', 'hb-orn hb-orn--plan'));
  h = h.replace('<div class="despiece__stage">', '<div class="despiece__stage"><div class="hb-ruler" aria-hidden="true"><span style="top:10%">+2,60</span><span style="top:42%">+1,15</span><span style="top:78%">±0,00</span></div>');
  h = h.replace('</figcaption></figure></div><div class="process__steps">', '</figcaption></figure>' + PTB + '</div><div class="process__steps">');
  h = cls(h, sec('block--viewer'), 'hb-ch hb-c2 hb-gr');
  h = after(h, sec('block--viewer'), mk('plan', 'hb-orn hb-orn--plan hb-sd'));
  h = cls(h, sec('block--audiences'), 'hb-ch hb-wh');
  h = cls(h, sec('block--pricing'), 'hb-ch hb-cc hb-gr');
  h = cls(h, sec('block--calculator'), 'hb-ch hb-pp hb-gr');
  h = cls(h, sec('block--faq'), 'hb-ch hb-wh');
  h = cls(h, sec('form-section'), 'hb-ch hb-dk hb-gr hb-lit');
  h = after(h, sec('form-section'), mk('i-stack', 'hb-orn hb-orn--iso hb-sd'));
  // the "updated" line closes the graphite contact chapter (it used to sit between the form and the footer)
  h = h.replace(/<\/section>(<div class="wrap dateline-wrap">[\s\S]*?<\/p><\/div>)<\/main>/, (m, d) => d + '</section></main>');
  return footer(number(h));
}

/* ── SERVICE PAGE ── */
const ID = {
  a1: 'se-puede-hacer-un-modelo-3d-de-una-vivienda-solo-con-el-plano',
  a2: 'que-diferencia-hay-entre-un-plano-3d-y-una-maqueta-3d-completa',
  a3: 'que-precision-tienen-las-medidas-del-modelo-3d',
  a4: 'sirve-para-vender-obra-nueva-sobre-plano',
};
function service(h) {
  h = common(h);
  h = cls(h, sec('hero--figure'), 'hb-gr hb-lit');
  h = after(h, sec('hero--figure'), PANEL('Maqueta seccionada', 'Rev. B · 29.09.2026', 'Escala 1:100 · corte a 1,15 m') + SEC + RULER('46%', '100%'));
  h = cls(h, sec('cajetin-band'), 'hb-dk');
  h = cls(h, secId(ID.a1), 'hb-ch hb-pp hb-gr');
  h = cls(h, sec('block--compare'), 'hb-ch hb-cc hb-gr');
  h = h.replace('</ul></div><figure class="compare__figure">', `</ul>${mk('i-cmp', 'hb-orn hb-sd')}</div><figure class="compare__figure">`);
  h = cls(h, secId(ID.a2), 'hb-ch hb-wh');
  h = before(h, secId(ID.a2), '</aside>', mk('i-cmp', 'hb-sd'));
  h = cls(h, sec('block--plate'), 'hb-dk hb-gr hb-lit');
  h = before(h, sec('block--plate'), '</figure>', '<p class="hb-tb"><span>Lám. <b>03</b></span><span>Terraza · render 4K</span><span>Cámara a altura de ojos</span></p>');
  h = cls(h, sec('block--table'), 'hb-ch hb-pp hb-gr');
  h = cls(h, sec('block--process'), 'hb-ch hb-cc hb-gr');
  h = after(h, sec('block--process'), mk('i-stack', 'hb-orn hb-orn--iso hb-orn--r hb-sd'));
  h = cls(h, sec('block--needs'), 'hb-ch hb-wh');
  h = cls(h, secId(ID.a3), 'hb-ch hb-pp hb-gr');
  h = cls(h, secId(ID.a4), 'hb-ch hb-cc hb-gr');
  h = before(h, secId(ID.a4), '</aside>', mk('i-hero', 'hb-sd'));
  h = cls(h, sec('block--stat'), 'hb-dk hb-gr hb-lit hb-ch');
  h = after(h, sec('block--stat'), mk('plan', 'hb-orn hb-orn--plan hb-sd'));
  h = cls(h, sec('block--pricing'), 'hb-ch hb-pp hb-gr');
  h = cls(h, sec('block--callout'), 'hb-ch hb-cc');
  h = cls(h, sec('block--faq'), 'hb-ch hb-wh');
  h = cls(h, sec('block--related'), 'hb-ch hb-cc hb-gr');
  h = cls(h, sec('block--cta'), 'hb-dk hb-gr hb-lit');
  return footer(number(h));
}

/* ── PRICING PAGE (optional): a generic rhythm by section type ── */
function generic(h) {
  h = common(h);
  const cycle = ['hb-pp hb-gr', 'hb-wh'];
  let i = 0;
  h = h.replace(/<section class="([^"]*)"([^>]*)>/g, (m, c, rest) => {
    let add = '';
    if (/\bhero--text\b/.test(c)) add = 'hb-gr hb-lit';
    else if (/\bcajetin-band\b/.test(c)) add = 'hb-dk';
    else if (/\bblock--(plate|cta)\b/.test(c)) add = 'hb-dk hb-gr hb-lit';
    else if (/\bblock--(pricing|callout|related)\b/.test(c)) add = 'hb-ch hb-cc hb-gr';
    else if (/\bblock--calculator\b/.test(c)) add = 'hb-ch hb-pp hb-gr';
    else if (/\bblock--faq\b/.test(c)) add = 'hb-ch hb-wh';
    else if (/\bblock--(answer|table|checklist)\b/.test(c)) add = 'hb-ch ' + cycle[i++ % 2];
    return add ? `<section class="${c} ${add}"${rest}>` : m;
  });
  h = after(h, sec('hero--text'), mk('i-hero', 'hb-orn hb-orn--iso hb-dr') + SEC);
  return footer(number(h));
}

patch('index.html', home);
patch('servicios/plano-2d-a-3d/index.html', service);
patch('precios/index.html', generic);

const sz = (f) => fs.statSync(path.join(OUT, f)).size;
console.log(`explore-B ready → ${OUT}\n  css ${Buffer.byteLength(css)} B (token names shortened) · masks ${MASKS.length} files (${MASKS.reduce((a, [n]) => a + fs.statSync(path.join(assetsDir, n + '.svg')).size, 0)} B) · home html ${sz('index.html')} B (was ${fs.statSync(path.join(DIST, 'index.html')).size})`);
console.log('  aspect ratios for the CSS:', JSON.stringify(ratios));
