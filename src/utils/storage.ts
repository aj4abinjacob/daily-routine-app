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

/** A single exercise's data within a session, for history display */
export interface HistoryExerciseEntry {
  name: string;
  workingSets: SetLog[];
  allSets: SetLog[];
  currentWeight: number | null;
}

/** A full workout session across all exercises for a day */
export interface HistorySession {
  date: string;
  dayId: string;
  dayTitle: string;
  exercises: HistoryExerciseEntry[];
  totalVolume: number; // working sets only: sum(weight * reps)
}

/** Load all workout history across all days, sorted newest first */
export async function loadHistory(
  days: { id: string; title: string; exercises: { name: string }[] }[],
): Promise<HistorySession[]> {
  const sessions: HistorySession[] = [];

  for (const day of days) {
    // Group sessions by date for this day
    const dateMap = new Map<string, HistoryExerciseEntry[]>();

    for (let i = 0; i < day.exercises.length; i++) {
      const log = await loadLog(day.id, i);
      if (!log?.logs?.length) continue;

      for (const session of log.logs) {
        const dateKey = session.date.slice(0, 10); // YYYY-MM-DD
        if (!dateMap.has(dateKey)) dateMap.set(dateKey, []);
        const workingSets = session.sets.filter(
          (s) => s.type === 'working' || (!s.type && true), // older logs without type
        );
        dateMap.get(dateKey)!.push({
          name: day.exercises[i].name,
          workingSets,
          allSets: session.sets,
          currentWeight: log.currentWeight,
        });
      }
    }

    // Convert to HistorySession array
    for (const [dateKey, exercises] of dateMap) {
      const totalVolume = exercises.reduce(
        (sum, ex) =>
          sum +
          ex.workingSets.reduce((s, set) => s + set.weight * set.reps, 0),
        0,
      );
      sessions.push({
        date: dateKey,
        dayId: day.id,
        dayTitle: day.title,
        exercises,
        totalVolume,
      });
    }
  }

  // Sort newest first
  sessions.sort((a, b) => b.date.localeCompare(a.date));
  return sessions;
}

/** Delete a session by removing its dated entry from every exercise log for that day */
export async function deleteSession(
  dayId: string,
  dateKey: string, // YYYY-MM-DD
  exerciseCount: number,
): Promise<void> {
  for (let i = 0; i < exerciseCount; i++) {
    const log = await loadLog(dayId, i);
    if (!log?.logs?.length) continue;

    const filtered = log.logs.filter(
      (s) => s.date.slice(0, 10) !== dateKey,
    );
    if (filtered.length !== log.logs.length) {
      log.logs = filtered;
      await saveLog(dayId, i, log);
    }
  }
}
