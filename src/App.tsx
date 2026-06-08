import { useState } from 'react';
import type { FullTestResult, Question, Screen, StudentData, TestAnswer } from './types';
import { loadStudent, saveSession, saveStudent } from './utils/storage';
import { calcOverallScore } from './utils/vocabTest';
import StartScreen from './components/StartScreen';
import UnitSelection from './components/UnitSelection';
import PracticeMode from './components/PracticeMode';
import PracticeComplete from './components/PracticeComplete';
import TestMode from './components/TestMode';
import VocabTestMode from './components/VocabTestMode';
import SpeakingCheck from './components/SpeakingCheck';
import TestResults from './components/TestResults';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [currentUnit, setCurrentUnit] = useState<number>(1);
  const [practiceAccuracy, setPracticeAccuracy] = useState(0);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [fullResult, setFullResult] = useState<FullTestResult | null>(null);

  const handleStart = (name: string) => {
    setStudent(loadStudent(name));
    setScreen('units');
  };

  const handleSelectUnit = (unit: number) => {
    if (!student) return;
    setCurrentUnit(unit);
    const status = student.unitProgress[unit]?.status ?? '未着手';

    if (status === '練習完了') {
      setScreen('practiceComplete');
    } else {
      const updated = {
        ...student,
        unitProgress: {
          ...student.unitProgress,
          [unit]: { ...student.unitProgress[unit], status: '練習中' as const },
        },
      };
      setStudent(updated);
      saveStudent(updated);
      setScreen('practice');
    }
  };

  const handlePracticeComplete = (accuracy: number, updatedStudent: StudentData) => {
    const updated: StudentData = {
      ...updatedStudent,
      unitProgress: {
        ...updatedStudent.unitProgress,
        [currentUnit]: {
          status: '練習完了',
          practiceAccuracy: accuracy,
        },
      },
    };
    setStudent(updated);
    saveStudent(updated);
    setPracticeAccuracy(accuracy);
    setScreen('practiceComplete');
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

  const handleSpeakingComplete = (results: { passed: boolean }[], accuracy: number) => {
    if (!student || !fullResult) return;

    const speakingPassed = results.filter((r) => r.passed).length;
    const speakingTotal = results.length;
    const vocabAcc = fullResult.vocabTotal === 0 ? fullResult.testAccuracy : fullResult.vocabAccuracy;
    const speakAcc = speakingTotal === 0 ? fullResult.testAccuracy : accuracy;
    const overallScore = calcOverallScore(fullResult.testAccuracy, vocabAcc, speakAcc);

    const result: FullTestResult = {
      ...fullResult,
      speakingPassed,
      speakingTotal,
      speakingAccuracy: speakAcc,
      overallScore,
    };

    setFullResult(result);

    const updated: StudentData = {
      ...student,
      unitProgress: {
        ...student.unitProgress,
        [currentUnit]: {
          status: 'テスト済',
          practiceAccuracy: student.unitProgress[currentUnit]?.practiceAccuracy,
          testAccuracy: result.testAccuracy,
          testDate: new Date().toISOString(),
        },
      },
    };
    setStudent(updated);
    saveStudent(updated);

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

    setScreen('testResults');
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

  return (
    <div className="app">
      {screen === 'start' && <StartScreen onStart={handleStart} />}

      {screen === 'units' && student && (
        <UnitSelection
          student={student}
          onSelectUnit={handleSelectUnit}
          onBack={handleFinish}
        />
      )}

      {screen === 'practice' && student && (
        <PracticeMode
          student={student}
          unit={currentUnit}
          onComplete={handlePracticeComplete}
          onBack={handleBackToUnits}
        />
      )}

      {screen === 'practiceComplete' && (
        <PracticeComplete onUnlock={handleTestUnlock} onBack={handleBackToUnits} />
      )}

      {screen === 'test' && (
        <TestMode unit={currentUnit} onComplete={handleTestComplete} />
      )}

      {screen === 'vocabTest' && (
        <VocabTestMode
          testQuestions={testQuestions}
          onComplete={handleVocabComplete}
        />
      )}

      {screen === 'speakingCheck' && (
        <SpeakingCheck
          testQuestions={testQuestions}
          onComplete={handleSpeakingComplete}
        />
      )}

      {screen === 'testResults' && fullResult && (
        <TestResults result={fullResult} onFinish={handleFinish} />
      )}
    </div>
  );
}

export default App;
