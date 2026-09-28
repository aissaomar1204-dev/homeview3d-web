# 06 · Pipeline 3D/AR y visor web (`<model-viewer>`): entrega optimizada del modelo demo

> Fecha: 2026-09-28 · Método: pipeline construido y ejecutado sobre la villa demo (`source/villa3d/`), validado con el glTF-Validator oficial de Khronos, con un script de verificación propio y en navegador (Chromium vía `playwright-cli`, con red y CPU limitadas por CDP). La documentación la sacan de fuentes primarias: el código fuente de `@google/model-viewer` 4.3.1 (`src/features/ar.ts`, `loading.ts`, `CachingGLTFLoader.ts`, `SmoothControls.ts`), su `docs.json`/`faq.json`, Google Scene Viewer, Apple AR Quick Look y el código de glTF-Transform 4.5.1.
> Convención: `[MARCA]` = nombre del estudio (sin decidir) · `dominio.tld` = dominio definitivo. En producción `public/` es la raíz del sitio: `public/models/villa.glb` se sirve como `/models/villa.glb`.
> Todas las cifras de este documento se han **medido hoy** sobre los ficheros generados, salvo las que se marcan como «(doc.)», que proceden de la documentación.

---

## 0. Resumen (TL;DR)

1. **El GLB web baja de 10,74 MB a 2,99 MB** (3,13 MB decimales; 2,36 MB con gzip). Las *draw calls* pasan de **737 a 102**. Se conservan los **82 nombres de material**, incluidos los **21 `_Alto`** del corte, los **178.704 triángulos** (idénticos por material) y el **bounding box** (desviación máxima de 0,10 mm). La cuantización mueve la geometría como mucho 0,10 mm, así que los *hotspots* siguen en su sitio; en el navegador los de las esquinas SO (0,0) y NE (9,1; 14,05) caen justo sobre las esquinas del forjado.
2. **Técnicas:** `dedup` (sin fusionar nombres distintos), `prune`, `weld`, `join` por material (el vidrio se deja por objeto), cuantización de 16 bits sobre el volumen de toda la escena, **EXT_meshopt_compression** (normales octaédricas de 8 bits) y texturas **WebP** (color como máximo a 2048 px con q82; normales como máximo a 1024 con q85, y a 512 las de ruido de alfombras y césped).
3. **Scene Viewer (Android) no admite meshopt, cuantización ni WebP** (solo `KHR_materials_unlit` y `KHR_texture_transform`, según su documentación). Por eso se genera un segundo fichero, **`villa-ar.glb` (7,89 MB)**, en glTF plano con JPEG. En `<model-viewer>` usamos `ar-modes="webxr quick-look"` y lanzamos Scene Viewer nosotros con el GLB plano (§6).
4. **`model-viewer` 4.3.1 autoalojado** (1,02 MB; 0,22 MB con brotli). **Ojo: en 4.x meshopt está DESACTIVADO por defecto.** Hay que definir `ModelViewerElement.meshoptDecoderLocation` antes de crear el primer visor; si no, el GLB no carga (§3).
5. **Core Web Vitals:** el **póster AVIF es el LCP** (48–508 ms según el perfil de red, CLS 0). El JS del visor se carga **por intención** (hover, foco o visibilidad en conexiones rápidas) y el GLB **solo al pulsar «Explorar en 3D»**. Del clic al primer frame: **1,5 s** con cable, **4,0 s** en 4G rápido y **18 s** en «Slow 4G» (perfil móvil de Lighthouse). El cuello de botella es la descarga del GLB, no el JS.
6. **AR en iOS:** `<a rel="ar">` con `<img>` como primer hijo, HTTPS, `Content-Type: model/vnd.usdz+zip`. Ofrecemos **dos ficheros**: tamaño real con `#allowsContentScaling=0` y **maqueta 1:20 (nuevo: `villa_maqueta_1a20.usdz`, ya cortada a 1,15 m y validada con USD 26.8 sin errores)**. Hay además un banner de Quick Look con **`callToAction=Pedir presupuesto`**: al tocarlo se dispara el evento `message` y abrimos el formulario (§5). Esto es captación de leads dentro de la AR.
7. **Hallazgo importante:** en el USDZ y en el GLB, **el suelo de la villa está 0,60 m por encima del fondo de la peana (`Base_Maqueta`)**. Quick Look apoya el origen del modelo en el suelo real, así que al «entrar» a tamaño real el suelo virtual flota 60 cm. Se ha generado un candidato corregido, `source/villa3d/ar/candidatos/villa_tamano_real_suelo0.usdz`, que hay que **probar en un iPhone** (§5.4).
8. **QR para escritorio:** se generan **en el build como SVG inline** con `uqr` (MIT, sin dependencias) y un *path* compacto. Probado: el QR generado se decodifica bien. **El QR apunta a una página `/ar/villa/`**, nunca al fichero, porque las apps de cámara no abren `intent://` y Android exige un gesto del usuario (§7).
9. **CSP probada:** el visor necesita `'wasm-unsafe-eval'` en `script-src` (meshopt es WebAssembly) y `blob:` en `img-src` y `connect-src`. **Sin `blob:` el modelo «carga» sin texturas y sin ningún error visible en la página** (117 errores solo en la consola). Hay que incluirlo en el QA (§8.3).
10. **Riesgos abiertos:** ~**199 MB de memoria GPU** en texturas (RGBA8 con mipmaps), un riesgo en iPhones antiguos (KTX2 es la solución, §2.5). No sabemos si Netlify comprime `model/gltf-binary`, así que hay que comprobarlo tras el primer deploy. El `villa-ar.glb` tiene 178 k triángulos y 82 materiales, por encima de lo que recomienda Scene Viewer (100 k y 10), así que hay que probarlo en un Android real. Y model-viewer 4.3.x deja 4 `console.log` de depuración (no son errores).

---

## 1. Qué se ha construido

### 1.1 Ficheros

| Ruta | Qué es | Tamaño |
|---|---|---|
| `source/villa3d/gltf-clean/villa.gltf` + `villa.bin` + `tex/` | Copia limpia y **válida** (0 errores en el validador) del export de Blender | 10,74 MB |
| `public/models/villa.glb` | **Visor web**: meshopt + cuantización + WebP | **2,99 MB** |
| `public/models/villa-ar.glb` | **Scene Viewer (Android)** y *fallback*: glTF plano con JPEG | 7,89 MB |
| `public/models/villa-ar-maqueta.glb` | Scene Viewer de mesa: escala 1:20 y sin geometría `_Alto` | 6,63 MB |
| `public/models/villa_tamano_real.usdz` | iOS Quick Look a tamaño real (copia literal del original) | 10,23 MB |
| `public/models/villa_maqueta_1a20.usdz` | iOS Quick Look de mesa: 1:20 y cortada a 1,15 m (**nuevo, experimental**) | 9,51 MB |
| `public/models/villa.report.json` | Tamaños, estadísticas y *bounds* para el build del sitio (schema `3DModel`, ficha del caso) | 15 KB |
| `public/img/villa/villa-poster-{640,960,1400}.{avif,webp,jpg}` | Póster (LCP). **Fuera de `/models/`** para que Googlebot pueda leerlo | 11–80 KB |
| `public/lib/model-viewer/model-viewer.min.js` | `@google/model-viewer` 4.3.1 (incluye three r183) | 1.044 KB (brotli 230 KB) |
| `public/lib/model-viewer/meshopt_decoder.js` | Decodificador meshopt como *script* clásico | 29 KB (brotli 7 KB) |
| `public/lib/LICENSES.md` (+ `LICENSE-*.txt/md`, `VERSION.json`) | Licencias y versiones de terceros | — |
| `source/villa3d/test-viewer.html` | Página de prueba (corte, luz, vistas, diagnóstico, *fallback*) | — |
| `source/villa3d/test-viewer-declarativo.html` | Página de prueba con el **marcado recomendado para producción** | — |
| `source/villa3d/ar/candidatos/villa_tamano_real_suelo0.usdz` | Candidato *walk-in*: sin peana y con el suelo en el origen (probar en un dispositivo) | 10,22 MB |
| `docs/research/img/06-*.png` | Capturas de la verificación | — |

