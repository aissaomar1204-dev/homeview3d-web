"""Monta el vídeo «¿Sabes dónde está la vivienda más cara de España?» (tanda 1 del sector, guion 2) a partir de escena.html.

Uso:
  python build.py tiempos          # calcula timeline.json con la voz disponible
  python build.py muestras 1.5 9   # captura fotogramas sueltos en salida/muestras/
  python build.py video            # renderiza y monta los MP4 en salida/

Voz: voz/elevenlabs-tony-v3.mp3 (una sola toma); voz/cortes.json dice dónde empieza y acaba cada
fragmento. Requisitos: numpy, imageio-ffmpeg, playwright y Microsoft Edge.
"""
import json, subprocess, sys, wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "salida"
NOMBRE = "ranking"
SR = 48000
FPS = 30
INICIO = 0.1  # la voz entra casi en el primer fotograma


# ---------- voz ----------
def leer_wav(p):
    with wave.open(str(p), "rb") as w:
        sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
        x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    if ch > 1:
        x = x.reshape(-1, ch).mean(axis=1)
    if sr != SR:
        x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    # recorta silencio inicial y final
    env = np.convolve(np.abs(x), np.ones(480) / 480, mode="same")
    idx = np.where(env > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - 960): idx[-1] + 2400]
    return x


def fuente_voz(frags):
    real = ROOT / "voz"
    mp3 = real / "elevenlabs-tony-v3.mp3"
    if not (real / "completa.wav").exists() and mp3.exists():  # el WAV no se sube al repo: se rehace desde el MP3
        subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-i", str(mp3), "-ac", "1", "-ar", str(SR), str(real / "completa.wav")], check=True)
    if (real / "completa.wav").exists():
        return real, "toma completa"
    if all((real / f"{f['n']:02d}.wav").exists() for f in frags):
        return real, "grabada"
    return ROOT / "voz-guia", "guía sintética"


def buscar_silencios(x, minimo=0.07):
    """Silencios de la toma como (inicio, fin) en segundos, sin contar los bordes."""
    hop = SR // 100  # ventanas de 10 ms
    rms = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, mode="same")[::hop])
    umbral = max(0.012, 0.06 * np.percentile(rms, 95))
    callado = rms < umbral
    silencios, i = [], 0
    while i < len(callado):
        if callado[i]:
            j = i
            while j < len(callado) and callado[j]:
                j += 1
            if j - i >= minimo * 100 and i > 0 and j < len(callado):
                silencios.append((i / 100, j / 100))
            i = j
        else:
            i += 1
    return silencios


def montar_toma(x, frags, cortes):
    """Recorta cada frase de la toma y las vuelve a pegar con huecos cortos y fijos.

    Así la voz va del tirón: fuera respiraciones y silencios largos. El hueco sale de la «pausa»
    del guion (x0,35, entre 0,08 y 0,45 s). Devuelve el audio y los nuevos (inicio, fin).
    """
    fundido = int(0.01 * SR)
    rampa = np.linspace(0, 1, fundido)
    trozos, nuevos, t = [], [], 0.0
    for f, (a, b) in zip(frags, cortes):
        clip = x[max(0, int((a - 0.04) * SR)): int((b + 0.06) * SR)].copy()
        clip[:fundido] *= rampa; clip[-fundido:] *= rampa[::-1]
        nuevos.append((t + 0.04, t + 0.04 + (b - a)))
        hueco = f.get("hueco", min(0.45, max(0.08, f["pausa"] * 0.35))) if f is not frags[-1] else 0.0
        trozos += [clip, np.zeros(int(hueco * SR), dtype=np.float32)]
        t += len(clip) / SR + hueco
    return np.concatenate(trozos), nuevos


def cortar_toma(x, frags):
    """Reparte una toma completa entre los fragmentos del guion.

    Busca los silencios de la toma y elige, con programación dinámica, los que mejor
    separan los fragmentos según su longitud en caracteres. Devuelve (inicio, fin) en segundos.
    """
    silencios = buscar_silencios(x)
    k = len(frags) - 1
    if len(silencios) < k:
        raise SystemExit(f"La toma solo tiene {len(silencios)} pausas y hacen falta {k}: regenera con más pausas.")
    total = len(x) / SR
    chars = np.array([len(f["texto"]) for f in frags], dtype=float)
    esperado = np.cumsum(chars)[:-1] / chars.sum() * total  # dónde caería cada corte
    n = len(silencios)
    INF = 1e18
    coste = np.full((k + 1, n + 1), INF); de = np.zeros((k + 1, n + 1), dtype=int)
    coste[0, :] = 0
    for c in range(1, k + 1):
        for s in range(c - 1, n):
            a, b = silencios[s]
            local = ((a + b) / 2 - esperado[c - 1]) ** 2 - 12.0 * (b - a)  # cerca de lo esperado y pausa larga
            prev = coste[c - 1, :s + 1] if c > 1 else np.zeros(1)
            j = int(np.argmin(prev)); best = prev[j]
            coste[c, s + 1] = best + local; de[c, s + 1] = j
    fin = int(np.argmin(coste[k, 1:])) + 1
    elegidos = []
    for c in range(k, 0, -1):
        elegidos.append(fin - 1); fin = de[c, fin]
    elegidos = elegidos[::-1]
    bordes = [(0.0, None)] + [silencios[s] for s in elegidos] + [(None, total)]
    return [(bordes[i][1] if bordes[i][1] is not None else 0.0, bordes[i + 1][0] if bordes[i + 1][0] is not None else total)
            for i in range(len(frags))]


