# Varázshegy TSMT — landing page prototype

Demo for **Varázshegy TSMT Terápiás Műhely**, Szeged (`tsmtszeged@gmail.com`).
Static single page: no build step, no CMS, no third-party runtime requests.

## Research this was built from

Terápiás műhely at **Szeged, Brüsszeli krt. 29.** Szenzomotoros and logopédiai
állapotfelmérés, plus egyéni and csoportos TSMT tréning. TSMT = Tervezett
Szenzomotoros Tréning, **Lakatos Katalin**'s method: targeted movement work that
supports nervous-system maturation, heavily focused on the vestibular system
(balance and body-position sense). Used for megkésett mozgás- és beszédfejlődés,
tanulási, magatartási and szociális beilleszkedési nehézségek, and iskolaérettség.

**They already have a site** (tsmt-szeged.com), so this is a redesign pitch, not
a "you have no website" pitch.

## Design

The reader is an anxious parent, so the page is calm and plain-spoken rather than
either cartoonish or clinical. Warm paper ground, deep petrol for trust, one
restrained amber. The hero carries a reassurance card — *"Mindig felméréssel
kezdünk… és az is kiderül, ha éppen nem TSMT-re van szükség"* — because the most
common worry is being sold a therapy you don't need.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FBF8F4` | warm page ground |
| `--paper-2` | `#F3EDE5` | cards, alternating sections |
| `--ink` | `#1E2A2E` | text, footer |
| `--teal` | `#174F55` | primary — 8.6:1 on paper |
| `--amber` | `#C97B2E` | accent, used sparingly |

Type: **Outfit** for display, **Plus Jakarta Sans** for body. Self-hosted, so no
Google Fonts call and no GDPR exposure. Headings sit at line-height 1.12 —
Hungarian capital diacritics (Á É Ő Ű) need the headroom.

The "kinek segít" section is deliberately written as symptoms a parent would
recognise in their own words, not as diagnostic categories.

## The booking form

Posts to **Web3Forms** → their inbox. No server, no database.

1. Free key at <https://web3forms.com>.
2. Replace `WEB3FORMS_ACCESS_KEY` in `data-access-key` on `<form id="bookForm">`.

Until then it runs in demo mode and says so — it never pretends a mail was sent.
Formal register throughout (magázás), with a required GDPR consent box.

## Placeholder — confirm with them

- **All service descriptions, durations and prices** — not published anywhere.
- **The `#mi-ez` and `#kinek` copy** — accurate to the method, but not their words.
- **Age range served** — deliberately not stated; sources disagreed.
- **Who the therapists are** — no names on the page yet.
- **Opening hours and phone** — not on the page at all.

## Regenerating screenshots

```sh
npx http-server -p 8185 -s .
node tools/shoot.mjs && node tools/deliver.mjs
```
