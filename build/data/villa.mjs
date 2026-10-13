/* ═══════════════════════════════════════════════════════════════
   Demo case: upper floor of a villa on the Costa del Sol.
   ANONYMISED: never publish the original plan, the listing, the
   address or the agency. Measurements are estimates from plan scale.
   Room coordinates are plan metres (x → east, y → north); the glTF
   position of a room is (x, height, -y). Areas are approximate (≈).
   ═══════════════════════════════════════════════════════════════ */

export const villa = {
  id: 'villa-costa-del-sol',
  name: { es: 'Villa en la Costa del Sol', en: 'Costa del Sol villa', de: 'Villa an der Costa del Sol' },
  scope: { es: 'planta alta', en: 'upper floor', de: 'Obergeschoss' },

  // Headline facts (citable, from the real project).
  specs: {
    interiorM2: 75,
    terracesM2: 28,
    footprint: { w: 9.1, d: 14.1 },   // metres, as modelled
    rooms: 12,
    bedrooms: 3,
    bathrooms: { es: '2 (suite con bañera y ducha)', en: '2 (en-suite with tub and shower)', de: '2 (En-suite mit Wanne und Dusche)' },
    textures: 39,                     // procedural PBR textures created for this model
    triangles: 178704,
    materials: 82,                    // unique material names in the web model
    renders: 13,                      // Cycles stills for the site: 6 aerial views, 4 eye-level, 2 plans, og_image
    renderMinutes: 21,                // total Cycles time for the 13 stills on an RTX 4060 (6.9 + 14.4 min, _timings.json)
    workSessions: 1,                  // modelled, textured and exported in a single work session
    input: { es: 'un único plano 2D, sin fotos del interior ni cotas', en: 'a single 2D floor plan, with no interior photos and no dimensions', de: 'einem einzigen 2D-Grundriss, ohne Innenfotos und ohne Maße' },
    cutHeight: 1.15,                  // metres, "maqueta" cut
    wallHeight: 2.6,                  // metres, full walls
  },

  // Delivery files (sizes in bytes, measured). Paths are public URLs (unhashed, see _headers).
  files: {
    glb:        { url: '/models/villa.glb',                bytes: 3132584,  label: { es: 'Modelo web (GLB, Meshopt + WebP)', en: 'Web model (GLB, Meshopt + WebP)', de: 'Web-Modell (GLB, Meshopt + WebP)' } },
    glbAr:      { url: '/models/villa-ar.glb',             bytes: 7925864,  label: { es: 'Android, tamaño real (GLB)', en: 'Android, real size (GLB)', de: 'Android, Originalgröße (GLB)' } },
    glbArMesa:  { url: '/models/villa-ar-maqueta.glb',     bytes: 6952076,  label: { es: 'Android, maqueta 1:20 (GLB)', en: 'Android, 1:20 tabletop model (GLB)', de: 'Android, Tischmodell 1:20 (GLB)' } },
    usdzMesa:   { url: '/models/villa_maqueta_1a20.usdz',  bytes: 5255570,  label: { es: 'iPhone/iPad, maqueta 1:20 (USDZ)', en: 'iPhone/iPad, 1:20 tabletop model (USDZ)', de: 'iPhone/iPad, Tischmodell 1:20 (USDZ)' } },
    usdzReal:   { url: '/models/villa_tamano_real.usdz',   bytes: 8239444,  label: { es: 'iPhone/iPad, tamaño real (USDZ)', en: 'iPhone/iPad, real size (USDZ)', de: 'iPhone/iPad, Originalgröße (USDZ)' } },
  },

  // <model-viewer> defaults (tuned in the original viewer).
  viewer: {
    // V-01: model + contact shadow centred on every stage, measured on model-viewer frames (alpha bbox):
    // margins ≥ 13 % top/bottom at 16:9 and 16:11, ≥ 21 % left/right at 16:11, 8 % left/right at 4:5 (the tightest).
    // The target sits 0.4 m east, 0.9 m south and 0.66 m below the footprint centre (4.55m 0.3m -7.02m), because the
    // near (south-west) corner projects larger; the % radius is relative to model-viewer's ideal distance for this
    // target (96 % = 33.7 m). Posters (villa_viewer_poster*, source/villa3d/blender/capture/) are taken at exactly this camera.
    cameraOrbit: '-32deg 50deg 96%',
    cameraTarget: '4.99m -0.36m -6.09m',
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
      en: { name: 'Living room', text: 'Corner sofa, rug, marble coffee table and TV. Three sliding panels open onto the terrace.' }, de: { name: 'Wohnzimmer', text: 'Ecksofa, Teppich, Couchtisch aus Marmor und Fernseher. Drei Schiebetüren öffnen sich zur Terrasse.' } },
    { id: 'terraza', area: 23.0, x: 1.6, y: 4.3, w: 2.8, h: 8.2, ext: true,
      es: { name: 'Terraza principal', text: 'Suelo de barro cocido, dos tumbonas, sofá exterior y un olivo en maceta.' },
      en: { name: 'Main terrace', text: 'Terracotta floor, two sun loungers, an outdoor sofa and a potted olive tree.' }, de: { name: 'Hauptterrasse', text: 'Terrakottaboden, zwei Sonnenliegen, ein Outdoor-Sofa und ein Olivenbaum im Topf.' } },
    { id: 'principal', area: 16.2, x: 5.9, y: 3.33, w: 5.7, h: 2.9,
      es: { name: 'Dormitorio principal', text: 'Cama de 180 con cabecero de obra, butaca, salida a la terraza y zona de vestidor tras el tabique curvo.' },
      en: { name: 'Main bedroom', text: '180 cm bed with a built-in headboard, armchair, terrace access and a dressing area behind the curved partition.' }, de: { name: 'Hauptschlafzimmer', text: '180-cm-Bett mit gemauertem Kopfteil, Sessel, Zugang zur Terrasse und Ankleidebereich hinter der geschwungenen Trennwand.' } },
    { id: 'suite', area: 8.2, x: 5.6, y: 0.95, w: 5.7, h: 1.6,
      es: { name: 'Baño en suite', text: 'Bañera exenta redonda, porcelánico negro, terrazo, lavabo sobre encimera y ducha de lluvia en verde oliva.' },
      en: { name: 'En-suite bathroom', text: 'Round freestanding tub, black porcelain tiles, terrazzo, countertop basin and an olive-green rain shower.' }, de: { name: 'En-suite-Bad', text: 'Runde freistehende Wanne, schwarzes Feinsteinzeug, Terrazzo, Aufsatzwaschbecken und eine olivgrüne Regendusche.' } },
    { id: 'doble', area: 8.1, x: 4.8, y: 11.05, w: 2.8, h: 2.9,
      es: { name: 'Dormitorio doble', text: 'Cama de 160 con funda gris, cojines botánicos y puerta corredera a la terraza de césped.' },
      en: { name: 'Double bedroom', text: '160 cm bed with a grey cover, botanical cushions and a sliding door to the lawn terrace.' }, de: { name: 'Doppelzimmer', text: '160-cm-Bett mit grauer Tagesdecke, Kissen mit Pflanzenmotiven und einer Schiebetür zur Rasenterrasse.' } },
    { id: 'doscamas', area: 8.1, x: 1.75, y: 9.9, w: 3.1, h: 2.6,
      es: { name: 'Dormitorio de dos camas', text: 'Dos camas de 90 con mantas chevron en blanco y negro, mesilla compartida y ventana.' },
      en: { name: 'Twin bedroom', text: 'Two 90 cm beds with black and white chevron throws, a shared bedside table and a window.' }, de: { name: 'Zweibettzimmer', text: 'Zwei 90-cm-Betten mit schwarz-weißen Decken im Fischgrätmuster, ein gemeinsamer Nachttisch und ein Fenster.' } },
    { id: 'vestidor', area: 3.1, x: 1.5, y: 11.9, w: 2.6, h: 1.2,
      es: { name: 'Vestidor', text: 'Armario lacado de cuatro puertas, con acceso desde el dormitorio de dos camas.' },
      en: { name: 'Walk-in wardrobe', text: 'Four-door lacquered wardrobe, reached from the twin bedroom.' }, de: { name: 'Ankleidezimmer', text: 'Lackierter viertüriger Kleiderschrank, erreichbar über das Zweibettzimmer.' } },
    { id: 'bano2', area: 5.7, x: 7.92, y: 11.05, w: 1.95, h: 2.9,
      es: { name: 'Baño completo', text: 'Bañera, mueble de madera con lavabo, inodoro y bidé suspendidos, y taburete.' },
      en: { name: 'Family bathroom', text: 'Bathtub, wooden vanity with basin, wall-hung toilet and bidet, and a stool.' }, de: { name: 'Familienbad', text: 'Badewanne, Waschtisch aus Holz mit Becken, wandhängendes WC und Bidet sowie ein Hocker.' } },
    { id: 'terraza2', area: 5.2, x: 6.65, y: 13.28, w: 4.5, h: 1.2, ext: true,
      es: { name: 'Terraza del dormitorio', text: 'Césped artificial, dos sillas Acapulco y escalera de caracol hacia la cubierta.' },
      en: { name: 'Bedroom terrace', text: 'Artificial lawn, two Acapulco chairs and a spiral staircase up to the roof.' }, de: { name: 'Schlafzimmerterrasse', text: 'Kunstrasen, zwei Acapulco-Stühle und eine Wendeltreppe zum Dach.' } },
    { id: 'pasillo', area: 9.8, x: 7.2, y: 7.3, w: 1.3, h: 4.6,
      es: { name: 'Distribuidor', text: 'Pasillo en L con aparador, cuadro y armario de ropa blanca con estantes.' },
      en: { name: 'Hallway', text: 'L-shaped hallway with a sideboard, a painting and a shelved linen cupboard.' }, de: { name: 'Flur', text: 'L-förmiger Flur mit Sideboard, einem Gemälde und einem Wäscheschrank mit Fächern.' } },
    { id: 'escalera', area: 3.4, x: 8.42, y: 6.3, w: 0.95, h: 3.6,
      es: { name: 'Escalera a planta baja', text: 'Escalera de madera oscura que baja a la planta inferior desde el rellano.' },
      en: { name: 'Stairs to ground floor', text: 'Dark timber staircase leading down to the lower floor from the landing.' }, de: { name: 'Treppe zum Erdgeschoss', text: 'Dunkle Holztreppe, die vom Treppenabsatz ins untere Geschoss führt.' } },
    { id: 'lavadero', area: 0.9, x: 8.42, y: 9.0, w: 0.95, h: 0.95,
      es: { name: 'Lavadero', text: 'Lavadora, encimera y balda con cesto.' },
      en: { name: 'Laundry', text: 'Washing machine, worktop and a shelf with a basket.' }, de: { name: 'Hauswirtschaftsraum', text: 'Waschmaschine, Arbeitsfläche und ein Regal mit Korb.' } },
  ],

  // Rendered stills (keys = image manifest names, see build/generated/images.json).
  renders: [
    // Eye-level stills (source/villa3d/blender/villa_interiores.py): camera at 1.60 m, level, full-height walls
    // and a ceiling at 2.60 m. The sky and sea seen through the openings are an illustrative backdrop.
    { image: 'villa_interior_salon',      es: 'Salón de la villa anonimizada hacia la terraza, a la altura de los ojos', en: 'Living room of the anonymised villa towards the terrace, at eye level', de: 'Wohnzimmer der anonymisierten Villa mit Blick zur Terrasse, auf Augenhöhe' },
    { image: 'villa_interior_dormitorio', es: 'Dormitorio principal de la villa anonimizada con luz de media tarde, a la altura de los ojos', en: 'Main bedroom of the anonymised villa in late-afternoon light, at eye level', de: 'Hauptschlafzimmer der anonymisierten Villa im Licht des späten Nachmittags, auf Augenhöhe' },
    { image: 'villa_interior_bano',       es: 'Baño en suite de la villa anonimizada con bañera exenta, a la altura de los ojos', en: 'En-suite bathroom of the anonymised villa with a freestanding tub, at eye level', de: 'En-suite-Bad der anonymisierten Villa mit freistehender Wanne, auf Augenhöhe' },
    { image: 'villa_interior_terraza',    es: 'Terraza principal de la villa anonimizada con sofá exterior y olivo, a la altura de los ojos', en: 'Main terrace of the anonymised villa with an outdoor sofa and an olive tree, at eye level', de: 'Hauptterrasse der anonymisierten Villa mit Outdoor-Sofa und Olivenbaum, auf Augenhöhe' },
    { image: 'villa_maqueta_iso',       es: 'Maqueta seccionada a 1,15 m, vista aérea en tres cuartos', en: 'Cut-away model at 1.15 m, three-quarter aerial view', de: 'Schnittmodell auf 1,15 m, Luftansicht aus drei Vierteln' },
    { image: 'villa_planta_cenital',    es: 'Planta cenital a color, cámara ortográfica', en: 'Colour top-down plan, orthographic camera', de: 'Farbige Draufsicht, orthografische Kamera' },
    { image: 'villa_plano_lineas',      es: 'Planta 2D redibujada desde el modelo 3D', en: '2D plan redrawn from the 3D model', de: 'Aus dem 3D-Modell neu gezeichneter 2D-Grundriss' },
    { image: 'villa_salon_dormitorio',  es: 'Salón y dormitorio principal', en: 'Living room and main bedroom', de: 'Wohnzimmer und Hauptschlafzimmer' },
    { image: 'villa_dormitorios',       es: 'Ala de dormitorios y baño completo', en: 'Bedroom wing and family bathroom', de: 'Schlafzimmerflügel und Familienbad' },
    { image: 'villa_bano_suite',        es: 'Baño en suite con bañera exenta', en: 'En-suite bathroom with freestanding tub', de: 'En-suite-Bad mit freistehender Wanne' },
    { image: 'villa_terraza',           es: 'Terraza principal con tumbonas y olivo', en: 'Main terrace with sun loungers and an olive tree', de: 'Hauptterrasse mit Sonnenliegen und Olivenbaum' },
    { image: 'villa_muros_completos',   es: 'Muros completos a 2,60 m', en: 'Full-height walls at 2.60 m', de: 'Volle Wände auf 2,60 m' },
  ],

  // Honest limits (shown on the case page and used in FAQs).
  notice: {
    es: 'Caso anonimizado. Partimos de la planta publicada de una villa real, que hemos redibujado y no reproducimos. El plano no traía cotas: las superficies son estimaciones a escala (≈) y parte del mobiliario se interpretó. En un encargo real trabajamos con el plano acotado del cliente.',
    en: 'Anonymised case. We started from the published floor plan of a real villa, which we redrew and do not reproduce. The plan had no dimensions, so areas are scale estimates (≈) and some furniture was interpreted. On a real project we work from the client\'s dimensioned plan.',
    de: 'Anonymisierter Fall. Grundlage war der veröffentlichte Grundriss einer realen Villa, den wir neu gezeichnet haben und nicht wiedergeben. Der Grundriss hatte keine Maße, daher sind die Flächen maßstäbliche Schätzungen (≈) und ein Teil der Möbel wurde interpretiert. Bei einem echten Auftrag arbeiten wir mit dem bemaßten Grundriss des Kunden.',
  },
};

export const roomTotalM2 = () => Math.round(villa.rooms.reduce((s, r) => s + r.area, 0) * 10) / 10;
