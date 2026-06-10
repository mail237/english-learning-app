import type { AppSettings, SessionRecord, StudentData, UnitProgress } from '../types';
import { UNITS } from '../data/units';
import { normalizeUnitProgress } from './unitProgress';
import {
  fetchStudentProgress,
  isSheetsEnabled,
  loadSheetsConfig,
  saveSessionRemote,
  saveStudentProgressRemote,
} from './sheetsApi';

const STUDENT_PREFIX = 'english-app-student-';
const SETTINGS_KEY = 'english-app-settings';
const SESSIONS_KEY = 'english-app-sessions';

const DEFAULT_SETTINGS: AppSettings = {
  teacherPassword: '1987',
};

function defaultUnitProgress(): Record<number, UnitProgress> {
  const progress: Record<number, UnitProgress> = {};
  for (const unit of UNITS) {
    progress[unit.number] = { status: '未着手', completedStep: 0 };
  }
  return progress;
}

function mergeUnitProgress(
  stored: Record<number, UnitProgress> | undefined,
): Record<number, UnitProgress> {
  const merged = { ...defaultUnitProgress(), ...stored };
  for (const unit of UNITS) {
    merged[unit.number] = normalizeUnitProgress(merged[unit.number]);
  }
  return merged;
}

function normalizeStudent(name: string, raw: Partial<StudentData> | null | undefined): StudentData {
  if (!raw) {
    return { name, unitProgress: defaultUnitProgress(), questionStats: {}, pendingSpeaking: [] };
  }
  return {
    name,
    unitProgress: mergeUnitProgress(raw.unitProgress),
    questionStats: raw.questionStats ?? {},
    pendingSpeaking: raw.pendingSpeaking ?? [],
    updatedAt: raw.updatedAt,
  };
}

function hasSavedProgress(data: StudentData): boolean {
  const hasUnits = Object.values(data.unitProgress).some(
    (p) => p.status !== '未着手' || (p.completedStep ?? 0) > 0,
  );
  const hasStats = Object.keys(data.questionStats).length > 0;
  const hasPending = (data.pendingSpeaking?.length ?? 0) > 0;
  return hasUnits || hasStats || hasPending;
}

function progressTimestamp(data: StudentData): number {
  const parsed = data.updatedAt ? Date.parse(data.updatedAt) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

/** 新しい方を採用（同時刻ならクラウド優先） */
function pickNewerStudent(local: StudentData, remote: StudentData): StudentData {
  const localTime = progressTimestamp(local);
  const remoteTime = progressTimestamp(remote);
  if (remoteTime > localTime) return remote;
  if (localTime > remoteTime) return local;
  return remote;
}

export function loadStudentLocal(name: string): StudentData {
  const raw = localStorage.getItem(STUDENT_PREFIX + name);
  if (!raw) {
    return normalizeStudent(name, null);
  }
  return normalizeStudent(name, JSON.parse(raw) as Partial<StudentData>);
}

export async function loadStudent(name: string): Promise<StudentData> {
  await loadSheetsConfig();
  const local = loadStudentLocal(name);

  if (!isSheetsEnabled()) {
    return local;
  }

  const remoteRaw = await fetchStudentProgress(name);
  if (!remoteRaw) {
    if (hasSavedProgress(local)) {
      const stamped = { ...local, updatedAt: local.updatedAt ?? new Date().toISOString() };
      saveStudentLocal(stamped);
      void saveStudentProgressRemote(stamped);
      return stamped;
    }
    return local;
  }

  const remote = normalizeStudent(name, remoteRaw);
  const winner = pickNewerStudent(local, remote);
  saveStudentLocal(winner);

  if (winner === local && progressTimestamp(local) >= progressTimestamp(remote)) {
    void saveStudentProgressRemote(winner);
  }

  return winner;
}

export function saveStudentLocal(data: StudentData): void {
  localStorage.setItem(STUDENT_PREFIX + data.name, JSON.stringify(data));
}

export function saveStudent(data: StudentData): void {
  const stamped: StudentData = { ...data, updatedAt: new Date().toISOString() };
  saveStudentLocal(stamped);
  void saveStudentProgressRemote(stamped);
}

/** 単元選択などでクラウドから最新を取り込む */
export async function refreshStudent(name: string): Promise<StudentData> {
  return loadStudent(name);
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
  void saveSessionRemote(record);
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
