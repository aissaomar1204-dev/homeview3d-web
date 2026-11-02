# Contenido para redes · reels de Home View 3D

Serie de reels verticales (9:16, 1080×1920, 30 fps, 40-60 s) para **promotoras y constructoras** de obra nueva en la
Costa del Sol. Misma fórmula que funcionó en Wodlog: gancho a contracorriente, el mecanismo dibujado, un giro a mitad,
jerga del sector, la voz sin silencios y una base musical continua.

Esta carpeta vive en la rama `contenido` de `homeview3d-web` (no se fusiona con `main`: no es parte de la web).
Para hacer un reel nuevo con Claude Code basta con abrir el repo en esta rama y pedir «haz el reel 05» o
«haz un reel nuevo»: la skill `.claude/skills/reel-homeview/SKILL.md` tiene el procedimiento completo.

## Estado de la serie

| Nº | Título | Estado | Duración | Ángulo |
| --- | --- | --- | --- | --- |
| 03 | El bucle | Hecho | 0:58 | El comprador pregunta, el comercial contesta, vuelve a preguntar… El plano no cierra el bucle |
| 01 | Dos mil kilómetros | Hecho | 0:41 | El 27,9 % de las compraventas en Málaga son de no residentes: deciden desde lejos |
| 04 | Tres segundos | Hecho | 0:44 | Reto: 3 preguntas sobre el plano de la villa. Las respuestas, en 3D |
| 06 | El domingo | Hecho | 0:37 | Dossiers en PDF iguales; gana la promoción que se puede recorrer |
| 02 | Más leads | Hecho | 0:47 | Más anuncios no tapan los agujeros del embudo |
| 05 | El tabique | Pendiente | | Para constructoras: el proyecto cambia y las agencias enseñan la versión vieja |
| 07 | Cuatro metros de stand | Pendiente | | De temporada (ferias): la maqueta no se lleva a casa |
| 08 | La ventana de la IA | Pendiente | | Hay que hacer **de verdad** la prueba con una IA de imágenes y enseñarla sin retocar |

Los guiones originales de los ocho están en `guiones/guiones-homeview.html` (ábrelo en el navegador). Son un punto de
partida: al producirlos se adaptan para no repetir escenas (ver más abajo).

## Qué hay en cada carpeta de vídeo

| Archivo | Para qué |
| --- | --- |
| `guion.json` | Los fragmentos de la locución (cada uno es un subtítulo), su escena y la pausa después |
| `escena.html` | La animación: HTML/SVG de 540×960 que se dibuja fotograma a fotograma con `render(t)` |
| `build.py` | Calcula los tiempos con la voz, captura los fotogramas y monta el MP4 con sonido |
| `voz/elevenlabs-tony-v3.mp3` | La locución de Tony (una sola toma). El WAV se rehace solo desde aquí |
| `voz/cortes.json` | (si existe) dónde empieza y acaba cada fragmento en la toma, puesto a mano |
| `assets/` | Imágenes y fuentes que usa la escena (copiadas de `public/assets`) |
| `salida/NN-titulo-1080.mp4` | **El vídeo para publicar** |
| `salida/NN-titulo-publicacion.txt` | Ficha de publicación: captions, comentario fijado, encuestas, horarios, portada, métricas |

`RECURSOS-USADOS.md` apunta qué imágenes y qué situaciones ha usado cada vídeo. **Se consulta antes de empezar uno
nuevo y se actualiza al acabarlo.**

## Puesta en marcha (una vez por ordenador)

```bash
cd contenido-redes
python -m venv .venv
# Windows: .venv\Scripts\activate    ·    Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium          # no hace falta en Windows si está Microsoft Edge
```

`imageio-ffmpeg` trae su propio ffmpeg; no hay que instalar nada más.

## Comandos (dentro de la carpeta del vídeo)

```bash
python build.py tiempos               # recalcula timeline.json con la voz
python build.py muestras 0.5 12 30    # fotogramas sueltos en salida/muestras/
python ../herramientas/hoja.py        # hoja de contacto con las muestras (salida/muestras/_hoja.jpg)
python build.py video                 # vídeo completo: salida/<nombre>-voz-final.mp4 (3-5 min)
```

Después, renombrar `…-voz-final.mp4` a `NN-titulo-1080.mp4`. Para revisar en el móvil se puede sacar una versión
ligera (no se publica):

