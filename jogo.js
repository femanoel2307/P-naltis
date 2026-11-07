/* ---------- menu ---------- */
function setDif(d) {
  dif = d;
  ["facil", "normal", "dificil"].forEach(function (x) {
    $("d-" + x).className = "btn peq" + (x === d ? " on" : "");
  });
}

function voltaMenu() {
  $("fim").classList.add("oculta");
  $("menu").classList.remove("oculta");
  mostraRec();
}

function jogar() {
  $("menu").classList.add("oculta");
  $("fim").classList.add("oculta");
  meu = times[iTime];
  do {
    adv = times[Math.floor(Math.random() * times.length)];
  } while (adv === meu);
  geraTorcida();
  $("nEu").textContent = meu.n.toUpperCase();
  $("nCpu").textContent = adv.n.toUpperCase();
  tom(900, .5, "square", .1);
  placar = { eu: [], cpu: [] };
  rodada = 0;
  turno = "eu";
  desenhaPlacar();
  comecaVez();
}

/* ---------- placar ---------- */
function golsDe(q) {
  return placar[q].filter(function (x) { return x === "g"; }).length;
}

function desenhaPlacar() {
  ["eu", "cpu"].forEach(function (q) {
    var n = Math.max(5, placar[q].length);
    var h = "";
    for (var i = 0; i < n; i++) {
      var r = placar[q][i];
      h += (r === "g") ? "⚽" : (r === "x" ? "❌" : "⚪");
    }
    $(q === "eu" ? "bEu" : "bCpu").textContent = h;
    $(q === "eu" ? "golsEu" : "golsCpu").textContent = golsDe(q);
  });
}

function acabou() {
  var a = golsDe("eu");
  var b = golsDe("cpu");
  if (rodada >= 5) return a !== b;
  var resta = 5 - rodada;
  return a > b + resta || b > a + resta;
}

/* ---------- fluxo ---------- */
function msg(t) { $("msg").textContent = t; }

function painel_(v) {
  $("painel").style.display = v ? "block" : "none";
}

function resetaCena() {
  cena.bola = null;
  cena.goleiro = null;
  cena.rede = null;
  cena.chute = 0;
  cena.trave = null;
  zonaSel = null;
  painel_(false);
  clearInterval(timerBarra);
}

function comecaVez() {
  resetaCena();
  var extra = rodada >= 5 ? "MORTE SÚBITA! " : "";
  if (turno === "eu") {
    estado = "mirar";
    msg(extra + "Toque no gol para mirar 🎯");
  } else {
    estado = "defender";
    msg(extra + "Toque onde o goleiro vai pular 🧤");
  }
}

function clicaZona(c, l) {
  if (estado === "mirar" || estado === "forca") {
    zonaSel = { c: c, l: l };
    if (estado === "mirar") {
      estado = "forca";
      msg("Pare a barra no VERDE!");
      painel_(true);
      startBarra();
    }
  } else if (estado === "defender") {
    zonaSel = { c: c, l: l };
    estado = "chutando";
    cpuChuta();
  }
}

function startBarra() {
  var t0 = Date.now();
  var vel = (dif === "dificil") ? 260 : 380;
  clearInterval(timerBarra);
  timerBarra = setInterval(function () {
    var s = Math.sin((Date.now() - t0) / vel - Math.PI / 2);
    forca = (s + 1) / 2;
    $("marcador").style.left = (forca * 100) + "%";
  }, 16);
}

/* ---------- regras ---------- */
function resultado(c, l, gc, gl, f) {
  if (f > 0.93) return "fora";
  if (f > 0.8 && c !== 1 && l === 0 && Math.random() < 0.22) {
    return "trave";
  }
  var chance;
  if (gc !== c) {
    chance = (f < 0.25) ? 0.4 : 0;
  } else {
    chance = (gl === l) ? 0.9 : 0.4;
    if (f > 0.6) chance -= 0.25;
    if (f < 0.3) chance += 0.2;
  }
  return Math.random() < chance ? "defesa" : "gol";
}

function palpiteGoleiro(c, l) {
  var ch = { facil: 0, normal: 0.15, dificil: 0.35 }[dif];
  if (Math.random() < ch) return { c: c, l: l };
  return {
    c: Math.floor(Math.random() * 3),
    l: Math.floor(Math.random() * 2)
  };
        }
