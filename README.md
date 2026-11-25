# Sizzle & Serve

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/wahyunp26-source/best-cooking-game/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/wahyunp26-source/best-cooking-game/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A fast-paced dinner-shift cooking game. Take tickets off the order board,
grill patties, chop veg, boil pasta, stack the plate and serve before
patience runs out. Three minutes, six recipes, combos pay more — and a
patty left on the grill burns.

## How to play

- **Click** an ingredient bin, then click a station: **Grill** (patty, 4s),
  **Chopping Board** (lettuce / tomato / cheese, 2s), **Pasta Pot** (pasta, 5s).
  Bun and sauce go straight to the plate.
- **Click** a finished station slot to pick the cooked item up, then **click
  the plate** to stack it. The ticket lights up green when the plate matches.
- **Click the service window** (or press `S`) to serve. Fast serves earn tips;
  serving in a row builds a combo multiplier up to x1.8.
- A grilled patty left too long **burns** — dump it in the **trash** (`T`).
- Keys `1–7` grab ingredients, `M` mutes, `Enter` starts / restarts.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network, no dependencies: `game/` is plain static files
(HTML + CSS + canvas JavaScript) and all art and sound are drawn and
synthesized in code.

Staged screenshots for the entry live under `screenshots/`; the game also
has a built-in attract mode (`?shot=start|play|rush|serve&seed=1`) that
freezes a deterministic mid-shift state for captures.

---

<sub>Entered on [make.fun](https://make.fun/?ref=yuerta&utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
