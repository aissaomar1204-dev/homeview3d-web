/* ═══════════════════════════════════════════════════════════════
   3D viewer, AR handoff, formats table and embed code
   (docs/build/BUILD-SPEC.md §8, rulebook COMP-07..COMP-11, COMP-25).
   Owner: VIEWER. Pure string renderers: (ctx, block) → HTML.

   Contracts
   - renderViewerBand(ctx, block)  `viewer` block: full-bleed stage band
                                    (section#demo), facade + room list in HTML.
   - renderViewerApp(ctx, opts?)   full app (case page section#visor, embed).
   - renderArBlock(ctx, block)     `ar` block: iOS rel=ar, Android intents, QR.
   - renderFormats(ctx, block)     `formats` block: compatibility table.
   - renderEmbedCode(ctx, block)   `embedCode` block: live iframe + snippet.
   - arLinks(ctx), formatsTable(ctx), embedSnippet(ctx), roomRows(ctx),
     qrSvg(text, label)            plain data for markdown/llms (GEO) and templates.
   Every renderer adds 'viewer' to ctx.needs (loads src/js/viewer.js).
   Sections reuse the engine's structure and components (.block, .band--stage,
   .wrap, .block__head/.block__intro, .btn, .link-arrow, .table), so they sit at
   the top level of <main> like every other block. 50-viewer.css only styles
   what is unique to the viewer.

   Nothing here loads model-viewer: the HTML carries its hashed URL in
   data-mv and src/js/viewer.js imports it on intent (COMP-07).
   ═══════════════════════════════════════════════════════════════ */
import { encode } from 'uqr';
import { villa } from '../data/villa.mjs';
import { uiViewer } from '../data/ui-viewer.mjs';

const NBSP = '\u00A0';
const enc = encodeURIComponent;
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (str, vars = {}) => String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
/** JSON for a single-quoted attribute value: only & and ' need escaping (about a third lighter than &quot;). */
const jsonAttr = (v) => `'${JSON.stringify(v).replace(/&/g, '&amp;').replace(/'/g, '&#39;')}'`;

const strings = (ctx) => uiViewer[ctx.lang] || uiViewer.es;
function tx(ctx, key, vars) {
  const v = strings(ctx)[key];
  if (v == null) throw new Error(`viewer string missing: ${ctx.lang}.${key}`);
  return typeof v === 'string' && vars ? fill(v, vars) : v;
}
/** Escaped inline text with product names wrapped in translate="no" (A11Y-10). */
const inline = (ctx, s) => (ctx.mdInline ? ctx.mdInline(s) : esc(s));
/** Engine ui string with a local fallback (the engine owns ui.h2.* and ui.pages.*). */
function ui(ctx, key, fallback) {
  try { const v = ctx.t(key); if (typeof v === 'string' && v) return v; } catch { /* not defined */ }
  return fallback;
}
const icon = (ctx, name) => { try { return ctx.icon ? ctx.icon(name) : ''; } catch { return ''; } };
function uid(ctx, prefix) {
  if (ctx.uid) return ctx.uid(prefix);
  const map = (ctx._vwIds ||= new Map());
  const n = (map.get(prefix) || 0) + 1;
  map.set(prefix, n);
  return n === 1 ? prefix : `${prefix}-${n}`;
}
function slug(ctx, text) {
  if (ctx.headingId) return ctx.headingId(text);
  const s = String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'seccion';
  return uid(ctx, s);
}
/** Heading with an auto id, collected like the engine's head() (TOC, heading checks). */
function heading(ctx, level, text, cls = '') {
  const plain = ctx.tok ? ctx.tok(text) : String(text);
  const id = slug(ctx, plain);
  if (ctx.collect && Array.isArray(ctx.collect.headings)) ctx.collect.headings.push({ level, id, text: plain });
  return { id, html: `<h${level} id="${id}"${cls ? ` class="${cls}"` : ''}>${inline(ctx, text)}</h${level}>` };
}
/** Secondary text link with a trailing arrow icon (COMP-02), same markup as the engine's linkArrow. */
const linkArrow = (ctx, href, label) => `<a class="link-arrow" href="${esc(href)}"><span>${esc(label)}</span>${icon(ctx, 'arrow')}</a>`;
const intro = (ctx, block) => (block && block.intro ? `<div class="block__intro">${ctx.md(block.intro)}</div>` : '');
/** Block head, same markup as the engine's head(): eyebrow, h2 with auto id, intro. */
function blockHead(ctx, text, block, { eyebrow = '', extra = '' } = {}) {
  const h = heading(ctx, 2, text);
  const eb = eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : '';
  return { id: h.id, html: `<div class="block__head">${eb}${h.html}${intro(ctx, block)}${extra}</div>` };
}
/** Section wrapper, same classes as the engine's section(). */
const section = (type, { id = '', labelledby = '', label = '', band = false, cls = '' }, inner) => `<section class="block block--${type}${band ? ' band band--stage' : ''}${cls ? ` ${cls}` : ''}"`
  + `${id ? ` id="${id}"` : ''}${labelledby ? ` aria-labelledby="${labelledby}"` : ''}${label ? ` aria-label="${esc(label)}"` : ''}><div class="wrap">${inner}</div></section>`;

