/* ═══════════════════════════════════════════════════════════════
   Prices, packs and commercial conditions. SINGLE SOURCE OF TRUTH:
   pages, FAQs, schema Offers, llms.txt and the calculator all read
   from here (content uses {{price:<id>}} / {{delivery:<id>}} tokens).

   STATUS: PROPOSAL pending client confirmation (confirmed: false).
   Anchors from docs/research/01-competidores.md and 02-keywords-es.md:
   low-cost 3D floor plan ≈ 120 €/floor, market plano 3D 100-800 €,
   interior render 200-450 €, AI photo packs 129-390 € (no real 3D),
   interactive/AR platforms from ≈ 2,700 $. All prices exclude VAT (IVA 21 %).
   ═══════════════════════════════════════════════════════════════ */

export const pricing = {
  confirmed: false,
  currency: 'EUR',
  vatRate: 0.21,
  vatIncluded: false,
  validFrom: '2026-09-28',
  priceValidUntil: '2027-12-31',

  packs: [
    {
      id: 'plano3d',
      name: { es: 'Plano 3D', en: '3D floor plan' },
      summary: {
        es: 'Planta cenital a color y vista isométrica amueblada, generadas desde un modelo 3D real.',
        en: 'Colour top-down plan and furnished isometric view, generated from a real 3D model.',
      },
      price: 149,                          // up to 150 m² per floor
      tiers: [ { maxM2: 150, price: 149 }, { maxM2: 300, price: 219 } ],
      unit: { es: 'por planta', en: 'per floor' },
      deliveryDays: { min: 2, max: 3 },    // working days
      revisions: 1,
      includes: {
        es: ['Planta cenital a color en 4K', 'Vista isométrica amueblada en 4K', 'Planta 2D redibujada en limpio', '1 ronda de cambios'],
        en: ['4K colour top-down plan', '4K furnished isometric view', 'Clean redrawn 2D plan', '1 round of changes'],
      },
      services: ['servicio-plano'],
    },
    {
      id: 'maqueta',
      name: { es: 'Maqueta 3D completa', en: 'Complete 3D model' },
      summary: {
        es: 'El modelo 3D amueblado con renders, visor web para tu anuncio y realidad aumentada sin app.',
        en: 'The furnished 3D model with renders, a web viewer for your listing and app-free augmented reality.',
      },
      price: 490,
      tiers: [ { maxM2: 150, price: 490 }, { maxM2: 300, price: 690 } ],
      unit: { es: 'por vivienda', en: 'per home' },
      deliveryDays: { min: 3, max: 5 },
      revisions: 2,
      featured: true,
      includes: {
        es: ['Modelo 3D amueblado con materiales a medida', '6 renders fotorrealistas en 4K', 'Planta cenital a color y planta 2D redibujada', 'Visor 3D web con estancias, recorrido y modo maqueta', 'Realidad aumentada en iPhone y Android: maqueta 1:20 y tamaño real', 'Alojamiento del visor 12 meses', '2 rondas de cambios'],
        en: ['Furnished 3D model with custom materials', '6 photorealistic 4K renders', 'Colour top-down plan and redrawn 2D plan', 'Web 3D viewer with rooms, guided tour and cut-away mode', 'Augmented reality on iPhone and Android: 1:20 tabletop and real size', '12 months of viewer hosting', '2 rounds of changes'],
      },
      services: ['servicio-plano', 'servicio-renders', 'servicio-tour', 'servicio-ar'],
    },
    {
      id: 'promocion',
      name: { es: 'Promoción de obra nueva', en: 'New-build development' },
      summary: {
        es: 'Varias tipologías de una promoción sobre plano, con renders, visor y AR para la sala de ventas.',
        en: 'Several unit types of an off-plan development, with renders, viewer and AR for the sales suite.',
      },
      price: 1490,                         // "desde": up to 3 unit types
      from: true,
      unit: { es: 'hasta 3 tipologías', en: 'up to 3 unit types' },
      deliveryDays: { min: 7, max: 10 },
      revisions: 2,
      includes: {
        es: ['3 tipologías modeladas y amuebladas', '12 renders fotorrealistas en 4K', 'Visor 3D con selector de tipología', 'Realidad aumentada para ferias y oficina de ventas', 'Tipología adicional: 390 €'],
        en: ['3 unit types modelled and furnished', '12 photorealistic 4K renders', '3D viewer with a unit-type selector', 'Augmented reality for fairs and the sales suite', 'Extra unit type: €390'],
      },
      services: ['servicio-plano', 'servicio-renders', 'servicio-tour', 'servicio-ar'],
    },
  ],

  extras: [
    { id: 'render',   price: 90,  name: { es: 'Render adicional en 4K', en: 'Extra 4K render' }, unit: { es: 'por imagen', en: 'per image' } },
    { id: 'staging',  price: 60,  name: { es: 'Home staging virtual sobre el modelo', en: 'Virtual staging on the model' }, unit: { es: 'por estancia', en: 'per room' } },
    { id: 'tipologia', price: 390, name: { es: 'Tipología adicional (promociones)', en: 'Extra unit type (developments)' }, unit: { es: 'por tipología', en: 'per unit type' } },
    { id: 'urgente',  pct: 30,    name: { es: 'Entrega urgente en 48 h', en: 'Rush delivery in 48 h' }, unit: { es: 'sobre el total', en: 'on the total' } },
    { id: 'hosting',  price: 49,  name: { es: 'Renovación del alojamiento del visor', en: 'Viewer hosting renewal' }, unit: { es: 'por vivienda y año', en: 'per home per year' } },
  ],

  // Volume pack for agencies (Maqueta 3D completa).
  volume: {
    id: 'pack5',
    packId: 'maqueta',
    units: 5,
    price: 2090,                            // 418 €/unit, about 15 % off
    name: { es: 'Pack cartera: 5 maquetas 3D completas', en: 'Portfolio pack: 5 complete 3D models' },
    note: { es: 'Para usar en 6 meses. Viviendas de hasta 150 m².', en: 'To be used within 6 months. Homes up to 150 m².' },
  },

  // Calculator configuration (Maqueta 3D completa by units, with volume steps).
  calculator: {
    packId: 'maqueta',
    minUnits: 1,
    maxUnits: 20,
    steps: [ { from: 1, unit: 490 }, { from: 5, unit: 418 }, { from: 10, unit: 390 } ],
  },

  // Risk reversal (PROPOSAL, confirm with the client before launch).
  guarantees: {
    es: [
      'Demo gratis: modelamos en 3D una estancia de tu plano y te la enviamos con realidad aumentada.',
      'Dos rondas de cambios incluidas en la maqueta completa.',
      'Pagas cuando recibes el trabajo terminado.',
    ],
    en: [
      'Free demo: we model one room of your plan in 3D and send it to you with augmented reality.',
      'Two rounds of changes included with the complete 3D model.',
      'You pay when you receive the finished work.',
    ],
  },
};

/** Format a price for a language: ES "1.490 €", EN "€1,490". */
export function formatPrice(n, lang) {
  const s = new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', { maximumFractionDigits: 0, useGrouping: true }).format(n);
  // es-ES does not group 4-digit numbers by default; force the thousands dot for consistency.
  const grouped = lang === 'es' && n >= 1000 && n < 10000 ? `${String(n).slice(0, -3)}.${String(n).slice(-3)}` : s;
  return lang === 'es' ? `${grouped} €` : `€${grouped}`;
}

export const packById = (id) => pricing.packs.find((p) => p.id === id);
