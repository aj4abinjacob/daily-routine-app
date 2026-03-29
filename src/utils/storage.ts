import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SetLog {
  weight: number;
  reps: number;
  type?: 'warmup' | 'feeler' | 'working'; // added — older logs won't have this
}

export interface SessionLog {
  date: string; // ISO string
  sets: SetLog[];
}

export interface ExerciseLog {
  logs: SessionLog[];       // last 8 sessions
  currentWeight: number | null; // progressed weight (null = use default)
}

const STORAGE_PREFIX = 'wlog_';

function key(dayId: string, exIndex: number): string {
  return `${STORAGE_PREFIX}${dayId}_${exIndex}`;
}

export async function loadLog(dayId: string, exIndex: number): Promise<ExerciseLog | null> {
  try {
    const raw = await AsyncStorage.getItem(key(dayId, exIndex));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveLog(dayId: string, exIndex: number, data: ExerciseLog): Promise<void> {
  await AsyncStorage.setItem(key(dayId, exIndex), JSON.stringify(data));
}

export async function loadAllLogsForDay(dayId: string, exerciseCount: number): Promise<(ExerciseLog | null)[]> {
  const results: (ExerciseLog | null)[] = [];
  for (let i = 0; i < exerciseCount; i++) {
    results.push(await loadLog(dayId, i));
  }
  return results;
}
