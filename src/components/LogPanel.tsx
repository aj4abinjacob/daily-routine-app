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

/** Parse weight string like "42.5 kg", "BW", "12.5 kg" into a number (0 for BW) */
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

  // Per-set input state: weight and reps for every set
  const [weightInputs, setWeightInputs] = useState<string[]>(() =>
    allSets.map((s) =>
      s.type === 'working' ? String(effectiveWeight) : parseWeight(s.weight)
    )
  );
  const [repsInputs, setRepsInputs] = useState<string[]>(() =>
    allSets.map(() => '')
  );
  // Track which sets are logged this session
  const [loggedSets, setLoggedSets] = useState<boolean[]>(() =>
    new Array(allSets.length).fill(false)
  );

  // Rest timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerSetIndex, setTimerSetIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Feedback
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'progress' | 'error'>('success');

  // Session saved state
  const [sessionSaved, setSessionSaved] = useState(false);

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

  const handleLogSet = (index: number) => {
    const r = parseInt(repsInputs[index]);
    const w = parseFloat(weightInputs[index]);
    if (!r || r <= 0) {
      setFeedback('Enter reps');
      setFeedbackType('error');
      return;
    }
    if (!w && w !== 0) {
      setFeedback('Enter weight');
      setFeedbackType('error');
      return;
    }

    setFeedback(null);
    const next = [...loggedSets];
    next[index] = true;
    setLoggedSets(next);

    // Start rest timer (unless it's the last set)
    if (index < allSets.length - 1) {
      startTimer(index);
    }
  };

  const handleSaveSession = async () => {
    // Collect all logged sets
    const sets: SetLog[] = [];
    for (let i = 0; i < allSets.length; i++) {
      if (!loggedSets[i]) continue;
      sets.push({
        reps: parseInt(repsInputs[i]) || 0,
        weight: parseFloat(weightInputs[i]) || 0,
        type: allSets[i].type,
      });
    }

    if (sets.length === 0) {
      setFeedback('Log at least one set first');
      setFeedbackType('error');
      return;
    }

    const data: ExerciseLog = log
      ? { ...log, logs: [...log.logs] }
      : { logs: [], currentWeight: null };

    data.logs.push({ date: new Date().toISOString(), sets });
    if (data.logs.length > 8) data.logs = data.logs.slice(-8);

    // Check progression (only working sets)
    const workingSets = sets.filter((s) => s.type === 'working');
    if (workingSets.length > 0) {
      const result = checkProgression(exercise, data, workingSets);
      if (result.triggered && result.newWeight) {
        data.currentWeight = result.newWeight;
        setFeedback(result.message);
        setFeedbackType('progress');
      } else {
        setFeedback('Session saved');
        setFeedbackType('success');
      }
    } else {
      setFeedback('Session saved');
      setFeedbackType('success');
    }

    await saveLog(dayId, exIndex, data);
    onLogSaved(data);
    setSessionSaved(true);
  };

  const handleReset = () => {
    setLoggedSets(new Array(allSets.length).fill(false));
    setRepsInputs(new Array(allSets.length).fill(''));
    setWeightInputs(
      allSets.map((s) =>
        s.type === 'working' ? String(getEffectiveWeight(exercise, log)) : parseWeight(s.weight)
      )
    );
    setSessionSaved(false);
    setFeedback(null);
    skipTimer();
  };

  const allLogged = loggedSets.every(Boolean);
  const someLogged = loggedSets.some(Boolean);

  // Find corresponding last session set for comparison
  // Last session may have different number of sets, so we match by type+index
  const getLastSessionSet = (setIndex: number, setType: string) => {
    if (!lastSession) return null;
    // Count how many sets of this type we've seen before this index
    let typeCount = 0;
    for (let i = 0; i < setIndex; i++) {
      if (allSets[i].type === setType) typeCount++;
    }
    // Find the matching set in last session
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
      {/* Rest timer overlay */}
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
      {!timerActive && timerSetIndex >= 0 && timerSeconds === 0 && !sessionSaved && (
        <View style={styles.timerDone}>
          <Text style={styles.timerDoneText}>Rest complete — next set!</Text>
        </View>
      )}

      {/* Set rows */}
      {allSets.map((set, i) => {
        const isLogged = loggedSets[i];
        const lastSet = getLastSessionSet(i, set.type);
        const isActive = !isLogged && !sessionSaved;

        return (
          <View
            key={i}
            style={[
              styles.setRow,
              set.type === 'warmup' && styles.setRowWarmup,
              set.type === 'feeler' && styles.setRowFeeler,
              set.type === 'working' && styles.setRowWorking,
              isLogged && styles.setRowLogged,
              !isActive && !isLogged && styles.setRowDimmed,
            ]}
          >
            {/* Set type + number */}
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
              {/* RPE + rest hint */}
              <View style={styles.setMeta}>
                {set.type === 'working' && set.rpe !== '—' && (
                  <Text style={[
                    styles.rpeHint,
                    set.type === 'working' && styles.rpeHintWorking,
                  ]}>RPE {set.rpe}</Text>
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
                isLogged && styles.inputLogged,
              ]}
              keyboardType="decimal-pad"
              value={weightInputs[i]}
              onChangeText={(val) => {
                const next = [...weightInputs];
                next[i] = val;
                setWeightInputs(next);
              }}
              editable={isActive}
              selectTextOnFocus
            />
            <Text style={styles.unitLabel}>kg</Text>
            <Text style={styles.timesLabel}>×</Text>

            {/* Reps input */}
            <TextInput
              style={[
                styles.repsInput,
                set.type === 'warmup' && styles.inputWarmup,
                set.type === 'feeler' && styles.inputFeeler,
                set.type === 'working' && styles.inputWorking,
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
              }}
              editable={isActive}
              selectTextOnFocus
            />

            {/* Last session comparison */}
            {lastSet && (
              <Text style={styles.lastSetHint}>
                {lastSet.reps}
              </Text>
            )}

            {/* Log set button — colored by type */}
            {isActive && (
              <TouchableOpacity
                style={[
                  styles.logSetBtn,
                  set.type === 'warmup' && styles.logSetBtnWarmup,
                  set.type === 'feeler' && styles.logSetBtnFeeler,
                  set.type === 'working' && styles.logSetBtnWorking,
                ]}
                onPress={() => handleLogSet(i)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.logSetBtnText,
                  set.type === 'warmup' && styles.logSetBtnTextWarmup,
                  set.type === 'feeler' && styles.logSetBtnTextFeeler,
                ]}>{set.type === 'warmup' ? 'Log' : set.type === 'feeler' ? 'Log' : 'Log'}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {/* Last session summary */}
      {lastSession && !sessionSaved && (
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

      {/* Save / Reset buttons */}
      {!sessionSaved ? (
        <View style={styles.actionRow}>
          {someLogged && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              !someLogged && styles.saveBtnDisabled,
            ]}
            onPress={handleSaveSession}
            activeOpacity={0.8}
            disabled={!someLogged}
          >
            <Text style={[styles.saveBtnText, !someLogged && styles.saveBtnTextDisabled]}>
              {allLogged ? 'Save Session' : 'Save Session'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.newSessionBtn}
          onPress={handleReset}
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

  // Set rows — colored by type
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
  setRowDimmed: {
    opacity: 0.35,
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
  inputLogged: {
    backgroundColor: colors.surface2,
    borderColor: 'rgba(255,255,255,0.05)',
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

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.3,
  },
  saveBtnTextDisabled: {
    color: colors.textMuted,
  },
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
