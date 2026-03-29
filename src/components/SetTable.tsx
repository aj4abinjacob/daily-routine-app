import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExerciseSet } from '../data/exercises';
import { colors, rpeColor, badgeColor } from '../theme';

interface Props {
  sets: ExerciseSet[];
  effectiveWeight: number | null;
}

export default function SetTable({ sets, effectiveWeight }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.colType]}>Type</Text>
        <Text style={[styles.headerCell, styles.colWeight]}>Weight</Text>
        <Text style={[styles.headerCell, styles.colReps]}>Reps</Text>
        <Text style={[styles.headerCell, styles.colRest]}>Rest</Text>
        <Text style={[styles.headerCell, styles.colRpe]}>RPE</Text>
      </View>
      {/* Rows */}
      {sets.map((set, i) => {
        const badge = badgeColor(set.type);
        const displayWeight =
          effectiveWeight && set.type === 'working'
            ? `${effectiveWeight} kg`
            : set.weight;

        return (
          <View
            key={i}
            style={[
              styles.row,
              set.type === 'working' && styles.rowWorking,
            ]}
          >
            <View style={[styles.colType]}>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>
                  {set.type === 'warmup'
                    ? 'Warm'
                    : set.type === 'feeler'
                    ? 'Feel'
                    : 'Work'}
                </Text>
              </View>
            </View>
            <Text style={[styles.cell, styles.colWeight, styles.mono]}>
              {displayWeight}
            </Text>
            <Text style={[styles.cell, styles.colReps, styles.mono]}>
              {set.reps}
            </Text>
            <Text style={[styles.cell, styles.colRest, styles.muted]}>
              {set.rest}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.colRpe,
                styles.mono,
                { color: rpeColor(set.rpeClass) },
              ]}
            >
              {set.rpe}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowWorking: {
    backgroundColor: 'rgba(52,211,153,0.03)',
  },
  cell: {
    fontSize: 12,
    color: colors.text,
  },
  mono: {
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  muted: {
    fontSize: 11,
    color: colors.textMuted,
  },
  colType: { width: 42 },
  colWeight: { flex: 2, minWidth: 65 },
  colReps: { flex: 1.2, minWidth: 35 },
  colRest: { flex: 1.3, minWidth: 40 },
  colRpe: { flex: 0.8, minWidth: 28 },
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
