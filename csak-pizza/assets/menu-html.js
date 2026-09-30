/* The menu markup, as one string builder shared by the browser (script.js)
   and by tools/bake.mjs, so the baked copy in index.html and the live one
   rendered from arak.txt are the same markup. */
import { toFt, num } from './price-parse.js';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function nameCell(it) {
  return `<th scope="row"><span class="mt-n">${esc(it.name)}</span>` +
    (it.desc ? `<span class="mt-d">${esc(it.desc)}</span>` : '') + `</th>`;
}

function group(g, I) {
  const out = [];
  const sized = !!g.cols;
  out.push(`${I}<section class="mg${sized ? ' mg-pz' : ''}" id="m-${g.id}">`);
  out.push(`${I}  <h3>${esc(g.title)}</h3>`);
  out.push(`${I}  <table class="mt">`);
  if (sized) {
    out.push(`${I}    <thead><tr><th scope="col">Név, feltét</th>` +
      g.cols.map(c => `<th scope="col">${esc(c)}</th>`).join('') + `</tr></thead>`);
  }
  out.push(`${I}    <tbody>`);
  for (const it of g.items) {
    const cells = it.prices.map(p => `<td>${p ? (sized ? num(toFt(p)) : esc(p.replace(/ Ft$/, ' Ft'))) : '–'}</td>`).join('');
    out.push(`${I}      <tr>${nameCell(it)}${cells}</tr>`);
  }
  out.push(`${I}    </tbody>`);
  out.push(`${I}  </table>`);
  if (g.notes.length) out.push(`${I}  <p class="mg-note">${esc(g.notes.join(' '))}</p>`);
  out.push(`${I}</section>`);
  return out.join('\n');
}

export function menuHTML(groups, I = '') {
  const pz = groups.filter(g => g.cols);
  const etc = groups.filter(g => !g.cols);
  return [
    `${I}<div class="menu">`,
    `${I}  <div class="menu-pz">`,
    ...pz.map(g => group(g, I + '    ')),
    `${I}  </div>`,
    `${I}  <div class="menu-etc">`,
    ...etc.map(g => group(g, I + '    ')),
    `${I}  </div>`,
    `${I}</div>`,
  ].join('\n');
}

export function tocHTML(groups) {
  return groups.map(g => `<a href="#m-${g.id}">${esc(g.title)}</a>`).join('');
}
