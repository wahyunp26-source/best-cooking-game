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

// ---------- food icons (drawn at cx, cy, fitting inside `size`) ----------
function drawIngredient(ctx, kind, state, cx, cy, size) {
  const s = size / 2;
  ctx.save();
  ctx.translate(cx, cy);
  if (kind === 'bun') {
    ctx.fillStyle = '#e8a94e';
    ctx.beginPath();
    ctx.ellipse(0, 2, s, s * 0.62, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#d18f2e';
    rr(ctx, -s, 0, s * 2, s * 0.22, 3);
    ctx.fill();
    ctx.fillStyle = '#fff2cf';
    for (const [dx, dy] of [[-s * 0.45, -s * 0.4], [0, -s * 0.55], [s * 0.45, -s * 0.4]]) {
      circle(ctx, dx, dy, 2.5);
      ctx.fill();
    }
  } else if (kind === 'patty') {
    if (state === 'burnt') {
      ctx.fillStyle = '#26211d';
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.84, 6);
      ctx.fill();
      ctx.fillStyle = '#3a332c';
      rr(ctx, -s * 0.7, -s * 0.2, s * 1.4, s * 0.3, 4);
      ctx.fill();
    } else if (state === 'grilled') {
      ctx.fillStyle = '#7a4a26';
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.84, 6);
      ctx.fill();
      ctx.strokeStyle = '#5d3418';
      ctx.lineWidth = 3;
      for (const dx of [-s * 0.5, 0, s * 0.5]) {
        ctx.beginPath();
        ctx.moveTo(dx, -s * 0.42);
        ctx.lineTo(dx, s * 0.42);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.2, 6);
      ctx.fill();
    } else {
      ctx.fillStyle = '#d98880';
      rr(ctx, -s, -s * 0.42, s * 2, s * 0.84, 6);
      ctx.fill();
      ctx.fillStyle = '#c06a62';
      circle(ctx, -s * 0.4, 0, 3);
      ctx.fill();
      circle(ctx, s * 0.35, -2, 3);
      ctx.fill();
    }
  } else if (kind === 'lettuce') {
    if (state === 'chopped') {
      ctx.fillStyle = '#5da85f';
      for (const [dx, dy, w] of [[-s * 0.5, 0, s * 0.7], [0, -s * 0.15, s * 0.8], [s * 0.5, s * 0.1, s * 0.6]]) {
        rr(ctx, dx - w / 2, dy - 3, w, 8, 4);
        ctx.fill();
      }
      ctx.fillStyle = '#8ed08a';
      rr(ctx, -s * 0.3, -s * 0.3, s * 0.5, 6, 3);
      ctx.fill();
    } else {
      ctx.fillStyle = '#6fbf6a';
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4e9a4c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.quadraticCurveTo(s * 0.3, 0, 0, s * 0.6);
      ctx.stroke();
    }
  } else if (kind === 'tomato') {
    if (state === 'chopped') {
      // A tomato slice: red disc, paler flesh, seeds.
      ctx.fillStyle = '#e2574c';
      circle(ctx, 0, 0, s * 0.85);
      ctx.fill();
      ctx.fillStyle = '#f0837a';
      circle(ctx, 0, 0, s * 0.55);
      ctx.fill();
      ctx.fillStyle = '#f7c9c4';
      for (const [dx, dy] of [[-s * 0.25, 0], [s * 0.25, -s * 0.15], [0, s * 0.28]]) {
        circle(ctx, dx, dy, s * 0.1);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#e2574c';
      circle(ctx, 0, 0, s * 0.85);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      circle(ctx, -s * 0.3, -s * 0.3, s * 0.25);
      ctx.fill();
      ctx.fillStyle = '#4e9a4c';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(-s * 0.25, -s * 1.05);
      ctx.lineTo(s * 0.25, -s * 1.05);
      ctx.closePath();
      ctx.fill();
    }
  } else if (kind === 'cheese') {
    if (state === 'chopped') {
      ctx.fillStyle = '#f2c94c';
      for (const [dx, dy] of [[-s * 0.5, -s * 0.2], [0, s * 0.2], [s * 0.5, -s * 0.25]]) {
        rr(ctx, dx - 2, dy - s * 0.3, 5, s * 0.6, 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#f2c94c';
      ctx.beginPath();
      ctx.moveTo(-s, s * 0.6);
      ctx.lineTo(s, s * 0.6);
      ctx.lineTo(s, -s * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d9a91f';
      circle(ctx, -s * 0.3, s * 0.15, 3.5);
      ctx.fill();
      circle(ctx, s * 0.3, s * 0.3, 3);
      ctx.fill();
    }
  } else if (kind === 'pasta') {
    if (state === 'boiled') {
      ctx.strokeStyle = '#f0d48a';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, (i - 1) * s * 0.35, s * 0.55, 0.3, Math.PI * 1.7);
        ctx.stroke();
      }
      ctx.strokeStyle = '#e8b95a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.4, 1.2, Math.PI * 1.1);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#e8cf96';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-s + i * s * 0.5, -s * 0.5);
        ctx.quadraticCurveTo(-s + i * s * 0.5 + 6, 0, -s + i * s * 0.5, s * 0.5);
        ctx.stroke();
      }
    }
  } else if (kind === 'sauce') {
    ctx.fillStyle = '#b03a2e';
    circle(ctx, 0, s * 0.1, s * 0.7);
    ctx.fill();
    ctx.fillStyle = '#d95b4a';
    circle(ctx, -s * 0.2, -s * 0.1, s * 0.35);
    ctx.fill();
    ctx.fillStyle = '#7c281e';
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
  text(ctx, label, rect.x + 16, rect.y + 21, 19, '#fff');
  text(ctx, sub, rect.x + rect.w - 14, rect.y + 21, 13, 'rgba(255,255,255,0.85)', 'right');
}

