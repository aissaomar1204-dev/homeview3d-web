# Home View 3D: logo concepts

Four genuinely different directions for one idea: **a 2D plan becomes a 3D model you can view on the web and in AR.**
Brand values used as the brief: architectural precision, real geometry (not AI guesswork), calm confidence, Mediterranean light.
Audience: real-estate agencies and developers (B2B, trust).

Presentation: `board.html` (serve with `node build/serve.mjs 8871 docs`, open `/brand/concepts/board.html`).
Screenshots: `board-overview.png`, `board-A.png`, `board-B.png`, `board-C.png`, `board-D.png`.
Rejected directions: `explorations/round-01.png` to `round-10.png` (about 70 sketches, see the last section).

## Shared system (what makes the four feel like one studio)

| Rule | Value |
|---|---|
| Grid | symbols drawn on a 64 x 64 grid, fill-only paths, no strokes, no gradients, no raster, no `<text>` |
| Joints | facets never touch: every internal joint is a clean 2.6-unit gap (a "cut line"), only mitre corners, no rounded corners (Plano is a drawing language) |
| Colour roles | **ink** carries the volume, **añil** marks the plan / the view / the frame |
| Colour tech | ink = `currentColor`; añil = `var(--hv-accent, currentColor)`. Set nothing and the mark is **one colour**; set `--hv-accent` and it is **two colours** |
| Light / dark | ink `#14171B` + añil `#2D4596` on Papel `#F4F5F6`; ink `#E8EBEE` + añil `#A2B3EA` on `#0F1215` (the site tokens, so BRAND-05 holds: an accent change touches only `tokens.css`) |
| Wordmark | "Home View 3D" in **Archivo** (the site font), instanced with `fontTools.varLib.instancer` (wdth 108-118, wght 580-620), kerning from the font's own GPOS, converted to **outlined paths**, "3D" in the accent. No dependency on font loading |
| Lockups | wordmark cap height = 36.5 % of the symbol's tight height; symbol to wordmark gap = 0.30 x symbol height; cap block centred on the symbol. Clear space around any lockup = one wordmark cap height |
| Header slot (BRAND-03) | all four horizontal lockups are 5.18:1 to 5.44:1, so at 32 px tall they are 166 to 174 px wide (slot `max-width: 180px`) and at 28 px tall 145 to 152 px. Drops in with zero CLS |
| Minimum sizes | symbol 16 px (use `favicon.svg`, the tightly cropped version), horizontal lockup 24 px tall, stacked lockup 72 px tall |

Files per concept (`A/`, `B/`, `C/`, `D/`):
`symbol.svg` (64 x 64), `lockup-horizontal.svg`, `lockup-stacked.svg`, `favicon.svg` (tight crop, hard colours with `prefers-color-scheme` dark variant).
Each paint group carries `fill="currentColor"` plus `style="fill:var(--hv-accent,currentColor)"`, so viewers without CSS variables (Illustrator, Inkscape) fall back to one colour.

Site integration when a concept is chosen: inline the SVG in the header slot, set `--hv-accent: var(--color-accent)` on the logo element, use `favicon.svg` as the icon (`<link rel="icon" type="image/svg+xml">`) and render the 32/192/512 px PNGs and the apple-touch icon (añil tile, paper one-colour symbol, as shown on the board) from the same paths.

Rebuild everything: `python docs/brand/tools/build.py` (needs `fonttools brotli shapely`).

---

## A. Habitación (Room): plan to volume

- **Idea.** A cube read from the inside. The floor plan (an añil rhombus) lies flat; two walls rise from its back edges; one wall is opened by a door. It is the exact deliverable of the studio: the room you can walk into, born from a flat plan.
- **Construction.** True isometric (30 deg), cube edge 28.5. Three facets separated by 2.6 gaps: floor (accent), left wall, right wall with the door notch cut through its base. The same hexagon can be read as an outside cube or an inside corner, which is the "view" idea.
- **Wordmark.** Archivo wdth 113, wght 600.
- **16 px.** The añil floor is a clear anchor and the door notch survives as a nick. Reads as a small open cube with a blue base.
- **Strengths.** Says home, plan, 3D and AR-viewable in one glyph; fits the Plano isometric renders; strongest at every size; no lettering, so no redundancy with the wordmark.
- **Risks.** Isometric cubes are a crowded category. The door notch and the añil floor are what keep it ownable, so never drop them from a one-colour version (they survive: the notch is a cut, the floor is separated by a joint).

## B. H plano (H plan): the initial as a plan

