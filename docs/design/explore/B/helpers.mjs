/* Build-time helpers for apply.mjs (kept in their own file: they carry regexes). */

/** Regex for the opening tag of the <section> that carries CSS class `c` (works before and after `cls` added classes). */
export const sec = (c) => new RegExp(`<section class="[^"]*\\b${c}\\b[^"]*"[^>]*>`);
/** Same, for a section identified by its aria-labelledby id. */
export const secId = (id) => new RegExp(`<section class="[^"]*"[^>]*aria-labelledby="${id}"[^>]*>`);

/** Number the chapter heads ("§ 01"). CSS counters cannot cross the style containment of the chapters, so the number is data. */
export function number(html) {
  let n = 0;
  return html.replace(/<section [^>]*>[\s\S]*?<\/section>/g, (block) => {
    const open = block.slice(0, block.indexOf('>'));
    if (!/\bhb-ch\b/.test(open) || !block.includes('<div class="block__head">')) return block;
    return block.replace('<div class="block__head">', `<div class="block__head" data-n="${String(++n).padStart(2, '0')}">`);
  });
}

/** Add classes to the opening tag matched by `re`. */
export const cls = (h, re, add) => h.replace(re, (tag) => tag.replace(/class="([^"]*)"/, (m, c) => `class="${c} ${add}"`));

/** Insert markup right after the opening tag matched by `re`. */
export const after = (h, re, html) => h.replace(re, (tag) => tag + html);

/** Insert markup right before the closing tag `close` that follows the opening tag matched by `re`. */
export const before = (h, re, close, html) => {
  const m = re.exec(h);
  if (!m) return h;
  const i = h.indexOf(close, m.index + m[0].length);
  return i < 0 ? h : h.slice(0, i) + html + h.slice(i);
};
