"""Presentation board for the logo concepts (docs/brand/concepts/board.html)."""
from __future__ import annotations

import os
import re
import shutil

from concepts import CONCEPTS

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
FONTS = os.path.join(ROOT, "public", "assets", "fonts")

SIZES = [16, 24, 32, 48, 96, 256]


def _inner(doc):
    vb = re.search(r'viewBox="([^"]+)"', doc).group(1)
    inner = re.sub(r"^<svg[^>]*>", "", doc.strip())
    inner = re.sub(r"</svg>$", "", inner)
    inner = re.sub(r"<title[^>]*>.*?</title>", "", inner)
    return vb, inner


def _symbol(id_, doc):
    vb, inner = _inner(doc)
    return f'<symbol id="{id_}" viewBox="{vb}">{inner}</symbol>'


def _favicon_symbol(id_, doc):
    """favicon.svg uses a <style>; rebuild it with currentColor + var for the board."""
    vb = re.search(r'viewBox="([^"]+)"', doc).group(1)
    paths = re.findall(r'<path( class="a")? d="([^"]+)"/>', doc)
    ink = "".join(f'<path d="{d}"/>' for cls, d in paths if not cls)
    acc = "".join(f'<path d="{d}"/>' for cls, d in paths if cls)
    return (f'<symbol id="{id_}" viewBox="{vb}"><g fill="currentColor">{ink}</g>'
            f'<g fill="currentColor" style="fill:var(--hv-accent,currentColor)">{acc}</g></symbol>')


def use(id_, h, ratio=1.0, cls="", label=None):
    w = h * ratio
    aria = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    return f'<svg class="lg {cls}" width="{w:.2f}" height="{h}" {aria}><use href="#{id_}"/></svg>'


