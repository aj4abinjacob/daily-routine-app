import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Exercise } from '../data/exercises';
import { ExerciseLog, SessionLog, SetLog, saveLog, loadLog } from '../utils/storage';
import { checkProgression, getEffectiveWeight } from '../utils/progression';
import { colors } from '../theme';

interface Props {
  exercise: Exercise;
  dayId: string;
  exIndex: number;
  log: ExerciseLog | null;
  onLogSaved: (log: ExerciseLog) => void;
}

export default function LogPanel({ exercise, dayId, exIndex, log, onLogSaved }: Props) {
  const workingSets = exercise.sets.filter((s) => s.type === 'working');
  const numSets = workingSets.length;
  const effectiveWeight = getEffectiveWeight(exercise, log);

  const [repsInputs, setRepsInputs] = useState<string[]>(new Array(numSets).fill(''));
  const [weightInputs, setWeightInputs] = useState<string[]>(
    new Array(numSets).fill(String(effectiveWeight))
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'progress'>('success');

  useEffect(() => {
    setWeightInputs(new Array(numSets).fill(String(getEffectiveWeight(exercise, log))));
  }, [log?.currentWeight]);

  const lastSession = log?.logs?.[log.logs.length - 1] ?? null;

  const handleSave = async () => {
    const sets: SetLog[] = [];
    for (let i = 0; i < numSets; i++) {
      const r = parseInt(repsInputs[i]);
      const w = parseFloat(weightInputs[i]);
      if (!r || r < 0 || !w || w <= 0) {
        setFeedback('Fill in reps for all working sets');
        setFeedbackType('success');
        return;
      }
      sets.push({ reps: r, weight: w });
    }

    const data: ExerciseLog = log
      ? { ...log }
      : { logs: [], currentWeight: null };

    data.logs.push({ date: new Date().toISOString(), sets });
    if (data.logs.length > 8) data.logs = data.logs.slice(-8);

    // Check progression
    const result = checkProgression(exercise, data, sets);
    if (result.triggered && result.newWeight) {
      data.currentWeight = result.newWeight;
      setFeedback(result.message);
      setFeedbackType('progress');
      setWeightInputs(new Array(numSets).fill(String(result.newWeight)));
    } else {
      setFeedback('Session saved');
      setFeedbackType('success');
    }

    await saveLog(dayId, exIndex, data);
    onLogSaved(data);
    setRepsInputs(new Array(numSets).fill(''));
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      {/* Last session */}
      {lastSession && (
        <View style={styles.lastSession}>
          <Text style={styles.lastLabel}>
            Last session ({formatDate(lastSession.date)}):
          </Text>
          <View style={styles.lastSets}>
            {lastSession.sets.map((s, i) => (
              <View key={i} style={styles.lastSetBadge}>
                <Text style={styles.lastSetText}>
                  {s.reps} @ {s.weight}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Progression banner */}
      {log?.currentWeight && log.currentWeight !== getEffectiveWeight(exercise, null) && (
        <View style={styles.progBanner}>
          <Text style={styles.progBannerText}>
            ↑ Weight adjusted to {log.currentWeight} kg
          </Text>
        </View>
      )}

      {/* Input fields */}
      <View style={styles.setsContainer}>
        {Array.from({ length: numSets }).map((_, i) => (
          <View key={i} style={styles.setRow}>
            <View style={styles.setLabel}>
              <Text style={styles.setLabelText}>S{i + 1}</Text>
            </View>
            <TextInput
              style={styles.repsInput}
              placeholder="reps"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={repsInputs[i]}
              onChangeText={(val) => {
                const next = [...repsInputs];
                next[i] = val;
                setRepsInputs(next);
              }}
            />
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={styles.weightInput}
              placeholder="kg"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              value={weightInputs[i]}
              onChangeText={(val) => {
                const next = [...weightInputs];
                next[i] = val;
                setWeightInputs(next);
              }}
            />
            <Text style={styles.kgLabel}>kg</Text>
          </View>
        ))}
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
        <Text style={styles.saveBtnText}>Save Session</Text>
      </TouchableOpacity>

      {/* Feedback */}
      {feedback && (
        <View
          style={[
            styles.feedback,
            feedbackType === 'progress' ? styles.feedbackProgress : styles.feedbackSuccess,
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              { color: feedbackType === 'progress' ? colors.green : colors.amber },
            ]}
          >
            {feedbackType === 'progress' ? '↑ ' : '✓ '}
            {feedback}
          </Text>
        </View>
      )}

      {/* Progression rule hint */}
      {exercise.progression && (
        <View style={styles.progHint}>
          <Text style={styles.progHintText}>{exercise.progression.rawText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: colors.greenBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(52,211,153,0.1)',
  },
  lastSession: {
    marginBottom: 12,
  },
  lastLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 6,
  },
  lastSets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  lastSetBadge: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lastSetText: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: colors.text,
  },
  progBanner: {
    backgroundColor: 'rgba(52,211,153,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
  },
  progBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.green,
  },
  setsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setLabel: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surface2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
    fontFamily: 'monospace',
  },
  repsInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  atSymbol: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  weightInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  kgLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: colors.green,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  feedback: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  feedbackSuccess: {
    backgroundColor: colors.amberBg,
  },
  feedbackProgress: {
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progHint: {
    marginTop: 10,
    backgroundColor: colors.orangeBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.15)',
  },
  progHintText: {
    fontSize: 11,
    color: colors.orange,
    fontWeight: '500',
  },
});
