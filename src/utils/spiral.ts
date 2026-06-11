import type { Question, QuestionStats } from '../types';
import { getQuestionsBeforeStep, getQuestionsByUnitAndStep } from '../data/questions';

const SPIRAL_RATIO = 0.3;

function getWeight(stats: QuestionStats | undefined): number {
  if (!stats) return 2;
  const incorrect = stats.incorrectCount + 1;
  const correct = stats.correctCount + 1;
  return incorrect / correct + 1;
}

function weightedPick(questions: Question[], stats: Record<string, QuestionStats>): Question {
  const weights = questions.map((q) => getWeight(stats[q.id]));
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < questions.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return questions[i];
  }
  return questions[questions.length - 1];
}

export function buildPracticePool(unit: number, step: number): Question[] {
  const current = getQuestionsByUnitAndStep(unit, step);
  const previous = getQuestionsBeforeStep(unit, step);
  const spiralCount = Math.ceil(current.length * SPIRAL_RATIO);
  const shuffledPrev = [...previous].sort(() => Math.random() - 0.5);
  const spiralQuestions = shuffledPrev.slice(0, spiralCount);
  return [...current, ...spiralQuestions];
}

export function pickNextQuestion(
  pool: Question[],
  remaining: Set<string>,
  stats: Record<string, QuestionStats>,
  lastQuestionId?: string | null,
): Question | null {
  let candidates = pool.filter((q) => remaining.has(q.id));
  if (candidates.length === 0) return null;

  if (lastQuestionId && candidates.length > 1) {
    const withoutLast = candidates.filter((q) => q.id !== lastQuestionId);
    if (withoutLast.length > 0) candidates = withoutLast;
  }

  return weightedPick(candidates, stats);
}

export function shuffleForTest(questions: Question[], count: number): Question[] {
  const seen = new Set<string>();
  const unique = [...questions].sort(() => Math.random() - 0.5).filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
  return unique.slice(0, Math.min(count, unique.length));
}
