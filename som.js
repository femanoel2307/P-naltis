var somLigado = true;
var audioCtx = null;

function tom(freq, dur, tipo, vol, atraso) {
  if (!somLigado) return;
  try {
    audioCtx = audioCtx ||
      new (window.AudioContext || window.webkitAudioContext)();
    var o = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    var t = audioCtx.currentTime + (atraso || 0);
    o.type = tipo || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch (e) {}
}

function somGol() {
  tom(523, .2, "triangle", .2, 0);
  tom(659, .2, "triangle", .2, .15);
  tom(784, .4, "triangle", .2, .3);
}

function somRuim() {
  tom(220, .3, "sawtooth", .15, 0);
  tom(150, .5, "sawtooth", .15, .25);
}

function somTrave() {
  tom(880, .25, "square", .2, 0);
  tom(440, .45, "triangle", .2, .04);
}

function toggleSom() {
  somLigado = !somLigado;
  $("somBtn").textContent =
    somLigado ? "🔊 Som: ligado" : "🔇 Som: desligado";
}
