/* Residencial Benahavís · demo inmersiva (v0.1). Sin dependencias: se abre con doble clic en index.html.
 * Datos: data.js (generado por generador/exportar_web.py). Imágenes: ../imagenes/. Rutas con hash: #/  #/casa/5  #/casa/5/plano/pb  #/casa/5/estancia/sal
 */
(function () {
  'use strict';
  var D = window.DATOS, P = D.proyecto;
  var $ = function (id) { return document.getElementById(id); };
  var IMG = '../imagenes/', RW = IMG + 'renders_ia_web/';
  var NIVELES = D.niveles, CASAS = D.casas;
  var ORDEN = ['sot', 'pb', 'p1', 'az'];
  var GALERIA = [['00_fachada_calle', 'Fachada a calle'], ['01_jardin_piscina', 'Jardín y piscina'], ['02_azotea', 'Azotea'], ['03_salon_cocina', 'Salón y cocina'],
    ['04_dormitorio_principal', 'Dormitorio principal'], ['05_bano_suite', 'Baño de la suite'], ['06_nucleo_ascensor', 'Escalera y ascensor'], ['07_sotano_bienestar', 'Sótano de bienestar'],
    ['08_acceso', 'Acceso controlado'], ['09_parque', 'Parque central'], ['10_aerea', 'Vista aérea'], ['11_jardin_noche', 'Jardín de noche']];
  var st = { casa: null, nivel: 'pb', est: null, noche: false, filtro: null, poi: false, desde: 'p2' };

  /* ------------------------------------------------------------ utilidades */
  function el(tag, attrs, parent) { var e = document.createElement(tag); for (var k in (attrs || {})) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); } if (parent) parent.appendChild(e); return e; }
  function eur(n) { return n.toLocaleString('es-ES') + ' €'; }
  function m2(n) { return String(n).replace('.', ',') + ' m²'; }
  function casaPorNum(n) { return CASAS.filter(function (c) { return c.numero === +n; })[0]; }
  function nivelPorId(id) { return NIVELES.filter(function (n) { return n.id === id; })[0]; }
  function estadoDe(c) { return P.estados[c.estado]; }
  function insignia(node, c) { var e = estadoDe(c); node.innerHTML = '<i style="background:' + e.color + '"></i>' + e.nombre; }
  function aviso(txt) { var a = $('aviso'); a.textContent = txt; a.hidden = false; clearTimeout(aviso._t); aviso._t = setTimeout(function () { a.hidden = true; }, 2600); }
  function precioTxt(c) { return c.estado === 'vendida' ? 'Vendida' : eur(c.precio_eur) + (c.precio_es_demo ? '' : ''); }
  function setImg(img, srcs, fin) {            /* prueba varias rutas en orden */
    var i = 0; img.onerror = function () { i++; if (i < srcs.length) img.src = srcs[i]; else if (fin) fin(); };
    img.onload = function () { img.classList.toggle('vertical', img.naturalHeight > img.naturalWidth); };
    img.src = srcs[0];
  }

  /* ------------------------------------------------------------ navegación por hash */
  function ir(h) { if (location.hash === h) pintar(); else location.hash = h; }
  function ruta() {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    if (p[0] === 'casa' && p[1]) {
      var n = +p[1];
      if (p[2] === 'plano') return { p: 3, n: n, nivel: p[3] || 'pb' };
      if (p[2] === 'estancia') return { p: 4, n: n, est: p[3] };
      return { p: 2, n: n, nivel: p[3] };
    }
    return { p: 1 };
  }
  window.addEventListener('hashchange', pintar);

  /* ------------------------------------------------------------ pintar */
  function pintar() {
    var r = ruta();
    if (r.n) { var c = casaPorNum(r.n); if (!c) { r = { p: 1 }; } else st.casa = c; }
    if (r.nivel && nivelPorId(r.nivel)) st.nivel = r.nivel;
    if (r.est) st.est = r.est;
    ['p1', 'p2', 'p3', 'p4'].forEach(function (id, i) { $(id).hidden = (i + 1 !== r.p); });
    $('volver').hidden = r.p === 1;
    $('cab').style.opacity = r.p === 4 ? '.92' : '1';
    if (r.p === 1) pintar1();
    if (r.p === 2) pintar2();
    if (r.p === 3) pintar3();
    if (r.p === 4) pintar4();
    document.title = (r.p === 1 ? '' : 'Casa ' + (st.casa ? st.casa.numero : '') + ' · ') + P.nombre;
  }

  /* ------------------------------------------------------------ 1. masterplan */
  var hayNoche = false;
  function inicial1() {
    var dia = $('aerea-dia'); setImg(dia, [RW + '10_aerea.jpg']);
    var nn = new Image(); nn.onload = function () { $('aerea-noche').src = nn.src; $('aerea-dia').classList.add('hay-noche'); hayNoche = true; document.body.classList.remove('sin-noche'); };
    nn.onerror = function () { document.body.classList.add('sin-noche'); }; nn.src = RW + '12_aerea_noche.jpg';
    var box = $('pins1');
    CASAS.forEach(function (c) {
      if (!c.pin_aerea) return;
      var b = el('button', { 'class': 'pin ' + c.estado, text: c.numero, 'data-n': c.numero, 'aria-label': 'Casa ' + c.numero + ', ' + estadoDe(c).nombre }, box);
      b.style.left = (c.pin_aerea.x * 100) + '%'; b.style.top = (c.pin_aerea.y * 100) + '%';
      b.addEventListener('click', function () { ir('#/casa/' + c.numero); });
      b.addEventListener('mouseenter', function () { tarjeta(c, b); });
      b.addEventListener('focus', function () { tarjeta(c, b); });
      b.addEventListener('mouseleave', ocultarTarjeta); b.addEventListener('blur', ocultarTarjeta);
    });
    P.amenidades.forEach(function (a) {
      if (!a.pin_aerea || a.pin_aerea.y > 0.98) return;
      var e = el('div', { 'class': 'amen', text: a.nombre, title: a.descripcion }, box);
      e.style.left = (a.pin_aerea.x * 100) + '%'; e.style.top = (a.pin_aerea.y * 100) + '%';
    });
    var po = $('pois');
    P.puntos_interes.forEach(function (p) {
      var e = el('div', { 'class': 'poi', text: p.nombre + ' · ' + p.detalle }, po);
      e.style.left = (p.ancla_aerea.x * 100) + '%'; e.style.top = (p.ancla_aerea.y * 100) + '%';
    });
  }
  function tarjeta(c, pin) {
    var t = $('tarjeta'), e = estadoDe(c);
    t.innerHTML = '<b>Casa ' + c.numero + '</b> · <span style="color:' + e.color + '">' + e.nombre + '</span><div class="p">' + (c.estado === 'vendida' ? '' : eur(c.precio_eur)) + '</div><div class="suave pequeno">' + m2(c.construido_m2) + ' · ' + c.dormitorios + ' dormitorios · ' + c.fila + '</div>';
    t.hidden = false;
    var r = pin.getBoundingClientRect(), w = 200, x = r.right + 12; if (x + w > innerWidth - 8) x = r.left - w - 12;
    t.style.left = Math.max(8, x) + 'px'; t.style.top = Math.max(60, r.top - 14) + 'px';
  }
  function ocultarTarjeta() { $('tarjeta').hidden = true; }
  function pintar1() {
    var f = $('filtros'); f.innerHTML = '';
    ['disponible', 'reservada', 'vendida'].forEach(function (k) {
      var n = CASAS.filter(function (c) { return c.estado === k; }).length;
      var b = el('button', { 'class': 'ghost' + (st.filtro === k ? ' sel' : '') }, f);
      b.innerHTML = '<span class="pt" style="background:' + P.estados[k].color + '"></span>' + P.estados[k].nombre + ' · ' + n;
      b.addEventListener('click', function () { st.filtro = st.filtro === k ? null : k; pintar1(); });
    });
    Array.prototype.forEach.call($('pins1').querySelectorAll('.pin'), function (p) { var c = casaPorNum(p.getAttribute('data-n')); p.classList.toggle('apagado', !!st.filtro && c.estado !== st.filtro); });
    $('poi').classList.toggle('sel', st.poi); document.body.classList.toggle('con-poi', st.poi);
  }

  /* ------------------------------------------------------------ 2. casa con corte */
  var CEN = { f: 62, sw: 36, sh: 20.25, alto: 66, cx: 4.0, cy: 10.5 };   /* cámara cenital de blender_guias.py (c_*) */
  function cenital(nv, x, y, espejo) {
    var d = CEN.alto - (nv.cota_m + 0.2 + 1.0), xx = espejo ? 8 - x : x;
    return [0.5 + (CEN.f * (y - CEN.cy) / d) / CEN.sw, 0.5 + (CEN.f * (xx - CEN.cx) / d) / CEN.sh];
  }
  function botonesNivel(cont, fn) {
    cont.innerHTML = '';
    NIVELES.forEach(function (n) {
      var b = el('button', { 'class': 'ghost' + (st.nivel === n.id ? ' sel' : ''), text: n.nombre }, cont);
      b.addEventListener('click', function () { fn(n.id); });
    });
  }
  function pintar2() {
    var c = st.casa, nv = nivelPorId(st.nivel);
    $('c-nombre').textContent = 'Casa ' + c.numero; insignia($('c-estado'), c);
    $('c-datos').textContent = m2(c.construido_m2) + ' · ' + c.dormitorios + ' dormitorios · ' + c.plantas + ' plantas';
    $('c-precio').textContent = precioTxt(c);
    var ax = $('axo'); ax.innerHTML = ''; ax.style.transform = c.espejo ? 'scaleX(-1)' : '';
    ORDEN.forEach(function (k) {
      var i = el('img', { alt: '', draggable: 'false', 'class': k === st.nivel ? 'sel' : 'otro' }, ax); i.src = IMG + 'axonometria/axo_' + k + '.png'; i.onerror = function () { i.style.display = 'none'; };
    });
    var cor = $('corte'); cor.classList.toggle('flip', c.espejo);
    setImg(cor, [IMG + 'cenitales/casa_corte_' + st.nivel + '.jpg', IMG + 'guias_blender/casa4_corte_' + (st.nivel) + '.png', RW + '10_aerea.jpg']);
    botonesNivel($('niv2'), function (id) { ir('#/casa/' + c.numero + '/n/' + id); });
    var box = $('pins2'); box.innerHTML = '';
    nv.estancias.forEach(function (e) {
      if (!e.render) return;
      var q = cenital(nv, e.pin[0], e.pin[1], c.espejo);
      var b = el('button', { 'class': 'pin-cam', 'aria-label': 'Ver ' + e.nombre }, box);
      b.innerHTML = '<svg class="i"><use href="#i-cam"/></svg><span class="rot">' + e.nombre + '</span>';
      b.style.left = (q[0] * 100) + '%'; b.style.top = (q[1] * 100) + '%';
      b.addEventListener('click', function () { st.desde = 'p2'; ir('#/casa/' + c.numero + '/estancia/' + e.id); });
    });
  }

  /* ------------------------------------------------------------ 3. plantas y ficha */
  function svgNivel(id, cont, opts) {
    var nv = nivelPorId(id); cont.innerHTML = nv.svg_inline;
    var svg = cont.querySelector('svg'); svg.removeAttribute('width'); svg.removeAttribute('height');
    cont.classList.toggle('espejo', !!(opts && opts.espejo));
    return svg;
  }
  function etiquetas(svg) {
    var NS = 'http://www.w3.org/2000/svg';
    Array.prototype.forEach.call(svg.querySelectorAll('.estancia'), function (p) {
      var cx = +p.getAttribute('data-cx'), cy = +p.getAttribute('data-cy'), area = p.getAttribute('data-area'), nombre = p.getAttribute('data-nombre');
      var t = document.createElementNS(NS, 'text'); t.setAttribute('class', 'et'); t.setAttribute('x', cx); t.setAttribute('y', cy - 0.25); t.textContent = p.getAttribute('data-corto') || nombre; svg.appendChild(t);
      var a = document.createElementNS(NS, 'text'); a.setAttribute('class', 'et ar'); a.setAttribute('x', cx); a.setAttribute('y', cy + 0.55); a.textContent = String(area).replace('.', ',') + ' m²'; svg.appendChild(a);
    });
  }
  function pintar3() {
    var c = st.casa;
    setImg($('fondo3'), [IMG + 'cenitales/casa_corte_' + st.nivel + '.jpg', IMG + 'guias_blender/casa4_corte_' + st.nivel + '.png', RW + '10_aerea.jpg']);
    botonesNivel($('niv3'), function (id) { ir('#/casa/' + c.numero + '/plano/' + id); });
    var caja = $('plano'), svg = svgNivel(st.nivel, caja, { espejo: c.espejo });
    etiquetas(svg);
    Array.prototype.forEach.call(svg.querySelectorAll('.estancia'), function (p) {
      var id = p.getAttribute('data-id'), r = p.getAttribute('data-render');
      p.classList.toggle('sel', st.est === id);
      p.addEventListener('mouseenter', function () { $('plano-pie').textContent = p.getAttribute('data-nombre') + ' · ' + String(p.getAttribute('data-area')).replace('.', ',') + ' m²' + (r ? ' · pulsa para ver el render' : ''); });
      p.addEventListener('mouseleave', function () { $('plano-pie').textContent = 'Toca una estancia para ver su render'; });
      if (r) p.addEventListener('click', function () { st.desde = 'p3'; ir('#/casa/' + c.numero + '/estancia/' + id); });
    });
    $('f-nombre').textContent = 'Casa ' + c.numero + ' · ' + nivelPorId(st.nivel).nombre; insignia($('f-estado'), c);
    $('f-precio').textContent = precioTxt(c);
    var d = $('f-datos'); d.innerHTML = '';
    [['Construido', m2(c.construido_m2)], ['Superficie útil', m2(c.util_m2)], ['Parcela', m2(c.parcela_m2)], ['Solárium', m2(c.solarium_m2)],
      ['Dormitorios y baños', c.dormitorios + ' y ' + c.banos + ' + aseo'], ['Plantas', c.plantas + ' (sótano, PB, P1, azotea)'], ['Garaje', c.garaje_plazas + ' plazas'],
      ['Extras', 'Piscina, jacuzzi y ascensor']].forEach(function (r) { var f = el('div', {}, d); el('dt', { text: r[0] }, f); el('dd', { text: r[1] }, f); });
    $('ag-nombre').textContent = P.agente; $('ag-resp').textContent = P.respuesta;
  }

  /* ------------------------------------------------------------ 4. estancia */
  function habitaciones(c) {
    var out = [];
    NIVELES.forEach(function (n) { n.estancias.forEach(function (e) { if (e.render) out.push({ nivel: n, e: e }); }); });
    return out;
  }
  function pintar4() {
    var c = st.casa, lista = habitaciones(c), cur = lista.filter(function (h) { return h.e.id === st.est; })[0] || lista[0];
    st.est = cur.e.id; st.nivel = cur.nivel.id;
    $('e-nombre').textContent = cur.e.nombre; $('e-sub').textContent = 'Casa ' + c.numero + ' · ' + cur.nivel.nombre;
    var url = RW + cur.e.render + '.jpg', img = $('est-img'); img.alt = cur.e.nombre; setImg(img, [url]);
    $('esc4').style.setProperty('--bg', 'url(' + url + ')');
    var m = $('miniaturas'); m.innerHTML = '';
    lista.forEach(function (h) {
      var b = el('button', { 'class': 'ghost' + (h.e.id === cur.e.id ? ' sel' : ''), text: h.e.nombre }, m);
      b.addEventListener('click', function () { ir('#/casa/' + c.numero + '/estancia/' + h.e.id); });
    });
    var mini = $('mini'), svg = svgNivel(cur.nivel.id, mini, { espejo: c.espejo });
    mini.classList.toggle('espejo', c.espejo);
    Array.prototype.forEach.call(svg.querySelectorAll('.estancia'), function (p) { p.classList.toggle('sel', p.getAttribute('data-id') === cur.e.id); });
    var NS = 'http://www.w3.org/2000/svg', cam = document.createElementNS(NS, 'circle');
    cam.setAttribute('class', 'cam'); cam.setAttribute('cx', cur.e.pin[1]); cam.setAttribute('cy', cur.e.pin[0]); cam.setAttribute('r', 0.55); svg.appendChild(cam);
  }

  /* ------------------------------------------------------------ galería y llamada */
  function galeria() {
    var g = $('lb-grid'); g.innerHTML = '';
    GALERIA.forEach(function (it) {
      var f = el('figure', {}, g); var i = el('img', { alt: it[1], loading: 'lazy' }, f); i.src = RW + it[0] + '.jpg'; el('figcaption', { text: it[1] }, f);
      f.addEventListener('click', function () { f.classList.toggle('grande'); if (f.classList.contains('grande')) f.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
    });
    $('lightbox').hidden = false;
  }
  /* Conecta aquí tu CRM / WhatsApp / correo. Debe devolver una promesa. */
  function enviarSolicitud(datos) { console.info('Solicitud de llamada (demo):', datos); return Promise.resolve({ ok: true }); }
  function abrirLlamada() { $('modal').hidden = false; setTimeout(function () { $('m-nombre').focus(); }, 30); }
  function cerrarModales() { $('modal').hidden = true; $('lightbox').hidden = true; }

  /* ------------------------------------------------------------ eventos globales */
  $('volver').addEventListener('click', function () {
    var r = ruta(); if (r.p === 2) ir('#/'); else if (r.p === 3) ir('#/casa/' + r.n); else if (r.p === 4) ir(st.desde === 'p3' ? '#/casa/' + r.n + '/plano/' + st.nivel : '#/casa/' + r.n + '/n/' + st.nivel);
  });
  $('cerrar').addEventListener('click', function () { var r = ruta(); ir('#/casa/' + r.n + '/n/' + st.nivel); });
  $('dianoche').addEventListener('click', function () { st.noche = !st.noche; document.body.classList.toggle('noche', st.noche); $('dn-icono').setAttribute('href', st.noche ? '#i-luna' : '#i-sol'); });
  $('poi').addEventListener('click', function () { st.poi = !st.poi; pintar1(); });
  $('ver-plano').addEventListener('click', function () { ir('#/casa/' + st.casa.numero + '/plano/' + st.nivel); });
  $('ver-est').addEventListener('click', function () { ir('#/casa/' + st.casa.numero + '/n/' + st.nivel); });
  $('galeria').addEventListener('click', galeria); $('galeria2').addEventListener('click', galeria);
  $('llamada').addEventListener('click', abrirLlamada);
  $('f-llamada').addEventListener('click', function () {
    var t = $('f-tel').value.trim(); if (t.replace(/\D/g, '').length < 7) { $('f-tel').focus(); aviso('Escribe un teléfono válido'); return; }
    enviarSolicitud({ casa: st.casa.numero, telefono: t }).then(function () { aviso('Solicitud enviada. ' + P.respuesta); $('f-tel').value = ''; });
  });
  $('m-enviar').addEventListener('click', function () {
    var t = $('m-tel').value.trim(); if (t.replace(/\D/g, '').length < 7) { $('m-tel').focus(); aviso('Escribe un teléfono válido'); return; }
    enviarSolicitud({ nombre: $('m-nombre').value.trim(), telefono: t, casa: st.casa ? st.casa.numero : null }).then(function () { cerrarModales(); aviso('Solicitud enviada. ' + P.respuesta); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-cerrar]'), function (b) { b.addEventListener('click', cerrarModales); });
  ['modal', 'lightbox'].forEach(function (id) { $(id).addEventListener('click', function (e) { if (e.target === $(id)) cerrarModales(); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!$('modal').hidden || !$('lightbox').hidden) cerrarModales(); else if (!$('volver').hidden) $('volver').click(); }
  });

  /* ------------------------------------------------------------ arranque */
  $('marca-nombre').textContent = P.nombre; $('marca-sub').textContent = 'Comunidad privada · ' + P.cifras.viviendas + ' viviendas';
  $('tel-txt').textContent = P.telefono; $('tel').setAttribute('href', 'tel:' + P.telefono.replace(/\s/g, ''));
  inicial1(); pintar();
})();
