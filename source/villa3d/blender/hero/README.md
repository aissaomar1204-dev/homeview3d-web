# Hero "El plano se vuelve 3D" (Blender + sharp)

Secuencia de 48 fotogramas 14:9 con fondo transparente para el hero de la web. Termina **exactamente** en la
composición de `villa_maqueta_iso` (misma cámara, encuadre, look, luz), así que el último fotograma se puede
cambiar por el still del hero sin salto. Se reconstruye con dos comandos.

## Archivos

| Ruta | Qué es |
|---|---|
| `source/villa3d/blender/hero/hero_frames.py` | Escena animada desde Python (Cycles, RGBA): 48 fotogramas, dibujo de líneas y puntos proyectados. |
| `source/villa3d/renders/hero/hero_000..047.png` | Masters 1400×900 RGBA (fondo transparente + sombra en el alfa). |
| `source/villa3d/renders/hero/hero_plan_lines.png` | Plano de líneas registrado al píxel con el fotograma 0. |
| `source/villa3d/renders/hero/hero_points.json` | Línea de tiempo, cámara y puntos proyectados de los 48 fotogramas (lo lee el encoder). |
| `scripts/hero-frames.mjs` | Encoder (sharp): WebP escritorio/móvil y `build/generated/hero.json`. |
| `public/assets/hero/d/hero-###.webp`, `m/hero-###.webp` | Fotogramas web (1400 y 700 px de ancho). |
| `public/assets/hero/hero-plan-lines-1400.webp`, `-700.webp` | Plano de líneas web. |
| `build/generated/hero.json` | Contrato para el front-end. |

## Comandos (PowerShell)

```powershell
$B = "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
cd E:\ProyectosRealStateBlender\source\villa3d\blender\hero

# 1) secuencia completa + plano de líneas (17,5 min en la RTX 4060)
& $B -b --factory-startup -P hero_frames.py -- --samples 128 --ss 2

# previsualización de 48 fotogramas (40 %, 32 muestras, unos 45 s) en otra carpeta
& $B -b --factory-startup -P hero_frames.py -- --scale 40 --samples 32 --no-lines --outdir $env:TEMP\hero_prev

# solo algunos fotogramas / solo líneas / solo puntos (segundos)
& $B -b --factory-startup -P hero_frames.py -- --frames 12,24,47 --no-lines
& $B -b --factory-startup -P hero_frames.py -- --lines-only
& $B -b --factory-startup -P hero_frames.py -- --points-only

# 2) WebP + hero.json (respeta los presupuestos; ver más abajo)
cd E:\ProyectosRealStateBlender; node scripts/hero-frames.mjs
```

Opciones de `hero_frames.py`: `--frames 0-47|12,24`, `--samples N` (128), `--ss N` (supermuestreo: renderiza a N×1400×900
y reduce con filtro de caja sobre alfa premultiplicado; 2 por defecto en producción), `--threshold` (ruido del
muestreo adaptativo, 0,006), `--scale N` (% de resolución, solo pruebas), `--outdir`, `--no-lines`,
`--lines-only`, `--lines-ss` (3), `--lines-thickness` (3 px a 3×), `--points-only`, `--seed`, `--save-blend`.

## Storyboard

Tiempos en fotogramas (0-47, la web reproduce a unos 20-24 fps; `hero.json` da `fps: 22`).

| Fase | Fotogramas | Qué pasa |
|---|---|---|
| Plano | 0-5 | Vista cenital casi ortogonal (norte arriba), solo suelos de color; los muros están a 4,6 mm, así que solo se ve el poché oscuro. Idénticos: se renderiza el 0 una vez y se copia. |
| Muros | 5-22 | Muros, puertas, ventanas, vidrios, petos y escalera de caracol suben desde el suelo (escala Z, ease-out con potencia 1,7). Las tapas oscuras del corte a 1,15 m suben con ellos. |
| Cámara | 14-36 | Dolly-zoom con ease-in-out (smootherstep): de 2025 mm a 1500 m a los 50 mm del hero a 34,3 m, con cabeceo de 90° a 42° y giro de 180° a 212°. La perspectiva "florece" sola. El fotograma ≥ 36 usa los valores exactos de `CAM_villa_maqueta_iso`. |
| Mobiliario | 22-40 | 76 piezas aparecen habitación a habitación (escala uniforme desde la base de cada pieza, ease-out cuadrático, sin rebote, 5 fotogramas cada una): salón, terraza oeste, dormitorio principal, baño principal, pasillo, dormitorio 3 y vestidor, dormitorio 2, baño 2, terraza norte. Dentro de cada habitación, primero lo grande. |
| Luz | 34-47 | El sol pasa de neutro y alto (312° / 53°, 3,6 W/m², blanco) al de media tarde del hero (292° / 38°, 4,2 W/m², 1,0/0,80/0,60); también gira el sol del cielo físico. El 47 es el hero. |

