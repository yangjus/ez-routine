# EZ Routine Project Reorientation

Last reviewed: 2026-04-26

This note captures the current architecture, migration concerns, and recommended next steps so a future Codex context window can quickly resume work without re-discovering the whole project.

## Current Project Shape

- Expo React Native app using Expo Router.
- Entry point is `expo-router/entry` from `package.json`.
- Root providers live in `app/_layout.tsx`.
- Main app shell is `app/app.tsx`.
- Primary routes:
  - `app/(tabs)/index.tsx` - Home / days list.
  - `app/(tabs)/workouts.tsx` - all workouts list.
  - `app/(tabs)/settings.tsx` - settings tab.
  - `app/routine/index.tsx` - routine/workout detail.
  - `app/routine/add-exercise.tsx` - add exercise modal/form.
  - `app/routine/edit-exercise.tsx` - edit exercise modal/form.
  - `app/workout/add-workout.tsx` - create workout flow.
- SQLite is provided through `SQLiteProvider` in `app/_layout.tsx`.
- React Query is installed and partially used.

## SQLite Schema

The bundled database is `assets/data2.db`, opened from `app/_layout.tsx`.

Current schema:

```text
days
workouts
workout_days
exercises
sets
```

Tables observed:

```sql
days(id, day)
workouts(id, name, duration, notes, created_at)
workout_days(workout_id, day_id)
exercises(id, workout_id, name, exercise_order, rep_min, rep_max)
sets(id, exercise_id, set_order, reps, weight)
```

This is a reasonable normalized base for the app.

## Schema Review From schema.png

`schema.png` shows the same minimal direction as the bundled DB:

```text
days -> workout_days <- workouts -> exercises -> sets
```

This shape is good for the current app if the goal is to store reusable workout templates:

- `days` stores the seven schedule buckets.
- `workouts` stores a reusable workout such as Pull Day.
- `workout_days` lets one workout appear on multiple days.
- `exercises` stores ordered exercises inside a workout.
- `sets` stores ordered target sets for each exercise.

Recommended minimal adjustments:

- Keep `workout_days` as a composite primary key: `(workout_id, day_id)`.
- Add foreign-key refs in the DBML/image source for `exercises.workout_id -> workouts.id` and `sets.exercise_id -> exercises.id`.
- Remove the bad-looking self reference shown near the bottom of the image: `Ref: "days"."id" < "days"."day"`. `days.day` should not reference `days.id`.
- Add `rep_min` and `rep_max` to `exercises`, because the current app UI uses rep ranges and the actual `assets/data2.db` already has these columns.
- Keep set completion out of SQLite. Completion should stay as temporary screen state during an active workout.
- Consider `weight` as `REAL` instead of `INTEGER` if fractional weights may matter later. If not, `INTEGER` is simpler.

Potential future split:

- Current schema stores planned/template sets.
- If the app later tracks workout history, session dates, actual lifted weight, notes per session, or progress charts, add separate log tables later instead of overloading the current `sets` table.
- Minimal future log shape would be `workout_sessions`, `exercise_sessions`, and `set_logs`, but this is not needed yet for the current minimal app.

## Data Management Concerns

The app currently has three persistence paths:

1. `SQLiteProvider` opens `data2.db` in `app/_layout.tsx`.
2. `hooks/useDatabase.ts` opens a separate `routine.db` with an older SQLite API and creates a separate `routines` table.
3. `app/routine/add-exercise.tsx` and `app/routine/edit-exercise.tsx` still use AsyncStorage key `@data`.

This means different screens can write data that other screens do not read. The highest-priority migration is to use only one persistence path:

- Keep `SQLiteProvider` + `useSQLiteContext`.
- Retire/remove `hooks/useDatabase.ts`.
- Move add/edit/delete/reorder exercise behavior from AsyncStorage into SQLite mutations.

## React Query Concerns

React Query is already present in:

- `hooks/useWorkouts.ts`
- `hooks/useAddWorkout.ts`
- `hooks/useClearAll.ts`

But query usage is not yet centralized.

Issues to address:

- `QueryClient` is created inside the `RootLayout` component body in `app/_layout.tsx`; make it stable outside render or initialize with `useState`.
- Some screens still copy fetched DB data into local state with `useEffect`, especially `app/(tabs)/index.tsx` and `app/routine/index.tsx`.
- Query keys are inconsistent and invalidation is incomplete.
- Mutations usually invalidate `['workouts']`, but related keys such as workouts by day, exercises, and sets can remain stale.

