// Realistic Web Audio synthesizer for cloth bag rustling, wooden barrels, paper tokens, coins, and optional Russian voice announcer

class LottoSoundEngine {
  private ctx: AudioContext | null = null;
  public soundEnabled = true;
  public voiceEnabled = true;

  private getContext(): AudioContext | null {
    if (!this.soundEnabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Phase 1 & 2: Natural fabric rustling sound when hostess reaches into and searches the cloth bag
   */
  public playBagRustle() {
    const ctx = this.getContext();
    if (!ctx) return;

    const duration = 0.28;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.18;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  /**
   * Phase 4: Realistic wooden barrel impact on the wooden table + subtle settling knock
   */
  public playWoodBarrelPlace() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Primary wood knock
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(290, now);
    osc.frequency.exponentialRampToValueAtTime(115, now + 0.085);

    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.095);

    // Subtle secondary settling tap 65ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(340, now + 0.07);
    osc2.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain2.gain.setValueAtTime(0.16, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.005, now + 0.13);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.135);
  }

  /**
   * Subtle paper card / red wooden token placement sound when marking a number
   */
  public playChipMark() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.065);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.008, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  /**
   * Soft warning sound when a number is missed and receives a Red X
   */
  public playMissedCross() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.linearRampToValueAtTime(145, now + 0.18);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.008, now + 0.19);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Bright coin / correction chime when buying an item or removing a red X
   */
  public playCoinChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [880, 1174.66, 1567.98].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);
      gain.gain.setValueAtTime(0.2, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.055 + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.25);
    });
  }

  /**
   * UI wooden button click
   */
  public playButtonClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(410, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Celebratory Russian folk chord fanfare on Victory
   */
  public playVictoryFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.25, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.09 + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.6);
    });
  }

  /**
   * Optional voice announcement of drawn Russian Lotto barrel numbers
   */
  public announceBarrelNumber(num: number) {
    if (!this.voiceEnabled || !this.soundEnabled || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const folkNicknames: Record<number, string> = {
        1: 'Один, кол!',
        11: 'Одиннадцать, барабанные палочки!',
        12: 'Двенадцать, дюжина!',
        22: 'Двадцать два, гуси-лебеди!',
        44: 'Сорок четыре, стульчики!',
        55: 'Пятьдесят пять, перчатки!',
        66: 'Шестьдесят шесть, валенки!',
        69: 'Шестьдесят девять, туда-сюда!',
        77: 'Семьдесят семь, топорики!',
        88: 'Восемьдесят восемь, крендельки!',
        90: 'Девяносто, дедушка!',
      };
      const text = folkNicknames[num] || String(num);
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ru-RU';
      utter.rate = 1.05;
      utter.pitch = 1.15;
      utter.volume = 0.7;
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore speech synthesis errors in headless browsers
    }
  }
}

export const soundEngine = new LottoSoundEngine();

export const FOLK_BARREL_CALLOUTS: Record<number, string> = {
  1: 'Кол',
  7: 'Топор',
  11: 'Барабанные палочки',
  12: 'Дюжина',
  13: 'Чёртова дюжина',
  22: 'Гуси-лебеди',
  33: 'Кудри',
  44: 'Стульчики',
  50: 'Полста',
  55: 'Перчатки',
  66: 'Валенки',
  69: 'Туда-сюда',
  77: 'Топорики',
  88: 'Крендельки',
  89: 'Дедушкин сосед',
  90: 'Дедушка',
};
