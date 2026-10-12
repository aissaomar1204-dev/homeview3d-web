/* Home View 3D · coreografía de la web.
   Todo se mueve con transform y opacity. Las escenas fijadas solo calculan mientras están a la vista. */
(function () {
  'use strict';

  var root = document.documentElement;
  var motion = root.classList.contains('motion');
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ---------- Menú móvil ---------- */
  var burger = $('.burger');
  var menu = $('#menu');
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar el menú' : 'Abrir el menú');
    if (open) document.addEventListener('keydown', onEsc); else document.removeEventListener('keydown', onEsc);
  }
  function onEsc(e) { if (e.key === 'Escape') { setMenu(false); burger.focus(); } }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  /* ---------- Apariciones al entrar en pantalla ---------- */
  var reveals = $$('[data-reveal]');
  if (motion && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Portada: cielo → casas → el showroom sube ---------- */
  // La foto mide 2400 × 1600. PROFILE = altura del tejado (fracción) en 48 franjas de izquierda a derecha.
  var IMG_W = 2400, IMG_H = 1600, SKY_Y = 380;
  var PROFILE = [0.787, 0.782, 0.778, 0.614, 0.613, 0.604, 0.596, 0.588, 0.579, 0.538, 0.512, 0.494, 0.492, 0.482, 0.472, 0.466, 0.468, 0.476, 0.471, 0.461, 0.453, 0.453, 0.462, 0.459, 0.451, 0.443, 0.438, 0.441, 0.441, 0.433, 0.425, 0.417, 0.409, 0.329, 0.32, 0.311, 0.302, 0.294, 0.285, 0.276, 0.268, 0.259, 0.255, 0.269, 0.291, 0.314, 0.329, 0.335];
  function roofIn(f0, f1) {
    var m = 1;
    for (var i = 0; i < PROFILE.length; i++) {
      var c0 = i / PROFILE.length, c1 = (i + 1) / PROFILE.length;
      if (c1 >= f0 && c0 <= f1) m = Math.min(m, PROFILE[i]);
    }
    return m;
  }

  var heroTrack = $('#hero-track'), heroStage = $('#hero-stage'), h1 = $('#hero-t');
  var srTrack = $('#sr-track'), srStage = $('#sr-stage');

  // Coloca la foto: al final, el tejado más alto bajo «virtual» tapa un 30 % de sus letras.
  function layoutHero() {
    if (!heroStage || !h1) return;
    var W = heroStage.clientWidth, H = heroStage.clientHeight;
    var tx = 0, ty = 0, n = h1;
    while (n && n !== heroStage) { tx += n.offsetLeft; ty += n.offsetTop; n = n.offsetParent; }
    if (n !== heroStage) {
      var hr = h1.getBoundingClientRect(), sr = heroStage.getBoundingClientRect();
      tx = hr.left - sr.left; ty = hr.top - sr.top;
    }
    var bottom = ty + h1.offsetHeight;
    var cs = getComputedStyle(h1);
    var fs = parseFloat(cs.fontSize) || 100;
    var base = bottom - 0.2 * fs, asc = 0.62 * fs, lastW = h1.offsetWidth * 0.5;
    try {
      var last = $('.l2', h1);
      var lh = parseFloat(cs.lineHeight) || fs;
      var pb = last ? parseFloat(getComputedStyle(last).paddingBottom) || 0 : 0;
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily;
      var m = ctx.measureText('VIRTUAL');
      lastW = m.width;
      if (m.fontBoundingBoxAscent) {
        var top = bottom - pb - lh;
        base = top + (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
        asc = m.actualBoundingBoxAscent || asc;
      }
    } catch (e) { /* medidas aproximadas */ }
    var roof = base - 0.3 * asc;
    var s = W / IMG_W, ry = 0.45;
    for (var k = 0; k < 3; k++) {
      var wk = IMG_W * s, xk = (W - wk) / 2;
      ry = roofIn((tx - xk) / wk, (tx + lastW - xk) / wk);
      s = Math.max(W / IMG_W, ((H - roof) / (IMG_H * (1 - ry))) * 1.03, (H * 0.55) / IMG_H);
    }
    var w = IMG_W * s;
    var st = heroStage.style;
    st.setProperty('--hx', ((W - w) / 2).toFixed(1) + 'px');
    st.setProperty('--hw', w.toFixed(1) + 'px');
    st.setProperty('--hy1', (roof - ry * IMG_H * s).toFixed(1) + 'px');
    st.setProperty('--hy0', (H - SKY_Y * s).toFixed(1) + 'px');
  }

  // Progreso de cada escena según el scroll. Se suaviza un poco para que el movimiento sea fluido.
  var cur = { p: 1, q: 0, u: 1 }, raf = 0, active = false;
  function pad() { return heroStage ? parseFloat(getComputedStyle(heroStage).top) || 0 : 0; }
  function targets() {
    var t = { p: 1, q: 0, u: 1 };
    if (!motion) return t;
    var P = pad();
    if (heroTrack && heroStage) {
      var H = heroStage.offsetHeight;
      // El recorrido extra se reparte: un 55 % para bajar del cielo a las casas y el resto con la portada quieta.
      var extra = Math.max(1, heroTrack.offsetHeight - 2 * H);
      var tilt = extra * 0.55;
      var s = P - heroTrack.getBoundingClientRect().top;
      t.p = clamp(s / tilt, 0, 1);
      t.q = clamp((s - extra) / H, 0, 1);
    }
    if (srTrack && srStage) {
      var Hs = srStage.offsetHeight;
      var r = srTrack.getBoundingClientRect();
      var s2 = P - r.top;
      var span = Math.max(1, srTrack.offsetHeight - Hs);
      // u < 0 mientras el panel sube por encima de la portada; 0..1 mientras está fijado.
      t.u = s2 < 0 ? clamp(s2 / Hs, -1, 0) : clamp(s2 / span, 0, 1);
    }
    return t;
  }

  var steps = $$('#steps li'), screens = $$('#sr-screen img'), phones = $$('#sr-phone img'), phone = $('#sr-phone');
  var stepNow = 0, stepLocked = -1;
  function showStep(i) {
    if (i === stepNow) return;
    stepNow = i;
    steps.forEach(function (li, k) {
      li.classList.toggle('on', k === i);
      var b = $('button', li);
      if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    screens.forEach(function (im, k) { im.classList.toggle('on', k === i); });
    phones.forEach(function (im, k) { im.classList.toggle('on', k === i); });
    if (phone) phone.classList.toggle('off', i === 2);
  }

  function write() {
    var e = 0.5 - Math.cos(Math.PI * cur.p) / 2;
    if (heroStage) {
      heroStage.style.setProperty('--hpe', e.toFixed(4));
      heroStage.style.setProperty('--hq', cur.q.toFixed(4));
    }
    if (srStage) {
      var unfold = cur.u < 0 ? 1 + cur.u : 1;
      var unf = 1 - Math.pow(1 - clamp(unfold, 0, 1), 3);
      srStage.style.setProperty('--su', unf.toFixed(4));
      if (stepLocked < 0) {
        var k = cur.u <= 0 ? 0 : Math.min(3, Math.floor(clamp((cur.u - 0.04) / 0.92, 0, 0.9999) * 4));
        showStep(k);
      }
    }
  }

  function tick() {
    raf = 0;
    var t = targets();
    var f = 0.18;
    cur.p += (t.p - cur.p) * f;
    cur.q += (t.q - cur.q) * f;
    cur.u += (t.u - cur.u) * f;
    var done = Math.abs(t.p - cur.p) < 0.0006 && Math.abs(t.q - cur.q) < 0.0006 && Math.abs(t.u - cur.u) < 0.0006;
    if (done) { cur.p = t.p; cur.q = t.q; cur.u = t.u; }
    write();
    if (!done && active) raf = requestAnimationFrame(tick);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }

  if (motion && heroTrack && 'IntersectionObserver' in window) {
    var visible = new Set();
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      active = visible.size > 0;
      if (active) kick();
    }, { rootMargin: '20% 0px 20% 0px' });
    so.observe(heroTrack);
    if (srTrack) so.observe(srTrack);
    window.addEventListener('scroll', function () { if (active) kick(); }, { passive: true });
    var t0 = targets(); cur.p = t0.p; cur.q = t0.q; cur.u = t0.u;
  }
  write();

  // Pulsar un paso lleva a ese punto del recorrido (o lo enseña directamente sin animaciones).
  steps.forEach(function (li, k) {
    $('button', li).addEventListener('click', function () {
      if (motion && srTrack && srStage) {
        var span = srTrack.offsetHeight - srStage.offsetHeight;
        var y = window.scrollY + srTrack.getBoundingClientRect().top - pad() + span * (0.04 + 0.92 * (k + 0.5) / 4);
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        stepLocked = k;
        showStep(k);
      }
    });
  });

  var relayout = function () { layoutHero(); kick(); };
  layoutHero();
  window.addEventListener('resize', relayout);
  window.addEventListener('orientationchange', function () { setTimeout(relayout, 250); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout);

  /* ---------- Qué incluye: la imagen se abre al pasar por cada pieza ---------- */
  var incBtns = $$('#inc-list button');
  var shots = $$('#inc-fig .shot');
  var dn = $('#inc-dn'), cap = $('#inc-cap'), fig = $('#inc-fig');
  // Estancias: las imágenes van cambiando solas mientras la pieza está elegida.
  var roomImgs = $$('#inc-fig [data-room]'), roomChips = $$('#inc-fig [data-chip]');
  var ROOMS = [['Salón, comedor y cocina', 'Planta baja'], ['Dormitorio principal', 'Planta 1'], ['Baño suite', 'Planta 1'], ['Azotea', 'Azotea'], ['Zona de bienestar', 'Sótano']];
  var roomNow = 0, roomTimer = 0;
  function showRoom(k) {
    roomNow = k;
    roomImgs.forEach(function (im, n) { im.classList.toggle('on', n === k); });
    roomChips.forEach(function (ch, n) { ch.classList.toggle('on', n === k); });
    var nm = $('#room-name'), lv = $('#room-lvl');
    if (nm) nm.textContent = ROOMS[k][0];
    if (lv) lv.textContent = 'Casa 5 · ' + ROOMS[k][1];
  }
  function roomsCycle(on) {
    if (roomTimer) { clearInterval(roomTimer); roomTimer = 0; }
    if (on && roomImgs.length) roomTimer = setInterval(function () { showRoom((roomNow + 1) % roomImgs.length); }, motion ? 2600 : 4000);
  }
  var TEXTS = [
    'La promoción entera desde el aire. Tu comprador ve qué casas quedan y cuál le encaja.',
    'Cada planta en 3D, para entender la distribución sin saber leer un plano.',
    'La ficha de cada vivienda y el plano de cada planta, con los datos de tu proyecto.',
    'Salón, cocina, dormitorios y terrazas, cada uno situado en su planta.',
    'Tu comprador se mete en la estancia y mira alrededor con el dedo o el ratón.',
    'El masterplan y los jardines de día y de noche, con un toque.'
  ];
  var incNow = 0;
  function pickInc(i) {
    if (i === incNow) return;
    var prev = incNow; incNow = i;
    incBtns.forEach(function (b, k) {
      b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      b.parentNode.classList.toggle('on', k === i);
    });
    shots.forEach(function (sh) {
      var on = sh.getAttribute('data-on').split(',').map(Number);
      var isOn = on.indexOf(i) >= 0, wasOn = !isOn && on.indexOf(prev) >= 0;
      sh.classList.toggle('on', isOn);
      sh.classList.toggle('was', wasOn);
    });
    if (dn) dn.classList.toggle('on', i === 5);
    if (fig) fig.classList.toggle('dnmode', i === 5);
    roomsCycle(i === 3);
    if (cap) cap.textContent = TEXTS[i];
  }
  incBtns.forEach(function (b) {
    var i = Number(b.getAttribute('data-i'));
    if (finePointer) b.addEventListener('mouseenter', function () { pickInc(i); });
    b.addEventListener('focus', function () { pickInc(i); });
    b.addEventListener('click', function () {
      pickInc(i);
      if (!finePointer && fig) {
        var r = fig.getBoundingClientRect();
        if (r.top < 70 || r.bottom > window.innerHeight) fig.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' });
      }
    });
  });
  // La vista previa se desplaza un poco en sentido contrario al cursor.
  if (fig && finePointer && motion) {
    fig.addEventListener('pointermove', function (e) {
      var r = fig.getBoundingClientRect();
      fig.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      fig.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    fig.addEventListener('pointerleave', function () { fig.style.setProperty('--mx', '0'); fig.style.setProperty('--my', '0'); });
  }

  /* ---------- Vídeos: se cargan al acercarse y solo se reproducen a la vista ---------- */
  var vids = $$('video[data-src]');
  function poster(v) { var p = v.getAttribute('data-poster'); if (p && !v.getAttribute('poster')) v.setAttribute('poster', p); }
  function load(v) { poster(v); if (!v.getAttribute('src')) { v.src = v.getAttribute('data-src'); v.load(); } }
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var tvid = null;
  if ('IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { load(en.target); near.unobserve(en.target); } });
    }, { rootMargin: '900px 0px' });
    vids.forEach(function (v) { near.observe(v); });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (v === tvid) {
          if (en.isIntersecting && en.intersectionRatio > 0.45 && !tPlayed) { tPlayed = true; load(v); play(v); }
          return;
        }
        if (en.isIntersecting) { load(v); if (motion) play(v); } else { v.pause(); }
      });
    }, { threshold: [0, 0.5] });
    vids.forEach(function (v) { seen.observe(v); });
  } else {
    vids.forEach(load);
  }
  /* ---------- Antes y después: del plano en papel a la casa ---------- */
  var ba = $('#ba'), baIn = $('#ba-range');
  function setBa(v) { if (ba) ba.style.setProperty('--x', v + '%'); }
  if (ba && baIn) {
    baIn.addEventListener('input', function () { setBa(baIn.value); });
    // Al aparecer, la línea barre una vez para enseñar que se puede arrastrar.
    if (motion && 'IntersectionObserver' in window) {
      var bo = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        bo.disconnect();
        var t0 = performance.now();
        (function step(now) {
          var k = Math.min(1, (now - t0) / 1800), e = 1 - Math.pow(1 - k, 3);
          var v = 88 - (88 - 50) * e;
          setBa(v.toFixed(2)); baIn.value = Math.round(v);
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      }, { threshold: 0.5 });
      bo.observe(ba);
    }
  }

  /* ---------- Galería de ejemplos ---------- */
  var gal = $('#gal');
  $$('[data-gal]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!gal) return;
      var card = $('figure', gal);
      var step = card ? card.getBoundingClientRect().width + 20 : 360;
      gal.scrollBy({ left: step * Number(b.getAttribute('data-gal')), behavior: motion ? 'smooth' : 'auto' });
    });
  });

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
