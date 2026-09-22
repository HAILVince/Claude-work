# Mindent megjavítok — landing page prototype

Demo for **Kozák Ádám E.V.** (`mindentmegjavitok2025@gmail.com`) —
háztartásigép-szerviz, Debrecen. He replied on 21 Sept: *"Szia! Kérnék egy
ingyenes demót!"* Current site: `mindentmegjavitok.webnode.hu`.

## What this was built from

His own site is blocked by the egress proxy here, but unlike the previous two
he has a real public footprint, so most of this page rests on facts rather
than guesses. From his JóSzaki profile, a Piros Katalógus listing and search
summaries of his Webnode site:

- **Debrecen és 70 km-es körzete**
- repairs **mosógép, szárítógép, mosogatógép, porszívó, olajsütő/airfryer,
  mikró, televízió, elektromos kerti gépek**
- **villanybojler** beszerelés, javítás, vízkőtelenítés, and **Ariston
  garanciális javítás**
- **he collects the appliance and brings it back**, including at weekends and
  on weekday afternoons — this is genuinely unusual and gets its own band
- reviews describe him as pontos, precíz, gyors, korrekt áron

**The prices are the guesses.** Every figure in `arak.txt` is invented, and
the reply says so first. The JóSzaki reviews are real but are not reproduced
on the page — republishing someone else's platform's reviews is his call, and
the reply offers it as an option.

## The thesis

Someone lands here with a dead washing machine, on a phone, today. The page is
ordered by what they need to decide, in the order they decide it:

1. **Does he fix mine?** Eight tiles written as symptoms — *nem centrifugál,
   áll benne a víz, hibakódot ír ki* — not as a service list. The eighth tile
   is an invitation for everything not listed.
2. **Does he come to me, or do I have to haul it somewhere?** The four-step
   band answers this, and the amber callout carries the thing his competitors
   mostly cannot offer: pickup and return, weekends and weekday afternoons.
3. **What will it cost?** Prices on the page, with the alkatrész always quoted
   before fitting.
4. **Is it even worth repairing?** The first FAQ says he will tell you when it
   is not. For a repair trade this is the strongest trust signal available,
   and it costs him only the jobs he would have lost anyway.

The boiler work gets its own section rather than a tile: *bojler
vízkőtelenítés Debrecen* is its own search, and the Ariston warranty
authorisation is a credential, not a service.

The form asks for the thing that actually saves him a trip — brand, type
number, fault code, and the town — and says why: with those he can often
diagnose before setting off and bring the part with him.

## The price file

`arak.txt` holds the prices; he edits it in the browser on GitHub and the page
loads from it. The same numbers are baked into `index.html` by
`tools/bake.mjs`, both sides going through `assets/price-parse.js`, so the
page works with JavaScript off and the two cannot disagree. The loader fails
soft on a missing, emptied, comment-only, pipe-less or pasted-over file.
**No maintenance is offered** (`emails/ARAK.txt`).

## Design

Workshop signage: cool paper, near-black navy structure, one amber for the
two things worth stopping at (the pickup promise, the step numbers). Buttons
are navy rather than amber — on this page the amber is a highlighter, not an
action colour.

| Token | Hex | Use |
|---|---|---|
| `--shell` | `#F2F3F5` | page ground |
| `--sage` | `#E6E9EC` | appliances, prices |
| `--deep` | `#17232F` | process band, footer, buttons |
| `--amber` | `#E3A81C` | pickup callout, step numbers — ink on it at 8.2:1 |

Type: **Archivo** 600/700 display, **Lato** 400/700 body, self-hosted. Lato is
not a variable font, so 8 `@font-face` blocks map to 6 files here.

## A bug this demo caught, fixed everywhere

The header call-to-action rendered **dark text on its own dark fill** on every
site built so far. `.nav a { color: var(--ink) }` has specificity (0,1,1) and
`.btn-p { color: #fff }` only (0,1,0), so the nav rule won wherever the button
sat inside `.nav`. It was survivable on the rose and green palettes and
invisible on this navy one. Fixed in all four stylesheets by restating the
colour at `.nav a.btn-p`, and the delivery screenshots for the three unsent
demos were re-rendered. The two already sent (Gazdi-Ker, Sminktetoválás) went
out with it.

## Verification

- Twelve widths, 360–1440: no horizontal overflow, nothing clipped.
- Price file: 10 rows in 4 groups; an edit shows up; six ways of breaking the
  file fall back to the baked list; partial damage keeps what parses; a
  sentence in the price column wraps rather than pushing the grid off-screen;
  file text is escaped, not parsed as markup.
- Form: empty submit flags four fields (name, contact, appliance, town),
  `abc` rejected as a contact, a phone accepted as readily as an e-mail.
- Mobile menu opens, closes on link tap and Escape, `aria-expanded` tracks it.

## What is not on the page

- **No phone number.** Not known — and for this trade it is the single most
  valuable thing to add. The reply asks for it and says the call button goes
  first once it arrives.
- **No photos, no testimonials, no years of experience, no brand list.**
- **No guaranteed callout time.** The FAQ says he writes back with the
  earliest slot rather than promising same-day.

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

Serve from this directory on port 8191 (`python3 -m http.server 8191`) before
running any of the tools. Re-run `node tools/bake.mjs` after editing
`arak.txt` here.
