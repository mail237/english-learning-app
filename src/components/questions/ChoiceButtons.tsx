import { useMemo } from 'react';
import type { Feedback } from '../../types';
import { shuffleArray } from '../../utils/questionHelpers';

interface Props {
  choices: string[];
  answer: number;
  selected: number | null;
  feedback: Feedback;
  showAnswer: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
  variant?: 'default' | 'sentence';
  /** 指定すると選択肢の並びをランダム化（同じ問題でも毎回ちがう） */
  shuffleKey?: string;
}

export default function ChoiceButtons({
  choices,
  answer,
  selected,
  feedback,
  showAnswer,
  disabled,
  onSelect,
  variant = 'default',
  shuffleKey,
}: Props) {
  const display = useMemo(() => {
    if (!shuffleKey) {
      return choices.map((text, originalIndex) => ({ text, originalIndex }));
    }
    return shuffleArray(choices.map((text, originalIndex) => ({ text, originalIndex })));
  }, [shuffleKey, choices, answer]);

  const selectedDisplayIndex =
    selected !== null && shuffleKey
      ? display.findIndex((d) => d.originalIndex === selected)
      : selected;

  const answerDisplayIndex = shuffleKey
    ? display.findIndex((d) => d.originalIndex === answer)
    : answer;

  return (
    <div className="choices">
      {display.map((item, i) => (
        <button
          key={`${shuffleKey ?? 'fixed'}-${item.text}-${i}`}
          className={`btn btn-choice ${variant === 'sentence' ? 'btn-choice-sentence' : ''} ${
            (showAnswer || feedback === 'correct') && i === answerDisplayIndex
              ? 'highlight'
              : selectedDisplayIndex !== null && i === selectedDisplayIndex && i !== answerDisplayIndex
                ? 'wrong'
                : ''
          }`}
          onClick={() => onSelect(item.originalIndex)}
          disabled={disabled || feedback !== 'none'}
        >
          {item.text}
        </button>
      ))}
    </div>
  );
}
