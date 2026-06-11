import { useEffect, useState } from 'react';
import type { Question, VocabTestAnswer, VocabTestItem } from '../types';
import { speakSentence, stopSpeech } from '../utils/speech';
import { buildVocabTestItems } from '../utils/vocabTest';
import FeedbackContinueButton from './FeedbackContinueButton';

interface Props {
  testQuestions: Question[];
  unit: number;
  onComplete: (answers: VocabTestAnswer[], accuracy: number) => void;
}

export default function VocabTestMode({ testQuestions, unit, onComplete }: Props) {
  const [items] = useState<VocabTestItem[]>(() => buildVocabTestItems(testQuestions, unit));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<VocabTestAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const current = items[currentIndex];

  useEffect(() => {
    if (items.length === 0 && !skipped) {
      setSkipped(true);
      onComplete([], 100);
    }
  }, [items.length, skipped, onComplete]);

  useEffect(() => {
    if (current?.direction === 'en-to-ja') {
      speakSentence(current.entry.en);
    }
    return () => stopSpeech();
  }, [current]);

  const goToNext = (newAnswers: VocabTestAnswer[]) => {
    if (currentIndex + 1 >= items.length) {
      const correctCount = newAnswers.filter((a) => a.correct).length;
      const accuracy =
        newAnswers.length > 0 ? Math.round((correctCount / newAnswers.length) * 100) : 100;
      onComplete(newAnswers, accuracy);
    } else {
      setAnswers(newAnswers);
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
    }
  };

  const advance = (newAnswer: VocabTestAnswer) => {
    const newAnswers = [...answers, newAnswer];
    if (newAnswer.correct) {
      setTimeout(() => goToNext(newAnswers), 800);
    }
  };

  const continueAfterWrong = () => {
    if (!current || selected === null) return;
    goToNext([
      ...answers,
      { item: current, selected, correct: false },
    ]);
  };

  const handleSelect = (index: number) => {
    if (locked || selected !== null || !current) return;
    setLocked(true);
    setSelected(index);
    if (index === current.answer) {
      advance({
        item: current,
        selected: index,
        correct: true,
      });
    }
  };

  const handleReplay = () => {
    if (current?.direction === 'en-to-ja') {
      speakSentence(current.entry.en);
    }
  };

  if (items.length === 0 || !current) return null;

  const isEnToJa = current.direction === 'en-to-ja';
  const isWrong = selected !== null && selected !== current.answer;

  return (
    <div className="screen vocab-test-screen">
      <header className="screen-header">
        <div className="test-info">
          <span className="test-badge test-badge-vocab">単語テスト</span>
          <span>
            {currentIndex + 1} / {items.length} 問
          </span>
        </div>
        <p className="headphone-hint">
          {isEnToJa ? '英語→日本語' : '日本語→英語'}（練習で出た単語から）
        </p>
      </header>

      <div className="question-area">
        {isEnToJa ? (
          <div className="vocab-prompt-box">
            <p className="vocab-word-en">{current.entry.en}</p>
            <button className="btn btn-icon" onClick={handleReplay} title="もう一度聞く">
              🔊
            </button>
          </div>
        ) : (
          <div className="japanese-box">
            <p className="japanese-text">{current.entry.ja}</p>
          </div>
        )}

        <p className="question-text">
          {isEnToJa ? '意味を選んでね' : '英単語を選んでね'}
        </p>

        <div className="choices">
          {current.choices.map((choice, i) => (
            <button
              key={i}
              className={`btn btn-choice ${
                selected !== null
                  ? i === current.answer
                    ? 'highlight'
                    : i === selected
                      ? 'wrong'
                      : ''
                  : ''
              }`}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              {choice}
            </button>
          ))}
        </div>

        {isWrong && (
          <>
            <div className="correct-reveal">
              正解は「<strong>{current.choices[current.answer]}</strong>」だよ
            </div>
            <div className="feedback incorrect">残念！ 意味を覚えよう 📖</div>
            <FeedbackContinueButton label="つぎの問題へ" onContinue={continueAfterWrong} />
          </>
        )}

        {selected !== null && selected === current.answer && (
          <div className="feedback correct">よくできた！ ✨</div>
        )}
      </div>
    </div>
  );
}
