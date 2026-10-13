// Home (ES, EN and DE): the developer showroom page. Its HTML lives in build/home/portada.html, portada.en.html and portada.de.html
// (build/templates/home.mjs); this file feeds their <head>, their FAQ (HTML and FAQPage JSON-LD, word for word) and the
// Markdown mirror (index.md, llms.txt). No prices and no market statistics on this page.

export default {
  id: 'home',
  image: 'og_image',
  datePublished: '2026-09-28',
  dateModified: '2026-10-12',

  // ─────────────────────────────────────────────────────────────── ES
  // The Spanish home is the developer showroom page (build/templates/home.mjs + build/home/portada.html). The HTML lives
  // in portada.html; this file feeds its <head>, its FAQ (HTML and FAQPage) and the Markdown mirror (index.md, llms).
  es: {
    title: 'Showroom virtual 3D para promotoras de obra nueva | {{brand}}',
    description: 'Showrooms 3D para promotoras de villas, chalets y adosados en Marbella, Benahavís y Estepona. Tu comprador elige casa y la recorre antes de que exista.',
    h1: 'Showroom virtual',
    lead: 'Para promotoras de obra nueva en la Costa del Sol. Tu promoción, antes de construirla: tu comprador elige su casa, la recorre por plantas y te escribe. En un enlace con tu marca.',
    breadcrumb: 'Inicio',
    facts: [
      ['Para quién', 'Promotoras de obra nueva en la Costa del Sol'],
      ['Qué es', 'Un showroom web con tu marca, en un solo enlace'],
      ['Incluye', 'Masterplan, casas por plantas, planos, estancias y visitas 360°'],
      ['Qué necesitamos', 'Planos en PDF o DWG, memoria de calidades, ubicación y logo'],
      ['Promociones', 'De una a cinco viviendas'],
      ['Zona', 'Marbella, Benahavís, Estepona y el resto de la Costa del Sol'],
      ['Precio', 'Propuesta con precio cerrado cuando vemos tu proyecto'],
    ],
    blocks: [
      {
        type: 'prose',
        h2: 'Así lo vive tu comprador',
        body: 'Residencial Benahavís es una promoción de ejemplo, con casas, estados y precios ficticios. Funciona igual en el ordenador, la tablet o el móvil.\n\n1. **Elige su casa.** Toda la promoción desde el aire, con cada casa y su estado: disponible, reservada o vendida.\n2. **Entra por plantas.** La casa sin tejado, de sótano a azotea, con su ficha, sus metros y su precio.\n3. **Entiende el plano.** Cada planta con sus estancias, dibujada con los datos de tu proyecto.\n4. **Se imagina viviendo allí.** Cada estancia a pantalla completa. Si le encaja, te pide una llamada sin salir de la casa.',
      },
      {
        type: 'prose',
        h2: 'Tu comprador no imagina la casa. La recorre',
        body: 'Cada showroom se arma con las piezas que necesita tu promoción y lleva tu marca:\n\n- **Masterplan con disponibilidad**: cada casa con su estado, al día.\n- **La casa por plantas**: sin tejado, de sótano a azotea.\n- **Fichas y planos**: metros, estancias y precio.\n- **Estancias**: cada espacio a pantalla completa.\n- **Visitas 360°**: mirar alrededor dentro de cada estancia.\n- **De día y de noche**: la promoción con otra luz.',
      },
      {
        type: 'prose',
        h2: 'De tus planos a una casa que se recorre',
        body: 'No hace falta que la casa exista, ni renders previos. Con la documentación del proyecto levantamos cada vivienda con sus medidas reales y la vestimos con tus acabados. Necesitamos:\n\n- **Planos** en PDF o DWG: plantas, alzados y parcela.\n- **Memoria de calidades**: suelos, carpinterías, cocina y baños.\n- **Ubicación**: la parcela y su entorno, con vistas, orientación y accesos.\n- **Tu marca**: logo y colores, para que el showroom sea tuyo.',
      },
      {
        type: 'prose',
        h2: 'Todos mandan un PDF. Tú mandas la casa',
        body: 'Tu comprador mira diez promociones a la vez y las diez le llegan igual: un dossier que se descarga, se abre una vez y se olvida. Con {{brand}} mandas un enlace que abre la promoción en su móvil: la recorre, elige casa y te contesta desde dentro.\n\n- **Vendes antes de construir.** Mientras solo hay planos, una casa que se puede recorrer convence más que una lámina. Y el banco quiere ver ventas antes de financiar la obra.\n- **Llegas a quien compra desde fuera.** Buena parte de tus compradores vive en otro país y decide a distancia. El enlace viaja por WhatsApp y por email.\n- **Tus agencias enseñan lo mismo.** Cada agente comparte el mismo enlace, con tu marca y la disponibilidad al día. Nadie enseña una versión antigua.',
      },
      {
        type: 'prose',
        h2: 'Una herramienta de venta para tu equipo comercial',
        body: '- **En la sala de ventas**: tus comerciales presentan cada vivienda en una tablet, con su disponibilidad y su precio al día.\n- **En la venta a distancia**: el mismo enlace llega al comprador internacional por WhatsApp o por email.\n- **En ferias y agencias**: un código QR en el stand o en el folleto abre la promoción completa.',
      },
      {
        type: 'prose',
        h2: 'Villas, adosados o una urbanización entera',
        body: 'Promociones de una a cinco viviendas en Marbella, Benahavís y Estepona. Dentro del showroom, cada una se ve con su maqueta, sus plantas y sus estancias, con su estado y su ficha. Las imágenes de esta página son ilustrativas y los datos, de ejemplo.',
      },
      {
        type: 'prose',
        h2: 'Mándanos el plano. Te enseñamos la casa',
        body: 'Cuéntanos tu promoción y te preparamos una demo con tus propios planos: el antes y el después de una de tus viviendas. Escríbenos a {{email}}, por WhatsApp o al {{phone}}.',
      },
    ],
    faq: [
      { q: '¿Qué necesitáis de mi promoción?', a: 'Los planos en PDF o DWG, la memoria de calidades, la ubicación de la parcela y tu logo. Si tienes renders o referencias de acabados, también ayudan.' },
      { q: '¿Para qué promociones es?', a: 'Para obra nueva de villas, chalets, pareados y adosados en la Costa del Sol. Empezamos con promociones de una a cinco viviendas; si la tuya es más grande, cuéntanosla.' },
      { q: '¿Mi comprador tiene que instalar algo?', a: 'No. El showroom se abre en el navegador del móvil, la tablet o el ordenador, desde un enlace o un código QR.' },
      { q: '¿Pueden usarlo mis agencias?', a: 'Sí. Todas comparten el mismo enlace, con tu marca, así que cada comprador ve la misma promoción, la enseñe quien la enseñe.' },
      { q: '¿Cuánto cuesta?', a: 'Depende del número de viviendas y de las piezas que incluya. Cuando vemos tu proyecto te mandamos una propuesta con precio cerrado.' },
      { q: '¿Residencial Benahavís es una promoción real?', a: 'No. Es una promoción ficticia que hemos creado para enseñar cómo funciona un showroom. Sus casas, estados y precios son de ejemplo.' },
    ],
    related: ['sol-promotoras', 'servicios', 'contacto'],
  },

  // ─────────────────────────────────────────────────────────────── EN
  // The English home is the same developer showroom page (build/home/portada.en.html, the Spanish markup translated).
  // This file feeds its <head>, its FAQ (HTML and FAQPage) and the Markdown mirror, like the Spanish entry.
  en: {
    title: 'Virtual 3D showroom for new-build developers | {{brand}}',
    description: '3D showrooms for developers of villas, detached houses and townhouses in Marbella, Benahavís and Estepona. Buyers pick a home and walk through it.',
    h1: 'Virtual showroom',
    lead: 'For new-build developers on the Costa del Sol. Your development, before it is built: your buyer picks a home, walks through it floor by floor and gets in touch. In one link with your brand.',
    breadcrumb: 'Home',
    facts: [
      ['Who it is for', 'New-build developers on the Costa del Sol'],
      ['What it is', 'A web showroom with your brand, in one link'],
      ['Includes', 'Masterplan, homes floor by floor, plans, rooms and 360° tours'],
      ['What we need', 'Plans as PDF or DWG, specifications, location and logo'],
      ['Developments', 'From one to five homes'],
      ['Area', 'Marbella, Benahavís, Estepona and the rest of the Costa del Sol'],
      ['Price', 'A proposal with a fixed price once we see your project'],
    ],
    blocks: [
      {
        type: 'prose',
        h2: 'What your buyer sees',
        body: 'Residencial Benahavís is a sample development, with fictitious homes, statuses and prices. It works the same on a computer, a tablet or a phone.\n\n1. **They pick a home.** The whole development from the air, with each home and its status: available, reserved or sold.\n2. **They go in floor by floor.** The house without its roof, from basement to roof terrace, with its fact sheet, floor areas and price.\n3. **They understand the plan.** Every floor with its rooms, drawn from your project data.\n4. **They picture living there.** Every room full screen. If it fits, they ask you to call them without leaving the house.',
      },
      {
        type: 'prose',
        h2: 'Your buyer does not imagine the home. They walk through it',
        body: 'Every showroom is built from the pieces your development needs, with your brand:\n\n- **Masterplan with availability**: every home with its status, up to date.\n- **The house floor by floor**: no roof, from basement to roof terrace.\n- **Fact sheets and plans**: floor areas, rooms and price.\n- **Rooms**: every space full screen.\n- **360° tours**: look around inside every room.\n- **Day and night**: the development in another light.',
      },
      {
        type: 'prose',
        h2: 'From your plans to a home you can walk through',
        body: 'The house does not need to exist, and you do not need renders. From the project documents we build every home to its real dimensions and dress it in your finishes. We need:\n\n- **Plans** as PDF or DWG: floor plans, elevations and plot.\n- **Specifications**: floors, joinery, kitchen and bathrooms.\n- **Location**: the plot and its surroundings, with views, orientation and access.\n- **Your brand**: logo and colours, so the showroom is yours.',
      },
      {
        type: 'prose',
        h2: 'Everyone sends a PDF. You send the home',
        body: 'Your buyer looks at ten developments at once and all ten arrive the same way: a brochure that is downloaded, opened once and forgotten. With {{brand}} you send a link that opens the development on their phone: they walk through it, pick a home and reply from inside.\n\n- **You sell before you build.** While there are only plans, a home you can walk through convinces more than a drawing. And the bank wants to see sales before it finances the build.\n- **You reach buyers abroad.** Many of your buyers live in another country and decide from a distance. The link travels by WhatsApp and email.\n- **Your agencies all show the same thing.** Every agent shares the same link, with your brand and availability up to date. Nobody shows an old version.',
      },
      {
        type: 'prose',
        h2: 'A sales tool for your sales team',
        body: '- **In the sales office**: your sales team presents every home on a tablet, with up-to-date availability and price.\n- **In remote sales**: the same link reaches the international buyer by WhatsApp or email.\n- **At fairs and agencies**: a QR code on the stand or in the brochure opens the whole development.',
      },
      {
        type: 'prose',
        h2: 'Villas, townhouses or a whole gated community',
        body: 'Developments of one to five homes in Marbella, Benahavís and Estepona. Inside the showroom, each one appears with its model, its floors and its rooms, with status and fact sheet. The images on this page are illustrative and the data are samples.',
      },
      {
        type: 'prose',
        h2: 'Send us the plan. We show you the home',
        body: 'Tell us about your development and we prepare a demo with your own plans: the before and after of one of your homes. Write to {{email}}, on WhatsApp or call {{phone}}.',
      },
    ],
    faq: [
      { q: 'What do you need from my development?', a: 'The plans as PDF or DWG, the specifications, the location of the plot and your logo. If you have renders or finish references, they help too.' },
      { q: 'What kind of developments is it for?', a: 'For new-build villas, detached and semi-detached houses and townhouses on the Costa del Sol. We start with developments of one to five homes; if yours is larger, tell us about it.' },
      { q: 'Does my buyer have to install anything?', a: 'No. The showroom opens in the browser of a phone, tablet or computer, from a link or a QR code.' },
      { q: 'Can my agencies use it?', a: 'Yes. They all share the same link, with your brand, so every buyer sees the same development, whoever shows it.' },
      { q: 'How much does it cost?', a: 'It depends on the number of homes and the pieces it includes. Once we see your project we send you a proposal with a fixed price.' },
      { q: 'Is Residencial Benahavís a real development?', a: 'No. It is a fictitious development we created to show how a showroom works. Its homes, statuses and prices are samples.' },
    ],
    related: ['sol-promotoras', 'servicios', 'contacto'],
  },

  de: {
    title: 'Virtueller 3D-Showroom für Bauträger | {{brand}}',
    description: '3D-Showrooms für Bauträger von Villen, Einfamilien- und Reihenhäusern in Marbella, Benahavís und Estepona. Käufer wählen ein Haus und gehen hindurch.',
    h1: 'Virtueller Showroom',
    lead: 'Für Bauträger von Neubauprojekten an der Costa del Sol. Ihr Projekt, bevor es gebaut ist: Ihr Käufer wählt ein Haus, geht Geschoss für Geschoss hindurch und nimmt Kontakt auf. Mit einem Link und Ihrer Marke.',
    breadcrumb: 'Startseite',
    facts: [
      ['Für wen', 'Bauträger von Neubauprojekten an der Costa del Sol'],
      ['Was es ist', 'Ein Web-Showroom mit Ihrer Marke, in einem Link'],
      ['Enthalten', 'Masterplan, Häuser Geschoss für Geschoss, Grundrisse, Räume und 360°-Rundgänge'],
      ['Was wir brauchen', 'Pläne als PDF oder DWG, Baubeschreibung, Lage und Logo'],
      ['Projekte', 'Mit einem bis fünf Häusern'],
      ['Gebiet', 'Marbella, Benahavís, Estepona und die übrige Costa del Sol'],
      ['Preis', 'Ein Angebot zum Festpreis, sobald wir Ihr Projekt kennen'],
    ],
    blocks: [
      {
        type: 'prose',
        h2: 'Was Ihr Käufer sieht',
        body: 'Residencial Benahavís ist ein Beispielprojekt mit fiktiven Häusern, Status und Preisen. Es funktioniert gleich am Computer, auf dem Tablet und auf dem Handy.\n\n1. **Er wählt ein Haus.** Das ganze Projekt aus der Luft, mit jedem Haus und seinem Status: frei, reserviert oder verkauft.\n2. **Er geht Geschoss für Geschoss hinein.** Das Haus ohne Dach, vom Untergeschoss bis zur Dachterrasse, mit Datenblatt, Flächen und Preis.\n3. **Er versteht den Grundriss.** Jedes Geschoss mit seinen Räumen, gezeichnet aus den Daten Ihres Projekts.\n4. **Er stellt sich vor, dort zu wohnen.** Jeder Raum im Vollbild. Wenn es passt, bittet er Sie um einen Rückruf, ohne das Haus zu verlassen.',
      },
      {
        type: 'prose',
        h2: 'Ihr Käufer stellt sich das Haus nicht vor. Er geht hindurch',
        body: 'Jeder Showroom wird aus den Bausteinen zusammengestellt, die Ihr Projekt braucht, mit Ihrer Marke:\n\n- **Masterplan mit Verfügbarkeit**: jedes Haus mit seinem aktuellen Status.\n- **Das Haus Geschoss für Geschoss**: ohne Dach, vom Untergeschoss bis zur Dachterrasse.\n- **Datenblätter und Grundrisse**: Flächen, Räume und Preis.\n- **Räume**: jeder Raum im Vollbild.\n- **360°-Rundgänge**: in jedem Raum umschauen.\n- **Tag und Nacht**: das Projekt in anderem Licht.',
      },
      {
        type: 'prose',
        h2: 'Von Ihren Plänen zu einem begehbaren Haus',
        body: 'Das Haus muss nicht existieren, und Sie brauchen keine Renderings. Aus den Projektunterlagen bauen wir jedes Haus in seinen echten Maßen und statten es mit Ihren Oberflächen aus. Wir brauchen:\n\n- **Pläne** als PDF oder DWG: Grundrisse, Ansichten und Grundstück.\n- **Baubeschreibung**: Böden, Tischlerarbeiten, Küche und Bäder.\n- **Lage**: das Grundstück und seine Umgebung, mit Aussicht, Ausrichtung und Zufahrt.\n- **Ihre Marke**: Logo und Farben, damit der Showroom Ihrer ist.',
      },
      {
        type: 'prose',
        h2: 'Alle schicken ein PDF. Sie schicken das Haus',
        body: 'Ihr Käufer sieht sich zehn Projekte gleichzeitig an, und alle zehn kommen gleich an: als Broschüre, die heruntergeladen, einmal geöffnet und vergessen wird. Mit {{brand}} schicken Sie einen Link, der das Projekt auf seinem Handy öffnet: Er geht hindurch, wählt ein Haus und antwortet direkt von dort.\n\n- **Sie verkaufen, bevor Sie bauen.** Solange es nur Pläne gibt, überzeugt ein begehbares Haus mehr als eine Zeichnung. Und die Bank will Verkäufe sehen, bevor sie den Bau finanziert.\n- **Sie erreichen Käufer im Ausland.** Viele Ihrer Käufer leben in einem anderen Land und entscheiden aus der Ferne. Der Link reist per WhatsApp und E-Mail.\n- **Alle Ihre Makler zeigen dasselbe.** Jeder Makler teilt denselben Link, mit Ihrer Marke und aktueller Verfügbarkeit. Niemand zeigt eine alte Version.',
      },
      {
        type: 'prose',
        h2: 'Ein Verkaufswerkzeug für Ihr Vertriebsteam',
        body: '- **Im Verkaufsbüro**: Ihr Vertriebsteam präsentiert jedes Haus auf einem Tablet, mit aktueller Verfügbarkeit und aktuellem Preis.\n- **Im Fernverkauf**: Derselbe Link erreicht den internationalen Käufer per WhatsApp oder E-Mail.\n- **Auf Messen und bei Maklern**: Ein QR-Code am Stand oder in der Broschüre öffnet das ganze Projekt.',
      },
      {
        type: 'prose',
        h2: 'Villen, Reihenhäuser oder eine ganze Wohnanlage',
        body: 'Projekte mit einem bis fünf Häusern in Marbella, Benahavís und Estepona. Im Showroom erscheint jedes mit seinem Modell, seinen Geschossen und seinen Räumen, mit Status und Datenblatt. Die Bilder auf dieser Seite sind Symbolbilder, die Daten Beispiele.',
      },
      {
        type: 'prose',
        h2: 'Schicken Sie uns den Grundriss. Wir zeigen Ihnen das Haus',
        body: 'Erzählen Sie uns von Ihrem Projekt, und wir bereiten eine Demo mit Ihren eigenen Plänen vor: das Vorher und Nachher eines Ihrer Häuser. Schreiben Sie an {{email}}, per WhatsApp oder rufen Sie {{phone}} an. Wir antworten auf Englisch oder Spanisch.',
      },
    ],
    faq: [
      { q: 'Was brauchen Sie von meinem Projekt?', a: 'Die Pläne als PDF oder DWG, die Baubeschreibung, die Lage des Grundstücks und Ihr Logo. Wenn Sie Renderings oder Referenzen für die Oberflächen haben, helfen sie auch.' },
      { q: 'Für welche Projekte ist es gedacht?', a: 'Für Neubauvillen, Einfamilien-, Doppel- und Reihenhäuser an der Costa del Sol. Wir beginnen mit Projekten von einem bis fünf Häusern; wenn Ihres größer ist, erzählen Sie uns davon.' },
      { q: 'Muss mein Käufer etwas installieren?', a: 'Nein. Der Showroom öffnet sich im Browser von Handy, Tablet oder Computer, über einen Link oder einen QR-Code.' },
      { q: 'Können meine Makler ihn nutzen?', a: 'Ja. Alle teilen denselben Link mit Ihrer Marke, sodass jeder Käufer dasselbe Projekt sieht, egal wer es zeigt.' },
      { q: 'Was kostet es?', a: 'Das hängt von der Anzahl der Häuser und den enthaltenen Bausteinen ab. Sobald wir Ihr Projekt kennen, senden wir Ihnen ein Angebot zum Festpreis.' },
      { q: 'Ist Residencial Benahavís ein echtes Projekt?', a: 'Nein. Es ist ein fiktives Projekt, das wir erstellt haben, um zu zeigen, wie ein Showroom funktioniert. Häuser, Status und Preise sind Beispiele.' },
    ],
    related: ['sol-promotoras', 'como-funciona', 'contacto'],
  },
};
