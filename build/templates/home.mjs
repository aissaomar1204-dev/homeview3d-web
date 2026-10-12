/* Home (ES / and EN /en/): the developer showroom home (new design, 12-oct-2026). A page of its own, with its own header,
   footer, CSS and JS (public/assets/home/), written in build/home/portada.html (ES) and build/home/portada.en.html (EN,
   the same markup translated): the 'standalone' layout only adds the shared <head> (title, description, robots,
   canonical, hreflang, OG, JSON-LD) and ships the body as is. Contact data, legal links and the FAQ come from
   build/data/site.mjs, build/data/routes.mjs and build/content/home.mjs, like on every other page.
   The Spanish home is the one published from web/sitio and is NOT modified here: portada.html, estilos.css and main.js
   stay as they are. The English JS is main.js with its Spanish strings swapped at build time (JS_EN below).
   The other pages of the site (the SEO) share the same look through src/css, with their own header and footer. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PORTADA = { es: path.join(HERE, '..', 'home', 'portada.html'), en: path.join(HERE, '..', 'home', 'portada.en.html') };
const STYLES = path.join(HERE, '..', 'home', 'estilos.css');
// Every /assets/home/… reference resolves to its fingerprinted file (build/lib/assets.mjs copyPublic).
const HOME_ASSET = /\/assets\/home\/[\w./-]+/g;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// What the new home adds to the shared <head>: the display font (one preload, check.mjs), its LCP image, its stylesheet
// (STYLESHEET, emitted at build time) and the motion class.
const HEAD = '<meta name="theme-color" content="#d3e1ee">'
  + '<link rel="preload" href="/assets/home/fonts/gloock.woff2" as="font" type="font/woff2" crossorigin>'
  + '<link rel="preload" as="image" type="image/avif" imagesrcset="/assets/home/img/hero-casas-800.avif 800w, /assets/home/img/hero-casas-1400.avif 1400w, /assets/home/img/hero-casas-2400.avif 2400w" imagesizes="(max-width: 860px) 340vw, 115vw">'
  + '<link rel="stylesheet" href="STYLESHEET">'
  + "<script>document.documentElement.classList.add(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'still' : 'motion');</script>";

const MONTHS = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const OG_ALT = {
  es: 'Showroom virtual 3D de una promoción de obra nueva en la Costa del Sol',
  en: 'Virtual 3D showroom of a new-build development on the Costa del Sol',
};

/** build/home/estilos.css with its url(../fonts|img/…) pointing to the fingerprinted files, written once per build. */
let stylesheet = null;
function homeStylesheet(ctx) {
  if (stylesheet) return stylesheet;
  const css = fs.readFileSync(STYLES, 'utf8').replace(/url\((['"]?)\.\.\/((?:fonts|img)\/[^'")]+)\1\)/g, (m, q, p) => `url('${ctx.asset(`/assets/home/${p}`)}')`);
  stylesheet = ctx.emitAsset('/assets/home/css/estilos.css', css);
  if (!stylesheet) throw new Error('home: the stylesheet could not be written (ctx.emitAsset)');
  return stylesheet;
}

const FAQ_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

// Variables inserted as HTML (already escaped where needed); every other one is escaped.
const RAW = new Set(['faq', 'actualizado']);

// The strings main.js writes into the page (menu label, room names, captions), in English. Each Spanish string must be
// found in main.js: if the home's JS changes, the build fails here instead of shipping Spanish on /en/.
const JS_EN = [
  ["'Cerrar el menú'", "'Close the menu'"],
  ["'Abrir el menú'", "'Open the menu'"],
  ["['Salón, comedor y cocina', 'Planta baja'], ['Dormitorio principal', 'Planta 1'], ['Baño suite', 'Planta 1'], ['Azotea', 'Azotea'], ['Zona de bienestar', 'Sótano']]",
    "['Living room, dining room and kitchen', 'Ground floor'], ['Main bedroom', 'First floor'], ['Suite bathroom', 'First floor'], ['Roof terrace', 'Roof terrace'], ['Wellness area', 'Basement']]"],
  ["'Casa 5 · '", "'House 5 · '"],
  ["'La promoción entera desde el aire. Tu comprador ve qué casas quedan y cuál le encaja.'", "'The whole development from the air. Your buyer sees which homes are left and which one suits them.'"],
  ["'Cada planta en 3D, para entender la distribución sin saber leer un plano.'", "'Every floor in 3D, to understand the layout without reading a plan.'"],
  ["'La ficha de cada vivienda y el plano de cada planta, con los datos de tu proyecto.'", "'The fact sheet of every home and the plan of every floor, with your project data.'"],
  ["'Salón, cocina, dormitorios y terrazas, cada uno situado en su planta.'", "'Living room, kitchen, bedrooms and terraces, each one on its floor.'"],
  ["'Tu comprador se mete en la estancia y mira alrededor con el dedo o el ratón.'", "'Your buyer steps into the room and looks around with a finger or the mouse.'"],
  ["'El masterplan y los jardines de día y de noche, con un toque.'", "'The masterplan and the gardens by day and by night, with one tap.'"],
];
const MAIN_JS = path.join(HERE, '..', '..', 'public', 'assets', 'home', 'js', 'main.js');
let scriptEn = null;
/** The home's script for a language: main.js as is in Spanish, /assets/js/portada-en.js (emitted once per build) in English. */
function homeScript(ctx) {
  if (ctx.lang === 'es') return ctx.asset('/assets/home/js/main.js');
  if (scriptEn) return scriptEn;
  let js = fs.readFileSync(MAIN_JS, 'utf8');
  for (const [from, to] of JS_EN) {
    if (!js.includes(from)) throw new Error(`home: main.js no longer contains ${from.slice(0, 60)} (update JS_EN in build/templates/home.mjs)`);
    js = js.split(from).join(to);
  }
  scriptEn = ctx.emitAsset('/assets/js/portada-en.js', js);
  if (!scriptEn) throw new Error('home: the English script could not be written (ctx.emitAsset)');
  return scriptEn;
}

function portada(ctx) {
  const p = ctx.page;
  const c = ctx.site.contact;
  const faq = (p.faq || []).map((f) => ({ q: ctx.tok(f.q), a: ctx.tok(f.a) }));
  // The FAQPage JSON-LD is built from these and must match the visible text word for word (build/check.mjs).
  for (const f of faq) ctx.collect.faq.push(f);
  const vars = {
    email: c.email,
    tel: c.phoneE164,
    telLargo: c.phoneDisplay,
    telCorto: c.phoneDisplay.replace(/^\+34\s*/, ''),
    wa: `https://wa.me/${c.whatsapp}`,
    razonSocial: ctx.site.legal.razonSocial,
    year: String(new Date().getFullYear()),
    faq: faq.map((f) => `      <details><summary>${esc(f.q)}${FAQ_ICON}</summary><p>${esc(f.a)}</p></details>`).join('\n'),
    actualizado: '',
  };
  // The JSON-LD dateModified must be visible in a <time datetime> (check.mjs).
  const mod = ctx.doc.dateModified;
  if (mod) {
    const [y, m, d] = mod.split('-').map(Number);
    vars.actualizado = `<time datetime="${mod}">${ctx.lang === 'es' ? `${d} de ${MONTHS.es[m - 1]} de ${y}` : `${d} ${MONTHS.en[m - 1]} ${y}`}</time>`;
  }
  const html = fs.readFileSync(PORTADA[ctx.lang], 'utf8').replace(/\{\{(href:)?([\w-]+)\}\}/g, (m, isHref, key) => {
    if (isHref) {
      if (!ctx.has(key)) throw new Error(`portada.html: page "${key}" is not built in ${ctx.lang}`);
      return esc(ctx.href(key));
    }
    if (!(key in vars)) throw new Error(`portada.html: unknown variable {{${key}}}`);
    return RAW.has(key) ? vars[key] : esc(vars[key]);
  }).replace(HOME_ASSET, (p) => ctx.asset(p));
  return {
    main: `${html}<script src="${homeScript(ctx)}" defer></script>`,
    layout: 'standalone',
    head: HEAD.replace(HOME_ASSET, (p) => ctx.asset(p)).replace('STYLESHEET', homeStylesheet(ctx)),
    bodyClass: 'page-home',
    og: { url: ctx.asset('/assets/home/og-homeview3d.jpg'), width: 1200, height: 630, alt: OG_ALT[ctx.lang] },
  };
}

export default function render(ctx) {
  if (!PORTADA[ctx.lang]) throw new Error(`home: no portada for "${ctx.lang}"`);
  return portada(ctx);
}
