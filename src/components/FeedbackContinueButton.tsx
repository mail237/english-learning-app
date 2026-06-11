interface Props {
  onContinue: () => void;
  label?: string;
}

/** 不正解時に解説を読んでから進むためのボタン */
export default function FeedbackContinueButton({
  onContinue,
  label = '答えを確認した → つぎへ',
}: Props) {
  return (
    <button type="button" className="btn btn-primary btn-large feedback-continue" onClick={onContinue}>
      {label}
    </button>
  );
}
