import type { UnitProgress } from '../types';
import { STEPS_PER_UNIT } from '../data/constants';

/** いま取り組むべきステージ（1〜3） */
export function getActiveStep(progress: UnitProgress | undefined): number {
  if (!progress) return 1;
  if (progress.status === '練習完了' || progress.status === 'テスト済') return STEPS_PER_UNIT;
  const completed = progress.completedStep ?? 0;
  return Math.min(completed + 1, STEPS_PER_UNIT);
}

export function isAllPracticeDone(progress: UnitProgress | undefined): boolean {
  if (!progress) return false;
  if (progress.status === '練習完了' || progress.status === 'テスト済') return true;
  return (progress.completedStep ?? 0) >= STEPS_PER_UNIT;
}

export function normalizeUnitProgress(progress: UnitProgress): UnitProgress {
  if (progress.completedStep !== undefined) return progress;

  if (progress.status === 'テスト済' || progress.status === '練習完了') {
    return { ...progress, completedStep: STEPS_PER_UNIT };
  }
  if (progress.status === '練習中') {
    return { ...progress, completedStep: 0 };
  }
  return { ...progress, completedStep: 0 };
}

export function formatStageLabel(step: number): string {
  return `ステージ ${step}`;
}
