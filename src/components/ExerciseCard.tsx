import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Exercise } from '../data/exercises';
import { ExerciseLog } from '../utils/storage';
import { getEffectiveWeight } from '../utils/progression';
import { colors } from '../theme';
import SetTable from './SetTable';
import LogPanel from './LogPanel';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  exercise: Exercise;
  dayId: string;
  exIndex: number;
  log: ExerciseLog | null;
  onLogSaved: (log: ExerciseLog) => void;
}

export default function ExerciseCard({ exercise, dayId, exIndex, log, onLogSaved }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const effectiveWeight = getEffectiveWeight(exercise, log);
  const defaultWeight = getEffectiveWeight(exercise, null);
  const isProgressed = effectiveWeight !== defaultWeight;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const toggleLog = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLogOpen(!logOpen);
  };

  const lastSession = log?.logs?.[log.logs.length - 1];
  const hasLog = !!lastSession;

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.numBadge}>
            <Text style={styles.numText}>{exercise.num}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {exercise.name}
            </Text>
            {exercise.supersetWith && (
              <Text style={styles.superset}>{exercise.supersetWith}</Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          {hasLog && (
            <View style={styles.loggedBadge}>
              <Text style={styles.loggedBadgeText}>✓</Text>
            </View>
          )}
          {isProgressed && (
            <View style={styles.progBadge}>
              <Text style={styles.progBadgeText}>↑</Text>
            </View>
          )}
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {/* Body */}
      {expanded && (
        <View style={styles.body}>
          {/* Research note */}
          <View style={styles.researchNote}>
            <Text style={styles.researchNoteText}>{exercise.researchNote}</Text>
          </View>

          {/* Set table */}
          <SetTable
            sets={exercise.sets}
            effectiveWeight={isProgressed ? effectiveWeight : null}
          />

          {/* Form tips */}
          {exercise.formTips.length > 0 && (
            <View style={styles.formTip}>
              <Text style={styles.formTipHeader}>Form cues:</Text>
              {exercise.formTips.map((tip, i) => (
                <Text key={i} style={styles.formTipItem}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}

          {/* Progression tip (static) */}
          {exercise.progression && (
            <View style={styles.tipRow}>
              <Text style={styles.tipRowText}>
                ↳ {exercise.progression.rawText}
              </Text>
            </View>
          )}

          {/* Log toggle */}
          <TouchableOpacity
            style={styles.logToggle}
            onPress={toggleLog}
            activeOpacity={0.7}
          >
            <Text style={styles.logToggleText}>Log Workout</Text>
            <Text style={styles.logToggleChevron}>
              {logOpen ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {/* Log panel */}
          {logOpen && (
            <LogPanel
              exercise={exercise}
              dayId={dayId}
              exIndex={exIndex}
              log={log}
              onLogSaved={onLogSaved}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  numBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.amberBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
  },
  numText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amber,
    fontFamily: 'monospace',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  superset: {
    fontSize: 11,
    color: colors.cyan,
    fontWeight: '500',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loggedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(52,211,153,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loggedBadgeText: {
    fontSize: 10,
    color: colors.green,
    fontWeight: '700',
  },
  progBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(52,211,153,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progBadgeText: {
    fontSize: 12,
    color: colors.green,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 4,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  researchNote: {
    padding: 12,
    backgroundColor: colors.blueBg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(96,165,250,0.08)',
  },
  researchNoteText: {
    fontSize: 11,
    color: colors.blue,
    lineHeight: 16,
  },
  formTip: {
    padding: 12,
    backgroundColor: colors.greenBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(52,211,153,0.08)',
  },
  formTipHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 6,
  },
  formTipItem: {
    fontSize: 11,
    color: colors.green,
    lineHeight: 17,
    marginBottom: 3,
    paddingLeft: 4,
  },
  tipRow: {
    padding: 12,
    backgroundColor: colors.orangeBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(251,146,60,0.08)',
  },
  tipRowText: {
    fontSize: 12,
    color: colors.orange,
    fontWeight: '500',
  },
  logToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(52,211,153,0.04)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(52,211,153,0.1)',
  },
  logToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  logToggleChevron: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
