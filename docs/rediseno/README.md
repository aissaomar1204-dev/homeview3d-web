# Rediseño de la web (octubre 2026)

> Estado: 9 oct 2026. **Salva construye, Álvaro reúne ideas.** Para empezar: [`FASE-1-PROMPT.md`](FASE-1-PROMPT.md) (instrucciones de la fase 1, listas para pegar en Claude Code).
> Tablero de ideas compartido (claude.ai, hay que tener acceso): https://claude.ai/artifact/UDyxESa4QnbJ1wyHFFyJRD
> Imágenes de Benahavís listas para usar (10 oct 2026): [`IMAGENES.md`](IMAGENES.md).

## Por qué
La crítica del cliente a la primera versión fue «demasiado simple» y «no concuerda con una web de miles de euros». La base técnica es muy buena y se mantiene; lo que falla es la emoción, la variedad y que no se ve lo nuevo.

**9 oct 2026:** se elimina el reglamento de diseño (`docs/design/DESIGN-RULEBOOK.md`). Se mantiene el sistema visual que ya existe (tokens, tipografías, motor de capítulos) y las comprobaciones automáticas; las referencias a reglas que queden en el código son históricas. Consecuencia directa: la web puede usar imágenes retocadas con IA (Nano Banana), siempre con un pie que lo diga.

## Diagnóstico de la portada (medido el 9 oct 2026 a 1440×900)
| Dato | Valor |
|---|---|
| Alto de la portada (`scrollHeight`) | 15.145 px |
| Bloques con título (h2) | 10 |
| Proyectos enseñados | 1 (la villa) |
| Vídeos | 0 |

**Funciona:** concepto propio (la web como juego de planos: láminas, cotas, cajetín) · demo real de la villa en 3D y en realidad aumentada · precios públicos con calculadora · rápida, bilingüe y preparada para buscadores y asistentes de IA.

**Frena:** larga y densa · un solo proyecto · no aparece lo nuevo (showroom de promociones como Benahavís, visita 360°, recorrido 3D libre, Google Earth) · mucha precisión y poca emoción · sin vídeo · el «desde 149 €» de los datos clave habla a agencias y a una promotora le puede sonar a producto barato · la villa del hero no es nuestra.

## Referencias revisadas (9 oct 2026)
| Web | Qué es | Qué cogemos |
|---|---|---|
| [ERA Residence](https://www.era-residence.com/) | Promoción en Estepona, Site of the Month (Awwwards, ago 2026) | Revelar renders con una forma de la arquitectura mediterránea (arco, ventana); color con carácter |
| [Sobha Privy Collection](https://sobha-privy-collection.com/) | Promoción en Dubái, Site of the Day (sep 2026) | Acceso fijo a la demo 3D en la cabecera |
| [360 Lexington Avenue](https://360lexingtonave.com) | Promoción en Nueva York, mención honorable | Tarjeta flotante que lleva directa al producto |
| [Quinta D. Amália](https://www.quintadamalia.com/) | Promoción en Portugal, mención honorable | Galería en tiras verticales para varios proyectos |
| [Mir](https://www.mir.no) | Estudio de render de referencia mundial | Una frase y el trabajo: menos texto |
| [DBOX](https://www.dbox.com) | Estudio en Nueva York y Londres | Showreel (descartado para nosotros) |
| [Viseni](https://www.viseni.com) | Competidor en Marbella desde 2008 | Es el listón local; nos diferencian las demos en vivo |
| [Urbania 3D](https://urbania3d.app) | Showroom virtual para promotoras (Argentina) | Explorador de funciones con la demo al lado |
| [LIKOVA](https://likova.space) | Site of the Day (ago 2026) | Lo que NO hay que hacer: pantallas de carga de varios segundos |

## Dirección: «Del plano a la vida»
Mantener el plano como seña de identidad (precisión) y que cada lámina técnica desemboque en una imagen que emocione. Láminas claras para lo que hay que entender (proceso, precios, datos) y bandas oscuras a sangre para lo que hay que sentir (proyectos, demos). El añil se queda; la calidez la ponen los renders, nunca la interfaz.

## Lo decidido en el tablero (9 oct 2026)
| Estado | Idea | Sección |
|---|---|---|
| **Para hacer** | Portada con nuestra propia casa (tipo B de Benahavís) | Portada |
| **Para hacer** | Sección «Proyectos» con dos casos (villa y Benahavís) | Proyectos |
| **Para hacer** | WhatsApp siempre visible | Conversión |
| **Para hacer** | Portada a la mitad de alto (unos 7.000 px) | Textos |
| Me gusta (entra en la fase 1) | Dos caminos: agencias y promotoras | Conversión |
| Me gusta | Tarjeta flotante «Entra en la casa» | Portada |
| Me gusta | Una frase en la portada, no un párrafo | Textos |
| Me gusta | Una página por proyecto | Proyectos |
| Me gusta | Explorador de lo que entregamos | Producto y demos |
| Me gusta | Botón fijo «Ver en 3D» en la cabecera | Producto y demos |
| Me gusta | Demo de Benahavís como caso estrella (cuando esté lista para clientes) | Producto y demos |
| Me gusta | Interruptor día / noche | Movimiento |
| Me gusta | Cifras propias, nada prestado | Confianza |
| Me gusta | Formulario «Sube tu plano» | Conversión |
| Me gusta | Bandas oscuras a sangre entre láminas claras | Estética |
| Sin decidir | Renders que se revelan en arco | Movimiento |
| Descartada | Showreel de 30 segundos | Movimiento |
| Descartada | Testimonio de Jurgita | Confianza |

## Decisiones pendientes
- ¿Titulares con más emoción en las bandas oscuras? Hoy solo Archivo; se podría probar una serif de titular.
- ¿Texto sobre los renders (hero, tarjetas)? Si se hace, con velo oscuro y contraste suficiente.
- ¿Precio en la portada? Mantener «desde» o separar agencias (precio cerrado) y promotoras (a medida).
- ¿Showrooms de promociones dentro de la web o en su propia dirección (por ejemplo benahavis.homeview3d.com)?
- ¿Más idiomas (alemán, neerlandés, sueco)?

