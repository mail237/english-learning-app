import { TEST_PASS_SCORE } from '../data/constants';
import type { FullTestResult } from '../types';

export function isTestPassed(result: Pick<FullTestResult, 'overallScore'>): boolean {
  return result.overallScore >= TEST_PASS_SCORE;
}
