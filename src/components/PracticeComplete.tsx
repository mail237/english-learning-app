import { useState } from 'react';
import { loadSettings } from '../utils/storage';

interface Props {
  wrongCount?: number;
  onUnlock: () => void;
  onReview?: () => void;
  onBack: () => void;
}

export default function PracticeComplete({
  wrongCount = 0,
  onUnlock,
  onReview,
  onBack,
}: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = loadSettings();
    if (password === settings.teacherPassword) {
      onUnlock();
    } else {
      setError('パスワードが違います。先生に確認してね');
    }
  };

  return (
    <div className="screen complete-screen">
      <div className="celebration">
        <div className="celebration-icon">🎉</div>
        <h2>練習完了！</h2>
        <p className="complete-message">先生のところへ持っていこう！</p>
      </div>

      {wrongCount > 0 && onReview && (
        <button type="button" className="btn btn-secondary btn-large" onClick={onReview}>
          間違えた問題を復習する（{wrongCount}問）
        </button>
      )}

      <form className="card password-form" onSubmit={handleSubmit}>
        <label htmlFor="teacher-password" className="label">
          先生パスワード
        </label>
        <input
          id="teacher-password"
          type="password"
          className="input input-large"
          placeholder="先生が入力してね"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
        />
        {error && <p className="msg error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-large">
          テストをはじめる
        </button>
      </form>

      <button className="btn btn-text" onClick={onBack}>
        単元選択にもどる
      </button>
    </div>
  );
}
