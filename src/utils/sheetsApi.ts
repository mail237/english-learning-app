import type { SessionRecord, StudentData } from '../types';
import { STUDENTS } from '../data/students';

export interface SheetsConfig {
  url: string;
  secret?: string;
}

export type RemoteStudentProgress = Pick<
  StudentData,
  'unitProgress' | 'questionStats' | 'pendingSpeaking' | 'updatedAt'
>;

let cachedConfig: SheetsConfig | null | undefined;

export async function loadSheetsConfig(): Promise<SheetsConfig | null> {
  if (cachedConfig !== undefined) return cachedConfig;
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}sheets-config.json`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      cachedConfig = null;
      return null;
    }
    const data = (await res.json()) as SheetsConfig;
    if (!data.url?.trim()) {
      cachedConfig = null;
      return null;
    }
    cachedConfig = { url: data.url.trim(), secret: data.secret ?? '' };
    return cachedConfig;
  } catch {
    cachedConfig = null;
    return null;
  }
}

export function isSheetsEnabled(): boolean {
  return cachedConfig !== null && cachedConfig !== undefined;
}

function buildUrl(config: SheetsConfig, params: Record<string, string>): string {
  const url = new URL(config.url);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  if (config.secret) url.searchParams.set('secret', config.secret);
  return url.toString();
}

async function postJson(config: SheetsConfig, body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...body,
        secret: config.secret ?? '',
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.ok === true;
  } catch {
    return false;
  }
}

/** 設定ファイルがあり、API が実際に応答するか */
export async function verifySheetsConnection(): Promise<'connected' | 'configured' | 'offline'> {
  const config = await loadSheetsConfig();
  if (!config) return 'offline';

  try {
    const res = await fetch(buildUrl(config, { action: 'ping' }), { cache: 'no-store' });
    if (!res.ok) return 'configured';
    const data = await res.json();
    return data?.ok === true ? 'connected' : 'configured';
  } catch {
    return 'configured';
  }
}

function mergeStudentLists(remote: string[]): string[] {
  const seen = new Set(remote);
  const merged = [...remote];
  for (const name of STUDENTS) {
    if (!seen.has(name)) {
      seen.add(name);
      merged.push(name);
    }
  }
  return merged;
}

export async function fetchStudents(): Promise<string[]> {
  const config = await loadSheetsConfig();
  if (!config) return [...STUDENTS];

  try {
    const res = await fetch(buildUrl(config, { action: 'students' }), { cache: 'no-store' });
    if (!res.ok) return [...STUDENTS];
    const data = await res.json();
    if (data?.ok && Array.isArray(data.students) && data.students.length > 0) {
      return mergeStudentLists(data.students as string[]);
    }
  } catch {
    // fallback below
  }
  return [...STUDENTS];
}

export async function fetchStudentProgress(name: string): Promise<RemoteStudentProgress | null> {
  const config = await loadSheetsConfig();
  if (!config) return null;

  try {
    const res = await fetch(buildUrl(config, { action: 'progress', name }), {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.ok && data.data) {
      return data.data as RemoteStudentProgress;
    }
  } catch {
    return null;
  }
  return null;
}

export async function saveStudentProgressRemote(data: StudentData): Promise<boolean> {
  const config = await loadSheetsConfig();
  if (!config) return false;

  const payload: RemoteStudentProgress = {
    unitProgress: data.unitProgress,
    questionStats: data.questionStats,
    pendingSpeaking: data.pendingSpeaking ?? [],
    updatedAt: data.updatedAt,
  };

  return postJson(config, {
    action: 'saveProgress',
    name: data.name,
    data: payload,
  });
}

export async function saveSessionRemote(record: SessionRecord): Promise<void> {
  const config = await loadSheetsConfig();
  if (!config) return;

  try {
    await postJson(config, { action: 'saveSession', record });
  } catch {
    // local copy remains
  }
}
