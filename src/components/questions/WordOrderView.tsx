import { useEffect, useMemo, useState } from 'react';
import type { WordOrderQuestion, Feedback, QuestionMode } from '../../types';
import {
  maybeAutoAppendQuestionMark,
  prepareWordOrderQuestion,
  shuffleArray,
  wordOrderAnswerWithoutPunctuation,
  wordsMatchWordOrderAnswer,
} from '../../utils/questionHelpers';

interface Props {
  question: WordOrderQuestion;
  feedback: Feedback;
  showAnswer: boolean;
  mode: QuestionMode;
  disabled: boolean;
  onCorrect: () => void;
  onWrong: (attempt?: string[]) => void;
  onReplay: () => void;
  onSkip?: () => void;
}

export default function WordOrderView({
  question,
  feedback,
  showAnswer,
  mode,
  disabled,
  onCorrect,
  onWrong,
  onReplay,
  onSkip,
}: Props) {
  const { words: wordBank, answer: expectedAnswer } = useMemo(
    () => prepareWordOrderQuestion(question),
    [question.id, question.words, question.answer, question.sentence],
  );
  const needsQuestionMark = expectedAnswer.includes('?');
  const coreAnswer = useMemo(
    () => wordOrderAnswerWithoutPunctuation(expectedAnswer),
    [expectedAnswer],
  );

  const [available, setAvailable] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [localFeedback, setLocalFeedback] = useState<Feedback>('none');
  const [checking, setChecking] = useState(false);

  const resetBoard = () => {
    setAvailable(shuffleArray(wordBank));
    setSelected([]);
    setLocalFeedback('none');
    setChecking(false);
  };

  useEffect(() => {
    resetBoard();
  }, [question.id, wordBank]);

  const displayFeedback = feedback !== 'none' ? feedback : localFeedback;
  const isLocked = disabled || displayFeedback !== 'none' || checking;
  const remaining = expectedAnswer.length - selected.length;

  const finalizeAnswer = (attempt: string[]) => {
    const isCorrect = wordsMatchWordOrderAnswer(attempt, expectedAnswer);
    if (isCorrect) {
      setLocalFeedback('correct');
      onCorrect();
    } else if (mode === 'practice') {
      setLocalFeedback('incorrect');
      onWrong();
      setTimeout(() => {
        resetBoard();
      }, 2800);
    } else {
      setLocalFeedback('incorrect');
      onWrong(attempt);
    }
    setChecking(false);
  };

  const trySubmit = (attempt: string[]) => {
    if (isLocked) return;

    let finalAttempt = attempt;
    if (needsQuestionMark && !finalAttempt.includes('?')) {
      const auto = maybeAutoAppendQuestionMark(finalAttempt, [], expectedAnswer);
      finalAttempt = auto.selected;
    }

    if (finalAttempt.length < expectedAnswer.length) return;

    setChecking(true);
    finalizeAnswer(finalAttempt);
  };

  const handleWordTap = (word: string, index: number) => {
    if (isLocked) return;

    let newSelected = [...selected, word];
    let newAvailable = available.filter((_, i) => i !== index);
    const auto = maybeAutoAppendQuestionMark(newSelected, newAvailable, expectedAnswer);
    newSelected = auto.selected;
    newAvailable = auto.available;

    setSelected(newSelected);
    setAvailable(newAvailable);

    if (newSelected.length === expectedAnswer.length) {
      trySubmit(newSelected);
    }
  };

  const handleRemoveWord = (wordIndex: number) => {
    if (isLocked) return;
    const word = selected[wordIndex];
    const newSelected = selected.filter((_, i) => i !== wordIndex);
    setSelected(newSelected);
    setAvailable([...available, word]);
  };

  const handleSubmit = () => {
    trySubmit(selected);
  };

  const canSubmit =
    !isLocked &&
    (selected.length === expectedAnswer.length ||
      (needsQuestionMark &&
        selected.length === coreAnswer.length &&
        wordsMatchWordOrderAnswer(selected, coreAnswer)));

  const revealSentence = showAnswer || displayFeedback === 'correct';

  return (
    <>
      {revealSentence ? (
        <div className="sentence-box">
          <p className="sentence sentence-small">{question.sentence}</p>
          <button className="btn btn-icon" onClick={onReplay} title="もう一度聞く">
            🔊
          </button>
        </div>
      ) : (
        <div className="listening-box">
          <p className="listening-label">👂 英文を聞いて並べよう</p>
          <button className="btn btn-primary btn-large" onClick={onReplay}>
            🔊 再生する
          </button>
        </div>
      )}

      <p className="question-text">{question.question}</p>

      {remaining > 0 && displayFeedback === 'none' && (
        <p className="word-order-remaining">
          あと <strong>{remaining}</strong> つ
          {needsQuestionMark && remaining === 1 && '（? も忘れずに）'}
        </p>
      )}

      <div className="word-order-area">
        <div className="word-order-slot">
          {selected.length === 0 ? (
            <span className="word-order-placeholder">ここに並べよう</span>
          ) : (
            selected.map((word, i) => (
              <button
                key={`${word}-${i}`}
                className={`btn word-chip word-chip-selected${word === '?' ? ' word-chip-punct' : ''}`}
                onClick={() => handleRemoveWord(i)}
                disabled={isLocked}
              >
                {word}
              </button>
            ))
          )}
        </div>

        <div className="word-order-actions">
          {selected.length > 0 && displayFeedback === 'none' && (
            <button
              type="button"
              className="btn btn-text word-order-reset"
              onClick={resetBoard}
              disabled={isLocked}
            >
              やり直す
            </button>
          )}
          {canSubmit && (
            <button
              type="button"
              className="btn btn-primary word-order-submit"
              onClick={handleSubmit}
            >
              できた！
            </button>
          )}
        </div>

        <div className="word-order-bank">
          {available.map((word, i) => (
            <button
              key={`${word}-${i}`}
              className={`btn word-chip${word === '?' ? ' word-chip-punct' : ''}`}
              onClick={() => handleWordTap(word, i)}
              disabled={isLocked}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {showAnswer && (
        <div className="correct-reveal">
          正解は「<strong>{expectedAnswer.join(' ')}</strong>」だよ
        </div>
      )}

      {displayFeedback === 'correct' && (
        <div className="feedback correct">よくできた！ ✨</div>
      )}
      {displayFeedback === 'incorrect' && (
        <div className="feedback incorrect">
          {mode === 'practice' ? '順番が違うよ。もう一度！' : '不正解'}
        </div>
      )}

      {mode === 'practice' && onSkip && displayFeedback === 'none' && (
        <button type="button" className="btn btn-text word-order-skip" onClick={onSkip}>
          わからない（答えを見て次へ）
        </button>
      )}
    </>
  );
}
