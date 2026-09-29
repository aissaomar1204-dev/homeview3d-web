/* ═══════════════════════════════════════════════════════════════
   Markdown mirror of a page (owner: GEO).
   blocksToMarkdown(entry, ctx[, opts]) → Markdown string used for
   `<path>index.md`, `llms-full.txt` and the IndexNow content hash.

   - Built from the SAME content data as the HTML (never HTML → MD).
   - Tokens resolved through ctx.tok (fallback resolver below when a
     ctx is not available), internal links (@id, @glosario#term)
     resolved to ABSOLUTE URLs, md-lite kept as Markdown.
   - Every block type of docs/build/CONTENT-SCHEMA.md §3 is rendered.
   Also exports small shared helpers used by schema.mjs / machine.mjs.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../data/site.mjs';
import { routes, routeById } from '../data/routes.mjs';
import { pricing, formatPrice, packById } from '../data/pricing.mjs';
import { villa } from '../data/villa.mjs';
import { process as proc } from '../data/process.mjs';
import { deliverables, comingSoon } from '../data/deliverables.mjs';
import * as viewerLib from './viewer.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');

// Optional data written by other agents: never crash if absent.
let GLOSSARY = [];
try { const g = await import('../data/glossary.mjs'); GLOSSARY = g.glossary || g.default || []; } catch { /* not written yet */ }
export const glossaryTerms = () => GLOSSARY;

let IMAGES = null;
export function imageManifest() {
  if (IMAGES) return IMAGES;
  try { IMAGES = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'generated', 'images.json'), 'utf8')); }
  catch { IMAGES = {}; }
  return IMAGES;
}
let VIDEOS = null;
/** build/generated/videos.json (key → { width, height, duration, sources[{src,type,bytes}], poster, posterJpg }), {} if absent. */
export function videoManifest() {
  if (VIDEOS) return VIDEOS;
  try { VIDEOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'generated', 'videos.json'), 'utf8')); }
  catch { VIDEOS = {}; }
  return VIDEOS;
}
/** Phone / WhatsApp are published only once site.contact holds real data (same rule as the engine's ctx.phoneLink, V-02). */
export const directContact = () => site.contact.placeholder !== true && !!site.contact.phoneE164;
/** The founder (site.founder) once filled in, else null (same rule as schema.mjs). */
const founderOf = () => (site.founder && site.founder.name && !site.founder.placeholder ? site.founder : null);

export const LOCALE = { es: 'es-ES', en: 'en-GB' };
export const brandName = () => site.brand.name;

/* ── Number / size formatting (same conventions as the content tokens) ── */
export function fmtNumber(n, lang, decimals) {
  const opts = decimals == null ? { maximumFractionDigits: 2, useGrouping: 'always' } : { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: 'always' };
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', opts).format(n);
}
/** Decimal megabytes like the engine's {{file:*}}: 3132584 → "3,1 MB" / "3.1 MB"; ≥ 10 MB without decimals. */
export function fmtMB(bytes, lang) {
  const mb = bytes / 1e6;
  return `${new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', { maximumFractionDigits: mb < 10 ? 1 : 0 }).format(mb)} MB`;
}

/* ── Fallback token resolver (used only when no ctx.tok is available) ── */
const dayRange = (d, lang) => (lang === 'es' ? `${d.min} a ${d.max} días laborables` : `${d.min} to ${d.max} working days`);
const revisionsText = (n, lang) => (lang === 'es' ? `${n} ${n === 1 ? 'ronda' : 'rondas'} de cambios` : `${n} ${n === 1 ? 'round' : 'rounds'} of changes`);
export function fallbackToken(inner, lang) {
  const [name, a, b] = inner.trim().split(':');
  switch (name) {
    case 'brand': return site.brand.name;
    case 'entity': return resolveTokensFallback(site.entity[lang], lang);
    case 'email': return site.contact.email;
    case 'phone': return site.contact.phoneDisplay;
    case 'whatsapp': return site.contact.phoneDisplay;
    case 'year': return String(new Date().getFullYear());
    case 'price': { const p = packById(a); if (!p) return null; const v = b !== undefined ? p.tiers?.[+b]?.price : p.price; return v == null ? null : formatPrice(v, lang); }
    case 'extra': { const x = pricing.extras.find((e) => e.id === a); if (!x) return null; return x.pct != null ? (lang === 'es' ? `${x.pct} %` : `${x.pct}%`) : formatPrice(x.price, lang); }
    case 'volume': return formatPrice(pricing.volume.price, lang);
    case 'volumeUnit': return formatPrice(Math.round(pricing.volume.price / pricing.volume.units), lang);
    case 'delivery': { const p = packById(a); return p ? dayRange(p.deliveryDays, lang) : null; }
    case 'revisions': { const p = packById(a); return p ? revisionsText(p.revisions, lang) : null; }
    case 'villa': { const v = villa.specs[a]; if (v == null) return null; if (typeof v === 'number') return fmtNumber(v, lang); if (typeof v === 'object' && v[lang]) return v[lang]; if (typeof v === 'object' && 'w' in v) return `${fmtNumber(v.w, lang)} × ${fmtNumber(v.d, lang)} m`; return String(v); }
    case 'file': { const f = villa.files[a]; return f ? fmtMB(f.bytes, lang) : null; }
    case 'legal': return site.legal[a] ?? null;
    default: return null;
  }
}
export function resolveTokensFallback(str, lang) {
  return String(str ?? '').replace(/\{\{([^}]*)\}\}/g, (m, inner) => {
    const v = fallbackToken(inner, lang);
    if (v == null) throw new Error(`markdown.mjs: unknown token ${m}`);
    return v;
  });
}

