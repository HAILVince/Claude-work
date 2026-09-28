import { parsePrices, joinNotes } from './assets/price-parse.js';

/* ---------- prices ----------------------------------------------------
   index.html ships with the price list already in it (tools/bake.mjs), so
   the page is complete without JavaScript. This only replaces that block
   when arak.txt loads AND parses into something usable; on any failure the
   baked-in list stays. The markup here must match tools/bake.mjs. */

const priceSlot = document.querySelector('#arak .body');

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

/* ---------- map strip ----------------------------------------------------
   On narrow screens the river sketch scrolls sideways inside its own box;
   start it with the house (x = 646 of 1440) in view. */
const mapBox = document.querySelector('.map-scroll');
if (mapBox && mapBox.scrollWidth > mapBox.clientWidth) {
  mapBox.scrollLeft = mapBox.scrollWidth * (646 / 1440) - mapBox.clientWidth / 2;
}
