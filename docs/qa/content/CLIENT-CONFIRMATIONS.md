# Confirmaciones del cliente antes del lanzamiento

Fecha: 28 de septiembre de 2026 (actualizado el 29 de septiembre de 2026: §5, §13 y nuevo §14) · Para: el propietario de Estudio 3D (nombre provisional).

La web publica precios, plazos y compromisos concretos, y los asistentes de IA y los buscadores los van a citar tal cual. Hoy todos son una **propuesta** (`build/data/pricing.mjs` tiene `confirmed: false`). Revisa cada punto y marca una opción:

- ✅ **Confirmo** tal como está.
- ✏️ **Cambiar a:** escribe el valor correcto.
- ❌ **Quitar** de la web.

Cuando todo esté marcado, el equipo aplica los cambios en un solo sitio (`build/data/*.mjs` y las páginas indicadas) y activa `confirmed: true`. Detalle técnico y citas exactas: [`CONTENT-AUDIT.md`](CONTENT-AUDIT.md).

---

## 1. Identidad y datos legales (bloquean el lanzamiento)

- [ ] **Nombre comercial y logotipo.** Hoy: «Estudio 3D» (provisional). → ✏️ ______
- [ ] **Razón social, NIF, domicilio y datos registrales** (aviso legal y privacidad, art. 10 LSSI). Hoy: `[RAZÓN SOCIAL]`, `[NIF]`, `[DOMICILIO]`. → ✏️ ______
- [ ] **Dominio definitivo.** Hoy: `estudio3d.example`. → ✏️ ______
- [ ] **Email, teléfono y WhatsApp** de contacto. Hoy: `hola@estudio3d.example`, `+34 600 000 000`. → ✏️ ______
- [ ] **Base del estudio.** La web dice ahora, en la primera frase de la portada, de las zonas y de las páginas para inmobiliarias y promotoras, «estudio de visualización 3D con base en Marbella» / «based in Marbella» (coincide con `site.base.locality`). ¿Marbella es correcto para decirlo en público? → ✅ / ✏️ ______
- [ ] **Año de fundación: 2026.** → ✅ / ✏️
- [ ] **Proveedor de correo electrónico** (la política de privacidad dice «nuestro proveedor de correo» sin nombrarlo). → ✏️ ______ (y si trata datos fuera del EEE, con qué garantía).
- [ ] **Alojamiento y formulario en Netlify** (EE. UU., Marco de Privacidad UE-EE. UU.). → ✅ / ✏️
- [ ] **Cookies:** la web guarda en `sessionStorage` la página de entrada, la web de origen y los parámetros UTM sin pedir consentimiento. Que lo revise tu asesor legal (art. 22.2 LSSI). → ✅ revisado / ✏️ cambiar a «solo al empezar el formulario».

## 2. Precios (todos sin IVA)

- [ ] **Plano 3D:** 149 € por planta hasta 150 m²; 219 € por planta de 151 a 300 m². → ✅ / ✏️
- [ ] **Maqueta 3D completa:** 490 € por vivienda hasta 150 m²; 690 € hasta 300 m². → ✅ / ✏️
- [ ] **La maqueta se cobra por superficie total de la vivienda**, tenga una o varias plantas (una villa de 2 plantas y 200 m² = 690 €). La web ya aplica esta regla en todas las páginas (la de Marbella decía que las villas «con sótano, planta baja y planta alta» iban a presupuesto; ahora solo van a presupuesto las de más de 300 m²). ¿Es correcta? → ✅ / ✏️ ______
- [ ] **Promoción de obra nueva:** desde 1.490 € hasta 3 tipologías; tipología adicional 390 €. → ✅ / ✏️
- [ ] **Viviendas de más de 300 m²:** precio cerrado al ver el plano. → ✅ / ✏️
- [ ] **Fachadas y exteriores completos con entorno:** presupuesto aparte (no incluidos en ningún pack). → ✅ / ✏️
- [ ] **Extras:** render adicional 4K 90 €; home staging virtual 60 € por estancia; urgencia +30 % sobre el total; renovación del visor 49 € por vivienda y año. → ✅ / ✏️
- [ ] **Pack cartera:** 5 maquetas completas por 2.090 € (418 €/vivienda), para usar en 6 meses, viviendas de hasta 150 m². → ✅ / ✏️
- [ ] **Tramos de la calculadora:** 490 € (1 a 4 viviendas), 418 € (5 a 9), 390 € (10 a 20), **aplicado a todas las viviendas del encargo**. La web ya lo explica así («el precio baja para todas las del encargo, no solo a partir de la quinta») y lo limita a viviendas de hasta 150 m² (el tramo de 490 €). No dice si los tramos exigen el plazo de 6 meses del pack cartera. → ✏️ condiciones: ______
- [ ] **Más de 20 viviendas:** ¿presupuesto a medida? → ✅ / ✏️
- [ ] **Viviendas de la misma tipología** (apartamentos iguales en un edificio): la página de alquiler vacacional promete que «cuesta menos trabajo» y que se tendrá en cuenta al presupuestar. ¿Hay descuento? → ✏️ ______
- [ ] **Validez de los precios publicados.** La web dice «Precios publicados en septiembre de 2026» y que el precio confirmado por escrito se mantiene aunque cambie la tarifa. Los datos estructurados dicen válidos hasta el 31/12/2027. ¿Cuánto tiempo vale un presupuesto enviado? → ✏️ ______ días.
- [ ] **«Para una vivienda estándar no hace falta pedir presupuesto»**: ¿aceptas encargos directos a precio de tarifa, sin conversación previa? → ✅ / ✏️

