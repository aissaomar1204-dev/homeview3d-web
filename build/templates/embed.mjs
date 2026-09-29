/* ═══════════════════════════════════════════════════════════════
   Template `embed` (/embed/villa/, /en/embed/villa/). Owner: VIEWER.
   Bare layout (no header/footer), noindex, framed by third parties
   (_headers: frame-ancestors * on /embed/*). Full-viewport viewer app
   with a small "powered by" text link to the home (new tab).
   The model JS loads on intent only (data-preload="intent"), so a
   host page that embeds us pays for the poster, not for 1 MB of JS.
   ═══════════════════════════════════════════════════════════════ */
import { renderViewerApp, viewerStrings } from '../lib/viewer.mjs';
import { villa } from '../data/villa.mjs';

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default function render(ctx) {
  const s = viewerStrings(ctx);
  const name = villa.name[ctx.lang];
  let h1 = ctx.page && ctx.page.h1 ? ctx.tok(ctx.page.h1) : '';
  if (!h1) h1 = s.embedTitle.replace('{name}', name);
  const by = s.poweredBy.replace('{brand}', ctx.site.brand.name);

  const main = '<div class="vw-embed">'
    + '<header class="wrap vw-embed__head">'
    + `<h1 class="vw-embed__title">${esc(h1)}</h1>`
    + `<a class="vw-embed__by" href="${esc(ctx.abs(ctx.href('home')))}" target="_blank" rel="noopener nofollow">${esc(by)}</a>`
    + '</header>'
    + renderViewerApp(ctx, { embed: true, eager: true, railLevel: 2 })
    + '</div>';

  return { main, layout: 'bare', bodyClass: 'is-embed' };
}
