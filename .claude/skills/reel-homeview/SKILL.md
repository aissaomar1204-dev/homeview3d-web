---
name: reel-homeview
description: Produce un reel vertical de Home View 3D para redes (Instagram, TikTok, LinkedIn) dirigido a promotoras y constructoras, con la voz de Tony en ElevenLabs, animación HTML/SVG renderizada a MP4 y ficha de publicación. Úsala cuando pidan «haz el reel 05», «haz un vídeo nuevo», «otro reel de HomeView» o retocar uno de contenido-redes/.
---

# Reel de Home View 3D

Todo vive en `contenido-redes/` (rama `contenido`). Lee antes `contenido-redes/README.md` (flujo y reglas) y
`contenido-redes/RECURSOS-USADOS.md` (qué imágenes y situaciones ya se han usado). Habla con el usuario en español.

## 0. Preparación (si falta)

- `cd contenido-redes`, crea `.venv` e instala `requirements.txt`. En Mac/Linux: `playwright install chromium`.
- Comprueba que el conector de ElevenLabs está disponible (herramientas `creative_generate_speech`,
  `creative_get_flow_run_status`). Si no lo está, pide al usuario que lo conecte con la cuenta de ElevenLabs de
  AS Trinity (la que tiene la voz de Tony) o que genere la voz en elevenlabs.io y deje el MP3 en `voz/`.

## 1. Elegir guion y recursos

- Los guiones están en `contenido-redes/guiones/guiones-homeview.html` (pendientes: 05, 07, 08). Si el usuario no
  dice cuál, propón el siguiente pendiente. El **08** exige hacer de verdad la prueba con una IA de imágenes y enseñar
  el resultado sin retocar: no lo inventes; si no hay imagen real de la prueba, díselo y elige otro.
- Contrasta el guion con `RECURSOS-USADOS.md`. **No repitas imágenes ni situaciones** (ni la promoción desde el aire,
  ni las pantallas del móvil, ni «Pedir llamada», ni la casa «Reservada», ni WhatsApp, ni el avión, ni el domingo con
  la tablet…). Si choca, adapta las escenas manteniendo la idea y cuéntale al usuario qué has cambiado y por qué.
- Las imágenes libres están en `public/assets/` (raíz del repo). Mira las que vayas a usar (hoja de contacto con PIL)
  antes de decidir. Copia solo las necesarias a `NN-titulo/assets/`, junto con `fonts/` y `lockup-horizontal.svg`
  de otro vídeo.
- Todo lo que se afirme sobre una casa (dormitorios, baños, medidas) se comprueba en el modelo o en la web. Si no se
  puede comprobar, se quita del guion.

## 2. Carpeta y guion

- Copia la carpeta del vídeo más parecido como base (`build.py` y `escena.html`), con nombre `NN-titulo`.
- Escribe `guion.json`: `{"titulo", "nota", "fragmentos": [{"n", "escena", "texto", "pausa"}]}`. Frases cortas
  (un subtítulo cada una), números en letra, 40-60 s en total. Los dos últimos fragmentos siempre son «Mándame el
  plano.» y «Te enseño la casa.» (pausa 2.0). Opcional `"hueco"` para fijar un silencio (la cuenta atrás del 04).

## 3. Voz (una sola toma)

- `creative_generate_speech` con `model_id: "eleven_v3"`, `voice_id: "851ejYcv2BoNPjrkw93G"` (Tony - Expressive,
  Fast and Spontaneous), `generations_count: 1` y como prompt: `[confident] ` + los textos unidos con
  ` [short pause] `. Cuesta ~1.000 créditos por 55 s; no lo repitas para «reintentar».
- Cuando termine, `creative_get_flow_run_status` (flow_id y session_ids) da el `content_url`; descárgalo con curl a
  `voz/elevenlabs-tony-v3.mp3`. `build.py` crea `voz/completa.wav` a partir de él.

## 4. Tiempos y cortes

- `python build.py tiempos` y revisa que cada fragmento dure lo razonable para su texto.
- Si no cuadra: lista los silencios (`build.buscar_silencios(x, 0.05)` sobre `build.leer_wav(...)`), asigna cada
  fragmento entre silencios largos (las pausas de coma o dos puntos son internas) y escribe `voz/cortes.json`
  (`{"nota", "cortes": [[inicio, fin], ...]}`, uno por fragmento). Vuelve a ejecutar `tiempos`.

## 5. Animación y sonido

- En `escena.html`: una `<div class="sc" id="sN">` por escena (o elementos persistentes que se muestran por escena),
  y en `render(t)` toda la animación en función de `t` y de `TL.cues` (determinista: nada de `Date`, ni `Math.random`
  sin semilla, ni animaciones CSS). Subtítulos en y=128-210; contenido desde y≥230; textos grandes en Gloock.
- En `build.py`: `tiempos()` define los cues (inicios de fragmento o `palabra(n, i)`), `f["ocultar"]` para frases
  que se ven en grande, y `mezclar()` los efectos (tics, golpe grave en el giro, como mucho un `sfx_ding` suave,
  nunca dos dings a menos de 2 s) más `base_musical(...)` a 0,16. Cambia los nombres de salida al nuevo título.
- Antes del giro, todo dibujado en línea; tras el giro, imágenes reales con rótulo «de ejemplo» si son ficticias.

## 6. Revisión

- `python build.py muestras <t1> <t2> ...` (20-24 instantes repartidos) y `python ../herramientas/hoja.py`; mira
  `salida/muestras/_hoja.jpg` y corrige solapes, cortes y textos tapados. Repite hasta que esté limpio.
- `python build.py video` (en segundo plano; tarda unos minutos). Renombra a `salida/NN-titulo-1080.mp4` y saca la
  versión ligera (ver README).
- Comprueba con ffmpeg: `volumedetect` (medio ~-19 dB, pico ~-4 dB) y `silencedetect=n=-40dB:d=0.25` (ninguno).
  Extrae 6 fotogramas del MP4 final y míralos.

## 7. Publicación y registro

- Escribe `salida/NN-titulo-publicacion.txt` con las 11 secciones de los anteriores: archivos, de qué va, a quién va,
  caption IG/TikTok, caption LinkedIn, comentario fijado, votaciones y encuestas, cuándo publicar, primera hora,
  portada y detalles, qué medir, arranques alternativos, cómo sacarle más, lo que no se puede decir.
- Si el usuario lo pide, súbelo al Drive (carpeta «Animaciones Wodlog / HomeView 3D / NN · Título»): el conector de
  Drive crea la carpeta y el TXT; los MP4 se suben desde el navegador.
- Actualiza `RECURSOS-USADOS.md` (fila del vídeo, libres y «motivos ya usados») y la tabla de estado del README.
- Haz commit en la rama `contenido` solo si el usuario lo pide (mensaje en español, en presente).
