import { useEffect, useState } from 'react';
import { STUDENTS } from '../data/students';
import { loadSettings, saveSettings } from '../utils/storage';
import { preloadVoices } from '../utils/speech';
import { fetchStudents, verifySheetsConnection } from '../utils/sheetsApi';

interface Props {
  onStart: (name: string) => void;
}

export default function StartScreen({ onStart }: Props) {
  const [name, setName] = useState('');
  const [students, setStudents] = useState<string[]>([...STUDENTS]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'loading' | 'connected' | 'configured' | 'offline'>(
    'loading',
  );
  const [showTeacher, setShowTeacher] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [teacherMsg, setTeacherMsg] = useState('');

  useEffect(() => {
    const warmUp = () => preloadVoices();
    window.addEventListener('pointerdown', warmUp, { once: true });
    return () => window.removeEventListener('pointerdown', warmUp);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const status = await verifySheetsConnection();
      const list = await fetchStudents();
      if (!cancelled) {
        setSyncStatus(status);
        setStudents(list);
        setLoadingStudents(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStart = () => {
    if (name) {
      preloadVoices();
      onStart(name);
    }
  };

  const handleTeacherLogin = () => {
    const settings = loadSettings();
    if (password === settings.teacherPassword) {
      setShowTeacher(true);
      setTeacherMsg('');
    } else {
      setTeacherMsg('パスワードが違います');
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 4) {
      setTeacherMsg('4文字以上にしてください');
      return;
    }
    saveSettings({ teacherPassword: newPassword });
    setNewPassword('');
    setTeacherMsg('パスワードを変更しました！');
  };

  return (
    <div className="screen start-screen">
      <div className="hero">
        <h1>英語学習アプリ</h1>
        <p className="subtitle">英文の意味をたくさん体験しよう！</p>
        {syncStatus === 'connected' && (
          <p className="sheets-status sheets-status-ok">☁️ 全iPadで進捗を共有中</p>
        )}
        {syncStatus === 'configured' && (
          <p className="sheets-status sheets-status-warn">
            ⚠️ クラウド同期できていません（先生に連絡）
          </p>
        )}
      </div>

      <div className="card">
        <label htmlFor="student-select" className="label">
          名前を選んでね
        </label>
        <select
          id="student-select"
          className="select-large"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loadingStudents}
        >
          <option value="">
            {loadingStudents ? '読み込み中...' : '--- 選んでください ---'}
          </option>
          {students.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary btn-large"
          onClick={handleStart}
          disabled={!name || loadingStudents}
        >
          はじめる
        </button>
      </div>

      <details className="teacher-section">
        <summary>先生用設定</summary>
        {!showTeacher ? (
          <div className="teacher-login">
            <input
              type="password"
              className="input"
              placeholder="先生パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={handleTeacherLogin}>
              ログイン
            </button>
            {teacherMsg && <p className="msg error">{teacherMsg}</p>}
          </div>
        ) : (
          <div className="teacher-settings">
            <p>新しいパスワードを設定</p>
            <input
              type="password"
              className="input"
              placeholder="新しいパスワード"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={handlePasswordChange}>
              変更する
            </button>
            {teacherMsg && <p className="msg success">{teacherMsg}</p>}
          </div>
        )}
      </details>
    </div>
  );
}
