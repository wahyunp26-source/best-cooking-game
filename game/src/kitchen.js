// Sizzle & Serve — game state and rules.
// Owns the shift timer, orders, stations, hand, plate, scoring and combos.
// Rendering lives in render.js; input lives in main.js.
const SHIFT_LEN = 180; // a 3-minute dinner shift
const MAX_ORDERS = 3;
const STAR_GOALS = [150, 300, 450];

function emptySlot() {
  return { item: null, progress: 0, done: false, burnLeft: 0 };
}

function newStation() {
  return { slots: [emptySlot(), emptySlot()] };
}

const Game = {
  screen: 'title', // title | playing | over
  time: 0, // seconds since the shift started
  timeLeft: SHIFT_LEN,
  coins: 0,
  combo: 0,
  bestCombo: 0,
  served: 0,
  lost: 0,
  rush: false,
  orders: [],
  nextOrderId: 1,
  spawnIn: 2.5,
  hand: null, // { kind, state } or null
  grill: newStation(),
  chopper: newStation(),
  pot: newStation(),
  plate: [], // [{ kind, state }]
  plateFlash: 0, // seconds left on the ready glow
  floaters: [], // { x, y, text, color, life, max }
  particles: [], // { x, y, vx, vy, life, max, size, color }
  shake: 0,
  flash: 0,
  stars: 0,
  rand: Math.random,
};

function resetGame(rand) {
  Game.screen = 'playing';
  Game.time = 0;
  Game.timeLeft = SHIFT_LEN;
  Game.coins = 0;
  Game.combo = 0;
  Game.bestCombo = 0;
  Game.served = 0;
  Game.lost = 0;
  Game.rush = false;
  Game.orders = [];
  Game.nextOrderId = 1;
  Game.spawnIn = 2.0;
  Game.hand = null;
  Game.grill = newStation();
  Game.chopper = newStation();
  Game.pot = newStation();
  Game.plate = [];
  Game.plateFlash = 0;
  Game.floaters = [];
  Game.particles = [];
  Game.shake = 0;
  Game.flash = 0;
  Game.stars = 0;
  Game.rand = rand || Math.random;
  spawnOrder();
  spawnOrder();
}

function spawnOrder() {
  if (Game.orders.length >= MAX_ORDERS) return;
  Game.orders.push(makeOrder(Game.nextOrderId++, Game.rand, Game.time, SHIFT_LEN));
}

function spawnInterval() {
  if (Game.rush) return 11;
  return Math.max(12, 22 - Game.time * 0.055);
}

function stationFor(kind) {
  const ing = INGREDIENTS[kind];
  if (!ing || !ing.station) return null;
  if (ing.station === 'grill') return Game.grill;
  if (ing.station === 'chopper') return Game.chopper;
  return Game.pot;
}

function stationAccepts(station, kind) {
  for (const slot of station.slots) {
    if (!slot.item) return true;
  }
  return false;
}

function placeInStation(station, kind) {
  for (const slot of station.slots) {
    if (!slot.item) {
      slot.item = { kind, state: 'raw', progress: 0, done: false, burnLeft: 0 };
      return true;
    }
  }
  return false;
}

function takeFromStation(station, slotIndex) {
  const slot = station.slots[slotIndex];
  if (!slot.item || !slot.done) return null;
  const item = slot.item;
  station.slots[slotIndex] = emptySlot();
  return { kind: item.kind, state: item.state };
}

function updateStation(station, dt, kind) {
  const ing = INGREDIENTS[kind];
  for (const slot of station.slots) {
    if (!slot.item || slot.done) {
      if (slot.item && slot.done && slot.item.kind === 'patty' && slot.item.state !== 'burnt') {
        // A grilled patty left on the grill burns.
        slot.burnLeft -= dt;
        if (slot.burnLeft <= 0) {
          slot.item.state = 'burnt';
          slot.item.kind = 'patty';
          burst(slotRectX(station, slot), slotRectY(station, slot), '#555', 14);
          Sfx.burn();
        }
      }
      continue;
    }
    slot.progress += dt / ing.time;
    if (slot.progress >= 1) {
      slot.progress = 1;
      slot.done = true;
      slot.item.state = ing.ready;
      slot.burnLeft = slot.item.kind === 'patty' ? 6 : 9999;
      Sfx.done();
    }
  }
}

// Helpers so kitchen.js can burst particles at a slot without knowing layout.
function slotRectX(station, slot) {
  const idx = station.slots.indexOf(slot);
  return slotRect(stationRectOf(station), idx).x + slotRect(stationRectOf(station), idx).w / 2;
}
function slotRectY(station, slot) {
  const idx = station.slots.indexOf(slot);
  return slotRect(stationRectOf(station), idx).y + 30;
}
function stationRectOf(station) {
  if (station === Game.grill) return GRILL;
  if (station === Game.chopper) return CHOPPER;
  return POT;
}

function burst(x, y, color, n) {
  for (let i = 0; i < (n || 10); i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 120;
    Game.particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 60,
      life: 0.6 + Math.random() * 0.5,
      max: 1.1,
      size: 3 + Math.random() * 5,
      color,
    });
  }
}

