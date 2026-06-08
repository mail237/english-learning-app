import type { ListeningQuestion, Feedback } from '../../types';
import ChoiceButtons from './ChoiceButtons';

interface Props {
  question: ListeningQuestion;
  feedback: Feedback;
  showAnswer: boolean;
  selected: number | null;
  disabled: boolean;
  onSelect: (index: number) => void;
  onReplay: () => void;
}

export default function ListeningView({
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
      <div className="listening-box">
        <p className="listening-label">👂 英文を聞いて答えてね</p>
        <button className="btn btn-primary btn-large" onClick={onReplay}>
          🔊 再生する
        </button>
      </div>

      <p className="question-text">{question.question}</p>

      {showAnswer && (
        <div className="correct-reveal">
          正解は「<strong>{question.choices[question.answer]}</strong>」だよ
          <br />
          <span className="review-sentence-inline">{question.sentence}</span>
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
