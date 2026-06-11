import { useState } from 'react';
import type { VocabTestItem } from '../types';
import { speakSentence } from '../utils/speech';
import FeedbackContinueButton from './FeedbackContinueButton';

interface Props {
  item: VocabTestItem;
  onDone: () => void;
}

/** 練習の合間に挟む、短い単語おさらい */
export default function VocabCheckpoint({ item, onDone }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const isEnToJa = item.direction === 'en-to-ja';

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === item.answer) {
      setTimeout(onDone, 800);
    }
  };

  const isCorrect = selected !== null && selected === item.answer;
  const isWrong = selected !== null && selected !== item.answer;

  return (
    <div className="screen vocab-checkpoint-screen">
      <header className="screen-header">
        <span className="checkpoint-badge">単語おさらい</span>
      </header>

      <div className="question-area">
        <p className="checkpoint-lead">さっきの問題で出てきた単語だよ</p>

        {isEnToJa ? (
          <div className="vocab-prompt-box">
            <p className="vocab-word-en">{item.entry.en}</p>
            <button
              className="btn btn-icon"
              onClick={() => speakSentence(item.entry.en)}
              title="もう一度聞く"
            >
              🔊
            </button>
          </div>
        ) : (
          <div className="japanese-box">
            <p className="japanese-text">{item.entry.ja}</p>
          </div>
        )}

        <p className="question-text">
          {isEnToJa ? '意味を選んでね' : '英単語を選んでね'}
        </p>

        <div className="choices">
          {item.choices.map((choice, i) => (
            <button
              key={i}
              className={`btn btn-choice ${
                selected !== null
                  ? i === item.answer
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
              正解は「<strong>{item.choices[item.answer]}</strong>」だよ
            </div>
            <div className="feedback incorrect">残念！ 意味を覚えよう 📖</div>
            <FeedbackContinueButton label="つぎへ" onContinue={onDone} />
          </>
        )}

        {isCorrect && <div className="feedback correct">よくできた！ ✨</div>}

        <button type="button" className="btn btn-text checkpoint-skip" onClick={onDone}>
          スキップして練習を続ける
        </button>
      </div>
    </div>
  );
}
