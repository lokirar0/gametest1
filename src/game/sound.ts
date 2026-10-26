// Simple sound effects using Web Audio API
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio not available');
      this.enabled = false;
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'square', volume: number = 0.1) {
    if (!this.ctx || !this.enabled) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.1) {
    if (!this.ctx || !this.enabled) return;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    
    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    source.connect(gain);
    gain.connect(this.ctx.destination);
    
    source.start();
  }

  // Sound effects
  shoot() {
    this.playTone(200, 0.1, 'sawtooth', 0.15);
    this.playNoise(0.05, 0.1);
  }

  explosion() {
    this.playNoise(0.3, 0.2);
    this.playTone(80, 0.3, 'sawtooth', 0.15);
  }

  hit() {
    this.playTone(150, 0.05, 'square', 0.1);
  }

  coin() {
    this.playTone(800, 0.1, 'sine', 0.08);
    setTimeout(() => this.playTone(1200, 0.1, 'sine', 0.08), 50);
  }

  damage() {
    this.playTone(100, 0.15, 'sawtooth', 0.12);
  }

  whistle() {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 1);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 1);
  }

  casinoWin() {
    this.playTone(523, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.1), 200);
  }

  casinoLose() {
    this.playTone(200, 0.2, 'sawtooth', 0.08);
    setTimeout(() => this.playTone(150, 0.3, 'sawtooth', 0.08), 200);
  }

  slotSpin() {
    this.playTone(400 + Math.random() * 200, 0.05, 'square', 0.05);
  }

  click() {
    this.playTone(600, 0.03, 'square', 0.05);
  }

  derail() {
    this.playNoise(0.5, 0.25);
    this.playTone(60, 0.5, 'sawtooth', 0.2);
  }
}

export const soundManager = new SoundManager();
