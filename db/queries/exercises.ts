import { SQLiteDatabase } from "expo-sqlite";

import { Exercise, ExerciseWithSets, NewExercise } from "../types";

export const getNextExerciseOrder = async (
  db: SQLiteDatabase,
  workoutId: number,
) => {
  const row = await db.getFirstAsync<{ next_order: number }>(
    `
      SELECT COALESCE(MAX(exercise_order), 0) + 1 AS next_order
      FROM exercises
      WHERE workout_id = ?
    `,
    [workoutId],
  );

  return row?.next_order ?? 1;
};

export const getExerciseById = async (
  db: SQLiteDatabase,
  exerciseId: number,
) => {
  return db.getFirstAsync<Exercise>(
    `
      SELECT *
      FROM exercises
      WHERE id = ?
    `,
    [exerciseId],
  );
};

export const getExerciseWithSets = async (
  db: SQLiteDatabase,
  exerciseId: number,
) => {
  const exercise = await getExerciseById(db, exerciseId);

  if (!exercise) {
    return null;
  }

  const sets = await db.getAllAsync<ExerciseWithSets["sets"][number]>(
    `
      SELECT *
      FROM sets
      WHERE exercise_id = ?
      ORDER BY set_order
    `,
    [exerciseId],
  );

  return { ...exercise, sets } satisfies ExerciseWithSets;
};

export const insertExerciseWithSets = async (
  db: SQLiteDatabase,
  workoutId: number,
  exercise: NewExercise,
) => {
  await db.withTransactionAsync(async () => {
    const order =
      exercise.exercise_order || (await getNextExerciseOrder(db, workoutId));

    const newExercise = await db.runAsync(
      `
        INSERT INTO exercises (workout_id, name, exercise_order, rep_min, rep_max)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        workoutId,
        exercise.name,
        order,
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
  });
};

export const updateExerciseWithSets = async (
  db: SQLiteDatabase,
  exerciseId: number,
  exercise: NewExercise,
) => {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
        UPDATE exercises
        SET name = ?, rep_min = ?, rep_max = ?
        WHERE id = ?
      `,
      [exercise.name, exercise.rep_min, exercise.rep_max, exerciseId],
    );

    await db.runAsync(
      `
        DELETE FROM sets
        WHERE exercise_id = ?
      `,
      [exerciseId],
    );

    for (const set of exercise.sets) {
      await db.runAsync(
        `
          INSERT INTO sets (exercise_id, set_order, reps, weight)
          VALUES (?, ?, ?, ?)
        `,
        [exerciseId, set.set_order, set.reps, set.weight],
      );
    }
  });
};

export const deleteExerciseWithSets = async (
  db: SQLiteDatabase,
  exerciseId: number,
) => {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
        DELETE FROM sets
        WHERE exercise_id = ?
      `,
      [exerciseId],
    );

    await db.runAsync(
      `
        DELETE FROM exercises
        WHERE id = ?
      `,
      [exerciseId],
    );
  });
};

export const reorderExercises = async (
  db: SQLiteDatabase,
  exerciseIds: number[],
) => {
  await db.withTransactionAsync(async () => {
    for (const [index, exerciseId] of exerciseIds.entries()) {
      await db.runAsync(
        `
          UPDATE exercises
          SET exercise_order = ?
          WHERE id = ?
        `,
        [index + 1, exerciseId],
      );
    }
  });
};
