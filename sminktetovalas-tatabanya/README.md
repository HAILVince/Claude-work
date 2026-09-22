# Sminktetoválás Tatabánya — landing page prototype

Demo for **Fogarasi Viktória** (`fogvik@gmail.com`) — szemöldök, szemhéj és
ajak sminktetoválás, Tatabánya. She replied to the outreach on 22 Sept and
asked for a rough price.

## What this was built from

Almost nothing, and that is worth being honest about. Her site,
`sminktetovalastatabanya.hu`, is down (the hosting stopped; the domain is
still hers), and Facebook is blocked from this environment. So the page rests
on four facts and nothing else:

- the business: **sminktetoválás in Tatabánya**, run by **Fogarasi Viktória**
- the three treatments named in her old page title: **szemöldök, szemhéj, ajak**
- her e-mail address, which the form and the footer point at
- her own complaint, quoted in the reply: her price list could not be updated

**Everything else on the page is a proposal** — the treatment descriptions,
the healing timeline, the pre-treatment rules, the contraindications and every
price. The reply asks her to correct them, and the README for the next person
should say the same. Nothing here should go live unread by her.

## The thesis

She is not switching because her old site was ugly. She is switching because
**she could not get a number changed once a year.** So the page is built so
that the part that goes stale is the part she owns.

`arak.txt` holds the price list, in the plainest format that still has
structure:

```
## Szemöldök
Púderes szemöldök | 68 000 Ft
> Az árban benne van a konzultáció és a 4-6 héttel későbbi korrekció.
```

She opens that file on GitHub in a browser, changes a number, saves, and the
page shows it a minute later. No build step, no CMS, no developer, and
**no maintenance promised by us** — which is the standing rule in
`emails/ARAK.txt`.

The prices are **also baked into `index.html`**, between the `arak:start` and
`arak:end` markers, by `tools/bake.mjs`. That way the page is complete with
JavaScript off and Google sees real numbers rather than an empty box. Both the
baked copy and the live render come from `assets/price-parse.js`, so they
cannot disagree about what the file means. The baked copy is a fallback only:
once she starts editing, `arak.txt` is the truth and the fallback slowly goes
stale, which matters to nobody who has JavaScript on.

The loader fails soft, because the file is edited by someone who is not a
developer. Missing file, empty file, deleted pipes, a heading with nothing
under it, a pasted e-mail — each of those leaves the baked list standing
rather than blanking the section. `tools/check.mjs` exercises all six.

## Design

Warm, skin-toned neutrals — bone ground, deep cocoa for the dark bands, one
muted rose for action. No photography anywhere, so the page carries itself on
type, rule and space; the gallery is five deliberately empty frames.

| Token | Hex | Use |
|---|---|---|
| `--bone` | `#F7F2ED` | page ground |
| `--sand` | `#EFE6DD` | prices, form band |
| `--cocoa` | `#3A2A28` | timeline, footer |
| `--rose` | `#9E5F58` | button fills — 4.96:1 under white |
| `--rose-d` | `#85493F` | rose text on light — 6.25:1 on bone |

Type: **Cormorant Garamond** 500/600 display, **Inter** 400/500/600 body,
self-hosted, no third-party requests. `tools/fonts.mjs` keeps the latin and
latin-ext subsets only; both families are variable, so 10 `@font-face` blocks
share 4 files.

## What is deliberately not on the page

- **No photos.** Stock shelves on a page about a real artist's work would be
  a lie, and in this trade the gallery *is* the product. The frames are empty
  and labelled, and the reply asks for hers.
- **No address, no opening hours.** Not known. The page names Tatabánya and
  routes everything to e-mail; both need to be added once she answers.
- **No claims about her.** No years of experience, no qualifications, no
  client count, no reviews — all of it would have been invented.

## Verification

- Twelve widths, 360–1440: no horizontal overflow, nothing clipped.
- Price file: real file renders 11 rows in 4 groups; an edit shows up; six
  ways of breaking the file all fall back to the baked list; partial damage
  keeps the rows that still parse and drops an empty group.
- Text from the file is escaped — a pasted `<img onerror=…>` renders as text.
- Form: empty submit flags three fields, `abc` is rejected as a contact, a
  phone number is accepted as readily as an e-mail, success clears the form.
- Mobile menu opens, closes on link tap and on Escape, `aria-expanded` tracks.

## Files

```
index.html       one page; prices live between the arak markers
arak.txt         the price list she edits
styles.css       tokens, layout, three breakpoints
script.js        price loader, menu, reveal, form validation
assets/price-parse.js   shared by the browser and the build
tools/bake.mjs   write arak.txt into index.html
tools/fonts.mjs  rebuild the self-hosted font set
tools/check.mjs  behaviour + width sweep · shoot/deliver/review.mjs  images
```

Serve from this directory on port 8188 (`python3 -m http.server 8188`) before
running any of the tools. Re-run `node tools/bake.mjs` after editing
`arak.txt` here.
