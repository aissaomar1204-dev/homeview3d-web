/* ═══════════════════════════════════════════════════════════════
   Demo case: upper floor of a villa on the Costa del Sol.
   ANONYMISED: never publish the original plan, the listing, the
   address or the agency. Measurements are estimates from plan scale.
   Room coordinates are plan metres (x → east, y → north); the glTF
   position of a room is (x, height, -y). Areas are approximate (≈).
   ═══════════════════════════════════════════════════════════════ */

export const villa = {
  id: 'villa-costa-del-sol',
  name: { es: 'Villa en la Costa del Sol', en: 'Costa del Sol villa' },
  scope: { es: 'planta alta', en: 'upper floor' },

  // Headline facts (citable, from the real project).
  specs: {
    interiorM2: 75,
    terracesM2: 28,
    footprint: { w: 9.1, d: 14.1 },   // metres, as modelled
    rooms: 12,
    bedrooms: 3,
    bathrooms: { es: '2 (suite con bañera y ducha)', en: '2 (en-suite with tub and shower)' },
    textures: 39,                     // procedural PBR textures created for this model
    triangles: 178704,
    materials: 82,                    // unique material names in the web model
    renders: 9,                       // Cycles stills produced for the site
    renderMinutes: 7,                 // total Cycles time for the 9 stills on an RTX 4060
    workSessions: 1,                  // modelled, textured and exported in a single work session
    input: { es: 'un único plano 2D, sin fotos del interior ni cotas', en: 'a single 2D floor plan, with no interior photos and no dimensions' },
    cutHeight: 1.15,                  // metres, "maqueta" cut
    wallHeight: 2.6,                  // metres, full walls
  },

  // Delivery files (sizes in bytes, measured). Paths are public URLs (unhashed, see _headers).
  files: {
    glb:        { url: '/models/villa.glb',                bytes: 3132584,  label: { es: 'Modelo web (GLB, Meshopt + WebP)', en: 'Web model (GLB, Meshopt + WebP)' } },
    glbAr:      { url: '/models/villa-ar.glb',             bytes: 7925864,  label: { es: 'Android, tamaño real (GLB)', en: 'Android, real size (GLB)' } },
    glbArMesa:  { url: '/models/villa-ar-maqueta.glb',     bytes: 6952076,  label: { es: 'Android, maqueta 1:20 (GLB)', en: 'Android, 1:20 tabletop model (GLB)' } },
    usdzMesa:   { url: '/models/villa_maqueta_1a20.usdz',  bytes: 5255570,  label: { es: 'iPhone/iPad, maqueta 1:20 (USDZ)', en: 'iPhone/iPad, 1:20 tabletop model (USDZ)' } },
    usdzReal:   { url: '/models/villa_tamano_real.usdz',   bytes: 8239444,  label: { es: 'iPhone/iPad, tamaño real (USDZ)', en: 'iPhone/iPad, real size (USDZ)' } },
  },

  // <model-viewer> defaults (tuned in the original viewer).
  viewer: {
    cameraOrbit: '-32deg 50deg 108%',
    cameraTarget: '4.55m 0.3m -7.02m',     // footprint centre (x = w/2, z = -d/2): the villa sits centred, shadow included (V-01)
    topOrbit: '0deg 0deg 26m',
    topTarget: '4.55m 0m -7.02m',
    minCameraOrbit: 'auto 0deg 2m',
    maxCameraOrbit: 'auto 86deg auto',
    fieldOfView: '30deg',
    exposure: 1.05,
    toneMapping: 'agx',
    shadowIntensity: 0.9,
    shadowSoftness: 0.7,
    cutMaterialSuffix: '_Alto',       // materials above 1.15 m; names repeat, filter with endsWith
    labelHeight: { cut: 1.35, full: 2.85 },
    meshoptDecoder: '/lib/model-viewer/meshopt_decoder.js',
    modelViewer: '/lib/model-viewer/model-viewer.min.js',
  },

  rooms: [
    { id: 'salon', area: 11.5, x: 4.83, y: 6.63, w: 3.3, h: 3.6,
      es: { name: 'Salón', text: 'Sofá rinconera, alfombra, mesa de mármol y televisión. Tres hojas correderas abren a la terraza.' },
      en: { name: 'Living room', text: 'Corner sofa, rug, marble coffee table and TV. Three sliding panels open onto the terrace.' } },
    { id: 'terraza', area: 23.0, x: 1.6, y: 4.3, w: 2.8, h: 8.2, ext: true,
      es: { name: 'Terraza principal', text: 'Suelo de barro cocido, dos tumbonas, sofá exterior y un olivo en maceta.' },
      en: { name: 'Main terrace', text: 'Terracotta floor, two sun loungers, an outdoor sofa and a potted olive tree.' } },
    { id: 'principal', area: 16.2, x: 5.9, y: 3.33, w: 5.7, h: 2.9,
      es: { name: 'Dormitorio principal', text: 'Cama de 180 con cabecero de obra, butaca, salida a la terraza y zona de vestidor tras el tabique curvo.' },
      en: { name: 'Main bedroom', text: '180 cm bed with a built-in headboard, armchair, terrace access and a dressing area behind the curved partition.' } },
    { id: 'suite', area: 8.2, x: 5.6, y: 0.95, w: 5.7, h: 1.6,
      es: { name: 'Baño en suite', text: 'Bañera exenta redonda, porcelánico negro, terrazo, lavabo sobre encimera y ducha de lluvia en verde oliva.' },
      en: { name: 'En-suite bathroom', text: 'Round freestanding tub, black porcelain tiles, terrazzo, countertop basin and an olive-green rain shower.' } },
    { id: 'doble', area: 8.1, x: 4.8, y: 11.05, w: 2.8, h: 2.9,
      es: { name: 'Dormitorio doble', text: 'Cama de 160 con funda gris, cojines botánicos y puerta corredera a la terraza de césped.' },
      en: { name: 'Double bedroom', text: '160 cm bed with a grey cover, botanical cushions and a sliding door to the lawn terrace.' } },
    { id: 'doscamas', area: 8.1, x: 1.75, y: 9.9, w: 3.1, h: 2.6,
      es: { name: 'Dormitorio de dos camas', text: 'Dos camas de 90 con mantas chevron en blanco y negro, mesilla compartida y ventana.' },
      en: { name: 'Twin bedroom', text: 'Two 90 cm beds with black and white chevron throws, a shared bedside table and a window.' } },
    { id: 'vestidor', area: 3.1, x: 1.5, y: 11.9, w: 2.6, h: 1.2,
      es: { name: 'Vestidor', text: 'Armario lacado de cuatro puertas, con acceso desde el dormitorio de dos camas.' },
      en: { name: 'Walk-in wardrobe', text: 'Four-door lacquered wardrobe, reached from the twin bedroom.' } },
    { id: 'bano2', area: 5.7, x: 7.92, y: 11.05, w: 1.95, h: 2.9,
      es: { name: 'Baño completo', text: 'Bañera, mueble de madera con lavabo, inodoro y bidé suspendidos, y taburete.' },
      en: { name: 'Family bathroom', text: 'Bathtub, wooden vanity with basin, wall-hung toilet and bidet, and a stool.' } },
    { id: 'terraza2', area: 5.2, x: 6.65, y: 13.28, w: 4.5, h: 1.2, ext: true,
      es: { name: 'Terraza del dormitorio', text: 'Césped artificial, dos sillas Acapulco y escalera de caracol hacia la cubierta.' },
      en: { name: 'Bedroom terrace', text: 'Artificial lawn, two Acapulco chairs and a spiral staircase up to the roof.' } },
    { id: 'pasillo', area: 9.8, x: 7.2, y: 7.3, w: 1.3, h: 4.6,
      es: { name: 'Distribuidor', text: 'Pasillo en L con aparador, cuadro y armario de ropa blanca con estantes.' },
      en: { name: 'Hallway', text: 'L-shaped hallway with a sideboard, a painting and a shelved linen cupboard.' } },
    { id: 'escalera', area: 3.4, x: 8.42, y: 6.3, w: 0.95, h: 3.6,
      es: { name: 'Escalera a planta baja', text: 'Escalera de madera oscura que baja a la planta inferior desde el rellano.' },
      en: { name: 'Stairs to ground floor', text: 'Dark timber staircase leading down to the lower floor from the landing.' } },
    { id: 'lavadero', area: 0.9, x: 8.42, y: 9.0, w: 0.95, h: 0.95,
      es: { name: 'Lavadero', text: 'Lavadora, encimera y balda con cesto.' },
      en: { name: 'Laundry', text: 'Washing machine, worktop and a shelf with a basket.' } },
  ],

  // Rendered stills (keys = image manifest names, see build/generated/images.json).
  renders: [
    { image: 'villa_maqueta_iso',       es: 'Maqueta seccionada a 1,15 m, vista aérea en tres cuartos', en: 'Cut-away model at 1.15 m, three-quarter aerial view' },
    { image: 'villa_planta_cenital',    es: 'Planta cenital a color, cámara ortográfica', en: 'Colour top-down plan, orthographic camera' },
    { image: 'villa_plano_lineas',      es: 'Planta 2D redibujada desde el modelo 3D', en: '2D plan redrawn from the 3D model' },
    { image: 'villa_salon_dormitorio',  es: 'Salón y dormitorio principal', en: 'Living room and main bedroom' },
    { image: 'villa_dormitorios',       es: 'Ala de dormitorios y baño completo', en: 'Bedroom wing and family bathroom' },
    { image: 'villa_bano_suite',        es: 'Baño en suite con bañera exenta', en: 'En-suite bathroom with freestanding tub' },
    { image: 'villa_terraza',           es: 'Terraza principal con tumbonas y olivo', en: 'Main terrace with sun loungers and an olive tree' },
    { image: 'villa_muros_completos',   es: 'Muros completos a 2,60 m', en: 'Full-height walls at 2.60 m' },
  ],

  // Honest limits (shown on the case page and used in FAQs).
  notice: {
    es: 'Caso anonimizado. Partimos de la planta publicada de una villa real, que hemos redibujado y no reproducimos. El plano no traía cotas: las superficies son estimaciones a escala (≈) y parte del mobiliario se interpretó. En un encargo real trabajamos con el plano acotado del cliente.',
    en: 'Anonymised case. We started from the published floor plan of a real villa, which we redrew and do not reproduce. The plan had no dimensions, so areas are scale estimates (≈) and some furniture was interpreted. On a real project we work from the client\'s dimensioned plan.',
  },
};

export const roomTotalM2 = () => Math.round(villa.rooms.reduce((s, r) => s + r.area, 0) * 10) / 10;
