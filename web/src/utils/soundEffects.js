// Web Audio API based sound synthesizer for crisp, instant, dependency-free kid sound effects

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    // Read sound setting from localStorage safely
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('toan4_sound_enabled');
        if (saved !== null) {
          this.enabled = JSON.parse(saved);
        }
      }
    } catch {
      this.enabled = true;
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('toan4_sound_enabled', JSON.stringify(this.enabled));
    } catch {
      // ignore
    }
    if (this.enabled) {
      this.playClick();
    }
    return this.enabled;
  }

  isSoundEnabled() {
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, startDelay = 0) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + startDelay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Click button sound (warm wooden pop)
  playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Option selected sound
  playSelect() {
    if (!this.enabled) return;
    this.playTone(523.25, 'sine', 0.1, 0.12); // C5
  }

  // Correct answer sound (Joyful sparkling bell)
  playCorrect() {
    if (!this.enabled) return;
    this.playTone(523.25, 'sine', 0.18, 0.15, 0);    // C5
    this.playTone(659.25, 'sine', 0.22, 0.15, 0.08); // E5
    this.playTone(783.99, 'triangle', 0.35, 0.18, 0.16); // G5
  }

  // Wrong answer sound (Gentle soft bonk)
  playWrong() {
    if (!this.enabled) return;
    this.playTone(280, 'sine', 0.15, 0.12, 0);
    this.playTone(220, 'triangle', 0.22, 0.12, 0.1);
  }

  // Complete exam / Victory fanfare
  playVictory() {
    if (!this.enabled) return;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },    // C5
      { f: 659.25, d: 0.12, t: 0.1 },  // E5
      { f: 783.99, d: 0.12, t: 0.2 },  // G5
      { f: 1046.5, d: 0.45, t: 0.3 },  // C6
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, 0.16, n.t);
    });
  }

  // Unlock next stage/week sound
  playUnlock() {
    if (!this.enabled) return;
    const notes = [
      { f: 440, t: 0 },
      { f: 554.37, t: 0.08 },
      { f: 659.25, t: 0.16 },
      { f: 880, t: 0.24 },
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'sine', 0.25, 0.12, n.t);
    });
  }
}

export const sounds = new SoundManager();
export default sounds;
