import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Workout } from "./useWorkouts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addWorkoutWithExercises = async (db: SQLiteDatabase, w: Workout, days: number[]) => {
  try {
    console.log('workout to insert: ', w);
    const new_workout = await db.runAsync(`
        INSERT INTO workouts (name, duration, notes, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `, [w.name, w.duration ?? null, w.notes ?? null]);
    const workout_id = new_workout.lastInsertRowId;
    console.log(workout_id);

    for (const day_id of days) {
      await db.runAsync(`
        INSERT INTO workout_days (workout_id, day_id)
        VALUES (?, ?)
      `, [workout_id, day_id]);
    }

    if (w.exercises && Array.isArray(w.exercises)) {
      for (const exercise of w.exercises) {
        const new_exercise = await db.runAsync(`
          INSERT INTO exercises (workout_id, name, exercise_order, rep_min, rep_max)
          VALUES (?, ?, ?, ?, ?)
        `, [workout_id, exercise.name, exercise.exercise_order, exercise.rep_min, exercise.rep_max]);
        const exerciseId = new_exercise.lastInsertRowId;
        console.log('exerciseId: ', exerciseId);
        if (exercise.sets && Array.isArray(exercise.sets)) {
          for (const set of exercise.sets) {
            console.log(set);
            await db.runAsync(`
              INSERT INTO sets (exercise_id, set_order, reps, weight)
              VALUES (?, ?, ?, ?)
            `, [exerciseId, set.set_order, set.reps, set.weight]);
          }
        }
      }
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occured'
    };
  }
};

const useAddWorkout = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ w, days }: { w: Workout; days: number[] }) => addWorkoutWithExercises(db, w, days),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workouts'],
      });
      alert('Workout and exercises added successfully.');
    },
    onError: (error) => {
      alert(`Error: ${error}`);
    },
  });
};

export default useAddWorkout;