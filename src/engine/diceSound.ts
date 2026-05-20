/**
 * Web Audio API synthesized sound effects engine for rolling dice.
 * Provides completely local, offline-compatible clattering and thud effects.
 */

export const playDiceRollSound = () => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // 1. Generate Tumbling Clatter Clicks
    const clicksCount = 5 + Math.floor(Math.random() * 3); // 5 to 7 clicks
    let time = now;

    for (let i = 0; i < clicksCount; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Pitch sweeps downwards to simulate tumbling thuds (frequency from ~150Hz to ~40Hz)
      const startFreq = 160 + Math.random() * 40 - i * 10;
      osc.frequency.setValueAtTime(startFreq, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.04);

      // Gain Envelope: rapid attack, short decay
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12 * (1 - i / clicksCount), time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

      osc.start(time);
      osc.stop(time + 0.04);

      // Space out tumble clicks with minor random spacing
      time += 0.07 + Math.random() * 0.05;
    }

    // 2. Dynamic Final Landing Impact
    const oscImpact = ctx.createOscillator();
    const gainImpact = ctx.createGain();
    
    // Use triangle wave for a softer, wooden/plastic thud character
    oscImpact.type = 'triangle';
    oscImpact.connect(gainImpact);
    gainImpact.connect(ctx.destination);

    // Deep low-frequency decay for landing
    oscImpact.frequency.setValueAtTime(80, time);
    oscImpact.frequency.exponentialRampToValueAtTime(15, time + 0.15);

    // Main landing thud envelope
    gainImpact.gain.setValueAtTime(0, time);
    gainImpact.gain.linearRampToValueAtTime(0.25, time + 0.005);
    gainImpact.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    oscImpact.start(time);
    oscImpact.stop(time + 0.18);
  } catch (e) {
    // Fail-safe silently if AudioContext is blocked by browser interaction permissions or headless tests
    console.warn('AudioContext failed to initialize:', e);
  }
};
