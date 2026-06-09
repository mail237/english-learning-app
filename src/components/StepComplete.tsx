import { STEPS_PER_UNIT } from '../data/constants';
import { formatStageLabel } from '../utils/unitProgress';

interface Props {
  completedStep: number;
  onContinue: () => void;
  onBack: () => void;
}

export default function StepComplete({ completedStep, onContinue, onBack }: Props) {
  const nextStep = completedStep + 1;

  return (
    <div className="screen complete-screen">
      <div className="celebration">
        <div className="celebration-icon">⭐</div>
        <h2>{formatStageLabel(completedStep)} クリア！</h2>
        <p className="complete-message">
          {nextStep <= STEPS_PER_UNIT
            ? `次は ${formatStageLabel(nextStep)} に進もう`
            : 'すべてのステージをクリアしたよ'}
        </p>
      </div>

      <button className="btn btn-primary btn-large" onClick={onContinue}>
        {formatStageLabel(nextStep)} をはじめる
      </button>

      <button className="btn btn-text" onClick={onBack}>
        単元選択にもどる
      </button>
    </div>
  );
}
