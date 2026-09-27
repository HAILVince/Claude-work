/* Write the current arak.txt into index.html between the markers.

   The page must work with JavaScript off and must hand Google real numbers,
   so the price list lives in the HTML too. Both sides go through the same
   parser, so the baked copy and the runtime render cannot disagree.

   The group titled "Heti akció" goes to the chalkboard (akcio markers), every
   other group to the price list (arak markers). Run from the demo folder:
   node tools/bake.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { parsePrices, joinNotes, isOffer } from '../assets/price-parse.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const all = parsePrices(readFileSync('arak.txt', 'utf8'));
const offer = all.find(g => isOffer(g.title));
const groups = all.filter(g => !isOffer(g.title));
if (!groups.length) throw new Error('arak.txt parsed to nothing — refusing to bake an empty list');

const list = [`      <div class="ar">`];
for (const g of groups) {
  list.push(`        <div class="ar-g reveal">`);
  list.push(`          <h3>${esc(g.title)}</h3>`);
  list.push(`          <ul class="ar-l">`);
  for (const it of g.items) {
    list.push(
      `            <li><span class="ar-n">${esc(it.name)}</span>` +
      `<span class="ar-dot" aria-hidden="true"></span>` +
      `<span class="${it.price.length > 14 ? 'ar-p wrap' : 'ar-p'}">${esc(it.price)}</span></li>`
    );
  }
  list.push(`          </ul>`);
  if (g.notes.length) list.push(`          <p class="ar-note">${esc(joinNotes(g.notes))}</p>`);
  list.push(`        </div>`);
}
list.push(`      </div>`);

const board = [`        <ul class="ak-l">`];
for (const it of offer ? offer.items : []) {
  board.push(`          <li><span class="ak-n">${esc(it.name)}</span><span class="ak-p">${esc(it.price)}</span></li>`);
}
board.push(`        </ul>`);
if (offer && offer.notes.length) board.push(`        <p class="ak-note">${esc(joinNotes(offer.notes))}</p>`);

let page = readFileSync('index.html', 'utf8');
for (const [name, html] of [['arak', list], ['akcio', board]]) {
  const re = new RegExp(`( *<!-- ${name}:start -->)[\\s\\S]*?( *<!-- ${name}:end -->)`);
  if (!re.test(page)) throw new Error(`${name} markers not found in index.html`);
  page = page.replace(re, `$1\n${html.join('\n')}\n$2`);
}
writeFileSync('index.html', page);
console.log(`baked ${groups.length} groups, ${groups.reduce((n, g) => n + g.items.length, 0)} rows; offer: ${offer ? offer.items.length : 0} rows`);