### 1.2 Scripts (`package.json`, solo `devDependencies`)

```bash
npm run model:all        # clean -> optimize -> verify -> validate -> poster   (~26 s)
npm run model:clean      # scripts/3d/clean-gltf.mjs     copia limpia + arreglos de validez
npm run model:optimize   # scripts/3d/optimize-glb.mjs   villa.glb, villa-ar.glb, villa-ar-maqueta.glb, copia USDZ, report
npm run model:verify     # scripts/3d/verify-glb.mjs     nombres de material, _Alto, triángulos/material, bounds, extensiones
npm run model:validate   # scripts/3d/validate.mjs       Khronos glTF-Validator (npm gltf-validator)
npm run model:poster     # scripts/3d/poster.mjs         AVIF/WebP/JPG 640/960/1400
npm run vendor:viewer    # scripts/3d/vendor-model-viewer.mjs  descarga model-viewer (npm pack) + decoder meshopt
npm run model:usdz       # scripts/3d/usdz_variants.py   USDZ de mesa y candidato walk-in (requiere: pip install usd-core)
npm run serve            # scripts/serve.mjs  servidor estático local con los MIME de producción (puerto 8799)
```

Dependencias añadidas (solo de desarrollo): `@gltf-transform/core|functions|extensions` 4.5.1, `meshoptimizer` 1.3.0, `sharp` 0.35.5 y `gltf-validator` 2.0.0-dev.3.10. Ninguna llega al navegador.

---

## 2. Optimización del GLB: antes y después

### 2.1 Cifras

| | Original (export Blender) | Copia limpia | **`villa.glb` (web)** | `villa-ar.glb` (Scene Viewer) |
|---|---|---|---|---|
| Tamaño | 10,7 MB (JSON 0,49 + .wasm 5,09 + tex 4,86) | 10,74 MB | **2,99 MB** (gzip 2,36 · br 2,28) | 7,89 MB (gzip 4,89) |
| Geometría | 5,09 MB | 5,10 MB | **1,46 MB** | 5,11 MB |
| Texturas | 4,86 MB (39 JPEG) | 4,86 MB | **1,52 MB** (38 WebP + 1 JPEG) | 2,78 MB (JPEG) |
| Nodos / mallas | 631 / 631 | 631 / 631 | **92 / 92** | 92 / 92 |
| *Draw calls* (primitivas) | 737 | 737 | **102** | 102 |
| Triángulos | 178.704 | 178.704 | 178.704 (sin simplificar) | 178.704 |
| Vértices | 156.423 | 156.423 | 151.164 (weld) | 151.164 |
| Materiales (nombres únicos) | 87 (82) | 87 (82) | 82 (**los mismos 82**) | 82 (82) |
| Materiales `_Alto` | 21 | 21 | **21** | 21 |
| Bounds (m) | x −0,03…9,13 · y −0,60…2,60 · z −14,075…0,025 | = | = (±0,10 mm) | = (exacto) |
| Validador Khronos | **12 errores** (`texCoord: -1`) | 0 errores | 0 errores | 0 errores |
| Extensiones requeridas | — | — | `EXT_meshopt_compression`, `KHR_mesh_quantization`, `EXT_texture_webp` | ninguna |

Tamaño de la escena: **9,16 × 3,20 × 14,10 m**. El centro del bounding box en model-viewer es (4,55; 1,00; −7,025), idéntico al del original.

### 2.2 Qué hace cada paso (`scripts/3d/optimize-glb.mjs`)

1. **`dedup({ keepUniqueNames: true })`** en accesores, mallas, texturas y materiales. **Crítico:** con el valor por defecto (`keepUniqueNames: false`), `dedup` **fusionaría `Pared_Corte` con `Pared_Corte_Alto`** y 16 pares más que son idénticos salvo en el nombre, y el corte dejaría de funcionar. Con `true` solo se fusionan materiales con el mismo nombre y las mismas propiedades (los 3 `Madera_Clara`, los 3 `Madera_Nogal` y los 2 `Lino_Blanco`). Por eso 87 materiales pasan a 82 con **exactamente los mismos nombres**. `palette()` no se usa nunca.
2. **`prune`**: quita 104 UV sin textura, lo que permite juntar más primitivas.
3. **`weld`**: une los vértices idénticos bit a bit (156 k → 151 k).
4. **`join({ keepNamed: false })`**: junta por material los nodos hermanos. Es exacto porque los 631 nodos cuelgan directamente de la escena con transformación identidad (la geometría ya está en coordenadas de mundo). **El vidrio (alpha `BLEND`) se queda por objeto** para que three.js pueda ordenar los paneles entre sí. Los nodos resultantes se llaman `grupo_<Material>`.
5. **Texturas con `sharp`** (implementación propia en lugar de `textureCompress`, para controlar el tipo de mapa):
   - Color: WebP q82, como máximo 2048 px. En las 39 texturas el PSNR frente al JPEG original es de **≥ 37 dB (media ~43 dB)**.
   - Normales: WebP q85, como máximo 1024 px. `rug_nrm`, `rugbed_nrm` y `grass_nrm` (ruido de alta frecuencia, de 0,3 a 0,43 MB cada una) bajan a 512 px.
   - Si recodificar no ahorra al menos un 10 %, se **conserva el JPEG original** (le pasa a `fabric_nrm`, que como WebP ocupaba más). Un GLB puede mezclar JPEG y WebP.
6. **`meshopt({ level: 'high', quantizationVolume: 'scene', quantizePosition: 16 })`**: reordena para la caché de vértices, cuantiza (posiciones con una rejilla de 16 bits ≈ 0,2 mm sobre 14 m; normales octaédricas de 8 bits) y aplica EXT_meshopt_compression. Las UV fuera de [0,1] (texturas en mosaico) se quedan en float y el códec meshopt las comprime igualmente.

### 2.3 Invariantes verificadas (`npm run model:verify`, VERIFY OK)

- Están los 82 nombres de material del original y no aparece ninguno nuevo.
- Están los 21 `_Alto`: `Aluminio_Grafito_Alto, Antracita_Alto, Blanco_Mate_Alto, Cromo_Alto, Cuadro_Azul_Alto, Cuerda_Blanca_Alto, Espejo_Alto, Lacado_Blanco_Alto, Lacado_Negro_Alto, Laton_Cepillado_Alto, Madera_Clara_Alto, Metal_Negro_Alto, Pantalla_TV_Alto, Pared_Corte_Alto, Pared_Enlucido_Alto, Porcelanico_Negro_Alto, Porcelanico_Oliva_Alto, Toalla_Blanca_Alto, Toalla_Gris_Alto, Vidrio_Alto, Vidrio_Ducha_Alto`.
- Los triángulos por nombre de material coinciden con el original: no se pierde geometría ni cambia de material.
- Los bounds en mundo coinciden con el original (0,10 mm como máximo en `villa.glb` y 0,00 mm en `villa-ar.glb`).
- **Transformaciones de nodo:** en el original todas son identidad. En `villa.glb`, KHR_mesh_quantization añade a cada nodo **la misma** escala y traslación de decuantización (volumen de escena). Las **posiciones en mundo** no cambian, que es lo que usan los *hotspots* (`data-position` se expresa en coordenadas del modelo). Comprobado en el navegador: con `getBoundingBoxCenter()` = (4,55; 1; −7,025), el *hotspot* `0m 0m 0m` cae en la esquina SO del forjado y el `9.1m 0m -14.05m` en la NE (captura `img/06-viewer-03-cenital-cut.png`). Convención confirmada: **plano (x este, y norte) → glTF (x, altura, −y)**.

