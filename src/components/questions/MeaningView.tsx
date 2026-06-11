import type { MeaningQuestion, Feedback } from '../../types';
import ChoiceButtons from './ChoiceButtons';

interface Props {
  question: MeaningQuestion;
  feedback: Feedback;
  showAnswer: boolean;
  selected: number | null;
  disabled: boolean;
  onSelect: (index: number) => void;
  onReplay: () => void;
  showSentence: boolean;
}

export default function MeaningView({
  question,
  feedback,
  showAnswer,
  selected,
  disabled,
  onSelect,
  onReplay,
  showSentence,
}: Props) {
  return (
    <>
      {showSentence && (
        <div className="sentence-box">
          <p className="sentence">{question.sentence}</p>
          <button className="btn btn-icon" onClick={onReplay} title="もう一度聞く">
            🔊
          </button>
        </div>
      )}
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
        shuffleKey={question.id}
      />
    </>
  );
}
