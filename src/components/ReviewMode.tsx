import { useEffect, useRef, useState } from 'react';
import type { Feedback, Question, QuestionStats, StudentData } from '../types';
import { speakSentence, stopSpeech } from '../utils/speech';
import { getSpeechText, shouldAutoSpeak } from '../utils/questionHelpers';
import QuestionRenderer from './questions/QuestionRenderer';

interface Props {
  questions: Question[];
  student: StudentData | null;
  onComplete: (updatedStudent: StudentData | null) => void;
  onBack: () => void;
}

export default function ReviewMode({ questions, student, onComplete, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [updatedStudent, setUpdatedStudent] = useState<StudentData | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const statsRef = useRef<Record<string, QuestionStats>>(
    student ? { ...student.questionStats } : {},
  );

  const current = questions[currentIndex];

  useEffect(() => {
    if (current && shouldAutoSpeak(current)) {
      const text = getSpeechText(current);
      if (text) speakSentence(text);
    }
    return () => stopSpeech();
  }, [current]);

  const updateStats = (questionId: string, isCorrect: boolean) => {
    const existing = statsRef.current[questionId] ?? { correctCount: 0, incorrectCount: 0 };
    statsRef.current = {
      ...statsRef.current,
      [questionId]: {
        correctCount: existing.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: existing.incorrectCount + (isCorrect ? 0 : 1),
      },
    };
  };

  const advance = (isCorrect: boolean) => {
    if (!current) return;
    updateStats(current.id, isCorrect);
    setCorrectCount((prev) => prev + (isCorrect ? 1 : 0));

    setTimeout(() => {
      setCurrentIndex((idx) => {
        if (idx + 1 >= questions.length) {
          setFinished(true);
          setUpdatedStudent(
            student ? { ...student, questionStats: { ...statsRef.current } } : null,
          );
          return idx;
        }
        return idx + 1;
      });
      setFeedback('none');
      setShowAnswer(false);
      setSelectedIndex(null);
      setLocked(false);
    }, isCorrect ? 800 : 1500);
  };

  const handleSelectIndex = (index: number) => {
    if (locked || !current || current.type === 'word-order') return;
    setLocked(true);
    setSelectedIndex(index);
    const isCorrect = index === current.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) setShowAnswer(true);
    advance(isCorrect);
  };

  const handleWordOrderCorrect = () => {
    if (locked || !current || current.type !== 'word-order') return;
    setLocked(true);
    setFeedback('correct');
    advance(true);
  };

  const handleWordOrderWrong = (attempt?: string[]) => {
    if (locked || !current || current.type !== 'word-order') return;
    setLocked(true);
    setFeedback('incorrect');
    setShowAnswer(true);
    void attempt;
    advance(false);
  };

  const handleReplay = () => {
    if (!current) return;
    const text = getSpeechText(current);
    if (text) speakSentence(text);
  };

  if (questions.length === 0) {
    return (
      <div className="screen">
        <p>復習する問題がありません</p>
        <button className="btn btn-primary" onClick={() => onComplete(student)}>
          もどる
        </button>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="screen complete-screen">
        <div className="celebration">
          <div className="celebration-icon">📖</div>
          <h2>復習完了！</h2>
          <p className="complete-message">
            {questions.length}問中 <strong>{correctCount}問正解</strong>（{accuracy}%）
          </p>
        </div>
        <button className="btn btn-primary btn-large" onClick={() => onComplete(updatedStudent)}>
          もどる
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="screen review-screen">
      <header className="screen-header">
        <button className="btn btn-text" onClick={onBack}>
          ← もどる
        </button>
        <div className="test-info">
          <span className="test-badge test-badge-review">復習</span>
          <span>
            {currentIndex + 1} / {questions.length} 問
          </span>
        </div>
      </header>

      <QuestionRenderer
        question={current}
        mode="test"
        feedback={feedback}
        showAnswer={showAnswer}
        selectedIndex={selectedIndex}
        disabled={locked}
        onSelectIndex={handleSelectIndex}
        onWordOrderCorrect={handleWordOrderCorrect}
        onWordOrderWrong={handleWordOrderWrong}
        onReplay={handleReplay}
        showTypeBadge
        showVocabHint
      />
    </div>
  );
}