/* ─── Numbers (all from build/data/villa.mjs) ─────────────────── */
const metres = (ctx, n, d) => `${ctx.fmtNumber(n, d)}${NBSP}m`;
const areaLabel = (ctx, a, d = 1) => `≈${NBSP}${ctx.fmtNumber(a, d)}${NBSP}m²`;
const cutLabel = (ctx) => metres(ctx, villa.specs.cutHeight, 2);
const wallLabel = (ctx) => metres(ctx, villa.specs.wallHeight, 2);

/** Rooms as plain data (names, m², descriptions) in ctx.lang. */
export function roomRows(ctx) {
  return villa.rooms.map((r, i) => ({
    n: i + 1, id: r.id, name: r[ctx.lang].name, text: r[ctx.lang].text,
    area: r.area, areaLabel: areaLabel(ctx, r.area), ext: !!r.ext,
    x: r.x, y: r.y, span: Math.max(r.w, r.h),
  }));
}

/* ─── AR links ─────────────────────────────────────────────────── */
function sceneViewerIntent(ctx, file, title, realSize) {
  const q = new URLSearchParams({
    file: ctx.abs(file),
    mode: 'ar_preferred',
    title: title.slice(0, 60),
    link: ctx.abs(ctx.href('caso-villa')),
  });
  if (realSize) q.set('resizable', 'false');
  const fallback = `${ctx.abs(ctx.href('ar-villa'))}?sin-ar=1`;
  return `intent://arvr.google.com/scene-viewer/1.2?${q.toString().replace(/\+/g, '%20')}`
    + '#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;'
    + `S.browser_fallback_url=${enc(fallback)};end;`;
}

/**
 * Every AR destination for the villa in ctx.lang (absolute where a native app reads it).
 * iOS: AR Quick Look fragments (canonicalWebPageURL, callToAction banner → our contact page).
 * Android: Scene Viewer intents with the plain (non-meshopt) GLBs and a browser fallback.
 */
export function arLinks(ctx) {
  const s = strings(ctx);
  const name = villa.name[ctx.lang];
  const casePage = ctx.abs(ctx.href('caso-villa'));
  const arPage = ctx.abs(ctx.href('ar-villa'));
  const ql = (subtitle, extra) => [
    extra,
    `canonicalWebPageURL=${enc(casePage)}`,
    `callToAction=${enc(s.qlCta)}`,
    `checkoutTitle=${enc(name)}`,
    `checkoutSubtitle=${enc(subtitle)}`,
  ].filter(Boolean).join('&');
  return {
    iosMesa: `${villa.files.usdzMesa.url}#${ql(s.qlMesa)}`,
    iosReal: `${villa.files.usdzReal.url}#${ql(s.qlReal, 'allowsContentScaling=0')}`,
    androidMesa: sceneViewerIntent(ctx, villa.files.glbArMesa.url, fill(s.svMesa, { name }), false),
    androidReal: sceneViewerIntent(ctx, villa.files.glbAr.url, fill(s.svReal, { name }), true),
    page: arPage,
    qr: `${arPage}?utm_source=qr&utm_medium=web`,
    contact: `${ctx.href('contacto')}?servicio=ar&utm_source=quicklook&utm_medium=ar`,
  };
}

