[![Leonida Trophy Guide on make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kontoru29/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kontoru29/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide

Leonida Trophy Guide is an offline web guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze. It lists every trophy with its official name, description and grade, and pairs each one with a guide written in our own words that names where its facts come from.

## What it does

* **Checklist:** tick trophies off as you earn them. Progress saves in your browser and survives a reload, with a progress bar and a breakdown by grade.
* **Filters and search:** find a trophy by name or description, and filter by grade, by kind (story, missable, collectibles, activities) and by earned or not yet earned.
* **Spoiler setting:** story trophies stay hidden until you earn them, so the guide never spoils a chapter you have not played yet.
* **Roadmap to the platinum:** the order to play in, built from the official descriptions: which story chapters and missions, which collectibles and counts, and what to finish before the point of no return.
* **Missables:** every trophy that can be missed is flagged, with when it can be missed and what to do instead.
* **Cited guides:** every trophy has a guide of its own that says where to go, what to do and when it can be missed, and cites its sources. No guide text is copied from another guide.
* **Export and import:** back your progress up to a file and restore it on another machine.

## How to run it

Open `app/index.html` in a desktop browser. That is all it needs: the guide is plain static files, and everything works with the network off.

Or serve the folder and open it:

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser.

To build the hand in bundle locally:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## What is inside

* `app/index.html` and `app/style.css` — the guide page and its Vice City sunset look.
* `app/app.js` — the tracker: checklist, filters, spoiler mode, roadmap helpers and progress saving.
* `app/data/trophies.json` — the official list of all 55 trophies with their names, descriptions, grades and guides.
* `main.ts` — hands the guide in: it copies `app/` and `screenshots/` to the output folder and writes `dossier.json`.
* `screenshots/` — four screenshots of the guide: checklist, roadmap, missables and sources.

## Bounty

Built for the [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01) bounty on make.fun.

## License

MIT. See `LICENSE`.
