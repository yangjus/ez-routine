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
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import ThemedButton from "@/components/ThemedButton";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

interface Exercise {
  name: string;
  exercise_order: number;
}

interface Workout {
  day_id: number;
  name: string;
  duration?: number;
  notes?: string;
  exercises: Exercise[];
}

export const addWorkoutWithExercises = async (db: SQLiteDatabase, w: Workout) => {
  try {
    const new_workout = await db.runAsync(`
        INSERT INTO workouts (day_id, name, duration, notes, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `, [w.day_id, w.name, w.duration ?? null, w.notes ?? null]);
    const workout_id = new_workout.lastInsertRowId;
    console.log(workout_id);
    // const statement = await db.prepareAsync(`
    //   INSERT INTO exercises (workout_id, name, exercise_order)
    //   VALUES ($workout_id, $name, $exercise_order)
    // `);
    const placeholders = w.exercises.map((_, index) =>
      `($workout_id_${index}, $name_${index}, $exercise_order_${index})`
    ).join(', ');
    const query = `
        INSERT INTO exercises (workout_id, name, exercise_order)
        VALUES ${placeholders}
      `;
    const params = w.exercises.reduce((acc, e, index) => ({
      ...acc,
      [`$workout_id_${index}`]: workout_id,
      [`$name_${index}`]: e.name,
      [`$exercise_order_${index}`]: e.exercise_order,
    }), {});
    const result = await db.runAsync(query, params);
    console.log(result);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occured'
    };
  }
};

const newWorkout: Workout = {
  day_id: 1, // The ID of the day this workout belongs to
  name: 'Pull Day',
  exercises: [
    { name: 'Squats', exercise_order: 1 },
    { name: 'Push-ups', exercise_order: 2 },
    { name: 'Deadlifts', exercise_order: 3 },
  ],
};

export default function AddWorkout() {
  const db = useSQLiteContext();
  const [data, setData] = useState<dataProps[]>([]);
  const [name, onChangeName] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const addWorkout = async () => {
    const result = await addWorkoutWithExercises(db, newWorkout);
    if (result.success) {
      alert('Workout and exercises added successfully');
      // You might want to update your UI or state here
    } else {
      alert(`Failed to add workout: ${result.error}`);
      // Handle the error, maybe show an alert to the user
    }
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
    gap: 20,
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
});
