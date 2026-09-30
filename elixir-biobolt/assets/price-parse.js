/* One parser for arak.txt, shared by the browser at runtime and by
   tools/bake.mjs at build time, so the products baked into index.html and
   the ones rendered from the file can never drift apart.

   The file is edited by hand, so every rule fails soft: unknown lines are
   skipped, a shelf with no products is dropped, and a file that yields
   nothing usable leaves the page untouched. */

export function parsePrices(text) {
  const groups = [];
  let group = null;

  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('##')) {
      group = { title: line.slice(2).trim(), items: [], notes: [] };
      groups.push(group);
      continue;
    }
    if (line.startsWith('#')) continue;
    if (!group) continue;

    if (line.startsWith('>')) {
      const note = line.slice(1).trim();
      if (note) group.notes.push(note);
      continue;
    }

    const bar = line.indexOf('|');
    if (bar < 1) continue;
    const name = line.slice(0, bar).trim();
    const price = line.slice(bar + 1).trim();
    if (name && price) group.items.push({ name, price });
  }

  return groups.filter(g => g.items.length);
}

export function joinNotes(notes) {
  return notes.join(' ');
}

/* Forint amount as a number: "1 490 Ft" -> 1490. null if there is none. */
export function priceValue(price) {
  const m = String(price).replace(/[\s ]/g, '').match(/(\d+)Ft/i);
  return m ? Number(m[1]) : null;
}

const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const formatFt = n => `${fmt(n)} Ft`;

/* Shelf labels in Hungary carry the unit price too. Read the pack size
   from the name ("…, 500 g") and return e.g. "2 580 Ft/kg", or '' when the
   name has no size or the price is not a plain number. */
export function unitPrice(name, price) {
  const ft = priceValue(price);
  const m = String(name).match(/(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l)\b/i);
  if (!ft || !m) return '';
  const qty = Number(m[1].replace(',', '.'));
  const unit = m[2].toLowerCase();
  if (!qty) return '';
  const per = { g: 1000 / qty, kg: 1 / qty, ml: 1000 / qty, l: 1 / qty }[unit];
  const base = unit === 'g' || unit === 'kg' ? 'kg' : 'l';
  return `${fmt(ft * per)} Ft/${base}`;
}
