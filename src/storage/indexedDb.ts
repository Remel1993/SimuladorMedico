import {
  ActiveSimulationSession,
  ClinicalCase,
  GameMode,
  PerformanceStats,
  SavedCaseRecord,
  Specialty,
  UserPreferences,
} from '../types/clinical';

const DB_NAME = 'SimuladorMedicoDB';
const DB_VERSION = 1;

const STORES = {
  HISTORY: 'history',
  ACTIVE_SESSION: 'active_session',
  PROGRESS: 'user_progress',
  PREFERENCES: 'preferences',
  CUSTOM_CASES: 'custom_cases',
} as const;

const LEGACY_KEYS = {
  HISTORY: 'mcs_case_history_v1',
  SEEN_IDS: 'mcs_seen_case_ids_v1',
  SEEN_DIAGS: 'mcs_seen_diagnoses_v1',
};

export interface StoredProgress {
  id: 'default';
  seenCaseIds: string[];
  seenDiagnoses: string[];
  completedCaseIds: string[];
  updatedAt: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredMode: 'medico_general',
  preferredSpecialty: 'aleatorio',
  ttsEnabled: false,
  updatedAt: new Date(0).toISOString(),
};

const DEFAULT_PROGRESS: StoredProgress = {
  id: 'default',
  seenCaseIds: [],
  seenDiagnoses: [],
  completedCaseIds: [],
  updatedAt: new Date(0).toISOString(),
};

let dbPromise: Promise<IDBDatabase | null> | null = null;

function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!isIndexedDBAvailable()) return Promise.resolve(null);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORES.HISTORY)) {
          db.createObjectStore(STORES.HISTORY, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.ACTIVE_SESSION)) {
          db.createObjectStore(STORES.ACTIVE_SESSION, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          db.createObjectStore(STORES.PROGRESS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
          db.createObjectStore(STORES.PREFERENCES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.CUSTOM_CASES)) {
          db.createObjectStore(STORES.CUSTOM_CASES, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          dbPromise = null;
        };
        resolve(db);
      };

      request.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to memory/localStorage', request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn('Failed to initialize IndexedDB', err);
      resolve(null);
    }
  });

  return dbPromise;
}

function requestToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/**
 * Migra datos existentes desde localStorage hacia IndexedDB una sola vez.
 */
