/* hero.js · home hero playback, loaded after `load` by an inline loader (build/lib/hero.mjs), so it is not initial JS.
   Builds the cotas, rulers and chips from the geometry JSON, then: line plan (real <img>, LCP) → frames on a <canvas>
   → crisp still. Reduced motion: final state only. Save-Data, 2G/3G, no createImageBitmap or 6 s without frames:
   straight to the final still, no frame download. Geometry index map: see frameGeo() in build/lib/hero.mjs. */
(() => {
  const d = document, R = d.querySelector('[data-hero]');
  if (!R || !window.fetch || R.classList.contains('is-live')) return;
  const C = R.classList, M = Math, mq = matchMedia, cn = navigator.connection || {};
  const q = s => R.querySelector(s), qa = s => [...R.querySelectorAll(s)], at = k => R.getAttribute(k);
  const im = q('.hs__still img'), A = q('.hs__art'), cv = q('.hs__cv'), phs = qa('.hs__rail li');
  const es = d.documentElement.lang === 'es', f1 = v => (+v).toFixed(1), f4 = v => v.toFixed(4);
  let G, N, LAST, PH, base, hs, cx, dims, chips, hb, rt, rl, tb, lb, cur;
  let U = 1.4, aw = 0, st = 0, el = 0, t = 0, raf = 0, vis = 1, want = 0, from = 5, hold = 700, df = -1, fr = 0, sa = 0, dead = 0;
  const blobs = [], bmp = {};
  let ready = 0, pool = 0, next = 0, t1 = 0, nx = 0, kk = 0, began = 0, CM = [14, 36];
  const ac = new AbortController(), EASE = 1.35;

  // Final still, shown once it is decoded (rp: the sequence landed on the last frame, so the still SWAPS in with no
  // dissolve, see 22-hero-seq.css, and a replay is offered). Any other case dissolves over the plan or the last frame.
  const still = rp => {
    C.add('is-pre'); im.loading = 'eager';
    const f = () => { rp || C.remove('is-f'); C.add('is-end'); setTimeout(() => rp && C.add('is-done'), 300); };
    im.decode ? im.decode().then(f, () => (im.complete && im.naturalWidth ? f() : rp && C.add('is-done'))) : f();
  };
  let pin, run; // phone scroll mode (scrub)
  const fail = () => { if (dead) return; dead = 1; st = 9; ac.abort(); if (run) { run.remove(); C.remove('is-scrub'); } C.add('is-live'); if (G) { setF(LAST); rail(LAST); } still(); };

  /* ─── Overlay: cotas, rulers, chips (built here: they are data, and it keeps them out of the HTML) ─── */
  const build = () => {
    const [w, s] = at('data-t').split('|'), u = ' ' + at('data-u');
    const h = ' aria-hidden="true"', lab = c => [0, 5, 10, 15].map(n => `<span class="mono hs__${c}" data-m="${n}"${h}>${n||'0'+u}</span>`).join('');
    A.insertAdjacentHTML('beforeend', '<svg class="hs__svg" viewBox="0 0 1400 900" aria-hidden="true"><path class="hs__rt"/>'
      + '<g class="hs__d"><path class="hs__x"/><path class="hs__l" pathLength="1"/><path class="hs__k"/></g>'.repeat(3) + '</svg>'
      + `<span class="mono hs__c"${h}>${w+u}</span><span class="mono hs__c"${h}>${s+u}</span><span class="mono hs__c hs__c--l"${h}><b></b>${u}</span>` + lab('tb'));
    q('.hs__stage').insertAdjacentHTML('beforeend', '<svg class="hs__rv" viewBox="0 0 28 900" preserveAspectRatio="none" aria-hidden="true"><path class="hs__rl"/></svg>' + lab('lb'));
    dims = qa('.hs__d'); chips = qa('.hs__c'); hb = q('.hs__c b'); rt = q('.hs__rt'); rl = q('.hs__rl'); tb = qa('.hs__tb'); lb = qa('.hs__lb');
  };
  const setF = f => {
    fr = f;
    const g = G[f];
    dims.forEach((e, j) => {
      const a = g.slice(j * 12, j * 12 + 12), c = e.children;
      let dx = a[10] - a[4], dy = a[11] - a[5], l = M.hypot(dx, dy);
      if (l < 1) { dx = 0; dy = 1; l = 1; }
      const k = 5 * U / (l * 1.4142), x = (dx - dy) * k, y = (dx + dy) * k;
      const tk = (p, r) => `M${f1(p-x)} ${f1(r-y)}L${f1(p+x)} ${f1(r+y)}`;
      c[0].setAttribute('d', `M${a[0]} ${a[1]}L${a[2]} ${a[3]}M${a[6]} ${a[7]}L${a[8]} ${a[9]}`);
      c[1].setAttribute('d', `M${a[4]} ${a[5]}L${a[10]} ${a[11]}`);
      c[2].setAttribute('d', tk(a[4], a[5]) + tk(a[10], a[11]));
      // The cota chips sit on the middle of their line; the height chip sits above its top end.
      chips[j].style.cssText = `--x:${f4((j>1?a[10]:(a[4]+a[10])/2)/1400)};--y:${f4((j>1?a[11]:(a[5]+a[11])/2)/900)}`;
    });
    // Rulers: a tick every metre (long every 5) along the footprint's screen extent; a closing tick marks the exact end.
    const ruler = (o, s, L, fmt) => { let r = ''; for (let m = 0; m <= L; m++) r += fmt(g[o] + m * g[s], m % 5 ? 6 : 12); return r + (L % 1 > 0.35 ? fmt(g[o] + L * g[s], 12) : ''); };
    rt.setAttribute('d', ruler(37, 39, g[41], (p, n) => `M${f1(p)} 0v${f1(n*U)}`));
    rl.setAttribute('d', ruler(38, 40, g[42], (p, n) => `M0 ${f1(p)}h${n}`));
    tb.forEach(e => { const n = +e.dataset.m; e.style.setProperty('--x', f4((g[37] + n * g[39]) / 1400)); e.hidden = n > g[41]; });
    lb.forEach(e => { const n = +e.dataset.m; e.style.setProperty('--y', f4((g[38] + n * g[40]) / 900)); e.hidden = n > g[42]; });
    hb.textContent = g[36].toFixed(2).replace('.', es ? ',' : '.');
  };
  // Phase rail: p = fractional frame; each cell fills between its start and the next one's.
  const rail = p => {
    const on = PH.filter(a => p >= a).length - 1;
    phs.forEach((li, i) => {
      const a = PH[i], b = PH[i + 1] || LAST, e = li.firstChild;
      li.style.setProperty('--p', f4(M.max(0, M.min(1, (p - a) / (b - a)))));
      li.classList.toggle('is-on', i === on);
      i === on ? e.setAttribute('aria-current', 'step') : e.removeAttribute('aria-current');
    });
  };

  /* ─── Canvas: backing store = min(frame width, css width × DPR), redrawn on resize ─── */
  // cur, plus the next frame at alpha kk (the slow tail glides between frames instead of ticking).
  const draw = () => {
    try {
      cx.imageSmoothingQuality = 'high'; cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(cur, 0, 0, cv.width, cv.height);
      if (nx && kk) { cx.globalAlpha = kk; cx.drawImage(nx, 0, 0, cv.width, cv.height); }
    } catch (e) { /* no bitmap yet, or closed by the window: the next frame redraws */ } finally { cx.globalAlpha = 1; }
  };
  // Art width comes from the ResizeObserver entry: no forced layout in the init tasks.
  const fit = es => {
    if (es) aw = es[0].contentRect.width;
    const w = aw || 1000, W = M.min(cur ? cur.width : 1400, M.round(w * (devicePixelRatio || 1)));
    U = 1400 / w;
    R.style.setProperty('--u', U.toFixed(3));
    if (cx && cv.width !== W) { cv.width = W; cv.height = M.round(W * 9 / 14); draw(); }
    setF(fr);
  };

  /* ─── Frames: 4 parallel fetches in order; decode a small window ahead of the playhead, close the rest ─── */
  const load = () => {
    t1 = t1 || performance.now();
    while (pool < 4 && next < N) {
      const i = next++;
      pool++;
      fetch(`${base}${('00'+i).slice(-3)}.${hs[i]}.webp`, { signal: ac.signal }).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(b => {
        blobs[i] = b; pool--;
        while (blobs[ready]) ready++;
        load();
      }).catch(fail);
    }
  };
  const bm = i => {
    if (bmp[i] === undefined && blobs[i]) { bmp[i] = 0; createImageBitmap(blobs[i]).then(b => { if (bmp[i] === 0) bmp[i] = b; else b.close(); }, fail); }
    return bmp[i];
  };
  const win = f => {
    for (let i = f; i < f + 6 && i < N; i++) bm(i);
    for (const k in bmp) if (+k < f - 2 || +k > f + 14) { bmp[k] && bmp[k].close(); delete bmp[k]; }
  };

  /* ─── Timeline: hold on the plan → crossfade → play (eased) → still ─── */
  const go = () => { if (!raf && vis && !dead && st < 3) raf = requestAnimationFrame(tick); };
  // Layer change with no dissolve (replay, rail click): transitions are off for one style flush, so the final still never
  // ghosts over the plan or over another frame (two different geometries).
  const cut = fn => { C.add('is-cut'); fn(); void R.offsetWidth; C.remove('is-cut'); };
  const restart = i => {
    if (dead) return;
    want = i; st = 0; el = 0; sa = 0; t = 0; hold = i ? 0 : 700;
    if (!i) {
      cut(() => C.remove('is-f', 'is-end', 'is-done', 'is-live')); // the flush also restarts the cota animations
      C.add('is-live');
      setF(0); rail(0);
    }
    go();
  };
  const tick = (now) => {
    raf = 0;
    if (dead || st > 2) return;
    const dt = t ? M.min(now - t, 100) : 16;
    t = now; el += dt;
    if (st === 0) {
      const f0 = want ? PH[want] : 0;
      if (!want) rail(M.min(el / hold, 1) * (PH[1] - 0.01));
      // Start once 20 frames are in and the rest should arrive within ~2 s at the measured speed.
      if (el >= hold && ready >= 20 && (N - ready) * (now - t1) < 2000 * ready && bm(f0)) {
        win(f0);
        cur = bmp[f0]; df = f0; nx = 0; kk = 0; draw(); setF(f0);
        began = 1; C.add('is-f', 'is-pre'); C.remove('is-done'); im.loading = 'eager';
        if (want) { cut(() => C.remove('is-end')); rail(f0); } // frame f0 is already on the canvas: the still gives way at once
        from = want ? f0 : PH[1]; st = want ? 2 : 1; el = 0;
      }
    } else if (st === 1) {
      if (el >= 480) { st = 2; el = 0; }
    } else {
      const D = 2100 * (LAST - from) / (LAST - PH[1]), x = M.min(el / D, 1), p = from + (LAST - from) * (1 - M.pow(1 - x, EASE)), f = M.floor(p), b = bm(f);
      win(f);
      if (!b) { el -= dt; sa = sa || now; if (now - sa > 4000) return fail(); }
      else {
        sa = 0;
        // The ease slows the playhead to under 10 fps in the last 600 ms. There the frames dissolve into each other by the
        // fractional part of p. The dissolve window fills the whole frame interval below 25 fps and vanishes above it, so
        // the fast camera move keeps its crisp steps (a blend of two frames 30 px apart would ghost).
        const v = (LAST - from) * EASE * M.pow(1 - x, EASE - 1) / D, w = M.min(1, M.max(0, (1 / v - 40) / 60));
        const nb = w && f < LAST && bmp[f + 1], k = nb ? M.min(1, M.max(0, (p - f - 1 + w) / w)) : 0;
        if (f !== df || k !== kk) { const s = f !== df; cur = b; nx = nb; kk = k; df = f; draw(); s && setF(f); }
        rail(p);
        if (el >= D && f === LAST) { st = 3; return still(1); }
      }
    }
    go();
  };

  /* ─── Init: geometry + the lazy stylesheet first (the cotas draw on the plan while the frames download) ─── */
  const css = d.createElement('link');
  css.rel = 'stylesheet'; css.href = at('data-c');
  d.head.append(css);
  Promise.all([fetch(at('data-g')).then(r => r.json()), new Promise((ok, no) => { css.onload = ok; css.onerror = no; })]).then(([j]) => {
    N = j.n; LAST = N - 1; PH = j.ph; CM = j.cm || CM;
    build();
    G = j.g; fr = LAST;
    new ResizeObserver(fit).observe(A);
    setF(fr);
    if (mq('(prefers-reduced-motion: reduce)').matches) return;
    if (cn.saveData || /^(slow-)?[23]g$/.test(cn.effectiveType) || !window.createImageBitmap) { C.add('is-live'); return still(); }
    // Animated mode, in a second task (no long task): plan drawing + cotas at frame 0, frames download in the background.
    setTimeout(() => animate(j));
  }).catch(fail);
  /* ─── Phones: scroll-driven intro. A panel (phase line, model, phase rail, hint) pins under the header for the height of
     a runway. The playhead eases towards the scroll position, so a jerky finger never makes the model jump; neighbour
     frames dissolve into each other (inside the camera move only around the middle of each step, a blend of two frames
     10 px apart would ghost at rest). The cotas stay off here: only the model moves. ─── */
  let span = 1, stick = 0;
  const pos = () => M.max(0, M.min(1, (stick - R.getBoundingClientRect().top) / span));
  const seek = i => scrollTo({ top: scrollY + R.getBoundingClientRect().top - stick + (i ? (PH[i] + 0.5) / LAST : 0) * span, behavior: 'smooth' });
  const scrub = x => {
    C.add('is-scrub');
    const stg = q('.hs__stage'), say = d.createElement('p'), foot = d.createElement('div');
    pin = d.createElement('div'); pin.className = 'hs__pin';
    say.className = 'hs__say'; say.setAttribute('aria-hidden', 'true');
    say.innerHTML = x.slice(0, 4).map(s => `<span>${s}</span>`).join('');
    foot.className = 'hs__foot';
    foot.innerHTML = `<span class="hs__hint" aria-hidden="true"><svg class="icon" viewBox="0 0 256 256"><path d="M128 40v176M64 152l64 64 64-64"/></svg>${x[4]}</span><button type="button" class="hs__skip">${x[5]}</button>`;
    R.insertBefore(pin, stg); pin.append(say, stg, q('.hs__strip'), foot);
    run = d.createElement('div'); run.className = 'hs__run'; run.setAttribute('aria-hidden', 'true'); R.append(run);
    const ln = [...say.children], hint = foot.firstChild;
    foot.lastChild.onclick = () => { scrollTo({ top: scrollY + R.getBoundingClientRect().bottom - stick, behavior: 'instant' }); };
    let tk = 0, lt = 0, sp = -1, la = -1, lk = -1, lc = -1, lx = '';
    const near = f => {
      for (let i = M.max(0, f - 4); i <= M.min(LAST, f + 6); i++) bm(i);
      for (const k in bmp) if (+k < f - 8 || +k > f + 10) { bmp[k] && bmp[k].close(); delete bmp[k]; }
    };
    const paint = p => {
      const fp = p * LAST, ph = PH.filter(a => fp >= a).length - 1;
      rail(fp);
      if (ph !== lc) { ln.forEach((e, i) => e.classList.toggle('is-on', i === ph)); lc = ph; }
      hint.classList.toggle('is-off', p > 0.03);
      // The camera move drifts the model right: the art follows it (--hx 0 → 1), so the wide final view stays centred.
      const hx = f4(M.max(0, M.min(1, (fp - CM[0]) / (CM[1] - CM[0])))); if (hx !== lx) { R.style.setProperty('--hx', hx); lx = hx; }
      // Frames 0 to PH[1] are the same flat view: the line plan holds for the first half of the phase, then dissolves.
      if (fp < PH[1] / 2) { if (C.contains('is-f')) { C.remove('is-f'); la = -1; } return 1; }
      const i = M.min(LAST, M.floor(fp)), r = fp - i, cam = i >= CM[0] && i < CM[1];
      const k = M.round(24 * (cam ? M.max(0, M.min(1, (r - 0.3) / 0.4)) : r)) / 24, A = bm(i), B = k && i < LAST ? bm(i + 1) : 0;
      near(i);
      if (!A || (k && !B)) return 0; // still downloading or decoding
      if (i !== la || k !== lk) { cur = A; nx = B; kk = k; draw(); la = i; lk = k; C.add('is-f'); }
      return 1;
    };
    const upd = now => {
      tk = 0;
      if (dead) return;
      const p = pos(), dt = lt ? M.min(now - lt, 64) : 16;
      sp = sp < 0 ? p : sp + (p - sp) * (1 - M.pow(0.8, dt / 16.7));
      if (M.abs(p - sp) < 0.0005) sp = p;
      lt = now;
      const ok = paint(sp);
      if (sp !== p || !ok) on(); else lt = 0;
    };
    const on = () => { if (!tk) tk = requestAnimationFrame(upd); };
    let vw = 0;
    const measure = () => { if (innerWidth === vw) return; vw = innerWidth; span = run.offsetHeight || 1; stick = parseFloat(getComputedStyle(pin).top) || 0; on(); };
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', measure, { passive: true });
    measure();
    // Frames keep arriving in the background: redraw the current position until all of them are in.
    const iv = setInterval(() => { on(); if (ready >= N || dead) clearInterval(iv); }, 300);
  };

  const animate = j => {
    cx = cv.getContext('2d'); fr = 0;
    // Small frames (700 px) below 768 px, and on 1x screens where the sheet is narrow anyway.
    const m = mq('(max-width: 767px)').matches || (devicePixelRatio <= 1 && innerWidth < 1060);
    base = m ? j.bm : j.bd; hs = m ? j.hm : j.hd;
    // Phones: the visitor's scroll drives the sequence (scrub) instead of the clock.
    const sc = mq('(max-width: 767px)').matches && at('data-x');
    phs.forEach((li, i) => {
      const s = li.firstChild, b = d.createElement('button');
      b.type = 'button'; b.className = s.className; b.innerHTML = s.innerHTML;
      li.replaceChild(b, s);
      b.onclick = () => { if (sc) seek(i); else if (st) restart(i); else { want = i; hold = i ? 0 : 700; } };
    });
    if (!sc) {
      q('.hs__stage').insertAdjacentHTML('beforeend', `<button type="button" class="mono hs__rp"><svg class="icon" viewBox="0 0 256 256" aria-hidden="true"><path d="M216 128a88 88 0 1 1-25.8-62.2L216 88M216 40v48h-48"/></svg>${at('data-r')}</button>`);
      q('.hs__rp').onclick = () => restart(0);
    }
    fit(); rail(0);
    C.add('is-live');
    load();
    if (sc) return scrub(sc.split('|'));
    new IntersectionObserver(e => { vis = e[0].isIntersecting; if (vis) { t = 0; go(); } }, { threshold: 0.25 }).observe(q('.hs__stage'));
    go();
    setTimeout(() => { if (!began && vis) fail(); }, 6000); // never started after 6 s: the final still (a replay resets st, not this)
  };
})();
