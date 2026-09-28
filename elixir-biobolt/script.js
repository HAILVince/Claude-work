import { parsePrices, joinNotes, priceValue, unitPrice, formatFt } from './assets/price-parse.js';

/* ---------- sample products ------------------------------------------
   index.html ships with the product grid already in it (tools/bake.mjs),
   so the page is complete without JavaScript. This only replaces that grid
   when arak.txt loads AND parses into something usable. The markup here
   must match tools/bake.mjs. */

const shopSlot = document.querySelector('#webaruhaz .wrap');

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderShop(groups) {
  const list = el('ul', 'shop');
  const notes = [];
  for (const g of groups) {
    for (const it of g.items) {
      const li = el('li', 'tag');
      const v = priceValue(it.price);
      if (v) li.dataset.price = String(v);
      const ph = el('div', 'ph ph-prod');
      ph.append(el('span', null, 'Fotó: a termék'));
      li.append(el('p', 'tag-shelf', g.title), ph, el('h3', 'tag-name', it.name), el('p', 'tag-price', it.price));
      const u = unitPrice(it.name, it.price);
      if (u) li.append(el('p', 'tag-unit', `Egységár: ${u}`));
      const b = el('button', 'btn tag-btn', 'Kosárba');
      b.type = 'button';
      li.append(b);
      list.append(li);
    }
    if (g.notes.length) notes.push(el('p', 'shop-note', joinNotes(g.notes)));
  }
  return [list, notes];
}

async function loadShop() {
  if (!shopSlot) return;
  let groups;
  try {
    const res = await fetch('arak.txt', { cache: 'no-cache' });
    if (!res.ok) return;
    groups = parsePrices(await res.text());
  } catch {
    return;
  }
  if (!groups.length) return;
  const [list, notes] = renderShop(groups);
  shopSlot.querySelectorAll('.shop-note').forEach(n => n.remove());
  shopSlot.querySelector('.shop').replaceWith(list);
  list.after(...notes);
}

/* ---------- demo cart: counts clicks, orders nothing ------------------ */

const cart = document.querySelector('.cart');
let count = 0;
let total = 0;

document.addEventListener('click', e => {
  const btn = e.target.closest('.tag-btn');
  if (!btn || !cart) return;
  const tag = btn.closest('.tag');
  count += 1;
  total += Number(tag.dataset.price || 0);
  const n = Number(btn.dataset.n || 0) + 1;
  btn.dataset.n = String(n);
  btn.textContent = `Kosárban: ${n} db`;
  cart.textContent = `Kosár: ${count} tétel, ${formatFt(total)} (minta)`;
});

/* ---------- today's row in the opening hours ------------------------- */

const today = document.querySelector(`.hours-t tr[data-day="${new Date().getDay()}"]`);
if (today) today.classList.add('today');

loadShop();
