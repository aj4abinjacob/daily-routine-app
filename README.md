# Daily Routine App

React Native (Expo) workout tracker for a **4-Day Upper/Lower Cutting Programme**. Built for Android with workout logging and automatic weight progression.

## Programme Overview

- **Trainee:** Advanced natural (~91 kg), caloric deficit
- **Goal:** Retain muscle and strength while cutting (0.5-0.7 kg/week loss)
- **Schedule:** Mon (Upper A) / Tue (Lower A) / Thu (Upper B) / Fri (Lower B)
- **Nutrition:** 180-200g protein, 2,100-2,300 kcal daily
- **29 exercises** across 4 workout days with research-backed rep ranges, RPE targets, and progression rules

## Features

- **Exercise cards** with set tables (weight, reps, rest, RPE, type), research notes, and form cues
- **Workout logging** — log reps and weight for each working set, saved to device storage
- **Auto-progression** — when you hit your rep targets (e.g., 8-8-8), weight auto-increases for the next session based on exercise-specific rules or a generic +2.5 kg fallback
- **Session history** — shows your last session's performance per exercise (keeps last 8 sessions)
- **Visual indicators** — checkmark on logged exercises, arrow when weight has been progressed
- **Dark theme** matching the original web app design
- **Auto tab selection** — opens today's workout day by default

## Tech Stack

- **Expo** (React Native)
- **TypeScript**
- **React Navigation** (bottom tabs)
- **AsyncStorage** (persistent workout logs)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npx expo start

# Run on Android (emulator or connected device)
npx expo start --android

# Run on web (preview)
npx expo start --web
```

## Build Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK (preview profile)
eas build --platform android --profile preview
```

## Project Structure

```
App.tsx                        — Tab navigator, auto-selects today's workout
src/
  data/exercises.ts            — All 29 exercises with sets, progression rules, form tips
  theme.ts                     — Dark theme (amber/green/blue/orange/purple)
  components/
    ExerciseCard.tsx            — Expandable exercise card with log panel
    SetTable.tsx                — Weight/reps/rest/RPE table
    LogPanel.tsx                — Log inputs, last session display, progression feedback
  utils/
    storage.ts                 — AsyncStorage helpers (save/load per exercise)
    progression.ts             — Auto-progression logic (parses rules, checks criteria)
  screens/
    WorkoutScreen.tsx           — Scrollable exercise list for a workout day
cutting_routine_v6.md          — Source workout programme (markdown)
```

## Progression Logic

Each exercise has a progression rule parsed from the original programme:
- **Specific:** "When you hit 8-8-8, go to 45 kg" — all working sets must hit the target reps
- **Generic fallback:** All working sets hit the top of the rep range (e.g., all sets at 8 in a 5-8 range) — weight increases by 2.5 kg

After progression triggers, the new weight is stored and displayed in the set table for the next session.

## Based On

This app is a React Native port of the [Daily Routine web app](https://aj4abinjacob.github.io/daily-routine/), a single-page HTML application. The source workout programme is in `cutting_routine_v6.md`.

## Weights and Units

All weights are in **kg**. Nutrition values are in **grams** and **kcal**.
