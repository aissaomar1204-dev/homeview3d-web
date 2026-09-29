"""
make_textures.py - the two tiny tileable textures next to the line drawings.

  python make_textures.py

  public/assets/deco/paper-grain.png   256x256, palette PNG (transparent + faint white + faint black specks),
                                       tileable (noise is low-passed with FFT, so the wrap-around is seamless),
                                       works on paper and on graphite without blend modes. <= 6 KB.
  public/assets/deco/hatch-45.svg      8x8 tile of a 45 degree architectural hatch (currentColor).
"""
import io
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "public", "assets", "deco"))
N = 256


def grain(seed=20260929, sigma=0.75, t_weak=1.75, t_strong=2.35, a_weak=13, a_strong=26):
    """Returns a palette image. Colours: 0 transparent, 1 weak white, 2 weak black, 3 strong white, 4 strong black."""
    rng = np.random.default_rng(seed)
    z = rng.normal(size=(N, N))
    fx = np.fft.fftfreq(N)[:, None]
    fy = np.fft.fftfreq(N)[None, :]
    k = np.exp(-(fx ** 2 + fy ** 2) * (2 * np.pi ** 2) * sigma ** 2)   # gaussian blur, wrap-around
    z = np.real(np.fft.ifft2(np.fft.fft2(z) * k))
    z = (z - z.mean()) / z.std()
    idx = np.zeros((N, N), dtype=np.uint8)
    idx[(z > t_weak)] = 1
    idx[(z < -t_weak)] = 2
    idx[(z > t_strong)] = 3
    idx[(z < -t_strong)] = 4
    img = Image.fromarray(idx, mode="P")
    pal = [0, 0, 0,  255, 255, 255,  0, 0, 0,  255, 255, 255,  0, 0, 0] + [0, 0, 0] * 251
    img.putpalette(pal)
    trans = bytes([0, a_weak, a_weak, a_strong, a_strong]) + bytes([0] * 251)
    img.info["transparency"] = trans
    return img, float((idx > 0).mean())


def save_png(img, path):
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True, transparency=img.info["transparency"], bits=3)
    open(path, "wb").write(buf.getvalue())
    return len(buf.getvalue())


HATCH = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" fill="none" '
         'stroke="currentColor" stroke-width=".55" stroke-linecap="butt">'
         '<title>45 degree hatch tile</title><path d="M-1 1 1-1M0 8 8 0M7 9 9 7"/></svg>')


def main():
    os.makedirs(OUT, exist_ok=True)
    img, dens = grain()
    p = os.path.join(OUT, "paper-grain.png")
    n = save_png(img, p)
    print("paper-grain.png  %d bytes  density %.1f%%" % (n, dens * 100))
    assert n <= 6 * 1024, "paper-grain.png over budget"
    p = os.path.join(OUT, "hatch-45.svg")
    open(p, "w", encoding="utf-8").write(HATCH)
    print("hatch-45.svg     %d bytes" % len(HATCH))


if __name__ == "__main__":
    main()