```bash
python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"   # ruta de ffmpeg
<ffmpeg> -i NN-titulo-1080.mp4 -vf scale=540:960 -c:v libx264 -crf 28 -c:a aac -b:a 96k NN-titulo-ligero.mp4
```

## El flujo, paso a paso

1. **Elegir guion y recursos.** Leer el guion en `guiones/`, y `RECURSOS-USADOS.md`. Si el guion repite una situación
   o una imagen ya usada, se adapta manteniendo la idea (así se hizo el 06).
2. **`guion.json`.** Frases cortas, una por subtítulo. Los números, en letra («doscientos»). Cierre fijo:
   «Mándame el plano.» / «Te enseño la casa.».
3. **Voz.** ElevenLabs, voz **«Tony - Expressive, Fast and Spontaneous»** (`voice_id 851ejYcv2BoNPjrkw93G`), modelo
   **Eleven v3**, todo el guion en una sola toma: empieza por `[confident]` y lleva `[short pause]` entre fragmentos.
   Una toma de ~55 s cuesta unos 1.000 créditos. Se guarda como `voz/elevenlabs-tony-v3.mp3`.
   - Con el conector de ElevenLabs en Claude: `creative_generate_speech` (1 generación) y luego
     `creative_get_flow_run_status` da el `content_url` para descargarlo. El conector tiene que estar conectado con
     la cuenta de ElevenLabs de AS Trinity, que es la que tiene la voz de Tony.
   - Sin conector: en elevenlabs.io → Text to Speech, mismos ajustes, y descargar el MP3.
4. **Cortes.** `python build.py tiempos` reparte la toma entre los fragmentos buscando silencios. Si los subtítulos
   salen desplazados, se escriben los cortes a mano en `voz/cortes.json` (lista de `[inicio, fin]` en segundos sobre la
   toma, uno por fragmento) mirando los silencios; ver el 02, 04 o 06.
5. **`escena.html`.** Una escena por bloque del guion. La animación lee los tiempos de `timeline.json` (`TL.cues`):
   cada efecto cae en una palabra concreta. `build.py` define los cues y los efectos de sonido (`tiempos()` y
   `mezclar()`). Lo más rápido es copiar la carpeta del vídeo más parecido y cambiar escenas, cues y sonidos.
6. **Revisar** con `muestras` y la hoja de contacto: textos que se solapan, imágenes que se salen, subtítulos
   tapados (los subtítulos ocupan de y=128 a ~210; el contenido empieza en y≥230).
7. **Render** con `video`. Comprobar: volumen medio ~-19 dB y pico ~-4 dB, sin silencios de más de 0,25 s.
8. **Ficha de publicación** (`salida/NN-titulo-publicacion.txt`), con las 11 secciones de las demás.
9. **Drive:** carpeta «Animaciones Wodlog / HomeView 3D / NN · Título» con el 1080, el ligero y el TXT.
10. **Actualizar `RECURSOS-USADOS.md`** y la tabla de estado de este README.

## Reglas de la serie

**Identidad.** Fondo cielo `#D3E1EE` con rejilla, tinta `#0E1B2B`, acento `#1F5F9E`, sello/rojo `#B3261E`. Gloock
para frases grandes, Hanken Grotesk para subtítulos y rótulos. Mientras «la casa no existe», todo es línea dibujada;
tras el giro entra el render o la pantalla real. Cierre siempre igual, con el logo y homeview3d.com.

**Ritmo (lo que más se nota).** Voz del tirón, sin huecos (los huecos entre frases se fijan en 0,08-0,45 s), cortes
de escena de 0,08 s, empuje de cámara suave, base musical continua y un solo «ding», suave, como mucho. Nunca dos
dings a menos de 2 s ni efectos fuertes: el volumen se normaliza a -14 LUFS.

**No repetir.** Cada reel con imágenes y situaciones propias (ni la promoción desde el aire, ni las pantallas del
móvil, ni «Pedir llamada», ni la casa «Reservada»…). La lista está en `RECURSOS-USADOS.md`.

**Rigor.** Residencial Benahavís y la villa son ejemplos ficticios: rótulo «de ejemplo» en pantalla. Las cifras
inventadas llevan «SIMULACIÓN». Los datos reales, con fuente en el comentario fijado (p. ej. el 27,9 % del Ministerio
de Vivienda). Nada de testimonios ni de «nuestros clientes venden más». Las respuestas que se dan (dormitorios,
baños…) se comprueban en el modelo.
