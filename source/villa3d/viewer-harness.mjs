// Viewer harness (VIEWER agent, local QA only, not part of the site).
// Renders build/lib/viewer.mjs + the ar/embed templates with the engine's real ctx
// (build/lib/context.mjs + assets.mjs) into static pages under source/villa3d/harness/,
// linking every src/css/*.css (tokens from docs/design when the engine copy is missing)
// and src/js/viewer.js. Public paths are rewritten to /public/… so the project root
// can be served as is:
//   node source/villa3d/viewer-harness.mjs
//   node scripts/serve.mjs 8801
//   open http://localhost:8801/source/villa3d/harness/caso-es.html
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'source', 'villa3d', 'harness');
const rel = (p) => path.join(ROOT, p);
const imp = (p) => import(`file://${rel(p).replace(/\\/g, '/')}?t=${Date.now()}`);

const { createContext, sprite } = await imp('build/lib/context.mjs');
const { createAssets } = await imp('build/lib/assets.mjs');
const { UI } = await imp('build/data/ui.mjs');
const { site } = await imp('build/data/site.mjs');
const { routes, routeById } = await imp('build/data/routes.mjs');
const { villa } = await imp('build/data/villa.mjs');
const { pricing } = await imp('build/data/pricing.mjs');
const { process: processData } = await imp('build/data/process.mjs');
const { deliverables } = await imp('build/data/deliverables.mjs');
const V = await imp('build/lib/viewer.mjs');
const arTpl = (await imp('build/templates/ar.mjs')).default;
const embedTpl = (await imp('build/templates/embed.mjs')).default;

const assets = createAssets({ root: ROOT, dist: fs.mkdtempSync(path.join(os.tmpdir(), 'vw-harness-')), warn: () => {} });
assets.loadImages(rel('build/generated/images.json'));
const rendered = new Set(routes.flatMap((r) => ['es', 'en'].filter((l) => r[l]).map((l) => `${r.id}:${l}`)));

function makeCtx(lang, id) {
  return createContext({
    lang, route: routeById[id], doc: null, site, ui: UI,
    data: { pricing, villa, process: processData, deliverables, comingSoon: [], glossary: [] },
    routes, routeById, rendered, docs: new Map(),
    assets: { asset: assets.asset, picture: assets.picture }, images: assets.images,
  });
}

