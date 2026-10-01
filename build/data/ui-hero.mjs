/* ═══════════════════════════════════════════════════════════════
   Home hero strings (ES / EN). Owner: HERO.
   Read directly by build/lib/hero.mjs (no merge into ui.mjs).
   Rules: tú register, British English, sentence case, no em/en dashes, «» in ES and “” in EN,
   no exclamation marks. Numbers never live here: footprint, areas and heights come from
   build/data/villa.mjs and build/generated/hero.json. Phase names come from hero.json (phases[].es / .en).
   ═══════════════════════════════════════════════════════════════ */

export const uiHero = {
  es: {
    railLabel: 'Fases del modelo',
    replay: 'Ver de nuevo',
    title: {
      project: 'Obra',
      projectValue: 'Villa, Costa del Sol',
      floor: 'Planta',
      floorValue: 'Alta, ≈ {interior} m² + {terraces} m²',
      source: 'Origen',
      sourceValue: 'Render 3D desde el plano 2D',
    },
    unit: 'm',
    // Phone scroll intro (hero.js): one large line per phase, the scroll hint and the skip link.
    scrub: ['Tu plano.', 'Muros a escala.', 'Amueblado.', 'Listo para vender.'],
    hint: 'Desliza',
    skip: 'Saltar',
  },
  en: {
    railLabel: 'Model stages',
    replay: 'Replay',
    title: {
      project: 'Project',
      projectValue: 'Villa, Costa del Sol',
      floor: 'Floor',
      floorValue: 'Upper, ≈ {interior} m² + {terraces} m²',
      source: 'Source',
      sourceValue: '3D render from the 2D plan',
    },
    unit: 'm',
    scrub: ['Your plan.', 'Walls, to scale.', 'Furnished.', 'Ready to sell.'],
    hint: 'Scroll',
    skip: 'Skip',
  },
};