/* ─── QR (generated at build time with uqr, no browser JS) ────── */
const qrCache = new Map();
/** QR path: one 1-unit stroke per horizontal run of dark modules, relative moves inside a row (~half the bytes of filled rects). */
export function qrPath(text) {
  const { data, size } = encode(text, { ecc: 'M', border: 2 });
  let d = '';
  for (let y = 0; y < size; y++) {
    let pen = -1;
    for (let x = 0; x < size;) {
      if (!data[y][x]) { x++; continue; }
      let run = 1;
      while (x + run < size && data[y][x + run]) run++;
      d += pen < 0 ? `M${x} ${y}.5h${run}` : `m${x - pen} 0h${run}`;
      pen = x + run;
      x += run;
    }
  }
  return { d, size };
}
/** Inline SVG QR (built at build time, no browser JS). Colours come from CSS (.vw-qr: dark on light in both themes). */
export function qrSvg(text, label) {
  const key = `${text}\n${label}`;
  if (qrCache.has(key)) return qrCache.get(key);
  const { d, size } = qrPath(text);
  const svg = `<svg class="vw-qr" viewBox="0 0 ${size} ${size}" width="168" height="168" role="img" aria-label="${esc(label)}" shape-rendering="crispEdges"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;
  qrCache.set(key, svg);
  return svg;
}

/**
 * QR as a separate, cached SVG file referenced by <img> (keeps ~3 KB out of every page with AR choices).
 * Dark modules on a light quiet zone in both themes, so every camera app decodes it; crispEdges keeps it sharp.
 * Falls back to the inline SVG when the context cannot emit files.
 */
function qrImg(ctx, text, label) {
  if (typeof ctx.emitAsset !== 'function') return qrSvg(text, label);
  const { d, size } = qrPath(text);
  const file = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="rgb(252 252 253)"/><path d="${d}" fill="none" stroke="rgb(20 23 27)" stroke-width="1"/></svg>`;
  const url = ctx.emitAsset(`/assets/img/qr-ar-villa-${ctx.lang}.svg`, file);
  return `<img class="vw-qr" src="${esc(url)}" width="168" height="168" alt="${esc(label)}" loading="lazy" decoding="async">`;
}

/* ─── AR choices (shared by the toolbar dialog, the `ar` block and /ar/villa/) ─── */
/**
 * Decorative thumbnail for rel="ar" links (Quick Look needs an <img>/<picture> as the first element child).
 * A single 480w WebP <img> keeps the HTML small; falls back to ctx.img() without a manifest entry.
 */
function thumb(ctx, name) {
  const m = ctx.images && ctx.images[name];
  if (m && m.path && (m.formats || []).includes('webp') && (m.widths || []).length) {
    const w = m.widths.includes(480) ? 480 : Math.min(...m.widths);
    const src = ctx.asset(m.path.replace('{w}', w).replace('{ext}', 'webp'));
    return `<img class="vw-arlink__img" src="${esc(src)}" width="${w}" height="${Math.round((w * m.height) / m.width)}" alt="" loading="lazy" decoding="async">`;
  }
  return ctx.img(name, { alt: '', sizes: '128px', widths: [480], className: 'vw-arlink__pic' });
}

/**
 * Platform groups with big AR links. viewer.js sets data-platform (ios | android | desktop)
 * and CSS shows the matching group; without JS both mobile groups show and the QR shows
 * on fine pointers only. rel="ar" anchors keep <picture> as their only element child.
 * @param {object} o { level: heading level for the group labels, big: larger buttons,
 *   qrLink: false hides the link to /ar/villa/ under the QR, desktopNote: adds the "AR needs a phone" line }
 */
