/* Tisztítlak — header state, mobile menu, scroll reveal */
(function () {
  'use strict';

  // --- sticky header hairline ---
  var hdr = document.getElementById('hdr');
  var onScroll = function () {
    hdr.classList.toggle('stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- mobile menu ---
  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mmenu');

  var setMenu = function (open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
    mmenu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  mmenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mmenu.hidden) setMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860 && !mmenu.hidden) setMenu(false);
  });

  // --- scroll reveal ---
  var items = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 5, 4) * 60) + 'ms';
    io.observe(el);
  });
})();
