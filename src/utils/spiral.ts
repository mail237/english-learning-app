import type { Question, QuestionStats } from '../types';
import {
  SPIRAL_BE_GEN_WEIGHT,
  SPIRAL_PRIOR_UNIT_WEIGHT,
  SPIRAL_TEST_RATIO,
  TEST_QUESTION_COUNT,
} from '../data/constants';
import { getQuestionsBeforeStep, getQuestionsByUnitAndStep } from '../data/questions';
import { getBeGeneralVerbQuestions, isBeGeneralVerbQuestion } from './beGeneralVerb';

export interface PracticePick {
  question: Question;
  isSpiral: boolean;
}

function getWeight(stats: QuestionStats | undefined): number {
  if (!stats) return 2;
  const incorrect = stats.incorrectCount + 1;
  const correct = stats.correctCount + 1;
  return incorrect / correct + 1;
}

function questionWeight(
  q: Question,
  stats: Record<string, QuestionStats>,
  unit: number,
): number {
  let weight = getWeight(stats[q.id]);
  if (isBeGeneralVerbQuestion(q)) weight *= SPIRAL_BE_GEN_WEIGHT;
  if (unit >= 4 && q.unit <= 3) weight *= SPIRAL_PRIOR_UNIT_WEIGHT;
  return weight;
}

function weightedPick(
  questions: Question[],
  stats: Record<string, QuestionStats>,
  unit: number,
  lastQuestionId?: string | null,
): Question | null {
  if (questions.length === 0) return null;

  let candidates = questions;
  if (lastQuestionId && questions.length > 1) {
    const withoutLast = questions.filter((q) => q.id !== lastQuestionId);
    if (withoutLast.length > 0) candidates = withoutLast;
  }

  const weights = candidates.map((q) => questionWeight(q, stats, unit));
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function dedupeQuestions(questions: Question[]): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const q of questions) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    out.push(q);
  }
  return out;
}

/** 現在ステージの必須問題 */
export function getRequiredQuestions(unit: number, step: number): Question[] {
  return getQuestionsByUnitAndStep(unit, step);
}

/** 過去の単元・ステージ + be動詞/一般動詞ドリルを混ぜた復習プール */
export function buildSpiralPool(unit: number, step: number): Question[] {
  const previous = getQuestionsBeforeStep(unit, step);
  const beGen = getBeGeneralVerbQuestions().filter(
    (q) => q.unit < unit || (q.unit === unit && q.step < step),
  );
  return dedupeQuestions([...beGen, ...previous]);
}

/** 単元が進むほど復習を厚くする（0〜1） */
export function getSpiralChance(unit: number): number {
  if (unit <= 1) return 0.4;
  if (unit <= 3) return 0.5;
  if (unit <= 5) return 0.55;
  return 0.6;
}

export function isSpiralQuestion(question: Question, requiredIds: Set<string>): boolean {
  return !requiredIds.has(question.id);
}

export function pickNextPracticeQuestion(
  unit: number,
  step: number,
  requiredRemaining: Set<string>,
  spiralPool: Question[],
  stats: Record<string, QuestionStats>,
  lastQuestionId?: string | null,
): PracticePick | null {
  const requiredCandidates = getRequiredQuestions(unit, step).filter((q) =>
    requiredRemaining.has(q.id),
  );
  const hasRequired = requiredCandidates.length > 0;
  const hasSpiral = spiralPool.length > 0;

  if (!hasRequired && !hasSpiral) return null;

  const useSpiral = hasSpiral && hasRequired && Math.random() < getSpiralChance(unit);

  if (useSpiral) {
    const question = weightedPick(spiralPool, stats, unit, lastQuestionId);
    return question ? { question, isSpiral: true } : null;
  }

  if (hasRequired) {
    const question = weightedPick(requiredCandidates, stats, unit, lastQuestionId);
    return question ? { question, isSpiral: false } : null;
  }

  const question = weightedPick(spiralPool, stats, unit, lastQuestionId);
  return question ? { question, isSpiral: true } : null;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function uniqueSample(questions: Question[], count: number): Question[] {
  return shuffle(questions).slice(0, Math.min(count, questions.length));
}

/** テスト出題（単元本編 + 過去単元・be動詞/一般動詞のスパイラル復習） */
export function shuffleForTest(questions: Question[], count: number, unit: number): Question[] {
  const target = Math.min(count, TEST_QUESTION_COUNT);
  const mainPool = dedupeQuestions(questions);

  if (unit <= 1) {
    return uniqueSample(mainPool, target);
  }

  const spiralCount = Math.min(
    Math.floor(target * SPIRAL_TEST_RATIO),
    Math.max(10, Math.floor(target * 0.25)),
  );
  const mainCount = Math.max(1, target - spiralCount);

  const beGen = getBeGeneralVerbQuestions().filter((q) => q.unit < unit);
  const priorContrast = getQuestionsBeforeStep(unit, 1).filter(isBeGeneralVerbQuestion);
  const spiralSource = dedupeQuestions([...beGen, ...priorContrast]);

  const main = uniqueSample(mainPool, mainCount);
  const spiral = uniqueSample(spiralSource, Math.min(spiralCount, spiralSource.length));
  const merged = dedupeQuestions([...main, ...spiral]);
  if (merged.length >= target) return shuffle(merged).slice(0, target);
  const extra = uniqueSample(mainPool, target - merged.length).filter((q) => !merged.some((m) => m.id === q.id));
  return shuffle([...merged, ...extra]).slice(0, target);
}
