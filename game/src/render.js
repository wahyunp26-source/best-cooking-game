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
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.84, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.2, 6);
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
      ctx.fillStyle = linearGrad(ctx, 0, -s * 0.42, 0, s * 0.42, '#8a542e', '#5d3418');
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.84, 6);
      ctx.fill();
      ctx.strokeStyle = '#4a2a10';
      ctx.lineWidth = 3;
      for (const dx of [-s * 0.5, 0, s * 0.5]) {
        ctx.beginPath();
        ctx.moveTo(dx, -s * 0.42);
        ctx.lineTo(dx, s * 0.42);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,220,170,0.28)';
      rr(ctx, -s + 3, -s * 0.42, s * 2 - 6, s * 0.18, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      rr(ctx, -s, s * 0.26, s * 2, s * 0.16, 6);
      ctx.fill();
    } else {
      ctx.fillStyle = radialGrad(ctx, 0, 0, s, '#e89a90', '#bd655c');
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.84, 6);
      ctx.fill();
      ctx.fillStyle = '#a8544c';
      circle(ctx, -s * 0.4, 0, 3);
      ctx.fill();
      circle(ctx, s * 0.35, -2, 3);
      ctx.fill();
      circle(ctx, s * 0.1, s * 0.22, 2.5);
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
  ctx.fillStyle = '#3c3a38';
  rr(ctx, GRILL.x + 14, GRILL.y + 54, GRILL.w - 28, GRILL.h - 68, 10);
  ctx.fill();
  // Inner top shadow + horizontal grate for depth.
  ctx.save();
  rr(ctx, GRILL.x + 14, GRILL.y + 54, GRILL.w - 28, GRILL.h - 68, 10);
  ctx.clip();
  const bedGrad = ctx.createLinearGradient(0, GRILL.y + 54, 0, GRILL.y + 80);
  bedGrad.addColorStop(0, 'rgba(0,0,0,0.5)');
  bedGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bedGrad;
  ctx.fillRect(GRILL.x + 14, GRILL.y + 54, GRILL.w - 28, 26);
  ctx.strokeStyle = '#5a5652';
  ctx.lineWidth = 3;
  for (let i = 1; i < 6; i++) {
    const x = GRILL.x + 14 + ((GRILL.w - 28) / 6) * i;
    ctx.beginPath();
    ctx.moveTo(x, GRILL.y + 58);
    ctx.lineTo(x, GRILL.y + GRILL.h - 18);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(90,86,82,0.7)';
  ctx.lineWidth = 2;
  for (const gy of [GRILL.y + 100, GRILL.y + 138]) {
    ctx.beginPath();
    ctx.moveTo(GRILL.x + 16, gy);
    ctx.lineTo(GRILL.x + GRILL.w - 16, gy);
    ctx.stroke();
  }
  ctx.restore();
  // Ember glow at the bed's bottom edge.
  ctx.fillStyle = 'rgba(255,110,30,0.12)';
  rr(ctx, GRILL.x + 14, GRILL.y + GRILL.h - 30, GRILL.w - 28, 12, 6);
  ctx.fill();
  const cooking = Game.grill.slots.some((s) => s.item && !s.done);
  if (cooking) {
    ctx.fillStyle = 'rgba(255,120,40,' + (0.25 + 0.15 * Math.sin(performance.now() / 180)) + ')';
    rr(ctx, GRILL.x + 14, GRILL.y + 54, GRILL.w - 28, GRILL.h - 68, 10);
    ctx.fill();
  }
  Game.grill.slots.forEach((slot, i) => {
    const r = slotRect(GRILL, i);
    if (slot.item) {
      drawIngredient(ctx, slot.item.kind, slot.item.state, r.x + r.w / 2, r.y + r.h / 2 - 6, 62);
      drawProgressRing(ctx, r.x + r.w / 2, r.y + r.h - 14, 13, slot.progress, slot.done);
      if (slot.item.state === 'burnt') {
        text(ctx, 'BURNT!', r.x + r.w / 2, r.y + 16, 13, '#fff', 'center');
      } else if (slot.done) {
        text(ctx, 'READY', r.x + r.w / 2, r.y + 16, 12, '#7ddc8a', 'center');
      }
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      rr(ctx, r.x, r.y, r.w, r.h, 8);
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
  Game.chopper.slots.forEach((slot, i) => {
    const r = slotRect(CHOPPER, i);
    if (slot.item) {
      drawIngredient(ctx, slot.item.kind, slot.item.state, r.x + r.w / 2, r.y + r.h / 2 - 6, 62);
      drawProgressRing(ctx, r.x + r.w / 2, r.y + r.h - 14, 13, slot.progress, slot.done);
      if (slot.done) text(ctx, 'READY', r.x + r.w / 2, r.y + 16, 12, '#2f7a33', 'center');
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
  ctx.fillStyle = '#fdf6e3';
  rr(ctx, PLATE.x, PLATE.y, PLATE.w, PLATE.h, 14);
  ctx.fill();
  ctx.fillStyle = glow ? '#5da85f' : '#8d5a2b';
  rr(ctx, PLATE.x, PLATE.y, PLATE.w, 40, 14);
  ctx.fill();
  ctx.fillRect(PLATE.x, PLATE.y + 26, PLATE.w, 14);
  text(ctx, 'PLATE — build the dish here', PLATE.x + 16, PLATE.y + 21, 17, '#fff');
  // The plate itself.
  const cx = PLATE.x + PLATE.w / 2;
  const cy = PLATE.y + 158;
  ctx.fillStyle = '#e8e2d4';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 8, 128, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 128, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d8d2c2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 100, 24, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (Game.plate.length === 0) {
    text(ctx, 'empty plate — click ingredients,', cx, cy - 6, 15, '#b9a98e', 'center');
    text(ctx, 'then click the plate to stack', cx, cy + 16, 15, '#b9a98e', 'center');
  } else {
    drawPlateStack(ctx, Game.plate, cx, cy);
  }
  if (match) {
    const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 150);
    ctx.strokeStyle = 'rgba(93,168,95,' + pulse + ')';
    ctx.lineWidth = 5;
    rr(ctx, PLATE.x - 3, PLATE.y - 3, PLATE.w + 6, PLATE.h + 6, 16);
    ctx.stroke();
    text(ctx, '✓ ' + recipeById(match.recipeId).name.toUpperCase() + ' — READY TO SERVE!', cx, PLATE.y + PLATE.h - 18, 16, '#2f7a33', 'center');
  } else if (Game.plate.length > 0) {
    text(ctx, 'keep stacking — check the tickets', cx, PLATE.y + PLATE.h - 18, 14, '#8a7a62', 'center');
  }
  if (hover) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    rr(ctx, PLATE.x - 2, PLATE.y - 2, PLATE.w + 4, PLATE.h + 4, 16);
    ctx.stroke();
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
      ctx.strokeStyle = '#4a2a10';
      ctx.lineWidth = 2.5;
      for (const dx of [-w * 0.25, 0, w * 0.25]) {
        ctx.beginPath();
        ctx.moveTo(cx + dx, y + 2);
        ctx.lineTo(cx + dx, y + h - 2);
        ctx.stroke();
      }
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
  const LAYER_H = 15;
  let y = cy + 8; // stack base sits on the plate surface; layers grow upward
  if (has('bun')) {
    y -= 12;
    drawPlateLayer(ctx, 'bunBottom', null, cx, y, W - 6, 12);
  }
  if (has('pasta')) {
    y -= 26;
    drawPlateLayer(ctx, 'pasta', 'boiled', cx, y, W, 26);
  }
  const patty = plate.find((p) => p.kind === 'patty');
  for (const kind of ['patty', 'cheese', 'lettuce', 'tomato', 'sauce']) {
    if (!has(kind)) continue;
    y -= LAYER_H;
    const state = kind === 'patty' ? patty.state : kind === 'sauce' ? 'sauce' : 'chopped';
    drawPlateLayer(ctx, kind, state, cx, y, W, LAYER_H);
  }
  if (has('bun')) {
    y -= 24;
    drawPlateLayer(ctx, 'bunTop', null, cx, y, W, 24);
  }
}

function drawServe(ctx, hover) {
  const match = matchingOrder();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  rr(ctx, SERVE.x + 3, SERVE.y + 5, SERVE.w, SERVE.h, 14);
  ctx.fill();
  ctx.fillStyle = '#2f2a26';
  rr(ctx, SERVE.x, SERVE.y, SERVE.w, SERVE.h, 14);
  ctx.fill();
  // Awning stripes.
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#d94f3d' : '#fdf6e3';
    ctx.fillRect(SERVE.x + i * (SERVE.w / 8), SERVE.y, SERVE.w / 8, 34);
  }
  ctx.fillStyle = '#fdf6e3';
  text(ctx, 'SERVICE WINDOW', SERVE.x + SERVE.w / 2, SERVE.y + 62, 22, '#fdf6e3', 'center');
  text(ctx, 'click here to serve a finished plate', SERVE.x + SERVE.w / 2, SERVE.y + 88, 14, '#c9bda6', 'center');
  // Warm glow behind the pass so the window feels lit, not void.
  const serveGlow = ctx.createRadialGradient(SERVE.x + SERVE.w / 2, SERVE.y + 150, 10, SERVE.x + SERVE.w / 2, SERVE.y + 150, 210);
  serveGlow.addColorStop(0, 'rgba(255,190,90,0.16)');
  serveGlow.addColorStop(1, 'rgba(255,190,90,0)');
  ctx.fillStyle = serveGlow;
  ctx.fillRect(SERVE.x, SERVE.y + 34, SERVE.w, SERVE.h - 34);
  // Heat lamps hanging from the awning.
  for (const lx of [SERVE.x + 78, SERVE.x + SERVE.w - 78]) {
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lx, SERVE.y + 96);
    ctx.lineTo(lx, SERVE.y + 112);
    ctx.stroke();
    ctx.fillStyle = '#b03a2e';
    ctx.beginPath();
    ctx.arc(lx, SERVE.y + 116, 16, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(lx - 18, SERVE.y + 112, 36, 6);
    ctx.fillStyle = '#ffd94d';
    circle(ctx, lx, SERVE.y + 122, 6);
    ctx.fill();
    // Light cone down to the shelf.
    ctx.fillStyle = 'rgba(255,205,110,0.10)';
    ctx.beginPath();
    ctx.moveTo(lx - 8, SERVE.y + 124);
    ctx.lineTo(lx + 8, SERVE.y + 124);
    ctx.lineTo(lx + 26, SERVE.y + 196);
    ctx.lineTo(lx - 26, SERVE.y + 196);
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
  const by = SERVE.y + 150;
  ctx.fillStyle = match ? '#ffd94d' : '#8a97a3';
  ctx.beginPath();
  ctx.arc(bx, by, 34, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(bx - 40, by - 4, 80, 10);
  ctx.fillStyle = '#6b7280';
  circle(ctx, bx + 46, by + 8, 5);
  ctx.fill();
  if (match) {
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 140);
    ctx.strokeStyle = 'rgba(255,217,77,' + pulse + ')';
    ctx.lineWidth = 5;
    rr(ctx, SERVE.x - 3, SERVE.y - 3, SERVE.w + 6, SERVE.h + 6, 16);
    ctx.stroke();
    text(ctx, 'DING! ' + recipeById(match.recipeId).name.toUpperCase() + ' — SERVE NOW', bx, SERVE.y + SERVE.h - 22, 17, '#ffd94d', 'center');
  } else {
    text(ctx, 'no finished plate yet', bx, SERVE.y + SERVE.h - 22, 14, '#8a8074', 'center');
  }
  if (hover) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 3;
    rr(ctx, SERVE.x - 2, SERVE.y - 2, SERVE.w + 4, SERVE.h + 4, 16);
    ctx.stroke();
  }
}

// ---------- order board ----------
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
    ctx.fillStyle = '#fff8e7';
    rr(ctx, x, y, TICKET_W, TICKET_H, 12);
    ctx.fill();
    ctx.fillStyle = urgent ? '#d94f3d' : '#8d5a2b';
    rr(ctx, x, y, TICKET_W, 34, 12);
    ctx.fill();
    ctx.fillRect(x, y + 20, TICKET_W, 14);
    text(ctx, '#' + order.id + '  ' + recipe.name.toUpperCase(), x + 12, y + 18, 16, '#fff');
    text(ctx, '$' + recipe.price, x + TICKET_W - 12, y + 18, 16, '#ffd94d', 'right');
    // Needed ingredients.
    recipe.needs.forEach((need, j) => {
      const ix = x + 30 + j * 52;
      const iy = y + 68;
      const got = Game.plate.some((p) => p.kind === need.kind && p.state === need.state);
      ctx.fillStyle = got ? 'rgba(93,168,95,0.25)' : 'rgba(0,0,0,0.06)';
      circle(ctx, ix, iy, 22);
      ctx.fill();
      drawIngredient(ctx, need.kind, need.state, ix, iy, 34);
      if (got) {
        ctx.strokeStyle = '#5da85f';
        ctx.lineWidth = 3;
        circle(ctx, ix, iy, 22);
        ctx.stroke();
      }
    });
    // Patience bar.
    const bx = x + 14;
    const by = y + TICKET_H - 26;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    rr(ctx, bx, by, TICKET_W - 28, 12, 6);
    ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#5da85f' : frac > 0.25 ? '#f2a93b' : '#d94f3d';
    if (frac > 0) {
      rr(ctx, bx, by, (TICKET_W - 28) * frac, 12, 6);
      ctx.fill();
    }
    text(ctx, Math.ceil(order.patienceLeft) + 's left', x + TICKET_W - 14, by + 6, 12, urgent ? '#d94f3d' : '#8a7a62', 'right');
  });
  if (Game.orders.length === 0) {
    text(ctx, 'No orders — take a breath!', ORDER_BOARD.x + 8, TICKET_TOP + 30, 15, '#8a7a62');
  }
}

// ---------- bins ----------
function drawBins(ctx, hoverBin) {
  // Label sits fully below the counter band (ends y=576): baseline 584.
  text(ctx, 'INGREDIENTS — click one, then click a station or the plate', BIN_ROW.x + 4, BIN_ROW.y - 8, 15, '#3a2a1a');
  BIN_ORDER.forEach((kind, i) => {
    const r = binRect(i);
    const ing = INGREDIENTS[kind];
    const isHand = Game.hand && Game.hand.kind === kind;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    rr(ctx, r.x + 3, r.y + 4, r.w, r.h, 12);
    ctx.fill();
    ctx.fillStyle = isHand ? '#ffe9a8' : '#fdf6e3';
    rr(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    rr(ctx, r.x + 4, r.y + 3, r.w - 8, 5, 2);
    ctx.fill();
    ctx.strokeStyle = hoverBin === i || isHand ? '#ffd94d' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = hoverBin === i || isHand ? 3 : 2;
    rr(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.stroke();
    drawIngredient(ctx, kind, ing.ready, r.x + r.w / 2, r.y + 62, 64);
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

// ---------- top bar ----------
function drawTopbar(ctx) {
  ctx.fillStyle = '#2f2a26';
  ctx.fillRect(TOPBAR.x, TOPBAR.y, TOPBAR.w, TOPBAR.h);
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(TOPBAR.x, TOPBAR.y + TOPBAR.h - 4, TOPBAR.w, 4);
  // Title.
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 38, 32, 15);
  ctx.fill();
  ctx.fillStyle = '#2f2a26';
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
  text(ctx, 'GOAL $' + STAR_GOALS[2] + '  ·  ★'.repeat(Game.stars) + '☆'.repeat(3 - Game.stars), 560, 33, 16, '#c9bda6');
  // Timer (center-right).
  const t = Math.max(0, Math.ceil(Game.timeLeft));
  const mm = Math.floor(t / 60);
  const ss = String(t % 60).padStart(2, '0');
  const frac = Game.timeLeft / SHIFT_LEN;
  ctx.strokeStyle = Game.timeLeft <= 30 ? '#d94f3d' : '#ffd94d';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(940, 32, 24, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
  ctx.stroke();
  text(ctx, mm + ':' + ss, 940, 33, 22, Game.timeLeft <= 30 ? '#ff8a7a' : '#fff', 'center');
  text(ctx, Game.rush ? 'RUSH HOUR!' : 'SHIFT', 1065, 33, 16, Game.rush ? '#ff8a7a' : '#c9bda6', 'center');
  // Served / lost.
  text(ctx, Game.served + ' served · ' + Game.lost + ' lost', 1264, 33, 14, '#c9bda6', 'right');
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
  // Wall: warm vertical gradient + tile grid, floor band at the bottom.
  const wallGrad = ctx.createLinearGradient(0, 0, 0, STAGE_H);
  wallGrad.addColorStop(0, '#f9ead0');
  wallGrad.addColorStop(0.7, '#f3dfb4');
  wallGrad.addColorStop(1, '#ecd3a0');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = '#efd9a7';
  for (let x = 0; x < STAGE_W; x += 64) ctx.fillRect(x, 64, 2, 496);
  for (let y = 64; y < 560; y += 64) ctx.fillRect(0, y, STAGE_W, 2);
  // Counter band behind stations.
  ctx.fillStyle = '#a9703f';
  ctx.fillRect(304, 560, 960, 16);
  ctx.fillStyle = '#c08a4e';
  ctx.fillRect(304, 560, 960, 3);
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(304, 572, 960, 4);
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
