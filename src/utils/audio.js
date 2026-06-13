let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a single retro 8-bit tick sound when the slot machine changes names.
 */
export function playSpinTick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // 8-bit retro sound characteristics
    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {
    console.warn('Audio playback not allowed or failed:', e);
  }
}

/**
 * Plays a retro arcade victory fanfare melody when winner is chosen.
 */
export function playWinFanfare() {
  try {
    const ctx = getAudioContext();
    const noteDuration = 0.10; // tempo control
    
    // Happy arpeggio: C5 -> E5 -> G5 -> C6 (high note with retro vibrato)
    const melody = [
      { note: 523.25, type: 'square', duration: 0.12, delay: 0 },       // C5
      { note: 659.25, type: 'square', duration: 0.12, delay: 0.10 },    // E5
      { note: 783.99, type: 'square', duration: 0.12, delay: 0.20 },    // G5
      { note: 1046.50, type: 'square', duration: 0.60, delay: 0.30 },   // C6 (held longer)
    ];

    melody.forEach((item) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + item.delay;
      const stopTime = startTime + item.duration;

      osc.type = item.type;
      osc.frequency.setValueAtTime(item.note, startTime);

      // Add cool 8-bit vibrato to the final high C6 note
      if (item.note === 1046.50) {
        const vibratoOsc = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        
        vibratoOsc.frequency.value = 18; // 18Hz speed
        vibratoGain.gain.value = 12;      // pitch depth
        
        vibratoOsc.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        
        vibratoOsc.start(startTime);
        vibratoOsc.stop(stopTime);
      }

      // volume envelope (attack -> decay)
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(stopTime);
    });
  } catch (e) {
    console.warn('Audio playback not allowed or failed:', e);
  }
}
