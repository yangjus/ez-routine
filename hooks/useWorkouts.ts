import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

import {
  getAllWorkouts,
  getExercisesByWorkoutId,
  getSetsByExerciseId,
  getWorkoutsByDay,
  workoutKeys,
} from "@/db/queries/workouts";
export type { Exercise, Set, Workout } from "@/db/types";

export const useAllWorkouts = () => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: workoutKeys.all,
    queryFn: () => getAllWorkouts(db),
  });
};

const useWorkouts = (dayId: number) => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: workoutKeys.byDay(dayId),
    queryFn: () => getWorkoutsByDay(db, dayId),
  });
};

export const useExercises = (workoutId: number) => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: workoutKeys.exercises(workoutId),
    queryFn: () => getExercisesByWorkoutId(db, workoutId),
  });
};

export const useSets = (exerciseId: number) => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: workoutKeys.sets(exerciseId),
    queryFn: () => getSetsByExerciseId(db, exerciseId),
  });
};

export default useWorkouts;
