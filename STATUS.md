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
- Commit: 085dd99e6eddfd30e687659ec028338f7010305c (rebuild, pushed, HEAD matches)
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

## REBUILD in the reference style (25 Nov ~10:00-10:15 WIB — Wahyu: "dibilang jelekkk" + reference image)
Full rendering + layout rebuild in the warm semi-3D diner style of Wahyu's
reference image (STYLE-REFERENCE.md, kept local, NOT committed to the repo).
Rendering + layout only (render.js, layout.js); game logic, recipes, scoring,
timers, controls and the ?test=1 hooks untouched. Staging coords in main.js
adjusted so the staged screenshots show the new layout (floaters/confetti
positions only — no gameplay change).
1. **Background = restaurant, not a wall** — warm cream wall, 3 arched
   windows with blue sky + white clouds + green hills, 2 wall lamps with
   warm glow cones, brick band, 4 tables with pink + teal chairs, wood-plank
   floor at the bottom. The midground is now busy, not empty.
2. **Staff characters** — waiter (blue suit, red tie, dark bowl-cut hair)
   and waitress (pink dress, long blonde hair) drawn between the windows,
   smiling, ~100px tall, standing behind the stations.
3. **Wooden counter band** (24px, plank grain) separates the stations from
   the bins row — the whole kitchen now sits ON a counter.
4. **Grill = red enamel** (red frame, glowing orange slots, black grate
   bars, crosshatched steak, steam wisps, indicator lights, cooking glow).
5. **Chopping board** — wood grain + knife resting across the top edge;
   READY tag now a dark pill (legible over red tomato).
6. **Pasta pot** — glossy steel (rim highlight, side handles, water surface,
   bubbles, steam, orange progress ring at the base).
7. **Plate = dark slate tray** — plated stack + garnish on every dish
   (asparagus spears + lemon wedge, or cherry tomatoes + sauce swoosh).
   Layer heights tightened for the taller panel.
8. **Service window = warm brown pass** (never black) — red/white awning,
   2 heat lamps with light cones, wood shelf with a stack of clean plates,
   bell, and **3 red drink dispensers** (glossy bodies, green screens,
   glass cups of red juice) receding on the right.
9. **Tickets = cream cards** with a mini plated-dish icon per recipe
   (burger / pasta / salad + garnish), green **vertical** patience bar on
   the right edge, 5-need recipes use tighter icon spacing so the last icon
   never touches the bar.
10. **Ingredient bins = mounded bowls** — wooden bun basket, purple patty
    tray (raw meat + lettuce + onion rings), green lettuce bowl, red tomato
    bowl, glass cheese jug with spoon, white pasta bowl, white gravy boat.
    Every bowl has a contact shadow and food mounded above the rim.
- Also fixed (found while viewing full-res): "RUSH HOUR!" overlapped the
  timer ring → moved to x 982, 14px; serve floaters/confetti in the staged
  shot overlapped the dispensers/title → moved to the clear pass area.
- Screenshots re-rendered (final hashes):
  1-start.jpg `fb7c7cec…`, 2-play.jpg `9b166058…`, 3-rush.jpg `de7ffd85…`,
  4-serve.jpg `39b90cea…`.
- Re-verified: `node --check` all 6 files OK; **?test=1 self-test 14/14 PASS**;
  grader-style `MAKEFUN_OUTPUT_DIR=out node main.ts` run twice →
  **byte-identical** (dossier.json 761,785 B, under 1.5 MiB cap).

## Visual polish pass v4 (25 Nov ~10:25-10:50 WIB — audit's 6 priorities vs the 3D style target)
Rendering + layout only (render.js, layout.js); game logic, recipes, scoring,
timers, controls and the ?test=1 hooks untouched. All 6 audit priorities done:
1. **Characters bigger + glossier** — faces 34×40→40×46, eyes 8×10→10×12 with
   bigger irises, shoulders widened, hair volumes enlarged with a gloss sweep,
   CHAR_TOP 64→68; heads now read at 300px instead of ~100px flat faces.
2. **Counter as a real surface** — full-width glossy wood counter (grain +
   specular highlight) under the bins (y568..756, no unpainted gap under the
   order board — a black 12px strip found + fixed in the first v4 render);
   station-row and plate-row counter bands thickened to 22px with grain +
   shine + shadow so stations sit ON the counter.
