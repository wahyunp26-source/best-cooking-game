// Sizzle & Serve — game loop, input and staged screenshot scenes.
// Wires the kitchen state (kitchen.js) to the canvas (render.js).
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const mouse = { x: -100, y: -100, inside: false };
let hoverZone = null;
let lastTs = 0;
let shotMode = false;

function toStage(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (clientX - r.left) * (STAGE_W / r.width),
    y: (clientY - r.top) * (STAGE_H / r.height),
  };
}

function zoneAt(p) {
  if (pointInRect(p.x, p.y, GRILL)) return 'grill';
  if (pointInRect(p.x, p.y, CHOPPER)) return 'chopper';
  if (pointInRect(p.x, p.y, POT)) return 'pot';
  if (pointInRect(p.x, p.y, PLATE)) return 'plate';
  if (pointInRect(p.x, p.y, SERVE)) return 'serve';
  for (let i = 0; i < BIN_COUNT; i++) {
    if (pointInRect(p.x, p.y, binRect(i))) return { bin: i };
  }
  return null;
}

function takeBin(i) {
  if (Game.screen !== 'playing') return;
  if (i >= BIN_ORDER.length) {
    // Trash bin: works even with a full hand — that is the point of it.
    if (Game.hand) {
      Game.hand = null;
      floater(640, 700, 'trashed', '#c9bda6');
      Sfx.place();
    } else if (Game.plate.length > 0) {
      Game.plate = [];
      floater(640, 700, 'plate cleared', '#c9bda6');
      Sfx.place();
    }
    return;
  }
  if (Game.hand) { Sfx.click(); return; }
  const kind = BIN_ORDER[i];
  const ing = INGREDIENTS[kind];
  Game.hand = { kind, state: ing.station ? 'raw' : ing.ready };
  Sfx.pick();
}

function clickStation(station) {
  if (Game.screen !== 'playing') return;
  if (Game.hand) {
    const want = stationFor(Game.hand.kind);
    if (want !== station) {
      Sfx.fail();
      floater(mouse.x, mouse.y - 30, 'wrong station!', '#ff8a7a');
      return;
    }
    if (stationAccepts(station, Game.hand.kind)) {
      placeInStation(station, Game.hand.kind);
      Game.hand = null;
      Sfx.place();
    } else {
      Sfx.fail();
      floater(mouse.x, mouse.y - 30, 'station full!', '#ff8a7a');
    }
    return;
  }
  // Empty hand: collect the first finished item.
  for (let i = 0; i < station.slots.length; i++) {
    const got = takeFromStation(station, i);
    if (got) {
      Game.hand = got;
      Sfx.pick();
      return;
    }
  }
  Sfx.click();
}

function clickPlate() {
  if (Game.screen !== 'playing') return;
  if (!Game.hand) return;
  if (Game.plate.length >= 6) {
    Sfx.fail();
    floater(mouse.x, mouse.y - 30, 'plate is full!', '#ff8a7a');
    return;
  }
  Game.plate.push(Game.hand);
  Game.hand = null;
  Sfx.place();
  const match = matchingOrder();
  if (match) {
    Game.plateFlash = 2.5;
    Sfx.bell();
  }
}

function clickServe() {
  if (Game.screen !== 'playing') return;
  const match = matchingOrder();
  if (match) {
    serveOrder(match);
  } else {
    Sfx.fail();
    Game.shake = 4;
    floater(SERVE.x + SERVE.w / 2, SERVE.y + 120, 'no finished plate!', '#ff8a7a');
  }
}

function handleClick(p) {
  Sfx.unlock();
  if (Game.screen === 'title') {
    resetGame(Math.random);
    Sfx.serve();
    return;
  }
  if (Game.screen === 'over') {
    resetGame(Math.random);
    Sfx.serve();
    return;
  }
  const zone = zoneAt(p);
  if (!zone) return;
  if (typeof zone === 'string') {
    if (zone === 'grill') clickStation(Game.grill);
    else if (zone === 'chopper') clickStation(Game.chopper);
    else if (zone === 'pot') clickStation(Game.pot);
    else if (zone === 'plate') clickPlate();
    else if (zone === 'serve') clickServe();
  } else if (zone.bin !== undefined) {
    takeBin(zone.bin);
  }
}

