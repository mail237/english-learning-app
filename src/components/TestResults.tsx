import type { FullTestResult } from '../types';
import { TEST_PASS_SCORE } from '../data/constants';
import { isTestPassed } from '../utils/testPass';
import {
  getCorrectAnswerText,
  getReviewPrompt,
  getSelectedAnswerText,
  getTypeLabel,
} from '../utils/questionHelpers';

interface Props {
  result: FullTestResult;
  onFinish: () => void;
  onBackToUnits?: () => void;
  onRetryTest?: () => void;
  onReview?: () => void;
}

export default function TestResults({
  result,
  onFinish,
  onBackToUnits,
  onRetryTest,
  onReview,
}: Props) {
  const {
    testCorrect,
    testTotal,
    testAccuracy,
    vocabCorrect,
    vocabTotal,
    vocabAccuracy,
    speakingPassed,
    speakingTotal,
    speakingAccuracy,
    overallScore,
    wrongTestAnswers,
    speakingPending,
    speakingSkipped,
  } = result;

  const passed = result.testPassed ?? isTestPassed(result);

  const gradeClass = passed
    ? overallScore >= 80
      ? 'great'
      : 'good'
    : 'retry';
  const gradeMessage = passed
    ? overallScore >= 80
      ? 'すばらしい！ 🌟'
      : 'よくがんばったね！'
    : `合格には ${TEST_PASS_SCORE}点以上が必要だよ。復習してもう一度！`;

  return (
    <div className="screen results-screen">
      <div className="results-header">
        <h2>テスト結果</h2>
        {!passed && (
          <p className="results-fail-banner">❌ 不合格 — 次の単元には進めません</p>
        )}
        <div className={`score-circle ${gradeClass}`}>
          <span className="score-number">{overallScore}</span>
          <span className="score-unit">点</span>
        </div>
        <p className="score-message">{gradeMessage}</p>
        <p className="score-subtitle">総合評価（合格ライン {TEST_PASS_SCORE}点）</p>
      </div>

      <div className="results-summary">
        <div className="result-row">
          <span className="result-label">テスト正答率</span>
          <span className="result-value">
            {testTotal}問中 <strong>{testCorrect}問正解</strong>（{testAccuracy}%）
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">単語テスト正答率</span>
          <span className="result-value">
            {vocabTotal}問中 <strong>{vocabCorrect}問正解</strong>（{vocabAccuracy}%）
          </span>
        </div>
        <div className="result-row">
          <span className="result-label">スピーキング</span>
          <span className="result-value">
            {speakingSkipped ? (
              <strong>スキップ（{speakingTotal}語）</strong>
            ) : speakingPending ? (
              <>
                <strong>{speakingTotal}語 あとでまとめて</strong>（単元選択からできます）
              </>
            ) : (
              <>
                {speakingTotal}単語中 <strong>{speakingPassed}単語OK</strong>（{speakingAccuracy}%）
              </>
            )}
          </span>
        </div>
      </div>

      {wrongTestAnswers.length > 0 && (
        <div className="review-section">
          <h3>間違えた問題の復習</h3>
          <div className="review-list">
            {wrongTestAnswers.map((a, i) => (
              <div key={i} className="review-item">
                <span className="type-badge type-badge-small">{getTypeLabel(a.question.type)}</span>
                <p className="review-sentence">{getReviewPrompt(a.question)}</p>
                <p className="review-question">{a.question.question}</p>
                <p className="review-answer">
                  正解: <strong>{getCorrectAnswerText(a.question)}</strong>
                  {' '}（選んだ答え: {getSelectedAnswerText(a.question, a.selected)}）
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {wrongTestAnswers.length > 0 && onReview && (
        <button className="btn btn-secondary btn-large" onClick={onReview}>
          間違えた問題をもう一度（{wrongTestAnswers.length}問）
        </button>
      )}

      {!passed && onRetryTest && (
        <button className="btn btn-primary btn-large" onClick={onRetryTest}>
          もう一度テストをうける
        </button>
      )}

      {passed && onBackToUnits && (
        <button className="btn btn-primary btn-large" onClick={onBackToUnits}>
          つぎの単元へ
        </button>
      )}

      {!passed && onBackToUnits && (
        <button className="btn btn-secondary btn-large" onClick={onBackToUnits}>
          単元選択にもどる
        </button>
      )}

      <button className="btn btn-text" onClick={onFinish}>
        おわる
      </button>
    </div>
  );
}
