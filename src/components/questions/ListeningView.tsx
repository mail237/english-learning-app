import type { ListeningQuestion, Feedback } from '../../types';
import { speakWakeUpListening } from '../../utils/speech';
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
  const isWakeUp = question.question.includes('覚ま') || question.question.startsWith('⚡');
  const leadLabel = isWakeUp
    ? question.question
    : question.question === '聞こえた英文の意味はどれ？'
      ? '👂 英文を聞いて答えてね'
      : question.question;

  return (
    <>
      <div className={`listening-box${isWakeUp ? ' listening-box-wake' : ''}`}>
        <p className={`listening-label${isWakeUp ? ' listening-label-wake' : ''}`}>{leadLabel}</p>
        <button
          className={`btn btn-primary btn-large${isWakeUp ? ' btn-listening-wake' : ''}`}
          onClick={() => {
            if (isWakeUp) {
              void speakWakeUpListening(question.sentence);
            } else {
              onReplay();
            }
          }}
        >
          {isWakeUp ? '🐓 こけこっこー！' : '🔊 再生する'}
        </button>
      </div>

      {!isWakeUp && <p className="question-text">{question.question}</p>}

      {showAnswer && (
        <div className="correct-reveal">
          正解は「<strong>{question.choices[question.answer]}</strong>」だよ
          <br />
          <span className="review-sentence-inline">{question.sentence}</span>
        </div>
      )}

      {feedback === 'incorrect' && (
        <div className="feedback incorrect">残念！ 正解をよく読んでね 📖</div>
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
