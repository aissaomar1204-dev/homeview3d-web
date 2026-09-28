/* ═══════════════════════════════════════════════════════════════
   Template `ar` (/ar/villa/, /en/ar/villa/). Owner: VIEWER.
   noindex landing for QR codes, printed signs and brochures:
   platform-detected big buttons (Maqueta 1:20 / Tamaño real),
   instructions and a way back to the 3D viewer and the case.
   Scene Viewer falls back here with ?sin-ar=1 (viewer.js shows a notice).
   Content file optional: h1/lead come from ctx.page or ui.pages.ar.
   ═══════════════════════════════════════════════════════════════ */
import { renderArChoices, viewerStrings } from '../lib/viewer.mjs';

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function pick(ctx, field, key) {
  if (ctx.page && ctx.page[field]) return field === 'lead' ? ctx.mdInline(ctx.page[field]) : esc(ctx.tok(ctx.page[field]));
  try { return esc(ctx.t(key)); } catch { return ''; }
}

export default function render(ctx) {
  ctx.needs.add('viewer');
  const s = viewerStrings(ctx);
  const h1 = pick(ctx, 'h1', 'pages.ar.h1') || esc(s.arTitle);
  const lead = pick(ctx, 'lead', 'pages.ar.lead') || esc(s.arIntro);
  const steps = s.arSteps.map((x) => `<li>${esc(x)}</li>`).join('');

  const main = '<section class="block vw-arpage"><div class="wrap">'
    + `<header class="vw-arpage__head"><h1>${h1}</h1><p class="lead">${lead}</p></header>`
    + renderArChoices(ctx, { level: 2, big: true, qrLink: false, desktopNote: true })
    + `<div class="vw-arpage__how"><h2>${esc(s.arStepsTitle)}</h2><ol class="vw-steps">${steps}</ol></div>`
    + '<p class="actions vw-arpage__links">'
    + `<a class="btn btn--primary" href="${esc(ctx.href('caso-villa', 'visor'))}">${esc(s.start)}</a>`
    + `<a class="link-arrow" href="${esc(ctx.href('caso-villa'))}"><span>${esc(s.caseLink)}</span>${ctx.icon ? ctx.icon('arrow') : ''}</a>`
    + '</p>'
    + '</div></section>';

  return { main, layout: 'default', bodyClass: 'page-ar' };
}
