# Demo design brief

Every customer demo in this repo follows this brief. Read it before you write any CSS.
The goal: the page should look like a careful human designer made it for this one
business. It should not look like a template or like something an AI generated.

## Hard rules

1. **Corners are square.** `border-radius: 0` on cards, sections, images, photo frames,
   inputs and tables. Buttons may have at most `2px`. No pills, no arches, no
   rounded cards, and no `50%` circles except a real round logo or avatar.
2. **One font, one colour per piece of text.** A heading, paragraph, button or label
   uses a single font family, a single weight and a single colour from start to end.
   Never do "Plain words *accent words*" with an italic, a second typeface or a gold
   span in the middle of a heading. No `<em>` or `<span class="accent">` used for colour.
3. **At most two font families on the whole page**, one for headings and one for body
   text. One family for everything is often better.
4. **One accent colour.** Use it for buttons and links only, not for decorating text.
   Everything else is ink, a lighter grey of the ink, and one or two background tones.

## Things that make a page look AI-made. Do not use them

- Eyebrow labels in small spaced capitals above every heading ("ABOUT", "OUR SERVICES").
  At most one on the page, or none at all.
- Numbered cards ("01 / 02 / 03"), and rows of three identical cards with icons.
- Gradients, glows, glassmorphism, blurred blobs, soft drop shadows under everything.
- Decorative ornaments such as stars, rings, sparkles or divider flourishes.
- Emoji and generic icon sets in place of content.
- "Stat strips" such as "2004 · since" / "100+ · guests" unless the number really matters.
- Slogan-style headings that could fit any business ("Your journey starts here",
  "Where quality meets passion"). Headings name the thing itself: "Árak", "Órarend",
  "Szobák", "Esküvők a pincében".
- Fade-in or slide-in animation on every section. No scroll animation at all is fine.
- Everything centred. Left-align body text and most headings.
- The same section rhythm on every demo: hero, three cards, quote band, split image/text,
  prices, contact. Vary the structure to fit the business.

## What to do instead

- **Start from the business.** Use their real words, real prices, real opening hours,
  real place names. A butcher's site looks like a shop board, a winery's like a wine list,
  a lawyer's like a letterhead. Take the look from their trade, not from a web trend.
- **Typography does the work.** Choose one good typeface that suits the trade, set clear
  sizes (for example 16–18px body, a large heading and one step between), and give
  generous line height and white space. Hierarchy comes from size and weight, not colour.
- **Real layout.** Use a simple grid with clear alignment, visible hairline rules
  (1px lines) to separate things, and tables or plain lists for prices and schedules.
- **Colour.** Take the palette from the business (their sign, logo or products). Keep it
  to 3–4 colours in total. Text contrast must pass WCAG AA.
- **Photos.** Only the customer's own photos. Until they arrive, use plain rectangular
  placeholders with a thin border and a short label ("Fotó: a bolt pultja"). No stock photos.
- **Copy.** Short, plain Hungarian, the way the owner would say it. No marketing filler,
  no exclamation marks in headings, no clichés of the trade.
- **Mobile first.** It must look right at 360px wide, with no horizontal scroll,
  and the phone number must be one tap away.

## Before you send a demo, check

- [ ] `grep -n "border-radius" styles.css` shows only `0` or ≤ `2px`.
- [ ] No heading or paragraph contains a second font, italic accent or coloured span.
- [ ] At most two font families are loaded.
- [ ] None of the "AI-made" patterns above appear.
- [ ] Screenshots read at desktop and 360px mobile, with nothing overflowing.
