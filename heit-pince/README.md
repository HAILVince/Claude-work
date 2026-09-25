# Heit Pince — landing page prototype

Demo for **Heit Lóránd Levente** (`heit.lorand@gmail.com`, +36 70 362 4566),
family winery on the Padalja cellar row in **Bihardiószeg (Diosig)**,
Érmelléki wine region — which is in **Romania**, not Hungary.

## Which business this is for, and why that matters

The outreach went to `heit.hu` addressed to "Heit Pince". He replied from the
**horseradish** business (`heittorma.hu`), so a demo was built for Heit Torma.
Then on 22 Sept he settled it himself:

> *"A Heit Pincének vagy a Heit Zenekarnak lenne a demo. A torma weboldal
> rendben van."*

So **the `heit-torma` demo in this repo is dead** — it must not be sent. This
is the winery. The band (`heit.hu/zenekar/`) is the other option he named and
is offered in the letter as a separate piece of work.

## What this was built from

`heit.hu` is blocked from this environment, but enough came back through
search that almost every fact on the page is his, not ours:

- the cellar row: **"Padalja – Tessék-Sor"**, Bihardiószeg's most famous,
  "a helyi szőlőbirtokosok egész éves zarándokhelye"
- **1981 August** the family bought the cellar; **1983** press house and farm
  room; **autumn 2016** converted into the wine terrace
- **3,5 hectares**, cordon and stake training
- varieties: **Királyleányka, Ottonel Muskotály, Zöld Veltlini, Kadarka,
  Bakator**
- **Bakator brought back to Érmellék in May 2013** — centuries the region's
  leading variety, at once a wine, table and aromatic grape, slow to ripen,
  legendary in a good year. He co-founded an association to revive it, and
  Bihardiószeg now has a Bakator festival on this same cellar row.
- voluntary **organic** farming: no fertiliser, no insecticide, no herbicide;
  only simple contact agents, **copper and sulphur**
- hospitality: wine tastings, friendly gatherings and family events for
  **10 to 45 people**

What is ours, and the letter says so: the wording throughout, the vintages and
styles in `borok.txt`, and the ordering of the page.

## The thesis

The Bakator is the hook, and it goes in the hero. No other winery in the
region can say it, it is a true story, and it is the reason a stranger reads
past the first screen. The page then earns its keep on the tasting booking,
because that is the transaction a 3.5-hectare winery actually wants from a
website — not a shop.

The organic section is deliberately written as a list of **what is left out**,
ending with the one thing that is put in. A claim stated as a subtraction is
harder to fake and easier to believe.

Palette is parchment, cellar-dark and one vine green. No burgundy and no gold
lettering: this is a white-wine estate with a returned old variety, and the
colour on the page should come from the photographs — which do not exist yet,
so every image slot is a labelled frame.

## The editable file

`borok.txt` — the wine list. For a winery this is the content that is
guaranteed to go stale every single vintage, and it is the classic reason
people think they need a developer on retainer.

```
## Fehérborok
Királyleányka | 2024 | száraz
> Az Érmellék klasszikus fehérei.
```

The line is `name | field | field | …`, as many fields as he likes or none.
Shared parser with `tools/bake.mjs`, baked copy in the HTML, soft failure
that leaves the baked list standing.

## Three things the letter has to raise

1. **The site is trilingual.** `heit.hu` has `/deutsch/` and `/romana/`. The
   demo is Hungarian only. Two more languages is real work and a real price
   difference, so it is named rather than quietly dropped.
2. **The winery is in Romania.** That touches the privacy notice (which
   authority hears a complaint), possibly the currency, and "hol kapható".
   The privacy notice says so about itself rather than pretending.
3. **Photographs.** None exist here. A cellar row, a terrace and a vineyard
   are the whole visual argument, and bought stock photos are refused —
   Vince already told him that in the earlier letter, and it should stay true.

Also unanswered from the earlier letter and re-asked: the current wine list
with vintages, where the wines can be bought, what a tasting costs and what
it includes, and whether he controls the `heit.hu` domain.

## Running it

```
npx http-server -p 8196 -s .
node tools/fonts.mjs     # re-download the self-hosted webfonts
node tools/bake.mjs      # write borok.txt into index.html
node tools/check.mjs     # 13 widths × 3 pages, wine list, form, menu, age line
node tools/shoot.mjs     # screenshots
node tools/deliver.mjs   # the two renders that go in the e-mail
```

## Price in the letter

90 000 Ft for the Hungarian single-language page as shown, one-off, hosting
free, only the domain recurring. The three-language version is quoted
separately as a range rather than a number, because it depends on whether he
has the German and Romanian text already.
