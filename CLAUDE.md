# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native (Expo) Android app — a **4-Day Upper/Lower Cutting Programme** workout tracker with workout logging and auto-progression. Built with TypeScript.

**Original web app:** https://aj4abinjacob.github.io/daily-routine/
**Source programme:** `cutting_routine_v6.md`

## Programme Goals

- **Lose 0.5-0.7 kg/week** (500-700 kcal/day deficit)
- **Retain muscle & strength** during the cut
- **180-200g protein / 2,100-2,300 kcal daily**
- 29 exercises across 4 days (Upper A, Lower A, Upper B, Lower B)

## How to Run

```bash
npm install
npx expo start          # then press 'a' for Android or 'w' for web
```

## Build Android APK

```bash
eas build --platform android --profile preview
```

## Architecture

### Data Layer
- `src/data/exercises.ts` — All exercise data as typed constants. Each exercise has: sets (with weight/reps/rest/RPE/type), research notes, form tips, progression rules, rep ranges. This is the single source of truth for workout content.

### Components
- `src/components/ExerciseCard.tsx` — Main exercise UI. Expandable card with set table, form tips, progression tip, and log panel. Uses `LayoutAnimation` for expand/collapse.
- `src/components/SetTable.tsx` — Renders the set table rows. Accepts `effectiveWeight` prop to override working set weights when progression has occurred.
- `src/components/LogPanel.tsx` — Workout logging UI inside each exercise card. Input fields per working set, save button, last session display, progression feedback banner.

### Screens
- `src/screens/WorkoutScreen.tsx` — Renders all exercises for a given workout day. Loads logs from AsyncStorage on mount, passes them down to ExerciseCards.

### Utils
- `src/utils/storage.ts` — AsyncStorage wrapper. Keys are `wlog_{dayId}_{exIndex}`. Stores `ExerciseLog` objects with session history (last 8) and current progressed weight.
- `src/utils/progression.ts` — Progression logic. `checkProgression()` checks if latest logged session meets the exercise's progression criteria (specific rule or generic top-of-range). `getEffectiveWeight()` returns the current working weight considering any stored progression.

### Theme
- `src/theme.ts` — Color palette and helper functions. Dark theme matching the original web app: amber=primary, green=working/positive, blue=warmup/info, orange=tips, red=warnings, purple=cooldown.

## Key Patterns

- Exercise data is static TypeScript (not fetched from API). Edit `src/data/exercises.ts` to change exercises.
- Workout logs persist in AsyncStorage with keys `wlog_{dayId}_{exIndex}`.
- Progression rules are parsed from exercise data: `{ targetReps: [8,8,8], nextWeight: 45 }`. Generic fallback: all sets hit `repRange[1]` (top of range) -> +2.5 kg.
- `ExerciseCard` manages its own expanded/collapsed state. `LogPanel` open/close is independent.
- `WorkoutScreen` owns the logs state and passes down to children. `onLogSaved` callback updates parent state.
- Tab navigation uses `@react-navigation/bottom-tabs`. Initial route auto-selected by day of week.

## Content Context

- All weights in **kg**, all nutrition in **grams/kcal**
- Research citations throughout — rep range justifications (Helms, Schoenfeld, SBS, RP, Maeo, etc.)
- Form cues from peer-reviewed EMG/biomechanics studies (Contreras, Escamilla, Signorile, etc.)
- Nutrition examples use Indian food sources (dal, paneer, curd, roti)
- Schedule assumes WFH with 9:30-6:30 work hours, gym at 7:30 AM
- RPE targets are conservative: compounds at RPE 7-8, only safe isolations go to RPE 9-10