## 3. Qué incluye cada pack

- [ ] **Plano 3D:** planta cenital a color en 4K, vista isométrica amueblada en 4K, planta 2D redibujada, 1 ronda de cambios. **No se entrega el modelo 3D.** → ✅ / ✏️
- [ ] **Maqueta 3D completa:** modelo amueblado con materiales a medida, **6 renders 4K** con los encuadres que elija el cliente, planta cenital y planta 2D, visor web con estancias, recorrido y modo maqueta, realidad aumentada (maqueta 1:20 y tamaño real, iPhone y Android), 12 meses de alojamiento del visor, 2 rondas de cambios. → ✅ / ✏️
- [ ] **Promoción:** 3 tipologías modeladas y amuebladas, 12 renders 4K, visor con selector de tipología, realidad aumentada para ferias y sala de ventas, 2 rondas de cambios. → ✅ / ✏️
- [ ] **¿La promoción incluye alojamiento del visor?** Hoy no se dice (la maqueta sí dice 12 meses). → ✏️ ______ meses.
- [ ] **Home staging virtual:** 60 € por estancia redecorada, solo sobre una maqueta o promoción. Los cambios puntuales (otro sofá, suelo más claro) entran en las rondas de cambios; el staging es la redecoración completa con renders recalculados. → ✅ / ✏️
- [ ] **Reformas con otra distribución:** «versión aparte, con presupuesto antes de empezar». → ✅ / ✏️
- [ ] **Jardín, piscina y parcela:** «se incluyen si aparecen en el plano; confirmamos alcance y precio». → ✅ / ✏️
- [ ] **Otros idiomas del visor** (además de español e inglés): la web invita a «preguntar por más idiomas». ¿Lo ofreces? ¿Con coste? → ✏️ ______

## 4. Plazos y rondas de cambios

- [ ] **Plazos:** plano 3D 2 a 3 días laborables; maqueta 3 a 5; promoción de hasta 3 tipologías 7 a 10. → ✅ / ✏️
- [ ] **¿Cuánto añade cada tipología extra al plazo de una promoción?** Hoy no se dice. → ✏️ ______
- [ ] **Desde cuándo cuentan los días y si incluyen las rondas.** La web usa ya una sola frase en todas las páginas (portada, servicios, plano, cómo funciona, preguntas frecuentes): «Los días cuentan desde que tenemos el plano y una medida de referencia, e incluyen las rondas de cambios si nos las envías en 24 h.» Falta alinear el texto del proceso compartido (`build/data/process.mjs`). ¿Confirmas la regla, incluido el plazo de 24 h para enviar los cambios? → ✅ / ✏️ regla: ______
- [ ] **Qué es una ronda:** una lista de cambios enviada de una vez (muebles, materiales, colores, encuadres, mover un tabique o una puerta); redistribuir la planta entera es otro proyecto. → ✅ / ✏️
- [ ] **Precio de una ronda adicional o de cambios tras la entrega:** hoy «te decimos el precio antes». ¿Quieres publicar una tarifa? → ✅ / ✏️ ______
- [ ] **Urgencia 48 h (+30 %):** ¿para qué packs vale (plano 3D, maqueta, promoción)? ¿Incluye las 2 rondas? → ✏️ ______
- [ ] **Promociones con fecha de feria:** «dinos el día y te confirmamos por escrito si llegamos, antes de que pagues». → ✅ / ✏️

