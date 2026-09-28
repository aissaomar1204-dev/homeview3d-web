#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Content validator: node build/validate-content.mjs [id ...]
   Checks build/content/<id>.mjs against docs/build/CONTENT-SCHEMA.md.
   No args = validate every content file that exists.
   Exit code 1 on any error. Warnings never fail.
   ═══════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { routes, routeById } from './data/routes.mjs';
import { pricing } from './data/pricing.mjs';
import { villa } from './data/villa.mjs';
import { site } from './data/site.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(HERE, 'content');

let glossaryIds = null;
try {
  const g = await import(pathToFileURL(path.join(HERE, 'data', 'glossary.mjs')).href);
  glossaryIds = new Set((g.glossary || g.default || []).map((t) => t.id));
} catch { /* glossary not written yet */ }

const IMAGES = new Set([
  'villa_maqueta_iso', 'villa_maqueta_iso_opaco', 'villa_planta_cenital', 'villa_planta_cenital_opaco', 'villa_plano_lineas',
  'villa_salon_dormitorio', 'villa_salon_dormitorio_opaco', 'villa_dormitorios', 'villa_dormitorios_opaco',
  'villa_bano_suite', 'villa_bano_suite_opaco', 'villa_terraza', 'villa_terraza_opaco',
  'villa_muros_completos', 'villa_muros_completos_opaco', 'og_image',
  'villa_despiece_1', 'villa_despiece_2', 'villa_despiece_3', 'villa_viewer_poster',
]);

const BLOCKS = {
  prose: ['body'], answer: ['h2', 'answer'], table: ['caption', 'head', 'rows'], steps: ['h2', 'items'], checklist: ['h2', 'items'],
  figure: ['image', 'alt', 'caption'], gallery: ['items'], compare: [], viewer: [], ar: [], formats: [], embedCode: [],
  deliverables: [], comingSoon: [], process: [], needs: [], services: [], audiences: [], pages: ['ids'], pricing: ['variant'],
  calculator: [], guarantees: [], stat: ['value', 'label', 'source', 'year'], callout: ['body'], specs: ['items'],
  sources: ['items'], faq: [], faqGroups: ['groups'], glossary: [], contactForm: [], cta: ['h2', 'body'], video: ['video', 'caption'],
};

const BANNED = [
  /\binnovador(a|es|as)?\b/i, /\brevolucionari[oa]s?\b/i, /de última generación/i, /solución integral/i, /\bsin precedentes\b/i,
  /cutting[- ]edge/i, /\bseamless(ly)?\b/i, /\bunlock\b/i, /\belevate\b/i, /game[- ]changer/i, /fast-paced/i, /\bdelve\b/i,
  /\blorem\b/i, /\bTODO\b/, /\bTBD\b/, /\bXXX\b/,
];

const NO_FACTS = new Set(['legal', 'thanks', 'ar', 'embed', 'hub']);
const NO_FAQ = new Set(['legal', 'thanks', 'ar', 'embed', 'hub', 'faq', 'glossary']);
const NO_CARD = new Set(['home', 'legal', 'thanks', 'ar', 'embed']);
const MIN_WORDS = { service: [700, 600], audience: [700, 600], zone: [700, 600], guide: [1200, 1000], case: [900, 800], hub: [250, 200] };

const errors = [], warnings = [];
const E = (id, lang, m) => errors.push(`✗ ${id}${lang ? `[${lang}]` : ''}: ${m}`);
const W = (id, lang, m) => warnings.push(`! ${id}${lang ? `[${lang}]` : ''}: ${m}`);

const words = (s) => String(s).replace(/\{\{[^}]+\}\}/g, 'x').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length;
const strings = (o, out = []) => {
  if (typeof o === 'string') out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, out));
  else if (o && typeof o === 'object') Object.values(o).forEach((x) => strings(x, out));
  return out;
};

function checkTokens(id, lang, s) {
  for (const m of s.matchAll(/\{\{([^}]*)\}\}/g)) {
    const [name, a, b] = m[1].split(':');
    const ok = (() => {
      switch (name) {
        case 'brand': case 'entity': case 'email': case 'phone': case 'whatsapp': case 'volume': case 'volumeUnit': case 'year': return !a;
        case 'price': { const p = pricing.packs.find((x) => x.id === a); return !!p && (b === undefined || (p.tiers && p.tiers[+b])); }
        case 'extra': return pricing.extras.some((x) => x.id === a);
        case 'delivery': case 'revisions': return pricing.packs.some((x) => x.id === a);
        case 'villa': return a in villa.specs;
        case 'file': return a in villa.files;
        case 'legal': return a in site.legal;
        default: return false;
      }
    })();
    if (!ok) E(id, lang, `unknown/unresolvable token {{${m[1]}}}`);
  }
}

