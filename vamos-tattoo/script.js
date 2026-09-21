/* Vamos Tattoo — header state, mobile menu, booking form */
(function () {
  'use strict';

  /* ---------- sticky header ---------- */
  var hd = document.getElementById('hd');
  var onScroll = function () { hd.classList.toggle('stuck', window.scrollY > 4); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
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
    if (window.innerWidth > 860 && !mm.hidden) setMenu(false);
  });

  /* ---------- booking form ----------------------------------------------
     Posts to Web3Forms, which forwards the submission straight to
     tattoo.vamos@gmail.com. No server, no database, nothing to maintain.
     Until a real access key is set in data-access-key the form runs in
     demo mode and says so plainly — it never claims a mail was sent.     */
  var form = document.getElementById('bookForm');
  if (!form) return;

  var msg = document.getElementById('formMsg');
  var submit = document.getElementById('bookSubmit');
  var KEY = form.getAttribute('data-access-key');
  var DEMO = !KEY || KEY === 'WEB3FORMS_ACCESS_KEY';

  var say = function (state, title, body) {
    msg.setAttribute('data-s', state);
    msg.innerHTML = '';
    var b = document.createElement('b');
    b.textContent = title;
    msg.appendChild(b);
    msg.appendChild(document.createTextNode(body));
  };

  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };

  var validate = function () {
    var bad = [];
    [['f-name', 'Add meg a neved.'],
     ['f-idea', 'Írd le, mit szeretnél.']].forEach(function (p) {
      var el = document.getElementById(p[0]);
      var empty = !el.value.trim();
      el.setAttribute('aria-invalid', String(empty));
      if (empty) bad.push([el, p[1]]);
    });

    var mail = document.getElementById('f-email');
    var mailBad = !emailOk(mail.value.trim());
    mail.setAttribute('aria-invalid', String(mailBad));
    if (mailBad) bad.push([mail, 'Adj meg egy érvényes e-mail címet.']);

    var gdpr = document.getElementById('f-gdpr');
    if (!gdpr.checked) bad.push([gdpr, 'Az elküldéshez el kell fogadnod az adatkezelést.']);

    return bad;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.querySelector('[name="botcheck"]').value) return;   // honeypot

    var bad = validate();
    if (bad.length) {
      say('err', 'Hiányzik valami', bad[0][1]);
      bad[0][0].focus();
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== 'botcheck') data[k] = v; });

    if (DEMO) {
      say('ok', 'Demó mód',
        'Így néz ki a visszajelzés elküldés után. Éles üzemben ez az űrlap a ' +
        'tattoo.vamos@gmail.com címre küldi a kérést — a kulcs beállítása után működik.');
      form.reset();
      return;
    }

    data.access_key = KEY;
    submit.disabled = true;
    var label = submit.textContent;
    submit.textContent = 'Küldés…';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r.success) throw new Error(r.message || 'ismeretlen hiba');
        say('ok', 'Megkaptam',
          'Köszönöm a megkeresést! Általában egy-két napon belül válaszolok a megadott e-mail címre.');
        form.reset();
        ['f-name', 'f-email', 'f-idea'].forEach(function (id) {
          document.getElementById(id).removeAttribute('aria-invalid');
        });
      })
      .catch(function () {
        say('err', 'Nem sikerült elküldeni',
          'Kérlek próbáld újra, vagy írj közvetlenül: tattoo.vamos@gmail.com');
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = label;
      });
  });
})();
