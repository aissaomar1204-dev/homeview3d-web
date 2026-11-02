# Vídeo 03 · El bucle

Primer vídeo de la serie para promotoras. 9:16, 1080×1920, 30 fps. Storyboard completo:
https://claude.ai/artifact/GQHrvbyAHgNZgvApWQN6uB

## Qué hay aquí

| Archivo | Para qué |
| --- | --- |
| `guion.json` | Los 31 fragmentos de la locución (cada uno es un subtítulo) y la pausa después de cada uno |
| `escena.html` | La animación. Se dibuja fotograma a fotograma con `render(t)` |
| `build.py` | Calcula los tiempos con la voz, renderiza y monta los MP4 |
| `voz_guia.ps1` | Genera la voz guía sintética (Windows, voz Helena) |
| `assets/` | Imágenes y fuentes sacadas de `homeview3d-web/public/assets` |
| `salida/` | Los vídeos montados |

## Salidas

- `salida/el-bucle-voz-guia.mp4`: con voz sintética. **Solo para revisar ritmo; no se publica.**
- `salida/el-bucle-sin-voz.mp4`: solo efectos, para montar encima otra voz a mano.
- `salida/el-bucle-voz-final.mp4`: aparece cuando se graba la voz de verdad (ver abajo).

## Voz de la serie (la misma que Wodlog)

ElevenLabs → De texto a voz, voz **«Tony - Expressive, Fast and Spontaneous»**, modelo **Eleven v3**, el guion
entero de una sola toma empezando por `[confident]` y con `[pause]` / `[short pause]` entre frases. Descarga el MP3,
guárdalo en `voz/` y conviértelo a `voz/completa.wav`. `build.py` busca los silencios de la toma y la reparte entre
los 31 subtítulos solo; la animación sigue el ritmo de la voz.

La toma usada en el vídeo es `voz/elevenlabs-tony-v3.mp3`.

## Otra opción: grabar por frases

1. Graba cada fragmento de `guion.json` en un archivo aparte: `voz/01.wav`, `voz/02.wav` … `voz/31.wav`
   (WAV, cualquier frecuencia, mono o estéreo). Un fragmento por archivo, con un poco de silencio antes y después;
   el script lo recorta.
2. Ejecuta `python build.py video`.

Si están los 31 archivos, `build.py` usa esa voz y recoloca toda la animación a su ritmo (el vídeo se alarga o
acorta solo). Si falta alguno, vuelve a la voz guía.

## Comandos

```
python build.py tiempos              # solo recalcula timeline.json
python build.py muestras 2.3 31 57   # fotogramas sueltos en salida/muestras/
python build.py video                # vídeo completo (unos 5 minutos)
```

Requisitos: Python 3.12+, `pip install numpy imageio-ffmpeg playwright` y Microsoft Edge instalado
(Playwright lo usa con `channel="msedge"`, sin descargar navegadores).

## Rigor

Residencial Benahavís es una promoción ficticia: las escenas con renders llevan el rótulo
«Promoción de ejemplo · imagen ilustrativa». Los meses del bucle son ilustrativos.
