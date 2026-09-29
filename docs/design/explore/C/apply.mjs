#!/usr/bin/env node
/* ===========================================================================
   Direction C · "Claroscuro cinematografico" · prototype builder.
   Reads dist/ (never modifies it), writes dist-explore-C/:
     - copies dist/ fresh,
     - links /explore-C.css after the site stylesheets in the pages below,
     - tags every <section> of <main> with a chapter tone (ch--hero, ch--night, ch--paper,
       ch--sheet, ch--mesa, ch--abyss) and injects one decorative <i class="ch__d"> per chapter,
     - copies the decorative assets (grain SVG + a few crops of existing renders under stable names).
   Serve:  node build/serve.mjs 8903 dist-explore-C
   =========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ID = 'C';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const SRC = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, `dist-explore-${ID}`);

/* ---------- The site build shortens and inlines custom properties (--color-ink-2 becomes --e, var(--space-6) becomes 32px).
   The exploration CSS is written with the readable token names, exactly as it would be in src/css, so the copy that is
   served goes through the SAME functions of build/lib/assets.mjs, with the alias map computed from the site sources only. ---------- */
async function shipCss(css) {
  const A = await import(pathToFileURL(path.join(ROOT, 'build/lib/assets.mjs')).href);
  const dir = path.join(ROOT, 'src/css');
  const parts = fs.readdirSync(dir).filter((f) => f.endsWith('.css')).sort()
    .map((f) => ({ f, css: A.minifyCss(fs.readFileSync(path.join(dir, f), 'utf8')) }));
  // names used from JS or templates keep their source name (same scan as keepNames in assets.mjs)
  const keep = new Set();
  const walk = (p) => fs.readdirSync(p, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)]));
  for (const d of ['src/js', 'build/lib', 'build/templates']) {
    for (const file of walk(path.join(ROOT, d))) {
      if (!/\.m?js$/.test(file)) continue;
      const code = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
      for (const m of code.matchAll(/--[a-zA-Z][\w-]*/g)) keep.add(m[0]);
    }
  }
  // tokens the build inlines (declared once in :root with a short literal value): same rule as inlineStaticTokens
  const count = new Map();
  for (const m of parts.map((p) => p.css).join('\n').matchAll(/(?:^|[{;(\s])(--[a-zA-Z][\w-]*)\s*:/g)) count.set(m[1], (count.get(m[1]) || 0) + 1);
  const values = new Map();
  for (const p of parts) {
    const root = p.css.match(/(?:^|})\s*:root\{([^}]*)\}/);
    if (!root) continue;
    for (const d of root[1].split(';')) {
      const m = d.match(/^\s*(--[a-zA-Z][\w-]*)\s*:\s*([^;]+?)\s*$/);
      if (!m || count.get(m[1]) !== 1 || keep.has(m[1])) continue;
      if (/^-?[\d.]+(px|em|rem|ch|ms|%)?$/.test(m[2]) && m[2].length <= 7) values.set(m[1], m[2]);
    }
  }
  A.inlineStaticTokens(parts, keep);
  const alias = A.customPropAliases(parts.map((p) => p.css).join('\n'), keep);
  const siteDir = path.join(SRC, 'assets/css');
  const site = fs.readFileSync(path.join(siteDir, fs.readdirSync(siteDir).find((n) => n.startsWith('site.'))), 'utf8');
  if (!site.includes(`${alias.get('--color-ink-2')}:#434A52`)) throw new Error('token alias map does not match dist/: rebuild dist or check build/lib/assets.mjs');
  let out = A.minifyCss(css);
  out = out.replace(/var\((--[a-zA-Z][\w-]*)\)/g, (m, n) => (values.has(n) ? values.get(n) : m));
  return A.applyAliases(out, alias);
}

if (!fs.existsSync(path.join(SRC, 'index.html'))) throw new Error('dist/ is missing: run the build first');
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });

