#!/usr/bin/env node
/* Direction A · "Monografía blanco y negro". Prototype only: copies dist/ to dist-explore-A/, links explore-A.css on every
   page, sets the chapter tone/number on every <main> section (data-ch / data-n) and injects the extra decorative markup on the
   home and on /servicios/plano-2d-a-3d/. Nothing under src/, build/, public/ or dist/ is touched.
   Run: node docs/design/explore/A/apply.mjs   then   node build/serve.mjs 8901 dist-explore-A */
import fs from 'node:fs';
import path from 'node:path';

const HERE = import.meta.dirname;
const ROOT = path.resolve(HERE, '../../../..');
const OUT = path.join(ROOT, 'dist-explore-A');

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'dist'), OUT, { recursive: true });
fs.cpSync(path.join(HERE, 'assets'), path.join(OUT, 'explore-A'), { recursive: true });

const IMG = fs.readdirSync(path.join(OUT, 'assets/img'));
const imgUrl = (name, w, ext) => {
  const f = IMG.find((x) => x.startsWith(`${name}-${w}.`) && x.endsWith(`.${ext}`));
  if (!f) throw new Error(`missing image ${name}-${w}.${ext}`);
  return `/assets/img/${f}`;
};
const picture = (name, alt, { widths = [800, 1200, 1600, 2400], fallback = 1600, sizes = '100vw', w = 2400, h = 1600, lazy = true } = {}) =>
  `<picture><source type="image/avif" srcset="${widths.map((x) => `${imgUrl(name, x, 'avif')} ${x}w`).join(', ')}" sizes="${sizes}">` +
  `<img src="${imgUrl(name, fallback, 'webp')}" width="${w}" height="${h}" alt="${alt}"${lazy ? ' loading="lazy" decoding="async"' : ''}></picture>`;


/* ---------- Prototype-only token bridge ----------
   The production build (build/lib/assets.mjs) inlines short static tokens (--space-3 -> 12px) and shortens every other custom
   property (--color-ink -> --a). explore-A.css is written with the SOURCE names, exactly as it would live in src/css, so the
   prototype rewrites them to the names of the built site.css by aligning the :root block of src/css/00-tokens.css with the one in
   dist. Integrated in src/css, the real build does this by itself and none of it is needed. */
const norm = (v) => v.replace(/\s+/g, '').replace(/(^|[^\d])0\./g, '$1.');
const decls = (body) => [...body.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);?/g)].map((m) => [m[1], m[2].trim()]);
function tokenBridge(css) {
  const src = decls(fs.readFileSync(path.join(ROOT, 'src/css/00-tokens.css'), 'utf8').match(/:root\s*\{([^}]*)\}/)[1]);
  const siteCss = fs.readdirSync(path.join(OUT, 'assets/css')).find((f) => /^site\./.test(f));
  const built = fs.readFileSync(path.join(OUT, 'assets/css', siteCss), 'utf8');
  const bl = decls(built.match(/:root\{color-scheme:light dark;([^}]*)\}/)[1]);
  const alias = new Map(), literal = new Map();
  let j = 0;
  for (const [n, v] of src) {
    const k = bl.findIndex(([, bv], i) => i >= j && norm(bv) === norm(v));
    if (k > -1) { alias.set(n, bl[k][0]); j = k + 1; } else literal.set(n, v);
  }
  const cota = built.match(/\.cota__label\{[^}]*background:var\((--[\w-]+),/);
  if (cota) alias.set('--cota-bg', cota[1]);
  const lit = (v, d = 0) => (d < 4 ? v.replace(/var\((--[\w-]+)\)/g, (m, n) => (literal.has(n) ? lit(literal.get(n), d + 1) : m)) : v);
  return css
    .replace(/var\((--[\w-]+)\)/g, (m, n) => (literal.has(n) ? lit(literal.get(n)) : m))
    .replace(/--[\w-]+/g, (n) => alias.get(n) || n);
}

/* ---------- Chapter rhythm: which tone each section class gets (w white, p paper, g grey mat, k graphite, h hero sheet) ---------- */
const RULES = [
  [/\bhero\b/, 'h', null], [/cajetin-band/, 'k', null],
  [/block--compare/, 'g', ['Plano y modelo', 'Plan and model']], [/block--deliverables/, 'w', ['Entregables', 'Deliverables']],
  [/block--process/, 'k', ['Proceso', 'Process']], [/block--viewer/, 'g', ['Visor 3D', '3D viewer']],
  [/block--audiences/, 'w', ['Clientes', 'Clients']], [/block--pricing/, 'g', ['Precios', 'Pricing']],
  [/block--calculator/, 'k', ['Volumen', 'Volume']], [/block--faq/, 'w', ['Preguntas', 'Questions']],
  [/block--form/, 'k', ['Contacto', 'Contact']], [/cta-band/, 'k', ['Siguiente paso', 'Next step']],
  [/block--stat/, 'k', ['Dato', 'Figure']], [/block--plate/, 'g', null], [/block--table/, 'w', ['Comparativa', 'Comparison']],
  [/block--needs/, 'g', ['Requisitos', 'Requirements']], [/block--callout/, 'p', null], [/block--related/, 'w', ['Sigue leyendo', 'Keep reading']],
  [/block--answer/, 'alt', ['Respuesta', 'Answer']],
];
const AXES = '<div class="ch-ax" aria-hidden="true"><i><b>A</b></i><i><b>B</b></i><i><b>C</b></i><i><b>D</b></i><i><b>E</b></i></div>';

