/**
 * Web Audio API synthesized sound effects engine for rolling dice.
 * Provides completely local, offline-compatible clattering and thud effects.
 */

let sharedAudioCtx: AudioContext | null = null;

const getSharedAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (sharedAudioCtx) return sharedAudioCtx;

  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    sharedAudioCtx = new AudioContextClass();
  } catch (e) {
    console.warn('Failed to initialize AudioContext:', e);
    return null;
  }
  return sharedAudioCtx;
};

/**
 * Synthesizes realistic, dynamically scaled sound effects for dice impacts.
 * Uses high-pass filters for resin plastic clicks and band-pass resonant sweeps for wooden hollow body thuds.
 */
export const playCollisionSound = (type: 'bounce' | 'die_collision', velocity: number) => {
  if (typeof window === 'undefined') return;

  const ctx = getSharedAudioContext();
  if (!ctx) return;

  try {
    // Resume context if suspended by browser autoplay policy
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Scale volume linearly based on relative speed (max normalized speed of 15)
    const vol = Math.min(Math.max(velocity / 15, 0.01), 1.0);
    
    // Ignore extremely light grazing contacts to avoid audio clutter
    if (vol < 0.05) return;

    if (type === 'bounce') {
      // 1. Resin Clack Transient: high-pass filtered pitch sweep (decay 5-10ms)
      const oscClack = ctx.createOscillator();
      const gainClack = ctx.createGain();
      const filterClack = ctx.createBiquadFilter();

      oscClack.type = 'sine';
      oscClack.frequency.setValueAtTime(3800, now);
      oscClack.frequency.exponentialRampToValueAtTime(1200, now + 0.01);

      filterClack.type = 'highpass';
      filterClack.frequency.setValueAtTime(3500, now);

      gainClack.gain.setValueAtTime(0, now);
      gainClack.gain.linearRampToValueAtTime(vol * 0.28, now + 0.001);
      gainClack.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      oscClack.connect(filterClack);
      filterClack.connect(gainClack);
      gainClack.connect(ctx.destination);

      oscClack.start(now);
      oscClack.stop(now + 0.015);

      // 2. Resonant Wood Body Thud: decaying band-pass resonance at ~140Hz (decay 60ms)
      const oscThud = ctx.createOscillator();
      const gainThud = ctx.createGain();
      const filterThud = ctx.createBiquadFilter();

      // Triangle wave produces a hollow, woody acoustic character
      oscThud.type = 'triangle';
      
      // Introduce subtle random variation around 140Hz for a more realistic organic sound
      const resonantFreq = 135 + Math.random() * 10;
      oscThud.frequency.setValueAtTime(resonantFreq, now);
      oscThud.frequency.exponentialRampToValueAtTime(resonantFreq - 15, now + 0.06);

      filterThud.type = 'bandpass';
      filterThud.frequency.setValueAtTime(resonantFreq, now);
      filterThud.Q.setValueAtTime(2.0, now);

      gainThud.gain.setValueAtTime(0, now);
      gainThud.gain.linearRampToValueAtTime(vol * 0.45, now + 0.002);
      gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      oscThud.connect(filterThud);
      filterThud.connect(gainThud);
      gainThud.connect(ctx.destination);

      oscThud.start(now);
      oscThud.stop(now + 0.08);

    } else if (type === 'die_collision') {
      // Resin-on-Resin collision: louder clack, higher body frequency, no deep wood thud
      const oscClack = ctx.createOscillator();
      const gainClack = ctx.createGain();
      const filterClack = ctx.createBiquadFilter();

      oscClack.type = 'sine';
      oscClack.frequency.setValueAtTime(4200, now);
      oscClack.frequency.exponentialRampToValueAtTime(1500, now + 0.012);

      filterClack.type = 'highpass';
      filterClack.frequency.setValueAtTime(3200, now);

      gainClack.gain.setValueAtTime(0, now);
      gainClack.gain.linearRampToValueAtTime(vol * 0.35, now + 0.001);
      gainClack.gain.exponentialRampToValueAtTime(0.001, now + 0.01);

      oscClack.connect(filterClack);
      filterClack.connect(gainClack);
      gainClack.connect(ctx.destination);

      oscClack.start(now);
      oscClack.stop(now + 0.018);

      // Higher-frequency resin body resonance clatter (~450Hz decaying over 25ms)
      const oscBody = ctx.createOscillator();
      const gainBody = ctx.createGain();
      const filterBody = ctx.createBiquadFilter();

      oscBody.type = 'triangle';
      const bodyFreq = 420 + Math.random() * 60;
      oscBody.frequency.setValueAtTime(bodyFreq, now);
      oscBody.frequency.exponentialRampToValueAtTime(200, now + 0.025);

      filterBody.type = 'bandpass';
      filterBody.frequency.setValueAtTime(bodyFreq, now);
      filterBody.Q.setValueAtTime(1.5, now);

      gainBody.gain.setValueAtTime(0, now);
      gainBody.gain.linearRampToValueAtTime(vol * 0.22, now + 0.002);
      gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      oscBody.connect(filterBody);
      filterBody.connect(gainBody);
      gainBody.connect(ctx.destination);

      oscBody.start(now);
      oscBody.stop(now + 0.035);
    }
  } catch (e) {
    // Fail-safe silently if AudioContext is blocked or headless
    console.warn('AudioContext failed to play collision sound:', e);
  }
};

/**
 * Kept for backwards compatibility and initial shake clatter backup.
 */
export const playDiceRollSound = () => {
  // Directly simulate a nice woody initial rattle by calling playCollisionSound twice with slight delay
  playCollisionSound('bounce', 12);
  setTimeout(() => playCollisionSound('die_collision', 10), 60);
  setTimeout(() => playCollisionSound('bounce', 8), 130);
};

