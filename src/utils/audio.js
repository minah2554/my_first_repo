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
 * Plays a sophisticated, natural-sounding crystal chime glissando with a warm harmony pad.
 */
export function playWinFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. 따뜻한 공간감을 주는 저음/중음 하모니 패드 (Triangle 웨이브로 풍성하고 자연스러운 울림 구현)
    const padNotes = [130.81, 196.00, 261.63, 329.63]; // C3, G3, C4, E4 (C Major)
    padNotes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.15); // 부드럽게 소리가 커짐
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0); // 2초에 걸쳐 자연스럽게 잔향이 사라짐
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.0);
    });

    // 2. 반짝이는 크리스탈 종소리 및 하프 스윕 효과 (Sine 웨이브와 옥타브 배음 합성)
    const chimes = [
      523.25,  // C5
      587.33,  // D5
      659.25,  // E5
      783.99,  // G5
      880.00,  // A5
      1046.50, // C6
      1174.66, // D6
      1318.51, // E6
      1567.98, // G6
      1760.00, // A6
      2093.00, // C7
      2637.02  // E7
    ];

    chimes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteDelay = index * 0.035; // 35ms 간격으로 음이 차례대로 연주됨
      const startTime = now + noteDelay;
      
      osc.type = 'sine'; // 가장 순수하고 부드러운 차임 톤
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.01); // 부드러운 어택
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2); // 맑고 긴 잔향
      
      // 실제 금속 종소리처럼 청아함을 더해주는 2배수 옥타브 고음 배음 추가
      const ringOsc = ctx.createOscillator();
      const ringGain = ctx.createGain();
      ringOsc.type = 'sine';
      ringOsc.frequency.setValueAtTime(freq * 2.0, startTime);
      
      ringGain.gain.setValueAtTime(0, startTime);
      ringGain.gain.linearRampToValueAtTime(0.02, startTime + 0.01);
      ringGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5); // 고음 배음은 빠르게 소멸
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      ringOsc.connect(ringGain);
      ringGain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 1.2);
      
      ringOsc.start(startTime);
      ringOsc.stop(startTime + 0.5);
    });

  } catch (e) {
    console.warn('Audio playback not allowed or failed:', e);
  }
}
