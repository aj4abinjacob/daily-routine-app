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
  expanded: boolean;
  onToggle: () => void;
}

export default function ExerciseCard({ exercise, dayId, exIndex, log, onLogSaved, expanded, onToggle }: Props) {
  const [showInfo, setShowInfo] = useState(false);
  const effectiveWeight = getEffectiveWeight(exercise, log);
  const defaultWeight = getEffectiveWeight(exercise, null);
  const isProgressed = effectiveWeight !== defaultWeight;

  const workingSets = exercise.sets.filter((s) => s.type === 'working');
  const lastSession = log?.logs?.[log.logs.length - 1];
  const hasLog = !!lastSession;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expanded) setShowInfo(false);
    onToggle();
  };

  const toggleInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInfo(!showInfo);
  };

  // Build compact target summary: "3 work × 5-8 @ 42.5 kg"
  const warmupCount = exercise.sets.filter((s) => s.type === 'warmup' || s.type === 'feeler').length;
  const targetReps = workingSets.length > 0 ? workingSets[0].reps : '';
  const targetSummary = `${workingSets.length}×${targetReps} @ ${effectiveWeight} kg`;
  const setsLabel = `${exercise.sets.length} sets`;

  return (
    <View style={[styles.card, hasLog && styles.cardLogged]}>
      {/* Header — compact, info-dense */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.numBadge, hasLog && styles.numBadgeLogged]}>
              <Text style={[styles.numText, hasLog && styles.numTextLogged]}>
                {hasLog ? '✓' : exercise.num}
              </Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {exercise.name}
            </Text>
          </View>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>

        {/* Subtitle row: set count + target + badges */}
        <View style={styles.subtitleRow}>
          <Text style={styles.setsCount}>{setsLabel}</Text>
          <Text style={styles.target}>{targetSummary}</Text>
          {isProgressed && (
            <View style={styles.progBadge}>
              <Text style={styles.progBadgeText}>↑</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Expanded: Log panel FIRST, then info toggle */}
      {expanded && (
        <View style={styles.body}>
          {/* Log panel — immediately visible */}
          <LogPanel
            exercise={exercise}
            dayId={dayId}
            exIndex={exIndex}
            log={log}
            onLogSaved={onLogSaved}
          />

          {/* Info toggle */}
          <TouchableOpacity
            style={styles.infoToggle}
            onPress={toggleInfo}
            activeOpacity={0.7}
          >
            <Text style={styles.infoToggleText}>
              {showInfo ? '▲ Hide details' : '▼ Set table, form cues & notes'}
            </Text>
          </TouchableOpacity>

          {/* Reference info — hidden by default */}
          {showInfo && (
            <View style={styles.infoSection}>
              {/* Set table */}
              <SetTable
                sets={exercise.sets}
                effectiveWeight={isProgressed ? effectiveWeight : null}
              />

              {/* Form tips */}
              {exercise.formTips.length > 0 && (
                <View style={styles.formTip}>
                  <Text style={styles.formTipHeader}>Form cues</Text>
                  {exercise.formTips.map((tip, i) => (
                    <Text key={i} style={styles.formTipItem}>
                      • {tip}
                    </Text>
                  ))}
                </View>
              )}

              {/* Research note */}
              <View style={styles.researchNote}>
                <Text style={styles.researchNoteText}>{exercise.researchNote}</Text>
              </View>

              {/* Progression tip */}
              {exercise.progression && (
                <View style={styles.tipRow}>
                  <Text style={styles.tipRowText}>
                    {exercise.progression.rawText}
                  </Text>
                </View>
              )}
            </View>
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardLogged: {
    borderColor: 'rgba(52,211,153,0.2)',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.amberBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
  },
  numBadgeLogged: {
    backgroundColor: 'rgba(52,211,153,0.12)',
    borderColor: 'rgba(52,211,153,0.25)',
  },
  numText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amber,
    fontFamily: 'monospace',
  },
  numTextLogged: {
    color: colors.green,
    fontSize: 13,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  chevron: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 8,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 38, // align with name (badge width + gap)
    gap: 8,
    flexWrap: 'wrap',
  },
  target: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: colors.amber,
  },
  progBadge: {
    backgroundColor: 'rgba(52,211,153,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
  },
  progBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.green,
  },
  setsCount: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoToggle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  infoToggleText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  researchNote: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.blueBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(96,165,250,0.08)',
  },
  researchNoteText: {
    fontSize: 11,
    color: colors.blue,
    lineHeight: 15,
  },
  formTip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.greenBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(52,211,153,0.08)',
  },
  formTipHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 4,
  },
  formTipItem: {
    fontSize: 11,
    color: colors.green,
    lineHeight: 15,
    marginBottom: 2,
    paddingLeft: 4,
  },
  tipRow: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.orangeBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(251,146,60,0.08)',
  },
  tipRowText: {
    fontSize: 11,
    color: colors.orange,
    fontWeight: '500',
  },
});