### 2.4 Riesgos visuales (evaluados)

| Riesgo | Medición / estado | Mitigación |
|---|---|---|
| Normales octaédricas de 8 bits (`level: 'high'`) | Comparado con `medium` (normales de 10 bits) en primeros planos de la bañera y las almohadas: **PSNR 64–67 dB** entre ambos, diferencia imperceptible, y `high` ahorra 0,49 MB | Si alguna superficie curva y brillante muestra bandas: `MESHOPT_LEVEL=medium npm run model:optimize` (3,48 MB) |
| Cuantización de posiciones | Con 16 bits la rejilla es de ~0,2 mm y cuesta solo **~1 KB** más que con 14 bits | — |
| *Z-fighting* | **Ya existe en el original** (el borde de la bañera tiene caras coplanarias; se ve igual en `villa-ar.glb`, que no está cuantizado). La cuantización puede desplazar el patrón | Separar ≥ 2 mm las caras coplanarias en el script de Blender |
| WebP en mapas de normales | El submuestreo 4:2:0 ya estaba en los JPEG de origen. Las normales de ruido van a 512 px | Si algún material se ve «plano», subir `normalQuality` o excluirlo con `overrides` |
| Materiales 87 → 82 | Solo se fusionan duplicados con el mismo nombre y las mismas propiedades. El corte (por nombre) no cambia | — |
| Nombres de nodo | `join` los agrupa en `grupo_<Material>`, así que **se pierde la selección por objeto** | Si en el futuro hace falta resaltar un mueble al pasar el ratón o para el *staging*, filtrar esos nodos en `join({ filter })` |
| Aviso `MESH_PRIMITIVE_GENERATED_TANGENT_SPACE` (28) | three.js calcula las tangentes en el *shader*; es normal y no es un error | Añadir `tangents()` solo si un visor externo lo necesita (sube el tamaño) |
| **Memoria GPU de texturas** | 39,1 Mpx → **~199 MB** en RGBA8 con mipmaps. Es el principal riesgo en iPhones de 3 GB o menos | **KTX2** (ETC1S/UASTC, de 4 a 8 veces menos VRAM; necesita KTX-Software `ktx` y el *transcoder* Basis autoalojado), o una variante móvil con color a 1024 (−50 MB). Probar primero en un iPhone 11 o 12 real |
| Ya en el export de Blender | `texCoord: -1` en 12 *slots* (inválido) y 10 primitivas con textura pero **sin UV** (cajones, pie de mesa, cuenco, libro, fondo de estantería), que en three.js muestrean el texel (0,0) y dan tangentes NaN | Corregido en `clean-gltf.mjs`: `texCoord` 0 y UV por proyección de caja con la misma densidad de texel que las demás piezas del material. **Mejor corregirlo en Blender** (el exportador no saca las coordenadas Generated/Object) |

### 2.5 Por qué no KTX2 ni Draco (por ahora)

- **Draco** comprime la geometría algo más que meshopt, pero su decodificador pesa 100–300 KB, se ejecuta más lento y **tampoco lo lee Scene Viewer según su documentación**. Meshopt en model-viewer usa el decodificador **ya incluido** en el bundle (§3), así que no descarga nada extra.
- **KTX2/Basis** no reduce mucho el tamaño del fichero, pero sí la **VRAM** (lo dice el propio FAQ de model-viewer: *«Large high-res models can easily run out of GPU RAM on mobile devices, and this is the fix»*). Queda como **P1 si en las pruebas con móviles hay pérdida de contexto WebGL** (evento `error` con `type: 'webglcontextlost'`). Hace falta instalar KTX-Software, `gltf-transform etc1s/uastc` y autoalojar el *transcoder* (`ktx2TranscoderLocation`).

---

## 3. model-viewer autoalojado

### 3.1 Versión y ficheros

- `@google/model-viewer` **4.3.1** (la última 4.x, publicada el 04-06-2026), **Apache-2.0**. Incluye three.js r183 (MIT), Lit (BSD-3-Clause), gainmap-js (MIT) y fflate (MIT). Las licencias están en `public/lib/LICENSES.md`.
- Se usa `dist/model-viewer.min.js`, un módulo ES autocontenido. No hace falta un *import map* porque three va dentro del bundle.
- Actualizar: `npm run vendor:viewer -- 4.x.y`. El script usa `npm pack`, comprueba la licencia, escribe `VERSION.json` e imprime el SRI sha384.
- **Referencias externas del bundle:** Draco (gstatic), Basis (gstatic) y LottieLoader (jsDelivr). **Solo se piden si el modelo usa Draco, KTX2 o Lottie**, y los nuestros no. Aun así los apuntamos a rutas locales para que la CSP no tenga que permitir CDNs de terceros.

### 3.2 Meshopt: detalle importante

Según la documentación de model-viewer, en 4.x *«By default, the Meshopt decoder is not enabled»*. En el código fuente (`CachingGLTFLoader.setMeshoptDecoderLocation`), al fijar la ruta se carga ese *script* con una etiqueta `<script>` clásica y después se usa el `MeshoptDecoder` **que ya trae el bundle** (el de `three/examples/jsm/libs/meshopt_decoder.module.js`). El fichero funciona, en la práctica, como **interruptor**. Aun así servimos el decodificador real de meshoptimizer 1.3.0, envuelto como *script* clásico (desde la 1.0 el paquete solo trae ESM y CJS; un `.cjs` cargado como *script* clásico lanza `ReferenceError: module is not defined`). Así seguirá funcionando si alguna versión futura pasa a leer `self.MeshoptDecoder`.

```html
<!-- En <head>, ANTES de que se cree el primer <model-viewer> (y antes del import() diferido) -->
<script>
  self.ModelViewerElement = Object.assign(self.ModelViewerElement || {}, {
    meshoptDecoderLocation: '/lib/model-viewer/meshopt_decoder.js',  // imprescindible: villa.glb requiere EXT_meshopt_compression
    dracoDecoderLocation:   '/lib/model-viewer/draco/',              // no se usa; evita que la CSP tenga que permitir gstatic
    ktx2TranscoderLocation: '/lib/model-viewer/basis/',              // no se usa (hasta que haya KTX2)
    lottieLoaderLocation:   '/lib/model-viewer/lottie-unused.js'     // no se usa
  });
</script>
```

Si se configura después de definir el elemento: `customElements.get('model-viewer').meshoptDecoderLocation = '…'`, siempre antes de que termine de cargar el primer modelo meshopt. Sin esta línea, three lanza `setMeshoptDecoder must be called before loading compressed files` y model-viewer emite `error` con `detail.type === 'loadfailure'`. Nuestro *fallback* (§4.4) cambia entonces a `villa-ar.glb`.

### 3.3 Integridad y consola

- SRI (sha384, generado por el script): `model-viewer.min.js` → `sha384-cprcVQt7wbUl0xngF3PGP6yBB7n4/t+4AoAMG9biiMCGFiWOdzUH10Ie2COTqFNW`. Con `import()` dinámico no se puede poner `integrity`, pero sí en `<link rel="modulepreload" integrity="…">`. Como el fichero es propio (mismo origen), el SRI es opcional.
- **model-viewer 4.3.0 y 4.3.1 dejan `console.log` de depuración** (`[$updateSource] called!`, `BAILING OUT EARLY!`, `IntersectionObserver fired!`); la 4.2.0 no los tiene. Son 4 líneas por carga y no son errores, así que no afectan a la auditoría «Browser errors logged to the console» de Lighthouse. Aceptado. Si molestan, se pueden quitar en `vendor-model-viewer.mjs` (Apache-2.0 permite modificar el fichero si se indica).

