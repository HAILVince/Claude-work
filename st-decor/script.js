/* ST Design Decor — menü, árlista, ajánlatkérő űrlap.

   Két dolog van itt, ami nem díszítés. Az egyik, hogy az árak az arak.txt
   fájlból jönnek, tehát Tímea írja át őket, nem a fejlesztő — anyagár
   változik, az ár is változik, és ahhoz nem kell engem elérnie. A másik,
   hogy a mostani oldalán „Visszahívást kérek" gomb van: ha valaki inkább
   telefont szeretne, az űrlap ezt kérdezi meg, nem erőlteti az e-mailt. */

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

/* ---------- árak ---------- */

const ar = document.querySelector('.ar');

/* Egy mondat hosszú ár nem fér el egy sorban telefonon; a hosszabb értékek
   tördelhetők, a rövidek nem. 14 karakter a határ, mert a „30 000 Ft/m²-től"
   még belefér, a „kérésre, egyeztetés után” már nem. */
const WRAP_AT = 20;

function render(groups) {
  if (!groups.length) return;               /* üres vagy elrontott fájl: marad a besütött lista */

  const frag = document.createDocumentFragment();
  for (const g of groups) {
    const box = document.createElement('div');
    box.className = 'ar-g';

    const h = document.createElement('h3');
    h.textContent = g.title;
    box.append(h);

    const ul = document.createElement('ul');
    ul.className = 'ar-l';
    for (const it of g.items) {
      const li = document.createElement('li');

      const n = document.createElement('span');
      n.className = 'ar-n-t';
      n.textContent = it.name;

      const dot = document.createElement('span');
      dot.className = 'ar-dot';
      dot.setAttribute('aria-hidden', 'true');

      const p = document.createElement('span');
      p.className = it.value.length > WRAP_AT ? 'ar-p wrap' : 'ar-p';
      p.textContent = it.value;

      li.append(n, dot, p);
      ul.append(li);
    }
    box.append(ul);

    if (g.notes.length) {
      const note = document.createElement('p');
      note.className = 'ar-note';
      note.textContent = joinNotes(g.notes);
      box.append(note);
    }
    frag.append(box);
  }
  ar.replaceChildren(frag);
}

fetch('arak.txt', { cache: 'no-cache' })
  .then(r => (r.ok ? r.text() : ''))
  .then(t => render(parseList(t)))
  .catch(() => { /* nincs fájl vagy nincs háló: marad, ami a HTML-be van sütve */ });

/* ---------- űrlap ---------- */

const form = document.querySelector('#f');
const ok = document.querySelector('#ok');
const hivas = document.querySelector('#f-hivas');
const fldMikor = document.querySelector('#fld-mikor');
const mit = document.querySelector('#f-mit');
const fldMeret = document.querySelector('#fld-meret');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fail(input, msg) {
  input.closest('.fld').classList.add('bad');
  const err = document.querySelector(`.err[data-for="${input.id}"]`);
  if (err) err.textContent = msg;
}
function clear(input) {
  input.closest('.fld').classList.remove('bad');
}

/* A „mikor hívjalak" mező csak akkor van ott, ha kért visszahívást —
   különben egy kérdés, amire nincs értelme válaszolni. */
hivas.addEventListener('change', () => { fldMikor.hidden = !hivas.checked; });

/* Workshophoz nem tartozik négyzetméter. */
function applyMit() {
  const workshop = mit.value === 'Workshop';
  fldMeret.hidden = workshop;
  if (workshop) clear(form.meret);
}
mit.addEventListener('change', applyMit);
applyMit();

form.addEventListener('submit', e => {
  e.preventDefault();
  const { nev, elerhetoseg: el, meret, uzenet } = form;
  [nev, el, meret, uzenet].forEach(clear);
  ok.hidden = true;
  let bad = null;

  if (!nev.value.trim()) { fail(nev, 'Írd be a neved, hogy tudjam, kihez szóljak.'); bad ||= nev; }

  const v = el.value.trim();
  const digits = (v.match(/\d/g) || []).length;
  if (!v) { fail(el, 'Elérhetőség nélkül nem tudok visszajelezni.'); bad ||= el; }
  else if (!EMAIL.test(v) && digits < 7) { fail(el, 'Ez így nem tűnik e-mail-címnek vagy telefonszámnak.'); bad ||= el; }
  /* Ha visszahívást kért, a telefonszám nem választható — e-mailre nem
     lehet visszahívni. */
  else if (hivas.checked && digits < 7) { fail(el, 'A visszahíváshoz telefonszám kell.'); bad ||= el; }

  if (!fldMeret.hidden) {
    /* A méretből lesz az árajánlat, ezért kötelező, és számot kell
       tartalmaznia — a „egy fal" nem méret. */
    const m = meret.value.trim();
    if (!m) { fail(meret, 'A méret nélkül nem tudok árat mondani — elég egy közelítő szám m²-ben.'); bad ||= meret; }
    else if (!/\d/.test(m)) { fail(meret, 'Írj bele egy számot, például "12 m²".'); bad ||= meret; }
  }

  if (!uzenet.value.trim()) { fail(uzenet, 'Írj pár mondatot arról, mit szeretnél.'); bad ||= uzenet; }

  if (bad) { bad.focus(); return; }

  form.reset();
  fldMikor.hidden = true;
  applyMit();
  ok.hidden = false;
});

[...form.querySelectorAll('input[type="text"], textarea')].forEach(f =>
  f.addEventListener('input', () => clear(f))
);
