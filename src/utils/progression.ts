import { Exercise } from '../data/exercises';
import { SetLog, ExerciseLog } from './storage';

function roundTo(val: number, step: number): number {
  return Math.round(val / step) * step;
}

export interface ProgressionResult {
  triggered: boolean;
  newWeight: number | null;
  message: string | null;
}

/**
 * Check if the latest logged session meets progression criteria.
 * Returns new weight if progression triggered.
 */
export function checkProgression(
  exercise: Exercise,
  log: ExerciseLog,
  latestSets: SetLog[]
): ProgressionResult {
  const noProgress: ProgressionResult = { triggered: false, newWeight: null, message: null };

  if (!latestSets.length || !exercise.repRange) return noProgress;

  const [, rangeMax] = exercise.repRange;
  const currentWeight = latestSets[0].weight;

  // Check exercise-specific progression rule
  if (exercise.progression) {
    const { targetReps, nextWeight } = exercise.progression;
    const allHit = latestSets.every(
      (s, i) => s.reps >= (targetReps[i] ?? targetReps[targetReps.length - 1])
    );

    if (allHit) {
      if (currentWeight < nextWeight) {
        return {
          triggered: true,
          newWeight: nextWeight,
          message: `Weight up! ${currentWeight} → ${nextWeight} kg`,
        };
      }
      // Already past the rule's target — fall through to generic
    }
  }

  // Generic: all working sets hit top of rep range → +2.5 kg
  if (rangeMax && latestSets.every((s) => s.reps >= rangeMax)) {
    const newWeight = roundTo(currentWeight + 2.5, 2.5);
    return {
      triggered: true,
      newWeight,
      message: `Weight up! ${currentWeight} → ${newWeight} kg (hit ${Array(latestSets.length).fill(rangeMax).join('-')})`,
    };
  }

  return noProgress;
}

/**
 * Get the effective working weight for an exercise,
 * considering any stored progression.
 */
export function getEffectiveWeight(exercise: Exercise, log: ExerciseLog | null): number {
  if (log?.currentWeight) return log.currentWeight;

  // Parse default weight from first working set
  const workingSets = exercise.sets.filter((s) => s.type === 'working');
  if (!workingSets.length) return 0;
  const match = workingSets[0].weight.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}
