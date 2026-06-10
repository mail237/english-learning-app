import { useEffect, useMemo, useRef, useState } from 'react';
import type { PendingSpeakingBatch, SpeakingResult } from '../types';
import { speakSentence, stopSpeech } from '../utils/speech';
import { flattenPendingQueue, unitTitle } from '../utils/pendingSpeaking';

interface Props {
  batches: PendingSpeakingBatch[];
  onComplete: (resultsByBatchId: Record<string, SpeakingResult[]>) => void;
  onBack: () => void;
}

export default function SpeakingBatchMode({ batches, onComplete, onBack }: Props) {
  const queue = useMemo(() => flattenPendingQueue(batches), [batches]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const resultsByBatch = useRef<Record<string, SpeakingResult[]>>({});

  const current = queue[currentIndex];

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    if (queue.length === 0) {
      onComplete({});
    }
  }, [queue.length, onComplete]);

  const handleMark = (passed: boolean) => {
    if (locked || !current) return;
    setLocked(true);

    const result: SpeakingResult = {
      entry: current.item.entry,
      mode: current.item.mode,
      passed,
    };
    const batchResults = resultsByBatch.current[current.batchId] ?? [];
    resultsByBatch.current = {
      ...resultsByBatch.current,
      [current.batchId]: [...batchResults, result],
    };

    setTimeout(() => {
      if (currentIndex + 1 >= queue.length) {
        onComplete(resultsByBatch.current);
      } else {
        setCurrentIndex((i) => i + 1);
        setLocked(false);
      }
    }, 400);
  };

  const handleReplay = () => {
    if (current) speakSentence(current.item.entry.en);
  };

  if (queue.length === 0 || !current) return null;

  const isReadEn = current.item.mode === 'read-en';

  return (
    <div className="screen speaking-screen">
      <header className="screen-header speaking-header">
        <button className="btn btn-text" onClick={onBack}>
          ← もどる
        </button>
        <div className="test-info">
          <span className="test-badge test-badge-speaking">音読まとめて</span>
          <span>
            {currentIndex + 1} / {queue.length} 語
          </span>
        </div>
        <p className="headphone-hint">
          {unitTitle(current.unit)} · 先生が○×を押してね
        </p>
      </header>

      <div className="speaking-content">
        <p className="speaking-instruction">
          {isReadEn ? '英語を声に出して読もう' : '日本語を見て英語で言おう'}
        </p>

        <div className="speaking-word-display">
          {isReadEn ? (
            <p className="speaking-word-en">{current.item.entry.en}</p>
          ) : (
            <p className="speaking-word-ja">{current.item.entry.ja}</p>
          )}
        </div>

        <button className="btn btn-primary btn-large" onClick={handleReplay}>
          🔊 お手本を聞く（{current.item.entry.en}）
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

      <button
        type="button"
        className="btn btn-text speaking-skip"
        onClick={() => onComplete(resultsByBatch.current)}
        disabled={locked}
      >
        スキップして終わる
      </button>
    </div>
  );
}