CSS = """
@font-face{font-family:"Archivo";src:url("_fonts/archivo-var.woff2") format("woff2");font-weight:400 650;font-stretch:100% 125%}
@font-face{font-family:"Geist Mono";src:url("_fonts/geist-mono-var.woff2") format("woff2");font-weight:400 500}
:root{
  --paper:#F4F5F6;--surface:#FCFCFD;--ink:#14171B;--ink2:#434A52;--ink3:#5F6771;--line:#D6DAE0;--accent:#2D4596;
  --d-bg:#0F1215;--d-surface:#161A1E;--d-ink:#E8EBEE;--d-ink3:#8A929B;--d-line:#283038;--d-accent:#A2B3EA;
  --canvas:#0A0C0E;
}
*{box-sizing:border-box}
html{background:var(--canvas)}
body{margin:0;background:var(--canvas);color:#C9CED4;font:400 15px/1.5 "Archivo",system-ui,sans-serif;padding:32px 0 64px}
.wrap{width:1440px;margin:0 auto}
.mono{font-family:"Geist Mono",ui-monospace,Consolas,monospace;font-weight:450;letter-spacing:.01em}
h1,h2,h3,p{margin:0}
.lg{display:block;flex:none;overflow:visible}

/* themes ------------------------------------------------------------ */
.light{background:var(--paper);color:var(--ink);--hv-accent:var(--accent);--muted:var(--ink3);--rule:var(--line)}
.dark{background:var(--d-bg);color:var(--d-ink);--hv-accent:var(--d-accent);--muted:var(--d-ink3);--rule:var(--d-line)}
.mono1{--hv-accent:currentColor}
.on-accent{background:var(--accent);color:var(--surface);--hv-accent:currentColor;--muted:#C5CDE8;--rule:#4B62AC}

/* panel ------------------------------------------------------------- */
.panel{position:relative;padding:36px 40px;min-height:200px;overflow:hidden}
.panel>.tag{position:absolute;left:16px;top:12px;font:450 11px/1 "Geist Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.gridA{display:grid;grid-template-columns:1.25fr 1fr;gap:16px}

/* overview ---------------------------------------------------------- */
#overview{padding:8px 0 56px}
.ov-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px}
.ov-head h1{font:560 44px/1.05 "Archivo",sans-serif;font-stretch:118%;letter-spacing:-.02em;color:#F1F3F5}
.ov-head p{max-width:520px;color:#8E969F;font-size:15px}
.ov-card{display:flex;flex-direction:column}
.ov-card .panel{min-height:0}
.ov-card .sym{display:flex;align-items:center;justify-content:center;height:200px}
.ov-card .row{display:flex;align-items:center;justify-content:center;height:96px;border-top:1px solid var(--rule)}
.ov-meta{display:flex;justify-content:space-between;align-items:baseline;margin:14px 2px 0;color:#8E969F}
.ov-meta b{font:560 15px "Archivo";font-stretch:112%;color:#E4E7EA}

/* concept section --------------------------------------------------- */
.concept{padding:56px 0 8px;border-top:1px solid #20252A;margin-top:24px}
.c-head{display:grid;grid-template-columns:120px 1fr auto;align-items:end;gap:24px;margin-bottom:24px}
.c-head .id{font:560 96px/0.85 "Archivo";font-stretch:125%;letter-spacing:-.04em;color:#F1F3F5}
.c-head h2{font:560 30px/1.1 "Archivo";font-stretch:114%;letter-spacing:-.015em;color:#F1F3F5}
.c-head h2 em{font-style:normal;color:#7E8791;font-weight:450}
.c-head p{margin-top:8px;max-width:760px;color:#9AA2AB}
.chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.chip{font:450 11px/1 "Geist Mono",monospace;letter-spacing:.05em;text-transform:uppercase;padding:7px 9px;border:1px solid #2A3138;color:#8E969F}

.stage{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;min-height:470px}
.ladder{display:flex;align-items:flex-end;justify-content:center;gap:24px;min-height:300px;padding-top:24px}
.ladder figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:14px}
.ladder figcaption{font:450 11px/1 "Geist Mono",monospace;color:var(--muted)}
.hdr{display:flex;align-items:center;justify-content:space-between;gap:28px;height:64px;padding:0 20px;border:1px solid var(--rule);background:transparent}
.hdr nav{display:flex;gap:22px;margin-left:auto;font:450 14.5px "Archivo";color:var(--muted);white-space:nowrap}
.hdr .cta{font:560 14px "Archivo";padding:10px 16px;background:var(--hv-accent);color:var(--bg-cta,#FCFCFD)}
.dark .hdr .cta{color:#0F1215}
.hdrs{display:flex;flex-direction:column;gap:18px;justify-content:center;min-height:210px}
.hdrs .cap{font:450 11px/1 "Geist Mono",monospace;color:var(--muted);margin:0 0 -10px}
.tile{display:flex;align-items:center;justify-content:center;min-height:210px}
.tile .col{display:flex;flex-direction:column;gap:26px;align-items:center}
.apps{display:flex;flex-direction:column;gap:22px;justify-content:center;min-height:210px}

/* browser tab mock -------------------------------------------------- */
.tabbar{display:flex;align-items:flex-end;gap:2px;height:40px;padding:8px 12px 0;border-radius:10px 10px 0 0}
.tabbar.light{background:#DEE1E5}
.tabbar.dark{background:#0A0C0E}
.tab{display:flex;align-items:center;gap:9px;height:32px;width:290px;white-space:nowrap;overflow:hidden;padding:0 12px;border-radius:9px 9px 0 0;font:400 12.5px/1 system-ui,"Segoe UI",sans-serif}
.tabbar.light .tab{background:#F7F8F9;color:#1B1F23}
.tabbar.dark .tab{background:#23272C;color:#E6E9EC}
.tab .x{margin-left:auto;opacity:.55;font-size:14px}
.tab.ghost{opacity:.55;width:150px;background:transparent!important}
.urlbar{display:flex;align-items:center;gap:10px;height:38px;padding:0 14px;font:400 12.5px system-ui,"Segoe UI",sans-serif}
.tabbar.light+.urlbar{background:#F7F8F9;color:#3A4046}
.tabbar.dark+.urlbar{background:#23272C;color:#C4C9CF}
.urlbar .pill{flex:1;height:26px;border-radius:13px;display:flex;align-items:center;padding:0 12px}
.tabbar.light+.urlbar .pill{background:#E9ECEF}
.tabbar.dark+.urlbar .pill{background:#141719}
.browser{border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px rgba(128,138,150,.25)}
.fav{color:var(--ink)}
.tabbar.light{--hv-accent:#2D4596;color:#14171B}
.tabbar.dark{--hv-accent:#A2B3EA;color:#E8EBEE}
.tile-fav{width:96px;height:96px;display:flex;align-items:center;justify-content:center}

.note{margin-top:14px;font:450 12px/1.5 "Geist Mono",monospace;color:#6F7882;display:flex;gap:28px;flex-wrap:wrap}
.note b{color:#A2AAB3;font-weight:450}
"""


