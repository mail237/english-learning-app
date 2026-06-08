import type { ErrorDetectionQuestion, Feedback } from '../../types';
import ChoiceButtons from './ChoiceButtons';

interface Props {
  question: ErrorDetectionQuestion;
  feedback: Feedback;
  showAnswer: boolean;
  selected: number | null;
  disabled: boolean;
  onSelect: (index: number) => void;
  onReplay: () => void;
}

export default function ErrorDetectionView({
  question,
  feedback,
  showAnswer,
  selected,
  disabled,
  onSelect,
  onReplay,
}: Props) {
  return (
    <>
      <div className="sentence-box sentence-box-compact">
        <p className="question-text">{question.question}</p>
        <button className="btn btn-icon" onClick={onReplay} title="もう一度聞く">
          🔊
        </button>
      </div>

      {showAnswer && (
        <div className="correct-reveal">
          正解は「<strong>{question.choices[question.answer]}</strong>」だよ
        </div>
      )}

      {feedback === 'correct' && (
        <div className="feedback correct">よくできた！ ✨</div>
      )}

      <ChoiceButtons
        choices={question.choices}
        answer={question.answer}
        selected={selected}
        feedback={feedback}
        showAnswer={showAnswer}
        disabled={disabled}
        onSelect={onSelect}
        variant="sentence"
      />
    </>
  );
}