def tiempos():
    g = json.loads((ROOT / "guion.json").read_text(encoding="utf-8"))
    frags = g["fragmentos"]
    carpeta, tipo = fuente_voz(frags)
    t, voces = INICIO, []
    if tipo == "toma completa":
        bruta = leer_wav(carpeta / "completa.wav")
        manual = carpeta / "cortes.json"  # si la detección automática se equivoca, cortes puestos a mano
        cortes = json.loads(manual.read_text(encoding="utf-8"))["cortes"] if manual.exists() else cortar_toma(bruta, frags)
        toma, cortes = montar_toma(bruta, frags, cortes)
        voces.append((t, toma))
    for i, f in enumerate(frags):
        if tipo == "toma completa":
            a, b = cortes[i]
            f["start"], f["end"] = round(INICIO + a, 3), round(INICIO + b, 3)
            dur = b - a
        else:
            x = leer_wav(carpeta / f"{f['n']:02d}.wav")
            dur = len(x) / SR
            f["start"], f["end"] = round(t, 3), round(t + dur, 3)
            voces.append((f["start"], x))
        palabras = f["texto"].split()
        pesos = [len(w) + 2 for w in palabras]
        tot, acc = sum(pesos), 0
        f["palabras"] = []
        for w, p in zip(palabras, pesos):
            f["palabras"].append({"w": w, "t": round(f["start"] + dur * acc / tot, 3)})
            acc += p
        f["ocultar"] = f["n"] in (1,)  # la pregunta del principio se lee en grande
        t = f["end"] + f["pausa"]
    dur_total = round(t, 3)

    escenas = []
    for n in sorted({f["escena"] for f in frags}):
        primero = next(f for f in frags if f["escena"] == n)
        escenas.append({"n": n, "start": 0.0 if n == 1 else round(primero["start"] - 0.2, 3)})
    for i, e in enumerate(escenas):
        e["end"] = escenas[i + 1]["start"] if i + 1 < len(escenas) else dur_total

    F = {f["n"]: f for f in frags}
    def palabra(n, i):
        return F[n]["palabras"][i]["t"]

    cues = {
        "top5": F[2]["start"],
        "tasacion": palabra(2, 6),
        "quinto": F[3]["start"],
        "n5": palabra(3, 1),
        "v5": palabra(3, 3),
        "poz": palabra(4, 1),
        "dos": palabra(4, 3),
        "cuarto": F[5]["start"],
        "n4": F[5]["start"] + 0.25,  # tras «Cuarto:» (14,38 − 14,13 s en la toma)
        "v4": F[5]["start"] + 1.05,
        "tercero": F[6]["start"],
        "n3": F[6]["start"] + 0.67,  # tras «Tercero:»
        "v3": F[6]["start"] + 1.59,
        "segundo": F[7]["start"],
        "n2": F[7]["start"] + 0.67,  # tras «Segundo:»
        "v2": F[7]["start"] + 2.08,
        "primero": F[8]["start"],
        "n1": F[8]["start"] + 1.56,  # tras «diferencia:» (27,86 − 26,30 s)
        "v1": palabra(9, 2),
        "baleares": F[10]["start"],
        "islas": palabra(10, 5),
        "costa": F[11]["start"],
        "mar": F[12]["start"],
        "mal": F[12]["start"] + 1.85,  # tras «doce.» (39,48 − 37,63 s)
        "barato": F[13]["start"],
        "vil": F[14]["start"],
        "v666": F[14]["start"] + 1.97,  # tras «Albacete:» (45,89 − 43,92 s)
        "mismo": F[15]["start"],
        "diez": F[15]["start"] + 1.57,  # tras «cuadrado,» (50,06 − 48,49 s)
        "logo": F[15]["end"] + 0.3,
    }
    r3 = lambda v: round(v, 3) if isinstance(v, float) else [r3(x) for x in v]
    cues = {k: r3(v) for k, v in cues.items()}
    tl = {"duracion": dur_total, "voz": tipo, "fragmentos": frags, "escenas": escenas, "cues": cues}
    (ROOT / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"timeline.json · {dur_total:.1f} s · voz {tipo}")
    return tl, voces


