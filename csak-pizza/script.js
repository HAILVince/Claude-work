import { parseMenu } from './assets/price-parse.js';
import { menuHTML, tocHTML } from './assets/menu-html.js';

/* index.html ships with the menu already in it (tools/bake.mjs), so the page
   is complete without JavaScript. This only swaps in a fresh render when
   arak.txt loads AND parses into something usable; on any failure the baked
   copy stays. */
async function loadMenu() {
  const slot = document.querySelector('.menu');
  const toc = document.querySelector('.toc');
  if (!slot) return;
  let groups;
  try {
    const res = await fetch('arak.txt', { cache: 'no-cache' });
    if (!res.ok) return;
    groups = parseMenu(await res.text());
  } catch {
    return;
  }
  if (!groups.length) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = menuHTML(groups);
  slot.replaceWith(tmp.firstElementChild);
  if (toc) toc.innerHTML = tocHTML(groups);
}

loadMenu();
