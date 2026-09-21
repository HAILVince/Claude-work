# Vamos Tattoo — landing page prototype

Demo for **Vámos Norbert** (Vamos Tattoo, Szolnok — `tattoo.vamos@gmail.com`).
Static single page: no build step, no CMS, no database, no third-party requests at
runtime. Open `index.html` or serve the folder.

```
index.html      markup
styles.css      design tokens + layout
script.js       header, mobile menu, booking form
assets/fonts.css + assets/fonts/   self-hosted webfonts (4 woff2)
screenshots/    PC + mobile renders
tools/          Playwright capture scripts
```

## Built against his brief

From his reply of 21 Sept:

| He asked for | Where it is |
|---|---|
| "csak egy landing oldal" | One page, one scroll |
| "nem igényel nagy karbantartást" | Static HTML/CSS/JS. Nothing to update, nothing to patch, no login |
| "h megismerjenek" | `#rolam` — intro in first person |
| "a fontos infók szerepeljenek" | `#infok` — age limit, deposit, pricing, prep, hygiene, aftercare |
| "pár munkám" | `#munkak` — 6-slot gallery |
| "bejelentkező form ami az emailemre beérkezik" | `#idopont` — see below |

## The booking form

Posts to **Web3Forms**, which forwards straight to his inbox. No server, no
database — which is what "no maintenance" actually requires.

To go live:

1. Get a free access key at <https://web3forms.com> using `tattoo.vamos@gmail.com`.
2. Replace `WEB3FORMS_ACCESS_KEY` in the `data-access-key` attribute on `<form id="bookForm">`.

Until then the form runs in **demo mode**: it validates properly and shows the success
state, but says plainly that it is a demo. It never pretends a mail was sent.

Fields: name, e-mail, phone, preferred timing, size, placement, the idea, a reference
link, and a GDPR consent checkbox (required — the form collects personal data from EU
residents). There is a hidden honeypot field for spam.

## Design

Monochrome. Black ink is literally the product, so no hue carries meaning here —
hierarchy comes from weight, scale and negative space instead. It is also the one
palette that will never fight his photographs once they are in.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0A0A0B` | page ground |
| `--ink-2` | `#141417` | strip, gallery tiles, booking block |
| `--bone` | `#EDE9E3` | text, buttons |
| `--dim` | `#918D87` | secondary text |

Type is **Archivo** used across two width axes — `wdth 68` heavy condensed for display
(the poster/flash-sheet voice), normal width for body — plus **Great Vibes** once, for
the signature under the intro. Fonts are self-hosted, so no Google Fonts call and no
GDPR exposure.

The gallery is a packed flash-sheet grid: one 2×2 feature plus five squares, which
tessellates exactly into 3×3. Every slot is 1:1, so Norbert only needs to send square
crops.

## What is placeholder — confirm with Norbert before sending live

Research found his Instagram ([@vamos_tattoo](https://www.instagram.com/vamos_tattoo/))
and Facebook page (Vamos tattoo, Szolnok), but those pages could not be read from here,
so the following is written-in and needs his confirmation:

- **All six gallery photos.** Nothing real is in the page. Ask for 6 square shots.
- **The `#rolam` copy** — plausible, but not his words.
- **`#infok` values** — age limit, deposit, pricing and prep are standard studio
  practice, not quoted from him. Confirm each.
- **Studio address and opening hours** — not in the page at all yet; he never gave them.
- **His domain.** He wrote "már van is éles domainem" but did not say what it is.
- **Whether he does piercing** — the Facebook category says "Tattoo & Piercing Shop".

## Regenerating screenshots

```sh
npx http-server -p 8182 -s .
node tools/shoot.mjs      # full-res
node tools/deliver.mjs    # sized under an 8000px upload ceiling
```
