import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { WorkoutDay } from '../data/exercises';
import { ExerciseLog, loadAllLogsForDay } from '../utils/storage';
import { colors } from '../theme';
import ExerciseCard from '../components/ExerciseCard';

interface Props {
  day: WorkoutDay;
}

export default function WorkoutScreen({ day }: Props) {
  const [logs, setLogs] = useState<(ExerciseLog | null)[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadLogs = useCallback(async () => {
    const data = await loadAllLogsForDay(day.id, day.exercises.length);
    setLogs(data);
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
  };

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
        />
      ))}

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
});