function sectionEnd(main, from) {
  const re = /<(\/?)section\b[^>]*>/g;
  re.lastIndex = from;
  let d = 0, m;
  while ((m = re.exec(main))) { d += m[1] ? -1 : 1; if (!d) return m.index; }
  return main.length;
}

function chapterize(main, lang) {
  let n = 0, alt = 0, prev = '', depth = 0, out = '', last = 0, m;
  const re = /<(\/?)section\b([^>]*)>(\s*<div class="wrap[^"]*">)?/g;
  while ((m = re.exec(main))) {
    const [full, close, attrs, wrap] = m;
    if (close) { depth--; continue; }
    if (depth++) continue; // nested sections (embeds inside a chapter) keep their markup
    let rep = full;
    if (/data-ch=/.test(attrs)) prev = 'k';
    else {
      const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1];
      const rule = RULES.find(([re2]) => re2.test(cls));
      let tone = rule ? rule[1] : 'alt';
      if (tone === 'alt') tone = alt++ % 2 ? 'p' : 'w';
      if (tone === prev && tone !== 'k' && tone !== 'h') tone = tone === 'w' ? 'p' : 'w';
      prev = tone;
      const label = rule && rule[2];
      const hasHead = /<h2\b/.test(main.slice(m.index, sectionEnd(main, m.index)));
      const numbered = label && (hasHead || /block--stat/.test(cls)) && tone !== 'h' && !/cajetin-band|block--plate/.test(cls);
      const nn = numbered ? String(++n).padStart(2, '0') : '';
      rep = `<section${attrs} data-ch="${tone}"${numbered ? ` data-n="${nn}"` : ''}>`;
      if (wrap) {
        if (numbered && (tone === 'g' || tone === 'p')) rep += AXES;
        rep += wrap;
        if (numbered) rep += `<div class="ch-ix" aria-hidden="true"><b>${nn}</b><span>${label[lang === 'en' ? 1 : 0]}</span><i></i><em>${lang === 'en' ? 'Sheet' : 'Lám.'} A-${nn}</em></div>`;
      }
    }
    out += main.slice(last, m.index) + rep;
    last = m.index + full.length;
  }
  return out + main.slice(last);
}

/* ---------- Extra decorative markup (ES and EN copy) ---------- */
const T = {
  es: { scale: 'Esc. 1:100', sheet: 'Lám.', salon: 'Salón hacia la terraza, a la altura de los ojos.', render: 'Render 3D generado a partir del plano 2D.', dorm: 'Dormitorio principal.', bano: 'Baño en suite.',
    altSalon: 'Salón de la villa hacia la terraza, a la altura de los ojos. Render 3D generado a partir del plano 2D.', altDorm: 'Dormitorio principal de la villa con cabecero de obra y salida a la terraza. Render 3D generado a partir del plano 2D.',
    altBano: 'Baño en suite con bañera exenta y porcelánico negro. Render 3D generado a partir del plano 2D.' },
  en: { scale: 'Scale 1:100', sheet: 'Sheet', salon: 'Living room towards the terrace, at eye level.', render: '3D render generated from the 2D floor plan.', dorm: 'Master bedroom.', bano: 'Ensuite bathroom.',
    altSalon: 'Living room of the villa towards the terrace, at eye level. 3D render generated from the 2D floor plan.', altDorm: 'Master bedroom of the villa with a built-in headboard and access to the terrace. 3D render generated from the 2D floor plan.',
    altBano: 'Ensuite bathroom with a freestanding tub and black porcelain tiles. 3D render generated from the 2D floor plan.' },
};
const LEG = (t) => `<div class="hv-leg" aria-hidden="true"><svg class="hv-na" viewBox="0 0 34 44"><circle cx="17" cy="27" r="15" fill="none" stroke="currentColor"/><path d="M17 9l6 18-6-5z" fill="currentColor"/><path d="M17 9l-6 18 6-5z" fill="none" stroke="currentColor"/><path d="M17 22v20" stroke="currentColor"/><text x="17" y="7">N</text></svg><div class="hv-sb"><span>0</span><span>2</span><span>5 m</span></div><p>${t.scale}<br>${t.sheet} A-00</p></div>`;
const PLATE1 = (t) => `<section class="a-plate" data-ch="k" aria-label="${t.sheet} 02"><figure>${picture('villa_interior_salon', t.altSalon, { sizes: '100vw' })}<figcaption><b>${t.sheet} 02</b><span>${t.salon}</span><span>${t.render}</span></figcaption></figure></section>`;
const PLATE2 = (t) => `<section class="a-plate a-plate--2" data-ch="k" aria-label="${t.sheet} 03, 04"><figure>${picture('villa_interior_dormitorio', t.altDorm, { sizes: '(min-width: 768px) 58vw, 100vw' })}<figcaption><b>${t.sheet} 03</b><span>${t.dorm} ${t.render}</span></figcaption></figure><figure>${picture('villa_interior_bano', t.altBano, { sizes: '(min-width: 768px) 42vw, 100vw' })}<figcaption><b>${t.sheet} 04</b><span>${t.bano} ${t.render}</span></figcaption></figure></section>`;
const CONTACT_FIG = (t) => `<figure class="a-fig">${picture('villa_interior_bano', t.altBano, { widths: [480, 800, 1200], fallback: 800, sizes: '(min-width: 1024px) 420px, 100vw' })}<figcaption>${t.bano} ${t.render}</figcaption></figure>`;
const SIDE = () => `<div class="ch-side" aria-hidden="true">${[1, 2, 3].map((n) => picture(`villa_despiece_${n}`, '', { widths: [480, 800, 1200], fallback: 800, sizes: '(min-width: 1024px) 40vw, 100vw', w: 1600, h: 1030 })).join('')}</div>`;

