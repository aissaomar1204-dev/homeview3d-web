const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
export const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return ((x + .05) / (y + .05)).toFixed(2); };
if ((process.argv[1] || '').endsWith('contrast.mjs')) {
  const pairs = [
    ['graphite text', '#E9ECEF', '#15181D'], ['graphite ink-2', '#B4BBC3', '#15181D'], ['graphite ink-3', '#8F97A1', '#15181D'],
    ['graphite ink-3 on raised', '#8F97A1', '#1C2026'], ['ink-2 on raised', '#B4BBC3', '#1C2026'],
    ['accent-lit on graphite', '#A2B3EA', '#15181D'], ['accent-lit on raised', '#A2B3EA', '#1C2026'],
    ['ink-3 on concrete', '#5F6771', '#DFE3E8'], ['ink-2 on concrete', '#434A52', '#DFE3E8'], ['ink-3 on concrete-2', '#5F6771', '#D0D5DB'], ['ink-2 on concrete-2','#434A52','#D0D5DB'],
    ['ink on concrete-2', '#14171B', '#D0D5DB'], ['accent on concrete', '#2D4596', '#DFE3E8'], ['accent on concrete-2', '#2D4596', '#D0D5DB'],
    ['on-accent on lit', '#0F1215', '#A2B3EA'], ['deep footer ink-3', '#8F97A1', '#0E1013'], ['deep footer ink-2', '#B4BBC3', '#0E1013'],
    ['ink-3 on paper', '#5F6771', '#F4F5F6'], ['ink-3 on white', '#5F6771', '#FCFCFD'],
  ];
  for (const [n, a, b] of pairs) console.log(cr(a, b).padStart(6), n, a, b);
}
