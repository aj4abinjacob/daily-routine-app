import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { workoutDays } from './src/data/exercises';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import { colors } from './src/theme';

type RootStackParamList = {
  Home: undefined;
  Workout: { dayIndex: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.amber,
          headerTitleStyle: { fontWeight: '700', fontSize: 15, color: colors.text },
        }}
      >
        <Stack.Screen
          name="Home"
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
    </NavigationContainer>
  );
}
