import type { PendingSpeakingBatch, SpeakingItem, SpeakingResult, StudentData } from '../types';
import { UNITS } from '../data/units';
import { calcOverallScore } from './vocabTest';

export interface QueuedSpeakingItem {
  batchId: string;
  unit: number;
  item: SpeakingItem;
}

export function getPendingBatches(student: StudentData): PendingSpeakingBatch[] {
  return student.pendingSpeaking ?? [];
}

export function countPendingWords(student: StudentData): number {
  return getPendingBatches(student).reduce((sum, batch) => sum + batch.items.length, 0);
}

export function flattenPendingQueue(batches: PendingSpeakingBatch[]): QueuedSpeakingItem[] {
  const queue: QueuedSpeakingItem[] = [];
  for (const batch of batches) {
    for (const item of batch.items) {
      queue.push({ batchId: batch.id, unit: batch.unit, item });
    }
  }
  return queue;
}

export function addPendingBatch(
  student: StudentData,
  batch: PendingSpeakingBatch,
): StudentData {
  const pendingSpeaking = [...getPendingBatches(student), batch];
  return { ...student, pendingSpeaking };
}

export function removePendingBatches(
  student: StudentData,
  batchIds: string[],
): StudentData {
  const ids = new Set(batchIds);
  const pendingSpeaking = getPendingBatches(student).filter((b) => !ids.has(b.id));
  return { ...student, pendingSpeaking };
}

export function createPendingBatchId(): string {
  return `speak-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function summarizeBatchResults(
  batch: PendingSpeakingBatch,
  results: SpeakingResult[],
): {
  speakingPassed: number;
  speakingTotal: number;
  speakingAccuracy: number;
  overallScore: number;
} {
  const speakingPassed = results.filter((r) => r.passed).length;
  const speakingTotal = results.length;
  const speakingAccuracy =
    speakingTotal > 0 ? Math.round((speakingPassed / speakingTotal) * 100) : 100;
  const vocabAcc = batch.vocabTotal === 0 ? batch.testAccuracy : batch.vocabAccuracy;
  const overallScore = calcOverallScore(batch.testAccuracy, vocabAcc, speakingAccuracy);

  return { speakingPassed, speakingTotal, speakingAccuracy, overallScore };
}

export function unitTitle(unit: number): string {
  return UNITS.find((u) => u.number === unit)?.title ?? `Unit ${unit}`;
}
