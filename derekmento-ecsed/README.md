# DerékMentő — landing page prototype

Demo for **Sebestyén Tamás** (`derekmentoecsed@gmail.com`) — DerékMentő,
manuális gerinckezelés, Ecséd. He replied on 21 Sept: *"Kíváncsi vagyok mit
tudsz ajánlani. Megnézném a demót és kíváncsi vagyok milyen tartalommal adnád
az oldalt."*

## What this was built from

**Almost nothing, and that is the single most important thing to know.**
There is no reachable website, and searching turns up nothing for DerékMentő,
for Ecséd, or for his name — only unrelated manual-therapy practices
elsewhere in Hungary. So the page rests on four facts:

- the business name **DerékMentő — Manuális gerinc kezelés**
- the town, **Ecséd**
- his name, **Sebestyén Tamás**
- his e-mail, which the form and footer point at

**Every complaint, every step, every price, every FAQ answer and the whole
contraindication list is a proposal.** The reply says so outright and asks him
to go through it line by line. Nothing here may go live unread by him — and in
this trade that is not a formality, because the text speaks about what he does
to people's spines.

## The thesis

Someone lands on this page in pain, usually on a phone, usually after putting
it off for weeks. Three things stop them booking:

1. **Not knowing whether this is even their problem** — six plain complaint
   cards, written as symptoms people recognise, not as diagnoses.
2. **Not knowing what will happen to them** — a four-step account of the
   session, including that nothing happens unannounced and they can say stop.
   Plus what the days after feel like, so a normal ache does not read as
   something having gone wrong.
3. **Not daring to ask the price** — the prices are on the page.

## The section most sites leave out

**"Amivel nem hozzám kell jönni."** Three panels, the first one set apart in
its own colour:

- **Straight to a doctor**: numbness or weakness in a limb, loss of bladder or
  bowel control, pain after a fall or blow, fever, unexplained weight loss,
  night or rest pain. These are standard red flags for spinal complaints.
- **Ask your doctor first**: osteoporosis, cancer or its treatment,
  anticoagulants, recent surgery or a prosthesis, pregnancy.
- **Bring your imaging**, and a plain statement that he does not diagnose and
  does not prescribe — if he sees something for a doctor, he sends them there.

A footer line repeats that the page does not replace a medical examination.
This costs him a handful of bookings and buys back the ones that could have
ended badly; it also reads, to anyone deciding whom to trust, as the only
honest page of the five they are comparing. **He must confirm this list**, and
the reply asks him to.

## The price file

`arak.txt` holds the prices; he edits it in the browser on GitHub and the page
loads from it. The same numbers are baked into `index.html` by
`tools/bake.mjs`, both sides going through `assets/price-parse.js`, so the
page works with JavaScript off and the two cannot disagree. The loader fails
soft — missing, emptied, comment-only, pipe-less or pasted-over files all
leave the baked list standing. **No maintenance is offered** (`emails/ARAK.txt`).

## Design

Plain and solid: warm paper, deep slate structure, one rust for action. Large
type, short lines, nothing decorative — the reader is uncomfortable and on a
phone.

| Token | Hex | Use |
|---|---|---|
| `--shell` | `#F5F3F0` | page ground |
| `--sage` | `#EAE6E0` | complaints, prices |
| `--deep` | `#22303B` | the "when not to come" band, footer |
| `--accent` | `#A8521C` | buttons — 5.40:1 under white |
| `--amber` | `#FBF0E2` | what the days after feel like |

Type: **Bitter** 500/600 display, **IBM Plex Sans** 400/500/600 body,
self-hosted. Both variable, so 10 `@font-face` blocks share 4 files.

## What is deliberately not on the page

- **No photos.** None exist here, and stock hands on a stock back would be a
  lie on a page about a real practitioner.
- **No phone number.** Not known. The whole page routes to the form; the reply
  asks for a number, and a call button is the first thing to add when it
  arrives — for this audience it will outperform the form.
- **No address, no opening hours, no qualifications, no years of experience,
  no testimonials.** All of it would have been invented.
- **No medical claims.** Nothing says a treatment cures anything.

## Verification

- Twelve widths, 360–1440: no horizontal overflow, nothing clipped.
- Price file: 6 rows in 3 groups; an edit shows up; six ways of breaking the
  file fall back to the baked list; partial damage keeps what parses; a
  sentence in the price column wraps instead of pushing the grid off-screen at
  360px; file text is escaped, not parsed as markup.
- Form: empty submit flags three fields, `abc` rejected as a contact, a phone
  accepted as readily as an e-mail, success clears the form.
- Mobile menu opens, closes on link tap and Escape, `aria-expanded` tracks it.

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

Serve from this directory on port 8190 (`python3 -m http.server 8190`) before
running any of the tools. Re-run `node tools/bake.mjs` after editing
`arak.txt` here.