## 5. Entregables y formatos

- [ ] **Archivo BLEND (Blender).** La web decía seis cosas distintas. Ahora todas las páginas dicen lo mismo, que es lo que ya mostraban `deliverables.mjs` y la tabla de precios: **con la maqueta recibes el modelo en GLB, USDZ y BLEND** (el plano 3D solo entrega imágenes). Si eliges otra opción, hay que cambiar esa frase en unas 10 páginas. Elige una:
  - [ ] Siempre incluido con la maqueta y la promoción.
  - [ ] Solo si el cliente lo pide, sin coste.
  - [ ] Solo si el cliente lo pide, con coste de ______ €.
  - [ ] No se entrega.
- [ ] **Qué significa «4K».** Propuesta: 3.840 px en el lado largo. Los renders de la villa de demostración miden de 2.000 a 2.800 px de ancho. ¿Entregas 4K reales en encargos? → ✅ / ✏️ ______
- [ ] **Formatos:** renders en PNG y JPG; plantas en PNG; modelo en GLB y USDZ; visor como enlace e iframe. → ✅ / ✏️
- [ ] **Crédito en el visor incrustado:** «incluye un pequeño crédito de texto a Estudio 3D». ¿Siempre? ¿Se puede quitar (marca blanca)? ¿Con coste? → ✏️ ______
- [ ] **Etiquetado de las imágenes.** La web promete entregar cada render «con la mención» y cada imagen con staging «con la mención Recreación virtual». Decide:
  - Texto de los renders: → ✏️ propuesta «Render 3D. Imagen orientativa; mobiliario no incluido.»
  - Texto del staging: → ✏️ propuesta «Recreación virtual. Mobiliario no incluido.»
  - Obra nueva: → ✏️ propuesta añadir «no contractual».
  - ¿Va **impreso en la imagen** (marca de agua) o como **pie de foto / nombre de archivo** que la agencia pone en el anuncio? La web usa ya los tres textos propuestos y dice que se entregan «como texto para el pie de foto». → ✅ pie de foto / ✏️ marca de agua
- [ ] **Datos de la villa de demostración:** la web dice ahora «13 imágenes (6 vistas aéreas, 4 a la altura de los ojos, las dos plantas y la imagen para redes) en unos 21 minutos» (6,9 min las 9 primeras + 14,4 min los 4 interiores nuevos, según `source/villa3d/renders/_timings.json`), baños «2 (suite con bañera y ducha)» / «2 (en-suite with tub and shower)», que ahora sale de `villa.specs.bathrooms` y aparece en la ficha técnica del caso (la ficha se ha recortado a los datos técnicos que no están en el cajetín: huella, baños, texturas, materiales, triángulos, alturas de muro y de corte, compresión y pesos de los archivos de realidad aumentada) y «una sola sesión de trabajo». La frase «rehacer la exportación tarda unos 26 segundos» se ha quitado hasta que se vuelva a medir. ¿Todo correcto? → ✅ / ✏️
- [ ] **Interiores a la altura de los ojos (nuevos):** 4 renders (salón, dormitorio principal, baño en suite y terraza) con techo, lámparas encendidas y cámara a 1,60 m. Se usan en la galería del caso, en las páginas de renders y de home staging (portada y galería), en la celda «Renders fotorrealistas» de la portada, en la página de Málaga y como imagen lateral en varias páginas. **El cielo y el mar que se ven por las ventanas son un fondo ilustrativo, no el entorno real de la villa**, y la web lo dice en la galería del caso y en la de renders. ¿Te parece bien mostrar mar de fondo en un caso anonimizado, o prefieres un cielo sin mar? → ✅ / ✏️

## 6. Pago y facturación

- [ ] **Se paga al recibir el trabajo terminado, sin adelanto ni tarjeta**, también en promociones de 1.490 € o más y en el pack cartera. → ✅ / ✏️ (por ejemplo, 50 % al empezar en promociones).
- [ ] **Plazo de pago de la factura:** hoy no se dice. → ✏️ ______ días.
- [ ] **Forma de pago:** transferencia, tarjeta, otra. → ✏️ ______
- [ ] **Pack cartera:** ¿se paga entero al contratarlo o por vivienda entregada? → ✏️ ______
- [ ] **Visor con factura impagada:** ¿se publica el visor antes del pago? ¿Qué pasa si no se paga? → ✏️ ______
- [ ] **IVA:** todos los precios sin IVA; IVA del 21 % en factura; a empresas de fuera de España «te confirmamos cómo se aplica». → ✅ / ✏️