Reparto de capas (reutiliza `villa_despiece.layer_of`): suelos (`Suelo*`, `Base`, `Fondo`, más `Peldano`, los
peldaños bajo la losa, que no se mueven); muros (todo lo `Muro/Tabique/Patinillo/Alicatado/Peto/Columna/Murete/
Caracol/Rodapies/Mampara`, con sus puertas, ventanas y tapas de corte); mobiliario (el resto, agrupado en piezas por
el nombre original: `Cama Individual 1 almohada 1` -> `Cama Individual 1`).

Cómo se mueve todo sin tocar la malla: un *empty* en el origen para los muros (escala Z) y un *empty* en la base
de cada pieza (escala uniforme); los objetos son sus hijos. Cada fotograma se calcula desde cero (no hay claves).

### Cámara

`CamPath` en `hero_frames.py`. Para una fracción `u` (smootherstep de 14 a 36): objetivo de la planta (4,55; 7,025; 0)
al del hero; acimut 180° -> 212°, elevación 90° -> 42° (rotación en forma cerrada, sin el gimbal de `to_track_quat`);
escala en píxeles por metro en el plano del objetivo (52,5 -> 56,7 px/m, así el edificio no "salta" de tamaño);
distancia `exp(lerp(ln 1500, ln 34,29, u^0,7))` y focal = escala × distancia. `shift` interpolado hasta el del hero.
La distancia de 1500 m deja el paralaje de un muro de 1,15 m en 0,4 px: el fotograma 0 es una ortogonal.
Un `assert` comprueba que la rotación de forma cerrada reproduce la de la cámara del hero.

## Plano de líneas (`hero_plan_lines.png`)