function checkLinks(id, lang, s) {
  for (const m of s.matchAll(/\]\(([^)]+)\)/g)) {
    const href = m[1];
    if (href.startsWith('@')) {
      const [pid, anchor] = href.slice(1).split('#');
      const r = routeById[pid];
      if (!r) { E(id, lang, `link to unknown page id @${pid}`); continue; }
      if (!r[lang]) E(id, lang, `link @${pid} has no ${lang} version`);
      if (pid === 'glosario' && anchor && glossaryIds && !glossaryIds.has(anchor)) E(id, lang, `unknown glossary term #${anchor}`);
      if (pid === 'glosario' && !anchor) W(id, lang, 'glossary link without #term');
    } else if (!/^https:\/\//.test(href)) {
      E(id, lang, `link must be @id or https URL: ${href}`);
    }
  }
}

function checkText(id, lang, s) {
  if (/[—–]/.test(s)) E(id, lang, `em/en dash in: «${s.slice(0, 70)}…»`);
  for (const re of BANNED) if (re.test(s)) E(id, lang, `banned word ${re} in: «${s.slice(0, 60)}…»`);
  if (/<[a-z][^>]*>/i.test(s)) E(id, lang, `raw HTML in: «${s.slice(0, 60)}…»`);
  if (/\.\.\./.test(s)) W(id, lang, 'use the … character instead of "..."');
  if (lang === 'es' && /"[^"]+"/.test(s)) W(id, lang, `straight quotes (use « »): «${s.slice(0, 50)}…»`);
  if (lang === 'en' && /(^|\s)"[^"]+"/.test(s)) W(id, lang, `straight quotes (use “ ”): «${s.slice(0, 50)}…»`);
  if (/\bEstudio 3D\b/.test(s)) E(id, lang, 'literal brand name: use {{brand}}');
  checkTokens(id, lang, s);
  checkLinks(id, lang, s);
}