Recommended query key shape:

```ts
['days']
['workouts']
['workouts', 'byDay', dayId]
['workouts', workoutId]
['workouts', workoutId, 'exercises']
['exercises', exerciseId, 'sets']
```

## Mutation Concerns

`hooks/useAddWorkout.ts` inserts a workout, workout-day rows, exercises, and sets as separate statements. This should become one transaction so partial writes do not leave the DB inconsistent.

`hooks/useClearAll.ts` currently deletes `workouts` before `workout_days`. If foreign keys are enabled, delete dependents first:

```text
sets
exercises
workout_days
workouts
```

Then clear `sqlite_sequence` if needed.

## State Management Concerns

`app/routine/index.tsx` derives a local `data` array from `useExercises`, then delete/reorder operations only update local state. Those changes do not persist to SQLite.

Target direction:

- Use React Query for server/local-database state.
- Use component state only for form inputs and transient UI state.
- Persist exercise delete/reorder/edit through SQLite mutations.
- Invalidate or update React Query cache after mutations.

## Routing Concerns

Current routes work, but resource ownership is ambiguous.

Examples:

- `/routine` is a detail screen but depends on params like `workoutId` and sometimes `dayOfWeek`.
- `/routine/add-exercise` does not clearly know whether it is adding to an existing workout or a draft workout.
- `app/workout/add-workout.tsx` links to `/routine/add-exercise`, but the add-exercise screen currently writes to AsyncStorage.

Recommended future structure:

```text
app/(tabs)/index.tsx
app/(tabs)/workouts.tsx
app/workouts/new.tsx
app/workouts/[workoutId]/index.tsx
app/workouts/[workoutId]/exercises/new.tsx
app/workouts/[workoutId]/exercises/[exerciseId]/edit.tsx
```

This should be done after the data layer is cleaned up, because routing becomes easier once the data ownership model is clear.

## Suggested Migration Order

1. Stabilize app providers.
   - Make `QueryClient` stable.
   - Keep one SQLite provider/database.

2. Create a small DB/data access layer.
   - Example folders:
     - `db/types.ts`
     - `db/queries/workouts.ts`
     - `db/queries/exercises.ts`
     - `db/queries/sets.ts`
     - `hooks/queries/...`
     - `hooks/mutations/...`

3. Remove AsyncStorage from routine add/edit flows.
   - Add SQLite mutations for creating/updating exercises and sets.
   - Pass `workoutId` through route params.

4. Refactor routine detail state.
   - Replace local mirrored `data` with React Query data.
   - Persist delete/reorder to SQLite.

5. Wrap multi-step writes in transactions.
   - Add workout with exercises/sets.
   - Edit exercise with replacement/upsert of sets.
   - Delete exercise and its sets.
   - Reorder exercises.

6. Clean up routing.
   - Move toward resource-based dynamic routes.
   - Remove ambiguous `/routine` add/edit flows.

7. Restore project tooling.
   - `npm run lint` currently fails because ESLint 9 expects `eslint.config.js`.
   - Either add a flat ESLint config or adjust ESLint setup.

## Useful Files

- `app/_layout.tsx` - root providers, SQLiteProvider, QueryClientProvider.
- `app/app.tsx` - app Stack routes and Drizzle Studio hook.
- `app/(tabs)/index.tsx` - days home screen; currently manual `useEffect` DB query.
- `app/(tabs)/workouts.tsx` - workouts list using `useAllWorkouts`.
- `app/routine/index.tsx` - routine detail; currently mirrors query data into local state.
- `app/routine/add-exercise.tsx` - still writes to AsyncStorage.
- `app/routine/edit-exercise.tsx` - still reads/writes AsyncStorage.
- `app/workout/add-workout.tsx` - create workout UI; currently inserts hardcoded `newWorkout`.
- `hooks/useWorkouts.ts` - current React Query read hooks.
- `hooks/useAddWorkout.ts` - current add workout mutation.
- `hooks/useClearAll.ts` - current clear mutation.
- `hooks/useDatabase.ts` - separate old SQLite hook; likely should be removed after migration.

## Verification Snapshot

Command run:

```sh
npm run lint
```

Result:

```text
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
From ESLint v9.0.0, the default configuration file is now eslint.config.js.
```

Linting currently does not run until the ESLint config is fixed.
