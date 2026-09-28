"""Build the two self-hosted web fonts (rulebook Appendix 1, BUILD-SPEC §10).

    python scripts/fonts/build-fonts.py            # build + verify + print fallback metrics
    python scripts/fonts/build-fonts.py --check    # only verify the committed woff2 files

Output (committed):
    public/assets/fonts/archivo-var.woff2      Archivo, wdth 100-125, wght 400-650, ES/EN subset
    public/assets/fonts/geist-mono-var.woff2   Geist Mono, wght 400-500, ES/EN subset

Sources (not committed, downloaded on demand into scripts/fonts/src/): the variable TTFs from
github.com/google/fonts (OFL-1.1). Requires: pip install --user fonttools brotli
"""
import io
import os
import sys
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(HERE, "src")
OUT = os.path.join(ROOT, "public", "assets", "fonts")

GF = "https://github.com/google/fonts/raw/main/ofl/"
FONTS = [
    {
        "src": "Archivo[wdth,wght].ttf",
        "url": GF + "archivo/Archivo%5Bwdth,wght%5D.ttf",
        "lic": ("OFL-Archivo.txt", GF + "archivo/OFL.txt"),
        "axes": {"wdth": (100, 125), "wght": (400, 650)},
        "out": "archivo-var.woff2",
        "budget": 60_000,
    },
    {
        "src": "GeistMono[wght].ttf",
        "url": GF + "geistmono/GeistMono%5Bwght%5D.ttf",
        "lic": ("OFL-GeistMono.txt", GF + "geistmono/OFL.txt"),
        "axes": {"wght": (400, 500)},
        "out": "geist-mono-var.woff2",
        "budget": 25_000,
    },
]

# Appendix 1 set + the extra characters the content actually uses:
#   U+2013-2014 en/em dash, U+2192 arrow (content data), U+2248 ≈ (areas), U+2264-2265 ≤ ≥ (budgets, notes),
#   U+2009 thin space, U+202F narrow no-break space (Intl number formatting in some locales).
UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,"
    "U+2009,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+202F,U+2032-2033,"
    "U+20AC,U+2122,U+2192,U+2212,U+2248,U+2264-2265"
)
# rvrn is kept: Archivo uses required variation alternates (glyph swaps at heavy weights).
FEATURES = ["kern", "liga", "calt", "tnum", "lnum", "pnum", "case", "ccmp", "locl", "mark", "mkmk", "rvrn"]

MUST_HAVE = "ñáéíóúüÑÁÉÍÓÚÜ¿¡«»“”‘’²×€≈·…–—≤≥ºª°"


def fetch(url, path):
    if os.path.exists(path):
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    print(f"  downloading {url}")
    with urllib.request.urlopen(url) as r, open(path, "wb") as f:
        f.write(r.read())


def parse_unicodes(spec):
    out = set()
    for part in spec.split(","):
        part = part.strip().upper().replace("U+", "")
        if "-" in part:
            a, b = part.split("-")
            out.update(range(int(a, 16), int(b, 16) + 1))
        else:
            out.add(int(part, 16))
    return out


def build(font):
    src = os.path.join(SRC, font["src"])
    fetch(font["url"], src)
    fetch(font["lic"][1], os.path.join(SRC, font["lic"][0]))
    tt = TTFont(src)
    limits = {tag: tuple(rng) for tag, rng in font["axes"].items()}   # L3 axis limiting: keep a range
    inst = instancer.instantiateVariableFont(tt, limits)
    buf = io.BytesIO()
    inst.save(buf)
    buf.seek(0)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.name_IDs = ["*"]           # keep names (copyright + licence strings stay in the file, OFL §2)
    opts.name_languages = [0x0409]
    opts.notdef_outline = True
    opts.hinting = False            # variable TTF hinting is dropped; browsers ignore it on these sizes
    opts.desubroutinize = True
    opts.drop_tables += ["DSIG"]
    f = TTFont(buf)
    s = subset.Subsetter(opts)
    s.populate(unicodes=parse_unicodes(UNICODES))
    s.subset(f)
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, font["out"])
    f.flavor = "woff2"
    f.save(out)
    return out