// One stylesheet: every src/css file in name order (tokens from docs/design if the engine copy is not there yet).
const cssDir = rel('src/css');
const cssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css')).sort();
let css = cssFiles.includes('00-tokens.css') ? '' : fs.readFileSync(rel('docs/design/tokens.css'), 'utf8');
for (const f of cssFiles) css += `\n/* ${f} */\n${fs.readFileSync(path.join(cssDir, f), 'utf8')}`;
css = css.replace(/url\((['"]?)\/(assets|lib)\//g, 'url($1/public/$2/');
// Minimal page chrome for the harness only. Once the engine's base CSS exists it styles headings, buttons and links.
const engineBase = cssFiles.includes('10-base.css');
const base = engineBase ? '.hx{max-width:calc(var(--container) + 2*var(--gutter));margin:0 auto;padding:var(--space-6) var(--gutter)}.after{height:40vh}' : `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-body);color:var(--color-ink);background:var(--color-bg)}
h1{font-family:var(--font-display);font-size:var(--fs-h1);font-weight:var(--wght-display);font-stretch:var(--stretch-display);line-height:var(--lh-display);letter-spacing:var(--tracking-display);margin:0}
h2{font-family:var(--font-display);font-size:var(--fs-h2);font-weight:var(--wght-display);font-stretch:var(--stretch-h2);line-height:var(--lh-h2);letter-spacing:var(--tracking-h2)}
.lead{font-size:var(--fs-lead);line-height:var(--lh-lead);color:var(--color-ink-2);max-width:48ch}
.eyebrow{font:var(--wght-mono) var(--fs-meta)/1.4 var(--font-mono);color:var(--color-ink-3)}
.link-arrow{display:inline-flex;align-items:center;gap:8px;color:var(--color-ink);text-underline-offset:4px}
.icon{width:20px;height:20px}.sprite{display:none}
.hx{max-width:calc(var(--container) + 2*var(--gutter));margin:0 auto;padding:var(--space-6) var(--gutter)}
.hx p{max-width:66ch}
.after{height:40vh}
`;
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, '_site.css'), css);

function rewrite(html) {
  return html
    .replace(/([\s"',(])\/(assets|lib|models)\//g, '$1/public/$2/')
    .replace(/href="\/ar\/villa\/"/g, 'href="/source/villa3d/harness/ar-es.html"')
    .replace(/href="\/en\/ar\/villa\/"/g, 'href="/source/villa3d/harness/ar-en.html"')
    .replace(/src="\/embed\/villa\/"/g, 'src="/source/villa3d/harness/embed-es.html"')
    .replace(/src="\/en\/embed\/villa\/"/g, 'src="/source/villa3d/harness/embed-en.html"');
}

function page(file, lang, title, main, { bare = false, bodyClass = '' } = {}) {
  const html = `<!doctype html>
<html lang="${lang}" class="js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="/source/villa3d/harness/_site.css">
<style>${base}</style>
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="${bodyClass}">
${sprite()}
${bare ? '' : `<header class="hx"><p class="eyebrow">Harness · ${file}</p></header>`}
<main id="main">
${main}
${bare ? '' : '<div class="after"></div>'}
</main>
<script>self.ModelViewerElement = { meshoptDecoderLocation: '${assets.asset('/lib/model-viewer/meshopt_decoder.js')}' }</script>
<script type="module" src="/src/js/viewer.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, file), rewrite(html));
  return file;
}

const written = [];
for (const lang of ['es', 'en']) {
  // Case-like page: H1 + viewer app (#visor, eager poster) + formats + embed code.
  const c = makeCtx(lang, 'caso-villa');
  const h1 = lang === 'es' ? 'Villa en la Costa del Sol, del plano al 3D' : 'Costa del Sol villa, from plan to 3D';
  written.push(page(`caso-${lang}.html`, lang, h1,
    `<section class="hx"><h1>${h1}</h1><p class="lead">Harness: renderViewerApp + renderFormats + renderEmbedCode.</p></section>`
    + V.renderViewerApp(c, { id: 'visor', eager: true })
    + V.renderFormats(c, { h2: lang === 'es' ? '¿Funciona en iPhone y en Android?' : 'Does it work on iPhone and Android?' })
    + V.renderEmbedCode(c, {})));

  // Home-like page: band (#demo) + ar block.
  const h = makeCtx(lang, 'home');
  written.push(page(`home-${lang}.html`, lang, 'Home harness',
    `<section class="hx"><h1>${lang === 'es' ? 'Del plano 2D al modelo 3D, sin fotos' : 'From 2D floor plan to 3D, no photos'}</h1><p class="lead">Harness: renderViewerBand + renderArBlock.</p></section>`
    + V.renderViewerBand(h, { intro: lang === 'es' ? 'Gira la maqueta, entra en cada estancia y ábrela en realidad aumentada.' : 'Rotate the model, visit every room and open it in augmented reality.' })
    + V.renderArBlock(h, {})));

  // Templates.
  const e = makeCtx(lang, 'embed-villa');
  const eo = embedTpl(e);
  written.push(page(`embed-${lang}.html`, lang, 'Embed', eo.main, { bare: eo.layout === 'bare', bodyClass: eo.bodyClass }));
  const a = makeCtx(lang, 'ar-villa');
  const ao = arTpl(a);
  written.push(page(`ar-${lang}.html`, lang, 'AR', ao.main, { bodyClass: ao.bodyClass }));

  if (![c, h, e, a].every((x) => x.needs.has('viewer'))) throw new Error('ctx.needs is missing "viewer"');
}

// Data helpers for GEO (smoke test).
const c = makeCtx('es', 'caso-villa');
console.log('arLinks', V.arLinks(c));
console.log('formats rows', V.formatsTable(c).rows.length, '· snippet', V.embedSnippet(c));
console.log('wrote', written.map((f) => `source/villa3d/harness/${f}`).join('\n      '));
