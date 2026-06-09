import { useCallback, useEffect, useRef, useState } from 'react';
import type { Feedback, Question, QuestionStats, StudentData } from '../types';
import { getQuestionsByUnitAndStep } from '../data/questions';
import { formatStageLabel } from '../utils/unitProgress';
import { speakSentence, stopSpeech } from '../utils/speech';
import { buildPracticePool, pickNextQuestion } from '../utils/spiral';
import { getSpeechText, shouldAutoSpeak } from '../utils/questionHelpers';
import QuestionRenderer from './questions/QuestionRenderer';

interface Props {
  student: StudentData;
  unit: number;
  step: number;
  onComplete: (accuracy: number, updatedStudent: StudentData) => void;
  onBack: () => void;
}

export default function PracticeMode({ student, unit, step, onComplete, onBack }: Props) {
  const unitQuestions = getQuestionsByUnitAndStep(unit, step);
  const pool = useRef(buildPracticePool(unit, step)).current;
  const [remaining, setRemaining] = useState(() => new Set(unitQuestions.map((q) => q.id)));
  const [current, setCurrent] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('none');
  const statsRef = useRef<Record<string, QuestionStats>>({ ...student.questionStats });
  const sessionStatsRef = useRef({ correct: 0, total: 0 });
  const [, setSessionStats] = useState({ correct: 0, total: 0 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const answered = useRef(false);

  const totalUnitQuestions = unitQuestions.length;
  const completedCount = totalUnitQuestions - remaining.size;

  const loadNext = useCallback(() => {
    const next = pickNextQuestion(pool, remaining, statsRef.current);
    setCurrent(next);
    setFeedback('none');
    setShowAnswer(false);
    setSelectedIndex(null);
    answered.current = false;
  }, [pool, remaining]);

  useEffect(() => {
    loadNext();
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    if (current && shouldAutoSpeak(current)) {
      const text = getSpeechText(current);
      if (text) speakSentence(text);
    }
  }, [current]);

  const recordAttempt = (isCorrect: boolean) => {
    sessionStatsRef.current = {
      correct: sessionStatsRef.current.correct + (isCorrect ? 1 : 0),
      total: sessionStatsRef.current.total + 1,
    };
    setSessionStats({ ...sessionStatsRef.current });
  };

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

  const finishCorrect = () => {
    if (!current) return;
    setFeedback('correct');
    const newRemaining = new Set(remaining);
    newRemaining.delete(current.id);
    setRemaining(newRemaining);

    setTimeout(() => {
      if (newRemaining.size === 0) {
        const { correct, total } = sessionStatsRef.current;
        const accuracy = Math.round((correct / Math.max(total, 1)) * 100);
        const updatedStudent: StudentData = {
          ...student,
          questionStats: { ...statsRef.current },
        };
        onComplete(accuracy, updatedStudent);
      } else {
        loadNext();
      }
    }, 800);
  };

  const finishIncorrect = () => {
    if (!current) return;
    setFeedback('incorrect');
    setShowAnswer(true);
    setTimeout(() => {
      loadNext();
    }, 1500);
  };

  const handleSelectIndex = (index: number) => {
    if (!current || answered.current || feedback !== 'none') return;
    if (current.type === 'word-order') return;

    answered.current = true;
    setSelectedIndex(index);
    const isCorrect = index === current.answer;
    recordAttempt(isCorrect);
    updateStats(current.id, isCorrect);

    if (isCorrect) {
      finishCorrect();
    } else {
      finishIncorrect();
    }
  };

  const handleWordOrderCorrect = () => {
    if (!current || answered.current) return;
    answered.current = true;
    recordAttempt(true);
    updateStats(current.id, true);
    finishCorrect();
  };

  const handleWordOrderWrong = () => {
    if (!current) return;
    recordAttempt(false);
    updateStats(current.id, false);
  };

  const handleReplay = () => {
    if (!current) return;
    const text = getSpeechText(current);
    if (text) speakSentence(text);
  };

  if (!current) {
    return (
      <div className="screen">
        <p>問題を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="screen practice-screen">
      <header className="screen-header">
        <button className="btn btn-text" onClick={onBack}>
          ← もどる
        </button>
        <div className="progress-info">
          <span className="stage-badge">{formatStageLabel(step)}</span>
          あと <strong>{remaining.size}</strong> 問
          <span className="progress-bar-wrap">
            <span
              className="progress-bar"
              style={{ width: `${(completedCount / totalUnitQuestions) * 100}%` }}
            />
          </span>
        </div>
      </header>

      <QuestionRenderer
        question={current}
        mode="practice"
        feedback={feedback}
        showAnswer={showAnswer}
        selectedIndex={selectedIndex}
        disabled={answered.current && current.type !== 'word-order'}
        onSelectIndex={handleSelectIndex}
        onWordOrderCorrect={handleWordOrderCorrect}
        onWordOrderWrong={handleWordOrderWrong}
        onReplay={handleReplay}
        showTypeBadge
      />
    </div>
  );
}
