import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

export interface Set {
  id?: number;
  exercise_id?: number;
  set_order: number;
  reps: number;
  weight: number;
  completed?: boolean;
}

export interface Exercise {
  id?: number;
  name: string;
  exercise_order: number;
  rep_min: number,
  rep_max: number,
  sets: Set[];
}

export interface Workout {
  id?: number;
  name: string;
  duration?: number;
  notes?: string;
  exercises: Exercise[];
}

const useWorkouts = (dayId: number) => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: ['workouts', dayId],
    queryFn: async () => {
      return await db.getAllAsync<Workout>(`
        SELECT w.*
        FROM workouts w
        JOIN workout_days wd ON w.id = wd.workout_id
        JOIN days d ON d.id = wd.day_id
        WHERE d.id = ?
      `, [dayId]);
    }
  })
}

export const useExercises = (workoutId: number) => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: ['workout', workoutId],
    queryFn: async () => {
      return await db.getAllAsync<Exercise>(`
        SELECT e.*
        FROM workouts w
        LEFT JOIN exercises e ON w.id = e.workout_id
        WHERE w.id = ?
        ORDER BY e.exercise_order
      `, [workoutId]);
    }
  })
}

export const useSets = (exerciseId: number) => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: ['sets', exerciseId],
    queryFn: async () => {
      const sets = await db.getAllAsync<Set>(`
        SELECT s.*
        FROM exercises e
        LEFT JOIN sets s ON e.id = s.exercise_id
        WHERE e.id = ?
        ORDER BY s.set_order
      `, [exerciseId]);
      return sets.sort((a, b) => a.set_order - b.set_order)
        .map(set => ({
          id: (set.id ?? 1).toString(),
          reps: set.reps,
          weight: set.weight,
        }))
    }
  })
}

export default useWorkouts;