import type { Level, QuestionStats } from '../types';
import { QUESTIONS } from '../data/questions';

const LEVEL_WEIGHTS: Record<Level, number> = {
  基礎: 0.4,
  応用: 0.35,
  発展: 0.25,
};

function accuracyForLevel(
  level: Level,
  stats: Record<string, QuestionStats>,
): number | null {
  const levelQuestions = QUESTIONS.filter((q) => q.level === level);
  const attempted = levelQuestions.filter(
    (q) => stats[q.id] && (stats[q.id].correctCount + stats[q.id].incorrectCount) > 0,
  );
  if (attempted.length === 0) return null;

  let correct = 0;
  let total = 0;
  for (const q of attempted) {
    const s = stats[q.id];
    correct += s.correctCount;
    total += s.correctCount + s.incorrectCount;
  }
  return total > 0 ? correct / total : null;
}

export function predictScore(stats: Record<string, QuestionStats>): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const level of ['基礎', '応用', '発展'] as Level[]) {
    const acc = accuracyForLevel(level, stats);
    if (acc !== null) {
      weightedSum += acc * LEVEL_WEIGHTS[level];
      totalWeight += LEVEL_WEIGHTS[level];
    }
  }

  if (totalWeight === 0) return null;
  return Math.round((weightedSum / totalWeight) * 100);
}
