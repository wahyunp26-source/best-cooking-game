// Sizzle & Serve — everything the player sees.
// All art is drawn with canvas paths: no images, no fonts to download.
function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function text(ctx, s, x, y, size, color, align, weight) {
  ctx.fillStyle = color || '#3a2a1a';
  ctx.font = (weight || 'bold') + ' ' + size + 'px Arial, sans-serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

function shadowText(ctx, s, x, y, size, color, align, weight) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.font = (weight || 'bold') + ' ' + size + 'px Arial, sans-serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x + 2, y + 2);
  text(ctx, s, x, y, size, color, align, weight);
}

// ---------- depth helpers for food ----------
// Soft contact shadow under a food icon (only for large icons: bins,
// stations, plate — tickets at size 34 skip it so they stay clean).
function foodShadow(ctx, s) {
  ctx.fillStyle = 'rgba(60,30,10,0.16)';
  ctx.beginPath();
  ctx.ellipse(0, s * 0.8, s * 0.85, s * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function radialGrad(ctx, x, y, r, c0, c1) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);
  return g;
}

function linearGrad(ctx, x0, y0, x1, y1, c0, c1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);
  return g;
}

// ---------- reference palette (measured from Wahyu's ref image) ----------
const PAL = {
  cream: '#eae0d9', gold: '#e6d1a3', tan: '#dd9b67', wood: '#ab8e6c',
  caramel: '#9f542d', midBrown: '#9e6859', deep: '#63231a', coral: '#d8645d',
  strongRed: '#9c261d', rose: '#dda897', mauve: '#685a66', steel: '#a39a9a',
  leaf: '#5a7d3a', darkLeaf: '#3f6b2f', sky: '#7fa8c9', teal: '#6a9a94',
  plate: '#f7f2ea', ink: '#3a2a1a',
};

// Diamond crosshatch grill marks, clipped to a rect.
function drawCrosshatch(ctx, x, y, w, h, color, lw) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw || 2;
  const step = 11;
  for (let d = -h; d < w + h; d += step) {
    ctx.beginPath();
    ctx.moveTo(x + d, y);
    ctx.lineTo(x + d + h, y + h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + d, y + h);
    ctx.lineTo(x + d + h, y);
    ctx.stroke();
  }
  ctx.restore();
}