Modo `lineas` de `villa_render.py` (emisión plana por objeto + Freestyle) desde la cámara del fotograma 0, con los
muros en la misma altura plana que el fotograma 0 y el mobiliario a tamaño completo (contornos finos). Se renderiza
a 3× (4200×2700, 24 muestras, 9 s), con líneas de 3 px, y se reduce a 1400×900 con filtro de caja: el trazo queda
en 1 px suave. Sobre fondo transparente; suelos gris muy claro (#F1), terrazas #E9, poché negro.
Registro comprobado contra el fotograma 0: el desplazamiento óptimo es (0, 0) px y la huella coincide en un 99,55 %
(IoU del alfa).

## Puntos proyectados

`build/generated/hero.json` -> `points[f]`, con coordenadas 0-1 y origen arriba a la izquierda (`world_to_camera_view`
con la cámara real de cada fotograma, incluido el `shift`):

- `corners`: las 4 esquinas de la huella al nivel del suelo, en el orden de `cornerOrder` = NO, NE, SE, SO.
  Huella = cara exterior de la obra, x 0 -> 9,10 m, y 0 -> 14,05 m (con la albardilla de 3 cm el conjunto mide
  9,15 × 14,10 m). La esquina NO está en el aire: la terraza norte solo empieza en x = 4,2 m.
- `wallTop.ne` / `wallTop.sw`: la coronación en las esquinas NE y SO (allí son petos de terraza con albardilla,
  1,07 m) y `wallTop.heightM`, la altura real en ese fotograma (crece con los muros).
- `cut.ne` / `cut.sw` y `cut.heightM`: lo mismo a la altura de corte de 1,15 m del resto de muros.
- `bounds`: caja [x0, y0, x1, y1] de los píxeles visibles (alfa > 24), útil para centrar textos.

## Calidad y tiempos (RTX 4060 8 GB, OptiX + OpenImageDenoise)

| Paso | Ajustes | Tiempo |
|---|---|---|
| 43 fotogramas distintos (0-5 idénticos) | 2800×1800 (`--ss 2`), 128 muestras, adaptativo 0,006, OIDN con albedo y normal | 19-30 s cada uno, 989 s en total |
| Plano de líneas | 4200×2700, 24 muestras, Freestyle | 9 s |
| Carga de la escena y puntos | 48 fotogramas | 8 s |
| **Total** | | **17 min 29 s** |

Ruido y estabilidad: semilla fija (`use_animated_seed = False`), mismos ajustes de denoiser en todos los fotogramas.
Diferencia media entre fotogramas consecutivos: 0 en el 0-5, 0,6-1,3/255 mientras solo suben los muros, sube y baja
suavemente con el movimiento de cámara (máximo 11,4 en el 27) y vuelve a 0,25-0,8 en la luz final. Sin picos.
Luminancia media entre 128 y 134/255 en todo el recorrido. El fotograma 47 frente a `villa_maqueta_iso` reducido a
1400 px: misma caja del alfa, centroide a 0,1 px, MAE 0,5/255.

## Codificación y presupuestos (`scripts/hero-frames.mjs`)

Presupuestos (los 48 fotogramas juntos, MB decimales): escritorio <= 2,4 MB, móvil <= 0,9 MB. El script sube y baja por una
escalera de calidad (calidad WebP del color, niveles del alfa de la sombra) y toma el peldaño mejor que cabe.

Lo que más pesaba era el canal alfa, no el color: la sombra de contacto sobre el fondo transparente tiene un ruido
de render de ~2 % en el alfa (5,5 niveles de 255) y el WebP lo codifica sin pérdida (120 KB por fotograma, más que
toda la imagen). Por eso, antes de codificar, los píxeles que son pura sombra (color exactamente negro, sin ser
opacos) pasan por un filtro bilateral que respeta los bordes (los bordes nítidos de la sombra y la silueta del
modelo se conservan) y, si el presupuesto lo pide, se reducen a 128-160 niveles (saltos de unos 2 valores de código
sobre el fondo claro: no hay bandas visibles; con 64 niveles sí las hay). Los píxeles con color (aristas antialias,
barandillas de 1 px) no se tocan. Los masters PNG siguen intactos.

Resultado (29-09-2026), peldaño elegido: calidad WebP 60 y sombra a 128 niveles.

| Juego | Ancho | Peso total (48 fotogramas) | Presupuesto | Por fotograma |
|---|---|---|---|---|
| Escritorio `d/` | 1400 px | 2.212.576 B (2,21 MB) | 2,4 MB | 27 KB (plano) a 58 KB (final) |
| Móvil `m/` | 700 px | 880.118 B (0,88 MB) | 0,9 MB | unos 18 KB de media |
| Plano de líneas | 1400 / 700 px | 77.614 B / 34.156 B (sin pérdida) | - | - |
| `hero.json` | - | 13,6 KB | - | - |

La búsqueda en la escalera tarda unos 30 min (cada peldaño codifica 96 WebP con esfuerzo 6). Para regenerar sin
buscar: `node scripts/hero-frames.mjs --rung 5` (unos 5 min). Con calidad 62 y 160 niveles el escritorio pesaría
2,51 MB, por eso se queda en el peldaño 5. Comprobado: los ejes finos (barandillas de la escalera de caracol) y las
aristas se conservan, la sombra no tiene bandas a 3× de zoom y el color queda a la par de los masters.

## Para el front-end

- Los fotogramas 0-5 son idénticos (`staticFrames`), y del 36 al 47 solo cambia la luz.
- El fondo es transparente (con sombra suave en el alfa): funciona sobre el papel `#F4F5F6` y sobre el tema oscuro.
  El dibujo de líneas tiene suelos casi blancos, así que sobre el tema oscuro se ve como una lámina clara: conviene
  atenuarlo con CSS (opacidad o `mix-blend-mode`) o hacer el cruce más corto.
- Dibujo de líneas -> fotograma 0: mismo lienzo 14:9, misma posición; basta con apilar y hacer un fundido cruzado.
- El último fotograma coincide con `villa_maqueta_iso` (recortado a 14:9 idéntico, 2800×1800 a la mitad).
- El plano cenital ocupa el 82 % del alto del lienzo y el 34 % del ancho: hay hueco a ambos lados para las cotas.
- Los 4 puntos `corners` de cada fotograma siguen el modelo durante todo el recorrido; interpolar entre fotogramas
  en el cliente es seguro (el movimiento es suave).

## Notas de escena

- `hero_frames.py` importa `villa_render.py` (escena y cámaras) y `villa_despiece.py` (clasificación en capas): si
  cambia la cámara `villa_maqueta_iso` o el look, este script lo recoge solo (y hay que volver a renderizar).
- El sol de `Sol_Tarde_Suelo` comparte datos con `Sol_Tarde`, así que color y potencia animados valen para los dos
  (light linking de la escalera intacto).
- `Alto (sobre 1,15 m)` sigue oculto y las tapas de corte visibles, igual que en `villa_maqueta_iso`.
- Masters: 43 PNG distintos + 5 copias, unos 45 MB en `source/villa3d/renders/hero/`.
