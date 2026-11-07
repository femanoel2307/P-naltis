/* ---------- goleiro ---------- */
function goleiroDesenha(t) {
  var g = cena.goleiro;
  var p = 0, dx = 0, dy = 0, rot = 0;
  var kc = (turno === "eu") ? "#ffc107" : "#43a047";

  if (g) {
    p = Math.min(1, (t - g.t0) / g.dur);
    var e = 1 - Math.pow(1 - p, 3);
    dx = g.dx * e;
    dy = g.dy * e;
    rot = g.rot * e;
  } else {
    dx = Math.sin(t / 400) * 6;
  }

  cx.save();
  cx.translate(180 + dx, G.y + G.h + dy);
  cx.translate(0, -30);
  cx.rotate(rot * Math.PI / 180);
  cx.translate(0, 30);

  cx.fillStyle = "#263238";
  cx.fillRect(-10, -24, 8, 24);
  cx.fillRect(2, -24, 8, 24);
  cx.fillStyle = "#111";
  cx.fillRect(-11, -4, 10, 4);
  cx.fillRect(1, -4, 10, 4);
  cx.fillStyle = "#37474f";
  cx.fillRect(-12, -32, 24, 10);
  cx.fillStyle = kc;
  rr(-14, -60, 28, 30, 6);

  var hy = -30 - p * 42;
  var hx = 22 + p * 8;
  cx.strokeStyle = kc;
  cx.lineWidth = 6;
  cx.lineCap = "round";
  cx.beginPath();
  cx.moveTo(-13, -54);
  cx.lineTo(-hx, hy);
  cx.moveTo(13, -54);
  cx.lineTo(hx, hy);
  cx.stroke();

  cx.fillStyle = "#ff6d00";
  circ(-hx, hy, 6);
  circ(hx, hy, 6);
  cx.fillStyle = "#f1c27d";
  circ(0, -68, 8);
  cx.fillStyle = "#3e2723";
  cx.beginPath();
  cx.arc(0, -70, 8, Math.PI, 0);
  cx.fill();
  cx.restore();
}

/* ---------- batedor ---------- */
function chutadorDesenha(t) {
  var T = (turno === "cpu") ? adv : meu;
  var k = cena.chute;
  var a = 0;
  if (k) {
    var p = Math.min(1, (t - k) / 300);
    a = Math.sin(p * Math.PI);
  }

  cx.save();
  cx.translate(240, 392);
  cx.scale(1.4, 1.4);

  cx.fillStyle = "rgba(0,0,0,.3)";
  cx.beginPath();
  cx.ellipse(0, 1, 20, 5, 0, 0, 6.2832);
  cx.fill();

  cx.fillStyle = "#f1c27d";
  cx.fillRect(-9, -24, 7, 22);
  cx.fillStyle = "#111";
  cx.fillRect(-10, -3, 9, 5);

  cx.save();
  cx.translate(5, -24);
  cx.rotate(-a);
  cx.fillStyle = "#f1c27d";
  cx.fillRect(-3, 0, 7, 22);
  cx.fillStyle = "#111";
  cx.fillRect(-4, 20, 9, 5);
  cx.restore();

  cx.fillStyle = T.s;
  cx.fillRect(-11, -34, 24, 13);
  cx.fillStyle = T.a;
  rr(-14, -62, 28, 30, 6);
  cx.fillStyle = T.b;
  if (T.e === "listras") {
    for (var sx = -14; sx < 14; sx += 10) cx.fillRect(sx, -62, 5, 30);
  } else if (T.e === "metade") {
    cx.fillRect(0, -62, 14, 30);
  }

  cx.fillStyle = claro(T.a) ? "#111" : "#fff";
  if (T.e === "metade") cx.fillStyle = "#d32f2f";
  cx.font = "bold 12px Arial";
  cx.textAlign = "center";
  cx.fillText("10", 0, -44);
  cx.fillStyle = "#3e2723";
  circ(0, -71, 8);
  cx.restore();
}

