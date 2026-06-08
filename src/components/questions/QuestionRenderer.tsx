import type { Question, Feedback, QuestionMode } from '../../types';
import MeaningView from './MeaningView';
import WordOrderView from './WordOrderView';
import FillInView from './FillInView';
import JpToEnView from './JpToEnView';
import ListeningView from './ListeningView';
import ErrorDetectionView from './ErrorDetectionView';
import { getTypeLabel } from '../../utils/questionHelpers';

interface Props {
  question: Question;
  mode: QuestionMode;
  feedback: Feedback;
  showAnswer: boolean;
  selectedIndex: number | null;
  disabled: boolean;
  onSelectIndex: (index: number) => void;
  onWordOrderCorrect: () => void;
  onWordOrderWrong: (attempt?: string[]) => void;
  onReplay: () => void;
  showTypeBadge?: boolean;
}

export default function QuestionRenderer({
  question,
  mode,
  feedback,
  showAnswer,
  selectedIndex,
  disabled,
  onSelectIndex,
  onWordOrderCorrect,
  onWordOrderWrong,
  onReplay,
  showTypeBadge = false,
}: Props) {
  const commonChoiceProps = {
    feedback,
    showAnswer,
    selected: selectedIndex,
    disabled,
    onSelect: onSelectIndex,
    onReplay,
  };

  return (
    <div className="question-area">
      {showTypeBadge && (
        <span className="type-badge">{getTypeLabel(question.type)}</span>
      )}

      {question.type === 'meaning' && (
        <MeaningView
          question={question}
          {...commonChoiceProps}
          showSentence={mode === 'practice' || question.showText}
        />
      )}

      {question.type === 'word-order' && (
        <WordOrderView
          question={question}
          feedback={feedback}
          showAnswer={showAnswer}
          mode={mode}
          disabled={disabled}
          onCorrect={onWordOrderCorrect}
          onWrong={onWordOrderWrong}
          onReplay={onReplay}
        />
      )}

      {question.type === 'fill-in' && (
        <FillInView question={question} {...commonChoiceProps} />
      )}

      {question.type === 'jp-to-en' && (
        <JpToEnView question={question} {...commonChoiceProps} />
      )}

      {question.type === 'listening' && (
        <ListeningView question={question} {...commonChoiceProps} />
      )}

      {question.type === 'error-detection' && (
        <ErrorDetectionView question={question} {...commonChoiceProps} />
      )}
    </div>
  );
}
