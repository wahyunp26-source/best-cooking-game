// Sizzle & Serve — kitchen geometry.
// One place owns every rectangle on the 1280x800 stage, so the logic in
// kitchen.js and the drawing in render.js can never drift apart.
const STAGE_W = 1280;
const STAGE_H = 800;

const TOPBAR = { x: 0, y: 0, w: 1280, h: 64 };

// Order board (left column).
const ORDER_BOARD = { x: 16, y: 76, w: 272, h: 484 };
const TICKET_W = 272;
const TICKET_H = 140;
const TICKET_GAP = 10;
const TICKET_TOP = 106;

// Background restaurant band (y 64..196) sits above the stations: this is
// where the windows, lamps, chairs and the two staff characters live.
// Characters stand behind the stations (drawn before them, so the station
// panels cover everything below y=196 — chest-up portraits, as in the ref).
const BG_BAND = { x: 0, y: 64, w: 1280, h: 132 };
const WAITER_CX = 400;
const WAITRESS_CX = 1030;
const CHAR_TOP = 64;

// Stations, top row — moved down (was y=92) so the restaurant band reads.
const GRILL = { x: 320, y: 196, w: 272, h: 150 };
const CHOPPER = { x: 608, y: 196, w: 272, h: 150 };
const POT = { x: 896, y: 196, w: 272, h: 150 };
// Assembly + serving, bottom row of the kitchen.
const PLATE = { x: 320, y: 362, w: 352, h: 198 };
const SERVE = { x: 688, y: 362, w: 480, h: 198 };

// Ingredient bins along the bottom (7 ingredients + trash).
// y=592 leaves a clean 16px gap under the counter band (ends 576) for the
// INGREDIENTS label, which used to sit at y=566 and get struck through by it.
const BIN_ROW = { x: 16, y: 592, w: 1248, h: 164 };
const BIN_GAP = 8;
const BIN_COUNT = 8;

function binRect(i) {
  const w = (BIN_ROW.w - BIN_GAP * (BIN_COUNT - 1)) / BIN_COUNT;
  return { x: BIN_ROW.x + i * (w + BIN_GAP), y: BIN_ROW.y, w, h: BIN_ROW.h };
}

// Two work slots inside a station rect (stations are 150 tall now).
function slotRect(station, i) {
  const pad = 14;
  const w = (station.w - pad * 2 - 12) / 2;
  return {
    x: station.x + pad + i * (w + 12),
    y: station.y + 52,
    w,
    h: station.h - 66,
  };
}

function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

// Deterministic random for staged screenshot scenes.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
