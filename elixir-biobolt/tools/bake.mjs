/* Write the current arak.txt into index.html between the termekek markers.

   The page must work with JavaScript off, so the sample product grid lives
   in the HTML too. Both sides go through the same parser and the same card
   markup (keep in step with script.js). Re-run after editing arak.txt. */
import { readFileSync, writeFileSync } from 'node:fs';
import { parsePrices, joinNotes, priceValue, unitPrice } from '../assets/price-parse.js';
import { packSvg } from '../assets/packs.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const groups = parsePrices(readFileSync('arak.txt', 'utf8'));
if (!groups.length) throw new Error('arak.txt parsed to nothing — refusing to bake an empty list');

const html = [`      <ul class="shop">`];
const notes = [];
for (const g of groups) {
  for (const it of g.items) {
    const v = priceValue(it.price);
    const u = unitPrice(it.name, it.price);
    html.push(`        <li class="tag"${v ? ` data-price="${v}"` : ''}>`);
    html.push(`          <div class="tag-pic" aria-hidden="true">${packSvg(it.name)}</div>`);
    html.push(`          <div class="tag-label">`);
    html.push(`            <p class="tag-shelf">${esc(g.title)}</p>`);
    html.push(`            <h3 class="tag-name">${esc(it.name)}</h3>`);
    html.push(`            <p class="tag-price">${esc(it.price)}</p>`);
    if (u) html.push(`            <p class="tag-unit">Egységár: ${u}</p>`);
    html.push(`            <button class="btn tag-btn" type="button">Kosárba</button>`);
    html.push(`          </div>`);
    html.push(`        </li>`);
  }
  if (g.notes.length) notes.push(joinNotes(g.notes));
}
html.push(`      </ul>`);
for (const n of notes) html.push(`      <p class="shop-note">${esc(n)}</p>`);

const page = readFileSync('index.html', 'utf8');
const re = /( *<!-- termekek:start -->)[\s\S]*?( *<!-- termekek:end -->)/;
if (!re.test(page)) throw new Error('termekek markers not found in index.html');

writeFileSync('index.html', page.replace(re, `$1\n${html.join('\n')}\n$2`));
console.log(`baked ${groups.length} shelves, ${groups.reduce((n, g) => n + g.items.length, 0)} products`);