export function renderArChoices(ctx, o = {}) {
  const s = strings(ctx);
  const L = o.level || 3;
  const links = arLinks(ctx);
  const f = villa.files;
  const { w, d } = villa.specs.footprint;
  const mesaNote = fill(s.arMesaNote, { cut: cutLabel(ctx) });
  const realNote = fill(s.arRealNote, { w: ctx.fmtNumber(w, 1), d: ctx.fmtNumber(d, 1) });
  const meta = (note, format, file) => `<p class="vw-arlink__meta">${esc(note)}. ${inline(ctx, fill(s.file, { format, size: ctx.fmtBytes(file.bytes) }))}</p>`;
  const item = (href, img, label, metaHtml, extra = '') => `<li><a class="vw-arlink${img ? '' : ' vw-arlink--text'}" href="${esc(href)}"${extra}>${img}${esc(label)}</a>${metaHtml}</li>`;
  // Only Quick Look needs the image child; Android intents stay text-only (fewer bytes, same size target).
  const mesaPic = thumb(ctx, 'villa_maqueta_iso');
  const realPic = thumb(ctx, 'villa_salon_dormitorio');
  const group = (key, label, how, items) => `<div class="vw-ar__group vw-ar__group--${key}">`
    + `<h${L} class="vw-ar__label">${esc(label)}</h${L}><p class="vw-ar__how">${inline(ctx, how)}</p>`
    + `<ul class="vw-ar__links">${items}</ul></div>`;

  const ios = group('ios', s.ios, s.iosHow,
    item(links.iosMesa, mesaPic, s.arMesa, meta(mesaNote, 'USDZ', f.usdzMesa), ' rel="ar"')
    + item(links.iosReal, realPic, s.arReal, meta(realNote, 'USDZ', f.usdzReal), ' rel="ar"'));
  const android = group('android', s.android, s.androidHow,
    item(links.androidMesa, '', s.arMesa, meta(mesaNote, 'GLB', f.glbArMesa), ' target="_top"')
    + item(links.androidReal, '', s.arReal, meta(realNote, 'GLB', f.glbAr), ' target="_top"'));
  const desktop = `<div class="vw-ar__group vw-ar__group--desktop"><h${L} class="vw-ar__label">${esc(s.desktop)}</h${L}>`
    + `<figure class="vw-ar__qr">${qrImg(ctx, links.qr, s.qrLabel)}<figcaption><p>${inline(ctx, s.qrHow)}</p>`
    + `<ul class="vw-ar__modes"><li><strong>${esc(s.arMesa)}.</strong> ${esc(mesaNote)}.</li><li><strong>${esc(s.arReal)}.</strong> ${esc(realNote)}.</li></ul>`
    + (o.qrLink === false ? '' : `<p><a href="${esc(ctx.href('ar-villa'))}">${esc(s.qrLink)}</a></p>`)
    + '</figcaption></figure>'
    + (o.desktopNote ? `<p class="vw-ar__how">${esc(s.arDesktopNote)}</p>` : '')
    + '</div>';

  // data-css: the AR module stylesheet on its own (pages link it inside their CSS bundle); the viewer dialog adds it on first open.
  const css = ctx.asset ? ctx.asset('/assets/css/ar.css') : '';
  return `<div class="vw-ar${o.big ? ' vw-ar--big' : ''}" data-vw-arblock data-contact="${esc(links.contact)}" data-origin="${esc(ctx.site.domain)}"${css ? ` data-css="${esc(css)}"` : ''}>`
    + `<p class="vw-ar__notice" data-vw-noar hidden>${esc(s.noAr)} <a href="${esc(ctx.href('caso-villa', 'visor'))}">${esc(s.start)}</a></p>`
    + ios + android + desktop
    + `<p class="vw-ar__notice" data-vw-inapp hidden>${esc(s.inApp)}</p>`
    + '</div>';
}

