/* ═══════════════════════════════════════════════════════════════
   viewer.js · 3D viewer + AR handoff (BUILD-SPEC §8). Owner: VIEWER.
   ES module, no dependencies. Loaded only on pages with a viewer, ar,
   formats or embedCode block. Markup: build/lib/viewer.mjs.
   - model-viewer (hashed URL in data-mv) is imported on intent:
     pointer/focus/touch on the viewer, or (desktop only: fine pointer,
     ≥ 1024 px, 4G, no Save-Data, ≥ 4 GB) visible + idle after the first
     scroll or pointer move (P1-A). The GLB is requested only on
     "Ver la villa en 3D" (loading=lazy + reveal=manual).
   - No model-viewer AR: our chooser opens Quick Look / Scene Viewer
     links, so WebXR is never probed (keeps the back/forward cache).
   - On load: cut at 1.15 m (materials ending in _Alto → alpha MASK,
     base colour alpha 0), hotspots, controls. Fallback GLB on loadfailure.
   - Reduced motion: camera jumps, tour steps every 6 s, nothing autoplays.
   - "Medidas" (S3, V-03): real dimension lines on the model (footprint, wall
     or cut height) in src/js/viewer-dims.js, imported on the first press
     (data-dims-js), so the initial JS stays within budget.
   ═══════════════════════════════════════════════════════════════ */
const doc = document;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let reduce = motion.matches;
if (motion.addEventListener) motion.addEventListener('change', (e) => { reduce = e.matches; });

const UA = navigator.userAgent;
const QUICK_LOOK = (() => { try { return doc.createElement('a').relList.supports('ar'); } catch { return false; } })();
const PLATFORM = QUICK_LOOK || /iP(hone|ad|od)/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ? 'ios' : /android/i.test(UA) ? 'android' : 'desktop';
const IN_APP = /FBAN|FBAV|Instagram|LinkedInApp|Line\/|WhatsApp|GSA\//.test(UA);
const slowNet = () => { const c = navigator.connection; return !!(c && (c.saveData || /2g|3g/.test(c.effectiveType || ''))); };
/** Warm the library on visibility only where it cannot hurt: desktop class device on a fast link (P1-A). */
const capable = () => matchMedia('(pointer: fine) and (min-width: 1024px)').matches && !slowNet()
  && (!navigator.connection || navigator.connection.effectiveType === '4g') && (navigator.deviceMemory || 8) >= 4;
/** Resolves on the first scroll or pointer move: nothing is fetched for visitors who only read the first screen. */
const engaged = new Promise((ok) => { for (const ev of ['scroll', 'pointermove', 'keydown']) addEventListener(ev, ok, { once: true, passive: true }); });
const idle = (fn) => (self.requestIdleCallback ? self.requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 1500));
const afterLoad = (fn) => (doc.readyState === 'complete' ? fn() : addEventListener('load', fn, { once: true }));
const toContact = (url) => { if (url) location.href = url; };

function hasWebgl() {
  try {
    const gl = doc.createElement('canvas').getContext('webgl2') || doc.createElement('canvas').getContext('webgl');
    if (gl) { const x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }
    return !!gl;
  } catch { return false; }
}

