import { useSQLiteContext } from "expo-sqlite";
import { NewWorkout } from "@/db/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  insertWorkoutWithExercises,
  workoutKeys,
} from "@/db/queries/workouts";

const useAddWorkout = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ w, days }: { w: NewWorkout; days: number[] }) =>
      insertWorkoutWithExercises(db, w, days),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.all,
      });
      alert('Workout and exercises added successfully.');
    },
    onError: (error) => {
      alert(`Error: ${error}`);
    },
  });
};

export default useAddWorkout;
