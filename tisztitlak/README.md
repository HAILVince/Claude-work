# Tisztítlak Kecskemét — website redesign demo

Flat, typographic redesign concept for **tisztitlakkecskemet.hu** (cleaning-machine
rental, Kecskemét). Static site — no build step, no dependencies, no third-party
requests at runtime. Open `index.html` or serve the folder.

```
index.html      markup
styles.css      design tokens + layout
script.js       header state, mobile menu, particle field
assets/fonts.css + assets/fonts/   self-hosted webfonts (6 woff2)
screenshots/    PC + mobile renders
tools/          Playwright capture scripts
```

## Design constraints

**No gradients, no cards, no icons, no stat bars.** There is not one `linear-gradient`,
`box-shadow` or icon glyph in the project. The page is built from hard-edged flat colour
fields, hairline rules and open grids.

The one abstract motif is a **canvas particle lattice** (`script.js`) whose density falls
away to the right — labelled *szövet, bérlés előtt* / *szövet, bérlés után*. It encodes the
thing that actually differentiates the business: the machine sprays cleaner into the pile
and then extracts the dirt, rather than scrubbing the surface. It is deterministic, so it
draws identically on every load and in every screenshot.

## Type

| Role | Face | Notes |
|---|---|---|
| Display | Archivo, variable `wdth 118` | Expanded headlines. Chromium ignores `font-stretch` for the width axis — it needs `font-variation-settings: 'wdth' 118`. |
| Body | Archivo, `wdth 100` | |
| Labels, prices, times | IBM Plex Mono | `font-variant-numeric: tabular-nums` on figures |

Fonts are **self-hosted** (`assets/fonts/`), not linked from Google. Hotlinking Google
Fonts ships the visitor's IP to a third country, which is the thing German and Austrian
courts have ruled against under GDPR — worth avoiding for an EU business.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#04182A` | data strip, footer, scrolled header |
| `--navy` | `#0A3255` | hero, delivery block |
| `--brand` | `#0B3D64` | display terms, particle field |
| `--cyan` | `#29ABE2` | accent field, contact block, buttons |
| `--cyan-ink` | `#127BA8` | accent **text** (4.3:1 on paper; `--cyan` is 2.4:1 and fails) |
| `--paper` | `#F1F5F8` | alternating section ground, blue-biased |
| `--muted` | `#5B7285` | secondary text (4.6:1 on paper) |

All on `:root` in `styles.css`.

## Content provenance

Everything factual came from the live site's public description: Kärcher machines that
spray then extract; delivery fees 1 000 Ft in Kecskemét and 2 000 Ft to Kadafalva,
Ballószög, Hetényegyháza, Helvécia and Katonatelep; delivery windows 5:30–8:00 and
16:00–18:00; five-minute handover with the contract signed on site; the four machine
categories.

## Placeholders to replace before launch

Flagged with `<!-- -->` comments in `index.html`:

- **Phone** — `+36 00 000 0000` (header, mobile menu, FAQ aside, rates, contact)
- **E-mail** — `info@tisztitlakkecskemet.hu` is a guess
- **Rental prices** — the rates table reads "Kérj ajánlatot" for all four machines. The
  two delivery fees are real.

## Regenerating screenshots

```sh
npx http-server -p 8181 -s .
node tools/shoot.mjs     # full-res renders
node tools/deliver.mjs   # versions that fit an 8000px upload ceiling
```

`tools/review.mjs <dir> <width> <desktop|mobile>` slices the page into 1000px bands for QA.
