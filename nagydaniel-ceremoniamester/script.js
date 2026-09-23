/* Nagy Dániel — menü, szabad időpontok, jelentkezési űrlap.

   Két dolog van itt, ami nem díszítés. Az egyik, hogy a szabad időpontok az
   idopontok.txt fájlból jönnek, tehát Dani írja át őket, nem a fejlesztő. A
   másik, hogy egy szabad dátumra kattintva az űrlap már ki van töltve — a
   pár nem gépeli be újra, amit az imént elolvasott. */

import { parseList, isTaken, joinNotes } from './assets/list-parse.js';

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); }
});

/* ---------- szabad időpontok ---------- */

const cal = document.querySelector('#cal');
const form = document.querySelector('#f');
const datum = document.querySelector('#f-datum');

/* A dátum a hónap nevével együtt kerül az űrlapba: az „19." önmagában
   semmit nem mond annak, aki majd elolvassa a levelet. */
function fullDate(month, day) {
  const year = (month.match(/\b(20\d{2})\b/) || [])[1];
  const clean = day.replace(/\s+/g, ' ').trim();
  return year && !clean.includes(year) ? `${year}. ${clean}` : clean;
}

function render(groups) {
  if (!groups.length) return;                /* üres vagy elrontott fájl: marad a besütött lista */

  const frag = document.createDocumentFragment();

  for (const g of groups) {
    const box = document.createElement('div');
    box.className = 'cal-m';

    const h = document.createElement('h3');
    h.className = 'cal-h';
    h.textContent = g.title;
    box.append(h);

    const ul = document.createElement('ul');
    ul.className = 'cal-l';

    for (const it of g.items) {
      const li = document.createElement('li');

      if (isTaken(it.value)) {
        const row = document.createElement('span');
        row.className = 'cal-x';
        const n = document.createElement('span');
        n.className = 'cal-n-d';
        n.textContent = it.name;
        const s = document.createElement('span');
        s.className = 'cal-s';
        s.textContent = it.value;
        row.append(n, s);
        li.append(row);
      } else {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cal-d';
        b.dataset.date = fullDate(g.title, it.name);
        const n = document.createElement('span');
        n.textContent = it.name;
        const s = document.createElement('span');
        s.className = 'cal-s';
        s.textContent = it.value;
        b.append(n, s);
        b.setAttribute('aria-label', `${b.dataset.date} — ${it.value}, jelentkezés erre a napra`);
        li.append(b);
      }
      ul.append(li);
    }
    box.append(ul);

    if (g.notes.length) {
      const note = document.createElement('p');
      note.className = 'cal-note';
      note.textContent = joinNotes(g.notes);
      box.append(note);
    }
    frag.append(box);
  }

  cal.replaceChildren(frag);
}

cal.addEventListener('click', e => {
  const b = e.target.closest('.cal-d');
  if (!b) return;
  datum.value = b.dataset.date;
  datum.closest('.fld').classList.remove('bad');
  document.querySelector('#kapcsolat').scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  /* A görgetés után kérjük a fókuszt, különben a böngésző visszaugrik. */
  setTimeout(() => form.nev.focus({ preventScroll: true }), smooth ? 420 : 0);
});

fetch('idopontok.txt', { cache: 'no-cache' })
  .then(r => (r.ok ? r.text() : ''))
  .then(t => render(parseList(t)))
  .catch(() => { /* nincs fájl vagy nincs háló: marad, ami a HTML-be van sütve */ });

/* ---------- űrlap ---------- */

const ok = document.querySelector('#ok');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fail(input, msg) {
  input.closest('.fld').classList.add('bad');
  const err = document.querySelector(`.err[data-for="${input.id}"]`);
  if (err) err.textContent = msg;
}
function clear(input) {
  input.closest('.fld').classList.remove('bad');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const { nev, elerhetoseg: el, datum: dt, uzenet } = form;
  [nev, el, dt, uzenet].forEach(clear);
  ok.hidden = true;
  let bad = null;

  if (!nev.value.trim()) { fail(nev, 'Írjátok be a neveteket, hogy tudjam, kihez szóljak.'); bad ||= nev; }

  const v = el.value.trim();
  const digits = (v.match(/\d/g) || []).length;
  if (!v) { fail(el, 'Elérhetőség nélkül nem tudok visszajelezni.'); bad ||= el; }
  else if (!EMAIL.test(v) && digits < 7) { fail(el, 'Ez így nem tűnik e-mail-címnek vagy telefonszámnak.'); bad ||= el; }

  /* A dátum nélkül a levélre nem lehet válaszolni, mert az első kérdés
     úgyis az lenne, hogy mikor. */
  if (!dt.value.trim()) { fail(dt, 'Az esküvő napja nélkül nem tudom megnézni, szabad vagyok-e.'); bad ||= dt; }

  if (!uzenet.value.trim()) { fail(uzenet, 'Írjatok pár mondatot arról, milyen napot képzeltek el.'); bad ||= uzenet; }

  if (bad) { bad.focus(); return; }

  form.reset();
  ok.hidden = false;
});

[...form.querySelectorAll('input[type="text"], textarea')].forEach(f =>
  f.addEventListener('input', () => clear(f))
);
