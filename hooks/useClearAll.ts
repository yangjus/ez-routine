import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite"

const useClearAll = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await db.execAsync(`
        BEGIN TRANSACTION;
        DELETE FROM sets;
        DELETE FROM exercises;
        DELETE FROM workouts;
        DELETE FROM workout_days;
        DELETE FROM sqlite_sequence 
          WHERE name IN ('sets', 'exercises', 'workouts', 'workout_days');
        COMMIT;
        VACUUM;
      `);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workouts'],
      });
      alert('Successfully cleared all data.');
    },
    onError: (error) => {
      alert(`Error: ${error}`);
    },
  });
};

export default useClearAll;