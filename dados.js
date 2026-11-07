function $(i) { return document.getElementById(i); }

var estado = "menu";
var dif = "normal";
var turno = "eu";
var rodada = 0;
var placar = { eu: [], cpu: [] };
var zonaSel = null;
var forca = 0;
var timerBarra = null;

var cv = $("cv");
var cx = cv.getContext("2d");
var W = 360;
var H = 420;
var G = { x: 55, y: 100, w: 250, h: 105 };
var cena = {
  bola: null, goleiro: null, rede: null, fx: null,
  chute: 0, festa: 0, shake: 0, trave: null
};

/* ---------- times ---------- */
var times = [
  { n: "Flamengo", a: "#d32f2f", b: "#111111", e: "listras", s: "#ffffff" },
  { n: "Corinthians", a: "#ffffff", b: "#111111", e: "liso", s: "#111111" },
  { n: "Palmeiras", a: "#2e7d32", b: "#ffffff", e: "liso", s: "#ffffff" },
  { n: "Santos", a: "#ffffff", b: "#111111", e: "liso", s: "#ffffff" },
  { n: "Vasco", a: "#111111", b: "#ffffff", e: "metade", s: "#111111" },
  { n: "Grêmio", a: "#29b6f6", b: "#111111", e: "listras", s: "#111111" },
  { n: "Botafogo", a: "#111111", b: "#ffffff", e: "listras", s: "#111111" },
  { n: "Cruzeiro", a: "#1565c0", b: "#ffffff", e: "liso", s: "#1565c0" },
  { n: "Brasil", a: "#fdd835", b: "#2e7d32", e: "liso", s: "#1565c0" },
  { n: "Argentina", a: "#81d4fa", b: "#ffffff", e: "listras", s: "#111111" }
];

var iTime = 0;
try {
  var sv = parseInt(localStorage.getItem("penaltisTime"), 10);
  if (sv >= 0 && sv < times.length) iTime = sv;
} catch (e) {}

var meu = times[iTime];
var adv = times[(iTime + 1) % times.length];

function fundoCamisa(t) {
  if (t.e === "listras") {
    return "repeating-linear-gradient(90deg," +
      t.a + " 0 12px," + t.b + " 12px 24px)";
  }
  if (t.e === "metade") {
    return "linear-gradient(90deg," + t.a + " 50%," + t.b + " 50%)";
  }
  return t.a;
}

function claro(h) {
  var r = parseInt(h.substr(1, 2), 16);
  var g = parseInt(h.substr(3, 2), 16);
  var b = parseInt(h.substr(5, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function mostraTime() {
  meu = times[iTime];
  $("camisa").style.background = fundoCamisa(meu);
  $("timeNome").textContent = meu.n;
  try { localStorage.setItem("penaltisTime", iTime); } catch (e) {}
}

function trocaTime(d) {
  iTime = (iTime + d + times.length) % times.length;
  mostraTime();
}
mostraTime();

/* ---------- recordes ---------- */
function lerRec() {
  try {
    return JSON.parse(localStorage.getItem("penaltisRec")) ||
      { v: 0, d: 0, seq: 0, melhor: 0 };
  } catch (e) {
    return { v: 0, d: 0, seq: 0, melhor: 0 };
  }
}

function salvaRec(r) {
  try { localStorage.setItem("penaltisRec", JSON.stringify(r)); } catch (e) {}
}

function mostraRec() {
  var r = lerRec();
  var t = "Vitórias: " + r.v + " | Derrotas: " + r.d +
    " | Maior sequência: " + r.melhor;
  $("rec").textContent = t;
  $("rec2").textContent = t;
}
mostraRec();