export async function migrateLegacyLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return;
  const db = await openDatabase();
  if (!db) return;

  try {
    const existingHistory = await getAllHistoryRecords();
    const rawHistory = window.localStorage.getItem(LEGACY_KEYS.HISTORY);
    if (existingHistory.length === 0 && rawHistory) {
      const parsed = JSON.parse(rawHistory) as SavedCaseRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const tx = db.transaction(STORES.HISTORY, 'readwrite');
        const store = tx.objectStore(STORES.HISTORY);
        for (const rec of parsed) {
          if (rec?.id) store.put(rec);
        }
        await txDone(tx);
      }
    }

    const currentProgress = await getStoredProgress();
    if (currentProgress.seenCaseIds.length === 0 && currentProgress.seenDiagnoses.length === 0) {
      let seenIds: string[] = [];
      let seenDiags: string[] = [];

      const rawIds = window.localStorage.getItem(LEGACY_KEYS.SEEN_IDS);
      if (rawIds) {
        const parsed = JSON.parse(rawIds);
        if (Array.isArray(parsed)) seenIds = parsed.filter(Boolean);
      }
      const rawDiags = window.localStorage.getItem(LEGACY_KEYS.SEEN_DIAGS);
      if (rawDiags) {
        const parsed = JSON.parse(rawDiags);
        if (Array.isArray(parsed)) seenDiags = parsed.filter(Boolean);
      }

      if (seenIds.length > 0 || seenDiags.length > 0) {
        await saveStoredProgress({
          ...DEFAULT_PROGRESS,
          seenCaseIds: seenIds,
          seenDiagnoses: seenDiags,
          completedCaseIds: Array.from(new Set(existingHistory.map((h) => h.caseId).filter(Boolean))),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn('Legacy localStorage migration skipped:', err);
  }
}

export async function getAllHistoryRecords(): Promise<SavedCaseRecord[]> {
  const db = await openDatabase();
  if (!db) {
    try {
      const raw = window.localStorage.getItem(LEGACY_KEYS.HISTORY);
      return raw ? (JSON.parse(raw) as SavedCaseRecord[]) : [];
    } catch {
      return [];
    }
  }

  try {
    const tx = db.transaction(STORES.HISTORY, 'readonly');
    const store = tx.objectStore(STORES.HISTORY);
    const items = await requestToPromise<SavedCaseRecord[]>(store.getAll());
    return (items || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function saveHistoryRecord(record: SavedCaseRecord): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    try {
      const prev = await getAllHistoryRecords();
      window.localStorage.setItem(LEGACY_KEYS.HISTORY, JSON.stringify([record, ...prev]));
    } catch {
      // Ignore quota errors
    }
    return;
  }

  const tx = db.transaction(STORES.HISTORY, 'readwrite');
  tx.objectStore(STORES.HISTORY).put(record);
  await txDone(tx);
}

export async function clearAllHistoryRecords(): Promise<void> {
  try {
    window.localStorage.removeItem(LEGACY_KEYS.HISTORY);
  } catch {
    // Ignore
  }

  const db = await openDatabase();
  if (!db) return;

  const tx = db.transaction(STORES.HISTORY, 'readwrite');
  tx.objectStore(STORES.HISTORY).clear();
  await txDone(tx);
}

export async function getStoredProgress(): Promise<StoredProgress> {
  const db = await openDatabase();
  if (!db) return DEFAULT_PROGRESS;

  try {
    const tx = db.transaction(STORES.PROGRESS, 'readonly');
    const res = await requestToPromise<StoredProgress | undefined>(tx.objectStore(STORES.PROGRESS).get('default'));
    return res || DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveStoredProgress(progress: StoredProgress): Promise<void> {
  try {
    window.localStorage.setItem(LEGACY_KEYS.SEEN_IDS, JSON.stringify(progress.seenCaseIds));
    window.localStorage.setItem(LEGACY_KEYS.SEEN_DIAGS, JSON.stringify(progress.seenDiagnoses));
  } catch {
    // Ignore
  }

  const db = await openDatabase();
  if (!db) return;

  const tx = db.transaction(STORES.PROGRESS, 'readwrite');
  tx.objectStore(STORES.PROGRESS).put({ ...progress, id: 'default', updatedAt: new Date().toISOString() });
  await txDone(tx);
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const db = await openDatabase();
  if (!db) return DEFAULT_PREFERENCES;

  try {
    const tx = db.transaction(STORES.PREFERENCES, 'readonly');
    const res = await requestToPromise<(UserPreferences & { id: string }) | undefined>(
      tx.objectStore(STORES.PREFERENCES).get('default')
    );
    if (!res) return DEFAULT_PREFERENCES;
    return {
      preferredMode: res.preferredMode || 'medico_general',
      preferredSpecialty: res.preferredSpecialty || 'aleatorio',
      ttsEnabled: Boolean(res.ttsEnabled),
      updatedAt: res.updatedAt || new Date().toISOString(),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function saveUserPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  const current = await getUserPreferences();
  const next: UserPreferences = {
    preferredMode: (prefs.preferredMode || current.preferredMode) as GameMode,
    preferredSpecialty: (prefs.preferredSpecialty || current.preferredSpecialty) as Specialty,
    ttsEnabled: prefs.ttsEnabled !== undefined ? prefs.ttsEnabled : current.ttsEnabled,
    updatedAt: new Date().toISOString(),
  };

  const db = await openDatabase();
  if (db) {
    const tx = db.transaction(STORES.PREFERENCES, 'readwrite');
    tx.objectStore(STORES.PREFERENCES).put({ id: 'default', ...next });
    await txDone(tx);
  }
  return next;
}

export async function getActiveSimulationSession(): Promise<ActiveSimulationSession | null> {
  const db = await openDatabase();
  if (!db) return null;

  try {
    const tx = db.transaction(STORES.ACTIVE_SESSION, 'readonly');
    const res = await requestToPromise<ActiveSimulationSession | undefined>(
      tx.objectStore(STORES.ACTIVE_SESSION).get('current')
    );
    return res || null;
  } catch {
    return null;
  }
}

export async function saveActiveSimulationSession(session: ActiveSimulationSession): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  try {
    const tx = db.transaction(STORES.ACTIVE_SESSION, 'readwrite');
    tx.objectStore(STORES.ACTIVE_SESSION).put({
      ...session,
      id: 'current',
      updatedAt: new Date().toISOString(),
    });
    await txDone(tx);
  } catch {
    // Ignore transient IDB write issues
  }
}

export async function clearActiveSimulationSession(): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  try {
    const tx = db.transaction(STORES.ACTIVE_SESSION, 'readwrite');
    tx.objectStore(STORES.ACTIVE_SESSION).delete('current');
    await txDone(tx);
  } catch {
    // Ignore
  }
}

export async function getCustomCases(): Promise<ClinicalCase[]> {
  const db = await openDatabase();
  if (!db) return [];

  try {
    const tx = db.transaction(STORES.CUSTOM_CASES, 'readonly');
    const res = await requestToPromise<ClinicalCase[]>(tx.objectStore(STORES.CUSTOM_CASES).getAll());
    return res || [];
  } catch {
    return [];
  }
}

export async function saveCustomCase(customCase: ClinicalCase): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  const tx = db.transaction(STORES.CUSTOM_CASES, 'readwrite');
  tx.objectStore(STORES.CUSTOM_CASES).put(customCase);
  await txDone(tx);
}

export async function deleteCustomCase(caseId: string): Promise<void> {
  const db = await openDatabase();
  if (!db) return;

  const tx = db.transaction(STORES.CUSTOM_CASES, 'readwrite');
  tx.objectStore(STORES.CUSTOM_CASES).delete(caseId);
  await txDone(tx);
}

export function computePerformanceStats(history: SavedCaseRecord[]): PerformanceStats {
  if (history.length === 0) {
    return {
      totalCompleted: 0,
      averageScore: 0,
      bestScore: 0,
      excellentCount: 0,
      totalSafetyErrors: 0,
      lastActivityAt: null,
    };
  }

  const totalScore = history.reduce((acc, item) => acc + (item.score || 0), 0);
  const bestScore = history.reduce((max, item) => Math.max(max, item.score || 0), 0);
  const excellentCount = history.filter((item) => item.score >= 90).length;
  const totalSafetyErrors = history.reduce(
    (acc, item) => acc + (item.evaluation?.criticalSafetyErrors?.length || 0),
    0
  );

  return {
    totalCompleted: history.length,
    averageScore: Math.round(totalScore / history.length),
    bestScore,
    excellentCount,
    totalSafetyErrors,
    lastActivityAt: history[0]?.date || null,
  };
}
