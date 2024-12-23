import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import { dataProps } from "@/data/placeholders";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SwipeItem from "@/components/SwipeableItem";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import React, { useState } from "react";
import {
  Link,
  useNavigation,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import ThemedButton from "@/components/ThemedButton";
import { useSQLiteContext } from "expo-sqlite";
import useAddWorkout from "@/hooks/useAddWorkout";
import { Workout } from "@/hooks/useWorkouts";
import { FlatList } from "react-native-gesture-handler";

const selectDays = [
  { id: 1, label: "Mon" },
  { id: 2, label: "Tues" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thurs" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
  { id: 7, label: "Sun" },
];

type InputWorkout = Omit<Workout, 'id'>;

const newWorkout: InputWorkout = {
  name: 'Pull Day',
  exercises: [
    {
      name: 'Lat Pulldown',
      exercise_order: 1,
      rep_min: 8,
      rep_max: 12,
      sets: [
        { set_order: 1, reps: 10, weight: 80 },
        { set_order: 2, reps: 12, weight: 80 },
        { set_order: 3, reps: 12, weight: 80 },
      ],
    },
    {
      name: 'Cable Row',
      exercise_order: 2,
      rep_min: 10,
      rep_max: 15,
      sets: [
        { set_order: 1, reps: 15, weight: 60 },
        { set_order: 2, reps: 10, weight: 70 },
        { set_order: 3, reps: 10, weight: 80 },
      ],
    },
    {
      name: 'Rear Delt Flys',
      exercise_order: 3,
      rep_min: 10,
      rep_max: 15,
      sets: [
        { set_order: 1, reps: 13, weight: 80 },
        { set_order: 2, reps: 13, weight: 80 },
        { set_order: 3, reps: 12, weight: 100 },
      ],
    },
    {
      name: 'Upright Row',
      exercise_order: 4,
      rep_min: 8,
      rep_max: 12,
      sets: [
        { set_order: 1, reps: 8, weight: 50 },
        { set_order: 2, reps: 10, weight: 50 },
        { set_order: 3, reps: 10, weight: 50 },
      ],
    },
  ],
};

export default function AddWorkout() {
  const db = useSQLiteContext();
  const [data, setData] = useState<dataProps[]>([]);
  const [name, onChangeName] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const addWorkoutMutation = useAddWorkout();
  const navigation = useNavigation();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const addWorkout = async () => {
    addWorkoutMutation.mutateAsync({ w: newWorkout, days: [1, 2] });
    navigation.goBack();
  };

  const onDelete = async () => {
    console.log("delete");
  }

  const renderItem = (params: RenderItemParams<dataProps>) => {
    return (
      <ScaleDecorator>
        <SwipeItem props={params} onDelete={onDelete} />
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <TextInput
            style={[styles.input, isFocused && { borderWidth: 2, borderColor: '#378CFD' }]}
            onChangeText={onChangeName}
            value={name}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            placeholder="Workout name..."
          />
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
      <Text>Assign Days</Text>
      <FlatList
        data={selectDays}
        renderItem={({ item }) =>
          <Pressable
            style={[styles.button, selectedDays.includes(item.id) && styles.selectedButton]}
            onPress={() => setSelectedDays((prevDays) =>
              prevDays.includes(item.id)
                ? prevDays.filter(id => id !== item.id)
                : [...prevDays, item.id]
            )}
          >
            <Text style={[styles.buttonText, selectedDays.includes(item.id) && styles.selectedButtonText]}>{item.label}</Text>
          </Pressable>
        }
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ height: 40, gap: 10 }}
      />
      <View style={styles.mainContainer}>
        {data && data.length > 0 ?
          <DraggableFlatList
            data={data ?? []}
            renderItem={renderItem}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            activationDistance={20}
          /> : <EmptyContainer />
        }
      </View>
      <View style={styles.footerContainer}>
        <ThemedButton content={"Create Workout"} onPress={addWorkout} />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </SafeAreaView>
  );
}

const EmptyContainer = () => {
  return (
    <View>
      <Text>No exercises added. Press + icon on top right to add exercises.</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 24,
    borderColor: '#D3D3D3',
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    gap: 20,
  },
  textContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "flex-start",
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  addButton: {
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  footerContainer: {
    marginVertical: 4,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  buttonText: {
    color: '#fff'
  },
  selectedButton: {
    backgroundColor: 'lightgray',
  },
  selectedButtonText: {
    color: 'black',
  },
  warningButton: {
    backgroundColor: "#DC143C",
  },
  warningButtonText: {
    color: "white",
  },
});