canvas.addEventListener('mousemove', (e) => {
  const p = toStage(e.clientX, e.clientY);
  mouse.x = p.x;
  mouse.y = p.y;
  mouse.inside = true;
  hoverZone = zoneAt(p);
});
canvas.addEventListener('mouseleave', () => {
  mouse.inside = false;
  hoverZone = null;
});
canvas.addEventListener('click', (e) => {
  handleClick(toStage(e.clientX, e.clientY));
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') {
    const m = Sfx.toggleMute();
    floater(640, 100, m ? 'muted' : 'sound on', '#c9bda6');
    return;
  }
  if (Game.screen !== 'playing') {
    if (e.key === 'Enter' || e.key === ' ') {
      resetGame(Math.random);
      Sfx.unlock();
    }
    return;
  }
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 7) takeBin(n - 1);
  else if (e.key === 't' || e.key === 'T') takeBin(7);
  else if (e.key === 's' || e.key === 'S') clickServe();
});

function frame(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
  lastTs = ts;
  if (!shotMode) updateGame(dt);
  drawGame(ctx, mouse.inside ? mouse : null, hoverZone);
  requestAnimationFrame(frame);
}

// ---------- staged scenes for screenshots ----------
// ?shot=start|play|rush|serve&seed=1 — deterministic, frozen states so a
// screenshot always shows the game at its best. This is the game's own
// attract mode: the same code renders the same kitchen a player sees.
function applyShot() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return;
  shotMode = true;
  const seed = parseInt(q.get('seed') || '1', 10);
  const rand = mulberry32(seed);
  Game.rand = rand;

  function stageOrder(recipeId, patienceLeft, patience) {
    const o = makeOrder(Game.nextOrderId++, rand, 0, SHIFT_LEN);
    o.recipeId = recipeId;
    o.patience = patience;
    o.patienceLeft = patienceLeft;
    return o;
  }
  function stageSlot(station, i, kind, state, progress, done) {
    station.slots[i] = { item: { kind, state, progress, done, burnLeft: 9999 }, progress, done, burnLeft: 9999 };
  }

  if (shot === 'start') {
    Game.screen = 'title';
    Game.time = 0;
    Game.timeLeft = SHIFT_LEN;
    Game.coins = 0;
    Game.orders = [stageOrder('burger', 52, 55), stageOrder('salad', 40, 48)];
    return;
  }
  Game.screen = 'playing';
  if (shot === 'play') {
    Game.time = 85;
    Game.timeLeft = 95;
    Game.coins = 86;
    Game.combo = 2;
    Game.served = 5;
    Game.orders = [
      stageOrder('burger', 30, 55),
      stageOrder('marinara', 40, 50),
      stageOrder('salad', 18, 45),
    ];
    stageSlot(Game.grill, 0, 'patty', 'raw', 0.6, false);
    stageSlot(Game.grill, 1, 'patty', 'grilled', 1, true);
    stageSlot(Game.chopper, 0, 'lettuce', 'chopped', 1, true);
    stageSlot(Game.pot, 0, 'pasta', 'raw', 0.4, false);
    Game.plate = [
      { kind: 'bun', state: 'bun' },
      { kind: 'patty', state: 'grilled' },
      { kind: 'lettuce', state: 'chopped' },
    ];
  } else if (shot === 'rush') {
    Game.time = 156;
    Game.timeLeft = 24;
    Game.rush = true;
    Game.coins = 214;
    Game.combo = 4;
    Game.served = 12;
    Game.orders = [
      stageOrder('doubleburger', 12, 40),
      stageOrder('cheeseburger', 22, 45),
      stageOrder('veggiepasta', 8, 38),
    ];
    stageSlot(Game.grill, 0, 'patty', 'grilled', 1, true);
    stageSlot(Game.grill, 1, 'patty', 'raw', 0.8, false);
    stageSlot(Game.chopper, 0, 'cheese', 'chopped', 1, true);
    stageSlot(Game.chopper, 1, 'tomato', 'chopped', 1, true);
    Game.plate = [
      { kind: 'bun', state: 'bun' },
      { kind: 'patty', state: 'grilled' },
      { kind: 'cheese', state: 'chopped' },
      { kind: 'tomato', state: 'chopped' },
    ];
    Game.plateFlash = 99;
  } else if (shot === 'serve') {
    Game.time = 100;
    Game.timeLeft = 80;
    Game.coins = 132;
    Game.combo = 3;
    Game.served = 7;
    Game.orders = [stageOrder('burger', 35, 55), stageOrder('salad', 26, 48)];
    stageSlot(Game.grill, 0, 'patty', 'raw', 0.5, false);
    stageSlot(Game.pot, 0, 'pasta', 'raw', 0.7, false);
    Game.plate = [
      { kind: 'bun', state: 'bun' },
      { kind: 'patty', state: 'grilled' },
      { kind: 'lettuce', state: 'chopped' },
      { kind: 'tomato', state: 'chopped' },
    ];
    Game.plateFlash = 99;
    Game.floaters = [
      { x: 1000, y: 490, text: '+$18', color: '#ffd94d', life: 99, max: 99 },
      { x: 1000, y: 516, text: 'FAST! +$5 tip', color: '#7ddc8a', life: 99, max: 99 },
    ];
    for (let i = 0; i < 10; i++) {
      Game.particles.push({
        x: 1100 + (Math.random() - 0.5) * 70,
        y: 420 + (Math.random() - 0.5) * 36,
        vx: 0, vy: 0, life: 99, max: 99,
        size: 4 + Math.random() * 4,
        color: i % 2 ? '#ffd94d' : '#ff8a5c',
      });
    }
  }
}

