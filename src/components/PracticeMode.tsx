import { useCallback, useEffect, useRef, useState } from 'react';
import type { Feedback, Question, QuestionStats, StudentData, VocabEntry, VocabTestItem } from '../types';
import { VOCAB_CHECKPOINT_INTERVAL } from '../data/constants';
import { getQuestionsByUnitAndStep } from '../data/questions';
import { getVocabForQuestion } from '../data/vocab';
import { formatStageLabel } from '../utils/unitProgress';
import { speakSentence, stopSpeech } from '../utils/speech';
import { buildPracticePool, pickNextQuestion } from '../utils/spiral';
import { getSpeechText, shouldAutoSpeak } from '../utils/questionHelpers';
import { buildCheckpointItem, mergeVocabEntries } from '../utils/vocabTest';
import QuestionRenderer from './questions/QuestionRenderer';
import VocabCheckpoint from './VocabCheckpoint';

interface Props {
  student: StudentData;
  unit: number;
  step: number;
  onComplete: (
    accuracy: number,
    updatedStudent: StudentData,
    wrongQuestions: Question[],
    sessionVocab: VocabEntry[],
  ) => void;
  onBack: () => void;
}

export default function PracticeMode({ student, unit, step, onComplete, onBack }: Props) {
  const unitQuestions = getQuestionsByUnitAndStep(unit, step);
  const pool = useRef(buildPracticePool(unit, step)).current;
  const initialRemaining = useRef(new Set(unitQuestions.map((q) => q.id)));
  const remainingRef = useRef(initialRemaining.current);
  const [remaining, setRemaining] = useState(() => new Set(initialRemaining.current));
  const [current, setCurrent] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('none');
  const statsRef = useRef<Record<string, QuestionStats>>({ ...student.questionStats });
  const sessionStatsRef = useRef({ correct: 0, total: 0 });
  const [, setSessionStats] = useState({ correct: 0, total: 0 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const answered = useRef(false);
  const wrongQuestionsRef = useRef<Map<string, Question>>(new Map());
  const sessionVocabRef = useRef<VocabEntry[]>([]);
  const [sessionVocabCount, setSessionVocabCount] = useState(0);
  const lastQuestionIdRef = useRef<string | null>(null);
  const questionsSinceCheckpoint = useRef(0);
  const [checkpoint, setCheckpoint] = useState<VocabTestItem | null>(null);
  const studentRef = useRef(student);
  const onCompleteRef = useRef(onComplete);

  studentRef.current = student;
  onCompleteRef.current = onComplete;

  const totalUnitQuestions = unitQuestions.length;
  const completedCount = totalUnitQuestions - remaining.size;

  const syncRemaining = (next: Set<string>) => {
    remainingRef.current = next;
    setRemaining(next);
  };

  const absorbVocab = (question: Question) => {
    const vocab = getVocabForQuestion(question.id, question.vocab);
    sessionVocabRef.current = mergeVocabEntries(sessionVocabRef.current, vocab);
    setSessionVocabCount(sessionVocabRef.current.length);
  };

  const completeStage = useCallback(() => {
    const { correct, total } = sessionStatsRef.current;
    const accuracy = Math.round((correct / Math.max(total, 1)) * 100);
    const updatedStudent: StudentData = {
      ...studentRef.current,
      questionStats: { ...statsRef.current },
    };
    onCompleteRef.current(
      accuracy,
      updatedStudent,
      Array.from(wrongQuestionsRef.current.values()),
      sessionVocabRef.current,
    );
  }, []);

  const loadNext = useCallback(() => {
    const rem = remainingRef.current;
    if (rem.size === 0) {
      completeStage();
      return;
    }

    const next = pickNextQuestion(pool, rem, statsRef.current, lastQuestionIdRef.current);
    if (!next) {
      completeStage();
      return;
    }

    lastQuestionIdRef.current = next.id;
    setCurrent(next);
    setFeedback('none');
    setShowAnswer(false);
    setSelectedIndex(null);
    answered.current = false;
  }, [pool, completeStage]);

  const maybeShowCheckpoint = useCallback(
    (onSkip: () => void) => {
      questionsSinceCheckpoint.current += 1;
      if (
        questionsSinceCheckpoint.current >= VOCAB_CHECKPOINT_INTERVAL &&
        sessionVocabRef.current.length >= 3
      ) {
        const item = buildCheckpointItem(sessionVocabRef.current);
        if (item) {
          questionsSinceCheckpoint.current = 0;
          setCheckpoint(item);
          return;
        }
      }
      onSkip();
    },
    [],
  );

  useEffect(() => {
    loadNext();
    return () => stopSpeech();
  }, [loadNext]);

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
    absorbVocab(current);
    setFeedback('correct');
    const newRemaining = new Set(remainingRef.current);
    newRemaining.delete(current.id);
    syncRemaining(newRemaining);

    setTimeout(() => {
      if (newRemaining.size === 0) {
        completeStage();
      } else {
        maybeShowCheckpoint(loadNext);
      }
    }, 800);
  };

  const finishIncorrect = () => {
    if (!current) return;
    absorbVocab(current);
    wrongQuestionsRef.current.set(current.id, current);
    setFeedback('incorrect');
    setShowAnswer(true);
    setTimeout(() => {
      maybeShowCheckpoint(loadNext);
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
    wrongQuestionsRef.current.set(current.id, current);
    recordAttempt(false);
    updateStats(current.id, false);
  };

  const handleWordOrderSkip = () => {
    if (!current || answered.current) return;
    answered.current = true;
    absorbVocab(current);
    wrongQuestionsRef.current.set(current.id, current);
    recordAttempt(false);
    updateStats(current.id, false);
    finishIncorrect();
  };

  const handleReplay = () => {
    if (!current) return;
    const text = getSpeechText(current);
    if (text) speakSentence(text);
  };

  if (checkpoint) {
    return (
      <VocabCheckpoint
        item={checkpoint}
        onDone={() => {
          setCheckpoint(null);
          loadNext();
        }}
      />
    );
  }

  if (!current) {
    return (
      <div className="screen">
        <p>問題を読み込み中...</p>
        <button className="btn btn-secondary" onClick={loadNext}>
          つぎの問題へ
        </button>
        <button className="btn btn-text" onClick={onBack}>
          単元選択にもどる
        </button>
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
          {sessionVocabCount > 0 && (
            <span className="vocab-session-count">単語 {sessionVocabCount}</span>
          )}
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
        onWordOrderSkip={handleWordOrderSkip}
        onReplay={handleReplay}
        showTypeBadge
        showVocabHint
      />
    </div>
  );
}
