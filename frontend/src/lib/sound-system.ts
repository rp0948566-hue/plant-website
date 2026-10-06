// ── Global High-Fidelity UI Sound System ─────────────────────────────────────
// Procedural Web Audio API synthesis: zero external downloads, zero latency, +65% boosted volume

class GlobalSoundSystem {
  // Classroom-demo safety: every UI sound stays off until this flag is flipped.
  // Call sites are untouched, so re-enabling is a one-line change.
  private readonly muted = true;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lastWheelTime: number = 0;
  private lastHoverTime: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.attachUnlockListeners();
    }
  }

  private attachUnlockListeners() {
    const unlock = () => {
      this.init();
      if (this.ctx && this.ctx.state === "running") {
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("touchstart", unlock);
        window.removeEventListener("wheel", unlock);
        window.removeEventListener("keydown", unlock);
      }
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("wheel", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
  }

  public init() {
    if (this.muted) return;
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const c = new AudioCtx();
          this.ctx = c;

          // Dynamics compressor to guarantee punchy output with ZERO clipping (+65% boost)
          const comp = c.createDynamicsCompressor();
          comp.threshold.setValueAtTime(-14, c.currentTime);
          comp.knee.setValueAtTime(10, c.currentTime);
          comp.ratio.setValueAtTime(6, c.currentTime);
          comp.attack.setValueAtTime(0.003, c.currentTime);
          comp.release.setValueAtTime(0.12, c.currentTime);
          comp.connect(c.destination);

          // Master Gain with +65% volume boost (1.155)
          const master = c.createGain();
          master.gain.setValueAtTime(1.15, c.currentTime);
          master.connect(comp);
          this.masterGain = master;
        }
      } catch {
        // AudioContext initialization pending user gesture
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // 1. Navigation Tab Click: Modern, warm, tactile pop
  public playNavClick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(620, t);
      osc1.frequency.exponentialRampToValueAtTime(320, t + 0.07);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1240, t);
      osc2.frequency.exponentialRampToValueAtTime(640, t + 0.05);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.38, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.085);
      osc2.stop(t + 0.085);
    } catch {}
  }

  // 2. Navigation Tab Hover: Micro-tick (throttled)
  public playNavHover() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = performance.now();
    if (now - this.lastHoverTime < 70) return;
    this.lastHoverTime = now;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.018);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.025);
    } catch {}
  }

  // 3. CTA Button Click: Rich tactile snap with resonant glass body
  public playButtonClick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      
      // Attack click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = "triangle";
      clickOsc.frequency.setValueAtTime(980, t);
      clickOsc.frequency.exponentialRampToValueAtTime(220, t + 0.04);
      clickGain.gain.setValueAtTime(0.001, t);
      clickGain.gain.linearRampToValueAtTime(0.46, t + 0.003);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      // Warm body resonance
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = "sine";
      bodyOsc.frequency.setValueAtTime(440, t);
      bodyOsc.frequency.exponentialRampToValueAtTime(180, t + 0.16);
      bodyGain.gain.setValueAtTime(0.001, t);
      bodyGain.gain.linearRampToValueAtTime(0.32, t + 0.01);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      clickOsc.connect(clickGain);
      clickGain.connect(this.masterGain);
      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.masterGain);

      clickOsc.start(t);
      clickOsc.stop(t + 0.07);
      bodyOsc.start(t);
      bodyOsc.stop(t + 0.19);
    } catch {}
  }

  // 4. Button Hover: Soft pearlescent shimmer
  public playButtonHover() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1180, t + 0.06);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch {}
  }

  // 5. Works Wheel Ratchet / Dial Tick: Precision mechanical rotary click
  public playWheelTick(speed: number = 1) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = performance.now();
    const interval = Math.max(30, 85 - Math.min(60, speed * 25));
    if (now - this.lastWheelTime < interval) return;
    this.lastWheelTime = now;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "square";
      osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.022);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2200, t);
      filter.Q.setValueAtTime(2.4, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.24, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.03);
    } catch {}
  }

  // 6. Orbiting Carousel Selection: Spatial harmonic chime
  public playOrbitSelect() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, t); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, t + 0.12); // E5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1046.5, t); // C6
      osc2.frequency.exponentialRampToValueAtTime(1318.5, t + 0.1); // E6

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.24);
      osc2.stop(t + 0.24);
    } catch {}
  }

  // 7. Kinetic Text Whoosh: Aerodynamic spatial sweep
  public playKineticWhoosh() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.18);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(1600, t + 0.15);
      filter.Q.setValueAtTime(2.2, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch {}
  }

  // 8. Link / Read more click: Crisp organic click
  public playLinkClick() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(740, t);
      osc.frequency.exponentialRampToValueAtTime(420, t + 0.05);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.36, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.07);
    } catch {}
  }

  // 9. Lightbox Modal Open: Rich acoustic harmonic chime swell
  public playModalOpen() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, t);
      osc1.frequency.exponentialRampToValueAtTime(880, t + 0.16);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, t);
      osc2.frequency.exponentialRampToValueAtTime(1320, t + 0.14);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.34, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.28);
      osc2.stop(t + 0.28);
    } catch {}
  }

  // 10. Lightbox Modal Close: Soft tactile descending release
  public playModalClose() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.18);
    } catch {}
  }
}

export const soundSystem = new GlobalSoundSystem();
export default soundSystem;
