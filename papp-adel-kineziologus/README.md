# Papp Adél — landing page prototype

Demo for **Papp Adél**, okleveles One Brain és Brain Gym kineziológus,
Debrecen, Kassai u. 83. (`pappadel.debrecen@gmail.com`, current site
`pappadel.com`). She replied on 22 Sept:

> *"Nem zárkózom el előle, ha küld egy demo oldalt, szívesen megnézem!
> Számomra az időpontfoglaló sarkalatos kérdés, legyen kedves arról is
> tájékoztatni, hogyan működne, továbbá az árakról is szeretnék
> tájékoztatást (havi költség lenne, vagy egyszeri?)"*

So the letter has three jobs: the demo, **how booking would work**, and
**one-off, not monthly**. Magázás in the letter (that is how she wrote);
the page itself keeps her own tegező voice.

## What this was built from

Her own site, page by page (`pappadel.com` is blocked from this environment's
shell, so everything came through WebFetch):

- **Főoldal**: tagline *"Légy szabad, légy kiegyensúlyozott!"*, the three
  service one-liners (kineziológia, neurofeedback, családállítás), and her
  numbers: **15+ év, 10+ okleveles képzés, 1000+ elégedett ügyfél**
- **Szolgáltatásaim**: One Brain (*"A romboló mintákat hordozó eseményeket
  felidézzük, és korrigáljuk"*), Brain Gym (*"Mozgásokból, gyakorlatokból
  áll, mindenféle tanulást megkönnyítenek"*), családállítás, egyéni vagy
  csoportos
- **Rólam**: born 1975 in Berettyóújfalu, lives in Debrecen, trained as a
  tanító and szakközgazdász; természetgyógyász, One Brain konzulens oktató,
  Brain Gym kineziológus
- **GYIK**: what happens in a session, muscle testing, one issue per session,
  **minimum two weeks between sessions**, painless, confidential, **24-hour
  free cancellation**, **mostly cash**, **free street parking, car parks 300 m
  away**, **children from 6-7**, what a child says stays confidential
- **Időpontfoglalás**: an embedded **LeadConnector** (GoHighLevel) booking
  widget

Every FAQ answer on the demo is hers, shortened. The "Miben segít" cards
expand the list in her FAQ (párkapcsolat, munkahely, női egészség,
szexualitás, szülő-gyermek) plus the Brain Gym learning list.

## Worth telling her whether or not she buys

**Her live homepage has template testimonials.** The "Happy Clients" block
shows *John Doe, CEO, ABC Company*, *Jane Smith, Marketing Manager* and
*Mike Johnson, Sales Representative*, in English, praising "LifeVista"
coaching. Anyone who scrolls that far sees a page nobody finished. The
letter mentions it plainly and kindly; it is the most concrete reason to
change sites that we have.

Also: the homepage advertises **neurofeedback**, but the link behind it
opens the kinesiology page. The demo keeps a neurofeedback card with her own
one-liner; the letter asks whether she offers it.

## The booking answer

What is on the page is a three-step flow (service → day and time → name and
e-mail) running on **invented slots**, and it says so under the button.
The live version is not this widget: the free slots come from whichever
calendar she picks, and the page embeds it in its colours as far as that
tool allows. Two honest routes, both in the letter:

1. **Keep the booking she already has.** The LeadConnector calendar can be
   embedded in the new page as it is; her bookings, calendar and
   confirmation mails carry on unchanged.
2. **Drop the monthly fee.** LeadConnector is a paid platform. If she pays
   monthly for it (or for the whole current site, which looks
   GoHighLevel-built), a free booking calendar tied to her own calendar does
   the same job. We only name this as an option and ask what she pays now;
   we do not promise reminder e-mails or any other paid-tier feature.

## The price file

`arak.txt` holds the prices; she edits it in the browser on GitHub and the
page reads it. The same list is baked into `index.html` by `tools/bake.mjs`,
both sides through `assets/price-parse.js`, so the page works with
JavaScript off, and a broken file leaves the baked list standing.
**No maintenance is offered** (`emails/ARAK.txt`).

**Every amount and duration in it is invented.** Only the three
"Tudnivalók" rows (cancellation, payment, parking) are hers.

## Placeholder — confirm with her

- **All prices and durations**
- **Neurofeedback**: offered or not, and what it involves
- **Group constellation**: whether she runs groups, how often, where
- **Photo**: the "Rólam" frame is empty on purpose; no stock image on a page
  about a real practitioner
- **Phone number and e-mail on the page**: none shown; the booking flow is
  the contact route until she says otherwise
- **15+ év** (homepage) vs **"több mint két évtizede"** (Rólam): both kept
  where she wrote them; worth one question

## Design

Calm, not mystical: warm paper, deep sage for structure, one plum for
action. No lotus, no chakra colours, no stock hands.

| Token | Hex | Use |
|---|---|---|
| `--shell` | `#F7F4EF` | page ground |
| `--sage` | `#ECEAE2` | banded sections |
| `--deep` | `#2E3D36` | booking band, footer |
| `--accent` | `#7A3F63` | buttons, plum; 7.7:1 under white |
| `--amber` | `#F6EEF2` | soft plum panels |

Type: **Lora** 500/600 display, **Figtree** 400/500/600 body, self-hosted
(no Google Fonts request).

## Verification

`tools/smoke.mjs`: no console errors; 9 price rows from `arak.txt`; six
booking days with one full day disabled; empty submit flags the slot and
three fields; a booking confirms and removes the slot; no horizontal overflow
at 360, 390, 414, 600, 768, 860, 1000, 1280 and 1440.

## Files

```
index.html       one page; prices live between the arak markers
arak.txt         the price list she edits
styles.css       tokens, layout, breakpoints
script.js        price loader, menu, reveal, demo booking flow
assets/price-parse.js   shared by the browser and the build
tools/bake.mjs   write arak.txt into index.html
tools/fonts.mjs  rebuild the self-hosted font set
tools/smoke.mjs  behaviour + width sweep · shoot/deliver/review.mjs  images
```

Serve from this directory on port 8191 (`python3 -m http.server 8191`)
before running any of the tools. Re-run `node tools/bake.mjs` after editing
`arak.txt` here. The two PNGs for the letter are
`screenshots/desktop-full.png` and `screenshots/mobile-full.png`.
