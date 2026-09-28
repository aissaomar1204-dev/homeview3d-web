# Polish backlog (collected by the orchestrator while reviewing QA screenshots)

## Visual / design
1. Home hero: the render floats small inside a flat grey stage box that reads as a placeholder. Make the maqueta larger and give the hero the "Plano" signature: real dimension lines (cotas) around the model with the real footprint (≈ 9,1 m × 14,1 m) drawn with hairlines in Geist Mono, north arrow / scale bar, the caption as a drawing label. Must stay static on load (no hero animation) and keep LCP.
2. Compare slider: seam between the white line plan and the grey `_opaco` top-down render. Use the RGBA `villa_planta_cenital` over a white sheet (or re-export the plan on the stage grey). Handle is small: bigger grab target (≥ 44 px), visible label chip.
3. Compare section layout: long empty left column next to the tall portrait slider. Make the text column sticky, or add a room legend with m² / dimension annotations to fill it with real data.
4. Overall "wow": the site is correct but austere. Add signature moments within the rulebook (dimension-line draw on the cajetín, despiece on scroll, a real-time viewer band that feels like a drafting table), and check rhythm between sections (too many similar grey bands).
5. Case page: add the Cycles turntable video (build/generated/videos.json) as click-to-play with caption "Render 3D" (IMG-10, MOTION-08).
6. Mobile viewer: poster ↔ live model jump on the 4:5 stage (poster captured at 16:11).

## Budgets / technical
7. CSS 51.7 KB > 40 KB: emit 50-viewer.css as a separate stylesheet linked only on pages with a viewer; trim 40-blocks (16.7 KB), 20-layout, 30-components.
8. Home HTML 61 KB > 60 KB.
9. Favicons not linked in <head> (favicon.svg, favicon.ico, apple-touch-icon.png) and webmanifest icons.
10. `_opaco` images are now on the stage grey (#E4E7EA); og_image re-rendered on grey.
