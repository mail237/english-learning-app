import type {
  Question,
  SpeakingItem,
  VocabEntry,
  VocabTestDirection,
  VocabTestItem,
} from '../types';
import { SPEAKING_MAX, VOCAB_TEST_MAX } from '../data/constants';
import { getQuestionsByUnit } from '../data/questions';
import { getVocabForQuestion } from '../data/vocab';

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function collectUniqueVocab(questions: Question[]): VocabEntry[] {
  const seen = new Set<string>();
  const result: VocabEntry[] = [];

  for (const q of questions) {
    const vocab = getVocabForQuestion(q.id, q.vocab);
    for (const entry of vocab) {
      const key = entry.en.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(entry);
      }
    }
  }

  return result;
}

/** テスト問題の単語を優先し、単元全体の語彙で補完する */
export function buildVocabPool(testQuestions: Question[], unit: number): VocabEntry[] {
  const primary = collectUniqueVocab(testQuestions);
  const unitPool = collectUniqueVocab(getQuestionsByUnit(unit));
  const seen = new Set(primary.map((e) => e.en.toLowerCase()));
  const merged = [...primary];

  for (const entry of shuffle(unitPool)) {
    if (merged.length >= VOCAB_TEST_MAX) break;
    const key = entry.en.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(entry);
    }
  }

  return merged.slice(0, VOCAB_TEST_MAX);
}

function pickDistractors(
  pool: VocabEntry[],
  correct: VocabEntry,
  count: number,
  pick: 'en' | 'ja',
): string[] {
  const others = shuffle(
    pool.filter((e) => e.en.toLowerCase() !== correct.en.toLowerCase()),
  );
  const distractors = others.slice(0, count).map((e) => (pick === 'en' ? e.en : e.ja));

  while (distractors.length < count) {
    distractors.push(pick === 'en' ? 'word' : '単語');
  }

  return distractors;
}

function buildItem(
  entry: VocabEntry,
  direction: VocabTestDirection,
  pool: VocabEntry[],
  index: number,
): VocabTestItem {
  const isEnToJa = direction === 'en-to-ja';
  const correctChoice = isEnToJa ? entry.ja : entry.en;
  const distractors = pickDistractors(pool, entry, 2, isEnToJa ? 'ja' : 'en');
  const choices = shuffle([correctChoice, ...distractors]);
  const answer = choices.indexOf(correctChoice);

  return {
    id: `vocab-${index}-${entry.en}-${direction}`,
    entry,
    direction,
    choices,
    answer,
  };
}

export function buildVocabTestItems(testQuestions: Question[], unit: number): VocabTestItem[] {
  const pool = buildVocabPool(testQuestions, unit);
  if (pool.length === 0) return [];

  return shuffle(pool).map((entry, index) => {
    const direction: VocabTestDirection = Math.random() < 0.5 ? 'en-to-ja' : 'ja-to-en';
    return buildItem(entry, direction, pool, index);
  });
}

export function buildSpeakingItems(testQuestions: Question[], unit: number): SpeakingItem[] {
  const pool = buildVocabPool(testQuestions, unit);
  const picked = shuffle(pool).slice(0, SPEAKING_MAX);
  return shuffle(picked).map((entry) => ({
    entry,
    mode: Math.random() < 0.5 ? 'read-en' : 'say-en',
  }));
}

/** 練習セッション中の単語おさらい（1問） */
export function buildCheckpointItem(sessionVocab: VocabEntry[]): VocabTestItem | null {
  if (sessionVocab.length < 2) return null;

  const pool = shuffle(sessionVocab);
  const entry = pool[0];
  const direction: VocabTestDirection = Math.random() < 0.5 ? 'en-to-ja' : 'ja-to-en';
  return buildItem(entry, direction, pool, 0);
}

export function mergeVocabEntries(existing: VocabEntry[], incoming: VocabEntry[]): VocabEntry[] {
  const seen = new Set(existing.map((e) => e.en.toLowerCase()));
  const merged = [...existing];
  for (const entry of incoming) {
    const key = entry.en.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(entry);
    }
  }
  return merged;
}

export function calcOverallScore(
  testAccuracy: number,
  vocabAccuracy: number,
  speakingAccuracy: number,
): number {
  return Math.round((testAccuracy + vocabAccuracy + speakingAccuracy) / 3);
}
