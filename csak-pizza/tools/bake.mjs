/* Write the current arak.txt into index.html between the etlap markers.

   The menu page must work with JavaScript off and must hand Google real
   prices, so the menu lives in the HTML too. Both sides go through the same
   parser and the same markup builder (assets/menu-html.js), so the baked copy
   and the live render cannot disagree. Re-run after editing arak.txt:
       node tools/bake.mjs                                                  */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseMenu } from '../assets/price-parse.js';
import { menuHTML, tocHTML } from '../assets/menu-html.js';

const groups = parseMenu(readFileSync('arak.txt', 'utf8'));
if (!groups.length) throw new Error('arak.txt parsed to nothing — refusing to bake an empty menu');

let page = readFileSync('index.html', 'utf8');
const swap = (name, html) => {
  const re = new RegExp(`( *<!-- ${name}:start -->)[\\s\\S]*?( *<!-- ${name}:end -->)`);
  if (!re.test(page)) throw new Error(`${name} markers not found in index.html`);
  page = page.replace(re, (_, a, b) => `${a}\n${html}\n${b}`);
};
swap('etlap', menuHTML(groups, '      '));
swap('toc', '        ' + tocHTML(groups));
writeFileSync('index.html', page);
console.log(`baked ${groups.length} groups, ${groups.reduce((n, g) => n + g.items.length, 0)} items`);
