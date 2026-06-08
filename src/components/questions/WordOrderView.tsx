import { useEffect, useState } from 'react';
import type { WordOrderQuestion, Feedback, QuestionMode } from '../../types';
import { shuffleArray } from '../../utils/questionHelpers';

interface Props {
  question: WordOrderQuestion;
  feedback: Feedback;
  showAnswer: boolean;
  mode: QuestionMode;
  disabled: boolean;
  onCorrect: () => void;
  onWrong: (attempt?: string[]) => void;
  onReplay: () => void;
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
}: Props) {
  const [available, setAvailable] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [localFeedback, setLocalFeedback] = useState<Feedback>('none');

  useEffect(() => {
    setAvailable(shuffleArray(question.words));
    setSelected([]);
    setLocalFeedback('none');
  }, [question.id]);

  const handleWordTap = (word: string, index: number) => {
    if (disabled || feedback !== 'none' || localFeedback !== 'none') return;

    const newSelected = [...selected, word];
    const newAvailable = available.filter((_, i) => i !== index);
    setSelected(newSelected);
    setAvailable(newAvailable);

    if (newSelected.length === question.answer.length) {
      const isCorrect = newSelected.every((w, i) => w === question.answer[i]);
      if (isCorrect) {
        setLocalFeedback('correct');
        onCorrect();
      } else if (mode === 'practice') {
        setLocalFeedback('incorrect');
        onWrong();
        setTimeout(() => {
          setSelected([]);
          setAvailable(shuffleArray(question.words));
          setLocalFeedback('none');
        }, 1200);
      } else {
        setLocalFeedback('incorrect');
        onWrong(newSelected);
      }
    }
  };

  const handleRemoveWord = (wordIndex: number) => {
    if (disabled || feedback !== 'none' || localFeedback !== 'none') return;
    const word = selected[wordIndex];
    const newSelected = selected.filter((_, i) => i !== wordIndex);
    setSelected(newSelected);
    setAvailable([...available, word]);
  };

  const displayFeedback = feedback !== 'none' ? feedback : localFeedback;
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

      <div className="word-order-area">
        <div className="word-order-slot">
          {selected.length === 0 ? (
            <span className="word-order-placeholder">ここに並べよう</span>
          ) : (
            selected.map((word, i) => (
              <button
                key={`${word}-${i}`}
                className="btn word-chip word-chip-selected"
                onClick={() => handleRemoveWord(i)}
                disabled={disabled || displayFeedback !== 'none'}
              >
                {word}
              </button>
            ))
          )}
        </div>

        <div className="word-order-bank">
          {available.map((word, i) => (
            <button
              key={`${word}-${i}`}
              className="btn word-chip"
              onClick={() => handleWordTap(word, i)}
              disabled={disabled || displayFeedback !== 'none'}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {showAnswer && (
        <div className="correct-reveal">
          正解は「<strong>{question.answer.join(' ')}</strong>」だよ
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
    </>
  );
}