function checkLang(doc, route, lang, seen) {
  const id = doc.id, L = doc[lang], t = route.template;
  if (!L) return E(id, lang, 'missing language block');
  const need = (k, cond = true) => { if (cond && (L[k] == null || L[k] === '')) E(id, lang, `missing ${k}`); };
  need('title'); need('description'); need('h1'); need('lead'); need('blocks');
  need('card', !NO_CARD.has(t));
  need('facts', !NO_FACTS.has(t) && !NO_CARD.has(t) || t === 'home');
  need('faq', !NO_FAQ.has(t));
  need('related', !['legal', 'thanks', 'ar', 'embed'].includes(t));

  if (L.title) {
    const n = L.title.includes('{{brand}}') ? L.title.length : L.title.length;
    if (!L.title.includes('{{brand}}') && (n < 30 || n > 55)) W(id, lang, `title ${n} chars (30–55 without brand)`);
    if (seen.titles.has(L.title)) E(id, lang, `duplicate title with ${seen.titles.get(L.title)}`); else seen.titles.set(L.title, `${id}[${lang}]`);
  }
  if (L.description) {
    const n = L.description.length;
    if (n < 110 || n > 160) W(id, lang, `description ${n} chars (120–155)`);
    if (seen.descs.has(L.description)) E(id, lang, `duplicate description with ${seen.descs.get(L.description)}`); else seen.descs.set(L.description, `${id}[${lang}]`);
  }
  if (L.h1 && L.h1.length > (t === 'home' ? 40 : 64)) W(id, lang, `h1 ${L.h1.length} chars`);
  if (L.lead) { const w = words(L.lead); if (w > 64 || w < 20) W(id, lang, `lead ${w} words (25–60)`); }
  if (L.facts) {
    if (!Array.isArray(L.facts) || L.facts.some((f) => !Array.isArray(f) || f.length !== 2)) E(id, lang, 'facts must be [label, value] pairs');
    else if (L.facts.length < 4 || L.facts.length > 8) W(id, lang, `facts ${L.facts.length} pairs (4–8)`);
  }
  if (L.card && (!L.card.title || !L.card.summary)) E(id, lang, 'card needs title and summary');
  if (L.hero?.image && !IMAGES.has(L.hero.image)) E(id, lang, `unknown hero image ${L.hero.image}`);

  for (const [i, b] of (L.blocks || []).entries()) {
    if (!BLOCKS[b.type]) { E(id, lang, `block #${i}: unknown type "${b.type}"`); continue; }
    for (const k of BLOCKS[b.type]) if (b[k] == null || b[k] === '') E(id, lang, `block #${i} (${b.type}) missing ${k}`);
    if (b.type === 'figure' && !IMAGES.has(b.image)) E(id, lang, `block #${i}: unknown image ${b.image}`);
    if (b.type === 'gallery') for (const it of b.items || []) if (!IMAGES.has(it.image)) E(id, lang, `gallery: unknown image ${it.image}`);
    if (b.type === 'pages') for (const pid of b.ids || []) if (!routeById[pid]?.[lang]) E(id, lang, `pages block: @${pid} missing in ${lang}`);
    if (b.type === 'table' && Array.isArray(b.head) && Array.isArray(b.rows)) for (const r of b.rows) if (r.length !== b.head.length) E(id, lang, `table "${b.caption}": row has ${r.length} cells, head has ${b.head.length}`);
    if (b.type === 'answer' && b.answer) { const w = words(b.answer); if (w < 25 || w > 75) W(id, lang, `answer block "${b.h2}" ${w} words (40–60)`); }
    if (b.type === 'stat' && !/^https:\/\//.test(b.source?.url || '')) E(id, lang, 'stat needs source.url (https)');
    if (b.type === 'pricing' && !['excerpt', 'full'].includes(b.variant)) E(id, lang, 'pricing.variant must be excerpt|full');
  }
  if (L.faq) {
    if (!NO_FAQ.has(t) && (L.faq.length < 6 || L.faq.length > 10)) W(id, lang, `faq ${L.faq.length} items (6–10)`);
    for (const f of L.faq) {
      if (!f.q || !f.a) { E(id, lang, 'faq item needs q and a'); continue; }
      const w = words(f.a); if (w < 35 || w > 95) W(id, lang, `faq answer ${w} words (40–80): «${f.q.slice(0, 50)}»`);
    }
  }
  for (const r of L.related || []) if (!routeById[r]?.[lang]) E(id, lang, `related @${r} missing in ${lang}`);

  for (const s of strings(L)) checkText(id, lang, s);

  const min = MIN_WORDS[t];
  if (min) {
    const total = words(strings({ lead: L.lead, blocks: L.blocks, faq: L.faq }).join(' '));
    const need = lang === 'es' ? min[0] : min[1];
    if (total < need) W(id, lang, `only ${total} words (min ${need} for ${t})`);
  }
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(CONTENT).filter((f) => f.endsWith('.mjs')).map((f) => f.replace(/\.mjs$/, ''));
const seen = { titles: new Map(), descs: new Map() };
// Load every existing file for duplicate detection, validate only the requested ones.
const all = fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT).filter((f) => f.endsWith('.mjs')).map((f) => f.replace(/\.mjs$/, '')) : [];
const order = [...all.filter((x) => !ids.includes(x)), ...ids];
for (const id of order) {
  const file = path.join(CONTENT, `${id}.mjs`);
  const validate = ids.includes(id);
  if (!fs.existsSync(file)) { if (validate) E(id, null, `file not found: build/content/${id}.mjs`); continue; }
  let doc;
  try { doc = (await import(pathToFileURL(file).href + `?t=${Date.now()}`)).default; } catch (e) { E(id, null, `import failed: ${e.message}`); continue; }
  const route = routeById[id];
  if (!route) { E(id, null, 'id not in routes.mjs'); continue; }
  if (doc.id !== id) E(id, null, `export id "${doc.id}" ≠ filename`);
  if (!validate) { for (const lang of site.langs) if (doc[lang]) { if (doc[lang].title) seen.titles.set(doc[lang].title, `${id}[${lang}]`); if (doc[lang].description) seen.descs.set(doc[lang].description, `${id}[${lang}]`); } continue; }
  if (doc.image && !IMAGES.has(doc.image)) E(id, null, `unknown image key ${doc.image}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.dateModified || '')) E(id, null, 'dateModified YYYY-MM-DD required');
  for (const lang of site.langs) {
    if (route[lang]) checkLang(doc, route, lang, seen);
    else if (doc[lang]) E(id, lang, `routes.mjs has no ${lang} path: remove this language block`);
  }
}

const missing = routes.filter((r) => !fs.existsSync(path.join(CONTENT, `${r.id}.mjs`))).map((r) => r.id);
warnings.forEach((w) => console.log(w));
errors.forEach((e) => console.log(e));
console.log(`\nValidated ${ids.length} file(s): ${errors.length} errors, ${warnings.length} warnings.` + (missing.length ? `\nNot written yet (${missing.length}): ${missing.join(', ')}` : ''));
process.exit(errors.length ? 1 : 0);