/* ─── Viewer core (band + app + embed) ─────────────────────────── */
function viewerCore(ctx, o) {
  ctx.needs.add('viewer');
  const s = strings(ctx);
  const v = villa.viewer;
  const id = o.id;
  const cut = cutLabel(ctx);
  const rooms = roomRows(ctx);
  const terraces = rooms.filter((r) => r.ext).length;
  const L = o.railLevel || 3;

  const alt = fill(s.alt, { rooms: villa.specs.rooms, bedrooms: villa.specs.bedrooms, terraces, cut });
  const posterName = ctx.images && ctx.images.villa_viewer_poster ? 'villa_viewer_poster' : 'villa_maqueta_iso';
  // Portrait phones get the 4:5 capture from the same camera (D-01): no scale hack, no jump on swap.
  const mobile = !o.embed && ctx.images && ctx.images.villa_viewer_poster_mobile
    ? [{ media: '(max-width: 767px) and (orientation: portrait)', name: 'villa_viewer_poster_mobile', sizes: '100vw' }] : [];
  const poster = ctx.img(posterName, {
    alt: fill(s.posterAlt, { cut }),
    sizes: o.embed ? '100vw' : o.stack ? '(min-width: 1320px) 700px, (min-width: 1024px) 56vw, 100vw' : '(min-width: 1320px) 910px, (min-width: 1024px) 70vw, 100vw',
    eager: !!o.eager,
    className: 'vw-poster',
    sources: mobile,
  }).replace(/^\s*<(picture|img)\b/, '<$1 slot="poster"');

  // The default note and the error title are already in the markup: viewer.js reads them from there.
  const i18n = {
    preparing: s.preparing, loading: s.loading, pct: s.pct, loaded: s.loaded,
    noWebgl: s.noWebgl, tour: s.tour, tourPause: s.tourPause, tourResume: s.tourResume,
  };

  const summary = fill(s.roomsSummary, {
    n: villa.specs.rooms,
    interior: `${ctx.fmtNumber(villa.specs.interiorM2)}${NBSP}m²`,
    terraces: `${ctx.fmtNumber(villa.specs.terracesM2)}${NBSP}m²`,
  });
  // Camera data and descriptions for all rooms in one attribute (viewer.js reads it by index); the buttons stay light.
  const roomData = rooms.map((r) => [r.x, r.y, r.span, r.text]);
  // Room numbers are a CSS counter (the same numbers as the hotspots), not markup.
  const roomItems = rooms.map((r) => `<li><button type="button" class="vw-room${r.ext ? ' is-ext' : ''}" data-room="${r.id}">`
    + `<span class="vw-room__name">${esc(r.name)}</span>`
    + `<span class="vw-room__m2">${r.areaLabel}</span></button></li>`).join('');

  const renders = ctx.route && ctx.route.id === 'caso-villa'
    ? `<p class="vw-error__alt">${esc(s.rendersBelow)}</p>`
    : `<p class="vw-error__alt"><a href="${esc(ctx.href('caso-villa'))}">${esc(s.renders)}</a></p>`;

  // No `ar` attributes: AR opens from our own chooser (Quick Look / Scene Viewer links), so model-viewer never
  // probes WebXR (that probe blocks the back/forward cache, P1-B).
  const mv = `<model-viewer class="vw-mv" src="${esc(villa.files.glb.url)}" alt="${esc(alt)}"`
    + ' loading="lazy" reveal="manual" camera-controls touch-action="pan-y" interaction-prompt="none"'
    + ` camera-orbit="${v.cameraOrbit}" camera-target="${v.cameraTarget}" min-camera-orbit="${v.minCameraOrbit}" max-camera-orbit="${v.maxCameraOrbit}"`
    + ` field-of-view="${v.fieldOfView}" interpolation-decay="120" environment-image="neutral" tone-mapping="${v.toneMapping}"`
    + ` exposure="${v.exposure}" shadow-intensity="${v.shadowIntensity}" shadow-softness="${v.shadowSoftness}"`
    + ` a11y=${jsonAttr(s.a11y)}>`
    + poster
    + '<div slot="progress-bar" class="vw-progress" aria-hidden="true"><span class="vw-progress__bar" data-vw-bar></span></div>'
    + '</model-viewer>';

  const tool = (attrs, label, pressed) => `<button type="button" class="btn btn--neutral vw-tool" ${attrs}${pressed == null ? '' : ` aria-pressed="${pressed}"`}>${label}</button>`;
  const iconBtn = (attrs, label, name, glyph) => `<button type="button" class="btn btn--neutral vw-tool vw-icon" ${attrs} aria-label="${esc(label)}">${icon(ctx, name) || glyph}</button>`;

  return `<div class="vw${o.embed ? ' vw--embed' : ''}${o.stack ? ' vw--stack' : ''}" id="${id}-app" data-vw data-state="poster"`
    + ` data-mv="${esc(ctx.asset(v.modelViewer))}" data-meshopt="${esc(ctx.asset(v.meshoptDecoder))}" data-live="${esc(ctx.asset('/assets/css/viewerlive.css'))}" data-dims-js="${esc(ctx.asset('/assets/js/viewer-dims.js'))}"`
    + ` data-fallback="${esc(villa.files.glbAr.url)}" data-preload="${o.preload || 'visible'}"`
    + ` data-orbit="${v.cameraOrbit}" data-target="${v.cameraTarget}" data-top-orbit="${v.topOrbit}" data-top-target="${v.topTarget}"`
    + ` data-cut-suffix="${v.cutMaterialSuffix}" data-label-y="${v.labelHeight.cut} ${v.labelHeight.full}" data-exposure="${v.exposure}"`
    + ` data-footprint="${villa.specs.footprint.w} ${villa.specs.footprint.d}" data-fov="${parseFloat(v.fieldOfView)}"`
    + ` data-rooms=${jsonAttr(roomData)} data-i18n=${jsonAttr(i18n)}`
    // Live dimension lines (S3): footprint w × d, wall and cut heights, with their labels in ctx.lang.
    + ` data-dims=${jsonAttr([villa.specs.footprint.w, villa.specs.footprint.d, villa.specs.wallHeight, villa.specs.cutHeight,
      metres(ctx, villa.specs.footprint.w, 2), metres(ctx, villa.specs.footprint.d, 2), wallLabel(ctx), cut])}>`

    // Stage first in the DOM: "Ver la villa en 3D" is the first stop (P2-8). Model-viewer is an unknown element
    // until viewer.js imports it; the poster paints as a plain <picture>. The start button is the only control on it.
    + `<div class="vw-stage" data-vw-stage>${mv}`
    + `<button type="button" class="btn btn--primary vw-start" data-vw-start aria-describedby="${id}-size">${esc(s.start)}</button></div>`

    // Room rail: real HTML for crawlers and the gesture alternative (A11Y-05, GEO-01). Chips below the stage
    // (COMP-08 mobile), a column beside it from 1280px (grid areas in 50-viewer.css).
    + `<div class="vw-rail"><div class="vw-rail__head"><h${L} class="vw-rail__title" id="${id}-rooms">${esc(s.roomsTitle)}</h${L}>`
    + `<p class="vw-rail__sum">${esc(summary)}</p></div>`
    + `<ol class="vw-rooms" aria-labelledby="${id}-rooms">${roomItems}</ol></div>`

    // Toolbar below the stage, never over the model (COMP-08).
    + '<div class="vw-bar">'
    + `<p class="vw-size" id="${id}-size">${esc(fill(s.startNote, { size: ctx.fmtBytes(villa.files.glb.bytes) }))}</p>`
    + '<p class="vw-status"><span role="status" aria-live="polite" data-vw-live></span> <span class="vw-status__pct" aria-hidden="true" data-vw-pct></span></p>'
    + `<div class="vw-error" data-vw-error><p><strong>${esc(s.error)}</strong> ${esc(s.errorHelp)}</p>`
    + `<p class="vw-error__actions"><button type="button" class="btn btn--neutral vw-tool" data-vw-retry>${esc(s.retry)}</button></p>${renders}</div>`
    + `<div class="vw-tools" data-vw-tools>`
    + `<div class="vw-group" role="group" aria-label="${esc(s.views)}">`
    + tool('data-vw-view="home"', esc(s.overview), true)
    + tool('data-vw-view="top"', esc(s.plan), false)
    + tool('data-vw-tour', esc(s.tour))
    + tool('data-vw-dims', esc(s.dims), false)
    + '</div>'
    + `<div class="vw-group vw-seg" role="group" aria-label="${esc(s.walls)}">`
    + tool('data-vw-cut="1"', esc(fill(s.cut, { h: cut })), true)
    + tool('data-vw-cut="0"', esc(fill(s.full, { h: wallLabel(ctx) })), false)
    + '</div>'
    + `<div class="vw-group vw-light"><label for="${id}-light">${esc(s.light)}</label>`
    + `<input type="range" id="${id}-light" name="${id}-light" min="0.6" max="1.6" step="0.05" value="${v.exposure}" data-vw-light></div>`
    + `<div class="vw-group" role="group" aria-label="${esc(s.zoom)}">`
    + iconBtn('data-vw-zoom="1.25"', s.zoomOut, 'minus', '\u2212')
    + iconBtn('data-vw-zoom="0.8"', s.zoomIn, 'plus', '+')
    + '</div></div>'
    + `<a class="btn btn--neutral vw-tool vw-ar-open" href="${esc(ctx.href('ar-villa'))}" data-vw-ar aria-haspopup="dialog">${icon(ctx, 'cube')}${esc(s.arOpen)}</a>`
    + '</div>'

    + `<div class="vw-info"><p class="vw-note" data-vw-note aria-live="polite">${esc(s.note)}</p>`
    + `<p class="vw-hint">${esc(s.hint)} <span class="vw-keys">${esc(s.keys)}</span></p></div>`

    // AR chooser: a native <dialog> shell. viewer.js fills it on first open with the choices of /ar/villa/
    // (same build-time QR and links, plus that page's AR stylesheet); without JS, or if that fetch fails,
    // the link above simply opens /ar/villa/.
    + `<dialog class="vw-dialog" id="${id}-ar" aria-labelledby="${id}-ar-title"><div class="vw-dialog__body">`
    + `<div class="vw-dialog__head"><h2 class="vw-dialog__title" id="${id}-ar-title">${esc(s.arTitle)}</h2>`
    + `${iconBtn('data-vw-close', s.close, 'close', '\u00D7')}</div>`
    + `<p class="vw-dialog__intro">${esc(s.arIntro)}</p><div data-vw-arslot></div>`
    + '</div></dialog>'
    + '</div>';
}

