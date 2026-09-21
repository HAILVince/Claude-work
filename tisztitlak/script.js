/* Tisztítlak — header state, mobile menu, particle field */
(function () {
  'use strict';

  var hd = document.getElementById('hd');
  var onScroll = function () { hd.classList.toggle('stuck', window.scrollY > 4); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- mobile menu ----
  var burger = document.getElementById('burger');
  var mm = document.getElementById('mm');

  var setMenu = function (open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
    mm.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) hd.classList.add('stuck'); else onScroll();
  };

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  mm.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mm.hidden) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && !mm.hidden) setMenu(false);
  });

  /* ---- particle field ------------------------------------------------
     A lattice of flat squares whose density falls away to the right:
     fabric before the machine, fabric after it. Deterministic, so the
     drawing is identical on every load and in every screenshot.         */
  var cv = document.getElementById('fieldCanvas');
  if (!cv || !cv.getContext) return;

  var NAVY = '#0B3D64', CYAN = '#29ABE2';

  var rand = function (i, j) {
    var n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };

  var draw = function () {
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);

    var g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);

    var step = w < 560 ? 10 : 14;
    var size = w < 560 ? 4 : 5.5;
    var cols = Math.ceil(w / step);
    var rows = Math.ceil(h / step);

    for (var i = 0; i < cols; i++) {
      var t = cols > 1 ? i / (cols - 1) : 0;
      var density = Math.pow(1 - t, 2.1);          // dense at the left, gone at the right
      for (var j = 0; j < rows; j++) {
        if (rand(i, j) > density) continue;
        g.fillStyle = rand(i + 97, j + 31) < 0.24 ? CYAN : NAVY;
        g.fillRect(i * step, j * step, size, size);
      }
    }
  };

  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(draw, 150);
  });
})();
