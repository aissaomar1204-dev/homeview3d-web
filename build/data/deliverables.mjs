/* The 5 deliverables (home bento, service hub). `page` = content page id. */

export const deliverables = [
  {
    id: 'maqueta', page: 'servicio-plano', image: 'villa_maqueta_iso', sheet: { es: ['Modelo 3D', 'Esc. 1:20'], en: ['3D model', 'Scale 1:20'] },
    es: { title: 'Maqueta 3D desde el plano', body: 'Modelo 3D amueblado y a escala a partir de un plano 2D, aunque no existan fotos. Ideal para obra nueva y viviendas vacías.', formats: 'GLB · USDZ · BLEND' },
    en: { title: '3D model from the floor plan', body: 'A furnished, to-scale 3D model built from a 2D plan, even with no photos. Ideal for new builds and empty homes.', formats: 'GLB · USDZ · BLEND' },
  },
  {
    id: 'renders', page: 'servicio-renders', image: 'villa_interior_terraza', sheet: { es: ['Render 4K', 'Luz natural'], en: ['4K render', 'Daylight'] },
    es: { title: 'Renders fotorrealistas', body: 'Imágenes 4K con luz natural calculada para anuncios, portales y dosieres de venta.', formats: 'PNG · JPG · 4K' },
    en: { title: 'Photorealistic renders', body: '4K stills with physically based daylight for listings, portals and sales brochures.', formats: 'PNG · JPG · 4K' },
  },
  {
    id: 'visor', page: 'servicio-tour', image: 'villa_planta_cenital', sheet: { es: ['Visor web', '{{villa:rooms}} estancias'], en: ['Web viewer', '{{villa:rooms}} rooms'] },
    es: { title: 'Visor 3D para tu anuncio', body: 'Un enlace o un iframe que se gira, se acerca y recorre la vivienda estancia a estancia, con modo maqueta.', formats: 'Enlace · iframe' },
    en: { title: '3D viewer for your listing', body: 'A link or an iframe that rotates, zooms and tours the home room by room, with a cut-away mode.', formats: 'Link · iframe' },
  },
  {
    id: 'ar', page: 'servicio-ar', image: 'villa_terraza', sheet: { es: ['AR sin app', 'iOS y Android'], en: ['App-free AR', 'iOS and Android'] },
    es: { title: 'Realidad aumentada sin app', body: 'Tu comprador coloca la vivienda sobre su mesa o a tamaño real desde el móvil, con un toque.', formats: 'iPhone · iPad · Android' },
    en: { title: 'App-free augmented reality', body: 'Buyers place the home on their table or at real size from their phone, with one tap.', formats: 'iPhone · iPad · Android' },
  },
  {
    id: 'staging', page: 'servicio-staging', image: 'villa_dormitorios', sheet: { es: ['Home staging', 'Por estancia'], en: ['Staging', 'Per room'] },
    es: { title: 'Home staging virtual', body: 'Mobiliario y materiales a elección sobre el mismo modelo, coherentes en cada render, en el visor y en AR.', formats: 'Por estancia' },
    en: { title: 'Virtual home staging', body: 'Furniture and finishes of your choice on the same model, consistent across every render, the viewer and AR.', formats: 'Per room' },
  },
];

// Coming soon (a section inside /servicios/, never standalone pages until live).
export const comingSoon = [
  { id: 'video-ia', es: { title: 'Vídeos cinematográficos con IA', body: 'Recorridos en vídeo generados a partir de los renders, etiquetados como contenido generado con IA.' }, en: { title: 'AI cinematic videos', body: 'Video walkthroughs generated from the renders, labelled as AI-generated content.' } },
  { id: 'vr-360', es: { title: 'Tours de realidad virtual 360°', body: 'Panorámicas 360° para gafas de realidad virtual y para la web.' }, en: { title: '360° virtual reality tours', body: '360° panoramas for VR headsets and the web.' } },
];
