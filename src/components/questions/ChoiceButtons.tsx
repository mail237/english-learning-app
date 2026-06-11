import { useMemo } from 'react';
import type { Feedback } from '../../types';
import { dedupeChoicesForDisplay, shuffleArray } from '../../utils/questionHelpers';

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
  const { dedupedChoices, dedupedAnswer } = useMemo(() => {
    const { choices: nextChoices, answerIndex } = dedupeChoicesForDisplay(choices, answer);
    return { dedupedChoices: nextChoices, dedupedAnswer: answerIndex };
  }, [choices, answer]);

  const display = useMemo(() => {
    const tagged = dedupedChoices.map((text, originalIndex) => ({ text, originalIndex }));
    if (!shuffleKey) return tagged;
    return shuffleArray(tagged);
  }, [shuffleKey, dedupedChoices]);

  const selectedDisplayIndex =
    selected !== null && shuffleKey
      ? display.findIndex((d) => d.originalIndex === selected)
      : selected;

  const answerDisplayIndex = shuffleKey
    ? display.findIndex((d) => d.originalIndex === dedupedAnswer)
    : dedupedAnswer;

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
