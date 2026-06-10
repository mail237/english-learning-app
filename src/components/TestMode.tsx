import { useEffect, useRef, useState } from 'react';
import type { Question, TestAnswer } from '../types';
import { TEST_QUESTION_COUNT } from '../data/constants';
import { getQuestionsByUnit } from '../data/questions';
import { speakSentence, stopSpeech } from '../utils/speech';
import { shuffleForTest } from '../utils/spiral';
import { getSpeechText, shouldAutoSpeak } from '../utils/questionHelpers';
import QuestionRenderer from './questions/QuestionRenderer';

interface Props {
  unit: number;
  onComplete: (answers: TestAnswer[], accuracy: number, questions: Question[]) => void;
}

export default function TestMode({ unit, onComplete }: Props) {
  const [questions] = useState<Question[]>(() =>
    shuffleForTest(getQuestionsByUnit(unit), TEST_QUESTION_COUNT),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setAnswers] = useState<TestAnswer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const currentIndexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  currentIndexRef.current = currentIndex;
  onCompleteRef.current = onComplete;

  const current = questions[currentIndex];

  useEffect(() => {
    if (current && shouldAutoSpeak(current)) {
      const text = getSpeechText(current);
      if (text) speakSentence(text);
    }
    return () => stopSpeech();
  }, [current]);

  const advance = (newAnswer: TestAnswer) => {
    setAnswers((prev) => {
      const newAnswers = [...prev, newAnswer];
      setTimeout(() => {
        const idx = currentIndexRef.current;
        if (idx + 1 >= questions.length) {
          const correctCount = newAnswers.filter((a) => a.correct).length;
          const accuracy = Math.round((correctCount / newAnswers.length) * 100);
          onCompleteRef.current(newAnswers, accuracy, questions);
        } else {
          setCurrentIndex(idx + 1);
          setSelectedIndex(null);
          setLocked(false);
        }
      }, 600);
      return newAnswers;
    });
  };

  const handleSelectIndex = (index: number) => {
    if (locked || selectedIndex !== null || !current || current.type === 'word-order') return;
    setLocked(true);
    setSelectedIndex(index);
    const isCorrect = index === current.answer;
    advance({ question: current, selected: index, correct: isCorrect });
  };

  const handleWordOrderCorrect = () => {
    if (locked || !current || current.type !== 'word-order') return;
    setLocked(true);
    advance({ question: current, selected: current.answer, correct: true });
  };

  const handleWordOrderWrong = (attempt?: string[]) => {
    if (locked || !current || current.type !== 'word-order') return;
    setLocked(true);
    advance({
      question: current,
      selected: attempt ?? [],
      correct: false,
    });
  };

  const handleReplay = () => {
    if (!current) return;
    const text = getSpeechText(current);
    if (text) speakSentence(text);
  };

  if (!current) {
    return (
      <div className="screen">
        <p>問題がありません</p>
      </div>
    );
  }

  return (
    <div className="screen test-screen">
      <header className="screen-header">
        <div className="test-info">
          <span className="test-badge">テスト</span>
          <span>
            {currentIndex + 1} / {questions.length} 問
          </span>
        </div>
        <p className="headphone-hint">🎧 イヤホンの使用をおすすめします</p>
      </header>

      <QuestionRenderer
        question={current}
        mode="test"
        feedback="none"
        showAnswer={selectedIndex !== null || locked}
        selectedIndex={selectedIndex}
        disabled={locked}
        onSelectIndex={handleSelectIndex}
        onWordOrderCorrect={handleWordOrderCorrect}
        onWordOrderWrong={handleWordOrderWrong}
        onReplay={handleReplay}
      />
    </div>
  );
}
