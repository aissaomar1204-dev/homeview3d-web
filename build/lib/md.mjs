/* ═══════════════════════════════════════════════════════════════
   md-lite → HTML (docs/build/CONTENT-SCHEMA.md §2) + helpers.
   Owner: ENGINE. Zero dependencies.
   Supported: paragraphs (blank line), "- " / "1. " lists, **bold**,
   *italic*, [text](@id#anchor) internal links, [text](https://…) sources.
   Tokens ({{…}}) are resolved first through env.token(name, args).
   ═══════════════════════════════════════════════════════════════ */

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Attribute-safe escape (same as esc, kept separate for intent). */
export const attr = esc;

/** Slug for heading ids: lowercase ASCII, accents stripped, hyphen separated. */
export function slugify(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '') || 'seccion';
}

/** Resolve {{tokens}} with env.token(name, args[]). Unknown tokens throw (build fails). */
export function resolveTokens(str, env) {
  return String(str ?? '').replace(/\{\{([^}]*)\}\}/g, (m, inner) => {
    const [name, ...args] = inner.trim().split(':');
    const v = env.token(name, args);
    if (v == null) throw new Error(`Unknown token ${m}`);
    return v;
  });
}

// Format and product names that must not be machine-translated (rulebook A11Y-10).
const NO_TRANSLATE = /\b(AR Quick Look|Scene Viewer|Quick Look|model-viewer|USDZ|GLB|glTF|Blender|Cycles|WebXR)\b/g;

function emphasis(escaped, env) {
  let s = escaped;
  if (env.noTranslate !== false) s = s.replace(NO_TRANSLATE, '<span translate="no">$1</span>');
  s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
  return s;
}

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Inline md-lite (no block elements). Tokens resolved. */
export function renderInline(str, env) {
  const src = resolveTokens(str, env);
  let out = '';
  let last = 0;
  for (const m of src.matchAll(LINK)) {
    out += emphasis(esc(src.slice(last, m.index)), env);
    const [, text, target] = m;
    const inner = emphasis(esc(text), env);
    if (target.startsWith('@')) {
      const [id, anchor] = target.slice(1).split('#');
      const href = env.link(id, anchor);
      out += `<a href="${esc(href)}">${inner}</a>`;
    } else if (/^https:\/\//.test(target)) {
      out += `<a href="${esc(target)}" rel="noopener">${inner}</a>`;
    } else {
      throw new Error(`Invalid link target "${target}" (use @id or https://)`);
    }
    last = m.index + m[0].length;
  }
  out += emphasis(esc(src.slice(last)), env);
  return out;
}

/** Block md-lite: paragraphs and lists. `opts.pClass` adds a class to the first paragraph. */
export function renderMd(str, env, opts = {}) {
  const src = String(str ?? '').replace(/\r\n?/g, '\n').trim();
  if (!src) return '';
  const chunks = src.split(/\n{2,}/);
  const html = [];
  let firstP = true;
  const para = (lines) => {
    const text = lines.map((l) => l.trim()).join(' ');
    const cls = firstP && opts.pClass ? ` class="${opts.pClass}"` : '';
    firstP = false;
    html.push(`<p${cls}>${renderInline(text, env)}</p>`);
  };
  for (const chunk of chunks) {
    const lines = chunk.split('\n');
    let buf = [];
    let list = null; // { tag, items }
    const flushList = () => {
      if (list) html.push(`<${list.tag}>${list.items.map((i) => `<li>${renderInline(i, env)}</li>`).join('')}</${list.tag}>`);
      list = null;
    };
    const flushPara = () => { if (buf.length) para(buf); buf = []; };
    for (const line of lines) {
      const ul = line.match(/^\s*[-*]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      if (ul || ol) {
        flushPara();
        const tag = ul ? 'ul' : 'ol';
        if (list && list.tag !== tag) flushList();
        if (!list) list = { tag, items: [] };
        list.items.push((ul || ol)[1]);
      } else if (list && /^\s{2,}\S/.test(line)) {
        list.items[list.items.length - 1] += ` ${line.trim()}`; // continuation line
      } else {
        flushList();
        buf.push(line);
      }
    }
    flushPara();
    flushList();
  }
  return html.join('');
}

/** md-lite → plain text: tokens resolved, markup stripped, links reduced to their text. */
export function toPlain(str, env) {
  return resolveTokens(str, env)
    .replace(LINK, '$1')
    .replace(/\*\*([^*]+?)\*\*/g, '$1')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1$2')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Strip tags from HTML and collapse whitespace (word counts, plain previews). */
export const stripTags = (html) => String(html ?? '')
  .replace(/<(script|style|template)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim();

export const countWords = (text) => String(text ?? '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
