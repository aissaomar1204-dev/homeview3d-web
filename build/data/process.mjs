/* The 5-step process (home "Cómo lo hacemos", /como-funciona/, HowTo schema).
   Times are working days for the "Maqueta 3D completa" pack. */

export const process = {
  totalDays: { min: 3, max: 5 },
  steps: [
    {
      id: 'plano',
      es: { title: 'Nos envías el plano', body: 'Un PDF, una imagen o el enlace del anuncio. Si tienes fotos o cotas, mejor, pero no son imprescindibles: estimamos las medidas con la escala del plano.', time: 'Día 0' },
      en: { title: 'You send us the plan', body: 'A PDF, an image or the listing link. Photos or dimensions help but are not required: we estimate measurements from the plan\'s scale.', time: 'Day 0' },
    },
    {
      id: 'modelado',
      es: { title: 'Modelamos a escala', body: 'Levantamos muros, huecos, puertas y ventanas con scripts de Python en Blender. Mover un tabique o cambiar un suelo se reconstruye en minutos.', time: 'Días 1 y 2' },
      en: { title: 'We model it to scale', body: 'Walls, openings, doors and windows are built with Python scripts in Blender. Moving a partition or changing a floor rebuilds in minutes.', time: 'Days 1 and 2' },
    },
    {
      id: 'materiales',
      es: { title: 'Vestimos la vivienda', body: 'Amueblamos cada estancia y creamos materiales PBR con relieve a medida, respetando los colores del plano. Sin bancos de imágenes ni problemas de licencias.', time: 'Días 2 y 3' },
      en: { title: 'We furnish and finish it', body: 'Every room is furnished and custom PBR materials with relief are created to match the plan\'s colours. No stock libraries, no licensing issues.', time: 'Days 2 and 3' },
    },
    {
      id: 'revision',
      es: { title: 'Revisas y ajustamos', body: 'Te enviamos el visor en un enlace privado. Pides cambios de mobiliario, materiales o distribución y los aplicamos en dos rondas.', time: 'Día 4' },
      en: { title: 'You review, we adjust', body: 'You get the viewer on a private link. Ask for changes to furniture, materials or layout and we apply them in two rounds.', time: 'Day 4' },
    },
    {
      id: 'entrega',
      es: { title: 'Entregamos todo listo para publicar', body: 'Renders en 4K, visor web para tu anuncio y archivos de realidad aumentada para iPhone y Android, con el código para incrustarlo en tu web.', time: 'Día 5' },
      en: { title: 'We deliver, ready to publish', body: '4K renders, a web viewer for your listing and augmented reality files for iPhone and Android, with the code to embed it on your site.', time: 'Day 5' },
    },
  ],
  // What we need from the client (checklist).
  needs: {
    es: ['Plano de la vivienda (PDF, JPG o PNG; DWG si lo tienes)', 'Superficie aproximada o una cota de referencia', 'Estilo de mobiliario deseado (o lo proponemos nosotros)', 'Fotos de acabados si la vivienda ya existe (opcional)'],
    en: ['Floor plan of the home (PDF, JPG or PNG; DWG if you have it)', 'Approximate floor area or one reference dimension', 'Preferred furniture style (or we propose one)', 'Photos of finishes if the home already exists (optional)'],
  },
};
