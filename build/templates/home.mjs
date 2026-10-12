/* Home.
   ES (/): the developer showroom home (new design). A page of its own, with its own header, footer, CSS and JS
   (public/assets/home/), written in build/home/portada.html: the 'standalone' layout only adds the shared <head>
   (title, description, robots, canonical, hreflang, OG, JSON-LD) and ships the body as is. Contact data, legal links and
   the FAQ come from build/data/site.mjs, build/data/routes.mjs and build/content/home.mjs, like on every other page.
   EN (/en/): the previous home until the new one has an English version.
   Previous home (rulebook C5, BUILD-SPEC §6): hero → cajetín → blocks → FAQ → form (the form is the end).
   Hero "El plano se vuelve 3D" (build/lib/hero.mjs + src/js/hero.js): text column on the left, on the right a drawing
   sheet that bleeds to the viewport edge. A 2D line plan becomes the furnished 3D maqueta; dimension lines (cotas)
   and rulers follow the model. The served HTML is the FINAL state (still + final cotas); JS upgrades it to the
   animation unless reduced motion, Save-Data or a slow connection say otherwise. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { h1, btnPrimary, linkArrow, contactHref, cajetin, faqSection, contactForm } from '../lib/components.mjs';
import { renderBlocks } from '../lib/blocks.mjs';
import { heroStage, heroBoot, heroLegend } from '../lib/hero.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PORTADA = path.join(HERE, '..', 'home', 'portada.html');
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

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

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
    vars.actualizado = `<time datetime="${mod}">${d} de ${MONTHS[m - 1]} de ${y}</time>`;
  }
  const html = fs.readFileSync(PORTADA, 'utf8').replace(/\{\{(href:)?([\w-]+)\}\}/g, (m, isHref, key) => {
    if (isHref) {
      if (!ctx.has(key)) throw new Error(`portada.html: page "${key}" is not built in ${ctx.lang}`);
      return esc(ctx.href(key));
    }
    if (!(key in vars)) throw new Error(`portada.html: unknown variable {{${key}}}`);
    return key === 'faq' || key === 'actualizado' ? vars[key] : esc(vars[key]);
  }).replace(HOME_ASSET, (p) => ctx.asset(p));
  return {
    main: `${html}<script src="${ctx.asset('/assets/home/js/main.js')}" defer></script>`,
    layout: 'standalone',
    head: HEAD.replace(HOME_ASSET, (p) => ctx.asset(p)).replace('STYLESHEET', homeStylesheet(ctx)),
    bodyClass: 'page-home',
    og: { url: ctx.asset('/assets/home/og-homeview3d.jpg'), width: 1200, height: 630, alt: 'Showroom virtual 3D de una promoción de obra nueva en la Costa del Sol' },
  };
}

export default function render(ctx) {
  if (ctx.lang === 'es') return portada(ctx);
  // The home is a drawing set: every block is a chapter with a tone (build/lib/chapters.mjs).
  ctx.chapters = {};
  const p = ctx.page;
  const blocks = p.blocks || [];
  const hasDemo = blocks.some((b) => b.type === 'viewer');
  const villaHref = hasDemo ? '#demo' : (ctx.has('caso-villa') ? ctx.href('caso-villa', 'visor') : null);
  const secondary = villaHref ? linkArrow(ctx, villaHref, ctx.t('cta.villa'), { icon: hasDemo ? 'arrowDown' : 'arrow' }) : '';
  const hero = `<section class="hero hero--seq" data-ch="h" aria-labelledby="titulo"><div class="hs-grid">`
    + `<div class="hero__text hs-text">${h1(ctx, p.h1)}<p class="lead">${ctx.mdInline(p.lead)}</p><p class="actions" data-hero-actions>${btnPrimary(ctx, contactHref(ctx, 'maqueta'), ctx.t('cta.demo'))}${secondary}</p>${heroLegend(ctx)}</div>`
    + `${heroStage(ctx)}${heroBoot()}`
    + `</div></section>`;
  const state = {};
  const body = renderBlocks(ctx, blocks, {
    state, service: 'maqueta', // no eyebrows: the chapter index rows do their job
  });
  const faq = !state.faqPlaced && p.faq && p.faq.length ? faqSection(ctx, p.faq, { openCount: 1 }) : '';
  const form = state.formPlaced ? '' : contactForm(ctx, { service: 'maqueta' });
  return { main: hero + cajetin(ctx, p.facts) + body + faq + form, bodyClass: 'page-home' };
}
