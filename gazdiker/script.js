/* Gazdi-Ker — open/closed state, mobile menu, reveal, contact form.
   No dependencies, no third-party requests. */
(function () {
  'use strict';

  /* ---------- opening hours ------------------------------------------ */
  /* index 0 = Sunday, matching Date#getDay(). Minutes since midnight. */
  var HOURS = [
    { open:  9 * 60,           close: 12 * 60,      label: '9:00 – 12:00' },   // V
    { open:  7 * 60 + 30,      close: 17 * 60,      label: '7:30 – 17:00' },   // H
    { open:  7 * 60 + 30,      close: 17 * 60,      label: '7:30 – 17:00' },   // K
    { open:  7 * 60 + 30,      close: 17 * 60,      label: '7:30 – 17:00' },   // Sze
    { open:  7 * 60 + 30,      close: 17 * 60,      label: '7:30 – 17:00' },   // Cs
    { open:  7 * 60 + 30,      close: 17 * 60,      label: '7:30 – 17:00' },   // P
    { open:  7 * 60 + 30,      close: 13 * 60,      label: '7:30 – 13:00' }    // Szo
  ];
  var DAY_NAME = ['vasárnap', 'hétfőn', 'kedden', 'szerdán', 'csütörtökön', 'pénteken', 'szombaton'];

  function hhmm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + ':' + (m < 10 ? '0' + m : m);
  }

  function state() {
    var now = new Date();
    var d = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = HOURS[d];

    if (mins < today.open) {
      return { open: false, title: 'Most zárva', sub: 'Ma ' + hhmm(today.open) + '-kor nyitunk.' };
    }
    if (mins < today.close) {
      return { open: true, title: 'Most nyitva', sub: hhmm(today.close) + '-ig tartunk nyitva.' };
    }
    /* closed for today — find the next day that opens */
    var next = (d + 1) % 7;
    return {
      open: false,
      title: 'Most zárva',
      sub: 'Legközelebb ' + DAY_NAME[next] + ' ' + hhmm(HOURS[next].open) + '-kor nyitunk.'
    };
  }

  function paint() {
    var s = state();
    var d = new Date().getDay();

    var dot = document.getElementById('dot');
    var t = document.getElementById('status-t');
    var sub = document.getElementById('status-s');
    if (dot) { dot.className = 'dot ' + (s.open ? 'on' : 'off'); }
    if (t) { t.textContent = s.title; }
    if (sub) { sub.textContent = s.sub; }

    /* highlight today in the hero card */
    Array.prototype.forEach.call(document.querySelectorAll('.hc-row'), function (row) {
      var days = (row.getAttribute('data-day') || '').split(' ');
      row.classList.toggle('now', days.indexOf(String(d)) !== -1);
    });

    /* highlight today in the week table */
    Array.prototype.forEach.call(document.querySelectorAll('.htab tr'), function (tr) {
      tr.classList.toggle('now', tr.getAttribute('data-day') === String(d));
    });

    var ct = document.getElementById('ct-today');
    if (ct) { ct.textContent = HOURS[d].label + ' — ' + s.title.toLowerCase(); }
  }

  paint();
  setInterval(paint, 60000);

  var yr = document.getElementById('yr');
  if (yr) { yr.textContent = String(new Date().getFullYear()); }

  /* ---------- mobile menu -------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---------- reveal on scroll --------------------------------------- */
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------- contact form ------------------------------------------- */
  var form = document.getElementById('form');
  if (!form) { return; }

  var ok = document.getElementById('ok');

  function looksLikeContact(v) {
    var digits = v.replace(/\D/g, '');
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || digits.length >= 7;
  }

  function check(id, test) {
    var input = document.getElementById(id);
    var field = input.closest('.f');
    var good = test(input.value.trim());
    field.classList.toggle('bad', !good);
    input.setAttribute('aria-invalid', good ? 'false' : 'true');
    return good;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var a = check('f-name', function (v) { return v.length >= 2; });
    var b = check('f-mail', function (v) { return looksLikeContact(v); });
    var c = check('f-msg',  function (v) { return v.length >= 5; });

    if (!(a && b && c)) {
      var bad = form.querySelector('.f.bad input, .f.bad textarea');
      if (bad) { bad.focus(); }
      if (ok) { ok.hidden = true; }
      return;
    }

    /* Demo: nothing is sent anywhere. On the live site this posts to the
       shop's e-mail address. */
    form.reset();
    if (ok) { ok.hidden = false; }
  });

  ['f-name', 'f-mail', 'f-msg'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) { return; }
    el.addEventListener('input', function () {
      var field = el.closest('.f');
      if (field.classList.contains('bad')) { field.classList.remove('bad'); }
    });
  });
})();
