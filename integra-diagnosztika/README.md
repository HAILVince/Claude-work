# Integra Diagnosztika — landing page prototype

Demo for **Kántor Piroska**, Integra Diagnosztika és gyermekfejlesztés
(`integra.diagnosztika@gmail.com`, +36 30 694 6388). Current site:
`integradiagnosztika.mozellosite.com` (free Mozello, with the Mozello banner
in the footer). She replied on 19 Sept:

> *"Magam is gondolkodtam már az oldal költöztetésén és átalakításán. Ehhez
> a domain már lefoglalásra került … Azonban magam is kezdő egyéni
> vállalkozó vagyok, így erősen árérzékeny. Ennek tudatában várom
> ajánlatát."*

The offer went out on **25 Sept at 20:11**, at **80 000 Ft** (sent before
the 90k rule reached that draft). It promised a free demo, asked five
questions, and said: *"Ha ezekre most nincs ideje, az sem baj: elkészítem a
demót a mostani oldala alapján, és utána együtt javítjuk."* This is that
demo. **The letter that delivers it does not restate the price.**

## What this was built from

Her own site. Everything below is hers:

- tagline **"Fejlődés: lépéstől az ugrásig"**, subtitle *"Értő figyelem és
  szakértő támogatás a gyermeked fejlődéséhez"*
- *"Kántor Piroska vagyok, óvodapedagógus és fejlesztőpedagógus. Mindent
  összevetve 17 éve dolgozom gyerekekkel."*
- *"Amit nagyon szeretek a munkámban, az az a pillanat, amikor egy gyerek
  rájön, hogy ő is tud valamit."* (the pull quote)
- the philosophy line: *"a gyermek fejlődése nem különálló képességek egymás
  mellett létezése, hanem egy összekapcsolt működési rendszer"*, and *"A
  mozgás és a tiszta, jól értett beszéd szoros összefüggésben állnak"*
- her **three menu pillars**, kept as the page's structure: Beszéd–Figyelem–
  Auditív működés · Mozgásfejlesztés · Tanulás fejlesztés
- the methods: GMP/GOH (*"a gyerek hogyan hallja és dolgozza fel a beszédet
  – ez sokszor a kulcs minden máshoz"*), AIT/FST (Bérard protocol, at home,
  *"zenével segít az agynak hatékonyabban feldolgozni az információkat"*),
  SSP, Stephens–Sarlós Program (primitive reflexes), szenzomotoros
  mozgásfejlesztés, NILD for kindergarteners
- the three-step start, verbatim: rövid telefonhívás → személyes felmérés
  → személyre szabott terv; *"KÖTETLEN TELEFONOS EGYEZTETÉS"*
- **every price** (Információk > Árak) and the **cancellation rule**
  (free until 8:00 the day before, otherwise 5 000 Ft rendelkezésre állási
  díj)
- **two locations**: 1132 Budapest, Váci út 32. and 6762 Sándorfalva,
  Szeder utca 10.

Not read: her *Kérdések–Válaszok* and *Tanulmányok* pages, and the method
detail pages. The fetch service rate-limited us partway through, so the
demo has no FAQ and no qualification list rather than invented ones.

## What is ours

- **"Ismerős valamelyik?"**: six parent-language signs. They are ours,
  written to point at her three pillars. The section says plainly that
  they are not diagnoses. She should rewrite or replace them from her
  *Beszédfejlődési checklist* and *Kinek ajánlott az AIT/FST tréning?*
  pages.
- The one-line method descriptions are shortened from hers, except:
  *"amit otthon is lehet végezni"* for the szenzomotoros gyakorlatsor
  (inferred from "gyakorlatsor betanítása"), and the SSP line, which names
  the Safe and Sound Protocol and nothing more.
- The note under the cancellation fee explaining what it is for.
- Which days she is in which town: not known, the page says it is agreed on
  the phone.

## Worth asking her

1. **The SSP-mentorálás prices are the same three lines as the
   mozgásterápia** on her price page. Copy-paste slip, or really identical?
2. Are the prices OK to show? (Her current site shows them; this was
   question 2 in the offer.)
3. Which days Budapest, which Sándorfalva?
4. A photo of her, or of the room (question 4 in the offer).
5. The reserved domain (question 5 in the offer).

## The thesis

The reader is a worried parent, often late in the evening, on a phone.
They do not know what GMP/GOH or AIT/FST means, and they do not need to.
So the page leads with the idea that ties her methods together (speech,
movement and learning are one system), groups the methods under the three
things a parent actually notices, and makes the free phone call the
primary action everywhere. The form is the fallback for "not now".

## Design

| Token | Hex | Use |
|---|---|---|
| `--shell` | `#FAF7F1` | page ground |
| `--sage` | `#EDF2F0` | banded sections |
| `--deep` | `#1E3A4C` | call card, footer |
| `--accent` | `#A8451F` | buttons, terracotta; 5.9:1 under white |
| `--amber` | `#FDF1E7` | step numbers, selected chips |

Type: **Fraunces** 500/600 display, **Nunito Sans** body, self-hosted.
The only ornament is the hero's row of growing dots ending in one filled
circle: her slogan drawn, from a step to a jump. Hidden under 860px.

## The price file

`arak.txt`, same mechanism as the other demos: she edits it in the
browser, the page reads it, `tools/bake.mjs` bakes a copy into
`index.html` through `assets/price-parse.js`, a broken file leaves the
baked list standing. **No maintenance is offered** (`emails/ARAK.txt`).

## Verification

`tools/smoke.mjs`: no console errors; 12 price rows in 5 groups from
`arak.txt`; the call button dials her number; empty submit flags three
fields, garbage contact rejected, phone accepted, form clears; mobile menu
opens and closes; no horizontal overflow at 360, 390, 414, 600, 768, 860,
1000, 1100, 1280 and 1440.

## Files

```
index.html       one page; prices live between the arak markers
arak.txt         her prices, the file she edits
styles.css       tokens, layout, breakpoints
script.js        price loader, menu, reveal, form validation (demo mode)
assets/price-parse.js   shared by the browser and the build
tools/bake.mjs   write arak.txt into index.html
tools/fonts.mjs  rebuild the self-hosted font set
tools/smoke.mjs  behaviour + width sweep · shoot/deliver/review.mjs  images
```

Serve from this directory on port 8192 (`python3 -m http.server 8192`)
before running any of the tools. The two PNGs for the letter are
`screenshots/desktop-full.png` and `screenshots/mobile-full.png`.
