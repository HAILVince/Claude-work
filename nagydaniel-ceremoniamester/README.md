# Nagy Dániel, ceremóniamester — landing page prototype

Demo for **Nagy Dániel** (`nagydaniel.ceremonia@gmail.com`, +36 30 59 44 888),
wedding MC. He replied to the outreach on 23 Sept, asked for the demo, for a
price, and — specifically — for what the price covers, naming *"későbbi
üzemeltetés"* as an example. He also said any actual build would land in
**early 2027**.

## The thesis

His own words: he builds the site in Canva, the domain is managed there too,
*"és igen borzasztóan kezeli a reszponzív dinamikát, ezért most ki is
kapcsoltam az oldalon."* He turned his own website off because it fell apart
on a phone.

So the argument here is not that the page is prettier. It is that **a
ceremóniamester's traffic is overwhelmingly phone traffic** — a bride
forwards a link to her fiancé, her mother and two friends, and every one of
them opens it standing up — and this page is built for that first.
`tools/check.mjs` sweeps every page at thirteen widths starting at **320px**,
and nothing is allowed to overflow at any of them.

## What this was built from

Little, and that is worth being honest about. `nagydaniel.info` is blocked
from this environment, so the page rests on:

- his name, title and the two contact details in his own signature
- the fact, from search results, that he is a **ceremóniamester** whose
  public positioning is humour, a theatrical background, and working with
  couples whose ideas do not fit the usual template
- his e-mail

**Everything else on the page is a proposal.** The "Rólam" text, the four
process steps, the ceremóniamester-vs-szertartásvezető explainer and every
date in `idopontok.txt` are written by us, in a voice we guessed at. The
covering e-mail says so in as many words. Nothing here should go live
unread by him.

Two things were deliberately *not* invented:

- **No testimonials.** Search results paraphrase two reviews from his site,
  but a paraphrase is not a quote, and a made-up wedding testimonial on a
  wedding professional's page is the worst possible lie to be caught in. The
  section is an empty, clearly-labelled slot.
- **No photographs.** There are none of him, so the design carries itself
  typographically instead of leaving grey boxes everywhere.

## The editable file

Same mechanism as the other builds, aimed at the thing that actually goes
stale for an MC: **which dates are still free.** Couples book eighteen months
out, so this list changes more often than anything else on the site, and it
is exactly the kind of change that makes people think they need a
maintenance contract.

`idopontok.txt`:

```
## 2027. május
május 8. | szabad
május 15. | foglalt
> A május a legkeresettebb hónap, ezek fogynak elsőként.
```

He opens the file in a browser, changes a word, saves, and the page shows it
a minute later. No build step, no CMS, no developer.

The parser (`assets/list-parse.js`) is shared by the browser and by
`tools/bake.mjs`, which writes the current list into `index.html` between the
`idopontok` markers — so the page works with JavaScript off, Google sees real
dates, and the baked copy can never disagree with the file.

It fails soft in one direction on purpose: anything it does not recognise as
*foglalt* is shown as free. A typo then costs him an e-mail he turns down,
rather than hiding a date he could have sold. A file that parses to nothing
leaves the baked calendar standing rather than emptying the section.

A free date is a button: clicking it fills the booking form with that date,
full year included, and moves focus to the form.

## What is on the page

1. Hero — the claim, the two contact details, two CTAs
2. **Ceremóniamester vagy szertartásvezető?** — the question every couple
   asks first. Genuinely useful, and the strongest SEO asset here, because
   people search that exact phrase
3. Rólam
4. Hogyan dolgozunk — four steps from the first e-mail to the day
5. Szabad időpontok — from `idopontok.txt`
6. Vélemények — empty slot, see above
7. Jelentkezés — form; the date is required, because without it the reply
   would only be a question about the date
8. Footer, `adatkezeles.html`, `404.html`, Axióma credit

The privacy notice is written and says of itself that it is incomplete: the
bracketed company identifiers have to be filled in before launch. What it
does state truthfully is that there are no cookies and no analytics, and
that the webfonts are self-hosted, so no third party hears about a visitor
before they write.

## Running it

```
npx http-server -p 8194 -s .
node tools/fonts.mjs     # re-download the self-hosted webfonts
node tools/bake.mjs      # write idopontok.txt into index.html
node tools/check.mjs     # 13 widths × 3 pages, calendar, form, menu
node tools/shoot.mjs     # screenshots
node tools/deliver.mjs   # the two renders that go in the e-mail
```

## What the covering letter commits to

- **80 000 Ft** quoted in the letter sent 24 Sept (Vince's fixed rate is now 90 000 Ft) for this scope, one-off.
- Hosting free on GitHub Pages; the only recurring cost is his own domain,
  wherever he keeps it.
- **No maintenance, stated plainly** — the dates file is the answer to his
  "üzemeltetés" question, not a contract.
- E-mail only.

He is planning for early 2027, which is fine and was not argued with.
