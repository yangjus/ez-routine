import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

export interface Workout {
  id: number;
  day_id: number;
  name: string;
}

const useWorkouts = (dayId: number) => {
  const db = useSQLiteContext();
  return useQuery({
    queryKey: ['workouts', dayId],
    queryFn: async () => {
      return await db.getAllAsync<Workout>(`
        SELECT w.id, w.name
        FROM workouts w
        JOIN days d ON d.id = w.day_id
        WHERE d.id = ?
        ORDER BY w.created_at DESC
      `, [dayId]);
    }
  })
}

export default useWorkouts;