/* ─── Public block renderers ───────────────────────────────────── */

/** `viewer` block: full-bleed stage band (section#demo) with the facade, rooms and controls. */
export function renderViewerBand(ctx, block = {}) {
  const s = strings(ctx);
  const sectionId = uid(ctx, 'demo');
  const eyebrow = ctx.route && ctx.route.id === 'home' ? ui(ctx, 'eyebrow.viewer', '') : '';
  const caseLink = ctx.route && ctx.route.id === 'caso-villa' ? ''
    : `<p class="vw-band__link">${linkArrow(ctx, ctx.href('caso-villa'), s.caseLink)}</p>`;
  const hd = blockHead(ctx, block.h2 || ui(ctx, 'h2.viewer', s.bandTitle), block, { eyebrow, extra: caseLink });
  return section('viewer', { id: sectionId, labelledby: hd.id, band: true },
    hd.html + viewerCore(ctx, { id: sectionId, railLevel: 3, eager: false, preload: 'visible' }));
}

/**
 * Full viewer app: case page (section#visor, poster eager = LCP) and the embed page.
 * @param {object} opts { id (default 'visor'), embed: bool, eager: bool (default true), railLevel (default 2) }
 */
export function renderViewerApp(ctx, opts = {}) {
  const s = strings(ctx);
  const sectionId = uid(ctx, opts.id || 'visor');
  const core = viewerCore(ctx, {
    id: sectionId, embed: !!opts.embed, eager: opts.eager !== false, stack: !!(opts.bare || opts.embed),
    railLevel: opts.railLevel || 2, preload: opts.embed ? 'intent' : 'visible',
  });
  // bare: the app alone, for the case hero (the template owns the section and its id).
  if (opts.bare) return core;
  return section('viewer', { id: sectionId, label: s.appLabel, band: true, cls: `vw-app${opts.embed ? ' vw-app--embed' : ''}` }, core);
}

