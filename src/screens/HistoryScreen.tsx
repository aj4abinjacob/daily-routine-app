import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { workoutDays } from '../data/exercises';
import { HistorySession, loadHistory, deleteSession } from '../utils/storage';
import { colors } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const dayAccent: Record<string, string> = {
  'upper-a': colors.amber,
  'lower-a': colors.blue,
  'upper-b': colors.amber,
  'lower-b': colors.blue,
};

const dayBadge: Record<string, string> = {
  'upper-a': 'U1',
  'lower-a': 'L1',
  'upper-b': 'U2',
  'lower-b': 'L2',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatVolume(vol: number): string {
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}t`;
  return `${Math.round(vol)} kg`;
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const load = useCallback(async () => {
    const data = await loadHistory(workoutDays);
    setSessions(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const toggle = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  const handleDelete = (session: HistorySession) => {
    const dayData = workoutDays.find((d) => d.id === session.dayId);
    if (!dayData) return;

    Alert.alert(
      'Delete session?',
      `${formatDate(session.date)} — ${session.dayTitle}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSession(session.dayId, session.date, dayData.exercises.length);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpandedIdx(null);
            await load();
          },
        },
      ],
    );
  };

  if (!sessions.length) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No sessions logged yet</Text>
        <Text style={styles.emptySubtext}>
          Complete a workout and save to see history
        </Text>
      </View>
    );
  }

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
      <Text style={styles.heading}>
        {sessions.length} session{sessions.length !== 1 ? 's' : ''}
      </Text>

      {sessions.map((session, idx) => {
        const accent = dayAccent[session.dayId] ?? colors.amber;
        const badge = dayBadge[session.dayId] ?? '?';
        const expanded = expandedIdx === idx;

        return (
          <TouchableOpacity
            key={`${session.date}-${session.dayId}`}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => toggle(idx)}
          >
            {/* Header row */}
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { borderColor: accent + '33' }]}>
                <Text style={[styles.badgeText, { color: accent }]}>
                  {badge}
                </Text>
              </View>
              <View style={styles.cardHeaderBody}>
                <Text style={styles.dateText}>{formatDate(session.date)}</Text>
                <Text style={styles.dayTitle} numberOfLines={1}>
                  {session.dayTitle}
                </Text>
              </View>
              <View style={styles.cardHeaderRight}>
                <Text style={styles.volumeText}>
                  {formatVolume(session.totalVolume)}
                </Text>
                <Text style={styles.exCountText}>
                  {session.exercises.length} ex
                </Text>
              </View>
            </View>

            {/* Collapsed: compact working set summary per exercise */}
            {!expanded && (
              <View style={styles.compactSummary}>
                {session.exercises.map((ex, i) => {
                  const setsStr = ex.workingSets
                    .map((s) => `${s.weight}×${s.reps}`)
                    .join('  ');
                  return (
                    <View key={i} style={styles.compactRow}>
                      <Text style={styles.compactName} numberOfLines={1}>
                        {ex.name}
                      </Text>
                      <Text style={styles.compactSets}>{setsStr}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Expanded: detailed view */}
            {expanded && (
              <View style={styles.expandedSection}>
                {session.exercises.map((ex, i) => {
                  const vol = ex.workingSets.reduce(
                    (s, set) => s + set.weight * set.reps,
                    0,
                  );
                  return (
                    <View key={i} style={styles.exBlock}>
                      <View style={styles.exHeader}>
                        <Text style={styles.exName}>{ex.name}</Text>
                        <Text style={styles.exVol}>
                          {formatVolume(vol)}
                        </Text>
                      </View>
                      <View style={styles.setsRow}>
                        {ex.allSets.map((s, j) => {
                          const isWorking =
                            s.type === 'working' || !s.type;
                          return (
                            <View
                              key={j}
                              style={[
                                styles.setPill,
                                isWorking
                                  ? styles.setPillWorking
                                  : styles.setPillWarmup,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.setPillText,
                                  isWorking
                                    ? styles.setPillTextWorking
                                    : styles.setPillTextWarmup,
                                ]}
                              >
                                {s.weight}×{s.reps}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}

                {/* Session totals */}
                <View style={styles.totalsRow}>
                  <Text style={styles.totalLabel}>Total volume</Text>
                  <Text style={styles.totalValue}>
                    {formatVolume(session.totalVolume)}
                  </Text>
                </View>

                {/* Delete button */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(session)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteBtnText}>Delete Session</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDim,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 10,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.amberBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  cardHeaderBody: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dayTitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  volumeText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
    color: colors.amber,
  },
  exCountText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },

  // Collapsed compact summary
  compactSummary: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 3,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactName: {
    fontSize: 11,
    color: colors.textDim,
    width: 130,
  },
  compactSets: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: colors.textMuted,
    flex: 1,
  },

  // Expanded detail
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    gap: 12,
  },
  exBlock: {
    gap: 4,
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  exVol: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.textDim,
  },
  setsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  setPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  setPillWorking: {
    backgroundColor: colors.greenBg,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.15)',
  },
  setPillWarmup: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setPillText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  setPillTextWorking: {
    color: colors.green,
  },
  setPillTextWarmup: {
    color: colors.textMuted,
  },

  // Totals
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
    color: colors.amber,
  },

  // Delete
  deleteBtn: {
    backgroundColor: colors.redBg,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.red,
  },
});
