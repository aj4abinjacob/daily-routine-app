import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { Exercise, ExerciseSet } from '../data/exercises';
import { ExerciseLog, SetLog, saveLog } from '../utils/storage';
import { checkProgression, getEffectiveWeight } from '../utils/progression';
import { suggestNextSet, findNextWorkingSetIndex, isBWExercise } from '../utils/suggestion';
import { colors } from '../theme';

interface Props {
  exercise: Exercise;
  dayId: string;
  exIndex: number;
  log: ExerciseLog | null;
  onLogSaved: (log: ExerciseLog) => void;
}

/** Parse rest string like "60s", "90s", "2 min", "2.5 min" into seconds */
function parseRestSeconds(rest: string): number {
  const trimmed = rest.trim().toLowerCase();
  if (trimmed.endsWith('min')) {
    const num = parseFloat(trimmed);
    return isNaN(num) ? 60 : Math.round(num * 60);
  }
  if (trimmed.endsWith('s')) {
    const num = parseFloat(trimmed);
    return isNaN(num) ? 60 : num;
  }
  const num = parseFloat(trimmed);
  return isNaN(num) ? 60 : num;
}

/** Parse weight string like "42.5 kg", "BW", "12.5 kg" into a number string */
function parseWeight(w: string): string {
  const match = w.match(/[\d.]+/);
  return match ? match[0] : '0';
}

