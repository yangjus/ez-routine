import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Workout } from "./useWorkouts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addWorkoutWithExercises = async (db: SQLiteDatabase, w: Workout) => {
  try {
    const new_workout = await db.runAsync(`
        INSERT INTO workouts (day_id, name, duration, notes, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `, [w.day_id, w.name, w.duration ?? null, w.notes ?? null]);
    const workout_id = new_workout.lastInsertRowId;
    console.log(workout_id);
    // const statement = await db.prepareAsync(`
    //   INSERT INTO exercises (workout_id, name, exercise_order)
    //   VALUES ($workout_id, $name, $exercise_order)
    // `);
    const placeholders = w.exercises.map((_, index) =>
      `($workout_id_${index}, $name_${index}, $exercise_order_${index})`
    ).join(', ');
    const query = `
        INSERT INTO exercises (workout_id, name, exercise_order)
        VALUES ${placeholders}
      `;
    const params = w.exercises.reduce((acc, e, index) => ({
      ...acc,
      [`$workout_id_${index}`]: workout_id,
      [`$name_${index}`]: e.name,
      [`$exercise_order_${index}`]: e.exercise_order,
    }), {});
    const result = await db.runAsync(query, params);
    console.log(result);
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
    mutationFn: (w: Workout) => addWorkoutWithExercises(db, w),
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