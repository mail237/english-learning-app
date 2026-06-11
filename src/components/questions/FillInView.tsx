import type { FillInQuestion, Feedback } from '../../types';
import { formatFillInSentence } from '../../utils/questionHelpers';
import ChoiceButtons from './ChoiceButtons';

interface Props {
  question: FillInQuestion;
  feedback: Feedback;
  showAnswer: boolean;
  selected: number | null;
  disabled: boolean;
  onSelect: (index: number) => void;
  onReplay: () => void;
}

export default function FillInView({
  question,
  feedback,
  showAnswer,
  selected,
  disabled,
  onSelect,
  onReplay,
}: Props) {
  const displayWord =
    selected !== null
      ? question.choices[selected]
      : showAnswer
        ? question.choices[question.answer]
        : null;
  const displaySentence = displayWord
    ? formatFillInSentence(question.sentence, displayWord)
    : question.sentence;

  return (
    <>
      <div className="sentence-box">
        <p className="sentence">{displaySentence}</p>
        <button className="btn btn-icon" onClick={onReplay} title="もう一度聞く">
          🔊
        </button>
      </div>

      <p className="question-text">{question.question}</p>

      {showAnswer && (
        <div className="correct-reveal">
          正解は「<strong>{formatFillInSentence(question.sentence, question.choices[question.answer])}</strong>」だよ
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
      />
    </>
  );
}
