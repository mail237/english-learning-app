import type { AppSettings, SessionRecord, StudentData, UnitProgress } from '../types';
import { UNITS } from '../data/units';

const STUDENT_PREFIX = 'english-app-student-';
const SETTINGS_KEY = 'english-app-settings';
const SESSIONS_KEY = 'english-app-sessions';

const DEFAULT_SETTINGS: AppSettings = {
  teacherPassword: 'teacher123',
};

function defaultUnitProgress(): Record<number, UnitProgress> {
  const progress: Record<number, UnitProgress> = {};
  for (const unit of UNITS) {
    progress[unit.number] = { status: '未着手' };
  }
  return progress;
}

export function loadStudent(name: string): StudentData {
  const raw = localStorage.getItem(STUDENT_PREFIX + name);
  if (!raw) {
    return { name, unitProgress: defaultUnitProgress(), questionStats: {} };
  }
  const data = JSON.parse(raw) as StudentData;
  const progress = { ...defaultUnitProgress(), ...data.unitProgress };
  return { ...data, name, unitProgress: progress };
}

export function saveStudent(data: StudentData): void {
  localStorage.setItem(STUDENT_PREFIX + data.name, JSON.stringify(data));
}

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function saveSession(record: SessionRecord): void {
  const sessions = loadSessions();
  sessions.push(record);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function loadSessions(): SessionRecord[] {
  const raw = localStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function isUnitUnlocked(student: StudentData, unitNumber: number): boolean {
  if (unitNumber === 1) return true;
  const prev = student.unitProgress[unitNumber - 1];
  return prev?.status === 'テスト済';
}
