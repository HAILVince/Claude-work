/* One parser for idopontok.txt, shared by the browser at runtime and by
   tools/bake.mjs at build time, so the dates baked into index.html and the
   ones rendered from the file can never drift apart.

   The file is edited by hand by someone who is not a developer, so every rule
   here fails soft: unknown lines are skipped, a group with no rows is dropped,
   and a file that yields nothing usable leaves the page untouched. A booking
   calendar that empties itself because of a stray character would be worse
   than no calendar at all. */

export function parseList(text) {
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
    if (line.startsWith('#')) continue;      // comment meant for him, not the page
    if (!group) continue;                    // anything before the first heading

    if (line.startsWith('>')) {
      const note = line.slice(1).trim();
      if (note) group.notes.push(note);
      continue;
    }

    const bar = line.indexOf('|');
    if (bar < 1) continue;                   // not a date row
    const name = line.slice(0, bar).trim();
    const value = line.slice(bar + 1).trim();
    if (name && value) group.items.push({ name, value });
  }

  // A month he typed but has not filled in yet should not print an empty box.
  return groups.filter(g => g.items.length);
}

/* Anything that is not plainly a "taken" marker counts as free. Erring this
   way means a typo shows a date as bookable — he gets an e-mail he can turn
   down — rather than hiding a date he could have sold. */
export function isTaken(value) {
  return /^(foglalt|betelt|nem\s|x)/i.test(value.trim());
}

/* Consecutive `>` lines read as one wrapped sentence, which is how they are
   written in the file. */
export function joinNotes(notes) {
  return notes.join(' ');
}
