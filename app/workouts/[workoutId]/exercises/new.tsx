import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { NewExercise } from "@/db/types";
import { useAddExercise } from "@/hooks/useExerciseMutations";
import Modal, { modalProps, weightProps } from "@/components/ExerciseModal";

export const initialInput: modalProps = {
  text: "",
  repRange: [1, 20],
  numSets: 0,
  weights: [],
};

export default function AddExercise() {
  const { workoutId } = useLocalSearchParams();
  const parsedWorkoutId = Number(workoutId);
  const addExercise = useAddExercise(parsedWorkoutId);

  const addExerciseToDatabase = async ({
    text,
    repRange,
    numSets,
    weights,
  }: modalProps) => {
    const newExercise: NewExercise = {
      name: text!,
      exercise_order: 0,
      rep_min: repRange![0],
      rep_max: repRange![1],
      sets: weights!.slice(0, numSets).map((item: weightProps, index: number) => ({
        set_order: index + 1,
        weight: Number(item.weight),
        reps: Number(item.reps),
      })),
    };
    await addExercise.mutateAsync(newExercise);
  };

  if (!Number.isFinite(parsedWorkoutId)) {
    return <Text>Missing workout.</Text>;
  }

  return (
    <Modal
      props={initialInput}
      func={addExerciseToDatabase}
      onPressAlertContent="Added"
      onPressButtonContent="Add"
      resetOnPress={true}
    />
  );
}
