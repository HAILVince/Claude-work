
# NE KÜLDD EL — rossz céghez készült

2026. szeptember 22-én Heit Lóránd Levente maga tisztázta:

> „A Heit Pincének vagy a Heit Zenekarnak lenne a demo. A torma weboldal
> rendben van."

Ez a demó tehát tárgytalan. A tormás oldalukkal elégedettek. A pincészet
demója a `heit-pince/` mappában van, az megy ki.

A mappa azért marad meg, mert a kutatás és a felépítés újrahasznosítható, ha
valaha mégis szóba kerül a torma — de küldeni nem szabad.

# Heit Torma — landing page prototype

Demo for **Heit Lóránd Levente** (Heit Torma, Létavértes / Pocsaj —
`heit.lorand@gmail.com`, +36 70 362 4566). Static single page: no build step,
no CMS, no database, no third-party requests at runtime.

```
index.html      markup
styles.css      design tokens + layout
script.js       header, mobile menu, order form
assets/fonts.css + assets/fonts/   self-hosted webfonts (4 woff2)
screenshots/    PC + mobile renders
tools/          Playwright capture scripts
```

## Research this was built from

Family horseradish grower and processor. Cultivation in **Létavértes**, the home
of Hungarian horseradish (Hajdú-Bihar); processing plant in **Pocsaj**; family
recipes, processing since **2012**, first-class Hajdúság raw material only.
Products: **natúr ecetes torma**, **torma almával**, **torma mézzel**.
Lactose-, gluten- and dye-free, suitable for a vegan diet. Horseradish is a
hungarikum. Also retailed through Termelői Kosár, nekedterem.hu, GROENK Deli and
Öreghegyi Kézműves Hús.

The strongest differentiator in the public material: their horseradish is made
**without sweetener and without preservative**, which is apparently hard to find.
The whole page is built around that, and the *Miért más* section states it as a
list of what is deliberately left out.

## ⚠️ Two things to get right before quoting

**1. The outreach went to the wrong business.** The original email addressed
"Heit Pince" and referenced `heit.hu` — the **winery**. Lóránd replied signing
with `heittorma.hu` — the **horseradish** business. Same family, two companies.
This demo is built for Heit Torma. Do not mention the winery.

**2. `heittorma.hu` has `/termek/` product pages.** If it has a working cart,
this is not a 90k presentation site. The demo includes an **order enquiry
form**, not a shop. Quote the 60–120k range explicitly for a presentation site
and ask separately whether online ordering is needed — if it is, price it like
the Culinary Institute job.

## Design

Horseradish is sharp, not cosy — so the page is crisp and editorial rather than
warm-rustic, which is what every other artisan food site wears.

| Token | Hex | Use |
|---|---|---|
| `--bone` | `#F6F4EE` | page ground — grated root, paper label |
| `--bone-2` | `#EDEAE1` | facts strip, alternating sections, photo slots |
| `--ink` | `#17150F` | text, buttons, footer — warm near-black |
| `--soil` | `#26221A` | *Rólunk* and order blocks |
| `--leaf` | `#3F5A2E` | accent (7.0:1 on bone) |
| `--muted` | `#6B6558` | secondary text |

Type is **Fraunces** for display — a variable serif run at `opsz 120, SOFT 28,
WONK 1`, which gives it the slightly irregular, cut-not-drawn quality that suits
a family producer. Measured to confirm the axes are live: the same string sets
428px at `WONK 1 / opsz 120` vs 510px at `WONK 0 / opsz 9`. Body and labels are
**Archivo**. Both self-hosted — no Google Fonts call, no GDPR exposure.

## The order form

Posts to **Web3Forms**, forwarding straight to his inbox. No server, no database.

1. Free access key at <https://web3forms.com> using his address.
2. Replace `WEB3FORMS_ACCESS_KEY` in `data-access-key` on `<form id="orderForm">`.

Until then it runs in **demo mode**: validates properly, shows the success state,
and says plainly that it is a demo. It never pretends an order was sent. Fields:
name, e-mail, phone, delivery location, the order itself, and a required GDPR
consent box. Hidden honeypot for spam.

## Placeholder — confirm with Lóránd

- **All three product photos.** Slots are 4:5 portrait.
- **Product descriptions** in `#termekek` — plausible, but not his words.
- **The `#rolunk` copy** — assembled from public sources, needs his voice.
- **Jar sizes and prices** — not on the page at all; he never gave them.
- **The retailer list** — from search results; confirm it is current.
- **Whether `heittorma.hu` sells online today.**

## Regenerating screenshots

```sh
npx http-server -p 8183 -s .
node tools/shoot.mjs      # full-res
node tools/deliver.mjs    # sized under an 8000px upload ceiling
```
