let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playFrequency(frequency: number, duration: number = 0.4) {
  if (frequency <= 0 || frequency > 20000) return;
  try {
    const ctx = getAudioContext();
    const oscNode = ctx.createOscillator();
    const subOscNode = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscNode.connect(gainNode);
    subOscNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    // Outer space sound profile: primary sine wave + gentle tri sub-octave
    oscNode.type = 'sine';
    oscNode.frequency.setValueAtTime(frequency, now);

    // Sub-harmonic warm tone (one octave below if frequency is high enough, else just a sine blend)
    subOscNode.type = 'triangle';
    subOscNode.frequency.setValueAtTime(frequency / 2, now);

    // Mix weights: sine dominant, sub subtle
    gainNode.gain.setValueAtTime(0, now);
    // Smooth fade-in (Attack)
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.04);
    // Slight decay
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.15);
    // Sustain & fade-out (Release)
    gainNode.gain.setValueAtTime(0.08, now + duration - 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscNode.start(now);
    subOscNode.start(now);

    oscNode.stop(now + duration);
    subOscNode.stop(now + duration);
  } catch (error) {
    console.warn("Audio Context play blocked or failed:", error);
  }
}

export function playSequence(frequencies: number[], intervalMs: number = 400) {
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      playFrequency(freq, 0.35);
    }, index * intervalMs);
  });
}
