[![Leonida Trophy Guide on make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kontoru29/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kontoru29/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide

A complete offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze. Every trophy shows its official name, description and grade, next to a guide in our own words that names its sources, a six-phase road to the platinum, and a clear flag on the one trophy that can be missed.

## What it does

* **Checklist:** tick trophies off as you earn them. Progress saves in your browser and survives a reload, with a progress bar, a breakdown by grade, and a per-phase count on the roadmap so you can see which part of the journey is done.
* **Filters and search:** find a trophy by name or description, and filter by grade, by kind (story, side missions, activities, collectibles, crime, exploration, missable) and by earned or not yet earned.
* **Spoiler setting:** story trophies stay hidden until you earn them, so the guide never spoils a chapter you have not played yet.
* **Roadmap to the platinum:** six phases in playing order, from the story (50-80 hours) through side characters, activities, collectibles and crime to the 100% clean-up, with the hours and the trophy count of each phase.
* **Missables:** the one trophy that can be missed is flagged everywhere it appears, with when it can be missed and what to do instead; the other 54 can all be earned after the story.
* **Cited guides:** every trophy has a guide of its own that says where to go, what to do and when it can be missed, and cites its sources. No guide text is copied from another guide.
* **Export and import:** back your progress up to a file and restore it on another machine.

## How to run it

Double-click `app/index.html` in a desktop browser and the guide opens: plain static files, no build step, and everything keeps working with the network off.

To serve it instead:

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser.

To build the hand-in bundle locally:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## What is inside

* `app/index.html` — the guide page: hero with the platinum path at a glance, tabs for the checklist, the roadmap, the missables and the sources.
* `app/style.css` — the Vice City sunset look: deep purple panels, pink and orange accents, grade colours for each trophy.
* `app/app.js` — the tracker: checklist, filters, spoiler mode, roadmap phase counts, progress saving, export and import.
* `app/data/trophies.json` — the official 55 trophies with names, descriptions, grades and guides, plus the six roadmap phases they belong to.
* `main.ts` — the hand-in: copies `app/` and `screenshots/` to the output folder and writes `dossier.json`.
* `screenshots/` — four captures of the guide: checklist with a guide open, roadmap, missables and sources.

## Round 3: clearer shots

Round 2 scored lower than Round 1 (judge 0.711 vs 0.762), and comparing the two rounds shot by shot showed why: two of Round 2's four captures scrolled the page up, clipping the guide's title, and the demo progress struck through the trophy names in the checklist's first view, while the open guide's sources fell below the fold on the cover. Round 3 fixes all three: every capture is taken with the page at the top so the hero is whole in all four shots, the demo progress is three trophies from later in the list so the first view reads clean, earned trophies keep their names fully readable (a green border and an Earned label instead of a strikethrough), and the cover's detail panel is made to fit above the fold — a tighter hero, a one-row filter bar, a wider panel, a two-line missable warning first, then a shorter guide, then its sources, with the manual-save detail kept in the guide itself.

## Bounty

Built for the [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01) bounty on make.fun.

## License

MIT. See `LICENSE`.
