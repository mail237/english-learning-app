import type { VocabEntry } from '../types';
import { STEPS_PER_UNIT } from '../data/constants';
import { formatStageLabel } from '../utils/unitProgress';

interface Props {
  completedStep: number;
  wrongCount?: number;
  sessionVocab?: VocabEntry[];
  onContinue: () => void;
  onReview?: () => void;
  onBack: () => void;
}

export default function StepComplete({
  completedStep,
  wrongCount = 0,
  sessionVocab = [],
  onContinue,
  onReview,
  onBack,
}: Props) {
  const nextStep = completedStep + 1;
  const previewVocab = sessionVocab.slice(0, 12);
  const moreCount = sessionVocab.length - previewVocab.length;

  return (
    <div className="screen complete-screen">
      <div className="celebration">
        <div className="celebration-icon">⭐</div>
        <h2>{formatStageLabel(completedStep)} クリア！</h2>
        <p className="complete-message">
          {nextStep <= STEPS_PER_UNIT
            ? `次は ${formatStageLabel(nextStep)} に進もう`
            : 'すべてのステージをクリアしたよ'}
        </p>
      </div>

      {sessionVocab.length > 0 && (
        <div className="vocab-summary">
          <h3 className="vocab-summary-title">
            このステージで触れた単語（{sessionVocab.length}語）
          </h3>
          <p className="vocab-summary-note">文法の練習と一緒に、自然と覚えていこう</p>
          <div className="vocab-summary-chips">
            {previewVocab.map((entry) => (
              <span key={entry.en} className="vocab-summary-chip">
                <span className="vocab-summary-en">{entry.en}</span>
                <span className="vocab-summary-ja">{entry.ja}</span>
              </span>
            ))}
          </div>
          {moreCount > 0 && (
            <p className="vocab-summary-more">ほか {moreCount} 語</p>
          )}
        </div>
      )}

      {wrongCount > 0 && onReview && (
        <button className="btn btn-secondary btn-large" onClick={onReview}>
          間違えた問題を復習する（{wrongCount}問）
        </button>
      )}

      <button className="btn btn-primary btn-large" onClick={onContinue}>
        {formatStageLabel(nextStep)} をはじめる
      </button>

      <button className="btn btn-text" onClick={onBack}>
        単元選択にもどる
      </button>
    </div>
  );
}
