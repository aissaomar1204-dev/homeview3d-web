/* ═══════════════════════════════════════════════════════════════
   Per-language formats shared by the engine (ES / EN / DE). Owner: ENGINE.
   One place for what used to be «es ? … : …» ternaries: number locale, percentages, turnaround and
   rounds of changes, language names. Spanish and German write «30 %» with a space, English «30%».
   ═══════════════════════════════════════════════════════════════ */

const NBSP = ' ';

export const LOCALES = { es: 'es-ES', en: 'en-GB', de: 'de-DE' };
/** BCP 47 tag for Intl (numbers, collation). */
export const numLocale = (lang) => LOCALES[lang] || 'en-GB';

/** Each language named in itself (language switch, Markdown mirrors). */
export const LANG_NAMES = { es: 'Español', en: 'English', de: 'Deutsch' };

export const pctText = (n, lang, sep = NBSP) => (lang === 'en' ? `${n}%` : `${n}${sep}%`);

/** `dative` only changes German («in 3 bis 5 Werktagen»): content writes {{delivery:<pack>:dat}} after «in», «nach»… */
export function dayRange(min, max, lang, dative = false) {
  if (lang === 'es') return min === max ? `${min} días laborables` : `${min} a ${max} días laborables`;
  if (lang === 'de') { const w = dative ? 'Werktagen' : 'Werktage'; return min === max ? `${min} ${w}` : `${min} bis ${max} ${w}`; }
  return min === max ? `${min} working days` : `${min} to ${max} working days`;
}

export function revisionsText(n, lang) {
  if (lang === 'es') return `${n} ${n === 1 ? 'ronda' : 'rondas'} de cambios`;
  if (lang === 'de') return `${n} ${n === 1 ? 'Korrekturrunde' : 'Korrekturrunden'}`;
  return `${n} ${n === 1 ? 'round' : 'rounds'} of changes`;
}