/* ── Helpers bound to a ctx (engine ctx preferred, fallbacks otherwise) ── */
export function helpers(ctx, langHint) {
  const lang = ctx?.lang || langHint || site.defaultLang;
  const abs = (p) => {
    if (!p) return p;
    if (/^https?:\/\//.test(p)) return p;
    if (typeof ctx?.abs === 'function') { try { return ctx.abs(p); } catch { /* fall through */ } }
    return site.domain + p;
  };
  const tokOne = (m) => {
    if (typeof ctx?.tok === 'function') { try { return ctx.tok(m); } catch { /* fall through */ } }
    return resolveTokensFallback(m, lang);
  };
  /** Resolve {{tokens}} only (keeps Markdown). */
  const tokens = (s) => String(s ?? '').replace(/\{\{[^}]*\}\}/g, (m) => tokOne(m));
  /** Plain text: tokens resolved, markdown stripped. */
  const plain = (s) => {
    if (s == null) return '';
    if (typeof ctx?.tok === 'function') { try { return ctx.tok(String(s)); } catch { /* fall through */ } }
    return stripMd(resolveTokensFallback(s, lang));
  };
  const routePath = (id, l = lang) => routeById[id]?.[l] || null;
  /** Path of a page id (+ anchor) in this language, or null when it does not exist or was not built. */
  const hrefSafe = (id, anchor) => {
    if (typeof ctx?.has === 'function') { try { if (!ctx.has(id)) return null; } catch { /* fall through */ } }
    let p = null;
    if (typeof ctx?.href === 'function') { try { p = ctx.href(id, anchor); } catch { p = null; } }
    if (!p) { p = routePath(id); if (!p) return null; if (anchor) p += `#${anchor}`; }
    else if (anchor && !p.includes('#')) p += `#${anchor}`;
    return p;
  };
  const absHref = (id, anchor) => { const p = hrefSafe(id, anchor); return p ? abs(p) : null; };
  /** md-lite inline → Markdown with tokens resolved and links made absolute. */
  const inline = (s) => tokens(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, target) => {
    if (target.startsWith('@')) {
      const [id, anchor] = target.slice(1).split('#');
      const u = absHref(id, anchor);
      return u ? `[${text}](${u})` : text;
    }
    return `[${text}](${target})`;
  });
  const assetUrl = (publicPath) => {
    if (typeof ctx?.asset === 'function') { try { return abs(ctx.asset(publicPath)); } catch { /* fall through */ } }
    return abs(publicPath);
  };
  /** Absolute URL of a registered image (largest sensible webp) or null. */
  const imageUrl = (name) => {
    const m = imageManifest()[name];
    if (!m) return null;
    return assetUrl(m.fallback || m.path.replace('{w}', String(m.widths.at(-1))).replace('{ext}', 'webp'));
  };
  return { lang, ctx, abs, tokens, plain, inline, hrefSafe, absHref, routePath, assetUrl, imageUrl };
}