## 7. Demo gratis

- [ ] **Qué es:** una estancia del plano del cliente, modelada en 3D y enviada con realidad aumentada, gratis y sin compromiso, sin tarjeta ni firma. → ✅ / ✏️
- [ ] **¿Incluye también enlace al visor?** La guía de Matterport lo prometía («con visor y realidad aumentada»); ahora dice, como el resto, «te la mandamos en realidad aumentada». → ✅ solo AR / ✏️ añadir visor
- [ ] **Plazo de entrega de la demo:** hoy no se dice. → ✏️ ______
- [ ] **Límite:** ¿una demo por cliente, por agencia, por vivienda? → ✏️ ______
- [ ] **¿Qué estancia?** ¿La elige el cliente o el estudio? → ✏️ ______
- [ ] **En la captación:** la página de inmobiliarias dice que la agencia puede llevar la estancia de demo a la cita con el propietario. ¿De acuerdo? → ✅ / ✏️

## 8. Alojamiento del visor

- [ ] **12 meses incluidos con la maqueta, contados desde:** ☐ la entrega ☐ el pago ☐ otro: ______
- [ ] **Renovación:** 49 € + IVA por vivienda y año. → ✅ / ✏️
- [ ] **Si no se renueva:** se retira el visor y la realidad aumentada por enlace; el cliente conserva renders y archivos. → ✅ / ✏️
- [ ] **Retirada anticipada a petición** (vivienda vendida). → ✅ / ✏️
- [ ] **¿Aviso antes de que caduque?** (recomendado). → ✅ / ✏️

## 9. Derechos de uso y confidencialidad

- [ ] **Uso de renders, plantas, visor y archivos** para comercializar esa vivienda en cualquier canal (web, portales, redes, dosier, **prensa** y cartelería), sin pagar por cada uso. → ✅ / ✏️
- [ ] **Duración:** ☐ indefinida ☐ mientras se comercializa la vivienda ☐ otra: ______
- [ ] **¿Exclusiva?** ¿Puede el estudio reutilizar muebles, materiales o partes del modelo en otros encargos? → ✏️ ______
- [ ] **Ceder a terceros:** una promotora puede dar el material a sus agencias colaboradoras (lo recomienda la guía de venta sobre plano); un arquitecto puede «reutilizar la geometría amueblada en las presentaciones de ese proyecto». ¿Autorizado? ¿Otros casos «lo hablamos antes»? → ✏️ ______
- [ ] **Portfolio del estudio:** solo se enseña una vivienda de cliente con **permiso por escrito**, y anonimizada. → ✅ / ✏️
- [ ] **Acuerdo de confidencialidad (NDA):** «firmamos uno antes de recibir los planos si tu promotora lo necesita». ¿Firmas el modelo del cliente? → ✅ / ✏️
- [ ] **Conservación de planos:** mientras dura el encargo y el alojamiento; 12 meses si no hay encargo; borrado a petición con confirmación por escrito. La página «Sobre nosotros» ya dice lo mismo que la política de privacidad. → ✅ / ✏️

## 10. Atención y respuesta

- [ ] **Respuesta en 24 h laborables** (en inglés «within one working day»), siempre de una persona, con precio y plazo cerrados o con las dudas sobre el plano. → ✅ / ✏️
- [ ] **Horario y festivos:** «si escribes en fin de semana o festivo, el plazo empieza el siguiente día laborable»; zona horaria de España. → ✅ / ✏️
- [ ] **Canales:** formulario, email, teléfono y WhatsApp, todos con el mismo plazo; videollamada para dudas. → ✅ / ✏️
- [ ] **Idiomas:** español e inglés (web, visor y atención). → ✅ / ✏️
- [ ] **Enlace de reserva de llamada** (por ejemplo, 15 minutos en Cal.com): hoy no hay. → ✏️ ______ / ❌
- [ ] **Formulario:** un archivo de hasta 8 MB (PDF, JPG, PNG, DWG, DXF); para más, enlace de descarga o email. → ✅ / ✏️

## 11. Cobertura

- [ ] **Toda España en remoto, mismo precio y plazo en cualquier zona.** → ✅ / ✏️
- [ ] **Viviendas fuera de España y agencias extranjeras** (la versión en inglés dice «and abroad»). → ✅ / ✏️
- [ ] **Nunca hay visita a la vivienda** (y por tanto nunca coste de desplazamiento). → ✅ / ✏️