3. **Grill as a box** — stronger ember glow (5 embers, alpha .65), glossy top
   edge + shaded bottom edge on the red frame, steaks enlarged 62→76px with
   crosshatch + gloss.
4. **Dispensers larger (~1.4x)** — front machine 68×110px (was 48×78), 3 in a
   row receding, glass cups in front, sitting on the counter strip; DING /
   "no finished plate" texts re-centred left (bx-88 / bx-58) so they never
   strike through the machines.
5. **Dark voids killed** — plate tray is now warm walnut (#7a5230→#54371e,
   gold rim) instead of flat purple-grey; serve pass lightened (#7a3226→
   #5a2115) with a stronger warm glow.
6. **Bowls mounded, not tiled** — bowls drawn 1.1x so food fills the tile,
   tiles re-tinted warm (#f7ead0); containers, not flat icons.
- Also fixed (found while viewing full-res): the chopper knife was covering
  the "DY" of slot 2's READY pill — knife now drawn BEFORE the slots, pill
  made solid (#33302a); READY fully legible in the rush shot.
- Screenshots re-rendered (final hashes): 1-start.jpg `d7fd8427…`,
  2-play.jpg `5c747da5…`, 3-rush.jpg `53e01db1…`, 4-serve.jpg `bb120b65…`
  (all 82–144 KB, under the 256 KiB cap).
- Re-verified: `node --check` all 6 files OK; **?test=1 self-test 14/14 PASS**;
  grader-style `MAKEFUN_OUTPUT_DIR=out node main.ts` run twice →
  **byte-identical** (dossier.json 775,474 B, under 1.5 MiB cap).

## Honest verdict after the v4 pass
Closer to the 3D style target on every axis the audit named: characters,
grill, dispensers, plate tray, counter, bowls. Remaining gap vs. the target
render (honest): the art is still canvas-vector, not painterly 3D — faces
are simple cartoon (no soft painted shading), the dining room is a band,
not a full perspective room, and food is gradient vector, not a 3D render.
A real-time 3D rewrite was NOT attempted (no time to re-verify before the
11:37 WIB round-1 cutoff). Verdict: a visibly stronger top-40 contender;
top 10 depends on how the AI judge weighs a complete playable game with a
warm busy kitchen against painterly/3D rivals. Do not claim top 10 as likely.

## Composite 3D backdrop (25 Nov ~10:40-11:00 WIB — Wahyu: "Gas composite 3D 🖼️")
The generated 3D dining-room render is now the game's static backdrop, with
the dynamic canvas game drawn on top. Rendering + layout only (render.js,
main.js staged coords); game logic, recipes, scoring, timers, controls and
the ?test=1 self-test untouched.
1. **Asset** — `game/assets/backdrop.jpg` (270 KB, 1280x800): the generated
   3D render (2048x1152 webp) cover-fit to the stage. Full-stage, so the
   3D staff faces land at y~76-170 — fully visible above the stations
   (y196). Legal per the competition rules: every image the game loads is
   a file under game/; the dossier caps allow it (game_max_bytes 48 MiB).
2. **Wiring** — `render.js` loads it async (`new Image()`, `assets/
   backdrop.jpg`); `drawGame` draws the vector restaurant as underlay,
   then the photo full-stage, then re-draws the two wood counter bands
   over the photo so the kitchen sits ON a counter. The photo's own staff
   stand behind the stations, so the vector waiter/waitress are only
   drawn if the photo fails to load (fallback; `window.__backdropReady`
   flag for the shot harness). Counter bands extracted from
   `drawRestaurant` into `drawCounterBands`.
3. **De-doubling** — the photo already has the 3D drink dispensers, so
   the vector dispensers were removed from the serve window (replaced by
   a second clean-plate stack under the right heat lamp); the DING / "no
   finished plate yet" texts re-centred under the bell; staged serve
   floaters moved to x1000 (clear right side). The photo's dispensers
   peek above the window like machines behind the pass.
4. **Label fix** — the INGREDIENTS label was unreadable over the busy
   photo strip: it now sits on a paper pill (measured width) — legible in
   all 4 shots.
5. **Known nits (left as-is)** — the photo's purple raw-meat tray shows
   below the bins at bottom-left (it is IN Wahyu's reference image, reads
   as a tray under the counter); the photo's bowls peek through the 8px
   gaps between bin tiles (reads as food on the counter behind the bins).
- Screenshots re-rendered (final hashes): 1-start.jpg `51da742d…`,
  2-play.jpg `700c6cd1…`, 3-rush.jpg `170fbc62…`, 4-serve.jpg
  `df03c042…` (all 108–204 KB, under the 256 KiB cap). Backdrop-ready on
  all 4 shots; self-test **14/14 PASS**; grader-style
  `MAKEFUN_OUTPUT_DIR=out node main.ts` run twice → **byte-identical**
  (dossier.json 1,049,035 B, under the 1.5 MiB cap; asset copied into
  out/game/assets/). `makefun check --repo`: **4 passed, 1 failed
  (transcripts_present — parent's bundle job), 15 skipped** — same as
  before, no new failure from the asset.

## Honest verdict after the composite
This is the first version that genuinely looks 3D at first glance: a real
rendered dining room (windows, lamps, tables, chairs, 3D staff) with the
playable kitchen on top — the closest yet to Wahyu's reference image. The
game elements themselves are still canvas-vector (stations, plates, bowls),
so it is a 2.5D composite, not a full 3D game — but the frame reads as a
3D diner kitchen, which is what the screenshots are judged on. Top 10 is
now credible; whether the judge rewards the composite over fully-painted
rivals is unknowable from here. Do not claim top 10 as likely.

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

## 3-defect fix (25 Nov ~11:30 WIB, commit b3b6063) — parent: "perbaiki dulu"
Parent viewed 2-play.jpg (0a4e5ff) and named exactly 3 defects; fixed exactly
those 3 in render.js only (51 insertions, 9 deletions), re-rendered all 4
screenshots, NOT submitted (quota 0/10; round-1 cutoff 11:37 WIB).
1. Hard photo-tile edges cutting through staff: new `drawPhotoPanel` helper —
   rounded corners (r=14) + drop shadow + thin warm border — applied to the
   grill/chopper/pots/plate/serve sprites (bins strip untouched, already
   framed per-tile). Clipping never moves the image, so photo-aligned food
   anchors stay valid. Tiles now read as framed panels, not pasted rectangles.
2. Plate text clipped: the "keep stacking — check the tickets" hint (and the
   "READY TO SERVE!" match line, plus the empty-plate hint) now sits on a
   dark pill (rgba(42,26,18,0.85), 350x26) — fully legible over the busy
   plate photo. Root cause: beige 14px text drawn straight onto the photo's
   bright bowls, no backing.
3. SERVICE WINDOW label missing: the title + subtitle only existed in the
   vector-fallback branch, so photo mode had none. Restored in photo mode
   only: dark-red title bar (same pattern as station headers) — "SERVICE
   WINDOW" + "click here to serve" — drawn after the if/else, clear of the
   bell (by=y+118) and plate stacks.
Verification: node --check OK; ?test=1 self-test 14/14 PASS; all 4 shots
re-rendered with backdrop+sprites-ready; viewed 2-play full-res + 300px
(reads as one coherent 3D diner at judge scale) and 4-serve full-res
(READY pill + DING pill + title bar all legible); grader-style
MAKEFUN_OUTPUT_DIR=out node main.ts twice → byte-identical, dossier
1,246,128 B (under 1.5 MiB cap); makefun check 4 passed / 1 failed
(transcripts_present — no bundle yet, expected) / 15 skipped, identical to
the pre-fix baseline. New screenshot hashes: 1-start d0d9e1a3…, 2-play
4ad3699a…, 3-rush 253c01d9…, 4-serve 86f1355f….
Honest verdict: the three named defects are gone. Remaining (out of scope):
the food icons and order tickets are still vector by necessity; the station
tiles have no label bars in photo mode (drawStationBase is only called in
the vector fallback — the photos are bare, so a first-time player reads the
station from its picture, not a label); 4-serve floaters (+$18 / FAST! tip)
overlap the serve window's right edge slightly (pre-existing staged effect).