---

## 4. Estrategia de carga para Core Web Vitals

### 4.1 Mediciones (Chromium, CDP; JS con brotli y GLB **sin** comprimir, el caso conservador)

| Perfil | LCP (póster AVIF) | Transferencia antes de interactuar | JS del visor | Descarga del GLB (2,99 MB) | **Del clic al primer frame** |
|---|---|---|---|---|---|
| Slow 4G · 150 ms RTT · 1,6 Mbps · CPU ×4 (móvil de Lighthouse) | **508 ms** | 24 KB | 1,43 s (260 KB) | 15,2 s | **18,0 s** |
| 4G rápido · 40 ms · 9 Mbps · CPU ×2 | 172 ms | 24 KB | 0,29 s | 2,7 s | **4,0 s** |
| Cable · 20 ms · 30 Mbps · CPU ×1 | 96 ms | 24 KB | 0,10 s | 0,85 s | **1,5 s** |
| Local sin límites (patrón declarativo) | 48 ms, **CLS 0** | — | — | — | 0,47 s |

Conclusiones:
- **Con esta estrategia el 3D no influye en el LCP ni en el CLS.** El LCP es siempre la `<img>` del póster y el HTML inicial no carga nada del visor.
- En móvil lento el cuello de botella es **la descarga del GLB**. Hay que dar feedback: barra de progreso (`progress` → `event.detail.totalProgress`) y un texto del tipo «Cargando modelo 3D (3 MB)». Lo que más ayudaría a medio plazo es una **variante móvil** (texturas de color a 1024 y KTX2), ~2 MB.
- **INP:** `import()` más la definición del elemento es una tarea larga de ~75–140 ms en escritorio (mucho más con CPU ×4). Por eso **el JS se descarga por intención (hover/foco/visibilidad) y no en el clic**: cuando el usuario pulsa ya está evaluado y el clic solo ejecuta `dismissPoster()`.

### 4.2 Patrón recomendado (probado en `test-viewer-declarativo.html`)

`<model-viewer>` va en el HTML desde el principio (con `alt`, *hotspots*, botones y póster renderizados en el servidor, así que el contenido es rastreable), pero **su JS no está en la página**. Hasta que se define, es un elemento desconocido y su `<picture slot="poster">` se pinta como una imagen normal: ese es el LCP. Con `loading="lazy"` + `reveal="manual"`, el GLB **no se pide hasta `dismissPoster()`**. Comprobado: sin clic no hay ninguna petición a `.glb`.

```html
<div class="viewer">
  <model-viewer id="villa"
    src="/models/villa.glb"
    ios-src="/models/villa_maqueta_1a20.usdz#canonicalWebPageURL=https%3A%2F%2Fdominio.tld%2Fcasos%2Fvilla-costa-del-sol%2F&callToAction=Pedir%20presupuesto&checkoutTitle=Villa%20Costa%20del%20Sol"
    alt="Maqueta 3D navegable de la planta alta de una villa en la Costa del Sol: salón, 3 dormitorios, 2 baños y 2 terrazas, con los muros cortados a 1,15 m"
    loading="lazy" reveal="manual"
    camera-controls touch-action="pan-y" interaction-prompt="none"
    camera-orbit="-30deg 50deg auto" min-camera-orbit="auto 0deg 2m" max-camera-orbit="auto 88deg auto"
    field-of-view="30deg" interpolation-decay="120"
    shadow-intensity="0.8" shadow-softness="0.8" exposure="1" tone-mapping="neutral" environment-image="neutral"
    ar ar-modes="webxr quick-look" ar-placement="floor" ar-scale="auto"
    a11y='{"front":"Vista desde el sur","back":"Vista desde el norte","left":"Vista desde el oeste","right":"Vista desde el este","upper-front":"Vista cenital desde el sur","upper-back":"Vista cenital desde el norte","upper-left":"Vista cenital desde el oeste","upper-right":"Vista cenital desde el este","lower-front":"Vista baja desde el sur","lower-back":"Vista baja desde el norte","lower-left":"Vista baja desde el oeste","lower-right":"Vista baja desde el este","interaction-prompt":"Usa el ratón, el dedo o las flechas del teclado para girar la maqueta"}'>
    <picture slot="poster">
      <source type="image/avif" srcset="/img/villa/villa-poster-640.avif 640w, /img/villa/villa-poster-960.avif 960w, /img/villa/villa-poster-1400.avif 1400w" sizes="(max-width: 900px) 100vw, 868px">
      <source type="image/webp" srcset="/img/villa/villa-poster-640.webp 640w, /img/villa/villa-poster-960.webp 960w, /img/villa/villa-poster-1400.webp 1400w" sizes="(max-width: 900px) 100vw, 868px">
      <img src="/img/villa/villa-poster-960.jpg" width="1400" height="1050" fetchpriority="high" alt="">
    </picture>
    <!-- hotspots en coordenadas de plano: data-position = "x altura -y" -->
    <button slot="hotspot-salon" class="hotspot" data-position="5.2m 1.2m -6.4m" data-normal="0m 1m 0m" aria-label="Salón, 24 m²">Salón</button>
    <button slot="ar-button" class="ar-btn" type="button">Ver en tu espacio (abre la cámara)</button>
    <div slot="progress-bar" class="progress" aria-hidden="true"></div>
  </model-viewer>
  <button class="viewer__start" id="viewer-start" type="button">Explorar en 3D <span>(3 MB)</span></button>
</div>
```

*(Las coordenadas del hotspot del salón son de ejemplo; hay que sacarlas del plano.)*

**¿Qué USDZ abre el botón AR del visor?** La **maqueta 1:20**: coincide con el «modo maqueta» que el usuario acaba de ver y cabe en cualquier salón. El «tamaño real» va en un enlace aparte, explícito (§5.3). En Android, WebXR abre `villa.glb` al 100 %, aunque se puede escalar con los dedos. Para que se comporte igual que en iOS, se puede hacer `mv.scale = '0.05 0.05 0.05'` al recibir `ar-status` = `session-started` y restaurarlo en `not-presenting`. Está **por probar en un dispositivo**.

```css
.viewer { position: relative; aspect-ratio: 4 / 3; border-radius: 12px; overflow: hidden; background: #dcdad5; }
model-viewer { display: block; width: 100%; height: 100%; --poster-color: transparent; }
/* Antes de definirse: reservar la caja y enseñar solo el póster (CLS 0) */
model-viewer:not(:defined) > :not([slot="poster"]) { display: none; }
model-viewer [slot="poster"], model-viewer [slot="poster"] img { display: block; width: 100%; height: 100%; object-fit: cover; }
@media (prefers-reduced-motion: reduce) { .viewer * { transition: none !important; animation: none !important; } }
```

```js
// /js/viewer.js  (type="module", defer; <1 KB)
const mv = document.getElementById('villa');
const start = document.getElementById('viewer-start');
let lib;
const loadLib = () => (lib ||= import('/lib/model-viewer/model-viewer.min.js'));

// 1) Intención: descarga el JS (~230 KB br) mientras el puntero va hacia el botón
for (const ev of ['pointerenter', 'focusin', 'touchstart'])
  mv.parentElement.addEventListener(ev, loadLib, { once: true, passive: true });

// 2) Visibilidad: solo con buena conexión y en momento ocioso (nunca con Save-Data o 2G)
const c = navigator.connection;
if (!(c && (c.saveData || /2g/.test(c.effectiveType)))) {
  new IntersectionObserver((entries, io) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); (self.requestIdleCallback || setTimeout)(loadLib); }
  }, { rootMargin: '200px' }).observe(mv);
}

// 3) Clic: ahora sí, el GLB (3 MB)
start.addEventListener('click', async () => {
  start.setAttribute('aria-busy', 'true');
  await loadLib();
  await customElements.whenDefined('model-viewer');
  mv.addEventListener('load', onModelLoad, { once: true });
  mv.dismissPoster();
});
```

