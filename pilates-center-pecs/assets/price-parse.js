/* One parser for arak.txt, shared by the browser at runtime and by
   tools/bake.mjs at build time, so the prices baked into index.html and the
   ones rendered from the file can never drift apart.

   The file is edited by hand by someone who is not a developer, so every rule
   here fails soft: unknown lines are skipped, a group with no items is
   dropped, and a file that yields nothing usable leaves the page untouched. */

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
    if (line.startsWith('#')) continue;      // comment meant for her, not the page
    if (!group) continue;                    // anything before the first heading

    if (line.startsWith('>')) {
      const note = line.slice(1).trim();
      if (note) group.notes.push(note);
      continue;
    }

    const bar = line.indexOf('|');
    if (bar < 1) continue;                   // not a price row
    const name = line.slice(0, bar).trim();
    const price = line.slice(bar + 1).trim();
    if (name && price) group.items.push({ name, price });
  }

  // A heading she typed but has not filled in yet should not print an empty box.
  return groups.filter(g => g.items.length);
}

/* Consecutive `>` lines read as one wrapped sentence, which is how they are
   written in the file. */
export function joinNotes(notes) {
  return notes.join(' ');
}
