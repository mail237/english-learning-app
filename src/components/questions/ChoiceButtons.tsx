import type { Feedback } from '../../types';

interface Props {
  choices: string[];
  answer: number;
  selected: number | null;
  feedback: Feedback;
  showAnswer: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
  variant?: 'default' | 'sentence';
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
}: Props) {
  return (
    <div className="choices">
      {choices.map((choice, i) => (
        <button
          key={i}
          className={`btn btn-choice ${variant === 'sentence' ? 'btn-choice-sentence' : ''} ${
            (showAnswer || feedback === 'correct') && i === answer
              ? 'highlight'
              : selected !== null && i === selected && i !== answer
                ? 'wrong'
                : ''
          }`}
          onClick={() => onSelect(i)}
          disabled={disabled || feedback !== 'none'}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
