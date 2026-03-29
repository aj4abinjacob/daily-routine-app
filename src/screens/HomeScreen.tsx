import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { workoutDays } from '../data/exercises';
import { colors } from '../theme';

type RootStackParamList = {
  Home: undefined;
  Workout: { dayIndex: number };
};

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}

const dayMeta: Record<string, { badge: string; day: string; accent: string }> = {
  'upper-a': { badge: 'U1', day: 'Monday', accent: colors.amber },
  'lower-a': { badge: 'L1', day: 'Tuesday', accent: colors.blue },
  'upper-b': { badge: 'U2', day: 'Thursday', accent: colors.amber },
  'lower-b': { badge: 'L2', day: 'Friday', accent: colors.blue },
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Workout Days</Text>

      {workoutDays.map((day, i) => {
        const meta = dayMeta[day.id] ?? { badge: '?', day: '', accent: colors.amber };
        return (
          <TouchableOpacity
            key={day.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Workout', { dayIndex: i })}
          >
            <View style={[styles.badge, { borderColor: meta.accent + '33' }]}>
              <Text style={[styles.badgeText, { color: meta.accent }]}>{meta.badge}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.dayLabel}>{meta.day}</Text>
              <Text style={styles.title}>{day.title}</Text>
              <Text style={styles.exerciseCount}>
                {day.exercises.length} exercises
              </Text>
            </View>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
        );
      })}
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
    paddingTop: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.amberBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 14,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  cardBody: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  exerciseCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 18,
    color: colors.textMuted,
    marginLeft: 8,
  },
});