# ---------- sonido ----------
def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def sfx_ruido(dur, lo, hi, vol, seed=2):
    n = int(dur * SR)
    r = np.random.default_rng(seed).normal(0, 1, n)
    spec = np.fft.rfft(r); f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    x = np.fft.irfft(spec, n); x /= np.abs(x).max() + 1e-9
    a = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.08 * SR))
    mod = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * np.arange(n) / SR)
    return x * a * mod * vol


def sfx_tic(f=1500, vol=0.35):
    n = int(0.05 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * env_exp(n, 0.008) * vol


def sfx_ding():
    """Toque corto y suave (tipo marimba, Mi5 + Sol5), muy por debajo de la voz."""
    n = int(0.35 * SR); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((659.3, 1), (784.0, .6), (1318.5, .15)))
    ataque = np.minimum(1, t / 0.004)
    return x * ataque * env_exp(n, 0.07) * 0.06


def sfx_golpe_grave():
    n = int(2.2 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 55 * t) * env_exp(n, 0.6) * 0.55
    sube = sfx_ruido(1.0, 300, 3000, 0.12, seed=5)
    x[: len(sube)] += sube * np.linspace(0, 1, len(sube))
    return x


def sfx_encoge():
    """Soplido corto que baja: el plano se encoge (suave, por debajo de la voz)."""
    x = sfx_ruido(0.45, 300, 2200, 0.1, seed=11)
    return x * np.linspace(1, 0.2, len(x))


def sfx_sube():
    """Soplido corto que sube: las columnas crecen (suave, por debajo de la voz)."""
    x = sfx_ruido(1.2, 300, 2400, 0.09, seed=13)
    return x * np.linspace(0.2, 1, len(x)) ** 2


def sfx_aplaste():
    """Golpe sordo y corto: el sello cae sobre el plano (suave, por debajo de la voz)."""
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (70 + 60 * np.exp(-t / 0.02)) * t) * env_exp(n, 0.05) * 0.3


def base_musical(dur, giro, bpm=100):
    """Base continua por debajo de la voz: pulso grave, bombo suave y acordes.

    Antes del giro suena contenida (bombo y bajo); desde el giro entra el charles y el acorde se abre.
    """
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n, dtype=np.float64)
    beat = 60 / bpm
    rng = np.random.default_rng(7)
    # acordes La m · Fa · Do · Sol, dos compases cada uno
    acordes = [(110.0, 130.8, 164.8), (87.3, 110.0, 130.8), (130.8, 164.8, 196.0), (98.0, 123.5, 146.8)]
    compas = 4 * beat
    for k in range(int(dur / (2 * compas)) + 1):
        i0, i1 = int(k * 2 * compas * SR), min(n, int((k + 1) * 2 * compas * SR))
        if i0 >= n: break
        tt = t[i0:i1] - t[i0]
        raiz, ter, qui = acordes[k % 4]
        brillo = 0.5 if k * 2 * compas < giro else 1.0
        pad = sum(np.sin(2 * np.pi * f * tt) for f in (raiz, ter, qui)) + brillo * 0.5 * np.sin(2 * np.pi * qui * 2 * tt)
        env = np.minimum(1, tt / 0.6) * np.minimum(1, (tt[-1] - tt + 1e-3) / 0.6)
        x[i0:i1] += pad * env * 0.05
        x[i0:i1] += np.sin(2 * np.pi * raiz / 2 * tt) * 0.08  # bajo
    for b in range(int(dur / beat)):
        i = int(b * beat * SR)
        m = min(int(0.25 * SR), n - i)
        tt = np.arange(m) / SR
        bombo = np.sin(2 * np.pi * (50 + 70 * np.exp(-tt / 0.03)) * tt) * np.exp(-tt / 0.12)
        x[i:i + m] += bombo * (0.35 if b % 2 == 0 else 0.22)
        if b * beat >= giro:  # charles a contratiempo tras el giro
            j = int((b + 0.5) * beat * SR); h = min(int(0.05 * SR), n - j)
            if h > 0:
                x[j:j + h] += rng.normal(0, 1, h) * np.exp(-np.arange(h) / (0.012 * SR)) * 0.05
    x *= np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 1.2)
    return x.astype(np.float32)