- **Idea.** The initial "H" drawn as an architectural plan. Two structural walls, a thinner partition between them, and below it the swing of a door: an añil quarter disc. The same quarter disc is a camera's view cone, so the plan symbol doubles as "view".
- **Construction.** 46 x 54 on the grid, legs 9.5, partition 5.5 (thin partition vs thick walls, as in real plans), crossbar above centre (optical). The quarter disc is hinged one joint away from the leg and one joint below the partition, so the gap system stays intact.
- **Wordmark.** Archivo wdth 118, wght 580 (wider, "title block" lettering).
- **16 px.** A bold H with a blue notch: clean and immediate, the best pure favicon shape of the set after D.
- **Strengths.** Compact and flexible (monogram, app icon, stamp, avatar). The door swing makes it read as a room layout to anyone who has seen a plan. Lightest on the page, calmest.
- **Risks.** A lettermark next to a wordmark that starts with H reads "H Home View 3D" (redundant). Many H marks exist (H alone is also a hospital or helipad sign, which is why the H-in-a-square variant was rejected). The plan story is legible to architects, subtle for everyone else. Best used as a standalone monogram plus a text-only header lockup.

## C. Visor (Viewfinder): AR frame on a house

- **Idea.** AR viewfinder brackets (añil) frame a crisp isometric house (ink): the moment a plan becomes something you can look at, in the browser or through a phone.
- **Construction.** Corner brackets 13 long x 4.8 thick at 3 units from the edge; house in true isometric (k 22): long wall, gable end and roof plane separated by 2.6 joints; the gable ridge runs along the long wall, so the roof reads as a single clean plane.
- **Wordmark.** Archivo wdth 108, wght 620 (slightly condensed and heavier to hold its own next to the airy frame).
- **16 px.** The frame reads instantly; the house shrinks to a small solid. The weakest of the four at 16 px (frame noise). `favicon.svg` is cropped tight to help.
- **Strengths.** The most literal, and therefore the clearest, statement of "3D + AR + home". Two-colour split (frame vs object) is easy to understand.
- **Risks.** Viewfinder brackets and a gabled house are both familiar devices, so it is the least ownable. The house is generic; the ownable part is the disciplined joint system.

## D. Arco (Doorway): the añil door

- **Idea.** A thick-walled Mediterranean arch in one-point perspective: the reveal (ink), the floor running in, and the view beyond in añil. Home is a door; view is what you see through it; 3D is the depth. The añil is the blue of Andalusian lime-washed plinths and doors, the accent of the whole site.
- **Construction.** Outer arch 48 wide (semicircle radius 24), far arch scaled 0.56 about a vanishing point at (41, 41); the reveal is one exact-arc path, the floor a trapezoid on the perspective lines, the view an exact arch inset by one joint. Arcs are true SVG arcs, not polylines.
- **Wordmark.** Archivo wdth 114, wght 610.
- **16 px.** Excellent: a door in a wall with a blue view. The silhouette alone (arch) is already distinctive.
- **Strengths.** The most emotional and the most local: it could only be a Costa del Sol studio. Curved silhouette contrasts with the angular marks of most proptech. Calm, confident, best 16 px shape.
- **Risks.** Arches are common in architecture branding, and the 3D message is carried by perspective only (no explicit plan or AR cue). It reads "door / doorway" before "3D".

---

## Ranking

1. **A. Habitación.** It is the only one that says *plan, home, 3D and enterable* in a single glyph, it is drawn in the same isometric language as the renders and the site, it stays strong from 16 to 256 px, and it has no lettering to duplicate the wordmark. Risk is category crowding, mitigated by the door and the añil floor.
2. **D. Arco.** Most ownable and most emotional (the añil door ties directly to the site's accent story and to the location), and the best small-size silhouette. It ranks second only because the 3D / plan message is less explicit than A.
3. **B. H plano.** Elegant, compact, brilliant as a monogram and favicon, and the door swing is a smart double meaning. Held back by the "H + Home" redundancy and by an H being an easy shape to confuse.
4. **C. Visor.** The clearest AR message, but the most generic devices and the weakest 16 px.

Recommendation: **A as the primary lockup**; if a compact monogram is needed later, B's H (or D's arch) can be added as a secondary mark.

## Explorations (kept for the record)

`explorations/round-01.png` to `round-10.png`, roughly 70 sketches. Dropped and why:
- Cube with hollow top, L-shaped extrusions, exploded floor (A family): fragmented, read as "layers" or gift boxes.
- Iso-extruded H and H with oblique depth (B): messy at small sizes, retro 3D text.
- H inside a square (round 10): reads as a hospital sign.
- H with stairs crossbar: distinctive but reads as a ladder; H with arched counter: strong shape but reads as a chess rook / castle and loses the plan story.
- Sliced house / sliced arch (D): looks like blinds or a beehive; arch with a cut-plane bar reads as the letter A.
- House from dimension lines and ticks (D): the idea fits the site's language but thin lines fail at 16 px.
- Nested arch tunnels and perspective arch with accent floor (D): heavier and less clear than the chosen doorway.
