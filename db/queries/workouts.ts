import { SQLiteDatabase } from "expo-sqlite";

import { Exercise, NewWorkout, Set, Workout } from "../types";

export const workoutKeys = {
  all: ["workouts"] as const,
  byDay: (dayId: number) => ["workouts", "byDay", dayId] as const,
  detail: (workoutId: number) => ["workouts", workoutId] as const,
  exercises: (workoutId: number) =>
    ["workouts", workoutId, "exercises"] as const,
  sets: (exerciseId: number) => ["exercises", exerciseId, "sets"] as const,
};

export const getAllWorkouts = async (db: SQLiteDatabase) => {
  return db.getAllAsync<Workout>(`
    SELECT *
    FROM workouts
  `);
};

export const getWorkoutsByDay = async (
  db: SQLiteDatabase,
  dayId: number,
) => {
  return db.getAllAsync<Workout>(
    `
      SELECT w.*
      FROM workouts w
      JOIN workout_days wd ON w.id = wd.workout_id
      JOIN days d ON d.id = wd.day_id
      WHERE d.id = ?
    `,
    [dayId],
  );
};

export const getExercisesByWorkoutId = async (
  db: SQLiteDatabase,
  workoutId: number,
) => {
  return db.getAllAsync<Exercise>(
    `
      SELECT *
      FROM exercises
      WHERE workout_id = ?
      ORDER BY exercise_order
    `,
    [workoutId],
  );
};

export const getSetsByExerciseId = async (
  db: SQLiteDatabase,
  exerciseId: number,
) => {
  const sets = await db.getAllAsync<Set>(
    `
      SELECT s.*
      FROM exercises e
      LEFT JOIN sets s ON e.id = s.exercise_id
      WHERE e.id = ?
      ORDER BY s.set_order
    `,
    [exerciseId],
  );

  return sets
    .sort((a, b) => a.set_order - b.set_order)
    .map((set) => ({
      id: set.id.toString(),
      reps: set.reps,
      weight: set.weight,
    }));
};

export const insertWorkoutWithExercises = async (
  db: SQLiteDatabase,
  workout: NewWorkout,
  days: number[],
) => {
  await db.withTransactionAsync(async () => {
    const newWorkout = await db.runAsync(
      `
        INSERT INTO workouts (name, duration, notes, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `,
      [workout.name, workout.duration ?? null, workout.notes ?? null],
    );

    const workoutId = newWorkout.lastInsertRowId;

    for (const dayId of days) {
      await db.runAsync(
        `
          INSERT INTO workout_days (workout_id, day_id)
          VALUES (?, ?)
        `,
        [workoutId, dayId],
      );
    }

    for (const exercise of workout.exercises) {
      const newExercise = await db.runAsync(
        `
          INSERT INTO exercises (workout_id, name, exercise_order, rep_min, rep_max)
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          workoutId,
          exercise.name,
          exercise.exercise_order,
          exercise.rep_min,
          exercise.rep_max,
        ],
      );

      for (const set of exercise.sets) {
        await db.runAsync(
          `
            INSERT INTO sets (exercise_id, set_order, reps, weight)
            VALUES (?, ?, ?, ?)
          `,
          [newExercise.lastInsertRowId, set.set_order, set.reps, set.weight],
        );
      }
    }
  });
};