/* ---------- assets: stable names for the crops the CSS uses (hashed names are resolved from dist) ---------- */
const imgDir = path.join(SRC, 'assets', 'img');
const imgs = fs.readdirSync(imgDir);
const pick = (base, w, ext = 'avif') => {
  const f = imgs.find((n) => n.startsWith(`${base}-${w}.`) && n.endsWith(`.${ext}`));
  if (!f) throw new Error(`missing ${base}-${w}.${ext}`);
  return path.join(imgDir, f);
};
const dstDir = path.join(OUT, `explore-${ID}`);
fs.mkdirSync(dstDir, { recursive: true });
const ASSETS = [
  // [alias, source base, width]
  ['bano-1600', 'villa_interior_bano', 1600], ['bano-800', 'villa_interior_bano', 800],
  ['terraza-1600', 'villa_interior_terraza', 1600], ['terraza-800', 'villa_interior_terraza', 800],
  ['dormitorio-1600', 'villa_interior_dormitorio', 1600], ['dormitorio-800', 'villa_interior_dormitorio', 800],
  ['salon-1600', 'villa_interior_salon', 1600], ['salon-800', 'villa_interior_salon', 800],
  ['maqueta-800', 'villa_maqueta_iso_opaco', 800],
  ['muros-800', 'villa_muros_completos_opaco', 800],
  ['terrazaex-800', 'villa_terraza_opaco', 800],
  ['plano-800', 'villa_plano_lineas', 800],
];
for (const [alias, base, w] of ASSETS) fs.copyFileSync(pick(base, w), path.join(dstDir, `${alias}.avif`));
for (const f of fs.readdirSync(path.join(HERE, 'assets'))) fs.copyFileSync(path.join(HERE, 'assets', f), path.join(dstDir, f));
fs.writeFileSync(path.join(OUT, `explore-${ID}.css`), await shipCss(fs.readFileSync(path.join(HERE, `explore-${ID}.css`), 'utf8')));

/* ---------- pages: chapter plans (index of <section> inside <main> -> classes) ---------- */
const HOME = [
  'ch ch--hero',                      // 0 hero (light, luminous)
  'ch ch--night ch--band',            // 1 cajetin: black title block
  'ch ch--mesa',                      // 2 compare: mid grey
  'ch ch--night ch--open ph-bano',    // 3 deliverables: near-black, bathroom render leaks warm light
  'ch ch--sheet',                     // 4 process: white sheet
  'ch ch--night ch--spot',            // 5 viewer: black stage, pool of light
  'ch ch--paper',                     // 6 audiences: paper + photo tiles
  'ch ch--night ch--open ph-terraza', // 7 pricing: dramatic dark
  'ch ch--night ch--cont',            // 8 calculator: same dark chapter
  'ch ch--paper',                     // 9 faq
  'ch ch--night ch--open ph-dormitorio', // 10 contact
];
const SERVICE = [
  'ch ch--hero ch--inner',            // 0 hero
  'ch ch--night ch--band',            // 1 cajetin
  'ch ch--paper',                     // 2 answer
  'ch ch--mesa',                      // 3 compare
  'ch ch--sheet',                     // 4 answer (flip, price card)
  'ch ch--abyss ch--plate',           // 5 plate: cinematic render
  'ch ch--paper',                     // 6 table
  'ch ch--sheet',                     // 7 process
  'ch ch--mesa',                      // 8 needs
  'ch ch--paper',                     // 9 answer
  'ch ch--sheet',                     // 10 answer (flip, fact)
  'ch ch--night ch--stat',            // 11 stat
  'ch ch--night ch--cont',            // 12 pricing
  'ch ch--paper',                     // 13 callout
  'ch ch--sheet',                     // 14 faq
  'ch ch--mesa',                      // 15 related
  'ch ch--night ch--open ph-salon',   // 16 cta band
];
const PAGES = [
  ['index.html', HOME],
  ['servicios/plano-2d-a-3d/index.html', SERVICE],
];

const link = `<link rel="stylesheet" href="/explore-${ID}.css">`;
for (const [rel, plan] of PAGES) {
  const file = path.join(OUT, rel);
  let html = fs.readFileSync(file, 'utf8');
  // 1 · stylesheet after the last existing stylesheet link
  const all = [...html.matchAll(/<link rel="stylesheet"[^>]*>/g)];
  const last = all[all.length - 1];
  html = html.slice(0, last.index + last[0].length) + link + html.slice(last.index + last[0].length);
  // 2 · chapters
  const start = html.indexOf('<main');
  const end = html.indexOf('</main>');
  let i = 0;
  const main = html.slice(start, end).replace(/<section class="([^"]*)"([^>]*)>/g, (m, cls, rest) => {
    const extra = plan[i++];
    if (!extra) return m;
    return `<section class="${cls} ${extra}"${rest}><i class="ch__d" aria-hidden="true"></i>`;
  });
  if (i !== plan.length) throw new Error(`${rel}: expected ${plan.length} sections, found ${i}`);
  html = html.slice(0, start) + main + html.slice(end);
  fs.writeFileSync(file, html);
}
console.log(`dist-explore-${ID}/ ready (${PAGES.length} pages decorated)`);
