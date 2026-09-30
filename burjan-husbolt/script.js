import { parsePrices, joinNotes, isOffer } from './assets/price-parse.js';

/* ---------- prices + weekly offer ---------------------------------------
   index.html ships with both lists already in it (tools/bake.mjs), so the
   page is complete without JavaScript and search engines see real numbers.
   This only replaces them when arak.txt loads AND parses into something
   usable; on any failure the baked-in lists simply stay. */

const priceSlot = document.querySelector('#arak .wrap');
const board = document.querySelector('#akcio .board');

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderPrices(groups) {
  const grid = el('div', 'ar');
  for (const g of groups) {
    const box = el('div', 'ar-g reveal');
    box.append(el('h3', null, g.title));
    const ul = el('ul', 'ar-l');
    for (const it of g.items) {
      const li = document.createElement('li');
      const dot = el('span', 'ar-dot');
      dot.setAttribute('aria-hidden', 'true');
      li.append(el('span', 'ar-n', it.name), dot,
        el('span', it.price.length > 14 ? 'ar-p wrap' : 'ar-p', it.price));
      ul.append(li);
    }
    box.append(ul);
    if (g.notes.length) box.append(el('p', 'ar-note', joinNotes(g.notes)));
    grid.append(box);
  }
  return grid;
}

function renderOffer(offer) {
  const ul = el('ul', 'ak-l');
  for (const it of offer.items) {
    const li = document.createElement('li');
    li.append(el('span', 'ak-n', it.name), el('span', 'ak-p', it.price));
    ul.append(li);
  }
  const out = [ul];
  if (offer.notes.length) out.push(el('p', 'ak-note', joinNotes(offer.notes)));
  return out;
}

async function loadPrices() {
  let all;
  try {
    const res = await fetch('arak.txt', { cache: 'no-cache' });
    if (!res.ok) return;
    all = parsePrices(await res.text());
  } catch {
    return;                                   // offline, blocked — keep the baked lists
  }

  const groups = all.filter(g => !isOffer(g.title));
  if (priceSlot && groups.length) {
    const fresh = renderPrices(groups);
    const old = priceSlot.querySelector('.ar');
    if (old) old.replaceWith(fresh);
    else priceSlot.querySelector('.ar-foot').before(fresh);
    observe(fresh.querySelectorAll('.reveal'));
  }

  const offer = all.find(g => isOffer(g.title));
  if (board && offer) {
    board.querySelectorAll('.ak-l, .ak-note').forEach(n => n.remove());
    board.append(...renderOffer(offer));
  }
}

/* ---------- opening hours: mark today, say open / closed ---------------- */

const HOURS = { 0: [7, 11], 1: null, 2: [6, 17], 3: [6, 17], 4: [6, 17], 5: [6, 17], 6: [6, 13] };

function markToday(now = new Date()) {
  const d = now.getDay();
  const row = document.querySelector(`.hours-l li[data-day="${d}"]`);
  if (row) row.classList.add('today');

  const status = document.querySelector('[data-status]');
  if (!status) return;
  const h = HOURS[d];
  const t = now.getHours() + now.getMinutes() / 60;
  const open = h && t >= h[0] && t < h[1];
  status.textContent = open ? `Most nyitva ${h[1]}:00-ig` : 'Most zárva';
  status.classList.toggle('closed', !open);
  status.hidden = false;
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
  for (const n of nodes) {
    if (io) io.observe(n);
    else n.classList.add('in');
  }
}
observe(document.querySelectorAll('.reveal'));

/* ---------- order form (demo: nothing is sent yet) ---------- */

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
  const err = document.querySelector(`.err[data-for="${input.id}"]`);
  if (err) err.textContent = '';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const { nev, elerhetoseg: kontakt, mikor, mit } = form;
  [nev, kontakt, mikor, mit].forEach(clear);
  ok.hidden = true;
  let bad = null;

  if (!nev.value.trim()) { fail(nev, 'Kérjük, írja be a nevét.'); bad ||= nev; }

  const v = kontakt.value.trim();
  const digits = (v.match(/\d/g) || []).length;
  if (!v) { fail(kontakt, 'Adjon meg egy telefonszámot vagy e-mail-címet.'); bad ||= kontakt; }
  else if (!EMAIL.test(v) && digits < 7) { fail(kontakt, 'Ez így nem tűnik telefonszámnak vagy e-mail-címnek.'); bad ||= kontakt; }

  if (!mikor.value) { fail(mikor, 'Válassza ki, hogyan kéri.'); bad ||= mikor; }
  if (!mit.value.trim()) { fail(mit, 'Írja meg, mit és mennyit kér.'); bad ||= mit; }

  if (bad) { bad.focus(); return; }
  form.reset();
  ok.hidden = false;
});

[...form.querySelectorAll('input, select, textarea')].forEach(f => {
  f.addEventListener('input', () => clear(f));
  f.addEventListener('change', () => clear(f));
});

/* ---------- sticky call bar: only once the hero's own button is gone ---------- */

const callbar = document.querySelector('.callbar');
const heroCall = document.querySelector('.hero .btn-xl');
if (callbar && heroCall && 'IntersectionObserver' in window) {
  callbar.classList.add('away');
  new IntersectionObserver(([e]) => {
    callbar.classList.toggle('away', e.isIntersecting || e.boundingClientRect.top > 0);
  }).observe(heroCall);
}

markToday();
loadPrices();
