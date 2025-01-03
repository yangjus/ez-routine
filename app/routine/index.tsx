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
import { useState, useEffect } from "react";
import {
  Link,
  UnknownOutputParams,
  useLocalSearchParams,
  useNavigation,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import ThemedButton from "@/components/ThemedButton";
import { useExercises } from "@/hooks/useWorkouts";

export default function Routine() {
  const navigation = useNavigation();
  const props: UnknownOutputParams = useLocalSearchParams();
  const { dayOfWeek, workoutId } = props;
  const [data, setData] = useState<dataProps[]>();
  const segments = useSegments();
  const { data: exercises } = useExercises(parseInt(workoutId as string));
  console.log(workoutId);

  const readItemFromStorage = () => {
    console.log('real exercises: ', exercises);
    const item = exercises?.sort((a, b) => a.exercise_order - b.exercise_order)
      .map(exercise => ({
        id: (exercise.id ?? 1).toString(),
        title: exercise.name,
        repRange: [exercise.rep_min, exercise.rep_max],
      }));
    setData(item);
  };

  const deleteItemFromStorage = async (id: string) => {
    const newItem = data?.filter((item) => item.id !== id);
    // await setItem(JSON.stringify(newItem));
    setData(newItem);
  };

  const onPress = async () => {
    // remove all green checkmarks
    alert("You have finished your workout!");
  };

  useEffect(() => {
    console.log("day of week: ", dayOfWeek);
    console.log("data rendered/changed");
  }, [data]);

  useEffect(() => {
    navigation.setOptions({
      title: `${dayOfWeek} Routine`,
      headerShown: true,
    });
    readItemFromStorage();
    console.log("open new tab");
  }, [segments]);

  const renderItem = (params: RenderItemParams<dataProps>) => {
    return (
      <ScaleDecorator>
        <SwipeItem props={params} onDelete={deleteItemFromStorage} />
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
          <Link href="/routine/add-exercise" asChild>
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
          data={data ?? []}
          renderItem={renderItem}
          onDragEnd={({ data }) => setData(data)}
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