/* AR choices of /ar/villa/ (build-time QR + links), fetched once per page for the viewer dialogs. */
const arCache = new Map();
function arChoices(url) {
  if (!arCache.has(url)) {
    arCache.set(url, fetch(url, { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then((html) => {
        const page = new DOMParser().parseFromString(html, 'text/html');
        const el = page.querySelector('[data-vw-arblock]');
        if (!el) throw new Error('no AR block');
        // The choices are styled by the AR module stylesheet (51-ar.css, data-css on the block): add it once, wait for it.
        // Pages whose CSS bundle already holds it (a .vw-ar on the page) skip the request.
        const css = el.dataset.css;
        if (!css || doc.querySelector(`link[href="${css}"]`) || doc.querySelector('.vw-ar, .vw-embedcode, .vw-arpage')) return el;
        const link = Object.assign(doc.createElement('link'), { rel: 'stylesheet', href: css });
        return new Promise((ok) => { link.onload = link.onerror = () => ok(el); doc.head.append(link); });
      })
      .catch((e) => { arCache.delete(url); throw e; }));
  }
  return arCache.get(url);
}

/* Styles of the live viewer (toolbar, hotspots, loading line), fetched with the library, never render-blocking. */
let live = null;
function loadLive(href) {
  if (!href || doc.querySelector(`link[href="${href}"]`)) return live || Promise.resolve();
  live = new Promise((ok) => { const l = Object.assign(doc.createElement('link'), { rel: 'stylesheet', href }); l.onload = l.onerror = ok; doc.head.append(l); });
  return live;
}

/* One model-viewer import per page, shared by every viewer on it. */
let lib = null;
function loadLib(url, decoder, bust) {
  const cfg = (self.ModelViewerElement = self.ModelViewerElement || {});
  if (decoder && !cfg.meshoptDecoderLocation) cfg.meshoptDecoderLocation = decoder;
  const Defined = customElements.get('model-viewer');
  if (Defined) {
    if (decoder && !Defined.meshoptDecoderLocation) Defined.meshoptDecoderLocation = decoder;
    return Promise.resolve();
  }
  if (!lib) {
    lib = import(bust ? `${url}?retry=${bust}` : url)
      .then(() => customElements.whenDefined('model-viewer'))
      .catch((e) => { lib = null; throw e; });
  }
  return lib;
}

function initViewer(root) {
  const q = (sel) => root.querySelector(sel);
  const qa = (sel) => [...root.querySelectorAll(sel)];
  const mv = q('model-viewer');
  if (!mv) return;
  const ds = root.dataset;
  const T = JSON.parse(ds.i18n || '{}');
  const startBtn = q('[data-vw-start]');
  const live = q('[data-vw-live]');
  const pctEl = q('[data-vw-pct]');
  const bar = q('[data-vw-bar]');
  const note = q('[data-vw-note]');
  T.note = note ? note.textContent : '';
  T.error = (q('[data-vw-error] strong') || {}).textContent || '';
  const tourBtn = q('[data-vw-tour]');
  const light = q('[data-vw-light]');
  const stage = q('[data-vw-stage]');
  const rooms = qa('[data-room]');
  // Camera data and notes for every room, one attribute on the app: [x, y, span, text] by rail order.
  const roomData = JSON.parse(ds.rooms || '[]');
  const rd = (b) => roomData[rooms.indexOf(b)] || [0, 0, 4, ''];
  for (const b of rooms) b.setAttribute('aria-pressed', 'false');
  const src = mv.getAttribute('src');
  const [labelCut, labelFull] = (ds.labelY || '1.35 2.85').split(' ').map(Number);
  const exposure0 = Number(ds.exposure) || 1;

  let state = 'poster';
  let pending = null;
  let bound = false;
  let libFailed = false;
  let tries = 0;
  let triedFallback = false;
  let cutOn = true;
  let cutMats = [];
  let orig = new Map();
  let hotspots = false;
  let tourTimer = 0;
  let tourIdx = 0;
  let homeR = 0;

  const setState = (s) => { state = s; root.dataset.state = s; };
  const say = (msg) => { if (live) live.textContent = msg || ''; };
  const pct = (p) => {
    if (pctEl) pctEl.textContent = p == null ? '' : T.pct.replace('{n}', Math.round(p * 100));
    if (bar) bar.style.transform = `scaleX(${p || 0})`;
  };
  const jump = () => { if (reduce && mv.jumpCameraToGoal) mv.jumpCameraToGoal(); };
  const labelPos = (b) => `${rd(b)[0]}m ${cutOn ? labelCut : labelFull}m ${-rd(b)[1]}m`;

  /* ── Intent: fetch the ~230 KB (brotli) library before the click ── */
  const warm = () => { loadLive(ds.live); if (!libFailed) loadLib(ds.mv, ds.meshopt).catch(() => {}); };
  for (const ev of ['pointerenter', 'focusin', 'touchstart']) root.addEventListener(ev, warm, { once: true, passive: true });
  if ('IntersectionObserver' in self) {
    let warmed = false;
    const auto = ds.preload === 'visible' && capable();
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) { pauseTour(); return; }
      if (!warmed && auto) { warmed = true; afterLoad(() => idle(warm)); }
    }, { rootMargin: '200px' });
    // Touch devices rely on the intent listeners above; desktops arm the observer after the first interaction.
    if (auto) engaged.then(() => io.observe(stage)); else io.observe(stage);
  }

  /* ── Load ── */
  async function start() {
    if (state === 'loading' || state === 'ready' || state === 'nowebgl') return;
    if (!hasWebgl()) { setState('nowebgl'); pending = null; say(T.noWebgl); return; }
    setState('loading');
    startBtn.setAttribute('aria-busy', 'true');
    say(T.preparing);
    pct(0);
    try {
      await Promise.all([loadLib(ds.mv, ds.meshopt, libFailed ? tries : 0), loadLive(ds.live)]);
    } catch {
      libFailed = true;
      fail();
      return;
    }
    const reload = bound && tries > 0;
    libFailed = false;
    bind();
    say(T.loading);
    if (reload) { triedFallback = false; mv.src = `${src}${src.includes('?') ? '&' : '?'}retry=${tries}`; }
    mv.dismissPoster();
  }

  function bind() {
    if (bound) return;
    bound = true;
    mv.addEventListener('progress', (e) => { if (state === 'loading') pct(e.detail.totalProgress); });
    mv.addEventListener('load', onLoad);
    mv.addEventListener('error', onError);
    mv.addEventListener('camera-change', (e) => {
      if (e.detail && e.detail.source === 'user-interaction') { pauseTour(); pressView(null); if (dims) dims.moved(); }
    });
    mv.addEventListener('pointerdown', pauseTour, { passive: true });
    mv.addEventListener('wheel', pauseTour, { passive: true });
  }

  function onLoad() {
    const mats = mv.model ? mv.model.materials : [];
    const suffix = ds.cutSuffix || '_Alto';
    // Names repeat (e.g. Madera_Clara): always filter the list, never getMaterialByName().
    cutMats = mats.filter((m) => m.name.endsWith(suffix));
    orig = new Map(cutMats.map((m) => [m, {
      mode: m.getAlphaMode(), cutoff: m.getAlphaCutoff(), color: [...m.pbrMetallicRoughness.baseColorFactor],
    }]));
    setCut(cutOn); // same state as the poster, applied before the first visible frame
    addHotspots();
    homeR = mv.getCameraOrbit().radius; // the overview's % radius in metres (Medidas framing)
    const refocus = doc.activeElement === startBtn;
    setState('ready');
    startBtn.removeAttribute('aria-busy');
    pct(null);
    say(T.loaded);
    if (light) mv.exposure = Number(light.value);
    if (refocus) { const first = q('[data-vw-view]'); if (first) first.focus({ preventScroll: true }); }
    if (pending) { const fn = pending; pending = null; fn(); }
  }

  function onError(e) {
    const type = e.detail && e.detail.type;
    if (type === 'loadfailure' && !triedFallback && ds.fallback) {
      triedFallback = true; // plain glTF + JPEG, needs no decoder
      mv.src = ds.fallback;
      return;
    }
    fail();
  }

  function fail() {
    setState('error');
    stopTour();
    pending = null;
    startBtn.removeAttribute('aria-busy');
    pct(null);
    say(T.error);
  }

  function retry() {
    tries++;
    setState('poster');
    start();
  }

  /** Run fn now if the model is ready, otherwise load first (rooms and tour double as intent). */
  function run(fn) {
    if (state === 'ready') fn();
    else { pending = fn; start(); }
  }

  /* ── Maqueta 1,15 m ↔ Muros completos 2,60 m ── */
  function setCut(on) {
    cutOn = on;
    for (const m of cutMats) {
      const o = orig.get(m);
      const pbr = m.pbrMetallicRoughness;
      if (on) {
        m.setAlphaMode('MASK');
        m.setAlphaCutoff(0.5);
        pbr.setBaseColorFactor([o.color[0], o.color[1], o.color[2], 0]);
      } else {
        m.setAlphaMode(o.mode);
        m.setAlphaCutoff(o.cutoff);
        pbr.setBaseColorFactor(o.color);
      }
    }
    for (const b of qa('[data-vw-cut]')) b.setAttribute('aria-pressed', String((b.dataset.vwCut === '1') === on));
    if (hotspots) for (const b of rooms) mv.updateHotspot({ name: `hotspot-${b.dataset.room}`, position: labelPos(b) });
    if (dims) dims.cut();
  }

  /* ── Medidas (S3, V-03): dimension lines on the live model, in src/js/viewer-dims.js (imported on first use) ── */
  let dims = null;
  let dimsLoading = null;
  function toggleDims() {
    if (dims) { dims.toggle(); return; }
    if (!ds.dimsJs) return;
    dimsLoading ||= import(ds.dimsJs).then((m) => {
      dims = m.createDims({ mv, root, stage, ds, buttons: qa('[data-vw-dims]'), jump, cutOn: () => cutOn, homeR: () => homeR });
    });
    dimsLoading.then(() => dims.toggle(), () => { dimsLoading = null; });
  }

  /* ── Hotspots: created only after load (labels are data, not decoration) ── */
  function addHotspots() {
    if (hotspots) return;
    hotspots = true;
    rooms.forEach((b, i) => {
      const h = doc.createElement('button');
      h.type = 'button';
      h.className = 'vw-hs';
      h.slot = `hotspot-${b.dataset.room}`;
      h.tabIndex = -1; // the room list is the keyboard path; hotspots are a pointer shortcut
      h.setAttribute('aria-hidden', 'true');
      h.dataset.hs = b.dataset.room;
      h.dataset.position = labelPos(b);
      h.dataset.normal = '0m 1m 0m';
      h.dataset.visibilityAttribute = 'visible'; // model-viewer toggles data-visible when the label faces the camera
      const n = doc.createElement('span');
      n.className = 'vw-hs__n';
      n.textContent = String(i + 1);
      const t = doc.createElement('span');
      t.className = 'vw-hs__name';
      t.textContent = b.querySelector('.vw-room__name').textContent;
      h.append(n, t);
      h.addEventListener('click', () => { pauseTour(); focusRoom(b); });
      mv.append(h);
    });
  }

  /* ── Camera ── */
  function pressView(v) {
    for (const b of qa('[data-vw-view]')) b.setAttribute('aria-pressed', String(b.dataset.vwView === v));
  }

  function clearRoom() {
    for (const r of rooms) r.setAttribute('aria-pressed', 'false');
    for (const h of mv.querySelectorAll('.vw-hs')) h.classList.remove('is-on');
    note.textContent = T.note;
  }

  /** Plan view radius that fits the whole footprint in the current stage (portrait phones, 16:11 desktop). */
  function topOrbit() {
    const [theta, phi, r0] = (ds.topOrbit || '0deg 0deg 26m').split(' ');
    const [w, d] = (ds.footprint || '9.1 14.1').split(' ').map(Number);
    const t = Math.tan(((Number(ds.fov) || 30) * Math.PI) / 360);
    const aspect = (stage.clientWidth || 1) / (stage.clientHeight || 1);
    const need = Math.max((d / 2 + 0.8) / t, (w / 2 + 0.8) / (t * aspect));
    return `${theta} ${phi} ${Math.max(parseFloat(r0) || 0, need).toFixed(2)}m`;
  }

  function view(v) {
    clearRoom();
    const target = v === 'top' ? ds.topTarget : ds.target;
    const orbit = v === 'top' ? topOrbit() : ds.orbit;
    // With Medidas on, the view is framed for the drawing; turning it off returns to the plain view.
    mv.cameraTarget = target;
    mv.cameraOrbit = dims ? dims.viewOrbit(orbit, target) : orbit;
    jump();
    pressView(v);
  }

  function focusRoom(b) {
    // A room close-up cannot hold the whole footprint drawing: Medidas turns off (and keeps the new camera).
    if (dims) dims.off(false);
    const [x, y, span, text] = rd(b);
    mv.cameraTarget = `${x}m 0.4m ${-y}m`;
    mv.cameraOrbit = `-28deg 46deg ${Math.max(4.5, span * 1.35 + 3)}m`;
    jump();
    const id = b.dataset.room;
    for (const r of rooms) r.setAttribute('aria-pressed', String(r === b));
    for (const h of mv.querySelectorAll('.vw-hs')) h.classList.toggle('is-on', h.dataset.hs === id);
    const strong = doc.createElement('strong');
    strong.textContent = `${rooms.indexOf(b) + 1}. ${b.querySelector('.vw-room__name').textContent}`;
    note.replaceChildren(strong, `, ${b.querySelector('.vw-room__m2').textContent}. ${text}`);
    pressView(null);
    // Keep the active chip in view in the mobile scroller (click/timer handler, not a scroll handler).
    const list = b.closest('ol');
    if (list && list.scrollWidth > list.clientWidth + 1) {
      const li = b.parentElement;
      list.scrollTo({ left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  function zoom(f) {
    const o = mv.getCameraOrbit();
    mv.cameraOrbit = `${o.theta}rad ${o.phi}rad ${Math.max(2, o.radius * f)}m`;
    jump();
    pressView(null);
  }

  /* ── Guided tour: pausable, stops on any input, ends on the overview (MOTION-08) ── */
  function tourLabel() {
    if (tourBtn) tourBtn.textContent = tourTimer ? T.tourPause : tourIdx > 0 ? T.tourResume : T.tour;
  }
  function step() {
    if (tourIdx >= rooms.length) { stopTour(); view('home'); return; }
    focusRoom(rooms[tourIdx++]);
  }
  function playTour() {
    if (tourTimer) { pauseTour(); return; }
    run(() => {
      if (tourIdx >= rooms.length) tourIdx = 0;
      step();
      tourTimer = setInterval(step, reduce ? 6000 : 4200);
      tourLabel();
    });
  }
  function pauseTour() {
    if (!tourTimer) return;
    clearInterval(tourTimer);
    tourTimer = 0;
    tourLabel();
  }
  function stopTour() {
    clearInterval(tourTimer);
    tourTimer = 0;
    tourIdx = 0;
    tourLabel();
  }

  /* ── Wiring ── */
  startBtn.addEventListener('click', () => start());
  stage.addEventListener('click', (e) => { if (state === 'poster' && !e.target.closest('button, a')) start(); });
  for (const b of rooms) b.addEventListener('click', () => { pauseTour(); run(() => focusRoom(b)); });
  for (const b of qa('[data-vw-view]')) b.addEventListener('click', () => { pauseTour(); view(b.dataset.vwView); });
  for (const b of qa('[data-vw-cut]')) b.addEventListener('click', () => { pauseTour(); setCut(b.dataset.vwCut === '1'); });
  for (const b of qa('[data-vw-zoom]')) b.addEventListener('click', () => { pauseTour(); zoom(Number(b.dataset.vwZoom)); });
  if (tourBtn) tourBtn.addEventListener('click', playTour);
  for (const b of qa('[data-vw-dims]')) b.addEventListener('click', () => { pauseTour(); run(toggleDims); });
  const retryBtn = q('[data-vw-retry]');
  if (retryBtn) retryBtn.addEventListener('click', retry);
  if (light) {
    const valueText = () => light.setAttribute('aria-valuetext', T.pct.replace('{n}', Math.round((Number(light.value) / exposure0) * 100)));
    valueText();
    light.addEventListener('input', () => { pauseTour(); mv.exposure = Number(light.value); valueText(); });
  }
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (tourTimer || tourIdx)) { stopTour(); pressView(null); }
    if (e.target === mv && state === 'ready' && !e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === '+' || e.key === '=') zoom(0.8);
      else if (e.key === '-') zoom(1.25);
    }
  });
  doc.addEventListener('visibilitychange', () => { if (doc.hidden) pauseTour(); });

  // AR chooser: the link goes to /ar/villa/ without JS; with JS it opens the <dialog>, filled on first
  // use with that page's choices (prefetched on intent). If the fetch fails, the link navigates instead.
  const arLink = q('[data-vw-ar]');
  const dlg = q('dialog');
  if (arLink && dlg && typeof dlg.showModal === 'function') {
    const slot = dlg.querySelector('[data-vw-arslot]');
    const url = arLink.href;
    const prefetch = () => { arChoices(url).catch(() => {}); };
    for (const ev of ['pointerenter', 'focus', 'touchstart']) arLink.addEventListener(ev, prefetch, { once: true, passive: true });
    arLink.addEventListener('click', async (e) => {
      e.preventDefault();
      pauseTour();
      if (slot && !slot.firstElementChild) {
        try {
          const el = doc.importNode(await arChoices(url), true);
          el.classList.remove('vw-ar--big');
          for (const h of el.querySelectorAll('h2')) { // the dialog title is the h2
            const h3 = doc.createElement('h3');
            h3.className = h.className;
            h3.append(...h.childNodes);
            h.replaceWith(h3);
          }
          slot.append(el);
          initAr(el);
        } catch {
          location.href = url;
          return;
        }
      }
      dlg.showModal();
    });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    const close = dlg.querySelector('[data-vw-close]');
    if (close) close.addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => arLink.focus());
  }
}