// Big round steak: irregular oval, caramel radial, crosshatch, gloss arc.
// cx, cy centre; rx, ry radii.
function drawSteak(ctx, cx, cy, rx, ry) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.06);
  ctx.fillStyle = 'rgba(99,35,26,0.22)';
  ctx.beginPath();
  ctx.ellipse(2, ry * 0.55, rx * 0.95, ry * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = radialGrad(ctx, 0, -ry * 0.2, rx, '#c07a45', '#9f542d');
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(99,35,26,0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  drawCrosshatch(ctx, -rx * 0.85, -ry * 0.8, rx * 1.7, ry * 1.6, 'rgba(74,42,16,0.75)', 2.5);
  ctx.fillStyle = 'rgba(255,235,200,0.35)';
  ctx.beginPath();
  ctx.ellipse(-rx * 0.35, -ry * 0.5, rx * 0.4, ry * 0.22, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------- restaurant background (band y 64..196 + floor + counters) ----------
function drawArchedWindow(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#8a6a4a';
  rr(ctx, x - 5, y - 5, w + 10, h + 10, 18);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + 22);
  ctx.arc(x + w / 2, y + 22, w / 2, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, '#8fb6d4');
  sky.addColorStop(1, '#c9d9e8');
  ctx.fillStyle = sky;
  ctx.fill();
  const sun = ctx.createRadialGradient(x + w * 0.72, y + h * 0.3, 2, x + w * 0.72, y + h * 0.3, w * 0.5);
  sun.addColorStop(0, 'rgba(230,209,163,0.9)');
  sun.addColorStop(1, 'rgba(230,209,163,0)');
  ctx.fillStyle = sun;
  ctx.fill();
  ctx.strokeStyle = '#8a6a4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 4);
  ctx.lineTo(x + w / 2, y + h);
  ctx.moveTo(x, y + h * 0.55);
  ctx.lineTo(x + w, y + h * 0.55);
  ctx.stroke();
  ctx.restore();
}

function drawWallLamp(ctx, x, y) {
  const glow = ctx.createRadialGradient(x, y, 2, x, y, 46);
  glow.addColorStop(0, 'rgba(255,214,130,0.55)');
  glow.addColorStop(1, 'rgba(255,214,130,0)');
  ctx.fillStyle = glow;
  circle(ctx, x, y, 46);
  ctx.fill();
  ctx.fillStyle = '#8a6a4a';
  ctx.fillRect(x - 3, y - 26, 6, 14);
  ctx.fillStyle = '#e6d1a3';
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y - 12);
  ctx.lineTo(x + 7, y + 2);
  ctx.lineTo(x - 7, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  circle(ctx, x, y + 4, 5);
  ctx.fill();
}

function drawChair(ctx, x, y, color, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.fillStyle = 'rgba(99,35,26,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 34, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  rr(ctx, -14, -30, 28, 34, 12);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  rr(ctx, -14, -30, 28, 8, 12);
  ctx.fill();
  ctx.fillStyle = '#6a4a34';
  ctx.fillRect(-12, 4, 4, 28);
  ctx.fillRect(8, 4, 4, 28);
  ctx.restore();
}

function drawTable(ctx, x, y) {
  ctx.fillStyle = 'rgba(99,35,26,0.18)';
  ctx.beginPath();
  ctx.ellipse(x, y + 30, 34, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f7f2ea';
  ctx.beginPath();
  ctx.ellipse(x, y, 36, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ab8e6c';
  ctx.fillRect(x - 3, y + 6, 6, 24);
  ctx.fillStyle = '#8a6a4a';
  ctx.beginPath();
  ctx.ellipse(x, y + 30, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

// 3D dining-room backdrop (a rendered image made for this entry): the
// photo replaces the flat vector wall behind the kitchen. If the file
// cannot load, the game falls back to the vector restaurant below.
const backdropImg = new Image();
let backdropReady = false;
window.__backdropReady = false;
backdropImg.onload = () => { backdropReady = true; window.__backdropReady = true; };
backdropImg.onerror = () => { window.__backdropError = true; };
backdropImg.src = 'assets/backdrop.jpg';

function drawRestaurant(ctx) {
  // Wall: warm cream gradient.
  const wall = ctx.createLinearGradient(0, 64, 0, 560);
  wall.addColorStop(0, '#f2e6d2');
  wall.addColorStop(0.5, '#e9d8b4');
  wall.addColorStop(1, '#e0c99a');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 64, STAGE_W, 496);
  // Arched windows (clear of the characters at x 336..466 and 966..1096).
  drawArchedWindow(ctx, 548, 72, 132, 92);
  drawArchedWindow(ctx, 1120, 72, 128, 92);
  // Wall lamps.
  drawWallLamp(ctx, 742, 108);
  drawWallLamp(ctx, 896, 108);
  // Brick band along the bottom of the wall.
  ctx.fillStyle = '#9e6859';
  ctx.fillRect(0, 168, STAGE_W, 28);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 168, STAGE_W, 3);
  ctx.fillRect(0, 182, STAGE_W, 2);
  for (let bx = 12; bx < STAGE_W; bx += 48) {
    ctx.fillRect(bx, 168, 2, 28);
    ctx.fillRect(bx + 24, 182, 2, 14);
  }
  // Tables + pink/teal chairs peeking above the counter line.
  drawTable(ctx, 620, 168);
  drawChair(ctx, 578, 162, '#dda897', false);
  drawChair(ctx, 664, 162, '#6a9a94', true);
  drawTable(ctx, 1180, 168);
  drawChair(ctx, 1140, 162, '#6a9a94', false);
  // Wood floor at the very bottom.
  ctx.fillStyle = '#ab8e6c';
  ctx.fillRect(0, 756, STAGE_W, 44);
  ctx.fillStyle = '#8a6a4a';
  for (let fx = 0; fx < STAGE_W; fx += 96) ctx.fillRect(fx, 756, 2, 44);
  ctx.fillRect(0, 770, STAGE_W, 2);
  ctx.fillRect(0, 785, STAGE_W, 2);
  // Wooden counter surface the ingredient bowls sit on (full width,
  // glossy grain) — the bins sit ON the counter, not on a tiled floor.
  // Starts at y=568 so there is no unpainted gap under the order board.
  const counterGrad = ctx.createLinearGradient(0, 568, 0, 756);
  counterGrad.addColorStop(0, '#c08a4e');
  counterGrad.addColorStop(1, '#a9703f');
  ctx.fillStyle = counterGrad;
  ctx.fillRect(0, 568, STAGE_W, 188);
  ctx.fillStyle = 'rgba(255,235,200,0.30)';
  ctx.fillRect(0, 568, STAGE_W, 3);
  ctx.strokeStyle = 'rgba(120,80,30,0.35)';
  ctx.lineWidth = 1.5;
  for (const gy of [620, 690, 740]) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.quadraticCurveTo(420, gy + 4, 860, gy - 2);
    ctx.quadraticCurveTo(1100, gy + 2, STAGE_W, gy);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(99,35,26,0.18)';
  for (let fx = 180; fx < STAGE_W; fx += 320) ctx.fillRect(fx, 568, 2, 188);
  // (Counter bands moved to drawCounterBands — drawn over the photo.)
}

// Wooden counter bands (extracted from drawRestaurant): drawn over the 3D
// backdrop photo so the stations and the plate row sit ON a counter.
function drawCounterBands(ctx) {
  // Band between the station row and the plate row — a real glossy
  // counter band the stations sit ON, with grain + shine.
  ctx.fillStyle = 'rgba(99,35,26,0.25)';
  ctx.fillRect(304, 344, 976, 6);
  ctx.fillStyle = '#a9703f';
  ctx.fillRect(304, 344, 976, 22);
  ctx.fillStyle = '#c08a4e';
  ctx.fillRect(304, 344, 976, 4);
  ctx.fillStyle = 'rgba(255,235,200,0.35)';
  ctx.fillRect(304, 348, 976, 2);
  ctx.strokeStyle = 'rgba(120,80,30,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(320, 358);
  ctx.quadraticCurveTo(640, 362, 980, 357);
  ctx.moveTo(360, 363);
  ctx.quadraticCurveTo(700, 366, 1100, 362);
  ctx.stroke();
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(304, 362, 976, 4);
  // Band under the plate/serve row.
  ctx.fillStyle = 'rgba(99,35,26,0.25)';
  ctx.fillRect(304, 558, 976, 6);
  ctx.fillStyle = '#a9703f';
  ctx.fillRect(304, 558, 976, 22);
  ctx.fillStyle = '#c08a4e';
  ctx.fillRect(304, 558, 976, 4);
  ctx.fillStyle = 'rgba(255,235,200,0.35)';
  ctx.fillRect(304, 562, 976, 2);
  ctx.strokeStyle = 'rgba(120,80,30,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(320, 572);
  ctx.quadraticCurveTo(640, 576, 980, 571);
  ctx.stroke();
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(304, 576, 976, 4);
}

// ---------- staff characters (chest-up, drawn behind the stations) ----------
function drawFace(ctx, cx, cy, skin) {
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 40, 46, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(99,35,26,0.5)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  // Soft cheek shading + glossy highlight on the cheek.
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.ellipse(cx - 16, cy - 18, 12, 7, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Ears.
  ctx.fillStyle = skin;
  circle(ctx, cx - 40, cy + 2, 7);
  ctx.fill();
  circle(ctx, cx + 40, cy + 2, 7);
  ctx.fill();
}

function drawEyes(ctx, cx, cy, lashes) {
  for (const dx of [-15, 15]) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(cx + dx, cy, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2a2018';
    circle(ctx, cx + dx, cy + 1, 5.5);
    ctx.fill();
    ctx.fillStyle = '#fff';
    circle(ctx, cx + dx - 2, cy - 2, 2.2);
    ctx.fill();
    if (lashes) {
      ctx.strokeStyle = '#2a2018';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx + dx - 7, cy - 10);
      ctx.lineTo(cx + dx - 11, cy - 14);
      ctx.moveTo(cx + dx + 7, cy - 10);
      ctx.lineTo(cx + dx + 11, cy - 14);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = 'rgba(99,35,26,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 23, cy - 19);
  ctx.quadraticCurveTo(cx - 15, cy - 23, cx - 7, cy - 19);
  ctx.moveTo(cx + 7, cy - 19);
  ctx.quadraticCurveTo(cx + 15, cy - 23, cx + 23, cy - 19);
  ctx.stroke();
}

function drawSmile(ctx, cx, cy, color) {
  ctx.strokeStyle = color || '#8e4a3a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, 12, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ctx.fillStyle = 'rgba(217,100,93,0.35)';
  circle(ctx, cx - 26, cy + 8, 6);
  ctx.fill();
  circle(ctx, cx + 26, cy + 8, 6);
  ctx.fill();
}

function drawWaiter(ctx) {
  const cx = WAITER_CX, top = CHAR_TOP;
  ctx.save();
  // Shoulders: navy suit.
  ctx.fillStyle = '#2f4a7a';
  ctx.beginPath();
  ctx.moveTo(cx - 78, top + 176);
  ctx.quadraticCurveTo(cx - 76, top + 118, cx - 40, top + 108);
  ctx.lineTo(cx + 40, top + 108);
  ctx.quadraticCurveTo(cx + 76, top + 118, cx + 78, top + 176);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(99,35,26,0.5)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(cx - 72, top + 176);
  ctx.quadraticCurveTo(cx - 70, top + 122, cx - 40, top + 112);
  ctx.lineTo(cx - 20, top + 176);
  ctx.closePath();
  ctx.fill();
  // Shirt + tie.
  ctx.fillStyle = '#f7f2ea';
  ctx.beginPath();
  ctx.moveTo(cx - 18, top + 108);
  ctx.lineTo(cx + 18, top + 108);
  ctx.lineTo(cx + 11, top + 176);
  ctx.lineTo(cx - 11, top + 176);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9c261d';
  ctx.beginPath();
  ctx.moveTo(cx - 6, top + 112);
  ctx.lineTo(cx + 6, top + 112);
  ctx.lineTo(cx + 8, top + 152);
  ctx.lineTo(cx, top + 164);
  ctx.lineTo(cx - 8, top + 152);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f7f2ea';
  ctx.beginPath();
  ctx.moveTo(cx - 18, top + 108);
  ctx.lineTo(cx, top + 122);
  ctx.lineTo(cx - 9, top + 132);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 18, top + 108);
  ctx.lineTo(cx, top + 122);
  ctx.lineTo(cx + 9, top + 132);
  ctx.closePath();
  ctx.fill();
  // Neck + head.
  ctx.fillStyle = '#dd9b67';
  ctx.fillRect(cx - 11, top + 90, 22, 24);
  drawFace(ctx, cx, top + 52, '#dd9b67');
  // Dark side-parted hair: glossy 3D volume, not a flat cap.
  ctx.fillStyle = '#2e2118';
  ctx.beginPath();
  ctx.ellipse(cx, top + 26, 43, 28, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 43, top + 30);
  ctx.quadraticCurveTo(cx - 36, top + 0, cx - 8, top + 8);
  ctx.quadraticCurveTo(cx + 20, top + 0, cx + 41, top + 12);
  ctx.quadraticCurveTo(cx + 45, top + 28, cx + 43, top + 32);
  ctx.lineTo(cx + 36, top + 20);
  ctx.quadraticCurveTo(cx, top + 8, cx - 36, top + 20);
  ctx.closePath();
  ctx.fill();
  // Hair gloss: a shiny sweep across the top-left of the hair.
  ctx.fillStyle = 'rgba(255,255,255,0.20)';
  ctx.beginPath();
  ctx.ellipse(cx - 16, top + 10, 16, 6, -0.35, 0, Math.PI * 2);
  ctx.fill();
  drawEyes(ctx, cx, top + 52, false);
  drawSmile(ctx, cx, top + 78);
  ctx.restore();
}

function drawWaitress(ctx) {
  const cx = WAITRESS_CX, top = CHAR_TOP;
  ctx.save();
  // Blonde hair behind the shoulders.
  ctx.fillStyle = '#e6c87a';
  ctx.beginPath();
  ctx.ellipse(cx, top + 100, 50, 72, 0, 0, Math.PI * 2);
  ctx.fill();
  // Shoulders: pink/red dress.
  ctx.fillStyle = '#d8645d';
  ctx.beginPath();
  ctx.moveTo(cx - 74, top + 176);
  ctx.quadraticCurveTo(cx - 72, top + 116, cx - 38, top + 106);
  ctx.lineTo(cx + 38, top + 106);
  ctx.quadraticCurveTo(cx + 72, top + 116, cx + 74, top + 176);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(99,35,26,0.5)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.moveTo(cx - 68, top + 176);
  ctx.quadraticCurveTo(cx - 66, top + 120, cx - 36, top + 110);
  ctx.lineTo(cx - 18, top + 176);
  ctx.closePath();
  ctx.fill();
  // Dress neckline.
  ctx.fillStyle = '#f7f2ea';
  ctx.beginPath();
  ctx.moveTo(cx - 22, top + 106);
  ctx.quadraticCurveTo(cx, top + 128, cx + 22, top + 106);
  ctx.quadraticCurveTo(cx, top + 118, cx - 22, top + 106);
  ctx.closePath();
  ctx.fill();
  // Neck + head.
  ctx.fillStyle = '#e8b48a';
  ctx.fillRect(cx - 10, top + 88, 20, 24);
  drawFace(ctx, cx, top + 50, '#e8b48a');
  // Blonde waves framing the face: glossy 3D volumes.
  ctx.fillStyle = '#e6c87a';
  ctx.beginPath();
  ctx.ellipse(cx, top + 22, 43, 26, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - 40, top + 50, 14, 30, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 40, top + 50, 14, 30, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 42, top + 30);
  ctx.quadraticCurveTo(cx - 40, top + 2, cx, top + 4);
  ctx.quadraticCurveTo(cx + 40, top + 2, cx + 42, top + 30);
  ctx.quadraticCurveTo(cx + 36, top + 16, cx, top + 14);
  ctx.quadraticCurveTo(cx - 36, top + 16, cx - 42, top + 30);
  ctx.closePath();
  ctx.fill();
  // Hair gloss.
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath();
  ctx.ellipse(cx - 18, top + 10, 16, 6, -0.35, 0, Math.PI * 2);
  ctx.fill();
  drawEyes(ctx, cx, top + 50, true);
  drawSmile(ctx, cx, top + 76, '#c65a5a');
  ctx.restore();
}

// ---------- food icons (drawn at cx, cy, fitting inside `size`) ----------
function drawIngredient(ctx, kind, state, cx, cy, size) {
  const s = size / 2;
  ctx.save();
  ctx.translate(cx, cy);
  const big = size >= 50; // contact shadow only on large icons
  if (kind === 'bun') {
    if (big) foodShadow(ctx, s);
    // Domed top bun: radial shading, rim, tilted sesame seeds.
    ctx.fillStyle = radialGrad(ctx, 0, -s * 0.1, s * 1.05, '#f6c468', '#cf8a26');
    ctx.beginPath();
    ctx.ellipse(0, 2, s, s * 0.62, 0, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,70,10,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff2cf';
    for (const [dx, dy, a] of [[-s * 0.45, -s * 0.38, -0.4], [0, -s * 0.55, 0.2], [s * 0.45, -s * 0.38, 0.5]]) {
      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.5, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#d18f2e';
    rr(ctx, -s, 0, s * 2, s * 0.22, 3);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    rr(ctx, -s, 0, s * 2, s * 0.07, 3);
    ctx.fill();
  } else if (kind === 'patty') {
    if (big) foodShadow(ctx, s);
    if (state === 'burnt') {
      ctx.fillStyle = '#26211d';
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath();
      ctx.ellipse(-s * 0.3, -s * 0.2, s * 0.4, s * 0.14, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f0c0a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.3);
      ctx.lineTo(s * 0.2, s * 0.2);
      ctx.moveTo(s * 0.4, -s * 0.35);
      ctx.lineTo(-s * 0.1, s * 0.3);
      ctx.stroke();
    } else if (state === 'grilled') {
      // Round steak: caramel radial, diamond crosshatch, gloss arc.
      ctx.fillStyle = radialGrad(ctx, 0, -s * 0.1, s, '#c07a45', '#9f542d');
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.92, s * 0.4, 0, 0, Math.PI * 2);
      ctx.clip();
      drawCrosshatch(ctx, -s, -s * 0.45, s * 2, s * 0.9, 'rgba(74,42,16,0.7)', 2);
      ctx.restore();
      ctx.fillStyle = 'rgba(255,235,200,0.35)';
      ctx.beginPath();
      ctx.ellipse(-s * 0.32, -s * 0.2, s * 0.36, s * 0.12, -0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Raw steak: pink oval, white fat marbling, gloss.
      ctx.fillStyle = radialGrad(ctx, 0, 0, s, '#e89a90', '#bd655c');
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f2c9c2';
      ctx.beginPath();
      ctx.ellipse(-s * 0.35, -s * 0.05, s * 0.3, s * 0.08, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(s * 0.3, s * 0.1, s * 0.25, s * 0.07, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.ellipse(-s * 0.3, -s * 0.28, s * 0.4, s * 0.14, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'lettuce') {
    if (big) foodShadow(ctx, s);
    if (state === 'chopped') {
      // Wavy ribbons in two greens, like torn lettuce shreds.
      ctx.lineCap = 'round';
      const ribbons = [[-s * 0.55, -s * 0.1, s * 0.75], [0, s * 0.18, s * 0.9], [s * 0.5, -s * 0.2, s * 0.7]];
      for (const [dx, dy, w] of ribbons) {
        ctx.strokeStyle = '#5da85f';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(dx - w / 2, dy);
        ctx.quadraticCurveTo(dx, dy - 7, dx + w / 2, dy + 2);
        ctx.stroke();
      }
      ctx.strokeStyle = '#8ed08a';
      ctx.lineWidth = 4;
      for (const [dx, dy, w] of [[-s * 0.3, -s * 0.32, s * 0.5], [s * 0.25, s * 0.32, s * 0.55]]) {
        ctx.beginPath();
        ctx.moveTo(dx - w / 2, dy);
        ctx.quadraticCurveTo(dx, dy - 6, dx + w / 2, dy + 2);
        ctx.stroke();
      }
    } else {
      // Ruffled leaf: three overlapping ellipses + vein.
      ctx.fillStyle = '#5da85f';
      ctx.beginPath();
      ctx.ellipse(-s * 0.3, s * 0.1, s * 0.55, s * 0.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(s * 0.3, s * 0.1, s * 0.55, s * 0.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = radialGrad(ctx, 0, 0, s, '#7ccb74', '#4e9a4c');
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.05, s * 0.7, s * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3f7d3d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.quadraticCurveTo(s * 0.3, 0, 0, s * 0.6);
      ctx.stroke();
    }
  } else if (kind === 'tomato') {
    if (big) foodShadow(ctx, s);
    if (state === 'chopped') {
      // Tomato slice: dark rim, pale flesh, seeds, juice sheen.
      ctx.fillStyle = '#c93a2c';
      circle(ctx, 0, 0, s * 0.85);
      ctx.fill();
      ctx.fillStyle = '#f0837a';
      circle(ctx, 0, 0, s * 0.62);
      ctx.fill();
      ctx.fillStyle = '#f7c9c4';
      for (const [dx, dy] of [[-s * 0.25, 0], [s * 0.25, -s * 0.15], [0, s * 0.28]]) {
        ctx.beginPath();
        ctx.ellipse(dx, dy, s * 0.11, s * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.68, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();
    } else {
      ctx.fillStyle = radialGrad(ctx, 0, 0, s * 0.9, '#f2705f', '#c93a2c');
      circle(ctx, 0, 0, s * 0.85);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.ellipse(-s * 0.32, -s * 0.34, s * 0.26, s * 0.15, -0.5, 0, Math.PI * 2);
      ctx.fill();
      // Stem + two leaves.
      ctx.fillStyle = '#3f7d3d';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(-s * 0.28, -s * 1.08);
      ctx.lineTo(s * 0.28, -s * 1.08);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#4e9a4c';
      ctx.beginPath();
      ctx.ellipse(-s * 0.42, -s * 0.82, s * 0.3, s * 0.13, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(s * 0.42, -s * 0.82, s * 0.3, s * 0.13, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'cheese') {
    if (big) foodShadow(ctx, s);
    if (state === 'chopped') {
      ctx.lineCap = 'round';
      const cols = ['#f2c94c', '#ffd94d', '#e8b32a'];
      for (let i = 0; i < 3; i++) {
        const dx = (i - 1) * s * 0.5;
        ctx.strokeStyle = cols[i];
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(dx, -s * 0.45);
        ctx.quadraticCurveTo(dx + 5, 0, dx - 2, s * 0.45);
        ctx.stroke();
      }
      ctx.strokeStyle = '#ffdf7a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.4);
      ctx.quadraticCurveTo(-s * 0.45, 0, -s * 0.52, s * 0.4);
      ctx.stroke();
    } else {
      ctx.fillStyle = linearGrad(ctx, -s, -s * 0.4, s, s * 0.6, '#ffd94d', '#e0a91f');
      ctx.beginPath();
      ctx.moveTo(-s, s * 0.6);
      ctx.lineTo(s, s * 0.6);
      ctx.lineTo(s, -s * 0.4);
      ctx.closePath();
      ctx.fill();
      // Darker side face for a 3D wedge.
      ctx.fillStyle = 'rgba(160,110,10,0.35)';
      ctx.beginPath();
      ctx.moveTo(s, -s * 0.4);
      ctx.lineTo(s, s * 0.6);
      ctx.lineTo(s * 0.55, s * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#b8860b';
      circle(ctx, -s * 0.3, s * 0.15, 3.5);
      ctx.fill();
      circle(ctx, s * 0.3, s * 0.3, 3);
      ctx.fill();
      circle(ctx, -s * 0.05, s * 0.38, 2.5);
      ctx.fill();
    }
  } else if (kind === 'pasta') {
    if (big) foodShadow(ctx, s);
    if (state === 'boiled') {
      ctx.lineCap = 'round';
      const arcs = [
        [0, -s * 0.35, s * 0.55, '#f0d48a', 5],
        [0, 0, s * 0.42, '#e8b95a', 4],
        [0, s * 0.3, s * 0.32, '#f0d48a', 4],
      ];
      for (const [ax, ay, ar, col, lw] of arcs) {
        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(ax, ay, ar, 0.3, Math.PI * 1.7);
        ctx.stroke();
      }
      // Marinara sauce dots.
      ctx.fillStyle = '#c94a3a';
      for (const [dx, dy] of [[-s * 0.35, -s * 0.3], [s * 0.3, s * 0.05], [0, s * 0.35]]) {
        circle(ctx, dx, dy, s * 0.11);
        ctx.fill();
      }
    } else {
      ctx.lineCap = 'round';
      const cols = ['#ecd9a0', '#dfc07a', '#ecd9a0', '#dfc07a'];
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = cols[i];
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-s + i * s * 0.5, -s * 0.5);
        ctx.quadraticCurveTo(-s + i * s * 0.5 + 6, 0, -s + i * s * 0.5, s * 0.5);
        ctx.stroke();
      }
    }
  } else if (kind === 'sauce') {
    if (big) foodShadow(ctx, s);
    ctx.fillStyle = radialGrad(ctx, 0, 0, s * 0.75, '#e06048', '#8e2f22');
    circle(ctx, 0, s * 0.1, s * 0.7);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(-s * 0.22, -s * 0.18, s * 0.2, s * 0.12, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a83226';
    circle(ctx, s * 0.25, s * 0.3, s * 0.2);
    ctx.fill();
  }
  ctx.restore();
}

// ---------- stations ----------
function drawProgressRing(ctx, x, y, r, progress, done) {
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  circle(ctx, x, y, r);
  ctx.stroke();
  ctx.strokeStyle = done ? '#5da85f' : '#ff9a3d';
  ctx.beginPath();
  ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();
  if (done) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.45, y);
    ctx.lineTo(x - r * 0.1, y + r * 0.4);
    ctx.lineTo(x + r * 0.5, y - r * 0.4);
    ctx.stroke();
  }
}

function drawStationBase(ctx, rect, label, sub, accent) {
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rr(ctx, rect.x + 3, rect.y + 5, rect.w, rect.h, 14);
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  rr(ctx, rect.x, rect.y, rect.w, rect.h, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  rr(ctx, rect.x, rect.y, rect.w, 40, 14);
  ctx.fill();
  ctx.fillRect(rect.x, rect.y + 26, rect.w, 14);
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  ctx.fillRect(rect.x, rect.y + 40, rect.w, 4);
  text(ctx, label, rect.x + 16, rect.y + 21, 19, '#fff');
  text(ctx, sub, rect.x + rect.w - 14, rect.y + 21, 13, 'rgba(255,255,255,0.85)', 'right');
}

function drawGrill(ctx, hover) {
  drawStationBase(ctx, GRILL, 'GRILL', 'patty · 4s', '#c65a3c');
  // Red machine frame + silver rim + dark bed, like the ref grill.
  ctx.fillStyle = '#d8645d';
  rr(ctx, GRILL.x + 10, GRILL.y + 50, GRILL.w - 20, GRILL.h - 54, 10);
  ctx.fill();
  ctx.fillStyle = '#b03a2e';
  rr(ctx, GRILL.x + 10, GRILL.y + GRILL.h - 60, GRILL.w - 20, 6, 3);
  ctx.fill();
  ctx.strokeStyle = '#a39a9a';
  ctx.lineWidth = 3;
  rr(ctx, GRILL.x + 14, GRILL.y + 54, GRILL.w - 28, GRILL.h - 68, 8);
  ctx.stroke();
  ctx.fillStyle = '#63231a';
  rr(ctx, GRILL.x + 16, GRILL.y + 56, GRILL.w - 32, GRILL.h - 78, 7);
  ctx.fill();
  // Parallel grate slots with orange ember glow between them.
  ctx.save();
  rr(ctx, GRILL.x + 16, GRILL.y + 56, GRILL.w - 32, GRILL.h - 78, 7);
  ctx.clip();
  const ember = ctx.createLinearGradient(0, GRILL.y + 100, 0, GRILL.y + GRILL.h - 22);
  ember.addColorStop(0, 'rgba(255,120,30,0)');
  ember.addColorStop(1, 'rgba(255,120,30,0.65)');
  ctx.fillStyle = ember;
  ctx.fillRect(GRILL.x + 16, GRILL.y + 96, GRILL.w - 32, GRILL.h - 118);
  ctx.strokeStyle = '#2a1a12';
  ctx.lineWidth = 5;
  for (let i = 1; i < 5; i++) {
    const x = GRILL.x + 16 + ((GRILL.w - 32) / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, GRILL.y + 60);
    ctx.lineTo(x, GRILL.y + GRILL.h - 26);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,150,50,0.45)';
  for (let i = 0; i < 5; i++) {
    const x = GRILL.x + 30 + i * ((GRILL.w - 60) / 4);
    ctx.beginPath();
    ctx.ellipse(x, GRILL.y + GRILL.h - 26, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // Glossy top edge + side face so the grill reads as a 3D box, not a panel.
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  rr(ctx, GRILL.x + 14, GRILL.y + 52, GRILL.w - 28, 4, 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rr(ctx, GRILL.x + 14, GRILL.y + GRILL.h - 58, GRILL.w - 28, 4, 2);
  ctx.fill();
  // Indicator lights + vent slots on the frame's front strip.
  const ly = GRILL.y + GRILL.h - 13;
  const lightCols = ['#5da85f', '#f2c94c', '#d94f3d'];
  lightCols.forEach((c, i) => {
    ctx.fillStyle = c;
    circle(ctx, GRILL.x + 34 + i * 18, ly, 4.5);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    circle(ctx, GRILL.x + 32.5 + i * 18, ly - 1.5, 1.5);
    ctx.fill();
  });
  ctx.strokeStyle = 'rgba(99,35,26,0.6)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const x = GRILL.x + GRILL.w - 62 + i * 10;
    ctx.beginPath();
    ctx.moveTo(x, ly - 5);
    ctx.lineTo(x, ly + 5);
    ctx.stroke();
  }
  const cooking = Game.grill.slots.some((s) => s.item && !s.done);
  if (cooking) {
    ctx.save();
    rr(ctx, GRILL.x + 16, GRILL.y + 56, GRILL.w - 32, GRILL.h - 78, 7);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,120,40,' + (0.12 + 0.08 * Math.sin(performance.now() / 180)) + ')';
    ctx.fillRect(GRILL.x + 16, GRILL.y + 56, GRILL.w - 32, GRILL.h - 78);
    ctx.restore();
  }
  Game.grill.slots.forEach((slot, i) => {
    const r = slotRect(GRILL, i);
    if (slot.item) {
      drawIngredient(ctx, slot.item.kind, slot.item.state, r.x + r.w / 2, r.y + r.h / 2 - 6, 76);
      drawProgressRing(ctx, r.x + r.w / 2, r.y + r.h - 14, 13, slot.progress, slot.done);
      if (slot.item.state === 'burnt') {
        text(ctx, 'BURNT!', r.x + r.w / 2, r.y + 16, 13, '#fff', 'center');
      } else if (slot.done) {
        text(ctx, 'READY', r.x + r.w / 2, r.y + 16, 12, '#7ddc8a', 'center');
      }
    } else {
      // Empty grate slot: dark slot with a faint ember line at its base.
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      rr(ctx, r.x, r.y, r.w, r.h, 8);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,140,50,0.4)';
      rr(ctx, r.x + 10, r.y + r.h - 12, r.w - 20, 4, 2);
      ctx.fill();
    }
  });
  if (hover) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    rr(ctx, GRILL.x - 2, GRILL.y - 2, GRILL.w + 4, GRILL.h + 4, 16);
    ctx.stroke();
  }
}

function drawChopper(ctx, hover) {
  drawStationBase(ctx, CHOPPER, 'CHOPPING BOARD', 'veg · 2s', '#7a9e4b');
  ctx.fillStyle = '#d9b078';
  rr(ctx, CHOPPER.x + 14, CHOPPER.y + 54, CHOPPER.w - 28, CHOPPER.h - 68, 10);
  ctx.fill();
  // Wood grain + inner top shadow for a real board.
  ctx.save();
  rr(ctx, CHOPPER.x + 14, CHOPPER.y + 54, CHOPPER.w - 28, CHOPPER.h - 68, 10);
  ctx.clip();
  const boardGrad = ctx.createLinearGradient(0, CHOPPER.y + 54, 0, CHOPPER.y + 74);
  boardGrad.addColorStop(0, 'rgba(120,80,30,0.28)');
  boardGrad.addColorStop(1, 'rgba(120,80,30,0)');
  ctx.fillStyle = boardGrad;
  ctx.fillRect(CHOPPER.x + 14, CHOPPER.y + 54, CHOPPER.w - 28, 20);
  ctx.strokeStyle = 'rgba(150,110,60,0.45)';
  ctx.lineWidth = 2;
  for (const gy of [96, 128, 158]) {
    ctx.beginPath();
    ctx.moveTo(CHOPPER.x + 26, CHOPPER.y + gy);
    ctx.quadraticCurveTo(CHOPPER.x + CHOPPER.w / 2, CHOPPER.y + gy + 5, CHOPPER.x + CHOPPER.w - 26, CHOPPER.y + gy - 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = '#b98d54';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CHOPPER.x + 30, CHOPPER.y + 70);
  ctx.lineTo(CHOPPER.x + CHOPPER.w - 30, CHOPPER.y + 70);
  ctx.stroke();
  // Chef's knife resting across the board's top edge — drawn BEFORE the
  // slots so a READY pill is never hidden under its handle (was covering
  // the "DY" of slot 2's pill).
  ctx.save();
  ctx.translate(CHOPPER.x + CHOPPER.w - 52, CHOPPER.y + 60);
  ctx.rotate(-0.35);
  ctx.fillStyle = '#c9d2da';
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(44, -6);
  ctx.lineTo(52, 0);
  ctx.lineTo(44, 6);
  ctx.lineTo(0, 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(6, -3, 30, 2);
  ctx.fillStyle = '#5d3a22';
  rr(ctx, -18, -5, 20, 10, 4);
  ctx.fill();
  ctx.fillStyle = '#8a6a4a';
  circle(ctx, -14, 0, 2);
  ctx.fill();
  ctx.restore();
  Game.chopper.slots.forEach((slot, i) => {
    const r = slotRect(CHOPPER, i);
    if (slot.item) {
      drawIngredient(ctx, slot.item.kind, slot.item.state, r.x + r.w / 2, r.y + r.h / 2 - 6, 62);
      drawProgressRing(ctx, r.x + r.w / 2, r.y + r.h - 14, 13, slot.progress, slot.done);
      if (slot.done) {
        ctx.fillStyle = '#33302a';
        rr(ctx, r.x + r.w / 2 - 32, r.y + 6, 64, 20, 10);
        ctx.fill();
        text(ctx, 'READY', r.x + r.w / 2, r.y + 16, 12, '#7ddc8a', 'center');
      }
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      rr(ctx, r.x, r.y, r.w, r.h, 8);
      ctx.fill();
    }
  });
  if (hover) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    rr(ctx, CHOPPER.x - 2, CHOPPER.y - 2, CHOPPER.w + 4, CHOPPER.h + 4, 16);
    ctx.stroke();
  }
}

function drawPot(ctx, hover) {
  drawStationBase(ctx, POT, 'PASTA POT', 'pasta · 5s', '#4a7fb5');
  Game.pot.slots.forEach((slot, i) => {
    const r = slotRect(POT, i);
    // Steel pot: gradient body, side handles, bright rim.
    const steel = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
    steel.addColorStop(0, '#aeb8c2');
    steel.addColorStop(0.25, '#8a97a3');
    steel.addColorStop(1, '#6b7784');
    ctx.fillStyle = steel;
    rr(ctx, r.x + 6, r.y + 6, r.w - 12, r.h - 6, 12);
    ctx.fill();
    ctx.fillStyle = '#5d6b7a';
    rr(ctx, r.x - 2, r.y + 22, 10, 14, 4);
    ctx.fill();
    rr(ctx, r.x + r.w - 8, r.y + 22, 10, 14, 4);
    ctx.fill();
    ctx.fillStyle = '#c9d2da';
    rr(ctx, r.x + 6, r.y + 6, r.w - 12, 18, 8);
    ctx.fill();
    // Water surface as an ellipse, not a flat rect.
    ctx.fillStyle = '#7fb3d9';
    ctx.beginPath();
    ctx.ellipse(r.x + r.w / 2, r.y + 26, (r.w - 24) / 2, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(r.x + r.w / 2 - 12, r.y + 24, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    if (slot.item) {
      if (!slot.done) {
        // Bubbles + rising steam wisps while boiling.
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        for (let b = 0; b < 3; b++) {
          const bx = r.x + r.w / 2 + (b - 1) * 18 + Math.sin(performance.now() / 300 + b) * 3;
          circle(ctx, bx, r.y + 30 + b * 6, 4);
          ctx.fill();
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (const sx of [-14, 6]) {
          const wob = Math.sin(performance.now() / 400 + sx) * 3;
          ctx.beginPath();
          ctx.moveTo(r.x + r.w / 2 + sx, r.y + 22);
          ctx.quadraticCurveTo(r.x + r.w / 2 + sx + wob, r.y + 12, r.x + r.w / 2 + sx - wob, r.y + 2);
          ctx.stroke();
        }
      }
      drawIngredient(ctx, slot.item.kind, slot.item.state, r.x + r.w / 2, r.y + r.h / 2 + 4, 58);
      drawProgressRing(ctx, r.x + r.w / 2, r.y + r.h - 14, 13, slot.progress, slot.done);
      if (slot.done) text(ctx, 'READY', r.x + r.w / 2, r.y + 16, 12, '#fff', 'center');
    }
  });
  if (hover) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    rr(ctx, POT.x - 2, POT.y - 2, POT.w + 4, POT.h + 4, 16);
    ctx.stroke();
  }
}

// ---------- plate & serve ----------
const PLATE_STACK = ['bun', 'pasta', 'patty', 'lettuce', 'tomato', 'cheese', 'sauce'];

function drawPlate(ctx, hover) {
  const match = matchingOrder();
  const glow = match || Game.plateFlash > 0;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rr(ctx, PLATE.x + 3, PLATE.y + 5, PLATE.w, PLATE.h, 14);
  ctx.fill();
  // Warm walnut tray the plated dishes sit on (ref: plates on a warm
  // wooden pass — never a flat black/purple void).
  const trayGrad = ctx.createLinearGradient(0, PLATE.y, 0, PLATE.y + PLATE.h);
  trayGrad.addColorStop(0, '#7a5230');
  trayGrad.addColorStop(1, '#54371e');
  ctx.fillStyle = trayGrad;
  rr(ctx, PLATE.x, PLATE.y, PLATE.w, PLATE.h, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(230,209,163,0.4)';
  ctx.lineWidth = 2;
  rr(ctx, PLATE.x + 3, PLATE.y + 3, PLATE.w - 6, PLATE.h - 6, 12);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,235,200,0.15)';
  rr(ctx, PLATE.x + 6, PLATE.y + 44, PLATE.w - 12, 3, 2);
  ctx.fill();
  ctx.fillStyle = glow ? '#5da85f' : '#8d5a2b';
  rr(ctx, PLATE.x, PLATE.y, PLATE.w, 40, 14);
  ctx.fill();
  ctx.fillRect(PLATE.x, PLATE.y + 26, PLATE.w, 14);
  text(ctx, 'PLATE — build the dish here', PLATE.x + 16, PLATE.y + 21, 17, '#fff');
  // The plate itself.
  const cx = PLATE.x + PLATE.w / 2;
  const cy = PLATE.y + 118;
  ctx.fillStyle = '#e8e2d4';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8, 128, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 128, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e6d1a3';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 100, 24, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (Game.plate.length === 0) {
    text(ctx, 'empty plate — click ingredients,', cx, cy - 6, 15, '#b9a98e', 'center');
    text(ctx, 'then click the plate to stack', cx, cy + 16, 15, '#b9a98e', 'center');
  } else {
    drawPlateStack(ctx, Game.plate, cx, cy);
    drawPlateGarnish(ctx, cx, cy, Game.plate.some((p) => p.kind === 'bun'), Game.plate.some((p) => p.kind === 'pasta'));
  }
  if (match) {
    const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 150);
    ctx.strokeStyle = 'rgba(93,168,95,' + pulse + ')';
    ctx.lineWidth = 5;
    rr(ctx, PLATE.x - 3, PLATE.y - 3, PLATE.w + 6, PLATE.h + 6, 16);
    ctx.stroke();
    text(ctx, '✓ ' + recipeById(match.recipeId).name.toUpperCase() + ' — READY TO SERVE!', cx, PLATE.y + PLATE.h - 18, 16, '#7ddc8a', 'center');
  } else if (Game.plate.length > 0) {
    text(ctx, 'keep stacking — check the tickets', cx, PLATE.y + PLATE.h - 18, 14, '#c9bda6', 'center');
  }
  if (hover) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    rr(ctx, PLATE.x - 2, PLATE.y - 2, PLATE.w + 4, PLATE.h + 4, 16);
    ctx.stroke();
  }
}

// Every plated dish gets exactly 2 garnishes (ref: asparagus + lemon, or
// cherry tomatoes + sauce swoosh) — that is what makes a plate read as
// restaurant food instead of a bare stack.
function drawPlateGarnish(ctx, cx, cy, hasBun, hasPasta) {
  // Asparagus spears, left of the stack.
  ctx.strokeStyle = '#5a7d3a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const gx = cx - 96 + i * 9;
    ctx.beginPath();
    ctx.moveTo(gx, cy + 12);
    ctx.lineTo(gx - 4, cy - 14 - i * 2);
    ctx.stroke();
    ctx.fillStyle = '#7ccb74';
    ctx.beginPath();
    ctx.ellipse(gx - 4, cy - 16 - i * 2, 3.5, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (hasPasta) {
    // Cherry tomatoes + dark sauce swoosh, right of the stack.
    for (let i = 0; i < 3; i++) {
      const tx = cx + 88 + (i - 1) * 16;
      const ty = cy - 4 + (i % 2) * 10;
      ctx.fillStyle = '#d94f3d';
      circle(ctx, tx, ty, 8);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      circle(ctx, tx - 2.5, ty - 2.5, 2.5);
      ctx.fill();
      ctx.fillStyle = '#3f6b2f';
      ctx.beginPath();
      ctx.ellipse(tx, ty - 8, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#5d3a22';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx + 62, cy + 16);
    ctx.quadraticCurveTo(cx + 92, cy + 24, cx + 116, cy + 12);
    ctx.stroke();
  } else {
    // Lemon wedge, right of the stack.
    ctx.save();
    ctx.translate(cx + 96, cy + 2);
    ctx.rotate(0.3);
    ctx.fillStyle = '#f2d06b';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 16, -Math.PI * 0.15, Math.PI * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fbe89a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 12, -Math.PI * 0.1, Math.PI * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e8b32a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 8);
    ctx.moveTo(0, 0);
    ctx.lineTo(2, 11);
    ctx.stroke();
    ctx.restore();
  }
}

// ---------- plate stack: food drawn as real layers ----------
// Each ingredient is a wide, shaded layer (bun dome on top, patty with
// grill marks, wavy lettuce, tomato slice, cheese drip, sauce drizzle,
// pasta mound) so the plate reads as a dish, not stacked rectangles.
function drawPlateLayer(ctx, kind, state, cx, y, w, h) {
  const x = cx - w / 2;
  ctx.save();
  if (kind === 'bunBottom') {
    ctx.fillStyle = linearGrad(ctx, x, y, x, y + h, '#e8b25e', '#c98d2e');
    rr(ctx, x, y, w, h, 6);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    rr(ctx, x, y + h - 4, w, 4, 2);
    ctx.fill();
  } else if (kind === 'bunTop') {
    ctx.fillStyle = radialGrad(ctx, cx, y + h, w * 0.6, '#f6c468', '#cf8a26');
    ctx.beginPath();
    ctx.ellipse(cx, y + h, w / 2, h, 0, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,70,10,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff2cf';
    for (const [dx, dy] of [[-w * 0.28, -h * 0.55], [0, -h * 0.75], [w * 0.28, -h * 0.55]]) {
      ctx.beginPath();
      ctx.ellipse(cx + dx, y + h + dy, 4, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'patty') {
    ctx.fillStyle = state === 'burnt' ? '#26211d' : linearGrad(ctx, x, y, x, y + h, '#8a542e', '#5d3418');
    rr(ctx, x, y, w, h, 7);
    ctx.fill();
    if (state !== 'burnt') {
      drawCrosshatch(ctx, x + 3, y + 1, w - 6, h - 2, 'rgba(74,42,16,0.7)', 2);
      ctx.fillStyle = 'rgba(255,220,170,0.25)';
      rr(ctx, x + 3, y + 1, w - 6, 4, 2);
      ctx.fill();
    }
  } else if (kind === 'cheese') {
    ctx.fillStyle = linearGrad(ctx, x, y, x, y + h, '#ffd94d', '#e8b32a');
    ctx.beginPath();
    ctx.moveTo(x, y + 3);
    ctx.lineTo(x + w, y + 3);
    ctx.lineTo(x + w - 6, y + h - 2);
    ctx.quadraticCurveTo(x + w * 0.72, y + h + 6, x + w * 0.6, y + h - 2);
    ctx.lineTo(x, y + h - 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b8860b';
    circle(ctx, cx - w * 0.2, y + h * 0.45, 3);
    ctx.fill();
    circle(ctx, cx + w * 0.15, y + h * 0.5, 2.5);
    ctx.fill();
  } else if (kind === 'lettuce') {
    ctx.fillStyle = linearGrad(ctx, x, y, x, y + h, '#6fbf6a', '#4e9a4c');
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + h * 0.5);
    for (let i = 0; i < 6; i++) {
      const bx = x + (w / 6) * i;
      ctx.quadraticCurveTo(bx + w / 12, y - 3, bx + w / 6, y + h * 0.5);
    }
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8ed08a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.5);
    for (let i = 0; i < 6; i++) {
      const bx = x + (w / 6) * i;
      ctx.quadraticCurveTo(bx + w / 12, y - 3, bx + w / 6, y + h * 0.5);
    }
    ctx.stroke();
  } else if (kind === 'tomato') {
    ctx.fillStyle = linearGrad(ctx, x, y, x, y + h, '#ef6a5c', '#c93a2c');
    rr(ctx, x, y, w, h, 7);
    ctx.fill();
    ctx.fillStyle = '#f0837a';
    rr(ctx, x + 4, y + 3, w - 8, h * 0.4, 4);
    ctx.fill();
  } else if (kind === 'sauce') {
    ctx.strokeStyle = '#b03a2e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 4, y + h / 2);
    ctx.quadraticCurveTo(cx - w * 0.25, y - 2, cx, y + h / 2);
    ctx.quadraticCurveTo(cx + w * 0.25, y + h + 2, x + w - 4, y + h / 2);
    ctx.stroke();
  } else if (kind === 'pasta') {
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = i % 2 ? '#e8b95a' : '#f0d48a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx + (i - 1.5) * 22, y + h - 6, 16, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    }
    ctx.fillStyle = '#c94a3a';
    for (const [dx, dy] of [[-30, -8], [8, -14], [34, -6]]) {
      circle(ctx, cx + dx, y + h + dy, 4);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawPlateStack(ctx, plate, cx, cy) {
  const has = (k) => plate.some((p) => p.kind === k);
  const W = 132;
  const LAYER_H = 11;
  let y = cy + 8; // stack base sits on the plate surface; layers grow upward
  if (has('bun')) {
    y -= 9;
    drawPlateLayer(ctx, 'bunBottom', null, cx, y, W - 6, 9);
  }
  if (has('pasta')) {
    y -= 20;
    drawPlateLayer(ctx, 'pasta', 'boiled', cx, y, W, 20);
  }
  const patty = plate.find((p) => p.kind === 'patty');
  for (const kind of ['patty', 'cheese', 'lettuce', 'tomato', 'sauce']) {
    if (!has(kind)) continue;
    y -= LAYER_H;
    const state = kind === 'patty' ? patty.state : kind === 'sauce' ? 'sauce' : 'chopped';
    drawPlateLayer(ctx, kind, state, cx, y, W, LAYER_H);
  }
  if (has('bun')) {
    y -= 16;
    drawPlateLayer(ctx, 'bunTop', null, cx, y, W, 16);
  }
}

function drawServe(ctx, hover) {
  const match = matchingOrder();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rr(ctx, SERVE.x + 3, SERVE.y + 5, SERVE.w, SERVE.h, 14);
  ctx.fill();
  // Warm brown pass — lit, never black.
  const passGrad = ctx.createLinearGradient(0, SERVE.y, 0, SERVE.y + SERVE.h);
  passGrad.addColorStop(0, '#7a3226');
  passGrad.addColorStop(1, '#5a2115');
  ctx.fillStyle = passGrad;
  rr(ctx, SERVE.x, SERVE.y, SERVE.w, SERVE.h, 14);
  ctx.fill();
  // Awning stripes.
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#d94f3d' : '#fdf6e3';
    ctx.fillRect(SERVE.x + i * (SERVE.w / 8), SERVE.y, SERVE.w / 8, 34);
  }
  ctx.fillStyle = '#fdf6e3';
  text(ctx, 'SERVICE WINDOW', SERVE.x + SERVE.w / 2, SERVE.y + 62, 22, '#fdf6e3', 'center');
  text(ctx, 'click here to serve a finished plate', SERVE.x + SERVE.w / 2, SERVE.y + 88, 14, '#e8b48a', 'center');
  // Warm glow behind the pass so the window feels lit, not void.
  const serveGlow = ctx.createRadialGradient(SERVE.x + SERVE.w / 2, SERVE.y + 110, 10, SERVE.x + SERVE.w / 2, SERVE.y + 110, 190);
  serveGlow.addColorStop(0, 'rgba(255,190,90,0.30)');
  serveGlow.addColorStop(1, 'rgba(255,190,90,0)');
  ctx.fillStyle = serveGlow;
  ctx.fillRect(SERVE.x, SERVE.y + 34, SERVE.w, SERVE.h - 34);
  // Heat lamps hanging from the awning.
  for (const lx of [SERVE.x + 78, SERVE.x + SERVE.w - 78]) {
    ctx.strokeStyle = '#2a1a12';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lx, SERVE.y + 96);
    ctx.lineTo(lx, SERVE.y + 110);
    ctx.stroke();
    ctx.fillStyle = '#b03a2e';
    ctx.beginPath();
    ctx.arc(lx, SERVE.y + 114, 14, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(lx - 16, SERVE.y + 110, 32, 5);
    ctx.fillStyle = '#ffd94d';
    circle(ctx, lx, SERVE.y + 119, 5);
    ctx.fill();
    // Light cone down to the shelf.
    ctx.fillStyle = 'rgba(255,205,110,0.12)';
    ctx.beginPath();
    ctx.moveTo(lx - 7, SERVE.y + 121);
    ctx.lineTo(lx + 7, SERVE.y + 121);
    ctx.lineTo(lx + 22, SERVE.y + 140);
    ctx.lineTo(lx - 22, SERVE.y + 140);
    ctx.closePath();
    ctx.fill();
  }
  // Pass shelf (wood) with a stack of clean plates on the left.
  const shelfY = SERVE.y + SERVE.h - 58;
  ctx.fillStyle = '#a9703f';
  ctx.fillRect(SERVE.x + 14, shelfY, SERVE.w - 28, 12);
  ctx.fillStyle = '#c08a4e';
  ctx.fillRect(SERVE.x + 14, shelfY, SERVE.w - 28, 3);
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(SERVE.x + 14, shelfY + 10, SERVE.w - 28, 2);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i === 2 ? '#ffffff' : '#e8e2d4';
    ctx.beginPath();
    ctx.ellipse(SERVE.x + 62, shelfY - 2 - i * 5, 26, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Bell.
  const bx = SERVE.x + SERVE.w / 2;
  const by = SERVE.y + 118;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(bx, by + 16, 34, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = match ? '#ffd94d' : '#8a97a3';
  ctx.beginPath();
  ctx.arc(bx, by, 30, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(bx - 36, by - 4, 72, 9);
  ctx.fillStyle = '#6b7280';
  circle(ctx, bx + 41, by + 7, 4.5);
  ctx.fill();
  // Second stack of clean plates on the right (under the right heat lamp).
  // The photo behind the window already has the 3D drink dispensers, so
  // the vector ones are NOT drawn here — no doubling.
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i === 2 ? '#ffffff' : '#e8e2d4';
    ctx.beginPath();
    ctx.ellipse(SERVE.x + SERVE.w - 62, shelfY - 2 - i * 5, 26, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (match) {
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 140);
    ctx.strokeStyle = 'rgba(255,217,77,' + pulse + ')';
    ctx.lineWidth = 5;
    rr(ctx, SERVE.x - 3, SERVE.y - 3, SERVE.w + 6, SERVE.h + 6, 16);
    ctx.stroke();
    text(ctx, 'DING! ' + recipeById(match.recipeId).name.toUpperCase() + ' — SERVE NOW', bx, SERVE.y + SERVE.h - 22, 14, '#ffd94d', 'center');
  } else {
    text(ctx, 'no finished plate yet', bx, SERVE.y + SERVE.h - 22, 14, '#e8b48a', 'center');
  }
  if (hover) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    rr(ctx, SERVE.x - 2, SERVE.y - 2, SERVE.w + 4, SERVE.h + 4, 16);
    ctx.stroke();
  }
}

// Three red drink dispensers in a row, receding in perspective (ref) —
// large enough to read at 300px: ~68px wide, ~110px tall for the front one.
function drawDispensers(ctx, x, y) {
  const machines = [
    { dx: 0, s: 1.0 },
    { dx: 62, s: 0.88 },
    { dx: 116, s: 0.76 },
  ];
  for (const m of machines) {
    const mx = x + m.dx;
    const w = 68 * m.s;
    const h = 110 * m.s;
    ctx.save();
    ctx.translate(mx, y + (1 - m.s) * 30);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h + 4, w * 0.55, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Body: red, glossy.
    ctx.fillStyle = '#9c261d';
    rr(ctx, 0, 0, w, h, 8);
    ctx.fill();
    ctx.fillStyle = '#c0392b';
    rr(ctx, 3, 3, w - 6, h * 0.4, 6);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    rr(ctx, 5, 4, 6, h - 10, 3);
    ctx.fill();
    // Digital display (glowing green/blue screen).
    ctx.fillStyle = '#1c2a1e';
    rr(ctx, w * 0.2, 8 * m.s + 4, w * 0.6, 14, 3);
    ctx.fill();
    ctx.fillStyle = '#7ddc8a';
    rr(ctx, w * 0.26, 8 * m.s + 7, w * 0.48, 8, 2);
    ctx.fill();
    // Round buttons.
    ctx.fillStyle = '#e6d1a3';
    circle(ctx, w * 0.24, 32 * m.s + 4, 3.5);
    ctx.fill();
    ctx.fillStyle = '#f2c94c';
    circle(ctx, w * 0.42, 32 * m.s + 4, 3.5);
    ctx.fill();
    // Glass cup under the spout, red juice, gold saucer.
    ctx.fillStyle = '#e6d1a3';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 8, 13, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(180,220,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 9, h - 26);
    ctx.lineTo(w / 2 + 9, h - 26);
    ctx.lineTo(w / 2 + 7, h - 10);
    ctx.lineTo(w / 2 - 7, h - 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b03a2e';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 8, h - 22);
    ctx.lineTo(w / 2 + 8, h - 22);
    ctx.lineTo(w / 2 + 6.5, h - 11);
    ctx.lineTo(w / 2 - 6.5, h - 11);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#63231a';
    ctx.fillRect(w / 2 - 2, h - 34, 4, 8);
    ctx.restore();
  }
}

// ---------- order board: cream ticket cards with dish icons ----------
// Mini plated-dish icon for a recipe (white plate + hero item + garnish).
function drawMiniDish(ctx, recipe, cx, cy) {
  ctx.fillStyle = 'rgba(99,35,26,0.15)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 10, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 6, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e6d1a3';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  const needs = recipe.needs;
  const has = (k) => needs.some((n) => n.kind === k);
  if (has('bun')) {
    // Mini burger: bottom bun, patty, lettuce, domed top bun.
    ctx.fillStyle = '#c98d2e';
    rr(ctx, cx - 13, cy + 2, 26, 4, 2);
    ctx.fill();
    ctx.fillStyle = '#8a542e';
    rr(ctx, cx - 14, cy - 3, 28, 5, 2);
    ctx.fill();
    ctx.fillStyle = '#5da85f';
    rr(ctx, cx - 14, cy - 6, 28, 3, 1.5);
    ctx.fill();
    ctx.fillStyle = '#f6c468';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 6, 14, 7, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#fff2cf';
    circle(ctx, cx - 5, cy - 10, 1.2);
    ctx.fill();
    circle(ctx, cx + 4, cy - 11, 1.2);
    ctx.fill();
  } else if (has('pasta')) {
    ctx.strokeStyle = '#e8b95a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx + (i - 1) * 9, cy + 4, 6, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }
    ctx.fillStyle = '#c94a3a';
    circle(ctx, cx - 8, cy - 2, 2.5);
    ctx.fill();
    circle(ctx, cx + 7, cy + 1, 2.5);
    ctx.fill();
  } else {
    // Salad: lettuce ribbons + tomato halves.
    ctx.strokeStyle = '#5da85f';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy + 2);
    ctx.quadraticCurveTo(cx, cy - 4, cx + 12, cy + 2);
    ctx.stroke();
    ctx.fillStyle = '#d94f3d';
    circle(ctx, cx - 7, cy - 1, 4);
    ctx.fill();
    circle(ctx, cx + 8, cy, 4);
    ctx.fill();
  }
  // Garnish: asparagus spear + lemon wedge on the plate.
  ctx.strokeStyle = '#5a7d3a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy + 8);
  ctx.lineTo(cx - 23, cy - 2);
  ctx.stroke();
  ctx.fillStyle = '#f2d06b';
  ctx.beginPath();
  ctx.moveTo(cx + 20, cy + 6);
  ctx.arc(cx + 20, cy + 6, 5, -Math.PI * 0.2, Math.PI * 0.7);
  ctx.closePath();
  ctx.fill();
}

function drawOrders(ctx) {
  ctx.fillStyle = '#3a2a1a';
  text(ctx, 'ORDER BOARD', ORDER_BOARD.x + 4, ORDER_BOARD.y + 8, 20, '#3a2a1a');
  text(ctx, Game.orders.length + '/' + MAX_ORDERS + ' tickets', ORDER_BOARD.x + ORDER_BOARD.w - 4, ORDER_BOARD.y + 10, 13, '#8a7a62', 'right');
  Game.orders.forEach((order, i) => {
    const recipe = recipeById(order.recipeId);
    const y = TICKET_TOP + i * (TICKET_H + TICKET_GAP);
    const x = ORDER_BOARD.x;
    const frac = Math.max(0, order.patienceLeft / order.patience);
    const urgent = order.patienceLeft < 12;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    rr(ctx, x + 3, y + 4, TICKET_W, TICKET_H, 12);
    ctx.fill();
    ctx.fillStyle = '#eae0d9';
    rr(ctx, x, y, TICKET_W, TICKET_H, 12);
    ctx.fill();
    ctx.strokeStyle = '#ab8e6c';
    ctx.lineWidth = 2;
    rr(ctx, x, y, TICKET_W, TICKET_H, 12);
    ctx.stroke();
    ctx.fillStyle = urgent ? '#d94f3d' : '#8d5a2b';
    rr(ctx, x, y, TICKET_W, 34, 12);
    ctx.fill();
    ctx.fillRect(x, y + 20, TICKET_W, 14);
    text(ctx, '#' + order.id + '  ' + recipe.name.toUpperCase(), x + 12, y + 18, 16, '#fff');
    text(ctx, '$' + recipe.price, x + TICKET_W - 34, y + 18, 16, '#ffd94d', 'right');
    // Mini plated-dish icon, left of the needs row.
    drawMiniDish(ctx, recipe, x + 32, y + 74);
    // Needed ingredients. 5-need recipes (Double Stack) use tighter spacing
    // so the last icon never touches the patience bar at the right edge.
    const needSpacing = recipe.needs.length > 4 ? 40 : 44;
    const needStartX = recipe.needs.length > 4 ? 72 : 76;
    recipe.needs.forEach((need, j) => {
      const ix = x + needStartX + j * needSpacing;
      const iy = y + 72;
      const got = Game.plate.some((p) => p.kind === need.kind && p.state === need.state);
      ctx.fillStyle = got ? 'rgba(93,168,95,0.25)' : 'rgba(0,0,0,0.06)';
      circle(ctx, ix, iy, 19);
      ctx.fill();
      drawIngredient(ctx, need.kind, need.state, ix, iy, 30);
      if (got) {
        ctx.strokeStyle = '#5da85f';
        ctx.lineWidth = 3;
        circle(ctx, ix, iy, 19);
        ctx.stroke();
      }
    });
    // Green vertical patience bar on the right edge.
    const barX = x + TICKET_W - 16;
    const barTop = y + 42;
    const barH = TICKET_H - 52;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    rr(ctx, barX, barTop, 10, barH, 5);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#5da85f' : frac > 0.25 ? '#f2a93b' : '#d94f3d';
    if (frac > 0) {
      const fh = barH * frac;
      rr(ctx, barX, barTop + barH - fh, 10, fh, 5);
      ctx.fill();
    }
    text(ctx, Math.ceil(order.patienceLeft) + 's left', x + 14, y + TICKET_H - 12, 12, urgent ? '#d94f3d' : '#8a7a62');
  });
  if (Game.orders.length === 0) {
    text(ctx, 'No orders — take a breath!', ORDER_BOARD.x + 8, TICKET_TOP + 30, 15, '#8a7a62');
  }
}

// ---------- ingredient bowls: full containers, contents mounded above the rim ----------
// Drawn inside a bin tile, centred at (cx, cy); the bowl body sits at
// cy+6..cy+48 and the food mounds above it to about cy-42.
function drawBowl(ctx, kind, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = 'rgba(99,35,26,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 48, 52, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  if (kind === 'bun') {
    // Wooden basket, 3 domed buns mounded above.
    for (const dx of [-26, 0, 26]) {
      ctx.fillStyle = radialGrad(ctx, dx, -30, 22, '#f6c468', '#cf8a26');
      ctx.beginPath();
      ctx.ellipse(dx, -26, 18, 13, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#fff2cf';
      circle(ctx, dx - 5, -34, 1.6);
      ctx.fill();
      circle(ctx, dx + 4, -36, 1.6);
      ctx.fill();
    }
    ctx.fillStyle = '#a9703f';
    ctx.beginPath();
    ctx.moveTo(-52, -8);
    ctx.lineTo(52, -8);
    ctx.lineTo(44, 44);
    ctx.lineTo(-44, 44);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(99,35,26,0.4)';
    ctx.lineWidth = 2;
    for (const wy of [6, 20, 34]) {
      ctx.beginPath();
      ctx.moveTo(-50 + (wy + 8) * 0.15, wy);
      ctx.lineTo(50 - (wy + 8) * 0.15, wy);
      ctx.stroke();
    }
    ctx.fillStyle = '#c08a4e';
    rr(ctx, -56, -12, 112, 8, 4);
    ctx.fill();
  } else if (kind === 'patty') {
    // Purple tray, raw pink meat + lettuce + onion rings.
    ctx.fillStyle = '#8a6fb0';
    rr(ctx, -54, 2, 108, 42, 8);
    ctx.fill();
    ctx.fillStyle = '#a58bc9';
    rr(ctx, -54, 2, 108, 10, 8);
    ctx.fill();
    ctx.fillStyle = '#5da85f';
    ctx.beginPath();
    ctx.ellipse(-20, -6, 26, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(22, -4, 24, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    for (const [dx, dy] of [[-22, -18], [16, -20]]) {
      ctx.fillStyle = radialGrad(ctx, dx, dy, 26, '#e89a90', '#bd655c');
      ctx.beginPath();
      ctx.ellipse(dx, dy, 24, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f2c9c2';
      ctx.beginPath();
      ctx.ellipse(dx - 6, dy - 2, 10, 3, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#c9a0dc';
    ctx.lineWidth = 2.5;
    for (const [dx, dy] of [[-2, -30], [34, -14]]) {
      circle(ctx, dx, dy, 7);
      ctx.stroke();
    }
  } else if (kind === 'lettuce') {
    // Green square bowl, mounded leaves + pea bumps.
    ctx.fillStyle = '#5a7d3a';
    rr(ctx, -50, -2, 100, 46, 10);
    ctx.fill();
    ctx.fillStyle = '#6f9a4a';
    rr(ctx, -50, -2, 100, 12, 10);
    ctx.fill();
    ctx.fillStyle = '#f7f2ea';
    rr(ctx, -44, 22, 88, 6, 3);
    ctx.fill();
    ctx.strokeStyle = '#4e9a4c';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    for (const [dx, dy, w] of [[-24, -14, 44], [4, -22, 48], [28, -10, 40]]) {
      ctx.beginPath();
      ctx.moveTo(dx - w / 2, dy);
      ctx.quadraticCurveTo(dx, dy - 7, dx + w / 2, dy + 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#7ccb74';
    for (const [dx, dy] of [[-30, -26], [-8, -32], [14, -28], [32, -22], [0, -18]]) {
      circle(ctx, dx, dy, 5);
      ctx.fill();
    }
  } else if (kind === 'tomato') {
    // Red bowl, mounded tomato slices + herb flecks.
    ctx.fillStyle = '#c93a2c';
    ctx.beginPath();
    ctx.ellipse(0, 6, 50, 38, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#e06048';
    ctx.beginPath();
    ctx.ellipse(0, 6, 50, 38, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#d94f3d';
    ctx.beginPath();
    ctx.ellipse(0, 2, 50, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const [dx, dy, r] of [[-22, -16, 13], [4, -24, 14], [26, -12, 12]]) {
      ctx.fillStyle = '#c93a2c';
      circle(ctx, dx, dy, r);
      ctx.fill();
      ctx.fillStyle = '#f0837a';
      circle(ctx, dx, dy, r * 0.7);
      ctx.fill();
      ctx.fillStyle = '#f7c9c4';
      ctx.beginPath();
      ctx.ellipse(dx, dy, r * 0.25, r * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#3f6b2f';
    for (const [dx, dy] of [[-10, -30], [16, -26], [30, -6]]) {
      ctx.beginPath();
      ctx.ellipse(dx, dy, 4, 2, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'cheese') {
    // Glass jug of yellow cheese sauce + spoon.
    ctx.fillStyle = 'rgba(140,170,200,0.45)';
    rr(ctx, -34, -30, 68, 74, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    rr(ctx, -34, -30, 68, 74, 10);
    ctx.stroke();
    ctx.fillStyle = '#f2c94c';
    ctx.beginPath();
    ctx.ellipse(0, -8, 30, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.ellipse(-6, -14, 18, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8b32a';
    for (const [dx, dy] of [[-14, -6], [10, -2], [0, -18]]) {
      circle(ctx, dx, dy, 3);
      ctx.fill();
    }
    ctx.strokeStyle = '#8a97a3';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(20, -34);
    ctx.lineTo(36, -52);
    ctx.stroke();
    ctx.fillStyle = '#aeb8c2';
    ctx.beginPath();
    ctx.ellipse(38, -54, 9, 6, 0.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'pasta') {
    // White bowl, mounded pasta strands + marinara dots.
    ctx.fillStyle = '#f7f2ea';
    ctx.beginPath();
    ctx.ellipse(0, 6, 52, 38, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(0, 2, 52, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d8d2c2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 2, 52, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#e8b95a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const dx = (i - 1.5) * 20;
      ctx.beginPath();
      ctx.arc(dx, -6, 14, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }
    ctx.strokeStyle = '#f0d48a';
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const dx = (i - 1) * 22;
      ctx.beginPath();
      ctx.arc(dx, -16, 12, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    }
    ctx.fillStyle = '#c94a3a';
    for (const [dx, dy] of [[-20, -22], [6, -28], [24, -16]]) {
      circle(ctx, dx, dy, 4);
      ctx.fill();
    }
  } else if (kind === 'sauce') {
    // White gravy boat, dark brown sauce + spoon.
    ctx.fillStyle = '#f7f2ea';
    ctx.beginPath();
    ctx.ellipse(0, 14, 50, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(44, 4);
    ctx.lineTo(58, -8);
    ctx.lineTo(52, 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d8d2c2';
    ctx.beginPath();
    ctx.ellipse(0, 14, 50, 30, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#5d3a22';
    ctx.beginPath();
    ctx.ellipse(0, 6, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7a4a2e';
    ctx.beginPath();
    ctx.ellipse(-8, 2, 24, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(-12, 0, 12, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8a97a3';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(24, -6);
    ctx.lineTo(40, -26);
    ctx.stroke();
    ctx.fillStyle = '#aeb8c2';
    ctx.beginPath();
    ctx.ellipse(42, -28, 8, 5, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ---------- bins ----------
function drawBins(ctx, hoverBin) {
  // Label sits fully below the counter band (ends y=576): baseline 584.
  // Paper pill behind the text — the 3D photo behind this strip is busy.
  const label = 'INGREDIENTS — click one, then click a station or the plate';
  ctx.font = 'bold 15px Arial, sans-serif';
  const labelW = ctx.measureText(label).width;
  ctx.fillStyle = '#fbf1d8';
  rr(ctx, BIN_ROW.x, BIN_ROW.y - 24, labelW + 20, 24, 12);
  ctx.fill();
  text(ctx, label, BIN_ROW.x + 10, BIN_ROW.y - 8, 15, '#3a2a1a');
  BIN_ORDER.forEach((kind, i) => {
    const r = binRect(i);
    const ing = INGREDIENTS[kind];
    const isHand = Game.hand && Game.hand.kind === kind;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    rr(ctx, r.x + 3, r.y + 4, r.w, r.h, 12);
    ctx.fill();
    ctx.fillStyle = isHand ? '#ffe9a8' : '#f7ead0';
    rr(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    rr(ctx, r.x + 4, r.y + 3, r.w - 8, 5, 2);
    ctx.fill();
    ctx.strokeStyle = hoverBin === i || isHand ? '#ffd94d' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = hoverBin === i || isHand ? 3 : 2;
    rr(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.stroke();
    // Bowls drawn larger (1.1x) so the food mounds fill the tile — the
    // container, not the tile, is what the eye reads.
    ctx.save();
    ctx.translate(r.x + r.w / 2, r.y + 66);
    ctx.scale(1.1, 1.1);
    ctx.translate(-(r.x + r.w / 2), -(r.y + 62));
    drawBowl(ctx, kind, r.x + r.w / 2, r.y + 62);
    ctx.restore();
    text(ctx, ing.name.toUpperCase(), r.x + r.w / 2, r.y + 122, 15, '#3a2a1a', 'center');
    text(ctx, ing.station ? ing.station.toUpperCase() + ' ' + ing.time + 's' : 'READY TO PLATE', r.x + r.w / 2, r.y + 144, 11, '#8a7a62', 'center');
    text(ctx, String(i + 1), r.x + 10, r.y + 16, 12, '#b9a98e');
  });
  // Trash.
  const r = binRect(7);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  rr(ctx, r.x + 3, r.y + 4, r.w, r.h, 12);
  ctx.fill();
  ctx.fillStyle = '#e8e2d4';
  rr(ctx, r.x, r.y, r.w, r.h, 12);
  ctx.fill();
  ctx.strokeStyle = hoverBin === 7 ? '#d94f3d' : 'rgba(0,0,0,0.12)';
  ctx.lineWidth = hoverBin === 7 ? 3 : 2;
  rr(ctx, r.x, r.y, r.w, r.h, 12);
  ctx.stroke();
  ctx.fillStyle = '#8a97a3';
  rr(ctx, r.x + r.w / 2 - 26, r.y + 48, 52, 62, 6);
  ctx.fill();
  ctx.fillStyle = '#6b7280';
  rr(ctx, r.x + r.w / 2 - 30, r.y + 40, 60, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#5d6b7a';
  for (let i = -1; i <= 1; i++) ctx.fillRect(r.x + r.w / 2 + i * 14 - 2, r.y + 62, 4, 34);
  text(ctx, 'TRASH', r.x + r.w / 2, r.y + 132, 15, '#6b7280', 'center');
  text(ctx, 'dump hand / plate', r.x + r.w / 2, r.y + 152, 11, '#8a7a62', 'center');
}

// ---------- top bar: warm orange strip, customer progress ----------
function drawTopbar(ctx) {
  const barGrad = ctx.createLinearGradient(0, 0, 0, TOPBAR.h);
  barGrad.addColorStop(0, '#d8645d');
  barGrad.addColorStop(1, '#c65a3c');
  ctx.fillStyle = barGrad;
  ctx.fillRect(TOPBAR.x, TOPBAR.y, TOPBAR.w, TOPBAR.h);
  ctx.fillStyle = '#e6d1a3';
  ctx.fillRect(TOPBAR.x, TOPBAR.y + TOPBAR.h - 4, TOPBAR.w, 4);
  // Title.
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 38, 32, 15);
  ctx.fill();
  ctx.fillStyle = '#c65a3c';
  circle(ctx, 38, 30, 9);
  ctx.fill();
  text(ctx, 'SIZZLE & SERVE', 62, 33, 26, '#fdf6e3');
  // Coins.
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 300, 32, 13);
  ctx.fill();
  text(ctx, '$', 300, 33, 16, '#8a6d1f', 'center');
  text(ctx, '$' + Game.coins, 320, 33, 24, '#fff');
  // Combo.
  if (Game.combo >= 2) {
    ctx.fillStyle = '#ff8a5c';
    rr(ctx, 420, 14, 108, 36, 18);
    ctx.fill();
    text(ctx, 'COMBO x' + Game.combo, 474, 33, 17, '#fff', 'center');
  }
  // Goal.
  text(ctx, 'GOAL $' + STAR_GOALS[2] + '  ·  ★'.repeat(Game.stars) + '☆'.repeat(3 - Game.stars), 560, 33, 16, '#ffe9c9');
  // Timer (center-right).
  const t = Math.max(0, Math.ceil(Game.timeLeft));
  const mm = Math.floor(t / 60);
  const ss = String(t % 60).padStart(2, '0');
  const frac = Game.timeLeft / SHIFT_LEN;
  ctx.strokeStyle = Game.timeLeft <= 30 ? '#ffd94d' : '#fdf6e3';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(880, 32, 24, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
  ctx.stroke();
  text(ctx, mm + ':' + ss, 880, 33, 22, '#fff', 'center');
  if (Game.rush) text(ctx, 'RUSH HOUR!', 982, 33, 14, '#ffd94d', 'center');
  // Customer count icon + green served progress bar.
  const px = 1040;
  ctx.fillStyle = '#fdf6e3';
  circle(ctx, px + 6, 22, 6);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 6, 48, 11, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = 'rgba(253,246,227,0.85)';
  circle(ctx, px + 20, 24, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 20, 48, 9, Math.PI, 0);
  ctx.fill();
  const target = 20;
  const sfrac = Math.min(1, Game.served / target);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  rr(ctx, px + 34, 22, 96, 14, 7);
  ctx.fill();
  ctx.fillStyle = '#5da85f';
  if (sfrac > 0) {
    rr(ctx, px + 34, 22, 96 * sfrac, 14, 7);
    ctx.fill();
  }
  text(ctx, Game.served + '/' + target + ' served', px + 34, 46, 12, '#ffe9c9');
  text(ctx, Game.lost + ' lost', 1225, 33, 14, '#ffe9c9', 'center');
}

// ---------- particles, floaters, hand ----------
function drawParticles(ctx) {
  for (const p of Game.particles) {
    const a = Math.max(0, p.life / p.max);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    circle(ctx, p.x, p.y, p.size * a + 1);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFloaters(ctx) {
  for (const f of Game.floaters) {
    const a = Math.max(0, f.life / f.max);
    ctx.globalAlpha = a;
    shadowText(ctx, f.text, f.x, f.y, 26, f.color, 'center');
  }
  ctx.globalAlpha = 1;
}

function drawHand(ctx, mouse) {
  if (!Game.hand || !mouse) return;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.translate(mouse.x, mouse.y - 26);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  circle(ctx, 2, 26, 24);
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  circle(ctx, 0, 22, 26);
  ctx.fill();
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = 3;
  circle(ctx, 0, 22, 26);
  ctx.stroke();
  drawIngredient(ctx, Game.hand.kind, Game.hand.state, 0, 22, 40);
  ctx.restore();
}

// ---------- overlays ----------
function drawTitle(ctx) {
  ctx.fillStyle = 'rgba(47,42,38,0.72)';
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = '#fdf6e3';
  rr(ctx, 290, 150, 700, 470, 20);
  ctx.fill();
  ctx.fillStyle = '#d94f3d';
  rr(ctx, 290, 150, 700, 84, 20);
  ctx.fill();
  ctx.fillRect(290, 210, 700, 24);
  shadowText(ctx, 'SIZZLE & SERVE', 640, 193, 44, '#fff', 'center');
  text(ctx, 'A fast-paced dinner-shift cooking game', 640, 262, 20, '#3a2a1a', 'center');
  const steps = [
    ['1', 'CLICK an ingredient, then a station'],
    ['2', 'GRILL · CHOP · BOIL, then stack the plate'],
    ['3', 'SERVE matching tickets before patience runs out'],
  ];
  steps.forEach(([n, s], i) => {
    const y = 310 + i * 44;
    ctx.fillStyle = '#d94f3d';
    circle(ctx, 340, y, 16);
    ctx.fill();
    text(ctx, n, 340, y + 1, 16, '#fff', 'center');
    text(ctx, s, 368, y + 1, 18, '#3a2a1a');
  });
  text(ctx, '3 minutes · 6 recipes · combos pay more · burnt patties go in the trash', 640, 462, 15, '#8a7a62', 'center');
  const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 240);
  ctx.fillStyle = 'rgba(217,79,61,' + pulse + ')';
  rr(ctx, 480, 500, 320, 64, 32);
  ctx.fill();
  text(ctx, '▶  CLICK TO START', 640, 533, 22, '#fff', 'center');
  text(ctx, 'mouse to play · keys 1-7 ingredients · T trash · S serve', 640, 592, 13, '#c9bda6', 'center');
}

function drawGameOver(ctx) {
  ctx.fillStyle = 'rgba(47,42,38,0.78)';
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = '#fdf6e3';
  rr(ctx, 340, 140, 600, 500, 20);
  ctx.fill();
  text(ctx, 'SHIFT OVER!', 640, 190, 40, '#d94f3d', 'center');
  text(ctx, '★'.repeat(Game.stars) + '☆'.repeat(3 - Game.stars), 640, 246, 44, '#f2a93b', 'center');
  text(ctx, 'You earned $' + Game.coins + '  (goal $' + STAR_GOALS[2] + ')', 640, 306, 22, '#3a2a1a', 'center');
  text(ctx, 'served ' + Game.served + ' dishes · ' + Game.lost + ' walked out · best combo x' + Game.bestCombo, 640, 344, 17, '#8a7a62', 'center');
  const verdict = Game.stars === 3 ? 'Head chef material. The rush hour fears YOU.'
    : Game.stars === 2 ? 'Solid service! One more star is one good rush away.'
    : Game.stars === 1 ? 'The kitchen survived. Barely. Run it back!'
    : 'The tickets won this round. The grill is still warm — try again!';
  text(ctx, verdict, 640, 386, 16, '#3a2a1a', 'center');
  const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 240);
  ctx.fillStyle = 'rgba(93,168,95,' + pulse + ')';
  rr(ctx, 480, 440, 320, 64, 32);
  ctx.fill();
  text(ctx, '↻  PLAY AGAIN', 640, 473, 22, '#fff', 'center');
  text(ctx, 'click anywhere to restart', 640, 556, 14, '#8a7a62', 'center');
}

// ---------- frame ----------
function drawGame(ctx, mouse, hover) {
  ctx.save();
  if (Game.shake > 0) {
    ctx.translate((Math.random() - 0.5) * Game.shake, (Math.random() - 0.5) * Game.shake);
  }
  // Background: vector restaurant as the underlay, then the 3D photo over
  // it. The photo's own staff stand behind the stations, so the vector
  // staff are only drawn when the photo has not loaded (fallback).
  // Counter bands go over the photo so the kitchen sits ON a counter.
  drawRestaurant(ctx);
  if (backdropReady) {
    ctx.drawImage(backdropImg, 0, 0, STAGE_W, STAGE_H);
  } else {
    drawWaiter(ctx);
    drawWaitress(ctx);
  }
  drawCounterBands(ctx);
  // Order board panel.
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  rr(ctx, 8, 68, 288, 500, 14);
  ctx.fill();
  ctx.fillStyle = '#fbf1d8';
  rr(ctx, 8, 68, 288, 500, 14);
  ctx.fill();

  drawOrders(ctx);
  drawGrill(ctx, hover === 'grill');
  drawChopper(ctx, hover === 'chopper');
  drawPot(ctx, hover === 'pot');
  drawPlate(ctx, hover === 'plate');
  drawServe(ctx, hover === 'serve');
  drawBins(ctx, hover && hover.bin !== undefined ? hover.bin : -1);
  drawTopbar(ctx);
  drawParticles(ctx);
  drawFloaters(ctx);

  if (Game.flash > 0) {
    ctx.fillStyle = 'rgba(255,217,77,' + Game.flash * 1.2 + ')';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  }
  drawHand(ctx, mouse);
  ctx.restore();

  if (Game.screen === 'title') drawTitle(ctx);
  if (Game.screen === 'over') drawGameOver(ctx);
}
