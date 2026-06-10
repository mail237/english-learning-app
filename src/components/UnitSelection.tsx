import { UNITS } from '../data/units';
import type { StudentData } from '../types';
import { STEPS_PER_UNIT } from '../data/constants';
import { isUnitUnlocked } from '../utils/storage';
import { predictScore } from '../utils/scorePrediction';
import { formatStageLabel, getActiveStep, isAllPracticeDone } from '../utils/unitProgress';
import { countPendingWords } from '../utils/pendingSpeaking';

interface Props {
  student: StudentData;
  onSelectUnit: (unit: number) => void;
  onStartSpeakingBatch?: () => void;
  onBack: () => void;
}

export default function UnitSelection({
  student,
  onSelectUnit,
  onStartSpeakingBatch,
  onBack,
}: Props) {
  const predicted = predictScore(student.questionStats);
  const pendingWords = countPendingWords(student);

  return (
    <div className="screen unit-screen">
      <header className="screen-header">
        <button className="btn btn-text" onClick={onBack}>
          ← もどる
        </button>
        <h2>{student.name} さん</h2>
      </header>

      {pendingWords > 0 && onStartSpeakingBatch && (
        <button className="btn btn-primary btn-large pending-speaking-btn" onClick={onStartSpeakingBatch}>
          音読テストをまとめてやる（{pendingWords}語）
        </button>
      )}

      {predicted !== null && (
        <div className="score-prediction">
          <span className="prediction-label">得点予測</span>
          <span className="prediction-value">
            今の実力だと定期テストで約 <strong>{predicted}点</strong> とれるでしょう
          </span>
        </div>
      )}

      <div className="unit-list">
        {UNITS.map((unit) => {
          const progress = student.unitProgress[unit.number];
          const unlocked = isUnitUnlocked(student, unit.number);
          const status = progress?.status ?? '未着手';
          const stageDone = progress?.completedStep ?? 0;
          const activeStep = getActiveStep(progress);
          const stageText = isAllPracticeDone(progress)
            ? `全ステージ完了`
            : status === '未着手'
              ? formatStageLabel(1)
              : `${formatStageLabel(activeStep)}（${stageDone}/${STEPS_PER_UNIT}完了）`;

          return (
            <button
              key={unit.number}
              className={`unit-card ${unlocked ? '' : 'locked'} status-${status}`}
              onClick={() => unlocked && onSelectUnit(unit.number)}
              disabled={!unlocked}
            >
              <div className="unit-number">{unit.title}</div>
              <div className="unit-desc">{unit.description}</div>
              <div className="unit-stage">{unlocked ? stageText : ''}</div>
              <div className={`unit-status badge-${status}`}>
                {!unlocked ? '🔒 前の単元をクリアしよう' : status}
              </div>
              {progress?.testAccuracy !== undefined && (
                <div className="unit-score">テスト {progress.testAccuracy}%</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
