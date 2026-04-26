export interface Set {
  id: number;
  exercise_id: number;
  set_order: number;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: number;
  workout_id: number;
  name: string;
  exercise_order: number;
  rep_min: number;
  rep_max: number;
}

export interface Workout {
  id: number;
  name: string;
  duration?: number;
  notes?: string;
}

export interface WorkoutWithExercises extends Workout {
  exercises: ExerciseWithSets[];
}

export interface ExerciseWithSets extends Exercise {
  sets: Set[];
}

export type NewSet = Omit<Set, "id" | "exercise_id">;

export type NewExercise = Omit<Exercise, "id" | "workout_id" | "sets"> & {
  sets: NewSet[];
};

export type NewWorkout = Omit<Workout, "id"> & {
  exercises: NewExercise[];
};