/** Format seconds as M:SS */
function formatTimer(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LogPanel({ exercise, dayId, exIndex, log, onLogSaved }: Props) {
  const allSets = exercise.sets;
  const effectiveWeight = getEffectiveWeight(exercise, log);

  // Per-set input state
  const [weightInputs, setWeightInputs] = useState<string[]>(() =>
    allSets.map((s) =>
      s.type === 'working' ? String(effectiveWeight) : parseWeight(s.weight)
    )
  );
  const [repsInputs, setRepsInputs] = useState<string[]>(() =>
    allSets.map(() => '')
  );
  const [loggedSets, setLoggedSets] = useState<boolean[]>(() =>
    new Array(allSets.length).fill(false)
  );
  const [suggestedSets, setSuggestedSets] = useState<boolean[]>(() =>
    new Array(allSets.length).fill(false)
  );

  // Track whether we've created a session entry in storage
  const sessionRef = useRef(false);

  // Rest timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerSetIndex, setTimerSetIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Feedback
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'progress' | 'error'>('success');

  const lastSession = log?.logs?.[log.logs.length - 1] ?? null;

  // Update working set weights when progression changes
  useEffect(() => {
    const ew = getEffectiveWeight(exercise, log);
    setWeightInputs((prev) =>
      allSets.map((s, i) =>
        s.type === 'working' ? String(ew) : prev[i]
      )
    );
  }, [log?.currentWeight]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          try { Vibration.vibrate(500); } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const startTimer = useCallback((setIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const restSec = parseRestSeconds(allSets[setIndex].rest);
    setTimerSetIndex(setIndex);
    setTimerSeconds(restSec);
    setTimerActive(true);
  }, [allSets]);

  const skipTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    setTimerSeconds(0);
  };

  const addTime = (extra: number) => {
    setTimerSeconds((prev) => prev + extra);
  };

  /** Persist the current logged sets to storage */
  const persistSession = async (nextLogged: boolean[]) => {
    const sets: SetLog[] = [];
    for (let i = 0; i < allSets.length; i++) {
      if (!nextLogged[i]) continue;
      sets.push({
        reps: parseInt(repsInputs[i]) || 0,
        weight: parseFloat(weightInputs[i]) || 0,
        type: allSets[i].type,
      });
    }

    const data: ExerciseLog = log
      ? { ...log, logs: [...log.logs] }
      : { logs: [], currentWeight: null };

    const loggedCount = nextLogged.filter(Boolean).length;

    if (loggedCount === 0) {
      // All sets undone — remove the in-progress session
      if (data.logs.length > 0 && sessionRef.current) {
        data.logs.pop();
      }
      sessionRef.current = false;
    } else if (!sessionRef.current) {
      // First set logged — create a new session
      data.logs.push({ date: new Date().toISOString(), sets });
      sessionRef.current = true;
    } else {
      // Update the in-progress session
      data.logs[data.logs.length - 1] = {
        date: data.logs[data.logs.length - 1]?.date ?? new Date().toISOString(),
        sets,
      };
    }
    if (data.logs.length > 8) data.logs = data.logs.slice(-8);

    // Check progression when all working sets are logged
    const allWorkingIndices = allSets
      .map((s, i) => (s.type === 'working' ? i : -1))
      .filter((i) => i >= 0);
    const allWorkingLogged = allWorkingIndices.every((i) => nextLogged[i]);

    if (allWorkingLogged && allWorkingIndices.length > 0) {
      const workingSets = sets.filter((s) => s.type === 'working');
      const result = checkProgression(exercise, data, workingSets);
      if (result.triggered && result.newWeight) {
        data.currentWeight = result.newWeight;
        setFeedback(result.message);
        setFeedbackType('progress');
      }
    }

    await saveLog(dayId, exIndex, data);
    onLogSaved(data);
  };

  /** Log a single set */
  const handleLogSet = async (index: number) => {
    const r = parseInt(repsInputs[index]);
    const w = parseFloat(weightInputs[index]);
    if (!r || r <= 0) {
      setFeedback('Enter reps');
      setFeedbackType('error');
      return;
    }
    if (isNaN(w)) {
      setFeedback('Enter weight');
      setFeedbackType('error');
      return;
    }

    setFeedback(null);
    const nextLogged = [...loggedSets];
    nextLogged[index] = true;
    setLoggedSets(nextLogged);

    await persistSession(nextLogged);

    // Start rest timer (unless it's the last set)
    if (index < allSets.length - 1) {
      startTimer(index);
    }

    // Auto-suggest next working set
    if (allSets[index].type === 'working') {
      const nextIdx = findNextWorkingSetIndex(allSets, index);
      if (nextIdx !== -1 && !nextLogged[nextIdx]) {
        const suggestion = suggestNextSet(
          parseFloat(weightInputs[index]) || 0,
          parseInt(repsInputs[index]) || 0,
          allSets[index],
          allSets[nextIdx],
          exercise.repRange,
          isBWExercise(allSets),
        );
        if (suggestion) {
          setWeightInputs((prev) => {
            const next = [...prev];
            next[nextIdx] = String(suggestion.weight);
            return next;
          });
          setRepsInputs((prev) => {
            const next = [...prev];
            next[nextIdx] = String(suggestion.reps);
            return next;
          });
          setSuggestedSets((prev) => {
            const next = [...prev];
            next[nextIdx] = true;
            return next;
          });
          if (suggestion.weightDropped) {
            setFeedback(`Dropped to ${suggestion.weight} kg to stay in rep range`);
            setFeedbackType('progress');
          }
        }
      }
    }
  };

  /** Undo a logged set — re-enables inputs for correction */
  const handleUndoSet = async (index: number) => {
    setFeedback(null);
    const nextLogged = [...loggedSets];
    nextLogged[index] = false;
    setLoggedSets(nextLogged);

    await persistSession(nextLogged);

    // Clear suggestion on the next working set if it was auto-filled
    if (allSets[index].type === 'working') {
      const nextIdx = findNextWorkingSetIndex(allSets, index);
      if (nextIdx !== -1 && suggestedSets[nextIdx] && !nextLogged[nextIdx]) {
        setWeightInputs((prev) => {
          const next = [...prev];
          next[nextIdx] = String(effectiveWeight);
          return next;
        });
        setRepsInputs((prev) => {
          const next = [...prev];
          next[nextIdx] = '';
          return next;
        });
        setSuggestedSets((prev) => {
          const next = [...prev];
          next[nextIdx] = false;
          return next;
        });
      }
    }
  };

  const handleNewSession = () => {
    setLoggedSets(new Array(allSets.length).fill(false));
    setRepsInputs(new Array(allSets.length).fill(''));
    setWeightInputs(
      allSets.map((s) =>
        s.type === 'working' ? String(getEffectiveWeight(exercise, log)) : parseWeight(s.weight)
      )
    );
    setSuggestedSets(new Array(allSets.length).fill(false));
    sessionRef.current = false;
    setFeedback(null);
    skipTimer();
  };

  const allLogged = loggedSets.every(Boolean);

  // Find corresponding last session set for comparison
  const getLastSessionSet = (setIndex: number, setType: string) => {
    if (!lastSession) return null;
    let typeCount = 0;
    for (let i = 0; i < setIndex; i++) {
      if (allSets[i].type === setType) typeCount++;
    }
    let seen = 0;
    for (const s of lastSession.sets) {
      if (s.type === setType || (!s.type && setType === 'working')) {
        if (seen === typeCount) return s;
        seen++;
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Rest timer */}
      {timerActive && (
        <View style={styles.timerBar}>
          <View style={styles.timerContent}>
            <Text style={styles.timerLabel}>Rest</Text>
            <Text style={styles.timerTime}>{formatTimer(timerSeconds)}</Text>
          </View>
          <View style={styles.timerActions}>
            <TouchableOpacity
              style={styles.timerBtn}
              onPress={() => addTime(30)}
              activeOpacity={0.7}
            >
              <Text style={styles.timerBtnText}>+30s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timerBtn, styles.timerSkipBtn]}
              onPress={skipTimer}
              activeOpacity={0.7}
            >
              <Text style={styles.timerSkipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Timer done notification */}
      {!timerActive && timerSetIndex >= 0 && timerSeconds === 0 && !allLogged && (
        <View style={styles.timerDone}>
          <Text style={styles.timerDoneText}>Rest complete — next set!</Text>
        </View>
      )}

      {/* Set rows */}
      {allSets.map((set, i) => {
        const isLogged = loggedSets[i];
        const lastSet = getLastSessionSet(i, set.type);
        const isActive = !isLogged;

        const isSuggested = suggestedSets[i] && !isLogged;

        return (
          <View
            key={i}
            style={[
              styles.setRow,
              set.type === 'warmup' && styles.setRowWarmup,
              set.type === 'feeler' && styles.setRowFeeler,
              set.type === 'working' && styles.setRowWorking,
              isLogged && styles.setRowLogged,
            ]}
          >
            {/* Set type badge */}
            <View style={styles.setInfo}>
              <View
                style={[
                  styles.typeBadge,
                  set.type === 'warmup' && styles.typeBadgeWarmup,
                  set.type === 'feeler' && styles.typeBadgeFeeler,
                  set.type === 'working' && styles.typeBadgeWorking,
                  isLogged && styles.typeBadgeDone,
                ]}
              >
                <Text
                  style={[
                    styles.typeBadgeText,
                    set.type === 'warmup' && styles.typeBadgeTextWarmup,
                    set.type === 'feeler' && styles.typeBadgeTextFeeler,
                    set.type === 'working' && styles.typeBadgeTextWorking,
                    isLogged && styles.typeBadgeTextDone,
                  ]}
                >
                  {isLogged ? '✓' : set.type === 'warmup' ? 'W' : set.type === 'feeler' ? 'F' : 'S'}
                </Text>
              </View>
              <View style={styles.setMeta}>
                {set.type === 'working' && set.rpe !== '—' && (
                  <Text style={[styles.rpeHint, styles.rpeHintWorking]}>
                    RPE {set.rpe}
                  </Text>
                )}
                <Text style={styles.restHint}>{set.rest}</Text>
              </View>
            </View>

            {/* Weight input */}
            <TextInput
              style={[
                styles.weightInput,
                set.type === 'warmup' && styles.inputWarmup,
                set.type === 'feeler' && styles.inputFeeler,
                set.type === 'working' && styles.inputWorking,
                isSuggested && styles.inputSuggested,
                isLogged && styles.inputLogged,
              ]}
              keyboardType="decimal-pad"
              value={weightInputs[i]}
              onChangeText={(val) => {
                const next = [...weightInputs];
                next[i] = val;
                setWeightInputs(next);
                if (suggestedSets[i]) {
                  setSuggestedSets((prev) => {
                    const n = [...prev];
                    n[i] = false;
                    return n;
                  });
                }
              }}
              editable={isActive}
              selectTextOnFocus
            />
            <Text style={styles.unitLabel}>kg</Text>
            <Text style={styles.timesLabel}>×</Text>

            {/* Reps input */}
            <View>
              <TextInput
                style={[
                  styles.repsInput,
                  set.type === 'warmup' && styles.inputWarmup,
                  set.type === 'feeler' && styles.inputFeeler,
                  set.type === 'working' && styles.inputWorking,
                  isSuggested && styles.inputSuggested,
                  isLogged && styles.inputLogged,
                ]}
                keyboardType="numeric"
                placeholder={set.reps.replace('–', '-')}
                placeholderTextColor={colors.textMuted}
                value={repsInputs[i]}
                onChangeText={(val) => {
                  const next = [...repsInputs];
                  next[i] = val;
                  setRepsInputs(next);
                  if (suggestedSets[i]) {
                    setSuggestedSets((prev) => {
                      const n = [...prev];
                      n[i] = false;
                      return n;
                    });
                  }
                }}
                editable={isActive}
                selectTextOnFocus
              />
              {isSuggested && (
                <Text style={styles.suggestedHint}>auto</Text>
              )}
            </View>

            {/* Last session comparison */}
            {lastSet && (
              <Text style={styles.lastSetHint}>
                {lastSet.reps}
              </Text>
            )}

            {/* Log / Undo button */}
            <TouchableOpacity
              style={[
                styles.logSetBtn,
                isLogged
                  ? styles.logSetBtnUndo
                  : set.type === 'warmup'
                  ? styles.logSetBtnWarmup
                  : set.type === 'feeler'
                  ? styles.logSetBtnFeeler
                  : styles.logSetBtnWorking,
              ]}
              onPress={() => isLogged ? handleUndoSet(i) : handleLogSet(i)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.logSetBtnText,
                isLogged
                  ? styles.logSetBtnTextUndo
                  : set.type === 'warmup'
                  ? styles.logSetBtnTextWarmup
                  : set.type === 'feeler'
                  ? styles.logSetBtnTextFeeler
                  : null,
              ]}>{isLogged ? 'Undo' : 'Log'}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Last session summary */}
      {lastSession && !loggedSets.some(Boolean) && (
        <View style={styles.lastSessionRow}>
          <Text style={styles.lastSessionLabel}>
            Last: {new Date(lastSession.date).toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short',
            })}
          </Text>
          <View style={styles.lastSessionSets}>
            {lastSession.sets.map((s, i) => (
              <Text key={i} style={styles.lastSessionSetText}>
                {s.weight}×{s.reps}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Feedback */}
      {feedback && (
        <View
          style={[
            styles.feedback,
            feedbackType === 'progress' && styles.feedbackProgress,
            feedbackType === 'success' && styles.feedbackSuccess,
            feedbackType === 'error' && styles.feedbackError,
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              {
                color:
                  feedbackType === 'progress'
                    ? colors.green
                    : feedbackType === 'error'
                    ? colors.red
                    : colors.amber,
              },
            ]}
          >
            {feedbackType === 'progress' ? '↑ ' : feedbackType === 'error' ? '' : '✓ '}
            {feedback}
          </Text>
        </View>
      )}

      {/* New session button — only after all sets are done */}
      {allLogged && (
        <TouchableOpacity
          style={styles.newSessionBtn}
          onPress={handleNewSession}
          activeOpacity={0.7}
        >
          <Text style={styles.newSessionBtnText}>Log New Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'rgba(52,211,153,0.03)',
  },

  // Timer
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(96,165,250,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.25)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  timerContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.blue,
  },
  timerTime: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'monospace',
    color: colors.blue,
  },
  timerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  timerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(96,165,250,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
  },
  timerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
  },
  timerSkipBtn: {
    backgroundColor: colors.surface2,
    borderColor: colors.border,
  },
  timerSkipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  timerDone: {
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.25)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  timerDoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
  },

  // Set rows
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 5,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  setRowWarmup: {
    backgroundColor: 'rgba(96,165,250,0.04)',
    borderColor: 'rgba(96,165,250,0.1)',
  },
  setRowFeeler: {
    backgroundColor: 'rgba(167,139,250,0.04)',
    borderColor: 'rgba(167,139,250,0.1)',
  },
  setRowWorking: {
    backgroundColor: 'rgba(52,211,153,0.05)',
    borderColor: 'rgba(52,211,153,0.12)',
  },
  setRowLogged: {
    opacity: 0.45,
  },
  setInfo: {
    width: 46,
    alignItems: 'center',
    gap: 1,
  },
  typeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadgeWarmup: {
    backgroundColor: colors.blueBg,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.2)',
  },
  typeBadgeFeeler: {
    backgroundColor: colors.purpleBg,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
  },
  typeBadgeWorking: {
    backgroundColor: colors.greenBg,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
  },
  typeBadgeDone: {
    backgroundColor: 'rgba(52,211,153,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  typeBadgeTextWarmup: { color: colors.blue },
  typeBadgeTextFeeler: { color: colors.purple },
  typeBadgeTextWorking: { color: colors.green },
  typeBadgeTextDone: { color: colors.green },
  setMeta: {
    alignItems: 'center',
    gap: 0,
  },
  rpeHint: {
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: '600',
  },
  rpeHintWorking: {
    color: colors.amber,
  },
  restHint: {
    fontSize: 8,
    color: colors.textMuted,
  },

  // Inputs
  weightInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    width: 56,
    textAlign: 'center',
  },
  unitLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    width: 16,
  },
  timesLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    width: 12,
    textAlign: 'center',
  },
  repsInput: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    width: 46,
    textAlign: 'center',
  },
  inputWarmup: {
    borderColor: 'rgba(96,165,250,0.25)',
  },
  inputFeeler: {
    borderColor: 'rgba(167,139,250,0.25)',
  },
  inputWorking: {
    borderColor: 'rgba(52,211,153,0.3)',
  },
  inputSuggested: {
    borderColor: 'rgba(245,158,11,0.35)',
  },
  inputLogged: {
    backgroundColor: colors.surface2,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  suggestedHint: {
    fontSize: 8,
    color: colors.amber,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 1,
  },
  lastSetHint: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'monospace',
    width: 20,
    textAlign: 'center',
  },
  logSetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  logSetBtnWarmup: {
    backgroundColor: colors.blue,
  },
  logSetBtnFeeler: {
    backgroundColor: colors.purple,
  },
  logSetBtnWorking: {
    backgroundColor: colors.green,
  },
  logSetBtnUndo: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logSetBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  logSetBtnTextWarmup: {
    color: '#0a1628',
  },
  logSetBtnTextFeeler: {
    color: '#1a0e30',
  },
  logSetBtnTextUndo: {
    color: colors.textMuted,
  },

  // Last session
  lastSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 6,
    marginTop: 4,
  },
  lastSessionLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  lastSessionSets: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    flexWrap: 'wrap',
  },
  lastSessionSetText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: colors.textDim,
    backgroundColor: colors.surface2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },

  // Feedback
  feedback: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 8,
  },
  feedbackSuccess: {
    backgroundColor: colors.amberBg,
  },
  feedbackProgress: {
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
  },
  feedbackError: {
    backgroundColor: colors.redBg,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // New session button
  newSessionBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 10,
  },
  newSessionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDim,
  },
});