/* ---------- bola ---------- */
function bolaDesenha(t) {
  var b = cena.bola;
  var x = 180, y = 345, r = 14, rot = 0, gy = 0;
  cx.fillStyle = "rgba(0,0,0,.3)";

  if (b) {
    var p = Math.max(0, Math.min(1, (t - b.t0) / b.dur));
    var e = 1 - Math.pow(1 - p, 2);
    x = b.x0 + (b.x1 - b.x0) * e;
    y = b.y0 + (b.y1 - b.y0) * e - 26 * Math.sin(p * Math.PI);
    r = 14 - 7 * e;
    rot = p * 14;
    gy = b.y0 + (G.y + G.h - b.y0) * e;

    if (b.rx !== undefined && t >= b.t0 + b.dur) {
      var q = Math.min(1, (t - b.t0 - b.dur) / b.dur2);
      var e2 = 1 - Math.pow(1 - q, 2);
      x = b.x1 + (b.rx - b.x1) * e2;
      y = b.y1 + (b.ry - b.y1) * e2 - 16 * Math.sin(q * Math.PI);
      r = 7 + 5 * e2;
      rot = 14 + q * 10;
      gy = (G.y + G.h) + (b.ry + r - (G.y + G.h)) * e2;
    }
    cx.beginPath();
    cx.ellipse(x, gy + 2, r, r * .35, 0, 0, 6.2832);
    cx.fill();
  } else {
    cx.beginPath();
    cx.ellipse(x, y + r - 2, r, r * .35, 0, 0, 6.2832);
    cx.fill();
  }

  cx.save();
  cx.translate(x, y);
  cx.rotate(rot);
  cx.fillStyle = "#fff";
  circ(0, 0, r);
  cx.strokeStyle = "#222";
  cx.lineWidth = 1.2;
  cx.beginPath();
  cx.arc(0, 0, r, 0, 6.2832);
  cx.stroke();

  cx.fillStyle = "#222";
  cx.beginPath();
  for (var i = 0; i < 5; i++) {
    var an = i * 1.2566 - 1.5708;
    cx.lineTo(Math.cos(an) * r * .42, Math.sin(an) * r * .42);
  }
  cx.closePath();
  cx.fill();
  for (var j = 0; j < 5; j++) {
    var a2 = j * 1.2566 - 1.5708;
    circ(Math.cos(a2) * r * .8, Math.sin(a2) * r * .8, r * .2);
  }
  cx.restore();
}

/* ---------- texto na tela ---------- */
function fxDesenha(t) {
  var f = cena.fx;
  if (!f) return;
  var a = (t - f.t0) / 1300;
  if (a >= 1) return;

  cx.save();
  cx.globalAlpha = 1 - a * a;
  cx.textAlign = "center";
  cx.font = "bold " + (34 + (1 - a) * 18) + "px Arial";
  cx.lineWidth = 6;
  cx.strokeStyle = "#000";
  cx.strokeText(f.txt, W / 2, 255);
  cx.fillStyle = f.cor;
  cx.fillText(f.txt, W / 2, 255);
  cx.restore();
}

/* ---------- loop principal ---------- */
function loop() {
  var t = Date.now();
  cx.save();
  var sh = 0;
  if (t - cena.shake < 350) sh = (1 - (t - cena.shake) / 350) * 6;
  if (sh) cx.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);

  fundo(t);
  rede(t);
  goleiroDesenha(t);
  traves(t);
  mira(t);
  chutadorDesenha(t);
  bolaDesenha(t);
  fxDesenha(t);

  cx.restore();
  requestAnimationFrame(loop);
}

/* ---------- toque no gol ---------- */
cv.addEventListener("pointerdown", function (e) {
  var r = cv.getBoundingClientRect();
  var s = Math.min(r.width / W, r.height / H);
  var x = (e.clientX - r.left - (r.width - W * s) / 2) / s;
  var y = (e.clientY - r.top - (r.height - H * s) / 2) / s;
  if (x < G.x - 15 || x > G.x + G.w + 15) return;
  if (y < G.y - 15 || y > G.y + G.h + 15) return;
  var c = Math.max(0, Math.min(2, Math.floor((x - G.x) / (G.w / 3))));
  var l = Math.max(0, Math.min(1, Math.floor((y - G.y) / (G.h / 2))));
  clicaZona(c, l);
});
