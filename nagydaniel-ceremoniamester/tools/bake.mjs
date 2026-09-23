/* Az idopontok.txt aktuális tartalmát beírja az index.html-be a markerek közé.

   Az oldalnak JavaScript nélkül is működnie kell, és a Google-nek is valódi
   dátumokat kell látnia, ezért a lista a HTML-ben is ott van. Mindkét oldal
   ugyanazon a parseren megy át, tehát a besütött másolat és a futásidőben
   kirajzolt lista nem tud mást mondani. Átadás után Dani az idopontok.txt-t
   írja, és az oldal élőben onnan tölt — a besütött változat a tartalék. */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseList, isTaken, joinNotes } from '../assets/list-parse.js';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const groups = parseList(readFileSync('idopontok.txt', 'utf8'));
if (!groups.length) throw new Error('idopontok.txt semmit nem adott — nem sütök be üres naptárt');

function fullDate(month, day) {
  const year = (month.match(/\b(20\d{2})\b/) || [])[1];
  const clean = day.replace(/\s+/g, ' ').trim();
  return year && !clean.includes(year) ? `${year}. ${clean}` : clean;
}

const html = ['      <div class="cal" id="cal">'];
let free = 0;
let taken = 0;

for (const g of groups) {
  html.push('        <div class="cal-m">');
  html.push(`          <h3 class="cal-h">${esc(g.title)}</h3>`);
  html.push('          <ul class="cal-l">');
  for (const it of g.items) {
    if (isTaken(it.value)) {
      taken++;
      html.push(
        '            <li><span class="cal-x">' +
        `<span class="cal-n-d">${esc(it.name)}</span>` +
        `<span class="cal-s">${esc(it.value)}</span></span></li>`
      );
    } else {
      free++;
      const full = fullDate(g.title, it.name);
      html.push(
        `            <li><button type="button" class="cal-d" data-date="${esc(full)}"` +
        ` aria-label="${esc(full)} — ${esc(it.value)}, jelentkezés erre a napra">` +
        `<span>${esc(it.name)}</span>` +
        `<span class="cal-s">${esc(it.value)}</span></button></li>`
      );
    }
  }
  html.push('          </ul>');
  if (g.notes.length) html.push(`          <p class="cal-note">${esc(joinNotes(g.notes))}</p>`);
  html.push('        </div>');
}
html.push('      </div>');

const page = readFileSync('index.html', 'utf8');
const out = page.replace(
  /(<!-- idopontok:start -->)[\s\S]*?(<!-- idopontok:end -->)/,
  `$1\n${html.join('\n')}\n      $2`,
);
if (out === page) throw new Error('nem találom az idopontok markereket az index.html-ben');

writeFileSync('index.html', out);
console.log(`besütve: ${groups.length} hónap, ${free} szabad, ${taken} foglalt nap`);
