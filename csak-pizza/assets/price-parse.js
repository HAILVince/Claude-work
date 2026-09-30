/* One parser for arak.txt, shared by the menu page, the order page and
   tools/bake.mjs, so the baked menu, the live menu and the prices in the
   cart can never disagree.

   The file is edited by hand, so every rule fails soft: unknown lines are
   skipped, a group with no items is dropped, and a file that yields nothing
   usable leaves the page as it was. */

export function slug(s) {
  return String(s).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function parseMenu(text) {
  const groups = [];
  let group = null;

  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('##')) {
      const title = line.slice(2).trim();
      group = { id: slug(title), title, cols: null, items: [], notes: [] };
      groups.push(group);
      continue;
    }
    if (line.startsWith('#')) continue;            // comment for the editor
    if (!group) continue;

    if (line.startsWith('=')) {                    // size columns, e.g. 22 cm | 32 cm | 47 cm
      const cols = line.slice(1).split('|').map(s => s.trim()).filter(Boolean);
      if (cols.length) group.cols = cols;
      continue;
    }
    if (line.startsWith('>')) {
      const note = line.slice(1).trim();
      if (note) group.notes.push(note);
      continue;
    }

    const parts = line.split('|').map(s => s.trim());
    if (parts.length < 2 || !parts[0]) continue;
    const n = group.cols ? group.cols.length : 1;
    if (parts.length < n + 1) continue;
    const prices = parts.slice(parts.length - n).map(p => (/\d/.test(p) ? p : ''));
    if (!prices.some(Boolean)) continue;
    const desc = parts.slice(1, parts.length - n).join(', ');
    group.items.push({ id: group.id + '--' + slug(parts[0]), name: parts[0], desc, prices });
  }

  return groups.filter(g => g.items.length);
}

/* "2 990 Ft" -> 2990 */
export function toFt(s) {
  const n = parseInt(String(s).replace(/\D/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

/* 2990 -> "2 990" (no-break space as thousands separator) */
export function num(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function ft(n) {
  return num(n) + ' Ft';
}
