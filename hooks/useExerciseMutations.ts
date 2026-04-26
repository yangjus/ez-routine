import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

import {
  deleteExerciseWithSets,
  getExerciseWithSets,
  insertExerciseWithSets,
  reorderExercises,
  updateExerciseWithSets,
} from "@/db/queries/exercises";
import { workoutKeys } from "@/db/queries/workouts";
import { Exercise, NewExercise } from "@/db/types";

export const exerciseKeys = {
  detail: (exerciseId: number) => ["exercises", exerciseId] as const,
};

export const useExercise = (exerciseId: number) => {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: exerciseKeys.detail(exerciseId),
    queryFn: () => getExerciseWithSets(db, exerciseId),
    enabled: Number.isFinite(exerciseId),
  });
};

export const useAddExercise = (workoutId: number) => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exercise: NewExercise) =>
      insertExerciseWithSets(db, workoutId, exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(workoutId),
      });
    },
  });
};

export const useEditExercise = (workoutId: number, exerciseId: number) => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exercise: NewExercise) =>
      updateExerciseWithSets(db, exerciseId, exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exerciseKeys.detail(exerciseId),
      });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(workoutId),
      });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.sets(exerciseId),
      });
    },
  });
};

export const useDeleteExercise = (workoutId: number) => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: number) => deleteExerciseWithSets(db, exerciseId),
    onMutate: async (exerciseId) => {
      await queryClient.cancelQueries({
        queryKey: workoutKeys.exercises(workoutId),
      });

      const previousExercises = queryClient.getQueryData<Exercise[]>(
        workoutKeys.exercises(workoutId),
      );

      queryClient.setQueryData<Exercise[]>(
        workoutKeys.exercises(workoutId),
        (current = []) =>
          current.filter((exercise) => exercise.id !== exerciseId),
      );

      return { previousExercises };
    },
    onError: (_error, _exerciseId, context) => {
      queryClient.setQueryData(
        workoutKeys.exercises(workoutId),
        context?.previousExercises,
      );
    },
    onSettled: (_data, _error, exerciseId) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(workoutId),
      });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.sets(exerciseId),
      });
      queryClient.removeQueries({
        queryKey: exerciseKeys.detail(exerciseId),
      });
    },
  });
};

export const useReorderExercises = (workoutId: number) => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseIds: number[]) => reorderExercises(db, exerciseIds),
    onMutate: async (exerciseIds) => {
      await queryClient.cancelQueries({
        queryKey: workoutKeys.exercises(workoutId),
      });

      const previousExercises = queryClient.getQueryData<Exercise[]>(
        workoutKeys.exercises(workoutId),
      );

      queryClient.setQueryData<Exercise[]>(
        workoutKeys.exercises(workoutId),
        (current = []) => {
          const orderById = new Map(
            exerciseIds.map((exerciseId, index) => [exerciseId, index + 1]),
          );

          return [...current]
            .map((exercise) => ({
              ...exercise,
              exercise_order:
                orderById.get(exercise.id) ?? exercise.exercise_order,
            }))
            .sort((a, b) => a.exercise_order - b.exercise_order);
        },
      );

      return { previousExercises };
    },
    onError: (_error, _exerciseIds, context) => {
      queryClient.setQueryData(
        workoutKeys.exercises(workoutId),
        context?.previousExercises,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.exercises(workoutId),
      });
    },
  });
};
