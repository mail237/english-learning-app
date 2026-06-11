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
import { dedupeChoicesForDisplay } from './questionHelpers';
import {
  isUsefulVocabEntry,
  normalizeVocabEntry,
  pickSpeakingMode,
  pickVocabTestDirection,
} from './vocabQuality';

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const FALLBACK_JA = ['友達', '学校', '先生', '猫', '犬', '音楽'];
const FALLBACK_EN = ['friend', 'school', 'teacher', 'cat', 'dog', 'music'];

export function collectUniqueVocab(questions: Question[]): VocabEntry[] {
  const seen = new Set<string>();
  const result: VocabEntry[] = [];

  for (const q of questions) {
    const vocab = getVocabForQuestion(q.id, q.vocab);
    for (const raw of vocab) {
      const entry = normalizeVocabEntry(raw);
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

  return merged.filter(isUsefulVocabEntry).slice(0, VOCAB_TEST_MAX);
}

function pickDistractors(
  pool: VocabEntry[],
  correct: VocabEntry,
  count: number,
  pick: 'en' | 'ja',
  correctChoice: string,
): string[] {
  const others = shuffle(
    pool.filter((e) => e.en.toLowerCase() !== correct.en.toLowerCase()),
  );
  const distractors: string[] = [];
  const used = new Set<string>([correctChoice.trim().toLowerCase()]);

  for (const e of others) {
    if (distractors.length >= count) break;
    const val = pick === 'en' ? normalizeVocabEntry(e).en : normalizeVocabEntry(e).ja;
    const key = val.trim().toLowerCase();
    if (!used.has(key)) {
      used.add(key);
      distractors.push(val);
    }
  }

  const fallbacks = pick === 'en' ? FALLBACK_EN : FALLBACK_JA;
  for (const val of fallbacks) {
    if (distractors.length >= count) break;
    const key = val.toLowerCase();
    if (!used.has(key)) {
      used.add(key);
      distractors.push(val);
    }
  }

  return distractors;
}

/** 日本語→英語では英語だけ、英語→日本語では日本語だけを選ぶ */
function filterChoicesForDirection(
  direction: VocabTestDirection,
  entry: VocabEntry,
  choices: string[],
): string[] {
  const normalized = normalizeVocabEntry(entry);
  const correct = direction === 'en-to-ja' ? normalized.ja : normalized.en;
  const out: string[] = [];

  for (const choice of [correct, ...choices]) {
    const trimmed = choice.trim();
    if (!trimmed) continue;
    if (direction === 'ja-to-en') {
      if (trimmed === normalized.ja) continue;
    } else {
      if (trimmed.toLowerCase() === normalized.en.toLowerCase()) continue;
    }
    if (out.some((c) => c.toLowerCase() === trimmed.toLowerCase())) continue;
    out.push(trimmed);
  }

  const fallbacks = direction === 'ja-to-en' ? FALLBACK_EN : FALLBACK_JA;
  for (const val of fallbacks) {
    if (out.length >= 3) break;
    if (out.some((c) => c.toLowerCase() === val.toLowerCase())) continue;
    out.push(val);
  }

  return out.slice(0, 3);
}

function buildItem(
  entryRaw: VocabEntry,
  direction: VocabTestDirection,
  pool: VocabEntry[],
  index: number,
): VocabTestItem {
  const entry = normalizeVocabEntry(entryRaw);
  const isEnToJa = direction === 'en-to-ja';
  const correctChoice = isEnToJa ? entry.ja : entry.en;
  const distractors = pickDistractors(pool, entry, 2, isEnToJa ? 'ja' : 'en', correctChoice);
  const filtered = filterChoicesForDirection(direction, entry, distractors);
  const deduped = dedupeChoicesForDisplay(filtered, 0);

  const tagged = deduped.choices.map((text, i) => ({
    text,
    isAnswer: i === deduped.answerIndex,
  }));
  const shuffled = shuffle(tagged);

  return {
    id: `vocab-${index}-${entry.en}-${direction}`,
    entry,
    direction,
    choices: shuffled.map((t) => t.text),
    answer: shuffled.findIndex((t) => t.isAnswer),
  };
}

export function buildVocabTestItems(testQuestions: Question[], unit: number): VocabTestItem[] {
  const pool = buildVocabPool(testQuestions, unit);
  if (pool.length === 0) return [];

  return shuffle(pool).map((entry, index) => {
    const direction = pickVocabTestDirection(entry);
    return buildItem(entry, direction, pool, index);
  });
}

export function buildSpeakingItems(testQuestions: Question[], unit: number): SpeakingItem[] {
  const pool = buildVocabPool(testQuestions, unit);
  const picked = shuffle(pool).slice(0, SPEAKING_MAX);
  return shuffle(picked).map((entry) => ({
    entry: normalizeVocabEntry(entry),
    mode: pickSpeakingMode(entry),
  }));
}

/** 練習セッション中の単語おさらい（1問） */
export function buildCheckpointItem(sessionVocab: VocabEntry[]): VocabTestItem | null {
  if (sessionVocab.length < 2) return null;

  const normalized = sessionVocab.map(normalizeVocabEntry);
  const useful = shuffle(normalized.filter(isUsefulVocabEntry));
  const checkpointPool = useful.length >= 2 ? useful : shuffle(normalized);
  const entry = checkpointPool[0];
  const direction = pickVocabTestDirection(entry);
  return buildItem(entry, direction, checkpointPool, 0);
}

export function mergeVocabEntries(existing: VocabEntry[], incoming: VocabEntry[]): VocabEntry[] {
  const seen = new Set(existing.map((e) => e.en.toLowerCase()));
  const merged = existing.map(normalizeVocabEntry);
  for (const raw of incoming) {
    const entry = normalizeVocabEntry(raw);
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
