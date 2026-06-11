import type { SpeakingMode, VocabEntry, VocabTestDirection } from '../types';

const NAME_JA: Record<string, string> = {
  Ken: 'ケン',
  Yuki: 'ユキ',
  Tom: 'トム',
  Emi: 'エミ',
  Ryo: 'リョウ',
};

const PLACE_JA: Record<string, string> = {
  Osaka: '大阪',
  Kyoto: '京都',
  Tokyo: '東京',
  Kobe: '神戸',
  Nara: '奈良',
  Japan: '日本',
};

const PROPER_NOUN_EN = new Set([...Object.keys(NAME_JA), ...Object.keys(PLACE_JA)]);

/** 古いデータや生成ミスの { en: Kobe, ja: Kobe } などを補正 */
export function normalizeVocabEntry(entry: VocabEntry): VocabEntry {
  const en = entry.en.trim();
  let ja = entry.ja.trim();
  if (NAME_JA[en]) ja = NAME_JA[en];
  else if (PLACE_JA[en]) ja = PLACE_JA[en];
  return { en, ja };
}

/** 英語と日本語が同じ語は単語テスト・スピーキングに不向き */
export function isUsefulVocabEntry(entry: VocabEntry): boolean {
  const { en, ja } = normalizeVocabEntry(entry);
  if (!en || !ja) return false;
  return en.toLowerCase() !== ja.toLowerCase();
}

export function pickSpeakingMode(entry: VocabEntry): SpeakingMode {
  if (!isUsefulVocabEntry(entry)) return 'read-en';
  return Math.random() < 0.5 ? 'read-en' : 'say-en';
}

/** 地名・人名は「神戸 → Kobe」の日本語→英語が自然 */
export function pickVocabTestDirection(entry: VocabEntry): VocabTestDirection {
  const normalized = normalizeVocabEntry(entry);
  if (!isUsefulVocabEntry(normalized)) return 'en-to-ja';
  if (PROPER_NOUN_EN.has(normalized.en)) return 'ja-to-en';
  return Math.random() < 0.5 ? 'en-to-ja' : 'ja-to-en';
}
