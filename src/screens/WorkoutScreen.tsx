import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { WorkoutDay } from '../data/exercises';
import { ExerciseLog, loadAllLogsForDay, saveLog } from '../utils/storage';
import { colors } from '../theme';
import ExerciseCard from '../components/ExerciseCard';

interface Props {
  day: WorkoutDay;
}

export default function WorkoutScreen({ day }: Props) {
  const [logs, setLogs] = useState<(ExerciseLog | null)[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [dirtyIndices, setDirtyIndices] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState(false);

  const loadLogs = useCallback(async () => {
    const data = await loadAllLogsForDay(day.id, day.exercises.length);
    setLogs(data);
    setDirtyIndices(new Set());
    setSaved(false);
  }, [day.id, day.exercises.length]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  };

  const handleLogSaved = (exIndex: number, newLog: ExerciseLog) => {
    setLogs((prev) => {
      const next = [...prev];
      next[exIndex] = newLog;
      return next;
    });
    setDirtyIndices((prev) => new Set(prev).add(exIndex));
    setSaved(false);
  };

  const handleSaveSession = async () => {
    const promises: Promise<void>[] = [];
    dirtyIndices.forEach((idx) => {
      const log = logs[idx];
      if (log) {
        promises.push(saveLog(day.id, idx, log));
      }
    });
    await Promise.all(promises);
    setDirtyIndices(new Set());
    setSaved(true);
  };

  const hasDirty = dirtyIndices.size > 0;

  // Count exercises that have at least one set logged this session (dirty)
  const dirtyWithSets = Array.from(dirtyIndices).filter((idx) => {
    const log = logs[idx];
    return log?.logs?.length && log.logs[log.logs.length - 1]?.sets?.length;
  }).length;

  const loggedCount = logs.filter((l) => l?.logs?.length).length;
  const total = day.exercises.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.amber}
        />
      }
    >
      {/* Compact header with progress bar */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>{day.title}</Text>
          </View>
          <Text style={styles.progressText}>
            {loggedCount}/{total}
          </Text>
        </View>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: total > 0 ? `${(loggedCount / total) * 100}%` : '0%',
                backgroundColor: loggedCount === total ? colors.green : colors.amber,
              },
            ]}
          />
        </View>
      </View>

      {/* Exercise cards */}
      {day.exercises.map((ex, i) => (
        <ExerciseCard
          key={`${day.id}-${i}`}
          exercise={ex}
          dayId={day.id}
          exIndex={i}
          log={logs[i] ?? null}
          onLogSaved={(newLog) => handleLogSaved(i, newLog)}
          expanded={expandedIndex === i}
          onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
          loggedThisSession={dirtyIndices.has(i)}
        />
      ))}

      {/* Save Session button */}
      {hasDirty && !saved && (
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveSession}
          activeOpacity={0.7}
        >
          <Text style={styles.saveBtnText}>Save Session</Text>
          <Text style={styles.saveBtnSub}>
            {dirtyWithSets} exercise{dirtyWithSets !== 1 ? 's' : ''} logged
          </Text>
        </TouchableOpacity>
      )}

      {saved && (
        <View style={styles.savedBanner}>
          <Text style={styles.savedText}>Session saved</Text>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 12,
    paddingTop: 8,
  },
  header: {
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.amber,
    fontFamily: 'monospace',
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.surface2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  saveBtn: {
    backgroundColor: colors.green,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  saveBtnSub: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
  savedBanner: {
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.25)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  savedText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.green,
  },
});