## 12. Uso de IA y transparencia

- [ ] **Mencionar públicamente que usáis Claude, de Anthropic.** La web ya aplica la propuesta: Claude se usa solo «para escribir y depurar los scripts de Python» (se quitó «dirección técnica»). → ✅ / ✏️ / ❌ no nombrar a ningún proveedor
- [ ] **Política publicada:** geometría construida por scripts (no generada por IA), revisión humana de cada entrega contra el plano, renders calculados con Cycles, staging siempre etiquetado. → ✅ / ✏️
- [ ] **Servicios «próximamente»:** vídeos cinematográficos con IA (etiquetados como tales) y tours de realidad virtual 360°. ¿Siguen en tus planes? → ✅ / ❌ quitar

## 13. Datos de terceros (revisar justo antes de publicar)

Todos se han verificado el 28 de septiembre de 2026 (ver `CONTENT-AUDIT.md` §3). Si la web se publica más tarde:

- [ ] **Actualizar la fecha «consultado el 28 de septiembre de 2026»** y revisar las tarifas de la competencia: BoxBrownie, homestagerdesign, inmofotomadrid, ararenders, estudio3dbs, proyecto3dvalencia, studiomkdesign, renders.es, maverickframe, vistastudiodesign, cronoshare, tucasaapunto, pedra.ai, floorplanner, r2u, RealSpace 3D, Matterport y el proveedor Matterport de Málaga.
- [ ] **Datos consultados el 29 de septiembre de 2026** (revisar con la misma regla): la versión en inglés de la guía de precios del plano 3D (todas sus fuentes, más CubiCasa: plano 3D amueblado a 65 € en 48 h, precio que su web muestra para España) y la nueva comparativa de estudios (§14): Viseni, Improntia, Persuadis e Inmoshowroom, Floorfy, Matterport, andreasgrunau.com, CubiCasa, BoxBrownie, Home Stager Design y Vista Studio.
- [ ] **Estadísticas oficiales:** la Estadística Registral Inmobiliaria del 3.er trimestre de 2026 saldrá en diciembre; el INE publica cada mes. Decide si se actualizan o se mantiene «2.º trimestre de 2026».
- [ ] **Revisión legal** de la guía «Cómo vender viviendas sobre plano», el aviso sobre el Reglamento europeo de IA (fecha del 2 de agosto de 2026) y las menciones al RD 515/1989, por tu asesor jurídico. La web ya dice «no es asesoramiento jurídico».

## 14. Comparativa «Mejores estudios de visualización 3D en España» (nueva)

Página nueva en `/guias/mejores-estudios-visualizacion-3d-espana/` y `/en/guides/best-3d-visualisation-studios-spain/` (`build/content/guia-mejores.mjs`). Lista 10 opciones reales (Viseni, Improntia, Persuadis, Floorfy, Matterport, CubiCasa, BoxBrownie, Home Stager Design, Vista Studio y Estudio 3D), agrupadas por tipo de servicio y no ordenadas por calidad, con un aviso destacado de parte interesada. Cada dato de un tercero sale de su propia web, consultada el 29 de septiembre de 2026, y solo se da precio si la empresa lo publica. Compromisos nuevos que la web hace en tu nombre:

- [ ] **Publicar una comparativa que nombra a competidores.** Es publicidad comparativa: que la revise tu asesor legal antes de publicar (art. 10 de la Ley 3/1991 de Competencia Desleal; datos objetivos, verificables y sin denigrar). → ✅ revisado / ✏️ cambios: ______ / ❌ no publicar
- [ ] **Revisión trimestral de la lista**; la página anuncia la próxima para **diciembre de 2026** y promete cambiar la fecha de actualización cuando cambie un dato. ¿Quién la hace? → ✅ / ✏️ ______
- [ ] **«Ninguna empresa ha pagado por aparecer» y «no cobramos por aparecer ni por el orden».** → ✅ / ✏️
- [ ] **Inclusión a petición:** un estudio que encaje con los criterios y publique lo que ofrece entra en la siguiente revisión trimestral; las correcciones de datos se piden por email. → ✅ / ✏️ / ❌ quitar
- [ ] **Qué no hacemos**, dicho en público: fotografía, vídeo con dron y escaneos; la fachada completa con entorno se presupuesta aparte. → ✅ / ✏️

---

**Firma y fecha de la confirmación:** ______________________