/** `ar` block: iPhone/iPad Quick Look links, Android Scene Viewer intents, desktop QR. */
export function renderArBlock(ctx, block = {}) {
  ctx.needs.add('viewer');
  const hd = blockHead(ctx, block.h2 || ui(ctx, 'h2.ar', tx(ctx, 'arTitle')), block);
  return section('ar', { labelledby: hd.id }, hd.html + renderArChoices(ctx, { level: 3 }));
}

/** Plain compatibility table (for the HTML block and the Markdown mirror). */
export function formatsTable(ctx) {
  const s = strings(ctx);
  const f = villa.files;
  const r = s.formatsRows;
  const size = (file) => ctx.fmtBytes(file.bytes);
  return {
    caption: s.formatsCaption,
    head: s.formatsHead,
    rows: [
      [...r.glb, size(f.glb)],
      [...r.usdzMesa, size(f.usdzMesa)],
      [...r.usdzReal, size(f.usdzReal)],
      [...r.glbArMesa, size(f.glbArMesa)],
      [...r.glbAr, size(f.glbAr)],
      [...r.qr],
    ],
  };
}

/** `formats` block: Dispositivo · Cómo se abre · Formato · Tamaño (sizes from villa.files), engine table markup. */
export function renderFormats(ctx, block = {}) {
  ctx.needs.add('viewer');
  const t = formatsTable(ctx);
  const hd = blockHead(ctx, block.h2 || ui(ctx, 'h2.formats', t.caption), block);
  const cap = uid(ctx, 'tabla');
  const head = t.head.map((c) => `<th scope="col">${esc(c)}</th>`).join('');
  const lb = (i) => ` data-label="${esc(t.head[i])}"`;
  const rows = t.rows.map((row) => `<tr><th scope="row">${inline(ctx, row[0])}</th><td${lb(1)}>${inline(ctx, row[1])}</td>`
    + `<td${lb(2)}>${inline(ctx, row[2])}</td><td class="num"${lb(3)}>${esc(row[3] || '')}</td></tr>`).join('');
  return section('formats', { labelledby: hd.id }, hd.html
    + `<div class="table table--stack"><div class="table__scroll" role="region" tabindex="0" aria-labelledby="${cap}">`
    + `<table><caption id="${cap}">${esc(t.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`);
}