def verify(font):
    path = os.path.join(OUT, font["out"])
    f = TTFont(path)
    size = os.path.getsize(path)
    cmap = f.getBestCmap()
    missing = [c for c in MUST_HAVE if ord(c) not in cmap]
    wanted = parse_unicodes(UNICODES)
    src_cmap = TTFont(os.path.join(SRC, font["src"])).getBestCmap() if os.path.exists(os.path.join(SRC, font["src"])) else None
    not_in_source = sorted(u for u in wanted if src_cmap is not None and u not in src_cmap)
    axes = {a.axisTag: (a.minValue, a.defaultValue, a.maxValue) for a in f["fvar"].axes}
    gsub = sorted({r.FeatureTag for r in f["GSUB"].table.FeatureList.FeatureRecord}) if "GSUB" in f else []
    gpos = sorted({r.FeatureTag for r in f["GPOS"].table.FeatureList.FeatureRecord}) if "GPOS" in f else []
    ok = not missing and size <= font["budget"]
    for tag, (lo, hi) in font["axes"].items():
        ok = ok and axes.get(tag, (None, None, None))[0] == lo and axes[tag][2] == hi
    print(f"{font['out']}: {size} bytes ({size / 1024:.1f} KB), {len(cmap)} codepoints, glyphs {f['maxp'].numGlyphs}")
    print(f"  axes {axes}")
    print(f"  GSUB {gsub} | GPOS {gpos}")
    print(f"  must-have missing: {missing or 'none'} | requested but not in source font: "
          f"{[f'U+{u:04X}' for u in not_in_source] or 'none'}")
    print(f"  {'OK' if ok else 'FAIL'} (budget {font['budget']} bytes)")
    return ok


# ---------- fallback metrics (tokens.css) ----------
# Representative ES/EN copy; size-adjust = advance-width ratio (no kerning) Archivo / Arial on this text.
# The authoritative in-browser check is scripts/fonts/specimen.html (renders both and compares widths).
CORPUS = (
    "Convertimos el plano 2D de tu vivienda en un modelo 3D fotorrealista, con renders, visor web y realidad "
    "aumentada sin app. Pide tu demo: te enviamos la maqueta en 48 horas, con precios desde 1.200 euros + IVA. "
    "We turn a home's 2D floor plan into a photorealistic, furnished 3D model with renders, an interactive web "
    "viewer and app-free augmented reality for estate agents, developers and architects across Spain."
)


def avg_width(tt, loc=None):
    if loc:
        tt = instancer.instantiateVariableFont(tt, loc)
    cmap = tt.getBestCmap()
    hmtx = tt["hmtx"]
    upm = tt["head"].unitsPerEm
    chars = [c for c in CORPUS if ord(c) in cmap]
    return sum(hmtx[cmap[ord(c)]][0] for c in chars) / len(chars) / upm


def fallback_metrics():
    arial_path = r"C:\Windows\Fonts\arial.ttf"
    if not os.path.exists(arial_path):
        print("Arial not found; skipping fallback metrics")
        return
    arial = avg_width(TTFont(arial_path))
    built = os.path.join(OUT, "archivo-var.woff2")
    base = TTFont(built)
    hhea = base["hhea"]
    upm = base["head"].unitsPerEm
    print("\nFallback metrics vs Arial (hhea ascent/descent of the built Archivo):")
    for label, loc in [("Text (wdth 100, wght 400)", {"wdth": 100, "wght": 400}),
                       ("Display S (wdth 106, wght 560)", {"wdth": 106, "wght": 560}),
                       ("Display L (wdth 118, wght 560)", {"wdth": 118, "wght": 560})]:
        w = avg_width(TTFont(built), loc)
        sa = w / arial
        asc = hhea.ascent / upm / sa
        desc = abs(hhea.descent) / upm / sa
        gap = hhea.lineGap / upm / sa
        print(f"  {label}: size-adjust {sa * 100:.1f}%  ascent-override {asc * 100:.1f}%  "
              f"descent-override {desc * 100:.1f}%  line-gap-override {gap * 100:.1f}%")


def main():
    check_only = "--check" in sys.argv
    ok = True
    for font in FONTS:
        if not check_only:
            print(f"building {font['out']} …")
            build(font)
        ok = verify(font) and ok
    fallback_metrics()
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