/** md-lite → plain text (links reduced to text, emphasis removed). */
export function stripMd(s) {
  return String(s ?? '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+?)\*\*/g, '$1')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1$2')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export const countWords = (text) => String(text ?? '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/* ── Labels ───────────────────────────────────────────────────── */
const LABELS = {
  es: {
    canonical: 'URL canónica', language: 'Idioma', updated: 'Actualizado', author: 'Autor', team: (b) => `Equipo de ${b}`,
    twin: 'English', keyFacts: 'Datos clave', faq: 'Preguntas frecuentes', related: 'Sigue leyendo', contact: 'Contacto',
    demo: 'Pide tu demo', email: 'Email', phone: 'Teléfono', whatsapp: 'WhatsApp', form: 'Formulario de solicitud',
    viewer: 'Visor 3D interactivo', viewerLink: 'Ver la villa en 3D', rooms: 'Estancias del modelo', ar: 'Realidad aumentada sin app',
    formats: 'Formatos y compatibilidad', embed: 'Incrusta el visor en tu web', deliverables: 'Qué entregamos', comingSoon: 'Próximamente',
    process: 'Cómo funciona', needs: 'Qué necesitamos de ti', services: 'Servicios', audiences: 'Soluciones por tipo de cliente',
    pricing: 'Precios', calculator: 'Precio por volumen', guarantees: 'Garantías', specs: 'Ficha técnica', sources: 'Fuentes',
    compare: 'Del plano 2D al modelo 3D', gallery: 'Galería de renders', glossary: 'Glosario',
    device: 'Dispositivo', opens: 'Cómo se abre', format: 'Formato', size: 'Tamaño',
    pack: 'Pack', priceNoVat: 'Precio sin IVA', delivery: 'Plazo', includes: 'Incluye', unit: 'Unidad', area: 'Superficie',
    extra: 'Extra', units: 'Viviendas', perUnit: 'Precio por vivienda', from: 'desde', upTo: (n) => `hasta ${n} m²`, range: (a, b) => `de ${a + 1} a ${b} m²`,
    videoStill: 'Fotograma del vídeo', videoLink: (s, mb) => `Ver el vídeo (MP4, ${s} s, ${mb})`,
    vatNote: (r) => `Todos los precios son sin IVA (IVA aplicable: ${r} %).`, source: 'Fuente', related2: 'Relacionado', render: 'Render',
    comingSoonTag: 'próximamente', total: (d) => `Plazo total: ${d}.`, rendersNote: 'Imágenes generadas a partir del modelo 3D (renders), no fotografías.',
    unitsRange: (a, b) => (b ? `${a} a ${b}` : `${a} o más`), plan2d: 'Plano 2D', model3d: 'Modelo 3D',
    embedIntro: 'Copia este código en tu web para mostrar el visor 3D:',
    iphone: 'iPhone y iPad', android: 'Android', desktop: 'Ordenador, tablet y móvil', arIos: 'AR Quick Look desde Safari, sin app',
    arAndroid: 'Scene Viewer en móviles con ARCore, sin app', webViewer: 'Visor 3D web en el navegador', tabletop: 'maqueta 1:20', realSize: 'tamaño real',
    desktopAr: 'En ordenador no hay realidad aumentada: escanea el código QR de esta página con el móvil', arPage: 'Página de realidad aumentada',
    approx: '≈',
  },
  en: {
    canonical: 'Canonical URL', language: 'Language', updated: 'Updated', author: 'Author', team: (b) => `${b} team`,
    twin: 'Español', keyFacts: 'Key facts', faq: 'Frequently asked questions', related: 'Keep reading', contact: 'Contact',
    demo: 'Get your demo', email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp', form: 'Request form',
    viewer: 'Interactive 3D viewer', viewerLink: 'View the villa in 3D', rooms: 'Rooms in the model', ar: 'App-free augmented reality',
    formats: 'Formats and compatibility', embed: 'Embed the viewer on your website', deliverables: 'What we deliver', comingSoon: 'Coming soon',
    process: 'How it works', needs: 'What we need from you', services: 'Services', audiences: 'Solutions by client type',
    pricing: 'Pricing', calculator: 'Volume pricing', guarantees: 'Guarantees', specs: 'Specifications', sources: 'Sources',
    compare: 'From 2D floor plan to 3D model', gallery: 'Render gallery', glossary: 'Glossary',
    device: 'Device', opens: 'How it opens', format: 'Format', size: 'Size',
    pack: 'Package', priceNoVat: 'Price excl. VAT', delivery: 'Turnaround', includes: 'Includes', unit: 'Unit', area: 'Floor area',
    extra: 'Extra', units: 'Homes', perUnit: 'Price per home', from: 'from', upTo: (n) => `up to ${n} m²`, range: (a, b) => `${a + 1} to ${b} m²`,
    videoStill: 'Video still', videoLink: (s, mb) => `Watch the video (MP4, ${s} s, ${mb})`,
    vatNote: (r) => `All prices exclude VAT (Spanish VAT: ${r}%).`, source: 'Source', related2: 'Related', render: 'Render',
    comingSoonTag: 'coming soon', total: (d) => `Total turnaround: ${d}.`, rendersNote: 'Images generated from the 3D model (renders), not photographs.',
    unitsRange: (a, b) => (b ? `${a} to ${b}` : `${a} or more`), plan2d: '2D floor plan', model3d: '3D model',
    embedIntro: 'Paste this code into your website to show the 3D viewer:',
    iphone: 'iPhone and iPad', android: 'Android', desktop: 'Computer, tablet and phone', arIos: 'AR Quick Look from Safari, no app',
    arAndroid: 'Scene Viewer on ARCore phones, no app', webViewer: 'Web 3D viewer in the browser', tabletop: '1:20 tabletop model', realSize: 'real size',
    desktopAr: 'Computers cannot show augmented reality: scan the QR code on this page with your phone', arPage: 'Augmented reality page',
    approx: '≈',
  },
};
export const labels = (lang) => LABELS[lang] || LABELS.es;

/* ── Markdown primitives ──────────────────────────────────────── */
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s*\n+\s*/g, ' ').trim();
function mdTable(head, rows, caption) {
  const out = [];
  if (caption) out.push(`**${cell(caption)}**`, '');
  out.push(`| ${head.map(cell).join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`);
  for (const r of rows) out.push(`| ${r.map(cell).join(' | ')} |`);
  return out.join('\n');
}
const h2 = (t) => `## ${String(t).replace(/\s+/g, ' ').trim()}`;
const h3 = (t) => `### ${String(t).replace(/\s+/g, ' ').trim()}`;

/* ── Viewer / AR / formats / embed ────────────────────────────────
   Plain data comes from the VIEWER module (build/lib/viewer.mjs: roomRows, arLinks, formatsTable,
   embedSnippet, viewerStrings) so the Markdown says exactly what the HTML block shows. When it cannot
   run (no engine ctx, e.g. scripts/geo-harness.mjs without fmtBytes) the local fallbacks below keep
   the mirror complete. */
const NB = /[  ]/g;
const plainSpaces = (s) => String(s ?? '').replace(NB, ' ');
function viewerData(fn, h, fallback) {
  const ctx = h.ctx;
  if (ctx && typeof viewerLib[fn] === 'function') {
    try { const v = viewerLib[fn](ctx); if (v) return v; } catch { /* fall back */ }
  }
  return fallback();
}
/** Viewer UI strings in the page language (same labels as the HTML), or null. */
function vs(h) {
  try { return h.ctx && typeof viewerLib.viewerStrings === 'function' ? viewerLib.viewerStrings(h.ctx) : null; } catch { return null; }
}
/** Engine ui string (ctx.t) with a fallback, like viewer.mjs does for block headings. */
function uiOr(h, key, fallback) {
  try { const v = h.ctx?.t?.(key); if (typeof v === 'string' && v) return v; } catch { /* not defined */ }
  return fallback;
}
function roomsList(h) {
  const L = labels(h.lang);
  const rows = viewerData('roomRows', h, () => villa.rooms.map((r) => ({ name: r[h.lang].name, text: r[h.lang].text, areaLabel: `${L.approx} ${fmtNumber(r.area, h.lang)} m²` })));
  return rows.map((r) => `- **${plainSpaces(r.name)}** (${plainSpaces(r.areaLabel)}): ${plainSpaces(r.text)}`).join('\n');
}
function formatsTable(h) {
  const L = labels(h.lang);
  const t = viewerData('formatsTable', h, () => {
    const f = villa.files;
    const mb = (k) => fmtMB(f[k].bytes, h.lang);
    return {
      caption: L.formats,
      head: [L.device, L.opens, L.format, L.size],
      rows: [
        [L.iphone, L.arIos, 'USDZ', `${mb('usdzMesa')} (${L.tabletop}), ${mb('usdzReal')} (${L.realSize})`],
        [L.android, L.arAndroid, 'GLB', `${mb('glbArMesa')} (${L.tabletop}), ${mb('glbAr')} (${L.realSize})`],
        [L.desktop, L.webViewer, 'GLB (Meshopt + WebP)', mb('glb')],
      ],
    };
  });
  return { caption: plainSpaces(t.caption), md: mdTable(t.head.map(plainSpaces), t.rows.map((r) => r.map((c) => plainSpaces(h.inline(c)))), plainSpaces(t.caption)) };
}
function arSection(h) {
  const L = labels(h.lang);
  const s = vs(h) || {};
  const f = villa.files;
  const size = (k) => fmtMB(f[k].bytes, h.lang);
  const links = viewerData('arLinks', h, () => ({
    iosMesa: f.usdzMesa.url, iosReal: f.usdzReal.url, page: h.absHref('ar-villa'),
  }));
  const mesa = s.arMesa || f.usdzMesa.label[h.lang];
  const real = s.arReal || f.usdzReal.label[h.lang];
  // iPhone/iPad: the USDZ files the page's AR Quick Look links open (without the #canonicalWebPageURL=…
  // banner fragment, which only Quick Look reads). Android: the plain GLBs that Scene Viewer opens (the page
  // wraps them in an intent:// URL, useless outside Android). Desktop: the AR page (the QR target).
  const file = (u) => h.abs(String(u).split('#')[0]);
  return [
    `- **${s.ios || L.iphone}** (${plainSpaces(s.iosHow || L.arIos)}): [${mesa}, USDZ ${size('usdzMesa')}](${file(links.iosMesa)}) · [${real}, USDZ ${size('usdzReal')}](${file(links.iosReal)})`,
    `- **${s.android || L.android}** (${plainSpaces(s.androidHow || L.arAndroid)}): [${mesa}, GLB ${size('glbArMesa')}](${h.abs(f.glbArMesa.url)}) · [${real}, GLB ${size('glbAr')}](${h.abs(f.glbAr.url)})`,
    `- **${s.desktop || L.desktop}**: ${plainSpaces(s.qrHow || L.desktopAr)}${links.page ? ` [${s.qrLink || L.arPage}](${h.abs(links.page)})` : ''}`,
  ].join('\n');
}
function embedSnippet(h) {
  const code = viewerData('embedSnippet', h, () => {
    const src = h.absHref('embed-villa');
    if (!src) return '';
    const title = h.lang === 'es' ? `${villa.name.es} en 3D` : `${villa.name.en} in 3D`;
    return `<iframe src="${src}" title="${title}" width="100%" height="560" style="border:0;max-width:100%" allow="xr-spatial-tracking; fullscreen" loading="lazy"></iframe>`;
  });
  return code ? ['```html', plainSpaces(code), '```'].join('\n') : '';
}
function processList(h) {
  return proc.steps.map((s, i) => `${i + 1}. **${s[h.lang].title}** (${s[h.lang].time}): ${s[h.lang].body}`).join('\n');
}
function pricingTables(h, variant) {
  const L = labels(h.lang);
  const lang = h.lang;
  const out = [];
  const packPrice = (p) => {
    const base = h.tokens(`{{price:${p.id}}}`);
    const unit = p.unit[lang];
    const tier = p.tiers?.[0]?.maxM2 ? `, ${L.upTo(p.tiers[0].maxM2)}` : '';
    return `${p.from ? `${L.from} ` : ''}${base} ${unit}${tier}`;
  };
  out.push(mdTable([L.pack, L.priceNoVat, L.delivery, L.includes], pricing.packs.map((p) => [
    p.name[lang], packPrice(p), h.tokens(`{{delivery:${p.id}}}`), p.includes[lang].join('; '),
  ])));
  if (variant === 'full') {
    const tierRows = [];
    for (const p of pricing.packs) {
      (p.tiers || []).forEach((t, i) => {
        const prev = i ? p.tiers[i - 1].maxM2 : null;
        tierRows.push([p.name[lang], prev ? L.range(prev, t.maxM2) : L.upTo(t.maxM2), `${h.tokens(`{{price:${p.id}:${i}}}`)} ${p.unit[lang]}`]);
      });
    }
    if (tierRows.length) out.push('', mdTable([L.pack, L.area, L.priceNoVat], tierRows));
    out.push('', mdTable([L.extra, L.priceNoVat, L.unit], pricing.extras.map((x) => [
      x.name[lang], x.pct != null ? `+${h.tokens(`{{extra:${x.id}}}`)}` : h.tokens(`{{extra:${x.id}}}`), x.unit[lang],
    ])));
    const v = pricing.volume;
    out.push('', `**${v.name[lang]}**: ${h.tokens('{{volume}}')} (${h.tokens('{{volumeUnit}}')} ${lang === 'es' ? 'por vivienda' : 'per home'}). ${v.note[lang]}`);
    out.push('', `**${L.guarantees}**`, '', pricing.guarantees[lang].map((g) => `- ${g}`).join('\n'));
  }
  out.push('', L.vatNote(Math.round(pricing.vatRate * 100)));
  return out.join('\n');
}
function calculatorTable(h) {
  const L = labels(h.lang);
  const c = pricing.calculator;
  const rows = c.steps.map((s, i) => {
    const next = c.steps[i + 1];
    const to = next ? next.from - 1 : c.maxUnits;
    return [L.unitsRange(s.from, to === s.from ? null : to), formatPrice(s.unit, h.lang)];
  });
  const pack = packById(c.packId);
  return mdTable([L.units, `${L.perUnit} (${pack.name[h.lang]})`], rows);
}

/* ── Card lookup for index blocks (services, audiences, pages, related) ── */
let REGISTRY = null;
/** machine.mjs registers the full entry list so index blocks can use other pages' cards. */
export function setRegistry(entries) { REGISTRY = entries; }
function cardFor(id, h, entries) {
  const list = entries || REGISTRY || [];
  const e = list.find((x) => x.id === id && x.lang === h.lang);
  const url = h.absHref(id);
  if (!url) return null;
  if (!e) {
    // Not in the registry (e.g. a page rendered after this one): the engine ctx can still read its card.
    const c = typeof h.ctx?.card === 'function' && typeof h.ctx?.has === 'function' && h.ctx.has(id) ? (() => { try { return h.ctx.card(id); } catch { return null; } })() : null;
    return c ? { title: c.title, summary: c.summaryPlain || '', url, built: true } : { title: id, summary: '', url, built: false };
  }
  const card = e.page?.card;
  return {
    title: h.plain(card?.title || e.page?.breadcrumb || e.h1 || e.title),
    summary: card?.summary ? h.inline(card.summary) : (e.description || ''),
    url: e.url || url,
    built: true,
  };
}
function cardList(ids, h, entries) {
  return ids.map((id) => cardFor(id, h, entries)).filter((c) => c && c.built)
    .map((c) => `- [${c.title}](${c.url})${c.summary ? `: ${c.summary}` : ''}`).join('\n');
}
const SERVICE_IDS = ['servicio-plano', 'servicio-renders', 'servicio-tour', 'servicio-ar', 'servicio-staging'];

/* ── FAQ ──────────────────────────────────────────────────────── */
function faqMd(items, h) {
  return items.map((f) => `${h3(h.plain(f.q))}\n\n${h.inline(f.a)}`).join('\n\n');
}
function glossaryMd(h) {
  const L = labels(h.lang);
  const terms = GLOSSARY.filter((t) => t[h.lang]).slice()
    .sort((a, b) => a[h.lang].term.localeCompare(b[h.lang].term, h.lang, { sensitivity: 'base' }));
  return terms.map((t) => {
    const rel = t.related ? cardFor(t.related, h) : null;
    const parts = [h2(t[h.lang].term), h.inline(t[h.lang].definition)];
    if (t[h.lang].body) parts.push(h.inline(t[h.lang].body));
    if (rel?.url) parts.push(`${L.related2}: [${rel.built ? rel.title : rel.url}](${rel.url})`);
    return parts.join('\n\n');
  }).join('\n\n');
}
function contactLines(h, service) {
  const L = labels(h.lang);
  const contactUrl = h.absHref('contacto');
  const lines = [];
  if (contactUrl) lines.push(`- ${L.demo}: ${contactUrl}${service ? `?servicio=${encodeURIComponent(service)}` : ''}`);
  lines.push(`- ${L.email}: ${site.contact.email}`);
  // Phone and WhatsApp only with real contact data, like the pages (V-02): never a placeholder number to dial.
  if (directContact()) {
    lines.push(`- ${L.phone}: ${site.contact.phoneDisplay}`);
    if (site.contact.whatsapp) lines.push(`- ${L.whatsapp}: https://wa.me/${site.contact.whatsapp}`);
  }
  return lines.join('\n');
}

/* ── Block renderers ──────────────────────────────────────────── */
function blockMd(b, h, ctxInfo) {
  const L = labels(h.lang);
  const out = [];
  const head = (fallback) => { const t = b.h2 ? h.plain(b.h2) : fallback; if (t) out.push(h2(t)); };
  const intro = () => { if (b.intro) out.push(h.inline(b.intro)); };
  switch (b.type) {
    case 'prose': head(); out.push(h.inline(b.body)); break;
    case 'answer': head(); out.push(h.inline(b.answer)); if (b.body) out.push(h.inline(b.body)); break;
    case 'table': {
      head(); intro();
      out.push(mdTable(b.head.map((x) => h.inline(x)), b.rows.map((r) => r.map((x) => h.inline(x))), h.plain(b.caption)));
      if (b.note) out.push(h.inline(b.note));
      if (b.sources?.length) out.push(b.sources.map((s) => `- ${L.source}: [${h.plain(s.label)}](${s.url})`).join('\n'));
      break;
    }
    case 'steps': head(); intro(); out.push(b.items.map((it, i) => `${i + 1}. **${h.plain(it.title)}**${it.time ? ` (${h.plain(it.time)})` : ''}: ${h.inline(it.body)}`).join('\n')); break;
    case 'checklist': head(); intro(); out.push(b.items.map((it) => `- ${h.inline(it)}`).join('\n')); break;
    case 'figure': {
      const u = h.imageUrl(b.image);
      if (u) out.push(`![${h.plain(b.alt)}](${u})`);
      out.push(`*${h.plain(b.caption)}*`);
      break;
    }
    case 'gallery': {
      head(L.gallery); intro();
      out.push(b.items.map((it) => { const u = h.imageUrl(it.image); return u ? `- [${h.plain(it.caption)}](${u}): ${h.plain(it.alt)}` : `- ${h.plain(it.caption)}: ${h.plain(it.alt)}`; }).join('\n'));
      out.push(L.rendersNote);
      break;
    }
    case 'plate': {
      out.push((b.images || []).map((it) => { const u = h.imageUrl(it.image); return u ? `- [${h.plain(it.caption || it.alt)}](${u}): ${h.plain(it.alt)}` : `- ${h.plain(it.caption || it.alt)}: ${h.plain(it.alt)}`; }).join('\n'));
      out.push(L.rendersNote);
      break;
    }
    case 'video': {
      // Click-to-play render video (build/generated/videos.json): poster image + direct MP4 link + caption.
      const v = videoManifest()[b.video];
      head(); intro();
      if (v) {
        const mp4 = (v.sources || []).find((s) => /mp4/.test(s.type || s.src)) || (v.sources || [])[0];
        const poster = v.posterJpg || v.poster;
        if (poster) out.push(`![${L.videoStill}](${h.assetUrl(poster)})`);
        if (mp4) out.push(`[${L.videoLink(fmtNumber(v.duration, h.lang), fmtMB(mp4.bytes || 0, h.lang))}](${h.assetUrl(mp4.src)})`);
      }
      if (b.caption) out.push(`*${h.plain(b.caption)}*`);
      break;
    }
    case 'compare': {
      head(L.compare); intro();
      const a = h.imageUrl('villa_plano_lineas'); const c = h.imageUrl('villa_planta_cenital_opaco') || h.imageUrl('villa_planta_cenital');
      out.push([a ? `- ${L.plan2d}: ${a}` : `- ${L.plan2d}`, c ? `- ${L.model3d}: ${c}` : `- ${L.model3d}`].join('\n'));
      break;
    }
    case 'viewer': {
      const s = vs(h) || {};
      head(uiOr(h, 'h2.viewer', s.bandTitle || L.viewer)); intro();
      const u = h.absHref('caso-villa', 'visor');
      if (u) out.push(`[${L.viewerLink}](${u}) (GLB, ${fmtMB(villa.files.glb.bytes, h.lang)})`);
      out.push(`**${s.roomsTitle || L.rooms}**`, roomsList(h));
      break;
    }
    case 'ar': head(uiOr(h, 'h2.ar', vs(h)?.arTitle || L.ar)); intro(); out.push(arSection(h)); break;
    case 'formats': { const t = formatsTable(h); head(uiOr(h, 'h2.formats', t.caption || L.formats)); intro(); out.push(t.md); break; }
    case 'embedCode': head(uiOr(h, 'h2.embedCode', vs(h)?.embedCode || L.embed)); intro(); out.push(L.embedIntro, embedSnippet(h)); break;
    case 'deliverables': {
      head(L.deliverables); intro();
      out.push(deliverables.map((d) => { const u = h.absHref(d.page); const t = u ? `[${d[h.lang].title}](${u})` : d[h.lang].title; return `- **${t}** (${d[h.lang].formats}): ${d[h.lang].body}`; }).join('\n'));
      break;
    }
    case 'comingSoon': head(L.comingSoon); intro(); out.push(comingSoon.map((c) => `- **${c[h.lang].title}** (${L.comingSoonTag}): ${c[h.lang].body}`).join('\n')); break;
    case 'process': head(L.process); intro(); out.push(processList(h), L.total(h.tokens('{{delivery:maqueta}}'))); break;
    case 'needs': head(L.needs); intro(); out.push(proc.needs[h.lang].map((n) => `- ${n}`).join('\n')); break;
    case 'services': head(L.services); intro(); out.push(cardList(SERVICE_IDS, h, ctxInfo.entries)); break;
    case 'audiences': {
      head(L.audiences); intro();
      out.push(cardList(routes.filter((r) => r.template === 'audience' && r[h.lang]).map((r) => r.id), h, ctxInfo.entries));
      break;
    }
    case 'pages': head(); intro(); out.push(cardList(b.ids || [], h, ctxInfo.entries)); break;
    case 'pricing': head(L.pricing); intro(); out.push(pricingTables(h, b.variant)); break;
    case 'calculator': head(L.calculator); intro(); out.push(calculatorTable(h)); break;
    case 'guarantees': head(L.guarantees); out.push(pricing.guarantees[h.lang].map((g) => `- ${g}`).join('\n')); break;
    case 'stat': out.push(`> **${h.plain(b.value)}** ${h.inline(b.label)} (${L.source}: [${h.plain(b.source.label)}](${b.source.url}), ${b.year}).`); break;
    case 'callout': {
      const lines = [];
      if (b.title) lines.push(`**${h.plain(b.title)}**`, '');
      lines.push(...h.inline(b.body).split('\n'));
      out.push(lines.map((l) => (l ? `> ${l}` : '>')).join('\n'));
      break;
    }
    case 'specs': head(L.specs); out.push(b.items.map(([k, v]) => `- **${h.plain(k)}**: ${h.inline(v)}`).join('\n')); break;
    case 'sources': head(L.sources); out.push(b.items.map((s) => `- [${h.plain(s.label)}](${s.url})${s.note ? `: ${h.inline(s.note)}` : ''}`).join('\n')); break;
    case 'faq': if (ctxInfo.faq.length) { ctxInfo.faqDone = true; out.push(h2(L.faq), faqMd(ctxInfo.faq, h)); } break;
    case 'faqGroups': ctxInfo.faqDone = true; out.push(b.groups.map((g) => `${h2(h.plain(g.title))}\n\n${faqMd(g.items, h)}`).join('\n\n')); break;
    case 'glossary': ctxInfo.glossaryDone = true; out.push(glossaryMd(h)); break;
    case 'contactForm': head(L.demo); intro(); out.push(contactLines(h, ctxInfo.service)); ctxInfo.contactDone = true; break;
    case 'cta': {
      head(); out.push(h.inline(b.body));
      const u = h.absHref('contacto');
      if (u) out.push(`[${L.demo}](${u}${b.service ? `?servicio=${encodeURIComponent(b.service)}` : ''})`);
      break;
    }
    default: break; // unknown types are rejected by the content validator
  }
  return out.filter(Boolean).join('\n\n');
}

/**
 * Markdown mirror of a registry entry.
 * @param {object} entry registry entry (BUILD-SPEC §5)
 * @param {object} ctx   render ctx (entry.ctx when omitted)
 * @param {object} [opts] { entries } full registry, for cards of other pages
 */
export function blocksToMarkdown(entry, ctx = entry?.ctx, opts = {}) {
  const lang = entry.lang || ctx?.lang || site.defaultLang;
  const h = helpers(ctx, lang);
  const L = labels(lang);
  const page = entry.page || entry.doc?.[lang] || {};
  const doc = entry.doc || {};
  const route = routeById[entry.id] || {};
  const url = entry.url || h.abs(entry.path || route[lang] || '/');
  const brand = site.brand.name;
  const info = { entries: opts.entries, faq: page.faq || [], faqDone: false, glossaryDone: false, contactDone: false, service: page.cta?.service || null };

  const out = [];
  out.push(`# ${h.plain(page.h1 || entry.h1 || entry.title)}`);
  const meta = [`${L.canonical}: ${url}`];
  const f = founderOf();
  meta.push(`${L.language}: ${LOCALE[lang]} · ${L.updated}: ${entry.dateModified || doc.dateModified || ''} · ${L.author}: ${f ? `${f.name}, ${brand}` : L.team(brand)}`);
  const otherLang = lang === 'es' ? 'en' : 'es';
  const twin = entry.alternates?.[otherLang] || route[otherLang];
  if (twin && route.index !== false) meta.push(`${L.twin}: ${h.abs(twin)}`);
  out.push(meta.join('  \n'));
  if (page.lead) out.push(h.inline(page.lead).split('\n').map((l) => `> ${l}`).join('\n'));

  const facts = page.facts?.length ? page.facts : (entry.facts || []);
  if (facts.length) out.push(`${h2(L.keyFacts)}\n\n${facts.map(([k, v]) => `- **${h.plain(k)}**: ${h.inline(v)}`).join('\n')}`);

  // Template-level sections the engine adds automatically.
  const blocks = page.blocks || entry.blocks || [];
  if (entry.template === 'case' && !blocks.some((b) => b.type === 'viewer')) {
    out.push(blockMd({ type: 'viewer' }, h, info));
  }
  for (const b of blocks) { const s = blockMd(b, h, info); if (s) out.push(s); }
  if (entry.template === 'glossary' && !info.glossaryDone && GLOSSARY.length) out.push(glossaryMd(h));
  if (!info.faqDone && info.faq.length) out.push(`${h2(L.faq)}\n\n${faqMd(info.faq, h)}`);

  if (page.related?.length) {
    const rel = cardList(page.related, h, info.entries);
    if (rel) out.push(`${h2(L.related)}\n\n${rel}`);
  }
  if (page.cta?.h2) out.push(`${h2(h.plain(page.cta.h2))}\n\n${h.inline(page.cta.body || '')}`);
  out.push(`${h2(L.contact)}\n\n${contactLines(h, info.service)}`);

  return `${out.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

/** index.md path for a page path: "/" → "/index.md", "/en/pricing/" → "/en/pricing/index.md". */
export const markdownPath = (p) => `${p.endsWith('/') ? p : `${p}/`}index.md`;
