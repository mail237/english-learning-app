import type {
  Question,
  SpeakingItem,
  VocabEntry,
  VocabTestDirection,
  VocabTestItem,
} from '../types';
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

export function buildVocabTestItems(questions: Question[]): VocabTestItem[] {
  const pool = collectUniqueVocab(questions);
  if (pool.length === 0) return [];

  return shuffle(pool).map((entry, index) => {
    const direction: VocabTestDirection = Math.random() < 0.5 ? 'en-to-ja' : 'ja-to-en';
    return buildItem(entry, direction, pool, index);
  });
}

export function buildSpeakingItems(questions: Question[]): SpeakingItem[] {
  const pool = collectUniqueVocab(questions);
  return shuffle(pool).map((entry) => ({
    entry,
    mode: Math.random() < 0.5 ? 'read-en' : 'say-en',
  }));
}

export function calcOverallScore(
  testAccuracy: number,
  vocabAccuracy: number,
  speakingAccuracy: number,
): number {
  return Math.round((testAccuracy + vocabAccuracy + speakingAccuracy) / 3);
}
