# Gazdi-Ker Kisléta — landing page prototype

Demo for **Gazdi-Ker Kft.** (`sziminet@gmail.com`, Szilágyi Imre) — gazdabolt,
háztartási bolt és lottózó, 4325 Kisléta, Debreceni utca 3.
They asked for a sample **and a price**. They have no website today, only a
Facebook page.

## Research this was built from

Everything came from their Facebook page (the owner pasted the page source):

- Slogan, in their own words: **„Gazdi-Ker… A Nyerő Hely!”**
- Address **Kisléta, Debreceni u. 3., 4325** · phone **+36 70 318 6360**
- Seven self-declared categories: lottózó és friss kávé · takarító- és
  tisztítószerek · higiéniai és szépségápolási cikkek · barkács- és kerti
  eszközök, festék · virág, ajándék, játék · állateledel, táp-takarmány ·
  PB-gázpalack
- Opening hours from their own post: **H–P 7:30–17:00, Szo 7:30–13:00,
  V 9:00–12:00** — open all seven days
- 589 followers; posts show the seasonal rhythm: autumn fire-lighting
  (alágyújtó kocka, koromtalanító por, hosszú gyufa), chrysanthemums with
  pre-orders before Mindenszentek, pet-food promotions

## The thesis

A village shop is not a brand problem, it is an errand problem. Three
questions bring someone to this page:

1. **Are they open right now?** — the hero carries a live *Most nyitva /
   Most zárva* state with the closing time, computed in the browser from the
   week's hours. Today's row is highlighted in both the hero card and the
   week table. No CMS, nothing to keep updated.
2. **Can I just ring them?** — the phone number is the primary action in the
   header, the hero, the gas block and the footer. One tap on mobile.
3. **Do they have X?** — six plain category tiles, plus a dedicated
   **PB-gázpalack** block, because a gas-cylinder swap is its own errand and
   its own search term.

Findability is the other half. A Facebook page ranks poorly for
*"gazdabolt Kisléta"* and a lot of their customers do not use Facebook at
all, so the page carries `HardwareStore` JSON-LD with address, phone and
`openingHoursSpecification`.

## Design

A painted village shop sign, executed cleanly: sack-paper ground, deep
green structure, one clay red for actions, one gold reserved for the lottery.
Corners stay at 4px — painted board, not an app. No icon set; the only mark
on the page is the four-leaf clover in the lottery band, which is theirs.

| Token | Hex | Use |
|---|---|---|
| `--oat` | `#F3EDE1` | page ground |
| `--paper` | `#FBF8F2` | cards, form |
| `--forest` | `#1E3A2B` | header, hero, gas block, contact |
| `--clay` | `#B4472A` | primary action, tile numerals — 4.6:1 on oat |
| `--gold` | `#C8952B` | lottery band, eyebrows on green |

Type: **Zilla Slab** 500/600/700 for display, **Public Sans** 400/500/600 for
body. Self-hosted, no third-party requests.

`tools/fonts.mjs` writes `assets/fonts.css`: it keeps only the latin and
latin-ext subsets and downloads each *unique* URL once — Public Sans serves
one variable file for all three weights, so 12 `@font-face` blocks share 8
files. The weight stays in the filename, which is what fixed the collision
bug on the previous site.

## What is deliberately not on the page

- **No photos.** Putting stock shelves on a page about a real shop would be
  a lie. The layout works without them and has room for their own.
- **No prices, no stock.** Nothing that goes stale the week after launch.
  The seasonal block names what they sell in a season, not what it costs.
- **No specific lottery games.** They are a lottery outlet; naming draws
  would be invention.

The concrete products inside each category (which feed, which cleaning
products) are proposals, and the reply asks Szilágyi Imre to correct them.

## Verification

- Ten widths swept, 360–1440: no horizontal overflow, nothing clipped.
- Open/closed logic probed at seven moments (before opening, during, after
  closing, Saturday close-over to Sunday, Sunday close-over to Monday) — all
  correct, including the Hungarian day inflection (*kedden*, *vasárnap*,
  *hétfőn*).
- Form: empty submit flags three fields; a bare `abc` is rejected as
  contact; a phone number is accepted as readily as an e-mail; success
  clears the form and shows the confirmation.
- Mobile menu opens, closes on link tap and on Escape, and `aria-expanded`
  tracks it.

## Files

```
index.html      one page
styles.css      tokens, layout, four breakpoints
script.js       open/closed state, menu, reveal, form validation
assets/         fonts.css, self-hosted woff2, favicon
tools/fonts.mjs rebuild the self-hosted font set
tools/shoot.mjs screenshots · deliver.mjs delivery renders · review.mjs bands
screenshots/    what was sent to the client
```

Serve from this directory on port 8187 (`python3 -m http.server 8187`) before
running any of the tools.