/* ── AR blocks: platform, notices, preview origins, Quick Look banner → contact ── */
function initAr(el) {
  el.dataset.platform = PLATFORM;
  if (IN_APP) { const n = el.querySelector('[data-vw-inapp]'); if (n) n.hidden = false; }
  if (/[?&]sin-ar=1(&|$)/.test(location.search)) { const n = el.querySelector('[data-vw-noar]'); if (n) n.hidden = false; }
  // Deploy previews: Scene Viewer and Quick Look need a reachable HTTPS origin, so point them at this one.
  const origin = el.dataset.origin;
  if (origin && location.protocol === 'https:' && location.origin !== origin) {
    const from = encodeURIComponent(origin);
    const to = encodeURIComponent(location.origin);
    for (const a of el.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (href.includes(from)) a.setAttribute('href', href.split(from).join(to));
    }
  }
  for (const a of el.querySelectorAll('a[rel="ar"]')) {
    a.addEventListener('message', (e) => { if (e.data === '_apple_ar_quicklook_button_tapped') toContact(el.dataset.contact); });
  }
}

/* ── Embed snippet copy button (announces via aria-live) ── */
function initCopy(btn) {
  btn.addEventListener('click', async () => {
    const code = doc.getElementById(btn.dataset.vwCopy);
    const status = btn.parentElement.querySelector('[data-vw-copied]');
    if (!code) return;
    let ok = false;
    try { await navigator.clipboard.writeText(code.textContent); ok = true; } catch { /* permission or insecure context */ }
    if (!ok) {
      const range = doc.createRange();
      range.selectNodeContents(code);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (status) {
      status.textContent = '';
      setTimeout(() => { status.textContent = ok ? btn.dataset.ok : btn.dataset.fail; }, 60);
    }
  });
}

for (const el of doc.querySelectorAll('[data-vw]')) initViewer(el);
for (const el of doc.querySelectorAll('[data-vw-arblock]')) initAr(el);
for (const el of doc.querySelectorAll('[data-vw-copy]')) initCopy(el);
