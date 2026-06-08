import type { JpToEnQuestion, Feedback } from '../../types';
import ChoiceButtons from './ChoiceButtons';

interface Props {
  question: JpToEnQuestion;
  feedback: Feedback;
  showAnswer: boolean;
  selected: number | null;
  disabled: boolean;
  onSelect: (index: number) => void;
  onReplay: () => void;
}

export default function JpToEnView({
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
      <div className="japanese-box">
        <p className="japanese-text">{question.japanese}</p>
        <button className="btn btn-icon" onClick={onReplay} title="英文を聞く">
          🔊
        </button>
      </div>

      <p className="question-text">{question.question}</p>

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