/** The iframe snippet agencies paste into their site (absolute URL of /embed/villa/). */
export function embedSnippet(ctx) {
  const title = fill(tx(ctx, 'embedTitle'), { name: villa.name[ctx.lang] });
  return `<iframe src="${ctx.abs(ctx.href('embed-villa'))}" title="${title}" width="100%" height="560" style="border:0;max-width:100%" allow="xr-spatial-tracking; fullscreen" loading="lazy"></iframe>`;
}

/** `embedCode` block: a real lazy iframe of /embed/villa/ plus the copyable snippet (COMP-25). */
export function renderEmbedCode(ctx, block = {}) {
  ctx.needs.add('viewer');
  const s = strings(ctx);
  const hd = blockHead(ctx, block.h2 || ui(ctx, 'h2.embedCode', s.embedCode), block);
  const codeId = uid(ctx, 'vw-embed-code');
  const title = fill(s.embedTitle, { name: villa.name[ctx.lang] });
  return section('embedCode', { labelledby: hd.id }, hd.html
    + '<div class="vw-embedcode">'
    + `<figure class="vw-embedcode__preview"><iframe src="${esc(ctx.href('embed-villa'))}" title="${esc(title)}"`
    + ' width="1200" height="560" loading="lazy" allow="xr-spatial-tracking; fullscreen"></iframe>'
    + `<figcaption>${esc(s.embedPreview)}</figcaption></figure>`
    + `<div class="vw-code"><p class="vw-code__label" id="${codeId}-label">${esc(s.embedCode)}</p>`
    + `<pre role="region" tabindex="0" aria-labelledby="${codeId}-label"><code id="${codeId}" translate="no">${esc(embedSnippet(ctx))}</code></pre>`
    + `<p class="vw-code__actions"><button type="button" class="btn btn--neutral vw-tool" data-vw-copy="${codeId}" data-ok="${esc(s.copied)}" data-fail="${esc(s.copyFail)}">${icon(ctx, 'copy')}${esc(s.copy)}</button>`
    + ' <span role="status" aria-live="polite" data-vw-copied></span></p></div>'
    + '</div>');
}

export { strings as viewerStrings };
