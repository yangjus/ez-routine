import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { workoutKeys } from "@/db/queries/workouts";

const useClearAll = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await db.withTransactionAsync(async () => {
        await db.execAsync(`
          DELETE FROM sets;
          DELETE FROM exercises;
          DELETE FROM workout_days;
          DELETE FROM workouts;
          DELETE FROM sqlite_sequence 
            WHERE name IN ('sets', 'exercises', 'workouts', 'workout_days');
        `);
      });
      await db.execAsync("VACUUM");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.all,
      });
      alert('Successfully cleared all data.');
    },
    onError: (error) => {
      alert(`Error: ${error}`);
    },
  });
};

export default useClearAll;
