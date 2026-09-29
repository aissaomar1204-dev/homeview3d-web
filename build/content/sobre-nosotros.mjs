// About (template `about`, AboutPage schema). No invented people, clients, counts or awards: the studio is new
// (site.facts.founded = 2026) and says so. Legal references verified with WebFetch on 2026-09-28:
// BOE consolidated texts of the GDPR (DOUE-L-2016-80807), LOPDGDD (BOE-A-2018-16673) and the AI Act
// (DOUE-L-2024-81079, same link as guia-ia-vs-3d); EUR-Lex ELI links for the English page.

const SRC = {
  rgpdEs: 'https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807',
  lopdgdd: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673',
  aiActEs: 'https://www.boe.es/buscar/doc.php?id=DOUE-L-2024-81079',
  gdprEn: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
  aiActEn: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  blender: 'https://www.blender.org/about/',
  mv: 'https://modelviewer.dev/',
};

import { plate } from '../data/plates.mjs';

export default {
  id: 'sobre-nosotros',
  image: 'villa_dormitorios_opaco',
  datePublished: '2026-09-28',
  dateModified: '2026-09-28',

  // ─────────────────────────────────────────────────────────────── ES
  es: {
    title: 'Quiénes somos: visualización 3D desde la Costa del Sol',
    description: 'Estudio de visualización 3D fundado en 2026 en la Costa del Sol: cómo trabajamos, qué hace la IA y qué no, y cómo protegemos los planos que nos envías.',
    h1: 'Quiénes somos y cómo trabajamos',
    lead: 'Somos un estudio de visualización 3D nacido en 2026 en la Costa del Sol. Convertimos planos 2D en modelos 3D amueblados, con renders, visor web y realidad aumentada, para inmobiliarias, promotoras y arquitectos de toda España. Trabajamos con software abierto, precios públicos desde {{price:plano3d}} + IVA y un método que puedes comprobar en nuestra [villa de demostración](@caso-villa).',
    breadcrumb: 'Sobre nosotros',
    card: {
      title: 'Sobre nosotros',
      summary: 'Quiénes somos, cómo trabajamos, qué hace la IA y qué no, y cómo tratamos los planos de tus clientes.',
    },
    facts: [
      ['Fundado', '2026'],
      ['Base', 'Costa del Sol (Málaga)'],
      ['Ámbito', 'Toda España en remoto, y agencias internacionales'],
      ['Idiomas', 'Español e inglés'],
      ['Herramientas', 'Blender, Python, Cycles, glTF, USDZ y model-viewer'],
      ['Inteligencia artificial', 'Para escribir código, nunca para inventar geometría'],
      ['Precios', 'Públicos y sin IVA, desde {{price:plano3d}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: '¿Quiénes somos?',
        answer: 'Un estudio pequeño y nuevo, fundado en 2026, que trabaja desde la Costa del Sol para agencias, promotoras y arquitectos de toda España. Todavía no tenemos una cartera de clientes que enseñar y no nos la inventamos: nuestra prueba es la villa que puedes recorrer en esta web, con sus números, su método y sus límites.',
        body: '{{entity}}\n\nEl estudio nace de algo que se ve en cualquier portal: muchas viviendas en venta sobre plano, vacías o dirigidas a compradores que viven lejos se anuncian con poco más que un plano. Y las alternativas obligan a elegir entre una imagen barata y plana, un estudio de visualización que tarda semanas y no publica precios, o una herramienta de IA que redecora fotos pero no sabe dónde va una ventana.\n\nNosotros hacemos otra cosa: construimos el modelo 3D de la vivienda desde su plano, a escala, y de ese modelo sacamos todo lo demás. Los renders, el [visor 3D](@servicio-tour) y la [realidad aumentada](@servicio-ar) enseñan la misma vivienda, con los mismos muebles y la misma luz.',
      },
      {
        type: 'steps',
        h2: '¿Cuál es nuestro método?',
        intro: 'Seis eslabones, siempre los mismos. Cada uno deja un archivo que se puede revisar, y ninguno depende de una licencia que tengas que pagar tú. El detalle, con plazos por fase, en [cómo funciona](@como-funciona).',
        items: [
          { title: 'El plano', body: 'Leemos tu plano, fijamos la escala con sus cotas o con una medida de referencia y anotamos lo que falta. Si algo no se entiende, preguntamos antes de modelar.' },
          { title: 'Blender y scripts de Python', body: 'Levantamos muros, huecos, puertas, ventanas y mobiliario con código en [Blender](' + SRC.blender + '). La geometría sale de medidas, no de una imagen: por eso es fiel al plano y se rehace en minutos si el plano cambia.' },
          { title: 'Materiales PBR procedurales', body: 'Suelos, alicatados, maderas y tejidos se generan por código dentro de Blender como [texturas procedurales](@glosario#textura-procedural). No usamos bancos de texturas, así que no hay licencias de terceros sobre tus imágenes.' },
          { title: 'Cycles', body: 'Calculamos los [renders](@glosario#render) con luz física: el sol entra por las ventanas que dibuja el plano y las sombras caen donde caerían en la vivienda.' },
          { title: 'glTF y USDZ', body: 'Exportamos el modelo en los formatos abiertos que entienden la web y los móviles: [GLB](@glosario#glb) para el visor y Android, [USDZ](@glosario#usdz) para iPhone y iPad. Un proceso automático los comprime y los valida antes de publicarlos.' },
          { title: 'model-viewer', body: 'Publicamos el visor con [model-viewer](' + SRC.mv + '), el componente de código abierto de Google, que se incrusta en cualquier web y abre la realidad aumentada sin instalar nada.' },
        ],
      },
      {
        type: 'answer',
        h2: '¿Qué hace la IA en nuestro trabajo y qué no?',
        answer: 'La IA nos ayuda a programar, no a dibujar. Usamos Claude, de Anthropic, para escribir y depurar los scripts de Python. La geometría la construyen esos scripts a partir de las medidas de tu plano y las imágenes se calculan con Cycles, así que no hay ventanas inventadas.',
        body: 'Esta es nuestra política, por escrito:\n\n- **Geometría construida, no generada.** Cada muro está donde dice el plano. Si una medida es estimada, la marcamos con ≈.\n- **Revisión humana.** Una persona revisa cada entrega contra el plano antes de enviarla.\n- **Vídeos con IA, etiquetados.** Cuando lancemos los vídeos cinematográficos generados con IA a partir de nuestros renders, que todavía no están disponibles, irán etiquetados como contenido generado con IA, en línea con las obligaciones de transparencia del [artículo 50 del Reglamento europeo de inteligencia artificial](' + SRC.aiActEs + ').\n- **Staging etiquetado.** El mobiliario virtual se entrega identificado como recreación virtual, para que tu anuncio lo indique.\n\nSi quieres la comparación completa entre un modelo 3D y las herramientas de IA, está en [IA o modelo 3D real](@guia-ia-vs-3d).',
      },
      plate('es', 'villa_interior_dormitorio'),
      {
        type: 'answer',
        h2: '¿Qué hacemos con los planos de tus clientes?',
        answer: 'Los usamos solo para tu encargo. No publicamos tu plano ni el resultado sin tu permiso por escrito, no los compartimos con nadie para otros fines y tratamos los datos personales que contengan conforme al RGPD y a la ley española de protección de datos. Si lo necesitas, firmamos un acuerdo de confidencialidad antes de recibirlos.',
        body: 'Un plano puede identificar una vivienda y, con ella, a su propietario. Por eso nuestro propio caso está anonimizado: la villa de la Costa del Sol no lleva dirección, ni agencia, ni el plano original, que no reproducimos. Aplicamos el mismo criterio a cada encargo.\n\nLas normas de referencia son el [Reglamento (UE) 2016/679, o RGPD](' + SRC.rgpdEs + '), y la [Ley Orgánica 3/2018 de Protección de Datos Personales](' + SRC.lopdgdd + '). Cómo tratamos tus datos en concreto, en la [política de privacidad](@privacidad).',
      },
      {
        type: 'answer',
        h2: '¿Dónde trabajamos?',
        answer: 'Desde la Costa del Sol, en remoto para toda España. Como trabajamos con el plano, no necesitamos visitar la vivienda: da igual que esté en Marbella, en Madrid o en Valencia. Atendemos en español y en inglés a agencias internacionales que venden a compradores británicos, neerlandeses, alemanes o nórdicos.',
        body: 'Conocemos el mercado que tenemos más cerca: villas con terrazas, obra nueva y compradores que deciden a distancia. Lo contamos en las páginas de la [Costa del Sol](@zona-costa-del-sol), [Marbella](@zona-marbella) y [Málaga](@zona-malaga).',
      },
      {
        type: 'answer',
        h2: '¿Por qué publicamos los precios?',
        answer: 'Porque una agencia tiene que saber cuánto cuesta antes de pedir nada. El plano 3D cuesta {{price:plano3d}} + IVA por planta y la maqueta 3D completa, {{price:maqueta}} + IVA por vivienda, con plazos cerrados. Los buscadores y los asistentes de IA también leen esta web, y preferimos que den la cifra correcta.',
        body: 'Todas las tarifas, extras y el pack para agencias están en [precios](@precios), junto a una comparativa con lo que publica el mercado.',
      },
      {
        type: 'checklist',
        h2: '¿Qué no vamos a hacer nunca?',
        intro: 'Algunas prácticas son habituales en el sector. Nosotros no las hacemos:',
        items: [
          'Inventar estadísticas, testimonios, logos de clientes o cifras de proyectos. Somos nuevos y lo decimos.',
          'Citar datos de mercado sin una fuente primaria enlazada y fechada.',
          'Entregar home staging virtual sin identificarlo como recreación virtual.',
          'Presentar imágenes generadas con IA como si fueran renders o fotografías.',
          'Prometer que el visor aparecerá incrustado dentro de un portal: cada portal decide qué visitas virtuales admite.',
          'Publicar medidas estimadas como si fueran exactas.',
          'Usar tu plano o tu vivienda como ejemplo sin tu permiso.',
          'Esconder el precio detrás de un «pídenos presupuesto» cuando la vivienda es estándar.',
        ],
      },
      {
        type: 'prose',
        h2: '¿Cómo contactar con nosotros?',
        body: 'Escríbenos a {{email}}, llámanos al {{phone}} o mándanos un WhatsApp al {{whatsapp}}. Contesta una persona del estudio, no un bot. Si ya tienes el plano, adjúntalo en el [formulario de contacto](@contacto) y te respondemos con precio cerrado y plazo.\n\nLos datos del titular de esta web están en el [aviso legal](@aviso-legal).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: '¿Quién está detrás de {{brand}}?',
        a: 'Un estudio pequeño de visualización 3D, fundado en 2026 en la Costa del Sol y especializado en convertir planos en modelos 3D. Somos nuevos: no tenemos años de cartera que enseñar, así que publicamos lo que sí podemos demostrar, una villa modelada desde su plano con sus cifras, su método y sus límites, y precios cerrados. Te contesta una persona del estudio.',
      },
      {
        q: '¿Tengo que estar en Málaga para trabajar con vosotros?',
        a: 'No. {{brand}} trabaja en remoto: nos envías el plano por el formulario, por email o por WhatsApp, revisas el modelo en un enlace privado y recibes los archivos por internet. Tenemos la base en la Costa del Sol, pero el mismo proceso sirve para una vivienda en Madrid, en Valencia o fuera de España.',
      },
      {
        q: '¿Qué programas usa {{brand}}?',
        a: 'Blender 5 para modelar, texturizar y exportar; scripts de Python para generar la geometría; Cycles para los renders; glTF (GLB) y USDZ como formatos de entrega; y model-viewer, de Google, para el visor web. Todo es software libre o estándar abierto, así que tus archivos no dependen de una licencia nuestra ni de una suscripción.',
      },
      {
        q: '¿Usáis texturas de stock?',
        a: 'No. {{brand}} crea los materiales PBR por código dentro de Blender, a medida de cada vivienda; en la villa de demostración fueron {{villa:textures}}. Así no hay licencias de terceros que limiten dónde publicas los renders ni que caduquen cuando la vivienda se vende, y cambiar un acabado es ajustar un valor, no buscar otra imagen.',
      },
      {
        q: '¿Qué pasa con mi plano cuando termina el encargo?',
        a: 'Lo conservamos mientras dura el encargo y el alojamiento del visor; si no llegas a encargar nada, 12 meses desde nuestro último contacto. No lo publicamos ni lo compartimos con nadie para otros fines, y puedes pedir que lo borremos antes escribiendo a {{email}}. {{brand}} trata los datos conforme al RGPD; el detalle está en la [política de privacidad](@privacidad).',
      },
      {
        q: '¿Vais a usar IA generativa en el futuro?',
        a: 'Sí, para vídeos, y siempre etiquetada. {{brand}} prepara vídeos cinematográficos generados con IA a partir de sus renders, que todavía no están disponibles. Partirán de un modelo 3D coherente, no de fotos sueltas, y se entregarán etiquetados como contenido generado con IA. Lo que no haremos es usar IA generativa para inventar la geometría de una vivienda.',
      },
      {
        q: '¿Por qué no hay testimonios de clientes en la web?',
        a: 'Porque somos un estudio nuevo y no vamos a inventarlos. {{brand}} publicará opiniones y casos de clientes cuando los tenga y con su permiso. Mientras tanto, la prueba se puede verificar: abre la villa de demostración en 3D y en realidad aumentada, y pide gratis una estancia de tu propio plano.',
      },
    ],
    related: ['caso-villa', 'como-funciona', 'precios', 'guia-ia-vs-3d', 'zona-costa-del-sol'],
    cta: {
      h2: '¿Hablamos de tu plano?',
      body: 'Envíanos el plano y te contestamos con precio cerrado y plazo. Si prefieres verlo antes de decidir, modelamos gratis una estancia y te la mandamos con realidad aumentada.',
      service: 'maqueta',
    },
  },

  // ─────────────────────────────────────────────────────────────── EN
  en: {
    title: 'About us: 3D visualisation studio, Costa del Sol',
    description: 'A 3D visualisation studio founded in 2026 on the Costa del Sol: how we work, what AI does and does not do, and how we protect the floor plans you send us.',
    h1: 'Who we are and how we work',
    lead: 'We are a 3D visualisation studio founded in 2026 on the Costa del Sol. We turn 2D floor plans into furnished 3D models, with renders, a web viewer and augmented reality, for estate agents, developers and architects across Spain. We work with open software, public prices from {{price:plano3d}} + VAT and a method you can check on our [demo villa](@caso-villa).',
    breadcrumb: 'About us',
    card: {
      title: 'About us',
      summary: 'Who we are, how we work, what AI does and does not do, and how we handle your clients’ floor plans.',
    },
    facts: [
      ['Founded', '2026'],
      ['Base', 'Costa del Sol (Málaga province)'],
      ['Coverage', 'All of Spain remotely, plus international agencies'],
      ['Languages', 'English and Spanish'],
      ['Tools', 'Blender, Python, Cycles, glTF, USDZ and model-viewer'],
      ['Artificial intelligence', 'For writing code, never for inventing geometry'],
      ['Prices', 'Public and ex VAT, from {{price:plano3d}}'],
    ],
    blocks: [
      {
        type: 'answer',
        h2: 'Who are we?',
        answer: 'A small, new studio, founded in 2026, working from the Costa del Sol for agents, developers and architects across Spain and abroad. We do not have a client portfolio to show yet, and we are not going to make one up: our proof is the villa you can explore on this site, with its figures, its method and its limits.',
        body: '{{entity}}\n\nThe studio grew out of something you can see on any property portal: plenty of off-plan units, empty homes and properties marketed to buyers who live abroad go online with little more than a floor plan. And the alternatives force a choice between a cheap, static image, a visualisation studio that takes weeks and publishes no prices, or an AI tool that restyles photos but has no idea where a window goes.\n\nWe do something else: we build the home’s 3D model from its floor plan, to scale, and everything else comes out of that model. The renders, the [interactive 3D viewer](@servicio-tour) and the [augmented reality](@servicio-ar) all show the same home, with the same furniture and the same light.',
      },
      {
        type: 'steps',
        h2: 'What is our method?',
        intro: 'Six links in the chain, always the same. Each one leaves a file that can be checked, and none depends on a licence you have to pay for. The detail, with timings per stage, is on [how it works](@como-funciona).',
        items: [
          { title: 'The floor plan', body: 'We read your plan, set the scale from its dimensions or from a reference measurement, and note what is missing. If something is unclear, we ask before modelling.' },
          { title: 'Blender and Python scripts', body: 'Walls, openings, doors, windows and furniture are built in code in [Blender](' + SRC.blender + '). The geometry comes from measurements, not from a picture, which is why it matches the plan and can be rebuilt in minutes if the plan changes.' },
          { title: 'Procedural PBR materials', body: 'Floors, tiles, timber and fabrics are generated in code inside Blender as [procedural textures](@glosario#textura-procedural). We use no stock texture libraries, so no third-party licence sits on your images.' },
          { title: 'Cycles', body: 'We compute the [renders](@glosario#render) with physically based light: the sun comes in through the windows on the plan and shadows fall where they would in the real home.' },
          { title: 'glTF and USDZ', body: 'We export the model in the open formats that browsers and phones understand: [GLB](@glosario#glb) for the viewer and Android, [USDZ](@glosario#usdz) for iPhone and iPad. An automated pipeline compresses and validates them before publishing.' },
          { title: 'model-viewer', body: 'We publish the viewer with [model-viewer](' + SRC.mv + '), Google’s open-source web component, which embeds in any website and opens augmented reality with nothing to install.' },
        ],
      },
      {
        type: 'answer',
        h2: 'What does AI do in our work, and what does it not do?',
        answer: 'AI helps us write code, not draw. We use Anthropic’s Claude to write and debug the Python scripts. Those scripts build the geometry from your plan’s measurements, and the images are computed in Cycles, so there are no made-up windows.',
        body: 'This is our policy, in writing:\n\n- **Built geometry, not generated.** Every wall sits where the plan puts it. If a measurement is estimated, we mark it with ≈.\n- **Human review.** A person checks every delivery against the plan before it goes out.\n- **AI videos, labelled.** When we launch cinematic videos generated with AI from our renders, which are not available yet, they will be labelled as AI-generated content, in line with the transparency obligations in [Article 50 of the EU Artificial Intelligence Act](' + SRC.aiActEn + ').\n- **Staging, labelled.** Virtual furniture is delivered marked as a virtual recreation, so your listing can say so.\n\nFor the full comparison between a real 3D model and AI tools, see [AI floor plan to 3D](@guia-ia-vs-3d).',
      },
      plate('en', 'villa_interior_dormitorio'),
      {
        type: 'answer',
        h2: 'What do we do with your clients’ floor plans?',
        answer: 'We use them for your project and nothing else. We do not publish your plan or the result without your written permission, we do not share them with anyone for other purposes, and any personal data they contain is handled under the GDPR and Spain’s data protection law. If you need one, we sign a non-disclosure agreement before receiving them.',
        body: 'A floor plan can identify a home and, through it, its owner. That is why our own case study is anonymised: the Costa del Sol villa carries no address, no agency and no copy of the original plan. We apply the same standard to every project.\n\nThe reference texts are the [General Data Protection Regulation (EU) 2016/679](' + SRC.gdprEn + ') and Spain’s [Organic Law 3/2018 on data protection](' + SRC.lopdgdd + ') (in Spanish). How we handle your data in practice is set out in our [privacy policy](@privacidad).',
      },
      {
        type: 'answer',
        h2: 'Where do we work?',
        answer: 'From the Costa del Sol, remotely across Spain and for agencies abroad. Because we work from the floor plan, we never need to visit the property: it can be in Marbella, Madrid or Valencia. We work in English and Spanish, with international agencies selling to British, Dutch, German and Nordic buyers.',
        body: 'We know the market on our doorstep best: villas with terraces, new-build developments and buyers who decide from a distance. More on our page about [3D rendering in Marbella](@zona-marbella).',
      },
      {
        type: 'answer',
        h2: 'Why do we publish our prices?',
        answer: 'Because an agent should know what something costs before asking for anything. A 3D floor plan costs {{price:plano3d}} + VAT per floor and the complete 3D model {{price:maqueta}} + VAT per home, with fixed turnarounds. Search engines and AI assistants read this site too, and we would rather they quote the right figure.',
        body: 'Every rate, extra and the portfolio pack for agencies is on our [pricing page](@precios), next to a comparison with what the market publishes.',
      },
      {
        type: 'checklist',
        h2: 'What will we never do?',
        intro: 'Some of these are common practice in the industry. We do not do them:',
        items: [
          'Invent statistics, testimonials, client logos or project counts. We are new, and we say so.',
          'Quote market figures without a linked, dated primary source.',
          'Deliver virtual staging without labelling it as a virtual recreation.',
          'Pass off AI-generated images as renders or photographs.',
          'Promise the viewer will appear embedded inside a portal: each portal decides which virtual tours it accepts.',
          'Publish estimated measurements as if they were exact.',
          'Use your plan or your property as an example without your permission.',
          'Hide the price behind a “request a quote” when the property is a standard one.',
        ],
      },
      {
        type: 'prose',
        h2: 'How can you contact us?',
        body: 'Email us at {{email}}, call {{phone}} or send a WhatsApp message to {{whatsapp}}. A real person at the studio replies, not a bot. If you already have the floor plan, attach it to the [contact form](@contacto) and we will reply with a fixed price and turnaround.\n\nThe details of the company behind this website are in our [legal notice](@aviso-legal).',
      },
      { type: 'faq' },
    ],
    faq: [
      {
        q: 'Who is behind {{brand}}?',
        a: 'A small 3D visualisation studio, founded in 2026 on the Costa del Sol and focused on turning floor plans into 3D models. We are new: we have no years of portfolio to show, so we publish what we can prove, a villa modelled from its floor plan with its figures, method and limits, plus fixed prices. A real person at the studio replies to you.',
      },
      {
        q: 'Do I need to be in Spain to work with you?',
        a: 'No. {{brand}} works remotely: you send the floor plan through the form, by email or on WhatsApp, review the model on a private link and receive the files online. We are based on the Costa del Sol, but the same process works for a property in Madrid, in Valencia or for an agency in the UK, the Netherlands or Scandinavia.',
      },
      {
        q: 'What software does {{brand}} use?',
        a: 'Blender 5 for modelling, texturing and export; Python scripts to generate the geometry; Cycles for the renders; glTF (GLB) and USDZ as delivery formats; and Google’s model-viewer for the web viewer. It is all free software or open standards, so your files never depend on our licence or on a subscription.',
      },
      {
        q: 'Do you use stock textures?',
        a: 'No. {{brand}} creates PBR materials in code inside Blender, tailored to each home; the demo villa has {{villa:textures}} of them. That means no third-party licence limits where you publish the renders or expires when the property sells, and changing a finish means adjusting a value rather than hunting for another image.',
      },
      {
        q: 'What happens to my floor plan once the project is finished?',
        a: 'We keep it while the project and its viewer hosting last; if no project follows, for 12 months from our last contact. We never publish it or share it for other purposes, and you can ask us to delete it sooner by emailing {{email}}. {{brand}} handles personal data under the GDPR; the details are in our [privacy policy](@privacidad).',
      },
      {
        q: 'Will you use generative AI in the future?',
        a: 'Yes, for video, and always labelled. {{brand}} is preparing cinematic videos generated with AI from its renders; they are not available yet. They will start from a consistent 3D model rather than loose photos, and will be delivered labelled as AI-generated content. What we will not do is use generative AI to invent a home’s geometry.',
      },
      {
        q: 'Why are there no client testimonials on the site?',
        a: 'Because we are a new studio and we are not going to make them up. {{brand}} will publish client reviews and case studies when we have them, and with the client’s permission. Meanwhile, the proof can be checked: open the demo villa in 3D and in augmented reality, and ask for one room of your own plan, free of charge.',
      },
    ],
    related: ['caso-villa', 'como-funciona', 'precios', 'guia-ia-vs-3d', 'zona-marbella'],
    cta: {
      h2: 'Shall we talk about your floor plan?',
      body: 'Send us the plan and we reply with a fixed price and turnaround. If you would rather see it before deciding, we model one room free of charge and send it to you in augmented reality.',
      service: 'maqueta',
    },
  },
};