def mezclar(tl, voces, con_voz):
    C = tl["cues"]
    pista = np.zeros(int((tl["duracion"] + 0.5) * SR), dtype=np.float32)

    def poner(x, t, vol=1.0):
        i = int(t * SR)
        if i >= len(pista): return
        x = x[: len(pista) - i]
        pista[i: i + len(x)] += x * vol

    for i in range(6):  # el mapa se dibuja
        poner(sfx_tic(2600, 0.06), 0.25 + i * 0.22)
    for i in range(5):  # los cinco huecos de la tabla
        poner(sfx_tic(2200, 0.1), C["top5"] + 0.15 + i * 0.09)
    poner(sfx_tic(1500, 0.2), C["tasacion"])
    for k in ("quinto", "tercero", "costa", "barato"):  # el mapa se mueve
        poner(sfx_encoge(), C[k] - 0.1, 0.8)
    for k in ("n5", "n4", "n3", "n2", "mar", "mal", "vil"):  # sale una casa
        poner(sfx_tic(1800, 0.16), C[k])
    for k in ("v5", "v4", "v3", "v2", "v666"):  # su precio, en la tabla
        poner(sfx_tic(1400, 0.2), C[k])
    poner(sfx_tic(1200, 0.12), C["poz"])
    poner(sfx_golpe_grave(), C["n1"], 0.8)  # la primera crece por encima de todas
    poner(sfx_ding(), C["v1"] + 0.1)  # el único «ding»
    for i in range(3):  # las islas se encienden
        poner(sfx_tic(2400, 0.1), C["islas"] + i * 0.12)
    poner(sfx_sube(), C["mismo"] + 0.1)
    poner(sfx_tic(1500, 0.22), C["diez"])
    poner(base_musical(tl["duracion"] + 0.5, C["primero"]), 0, 0.16)
    if con_voz:
        for t0, x in voces:
            x = x / (np.abs(x).max() + 1e-9) * 0.8
            poner(x, t0)
    pista /= max(1.0, np.abs(pista).max() / 0.95)
    return pista


def escribir_wav(p, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


# ---------- imagen ----------
def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def pagina(p, tl):
    from playwright.sync_api import sync_playwright  # noqa
    try:  # Edge si está instalado (Windows); si no, el Chromium de Playwright (`playwright install chromium`)
        navegador = p.chromium.launch(channel="msedge")
    except Exception:
        navegador = p.chromium.launch()
    page = navegador.new_page(viewport={"width": 540, "height": 960}, device_scale_factor=2)
    page.goto((ROOT / "escena.html").as_uri())
    page.evaluate("tl => init(tl)", tl)
    return page


def muestras(tl, ts):
    from playwright.sync_api import sync_playwright
    d = OUT / "muestras"; d.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        page = pagina(p, tl)
        for t in ts:
            page.evaluate(f"render({t})")
            page.screenshot(path=str(d / f"t{t:05.1f}.png"))
    print(f"{len(ts)} muestras en {d}")


def video(tl, voces):
    from playwright.sync_api import sync_playwright
    OUT.mkdir(exist_ok=True)
    mudo = OUT / "_imagen.mp4"
    n = int(round(tl["duracion"] * FPS))
    cmd = [ffmpeg(), "-y", "-loglevel", "error", "-f", "image2pipe", "-c:v", "mjpeg", "-framerate", str(FPS), "-i", "-",
           "-vf", "scale=in_range=pc:out_range=tv,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-movflags", "+faststart", str(mudo)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with sync_playwright() as p:
        page = pagina(p, tl)
        for i in range(n):
            page.evaluate(f"render({i / FPS})")
            proc.stdin.write(page.screenshot(type="jpeg", quality=93))
            if i % 150 == 0:
                print(f"  fotograma {i}/{n}", flush=True)
    proc.stdin.close(); proc.wait()

    salidas = []
    for nombre, con_voz in ((f"{NOMBRE}-voz-{'guia' if tl['voz'] == 'guía sintética' else 'final'}.mp4", True), (f"{NOMBRE}-sin-voz.mp4", False)):
        wav = OUT / "_audio.wav"
        escribir_wav(wav, mezclar(tl, voces, con_voz))
        dst = OUT / nombre
        volumen = ["-af", "loudnorm=I=-14:TP=-1.5:LRA=11"] if con_voz else []  # nivel habitual en redes
        subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-i", str(mudo), "-i", str(wav), "-c:v", "copy", *volumen,
                        "-c:a", "aac", "-ar", "48000", "-b:a", "192k", "-ac", "2", "-shortest", "-movflags", "+faststart", str(dst)], check=True)
        salidas.append(dst)
    wav.unlink(); mudo.unlink()
    for s in salidas:
        print("listo:", s)


if __name__ == "__main__":
    accion = sys.argv[1] if len(sys.argv) > 1 else "video"
    tl, voces = tiempos()
    if accion == "muestras":
        muestras(tl, [float(x) for x in sys.argv[2:]])
    elif accion == "video":
        video(tl, voces)
