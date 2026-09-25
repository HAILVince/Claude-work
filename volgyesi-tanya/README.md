# Völgyesi Tanya — landing page prototype

Demo for **Völgyesiné Mózes Melinda** (she signs as Völgyesi Melinda),
Völgyesi Tanya, `volgyesitanya@gmail.com`, +36 30 604 5424. Facebook:
`facebook.com/tanya.volgyesi.5`. They have no website.

She wrote on 21 Sept that they want a site but *"Korlátozott az erre szánt
anyagi helyzetünk."* Vince answered with 60–120 000 Ft, most sites around
80 000, one-off, no monthly fee, and offered a free demo. Her answer on
25 Sept:

> *"Kézmüves sajtokat, tejtermékeket gyártunk. A Völgyesi Tanya facebook
> oldalán található képeket használhatja."*

## What this was built from

Facebook is blocked from the build environment, so Vince saved 12 pictures
from their page. Every fact on the page comes from those:

- **The producer sign on the counter** (it goes in the footer):
  *Kistermelő neve, címe: Völgyesiné Mózes Melinda Jolán, 2254
  Szentmártonkáta Öregszőlő dűlő 35. Élelmiszer előállítás helye: ugyanez.
  Felir: AB3210478. Regisztrációs szám: 12-5-T-458.*
- **Their logo**, visible only in a small collage: a green circle with a cow,
  a goat and a cheese wedge, "Kézműves Sajtok". Together with two goat
  photos this is where "tehén- és kecsketej" comes from. To be confirmed.
- **The products in the photos**: yellow cheese spirals, filled cheese
  rolls, fresh rounds (plain, herb, paprika), bottled dairy in white, pink
  and orange, spreads in tubs, big fresh blocks, a red-waxed wheel, and
  many cheese platters.
- **How they sell**: a refrigerated counter at a market (yellow wall, tent)
  and a table with a red gingham cloth. A "Kártyával okosabb" sticker on
  the counter is where "Kártyával is fizethet" comes from. To be confirmed.
- An **"Oklevél"** poster on the counter. It cannot be read, so it is not on
  the page; the letter asks about it.
- One photo shows **smoked sausages** in a counter. Probably a neighbouring
  stall, so it is not used.

## What is ours

- **Every product name and every price in `termekek.txt`.** The names are
  read off the photos; the prices are invented. The file header says so.
- The platter call-out ("születésnapra, ballagásra, céges rendezvényre").
  The photos show plenty of platters, but not who orders them.
- The headline, the four steps, and the order form. Setting things aside
  on request is our proposal; if they don't do it, the form becomes a
  question form.
- The favicon (a cheese wedge). Their logo replaces it once we have the
  file.

## Photos

| File | Source | Used as |
|---|---|---|
| `hero.jpg` | counter at the yellow wall, 2048×1536, cropped 4:5 | hero |
| `asztal.jpg` | gingham table, 960×720, cropped to leave out the man standing behind it | Rólunk |
| `csiga`, `friss`, `sajttal`, `tej`, `nyaj`, `kecske.jpg` | 206×206 Facebook thumbnails | the six gallery tiles |

The tiles are laid out at about 180px on a desktop and never much above
their 206px, so they stay sharp. For the live site we need the originals.
Not used: the logo collage (too small), the sausages, the second counter
shot (the producer sign was read from it), and a second spirals photo.

## Worth asking her

1. The real products and prices.
2. Cow's and goat's milk, both? (From the logo.)
3. Which markets, on which days (the placeholder under Rólunk).
4. A few sentences about the farm (the same placeholder).
5. The Oklevél: what for, and from whom?
6. Card payment at the counter?
7. Platters to order: yes? How much notice?
8. Is the producer data OK in the footer? The kistermelő rules already put
   it on the counter.
9. The logo file and the photos in full size.

## The thesis

The visitor met them at a market, or needs a cheese platter for a party.
They want to know what is on the counter this week, what it costs, and
how to get it. So the page opens with the counter itself, the list shows
what has run out instead of hiding it, and "tell us, we'll set it aside"
is the main action. The phone number is on every screen.

## Design

| Token | Hex | Use |
|---|---|---|
| `--shell` | `#FBF7EE` | page ground, milk cream |
| `--sage` | `#F3EBDA` | banded sections, straw |
| `--deep` | `#2F3B2A` | strip, call card, footer; pasture green |
| `--accent` | `#7A4414` | buttons and links, rind brown; 7.9:1 under white |
| `--gold` | `#E8B64C` | ripe-cheese colour on dark green only (6.3:1), never on light |
| `--amber` | `#FBF0D6` | platter call-out, step numbers |

Type: **Zilla Slab** 500/600 display, **Source Sans 3** body, self-hosted.
Sold-out rows are struck through in `#7A7466`, which still reads 4.65:1 on
white.

## The product file

`termekek.txt`, the same mechanism as the other demos: they edit it in the
browser, the page reads it, `tools/bake.mjs` bakes a copy into
`index.html` through `assets/price-parse.js`, and a broken file leaves the
baked list standing. One addition: writing **"elfogyott"** in place of the
price keeps the product on the list, greyed and struck through (`isOut` in
`price-parse.js`), so next week they only type the price back.
**No maintenance is offered** (`emails/ARAK.txt`).

## Verification

`tools/smoke.mjs`: no console errors; 11 rows in 3 groups from
`termekek.txt`, one sold out; every photo loads; the call button dials her
number; empty submit flags three fields, garbage contact rejected, phone
accepted, form clears; a mangled file keeps the baked list, an edited one
re-renders with its sold-out row greyed; mobile menu opens and closes;
no horizontal overflow at 360, 390, 414, 600, 768, 860, 1000, 1100, 1280
and 1440.

## Files

```
index.html       one page; the product list lives between the termekek markers
termekek.txt     products and prices, the file they edit (examples for now)
styles.css       tokens, layout, breakpoints
script.js        list loader, menu, reveal, order form (demo mode)
assets/price-parse.js   shared by the browser and the build; isOut for "elfogyott"
assets/img/      their photos, cropped
tools/bake.mjs   write termekek.txt into index.html
tools/fonts.mjs  rebuild the self-hosted font set
tools/smoke.mjs  behaviour + width sweep · shoot/deliver/review.mjs  images
```

Serve from this directory on port 8193 (`python3 -m http.server 8193`)
before running any of the tools. The two PNGs for the letter are
`screenshots/desktop-full.png` and `screenshots/mobile-full.png`.