**Página del caso de estudio (`/casos/villa-costa-del-sol/`):** el visor es el protagonista, así que aquí sí conviene precargar el JS por visibilidad. **Páginas de servicio y home:** solo póster y botón. Si se quiere evitar del todo el JS extra en esas páginas, basta con quitar el paso 2 del código.

Notas:
- **No uses `<link rel="preload">` para el póster** si ya está en el HTML como `<picture>`: el *preload scanner* lo encuentra y basta con `fetchpriority="high"`. Un `preload` con `href` fijo descarga **otro tamaño** distinto del que elige `srcset` (lo vimos en la prueba: se descargaban la de 1400 y la de 960). Si alguna vez hace falta, usa `imagesrcset` e `imagesizes` idénticos a los del `<source>`.
- **El póster tiene que coincidir con el estado inicial del visor** (cámara `-30deg 50deg`, **modo maqueta activado**). Si no, se nota un salto al revelarlo. `poster.jpg` es la maqueta cortada, así que se aplica el corte en `load` antes de que se vea el primer frame (en `test-viewer.html` se hace así).
- **`min-camera-orbit` con radio explícito** (`2m`). Con `auto`, model-viewer pone un radio mínimo conservador (2,2 veces el radio del modelo) y **no se puede acercar a las estancias**, que es justo lo que necesita la lista de estancias y el recorrido guiado.

### 4.3 Lógica del corte «modo maqueta» (probada: 21 materiales encontrados y cortados)

```js
const CUT_SUFFIX = '_Alto';
let cutMaterials = [], original = new Map();

function onModelLoad() {
  // Puede haber nombres duplicados (p. ej. Madera_Clara): siempre filtrar la lista, nunca getMaterialByName()
  cutMaterials = mv.model.materials.filter((m) => m.name.endsWith(CUT_SUFFIX));
  for (const m of cutMaterials) original.set(m, {
    alphaMode: m.getAlphaMode(), cutoff: m.getAlphaCutoff(), color: [...m.pbrMetallicRoughness.baseColorFactor] });
  setCut(true);   // estado inicial = el del póster
}

function setCut(on) {
  for (const m of cutMaterials) {
    const o = original.get(m);
    if (on) { m.setAlphaMode('MASK'); m.setAlphaCutoff(0.5); m.pbrMetallicRoughness.setBaseColorFactor([o.color[0], o.color[1], o.color[2], 0]); }
    else    { m.setAlphaMode(o.alphaMode); m.setAlphaCutoff(o.cutoff); m.pbrMetallicRoughness.setBaseColorFactor(o.color); }
  }
  document.getElementById('toggle-cut').setAttribute('aria-pressed', String(on));
}
```

Control de luz: `mv.exposure = value` (con `<input type="range" min="0.4" max="1.8" step="0.05">`). Para cada estancia se fijan `mv.cameraTarget = 'Xm Ym Zm'` y `mv.cameraOrbit = '…'`, y con `prefers-reduced-motion` se llama después a `mv.jumpCameraToGoal()`. Cuidado: en WebXR el corte se mantiene (es el mismo `three.Scene`), pero en Quick Look y Scene Viewer no, porque abren su propio fichero.

### 4.4 Fallback y robustez

```js
let triedFallback = false;
mv.addEventListener('error', (e) => {
  if (e.detail?.type === 'loadfailure' && !triedFallback) { triedFallback = true; mv.src = '/models/villa-ar.glb'; }   // glTF plano, sin decodificadores
  if (e.detail?.type === 'webglcontextlost') showStaticGallery();                                                    // sin VRAM: renders estáticos
});
```

**QA:** el evento `load` de model-viewer se dispara **aunque fallen todas las texturas** (lo vimos con una CSP sin `blob:`). El `check.js` del sitio tiene que tratar como fallo **cualquier `[ERROR]` de consola**, no solo la falta de `load`.

---

## 5. AR en iPhone/iPad (AR Quick Look)

### 5.1 Requisitos

- **HTTPS** y **`Content-Type: model/vnd.usdz+zip`**. Netlify no garantiza este MIME, así que hay que forzarlo en `_headers` (§8).
- Detección: `document.createElement('a').relList.supports('ar')` (Safari en iOS 12+ y en iPadOS; model-viewer también acepta Chrome, Edge, Firefox y DuckDuckGo en iOS si hay `ios-src`, y excluye la app de Google (GSA)).
- Enlace directo: **`<a rel="ar" href="….usdz">` con una `<img>` (o `<picture>`) como PRIMER hijo**. Si no, Safari navega al fichero en lugar de abrir Quick Look en modo AR.
- **Navegadores dentro de apps** (Instagram, Facebook, LinkedIn, WhatsApp): suelen ignorar `rel="ar"`, **pendiente de verificar en dispositivo**. En ese caso hay que mostrar el aviso «Abre esta página en Safari para verla en AR».
- **iPhone Safari no ofrece WebXR AR** en 2026 (visionOS solo `immersive-vr`), así que en iOS la vía siempre es Quick Look.

### 5.2 Parámetros del fragmento `#…` (Apple)

| Parámetro | Uso nuestro |
|---|---|
| `allowsContentScaling=0` | **Tamaño real fijo** (sin pellizcar para escalar). Para la maqueta de mesa se deja el valor por defecto (1) |
| `canonicalWebPageURL=<url codificada>` | Lo que comparte el botón «Compartir» de Quick Look: la página del caso, no el `.usdz` (solo funciona en Safari) |
| `callToAction=Pedir%20presupuesto` | Botón de texto en el banner inferior (iOS 13.3+) |
| `checkoutTitle=…` · `checkoutSubtitle=…` · `price=…` | Título y subtítulo del banner (p. ej. «Villa Costa del Sol · Modelo 3D desde plano», «Hecho por [MARCA]») |
| `custom=https://…/banner.html` · `customHeight=small\|medium\|large` | Banner HTML propio (URL absoluta con HTTPS; sin enlaces ni eventos) |

Al tocar el banner, WebKit envía un evento `message` al `<a>` con `event.data === '_apple_ar_quicklook_button_tapped'`. model-viewer lo traduce a **`quick-look-button-tapped`**. **Esto es captación de leads dentro de la AR:** al volver de Quick Look abrimos el formulario ya relleno con «Quiero esto para mi promoción».

### 5.3 Maqueta de mesa y tamaño real

| Opción | Fichero | Fragmento | Resultado |
|---|---|---|---|
| **Maqueta de mesa 1:20** | `villa_maqueta_1a20.usdz` (9,51 MB): 46 × 70 cm, con 110 mallas `_Alto` quitadas, así que se ven las estancias desde arriba | *(ninguno: se puede escalar)* | Colocar en la mesa, rodear y acercarse |
| **Tamaño real («entrar»)** | `villa_tamano_real.usdz` (10,23 MB): 9,16 × 14,10 m | `#allowsContentScaling=0` | Escala 100 % bloqueada |

¿Por qué dos ficheros y no uno escalable? Quick Look abre el modelo al 100 % y reducir una villa de 14 m a 70 cm pellizcando cuesta mucho. Además, la maqueta tiene que venir **cortada**: Quick Look no aplica nuestro corte por material.

