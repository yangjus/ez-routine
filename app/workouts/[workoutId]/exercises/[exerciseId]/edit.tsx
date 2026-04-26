import Modal, {
  modalProps,
  weightProps,
} from "@/components/ExerciseModal";
import { UnknownOutputParams, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { NewExercise } from "@/db/types";
import { useEditExercise, useExercise } from "@/hooks/useExerciseMutations";

export default function EditExercise() {
  const props: UnknownOutputParams = useLocalSearchParams();
  const exerciseId = Number(props.exerciseId);
  const { data: exercise, isLoading } = useExercise(exerciseId);
  const workoutId = Number(props.workoutId ?? exercise?.workout_id);
  const editExercise = useEditExercise(workoutId, exerciseId);

  const editExerciseInDatabase = async ({
    text,
    repRange,
    numSets,
    weights,
  }: modalProps) => {
    const updatedExercise: NewExercise = {
      name: text!,
      exercise_order: exercise!.exercise_order,
      rep_min: repRange![0],
      rep_max: repRange![1],
      sets: weights!.slice(0, numSets).map((item: weightProps, index: number) => ({
        set_order: index + 1,
        weight: Number(item.weight),
        reps: Number(item.reps),
      })),
    };
    await editExercise.mutateAsync(updatedExercise);
  };

  //TODO: Handle loading of data better (better styling)
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!exercise) {
    return <Text>Exercise not found.</Text>;
  }

  const weights: weightProps[] = exercise.sets.map((set) => ({
    id: set.id.toString(),
    weight: String(set.weight),
    reps: String(set.reps),
  }));

  return (
    <Modal
      props={{
        text: exercise.name,
        repRange: [exercise.rep_min, exercise.rep_max],
        numSets: exercise.sets.length,
        weights,
      }}
      func={editExerciseInDatabase}
      onPressAlertContent="Edited"
      onPressButtonContent="Edit"
      resetOnPress={false}
    />
  );
}
