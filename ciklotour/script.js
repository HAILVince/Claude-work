import { parsePrices, joinNotes } from './assets/price-parse.js';

/* ---------- prices ----------------------------------------------------
   index.html ships with the price list already in it (tools/bake.mjs), so
   the page is complete without JavaScript. This only replaces that block
   when arak.txt loads AND parses into something usable; on any failure the
   baked-in list stays. The markup here must match tools/bake.mjs. */

const priceSlot = document.querySelector('#arak');

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderPrices(groups) {
  const wrap = el('div', 'ar');
  for (const g of groups) {
    const box = el('div', 'ar-g');
    box.append(el('h3', null, g.title));
    const table = el('table', 'tbl ar-t');
    const tbody = el('tbody');
    for (const it of g.items) {
      const tr = el('tr');
      const th = el('th', null, it.name);
      th.scope = 'row';
      tr.append(th, el('td', null, it.price));
      tbody.append(tr);
    }
    table.append(tbody);
    box.append(table);
    if (g.notes.length) box.append(el('p', 'ar-note', joinNotes(g.notes)));
    wrap.append(box);
  }
  return wrap;
}

async function loadPrices() {
  if (!priceSlot) return;
  let groups;
  try {
    const res = await fetch('arak.txt', { cache: 'no-cache' });
    if (!res.ok) return;
    groups = parsePrices(await res.text());
  } catch {
    return;
  }
  if (!groups.length) return;

  const old = priceSlot.querySelector('.ar');
  const fresh = renderPrices(groups);
  if (old) old.replaceWith(fresh);
  else priceSlot.querySelector('.ar-foot').before(fresh);
}

loadPrices();


/* ---------- sample cart -----------------------------------------------
   The webshop section is a picture of a shop, not a shop. "Kosárba" only
   counts, so the customer can see how it would feel. Real ordering would
   run on a webshop platform (Shoprenter, UNAS, ...). */

const count = document.querySelector('#cart-n');
let n = 0;
document.querySelectorAll('.add').forEach(b => {
  b.addEventListener('click', () => {
    n += 1;
    count.textContent = `${n} termék (minta, nem rendel meg semmit)`;
    b.textContent = 'Kosárban';
  });
});
