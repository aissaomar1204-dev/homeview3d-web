# 07 · Set de renders fotorrealistas y AR de sobremesa (villa en la Costa del Sol)

Fecha: 28-09-2026. Blender 5.2.1 LTS en modo headless, Cycles en GPU (RTX 4060, OptiX) y denoiser
OpenImageDenoise en GPU. Todo es reproducible con scripts: consulta
`source/villa3d/blender/README.md` para los comandos.

## Resultado

Carpeta: `source/villa3d/renders/`. Todos los archivos son PNG de 8 bits. `<nombre>.png` es RGBA
transparente, con la sombra de contacto en el canal alfa (sirve para poner la maqueta "flotando"
sobre cualquier fondo, también oscuro, sin halos). `<nombre>_opaco.png` es la misma imagen compuesta
sobre #EFEBE4.

| # | Archivo | Resolución | Contenido | Tiempo |
|---|---|---|---|---|
| 1 | `villa_maqueta_iso.png` + `_opaco` | 2800×1800 | Hero 3/4 aérea de la maqueta seccionada (azimut -32° como el visor, elevación 42°) | 71 s |
| 2 | `villa_planta_cenital.png` + `_opaco` | 2400×3700 | Planta ortográfica a color, norte arriba | 102 s |
| 3 | `villa_plano_lineas.png` | 2400×3700 | Plano 2D: poché negro en muros, suelos gris muy claro, mobiliario en línea fina sobre blanco. **Coincide píxel a píxel con el #2** | 8 s |
| 4 | `villa_salon_dormitorio.png` + `_opaco` | 2400×1600 | Salón y dormitorio principal a 47°, con DOF suave | 34 s |
| 5 | `villa_dormitorios.png` + `_opaco` | 2400×1600 | Ala de dormitorios, baño completo y terraza norte con escalera de caracol | 40 s |
| 6 | `villa_bano_suite.png` + `_opaco` | 2000×1600 | Baño en suite: bañera exenta, sanitarios, lavabo sobre encimera y pared de terrazo | 29 s |
| 7 | `villa_terraza.png` + `_opaco` | 2400×1600 | Terraza principal: tumbonas, sofá exterior y olivo, con el salón al fondo | 41 s |
| 8 | `villa_muros_completos.png` + `_opaco` | 2800×1800 | Muros a altura completa (sin corte), vista aérea exterior 3/4 | 73 s |
| 9 | `og_image.png` | 1200×630 | Opaca, maqueta completa desde el oeste a ras de marco, pensada para tarjetas sociales | 10 s |

- **Tiempo total del set:** unos 7 minutos, incluida la carga (objetivo: menos de 40 min).
- **Muestras:** 512 en las vistas generales y 384 en los primeros planos, con muestreo adaptativo
  (umbral 0,01) y OIDN.
- **Previsualizaciones:** a 30 % tardan unos 25 s el set entero.
- **Control de calidad:** en todas las tomas quedan quemados menos del 0,002 % de los píxeles, no hay
  fotogramas negros y las 39 texturas cargan sin materiales rosa. `_timings.json` guarda las
  estadísticas por toma.

Otros archivos:

- `source/villa3d/blender/villa_renders.blend`: escena guardada con las 8 cámaras (`CAM_*`),
  colecciones por rol y rutas de textura relativas.
- `source/villa3d/blender/villa_render.py` y `export_usdz_mesa.py`: los scripts. `README.md` explica
  su uso.
- `source/villa3d/blender/import/`: copia importable del glTF. Los originales no se han modificado.

## Look y decisiones técnicas

- **Luz de media tarde mediterránea.** Sol cálido desde el ONO (292°, 38°) con ángulo de 1,6° para
  sombras suaves, y cielo físico (Sky Texture multiple scattering) algo desaturado como luz ambiente.
  En los interiores y en la planta el sol sube a 50-52° para que los muros cortados a 1,15 m no dejen
  las estancias en sombra. La luz llega desde arriba a la izquierda en planta, que es la convención
  clásica. AgX con el look Medium High Contrast.
- **Corte de maqueta.** Los objetos con material `*_Alto` se separan en una colección aparte. En modo
  maqueta se ocultan y se mantienen las tapas `Corte_Seccion` (poché gris antracita). En "muros
  completos" se muestran los `_Alto` y se ocultan las tapas.
- **Sombra sobre fondo.** El suelo es un *shadow catcher* situado bajo la base. El fondo opaco se
  compone después en sRGB, así que #EFEBE4 sale exacto.