```html
<!-- Enlaces directos (sin JS). Se muestran solo en iOS y en la página /ar/villa/ -->
<a rel="ar" id="ar-mesa"
   href="/models/villa_maqueta_1a20.usdz#canonicalWebPageURL=https%3A%2F%2Fdominio.tld%2Fcasos%2Fvilla-costa-del-sol%2F&callToAction=Pedir%20presupuesto&checkoutTitle=Villa%20Costa%20del%20Sol&checkoutSubtitle=Maqueta%201%3A20%20desde%20plano">
  <img src="/img/villa/ar-mesa-thumb.webp" width="160" height="120" alt="">
  Maqueta en tu mesa (1:20)
</a>
<a rel="ar" id="ar-real"
   href="/models/villa_tamano_real.usdz#allowsContentScaling=0&canonicalWebPageURL=https%3A%2F%2Fdominio.tld%2Fcasos%2Fvilla-costa-del-sol%2F&callToAction=Pedir%20presupuesto&checkoutTitle=Villa%20Costa%20del%20Sol&checkoutSubtitle=Tama%C3%B1o%20real">
  <img src="/img/villa/ar-real-thumb.webp" width="160" height="120" alt="">
  Entrar a tamaño real
</a>
<script type="module">
  document.addEventListener('message', (e) => {
    if (e.data === '_apple_ar_quicklook_button_tapped') openLeadForm({ origen: 'ar-quicklook', modelo: e.target.id });
  }, true);
</script>
```

### 5.4 Hallazgo: el suelo flota 0,60 m en «tamaño real»

- En el GLB la villa tiene el **suelo en y = 0** y debajo la peana `Base_Maqueta` (de −0,60 a −0,02) más el hueco de la escalera (hasta −0,60). En el USDZ, `/Villa/Villa` está trasladada **+0,60 m** para que **el fondo de la peana quede en el origen**.
- Quick Look **apoya el origen del modelo en el suelo detectado**, así que el suelo virtual queda 60 cm por encima del real. En la maqueta de mesa esto es correcto (la peana forma parte de la maqueta), pero para «entrar» es raro.
- **Candidato generado:** `source/villa3d/ar/candidatos/villa_tamano_real_suelo0.usdz`, sin `Base_Maqueta` y bajado 0,60 m. La escalera y el hueco quedan por debajo del suelo real, como un hueco de escalera de verdad. Validado con USD 26.8 sin errores. **Probarlo en un iPhone** y, si convence, sustituir `villa_tamano_real.usdz` y **corregirlo en el script de export de Blender** (origen en el suelo terminado de la planta).
- Lo mismo pasa en Android: Scene Viewer y WebXR apoyan la base del *bounding box*. Para «entrar» en Android habría que generar un `villa-ar-walkin.glb` sin peana, sin escalones descendentes y sin fondo de hueco (queda como decisión pendiente).

### 5.5 Peso del USDZ

El USDZ real se reparte así: **usdc 4,59 MB**, **9 normales en PNG que suman 3,24 MB** (unos 400 KB cada una) y 24 JPEG que suman 2,39 MB. El zip de un USDZ no puede comprimirse. Mejoras en el export de Blender: normales en **JPEG a 1024** (−2,5 MB) y la maqueta con texturas a 1024. Así los dos USDZ bajarían a unos 6–7 MB, lo que importa porque Quick Look descarga el fichero entero antes de mostrar nada.

---

## 6. AR en Android (Scene Viewer y WebXR)

### 6.1 Por qué hay un GLB aparte

Según la documentación de Google, Scene Viewer admite **glTF 2.0 solo con `KHR_materials_unlit` y `KHR_texture_transform`**, texturas PNG o JPEG de hasta 2048 px, 100 k triángulos y 10 materiales recomendados, y 10 MB recomendados. Distintas fuentes confirman que **no lee `EXT_meshopt_compression`**. Además model-viewer, en modo `scene-viewer`, **pasa su propio `src`** (el GLB con meshopt) a la app (`$openSceneViewer` usa `this.src`). Por eso:

- `villa-ar.glb` (7,89 MB): sin extensiones requeridas y con JPEG. Supera las recomendaciones de triángulos y materiales (178 k y 82), así que **hay que probarlo en 2 o 3 Android reales**. Si va lento, se puede generar una versión simplificada con `simplify()` sobre almohadas y plantas, que son la mayor parte de los triángulos.
- En `<model-viewer>`, **`ar-modes="webxr quick-look"`**, y Scene Viewer lo lanzamos nosotros con `villa-ar.glb`.

### 6.2 WebXR (primera opción en Android)

Chrome en Android con ARCore abre una sesión `immersive-ar` **dentro de la página**: no vuelve a descargar el modelo, mantiene los cambios de materiales (**el corte**) y los *hotspots*. model-viewer lo usa primero porque va primero en `ar-modes`. `xr-environment` activa la estimación de luz, pero tiene coste y fallos conocidos, así que no lo usamos por ahora. En iframes hace falta `allow="xr-spatial-tracking"`. **No pongas `Permissions-Policy: xr-spatial-tracking=()`** (el `_headers` de malagatransfer tiene `camera=()`, que no afecta a WebXR, pero conviene no ampliarlo).

### 6.3 URL *intent* de Scene Viewer (enlace directo)

```js
// Scene Viewer: https://developers.google.com/ar/develop/scene-viewer
function sceneViewerIntent({ file, title, link, fallback, realSize }) {
  const q = new URLSearchParams({
    file: new URL(file, location.href).href,     // URL absoluta HTTPS
    mode: 'ar_preferred',                        // 'ar_only' | '3d_preferred' | '3d_only'
    title,                                       // se trunca a 60 caracteres
    link: new URL(link, location.href).href,     // botón «visitar» en Scene Viewer
  });
  if (realSize) q.set('resizable', 'false');     // escala 100 % bloqueada en AR
  return `intent://arvr.google.com/scene-viewer/1.2?${q}` +
    `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;` +
    `S.browser_fallback_url=${encodeURIComponent(fallback)};end;`;
}

const arMesa = sceneViewerIntent({ file: '/models/villa-ar-maqueta.glb', title: 'Villa Costa del Sol · maqueta 1:20',
  link: '/casos/villa-costa-del-sol/', fallback: 'https://dominio.tld/ar/villa/?sin-ar=1', realSize: false });
const arReal = sceneViewerIntent({ file: '/models/villa-ar.glb', title: 'Villa Costa del Sol · tamaño real',
  link: '/casos/villa-costa-del-sol/', fallback: 'https://dominio.tld/ar/villa/?sin-ar=1', realSize: true });
```

- Hay que lanzarlo **desde un gesto del usuario** (`<a href="intent://…">` o `location.href = …` dentro de un `click`).
- También existen `disable_occlusion=true` (model-viewer lo pone por defecto), `enable_vertical_placement` y `sound`.
- Resultado en el HTML: `<a href="intent://…" class="ar-android">Maqueta en tu mesa</a>`, que se muestra solo si `/android/i.test(navigator.userAgent)`.

### 6.4 Botón AR del visor: elegir la vía correcta

```js
// slot="ar-button" del visor: WebXR si existe; si no, Scene Viewer con el GLB plano; en iOS, Quick Look (ios-src)
mv.querySelector('[slot="ar-button"]').addEventListener('click', async (e) => {
  const isAndroid = /android/i.test(navigator.userAgent);
  const webxr = !!(navigator.xr && await navigator.xr.isSessionSupported('immersive-ar').catch(() => false));
  if (isAndroid && !webxr) { e.stopPropagation(); location.href = arReal; }   // sin WebXR: Scene Viewer con villa-ar.glb
  // en los demás casos model-viewer se encarga (webxr / quick-look)
}, { capture: true });
```

*(Hay que comprobarlo en un dispositivo. Si `isSessionSupported` tarda y se pierde la «activación de usuario» para el intent, se puede precalcular `webxr` en `load`.)*

---

## 7. QR para abrir la AR desde el escritorio

**Destino:** `https://dominio.tld/ar/villa/?utm_source=qr&utm_medium=web&utm_campaign=demo-villa`, una página mínima (póster más 2 botones grandes: «Maqueta en tu mesa» y «Entrar a tamaño real») que detecta la plataforma:
- En iOS, los `<a rel="ar">` de §5.3. En Android, los `intent://` de §6.3. En escritorio, el visor 3D y el aviso «Abre esta página en tu móvil».
- **No se apunta el QR al `.usdz`**: en Android no sirve, no se puede medir en analítica y no hay CTA.
- La misma URL sirve para el **cartel de «Se vende»** y para el folleto de la promotora: es el mismo argumento comercial.

