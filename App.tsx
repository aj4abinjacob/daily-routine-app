import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { workoutDays } from './src/data/exercises';
import WorkoutScreen from './src/screens/WorkoutScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.amber,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

// Auto-select tab based on day of week
function getInitialRoute(): string {
  const dayMap = ['daily', 'upper-a', 'lower-a', 'cardio', 'upper-b', 'lower-b', 'cardio'];
  const today = new Date().getDay();
  const mapped = dayMap[today];
  // Only return workout day IDs that exist in our tabs
  const workoutIds = workoutDays.map((d) => d.id);
  return workoutIds.includes(mapped) ? mapped : workoutIds[0];
}

const tabIcons: Record<string, string> = {
  'upper-a': 'U1',
  'lower-a': 'L1',
  'upper-b': 'U2',
  'lower-b': 'L2',
};

const tabLabels: Record<string, string> = {
  'upper-a': 'Mon',
  'lower-a': 'Tue',
  'upper-b': 'Thu',
  'lower-b': 'Fri',
};

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingTop: 4,
            height: 60,
          },
          tabBarActiveTintColor: colors.amber,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 4,
          },
        }}
      >
        {workoutDays.map((day) => (
          <Tab.Screen
            key={day.id}
            name={day.id}
            options={{
              tabBarLabel: tabLabels[day.id] ?? day.label,
              tabBarIcon: ({ color }) => (
                <View
                  style={{
                    width: 28,
                    height: 22,
                    borderRadius: 4,
                    backgroundColor: color === colors.amber ? colors.amberBg : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: color === colors.amber ? 'rgba(245,158,11,0.2)' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color,
                      fontFamily: 'monospace',
                    }}
                  >
                    {tabIcons[day.id] ?? day.id.charAt(0).toUpperCase()}
                  </Text>
                </View>
              ),
            }}
          >
            {() => <WorkoutScreen day={day} />}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
