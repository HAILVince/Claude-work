import { parsePrices, joinNotes } from './assets/price-parse.js';

/* ---------- prices ----------------------------------------------------
   index.html ships with the price list already in it, so the page is
   complete without JavaScript and search engines see real numbers. This
   only replaces that block when arak.txt loads AND parses into something
   usable; on any failure the baked-in list simply stays. */

const priceSlot = document.querySelector('#arak .wrap');

function renderPrices(groups) {
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

async function loadPrices() {
  if (!priceSlot) return;
  let groups;
  try {
    const res = await fetch('arak.txt', { cache: 'no-cache' });
    if (!res.ok) return;
    groups = parsePrices(await res.text());
  } catch {
    return;                                   // offline, blocked, whatever — keep the baked list
  }
  if (!groups.length) return;                 // file emptied or mangled — keep the baked list

  const old = priceSlot.querySelector('.ar');
  const fresh = renderPrices(groups);
  if (old) old.replaceWith(fresh);
  else priceSlot.querySelector('.ar-foot').before(fresh);
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

loadPrices();