**Generación en el build (sin JS en el navegador):** [`uqr`](https://github.com/unjs/uqr) (MIT, sin dependencias, v0.1.3) con un *path* compacto (una sola `<path>`, con las series horizontales unidas). Probado: el SVG se decodifica con jsQR y devuelve la URL exacta. Ocupa unos 6 KB con esta URL larga (~1 KB con gzip) y bastante menos con URLs cortas.

```js
// build/lib/qr.mjs   (npm i -D uqr)
import { encode } from 'uqr';
export function qrSvg(text, { ecc = 'M', border = 2, label = 'Código QR para abrir la realidad aumentada en el móvil' } = {}) {
  const { data, size } = encode(text, { ecc, border });
  let d = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!data[y][x]) continue;
      let run = 1;
      while (x + run < size && data[y][x + run]) run++;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x += run - 1;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="${label}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path fill="#000" d="${d}"/></svg>`;
}
```

```html
<!-- Solo en escritorio: con puntero fino no hay AR -->
<figure class="ar-qr">
  {{ qrSvg('https://dominio.tld/ar/villa/?utm_source=qr&utm_medium=web&utm_campaign=demo-villa') }}
  <figcaption>Escanea con la cámara del móvil para ver la villa en tu salón (iPhone y Android, sin app)</figcaption>
</figure>
<style>
  .ar-qr { display: none; }
  @media (hover: hover) and (pointer: fine) { .ar-qr { display: block; width: 168px; } .ar-qr svg { width: 100%; height: auto; } }