function home(html, lang) {
  const t = T[lang];
  html = html.replace(/(<p class="actions" data-hero-actions>[\s\S]*?<\/p>)(<\/div><figure class="hs")/, `$1${LEG(t)}$2`);
  html = html.replace(/(<section[^>]*block--compare[\s\S]*?<\/section>)/, `$1${PLATE1(t)}`);   // plate I after "plan to 3D"
  html = html.replace(/(<section[^>]*block--viewer[\s\S]*?<\/section>)/, `$1${PLATE2(t)}`);     // diptych after the viewer
  html = html.replace(/(<p class="alt__note">[^<]*<\/p>)(<\/aside>)/, `$1${CONTACT_FIG(t)}$2`);
  return html;
}
function service(html, lang) {
  const t = T[lang];
  html = html.replace(/(<p class="actions" data-hero-actions>[\s\S]*?<\/p>)(<\/div><figure class="hero__figure)/, `$1${LEG(t)}$2`);
  html = html.replace(/(<p class="cota"[^>]*>[\s\S]*?<\/p>)(<\/div><\/section><section[^>]*block--needs)/, `$1${SIDE()}$2`);
  return html;
}

fs.writeFileSync(path.join(OUT, 'explore-A.css'), tokenBridge(fs.readFileSync(path.join(HERE, 'explore-A.css'), 'utf8')));

/* ---------- Walk every page ---------- */
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (['assets', 'lib', 'models', 'explore-A'].includes(e.name) && d === OUT ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
let pages = 0;
for (const file of walk(OUT)) {
  const rel = path.relative(OUT, file).replace(/\\/g, '/');
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('</head>')) continue;
  const lang = (html.match(/<html[^>]*lang="(\w+)"/) || [, 'es'])[1];
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*>/g)];
  const last = links.at(-1);
  html = last ? html.slice(0, last.index + last[0].length) + '<link rel="stylesheet" href="/explore-A.css">' + html.slice(last.index + last[0].length) : html.replace('</head>', '<link rel="stylesheet" href="/explore-A.css"></head>');
  const brand = (html.match(/property="og:site_name" content="([^"]*)"/) || [, 'Home View 3D'])[1];
  const i = html.indexOf('<main'), j = html.indexOf('</main>');
  if (i > -1 && j > i) {
    let main = html.slice(i, j);
    if (rel === 'index.html' || rel === 'en/index.html') main = home(main, lang);
    if (rel === 'servicios/plano-2d-a-3d/index.html') main = service(main, lang);
    main = chapterize(main, lang);
    html = html.slice(0, i) + main + html.slice(j);
  }
  html = html.replace('<div class="site-footer__top">', `<div class="site-footer__top" data-w="${brand}">`);
  fs.writeFileSync(file, html);
  pages += 1;
}
const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1);
console.log(`dist-explore-A ready: ${pages} pages, explore-A.css ${kb(path.join(OUT, 'explore-A.css'))} KB, plan-lines.webp ${kb(path.join(OUT, 'explore-A/plan-lines.webp'))} KB`);
