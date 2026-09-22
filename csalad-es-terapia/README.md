# Család és Terápia — landing page prototype

Demo for **Mráz Sándor Zoltán** (`info@csaladesterapia.hu`) — családterápia,
párterápia és addiktológiai konzultáció, Ibrány. He replied on 22 Sept asking
for a demo and two questions: what a year of hosting costs, and how editable
the site is during use.

## What this was built from

Their site, `csaladesterapia.hu`, is blocked by the egress proxy here, so the
page was built from what search surfaced of their own pages (`/rolunk`,
`/csapatunk`, `/araink`):

- **Mráz Sándor Zoltán (Alex)** — családterapeuta, addiktológiai konzultáns
- two therapists who met on a family-therapy training and have worked together
  for **more than ten years**
- services: **családterápia, párterápia, addiktológiai konzultáció**, plus
  **online** párterápia — the last only where neither partner has a
  psychiatric diagnosis
- **addiktológiai állapotfelmérő első konzultáció: 50 perc / 15 000 Ft** — the
  one price actually known
- payment per session, cash or transfer, **no card**
- cancellation at least **24 hours** ahead

**Everything else is a proposal**: the other prices, the session rhythm, the
copy, the FAQ answers. The second therapist is a named placeholder — the
reply asks for the name, qualification and a few lines. Nothing here should go
live unread.

## The thesis

He asked how editable the site is, so the answer is built in rather than
promised: `arak.txt` holds the price list, he edits it in the browser on
GitHub, the page loads from it. **No maintenance is offered** — the rule in
`emails/ARAK.txt`.

The prices are also baked into `index.html` between the `arak:start` and
`arak:end` markers by `tools/bake.mjs`, both sides going through
`assets/price-parse.js`, so the page works with JavaScript off and the two
can never disagree. The loader fails soft: a missing, emptied, comment-only,
pipe-less or pasted-over file leaves the baked list standing.

Beyond that, the page is built around what stops people booking therapy:

1. **Not knowing what they are walking into** — a four-step account of what
   happens from the first message to the rhythm of sessions.
2. **Not daring to ask the price** — the prices are on the page.
3. **The questions nobody asks out loud** — is it confidential, does everyone
   have to come, what if my partner refuses, how many sessions, can I cancel.

## Two things done deliberately, because of the subject

- **The form refuses details.** It asks for a name, a contact, the kind of
  matter and personal-or-online — and says in as many words not to write
  diagnoses, records or what happened, because e-mail is not a confidential
  channel. A contact form on a therapy site that invites people to pour out
  their history is a liability for the practice and for the client.
- **A crisis band**, in its own colour: this page is not crisis care, the
  Lelki Elsősegély line is **116-123** (free, anonymous, 24h), and **112** in
  immediate danger. Both numbers are public services and worth confirming with
  him, but a page about addiction and family crisis that offers no route for
  someone in trouble tonight is worse than one that does.

No claims of outcome, no "we cure", no diagnosis talk, no photos, no invented
qualifications.

## Design

Quiet and unhurried: soft warm greys, one grounded green, generous leading.
Nothing that reads as selling.

| Token | Hex | Use |
|---|---|---|
| `--shell` | `#F4F3EF` | page ground |
| `--sage` | `#E6EBE4` | services, prices, form |
| `--deep` | `#23372F` | FAQ, footer |
| `--accent` | `#3F6B57` | buttons — 6.08:1 under white |
| `--amber` | `#F6EFE2` | crisis band, set apart from everything else |

Type: **Lora** 500/600 display, **Source Sans 3** 400/500/600 body,
self-hosted, no third-party requests. Both are variable, so 10 `@font-face`
blocks share 4 files.

## Verification

- Twelve widths, 360–1440: no horizontal overflow, nothing clipped.
- Price file: 9 rows in 4 groups from the real file; an edit shows up; six
  ways of breaking the file fall back to the baked list; partial damage keeps
  what parses; file text is escaped, not parsed as markup.
- **A sentence in the price column** (`Bankkártya | nem áll módunkban
  elfogadni`) used to push the grid past the viewport on phones — `nowrap` on
  a value that is prose. Values longer than 14 characters now wrap and
  right-align, and the case is covered by a test at 360px. Fixed in
  `sminktetovalas-tatabanya/` too, which has the same renderer.
- Form: empty submit flags four fields, `abc` rejected as a contact, a phone
  accepted as readily as an e-mail, success clears the form.
- Mobile menu opens, closes on link tap and Escape, `aria-expanded` tracks it.

## Files

```
index.html       one page; prices live between the arak markers
arak.txt         the price list he edits
styles.css       tokens, layout, three breakpoints
script.js        price loader, menu, reveal, form validation
assets/price-parse.js   shared by the browser and the build
tools/bake.mjs   write arak.txt into index.html
tools/fonts.mjs  rebuild the self-hosted font set
tools/check.mjs  behaviour + width sweep · shoot/deliver/review.mjs  images
```

Serve from this directory on port 8189 (`python3 -m http.server 8189`) before
running any of the tools. Re-run `node tools/bake.mjs` after editing
`arak.txt` here.