</style>
```

El QR siempre negro sobre blanco (también en modo oscuro), con un margen de 2 módulos y ≥ 150 px en pantalla. Otras opciones: `lean-qr` (MIT, también funciona en el navegador) o `qrcode` (MIT, pero trae `yargs` y `pngjs`).

---

## 8. Netlify: `_headers`, rutas, caché y CORS

### 8.1 `_headers` (bloque para los modelos y el visor)

```
/models/*
  Access-Control-Allow-Origin: *
  Cross-Origin-Resource-Policy: cross-origin
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
  X-Robots-Tag: noindex

/models/*.glb
  Content-Type: model/gltf-binary

/models/*.usdz
  Content-Type: model/vnd.usdz+zip

/models/*.json
  Content-Type: application/json; charset=utf-8

/lib/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/img/*
  Cache-Control: public, max-age=31536000, immutable
```

- **MIME:** Quick Look exige `model/vnd.usdz+zip`. `model/gltf-binary` es el tipo registrado en IANA para `.glb`. Si en tu versión de Netlify no funcionan los comodines dentro del segmento (`/models/*.glb`), separa los ficheros en `/models/glb/*` y `/models/usdz/*`.
- **CORS:** no hace falta para nuestra web (mismo origen) ni para Quick Look o Scene Viewer (se descargan fuera del navegador). **Sí hace falta si una agencia incrusta nuestro GLB en su propio `<model-viewer>`**, que es la función «embebible en anuncios». `ACAO: *` es seguro porque son ficheros públicos. `CORP: cross-origin` cubre a las webs de terceros con COEP.
- **Caché:** los nombres son **estables** (`villa.glb`) porque salen en URLs de AR compartidas, en QR impresos y en *embeds* de terceros. Por eso se usa 1 día más SWR de 7 días, y no `immutable`. `/lib/` se versiona por carpeta al actualizar (`/lib/model-viewer@4.3.1/`) y así puede ser `immutable`. **Alternativa** para las páginas propias: huellas en el nombre (`villa.3f2a1c9d.glb`) generadas en el build, más un alias estable para los externos.
- **Compresión:** Netlify comprime los tipos de texto, pero **no está documentado si comprime `model/gltf-binary`** (hay hilos del foro sin respuesta oficial). El GLB con meshopt ahorra un 21 % con gzip (de 2,99 a 2,36 MB) y el `villa-ar.glb` un 38 %. **Comprobarlo tras el primer deploy:** `curl -sI -H 'Accept-Encoding: br, gzip' https://dominio.tld/models/villa.glb | grep -i content-encoding`. Si no comprime, se acepta tal cual (las cifras de §4.1 ya suponen que no hay compresión).
- **Iframes (`/embed/villa/`):** el `_headers` de malagatransfer pone `X-Frame-Options: SAMEORIGIN` en `/*`, que **impide incrustar nuestro visor en portales o en la web de una agencia**. Hay que quitarlo de la regla global y usar `Content-Security-Policy: frame-ancestors 'self'` en general y `frame-ancestors *` solo en `/embed/*`. En el iframe: `allow="xr-spatial-tracking; fullscreen"` y `loading="lazy"`.

### 8.2 Rutas y robots (coordinación con el doc 04)

El doc 04 propone `Disallow: /assets/3d/` para los binarios. Este pipeline los genera en **`/models/`**, así que hay que **unificarlo: usar `Disallow: /models/`** y actualizar las `contentUrl` del schema `3DModel` del doc 04 (`/models/villa.glb` y `/models/villa_tamano_real.usdz`). Los **pósters** están en `/img/villa/` (no bloqueados), igual que `/lib/` (Googlebot tiene que poder renderizar). Para el schema, `villa.report.json` da los `contentSize` reales: GLB 2,99 MB (3.132.584 bytes), USDZ 10,23 MB (10.723.010 bytes) y USDZ de mesa 9,51 MB.

### 8.3 CSP mínima probada con el visor

| Política | Resultado |
|---|---|
| Sin `'wasm-unsafe-eval'` | **No carga** (`WebAssembly.instantiate()… violates… 'unsafe-eval'`) → `loadfailure` |
| Con `'wasm-unsafe-eval'`, pero sin `blob:` en `img-src` ni `connect-src` | «Carga», pero **sin ninguna textura** y con 117 errores en consola |
| **La de abajo** | Carga completa y 0 errores |

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' data: blob:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'
```

(Si hay *scripts* inline, como la configuración de §3.2, se mueven a un `.js` propio o se añade su hash `sha256-…`. El JSON-LD no se ejecuta y no necesita permiso.)

---

## 9. Atributos de `<model-viewer>` recomendados (resumen)

| Atributo | Valor | Motivo |
|---|---|---|
| `src` / `ios-src` | `/models/villa.glb` / `/models/villa_maqueta_1a20.usdz#canonicalWebPageURL=…&callToAction=…` | Con `ios-src`, model-viewer **no genera** el USDZ al vuelo (que es lento y pierde calidad). El tamaño real va en un enlace aparte |
| `alt` | Descripción concreta de lo que se ve | Es el `aria-label` del lienzo (`role="img"`) |
| `loading` / `reveal` | `lazy` / `manual` | Nada del GLB hasta `dismissPoster()` |
| `<picture slot="poster">` | AVIF/WebP/JPG con `srcset` y `fetchpriority="high"` | LCP y CLS 0 antes y después de la actualización del elemento |
| `camera-controls` + `touch-action="pan-y"` | — | El scroll vertical de la página sigue funcionando en móvil (no atrapa el dedo) |
| `interaction-prompt` | `none` | La mano que se mueve es animación; tenemos un botón y un texto de ayuda |
| `camera-orbit` / `min-camera-orbit` / `max-camera-orbit` | `-30deg 50deg auto` / `auto 0deg 2m` / `auto 88deg auto` | Igual que el póster; permite acercarse a las estancias y no deja pasar por debajo del suelo |
| `field-of-view` / `interpolation-decay` | `30deg` / `120` | Menos distorsión; transiciones de cámara más rápidas |
| `shadow-intensity` / `shadow-softness` | `0.8` / `0.8` | Da peso a la maqueta sin coste apreciable |
| `tone-mapping` / `environment-image` / `exposure` | `neutral` / `neutral` / `1` | Color fiel (Khronos PBR Neutral) y sin descargar HDR |
| `ar` / `ar-modes` | presente / `webxr quick-look` | Scene Viewer se lanza aparte con el GLB plano (§6.4) |
| `ar-placement` / `ar-scale` | `floor` / `auto` (maqueta) o `fixed` (tamaño real) | `fixed` añade `allowsContentScaling=0` y `resizable=false` |
| `a11y` | JSON en español (§4.2) | Anuncios de orientación traducidos |
| No usar | `auto-rotate`, `xr-environment`, `skybox-image` | Movimiento no solicitado, coste de GPU y descarga de HDR |

---

## 10. Accesibilidad del visor

- **Alternativa textual siempre presente en el HTML:** lista de estancias con m² (botones que mueven la cámara), la ficha del caso y la galería de renders con `alt`. El 3D es una mejora progresiva: sin WebGL o sin JS la página está completa.
- **`alt`** descriptivo en `<model-viewer>` (se convierte en `aria-label` del lienzo con `role="img"`) y **`a11y`** con traducciones al español. model-viewer anuncia los cambios de vista en una región `role="status"`.
- **Teclado** (código de `SmoothControls`): Tab lleva el foco al lienzo, **las flechas giran la cámara**, **Re Pág / Av Pág hacen zoom** y **Mayús + flechas desplazan**. Hay que ponerlo por escrito debajo del visor («Teclado: flechas para girar, Re Pág/Av Pág para acercar»). `:focus-visible` con contorno de ≥ 3 px y buen contraste.
- **Controles nativos:** modo maqueta como `<button aria-pressed>`, luz como `<input type="range">` con `<label>`, estancias como `<button>`, AR como `<a>`/`<button>` con el texto «(abre la cámara)». Zonas táctiles de ≥ 44 × 44 px. Los *hotspots* como `<button>` con `aria-label`.
- **Movimiento reducido** (`prefers-reduced-motion: reduce`): sin `auto-rotate`, `interaction-prompt="none"` y las transiciones de estancia con `jumpCameraToGoal()` en lugar de animarlas.
- **Sin trampa de scroll ni de foco:** `touch-action="pan-y"` y el visor no captura Esc ni Tab.
- **Estados:** `aria-busy` en el botón mientras carga, texto de progreso («Cargando modelo 3D, 60 %») y mensaje claro si falla (`error`), con enlace a la galería de renders.
- **Contraste:** las etiquetas de los *hotspots* en blanco sobre negro al 70 % (≥ 4,5:1) y el QR negro sobre blanco.

---

## 11. Pendientes y checklist

- [ ] **Probar en dispositivos:** iPhone (Safari; Chrome iOS; Instagram in-app) con los USDZ de mesa, tamaño real y candidato *walk-in*; Android (Chrome con WebXR; Samsung Internet → Scene Viewer) con `villa-ar.glb` y `villa-ar-maqueta.glb`. Medir la memoria (pérdida de contexto WebGL) en un iPhone de 3 GB o menos.
- [ ] Decidir el *walk-in*: aceptar el candidato `villa_tamano_real_suelo0.usdz` y moverlo a `public/models/`, y **corregir el origen en el export de Blender**. Para Android, generar `villa-ar-walkin.glb`.
- [ ] Corregir en Blender: UV en las 10 piezas sin mapa, caras coplanarias (bañera) y normales del USDZ en JPEG a 1024.
- [ ] Unificar `/models/` en robots.txt y en el schema del doc 04. Leer los `contentSize` de `villa.report.json` en el build.
- [ ] `_headers`: quitar `X-Frame-Options` global y añadir `frame-ancestors` por ruta, el bloque `/models/*` y la CSP de §8.3.
- [ ] `check.js`: fallar ante cualquier error de consola en la página del visor, comprobar `Content-Type` de `.glb` y `.usdz` en el deploy de previsualización y comprobar que el GLB **no** se pide antes del clic.
- [ ] P1: variante KTX2 o móvil si las pruebas de memoria lo piden. P2: simplificar almohadas y plantas para Scene Viewer.
- [ ] Guardar en `villa.report.json` y publicar en la ficha del caso: «GLB 2,99 MB · 102 draw calls · 178.704 triángulos · 39 texturas procedurales». Son datos propios citables para GEO.

---

## Fuentes

- `@google/model-viewer` 4.3.1: código fuente del paquete npm (`src/features/ar.ts`, `src/features/loading.ts`, `src/three-components/CachingGLTFLoader.ts`, `src/three-components/SmoothControls.ts`, `src/template.ts`) y documentación ([docs.json](https://raw.githubusercontent.com/google/model-viewer/master/packages/modelviewer.dev/data/docs.json), [faq.json](https://raw.githubusercontent.com/google/model-viewer/master/packages/modelviewer.dev/data/faq.json), [modelviewer.dev/docs](https://modelviewer.dev/docs/), [ejemplo de carga diferida](https://modelviewer.dev/examples/loading/)).
- [Google Scene Viewer: Using Scene Viewer to display interactive 3D models](https://developers.google.com/ar/develop/scene-viewer): parámetros del *intent*, extensiones admitidas y límites.
- [Apple: Adding an Apple Pay button or a custom action in AR Quick Look](https://developer.apple.com/documentation/arkit/adding-an-apple-pay-button-or-a-custom-action-in-ar-quick-look): `callToAction`, `checkoutTitle`, `custom`, evento `message`.
- [Apple WWDC20 «Shop online with AR Quick Look»](https://developer.apple.com/videos/play/wwdc2020/10604/) · [cwervo: Everything I know about launching AR Quick Look from the web](https://cwervo.com/writing/quicklook-web/) (`canonicalWebPageURL`, `allowsContentScaling`) · [Variant: What you need to know about AR Quick Looks](https://www.variant3d.com/blog/quicklooks-on-ios).
- [model-viewer issue #1164 (meshopt)](https://github.com/google/model-viewer/issues/1164) · [egjs-view3d: meshopt y Scene Viewer](https://naver.github.io/egjs-view3d/docs/tutorials/Compression/Meshopt) (Scene Viewer no admite EXT_meshopt_compression).
- WebXR en iOS en 2026: [XRDoctors](https://xrdoctors.pro/blog/webxr-on-ios-what-actually-works) · [foros de Apple (visionOS, módulo AR)](https://developer.apple.com/forums/thread/756850).
- [Foro de Netlify: compresión de formatos adicionales](https://answers.netlify.com/t/configure-additional-file-formats-for-gzip-brotli-compression/112629) (sin respuesta oficial sobre `model/gltf-binary`).
- glTF-Transform 4.5.1 (código de `dedup`, `join`, `quantize`, `meshopt`, `textureCompress`) · meshoptimizer 1.3.0 · Khronos glTF-Validator 2.0.0-dev.3.10 · Pixar USD 26.8 (`usd-core`, `UsdValidation`) · [uqr](https://github.com/unjs/uqr).
