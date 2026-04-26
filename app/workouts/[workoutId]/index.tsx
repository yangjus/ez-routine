import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { dataProps } from "@/data/placeholders";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SwipeItem from "@/components/SwipeableItem";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useEffect, useMemo } from "react";
import {
  Link,
  UnknownOutputParams,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import ThemedButton from "@/components/ThemedButton";
import { useExercises } from "@/hooks/useWorkouts";
import {
  useDeleteExercise,
  useReorderExercises,
} from "@/hooks/useExerciseMutations";

export default function Routine() {
  const navigation = useNavigation();
  const props: UnknownOutputParams = useLocalSearchParams();
  const { dayOfWeek, workoutId } = props;
  const parsedWorkoutId = Number(workoutId);
  const workoutIdParam = String(workoutId);
  const { data: exercises } = useExercises(parsedWorkoutId);
  const deleteExercise = useDeleteExercise(parsedWorkoutId);
  const reorderExercises = useReorderExercises(parsedWorkoutId);

  const data: dataProps[] = useMemo(() => {
    return [...(exercises ?? [])]
      .sort((a, b) => a.exercise_order - b.exercise_order)
      .map(exercise => ({
        id: exercise.id.toString(),
        title: exercise.name,
        repRange: [exercise.rep_min, exercise.rep_max],
        sets: 0,
        content: [],
      }));
  }, [exercises]);

  const deleteItemFromDatabase = async (id: string) => {
    await deleteExercise.mutateAsync(Number(id));
  };

  const reorderItemsInDatabase = async (items: dataProps[]) => {
    await reorderExercises.mutateAsync(items.map((item) => Number(item.id)));
  };

  const onPress = async () => {
    // remove all green checkmarks
    alert("You have finished your workout!");
  };

  useEffect(() => {
    navigation.setOptions({
      title: `${dayOfWeek} Routine`,
      headerShown: true,
    });
  }, [dayOfWeek, navigation]);

  const renderItem = (params: RenderItemParams<dataProps>) => {
    return (
      <ScaleDecorator>
        <SwipeItem
          props={params}
          onDelete={deleteItemFromDatabase}
          workoutId={parsedWorkoutId}
        />
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>Pull Day</Text>
          <Text>Estimated Time: 65 minutes</Text>
        </View>
        <View style={styles.addButton}>
          <Link
            href={{
              pathname: "/workouts/[workoutId]/exercises/new",
              params: { workoutId: workoutIdParam },
            }}
            asChild
          >
            <Pressable
              hitSlop={20}
              children={({ pressed }) => (
                <MaterialIcons
                  name="add-circle"
                  size={30}
                  color={pressed ? "gray" : "black"}
                />
              )}
            />
          </Link>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <DraggableFlatList
          data={data}
          renderItem={renderItem}
          onDragEnd={({ data }) => reorderItemsInDatabase(data)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          activationDistance={20}
        />
      </View>
      <View style={styles.footerContainer}>
        <ThemedButton content={"Finish Workout"} onPress={onPress} />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  textContainer: {
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  addButton: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  footerContainer: {
    marginVertical: 4,
  },
});
