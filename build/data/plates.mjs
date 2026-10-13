/* ═══════════════════════════════════════════════════════════════
   Render plates for content files (block type `plate`, CONTENT-SCHEMA §3): the honest alt and caption of each render of the
   demo villa, per language, so a page picks images and never rewrites (or inflates) what they show.
   Usage in a content file:  import { plate } from '../data/plates.mjs';  …  plate('es', 'villa_interior_salon')
   Two keys make a diptych (7/5). Every caption states that it is a render (IMG-03).
   ═══════════════════════════════════════════════════════════════ */

const LABEL = { es: 'Render 3D de la villa anonimizada.', en: '3D render of the anonymised villa.', de: '3D-Rendering der anonymisierten Villa.' };

const R = {
  villa_interior_salon: {
    es: ['Salón de la villa a la altura de los ojos, con sofá rinconera y hojas correderas hacia la terraza.', 'Salón hacia la terraza.'],
    en: ['Living room of the villa at eye level, with a corner sofa and sliding panels towards the terrace.', 'Living room towards the terrace.'],
    de: ['Wohnzimmer der Villa auf Augenhöhe, mit Ecksofa und Schiebetüren zur Terrasse.', 'Wohnzimmer mit Blick zur Terrasse.'],
  },
  villa_interior_dormitorio: {
    es: ['Dormitorio principal de la villa con cabecero de obra, mesillas con lámparas y salida a la terraza.', 'Dormitorio principal.'],
    en: ['Main bedroom of the villa with a built-in headboard, bedside lamps and terrace access.', 'Main bedroom.'],
    de: ['Hauptschlafzimmer der Villa mit gemauertem Kopfteil, Nachttischlampen und Zugang zur Terrasse.', 'Hauptschlafzimmer.'],
  },
  villa_interior_bano: {
    es: ['Baño en suite de la villa con bañera exenta redonda y porcelánico negro.', 'Baño en suite.'],
    en: ['En-suite bathroom of the villa with a round freestanding tub and black porcelain tiles.', 'En-suite bathroom.'],
    de: ['En-suite-Bad der Villa mit runder freistehender Wanne und schwarzem Feinsteinzeug.', 'En-suite-Bad.'],
  },
  villa_interior_terraza: {
    es: ['Terraza principal de la villa con sofá exterior y olivo, a la altura de los ojos.', 'Terraza principal.'],
    en: ['Main terrace of the villa with an outdoor sofa and an olive tree, at eye level.', 'Main terrace.'],
    de: ['Hauptterrasse der Villa mit Outdoor-Sofa und Olivenbaum, auf Augenhöhe.', 'Hauptterrasse.'],
  },
  villa_maqueta_iso_opaco: {
    es: ['Maqueta 3D de la villa seccionada a 1,15 m, vista aérea en tres cuartos.', 'Maqueta seccionada a 1,15 m.'],
    en: ['3D model of the villa cut at 1.15 m, three-quarter aerial view.', 'Model cut at 1.15 m.'],
    de: ['3D-Modell der Villa, auf 1,15 m geschnitten, Luftansicht aus drei Vierteln.', 'Modell auf 1,15 m geschnitten.'],
  },
  villa_muros_completos_opaco: {
    es: ['Maqueta 3D de la villa con los muros completos a 2,60 m, vista aérea.', 'Muros completos a 2,60 m.'],
    en: ['3D model of the villa with full-height walls at 2.60 m, aerial view.', 'Full-height walls at 2.60 m.'],
    de: ['3D-Modell der Villa mit vollen Wänden auf 2,60 m, Luftansicht.', 'Volle Wände auf 2,60 m.'],
  },
  villa_terraza_opaco: {
    es: ['Vista aérea de la terraza principal de la villa con tumbonas y olivo.', 'Terraza principal con tumbonas y olivo.'],
    en: ['Aerial view of the main terrace of the villa with sun loungers and an olive tree.', 'Main terrace with sun loungers and an olive tree.'],
    de: ['Luftansicht der Hauptterrasse der Villa mit Sonnenliegen und Olivenbaum.', 'Hauptterrasse mit Sonnenliegen und Olivenbaum.'],
  },
  villa_salon_dormitorio_opaco: {
    es: ['Vista aérea seccionada del salón y el dormitorio principal de la villa.', 'Salón y dormitorio principal.'],
    en: ['Cut-away aerial view of the living room and main bedroom of the villa.', 'Living room and main bedroom.'],
    de: ['Aufgeschnittene Luftansicht von Wohnzimmer und Hauptschlafzimmer der Villa.', 'Wohnzimmer und Hauptschlafzimmer.'],
  },
  villa_dormitorios_opaco: {
    es: ['Vista aérea seccionada del ala de dormitorios y del baño completo de la villa.', 'Ala de dormitorios y baño completo.'],
    en: ['Cut-away aerial view of the bedroom wing and family bathroom of the villa.', 'Bedroom wing and family bathroom.'],
    de: ['Aufgeschnittene Luftansicht des Schlafzimmerflügels und des Familienbads der Villa.', 'Schlafzimmerflügel und Familienbad.'],
  },
  villa_bano_suite_opaco: {
    es: ['Vista aérea seccionada del baño en suite de la villa con bañera exenta.', 'Baño en suite con bañera exenta.'],
    en: ['Cut-away aerial view of the en-suite bathroom of the villa with a freestanding tub.', 'En-suite bathroom with freestanding tub.'],
    de: ['Aufgeschnittene Luftansicht des En-suite-Bads der Villa mit freistehender Wanne.', 'En-suite-Bad mit freistehender Wanne.'],
  },
};

/** plate('es', key) → one full-bleed plate; plate('es', a, b) → a diptych. */
export function plate(lang, ...keys) {
  return {
    type: 'plate',
    images: keys.map((k) => {
      const r = R[k] && R[k][lang];
      if (!r) throw new Error(`plates.mjs: no entry for ${k} (${lang})`);
      return { image: k, alt: `${r[0]} ${LABEL[lang]}`, caption: `${r[1]} ${LABEL[lang]}` };
    }),
  };
}