function steam(x, y) {
  Game.particles.push({
    x: x + (Math.random() - 0.5) * 20,
    y,
    vx: (Math.random() - 0.5) * 12,
    vy: -34 - Math.random() * 20,
    life: 0.9 + Math.random() * 0.5,
    max: 1.4,
    size: 6 + Math.random() * 7,
    color: 'rgba(255,255,255,0.55)',
  });
}

function floater(x, y, text, color) {
  Game.floaters.push({ x, y, text, color: color || '#fff', life: 1.4, max: 1.4 });
}

function plateMatches(order) {
  const recipe = recipeById(order.recipeId);
  if (Game.plate.length !== recipe.needs.length) return false;
  const have = {};
  for (const it of Game.plate) have[it.kind + ':' + it.state] = (have[it.kind + ':' + it.state] || 0) + 1;
  for (const need of recipe.needs) {
    const key = need.kind + ':' + need.state;
    if (!have[key]) return false;
    have[key]--;
  }
  return true;
}

function matchingOrder() {
  for (const o of Game.orders) if (plateMatches(o)) return o;
  return null;
}

function serveOrder(order) {
  const recipe = recipeById(order.recipeId);
  const tip = Math.round((order.patienceLeft / order.patience) * 6);
  const mult = 1 + Math.min(Game.combo, 8) * 0.1;
  const earned = Math.round((recipe.price + tip) * mult);
  Game.coins += earned;
  Game.combo += 1;
  Game.bestCombo = Math.max(Game.bestCombo, Game.combo);
  Game.served += 1;
  const cx = SERVE.x + SERVE.w / 2;
  const cy = SERVE.y + 60;
  floater(cx, cy, '+$' + earned, '#ffd94d');
  if (tip >= 4) floater(cx, cy + 28, 'FAST! +$' + tip + ' tip', '#7ddc8a');
  burst(cx, cy + 40, '#ffd94d', 18);
  burst(cx, cy + 40, '#ff8a5c', 10);
  Sfx.serve();
  Sfx.bell();
  Game.plate = [];
  Game.plateFlash = 0;
  Game.orders = Game.orders.filter((o) => o !== order);
  Game.flash = 0.25;
}

function expireOrder(order) {
  Game.orders = Game.orders.filter((o) => o !== order);
  Game.lost += 1;
  Game.combo = 0;
  Game.shake = 7;
  Sfx.fail();
}

function updateGame(dt) {
  if (Game.screen !== 'playing') return;
  Game.time += dt;
  Game.timeLeft = Math.max(0, SHIFT_LEN - Game.time);
  Game.rush = Game.timeLeft <= 30 && Game.timeLeft > 0;
  if (Game.timeLeft <= 0) {
    Game.screen = 'over';
    Game.stars = STAR_GOALS.filter((g) => Game.coins >= g).length;
    Sfx.stopSizzle();
    return;
  }

  // Orders.
  Game.spawnIn -= dt;
  if (Game.spawnIn <= 0) {
    spawnOrder();
    Game.spawnIn = spawnInterval();
  }
  for (const o of Game.orders.slice()) {
    o.patienceLeft -= dt;
    if (o.patienceLeft <= 10 && Math.random() < dt * 2) Sfx.tick();
    if (o.patienceLeft <= 0) expireOrder(o);
  }

  // Stations. Each station only ever holds its own ingredient kind
  // (grill: patty, chopper: lettuce/tomato/cheese, pot: pasta), and every
  // chopper ingredient takes 2.0s, so one timer per station is exact.
  updateStation(Game.grill, dt, 'patty');
  updateStation(Game.chopper, dt, 'lettuce');
  updateStation(Game.pot, dt, 'pasta');

  // Sizzle + steam ambience.
  const grilling = Game.grill.slots.some((s) => s.item && !s.done);
  if (grilling) {
    Sfx.startSizzle();
    if (Math.random() < dt * 6) {
      const r = slotRect(GRILL, Game.grill.slots[0].item && !Game.grill.slots[0].done ? 0 : 1);
      steam(r.x + r.w / 2, r.y + 20);
    }
  } else {
    Sfx.stopSizzle();
  }
  if (Math.random() < dt * 2) {
    const r = slotRect(POT, 0);
    if (Game.pot.slots.some((s) => s.item)) steam(r.x + r.w / 2, r.y + 20);
  }

  // Particles and floaters.
  for (const p of Game.particles) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 160 * dt;
  }
  Game.particles = Game.particles.filter((p) => p.life > 0);
  for (const f of Game.floaters) {
    f.life -= dt;
    f.y -= 42 * dt;
  }
  Game.floaters = Game.floaters.filter((f) => f.life > 0);
  if (Game.shake > 0) Game.shake = Math.max(0, Game.shake - dt * 22);
  if (Game.flash > 0) Game.flash -= dt;
  if (Game.plateFlash > 0) Game.plateFlash -= dt;
}