def _nav():
    return '<nav aria-hidden="true"><span>Servicios</span><span>Proceso</span><span>Precios</span></nav>'


def build(built, out_dir):
    defs = []
    for cid, b in built.items():
        defs.append(_symbol(f"sym-{cid}", b["sym"]))
        defs.append(_symbol(f"lh-{cid}", b["lh"]))
        defs.append(_symbol(f"ls-{cid}", b["ls"]))
        defs.append(_favicon_symbol(f"fav-{cid}", b["fav"]))

    # ------------------------------------------------------------------ overview
    cards = []
    for cid, spec in CONCEPTS.items():
        b = built[cid]
        r = b["meta"]["ratio"]
        cards.append(f'''
<div class="ov-card">
  <div class="panel light" style="padding:0"><div class="sym">{use(f"sym-{cid}", 132, 1, label=spec["en"])}</div>
    <div class="row">{use(f"lh-{cid}", 34, r)}</div></div>
  <div class="panel dark" style="padding:0;margin-top:8px"><div class="sym" style="height:170px">{use(f"sym-{cid}", 96, 1, label=spec["en"])}</div>
    <div class="row">{use(f"lh-{cid}", 34, r)}</div></div>
  <div class="ov-meta"><b>{cid} · {spec["name"]}</b><span class="mono">{spec["en"]}</span></div>
</div>''')
    overview = f'''
<section id="overview">
  <div class="ov-head">
    <h1>Home View 3D<br>logo concepts</h1>
    <p>Four directions for one idea: a 2D plan becomes a 3D model you can view on the web and in AR.
       Vector, one colour or two (ink + añil), light and dark, alive at 16 px.</p>
  </div>
  <div class="grid4">{"".join(cards)}</div>
</section>'''

    # ------------------------------------------------------------------ concept sections
    sections = []
    for cid, spec in CONCEPTS.items():
        b = built[cid]
        r = b["meta"]["ratio"]
        rs = b["metas"]["width"] / b["metas"]["height"]
        sym_ratio = 1.0

        def ladder(theme, mono=False):
            figs = "".join(
                f'<figure>{use(f"sym-{cid}", s, 1)}<figcaption>{s}</figcaption></figure>' for s in SIZES)
            return f'<div class="panel {theme}{" mono1" if mono else ""}"><span class="tag">symbol · 16 → 256 px</span><div class="ladder">{figs}</div></div>'

        def stage(theme):
            return f'''<div class="panel {theme}"><span class="tag">lockups · two colours</span>
  <div class="stage">{use(f"lh-{cid}", 96, r, label="Home View 3D")}{use(f"ls-{cid}", 210, rs)}</div></div>'''

        def hdrs(theme):
            return f'''<div class="panel {theme}"><span class="tag">header slot · 32 px (≥ 1024) and 28 px</span>
  <div class="hdrs"><div class="hdr">{use(f"lh-{cid}", 32, r)}{_nav()}<span class="cta">Pide tu demo</span></div>
  <div class="hdr" style="height:56px">{use(f"lh-{cid}", 28, r)}{_nav()}<span class="cta" style="font-size:13px;padding:8px 14px">Pide tu demo</span></div></div></div>'''

        def mono_tiles():
            def tile(cls, label, extra=""):
                return f'''<div class="panel {cls} mono1 tile" style="{extra}"><span class="tag">{label}</span>
  <div class="col">{use(f"lh-{cid}", 44, r)}{use(f"sym-{cid}", 84, 1)}</div></div>'''

            t1 = tile("light", "1 colour · ink on paper")
            t2 = tile("dark", "1 colour · paper on ink")
            t3 = f'''<div class="panel on-accent tile"><span class="tag">1 colour · on añil</span>
  <div class="col">{use(f"lh-{cid}", 44, r)}{use(f"sym-{cid}", 84, 1)}</div></div>'''
            t4 = f'''<div class="panel light tile" style="--hv-accent:var(--accent);color:var(--accent)"><span class="tag">1 colour · añil on paper</span>
  <div class="col mono1">{use(f"lh-{cid}", 44, r)}{use(f"sym-{cid}", 84, 1)}</div></div>'''
            return f'<div class="grid4">{t1}{t2}{t3}{t4}</div>'

        def tabs(theme):
            return f'''<div class="panel {theme}" style="padding:36px 40px 32px"><span class="tag">browser tab · 16 px favicon</span>
  <div class="apps"><div class="browser"><div class="tabbar {theme}"><div class="tab"><svg class="lg" width="16" height="16" aria-hidden="true"><use href="#fav-{cid}"/></svg><span>Home View 3D · Modelos 3D desde planos</span><span class="x">×</span></div><div class="tab ghost"><span>Nueva pestaña</span></div></div>
  <div class="urlbar"><span>‹ ›</span><div class="pill">homeview3d.com</div></div></div>
  <div style="display:flex;gap:28px;align-items:center;color:inherit">
    <div class="tile-fav" style="background:var(--accent);color:#FCFCFD;--hv-accent:currentColor"><svg class="lg" width="64" height="64" aria-hidden="true"><use href="#fav-{cid}"/></svg></div>
    <div class="tile-fav" style="width:48px;height:48px;background:var(--accent);color:#FCFCFD;--hv-accent:currentColor"><svg class="lg" width="32" height="32" aria-hidden="true"><use href="#fav-{cid}"/></svg></div>
    <span class="mono" style="font-size:11px;color:var(--muted);line-height:1.6">favicon tile<br>añil square · 1 colour</span>
  </div></div></div>'''

        mt = b["meta"]
        section = f'''
<section class="concept" id="concept-{cid}">
  <div class="c-head">
    <div class="id" aria-hidden="true">{cid}</div>
    <div><h2>{spec["name"]} <em>· {spec["en"]}</em></h2><p>{spec["idea"]}</p></div>
    <div class="chips"><span class="chip">horizontal {mt["ratio"]:.2f}:1</span><span class="chip">fits 180 px slot @ 32 px: {"yes" if mt["ratio"]*32 <= 180.5 else "no"}</span><span class="chip">outlined Archivo</span></div>
  </div>
  <div class="grid2">{stage("light")}{stage("dark")}</div>
  <div class="grid2" style="margin-top:16px">{ladder("light")}{ladder("dark")}</div>
  <div class="grid2" style="margin-top:16px">{hdrs("light")}{hdrs("dark")}</div>
  <div style="margin-top:16px">{mono_tiles()}</div>
  <div class="grid2" style="margin-top:16px">{tabs("light")}{tabs("dark")}</div>
</section>'''
        sections.append(section)

    html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1480">
<title>Home View 3D logo concepts</title><style>{CSS}</style></head>
<body><svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{"".join(defs)}</defs></svg>
<main class="wrap">{overview}{"".join(sections)}</main></body></html>'''
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "board.html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    fdir = os.path.join(out_dir, "_fonts")
    os.makedirs(fdir, exist_ok=True)
    for fn in ("archivo-var.woff2", "geist-mono-var.woff2"):
        shutil.copyfile(os.path.join(FONTS, fn), os.path.join(fdir, fn))
