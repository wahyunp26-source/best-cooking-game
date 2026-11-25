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
