"""
verify_svgs.py - checks the deco assets against the brief and prints a size table.

  python verify_svgs.py

Rules: well-formed XML, viewBox set, <= 80 KB, no raster (<image>), stroke only (root fill="none",
stroke="currentColor"); fills allowed only inside the groups listed in FILL_OK; no colours other than
currentColor; paper-grain.png <= 6 KB.
"""
import gzip
import os
import re
import sys
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "public", "assets", "deco"))
FILL_OK = {"poche"}
NS = "{http://www.w3.org/2000/svg}"
bad = 0


def fail(msg):
    global bad
    bad += 1
    print("  FAIL", msg)


rows = []
for f in sorted(os.listdir(OUT)):
    p = os.path.join(OUT, f)
    n = os.path.getsize(p)
    if f.endswith(".png"):
        rows.append((f, n, len(gzip.compress(open(p, "rb").read())), "-", "-", "-"))
        if n > 6 * 1024:
            fail("%s is %d bytes (> 6 KB)" % (f, n))
        continue
    if not f.endswith(".svg"):
        continue
    raw = open(p, "rb").read()
    try:
        root = ET.fromstring(raw)
    except ET.ParseError as e:
        fail("%s not well-formed: %s" % (f, e))
        continue
    vb = root.get("viewBox")
    if not vb:
        fail("%s has no viewBox" % f)
    if n > 80 * 1024:
        fail("%s is %d bytes (> 80 KB)" % (f, n))
    if root.get("stroke") != "currentColor":
        fail("%s root stroke is not currentColor" % f)
    if root.get("fill") != "none":
        fail("%s root fill is not none" % f)
    groups = []
    for el in root.iter():
        tag = el.tag.replace(NS, "")
        if tag == "image":
            fail("%s contains <image> (raster)" % f)
        for a in ("fill", "stroke"):
            v = el.get(a)
            if v is not None and v not in ("none", "currentColor"):
                fail("%s <%s %s=%s> is not currentColor" % (f, tag, a, v))
        if el.get("fill") == "currentColor" and el.get("id") not in FILL_OK and el is not root:
            fail("%s fill outside the allowed groups: #%s" % (f, el.get("id")))
        if tag == "g":
            groups.append(el.get("id"))
    text = raw.decode()
    if re.search(r"(?<![\w.])\d+\.\d{3,}", text):
        fail("%s has coordinates with more than 2 decimals" % f)
    paths = sum(1 for el in root.iter() if el.tag.replace(NS, "") == "path")
    rows.append((f, n, len(gzip.compress(raw)), vb, ",".join(g for g in groups if g), paths))

print("%-26s %8s %8s  %-18s %s" % ("file", "bytes", "gzip", "viewBox", "groups"))
for r in rows:
    print("%-26s %8d %8d  %-18s %s" % (r[0], r[1], r[2], r[3], r[4]))
print("OK" if not bad else "%d problem(s)" % bad)
sys.exit(1 if bad else 0)
