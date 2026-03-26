import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExerciseSet } from '../data/exercises';
import { colors, rpeColor, badgeColor } from '../theme';

interface Props {
  sets: ExerciseSet[];
  effectiveWeight: number | null; // overridden weight for working sets
}

export default function SetTable({ sets, effectiveWeight }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.colWeight]}>Weight</Text>
        <Text style={[styles.headerCell, styles.colReps]}>Reps</Text>
        <Text style={[styles.headerCell, styles.colRest]}>Rest</Text>
        <Text style={[styles.headerCell, styles.colRpe]}>RPE</Text>
        <Text style={[styles.headerCell, styles.colType]}>Type</Text>
      </View>
      {/* Rows */}
      {sets.map((set, i) => {
        const badge = badgeColor(set.type);
        const displayWeight =
          effectiveWeight && set.type === 'working'
            ? `${effectiveWeight} kg`
            : set.weight;

        return (
          <View key={i} style={[styles.row, i % 2 === 1 && styles.rowAlt]}>
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
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.015)',
  },
  cell: {
    fontSize: 13,
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
  colWeight: { flex: 2.2, minWidth: 70 },
  colReps: { flex: 1.2, minWidth: 40 },
  colRest: { flex: 1.5, minWidth: 45 },
  colRpe: { flex: 1, minWidth: 30 },
  colType: { flex: 1, minWidth: 40 },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
