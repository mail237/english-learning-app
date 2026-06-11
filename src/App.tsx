import { useEffect, useState } from 'react';
import type {
  FullTestResult,
  PendingSpeakingBatch,
  Question,
  Screen,
  SpeakingResult,
  StudentData,
  TestAnswer,
  VocabEntry,
} from './types';
import { loadStudent, refreshStudent, saveSession, saveStudent } from './utils/storage';
import {
  addPendingBatch,
  createPendingBatchId,
  getPendingBatches,
  removePendingBatches,
  summarizeBatchResults,
} from './utils/pendingSpeaking';
import { buildSpeakingItems, calcOverallScore } from './utils/vocabTest';
import StartScreen from './components/StartScreen';
import UnitSelection from './components/UnitSelection';
import PracticeMode from './components/PracticeMode';
import PracticeComplete from './components/PracticeComplete';
import StepComplete from './components/StepComplete';
import { STEPS_PER_UNIT } from './data/constants';
import { isTestPassed } from './utils/testPass';
import { getActiveStep, isAllPracticeDone } from './utils/unitProgress';
import TestMode from './components/TestMode';
import VocabTestMode from './components/VocabTestMode';
import SpeakingCheck from './components/SpeakingCheck';
import SpeakingBatchMode from './components/SpeakingBatchMode';
import TestResults from './components/TestResults';
import ReviewMode from './components/ReviewMode';
import { questionsFromWrongAnswers, uniqueQuestions } from './utils/review';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [currentUnit, setCurrentUnit] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedStep, setCompletedStep] = useState<number>(0);
  const [practiceAccuracy, setPracticeAccuracy] = useState(0);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [fullResult, setFullResult] = useState<FullTestResult | null>(null);
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([]);
  const [returnScreen, setReturnScreen] = useState<Screen>('testResults');
  const [sessionWrongQuestions, setSessionWrongQuestions] = useState<Question[]>([]);
  const [sessionVocab, setSessionVocab] = useState<VocabEntry[]>([]);

  const handleStart = async (name: string) => {
    const data = await loadStudent(name);
    setStudent(data);
    setScreen('units');
  };

  // 単元選択画面ではクラウドから最新進捗を取り込む（全iPadで共有）
  useEffect(() => {
    if (screen !== 'units' || !student) return;

    let cancelled = false;
    void refreshStudent(student.name).then((data) => {
      if (!cancelled) setStudent(data);
    });

    const syncFromCloud = () => {
      if (document.visibilityState !== 'visible' || screen !== 'units' || !student) return;
      void refreshStudent(student.name).then((data) => {
        setStudent((prev) => (prev?.name === data.name ? data : prev));
      });
    };

    window.addEventListener('focus', syncFromCloud);
    document.addEventListener('visibilitychange', syncFromCloud);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', syncFromCloud);
      document.removeEventListener('visibilitychange', syncFromCloud);
    };
  }, [screen, student?.name]);

  const handleSelectUnit = (unit: number) => {
    if (!student) return;
    setCurrentUnit(unit);
    const progress = student.unitProgress[unit];

    if (isAllPracticeDone(progress)) {
      setScreen('practiceComplete');
      return;
    }

    const step = getActiveStep(progress);
    setCurrentStep(step);

    if (progress?.status !== '練習中' && progress?.status !== 'テスト済') {
      const updated: StudentData = {
        ...student,
        unitProgress: {
          ...student.unitProgress,
          [unit]: {
            ...progress,
            status: '練習中',
            completedStep: progress?.completedStep ?? 0,
          },
        },
      };
      setStudent(updated);
      saveStudent(updated);
    }

    setScreen('practice');
  };

  const handlePracticeComplete = (
    accuracy: number,
    updatedStudent: StudentData,
    wrongQuestions: Question[],
    vocab: VocabEntry[],
  ) => {
    setSessionWrongQuestions(uniqueQuestions(wrongQuestions));
    setSessionVocab(vocab);
    const prev = updatedStudent.unitProgress[currentUnit];
    const newCompletedStep = currentStep;
    const allDone = newCompletedStep >= STEPS_PER_UNIT;

    const updated: StudentData = {
      ...updatedStudent,
      unitProgress: {
        ...updatedStudent.unitProgress,
        [currentUnit]: {
          ...prev,
          status: allDone ? '練習完了' : '練習中',
          completedStep: newCompletedStep,
          practiceAccuracy: accuracy,
        },
      },
    };
    setStudent(updated);
    saveStudent(updated);
    setPracticeAccuracy(accuracy);
    setCompletedStep(newCompletedStep);

    if (allDone) {
      setScreen('practiceComplete');
    } else {
      setScreen('stepComplete');
    }
  };

  const handleStepContinue = () => {
    const nextStep = completedStep + 1;
    setCurrentStep(nextStep);
    setScreen('practice');
  };

  const handleTestUnlock = () => {
    setScreen('test');
  };

  const handleTestComplete = (answers: TestAnswer[], accuracy: number, questions: Question[]) => {
    const testCorrect = answers.filter((a) => a.correct).length;

    setTestQuestions(questions);
    setFullResult({
      testCorrect,
      testTotal: answers.length,
      testAccuracy: accuracy,
      vocabCorrect: 0,
      vocabTotal: 0,
      vocabAccuracy: 0,
      speakingPassed: 0,
      speakingTotal: 0,
      speakingAccuracy: 0,
      overallScore: 0,
      wrongTestAnswers: answers.filter((a) => !a.correct),
    });
    setScreen('vocabTest');
  };

  const handleVocabComplete = (answers: { correct: boolean }[], accuracy: number) => {
    const vocabCorrect = answers.filter((a) => a.correct).length;
    const vocabTotal = answers.length;

    setFullResult((prev) =>
      prev
        ? { ...prev, vocabCorrect, vocabTotal, vocabAccuracy: accuracy }
        : null,
    );
    setScreen('speakingCheck');
  };

  const finalizeTestWithSpeaking = (
    speakingResults: SpeakingResult[],
    accuracy: number,
    options: { pending?: boolean; skipped?: boolean; skippedTotal?: number } = {},
  ) => {
    if (!student || !fullResult) return;

    const { pending = false, skipped = false, skippedTotal = 0 } = options;
    const vocabAcc = fullResult.vocabTotal === 0 ? fullResult.testAccuracy : fullResult.vocabAccuracy;

    let speakingPassed: number;
    let speakingTotal: number;
    let speakAcc: number;
    let overallScore: number;

    if (skipped) {
      speakingPassed = 0;
      speakingTotal = skippedTotal;
      speakAcc = 0;
      overallScore = Math.round((fullResult.testAccuracy + vocabAcc) / 2);
    } else if (pending) {
      speakingPassed = 0;
      speakingTotal = skippedTotal;
      speakAcc = 0;
      overallScore = Math.round((fullResult.testAccuracy + vocabAcc) / 2);
    } else {
      speakingPassed = speakingResults.filter((r) => r.passed).length;
      speakingTotal = speakingResults.length;
      speakAcc = speakingTotal === 0 ? fullResult.testAccuracy : accuracy;
      overallScore = calcOverallScore(fullResult.testAccuracy, vocabAcc, speakAcc);
    }

    const result: FullTestResult = {
      ...fullResult,
      speakingPassed,
      speakingTotal,
      speakingAccuracy: speakAcc,
      overallScore,
      speakingPending: pending,
      speakingSkipped: skipped,
      testPassed: isTestPassed({ overallScore }),
    };

    setFullResult(result);

    const prevProgress = student.unitProgress[currentUnit];
    const unitUpdate = result.testPassed
      ? {
          status: 'テスト済' as const,
          completedStep: STEPS_PER_UNIT,
          practiceAccuracy: prevProgress?.practiceAccuracy ?? practiceAccuracy,
          testAccuracy: result.testAccuracy,
          testDate: new Date().toISOString(),
        }
      : {
          status: '練習完了' as const,
          completedStep: STEPS_PER_UNIT,
          practiceAccuracy: prevProgress?.practiceAccuracy ?? practiceAccuracy,
          testAccuracy: result.testAccuracy,
        };

    const updated: StudentData = {
      ...student,
      unitProgress: {
        ...student.unitProgress,
        [currentUnit]: unitUpdate,
      },
    };
    setStudent(updated);
    saveStudent(updated);

    if (!pending && result.testPassed) {
      saveSession({
        studentName: student.name,
        unit: currentUnit,
        practiceAccuracy: student.unitProgress[currentUnit]?.practiceAccuracy ?? practiceAccuracy,
        testCorrect: result.testCorrect,
        testTotal: result.testTotal,
        testAccuracy: result.testAccuracy,
        vocabCorrect: result.vocabCorrect,
        vocabTotal: result.vocabTotal,
        vocabAccuracy: result.vocabAccuracy,
        speakingPassed: result.speakingPassed,
        speakingTotal: result.speakingTotal,
        speakingAccuracy: result.speakingAccuracy,
        overallScore: result.overallScore,
        date: new Date().toISOString(),
      });
    }

    setScreen('testResults');
  };

  const handleSpeakingComplete = (results: SpeakingResult[], accuracy: number) => {
    finalizeTestWithSpeaking(results, accuracy);
  };

  const handleSpeakingSkip = () => {
    const items = buildSpeakingItems(testQuestions, currentUnit);
    finalizeTestWithSpeaking([], 0, { skipped: true, skippedTotal: items.length });
  };

  const handleSpeakingDefer = () => {
    if (!student || !fullResult) return;

    const items = buildSpeakingItems(testQuestions, currentUnit);
    if (items.length === 0) {
      finalizeTestWithSpeaking([], 100);
      return;
    }

    const vocabAcc =
      fullResult.vocabTotal === 0 ? fullResult.testAccuracy : fullResult.vocabAccuracy;
    const projectedOverall = Math.round((fullResult.testAccuracy + vocabAcc) / 2);
    if (!isTestPassed({ overallScore: projectedOverall })) {
      finalizeTestWithSpeaking([], 0, { skipped: true, skippedTotal: items.length });
      return;
    }

    const batch: PendingSpeakingBatch = {
      id: createPendingBatchId(),
      unit: currentUnit,
      items,
      savedAt: new Date().toISOString(),
      testCorrect: fullResult.testCorrect,
      testTotal: fullResult.testTotal,
      testAccuracy: fullResult.testAccuracy,
      vocabCorrect: fullResult.vocabCorrect,
      vocabTotal: fullResult.vocabTotal,
      vocabAccuracy: fullResult.vocabAccuracy,
      practiceAccuracy: student.unitProgress[currentUnit]?.practiceAccuracy ?? practiceAccuracy,
    };

    const updated = addPendingBatch(
      {
        ...student,
        unitProgress: {
          ...student.unitProgress,
          [currentUnit]: {
            status: 'テスト済',
            practiceAccuracy: batch.practiceAccuracy,
            testAccuracy: fullResult.testAccuracy,
            testDate: new Date().toISOString(),
          },
        },
      },
      batch,
    );
    setStudent(updated);
    saveStudent(updated);

    setFullResult({
      ...fullResult,
      speakingPassed: 0,
      speakingTotal: items.length,
      speakingAccuracy: 0,
      overallScore: projectedOverall,
      speakingPending: true,
      testPassed: true,
    });
    setScreen('testResults');
  };

  const handleSpeakingBatchComplete = (resultsByBatchId: Record<string, SpeakingResult[]>) => {
    if (!student) return;

    const batches = getPendingBatches(student);
    for (const batch of batches) {
      const results = resultsByBatchId[batch.id] ?? [];
      if (results.length === 0) continue;

      const summary = summarizeBatchResults(batch, results);
      saveSession({
        studentName: student.name,
        unit: batch.unit,
        practiceAccuracy: batch.practiceAccuracy ?? 0,
        testCorrect: batch.testCorrect,
        testTotal: batch.testTotal,
        testAccuracy: batch.testAccuracy,
        vocabCorrect: batch.vocabCorrect,
        vocabTotal: batch.vocabTotal,
        vocabAccuracy: batch.vocabAccuracy,
        speakingPassed: summary.speakingPassed,
        speakingTotal: summary.speakingTotal,
        speakingAccuracy: summary.speakingAccuracy,
        overallScore: summary.overallScore,
        date: new Date().toISOString(),
      });
    }

    const updated = removePendingBatches(
      student,
      batches.map((b) => b.id),
    );
    setStudent(updated);
    saveStudent(updated);
    setScreen('units');
  };

  const handleFinish = () => {
    setScreen('start');
    setStudent(null);
    setFullResult(null);
    setTestQuestions([]);
  };

  const handleBackToUnits = () => {
    setScreen('units');
  };

  const startReview = (questions: Question[], returnTo: Screen) => {
    setReviewQuestions(uniqueQuestions(questions));
    setReturnScreen(returnTo);
    setScreen('review');
  };

  const handleReviewComplete = (updatedStudent: StudentData | null) => {
    if (updatedStudent) {
      setStudent(updatedStudent);
      saveStudent(updatedStudent);
    }
    setReviewQuestions([]);
    setScreen(returnScreen);
  };

  return (
    <div className="app">
      {screen === 'start' && <StartScreen onStart={handleStart} />}

      {screen === 'units' && student && (
        <UnitSelection
          student={student}
          onSelectUnit={handleSelectUnit}
          onStartSpeakingBatch={() => setScreen('speakingBatch')}
          onBack={handleFinish}
        />
      )}

      {screen === 'practice' && student && (
        <PracticeMode
          student={student}
          unit={currentUnit}
          step={currentStep}
          onComplete={handlePracticeComplete}
          onBack={handleBackToUnits}
        />
      )}

      {screen === 'stepComplete' && (
        <StepComplete
          completedStep={completedStep}
          wrongCount={sessionWrongQuestions.length}
          sessionVocab={sessionVocab}
          onContinue={handleStepContinue}
          onReview={() => startReview(sessionWrongQuestions, 'stepComplete')}
          onBack={handleBackToUnits}
        />
      )}

      {screen === 'practiceComplete' && (
        <PracticeComplete
          wrongCount={sessionWrongQuestions.length}
          onUnlock={handleTestUnlock}
          onReview={() => startReview(sessionWrongQuestions, 'practiceComplete')}
          onBack={handleBackToUnits}
        />
      )}

      {screen === 'test' && (
        <TestMode unit={currentUnit} onComplete={handleTestComplete} />
      )}

      {screen === 'vocabTest' && (
        <VocabTestMode
          testQuestions={testQuestions}
          unit={currentUnit}
          onComplete={handleVocabComplete}
        />
      )}

      {screen === 'speakingCheck' && (
        <SpeakingCheck
          testQuestions={testQuestions}
          unit={currentUnit}
          onComplete={handleSpeakingComplete}
          onDefer={handleSpeakingDefer}
          onSkip={handleSpeakingSkip}
        />
      )}

      {screen === 'speakingBatch' && student && (
        <SpeakingBatchMode
          batches={getPendingBatches(student)}
          onComplete={handleSpeakingBatchComplete}
          onBack={handleBackToUnits}
        />
      )}

      {screen === 'testResults' && fullResult && (
        <TestResults
          result={fullResult}
          onFinish={handleFinish}
          onBackToUnits={handleBackToUnits}
          onRetryTest={handleTestUnlock}
          onReview={() =>
            startReview(questionsFromWrongAnswers(fullResult.wrongTestAnswers), 'testResults')
          }
        />
      )}

      {screen === 'review' && (
        <ReviewMode
          questions={reviewQuestions}
          student={student}
          onComplete={handleReviewComplete}
          onBack={() => {
            setReviewQuestions([]);
            setScreen(returnScreen);
          }}
        />
      )}
    </div>
  );
}

export default App;
