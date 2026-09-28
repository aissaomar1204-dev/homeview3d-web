# Render set y AR de la villa (Blender, headless)

Todo se reconstruye desde el glTF con scripts Python. Si cambia el modelo, una cámara o la luz,
se vuelve a renderizar con un solo comando. Blender 5.2.1 LTS, Cycles en GPU (OptiX, con CUDA
como alternativa) y denoiser OpenImageDenoise en GPU.

## Estructura

| Ruta | Qué es |
|---|---|
| `import/villa.gltf`, `import/villa.bin`, `import/tex/` | Copia importable del modelo (`../gltf/villa-modelo.json` + `villa-geometria.wasm`, con el `uri` del buffer corregido). Los originales no se tocan. |
| `villa_render.py` | Escena completa y render de las 9 tomas: cámaras, sol, cielo, sombra y modos maqueta/muros/plano. |
| `export_usdz_mesa.py` | Maqueta de sobremesa 1:20 para AR Quick Look (`../ar/villa_maqueta_mesa.usdz`). |
| `villa_renders.blend` | Escena guardada, con rutas de textura relativas. Tiene todas las cámaras `CAM_*` y las colecciones `Maqueta` / `Alto (sobre 1,15 m)` / `Corte seccion`. |
| `probe.py` | Diagnóstico: lista objetos, materiales y dispositivos GPU. |
| `../renders/` | PNG de salida, `_timings.json` (tiempo y estadísticas de cada toma) y `_render_log.txt`. |

## Comandos (PowerShell)

```powershell
$B = "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
cd E:\ProyectosRealStateBlender\source\villa3d\blender

# 1) (solo si cambia el glTF) regenerar la copia importable
python -c "import json;d=json.load(open(r'..\gltf\villa-modelo.json',encoding='utf-8'));d['buffers'][0]['uri']='villa.bin';json.dump(d,open(r'import\villa.gltf','w',encoding='utf-8'))"
Copy-Item ..\gltf\villa-geometria.wasm import\villa.bin; Copy-Item ..\gltf\tex\*.jpg import\tex\

# 2) set completo a resolución final (unos 7 min en una RTX 4060) y guardar el .blend
& $B -b --factory-startup -P villa_render.py -- --save-blend

# previsualización rápida (30 %, 96 muestras, unos 25 s) en otra carpeta
& $B -b --factory-startup -P villa_render.py -- --scale 30 --samples 96 --outdir $env:TEMP\villa_prev

# solo algunas tomas
& $B -b --factory-startup -P villa_render.py -- --only villa_maqueta_iso,og_image

# 3) AR de sobremesa 1:20 (USDZ con las texturas empaquetadas y reducidas a 512 px: 10,2 MB)
& $B -b --factory-startup -P export_usdz_mesa.py -- --tex 512
```

Opciones de `villa_render.py`:

- `--only a,b`: renderiza solo esas tomas.
- `--scale N`: porcentaje de resolución.
- `--samples N`: fuerza las muestras en todas las tomas.
- `--outdir RUTA`: carpeta de salida.
- `--sun-az` y `--sun-el`: sol por defecto, 292° / 38°.
- `--force-sun az,el`: un mismo sol en todas las tomas, para pruebas.
- `--save-blend`: guarda `villa_renders.blend`.
- `--no-render`: construye la escena sin renderizar.

Nombres de salida: `<toma>.png` es RGBA transparente, con la sombra en el canal alfa, y `<toma>_opaco.png`
es la misma imagen compuesta sobre #EFEBE4. `og_image.png` es solo opaca y `villa_plano_lineas.png`
es solo sobre blanco.

## Qué hace el script

1. **Importación y roles.** Importa el glTF y separa por material los objetos multimaterial, de modo
   que cada objeto tiene un solo rol:
   - `Maqueta`: todo lo que está por debajo de 1,15 m.
   - `Alto`: materiales `*_Alto`, lo que está por encima del corte.
   - `Corte seccion`: tapas `Corte_Seccion`, el poché oscuro.
2. **Modos.**
   - **maqueta**: oculta `Alto`.
   - **full**: muestra `Alto` y oculta las tapas de corte.
   - **lineas**: plano 2D. Un override de material de emisión plana lee la propiedad por objeto
     `plano_valor`: 0 para las tapas de muro (poché negro), gris muy claro para los suelos y blanco
     para el resto. Freestyle dibuja siluetas, bordes y pliegues a 1,6 px.
3. **Luz.**
   - Lámpara Sun cálida (1.0/0.80/0.60, 4,2 W/m², ángulo de 1,6° para sombras suaves) desde el ONO
     (292°).
   - Cielo físico `MULTIPLE_SCATTERING` sin disco solar, algo desaturado y calentado, como luz ambiente.
   - AgX con el look "Medium High Contrast" y exposición 0.
   - En las tomas de interior y en la planta, el sol sube a 50-52° para que los muros cortados no
     oscurezcan las estancias.
4. **Suelo y sombra.**
   - Plano *shadow catcher* bajo la base de la maqueta (z = -0,601 m) y película transparente.
   - La escalera de caracol sobresale 2,6 m. Para que su sombra no aparezca en el suelo como un anillo
     suelto, el sol se divide en dos con *light linking*. `Sol_Tarde` ilumina todo menos el suelo, así
     que la escalera sigue proyectando sombra sobre la terraza. `Sol_Tarde_Suelo` ilumina solo el suelo
     y la escalera no lo bloquea.
   - Las variantes `_opaco` se componen después sobre #EFEBE4 en espacio de pantalla (sRGB). Así el
     color del fondo es exacto y la sombra se multiplica sobre él.
5. **Cámaras.**
   - Encuadre automático de una caja de la planta (x, y en metros del plano) con azimut y elevación
     fijos: búsqueda binaria de la distancia y `shift` para centrar.
   - La planta cenital es ortográfica. La comparten `villa_planta_cenital` y `villa_plano_lineas`,
     así que las dos imágenes coinciden píxel a píxel (comprobado) para el deslizador
     "plano 2D -> 3D".
6. **Ajustes de material.** Vidrios con transmisión real en lugar de alpha, espejos metálicos y poché
   y base mates.

Coordenadas: el importador deja la escena en metros del plano: x este, y norte, z altura. El suelo
interior está en 0 y la base de la maqueta va de -0,60 a -0,02.

## Tiempos (RTX 4060, set completo del 28-09-2026)

| Toma | Resolución | Muestras | Tiempo |
|---|---|---|---|
| villa_maqueta_iso | 2800×1800 | 512 | 71 s |
| villa_planta_cenital | 2400×3700 | 512 | 102 s |
| villa_plano_lineas | 2400×3700 | 32 + Freestyle | 8 s |
| villa_salon_dormitorio | 2400×1600 | 384 | 34 s |
| villa_dormitorios | 2400×1600 | 384 | 40 s |
| villa_bano_suite | 2000×1600 | 384 | 29 s |
| villa_terraza | 2400×1600 | 384 | 41 s |
| og_image | 1200×630 | 512 | 10 s |
| villa_muros_completos | 2800×1800 | 512 | 73 s |
| **Total** (con carga y guardado) | | | **unos 7 min** |
