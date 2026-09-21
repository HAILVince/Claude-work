# Tisztítlak Kecskemét — website redesign demo

A modern, flat redesign concept for **tisztitlakkecskemet.hu** (cleaning-machine rental,
Kecskemét). Static site — no build step, no dependencies. Open `index.html` or serve the
folder.

```
index.html      markup + all inline SVG artwork
styles.css      design tokens + layout
script.js       sticky header, mobile menu, scroll reveal
assets/         favicon
screenshots/    full-page PC + mobile renders
tools/          Playwright capture scripts
```

## Design constraints

Per brief: **no gradients, no cards, no stat bars.** Everything is flat colour, hairline
rules and open grids — there is not a single `linear-gradient`, `box-shadow`, or progress
bar in the stylesheet. The "abstract" layer is a set of flat geometric marks (circles,
arcs, quarter-rounds, a droplet) built as inline SVG, used as composition rather than
decoration.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--navy` | `#0B3D64` | headings on light, buttons, delivery block |
| `--navy-deep` | `#072B47` | footer, button hover |
| `--cyan` | `#29ABE2` | graphic accents, fills, marks |
| `--cyan-ink` | `#1B8CBE` | accent **text** (meets 3:1 on white; `--cyan` does not) |
| `--tint` | `#E8F5FC` | contact section, SVG fills |
| `--grey` | `#F4F7FA` | alternating section background |
| `--ink` | `#0E1B26` | body text |
| `--muted` | `#5A6B78` | secondary text |
| `--line` | `#DDE5EC` | hairlines |

All defined on `:root` in `styles.css` — change them there and the whole site follows.

## Placeholders to replace before this goes live

Marked with `<!-- ... -->` comments in `index.html`:

- **Phone number** — `+36 00 000 0000` appears in the header, mobile menu, rates section
  and contact list (`tel:+36000000000`).
- **E-mail** — `info@tisztitlakkecskemet.hu` is a guess.
- **Rental prices** — the rates table says "Kérj ajánlatot" for every machine. The two
  delivery fees (1 000 Ft / 2 000 Ft) and the delivery windows are real.
- **Machine line-up** — five machines drawn from the current site's copy; confirm the
  actual inventory.

## Regenerating the screenshots

```sh
npx http-server -p 8181 -s .
node tools/shoot.mjs
```

Outputs `desktop-full` (1440w @2x), `mobile-full` (390w @3x) and the two above-the-fold
crops into `screenshots/`. `tools/review.mjs <dir> <width> <desktop|mobile>` slices the
page into 1000px bands for visual QA.
