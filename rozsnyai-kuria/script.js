import { parsePrices, joinNotes } from './assets/price-parse.js';

/* ---------- prices ----------------------------------------------------
   index.html ships with the price list already in it, so the page is
   complete without JavaScript and search engines see real numbers. This
   only replaces that block when arak.txt loads AND parses into something
   usable; on any failure the baked-in list simply stays. */

const priceSlot = document.querySelector('#arak .menu');

function renderPrices(groups) {
  const grid = document.createElement('div');
  grid.className = 'ar';

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
      n.className = 'ar-n';
      n.textContent = it.name;
      const d = document.createElement('span');
      d.className = 'ar-dot';
      d.setAttribute('aria-hidden', 'true');
      const p = document.createElement('span');
      p.className = 'ar-p';
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
    return;                                   // offline, blocked: keep the baked list
  }
  if (!groups.length) return;                 // file emptied or mangled: keep the baked list

  const old = priceSlot.querySelector('.ar');
  const fresh = renderPrices(groups);
  if (old) old.replaceWith(fresh);
  else priceSlot.querySelector('.ar-foot').before(fresh);
}

/* ---------- menu (phones only; on wide screens the nav is always shown) ---------- */

const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
}
btn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); }
});

loadPrices();
