/* Heit Pince — menü, borlap, jelentkezés.

   A borlap a borok.txt fájlból jön, tehát évjáratváltáskor a pince írja át,
   nem a fejlesztő. Egy borászatnál ez az a tartalom, ami évente biztosan
   elavul, és pont ezért szokott évekig rossz maradni. */

import { parseList, joinNotes } from './assets/list-parse.js';

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); }
});

/* ---------- borlap ---------- */

const bl = document.querySelector('.bl');

function render(groups) {
  if (!groups.length) return;               /* üres vagy elrontott fájl: marad a besütött lista */

  const frag = document.createDocumentFragment();
  for (const g of groups) {
    const box = document.createElement('div');
    box.className = 'bl-g';

    const h = document.createElement('h3');
    h.textContent = g.title;
    box.append(h);

    const ul = document.createElement('ul');
    ul.className = 'bl-l';
    for (const it of g.items) {
      const li = document.createElement('li');

      const n = document.createElement('p');
      n.className = 'bl-n';
      n.textContent = it.name;
      li.append(n);

      if (it.fields.length) {
        const f = document.createElement('p');
        f.className = 'bl-f';
        f.textContent = it.fields.join(' · ');
        li.append(f);
      }
      ul.append(li);
    }
    box.append(ul);

    if (g.notes.length) {
      const note = document.createElement('p');
      note.className = 'bl-note';
      note.textContent = joinNotes(g.notes);
      box.append(note);
    }
    frag.append(box);
  }
  bl.replaceChildren(frag);
}

fetch('borok.txt', { cache: 'no-cache' })
  .then(r => (r.ok ? r.text() : ''))
  .then(t => render(parseList(t)))
  .catch(() => { /* nincs fájl vagy nincs háló: marad, ami a HTML-be van sütve */ });

/* ---------- űrlap ---------- */

const form = document.querySelector('#f');
const ok = document.querySelector('#ok');
const alkalom = document.querySelector('#f-mit');
const rowReszletek = document.querySelector('#row-reszletek');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MIN_FO = 10;
const MAX_FO = 45;

function fail(input, msg) {
  input.closest('.fld').classList.add('bad');
  const err = document.querySelector(`.err[data-for="${input.id}"]`);
  if (err) err.textContent = msg;
}
function clear(input) {
  input.closest('.fld').classList.remove('bad');
}

/* Aki csak bort venne, annak nincs se létszáma, se időpontja — azt a két
   kérdést ilyenkor nem tesszük fel. */
function applyAlkalom() {
  const vasarlas = alkalom.value === 'Bort szeretnék venni';
  rowReszletek.hidden = vasarlas;
  if (vasarlas) { clear(form.mikor); clear(form.letszam); }
}
alkalom.addEventListener('change', applyAlkalom);
applyAlkalom();

form.addEventListener('submit', e => {
  e.preventDefault();
  const { nev, elerhetoseg: el, mikor, letszam, uzenet } = form;
  [nev, el, mikor, letszam, uzenet].forEach(clear);
  ok.hidden = true;
  let bad = null;

  if (!nev.value.trim()) { fail(nev, 'Írja be a nevét, hogy tudjuk, kinek válaszoljunk.'); bad ||= nev; }

  const v = el.value.trim();
  const digits = (v.match(/\d/g) || []).length;
  if (!v) { fail(el, 'Elérhetőség nélkül nem tudunk visszajelezni.'); bad ||= el; }
  else if (!EMAIL.test(v) && digits < 7) { fail(el, 'Ez így nem tűnik e-mail-címnek vagy telefonszámnak.'); bad ||= el; }

  if (!rowReszletek.hidden) {
    if (!mikor.value.trim()) { fail(mikor, 'Írja meg, körülbelül mikorra gondolt.'); bad ||= mikor; }

    /* A létszám dönti el, hogy egyáltalán belefér-e a teraszra, ezért itt
       nem elég egy szó — szám kell, és a 10–45 fős sávba kell esnie. */
    const raw = letszam.value.trim();
    const n = parseInt(raw.replace(/\s/g, ''), 10);
    if (!raw) { fail(letszam, 'A létszám nélkül nem tudjuk, belefér-e a teraszra.'); bad ||= letszam; }
    else if (!Number.isFinite(n)) { fail(letszam, 'Írjon bele egy számot, például "18".'); bad ||= letszam; }
    else if (n < MIN_FO) { fail(letszam, `${MIN_FO} főtől tudunk társaságot fogadni. Kisebb létszámmal írjon az üzenetbe, és megnézzük, mit tehetünk.`); bad ||= letszam; }
    else if (n > MAX_FO) { fail(letszam, `Legfeljebb ${MAX_FO} főt tudunk fogadni a teraszon.`); bad ||= letszam; }
  }

  if (!uzenet.value.trim()) { fail(uzenet, 'Írjon pár mondatot, hogy tudjunk mire készülni.'); bad ||= uzenet; }

  if (bad) { bad.focus(); return; }

  form.reset();
  applyAlkalom();
  ok.hidden = false;
});

[...form.querySelectorAll('input[type="text"], textarea')].forEach(f =>
  f.addEventListener('input', () => clear(f))
);
