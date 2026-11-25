// Sizzle & Serve — sound effects.
// Every sound is synthesized with WebAudio: no audio files, no network.
const Sfx = (function () {
  let ctx = null;
  let muted = false;
  let sizzleNodes = null;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when, slideTo) {
    const c = ac();
    if (!c || muted) return;
    const t = c.currentTime + (when || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol || 0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function noiseBurst(dur, vol, freq) {
    const c = ac();
    if (!c || muted) return;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = freq || 1200;
    const g = c.createGain();
    g.gain.value = vol || 0.2;
    src.connect(f).connect(g).connect(c.destination);
    src.start();
  }

  return {
    unlock() { ac(); },
    toggleMute() { muted = !muted; return muted; },
    isMuted() { return muted; },
    click() { tone(660, 0.06, 'square', 0.06); },
    pick() { tone(520, 0.07, 'triangle', 0.12, 0, 780); },
    place() { noiseBurst(0.08, 0.18, 900); tone(180, 0.08, 'sine', 0.12); },
    chop() { noiseBurst(0.09, 0.28, 2400); tone(140, 0.07, 'square', 0.08); },
    done() { tone(880, 0.1, 'sine', 0.14); tone(1320, 0.14, 'sine', 0.12, 0.09); },
    serve() {
      tone(523, 0.12, 'sine', 0.16);
      tone(659, 0.12, 'sine', 0.16, 0.1);
      tone(784, 0.2, 'sine', 0.18, 0.2);
      tone(1047, 0.28, 'sine', 0.14, 0.3);
    },
    coin() { tone(988, 0.08, 'square', 0.07); tone(1319, 0.16, 'square', 0.07, 0.07); },
    fail() { tone(220, 0.25, 'sawtooth', 0.1, 0, 110); },
    burn() { noiseBurst(0.3, 0.15, 500); tone(98, 0.3, 'sawtooth', 0.08); },
    bell() { tone(1175, 0.5, 'sine', 0.14); tone(1760, 0.4, 'sine', 0.07, 0.02); },
    tick() { tone(1200, 0.04, 'square', 0.05); },
    startSizzle() {
      const c = ac();
      if (!c || muted || sizzleNodes) return;
      const len = c.sampleRate;
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 4200;
      f.Q.value = 0.6;
      const g = c.createGain();
      g.gain.value = 0.035;
      src.connect(f).connect(g).connect(c.destination);
      src.start();
      sizzleNodes = { src, g };
    },
    stopSizzle() {
      if (!sizzleNodes) return;
      try { sizzleNodes.src.stop(); } catch (e) { /* already stopped */ }
      sizzleNodes = null;
    },
  };
})();
