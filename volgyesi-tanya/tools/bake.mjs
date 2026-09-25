/* Write the current termekek.txt into index.html between the termekek markers.

   The page must work with JavaScript off and must hand Google real numbers,
   so the price list lives in the HTML too. Both sides go through the same
   parser, so the baked copy and the runtime render cannot disagree about
   what the file means. Re-run after editing termekek.txt here; once the site is
   handed over, their edits land in termekek.txt and the page picks them up live —
   the baked copy is only the fallback. */
import { readFileSync, writeFileSync } from 'node:fs';
import { parsePrices, joinNotes, isOut } from '../assets/price-parse.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const groups = parsePrices(readFileSync('termekek.txt', 'utf8'));
if (!groups.length) throw new Error('termekek.txt parsed to nothing — refusing to bake an empty list');

const html = [`      <div class="ar">`];
for (const g of groups) {
  html.push(`        <div class="ar-g reveal">`);
  html.push(`          <h3>${esc(g.title)}</h3>`);
  html.push(`          <ul class="ar-l">`);
  for (const it of g.items) {
    html.push(
      `            <li${isOut(it.price) ? ' class="out"' : ''}><span class="ar-n">${esc(it.name)}</span>` +
      `<span class="ar-dot" aria-hidden="true"></span>` +
      `<span class="${it.price.length > 14 ? 'ar-p wrap' : 'ar-p'}">${esc(it.price)}</span></li>`
    );
  }
  html.push(`          </ul>`);
  if (g.notes.length) html.push(`          <p class="ar-note">${esc(joinNotes(g.notes))}</p>`);
  html.push(`        </div>`);
}
html.push(`      </div>`);

const page = readFileSync('index.html', 'utf8');
const re = /( *<!-- termekek:start -->)[\s\S]*?( *<!-- termekek:end -->)/;
if (!re.test(page)) throw new Error('termekek markers not found in index.html');

writeFileSync('index.html', page.replace(re, `$1\n${html.join('\n')}\n$2`));
console.log(`baked ${groups.length} groups, ${groups.reduce((n, g) => n + g.items.length, 0)} rows`);
