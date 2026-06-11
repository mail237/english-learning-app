const NOVELTY_VOICE_KEYWORDS = [
  'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos',
  'Deranged', 'Eddy', 'Flo', 'Fred', 'Good News', 'Grandma', 'Grandpa',
  'Jester', 'Junior', 'Kathy', 'Organ', 'Ralph', 'Superstar', 'Trinoids',
  'Whisper', 'Wobble', 'Zarvox',
];

const PREFERRED_VOICE_NAMES = [
  'Samantha',
  'Google US English',
  'Microsoft Aria',
  'Microsoft Jenny',
  'Microsoft Zira',
  'Alex',
  'Karen',
  'Daniel',
  'Moira',
  'Tessa',
  'Serena',
  'Martha',
];

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesReady = false;
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function isBadVoice(voice: SpeechSynthesisVoice): boolean {
  return NOVELTY_VOICE_KEYWORDS.some((name) => voice.name.includes(name));
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  if (isBadVoice(voice)) return -1000;

  let score = 0;

  if (voice.lang === 'en-US') score += 100;
  else if (voice.lang.startsWith('en-US')) score += 80;
  else if (voice.lang.startsWith('en-GB')) score += 60;
  else if (voice.lang.startsWith('en')) score += 40;

  if (voice.name.includes('Enhanced') || voice.name.includes('Premium')) score += 50;

  const preferredIndex = PREFERRED_VOICE_NAMES.findIndex((name) =>
    voice.name.includes(name),
  );
  if (preferredIndex !== -1) score += 200 - preferredIndex * 10;

  if (voice.localService) score += 5;

  return score;
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((v) => v.lang.startsWith('en') && !isBadVoice(v));
  if (english.length === 0) return undefined;

  return english.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise((resolve) => {
    const tryLoad = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesReady = true;
        cachedVoice = pickBestVoice(voices) ?? null;
        resolve(voices);
        return true;
      }
      return false;
    };

    if (tryLoad()) return;

    const onChange = () => {
      if (tryLoad()) {
        speechSynthesis.removeEventListener('voiceschanged', onChange);
      }
    };
    speechSynthesis.addEventListener('voiceschanged', onChange);

    setTimeout(() => {
      speechSynthesis.removeEventListener('voiceschanged', onChange);
      const voices = speechSynthesis.getVoices();
      voicesReady = true;
      cachedVoice = pickBestVoice(voices) ?? null;
      resolve(voices);
    }, 1000);
  });

  return voicesPromise;
}

export function preloadVoices(): void {
  if ('speechSynthesis' in window) {
    loadVoices();
  }
}

export function getSelectedVoiceName(): string | null {
  return cachedVoice?.name ?? null;
}

export async function speakSentence(text: string): Promise<void> {
  if (!('speechSynthesis' in window)) return;

  speechSynthesis.cancel();
  await new Promise((r) => setTimeout(r, 50));

  if (!voicesReady) {
    await loadVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  if (cachedVoice) {
    utterance.voice = cachedVoice;
  } else {
    const voices = speechSynthesis.getVoices();
    const voice = pickBestVoice(voices);
    if (voice) {
      cachedVoice = voice;
      utterance.voice = voice;
    }
  }

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

let roosterContext: AudioContext | null = null;

/** 眠気覚まし用 — こけこっこー（Web Audio で合成） */
export function playRoosterCrow(): Promise<void> {
  stopSpeech();
  if (roosterContext) {
    void roosterContext.close().catch(() => undefined);
    roosterContext = null;
  }

  const Ctx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return Promise.resolve();

  const ctx = new Ctx();
  roosterContext = ctx;
  const t0 = ctx.currentTime;

  const crow = [
    { freq: 520, start: 0.0, dur: 0.14, vol: 0.22 },
    { freq: 720, start: 0.16, dur: 0.14, vol: 0.26 },
    { freq: 980, start: 0.32, dur: 0.18, vol: 0.3 },
    { freq: 1180, start: 0.52, dur: 0.22, vol: 0.34 },
    { freq: 920, start: 0.76, dur: 0.28, vol: 0.28 },
    { freq: 640, start: 1.06, dur: 0.42, vol: 0.2 },
  ];

  for (const { freq, start, dur, vol } of crow) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t0 + start);
    gain.gain.setValueAtTime(0.001, t0 + start);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0 + start);
    osc.stop(t0 + start + dur + 0.02);
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      void ctx.close().catch(() => undefined);
      if (roosterContext === ctx) roosterContext = null;
      resolve();
    }, 1550);
  });
}

/** こけこっこー → 英文リスニング */
export async function speakWakeUpListening(sentence: string): Promise<void> {
  await playRoosterCrow();
  await new Promise((r) => setTimeout(r, 180));
  await speakSentence(sentence);
}
