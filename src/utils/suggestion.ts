import { ExerciseSet } from '../data/exercises';

/** Inter-set fatigue factor: ~5% rep capacity loss per set */
const FATIGUE_FACTOR = 0.05;

/** Weight increment for drop suggestions */
const WEIGHT_STEP = 2.5;

export interface Suggestion {
  weight: number;
  reps: number;
  weightDropped: boolean;
}

/**
 * Parse RPE string into a numeric value.
 * "7" → 7.0, "8–9" / "8-9" → 8.5, "—" → null
 */
export function parseRPE(rpe: string): number | null {
  const trimmed = rpe.trim();
  if (!trimmed || trimmed === '—' || trimmed === '\u2014') return null;

  // Split on en-dash (U+2013) or hyphen
  const parts = trimmed.split(/[–\-]/);
  if (parts.length === 2) {
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);
    if (!isNaN(a) && !isNaN(b)) return (a + b) / 2;
  }

  const val = parseFloat(trimmed);
  return isNaN(val) ? null : val;
}

/**
 * Find the index of the next working set after `currentIndex`.
 * Returns -1 if there is no subsequent working set.
 */
export function findNextWorkingSetIndex(
  sets: ExerciseSet[],
  currentIndex: number,
): number {
  for (let i = currentIndex + 1; i < sets.length; i++) {
    if (sets[i].type === 'working') return i;
  }
  return -1;
}

/**
 * Check if this exercise uses bodyweight for working sets.
 */
export function isBWExercise(sets: ExerciseSet[]): boolean {
  return sets.some(
    (s) => s.type === 'working' && s.weight.trim().toUpperCase() === 'BW',
  );
}

/**
 * After logging a working set, predict the weight and reps for the next
 * working set based on RPE targets, inter-set fatigue, and rep range.
 *
 * Returns null if no suggestion can be made (e.g., warmup set, missing RPE,
 * last working set, or invalid inputs).
 */
export function suggestNextSet(
  loggedWeight: number,
  loggedReps: number,
  currentSetDef: ExerciseSet,
  nextSetDef: ExerciseSet,
  repRange: [number, number] | undefined,
  bw: boolean,
): Suggestion | null {
  // Only suggest working → working
  if (currentSetDef.type !== 'working' || nextSetDef.type !== 'working') {
    return null;
  }

  const currentRPE = parseRPE(currentSetDef.rpe);
  const nextRPE = parseRPE(nextSetDef.rpe);
  if (currentRPE === null || nextRPE === null) return null;
  if (loggedReps <= 0) return null;

  // Estimate max reps at RPE 10 for the set just logged
  const currentRIR = 10 - currentRPE;
  const maxReps = loggedReps + currentRIR;

  // Apply inter-set fatigue
  const fatigueAdjustedMax = maxReps * (1 - FATIGUE_FACTOR);

  // Predicted reps at next set's target RPE
  const nextRIR = 10 - nextRPE;
  let rawSuggestedReps = Math.floor(fatigueAdjustedMax - nextRIR);

  let suggestedWeight = loggedWeight;
  let weightDropped = false;

  // Check if reps fall below the rep range minimum
  if (repRange && rawSuggestedReps < repRange[0] && !bw) {
    // Drop weight by one increment, gain ~1 rep
    suggestedWeight = Math.max(WEIGHT_STEP, loggedWeight - WEIGHT_STEP);
    rawSuggestedReps += 1;
    weightDropped = true;
  }

  // Clamp to rep range
  let suggestedReps = rawSuggestedReps;
  if (repRange) {
    suggestedReps = Math.max(repRange[0], Math.min(repRange[1], suggestedReps));
  }

  if (suggestedReps <= 0) return null;

  return {
    weight: Math.round(suggestedWeight * 10) / 10, // avoid floating point
    reps: suggestedReps,
    weightDropped,
  };
}
