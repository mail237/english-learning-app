import type { SpeakingMode, VocabEntry, VocabTestDirection } from '../types';

/** 英語と日本語が同じ語は単語テスト・スピーキングに不向き */
export function isUsefulVocabEntry(entry: VocabEntry): boolean {
  const en = entry.en.trim();
  const ja = entry.ja.trim();
  if (!en || !ja) return false;
  return en.toLowerCase() !== ja.toLowerCase();
}

export function pickSpeakingMode(entry: VocabEntry): SpeakingMode {
  if (!isUsefulVocabEntry(entry)) return 'read-en';
  return Math.random() < 0.5 ? 'read-en' : 'say-en';
}

export function pickVocabTestDirection(entry: VocabEntry): VocabTestDirection {
  if (!isUsefulVocabEntry(entry)) return 'en-to-ja';
  return Math.random() < 0.5 ? 'en-to-ja' : 'ja-to-en';
}
