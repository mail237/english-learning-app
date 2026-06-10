import { useEffect, useState } from 'react';
import type { Question, SpeakingResult } from '../types';
import { speakSentence, stopSpeech } from '../utils/speech';
import { buildSpeakingItems } from '../utils/vocabTest';

interface Props {
  testQuestions: Question[];
  unit: number;
  onComplete: (results: SpeakingResult[], accuracy: number) => void;
  onDefer: () => void;
}

export default function SpeakingCheck({ testQuestions, unit, onComplete, onDefer }: Props) {
  const [items] = useState(() => buildSpeakingItems(testQuestions, unit));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SpeakingResult[]>([]);
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
    return () => stopSpeech();
  }, []);

  const handleMark = (passed: boolean) => {
    if (locked || !current) return;
    setLocked(true);

    const newResult: SpeakingResult = {
      entry: current.entry,
      mode: current.mode,
      passed,
    };
    const newResults = [...results, newResult];

    setTimeout(() => {
      if (currentIndex + 1 >= items.length) {
        const passedCount = newResults.filter((r) => r.passed).length;
        const accuracy =
          newResults.length > 0
            ? Math.round((passedCount / newResults.length) * 100)
            : 100;
        onComplete(newResults, accuracy);
      } else {
        setResults(newResults);
        setCurrentIndex((i) => i + 1);
        setLocked(false);
      }
    }, 400);
  };

  const handleReplay = () => {
    if (current) speakSentence(current.entry.en);
  };

  if (items.length === 0 || !current) return null;

  const isReadEn = current.mode === 'read-en';

  return (
    <div className="screen speaking-screen">
      <header className="screen-header speaking-header">
        <div className="test-info">
          <span className="test-badge test-badge-speaking">スピーキング</span>
          <span>
            {currentIndex + 1} / {items.length} 語
          </span>
        </div>
        <p className="headphone-hint">先生が○×を押してね</p>
      </header>

      <div className="speaking-content">
        <p className="speaking-instruction">
          {isReadEn ? '英語を声に出して読もう' : '日本語を見て英語で言おう'}
        </p>

        <div className="speaking-word-display">
          {isReadEn ? (
            <p className="speaking-word-en">{current.entry.en}</p>
          ) : (
            <p className="speaking-word-ja">{current.entry.ja}</p>
          )}
        </div>

        <button className="btn btn-primary btn-large" onClick={handleReplay}>
          🔊 お手本を聞く（{current.entry.en}）
        </button>
      </div>

      <div className="speaking-buttons">
        <button
          className="btn btn-speaking btn-speaking-pass"
          onClick={() => handleMark(true)}
          disabled={locked}
        >
          ○
        </button>
        <button
          className="btn btn-speaking btn-speaking-fail"
          onClick={() => handleMark(false)}
          disabled={locked}
        >
          ×
        </button>
      </div>

      <button className="btn btn-secondary btn-large speaking-defer-btn" onClick={onDefer}>
        あとでまとめてやる
      </button>
      <p className="speaking-defer-note">時間がないときは単元選択からまとめてできます</p>
    </div>
  );
}
