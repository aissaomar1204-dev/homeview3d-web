/* ═══════════════════════════════════════════════════════════════
   main.js · progressive enhancement for every page (≤ 15 KB min). Owner: ENGINE.
   header hairline · menu sheet · reveals · compare slider · despiece fallback ·
   calculator · lead form · copy buttons · mobile action bar.
   No scroll listeners, no layout reads in scroll/input handlers (PERF-08).
   The viewer lives in viewer.js (VIEWER), loaded only where needed.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = mqReduce.matches;
  if (mqReduce.addEventListener) mqReduce.addEventListener('change', function (e) { reduced = e.matches; });
  var hasIO = 'IntersectionObserver' in window;

  /* ─── Header hairline after scrolling (sentinel, COMP-05) ─── */
  var header = $('[data-header]');
  var sentinel = $('[data-header-sentinel]');
  if (header && sentinel && hasIO) {
    new IntersectionObserver(function (es) {
      header.classList.toggle('is-scrolled', !es[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ─── Menu sheet: disclosure + focus management (LAYOUT-05, A11Y-04) ─── */
  var menuBtn = $('[data-menu]');
  var nav = $('[data-nav]');
  if (menuBtn && nav && header) {
    var label = $('[data-menu-label]', menuBtn);
    var outside = $$('main, footer, .bottom-bar, .crumbs, .skip');
    var focusables = function () { return [menuBtn].concat($$('a[href], button:not([disabled])', nav)); };
    var setOpen = function (open, restore) {
      header.classList.toggle('is-open', open);
      root.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = menuBtn.getAttribute(open ? 'data-label-close' : 'data-label-open');
      outside.forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
      if (open) { var first = $('a[href]', nav); if (first) first.focus(); }
      else if (restore) menuBtn.focus();
    };
    menuBtn.addEventListener('click', function () { setOpen(menuBtn.getAttribute('aria-expanded') !== 'true', true); });
    d.addEventListener('keydown', function (e) {
      if (!header.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false, true); return; }
      if (e.key !== 'Tab') return;
      // Cycle through the menu button and the sheet only (the rest of the page is inert).
      var f = focusables();
      var i = f.indexOf(d.activeElement);
      e.preventDefault();
      f[(i < 0 ? 0 : i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false, false); });
    var wide = window.matchMedia('(min-width: 1024px)');
    var onWide = function () { if (wide.matches && header.classList.contains('is-open')) setOpen(false, false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
  }

  /* ─── Reveals (MOTION-06): one observer, once, stagger ≤ 6 per group ─── */
  var reveals = $$('[data-reveal]');
  if (hasIO && reveals.length) {
    var groups = new Map();
    reveals.forEach(function (el) {
      var p = el.parentElement;
      var n = groups.get(p) || 0;
      if (el.getAttribute('data-reveal') !== 'line') el.style.setProperty('--i', String(Math.min(n, 5)));
      groups.set(p, n + 1);
    });
    // Everything already on screen is shown at its final state (MOTION-05): one layout read at start-up.
    var vh = window.innerHeight;
    reveals.forEach(function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add('is-in'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { if (!el.classList.contains('is-in')) io.observe(el); });
    root.classList.add('reveal-ready');
  }

  /* ─── Despiece fallback (no scroll-driven animations) ─── */
  $$('[data-despiece]').forEach(function (fig) {
    var supports = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
    if (supports || !hasIO) { fig.classList.add('is-in'); return; }
    var o = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { fig.classList.add('is-in'); o.disconnect(); }
    }, { threshold: 0.3 });
    o.observe(fig);
  });

  /* ─── Compare slider (COMP-12) ─── */
  $$('[data-compare]').forEach(function (stage) {
    var range = $('input[type="range"]', stage);
    if (!range) return;
    var tpl = stage.getAttribute('data-valuetext') || '{n} %';
    var update = function () {
      stage.classList.remove('is-peek');
      stage.style.setProperty('--pos', range.value + '%');
      range.setAttribute('aria-valuetext', tpl.replace('{n}', range.value));
    };
    range.addEventListener('input', update);
    if (hasIO && !reduced) {
      var o = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        o.disconnect();
        if (reduced || range.value !== '50') return;
        stage.classList.add('is-peek');
        stage.addEventListener('animationend', function () { stage.classList.remove('is-peek'); }, { once: true });
      }, { threshold: 0.6 });
      o.observe(stage);
    }
  });

  /* ─── Calculator (COMP-16) ─── */
  $$('[data-calc]').forEach(function (w) {
    var steps = JSON.parse(w.getAttribute('data-steps') || '[]');
    var min = +w.getAttribute('data-min') || 1;
    var max = +w.getAttribute('data-max') || 20;
    var vat = +w.getAttribute('data-vat') || 0;
    var locale = w.getAttribute('data-locale') || 'es-ES';
    var perUnit = w.getAttribute('data-per-unit') || '';
    var href = w.getAttribute('data-href') || '';
    var anchor = w.getAttribute('data-anchor') || '';
    var input = $('input', w);
    var out = function (k) { return $('[data-out="' + k + '"]', w); };
    var money = function (n, dec) {
      var s = new Intl.NumberFormat(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: 'always' }).format(n);
      return locale === 'es-ES' ? s + ' €' : '€' + s;
    };
    var calc = function () {
      var n = Math.round(+input.value);
      if (!isFinite(n) || n < min) n = min;
      if (n > max) n = max;
      var unit = steps[0].unit;
      steps.forEach(function (s) { if (n >= s.from) unit = s.unit; });
      var total = unit * n;
      out('unit').textContent = money(unit, 0) + ' ' + perUnit;
      out('total').textContent = money(total, 0);
      var withVat = Math.round(total * (1 + vat) * 100) / 100;
      out('vat').textContent = money(withVat, withVat % 1 ? 2 : 0);
      out('cta').setAttribute('href', href + (href.indexOf('?') < 0 ? '?' : '&') + 'unidades=' + n + (anchor ? '#' + anchor : ''));
      return n;
    };
    $$('[data-step]', w).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = Math.min(max, Math.max(min, (Math.round(+input.value) || min) + +b.getAttribute('data-step')));
        input.value = String(n);
        calc();
      });
    });
    input.addEventListener('input', calc);
    input.addEventListener('change', function () { input.value = String(calc()); });
    w.hidden = false;
    calc();
  });

  /* ─── Lead form (COMP-18/19, A11Y-09) ─── */
  var params = new URLSearchParams(location.search);
  try {
    // First touch attribution kept for the session: UTM, referrer and landing page.
    var store = window.sessionStorage;
    if (!store.getItem('landing')) {
      store.setItem('landing', location.pathname + location.search);
      store.setItem('referrer', d.referrer && d.referrer.indexOf(location.host) < 0 ? d.referrer : '');
    }
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { if (params.get(k)) store.setItem(k, params.get(k)); });
  } catch (e) { store = null; }

  $$('[data-form]').forEach(function (form) {
    var get = function (k) { try { return store ? store.getItem(k) || '' : ''; } catch (e) { return ''; } };
    ['utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'landing'].forEach(function (k) {
      var f = form.elements[k];
      if (f) f.value = get(k) || (k === 'landing' ? location.pathname : k === 'referrer' ? d.referrer : '');
    });
    ['servicio', 'unidades'].forEach(function (k) {
      var v = params.get(k);
      var f = $('[data-preselect="' + k + '"]', form);
      if (!v || !f) return;
      if (f.tagName === 'SELECT') { if ($('option[value="' + CSS.escape(v) + '"]', f)) f.value = v; } else f.value = v.replace(/\D/g, '').slice(0, 3);
    });
    form.setAttribute('novalidate', '');

    var steps = $$('[data-step]', form).filter(function (el) { return el.tagName === 'FIELDSET'; });
    var progress = $('[data-form-progress]', form);
    var stepLabel = form.getAttribute('data-step-label') || '';
    var back = $('[data-back]', form);
    var status = $('[data-form-status]', form);
    var dirty = false;

    var errorEl = function (field) {
      var ids = (field.getAttribute('aria-describedby') || '').split(/\s+/);
      for (var i = 0; i < ids.length; i++) { var el = d.getElementById(ids[i]); if (el && el.hasAttribute('data-error')) return el; }
      var fs = field.closest('fieldset.field');
      return fs ? $('[data-error]', fs) : null;
    };
    var setError = function (field, msg) {
      var el = errorEl(field);
      var group = field.type === 'radio' ? $$('input[name="' + field.name + '"]', form) : [field];
      group.forEach(function (g) { if (msg) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid'); });
      if (el) { el.textContent = msg || ''; el.hidden = !msg; }
    };
    var m = function (field, k) { return form.getAttribute('data-msg-' + (k || field.getAttribute('data-m') || 'required')) || ''; };
    var check = function (field) {
      var msg = '';
      var v = (field.value || '').trim();
      if (field.type === 'radio') {
        if (field.required && !$('input[name="' + field.name + '"]:checked', form)) msg = m(field);
      } else if (field.type === 'checkbox') {
        if (field.required && !field.checked) msg = m(field);
      } else if (field.type === 'file') {
        var max = +field.getAttribute('data-max') || 0;
        if (max && field.files && field.files[0] && field.files[0].size > max) msg = m(field);
      } else if (field.required && !v) {
        msg = m(field, 'required');
      } else if (v && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        msg = m(field, 'email');
      } else if (v && field.type === 'url' && !/^https?:\/\/\S+\.\S+/.test(v)) {
        msg = m(field, 'url');
      }
      setError(field, msg);
      return !msg;
    };
    var validate = function (scope) {
      var first = null;
      var seen = {};
      $$('input, select, textarea', scope).forEach(function (f) {
        if (f.type === 'hidden' || f.name === 'bot-field') return;
        if (f.type === 'radio') { if (seen[f.name]) return; seen[f.name] = 1; }
        if (!check(f) && !first) first = f;
      });
      if (first) first.focus();
      return !first;
    };
    form.addEventListener('change', function (e) {
      var f = e.target;
      if (f.getAttribute('aria-invalid') === 'true' || f.type === 'file' || f.type === 'radio' || f.type === 'checkbox') check(f);
    });
    form.addEventListener('focusout', function (e) {
      var f = e.target;
      if (f.matches && f.matches('input[type="email"], input[type="url"]') && f.value) check(f);
    });

    var show = function (n) {
      steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
      if (progress) { progress.hidden = false; progress.textContent = stepLabel.replace('{n}', n); }
      if (back) back.hidden = n === 1;
    };
    if (steps.length === 2) {
      var nextNav = $('[data-step-nav]', steps[0]);
      if (nextNav) nextNav.hidden = false;
      show(1);
      var next = $('[data-next]', form);
      if (next) next.addEventListener('click', function () {
        if (!validate(steps[0])) return;
        show(2);
        var f = $('input:not([type="hidden"]), select, textarea', steps[1]);
        if (f) f.focus();
      });
      if (back) back.addEventListener('click', function () { show(1); var f = $('input, select', steps[0]); if (f) f.focus(); });
      steps[1].addEventListener('input', function () { dirty = true; });
    }

    // File input: show the name + a remove button (COMP-19).
    $$('.file', form).forEach(function (box) {
      var input = $('input[type="file"]', box);
      var name = $('[data-file-name]', box);
      var rm = $('[data-file-remove]', box);
      var initial = name ? name.textContent : '';
      var sync = function () {
        var f = input.files && input.files[0];
        box.classList.toggle('has-file', !!f);
        if (name) name.textContent = f ? f.name : initial;
        if (rm) rm.hidden = !f;
      };
      input.addEventListener('change', sync);
      if (rm) rm.addEventListener('click', function () { input.value = ''; sync(); setError(input, ''); input.focus(); });
    });

    window.addEventListener('beforeunload', function (e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = form.getAttribute('data-msg-unsaved') || '';
    });

    form.addEventListener('submit', function (e) {
      if (!validate(form)) {
        e.preventDefault();
        if (steps.length === 2) {
          var bad = $('[aria-invalid="true"]', form);
          var st = bad && bad.closest('fieldset[data-step]');
          if (st && st.hidden) { show(+st.getAttribute('data-step')); bad.focus(); }
        }
        if (status) status.textContent = form.getAttribute('data-msg-summary') || '';
        return;
      }
      dirty = false;
      if (status) status.textContent = '';
      var btn = $('[data-submit]', form);
      if (btn) {
        btn.setAttribute('aria-busy', 'true');
        btn.textContent = form.getAttribute('data-sending') || btn.textContent;
      }
    });
  });

  /* ─── Copy buttons: <button data-copy="#target"> (COMP-25) ─── */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = $(b.getAttribute('data-copy'));
      var live = $(b.getAttribute('data-copy-live') || '') || b;
      if (!t || !navigator.clipboard) return;
      navigator.clipboard.writeText(t.textContent.trim()).then(function () {
        live.textContent = b.getAttribute('data-copied') || live.textContent;
      }, function () {
        live.textContent = b.getAttribute('data-copy-failed') || live.textContent;
      });
    });
  });

  /* ─── Mobile action bar hides over the form and the footer (COMP-06) ─── */
  var bar = $('[data-bottom-bar]');
  if (bar && hasIO) {
    var targets = $$('.form-section, [data-footer]');
    var visible = new Set();
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
      bar.classList.toggle('is-hidden', visible.size > 0);
    });
    targets.forEach(function (t) { o.observe(t); });
  }
})();
