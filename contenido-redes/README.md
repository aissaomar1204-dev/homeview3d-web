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

## Serie general «¿Por qué…?» (para crecer en seguidores)

Desde noviembre de 2026, una segunda serie para **público general**: curiosidades sobre el origen de los planos, la
arquitectura y los modelos 3D. Sirve para ganar seguidores antes de hablar a promotoras. Carpetas `pqNN-titulo`.

Lo que cambia respecto a la serie de promotoras (decidido por Álvaro el 2026-11-02):
- **Cierre neutro:** no se dice «Mándame el plano. Te enseño la casa.» ni se pide seguir o comentar. Tras la última
  frase, el logo y homeview3d.com en silencio. Es una prueba para ver qué viralidad sale sola y qué pide la gente.
- El caption sí puede pedir (guardar, mandar, seguir y una pregunta de un toque); el comentario fijado lleva solo las
  fuentes, y no hay encuestas.
- Lo demás se mantiene: identidad, voz de Tony con Eleven v3 (unos 930 créditos, 0,34 $, por capítulo de ~45 s),
  todo dibujado hasta el giro e imágenes reales de HomeView después, y cada dato con su fuente.

| Nº | Título | Estado | Duración | Ángulo |
| --- | --- | --- | --- | --- |
| pq01 | Planos azules | Hecho | 0:42 | Por qué los planos antiguos eran azules: la cianotipia de Herschel (1842) y el «blueprint» |
| pq02 | La tetera | Hecho | 0:42 | El modelo 3D más famoso del mundo es una tetera (Newell, Utah, 1975); arranca con «¿Sabes que…?» |
| pq03 | El dibujo técnico | Idea (anunciado en el caption del pq02) | | Monge y la geometría descriptiva, secreto militar francés |
| pq04 | La escalera cómoda | Idea | | La regla de Blondel (1675) y la norma española (por comprobar) |
| pq05 | El plano más antiguo | Idea | | La estatua de Gudea con el plano de un templo (Louvre); sin decir «el más antiguo» |
| pq06 | El metro | Idea (por comprobar) | | Francia lo sacó midiendo la Tierra (1792-1798); la medición acababa en Barcelona y Méchain escondió un error. Giro: los planos se dibujan en metros |
| pq07 | Los triángulos | Idea (por comprobar) | | Por qué todo lo 3D está hecho de triángulos: tres puntos siempre quedan en un mismo plano. Giro: la casa, en malla |

## Tanda del sector (para crecer, desde noviembre de 2026)

Vídeos de vivienda nueva para un público más amplio: comparativas, rankings, lujo, inversión (solo cómo se calcula),
debate y humor. Guiones en `guiones/tanda-sector-1.md`. Carpetas `reNN-titulo` (numeración provisional).

Lo que cambia (Álvaro, 2026-11-03): todo se dibuja con código, como en Wodlog, y no hace falta que haya imágenes de
HomeView. Cierre neutro en todos, también en el debate y el humor: la pregunta va en el caption.

| Nº | Título | Estado | Duración | Ángulo |
| --- | --- | --- | --- | --- |
| re01 | 300.000 € | Hecho | 0:33 | Los metros que da el mismo dinero en Málaga, Barcelona y Madrid (tasación oficial, 2.º trim. 2026) |
| re02 | El ranking | Hecho | 0:44 | Los 5 municipios con la vivienda más cara (tasación oficial, 2.º trim. 2026): tres en Baleares |
| re03 | La villa | Guion | | Qué hace cara una villa: suelo, vistas, metros y acabados (SIMULACIÓN) |
| re04 | La rentabilidad | Guion | | Bruta y neta de un piso alquilado, con cifras de SIMULACIÓN; no es una recomendación |
| re05 | La terraza al sur | Guion | | El mismo piso con cuatro orientaciones |
| re06 | El diccionario | Guion | | Lo que de verdad dicen las palabras de los anuncios |

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
