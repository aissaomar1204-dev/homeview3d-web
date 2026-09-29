/* ═══════════════════════════════════════════════════════════════
   Chapter engine (client-requested decoration, 2026-09-29; rulebook Overrides O3). Owner: ENGINE.
   Every block section of a page that opts in (ctx.chapters = {}) becomes a CHAPTER: a full-bleed band with a tone
   (data-ch), a chapter number (data-n), a label (data-l) and the sheet prefix (data-s). CSS (src/css/24-chapters.css)
   turns those attributes into the drafting-sheet furniture: crop marks, dotted / grid paper, the outlined numeral,
   the index row and the sheet id, all as pseudo-elements, so the HTML carries about 60 bytes per chapter.

   THE RHYTHM LIVES HERE (edit CHAPTERS to re-tone a block; the copy of the labels is in ui.mjs, chapter.*):
     h       hero sheet: white drafting paper (grid, ruler, north arrow, scale bar)
     w       white sheet, dotted paper; surfaces inside turn paper-grey (grey plates on white)
     p       paper, drafting grid
     g       grey cutting mat, white grid, drawing axes A to E
     k       graphite: white type, light añil accents, downlight and grain
     c       cinema: graphite over a render (pricing over the dusk terrace; the closing call to action)
     plate   full-bleed render plates and diptychs (block type "plate")
   A tone repeated by two neighbouring chapters flips (w <-> p, g -> w, k -> g), and a dark tone that would follow a cinema
   chapter falls back to `fb`, so two sheets never merge. Every inner template opts in the same way as the home (ctx.chapters = {}).
   ═══════════════════════════════════════════════════════════════ */
import { esc } from './md.mjs';

/**
 * Block type → tone. `alt` alternates white and paper. `ix: false` = a chapter without number, label and index row.
 * `nohead: true` = numbered although the block has no h2 (the giant figure). `fb` = tone used when the previous chapter is
 * a cinema chapter (its graphite foot would merge with a graphite one). Types that are not listed are plain blocks (no chapter attributes).
 */
export const CHAPTERS = {
  compare: { tone: 'g' },
  deliverables: { tone: 'w' },
  process: { tone: 'k', fb: 'g' },
  viewer: { tone: 'g' },
  audiences: { tone: 'w' },
  pricing: { tone: 'c', fb: 'g' },
  calculator: { tone: 'g' },
  faq: { tone: 'w' },
  form: { tone: 'k', fb: 'g' },
  cta: { tone: 'k', fb: 'g' },
  answer: { tone: 'alt' },
  prose: { tone: 'alt' },
  steps: { tone: 'alt' },
  checklist: { tone: 'alt' },
  table: { tone: 'w' },
  needs: { tone: 'g' },
  stat: { tone: 'k', fb: 'p', nohead: true },
  callout: { tone: 'p', ix: false },
  figure: { tone: 'p', ix: false },
  specs: { tone: 'p' },
  gallery: { tone: 'w' },
  video: { tone: 'k', fb: 'g' },
  sources: { tone: 'p' },
  formats: { tone: 'w' },
  ar: { tone: 'g' },
  embedCode: { tone: 'p' },
  services: { tone: 'w' },
  pages: { tone: 'w' },
  comingSoon: { tone: 'p' },
  guarantees: { tone: 'p' },
  glossary: { tone: 'w', ix: false },
  related: { tone: 'w' },
  next: { tone: 'w', ix: false },
  plate: { tone: 'plate', ix: false },
};

/** Tones drawn with the graphite token set (the dateline that follows them continues the same surface). */
export const DARK = new Set(['k', 'c']);

/** Sheet series per template: every page numbers its own drawing set (the home is A-01…, a service S-01…). */
const SERIES = {
  home: 'A', service: 'S', audience: 'C', zone: 'Z', case: 'V', process: 'P', pricing: 'T', guide: 'G',
  hub: 'H', glossary: 'L', faq: 'Q', about: 'N', contact: 'K', thanks: 'K', legal: 'J', notfound: 'X',
};
export const seriesOf = (ctx) => SERIES[(ctx.route && ctx.route.template) || 'home'] || 'A';
/** "Hoja A-" → "Hoja S-" for the page's series. */
const sheetPrefix = (ctx) => ctx.ui.chapter.sheet.replace(/[A-Z]-$/, `${seriesOf(ctx)}-`);

const AXES = '<div class="ch-ax" aria-hidden="true"><i>A</i><i>B</i><i>C</i><i>D</i><i>E</i></div>';
/** What a tone that repeats becomes (so neighbours always differ). */
const FLIP = { w: 'p', p: 'w', g: 'w', k: 'g', c: 'g' };

/** Per-page chapter state (created on first use; the hero and the key-facts strip register themselves through `note`). */
const stateOf = (ctx) => ctx.chapters && (ctx.chapters.state || (ctx.chapters.state = { n: 0, alt: 0, prev: '' }));
/** Tell the engine which tone a chapter that does not call chapter() (the hero, the key-facts strip) has just drawn. */
export function noteTone(ctx, tone) {
  const s = stateOf(ctx);
  if (s) { s.prev = tone; ctx.chapters.last = tone; }
}

/**
 * Resolve the chapter of the next block section, or null when the page has no chapters or the type is a plain block.
 * Numbering is per page, in render order. opts: { tone (override), label (override, plain text), ix (bool), head (bool: the block has an h2) }
 * Returns { tone, n, label, attrs, wrapAttr, axes }: `attrs` goes into the <section> tag, `wrapAttr` (the sheet id,
 * drawn by .wrap::before) into its .wrap, `axes` before the wrapper.
 */
export function chapter(ctx, type, opts = {}) {
  const s = stateOf(ctx);
  if (!s) return null;
  const spec = CHAPTERS[type];
  if (!spec && !opts.tone) return null;
  const sp = spec || {};
  let tone = opts.tone || sp.tone;
  if (tone === 'alt') tone = s.alt++ % 2 ? 'p' : 'w';
  // Graphite right after a cinema chapter would merge with its graphite foot; after plain graphite the repeat rule below flips it.
  if (sp.fb && DARK.has(tone) && s.prev === 'c') tone = sp.fb;
  // A white chapter after the hero sheet would merge with it (both white), so the hero counts as white here.
  if (FLIP[tone] && (tone === s.prev || (tone === 'w' && s.prev === 'h'))) tone = FLIP[tone];
  s.prev = tone;
  ctx.chapters.last = tone;
  const ix = opts.ix !== undefined ? opts.ix : sp.ix !== false;
  const key = ctx.ui.chapter && ctx.ui.chapter[type];
  const label = opts.label || key || '';
  const numbered = ix && label && tone !== 'plate' && tone !== 'h' && (opts.head !== false || sp.nohead);
  const n = numbered ? String(++s.n).padStart(2, '0') : '';
  const attrs = ` data-ch="${tone}"${numbered ? ` data-n="${n}" data-l="${esc(label)}"` : ''}`;
  const wrapAttr = numbered ? ` data-s="${esc(sheetPrefix(ctx))}${n}"` : '';
  return { tone, n, label, attrs, wrapAttr, axes: numbered && (tone === 'g' || tone === 'p') ? AXES : '' };
}

/** Tone of the last chapter of the page ('' when there is none): the date line and the footer follow it. */
export const lastTone = (ctx) => (ctx.chapters && ctx.chapters.last) || '';
