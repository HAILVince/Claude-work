import { parsePrices, joinNotes, isOut } from './assets/price-parse.js';

/* ---------- products --------------------------------------------------
   index.html ships with the product list already in it, so the page is
   complete without JavaScript and search engines see real products. This
   only replaces that block when termekek.txt loads AND parses into
   something usable; on any failure the baked-in list simply stays. */

const listSlot = document.querySelector('#kinalat .wrap');

function renderList(groups) {
  const grid = document.createElement('div');
  grid.className = 'ar';

  for (const g of groups) {
    const box = document.createElement('div');
    box.className = 'ar-g reveal';

    const h = document.createElement('h3');
    h.textContent = g.title;
    box.append(h);

    const ul = document.createElement('ul');
    ul.className = 'ar-l';
    for (const it of g.items) {
      const li = document.createElement('li');
      if (isOut(it.price)) li.className = 'out';
      const n = document.createElement('span');
      n.className = 'ar-n';
      n.textContent = it.name;
      const d = document.createElement('span');
      d.className = 'ar-dot';
      d.setAttribute('aria-hidden', 'true');
      const p = document.createElement('span');
      p.className = it.price.length > 14 ? 'ar-p wrap' : 'ar-p';
      p.textContent = it.price;
      li.append(n, d, p);
      ul.append(li);
    }
    box.append(ul);

    if (g.notes.length) {
      const note = document.createElement('p');
      note.className = 'ar-note';
      note.textContent = joinNotes(g.notes);
      box.append(note);
    }
    grid.append(box);
  }
  return grid;
}

async function loadList() {
  if (!listSlot) return;
  let groups;
  try {
    const res = await fetch('termekek.txt', { cache: 'no-cache' });
    if (!res.ok) return;
    groups = parsePrices(await res.text());
  } catch {
    return;                                   // offline, blocked, whatever — keep the baked list
  }
  if (!groups.length) return;                 // file emptied or mangled — keep the baked list

  const old = listSlot.querySelector('.ar');
  const fresh = renderList(groups);
  if (old) old.replaceWith(fresh);
  else listSlot.querySelector('.tal').before(fresh);
  observe(fresh.querySelectorAll('.reveal'));
}

/* ---------- menu ---------- */

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

/* ---------- reveal ---------- */

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = still ? null : new IntersectionObserver((entries, obs) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    obs.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px' });

function observe(nodes) {
  for (const el of nodes) {
    if (io) io.observe(el);
    else el.classList.add('in');
  }
}
observe(document.querySelectorAll('.reveal'));

/* ---------- order form ------------------------------------------------
   Demo mode: validates and confirms on the page, sends nothing. Live, the
   same form posts to a form-to-mail service and lands in their inbox. */

const form = document.querySelector('#f');
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
  const nev = form.nev, el = form.elerhetoseg, mit = form.rendeles;
  [nev, el, mit].forEach(clear);
  ok.hidden = true;
  let bad = null;

  if (!nev.value.trim()) {
    fail(nev, 'Írja be a nevét, hogy tudjuk, kinek tegyük félre.');
    bad ||= nev;
  }

  const v = el.value.trim();
  const digits = (v.match(/\d/g) || []).length;
  if (!v) {
    fail(el, 'Adjon meg egy telefonszámot vagy e-mail-címet, ezen jelzünk vissza.');
    bad ||= el;
  } else if (!EMAIL.test(v) && digits < 7) {
    fail(el, 'Ez így nem tűnik telefonszámnak vagy e-mail-címnek.');
    bad ||= el;
  }

  if (!mit.value.trim()) {
    fail(mit, 'Írja meg, mit és mennyit kér.');
    bad ||= mit;
  }

  if (bad) { bad.focus(); return; }

  form.reset();
  ok.hidden = false;
});

[form.nev, form.elerhetoseg, form.rendeles].forEach(f =>
  f.addEventListener('input', () => clear(f))
);

loadList();
