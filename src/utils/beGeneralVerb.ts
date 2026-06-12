import type { Question } from '../types';
import { QA_NEGATIVE_QUESTIONS } from '../data/questions/qaNegative';
import { BE_GENERAL_SPIRAL_QUESTIONS } from '../data/questions/beGeneralSpiral';

const BE_GEN_IDS = new Set([
  ...QA_NEGATIVE_QUESTIONS.map((q) => q.id),
  ...BE_GENERAL_SPIRAL_QUESTIONS.map((q) => q.id),
]);

/** be動詞 vs 一般動詞の対比・定着ドリルか */
export function isBeGeneralVerbQuestion(q: Question): boolean {
  if (BE_GEN_IDS.has(q.id)) return true;
  const jp = 'japanese' in q && typeof q.japanese === 'string' ? q.japanese : '';
  const sentence = 'sentence' in q && typeof q.sentence === 'string' ? q.sentence : '';
  const hay = `${q.question}\n${sentence}\n${jp}`;
  return /be動詞|一般動詞/.test(hay);
}

/** Units 1〜3 の対比ドリル（qaNegative） */
export function getCoreBeGeneralVerbQuestions(): Question[] {
  return QA_NEGATIVE_QUESTIONS;
}

/** 全単元向けの be / 一般動詞 定着ドリル */
export function getBeGeneralVerbQuestions(): Question[] {
  return [...QA_NEGATIVE_QUESTIONS, ...BE_GENERAL_SPIRAL_QUESTIONS];
}
