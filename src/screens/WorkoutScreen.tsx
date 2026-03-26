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

  // Count logged exercises
  const loggedCount = logs.filter((l) => l?.logs?.length).length;

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
      {/* Day header */}
      <View style={styles.header}>
        <Text style={styles.label}>{day.label}</Text>
        <Text style={styles.title}>{day.title}</Text>
        {loggedCount > 0 && (
          <Text style={styles.progress}>
            {loggedCount}/{day.exercises.length} exercises logged
          </Text>
        )}
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

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  progress: {
    fontSize: 12,
    color: colors.green,
    fontWeight: '600',
    marginTop: 4,
  },
});
