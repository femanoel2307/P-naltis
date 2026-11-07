function rr(x, y, w, h, r) {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.arcTo(x + w, y, x + w, y + h, r);
  cx.arcTo(x + w, y + h, x, y + h, r);
  cx.arcTo(x, y + h, x, y, r);
  cx.arcTo(x, y, x + w, y, r);
  cx.closePath();
  cx.fill();
}

function circ(x, y, r) {
  cx.beginPath();
  cx.arc(x, y, r, 0, 6.2832);
  cx.fill();
}

/* ---------- torcida ---------- */
var cabecas = [];

function geraTorcida() {
  var pal = [meu.a, meu.b, adv.a, adv.b, "#ffd54f", "#ffffff"];
  cabecas = [];
  for (var rw = 0; rw < 5; rw++) {
    for (var x = 6 + (rw % 2) * 6; x < W; x += 12) {
      cabecas.push({
        x: x,
        y: 10 + rw * 12,
        c: pal[Math.floor(Math.random() * pal.length)],
        f: Math.random() * 6
      });
    }
  }
}
geraTorcida();

/* ---------- fundo ---------- */
function fundo(t) {
  cx.fillStyle = "#0a1f4d";
  cx.fillRect(0, 0, W, 72);

  var fe = (t - cena.festa < 1800) ? 1 : 0;
  for (var i = 0; i < cabecas.length; i++) {
    var h = cabecas[i];
    var b = Math.sin(t / 180 + h.f) * (1.5 + fe * 5);
    cx.fillStyle = h.c;
    circ(h.x, h.y + b, 4.5);
    cx.fillRect(h.x - 4, h.y + b + 4, 8, 6);
  }

  cx.fillStyle = "#c62828";
  cx.fillRect(0, 72, W, 16);
  cx.fillStyle = "#fff";
  cx.font = "bold 11px Arial";
  cx.textAlign = "left";
  for (var k = 0; k < 3; k++) {
    cx.fillText("PÊNALTIS PRO", 12 + k * 125, 84);
  }

  var y = 88, hh = 10, n = 0;
  while (y < H) {
    cx.fillStyle = (n % 2) ? "#2f9e4d" : "#288f43";
    cx.fillRect(0, y, W, hh + 1);
    y += hh;
    hh *= 1.2;
    n++;
  }

  cx.strokeStyle = "rgba(255,255,255,.9)";
  cx.lineWidth = 3;
  cx.beginPath();
  cx.moveTo(0, 205);
  cx.lineTo(W, 205);
  cx.moveTo(45, 205);
  cx.lineTo(-5, 360);
  cx.lineTo(365, 360);
  cx.lineTo(315, 205);
  cx.moveTo(105, 205);
  cx.lineTo(95, 245);
  cx.lineTo(265, 245);
  cx.lineTo(255, 205);
  cx.stroke();
  cx.fillStyle = "#fff";
  circ(180, 325, 3);
}

/* ---------- rede do gol ---------- */
function rede(t) {
  var rp = cena.rede;
  var amp = 0;
  if (rp) {
    var p = (t - rp.t0) / 900;
    amp = p < 1 ? rp.a * Math.exp(-3 * p) * Math.cos(p * 14) : 0;
  }

  cx.fillStyle = "rgba(0,0,0,.4)";
  cx.fillRect(G.x, G.y, G.w, G.h);
  cx.strokeStyle = "rgba(255,255,255,.4)";
  cx.lineWidth = 1;

  function d(x, y) {
    if (!amp) return 0;
    var dx = x - rp.x;
    var dy = y - rp.y;
    return amp * Math.exp(-(dx * dx + dy * dy) / 2500);
  }

  var x, y, yy;
  for (x = G.x; x <= G.x + G.w + 0.1; x += 12) {
    cx.beginPath();
    for (y = G.y; y <= G.y + G.h; y += 6) {
      yy = y + d(x, y);
      if (y === G.y) cx.moveTo(x, yy);
      else cx.lineTo(x, yy);
    }
    cx.stroke();
  }
  for (y = G.y; y <= G.y + G.h + 0.1; y += 12) {
    cx.beginPath();
    for (x = G.x; x <= G.x + G.w; x += 6) {
      yy = y + d(x, y);
      if (x === G.x) cx.moveTo(x, yy);
      else cx.lineTo(x, yy);
    }
    cx.stroke();
  }
}

/* ---------- traves ---------- */
function traves(t) {
  var tr = cena.trave;
  var off = 0;
  var cor = "#fff";
  if (tr && t >= tr.t0 && t - tr.t0 < 450) {
    var q = (t - tr.t0) / 450;
    off = Math.sin((t - tr.t0) / 22) * (1 - q) * 2.5;
    cor = "#ffeb3b";
  }
  cx.fillStyle = cor;
  cx.fillRect(G.x - 4 + off, G.y - 4, 6, G.h + 4);
  cx.fillRect(G.x + G.w - 2 + off, G.y - 4, 6, G.h + 4);
  cx.fillRect(G.x - 4, G.y - 4 + off, G.w + 8, 6);
}

/* ---------- mira ---------- */
function mira(t) {
  if (estado !== "mirar" && estado !== "forca" &&
      estado !== "defender") return;

  cx.save();
  cx.setLineDash([5, 5]);
  cx.strokeStyle = "rgba(255,255,255,.55)";
  cx.lineWidth = 1.5;
  cx.beginPath();
  cx.moveTo(G.x + G.w / 3, G.y);
  cx.lineTo(G.x + G.w / 3, G.y + G.h);
  cx.moveTo(G.x + 2 * G.w / 3, G.y);
  cx.lineTo(G.x + 2 * G.w / 3, G.y + G.h);
  cx.moveTo(G.x, G.y + G.h / 2);
  cx.lineTo(G.x + G.w, G.y + G.h / 2);
  cx.stroke();
  cx.setLineDash([]);

  if (zonaSel) {
    var zx = G.x + G.w * zonaSel.c / 3;
    var zy = G.y + G.h * zonaSel.l / 2;
    var mx = zx + G.w / 6;
    var my = zy + G.h / 4;
    cx.fillStyle = "rgba(255,235,59,.28)";
    cx.fillRect(zx, zy, G.w / 3, G.h / 2);
    var pr = 11 + Math.sin(t / 120) * 2;
    cx.strokeStyle = "#ff5252";
    cx.lineWidth = 2.5;
    cx.beginPath();
    cx.arc(mx, my, pr, 0, 6.2832);
    cx.moveTo(mx - pr - 6, my);
    cx.lineTo(mx + pr + 6, my);
    cx.moveTo(mx, my - pr - 6);
    cx.lineTo(mx, my + pr + 6);
    cx.stroke();
  }
  cx.restore();
      }