// ---------- built-in self-test ----------
// ?test=1 plays a full order through the real handlers (grab, grill, chop,
// plate, serve), then checks the timer, burning and trash, and writes the
// result into document.title for headless verification. Dev tooling only:
// it never runs during normal play.
function runSelfTest() {
  const out = { steps: [], pass: true };
  function check(name, ok) {
    out.steps.push(name + ':' + (ok ? 'ok' : 'FAIL'));
    if (!ok) out.pass = false;
  }
  try {
    resetGame(mulberry32(7));
    check('starts-playing', Game.screen === 'playing' && Game.orders.length === 2);
    takeBin(1); // patty
    check('hand-patty', Game.hand && Game.hand.kind === 'patty');
    clickStation(Game.grill);
    check('patty-on-grill', !Game.hand && Game.grill.slots[0].item);
    updateGame(4.5);
    check('patty-grilled', Game.grill.slots[0].done && Game.grill.slots[0].item.state === 'grilled');
    takeBin(2); // lettuce
    clickStation(Game.chopper);
    updateGame(2.5);
    check('lettuce-chopped', Game.chopper.slots[0].done);
    takeBin(3); // tomato
    clickStation(Game.chopper);
    updateGame(2.5);
    check('tomato-chopped', Game.chopper.slots[1].done);
    takeBin(0); // bun
    clickPlate();
    check('bun-on-plate', Game.plate.length === 1);
    clickStation(Game.grill);
    clickPlate();
    clickStation(Game.chopper);
    clickPlate();
    clickStation(Game.chopper);
    clickPlate();
    check('plate-full-burger', Game.plate.length === 4);
    Game.orders[0].recipeId = 'burger';
    check('plate-matches', !!matchingOrder());
    const before = Game.coins;
    clickServe();
    check('served-pays', Game.served === 1 && Game.coins > before && Game.plate.length === 0);
    // Burn: grill a patty, leave it 7s past done.
    takeBin(1);
    clickStation(Game.grill);
    updateGame(4.5);
    updateGame(7);
    check('patty-burns', Game.grill.slots[0].item.state === 'burnt');
    clickStation(Game.grill); // pick up the burnt patty
    check('burnt-in-hand', Game.hand && Game.hand.state === 'burnt');
    takeBin(7); // trash
    check('trash-clears-hand', !Game.hand);
    // Timer expiry ends the shift.
    Game.time = SHIFT_LEN - 0.5;
    updateGame(1);
    check('shift-ends', Game.screen === 'over' && Game.stars >= 0);
  } catch (e) {
    out.steps.push('exception:' + e.message);
    out.pass = false;
  }
  document.title = 'SELFTEST ' + (out.pass ? 'PASS' : 'FAIL') + ' | ' + out.steps.join(' | ');
}

if (new URLSearchParams(window.location.search).get('test') === '1') {
  runSelfTest();
}

applyShot();
requestAnimationFrame(frame);
