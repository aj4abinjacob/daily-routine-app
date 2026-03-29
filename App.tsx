import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { workoutDays } from './src/data/exercises';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { colors } from './src/theme';

type HomeStackParamList = {
  HomeList: undefined;
  Workout: { dayIndex: number };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.amber,
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 15, color: colors.text },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ title: '4-Day Cutting Programme' }}
      />
      <Stack.Screen
        name="Workout"
        options={({ route }) => {
          const day = workoutDays[route.params.dayIndex];
          return { title: day?.title ?? 'Workout' };
        }}
      >
        {({ route }) => {
          const day = workoutDays[route.params.dayIndex];
          return <WorkoutScreen day={day} />;
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

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

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.amber,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: 'Workout',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size - 4 }}>🏋</Text>
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'History',
            headerShown: true,
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.amber,
            headerTitleStyle: { fontWeight: '700', fontSize: 15, color: colors.text },
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size - 4 }}>📋</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