function drawGrill(ctx, hover) {
  drawStationBase(ctx, GRILL, 'GRILL', 'patty · 4s', '#c65a3c');
  ctx.fillStyle = '#3c3a38';
  rr(ctx, GRILL.x + 14, GRILL.y + 54, GRILL.w - 28, GRILL.h - 68, 10);
  ctx.fill();
  ctx.strokeStyle = '#5a5652';
  ctx.lineWidth = 3;
  for (let i = 1; i < 6; i++) {
    const x = GRILL.x + 14 + ((GRILL.w - 28) / 6) * i;
    ctx.beginPath();
    ctx.moveTo(x, GRILL.y + 58);
    ctx.lineTo(x, GRILL.y + GRILL.h - 18);
    ctx.stroke();
  }
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
    ctx.fillStyle = '#8a97a3';
    rr(ctx, r.x + 6, r.y + 6, r.w - 12, r.h - 6, 12);
    ctx.fill();
    ctx.fillStyle = '#aeb8c2';
    rr(ctx, r.x + 6, r.y + 6, r.w - 12, 18, 8);
    ctx.fill();
    ctx.fillStyle = '#7fb3d9';
    rr(ctx, r.x + 12, r.y + 14, r.w - 24, r.h - 26, 8);
    ctx.fill();
    if (slot.item) {
      if (!slot.done) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        for (let b = 0; b < 3; b++) {
          const bx = r.x + r.w / 2 + (b - 1) * 18 + Math.sin(performance.now() / 300 + b) * 3;
          circle(ctx, bx, r.y + 30 + b * 6, 4);
          ctx.fill();
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
    const sorted = Game.plate.slice().sort((a, b) => PLATE_STACK.indexOf(a.kind) - PLATE_STACK.indexOf(b.kind));
    sorted.forEach((it, i) => {
      const y = cy - 6 - i * 13;
      drawIngredient(ctx, it.kind, it.state, cx, y, 74);
    });
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
  text(ctx, 'INGREDIENTS — click one, then click a station or the plate', BIN_ROW.x + 4, BIN_ROW.y - 10, 15, '#3a2a1a');
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
  // Wall + floor.
  ctx.fillStyle = '#f6e3bd';
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = '#efd9a7';
  for (let x = 0; x < STAGE_W; x += 64) ctx.fillRect(x, 64, 2, 496);
  for (let y = 64; y < 560; y += 64) ctx.fillRect(0, y, STAGE_W, 2);
  // Counter band behind stations.
  ctx.fillStyle = '#a9703f';
  ctx.fillRect(304, 560, 960, 16);
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
