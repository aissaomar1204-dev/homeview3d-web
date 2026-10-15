# CLAUDE.md · homeview3d-web

Contexto para quien trabaje en este repo (personas y Claude). Léelo entero antes de tocar nada.

## Qué es este repo

La web publicada de **Home View 3D** (AS TRINITY, S.L., Mijas): showroom virtual y 3D para promotoras de obra nueva.
Sitio estático generado con Node (sin frameworks), desplegado en **Netlify** desde `main`. Idiomas: ES (raíz), EN (`/en/`),
DE reducido (`/de/`). Incluye todo el SEO/GEO: sitemaps, `llms.txt`, espejos Markdown, JSON-LD, IndexNow.

Detalle completo: `README.md` (build, Netlify, lanzamiento), `docs/build/BUILD-SPEC.md`, `docs/build/CONTENT-SCHEMA.md`.

## Mapa de repos (cadena de trabajo)

```
homeview3d-taller  ──▶  homeview3d-entregas  ──▶  homeview3d-web (este)
trabajo en sucio        ordena y valida            solo lo publicable
```

- **`homeview3d-taller`**: modelado 3D, renders, 360, borradores y QA. Una rama `promo/<slug>` por promoción.
- **`homeview3d-entregas`**: recibe el producto final del taller, lo valida y lo deja listo.
- **`homeview3d-web`**: aquí solo entra una promoción **ya validada en entregas**, y cambios de web/SEO.

## Reglas de este repo

1. **Solo existe `main`** y es lo que publica Netlify. Cada push a `main` despliega. Para cambios grandes, usa una rama
   corta y pasa por Pull Request (Netlify genera un deploy preview).
2. **Nada de trabajo en sucio aquí:** ni `.blend`, ni renders máster, ni capturas de QA, ni exploraciones de diseño.
   Eso va al taller. (`docs/qa` y `docs/design` se movieron a `homeview3d-taller`, rama `archivo/web-docs-2026-10`;
   algunos enlaces del `README.md` a `docs/qa/...` apuntan ahí.)
3. **Promociones nuevas:** no se trabajan aquí. Llegan desde `homeview3d-entregas` con `promocion.json` validado.
4. Mantén el repo ligero: imágenes ya optimizadas (avif/webp), modelos `.glb` optimizados, sin masters.

## Comandos

```bash
npm ci                 # instalar (Node >= 20; Netlify usa Node 24)
npm run build          # genera dist/
npm run check          # QA del build: 0 errores es obligatorio
npm run qa             # build + check
npm run preview        # build y servidor local
```

Antes de hacer push: `npm run qa` debe terminar con **0 errors**. Los avisos de «orphans» y de datos registrales
pendientes (`legal.pending`) son esperados.

## Cosas que rompen el build o el SEO si se tocan mal

- `docs/design/tokens.css` debe ser **idéntico** a `src/css/00-tokens.css` (lo comprueba `npm run check`). Si cambias uno,
  cambia el otro.
- Cabeceras y redirecciones las **genera el build** (`dist/_headers`, `dist/_redirects`). No añadas `[[headers]]` ni
  `[[redirects]]` a `netlify.toml`.
- La portada en castellano (`build/home/portada.html`, `estilos.css`, `main.js`) **no se modifica**; la inglesa y la
  alemana se derivan de ella. Ver README, «Portadas».
- Solo tema claro. Sin precios en la web (decisión: presupuesto cerrado por encargo).
- Presupuestos de rendimiento (JS inicial ≤ 32 KB, HTML, CSS, fuentes) los vigila `npm run check`.
- Textos en alemán: pendientes de revisión por una persona nativa.
- Datos de empresa, contacto y legales: `build/data/site.mjs`. Contenido de páginas: `build/content/`.

## Cómo trabajar

- Ramas cortas: `feat/...`, `fix/...`, `seo/...`; PR a `main`; borrar la rama al fusionar.
- Commits en español, claros y en presente («Añade...», «Corrige...»).
- No subas secretos, tokens ni claves. Nada de credenciales en el repo.
- Si dudas si algo es «trabajo en sucio» o «producto final», va al taller.
