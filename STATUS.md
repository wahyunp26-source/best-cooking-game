# Sizzle & Serve — Best Cooking Game entry — STATUS

## Competition
- Best Cooking Game (`best-cooking-game-20261125-0137`), $250, top 10 paid
  ($60/$40/$30/$25/$20/$15x5). Deadline 25 Nov 20:37 WIB. Result ~10 Dec.
- 640 submissions at build time and rising. Blind rounds 04:37 / 07:37 /
  10:37 / 13:37 UTC — round 1 cutoff 11:37 WIB. Submit BEFORE 11:37 WIB
  to be judged from round 1.
- Judging: AI pairwise on screenshot contact sheet + source outline.
  Final heat: top 40 dev-board entries only. Quota 10/day, 20 total;
  0 used for this competition.

## What it is
Fast-paced dinner-shift cooking game (1280x800 canvas, mouse + keys 1-7/T/S/M):
- Order board (3 tickets, patience bars, ingredient check-offs) — grill
  patty 4s, chop veg 2s, boil pasta 5s, stack the plate, serve at the
  window. 6 recipes, combos to x1.8, tips for fast serves, burnt patties,
  trash, rush hour in the last 30s, 3-minute shift, 3-star goals.
- All art drawn in canvas code, all sound synthesized in WebAudio.
  No network, no deps, no copied assets. Source split by job:
  layout.js / audio.js / recipes.js / kitchen.js / render.js / main.js.

## Files
- Entry: ~/workspace/makefun/best-cooking-game-entry/
- Repo: https://github.com/wahyunp26-source/best-cooking-game
- Commit: bf0292207c6e715883713387eaa705d9b007c301 (pushed, HEAD matches)
- GitHub About set (homepage + topics makefun/ai-agents/bounties/games).
- owner.json wallet wQUy3YoX5DoUSaAsXycrZT21NTih6BRwE6N4ossmy9S.
  LICENSE MIT, SPDX first line. README has all 3 badges.
- Screenshots (real renders via ?shot= scenes, 1280x800 JPEG, 87-129 KB):
  1-start.jpg, 2-play.jpg, 3-rush.jpg, 4-serve.jpg.

## Tests (all in this session, 25 Nov ~09:30-09:45 WIB)
- `node --check` on all 6 game JS files: OK.
- Built-in self-test `?test=1` (real handlers, full order cycle):
  **14/14 PASS** — grab/grill/chop/plate/serve/pay, burn, trash, shift end.
  Found + fixed 1 real bug: trash bin ignored clicks while holding an item.
- Headless Chromium screenshots viewed at full res; fixed 4 visual bugs:
  ticket overflow, chopped-tomato icon, rush banner + top-bar overlaps,
  serve floaters overlapping the window title.
- `MAKEFUN_OUTPUT_DIR=out node main.ts` run twice: **byte-identical**
  (dossier.json 673,333 B, under the 1.5 MiB cap).
- `makefun check --repo`: **4 passed, 1 failed, 15 skipped** — the only
  failure is transcripts_present (no --transcripts given; the bundle is
  made by the parent at submit time, per the usual pattern).

## Visual polish pass (25 Nov ~09:45-09:55 WIB — Wahyu: "bentuknya jelek")
Targeted edits only (render.js + layout.js); game logic, recipes, scoring,
timers, controls and the ?test=1 self-test untouched.
1. **INGREDIENTS label overlap FIXED** — BIN_ROW moved y 576→592 (h 170→164);
   label now sits fully below the counter band, clean spacing, verified in
   all 4 shots.
2. **Food shapes redrawn with depth** — radial/linear gradients, highlights,
   contact shadows on large icons: bun (domed, sesame, rim), patty (grill
   marks + top shine + bottom edge; raw pink with speckles), lettuce (whole
   ruffled leaf; chopped wavy ribbons in two greens), tomato (gradient +
   stem + leaves; slice with rim/flesh/seeds/sheen), cheese (3D wedge with
   side face + holes; chopped wavy shreds), pasta (strands in two tones;
   boiled arcs + marinara dots), sauce (radial gradient + shine).
3. **Service window filled** — warm radial glow, two hanging heat lamps with
   light cones, wood pass shelf, stack of clean plates.
4. **Station depth** — grill (inner top shadow, horizontal grates, ember
   glow), chopping board (wood grain, inner shadow), pasta pot (steel
   gradient, side handles, bright rim, elliptical water surface, steam
   wisps while boiling); station headers got an under-header shadow line.
5. **Overall polish** — wall is a warm vertical gradient, counter band has a
   top highlight, ingredient bins have a top highlight line.
- New screenshots (real renders, 1280x800 JPEG, 96-153 KB, under 256 KiB cap):
  1-start.jpg `21202358…`, 2-play.jpg `59823fac…`, 3-rush.jpg `b954999a…`,
  4-serve.jpg `af6cd5ba…`.
- Re-verified: `node --check` all 6 files OK; **?test=1 self-test 14/14 PASS**;
  grader-style `MAKEFUN_OUTPUT_DIR=out node main.ts` run twice →
  **byte-identical** (dossier.json 791,473 B, under 1.5 MiB cap).

## Honest verdict after the polish
The look genuinely changed: the plate now reads as a real burger/pasta dish,
the bins read as food at a glance, the window is a lit pass instead of a
black void. Remaining gap vs. a painterly entry: the art is still clean
flat-vector with gradients, not hand-painted — and the game is still a
single-screen time-management loop with no character. Verdict: a visibly
more appetising top-40 contender; top 10 still depends on how many rivals
are more polished. Do not claim top 10 as likely.

## NOT submitted
Parent to bundle (this session + parent chain) + submit after Wahyu
approves the preview. No submit has been made; quota untouched.

## Honest self-eval
Top 10 is credible but not safe. Strengths: the cover screenshot shows
every criterion-1 element at a glance (kitchen, order board, ingredients,
dish mid-assembly, timer, plate ready to serve); the game is genuinely
complete and playable; source structure is clean and well-named.
Weakest part: the art is flat vector-drawn, not painterly — against 640
entries, some rivals will have richer-looking kitchens; and the game is
a single-screen time-management loop with no character/movement, which
is less spectacular than a 3D or platformer-style cooking game.
Verdict: a solid top-40 (final-heat) contender; top 10 depends on how
many entries are more polished visually. Do not claim top 10 as likely.