- **Escalera de caracol.** Sube 2,6 m y su sombra quedaba en el suelo como un anillo suelto junto a la
  maqueta. Se resolvió con *light linking*: el sol que ilumina el suelo no ve la escalera, y la
  escalera sigue proyectando sombra sobre la propia terraza.
- **Plano de líneas.** Material de emisión plana por objeto con Freestyle (siluetas, bordes y
  pliegues a 1,6 px):
  - Negro solo para las tapas de muros y tabiques.
  - Blanco con contorno para las tapas de armarios, carpinterías y puertas.
  - Suelos en #F1F1F1 y terrazas en #E9E9E9.

  Alineación comprobada con el #2: el 99 % del poché negro del plano cae sobre el poché del render a
  color, y los contornos coinciden con un margen de ±3 px (el grosor de línea).
- **Vidrios.** Se cambiaron de alpha a transmisión real, de modo que a través de las correderas se ve
  el suelo. Los espejos pasan a ser metálicos.

## AR de sobremesa (opcional): funcionó

`source/villa3d/ar/villa_maqueta_mesa.usdz`, **10,2 MB** (objetivo: menos de 12 MB).

- **Escala y corte:** escala 1:20 (0,458 × 0,705 m y 0,16 m de alto) con el corte aplicado (se
  eliminaron 131 objetos `_Alto`).
- **Orientación y origen:** Y-up y `metersPerUnit` = 1, con el mismo convenio que
  `villa_tamano_real.usdz`. La planta está centrada en el origen y la base apoya en y = 0.
- **Contenido:** 606 mallas y 66 materiales UsdPreviewSurface. Las 39 texturas van empaquetadas,
  reducidas a 512 px.
- **Validación:** abierto con `pxr` sin texturas faltantes, con el paquete sin comprimir y alineado a
  64 bytes, como exige el formato usdz. Reimportado en Blender, se ve bien: texturas, corte y poché
  correctos.
- **Tamaño con texturas a 1024 px:** 12,75 MB, por eso se usa 512. La geometría (usdc) pesa por sí
  sola 8,5 MB.
- **Pendiente:** no se ha probado en un iPhone real. Queda verificarlo en AR Quick Look.

## Problemas encontrados y cómo se resolvieron

1. **Override del plano en negro.** Con datos persistentes, el override de material leía negro porque
   la propiedad de objeto se asignaba después de sincronizar. Ahora se asigna al construir la escena y
   se marca `update_tag()`.
2. **Tapas de mobiliario en negro.** En el plano, las tapas de armarios se veían negras. Ahora se
   clasifican por el nombre original del objeto: solo `Muro*`, `Tabique*`, `Patinillo*` y `Alicatado*`,
   sin ventanas ni puertas, van en negro.
3. **OG pequeña.** Con el ángulo del hero, en 1,9:1 la maqueta quedaba diminuta. Se cambió a una vista
   desde el oeste, con la luz lateral del SSO, que llena el marco.
4. **Primer plano del baño.** Tenía el dormitorio en media imagen. Ahora encuadra desde el ENE: la
   bañera y los sanitarios quedan al centro y el dormitorio en un lateral.
5. **Freestyle** avisa de "degenerated triangle / edge appears twice". Es inocuo y se filtra del log.
6. **Limitaciones del modelo, no del render.** La bañera exenta, blanca y con mucho sol, se lee casi
   como un cilindro macizo, aunque la geometría tiene cubeta (fondo a 0,10 m). El follaje del olivo es
   escaso. Mejorarlo sería trabajo de modelado.

## Recomendaciones para la web

- **Hero:** `villa_maqueta_iso.png`, transparente, sobre el fondo del sitio. En móvil funciona
  recortado al centro.
- **Deslizador "plano 2D -> 3D":** `villa_plano_lineas.png` y `villa_planta_cenital_opaco.png`. Tienen
  el mismo tamaño y la misma alineación, así que basta con apilarlas con `object-fit` idéntico.
- **Imagen social:** `og_image.png` sirve tal cual para `og:image` y `twitter:image` (1200×630).
- **Formato y peso:** convertir a AVIF/WebP en varios anchos. Los PNG maestros pesan entre 3 y 9,6 MB y
  no deben servirse directamente, porque penaliza el LCP. Conviene mantener el PNG solo para la
  descarga o como fuente.
- **Texto alternativo:** todas las imágenes son del caso anonimizado "villa en la Costa del Sol"; no
  incluyen marca ni logotipo, así que se pueden reutilizar cuando exista la marca. Ejemplos de `alt`:
  "Maqueta 3D seccionada de la planta alta de una villa en la Costa del Sol generada a partir de un
  plano 2D" o "Plano 2D y render 3D de la misma planta".
