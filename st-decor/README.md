# ST Design Decor — landing page prototype

Demo for **Stipkovits Tímea** (`timea78.kovacs@gmail.com`, +36 20 230 0997),
decorative wall painting and workshops, `stdecor.hu`. She replied to the
outreach on 23 Sept: *"Szívesen megnézném a demot az elképzeléséről. Ha
szükséges hozzá további információ, keressen nyugodtan."* No price question,
no complaint — she is simply willing to look.

## What this was built from

More than the last few, and mostly from **her own site**. `stdecor.hu` is
blocked from this environment, but enough came back through search results to
build on facts rather than guesses:

- the four techniques she actually names: **strukturált festés** (márvány- és
  betonhatás), **velencei stukkó**, **ombre**, **sablontechnika**
- her own price band: **8 000 – 30 000 Ft/m²**, depending on the complexity of
  the wall surface and the materials
- **kiscsoportos és privát workshopok**
- bel- és kültér, **nedves helyiség is**
- her positioning: the wall as the room's largest surface, the home as a
  gallery
- her site's own CTA is **"Visszahívást kérek!"** — she works by callback

Two things are still open and are asked in the covering letter:

1. **Which town.** The Facebook page says **Oroszlány**; the business name in
   the original outreach said **Tatabánya**. The page currently says
   "Oroszlány, Tatabánya és környéke" so that neither is wrong, but she has
   to confirm it. Getting a local business's own town wrong is the mistake
   this list has already made eight times.
2. **The per-technique prices.** Her published band is one number pair for
   everything; splitting it across four techniques is our estimate, and
   `arak.txt` says so at the top in a comment addressed to her.

## The thesis

Her work is the only colour on the page. The palette is limewash white,
warm stone and ink, **with no accent colour at all**, because on a decorative
painter's site anything that competes with the photographs wins nothing. The
one thing the design cannot supply is the photographs — there are none — so
every image slot is a labelled frame rather than a grey rectangle, and the
letter says plainly that eight to ten photos are the one thing she has to
send.

The second argument is the price list. Her prices are per m² and depend on
material costs, which move. That is the classic reason people think they
need a maintenance contract, so `arak.txt` is the answer:

```
## Dekor falfestés
Velencei stukkó | 18 000 Ft/m²-től
> Az ár a fal felületének bonyolultságától és a felhasznált anyagoktól függ.
```

She opens the file in a browser, changes the number, saves, and the page
shows it a minute later. The parser is shared with `tools/bake.mjs`, which
writes the list into `index.html` between the `arak` markers, so the page
works with JavaScript off, Google sees real numbers, and the two copies
cannot disagree. A file that parses to nothing leaves the baked list standing.

## Two form details worth keeping

- **"Inkább hívj vissza"** — her own site runs on callbacks, so the form asks
  rather than forcing e-mail. Ticking it reveals a "mikor hívjalak" field, and
  validation then insists on a phone number, because an e-mail address cannot
  be called back.
- **Workshop hides the m² field.** A workshop has no wall area, and asking for
  one is how a form teaches people that nobody reads it.

## Running it

```
npx http-server -p 8195 -s .
node tools/fonts.mjs     # re-download the self-hosted webfonts
node tools/bake.mjs      # write arak.txt into index.html
node tools/check.mjs     # 13 widths × 3 pages, price list, form, menu
node tools/shoot.mjs     # screenshots
node tools/deliver.mjs   # the two renders that go in the e-mail
```

## What the covering letter commits to

- 60–120 000 Ft depending on scope, this one around **80 000 Ft**, one-off.
  She did not ask; it is one short paragraph at the end so the next round
  trip is not spent on it.
- **No maintenance** — `arak.txt` is the answer to changing prices, not a
  contract.
- E-mail only, no site visits.
- Photos are the blocker, and nothing goes live unread by her.
